




// /* ============================================================
//    LEARNYFI WHOT — GAME TYPES
//    ============================================================

//    Frontend-only educational card game.

//    Subjects:
//    - Mathematics
//    - English
//    - Biology
//    - Chemistry
//    - Physics
//    - History
//    - General Knowledge
//    ============================================================ */

// /* ------------------------------------------------------------
//    SUBJECTS
//    ------------------------------------------------------------ */

// export const WHOT_SUBJECTS = [
//   "MATHS",
//   "ENGLISH",
//   "BIOLOGY",
//   "CHEMISTRY",
//   "PHYSICS",
//   "HISTORY",
//   "GENERAL",
// ] as const;

// export type WhotSubject = (typeof WHOT_SUBJECTS)[number];

// /* ------------------------------------------------------------
//    DIFFICULTY
//    ------------------------------------------------------------ */

// export const WHOT_DIFFICULTIES = [
//   "EASY",
//   "MEDIUM",
//   "HARD",
// ] as const;

// export type WhotDifficulty = (typeof WHOT_DIFFICULTIES)[number];

// /* ------------------------------------------------------------
//    PLAYER
//    ------------------------------------------------------------ */

// export const WHOT_PLAYER_IDS = ["player", "bot"] as const;

// export type WhotPlayerId = (typeof WHOT_PLAYER_IDS)[number];

// /* ------------------------------------------------------------
//    GAME STATUS
//    ------------------------------------------------------------ */

// export const WHOT_GAME_STATUSES = [
//   "READY",
//   "PLAYING",
//   "FINISHED",
// ] as const;

// export type WhotGameStatus = (typeof WHOT_GAME_STATUSES)[number];

// /* ------------------------------------------------------------
//    QUESTION
//    ------------------------------------------------------------ */

// export interface WhotQuestion {
//   /** Stable identifier for the question. */
//   id: string;

//   /** Subject represented by this card. */
//   subject: WhotSubject;

//   /** Educational question displayed to the player. */
//   question: string;

//   /** Available answer choices. */
//   options: string[];

//   /** Zero-based index of the correct answer. */
//   correctAnswerIndex: number;

//   /** Question difficulty. */
//   difficulty: WhotDifficulty;

//   /** Optional explanation shown after answering. */
//   explanation?: string;
// }

// /* ------------------------------------------------------------
//    CARD
//    ------------------------------------------------------------ */

// export interface WhotCard extends WhotQuestion {
//   /** Unique identifier for each physical card. */
//   instanceId: string;
// }

// /* ------------------------------------------------------------
//    PLAYER STATE
//    ------------------------------------------------------------ */

// export interface WhotPlayer {
//   id: WhotPlayerId;
//   name: string;
//   hand: WhotCard[];
// }

// /* ------------------------------------------------------------
//    GAME STATE
//    ------------------------------------------------------------ */

// export interface WhotGameState {
//   status: WhotGameStatus;
//   player: WhotPlayer;
//   bot: WhotPlayer;
//   drawPile: WhotCard[];
//   centerCard: WhotCard;
//   currentTurn: WhotPlayerId;
//   selectedCardInstanceId: string | null;
//   questionDeadline: number | null;
//   winner: WhotPlayerId | null;
//   message: string;
//   correctAnswers: number;
//   incorrectAnswers: number;
//   turnsPlayed: number;
// }

// /* ------------------------------------------------------------
//    ANSWER OUTCOME
//    ------------------------------------------------------------ */

// export type WhotAnswerOutcome =
//   | {
//       correct: true;
//       answerIndex: number;
//       explanation?: string;
//     }
//   | {
//       correct: false;
//       answerIndex: number | null;
//       explanation?: string;
//     };

// /* ------------------------------------------------------------
//    MOVE RESULT
//    ------------------------------------------------------------ */

// export type WhotMoveResult =
//   | {
//       success: true;
//       message: string;
//     }
//   | {
//       success: false;
//       reason:
//         | "NOT_YOUR_TURN"
//         | "CARD_NOT_FOUND"
//         | "INVALID_MOVE"
//         | "GAME_NOT_ACTIVE"
//         | "NO_CARDS_AVAILABLE";
//       message: string;
//     };

// /* ------------------------------------------------------------
//    GAME ACTIONS
//    ------------------------------------------------------------ */

