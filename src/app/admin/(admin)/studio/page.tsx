




"use client";

import {
  useCallback,
  useEffect,
  useMemo,
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

import type { Asset, Clip } from "@/lib/studio/types";

const PROJECT_STORAGE_KEY = "learnyfi-studio-project";

export default function StudioPage() {
  const studio = useStudioState({
    initialProjectName: "Untitled Project",
  });

  const timeline = useTimeline();

  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

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

  /*
   * PREVIEW COMPOSITING SELECTION
   *
   * When the user selects a background image, keep the main video
   * visible in the preview and show that image behind it.
   *
   * An image on the Overlay track is preferred as the background.
   */
  const previewVideoClip = useMemo(() => {
    if (selectedClip?.kind === "video") {
      return selectedClip;
    }

    return (
      clips.find(
        (clip) => clip.kind === "video" && clip.track === "video",
      ) ??
      clips.find((clip) => clip.kind === "video") ??
      null
    );
  }, [clips, selectedClip]);

  const backgroundClip = useMemo(() => {
    if (selectedClip?.kind === "image") {
      return selectedClip;
    }

    return (
      clips.find(
        (clip) =>
          clip.kind === "image" && clip.track === "overlay",
      ) ??
      clips.find((clip) => clip.kind === "image") ??
      null
    );
  }, [clips, selectedClip]);

  // Show the image behind the video only when a video is available.
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
          `${newAssets.length} media file${
            newAssets.length === 1 ? "" : "s"
          } imported.`,
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
    if (playhead >= duration) {
      timeline.seek(0);
    }

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

  
  const handleExport = useCallback(() => {
  if (!selectedClip) {
    studio.showError("Select a clip before exporting.");
    return;
  }

  const asset = assets.find(
    (item) => item.id === selectedClip.assetId,
  );

  const file = selectedClip.file ?? asset?.file;

  if (!file) {
    studio.showError(
      "The selected clip's media file is unavailable.",
    );
    return;
  }

  try {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      file.name || selectedClip.name || "learnyfi-export";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 2000);

    studio.showSuccess(
      `Downloaded ${file.name}. This is the selected clip, not the full timeline export.`,
    );
  } catch (error) {
    console.error("Media export failed:", error);
    studio.showError("Could not download the selected media.");
  }
}, [assets, selectedClip, studio]);


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
        isExporting={false}
      />

      {studio.notice && (
        <div
          role="status"
          className="mx-3 mt-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
        >
          {studio.notice}
        </div>
      )}

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 xl:grid-cols-[250px_minmax(0,1fr)_280px]">
        {/* Media library */}
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

        {/* Main editing workspace */}
        <section className="flex min-w-0 flex-col gap-3">
          {/* Compact preview */}
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

          {/* Timeline */}
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
                  disabled={!selectedClip}
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Split clip
                </button>

                <button
                  type="button"
                  onClick={handleClearTimeline}
                  disabled={clips.length === 0}
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear timeline
                </button>

                {selectedAsset && (
                  <button
                    type="button"
                    onClick={() => handleAddToTimeline(selectedAsset)}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
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

        {/* Inspector and tools */}
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
              disabled={isSaving}
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
