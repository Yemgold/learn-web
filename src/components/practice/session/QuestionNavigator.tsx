




"use client";

import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { PracticeQuestion } from "@/stores/practiceStore";

interface QuestionNavigatorProps {
  questions: PracticeQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigator({
  questions,
  currentQuestionIndex,
  answers,
  onQuestionSelect,
}: QuestionNavigatorProps) {
  const answeredCount = Object.keys(answers).filter(
    (questionId) =>
      Boolean(answers[questionId])
  ).length;

  return (
    <Card className="mb-6 p-4 sm:p-5">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Questions
          </h2>

          <p className="text-xs text-slate-500">
            Select a question
          </p>
        </div>

        <div className="text-xs font-medium text-slate-500">
          {answeredCount} answered
        </div>
      </div>

      {/* ======================================================
          QUESTION NUMBERS
          ====================================================== */}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {questions.map((question, index) => {
          const answered = Boolean(
            answers[question._id]
          );

          const active =
            index === currentQuestionIndex;

          return (
            <button
              key={question._id}
              type="button"
              aria-label={`Go to question ${index + 1}`}
              aria-current={
                active ? "step" : undefined
              }
              onClick={() =>
                onQuestionSelect(index)
              }
              className={`
                relative flex h-9 min-w-9 shrink-0
                items-center justify-center
                rounded-lg px-2
                text-xs font-bold
                transition
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2

                ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : answered
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {index + 1}

              {/* Answered indicator */}

              {answered && !active && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-3.5
                    w-3.5
                    items-center
                    justify-center
                    rounded-full
                    bg-green-600
                    text-white
                  "
                >
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}