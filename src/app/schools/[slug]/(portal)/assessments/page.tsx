
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useAssessments } from "@/hooks/schools/useAssessments";
import { useAuthStore } from "@/stores/auth.store";

import {
  getAcademicSessions,
  type AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

import {
  getAllMyTeachingAssignments,
  type TeachingAssignmentClass,
} from "@/lib/schools/portal/services/teaching.assignments";

import {
  getAssessmentsByClassAndSubject,
} from "@/lib/schools/portal/services/assessment.service";

/* =========================================================
   TYPES
========================================================= */

type ApiRecord = Record<string, unknown>;

type AssessmentRecord = {
  _id: string;
  assessmentName?: string;
  title?: string;
  description?: string;
  assessmentType?: string;
  status?: string;
  assessmentStatus?: string;
  publicationStatus?: string;
  isPublished?: boolean;
  isActive?: boolean;
  totalMarks?: number;
  passMark?: number;
  duration?: number;
  durationMinutes?: number;
  startDate?: string;
  endDate?: string;
  startsAt?: string;
  endsAt?: string;
  classId?: string | { _id?: string };
  classIds?: Array<string | { _id?: string }>;
  subjectId?: string | { _id?: string };
  [key: string]: unknown;
};

type TeachingSubject = {
  _id?: string;
  id?: string;
  subjectId?: string;
  subjectName?: string;
  subjectCode?: string;
};

type TeachingClass = TeachingAssignmentClass & {
  _id?: string;
  id?: string;
  classId?: string | { _id?: string };
  className?: string;
  classCode?: string;
  subjects?: TeachingSubject[];
  subjectIds?: TeachingSubject[];
  class?: {
    _id?: string;
    id?: string;
    className?: string;
    subjects?: TeachingSubject[];
  };
};

type TeacherPermission = {
  classId: string;
  subjectId: string;
};

type TeacherAssessment = AssessmentRecord & {
  __assignmentPairs?: string[];
};

/* =========================================================
   GENERAL HELPERS
========================================================= */

function isRecord(value: unknown): value is ApiRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getId(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!isRecord(value)) {
    return "";
  }

  if (typeof value._id === "string") {
    return value._id.trim();
  }

  if (typeof value.id === "string") {
    return value.id.trim();
  }

  return "";
}

/**
 * Reads the actual backend message before falling back
 * to the generic Axios error message.
 */
function getErrorMessage(error: unknown): string {
  if (isRecord(error)) {
    const response = error.response;

    if (isRecord(response)) {
      const data = response.data;

      if (isRecord(data)) {
        const message = data.message;

        if (Array.isArray(message)) {
          return message.map(String).join(", ");
        }

        if (typeof message === "string") {
          return message;
        }
      }
    }

    const directMessage = error.message;

    if (typeof directMessage === "string") {
      return directMessage;
    }

    if (typeof error.message === "object" && error.message !== null) {
      const message = error.message;

      if (Array.isArray(message)) {
        return message.map(String).join(", ");
      }
    }
  }

  return "An unexpected error occurred while loading assessments.";
}

/**
 * Supports Axios errors and ordinary backend error objects.
 */
function getHttpStatus(error: unknown): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  const response = error.response;

  if (isRecord(response) && typeof response.status === "number") {
    return response.status;
  }

  if (typeof error.status === "number") {
    return error.status;
  }

  if (typeof error.statusCode === "number") {
    return error.statusCode;
  }

  return undefined;
}

/**
 * A missing assessment for an assigned class-subject pair
 * is a normal empty result, not an application error.
 */
function isNoAssessmentsFound(error: unknown): boolean {
  const status = getHttpStatus(error);
  const message = getErrorMessage(error).toLowerCase();

  return (
    status === 404 &&
    (
      message.includes("assessment not found") ||
      message.includes("assessments not found") ||
      message.includes("no assessment found") ||
      message.includes("no assessments found")
    )
  );
}

/* =========================================================
   SESSION HELPERS
========================================================= */

function getSessionId(session: AcademicSession): string {
  return (
    getId(session._id) ||
    getId(session.id) ||
    getId(session.academicSessionId)
  );
}

