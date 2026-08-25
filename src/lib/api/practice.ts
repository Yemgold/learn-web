

// // src/lib/api/practice.ts

// import { api } from "./axios";

// /* ============================================================
//    TYPES
//    ============================================================ */

// export type PracticeMode =
//   | "quick"
//   | "standard"
//   | "timed";

// export interface CreatePracticeSessionPayload {
//   subjectId: string;
//   mode: PracticeMode;
//   questionCount: number;
//   duration: number;
//   examType: string;
// }

// export interface PracticeOption {
//   label: string;
//   value: string;
// }

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

//   subject: string;

//   questionType: string;

//   correctAnswers: string[];

//   isMultipleAnswer: boolean;

//   marks: number;
// }

// export interface CreatePracticeSessionResponse {
//   success: boolean;

//   message: string;

//   data: {
//     subjectId: string;

//     mode: PracticeMode;

//     questionCount: number;

//     duration: number;

//     questions: PracticeQuestion[];
//   };
// }

// /* ============================================================
//    CREATE PRACTICE SESSION
//    ============================================================ */

// /**
//  * Creates a practice session and retrieves the questions.
//  *
//  * Backend endpoint:
//  *
//  * GET /api/v1/questions/practice-session
//  *
//  * Query parameters:
//  *
//  * subjectId
//  * mode
//  * questionCount
//  * duration
//  * examType
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

//           duration: payload.duration,

//           examType: payload.examType,
//         },
//       },
//     );

//   return response.data;
// }







// src/lib/api/practice.ts

import { api } from "./axios";

/* ============================================================
   TYPES
============================================================ */

export type PracticeMode =
  | "quick"
  | "standard"
  | "timed";

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
}

/* ============================================================
   PRACTICE SESSION DATA
============================================================ */

export interface PracticeSessionDetails {
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
 * including the questions.
 *
 * There is currently NO separate:
 *
 * GET /practice/sessions/{sessionId}
 *
 * endpoint in the backend contract.
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