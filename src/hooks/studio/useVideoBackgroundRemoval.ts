"use client";

import { useCallback, useRef, useState } from "react";

import type { Asset, Clip } from "@/lib/studio/types";
import {
  createAssetFromFile,
  createClipFromAsset,
} from "@/lib/studio/utils";

interface UseVideoBackgroundRemovalOptions {
  assets: Asset[];
  selectedClip: Clip | null;
  onAssetCreated?: (asset: Asset) => void;
  onClipCreated?: (clip: Clip) => void;
}

interface UseVideoBackgroundRemovalResult {
  removingBackground: boolean;
  progress: number;
  error: string | null;
  removeSelectedBackground: () => Promise<void>;
  cancelRemoval: () => void;
}

type SegmentationInstance = InstanceType<
  (typeof import("@mediapipe/selfie_segmentation"))["SelfieSegmentation"]
>;

type VideoWithFrameCallbacks = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: { mediaTime: number }) => void,
  ) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

type CanvasCaptureTrack = MediaStreamTrack & {
  requestFrame?: () => void;
};

function getVideoAsset(assets: Asset[], clip: Clip): Asset | undefined {
  return assets.find((asset) => asset.id === clip.assetId);
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (reason: unknown) => {
        window.clearTimeout(timer);
        reject(reason);
      },
    );
  });
}

function waitForMetadata(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) return Promise.resolve();

  return withTimeout(
    new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener("loadedmetadata", loaded);
        video.removeEventListener("error", failed);
      };
      const loaded = () => {
        cleanup();
        resolve();
      };
      const failed = () => {
        cleanup();
        reject(new Error("The source video could not be loaded."));
      };
      video.addEventListener("loadedmetadata", loaded, { once: true });
      video.addEventListener("error", failed, { once: true });
    }),
    20000,
    "Timed out while reading the source video's metadata.",
  );
}

function waitForFrame(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();

  return withTimeout(
    new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener("loadeddata", loaded);
        video.removeEventListener("error", failed);
      };
      const loaded = () => {
        cleanup();
        resolve();
      };
      const failed = () => {
        cleanup();
        reject(new Error("The first frame of the source video could not be decoded."));
      };
      video.addEventListener("loadeddata", loaded, { once: true });
      video.addEventListener("error", failed, { once: true });
    }),
    20000,
    "Timed out while decoding the first video frame.",
  );
}

function chooseRecorderMimeType(): string {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const candidate of candidates) {
    if (MediaRecorder.isTypeSupported(candidate)) return candidate;
  }
  return "";
}

function waitForSeek(video: HTMLVideoElement, target: number): Promise<void> {
  if (Math.abs(video.currentTime - target) < 0.001 && !video.seeking) {
    return Promise.resolve();
  }

  return withTimeout(
    new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener("seeked", seeked);
        video.removeEventListener("error", failed);
      };
      const seeked = () => {
        cleanup();
        resolve();
      };
      const failed = () => {
        cleanup();
        reject(new Error("The source video failed while seeking to a frame."));
      };
      video.addEventListener("seeked", seeked, { once: true });
      video.addEventListener("error", failed, { once: true });
      video.currentTime = target;
    }),
    15000,
    "Timed out while seeking through the source video.",
  );
}


/**
 * MediaRecorder WebM files may report Infinity/NaN for duration immediately
 * after loadedmetadata because the container has no finalized duration field.
 * Seeking to the end lets Chromium parse the final cluster and expose a real
 * duration before we decide whether the export is incomplete.
 */
async function measureRecordedVideoDuration(file: File): Promise<number> {
  const url = URL.createObjectURL(file);
  const checkVideo = document.createElement("video");
  checkVideo.preload = "metadata";
  checkVideo.muted = true;
  checkVideo.src = url;

  try {
    await waitForMetadata(checkVideo);

    if (Number.isFinite(checkVideo.duration) && checkVideo.duration > 0) {
      return checkVideo.duration;
    }

    // Chromium often reports Infinity for a MediaRecorder-generated WebM until
    // it has performed a seek. Listen before assigning currentTime to avoid
    // missing a fast seeked event.
    const measured = await withTimeout(
      new Promise<number>((resolve, reject) => {
        const cleanup = () => {
          checkVideo.removeEventListener("seeked", onSeeked);
          checkVideo.removeEventListener("timeupdate", onTimeUpdate);
          checkVideo.removeEventListener("error", onError);
        };
        const tryResolve = () => {
          const duration = checkVideo.duration;
          if (Number.isFinite(duration) && duration > 0) {
            cleanup();
            resolve(duration);
          }
        };
        const onSeeked = () => tryResolve();
        const onTimeUpdate = () => tryResolve();
        const onError = () => {
          cleanup();
          reject(new Error("The browser could not inspect the processed WebM duration."));
        };

        checkVideo.addEventListener("seeked", onSeeked);
        checkVideo.addEventListener("timeupdate", onTimeUpdate);
        checkVideo.addEventListener("error", onError);
        try {
          checkVideo.currentTime = 1e10;
        } catch (seekError) {
          cleanup();
          reject(seekError);
        }
      }),
      10000,
      "The browser could not determine the processed WebM duration.",
    );
    return measured;
  } finally {
    checkVideo.pause();
    checkVideo.removeAttribute("src");
    checkVideo.load();
    URL.revokeObjectURL(url);
  }
}

