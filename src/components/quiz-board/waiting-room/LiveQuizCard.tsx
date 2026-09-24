





"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flame,
  Loader2,
  Radio,
  Trophy,
  Users,
} from "lucide-react";

interface LiveQuizCardProps {
  currentRound?: number;
  totalRounds?: number;
  contestantCount?: number;
  maxContestants?: number;
  timePerQuestion?: number;
  socketConnected?: boolean;
  socketRoomJoined?: boolean;
  navigating?: boolean;
  onEnterQuiz?: () => void;
}

function formatTimePerQuestion(
  seconds: number,
): string {
  if (
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return "—";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  const remainingSeconds =
    seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export default function LiveQuizCard({
  currentRound = 0,
  totalRounds = 0,
  contestantCount = 0,
  maxContestants = 0,
  timePerQuestion = 0,
  socketConnected = false,
  socketRoomJoined = false,
  navigating = false,
  onEnterQuiz,
}: LiveQuizCardProps) {
  const connected =
    socketConnected &&
    socketRoomJoined;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.10] via-white/[0.03] to-cyan-500/[0.06] p-5 shadow-xl shadow-emerald-950/10 backdrop-blur-xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
              <Radio className="h-5 w-5" />

              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Live Quiz
                </p>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  LIVE
                </span>
              </div>

              <h2 className="mt-1 text-lg font-bold text-white">
                Round{" "}
                {currentRound > 0
                  ? currentRound
                  : "—"}
                {totalRounds > 0 && (
                  <span className="text-slate-500">
                    {" "}
                    of {totalRounds}
                  </span>
                )}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                The host has started the competition.
              </p>
            </div>
          </div>

          {/* Connection */}
          <div
            className={[
              "hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:flex",
              connected
                ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                : "border-amber-400/20 bg-amber-400/[0.06] text-amber-300",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                connected
                  ? "bg-emerald-400"
                  : "bg-amber-400",
              ].join(" ")}
            />

            {connected
              ? "Connected"
              : "Connecting"}
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <LiveStat
            icon={
              <Trophy className="h-4 w-4" />
            }
            label="Round"
            value={
              currentRound > 0
                ? totalRounds > 0
                  ? `${currentRound}/${totalRounds}`
                  : String(currentRound)
                : "—"
            }
          />

          <LiveStat
            icon={
              <Users className="h-4 w-4" />
            }
            label="Players"
            value={
              maxContestants > 0
                ? `${contestantCount}/${maxContestants}`
                : String(contestantCount)
            }
          />

          <LiveStat
            icon={
              <Clock3 className="h-4 w-4" />
            }
            label="Per Question"
            value={formatTimePerQuestion(
              timePerQuestion,
            )}
          />
        </div>

        {/* Live connection message */}
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
          {connected ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-amber-400" />
          )}

          <div>
            <p className="text-sm font-semibold text-white">
              {connected
                ? "You are connected to the live room"
                : "Connecting to the live room..."}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {connected
                ? "The quiz is live. Enter the quiz to begin answering questions."
                : "Please wait while your connection to the competition room is established."}
            </p>
          </div>
        </div>

        {/* Enter button */}
        {onEnterQuiz && (
          <button
            type="button"
            onClick={onEnterQuiz}
            disabled={navigating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {navigating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening Quiz...
              </>
            ) : (
              <>
                <Flame className="h-4 w-4" />
                Enter Live Quiz
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

interface LiveStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function LiveStat({
  icon,
  label,
  value,
}: LiveStatProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/10 p-3.5">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-emerald-400/80">
          {icon}
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 text-base font-bold text-white">
        {value}
      </p>
    </div>
  );
}