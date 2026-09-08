






import type { ExamType, QuestionBankItem } from "./types";

// ============================================================
// BIOLOGY — JAMB
// ============================================================

import easyBiologyJambQuestions from "./biology/easy/jamb";
import mediumBiologyJambQuestions from "./biology/medium/jamb";
import hardBiologyJambQuestions from "./biology/hard/jamb";

// ============================================================
// TYPES
// ============================================================

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionBanks = {
  easy: QuestionBankItem[];
  medium: QuestionBankItem[];
  hard: QuestionBankItem[];
};

type QuestionBankMap = Record<
  string,
  Partial<Record<ExamType, QuestionBankItem[]>>
>;

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
// STANDARD QUESTION BANK REGISTRY
// ============================================================
//
// This registry keeps the existing getQuestionBank() behaviour.
//
// Example:
//
// biology
//   └── jamb → simple Biology questions
//
// This is useful anywhere in the application that only needs
// the default/simple question bank.
// ============================================================

const questionBank: QuestionBankMap = {
  biology: {
    jamb: easyBiologyJambQuestions,
  },

  // Add Chemistry when ready:
  //
  // chemistry: {
  //   jamb: jambChemistryQuestions,
  //   waec: waecChemistryQuestions,
  //   neco: necoChemistryQuestions,
  // },

  // Add Physics when ready:
  //
  // physics: {
  //   jamb: jambPhysicsQuestions,
  //   waec: waecPhysicsQuestions,
  //   neco: necoPhysicsQuestions,
  // },
};

// ============================================================
// DIFFICULTY-AWARE QUESTION BANK REGISTRY
// ============================================================
//
// This is the important part for cross-difficulty validation.
//
// Biology JAMB:
//
// simple → 1,400 Easy questions
// medium → 3,000 Medium questions
// hard   → Hard questions
//
// The validator can now compare:
//
// simple ↔ medium
// simple ↔ hard
// medium ↔ hard
// ============================================================

const difficultyQuestionBank: DifficultyBankMap = {
  biology: {
    jamb: {
      easy: easyBiologyJambQuestions,
      medium: mediumBiologyJambQuestions,
      hard: hardBiologyJambQuestions,
    },
  },
};

// ============================================================
// SUBJECT NORMALIZATION
// ============================================================

function normalizeSubjectName(subjectName: string): string {
  return subjectName
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

// ============================================================
// GET SIMPLE / DEFAULT QUESTION BANK
// ============================================================

export function getQuestionBank(
  subjectName: string,
  examType: ExamType,
): QuestionBankItem[] {
  const subjectKey = normalizeSubjectName(subjectName);

  const subjectBank = questionBank[subjectKey];

  if (!subjectBank) {
    return [];
  }

  return subjectBank[examType] ?? [];
}

// ============================================================
// GET ALL DIFFICULTY BANKS
// ============================================================
//
// This is the function the validator should use.
//
// Example:
//
// const banks = getQuestionBanks("Biology", "jamb");
//
// banks.simple
// banks.medium
// banks.hard
// ============================================================

export function getQuestionBanks(
  subjectName: string,
  examType: ExamType,
): QuestionBanks {
  const subjectKey = normalizeSubjectName(subjectName);

  const subjectBank = difficultyQuestionBank[subjectKey];

  if (!subjectBank) {
    return {
      easy: [],
      medium: [],
      hard: [],
    };
  }

  const examBank = subjectBank[examType];

  if (!examBank) {
    return {
      easy: [],
      medium: [],
      hard: [],
    };
  }

  return {
    easy: examBank.easy ?? [],
    medium: examBank.medium ?? [],
    hard: examBank.hard ?? [],
  };
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
  const banks = getQuestionBanks(subjectName, examType);

  return banks[difficulty].length > 0;
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

  return (Object.keys(subjectBank) as ExamType[]).filter(
    (examType) => {
      const examBank = subjectBank[examType];

      if (!examBank) {
        return false;
      }

      return (
        (examBank.easy?.length ?? 0) > 0 ||
        (examBank.medium?.length ?? 0) > 0 ||
        (examBank.hard?.length ?? 0) > 0
      );
    },
  );
}

// ============================================================
// GET ALL REGISTERED SUBJECTS
// ============================================================

export function getQuestionBankSubjects(): string[] {
  return Object.keys(difficultyQuestionBank);
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default questionBank;
