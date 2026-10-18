




"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  HelpCircle,
  Lightbulb,
  Loader2,
  X,
  XCircle,
  Zap,
} from "lucide-react";

import type {
  EduLudoAnswerResult,
  EduLudoQuestion,
} from "./eduLudoTypes";

import { QUESTION_COST, QUESTION_TIME_LIMIT } from "./eduLudoConstants";

export interface QuestionModalProps {
  question: EduLudoQuestion | null;

  open?: boolean;
  timeLimit?: number;
  questionCost?: number;

  disabled?: boolean;
  submitting?: boolean;

  selectedAnswer?: number | null;
  result?: EduLudoAnswerResult | null;

  onAnswer: (answerIndex: number) => void;
  onTimeUp?: () => void;
  onClose?: () => void;
  onContinue?: () => void;

  showTimer?: boolean;
  showCost?: boolean;
  allowClose?: boolean;
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function QuestionModal({
  question,
  open = true,
  timeLimit = QUESTION_TIME_LIMIT,
  questionCost = QUESTION_COST,
  disabled = false,
  submitting = false,
  selectedAnswer = null,
  result = null,
  onAnswer,
  onTimeUp,
  onClose,
  onContinue,
  showTimer = true,
  showCost = true,
  allowClose = false,
}: QuestionModalProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [localSelection, setLocalSelection] = useState<number | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const effectiveSelection =
    selectedAnswer !== null ? selectedAnswer : localSelection;

  const answered = result !== null;

  useEffect(() => {
    if (!open || !question) return;

    setTimeLeft(timeLimit);
    setLocalSelection(null);
    setHasTimedOut(false);
  }, [question?.id, open, timeLimit]);

  useEffect(() => {
    if (
      !open ||
      !question ||
      !showTimer ||
      answered ||
      disabled ||
      submitting ||
      hasTimedOut
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setHasTimedOut(true);
      onTimeUp?.();
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    open,
    question,
    showTimer,
    answered,
    disabled,
    submitting,
    hasTimedOut,
    timeLeft,
    onTimeUp,
  ]);

  if (!open || !question) return null;

  const handleAnswer = (answerIndex: number) => {
    if (
      disabled ||
      submitting ||
      answered ||
      hasTimedOut ||
      effectiveSelection !== null
    ) {
      return;
    }

    setLocalSelection(answerIndex);
    onAnswer(answerIndex);
  };

  const isCorrectChoice = (answerIndex: number) =>
    result?.correctAnswer === answerIndex;

  const isWrongSelection = (answerIndex: number) =>
    answered &&
    !result?.isCorrect &&
    result?.selectedAnswer === answerIndex;

  const timerPercentage =
    timeLimit > 0
      ? Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100))
      : 0;

  const timerColor =
    timeLeft <= 5
      ? "text-red-600"
      : timeLeft <= 10
        ? "text-amber-600"
        : "text-emerald-600";

  const difficultyLabel =
    question.difficulty
      ? question.difficulty.charAt(0).toUpperCase() +
        question.difficulty.slice(1)
      : null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (
          allowClose &&
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edu-ludo-question-title"
        className="my-auto max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/50 bg-white shadow-2xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 px-5 pb-5 pt-5 text-white sm:px-6">
          <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                <HelpCircle size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">
                  Edu Ludo Challenge
                </p>

                <h2
                  id="edu-ludo-question-title"
                  className="mt-1 text-xl font-black sm:text-2xl"
                >
                  Answer to move
                </h2>
              </div>
            </div>

            {allowClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close question"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white disabled:opacity-40"
              >
                <X size={19} />
              </button>
            )}
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold">
              {question.subject}
            </span>

            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold">
              {question.level}
            </span>

