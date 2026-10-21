






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

type FrameCaptureTrack = MediaStreamTrack & {
  requestFrame?: () => void;
};

function getVideoAsset(
  assets: Asset[],
  clip: Clip,
): Asset | undefined {
  return assets.find((asset) => asset.id === clip.assetId);
}

function waitForMetadata(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
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
  });
}

function waitForCurrentFrame(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
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
      reject(new Error("The video frame could not be decoded."));
    };

    video.addEventListener("loadeddata", handleLoaded, {
      once: true,
    });
    video.addEventListener("error", handleError, { once: true });
  });
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
  const recorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cancelResolverRef = useRef<(() => void) | null>(null);
  const runningRef = useRef(false);

  const cancelRemoval = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    cancelledRef.current = true;

    videoRef.current?.pause();

    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // The recorder may already be stopping.
      }
    }

    cancelResolverRef.current?.();
  }, []);

  const removeSelectedBackground = useCallback(async () => {
    if (runningRef.current) {
      return;
    }

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

    type SegmentationInstance = InstanceType<
  (typeof import("@mediapipe/selfie_segmentation"))["SelfieSegmentation"]
>;

let segmentation: SegmentationInstance | null = null;

    let audioContext: AudioContext | null = null;
    let combinedStream: MediaStream | null = null;
    let audioDestinationStream: MediaStream | null = null;
    let frameCallbackId: number | null = null;
    let animationFrameId: number | null = null;
    let progressTimer: number | null = null;
    let objectUrl: string | null = null;
    let processingFrame = false;
    let videoEnded = false;
    let processingPromise: Promise<void> = Promise.resolve();

    const chunks: BlobPart[] = [];

    try {
      const mediaPipeModule = await import(
        "@mediapipe/selfie_segmentation"
      );

      if (cancelledRef.current) {
        return;
      }

      const SelfieSegmentation = mediaPipeModule.SelfieSegmentation;

      segmentation = new SelfieSegmentation({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });

      segmentation.setOptions?.({ modelSelection: 1 });

      video = document.createElement("video");
      videoRef.current = video;

      video.playsInline = true;
      video.preload = "auto";
      video.muted = false;
      video.volume = 1;
      video.crossOrigin = "anonymous";

      objectUrl = URL.createObjectURL(sourceFile);
      video.src = objectUrl;

      await waitForMetadata(video);

      if (cancelledRef.current) {
        return;
      }

      await waitForCurrentFrame(video);

      if (cancelledRef.current) {
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) {
        throw new Error(
          "The video has no usable frame dimensions.",
        );
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

      // Capture only the frames explicitly requested after segmentation.
      const canvasStream = outputCanvas.captureStream(0);
      combinedStream = canvasStream;

      const canvasVideoTrack = canvasStream.getVideoTracks()[0] as
        | FrameCaptureTrack
        | undefined;

      if (!canvasVideoTrack) {
        throw new Error("Could not create the processed video track.");
      }

      if (typeof canvasVideoTrack.requestFrame !== "function") {
        throw new Error(
          "Your browser does not support frame-by-frame video capture. Try an updated version of Chrome or Edge.",
        );
      }

      /*
       * Capture audio from the SAME video element used for video frames.
       * This avoids separate audio/video playback clocks drifting apart.
       *
       * The audio graph goes to a MediaStream destination, not the
       * speakers, so the processing video is not played out loud.
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
          console.warn(
            "Could not capture the video's audio track:",
            audioError,
          );

          if (audioContext) {
            await audioContext.close().catch(() => undefined);
            audioContext = null;
          }

          audioDestinationStream?.getTracks().forEach((track) => {
            track.stop();
          });

          audioDestinationStream = null;
        }
      }

      if (cancelledRef.current) {
        return;
      }

      segmentation.onResults((results) => {
        if (cancelledRef.current) {
          return;
        }

        outputContext.clearRect(0, 0, width, height);

        // Draw the exact frame submitted to MediaPipe.
        outputContext.globalCompositeOperation = "source-over";
        outputContext.drawImage(frameCanvas, 0, 0, width, height);

        // Keep the foreground and make the background transparent.
        outputContext.globalCompositeOperation = "destination-in";
        outputContext.drawImage(
          results.segmentationMask,
          0,
          0,
          width,
          height,
        );

        outputContext.globalCompositeOperation = "source-over";

        // Request a captured frame only after the mask is ready.
        canvasVideoTrack.requestFrame?.();
      });

      const duration = Number.isFinite(video.duration)
        ? video.duration
        : 0;

      if (!duration || duration <= 0) {
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
                "No processed video data was produced. Please try again.",
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

      /*
       * Render and capture the first frame before recording begins,
       * so the exported video does not start with a blank frame.
       */
      frameContext.drawImage(video, 0, 0, width, height);
      await segmentation.send({ image: frameCanvas });

      if (cancelledRef.current) {
        return;
      }

      recorder.start(250);

      const processFrame = async () => {
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

            /*
             * Snapshot the current decoded video frame before sending
             * it to MediaPipe. The result mask is applied to this same
             * snapshot, preventing the foreground from lagging behind
             * the source video.
             */
            frameContext.drawImage(video, 0, 0, width, height);

            await segmentation?.send({ image: frameCanvas });
          } catch (frameError) {
            if (!cancelledRef.current) {
              console.error(
                "A video frame could not be processed:",
                frameError,
              );
            }
          } finally {
            processingFrame = false;
          }
        })();

        await processingPromise;

        if (
          cancelledRef.current ||
          videoEnded ||
          !video ||
          video.paused ||
          video.ended
        ) {
          return;
        }

        // Wait for a new decoded video frame where supported.
        if ("requestVideoFrameCallback" in video) {
          frameCallbackId = (
            video as HTMLVideoElement & {
              requestVideoFrameCallback: (
                callback: () => void,
              ) => number;
            }
          ).requestVideoFrameCallback(() => {
            void processFrame();
          });
        } else {
          animationFrameId = window.requestAnimationFrame(() => {
            void processFrame();
          });
        }
      };

      const endedPromise = new Promise<"ended">((resolve) => {
        const handleEnded = () => {
          videoEnded = true;
          resolve("ended");
        };

        video?.addEventListener("ended", handleEnded, { once: true });
      });

      const cancelledPromise = new Promise<"cancelled">((resolve) => {
        cancelResolverRef.current = () => resolve("cancelled");
      });

      progressTimer = window.setInterval(() => {
        if (!video || !duration) {
          return;
        }

        const nextProgress = Math.min(
          99,
          Math.round((video.currentTime / duration) * 100),
        );

        setProgress(nextProgress);
      }, 150);

      if (cancelledRef.current) {
        cancelResolverRef.current?.();
      } else {
        await video.play();
      }

      if (!cancelledRef.current) {
        void processFrame();
      }

      const playbackResult = await Promise.race([
        endedPromise,
        cancelledPromise,
      ]);

      videoEnded = true;

      if (frameCallbackId !== null && video) {
        const cancelFrameCallback = (
          video as HTMLVideoElement & {
            cancelVideoFrameCallback?: (id: number) => void;
          }
        ).cancelVideoFrameCallback;

        cancelFrameCallback?.(frameCallbackId);
        frameCallbackId = null;
      }

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      video.pause();

      // Allow any segmentation request already in flight to finish.
      await processingPromise;

      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      const outputFile = await recordingPromise;

      if (playbackResult === "cancelled" || cancelledRef.current) {
        return;
      }

      setProgress(100);

      const outputAsset = await createAssetFromFile(outputFile);

      if (!outputAsset) {
        throw new Error(
          "The processed video was created, but the Studio could not add it to your media library.",
        );
      }

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

      if (frameCallbackId !== null && video) {
        const cancelFrameCallback = (
          video as HTMLVideoElement & {
            cancelVideoFrameCallback?: (id: number) => void;
          }
        ).cancelVideoFrameCallback;

        cancelFrameCallback?.(frameCallbackId);
      }

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }

      if (recorderRef.current?.state !== "inactive") {
        try {
          recorderRef.current?.stop();
        } catch {
          // The recorder may already have stopped.
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
  }, [
    assets,
    onAssetCreated,
    onClipCreated,
    selectedClip,
  ]);

  return {
    removingBackground,
    progress,
    error,
    removeSelectedBackground,
    cancelRemoval,
  };
}
