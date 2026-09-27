// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\shared\quizGameEvents.ts

import type {
  ActivateRoomPayload,
  JoinRoomPayload,
  LockQuestionPayload,
  NextQuestionPayload,
  QuizSocketAck,
  QuizSocketError,
  StartQuestionPayload,
  StartRoundPayload,
  SubmitAnswerPayload,
} from "./quizGameTypes";

/* ============================================================
   SOCKET EVENT NAMES
   ============================================================ */

export const QUIZ_GAME_EVENTS = {
  /* ----------------------------------------------------------
     ROOM
     ---------------------------------------------------------- */

  ACTIVATE_ROOM: "activate_room",

  ROOM_ACTIVATION_ACK: "room_activation_ack",

  ROOM_ACTIVATED: "room_activated",

  JOIN_ROOM: "join_room",

  JOINED_ROOM_ACK: "joined_room_ack",

  ROOM_STATE: "room_state",

  PARTICIPANT_JOINED_ROOM:
    "participant_joined_room",

  PARTICIPANT_LEFT_ROOM:
    "participant_left_room",

  /* ----------------------------------------------------------
     ROUND
     ---------------------------------------------------------- */

  START_ROUND: "start_round",

  ROUND_STARTED: "round_started",

  ROUND_COMPLETED: "round_completed",

  /* ----------------------------------------------------------
     QUESTION
     ---------------------------------------------------------- */

  START_QUESTION: "start_question",

  QUESTION_STARTED: "question_started",

  LOCK_QUESTION: "lock_question",

  QUESTION_LOCKED: "question_locked",

  NEXT_QUESTION: "next_question",

  QUESTION_COMPLETED: "question_completed",

  /* ----------------------------------------------------------
     ANSWERS
     ---------------------------------------------------------- */

  SUBMIT_ANSWER: "submit_answer",

  PARTICIPANT_SELECTED_ANSWER:
    "participant_selected_answer",

  ANSWER_RESULT: "answer_result",

  FIRST_CORRECT_ANSWER:
    "first_correct_answer",

  /* ----------------------------------------------------------
     LEADERBOARD
     ---------------------------------------------------------- */

  SYNC_LEADERBOARD: "sync_leaderboard",

  LEADERBOARD_UPDATED:
    "leaderboard_updated",

  /* ----------------------------------------------------------
     ELIMINATION / TIEBREAKER
     ---------------------------------------------------------- */

  REQUEST_TIEBREAKER_QUESTION:
    "request_tiebreaker_question",

  TIEBREAKER_QUESTION_STARTED:
    "tiebreaker_question_started",

  RESOLVE_TIEBREAKER_ELIMINATIONS:
    "resolve_tiebreaker_eliminations",

  PARTICIPANTS_ELIMINATED:
    "participants_eliminated",

  /* ----------------------------------------------------------
     GAME
     ---------------------------------------------------------- */

  GAME_COMPLETED: "game_completed",

  /* ----------------------------------------------------------
     GENERAL
     ---------------------------------------------------------- */

  MESSAGE: "message",

  SOCKET_ERROR: "socket_error",
} as const;

export type QuizGameEventName =
  (typeof QUIZ_GAME_EVENTS)[keyof typeof QUIZ_GAME_EVENTS];

/* ============================================================
   COMMAND PAYLOAD MAP
   ============================================================ */

export interface QuizGameCommandPayloads {
  [QUIZ_GAME_EVENTS.ACTIVATE_ROOM]:
    ActivateRoomPayload;

  [QUIZ_GAME_EVENTS.JOIN_ROOM]:
    JoinRoomPayload;

  [QUIZ_GAME_EVENTS.START_ROUND]:
    StartRoundPayload;

  [QUIZ_GAME_EVENTS.START_QUESTION]:
    StartQuestionPayload;

  [QUIZ_GAME_EVENTS.LOCK_QUESTION]:
    LockQuestionPayload;

  [QUIZ_GAME_EVENTS.NEXT_QUESTION]:
    NextQuestionPayload;

  [QUIZ_GAME_EVENTS.SUBMIT_ANSWER]:
    SubmitAnswerPayload;
}

/* ============================================================
   ROOM EVENT PAYLOADS
   ============================================================ */