export function useVideoBackgroundRemoval({
  assets,
  selectedClip,
  onAssetCreated,
  onClipCreated,
}: UseVideoBackgroundRemovalOptions): UseVideoBackgroundRemovalResult {
  const [removingBackground, setRemovingBackground] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runningRef = useRef(false);
  const cancelledRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const cancelRemoval = useCallback(() => {
    if (!runningRef.current) return;
    cancelledRef.current = true;
    videoRef.current?.pause();
    cancelRef.current?.();
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // Recorder may already be stopping.
      }
    }
  }, []);

  const removeSelectedBackground = useCallback(async () => {
    if (runningRef.current) return;

    if (!selectedClip || selectedClip.kind !== "video") {
      setError("Select a video clip before removing its background.");
      return;
    }

    const sourceAsset = getVideoAsset(assets, selectedClip);
    const sourceFile = selectedClip.file ?? sourceAsset?.file;
    if (!sourceFile) {
      setError("The original video file is unavailable. Import it again and retry.");
      return;
    }

    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      typeof MediaRecorder === "undefined"
    ) {
      setError("Your browser does not support video background removal.");
      return;
    }

    runningRef.current = true;
    cancelledRef.current = false;
    setRemovingBackground(true);
    setProgress(0);
    setError(null);

    let video: VideoWithFrameCallbacks | null = null;
    let segmentation: SegmentationInstance | null = null;
    let objectUrl: string | null = null;
    let audioContext: AudioContext | null = null;
    let audioDestinationStream: MediaStream | null = null;
    let outputStream: MediaStream | null = null;
    let frameCallbackId: number | null = null;
    let animationFrameId: number | null = null;
    let progressTimer: number | null = null;
    let playbackReject: ((reason?: unknown) => void) | null = null;
    let recorderStopPromise: Promise<File> | null = null;
    let recordingChunks: BlobPart[] = [];

    try {
      const module = await import("@mediapipe/selfie_segmentation");
      if (cancelledRef.current) return;

      segmentation = new module.SelfieSegmentation({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });
      await segmentation.setOptions({ modelSelection: 1 });

      video = document.createElement("video") as VideoWithFrameCallbacks;
      videoRef.current = video;
      video.preload = "auto";
      video.playsInline = true;
      video.muted = false;
      video.volume = 1;
      video.crossOrigin = "anonymous";
      objectUrl = URL.createObjectURL(sourceFile);
      video.src = objectUrl;
      video.load();

      await waitForMetadata(video);
      await waitForFrame(video);
      if (cancelledRef.current) return;

      const sourceDuration = video.duration;
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!Number.isFinite(sourceDuration) || sourceDuration <= 0) {
        throw new Error("The source video duration could not be determined.");
      }
      if (!width || !height) {
        throw new Error("The source video has invalid frame dimensions.");
      }

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = width;
      frameCanvas.height = height;
      const frameContext = frameCanvas.getContext("2d", { alpha: false });
      if (!frameContext) throw new Error("Could not initialize the source frame canvas.");

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;
      const outputContext = outputCanvas.getContext("2d", { alpha: true });
      if (!outputContext) throw new Error("Could not initialize the output canvas.");

      if (typeof outputCanvas.captureStream !== "function") {
        throw new Error("Canvas video capture is not supported in this browser.");
      }

      // Manual frame capture means each output frame is requested only after
      // MediaPipe has produced the corresponding mask.
      outputStream = outputCanvas.captureStream(0);
      const canvasTrack = outputStream.getVideoTracks()[0] as CanvasCaptureTrack | undefined;
      if (!canvasTrack || typeof canvasTrack.requestFrame !== "function") {
        throw new Error("Manual canvas frame capture is unavailable. Update Chrome or Edge and retry.");
      }

      // Capture audio from the same source media element so the audio clock
      // remains tied to the source video timeline.
      const AudioContextCtor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (AudioContextCtor) {
        try {
          audioContext = new AudioContextCtor();
          const sourceNode = audioContext.createMediaElementSource(video);
          const destination = audioContext.createMediaStreamDestination();
          sourceNode.connect(destination);
          audioDestinationStream = destination.stream;
          for (const track of audioDestinationStream.getAudioTracks()) {
            outputStream.addTrack(track);
          }
          await audioContext.resume();
        } catch (audioError) {
          console.warn("Could not capture source audio; continuing with video only.", audioError);
          if (audioContext && audioContext.state !== "closed") {
            await audioContext.close().catch(() => undefined);
          }
          audioContext = null;
          audioDestinationStream?.getTracks().forEach((track) => track.stop());
          audioDestinationStream = null;
        }
      }

      let latestFrameReady = false;
      let maskWaitResolve: (() => void) | null = null;
      let maskWaitReject: ((reason?: unknown) => void) | null = null;

      segmentation.onResults((results) => {
        if (cancelledRef.current) return;
        try {
          outputContext.clearRect(0, 0, width, height);
          outputContext.globalCompositeOperation = "source-over";
          outputContext.drawImage(frameCanvas, 0, 0, width, height);
          outputContext.globalCompositeOperation = "destination-in";
          outputContext.drawImage(results.segmentationMask, 0, 0, width, height);
          outputContext.globalCompositeOperation = "source-over";
          canvasTrack.requestFrame?.();
          latestFrameReady = true;
          maskWaitResolve?.();
        } catch (frameError) {
          maskWaitReject?.(frameError);
        } finally {
          maskWaitResolve = null;
          maskWaitReject = null;
        }
      });

      const waitForMask = async (timeoutMs: number) => {
        latestFrameReady = false;
        await withTimeout(
          new Promise<void>((resolve, reject) => {
            maskWaitResolve = resolve;
            maskWaitReject = reject;
          }),
          timeoutMs,
          "Background segmentation timed out. Try a shorter or lower-resolution video.",
        );
        if (!latestFrameReady) {
          throw new Error("MediaPipe did not return a segmentation mask for a frame.");
        }
      };

      const mimeType = chooseRecorderMimeType();
      const recorder = new MediaRecorder(outputStream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      recordingChunks = [];

      recorderStopPromise = new Promise<File>((resolve, reject) => {
        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) recordingChunks.push(event.data);
        };
        recorder.onerror = () => reject(new Error("The browser failed while recording the processed video."));
        recorder.onstop = () => {
          if (recordingChunks.length === 0) {
            reject(new Error("The recorder stopped without producing video data."));
            return;
          }
          const blob = new Blob(recordingChunks, { type: recorder.mimeType || "video/webm" });
          const baseName = sourceFile.name.replace(/\.[^.]+$/, "");
          resolve(new File([blob], `${baseName}-background-removed.webm`, {
            type: blob.type || "video/webm",
            lastModified: Date.now(),
          }));
        };
      });
      void recorderStopPromise.catch(() => undefined);

      // Prime the output with the first masked frame before starting recording.
      frameContext.drawImage(video, 0, 0, width, height);
      const firstMask = waitForMask(15000);
      await segmentation.send({ image: frameCanvas });
      await firstMask;
      if (cancelledRef.current) return;

      // Record while the source plays. The frame callback captures each
      // presented source frame, then waits for segmentation before advancing
      // the processing loop. Playback is intentionally not sped up.
      recorder.start(500);
      let lastProcessedMediaTime = -1;

      const processPresentedFrame = async (mediaTime: number) => {
        if (cancelledRef.current || !video || video.ended) return;
        if (mediaTime <= lastProcessedMediaTime + 0.0001) return;
        lastProcessedMediaTime = mediaTime;

        frameContext.drawImage(video, 0, 0, width, height);
        const maskPromise = waitForMask(15000);
        await segmentation!.send({ image: frameCanvas });
        await maskPromise;

        setProgress(Math.min(99, Math.round((mediaTime / sourceDuration) * 100)));
      };

      let processing = Promise.resolve();
      let ended = false;
      const stopScheduling = () => {
        ended = true;
        if (frameCallbackId !== null && video?.cancelVideoFrameCallback) {
          video.cancelVideoFrameCallback?.(frameCallbackId);
          frameCallbackId = null;
        }
        if (animationFrameId !== null) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      };

      const scheduleNext = () => {
        if (cancelledRef.current || ended || !video) return;

        if (video.requestVideoFrameCallback) {
          frameCallbackId = video.requestVideoFrameCallback((_now, metadata) => {
            processing = processing
              .then(() => processPresentedFrame(metadata.mediaTime))
              .then(() => {
                // Do not queue frames faster than MediaPipe can process them.
                // Schedule the next callback only after this mask is ready.
                scheduleNext();
              });
            void processing.catch((frameError: unknown) => {
              if (!cancelledRef.current) {
                setError(frameError instanceof Error ? frameError.message : "Video frame processing failed.");
                cancelledRef.current = true;
                video?.pause();
                playbackReject?.(frameError);
              }
            });
          });
        } else {
          animationFrameId = window.requestAnimationFrame(() => {
            if (!video) return;
            const mediaTime = video.currentTime;
            processing = processing
              .then(() => processPresentedFrame(mediaTime))
              .then(() => {
                // Throttle frame processing to the segmentation model.
                scheduleNext();
              });
            void processing.catch((frameError: unknown) => {
              if (!cancelledRef.current) {
                setError(frameError instanceof Error ? frameError.message : "Video frame processing failed.");
                cancelledRef.current = true;
                video?.pause();
                playbackReject?.(frameError);
              }
            });
          });
        }
      };

      const playbackPromise = new Promise<void>((resolve, reject) => {
        playbackReject = reject;
        const handleEnded = () => {
          // Wait for all queued frame work before resolving playback.
          stopScheduling();
          void processing.then(resolve, reject);
        };
        const handleError = () => {
          stopScheduling();
          reject(new Error("The source video playback failed."));
        };
        const handleAbort = () => {
          if (cancelledRef.current) reject(new Error("Background removal was cancelled."));
        };

        video!.addEventListener("ended", handleEnded, { once: true });
        video!.addEventListener("error", handleError, { once: true });
        video!.addEventListener("abort", handleAbort, { once: true });

        progressTimer = window.setInterval(() => {
          if (video && sourceDuration > 0) {
            setProgress(Math.min(99, Math.round((video.currentTime / sourceDuration) * 100)));
          }
        }, 200);
      });

      if (cancelledRef.current) return;
      await video.play();
      scheduleNext();

      await Promise.race([
        playbackPromise,
        new Promise<never>((_, reject) => {
          cancelRef.current = () => reject(new Error("Background removal was cancelled."));
        }),
      ]);

      if (cancelledRef.current) return;
      stopScheduling();

      // Ensure the final segment and last source frame are processed.
      await withTimeout(
        processing,
        20000,
        "The final frames did not finish processing. Try a lower-resolution video.",
      );

      video.pause();

      if (recorder.state === "recording") {
        try {
          recorder.requestData();
        } catch {
          // stop() still flushes pending data.
        }
        recorder.stop();
      }

      const outputFile = await withTimeout(
        recorderStopPromise,
        20000,
        "The processed video recording did not finish. Please retry in Chrome or Edge.",
      );

      if (cancelledRef.current) return;

      // Verify that the generated file actually contains approximately the
      // source duration. Do not create a misleading short timeline clip.
      const outputDuration = await measureRecordedVideoDuration(outputFile);
      if (outputDuration < sourceDuration * 0.85) {
        throw new Error(
          `The processed recording is ${outputDuration.toFixed(1)} seconds long, but the original is ${sourceDuration.toFixed(1)} seconds. The recording is genuinely incomplete. Try a lower-resolution video or shorter source, and do not use this export.`,
        );
      }

      setProgress(99);
      const outputAsset = await createAssetFromFile(outputFile);
      if (!outputAsset) {
        throw new Error("The processed video was created, but Studio could not add it to the media library.");
      }

      onAssetCreated?.(outputAsset);
      const outputClip = createClipFromAsset(outputAsset, selectedClip.start, selectedClip.track);
      onClipCreated?.({
        ...outputClip,
        file: outputFile,
        name: outputFile.name,
        url: outputAsset.url,
        track: selectedClip.track,
        start: selectedClip.start,
        // Preserve the original timeline duration. The output duration was
        // validated above before the clip is inserted.
        duration: selectedClip.duration,
        trimStart: 0,
        trimEnd: 0,
        volume: selectedClip.volume,
        muted: selectedClip.muted,
      });

      setProgress(100);
    } catch (caughtError) {
      const wasCancelled = cancelledRef.current;
      if (!wasCancelled) {
        console.error("Video background removal failed:", caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Background removal failed. Please try again.",
        );
      }
    } finally {
      if (progressTimer !== null) window.clearInterval(progressTimer);
      if (frameCallbackId !== null && video?.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback?.(frameCallbackId);
      }
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);

      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }

      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // It may already be stopped.
        }
      }

      outputStream?.getTracks().forEach((track) => track.stop());
      audioDestinationStream?.getTracks().forEach((track) => track.stop());

      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close().catch(() => undefined);
      }

      try {
        segmentation?.close();
      } catch {
        // MediaPipe may already be closed.
      }

      if (objectUrl) URL.revokeObjectURL(objectUrl);

      recorderRef.current = null;
      videoRef.current = null;
      cancelRef.current = null;
      playbackReject = null;
      cancelledRef.current = false;
      runningRef.current = false;
      setRemovingBackground(false);
    }
  }, [assets, onAssetCreated, onClipCreated, selectedClip]);

  return {
    removingBackground,
    progress,
    error,
    removeSelectedBackground,
    cancelRemoval,
  };
}
