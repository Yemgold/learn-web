





// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\contestant\quizGameSocket.ts

import type { Socket } from "socket.io-client";

import { getQuizSocket } from "@/lib/socket/quizSocket";

/* ============================================================
   CONTESTANT QUIZ SOCKET
   ============================================================

   CONTESTANT RESPONSIBILITIES
   ------------------------------------------------------------

   1. JOIN ROOM
      Event:
        join_room

   2. RECEIVE ROOM STATE
      Event:
        room_state

   3. RECEIVE QUESTION
      Event:
        new_question_displayed

   4. SELECT ANSWER
      Event:
        participant_selected_answer

      IMPORTANT:
        The contestant locks the answer locally immediately.

   5. RECEIVE ANSWER RESULT
      Event:
        answer_result

   6. RECEIVE SCOREBOARD
      Event:
        scoreboard_update

   7. RECEIVE LADDER
      Event:
        ladder_update

   8. RECEIVE QUESTION / ROUND EVENTS

   ------------------------------------------------------------

   IMPORTANT SECURITY RULE
   ------------------------------------------------------------

   This file NEVER expects or exposes:

      isCorrect
      correctAnswer
      correctAnswers
      answerKey
      correctValues
      optionsWithAnswers

   The backend remains authoritative for:

      - correctness
      - first-correct
      - scoring
      - elimination
      - timer
      - question locking
      - round progression

   ============================================================ */


/* ============================================================
   EVENT NAMES
   ============================================================ */

export const CONTESTANT_QUIZ_SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  JOIN_ROOM: "join_room",
  ROOM_STATE: "room_state",
  ROOM_ACTIVATED: "room_activated",

  NEW_QUESTION_DISPLAYED:
    "new_question_displayed",

  PARTICIPANT_SELECTED_ANSWER:
    "participant_selected_answer",

  ANSWER_RESULT:
    "answer_result",

  SCOREBOARD_UPDATE:
    "scoreboard_update",

  LADDER_UPDATE:
    "ladder_update",

  QUESTION_STARTED:
    "question_started",

  QUESTION_LOCKED:
    "question_locked",

  ROUND_STARTED:
    "round_started",

  ROUND_COMPLETED:
    "round_completed",

  PARTICIPANTS_ELIMINATED:
    "participants_eliminated",

  SOCKET_ERROR:
    "socket_error",

  MESSAGE:
    "message",
} as const;


/* ============================================================
   TYPES
   ============================================================ */


/**
 * Public question option.
 *
 * This intentionally contains only information that a
 * contestant is allowed to see.
 */
export interface ContestantQuestionOption {
  label?: string;
  value: string;
}


/**
 * Public question received by a contestant.
 *
 * Do NOT add answer-key fields here.
 */
export interface ContestantQuizQuestion {
  id: string;

  quizId?: string;

  question: string;

  options: ContestantQuestionOption[];

  questionNumber?: number;

  startTime?: string;

  subjectId?: string;

  section?: string;

  questionType?: string;

  isMultipleAnswer?: boolean;

  difficulty?: string;

  instruction?: string;

  passageId?: string;

  content?: unknown[];

  media?: unknown | null;
}


/**
 * Payload emitted when a contestant selects an answer.
 *
 * IMPORTANT:
 *
 * `answer` is the selected option value.
 *
 * If the backend contract uses a different property name,
 * change ONLY this payload interface and emit below.
 */
export interface ParticipantSelectedAnswerPayload {
  quizId: string;

  roomId: string;

  questionId: string;

  answer: string;
}


/**
 * Generic join-room payload.
 */
export interface JoinRoomPayload {
  quizId: string;

  roomId: string;
}


/**
 * Generic socket error.
 */
export interface ContestantSocketErrorPayload {
  message?: string;

  error?: string;

  reason?: string;

  statusCode?: number;

  status?: string;
}


/* ============================================================
   CALLBACK TYPES
   ============================================================ */

export interface ContestantQuizGameSocketCallbacks {
  onConnected?: (socketId: string | undefined) => void;

  onDisconnected?: (reason: unknown) => void;

  onConnectionError?: (error: unknown) => void;

  onRoomState?: (payload: unknown) => void;

  onRoomActivated?: (payload: unknown) => void;

  onNewQuestion?: (
    question: ContestantQuizQuestion,
    payload: unknown,
  ) => void;

  onAnswerResult?: (payload: unknown) => void;

  onScoreboardUpdate?: (payload: unknown) => void;

  onLadderUpdate?: (payload: unknown) => void;

  onQuestionStarted?: (payload: unknown) => void;

  onQuestionLocked?: (payload: unknown) => void;

  onRoundStarted?: (payload: unknown) => void;

