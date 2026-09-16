




// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quizCompetition\constants.ts

import type {
  DifficultyBreakdown,
  FormState,
} from "@/types/quizCompetition";

export const DEFAULT_FORM: FormState = {
  quiz_title: "",
  description: "",
  subject: "",
  time_per_question: 20,
  start_date: "",
  no_of_contestants: 20,
  number_of_rounds: 5,
  status: "DRAFT",
  first_position_reward: 100,
  second_position_reward: 50,
};

export const DEFAULT_DIFFICULTY: DifficultyBreakdown = {
  easy: 0,
  medium: 0,
  hard: 0,
};

export const QUIZ_PRESET_TEMPLATES = [
  {
    title: "{subject} JAMB League Championship",
    description:
      "A competitive {subject} quiz designed to test students' knowledge, speed, accuracy, and ability to perform under pressure.",
  },

  {
    title: "{subject} JAMB League Elimination Challenge",
    description:
      "An elimination-based {subject} competition where students compete through multiple rounds to qualify for the final championship round.",
  },

  {
    title: "{subject} JAMB League Academic Challenge",
    description:
      "A structured {subject} academic competition designed to challenge students with questions of varying difficulty across multiple rounds.",
  },

  {
    title: "{subject} JAMB League Masters Challenge",
    description:
      "An advanced {subject} competition for students who want to demonstrate strong subject knowledge, quick thinking, and consistent performance.",
  },
];