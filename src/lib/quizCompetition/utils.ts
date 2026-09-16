




// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quizCompetition\utils.ts

import {
  DEFAULT_DIFFICULTY,
  QUIZ_PRESET_TEMPLATES,
} from "./constants";

import type {
  DifficultyBreakdown,
  EliminationRound,
  FinalRound,
  QuizPreset,
} from "@/types/quizCompetition";

export function createQuizPresets(
  subjectName: string,
): QuizPreset[] {
  if (!subjectName) {
    return [];
  }

  return QUIZ_PRESET_TEMPLATES.map((template) => ({
    title: template.title.replace(
      "{subject}",
      subjectName,
    ),

    description: template.description.replace(
      "{subject}",
      subjectName,
    ),
  }));
}

export function createEliminationRound(
  roundNumber: number,
): EliminationRound {
  return {
    round_number: roundNumber,

    no_of_questions: 10,

    difficultyBreakdown: {
      easy: 4,
      medium: 4,
      hard: 2,
    },

    exit_number: 5,

    exit_reward: roundNumber * 5,
  };
}

export function createFinalRound(): FinalRound {
  return {
    no_of_questions: 10,

    difficultyBreakdown: {
      ...DEFAULT_DIFFICULTY,

      easy: 2,
      medium: 3,
      hard: 5,
    },
  };
}

export function getDifficultyTotal(
  difficulty: DifficultyBreakdown,
): number {
  return (
    Number(difficulty.easy || 0) +
    Number(difficulty.medium || 0) +
    Number(difficulty.hard || 0)
  );
}

export function formatDateTimeLocal(
  value: string,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}