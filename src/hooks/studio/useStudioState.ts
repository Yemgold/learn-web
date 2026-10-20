



"use client";

import { useCallback, useMemo, useState } from "react";

import type { Asset, StudioNotice } from "@/lib/studio/types";

interface UseStudioStateOptions {
  initialProjectName?: string;
  initialAssets?: Asset[];
}

export function useStudioState(
  options: UseStudioStateOptions = {},
) {
  const [projectName, setProjectName] = useState(
    options.initialProjectName ?? "Untitled Project",
  );

  const [assets, setAssets] = useState<Asset[]>(
    options.initialAssets ?? [],
  );

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    null,
  );

  const [notice, setNotice] = useState<string | null>(null);

  const [studioNotice, setStudioNotice] = useState<StudioNotice | null>(
    null,
  );

  const [isExporting, setIsExporting] = useState(false);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) ?? null,
    [assets, selectedAssetId],
  );

  const addAsset = useCallback((asset: Asset) => {
    setAssets((current) => [...current, asset]);
    setSelectedAssetId(asset.id);
  }, []);

  const addAssets = useCallback((newAssets: Asset[]) => {
    if (newAssets.length === 0) return;

    setAssets((current) => [...current, ...newAssets]);
    setSelectedAssetId(newAssets[newAssets.length - 1].id);
  }, []);

  const updateAsset = useCallback(
    (assetId: string, updates: Partial<Asset>) => {
      setAssets((current) =>
        current.map((asset) =>
          asset.id === assetId ? { ...asset, ...updates } : asset,
        ),
      );
    },
    [],
  );

  const removeAsset = useCallback((assetId: string) => {
    setAssets((current) =>
      current.filter((asset) => asset.id !== assetId),
    );

    setSelectedAssetId((current) =>
      current === assetId ? null : current,
    );
  }, []);

  const selectAsset = useCallback((assetId: string | null) => {
    setSelectedAssetId(assetId);
  }, []);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    setStudioNotice({
      type: "info",
      message,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setNotice(message);
    setStudioNotice({
      type: "success",
      message,
    });
  }, []);

  const showError = useCallback((message: string) => {
    setNotice(message);
    setStudioNotice({
      type: "error",
      message,
    });
  }, []);

  const clearNotice = useCallback(() => {
    setNotice(null);
    setStudioNotice(null);
  }, []);

  const clearAssets = useCallback(() => {
    setAssets([]);
    setSelectedAssetId(null);
  }, []);

  return {
    projectName,
    setProjectName,

    assets,
    setAssets,
    selectedAsset,
    selectedAssetId,
    setSelectedAssetId,

    notice,
    setNotice,
    studioNotice,

    isExporting,
    setIsExporting,

    addAsset,
    addAssets,
    updateAsset,
    removeAsset,
    selectAsset,

    showNotice,
    showSuccess,
    showError,
    clearNotice,
    clearAssets,
  };
}
