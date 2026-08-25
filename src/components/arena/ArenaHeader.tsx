


"use client";

import { Trophy, X } from "lucide-react";

interface ArenaHeaderProps {
  subject: string;
  topic: string;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  onExit?: () => void;
}

export default function ArenaHeader({
  subject,
  topic,
  questionNumber,
  totalQuestions,
  score,
  onExit,
}: ArenaHeaderProps) {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between gap-4">
        {/* -------------------------------------------------------------- */}
        {/* Left: Subject + Topic                                          */}
        {/* -------------------------------------------------------------- */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Subject Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lg shadow-lg backdrop-blur-md">
            🎓
          </div>

          {/* Subject information */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-bold text-white sm:text-lg">
                {subject}
              </h1>

              <span className="hidden text-slate-600 sm:inline">
                /
              </span>

              <span className="hidden truncate text-sm text-slate-400 sm:inline">
                {topic}
              </span>
            </div>

            <p className="text-xs text-slate-500 sm:hidden">
              {topic}
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Right: Score + Exit                                            */}
        {/* -------------------------------------------------------------- */}

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Score */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md sm:px-4">
            <Trophy
              size={17}
              strokeWidth={2}
              className="text-yellow-400"
            />

            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-white">
                {score}
              </span>

              <span className="hidden text-xs text-slate-500 sm:inline">
                points
              </span>
            </div>
          </div>

          {/* Exit */}
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              aria-label="Exit Arena"
              title="Exit Arena"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={20} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Question Counter                                                 */}
      {/* ---------------------------------------------------------------- */}

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Current Question
          </p>

          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {String(questionNumber).padStart(2, "0")}
            </span>

            <span className="text-sm font-medium text-slate-500 sm:text-base">
              / {String(totalQuestions).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Session label */}
        <div className="hidden text-right sm:block">
          <p className="text-xs font-medium text-slate-500">
            Interactive Learning Arena
          </p>

          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold text-emerald-400">
              LIVE SESSION
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

