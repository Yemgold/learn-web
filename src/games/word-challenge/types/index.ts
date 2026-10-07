




/**
 * Shared types for the Learnyfi Word Challenge game.
 *
 * Frontend-only for now.
 * These types are intentionally independent from the
 * backend so the game can be connected to an API later.
 */

/* -------------------------------------------------------------------------- */
/* Game state                                                                 */
/* -------------------------------------------------------------------------- */

export type WordChallengeGameState =
  | "idle"
  | "playing"
  | "correct"
  | "incorrect"
  | "time-up"
  | "finished";

/* -------------------------------------------------------------------------- */
/* Question                                                                    */
/* -------------------------------------------------------------------------- */

export interface WordChallengeQuestion {
  /**
   * Unique identifier for the question.
   */
  id: string;

  /**
   * Correct answer.
   *
   * Example:
   * "LION"
   */
  answer: string;

  /**
   * Description shown to the player.
   *
   * The description must not directly reveal the answer.
   */
  description: string;

  /**
   * Clue automatically revealed when the countdown
   * reaches the clue threshold.
   */
  clue: string;

  /**
   * Letters displayed on the letter board.
   *
   * This can include:
   * - Correct letters
   * - Duplicate letters
   * - Distractor letters
   */
  letters: string[];

  /**
   * Optional category displayed above the description.
   *
   * Example:
   * "Animals"
   */
  category?: string;

  /**
   * Starting reward for the question.
   *
   * Defaults to 20 points when omitted.
   */
  startingPoints?: number;

  /**
   * Total countdown duration in seconds.
   *
   * Defaults to 20 seconds when omitted.
   */
  timeLimit?: number;

  /**
   * The number of seconds remaining when
   * the automatic clue appears.
   *
   * Example:
   * 9 seconds remaining.
   */
  clueThreshold?: number;

  /**
   * Number of points removed when the clue appears.
   *
   * Example:
   * 5 points.
   */
  cluePenalty?: number;
}

/* -------------------------------------------------------------------------- */
/* Selected letters                                                           */
/* -------------------------------------------------------------------------- */

export interface SelectedLetter {
  /**
   * The letter itself.
   */
  letter: string;

  /**
   * Original position of the letter on the board.
   *
   * This is important when the board contains duplicate
   * letters such as:
   *
   * BANANA
   */
  index: number;
}

/* -------------------------------------------------------------------------- */
/* Question result                                                            */
/* -------------------------------------------------------------------------- */

export type WordChallengeResultStatus =
  | "correct"
  | "incorrect"
  | "time-up";

export interface WordChallengeQuestionResult {
  /**
   * Question identifier.
   */
  questionId: string;

  /**
   * Correct answer.
   */
  answer: string;

  /**
   * Letters selected by the player.
   */
  selectedLetters: string[];

  /**
   * Points earned on this question.
   */
  earnedPoints: number;

  /**
   * Points available before penalties.
   */
  startingPoints: number;

  /**
   * Time remaining when the question was completed.
   */
  timeLeft: number;

  /**
   * Whether the automatic clue was used.
   */
  clueUsed: boolean;

  /**
   * Points removed because of the clue.
   */
  cluePenalty: number;

  /**
   * How the question ended.
   */
  status: WordChallengeResultStatus;
}

/* -------------------------------------------------------------------------- */
/* Game summary                                                               */
/* -------------------------------------------------------------------------- */

export interface WordChallengeGameSummary {
  /**
   * Total points earned during the game.
   */
  score: number;

  /**
   * Number of correctly solved questions.
   */
  correctAnswers: number;

  /**
   * Total number of questions played.
   */
  totalQuestions: number;

  /**
   * Number of incorrect answers.
   */
  incorrectAnswers: number;

  /**
   * Number of questions that reached zero time.
   */
  timedOutQuestions: number;

  /**
   * Number of questions where the automatic clue appeared.
   */
  cluesUsed: number;

  /**
   * Accuracy percentage.
   */
  accuracy: number;

  /**
   * Individual question results.
   */
  results: WordChallengeQuestionResult[];
}

/* -------------------------------------------------------------------------- */
/* Game configuration                                                         */
/* -------------------------------------------------------------------------- */

export interface WordChallengeConfig {
  /**
   * Default starting points when a question does not
   * provide its own startingPoints value.
   */
  startingPoints: number;

  /**
   * Default question time in seconds.
   */
  timeLimit: number;

  /**
   * Default clue threshold in seconds.
   */
  clueThreshold: number;

  /**
   * Default clue penalty.
   */
  cluePenalty: number;

  /**
   * Whether the game should automatically move to
   * the next question after a correct answer.
   */
  autoAdvance: boolean;

  /**
   * Delay before moving to the next question.
   *
   * This gives the player a short moment to see
   * their earned reward.
   */
  nextQuestionDelay: number;
}

/* -------------------------------------------------------------------------- */
/* Game callbacks                                                             */
/* -------------------------------------------------------------------------- */

export interface WordChallengeCallbacks {
  /**
   * Called when a question is answered correctly.
   */
  onCorrect?: (
    result: WordChallengeQuestionResult,
  ) => void;

  /**
   * Called when a question is answered incorrectly.
   */
  onIncorrect?: (
    result: WordChallengeQuestionResult,
  ) => void;

  /**
   * Called when time reaches zero.
   */
  onTimeUp?: (
    result: WordChallengeQuestionResult,
  ) => void;

  /**
   * Called when the automatic clue appears.
   */
  onClueShown?: (
    question: WordChallengeQuestion,
  ) => void;

  /**
   * Called when the complete game finishes.
   */
  onGameComplete?: (
    summary: WordChallengeGameSummary,
  ) => void;
}

/* -------------------------------------------------------------------------- */
/* Game props                                                                 */
/* -------------------------------------------------------------------------- */

export interface WordChallengeGameProps {
  /**
   * Questions used in the current game.
   */
  questions: WordChallengeQuestion[];

  /**
   * Optional game configuration.
   */
  config?: Partial<WordChallengeConfig>;

  /**
   * Optional callbacks for future analytics,
   * backend integration, or leaderboard support.
   */
  callbacks?: WordChallengeCallbacks;
}

/* -------------------------------------------------------------------------- */
/* Letter board                                                               */
/* -------------------------------------------------------------------------- */

export interface LetterBoardItem {
  /**
   * The letter displayed to the player.
   */
  letter: string;

  /**
   * Unique board position.
   *
   * Never use the letter itself as the unique identifier
   * because duplicate letters are allowed.
   */
  index: number;

  /**
   * Whether the player has already selected this letter.
   */
  selected: boolean;
}

/* -------------------------------------------------------------------------- */
/* Reward information                                                         */
/* -------------------------------------------------------------------------- */

export interface WordChallengeReward {
  /**
   * Original reward before time deductions.
   */
  startingPoints: number;

  /**
   * Current reward based on remaining time.
   */
  currentPoints: number;

  /**
   * Points removed due to elapsed time.
   */
  timePointsLost: number;

  /**
   * Points removed because a clue was used.
   */
  cluePenalty: number;

  /**
   * Whether the clue has been triggered.
   */
  clueUsed: boolean;

  /**
   * Percentage of the original reward still available.
   */
  percentageRemaining: number;
}

/* -------------------------------------------------------------------------- */
/* Default configuration                                                      */
/* -------------------------------------------------------------------------- */

export const DEFAULT_WORD_CHALLENGE_CONFIG: WordChallengeConfig = {
  startingPoints: 20,
  timeLimit: 20,
  clueThreshold: 9,
  cluePenalty: 5,
  autoAdvance: true,
  nextQuestionDelay: 1200,
};
