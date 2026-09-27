




"use client";

import {
  CheckCircle2,
  Clock3,
  FileQuestion,
  Hash,
  Info,
  LockKeyhole,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";

export interface HostQuestionPreviewOption {
  label?: string;
  value: string;

  /**
   * Host-only information.
   * This should NEVER be sent to contestant/spectator clients.
   */
  isCorrect?: boolean;
}

export interface HostQuestionPreviewQuestion {
  id: string;

  questionNumber: number;

  question: string;

  options: HostQuestionPreviewOption[];

  timeLimit?: number | null;

  explanation?: string | null;

  status?:
    | "READY"
    | "CURRENT"
    | "LIVE"
    | "LOCKED"
    | "COMPLETED";

  answeredCount?: number;

  correctCount?: number;
}

export interface HostQuestionPreviewProps {
  question: HostQuestionPreviewQuestion | null;

  totalQuestions?: number | null;

  loading?: boolean;

  /**
   * Whether this question is currently live.
   */
  questionStarted?: boolean;

  /**
   * Whether the current question has been locked.
   */
  questionLocked?: boolean;

  /**
   * Called when the host wants to start this question.
   *
   * The parent component should perform the actual Socket.IO action.
   */
  onStartQuestion?: () => void;

  /**
   * Allows the preview to display a host-only action.
   */
  canStartQuestion?: boolean;

  /**
   * Whether the host controls are currently processing.
   */
  actionLoading?: boolean;

  /**
   * Optional custom title.
   */
  title?: string;

  /**
   * Show the correct answer to the host.
   */
  showCorrectAnswer?: boolean;

  /**
   * Show explanation to the host.
   */
  showExplanation?: boolean;

  /**
   * Compact mode for smaller host layouts.
   */
  compact?: boolean;
}

function formatSeconds(value: number | null | undefined) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value}s`;
}

function getOptionLabel(
  option: HostQuestionPreviewOption,
  index: number,
) {
  return option.label?.trim() || String.fromCharCode(65 + index);
}

function getStatusLabel(
  status: HostQuestionPreviewQuestion["status"],
  questionStarted: boolean,
  questionLocked: boolean,
) {
  if (questionLocked || status === "LOCKED") {
    return "LOCKED";
  }

  if (questionStarted || status === "LIVE") {
    return "LIVE";
  }

  if (status === "COMPLETED") {
    return "COMPLETED";
  }

  if (status === "CURRENT") {
    return "SELECTED";
  }

  return "READY";
}

export default function HostQuestionPreview({
  question,
  totalQuestions = null,
  loading = false,
  questionStarted = false,
  questionLocked = false,
  onStartQuestion,
  canStartQuestion = true,
  actionLoading = false,
  title = "Question Preview",
  showCorrectAnswer = true,
  showExplanation = true,
  compact = false,
}: HostQuestionPreviewProps) {
  const status = useMemo(
    () =>
      getStatusLabel(
        question?.status,
        questionStarted,
        questionLocked,
      ),
    [question?.status, questionStarted, questionLocked],
  );

  const correctOptions = useMemo(() => {
    if (!question) {
      return [];
    }

    return question.options.filter((option) => option.isCorrect);
  }, [question]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/10">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />

          <div className="space-y-2">
            <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-6 w-full animate-pulse rounded bg-white/10" />
          <div className="h-6 w-4/5 animate-pulse rounded bg-white/5" />

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <FileQuestion className="h-7 w-7 text-slate-500" />
        </div>

        <h3 className="text-base font-semibold text-white">
          No question selected
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          Select a question from the question list to preview it
          before starting it for the room.
        </p>
      </section>
    );
  }

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <FileQuestion className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold text-white">
                {title}
              </h2>

              <span
                className={[
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider",
                  status === "LIVE"
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : status === "LOCKED"
                      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                      : status === "COMPLETED"
                        ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
                        : "border-slate-600 bg-slate-800 text-slate-300",
                ].join(" ")}
              >
                {status === "LIVE" && (
                  <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                )}

                {status}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" />
                Question {question.questionNumber}
                {totalQuestions
                  ? ` of ${totalQuestions}`
                  : ""}
              </span>

              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {formatSeconds(question.timeLimit)}
              </span>
            </div>
          </div>
        </div>

        {/* Host action */}
        {onStartQuestion && (
          <button
            type="button"
            onClick={onStartQuestion}
            disabled={
              actionLoading ||
              !canStartQuestion ||
              questionStarted ||
              questionLocked
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {actionLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200/30 border-t-cyan-200" />
            ) : questionStarted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : questionLocked ? (
              <LockKeyhole className="h-4 w-4" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}

            {actionLoading
              ? "Starting..."
              : questionStarted
                ? "Question Live"
                : questionLocked
                  ? "Question Locked"
                  : "Start Question"}
          </button>
        )}
      </div>

      {/* Question */}
      <div className={compact ? "mt-5" : "mt-6"}>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          Question
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="whitespace-pre-wrap text-base font-medium leading-7 text-white sm:text-lg">
            {question.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className={compact ? "mt-5" : "mt-6"}>
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Answer Options
        </div>

        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const isCorrect =
              showCorrectAnswer && Boolean(option.isCorrect);

            return (
              <div
                key={`${question.id}-${option.value}-${index}`}
                className={[
                  "relative flex items-start gap-3 rounded-xl border p-4 transition",
                  isCorrect
                    ? "border-emerald-400/30 bg-emerald-400/[0.07]"
                    : "border-white/10 bg-white/[0.02]",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
                    isCorrect
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-slate-300",
                  ].join(" ")}
                >
                  {getOptionLabel(option, index)}
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                    {option.value}
                  </p>
                </div>

                {isCorrect && (
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Correct
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question statistics */}
      {(question.answeredCount !== undefined ||
        question.correctCount !== undefined) && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {question.answeredCount !== undefined && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Answered
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {question.answeredCount}
              </p>
            </div>
          )}

          {question.correctCount !== undefined && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Correct
              </p>

              <p className="mt-1 text-lg font-bold text-emerald-300">
                {question.correctCount}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {showExplanation && question.explanation?.trim() && (
        <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10">
              <Info className="h-4 w-4 text-violet-300" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                Explanation
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Host-only reminder */}
      {showCorrectAnswer && correctOptions.length > 0 && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-3 py-3 text-xs leading-5 text-amber-200/80">
          <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />

          <span>
            Correct-answer information is visible because this is the
            host preview. Do not include answer keys in the public
            `question_started` Socket.IO payload.
          </span>
        </div>
      )}
    </section>
  );
}