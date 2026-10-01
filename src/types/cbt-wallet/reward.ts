





// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\cbt-wallet\reward.ts

export type RewardCategory =
  | "GADGETS"
  | "STUDY"
  | "EDUCATION"
  | "INTERNET"
  | "VOUCHERS"
  | "SCHOOL"
  | "COMPETITION";

export type RewardStatus =
  | "AVAILABLE"
  | "OUT_OF_STOCK"
  | "COMING_SOON"
  | "DISABLED";

export type RewardBadge =
  | "POPULAR"
  | "NEW"
  | "STUDENT_FAVOURITE"
  | "LIMITED"
  | "BIG_GOAL"
  | "BEST_VALUE";

export type RedeemedRewardStatus =
  | "ACTIVE"
  | "PROCESSING"
  | "DELIVERED"
  | "USED"
  | "CANCELLED";

export interface StudentReward {
  id: string;

  title: string;

  description: string;

  category: RewardCategory;

  /**
   * CBT Points required to redeem the reward.
   */
  points: number;

  /**
   * Optional image displayed on the reward card.
   */
  image?: string;

  /**
   * Optional icon name.
   * Useful when a reward does not have an image.
   */
  icon?: string;

  /**
   * Optional badge displayed on the reward card.
   */
  badge?: RewardBadge;

  status: RewardStatus;

  /**
   * Whether this reward should appear in featured sections.
   */
  featured?: boolean;

  /**
   * Whether students can save toward this reward
   * even when they don't currently have enough points.
   */
  allowSaving?: boolean;

  /**
   * Optional quantity available.
   * Useful for physical rewards.
   */
  stock?: number;

  /**
   * Optional display label for the reward.
   * Example: "Limited to 10 students".
   */
  stockLabel?: string;

  /**
   * Optional delivery information.
   */
  deliveryAvailable?: boolean;

  /**
   * Optional estimated delivery period.
   */
  deliveryTime?: string;

  /**
   * Optional metadata for future backend integration.
   */
  metadata?: Record<string, unknown>;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * Represents a student's progress toward a reward.
 */
export interface RewardProgress {
  rewardId: string;

  /**
   * Current CBT Points saved toward the reward.
   */
  currentPoints: number;

  /**
   * Total CBT Points required.
   */
  targetPoints: number;

  /**
   * Percentage completed.
   */
  percentage: number;

  /**
   * Remaining CBT Points needed.
   */
  remainingPoints: number;

  /**
   * Whether the student has reached the target.
   */
  isComplete: boolean;
}

/**
 * A reward that has already been redeemed by a student.
 */
export interface RedeemedReward {
  id: string;

  rewardId: string;

  title: string;

  description?: string;

  points: number;

  status: RedeemedRewardStatus;

  redeemedAt: string;

  deliveredAt?: string;

  /**
   * Optional redemption/reference number.
   */
  redemptionReference?: string;

  /**
   * Optional delivery information.
   */
  deliveryAddress?: string;

  trackingNumber?: string;

  metadata?: Record<string, unknown>;
}

/**
 * Category definition used by the Student Rewards UI.
 */
export interface RewardCategoryOption {
  id: "ALL" | RewardCategory;

  label: string;

  description?: string;

  icon?: string;
}