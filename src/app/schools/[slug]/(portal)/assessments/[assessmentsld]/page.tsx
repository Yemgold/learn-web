



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileQuestion,
  GraduationCap,
  Loader2,
  RefreshCw,
  ShieldAlert,
  User,
  Award,
  AlertCircle,
  ClipboardList,
  Hash,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

import {
  getAcademicSessions,
  type AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

import {
  getAllMyTeachingAssignments,
} from "@/lib/schools/portal/services/teaching.assignments";

import {
  getAssessmentById,
  getAssessmentsByClassAndSubject,
  getAssessmentsBySession,
} from "@/lib/schools/portal/services/assessment.service";

/* =========================================================
   TYPES
========================================================= */

type UserRole =
  | "OWNER"
  | "ADMIN"
  | "ADMINISTRATOR"
  | "TEACHER"
  | "STUDENT";

interface SubjectRecord {
  _id?: string;
  id?: string;
  subjectId?: string;
  subjectName?: string;
  name?: string;
}

interface ClassRecord {
  _id?: string;
  id?: string;
  classId?: string;
  className?: string;
  name?: string;
  subjects?: SubjectRecord[];
  subjectIds?: unknown[];
}

interface AssessmentRecord {
  _id: string;

  assessmentName?: string;
  title?: string;

  description?: string;

  status?: string;
  assessmentStatus?: string;
  publicationStatus?: string;

  isPublished?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;

  classId?: unknown;
  classIds?: unknown[];
  className?: string;
  class?: ClassRecord | null;

  subjectId?: unknown;
  subjectName?: string;
  subject?: SubjectRecord | null;

  academicSessionId?: unknown;

  teacherMembershipId?: unknown;

  assessmentType?: string;
  type?: string;

  durationMinutes?: number;
  duration?: number;

  totalMarks?: number;
  passMark?: number;

  questions?: unknown[];

  startsAt?: string;
  startDate?: string;
  endsAt?: string;
  endDate?: string;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;

  __assignmentPairs?: string[];

  [key: string]: unknown;
}

interface TeacherPermission {
  classId: string;
  subjectId: string;
}

interface TeachingAssignmentRecord {
  [key: string]: unknown;
}

interface SessionOption {
  id: string;
  name: string;
}

interface AssessmentContext {
  academicSessionId: string;
  classId: string;
  assignmentPairs?: string[];
}

/* =========================================================
   HELPERS
========================================================= */

function getId(value: unknown): string {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    const id =
      record._id ??
      record.id ??
      record.classId ??
      record.subjectId ??
      record.academicSessionId;

    if (typeof id === "string") return id;
  }

  return "";
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    const response = record.response as
      | {
          data?: {
            message?: unknown;
            error?: unknown;
          };
          status?: number;
        }
      | undefined;

    const backendMessage = response?.data?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage.map(String).join(", ");
    }

    if (
      typeof backendMessage === "string" &&
      backendMessage.trim()
    ) {
      return backendMessage;
    }

    const backendError = response?.data?.error;

    if (
      typeof backendError === "string" &&
      backendError.trim()
    ) {
      return backendError;
    }

    if (response?.status === 403) {
      return "You do not have permission to view this assessment.";
    }

    if (response?.status === 404) {
      return "The requested assessment could not be found.";
    }

    if (
      typeof record.message === "string" &&
      record.message.trim()
    ) {
      return record.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading the assessment.";
}

function unwrapResponse(response: unknown): unknown {
  let current = response;

  for (let i = 0; i < 6; i++) {
    if (!current || typeof current !== "object") break;

    const record = current as Record<string, unknown>;

    if (record.data !== undefined) {
      current = record.data;
      continue;
    }

    break;
  }

  return current;
}

function extractRecords(response: unknown): Record<string, unknown>[] {
  const unwrapped = unwrapResponse(response);

  if (Array.isArray(unwrapped)) {
    return unwrapped.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    );
  }

  if (!unwrapped || typeof unwrapped !== "object") {
    return [];
  }

  const record = unwrapped as Record<string, unknown>;

  const possibleKeys = [
    "assessments",
    "assessmentObj",
    "assessmentsObj",
    "assessmentList",
    "assessmentRecords",
    "assessment",
    "results",
    "items",
    "classes",
    "classesObj",
    "teachingAssignments",
    "teachingAssignmentObj",
    "assignments",
    "assignmentObj",
    "sessions",
    "sessionObj",
  ];

  for (const key of possibleKeys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      );
    }
  }

  return [];
}

