

//src\games\edu-ludo\components\eduLudoConstants.ts


import type {
  EduLudoColor,
  EduLudoCoordinate,
  EduLudoDifficulty,
  EduLudoLevel,
  EduLudoQuestion,
  EduLudoSubject,
} from "./eduLudoTypes";

/* =========================================================
   GAME SETTINGS
========================================================= */

export const QUESTION_COST = 2;
export const QUESTION_TIME_LIMIT = 15;

export const INITIAL_WALLET_BALANCE = 500;
export const INITIAL_CBT_POINTS = 0;

export const TOKENS_PER_PLAYER = 4;
export const MAX_PLAYERS = 4;

export const ENTRY_FEE = 100;

export const CAPTURE_REWARD = 200;
export const TOKEN_HOME_REWARD = 500;
export const WINNER_REWARD = 1000;

export const EXTRA_TURN_ON_SIX = true;
export const EXTRA_TURN_ON_CAPTURE = true;

/* =========================================================
   PLAYER COLORS
========================================================= */

export const LUDO_COLORS: EduLudoColor[] = [
  "red",
  "green",
  "yellow",
  "blue",
];

export const COLOR_STYLES: Record<
  EduLudoColor,
  {
    name: string;
    bg: string;
    text: string;
    border: string;
    ring: string;
    hex: string;
  }
> = {
  red: {
    name: "Red",
    bg: "bg-red-500",
    text: "text-red-700",
    border: "border-red-500",
    ring: "ring-red-400",
    hex: "#ef4444",
  },
  green: {
    name: "Green",
    bg: "bg-green-500",
    text: "text-green-700",
    border: "border-green-500",
    ring: "ring-green-400",
    hex: "#22c55e",
  },
  yellow: {
    name: "Yellow",
    bg: "bg-yellow-400",
    text: "text-yellow-800",
    border: "border-yellow-400",
    ring: "ring-yellow-300",
    hex: "#facc15",
  },
  blue: {
    name: "Blue",
    bg: "bg-blue-500",
    text: "text-blue-700",
    border: "border-blue-500",
    ring: "ring-blue-400",
    hex: "#3b82f6",
  },
};

/* =========================================================
   SUBJECTS AND LEVELS
========================================================= */

export const EDU_LUDO_SUBJECTS: EduLudoSubject[] = [
  "All Subjects",
  "Mathematics",
  "English",
  "Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Custom",
];

export const EDU_LUDO_LEVELS: EduLudoLevel[] = [
  "JSS",
  "SSS",
  "JAMB",
  "WAEC",
  "Custom",
];

export const EDU_LUDO_DIFFICULTIES: EduLudoDifficulty[] = [
  "easy",
  "medium",
  "hard",
];

/* =========================================================
   LUDO TRACK
   The board is a 15 x 15 grid.
   Track positions run from 0 to 51.
========================================================= */

export const BOARD_SIZE = 15;
export const TRACK_LENGTH = 52;
export const HOME_POSITION = 57;

export const TRACK_COORDINATES: EduLudoCoordinate[] = [
  { row: 6, col: 1 },
  { row: 6, col: 2 },
  { row: 6, col: 3 },
  { row: 6, col: 4 },
  { row: 6, col: 5 },
  { row: 5, col: 6 },
  { row: 4, col: 6 },
  { row: 3, col: 6 },
  { row: 2, col: 6 },
  { row: 1, col: 6 },
  { row: 0, col: 6 },
  { row: 0, col: 7 },
  { row: 0, col: 8 },
  { row: 1, col: 8 },
  { row: 2, col: 8 },
  { row: 3, col: 8 },
  { row: 4, col: 8 },
  { row: 5, col: 8 },
  { row: 6, col: 9 },
  { row: 6, col: 10 },
  { row: 6, col: 11 },
  { row: 6, col: 12 },
  { row: 6, col: 13 },
  { row: 6, col: 14 },
  { row: 7, col: 14 },
  { row: 8, col: 14 },
  { row: 8, col: 13 },
  { row: 8, col: 12 },
  { row: 8, col: 11 },
  { row: 8, col: 10 },
  { row: 8, col: 9 },
  { row: 9, col: 8 },
  { row: 10, col: 8 },
  { row: 11, col: 8 },
  { row: 12, col: 8 },
  { row: 13, col: 8 },
  { row: 14, col: 8 },
  { row: 14, col: 7 },
  { row: 14, col: 6 },
  { row: 13, col: 6 },
  { row: 12, col: 6 },
  { row: 11, col: 6 },
  { row: 10, col: 6 },
  { row: 9, col: 6 },
  { row: 8, col: 5 },
  { row: 8, col: 4 },
  { row: 8, col: 3 },
  { row: 8, col: 2 },
  { row: 8, col: 1 },
  { row: 8, col: 0 },
  { row: 7, col: 0 },
  { row: 6, col: 0 },
];

