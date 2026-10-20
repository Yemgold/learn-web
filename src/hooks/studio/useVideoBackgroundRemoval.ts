



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
  setOptions: (options: {
    modelSelection: number;
  }) => void;
  onResults: (
    callback: (results: SegmentationResults) => void,
  ) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
}

type SelfieSegmentationConstructor = new (options: {
  locateFile: (file: string) => string;
}) => SelfieSegmentationInstance;

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

    if (!selectedClip) {
      setError("Select a video clip first.");
      return;
    }

    if (selectedClip.kind !== "video") {
      setError("Select a video clip to remove its background.");
      return;
    }

    const asset = assets.find(
      (item) => item.id === selectedClip.assetId,
    );

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
      setError(
        "Your browser does not support recording a processed video.",
      );
      return;
    }

    busyRef.current = true;
    cancelledRef.current = false;
    setRemovingBackground(true);
    setProgress(0);
    setError(null);

    let inputUrl: string | null = null;
    let outputStream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    let segmentation: SelfieSegmentationInstance | null = null;

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

      segmentation.setOptions({
        modelSelection: 1,
      });

      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";

      inputUrl = URL.createObjectURL(file);
      video.src = inputUrl;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () =>
          reject(new Error("Could not load the selected video."));
        video.load();
      });

      const width = video.videoWidth;
      const height = video.videoHeight;
      const videoDuration = video.duration;

      if (!width || !height || !Number.isFinite(videoDuration)) {
        throw new Error("The selected video has invalid dimensions or duration.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", {
        alpha: true,
      });

      if (!context) {
        throw new Error("Could not create the video processing canvas.");
      }

      const mimeType = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));

      if (!mimeType) {
        throw new Error(
          "Your browser cannot export transparent WebM video.",
        );
      }

      outputStream = canvas.captureStream(24);

      recorder = new MediaRecorder(outputStream, {
        mimeType,
        videoBitsPerSecond: 5_000_000,
      });

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      const recordingFinished = new Promise<Blob>((resolve, reject) => {
        if (!recorder) {
          reject(new Error("Video recorder could not start."));
          return;
        }

        recorder.onerror = () => {
          reject(new Error("An error occurred while recording the video."));
        };

        recorder.onstop = () => {
          resolve(
            new Blob(chunks, {
              type: mimeType,
            }),
          );
        };
      });

      let processingFrame = false;
      let frameError: Error | null = null;
      let processedFrames = 0;
      let lastProgressUpdate = 0;

      const processFrame = async () => {
        if (
          cancelledRef.current ||
          video.ended ||
          video.paused ||
          processingFrame
        ) {
          return;
        }

        processingFrame = true;

        try {
          await segmentation!.send({
            image: video,
          });

          processedFrames += 1;

          const now = performance.now();

          if (now - lastProgressUpdate > 150) {
            setProgress(
              Math.min(
                99,
                Math.round((video.currentTime / videoDuration) * 100),
              ),
            );
            lastProgressUpdate = now;
          }
        } catch {
          frameError = new Error(
            "Video segmentation failed while processing a frame.",
          );
          video.pause();
        } finally {
          processingFrame = false;
        }
      };

      segmentation.onResults((results) => {
        if (cancelledRef.current || frameError) return;

        context.clearRect(0, 0, width, height);
        context.drawImage(video, 0, 0, width, height);

        context.globalCompositeOperation = "destination-in";
        context.drawImage(
          results.segmentationMask,
          0,
          0,
          width,
          height,
        );

        context.globalCompositeOperation = "source-over";
      });

      video.onseeked = () => {
        void processFrame();
      };

      video.onended = () => {
        if (recorder?.state === "recording") {
          recorder.stop();
        }
      };

      recorder.start(250);

      await video.play();

      // Process frames as the video advances. MediaPipe produces the
      // person mask, which is applied to the canvas alpha channel.
      const frameLoop = () => {
        if (cancelledRef.current || frameError || video.ended) {
          if (video.ended && recorder?.state === "recording") {
            recorder.stop();
          }
          return;
        }

        if (!video.paused) {
          void processFrame();
          requestAnimationFrame(frameLoop);
        }
      };

      requestAnimationFrame(frameLoop);

      await new Promise<void>((resolve, reject) => {
        const check = window.setInterval(() => {
          if (cancelledRef.current) {
            window.clearInterval(check);
            video.pause();

            if (recorder?.state === "recording") {
              recorder.stop();
            }

            reject(new Error("Background removal cancelled."));
            return;
          }

          if (frameError) {
            window.clearInterval(check);
            video.pause();

            if (recorder?.state === "recording") {
              recorder.stop();
            }

            reject(frameError);
            return;
          }

          if (video.ended) {
            window.clearInterval(check);
            resolve();
          }
        }, 100);
      });

      const outputBlob = await recordingFinished;

      if (cancelledRef.current) {
        throw new Error("Background removal cancelled.");
      }

      if (!outputBlob.size || processedFrames === 0) {
        throw new Error("No processed video frames were recorded.");
      }

      const outputFile = new File(
        [outputBlob],
        `${file.name.replace(/\.[^.]+$/, "")}-no-background.webm`,
        {
          type: "video/webm",
        },
      );

      const outputAsset = await createAssetFromFile(outputFile);

      if (!outputAsset) {
        throw new Error("Could not create the processed video asset.");
      }

      onAssetCreated?.(outputAsset);

      const outputClip = createClipFromAsset(outputAsset, selectedClip.start);

      onClipCreated?.({
        ...outputClip,
        track: selectedClip.track,
      });

      setProgress(100);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Video background removal failed.";

      setError(message);
    } finally {
      segmentation?.close();

      if (recorder?.state === "recording") {
        recorder.stop();
      }

      outputStream?.getTracks().forEach((track) => track.stop());

      if (inputUrl) {
        URL.revokeObjectURL(inputUrl);
      }

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
