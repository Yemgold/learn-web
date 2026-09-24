




"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Radio,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

interface SocketStatusProps {
  socketConnected?: boolean;
  socketRoomJoined?: boolean;
  socketError?: string | null;
  roomId?: string | null;
  onReconnect?: () => void;
  reconnecting?: boolean;
  compact?: boolean;
}

type ConnectionState =
  | "connected"
  | "connecting"
  | "disconnected"
  | "error";

function getConnectionState({
  socketConnected,
  socketRoomJoined,
  socketError,
}: {
  socketConnected: boolean;
  socketRoomJoined: boolean;
  socketError?: string | null;
}): ConnectionState {
  if (socketError) {
    return "error";
  }

  if (
    socketConnected &&
    socketRoomJoined
  ) {
    return "connected";
  }

  if (socketConnected && !socketRoomJoined) {
    return "connecting";
  }

  return "disconnected";
}

export default function SocketStatus({
  socketConnected = false,
  socketRoomJoined = false,
  socketError = null,
  roomId = null,
  onReconnect,
  reconnecting = false,
  compact = false,
}: SocketStatusProps) {
  const state = getConnectionState({
    socketConnected,
    socketRoomJoined,
    socketError,
  });

  if (compact) {
    return (
      <CompactStatus
        state={state}
        reconnecting={reconnecting}
        onReconnect={onReconnect}
      />
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <StatusIcon
          state={state}
          reconnecting={reconnecting}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-white">
              Live Connection
            </h2>

            <ConnectionBadge state={state} />
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {getStatusDescription(state)}
          </p>
        </div>

        {onReconnect &&
          state !== "connected" && (
            <button
              type="button"
              onClick={onReconnect}
              disabled={reconnecting}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={[
                  "h-3.5 w-3.5",
                  reconnecting
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />
              {reconnecting
                ? "Reconnecting..."
                : "Reconnect"}
            </button>
          )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ConnectionDetail
          label="Socket"
          value={
            socketConnected
              ? "Connected"
              : "Disconnected"
          }
          active={socketConnected}
          icon={<Wifi className="h-4 w-4" />}
        />

        <ConnectionDetail
          label="Quiz Room"
          value={
            socketRoomJoined
              ? "Joined"
              : socketConnected
                ? "Joining..."
                : "Not joined"
          }
          active={socketRoomJoined}
          icon={<Radio className="h-4 w-4" />}
        />
      </div>

      {roomId && (
        <div className="mt-3 rounded-xl border border-white/8 bg-black/10 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Room
            </span>

            <span className="max-w-[70%] truncate font-mono text-[11px] text-slate-400">
              {roomId}
            </span>
          </div>
        </div>
      )}

      {socketError && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-400/15 bg-red-400/[0.05] p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

          <div className="min-w-0">
            <p className="text-xs font-semibold text-red-300">
              Connection error
            </p>

            <p className="mt-1 break-words text-[11px] leading-5 text-slate-400">
              {socketError}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function CompactStatus({
  state,
  reconnecting,
  onReconnect,
}: {
  state: ConnectionState;
  reconnecting: boolean;
  onReconnect?: () => void;
}) {
  const isConnected =
    state === "connected";

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <StatusIcon
          state={state}
          reconnecting={reconnecting}
          small
        />

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">
            {getStatusTitle(state)}
          </p>

          <p className="truncate text-[10px] text-slate-500">
            {isConnected
              ? "Live room connection established"
              : getStatusDescription(state)}
          </p>
        </div>
      </div>

      {onReconnect && !isConnected && (
        <button
          type="button"
          onClick={onReconnect}
          disabled={reconnecting}
          aria-label="Reconnect to quiz room"
          title="Reconnect to quiz room"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={[
              "h-3.5 w-3.5",
              reconnecting
                ? "animate-spin"
                : "",
            ].join(" ")}
          />
        </button>
      )}
    </div>
  );
}

function StatusIcon({
  state,
  reconnecting,
  small = false,
}: {
  state: ConnectionState;
  reconnecting: boolean;
  small?: boolean;
}) {
  const size = small
    ? "h-8 w-8"
    : "h-10 w-10";

  const iconSize = small
    ? "h-3.5 w-3.5"
    : "h-4.5 w-4.5";

  if (reconnecting) {
    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.07] text-amber-400`}
      >
        <Loader2
          className={`${iconSize} animate-spin`}
        />
      </div>
    );
  }

  if (state === "connected") {
    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-400`}
      >
        <CheckCircle2
          className={iconSize}
        />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.07] text-red-400`}
      >
        <AlertCircle
          className={iconSize}
        />
      </div>
    );
  }

  if (state === "connecting") {
    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.07] text-amber-400`}
      >
        <Loader2
          className={`${iconSize} animate-spin`}
        />
      </div>
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-xl border border-slate-400/10 bg-slate-400/[0.05] text-slate-500`}
    >
      <WifiOff className={iconSize} />
    </div>
  );
}

function ConnectionBadge({
  state,
}: {
  state: ConnectionState;
}) {
  const config: Record<
    ConnectionState,
    {
      label: string;
      className: string;
      dotClassName: string;
    }
  > = {
    connected: {
      label: "Connected",
      className:
        "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300",
      dotClassName: "bg-emerald-400",
    },
    connecting: {
      label: "Connecting",
      className:
        "border-amber-400/20 bg-amber-400/[0.07] text-amber-300",
      dotClassName: "bg-amber-400",
    },
    disconnected: {
      label: "Disconnected",
      className:
        "border-slate-400/10 bg-slate-400/[0.04] text-slate-500",
      dotClassName: "bg-slate-500",
    },
    error: {
      label: "Error",
      className:
        "border-red-400/20 bg-red-400/[0.07] text-red-300",
      dotClassName: "bg-red-400",
    },
  };

  const item = config[state];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
        item.className,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          item.dotClassName,
          state === "connecting"
            ? "animate-pulse"
            : "",
        ].join(" ")}
      />

      {item.label}
    </span>
  );
}

function ConnectionDetail({
  label,
  value,
  active,
  icon,
}: {
  label: string;
  value: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/10 p-3">
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          active
            ? "bg-emerald-400/10 text-emerald-400"
            : "bg-white/[0.04] text-slate-500",
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <p
          className={[
            "mt-0.5 text-xs font-semibold",
            active
              ? "text-emerald-300"
              : "text-slate-500",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function getStatusTitle(
  state: ConnectionState,
): string {
  switch (state) {
    case "connected":
      return "Live connection active";

    case "connecting":
      return "Joining live room";

    case "error":
      return "Connection problem";

    default:
      return "Live connection unavailable";
  }
}

function getStatusDescription(
  state: ConnectionState,
): string {
  switch (state) {
    case "connected":
      return "Your connection to the quiz room is active and ready for live updates.";

    case "connecting":
      return "Your socket connection is active. Waiting for confirmation that you have joined the quiz room.";

    case "error":
      return "The live room connection reported an error. Reconnect before continuing.";

    default:
      return "You are not currently connected to the live quiz room.";
  }
}