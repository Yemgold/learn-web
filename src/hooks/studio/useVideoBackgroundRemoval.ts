



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

interface VideoBackgroundRemovalResult {
  removingBackground: boolean;
  progress: number;
  error: string | null;
  removeSelectedBackground: () => Promise<void>;
  cancelRemoval: () => void;
}

interface SegmentationResults {
  segmentationMask: CanvasImageSource;
}

interface SelfieSegmentationInstance {
  setOptions(options: { modelSelection: number }): void;
  onResults(callback: (results: SegmentationResults) => void): void;
  send(input: { image: CanvasImageSource }): Promise<void>;
  close(): void;
}

type SelfieSegmentationConstructor = new (options: {
  locateFile: (file: string) => string;
}) => SelfieSegmentationInstance;

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (
      now: number,
      metadata: { mediaTime: number },
    ) => void,
  ) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

type AudioCaptureElement = HTMLAudioElement & {
  captureStream?: () => MediaStream;
  mozCaptureStream?: () => MediaStream;
};

function waitForMetadata(
  element: HTMLMediaElement,
  description: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
      resolve();
      return;
    }

    const cleanup = () => {
      element.removeEventListener("loadedmetadata", onLoaded);
      element.removeEventListener("error", onError);
    };

    const onLoaded = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Could not load ${description}.`));
    };

    element.addEventListener("loadedmetadata", onLoaded, {
      once: true,
    });
    element.addEventListener("error", onError, {
      once: true,
    });

    element.load();
  });
}

function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  if (
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  ) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("Could not decode a frame from the source video."));
    };

    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function getRecorderMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";

  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  return (
    candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
  );
}

function waitForVideoEnd(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (video.ended) {
      resolve();
      return;
    }

    const cleanup = () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };

    const onEnded = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("The source video encountered a playback error."));
    };

    video.addEventListener("ended", onEnded, { once: true });
    video.addEventListener("error", onError, { once: true });

    if (video.ended) {
      cleanup();
      resolve();
    }
  });
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => {
    try {
      track.stop();
    } catch {
      // Ignore tracks that have already stopped.
    }
  });
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useVideoBackgroundRemoval({
  assets,
  selectedClip,
  onAssetCreated,
  onClipCreated,
}: UseVideoBackgroundRemovalOptions): VideoBackgroundRemovalResult {
  const [removingBackground, setRemovingBackground] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const cancelledRef = useRef(false);
  const busyRef = useRef(false);

  const cancelRemoval = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  const removeSelectedBackground = useCallback(async () => {
    if (busyRef.current) return;

    if (!selectedClip || selectedClip.kind !== "video") {
      setError("Select a video clip on the timeline first.");
      return;
    }

    const sourceClip = selectedClip;
    const sourceAsset = assets.find(
      (asset) => asset.id === sourceClip.assetId,
    );

    const file = sourceClip.file ?? sourceAsset?.file;

    if (!file || !file.type.startsWith("video/")) {
      setError(
        "The original video file is unavailable. Re-import the source video and try again.",
      );
      return;
    }

    if (
      typeof window === "undefined" ||
      typeof MediaRecorder === "undefined" ||
      typeof HTMLCanvasElement.prototype.captureStream !== "function"
    ) {
      setError(
        "Video processing requires a current version of Microsoft Edge or Google Chrome.",
      );
      return;
    }

    const mimeType = getRecorderMimeType();

    if (!mimeType) {
      setError("Your browser does not support WebM video recording.");
      return;
    }

    busyRef.current = true;
    cancelledRef.current = false;

    setRemovingBackground(true);
    setProgress(0);
    setError(null);

    let inputUrl: string | null = null;
    let video: HTMLVideoElement | null = null;
    let audio: HTMLAudioElement | null = null;
    let segmentation: SelfieSegmentationInstance | null = null;

    let canvasStream: MediaStream | null = null;
    let audioStream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;

    let progressInterval: number | null = null;
    let frameCallbackId: number | null = null;
    let animationFrameId: number | null = null;

    let frameBusy = false;
    let processingFinished = false;
    let frameError: Error | null = null;
    let processedFrames = 0;

    let resolveRecording: ((blob: Blob) => void) | null = null;
    let rejectRecording: ((reason: Error) => void) | null = null;
    let recordingSettled = false;

    const chunks: Blob[] = [];

    const recordingFinished = new Promise<Blob>((resolve, reject) => {
      resolveRecording = resolve;
      rejectRecording = reject;
    });

    const finishRecording = (blob: Blob) => {
      if (recordingSettled) return;
      recordingSettled = true;
      resolveRecording?.(blob);
    };

    const failRecording = (reason: Error) => {
      if (recordingSettled) return;
      recordingSettled = true;
      rejectRecording?.(reason);
    };

    const cancelScheduledFrame = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      if (frameCallbackId !== null && video) {
        (
          video as VideoWithFrameCallback
        ).cancelVideoFrameCallback?.(frameCallbackId);

        frameCallbackId = null;
      }
    };

    try {
      const mediaPipe = await import("@mediapipe/selfie_segmentation");

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      const Segmentation =
        mediaPipe.SelfieSegmentation as unknown as SelfieSegmentationConstructor;

      segmentation = new Segmentation({
        locateFile: (name) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${name}`,
      });

      segmentation.setOptions({ modelSelection: 1 });

      video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.crossOrigin = "anonymous";

      audio = document.createElement("audio");
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";

      inputUrl = URL.createObjectURL(file);
      video.src = inputUrl;
      audio.src = inputUrl;

      await Promise.all([
        waitForMetadata(video, "the original video"),
        waitForMetadata(audio, "the original audio"),
      ]);

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      await waitForVideoFrame(video);

      const width = video.videoWidth;
      const height = video.videoHeight;
      const sourceDuration = video.duration;

      if (
        !width ||
        !height ||
        !Number.isFinite(sourceDuration) ||
        sourceDuration <= 0
      ) {
        throw new Error(
          "The original video has invalid dimensions or duration.",
        );
      }

      /*
       * Keep a snapshot of each source frame.
       *
       * MediaPipe runs asynchronously. Drawing the live video element after
       * segmentation can accidentally pair a mask with a newer video frame.
       * The snapshot ensures the subject frame and mask stay aligned.
       */
      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = width;
      frameCanvas.height = height;

      const frameContext = frameCanvas.getContext("2d", {
        alpha: false,
      });

      if (!frameContext) {
        throw new Error("Could not initialize the source-frame canvas.");
      }

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;

      const outputContext = outputCanvas.getContext("2d", {
        alpha: true,
      });

      if (!outputContext) {
        throw new Error(
          "Could not initialize the transparent output canvas.",
        );
      }

      canvasStream = outputCanvas.captureStream(0);

      const canvasTrack = canvasStream.getVideoTracks()[0] as
        | CanvasCaptureMediaStreamTrack
        | undefined;

      if (!canvasTrack || typeof canvasTrack.requestFrame !== "function") {
        throw new Error(
          "Manual canvas-frame capture is unavailable. Update your browser and try again.",
        );
      }

      /*
       * Audio is optional. Some source videos do not contain an audio track.
       * Do not fail background removal just because the source is silent.
       */
      const audioElement = audio as AudioCaptureElement;
      const captureAudio =
        audioElement.captureStream ?? audioElement.mozCaptureStream;

      if (captureAudio) {
        try {
          audioStream = captureAudio.call(audioElement);

          audioStream.getAudioTracks().forEach((track) => {
            canvasStream?.addTrack(track);
          });
        } catch (audioError) {
          console.warn(
            "Could not capture the source audio; continuing without it.",
            audioError,
          );
        }
      }

      recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 6_000_000,
        audioBitsPerSecond: 128_000,
      });

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onerror = () => {
        failRecording(
          new Error("An error occurred while recording processed video."),
        );
      };

      recorder.onstop = () => {
        finishRecording(
          new Blob(chunks, {
            type: recorder?.mimeType || mimeType,
          }),
        );
      };

      /*
       * Draw a clean alpha-masked frame.
       *
       * The output canvas is cleared every time, so pixels from an earlier
       * frame cannot remain behind the current subject.
       */
      segmentation.onResults((results) => {
        if (
          cancelledRef.current ||
          frameError ||
          processingFinished
        ) {
          return;
        }

        try {
          outputContext.save();
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

          outputContext.restore();

          /*
           * Request a captured frame only after its new mask has been drawn.
           * This avoids automatic capture of stale canvas contents.
           */
          canvasTrack.requestFrame();
          processedFrames += 1;
        } catch (caught) {
          try {
            outputContext.restore();
          } catch {
            // Ignore canvas cleanup errors.
          }

          frameError = new Error(
            `Could not render a segmented video frame: ${getErrorMessage(
              caught,
              "unknown rendering error",
            )}`,
          );
        }
      });

      /*
       * Process only one frame at a time. This avoids overlapping MediaPipe
       * calls, which can otherwise create stale or mismatched mask results.
       */
      const processFrame = async () => {
        if (
          !video ||
          !segmentation ||
          cancelledRef.current ||
          frameError ||
          processingFinished ||
          video.ended ||
          video.paused ||
          frameBusy
        ) {
          return;
        }

        frameBusy = true;

        try {
          if (
            video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
            !video.videoWidth ||
            !video.videoHeight
          ) {
            return;
          }

          frameContext.drawImage(video, 0, 0, width, height);

          await segmentation.send({
            image: frameCanvas,
          });
        } catch (caught) {
          frameError = new Error(
            `AI segmentation failed: ${getErrorMessage(
              caught,
              "unknown segmentation error",
            )}`,
          );
        } finally {
          frameBusy = false;
        }

        if (
          cancelledRef.current ||
          frameError ||
          processingFinished ||
          !video
        ) {
          return;
        }

        if (video.ended) return;

        scheduleNextFrame();
      };

      const scheduleNextFrame = () => {
        if (
          !video ||
          cancelledRef.current ||
          frameError ||
          processingFinished ||
          video.paused ||
          video.ended
        ) {
          return;
        }

        const frameVideo = video as VideoWithFrameCallback;

        if (
          typeof frameVideo.requestVideoFrameCallback === "function"
        ) {
          frameCallbackId = frameVideo.requestVideoFrameCallback(() => {
            frameCallbackId = null;
            void processFrame();
          });
        } else {
          animationFrameId = requestAnimationFrame(() => {
            animationFrameId = null;
            void processFrame();
          });
        }
      };

      /*
       * Draw and capture an initial frame before starting playback. This
       * avoids beginning the recording with an empty canvas.
       */
      frameContext.drawImage(video, 0, 0, width, height);

      await segmentation.send({ image: frameCanvas });

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (frameError) throw frameError;

      if (processedFrames === 0) {
        throw new Error(
          "AI segmentation did not produce an initial frame. Please try again.",
        );
      }

      recorder.start(1000);

      video.currentTime = 0;
      audio.currentTime = 0;

      await new Promise<void>((resolve, reject) => {
        if (!video) {
          reject(new Error("The source video is unavailable."));
          return;
        }

        const handleSeeked = () => {
          cleanup();
          resolve();
        };

        const handleError = () => {
          cleanup();
          reject(new Error("Could not seek to the start of the video."));
        };

        const cleanup = () => {
          video?.removeEventListener("seeked", handleSeeked);
          video?.removeEventListener("error", handleError);
        };

        if (video.currentTime === 0) {
          resolve();
          return;
        }

        video.addEventListener("seeked", handleSeeked, { once: true });
        video.addEventListener("error", handleError, { once: true });
      });

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      await video.play();

      /*
       * Audio playback is best-effort because some browsers or source files
       * do not expose a capturable audio stream.
       */
      void audio.play().catch((audioError: unknown) => {
        console.warn("Source audio playback could not start:", audioError);
      });

      scheduleNextFrame();

      const endedPromise = waitForVideoEnd(video);

      await new Promise<void>((resolve, reject) => {
        let settled = false;

        const finish = (callback: () => void) => {
          if (settled) return;
          settled = true;

          if (progressInterval !== null) {
            window.clearInterval(progressInterval);
            progressInterval = null;
          }

          callback();
        };

        progressInterval = window.setInterval(() => {
          if (cancelledRef.current) {
            finish(() =>
              reject(new Error("Background removal cancelled.")),
            );
            return;
          }

          if (frameError) {
            finish(() =>
              reject(
                frameError ??
                  new Error("Video frame processing failed."),
              ),
            );
            return;
          }

          if (video) {
            setProgress(
              Math.min(
                99,
                Math.floor(
                  (video.currentTime / sourceDuration) * 100,
                ),
              ),
            );
          }
        }, 100);

        endedPromise
          .then(() => finish(resolve))
          .catch((caught: unknown) =>
            finish(() =>
              reject(
                caught instanceof Error
                  ? caught
                  : new Error("Source video playback failed."),
              ),
            ),
          );
      });

      /*
       * The final source frame may still be in flight when playback ends.
       * Wait for it to finish before stopping the recorder.
       */
      while (frameBusy && !cancelledRef.current && !frameError) {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 10);
        });
      }

      cancelScheduledFrame();

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (frameError) throw frameError;

      processingFinished = true;

      video.pause();
      audio.pause();

      if (recorder.state === "recording") {
        recorder.requestData();
        recorder.stop();
      }

      const outputBlob = await recordingFinished;

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (processedFrames < 2 || outputBlob.size < 1000) {
        throw new Error(
          "The processed video is incomplete. Please try again with a shorter video or a newer browser.",
        );
      }

      const baseName = file.name.replace(/\.[^.]+$/, "");
      const outputFile = new File(
        [outputBlob],
        `${baseName}-no-background.webm`,
        {
          type: outputBlob.type || "video/webm",
        },
      );

      const outputAsset = await createAssetFromFile(outputFile);

      if (!outputAsset) {
        throw new Error("Could not add the processed video to your media library.");
      }

      const generatedClip = createClipFromAsset(
        outputAsset,
        sourceClip.start,
      );

      const outputClip: Clip = {
        ...generatedClip,
        file: outputFile,
        name: outputFile.name,
        url: outputAsset.url,
        track: sourceClip.track,
        start: sourceClip.start,
        duration: sourceClip.duration || sourceDuration,
        trimStart: sourceClip.trimStart,
        trimEnd: sourceClip.trimEnd,
        volume: sourceClip.volume,
        muted: sourceClip.muted,
      };

      onAssetCreated?.(outputAsset);
      onClipCreated?.(outputClip);

      setProgress(100);
    } catch (caught) {
      const reason = new Error(
        getErrorMessage(caught, "Video background removal failed."),
      );

      cancelScheduledFrame();

      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // Preserve the original processing error.
        }
      }

      failRecording(reason);

      setError(reason.message);
    } finally {
      processingFinished = true;

      cancelScheduledFrame();

      if (progressInterval !== null) {
        window.clearInterval(progressInterval);
      }

      video?.pause();
      audio?.pause();

      try {
        segmentation?.close();
      } catch {
        // Ignore model cleanup errors.
      }

      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // Ignore recorder cleanup errors.
        }
      }

      stopStream(canvasStream);
      stopStream(audioStream);

      if (inputUrl) {
        URL.revokeObjectURL(inputUrl);
      }

      busyRef.current = false;
      setRemovingBackground(false);
    }
  }, [
    assets,
    selectedClip,
    onAssetCreated,
    onClipCreated,
  ]);

  return {
    removingBackground,
    progress,
    error,
    removeSelectedBackground,
    cancelRemoval,
  };
}
