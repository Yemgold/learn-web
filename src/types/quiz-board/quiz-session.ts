




// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\quiz-board\quiz-session.ts

import type { QuizGameRole } from "./quiz-role";

/**
 * Live Quiz Board session types.
 *
 * A session represents the user's current connection to a
 * particular quiz room.
 *
 * IMPORTANT:
 * Session state is not the same as quiz configuration.
 *
 * Quiz configuration belongs in quiz.ts.
 * Participant information belongs in quiz-participant.ts.
 * Question information belongs in quiz-question.ts.
 */

/**
 * Connection state of the current client.
 */
export type QuizSessionConnectionStatus =
  | "CONNECTING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "ERROR";

/**
 * Room activation state.
 */
export type QuizRoomActivationStatus =
  | "NOT_ACTIVATED"
  | "ACTIVATING"
  | "ACTIVATED"
  | "FAILED";

/**
 * Live room state.
 */
export type QuizRoomState =
  | "WAITING"
  | "READY"
  | "LIVE"
  | "LOCKED"
  | "COMPLETED"
  | "CANCELLED";

/**
 * Current round state.
 */
export type QuizRoundState =
  | "WAITING"
  | "READY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ELIMINATION"
  | "FINAL"
  | "CANCELLED";

/**
 * Current question state.
 */
export type QuizSessionQuestionState =
  | "WAITING"
  | "READY"
  | "LIVE"
  | "LOCKED"
  | "COMPLETED";

/**
 * Basic quiz session identity.
 */
export interface QuizSessionIdentity {
  /**
   * Quiz ID.
   */
  quizId: string;

  /**
   * Live room ID.
   */
  roomId: string;

  /**
   * Current user's quiz role.
   */
  role: QuizGameRole;

  /**
   * Authenticated application user ID.
   */
  userId?: string | null;

  /**
   * Quiz participant ID.
   */
  participantId?: string | null;
}

/**
 * Current connection state.
 */
export interface QuizSessionConnection {
  /**
   * Socket connection status.
   */
  status: QuizSessionConnectionStatus;

  /**
   * Convenience flag.
   */
  connected: boolean;

  /**
   * Whether the socket has successfully joined
   * the quiz room.
   */
  joinedRoom: boolean;

  /**
   * Last connection error.
   */
  error?: string | null;

  /**
   * Last successful connection timestamp.
   */
  connectedAt?: string | null;

  /**
   * Last disconnection timestamp.
   */
  disconnectedAt?: string | null;

  /**
   * Number of reconnect attempts.
   */
  reconnectAttempts?: number;
}

/**
 * Room activation information.
 */
export interface QuizSessionRoom {
  /**
   * Whether the room has been activated.
   */
  activated: boolean;

  /**
   * Detailed activation state.
   */
  activationStatus: QuizRoomActivationStatus;

  /**
   * Current server room state.
   */
  state: QuizRoomState;

  /**
   * Number of participants currently in the room.
   */
  participantCount?: number;

  /**
   * Number currently online.
   */
  onlineParticipantCount?: number;

  /**
   * Last room-state update.
   */
  updatedAt?: string | null;
}

/**
 * Current round information.
 */
export interface QuizSessionRound {
  /**
   * Current round number.
   */
  number: number;

  /**
   * Total number of rounds.
   */
  total: number;

  /**
   * Current round state.
   */
  state: QuizRoundState;

  /**
   * Number of participants at the start of the round.
   */
  startingParticipantCount?: number | null;

  /**
   * Number of participants currently active.
   */
  activeParticipantCount?: number | null;

  /**
   * Target number of participants after elimination.
   */
  targetParticipantCount?: number | null;
}

/**
 * Current question state.
 */
export interface QuizSessionQuestion {
  /**
   * Current question ID.
   */
  id?: string | null;

  /**
   * Current question number.
   */
  number?: number | null;

  /**
   * Total questions in the current round.
   */
  total?: number | null;

  /**
   * Question lifecycle state.
   */
  state: QuizSessionQuestionState;

