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













// // C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\host\quizGameSocket.ts

// import type { Socket } from "socket.io-client";

// import { axiosInstance } from "@/lib/api/axios";
// import { getQuizSocket } from "@/lib/socket/quizSocket";

// /* ============================================================
//    QUIZ GAME SOCKET CONTROLLER

//    QUESTION PROGRESSION MODEL
//    ------------------------------------------------------------

//    QUESTION PROGRESSION IS CONTROLLED BY THE HOST FRONTEND.

//    The host loads the complete round question set through HTTP:

//       GET /quiz/get-round-questions/:quizId?roundNumber=N

//    Then:

//       HOST
//         │
//         │ start_question
//         ▼
//       BACKEND
//         │
//         │ question_started
//         ▼
//       ALL CLIENTS


//    After the question is finished:

//       HOST
//         │
//         │ question_locked
//         ▼
//       BACKEND
//         │
//         ├── process final answers
//         ├── determine first correct
//         ├── update scores
//         └── update leaderboard


//    Then the host decides when to continue:

//       HOST
//         │
//         │ next_question
//         ▼
//       BACKEND
//         │
//         │ question_started
//         ▼
//       NEXT QUESTION


//    IMPORTANT
//    ------------------------------------------------------------

//    The backend must NOT automatically advance:

//       Question 1 → Question 2

//    The host explicitly requests every question.

//    The backend remains authoritative for:

//    - room validation
//    - answer validation
//    - accepting/rejecting answers
//    - first-correct arbitration
//    - score calculation
//    - leaderboard
//    - elimination
//    - tiebreakers
//    - final results


//    TIMER
//    ------------------------------------------------------------

//    There is NO timer_started socket event.

//    The frontend starts its timer when question_started is received.

//    The frontend may optimistically lock the question when its
//    local timer reaches zero.

//    The backend remains authoritative about whether answers are
//    accepted and whether the question may be locked.


//    ANSWER RESULT
//    ------------------------------------------------------------

//    There is NO answer_result event.

//    Answer/score consequences are represented through:

//       participant_selected_answer
//       first_correct_answer
//       leaderboard_updated

//    ============================================================ */


// /* ============================================================
//    SOCKET EVENT NAMES

//    This object represents the agreed backend/frontend contract.
//    ============================================================ */

// export const QUIZ_GAME_EVENTS = {
//   /* ----------------------------------------------------------
//      ROOM
//      ---------------------------------------------------------- */

//   ACTIVATE_ROOM: "activate_room",

//   ROOM_ACTIVATION_ACK:
//     "room_activation_ack",

//   ROOM_ACTIVATED:
//     "room_activated",

//   JOIN_ROOM:
//     "join_room",

//   JOINED_ROOM_ACK:
//     "joined_room_ack",

//   ROOM_STATE:
//     "room_state",

//   PARTICIPANT_JOINED_ROOM:
//     "participant_joined_room",


//   /* ----------------------------------------------------------
//      ROUND
//      ---------------------------------------------------------- */

//   START_ROUND:
//     "start_round",

//   ROUND_STARTED:
//     "round_started",


//   /* ----------------------------------------------------------
//      QUESTION
//      ---------------------------------------------------------- */

//   /*
//    * HOST → BACKEND
//    *
//    * Host explicitly chooses the first question.
//    */
//   START_QUESTION:
//     "start_question",

//   /*
//    * BACKEND → FRONTEND
//    *
//    * Backend confirms/broadcasts the active question.
//    */
//   QUESTION_STARTED:
//     "question_started",

//   /*
//    * HOST → BACKEND
//    *
//    * Host explicitly requests the next question.
//    */
//   NEXT_QUESTION:
//     "next_question",

//   /*
//    * HOST → BACKEND
//    *
//    * Host locks the active question.
//    */
//   QUESTION_LOCKED:
//     "question_locked",


//   /* ----------------------------------------------------------
//      ANSWERS
//      ---------------------------------------------------------- */

//   /*
//    * STUDENT → BACKEND
//    */
//   SUBMIT_ANSWER:
//     "submit_answer",

//   /*
//    * BACKEND → FRONTEND
//    *
//    * Backend informs clients that a participant selected
//    * an answer.
//    */
//   PARTICIPANT_SELECTED_ANSWER:
//     "participant_selected_answer",

//   /*
//    * BACKEND → FRONTEND
//    *
//    * Added by backend development for first-correct handling.
//    */
//   FIRST_CORRECT_ANSWER:
//     "first_correct_answer",


//   /* ----------------------------------------------------------
//      LEADERBOARD
//      ---------------------------------------------------------- */

//   /*
//    * FRONTEND → BACKEND
//    */
//   SYNC_LEADERBOARD:
//     "sync_leaderboard",

//   /*
//    * BACKEND → FRONTEND
//    */
//   LEADERBOARD_UPDATED:
//     "leaderboard_updated",


//   /* ----------------------------------------------------------
//      TIEBREAKER
//      ---------------------------------------------------------- */

//   /*
//    * HOST → BACKEND
//    */
//   REQUEST_TIEBREAKER_QUESTION:
//     "request_tiebreaker_question",

//   /*
//    * BACKEND → FRONTEND
//    */
//   TIEBREAKER_QUESTION_STARTED:
//     "tiebreaker_question_started",

//   /*
//    * HOST → BACKEND
//    */
//   RESOLVE_TIEBREAKER_ELIMINATIONS:
//     "resolve_tiebreaker_eliminations",

//   /*
//    * BACKEND → FRONTEND
//    */
//   PARTICIPANTS_ELIMINATED:
//     "participants_eliminated",


//   /* ----------------------------------------------------------
//      GENERIC
//      ---------------------------------------------------------- */

//   MESSAGE:
//     "message",

//   SOCKET_ERROR:
//     "socket_error",
// } as const;


// /* ============================================================
//    TYPES
//    ============================================================ */

// export type QuizGameRole =
//   | "HOST"
//   | "STUDENT";


// export interface QuizGameConfig {
//   quizId: string;
//   roomId: string;
//   role: QuizGameRole;

//   numberOfRounds?: number;

//   /*
//    * Seconds.
//    */
//   timePerQuestion?: number;
// }


// /* ============================================================
//    OPTION
//    ============================================================ */

// export interface QuizGameOption {
//   label: string;
//   value: string;
//   text: string;
// }


// /* ============================================================
//    QUESTION
//    ============================================================ */

// export interface QuizGameQuestion {
//   id: string;

//   question: string;

//   options: QuizGameOption[];

//   questionNumber: number | null;

//   totalQuestions: number | null;

//   timeLimit: number | null;

//   startedAt: string | null;

//   expiresAt: string | null;

//   /*
//    * HOST ONLY.
//    *
//    * These values can exist on questions loaded through the
//    * host HTTP endpoint.
//    *
//    * They must never be exposed to students.
//    */

//   correctAnswer?: string | null;

//   correctAnswers?: string[];

//   answerKey?: string | string[] | null;

//   correctValues?: string[];
// }


// /* ============================================================
//    PARTICIPANT
//    ============================================================ */

// export interface QuizParticipant {
//   id: string;

//   userId: string | null;

//   name: string;

//   username: string | null;

//   avatar: string | null;

//   score: number;

//   position: number | null;

//   eliminated: boolean;

//   answered: boolean;

//   answerCorrect: boolean | null;

//   isFirstCorrect: boolean;

//   connected: boolean;
// }


// /* ============================================================
//    FIRST CORRECT WINNER
//    ============================================================ */

// export interface FirstCorrectWinner {
//   questionId: string;

//   contestantId: string | null;

//   userId: string | null;

//   name: string;

//   position: number | null;

//   score: number | null;

//   timestamp: string | null;
// }


// /* ============================================================
//    SCOREBOARD
//    ============================================================ */

// export interface QuizScoreboardEntry {
//   contestantId: string;

//   userId: string | null;

//   name: string;

//   score: number;

//   position: number;

//   correctAnswers: number;

//   wrongAnswers: number;

//   firstCorrectCount: number;

//   eliminated: boolean;
// }


// /* ============================================================
//    GAME STATE
//    ============================================================ */

// export interface QuizGameState {
//   quizId: string;

//   roomId: string;

//   role: QuizGameRole;

//   connected: boolean;

//   roomActivated: boolean;

//   joinedRoom: boolean;

//   roundNumber: number;

//   totalRounds: number;

//   questionNumber: number | null;

//   totalQuestions: number | null;

//   currentQuestion: QuizGameQuestion | null;

//   /*
//    * HOST:
//    *
//    * Complete round question set loaded through HTTP.
//    *
//    * STUDENT:
//    *
//    * Normally empty because students receive the active
//    * question through question_started.
//    */
//   questions: QuizGameQuestion[];

//   questionLocked: boolean;

//   timerStartedAt: string | null;

//   timerExpiresAt: string | null;

//   timeRemaining: number | null;

//   selectedAnswer: string | null;

//   answerSubmitted: boolean;

//   firstCorrectWinner: FirstCorrectWinner | null;

//   participants: QuizParticipant[];

//   scoreboard: QuizScoreboardEntry[];

//   roundCompleted: boolean;

//   quizCompleted: boolean;

//   error: string | null;
// }


// /* ============================================================
//    GENERIC HELPERS
//    ============================================================ */

