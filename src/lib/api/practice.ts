

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

// /* ============================================================
//    CREATE / LOAD PRACTICE SESSION
// ============================================================ */

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
 */
export async function createPracticeSession(
  payload: CreatePracticeSessionPayload,
): Promise<CreatePracticeSessionResponse> {
  const response =
    await api.get<CreatePracticeSessionResponse>(
      "/questions/practice-session",
      {
        params: {
          subjectId: payload.subjectId,

          mode: payload.mode,

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





// // src/lib/api/practice.ts

// import { api } from "./axios";

// /* ============================================================
//    TYPES
// ============================================================ */

// /**
//  * Practice modes supported by the backend.
//  */
// export type PracticeMode =
//   | "quick practice"
//   | "standard practice"
//   | "timed practice";

// /* ============================================================
//    CREATE PRACTICE SESSION PAYLOAD
// ============================================================ */

// export interface CreatePracticeSessionPayload {
//   subjectId: string;

//   mode: PracticeMode;

//   questionCount: number;

//   duration: number;

//   examType: string;
// }

// /* ============================================================
//    PRACTICE OPTION
// ============================================================ */

// export interface PracticeOption {
//   label: string;

//   value: string;
// }

// /* ============================================================
//    PRACTICE MODE DETAILS
// ============================================================ */

// export interface PracticeModeDetails {
//   _id: string;

//   name: PracticeMode;

//   description: string;

//   timePerQuestion: number;

//   awardedPointPerCorrectAnswer: number;

//   isActive: boolean;

//   __v?: number;

//   createdAt?: string;

//   updatedAt?: string;
// }

// /* ============================================================
//    PRACTICE QUESTION
// ============================================================ */

// export interface PracticeQuestion {
//   _id: string;

//   content: unknown[];

//   question: string;

//   imageId: string | null;

//   passageId: string | null;

//   media: unknown;

//   options: PracticeOption[];

//   apiQuestionId: string;

//   topic: string | null;

//   section: string;

//   answer: string;

//   solution: string;

//   explanation: string;

//   examType: string;

//   examYear: string;

//   apiSubjectName: string;

//   difficulty: string;

//   plan: string;

//   /**
//    * Backend currently returns the subject ObjectId
//    * in this field.
//    */
//   subject: string;

//   questionType: string;

//   correctAnswers: string[];

//   isMultipleAnswer: boolean;

//   marks: number;

//   __v?: number;

//   createdAt?: string;

//   updatedAt?: string;
// }

// /* ============================================================
//    PRACTICE SESSION DATA
// ============================================================ */

// /**
//  * Data returned when creating/loading a practice session.
//  *
//  * IMPORTANT:
//  *
//  * practiceId is the backend practice identifier.
//  *
//  * It is NOT the same thing as the frontend/local
//  * CBT sessionId.
//  */
// export interface PracticeSessionDetails {
//   /**
//    * Backend practice identifier.
//    *
//    * Used when marking:
//    *
//    * PATCH
//    * /questions/mark-practice-session-by-practiceId/{practiceId}
//    */
//   practiceId: string;

//   /**
//    * Practice mode configuration returned by backend.
//    */
//   practiceMode?: PracticeModeDetails;

//   subjectId: string;

//   mode: PracticeMode;

//   questionCount: number;

//   /**
//    * Duration returned by backend.
//    *
//    * Example:
//    *
//    * quick practice
//    * 10 questions
//    * 25 seconds/question
//    *
//    * duration = 250
//    */
//   duration: number;

//   questions: PracticeQuestion[];
// }

// /* ============================================================
//    CREATE PRACTICE SESSION RESPONSE
// ============================================================ */

// export interface CreatePracticeSessionResponse {
//   success: boolean;

//   message: string;

//   data: PracticeSessionDetails;
// }

// /* ============================================================
//    MARK PRACTICE SESSION
// ============================================================ */

// /**
//  * One student's answer sent to the backend.
//  *
//  * Example:
//  *
//  * {
//  *   questionId: "6a611c68c39832f2f9d63242",
//  *   selectedOption: "b"
//  * }
//  */
// export interface MarkPracticeQuestion {
//   questionId: string;

//   selectedOption: string;
// }

// /* ============================================================
//    MARK PRACTICE SESSION PAYLOAD
// ============================================================ */

// export interface MarkPracticeSessionPayload {
//   questions: MarkPracticeQuestion[];
// }

// /* ============================================================
//    MARK PRACTICE SESSION RESPONSE
// ============================================================ */

// /**
//  * The exact fields returned by your marking endpoint
//  * were not included yet.
//  *
//  * Therefore the response data is intentionally flexible.
//  *
//  * Once you provide the actual PATCH response, this can
//  * be tightened to the exact backend result interface.
//  */
// export interface MarkPracticeSessionResponse {
//   success: boolean;

//   message: string;

//   data?: Record<string, unknown> | null;
// }

// /* ============================================================
//    CREATE / LOAD PRACTICE SESSION
// ============================================================ */

// /**
//  * Backend endpoint:
//  *
//  * GET /api/v1/questions/practice-session
//  *
//  * Actual api client path:
//  *
//  * GET /questions/practice-session
//  *
//  * Query parameters:
//  *
//  * subjectId
//  * mode
//  * questionCount
//  * duration
//  * examType
//  *
//  * IMPORTANT:
//  *
//  * This endpoint returns the complete practice session,
//  * including:
//  *
//  * - practiceId
//  * - practiceMode
//  * - subjectId
//  * - mode
//  * - questionCount
//  * - duration
//  * - questions
//  */
// export async function createPracticeSession(
//   payload: CreatePracticeSessionPayload,
// ): Promise<CreatePracticeSessionResponse> {
//   const response =
//     await api.get<CreatePracticeSessionResponse>(
//       "/questions/practice-session",
//       {
//         params: {
//           subjectId: payload.subjectId,

//           mode: payload.mode,

//           questionCount:
//             payload.questionCount,

//           duration:
//             payload.duration,

//           examType:
//             payload.examType,
//         },
//       },
//     );

//   return response.data;
// }

// /* ============================================================
//    MARK PRACTICE SESSION
// ============================================================ */

// /**
//  * Marks a student's practice session.
//  *
//  * Backend endpoint:
//  *
//  * PATCH
//  * /api/v1/questions/mark-practice-session-by-practiceId/{practiceId}
//  *
//  * Actual api client path:
//  *
//  * PATCH
//  * /questions/mark-practice-session-by-practiceId/{practiceId}
//  *
//  * Request body:
//  *
//  * {
//  *   questions: [
//  *     {
//  *       questionId: "...",
//  *       selectedOption: "b"
//  *     }
//  *   ]
//  * }
//  *
//  * IMPORTANT:
//  *
//  * practiceId MUST be the backend practiceId returned by
//  * createPracticeSession().
//  *
//  * It must NOT be the frontend-generated CBT sessionId.
//  */
// export async function markPracticeSession(
//   practiceId: string,
//   payload: MarkPracticeSessionPayload,
// ): Promise<MarkPracticeSessionResponse> {
//   if (!practiceId?.trim()) {
//     throw new Error(
//       "Cannot mark practice session: practiceId is missing.",
//     );
//   }

//   const response =
//     await api.patch<MarkPracticeSessionResponse>(
//       `/questions/mark-practice-session-by-practiceId/${encodeURIComponent(
//         practiceId,
//       )}`,
//       payload,
//     );

//   return response.data;
// }




