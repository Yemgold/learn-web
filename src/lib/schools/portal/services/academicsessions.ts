



import { apiClient } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

export type AcademicSessionStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "COMPLETED";

export type AcademicPeriodType = "TERM" | "SEMESTER";

export interface AcademicSession {
  _id?: string;
  id?: string;
  academicSessionId?: string;

  sessionName?: string;
  name?: string;
  academicYear?: string;
  year?: string;
  title?: string;

  sectionName?: string | null;
  periodType?: AcademicPeriodType;

  startDate?: string;
  endDate?: string;

  isActive?: boolean;
  status?: AcademicSessionStatus | string;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

export interface AcademicSessionList {
  sessions: AcademicSession[];
  totalCount: number;
  totalPages: number;
  currentPage?: number;
}

export interface CreateAcademicSessionPayload {
  sessionName: string;
  startDate: string;
  endDate: string;
  periodType: AcademicPeriodType;
}

export type UpdateAcademicSessionPayload = Record<string, unknown>;

export interface UpdateAcademicSessionStatusPayload {
  status: AcademicSessionStatus;
}

/* =========================================================
   CONFIGURATION
========================================================= */

const BASE_URL = "/academic-sessions";

const MESSAGES = {
  fetchSessions: "Unable to load academic sessions. Please try again.",
  fetchSession: "We couldn't find the requested academic session.",
  createSession: "Unable to create academic session.",
  updateSession: "Unable to update academic session.",
  updateStatus: "Unable to update academic session status.",

  invalidSessionId: "A valid academic session ID is required.",
  invalidSubdomain: "School subdomain is required.",

  invalidStatus:
    "Academic session status must be UPCOMING, ACTIVE, or COMPLETED.",

  endpoint:
    "The academic sessions endpoint could not be reached. Please verify the backend route and try again.",

  unauthorized: "Your session has expired. Please sign in again.",
  forbidden: "You don't have permission to access academic sessions.",
  server: "Our server is temporarily unavailable. Please try again later.",
  network:
    "Unable to connect to the server. Please check your internet connection.",
} as const;

/* =========================================================
   COMMON HELPERS
========================================================= */

type UnknownObject = Record<string, unknown>;

function isObject(value: unknown): value is UnknownObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

class AcademicSessionServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AcademicSessionServiceError";
    this.status = status;

    Object.setPrototypeOf(this, AcademicSessionServiceError.prototype);
  }
}

function getEmptySessionList(): AcademicSessionList {
  return {
    sessions: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  };
}

/* =========================================================
   BACKEND MESSAGE HELPER
========================================================= */

function getBackendMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const messages = value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0
    );

    return messages.length > 0 ? messages.join(" ") : undefined;
  }

  return undefined;
}

/* =========================================================
   RESPONSE HELPERS
========================================================= */

function getResponseBody(response: unknown): unknown {
  if (!isObject(response)) return response;

  // apiClient returns the complete Axios response.
  if ("status" in response && "data" in response) {
    return response.data;
  }

  return response;
}

function unwrapResponse(response: unknown): unknown {
  const axiosStatus =
    isObject(response) && typeof response.status === "number"
      ? response.status
      : undefined;

  let current = getResponseBody(response);

  for (let i = 0; i < 5; i++) {
    if (!isObject(current)) break;

    if (current.success === false) {
      const message =
        getBackendMessage(current.message) ||
        MESSAGES.fetchSessions;

      const backendStatus =
        typeof current.statusCode === "number"
          ? current.statusCode
          : typeof current.status === "number"
            ? current.status
            : axiosStatus;

      throw new AcademicSessionServiceError(
        message,
        backendStatus
      );
    }

    if ("data" in current && current.data !== undefined) {
      current = current.data;
      continue;
    }

    break;
  }

  return current;
}

/* =========================================================
   EXTRACT ACADEMIC SESSIONS
========================================================= */

function extractSessionsFromData(data: unknown): AcademicSession[] {
  if (Array.isArray(data)) {
    return data.filter(isObject) as AcademicSession[];
  }

  if (!isObject(data)) {
    return [];
  }

  // The backend's actual response property is sessionObj.
  const possibleArrays = [
    data.sessionObj,
    data.academicSessionsObj,
    data.academicSessions,
    data.sessionsObj,
    data.sessions,
    data.results,
    data.items,
  ];

  const sessions = possibleArrays.find(Array.isArray);

  return sessions
    ? (sessions.filter(isObject) as AcademicSession[])
    : [];
}

function extractSessions(response: unknown): AcademicSession[] {
  return extractSessionsFromData(unwrapResponse(response));
}

/* =========================================================
   EXTRACT ONE ACADEMIC SESSION
========================================================= */

