// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\quiz-board\quiz-leaderboard.ts

/**
 * Shared Quiz Board leaderboard types.
 *
 * IMPORTANT:
 * - These types contain leaderboard/display information only.
 * - They must never contain answer keys or private question data.
 * - Backend remains authoritative for rank, score, elimination,
 *   and leaderboard ordering.
 */

/**
 * A participant's connection state as known by the server.
 */
export type QuizParticipantConnectionStatus =
  | "ONLINE"
  | "OFFLINE"
  | "DISCONNECTED"
  | "UNKNOWN";

/**
 * Participant competition status.
 */
export type QuizParticipantStatus =
  | "ACTIVE"
  | "ELIMINATED"
  | "COMPLETED"
  | "WITHDRAWN"
  | "DISCONNECTED";

/**
 * Basic leaderboard participant identity.
 */
export interface QuizLeaderboardParticipant {
  id: string;

  userId?: string | null;

  participantId?: string | null;

  name: string;

  username?: string | null;

  avatarUrl?: string | null;
}

/**
 * Individual leaderboard entry.
 *
 * This is the canonical shared representation used by:
 *
 * - HOST
 * - CONTESTANT
 * - SPECTATOR
 *
 * Backend should calculate and publish authoritative values.
 */
export interface QuizLeaderboardEntry
  extends QuizLeaderboardParticipant {
  /**
   * Current authoritative score.
   */
  score: number;

  /**
   * Current leaderboard rank.
   */
  rank?: number | null;

  /**
   * Previous leaderboard rank.
   */
  previousRank?: number | null;

  /**
   * Change in leaderboard position.
   *
   * Positive = moved up.
   * Negative = moved down.
   */
  rankChange?: number | null;

  /**
   * Number of correctly answered questions.
   */
  correctAnswers?: number;

  /**
   * Number of incorrectly answered questions.
   */
  incorrectAnswers?: number;

  /**
   * Number of questions answered.
   */
  answeredQuestions?: number;

  /**
   * Number of questions not answered.
   */
  unansweredQuestions?: number;

  /**
   * Total questions available to the participant.
   */
  totalQuestions?: number;

  /**
   * Accuracy percentage.
   */
  accuracy?: number | null;

  /**
   * Points earned during the current round.
   */
  roundScore?: number;

  /**
   * Total points earned across rounds.
   */
  totalRoundScore?: number;

  /**
   * Additional points earned in the current update.
   */
  pointsEarned?: number;

  /**
   * Current competition round.
   */
  roundNumber?: number | null;

  /**
   * Server-reported connection state.
   */
  connectionStatus?: QuizParticipantConnectionStatus;

  /**
   * Convenience connection flag.
   */
  isConnected?: boolean;

  /**
   * Whether this entry belongs to the current user.
   */
  isCurrentUser?: boolean;

  /**
   * Whether this participant is currently first place.
   */
  isCurrentLeader?: boolean;

  /**
   * Compatibility alias for current leader state.
   */
  isLeader?: boolean;

  /**
   * Whether this participant has been eliminated.
   */
  isEliminated?: boolean;

  /**
   * Whether this participant is still actively competing.
   */
  isActive?: boolean;

  /**
   * Current competition status.
   */
  status?: QuizParticipantStatus;

  /**
   * When the participant joined the room.
   */
  joinedAt?: string | null;

  /**
   * When the participant was eliminated.
   */
  eliminatedAt?: string | null;

  /**
   * Time of the participant's latest answer.
   */
  lastAnswerAt?: string | null;
}

/**
 * A complete leaderboard snapshot.
 *
 * This represents the authoritative leaderboard state at a
 * particular point in the quiz.
 */
export interface QuizLeaderboardSnapshot {
  /**
   * Quiz identifier.
   */
  quizId: string;

  /**
   * Live room identifier.
   */
  roomId: string;

  /**
   * Current round.
   */
  roundNumber: number;

  /**
   * Total rounds in the quiz.
   */
  totalRounds: number;

  /**
   * Current question number.
   */
  currentQuestionNumber?: number | null;

  /**
   * Total questions in the current round.
   */
  totalQuestions?: number | null;

  /**
   * Ordered leaderboard entries.
   *
   * The backend should provide these in authoritative rank order.
   */
  entries: QuizLeaderboardEntry[];

  /**
   * Server timestamp for this snapshot.
   */
  updatedAt?: string | null;
}

/**
 * Reason for a leaderboard update.
 */
