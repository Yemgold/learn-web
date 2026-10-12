





import axios from "axios";
import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   QUIZ GAME HTTP CONTROLLER
   ============================================================

   PURPOSE
   ------------------------------------------------------------
   Provides REST API access for the Quiz Board host and
   frontend recovery when WebSocket communication fails.

   RESPONSIBILITIES
   ------------------------------------------------------------
   - Load quiz metadata.
   - Load questions for a specific room and round.
   - Normalize common backend response formats.
   - Log unrecognized API responses for debugging.
   - Preserve Axios errors and response metadata.
   - Project questions for students without answer keys.

   IMPORTANT
   ------------------------------------------------------------
   This file does not broadcast questions to participants.
   Broadcasting and synchronization must be handled separately
   by the backend or the existing socket/fallback controller.
   ============================================================ */

/* ============================================================
   TYPES
   ============================================================ */

export type QuizGameHttpQuestion = {
  id: string;
  question: string;
  instruction?: string;
  options: unknown[];
  correctAnswers?: unknown[];
  answer?: unknown;
  explanation?: string;
  image?: string;
  questionNumber?: number;
  [key: string]: unknown;
};

export type QuizGameHttpRound = {
  quizId: string;
  roomId?: string;
  roundNumber: number;
  totalQuestions: number;
  questions: QuizGameHttpQuestion[];
};

export type QuizGameHttpQuiz = {
  id: string;
  title: string;
  subject?: string;
  description?: string;
  totalRounds?: number;
  totalQuestions?: number;
  [key: string]: unknown;
};

export type QuizGameStudentQuestion = {
  id: string;
  question: string;
  instruction?: string;
  options: unknown[];
  image?: string;
  questionNumber?: number;
  [key: string]: unknown;
};

type UnknownRecord = Record<string, unknown>;

type NormalizedQuestionResult = {
  question: QuizGameHttpQuestion;
  hasQuestionText: boolean;
};

