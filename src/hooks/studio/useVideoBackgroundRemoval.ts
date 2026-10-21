

"use client";

import { useCallback, useRef, useState } from "react";
import type { Asset, Clip } from "@/lib/studio/types";
import { createAssetFromFile, createClipFromAsset } from "@/lib/studio/utils";

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
  send(input: { image: HTMLVideoElement }): Promise<void>;
  close(): void;
}

type SelfieSegmentationConstructor = new (options: {
  locateFile: (file: string) => string;
}) => SelfieSegmentationInstance;

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: { mediaTime: number }) => void,
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
      element.removeEventListener("loadedmetadata", handleLoaded);
      element.removeEventListener("error", handleError);
    };

    const handleLoaded = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error(`Could not load ${description}.`));
    };

    element.addEventListener("loadedmetadata", handleLoaded, { once: true });
    element.addEventListener("error", handleError, { once: true });
    element.load();
  });
}

function waitForMediaEnd(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };

    const handleEnded = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error("The source video encountered a playback error."));
    };

    if (video.ended || video.currentTime >= video.duration) {
      resolve();
      return;
    }

    video.addEventListener("ended", handleEnded, { once: true });
    video.addEventListener("error", handleError, { once: true });
  });
}

function chooseRecorderMimeType(): string {
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

  const rejectRecordingWaitRef = useRef<
  ((reason: Error) => void) | null
>(null);

  const removeSelectedBackground = useCallback(async () => {
    if (busyRef.current) return;

    if (!selectedClip || selectedClip.kind !== "video") {
      setError("Select a video clip first.");
      return;
    }

    const sourceClip = selectedClip;
    const sourceAsset = assets.find((item) => item.id === sourceClip.assetId);
    const file = sourceClip.file ?? sourceAsset?.file;

    if (!file || !file.type.startsWith("video/")) {
      setError("The selected original video file is unavailable.");
      return;
    }

    if (
      typeof window === "undefined" ||
      !("MediaRecorder" in window) ||
      typeof HTMLCanvasElement.prototype.captureStream !== "function"
    ) {
      setError("Your browser does not support video recording.");
      return;
    }

    busyRef.current = true;
    cancelledRef.current = false;
    setRemovingBackground(true);
    setProgress(0);
    setError(null);

    let inputUrl: string | null = null;
    let outputStream: MediaStream | null = null;
    let audioStream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    let segmentation: SelfieSegmentationInstance | null = null;
    let video: HTMLVideoElement | null = null;
    let audio: HTMLAudioElement | null = null;
    let canvasTrack: CanvasCaptureMediaStreamTrack | null = null;
    let frameCallbackId: number | null = null;
    let rafId: number | null = null;
    let progressInterval: number | null = null;
    let frameBusy = false;
    let frameError: Error | null = null;
    let processedFrames = 0;
    let recordingFinished: Promise<Blob> | null = null;
    let rejectRecordingWait: ((reason?: unknown) => void) | null = null;
    let recorderStopped = false;

    try {
      const mediaPipe = await import("@mediapipe/selfie_segmentation");

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      const Segmentation =
        mediaPipe.SelfieSegmentation as unknown as SelfieSegmentationConstructor;

      segmentation = new Segmentation({
        locateFile: (fileName) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${fileName}`,
      });

      segmentation.setOptions({ modelSelection: 1 });

      video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";

      audio = document.createElement("audio");
      audio.preload = "auto";
      audio.volume = 1;

      inputUrl = URL.createObjectURL(file);
      video.src = inputUrl;
      audio.src = inputUrl;

      await Promise.all([
        waitForMetadata(video, "the source video"),
        waitForMetadata(audio, "the source audio"),
      ]);

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
          "The original video has invalid dimensions or duration.",
        );
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { alpha: true });

      if (!context) {
        throw new Error("Could not create the transparent processing canvas.");
      }

      const mimeType = chooseRecorderMimeType();

      if (!mimeType) {
        throw new Error("Your browser cannot export WebM video.");
      }

      // Manual frame capture ensures the recorder receives each newly
      // processed segmentation result instead of repeatedly recording a
      // stale canvas frame.
      outputStream = canvas.captureStream(0);
      canvasTrack = outputStream.getVideoTracks()[0] as
        | CanvasCaptureMediaStreamTrack
        | undefined
        ?? null;

      if (!canvasTrack || typeof canvasTrack.requestFrame !== "function") {
        throw new Error(
          "Manual video-frame capture is not supported by this browser. Please use an up-to-date version of Chrome or Edge.",
        );
      }

      // Capture the original audio independently from the muted processing
      // video element.
      const audioElement = audio as AudioCaptureElement;
      const captureAudio =
        audioElement.captureStream ?? audioElement.mozCaptureStream;

      if (!captureAudio) {
        throw new Error(
          "This browser cannot capture source audio. Please use an up-to-date version of Chrome or Edge.",
        );
      }

      audioStream = captureAudio.call(audioElement);
      const audioTracks = audioStream.getAudioTracks();

      if (audioTracks.length === 0) {
        throw new Error(
          "No audio track was detected. Check that your original video contains audio.",
        );
      }

      audioTracks.forEach((track) => outputStream?.addTrack(track));

      recorder = new MediaRecorder(outputStream, {
        mimeType,
        videoBitsPerSecond: 5_000_000,
        audioBitsPerSecond: 128_000,
      });

      const chunks: Blob[] = [];

      recordingFinished = new Promise<Blob>((resolve, reject) => {
        if (!recorder) {
          reject(new Error("The video recorder could not be created."));
          return;
        }

        rejectRecordingWait = reject;

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) chunks.push(event.data);
        };

        recorder.onerror = () => {
          reject(new Error("An error occurred while recording the video."));
        };

        recorder.onstop = () => {
          recorderStopped = true;
          resolve(
            new Blob(chunks, {
              type: recorder?.mimeType || mimeType,
            }),
          );
        };
      });

      // Render the current source frame through the segmentation mask onto
      // a transparent canvas, then explicitly request that frame be recorded.
      segmentation.onResults((results) => {
        if (cancelledRef.current || frameError) return;

        let saved = false;

        try {
          context.save();
          saved = true;
          context.clearRect(0, 0, width, height);
          context.globalCompositeOperation = "source-over";
          context.drawImage(video!, 0, 0, width, height);
          context.globalCompositeOperation = "destination-in";
          context.drawImage(results.segmentationMask, 0, 0, width, height);
          context.restore();
          saved = false;

          canvasTrack?.requestFrame();
          processedFrames += 1;
        } catch {
          if (saved) {
            try {
              context.restore();
            } catch {
              // Ignore secondary canvas cleanup errors.
            }
          }

          frameError = new Error(
            "Could not render a processed video frame.",
          );
        }
      });

      const cancelScheduledFrame = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }

        if (frameCallbackId !== null && video) {
          (video as VideoWithFrameCallback).cancelVideoFrameCallback?.(
            frameCallbackId,
          );
          frameCallbackId = null;
        }
      };

      let processNextFrame: () => Promise<void>;

      const scheduleNextFrame = () => {
        if (
          !video ||
          cancelledRef.current ||
          frameError ||
          video.ended ||
          video.paused
        ) {
          return;
        }

        cancelScheduledFrame();

        const frameVideo = video as VideoWithFrameCallback;

        if (typeof frameVideo.requestVideoFrameCallback === "function") {
          frameCallbackId = frameVideo.requestVideoFrameCallback(() => {
            frameCallbackId = null;
            void processNextFrame();
          });
        } else {
          rafId = requestAnimationFrame(() => {
            rafId = null;
            void processNextFrame();
          });
        }
      };

      processNextFrame = async () => {
        if (
          !video ||
          !segmentation ||
          cancelledRef.current ||
          frameError ||
          video.ended ||
          video.paused
        ) {
          return;
        }

        if (frameBusy) {
          scheduleNextFrame();
          return;
        }

        frameBusy = true;

        try {
          await segmentation.send({ image: video });
        } catch {
          frameError = new Error(
            "Background segmentation failed while processing a frame.",
          );
        } finally {
          frameBusy = false;
        }

        if (!cancelledRef.current && !frameError && video && !video.ended) {
          scheduleNextFrame();
        }
      };

      recorder.start(1000);

      video.currentTime = 0;
      audio.currentTime = 0;

      const playback = await Promise.allSettled([video.play(), audio.play()]);

      if (playback.some((result) => result.status === "rejected")) {
        throw new Error(
          "Video or audio playback could not start. Try again in Chrome or Edge.",
        );
      }

      scheduleNextFrame();

      // Wait for the actual ended event, rather than guessing from elapsed
      // duration, so the final frame has a chance to be processed.
      const endedPromise = waitForMediaEnd(video);

      await new Promise<void>((resolve, reject) => {
        progressInterval = window.setInterval(() => {
          if (cancelledRef.current) {
            reject(new Error("Background removal cancelled."));
            return;
          }

          if (frameError) {
            reject(frameError);
            return;
          }

          if (!video) {
            reject(new Error("The source video is no longer available."));
            return;
          }

          const currentTime = Math.min(video.currentTime, sourceDuration);
          setProgress(
            Math.min(99, Math.floor((currentTime / sourceDuration) * 100)),
          );
        }, 100);

        endedPromise.then(resolve).catch(reject);
      });

      if (progressInterval !== null) {
        window.clearInterval(progressInterval);
        progressInterval = null;
      }

      cancelScheduledFrame();

      // The frame callback may still be awaiting MediaPipe. Do not stop the
      // recorder until that request and its onResults callback have finished.
      while (frameBusy && !cancelledRef.current && !frameError) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 20));
      }

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (frameError) throw frameError;

      // Ensure the last available source frame is represented in the output.
      if (processedFrames === 0) {
        throw new Error(
          "No video frames were processed. Please try the original video again.",
        );
      }

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

      if (outputBlob.size < 1000 || processedFrames < 2) {
        throw new Error(
          "The processed video is empty or incomplete. Try again with a shorter video or a supported source format.",
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
        throw new Error("Could not create the processed video asset.");
      }

      const generatedClip = createClipFromAsset(outputAsset, sourceClip.start);

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
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // Preserve the original error.
        }
      }

      if (recordingFinished && !recorderStopped) {
        rejectRecordingWaitRef.current?.(
  caught instanceof Error
    ? caught
    : new Error("Video background removal failed."),
);
      }

      setError(
        caught instanceof Error
          ? caught.message
          : "Video background removal failed.",
      );
    } finally {
      if (progressInterval !== null) {
        window.clearInterval(progressInterval);
      }

      if (rafId !== null) cancelAnimationFrame(rafId);

      if (frameCallbackId !== null && video) {
        (video as VideoWithFrameCallback).cancelVideoFrameCallback?.(
          frameCallbackId,
        );
      }

      video?.pause();
      audio?.pause();
      segmentation?.close();

      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // Recorder may already have stopped.
        }
      }

      outputStream?.getTracks().forEach((track) => track.stop());
      audioStream?.getTracks().forEach((track) => track.stop());

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
