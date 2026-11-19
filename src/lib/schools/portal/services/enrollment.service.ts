









import { apiClient } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type SchoolSubdomain = string;

export type EnrollmentStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "WITHDRAWN"
  | "TRANSFERRED"
  | "CANCELLED"
  | "REJECTED";

export interface StudentEnrollment {
  _id?: string;
  id?: string;
  enrollmentId?: string;

  schoolId?: string;
  schoolMembershipId?: string;
  studentId?: string;
  academicSessionId?: string;
  academicPeriodId?: string;
  classId?: string;

  admissionNumber?: string;

  enrollmentDate?: string;
  startDate?: string;
  endDate?: string;

  status?: EnrollmentStatus | string;
  isActive?: boolean;

  student?: Record<string, unknown>;
  class?: Record<string, unknown>;
  academicSession?: Record<string, unknown>;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

export interface CreateStudentEnrollmentPayload {
  schoolMembershipId: string;
  classId: string;
   subjectsOffered: string[];
}

export type TransferStudentEnrollmentPayload = Record<string, unknown>;

export interface UpdateStudentEnrollmentStatusPayload {
  status: "COMPLETED" | "WITHDRAWN";
}

export interface EnrollmentQueryParams {
  page?: number;
  limit?: number;
  searchParams?: string;
}

export interface StudentEnrollmentList {
  enrollments: StudentEnrollment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ClassEnrollmentCount {
  total: number;
  count?: number;
  totalCount?: number;
  enrollmentCount?: number;
  classId?: string;
  [key: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/* USER-FACING ERRORS                                                         */
/* -------------------------------------------------------------------------- */

const MESSAGES = {
  subdomain:
    "Unable to identify your school. Please access the school portal and try again.",
  sessionId:
    "Academic session information is missing. Please select an academic session.",
  enrollmentId:
    "Student enrollment information is missing.",
  payload:
    "Please provide the required enrollment information.",
  list:
    "We couldn't load student enrollments. Please try again.",
  single:
    "We couldn't find this student enrollment.",
  create:
    "We couldn't enroll this student. Please try again.",
  update:
    "We couldn't update the student enrollment. Please try again.",
  transfer:
    "We couldn't transfer this student. Please try again.",
  count:
    "We couldn't load the class enrollment count. Please try again.",
  generic:
    "Something went wrong. Please try again.",
} as const;

/* -------------------------------------------------------------------------- */
/* COMMON HELPERS                                                             */
/* -------------------------------------------------------------------------- */

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getSchoolRequestConfig(
  schoolSubdomain: SchoolSubdomain
) {
  const subdomain = schoolSubdomain?.trim().toLowerCase();

  if (!subdomain) {
    throw new Error(MESSAGES.subdomain);
  }

  return {
    headers: {
      "x-school-subdomain": subdomain,
    },
  };
}

function validateSessionId(
  academicSessionId: string
): string {
  const id = academicSessionId?.trim();

  if (!id) {
    throw new Error(MESSAGES.sessionId);
  }

  return encodeURIComponent(id);
}

function validateEnrollmentId(
  enrollmentId: string
): string {
  const id = enrollmentId?.trim();

  if (!id) {
    throw new Error(MESSAGES.enrollmentId);
  }

  return encodeURIComponent(id);
}

function validatePayload(
  payload: unknown
): asserts payload is Record<string, unknown> {
  if (!isRecord(payload) || Object.keys(payload).length === 0) {
    throw new Error(MESSAGES.payload);
  }
}

function normalizePage(value: number | undefined): number {
  if (!Number.isFinite(value) || !value || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function normalizeLimit(value: number | undefined): number {
  if (!Number.isFinite(value) || !value || value < 1) {
    return 10;
  }

  return Math.floor(value);
}

function getObjectId(value: unknown): string {
  if (typeof value === "string") return value;

  if (isRecord(value)) {
    if (typeof value._id === "string") return value._id;
    if (typeof value.id === "string") return value.id;
  }

  return "";
}

/* -------------------------------------------------------------------------- */
/* RESPONSE HELPERS                                                           */
/* -------------------------------------------------------------------------- */

function getResponseBody(response: unknown): unknown {
  if (
    isRecord(response) &&
    "status" in response &&
    "data" in response
  ) {
    return response.data;
  }

  return response;
}

function unwrapResponse(response: unknown): unknown {
  let result = getResponseBody(response);

  for (let index = 0; index < 5; index += 1) {
    if (!isRecord(result)) break;

    if ("success" in result) {
      if (result.success !== true) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : MESSAGES.generic
        );
      }

      if ("data" in result) {
        result = result.data;
        continue;
      }
    }

    break;
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* NORMALIZE ENROLLMENT                                                       */
/* -------------------------------------------------------------------------- */

function normalizeEnrollment(
  value: unknown
): StudentEnrollment {
  if (!isRecord(value)) {
    throw new Error(MESSAGES.generic);
  }

  return {
    ...value,

    _id:
      typeof value._id === "string"
        ? value._id
        : undefined,

    id:
      typeof value.id === "string"
        ? value.id
        : typeof value._id === "string"
          ? value._id
          : undefined,

    enrollmentId:
      typeof value.enrollmentId === "string"
        ? value.enrollmentId
        : typeof value._id === "string"
          ? value._id
          : undefined,

    schoolId: getObjectId(value.schoolId) || undefined,

    // CRITICAL: preserve the membership ID used to
    // exclude already-enrolled students.
    schoolMembershipId:
      getObjectId(value.schoolMembershipId) || undefined,

    studentId: getObjectId(value.studentId) || undefined,

    academicSessionId:
      getObjectId(value.academicSessionId) || undefined,

    academicPeriodId:
      getObjectId(value.academicPeriodId) || undefined,

    classId: getObjectId(value.classId) || undefined,

    status:
      typeof value.status === "string"
        ? value.status.toUpperCase()
        : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/* EXTRACT ENROLLMENT LIST                                                    */
/* -------------------------------------------------------------------------- */

function extractEnrollmentList(
  response: unknown,
  requestedPage = 1
): StudentEnrollmentList {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    const enrollments = result.map(normalizeEnrollment);

    return {
      enrollments,
      totalCount: enrollments.length,
      currentPage: requestedPage,
      totalPages: enrollments.length > 0 ? 1 : 0,
    };
  }

  if (!isRecord(result)) {
    return {
      enrollments: [],
      totalCount: 0,
      currentPage: requestedPage,
      totalPages: 0,
    };
  }

  // Include the exact property name returned by your backend.
  const possibleArrays = [
    result.studentEnrolmentObj,
    result.studentEnrollmentObj,
    result.enrollmentObj,
    result.enrollmentsObj,
    result.studentEnrollments,
    result.enrollments,
    result.results,
    result.items,
  ];

  const rawEnrollments = possibleArrays.find(
    Array.isArray
  );

  const enrollments = Array.isArray(rawEnrollments)
    ? rawEnrollments.map(normalizeEnrollment)
    : [];

  return {
    enrollments,

    totalCount:
      typeof result.totalCount === "number"
        ? result.totalCount
        : typeof result.total === "number"
          ? result.total
          : enrollments.length,

    currentPage:
      typeof result.currentPage === "number"
        ? result.currentPage
        : typeof result.page === "number"
          ? result.page
          : requestedPage,

    totalPages:
      typeof result.totalPages === "number"
        ? result.totalPages
        : typeof result.pages === "number"
          ? result.pages
          : enrollments.length > 0
            ? 1
            : 0,
  };
}

/* -------------------------------------------------------------------------- */
/* EXTRACT SINGLE ENROLLMENT                                                  */
/* -------------------------------------------------------------------------- */

function extractEnrollment(
  response: unknown
): StudentEnrollment {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    if (result.length === 0) {
      throw new Error(MESSAGES.generic);
    }

    return normalizeEnrollment(result[0]);
  }

  if (!isRecord(result)) {
    throw new Error(MESSAGES.generic);
  }

  const candidate =
    result.studentEnrolmentObj ??
    result.studentEnrollmentObj ??
    result.enrollmentObj ??
    result.enrollment ??
    result.studentEnrollment ??
    result;

  if (Array.isArray(candidate)) {
    if (candidate.length === 0) {
      throw new Error(MESSAGES.generic);
    }

    return normalizeEnrollment(candidate[0]);
  }

  return normalizeEnrollment(candidate);
}

/* -------------------------------------------------------------------------- */
/* EXTRACT CLASS ENROLLMENT COUNT                                             */
/* -------------------------------------------------------------------------- */

function extractClassEnrollmentCount(
  response: unknown
): ClassEnrollmentCount {
  const result = unwrapResponse(response);

  if (typeof result === "number") {
    return {
      total: result,
      count: result,
      totalCount: result,
      enrollmentCount: result,
    };
  }

  if (!isRecord(result)) {
    return {
      total: 0,
      count: 0,
      totalCount: 0,
      enrollmentCount: 0,
    };
  }

  // Handle nested backend response:
  // { success: true, data: { total: 1 } }
  const nestedData = isRecord(result.data)
    ? result.data
    : result;

  const total =
    typeof nestedData.total === "number"
      ? nestedData.total
      : typeof nestedData.count === "number"
        ? nestedData.count
        : typeof nestedData.totalCount === "number"
          ? nestedData.totalCount
          : typeof nestedData.enrollmentCount === "number"
            ? nestedData.enrollmentCount
            : 0;

  return {
    ...nestedData,
    total,
    count: total,
    totalCount: total,
    enrollmentCount: total,
  };
}

/* -------------------------------------------------------------------------- */
/* EMPTY ENROLLMENT RESPONSE                                                  */
/* -------------------------------------------------------------------------- */

function isNoEnrollmentsFound(error: unknown): boolean {
  if (!isRecord(error)) return false;

  const response = isRecord(error.response)
    ? error.response
    : undefined;

  const responseData =
    response && isRecord(response.data)
      ? response.data
      : undefined;

  const message =
    typeof responseData?.message === "string"
      ? responseData.message
      : typeof error.message === "string"
        ? error.message
        : "";

  const status =
    typeof response?.status === "number"
      ? response.status
      : typeof responseData?.status === "number"
        ? responseData.status
        : undefined;

  return (
    status === 404 &&
    /student enrollments not found|no student enrollments found/i.test(
      message
    )
  );
}

/* -------------------------------------------------------------------------- */
/* ERROR PRESERVATION                                                         */
/* -------------------------------------------------------------------------- */

function throwFriendlyError(
  error: unknown,
  fallback: string
): never {
  if (error instanceof Error) {
    const knownMessages = Object.values(MESSAGES);

    if (
      knownMessages.includes(
        error.message as (typeof knownMessages)[number]
      )
    ) {
      throw error;
    }

    // Preserve meaningful backend messages, including 409 errors.
    if (error.message.trim()) {
      throw error;
    }
  }

  throw new Error(fallback);
}


/* -------------------------------------------------------------------------- */
/* 1. ENROL STUDENT INTO A CLASS                                              */
/* -------------------------------------------------------------------------- */

export const enrolStudentIntoClass = async (
  academicSessionId: string,
  payload: CreateStudentEnrollmentPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<StudentEnrollment> => {
  try {
    const sessionId = validateSessionId(academicSessionId);

    const schoolMembershipId = payload.schoolMembershipId?.trim();
    const classId = payload.classId?.trim();

    const subjectsOffered = [
      ...new Set(
        payload.subjectsOffered
          .filter((id) => typeof id === "string")
          .map((id) => id.trim())
          .filter(Boolean)
      ),
    ];

    if (
      !schoolMembershipId ||
      !classId ||
      subjectsOffered.length === 0
    ) {
      throw new Error(MESSAGES.payload);
    }

    const response = await apiClient.post<unknown>(
      `/school/academic-sessions/${sessionId}/enrollments/enrol-student-into-a-class`,
      {
        schoolMembershipId,
        classId,
        subjectsOffered,
      },
      getSchoolRequestConfig(schoolSubdomain)
    );

    return extractEnrollment(response);
  } catch (error: unknown) {
    throwFriendlyError(error, MESSAGES.create);
  }
};

/* -------------------------------------------------------------------------- */
/* 2. GET ALL ENROLLMENTS IN A SESSION                                        */
/* -------------------------------------------------------------------------- */

export async function getStudentEnrollmentsInAcademicSession(
  academicSessionId: string,
  schoolSubdomain: SchoolSubdomain,
  params: EnrollmentQueryParams = {}
): Promise<StudentEnrollmentList> {
  const page = normalizePage(params.page);
  const limit = normalizeLimit(params.limit);

  try {
    const sessionId = validateSessionId(academicSessionId);

    const response = await apiClient.get<unknown>(
      `/school/academic-sessions/${sessionId}/enrollments/get-all-enrollments-in-academic-session-for-a-school`,
      {
        ...getSchoolRequestConfig(schoolSubdomain),
        params: {
          page,
          limit,
          ...(params.searchParams?.trim()
            ? { searchParams: params.searchParams.trim() }
            : {}),
        },
      }
    );

    return extractEnrollmentList(response, page);
  } catch (error: unknown) {
    if (isNoEnrollmentsFound(error)) {
      return {
        enrollments: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
      };
    }

    throwFriendlyError(error, MESSAGES.list);
  }
}

/* -------------------------------------------------------------------------- */
/* 3. GET ENROLLMENT BY ID                                                    */
/* -------------------------------------------------------------------------- */

export const getStudentEnrollmentById = async (
  academicSessionId: string,
  enrollmentId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<StudentEnrollment> => {
  try {
    const sessionId = validateSessionId(academicSessionId);
    const id = validateEnrollmentId(enrollmentId);

    const response = await apiClient.get<unknown>(
      `/school/academic-sessions/${sessionId}/enrollments/get-student-enrollment-by-enrollmentId/${id}`,
      getSchoolRequestConfig(schoolSubdomain)
    );

    return extractEnrollment(response);
  } catch (error: unknown) {
    throwFriendlyError(error, MESSAGES.single);
  }
};

/* -------------------------------------------------------------------------- */
/* 4. COUNT CLASS ENROLLMENTS                                                 */
/* -------------------------------------------------------------------------- */

export const countClassEnrollments = async (
  academicSessionId: string,
  schoolSubdomain: SchoolSubdomain,
  params?: EnrollmentQueryParams
): Promise<ClassEnrollmentCount> => {
  try {
    const sessionId = validateSessionId(academicSessionId);

    const response = await apiClient.get<unknown>(
      `/school/academic-sessions/${academicSessionId}/enrollments/count-total-enrollments-in-a-session`,
      {
        ...getSchoolRequestConfig(schoolSubdomain),
        ...(params
          ? {
              params: {
                page: normalizePage(params.page),
                limit: normalizeLimit(params.limit),
                ...(params.searchParams?.trim()
                  ? { searchParams: params.searchParams.trim() }
                  : {}),
              },
            }
          : {}),
      }
    );

    return extractClassEnrollmentCount(response);
  } catch (error: unknown) {
    throwFriendlyError(error, MESSAGES.count);
  }
};

/* -------------------------------------------------------------------------- */
/* 5. TRANSFER STUDENT                                                        */
/* -------------------------------------------------------------------------- */

export const transferStudentToAnotherClass = async (
  academicSessionId: string,
  enrollmentId: string,
  payload: TransferStudentEnrollmentPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<StudentEnrollment> => {
  try {
    const sessionId = validateSessionId(academicSessionId);
    const id = validateEnrollmentId(enrollmentId);

    validatePayload(payload);

    const response = await apiClient.post<unknown>(
      `/school/academic-sessions/${sessionId}/enrollments/transfer-student-to-another-class/${id}/transfer`,
      payload,
      getSchoolRequestConfig(schoolSubdomain)
    );

    return extractEnrollment(response);
  } catch (error: unknown) {
    throwFriendlyError(error, MESSAGES.transfer);
  }
};

/* -------------------------------------------------------------------------- */
/* 6. COMPLETE OR WITHDRAW ENROLLMENT                                         */
/* -------------------------------------------------------------------------- */

export const updateStudentEnrollmentStatus = async (
  academicSessionId: string,
  enrollmentId: string,
  payload: UpdateStudentEnrollmentStatusPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<StudentEnrollment> => {
  try {
    const sessionId = validateSessionId(academicSessionId);
    const id = validateEnrollmentId(enrollmentId);

    if (
      payload.status !== "COMPLETED" &&
      payload.status !== "WITHDRAWN"
    ) {
      throw new Error(MESSAGES.payload);
    }

    const response = await apiClient.patch<unknown>(
      `/school/academic-sessions/${sessionId}/enrollments/complete-or-withdraw-student-enrollment/${id}/status`,
      payload,
      getSchoolRequestConfig(schoolSubdomain)
    );

    return extractEnrollment(response);
  } catch (error: unknown) {
    throwFriendlyError(error, MESSAGES.update);
  }
};

/* -------------------------------------------------------------------------- */
/* CONVENIENCE FUNCTIONS                                                      */
/* -------------------------------------------------------------------------- */

export const completeStudentEnrollment = (
  academicSessionId: string,
  enrollmentId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<StudentEnrollment> => {
  return updateStudentEnrollmentStatus(
    academicSessionId,
    enrollmentId,
    { status: "COMPLETED" },
    schoolSubdomain
  );
};

export const withdrawStudentEnrollment = (
  academicSessionId: string,
  enrollmentId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<StudentEnrollment> => {
  return updateStudentEnrollmentStatus(
    academicSessionId,
    enrollmentId,
    { status: "WITHDRAWN" },
    schoolSubdomain
  );
};

/* -------------------------------------------------------------------------- */
/* ALIASES                                                                    */
/* -------------------------------------------------------------------------- */

export const enrollStudentIntoClass = enrolStudentIntoClass;

export const getAcademicSessionEnrollments =
  getStudentEnrollmentsInAcademicSession;

export const getEnrollmentById =
  getStudentEnrollmentById;
