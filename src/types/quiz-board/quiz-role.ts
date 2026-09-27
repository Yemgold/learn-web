




// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\quiz-board\quiz-role.ts

/**
 * Quiz Board roles.
 *
 * IMPORTANT:
 * These are roles inside a live quiz game.
 *
 * They are NOT the same as application/authentication roles.
 *
 * Application role:
 *   ADMIN / STUDENT
 *
 * Quiz role:
 *   HOST / CONTESTANT / SPECTATOR
 *
 * Backend must remain authoritative for permissions.
 */

/**
 * Role of a user inside a live Quiz Board room.
 */
export type QuizGameRole =
  | "HOST"
  | "CONTESTANT"
  | "SPECTATOR";

/**
 * Application-level role.
 *
 * This should not be used as a substitute for QuizGameRole.
 */
export type QuizApplicationRole =
  | "ADMIN"
  | "STUDENT";

/**
 * Permissions available to a quiz role.
 *
 * These are primarily useful for UI decisions.
 * The backend must enforce the actual permissions.
 */
export interface QuizRolePermissions {
  /**
   * Can control room/game state.
   */
  canControlQuiz: boolean;

  /**
   * Can start a round.
   */
  canStartRound: boolean;

  /**
   * Can start a question.
   */
  canStartQuestion: boolean;

  /**
   * Can lock a question.
   */
  canLockQuestion: boolean;

  /**
   * Can advance to the next question.
   */
  canNextQuestion: boolean;

  /**
   * Can complete a round.
   */
  canCompleteRound: boolean;

  /**
   * Can trigger elimination.
   */
  canEliminateParticipants: boolean;

  /**
   * Can request a tiebreaker.
   */
  canRequestTiebreaker: boolean;

  /**
   * Can answer questions.
   */
  canAnswer: boolean;

  /**
   * Can compete for score/rank.
   */
  canCompete: boolean;

  /**
   * Can see the leaderboard.
   */
  canViewLeaderboard: boolean;

  /**
   * Can see participant information.
   */
  canViewParticipants: boolean;

  /**
   * Can see host-only question information,
   * including correct answers.
   */
  canViewAnswerKey: boolean;
}

/**
 * Permissions for each quiz role.
 *
 * These are UI defaults only.
 * Never use these as the backend authorization mechanism.
 */
export const QUIZ_ROLE_PERMISSIONS: Record<
  QuizGameRole,
  QuizRolePermissions
> = {
  HOST: {
    canControlQuiz: true,
    canStartRound: true,
    canStartQuestion: true,
    canLockQuestion: true,
    canNextQuestion: true,
    canCompleteRound: true,
    canEliminateParticipants: true,
    canRequestTiebreaker: true,
    canAnswer: false,
    canCompete: false,
    canViewLeaderboard: true,
    canViewParticipants: true,
    canViewAnswerKey: true,
  },

  CONTESTANT: {
    canControlQuiz: false,
    canStartRound: false,
    canStartQuestion: false,
    canLockQuestion: false,
    canNextQuestion: false,
    canCompleteRound: false,
    canEliminateParticipants: false,
    canRequestTiebreaker: false,
    canAnswer: true,
    canCompete: true,
    canViewLeaderboard: true,
    canViewParticipants: true,
    canViewAnswerKey: false,
  },

  SPECTATOR: {
    canControlQuiz: false,
    canStartRound: false,
    canStartQuestion: false,
    canLockQuestion: false,
    canNextQuestion: false,
    canCompleteRound: false,
    canEliminateParticipants: false,
    canRequestTiebreaker: false,
    canAnswer: false,
    canCompete: false,
    canViewLeaderboard: true,
    canViewParticipants: true,
    canViewAnswerKey: false,
  },
};

/**
 * Returns the default UI permission set for a quiz role.
 *
 * Again, this is not an authorization check.
 */
export function getQuizRolePermissions(
  role: QuizGameRole,
): QuizRolePermissions {
  return QUIZ_ROLE_PERMISSIONS[role];
}

/**
 * Checks whether a role is allowed to control the quiz.
 */
export function canControlQuiz(
  role: QuizGameRole,
): boolean {
  return QUIZ_ROLE_PERMISSIONS[role].canControlQuiz;
}

/**
 * Checks whether a role can answer.
 */
export function canAnswerQuiz(
  role: QuizGameRole,
): boolean {
  return QUIZ_ROLE_PERMISSIONS[role].canAnswer;
}

/**
 * Checks whether a role is a competing participant.
 */
export function canCompeteInQuiz(
  role: QuizGameRole,
): boolean {
  return QUIZ_ROLE_PERMISSIONS[role].canCompete;
}

/**
 * Checks whether a role is the host.
 */
export function isQuizHost(
  role: QuizGameRole,
): role is "HOST" {
  return role === "HOST";
}

/**
 * Checks whether a role is a contestant.
 */
export function isQuizContestant(
  role: QuizGameRole,
): role is "CONTESTANT" {
  return role === "CONTESTANT";
}

/**
 * Checks whether a role is a spectator.
 */
export function isQuizSpectator(
  role: QuizGameRole,
): role is "SPECTATOR" {
  return role === "SPECTATOR";
}

/**
 * Returns whether the role participates in scoring.
 */
export function isScoringQuizRole(
  role: QuizGameRole,
): boolean {
  return role === "CONTESTANT";
}

/**
 * Returns whether the role is a non-answering observer.
 */
export function isObserverQuizRole(
  role: QuizGameRole,
): boolean {
  return role === "HOST" || role === "SPECTATOR";
}