




export type EduLudoMode =
  | "solo"
  | "friends"
  | "classroom"
  | "tournament";

export type EduLudoColor =
  | "red"
  | "green"
  | "yellow"
  | "blue";

export type EduLudoLevel =
  | "JSS"
  | "SSS"
  | "JAMB"
  | "WAEC"
  | "Custom";

export type EduLudoSubject =
  | "All Subjects"
  | "Mathematics"
  | "English"
  | "Science"
  | "Biology"
  | "Chemistry"
  | "Physics"
  | "Custom";

export type EduLudoDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type EduLudoPhase =
  | "lobby"
  | "setup"
  | "countdown"
  | "playing"
  | "question"
  | "feedback"
  | "finished";

export type EduLudoTokenStatus =
  | "base"
  | "track"
  | "home";

export interface EduLudoToken {
  id: number;
  position: number;
  status?: EduLudoTokenStatus;
}

export interface EduLudoPlayer {
  id: string;
  name: string;
  color: EduLudoColor;
  isBot: boolean;
  tokens: EduLudoToken[];
  score: number;
  totalScore?: number;
  isActive?: boolean;
  hasWon?: boolean;
  answeredQuestions?: number;
  correctAnswers?: number;
}

export interface EduLudoQuestion {
  id: string | number;
  subject: EduLudoSubject | string;
  level: EduLudoLevel | string;
  difficulty?: EduLudoDifficulty;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points?: number;
}

export interface EduLudoMove {
  playerId: string;
  tokenId: number;
  from: number;
  to: number;
  diceValue: number;
  canCapture?: boolean;
  reachesHome?: boolean;
}

export interface EduLudoTransaction {
  id: string;
  type: "debit" | "credit";
  amount: number;
  description: string;
  createdAt: number;
  balanceAfter?: number;
}

export interface EduLudoToast {
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

export interface EduLudoReward {
  cbtPoints: number;
  reason: string;
}

export interface EduLudoGameProps {
  initialBalance?: number;
  initialCbtPoints?: number;
  onBack?: () => void;
  onFundWallet?: () => void;
}

/**
 * Compatibility alias for components that use the shorter Props name.
 */
export type Props = EduLudoGameProps;

/**
 * Board coordinate used to render the Ludo track and home lanes.
 */
export interface EduLudoCoordinate {
  row: number;
  col: number;
}

/**
 * Optional configuration for the game lobby.
 */
export interface EduLudoLobbySettings {
  mode: EduLudoMode;
  subject: EduLudoSubject;
  level: EduLudoLevel;
  difficulty: EduLudoDifficulty;
  playerColor: EduLudoColor;
}

/**
 * Result returned after a player answers a question.
 */
export interface EduLudoAnswerResult {
  isCorrect: boolean;
  selectedAnswer: number | null;
  correctAnswer: number;
  pointsAwarded: number;
  explanation?: string;
}

/**
 * Summary shown when a game finishes.
 */
export interface EduLudoMatchResult {
  winnerId: string | null;
  winnerName: string | null;
  players: EduLudoPlayer[];
  cbtPointsEarned: number;
  completedAt: number;
}
