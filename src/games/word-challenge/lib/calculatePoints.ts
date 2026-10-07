






/**
 * Word Challenge point calculation utilities.
 *
 * Frontend-only for now.
 *
 * Core rule:
 * The faster the player solves the word,
 * the more points they earn.
 */

export interface CalculatePointsOptions {
  startingPoints: number;
  timeLeft: number;
  timeLimit: number;
  clueUsed?: boolean;
  cluePenalty?: number;
}

/**
 * Keeps a number safely within a range.
 */
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate the current reward while the player is solving.
 *
 * Example:
 *
 * startingPoints = 20
 * timeLimit      = 20
 *
 * 20 seconds left -> 20 points
 * 15 seconds left -> 15 points
 * 10 seconds left -> 10 points
 *  5 seconds left ->  5 points
 *  0 seconds left ->  0 points
 */
export function calculateTimeBasedPoints(
  startingPoints: number,
  timeLeft: number,
  timeLimit: number,
): number {
  const safeStartingPoints = Math.max(0, startingPoints);
  const safeTimeLimit = Math.max(1, timeLimit);
  const safeTimeLeft = clamp(
    timeLeft,
    0,
    safeTimeLimit,
  );

  if (safeStartingPoints === 0) {
    return 0;
  }

  const timeRatio = safeTimeLeft / safeTimeLimit;

  return Math.max(
    0,
    Math.ceil(safeStartingPoints * timeRatio),
  );
}

/**
 * Calculate the reward after the automatic clue appears.
 *
 * The clue does not completely remove the reward.
 * It reduces the reward by the configured penalty.
 */
export function calculateCluePoints(
  points: number,
  cluePenalty: number,
): number {
  const safePoints = Math.max(0, points);
  const safePenalty = Math.max(0, cluePenalty);

  return Math.max(0, safePoints - safePenalty);
}

/**
 * Calculate the current reward shown to the player.
 *
 * This combines:
 *
 * 1. Time-based point reduction
 * 2. Automatic clue penalty
 */
export function calculateCurrentPoints({
  startingPoints,
  timeLeft,
  timeLimit,
  clueUsed = false,
  cluePenalty = 0,
}: CalculatePointsOptions): number {
  const timeBasedPoints = calculateTimeBasedPoints(
    startingPoints,
    timeLeft,
    timeLimit,
  );

  if (!clueUsed) {
    return timeBasedPoints;
  }

  return calculateCluePoints(
    timeBasedPoints,
    cluePenalty,
  );
}

/**
 * Calculate the percentage of the original reward
 * that is still available.
 *
 * Example:
 *
 * 20 starting points
 * 10 current points
 *
 * = 50%
 */
export function calculateRewardPercentage(
  currentPoints: number,
  startingPoints: number,
): number {
  const safeStartingPoints = Math.max(0, startingPoints);
  const safeCurrentPoints = Math.max(0, currentPoints);

  if (safeStartingPoints === 0) {
    return 0;
  }

  return Math.round(
    clamp(
      (safeCurrentPoints / safeStartingPoints) * 100,
      0,
      100,
    ),
  );
}

/**
 * Calculate how many points have been lost
 * compared with the original reward.
 */
export function calculatePointsLost(
  currentPoints: number,
  startingPoints: number,
): number {
  return Math.max(
    0,
    Math.max(0, startingPoints) -
      Math.max(0, currentPoints),
  );
}

/**
 * Calculate the final points earned when the player
 * submits a correct answer.
 *
 * If time has expired, the player earns zero.
 */
export function calculateEarnedPoints({
  startingPoints,
  timeLeft,
  timeLimit,
  clueUsed = false,
  cluePenalty = 0,
}: CalculatePointsOptions): number {
  if (timeLeft <= 0) {
    return 0;
  }

  return calculateCurrentPoints({
    startingPoints,
    timeLeft,
    timeLimit,
    clueUsed,
    cluePenalty,
  });
}

/**
 * Get a simple description of the current reward state.
 */
export function getRewardStatus(
  currentPoints: number,
  startingPoints: number,
  clueUsed: boolean,
) {
  if (currentPoints <= 0) {
    return {
      label: "No points",
      description: "The reward has run out.",
    };
  }

  if (clueUsed) {
    return {
      label: "Reduced reward",
      description: "A clue was used, so the reward has been reduced.",
    };
  }

  const percentage = calculateRewardPercentage(
    currentPoints,
    startingPoints,
  );

  if (percentage >= 75) {
    return {
      label: "High reward",
      description: "Solve it now to keep a high reward.",
    };
  }

  if (percentage >= 40) {
    return {
      label: "Reward dropping",
      description: "The longer you wait, the fewer points you earn.",
    };
  }

  return {
    label: "Low reward",
    description: "Solve quickly before the reward reaches zero.",
  };
}