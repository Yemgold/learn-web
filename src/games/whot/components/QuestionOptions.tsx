




"use client";

import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { memo, useCallback } from "react";

export type QuestionOptionStatus =
  | "default"
  | "selected"
  | "correct"
  | "incorrect";

export interface QuestionOptionItem {
  label: string;
  value: string;
}

export interface QuestionOptionsProps {
  options: string[] | QuestionOptionItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  correctAnswerIndex?: number;
  layout?: "vertical" | "grid";
  className?: string;
  optionClassName?: string;
  ariaLabel?: string;
}

function getOptionLabel(
  option: string | QuestionOptionItem,
): string {
  return typeof option === "string" ? option : option.value;
}

function getOptionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function QuestionOptionsComponent({
  options,
  selectedIndex,
  onSelect,
  disabled = false,
  showFeedback = false,
  correctAnswerIndex,
  layout = "vertical",
  className = "",
  optionClassName = "",
  ariaLabel = "Question answer options",
}: QuestionOptionsProps) {
  const handleSelect = useCallback(
    (index: number) => {
      if (disabled) return;
      onSelect(index);
    },
    [disabled, onSelect],
  );

  const gridClassName =
    layout === "grid"
      ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
      : "flex flex-col gap-3";

  return (
    <div
      aria-label={ariaLabel}
      className={`${gridClassName} ${className}`}
      role="group"
    >
      {options.map((option, index) => {
        const label = getOptionLabel(option);
        const isSelected = selectedIndex === index;
        const isCorrectAnswer =
          showFeedback && correctAnswerIndex === index;
        const isIncorrectSelection =
          showFeedback &&
          isSelected &&
          correctAnswerIndex !== undefined &&
          selectedIndex !== correctAnswerIndex;

        let status: QuestionOptionStatus = "default";

        if (isCorrectAnswer) {
          status = "correct";
        } else if (isIncorrectSelection) {
          status = "incorrect";
        } else if (isSelected) {
          status = "selected";
        }

        const statusClasses: Record<
          QuestionOptionStatus,
          string
        > = {
          default:
            "border-slate-700 bg-slate-800/70 text-slate-100 hover:border-slate-500 hover:bg-slate-800",
          selected:
            "border-cyan-400 bg-cyan-400/10 text-white ring-2 ring-cyan-400/20",
          correct:
            "border-emerald-400/70 bg-emerald-400/10 text-emerald-100",
          incorrect:
            "border-rose-400/70 bg-rose-400/10 text-rose-100",
        };

        const letterClasses =
          status === "selected"
            ? "bg-cyan-400 text-slate-950"
            : status === "correct"
              ? "bg-emerald-400 text-slate-950"
              : status === "incorrect"
                ? "bg-rose-400 text-slate-950"
                : "bg-slate-700 text-slate-200 group-hover:bg-slate-600";

        return (
          <button
            key={`option-${index}`}
            type="button"
            aria-pressed={isSelected}
            aria-label={`Option ${getOptionLetter(index)}: ${label}`}
            disabled={disabled || showFeedback}
            onClick={() => handleSelect(index)}
            className={`group flex min-h-[64px] w-full items-start gap-3 rounded-2xl border p-4 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed ${
              statusClasses[status]
            } ${
              disabled && !showFeedback
                ? "opacity-60"
                : ""
            } ${optionClassName}`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition ${letterClasses}`}
            >
              {getOptionLetter(index)}
            </span>

            <span className="min-w-0 flex-1 pt-1 text-sm font-medium leading-6 sm:text-base">
              {label}
            </span>

            <span className="mt-1 shrink-0">
              {status === "correct" ? (
                <CheckCircle2
                  aria-label="Correct answer"
                  className="h-5 w-5 text-emerald-400"
                />
              ) : status === "incorrect" ? (
                <XCircle
                  aria-label="Incorrect answer"
                  className="h-5 w-5 text-rose-400"
                />
              ) : isSelected ? (
                <CheckCircle2
                  aria-label="Selected answer"
                  className="h-5 w-5 text-cyan-300"
                />
              ) : (
                <Circle className="h-5 w-5 text-slate-600 transition group-hover:text-slate-400" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const QuestionOptions = memo(QuestionOptionsComponent);

QuestionOptions.displayName = "QuestionOptions";

export default QuestionOptions;
