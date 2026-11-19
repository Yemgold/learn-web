




import { CheckCircle2, CircleAlert, X } from "lucide-react";
import type { EnrollmentFeedbackProps } from "@/types/schools/enrollment.types"; 

export default function EnrollmentFeedback({
  successMessage,
  pageError,
  onDismissSuccess,
  onDismissError,
}: EnrollmentFeedbackProps) {
  return (
    <>
      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p className="flex-1">{successMessage}</p>
          <button
            type="button"
            onClick={onDismissSuccess}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert size={19} className="mt-0.5 shrink-0" />
          <p className="flex-1">{pageError}</p>
          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error message"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </>
  );
}
