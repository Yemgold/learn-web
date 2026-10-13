"use client";

import type { LiveQuestion } from "./quizSocketTypes";
import { unwrapPayload } from "./quizSocketUtils";

/* ================================================================
   TYPES
================================================================ */

export type UnknownObject = Record<string, unknown>;

const QUESTION_KEYS = [
  "currentQuestion",
  "current_question",
  "activeQuestion",
  "active_question",
  "questionData",
  "question_data",
  "question",
  "data",
  "result",
  "payload",
] as const;

const QUESTION_NUMBER_KEYS = [
  "questionNumber",
  "question_number",
  "currentQuestionNumber",
  "current_question_number",
  "questionIndex",
  "question_index",
  "currentQuestionIndex",
  "current_question_index",
] as const;

const QUESTION_ID_KEYS = [
  "currentQuestionId",
  "current_question_id",
  "questionId",
  "question_id",
] as const;

const MAX_EXTRACTION_DEPTH = 6;

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

function hasQuestionText(
  value: UnknownObject,
): boolean {
  return [
    value.question,
    value.content,
    value.text,
  ].some(
    (candidate) =>
      typeof candidate === "string" &&
      candidate.trim().length > 0,
  );
}

/* ================================================================
   QUESTION DETECTION
================================================================ */

/**
 * A valid display question must contain:
 * - Actual question text.
 * - An options array.
 *
 * A room object containing currentQuestionId is NOT a question.
 */
export function isQuestionObject(
  value: unknown,
): value is UnknownObject {
  if (!isRecord(value)) {
    return false;
  }

  return (
    hasQuestionText(value) &&
    Array.isArray(value.options) &&
    value.options.length > 0
  );
}

/* ================================================================
   GENERIC NESTED EXTRACTION
================================================================ */

/**
 * Search known payload wrappers without traversing arbitrary
 * participant arrays, metadata, or unrelated room properties.
 */
function findNestedValue(
  root: unknown,
  predicate: (value: unknown) => boolean,
  depth = 0,
  visited = new Set<object>(),
): unknown {
  if (predicate(root)) {
    return root;
  }

  if (
    !isRecord(root) ||
    depth >= MAX_EXTRACTION_DEPTH ||
    visited.has(root)
  ) {
    return undefined;
  }

  visited.add(root);

  for (const key of QUESTION_KEYS) {
    if (!(key in root)) {
      continue;
    }

    const result = findNestedValue(
      root[key],
      predicate,
      depth + 1,
      visited,
    );

    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
}

/* ================================================================
   QUESTION EXTRACTION
================================================================ */

/**
 * Supports direct questions and common socket/REST wrappers:
 *
 * { question: "...", options: [...] }
 *
 * { data: { question: "...", options: [...] } }
 *
 * { result: { currentQuestion: {...} } }
 *
 * { payload: { data: { question: {...} } } }
 *
 * Room-state-only payloads correctly return undefined.
 */
export function extractQuestion(
  payload: unknown,
): UnknownObject | undefined {
  // Check the original payload first. A question's "question"
  // property may contain the actual question text.
  if (isQuestionObject(payload)) {
    return payload;
  }

  const directResult = findNestedValue(
    payload,
    isQuestionObject,
  );

  if (isQuestionObject(directResult)) {
    return directResult;
  }

  // Some API/socket responses become recognizable after
  // unwrapPayload() removes their outer envelope.
  let unwrapped: unknown;

  try {
    unwrapped = unwrapPayload(payload);
  } catch (error) {
    console.warn(
      "[quizSocketQuestion] Unable to unwrap payload:",
      error,
    );

    return undefined;
  }

  if (isQuestionObject(unwrapped)) {
    return unwrapped;
  }

  const unwrappedResult = findNestedValue(
    unwrapped,
    isQuestionObject,
  );

  if (isQuestionObject(unwrappedResult)) {
    return unwrappedResult;
  }

  // A room-state event can legitimately contain only a question ID.
  // Do not log the entire room object or its participant data.
  const questionId = extractQuestionId(payload);

  if (questionId) {
    console.debug(
      "[quizSocketQuestion] Payload contains room state, " +
        "but no complete question. REST recovery may be required.",
      {
        questionId,
        questionNumber: extractQuestionNumber(payload),
      },
    );
  }

  return undefined;
}

/* ================================================================
   QUESTION ID EXTRACTION
================================================================ */

/**
 * Used by the socket controller to decide whether to load
 * missing question data through the existing REST controller.
 */
export function extractQuestionId(
  payload: unknown,
): string | undefined {
  function findId(
    value: unknown,
    depth = 0,
    visited = new Set<object>(),
  ): string | undefined {
    if (
      !isRecord(value) ||
      depth > MAX_EXTRACTION_DEPTH ||
      visited.has(value)
    ) {
      return undefined;
    }

    visited.add(value);

    for (const key of QUESTION_ID_KEYS) {
      const candidate = value[key];

      if (
        typeof candidate === "string" &&
        candidate.trim().length > 0
      ) {
        return candidate.trim();
      }

      // MongoDB-style identifiers may occasionally be wrapped.
      if (
        isRecord(candidate) &&
        typeof candidate.toString === "function"
      ) {
        const id = candidate.toString();

        if (
          id !== "[object Object]" &&
          id.trim().length > 0
        ) {
          return id.trim();
        }
      }
    }

    for (const key of QUESTION_KEYS) {
      const result = findId(
        value[key],
        depth + 1,
        visited,
      );

      if (result) {
        return result;
      }
    }

    return undefined;
  }

  return findId(payload);
}

/* ================================================================
   QUESTION NUMBER EXTRACTION
================================================================ */

export function extractQuestionNumber(
  payload: unknown,
): number | undefined {
  function findNumber(
    value: unknown,
    depth = 0,
    visited = new Set<object>(),
  ): number | undefined {
    if (
      !isRecord(value) ||
      depth > MAX_EXTRACTION_DEPTH ||
      visited.has(value)
    ) {
      return undefined;
    }

    visited.add(value);

    for (const key of QUESTION_NUMBER_KEYS) {
      const candidate = value[key];

      if (
        typeof candidate === "number" &&
        Number.isFinite(candidate)
      ) {
        // Do not use a negative array index as a question number.
        if (candidate >= 0) {
          return candidate;
        }
      }
    }

    for (const key of QUESTION_KEYS) {
      const result = findNumber(
        value[key],
        depth + 1,
        visited,
      );

      if (result !== undefined) {
        return result;
      }
    }

    return undefined;
  }

  const directResult = findNumber(payload);

  if (directResult !== undefined) {
    return directResult;
  }

  let unwrapped: unknown;

  try {
    unwrapped = unwrapPayload(payload);
  } catch {
    return undefined;
  }

  return findNumber(unwrapped);
}

/* ================================================================
   PLAY QUESTION
================================================================ */

export function hasPlayableQuestion(
  question: LiveQuestion | null | undefined,
): boolean {
  if (!question) {
    return false;
  }

  const value = question as unknown;

  return isQuestionObject(value);
}