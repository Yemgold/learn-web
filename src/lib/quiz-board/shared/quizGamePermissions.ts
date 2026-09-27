




// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\shared\quizGamePermissions.ts

import type {
  QuizGameRole,
  QuizGameState,
} from "./quizGameTypes";

/* ============================================================
   ROLE CHECKS
   ============================================================ */

export function isHost(
  role: QuizGameRole | null | undefined,
): boolean {
  return role === "HOST";
}

export function isContestant(
  role: QuizGameRole | null | undefined,
): boolean {
  return role === "CONTESTANT";
}

export function isSpectator(
  role: QuizGameRole | null | undefined,
): boolean {
  return role === "SPECTATOR";
}

/* ============================================================
   ROOM PERMISSIONS
   ============================================================ */

export function canJoinRoom(
  role: QuizGameRole | null | undefined,
): boolean {
  return (
    role === "HOST" ||
    role === "CONTESTANT" ||
    role === "SPECTATOR"
  );
}

export function canActivateRoom(
  role: QuizGameRole | null | undefined,
): boolean {
  return role === "HOST";
}

/* ============================================================
   HOST PERMISSIONS
   ============================================================ */

export function canHostControlGame(
  state: QuizGameState,
): boolean {
  return (
    state.role === "HOST" &&
    state.connectionStatus === "CONNECTED" &&
    state.room.joined &&
    state.room.activated
  );
}

export function canStartRound(
  state: QuizGameState,
): boolean {
  return (
    canHostControlGame(state) &&
    !state.round.started &&
    !state.round.completed
  );
}

export function canStartQuestion(
  state: QuizGameState,
): boolean {
  return (
    canHostControlGame(state) &&
    state.selectedQuestionNumber !== null &&
    state.currentQuestion.status === "WAITING" &&
    !state.currentQuestion.question &&
    state.gameStatus !== "QUESTION_ACTIVE"
  );
}

export function canLockQuestion(
  state: QuizGameState,
): boolean {
  return (
    canHostControlGame(state) &&
    state.currentQuestion.status === "ACTIVE"
  );
}

export function canNextQuestion(
  state: QuizGameState,
): boolean {
  return (
    canHostControlGame(state) &&
    state.currentQuestion.status === "LOCKED"
  );
}

export function canSelectQuestion(
  state: QuizGameState,
): boolean {
  return (
    state.role === "HOST" &&
    state.connectionStatus === "CONNECTED" &&
    state.room.joined &&
    state.room.activated &&
    !state.currentQuestion.question
  );
}

/* ============================================================
   CONTESTANT PERMISSIONS
   ============================================================ */

export function canContestantAnswer(
  state: QuizGameState,
): boolean {
  return (
    state.role === "CONTESTANT" &&
    state.connectionStatus === "CONNECTED" &&
    state.room.joined &&
    state.room.activated &&
    state.currentQuestion.status === "ACTIVE" &&
    !state.hasAnsweredCurrentQuestion
  );
}

export function canSubmitAnswer(
  state: QuizGameState,
): boolean {
  return canContestantAnswer(state);
}

/* ============================================================
   SPECTATOR PERMISSIONS
   ============================================================ */

export function canSpectatorWatch(
  state: QuizGameState,
): boolean {
  return (
    state.role === "SPECTATOR" &&
    state.connectionStatus === "CONNECTED" &&
    state.room.joined
  );
}

export function canSpectatorAnswer(
  _state: QuizGameState,
): boolean {
  return false;
}

export function canSpectatorControlGame(
  _state: QuizGameState,
): boolean {
  return false;
}

/* ============================================================
   LEADERBOARD
   ============================================================ */

export function canViewLeaderboard(
  role: QuizGameRole | null | undefined,
): boolean {
  return (
    role === "HOST" ||
    role === "CONTESTANT" ||
    role === "SPECTATOR"
  );
}

/* ============================================================
   PARTICIPANTS
   ============================================================ */

export function canViewParticipants(
  role: QuizGameRole | null | undefined,
): boolean {
  return (
    role === "HOST" ||
    role === "CONTESTANT" ||
    role === "SPECTATOR"
  );
}

/* ============================================================
   GAME CONTROL SUMMARY
   ============================================================ */

export interface QuizGamePermissionSet {
  canJoinRoom: boolean;

  canActivateRoom: boolean;

  canStartRound: boolean;

  canSelectQuestion: boolean;

  canStartQuestion: boolean;

  canLockQuestion: boolean;

  canNextQuestion: boolean;

  canAnswer: boolean;

  canViewLeaderboard: boolean;

  canViewParticipants: boolean;

  canControlGame: boolean;
}

export function getQuizGamePermissions(
  state: QuizGameState,
): QuizGamePermissionSet {
  const hostControl = canHostControlGame(state);

  return {
    canJoinRoom: canJoinRoom(state.role),

    canActivateRoom: canActivateRoom(state.role),

    canStartRound: canStartRound(state),

    canSelectQuestion: canSelectQuestion(state),

    canStartQuestion: canStartQuestion(state),

    canLockQuestion: canLockQuestion(state),

    canNextQuestion: canNextQuestion(state),

    canAnswer: canContestantAnswer(state),

    canViewLeaderboard: canViewLeaderboard(state.role),

    canViewParticipants: canViewParticipants(state.role),

    canControlGame: hostControl,
  };
}