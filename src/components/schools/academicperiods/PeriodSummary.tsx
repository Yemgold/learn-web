





"use client";

import {
  BookOpen,
  CalendarDays,
} from "lucide-react";

import type { AcademicPeriodSummaryProps } from "@/types/schools/academic-period.types";

export default function AcademicPeriodSummary({
  totalPeriods,
  activePeriods,
}: AcademicPeriodSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Total Periods
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {totalPeriods}
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <BookOpen size={22} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Active Periods
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {activePeriods}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-3 text-green-600">
            <CalendarDays size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}