/* =========================================================
   PLAYER START POSITIONS
========================================================= */

export const START_POSITIONS: Record<EduLudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 39,
  blue: 26,
};

/**
 * Offsets used to convert a player's local track position
 * into a shared board track position.
 */
export const PLAYER_TRACK_OFFSETS: Record<EduLudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 39,
  blue: 26,
};

/* =========================================================
   HOME LANES
========================================================= */

export const HOME_LANES: Record<
  EduLudoColor,
  EduLudoCoordinate[]
> = {
  red: [
    { row: 7, col: 1 },
    { row: 7, col: 2 },
    { row: 7, col: 3 },
    { row: 7, col: 4 },
    { row: 7, col: 5 },
    { row: 7, col: 6 },
  ],
  green: [
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
    { row: 4, col: 7 },
    { row: 5, col: 7 },
    { row: 6, col: 7 },
  ],
  yellow: [
    { row: 7, col: 13 },
    { row: 7, col: 12 },
    { row: 7, col: 11 },
    { row: 7, col: 10 },
    { row: 7, col: 9 },
    { row: 7, col: 8 },
  ],
  blue: [
    { row: 13, col: 7 },
    { row: 12, col: 7 },
    { row: 11, col: 7 },
    { row: 10, col: 7 },
    { row: 9, col: 7 },
    { row: 8, col: 7 },
  ],
};

/* =========================================================
   TOKEN BASE COORDINATES
========================================================= */

export const TOKEN_BASES: Record<
  EduLudoColor,
  EduLudoCoordinate[]
> = {
  red: [
    { row: 1, col: 1 },
    { row: 1, col: 4 },
    { row: 4, col: 1 },
    { row: 4, col: 4 },
  ],
  green: [
    { row: 1, col: 10 },
    { row: 1, col: 13 },
    { row: 4, col: 10 },
    { row: 4, col: 13 },
  ],
  yellow: [
    { row: 10, col: 10 },
    { row: 10, col: 13 },
    { row: 13, col: 10 },
    { row: 13, col: 13 },
  ],
  blue: [
    { row: 10, col: 1 },
    { row: 10, col: 4 },
    { row: 13, col: 1 },
    { row: 13, col: 4 },
  ],
};

/* =========================================================
   SAFE TRACK SQUARES
========================================================= */

export const SAFE_TRACK_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

export const SAFE_POSITIONS = new Set<number>(
  SAFE_TRACK_POSITIONS,
);

/* =========================================================
   REWARD SETTINGS
========================================================= */

export const REWARD_POINTS = {
  capture: CAPTURE_REWARD,
  tokenHome: TOKEN_HOME_REWARD,
  winner: WINNER_REWARD,
} as const;

/* =========================================================
   SAMPLE QUESTIONS
   These are local prototype questions.
   Replace with API-loaded questions when the backend is ready.
========================================================= */

