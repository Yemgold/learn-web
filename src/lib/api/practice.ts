




// src/lib/api/practice.ts

import { api } from "./axios";

/* ============================================================
   TYPES
============================================================ */

export type PracticeMode =
  | "quick practice"
  | "standard practice"
  | "timed practice";

/* ============================================================
   CREATE PRACTICE SESSION PAYLOAD
============================================================ */

export interface CreatePracticeSessionPayload {
  subjectId: string;
  mode: PracticeMode;
  questionCount: number;
  duration: number;
  examType: string;
}

/* ============================================================
   PRACTICE OPTION
============================================================ */

export interface PracticeOption {
  label: string;
  value: string;
}

/* ============================================================
   PRACTICE QUESTION
============================================================ */

export interface PracticeQuestion {
  _id: string;

  content: unknown[];

  question: string;

  imageId: string | null;

  passageId: string | null;

  media: unknown;

  options: PracticeOption[];

  apiQuestionId: string;

  topic: string | null;

  section: string;

  answer: string;

  solution: string;

  explanation: string;

  examType: string;

  examYear: string;

  apiSubjectName: string;

  difficulty: string;

  plan: string;

  subject: string;

  questionType: string;

  correctAnswers: string[];

  isMultipleAnswer: boolean;

  marks: number;

  __v?: number;

  createdAt?: string;

  updatedAt?: string;
}

/* ============================================================
   PRACTICE MODE
============================================================ */

export interface PracticeModeDetails {
  _id: string;

  name: PracticeMode;

  description: string;

  timePerQuestion: number;

  awardedPointPerCorrectAnswer: number;

  isActive: boolean;

  __v?: number;

  createdAt?: string;

  updatedAt?: string;
}

/* ============================================================
   PRACTICE SESSION DATA
============================================================ */

export interface PracticeSessionDetails {
  practiceId: string;

  practiceMode: PracticeModeDetails;

  subjectId: string;

  mode: PracticeMode;

  questionCount: number;

  duration: number;

  questions: PracticeQuestion[];
}

/* ============================================================
   CREATE PRACTICE SESSION RESPONSE
============================================================ */

export interface CreatePracticeSessionResponse {
  success: boolean;

  message: string;

  data: PracticeSessionDetails;
}

/* ============================================================
   CREATE / LOAD PRACTICE SESSION
============================================================ */

/**
 * Backend endpoint:
 *
 * GET /api/v1/questions/practice-session
 *
 * Actual api client path:
 *
 * GET /questions/practice-session
 *
 * Query parameters:
 *
 * subjectId
 * mode
 * questionCount
 * duration
 * examType
 *
 * IMPORTANT:
 *
 * This endpoint returns the complete practice session,
 * including:
 *
 * - practiceId
 * - practiceMode
 * - subjectId
 * - mode
 * - questionCount
 * - duration
 * - questions
 *
 * The backend can return:
 *
 * 400
 * {
 *   "message": "Insufficient wallet balance.",
 *   "success": false,
 *   "status": 400
 * }
 *
 * That response is converted into a normal application
 * response so the configuration page can display a
 * friendly wallet message instead of throwing an Axios error.
 */
export async function createPracticeSession(
  payload: CreatePracticeSessionPayload,
): Promise<CreatePracticeSessionResponse> {
  try {
    const response =
      await api.get<CreatePracticeSessionResponse>(
        "/questions/practice-session",
        {
          params: {
            subjectId:
              payload.subjectId,

            mode:
              payload.mode,

            questionCount:
              payload.questionCount,

            duration:
              payload.duration,

            examType:
              payload.examType,
          },
        },
      );

    return response.data;
  } catch (error: any) {
    const status =
      error?.response?.status;

    const message =
      error?.response?.data?.message;

    const normalizedMessage =
      typeof message === "string"
        ? message
            .trim()
            .toLowerCase()
        : "";

    /* ========================================================
       INSUFFICIENT WALLET BALANCE
    ======================================================== */

    if (
      status === 400 &&
      normalizedMessage ===
        "insufficient wallet balance."
    ) {
      console.warn(
        "[Practice API] Insufficient wallet balance.",
      );

      return {
        success: false,
        message:
          "Insufficient CBT Points. Please fund your practice wallet to start this practice session.",
        data: {
          practiceId: "",
          practiceMode: {
            _id: "",
            name: payload.mode,
            description: "",
            timePerQuestion: 0,
            awardedPointPerCorrectAnswer: 0,
            isActive: false,
          },
          subjectId:
            payload.subjectId,
          mode:
            payload.mode,
          questionCount:
            payload.questionCount,
          duration:
            payload.duration,
          questions: [],
        },
      };
    }

    /* ========================================================
       ALL OTHER ERRORS
       
       Keep real server/network errors as errors.
       ======================================================== */

    throw error;
  }
}

/* ============================================================
   MARK PRACTICE SESSION
============================================================ */

/**
 * PATCH
 * /api/v1/questions/mark-practice-session-by-practiceId/{practiceId}
 *
 * No request body is required.
 */
export async function markPracticeSession(
  practiceId: string,
  questions: Array<{
    questionId: string;
    selectedOption: string | null;
  }>,
) {
  console.log(
    "========== markPracticeSession ==========",
  );

  console.log(
    "1. Function received practiceId:",
    practiceId,
  );

  console.log(
    "2. Questions received:",
    questions,
  );

  const cleanPracticeId =
    practiceId?.trim();

  if (!cleanPracticeId) {
    console.error(
      "3. Practice ID is empty",
    );

    throw new Error(
      "Practice ID is required to mark the practice session.",
    );
  }

  if (!Array.isArray(questions)) {
    console.error(
      "4. Questions is not an array:",
      questions,
    );

    throw new Error(
      "Questions must be an array.",
    );
  }

  const endpoint =
    `/questions/mark-practice-session-by-practiceId/${encodeURIComponent(
      cleanPracticeId,
    )}`;

  console.log(
    "5. Endpoint:",
    endpoint,
  );

  console.log(
    "6. Request body:",
    {
      questions,
    },
  );

  console.log(
    "7. ABOUT TO CALL api.patch",
  );

  const response =
    await api.patch(endpoint, {
      questions,
    });

  console.log(
    "8. api.patch RETURNED",
  );

  console.log(
    "9. Axios response:",
    response,
  );

  console.log(
    "10. Axios response.data:",
    response.data,
  );

  return response.data;
}