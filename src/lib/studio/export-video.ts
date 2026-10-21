



export interface ExportVideoOptions {
  canvas: HTMLCanvasElement;
  duration: number;
  fps?: number;
  fileName?: string;
  audioTracks?: MediaStreamTrack[];
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

export interface ExportVideoResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
}

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  // Prefer MP4 only when the browser genuinely supports recording it.
  // Otherwise, fall back to WebM.
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
    .replace(/\.(mp4|webm)$/i, "")
    .trim();

  return `${baseName || "learnyfi-studio-export"}${extension}`;
}

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function getExportError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error("Video export failed unexpectedly.");
}

/**
 * Records the composition already rendered on the supplied canvas.
 *
 * IMPORTANT:
 * This function never changes canvas.width or canvas.height.
 * The dimensions supplied by the caller determine the recording
 * dimensions. For example:
 *
 * Portrait:  1080 x 1920
 * Landscape: 1920 x 1080
 * Square:    1080 x 1080
 * Standard:  1440 x 1080
 *
 * The caller must render every timeline frame onto this canvas.
 * Audio tracks supplied by the caller are added to the recorded stream.
 *
 * MP4 is used only when the browser supports it. Otherwise, WebM is used.
 */
export async function exportVideo({
  canvas,
  duration,
  fps = 30,
  fileName = "learnyfi-studio-export",
  audioTracks = [],
  onProgress,
  onError,
}: ExportVideoOptions): Promise<ExportVideoResult> {
  let canvasStream: MediaStream | null = null;
  let combinedStream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;

  let reportedError: Error | null = null;

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

    // Capture the existing canvas dimensions. Do not resize this canvas
    // here: the studio page is responsible for choosing the aspect ratio.
    const exportWidth = canvas.width;
    const exportHeight = canvas.height;

    console.info("[Learnyfi Studio] Starting video export", {
      width: exportWidth,
      height: exportHeight,
      aspectRatio: `${exportWidth}:${exportHeight}`,
      fps: safeFps,
      duration,
      mimeType,
    });

    canvasStream = canvas.captureStream(safeFps);

    const videoTracks = canvasStream.getVideoTracks();

    if (videoTracks.length === 0) {
      throw new Error(
        "The canvas did not provide a video track for recording.",
      );
    }

    const liveAudioTracks = audioTracks.filter(
      (track) => track.readyState === "live",
    );

    combinedStream = new MediaStream([
      ...videoTracks,
      ...liveAudioTracks,
    ]);

    const chunks: BlobPart[] = [];

    recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 8_000_000,
      ...(mimeType.toLowerCase().startsWith("video/webm")
        ? { audioBitsPerSecond: 192_000 }
        : {}),
    });

    const activeRecorder = recorder;

    const resultPromise = new Promise<ExportVideoResult>(
      (resolve, reject) => {
        activeRecorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        activeRecorder.onerror = () => {
          reject(
            new Error(
              "Recording failed. Try a shorter video or a lower resolution.",
            ),
          );
        };

        activeRecorder.onstop = () => {
          const blob = new Blob(chunks, {
            type: mimeType,
          });

          if (blob.size === 0) {
            reject(new Error("The exported video is empty."));
            return;
          }

          resolve({
            blob,
            fileName: normalizeFileName(fileName, mimeType),
            mimeType,
            width: exportWidth,
            height: exportHeight,
          });
        };
      },
    );

    recorder.start(250);

    const startTime = performance.now();
    const durationMs = duration * 1000;

    try {
      while (true) {
        await waitForFrame();

        const elapsed = performance.now() - startTime;
        const progress = Math.min(
          99,
          (elapsed / durationMs) * 100,
        );

        onProgress?.(Math.round(progress));

        if (elapsed >= durationMs) {
          break;
        }
      }
    } finally {
      if (recorder.state !== "inactive") {
        // Request the final data before stopping the stream tracks.
        recorder.stop();
      }
    }

    // Wait for the recorder's final data and stop event before cleanup.
    const result = await resultPromise;

    onProgress?.(100);

    console.info("[Learnyfi Studio] Video export completed", {
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
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // Ignore cleanup errors while handling an export failure.
      }
    }

    combinedStream?.getTracks().forEach((track) => {
      if (track.readyState !== "ended") {
        track.stop();
      }
    });

    canvasStream?.getTracks().forEach((track) => {
      if (track.readyState !== "ended") {
        track.stop();
      }
    });

    if (reportedError) {
      console.error(
        "[Learnyfi Studio] Video export failed:",
        reportedError,
      );
    }
  }
}

/**
 * Downloads the recorded video using its actual format and file extension.
 */
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
  const normalizedFileName = normalizeFileName(
    fileName,
    mimeType,
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = normalizedFileName;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 5000);
}
