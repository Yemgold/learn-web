
import {
  BookOpen,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import type { EnrollmentsHeaderProps } from "@/types/schools/enrollment.types"; 

export default function EnrollmentsHeader({
  loading,
  countLoading,
  sessionSelected,
  onRefresh,
  onEnroll,
}: EnrollmentsHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <BookOpen size={15} />
          <span>School Portal</span>
          <span>/</span>
          <span className="text-gray-800">Enrollments</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Student Enrollments
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Enroll students into classes and manage their academic enrollment records.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={!sessionSelected || loading || countLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading || countLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>

        <button
          type="button"
          onClick={onEnroll}
          disabled={!sessionSelected}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UserPlus size={17} />
          Enroll Student
        </button>
      </div>
    </div>
  );
}
