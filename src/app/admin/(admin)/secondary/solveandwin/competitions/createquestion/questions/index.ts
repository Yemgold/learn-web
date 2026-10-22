




import type { ExamType, QuestionBankItem } from "./types";

// ============================================================
// BIOLOGY QUESTION BANKS
// ============================================================

import jambBiologyEasyQuestions from "./biology/easy/jamb";
import jambBiologyMediumQuestions from "./biology/medium/jamb";
import jambBiologyHardQuestions from "./biology/hard/jamb";


import jambChemistryEasyQuestions from "./chemistry/easy/jamb";
import jambChemistryMediumQuestions from "./chemistry/medium/jamb";
import jambChemistryHardQuestions from "./chemistry/hard/jamb";


import jambPhysicsEasyQuestions from "./physics/easy/jamb";
import jambPhysicsMediumQuestions from "./physics/medium/jamb";
import jambPhysicsHardQuestions from "./physics/hard/jamb";


import jambMathematicsEasyQuestions from "./mathematics/easy/jamb";
import jambMathematicsMediumQuestions from "./mathematics/medium/jamb";
import jambMathematicsHardQuestions from "./mathematics/hard/jamb";

// ============================================================
// TYPES
// ============================================================

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionBanks = {
  easy: QuestionBankItem[];
  medium: QuestionBankItem[];
  hard: QuestionBankItem[];
};

type DifficultyBankMap = Record<
  string,
  Partial<
    Record<
      ExamType,
      Partial<Record<QuestionDifficulty, QuestionBankItem[]>>
    >
  >
>;

// ============================================================
// DIFFICULTY-AWARE QUESTION BANK REGISTRY
// ============================================================

const difficultyQuestionBank: DifficultyBankMap = {
  biology: {
    jamb: {
      easy: jambBiologyEasyQuestions,
      medium: jambBiologyMediumQuestions,
      hard: jambBiologyHardQuestions,
    },
  },

  chemistry: {
    jamb: {
      easy: jambChemistryEasyQuestions,
      medium: jambChemistryMediumQuestions,
      hard: jambChemistryHardQuestions,
    },
  },

  physics: {
    jamb: {
      easy: jambPhysicsEasyQuestions,
      medium: jambPhysicsMediumQuestions,
      hard: jambPhysicsHardQuestions,
    },
  },

  mathematics: {
    jamb: {
      easy: jambMathematicsEasyQuestions,
      medium: jambMathematicsMediumQuestions,
      hard: jambMathematicsHardQuestions,
    },
  },
};

// ============================================================
// SUBJECT NORMALIZATION
// Supports names such as:
// "Biology", "biology", "English & Mathematics"
// ============================================================

function normalizeSubjectName(subjectName: string): string {
  return subjectName
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

// ============================================================
// GET ALL DIFFICULTY BANKS
// ============================================================

export function getQuestionBanks(
  subjectName: string,
  examType: ExamType,
): QuestionBanks {
  const subjectKey = normalizeSubjectName(subjectName);
  const examBank = difficultyQuestionBank[subjectKey]?.[examType];

  return {
    easy: examBank?.easy ?? [],
    medium: examBank?.medium ?? [],
    hard: examBank?.hard ?? [],
  };
}

// ============================================================
// GET SIMPLE / DEFAULT QUESTION BANK
// Defaults to the easy bank for backward compatibility.
// ============================================================

export function getQuestionBank(
  subjectName: string,
  examType: ExamType,
): QuestionBankItem[] {
  return getQuestionBanks(subjectName, examType).easy;
}

// ============================================================
// CHECK WHETHER ANY QUESTION BANK EXISTS
// ============================================================

export function hasQuestionBank(
  subjectName: string,
  examType: ExamType,
): boolean {
  const banks = getQuestionBanks(subjectName, examType);

  return (
    banks.easy.length > 0 ||
    banks.medium.length > 0 ||
    banks.hard.length > 0
  );
}

// ============================================================
// CHECK WHETHER A SPECIFIC DIFFICULTY BANK EXISTS
// ============================================================

export function hasQuestionBankForDifficulty(
  subjectName: string,
  examType: ExamType,
  difficulty: QuestionDifficulty,
): boolean {
  return getQuestionBanks(subjectName, examType)[difficulty].length > 0;
}

// ============================================================
// GET AVAILABLE DIFFICULTIES
// ============================================================

export function getAvailableDifficulties(
  subjectName: string,
  examType: ExamType,
): QuestionDifficulty[] {
  const banks = getQuestionBanks(subjectName, examType);

  const difficulties: QuestionDifficulty[] = [
    "easy",
    "medium",
    "hard",
  ];

  return difficulties.filter(
    (difficulty) => banks[difficulty].length > 0,
  );
}

// ============================================================
// GET AVAILABLE EXAM TYPES FOR A SUBJECT
// ============================================================

export function getAvailableExamTypes(
  subjectName: string,
): ExamType[] {
  const subjectKey = normalizeSubjectName(subjectName);
  const subjectBank = difficultyQuestionBank[subjectKey];

  if (!subjectBank) {
    return [];
  }

  return (Object.keys(subjectBank) as ExamType[]).filter((examType) => {
    const examBank = subjectBank[examType];

    return Boolean(
      (examBank?.easy?.length ?? 0) > 0 ||
        (examBank?.medium?.length ?? 0) > 0 ||
        (examBank?.hard?.length ?? 0) > 0,
    );
  });
}

// ============================================================
// GET ALL REGISTERED SUBJECTS
// ============================================================

export function getQuestionBankSubjects(): string[] {
  return Object.keys(difficultyQuestionBank);
}

// ============================================================
// DEFAULT EXPORT
// Preserves the original default export shape.
// ============================================================

const questionBank: Record<
  string,
  Partial<Record<ExamType, QuestionBankItem[]>>
> = {};

for (const [subject, exams] of Object.entries(difficultyQuestionBank)) {
  questionBank[subject] = {};

  for (const [examType, banks] of Object.entries(exams)) {
    questionBank[subject][examType as ExamType] = banks?.easy ?? [];
  }
}

export default questionBank;
