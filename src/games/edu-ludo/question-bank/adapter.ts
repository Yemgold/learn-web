



//C:\Users\Lara Spellman\Jamb\jamb-league\src\games\edu-ludo\question-bank\adapter.ts


import type { QuestionBankItem } from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/jamb/questions/types"; 
import type { EduLudoDifficulty,EduLudoLevel } from "../components/eduLudoTypes"; 

export type EduLudoGameQuestion = {
  id: string;
  subject: string;
  level: EduLudoLevel;
  difficulty: EduLudoDifficulty;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type AdaptOptions = {
  subject: string;
  level?: EduLudoLevel;
  idPrefix?: string;
};

function getQuestionText(item: QuestionBankItem): string {
  if (item.question?.trim()) {
    return item.question.trim();
  }

  return item.content
    .flatMap((block) => block.segments ?? [])
    .map((segment) => segment.text)
    .join(" ")
    .trim();
}

function getLevel(
  examType: string,
  fallback?: EduLudoLevel,
): EduLudoLevel {
  const normalized = examType.toLowerCase();

  if (normalized === "jamb") return "JAMB";
  if (normalized === "waec") return "WAEC";

  // Adjust these aliases if your project uses different examType values.
  if (["jss", "junior", "junior_secondary"].includes(normalized)) {
    return "JSS";
  }

  if (["sss", "senior", "senior_secondary"].includes(normalized)) {
    return "SSS";
  }

  return fallback ?? "Custom";
}

export function adaptQuestionBank(
  items: QuestionBankItem[],
  config: AdaptOptions,
): EduLudoGameQuestion[] {
  return items.map((item, index) => {
    const options = item.options.map((option) => option.value);
    const correctValues = new Set(item.correctAnswers);

    const correctAnswer = options.findIndex((value) =>
      correctValues.has(value),
    );

    if (options.length !== 4) {
      throw new Error(
        `Educational Ludo question ${index + 1} must have exactly four options.`,
      );
    }

    if (item.isMultipleAnswer || correctAnswer < 0) {
      throw new Error(
        `Educational Ludo question ${index + 1} must have one correct answer matching an option value.`,
      );
    }

    const content = getQuestionText(item);

    if (!content) {
      throw new Error(
        `Educational Ludo question ${index + 1} has no question text.`,
      );
    }

    return {
      id: `${config.idPrefix ?? config.subject}-${index + 1}`,
      subject: config.subject,
      level: getLevel(item.examType, config.level),
      difficulty: item.difficulty as EduLudoDifficulty,
      content,
      options,
      correctAnswer,
      explanation: item.explanation ?? "",
    };
  });
}
