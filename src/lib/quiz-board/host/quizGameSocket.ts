// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\host\quizGameSocket.ts

import type { Socket } from "socket.io-client";

import { getQuizSocket } from "@/lib/socket/quizSocket";

/* ============================================================
   HOST QUIZ SOCKET
   ============================================================

   HOST SOCKET RESPONSIBILITIES
   ------------------------------------------------------------

   1. START QUESTIONS
      Event:
        start_questions

      Purpose:
        Request the complete question set for a round.

      Response:
        getting_room_questions_ack

   ------------------------------------------------------------

   2. DISPLAY NEXT QUESTION
      Event:
        display_next_question

      Purpose:
        Push ONE question selected by the host into the room.

      Response:
        Host acknowledgement.

      Broadcast:
        new_question_displayed

      The backend generates startTime.

   ------------------------------------------------------------

   IMPORTANT
   ------------------------------------------------------------

   This file does NOT:

   - calculate scores
   - determine correct answers
   - determine first correct
   - eliminate contestants
   - calculate leaderboard
   - decide whether an answer is correct
   - generate startTime
   - expose isCorrect to contestants

   The backend remains authoritative for those operations.

   ============================================================ */


/* ============================================================
   EVENT NAMES
   ============================================================ */

export const HOST_QUIZ_SOCKET_EVENTS = {
  /* ----------------------------------------------------------
     ROUND QUESTIONS
     ---------------------------------------------------------- */

  START_QUESTIONS: "start_questions",

  GETTING_ROOM_QUESTIONS_ACK:
    "getting_room_questions_ack",


  /* ----------------------------------------------------------
     QUESTION DISPLAY
     ---------------------------------------------------------- */

  DISPLAY_NEXT_QUESTION:
    "display_next_question",

  NEW_QUESTION_DISPLAYED:
    "new_question_displayed",


  /* ----------------------------------------------------------
     GENERIC
     ---------------------------------------------------------- */

  SOCKET_ERROR:
    "socket_error",

  MESSAGE:
    "message",
} as const;


/* ============================================================
   TYPES
   ============================================================ */

export interface StartQuestionsPayload {
  quizId: string;
  roomId: string;
  roundNumber: number;
}


/* ============================================================
   QUESTION OPTION
   ============================================================

   IMPORTANT

   isCorrect is intentionally NOT part of the public
   question option sent through display_next_question.

   The host may receive complete questions containing
   isCorrect from the backend, but the value is stripped
   before the question is pushed to the room.
   ============================================================ */

export interface QuizQuestionOption {
  id: string;
  text: string;
}


/* ============================================================
   CONTENT BLOCK
   ============================================================

   We intentionally keep this flexible because your existing
   Solve & Win content blocks can contain different structures.
   ============================================================ */

export interface SolveAndWinContentBlock {
  type?: string;
  order?: number;
  text?: string;

  [key: string]: unknown;
}


/* ============================================================
   QUESTION
   ============================================================ */

export interface HostQuizQuestion {
  id: string;

  subjectId: string;

  content: SolveAndWinContentBlock[];

  question: string;

  questionNumber: number;

  options: QuizQuestionOption[];

  section: string;

  questionType: string;

  isMultipleAnswer: boolean;

  explanation: string;

  explanationSteps: SolveAndWinContentBlock[];

  difficulty: string;

  passageId?: string;

  instruction?: string;

  media?: SolveAndWinContentBlock | null;

  /*
   * HOST ONLY.
   *
   * These fields may exist in the complete question response.
   *
   * They MUST NOT be included in display_next_question.
   */

  correctAnswer?: string | null;

  correctAnswers?: string[];

  answerKey?: string | string[] | null;

  correctValues?: string[];

  /*
   * Backend may provide this internally.
   */
  optionsWithAnswers?: Array<
    QuizQuestionOption & {
      isCorrect?: boolean;
    }
  >;
}


/* ============================================================
   PUBLIC DISPLAY QUESTION
   ============================================================

   This is the exact safe question structure sent to:

      display_next_question

   and received from:

      new_question_displayed
   ============================================================ */

export interface PublicQuizQuestion {
  id: string;

  subjectId: string;

  content: SolveAndWinContentBlock[];

  question: string;

  questionNumber: number;

  options: QuizQuestionOption[];

  section: string;

  questionType: string;

