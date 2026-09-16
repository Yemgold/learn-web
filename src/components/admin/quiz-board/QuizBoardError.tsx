




"use client";

import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type Props = {
  error: string;
  onRetry: () => void;
};

export default function QuizBoardError({
  error,
  onRetry,
}: Props) {
  return (
    <section className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-red-900">
            Unable to load competitions
          </p>

          <p className="mt-1 text-sm leading-6 text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
}