



"use client";

import { Check } from "lucide-react";

import type { PracticeQuestion } from "@/stores/practiceStore";

interface QuestionOptionsProps {
  question: PracticeQuestion;
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
}

export default function QuestionOptions({
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuestionOptionsProps) {
  return (
    <div className="space-y-3">
      {question.options.map((option) => {
        const isSelected = selectedAnswer === option.label;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelectAnswer(option.label)}
            aria-pressed={isSelected}
            className={`
              group flex w-full items-start gap-3
              rounded-xl border p-4 text-left
              transition-all duration-200
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-400
              focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-950
              ${
                isSelected
                  ? "border-blue-500/50 bg-blue-500/[0.12] shadow-sm shadow-blue-950/20"
                  : "border-white/10 bg-white/[0.03] hover:border-blue-400/30 hover:bg-white/[0.07]"
              }
            `}
          >
            {/* RADIO INDICATOR */}
            <span
              className={`
                mt-0.5 flex h-6 w-6 shrink-0
                items-center justify-center
                rounded-full border-2 transition-colors
                ${
                  isSelected
                    ? "border-blue-400 bg-blue-500"
                    : "border-slate-600 bg-slate-950 group-hover:border-blue-400"
                }
              `}
            >
              {isSelected && (
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              )}
            </span>

            {/* OPTION LETTER */}
            <span
              className={`
                flex h-7 w-7 shrink-0 items-center
                justify-center rounded-lg text-sm
                font-bold uppercase transition-colors
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "border border-white/10 bg-white/[0.05] text-slate-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 group-hover:text-blue-300"
                }
              `}
            >
              {option.label}
            </span>

            {/* OPTION TEXT */}
            <span
              className={`
                min-w-0 flex-1 pt-0.5 text-sm
                leading-6 sm:text-base
                ${
                  isSelected
                    ? "font-semibold text-blue-100"
                    : "text-slate-300 group-hover:text-white"
                }
              `}
            >
              {option.value}
            </span>

            {/* SELECTED CHECK */}
            {isSelected && (
              <span className="ml-auto shrink-0 pt-1">
                <Check
                  className="h-5 w-5 text-blue-400"
                  strokeWidth={2.5}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
