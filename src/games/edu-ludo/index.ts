





// src/games/edu-ludo/index.ts

import {
  getQuestionBanks,
  type QuestionDifficulty,
} from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/jamb/questions";

import type { EduLudoGameQuestion} from "./question-bank/adapter";
import type { EduLudoLevel,EduLudoSubject } from "./components/eduLudoTypes"; 
const SUBJECTS = [
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Economics",
  "Accounting",
] as const;

type BankSubject = (typeof SUBJECTS)[number];

const DIFFICULTIES: QuestionDifficulty[] = [
  "easy",
  "medium",
  "hard",
];

function normalizeLevel(level: string): EduLudoLevel {
  const normalized = level.toLowerCase();

  if (normalized === "waec") return "WAEC";
  if (normalized === "jss") return "JSS";
  if (normalized === "sss") return "SSS";
  

  return "JAMB";
}

function convertQuestion(
  item: {
    question: string;
    content: {
      segments: { text: string }[];
    }[];
    options: { label: string; value: string }[];
    correctAnswers: string[];
    explanation?: string;
    topic?: string;
    difficulty: string;
    examType?: string;
    isMultipleAnswer: boolean;
  },
  subject: BankSubject,
  difficulty: QuestionDifficulty,
  index: number,
): EduLudoGameQuestion | null {
  if (item.isMultipleAnswer || item.options.length !== 4) {
    return null;
  }

  const questionText =
    item.question?.trim() ||
    item.content
      ?.flatMap((block) => block.segments ?? [])
      .map((segment) => segment.text)
      .join(" ")
      .trim();

  if (!questionText) return null;

  const options = item.options.map((option) => option.value);
  const correctValue = item.correctAnswers?.[0];
  const correctAnswer = options.findIndex(
    (option) => option === correctValue,
  );

  if (correctAnswer < 0) return null;

  return {
    id: `edu-ludo-${subject.toLowerCase()}-${difficulty}-${index}`,
    subject,
    level: normalizeLevel(item.examType ?? "jamb"),
    difficulty,
    content: questionText,
    options,
    correctAnswer,
    explanation: item.explanation ?? "",
    
  };
}

function buildSubjectBank(
  subject: BankSubject,
): EduLudoGameQuestion[] {
  const banks = getQuestionBanks(subject, "jamb");

  return DIFFICULTIES.flatMap((difficulty) =>
    banks[difficulty]
      .map((item, index) =>
        convertQuestion(item, subject, difficulty, index),
      )
      .filter(
        (item): item is EduLudoGameQuestion => item !== null,
      ),
  );
}

export const EDU_LUDO_QUESTION_BANK: EduLudoGameQuestion[] =
  SUBJECTS.flatMap(buildSubjectBank);

export function getEduLudoQuestions(options?: {
  subject?: EduLudoSubject | string;
  level?: EduLudoLevel;
  difficulty?: QuestionDifficulty;
  excludeIds?: string[];
}): EduLudoGameQuestion[] {
  const excluded = new Set(options?.excludeIds ?? []);

  return EDU_LUDO_QUESTION_BANK.filter((question) => {
    if (excluded.has(question.id)) return false;

    if (
      options?.subject &&
      options.subject !== "All Subjects" &&
      options.subject !== "Custom" &&
      question.subject.toLowerCase() !== options.subject.toLowerCase()
    ) {
      return false;
    }

    if (options?.level && question.level !== options.level) {
      return false;
    }

    if (
      options?.difficulty &&
      question.difficulty !== options.difficulty
    ) {
      return false;
    }

    return true;
  });
}

export function getRandomEduLudoQuestion(
  options?: Parameters<typeof getEduLudoQuestions>[0],
): EduLudoGameQuestion | null {
  const questions = getEduLudoQuestions(options);

  if (questions.length === 0) return null;

  return questions[Math.floor(Math.random() * questions.length)];
}
