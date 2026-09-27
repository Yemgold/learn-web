




// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\quiz-board\quiz-question.ts

/**
 * Shared Quiz Board question types.
 *
 * IMPORTANT:
 * - These types are used across HOST, CONTESTANT, and SPECTATOR flows.
 * - Answer keys and explanations are host/admin-only data.
 * - Public live-question payloads must never expose the answer key.
 * - Backend remains authoritative for question selection, timing,
 *   answer validation, scoring, and question state.
 */

/**
 * Question lifecycle state.
 */
export type QuizQuestionStatus =
  | "READY"
  | "SELECTED"
  | "LIVE"
  | "LOCKED"
  | "COMPLETED"
  | "SKIPPED";

/**
 * Supported question types.
 */
export type QuizQuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE";

/**
 * A question option.
 *
 * `value` is the actual option value submitted by the contestant.
 * `label` is the display label, such as A, B, C, or D.
 */
export interface QuizQuestionOption {
  label: string;

  value: string;
}

/**
 * Public option representation.
 *
 * This is the safe representation sent to contestants and spectators.
 *
 * IMPORTANT:
 * Never add `isCorrect`, `correct`, or answer-key information here.
 */
export interface PublicQuizQuestionOption {
  label: string;

  value: string;
}

/**
 * Host/admin option representation.
 *
 * The host is allowed to see the correct answer when reviewing
 * or managing questions.
 */
export interface HostQuizQuestionOption extends QuizQuestionOption {
  isCorrect?: boolean;
}

/**
 * Question timing information.
 *
 * The backend should provide `startedAt` and `expiresAt`.
 * Clients derive the countdown from these timestamps.
 */
export interface QuizQuestionTiming {
  /**
   * Time allowed for the question, in seconds.
   */
  timeLimit: number;

  /**
   * Server-authoritative question start time.
   */
  startedAt?: string | null;

  /**
   * Server-authoritative question expiration time.
   */
  expiresAt?: string | null;
}

/**
 * Public live-question data.
 *
 * This is the question shape that can safely be broadcast to:
 *
 * - CONTESTANT
 * - SPECTATOR
 *
 * It intentionally contains no answer key.
 */
export interface PublicQuizQuestion {
  /**
   * Unique question ID.
   */
  id: string;

  /**
   * Question text.
   */
  question: string;

  /**
   * Available answer options.
   */
  options: PublicQuizQuestionOption[];

  /**
   * Question type.
   */
  type?: QuizQuestionType;

  /**
   * Current round.
   */
  roundNumber?: number | null;

  /**
   * Position inside the round.
   */
  questionNumber?: number | null;

  /**
   * Number of questions in the current round.
   */
  totalQuestions?: number | null;

  /**
   * Current question state.
   */
  status?: QuizQuestionStatus;

  /**
   * Authoritative timing information.
   */
  timeLimit?: number | null;

  startedAt?: string | null;

  expiresAt?: string | null;
}

/**
 * Host/admin question representation.
 *
 * This may contain the answer key and explanation because the host
 * needs to review and control the question.
 */
export interface HostQuizQuestion extends PublicQuizQuestion {
  /**
   * Host-only options containing answer information.
   */
  options: HostQuizQuestionOption[];

  /**
   * Single correct answer.
   */
  correctAnswer?: string | null;

  /**
   * Multiple correct answers.
   */
  correctAnswers?: string[];

  /**
   * Alternative answer-key representation used by some APIs.
   */
  answerKey?: string | string[] | null;

  /**
   * Normalized correct option values.
   */
  correctValues?: string[];

  /**
   * Optional explanation shown to the host/admin.
   */
  explanation?: string | null;
}

/**
 * Generic Quiz Board question.
 *
 * Use this when the caller does not need to distinguish between
 * public and host-only representations.
 */
export interface QuizQuestion extends PublicQuizQuestion {
  /**
   * Optional answer information.
   *
   * Only populate these fields in trusted host/admin contexts.
   */
  correctAnswer?: string | null;

  correctAnswers?: string[];

  answerKey?: string | string[] | null;

  correctValues?: string[];

  explanation?: string | null;
}

/**
 * Question displayed in the host question bank.
 */
