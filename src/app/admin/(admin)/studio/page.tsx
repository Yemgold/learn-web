



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import StudioTopbar from "@/components/studio/StudioTopbar";
import MediaPanel from "@/components/studio/MediaPanel";
import PreviewPanel from "@/components/studio/PreviewPanel";
import TimelinePanel from "@/components/studio/TimelinePanel";
import InspectorPanel from "@/components/studio/InspectorPanel";
import TransportControls from "@/components/studio/TransportControls";
import StudioStatusbar from "@/components/studio/StudioStatusbar";
import AIBackgroundRemover from "@/components/studio/AIBackgroundRemover";

import { useStudioState } from "@/hooks/studio/useStudioState";
import { useTimeline } from "@/hooks/studio/useTimeline";
import { useImageBackgroundRemoval } from "@/hooks/studio/useImageBackgroundRemoval";
import { useVideoBackgroundRemoval } from "@/hooks/studio/useVideoBackgroundRemoval";

import {
  createClipFromAsset,
  formatTime,
  getTimelineDuration,
} from "@/lib/studio/utils";

import {
  exportVideo,
  downloadExportedVideo,
} from "@/lib/studio/export-video";

import type { Asset, Clip } from "@/lib/studio/types";

const PROJECT_STORAGE_KEY = "learnyfi-studio-project";
const EXPORT_WIDTH = 1920;
const EXPORT_HEIGHT = 1080;
const EXPORT_FPS = 30;

type ExportMedia = {
  clip: Clip;
  image?: HTMLImageElement;
  media?: HTMLVideoElement | HTMLAudioElement;
};

function getClipUrl(clip: Clip, assets: Asset[]): string {
  const asset = assets.find((item) => item.id === clip.assetId);
  return clip.url || asset?.url || "";
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (image.complete && image.naturalWidth > 0) {
      resolve();
      return;
    }

    image.onload = () => resolve();
    image.onerror = () => {
      reject(new Error(`Could not load image: ${image.src}`));
    };
  });
}

