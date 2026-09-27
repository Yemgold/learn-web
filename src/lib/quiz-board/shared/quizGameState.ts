





// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\shared\quizGameState.ts

import type {
  QuizConnectionStatus,
  QuizCurrentQuestion,
  QuizGameRole,
  QuizGameState,
  QuizGameStatus,
  QuizGameTimer,
  QuizQuestionStatus,
  QuizRoundState,
} from "./quizGameTypes";

/* ============================================================
   DEFAULT VALUES
   ============================================================ */

export const DEFAULT_QUESTION_TIME_LIMIT = 30;

export const DEFAULT_GAME_STATUS: QuizGameStatus =
  "WAITING";

export const DEFAULT_CONNECTION_STATUS: QuizConnectionStatus =
  "DISCONNECTED";

export const DEFAULT_QUESTION_STATUS: QuizQuestionStatus =
  "WAITING";

/* ============================================================
   EMPTY TIMER
   ============================================================ */

export function createEmptyQuizTimer(
  durationSeconds = DEFAULT_QUESTION_TIME_LIMIT,
): QuizGameTimer {
  return {
    durationSeconds,
    remainingSeconds: durationSeconds,
    startedAt: null,
    endsAt: null,
    running: false,
    expired: false,
  };
}

/* ============================================================
   EMPTY CURRENT QUESTION
   ============================================================ */

export function createEmptyCurrentQuestion(
  timeLimit = DEFAULT_QUESTION_TIME_LIMIT,
): QuizCurrentQuestion {
  return {
    question: null,
    questionNumber: null,
    roundNumber: null,
    status: DEFAULT_QUESTION_STATUS,
    startedAt: null,
    lockedAt: null,
    timeLimit,
    timer: createEmptyQuizTimer(timeLimit),
  };
}

/* ============================================================
   EMPTY ROUND
   ============================================================ */

export function createEmptyRoundState(): QuizRoundState {
  return {
    roundNumber: 1,
    totalQuestions: 0,
    currentQuestionNumber: null,
    completedQuestions: 0,
    started: false,
    completed: false,
    eliminatedParticipantIds: [],
  };
}

/* ============================================================
   INITIAL GAME STATE
   ============================================================ */

export function createInitialQuizGameState(
  quizId = "",
  roomId = "",
  role: QuizGameRole | null = null,
): QuizGameState {
  return {
    quizId,

    roomId,

    role,

    connectionStatus: DEFAULT_CONNECTION_STATUS,

    room: {
      roomId,

      quizId,

      activated: false,

      joined: false,

      role,

      hostId: null,

      participantCount: 0,

      maxParticipants: undefined,

      status: DEFAULT_GAME_STATUS,
    },

    gameStatus: DEFAULT_GAME_STATUS,

    round: createEmptyRoundState(),

    currentQuestion: createEmptyCurrentQuestion(),

    participants: [],

    leaderboard: [],

    selectedQuestionNumber: null,

    submittedAnswer: null,

    hasAnsweredCurrentQuestion: false,

    error: null,

    lastUpdatedAt: null,
  };
}

/* ============================================================
   RESET QUESTION
   ============================================================ */

export function resetQuestionState(
  state: QuizGameState,
): QuizGameState {
  return {
    ...state,

    currentQuestion: createEmptyCurrentQuestion(),

    submittedAnswer: null,

    hasAnsweredCurrentQuestion: false,

    gameStatus: state.round.started
      ? "ROUND_ACTIVE"
      : state.gameStatus,

    round: {
      ...state.round,

      currentQuestionNumber: null,
    },

    error: null,

    lastUpdatedAt: Date.now(),
  };
}

/* ============================================================
   RESET ROUND
   ============================================================ */

export function resetRoundState(
  state: QuizGameState,
  roundNumber = 1,
): QuizGameState {
  return {
    ...state,

    currentQuestion: createEmptyCurrentQuestion(),

    submittedAnswer: null,

    hasAnsweredCurrentQuestion: false,

    gameStatus: "ROUND_WAITING",

    round: {
      roundNumber,

      totalQuestions: 0,

      currentQuestionNumber: null,

      completedQuestions: 0,

      started: false,

      completed: false,

      eliminatedParticipantIds: [],
    },

    error: null,

    lastUpdatedAt: Date.now(),
  };
}

/* ============================================================
   RESET GAME
   ============================================================ */

export function resetQuizGameState(
  state: QuizGameState,
): QuizGameState {
  return createInitialQuizGameState(
    state.quizId,
    state.roomId,
    state.role,
  );
}

/* ============================================================
   MARK QUESTION ACTIVE
   ============================================================ */

export function activateQuestionState(
  state: QuizGameState,
  questionNumber: number,
  roundNumber: number,
  timeLimit = DEFAULT_QUESTION_TIME_LIMIT,
): QuizGameState {
  const now = Date.now();

  return {
    ...state,

    gameStatus: "QUESTION_ACTIVE",

    currentQuestion: {
      ...state.currentQuestion,

      questionNumber,

      roundNumber,

      status: "ACTIVE",

      startedAt: now,

      lockedAt: null,

      timeLimit,

      timer: {
        durationSeconds: timeLimit,

        remainingSeconds: timeLimit,

        startedAt: now,

        endsAt: now + timeLimit * 1000,

        running: true,

        expired: false,
      },
    },

    round: {
      ...state.round,

      roundNumber,

      currentQuestionNumber: questionNumber,

      started: true,
    },

    hasAnsweredCurrentQuestion: false,

    submittedAnswer: null,

    error: null,

    lastUpdatedAt: now,
  };
}

/* ============================================================
   LOCK QUESTION
   ============================================================ */

export function lockQuestionState(
  state: QuizGameState,
): QuizGameState {
  const now = Date.now();

  return {
    ...state,

    gameStatus: "QUESTION_LOCKED",

    currentQuestion: {
      ...state.currentQuestion,

      status: "LOCKED",

      lockedAt: now,

      timer: {
        ...state.currentQuestion.timer,

        running: false,
      },
    },

    lastUpdatedAt: now,
  };
}

/* ============================================================
   SET CONNECTION STATUS
   ============================================================ */

export function setConnectionStatus(
  state: QuizGameState,
  connectionStatus: QuizConnectionStatus,
): QuizGameState {
  return {
    ...state,

    connectionStatus,

    lastUpdatedAt: Date.now(),
  };
}

/* ============================================================
   SET ERROR
   ============================================================ */

export function setQuizGameError(
  state: QuizGameState,
  error: string | null,
): QuizGameState {
  return {
    ...state,

    error,

    lastUpdatedAt: Date.now(),
  };
}