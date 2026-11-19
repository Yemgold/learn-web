






import type {
  AcademicSessionOption,
  Enrollment,
  EnrollmentCount,
} from "@/types/schools/enrollment.types";

/* =========================================================
   OBJECT HELPERS
========================================================= */

export function getObjectId(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;

    if (typeof item._id === "string") return item._id;
    if (typeof item.id === "string") return item.id;
  }

  return "";
}

export function getObjectName(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;

    if (typeof item.className === "string") return item.className;
    if (typeof item.name === "string") return item.name;
    if (typeof item.sessionName === "string") return item.sessionName;
    if (typeof item.periodName === "string") return item.periodName;

    if (typeof item.firstName === "string") {
      return `${item.firstName} ${
        typeof item.lastName === "string" ? item.lastName : ""
      }`.trim();
    }

    // Handle populated user membership objects.
    if (item.userId && typeof item.userId === "object") {
      return getObjectName(item.userId);
    }
  }

  return "";
}

/* =========================================================
   ENROLLMENT STUDENT HELPERS
========================================================= */

export function getStudentName(enrollment: Enrollment): string {
  if (enrollment.student) {
    const fullName = `${enrollment.student.firstName || ""} ${
      enrollment.student.lastName || ""
    }`.trim();

    if (fullName) return fullName;
  }

  return (
    getObjectName(enrollment.studentId) ||
    "Student information unavailable"
  );
}

export function getStudentEmail(enrollment: Enrollment): string {
  if (enrollment.student?.email) {
    return enrollment.student.email;
  }

  if (
    enrollment.studentId &&
    typeof enrollment.studentId === "object" &&
    typeof enrollment.studentId.email === "string"
  ) {
    return enrollment.studentId.email;
  }

  return "";
}

/* =========================================================
   ENROLLMENT ID HELPERS
========================================================= */

export function getEnrollmentId(enrollment: Enrollment): string {
  return enrollment._id || enrollment.id || "";
}

/**
 * Extracts schoolMembershipId from an enrollment.
 *
 * Supports:
 * - schoolMembershipId: "membership-id"
 * - schoolMembershipId: { _id: "membership-id" }
 */
export function getEnrollmentMembershipId(
  enrollment: Enrollment
): string {
  const record = enrollment as Enrollment & {
    schoolMembershipId?: unknown;
  };

  return getObjectId(record.schoolMembershipId);
}

/* =========================================================
   STATUS COLORS
========================================================= */

export function getStatusColor(status?: string): string {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "WITHDRAWN":
      return "bg-red-50 text-red-700 border-red-200";

    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "TRANSFERRED":
      return "bg-violet-50 text-violet-700 border-violet-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

/* =========================================================
   DATE
========================================================= */

export function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   ACADEMIC SESSION EXTRACTION
========================================================= */

export function extractAcademicSessions(
  value: unknown
): AcademicSessionOption[] {
  if (Array.isArray(value)) {
    return value
      .map((item): AcademicSessionOption | null => {
        if (!item || typeof item !== "object") return null;

        const session = item as Record<string, unknown>;

        const id =
          typeof session._id === "string"
            ? session._id
            : typeof session.id === "string"
              ? session.id
              : typeof session.academicSessionId === "string"
                ? session.academicSessionId
                : "";

        const name =
          typeof session.sessionName === "string"
            ? session.sessionName
            : typeof session.name === "string"
              ? session.name
              : typeof session.academicYear === "string"
                ? session.academicYear
                : "";

        if (!id || !name) return null;

        const option: AcademicSessionOption = {
          _id: id,
          sessionName: name,
        };

        if (typeof session.status === "string") {
          option.status = session.status;
        }

        if (typeof session.periodType === "string") {
          option.periodType = session.periodType;
        }

        return option;
      })
      .filter(
        (item): item is AcademicSessionOption => item !== null
      );
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const result = value as Record<string, unknown>;

  const candidates = [
    result.sessions,
    result.sessionObj,
    result.academicSessions,
    result.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const sessions = extractAcademicSessions(candidate);

      if (sessions.length) return sessions;
    }

    if (candidate && typeof candidate === "object") {
      const sessions = extractAcademicSessions(candidate);

      if (sessions.length) return sessions;
    }
  }

  return [];
}

/* =========================================================
   ENROLLMENT EXTRACTION
========================================================= */

export function extractEnrollments(value: unknown): Enrollment[] {
  if (Array.isArray(value)) {
    return value as Enrollment[];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const result = value as Record<string, unknown>;

  // Exact property names returned by the backend,
  // including the British spelling in studentEnrolmentObj.
  const candidates = [
    result.studentEnrolmentObj,
    result.studentEnrollmentObj,
    result.enrollmentObj,
    result.enrollmentsObj,
    result.studentEnrollments,
    result.enrollments,
    result.results,
    result.items,
    result.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as Enrollment[];
    }

    if (candidate && typeof candidate === "object") {
      const nested = extractEnrollments(candidate);

      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
}

/* =========================================================
   ENROLLMENT COUNTS
========================================================= */

export function extractEnrollmentCount(
  value: unknown
): EnrollmentCount {
  if (!value || typeof value !== "object") {
    return {};
  }

  const result = value as Record<string, unknown>;

  if (result.data && typeof result.data === "object") {
    return extractEnrollmentCount(result.data);
  }

  if (result.counts && typeof result.counts === "object") {
    return result.counts as EnrollmentCount;
  }

  return result as EnrollmentCount;
}

export function getBackendEnrollmentCount(
  counts: EnrollmentCount
): number | null {
  if (typeof counts.count === "number") return counts.count;

  if (typeof counts.totalCount === "number") {
    return counts.totalCount;
  }

  if (typeof counts.enrollmentCount === "number") {
    return counts.enrollmentCount;
  }

  return null;
}