function getSessionName(session: AcademicSession): string {
  return (
    session.sessionName?.trim() ||
    session.name?.trim() ||
    session.academicYear?.trim() ||
    session.year?.trim() ||
    session.title?.trim() ||
    "Unnamed Academic Session"
  );
}

function isActiveSession(session: AcademicSession): boolean {
  const status = String(session.status || "").toUpperCase();

  return (
    session.isActive === true ||
    status === "ACTIVE" ||
    status === "CURRENT"
  );
}

function getSessionDateRange(session: AcademicSession): string {
  const start = session.startDate
    ? formatDate(session.startDate)
    : "";

  const end = session.endDate
    ? formatDate(session.endDate)
    : "";

  if (start && end) {
    return `${start} – ${end}`;
  }

  return start || end || "";
}

/* =========================================================
   API RESPONSE HELPERS
========================================================= */

function unwrapApiResponse(response: unknown): unknown {
  let current = response;

  for (let depth = 0; depth < 6; depth += 1) {
    if (!isRecord(current)) {
      return current;
    }

    if (current.success === false) {
      const message = current.message;

      const messageText = Array.isArray(message)
        ? message.map(String).join(", ")
        : typeof message === "string"
          ? message
          : "The request failed.";

      const status =
        typeof current.status === "number"
          ? current.status
          : typeof current.statusCode === "number"
            ? current.statusCode
            : undefined;

      // Treat a backend 404 for missing assessments as empty.
      if (
        status === 404 &&
        /assessment(s)? not found|no assessment(s)? found/i.test(
          messageText,
        )
      ) {
        return [];
      }

      throw new Error(messageText);
    }

    if ("data" in current && current.data !== undefined) {
      current = current.data;
      continue;
    }

    return current;
  }

  return current;
}

function extractAssessmentRecords(
  response: unknown,
): AssessmentRecord[] {
  const result = unwrapApiResponse(response);

  if (Array.isArray(result)) {
    return result.filter(isRecord) as unknown as AssessmentRecord[];
  }

  if (!isRecord(result)) {
    return [];
  }

  const possibleKeys = [
    "assessments",
    "assessmentObj",
    "assessmentsObj",
    "assessmentList",
    "assessment",
    "results",
    "items",
  ];

  for (const key of possibleKeys) {
    const value = result[key];

    if (Array.isArray(value)) {
      return value.filter(isRecord) as unknown as AssessmentRecord[];
    }
  }

  if (result._id || result.assessmentId) {
    return [result as unknown as AssessmentRecord];
  }

  return [];
}

/* =========================================================
   ASSESSMENT HELPERS
========================================================= */

function getAssessmentName(assessment: AssessmentRecord) {
  return (
    assessment.title?.trim() ||
    assessment.assessmentName?.trim() ||
    "Untitled Assessment"
  );
}

function formatDate(value?: string) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDuration(assessment: AssessmentRecord) {
  const duration =
    assessment.durationMinutes ?? assessment.duration;

  if (
    typeof duration !== "number" ||
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    return "—";
  }

  return `${duration} mins`;
}

function getStartDate(assessment: AssessmentRecord) {
  return assessment.startsAt || assessment.startDate;
}

function getEndDate(assessment: AssessmentRecord) {
  return assessment.endsAt || assessment.endDate;
}

/**
 * Handles different status field names used by the backend.
 */
function getAssessmentStatus(
  assessment: AssessmentRecord,
): string {
  if (typeof assessment.status === "string" && assessment.status.trim()) {
    return assessment.status.trim().toUpperCase();
  }

  if (
    typeof assessment.assessmentStatus === "string" &&
    assessment.assessmentStatus.trim()
  ) {
    return assessment.assessmentStatus.trim().toUpperCase();
  }

  if (
    typeof assessment.publicationStatus === "string" &&
    assessment.publicationStatus.trim()
  ) {
    return assessment.publicationStatus.trim().toUpperCase();
  }

  if (assessment.isPublished === true) {
    return "PUBLISHED";
  }

  if (assessment.isPublished === false) {
    return "DRAFT";
  }

  if (assessment.isActive === true) {
    return "ACTIVE";
  }

  if (assessment.isActive === false) {
    return "INACTIVE";
  }

  return "NOT SPECIFIED";
}