/* ============================================================
   GENERAL HELPERS
   ============================================================ */

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function firstValue(
  record: UnknownRecord,
  keys: string[],
): unknown {
  for (const key of keys) {
    const value = record[key];

    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

function firstString(
  record: UnknownRecord,
  keys: string[],
): string | undefined {
  const value = firstValue(record, keys);

  if (isNonEmptyString(value)) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function firstArray(
  record: UnknownRecord,
  keys: string[],
): unknown[] | undefined {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (isRecord(responseData)) {
      const serverMessage = firstString(responseData, [
        "message",
        "error",
        "detail",
        "msg",
      ]);

      if (serverMessage) {
        return serverMessage;
      }
    }

    return error.message || "The HTTP request failed.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

/* ============================================================
   RESPONSE UNWRAPPING
   ============================================================ */

/**
 * Unwrap common API envelopes without assuming that every
 * property named "data" is an envelope.
 *
 * Supported examples:
 *
 * { data: { questions: [...] } }
 * { success: true, data: { questions: [...] } }
 * { data: { data: { questions: [...] } } }
 * { payload: { questions: [...] } }
 * { result: { questions: [...] } }
 */
function unwrapPayload(payload: unknown): unknown {
  let current = payload;

  for (let depth = 0; depth < 8; depth += 1) {
    if (Array.isArray(current) || !isRecord(current)) {
      return current;
    }

    const questionKeys = [
      "questions",
      "questionList",
      "question_list",
      "roundQuestions",
      "round_questions",
      "items",
      "questionObj",
      "question_obj",
    ];

    
    // Preserve objects that already contain a recognizable
    // question collection or a single question.
    if (isRecord(current)) {
      const hasQuestionCollection = questionKeys.some(
        (key) => Object.prototype.hasOwnProperty.call(current, key),
      );

      const hasQuestionText =
        firstValue(current, [
          "question",
          "questionText",
          "question_text",
          "text",
        ]) !== undefined;

      if (hasQuestionCollection || hasQuestionText) {
        return current;
      }
    }



    const envelopeKeys = ["data", "payload", "result"];

    let next: unknown;
    let found = false;

    for (const key of envelopeKeys) {
      const value = current[key];

      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value) || isRecord(value)) {
        next = value;
        found = true;
        break;
      }
    }

    if (!found) {
      return current;
    }

    current = next;
  }

  return current;
}

/* ============================================================
   QUESTION NORMALIZATION
   ============================================================ */

function normalizeOptions(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  // Some APIs return options as an object:
  // { A: "...", B: "...", C: "...", D: "..." }
  if (isRecord(value)) {
    return Object.entries(value).map(([key, option]) => ({
      label: key,
      value: option,
    }));
  }

  return [];
}

function normalizeAnswerArray(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return [value];
}

function normalizeQuestion(
  value: unknown,
  index = 0,
): NormalizedQuestionResult | null {
  if (!isRecord(value)) {
    return null;
  }

  // Support { question: { ...question fields... } }.
  const nestedQuestion = value.question;

  const source =
    isRecord(nestedQuestion) &&
    firstValue(nestedQuestion, [
      "question",
      "text",
      "content",
      "questionText",
      "question_text",
      "statement",
      "title",
    ]) !== undefined
      ? nestedQuestion
      : value;

  if (!isRecord(source)) {
    return null;
  }

  const questionText = firstString(source, [
    "question",
    "text",
    "content",
    "questionText",
    "question_text",
    "questionTitle",
    "question_title",
    "statement",
    "title",
    "body",
    "prompt",
  ]);

  // Never treat an arbitrary object as a question merely because
  // it has an ID. We need actual question text.
  if (!questionText) {
    return null;
  }

  const id =
    firstString(source, [
      "id",
      "_id",
      "questionId",
      "question_id",
      "uuid",
      "questionUuid",
      "question_uuid",
    ]) ??
    firstString(value, [
      "id",
      "_id",
      "questionId",
      "question_id",
    ]) ??
    `frontend-question-${index + 1}`;

  const optionsValue = firstValue(source, [
    "options",
    "choices",
    "answers",
    "optionList",
    "option_list",
  ]);

  const correctAnswers = normalizeAnswerArray(
    firstValue(source, [
      "correctAnswers",
      "correct_answers",
      "correctAnswer",
      "correct_answer",
      "correctOption",
      "correct_option",
      "answerKey",
      "answer_key",
      "answer",
      "answersKey",
    ]),
  );

  const explanation = firstString(source, [
    "explanation",
    "solution",
    "answerExplanation",
    "answer_explanation",
  ]);

  const instruction = firstString(source, [
    "instruction",
    "instructions",
    "directions",
  ]);

  const image = firstString(source, [
    "image",
    "imageUrl",
    "image_url",
    "questionImage",
    "question_image",
  ]);

  const rawNumber = firstValue(source, [
    "questionNumber",
    "question_number",
    "number",
    "sequence",
    "order",
  ]);

  const questionNumber =
    typeof rawNumber === "number" && Number.isFinite(rawNumber)
      ? rawNumber
      : typeof rawNumber === "string" &&
          rawNumber.trim() !== "" &&
          Number.isFinite(Number(rawNumber))
        ? Number(rawNumber)
        : undefined;

  const normalized: QuizGameHttpQuestion = {
    ...source,
    id,
    question: questionText,
    options: normalizeOptions(optionsValue),
  };

  if (instruction) {
    normalized.instruction = instruction;
  }

  if (correctAnswers) {
    normalized.correctAnswers = correctAnswers;
  }

  if (explanation) {
    normalized.explanation = explanation;
  }

  if (image) {
    normalized.image = image;
  }

  if (questionNumber !== undefined) {
    normalized.questionNumber = questionNumber;
  }

  // Preserve the backend answer fields for trusted host-side
  // processing. They are removed by toStudentQuestion().
  return {
    question: normalized,
    hasQuestionText: true,
  };
}

/* ============================================================
   QUESTION COLLECTION EXTRACTION
   ============================================================ */

function extractQuestions(payload: unknown): QuizGameHttpQuestion[] {
  const visited = new Set<unknown>();
  const collected: QuizGameHttpQuestion[] = [];

  const collectionKeys = [
    "questions",
    "questionList",
    "question_list",
    "roundQuestions",
    "round_questions",
    "questionObj",
    "question_obj",
    "items",
    "records",
    "results",
  ];

  const nestedKeys = [
    "data",
    "payload",
    "result",
    "round",
    "quiz",
    "competition",
    "currentRound",
    "current_round",
    "questionSet",
    "question_set",
  ];

  function addArray(items: unknown[]): void {
    for (const item of items) {
      const normalized = normalizeQuestion(item, collected.length);

      if (normalized) {
        collected.push(normalized.question);
      }
    }
  }

  function visit(value: unknown, depth = 0): void {
    if (
      depth > 8 ||
      value === null ||
      value === undefined ||
      visited.has(value)
    ) {
      return;
    }

    if (typeof value === "object") {
      visited.add(value);
    }

    if (Array.isArray(value)) {
      addArray(value);

      // Some APIs return a collection of wrappers, each containing
      // its own question collection.
      if (collected.length === 0) {
        for (const item of value) {
          visit(item, depth + 1);
        }
      }

      return;
    }

    if (!isRecord(value)) {
      return;
    }

    // Prefer known question collections over unrelated arrays
    // such as participants, leaderboard entries, or options.
    for (const key of collectionKeys) {
      const candidate = value[key];

      if (Array.isArray(candidate)) {
        const before = collected.length;
        addArray(candidate);

        if (collected.length > before) {
          return;
        }
      }
    }

    // Handle nested structures such as:
    // { round: { questions: [...] } }
    // { data: { round: { questionList: [...] } } }
    for (const key of nestedKeys) {
      const nested = value[key];

      if (nested !== undefined && nested !== null) {
        visit(nested, depth + 1);

        if (collected.length > 0) {
          return;
        }
      }
    }

    // Handle an API that returns one question instead of an array.
    const single = normalizeQuestion(value, collected.length);

    if (single) {
      collected.push(single.question);
    }
  }

  visit(payload);

  // Remove duplicate questions if the same data was exposed through
  // multiple API envelope properties.
  const seen = new Set<string>();

  return collected.filter((question) => {
    const fingerprint = `${question.id}:${question.question}`;

    if (seen.has(fingerprint)) {
      return false;
    }

    seen.add(fingerprint);
    return true;
  });
}

/* ============================================================
   QUIZ NORMALIZATION
   ============================================================ */

function normalizeQuiz(payload: unknown): QuizGameHttpQuiz | null {
  const unwrapped = unwrapPayload(payload);

  if (!isRecord(unwrapped)) {
    return null;
  }

  const source =
    isRecord(unwrapped.quiz)
      ? unwrapped.quiz
      : isRecord(unwrapped.data) && !Array.isArray(unwrapped.data)
        ? unwrapped.data
        : unwrapped;

  const id = firstString(source, [
    "id",
    "_id",
    "quizId",
    "quiz_id",
  ]);

  if (!id) {
    return null;
  }

  const title =
    firstString(source, [
      "title",
      "name",
      "quizTitle",
      "quiz_title",
    ]) ?? "Quiz";

  const subject = firstString(source, [
    "subject",
    "subjectName",
    "subject_name",
  ]);

  const description = firstString(source, [
    "description",
    "instructions",
  ]);

  const rawRounds = firstValue(source, [
    "totalRounds",
    "total_rounds",
    "numberOfRounds",
    "number_of_rounds",
    "rounds",
  ]);

  const rawQuestions = firstValue(source, [
    "totalQuestions",
    "total_questions",
    "numberOfQuestions",
    "number_of_questions",
  ]);

  const totalRounds =
    typeof rawRounds === "number"
      ? rawRounds
      : typeof rawRounds === "string" && rawRounds.trim() !== ""
        ? Number(rawRounds)
        : undefined;

  const totalQuestions =
    typeof rawQuestions === "number"
      ? rawQuestions
      : typeof rawQuestions === "string" && rawQuestions.trim() !== ""
        ? Number(rawQuestions)
        : undefined;

  return {
    ...source,
    id,
    title,
    ...(subject ? { subject } : {}),
    ...(description ? { description } : {}),
    ...(Number.isFinite(totalRounds) ? { totalRounds } : {}),
    ...(Number.isFinite(totalQuestions) ? { totalQuestions } : {}),
  };
}

/* ============================================================
   HTTP CONTROLLER
   ============================================================ */

export class QuizGameHttpController {
  private readonly quizId: string;
  private readonly roomId?: string;

  constructor(quizId: string, roomId?: string) {
    this.quizId = quizId;
    this.roomId = roomId;
  }

  /* ----------------------------------------------------------
     LOAD QUIZ METADATA
     ---------------------------------------------------------- */

  async getQuiz(): Promise<QuizGameHttpQuiz> {
    const endpoint = `/quiz/get-quiz-by-quizId/${encodeURIComponent(
      this.quizId,
    )}`;

    try {
      const response = await axiosInstance.get(endpoint);

      const quiz = normalizeQuiz(response.data);

      if (!quiz) {
        console.error(
          "[QuizGameHttpController] Could not normalize quiz metadata",
          {
            quizId: this.quizId,
            endpoint,
            status: response.status,
            responseData: response.data,
          },
        );

        throw new Error(
          "The server returned quiz data in an unrecognized format.",
        );
      }

      return quiz;
    } catch (error: unknown) {
      console.error(
        "[QuizGameHttpController] Failed to load quiz metadata",
        {
          quizId: this.quizId,
          endpoint,
          message: getErrorMessage(error),
          status: axios.isAxiosError(error)
            ? error.response?.status
            : undefined,
          responseData: axios.isAxiosError(error)
            ? error.response?.data
            : undefined,
          error,
        },
      );

      // Preserve the original Axios error and its response metadata.
      throw error;
    }
  }

  /* ----------------------------------------------------------
     LOAD QUESTIONS FOR A ROUND
     ---------------------------------------------------------- */

  async getRoundQuestions(
    roundNumber = 1,
    roomIdOverride?: string,
  ): Promise<QuizGameHttpRound> {
    const normalizedRound = Math.max(
      1,
      Math.floor(Number(roundNumber) || 1),
    );

    const roomId = roomIdOverride ?? this.roomId;

    if (!roomId) {
      throw new Error(
        "A roomId is required to load questions for a quiz round.",
      );
    }

    const endpoint =
      `/quiz/get-round-questions/` +
      `${encodeURIComponent(this.quizId)}/` +
      `${encodeURIComponent(roomId)}`;

    const params = {
      roundNumber: normalizedRound,
    };

    try {
      const response = await axiosInstance.get(endpoint, { params });

      // Log the raw response before normalization. This is the key
      // diagnostic for the "no recognizable questions" error.
      console.debug(
        "[QuizGameHttpController] ROUND RAW API RESPONSE",
        {
          quizId: this.quizId,
          roomId,
          roundNumber: normalizedRound,
          endpoint,
          params,
          status: response.status,
          responseData: response.data,
        },
      );

      const questions = extractQuestions(response.data);

      if (questions.length === 0) {
        console.error(
          "[QuizGameHttpController] ROUND RESPONSE CONTAINS NO RECOGNIZABLE QUESTIONS",
          {
            quizId: this.quizId,
            roomId,
            roundNumber: normalizedRound,
            endpoint,
            params,
            status: response.status,
            topLevelKeys: isRecord(response.data)
              ? Object.keys(response.data)
              : [],
            responseData: response.data,
          },
        );

        throw new Error(
          `The server returned no recognizable questions for round ${normalizedRound}. ` +
            "Check the ROUND RAW API RESPONSE log for the actual backend payload.",
        );
      }

      const numberedQuestions = questions.map((question, index) => ({
        ...question,
        questionNumber: question.questionNumber ?? index + 1,
      }));

      return {
        quizId: this.quizId,
        roomId,
        roundNumber: normalizedRound,
        totalQuestions: numberedQuestions.length,
        questions: numberedQuestions,
      };
    } catch (error: unknown) {
      console.error(
        "[QuizGameHttpController] ROUND REQUEST FAILED",
        {
          quizId: this.quizId,
          roomId,
          roundNumber: normalizedRound,
          endpoint,
          params,
          message: getErrorMessage(error),
          code: axios.isAxiosError(error) ? error.code : undefined,
          status: axios.isAxiosError(error)
            ? error.response?.status
            : undefined,
          responseData: axios.isAxiosError(error)
            ? error.response?.data
            : undefined,
          requestExists: axios.isAxiosError(error)
            ? Boolean(error.request)
            : false,
          error,
        },
      );

      // Do not wrap the error in a new Error: doing so discards
      // Axios response details and makes diagnosis harder.
      throw error;
    }
  }

  /* ----------------------------------------------------------
     LOAD ALL ROUNDS
     ---------------------------------------------------------- */

  async getAllRounds(
    totalRounds: number,
    roomIdOverride?: string,
  ): Promise<QuizGameHttpRound[]> {
    const count = Math.max(
      0,
      Math.floor(Number(totalRounds) || 0),
    );

    const rounds: QuizGameHttpRound[] = [];

    for (let roundNumber = 1; roundNumber <= count; roundNumber += 1) {
      const round = await this.getRoundQuestions(
        roundNumber,
        roomIdOverride,
      );

      rounds.push(round);
    }

    return rounds;
  }

  /* ----------------------------------------------------------
     STUDENT-SAFE QUESTION PROJECTION
     ---------------------------------------------------------- */

  toStudentQuestion(
    question: QuizGameHttpQuestion,
  ): QuizGameStudentQuestion {
    const {
      correctAnswers: _correctAnswers,
      correctAnswer: _correctAnswer,
      correct_answer: _correctAnswerSnake,
      correctOption: _correctOption,
      correct_option: _correctOptionSnake,
      answer: _answer,
      answerKey: _answerKey,
      answer_key: _answerKeySnake,
      answersKey: _answersKey,
      explanation: _explanation,
      solution: _solution,
      ...studentQuestion
    } = question;

    return {
      ...studentQuestion,
      id: question.id,
      question: question.question,
      options: question.options,
    };
  }

  toStudentQuestions(
    questions: QuizGameHttpQuestion[],
  ): QuizGameStudentQuestion[] {
    return questions.map((question) =>
      this.toStudentQuestion(question),
    );
  }
}

/* ============================================================
   FACTORY
   ============================================================ */

export function createQuizGameHttpController(
  quizId: string,
  roomId?: string,
): QuizGameHttpController {
  return new QuizGameHttpController(quizId, roomId);
}

