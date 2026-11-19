






"use client";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Plus,
  RefreshCw,
} from "lucide-react";

import type { AcademicSessionSelectorProps } from "@/types/schools/academic-period.types"; 
import { getSessionId,getSessionName, } from "@/lib/schools/utils/academic-period.utils"; 
export default function AcademicSessionSelector({
  sessions,
  selectedSessionId,
  loading,
  error,
  onChange,
  onReload,
}: AcademicSessionSelectorProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
          <CalendarDays size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            Select Academic Session
          </h2>

          <p className="text-sm text-gray-500">
            Choose the session whose periods you want to manage.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
          <RefreshCw
            size={16}
            className="animate-spin"
          />
          Loading academic sessions...
        </div>
      ) : error ? (
        <div className="flex flex-col items-start gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Academic sessions could not be loaded.
            Please try again.
          </p>

          <button
            type="button"
            onClick={onReload}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <CalendarDays size={25} />
          </div>

          <h3 className="font-semibold text-gray-800">
            No Academic Sessions Found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Your school does not have any academic
            sessions yet. Create an academic session
            before adding terms, semesters or other
            academic periods.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/academic-sessions")
            }
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Create Academic Session
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="relative max-w-xl">
          <select
            value={selectedSessionId}
            onChange={(event) =>
              onChange(event.target.value)
            }
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select an academic session
            </option>

            {sessions.map((session, index) => {
              const id = getSessionId(session);

              return (
                <option
                  key={id || index}
                  value={id}
                >
                  {getSessionName(session)}
                  {session.isActive === true
                    ? " (Active)"
                    : ""}
                </option>
              );
            })}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      )}
    </div>
  );
}
