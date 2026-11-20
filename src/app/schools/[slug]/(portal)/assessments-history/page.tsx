





"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import {
  getAcademicSessions,
  type AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Trophy,
  BookOpen,
  ChevronDown,
} from "lucide-react";

import { useStudentsAssessments } from "@/hooks/schools/useStudentsAssessments";

/* =========================================================
   TYPES
========================================================= */

type AssessmentRecord = Record<string, unknown>;

/* =========================================================
   HELPERS
========================================================= */

function getText(
  value: unknown,
  fallback = "Not available"
): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function getValue(
  record: AssessmentRecord,
  keys: string[],
  fallback = "Not available"
): string {
  for (const key of keys) {
    const value = getText(record[key], "");

    if (value) return value;
  }

  return fallback;
}

function getSessionId(session: AcademicSession): string {
  return getText(
    session._id ??
      session.id ??
      session.academicSessionId,
    ""
  );
}

function getSessionName(session: AcademicSession): string {
  return getText(
    session.sessionName ??
      session.name ??
      session.academicYear ??
      session.year ??
      session.title,
    "Unnamed Academic Session"
  );
}

function getSessionStatus(session: AcademicSession): string {
  const status = getText(session.status, "").toUpperCase();

  if (status) return status;

  return session.isActive === true ? "ACTIVE" : "UPCOMING";
}

