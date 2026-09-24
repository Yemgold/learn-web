





"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Radio,
  ShieldCheck,
  Trophy,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";

interface WaitingRoomStatusProps {
  roomActivated?: boolean;
  roomJoined?: boolean;
  socketConnected?: boolean;
  socketError?: string | null;

  contestantCount?: number;
  maxContestants?: number;

  currentRound?: number;
  totalRounds?: number;

  roomStatus?: string | null;
  quizStatus?: string | null;

  loading?: boolean;
  error?: string | null;

  onReconnect?: () => void;
  reconnecting?: boolean;
}

type StatusTone =
  | "loading"
  | "waiting"
  | "ready"
  | "live"
  | "warning"
  | "error"
  | "completed";

export default function WaitingRoomStatus({
  roomActivated = false,
  roomJoined = false,
  socketConnected = false,
  socketError = null,
  contestantCount = 0,
  maxContestants = 0,
  currentRound = 0,
  totalRounds = 0,
  roomStatus = null,
  quizStatus = null,
  loading = false,
  error = null,
  onReconnect,
  reconnecting = false,
}: WaitingRoomStatusProps) {
  const normalizedRoomStatus = normalizeStatus(roomStatus);
  const normalizedQuizStatus = normalizeStatus(quizStatus);

  const live =
    normalizedRoomStatus === "IN_PROGRESS" ||
    normalizedQuizStatus === "IN_PROGRESS" ||
    currentRound > 0;

  const completed =
    normalizedRoomStatus === "COMPLETED" ||
    normalizedRoomStatus === "FINISHED" ||
    normalizedRoomStatus === "CLOSED" ||
    normalizedQuizStatus === "COMPLETED" ||
    normalizedQuizStatus === "FINISHED";

  const full =
    maxContestants > 0 &&
    contestantCount >= maxContestants;

  const socketReady =
    socketConnected && roomJoined;

  const tone = getStatusTone({
    loading,
    error,
    completed,
    live,
    roomActivated,
    roomJoined,
    socketConnected,
    socketReady,
    full,
  });

  const config = getStatusConfig(tone);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="p-5 sm:p-6">
        {/* Main status */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <StatusIcon
              tone={tone}
              reconnecting={reconnecting}
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={[
                    "text-[10px] font-bold uppercase tracking-[0.18em]",
                    config.labelClassName,
                  ].join(" ")}
                >
                  Room Status
                </p>

                <span
                  className={[
                    "rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                    config.badgeClassName,
                  ].join(" ")}
                >
                  {config.badge}
                </span>
              </div>

              <h2 className="mt-1.5 text-lg font-bold text-white">
                {config.title}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-400">
                {getDescription({
                  tone,
                  roomActivated,
                  roomJoined,
                  socketConnected,
                  socketReady,
                  full,
                  contestantCount,
                  maxContestants,
                  currentRound,
                  totalRounds,
                })}
              </p>
            </div>
          </div>

          {tone === "error" &&
            onReconnect && (
              <button
                type="button"
                onClick={onReconnect}
                disabled={reconnecting}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reconnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reconnecting...
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4" />
                    Reconnect
                  </>
                )}
              </button>
            )}
        </div>

        {/* Progress / state cards */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatusStep
            icon={
              <Users className="h-4 w-4" />
            }
            label="Contestants"
            value={
              maxContestants > 0
                ? `${contestantCount}/${maxContestants}`
                : String(contestantCount)
            }
            status={
              full
                ? "ready"
                : "waiting"
            }
          />

          <StatusStep
            icon={
              <Radio className="h-4 w-4" />
            }
            label="Quiz Room"
            value={
              roomActivated
                ? "Active"
                : "Waiting"
            }
            status={
              roomActivated
                ? "ready"
                : "waiting"
            }
          />

          <StatusStep
            icon={
              socketReady ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )
            }
            label="Connection"
            value={
              socketReady
                ? "Connected"
                : socketConnected
                  ? "Joining"
                  : "Offline"
            }
            status={
              socketReady
                ? "ready"
                : socketConnected
                  ? "waiting"
                  : "warning"
            }
          />

          <StatusStep
            icon={
              <Trophy className="h-4 w-4" />
            }
            label="Competition"
            value={
              live
                ? totalRounds > 0
                  ? `Round ${currentRound}/${totalRounds}`
                  : `Round ${currentRound}`
                : completed
                  ? "Completed"
                  : "Waiting"
            }
            status={
              completed
                ? "ready"
                : live
                  ? "live"
                  : "waiting"
            }
          />
        </div>

        {/* Connection warning */}
        {socketError && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-300">
                Live connection issue
              </p>

              <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                {socketError}
              </p>
            </div>
          </div>
        )}

        {/* General error */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.05] p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

            <div className="min-w-0">
              <p className="text-xs font-semibold text-red-300">
                Waiting room error
              </p>

              <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Security / live-room notice */}
        {!error &&
          !socketError &&
          !completed && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

              <div>
                <p className="text-xs font-semibold text-cyan-300">
                  Stay in this room
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Keep this page open. Live room events will update your
                  status automatically when the host activates or starts
                  the competition.
                </p>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}

function StatusIcon({
  tone,
  reconnecting,
}: {
  tone: StatusTone;
  reconnecting: boolean;
}) {
  const className =
    "h-5 w-5";

  if (reconnecting || tone === "loading") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
        <Loader2
          className={`${className} animate-spin`}
        />
      </div>
    );
  }

  if (tone === "live") {
    return (
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
        <Radio className={className} />

        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
        </span>
      </div>
    );
  }

  if (tone === "completed") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
        <Trophy className={className} />
      </div>
    );
  }

  if (tone === "error") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-400">
        <AlertCircle className={className} />
      </div>
    );
  }

  if (tone === "ready") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
        <CheckCircle2 className={className} />
      </div>
    );
  }

  if (tone === "warning") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
        <WifiOff className={className} />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
      <Clock3 className={className} />
    </div>
  );
}