// function isRecord(
//   value: unknown,
// ): value is Record<string, unknown> {
//   return (
//     typeof value === "object" &&
//     value !== null &&
//     !Array.isArray(value)
//   );
// }


// function asString(
//   value: unknown,
// ): string | null {
//   if (
//     typeof value === "string" &&
//     value.trim()
//   ) {
//     return value.trim();
//   }

//   if (
//     typeof value === "number" &&
//     Number.isFinite(value)
//   ) {
//     return String(value);
//   }

//   return null;
// }


// function asNumber(
//   value: unknown,
// ): number | null {
//   if (
//     typeof value === "number" &&
//     Number.isFinite(value)
//   ) {
//     return value;
//   }

//   if (
//     typeof value === "string" &&
//     value.trim()
//   ) {
//     const parsed =
//       Number(value);

//     if (
//       Number.isFinite(parsed)
//     ) {
//       return parsed;
//     }
//   }

//   return null;
// }


// function asBoolean(
//   value: unknown,
// ): boolean | null {
//   if (
//     typeof value === "boolean"
//   ) {
//     return value;
//   }

//   return null;
// }


// /* ============================================================
//    PAYLOAD HELPERS
//    ============================================================ */

// function getPayloadData(
//   payload: unknown,
// ): unknown {
//   if (
//     !isRecord(payload)
//   ) {
//     return payload;
//   }

//   if (
//     "data" in payload
//   ) {
//     return payload.data;
//   }

//   if (
//     "payload" in payload
//   ) {
//     return payload.payload;
//   }

//   return payload;
// }


// function getFirstRecord(
//   payload: unknown,
// ): Record<string, unknown> | null {
//   const data =
//     getPayloadData(payload);

//   return isRecord(data)
//     ? data
//     : null;
// }


// /* ============================================================
//    ID EXTRACTION
//    ============================================================ */

// function extractId(
//   value: Record<string, unknown>,
// ): string {
//   return (
//     asString(value.id) ??
//     asString(value._id) ??
//     asString(value.contestantId) ??
//     asString(value.contestant_id) ??
//     asString(value.userId) ??
//     asString(value.user_id) ??
//     ""
//   );
// }


// /* ============================================================
//    QUESTION NUMBER
//    ============================================================ */

// function extractQuestionNumber(
//   value: unknown,
// ): number | null {
//   const record =
//     getFirstRecord(value);

//   if (!record) {
//     return null;
//   }

//   return (
//     asNumber(
//       record.questionNumber,
//     ) ??
//     asNumber(
//       record.question_number,
//     ) ??
//     asNumber(
//       record.currentQuestion,
//     ) ??
//     asNumber(
//       record.current_question,
//     ) ??
//     asNumber(
//       record.questionIndex,
//     ) ??
//     asNumber(
//       record.question_index,
//     ) ??
//     null
//   );
// }


// /* ============================================================
//    ROUND NUMBER
//    ============================================================ */

// function extractRoundNumber(
//   value: unknown,
// ): number | null {
//   const record =
//     getFirstRecord(value);

//   if (!record) {
//     return null;
//   }

//   return (
//     asNumber(
//       record.roundNumber,
//     ) ??
//     asNumber(
//       record.round_number,
//     ) ??
//     asNumber(
//       record.currentRound,
//     ) ??
//     asNumber(
//       record.current_round,
//     ) ??
//     null
//   );
// }


// /* ============================================================
//    TOTAL QUESTIONS
//    ============================================================ */

// function extractTotalQuestions(
//   value: unknown,
// ): number | null {
//   const record =
//     getFirstRecord(value);

//   if (!record) {
//     return null;
//   }

//   return (
//     asNumber(
//       record.totalQuestions,
//     ) ??
//     asNumber(
//       record.total_questions,
//     ) ??
//     asNumber(
//       record.questionCount,
//     ) ??
//     asNumber(
//       record.question_count,
//     ) ??
//     null
//   );
// }


// /* ============================================================
//    TOTAL ROUNDS
//    ============================================================ */

// function extractTotalRounds(
//   value: unknown,
// ): number | null {
//   const record =
//     getFirstRecord(value);

//   if (!record) {
//     return null;
//   }

//   return (
//     asNumber(
//       record.totalRounds,
//     ) ??
//     asNumber(
//       record.total_rounds,
//     ) ??
//     asNumber(
//       record.numberOfRounds,
//     ) ??
//     asNumber(
//       record.number_of_rounds,
//     ) ??
//     null
//   );
// }


// /* ============================================================
//    OPTION NORMALIZATION
//    ============================================================ */

// function normalizeOption(
//   value: unknown,
//   index: number,
// ): QuizGameOption {
//   if (
//     !isRecord(value)
//   ) {
//     const text =
//       asString(value) ?? "";

//     return {
//       label:
//         String.fromCharCode(
//           65 + index,
//         ),

//       value:
//         text,

//       text,
//     };
//   }

//   const text =
//     asString(value.text) ??
//     asString(value.label) ??
//     asString(value.value) ??
//     "";

//   const label =
//     asString(value.label) ??
//     String.fromCharCode(
//       65 + index,
//     );

//   const optionValue =
//     asString(value.value) ??
//     text;

//   return {
//     label,

//     value:
//       optionValue,

//     text,
//   };
// }


// /* ============================================================
//    QUESTION NORMALIZATION
//    ============================================================ */

// function normalizeQuestion(
//   value: unknown,
// ): QuizGameQuestion | null {
//   const record =
//     getFirstRecord(value);

//   if (!record) {
//     return null;
//   }

//   const nestedQuestion =
//     isRecord(record.question)
//       ? record.question
//       : null;

//   const source =
//     nestedQuestion ??
//     record;

//   const id =
//     asString(source.id) ??
//     asString(source._id) ??
//     asString(record.questionId) ??
//     asString(record.question_id);

//   const questionText =
//     asString(source.question) ??
//     asString(source.text) ??
//     asString(source.content);

//   if (
//     !id ||
//     !questionText
//   ) {
//     return null;
//   }

//   const rawOptions =
//     Array.isArray(source.options)
//       ? source.options
//       : Array.isArray(source.choices)
//         ? source.choices
//         : [];

//   const options =
//     rawOptions.map(
//       (
//         option,
//         index,
//       ) =>
//         normalizeOption(
//           option,
//           index,
//         ),
//     );

//   const correctAnswer =
//     asString(
//       source.correctAnswer,
//     ) ??
//     asString(
//       source.correct_answer,
//     );

//   const rawCorrectAnswers =
//     Array.isArray(
//       source.correctAnswers,
//     )
//       ? source.correctAnswers
//       : Array.isArray(
//           source.correct_answers,
//         )
//         ? source.correct_answers
//         : Array.isArray(
//             source.correctValues,
//           )
//           ? source.correctValues
//           : null;

//   const correctAnswers =
//     rawCorrectAnswers
//       ? rawCorrectAnswers
//           .map(asString)
//           .filter(
//             (
//               item,
//             ): item is string =>
//               Boolean(item),
//           )
//       : undefined;

//   const rawAnswerKey =
//     source.answerKey ??
//     source.answer_key ??
//     null;

//   const questionNumber =
//     asNumber(
//       source.questionNumber,
//     ) ??
//     asNumber(
//       source.question_number,
//     ) ??
//     asNumber(
//       record.questionNumber,
//     ) ??
//     asNumber(
//       record.question_number,
//     ) ??
//     null;

//   const totalQuestions =
//     asNumber(
//       source.totalQuestions,
//     ) ??
//     asNumber(
//       source.total_questions,
//     ) ??
//     asNumber(
//       record.totalQuestions,
//     ) ??
//     asNumber(
//       record.total_questions,
//     ) ??
//     null;

//   const timeLimit =
//     asNumber(
//       source.timeLimit,
//     ) ??
//     asNumber(
//       source.time_limit,
//     ) ??
//     asNumber(
//       source.timePerQuestion,
//     ) ??
//     asNumber(
//       source.time_per_question,
//     ) ??
//     null;

//   const startedAt =
//     asString(
//       source.startedAt,
//     ) ??
//     asString(
//       source.started_at,
//     ) ??
//     asString(
//       record.startedAt,
//     ) ??
//     asString(
//       record.started_at,
//     ) ??
//     null;

//   const expiresAt =
//     asString(
//       source.expiresAt,
//     ) ??
//     asString(
//       source.expires_at,
//     ) ??
//     asString(
//       record.expiresAt,
//     ) ??
//     asString(
//       record.expires_at,
//     ) ??
//     null;

//   return {
//     id,

//     question:
//       questionText,

//     options,

//     questionNumber,

//     totalQuestions,

//     timeLimit,

//     startedAt,

//     expiresAt,

//     correctAnswer,

//     correctAnswers,

//     answerKey:
//       typeof rawAnswerKey ===
//         "string" ||
//       Array.isArray(
//         rawAnswerKey,
//       )
//         ? rawAnswerKey
//         : null,

//     correctValues:
//       correctAnswers,
//   };
// }


// /* ============================================================
//    REMOVE ANSWER KEY
//    ============================================================ */

// function stripAnswerKey(
//   question: QuizGameQuestion,
// ): QuizGameQuestion {
//   const {
//     correctAnswer: _correctAnswer,
//     correctAnswers: _correctAnswers,
//     answerKey: _answerKey,
//     correctValues: _correctValues,
//     ...safeQuestion
//   } = question;

