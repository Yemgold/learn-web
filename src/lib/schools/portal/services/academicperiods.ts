








import { apiClient } from "@/lib/api";

/* =====================================================
   TYPES
===================================================== */

export interface AcademicPeriod {
  _id?: string;
  id?: string;
  academicSessionId?: string;
  periodName?: string;
  name?: string;
  periodNumber?: number;
  startDate?: string;
  endDate?: string;
  startDateTime?: string;
  endDateTime?: string;
  description?: string;
  isActive?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

export interface CreateAcademicPeriodPayload {
  periodName: string;
  periodNumber: number;
  startDate: string;
  endDate: string;
}

export interface UpdateAcademicPeriodPayload {
  periodName?: string;
  periodNumber?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAcademicPeriodStatusPayload {
  isActive?: boolean;
  status?: string;
}

export interface AcademicPeriodList {
  periods: AcademicPeriod[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/* =====================================================
   SAFE USER-FACING ERRORS
===================================================== */

const MESSAGES = {
  list: "We couldn't load the academic periods. Please try again.",
  single: "We couldn't find this academic period.",
  create: "We couldn't create the academic period. Please try again.",
  update: "We couldn't update the academic period. Please try again.",
  status: "We couldn't update the academic period status. Please try again.",

  subdomain:
    "Unable to identify your school. Please access the school portal and try again.",

  sessionId:
    "Academic session information is missing. Please select an academic session.",

  periodId:
    "Academic period information is missing.",

  payload:
    "Please provide the required academic period information.",

  generic: "Something went wrong. Please try again.",
} as const;

/* =====================================================
   FRIENDLY ERROR HANDLER
===================================================== */

export function getAcademicPeriodErrorMessage(
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
   VALIDATE IDs
===================================================== */

function validateSessionId(academicSessionId: string): string {
  const sessionId = academicSessionId?.trim();

  if (!sessionId) {
    throw new Error(MESSAGES.sessionId);
  }

  return encodeURIComponent(sessionId);
}

function validatePeriodId(periodId: string): string {
  const id = periodId?.trim();

  if (!id) {
    throw new Error(MESSAGES.periodId);
  }

  return encodeURIComponent(id);
}

/* =====================================================
   RESPONSE HELPERS
===================================================== */

/**
 * apiClient returns the complete Axios response.
 *
 * Axios response:
 * response.data
 *
 * Backend response:
 * {
 *   success: true,
 *   message: "...",
 *   data: {...}
 * }
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
  if (!isRecord(error)) return false;

  const response = error.response;

  if (!isRecord(response) || response.status !== 404) {
    return false;
  }

  const data = response.data;

  if (!isRecord(data) || typeof data.message !== "string") {
    return false;
  }

  // Only treat an actual missing-period response as an empty list.
  // Do not treat "Cannot GET ..." as an empty list.
  return /academic periods? not found|no academic periods? found|periods? not found/i.test(
    data.message
  );
}

/* =====================================================
   EMPTY PERIOD LIST
===================================================== */

function emptyAcademicPeriodList(): AcademicPeriodList {
  return {
    periods: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
  };
}

/* =====================================================
   NORMALIZE ACADEMIC PERIOD
===================================================== */

function normalizeAcademicPeriod(
  period: unknown
): AcademicPeriod {
  if (!isRecord(period)) {
    throw new Error(MESSAGES.generic);
  }

  return {
    ...period,
  } as AcademicPeriod;
}

/* =====================================================
   EXTRACT SINGLE ACADEMIC PERIOD
===================================================== */

function extractAcademicPeriod(
  response: unknown
): AcademicPeriod {
  let result = unwrapResponse(response);

  if (!isRecord(result)) {
    throw new Error(MESSAGES.generic);
  }

  // Supports { academicPeriod: {...} }
  if ("academicPeriod" in result) {
    result = result.academicPeriod;
  }

  // Supports { period: {...} }
  else if ("period" in result) {
    result = result.period;
  }

  // Supports { academicPeriodObj: {...} }
  else if ("academicPeriodObj" in result) {
    result = result.academicPeriodObj;
  }

  // Supports array responses.
  if (Array.isArray(result)) {
    result = result[0];
  }

  return normalizeAcademicPeriod(result);
}

/* =====================================================
   EXTRACT ALL ACADEMIC PERIODS
===================================================== */

function extractAcademicPeriods(
  response: unknown
): AcademicPeriodList {
  let result = unwrapResponse(response);

  // Support nested response data.
  if (isRecord(result) && isRecord(result.data)) {
    result = result.data;
  }

  if (Array.isArray(result)) {
    const periods = result.map(normalizeAcademicPeriod);

    return {
      periods,
      totalCount: periods.length,
      currentPage: 1,
      totalPages: periods.length > 0 ? 1 : 0,
    };
  }

  if (!isRecord(result)) {
    throw new Error(MESSAGES.generic);
  }

 
const periodsValue =
  result.academicPeriodObj ?? 
  result.academicPeriodsObj ??
  result.academicPeriods ??
  result.periodsObj ??
  result.periods ??
  result.results ??
  result.items;


  if (!Array.isArray(periodsValue)) {
    throw new Error(MESSAGES.generic);
  }

  const periods = periodsValue.map(normalizeAcademicPeriod);

  return {
    periods,

    totalCount:
      typeof result.totalCount === "number"
        ? result.totalCount
        : typeof result.total === "number"
          ? result.total
          : periods.length,

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
          : periods.length > 0
            ? 1
            : 0,
  };
}

/* =====================================================
   GET ALL ACADEMIC PERIODS IN A SESSION
===================================================== */

export const getAcademicPeriods = async (
  academicSessionId: string,
  schoolSubdomain: string
): Promise<AcademicPeriodList> => {
  try {
    const sessionId = validateSessionId(academicSessionId);

    const response = await apiClient.get<unknown>(
      `/school/academic-sessions/${sessionId}/periods/get-all-academic-period-in-a-session`,
      getSchoolConfig(schoolSubdomain)
    );

    return extractAcademicPeriods(response);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return emptyAcademicPeriodList();
    }

    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.sessionId ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.list);
  }
};

/* =====================================================
   GET ACADEMIC PERIOD BY ID
===================================================== */

export const getAcademicPeriodById = async (
  academicSessionId: string,
  periodId: string,
  schoolSubdomain: string
): Promise<AcademicPeriod> => {
  try {
    const sessionId = validateSessionId(academicSessionId);
    const id = validatePeriodId(periodId);

    const response = await apiClient.get<unknown>(
      `/school/academic-sessions/${sessionId}/periods/get-academic-period-by-periodId/${id}`,
      getSchoolConfig(schoolSubdomain)
    );

    return extractAcademicPeriod(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.sessionId ||
        error.message === MESSAGES.periodId ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.single);
  }
};

/* =====================================================
   CREATE ACADEMIC PERIOD
===================================================== */

export const createAcademicPeriod = async (
  academicSessionId: string,
  payload: CreateAcademicPeriodPayload,
  schoolSubdomain: string
): Promise<AcademicPeriod> => {
  try {
    const sessionId = validateSessionId(academicSessionId);

    if (!isRecord(payload) || Object.keys(payload).length === 0) {
      throw new Error(MESSAGES.payload);
    }

    const response = await apiClient.post<unknown>(
      `/school/academic-sessions/${sessionId}/periods/create`,
      payload,
      getSchoolConfig(schoolSubdomain)
    );

    return extractAcademicPeriod(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.sessionId ||
        error.message === MESSAGES.payload ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.create);
  }
};

/* =====================================================
   UPDATE ACADEMIC PERIOD
===================================================== */

export const updateAcademicPeriod = async (
  academicSessionId: string,
  periodId: string,
  payload: UpdateAcademicPeriodPayload,
  schoolSubdomain: string
): Promise<AcademicPeriod> => {
  try {
    const sessionId = validateSessionId(academicSessionId);
    const id = validatePeriodId(periodId);

    if (!isRecord(payload) || Object.keys(payload).length === 0) {
      throw new Error(MESSAGES.payload);
    }

    const response = await apiClient.patch<unknown>(
      `/school/academic-sessions/${sessionId}/periods/update-academic-period/${id}`,
      payload,
      getSchoolConfig(schoolSubdomain)
    );

    return extractAcademicPeriod(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.sessionId ||
        error.message === MESSAGES.periodId ||
        error.message === MESSAGES.payload ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.update);
  }
};

/* =====================================================
   UPDATE ACADEMIC PERIOD STATUS
===================================================== */

export const updateAcademicPeriodStatus = async (
  academicSessionId: string,
  periodId: string,
  payload: UpdateAcademicPeriodStatusPayload,
  schoolSubdomain: string
): Promise<AcademicPeriod> => {
  try {
    const sessionId = validateSessionId(academicSessionId);
    const id = validatePeriodId(periodId);

    if (
      !isRecord(payload) ||
      Object.keys(payload).length === 0
    ) {
      throw new Error(MESSAGES.payload);
    }

    const response = await apiClient.patch<unknown>(
      `/school/academic-sessions/${sessionId}/periods/update-academic-period-status/${id}/status`,
      payload,
      getSchoolConfig(schoolSubdomain)
    );

    return extractAcademicPeriod(response);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.sessionId ||
        error.message === MESSAGES.periodId ||
        error.message === MESSAGES.payload ||
        error.message === MESSAGES.subdomain
      )
    ) {
      throw error;
    }

    throw new Error(MESSAGES.status);
  }
};

/* =====================================================
   ACTIVATE ACADEMIC PERIOD
===================================================== */

export const activateAcademicPeriod = (
  academicSessionId: string,
  periodId: string,
  schoolSubdomain: string
): Promise<AcademicPeriod> => {
  return updateAcademicPeriodStatus(
    academicSessionId,
    periodId,
    { isActive: true },
    schoolSubdomain
  );
};

/* =====================================================
   DEACTIVATE ACADEMIC PERIOD
===================================================== */

export const deactivateAcademicPeriod = (
  academicSessionId: string,
  periodId: string,
  schoolSubdomain: string
): Promise<AcademicPeriod> => {
  return updateAcademicPeriodStatus(
    academicSessionId,
    periodId,
    { isActive: false },
    schoolSubdomain
  );
};
