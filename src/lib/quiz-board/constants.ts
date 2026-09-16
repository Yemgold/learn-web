




// src/lib/quiz-board/constants.ts

import type {
  Difficulty,
  DisplayStatus,
  QuizBoardFilters,
} from "@/lib/quiz-board/types";

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_DEFAULT_PAGE = 1;

export const QUIZ_BOARD_DEFAULT_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/* Quiz Board routes                                                          */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_BASE_PATH =
  "/student/quiz-board";

export const getQuizBoardPath = (
  quizId: string,
): string => {
  return `${QUIZ_BOARD_BASE_PATH}/${quizId}`;
};

export const getQuizBoardWatchPath = (
  quizId: string,
): string => {
  return `${QUIZ_BOARD_BASE_PATH}/${quizId}/watch`;
};

/* -------------------------------------------------------------------------- */
/* Status filters                                                             */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_STATUS_OPTIONS: Array<{
  value: DisplayStatus | "ALL";
  label: string;
}> = [
  {
    value: "ALL",
    label: "All Status",
  },
  {
    value: "OPEN",
    label: "Open",
  },
  {
    value: "UPCOMING",
    label: "Upcoming",
  },
  {
    value: "LIVE",
    label: "Live",
  },
  {
    value: "FULL",
    label: "Full",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

/* -------------------------------------------------------------------------- */
/* Difficulty filters                                                         */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_DIFFICULTY_OPTIONS: Array<{
  value: Difficulty | "ALL";
  label: string;
}> = [
  {
    value: "ALL",
    label: "All Difficulty",
  },
  {
    value: "EASY",
    label: "Easy",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HARD",
    label: "Hard",
  },
  {
    value: "MIXED",
    label: "Mixed",
  },
];

/* -------------------------------------------------------------------------- */
/* Default filters                                                            */
/* -------------------------------------------------------------------------- */

export const DEFAULT_QUIZ_BOARD_FILTERS: QuizBoardFilters = {
  searchQuery: "",
  statusFilter: "ALL",
  difficultyFilter: "ALL",
  subjectFilter: "",
};

/* -------------------------------------------------------------------------- */
/* Competition configuration                                                  */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_DEFAULT_TIME_PER_QUESTION = 20;

export const QUIZ_BOARD_DEFAULT_CONTESTANTS = 20;

export const QUIZ_BOARD_DEFAULT_ROUNDS = 5;

/**
 * Qualification sequence for the Quiz Board.
 *
 * 20 contestants
 * → 15
 * → 10
 * → 5
 * → 2
 * → 1 winner
 */
export const QUIZ_BOARD_QUALIFICATION_SEQUENCE = [
  20,
  15,
  10,
  5,
  2,
  1,
] as const;

/* -------------------------------------------------------------------------- */
/* Default rewards                                                            */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_DEFAULT_FIRST_REWARD = 100;

export const QUIZ_BOARD_DEFAULT_SECOND_REWARD = 50;

/* -------------------------------------------------------------------------- */
/* Default round configuration                                                */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_DEFAULT_ELIMINATION_QUESTIONS = 10;

export const QUIZ_BOARD_DEFAULT_EASY_QUESTIONS = 4;

export const QUIZ_BOARD_DEFAULT_MEDIUM_QUESTIONS = 4;

export const QUIZ_BOARD_DEFAULT_HARD_QUESTIONS = 2;

export const QUIZ_BOARD_DEFAULT_EXIT_NUMBER = 5;

export const QUIZ_BOARD_DEFAULT_EXIT_REWARD = 5;

/* -------------------------------------------------------------------------- */
/* Default final round configuration                                          */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_DEFAULT_FINAL_QUESTIONS = 10;

export const QUIZ_BOARD_DEFAULT_FINAL_EASY_QUESTIONS = 2;

export const QUIZ_BOARD_DEFAULT_FINAL_MEDIUM_QUESTIONS = 3;

export const QUIZ_BOARD_DEFAULT_FINAL_HARD_QUESTIONS = 5;

/* -------------------------------------------------------------------------- */
/* Display                                                                     */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_PAGE_TITLE =
  "Quiz Board";

export const QUIZ_BOARD_PAGE_DESCRIPTION =
  "Compete against other students in fast-paced JAMB quiz competitions.";

export const QUIZ_BOARD_MY_COMPETITIONS_TITLE =
  "My Competitions";

export const QUIZ_BOARD_MY_COMPETITIONS_DESCRIPTION =
  "Competitions you have joined or participated in.";

/* -------------------------------------------------------------------------- */
/* Empty states                                                               */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_EMPTY_TITLE =
  "No competitions found";

export const QUIZ_BOARD_EMPTY_DESCRIPTION =
  "There are no quiz competitions matching your current filters.";

export const QUIZ_BOARD_MY_EMPTY_TITLE =
  "No competitions yet";

export const QUIZ_BOARD_MY_EMPTY_DESCRIPTION =
  "You have not joined any quiz competitions yet.";

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_SEARCH_PLACEHOLDER =
  "Search competitions, subjects...";

/* -------------------------------------------------------------------------- */
/* Local storage                                                              */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_USER_STORAGE_KEYS = [
  "user",
  "auth-user",
  "jamb_user",
  "jamb_auth_user",
] as const;

/* -------------------------------------------------------------------------- */
/* API defaults                                                               */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_API_PAGE = 1;

export const QUIZ_BOARD_API_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/* Subject display                                                            */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_SUBJECT_ICONS: Record<
  string,
  string
> = {
  Biology: "🧬",
  Chemistry: "⚗️",
  Physics: "⚛️",
  Mathematics: "📐",
  English: "📖",
  "Use of English": "📖",
  "Agricultural Science": "🌱",
  Economics: "📊",
  Government: "🏛️",
  Literature: "📚",
  Geography: "🌍",
  CRS: "✝️",
  IRS: "☪️",
};

/* -------------------------------------------------------------------------- */
/* How Quiz Board works                                                       */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Join the Lobby",
    description:
      "Enter an available competition and wait for the required contestants.",
  },
  {
    step: 2,
    title: "Answer Questions",
    description:
      "Answer each question as quickly and accurately as possible.",
  },
  {
    step: 3,
    title: "Qualify",
    description:
      "The fastest correct contestants progress through the elimination rounds.",
  },
  {
    step: 4,
    title: "Reach the Final",
    description:
      "The final contestants compete in the last round for the available rewards.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Status ordering                                                            */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_STATUS_ORDER: DisplayStatus[] = [
  "LIVE",
  "OPEN",
  "UPCOMING",
  "FULL",
  "COMPLETED",
];

/* -------------------------------------------------------------------------- */
/* Difficulty ordering                                                        */
/* -------------------------------------------------------------------------- */

export const QUIZ_BOARD_DIFFICULTY_ORDER: Difficulty[] = [
  "EASY",
  "MEDIUM",
  "HARD",
  "MIXED",
];