





"use client";

import {
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import type { AcademicPeriodsHeaderProps } from "@/types/schools/academic-period.types";

export default function AcademicPeriodsHeader({
  loading,
  onRefresh,
}: AcademicPeriodsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={16} />
          <span>Academic Management</span>
          <span>/</span>
          <span>Academic Periods</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Academic Periods
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage terms, semesters, and other periods
          within an academic session.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw
          size={16}
          className={loading ? "animate-spin" : ""}
        />
        Refresh
      </button>
    </div>
  );
}