function getStatusStyle(status?: string) {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "PUBLISHED":
      return "bg-green-100 text-green-700";

    case "COMPLETED":
    case "CLOSED":
      return "bg-blue-100 text-blue-700";

    case "DRAFT":
      return "bg-yellow-100 text-yellow-700";

    case "INACTIVE":
    case "CANCELLED":
    case "EXPIRED":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

/* =========================================================
   TEACHING ASSIGNMENT HELPERS
========================================================= */

function extractAssignmentClassId(
  assignment: TeachingClass,
): string {
  return (
    getId(assignment.classId) ||
    getId(assignment.class) ||
    getId(assignment._id) ||
    getId(assignment.id)
  );
}

function extractAssignmentSubjects(
  assignment: TeachingClass,
): TeachingSubject[] {
  const possibleSubjects = [
    assignment.subjects,
    assignment.subjectIds,
    assignment.class?.subjects,
  ];

  for (const subjects of possibleSubjects) {
    if (Array.isArray(subjects)) {
      return subjects.filter(isRecord) as TeachingSubject[];
    }
  }

  return [];
}

function buildTeacherPermissions(
  assignments: TeachingAssignmentClass[],
): TeacherPermission[] {
  const permissionMap = new Map<string, TeacherPermission>();

  for (const item of assignments) {
    const assignment = item as TeachingClass;
    const classId = extractAssignmentClassId(assignment);

    if (!classId) continue;

    const subjects = extractAssignmentSubjects(assignment);

    for (const subject of subjects) {
      const subjectId =
        getId(subject._id) ||
        getId(subject.subjectId) ||
        getId(subject.id);

      if (!subjectId) continue;

      const key = `${classId}:${subjectId}`;

      permissionMap.set(key, {
        classId,
        subjectId,
      });
    }
  }

  return Array.from(permissionMap.values());
}

function getAssessmentClassIds(
  assessment: AssessmentRecord,
): string[] {
  const ids = new Set<string>();

  if (Array.isArray(assessment.classIds)) {
    for (const item of assessment.classIds) {
      const id = getId(item);
      if (id) ids.add(id);
    }
  }

  const singleClassId = getId(assessment.classId);

  if (singleClassId) {
    ids.add(singleClassId);
  }

  return Array.from(ids);
}

function canTeacherViewAssessment(
  assessment: TeacherAssessment,
  allowedPairs: Set<string>,
): boolean {
  const subjectId = getId(assessment.subjectId);
  const classIds = getAssessmentClassIds(assessment);

  if (subjectId && classIds.length > 0) {
    return classIds.some((classId) =>
      allowedPairs.has(`${classId}:${subjectId}`),
    );
  }

  return (assessment.__assignmentPairs || []).some((pair) =>
    allowedPairs.has(pair),
  );
}

/* =========================================================
   DEDUPLICATE ASSESSMENTS
========================================================= */

function deduplicateAssessments(
  records: TeacherAssessment[],
): TeacherAssessment[] {
  const map = new Map<string, TeacherAssessment>();

  for (const assessment of records) {
    const id = getId(assessment._id);

    if (!id) continue;

    const existing = map.get(id);

    if (!existing) {
      map.set(id, assessment);
      continue;
    }

    map.set(id, {
      ...existing,
      ...assessment,
      __assignmentPairs: Array.from(
        new Set([
          ...(existing.__assignmentPairs || []),
          ...(assessment.__assignmentPairs || []),
        ]),
      ),
    });
  }

  return Array.from(map.values());
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={23} />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status?: string }) {
  const normalized = status || "NOT SPECIFIED";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(normalized)}`}
    >
      {normalized.replace(/_/g, " ")}
    </span>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AssessmentsPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const slug = params.slug;
  const schoolUrl = `/schools/${slug}`;

  const urlSessionId =
    searchParams.get("academicSessionId")?.trim() || "";

  const user = useAuthStore((state) => state.user);

  const membershipRole =
    user?.schoolContext?.userSchoolMembership?.role?.toUpperCase() || "";

  const isSchoolAdministrator = [
    "OWNER",
    "ADMIN",
    "ADMINISTRATOR",
  ].includes(membershipRole);

  const isTeacher = membershipRole === "TEACHER";

  const {
    schoolId,
    schoolSubdomain,
    isHydrated,
    assessments,
    academicSessionId,
    isLoading: administratorLoading,
    error,
    successMessage,
    setAcademicSessionId,
    fetchAssessments,
    clearMessages,
  } = useAssessments(slug);

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");

  const [selectedSessionId, setSelectedSessionId] = useState(
    urlSessionId || academicSessionId || "",
  );

  const [teacherAssessments, setTeacherAssessments] =
    useState<TeacherAssessment[]>([]);

  const [teacherLoading, setTeacherLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [teacherRequestError, setTeacherRequestError] = useState("");

  const [refreshVersion, setRefreshVersion] = useState(0);

  const requestId = useRef(0);

  /* =======================================================
     KEEP URL SESSION IN SYNC
  ======================================================= */

  useEffect(() => {
    if (urlSessionId && urlSessionId !== selectedSessionId) {
      setSelectedSessionId(urlSessionId);
    }
  }, [urlSessionId, selectedSessionId]);

  /* =======================================================
     FETCH ACADEMIC SESSIONS
  ======================================================= */

  useEffect(() => {
    if (!isHydrated || !schoolSubdomain) {
      return;
    }

    let cancelled = false;

    async function loadSessions() {
      setSessionsLoading(true);
      setSessionError("");

      try {
        const result = await getAcademicSessions(
          schoolSubdomain.trim().toLowerCase(),
        );

        if (cancelled) return;

        const loadedSessions = Array.isArray(result.sessions)
          ? result.sessions
          : [];

        setSessions(loadedSessions);

        const validSessions = loadedSessions.filter(
          (session) => getSessionId(session),
        );

        const currentSelection =
          urlSessionId ||
          selectedSessionId ||
          academicSessionId;

        const selectionExists = validSessions.some(
          (session) => getSessionId(session) === currentSelection,
        );

        if (selectionExists) {
          setSelectedSessionId(currentSelection);
        } else {
          const activeSession = validSessions.find(isActiveSession);
          const fallbackSession = activeSession || validSessions[0];

          setSelectedSessionId(
            fallbackSession ? getSessionId(fallbackSession) : "",
          );
        }
      } catch (err) {
        if (!cancelled) {
          setSessionError(getErrorMessage(err));
          setSessions([]);
        }
      } finally {
        if (!cancelled) {
          setSessionsLoading(false);
        }
      }
    }

    void loadSessions();

    return () => {
      cancelled = true;
    };
  }, [
    isHydrated,
    schoolSubdomain,
    refreshVersion,
    urlSessionId,
    academicSessionId,
  ]);

  /* =======================================================
     SELECTED SESSION OBJECT
  ======================================================= */

  const selectedSession = useMemo(
    () =>
      sessions.find(
        (session) => getSessionId(session) === selectedSessionId,
      ) || null,
    [sessions, selectedSessionId],
  );

  /* =======================================================
     SESSION CHANGE
  ======================================================= */

  const handleSessionChange = useCallback(
    (sessionId: string) => {
      setSelectedSessionId(sessionId);
      setTeacherAssessments([]);
      setAssignmentError("");
      setTeacherRequestError("");
      clearMessages();

      if (sessionId) {
        setAcademicSessionId(sessionId);
      }
    },
    [clearMessages, setAcademicSessionId],
  );

  /* =======================================================
     LOAD ASSESSMENTS
  ======================================================= */

  useEffect(() => {
    if (!isHydrated || !schoolId || !schoolSubdomain) {
      return;
    }

    if (!selectedSessionId) {
      setTeacherAssessments([]);
      setAssignmentError("");
      setTeacherRequestError("");
      setTeacherLoading(false);
      return;
    }

    if (!isSchoolAdministrator && !isTeacher) {
      return;
    }

    const currentRequestId = ++requestId.current;
    let cancelled = false;

    async function loadAdministratorAssessments() {
      clearMessages();
      setAssignmentError("");
      setTeacherRequestError("");
      setTeacherAssessments([]);

      if (academicSessionId !== selectedSessionId) {
        setAcademicSessionId(selectedSessionId);
      }

      await fetchAssessments(selectedSessionId);
    }

    async function loadTeacherAssessments() {
      clearMessages();
      setAssignmentError("");
      setTeacherRequestError("");
      setTeacherAssessments([]);
      setTeacherLoading(true);

      if (academicSessionId !== selectedSessionId) {
        setAcademicSessionId(selectedSessionId);
      }

      try {
        const assignments = await getAllMyTeachingAssignments(
          selectedSessionId,
          schoolSubdomain.trim().toLowerCase(),
        );

        if (cancelled || currentRequestId !== requestId.current) {
          return;
        }

        const permissions = buildTeacherPermissions(assignments);

        if (permissions.length === 0) {
          setAssignmentError(
            "You do not currently have any active class and subject teaching assignments for this academic session.",
          );

          setTeacherAssessments([]);
          return;
        }

        /* ===============================================
           FETCH ASSESSMENTS FOR EACH ASSIGNED PAIR

           404 = no assessments for that pair.
           This is a normal empty result.

           403 and other errors remain genuine failures.
        =============================================== */

        const results = await Promise.allSettled(
          permissions.map(async (permission) => {
            try {
              const response = await getAssessmentsByClassAndSubject(
                selectedSessionId,
                permission.classId,
                permission.subjectId,
                schoolSubdomain.trim().toLowerCase(),
              );

              const records = extractAssessmentRecords(response);

              const pairKey =
                `${permission.classId}:${permission.subjectId}`;

              return records.map((assessment) => ({
                ...assessment,
                __assignmentPairs: [pairKey],
              })) as TeacherAssessment[];

            } catch (requestError) {
              // A 404 saying assessments were not found
              // simply means this pair has no assessments yet.
              if (isNoAssessmentsFound(requestError)) {
                return [];
              }

              // Preserve genuine backend errors.
              throw requestError;
            }
          }),
        );

        if (cancelled || currentRequestId !== requestId.current) {
          return;
        }

        const successfulResults: TeacherAssessment[] = [];
        const failedResults: string[] = [];

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            successfulResults.push(...result.value);
          } else {
            const permission = permissions[index];

            failedResults.push(
              `${permission.classId}/${permission.subjectId}: ${getErrorMessage(result.reason)}`,
            );
          }
        });

        const uniqueAssessments =
          deduplicateAssessments(successfulResults);

        const permissionSet = new Set(
          permissions.map(
            (permission) =>
              `${permission.classId}:${permission.subjectId}`,
          ),
        );

        const filteredAssessments = uniqueAssessments.filter(
          (assessment) =>
            canTeacherViewAssessment(assessment, permissionSet),
        );

        setTeacherAssessments(filteredAssessments);

        /* ===============================================
           SHOW ONLY REAL ERRORS
        =============================================== */

        if (failedResults.length > 0) {
          console.error(
            "[ASSESSMENTS] Some teacher assessment requests failed:",
            failedResults,
          );

          const forbiddenCount = results.filter(
            (result) =>
              result.status === "rejected" &&
              getHttpStatus(result.reason) === 403,
          ).length;

          if (forbiddenCount > 0) {
            setTeacherRequestError(
              `${forbiddenCount} of your assigned class-subject requests were denied by the backend. Please contact your school administrator to check your assessment permissions.`,
            );
          } else {
            setTeacherRequestError(
              `${failedResults.length} of ${permissions.length} assigned class-subject requests could not be loaded. Please refresh the page.`,
            );
          }
        } else {
          setTeacherRequestError("");
        }

      } catch (err) {
        if (cancelled || currentRequestId !== requestId.current) {
          return;
        }

        console.error(
          "[ASSESSMENTS] Failed to load teacher assessments:",
          err,
        );

        setTeacherAssessments([]);
        setAssignmentError(getErrorMessage(err));

      } finally {
        if (!cancelled && currentRequestId === requestId.current) {
          setTeacherLoading(false);
        }
      }
    }

    if (isSchoolAdministrator) {
      void loadAdministratorAssessments();
    } else if (isTeacher) {
      void loadTeacherAssessments();
    }

    return () => {
      cancelled = true;
    };
  }, [
    isHydrated,
    schoolId,
    schoolSubdomain,
    selectedSessionId,
    academicSessionId,
    isSchoolAdministrator,
    isTeacher,
    fetchAssessments,
    setAcademicSessionId,
    clearMessages,
    refreshVersion,
  ]);

  /* =======================================================
     INVALIDATE REQUESTS ON UNMOUNT
  ======================================================= */

  useEffect(() => {
    return () => {
      requestId.current += 1;
    };
  }, []);

  /* =======================================================
     VISIBLE ASSESSMENTS
  ======================================================= */

  const visibleAssessments = useMemo(() => {
    if (isSchoolAdministrator) {
      return (assessments || []) as AssessmentRecord[];
    }

    if (isTeacher) {
      return teacherAssessments;
    }

    return [];
  }, [
    assessments,
    teacherAssessments,
    isSchoolAdministrator,
    isTeacher,
  ]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    const total = visibleAssessments.length;

    const active = visibleAssessments.filter((item) =>
      ["ACTIVE", "PUBLISHED"].includes(
        getAssessmentStatus(item),
      ),
    ).length;

    const draft = visibleAssessments.filter(
      (item) => getAssessmentStatus(item) === "DRAFT",
    ).length;

    const closed = visibleAssessments.filter((item) =>
      ["CLOSED", "COMPLETED", "CANCELLED", "EXPIRED"].includes(
        getAssessmentStatus(item),
      ),
    ).length;

    return {
      total,
      active,
      draft,
      closed,
    };
  }, [visibleAssessments]);

  /* =======================================================
     LOADING
  ======================================================= */

  const isPageLoading =
    sessionsLoading ||
    administratorLoading ||
    teacherLoading;

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = useCallback(() => {
    if (isPageLoading) return;

    clearMessages();
    setSessionError("");
    setAssignmentError("");
    setTeacherRequestError("");

    if (isSchoolAdministrator && selectedSessionId) {
      void fetchAssessments(selectedSessionId);
      setRefreshVersion((current) => current + 1);
    } else {
      requestId.current += 1;
      setTeacherLoading(false);
      setRefreshVersion((current) => current + 1);
    }
  }, [
    isPageLoading,
    clearMessages,
    isSchoolAdministrator,
    selectedSessionId,
    fetchAssessments,
  ]);

  /* =======================================================
     HYDRATION
  ======================================================= */

  if (!isHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <RefreshCw
          className="animate-spin text-blue-600"
          size={30}
        />
      </div>
    );
  }

  /* =======================================================
     ACCESS CONTROL
  ======================================================= */

  if (!isSchoolAdministrator && !isTeacher) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 text-red-700">
            <ShieldCheck size={25} />

            <h1 className="text-xl font-bold">
              Access Restricted
            </h1>
          </div>

          <p className="mt-3 text-sm leading-6 text-red-700">
            Your school membership role does not have permission
            to access the assessment management page.
          </p>

          <Link
            href={schoolUrl}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700"
          >
            Return to Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={schoolUrl} className="hover:text-blue-600">
              School Portal
            </Link>

            <span>/</span>
            <span>Assessments</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Assessment Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isSchoolAdministrator
              ? "View and manage all assessments created across your school."
              : "View assessments for the classes and subjects assigned to you."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isPageLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={isPageLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href={`${schoolUrl}/assessments/create`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Assessment
          </Link>
        </div>
      </div>

      {/* VISIBILITY INFORMATION */}

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          {isSchoolAdministrator ? (
            <Users
              size={22}
              className="mt-0.5 shrink-0 text-blue-700"
            />
          ) : (
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-blue-700"
            />
          )}

          <div>
            <h2 className="font-semibold text-blue-900">
              {isSchoolAdministrator
                ? "School-wide assessment access"
                : "Teacher-specific assessment access"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              {isSchoolAdministrator
                ? "You can view all assessments created by teachers across the school for the selected academic session."
                : "You can view assessments retrieved for your assigned class and subject combinations. Assessments outside your teaching assignments are not displayed."}
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY CARDS */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Assessments"
          value={summary.total}
          description="Assessments visible to your account"
          icon={ClipboardList}
        />

        <SummaryCard
          title="Published"
          value={summary.active}
          description="Published or active assessments"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Draft"
          value={summary.draft}
          description="Assessments not yet published"
          icon={FileText}
        />

        <SummaryCard
          title="Closed"
          value={summary.closed}
          description="Closed, completed or cancelled assessments"
          icon={Clock}
        />
      </section>

      {/* SESSION SELECTOR */}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <Search size={19} className="text-blue-600" />

          <h2 className="font-bold text-gray-900">
            Assessment Records
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Select an academic session to view its assessment records.
        </p>

        <div className="mt-5">
          <label
            htmlFor="assessment-academic-session"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Academic Session
          </label>

          <select
            id="assessment-academic-session"
            value={selectedSessionId}
            onChange={(event) =>
              handleSessionChange(event.target.value)
            }
            disabled={sessionsLoading || sessions.length === 0}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                  {isActiveSession(session) ? " (Active)" : ""}
                </option>
              );
            })}
          </select>

          {selectedSession && (
            <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Selected Academic Session
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {getSessionName(selectedSession)}
                  </p>
                </div>

                {isActiveSession(selectedSession) && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active Session
                  </span>
                )}
              </div>

              {getSessionDateRange(selectedSession) && (
                <p className="mt-2 text-sm text-gray-500">
                  {getSessionDateRange(selectedSession)}
                </p>
              )}

              <p className="mt-2 break-all text-xs text-gray-400">
                Session ID: {selectedSessionId}
              </p>
            </div>
          )}

          {!selectedSession && selectedSessionId && (
            <p className="mt-3 break-all text-xs text-gray-500">
              Selected session ID: {selectedSessionId}
            </p>
          )}
        </div>
      </section>

      {/* NOTICES */}

      {sessionError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{sessionError}</p>
        </div>
      )}

      {error && isSchoolAdministrator && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {assignmentError && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{assignmentError}</p>
        </div>
      )}

      {teacherRequestError && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{teacherRequestError}</p>
        </div>
      )}

      {successMessage && isSchoolAdministrator && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={20} />
          <p>{successMessage}</p>
        </div>
      )}

      {/* ASSESSMENT LIST */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-bold text-gray-900">
              Assessment Records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {visibleAssessments.length} assessment
              {visibleAssessments.length === 1 ? "" : "s"} visible
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={17} />

            {selectedSessionId
              ? "Selected academic session"
              : "No session selected"}
          </div>
        </div>

        {isPageLoading ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
            <RefreshCw
              size={30}
              className="animate-spin text-blue-600"
            />

            <p className="text-sm text-gray-500">
              {sessionsLoading
                ? "Loading academic sessions..."
                : teacherLoading
                  ? "Loading your teaching assignments and assessments..."
                  : "Loading assessments..."}
            </p>
          </div>
        ) : !selectedSessionId ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
              <CalendarDays size={35} />
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              {sessions.length === 0
                ? "No academic sessions found"
                : "Select an academic session"}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              {sessions.length === 0
                ? "Create an academic session before viewing assessment records."
                : "Choose an academic session above to load its assessment records."}
            </p>
          </div>
        ) : visibleAssessments.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
              <ClipboardList size={35} />
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              No assessments found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              {isTeacher
                ? "There are no assessments available for your assigned classes and subjects in this academic session."
                : "There are no assessments available for this academic session."}
            </p>

            <Link
              href={`${schoolUrl}/assessments/create`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Assessment
            </Link>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Assessment
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Type
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Total Marks
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Duration
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {visibleAssessments.map((assessment) => (
                    <tr
                      key={assessment._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <FileText size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {getAssessmentName(assessment)}
                            </p>

                            <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                              {assessment.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {assessment.assessmentType || "General"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {assessment.totalMarks ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getDuration(assessment)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          status={getAssessmentStatus(assessment)}
                        />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`${schoolUrl}/assessments/${assessment._id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View
                          <ArrowRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}

            <div className="divide-y divide-gray-100 md:hidden">
              {visibleAssessments.map((assessment) => (
                <div
                  key={assessment._id}
                  className="space-y-4 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FileText size={19} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {getAssessmentName(assessment)}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {assessment.assessmentType || "General"}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={getAssessmentStatus(assessment)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">
                        Total Marks
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {assessment.totalMarks ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Duration
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {getDuration(assessment)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Start Date
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {formatDate(getStartDate(assessment))}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        End Date
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {formatDate(getEndDate(assessment))}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`${schoolUrl}/assessments/${assessment._id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    View Assessment
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* FOOTER */}

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <p>Learnyfi School Assessment Management</p>

        <div className="flex items-center gap-2">
          <BookOpen size={15} />
          <span>Role-based Assessment Visibility</span>
        </div>
      </div>
    </main>
  );
}




