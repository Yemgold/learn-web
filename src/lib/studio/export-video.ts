




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
}

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  // Prefer a genuine MP4 recording when the browser supports it.
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
  return mimeType.toLowerCase().startsWith("video/mp4") ? ".mp4" : ".webm";
}

function normalizeFileName(
  fileName: string,
  mimeType: string,
): string {
  const extension = getExtension(mimeType);
  const baseName = fileName.replace(/\.(mp4|webm)$/i, "").trim();

  return `${baseName || "learnyfi-studio-export"}${extension}`;
}

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

/**
 * Records the composition already drawn onto a canvas.
 *
 * The caller is responsible for rendering the timeline, background image,
 * foreground video, and other visual layers onto this canvas.
 *
 * Audio tracks supplied by the caller are added to the recorded stream.
 *
 * MP4 is used only if the current browser actually supports recording it.
 * Otherwise, this function safely exports WebM.
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
  let recorder: MediaRecorder | null = null;

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

    const safeFps = Math.max(1, Math.min(60, Math.floor(fps)));
    const mimeType = getSupportedMimeType();

    if (!mimeType) {
      throw new Error(
        "Your browser does not support MP4 or WebM recording.",
      );
    }

    canvasStream = canvas.captureStream(safeFps);

    const liveAudioTracks = audioTracks.filter(
      (track) => track.readyState === "live",
    );

    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...liveAudioTracks,
    ]);

    const chunks: BlobPart[] = [];

    recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 8_000_000,
      ...(mimeType.startsWith("video/webm")
        ? { audioBitsPerSecond: 192_000 }
        : {}),
    });

    const activeRecorder = recorder;

    const resultPromise = new Promise<ExportVideoResult>(
      (resolve, reject) => {
        activeRecorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
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
          const blob = new Blob(chunks, { type: mimeType });

          if (blob.size === 0) {
            reject(new Error("The exported video is empty."));
            return;
          }

          resolve({
            blob,
            fileName: normalizeFileName(fileName, mimeType),
            mimeType,
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
        const progress = Math.min(99, (elapsed / durationMs) * 100);

        onProgress?.(Math.round(progress));

        if (elapsed >= durationMs) {
          break;
        }
      }
    } finally {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      canvasStream.getTracks().forEach((track) => track.stop());
    }

    const result = await resultPromise;

    onProgress?.(100);

    return result;
  } catch (error) {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    canvasStream?.getTracks().forEach((track) => track.stop());

    const exportError =
      error instanceof Error
        ? error
        : new Error("Video export failed unexpectedly.");

    onError?.(exportError);

    throw exportError;
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
  const normalizedFileName = normalizeFileName(fileName, mimeType);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = normalizedFileName;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}