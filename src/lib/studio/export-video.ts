
export interface ExportVideoOptions {
  canvas: HTMLCanvasElement;
  duration: number;
  fps?: number;
  fileName?: string;
  audioTracks?: MediaStreamTrack[];
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;

  /**
   * Render the composition at the supplied project time in seconds.
   * When provided, this exporter drives the rendering clock.
   */
  renderFrame?: (projectTime: number) => void;
}

export interface ExportVideoResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
}

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";

  const candidates = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return (
    candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
  );
}

function getExtension(mimeType: string): string {
  return mimeType.toLowerCase().startsWith("video/mp4")
    ? ".mp4"
    : ".webm";
}

function normalizeFileName(
  fileName: string,
  mimeType: string,
): string {
  const extension = getExtension(mimeType);

  const baseName = fileName
    .trim()
    .replace(/\.(mp4|webm)$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .trim();

  return `${baseName || "learnyfi-studio-export"}${extension}`;
}

function getExportError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Video export failed unexpectedly.");
}

function waitForAnimationFrame(): Promise<number> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

export async function exportVideo({
  canvas,
  duration,
  fps = 30,
  fileName = "learnyfi-studio-export",
  audioTracks = [],
  onProgress,
  onError,
  renderFrame,
}: ExportVideoOptions): Promise<ExportVideoResult> {
  let canvasStream: MediaStream | null = null;
  let combinedStream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;
  let reportedError: Error | null = null;
  let stopRequested = false;

  try {
    if (typeof window === "undefined") {
      throw new Error("Video export is only available in the browser.");
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("A valid composition canvas is required.");
    }

    if (canvas.width <= 0 || canvas.height <= 0) {
      throw new Error("The export canvas has invalid dimensions.");
    }

    if (typeof MediaRecorder === "undefined") {
      throw new Error(
        "Video recording is not supported. Try a recent version of Chrome or Edge.",
      );
    }

    if (typeof canvas.captureStream !== "function") {
      throw new Error(
        "Canvas recording is not supported by this browser.",
      );
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error("Export duration must be greater than zero.");
    }

    if (!Number.isFinite(fps) || fps <= 0) {
      throw new Error("Export frame rate must be greater than zero.");
    }

    const safeFps = Math.max(1, Math.min(60, Math.floor(fps)));
    const mimeType = getSupportedMimeType();

    if (!mimeType) {
      throw new Error(
        "Your browser does not support MP4 or WebM recording.",
      );
    }

    // Preserve the dimensions chosen by StudioPage's aspect-ratio setting.
    const exportWidth = canvas.width;
    const exportHeight = canvas.height;

    console.info("[Learnyfi Studio] Starting export", {
      width: exportWidth,
      height: exportHeight,
      fps: safeFps,
      duration,
      mimeType,
      clockControlledRendering: Boolean(renderFrame),
    });

    // Render time zero before recording starts so the first frame is ready.
    renderFrame?.(0);

    canvasStream = canvas.captureStream(safeFps);

    const videoTracks = canvasStream.getVideoTracks();

    if (videoTracks.length === 0) {
      throw new Error("The canvas did not provide a video track.");
    }

    const liveAudioTracks = audioTracks.filter(
      (track) => track.readyState === "live",
    );

    combinedStream = new MediaStream([
      ...videoTracks,
      ...liveAudioTracks,
    ]);

    const recorderOptions: MediaRecorderOptions = {
      mimeType,
      videoBitsPerSecond: 8_000_000,
    };

    if (mimeType.toLowerCase().startsWith("video/webm")) {
      recorderOptions.audioBitsPerSecond = 192_000;
    }

    recorder = new MediaRecorder(combinedStream, recorderOptions);

    const chunks: Blob[] = [];
    let resolveRecording!: (result: ExportVideoResult) => void;
    let rejectRecording!: (error: Error) => void;

    const recordingResult = new Promise<ExportVideoResult>(
      (resolve, reject) => {
        resolveRecording = resolve;
        rejectRecording = reject;
      },
    );

    recorder.addEventListener("dataavailable", (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    recorder.addEventListener(
      "error",
      () => {
        rejectRecording(
          new Error(
            "Recording failed. Try a shorter video or a lower resolution.",
          ),
        );
      },
      { once: true },
    );

    recorder.addEventListener(
      "stop",
      () => {
        const blob = new Blob(chunks, { type: mimeType });

        if (blob.size === 0) {
          rejectRecording(new Error("The exported video is empty."));
          return;
        }

        resolveRecording({
          blob,
          fileName: normalizeFileName(fileName, mimeType),
          mimeType,
          width: exportWidth,
          height: exportHeight,
        });
      },
      { once: true },
    );

    recorder.start(250);

    const startedAt = performance.now();
    let lastReportedProgress = -1;

    try {
      while (!stopRequested) {
        const now = await waitForAnimationFrame();
        const elapsed = Math.max(0, (now - startedAt) / 1000);
        const projectTime = Math.min(elapsed, duration);

        // Rendering and export progress share this single master clock.
        if (renderFrame) {
          renderFrame(projectTime);
        }

        const progress = Math.min(
          99,
          Math.floor((projectTime / duration) * 100),
        );

        if (progress !== lastReportedProgress) {
          lastReportedProgress = progress;
          onProgress?.(progress);
        }

        if (elapsed >= duration) {
          break;
        }
      }
    } catch (error) {
      throw getExportError(error);
    } finally {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }

    // Do not return or download until the recorder has emitted its final data.
    const result = await recordingResult;

    onProgress?.(100);

    console.info("[Learnyfi Studio] Export completed", {
      width: result.width,
      height: result.height,
      mimeType: result.mimeType,
      fileName: result.fileName,
      sizeBytes: result.blob.size,
    });

    return result;
  } catch (error) {
    const exportError = getExportError(error);
    reportedError = exportError;

    onError?.(exportError);
    throw exportError;
  } finally {
    stopRequested = true;

    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // Ignore errors during final cleanup.
      }
    }

    combinedStream?.getTracks().forEach((track) => {
      if (track.readyState !== "ended") track.stop();
    });

    canvasStream?.getTracks().forEach((track) => {
      if (track.readyState !== "ended") track.stop();
    });

    if (reportedError) {
      console.error(
        "[Learnyfi Studio] Export failed:",
        reportedError,
      );
    }
  }
}

export function downloadExportedVideo(
  blob: Blob,
  fileName = "learnyfi-studio-export",
): void {
  if (typeof document === "undefined") {
    throw new Error("Downloads are only available in the browser.");
  }

  if (blob.size === 0) {
    throw new Error("Cannot download an empty video.");
  }

  const mimeType = blob.type || "video/webm";
  const normalizedFileName = normalizeFileName(fileName, mimeType);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = normalizedFileName;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