export interface RoomActivationAckPayload {
  roomId: string;

  quizId: string;

  role?: string;

  status?: string;

  message?: string;
}

export interface RoomActivatedPayload {
  roomId: string;

  quizId: string;

  role?: string;

  status?: string;

  message?: string;
}

export interface JoinedRoomPayload {
  roomId: string;

  quizId: string;

  role?: string;

  participantId?: string;

  message?: string;
}

/* ============================================================
   ROUND EVENT PAYLOADS
   ============================================================ */

export interface RoundStartedPayload {
  roomId?: string;

  quizId?: string;

  roundNumber: number;

  totalQuestions?: number;

  startedAt?: number;
}

export interface RoundCompletedPayload {
  roomId?: string;

  quizId?: string;

  roundNumber?: number;

  completedAt?: number;
}

/* ============================================================
   QUESTION EVENT PAYLOADS
   ============================================================ */

export interface QuestionStartedPayload {
  roomId?: string;

  quizId?: string;

  roundNumber: number;

  questionNumber: number;

  questionId?: string;

  question?: unknown;

  timeLimit: number;

  startedAt?: number;

  endsAt?: number;
}

export interface QuestionLockedPayload {
  roomId?: string;

  quizId?: string;

  roundNumber?: number;

  questionNumber?: number;

  lockedAt?: number;
}

export interface QuestionCompletedPayload {
  roomId?: string;

  quizId?: string;

  roundNumber?: number;

  questionNumber?: number;

  completedAt?: number;
}

/* ============================================================
   ANSWER EVENT PAYLOADS
   ============================================================ */

export interface ParticipantSelectedAnswerPayload {
  participantId?: string;

  userId?: string;

  questionId?: string;

  questionNumber?: number;

  selectedAnswer?: string;

  answer?: string;

  submittedAt?: number;
}

export interface AnswerResultPayload {
  participantId?: string;

  userId?: string;

  questionId?: string;

  questionNumber?: number;

  answer?: string;

  correct?: boolean;

  points?: number;

  submittedAt?: number;
}

export interface FirstCorrectAnswerPayload {
  participantId?: string;

  userId?: string;

  participantName?: string;

  questionId?: string;

  questionNumber?: number;

  answer?: string;

  points?: number;

  submittedAt?: number;
}

/* ============================================================
   LEADERBOARD EVENT PAYLOADS
   ============================================================ */

export interface LeaderboardUpdatedPayload {
  leaderboard?: unknown[];

  entries?: unknown[];

  updatedAt?: number;
}

/* ============================================================
   ELIMINATION / TIEBREAKER PAYLOADS
   ============================================================ */

export interface ParticipantsEliminatedPayload {
  participantIds: string[];

  roundNumber?: number;

  reason?: string;
}

export interface TiebreakerQuestionStartedPayload {
  roomId?: string;

  quizId?: string;

  roundNumber?: number;

  questionNumber?: number;

  questionId?: string;

  question?: unknown;

  timeLimit?: number;

  startedAt?: number;

  endsAt?: number;
}

/* ============================================================
   GAME EVENT PAYLOADS
   ============================================================ */

export interface GameCompletedPayload {
  roomId?: string;

  quizId?: string;

  completedAt?: number;

  winnerId?: string;

  leaderboard?: unknown[];
}

/* ============================================================
   SERVER EVENT PAYLOAD MAP
   ============================================================ */

export interface QuizGameServerEventPayloads {
  [QUIZ_GAME_EVENTS.ROOM_ACTIVATION_ACK]:
    QuizSocketAck<RoomActivationAckPayload>;

  [QUIZ_GAME_EVENTS.ROOM_ACTIVATED]:
    RoomActivatedPayload;

  [QUIZ_GAME_EVENTS.JOINED_ROOM_ACK]:
    QuizSocketAck<JoinedRoomPayload>;

  [QUIZ_GAME_EVENTS.ROOM_STATE]:
    unknown;

  [QUIZ_GAME_EVENTS.PARTICIPANT_JOINED_ROOM]:
    unknown;

  [QUIZ_GAME_EVENTS.PARTICIPANT_LEFT_ROOM]:
    unknown;

  [QUIZ_GAME_EVENTS.ROUND_STARTED]:
    RoundStartedPayload;