  isMultipleAnswer: boolean;

  explanation: string;

  explanationSteps: SolveAndWinContentBlock[];

  difficulty: string;

  passageId?: string;

  instruction?: string;

  media?: SolveAndWinContentBlock | null;
}


/* ============================================================
   DISPLAY NEXT QUESTION PAYLOAD
   ============================================================ */

export interface DisplayNextQuestionPayload {
  quizId: string;

  roomId: string;

  question: PublicQuizQuestion;
}


/* ============================================================
   START QUESTIONS ACK DATA
   ============================================================ */

export interface GettingRoomQuestionsAckData {
  message: string;

  questions: HostQuizQuestion[];

  quizId: string;

  roomId: string;

  roundNumber: number;
}


/* ============================================================
   START QUESTIONS ACK
   ============================================================ */

export interface GettingRoomQuestionsAck {
  event: "getting_room_questions_ack";

  data: GettingRoomQuestionsAckData;
}


/* ============================================================
   DISPLAY QUESTION ACK
   ============================================================ */

export interface DisplayNextQuestionAck {
  success: boolean;

  message: string;
}


/* ============================================================
   BROADCAST QUESTION
   ============================================================ */

export interface NewQuestionDisplayedPayload
  extends PublicQuizQuestion {
  quizId: string;

  /*
   * Generated by backend.
   *
   * Example:
   * 2026-09-26T12:00:00.000Z
   */
  startTime: string;
}


/* ============================================================
   GENERIC SOCKET ERROR
   ============================================================ */

export interface QuizSocketErrorPayload {
  message?: string;

  error?: string;

  reason?: string;

  statusCode?: number;

  status?: string;
}


/* ============================================================
   INTERNAL HELPERS
   ============================================================ */

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}


function asString(
  value: unknown,
): string | null {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  return null;
}


function asNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}


function asBoolean(
  value: unknown,
): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  return null;
}


/* ============================================================
   PAYLOAD DATA
   ============================================================ */

function getPayloadData(
  payload: unknown,
): unknown {
  if (!isRecord(payload)) {
    return payload;
  }

  if ("data" in payload) {
    return payload.data;
  }

  if ("payload" in payload) {
    return payload.payload;
  }

  return payload;
}


/* ============================================================
   QUESTION OPTION NORMALIZATION
   ============================================================ */

function normalizeQuestionOption(
  value: unknown,
): QuizQuestionOption | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    asString(value.id) ??
    asString(value._id);

  const text =
    asString(value.text) ??
    asString(value.label) ??
    asString(value.value);

  if (!id || !text) {
    return null;
  }

  return {
    id,
    text,
  };
}


/* ============================================================
   CONTENT BLOCK NORMALIZATION
   ============================================================ */

function normalizeContentBlocks(
  value: unknown,
): SolveAndWinContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    isRecord,
  ) as SolveAndWinContentBlock[];
}

/* ============================================================
   QUESTION NORMALIZATION
   ============================================================ */

