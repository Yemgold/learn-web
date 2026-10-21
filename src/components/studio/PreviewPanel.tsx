




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
  aspectRatio: StudioAspectRatio;
  onAspectRatioChange: (ratio: StudioAspectRatio) => void;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  className?: string;
}

const DRIFT_TOLERANCE = 0.3;
const PLAYING_DRIFT_TOLERANCE = 0.85;

function getClipDuration(clip: Clip | null | undefined): number {
  if (!clip) return 0;

  const duration = Number.isFinite(clip.duration)
    ? Math.max(0, clip.duration)
    : 0;

  const trimStart = Number.isFinite(clip.trimStart)
    ? Math.max(0, clip.trimStart)
    : 0;

  const trimEnd = Number.isFinite(clip.trimEnd)
    ? Math.max(0, clip.trimEnd)
    : 0;

  // In this editor, duration is the timeline clip length.
  // Trim values describe the source-media boundaries.
  return Math.max(0, duration - trimEnd);
}

function getLocalTime(projectTime: number, clip: Clip): number {
  const trimStart = Number.isFinite(clip.trimStart)
    ? Math.max(0, clip.trimStart)
    : 0;

  return Math.max(0, trimStart + projectTime - clip.start);
}

function getClipEnd(clip: Clip): number {
  return clip.start + Math.max(0, clip.duration);
}

function isClipActiveAtTime(
  clip: Clip | null | undefined,
  projectTime: number,
): clip is Clip {
  if (!clip) return false;

  return (
    projectTime >= clip.start &&
    projectTime < getClipEnd(clip)
  );
}

function seekMedia(
  media: HTMLMediaElement | null,
  target: number,
  force = false,
) {
  if (!media || !Number.isFinite(target)) return;

  const safeTarget = Math.max(0, target);

  if (media.readyState < HTMLMediaElement.HAVE_METADATA) return;

  const finiteDuration = Number.isFinite(media.duration)
    ? media.duration
    : safeTarget;

  const clampedTarget = Math.min(safeTarget, finiteDuration);

  if (
    force ||
    Math.abs(media.currentTime - clampedTarget) > DRIFT_TOLERANCE
  ) {
    try {
      media.currentTime = clampedTarget;
    } catch {
      // Some browsers cannot seek until a media seekable range is available.
    }
  }
}

async function playMedia(media: HTMLMediaElement | null) {
  if (!media) return;

  try {
    await media.play();
  } catch {
    // Playback can be blocked until the browser receives user interaction.
  }
}

function pauseMedia(media: HTMLMediaElement | null) {
  media?.pause();
}

