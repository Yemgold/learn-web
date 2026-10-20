



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
      setError("Select a video clip first.");
      return;
    }

    const asset = assets.find((item) => item.id === selectedClip.assetId);
    const file = selectedClip.file ?? asset?.file;

    if (!file || !file.type.startsWith("video/")) {
      setError("The selected video file is unavailable.");
      return;
    }

    if (
      typeof window === "undefined" ||
      !("MediaRecorder" in window) ||
      !HTMLCanvasElement.prototype.captureStream
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
    let frameCallbackId: number | null = null;
    let rafId: number | null = null;
    let checkId: number | null = null;
    let stopped = false;

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
        new Promise<void>((resolve, reject) => {
          if (!video) return reject(new Error("Video could not be created."));
          video.onloadedmetadata = () => resolve();
          video.onerror = () =>
            reject(new Error("Could not load the selected video."));
          video.load();
        }),
        new Promise<void>((resolve, reject) => {
          if (!audio) return reject(new Error("Audio could not be created."));
          audio.onloadedmetadata = () => resolve();
          audio.onerror = () =>
            reject(new Error("Could not load the original audio track."));
          audio.load();
        }),
      ]);

      const width = video.videoWidth;
      const height = video.videoHeight;
      const duration = video.duration;

      if (
        !width ||
        !height ||
        !Number.isFinite(duration) ||
        duration <= 0
      ) {
        throw new Error("The selected video has invalid dimensions or duration.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { alpha: true });

      if (!context) {
        throw new Error("Could not create the processing canvas.");
      }

      const mimeType = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));

      if (!mimeType) {
        throw new Error("Your browser cannot export WebM video.");
      }

      outputStream = canvas.captureStream(30);

      // Capture the original audio separately and combine it with the
      // processed canvas stream so the person's voice is not discarded.
      const captureAudio = (
        audio as HTMLAudioElement & {
          captureStream?: () => MediaStream;
          mozCaptureStream?: () => MediaStream;
        }
      ).captureStream ??
        (
          audio as HTMLAudioElement & {
            mozCaptureStream?: () => MediaStream;
          }
        ).mozCaptureStream;

      if (!captureAudio) {
        throw new Error(
          "Your browser cannot capture the original audio. Try the latest Chrome or Edge.",
        );
      }

      audioStream = captureAudio.call(audio);

      const audioTracks = audioStream.getAudioTracks();

      if (audioTracks.length === 0) {
        throw new Error(
          "No audio track was detected. Check that the original video contains audio.",
        );
      }

      audioTracks.forEach((track) => outputStream?.addTrack(track));

      recorder = new MediaRecorder(outputStream, {
        mimeType,
        videoBitsPerSecond: 5_000_000,
        audioBitsPerSecond: 128_000,
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      const recordingFinished = new Promise<Blob>((resolve, reject) => {
        if (!recorder) {
          reject(new Error("Video recorder could not start."));
          return;
        }

        recorder.onerror = () =>
          reject(new Error("An error occurred while recording the video."));

        recorder.onstop = () => {
          resolve(
            new Blob(chunks, {
              type: recorder?.mimeType || mimeType,
            }),
          );
        };
      });

      let frameBusy = false;
      let frameError: Error | null = null;
      let processedFrames = 0;
      let lastProgressUpdate = 0;

      segmentation.onResults((results) => {
        if (cancelledRef.current || frameError) return;

        context.save();
        context.clearRect(0, 0, width, height);

        // Draw the person first, then use the segmentation mask to remove
        // pixels outside the person. The cleared pixels remain transparent.
        context.drawImage(video!, 0, 0, width, height);
        context.globalCompositeOperation = "destination-in";
        context.drawImage(results.segmentationMask, 0, 0, width, height);
        context.restore();

        processedFrames += 1;

        const now = performance.now();

        if (now - lastProgressUpdate > 150) {
          setProgress(
            Math.min(99, Math.round((video!.currentTime / duration) * 100)),
          );
          lastProgressUpdate = now;
        }
      });

      const processNextFrame = async () => {
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
            "Video segmentation failed while processing a frame.",
          );
        } finally {
          frameBusy = false;
        }

        if (!cancelledRef.current && !frameError && !video.ended) {
          scheduleNextFrame();
        }
      };

      const scheduleNextFrame = () => {
        if (!video || cancelledRef.current || frameError || video.ended) {
          return;
        }

        const frameVideo = video as VideoWithFrameCallback;

        if (frameVideo.requestVideoFrameCallback) {
          frameCallbackId = frameVideo.requestVideoFrameCallback(() => {
            void processNextFrame();
          });
        } else {
          rafId = requestAnimationFrame(() => {
            void processNextFrame();
          });
        }
      };

      const stopRecorder = () => {
        if (stopped) return;
        stopped = true;

        if (recorder?.state === "recording") {
          recorder.stop();
        }
      };

      recorder.start(500);

      // Start both elements together; the audio element supplies the
      // audio track while the muted video element supplies segmentation frames.
      const playbackResults = await Promise.allSettled([
        video.play(),
        audio.play(),
      ]);

      if (playbackResults.some((result) => result.status === "rejected")) {
        throw new Error(
          "Video or audio playback could not start. Try again after checking browser permissions.",
        );
      }

      scheduleNextFrame();

      await new Promise<void>((resolve, reject) => {
        checkId = window.setInterval(() => {
          if (cancelledRef.current) {
            reject(new Error("Background removal cancelled."));
            return;
          }

          if (frameError) {
            reject(frameError);
            return;
          }

          if (video?.ended) {
            resolve();
          }
        }, 100);
      });

      if (checkId !== null) {
        window.clearInterval(checkId);
        checkId = null;
      }

      // Wait for any outstanding segmentation request before ending the file.
      while (frameBusy && !cancelledRef.current && !frameError) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (frameError) throw frameError;

      stopRecorder();

      const outputBlob = await recordingFinished;

      if (!outputBlob.size || processedFrames === 0) {
        throw new Error("No processed video frames were recorded.");
      }

      // Guard against a recording that ended substantially earlier than
      // the source. WebM duration can vary slightly due to encoder timing.
      if (outputBlob.size < 1000) {
        throw new Error("The processed video is empty or incomplete.");
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

      // Keep the output clip's duration and timeline position aligned with
      // the source clip instead of relying on a potentially inaccurate default.
      const outputClip = createClipFromAsset(outputAsset, selectedClip.start);

      onAssetCreated?.(outputAsset);
      onClipCreated?.({
        ...outputClip,
        track: selectedClip.track,
        start: selectedClip.start,
        duration: Math.min(outputClip.duration, selectedClip.duration),
        trimStart: 0,
        trimEnd: 0,
      });

      setProgress(100);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Video background removal failed.",
      );
    } finally {
      if (checkId !== null) window.clearInterval(checkId);
      if (rafId !== null) cancelAnimationFrame(rafId);

      if (frameCallbackId !== null && video) {
        (video as VideoWithFrameCallback).cancelVideoFrameCallback?.(
          frameCallbackId,
        );
      }

      video?.pause();
      audio?.pause();

      segmentation?.close();

      if (recorder?.state === "recording") {
        recorder.stop();
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