export interface QuizQuestionListItem {
  /**
   * Unique question ID.
   */
  id: string;

  /**
   * Position inside the round.
   */
  questionNumber: number;

  /**
   * Question text.
   */
  question: string;

  /**
   * Question type.
   */
  type?: QuizQuestionType;

  /**
   * Host-visible options.
   */
  options?: HostQuizQuestionOption[];

  /**
   * Configured time for this question.
   */
  timeLimit?: number | null;

  /**
   * Current lifecycle status.
   */
  status?: QuizQuestionStatus;

  /**
   * Number of participants who have answered.
   */
  answeredCount?: number;

  /**
   * Number of correct responses.
   *
   * Host-only statistic.
   */
  correctCount?: number;

  /**
   * Optional explanation.
   */
  explanation?: string | null;
}

/**
 * Question preview used by the host before broadcasting it.
 */
export interface QuizQuestionPreview extends QuizQuestionListItem {
  /**
   * Total questions in the round.
   */
  totalQuestions?: number | null;

  /**
   * Correct answer(s), available only to the host.
   */
  correctAnswer?: string | null;

  correctAnswers?: string[];

  correctValues?: string[];
}

/**
 * Payload used by the HOST to start a question.
 *
 * The host selects a question and asks the backend to start it.
 *
 * The backend must validate:
 * - host permissions
 * - room
 * - quiz
 * - round
 * - question
 * - question state
 * - time limit
 */
export interface StartQuizQuestionPayload {
  roomId: string;

  quizId: string;

  roundNumber: number;

  questionNumber: number;

  /**
   * Preferred unique question identifier.
   */
  questionId?: string;

  /**
   * Optional per-question duration.
   */
  timeLimit?: number;
}

/**
 * Compatibility payload supporting snake_case backend contracts.
 *
 * Keep this only while the backend/API contract accepts both naming
 * conventions.
 */
export interface StartQuizQuestionSocketPayload
  extends StartQuizQuestionPayload {
  room_id?: string;

  quiz_id?: string;

  round_number?: number;

  question_number?: number;

  question_id?: string;

  time_limit?: number;
}

/**
 * Payload broadcast by the backend when a question begins.
 *
 * IMPORTANT:
 * This payload must never contain:
 *
 * - correctAnswer
 * - correctAnswers
 * - answerKey
 * - correctValues
 * - explanation containing the answer
 */
export interface QuizQuestionStartedEvent {
  roomId: string;

  quizId: string;

  roundNumber: number;

  questionNumber: number;

  totalQuestions: number;

  question: PublicQuizQuestion;

  timeLimit: number;

  startedAt: string;

  expiresAt: string;
}

/**
 * Payload emitted when a question is locked.
 */
export interface QuizQuestionLockedEvent {
  roomId: string;

  quizId: string;

  roundNumber: number;

  questionNumber: number;

  questionId?: string;

  lockedAt: string;

  reason?:
    | "HOST"
    | "TIME_EXPIRED"
    | "ROUND_COMPLETED"
    | "SYSTEM";
}

/**
 * Payload emitted when moving to the next question.
 */
export interface NextQuizQuestionPayload {
  roomId: string;

  quizId: string;

  roundNumber: number;

  currentQuestionNumber: number;

  nextQuestionNumber: number;
}

/**
 * Payload used by a contestant to submit an answer.
 *
 * The contestant submits the selected option value.
 * The client must never submit an answer key.
 */
export interface SubmitQuizAnswerPayload {
  roomId: string;

  quizId: string;

  roundNumber: number;

  questionNumber: number;

  questionId: string;

  answer: string;
}

/**
 * Compatibility version for APIs using alternate property names.
 */
export interface SubmitQuizAnswerSocketPayload
  extends SubmitQuizAnswerPayload {
  room_id?: string;

  quiz_id?: string;

  round_number?: number;

  question_number?: number;

  question_id?: string;

  selectedAnswer?: string;
}

/**
 * Server response to an answer submission.
 *
 * The server determines correctness and scoring.
 */
export interface QuizAnswerSubmissionResult {
  quizId: string;

  roomId: string;

  participantId: string;

  questionId: string;

  questionNumber: number;

  submittedAnswer: string;

  accepted: boolean;

