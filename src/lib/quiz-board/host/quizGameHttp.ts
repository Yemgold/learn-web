
import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   QUIZ GAME HTTP CONTROLLER
   ============================================================

   PURPOSE
   ------------------------------------------------------------
   Provides HTTP recovery for the HOST Quiz Board.

   Responsibilities:
   - Load quiz information.
   - Load round questions.
   - Recover round questions after a socket disconnect.
   - Normalize API response formats.
   - Provide a student-display projection that removes answer
     fields from an already-loaded question object.

   SECURITY
   ------------------------------------------------------------
   getRoundQuestions() may return correct answers.

   This controller is HOST-ONLY.

   Removing answer keys in frontend code does not protect them
   from a student if they have already been sent to the browser.
   Student-facing endpoints must omit answer keys on the server.

   LIVE GAME ACTIONS
   ------------------------------------------------------------
   Starting questions, validating answers, determining the
   fastest correct answer, scoring, locking questions and
   advancing rounds remain server-authoritative.
   ============================================================ */

/* ============================================================
   TYPES
============================================================ */

export interface QuizGameHttpOption {
  label: string;
  value: string;
  text: string;
}

export interface QuizGameHttpQuestion {
  id: string;
  question: string;
  options: QuizGameHttpOption[];

  questionNumber: number | null;
  totalQuestions: number | null;
  timeLimit: number | null;

  startedAt: string | null;
  expiresAt: string | null;

  /** Host-only answer data. */
  correctAnswer?: string | null;
  correctAnswers?: string[];
  answerKey?: string | string[] | null;
  correctValues?: string[];
}

export interface QuizGameHttpRound {
  quizId: string;
  roundNumber: number;
  totalQuestions: number;
  questions: QuizGameHttpQuestion[];
}

export interface QuizGameHttpQuiz {
  id: string;
  title: string;
  subject: string;
  description: string;

  currentRound: number;
  numberOfRounds: number;
  timePerQuestion: number;

  contestants: number;
  joinedCount: number;

  roomId: string | null;
  status: string | null;
}

/* ============================================================
   GENERIC HELPERS
============================================================ */

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

/**
 * Supports common API wrappers such as:
 *
 * { data: {...} }
 * { success: true, data: {...} }
 * { payload: {...} }
 *
 * Stops after a small number of unwraps to avoid infinite loops.
 */
function unwrapPayload(payload: unknown): unknown {
  let current: unknown = payload;

  for (let depth = 0; depth < 5; depth += 1) {
    if (!isRecord(current)) {
      return current;
    }

    const keys = Object.keys(current);

    const hasData = Object.prototype.hasOwnProperty.call(
      current,
      "data",
    );

    const hasPayload = Object.prototype.hasOwnProperty.call(
      current,
      "payload",
    );

    if (
      hasData &&
      (
        keys.length === 1 ||
        "success" in current ||
        "statusCode" in current ||
        "message" in current
      )
    ) {
      current = current.data;
      continue;
    }

    if (hasPayload && keys.length <= 4) {
      current = current.payload;
      continue;
    }

    return current;
  }

  return current;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isRecord(error)) {
    return fallback;
  }

  const response = isRecord(error.response)
    ? error.response
    : null;

  const responseData =
    response && isRecord(response.data)
      ? response.data
      : null;

  const serverMessage = responseData?.message;

  if (
    typeof serverMessage === "string" &&
    serverMessage.trim()
  ) {
    return serverMessage.trim();
  }

  const message = error.message;

  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }

  return fallback;
}

/* ============================================================
   OPTION NORMALIZATION
============================================================ */

function normalizeOption(
  value: unknown,
  index: number,
): QuizGameHttpOption {
  const defaultLabel = String.fromCharCode(65 + index);

  if (!isRecord(value)) {
    const text = asString(value) ?? "";

    return {
      label: defaultLabel,
      value: text,
      text,
    };
  }

  const text =
    asString(value.text) ??
    asString(value.label) ??
    asString(value.value) ??
    "";

  return {
    label: asString(value.label) ?? defaultLabel,
    value: asString(value.value) ?? text,
    text,
  };
}

/* ============================================================
   ANSWER NORMALIZATION
============================================================ */

function normalizeStringArray(
  value: unknown,
): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map(asString)
    .filter((item): item is string => item !== null);
}

function normalizeAnswerKey(
  value: unknown,
): string | string[] | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map(asString)
      .filter((item): item is string => item !== null);
  }

  return null;
}

/* ============================================================
   QUESTION NORMALIZATION
============================================================ */