export type QuizLeaderboardUpdateReason =
  | "ANSWER_SUBMITTED"
  | "QUESTION_LOCKED"
  | "QUESTION_COMPLETED"
  | "ROUND_COMPLETED"
  | "ELIMINATION"
  | "TIEBREAKER"
  | "MANUAL_SYNC"
  | "QUIZ_COMPLETED";

/**
 * Live leaderboard update.
 */
export interface QuizLeaderboardUpdate
  extends QuizLeaderboardSnapshot {
  /**
   * Why the leaderboard changed.
   */
  reason?: QuizLeaderboardUpdateReason;
}

/**
 * Lightweight leaderboard state for client-side game state.
 */
export interface QuizLeaderboardState {
  /**
   * Current leaderboard entries.
   */
  entries: QuizLeaderboardEntry[];

  /**
   * ID of the current first-place participant.
   */
  currentLeaderId?: string | null;

  /**
   * Last server synchronization timestamp.
   */
  lastUpdatedAt?: string | null;

  /**
   * Whether leaderboard data is currently loading.
   */
  loading?: boolean;

  /**
   * Last leaderboard error.
   */
  error?: string | null;
}

/**
 * Score summary for one participant.
 */
export interface QuizScoreSummary {
  /**
   * Current total score.
   */
  score: number;

  /**
   * Current rank.
   */
  rank?: number | null;

  /**
   * Number of correct answers.
   */
  correctAnswers?: number;

  /**
   * Number of answered questions.
   */
  answeredQuestions?: number;

  /**
   * Number of incorrect answers.
   */
  incorrectAnswers?: number;

  /**
   * Number of unanswered questions.
   */
  unansweredQuestions?: number;

  /**
   * Total questions.
   */
  totalQuestions?: number;

  /**
   * Accuracy percentage.
   */
  accuracy?: number | null;

  /**
   * Whether the participant has been eliminated.
   */
  isEliminated?: boolean;
}

/**
 * Payload for requesting a leaderboard synchronization.
 */
export interface SyncQuizLeaderboardPayload {
  quizId: string;

  roomId: string;

  roundNumber?: number;

  questionNumber?: number;
}

/**
 * Payload emitted when the leaderboard changes.
 */
export interface QuizLeaderboardUpdatedEvent {
  quizId: string;

  roomId: string;

  roundNumber: number;

  questionNumber?: number | null;

  entries: QuizLeaderboardEntry[];

  reason?: QuizLeaderboardUpdateReason;

  updatedAt?: string | null;
}

/**
 * Returns the participant identifier used for leaderboard
 * comparisons.
 */
export function getQuizLeaderboardParticipantId(
  entry: QuizLeaderboardEntry,
): string {
  return (
    entry.participantId ||
    entry.userId ||
    entry.id
  );
}

/**
 * Returns the participant's display name.
 */
export function getQuizLeaderboardParticipantName(
  entry: QuizLeaderboardEntry,
): string {
  return (
    entry.name ||
    entry.username ||
    "Participant"
  );
}

/**
 * Returns whether the participant is currently connected.
 */
export function isQuizLeaderboardParticipantOnline(
  entry: QuizLeaderboardEntry,
): boolean {
  if (typeof entry.isConnected === "boolean") {
    return entry.isConnected;
  }

  return entry.connectionStatus === "ONLINE";
}

/**
 * Returns whether the participant has been eliminated.
 */
export function isQuizLeaderboardParticipantEliminated(
  entry: QuizLeaderboardEntry,
): boolean {
  if (typeof entry.isEliminated === "boolean") {
    return entry.isEliminated;
  }

  return entry.status === "ELIMINATED";
}

/**
 * Returns whether the participant is still competing.
 */
export function isQuizLeaderboardParticipantActive(
  entry: QuizLeaderboardEntry,
): boolean {
  if (typeof entry.isActive === "boolean") {
    return entry.isActive;
  }

  return (
    entry.status === "ACTIVE" ||
    entry.status === undefined
  );
}

/**
 * Calculates accuracy from available statistics.
 *
 * Returns null when there are not enough values to calculate
 * a meaningful percentage.
 */
export function calculateQuizLeaderboardAccuracy(
  entry: QuizLeaderboardEntry,
): number | null {
  if (
    typeof entry.accuracy === "number" &&
    Number.isFinite(entry.accuracy)
  ) {
    return entry.accuracy;
  }

  const answered =
    entry.answeredQuestions ?? 0;

  const correct =
    entry.correctAnswers ?? 0;

  if (answered <= 0) {
    return null;
  }

  return (correct / answered) * 100;
}