function extractSession(response: unknown): AcademicSession | null {
  const data = unwrapResponse(response);

  if (!isObject(data)) return null;

  const possibleSession =
    data.sessionObj ??
    data.academicSession ??
    data.session ??
    data.academicSessionObj;

  if (isObject(possibleSession)) {
    return possibleSession as AcademicSession;
  }

  if (Array.isArray(possibleSession)) {
    const first = possibleSession.find(isObject);
    return first ? (first as AcademicSession) : null;
  }

  if (data._id || data.id || data.academicSessionId) {
    return data as AcademicSession;
  }

  return null;
}

/* =========================================================
   EXTRACT SESSION LIST AND PAGINATION
========================================================= */

function extractSessionList(response: unknown): AcademicSessionList {
  const data = unwrapResponse(response);

  const sessions = extractSessionsFromData(data);
  const object = isObject(data) ? data : {};

  return {
    sessions,

    totalCount:
      typeof object.totalCount === "number"
        ? object.totalCount
        : typeof object.total === "number"
          ? object.total
          : sessions.length,

    totalPages:
      typeof object.totalPages === "number"
        ? object.totalPages
        : typeof object.pages === "number"
          ? object.pages
          : sessions.length > 0
            ? 1
            : 0,

    currentPage:
      typeof object.currentPage === "number"
        ? object.currentPage
        : typeof object.page === "number"
          ? object.page
          : 1,
  };
}

/* =========================================================
   ERROR DETAILS
========================================================= */

interface ServiceErrorDetails {
  status?: number;
  message?: string;
}

function getErrorDetails(error: unknown): ServiceErrorDetails {
  if (!isObject(error)) return {};

  const response = isObject(error.response)
    ? error.response
    : undefined;

  const responseData =
    response && isObject(response.data)
      ? response.data
      : undefined;

  const status =
    typeof error.status === "number"
      ? error.status
      : typeof response?.status === "number"
        ? response.status
        : undefined;

  const message =
    getBackendMessage(responseData?.message) ||
    getBackendMessage(error.message);

  return {
    status,
    message,
  };
}

/* =========================================================
   DETECT EMPTY SESSION RESPONSE
========================================================= */

function isEmptySessionResponse(error: unknown): boolean {
  const { status, message } = getErrorDetails(error);

  if (status !== 404 || !message) return false;

  const normalized = message.toLowerCase().trim();

  if (
    normalized.startsWith("cannot get") ||
    normalized.startsWith("cannot post") ||
    normalized.startsWith("cannot patch") ||
    normalized.startsWith("cannot put")
  ) {
    return false;
  }

  return (
    /no academic sessions? (?:found|exist|available)/i.test(message) ||
    /academic sessions? (?:not found|do not exist|does not exist)/i.test(message) ||
    /no sessions? (?:found|exist|available)/i.test(message) ||
    /sessions? collection is empty/i.test(message)
  );
}

/* =========================================================
   FRIENDLY ERROR HANDLER
========================================================= */

function handleServiceError(
  error: unknown,
  fallbackMessage: string
): Error {
  const { status, message } = getErrorDetails(error);

  if (status === 401) {
    return new Error(MESSAGES.unauthorized);
  }

  if (status === 403) {
    return new Error(MESSAGES.forbidden);
  }

  if (status === 404) {
    if (
      message &&
      /^(Cannot GET|Cannot POST|Cannot PATCH|Cannot PUT)/i.test(message)
    ) {
      return new Error(MESSAGES.endpoint);
    }

    return new Error(message || fallbackMessage);
  }

  if (status === 409) {
    return new Error(
      message ||
        "An academic session with these details already exists."
    );
  }

  if (status && status >= 500) {
    return new Error(MESSAGES.server);
  }

  // Preserve backend validation errors, including HTTP 400.
  if (status && status >= 400 && status < 500) {
    return new Error(message || fallbackMessage);
  }

  if (!status) {
    if (error instanceof AcademicSessionServiceError) {
      return new Error(error.message);
    }

    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.invalidSessionId ||
        error.message === MESSAGES.invalidSubdomain ||
        error.message === MESSAGES.invalidStatus ||
        error.message === MESSAGES.fetchSession
      )
    ) {
      return error;
    }

    return new Error(MESSAGES.network);
  }

  return new Error(fallbackMessage);
}

/* =========================================================
   REQUEST CONFIGURATION
========================================================= */

function getSchoolConfig(schoolSubdomain: string) {
  const subdomain = String(schoolSubdomain || "")
    .trim()
    .toLowerCase();

  if (!subdomain) {
    throw new Error(MESSAGES.invalidSubdomain);
  }

  return {
    headers: {
      "x-school-subdomain": subdomain,
    },
  };
}

function validateSessionId(sessionId: string): string {
  const id = String(sessionId || "").trim();

  if (!id) {
    throw new Error(MESSAGES.invalidSessionId);
  }

  return encodeURIComponent(id);
}

function validateSessionStatus(
  status: string
): AcademicSessionStatus {
  const normalized = String(status || "")
    .trim()
    .toUpperCase();

  if (
    normalized !== "UPCOMING" &&
    normalized !== "ACTIVE" &&
    normalized !== "COMPLETED"
  ) {
    throw new Error(MESSAGES.invalidStatus);
  }

  return normalized;
}

