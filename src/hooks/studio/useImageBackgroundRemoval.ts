





"use client";

import { useCallback, useState } from "react";

import type { Asset, Clip } from "@/lib/studio/types";
import {
  createStudioId,
  createMediaUrl,
} from "@/lib/studio/utils";

interface UseImageBackgroundRemovalOptions {
  assets: Asset[];
  selectedClip: Clip | null;
  onAssetCreated: (asset: Asset) => void;
  onClipCreated: (clip: Clip) => void;
}

interface UseImageBackgroundRemovalReturn {
  removingBackground: boolean;
  error: string | null;
  removeSelectedBackground: () => Promise<Asset | null>;
  clearBackgroundRemovalError: () => void;
}

export function useImageBackgroundRemoval({
  assets,
  selectedClip,
  onAssetCreated,
  onClipCreated,
}: UseImageBackgroundRemovalOptions): UseImageBackgroundRemovalReturn {
  const [removingBackground, setRemovingBackground] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearBackgroundRemovalError = useCallback(() => {
    setError(null);
  }, []);

  const removeSelectedBackground = useCallback(async (): Promise<Asset | null> => {
    setError(null);

    if (removingBackground) return null;

    if (!selectedClip) {
      setError("Select an image clip on the timeline first.");
      return null;
    }

    if (selectedClip.kind !== "image") {
      setError("This tool removes image backgrounds only. Use the video background remover for video clips.");
      return null;
    }

    const selectedAsset = assets.find(
      (asset) => asset.id === selectedClip.assetId,
    );

    if (!selectedAsset || selectedAsset.kind !== "image") {
      setError("The selected image could not be found in your media library.");
      return null;
    }

    setRemovingBackground(true);

    try {
      const { removeBackground } = await import("@imgly/background-removal");

      const result = await removeBackground(selectedAsset.file, {
        output: {
          format: "image/png",
          quality: 1,
        },
      });

      const baseName = selectedAsset.name.replace(/\.[^.]+$/, "");

      const transparentFile = new File(
        [result],
        `${baseName}-no-background.png`,
        {
          type: "image/png",
          lastModified: Date.now(),
        },
      );

      const url = createMediaUrl(transparentFile);
      const assetId = createStudioId("asset");

      const transparentAsset: Asset = {
        id: assetId,
        name: transparentFile.name,
        kind: "image",
        url,
        file: transparentFile,
        duration: selectedClip.duration,
        width: selectedAsset.width,
        height: selectedAsset.height,
        size: transparentFile.size,
        createdAt: Date.now(),
      };

      const transparentClip: Clip = {
        id: createStudioId("clip"),
        assetId,
        name: transparentFile.name,
        kind: "image",
        track: "overlay",
        start: selectedClip.start,
        duration: selectedClip.duration,
        trimStart: 0,
        trimEnd: 0,
        url,
        file: transparentFile,
        volume: 1,
        muted: false,
      };

      onAssetCreated(transparentAsset);
      onClipCreated(transparentClip);

      return transparentAsset;
    } catch (caughtError) {
      console.error("Image background removal failed:", caughtError);

      const message =
        caughtError instanceof Error ? caughtError.message : "";

      setError(
        message
          ? `Image background removal failed: ${message}`
          : "Background removal failed. Check your connection and try again.",
      );

      return null;
    } finally {
      setRemovingBackground(false);
    }
  }, [
    assets,
    selectedClip,
    removingBackground,
    onAssetCreated,
    onClipCreated,
  ]);

  return {
    removingBackground,
    error,
    removeSelectedBackground,
    clearBackgroundRemovalError,
  };
}
