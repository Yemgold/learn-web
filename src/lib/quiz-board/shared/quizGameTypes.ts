




// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\shared\quizGameTypes.ts

/* ============================================================
   QUIZ GAME ROLES
   ============================================================ */

/**
 * Role inside an individual quiz game.
 *
 * This is intentionally separate from the application's
 * authentication roles such as ADMIN or STUDENT.
 */
export type QuizGameRole =
  | "HOST"
  | "CONTESTANT"
  | "SPECTATOR";

/* ============================================================
   GAME STATUS
   ============================================================ */

export type QuizGameStatus =
  | "WAITING"
  | "ACTIVATING"
  | "ACTIVE"
  | "ROUND_WAITING"
  | "ROUND_ACTIVE"
  | "QUESTION_WAITING"
  | "QUESTION_ACTIVE"
  | "QUESTION_LOCKED"
  | "ROUND_COMPLETED"
  | "COMPLETED"
  | "CANCELLED";

/* ============================================================
   CONNECTION STATUS
   ============================================================ */

export type QuizConnectionStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED"
  | "RECONNECTING"
  | "ERROR";

/* ============================================================
   PARTICIPANT STATUS
   ============================================================ */

export type QuizParticipantStatus =
  | "JOINED"
  | "READY"
  | "ANSWERED"
  | "ELIMINATED"
  | "DISCONNECTED"
  | "COMPLETED";

/* ============================================================
   QUESTION STATUS
   ============================================================ */

export type QuizQuestionStatus =
  | "WAITING"
  | "ACTIVE"
  | "LOCKED"
  | "COMPLETED";

/* ============================================================
   OPTION
   ============================================================ */

export interface QuizGameOption {
  value: string;
  label: string;
}

/* ============================================================
   QUESTION
   ============================================================ */

/**
 * Question used by the live game.
 *
 * IMPORTANT:
 * This type does NOT contain correctAnswers.
 *
 * Correct answers must never be sent to contestants or
 * spectators through the public live-game payload.
 */
export interface QuizGameQuestion {
  id: string;

  question: string;

  options: QuizGameOption[];

  questionNumber: number;

  roundNumber?: number;

  difficulty?: string;

  subject?: string;

  topic?: string;

  status?: QuizQuestionStatus;
}

/**
 * Host-side question.
 *
 * This may contain the answer because the host is allowed
 * to review the question before starting it.
 */
export interface QuizHostQuestion
  extends QuizGameQuestion {
  correctAnswers?: string[];

  explanation?: string;

  points?: number;

  timeLimit?: number;
}

/* ============================================================
   PARTICIPANT
   ============================================================ */

export interface QuizGameParticipant {
  id: string;

  userId?: string;

  name?: string;

  username?: string;

  avatar?: string | null;

  role?: QuizGameRole;

  status: QuizParticipantStatus;

  score: number;

  rank?: number;

  answered?: boolean;

  correct?: boolean;

  eliminated?: boolean;

  connected?: boolean;
}

/* ============================================================
   LEADERBOARD
   ============================================================ */

export interface QuizLeaderboardEntry {
  participantId: string;

  userId?: string;

  name?: string;

  username?: string;

  rank: number;

  score: number;

  correctAnswers?: number;

  wrongAnswers?: number;

  unanswered?: number;

  eliminated?: boolean;

  isCurrentUser?: boolean;
}

/* ============================================================
   TIMER
   ============================================================ */

export interface QuizGameTimer {
  durationSeconds: number;

  remainingSeconds: number;

  startedAt?: number | null;

  endsAt?: number | null;

  running: boolean;

  expired: boolean;
}

/* ============================================================
   CURRENT QUESTION
   ============================================================ */

export interface QuizCurrentQuestion {
  question: QuizGameQuestion | null;

  questionNumber: number | null;

  roundNumber: number | null;

  status: QuizQuestionStatus;

  startedAt: number | null;

  lockedAt: number | null;

  timeLimit: number;

  timer: QuizGameTimer;
}

/* ============================================================
   ROUND
   ============================================================ */

export interface QuizRoundState {
  roundNumber: number;

  totalQuestions: number;

  currentQuestionNumber: number | null;

  completedQuestions: number;

  started: boolean;

  completed: boolean;

  eliminatedParticipantIds: string[];
}

/* ============================================================
   ROOM
   ============================================================ */

export interface QuizRoomState {
  roomId: string;

  quizId: string;

  activated: boolean;

  joined: boolean;

  role: QuizGameRole | null;

  hostId?: string | null;

  participantCount: number;

  maxParticipants?: number;

  status: QuizGameStatus;
}

/* ============================================================
   ANSWER
   ============================================================ */

export interface QuizSubmittedAnswer {
  participantId: string;

  questionId: string;

  questionNumber: number;

  answer: string;

  submittedAt: number;

  correct?: boolean;

  points?: number;
}

/* ============================================================
   GAME STATE
   ============================================================ */

export interface QuizGameState {
  quizId: string;

  roomId: string;

  role: QuizGameRole | null;

  connectionStatus: QuizConnectionStatus;

  room: QuizRoomState;

  gameStatus: QuizGameStatus;

  round: QuizRoundState;

  currentQuestion: QuizCurrentQuestion;

  participants: QuizGameParticipant[];

  leaderboard: QuizLeaderboardEntry[];

  selectedQuestionNumber: number | null;

  submittedAnswer: QuizSubmittedAnswer | null;

  hasAnsweredCurrentQuestion: boolean;

  error: string | null;

  lastUpdatedAt: number | null;
}

/* ============================================================
   HOST COMMAND TYPES
   ============================================================ */

export interface StartRoundPayload {
  roomId: string;

  quizId: string;

  roundNumber: number;
}

export interface StartQuestionPayload {
  roomId: string;

  quizId: string;

  roundNumber: number;

  questionNumber: number;

  questionId?: string;

  timeLimit: number;
}

export interface LockQuestionPayload {
  roomId: string;

  quizId: string;

  roundNumber?: number;

  questionNumber?: number;
}

export interface NextQuestionPayload {
  roomId: string;

  quizId: string;

  roundNumber: number;

  questionNumber?: number;
}

export interface SubmitAnswerPayload {
  roomId: string;

  roundNumber: number;

  questionId: string;

  selectedAnswerId: string;
}

/* ============================================================
   ROOM PAYLOADS
   ============================================================ */

export interface JoinRoomPayload {
  roomId: string;

  quizId: string;

  role: QuizGameRole;
}

export interface ActivateRoomPayload {
  roomId: string;

  quizId: string;

  role?: "ADMIN" | "HOST";
}

/* ============================================================
   SOCKET ACK
   ============================================================ */

export interface QuizSocketAck<T = unknown> {
  status?: "success" | "error";

  statusCode?: number;

  message?: string;

  data?: T;
}

/* ============================================================
   SOCKET ERROR
   ============================================================ */

export interface QuizSocketError {
  status?: "error";

  statusCode?: number;

  message: string;

  pattern?: string | null;
}