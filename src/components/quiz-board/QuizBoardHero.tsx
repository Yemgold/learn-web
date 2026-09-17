




// src/components/quiz-board/QuizBoardHero.tsx

"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Flame,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import {
  QUIZ_BOARD_PAGE_DESCRIPTION,
  QUIZ_BOARD_PAGE_TITLE,
  QUIZ_BOARD_QUALIFICATION_SEQUENCE,
} from "@/lib/quiz-board/constants";

import type { QuizBoardStats } from "@/lib/quiz-board/types";

interface QuizBoardHeroProps {
  stats?: QuizBoardStats;
  totalCompetitions?: number;
  isLoading?: boolean;
}

export default function QuizBoardHero({
  stats,
  totalCompetitions,
  isLoading = false,
}: QuizBoardHeroProps) {
  const total =
    totalCompetitions ??
    stats?.total ??
    0;

  const open =
    stats?.open ?? 0;

  const live =
    stats?.live ?? 0;

  const upcoming =
    stats?.upcoming ?? 0;

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/20">
      {/* ------------------------------------------------------------------ */}
      {/* Background effects                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />

        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-fuchsia-500/5 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_30%)]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main hero                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* -------------------------------------------------------------- */}
          {/* Hero copy                                                       */}
          {/* -------------------------------------------------------------- */}

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-violet-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
                JAMB League Competition Arena
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {QUIZ_BOARD_PAGE_TITLE}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              {QUIZ_BOARD_PAGE_DESCRIPTION}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="#quiz-competitions"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500"
              >
                Browse Competitions
                <ArrowRight className="h-4 w-4" />
              </Link>


              <Link
  href="/student/quiz-board/my-competitions"
  className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-300 shadow-lg shadow-blue-900/10 transition hover:bg-blue-500/20 hover:text-blue-200"
>
  <Trophy className="h-4 w-4" />
  My Competitions
</Link>

              <Link
                href="/student/practice/cbtsubjects?exam=jamb"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <BookOpen className="h-4 w-4" />
                Practice First
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Competition visual                                             */}
          {/* -------------------------------------------------------------- */}

          <div className="hidden lg:block">
            <div className="relative flex h-56 w-56 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-violet-500/10" />

              <div className="absolute inset-5 rounded-full border border-violet-500/10" />

              <div className="absolute inset-10 rounded-full border border-violet-500/20 bg-violet-500/5" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-500/30 bg-violet-500/10 shadow-2xl shadow-violet-900/20">
                <Trophy className="h-11 w-11 text-violet-300" />
              </div>

              <div className="absolute right-2 top-7 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Crown className="h-5 w-5 text-amber-400" />
              </div>

              <div className="absolute bottom-7 left-3 flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                <Flame className="h-5 w-5 text-red-400" />
              </div>

              <div className="absolute bottom-2 right-9 flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stats                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-8 grid grid-cols-2 gap-2 border-t border-white/5 pt-6 sm:grid-cols-4 sm:gap-3">
          <StatCard
            icon={
              <Trophy className="h-4 w-4 text-violet-400" />
            }
            label="Competitions"
            value={total}
            isLoading={isLoading}
          />

          <StatCard
            icon={
              <Zap className="h-4 w-4 text-emerald-400" />
            }
            label="Open"
            value={open}
            isLoading={isLoading}
          />

          <StatCard
            icon={
              <Flame className="h-4 w-4 text-red-400" />
            }
            label="Live"
            value={live}
            isLoading={isLoading}
          />

          <StatCard
            icon={
              <Users className="h-4 w-4 text-blue-400" />
            }
            label="Upcoming"
            value={upcoming}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Qualification strip                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative border-t border-white/5 bg-white/[0.02] px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Competition Format
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Qualify through the rounds and be the
              final contestant standing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {QUIZ_BOARD_QUALIFICATION_SEQUENCE.map(
              (number, index) => (
                <div
                  key={`${number}-${index}`}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[10px] font-bold ${
                      number === 1
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                        : "border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {number}
                  </div>

                  {index <
                    QUIZ_BOARD_QUALIFICATION_SEQUENCE.length -
                      1 && (
                    <ArrowRight className="h-3 w-3 text-slate-600" />
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  isLoading: boolean;
}

function StatCard({
  icon,
  label,
  value,
  isLoading,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:border-white/10 hover:bg-white/[0.05] sm:p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[9px] font-medium uppercase tracking-wider text-slate-500">
            {label}
          </p>

          {isLoading ? (
            <div className="mt-1 h-5 w-8 animate-pulse rounded bg-white/10" />
          ) : (
            <p className="mt-0.5 text-lg font-bold text-white">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}