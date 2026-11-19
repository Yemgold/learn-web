



import { apiClient } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

export interface AssignTeacherSubjectPayload {
  teacherMembershipId: string;
  academicSessionId: string;
  classId: string;
  subjectId: string;
}

export interface TeachingAssignment {
  _id: string;
  teacherMembershipId?: string;
  academicSessionId?: string;
  teacherId?: string;
  classId: string;
  subjectId: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  teacher?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  class?: {
    _id: string;
    className?: string;
    classCode?: string;
  };

  subject?: {
    _id: string;
    subjectName?: string;
    subjectCode?: string;
  };

  [key: string]: unknown;
}

export interface TeachingAssignmentResponse {
  success: boolean;
  message?: string;
  data?: TeachingAssignment | TeachingAssignment[];
}

export interface TeachingAssignmentSubject {
  _id: string;
  subjectName: string;
  subjectCode: string;
}

export interface TeachingAssignmentClass {
  _id: string;
  className: string;
  classCode: string;
  subjects: TeachingAssignmentSubject[];
}

/* =========================================================
   HELPERS
========================================================= */

const getSchoolRequestConfig = (schoolSubdomain: string) => {
  const subdomain = schoolSubdomain.trim().toLowerCase();

  if (!subdomain) {
    throw new Error("School subdomain is required.");
  }

  return {
    headers: {
      "x-school-subdomain": subdomain,
    },
  };
};

const isRecord = (
  value: unknown
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};

const unwrapResponse = <T>(response: unknown): T => {
  let result = response;

  // Unwrap Axios response if present.
  if (isRecord(result) && "data" in result) {
    result = result.data;
  }

  // Unwrap backend response envelope.
  if (isRecord(result)) {
    if (result.success === false) {
      throw new Error(
        typeof result.message === "string"
          ? result.message
          : "Teaching assignment request failed."
      );
    }

    if ("data" in result && result.data !== undefined) {
      result = result.data;
    }
  }

  return result as T;
};

const validateRequiredIds = (
  values: Record<string, string>
): void => {
  for (const [field, value] of Object.entries(values)) {
    if (!value?.trim()) {
      throw new Error(`${field} is required.`);
    }
  }
};

/* =========================================================
   1. ASSIGN TEACHER TO A CLASS SUBJECT

   POST:
   /school/teaching-assignments/assign-teacher-subject-in-a-class

   Required MongoDB IDs:
   - teacherMembershipId
   - academicSessionId
   - classId
   - subjectId
========================================================= */

export const assignTeacherSubjectInClass = async (
  payload: AssignTeacherSubjectPayload,
  schoolSubdomain: string
): Promise<TeachingAssignment> => {
  const {
    teacherMembershipId,
    academicSessionId,
    classId,
    subjectId,
  } = payload;

  if (!teacherMembershipId?.trim()) {
    throw new Error("Teacher membership ID is required.");
  }

  if (!academicSessionId?.trim()) {
    throw new Error("Academic session ID is required.");
  }

  if (!classId?.trim()) {
    throw new Error("Class ID is required.");
  }

  if (!subjectId?.trim()) {
    throw new Error("Subject ID is required.");
  }

  const response = await apiClient.post(
    "/school/teaching-assignments/assign-teacher-subject-in-a-class",
    {
      teacherMembershipId,
      academicSessionId,
      classId,
      subjectId,
    },
    getSchoolRequestConfig(schoolSubdomain)
  );

  return unwrapResponse<TeachingAssignment>(response);
};

/* =========================================================
   2. DEACTIVATE TEACHING ASSIGNMENT

   PATCH:
   /school/teaching-assignments/deactivate-teaching-assignment/{assignmentId}/deactivate
========================================================= */

export const deactivateTeachingAssignment = async (
  assignmentId: string,
  schoolSubdomain: string
): Promise<unknown> => {
  if (!assignmentId?.trim()) {
    throw new Error("Teaching assignment ID is required.");
  }

  const response = await apiClient.patch(
    `/school/teaching-assignments/deactivate-teaching-assignment/${encodeURIComponent(
      assignmentId
    )}/deactivate`,
    {},
    getSchoolRequestConfig(schoolSubdomain)
  );

  return unwrapResponse<unknown>(response);
};

/* =========================================================
   3. GET TEACHING ASSIGNMENT BY ID

   GET:
   /school/teaching-assignments/get-teacher-assignment-by-assignmentId/{assignmentId}
========================================================= */

export const getTeachingAssignmentById = async (
  assignmentId: string,
  schoolSubdomain: string
): Promise<TeachingAssignment> => {
  if (!assignmentId?.trim()) {
    throw new Error("Teaching assignment ID is required.");
  }

  const response = await apiClient.get(
    `/school/teaching-assignments/get-teacher-assignment-by-assignmentId/${encodeURIComponent(
      assignmentId
    )}`,
    getSchoolRequestConfig(schoolSubdomain)
  );

  return unwrapResponse<TeachingAssignment>(response);
};

/* =========================================================
   4. GET CURRENT TEACHER'S ASSIGNMENTS

========================================================= */

export const getAllMyTeachingAssignments = async (
  academicSessionId: string,
  schoolSubdomain: string
): Promise<TeachingAssignmentClass[]> => {
  validateRequiredIds({ academicSessionId });

  const response = await apiClient.get(
    `school/teaching-assignments/get-all-my-teaching-assignments/${encodeURIComponent(
      academicSessionId
    )}`,
    getSchoolRequestConfig(schoolSubdomain)
  );

  const result = unwrapResponse<unknown>(response);

  return Array.isArray(result)
    ? (result as TeachingAssignmentClass[])
    : [];
};
