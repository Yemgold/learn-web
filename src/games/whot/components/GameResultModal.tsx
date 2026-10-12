





"use client";

import { memo, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  Clock3,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  X,
  XCircle,
} from "lucide-react";

export interface GameResultStats {
  score?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  accuracy?: number;
  durationSeconds?: number;
  longestStreak?: number;
  cardsPlayed?: number;
}

export interface GameResultModalProps {
  isOpen: boolean;
  result: "WIN" | "LOSS";
  playerName?: string;
  stats?: GameResultStats;
  onPlayAgain: () => void;
  onClose?: () => void;
  onExit?: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

function formatDuration(totalSeconds?: number): string {
  if (
    totalSeconds === undefined ||
    !Number.isFinite(totalSeconds) ||
    totalSeconds < 0
  ) {
    return "—";
  }

  const seconds = Math.floor(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return minutes > 0
    ? `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`
    : `${remainingSeconds}s`;
}

function formatAccuracy(
  accuracy: number | undefined,
  correctAnswers: number,
  incorrectAnswers: number,
): string {
  if (accuracy !== undefined && Number.isFinite(accuracy)) {
    const normalized = accuracy <= 1 && accuracy >= 0
      ? accuracy * 100
      : accuracy;

    return `${Math.min(100, Math.max(0, normalized)).toFixed(0)}%`;
  }

  const total = correctAnswers + incorrectAnswers;

  if (total === 0) {
    return "0%";
  }

  return `${Math.round((correctAnswers / total) * 100)}%`;
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "cyan" | "emerald" | "amber" | "violet";
}) {
  const toneClasses = {
    cyan: "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300",
    emerald: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
    amber: "border-amber-400/20 bg-amber-400/[0.06] text-amber-300",
    violet: "border-violet-400/20 bg-violet-400/[0.06] text-violet-300",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${toneClasses[tone]}`}
        >
          {icon}
        </span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>

      <p className="text-xl font-extrabold tabular-nums text-white">
        {value}
      </p>
    </div>
  );
}

function GameResultModal({
  isOpen,
  result,
  playerName = "Player",
  stats = {},
  onPlayAgain,
  onClose,
  onExit,
  title,
  subtitle,
  className = "",
}: GameResultModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const hasWon = result === "WIN";
  const correctAnswers = Math.max(0, stats.correctAnswers ?? 0);
  const incorrectAnswers = Math.max(0, stats.incorrectAnswers ?? 0);

  const accuracy = formatAccuracy(
    stats.accuracy,
    correctAnswers,
    incorrectAnswers,
  );

  const safeScore =
    stats.score !== undefined && Number.isFinite(stats.score)
      ? Math.max(0, Math.round(stats.score))
      : null;

  const heading =
    title ?? (hasWon ? "You Win!" : "Game Over");

  const description =
    subtitle ??
    (hasWon
      ? "Brilliant play! You've cleared every card in your hand."
      : "Good effort! Every game is another chance to improve.");

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-md sm:p-6 ${className}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="whot-result-title"
        aria-describedby="whot-result-description"
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40"
      >
        <div
          className={`absolute inset-x-0 top-0 h-1 ${
            hasWon
              ? "bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300"
              : "bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500"
          }`}
        />

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game results"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}

        <div className="px-5 pb-6 pt-9 sm:px-8 sm:pb-8 sm:pt-10">
          <div className="flex flex-col items-center text-center">
            <div
              className={`relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border ${
                hasWon
                  ? "border-amber-300/30 bg-gradient-to-br from-amber-400/20 to-emerald-400/10 text-amber-300"
                  : "border-slate-500/30 bg-slate-800/80 text-slate-300"
              }`}
            >
              {hasWon ? (
                <>
                  <Trophy size={38} aria-hidden="true" />
                  <Sparkles
                    size={19}
                    className="absolute -right-2 -top-2 text-cyan-300"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <Award size={38} aria-hidden="true" />
              )}
            </div>

            <p
              className={`mb-2 text-xs font-extrabold uppercase tracking-[0.25em] ${
                hasWon ? "text-emerald-300" : "text-slate-400"
              }`}
            >
              Learnyfi WHOT
            </p>

            <h2
              id="whot-result-title"
              className="text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              {heading}
            </h2>

            <p
              id="whot-result-description"
              className="mt-2 max-w-sm text-sm leading-6 text-slate-400"
            >
              {description}
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-4 py-2">
              {hasWon ? (
                <CheckCircle2
                  size={16}
                  className="text-emerald-300"
                  aria-hidden="true"
                />
              ) : (
                <XCircle
                  size={16}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              )}

              <span className="text-sm font-semibold text-slate-200">
                {playerName}
              </span>

              <span className="text-slate-600">·</span>

              <span
                className={`text-sm font-bold ${
                  hasWon ? "text-emerald-300" : "text-slate-300"
                }`}
              >
                {hasWon ? "Winner" : "Keep practising"}
              </span>
            </div>
          </div>

          {safeScore !== null && (
            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/60 to-slate-900 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/70">
                Final Score
              </p>
              <p className="mt-1 text-4xl font-black tabular-nums text-white">
                {safeScore.toLocaleString()}
                <span className="ml-2 text-sm font-semibold text-cyan-200">
                  points
                </span>
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard
              icon={<CheckCircle2 size={17} />}
              label="Correct answers"
              value={String(correctAnswers)}
              tone="emerald"
            />

            <StatCard
              icon={<Target size={17} />}
              label="Accuracy"
              value={accuracy}
              tone="cyan"
            />

            <StatCard
              icon={<Clock3 size={17} />}
              label="Time played"
              value={formatDuration(stats.durationSeconds)}
              tone="violet"
            />

            <StatCard
              icon={<Flame size={17} />}
              label="Best streak"
              value={String(Math.max(0, stats.longestStreak ?? 0))}
              tone="amber"
            />
          </div>

          {stats.cardsPlayed !== undefined && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Cards played:{" "}
              <span className="font-bold text-white">
                {Math.max(0, stats.cardsPlayed)}
              </span>
              <span className="mx-2 text-slate-700">|</span>
              Incorrect answers:{" "}
              <span className="font-bold text-white">
                {incorrectAnswers}
              </span>
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onPlayAgain}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
            >
              <RotateCcw size={17} aria-hidden="true" />
              Play Again
            </button>

            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
              >
                Exit Game
              </button>
            )}
          </div>

          {!hasWon && (
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Keep learning, keep playing, and come back stronger.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default memo(GameResultModal);
