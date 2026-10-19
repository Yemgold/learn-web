




/**
 * Learnyfi Educational Ludo
 * Question bank and question-selection utilities.
 *
 * This module does not use React state and does not charge the wallet.
 * Wallet charging and answer processing remain in the game logic.
 */

export type LudoSubject =
  | "Mathematics"
  | "English"
  | "Science"
  | "Biology"
  | "Chemistry"
  | "Physics";

export type LudoDifficulty = "easy" | "medium" | "hard";

export interface LudoQuestion {
  id: string;
  subject: LudoSubject;
  difficulty: LudoDifficulty;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
}

export type LudoSubjectFilter = LudoSubject | "All Subjects";

export const LUDO_QUESTION_BANK: LudoQuestion[] = [
  // MATHEMATICS
  {
    id: "math-001",
    subject: "Mathematics",
    difficulty: "easy",
    question: "What is 12 × 8?",
    options: ["86", "96", "88", "108"],
    correctAnswer: 1,
    explanation: "12 multiplied by 8 equals 96.",
  },
  {
    id: "math-002",
    subject: "Mathematics",
    difficulty: "medium",
    question: "Solve for x: 3x + 5 = 20.",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    explanation: "Subtract 5 from both sides to get 3x = 15. Divide by 3, so x = 5.",
  },
  {
    id: "math-003",
    subject: "Mathematics",
    difficulty: "hard",
    question: "What is the value of 2³ × 3²?",
    options: ["36", "54", "72", "81"],
    correctAnswer: 2,
    explanation: "2³ = 8 and 3² = 9. Therefore, 8 × 9 = 72.",
  },

  // ENGLISH
  {
    id: "eng-001",
    subject: "English",
    difficulty: "easy",
    question: "Choose the correctly spelt word.",
    options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"],
    correctAnswer: 1,
    explanation: "Accommodation is spelt with two c's and two m's.",
  },
  {
    id: "eng-002",
    subject: "English",
    difficulty: "medium",
    question: "Which word is closest in meaning to 'diligent'?",
    options: ["Careless", "Hardworking", "Impatient", "Uncertain"],
    correctAnswer: 1,
    explanation: "Diligent means showing care and consistent effort in one's work.",
  },

  // GENERAL SCIENCE
  {
    id: "sci-001",
    subject: "Science",
    difficulty: "easy",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Mercury"],
    correctAnswer: 2,
    explanation: "Mars appears reddish because of iron oxide on its surface.",
  },

  // BIOLOGY
  {
    id: "bio-001",
    subject: "Biology",
    difficulty: "medium",
    question: "Which organelle is primarily responsible for producing ATP during aerobic respiration?",
    options: ["Ribosome", "Mitochondrion", "Golgi apparatus", "Lysosome"],
    correctAnswer: 1,
    explanation: "Mitochondria are the main sites of ATP production during aerobic respiration.",
  },

  // CHEMISTRY
  {
    id: "chem-001",
    subject: "Chemistry",
    difficulty: "medium",
    question: "What is the chemical symbol for sodium?",
    options: ["S", "So", "Na", "N"],
    correctAnswer: 2,
    explanation: "The chemical symbol for sodium is Na, derived from the Latin name natrium.",
  },

  // PHYSICS
  {
    id: "phy-001",
    subject: "Physics",
    difficulty: "medium",
    question: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Pascal", "Newton"],
    correctAnswer: 3,
    explanation: "Force is measured in newtons (N) in the SI system.",
  },
];

/**
 * Returns questions matching the requested subject and difficulty.
 *
 * Passing "All Subjects" disables subject filtering.
 */
export function getLudoQuestions(
  subject: LudoSubjectFilter = "All Subjects",
  difficulty?: LudoDifficulty,
): LudoQuestion[] {
  return LUDO_QUESTION_BANK.filter((question) => {
    const matchesSubject =
      subject === "All Subjects" || question.subject === subject;

    const matchesDifficulty =
      difficulty === undefined || question.difficulty === difficulty;

    return matchesSubject && matchesDifficulty;
  });
}

/**
 * Selects a random question from the supplied collection.
 *
 * Returns null when no questions are available.
 *
 * `excludeIds` can be used to reduce repeated questions within a match.
 * If every question has been seen, selection falls back to the full
 * filtered collection so the game can continue.
 */
export function getRandomLudoQuestion(
  subject: LudoSubjectFilter = "All Subjects",
  difficulty?: LudoDifficulty,
  excludeIds: readonly string[] = [],
): LudoQuestion | null {
  const questions = getLudoQuestions(subject, difficulty);

  if (questions.length === 0) {
    return null;
  }

  const excluded = new Set(excludeIds);
  const unseenQuestions = questions.filter(
    (question) => !excluded.has(question.id),
  );

  const availableQuestions =
    unseenQuestions.length > 0 ? unseenQuestions : questions;

  const index = Math.floor(Math.random() * availableQuestions.length);

  return availableQuestions[index] ?? null;
}

/**
 * Returns the number of questions matching the given filters.
 */
export function countLudoQuestions(
  subject: LudoSubjectFilter = "All Subjects",
  difficulty?: LudoDifficulty,
): number {
  return getLudoQuestions(subject, difficulty).length;
}

/**
 * Returns the available subject names for the lobby.
 */
export function getLudoSubjects(): LudoSubject[] {
  return [
    "Mathematics",
    "English",
    "Science",
    "Biology",
    "Chemistry",
    "Physics",
  ];
}

/**
 * Returns a fresh copy of the question bank.
 * Useful if a caller needs to sort or shuffle without mutating the original.
 */
export function getLudoQuestionBank(): LudoQuestion[] {
  return LUDO_QUESTION_BANK.map((question) => ({
    ...question,
    options: [...question.options] as LudoQuestion["options"],
  }));
}
