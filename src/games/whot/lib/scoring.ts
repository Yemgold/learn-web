




/* ============================================================
   LEARNYFI WHOT — SCORING ENGINE
   ============================================================

   Frontend-only scoring utilities.

   Tracks:
   - Points earned for correct answers
   - Difficulty-based points
   - Speed bonuses
   - Consecutive correct-answer streaks
   - Accuracy and performance summaries
   - End-of-game bonuses

   This module does not mutate game state or make API calls.
   ============================================================ */

import type {
  WhotDifficulty,
  WhotPlayerId,
} from "../types/whot";

/* ============================================================
   TYPES
   ============================================================ */

export interface WhotScoringConfig {
  /** Points awarded for answering an EASY question correctly. */
  easyPoints: number;

  /** Points awarded for answering a MEDIUM question correctly. */
  mediumPoints: number;

  /** Points awarded for answering a HARD question correctly. */
  hardPoints: number;

  /** Maximum bonus for answering quickly. */
  maxSpeedBonus: number;

  /** Time threshold, in seconds, for the maximum speed bonus. */
  speedBonusWindowSeconds: number;

  /** Additional points for each correct answer in a streak. */
  streakBonusPerAnswer: number;

  /** Maximum streak bonus for one answer. */
  maxStreakBonus: number;

  /** Bonus for winning a game. */
  winBonus: number;

  /** Bonus for finishing a game without an incorrect answer. */
  perfectGameBonus: number;
}

export interface WhotAnswerScoreInput {
  difficulty: WhotDifficulty;
  correct: boolean;
  timeTakenSeconds: number;
  questionTimeLimitSeconds: number;
  currentStreak: number;
}

export interface WhotAnswerScore {
  pointsAwarded: number;
  basePoints: number;
  speedBonus: number;
  streakBonus: number;
  correct: boolean;
}

export interface WhotScoringStats {
  playerId: WhotPlayerId;
  points: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questionsAnswered: number;
  currentStreak: number;
  longestStreak: number;
  totalAnswerTimeSeconds: number;
  averageAnswerTimeSeconds: number;
  accuracyPercentage: number;
}

export interface WhotGameScoreSummary {
  playerId: WhotPlayerId;
  points: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  longestStreak: number;
  averageAnswerTimeSeconds: number;
  won: boolean;
  winBonus: number;
  perfectGameBonus: number;
  finalPoints: number;
}

/* ============================================================
   DEFAULT CONFIGURATION
   ============================================================ */

export const DEFAULT_WHOT_SCORING_CONFIG: Readonly<WhotScoringConfig> = {
  easyPoints: 10,
  mediumPoints: 20,
  hardPoints: 30,

  maxSpeedBonus: 5,
  speedBonusWindowSeconds: 5,

  streakBonusPerAnswer: 2,
  maxStreakBonus: 10,

  winBonus: 50,
  perfectGameBonus: 25,
};

/* ============================================================
   HELPERS
   ============================================================ */

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function getBasePoints(
  difficulty: WhotDifficulty,
  config: WhotScoringConfig,
): number {
  switch (difficulty) {
    case "EASY":
      return config.easyPoints;

    case "MEDIUM":
      return config.mediumPoints;

    case "HARD":
      return config.hardPoints;

    default: {
      const exhaustiveCheck: never = difficulty;
      return exhaustiveCheck;
    }
  }
}

/* ============================================================
   ANSWER SCORING
   ============================================================ */

/**
 * Calculates points for one answered question.
 *
 * Incorrect answers earn zero points.
 *
 * Correct answers can earn:
 * - Base points based on difficulty
 * - A speed bonus for answering quickly
 * - A streak bonus based on the existing correct-answer streak
 *
 * `currentStreak` is the streak BEFORE this answer is recorded.
 * For example, if the player has two consecutive correct answers,
 * the third correct answer receives a streak bonus of 3 × 2 points,
 * subject to the configured maximum.
 */
export function calculateAnswerScore(
  input: WhotAnswerScoreInput,
  configOverrides: Partial<WhotScoringConfig> = {},
): WhotAnswerScore {
  const config: WhotScoringConfig = {
    ...DEFAULT_WHOT_SCORING_CONFIG,
    ...configOverrides,
  };

  if (
    !Number.isFinite(input.timeTakenSeconds) ||
    input.timeTakenSeconds < 0
  ) {
    throw new Error(
      "[Learnyfi WHOT] timeTakenSeconds must be a non-negative number.",
    );
  }

  if (
    !Number.isFinite(input.questionTimeLimitSeconds) ||
    input.questionTimeLimitSeconds <= 0
  ) {
    throw new Error(
      "[Learnyfi WHOT] questionTimeLimitSeconds must be greater than zero.",
    );
  }

  if (
    !Number.isInteger(input.currentStreak) ||
    input.currentStreak < 0
  ) {
    throw new Error(
      "[Learnyfi WHOT] currentStreak must be a non-negative integer.",
    );
  }

  if (!input.correct) {
    return {
      pointsAwarded: 0,
      basePoints: 0,
      speedBonus: 0,
      streakBonus: 0,
      correct: false,
    };
  }

  const basePoints = getBasePoints(input.difficulty, config);

  const speedWindow = Math.min(
    config.speedBonusWindowSeconds,
    input.questionTimeLimitSeconds,
  );

  const speedRatio =
    speedWindow > 0
      ? clamp(
          1 - input.timeTakenSeconds / speedWindow,
          0,
          1,
        )
      : 0;

  const speedBonus = Math.round(
    config.maxSpeedBonus * speedRatio,
  );

  const streakBonus = Math.min(
    config.maxStreakBonus,
    input.currentStreak * config.streakBonusPerAnswer,
  );

  return {
    pointsAwarded: basePoints + speedBonus + streakBonus,
    basePoints,
    speedBonus,
    streakBonus,
    correct: true,
  };
}

