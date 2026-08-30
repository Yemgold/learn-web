







"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Flag,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

export interface CbtExamSummaryProps {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  flaggedQuestions: number;

  correctAnswers: number;
  score: number;
  percentage: number;

  // CBT points awarded by the backend
  totalPointsAwarded: number;

  onExit?: () => void;
  onReview?: () => void;
}

export default function CbtExamSummary({
  totalQuestions,
  answeredQuestions,
  unansweredQuestions,
  flaggedQuestions,
  correctAnswers,
  score,
  percentage,
  totalPointsAwarded,
  onExit,
  onReview,
}: CbtExamSummaryProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Trophy className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Examination Completed
        </h1>

        <p className="mt-2 text-slate-600">
          Your CBT examination has been submitted successfully.
        </p>

        {/* Score */}
        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Score
          </p>

          <p className="mt-1 text-6xl font-black text-blue-600">
            {percentage}%
          </p>

          <p className="mt-2 text-slate-500">
            {score} / {totalQuestions} points
          </p>

          {/* CBT Points Earned */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏆</span>

              <span className="text-lg font-bold text-green-600">
                +{totalPointsAwarded} Points
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Get more points and use them for Solve &amp; Win questions
              to win up to{" "}
              <span className="font-semibold text-green-600">
                ₦50,000 cash!
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Answered */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-7 w-7 text-green-600" />

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {answeredQuestions}
          </p>

          <p className="text-sm text-slate-500">
            Answered
          </p>
        </div>

        {/* Correct */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-7 w-7 text-green-600" />

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {correctAnswers}
          </p>

          <p className="text-sm text-slate-500">
            Correct
          </p>
        </div>

        {/* Unanswered */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <XCircle className="h-7 w-7 text-red-500" />

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {unansweredQuestions}
          </p>

          <p className="text-sm text-slate-500">
            Unanswered
          </p>
        </div>

        {/* Flagged */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <Flag className="h-7 w-7 text-orange-500" />

          <p className="mt-3 text-2xl font-bold text-slate-900">
            {flaggedQuestions}
          </p>

          <p className="text-sm text-slate-500">
            Flagged
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {onReview && (
          <button
            type="button"
            onClick={onReview}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Review Questions
          </button>
        )}

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CBT
          </button>
        )}
      </div>
    </div>
  );
}