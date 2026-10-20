


// src/lib/studio/utils.ts

import type { Asset, Clip, MediaKind, TrackKind } from "@/lib/studio/types";

/**
 * Generate a unique ID for studio assets, clips, and projects.
 */
export function createStudioId(prefix = "studio"): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/**
 * Format seconds as MM:SS or HH:MM:SS.
 */
export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  const pad = (value: number) => String(value).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  }

  return `${pad(minutes)}:${pad(remainingSeconds)}`;
}

/**
 * Convert a file size into a readable string.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Determine the media type from a browser File.
 */
export function getMediaKind(file: File): MediaKind | null {
  if (file.type.startsWith("video/")) {
    return "video";
  }

  if (file.type.startsWith("audio/")) {
    return "audio";
  }

  if (file.type.startsWith("image/")) {
    return "image";
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && ["mp4", "webm", "mov", "m4v", "ogv"].includes(extension)) {
    return "video";
  }

  if (
    extension &&
    ["mp3", "wav", "ogg", "aac", "m4a", "flac", "opus"].includes(extension)
  ) {
    return "audio";
  }

  if (
    extension &&
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "avif"].includes(extension)
  ) {
    return "image";
  }

  return null;
}

/**
 * Choose the default timeline track for an asset.
 */
export function getDefaultTrack(kind: MediaKind): TrackKind {
  switch (kind) {
    case "video":
      return "video";

    case "audio":
      return "audio";

    case "image":
      return "overlay";

    default:
      return "video";
  }
}

/**
 * Create an object URL for a local media file.
 * Remember to revoke it when the asset is no longer needed.
 */
export function createMediaUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Release an object URL created with URL.createObjectURL().
 */
export function revokeMediaUrl(url?: string | null): void {
  if (!url || typeof URL === "undefined") {
    return;
  }

  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Read a media file's duration.
 * Images use the supplied fallback duration.
 */
export function getMediaDuration(
  file: File,
  fallbackDuration = 5,
): Promise<number> {
  const kind = getMediaKind(file);

  if (kind === "image") {
    return Promise.resolve(fallbackDuration);
  }

  if (kind !== "video" && kind !== "audio") {
    return Promise.resolve(fallbackDuration);
  }

  return new Promise((resolve) => {
    const media = document.createElement(kind);
    const objectUrl = URL.createObjectURL(file);
    let settled = false;

    const finish = (duration: number) => {
      if (settled) return;

      settled = true;
      media.removeAttribute("src");
      media.load();
      URL.revokeObjectURL(objectUrl);

      resolve(
        Number.isFinite(duration) && duration > 0
          ? duration
          : fallbackDuration,
      );
    };

    media.preload = "metadata";

    media.onloadedmetadata = () => {
      finish(media.duration);
    };

    media.onerror = () => {
      finish(fallbackDuration);
    };

    media.src = objectUrl;
  });
}

/**
 * Read image dimensions from a local image file.
 */
export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    image.onload = () => {
      const dimensions = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };

      cleanup();
      resolve(dimensions);
    };

    image.onerror = () => {
      cleanup();
      resolve({ width: 0, height: 0 });
    };

    image.src = objectUrl;
  });
}

/**
 * Create a studio asset from an uploaded file.
 */
export async function createAssetFromFile(file: File): Promise<Asset | null> {
  const kind = getMediaKind(file);

  if (!kind) {
    return null;
  }

  const url = createMediaUrl(file);
  const duration = await getMediaDuration(file);
  let width = 0;
  let height = 0;

  if (kind === "image") {
    const dimensions = await getImageDimensions(file);
    width = dimensions.width;
    height = dimensions.height;
  }

  return {
    id: createStudioId("asset"),
    name: file.name,
    kind,
    url,
    file,
    duration,
    width,
    height,
    size: file.size,
    createdAt: Date.now(),
  };
}

/**
 * Create a timeline clip from an asset.
 */
export function createClipFromAsset(
  asset: Asset,
  start = 0,
  track: TrackKind = getDefaultTrack(asset.kind),
): Clip {
  const duration = Math.max(0.1, asset.duration ?? 5);

  return {
    id: createStudioId("clip"),
    assetId: asset.id,
    name: asset.name,
    kind: asset.kind,
    track,
    start: Math.max(0, start),
    duration,
    trimStart: 0,
    trimEnd: 0,
    url: asset.url,
    file: asset.file,
    volume: 1,
    muted: false,
  };
}

/**
 * Return the timeline end time for a clip.
 */
export function getClipEnd(clip: Clip): number {
  return clip.start + clip.duration;
}

/**
 * Return the end time of the entire timeline.
 */
export function getTimelineDuration(clips: Clip[]): number {
  if (clips.length === 0) {
    return 0;
  }

  return Math.max(...clips.map(getClipEnd));
}

/**
 * Find an asset by ID.
 */
export function findAssetById(
  assets: Asset[],
  assetId: string,
): Asset | undefined {
  return assets.find((asset) => asset.id === assetId);
}

/**
 * Find a clip by ID.
 */
export function findClipById(
  clips: Clip[],
  clipId: string,
): Clip | undefined {
  return clips.find((clip) => clip.id === clipId);
}

/**
 * Return the clip's playable source duration after trimming.
 */
export function getPlayableDuration(clip: Clip): number {
  return Math.max(0, clip.duration - clip.trimStart - clip.trimEnd);
}

/**
 * Clamp a number between a minimum and maximum.
 */
export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Sort clips by start time.
 */
export function sortClipsByStart(clips: Clip[]): Clip[] {
  return [...clips].sort((a, b) => a.start - b.start);
}