//   return safeQuestion;
// }


// /* ============================================================
//    QUESTION ARRAY EXTRACTION
//    ============================================================ */

// function extractQuestionArray(
//   payload: unknown,
// ): QuizGameQuestion[] {
//   const data =
//     getPayloadData(payload);

//   if (
//     Array.isArray(data)
//   ) {
//     return data
//       .map(
//         normalizeQuestion,
//       )
//       .filter(
//         (
//           question,
//         ): question is QuizGameQuestion =>
//           Boolean(question),
//       );
//   }

//   if (
//     !isRecord(data)
//   ) {
//     return [];
//   }

//   const candidates = [
//     data.questions,
//     data.questionList,
//     data.question_list,
//     data.roundQuestions,
//     data.round_questions,
//     data.items,
//   ];

//   for (
//     const candidate of
//     candidates
//   ) {
//     if (
//       !Array.isArray(
//         candidate,
//       )
//     ) {
//       continue;
//     }

//     const questions =
//       candidate
//         .map(
//           normalizeQuestion,
//         )
//         .filter(
//           (
//             question,
//           ): question is QuizGameQuestion =>
//             Boolean(question),
//         );

//     if (
//       questions.length > 0
//     ) {
//       return questions;
//     }
//   }

//   const single =
//     normalizeQuestion(data);

//   return single
//     ? [single]
//     : [];
// }


// /* ============================================================
//    PARTICIPANT NORMALIZATION
//    ============================================================ */

// function normalizeParticipant(
//   value: unknown,
// ): QuizParticipant | null {
//   const record =
//     getFirstRecord(value);

//   if (!record) {
//     return null;
//   }

//   const id =
//     extractId(record);

//   if (!id) {
//     return null;
//   }

//   return {
//     id,

//     userId:
//       asString(
//         record.userId,
//       ) ??
//       asString(
//         record.user_id,
//       ),

//     name:
//       asString(
//         record.name,
//       ) ??
//       asString(
//         record.fullName,
//       ) ??
//       asString(
//         record.full_name,
//       ) ??
//       asString(
//         record.username,
//       ) ??
//       "Contestant",

//     username:
//       asString(
//         record.username,
//       ),

//     avatar:
//       asString(
//         record.avatar,
//       ) ??
//       asString(
//         record.avatarUrl,
//       ) ??
//       asString(
//         record.avatar_url,
//       ),

//     score:
//       asNumber(
//         record.score,
//       ) ??
//       asNumber(
//         record.points,
//       ) ??
//       0,

//     position:
//       asNumber(
//         record.position,
//       ) ??
//       asNumber(
//         record.rank,
//       ),

//     eliminated:
//       asBoolean(
//         record.eliminated,
//       ) ??
//       false,

//     answered:
//       asBoolean(
//         record.answered,
//       ) ??
//       false,

//     answerCorrect:
//       asBoolean(
//         record.answerCorrect,
//       ) ??
//       asBoolean(
//         record.answer_correct,
//       ),

//     isFirstCorrect:
//       asBoolean(
//         record.isFirstCorrect,
//       ) ??
//       asBoolean(
//         record.is_first_correct_answer,
//       ) ??
//       false,

//     connected:
//       asBoolean(
//         record.connected,
//       ) ??
//       true,
//   };
// }


// /* ============================================================
//    PARTICIPANT ARRAY EXTRACTION
//    ============================================================ */

// function extractParticipants(
//   payload: unknown,
// ): QuizParticipant[] {
//   const data =
//     getPayloadData(payload);

//   if (
//     Array.isArray(data)
//   ) {
//     return data
//       .map(
//         normalizeParticipant,
//       )
//       .filter(
//         (
//           participant,
//         ): participant is QuizParticipant =>
//           Boolean(participant),
//       );
//   }

//   if (
//     !isRecord(data)
//   ) {
//     return [];
//   }

//   const candidates = [
//     data.participants,
//     data.contestants,
//     data.players,
//     data.users,
//   ];

//   for (
//     const candidate of
//     candidates
//   ) {
//     if (
//       !Array.isArray(
//         candidate,
//       )
//     ) {
//       continue;
//     }

//     const participants =
//       candidate
//         .map(
//           normalizeParticipant,
//         )
//         .filter(
//           (
//             participant,
//           ): participant is QuizParticipant =>
//             Boolean(participant),
//         );

//     if (
//       participants.length > 0
//     ) {
//       return participants;
//     }
//   }

//   return [];
// }


// /* ============================================================
//    SCOREBOARD EXTRACTION
//    ============================================================ */

// function extractScoreboard(
//   payload: unknown,
// ): QuizScoreboardEntry[] {
//   const data =
//     getPayloadData(payload);

//   const source =
//     Array.isArray(data)
//       ? data
//       : isRecord(data)
//         ? (
//             data.scoreboard ??
//             data.scoreBoard ??
//             data.ladder ??
//             data.leaderboard ??
//             []
//           )
//         : [];

//   if (
//     !Array.isArray(source)
//   ) {
//     return [];
//   }

//   return source
//     .map(
//       (
//         entry,
//       ): QuizScoreboardEntry | null => {
//         if (
//           !isRecord(entry)
//         ) {
//           return null;
//         }

//         const contestantId =
//           asString(
//             entry.contestantId,
//           ) ??
//           asString(
//             entry.contestant_id,
//           ) ??
//           asString(
//             entry.userId,
//           ) ??
//           asString(
//             entry.user_id,
//           ) ??
//           asString(
//             entry.id,
//           ) ??
//           asString(
//             entry._id,
//           );

//         if (
//           !contestantId
//         ) {
//           return null;
//         }

//         return {
//           contestantId,

//           userId:
//             asString(
//               entry.userId,
//             ) ??
//             asString(
//               entry.user_id,
//             ),

//           name:
//             asString(
//               entry.name,
//             ) ??
//             asString(
//               entry.username,
//             ) ??
//             "Contestant",

//           score:
//             asNumber(
//               entry.score,
//             ) ??
//             asNumber(
//               entry.points,
//             ) ??
//             0,

//           position:
//             asNumber(
//               entry.position,
//             ) ??
//             asNumber(
//               entry.rank,
//             ) ??
//             0,

//           correctAnswers:
//             asNumber(
//               entry.correctAnswers,
//             ) ??
//             asNumber(
//               entry.correct_answers,
//             ) ??
//             0,

//           wrongAnswers:
//             asNumber(
//               entry.wrongAnswers,
//             ) ??
//             asNumber(
//               entry.wrong_answers,
//             ) ??
//             0,

//           firstCorrectCount:
//             asNumber(
//               entry.firstCorrectCount,
//             ) ??
//             asNumber(
//               entry.first_correct_answer_count,
//             ) ??
//             0,

//           eliminated:
//             asBoolean(
//               entry.eliminated,
//             ) ??
//             false,
//         };
//       },
//     )
//     .filter(
//       (
//         entry,
//       ): entry is QuizScoreboardEntry =>
//         Boolean(entry),
//     );
// }


// /* ============================================================
//    FIRST CORRECT
//    ============================================================ */

// function extractFirstCorrectWinner(
//   payload: unknown,
// ): FirstCorrectWinner | null {
//   const record =
//     getFirstRecord(payload);

//   if (!record) {
//     return null;
//   }

//   const questionId =
//     asString(
//       record.questionId,
//     ) ??
//     asString(
//       record.question_id,
//     );

//   if (!questionId) {
//     return null;
//   }

//   return {
//     questionId,

//     contestantId:
//       asString(
//         record.contestantId,
//       ) ??
//       asString(
//         record.contestant_id,
//       ),

//     userId:
//       asString(
//         record.userId,
//       ) ??
//       asString(
//         record.user_id,
//       ),

//     name:
//       asString(
//         record.name,
//       ) ??
//       asString(
//         record.username,
//       ) ??
//       "Contestant",

//     position:
//       asNumber(
//         record.position,
//       ) ??
//       asNumber(
//         record.rank,
//       ),

//     score:
//       asNumber(
//         record.score,
//       ) ??
//       asNumber(
//         record.points,
//       ),

//     timestamp:
//       asString(
//         record.timestamp,
//       ) ??
//       asString(
//         record.createdAt,
//       ) ??
//       asString(
//         record.created_at,
//       ),
//   };
// }


// /* ============================================================
//    INITIAL STATE
//    ============================================================ */

// function createInitialState(
//   config: QuizGameConfig,
// ): QuizGameState {
//   return {
//     quizId:
//       config.quizId,

//     roomId:
//       config.roomId,

//     role:
//       config.role,

//     connected:
//       false,

//     roomActivated:
//       false,

//     joinedRoom:
//       false,

//     roundNumber:
//       1,

//     totalRounds:
//       config.numberOfRounds ??
//       5,

//     questionNumber:
//       null,

//     totalQuestions:
//       null,

//     currentQuestion:
//       null,

//     questions:
//       [],

//     questionLocked:
//       false,

//     timerStartedAt:
//       null,

//     timerExpiresAt:
//       null,

//     timeRemaining:
//       config.timePerQuestion ??
//       null,

//     selectedAnswer:
//       null,

//     answerSubmitted:
//       false,

//     firstCorrectWinner:
//       null,

//     participants:
//       [],