function normalizeHostQuestion(
  value: unknown,
): HostQuizQuestion | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    asString(value.id) ??
    asString(value._id);

  const subjectId =
    asString(value.subjectId) ??
    asString(value.subject_id) ??
    "";

  const question =
    asString(value.question) ??
    asString(value.text) ??
    "";

  const questionNumber =
    asNumber(value.questionNumber) ??
    asNumber(value.question_number);

  if (
    !id ||
    !question ||
    questionNumber === null
  ) {
    return null;
  }

  const rawOptions =
    Array.isArray(value.options)
      ? value.options
      : [];

  /*
   * Public / normalised options.
   *
   * normalizeQuestionOption() returns
   * QuizQuestionOption | null, so the predicate
   * explicitly tells TypeScript that null values
   * have been removed.
   */
  const options =
    rawOptions
      .map(normalizeQuestionOption)
      .filter(
        (
          option,
        ): option is QuizQuestionOption =>
          option !== null,
      );

  const correctAnswers =
    Array.isArray(
      value.correctAnswers,
    )
      ? value.correctAnswers
          .map(asString)
          .filter(
            (
              item,
            ): item is string =>
              Boolean(item),
          )
      : undefined;

  const answerKey =
    typeof value.answerKey === "string" ||
    Array.isArray(value.answerKey)
      ? value.answerKey
      : null;

  const correctAnswer =
    asString(
      value.correctAnswer,
    ) ??
    asString(
      value.correct_answer,
    );

  const correctValues =
    Array.isArray(
      value.correctValues,
    )
      ? value.correctValues
          .map(asString)
          .filter(
            (
              item,
            ): item is string =>
              Boolean(item),
          )
      : undefined;

  /*
   * Host-only options.
   *
   * These are allowed to contain isCorrect because
   * the host is allowed to see the answer information.
   *
   * The mapped value is explicitly:
   *
   * {
   *   ...QuizQuestionOption,
   *   isCorrect?: boolean
   * }
   *
   * or null before filtering.
   */
  const optionsWithAnswers:
    | Array<
        QuizQuestionOption & {
          isCorrect?: boolean;
        }
      >
    | undefined =
    Array.isArray(value.options)
      ? value.options
          .filter(isRecord)
          .map(
            (
              option,
            ): (
              | (QuizQuestionOption & {
                  isCorrect?: boolean;
                })
              | null
            ) => {
              const normalized =
                normalizeQuestionOption(
                  option,
                );

              if (!normalized) {
                return null;
              }

              const isCorrect =
                asBoolean(
                  option.isCorrect,
                ) ??
                asBoolean(
                  option.is_correct,
                );

              return {
                ...normalized,

                ...(isCorrect !== null
                  ? {
                      isCorrect,
                    }
                  : {}),
              };
            },
          )
          .filter(
            (
              option,
            ): option is QuizQuestionOption & {
              isCorrect?: boolean;
            } =>
              option !== null,
          )
      : undefined;

  return {
    id,

    subjectId,

    content:
      normalizeContentBlocks(
        value.content,
      ),

    question,

    questionNumber,

    options,

    section:
      asString(value.section) ??
      "",

    questionType:
      asString(
        value.questionType,
      ) ??
      asString(
        value.question_type,
      ) ??
      "",

    isMultipleAnswer:
      asBoolean(
        value.isMultipleAnswer,
      ) ??
      asBoolean(
        value.is_multiple_answer,
      ) ??
      false,

    explanation:
      asString(
        value.explanation,
      ) ??
      "",

    explanationSteps:
      normalizeContentBlocks(
        value.explanationSteps ??
          value.explanation_steps,
      ),

    difficulty:
      asString(
        value.difficulty,
      ) ??
      "",

    passageId:
      asString(
        value.passageId,
      ) ??
      asString(
        value.passage_id,
      ) ??
      undefined,

    instruction:
      asString(
        value.instruction,
      ) ??
      undefined,

    media:
      isRecord(value.media)
        ? (value.media as SolveAndWinContentBlock)
        : null,

    correctAnswer,

    correctAnswers,

    answerKey,

    correctValues,

    optionsWithAnswers,
  };
}

/* ============================================================
   QUESTION ARRAY EXTRACTION
   ============================================================ */

function extractQuestions(
  payload: unknown,
): HostQuizQuestion[] {
  const data =
    getPayloadData(payload);

  if (Array.isArray(data)) {
    return data
      .map(
        normalizeHostQuestion,
      )
      .filter(
        (
          question,
        ): question is HostQuizQuestion =>
          Boolean(question),
      );
  }

  if (!isRecord(data)) {
    return [];
  }

  const candidates = [
    data.questions,
    data.questionList,
    data.question_list,
    data.roundQuestions,
    data.round_questions,
    data.items,
  ];

  for (
    const candidate of candidates
  ) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    const questions =
      candidate
        .map(
          normalizeHostQuestion,
        )
        .filter(
          (
            question,
          ): question is HostQuizQuestion =>
            Boolean(question),
        );

    if (questions.length > 0) {
      return questions;
    }
  }

  const single =
    normalizeHostQuestion(data);

  return single
    ? [single]
    : [];
}


/* ============================================================
   STRIP ANSWER INFORMATION
   ============================================================

   This is CRITICAL.

   A host question may contain:

      isCorrect
      correctAnswer
      correctAnswers
      answerKey
      correctValues

   None of those values should be sent to:

      display_next_question

   ============================================================ */

