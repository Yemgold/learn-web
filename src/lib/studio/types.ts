



// src/lib/studio/types.ts

export type MediaKind = "video" | "audio" | "image";

export type TrackKind = "video" | "audio" | "overlay";

export interface Asset {
  id: string;
  name: string;
  kind: MediaKind;
  url: string;
  file: File;
  duration?: number;
  width?: number;
  height?: number;
  size: number;
  createdAt: number;
}

export interface Clip {
  id: string;
  assetId: string;
  name: string;
  kind: MediaKind;
  track: TrackKind;
  start: number;
  duration: number;
  trimStart: number;
  trimEnd: number;
  url: string;
  file?: File;
  volume?: number;
  muted?: boolean;
}

export interface StudioProject {
  id: string;
  name: string;
  assets: Asset[];
  clips: Clip[];
  duration: number;
  createdAt: number;
  updatedAt: number;
}

export interface StudioNotice {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export interface BackgroundRemovalResult {
  asset: Asset;
  clip: Clip;
}