





"use client";

import type { AcademicSessionDetailsProps } from "@/types/schools/academic-period.types"; 

import { formatAcademicDate, getSessionName } from "@/lib/schools/utils/academic-period.utils"; 

export default function AcademicSessionDetails({
  session,
}: AcademicSessionDetailsProps) {
  if (!session) return null;

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Selected session
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {getSessionName(session)}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        {(session.startDate || session.endDate) && (
          <span>
            {formatAcademicDate(session.startDate)} –{" "}
            {formatAcademicDate(session.endDate)}
          </span>
        )}

        {session.periodType && (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
            {session.periodType}
          </span>
        )}
      </div>
    </div>
  );
}
