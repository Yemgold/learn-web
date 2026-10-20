





"use client";

import {
  AudioLines,
  Film,
  Image as ImageIcon,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import type { Asset, Clip, MediaKind } from "@/lib/studio/types";
import {
  createAssetFromFile,
  formatFileSize,
} from "@/lib/studio/utils";

type MediaFilter = "all" | MediaKind;

interface MediaPanelProps {
  assets: Asset[];
  selectedAssetId?: string | null;
  onAssetsAdded: (assets: Asset[]) => void;
  onAddToTimeline: (asset: Asset) => void;
  onSelectAsset?: (asset: Asset) => void;
  onDeleteAsset?: (asset: Asset) => void;
  className?: string;
}

const FILTERS: { label: string; value: MediaFilter }[] = [
  { label: "All", value: "all" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
  { label: "Images", value: "image" },
];

export default function MediaPanel({
  assets,
  selectedAssetId = null,
  onAssetsAdded,
  onAddToTimeline,
  onSelectAsset,
  onDeleteAsset,
  className = "",
}: MediaPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState<MediaFilter>("all");
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const visibleAssets = assets.filter((asset) => {
    const matchesFilter = filter === "all" || asset.kind === filter;
    const matchesSearch = asset.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const importFiles = async (fileList: FileList | File[]) => {
    setImportError(null);

    const files = Array.from(fileList);
    const supportedFiles = files.filter((file) =>
      /^(video|audio|image)\//i.test(file.type),
    );

    if (supportedFiles.length === 0) {
      setImportError(
        "Choose a supported video, audio, or image file.",
      );
      return;
    }

    const newAssets: Asset[] = [];
    const errors: string[] = [];

    
for (const file of supportedFiles) {
  try {
    const asset = await createAssetFromFile(file);

    if (asset) {
      newAssets.push(asset);
    } else {
      errors.push(file.name);
    }
  } catch (error) {
    console.error("Could not import media:", file.name, error);
    errors.push(file.name);
  }
}


    if (newAssets.length > 0) {
      onAssetsAdded(newAssets);
    }

    if (errors.length > 0) {
      setImportError(
        `Could not import: ${errors.slice(0, 3).join(", ")}${
          errors.length > 3 ? " and other files" : ""
        }`,
      );
    } else if (supportedFiles.length !== files.length) {
      setImportError(
        "Some files were skipped because their format is unsupported.",
      );
    }
  };

  const handleInputChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.currentTarget.files;

    if (files?.length) {
      await importFiles(files);
    }

    // Allow the same file to be selected again later.
    event.currentTarget.value = "";
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      await importFiles(event.dataTransfer.files);
    }
  };

  return (
    <section
      className={`studio-media-panel ${className}`.trim()}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        background: "var(--studio-panel, #151515)",
        color: "var(--studio-text, #f4f4f5)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "12px 12px 10px",
          borderBottom: "1px solid var(--studio-border, #2a2a2a)",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 650 }}>
            Media Library
          </div>
          <div
            style={{
              marginTop: 3,
              color: "var(--studio-muted, #a1a1aa)",
              fontSize: 11,
            }}
          >
            {assets.length} {assets.length === 1 ? "file" : "files"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          title="Import media"
          aria-label="Import media"
          style={primaryButtonStyle}
        >
          <Upload size={14} />
          Import
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="video/*,audio/*,image/*"
          multiple
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
      </header>

      <div style={{ padding: 10 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            border: "1px solid var(--studio-border, #333)",
            borderRadius: 7,
            background: "var(--studio-surface, #202020)",
          }}
        >
          <Search
            size={14}
            color="var(--studio-muted, #a1a1aa)"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search media..."
            aria-label="Search media"
            style={{
              width: "100%",
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "inherit",
              fontSize: 12,
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              style={smallIconButtonStyle}
            >
              <X size={13} />
            </button>
          )}
        </label>
      </div>

      <div
        style={{
          display: "flex",
          gap: 5,
          padding: "0 10px 10px",
          overflowX: "auto",
        }}
      >
        {FILTERS.map((item) => {
          const active = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              style={{
                flex: "0 0 auto",
                padding: "6px 10px",
                border: "1px solid",
                borderColor: active
                  ? "var(--studio-accent, #8b5cf6)"
                  : "var(--studio-border, #333)",
                borderRadius: 6,
                background: active
                  ? "var(--studio-accent-soft, #332451)"
                  : "transparent",
                color: active
                  ? "#c4b5fd"
                  : "var(--studio-muted, #a1a1aa)",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {importError && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            margin: "0 10px 10px",
            padding: 9,
            border: "1px solid #7f1d1d",
            borderRadius: 6,
            background: "#450a0a40",
            color: "#fca5a5",
            fontSize: 11,
          }}
        >
          <span>{importError}</span>
          <button
            type="button"
            onClick={() => setImportError(null)}
            aria-label="Dismiss import error"
            style={smallIconButtonStyle}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        style={{
          flex: 1,
          minHeight: 100,
          overflowY: "auto",
          padding: 10,
          outline: isDragging
            ? "2px dashed var(--studio-accent, #8b5cf6)"
            : "none",
          outlineOffset: -4,
          background: isDragging ? "#8b5cf610" : "transparent",
        }}
      >
        {visibleAssets.length === 0 ? (
          <div
            style={{
              display: "flex",
              minHeight: 180,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 10,
              padding: 18,
              color: "var(--studio-muted, #a1a1aa)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: 46,
                height: 46,
                border: "1px solid var(--studio-border, #333)",
                borderRadius: 12,
                background: "var(--studio-surface, #202020)",
              }}
            >
              <Upload size={20} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600 }}>
              {assets.length === 0
                ? "Your library is empty"
                : "No matching media"}
            </div>

            <div style={{ maxWidth: 200, fontSize: 11, lineHeight: 1.6 }}>
              {assets.length === 0
                ? "Import videos, audio, and images to start editing."
                : "Try another search or filter."}
            </div>

            {assets.length === 0 && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={primaryButtonStyle}
              >
                <Plus size={14} />
                Add media
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))",
              gap: 9,
            }}
          >
            {visibleAssets.map((asset) => {
              const selected = asset.id === selectedAssetId;
              const Icon =
                asset.kind === "video"
                  ? Film
                  : asset.kind === "audio"
                    ? AudioLines
                    : ImageIcon;

              return (
                <div
                  key={asset.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  onClick={() => onSelectAsset?.(asset)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      onSelectAsset?.(asset);
                    }
                  }}
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: selected
                      ? "var(--studio-accent, #8b5cf6)"
                      : "var(--studio-border, #303030)",
                    borderRadius: 8,
                    background: selected
                      ? "var(--studio-accent-soft, #251b38)"
                      : "var(--studio-surface, #1b1b1b)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "grid",
                      placeItems: "center",
                      aspectRatio: "4 / 3",
                      overflow: "hidden",
                      background: "#090909",
                    }}
                  >
                    {asset.kind === "image" ? (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : asset.kind === "video" ? (
                      <video
                        src={asset.url}
                        preload="metadata"
                        muted
                        onLoadedMetadata={(event) => {
                          const video = event.currentTarget;
                          if (video.videoWidth > 0) {
                            video.currentTime = Math.min(
                              0.5,
                              video.duration / 2,
                            );
                          }
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 7,
                          color: "#c4b5fd",
                        }}
                      >
                        <Icon size={25} />
                        <span style={{ fontSize: 10 }}>Audio</span>
                      </div>
                    )}

                    <span
                      style={{
                        position: "absolute",
                        left: 5,
                        top: 5,
                        display: "grid",
                        placeItems: "center",
                        width: 23,
                        height: 23,
                        borderRadius: 5,
                        background: "#000b",
                        color: "#fff",
                      }}
                    >
                      <Icon size={13} />
                    </span>

                    <button
                      type="button"
                      title="Add to timeline"
                      aria-label={`Add ${asset.name} to timeline`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddToTimeline(asset);
                      }}
                      style={{
                        position: "absolute",
                        right: 5,
                        bottom: 5,
                        display: "grid",
                        placeItems: "center",
                        width: 27,
                        height: 27,
                        border: "none",
                        borderRadius: 6,
                        background: "var(--studio-accent, #7c3aed)",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <div style={{ padding: "8px 7px" }}>
                    <div
                      title={asset.name}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: 11,
                        fontWeight: 550,
                      }}
                    >
                      {asset.name}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 4,
                        marginTop: 5,
                        color: "var(--studio-muted, #a1a1aa)",
                        fontSize: 10,
                      }}
                    >
                      <span>
                        {asset.duration != null &&
                        asset.kind !== "image"
                          ? `${Math.floor(asset.duration / 60)}:${String(
                              Math.floor(asset.duration % 60),
                            ).padStart(2, "0")}`
                          : asset.kind.toUpperCase()}
                      </span>

                      <span>{formatFileSize(asset.size)}</span>
                    </div>

                    {onDeleteAsset && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteAsset(asset);
                        }}
                        style={{
                          marginTop: 7,
                          padding: 0,
                          border: "none",
                          background: "transparent",
                          color: "#f87171",
                          fontSize: 10,
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer
        style={{
          padding: "8px 12px",
          borderTop: "1px solid var(--studio-border, #2a2a2a)",
          color: "var(--studio-muted, #a1a1aa)",
          fontSize: 10,
        }}
      >
        Drag files here or use Import to add media.
      </footer>
    </section>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "7px 10px",
  border: "none",
  borderRadius: 6,
  background: "var(--studio-accent, #7c3aed)",
  color: "#fff",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
};

const smallIconButtonStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  flex: "0 0 auto",
  width: 22,
  height: 22,
  padding: 0,
  border: "none",
  borderRadius: 4,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};
