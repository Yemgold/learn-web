

"use client";

import type { LiveQuestion } from "./quizSocketTypes";
import { unwrapPayload } from "./quizSocketUtils";

/* ================================================================
   TYPES
================================================================ */

export type UnknownObject = Record<string, unknown>;

/* ================================================================
   OBJECT HELPERS
================================================================ */

export function isRecord(
  value: unknown,
): value is UnknownObject {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/* ================================================================
   QUESTION DETECTION
================================================================ */

export function isQuestionObject(
  value: unknown,
): value is UnknownObject {
  if (!isRecord(value)) {
    return false;
  }

  if (!Array.isArray(value.options)) {
    return false;
  }

  return (
    typeof value.question === "string" ||
    typeof value.content === "string" ||
    typeof value.text === "string"
  );
}

/* ================================================================
   QUESTION EXTRACTION
================================================================ */

/**
 * Extract a question from the different payload shapes currently
 * used by the Quiz Board socket events.
 *
 * IMPORTANT:
 * We check the original payload before unwrapPayload().
 *
 * Some backend payloads look like:
 *
 * {
 *   question: "actual question text",
 *   options: [...]
 * }
 *
 * If we unwrap this first, the `question` property can be
 * incorrectly interpreted as a wrapper.
 */
export function extractQuestion(
  payload: unknown,
): UnknownObject | undefined {
  /* --------------------------------------------------------------
     1. Direct payload
  -------------------------------------------------------------- */

  if (isQuestionObject(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return undefined;
  }

  /* --------------------------------------------------------------
     2. Direct question containers
  -------------------------------------------------------------- */

  const directCandidates: unknown[] = [
    payload.currentQuestion,
    payload.current_question,
    payload.activeQuestion,
    payload.active_question,
    payload.questionData,
    payload.question_data,
  ];

  for (const candidate of directCandidates) {
    if (isQuestionObject(candidate)) {
      return candidate;
    }
  }

  /* --------------------------------------------------------------
     3. data
  -------------------------------------------------------------- */

  const data = payload.data;

  if (isQuestionObject(data)) {
    return data;
  }

  if (isRecord(data)) {
    const nestedCandidates: unknown[] = [
      data.question,
      data.currentQuestion,
      data.current_question,
      data.activeQuestion,
      data.active_question,
      data.questionData,
      data.question_data,
    ];

    for (const candidate of nestedCandidates) {
      if (isQuestionObject(candidate)) {
        return candidate;
      }
    }
  }

  /* --------------------------------------------------------------
     4. result
  -------------------------------------------------------------- */

  const result = payload.result;

  if (isQuestionObject(result)) {
    return result;
  }

  if (isRecord(result)) {
    const nestedCandidates: unknown[] = [
      result.question,
      result.currentQuestion,
      result.current_question,
      result.activeQuestion,
      result.active_question,
      result.questionData,
      result.question_data,
    ];

    for (const candidate of nestedCandidates) {
      if (isQuestionObject(candidate)) {
        return candidate;
      }
    }
  }

  /* --------------------------------------------------------------
     5. Unwrapped payload
  -------------------------------------------------------------- */

  const unwrapped: unknown =
    unwrapPayload(payload);

  if (isQuestionObject(unwrapped)) {
    return unwrapped;
  }

  if (!isRecord(unwrapped)) {
    return undefined;
  }

  /* --------------------------------------------------------------
     6. Unwrapped direct containers
  -------------------------------------------------------------- */

  const unwrappedCandidates: unknown[] = [
    unwrapped.currentQuestion,
    unwrapped.current_question,
    unwrapped.activeQuestion,
    unwrapped.active_question,
    unwrapped.questionData,
    unwrapped.question_data,
  ];

  for (const candidate of unwrappedCandidates) {
    if (isQuestionObject(candidate)) {
      return candidate;
    }
  }

  /* --------------------------------------------------------------
     7. Unwrapped data
  -------------------------------------------------------------- */

  const unwrappedData =
    unwrapped.data;

  if (isQuestionObject(unwrappedData)) {
    return unwrappedData;
  }

  if (isRecord(unwrappedData)) {
    if (
      isQuestionObject(
        unwrappedData.question,
      )
    ) {
      return unwrappedData.question;
    }

    const dataCandidates: unknown[] = [
      unwrappedData.currentQuestion,
      unwrappedData.current_question,
      unwrappedData.activeQuestion,
      unwrappedData.active_question,
      unwrappedData.questionData,
      unwrappedData.question_data,
    ];

    for (const candidate of dataCandidates) {
      if (isQuestionObject(candidate)) {
        return candidate;
      }
    }
  }

  /* --------------------------------------------------------------
     8. Unwrapped result
  -------------------------------------------------------------- */

  const unwrappedResult =
    unwrapped.result;

  if (isQuestionObject(unwrappedResult)) {
    return unwrappedResult;
  }

  if (isRecord(unwrappedResult)) {
    if (
      isQuestionObject(
        unwrappedResult.question,
      )
    ) {
      return unwrappedResult.question;
    }

    const resultCandidates: unknown[] = [
      unwrappedResult.currentQuestion,
      unwrappedResult.current_question,
      unwrappedResult.activeQuestion,
      unwrappedResult.active_question,
      unwrappedResult.questionData,
      unwrappedResult.question_data,
    ];

    for (const candidate of resultCandidates) {
      if (isQuestionObject(candidate)) {
        return candidate;
      }
    }
  }

  console.warn(
    "[quizSocketQuestion] Unable to extract question from payload:",
    payload,
  );

  return undefined;
}

/* ================================================================
   QUESTION NUMBER EXTRACTION
================================================================ */

export function extractQuestionNumber(
  payload: unknown,
): number | undefined {
  if (!isRecord(payload)) {
    return undefined;
  }

  /* --------------------------------------------------------------
     Direct payload
  -------------------------------------------------------------- */

  const directCandidates: unknown[] = [
    payload.questionNumber,
    payload.question_number,
    payload.currentQuestionNumber,
    payload.current_question_number,
    payload.questionIndex,
    payload.question_index,
  ];

  for (const candidate of directCandidates) {
    if (
      typeof candidate === "number" &&
      Number.isFinite(candidate)
    ) {
      return candidate;
    }
  }

  /* --------------------------------------------------------------
     data
  -------------------------------------------------------------- */

  const data = payload.data;

  if (isRecord(data)) {
    const dataCandidates: unknown[] = [
      data.questionNumber,
      data.question_number,
      data.currentQuestionNumber,
      data.current_question_number,
      data.questionIndex,
      data.question_index,
    ];

    for (const candidate of dataCandidates) {
      if (
        typeof candidate === "number" &&
        Number.isFinite(candidate)
      ) {
        return candidate;
      }
    }
  }

  /* --------------------------------------------------------------
     unwrapped payload
  -------------------------------------------------------------- */

  const unwrapped: unknown =
    unwrapPayload(payload);

  if (!isRecord(unwrapped)) {
    return undefined;
  }

  const unwrappedCandidates: unknown[] = [
    unwrapped.questionNumber,
    unwrapped.question_number,
    unwrapped.currentQuestionNumber,
    unwrapped.current_question_number,
    unwrapped.questionIndex,
    unwrapped.question_index,
  ];

  for (const candidate of unwrappedCandidates) {
    if (
      typeof candidate === "number" &&
      Number.isFinite(candidate)
    ) {
      return candidate;
    }
  }

  /* --------------------------------------------------------------
     unwrapped data
  -------------------------------------------------------------- */

  const unwrappedData =
    unwrapped.data;

  if (isRecord(unwrappedData)) {
    const dataCandidates: unknown[] = [
      unwrappedData.questionNumber,
      unwrappedData.question_number,
      unwrappedData.currentQuestionNumber,
      unwrappedData.current_question_number,
      unwrappedData.questionIndex,
      unwrappedData.question_index,
    ];

    for (const candidate of dataCandidates) {
      if (
        typeof candidate === "number" &&
        Number.isFinite(candidate)
      ) {
        return candidate;
      }
    }
  }

  return undefined;
}

/* ================================================================
   PLAY QUESTION
================================================================ */

export function hasPlayableQuestion(
  question: LiveQuestion | null | undefined,
): boolean {
  return Boolean(
    question &&
      (question.question ||
        question.options),
  );
}