  [QUIZ_GAME_EVENTS.ROUND_COMPLETED]:
    RoundCompletedPayload;

  [QUIZ_GAME_EVENTS.QUESTION_STARTED]:
    QuestionStartedPayload;

  [QUIZ_GAME_EVENTS.QUESTION_LOCKED]:
    QuestionLockedPayload;

  [QUIZ_GAME_EVENTS.QUESTION_COMPLETED]:
    QuestionCompletedPayload;

  [QUIZ_GAME_EVENTS.PARTICIPANT_SELECTED_ANSWER]:
    ParticipantSelectedAnswerPayload;

  [QUIZ_GAME_EVENTS.ANSWER_RESULT]:
    AnswerResultPayload;

  [QUIZ_GAME_EVENTS.FIRST_CORRECT_ANSWER]:
    FirstCorrectAnswerPayload;

  [QUIZ_GAME_EVENTS.LEADERBOARD_UPDATED]:
    LeaderboardUpdatedPayload;

  [QUIZ_GAME_EVENTS.PARTICIPANTS_ELIMINATED]:
    ParticipantsEliminatedPayload;

  [QUIZ_GAME_EVENTS.TIEBREAKER_QUESTION_STARTED]:
    TiebreakerQuestionStartedPayload;

  [QUIZ_GAME_EVENTS.GAME_COMPLETED]:
    GameCompletedPayload;

  [QUIZ_GAME_EVENTS.MESSAGE]:
    unknown;

  [QUIZ_GAME_EVENTS.SOCKET_ERROR]:
    QuizSocketError;
}

/* ============================================================
   EVENT GROUPS
   ============================================================ */

export const QUIZ_ROOM_EVENTS = [
  QUIZ_GAME_EVENTS.ACTIVATE_ROOM,
  QUIZ_GAME_EVENTS.ROOM_ACTIVATION_ACK,
  QUIZ_GAME_EVENTS.ROOM_ACTIVATED,
  QUIZ_GAME_EVENTS.JOIN_ROOM,
  QUIZ_GAME_EVENTS.JOINED_ROOM_ACK,
  QUIZ_GAME_EVENTS.ROOM_STATE,
  QUIZ_GAME_EVENTS.PARTICIPANT_JOINED_ROOM,
  QUIZ_GAME_EVENTS.PARTICIPANT_LEFT_ROOM,
] as const;

export const QUIZ_ROUND_EVENTS = [
  QUIZ_GAME_EVENTS.START_ROUND,
  QUIZ_GAME_EVENTS.ROUND_STARTED,
  QUIZ_GAME_EVENTS.ROUND_COMPLETED,
] as const;

export const QUIZ_QUESTION_EVENTS = [
  QUIZ_GAME_EVENTS.START_QUESTION,
  QUIZ_GAME_EVENTS.QUESTION_STARTED,
  QUIZ_GAME_EVENTS.LOCK_QUESTION,
  QUIZ_GAME_EVENTS.QUESTION_LOCKED,
  QUIZ_GAME_EVENTS.NEXT_QUESTION,
  QUIZ_GAME_EVENTS.QUESTION_COMPLETED,
] as const;

export const QUIZ_ANSWER_EVENTS = [
  QUIZ_GAME_EVENTS.SUBMIT_ANSWER,
  QUIZ_GAME_EVENTS.PARTICIPANT_SELECTED_ANSWER,
  QUIZ_GAME_EVENTS.ANSWER_RESULT,
  QUIZ_GAME_EVENTS.FIRST_CORRECT_ANSWER,
] as const;

export const QUIZ_LEADERBOARD_EVENTS = [
  QUIZ_GAME_EVENTS.SYNC_LEADERBOARD,
  QUIZ_GAME_EVENTS.LEADERBOARD_UPDATED,
] as const;

export const QUIZ_TIEBREAKER_EVENTS = [
  QUIZ_GAME_EVENTS.REQUEST_TIEBREAKER_QUESTION,
  QUIZ_GAME_EVENTS.TIEBREAKER_QUESTION_STARTED,
  QUIZ_GAME_EVENTS.RESOLVE_TIEBREAKER_ELIMINATIONS,
  QUIZ_GAME_EVENTS.PARTICIPANTS_ELIMINATED,
] as const;