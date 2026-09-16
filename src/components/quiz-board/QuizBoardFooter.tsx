




// src/components/quiz-board/QuizBoardFilters.tsx

"use client";

import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Difficulty,
  DisplayStatus,
  QuizBoardFilters as QuizBoardFiltersType,
} from "@/lib/quiz-board/types";

import {
  QUIZ_BOARD_DIFFICULTY_OPTIONS,
  QUIZ_BOARD_STATUS_OPTIONS,
} from "@/lib/quiz-board/constants";

interface QuizBoardFiltersProps {
  filters: QuizBoardFiltersType;

  subjects: string[];

  showFilters: boolean;

  onToggleFilters: () => void;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: DisplayStatus | "ALL",
  ) => void;

  onDifficultyChange: (
    value: Difficulty | "ALL",
  ) => void;

  onSubjectChange: (
    value: string,
  ) => void;

  onReset: () => void;
}

export default function QuizBoardFilters({
  filters,
  subjects,
  showFilters,
  onToggleFilters,
  onSearchChange,
  onStatusChange,
  onDifficultyChange,
  onSubjectChange,
  onReset,
}: QuizBoardFiltersProps) {
  const hasActiveFilters =
    filters.searchQuery.trim() !== "" ||
    filters.statusFilter !== "ALL" ||
    filters.difficultyFilter !== "ALL" ||
    filters.subjectFilter !== "";

  const activeFilterCount =
    Number(
      filters.statusFilter !== "ALL",
    ) +
    Number(
      filters.difficultyFilter !== "ALL",
    ) +
    Number(
      filters.subjectFilter !== "",
    ) +
    Number(
      filters.searchQuery.trim() !== "",
    );

  return (
    <section className="relative">
      {/* ------------------------------------------------------------------ */}
      {/* Search + Filter button                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={filters.searchQuery}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search competitions, subjects..."
            className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/70 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
          />

          {filters.searchQuery && (
            <button
              type="button"
              onClick={() =>
                onSearchChange("")
              }
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onToggleFilters}
          className={`h-11 gap-2 rounded-xl border-white/10 px-4 ${
            showFilters || hasActiveFilters
              ? "border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15"
              : "bg-slate-900/70 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />

          Filters

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Filter panel                                                        */}
      {/* ------------------------------------------------------------------ */}

      {showFilters && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-black/10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-violet-400" />

              <h3 className="text-sm font-semibold text-white">
                Filter Competitions
              </h3>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* ------------------------------------------------------------ */}
            {/* Status                                                        */}
            {/* ------------------------------------------------------------ */}

            <div>
              <label
                htmlFor="quiz-board-status"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Status
              </label>

              <select
                id="quiz-board-status"
                value={filters.statusFilter}
                onChange={(event) =>
                  onStatusChange(
                    event.target
                      .value as DisplayStatus | "ALL",
                  )
                }
                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-slate-200 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
              >
                {QUIZ_BOARD_STATUS_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-950 text-white"
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Difficulty                                                    */}
            {/* ------------------------------------------------------------ */}

            <div>
              <label
                htmlFor="quiz-board-difficulty"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Difficulty
              </label>

              <select
                id="quiz-board-difficulty"
                value={filters.difficultyFilter}
                onChange={(event) =>
                  onDifficultyChange(
                    event.target
                      .value as Difficulty | "ALL",
                  )
                }
                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-slate-200 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
              >
                {QUIZ_BOARD_DIFFICULTY_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-950 text-white"
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Subject                                                       */}
            {/* ------------------------------------------------------------ */}

            <div>
              <label
                htmlFor="quiz-board-subject"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Subject
              </label>

              <select
                id="quiz-board-subject"
                value={filters.subjectFilter}
                onChange={(event) =>
                  onSubjectChange(
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-slate-200 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
              >
                <option
                  value=""
                  className="bg-slate-950 text-white"
                >
                  All Subjects
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject}
                    value={subject}
                    className="bg-slate-950 text-white"
                  >
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Active filter summary                                          */}
          {/* -------------------------------------------------------------- */}

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
              <span className="text-[11px] font-medium text-slate-500">
                Active:
              </span>

              {filters.searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                  Search:{" "}
                  <span className="max-w-[140px] truncate text-violet-300">
                    {filters.searchQuery.trim()}
                  </span>
                </span>
              )}

              {filters.statusFilter !==
                "ALL" && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                  {
                    QUIZ_BOARD_STATUS_OPTIONS.find(
                      (option) =>
                        option.value ===
                        filters.statusFilter,
                    )?.label
                  }
                </span>
              )}

              {filters.difficultyFilter !==
                "ALL" && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                  {
                    QUIZ_BOARD_DIFFICULTY_OPTIONS.find(
                      (option) =>
                        option.value ===
                        filters.difficultyFilter,
                    )?.label
                  }
                </span>
              )}

              {filters.subjectFilter && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                  {filters.subjectFilter}
                </span>
              )}

              <button
                type="button"
                onClick={onReset}
                className="ml-auto text-[11px] font-medium text-violet-400 transition hover:text-violet-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}