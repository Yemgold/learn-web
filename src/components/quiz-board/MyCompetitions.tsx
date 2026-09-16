





// src/components/quiz-board/MyCompetitions.tsx

"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  Radio,
  RefreshCw,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { QuizBoard } from "@/lib/quiz-board/types";

import {
  formatDate,
  getDifficultyClasses,
  getDifficultyLabel,
  getPlayerCountLabel,
  getStatusClasses,
  getStatusLabel,
  getRelativeTime,
} from "@/lib/quiz-board/helpers";

import {
  getQuizBoardPath,
  getQuizBoardWatchPath,
} from "@/lib/quiz-board/constants";

interface MyCompetitionsProps {
  competitions: QuizBoard[];
  isLoading?: boolean;
  error?: string | null;
  currentTime?: number;
  onRetry?: () => void;
}

function getStatusIcon(
  status: QuizBoard["status"],
) {
  switch (status) {
    case "LIVE":
      return <Radio className="h-4 w-4" />;

    case "COMPLETED":
      return <CheckCircle2 className="h-4 w-4" />;

    case "FULL":
      return <Users className="h-4 w-4" />;

    case "UPCOMING":
      return <Clock3 className="h-4 w-4" />;

    case "OPEN":
    default:
      return <Zap className="h-4 w-4" />;
  }
}

function getAction(
  competition: QuizBoard,
) {
  switch (competition.status) {
    case "LIVE":
      return {
        label: "Enter Competition",
        href: getQuizBoardPath(competition.id),
        icon: (
          <ArrowRight className="h-4 w-4" />
        ),
      };

    case "COMPLETED":
      return {
        label: "View Results",
        href: getQuizBoardWatchPath(
          competition.id,
        ),
        icon: (
          <Eye className="h-4 w-4" />
        ),
      };

    case "UPCOMING":
      return {
        label: "View Competition",
        href: getQuizBoardPath(
          competition.id,
        ),
        icon: (
          <Eye className="h-4 w-4" />
        ),
      };

    case "FULL":
      return {
        label: "View Competition",
        href: getQuizBoardPath(
          competition.id,
        ),
        icon: (
          <Eye className="h-4 w-4" />
        ),
      };

    case "OPEN":
    default:
      return {
        label: "Open Competition",
        href: getQuizBoardPath(
          competition.id,
        ),
        icon: (
          <ArrowRight className="h-4 w-4" />
        ),
      };
  }
}