// export type WhotGameAction =
//   | {
//       type: "START_GAME";
//     }
//   | {
//       type: "SELECT_CARD";
//       instanceId: string;
//     }
//   | {
//       type: "SUBMIT_ANSWER";
//       answerIndex: number;
//     }
//   | {
//       type: "DRAW_CARD";
//     }
//   | {
//       type: "BOT_TURN";
//     }
//   | {
//       type: "QUESTION_TIMEOUT";
//     }
//   | {
//       type: "RESTART_GAME";
//     }
//   /**
//    * Clear the previous answer feedback and allow the game
//    * to continue. The reducer must preserve the correct turn,
//    * score, hands, and bot challenge count.
//    */
//   | {
//       type: "CONTINUE_AFTER_FEEDBACK";
//     };

// /* ------------------------------------------------------------
//    GAME CONFIGURATION
//    ------------------------------------------------------------ */

// export interface WhotGameConfig {
//   /** Number of cards dealt to each player. */
//   initialHandSize: number;

//   /** Time allowed to answer each question, in seconds. */
//   questionTimeLimit: number;

//   /** Number of cards drawn for a wrong answer or timeout. */
//   wrongAnswerPenalty: number;

//   /** Number of cards drawn when a player cannot play. */
//   drawOnNoMatch: number;

//   /** Number of copies of each question in the deck. */
//   copiesPerQuestion: number;
// }

// /* ------------------------------------------------------------
//    DEFAULT CONFIGURATION
//    ------------------------------------------------------------ */

// export const DEFAULT_WHOT_CONFIG: Readonly<WhotGameConfig> = {
//   initialHandSize: 6,
//   questionTimeLimit: 15,
//   wrongAnswerPenalty: 2,
//   drawOnNoMatch: 1,
//   copiesPerQuestion: 2,
// };

// /* ------------------------------------------------------------
//    SUBJECT DISPLAY INFORMATION
//    ------------------------------------------------------------ */

// export const WHOT_SUBJECT_LABELS: Record<WhotSubject, string> = {
//   MATHS: "Mathematics",
//   ENGLISH: "English",
//   BIOLOGY: "Biology",
//   CHEMISTRY: "Chemistry",
//   PHYSICS: "Physics",
//   HISTORY: "History",
//   GENERAL: "General Knowledge",
// };

// /* ------------------------------------------------------------
//    SUBJECT CARD STYLES
//    ------------------------------------------------------------ */

// export const WHOT_SUBJECT_STYLES: Record<
//   WhotSubject,
//   {
//     label: string;
//     className: string;
//   }
// > = {
//   MATHS: {
//     label: "Mathematics",
//     className: "maths",
//   },
//   ENGLISH: {
//     label: "English",
//     className: "english",
//   },
//   BIOLOGY: {
//     label: "Biology",
//     className: "biology",
//   },
//   CHEMISTRY: {
//     label: "Chemistry",
//     className: "chemistry",
//   },
//   PHYSICS: {
//     label: "Physics",
//     className: "physics",
//   },
//   HISTORY: {
//     label: "History",
//     className: "history",
//   },
//   GENERAL: {
//     label: "General Knowledge",
//     className: "general",
//   },
// };













/* ============================================================
   LEARNYFI WHOT — GAME TYPES
   ============================================================ */

/* ------------------------------------------------------------
   SUBJECTS
   ------------------------------------------------------------ */