function getSessionId(session: AcademicSession): string {
  return (
    session._id ||
    session.id ||
    session.academicSessionId ||
    ""
  );
}

function getSessionName(session: AcademicSession): string {
  return (
    session.sessionName ||
    session.name ||
    session.academicYear ||
    session.year ||
    session.title ||
    "Academic session"
  );
}

function getAssessmentName(
  assessment: AssessmentRecord,
): string {
  return (
    assessment.assessmentName ||
    assessment.title ||
    "Untitled assessment"
  );
}

function getAssessmentStatus(
  assessment: AssessmentRecord,
): string {
  const rawStatus =
    assessment.status ||
    assessment.assessmentStatus ||
    assessment.publicationStatus;

  if (typeof rawStatus === "string" && rawStatus.trim()) {
    return rawStatus.toUpperCase();
  }

  if (assessment.isPublished === true) return "PUBLISHED";
  if (assessment.isCompleted === true) return "COMPLETED";
  if (assessment.isActive === true) return "ACTIVE";

  return "NOT SPECIFIED";
}

function getStatusClasses(status: string): string {
  switch (status.toUpperCase()) {
    case "ACTIVE":
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "COMPLETED":
    case "CLOSED":
      return "bg-blue-50 text-blue-700 ring-blue-200";

    case "DRAFT":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "INACTIVE":
    case "CANCELLED":
      return "bg-slate-100 text-slate-600 ring-slate-200";

    default:
      return "bg-gray-100 text-gray-600 ring-gray-200";
  }
}

