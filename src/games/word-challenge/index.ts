





/**
 * Learnyfi Word Challenge
 *
 * Public entry point for the Word Challenge module.
 */

/* -------------------------------------------------------------------------- */
/* Main game                                                                  */
/* -------------------------------------------------------------------------- */

export { default as WordChallengeGame } from "./components/WordChallengeGame";

/* -------------------------------------------------------------------------- */
/* Game data                                                                  */
/* -------------------------------------------------------------------------- */

export {
  default as wordChallengeQuestions,
} from "./data/questions";

/* -------------------------------------------------------------------------- */
/* Shared types                                                               */
/* -------------------------------------------------------------------------- */

export type {
  WordChallengeQuestion,
  WordChallengeGameState,
  WordChallengeGameProps,
  WordChallengeGameSummary,
  WordChallengeQuestionResult,
  WordChallengeResultStatus,
  WordChallengeConfig,
  WordChallengeCallbacks,
  WordChallengeReward,
  SelectedLetter,
  LetterBoardItem,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Default configuration                                                      */
/* -------------------------------------------------------------------------- */

export {
  DEFAULT_WORD_CHALLENGE_CONFIG,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Scoring utilities                                                          */
/* -------------------------------------------------------------------------- */

export {
  calculateTimeBasedPoints,
  calculateCluePoints,
  calculateCurrentPoints,
  calculateRewardPercentage,
  calculatePointsLost,
  calculateEarnedPoints,
  getRewardStatus,
} from "./lib/calculatePoints";

/* -------------------------------------------------------------------------- */
/* Letter utilities                                                           */
/* -------------------------------------------------------------------------- */

export {
  shuffleLetters,
  normalizeWord,
  wordToLetters,
  addDistractors,
  createLetterBoard,
  isCorrectAnswer,
  getRemainingLetterCount,
} from "./lib/shuffleLetters";