//     scoreboard:
//       [],

//     roundCompleted:
//       false,

//     quizCompleted:
//       false,

//     error:
//       null,
//   };
// }


// /* ============================================================
//    CONTROLLER
//    ============================================================ */

// export class QuizGameController {
//   private readonly socket: Socket;

//   private readonly config: QuizGameConfig;

//   private state: QuizGameState;

//   private listeners =
//     new Set<
//       (
//         state: QuizGameState,
//       ) => void
//     >();

//   private bound = false;

//   private timerInterval:
//     | ReturnType<typeof setInterval>
//     | null = null;

//   private readonly socketHandlers:
//     Array<{
//       event: string;
//       handler: (
//         ...args: unknown[]
//       ) => void;
//     }> = [];


//   constructor(
//     config: QuizGameConfig,
//   ) {
//     this.config = {
//       ...config,

//       quizId:
//         String(
//           config.quizId,
//         ).trim(),

//       roomId:
//         String(
//           config.roomId,
//         ).trim(),

//       role:
//         config.role,
//     };

//     this.socket =
//       getQuizSocket();

//     this.state =
//       createInitialState(
//         this.config,
//       );
//   }


//   /* ==========================================================
//      STATE
//      ========================================================== */

//   getState(): QuizGameState {
//     return {
//       ...this.state,

//       questions: [
//         ...this.state.questions,
//       ],

//       participants: [
//         ...this.state.participants,
//       ],

//       scoreboard: [
//         ...this.state.scoreboard,
//       ],
//     };
//   }


//   subscribe(
//     listener: (
//       state: QuizGameState,
//     ) => void,
//   ): () => void {
//     this.listeners.add(
//       listener,
//     );

//     listener(
//       this.getState(),
//     );

//     return () => {
//       this.listeners.delete(
//         listener,
//       );
//     };
//   }


//   private setState(
//     patch:
//       | Partial<QuizGameState>
//       | ((
//           state: QuizGameState,
//         ) => Partial<QuizGameState>),
//   ): void {
//     const nextPatch =
//       typeof patch ===
//       "function"
//         ? patch(this.state)
//         : patch;

//     this.state = {
//       ...this.state,
//       ...nextPatch,
//     };

//     const snapshot =
//       this.getState();

//     for (
//       const listener of
//       this.listeners
//     ) {
//       listener(snapshot);
//     }
//   }


//   /* ==========================================================
//      SOCKET LISTENER REGISTRATION
//      ========================================================== */

//   private listen(
//     event: string,
//     handler: (
//       ...args: unknown[]
//     ) => void,
//   ): void {
//     this.socket.on(
//       event,
//       handler,
//     );

//     this.socketHandlers.push({
//       event,
//       handler,
//     });
//   }


//   /* ==========================================================
//      SOCKET BINDING
//      ========================================================== */

//   bindSocket(): void {
//     if (
//       this.bound
//     ) {
//       return;
//     }

//     this.bound = true;

//     const socket =
//       this.socket;


//     /* --------------------------------------------------------
//        CONNECT
//        -------------------------------------------------------- */

//     const handleConnect =
//       () => {
//         console.log(
//           "[Quiz Game] Socket connected:",
//           socket.id,
//         );

//         this.setState({
//           connected:
//             true,

//           error:
//             null,
//         });
//       };


//     /* --------------------------------------------------------
//        DISCONNECT
//        -------------------------------------------------------- */

//     const handleDisconnect =
//       (reason: unknown) => {
//         console.log(
//           "[Quiz Game] Socket disconnected:",
//           reason,
//         );

//         this.stopLocalTimer();

//         this.setState({
//           connected:
//             false,
//         });
//       };


//     /* --------------------------------------------------------
//        CONNECT ERROR
//        -------------------------------------------------------- */

//     const handleConnectError =
//       (error: unknown) => {
//         console.error(
//           "[Quiz Game] Socket connection error:",
//           error,
//         );

//         const message =
//           error instanceof Error
//             ? error.message
//             : "Unable to connect to quiz server.";

//         this.setState({
//           connected:
//             false,

//           error:
//             message,
//         });
//       };


//     /* --------------------------------------------------------
//        ROOM ACTIVATION ACK
//        -------------------------------------------------------- */

//     const handleRoomActivationAck =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Room activation acknowledged:",
//           payload,
//         );

//         this.setState({
//           roomActivated:
//             true,

//           error:
//             null,
//         });
//       };


//     /* --------------------------------------------------------
//        ROOM ACTIVATED
//        -------------------------------------------------------- */

//     const handleRoomActivated =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Room activated:",
//           payload,
//         );

//         this.setState({
//           roomActivated:
//             true,

//           error:
//             null,
//         });
//       };


//     /* --------------------------------------------------------
//        JOINED ROOM ACK
//        -------------------------------------------------------- */

//     const handleJoinedRoom =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Joined room:",
//           payload,
//         );

//         const participants =
//           extractParticipants(
//             payload,
//           );

//         this.setState(
//           (state) => ({
//             joinedRoom:
//               true,

//             participants:
//               participants.length >
//               0
//                 ? participants
//                 : state.participants,

//             error:
//               null,
//           }),
//         );
//       };


//     /* --------------------------------------------------------
//        ROOM STATE
//        -------------------------------------------------------- */

//     const handleRoomState =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Room state:",
//           payload,
//         );

//         const participants =
//           extractParticipants(
//             payload,
//           );

//         const scoreboard =
//           extractScoreboard(
//             payload,
//           );

//         const roundNumber =
//           extractRoundNumber(
//             payload,
//           );

//         const totalRounds =
//           extractTotalRounds(
//             payload,
//           );

//         const questionNumber =
//           extractQuestionNumber(
//             payload,
//           );

//         const totalQuestions =
//           extractTotalQuestions(
//             payload,
//           );

//         const question =
//           normalizeQuestion(
//             payload,
//           );

//         const record =
//           getFirstRecord(
//             payload,
//           );

//         const roomActivated =
//           asBoolean(
//             record?.roomActivated,
//           ) ??
//           asBoolean(
//             record?.room_activated,
//           );

//         const safeQuestion =
//           question
//             ? this.prepareIncomingQuestion(
//                 question,
//               )
//             : null;

//         this.setState(
//           (state) => ({
//             joinedRoom:
//               true,

//             roomActivated:
//               roomActivated ??
//               state.roomActivated,

//             participants:
//               participants.length >
//               0
//                 ? participants
//                 : state.participants,

//             scoreboard:
//               scoreboard.length >
//               0
//                 ? scoreboard
//                 : state.scoreboard,

//             roundNumber:
//               roundNumber ??
//               state.roundNumber,

//             totalRounds:
//               totalRounds ??
//               state.totalRounds,

//             questionNumber:
//               questionNumber ??
//               state.questionNumber,

//             totalQuestions:
//               totalQuestions ??
//               state.totalQuestions,

//             currentQuestion:
//               safeQuestion ??
//               state.currentQuestion,
//           }),
//         );
//       };


//     /* --------------------------------------------------------
//        PARTICIPANT JOINED ROOM
//        -------------------------------------------------------- */

//     const handleParticipantJoined =
//       (payload: unknown) => {
//         const participant =
//           normalizeParticipant(
//             payload,
//           );

//         if (!participant) {
//           return;
//         }

//         this.setState(
//           (state) => {
//             const exists =
//               state.participants.some(
//                 (item) =>
//                   item.id ===
//                     participant.id ||
//                   (
//                     item.userId !==
//                       null &&
//                     item.userId ===
//                       participant.userId
//                   ),
//               );

//             if (
//               exists
//             ) {
//               return {};
//             }

//             return {
//               participants: [
//                 ...state.participants,
//                 participant,
//               ],
//             };
//           },
//         );
//       };


//     /* --------------------------------------------------------
//        ROUND STARTED
//        -------------------------------------------------------- */

//     const handleRoundStarted =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Round started:",
//           payload,
//         );

//         const roundNumber =
//           extractRoundNumber(
//             payload,
//           );

//         const totalQuestions =
//           extractTotalQuestions(
//             payload,
//           );

//         this.stopLocalTimer();

//         this.setState(
//           (state) => ({
//             roundNumber:
//               roundNumber ??
//               state.roundNumber,

//             totalQuestions:
//               totalQuestions ??
//               state.totalQuestions,

//             roundCompleted:
//               false,

//             questionNumber:
//               null,

//             currentQuestion:
//               null,

//             questionLocked:
//               false,

//             selectedAnswer:
//               null,

//             answerSubmitted:
//               false,

//             firstCorrectWinner:
//               null,

//             timerStartedAt:
//               null,

//             timerExpiresAt:
//               null,

//             timeRemaining:
//               this.config
//                 .timePerQuestion ??
//               null,
//           }),
//         );
//       };


//     /* --------------------------------------------------------
//        QUESTION STARTED
//        --------------------------------------------------------

//        This is the central question event.

//        HOST:
//          - receives backend confirmation
//          - matches question against its HTTP-loaded question set
//          - retains its private answer key

//        STUDENT:
//          - receives only the public question
//          - answer key is stripped

//        The frontend timer starts here.
//        -------------------------------------------------------- */

//     const handleQuestionStarted =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Question started:",
//           payload,
//         );

//         this.applyIncomingQuestion(
//           payload,
//         );
//       };


