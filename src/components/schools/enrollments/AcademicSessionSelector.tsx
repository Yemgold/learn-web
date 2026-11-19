






import { BookOpen, ChevronDown, RefreshCw } from "lucide-react";
import type { AcademicSessionSelectorProps } from "@/types/schools/enrollment.types"; 

export default function AcademicSessionSelector({
  sessions,
  selectedSessionId,
  selectedSession,
  loading,
  onChange,
  onReload,
}: AcademicSessionSelectorProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <BookOpen size={19} />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            Academic Session
          </h2>
          <p className="text-xs text-gray-500">
            Select the session whose student enrollments you want to manage.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <select
            value={selectedSessionId}
            onChange={(event) => onChange(event.target.value)}
            disabled={loading || sessions.length === 0}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          >
            <option value="">
              {loading
                ? "Loading academic sessions..."
                : sessions.length === 0
                  ? "No academic sessions available"
                  : "Select Academic Session"}
            </option>

            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.sessionName}
                {session.status ? ` (${session.status})` : ""}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Reload Sessions
        </button>
      </div>

      {selectedSession && (
        <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Selected session: <strong>{selectedSession.sessionName}</strong>
          {selectedSession.periodType && (
            <span> · {selectedSession.periodType}</span>
          )}
          {selectedSession.status && (
            <span> · {selectedSession.status}</span>
          )}
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <p className="mt-3 text-xs text-amber-700">
          No academic sessions were found. Create an academic session first under Academic Sessions.
        </p>
      )}
    </div>
  );
}