function StatusStep({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: "waiting" | "ready" | "warning" | "live";
}) {
  const classes = {
    waiting: {
      icon: "text-slate-500",
      value: "text-slate-300",
      dot: "bg-slate-500",
    },
    ready: {
      icon: "text-emerald-400",
      value: "text-emerald-300",
      dot: "bg-emerald-400",
    },
    warning: {
      icon: "text-amber-400",
      value: "text-amber-300",
      dot: "bg-amber-400",
    },
    live: {
      icon: "text-cyan-400",
      value: "text-cyan-300",
      dot: "bg-cyan-400",
    },
  }[status];

  return (
    <div className="rounded-xl border border-white/8 bg-black/10 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-500">
          <span className={classes.icon}>
            {icon}
          </span>

          <span className="text-[9px] font-bold uppercase tracking-wider">
            {label}
          </span>
        </div>

        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            classes.dot,
          ].join(" ")}
        />
      </div>

      <p
        className={[
          "mt-2 text-sm font-bold",
          classes.value,
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function getStatusTone({
  loading,
  error,
  completed,
  live,
  roomActivated,
  roomJoined,
  socketConnected,
  socketReady,
  full,
}: {
  loading: boolean;
  error?: string | null;
  completed: boolean;
  live: boolean;
  roomActivated: boolean;
  roomJoined: boolean;
  socketConnected: boolean;
  socketReady: boolean;
  full: boolean;
}): StatusTone {
  if (loading) {
    return "loading";
  }

  if (error) {
    return "error";
  }

  if (completed) {
    return "completed";
  }

  if (live) {
    return "live";
  }

  if (
    roomActivated &&
    roomJoined &&
    socketReady
  ) {
    return "ready";
  }

  if (
    socketConnected &&
    !roomJoined
  ) {
    return "waiting";
  }

  if (
    roomActivated &&
    !socketConnected
  ) {
    return "warning";
  }

  if (full) {
    return "waiting";
  }

  return "waiting";
}

function getStatusConfig(
  tone: StatusTone,
) {
  switch (tone) {
    case "loading":
      return {
        title: "Loading Waiting Room",
        badge: "Loading",
        labelClassName: "text-violet-300",
        badgeClassName:
          "border-violet-400/20 bg-violet-400/10 text-violet-300",
      };

    case "live":
      return {
        title: "Competition Is Live",
        badge: "Live",
        labelClassName: "text-emerald-400",
        badgeClassName:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };

    case "completed":
      return {
        title: "Competition Completed",
        badge: "Completed",
        labelClassName: "text-emerald-400",
        badgeClassName:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };

    case "ready":
      return {
        title: "Room Ready",
        badge: "Ready",
        labelClassName: "text-cyan-400",
        badgeClassName:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      };

    case "error":
      return {
        title: "Connection Requires Attention",
        badge: "Error",
        labelClassName: "text-red-400",
        badgeClassName:
          "border-red-400/20 bg-red-400/10 text-red-300",
      };

    case "warning":
      return {
        title: "Connecting to Room",
        badge: "Connecting",
        labelClassName: "text-amber-400",
        badgeClassName:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };

    case "waiting":
    default:
      return {
        title: "Waiting for the Host",
        badge: "Waiting",
        labelClassName: "text-violet-300",
        badgeClassName:
          "border-violet-400/20 bg-violet-400/10 text-violet-300",
      };
  }
}

function getDescription({
  tone,
  roomActivated,
  roomJoined,
  socketConnected,
  socketReady,
  full,
  contestantCount,
  maxContestants,
  currentRound,
  totalRounds,
}: {
  tone: StatusTone;
  roomActivated: boolean;
  roomJoined: boolean;
  socketConnected: boolean;
  socketReady: boolean;
  full: boolean;
  contestantCount: number;
  maxContestants: number;
  currentRound: number;
  totalRounds: number;
}): string {
  if (tone === "loading") {
    return "Preparing the competition room and checking your current participation.";
  }

  if (tone === "error") {
    return "The waiting room encountered a problem. Check the connection and try again.";
  }

  if (tone === "completed") {
    return "This competition has finished. Your waiting-room session is no longer active.";
  }

  if (tone === "live") {
    if (totalRounds > 0) {
      return `Round ${currentRound} of ${totalRounds} is currently active.`;
    }

    return "The host has started the competition and the live quiz is underway.";
  }

  if (!roomActivated) {
    if (full) {
      return `All ${maxContestants} contestant positions are filled. The room is waiting for the host to activate it.`;
    }

    return `Waiting for the host to activate the quiz room. ${contestantCount} contestant${contestantCount === 1 ? "" : "s"} ${contestantCount === 1 ? "is" : "are"} currently registered.`;
  }

  if (!socketConnected) {
    return "The quiz room is active. Establishing the live connection...";
  }

  if (!roomJoined) {
    return "Your live connection is established. Joining the authorized quiz room...";
  }

  if (!socketReady) {
    return "Your room connection is being verified.";
  }

  return "You are connected to the active room. The competition will begin when the host starts the first round.";
}

function normalizeStatus(
  value?: string | null,
): string {
  return typeof value === "string"
    ? value.trim().toUpperCase()
    : "";
}