//     /* --------------------------------------------------------
//        PARTICIPANT SELECTED ANSWER
//        --------------------------------------------------------

//        This is the backend event that replaces the old
//        answer_result flow.

//        We only mark the participant as having answered.

//        Correctness comes from backend leaderboard / first-correct
//        information.
//        -------------------------------------------------------- */

//     const handleParticipantSelectedAnswer =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Participant selected answer:",
//           payload,
//         );

//         const record =
//           getFirstRecord(
//             payload,
//           );

//         if (!record) {
//           return;
//         }

//         const contestantId =
//           asString(
//             record.contestantId,
//           ) ??
//           asString(
//             record.contestant_id,
//           ) ??
//           asString(
//             record.userId,
//           ) ??
//           asString(
//             record.user_id,
//           );

//         if (
//           !contestantId
//         ) {
//           return;
//         }

//         this.setState(
//           (state) => ({
//             participants:
//               state.participants.map(
//                 (participant) => {
//                   if (
//                     participant.id !==
//                       contestantId &&
//                     participant.userId !==
//                       contestantId
//                   ) {
//                     return participant;
//                   }

//                   return {
//                     ...participant,

//                     answered:
//                       true,
//                   };
//                 },
//               ),
//           }),
//         );
//       };


//     /* --------------------------------------------------------
//        FIRST CORRECT
//        -------------------------------------------------------- */

//     const handleFirstCorrect =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] FIRST CORRECT:",
//           payload,
//         );

//         const winner =
//           extractFirstCorrectWinner(
//             payload,
//           );

//         if (!winner) {
//           return;
//         }

//         this.setState(
//           (state) => ({
//             firstCorrectWinner:
//               winner,

//             participants:
//               state.participants.map(
//                 (participant) => {
//                   const matches =
//                     (
//                       winner.contestantId !==
//                         null &&
//                       participant.id ===
//                         winner.contestantId
//                     ) ||
//                     (
//                       winner.userId !==
//                         null &&
//                       participant.userId ===
//                         winner.userId
//                     );

//                   return matches
//                     ? {
//                         ...participant,

//                         isFirstCorrect:
//                           true,

//                         answerCorrect:
//                           true,
//                       }
//                     : participant;
//                 },
//               ),
//           }),
//         );
//       };


//     /* --------------------------------------------------------
//        LEADERBOARD UPDATED
//        -------------------------------------------------------- */

//     const handleLeaderboardUpdated =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Leaderboard updated:",
//           payload,
//         );

//         const scoreboard =
//           extractScoreboard(
//             payload,
//           );

//         if (
//           scoreboard.length ===
//           0
//         ) {
//           return;
//         }

//         this.setState(
//           (state) => ({
//             scoreboard,

//             participants:
//               this.mergeScoreboardIntoParticipants(
//                 state.participants,
//                 scoreboard,
//               ),
//           }),
//         );
//       };


//     /* --------------------------------------------------------
//        PARTICIPANTS ELIMINATED
//        -------------------------------------------------------- */

//     const handleParticipantsEliminated =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Participants eliminated:",
//           payload,
//         );

//         const eliminatedIds =
//           this.extractParticipantIds(
//             payload,
//           );

//         if (
//           eliminatedIds.length ===
//           0
//         ) {
//           return;
//         }

//         this.setState(
//           (state) => ({
//             participants:
//               state.participants.map(
//                 (participant) =>
//                   eliminatedIds.includes(
//                     participant.id,
//                   ) ||
//                   (
//                     participant.userId !==
//                       null &&
//                     eliminatedIds.includes(
//                       participant.userId,
//                     )
//                   )
//                     ? {
//                         ...participant,

//                         eliminated:
//                           true,
//                       }
//                     : participant,
//               ),

//             scoreboard:
//               state.scoreboard.map(
//                 (entry) =>
//                   eliminatedIds.includes(
//                     entry.contestantId,
//                   ) ||
//                   (
//                     entry.userId !==
//                       null &&
//                     eliminatedIds.includes(
//                       entry.userId,
//                     )
//                   )
//                     ? {
//                         ...entry,

//                         eliminated:
//                           true,
//                       }
//                     : entry,
//               ),
//           }),
//         );
//       };


//     /* --------------------------------------------------------
//        TIEBREAKER QUESTION
//        -------------------------------------------------------- */

//     const handleTiebreakerQuestionStarted =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Tiebreaker question started:",
//           payload,
//         );

//         this.applyIncomingQuestion(
//           payload,
//         );
//       };


//     /* --------------------------------------------------------
//        SOCKET ERROR
//        -------------------------------------------------------- */

//     const handleSocketError =
//       (payload: unknown) => {
//         console.error(
//           "[Quiz Game] Socket error:",
//           payload,
//         );

//         const record =
//           getFirstRecord(
//             payload,
//           );

//         const message =
//           asString(
//             record?.message,
//           ) ??
//           asString(
//             record?.error,
//           ) ??
//           asString(
//             record?.reason,
//           ) ??
//           asString(
//             payload,
//           ) ??
//           "Quiz server error.";

//         this.setState({
//           error:
//             message,
//         });
//       };


//     /* --------------------------------------------------------
//        MESSAGE
//        -------------------------------------------------------- */

//     const handleMessage =
//       (payload: unknown) => {
//         console.log(
//           "[Quiz Game] Server message:",
//           payload,
//         );
//       };


//     /* ========================================================
//        REGISTER SOCKET LISTENERS
//        ======================================================== */

//     this.listen(
//       "connect",
//       handleConnect,
//     );

//     this.listen(
//       "disconnect",
//       handleDisconnect,
//     );

//     this.listen(
//       "connect_error",
//       handleConnectError,
//     );


//     this.listen(
//       QUIZ_GAME_EVENTS.ROOM_ACTIVATION_ACK,
//       handleRoomActivationAck,
//     );

//     this.listen(
//       QUIZ_GAME_EVENTS.ROOM_ACTIVATED,
//       handleRoomActivated,
//     );

//     this.listen(
//       QUIZ_GAME_EVENTS.JOINED_ROOM_ACK,
//       handleJoinedRoom,
//     );

//     this.listen(
//       QUIZ_GAME_EVENTS.ROOM_STATE,
//       handleRoomState,
//     );

//     this.listen(
//       QUIZ_GAME_EVENTS.PARTICIPANT_JOINED_ROOM,
//       handleParticipantJoined,
//     );


//     this.listen(
//       QUIZ_GAME_EVENTS.ROUND_STARTED,
//       handleRoundStarted,
//     );


//     this.listen(
//       QUIZ_GAME_EVENTS.QUESTION_STARTED,
//       handleQuestionStarted,
//     );


//     this.listen(
//       QUIZ_GAME_EVENTS.PARTICIPANT_SELECTED_ANSWER,
//       handleParticipantSelectedAnswer,
//     );

//     this.listen(
//       QUIZ_GAME_EVENTS.FIRST_CORRECT_ANSWER,
//       handleFirstCorrect,
//     );


//     this.listen(
//       QUIZ_GAME_EVENTS.LEADERBOARD_UPDATED,
//       handleLeaderboardUpdated,
//     );


//     this.listen(
//       QUIZ_GAME_EVENTS.PARTICIPANTS_ELIMINATED,
//       handleParticipantsEliminated,
//     );

//     this.listen(
//       QUIZ_GAME_EVENTS.TIEBREAKER_QUESTION_STARTED,
//       handleTiebreakerQuestionStarted,
//     );


//     this.listen(
//       QUIZ_GAME_EVENTS.SOCKET_ERROR,
//       handleSocketError,
//     );

//     this.listen(
//       QUIZ_GAME_EVENTS.MESSAGE,
//       handleMessage,
//     );


//     /* ========================================================
//        SOCKET MAY ALREADY BE CONNECTED
//        ======================================================== */

//     if (
//       socket.connected
//     ) {
//       this.setState({
//         connected:
//           true,
//       });
//     }
//   }


//   /* ==========================================================
//      APPLY INCOMING QUESTION
//      ========================================================== */

//   private applyIncomingQuestion(
//     payload: unknown,
//   ): void {
//     const incomingQuestion =
//       normalizeQuestion(
//         payload,
//       );

//     const questionNumber =
//       extractQuestionNumber(
//         payload,
//       );

//     const totalQuestions =
//       extractTotalQuestions(
//         payload,
//       );

//     const roundNumber =
//       extractRoundNumber(
//         payload,
//       );

//     const record =
//       getFirstRecord(
//         payload,
//       );

//     const questionId =
//       incomingQuestion?.id ??
//       asString(
//         record?.questionId,
//       ) ??
//       asString(
//         record?.question_id,
//       );

//     /*
//      * HOST:
//      *
//      * The socket event should not need to carry the answer key.
//      * The host already has the full question set from HTTP.
//      *
//      * We therefore merge the public socket question with the
//      * private HTTP question.
//      *
//      * STUDENT:
//      *
//      * Any answer key is stripped.
//      */
//     const preparedQuestion =
//       this.resolveIncomingQuestion(
//         incomingQuestion,
//         questionId,
//         questionNumber,
//       );

//     const resolvedQuestionNumber =
//       questionNumber ??
//       preparedQuestion?.questionNumber ??
//       null;

//     const resolvedTotalQuestions =
//       totalQuestions ??
//       preparedQuestion?.totalQuestions ??
//       this.state.totalQuestions;

