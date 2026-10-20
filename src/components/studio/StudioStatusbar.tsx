



"use client";

import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  Cloud,
  LoaderCircle,
  WifiOff,
} from "lucide-react";

export type StudioStatus =
  | "saved"
  | "saving"
  | "unsaved"
  | "error"
  | "offline";

interface StudioStatusbarProps {
  status?: StudioStatus;
  message?: string;
  currentTime?: number;
  duration?: number;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
}

const STATUS_CONFIG: Record<
  StudioStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    color: string;
  }
> = {
  saved: {
    label: "All changes saved",
    icon: CheckCircle2,
    color: "#22c55e",
  },
  saving: {
    label: "Saving changes...",
    icon: LoaderCircle,
    color: "#60a5fa",
  },
  unsaved: {
    label: "Unsaved changes",
    icon: Cloud,
    color: "#f59e0b",
  },
  error: {
    label: "Save failed",
    icon: CircleAlert,
    color: "#ef4444",
  },
  offline: {
    label: "Offline",
    icon: WifiOff,
    color: "#f59e0b",
  },
};

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export default function StudioStatusbar({
  status = "saved",
  message,
  currentTime = 0,
  duration = 0,
  zoom = 100,
  onZoomChange,
  className = "",
}: StudioStatusbarProps) {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  return (
    <footer
      className={`studio-statusbar ${className}`.trim()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        minHeight: 34,
        padding: "6px 14px",
        borderTop: "1px solid var(--studio-border, #2a2a2a)",
        background: "var(--studio-panel, #151515)",
        color: "var(--studio-muted, #a1a1aa)",
        fontSize: 12,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: config.color,
          }}
          role="status"
          aria-live="polite"
        >
          <StatusIcon
            size={14}
            style={
              status === "saving"
                ? { animation: "studio-status-spin 1s linear infinite" }
                : undefined
            }
          />
          {message || config.label}
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Clock3 size={13} />
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>Timeline zoom</span>

        <input
          aria-label="Timeline zoom"
          type="range"
          min={25}
          max={200}
          step={5}
          value={Math.min(200, Math.max(25, zoom))}
          onChange={(event) =>
            onZoomChange?.(Number(event.currentTarget.value))
          }
          disabled={!onZoomChange}
          style={{
            width: 90,
            accentColor: "var(--studio-accent, #8b5cf6)",
            cursor: onZoomChange ? "pointer" : "default",
          }}
        />

        <span
          style={{
            minWidth: 38,
            textAlign: "right",
            color: "var(--studio-text, #f4f4f5)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {zoom}%
        </span>
      </div>

      <style>{`
        @keyframes studio-status-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
}