function toPublicQuestion(
  question: HostQuizQuestion,
): PublicQuizQuestion {
  const safeOptions =
    question.options.map(
      (option) => ({
        id: option.id,
        text: option.text,
      }),
    );

  return {
    id:
      question.id,

    subjectId:
      question.subjectId,

    content:
      question.content,

    question:
      question.question,

    questionNumber:
      question.questionNumber,

    options:
      safeOptions,

    section:
      question.section,

    questionType:
      question.questionType,

    isMultipleAnswer:
      question.isMultipleAnswer,

    explanation:
      question.explanation,

    explanationSteps:
      question.explanationSteps,

    difficulty:
      question.difficulty,

    passageId:
      question.passageId,

    instruction:
      question.instruction,

    media:
      question.media,
  };
}


/* ============================================================
   SOCKET CONTROLLER
   ============================================================ */

export class HostQuizGameSocket {
  private readonly socket: Socket;

  private readonly quizId: string;

  private readonly roomId: string;

  private listeners: Array<{
    event: string;
    handler: (...args: unknown[]) => void;
  }> = [];

  private connected = false;

  private currentQuestions: HostQuizQuestion[] = [];

  private currentRound = 1;


  constructor(
    quizId: string,
    roomId: string,
  ) {
    this.quizId =
      String(quizId).trim();

    this.roomId =
      String(roomId).trim();

    this.socket =
      getQuizSocket();
  }


  /* ==========================================================
     GET SOCKET
     ========================================================== */

  getSocket(): Socket {
    return this.socket;
  }


  /* ==========================================================
     GET CURRENT QUESTIONS
     ========================================================== */

  getQuestions(): HostQuizQuestion[] {
    return [
      ...this.currentQuestions,
    ];
  }


  /* ==========================================================
     GET CURRENT ROUND
     ========================================================== */

  getRoundNumber(): number {
    return this.currentRound;
  }


  /* ==========================================================
     CONNECTED
     ========================================================== */

  isConnected(): boolean {
    return (
      this.connected ||
      this.socket.connected
    );
  }


  /* ==========================================================
     BIND
     ========================================================== */

  bind(): void {
    if (this.listeners.length > 0) {
      return;
    }

    const handleConnect =
      () => {
        this.connected = true;

        console.log(
          "[Host Quiz Socket] Connected:",
          this.socket.id,
        );
      };


    const handleDisconnect =
      (reason: unknown) => {
        this.connected = false;

        console.log(
          "[Host Quiz Socket] Disconnected:",
          reason,
        );
      };


    const handleConnectError =
      (error: unknown) => {
        this.connected = false;

        console.error(
          "[Host Quiz Socket] Connection error:",
          error,
        );
      };


    this.addListener(
      "connect",
      handleConnect,
    );

    this.addListener(
      "disconnect",
      handleDisconnect,
    );

    this.addListener(
      "connect_error",
      handleConnectError,
    );


    /*
     * Server acknowledgement for start_questions.
     */
    this.addListener(
      HOST_QUIZ_SOCKET_EVENTS.GETTING_ROOM_QUESTIONS_ACK,
      (
        payload,
      ) => {
        console.log(
          "[Host Quiz Socket] getting_room_questions_ack:",
          payload,
        );
      },
    );


    /*
     * Backend broadcasts the question to everyone.
     */
    this.addListener(
      HOST_QUIZ_SOCKET_EVENTS.NEW_QUESTION_DISPLAYED,
      (
        payload,
      ) => {
        console.log(
          "[Host Quiz Socket] new_question_displayed:",
          payload,
        );
      },
    );


    this.addListener(
      HOST_QUIZ_SOCKET_EVENTS.SOCKET_ERROR,
      (
        payload,
      ) => {
        console.error(
          "[Host Quiz Socket] socket_error:",
          payload,
        );
      },
    );


    this.addListener(
      HOST_QUIZ_SOCKET_EVENTS.MESSAGE,
      (
        payload,
      ) => {
        console.log(
          "[Host Quiz Socket] message:",
          payload,
        );
      },
    );


    if (this.socket.connected) {
      this.connected = true;
    }
  }


  /* ==========================================================
     START QUESTIONS
     ==========================================================

     Event:

       start_questions

     Payload:

       {
         quizId,
         roomId,
         roundNumber
       }

     Backend response:

       getting_room_questions_ack

     The questions are stored locally for the host.
     ========================================================== */

