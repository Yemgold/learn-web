




"use client";

import { Check, Circle, Loader2, Lock, Send } from "lucide-react";

export interface ContestantAnswerOption {
  label?: string;
  value: string;
}

export interface ContestantAnswerOptionsProps {
  options: ContestantAnswerOption[];

  selectedAnswer?: string | null;
  submittedAnswer?: string | null;

  answerSubmitted?: boolean;
  questionLocked?: boolean;
  disabled?: boolean;
  submitting?: boolean;

  showSubmitButton?: boolean;
  submitLabel?: string;
  submittedLabel?: string;

  onSelect: (value: string) => void;
  onSubmit?: () => void;

  title?: string;
  compact?: boolean;
}

export default function ContestantAnswerOptions({
  options,
  selectedAnswer = null,
  submittedAnswer = null,
  answerSubmitted = false,
  questionLocked = false,
  disabled = false,
  submitting = false,
  showSubmitButton = true,
  submitLabel = "Submit Answer",
  submittedLabel = "Answer Submitted",
  onSelect,
  onSubmit,
  title = "Choose your answer",
  compact = false,
}: ContestantAnswerOptionsProps) {
  const isDisabled =
    disabled ||
    questionLocked ||
    answerSubmitted ||
    submitting;

  const hasSelection = Boolean(selectedAnswer);

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70",
        "shadow-xl shadow-black/10 backdrop-blur",
        compact ? "p-4" : "p-5 sm:p-6",
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white sm:text-base">
            {title}
          </h3>

          {!answerSubmitted && !questionLocked && (
            <p className="mt-1 text-xs text-slate-400">
              Select one option and submit your answer.
            </p>
          )}

          {answerSubmitted && (
            <p className="mt-1 text-xs text-emerald-400">
              Your answer has been submitted.
            </p>
          )}

          {questionLocked && !answerSubmitted && (
            <p className="mt-1 text-xs text-amber-400">
              This question is locked.
            </p>
          )}
        </div>

        {questionLocked && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300">
            <Lock className="h-3.5 w-3.5" />
            Locked
          </div>
        )}
      </div>

      <div className="grid gap-3">
        {options.map((option, index) => {
          const label =
            option.label?.trim() ||
            String.fromCharCode(65 + index);

          const isSelected =
            selectedAnswer === option.value;

          const isSubmitted =
            submittedAnswer === option.value;

          const optionDisabled =
            isDisabled || answerSubmitted;

          return (
            <button
              key={`${option.value}-${index}`}
              type="button"
              disabled={optionDisabled}
              onClick={() => onSelect(option.value)}
              className={[
                "group relative w-full rounded-2xl border text-left",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
                compact
                  ? "px-3.5 py-3"
                  : "px-4 py-4 sm:px-5 sm:py-4",
                isSubmitted
                  ? "border-emerald-400/60 bg-emerald-400/10"
                  : isSelected
                    ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/5"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                optionDisabled
                  ? "cursor-not-allowed opacity-80"
                  : "cursor-pointer",
              ].join(" ")}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    "border text-sm font-bold transition-colors",
                    isSubmitted
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : isSelected
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/[0.03] text-slate-300 group-hover:border-white/20",
                  ].join(" ")}
                >
                  {isSubmitted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    label
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      "block text-sm font-medium leading-6 sm:text-base",
                      isSelected || isSubmitted
                        ? "text-white"
                        : "text-slate-200",
                    ].join(" ")}
                  >
                    {option.value}
                  </span>
                </span>

                <span
                  className={[
                    "shrink-0",
                    isSelected || isSubmitted
                      ? "text-cyan-300"
                      : "text-slate-600",
                  ].join(" ")}
                >
                  {isSelected || isSubmitted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {showSubmitButton && onSubmit && (
        <div className="mt-5">
          <button
            type="button"
            disabled={
              !hasSelection ||
              isDisabled
            }
            onClick={onSubmit}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl",
              "px-4 py-3.5 text-sm font-semibold transition-all",
              "focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
              hasSelection &&
              !isDisabled
                ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
                : "cursor-not-allowed bg-white/10 text-slate-500",
            ].join(" ")}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : answerSubmitted ? (
              <>
                <Check className="h-4 w-4" />
                {submittedLabel}
              </>
            ) : questionLocked ? (
              <>
                <Lock className="h-4 w-4" />
                Question Locked
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}