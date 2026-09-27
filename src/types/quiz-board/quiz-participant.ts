




// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\quiz-board\quiz-participant.ts

/**
 * Shared Quiz Board participant types.
 *
 * These types describe a participant inside a live quiz room.
 *
 * IMPORTANT:
 * - A participant can be a HOST, CONTESTANT, or SPECTATOR.
 * - Application roles such as ADMIN/STUDENT should remain separate
 *   from the quiz-game role.
 * - Backend remains authoritative for permissions, scores,
 *   elimination, connection state, and competition status.
 * - Never place answer keys or private question data in participant
 *   objects sent to contestants or spectators.
 */

/**
 * Role of a participant inside a live Quiz Board room.
 */
export type QuizParticipantRole =
  | "HOST"
  | "CONTESTANT"
  | "SPECTATOR";

/**
 * Connection state reported by the quiz server.
 */
export type QuizParticipantConnectionStatus =
  | "ONLINE"
  | "OFFLINE"
  | "DISCONNECTED"
  | "CONNECTING"
  | "UNKNOWN";

/**
 * Competition state of a participant.
 */
export type QuizParticipantStatus =
  | "WAITING"
  | "ACTIVE"
  | "ELIMINATED"
  | "COMPLETED"
  | "WITHDRAWN"
  | "DISCONNECTED";

/**
 * Basic participant identity.
 *
 * This is safe to use as the common identity structure for
 * participant lists, leaderboards, host panels, and live feeds.
 */
export interface QuizParticipantIdentity {
  /**
   * Unique participant record ID.
   */
  id: string;

  /**
   * Authenticated application user ID.
   */
  userId?: string | null;

  /**
   * Quiz-specific participant ID.
   */
  participantId?: string | null;

  /**
   * Display name.
   */
  name: string;

  /**
   * Optional username.
   */
  username?: string | null;

  /**
   * Optional email.
   *
   * Do not expose this to contestants/spectators unless the
   * backend explicitly allows it.
   */
  email?: string | null;

  /**
   * Optional avatar URL.
   */
  avatarUrl?: string | null;
}

/**
 * Participant statistics during the competition.
 */
export interface QuizParticipantStats {
  /**
   * Current total score.
   */
  score: number;

  /**
   * Score earned in the current round.
   */
  roundScore?: number;

  /**
   * Total score earned across completed rounds.
   */
  totalRoundScore?: number;

  /**
   * Number of questions answered.
   */
  answeredQuestions?: number;

  /**
   * Number of correctly answered questions.
   */
  correctAnswers?: number;

  /**
   * Number of incorrectly answered questions.
   */
  incorrectAnswers?: number;

  /**
   * Number of unanswered questions.
   */
  unansweredQuestions?: number;

  /**
   * Total questions encountered by the participant.
   */
  totalQuestions?: number;

  /**
   * Percentage accuracy.
   */
  accuracy?: number | null;

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
   * Example:
   *  +2 = moved up two positions
   *  -1 = moved down one position
   */
  rankChange?: number | null;
}

/**
 * Participant timing/activity information.
 */
export interface QuizParticipantActivity {
  /**
   * When the participant joined the room.
   */
  joinedAt?: string | null;

  /**
   * When the participant last became connected.
   */
  connectedAt?: string | null;

  /**
   * When the participant disconnected.
   */
  disconnectedAt?: string | null;

  /**
   * When the participant submitted their most recent answer.
   */
  lastAnswerAt?: string | null;

  /**
   * When the participant was eliminated.
   */
  eliminatedAt?: string | null;

  /**
   * Current round associated with this participant state.
   */
  roundNumber?: number | null;

  /**
   * Question number associated with the participant's latest activity.
   */
  questionNumber?: number | null;
}

/**
 * Complete participant representation used by the live game.
 *
 * This can be used by:
 *
 * - HOST
 * - CONTESTANT
 * - SPECTATOR
 *
 * Backend should determine which fields are actually exposed
 * to each role.
 */
export interface QuizParticipant
  extends QuizParticipantIdentity,
    QuizParticipantStats,
    QuizParticipantActivity {
  /**
   * Role inside the quiz room.
   */
  role: QuizParticipantRole;

  /**
   * Server-reported connection state.
   */
  connectionStatus?: QuizParticipantConnectionStatus;

  /**
   * Convenience connection flag.
   */
  connected?: boolean;

  /**
   * Current competition status.
   */
  status?: QuizParticipantStatus;

  /**
   * Whether this participant is currently active in the competition.
   */
  isActive?: boolean;

  /**
   * Whether this participant has been eliminated.
   */
  isEliminated?: boolean;

  /**
   * Whether this participant represents the current logged-in user.
   */
  isCurrentUser?: boolean;

  /**
   * Whether this participant is currently the leaderboard leader.
   */
  isLeader?: boolean;

  /**
   * Whether this participant is the current first-place leader.
   *
   * Kept separately from `isLeader` for compatibility with
   * different backend/UI naming conventions.
   */
  isCurrentLeader?: boolean;
}

/**
 * Participant information specifically for the host.
 *
 * Host views may contain additional operational information that
 * should not automatically be exposed to contestants/spectators.
 */
