




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
    (questionId) => Boolean(answers[questionId]),
  ).length;

  return (
    <Card className="mb-6 border border-white/10 bg-white/[0.03] p-4 text-white shadow-none sm:p-5">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white">
            Questions
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Select a question to navigate
          </p>
        </div>

        <div className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-400">
          {answeredCount} of {questions.length} answered
        </div>
      </div>

      {/* QUESTION STATUS LEGEND */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          Current
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-emerald-500/30 bg-emerald-500/15" />
          Answered
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-white/10 bg-white/[0.04]" />
          Unanswered
        </span>
      </div>

      {/* QUESTION NUMBERS */}
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2">
        {questions.map((question, index) => {
          const answered = Boolean(answers[question._id]);
          const active = index === currentQuestionIndex;

          return (
            <button
              key={question._id}
              type="button"
              aria-label={`Go to question ${index + 1}${
                active
                  ? ", current question"
                  : answered
                    ? ", answered"
                    : ", unanswered"
              }`}
              aria-current={active ? "step" : undefined}
              aria-pressed={active}
              onClick={() => onQuestionSelect(index)}
              className={`
                relative flex h-10 min-w-10 shrink-0
                items-center justify-center rounded-lg
                border px-2 text-xs font-bold
                transition-colors duration-150
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-400
                focus-visible:ring-offset-2
                focus-visible:ring-offset-slate-950
                ${
                  active
                    ? "border-blue-400/50 bg-blue-600 text-white shadow-sm shadow-blue-950/40"
                    : answered
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:border-emerald-400/40 hover:bg-emerald-500/20"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                }
              `}
            >
              {index + 1}

              {/* ANSWERED INDICATOR */}
              {answered && !active && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-950 bg-emerald-500 text-slate-950">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