function normalizeQuestion(
  value: unknown,
): QuizGameHttpQuestion | null {
  if (!isRecord(value)) {
    return null;
  }

  /*
   * Supports both:
   *
   * { id, question: "Question text", options: [...] }
   *
   * and:
   *
   * { question: { id, question: "Question text", options: [...] } }
   */

  const nestedQuestion = isRecord(value.question)
    ? value.question
    : null;

  const source = nestedQuestion ?? value;

  const id =
    asString(source.id) ??
    asString(source._id) ??
    asString(value.questionId) ??
    asString(value.question_id);

  const questionText =
    asString(source.question) ??
    asString(source.text) ??
    asString(source.content);

  if (!id || !questionText) {
    return null;
  }

  const rawOptions = Array.isArray(source.options)
    ? source.options
    : Array.isArray(source.choices)
      ? source.choices
      : [];

  const options = rawOptions.map((option, index) =>
    normalizeOption(option, index),
  );

  const correctAnswer =
    asString(source.correctAnswer) ??
    asString(source.correct_answer);

  const correctAnswers =
    normalizeStringArray(
      source.correctAnswers ??
      source.correct_answers ??
      source.correctValues ??
      source.correct_values,
    );

  const answerKey = normalizeAnswerKey(
    source.answerKey ?? source.answer_key,
  );

  const questionNumber =
    asNumber(source.questionNumber) ??
    asNumber(source.question_number) ??
    asNumber(value.questionNumber) ??
    asNumber(value.question_number);

  const totalQuestions =
    asNumber(source.totalQuestions) ??
    asNumber(source.total_questions) ??
    asNumber(value.totalQuestions) ??
    asNumber(value.total_questions);

  const timeLimit =
    asNumber(source.timeLimit) ??
    asNumber(source.time_limit) ??
    asNumber(source.timePerQuestion) ??
    asNumber(source.time_per_question);

  const startedAt =
    asString(source.startedAt) ??
    asString(source.started_at);

  const expiresAt =
    asString(source.expiresAt) ??
    asString(source.expires_at);

  return {
    id,
    question: questionText,
    options,

    questionNumber,
    totalQuestions,
    timeLimit,

    startedAt,
    expiresAt,

    correctAnswer,
    correctAnswers,
    answerKey,

    correctValues: correctAnswers,
  };
}

/* ============================================================
   QUESTION ARRAY EXTRACTION
============================================================ */

function extractQuestions(
  payload: unknown,
): QuizGameHttpQuestion[] {
  const data = unwrapPayload(payload);

  if (Array.isArray(data)) {
    return data
      .map(normalizeQuestion)
      .filter(
        (question): question is QuizGameHttpQuestion =>
          question !== null,
      );
  }

  if (!isRecord(data)) {
    return [];
  }

  const nestedRound = isRecord(data.round)
    ? data.round
    : null;

  const nestedQuiz = isRecord(data.quiz)
    ? data.quiz
    : null;

  const candidates: unknown[] = [
    data.questions,
    data.questionList,
    data.question_list,
    data.roundQuestions,
    data.round_questions,
    data.items,
    nestedRound?.questions,
    nestedRound?.questionList,
    nestedRound?.question_list,
    nestedQuiz?.questions,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    const questions = candidate
      .map(normalizeQuestion)
      .filter(
        (question): question is QuizGameHttpQuestion =>
          question !== null,
      );

    if (questions.length > 0) {
      return questions;
    }
  }

  const singleQuestion = normalizeQuestion(data);

  return singleQuestion ? [singleQuestion] : [];
}

/* ============================================================
   QUIZ NORMALIZATION
============================================================ */

function normalizeQuiz(
  payload: unknown,
): QuizGameHttpQuiz | null {
  const unwrapped = unwrapPayload(payload);

  if (!isRecord(unwrapped)) {
    return null;
  }

  const data = isRecord(unwrapped.quiz)
    ? unwrapped.quiz
    : isRecord(unwrapped.quizData)
      ? unwrapped.quizData
      : unwrapped;

  const id =
    asString(data.id) ??
    asString(data._id) ??
    asString(data.quizId) ??
    asString(data.quiz_id);

  if (!id) {
    return null;
  }

  const rawJoinedUsers =
    data.joinedUsers ?? data.joined_users;

  const joinedCount =
    asNumber(data.joinedCount) ??
    asNumber(data.joined_count) ??
    (Array.isArray(rawJoinedUsers)
      ? rawJoinedUsers.length
      : asNumber(rawJoinedUsers)) ??
    0;

  return {
    id,

    title:
      asString(data.title) ??
      asString(data.quiz_title) ??
      asString(data.quizTitle) ??
      "Quiz Competition",

    subject:
      asString(data.subject) ??
      asString(data.subjectName) ??
      "Quiz",

    description:
      asString(data.description) ??
      "",

    currentRound:
      asNumber(data.currentRound) ??
      asNumber(data.current_round) ??
      0,

    numberOfRounds:
      asNumber(data.numberOfRounds) ??
      asNumber(data.number_of_rounds) ??
      asNumber(data.totalRounds) ??
      asNumber(data.total_rounds) ??
      1,

    timePerQuestion:
      asNumber(data.timePerQuestion) ??
      asNumber(data.time_per_question) ??
      30,

    contestants:
      asNumber(data.noOfContestants) ??
      asNumber(data.no_of_contestants) ??
      asNumber(data.contestants) ??
      20,

    joinedCount,

    roomId:
      asString(data.roomId) ??
      asString(data.room_id),

    status:
      asString(data.status),
  };
}