//     const timeLimit =
//       preparedQuestion?.timeLimit ??
//       this.config.timePerQuestion ??
//       null;

//     const serverStartedAt =
//       asString(
//         record?.startedAt,
//       ) ??
//       asString(
//         record?.started_at,
//       ) ??
//       preparedQuestion?.startedAt ??
//       null;

//     const serverExpiresAt =
//       asString(
//         record?.expiresAt,
//       ) ??
//       asString(
//         record?.expires_at,
//       ) ??
//       preparedQuestion?.expiresAt ??
//       null;

//     const startedAt =
//       serverStartedAt ??
//       new Date().toISOString();

//     const expiresAt =
//       serverExpiresAt ??
//       (
//         timeLimit !== null
//           ? new Date(
//               Date.now() +
//               timeLimit *
//                 1000,
//             ).toISOString()
//           : null
//       );

//     this.stopLocalTimer();

//     this.setState(
//       (state) => ({
//         currentQuestion:
//           preparedQuestion ??
//           state.currentQuestion,

//         roundNumber:
//           roundNumber ??
//           state.roundNumber,

//         questionNumber:
//           resolvedQuestionNumber ??
//           state.questionNumber,

//         totalQuestions:
//           resolvedTotalQuestions,

//         questionLocked:
//           false,

//         selectedAnswer:
//           null,

//         answerSubmitted:
//           false,

//         firstCorrectWinner:
//           null,

//         timerStartedAt:
//           startedAt,

//         timerExpiresAt:
//           expiresAt,

//         timeRemaining:
//           timeLimit,
//       }),
//     );

//     this.startLocalTimer(
//       expiresAt,
//       timeLimit,
//     );
//   }


//   /* ==========================================================
//      RESOLVE INCOMING QUESTION
//      ========================================================== */

//   private resolveIncomingQuestion(
//     incomingQuestion:
//       QuizGameQuestion | null,
//     questionId:
//       string | null,
//     questionNumber:
//       number | null,
//   ): QuizGameQuestion | null {
//     if (
//       this.config.role ===
//       "STUDENT"
//     ) {
//       if (
//         !incomingQuestion
//       ) {
//         return null;
//       }

//       return stripAnswerKey(
//         incomingQuestion,
//       );
//     }

//     /*
//      * HOST
//      *
//      * Prefer the HTTP-loaded question because that is where
//      * the host receives the complete question including its
//      * answer key.
//      */

//     const loadedQuestion =
//       this.state.questions.find(
//         (question) =>
//           (
//             questionId !==
//               null &&
//             question.id ===
//               questionId
//           ) ||
//           (
//             questionNumber !==
//               null &&
//             question.questionNumber ===
//               questionNumber
//           ),
//       );

//     if (
//       loadedQuestion
//     ) {
//       return {
//         ...loadedQuestion,

//         questionNumber:
//           questionNumber ??
//           loadedQuestion.questionNumber,

//         totalQuestions:
//           incomingQuestion?.totalQuestions ??
//           loadedQuestion.totalQuestions,

//         timeLimit:
//           incomingQuestion?.timeLimit ??
//           loadedQuestion.timeLimit,

//         startedAt:
//           incomingQuestion?.startedAt ??
//           loadedQuestion.startedAt,

//         expiresAt:
//           incomingQuestion?.expiresAt ??
//           loadedQuestion.expiresAt,
//       };
//     }

//     return incomingQuestion;
//   }


//   /* ==========================================================
//      PREPARE INCOMING QUESTION
//      ========================================================== */

//   private prepareIncomingQuestion(
//     question:
//       QuizGameQuestion,
//   ): QuizGameQuestion {
//     if (
//       this.config.role ===
//       "STUDENT"
//     ) {
//       return stripAnswerKey(
//         question,
//       );
//     }

//     return question;
//   }


//   /* ==========================================================
//      LOCAL FRONTEND TIMER
//      ========================================================== */

//   private startLocalTimer(
//     expiresAt:
//       string | null,
//     timeLimit:
//       number | null,
//   ): void {
//     this.stopLocalTimer();

//     if (
//       expiresAt
//     ) {
//       this.timerInterval =
//         setInterval(
//           () => {
//             const expires =
//               new Date(
//                 expiresAt,
//               ).getTime();

//             if (
//               !Number.isFinite(
//                 expires,
//               )
//             ) {
//               return;
//             }

//             const remaining =
//               Math.max(
//                 0,
//                 Math.ceil(
//                   (
//                     expires -
//                     Date.now()
//                   ) /
//                     1000,
//                 ),
//               );

//             this.setState({
//               timeRemaining:
//                 remaining,
//             });

//             if (
//               remaining <=
//               0
//             ) {
//               this.stopLocalTimer();

//               /*
//                * IMPORTANT:
//                *
//                * Timer expiry does NOT emit a timer_expired
//                * socket event.
//                *
//                * The host locks the question through the
//                * normal host-controlled question_locked command.
//                */
//               if (
//                 this.config.role ===
//                 "HOST"
//               ) {
//                 this.setState({
//                   questionLocked:
//                     true,
//                 });
//               }
//             }
//           },
//           250,
//         );

//       return;
//     }

//     if (
//       timeLimit !== null &&
//       timeLimit > 0
//     ) {
//       this.setState({
//         timeRemaining:
//           timeLimit,
//       });
//     }
//   }


//   /* ==========================================================
//      STOP LOCAL TIMER
//      ========================================================== */

//   private stopLocalTimer(): void {
//     if (
//       this.timerInterval !==
//       null
//     ) {
//       clearInterval(
//         this.timerInterval,
//       );

//       this.timerInterval =
//         null;
//     }
//   }


//   /* ==========================================================
//      LOAD ROUND QUESTIONS
     
//      HOST ONLY

//      HTTP:

//        GET
//        /quiz/get-round-questions/{quizId}?roundNumber=N

//      This loads the COMPLETE round question set.

//      The host uses this data to know:

//        Question 1
//        Question 2
//        Question 3
//        ...
     
//      The host then controls which question is requested.
//      ========================================================== */

//   async loadRoundQuestions(
//     roundNumber = 1,
//   ): Promise<
//     QuizGameQuestion[]
//   > {
//     this.assertHost();

//     const normalizedRound =
//       Math.max(
//         1,
//         Math.floor(
//           Number(
//             roundNumber,
//           ) || 1,
//         ),
//       );

//     if (
//       !this.config.quizId
//     ) {
//       throw new Error(
//         "Quiz ID is required.",
//       );
//     }

//     console.log(
//       "[Quiz Game] Loading round questions:",
//       {
//         quizId:
//           this.config.quizId,

//         roundNumber:
//           normalizedRound,
//       },
//     );

//     try {
//       const response =
//         await axiosInstance.get(
//           `/quiz/get-round-questions/${encodeURIComponent(
//             this.config.quizId,
//           )}`,
//           {
//             params: {
//               roundNumber:
//                 normalizedRound,
//             },
//           },
//         );

//       const payload =
//         response?.data;

//       console.log(
//         "[Quiz Game] Round questions response:",
//         payload,
//       );

//       const questions =
//         extractQuestionArray(
//           payload,
//         );

//       if (
//         questions.length ===
//         0
//       ) {
//         throw new Error(
//           "The round question response did not contain any questions.",
//         );
//       }

//       /*
//        * Normalize the question numbers if the backend omitted
//        * them from individual questions.
//        */
//       const normalizedQuestions =
//         questions.map(
//           (
//             question,
//             index,
//           ) => ({
//             ...question,

//             questionNumber:
//               question.questionNumber ??
//               index + 1,

//             totalQuestions:
//               question.totalQuestions ??
//               questions.length,
//           }),
//         );

//       this.stopLocalTimer();

//       this.setState({
//         roundNumber:
//           normalizedRound,

//         questions:
//           normalizedQuestions,

//         totalQuestions:
//           normalizedQuestions.length,

//         currentQuestion:
//           null,

//         questionNumber:
//           null,

//         questionLocked:
//           false,

//         selectedAnswer:
//           null,

//         answerSubmitted:
//           false,

//         firstCorrectWinner:
//           null,

//         roundCompleted:
//           false,

//         timerStartedAt:
//           null,

//         timerExpiresAt:
//           null,

//         timeRemaining:
//           this.config
//             .timePerQuestion ??
//           null,

//         error:
//           null,
//       });

//       return normalizedQuestions;
//     } catch (error) {
//       console.error(
//         "[Quiz Game] Failed to load round questions:",
//         error,
//       );

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Unable to load round questions.";

//       this.setState({
//         error:
//           message,
//       });

//       throw error;
//     }
//   }


//   /* ==========================================================
//      ACTIVATE ROOM

//      HOST ONLY
//      ========================================================== */

//   activateRoom(): void {
//     this.assertHost();

//     this.bindSocket();

//     const payload = {
//       roomId:
//         this.config.roomId,

//       room_id:
//         this.config.roomId,

//       quizId:
//         this.config.quizId,

//       quiz_id:
//         this.config.quizId,
//     };

//     console.log(
//       "[Quiz Game] Activating room:",
//       payload,
//     );

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.ACTIVATE_ROOM,
//       payload,
//     );
//   }


//   /* ==========================================================
//    JOIN ROOM

