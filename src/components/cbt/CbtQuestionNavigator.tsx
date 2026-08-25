"use client";

import { Flag } from "lucide-react";

export interface CbtQuestionNavigatorProps {
  questionIds: string[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  flaggedQuestions?: string[];
  onSelectQuestion: (
    index: number,
  ) => void;
}

export default function CbtQuestionNavigator({
  questionIds,
  currentQuestionIndex,
  answers,
  flaggedQuestions = [],
  onSelectQuestion,
}: CbtQuestionNavigatorProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-slate-900">
        Questions
      </h2>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {questionIds.map(
          (questionId, index) => {
            const answered =
              answers[questionId] !==
                undefined &&
              answers[questionId] !== "";

            const flagged =
              flaggedQuestions.includes(
                questionId,
              );

            const current =
              index ===
              currentQuestionIndex;

            return (
              <button
                key={questionId}
                type="button"
                onClick={() =>
                  onSelectQuestion(
                    index,
                  )
                }
                className={`relative flex h-10 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                  current
                    ? "border-blue-600 bg-blue-600 text-white"
                    : answered
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                }`}
              >
                {index + 1}

                {flagged && (
                  <Flag
                    className={`absolute -right-1 -top-1 h-3.5 w-3.5 ${
                      current
                        ? "fill-white text-white"
                        : "fill-orange-500 text-orange-500"
                    }`}
                  />
                )}
              </button>
            );
          },
        )}
      </div>

      <div className="mt-5 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded border border-green-300 bg-green-50" />
          Answered
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded border border-slate-200 bg-white" />
          Unanswered
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-blue-600" />
          Current
        </div>
      </div>
    </div>
  );
}