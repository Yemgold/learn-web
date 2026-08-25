"use client";

import {
  ArrowLeft,
  ArrowRight,
  Send,
} from "lucide-react";

export interface CbtNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  questionNumber: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
}

export default function CbtNavigation({
  isFirstQuestion,
  isLastQuestion,
  onPrevious,
  onNext,
  onSubmit,
}: CbtNavigationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </button>

      <div className="flex items-center gap-3">
        {isLastQuestion ? (
          onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              Submit Exam
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}