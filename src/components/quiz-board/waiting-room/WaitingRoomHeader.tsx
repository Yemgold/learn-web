





"use client";

import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Radio,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

interface WaitingRoomHeaderProps {
  quizId?: string;
  title?: string;
  description?: string;
  subject?: string;
  status?: string | null;
  currentRound?: number;
  totalRounds?: number;
  contestantCount?: number;
  maxContestants?: number;
  startDate?: string | null;
}

export default function WaitingRoomHeader({
  quizId,
  title = "Quiz Competition",
  description,
  subject = "General",
  status = null,
  currentRound = 0,
  totalRounds = 0,
  contestantCount = 0,
  maxContestants = 0,
  startDate = null,
}: WaitingRoomHeaderProps) {
  const normalizedStatus =
    typeof status === "string"
      ? status.toUpperCase()
      : "";

  const isLive =
    normalizedStatus === "IN_PROGRESS" ||
    currentRound > 0;

  const isActive =
    normalizedStatus === "ACTIVE" ||
    normalizedStatus === "IN_PROGRESS";

  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/30 shadow-2xl shadow-black/20">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative p-5 sm:p-6 lg:p-7">
        {/* Top navigation */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/student/quiz-board"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              Back to Quiz Board
            </span>
            <span className="sm:hidden">
              Back
            </span>
          </Link>

          <StatusBadge
            status={normalizedStatus}
            isLive={isLive}
            isActive={isActive}
          />
        </div>

        {/* Main heading */}
        <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300 shadow-lg shadow-violet-950/20">
              {isLive ? (
                <Radio className="h-6 w-6" />
              ) : (
                <BookOpen className="h-6 w-6" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                  Quiz Waiting Room
                </span>

                {subject && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {subject}
                  </span>
                )}
              </div>

              <h1 className="mt-2 break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
                {title}
              </h1>

              {description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Competition ID */}
          {quizId && (
            <div className="shrink-0 rounded-xl border border-white/8 bg-black/10 px-3 py-2.5 lg:min-w-[180px]">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                Competition ID
              </p>

              <p className="mt-1 truncate font-mono text-[11px] text-slate-400">
                {quizId}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeaderStat
            icon={
              <Users className="h-4 w-4" />
            }
            label="Contestants"
            value={
              maxContestants > 0
                ? `${contestantCount}/${maxContestants}`
                : String(contestantCount)
            }
          />

          <HeaderStat
            icon={
              <Trophy className="h-4 w-4" />
            }
            label="Progress"
            value={
              totalRounds > 0
                ? currentRound > 0
                  ? `Round ${currentRound}/${totalRounds}`
                  : `${totalRounds} Rounds`
                : "—"
            }
          />

          <HeaderStat
            icon={
              <Radio className="h-4 w-4" />
            }
            label="Room"
            value={
              isLive
                ? "Live"
                : isActive
                  ? "Active"
                  : "Waiting"
            }
          />

          <HeaderStat
            icon={
              <Clock3 className="h-4 w-4" />
            }
            label="Scheduled"
            value={formatStartDate(
              startDate,
            )}
          />
        </div>

        {/* Waiting message */}
        <div className="mt-5 rounded-2xl border border-violet-400/10 bg-violet-400/[0.04] px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />

            <div>
              <p className="text-xs font-semibold text-violet-200">
                {getHeaderMessage({
                  isLive,
                  isActive,
                  contestantCount,
                  maxContestants,
                })}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                {isLive
                  ? "The competition is currently running. Follow the live room updates."
                  : "Remain in this room while the host prepares and starts the competition."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3.5">
      <div className="flex items-center gap-2 text-slate-600">
        <span className="text-violet-300">
          {icon}
        </span>

        <span className="text-[9px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
  isLive,
  isActive,
}: {
  status: string;
  isLive: boolean;
  isActive: boolean;
}) {
  if (isLive) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Live
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
        <span className="h-2 w-2 rounded-full bg-cyan-400" />
        Room Active
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
      <span className="h-2 w-2 rounded-full bg-amber-400" />
      {getStatusLabel(status)}
    </div>
  );
}

function getStatusLabel(
  status: string,
): string {
  switch (status) {
    case "WAITING":
    case "WAITING_FOR_PLAYERS":
    case "UPCOMING":
      return "Waiting";

    case "FULL":
      return "Full";

    case "COMPLETED":
    case "FINISHED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "CLOSED":
      return "Closed";

    default:
      return status || "Waiting";
  }
}

function getHeaderMessage({
  isLive,
  isActive,
  contestantCount,
  maxContestants,
}: {
  isLive: boolean;
  isActive: boolean;
  contestantCount: number;
  maxContestants: number;
}): string {
  if (isLive) {
    return "The host has started the competition.";
  }

  if (isActive) {
    return "The quiz room is active and waiting for the host to start.";
  }

  if (
    maxContestants > 0 &&
    contestantCount >= maxContestants
  ) {
    return "The competition is full. Waiting for the host to activate the room.";
  }

  return "Waiting for the competition room to become active.";
}

function formatStartDate(
  value?: string | null,
): string {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}