export const WHOT_SUBJECTS = [
  "MATHS",
  "FURTHER_MATHS",
  "ENGLISH",
  "BIOLOGY",
  "CHEMISTRY",
  "PHYSICS",
  "AGRICULTURAL_SCIENCE",
  "COMPUTER_STUDIES",
  "COMMERCE",
  "ACCOUNTING",
  "ECONOMICS",
  "GOVERNMENT",
  "OFFICE_PRACTICE",
  "BUSINESS_STUDIES",
  "LITERATURE",
  "HISTORY",
  "CRS",
  "IRS",
  "FRENCH",
  "YORUBA",
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
   PLAYERS
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
   SETUP SELECTION
   ------------------------------------------------------------ */

export type WhotClassGroup =
  | "SCIENCES"
  | "COMMERCIAL"
  | "ARTS";

export interface WhotSelectedSubject {
  id: string;
  name: string;
}

export interface WhotGameSelection {
  classGroup: WhotClassGroup;
  subjects: WhotSelectedSubject[];
  selectedAt?: string;
}

/* ------------------------------------------------------------
   QUESTION
   ------------------------------------------------------------ */

export interface WhotQuestion {
  id: string;
  subject: WhotSubject;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: WhotDifficulty;
  explanation?: string;
}

/* ------------------------------------------------------------
   CARD
   ------------------------------------------------------------ */

export interface WhotCard extends WhotQuestion {
  instanceId: string;
}

/* ------------------------------------------------------------
   PLAYER
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
  | { type: "START_GAME" }
  | { type: "SELECT_CARD"; instanceId: string }
  | { type: "SUBMIT_ANSWER"; answerIndex: number }
  | { type: "DRAW_CARD" }
  | { type: "BOT_TURN" }
  | { type: "QUESTION_TIMEOUT" }
  | { type: "RESTART_GAME" }
  | { type: "CONTINUE_AFTER_FEEDBACK" };

/* ------------------------------------------------------------
   GAME CONFIGURATION
   ------------------------------------------------------------ */

export interface WhotGameConfig {
  initialHandSize: number;
  questionTimeLimit: number;
  wrongAnswerPenalty: number;
  drawOnNoMatch: number;
  copiesPerQuestion: number;

  /**
   * Subject IDs or names from the setup page.
   *
   * Examples:
   * ["biology", "chemistry", "physics", "mathematics"]
   * ["commerce", "accounting", "economics", "government"]
   *
   * When omitted or empty, the deck implementation may use
   * the full question bank, depending on its filtering logic.
   */
  selectedSubjects?: string[];
}

export const DEFAULT_WHOT_CONFIG: Readonly<WhotGameConfig> = {
  initialHandSize: 6,
  questionTimeLimit: 15,
  wrongAnswerPenalty: 2,
  drawOnNoMatch: 1,
  copiesPerQuestion: 2,
};

/* ------------------------------------------------------------
   SUBJECT LABELS
   ------------------------------------------------------------ */

export const WHOT_SUBJECT_LABELS: Record<WhotSubject, string> = {
  MATHS: "Mathematics",
  FURTHER_MATHS: "Further Mathematics",
  ENGLISH: "English Language",
  BIOLOGY: "Biology",
  CHEMISTRY: "Chemistry",
  PHYSICS: "Physics",
  AGRICULTURAL_SCIENCE: "Agricultural Science",
  COMPUTER_STUDIES: "Computer Studies",
  COMMERCE: "Commerce",
  ACCOUNTING: "Financial Accounting",
  ECONOMICS: "Economics",
  GOVERNMENT: "Government",
  OFFICE_PRACTICE: "Office Practice",
  BUSINESS_STUDIES: "Business Studies",
  LITERATURE: "Literature in English",
  HISTORY: "History",
  CRS: "Christian Religious Studies",
  IRS: "Islamic Religious Studies",
  FRENCH: "French",
  YORUBA: "Yoruba",
  GENERAL: "General Knowledge",
};

/* ------------------------------------------------------------
   SUBJECT STYLES
   Keep these class names aligned with the game's card styling.
   ------------------------------------------------------------ */

export const WHOT_SUBJECT_STYLES: Record<
  WhotSubject,
  { label: string; className: string }
> = {
  MATHS: {
    label: "Mathematics",
    className: "maths",
  },

  FURTHER_MATHS: {
    label: "Further Mathematics",
    className: "further-maths",
  },

  ENGLISH: {
    label: "English Language",
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

  AGRICULTURAL_SCIENCE: {
    label: "Agricultural Science",
    className: "agricultural-science",
  },

  COMPUTER_STUDIES: {
    label: "Computer Studies",
    className: "computer-studies",
  },

  COMMERCE: {
    label: "Commerce",
    className: "commerce",
  },

  ACCOUNTING: {
    label: "Financial Accounting",
    className: "accounting",
  },

  ECONOMICS: {
    label: "Economics",
    className: "economics",
  },

  GOVERNMENT: {
    label: "Government",
    className: "government",
  },

  OFFICE_PRACTICE: {
    label: "Office Practice",
    className: "office-practice",
  },

  BUSINESS_STUDIES: {
    label: "Business Studies",
    className: "business-studies",
  },

  LITERATURE: {
    label: "Literature in English",
    className: "literature",
  },

  HISTORY: {
    label: "History",
    className: "history",
  },

  CRS: {
    label: "Christian Religious Studies",
    className: "crs",
  },

  IRS: {
    label: "Islamic Religious Studies",
    className: "irs",
  },

  FRENCH: {
    label: "French",
    className: "french",
  },

  YORUBA: {
    label: "Yoruba",
    className: "yoruba",
  },

  GENERAL: {
    label: "General Knowledge",
    className: "general",
  },
};
