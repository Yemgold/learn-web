



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

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
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

function getRecorderMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";

  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return (
    candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
  );
}

function waitForMetadata(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      resolve();
      return;
    }

    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };

    const onLoaded = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("Could not load the source video."));
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);
    video.load();
  });
}

function waitForCurrentFrame(video: HTMLVideoElement): Promise<void> {
  if (
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  ) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
    };

    const onLoaded = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("Could not decode a source video frame."));
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("error", onError);
  });
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
    let segmentation: SelfieSegmentationInstance | null = null;
    let audioContext: AudioContext | null = null;
    let audioDestination: MediaStreamAudioDestinationNode | null = null;
    let canvasStream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;

    let frameCallbackId: number | null = null;
    let animationFrameId: number | null = null;
    let progressInterval: number | null = null;

    let frameBusy = false;
    let processingFinished = false;
    let frameError: Error | null = null;
    let processedFrames = 0;
    let recorderError: Error | null = null;

    const chunks: Blob[] = [];

    let resolveRecording!: (blob: Blob) => void;
    let rejectRecording!: (error: Error) => void;
    let recordingSettled = false;

    const recordingFinished = new Promise<Blob>((resolve, reject) => {
      resolveRecording = resolve;
      rejectRecording = reject;
    });

    const settleRecording = (blob: Blob) => {
      if (recordingSettled) return;
      recordingSettled = true;
      resolveRecording(blob);
    };

    const failRecording = (reason: Error) => {
      if (recordingSettled) return;
      recordingSettled = true;
      rejectRecording(reason);
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
      video.preload = "auto";
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      /*
       * The source video is the ONLY playback clock.
       *
       * Audio is routed through Web Audio from this same element. We do not
       * play a second audio element, which could drift out of sync.
       */
      video.muted = true;
      video.volume = 1;

      inputUrl = URL.createObjectURL(file);
      video.src = inputUrl;

      await waitForMetadata(video);
      await waitForCurrentFrame(video);

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

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
          "The source video has invalid dimensions or duration.",
        );
      }

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = width;
      frameCanvas.height = height;

      const frameContext = frameCanvas.getContext("2d", {
        alpha: false,
      });

      if (!frameContext) {
        throw new Error("Could not initialize the source frame canvas.");
      }

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;

      const outputContext = outputCanvas.getContext("2d", {
        alpha: true,
      });

      if (!outputContext) {
        throw new Error("Could not initialize the transparent video canvas.");
      }

      /*
       * Use a manually driven canvas stream so a frame is requested only
       * after its corresponding segmentation mask has been drawn.
       */
      canvasStream = outputCanvas.captureStream(0);

      const canvasTrack = canvasStream.getVideoTracks()[0] as
        | CanvasCaptureMediaStreamTrack
        | undefined;

      if (!canvasTrack || typeof canvasTrack.requestFrame !== "function") {
        throw new Error(
          "Manual canvas frame capture is unavailable in this browser.",
        );
      }

      /*
       * Audio and video are recorded in one MediaRecorder session.
       * AudioContext receives the audio from the same source video element,
       * then supplies a real-time audio track to the canvas stream.
       */
      try {
        const AudioContextConstructor =
          window.AudioContext ??
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (AudioContextConstructor) {
          audioContext = new AudioContextConstructor();

          const source = audioContext.createMediaElementSource(video);
          audioDestination = audioContext.createMediaStreamDestination();

          source.connect(audioDestination);

          /*
           * Do not connect the source to the speakers. The input element
           * stays muted for playback, but its Web Audio stream is recorded.
           */
          audioDestination.stream.getAudioTracks().forEach((track) => {
            canvasStream?.addTrack(track);
          });

          await audioContext.resume();
        }
      } catch (audioError) {
        console.warn(
          "Could not initialize captured audio. Continuing with video only.",
          audioError,
        );
      }

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 6_000_000,
        audioBitsPerSecond: 160_000,
      });

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onerror = () => {
        recorderError = new Error("The processed video recording failed.");
        failRecording(recorderError);
      };

      recorder.onstop = () => {
        if (recorderError) {
          failRecording(recorderError);
          return;
        }

        settleRecording(
          new Blob(chunks, {
            type: recorder?.mimeType || mimeType,
          }),
        );
      };

      /*
       * Each result uses the frozen source frame that was sent to MediaPipe.
       * Clear first to prevent old pixels from freezing behind a new frame.
       */
      segmentation.onResults((results) => {
        if (
          cancelledRef.current ||
          processingFinished ||
          frameError
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

          canvasTrack.requestFrame();
          processedFrames += 1;
        } catch (caught) {
          try {
            outputContext.restore();
          } catch {
            // Ignore canvas cleanup errors.
          }

          frameError = new Error(
            `Could not render a processed frame: ${getErrorMessage(
              caught,
              "unknown rendering error",
            )}`,
          );
        }
      });

      /*
       * Only one segmentation request may be in flight at a time.
       * The source video continues playing on its own clock; if AI processing
       * is slower than playback, some frames are skipped rather than delaying
       * audio or allowing old results to overwrite newer frames.
       */
      const processFrame = async () => {
        if (
          !video ||
          !segmentation ||
          cancelledRef.current ||
          processingFinished ||
          frameError ||
          video.paused ||
          video.ended ||
          frameBusy
        ) {
          return;
        }

        frameBusy = true;

        try {
          if (
            video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            frameContext.drawImage(video, 0, 0, width, height);
            await segmentation.send({ image: frameCanvas });
          }
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
          processingFinished ||
          frameError ||
          !video ||
          video.paused ||
          video.ended
        ) {
          return;
        }

        scheduleNextFrame();
      };

      const scheduleNextFrame = () => {
        if (
          !video ||
          cancelledRef.current ||
          processingFinished ||
          frameError ||
          video.paused ||
          video.ended
        ) {
          return;
        }

        const frameVideo = video as VideoWithFrameCallback;

        if (typeof frameVideo.requestVideoFrameCallback === "function") {
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
       * Produce a valid first frame before recording begins.
       */
      frameContext.drawImage(video, 0, 0, width, height);
      await segmentation.send({ image: frameCanvas });

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (frameError) throw frameError;

      if (processedFrames === 0) {
        throw new Error(
          "AI segmentation did not produce a frame. Please try again.",
        );
      }

      /*
       * Start recording before playback so audio and video share the same
       * recording start. Reset the single source clock to zero.
       */
      video.pause();

      video.currentTime = 0;
      await new Promise<void>((resolve, reject) => {
        if (!video) {
          reject(new Error("The source video is unavailable."));
          return;
        }

        if (video.currentTime === 0) {
          resolve();
          return;
        }

        const onSeeked = () => {
          cleanup();
          resolve();
        };

        const onError = () => {
          cleanup();
          reject(new Error("Could not seek to the start of the video."));
        };

        const cleanup = () => {
          video?.removeEventListener("seeked", onSeeked);
          video?.removeEventListener("error", onError);
        };

        video.addEventListener("seeked", onSeeked, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

      /*
       * Refresh the canvas at t=0 after seeking. This prevents the first
       * recorded frame from containing a frame from the previous position.
       */
      await waitForCurrentFrame(video);
      frameContext.drawImage(video, 0, 0, width, height);
      await segmentation.send({ image: frameCanvas });

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (frameError) throw frameError;

      recorder.start(250);

      const endedPromise = new Promise<void>((resolve, reject) => {
        if (!video) {
          reject(new Error("The source video is unavailable."));
          return;
        }

        const onEnded = () => {
          cleanup();
          resolve();
        };

        const onError = () => {
          cleanup();
          reject(new Error("The source video encountered a playback error."));
        };

        const cleanup = () => {
          video?.removeEventListener("ended", onEnded);
          video?.removeEventListener("error", onError);
        };

        video.addEventListener("ended", onEnded, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

      /*
       * Play only the video element. Its audio track is sent through the
       * AudioContext to MediaRecorder; no second audio element is started.
       */
      await video.play();
      scheduleNextFrame();

      progressInterval = window.setInterval(() => {
        if (cancelledRef.current) return;

        if (frameError) {
          failRecording(frameError);
          video?.pause();
          return;
        }

        if (video) {
          setProgress(
            Math.min(
              99,
              Math.floor((video.currentTime / sourceDuration) * 100),
            ),
          );
        }
      }, 100);

      await endedPromise;

      /*
       * Let the last in-flight frame finish before stopping the recording.
       */
      while (frameBusy && !cancelledRef.current && !frameError) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 10));
      }

      cancelScheduledFrame();

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (frameError) throw frameError;

      processingFinished = true;
      video.pause();

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
          "The processed video is incomplete. Try a shorter video or a newer browser.",
        );
      }

      const baseName = file.name.replace(/\.[^.]+$/, "");
      const outputFile = new File(
        [outputBlob],
        `${baseName}-no-background.webm`,
        { type: outputBlob.type || "video/webm" },
      );

      const outputAsset = await createAssetFromFile(outputFile);

      if (!outputAsset) {
        throw new Error(
          "Could not add the processed video to your media library.",
        );
      }

      const generatedClip = createClipFromAsset(outputAsset, sourceClip.start);

      /*
       * The processed media begins at zero and contains the complete source
       * video. Preserve timeline placement and trims from the selected clip.
       */
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
          // Preserve the original error.
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

      try {
        await audioContext?.close();
      } catch {
        // Ignore audio cleanup errors.
      }

      if (inputUrl) URL.revokeObjectURL(inputUrl);

      busyRef.current = false;
      setRemovingBackground(false);
    }
  }, [assets, selectedClip, onAssetCreated, onClipCreated]);

  return {
    removingBackground,
    progress,
    error,
    removeSelectedBackground,
    cancelRemoval,
  };
}
