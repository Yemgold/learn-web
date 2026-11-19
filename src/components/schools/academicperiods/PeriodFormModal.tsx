






"use client";

import {
  Hash,
  RefreshCw,
  X,
} from "lucide-react";

import type {
  AcademicPeriodFormModalProps,
}  from "@/types/schools/academic-period.types";

export default function AcademicPeriodFormModal({
  open,
  editingPeriod,
  form,
  submitting,
  periodTypeLabel,
  onChange,
  onSubmit,
  onClose,
}: AcademicPeriodFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* MODAL HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingPeriod
                ? "Edit Academic Period"
                : "Create Academic Period"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingPeriod
                ? "Update the details of this period."
                : `Add a new ${periodTypeLabel.toLowerCase()} to the selected session.`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >
          {/* PERIOD NAME */}

          <div>
            <label
              htmlFor="periodName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Period Name
            </label>

            <input
              id="periodName"
              name="periodName"
              type="text"
              value={form.periodName}
              onChange={(event) =>
                onChange("periodName", event.target.value)
              }
              placeholder={
                periodTypeLabel === "Semester"
                  ? "e.g. First Semester"
                  : "e.g. First Term"
              }
              required
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
            />
          </div>

          {/* PERIOD NUMBER */}

          <div>
            <label
              htmlFor="periodNumber"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Hash size={15} />
              Period Number
            </label>

            <input
              id="periodNumber"
              name="periodNumber"
              type="number"
              min="1"
              step="1"
              value={form.periodNumber}
              onChange={(event) =>
                onChange("periodNumber", event.target.value)
              }
              placeholder="e.g. 1"
              required
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
            />

            <p className="mt-1 text-xs text-gray-500">
              Enter a unique number for this period
              within the session.
            </p>
          </div>

          {/* START DATE */}

          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={(event) =>
                onChange("startDate", event.target.value)
              }
              required
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
            />
          </div>

          {/* END DATE */}

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              End Date
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              min={form.startDate || undefined}
              value={form.endDate}
              onChange={(event) =>
                onChange("endDate", event.target.value)
              }
              required
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Saving..."
                : editingPeriod
                  ? "Update Period"
                  : "Create Period"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
