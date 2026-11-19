






import { Loader2 } from "lucide-react";
import type { ModalActionsProps } from "@/types/schools/enrollment.types"; 

export default function ModalActions({
  submitting,
  submitLabel,
  onCancel,
}: ModalActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && (
          <Loader2 size={16} className="animate-spin" />
        )}
        {submitting ? "Processing..." : submitLabel}
      </button>
    </div>
  );
}