//    STUDENT ONLY
//    ----------------------------------------------------------
//    IMPORTANT:

//    A HOST must NEVER emit "join_room".

//    HOST flow:
//       activate_room
//       start_round
//       start_question
//       ...

//    STUDENT flow:
//       join_room
//       submit_answer
//    ========================================================== */

// joinRoom(): void {
//   /*
//    * A host is NOT a contestant.

//    * Therefore the host must never call join_room.
//    *
//    * If this method is accidentally called by the host page,
//    * silently block the socket emission instead of allowing
//    * the backend to return:
//    *
//    *   403 - You are not registered for this quiz contest.
//    */

//   if (this.config.role === "HOST") {
//     console.warn(
//       "[Quiz Game] HOST attempted to join room. Ignoring join_room emission.",
//       {
//         quizId: this.config.quizId,
//         roomId: this.config.roomId,
//       },
//     );

//     return;
//   }

//   /*
//    * Only STUDENT may continue.
//    */

//   if (this.config.role !== "STUDENT") {
//     throw new Error(
//       "Only a student can join a quiz room.",
//     );
//   }

//   /*
//    * Room ID is required for students.
//    */

//   if (!this.config.roomId) {
//     throw new Error(
//       "Room ID is required.",
//     );
//   }

//   this.bindSocket();

//   const payload = {
//     roomId:
//       this.config.roomId,

//     room_id:
//       this.config.roomId,

//     quizId:
//       this.config.quizId,

//     quiz_id:
//       this.config.quizId,
//   };

//   /*
//    * The backend should derive authorization/identity
//    * from the authenticated socket.
//    *
//    * Do NOT send a client-supplied role here.
//    */

//   console.log(
//     "[Quiz Game] STUDENT joining room:",
//     payload,
//   );

//   this.socket.emit(
//     QUIZ_GAME_EVENTS.JOIN_ROOM,
//     payload,
//   );
// }


//   /* ==========================================================
//      START ROUND

//      HOST ONLY
//      ========================================================== */

//   startRound(
//     roundNumber = 1,
//   ): void {
//     this.assertHost();

//     const normalizedRound =
//       Math.max(
//         1,
//         Math.floor(
//           Number(
//             roundNumber,
//           ) || 1,
//         ),
//       );

//     console.log(
//       "[Quiz Game] Starting round:",
//       normalizedRound,
//     );

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.START_ROUND,
//       {
//         roomId:
//           this.config.roomId,

//         room_id:
//           this.config.roomId,

//         quizId:
//           this.config.quizId,

//         quiz_id:
//           this.config.quizId,

//         roundNumber:
//           normalizedRound,

//         round_number:
//           normalizedRound,
//       },
//     );
//   }


//   /* ==========================================================
//      START QUESTION

//      HOST ONLY

//      The host explicitly chooses a question.

//      The host does NOT send:

//        - correctAnswer
//        - correctAnswers
//        - answerKey
//        - correctValues

//      The backend broadcasts question_started.
//      ========================================================== */

//   startQuestion(
//     questionNumber: number,
//   ): void {
//     this.assertHost();

//     const normalizedQuestion =
//       this.normalizeQuestionNumber(
//         questionNumber,
//       );

//     this.assertQuestionExists(
//       normalizedQuestion,
//     );

//     const question =
//       this.state.questions.find(
//         (item) =>
//           item.questionNumber ===
//           normalizedQuestion,
//       );

//     console.log(
//       "[Quiz Game] HOST starting question:",
//       normalizedQuestion,
//     );

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.START_QUESTION,
//       {
//         roomId:
//           this.config.roomId,

//         room_id:
//           this.config.roomId,

//         quizId:
//           this.config.quizId,

//         quiz_id:
//           this.config.quizId,

//         roundNumber:
//           this.state.roundNumber,

//         round_number:
//           this.state.roundNumber,

//         questionNumber:
//           normalizedQuestion,

//         question_number:
//           normalizedQuestion,

//         questionId:
//           question?.id,

//         question_id:
//           question?.id,
//       },
//     );
//   }


//   /* ==========================================================
//      START CURRENT QUESTION

//      HOST ONLY
//      ========================================================== */

//   startCurrentQuestion(): void {
//     const questionNumber =
//       this.state.questionNumber ??
//       1;

//     this.startQuestion(
//       questionNumber,
//     );
//   }


//   /* ==========================================================
//      NEXT QUESTION

//      HOST ONLY

//      The host controls progression.

//      Example:

//        Question 1
//           ↓
//        timer reaches 0
//           ↓
//        host locks question
//           ↓
//        leaderboard updates
//           ↓
//        host clicks Next
//           ↓
//        next_question
//           ↓
//        backend validates
//           ↓
//        question_started
//           ↓
//        Question 2
//      ========================================================== */

//   nextQuestion(
//     questionNumber?: number,
//   ): void {
//     this.assertHost();

//     const nextNumber =
//       questionNumber ??
//       (
//         this.state.questionNumber !==
//           null
//           ? this.state.questionNumber +
//             1
//           : 1
//       );

//     const normalizedQuestion =
//       this.normalizeQuestionNumber(
//         nextNumber,
//       );

//     this.assertQuestionExists(
//       normalizedQuestion,
//     );

//     const question =
//       this.state.questions.find(
//         (item) =>
//           item.questionNumber ===
//           normalizedQuestion,
//       );

//     console.log(
//       "[Quiz Game] HOST requesting next question:",
//       normalizedQuestion,
//     );

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.NEXT_QUESTION,
//       {
//         roomId:
//           this.config.roomId,

//         room_id:
//           this.config.roomId,

//         quizId:
//           this.config.quizId,

//         quiz_id:
//           this.config.quizId,

//         roundNumber:
//           this.state.roundNumber,

//         round_number:
//           this.state.roundNumber,

//         questionNumber:
//           normalizedQuestion,

//         question_number:
//           normalizedQuestion,

//         questionId:
//           question?.id,

//         question_id:
//           question?.id,
//       },
//     );
//   }


//   /* ==========================================================
//      LOCK QUESTION

//      HOST ONLY

//      This is the host-controlled lock command.

//      There is intentionally NO timer_expired socket event.

//      The frontend timer can trigger this method when it reaches
//      zero, or the host can click a Lock Question button.

//      The backend remains authoritative.
//      ========================================================== */

//   lockQuestion(): void {
//     this.assertHost();

//     const question =
//       this.state.currentQuestion;

//     if (!question) {
//       throw new Error(
//         "There is no active question to lock.",
//       );
//     }

//     if (
//       this.state.questionLocked
//     ) {
//       return;
//     }

//     /*
//      * Optimistic UI state.
//      *
//      * The backend still decides whether the lock request is
//      * valid and authoritative.
//      */
//     this.setState({
//       questionLocked:
//         true,

//       timeRemaining:
//         0,
//     });

//     this.stopLocalTimer();

//     const payload = {
//       roomId:
//         this.config.roomId,

//       room_id:
//         this.config.roomId,

//       quizId:
//         this.config.quizId,

//       quiz_id:
//         this.config.quizId,

//       roundNumber:
//         this.state.roundNumber,

//       round_number:
//         this.state.roundNumber,

//       questionId:
//         question.id,

//       question_id:
//         question.id,

//       questionNumber:
//         question.questionNumber,

//       question_number:
//         question.questionNumber,
//     };

//     console.log(
//       "[Quiz Game] HOST locking question:",
//       payload,
//     );

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.QUESTION_LOCKED,
//       payload,
//     );
//   }


//   /* ==========================================================
//      SUBMIT ANSWER

//      STUDENT ONLY
//      ========================================================== */

//   submitAnswer(
//     answer: string,
//   ): void {
//     if (
//       this.config.role !==
//       "STUDENT"
//     ) {
//       throw new Error(
//         "Only a student can submit an answer.",
//       );
//     }

//     if (
//       this.state.questionLocked
//     ) {
//       console.warn(
//         "[Quiz Game] Question is already locked.",
//       );

//       return;
//     }

//     if (
//       this.state.answerSubmitted
//     ) {
//       console.warn(
//         "[Quiz Game] Answer already submitted for this question.",
//       );

//       return;
//     }

//     const question =
//       this.state.currentQuestion;

//     if (!question) {
//       throw new Error(
//         "There is no active question.",
//       );
//     }

//     const normalizedAnswer =
//       String(
//         answer,
//       ).trim();

//     if (
//       !normalizedAnswer
//     ) {
//       throw new Error(
//         "An answer is required.",
//       );
//     }

//     /*
//      * Optimistic UI state.
//      *
//      * Backend remains authoritative.
//      */

//     this.setState({
//       selectedAnswer:
//         normalizedAnswer,

//       answerSubmitted:
//         true,
//     });

//     const payload = {
//       roomId:
//         this.config.roomId,

//       room_id:
//         this.config.roomId,

//       quizId:
//         this.config.quizId,

//       quiz_id:
//         this.config.quizId,

//       questionId:
//         question.id,

//       question_id:
//         question.id,

//       questionNumber:
//         question.questionNumber,

//       question_number:
//         question.questionNumber,

//       roundNumber:
//         this.state.roundNumber,

//       round_number:
//         this.state.roundNumber,

//       answer:
//         normalizedAnswer,

//       selectedAnswer:
//         normalizedAnswer,

