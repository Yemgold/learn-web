




"use client";

import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  LoaderCircle,
  Scissors,
  Sparkles,
  Video,
} from "lucide-react";

import { useState } from "react";
import type { Asset, Clip } from "@/lib/studio/types";

type RemovalMode = "image" | "video";

interface AIBackgroundRemoverProps {
  selectedClip: Clip | null;
  assets: Asset[];
  removingImageBackground?: boolean;
  removingVideoBackground?: boolean;
  imageError?: string | null;
  videoError?: string | null;
  onRemoveImageBackground?: () => Promise<unknown> | unknown;
  onRemoveVideoBackground?: () => Promise<unknown> | unknown;
  className?: string;
}

export default function AIBackgroundRemover({
  selectedClip,
  assets,
  removingImageBackground = false,
  removingVideoBackground = false,
  imageError = null,
  videoError = null,
  onRemoveImageBackground,
  onRemoveVideoBackground,
  className = "",
}: AIBackgroundRemoverProps) {
  const [mode, setMode] = useState<RemovalMode>("image");
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const isRemoving =
    mode === "image"
      ? removingImageBackground
      : removingVideoBackground;

  const error =
    actionError ||
    (mode === "image" ? imageError : videoError);

  const selectedAsset = selectedClip
    ? assets.find((asset) => asset.id === selectedClip.assetId)
    : undefined;

  const selectedMediaMatches =
    !!selectedClip &&
    (mode === "image"
      ? selectedClip.kind === "image" &&
        selectedAsset?.kind === "image"
      : selectedClip.kind === "video" &&
        selectedAsset?.kind === "video");

  const handler =
    mode === "image"
      ? onRemoveImageBackground
      : onRemoveVideoBackground;

  const handleRemove = async () => {
    setActionError(null);
    setSuccessMessage(null);

    if (!selectedClip) {
      setActionError("Select a clip on the timeline first.");
      return;
    }

    if (!selectedMediaMatches) {
      setActionError(
        mode === "image"
          ? "Select an image clip to remove its background."
          : "Select a video clip to remove its background.",
      );
      return;
    }

    if (!handler) {
      setActionError(
        mode === "image"
          ? "Image background removal is not connected yet."
          : "Video background removal is not connected yet.",
      );
      return;
    }

    try {
      const result = await handler();

      if (result === null || result === false) {
        setActionError("Background removal did not complete.");
        return;
      }

      setSuccessMessage(
        mode === "image"
          ? "Image background-removal request completed."
          : "Video background-removal request completed.",
      );
    } catch (caughtError) {
      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : "Background removal failed. Please try again.",
      );
    }
  };

  return (
    <section
      className={`studio-ai-background-remover ${className}`.trim()}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 14,
        border: "1px solid var(--studio-border, #303030)",
        borderRadius: 10,
        background: "var(--studio-panel, #151515)",
        color: "var(--studio-text, #f4f4f5)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: 38,
            height: 38,
            flex: "0 0 auto",
            borderRadius: 9,
            background: "#7c3aed24",
            color: "#c4b5fd",
          }}
        >
          <Scissors size={19} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 650 }}>
            AI Background Remover
          </div>
          <div
            style={{
              marginTop: 4,
              color: "var(--studio-muted, #a1a1aa)",
              fontSize: 11,
            }}
          >
            Remove backgrounds from images or video.
          </div>
        </div>

        <Sparkles size={17} color="#a78bfa" />
      </header>

      <div
        role="group"
        aria-label="Background removal type"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <ModeButton
          active={mode === "image"}
          disabled={isRemoving}
          onClick={() => {
            setMode("image");
            setActionError(null);
            setSuccessMessage(null);
          }}
          icon={<ImageIcon size={15} />}
          label="Image"
        />

        <ModeButton
          active={mode === "video"}
          disabled={isRemoving}
          onClick={() => {
            setMode("video");
            setActionError(null);
            setSuccessMessage(null);
          }}
          icon={<Video size={15} />}
          label="Video"
        />
      </div>

      <div
        style={{
          padding: 11,
          border: "1px solid var(--studio-border, #303030)",
          borderRadius: 8,
          background: "var(--studio-surface, #202020)",
        }}
      >
        <div
          style={{
            marginBottom: 6,
            color: "var(--studio-muted, #a1a1aa)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Selected media
        </div>

        <div style={{ fontSize: 12, fontWeight: 600 }}>
          {selectedClip?.name || "No clip selected"}
        </div>

        <div
          style={{
            marginTop: 5,
            color: "var(--studio-muted, #a1a1aa)",
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          {!selectedClip
            ? "Select an image or video clip from the timeline."
            : selectedMediaMatches
              ? `Ready for ${mode} background removal.`
              : `Select a ${mode} clip to use this tool.`}
        </div>
      </div>

      {mode === "image" ? (
        <div
          style={{
            padding: 10,
            borderRadius: 7,
            background: "#14532d20",
            color: "#86efac",
            fontSize: 11,
            lineHeight: 1.6,
          }}
        >
          Image mode uses your connected image-removal handler. The
          resulting transparent image can be added as a separate timeline
          clip.
        </div>
      ) : (
        <div
          style={{
            padding: 10,
            borderRadius: 7,
            background: "#78350f20",
            color: "#fcd34d",
            fontSize: 11,
            lineHeight: 1.6,
          }}
        >
          Video background removal requires a frame-segmentation model and
          a video-rendering pipeline. This panel calls your video handler;
          it does not remove video backgrounds by itself.
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            padding: 10,
            border: "1px solid #7f1d1d",
            borderRadius: 7,
            background: "#450a0a40",
            color: "#fca5a5",
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <AlertCircle size={15} style={{ flex: "0 0 auto" }} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            padding: 10,
            border: "1px solid #166534",
            borderRadius: 7,
            background: "#14532d30",
            color: "#86efac",
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <CheckCircle2 size={15} style={{ flex: "0 0 auto" }} />
          <span>{successMessage}</span>
        </div>
      )}

      <button
        type="button"
        disabled={isRemoving || !selectedMediaMatches || !handler}
        onClick={() => void handleRemove()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "11px 12px",
          border: "none",
          borderRadius: 7,
          background:
            isRemoving || !selectedMediaMatches || !handler
              ? "#4b3b68"
              : "var(--studio-accent, #7c3aed)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 650,
          cursor:
            isRemoving || !selectedMediaMatches || !handler
              ? "not-allowed"
              : "pointer",
          opacity: isRemoving || !selectedMediaMatches || !handler
            ? 0.7
            : 1,
        }}
      >
        {isRemoving ? (
          <>
            <LoaderCircle
              size={15}
              style={{ animation: "studio-bg-spin 1s linear infinite" }}
            />
            Removing background...
          </>
        ) : (
          <>
            <Sparkles size={15} />
            Remove {mode === "image" ? "Image" : "Video"} Background
          </>
        )}
      </button>

      <div
        style={{
          color: "var(--studio-muted, #a1a1aa)",
          fontSize: 10,
          lineHeight: 1.6,
        }}
      >
        Processing time depends on file size, device performance, and the
        model used.
      </div>

      <style>{`
        @keyframes studio-bg-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

function ModeButton({
  active,
  disabled,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "9px 10px",
        border: "1px solid",
        borderColor: active
          ? "var(--studio-accent, #8b5cf6)"
          : "var(--studio-border, #333)",
        borderRadius: 7,
        background: active ? "#7c3aed24" : "transparent",
        color: active ? "#c4b5fd" : "var(--studio-muted, #a1a1aa)",
        fontSize: 11,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
