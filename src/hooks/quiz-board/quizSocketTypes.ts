





// C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\quizSocketTypes.ts

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type { Socket } from "socket.io-client";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import type {
  HostParticipant,
} from "@/components/quiz-board/host/HostParticipantPanel";

import type {
  HostLeaderboardEntry,
} from "@/components/quiz-board/host/HostLeaderboardPanel";

import type {
  HostQuestionPreviewQuestion,
} from "@/components/quiz-board/host/HostQuestionPreview";

/* -------------------------------------------------------------------------- */
/* Live question                                                             */
/* -------------------------------------------------------------------------- */

export interface LiveQuestion {
  id: string;

  question: string;

  options: Array<{
    id: string;
    label: string;
    value: string;
  }>;

  questionNumber: number | null;

  totalQuestions: number | null;

  timeLimit: number | null;

  startedAt: string | null;

  expiresAt: string | null;
}

/* -------------------------------------------------------------------------- */
/* Quiz room                                                                 */
/* -------------------------------------------------------------------------- */

export interface QuizRoomDocument {
  roomId: string | null;

  quizId: string | null;

  status: string | null;

  currentRound: number | null;

  currentQuestionNumber: number | null;

  participants: HostParticipant[];

  leaderboard: HostLeaderboardEntry[];

  [key: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/* Contestant answer result                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Server response returned by the `answer_result` socket event.
 *
 * This represents the authoritative result of a contestant's
 * submitted answer.
 *
 * Important:
 * The backend does NOT currently return the correct answer text.
 * Therefore this type intentionally does not contain a
 * `correctAnswer` field.
 */
export interface QuizAnswerResult {
  /**
   * Updated leaderboard returned by the server.
   *
   * Kept as unknown[] because the exact backend leaderboard
   * shape is already handled separately by mapLeaderboard().
   */
  leaderboardData: unknown[];

  /**
   * ID of the saved contestant answer.
   */
  answerId: string | null;

  /**
   * Quiz ID associated with the answer.
   */
  quizId: string | null;

  /**
   * Room ID associated with the answer.
   */
  roomId: string | null;

  /**
   * Round in which the answer was submitted.
   */
  roundNumber: number | null;

  /**
   * Question ID that was answered.
   */
  questionId: string | null;

  /**
   * The option value selected by the contestant.
   *
   * Example:
   * "Taxonomy"
   */
  selectedAnswer: string | null;

  /**
   * Whether the submitted answer was correct.
   */
  isCorrect: boolean;

  /**
   * Whether this contestant was the first
   * participant to answer correctly.
   */
  isFirstCorrectAnswer: boolean;

  /**
   * Points awarded specifically for this answer.
   */
  scoreAwarded: number;

  /**
   * Contestant's score for the current round.
   */
  roundScore: number;

  /**
   * Contestant's total score after this answer.
   */
  totalScore: number;

  /**
   * Time taken to answer, according to the server.
   */
  timeTakenInSeconds: number | null;

  /**
   * Server-generated result message.
   *
   * Examples:
   *
   * "Correct answer. You received the points for being
   * the first correct participant."
   *
   * "Correct answer. Another participant answered correctly
   * first, so no points were awarded."
   *
   * "Incorrect answer."
   */
  message: string;
}

/* -------------------------------------------------------------------------- */
/* Feed event                                                                */
/* -------------------------------------------------------------------------- */

export interface QuizFeedEvent {
  id: string;

  type: string;

  message: string;

  timestamp: string;

  participantId?: string | null;

  participantName?: string | null;
}

/* -------------------------------------------------------------------------- */
/* Socket payload                                                            */
/* -------------------------------------------------------------------------- */

export type SocketPayload = Record<
  string,
  unknown
>;

/* -------------------------------------------------------------------------- */
/* Hook options                                                              */
/* -------------------------------------------------------------------------- */

export interface UseQuizSocketOptions {
  quizId: string;

  roomId: string | null;

  role: QuizGameRole | null;

  currentRound?: number;

  initialRound?: number;

  onRoundChanged?: (
    roundNumber: number,
  ) => void;

  selectedQuestion?: HostQuestionPreviewQuestion | null;

  timeLimit?: number;
}

/* -------------------------------------------------------------------------- */
/* Hook result                                                               */
/* -------------------------------------------------------------------------- */

export interface UseQuizSocketResult {
  connected: boolean;

  roomJoined: boolean;

  roomActivated: boolean;

  roomDoc: QuizRoomDocument | null;

  currentRound: number;

  question: LiveQuestion | null;

  currentQuestionNumber: number | null;

  questionStarted: boolean;

  questionLocked: boolean;

  selectedAnswer: string | null;

  answerSubmitted: boolean;

  submittingAnswer: boolean;

  /**
   * Authoritative response received from the server
   * after the contestant submits an answer.
   *
   * null means no answer result has been received
   * for the currently displayed question.
   */
  answerResult: QuizAnswerResult | null;

  participants: HostParticipant[];

  leaderboard: HostLeaderboardEntry[];

  feedEvents: QuizFeedEvent[];

  socketError: string | null;

  actionLoading: boolean;

  timeLimit: number;

  setTimeLimit: Dispatch<
    SetStateAction<number>
  >;

  setSelectedAnswer: Dispatch<
    SetStateAction<string | null>
  >;

  startQuestion: () => void;

  lockQuestion: () => void;

  nextQuestion: () => void;

  /**
   * Contestant-only answer selection.
   *
   * This immediately locks the contestant's
   * answer UI and emits the selected answer
   * to the quiz server.
   */
  selectContestantAnswer: (
    answer: string,
  ) => void;

  /**
   * Existing submit action.
   *
   * Kept for compatibility while the contestant
   * selection flow is being separated.
   */
  submitAnswer: (
    answer: string,
  ) => void;

  refreshSocketState: () => void;
}

/* -------------------------------------------------------------------------- */
/* Socket action context                                                     */
/* -------------------------------------------------------------------------- */

export interface QuizSocketActionContext {
  quizId: string;

  roomId: string;

  currentRoundRef: {
    current: number;
  };

  selectedQuestionRef: {
    current:
      | HostQuestionPreviewQuestion
      | null
      | undefined;
  };

  timeLimitRef: {
    current: number;
  };

  questionRef: {
    current: LiveQuestion | null;
  };

  setActionLoading: Dispatch<
    SetStateAction<boolean>
  >;

  setSocketError: Dispatch<
    SetStateAction<string | null>
  >;

  setQuestionStarted: Dispatch<
    SetStateAction<boolean>
  >;

  setQuestionLocked: Dispatch<
    SetStateAction<boolean>
  >;

  setSelectedAnswer: Dispatch<
    SetStateAction<string | null>
  >;

  setAnswerSubmitted: Dispatch<
    SetStateAction<boolean>
  >;

  setSubmittingAnswer: Dispatch<
    SetStateAction<boolean>
  >;
}


export interface QuizFastestWinner {
  name?: string | null;
  email?: string | null;
  userId?: string | null;
  questionId?: string | null;
  timeTakenInSeconds?: number | null;
  scoreAwarded?: number | null;
}