  /**
   * Question timer duration.
   */
  timeLimit?: number | null;

  /**
   * Server-authoritative start timestamp.
   */
  startedAt?: string | null;

  /**
   * Server-authoritative expiration timestamp.
   */
  expiresAt?: string | null;

  /**
   * Client-derived remaining time.
   *
   * This should not be treated as authoritative.
   */
  timeRemaining?: number | null;
}

/**
 * Current answer state for the logged-in participant.
 *
 * For HOST and SPECTATOR this normally remains null.
 */
export interface QuizSessionAnswer {
  /**
   * Selected option value.
   */
  selectedAnswer?: string | null;

  /**
   * Whether an answer has been submitted.
   */
  submitted: boolean;

  /**
   * Server acknowledgement of submission.
   */
  accepted?: boolean;

  /**
   * Whether the server determined the answer was correct.
   */
  isCorrect?: boolean | null;

  /**
   * Points awarded.
   */
  pointsEarned?: number | null;

  /**
   * Submission timestamp.
   */
  submittedAt?: string | null;
}

/**
 * Current leaderboard summary for the session user.
 */
export interface QuizSessionScore {
  /**
   * Current score.
   */
  score: number;

  /**
   * Current rank.
   */
  rank?: number | null;

  /**
   * Correct answers.
   */
  correctAnswers?: number;

  /**
   * Questions answered.
   */
  answeredQuestions?: number;

  /**
   * Whether the participant has been eliminated.
   */
  isEliminated?: boolean;
}

/**
 * Complete live Quiz Board session.
 */
export interface QuizSession
  extends QuizSessionIdentity {
  /**
   * Connection information.
   */
  connection: QuizSessionConnection;

  /**
   * Room information.
   */
  room: QuizSessionRoom;

  /**
   * Current round.
   */
  round: QuizSessionRound;

  /**
   * Current question.
   */
  question: QuizSessionQuestion;

  /**
   * Current user's answer state.
   */
  answer: QuizSessionAnswer;

  /**
   * Current user's score summary.
   */
  score: QuizSessionScore;

  /**
   * Session creation timestamp.
   */
  createdAt?: string | null;

  /**
   * Last state synchronization timestamp.
   */
  updatedAt?: string | null;
}

/**
 * Configuration required to create/connect to a live session.
 */
export interface QuizSessionConfig {
  quizId: string;

  roomId: string;

  role: QuizGameRole;

  userId?: string | null;

  participantId?: string | null;

  numberOfRounds?: number;

  timePerQuestion?: number;
}

/**
 * Minimal session information needed by the play page.
 */
export interface QuizPlaySession {
  quizId: string;

  quizTitle: string;

  subject?: string | null;

  description?: string | null;

  currentRound: number;

  numberOfRounds: number;

  timePerQuestion: number;

  noOfContestants?: number | null;

  joinedCount?: number | null;

  roomId: string;

  startDate?: string | null;

  role: QuizGameRole;
}

/**
 * Session state used by the game controller.
 */
export interface QuizGameSessionState {
  session: QuizSession | null;

  loading: boolean;

  error: string | null;

  initialized: boolean;
}

/**
 * Creates the initial answer state.
 */
export function createInitialQuizSessionAnswer(): QuizSessionAnswer {
  return {
    selectedAnswer: null,
    submitted: false,
    accepted: false,
    isCorrect: null,
    pointsEarned: null,
    submittedAt: null,
  };
}

/**
 * Creates an initial question state.
 */
export function createInitialQuizSessionQuestion(): QuizSessionQuestion {
  return {
    id: null,
    number: null,
    total: null,
    state: "WAITING",
    timeLimit: null,
    startedAt: null,
    expiresAt: null,
    timeRemaining: null,
  };
}

/**
 * Creates a connection state.
 */
export function createInitialQuizSessionConnection(): QuizSessionConnection {
  return {
    status: "CONNECTING",
    connected: false,
    joinedRoom: false,
    error: null,
    connectedAt: null,
    disconnectedAt: null,
    reconnectAttempts: 0,
  };
}