export interface HostQuizParticipant extends QuizParticipant {
  /**
   * Whether the participant can currently continue competing.
   */
  canContinue?: boolean;

  /**
   * Whether the participant has submitted an answer
   * for the current question.
   */
  hasAnsweredCurrentQuestion?: boolean;

  /**
   * Whether the participant answered the current question correctly.
   *
   * This should only be populated where the host is authorized
   * to receive the information.
   */
  answeredCurrentQuestionCorrectly?: boolean | null;
}

/**
 * Public participant representation.
 *
 * Intended for contestant/spectator-facing room state.
 *
 * Avoid exposing private operational information through this type.
 */
export interface PublicQuizParticipant
  extends QuizParticipantIdentity {
  role: QuizParticipantRole;

  connectionStatus?: QuizParticipantConnectionStatus;

  connected?: boolean;

  status?: QuizParticipantStatus;

  score?: number;

  rank?: number | null;

  answeredQuestions?: number;

  correctAnswers?: number;

  isActive?: boolean;

  isEliminated?: boolean;

  isCurrentUser?: boolean;
}

/**
 * Participant list state for a quiz room.
 */
export interface QuizParticipantState {
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
   * Total rounds in the competition.
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
   * Current participants.
   */
  participants: QuizParticipant[];

  /**
   * Number of participants currently connected.
   */
  onlineCount?: number;

  /**
   * Number of participants still competing.
   */
  activeCount?: number;

  /**
   * Number of eliminated participants.
   */
  eliminatedCount?: number;

  /**
   * Server timestamp for this snapshot.
   */
  updatedAt?: string | null;
}

/**
 * Payload emitted when a participant joins the room.
 */
export interface QuizParticipantJoinedEvent {
  quizId: string;

  roomId: string;

  participant: QuizParticipant;

  joinedAt?: string | null;
}

/**
 * Payload emitted when a participant leaves or disconnects.
 */
export interface QuizParticipantLeftEvent {
  quizId: string;

  roomId: string;

  participantId: string;

  userId?: string | null;

  reason?:
    | "DISCONNECTED"
    | "LEFT_ROOM"
    | "REMOVED"
    | "WITHDRAWN"
    | "ELIMINATED"
    | "UNKNOWN";

  disconnectedAt?: string | null;
}

/**
 * Payload emitted when participant connection state changes.
 */
export interface QuizParticipantConnectionEvent {
  quizId: string;

  roomId: string;

  participantId: string;

  userId?: string | null;

  connectionStatus: QuizParticipantConnectionStatus;

  connected: boolean;

  updatedAt?: string | null;
}

/**
 * Payload emitted when participant competition status changes.
 */
export interface QuizParticipantStatusEvent {
  quizId: string;

  roomId: string;

  participantId: string;

  userId?: string | null;

  status: QuizParticipantStatus;

  isActive?: boolean;

  isEliminated?: boolean;

  eliminatedAt?: string | null;

  roundNumber?: number | null;

  updatedAt?: string | null;
}

/**
 * Payload emitted when a participant's score changes.
 */
export interface QuizParticipantScoreUpdate {
  quizId: string;

  roomId: string;

  participantId: string;

  userId?: string | null;

  score: number;

  roundScore?: number;

  correctAnswers?: number;

  incorrectAnswers?: number;

  answeredQuestions?: number;

  unansweredQuestions?: number;

  rank?: number | null;

  previousRank?: number | null;

  rankChange?: number | null;

  roundNumber?: number | null;

  questionNumber?: number | null;

  updatedAt?: string | null;
}

/**
 * Payload emitted when participants are eliminated.
 */
export interface QuizParticipantsEliminatedEvent {
  quizId: string;

  roomId: string;

  roundNumber: number;

  participantIds: string[];

  participants?: QuizParticipant[];

  remainingParticipantCount?: number;

  eliminatedParticipantCount?: number;

  reason?:
    | "ROUND_ELIMINATION"
    | "TIEBREAKER"
    | "MANUAL"
    | "QUIZ_RULE";

  updatedAt?: string | null;
}

/**
 * Payload used when the backend sends the complete participant
 * snapshot to a newly connected client or after a reconnect.
 */
export interface QuizParticipantsSnapshotEvent {
  quizId: string;

  roomId: string;

  roundNumber: number;

  totalRounds: number;

  currentQuestionNumber?: number | null;

  totalQuestions?: number | null;

  participants: QuizParticipant[];

  updatedAt?: string | null;
}

/**
 * Utility type for creating a participant before the server
 * assigns runtime fields such as score, rank, or connection state.
 */
export type QuizParticipantInput = Pick<
  QuizParticipantIdentity,
  "id" | "name"
> &
  Partial<
    Pick<
      QuizParticipantIdentity,
      "userId" | "participantId" | "username" | "email" | "avatarUrl"
    >
  > & {
    role: QuizParticipantRole;
  };

/**
 * Utility type for lightweight participant references.
 *
 * Useful for events where the full participant object is unnecessary.
 */
export interface QuizParticipantReference {
  id: string;

  userId?: string | null;

  participantId?: string | null;

  name?: string | null;
}