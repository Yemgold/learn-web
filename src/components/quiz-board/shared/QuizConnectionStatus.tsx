




"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";

export type QuizConnectionState =
  | "CONNECTED"
  | "CONNECTING"
  | "DISCONNECTED"
  | "ERROR";

export interface QuizConnectionStatusProps {
  status?: QuizConnectionState;
  connected?: boolean;

  label?: string;
  message?: string | null;

  showLabel?: boolean;
  showMessage?: boolean;

  compact?: boolean;
}

export default function QuizConnectionStatus({
  status,
  connected = false,
  label,
  message = null,
  showLabel = true,
  showMessage = false,
  compact = false,
}: QuizConnectionStatusProps) {
  const resolvedStatus: QuizConnectionState =
    status ??
    (connected ? "CONNECTED" : "DISCONNECTED");

  const config = {
    CONNECTED: {
      icon: CheckCircle2,
      label: label ?? "Connected",
      message:
        message ?? "Live connection is active.",
      className:
        "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
      iconClassName: "text-emerald-300",
    },

    CONNECTING: {
      icon: Loader2,
      label: label ?? "Connecting",
      message:
        message ?? "Connecting to the quiz server...",
      className:
        "border-amber-400/20 bg-amber-400/5 text-amber-300",
      iconClassName:
        "animate-spin text-amber-300",
    },

    DISCONNECTED: {
      icon: WifiOff,
      label: label ?? "Disconnected",
      message:
        message ??
        "The live connection has been lost.",
      className:
        "border-slate-400/20 bg-white/[0.03] text-slate-300",
      iconClassName: "text-slate-400",
    },

    ERROR: {
      icon: AlertCircle,
      label: label ?? "Connection error",
      message:
        message ??
        "Unable to maintain the live connection.",
      className:
        "border-red-400/20 bg-red-400/5 text-red-300",
      iconClassName: "text-red-300",
    },
  }[resolvedStatus];

  const Icon = config.icon;

  return (
    <div
      className={[
        "rounded-xl border",
        compact ? "px-2.5 py-1.5" : "px-3 py-2",
        config.className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={[
            compact ? "h-3.5 w-3.5" : "h-4 w-4",
            config.iconClassName,
          ].join(" ")}
        />

        {showLabel && (
          <span
            className={[
              "font-medium",
              compact
                ? "text-xs"
                : "text-sm",
            ].join(" ")}
          >
            {config.label}
          </span>
        )}

        {resolvedStatus === "CONNECTED" && (
          <Wifi
            className={
              compact
                ? "h-3 w-3 opacity-40"
                : "h-3.5 w-3.5 opacity-40"
            }
          />
        )}
      </div>

      {showMessage && (
        <p className="mt-1 text-xs leading-5 opacity-70">
          {config.message}
        </p>
      )}
    </div>
  );
}