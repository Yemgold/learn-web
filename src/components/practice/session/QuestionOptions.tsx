



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
        const isSelected =
          selectedAnswer === option.label;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() =>
              onSelectAnswer(option.label)
            }
            aria-pressed={isSelected}
            className={`
              group flex w-full
              items-start gap-4
              rounded-xl border-2
              p-4 text-left
              transition-all
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2

              ${
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
              }
            `}
          >
            {/* ==================================================
                RADIO INDICATOR
                ================================================== */}

            <span
              className={`
                mt-0.5 flex h-6 w-6
                shrink-0 items-center
                justify-center
                rounded-full border-2
                transition

                ${
                  isSelected
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 group-hover:border-blue-400"
                }
              `}
            >
              {isSelected && (
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              )}
            </span>

            {/* ==================================================
                OPTION LETTER
                ================================================== */}

            <span
              className={`
                flex h-7 w-7
                shrink-0 items-center
                justify-center
                rounded-md
                text-sm font-bold
                uppercase
                transition

                ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                }
              `}
            >
              {option.label}
            </span>

            {/* ==================================================
                OPTION TEXT
                ================================================== */}

            <span
              className={`
                pt-0.5 text-sm
                leading-6 sm:text-base

                ${
                  isSelected
                    ? "font-semibold text-blue-900"
                    : "text-slate-700"
                }
              `}
            >
              {option.value}
            </span>

            {/* ==================================================
                SELECTED CHECK
                ================================================== */}

            {isSelected && (
              <span className="ml-auto shrink-0 pt-1">
                <Check className="h-5 w-5 text-blue-600" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}