/* ============================================================
   INITIAL STATS
   ============================================================ */

/**
 * Creates a fresh score tracker for a player.
 */
export function createWhotScoringStats(
  playerId: WhotPlayerId,
): WhotScoringStats {
  return {
    playerId,
    points: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    questionsAnswered: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalAnswerTimeSeconds: 0,
    averageAnswerTimeSeconds: 0,
    accuracyPercentage: 0,
  };
}

/* ============================================================
   RECORD ANSWERS
   ============================================================ */

/**
 * Records the outcome of one question and returns updated stats.
 *
 * Pass the points from calculateAnswerScore so that scoring
 * policy and statistics remain separate.
 */
export function recordWhotAnswer(
  stats: WhotScoringStats,
  input: {
    correct: boolean;
    pointsAwarded?: number;
    timeTakenSeconds: number;
  },
): WhotScoringStats {
  if (
    !Number.isFinite(input.timeTakenSeconds) ||
    input.timeTakenSeconds < 0
  ) {
    throw new Error(
      "[Learnyfi WHOT] timeTakenSeconds must be a non-negative number.",
    );
  }

  const pointsAwarded = input.correct
    ? Math.max(0, input.pointsAwarded ?? 0)
    : 0;

  const correctAnswers =
    stats.correctAnswers + (input.correct ? 1 : 0);

  const incorrectAnswers =
    stats.incorrectAnswers + (input.correct ? 0 : 1);

  const questionsAnswered =
    stats.questionsAnswered + 1;

  const currentStreak = input.correct
    ? stats.currentStreak + 1
    : 0;

  const totalAnswerTimeSeconds =
    stats.totalAnswerTimeSeconds + input.timeTakenSeconds;

  return {
    ...stats,
    points: stats.points + pointsAwarded,
    correctAnswers,
    incorrectAnswers,
    questionsAnswered,
    currentStreak,
    longestStreak: Math.max(
      stats.longestStreak,
      currentStreak,
    ),
    totalAnswerTimeSeconds,
    averageAnswerTimeSeconds:
      questionsAnswered > 0
        ? totalAnswerTimeSeconds / questionsAnswered
        : 0,
    accuracyPercentage:
      questionsAnswered > 0
        ? (correctAnswers / questionsAnswered) * 100
        : 0,
  };
}

/* ============================================================
   FINAL GAME SCORE
   ============================================================ */

/**
 * Creates the final game summary.
 *
 * Winning and perfect-game bonuses are applied here only,
 * so they are not accidentally awarded for individual answers.
 */
export function calculateFinalGameScore(
  stats: WhotScoringStats,
  won: boolean,
  configOverrides: Partial<WhotScoringConfig> = {},
): WhotGameScoreSummary {
  const config: WhotScoringConfig = {
    ...DEFAULT_WHOT_SCORING_CONFIG,
    ...configOverrides,
  };

  const perfectGame =
    stats.questionsAnswered > 0 &&
    stats.incorrectAnswers === 0;

  const winBonus = won ? config.winBonus : 0;

  const perfectGameBonus = perfectGame
    ? config.perfectGameBonus
    : 0;

  return {
    playerId: stats.playerId,
    points: stats.points,
    correctAnswers: stats.correctAnswers,
    incorrectAnswers: stats.incorrectAnswers,
    accuracyPercentage: stats.accuracyPercentage,
    longestStreak: stats.longestStreak,
    averageAnswerTimeSeconds: stats.averageAnswerTimeSeconds,
    won,
    winBonus,
    perfectGameBonus,
    finalPoints: stats.points + winBonus + perfectGameBonus,
  };
}

/* ============================================================
   FORMATTING HELPERS
   ============================================================ */

/**
 * Formats an accuracy value as a percentage.
 */
export function formatWhotAccuracy(
  accuracy: number,
  decimalPlaces = 1,
): string {
  const safeAccuracy = clamp(accuracy, 0, 100);

  return `${safeAccuracy.toFixed(decimalPlaces)}%`;
}

/**
 * Formats a duration as seconds or minutes and seconds.
 */
export function formatWhotDuration(
  totalSeconds: number,
): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  if (safeSeconds < 60) {
    return `${safeSeconds}s`;
  }

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return seconds === 0
    ? `${minutes}m`
    : `${minutes}m ${seconds}s`;
}

/**
 * Returns a friendly performance label for the result screen.
 */
export function getWhotPerformanceLabel(
  accuracy: number,
): string {
  if (accuracy >= 90) return "Outstanding";
  if (accuracy >= 75) return "Excellent";
  if (accuracy >= 60) return "Good effort";
  if (accuracy >= 40) return "Keep practising";

  return "Keep learning";
}
