





"use client";

import {
  Clock3,
  Loader2,
  Radio,
  ShieldCheck,
  UserRound,
} from "lucide-react";

interface WaitingForHostCardProps {
  roomActivated?: boolean;
  roomJoined?: boolean;
  socketConnected?: boolean;
  currentRound?: number;
  totalRounds?: number;
  hostName?: string | null;
}

export default function WaitingForHostCard({
  roomActivated = false,
  roomJoined = false,
  socketConnected = false,
  currentRound = 0,
  totalRounds = 0,
  hostName = null,
}: WaitingForHostCardProps) {
  const readyForHost =
    roomActivated &&
    roomJoined &&
    socketConnected;

  const hasStarted =
    currentRound > 0;

  if (hasStarted) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.07] via-white/[0.025] to-violet-400/[0.05] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            {readyForHost ? (
              <Radio className="h-5 w-5" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}

            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {readyForHost
                ? "Room Ready"
                : "Getting Ready"}
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Waiting for the Host
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-400">
              {getDescription({
                roomActivated,
                roomJoined,
                socketConnected,
              })}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ReadinessItem
            icon={
              <ShieldCheck className="h-4 w-4" />
            }
            label="Room"
            value={
              roomActivated
                ? "Activated"
                : "Waiting"
            }
            active={roomActivated}
          />

          <ReadinessItem
            icon={
              <Radio className="h-4 w-4" />
            }
            label="Connection"
            value={
              socketConnected
                ? "Connected"
                : "Connecting"
            }
            active={socketConnected}
          />

          <ReadinessItem
            icon={
              <UserRound className="h-4 w-4" />
            }
            label="Host"
            value={
              hostName?.trim()
                ? hostName.trim()
                : "Waiting"
            }
            active={Boolean(
              hostName?.trim(),
            )}
          />
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/8 bg-black/10 p-4">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

          <div>
            <p className="text-xs font-semibold text-white">
              Stay in the waiting room
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              The host will start the next round when
              the competition is ready. You will receive
              the live room event when the round begins.
            </p>
          </div>
        </div>

        {totalRounds > 0 && (
          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Competition progress
            </span>

            <span className="font-semibold text-slate-400">
              Round {Math.max(currentRound, 0)} of{" "}
              {totalRounds}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function ReadinessItem({
  icon,
  label,
  value,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
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
            "mt-0.5 truncate text-xs font-semibold",
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

function getDescription({
  roomActivated,
  roomJoined,
  socketConnected,
}: {
  roomActivated: boolean;
  roomJoined: boolean;
  socketConnected: boolean;
}): string {
  if (
    roomActivated &&
    roomJoined &&
    socketConnected
  ) {
    return "You are connected to the live competition room. The host will start the round shortly.";
  }

  if (
    roomActivated &&
    socketConnected &&
    !roomJoined
  ) {
    return "The room is active. We are confirming your membership before the host starts the round.";
  }

  if (roomActivated && !socketConnected) {
    return "The room is active, but your live connection is still being established.";
  }

  return "The competition room has not been activated by the host yet. You can remain here while waiting.";
}