//       selected_answer:
//         normalizedAnswer,
//     };

//     console.log(
//       "[Quiz Game] Student submitting answer:",
//       {
//         ...payload,

//         /*
//          * Do not log answer keys.
//          */
//       },
//     );

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.SUBMIT_ANSWER,
//       payload,
//     );
//   }


//   /* ==========================================================
//      SELECT ANSWER
     
//      Alias for UI components.
//      ========================================================== */

//   selectAnswer(
//     answer: string,
//   ): void {
//     this.submitAnswer(
//       answer,
//     );
//   }


//   /* ==========================================================
//      SYNC LEADERBOARD

//      BOTH HOST AND STUDENT
//      ========================================================== */

//   syncLeaderboard(): void {
//     this.socket.emit(
//       QUIZ_GAME_EVENTS.SYNC_LEADERBOARD,
//       {
//         roomId:
//           this.config.roomId,

//         room_id:
//           this.config.roomId,

//         quizId:
//           this.config.quizId,

//         quiz_id:
//           this.config.quizId,

//         roundNumber:
//           this.state.roundNumber,

//         round_number:
//           this.state.roundNumber,
//       },
//     );
//   }


//   /* ==========================================================
//      REQUEST TIEBREAKER QUESTION

//      HOST ONLY
//      ========================================================== */

//   requestTiebreakerQuestion(): void {
//     this.assertHost();

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.REQUEST_TIEBREAKER_QUESTION,
//       {
//         roomId:
//           this.config.roomId,

//         room_id:
//           this.config.roomId,

//         quizId:
//           this.config.quizId,

//         quiz_id:
//           this.config.quizId,

//         roundNumber:
//           this.state.roundNumber,

//         round_number:
//           this.state.roundNumber,
//       },
//     );
//   }


//   /* ==========================================================
//      RESOLVE TIEBREAKER ELIMINATIONS

//      HOST ONLY
//      ========================================================== */

//   resolveTiebreakerEliminations(
//     eliminatedParticipantIds: string[],
//   ): void {
//     this.assertHost();

//     if (
//       !Array.isArray(
//         eliminatedParticipantIds,
//       )
//     ) {
//       throw new Error(
//         "Eliminated participant IDs must be an array.",
//       );
//     }

//     this.socket.emit(
//       QUIZ_GAME_EVENTS.RESOLVE_TIEBREAKER_ELIMINATIONS,
//       {
//         roomId:
//           this.config.roomId,

//         room_id:
//           this.config.roomId,

//         quizId:
//           this.config.quizId,

//         quiz_id:
//           this.config.quizId,

//         roundNumber:
//           this.state.roundNumber,

//         round_number:
//           this.state.roundNumber,

//         eliminatedParticipantIds,

//         eliminated_participant_ids:
//           eliminatedParticipantIds,
//       },
//     );
//   }


//   /* ==========================================================
//      RESET ANSWER STATE
//      ========================================================== */

//   resetAnswerState(): void {
//     this.setState({
//       selectedAnswer:
//         null,

//       answerSubmitted:
//         false,

//       firstCorrectWinner:
//         null,
//     });
//   }


//   /* ==========================================================
//      RESET QUESTION STATE
//      ========================================================== */

//   resetQuestionState(): void {
//     this.stopLocalTimer();

//     this.setState({
//       currentQuestion:
//         null,

//       questionNumber:
//         null,

//       questionLocked:
//         false,

//       timerStartedAt:
//         null,

//       timerExpiresAt:
//         null,

//       timeRemaining:
//         this.config
//           .timePerQuestion ??
//         null,

//       selectedAnswer:
//         null,

//       answerSubmitted:
//         false,

//       firstCorrectWinner:
//         null,
//     });
//   }


//   /* ==========================================================
//      GET ELIMINATED PARTICIPANT IDS
//      ========================================================== */

//   private extractParticipantIds(
//     payload: unknown,
//   ): string[] {
//     const data =
//       getPayloadData(
//         payload,
//       );

//     if (
//       Array.isArray(data)
//     ) {
//       return data
//         .map(
//           (item) => {
//             if (
//               typeof item ===
//               "string"
//             ) {
//               return item;
//             }

//             if (
//               isRecord(item)
//             ) {
//               return (
//                 asString(
//                   item.contestantId,
//                 ) ??
//                 asString(
//                   item.contestant_id,
//                 ) ??
//                 asString(
//                   item.userId,
//                 ) ??
//                 asString(
//                   item.user_id,
//                 ) ??
//                 asString(
//                   item.id,
//                 )
//               );
//             }

//             return null;
//           },
//         )
//         .filter(
//           (
//             id,
//           ): id is string =>
//             Boolean(id),
//         );
//     }

//     if (
//       !isRecord(data)
//     ) {
//       return [];
//     }

//     const candidates = [
//       data.eliminatedParticipantIds,
//       data.eliminated_participant_ids,
//       data.eliminatedParticipants,
//       data.eliminated_participants,
//       data.participantIds,
//       data.participant_ids,
//     ];

//     for (
//       const candidate of
//       candidates
//     ) {
//       if (
//         !Array.isArray(
//           candidate,
//         )
//       ) {
//         continue;
//       }

//       return candidate
//         .map(
//           (item) => {
//             if (
//               typeof item ===
//               "string"
//             ) {
//               return item;
//             }

//             if (
//               isRecord(item)
//             ) {
//               return (
//                 asString(
//                   item.contestantId,
//                 ) ??
//                 asString(
//                   item.contestant_id,
//                 ) ??
//                 asString(
//                   item.userId,
//                 ) ??
//                 asString(
//                   item.user_id,
//                 ) ??
//                 asString(
//                   item.id,
//                 )
//               );
//             }

//             return null;
//           },
//         )
//         .filter(
//           (
//             id,
//           ): id is string =>
//             Boolean(id),
//         );
//     }

//     return [];
//   }


//   /* ==========================================================
//      MERGE SCOREBOARD INTO PARTICIPANTS
//      ========================================================== */

//   private mergeScoreboardIntoParticipants(
//     participants:
//       QuizParticipant[],
//     scoreboard:
//       QuizScoreboardEntry[],
//   ): QuizParticipant[] {
//     return participants.map(
//       (participant) => {
//         const entry =
//           scoreboard.find(
//             (item) =>
//               item.contestantId ===
//                 participant.id ||
//               (
//                 item.userId !==
//                   null &&
//                 participant.userId !==
//                   null &&
//                 item.userId ===
//                   participant.userId
//               ),
//           );

//         if (!entry) {
//           return participant;
//         }

//         return {
//           ...participant,

//           score:
//             entry.score,

//           position:
//             entry.position,

//           eliminated:
//             entry.eliminated,
//         };
//       },
//     );
//   }


//   /* ==========================================================
//      QUESTION NUMBER NORMALIZATION
//      ========================================================== */

//   private normalizeQuestionNumber(
//     questionNumber: number,
//   ): number {
//     const normalized =
//       Math.floor(
//         Number(
//           questionNumber,
//         ),
//       );

//     if (
//       !Number.isFinite(
//         normalized,
//       ) ||
//       normalized < 1
//     ) {
//       throw new Error(
//         "Question number must be at least 1.",
//       );
//     }

//     return normalized;
//   }


//   /* ==========================================================
//      QUESTION VALIDATION
//      ========================================================== */

//   private assertQuestionExists(
//     questionNumber: number,
//   ): void {
//     if (
//       this.state.totalQuestions !==
//         null &&
//       questionNumber >
//         this.state.totalQuestions
//     ) {
//       throw new Error(
//         `Question ${questionNumber} is outside the current round.`,
//       );
//     }

//     /*
//      * If the host has loaded the round questions, require the
//      * requested question to exist in that HTTP-loaded set.
//      */
//     if (
//       this.config.role ===
//         "HOST" &&
//       this.state.questions.length >
//         0
//     ) {
//       const exists =
//         this.state.questions.some(
//           (question) =>
//             question.questionNumber ===
//             questionNumber,
//         );

//       if (
//         !exists
//       ) {
//         throw new Error(
//           `Question ${questionNumber} was not found in the loaded round questions.`,
//         );
//       }
//     }
//   }


//   /* ==========================================================
//      DISPOSE
     
//      IMPORTANT:
     
//      This controller uses a shared Socket.IO instance.
     
//      NEVER call removeAllListeners() here.
     
//      Only this controller's handlers are removed.
//      ========================================================== */

//   dispose(): void {
//     this.stopLocalTimer();

//     for (
//       const {
//         event,
//         handler,
//       } of this.socketHandlers
//     ) {
//       this.socket.off(
//         event,
//         handler,
//       );
//     }

//     this.socketHandlers.length =
//       0;

//     this.bound =
//       false;

//     this.listeners.clear();
//   }


//   /* ==========================================================
//      HOST ASSERTION
//      ========================================================== */

//   private assertHost(): void {
//     if (
//       this.config.role !==
//       "HOST"
//     ) {
//       throw new Error(
//         "This quiz game action is available only to the host.",
//       );
//     }
//   }
// }


// /* ============================================================
//    FACTORY
//    ============================================================ */

// export function createQuizGameController(
//   config: QuizGameConfig,
// ): QuizGameController {
//   const controller =
//     new QuizGameController(
//       config,
//     );

//   controller.bindSocket();

//   return controller;
// }