            {difficultyLabel && (
              <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold">
                {difficultyLabel}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {(showTimer || showCost) && (
            <div className="grid grid-cols-2 gap-3">
              {showTimer && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock3 size={14} />
                      Time remaining
                    </span>

                    <span
                      className={`text-sm font-extrabold tabular-nums ${timerColor}`}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-label="Question time remaining"
                    aria-valuemin={0}
                    aria-valuemax={timeLimit}
                    aria-valuenow={Math.min(timeLeft, timeLimit)}
                  >
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-300",
                        timeLeft <= 5
                          ? "bg-red-500"
                          : timeLeft <= 10
                            ? "bg-amber-500"
                            : "bg-emerald-500",
                      ].join(" ")}
                      style={{ width: `${timerPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {showCost && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                    <Zap size={14} />
                    Question charge
                  </div>

                  <p className="mt-1.5 text-lg font-black text-amber-900">
                    ₦{questionCost.toLocaleString("en-NG")}
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-amber-800">
                    Per presented question
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
              Your question
            </p>

            <h3 className="text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
              {question.content}
            </h3>
          </div>

          <div className="space-y-2.5">
            {question.options.map((option, index) => {
              const isSelected = effectiveSelection === index;
              const isCorrect = isCorrectChoice(index);
              const isWrong = isWrongSelection(index);

              let optionStyle =
                "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50";

              if (isSelected && !answered) {
                optionStyle =
                  "border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-100";
              }

              if (answered && isCorrect) {
                optionStyle =
                  "border-emerald-500 bg-emerald-50 text-emerald-900";
              }

              if (isWrong) {
                optionStyle =
                  "border-red-400 bg-red-50 text-red-900";
              }

              return (
                <button
                  key={`${question.id}-option-${index}`}
                  type="button"
                  onClick={() => handleAnswer(index)}
                  disabled={
                    disabled ||
                    submitting ||
                    answered ||
                    hasTimedOut ||
                    effectiveSelection !== null
                  }
                  className={[
                    "flex min-h-[56px] w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                    optionStyle,
                    "disabled:cursor-default",
                    !disabled &&
                    !answered &&
                    effectiveSelection === null &&
                    !hasTimedOut
                      ? "cursor-pointer"
                      : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-extrabold",
                      isCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isWrong
                          ? "border-red-500 bg-red-500 text-white"
                          : isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-600",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="min-w-0 flex-1 text-sm font-semibold leading-6">
                    {option}
                  </span>

                  {isCorrect && (
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-emerald-600"
                    />
                  )}

                  {isWrong && (
                    <XCircle
                      size={19}
                      className="shrink-0 text-red-600"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {submitting && (
            <div className="flex items-center gap-2 rounded-xl bg-indigo-50 p-3 text-sm font-semibold text-indigo-700">
              <Loader2 size={17} className="animate-spin" />
              Checking your answer...
            </div>
          )}

          {hasTimedOut && !answered && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <Clock3
                size={20}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <div>
                <p className="text-sm font-bold text-amber-900">
                  Time is up
                </p>

                <p className="mt-1 text-sm leading-5 text-amber-800">
                  Your game logic will decide how the turn is handled.
                </p>
              </div>
            </div>
          )}

          {answered && result && (
            <div
              className={[
                "rounded-2xl border p-4",
                result.isCorrect
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                {result.isCorrect ? (
                  <CheckCircle2
                    size={22}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                ) : (
                  <XCircle
                    size={22}
                    className="mt-0.5 shrink-0 text-red-600"
                  />
                )}

                <div className="min-w-0">
                  <p
                    className={[
                      "font-extrabold",
                      result.isCorrect
                        ? "text-emerald-900"
                        : "text-red-900",
                    ].join(" ")}
                  >
                    {result.isCorrect
                      ? "Correct answer!"
                      : "Not quite right"}
                  </p>

                  {!result.isCorrect && (
                    <p className="mt-1 text-sm leading-5 text-red-800">
                      Correct answer:{" "}
                      <strong>
                        {question.options[result.correctAnswer] ??
                          "Not available"}
                      </strong>
                    </p>
                  )}

                  {result.explanation && (
                    <div className="mt-3 flex items-start gap-2">
                      <Lightbulb
                        size={17}
                        className="mt-0.5 shrink-0"
                      />

                      <p className="text-sm leading-6">
                        {result.explanation}
                      </p>
                    </div>
                  )}

                  <p className="mt-3 text-sm font-bold">
                    {result.pointsAwarded > 0
                      ? `+${result.pointsAwarded} CBT points`
                      : "No CBT points awarded for this answer"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              {answered
                ? "Review the result before continuing."
                : "Choose one answer to submit."}
            </p>

            {answered && onContinue && (
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Continue
                <CheckCircle2 size={17} />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
