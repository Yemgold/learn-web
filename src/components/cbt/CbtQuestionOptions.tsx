


// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\cbt\CbtQuestionOptions.tsx

"use client";

import { CheckCircle2 } from "lucide-react";

export interface CbtQuestionOption {
  id?: string;
  label: string;
  text?: string;
  value?: string;
}

interface CbtQuestionOptionsProps {
  options: CbtQuestionOption[];
  selectedAnswer?: string | null;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function CbtQuestionOptions({
  options,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}: CbtQuestionOptionsProps) {
  return (
    <div
      className="space-y-3"
      role="radiogroup"
      aria-label="Question options"
    >
      {options.map((option) => {
        const optionValue =
          option.value ?? option.text ?? "";

        const isSelected =
          selectedAnswer?.trim().toUpperCase() ===
          option.label.trim().toUpperCase();

        return (
          <button
            key={option.id ?? option.label}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() =>
              onSelectAnswer(option.label)
            }
            className={[
              "group flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer",
              isSelected
                ? "border-blue-600 bg-blue-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50",
            ].join(" ")}
          >
            {/* Radio indicator */}

            <span
              className={[
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                isSelected
                  ? "border-blue-600 bg-blue-600"
                  : "border-slate-300 bg-white group-hover:border-blue-400",
              ].join(" ")}
            >
              {isSelected && (
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              )}
            </span>

            {/* Option label */}

            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black uppercase transition-colors",
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700",
              ].join(" ")}
            >
              {option.label}
            </span>

            {/* Option text */}

            <span
              className={[
                "min-w-0 flex-1 pt-1 text-sm leading-6 sm:text-base",
                isSelected
                  ? "font-semibold text-blue-950"
                  : "text-slate-700",
              ].join(" ")}
            >
              {optionValue}
            </span>

            {/* Selected indicator */}

            {isSelected && (
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}