export default function PreviewPanel({
  clip = null,
  backgroundClip = null,
  currentTime = 0,
  isPlaying = false,
  aspectRatio,
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

  const previousClipIdRef = useRef<string | null>(null);
  const previousBackgroundIdRef = useRef<string | null>(null);
  const previousPlayingRef = useRef(isPlaying);
  const lastReportedTimeRef = useRef(-1);

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

  const clipStart = clip?.start ?? 0;
  const clipDuration = clip ? getClipDuration(clip) : 0;

  const clipLocalTime = clip
    ? getLocalTime(currentTime, clip)
    : 0;

  const displayedTime = clip
    ? Math.max(0, Math.min(clipLocalTime, clipDuration))
    : 0;

  const duration = mediaDuration || clipDuration;

  const mainMediaRef = isVideo ? videoRef : isAudio ? audioRef : null;

  const isMainClipActive = isClipActiveAtTime(clip, currentTime);
  const isBackgroundActive =
    isClipActiveAtTime(backgroundClip, currentTime);

  const handleLoadedMetadata = useCallback(
    (value: number) => {
      if (!Number.isFinite(value) || value < 0) return;

      setMediaDuration(value);
      onDurationChange?.(value);
    },
    [onDurationChange],
  );

  const handleTimeUpdate = useCallback(
    (mediaTime: number) => {
      if (!clip || !Number.isFinite(mediaTime)) return;

      // Convert media-local time back to the project's timeline time.
      const projectTime =
        clip.start +
        Math.max(
          0,
          mediaTime -
            (Number.isFinite(clip.trimStart)
              ? Math.max(0, clip.trimStart)
              : 0),
        );

      // Avoid redundant callbacks when multiple media events report the
      // same time. The parent remains responsible for owning the playhead.
      if (Math.abs(projectTime - lastReportedTimeRef.current) < 0.015) {
        return;
      }

      lastReportedTimeRef.current = projectTime;
      onTimeUpdate?.(projectTime);
    },
    [clip, onTimeUpdate],
  );

  /*
   * Reset metadata/error state when the selected source changes.
   */
  useEffect(() => {
    setMediaError(false);
    setMediaDuration(0);
    lastReportedTimeRef.current = -1;
  }, [clip?.id, clip?.url]);

  /*
   * Keep media volume/mute consistent. Background video is always silent,
   * so it cannot compete with the foreground clip's audio.
   */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted || Boolean(clip?.muted);
      videoRef.current.volume = Math.min(
        1,
        Math.max(0, clip?.volume ?? 1),
      );
    }

    if (audioRef.current) {
      audioRef.current.muted = muted || Boolean(clip?.muted);
      audioRef.current.volume = Math.min(
        1,
        Math.max(0, clip?.volume ?? 1),
      );
    }

    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.muted = true;
      backgroundVideoRef.current.volume = 0;
    }
  }, [muted, clip?.id, clip?.muted, clip?.volume]);

  /*
   * Synchronize all media to the timeline playhead.
   *
   * A foreground clip and a background clip can have different start points
   * and trim values, so each receives its own local seek position.
   */
  useEffect(() => {
    const foreground = mainMediaRef?.current ?? null;
    const background = backgroundVideoRef.current;

    const foregroundActive =
      Boolean(foreground) && isMainClipActive;

    const backgroundActive =
      Boolean(background) &&
      hasBackgroundVideo &&
      isBackgroundActive;

    const foregroundTarget = clip
      ? getLocalTime(currentTime, clip)
      : 0;

    const backgroundTarget =
      backgroundClip && hasBackgroundVideo
        ? getLocalTime(currentTime, backgroundClip)
        : 0;

    const sourceChanged =
      previousClipIdRef.current !== (clip?.id ?? null);

    const backgroundChanged =
      previousBackgroundIdRef.current !==
      (backgroundClip?.id ?? null);

    const playStateChanged =
      previousPlayingRef.current !== isPlaying;

    previousClipIdRef.current = clip?.id ?? null;
    previousBackgroundIdRef.current = backgroundClip?.id ?? null;
    previousPlayingRef.current = isPlaying;

    if (foreground) {
      foreground.muted = muted || Boolean(clip?.muted);

      seekMedia(
        foreground,
        foregroundTarget,
        sourceChanged || playStateChanged || !isPlaying,
      );

      if (isPlaying && foregroundActive) {
        void playMedia(foreground);
      } else {
        pauseMedia(foreground);
      }
    }

    if (background) {
      background.muted = true;
      background.volume = 0;

      seekMedia(
        background,
        backgroundTarget,
        backgroundChanged || playStateChanged || !isPlaying,
      );

      if (isPlaying && backgroundActive) {
        void playMedia(background);
      } else {
        pauseMedia(background);
      }
    }

    // Images have no playback clock. Audio/video playback is driven by the
    // timeline state, not by a second independent timer.
  }, [
    currentTime,
    isPlaying,
    muted,
    clip,
    backgroundClip,
    mainMediaRef,
    isMainClipActive,
    isBackgroundActive,
    hasBackgroundVideo,
  ]);

  /*
   * Pause media when this component unmounts.
   */
  useEffect(() => {
    return () => {
      pauseMedia(videoRef.current);
      pauseMedia(backgroundVideoRef.current);
      pauseMedia(audioRef.current);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  /*
   * When the preview media is the timeline clock, report its current
   * project time. Do not seek it again from its own timeupdate callback.
   */
  const handleForegroundTimeUpdate = useCallback(
    (mediaTime: number) => {
      if (!clip || !Number.isFinite(mediaTime)) return;

      const trimStart = Number.isFinite(clip.trimStart)
        ? Math.max(0, clip.trimStart)
        : 0;

      const projectTime =
        clip.start + Math.max(0, mediaTime - trimStart);

      if (Math.abs(projectTime - lastReportedTimeRef.current) < 0.015) {
        return;
      }

      lastReportedTimeRef.current = projectTime;
      onTimeUpdate?.(projectTime);
    },
    [clip, onTimeUpdate],
  );

  const seekTo = useCallback(
    (value: number) => {
      if (!clip) return;

      const safeLocalTime = Math.max(
        0,
        Math.min(value, clipDuration),
      );

      const projectTime = clipStart + safeLocalTime;

      /*
       * Seek each media element using its own clip's start and trim.
       * The background does not necessarily begin at the same timeline time
       * as the foreground clip.
       */
      seekMedia(
        videoRef.current,
        getLocalTime(projectTime, clip),
        true,
      );

      seekMedia(
        audioRef.current,
        getLocalTime(projectTime, clip),
        true,
      );

      if (backgroundClip && hasBackgroundVideo) {
        seekMedia(
          backgroundVideoRef.current,
          getLocalTime(projectTime, backgroundClip),
          true,
        );
      }

      lastReportedTimeRef.current = projectTime;
      onSeek?.(projectTime);
    },
    [
      clip,
      clipDuration,
      clipStart,
      backgroundClip,
      hasBackgroundVideo,
      onSeek,
    ],
  );

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

  const ratioCss = STUDIO_ASPECT_RATIOS[aspectRatio].css;

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
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            Preview Canvas · {aspectRatio}
          </div>

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
            onAspectRatioChange(
              event.target.value as StudioAspectRatio,
            )
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
            aspectRatio: ratioCss,
            margin: "0 auto",
            overflow: "hidden",
            background: "#000",
            borderRadius: fullscreen ? 0 : 6,
            flex: "0 1 auto",
          }}
        >
          {hasBackgroundImage && isBackgroundActive && (
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
              key={`background-${backgroundClip!.id}-${backgroundClip!.url}`}
              ref={backgroundVideoRef}
              src={backgroundClip!.url}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={() => {
                if (!backgroundClip) return;

                seekMedia(
                  backgroundVideoRef.current,
                  getLocalTime(currentTime, backgroundClip),
                  true,
                );
              }}
              onError={() => setMediaError(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
                display: isBackgroundActive ? "block" : "none",
              }}
            />
          )}

          {isVideo && clip.url && (
            <video
              key={`foreground-${clip.id}-${clip.url}`}
              ref={videoRef}
              src={clip.url}
              playsInline
              preload="auto"
              muted={muted || Boolean(clip.muted)}
              onLoadedMetadata={(event) => {
                handleLoadedMetadata(event.currentTarget.duration);

                seekMedia(
                  event.currentTarget,
                  getLocalTime(currentTime, clip),
                  true,
                );
              }}
              onTimeUpdate={(event) =>
                handleForegroundTimeUpdate(
                  event.currentTarget.currentTime,
                )
              }
              onEnded={() => {
                if (onPlayPause) onPlayPause();
              }}
              onError={() => setMediaError(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: isMainClipActive ? "block" : "none",
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
                background:
                  "radial-gradient(circle at center, #292044, #090909 75%)",
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
                key={`audio-${clip.id}-${clip.url}`}
                ref={audioRef}
                src={clip.url}
                preload="auto"
                muted={muted || Boolean(clip.muted)}
                onLoadedMetadata={(event) =>
                  handleLoadedMetadata(event.currentTarget.duration)
                }
                onTimeUpdate={(event) =>
                  handleForegroundTimeUpdate(
                    event.currentTarget.currentTime,
                  )
                }
                onEnded={() => {
                  if (onPlayPause) onPlayPause();
                }}
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
            onChange={(event) =>
              seekTo(Number(event.currentTarget.value))
            }
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