function formatDate(value?: string): string {
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

function formatDateTime(value?: string): string {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDuration(assessment: AssessmentRecord): string {
  const duration =
    assessment.durationMinutes ??
    assessment.duration;

  if (typeof duration !== "number" || duration <= 0) {
    return "Not specified";
  }

  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return minutes
      ? `${hours} hr ${minutes} min`
      : `${hours} hr`;
  }

  return `${duration} minutes`;
}

function getClassId(assessment: AssessmentRecord): string {
  return (
    getId(assessment.classId) ||
    getId(assessment.class)
  );
}

function getSubjectId(assessment: AssessmentRecord): string {
  return (
    getId(assessment.subjectId) ||
    getId(assessment.subject)
  );
}

function getAcademicSessionId(
  assessment: AssessmentRecord,
): string {
  return getId(assessment.academicSessionId);
}

function getAssessmentClassIds(
  assessment: AssessmentRecord,
): string[] {
  const ids: string[] = [];

  if (Array.isArray(assessment.classIds)) {
    assessment.classIds.forEach((item) => {
      const id = getId(item);
      if (id) ids.push(id);
    });
  }

  const classId = getClassId(assessment);

  if (classId) ids.push(classId);

  return [...new Set(ids)];
}

function extractAssignmentClassId(
  assignment: TeachingAssignmentRecord,
): string {
  const direct = getId(assignment.classId);

  if (direct) return direct;

  const nestedClass = assignment.class;

  if (nestedClass && typeof nestedClass === "object") {
    return getId(nestedClass);
  }

  return "";
}

function extractAssignmentSubjects(
  assignment: TeachingAssignmentRecord,
): string[] {
  const result: string[] = [];

  const directSubjects =
    assignment.subjects ??
    assignment.subjectIds;

  if (Array.isArray(directSubjects)) {
    directSubjects.forEach((item) => {
      const id = getId(item);
      if (id) result.push(id);
    });
  }

  const nestedClass = assignment.class;

  if (nestedClass && typeof nestedClass === "object") {
    const classRecord = nestedClass as ClassRecord;

    const subjects =
      classRecord.subjects ??
      classRecord.subjectIds;

    if (Array.isArray(subjects)) {
      subjects.forEach((item) => {
        const id = getId(item);
        if (id) result.push(id);
      });
    }
  }

  return [...new Set(result)];
}

function buildTeacherPermissions(
  assignments: TeachingAssignmentRecord[],
): TeacherPermission[] {
  const permissions = new Map<string, TeacherPermission>();

  assignments.forEach((assignment) => {
    const classId = extractAssignmentClassId(assignment);
    const subjectIds = extractAssignmentSubjects(assignment);

    if (!classId) return;

    subjectIds.forEach((subjectId) => {
      const key = `${classId}:${subjectId}`;

      permissions.set(key, {
        classId,
        subjectId,
      });
    });
  });

  return [...permissions.values()];
}

function canTeacherViewAssessment(
  assessment: AssessmentRecord,
  permissions: TeacherPermission[],
): boolean {
  const classIds = getAssessmentClassIds(assessment);
  const subjectId = getSubjectId(assessment);

  if (classIds.length > 0 && subjectId) {
    return permissions.some(
      (permission) =>
        classIds.includes(permission.classId) &&
        permission.subjectId === subjectId,
    );
  }

  if (Array.isArray(assessment.__assignmentPairs)) {
    return assessment.__assignmentPairs.length > 0;
  }

  return false;
}

function deduplicateAssessments(
  assessments: AssessmentRecord[],
): AssessmentRecord[] {
  const map = new Map<string, AssessmentRecord>();

  assessments.forEach((assessment) => {
    if (!assessment._id) return;

    const existing = map.get(assessment._id);

    if (!existing) {
      map.set(assessment._id, assessment);
      return;
    }

    map.set(assessment._id, {
      ...existing,
      ...assessment,
      __assignmentPairs: [
        ...(existing.__assignmentPairs || []),
        ...(assessment.__assignmentPairs || []),
      ],
    });
  });

  return [...map.values()];
}

/* =========================================================
   UI COMPONENTS
========================================================= */

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        <Icon size={17} />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="break-words text-base font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
        <Icon size={19} />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AssessmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = String(params.slug || "");

  const assessmentId = String(
    params.assessmentsld ||
    params.assessmentId ||
    "",
  );

  const requestedSessionId =
    searchParams.get("academicSessionId") || "";

  const requestedClassId =
    searchParams.get("classId") || "";

  const requestedSubjectId =
    searchParams.get("subjectId") || "";

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolSubdomain = useMemo(
    () =>
      String(
        user?.schoolContext?.subDomain ||
        slug,
      ).trim().toLowerCase(),
    [user, slug],
  );

  const role = String(
    user?.schoolContext?.userSchoolMembership?.role ||
    "",
  ).toUpperCase() as UserRole;

  const isAdmin = [
    "OWNER",
    "ADMIN",
    "ADMINISTRATOR",
  ].includes(role);

  const isTeacher = role === "TEACHER";

  const schoolUrl = `/schools/${slug}`;

  const [assessment, setAssessment] =
    useState<AssessmentRecord | null>(null);

  const [sessions, setSessions] =
    useState<SessionOption[]>([]);

  const [selectedSessionId, setSelectedSessionId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const [notFound, setNotFound] = useState(false);

  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [refreshVersion, setRefreshVersion] = useState(0);

  /* =====================================================
     LOAD ASSESSMENT CONTEXT
  ===================================================== */

  const loadAssessment = useCallback(async () => {
    if (!assessmentId) {
      setError("Assessment ID is missing from the URL.");
      setLoading(false);
      return;
    }

    if (!schoolSubdomain) {
      setError("School subdomain could not be identified.");
      setLoading(false);
      return;
    }

    if (!isAdmin && !isTeacher) {
      setError(
        "You do not have permission to view assessment details.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setWarning("");
    setNotFound(false);
    setAssessment(null);
    setClassName("");
    setSubjectName("");

    try {
      /* ---------------------------------------------
         1. LOAD ACADEMIC SESSIONS
      --------------------------------------------- */

      const sessionsResponse =
        await getAcademicSessions(schoolSubdomain);

      const sessionRecords =
        extractRecords(sessionsResponse) as AcademicSession[];

      const sessionOptions = sessionRecords
        .map((session) => ({
          id: getSessionId(session),
          name: getSessionName(session),
        }))
        .filter((session) => session.id);

      setSessions(sessionOptions);

      if (sessionOptions.length === 0) {
        throw new Error(
          "No academic sessions were found for this school.",
        );
      }

      const availableSessionIds = sessionOptions.map(
        (session) => session.id,
      );

      const sessionIdsToSearch = requestedSessionId
        ? [requestedSessionId]
        : selectedSessionId &&
            availableSessionIds.includes(selectedSessionId)
          ? [selectedSessionId]
          : sessionOptions.map((session) => session.id);

      /* ---------------------------------------------
         2. FIND THE ASSESSMENT RECORD
      --------------------------------------------- */

      let matchingAssessment: AssessmentRecord | null = null;

      let matchingContext: AssessmentContext | null = null;

      const searchErrors: string[] = [];

      if (isAdmin) {
        for (const sessionId of sessionIdsToSearch) {
          try {
            const response = await getAssessmentsBySession(
              sessionId,
              schoolSubdomain,
            );

            const records = extractRecords(response);

            const found = records.find(
              (record) =>
                getId(record._id) === assessmentId,
            );

            if (found) {
              const normalized = {
                ...found,
                _id: getId(found._id),
              } as AssessmentRecord;

              matchingAssessment = normalized;

              matchingContext = {
                academicSessionId: sessionId,
                classId:
                  requestedClassId ||
                  getClassId(normalized) ||
                  getAssessmentClassIds(normalized)[0] ||
                  "",
              };

              break;
            }
          } catch (requestError) {
            searchErrors.push(
              getErrorMessage(requestError),
            );
          }
        }
      }

      /* ---------------------------------------------
         3. TEACHER ASSIGNED CLASS/SUBJECT SEARCH
      --------------------------------------------- */

      if (!matchingAssessment && isTeacher) {
        const assignmentResponse =
          await getAllMyTeachingAssignments(
            requestedSessionId ||
              sessionIdsToSearch[0],
            schoolSubdomain,
          );

        const assignmentRecords =
          extractRecords(assignmentResponse) as TeachingAssignmentRecord[];

        const permissions =
          buildTeacherPermissions(assignmentRecords);

        if (permissions.length === 0) {
          throw new Error(
            "No active teaching assignments were found for this teacher.",
          );
        }

        const sessionSearchList = requestedSessionId
          ? [requestedSessionId]
          : sessionIdsToSearch;

        for (const sessionId of sessionSearchList) {
          const eligiblePermissions = permissions
            .filter((permission) =>
              requestedClassId
                ? permission.classId === requestedClassId
                : true,
            )
            .filter((permission) =>
              requestedSubjectId
                ? permission.subjectId === requestedSubjectId
                : true,
            );

          const results = await Promise.allSettled(
            eligiblePermissions.map(async (permission) => {
              const response =
                await getAssessmentsByClassAndSubject(
                  sessionId,
                  permission.classId,
                  permission.subjectId,
                  schoolSubdomain,
                );

              return {
                response,
                permission,
                sessionId,
              };
            }),
          );

          const records: AssessmentRecord[] = [];

          results.forEach((result) => {
            if (result.status !== "fulfilled") {
              searchErrors.push(
                getErrorMessage(result.reason),
              );
              return;
            }

            const {
              response,
              permission,
              sessionId: resultSessionId,
            } = result.value;

            const foundRecords = extractRecords(response);

            foundRecords.forEach((record) => {
              const normalized = {
                ...record,
                _id: getId(record._id),
                __assignmentPairs: [
                  `${permission.classId}:${permission.subjectId}`,
                ],
              } as AssessmentRecord;

              if (normalized._id) {
                records.push(normalized);
              }
            });

            const found = records.find(
              (record) => record._id === assessmentId,
            );

            if (found && !matchingAssessment) {
              matchingAssessment = found;

              matchingContext = {
                academicSessionId: resultSessionId,
                classId: permission.classId,
                assignmentPairs: [
                  `${permission.classId}:${permission.subjectId}`,
                ],
              };
            }
          });

          if (matchingAssessment) break;
        }
      }

      /* ---------------------------------------------
         4. CHECK WHETHER ASSESSMENT WAS FOUND
      --------------------------------------------- */

      if (!matchingAssessment || !matchingContext) {
        if (searchErrors.length > 0) {
          throw new Error(
            searchErrors[0] ||
              "Unable to search for this assessment.",
          );
        }

        setNotFound(true);

        throw new Error(
          "This assessment could not be found in the available academic sessions or assigned classes.",
        );
      }

      if (!matchingContext.classId) {
        throw new Error(
          "The assessment was found, but its class ID is missing. The assessment detail endpoint requires a class ID.",
        );
      }

      /* ---------------------------------------------
         5. FETCH FULL ASSESSMENT DETAILS
      --------------------------------------------- */

      const detailResponse = await getAssessmentById(
        matchingContext.academicSessionId,
        matchingContext.classId,
        assessmentId,
        schoolSubdomain,
      );

      const detailData = unwrapResponse(detailResponse);

      let detailRecord: Record<string, unknown> | null = null;

      if (
        detailData &&
        typeof detailData === "object" &&
        !Array.isArray(detailData)
      ) {
        const possibleRecord = detailData as Record<
          string,
          unknown
        >;

        const nestedAssessment =
          possibleRecord.assessment ||
          possibleRecord.assessmentObj ||
          possibleRecord.assessmentDetails;

        if (
          nestedAssessment &&
          typeof nestedAssessment === "object" &&
          !Array.isArray(nestedAssessment)
        ) {
          detailRecord =
            nestedAssessment as Record<string, unknown>;
        } else {
          detailRecord = possibleRecord;
        }
      }

      if (!detailRecord) {
        throw new Error(
          "The assessment details response was empty or invalid.",
        );
      }

      const finalAssessment = {
        ...matchingAssessment,
        ...detailRecord,
        _id:
          getId(detailRecord._id) ||
          matchingAssessment._id,
        __assignmentPairs:
          matchingAssessment.__assignmentPairs,
      } as AssessmentRecord;

      setAssessment(finalAssessment);

      setSelectedSessionId(
        matchingContext.academicSessionId,
      );

      if (searchErrors.length > 0) {
        setWarning(
          "Some assessment searches failed, but the requested assessment was loaded successfully.",
        );
      }

      /* ---------------------------------------------
         6. CLASS AND SUBJECT LABELS
      --------------------------------------------- */

      setClassName(
        finalAssessment.className ||
        finalAssessment.class?.className ||
        finalAssessment.class?.name ||
        "",
      );

      setSubjectName(
        finalAssessment.subjectName ||
        finalAssessment.subject?.subjectName ||
        finalAssessment.subject?.name ||
        "",
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [
    assessmentId,
    schoolSubdomain,
    isAdmin,
    isTeacher,
    requestedSessionId,
    requestedClassId,
    requestedSubjectId,
    selectedSessionId,
    refreshVersion,
  ]);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    if (!isHydrated) return;

    void loadAssessment();
  }, [isHydrated, loadAssessment]);

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshVersion((current) => current + 1);
  };

  /* =====================================================
     DERIVED VALUES
  ===================================================== */

  const assessmentName = assessment
    ? getAssessmentName(assessment)
    : "Assessment details";

  const assessmentStatus = assessment
    ? getAssessmentStatus(assessment)
    : "NOT SPECIFIED";

  const sessionName = useMemo(
    () =>
      sessions.find(
        (session) => session.id === selectedSessionId,
      )?.name || "Not specified",
    [sessions, selectedSessionId],
  );

  const questionCount = Array.isArray(assessment?.questions)
    ? assessment.questions.length
    : 0;

  const totalMarks =
    typeof assessment?.totalMarks === "number"
      ? assessment.totalMarks
      : 0;

  const passMark =
    typeof assessment?.passMark === "number"
      ? assessment.passMark
      : 0;

  const duration = assessment
    ? getDuration(assessment)
    : "Not specified";

  const assessmentType =
    assessment?.assessmentType ||
    assessment?.type ||
    "Not specified";

  const description =
    typeof assessment?.description === "string"
      ? assessment.description
      : "";

  const displayedClass =
    className ||
    assessment?.className ||
    (assessment ? getClassId(assessment) : "") ||
    "Not specified";

  const displayedSubject =
    subjectName ||
    assessment?.subjectName ||
    (assessment ? getSubjectId(assessment) : "") ||
    "Not specified";

  /* =====================================================
     RENDER: HYDRATION
  ===================================================== */

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={22} />
          <span>Preparing assessment details...</span>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER: LOADING
  ===================================================== */

  if (loading && !assessment) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Loader2
          size={36}
          className="animate-spin text-indigo-600"
        />

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Loading assessment
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          Please wait while we retrieve the assessment
          information.
        </p>
      </div>
    );
  }

  /* =====================================================
     RENDER: ERROR
  ===================================================== */

  if (error && !assessment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href={`${schoolUrl}/assessments`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to assessments
        </Link>

        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            {notFound ? (
              <FileQuestion size={25} />
            ) : (
              <ShieldAlert size={25} />
            )}
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            {notFound
              ? "Assessment not found"
              : "Unable to load assessment"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {refreshing ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={16} />
              )}

              Try again
            </button>

            <Link
              href={`${schoolUrl}/assessments`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to assessments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER: DETAILS
  ===================================================== */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`${schoolUrl}/assessments`}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to assessments
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Assessment details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View assessment information, schedule, marks
            and questions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <RefreshCw size={17} />
          )}

          Refresh
        </button>
      </div>

      {/* WARNING */}

      {warning && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p>{warning}</p>
        </div>
      )}

      {/* ASSESSMENT TITLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
                <ClipboardList size={27} />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                  {assessmentName}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Assessment ID: {assessment?._id}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(assessmentStatus)}`}
            >
              {assessmentStatus.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div className="p-5 sm:p-7">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Description
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {description ||
              "No description provided for this assessment."}
          </p>
        </div>
      </div>

      {/* SUMMARY DETAILS */}

      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Assessment overview
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailCard
            icon={Award}
            label="Total marks"
            value={totalMarks}
          />

          <DetailCard
            icon={CheckCircle2}
            label="Pass mark"
            value={passMark}
          />

          <DetailCard
            icon={Clock}
            label="Duration"
            value={duration}
          />

          <DetailCard
            icon={FileQuestion}
            label="Total questions"
            value={questionCount}
          />
        </div>
      </section>

      {/* ACADEMIC INFORMATION */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={GraduationCap}
          title="Academic information"
          description="The class, subject and academic session associated with this assessment."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Academic session
            </p>

            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <CalendarDays
                size={17}
                className="text-indigo-500"
              />
              {sessionName}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Class
            </p>

            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <GraduationCap
                size={17}
                className="text-indigo-500"
              />
              {displayedClass}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Subject
            </p>

            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <BookOpen
                size={17}
                className="text-indigo-500"
              />
              {displayedSubject}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Assessment type
            </p>

            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Hash
                size={17}
                className="text-indigo-500"
              />
              {assessmentType.replaceAll("_", " ")}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Teacher membership ID
            </p>

            <p className="mt-2 flex items-center gap-2 break-all text-sm font-semibold text-slate-800">
              <User
                size={17}
                className="shrink-0 text-indigo-500"
              />
              {getId(assessment?.teacherMembershipId) ||
                "Not specified"}
            </p>
          </div>
        </div>
      </section>

      {/* SCHEDULE */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={CalendarDays}
          title="Assessment schedule"
          description="The assessment's scheduled start and end dates."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Start date
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {formatDateTime(
                assessment?.startsAt ||
                assessment?.startDate,
              )}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              End date
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {formatDateTime(
                assessment?.endsAt ||
                assessment?.endDate,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* QUESTIONS */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={FileQuestion}
          title="Assessment questions"
          description="Questions currently attached to this assessment."
        />

        {questionCount === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <FileQuestion
              size={30}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-3 font-semibold text-slate-800">
              No questions available
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No questions were returned for this assessment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-3">
              <span className="text-sm font-medium text-indigo-800">
                Questions attached
              </span>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
                {questionCount}
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-500">
              The assessment contains {questionCount} question
              {questionCount === 1 ? "" : "s"}. The question
              content is not displayed in this overview.
            </p>
          </div>
        )}
      </section>

      {/* RECORD INFORMATION */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={Hash}
          title="Record information"
          description="Assessment creation and modification information."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created at
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {formatDate(assessment?.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Last updated
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {formatDate(assessment?.updatedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Published at
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {formatDate(assessment?.publishedAt)}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Learnyfi School Assessment Management
        </p>

        <Link
          href={`${schoolUrl}/assessments`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Return to assessments
        </Link>
      </div>
    </div>
  );
}
