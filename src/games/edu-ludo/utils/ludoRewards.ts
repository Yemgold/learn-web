




/**
 * Learnyfi Educational Ludo
 * Reward and wallet utilities.
 *
 * Responsibilities:
 * - Calculate CBT rewards.
 * - Calculate wallet charges for questions.
 * - Calculate capture, home, and winner bonuses.
 * - Provide reward breakdowns.
 *
 * These functions are pure: they do not mutate React state,
 * make API calls, or modify a user's actual wallet.
 */

import {
  CAPTURE_REWARD,
  QUESTION_COST,
  TOKEN_HOME_REWARD,
  WINNER_REWARD,
} from "../components/eduLudoConstants";

/**
 * Reward breakdown for one game event.
 */
export interface LudoRewardBreakdown {
  questionReward: number;
  captureReward: number;
  tokenHomeReward: number;
  winnerReward: number;
  totalReward: number;
}

/**
 * Represents the result of a wallet charge calculation.
 */
export interface LudoWalletCharge {
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  canAfford: boolean;
}

/**
 * Calculates the CBT reward for answering a question correctly.
 *
 * The game currently uses:
 * - Easy: 20 CBT points
 * - Medium: 30 CBT points
 * - Hard: 40 CBT points
 *
 * These are CBT points, not naira.
 */
export function getQuestionCbtReward(
  difficulty: "easy" | "medium" | "hard",
): number {
  switch (difficulty) {
    case "easy":
      return 20;

    case "medium":
      return 30;

    case "hard":
      return 40;

    default: {
      const exhaustiveCheck: never = difficulty;
      return exhaustiveCheck;
    }
  }
}

/**
 * Returns the CBT reward for capturing an opponent's token.
 */
export function getCaptureReward(): number {
  return CAPTURE_REWARD;
}

/**
 * Returns the CBT reward for getting a token home.
 */
export function getTokenHomeReward(): number {
  return TOKEN_HOME_REWARD;
}

/**
 * Returns the CBT reward for winning the match.
 */
export function getWinnerReward(): number {
  return WINNER_REWARD;
}

/**
 * Returns the naira cost of presenting one question.
 *
 * The current game configuration charges ₦2 per question,
 * regardless of whether the answer is correct or incorrect.
 */
export function getQuestionWalletCost(): number {
  return QUESTION_COST;
}

/**
 * Calculates the wallet balance after a question charge.
 *
 * The charge is considered affordable only when the balance is
 * sufficient to pay the full amount.
 *
 * If the user cannot afford it, the balance remains unchanged.
 */
export function calculateQuestionCharge(
  currentBalance: number,
): LudoWalletCharge {
  const safeBalance = Math.max(0, currentBalance);
  const amount = getQuestionWalletCost();
  const canAfford = safeBalance >= amount;

  return {
    amount,
    balanceBefore: safeBalance,
    balanceAfter: canAfford ? safeBalance - amount : safeBalance,
    canAfford,
  };
}

/**
 * Calculates the total CBT points awarded for one or more game events.
 *
 * Pass zero for events that did not happen.
 * This function does not decide whether a reward should be awarded;
 * the game logic must make that decision.
 */
export function calculateRewardBreakdown({
  questionReward = 0,
  captures = 0,
  tokensHome = 0,
  wonMatch = false,
}: {
  questionReward?: number;
  captures?: number;
  tokensHome?: number;
  wonMatch?: boolean;
}): LudoRewardBreakdown {
  const safeQuestionReward = nonNegativeInteger(questionReward);
  const safeCaptures = nonNegativeInteger(captures);
  const safeTokensHome = nonNegativeInteger(tokensHome);

  const captureReward = safeCaptures * CAPTURE_REWARD;
  const tokenHomeReward = safeTokensHome * TOKEN_HOME_REWARD;
  const winnerReward = wonMatch ? WINNER_REWARD : 0;

  return {
    questionReward: safeQuestionReward,
    captureReward,
    tokenHomeReward,
    winnerReward,
    totalReward:
      safeQuestionReward +
      captureReward +
      tokenHomeReward +
      winnerReward,
  };
}

/**
 * Calculates a CBT balance after awarding points.
 *
 * CBT points are kept separate from the naira wallet balance.
 */
export function calculateCbtBalance(
  currentCbtBalance: number,
  reward: number,
): number {
  return (
    nonNegativeInteger(currentCbtBalance) +
    nonNegativeInteger(reward)
  );
}

/**
 * Calculates a total wallet balance after a charge.
 *
 * Returns the original normalized balance if the charge is unaffordable.
 */
export function calculateWalletBalanceAfterCharge(
  currentBalance: number,
  charge: number = QUESTION_COST,
): number {
  const safeBalance = Math.max(0, currentBalance);
  const safeCharge = nonNegativeNumber(charge);

  if (safeBalance < safeCharge) {
    return safeBalance;
  }

  return safeBalance - safeCharge;
}

/**
 * Determines whether a wallet balance can cover a question charge.
 */
export function canAffordQuestion(
  currentBalance: number,
): boolean {
  return (
    Number.isFinite(currentBalance) &&
    currentBalance >= QUESTION_COST
  );
}

/**
 * Formats a naira wallet amount for display.
 *
 * Example: formatNaira(500) -> "₦500.00"
 */
export function formatNaira(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

/**
 * Formats a CBT points amount for display.
 *
 * Example: formatCbtPoints(250) -> "250 CBT Points"
 */
export function formatCbtPoints(points: number): string {
  const safePoints = nonNegativeInteger(points);

  return `${safePoints.toLocaleString("en-NG")} CBT Points`;
}

/**
 * Safely normalizes a value to a non-negative integer.
 */
function nonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

/**
 * Safely normalizes a value to a non-negative number.
 */
function nonNegativeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}
