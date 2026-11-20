



"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useMyActiveEnrollment } from "@/hooks/schools/useMyActiveEnrollment";
import { useStudentsAssessments } from "@/hooks/schools/useStudentsAssessments";

import {
  getAcademicSessions,
  type AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

/* =========================================================
   TYPES
========================================================= */

type AssessmentRecord = Record<string, unknown>;

type AcademicSessionStatus =
  | "ACTIVE"
  | "UPCOMING"
  | "COMPLETED"
  | "UNKNOWN";

interface AssessmentWorkspaceProps {
  slug: string;
  academicSessionId: string;
  classId: string;
  subjectId: string;
}

/* =========================================================
   HELPERS
========================================================= */

function getText(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function getAcademicSessionId(session: AcademicSession): string {
  return String(
    session._id ||
      session.id ||
      session.academicSessionId ||
      ""
  ).trim();
}

function getAcademicSessionName(session: AcademicSession): string {
  return (
    getText(session.sessionName) ||
    getText(session.name) ||
    getText(session.academicYear) ||
    getText(session.year) ||
    getText(session.title) ||
    "Academic Session"
  );
}

function getAcademicSessionStatus(
  session: AcademicSession
): AcademicSessionStatus {
  const status = getText(session.status).toUpperCase();

  if (status === "ACTIVE" || session.isActive === true) {
    return "ACTIVE";
  }

  if (status === "UPCOMING") {
    return "UPCOMING";
  }

  if (status === "COMPLETED") {
    return "COMPLETED";
  }

  return "UNKNOWN";
}

function getAssessmentValue(
  assessment: AssessmentRecord,
  keys: string[],
  fallback = ""
): string {
  for (const key of keys) {
    const value = getText(assessment[key]);

    if (value) return value;
  }

  return fallback;
}

function formatDate(value: unknown): string {
  if (!value) return "Not specified";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClasses(status: string): string {
  switch (status.toUpperCase()) {
    case "PUBLISHED":
    case "ACTIVE":
    case "AVAILABLE":
      return "bg-green-100 text-green-700";

    case "COMPLETED":
    case "SUBMITTED":
      return "bg-blue-100 text-blue-700";

    case "DRAFT":
      return "bg-gray-100 text-gray-600";

    case "EXPIRED":
    case "CLOSED":
    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
}

function getSessionStatusClasses(status: AcademicSessionStatus): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "UPCOMING":
      return "bg-blue-100 text-blue-700";

    case "COMPLETED":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function MyClassAssessmentsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  /* =======================================================
     ACADEMIC SESSION STATE
  ======================================================= */

  const [academicSessionId, setAcademicSessionId] = useState("");
  const [academicSessionName, setAcademicSessionName] = useState("");
  const [academicSessionStatus, setAcademicSessionStatus] =
    useState<AcademicSessionStatus>("UNKNOWN");

  const [academicSessionStartDate, setAcademicSessionStartDate] =
    useState("");

  const [academicSessionEndDate, setAcademicSessionEndDate] =
    useState("");

  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionRetry, setSessionRetry] = useState(0);

  /* =======================================================
     LOAD SCHOOL ACADEMIC SESSION
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadAcademicSession() {
      if (!slug) {
        setAcademicSessionId("");
        setAcademicSessionName("");
        setAcademicSessionStatus("UNKNOWN");
        setSessionError("School information is unavailable.");
        setLoadingSessions(false);
        return;
      }

      setLoadingSessions(true);
      setSessionError(null);

      setAcademicSessionId("");
      setAcademicSessionName("");
      setAcademicSessionStatus("UNKNOWN");
      setAcademicSessionStartDate("");
      setAcademicSessionEndDate("");

      try {
        const result = await getAcademicSessions(slug);

        if (cancelled) return;

        const sessions = Array.isArray(result.sessions)
          ? result.sessions
          : [];

        if (sessions.length === 0) {
          setSessionError(
            "No academic sessions have been created for this school. Please contact your school administrator."
          );
          return;
        }

        /*
         * Only an ACTIVE session grants assessment access.
         * The backend uses the status field, not necessarily isActive.
         */

        const activeSession = sessions.find(
          (session) =>
            getAcademicSessionStatus(session) === "ACTIVE"
        );

        /*
         * If there is no active session, select the most relevant
         * session only for displaying its status and dates.
         * This does NOT grant assessment access.
         */

        const displaySession =
          activeSession ||
          sessions.find(
            (session) =>
              getAcademicSessionStatus(session) === "UPCOMING"
          ) ||
          sessions.find(
            (session) =>
              getAcademicSessionStatus(session) === "COMPLETED"
          ) ||
          sessions[0];

        const sessionId = getAcademicSessionId(displaySession);

        if (!sessionId) {
          setSessionError(
            "The academic session was found, but its ID is missing. Please contact your school administrator."
          );
          return;
        }

        setAcademicSessionName(
          getAcademicSessionName(displaySession)
        );

        setAcademicSessionStatus(
          getAcademicSessionStatus(displaySession)
        );

        setAcademicSessionStartDate(
          getText(displaySession.startDate)
        );

        setAcademicSessionEndDate(
          getText(displaySession.endDate)
        );

        /*
         * Set the session ID only when the session is ACTIVE.
         * This prevents the enrollment and assessment APIs from
         * being called for UPCOMING or COMPLETED sessions.
         */

        if (activeSession) {
          setAcademicSessionId(sessionId);
        }
      } catch (error: unknown) {
        if (cancelled) return;

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load the school's academic sessions.";

        setSessionError(message);
      } finally {
        if (!cancelled) {
          setLoadingSessions(false);
        }
      }
    }

    void loadAcademicSession();

    return () => {
      cancelled = true;
    };
  }, [slug, sessionRetry]);

  /* =======================================================
     STUDENT ACTIVE ENROLLMENT

     The hook receives an empty session ID unless the backend
     identifies an ACTIVE academic session.
  ======================================================= */

  const {
    enrollment,
    academicSessionId: activeSessionId,
    classId,
    subjectIds,
    loading: enrollmentLoading,
    error: enrollmentError,
    refresh,
  } = useMyActiveEnrollment(academicSessionId, slug);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const effectiveSubjectId = subjectIds.includes(selectedSubjectId)
    ? selectedSubjectId
    : subjectIds[0] || "";

  /* =======================================================
     SHARED PAGE HEADER
  ======================================================= */

  const pageHeader = (
    <div>
      <Link
        href={`/schools/${slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <GraduationCap size={25} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Class Assessments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and complete assessments assigned to your class.
          </p>
        </div>
      </div>
    </div>
  );

  /* =======================================================
     SESSION LOADING
  ======================================================= */

  if (loadingSessions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2
          size={36}
          className="animate-spin text-blue-600"
        />

        <p className="mt-4 text-sm font-medium text-gray-600">
          Loading your school's academic session...
        </p>
      </div>
    );
  }

  /* =======================================================
     SESSION REQUEST ERROR
  ======================================================= */

  if (sessionError) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div className="min-w-0">
              <h2 className="font-semibold text-amber-900">
                Unable to load academic session
              </h2>

              <p className="mt-1 text-sm text-amber-800">
                {sessionError}
              </p>

              <button
                type="button"
                onClick={() =>
                  setSessionRetry((current) => current + 1)
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                <RefreshCw size={15} />
                Reload academic sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     UPCOMING / COMPLETED / UNKNOWN SESSION

     Do not load enrollment or assessments unless ACTIVE.
  ======================================================= */

  if (!academicSessionId) {
    const isUpcoming = academicSessionStatus === "UPCOMING";
    const isCompleted = academicSessionStatus === "COMPLETED";

    const message = isUpcoming
      ? "This academic session has not started yet. You will be able to access your class assessments when the school activates the session."
      : isCompleted
        ? "This academic session has been completed. Assessment access is no longer available for this session."
        : "There is currently no active academic session. Please contact your school administrator.";

    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isUpcoming
                  ? "bg-blue-100 text-blue-700"
                  : isCompleted
                    ? "bg-gray-100 text-gray-600"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {isUpcoming ? (
                <Clock size={25} />
              ) : isCompleted ? (
                <CheckCircle2 size={25} />
              ) : (
                <AlertCircle size={25} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  {isUpcoming
                    ? "Academic session has not started"
                    : isCompleted
                      ? "Academic session completed"
                      : "No active academic session"}
                </h2>

                {academicSessionStatus !== "UNKNOWN" && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getSessionStatusClasses(
                      academicSessionStatus
                    )}`}
                  >
                    {academicSessionStatus}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {message}
              </p>

              {academicSessionName && (
                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Academic session
                  </p>

                  <p className="mt-1 text-base font-bold text-gray-900">
                    {academicSessionName}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <CalendarDays
                        size={17}
                        className="mt-0.5 text-gray-400"
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Start date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {formatDate(academicSessionStartDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CalendarDays
                        size={17}
                        className="mt-0.5 text-gray-400"
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          End date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {formatDate(academicSessionEndDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setSessionRetry((current) => current + 1)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={15} />
                Check session status again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     ENROLLMENT LOADING
  ======================================================= */

  if (enrollmentLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2
          size={36}
          className="animate-spin text-blue-600"
        />

        <p className="mt-4 text-sm font-medium text-gray-600">
          Loading your class enrollment...
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {academicSessionName}
        </p>
      </div>
    );
  }

  /* =======================================================
     NO ACTIVE ENROLLMENT
  ======================================================= */

  if (enrollmentError || !enrollment) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div className="min-w-0">
              <h2 className="font-semibold text-amber-900">
                Active enrollment unavailable
              </h2>

              <p className="mt-1 text-sm text-amber-800">
                {enrollmentError ||
                  "We could not find an active class enrollment for your account in this academic session."}
              </p>

              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO CLASS OR SESSION
  ======================================================= */

  if (!activeSessionId || !classId) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h2 className="font-semibold text-amber-900">
                Class information unavailable
              </h2>

              <p className="mt-1 text-sm text-amber-800">
                Your active enrollment was found, but the academic session or class
                information is missing. Please contact your school administrator.
              </p>

              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                <RefreshCw size={15} />
                Refresh enrollment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO SUBJECTS
  ======================================================= */

  if (!subjectIds.length) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h2 className="font-semibold text-amber-900">
                No subjects assigned
              </h2>

              <p className="mt-1 text-sm text-amber-800">
                Your active class enrollment does not contain any assigned subjects.
                Please contact your school administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {pageHeader}

        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh enrollment
        </button>
      </div>

      {/* ENROLLMENT CARD */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Your active enrollment
            </p>

            <p className="mt-1 text-sm text-gray-700">
              Your assessments are loaded using your registered class and active academic session.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2 size={15} />
            Active enrollment
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">
              Enrollment status
            </p>

            <p className="mt-1 text-sm font-semibold text-green-700">
              {getText(enrollment.status, "ACTIVE")}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Academic session
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {academicSessionName}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Class ID
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-gray-800">
              {classId}
            </p>
          </div>
        </div>
      </div>

      {/* SUBJECT SELECTOR */}

      {subjectIds.length > 1 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="assessment-subject"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Select subject
          </label>

          <select
            id="assessment-subject"
            value={effectiveSubjectId}
            onChange={(event) =>
              setSelectedSubjectId(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:max-w-md"
          >
            {subjectIds.map((subjectId, index) => (
              <option key={subjectId} value={subjectId}>
                Subject {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ASSESSMENT WORKSPACE */}

      {effectiveSubjectId && (
        <AssessmentWorkspace
          key={effectiveSubjectId}
          slug={slug}
          academicSessionId={activeSessionId}
          classId={classId}
          subjectId={effectiveSubjectId}
        />
      )}
    </div>
  );
}

/* =========================================================
   ASSESSMENT WORKSPACE
========================================================= */

function AssessmentWorkspace({
  slug,
  academicSessionId,
  classId,
  subjectId,
}: AssessmentWorkspaceProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedAssessmentId, setSelectedAssessmentId] =
    useState("");

  const {
    assessments,
    selectedAssessment,
    loading,
    detailsLoading,
    attemptLoading,
    error,
    successMessage,
    loadAssessments,
    loadAssessmentDetails,
    startAssessment,
    clearMessages,
  } = useStudentsAssessments({
    academicSessionId,
    classId,
    subjectId,
    autoLoad: true,
  });

  const selectedRecord = selectedAssessment as
    | AssessmentRecord
    | null;

  /* =======================================================
     FILTER ASSESSMENTS
  ======================================================= */

  const filteredAssessments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return assessments;

    return assessments.filter((assessment) => {
      const record = assessment as AssessmentRecord;

      const title = getAssessmentValue(
        record,
        ["assessmentTitle", "title", "assessmentName", "name"]
      );

      const description = getAssessmentValue(
        record,
        ["description", "instructions"]
      );

      const type = getAssessmentValue(
        record,
        ["assessmentType", "type"]
      );

      return `${title} ${description} ${type}`
        .toLowerCase()
        .includes(keyword);
    });
  }, [assessments, search]);

  /* =======================================================
     VIEW DETAILS
  ======================================================= */

  const handleViewDetails = async (assessmentId: string) => {
    clearMessages();

    setSelectedAssessmentId(assessmentId);

    await loadAssessmentDetails(assessmentId, {
      academicSessionId,
      classId,
      subjectId,
    });
  };

  /* =======================================================
     START ASSESSMENT
  ======================================================= */

  const handleStartAssessment = async () => {
    if (!selectedAssessmentId) return;

    clearMessages();

    const result = await startAssessment(
      selectedAssessmentId,
      {
        academicSessionId,
        classId,
        subjectId,
      }
    );

    if (!result?._id) return;

    router.push(
      `/schools/${slug}/my-class-assessments/attempts/${result._id}`
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Assessments"
          value={assessments.length}
          icon={<FileText size={23} />}
          iconClass="bg-blue-100 text-blue-700"
        />

        <SummaryCard
          label="Available to View"
          value={assessments.length}
          icon={<BookOpen size={23} />}
          iconClass="bg-green-100 text-green-700"
        />

        <SummaryCard
          label="Search Results"
          value={filteredAssessments.length}
          icon={<Search size={23} />}
          iconClass="bg-purple-100 text-purple-700"
        />
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
              Unable to complete request
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2
            size={19}
            className="shrink-0 text-green-600"
          />

          <p className="text-sm text-green-800">
            {successMessage}
          </p>
        </div>
      )}

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
            placeholder="Search assessments..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* LIST AND DETAILS */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Available Assessments
            </h2>

            <span className="text-sm text-gray-500">
              {filteredAssessments.length} found
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
              <Loader2
                size={32}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading your assessments...
              </p>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="rounded-full bg-gray-100 p-4 text-gray-500">
                <FileText size={28} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No assessments found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                {search
                  ? "No assessments match your search. Try another keyword."
                  : "There are currently no assessments available for this subject."}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  void loadAssessments();
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={15} />
                Refresh assessments
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssessments.map((assessment, index) => {
                const record =
                  assessment as AssessmentRecord;

                const assessmentId = getAssessmentValue(
                  record,
                  ["_id", "id", "assessmentId"]
                );

                const title = getAssessmentValue(
                  record,
                  [
                    "assessmentTitle",
                    "title",
                    "assessmentName",
                    "name",
                  ],
                  "Untitled Assessment"
                );

                const type = getAssessmentValue(
                  record,
                  ["assessmentType", "type"],
                  "Assessment"
                );

                const status = getAssessmentValue(
                  record,
                  ["status", "assessmentStatus"],
                  "AVAILABLE"
                );

                const startDate = getAssessmentValue(
                  record,
                  ["startDate", "scheduledDate", "date"]
                );

                const endDate = getAssessmentValue(
                  record,
                  ["endDate", "dueDate", "deadline"]
                );

                const duration = getAssessmentValue(
                  record,
                  [
                    "duration",
                    "durationInMinutes",
                    "timeAllowed",
                  ]
                );

                const isSelected =
                  selectedAssessmentId === assessmentId;

                return (
                  <div
                    key={assessmentId || index}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                      isSelected
                        ? "border-blue-400 ring-2 ring-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <FileText size={21} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900">
                            {title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {type}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}
                      >
                        {status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InfoItem
                        icon={<CalendarDays size={16} />}
                        text={`Starts: ${formatDate(startDate)}`}
                      />

                      <InfoItem
                        icon={<Clock size={16} />}
                        text={`Duration: ${
                          duration
                            ? `${duration} minutes`
                            : "Not specified"
                        }`}
                      />

                      <InfoItem
                        icon={<CalendarDays size={16} />}
                        text={`Ends: ${formatDate(endDate)}`}
                      />

                      <InfoItem
                        icon={<ShieldCheck size={16} />}
                        text="School assessment"
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        disabled={
                          !assessmentId ||
                          (detailsLoading && isSelected)
                        }
                        onClick={() => {
                          if (assessmentId) {
                            void handleViewDetails(assessmentId);
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {detailsLoading && isSelected ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <BookOpen size={16} />
                        )}

                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DETAILS PANEL */}

        <aside className="xl:col-span-2">
          <div className="sticky top-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
                <BookOpen size={21} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Assessment Details
                </h2>

                <p className="text-xs text-gray-500">
                  Review before starting
                </p>
              </div>
            </div>

            {detailsLoading ? (
              <div className="flex min-h-52 flex-col items-center justify-center">
                <Loader2
                  size={28}
                  className="animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-gray-500">
                  Loading assessment details...
                </p>
              </div>
            ) : selectedRecord ? (
              <div className="space-y-5 pt-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {getAssessmentValue(
                      selectedRecord,
                      [
                        "assessmentTitle",
                        "title",
                        "assessmentName",
                        "name",
                      ],
                      "Assessment"
                    )}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {getAssessmentValue(
                      selectedRecord,
                      ["description", "instructions"],
                      "No additional description provided."
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <DetailRow
                    label="Assessment Type"
                    value={getAssessmentValue(
                      selectedRecord,
                      ["assessmentType", "type"],
                      "Not specified"
                    )}
                  />

                  <DetailRow
                    label="Total Questions"
                    value={getAssessmentValue(
                      selectedRecord,
                      [
                        "totalQuestions",
                        "numberOfQuestions",
                        "questionCount",
                      ],
                      "Not specified"
                    )}
                  />

                  <DetailRow
                    label="Duration"
                    value={getAssessmentValue(
                      selectedRecord,
                      [
                        "duration",
                        "durationInMinutes",
                        "timeAllowed",
                      ],
                      "Not specified"
                    )}
                    suffix=" minutes"
                  />

                  <DetailRow
                    label="Total Marks"
                    value={getAssessmentValue(
                      selectedRecord,
                      [
                        "totalMarks",
                        "maximumScore",
                        "maxScore",
                      ],
                      "Not specified"
                    )}
                  />

                  <DetailRow
                    label="Start Date"
                    value={formatDate(
                      selectedRecord.startDate ??
                        selectedRecord.scheduledDate
                    )}
                  />

                  <DetailRow
                    label="End Date"
                    value={formatDate(
                      selectedRecord.endDate ??
                        selectedRecord.dueDate
                    )}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void handleStartAssessment()}
                  disabled={attemptLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {attemptLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Starting assessment...
                    </>
                  ) : (
                    <>
                      <GraduationCap size={18} />
                      Start Assessment
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-gray-400">
                  Make sure you are ready before starting.
                  Your attempt will be managed by the assessment system.
                </p>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                  <FileText size={27} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  No assessment selected
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                  Select an assessment from the list to view its instructions and details.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE UI
========================================================= */

function SummaryCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-gray-400">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-gray-800">
        {value}
        {value !== "Not specified" ? suffix : ""}
      </span>
    </div>
  );
}
