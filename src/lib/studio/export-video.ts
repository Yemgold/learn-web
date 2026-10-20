




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
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return (
    candidates.find((type) => MediaRecorder.isTypeSupported(type)) ??
    ""
  );
}

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

/**
 * Export a canvas as a WebM video.
 *
 * Note: this records what is drawn on the canvas. It does not automatically
 * render the editor timeline, transitions, or media clips.
 */
export async function exportVideo({
  canvas,
  duration,
  fps = 30,
  fileName = "learnyfi-studio-export.webm",
  audioTracks = [],
  onProgress,
  onError,
}: ExportVideoOptions): Promise<ExportVideoResult> {
  try {
    if (typeof window === "undefined") {
      throw new Error("Video export is only available in the browser.");
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("A valid preview canvas is required.");
    }

    if (typeof MediaRecorder === "undefined") {
      throw new Error(
        "Your browser does not support video recording. Try a recent version of Chrome or Edge.",
      );
    }

    if (typeof canvas.captureStream !== "function") {
      throw new Error("Canvas video capture is not supported by this browser.");
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error("Export duration must be greater than zero.");
    }

    const safeFps = Math.max(1, Math.min(60, Math.floor(fps)));
    const mimeType = getSupportedMimeType();

    if (!mimeType) {
      throw new Error("This browser does not support WebM video export.");
    }

    const canvasStream = canvas.captureStream(safeFps);
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks.filter((track) => track.readyState === "live"),
    ]);

    const chunks: BlobPart[] = [];

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 5_000_000,
    });

    const resultPromise = new Promise<ExportVideoResult>(
      (resolve, reject) => {
        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onerror = () => {
          reject(new Error("An error occurred while recording the video."));
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });

          if (blob.size === 0) {
            reject(new Error("The exported video is empty."));
            return;
          }

          resolve({
            blob,
            fileName: fileName.endsWith(".webm")
              ? fileName
              : `${fileName}.webm`,
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
        const progress = Math.min(100, (elapsed / durationMs) * 100);

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
    const exportError =
      error instanceof Error
        ? error
        : new Error("Video export failed unexpectedly.");

    onError?.(exportError);
    throw exportError;
  }
}

/**
 * Trigger a browser download for an exported video.
 */
export function downloadExportedVideo(
  blob: Blob,
  fileName = "learnyfi-studio-export.webm",
): void {
  if (typeof document === "undefined") {
    throw new Error("Downloads are only available in the browser.");
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName.endsWith(".webm")
    ? fileName
    : `${fileName}.webm`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  // Give the browser time to begin the download before releasing the URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