  onRoundCompleted?: (payload: unknown) => void;

  onParticipantsEliminated?: (payload: unknown) => void;

  onSocketError?: (payload: unknown) => void;

  onMessage?: (payload: unknown) => void;
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


/**
 * Socket payloads in the application may arrive as:
 *
 *   payload
 *
 * or:
 *
 *   { data: payload }
 *
 * or:
 *
 *   { payload: payload }
 *
 * This helper is intentionally small.
 *
 * We do NOT duplicate the large host question
 * normalization layer here.
 */
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
   PUBLIC QUESTION NORMALIZATION
   ============================================================

   The contestant receives an already-public question.

   We only normalize the fields needed by the contestant UI.

   We deliberately DO NOT inspect or copy:

      isCorrect
      correctAnswer
      correctAnswers
      answerKey
      correctValues
      optionsWithAnswers

   ============================================================ */

function normalizeContestantQuestion(
  payload: unknown,
): ContestantQuizQuestion | null {
  const data =
    getPayloadData(payload);

  /*
   * The backend currently broadcasts the question directly:
   *
   * {
   *   quizId,
   *   id,
   *   question,
   *   options,
   *   startTime,
   *   questionNumber
   * }
   *
   * Some socket responses may wrap it in:
   *
   * {
   *   data: {
   *     ...
   *   }
   * }
   */

  if (!isRecord(data)) {
    return null;
  }

  /*
   * In case a wrapper contains:
   *
   * {
   *   question: {...}
   * }
   *
   * use the nested question.
   *
   * Otherwise use the payload itself.
   */
  const source =
    isRecord(data.question)
      ? data.question
      : data;

  const id =
    asString(source.id) ??
    asString(source._id);

  const question =
    asString(source.question) ??
    asString(source.text);

  if (!id || !question) {
    return null;
  }

  const rawOptions =
    Array.isArray(source.options)
      ? source.options
      : [];

  const options =
    rawOptions
      .map((option) => {
        if (!isRecord(option)) {
          return null;
        }

        const value =
          asString(option.value) ??
          asString(option.id) ??
          asString(option._id);

        if (!value) {
          return null;
        }

        const label =
          asString(option.label) ??
          asString(option.text) ??
          undefined;

        return {
          value,
          ...(label
            ? { label }
            : {}),
        };
      })
      .filter(
        (
          option,
        ): option is ContestantQuestionOption =>
          option !== null,
      );

  return {
    id,

    quizId:
      asString(data.quizId) ??
      asString(source.quizId) ??
      undefined,

    question,

    options,

    questionNumber:
      typeof source.questionNumber === "number"
        ? source.questionNumber
        : typeof source.question_number === "number"
          ? source.question_number
          : undefined,

    startTime:
      asString(source.startTime) ??
      asString(source.start_time) ??
      undefined,

    subjectId:
      asString(source.subjectId) ??
      asString(source.subject_id) ??
      undefined,

    section:
      asString(source.section) ??
      undefined,

    questionType:
      asString(source.questionType) ??
      asString(source.question_type) ??
      undefined,

    isMultipleAnswer:
      typeof source.isMultipleAnswer === "boolean"
        ? source.isMultipleAnswer
        : typeof source.is_multiple_answer === "boolean"
          ? source.is_multiple_answer
          : undefined,

    difficulty:
      asString(source.difficulty) ??
      undefined,

    instruction:
      asString(source.instruction) ??
      undefined,

    passageId:
      asString(source.passageId) ??
      asString(source.passage_id) ??
      undefined,

    content:
      Array.isArray(source.content)
        ? source.content
        : undefined,

    media:
      isRecord(source.media)
        ? source.media
        : null,
  };
}


/* ============================================================
   SOCKET CONTROLLER
   ============================================================ */

export class ContestantQuizGameSocket {
  private readonly socket: Socket;

  private readonly quizId: string;

  private readonly roomId: string;

  private listeners: Array<{
    event: string;
    handler: (...args: unknown[]) => void;
  }> = [];

  /**
   * Local connection state.
   */
  private connected = false;

  /**
   * Current question received from backend.
   */
  private currentQuestion: ContestantQuizQuestion | null = null;

  /**
   * Current question ID.
   *
   * Used to prevent an answer from being submitted against
   * a stale question.
   */
  private currentQuestionId: string | null = null;

  /**
   * Local answer lock.
   *
   * FALSE:
   *   contestant may select an answer.
   *
   * TRUE:
   *   contestant has already selected an answer and
   *   all answer options must remain locked.
   */
  private answerLocked = false;

  /**
   * Currently selected answer.
   */
  private selectedAnswer: string | null = null;

  private readonly callbacks: ContestantQuizGameSocketCallbacks;


