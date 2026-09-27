


"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleStop,
  Clock3,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Square,
} from "lucide-react";

export interface HostQuestionControlsProps {
  questionNumber: number | null;
  totalQuestions: number | null;

  timeLimit: number;

  questionStarted: boolean;
  questionLocked: boolean;

  canStart?: boolean;
  canLock?: boolean;
  canNext?: boolean;

  loading?: boolean;

  onStartQuestion: () => void;
  onLockQuestion: () => void;
  onNextQuestion: () => void;

  onResetQuestion?: () => void;

  disabled?: boolean;
}

export default function HostQuestionControls({
  questionNumber,
  totalQuestions,
  timeLimit,
  questionStarted,
  questionLocked,
  canStart = true,
  canLock = true,
  canNext = true,
  loading = false,
  onStartQuestion,
  onLockQuestion,
  onNextQuestion,
  onResetQuestion,
  disabled = false,
}: HostQuestionControlsProps) {
  const hasQuestion =
    questionNumber !== null &&
    questionNumber > 0;

  const isLastQuestion =
    hasQuestion &&
    totalQuestions !== null &&
    totalQuestions > 0 &&
    questionNumber === totalQuestions;

  const startDisabled =
    disabled ||
    loading ||
    !hasQuestion ||
    questionStarted ||
    questionLocked ||
    !canStart;

  const lockDisabled =
    disabled ||
    loading ||
    !hasQuestion ||
    !questionStarted ||
    questionLocked ||
    !canLock;

  const nextDisabled =
    disabled ||
    loading ||
    !hasQuestion ||
    !questionLocked ||
    isLastQuestion ||
    !canNext;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-xl shadow-black/10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <ShieldCheck
              className="h-4 w-4"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white">
              Question Controls
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Control what contestants see.
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
          <span className="text-xs font-bold text-slate-300">
            {hasQuestion
              ? `Q${questionNumber}${
                  totalQuestions
                    ? ` / ${totalQuestions}`
                    : ""
                }`
              : "No question"}
          </span>
        </div>
      </div>

      {/* Current status */}
      <div className="grid grid-cols-2 gap-3 border-b border-white/5 px-5 py-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <Clock3
              className="h-3.5 w-3.5 text-cyan-400"
              aria-hidden="true"
            />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Time
            </span>
          </div>

          <p className="mt-1 text-sm font-bold text-white">
            {timeLimit > 0
              ? `${timeLimit}s`
              : "Not set"}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            {questionLocked ? (
              <Lock
                className="h-3.5 w-3.5 text-amber-400"
                aria-hidden="true"
              />
            ) : questionStarted ? (
              <Play
                className="h-3.5 w-3.5 text-emerald-400"
                aria-hidden="true"
              />
            ) : (
              <Square
                className="h-3.5 w-3.5 text-slate-500"
                aria-hidden="true"
              />
            )}

            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Status
            </span>
          </div>

          <p
            className={[
              "mt-1 text-sm font-bold",
              questionLocked
                ? "text-amber-300"
                : questionStarted
                  ? "text-emerald-300"
                  : "text-slate-300",
            ].join(" ")}
          >
            {questionLocked
              ? "Locked"
              : questionStarted
                ? "Live"
                : "Ready"}
          </p>
        </div>

        <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:col-span-1">
          <div className="flex items-center gap-2">
            {questionLocked ? (
              <CheckCircle2
                className="h-3.5 w-3.5 text-emerald-400"
                aria-hidden="true"
              />
            ) : (
              <CircleStop
                className="h-3.5 w-3.5 text-slate-500"
                aria-hidden="true"
              />
            )}

            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Audience
            </span>
          </div>

          <p className="mt-1 text-sm font-bold text-slate-300">
            {questionStarted
              ? "Viewing"
              : "Waiting"}
          </p>
        </div>
      </div>

      {/* Main controls */}
      <div className="space-y-3 p-5">
        {/* Start */}
        <button
          type="button"
          disabled={startDisabled}
          onClick={onStartQuestion}
          className={[
            "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3",
            "text-sm font-bold transition",
            "focus:outline-none focus:ring-2 focus:ring-emerald-400/30",
            startDisabled
              ? "cursor-not-allowed bg-white/[0.04] text-slate-600"
              : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-400",
          ].join(" ")}
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Play
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            />
          )}

          {questionStarted
            ? "Question Running"
            : questionLocked
              ? "Question Locked"
              : "Start Question"}
        </button>

        {/* Lock */}
        <button
          type="button"
          disabled={lockDisabled}
          onClick={onLockQuestion}
          className={[
            "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3",
            "text-sm font-bold transition",
            "focus:outline-none focus:ring-2 focus:ring-amber-400/20",
            lockDisabled
              ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600"
              : "border-amber-400/20 bg-amber-400/10 text-amber-300 hover:border-amber-400/30 hover:bg-amber-400/15",
          ].join(" ")}
        >
          <Lock
            className="h-4 w-4"
            aria-hidden="true"
          />

          {questionLocked
            ? "Question Locked"
            : "Lock Question"}
        </button>

        {/* Next */}
        <button
          type="button"
          disabled={nextDisabled}
          onClick={onNextQuestion}
          className={[
            "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3",
            "text-sm font-bold transition",
            "focus:outline-none focus:ring-2 focus:ring-cyan-400/20",
            nextDisabled
              ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600"
              : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-400/15",
          ].join(" ")}
        >
          {isLastQuestion ? (
            <>
              <CheckCircle2
                className="h-4 w-4"
                aria-hidden="true"
              />
              Last Question
            </>
          ) : (
            <>
              Next Question
              <ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            </>
          )}
        </button>

        {/* Reset */}
        {onResetQuestion && (
          <button
            type="button"
            disabled={
              disabled ||
              loading ||
              !hasQuestion
            }
            onClick={onResetQuestion}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5",
              "text-xs font-semibold transition",
              disabled ||
              loading ||
              !hasQuestion
                ? "cursor-not-allowed text-slate-700"
                : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300",
            ].join(" ")}
          >
            <RotateCcw
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Reset Selection
          </button>
        )}
      </div>

      {/* Explanation */}
      <div className="border-t border-white/5 bg-white/[0.015] px-5 py-3">
        <p className="text-[10px] leading-relaxed text-slate-600">
          Starting a question broadcasts it to
          contestants and spectators. The server
          remains authoritative for the live timer
          and question state.
        </p>
      </div>
    </section>
  );
}