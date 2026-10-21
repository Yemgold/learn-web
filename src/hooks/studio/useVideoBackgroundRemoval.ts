



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

type FrameCaptureTrack = MediaStreamTrack & {
  requestFrame?: () => void;
};

function getVideoAsset(
  assets: Asset[],
  clip: Clip,
): Asset | undefined {
  return assets.find((asset) => asset.id === clip.assetId);
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

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
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    return Promise.resolve();
  }

  return withTimeout(
    new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener("loadedmetadata", handleLoaded);
        video.removeEventListener("error", handleError);
      };

      const handleLoaded = () => {
        cleanup();
        resolve();
      };

      const handleError = () => {
        cleanup();
        reject(new Error("The video could not be loaded."));
      };

      video.addEventListener("loadedmetadata", handleLoaded, {
        once: true,
      });
      video.addEventListener("error", handleError, { once: true });
    }),
    15000,
    "Timed out while loading the video metadata.",
  );
}

function waitForCurrentFrame(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }

  return withTimeout(
    new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener("loadeddata", handleLoaded);
        video.removeEventListener("error", handleError);
      };

      const handleLoaded = () => {
        cleanup();
        resolve();
      };

      const handleError = () => {
        cleanup();
        reject(new Error("The first video frame could not be decoded."));
      };

      video.addEventListener("loadeddata", handleLoaded, {
        once: true,
      });
      video.addEventListener("error", handleError, { once: true });
    }),
    15000,
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
    if (MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }

  return "";
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

  const cancelledRef = useRef(false);
  const runningRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cancelResolverRef = useRef<(() => void) | null>(null);

  const cancelRemoval = useCallback(() => {
    if (!runningRef.current) return;

    cancelledRef.current = true;
    videoRef.current?.pause();

    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // It may already be stopping.
      }
    }

    cancelResolverRef.current?.();
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
      setError(
        "The original video file is unavailable. Import the video again and retry.",
      );
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

    let video: HTMLVideoElement | null = null;
    let segmentation: SegmentationInstance | null = null;
    let audioContext: AudioContext | null = null;
    let combinedStream: MediaStream | null = null;
    let audioDestinationStream: MediaStream | null = null;
    let objectUrl: string | null = null;

    let frameCallbackId: number | null = null;
    let animationFrameId: number | null = null;
    let progressTimer: number | null = null;
    let completionTimer: number | null = null;

    let videoEnded = false;
    let processingFrame = false;
    let processingPromise: Promise<void> = Promise.resolve();

    const chunks: BlobPart[] = [];

    try {
      const mediaPipeModule = await import(
        "@mediapipe/selfie_segmentation"
      );

      if (cancelledRef.current) return;

      const instance = new mediaPipeModule.SelfieSegmentation({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });

      segmentation = instance;
      instance.setOptions({ modelSelection: 1 });

      const activeSegmentation = instance;

      video = document.createElement("video");
      videoRef.current = video;

      video.playsInline = true;
      video.preload = "auto";
      video.muted = false;
      video.volume = 1;

      objectUrl = URL.createObjectURL(sourceFile);
      video.src = objectUrl;

      await waitForMetadata(video);
      if (cancelledRef.current) return;

      await waitForCurrentFrame(video);
      if (cancelledRef.current) return;

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) {
        throw new Error("The video has no usable frame dimensions.");
      }

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = width;
      frameCanvas.height = height;

      const frameContext = frameCanvas.getContext("2d", {
        alpha: false,
      });

      if (!frameContext) {
        throw new Error("Could not initialize the video frame canvas.");
      }

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;

      const outputContext = outputCanvas.getContext("2d", {
        alpha: true,
      });

      if (!outputContext) {
        throw new Error("Could not initialize the output canvas.");
      }

      if (typeof outputCanvas.captureStream !== "function") {
        throw new Error(
          "Your browser does not support canvas video capture.",
        );
      }

      const canvasStream = outputCanvas.captureStream(0);
      combinedStream = canvasStream;

      const canvasVideoTrack = canvasStream.getVideoTracks()[0] as
        | FrameCaptureTrack
        | undefined;

      if (
        !canvasVideoTrack ||
        typeof canvasVideoTrack.requestFrame !== "function"
      ) {
        throw new Error(
          "Manual video-frame capture is unavailable. Try an updated version of Chrome or Edge.",
        );
      }

      /*
       * Route the selected video's audio into the output stream.
       * Video and audio use the same media element and playback clock.
       */
      const AudioContextConstructor =
        window.AudioContext ??
        (
          window as Window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (AudioContextConstructor) {
        try {
          audioContext = new AudioContextConstructor();

          const audioSource =
            audioContext.createMediaElementSource(video);

          const audioDestination =
            audioContext.createMediaStreamDestination();

          audioSource.connect(audioDestination);
          audioDestinationStream = audioDestination.stream;

          for (const track of audioDestinationStream.getAudioTracks()) {
            combinedStream.addTrack(track);
          }

          await audioContext.resume();
        } catch (audioError) {
          console.warn("Audio capture setup failed:", audioError);

          if (audioContext && audioContext.state !== "closed") {
            await audioContext.close().catch(() => undefined);
          }

          audioContext = null;

          audioDestinationStream?.getTracks().forEach((track) => {
            track.stop();
          });

          audioDestinationStream = null;
        }
      }

      if (cancelledRef.current) return;

      activeSegmentation.onResults((results) => {
        if (cancelledRef.current) return;

        outputContext.clearRect(0, 0, width, height);

        outputContext.globalCompositeOperation = "source-over";
        outputContext.drawImage(frameCanvas, 0, 0, width, height);

        outputContext.globalCompositeOperation = "destination-in";
        outputContext.drawImage(
          results.segmentationMask,
          0,
          0,
          width,
          height,
        );

        outputContext.globalCompositeOperation = "source-over";

        canvasVideoTrack.requestFrame?.();
      });

      const duration = video.duration;

      if (!Number.isFinite(duration) || duration <= 0) {
        throw new Error("The video duration could not be determined.");
      }

      const mimeType = chooseRecorderMimeType();

      const recorder = new MediaRecorder(
        combinedStream,
        mimeType ? { mimeType } : undefined,
      );

      recorderRef.current = recorder;

      const recordingPromise = new Promise<File>((resolve, reject) => {
        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onerror = () => {
          reject(new Error("The browser failed while recording the video."));
        };

        recorder.onstop = () => {
          if (chunks.length === 0) {
            reject(
              new Error(
                "The recorder stopped without producing video data.",
              ),
            );
            return;
          }

          const blob = new Blob(chunks, {
            type: recorder.mimeType || "video/webm",
          });

          const baseName = sourceFile.name.replace(/\.[^.]+$/, "");

          resolve(
            new File([blob], `${baseName}-background-removed.webm`, {
              type: blob.type || "video/webm",
              lastModified: Date.now(),
            }),
          );
        };
      });

      // Attach a rejection handler immediately, including on cancellation.
      void recordingPromise.catch(() => undefined);

      /*
       * Process an initial frame so the output canvas has a valid
       * foreground image before the recorder starts.
       */
      frameContext.drawImage(video, 0, 0, width, height);

      await withTimeout(
        activeSegmentation.send({ image: frameCanvas }),
        15000,
        "MediaPipe timed out while processing the first frame. Try a smaller video.",
      );

      if (cancelledRef.current) return;

      recorder.start(250);

      const processFrame = async (): Promise<void> => {
        if (
          cancelledRef.current ||
          videoEnded ||
          !video ||
          video.paused ||
          video.ended ||
          processingFrame
        ) {
          return;
        }

        processingFrame = true;

        processingPromise = (async () => {
          try {
            if (
              !video ||
              cancelledRef.current ||
              video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
            ) {
              return;
            }

            // Keep the source frame and its segmentation mask paired.
            frameContext.drawImage(video, 0, 0, width, height);

            await withTimeout(
              activeSegmentation.send({ image: frameCanvas }),
              8000,
              "Background removal stalled while processing a frame. Try a shorter video or a lower-resolution source.",
            );
          } finally {
            processingFrame = false;
          }
        })();

        try {
          await processingPromise;
        } catch (frameError) {
          if (!cancelledRef.current) {
            throw frameError;
          }

          return;
        }

        if (
          cancelledRef.current ||
          videoEnded ||
          !video ||
          video.paused ||
          video.ended
        ) {
          return;
        }

        if ("requestVideoFrameCallback" in video) {
          frameCallbackId = (
            video as HTMLVideoElement & {
              requestVideoFrameCallback: (
                callback: () => void,
              ) => number;
            }
          ).requestVideoFrameCallback(() => {
            void processFrame().catch((frameError: unknown) => {
              if (!cancelledRef.current) {
                console.error("Video frame processing failed:", frameError);
                cancelResolverRef.current?.();
              }
            });
          });
        } else {
          animationFrameId = window.requestAnimationFrame(() => {
            void processFrame().catch((frameError: unknown) => {
              if (!cancelledRef.current) {
                console.error("Video frame processing failed:", frameError);
                cancelResolverRef.current?.();
              }
            });
          });
        }
      };

      const endedPromise = new Promise<"ended">((resolve) => {
        let settled = false;

        const finish = () => {
          if (settled) return;

          settled = true;
          videoEnded = true;

          video?.removeEventListener("ended", handleEnded);
          video?.removeEventListener("timeupdate", checkCompletion);

          if (completionTimer !== null) {
            window.clearInterval(completionTimer);
            completionTimer = null;
          }

          resolve("ended");
        };

        const checkCompletion = () => {
          if (!video || !Number.isFinite(video.duration)) return;

          if (
            video.duration > 0 &&
            video.currentTime >= video.duration - 0.04
          ) {
            finish();
          }
        };

        const handleEnded = () => finish();

        video?.addEventListener("ended", handleEnded);
        video?.addEventListener("timeupdate", checkCompletion);

        completionTimer = window.setInterval(checkCompletion, 250);
      });

      const cancelledPromise = new Promise<"cancelled">((resolve) => {
        cancelResolverRef.current = () => resolve("cancelled");
      });

      progressTimer = window.setInterval(() => {
        if (!video || !duration) return;

        setProgress(
          Math.min(
            99,
            Math.round((video.currentTime / duration) * 100),
          ),
        );
      }, 150);

      if (cancelledRef.current) {
        cancelResolverRef.current?.();
      } else {
        await video.play();
      }

      if (!cancelledRef.current) {
        void processFrame().catch((frameError: unknown) => {
          if (!cancelledRef.current) {
            console.error("Video frame processing failed:", frameError);
            cancelResolverRef.current?.();
          }
        });
      }

      const playbackResult = await Promise.race([
        endedPromise,
        cancelledPromise,
      ]);

      if (playbackResult === "cancelled" || cancelledRef.current) {
        return;
      }

      videoEnded = true;

      if (frameCallbackId !== null && video) {
        (
          video as HTMLVideoElement & {
            cancelVideoFrameCallback?: (id: number) => void;
          }
        ).cancelVideoFrameCallback?.(frameCallbackId);

        frameCallbackId = null;
      }

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      video.pause();

      /*
       * Allow the last segmentation request to finish, but do not
       * permit a stuck MediaPipe request to block the UI indefinitely.
       */
      await withTimeout(
        processingPromise,
        8000,
        "The final video frame did not finish processing. Try a shorter video or lower-resolution source.",
      );

      if (cancelledRef.current) return;

      if (recorder.state === "recording") {
        try {
          recorder.requestData();
        } catch {
          // Continue to stop the recorder.
        }

        recorder.stop();
      }

      const outputFile = await withTimeout(
        recordingPromise,
        10000,
        "The browser did not finish recording the processed video. Try again in Chrome or Edge.",
      );

      if (cancelledRef.current) return;

      setProgress(99);

      const outputAsset = await createAssetFromFile(outputFile);

      if (!outputAsset) {
        throw new Error(
          "The processed video was created, but the Studio could not add it to the media library.",
        );
      }

      /*
       * Add the asset and clip only after the output file exists.
       */
      onAssetCreated?.(outputAsset);

      const outputClip = createClipFromAsset(
        outputAsset,
        selectedClip.start,
        selectedClip.track,
      );

      onClipCreated?.({
        ...outputClip,
        file: outputFile,
        name: outputFile.name,
        url: outputAsset.url,
        track: selectedClip.track,
        start: selectedClip.start,
        duration: Math.min(
          outputClip.duration,
          selectedClip.duration,
        ),
        trimStart: 0,
        trimEnd: 0,
        volume: selectedClip.volume,
        muted: selectedClip.muted,
      });

      setProgress(100);
    } catch (caughtError) {
      if (!cancelledRef.current) {
        console.error("Video background removal failed:", caughtError);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Background removal failed. Please try again.",
        );
      }
    } finally {
      if (progressTimer !== null) {
        window.clearInterval(progressTimer);
      }

      if (completionTimer !== null) {
        window.clearInterval(completionTimer);
      }

      if (frameCallbackId !== null && video) {
        (
          video as HTMLVideoElement & {
            cancelVideoFrameCallback?: (id: number) => void;
          }
        ).cancelVideoFrameCallback?.(frameCallbackId);
      }

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

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
          // It may already have stopped.
        }
      }

      combinedStream?.getTracks().forEach((track) => track.stop());

      audioDestinationStream?.getTracks().forEach((track) => {
        track.stop();
      });

      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close().catch(() => undefined);
      }

      try {
        segmentation?.close();
      } catch {
        // MediaPipe may already have been closed.
      }

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      recorderRef.current = null;
      videoRef.current = null;
      cancelResolverRef.current = null;
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
