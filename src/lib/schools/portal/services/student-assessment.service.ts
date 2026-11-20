



import { apiClient } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

export type StudentAssessmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ACTIVE"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED"
  | "EXPIRED";

export interface StudentAssessment {
  _id: string;
  assessmentName?: string;
  title?: string;
  description?: string;
  instructions?: string;
  assessmentType?: string;
  status?: StudentAssessmentStatus | string;
  totalMarks?: number;
  passMark?: number;
  duration?: number;
  durationMinutes?: number;
  startDate?: string;
  endDate?: string;
  startsAt?: string;
  endsAt?: string;
  questionCount?: number;
  totalQuestions?: number;
  [key: string]: unknown;
}

export interface StudentAssessmentQuestion {
  _id?: string;
  id?: string;
  questionId?: string;
  questionText?: string;
  question?: string;
  questionType?: string;
  options?: unknown[];
  marks?: number;
  points?: number;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface StudentAssessmentAnswer {
  questionId: string;
  answer: string | string[] | number | boolean;
}

export interface StudentAssessmentAttempt {
  _id: string;
  attemptId?: string;
  assessmentId?: string;
  studentId?: string;
  status?: string;
  answers?: StudentAssessmentAnswer[];
  questions?: StudentAssessmentQuestion[];
  startedAt?: string;
  submittedAt?: string;
  remainingTime?: number;
  score?: number;
  totalMarks?: number;
  [key: string]: unknown;
}

export interface SaveStudentAnswersPayload {
  answers: StudentAssessmentAnswer[];
}

export interface StudentAssessmentListParams {
  academicSessionId: string;
  classId: string;
  subjectId: string;
  schoolSubdomain: string;
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeSubdomain(subdomain: string): string {
  const normalized = subdomain.trim().toLowerCase();

  if (!normalized) {
    throw new Error("School subdomain is required.");
  }

  return normalized;
}

function validateId(value: string, fieldName: string): string {
  const id = value?.trim();

  if (!id) {
    throw new Error(`${fieldName} is required.`);
  }

  return encodeURIComponent(id);
}

function getRequestConfig(schoolSubdomain: string) {
  return {
    headers: {
      "x-school-subdomain": normalizeSubdomain(schoolSubdomain),
    },
  };
}

/**
 * Axios responses are unwrapped while preserving the backend
 * response envelope when necessary.
 */
function unwrapResponse<T>(response: unknown): T {
  let result = response as Record<string, unknown>;

  if (
    result &&
    typeof result === "object" &&
    "data" in result
  ) {
    result = result.data as Record<string, unknown>;
  }

  if (
    result &&
    typeof result === "object" &&
    "success" in result &&
    result.success === false
  ) {
    throw new Error(
      typeof result.message === "string"
        ? result.message
        : "The assessment request failed.",
    );
  }

  if (
    result &&
    typeof result === "object" &&
    "data" in result
  ) {
    return result.data as T;
  }

  return result as T;
}

/* =========================================================
   1. LIST AVAILABLE ASSESSMENTS
========================================================= */

/**
 * GET
 * /school/assessments/get-all-assessments-of-class-subject-in-a-session/
 * {academicSessionId}/{classId}/{subjectId}
 */
export async function getStudentAssessments(
  params: StudentAssessmentListParams,
): Promise<StudentAssessment[]> {
  const academicSessionId = validateId(
    params.academicSessionId,
    "Academic session ID",
  );

  const classId = validateId(params.classId, "Class ID");

  const subjectId = validateId(params.subjectId, "Subject ID");

  const response = await apiClient.get(
    `/school/assessments/get-all-assessments-of-class-subject-in-a-session/${academicSessionId}/${classId}/${subjectId}`,
    getRequestConfig(params.schoolSubdomain),
  );

  const data = unwrapResponse<unknown>(response);

  if (Array.isArray(data)) {
    return data as StudentAssessment[];
  }

  if (data && typeof data === "object") {
    const result = data as Record<string, unknown>;

    const possibleLists = [
      result.assessmentObj,
      result.assessments,
      result.assessmentsObj,
      result.assessmentList,
      result.items,
      result.results,
    ];

    for (const list of possibleLists) {
      if (Array.isArray(list)) {
        return list as StudentAssessment[];
      }
    }

    if (result._id) {
      return [result as unknown as StudentAssessment];
    }
  }

  return [];
}

/* =========================================================
   2. GET ASSESSMENT DETAILS
========================================================= */

/**
 * GET
 * /school/assessments/get-assessment-by-assessmentId-classId-academicSessionId/
 * {academicSessionId}/{classId}/{assessmentId}
 */
export async function getStudentAssessmentDetails(
  academicSessionId: string,
  classId: string,
  assessmentId: string,
  schoolSubdomain: string,
): Promise<StudentAssessment> {
  const sessionId = validateId(
    academicSessionId,
    "Academic session ID",
  );

  const validClassId = validateId(classId, "Class ID");

  const validAssessmentId = validateId(
    assessmentId,
    "Assessment ID",
  );

  const response = await apiClient.get(
    `/school/assessments/get-assessment-by-assessmentId-classId-academicSessionId/${sessionId}/${validClassId}/${validAssessmentId}`,
    getRequestConfig(schoolSubdomain),
  );

  return unwrapResponse<StudentAssessment>(response);
}

/* =========================================================
   3. START ASSESSMENT
========================================================= */

/**
 * GET
 * /school/assessments/start-assessment/
 * {academicSessionId}/{classId}/{assessmentId}
 *
 * Expected to start an attempt and return questions.
 */
export async function startStudentAssessment(
  academicSessionId: string,
  classId: string,
  assessmentId: string,
  schoolSubdomain: string,
): Promise<StudentAssessmentAttempt> {
  const sessionId = validateId(
    academicSessionId,
    "Academic session ID",
  );

  const validClassId = validateId(classId, "Class ID");

  const validAssessmentId = validateId(
    assessmentId,
    "Assessment ID",
  );

  const response = await apiClient.get(
    `/school/assessments/start-assessment/${sessionId}/${validClassId}/${validAssessmentId}`,
    getRequestConfig(schoolSubdomain),
  );

  return unwrapResponse<StudentAssessmentAttempt>(response);
}

/* =========================================================
   4. RETRIEVE EXISTING ATTEMPT
========================================================= */

/**
 * GET
 * /school-assessment-attempts/{attemptId}
 */
export async function getStudentAssessmentAttempt(
  attemptId: string,
  schoolSubdomain: string,
): Promise<StudentAssessmentAttempt> {
  const validAttemptId = validateId(
    attemptId,
    "Assessment attempt ID",
  );

  const response = await apiClient.get(
    `/school-assessment-attempts/${validAttemptId}`,
    getRequestConfig(schoolSubdomain),
  );

  return unwrapResponse<StudentAssessmentAttempt>(response);
}

/* =========================================================
   5. SAVE ANSWERS
========================================================= */

/**
 * PATCH
 * /school-assessment-attempts/{attemptId}/answers
 *
 * NOTE:
 * Confirm the exact backend request body before using this
 * payload in the live assessment page.
 */
export async function saveStudentAssessmentAnswers(
  attemptId: string,
  payload: SaveStudentAnswersPayload,
  schoolSubdomain: string,
): Promise<unknown> {
  const validAttemptId = validateId(
    attemptId,
    "Assessment attempt ID",
  );

  const response = await apiClient.patch(
    `/school-assessment-attempts/${validAttemptId}/answers`,
    payload,
    getRequestConfig(schoolSubdomain),
  );

  return unwrapResponse<unknown>(response);
}

/* =========================================================
   6. SUBMIT ASSESSMENT
========================================================= */

/**
 * POST
 * /school-assessment-attempts/{attemptId}/submit
 */
export async function submitStudentAssessment(
  attemptId: string,
  schoolSubdomain: string,
): Promise<unknown> {
  const validAttemptId = validateId(
    attemptId,
    "Assessment attempt ID",
  );

  const response = await apiClient.post(
    `/school-assessment-attempts/${validAttemptId}/submit`,
    {},
    getRequestConfig(schoolSubdomain),
  );

  return unwrapResponse<unknown>(response);
}
