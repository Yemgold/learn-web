





import { apiClient } from "@/lib/api";

/* =========================================
   ASSESSMENT TYPES
========================================= */

export type AssessmentStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "PUBLISHED"
  | "COMPLETED"
  | "CANCELLED";

export interface Assessment {
  _id: string;
  assessmentName?: string;
  title?: string;
  description?: string;
  assessmentType?: string;

  academicSessionId?: string;
  classId?: string;
  classIds?: string[];
  subjectId?: string;
  teacherMembershipId?: string;

  totalMarks?: number;
  passMark?: number;

  duration?: number;
  durationMinutes?: number;

  startDate?: string;
  endDate?: string;
  startsAt?: string;
  endsAt?: string;

  status?: AssessmentStatus | string;

  questions?: unknown[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

export interface AssessmentApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

/* =========================================
   ENDPOINTS
========================================= */

const ASSESSMENT_ENDPOINTS = {
  create: "/school/assessments/create-assessment",

  // Documented endpoint: NO session ID in the URL.
  getAllBySession:
    "/school/assessments/get-all-assessments-of-a-school-in-a-session",

  getByClassAndSubject: (
    academicSessionId: string,
    classId: string,
    subjectId: string,
  ) =>
    `/school/assessments/get-all-assessments-of-class-subject-in-a-session/${encodeURIComponent(academicSessionId)}/${encodeURIComponent(classId)}/${encodeURIComponent(subjectId)}`,

  getById: (
    academicSessionId: string,
    classId: string,
    assessmentId: string,
  ) =>
    `/school/assessments/get-assessment-by-assessmentId-classId-academicSessionId/${encodeURIComponent(academicSessionId)}/${encodeURIComponent(classId)}/${encodeURIComponent(assessmentId)}`,

  updateStatus: (assessmentId: string) =>
    `/school/assessments/update-assessment-status/${encodeURIComponent(assessmentId)}`,
};

/* =========================================
   REQUEST CONFIG
========================================= */

function getAssessmentRequestConfig(schoolSubdomain: string) {
  const normalizedSubdomain = schoolSubdomain.trim().toLowerCase();

  if (!normalizedSubdomain) {
    throw new Error("A valid school subdomain is required.");
  }

  return {
    headers: {
      "x-school-subdomain": normalizedSubdomain,
    },
  };
}

/* =========================================
   CREATE ASSESSMENT
========================================= */

export const createAssessment = async (
  payload: Record<string, unknown>,
  schoolSubdomain: string,
) => {
  return apiClient.post(
    ASSESSMENT_ENDPOINTS.create,
    payload,
    getAssessmentRequestConfig(schoolSubdomain),
  );
};

/* =========================================
   GET ALL ASSESSMENTS IN A SESSION

   URL:
   GET /school/assessments/get-all-assessments-of-a-school-in-a-session

   Session ID is sent as a query parameter.
========================================= */

export const getAssessmentsBySession = async (
  academicSessionId: string,
  schoolSubdomain: string,
) => {
  if (!academicSessionId?.trim()) {
    throw new Error("Academic session ID is required.");
  }

  return apiClient.get(
    ASSESSMENT_ENDPOINTS.getAllBySession,
    {
      ...getAssessmentRequestConfig(schoolSubdomain),
      params: {
        academicSessionId: academicSessionId.trim(),
      },
    },
  );
};

/* =========================================
   GET ASSESSMENTS BY CLASS AND SUBJECT
========================================= */

export const getAssessmentsByClassAndSubject = async (
  academicSessionId: string,
  classId: string,
  subjectId: string,
  schoolSubdomain: string,
) => {
  if (
    !academicSessionId?.trim() ||
    !classId?.trim() ||
    !subjectId?.trim()
  ) {
    throw new Error(
      "Academic session, class and subject are required.",
    );
  }

  return apiClient.get(
    ASSESSMENT_ENDPOINTS.getByClassAndSubject(
      academicSessionId,
      classId,
      subjectId,
    ),
    getAssessmentRequestConfig(schoolSubdomain),
  );
};

/* =========================================
   GET ASSESSMENT BY ID
========================================= */

export const getAssessmentById = async (
  academicSessionId: string,
  classId: string,
  assessmentId: string,
  schoolSubdomain: string,
) => {
  if (
    !academicSessionId?.trim() ||
    !classId?.trim() ||
    !assessmentId?.trim()
  ) {
    throw new Error(
      "Academic session, class and assessment IDs are required.",
    );
  }

  return apiClient.get(
    ASSESSMENT_ENDPOINTS.getById(
      academicSessionId,
      classId,
      assessmentId,
    ),
    getAssessmentRequestConfig(schoolSubdomain),
  );
};

/* =========================================
   UPDATE ASSESSMENT STATUS
========================================= */

export const updateAssessmentStatus = async (
  assessmentId: string,
  payload: Record<string, unknown>,
  schoolSubdomain: string,
) => {
  if (!assessmentId?.trim()) {
    throw new Error("Assessment ID is required.");
  }

  return apiClient.patch(
    ASSESSMENT_ENDPOINTS.updateStatus(assessmentId),
    payload,
    getAssessmentRequestConfig(schoolSubdomain),
  );
};
