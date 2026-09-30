




// C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\quizSocketTypes.ts

import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import type {
  HostParticipant,
} from "@/components/quiz-board/host/HostParticipantPanel";

import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";

import type {
  HostQuestionPreviewQuestion,
} from "@/components/quiz-board/host/HostQuestionPreview";

export interface LiveQuestion {
  id: string;

  question: string;

  options: Array<{
    label: string;
    value: string;
  }>;

  questionNumber: number | null;

  totalQuestions: number | null;

  timeLimit: number | null;

  startedAt: string | null;

  expiresAt: string | null;
}

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

export interface QuizFeedEvent {
  id: string;

  type: string;

  message: string;

  timestamp: string;

  participantId?: string | null;

  participantName?: string | null;
}

export type SocketPayload = Record<string, unknown>;

export interface UseQuizSocketOptions {
  quizId: string;

  roomId: string | null;

  role: QuizGameRole | null;

  currentRound?: number;

  initialRound?: number;

  onRoundChanged?: (roundNumber: number) => void;

  selectedQuestion?: HostQuestionPreviewQuestion | null;

  timeLimit?: number;
}

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

  participants: HostParticipant[];

  leaderboard: HostLeaderboardEntry[];

  feedEvents: QuizFeedEvent[];

  socketError: string | null;

  actionLoading: boolean;

  timeLimit: number;

  setTimeLimit: Dispatch<SetStateAction<number>>;

  setSelectedAnswer: Dispatch<SetStateAction<string | null>>;

  startQuestion: () => void;

  lockQuestion: () => void;

  nextQuestion: () => void;

  submitAnswer: (answer: string) => void;

  refreshSocketState: () => void;
}

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