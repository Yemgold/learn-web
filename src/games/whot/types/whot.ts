




/* ============================================================
   LEARNYFI WHOT — GAME TYPES
   ============================================================

   Frontend-only educational card game.

   Subjects:
   - Mathematics
   - English
   - Biology
   - Chemistry
   - Physics
   - History
   - General Knowledge
   ============================================================ */

/* ------------------------------------------------------------
   SUBJECTS
   ------------------------------------------------------------ */

export const WHOT_SUBJECTS = [
  "MATHS",
  "ENGLISH",
  "BIOLOGY",
  "CHEMISTRY",
  "PHYSICS",
  "HISTORY",
  "GENERAL",
] as const;

export type WhotSubject = (typeof WHOT_SUBJECTS)[number];

/* ------------------------------------------------------------
   DIFFICULTY
   ------------------------------------------------------------ */

export const WHOT_DIFFICULTIES = [
  "EASY",
  "MEDIUM",
  "HARD",
] as const;

export type WhotDifficulty = (typeof WHOT_DIFFICULTIES)[number];

/* ------------------------------------------------------------
   PLAYER
   ------------------------------------------------------------ */

export const WHOT_PLAYER_IDS = ["player", "bot"] as const;

export type WhotPlayerId = (typeof WHOT_PLAYER_IDS)[number];

/* ------------------------------------------------------------
   GAME STATUS
   ------------------------------------------------------------ */

export const WHOT_GAME_STATUSES = [
  "READY",
  "PLAYING",
  "FINISHED",
] as const;

export type WhotGameStatus = (typeof WHOT_GAME_STATUSES)[number];

/* ------------------------------------------------------------
   QUESTION
   ------------------------------------------------------------ */

export interface WhotQuestion {
  /** Stable identifier for the question. */
  id: string;

  /** Subject represented by this card. */
  subject: WhotSubject;

  /** Educational question displayed to the player. */
  question: string;

  /** Available answer choices. */
  options: string[];

  /** Zero-based index of the correct answer. */
  correctAnswerIndex: number;

  /** Question difficulty. */
  difficulty: WhotDifficulty;

  /** Optional explanation shown after answering. */
  explanation?: string;
}

/* ------------------------------------------------------------
   CARD
   ------------------------------------------------------------ */

export interface WhotCard extends WhotQuestion {
  /** Unique identifier for each physical card. */
  instanceId: string;
}

/* ------------------------------------------------------------
   PLAYER STATE
   ------------------------------------------------------------ */

export interface WhotPlayer {
  id: WhotPlayerId;
  name: string;
  hand: WhotCard[];
}

/* ------------------------------------------------------------
   GAME STATE
   ------------------------------------------------------------ */

export interface WhotGameState {
  status: WhotGameStatus;
  player: WhotPlayer;
  bot: WhotPlayer;
  drawPile: WhotCard[];
  centerCard: WhotCard;
  currentTurn: WhotPlayerId;
  selectedCardInstanceId: string | null;
  questionDeadline: number | null;
  winner: WhotPlayerId | null;
  message: string;
  correctAnswers: number;
  incorrectAnswers: number;
  turnsPlayed: number;
}

/* ------------------------------------------------------------
   ANSWER OUTCOME
   ------------------------------------------------------------ */

export type WhotAnswerOutcome =
  | {
      correct: true;
      answerIndex: number;
      explanation?: string;
    }
  | {
      correct: false;
      answerIndex: number | null;
      explanation?: string;
    };

/* ------------------------------------------------------------
   MOVE RESULT
   ------------------------------------------------------------ */

export type WhotMoveResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      reason:
        | "NOT_YOUR_TURN"
        | "CARD_NOT_FOUND"
        | "INVALID_MOVE"
        | "GAME_NOT_ACTIVE"
        | "NO_CARDS_AVAILABLE";
      message: string;
    };

/* ------------------------------------------------------------
   GAME ACTIONS
   ------------------------------------------------------------ */

export type WhotGameAction =
  | {
      type: "START_GAME";
    }
  | {
      type: "SELECT_CARD";
      instanceId: string;
    }
  | {
      type: "SUBMIT_ANSWER";
      answerIndex: number;
    }
  | {
      type: "DRAW_CARD";
    }
  | {
      type: "BOT_TURN";
    }
  | {
      type: "QUESTION_TIMEOUT";
    }
  | {
      type: "RESTART_GAME";
    }
  /**
   * Clear the previous answer feedback and allow the game
   * to continue. The reducer must preserve the correct turn,
   * score, hands, and bot challenge count.
   */
  | {
      type: "CONTINUE_AFTER_FEEDBACK";
    };

/* ------------------------------------------------------------
   GAME CONFIGURATION
   ------------------------------------------------------------ */

export interface WhotGameConfig {
  /** Number of cards dealt to each player. */
  initialHandSize: number;

  /** Time allowed to answer each question, in seconds. */
  questionTimeLimit: number;

  /** Number of cards drawn for a wrong answer or timeout. */
  wrongAnswerPenalty: number;

  /** Number of cards drawn when a player cannot play. */
  drawOnNoMatch: number;

  /** Number of copies of each question in the deck. */
  copiesPerQuestion: number;
}

/* ------------------------------------------------------------
   DEFAULT CONFIGURATION
   ------------------------------------------------------------ */

export const DEFAULT_WHOT_CONFIG: Readonly<WhotGameConfig> = {
  initialHandSize: 6,
  questionTimeLimit: 15,
  wrongAnswerPenalty: 2,
  drawOnNoMatch: 1,
  copiesPerQuestion: 2,
};

/* ------------------------------------------------------------
   SUBJECT DISPLAY INFORMATION
   ------------------------------------------------------------ */

export const WHOT_SUBJECT_LABELS: Record<WhotSubject, string> = {
  MATHS: "Mathematics",
  ENGLISH: "English",
  BIOLOGY: "Biology",
  CHEMISTRY: "Chemistry",
  PHYSICS: "Physics",
  HISTORY: "History",
  GENERAL: "General Knowledge",
};

/* ------------------------------------------------------------
   SUBJECT CARD STYLES
   ------------------------------------------------------------ */

export const WHOT_SUBJECT_STYLES: Record<
  WhotSubject,
  {
    label: string;
    className: string;
  }
> = {
  MATHS: {
    label: "Mathematics",
    className: "maths",
  },
  ENGLISH: {
    label: "English",
    className: "english",
  },
  BIOLOGY: {
    label: "Biology",
    className: "biology",
  },
  CHEMISTRY: {
    label: "Chemistry",
    className: "chemistry",
  },
  PHYSICS: {
    label: "Physics",
    className: "physics",
  },
  HISTORY: {
    label: "History",
    className: "history",
  },
  GENERAL: {
    label: "General Knowledge",
    className: "general",
  },
};
