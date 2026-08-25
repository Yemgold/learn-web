







import { api } from "./axios";

import type {
  CbtQuestion,
  CbtResult,
} from "@/stores/cbtStore";

/* ============================================================
   CREATE PRACTICE SESSION PAYLOAD
   ============================================================ */

export interface CreateCbtSessionPayload {
  subjectId?: string;

  mode?: string;

  questionCount?: number;

  duration?: number;

  examType?: string;

  year?: number | string;

  /*
   * Compatibility with older page code.
   *
   * These are intentionally accepted so TypeScript
   * does not break while the page is being migrated.
   *
   * They are NOT sent to the backend.
   */
  questionIds?: string[];

  subjectIds?: string[];

  totalQuestions?: number;

  durationInMinutes?: number;

  [key: string]: unknown;
}

/* ============================================================
   BACKEND RESPONSE
   ============================================================ */

export interface PracticeSessionResponse {
  sessionId?: string;

  _id?: string;

  id?: string;

  status?: string;

  questions?: CbtQuestion[];

  questionIds?: string[];

  duration?: number;

  durationInMinutes?: number;

  timeRemainingSeconds?: number;

  startedAt?: string;

  expiresAt?: string;

  subjectId?: string;

  examType?: string;

  mode?: string;

  result?: CbtResult | null;

  data?: unknown;

  [key: string]: unknown;
}

/* ============================================================
   NORMALIZED SESSION
   ============================================================ */

export interface CreatedCbtSession {
  /*
   * Backend session identifier, if provided.
   *
   * The frontend does NOT depend on this because
   * there is no answer/finish/result endpoint.
   */
  sessionId: string | null;

  /*
   * Original backend response.
   */
  response: PracticeSessionResponse;

  /*
   * Compatibility fields.
   */
  _id?: string;

  id?: string;

  status?: string;

  questions: CbtQuestion[];

  questionIds?: string[];

  duration?: number;

  durationInMinutes: number;

  timeRemainingSeconds: number;

  startedAt?: string;

  expiresAt?: string;

  subjectId?: string;

  examType?: string;

  mode?: string;

  result?: CbtResult | null;

  data?: unknown;

  [key: string]: unknown;
}

/* ============================================================
   HELPERS
   ============================================================ */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

/* ============================================================
   UNWRAP AXIOS RESPONSE
   ============================================================ */

function unwrapResponse<T>(
  response: unknown,
): T {
  /*
   * Axios response:
   *
   * {
   *   data: {...}
   * }
   */

  if (
    isObject(response) &&
    "data" in response
  ) {
    return response.data as T;
  }

  return response as T;
}

/* ============================================================
   EXTRACT DATA OBJECT
   ============================================================ */

function getDataObject(
  value: unknown,
): Record<string, unknown> | null {
  if (!isObject(value)) {
    return null;
  }

  /*
   * Normal:
   *
   * {
   *   data: {...}
   * }
   */

  if (isObject(value.data)) {
    return value.data;
  }

  return value;
}

/* ============================================================
   EXTRACT SESSION ID
   ============================================================ */

function extractSessionId(
  value: unknown,
): string | null {
  if (!isObject(value)) {
    return null;
  }

  const possibleIds = [
    value.sessionId,
    value._id,
    value.id,
  ];

  for (const id of possibleIds) {
    if (
      typeof id === "string" &&
      id.trim()
    ) {
      return id;
    }
  }

  /*
   * Handle nested:
   *
   * {
   *   data: {
   *     sessionId: "..."
   *   }
   * }
   */

  if (isObject(value.data)) {
    return extractSessionId(
      value.data,
    );
  }

  return null;
}

/* ============================================================
   NORMALIZE PRACTICE SESSION
   ============================================================ */

