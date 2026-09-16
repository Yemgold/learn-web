




// src/components/quiz-board/QuizBoardList.tsx

"use client";

import {
  AlertCircle,
  Loader2,
  SearchX,
  Trophy,
} from "lucide-react";

import QuizBoardCard from "@/components/quiz-board/QuizBoardCard";

import type { QuizBoard } from "@/lib/quiz-board/types";

interface QuizBoardListProps {
  boards: QuizBoard[];

  isLoading?: boolean;

  error?: string | null;

  currentTime?: number;

  joinedCompetitionIds?: Set<string>;

  onRetry?: () => void;
}

export default function QuizBoardList({
  boards,
  isLoading = false,
  error = null,
  currentTime = Date.now(),
  joinedCompetitionIds,
  onRetry,
}: QuizBoardListProps) {
  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <section aria-label="Quiz competitions">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <QuizBoardSkeleton
                key={index}
              />
            ),
          )}
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <section
        aria-label="Quiz competitions"
        className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8"
      >
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>

          <h3 className="mt-4 text-base font-bold text-white">
            Unable to load competitions
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {error}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <Loader2 className="hidden h-4 w-4" />
              Try Again
            </button>
          )}
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Empty                                                                  */
  /* ---------------------------------------------------------------------- */

  if (!boards.length) {
    return (
      <section
        aria-label="Quiz competitions"
        className="rounded-2xl border border-white/10 bg-slate-900/60 p-10"
      >
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
            <SearchX className="h-7 w-7 text-violet-400" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-white">
            No competitions found
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            There are no quiz competitions matching
            your current filters. Try changing your
            search or filter options.
          </p>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Competition list                                                       */
  /* ---------------------------------------------------------------------- */

  return (
    <section
      id="quiz-competitions"
      aria-label="Quiz competitions"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-violet-400" />

          <h2 className="text-lg font-bold text-white">
            Available Competitions
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-slate-400">
          {boards.length}{" "}
          {boards.length === 1
            ? "competition"
            : "competitions"}
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {boards.map((board) => (
          <QuizBoardCard
            key={board.id}
            board={board}
            currentTime={currentTime}
            isJoined={
              joinedCompetitionIds?.has(
                board.id,
              ) ?? false
            }
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function QuizBoardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>

          <Skeleton className="h-5 w-4/5" />

          <Skeleton className="mt-2 h-4 w-full" />

          <Skeleton className="mt-1 h-4 w-3/4" />
        </div>

        <Skeleton className="hidden h-11 w-11 rounded-xl sm:block" />
      </div>

      <div className="mt-5 flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>

      <Skeleton className="mt-4 h-12 rounded-xl" />

      <div className="mt-4 flex justify-between border-t border-white/5 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>

      <Skeleton className="mt-4 h-12 rounded-xl" />

      <Skeleton className="mt-5 h-10 w-full rounded-xl" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton primitive                                                        */
/* -------------------------------------------------------------------------- */

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/5 ${className}`}
    />
  );
}