export const SAMPLE_QUESTIONS: EduLudoQuestion[] = [
  {
    id: "math-jss-001",
    subject: "Mathematics",
    level: "JSS",
    difficulty: "easy",
    content: "What is 12 + 8?",
    options: ["18", "20", "22", "24"],
    correctAnswer: 1,
    explanation: "12 + 8 = 20.",
  },
  {
    id: "math-jss-002",
    subject: "Mathematics",
    level: "JSS",
    difficulty: "easy",
    content: "What is 7 × 6?",
    options: ["36", "40", "42", "48"],
    correctAnswer: 2,
    explanation: "7 multiplied by 6 equals 42.",
  },
  {
    id: "math-sss-001",
    subject: "Mathematics",
    level: "SSS",
    difficulty: "medium",
    content: "Solve for x: 2x + 6 = 16.",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    explanation: "Subtract 6 to get 2x = 10, then divide by 2.",
  },
  {
    id: "math-jamb-001",
    subject: "Mathematics",
    level: "JAMB",
    difficulty: "medium",
    content: "If f(x) = 2x² − 3, find f(2).",
    options: ["3", "5", "7", "8"],
    correctAnswer: 2,
    explanation: "f(2) = 2(2²) − 3 = 8 − 3 = 5.",
  },
  {
    id: "english-jss-001",
    subject: "English",
    level: "JSS",
    difficulty: "easy",
    content: "Choose the plural form of 'child'.",
    options: ["Childs", "Children", "Childes", "Childrens"],
    correctAnswer: 1,
    explanation: "The plural form of child is children.",
  },
  {
    id: "english-sss-001",
    subject: "English",
    level: "SSS",
    difficulty: "medium",
    content: "Choose the word closest in meaning to 'diligent'.",
    options: ["Careless", "Hardworking", "Lazy", "Impatient"],
    correctAnswer: 1,
    explanation: "Diligent means careful and hardworking.",
  },
  {
    id: "science-jss-001",
    subject: "Science",
    level: "JSS",
    difficulty: "easy",
    content: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctAnswer: 1,
    explanation: "Mars appears reddish because of iron oxide on its surface.",
  },
  {
    id: "biology-sss-001",
    subject: "Biology",
    level: "SSS",
    difficulty: "medium",
    content: "Which organelle is primarily responsible for photosynthesis?",
    options: [
      "Mitochondrion",
      "Nucleus",
      "Chloroplast",
      "Ribosome",
    ],
    correctAnswer: 2,
    explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis.",
  },
  {
    id: "chemistry-jamb-001",
    subject: "Chemistry",
    level: "JAMB",
    difficulty: "medium",
    content: "What is the chemical symbol for sodium?",
    options: ["S", "So", "Na", "N"],
    correctAnswer: 2,
    explanation: "The chemical symbol for sodium is Na.",
  },
  {
    id: "physics-sss-001",
    subject: "Physics",
    level: "SSS",
    difficulty: "medium",
    content: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    correctAnswer: 2,
    explanation: "Force is measured in newtons (N).",
  },
];

/* =========================================================
   QUESTION HELPERS
========================================================= */

/**
 * Returns questions matching the chosen subject and level.
 * "All Subjects" allows questions from every subject.
 * "Custom" currently behaves as an unrestricted selection.
 */
export function getEduLudoQuestions(
  subject: EduLudoSubject,
  level: EduLudoLevel,
): EduLudoQuestion[] {
  return SAMPLE_QUESTIONS.filter((question) => {
    const matchesSubject =
      subject === "All Subjects" ||
      subject === "Custom" ||
      question.subject === subject;

    const matchesLevel =
      level === "Custom" || question.level === level;

    return matchesSubject && matchesLevel;
  });
}

/**
 * Returns the visual coordinates for a token in its home lane.
 */
export function getHomeLaneCoordinate(
  color: EduLudoColor,
  lanePosition: number,
): EduLudoCoordinate | undefined {
  const lane = HOME_LANES[color];
  return lane[lanePosition];
}

/**
 * Returns the base coordinate for a player's token.
 */
export function getTokenBaseCoordinate(
  color: EduLudoColor,
  tokenId: number,
): EduLudoCoordinate | undefined {
  return TOKEN_BASES[color][tokenId];
}

/**
 * Converts a player's local track position into a shared track index.
 */
export function getGlobalTrackPosition(
  color: EduLudoColor,
  localPosition: number,
): number {
  return (
    (localPosition + PLAYER_TRACK_OFFSETS[color]) %
    TRACK_LENGTH
  );
}