export default function MyCompetitions({
  competitions,
  isLoading = false,
  error = null,
  currentTime = Date.now(),
  onRetry,
}: MyCompetitionsProps) {
  if (isLoading) {
    return (
      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              My Competitions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Competitions you have joined or participated in.
            </p>
          </div>

          {onRetry && (
            <Button
              type="button"
              variant="outline"
              disabled
              className="w-fit gap-2 border-white/10 bg-white/5 text-slate-400"
            >
              <RefreshCw className="h-4 w-4 animate-spin" />
              Reloading
            </Button>
          )}
        </div>

        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-violet-400" />

            <p className="text-sm text-slate-400">
              Loading your competitions...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              My Competitions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Competitions you have joined or participated in.
            </p>
          </div>

          {onRetry && (
            <Button
              type="button"
              onClick={onRetry}
              variant="outline"
              className="w-fit gap-2 border-white/10 bg-white/5 text-slate-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Reload
            </Button>
          )}
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-6 w-6 text-red-400" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-white">
            Unable to load competitions
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            {error}
          </p>

          {onRetry && (
            <Button
              type="button"
              onClick={onRetry}
              variant="outline"
              className="mt-5 gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </section>
    );
  }

  if (!competitions.length) {
    return (
      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              My Competitions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Competitions you have joined or participated in.
            </p>
          </div>

          {onRetry && (
            <Button
              type="button"
              onClick={onRetry}
              variant="outline"
              className="w-fit gap-2 border-white/10 bg-white/5 text-slate-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Reload
            </Button>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
            <Trophy className="h-7 w-7 text-violet-400" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">
            No competitions yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            You have not joined any quiz competitions yet.
            Browse the available competitions and join one
            to see it here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-violet-400" />

            <h2 className="text-xl font-bold text-white">
              My Competitions
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Competitions you have joined or participated in.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Reload Button */}
          {onRetry && (
            <Button
              type="button"
              onClick={onRetry}
              disabled={isLoading}
              variant="outline"
              title="Reload my competitions"
              aria-label="Reload my competitions"
              className="h-9 gap-2 border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white disabled:pointer-events-none disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoading
                    ? "animate-spin"
                    : ""
                }`}
              />

              <span className="hidden sm:inline">
                Reload
              </span>
            </Button>
          )}

          {/* Competition Count */}
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
            {competitions.length}{" "}
            {competitions.length === 1
              ? "competition"
              : "competitions"}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Competition cards                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 lg:grid-cols-2">
        {competitions.map(
          (competition) => {
            const action =
              getAction(competition);

            return (
              <article
                key={competition.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-slate-900"
              >
                {/* Top glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl transition duration-300 group-hover:bg-violet-500/20" />

                {/* ------------------------------------------------------ */}
                {/* Header                                                   */}
                {/* ------------------------------------------------------ */}

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusClasses(
                          competition.status,
                        )}`}
                      >
                        {getStatusIcon(
                          competition.status,
                        )}

                        {getStatusLabel(
                          competition.status,
                        )}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getDifficultyClasses(
                          competition.difficulty,
                        )}`}
                      >
                        {getDifficultyLabel(
                          competition.difficulty,
                        )}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-base font-bold leading-6 text-white transition group-hover:text-violet-200">
                      {competition.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-400">
                      {competition.description}
                    </p>
                  </div>

                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 sm:flex">
                    <Trophy className="h-5 w-5 text-violet-400" />
                  </div>
                </div>

                {/* ------------------------------------------------------ */}
                {/* Competition information                                 */}
                {/* ------------------------------------------------------ */}

                <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Subject
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                      {competition.subject}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Players
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-500" />

                      <p className="text-sm font-semibold text-slate-200">
                        {getPlayerCountLabel(
                          competition,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Questions
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {competition.totalQuestions ||
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Rounds
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {competition.numberOfRounds ||
                        "—"}
                    </p>
                  </div>
                </div>

                {/* ------------------------------------------------------ */}
                {/* Rewards / timing                                        */}
                {/* ------------------------------------------------------ */}

                <div className="relative mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-400" />

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">
                        1st Prize
                      </p>

                      <p className="text-sm font-bold text-white">
                        {competition.winnerReward}
                      </p>
                    </div>
                  </div>

                  {competition.secondReward >
                    0 && (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-slate-400" />

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          2nd Prize
                        </p>

                        <p className="text-sm font-semibold text-slate-200">
                          {competition.secondReward}
                        </p>
                      </div>
                    </div>
                  )}

                  {competition.durationMinutes >
                    0 && (
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-500" />

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          Duration
                        </p>

                        <p className="text-sm font-semibold text-slate-200">
                          {
                            competition.durationMinutes
                          }{" "}
                          min
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ------------------------------------------------------ */}
                {/* Date                                                     */}
                {/* ------------------------------------------------------ */}

                {(competition.startsAt ||
                  competition.createdAt) && (
                  <div className="relative mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          {competition.startsAt
                            ? "Competition"
                            : "Joined"}
                        </p>

                        <p className="truncate text-xs font-medium text-slate-300">
                          {formatDate(
                            competition.startsAt ||
                              competition.createdAt,
                          )}
                        </p>
                      </div>
                    </div>

                    {competition.startsAt && (
                      <span className="shrink-0 text-xs font-medium text-violet-400">
                        {getRelativeTime(
                          competition.startsAt,
                          currentTime,
                        )}
                      </span>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------ */}
                {/* Action                                                   */}
                {/* ------------------------------------------------------ */}

                <div className="relative mt-5">
                  <Link
                    href={action.href}
                    className="block"
                  >
                    <Button
                      type="button"
                      className="w-full gap-2 bg-violet-600 text-white hover:bg-violet-500"
                    >
                      {action.label}
                      {action.icon}
                    </Button>
                  </Link>
                </div>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}