  constructor(
    quizId: string,
    roomId: string,
    callbacks: ContestantQuizGameSocketCallbacks = {},
  ) {
    this.quizId =
      String(quizId).trim();

    this.roomId =
      String(roomId).trim();

    this.callbacks =
      callbacks;

    /*
     * IMPORTANT:
     *
     * Reuse the application's existing socket.
     *
     * Do NOT create another io() connection here.
     */
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
     GET CONNECTION STATE
     ========================================================== */

  isConnected(): boolean {
    return (
      this.connected ||
      this.socket.connected
    );
  }


  /* ==========================================================
     GET CURRENT QUESTION
     ========================================================== */

  getCurrentQuestion():
    ContestantQuizQuestion | null {
    return this.currentQuestion;
  }


  /* ==========================================================
     GET SELECTED ANSWER
     ========================================================== */

  getSelectedAnswer(): string | null {
    return this.selectedAnswer;
  }


  /* ==========================================================
     GET ANSWER LOCK
     ========================================================== */

  isAnswerLocked(): boolean {
    return this.answerLocked;
  }


  /* ==========================================================
     BIND
     ========================================================== */

  bind(): void {
    if (this.listeners.length > 0) {
      return;
    }


    /* --------------------------------------------------------
       CONNECT
       -------------------------------------------------------- */

    const handleConnect =
      () => {
        this.connected = true;

        console.log(
          "[Contestant Quiz Socket] Connected:",
          this.socket.id,
        );

        this.callbacks.onConnected?.(
          this.socket.id,
        );
      };


    /* --------------------------------------------------------
       DISCONNECT
       -------------------------------------------------------- */

    const handleDisconnect =
      (reason: unknown) => {
        this.connected = false;

        console.log(
          "[Contestant Quiz Socket] Disconnected:",
          reason,
        );

        this.callbacks.onDisconnected?.(
          reason,
        );
      };


    /* --------------------------------------------------------
       CONNECTION ERROR
       -------------------------------------------------------- */

    const handleConnectError =
      (error: unknown) => {
        this.connected = false;

        console.error(
          "[Contestant Quiz Socket] Connection error:",
          error,
        );

        this.callbacks.onConnectionError?.(
          error,
        );
      };


    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.CONNECT,
      handleConnect,
    );

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.DISCONNECT,
      handleDisconnect,
    );

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.CONNECT_ERROR,
      handleConnectError,
    );


