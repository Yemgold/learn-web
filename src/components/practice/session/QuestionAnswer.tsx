





"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

interface QuestionAnswerProps {
  correctAnswer?: string | null;
  selectedAnswer?: string | null;
}

export function QuestionAnswer({
  correctAnswer,
  selectedAnswer,
}: QuestionAnswerProps) {
  if (!correctAnswer) {
    return (
      <Card className="mt-5 border border-amber-500/20 bg-amber-500/[0.06] p-5 text-white shadow-none">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
            <CheckCircle2 className="h-5 w-5 text-amber-400" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-amber-300">
              Correct Answer
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              The correct answer is not available for
              this question.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const normalizedCorrectAnswer =
    correctAnswer.trim().toUpperCase();

  const normalizedSelectedAnswer =
    selectedAnswer?.trim().toUpperCase() ?? null;

  const hasSelectedAnswer =
    normalizedSelectedAnswer !== null &&
    normalizedSelectedAnswer.length > 0;

  const isCorrect =
    hasSelectedAnswer &&
    normalizedSelectedAnswer ===
      normalizedCorrectAnswer;

  return (
    <Card className="mt-5 overflow-hidden border border-white/10 bg-white/[0.03] text-white shadow-none">
      {/* CORRECT ANSWER */}
      <div className="border-b border-emerald-500/15 bg-emerald-500/[0.07] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-emerald-300">
              Correct Answer
            </h3>

            <p className="mt-1 break-words text-lg font-bold text-emerald-400">
              {correctAnswer}
            </p>
          </div>
        </div>
      </div>

      {/* STUDENT ANSWER */}
      {hasSelectedAnswer && (
        <div
          className={`p-5 ${
            isCorrect
              ? "bg-emerald-500/[0.04]"
              : "bg-red-500/[0.05]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/10"
                  : "border-red-500/20 bg-red-500/10"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>

            <div className="min-w-0">
              <h3
                className={`text-sm font-semibold ${
                  isCorrect
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                Your Answer
              </h3>

              <p
                className={`mt-1 break-words text-lg font-bold ${
                  isCorrect
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {selectedAnswer}
              </p>

              <p
                className={`mt-2 text-sm leading-6 ${
                  isCorrect
                    ? "text-emerald-300/80"
                    : "text-red-300/80"
                }`}
              >
                {isCorrect
                  ? "Correct! Your answer matches the correct answer."
                  : "Your answer is incorrect. Review the correct answer and explanation below."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* NO ANSWER SELECTED */}
      {!hasSelectedAnswer && (
        <div className="border-t border-white/5 bg-white/[0.02] p-5">
          <p className="text-sm leading-6 text-slate-400">
            You have not selected an answer for this
            question.
          </p>
        </div>
      )}
    </Card>
  );
}