function normalizePracticeSession(
  response: unknown,
): CreatedCbtSession {
  const raw =
    unwrapResponse<PracticeSessionResponse>(
      response,
    );

  let root =
    getDataObject(raw) ?? {};

  /*
   * Handle:
   *
   * {
   *   data: {
   *     data: {
   *       questions: [...]
   *     }
   *   }
   * }
   */

  if (isObject(root.data)) {
    const nested =
      root.data;

    if (
      "questions" in nested ||
      "questionIds" in nested ||
      "duration" in nested ||
      "durationInMinutes" in nested ||
      "sessionId" in nested
    ) {
      root = nested;
    }
  }

  /* ==========================================================
     QUESTIONS
     ========================================================== */

  const questions =
    Array.isArray(root.questions)
      ? (root.questions as CbtQuestion[])
      : [];

  /* ==========================================================
     QUESTION IDS
     ========================================================== */

  let questionIds:
    | string[]
    | undefined;

  if (
    Array.isArray(
      root.questionIds,
    )
  ) {
    questionIds =
      root.questionIds.filter(
        (
          id,
        ): id is string =>
          typeof id === "string",
      );
  } else if (
    questions.length > 0
  ) {
    /*
     * Some responses may return the questions
     * but not a separate questionIds array.
     */

    questionIds =
      questions
        .map((question) => {
          const q =
            question as unknown as Record<
              string,
              unknown
            >;

          const id =
            q._id ??
            q.id ??
            q.questionId;

          return typeof id === "string"
            ? id
            : null;
        })
        .filter(
          (
            id,
          ): id is string =>
            id !== null,
        );
  }

  /* ==========================================================
     DURATION
     ========================================================== */

  const durationValue =
    root.durationInMinutes ??
    root.duration ??
    0;

  const durationInMinutes =
    Number(durationValue) || 0;

  /* ==========================================================
     REMAINING TIME
     ========================================================== */

  const timeRemainingValue =
    root.timeRemainingSeconds ??
    (
      durationInMinutes > 0
        ? durationInMinutes * 60
        : 0
    );

  const timeRemainingSeconds =
    Number(
      timeRemainingValue,
    ) || 0;

  /* ==========================================================
     SESSION ID
     ========================================================== */

  const sessionId =
    extractSessionId(raw);

  /* ==========================================================
     NORMALIZED RESULT
     ========================================================== */

  return {
    sessionId,

    response: raw,

    _id:
      typeof root._id === "string"
        ? root._id
        : undefined,

    id:
      typeof root.id === "string"
        ? root.id
        : undefined,

    status:
      typeof root.status === "string"
        ? root.status
        : undefined,

    questions,

    questionIds,

    duration:
      typeof root.duration === "number"
        ? root.duration
        : undefined,

    durationInMinutes,

    timeRemainingSeconds,

    startedAt:
      typeof root.startedAt === "string"
        ? root.startedAt
        : undefined,

    expiresAt:
      typeof root.expiresAt === "string"
        ? root.expiresAt
        : undefined,

    subjectId:
      typeof root.subjectId === "string"
        ? root.subjectId
        : undefined,

    examType:
      typeof root.examType === "string"
        ? root.examType
        : undefined,

    mode:
      typeof root.mode === "string"
        ? root.mode
        : undefined,

    result:
      isObject(root.result)
        ? (root.result as CbtResult)
        : null,

    data:
      root.data,
  };
}

/* ============================================================
   CREATE CBT PRACTICE SESSION
   ============================================================ */

/**
 * Backend endpoint:
 *
 * GET /api/v1/questions/practice-session
 *
 * Example:
 *
 * GET /api/v1/questions/practice-session
 *   ?subjectId=69bd417a74676c09ac65bc56
 *   &mode=quick
 *   &questionCount=20
 *   &duration=20
 *   &examType=jamb
 *
 * IMPORTANT:
 *
 * This is the ONLY CBT API request.
 *
 * Answers are NOT sent to the backend.
 * Completion is NOT sent to the backend.
 * Results are NOT fetched from the backend.
 *
 * Everything after this request happens
 * inside the frontend.
 */
export async function createCbtSession(
  payload: CreateCbtSessionPayload = {},
): Promise<CreatedCbtSession> {
  /* ==========================================================
     SUBJECT
     ========================================================== */

  const subjectId =
    typeof payload.subjectId === "string"
      ? payload.subjectId.trim()
      : "";

  if (!subjectId) {
    throw new Error(
      "Cannot create CBT practice session without a subject ID.",
    );
  }

  /* ==========================================================
     QUESTION COUNT
     ========================================================== */

  const questionCount =
    Number(
      payload.questionCount ??
        payload.totalQuestions ??
        20,
    ) || 20;

  /* ==========================================================
     DURATION
     ========================================================== */

  const duration =
    Number(
      payload.duration ??
        payload.durationInMinutes ??
        20,
    ) || 20;

  /* ==========================================================
     MODE
     ========================================================== */

  const mode =
    typeof payload.mode === "string" &&
    payload.mode.trim()
      ? payload.mode
      : "quick";

  /* ==========================================================
     EXAM TYPE
     ========================================================== */

  const examType =
    typeof payload.examType === "string" &&
    payload.examType.trim()
      ? payload.examType
      : "jamb";

  /* ==========================================================
     QUERY PARAMETERS
     ========================================================== */

  const params: Record<
    string,
    string | number
  > = {
    subjectId,

    mode,

    questionCount,

    duration,

    examType,
  };

  /*
   * Year is optional.
   */

  if (
    payload.year !== undefined &&
    payload.year !== null &&
    String(payload.year).trim()
  ) {
    params.year =
      payload.year;
  }

  console.log(
    "[CBT API] GET /questions/practice-session",
  );

  console.log(
    "[CBT API] Params:",
    params,
  );

  /* ==========================================================
     REQUEST
     ========================================================== */

  const response =
    await api.get(
      "/questions/practice-session",
      {
        params,
      },
    );

  console.log(
    "[CBT API] Response:",
    response,
  );

  /* ==========================================================
     NORMALIZE
     ========================================================== */

  return normalizePracticeSession(
    response,
  );
}

/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const cbtApi = {
  createCbtSession,
};

export default cbtApi;