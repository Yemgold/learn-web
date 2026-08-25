



// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\cbt\CbtSubmitDialog.tsx

"use client";

import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CbtSubmitDialogProps {
  open: boolean;
  answeredQuestions: number;
  totalQuestions: number;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  timeUp?: boolean;
}

export default function CbtSubmitDialog({
  open,
  answeredQuestions,
  totalQuestions,
  onCancel,
  onConfirm,
  isSubmitting = false,
  timeUp = false,
}: CbtSubmitDialogProps) {
  if (!open) {
    return null;
  }

  const unansweredQuestions = Math.max(
    totalQuestions - answeredQuestions,
    0,
  );

  const allAnswered =
    unansweredQuestions === 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cbt-submit-title"
    >
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Close submit dialog"
        onClick={onCancel}
        disabled={isSubmitting || timeUp}
        className="absolute inset-0 cursor-default"
      />

      {/* Dialog */}

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}

        <div
          className={[
            "px-6 py-6",
            timeUp
              ? "bg-red-50"
              : "bg-blue-50",
          ].join(" ")}
        >
          <div className="flex items-start gap-4">
            <div
              className={[
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                timeUp
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600",
              ].join(" ")}
            >
              {timeUp ? (
                <Clock3 className="h-6 w-6" />
              ) : (
                <CheckCircle2 className="h-6 w-6" />
              )}
            </div>

            <div className="min-w-0">
              <h2
                id="cbt-submit-title"
                className="text-xl font-black text-slate-900"
              >
                {timeUp
                  ? "Time is Up"
                  : "Submit Examination?"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {timeUp
                  ? "Your examination time has ended. Your answers will now be submitted."
                  : "Are you sure you want to submit your examination?"}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Answered */}

            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Answered
                </span>
              </div>

              <p className="mt-2 text-2xl font-black text-emerald-900">
                {answeredQuestions}
              </p>
            </div>

            {/* Unanswered */}

            <div
              className={[
                "rounded-2xl p-4",
                unansweredQuestions > 0
                  ? "bg-amber-50"
                  : "bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={[
                    "h-5 w-5",
                    unansweredQuestions > 0
                      ? "text-amber-600"
                      : "text-slate-400",
                  ].join(" ")}
                />

                <span
                  className={[
                    "text-xs font-bold uppercase tracking-wide",
                    unansweredQuestions > 0
                      ? "text-amber-700"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  Unanswered
                </span>
              </div>

              <p
                className={[
                  "mt-2 text-2xl font-black",
                  unansweredQuestions > 0
                    ? "text-amber-900"
                    : "text-slate-700",
                ].join(" ")}
              >
                {unansweredQuestions}
              </p>
            </div>
          </div>

          {/* Warning */}

          {!timeUp && !allAnswered && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-bold text-amber-900">
                  You still have unanswered
                  questions
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  You can submit now, but unanswered
                  questions will be marked as
                  incorrect.
                </p>
              </div>
            </div>
          )}

          {/* All answered */}

          {!timeUp && allAnswered && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-bold text-emerald-900">
                  All questions answered
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  You are ready to submit your
                  examination.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {!timeUp && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                fullWidth
                className="sm:w-auto"
              >
                Continue Exam
              </Button>
            )}

            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              fullWidth
              className={[
                "sm:w-auto",
                timeUp
                  ? "bg-red-600 hover:bg-red-700"
                  : "",
              ].join(" ")}
            >
              {isSubmitting
                ? "Submitting..."
                : timeUp
                  ? "Submit Examination"
                  : "Yes, Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}