/* ============================================================
   CONTROLLER
============================================================ */

export class QuizGameHttpController {
  private readonly quizId: string;

  constructor(quizId: string) {
    this.quizId = String(quizId).trim();

    if (!this.quizId) {
      throw new Error("Quiz ID is required.");
    }
  }

  /* ==========================================================
     GET QUIZ

     GET /quiz/get-quiz-by-quizId/{quizId}
  ========================================================== */

  async getQuiz(): Promise<QuizGameHttpQuiz> {
    try {
      const response = await axiosInstance.get(
        `/quiz/get-quiz-by-quizId/${encodeURIComponent(
          this.quizId,
        )}`,
      );

      const quiz = normalizeQuiz(response.data);

      if (!quiz) {
        throw new Error(
          "The server returned quiz information in an unrecognized format.",
        );
      }

      return quiz;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load quiz information.",
        ),
      );
    }
  }

  /* ==========================================================
     GET ROUND QUESTIONS — HOST ONLY

     GET /quiz/get-round-questions/{quizId}?roundNumber=N

     roundNumber is a QUERY PARAMETER.
  ========================================================== */

  async getRoundQuestions(
    roundNumber = 1,
  ): Promise<QuizGameHttpRound> {
    const normalizedRound = Math.max(
      1,
      Math.floor(Number(roundNumber) || 1),
    );

    try {
      const response = await axiosInstance.get(
        `/quiz/get-round-questions/${encodeURIComponent(
          this.quizId,
        )}`,
        {
          params: {
            roundNumber: normalizedRound,
          },
        },
      );

      const questions = extractQuestions(response.data);

      if (questions.length === 0) {
        throw new Error(
          `The server returned no recognizable questions for round ${normalizedRound}.`,
        );
      }

      const normalizedQuestions = questions.map(
        (question, index) => ({
          ...question,
          questionNumber: question.questionNumber ?? index + 1,
          totalQuestions:
            question.totalQuestions ?? questions.length,
        }),
      );

      return {
        quizId: this.quizId,
        roundNumber: normalizedRound,
        totalQuestions: normalizedQuestions.length,
        questions: normalizedQuestions,
      };
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(
          error,
          `Unable to load questions for round ${normalizedRound}.`,
        ),
      );
    }
  }

  /* ==========================================================
     GET ALL ROUNDS — HOST ONLY
  ========================================================== */

  async getAllRounds(
    numberOfRounds: number,
  ): Promise<QuizGameHttpRound[]> {
    const totalRounds = Math.max(
      1,
      Math.floor(Number(numberOfRounds) || 1),
    );

    const rounds: QuizGameHttpRound[] = [];

    for (let round = 1; round <= totalRounds; round += 1) {
      rounds.push(await this.getRoundQuestions(round));
    }

    return rounds;
  }

  /* ==========================================================
     STUDENT DISPLAY PROJECTION

     This removes answer keys from an object already in memory.

     It does NOT make an answer-containing API safe for students.
     Student API responses must exclude answer keys on the server.
  ========================================================== */

  toStudentQuestion(
    question: QuizGameHttpQuestion,
  ): Omit<
    QuizGameHttpQuestion,
    | "correctAnswer"
    | "correctAnswers"
    | "answerKey"
    | "correctValues"
  > {
    const {
      correctAnswer: _correctAnswer,
      correctAnswers: _correctAnswers,
      answerKey: _answerKey,
      correctValues: _correctValues,
      ...studentQuestion
    } = question;

    return studentQuestion;
  }

  toStudentRound(
    round: QuizGameHttpRound,
  ): {
    quizId: string;
    roundNumber: number;
    totalQuestions: number;
    questions: Array<
      Omit<
        QuizGameHttpQuestion,
        | "correctAnswer"
        | "correctAnswers"
        | "answerKey"
        | "correctValues"
      >
    >;
  } {
    return {
      quizId: round.quizId,
      roundNumber: round.roundNumber,
      totalQuestions: round.totalQuestions,
      questions: round.questions.map((question) =>
        this.toStudentQuestion(question),
      ),
    };
  }
}

/* ============================================================
   FACTORY
============================================================ */

export function createQuizGameHttpController(
  quizId: string,
): QuizGameHttpController {
  return new QuizGameHttpController(quizId);
}