/* =========================================================
   GET ALL ACADEMIC SESSIONS
========================================================= */

export async function getAcademicSessions(
  schoolSubdomain: string
): Promise<AcademicSessionList> {
  try {
    const config = getSchoolConfig(schoolSubdomain);

    const response = await apiClient.get(
      `${BASE_URL}/get-all-academic-sessions-of-a-school`,
      config
    );

    return extractSessionList(response);
  } catch (error) {
    if (isEmptySessionResponse(error)) {
      return getEmptySessionList();
    }

    if (
      error instanceof Error &&
      error.message === MESSAGES.invalidSubdomain
    ) {
      throw error;
    }

    throw handleServiceError(error, MESSAGES.fetchSessions);
  }
}

/* =========================================================
   GET ONE ACADEMIC SESSION
========================================================= */

export async function getAcademicSessionById(
  sessionId: string,
  schoolSubdomain: string
): Promise<AcademicSession> {
  try {
    const id = validateSessionId(sessionId);
    const config = getSchoolConfig(schoolSubdomain);

    const response = await apiClient.get(
      `${BASE_URL}/get-academic-session-by-sessionId/${id}`,
      config
    );

    const session = extractSession(response);

    if (!session) {
      throw new Error(MESSAGES.fetchSession);
    }

    return session;
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.invalidSessionId ||
        error.message === MESSAGES.invalidSubdomain ||
        error.message === MESSAGES.fetchSession
      )
    ) {
      throw error;
    }

    throw handleServiceError(error, MESSAGES.fetchSession);
  }
}

/* =========================================================
   CREATE ACADEMIC SESSION
========================================================= */

export async function createAcademicSession(
  payload: CreateAcademicSessionPayload,
  schoolSubdomain: string
): Promise<AcademicSession | null> {
  try {
    const config = getSchoolConfig(schoolSubdomain);

    const response = await apiClient.post(
      `${BASE_URL}/create-academic-session`,
      payload,
      config
    );

    return extractSession(response);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === MESSAGES.invalidSubdomain
    ) {
      throw error;
    }

    throw handleServiceError(error, MESSAGES.createSession);
  }
}

/* =========================================================
   UPDATE ACADEMIC SESSION
========================================================= */

export async function updateAcademicSession(
  sessionId: string,
  payload: UpdateAcademicSessionPayload,
  schoolSubdomain: string
): Promise<AcademicSession | null> {
  try {
    const id = validateSessionId(sessionId);
    const config = getSchoolConfig(schoolSubdomain);

    const response = await apiClient.patch(
      `${BASE_URL}/update-academic-session-by-sessionId/${id}`,
      payload,
      config
    );

    return extractSession(response);
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.invalidSessionId ||
        error.message === MESSAGES.invalidSubdomain
      )
    ) {
      throw error;
    }

    throw handleServiceError(error, MESSAGES.updateSession);
  }
}

/* =========================================================
   UPDATE ACADEMIC SESSION STATUS
========================================================= */

export async function updateAcademicSessionStatus(
  sessionId: string,
  payload: UpdateAcademicSessionStatusPayload,
  schoolSubdomain: string
): Promise<AcademicSession | null> {
  try {
    const id = validateSessionId(sessionId);
    const config = getSchoolConfig(schoolSubdomain);

    const status = validateSessionStatus(payload.status);

    const response = await apiClient.patch(
      `${BASE_URL}/update-academic-session-status/${id}/status`,
      { status },
      config
    );

    return extractSession(response);
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message === MESSAGES.invalidSessionId ||
        error.message === MESSAGES.invalidSubdomain ||
        error.message === MESSAGES.invalidStatus
      )
    ) {
      throw error;
    }

    throw handleServiceError(error, MESSAGES.updateStatus);
  }
}

/* =========================================================
   ACTIVATE ACADEMIC SESSION
========================================================= */

export async function activateAcademicSession(
  sessionId: string,
  schoolSubdomain: string
): Promise<AcademicSession | null> {
  return updateAcademicSessionStatus(
    sessionId,
    { status: "ACTIVE" },
    schoolSubdomain
  );
}

/* =========================================================
   DEACTIVATE ACADEMIC SESSION
========================================================= */

// The backend has no INACTIVE status.
// UPCOMING is used to move a session out of ACTIVE status.
// Use COMPLETED instead when the session has actually ended.

export async function deactivateAcademicSession(
  sessionId: string,
  schoolSubdomain: string
): Promise<AcademicSession | null> {
  return updateAcademicSessionStatus(
    sessionId,
    { status: "UPCOMING" },
    schoolSubdomain
  );
}

/* =========================================================
   COMPLETE ACADEMIC SESSION
========================================================= */

export async function completeAcademicSession(
  sessionId: string,
  schoolSubdomain: string
): Promise<AcademicSession | null> {
  return updateAcademicSessionStatus(
    sessionId,
    { status: "COMPLETED" },
    schoolSubdomain
  );
}
