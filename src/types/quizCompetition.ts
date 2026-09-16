




// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\quizCompetition.ts

export type Subject = {
  _id: string;
  name?: string;
  code?: string;
};

export type DifficultyBreakdown = {
  easy: number;
  medium: number;
  hard: number;
};

export type EliminationRound = {
  round_number: number;
  no_of_questions: number;
  difficultyBreakdown: DifficultyBreakdown;
  exit_number: number;
  exit_reward: number;
};

export type FinalRound = {
  no_of_questions: number;
  difficultyBreakdown: DifficultyBreakdown;
};

export type FormState = {
  quiz_title: string;
  description: string;
  subject: string;
  time_per_question: number;
  start_date: string;
  no_of_contestants: number;
  number_of_rounds: number;
  status: string;
  first_position_reward: number;
  second_position_reward: number;
};

export type QuizPreset = {
  title: string;
  description: string;
};

export type CreateQuizCompetitionPayload = {
  quiz_title: string;
  description: string;
  subject: string;
  time_per_question: number;
  start_date: string;
  no_of_contestants: number;
  number_of_rounds: number;
  status: string;

  round_information: {
    round_number: number;
    no_of_questions: number;
    difficultyBreakdown: DifficultyBreakdown;
    exit_number: number;
    exit_reward: number;
  }[];

  final_round_information: {
    no_of_questions: number;
    difficultyBreakdown: DifficultyBreakdown;
    first_position_reward: number;
    second_position_reward: number;
  };
};

export type CreateQuizCompetitionResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};