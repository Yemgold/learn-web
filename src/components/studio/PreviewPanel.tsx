


"use client";

import {
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { formatTime } from "@/lib/studio/utils";
import type { Clip } from "@/lib/studio/types";

export type StudioAspectRatio = "16:9" | "9:16" | "1:1" | "4:3";

export const STUDIO_ASPECT_RATIOS: Record<
  StudioAspectRatio,
  { css: string; label: string }
> = {
  "9:16": { css: "9 / 16", label: "Portrait · TikTok / Reels" },
  "16:9": { css: "16 / 9", label: "Landscape · YouTube" },
  "1:1": { css: "1 / 1", label: "Square · Social posts" },
  "4:3": { css: "4 / 3", label: "Classic · 4:3" },
};

interface PreviewPanelProps {
  clip?: Clip | null;
  backgroundClip?: Clip | null;
  currentTime?: number;
  isPlaying?: boolean;
  aspectRatio?: StudioAspectRatio;
  onAspectRatioChange?: (ratio: StudioAspectRatio) => void;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  className?: string;
}

export default function PreviewPanel({
  clip = null,
  backgroundClip = null,
  currentTime = 0,
  isPlaying = false,
  aspectRatio = "9:16",
  onAspectRatioChange,
  onPlayPause,
  onSeek,
  onTimeUpdate,
  onDurationChange,
  className = "",
}: PreviewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [muted, setMuted] = useState(false);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const isVideo = clip?.kind === "video";
  const isAudio = clip?.kind === "audio";
  const isImage = clip?.kind === "image";

  const hasBackgroundImage =
    isVideo &&
    backgroundClip?.kind === "image" &&
    Boolean(backgroundClip.url);

  const hasBackgroundVideo =
    isVideo &&
    backgroundClip?.kind === "video" &&
    Boolean(backgroundClip.url);

  const duration = mediaDuration || clip?.duration || 0;
  const clipStart = clip?.start ?? 0;
  const localTime = Math.max(0, currentTime - clipStart);

  const displayedTime = Math.max(
    0,
    Math.min(localTime, duration || localTime),
  );

  const handleLoadedMetadata = useCallback(
    (value: number) => {
      if (!Number.isFinite(value) || value < 0) return;
      setMediaDuration(value);
      onDurationChange?.(value);
    },
    [onDurationChange],
  );

  const handleTimeUpdate = useCallback(
    (value: number) => {
      if (Number.isFinite(value)) onTimeUpdate?.(value + clipStart);
    },
    [onTimeUpdate, clipStart],
  );

  useEffect(() => {
    setMediaError(false);
    setMediaDuration(0);
  }, [clip?.id, clip?.url]);

  useEffect(() => {
    const media = isVideo
      ? videoRef.current
      : isAudio
        ? audioRef.current
        : null;

    if (!media) return;

    media.muted = muted;

    const syncAndPlay = async () => {
      const target = Math.max(0, currentTime - clipStart);

      if (
        Number.isFinite(target) &&
        Math.abs(media.currentTime - target) > 0.35
      ) {
        try {
          media.currentTime = target;
        } catch {
          // Seeking may not be available until metadata loads.
        }
      }

      if (isPlaying) {
        try {
          await media.play();
        } catch (error) {
          console.warn("Preview playback could not start:", error);
        }
      } else {
        media.pause();
      }
    };

    void syncAndPlay();
  }, [
    isPlaying,
    isVideo,
    isAudio,
    muted,
    currentTime,
    clipStart,
    clip?.url,
  ]);

  useEffect(() => {
    const background = backgroundVideoRef.current;
    if (!background) return;

    background.muted = true;

    const syncBackground = async () => {
      const target = Math.max(0, currentTime - clipStart);

      if (Math.abs(background.currentTime - target) > 0.5) {
        try {
          background.currentTime = target;
        } catch {
          // Wait for media metadata.
        }
      }

      if (isPlaying) {
        try {
          await background.play();
        } catch {
          // Background playback is optional.
        }
      } else {
        background.pause();
      }
    };

    void syncBackground();
  }, [isPlaying, currentTime, clipStart, backgroundClip?.url]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const seekTo = (value: number) => {
    const nextLocalTime = Math.max(0, Math.min(value, duration || value));
    const nextProjectTime = clipStart + nextLocalTime;

    for (const media of [videoRef.current, audioRef.current, backgroundVideoRef.current]) {
      if (!media) continue;
      try {
        media.currentTime = nextLocalTime;
      } catch {
        // The media may not be ready to seek.
      }
    }

    onSeek?.(nextProjectTime);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch (error) {
      console.error("Could not toggle preview fullscreen:", error);
    }
  };

  return (
    <section
      className={`studio-preview-panel ${className}`.trim()}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
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
          padding: "7px 10px",
          flexShrink: 0,
          borderBottom: "1px solid var(--studio-border, #2a2a2a)",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Preview Canvas</div>
          <div
            style={{
              marginTop: 2,
              fontSize: 10,
              color: "var(--studio-muted, #a1a1aa)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 220,
            }}
          >
            {clip?.name || "Choose a format, then import media"}
          </div>
        </div>

        <select
          aria-label="Project canvas aspect ratio"
          value={aspectRatio}
          onChange={(event) =>
            onAspectRatioChange?.(event.target.value as StudioAspectRatio)
          }
          style={{
            maxWidth: 175,
            padding: "5px 7px",
            border: "1px solid var(--studio-border, #333)",
            borderRadius: 5,
            background: "var(--studio-surface, #202020)",
            color: "inherit",
            fontSize: 10,
          }}
        >
          {Object.entries(STUDIO_ASPECT_RATIOS).map(([ratio, item]) => (
            <option key={ratio} value={ratio}>
              {item.label}
            </option>
          ))}
        </select>
      </header>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
          padding: fullscreen ? 0 : 8,
          background: "#090909",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            maxWidth: fullscreen ? "100%" : 680,
            maxHeight: fullscreen ? "100%" : "100%",
            aspectRatio: STUDIO_ASPECT_RATIOS[aspectRatio].css,
            margin: "0 auto",
            overflow: "hidden",
            background: "#000",
            borderRadius: fullscreen ? 0 : 6,
            flex: "0 1 auto",
          }}
        >
          {hasBackgroundImage && (
            <img
              src={backgroundClip!.url}
              alt="Video background"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            />
          )}

          {hasBackgroundVideo && (
            <video
              ref={backgroundVideoRef}
              src={backgroundClip!.url}
              muted
              playsInline
              preload="auto"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            />
          )}

          {isVideo && clip.url && (
            <video
              key={clip.id + clip.url}
              ref={videoRef}
              src={clip.url}
              playsInline
              preload="auto"
              muted={muted}
              onLoadedMetadata={(event) => {
                handleLoadedMetadata(event.currentTarget.duration);
                try {
                  event.currentTarget.currentTime = Math.max(0, currentTime - clipStart);
                } catch {
                  // Metadata may load before seeking is allowed.
                }
              }}
              onTimeUpdate={(event) =>
                handleTimeUpdate(event.currentTarget.currentTime)
              }
              onEnded={() => onPlayPause?.()}
              onError={() => setMediaError(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                zIndex: 1,
                background: "transparent",
              }}
            />
          )}

          {isImage && clip.url && (
            <img
              src={clip.url}
              alt={clip.name}
              onError={() => setMediaError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          )}

          {isAudio && clip.url && (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
                padding: 12,
                background: "radial-gradient(circle at center, #292044, #090909 75%)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#7c3aed",
                  fontSize: 28,
                }}
              >
                ♪
              </div>
              <div
                style={{
                  maxWidth: "90%",
                  fontSize: 12,
                  textAlign: "center",
                  overflowWrap: "anywhere",
                }}
              >
                {clip.name}
              </div>
              <audio
                ref={audioRef}
                src={clip.url}
                preload="auto"
                muted={muted}
                onLoadedMetadata={(event) =>
                  handleLoadedMetadata(event.currentTarget.duration)
                }
                onTimeUpdate={(event) =>
                  handleTimeUpdate(event.currentTarget.currentTime)
                }
                onEnded={() => onPlayPause?.()}
                onError={() => setMediaError(true)}
              />
            </div>
          )}

          {!clip && (
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 7,
                padding: 12,
                color: "#a1a1aa",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 25, opacity: 0.65 }}>▶</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                Your canvas is ready
              </div>
              <div style={{ fontSize: 10 }}>
                Choose your format above, then import your media.
              </div>
            </div>
          )}

          {mediaError && (
            <div
              role="alert"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 12,
                background: "rgba(0,0,0,0.9)",
                color: "#f87171",
                fontSize: 11,
                textAlign: "center",
                zIndex: 3,
              }}
            >
              This media could not be loaded. Try selecting it again.
            </div>
          )}

          {clip && (
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title="Fullscreen preview"
              style={{
                position: "absolute",
                right: 7,
                top: 7,
                display: "grid",
                placeItems: "center",
                width: 27,
                height: 27,
                border: "1px solid #ffffff30",
                borderRadius: 5,
                background: "#0009",
                color: "#fff",
                cursor: "pointer",
                zIndex: 4,
              }}
            >
              <Maximize2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          padding: "7px 10px",
          flexShrink: 0,
          borderTop: "1px solid var(--studio-border, #2a2a2a)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              minWidth: 70,
              fontSize: 10,
              fontVariantNumeric: "tabular-nums",
              color: "var(--studio-muted, #a1a1aa)",
            }}
          >
            {formatTime(displayedTime)} / {formatTime(duration)}
          </span>
          <input
            aria-label="Preview playback position"
            type="range"
            min={0}
            max={Math.max(duration, 0.1)}
            step={0.01}
            value={Math.min(displayedTime, Math.max(duration, 0.1))}
            onChange={(event) => seekTo(Number(event.currentTarget.value))}
            disabled={!clip || duration <= 0}
            style={{
              flex: 1,
              minWidth: 0,
              accentColor: "var(--studio-accent, #8b5cf6)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={() => seekTo(0)}
            disabled={!clip}
            title="Restart preview"
            aria-label="Restart preview"
            style={iconButtonStyle}
          >
            <RotateCcw size={13} />
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            disabled={!clip || !onPlayPause || (!isVideo && !isAudio)}
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
            style={{
              ...iconButtonStyle,
              width: 32,
              height: 29,
              background: "var(--studio-accent, #7c3aed)",
              color: "#fff",
              border: "none",
            }}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            disabled={!isVideo && !isAudio}
            title={muted ? "Unmute media" : "Mute media"}
            aria-label={muted ? "Unmute media" : "Mute media"}
            style={iconButtonStyle}
          >
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>
      </div>
    </section>
  );
}

const iconButtonStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 28,
  height: 27,
  border: "1px solid var(--studio-border, #333)",
  borderRadius: 5,
  background: "var(--studio-surface, #202020)",
  color: "var(--studio-text, #f4f4f5)",
  cursor: "pointer",
};