function formatDate(value: unknown): string {
  if (!value) return "Not available";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClasses(status: string): string {
  switch (status.toUpperCase()) {
    case "SUBMITTED":
    case "COMPLETED":
    case "GRADED":
      return "bg-green-100 text-green-700";

    case "IN_PROGRESS":
    case "STARTED":
      return "bg-amber-100 text-amber-700";

    case "EXPIRED":
    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getSessionStatusClasses(status: string): string {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "COMPLETED":
      return "bg-gray-100 text-gray-700";

    case "UPCOMING":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function AssessmentsHistoryPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const slug = params.slug;
  const attemptId = searchParams.get("attemptId") || "";

  const [search, setSearch] = useState("");

  // Academic sessions
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState("");

  const {
    attempt,
    attemptLoading,
    error,
    loadAttempt,
  } = useStudentsAssessments({
    autoLoad: false,
  });

  const attemptRecord = attempt as AssessmentRecord | null;

  /* =========================================================
     FETCH ACADEMIC SESSIONS
  ========================================================= */

  const fetchAcademicSessions = useCallback(async () => {
    if (!slug) return;

    try {
      setSessionsLoading(true);
      setSessionsError("");

      const response = await getAcademicSessions(slug);

      const fetchedSessions = Array.isArray(response?.sessions)
        ? response.sessions
        : [];

      setSessions(fetchedSessions);

      if (fetchedSessions.length === 0) {
        setSelectedSessionId("");
        return;
      }

      setSelectedSessionId((previousId) => {
        // Preserve the student's current selection.
        if (
          previousId &&
          fetchedSessions.some(
            (session) => getSessionId(session) === previousId
          )
        ) {
          return previousId;
        }

        // Prefer the active academic session.
        const activeSession = fetchedSessions.find(
          (session) => getSessionStatus(session) === "ACTIVE"
        );

        if (activeSession) {
          return getSessionId(activeSession);
        }

        // Otherwise select the first available session.
        return getSessionId(fetchedSessions[0]);
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to fetch academic sessions.";

      setSessionsError(message);
      setSessions([]);
      setSelectedSessionId("");
    } finally {
      setSessionsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchAcademicSessions();
  }, [fetchAcademicSessions]);

  /* =========================================================
     SELECTED SESSION
  ========================================================= */

  const selectedSession = useMemo(() => {
    return sessions.find(
      (session) => getSessionId(session) === selectedSessionId
    ) ?? null;
  }, [sessions, selectedSessionId]);

  /* =========================================================
     LOAD ATTEMPT
  ========================================================= */

  const handleLoadAttempt = async () => {
    if (!attemptId) return;

    await loadAttempt(attemptId);
  };

  /* =========================================================
     ATTEMPT INFORMATION
  ========================================================= */

  const status = attemptRecord
    ? getValue(
        attemptRecord,
        ["status", "attemptStatus"],
        "UNKNOWN"
      )
    : "";

  const assessmentTitle = attemptRecord
    ? getValue(
        attemptRecord,
        [
          "assessmentTitle",
          "title",
          "assessmentName",
        ],
        "Assessment Attempt"
      )
    : "";

  const score = attemptRecord
    ? getValue(
        attemptRecord,
        ["score", "totalScore", "obtainedMarks"],
        "Not graded"
      )
    : "";

  const totalMarks = attemptRecord
    ? getValue(
        attemptRecord,
        ["totalMarks", "maximumScore", "maxScore"],
        "Not available"
      )
    : "";

  const filteredTitle = assessmentTitle
    .toLowerCase()
    .includes(search.trim().toLowerCase());

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/schools/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Trophy size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Assessments History
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review your assessment attempts and results.
              </p>
            </div>
          </div>
        </div>

        {attemptId && (
          <button
            type="button"
            onClick={() => {
              void handleLoadAttempt();
            }}
            disabled={attemptLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={attemptLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        )}
      </div>

      {/* ACADEMIC SESSION SELECTOR */}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <BookOpen size={22} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Academic Session
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select an academic session to view its information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void fetchAcademicSessions();
            }}
            disabled={sessionsLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={sessionsLoading ? "animate-spin" : ""}
            />
            Refresh sessions
          </button>
        </div>

        <div className="mt-5">
          <label
            htmlFor="academicSession"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Choose Academic Session
          </label>

          <div className="relative">
            <select
              id="academicSession"
              value={selectedSessionId}
              onChange={(event) =>
                setSelectedSessionId(event.target.value)
              }
              disabled={sessionsLoading || sessions.length === 0}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {sessionsLoading
                  ? "Loading academic sessions..."
                  : sessions.length === 0
                    ? "No academic sessions available"
                    : "Select an academic session"}
              </option>

              {sessions.map((session) => {
                const id = getSessionId(session);

                if (!id) return null;

                return (
                  <option key={id} value={id}>
                    {getSessionName(session)}
                  </option>
                );
              })}
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {sessionsLoading && (
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={15} className="animate-spin" />
              Fetching academic sessions...
            </p>
          )}

          {sessionsError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{sessionsError}</span>
            </div>
          )}

          {!sessionsLoading && !sessionsError && sessions.length === 0 && (
            <p className="mt-3 text-sm text-gray-500">
              No academic sessions have been created for this school.
            </p>
          )}

          {selectedSession && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    Selected session
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-gray-900">
                    {getSessionName(selectedSession)}
                  </h3>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getSessionStatusClasses(
                    getSessionStatus(selectedSession)
                  )}`}
                >
                  {getSessionStatus(selectedSession)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-gray-500">
                    Start Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formatDate(selectedSession.startDate)}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-gray-500">
                    End Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formatDate(selectedSession.endDate)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEARCH */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assessment..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="text-sm font-semibold text-red-800">
              Unable to load assessment attempt
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* NO ATTEMPT ID */}

      {!attemptId ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
         
        </div>
      ) : (
        <>
          {/* LOADING */}

          {attemptLoading && (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <Loader2
                size={32}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading assessment attempt...
              </p>
            </div>
          )}

          {/* ATTEMPT DETAILS */}

          {!attemptLoading && attemptRecord && filteredTitle && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText
                        size={19}
                        className="text-blue-600"
                      />

                      <span className="text-sm font-medium text-gray-500">
                        Assessment Result
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-bold text-gray-900">
                      {assessmentTitle}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(status)}`}
                  >
                    {status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryCard
                    label="Score"
                    value={score}
                    icon={<Trophy size={20} />}
                  />

                  <SummaryCard
                    label="Total Marks"
                    value={totalMarks}
                    icon={<ShieldCheck size={20} />}
                  />

                  <SummaryCard
                    label="Started"
                    value={formatDate(
                      attemptRecord.startedAt ??
                        attemptRecord.startTime ??
                        attemptRecord.createdAt
                    )}
                    icon={<Clock size={20} />}
                  />

                  <SummaryCard
                    label="Submitted"
                    value={formatDate(
                      attemptRecord.submittedAt ??
                        attemptRecord.completedAt
                    )}
                    icon={<CalendarDays size={20} />}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-gray-900">
                  Attempt Information
                </h3>

                <div className="mt-4 space-y-3">
                  <InfoRow
                    label="Attempt ID"
                    value={getValue(
                      attemptRecord,
                      ["_id", "id", "attemptId"]
                    )}
                  />

                  <InfoRow
                    label="Assessment"
                    value={assessmentTitle}
                  />

                  <InfoRow
                    label="Status"
                    value={status}
                  />

                  <InfoRow
                    label="Score"
                    value={`${score} / ${totalMarks}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* NO MATCHING ASSESSMENT */}

          {!attemptLoading &&
            attemptRecord &&
            !filteredTitle && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <Search
                  size={28}
                  className="mx-auto text-gray-400"
                />

                <h3 className="mt-3 font-semibold text-gray-900">
                  No matching assessment
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try another search term.
                </p>
              </div>
            )}

          {/* NO ATTEMPT */}

          {!attemptLoading && !attemptRecord && !error && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <FileText
                size={30}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                No attempt loaded
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Use a valid attempt ID to view its details.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          {label}
        </span>

        <span className="text-blue-600">{icon}</span>
      </div>

      <p className="mt-3 break-words text-lg font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="break-all text-sm font-semibold text-gray-800 sm:text-right">
        {value}
      </span>
    </div>
  );
}