    /* --------------------------------------------------------
       ROOM STATE
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.ROOM_STATE,
      (payload) => {
        console.log(
          "[Contestant Quiz Socket] room_state:",
          payload,
        );

        this.callbacks.onRoomState?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       ROOM ACTIVATED
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.ROOM_ACTIVATED,
      (payload) => {
        console.log(
          "[Contestant Quiz Socket] room_activated:",
          payload,
        );

        this.callbacks.onRoomActivated?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       NEW QUESTION
       --------------------------------------------------------

       IMPORTANT:

       A new question ALWAYS resets the local answer lock.

       Therefore:

         previous question
             ↓
         locked
             ↓
         new question
             ↓
         unlocked
       */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.NEW_QUESTION_DISPLAYED,
      (payload) => {
        const question =
          normalizeContestantQuestion(
            payload,
          );

        if (!question) {
          console.warn(
            "[Contestant Quiz Socket] Unable to normalize new question:",
            payload,
          );

          return;
        }

        this.currentQuestion =
          question;

        this.currentQuestionId =
          question.id;

        /*
         * New question = new answer cycle.
         */
        this.selectedAnswer = null;

        this.answerLocked = false;

        console.log(
          "[Contestant Quiz Socket] NEW QUESTION:",
          {
            quizId:
              this.quizId,

            roomId:
              this.roomId,

            questionId:
              question.id,

            questionNumber:
              question.questionNumber,
          },
        );

        this.callbacks.onNewQuestion?.(
          question,
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       ANSWER RESULT
       --------------------------------------------------------

       IMPORTANT:

       We DO NOT unlock the answer here.

       Once the contestant selects an answer, the options
       remain locked until the next question.
       */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.ANSWER_RESULT,
      (payload) => {
        console.log(
          "[Contestant Quiz Socket] answer_result:",
          payload,
        );

        this.callbacks.onAnswerResult?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       SCOREBOARD
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.SCOREBOARD_UPDATE,
      (payload) => {
        this.callbacks.onScoreboardUpdate?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       LADDER
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.LADDER_UPDATE,
      (payload) => {
        this.callbacks.onLadderUpdate?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       QUESTION STARTED
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.QUESTION_STARTED,
      (payload) => {
        this.callbacks.onQuestionStarted?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       QUESTION LOCKED
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.QUESTION_LOCKED,
      (payload) => {
        /*
         * Backend can lock the question independently.
         *
         * Once locked, the contestant cannot select anything.
         */
        this.answerLocked = true;

        this.callbacks.onQuestionLocked?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       ROUND STARTED
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.ROUND_STARTED,
      (payload) => {
        this.callbacks.onRoundStarted?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       ROUND COMPLETED
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.ROUND_COMPLETED,
      (payload) => {
        this.callbacks.onRoundCompleted?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       PARTICIPANTS ELIMINATED
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
      (payload) => {
        this.callbacks.onParticipantsEliminated?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       SOCKET ERROR
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.SOCKET_ERROR,
      (payload) => {
        console.error(
          "[Contestant Quiz Socket] socket_error:",
          payload,
        );

        this.callbacks.onSocketError?.(
          payload,
        );
      },
    );


    /* --------------------------------------------------------
       MESSAGE
       -------------------------------------------------------- */

    this.addListener(
      CONTESTANT_QUIZ_SOCKET_EVENTS.MESSAGE,
      (payload) => {
        this.callbacks.onMessage?.(
          payload,
        );
      },
    );


    if (this.socket.connected) {
      this.connected = true;
    }
  }


  /* ==========================================================
     JOIN ROOM
     ========================================================== */

  joinRoom(): void {
    const payload:
      JoinRoomPayload = {
      quizId:
        this.quizId,

      roomId:
        this.roomId,
    };

    console.log(
      "[Contestant Quiz Socket] join_room:",
      payload,
    );

    this.socket.emit(
      CONTESTANT_QUIZ_SOCKET_EVENTS.JOIN_ROOM,
      payload,
    );
  }


  /* ==========================================================
     SELECT ANSWER
     ==========================================================

     IMPORTANT:

     This method performs the immediate contestant-side lock.

     The sequence is:

       1. Validate answer.
       2. Validate current question.
       3. Check local lock.
       4. Save selected answer.
       5. Lock all options immediately.
       6. Emit participant_selected_answer.

     There is NO submit button.

     The backend later sends answer_result.

     ========================================================== */

  selectAnswer(
    value: string,
  ): boolean {
    const answer =
      String(value ?? "").trim();

    if (!answer) {
      return false;
    }


    if (!this.isConnected()) {
      console.warn(
        "[Contestant Quiz Socket] ANSWER BLOCKED: socket not connected.",
      );

      return false;
    }


    if (!this.currentQuestionId) {
      console.warn(
        "[Contestant Quiz Socket] ANSWER BLOCKED: no current question.",
      );

      return false;
    }


    if (this.answerLocked) {
      console.warn(
        "[Contestant Quiz Socket] ANSWER BLOCKED: already selected.",
        {
          questionId:
            this.currentQuestionId,

          selectedAnswer:
            this.selectedAnswer,
        },
      );

      return false;
    }


    /*
     * IMPORTANT:
     *
     * Lock BEFORE emitting.
     *
     * This prevents a rapid double-click from sending
     * multiple answers before the server responds.
     */
    this.selectedAnswer =
      answer;

    this.answerLocked =
      true;


    const payload:
      ParticipantSelectedAnswerPayload = {
      quizId:
        this.quizId,

      roomId:
        this.roomId,

      questionId:
        this.currentQuestionId,

      answer,
    };


    console.log(
      "[Contestant Quiz Socket] ANSWER SELECTED:",
      payload,
    );


    this.socket.emit(
      CONTESTANT_QUIZ_SOCKET_EVENTS.PARTICIPANT_SELECTED_ANSWER,
      payload,
    );


    return true;
  }


  /* ==========================================================
     RESET ANSWER
     ==========================================================

     Normally this happens automatically when a new question
     arrives.

     This method exists for controlled state reset when the
     hook/controller needs it.
     ========================================================== */

  resetAnswer(): void {
    this.selectedAnswer =
      null;

    this.answerLocked =
      false;
  }


  /* ==========================================================
     SET CURRENT QUESTION
     ==========================================================

     Useful when the React hook already has a question and
     needs to synchronize this controller with it.
     ========================================================== */

  setCurrentQuestion(
    question:
      ContestantQuizQuestion | null,
  ): void {
    this.currentQuestion =
      question;

    this.currentQuestionId =
      question?.id ?? null;

    this.selectedAnswer =
      null;

    this.answerLocked =
      false;
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

export function createContestantQuizGameSocket(
  quizId: string,
  roomId: string,
  callbacks: ContestantQuizGameSocketCallbacks = {},
): ContestantQuizGameSocket {
  const controller =
    new ContestantQuizGameSocket(
      quizId,
      roomId,
      callbacks,
    );

  controller.bind();

  return controller;
}