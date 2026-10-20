




"use client";

import {
  ChevronFirst,
  ChevronLast,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { formatTime } from "@/lib/studio/utils";

interface TransportControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function TransportControls({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  disabled = false,
  className = "",
}: TransportControlsProps) {
  const safeDuration = Math.max(0, duration);
  const safeCurrentTime = Math.min(
    safeDuration,
    Math.max(0, currentTime),
  );

  const seekTo = (time: number) => {
    onSeek(Math.min(safeDuration, Math.max(0, time)));
  };

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    border: "1px solid var(--studio-border, #333)",
    borderRadius: 8,
    background: "var(--studio-panel, #181818)",
    color: "var(--studio-text, #f5f5f5)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background 150ms ease, opacity 150ms ease",
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "none",
    background: "var(--studio-accent, #7c3aed)",
    color: "#ffffff",
  };

  return (
    <div
      className={className}
      aria-label="Video playback controls"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 12,
        width: "100%",
        padding: "10px 12px",
        boxSizing: "border-box",
        color: "var(--studio-text, #f5f5f5)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <button
          type="button"
          title="Go to beginning"
          aria-label="Go to beginning"
          disabled={disabled || safeCurrentTime <= 0}
          onClick={() => seekTo(0)}
          style={buttonStyle}
        >
          <ChevronFirst size={17} />
        </button>

        <button
          type="button"
          title="Back 5 seconds"
          aria-label="Back 5 seconds"
          disabled={disabled || safeCurrentTime <= 0}
          onClick={() => seekTo(safeCurrentTime - 5)}
          style={buttonStyle}
        >
          <SkipBack size={16} />
        </button>

        <button
          type="button"
          title={isPlaying ? "Pause playback" : "Start playback"}
          aria-label={isPlaying ? "Pause playback" : "Start playback"}
          disabled={disabled || safeDuration <= 0}
          onClick={onPlayPause}
          style={primaryButtonStyle}
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </button>

        <button
          type="button"
          title="Forward 5 seconds"
          aria-label="Forward 5 seconds"
          disabled={disabled || safeCurrentTime >= safeDuration}
          onClick={() => seekTo(safeCurrentTime + 5)}
          style={buttonStyle}
        >
          <SkipForward size={16} />
        </button>

        <button
          type="button"
          title="Go to end"
          aria-label="Go to end"
          disabled={disabled || safeCurrentTime >= safeDuration}
          onClick={() => seekTo(safeDuration)}
          style={buttonStyle}
        >
          <ChevronLast size={17} />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          minWidth: 110,
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: 12,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>{formatTime(safeCurrentTime)}</span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ opacity: 0.75 }}>
          {formatTime(safeDuration)}
        </span>
      </div>
    </div>
  );
}
