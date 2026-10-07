
"use client";

import {
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

interface GameResultProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onPlayAgain: () => void;
  onExit?: () => void;
}

export default function GameResult({
  score,
  totalQuestions,
  correctAnswers,
  onPlayAgain,
  onExit,
}: GameResultProps) {
  const safeTotal = Math.max(totalQuestions, 0);
  const percentage =
    safeTotal > 0
      ? Math.round((correctAnswers / safeTotal) * 100)
      : 0;

  const getMessage = () => {
    if (percentage === 100) {
      return "Perfect game! You knew your words fast.";
    }

    if (percentage >= 80) {
      return "Excellent! Your word power is strong.";
    }

    if (percentage >= 60) {
      return "Great job! Keep challenging yourself.";
    }

    if (percentage >= 40) {
      return "Good attempt! You can beat this score.";
    }

    return "Keep practising. Your next round can be better.";
  };

  return (
    <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-md">
      {/* Header */}
      <div className="relative overflow-hidden px-6 pb-7 pt-8 text-center sm:px-8 sm:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl"
        />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-amber-300 shadow-lg shadow-amber-500/10">
          <Trophy className="h-9 w-9" />
        </div>

        <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          Word Challenge Complete
        </p>

        <h2 className="relative mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Your Result
        </h2>

        <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-white/50 sm:text-base">
          {getMessage()}
        </p>
      </div>

      {/* Score */}
      <div className="px-6 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-5 text-center sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            Total Points
          </p>

          <div className="mt-2 flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-amber-300" />

            <span className="text-4xl font-black tabular-nums text-white sm:text-5xl">
              {score}
            </span>

            <span className="self-end pb-1 text-sm font-semibold text-white/40">
              pts
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
            <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-400" />

            <p className="mt-2 text-xl font-black text-white">
              {correctAnswers}
            </p>

            <p className="mt-1 text-[11px] font-medium text-white/35">
              Correct
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
            <XCircle className="mx-auto h-5 w-5 text-red-400" />

            <p className="mt-2 text-xl font-black text-white">
              {Math.max(0, safeTotal - correctAnswers)}
            </p>

            <p className="mt-1 text-[11px] font-medium text-white/35">
              Missed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
            <Trophy className="mx-auto h-5 w-5 text-violet-400" />

            <p className="mt-2 text-xl font-black text-white">
              {percentage}%
            </p>

            <p className="mt-1 text-[11px] font-medium text-white/35">
              Accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 px-6 pb-7 pt-6 sm:flex-row sm:px-8 sm:pb-8">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-white/90 active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </button>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
          >
            Exit Game
          </button>
        )}
      </div>
    </section>
  );
}