



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
      <Card className="mt-5 border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <CheckCircle2 className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Correct Answer
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-700">
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
    <Card className="mt-5 overflow-hidden border-slate-200">

      {/* ====================================================
          CORRECT ANSWER
          ==================================================== */}

      <div className="border-b border-green-200 bg-green-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>

          <div className="min-w-0">

            <h3 className="text-sm font-semibold text-green-900">
              Correct Answer
            </h3>

            <p className="mt-1 text-lg font-bold text-green-700">
              {correctAnswer}
            </p>

          </div>
        </div>
      </div>

      {/* ====================================================
          STUDENT ANSWER
          ==================================================== */}

      {hasSelectedAnswer && (
        <div
          className={`p-5 ${
            isCorrect
              ? "bg-green-50/50"
              : "bg-red-50"
          }`}
        >

          <div className="flex items-start gap-3">

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isCorrect
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>

            <div className="min-w-0">

              <h3
                className={`text-sm font-semibold ${
                  isCorrect
                    ? "text-green-900"
                    : "text-red-900"
                }`}
              >
                Your Answer
              </h3>

              <p
                className={`mt-1 text-lg font-bold ${
                  isCorrect
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {selectedAnswer}
              </p>

              <p
                className={`mt-2 text-sm ${
                  isCorrect
                    ? "text-green-700"
                    : "text-red-700"
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

      {/* ====================================================
          NO ANSWER SELECTED
          ==================================================== */}

      {!hasSelectedAnswer && (
        <div className="bg-slate-50 p-5">

          <p className="text-sm text-slate-600">
            You have not selected an answer for this
            question.
          </p>

        </div>
      )}

    </Card>
  );
}