  /**
   * Whether this participant's answer was correct.
   */
  isCorrect?: boolean;

  /**
   * Points awarded for the answer.
   */
  pointsEarned?: number;

  /**
   * Current participant score after this answer.
   */
  totalScore?: number;

  submittedAt?: string | null;
}

/**
 * Public answer-selection event.
 *
 * This can be used for live answer-state indicators without
 * exposing the correct answer.
 */
export interface QuizParticipantAnswerSelectedEvent {
  quizId: string;

  roomId: string;

  participantId: string;

  questionId: string;

  questionNumber: number;

  submittedAt: string;
}

/**
 * First-correct-answer event.
 *
 * The backend determines who was first.
 */
export interface QuizFirstCorrectAnswerEvent {
  quizId: string;

  roomId: string;

  roundNumber: number;

  questionNumber: number;

  questionId: string;

  participantId: string;

  userId?: string | null;

  participantName?: string | null;

  answeredAt: string;

  pointsEarned?: number;
}

/**
 * Question statistics available to the host after the question
 * has been answered/locked.
 */
export interface QuizQuestionStatistics {
  questionId: string;

  questionNumber: number;

  totalParticipants?: number;

  answeredCount?: number;

  unansweredCount?: number;

  correctCount?: number;

  incorrectCount?: number;

  firstCorrectParticipantId?: string | null;

  averageResponseTimeMs?: number | null;
}

/**
 * Host-side question state.
 */
export interface HostQuizQuestionState {
  selectedQuestion: QuizQuestionPreview | null;

  currentQuestion: HostQuizQuestion | null;

  questions: QuizQuestionListItem[];

  currentQuestionNumber: number | null;

  totalQuestions: number | null;

  questionStarted: boolean;

  questionLocked: boolean;

  timeLimit: number;

  statistics?: QuizQuestionStatistics | null;
}

/**
 * Contestant-side question state.
 *
 * Deliberately excludes answer keys.
 */
export interface ContestantQuizQuestionState {
  currentQuestion: PublicQuizQuestion | null;

  selectedAnswer: string | null;

  answerSubmitted: boolean;

  questionLocked: boolean;

  timeRemaining: number | null;
}

/**
 * Spectator-side question state.
 *
 * Spectators can see the live question but cannot answer.
 */
export interface SpectatorQuizQuestionState {
  currentQuestion: PublicQuizQuestion | null;

  questionLocked: boolean;

  timeRemaining: number | null;
}

/**
 * Question collection returned by the round-question API.
 */
export interface QuizRoundQuestionsResponse {
  quizId?: string;

  roundNumber: number;

  totalQuestions: number;

  questions: QuizQuestionListItem[];
}

/**
 * Normalized question data used internally by the quiz game.
 */
export interface NormalizedQuizQuestion {
  id: string;

  question: string;

  options: QuizQuestionOption[];

  type?: QuizQuestionType;

  questionNumber: number;

  totalQuestions: number;

  timeLimit: number;

  status: QuizQuestionStatus;

  startedAt?: string | null;

  expiresAt?: string | null;
}

/**
 * Type guard for checking whether a question has started.
 */
export function isQuizQuestionLive(
  question: QuizQuestion | PublicQuizQuestion | null | undefined,
): boolean {
  return question?.status === "LIVE";
}

/**
 * Type guard for checking whether a question is locked.
 */
export function isQuizQuestionLocked(
  question: QuizQuestion | PublicQuizQuestion | null | undefined,
): boolean {
  return question?.status === "LOCKED";
}

/**
 * Returns a safe public representation of a question.
 *
 * This is useful when a host/admin question object must be transformed
 * before being sent to contestant/spectator UI.
 */
export function toPublicQuizQuestion(
  question: QuizQuestion | HostQuizQuestion,
): PublicQuizQuestion {
  return {
    id: question.id,
    question: question.question,
    options: question.options.map((option) => ({
      label: option.label,
      value: option.value,
    })),
    type: question.type,
    roundNumber: question.roundNumber,
    questionNumber: question.questionNumber,
    totalQuestions: question.totalQuestions,
    status: question.status,
    timeLimit: question.timeLimit,
    startedAt: question.startedAt,
    expiresAt: question.expiresAt,
  };
}