  startQuestions(
    roundNumber: number,
  ): void {
    const normalizedRound =
      Math.max(
        1,
        Math.floor(
          Number(roundNumber) || 1,
        ),
      );

    const payload:
      StartQuestionsPayload = {
      quizId:
        this.quizId,

      roomId:
        this.roomId,

      roundNumber:
        normalizedRound,
    };

    this.currentRound =
      normalizedRound;

    console.log(
      "[Host Quiz Socket] start_questions:",
      payload,
    );

    this.socket.emit(
      HOST_QUIZ_SOCKET_EVENTS.START_QUESTIONS,
      payload,
    );
  }


  /* ==========================================================
     HANDLE START QUESTIONS ACK
     ========================================================== */

  handleGettingRoomQuestionsAck(
    payload: unknown,
  ): HostQuizQuestion[] {
    const data =
      getPayloadData(payload);

    if (!isRecord(data)) {
      return [];
    }

    const questions =
      extractQuestions(data);

    if (questions.length === 0) {
      console.warn(
        "[Host Quiz Socket] No questions returned.",
      );

      return [];
    }

    this.currentQuestions =
      questions.map(
        (
          question,
          index,
        ) => ({
          ...question,

          questionNumber:
            question.questionNumber ||
            index + 1,
        }),
      );

    return this.getQuestions();
  }


  /* ==========================================================
     DISPLAY NEXT QUESTION
     ==========================================================

     Event:

       display_next_question

     Payload:

       {
         quizId,
         roomId,
         question
       }

     IMPORTANT:

     The question is converted into a PUBLIC question before
     it is sent.

     Therefore:

       isCorrect
       correctAnswer
       correctAnswers
       answerKey
       correctValues

     are never sent.

     Backend generates:

       startTime
     ========================================================== */

  displayNextQuestion(
    question:
      HostQuizQuestion,
  ): void {
    const publicQuestion =
      toPublicQuestion(
        question,
      );

    const payload:
      DisplayNextQuestionPayload = {
      quizId:
        this.quizId,

      roomId:
        this.roomId,

      question:
        publicQuestion,
    };

    console.log(
      "[Host Quiz Socket] display_next_question:",
      {
        quizId:
          this.quizId,

        roomId:
          this.roomId,

        questionId:
          publicQuestion.id,

        questionNumber:
          publicQuestion.questionNumber,
      },
    );

    this.socket.emit(
      HOST_QUIZ_SOCKET_EVENTS.DISPLAY_NEXT_QUESTION,
      payload,
    );
  }


  /* ==========================================================
     DISPLAY QUESTION BY NUMBER
     ========================================================== */

  displayQuestionByNumber(
    questionNumber: number,
  ): void {
    const normalized =
      Math.floor(
        Number(questionNumber),
      );

    if (
      !Number.isFinite(normalized) ||
      normalized < 1
    ) {
      throw new Error(
        "Question number must be at least 1.",
      );
    }

    const question =
      this.currentQuestions.find(
        (
          item,
        ) =>
          item.questionNumber ===
          normalized,
      );

    if (!question) {
      throw new Error(
        `Question ${normalized} was not found in the loaded round questions.`,
      );
    }

    this.displayNextQuestion(
      question,
    );
  }


  /* ==========================================================
     REGISTER LISTENER
     ========================================================== */

  private addListener(
    event: string,
    handler: (
      ...args: unknown[]
    ) => void,
  ): void {
    this.socket.on(
      event,
      handler,
    );

    this.listeners.push({
      event,
      handler,
    });
  }


  /* ==========================================================
     REMOVE LISTENERS
     ========================================================== */

  dispose(): void {
    for (
      const {
        event,
        handler,
      } of this.listeners
    ) {
      this.socket.off(
        event,
        handler,
      );
    }

    this.listeners = [];
  }
}


/* ============================================================
   FACTORY
   ============================================================ */

export function createHostQuizGameSocket(
  quizId: string,
  roomId: string,
): HostQuizGameSocket {
  const controller =
    new HostQuizGameSocket(
      quizId,
      roomId,
    );

  controller.bind();

  return controller;
}


/* ============================================================
   OPTIONAL UTILITY
   ============================================================ */

/**
 * Converts a complete host question into the exact public
 * question that may be pushed into the room.
 *
 * This can also be imported by tests or other host services.
 */
export function sanitizeQuestionForRoom(
  question: HostQuizQuestion,
): PublicQuizQuestion {
  return toPublicQuestion(
    question,
  );
}