function waitForMedia(
  media: HTMLMediaElement,
  label: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (media.readyState >= HTMLMediaElement.HAVE_METADATA) {
      resolve();
      return;
    }

    const cleanup = () => {
      media.removeEventListener("loadedmetadata", onReady);
      media.removeEventListener("error", onError);
    };

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Could not load media: ${label}`));
    };

    media.addEventListener("loadedmetadata", onReady, { once: true });
    media.addEventListener("error", onError, { once: true });
    media.load();
  });
}

function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("A video frame could not be decoded."));
    };

    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;

  if (!sourceWidth || !sourceHeight) return;

  const scale = Math.max(
    width / sourceWidth,
    height / sourceHeight,
  );

  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;

  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}

function drawVideoContain(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number,
) {
  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    !video.videoWidth ||
    !video.videoHeight
  ) {
    return;
  }

  const scale = Math.min(
    width / video.videoWidth,
    height / video.videoHeight,
  );

  const drawWidth = video.videoWidth * scale;
  const drawHeight = video.videoHeight * scale;

  context.drawImage(
    video,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}

export default function StudioPage() {
  const studio = useStudioState({
    initialProjectName: "Untitled Project",
  });

  const timeline = useTimeline();

  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

  const exportInProgressRef = useRef(false);

  const assets: Asset[] = studio.assets;
  const clips: Clip[] = timeline.clips;
  const selectedClip = timeline.selectedClip;
  const selectedClipId = selectedClip?.id ?? null;
  const playhead = timeline.playhead;

  const duration = useMemo(
    () =>
      Math.max(
        1,
        timeline.timelineDuration || getTimelineDuration(clips),
      ),
    [clips, timeline.timelineDuration],
  );

  const selectedAsset = useMemo(
    () =>
      assets.find((asset) => asset.id === studio.selectedAssetId) ?? null,
    [assets, studio.selectedAssetId],
  );

  const previewVideoClip = useMemo(() => {
    if (selectedClip?.kind === "video") return selectedClip;

    return (
      clips.find(
        (clip) => clip.kind === "video" && clip.track === "video",
      ) ??
      clips.find((clip) => clip.kind === "video") ??
      null
    );
  }, [clips, selectedClip]);

  const backgroundClip = useMemo(() => {
    if (selectedClip?.kind === "image") return selectedClip;

    return (
      clips.find(
        (clip) =>
          clip.kind === "image" && clip.track === "overlay",
      ) ??
      clips.find((clip) => clip.kind === "image") ??
      null
    );
  }, [clips, selectedClip]);

  const previewClip = previewVideoClip ?? selectedClip;

  const previewBackground =
    previewVideoClip && backgroundClip?.id !== previewVideoClip.id
      ? backgroundClip
      : null;

  const markUnsaved = useCallback(() => {
    setLastSaved(null);
    setProjectError(null);
  }, []);

  const imageBackgroundRemoval = useImageBackgroundRemoval({
    assets,
    selectedClip,
    onAssetCreated: (asset: Asset) => {
      studio.addAsset(asset);
    },
    onClipCreated: (clip: Clip) => {
      timeline.addClip(clip);
      timeline.selectClip(clip.id);
      studio.showSuccess("Image background removed successfully.");
      markUnsaved();
    },
  });

  const videoBackgroundRemoval = useVideoBackgroundRemoval({
    assets,
    selectedClip,
    onAssetCreated: (asset: Asset) => {
      studio.addAsset(asset);
    },
    onClipCreated: (clip: Clip) => {
      timeline.addClip(clip);
      timeline.selectClip(clip.id);
      studio.showSuccess("Video background removed successfully.");
      markUnsaved();
    },
  });

  const handleProjectNameChange = useCallback(
    (name: string) => {
      studio.setProjectName(name);
      markUnsaved();
    },
    [studio, markUnsaved],
  );

  const handleAssetsAdded = useCallback(
    (newAssets: Asset[]) => {
      newAssets.forEach((asset) => studio.addAsset(asset));

      if (newAssets.length > 0) {
        studio.setSelectedAssetId(newAssets[newAssets.length - 1].id);
        studio.showSuccess(
          `${newAssets.length} media file${newAssets.length === 1 ? "" : "s"} imported.`,
        );
        markUnsaved();
      }
    },
    [studio, markUnsaved],
  );

  const handleAddToTimeline = useCallback(
    (asset: Asset) => {
      const clip = createClipFromAsset(asset, 0);

      timeline.addClip(clip);
      timeline.selectClip(clip.id);
      timeline.seek(clip.start);
      studio.setSelectedAssetId(asset.id);
      studio.showSuccess(`${asset.name} added to the timeline.`);
      markUnsaved();
    },
    [studio, timeline, markUnsaved],
  );

  const handleSelectAsset = useCallback(
    (asset: Asset) => {
      studio.setSelectedAssetId(asset.id);
    },
    [studio],
  );

  const handleDeleteAsset = useCallback(
    (asset: Asset) => {
      const linkedClips = clips.filter(
        (clip) => clip.assetId === asset.id,
      );

      linkedClips.forEach((clip) => timeline.removeClip(clip.id));
      studio.removeAsset(asset.id);

      if (studio.selectedAssetId === asset.id) {
        studio.setSelectedAssetId(null);
      }

      studio.showSuccess(`${asset.name} removed from media.`);
      markUnsaved();
    },
    [clips, studio, timeline, markUnsaved],
  );

  const handleUpdateClip = useCallback(
    (clipId: string, updates: Partial<Clip>) => {
      timeline.updateClip(clipId, updates);
      markUnsaved();
    },
    [timeline, markUnsaved],
  );

  const handleDeleteClip = useCallback(
    (clipId: string) => {
      timeline.removeClip(clipId);
      setIsPlaying(false);
      markUnsaved();
    },
    [timeline, markUnsaved],
  );

  const handleSeek = useCallback(
    (time: number) => {
      timeline.seek(Math.max(0, Math.min(time, duration)));
    },
    [timeline, duration],
  );

  const handlePlayPause = useCallback(() => {
    if (playhead >= duration) timeline.seek(0);
    setIsPlaying((playing) => !playing);
  }, [duration, playhead, timeline]);

  useEffect(() => {
    if (!isPlaying) return;

    let previousTime = performance.now();

    const interval = window.setInterval(() => {
      const now = performance.now();
      const elapsed = (now - previousTime) / 1000;
      previousTime = now;

      const nextTime = timeline.playhead + elapsed;

      if (nextTime >= duration) {
        timeline.seek(duration);
        setIsPlaying(false);
      } else {
        timeline.seek(nextTime);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [isPlaying, duration, timeline]);

  const handleSaveProject = useCallback(() => {
    setIsSaving(true);
    setProjectError(null);

    try {
      const project = {
        name: studio.projectName,
        assets: assets.map((asset) => ({
          id: asset.id,
          name: asset.name,
          kind: asset.kind,
          size: asset.size,
          createdAt: asset.createdAt,
        })),
        clips: clips.map((clip) => ({
          ...clip,
          file: undefined,
        })),
        playhead: timeline.playhead,
        zoom,
        savedAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        PROJECT_STORAGE_KEY,
        JSON.stringify(project),
      );

      setLastSaved(Date.now());
      studio.showSuccess("Project details saved in this browser.");
    } catch (error) {
      console.error("Could not save studio project:", error);
      setProjectError("Could not save the project in this browser.");
      studio.showError("Project could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }, [assets, clips, studio, timeline.playhead, zoom]);

  const handleExport = useCallback(async () => {
    if (exportInProgressRef.current) return;

    if (clips.length === 0) {
      studio.showError("Add media to the timeline before exporting.");
      return;
    }

    exportInProgressRef.current = true;
    setIsExporting(true);
    setExportProgress(0);
    setIsPlaying(false);

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_WIDTH;
    canvas.height = EXPORT_HEIGHT;

    const context = canvas.getContext("2d", { alpha: false });

    let audioContext: AudioContext | null = null;
    let animationFrame = 0;
    let cancelled = false;

    const mediaItems: ExportMedia[] = [];

    try {
      if (!context) {
        throw new Error("Could not initialize the export canvas.");
      }

      studio.showNotice("Preparing timeline and media for export…");

      // Load every timeline clip into a fresh media element.
      // Each element receives exactly one MediaElementAudioSourceNode.
      for (const clip of clips) {
        const url = getClipUrl(clip, assets);

        if (!url) {
          throw new Error(`Media is missing for "${clip.name}".`);
        }

        if (clip.kind === "image") {
          const image = new Image();
          image.src = url;
          await waitForImage(image);

          mediaItems.push({ clip, image });
          continue;
        }

        const media =
          clip.kind === "video"
            ? document.createElement("video")
            : document.createElement("audio");

        media.preload = "auto";

        if (media instanceof HTMLVideoElement) {
          media.playsInline = true;
        }

        media.src = url;

        mediaItems.push({ clip, media });

        await waitForMedia(media, clip.name);
      }

      const audioItems = mediaItems.filter(
        (item) =>
          item.media &&
          (item.clip.kind === "audio" || item.clip.kind === "video"),
      );

      // Create one audio context and one recording destination.
      // Never create a second source node for the same media element.
      let audioTracks: MediaStreamTrack[] = [];

      if (audioItems.length > 0) {
        audioContext = new AudioContext();

        const audioDestination =
          audioContext.createMediaStreamDestination();

        for (const item of audioItems) {
          const media = item.media;

          if (!media) continue;

          const source =
            audioContext.createMediaElementSource(media);

          const gainNode = audioContext.createGain();

          gainNode.gain.value = item.clip.muted
            ? 0
            : Math.max(0, Math.min(1, item.clip.volume ?? 1));

          source.connect(gainNode);
          gainNode.connect(audioDestination);
        }

        audioTracks = audioDestination.stream.getAudioTracks();

        await audioContext.resume();
      }

      const imageItems = mediaItems.filter(
        (item) => item.clip.kind === "image" && item.image,
      );

      const videoItems = mediaItems.filter(
        (item) => item.clip.kind === "video" && item.media,
      );

      const activeAt = (clip: Clip, time: number) =>
        time >= clip.start &&
        time < clip.start + clip.duration;

      const syncMedia = (item: ExportMedia, time: number) => {
        const media = item.media;

        if (!media) return;

        if (!activeAt(item.clip, time)) {
          if (!media.paused) media.pause();
          return;
        }

        const desiredTime = Math.max(
          0,
          item.clip.trimStart + time - item.clip.start,
        );

        if (
          Number.isFinite(media.duration) &&
          media.duration > 0 &&
          Math.abs(media.currentTime - desiredTime) > 0.35
        ) {
          media.currentTime = Math.min(
            desiredTime,
            Math.max(0, media.duration - 0.05),
          );
        }

        if (media.paused) {
          void media.play().catch((error: unknown) => {
            console.warn("Media playback could not start:", error);
          });
        }
      };

      const renderFrame = (time: number) => {
        context.fillStyle = "#101010";
        context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

        // Draw image backgrounds first.
        for (const item of imageItems) {
          if (!item.image || !activeAt(item.clip, time)) continue;

          drawImageCover(
            context,
            item.image,
            EXPORT_WIDTH,
            EXPORT_HEIGHT,
          );
        }

        // Draw videos over the background. Transparent video pixels
        // reveal the image behind the foreground subject.
        for (const item of videoItems) {
          if (!item.media || !activeAt(item.clip, time)) continue;

          drawVideoContain(
            context,
            item.media as HTMLVideoElement,
            EXPORT_WIDTH,
            EXPORT_HEIGHT,
          );
        }

        // Keep both video audio and standalone audio synchronized.
        for (const item of audioItems) {
          syncMedia(item, time);
        }
      };

      // Wait for actual video frames rather than waiting on an empty
      // placeholder video, which could otherwise hang the export.
      for (const item of videoItems) {
        if (item.media instanceof HTMLVideoElement) {
          await waitForVideoFrame(item.media);
        }
      }

      renderFrame(0);

      let startTime = 0;

      const drawLoop = () => {
        if (cancelled) return;

        const time = Math.min(
          (performance.now() - startTime) / 1000,
          duration,
        );

        renderFrame(time);
        animationFrame = window.requestAnimationFrame(drawLoop);
      };

      startTime = performance.now();
      animationFrame = window.requestAnimationFrame(drawLoop);

      const result = await exportVideo({
        canvas,
        duration,
        fps: EXPORT_FPS,
        fileName: `${studio.projectName || "learnyfi-export"}.mp4`,
        audioTracks,
        onProgress: (progress) => {
          setExportProgress(progress);
        },
      });

      cancelled = true;
      window.cancelAnimationFrame(animationFrame);

      downloadExportedVideo(result.blob, result.fileName);

      studio.showSuccess(
        `Export downloaded as ${result.fileName} (${result.mimeType}).`,
      );
    } catch (error) {
      console.error("Timeline export failed:", error);

      studio.showError(
        error instanceof Error
          ? error.message
          : "Timeline export failed. Please try again.",
      );
    } finally {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);

      for (const item of mediaItems) {
        if (item.media) {
          item.media.pause();
          item.media.removeAttribute("src");
          item.media.load();
        }
      }

      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close().catch(() => undefined);
      }

      setIsExporting(false);
      setExportProgress(0);
      exportInProgressRef.current = false;
    }
  }, [assets, clips, duration, studio]);

  const handleRemoveImageBackground = useCallback(async () => {
    try {
      await imageBackgroundRemoval.removeSelectedBackground();
      markUnsaved();
    } catch (error) {
      console.error("Image background removal failed:", error);
      studio.showError("Image background removal failed.");
    }
  }, [imageBackgroundRemoval, studio, markUnsaved]);

  const handleRemoveVideoBackground = useCallback(async () => {
    try {
      await videoBackgroundRemoval.removeSelectedBackground();
      markUnsaved();
    } catch (error) {
      console.error("Video background removal failed:", error);
      studio.showError("Video background removal failed.");
    }
  }, [videoBackgroundRemoval, studio, markUnsaved]);

  const handleSplitClip = useCallback(() => {
    if (!selectedClip) {
      studio.showError("Select a clip to split.");
      return;
    }

    if (
      playhead <= selectedClip.start ||
      playhead >= selectedClip.start + selectedClip.duration
    ) {
      studio.showError(
        "Move the playhead inside the selected clip first.",
      );
      return;
    }

    timeline.splitClip(selectedClip.id, playhead);
    markUnsaved();
  }, [selectedClip, playhead, studio, timeline, markUnsaved]);

  const handleClearTimeline = useCallback(() => {
    if (clips.length === 0) return;

    const confirmed = window.confirm(
      "Remove all clips from the timeline? Your imported media will remain available.",
    );

    if (!confirmed) return;

    timeline.clearTimeline();
    timeline.seek(0);
    setIsPlaying(false);
    markUnsaved();
    studio.showSuccess("Timeline cleared.");
  }, [clips.length, studio, timeline, markUnsaved]);

  const status = projectError
    ? "error"
    : isSaving
      ? "saving"
      : lastSaved
        ? "saved"
        : "unsaved";

  return (
    <main className="studio-page flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <StudioTopbar
        projectName={studio.projectName}
        onProjectNameChange={handleProjectNameChange}
        onSave={handleSaveProject}
        onExport={handleExport}
        onUndo={() => studio.showNotice("Undo is not available yet.")}
        onRedo={() => studio.showNotice("Redo is not available yet.")}
        isSaving={isSaving}
        isExporting={isExporting}
      />

      {studio.notice && (
        <div
          role="status"
          className="mx-3 mt-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
        >
          {studio.notice}
        </div>
      )}

      {isExporting && (
        <div className="mx-3 mt-2 rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Exporting timeline…</span>
            <span>{exportProgress}%</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Export progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={exportProgress}
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${exportProgress}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Keep this tab open until the export finishes.
          </p>
        </div>
      )}

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 xl:grid-cols-[250px_minmax(0,1fr)_280px]">
        <aside className="min-h-[260px] overflow-hidden rounded-xl border border-border bg-card xl:min-h-0">
          <MediaPanel
            assets={assets}
            selectedAssetId={studio.selectedAssetId}
            onAssetsAdded={handleAssetsAdded}
            onAddToTimeline={handleAddToTimeline}
            onSelectAsset={handleSelectAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        </aside>

        <section className="flex min-w-0 flex-col gap-3">
          <div className="h-[280px] min-h-[220px] max-h-[38vh] overflow-hidden rounded-xl border border-border bg-card lg:h-[300px] xl:h-[320px]">
            <PreviewPanel
              clip={previewClip}
              backgroundClip={previewBackground}
              currentTime={playhead}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              onTimeUpdate={handleSeek}
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-2">
            <TransportControls
              isPlaying={isPlaying}
              currentTime={playhead}
              duration={duration}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
            />
          </div>

          <div className="min-h-[280px] overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2.5">
              <div>
                <h2 className="text-sm font-semibold">Timeline</h2>
                <p className="text-xs text-muted-foreground">
                  Arrange and edit your media clips
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSplitClip}
                  disabled={!selectedClip || isExporting}
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Split clip
                </button>

                <button
                  type="button"
                  onClick={handleClearTimeline}
                  disabled={clips.length === 0 || isExporting}
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear timeline
                </button>

                {selectedAsset && (
                  <button
                    type="button"
                    onClick={() => handleAddToTimeline(selectedAsset)}
                    disabled={isExporting}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Add selected media
                  </button>
                )}
              </div>
            </div>

            <TimelinePanel
              clips={timeline.sortedClips}
              selectedClipId={selectedClipId}
              playhead={playhead}
              duration={duration}
              zoom={zoom}
              onSelectClip={(clipId) => {
                timeline.selectClip(clipId);

                const clip = clips.find((item) => item.id === clipId);

                if (clip) {
                  studio.setSelectedAssetId(clip.assetId);
                }
              }}
              onSeek={handleSeek}
              onDeleteClip={handleDeleteClip}
              onSplitClip={handleSplitClip}
              onAddMedia={() => {
                if (selectedAsset) {
                  handleAddToTimeline(selectedAsset);
                } else {
                  studio.showNotice(
                    "Import and select a media file first.",
                  );
                }
              }}
            />
          </div>
        </section>

        <aside className="flex min-h-[260px] flex-col gap-3 xl:min-h-0">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <InspectorPanel
              clip={selectedClip}
              onUpdateClip={handleUpdateClip}
              onDeleteClip={handleDeleteClip}
              onSelectAsset={(assetId) => {
                studio.setSelectedAssetId(assetId);
              }}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <AIBackgroundRemover
              selectedClip={selectedClip}
              assets={assets}
              removingImageBackground={
                imageBackgroundRemoval.removingBackground
              }
              removingVideoBackground={
                videoBackgroundRemoval.removingBackground
              }
              imageError={imageBackgroundRemoval.error}
              videoError={videoBackgroundRemoval.error}
              onRemoveImageBackground={handleRemoveImageBackground}
              onRemoveVideoBackground={handleRemoveVideoBackground}
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-3">
            <h2 className="mb-2 text-sm font-semibold">
              Project information
            </h2>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between gap-3">
                <span>Media files</span>
                <span className="font-medium text-foreground">
                  {assets.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span>Timeline clips</span>
                <span className="font-medium text-foreground">
                  {clips.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span>Playhead</span>
                <span className="font-medium text-foreground">
                  {formatTime(playhead)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span>Timeline duration</span>
                <span className="font-medium text-foreground">
                  {formatTime(duration)}
                </span>
              </div>

              {videoBackgroundRemoval.removingBackground && (
                <div className="pt-2">
                  <div className="mb-1 flex justify-between gap-2">
                    <span>Removing video background</span>
                    <span>{videoBackgroundRemoval.progress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${videoBackgroundRemoval.progress}%`,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={videoBackgroundRemoval.cancelRemoval}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    Cancel processing
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveProject}
              disabled={isSaving || isExporting}
              className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? "Saving project…" : "Save project"}
            </button>
          </div>
        </aside>
      </section>

      <StudioStatusbar
        status={status}
        message={
          projectError ??
          (lastSaved
            ? `Saved at ${new Date(lastSaved).toLocaleTimeString()}`
            : "Unsaved changes")
        }
        currentTime={playhead}
        duration={duration}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </main>
  );
}
