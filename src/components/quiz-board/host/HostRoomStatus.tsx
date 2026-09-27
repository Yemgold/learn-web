




"use client";

import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Loader2,
  Radio,
  RefreshCw,
  ShieldCheck,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";

export type HostRoomConnectionStatus =
  | "CONNECTED"
  | "CONNECTING"
  | "DISCONNECTED"
  | "ERROR";

export type HostRoomState =
  | "WAITING"
  | "READY"
  | "LIVE"
  | "LOCKED"
  | "COMPLETED"
  | "CANCELLED";

export interface HostRoomStatusProps {
  roomId: string;

  /**
   * Quiz identifier associated with this room.
   */
  quizId?: string;

  /**
   * Whether the Socket.IO connection is established.
   */
  connected: boolean;

  /**
   * Optional connection state for more precise UI.
   */
  connectionStatus?: HostRoomConnectionStatus;

  /**
   * Whether the backend has activated the room.
   */
  roomActivated: boolean;

  /**
   * Current logical room/game state.
   */
  roomState?: HostRoomState;

  /**
   * Number of participants currently known by the host.
   */
  participantCount?: number;

  /**
   * Number of participants currently connected.
   */
  onlineParticipantCount?: number;

  /**
   * Current round.
   */
  currentRound?: number | null;

  /**
   * Total number of rounds.
   */
  totalRounds?: number | null;

  /**
   * Current question.
   */
  currentQuestionNumber?: number | null;

  /**
   * Total questions in current round.
   */
  totalQuestions?: number | null;

  /**
   * Optional backend/socket error.
   */
  error?: string | null;

  /**
   * Shows a loading state while activating/reconnecting.
   */
  loading?: boolean;

  /**
   * Optional retry/refresh action.
   */
  onRetry?: () => void;

  /**
   * Compact presentation.
   */
  compact?: boolean;

  /**
   * Whether to show the quiz ID.
   */
  showQuizId?: boolean;

  /**
   * Whether to show participant statistics.
   */
  showParticipants?: boolean;

  /**
   * Whether to show round/question statistics.
   */
  showProgress?: boolean;
}

function getConnectionLabel(
  connected: boolean,
  connectionStatus?: HostRoomConnectionStatus,
) {
  if (connectionStatus === "CONNECTING") {
    return "Connecting";
  }

  if (connectionStatus === "ERROR") {
    return "Connection Error";
  }

  if (connected || connectionStatus === "CONNECTED") {
    return "Connected";
  }

  return "Disconnected";
}

function getConnectionClasses(
  connected: boolean,
  connectionStatus?: HostRoomConnectionStatus,
) {
  if (connectionStatus === "CONNECTING") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  if (connectionStatus === "ERROR") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  if (connected || connectionStatus === "CONNECTED") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  return "border-slate-600 bg-slate-800 text-slate-400";
}

function getRoomStateClasses(state: HostRoomState) {
  switch (state) {
    case "LIVE":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "LOCKED":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "COMPLETED":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";

    case "CANCELLED":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    case "READY":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

    default:
      return "border-slate-600 bg-slate-800 text-slate-300";
  }
}

export default function HostRoomStatus({
  roomId,
  quizId,

  connected,
  connectionStatus,

  roomActivated,
  roomState = "WAITING",

  participantCount = 0,
  onlineParticipantCount = 0,

  currentRound = null,
  totalRounds = null,

  currentQuestionNumber = null,
  totalQuestions = null,

  error = null,

  loading = false,

  onRetry,

  compact = false,

  showQuizId = false,
  showParticipants = true,
  showProgress = true,
}: HostRoomStatusProps) {
  const connectionLabel = getConnectionLabel(
    connected,
    connectionStatus,
  );

  const connectionClasses = getConnectionClasses(
    connected,
    connectionStatus,
  );

  const isConnecting =
    connectionStatus === "CONNECTING" || loading;

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
              roomActivated
                ? "border-cyan-400/20 bg-cyan-400/10"
                : "border-slate-700 bg-slate-800",
            ].join(" ")}
          >
            <Radio
              className={[
                "h-5 w-5",
                roomActivated
                  ? "text-cyan-300"
                  : "text-slate-500",
              ].join(" ")}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                Room Status
              </h2>

              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-300">
                HOST
              </span>
            </div>

            <p className="mt-1 truncate text-xs text-slate-500">
              Room: {roomId}
            </p>
          </div>
        </div>

        {/* Connection */}
        <div
          className={[
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider",
            connectionClasses,
          ].join(" ")}
        >
          {isConnecting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : connected ? (
            <Wifi className="h-3.5 w-3.5" />
          ) : (
            <WifiOff className="h-3.5 w-3.5" />
          )}

          {connectionLabel}
        </div>
      </div>

      {/* Room state */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Room
          </p>

          <div className="mt-2 flex items-center gap-2">
            {roomActivated ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            ) : (
              <CircleDot className="h-4 w-4 text-amber-300" />
            )}

            <span className="text-sm font-semibold text-white">
              {roomActivated
                ? "Activated"
                : "Activation Pending"}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-slate-500">
            {roomActivated
              ? "The room is available for the live game."
              : "The room must be activated before gameplay."}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Game State
          </p>

          <div className="mt-2">
            <span
              className={[
                "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                getRoomStateClasses(roomState),
              ].join(" ")}
            >
              {roomState}
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Server-reported room state.
          </p>
        </div>
      </div>

      {/* Progress */}
      {showProgress && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Round
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              {currentRound ?? "—"}
              {totalRounds ? ` / ${totalRounds}` : ""}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Question
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              {currentQuestionNumber ?? "—"}
              {totalQuestions
                ? ` / ${totalQuestions}`
                : ""}
            </p>
          </div>
        </div>
      )}

      {/* Participants */}
      {showParticipants && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />

              <span className="text-xs font-semibold text-slate-300">
                Participants
              </span>
            </div>

            <span className="text-sm font-bold text-white">
              {participantCount}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Currently online
            </span>

            <span className="font-semibold text-emerald-300">
              {onlineParticipantCount}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-emerald-400/60 transition-all"
              style={{
                width:
                  participantCount > 0
                    ? `${Math.min(
                        100,
                        (onlineParticipantCount /
                          participantCount) *
                          100,
                      )}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      )}

      {/* Quiz ID */}
      {showQuizId && quizId && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Quiz ID
          </p>

          <p className="mt-1 break-all font-mono text-[11px] text-slate-400">
            {quizId}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-red-200">
              Connection or room error
            </p>

            <p className="mt-1 text-[11px] leading-5 text-red-200/70">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Retry */}
      {onRetry && (!connected || error) && (
        <button
          type="button"
          onClick={onRetry}
          disabled={loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}

          {loading ? "Reconnecting..." : "Reconnect"}
        </button>
      )}

      {/* Host authority note */}
      <div className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-slate-600">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/60" />

        <span>
          Room state shown here should come from the authoritative
          quiz session/socket state.
        </span>
      </div>
    </section>
  );
}