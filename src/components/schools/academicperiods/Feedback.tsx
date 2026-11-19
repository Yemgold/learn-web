





"use client";

import {
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";

import type { AcademicPeriodFeedbackProps } from "@/types/schools/academic-period.types"; 

export default function AcademicPeriodFeedback({
  sessionError,
  periodError,
  success,
  loadingSessions,
  onRefresh,
  onDismissPeriodError,
  onDismissSuccess,
}: AcademicPeriodFeedbackProps) {
  return (
    <div className="space-y-4">
      {sessionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-red-800">
                Unable to load academic sessions
              </h3>

              <p className="mt-1 text-sm text-red-700">
                {sessionError}
              </p>

              <button
                type="button"
                onClick={onRefresh}
                disabled={loadingSessions}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={
                    loadingSessions ? "animate-spin" : ""
                  }
                />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {periodError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p className="flex-1">{periodError}</p>

          <button
            type="button"
            onClick={onDismissPeriodError}
            className="shrink-0"
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <p>{success}</p>

          <button
            type="button"
            onClick={onDismissSuccess}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
