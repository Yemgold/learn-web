



import { apiClient } from "@/lib/api";

/* =====================================================
   TYPES
===================================================== */

export interface SchoolSubject {
  _id?: string;
  id?: string;
  subjectName: string;
  subjectCode?: string;
  description?: string;
  schoolId?: string;
  isActive: boolean;
  classCount?: number;
  teacherCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSchoolSubjectPayload {
  subjectName: string;
  subjectCode?: string;
  description?: string;
}

export interface UpdateSchoolSubjectPayload {
  subjectName?: string;
  subjectCode?: string;
  description?: string;
}

export interface UpdateSchoolSubjectStatusPayload {
  isActive: boolean;
}

export interface SchoolSubjectList {
  subjects: SchoolSubject[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/* =====================================================
   SAFE USER-FACING ERRORS
===================================================== */

const MESSAGES = {
  list: "We couldn't load your school's subjects. Please try again.",
  single: "We couldn't find this subject.",
  create: "We couldn't create the subject. Please try again.",
  update: "We couldn't update the subject. Please try again.",
  status: "We couldn't update the subject status. Please try again.",
  subdomain:
    "Unable to identify your school. Please access the school portal and try again.",
  subjectId:
    "Unable to process this request because the subject information is missing.",
  name: "Please enter a subject name.",
  generic: "Something went wrong. Please try again.",
} as const;

/* =====================================================
   FRIENDLY ERROR HANDLER
===================================================== */

export function getSubjectErrorMessage(
  error: unknown,
  fallback: string = MESSAGES.generic
): string {
  if (error instanceof Error) {
    const safeMessages = Object.values(MESSAGES);

    if (
      safeMessages.includes(
        error.message as (typeof safeMessages)[number]
      )
    ) {
      return error.message;
    }
  }

  return fallback;
}

/* =====================================================
   SCHOOL REQUEST CONFIG
===================================================== */

function getSchoolConfig(schoolSubdomain: string) {
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

/* =====================================================
   COMMON HELPERS
===================================================== */

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * api.ts returns the complete Axios response.
 * Therefore, backend response data is response.data.
 */
function getResponseBody(response: unknown): unknown {
  if (
    isRecord(response) &&
    "data" in response &&
    "status" in response
  ) {
    return response.data;
  }

  return response;
}

/**
 * Backend response:
 * {
 *   success: true,
 *   message: "...",
 *   data: {...}
 * }
 */
function unwrapResponse(response: unknown): unknown {
  const body = getResponseBody(response);

  if (isRecord(body) && "success" in body) {
    if (body.success !== true) {
      throw new Error(MESSAGES.generic);
    }

    return body.data;
  }

  return body;
}

/* =====================================================
   NOT FOUND HANDLER
===================================================== */

function isNotFoundError(error: unknown): boolean {
  if (!isRecord(error)) {
    return false;
  }

  const response = error.response;

  if (isRecord(response)) {
    if (response.status === 404) {
      return true;
    }

    const data = response.data;

    if (
      isRecord(data) &&
      typeof data.message === "string" &&
      /subjects? not found/i.test(data.message)
    ) {
      return true;
    }
  }

  return (
    typeof error.message === "string" &&
    /subjects? not found/i.test(error.message)
  );
}

function emptySubjectList(): SchoolSubjectList {
  return {
    subjects: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
  };
}

/* =====================================================
   NORMALIZE SUBJECT
===================================================== */

function normalizeSubject(subject: unknown): SchoolSubject {
  if (!isRecord(subject)) {
    throw new Error(MESSAGES.generic);
  }

  const subjectName =
    typeof subject.subjectName === "string"
      ? subject.subjectName
      : typeof subject.name === "string"
        ? subject.name
        : "";

  if (!subjectName.trim()) {
    throw new Error(MESSAGES.generic);
  }

  return {
    ...subject,
    subjectName,
    subjectCode:
      typeof subject.subjectCode === "string"
        ? subject.subjectCode
        : typeof subject.code === "string"
          ? subject.code
          : "",
    isActive:
      typeof subject.isActive === "boolean"
        ? subject.isActive
        : true,
  } as SchoolSubject;
}

/* =====================================================
   EXTRACT SINGLE SUBJECT
===================================================== */

function extractSubject(response: unknown): SchoolSubject {
  let result = unwrapResponse(response);

  if (isRecord(result) && "subject" in result) {
    result = result.subject;
  }

  if (isRecord(result) && Array.isArray(result.subjectsObj)) {
    result = result.subjectsObj[0];
  }

  if (isRecord(result) && Array.isArray(result.subjects)) {
    result = result.subjects[0];
  }

  if (Array.isArray(result)) {
    result = result[0];
  }

  return normalizeSubject(result);
}

/* =====================================================
   EXTRACT ALL SUBJECTS

   Actual backend response:
   {
     success: true,
     message: "Subjects fetched successfully.",
     data: {
       subjectsObj: [...],
       totalCount: 1,
       totalPages: 1
     }
   }
===================================================== */

function extractSubjects(response: unknown): SchoolSubjectList {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    const subjects = result.map(normalizeSubject);

    return {
      subjects,
      totalCount: subjects.length,
      currentPage: 1,
      totalPages: subjects.length > 0 ? 1 : 0,
    };
  }

  if (!isRecord(result)) {
    throw new Error(MESSAGES.generic);
  }

  const subjectsValue =
    result.subjectsObj ??
    result.subjects ??
    result.results ??
    result.items;

  if (!Array.isArray(subjectsValue)) {
    throw new Error(MESSAGES.generic);
  }

  const subjects = subjectsValue.map(normalizeSubject);

  return {
    subjects,
    totalCount:
      typeof result.totalCount === "number"
        ? result.totalCount
        : typeof result.total === "number"
          ? result.total
          : subjects.length,
    currentPage:
      typeof result.currentPage === "number"
        ? result.currentPage
        : typeof result.page === "number"
          ? result.page
          : 1,
    totalPages:
      typeof result.totalPages === "number"
        ? result.totalPages
        : typeof result.pages === "number"
          ? result.pages
          : subjects.length > 0
            ? 1
            : 0,
  };
}

/* =====================================================
   GET ALL SCHOOL SUBJECTS
===================================================== */

export const getSchoolSubjects = async (
  schoolSubdomain: string
): Promise<SchoolSubjectList> => {
  try {
    const response = await apiClient.get<unknown>(
      "/school/subjects/get-all-school-sujects",
      getSchoolConfig(schoolSubdomain)
    );

    return extractSubjects(response);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return emptySubjectList();
    }

    if (
      error instanceof Error &&
      error.message === MESSAGES.subdomain
    ) {
      throw error;
    }

    throw new Error(MESSAGES.list);
  }
};

/* =====================================================
   GET SUBJECT BY ID
===================================================== */

export const getSchoolSubjectById = async (
  subjectId: string,
  schoolSubdomain: string
): Promise<SchoolSubject> => {
  try {
    if (!subjectId?.trim()) {
      throw new Error(MESSAGES.subjectId);
    }

    const response = await apiClient.get<unknown>(
      `/school/subjects/get-a-school-subject/${encodeURIComponent(subjectId)}`,
      getSchoolConfig(schoolSubdomain)
    );

    return extractSubject(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.subjectId ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.single);
  }
};

/* =====================================================
   CREATE SUBJECT
===================================================== */

export const createSchoolSubject = async (
  payload: CreateSchoolSubjectPayload,
  schoolSubdomain: string
): Promise<SchoolSubject> => {
  try {
    const subjectName = payload.subjectName?.trim();

    if (!subjectName) {
      throw new Error(MESSAGES.name);
    }

    const response = await apiClient.post<unknown>(
      "/school/subjects/create-a-school-subject",
      {
        subjectName,
        ...(payload.subjectCode?.trim()
          ? { subjectCode: payload.subjectCode.trim() }
          : {}),
        ...(payload.description?.trim()
          ? { description: payload.description.trim() }
          : {}),
      },
      getSchoolConfig(schoolSubdomain)
    );

    return extractSubject(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.name ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.create);
  }
};

/* =====================================================
   UPDATE SUBJECT
===================================================== */

export const updateSchoolSubject = async (
  subjectId: string,
  payload: UpdateSchoolSubjectPayload,
  schoolSubdomain: string
): Promise<SchoolSubject> => {
  try {
    if (!subjectId?.trim()) {
      throw new Error(MESSAGES.subjectId);
    }

    const response = await apiClient.patch<unknown>(
      `/school/subjects/update-school-subject/${encodeURIComponent(subjectId)}`,
      payload,
      getSchoolConfig(schoolSubdomain)
    );

    return extractSubject(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.subjectId ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.update);
  }
};

/* =====================================================
   UPDATE SUBJECT STATUS
===================================================== */

export const updateSchoolSubjectStatus = async (
  subjectId: string,
  payload: UpdateSchoolSubjectStatusPayload,
  schoolSubdomain: string
): Promise<SchoolSubject> => {
  try {
    if (!subjectId?.trim()) {
      throw new Error(MESSAGES.subjectId);
    }

    const response = await apiClient.patch<unknown>(
      `/school/subjects/${encodeURIComponent(subjectId)}/status`,
      {
        isActive: payload.isActive,
      },
      getSchoolConfig(schoolSubdomain)
    );

    return extractSubject(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.subjectId ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.status);
  }
};

/* =====================================================
   ACTIVATE SUBJECT
===================================================== */

export const activateSchoolSubject = (
  subjectId: string,
  schoolSubdomain: string
): Promise<SchoolSubject> => {
  return updateSchoolSubjectStatus(
    subjectId,
    { isActive: true },
    schoolSubdomain
  );
};

/* =====================================================
   DEACTIVATE SUBJECT
===================================================== */

export const deactivateSchoolSubject = (
  subjectId: string,
  schoolSubdomain: string
): Promise<SchoolSubject> => {
  return updateSchoolSubjectStatus(
    subjectId,
    { isActive: false },
    schoolSubdomain
  );
};
