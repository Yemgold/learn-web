




"use client";

import { useCallback, useMemo, useState } from "react";

import {
  formatCbtPoints,
  type CbtReward,
} from "@/lib/api/cbtWallet";

/**
 * ============================================================
 * CBT WALLET REWARDS HOOK
 * ============================================================
 *
 * Currently uses MOCK DATA.
 *
 * Responsibilities:
 *
 * - Load rewards
 * - Filter available rewards
 * - Check affordability
 * - Search rewards
 * - Filter rewards by category
 * - Redeem rewards
 * - Track redemption loading state
 * - Track success/error messages
 *
 * This hook is intentionally separate from useCbtWallet so the
 * rewards section can evolve independently.
 * ============================================================
 */

export interface CbtWalletRewardResult {
  success: boolean;
  message: string;
  reward?: CbtReward;
}

export interface UseCbtWalletRewardsOptions {
  balance?: number;
  initialRewards?: CbtReward[];
}

export interface UseCbtWalletRewardsReturn {
  /* Rewards */
  rewards: CbtReward[];
  availableRewards: CbtReward[];
  affordableRewards: CbtReward[];
  categories: string[];

  /* Filtering */
  selectedCategory: string;
  searchQuery: string;
  filteredRewards: CbtReward[];

  /* Loading */
  isLoading: boolean;
  isRefreshing: boolean;
  isRedeeming: boolean;

  /* Feedback */
  error: string | null;
  successMessage: string | null;

  /* Counts */
  rewardCount: number;
  availableRewardCount: number;
  affordableRewardCount: number;

  /* Actions */
  refreshRewards: () => Promise<void>;

  redeemReward: (
    rewardId: string,
  ) => Promise<CbtWalletRewardResult>;

  setSearchQuery: (value: string) => void;
  setSelectedCategory: (category: string) => void;

  clearFilters: () => void;
  clearMessages: () => void;

  /* Helpers */
  canAffordReward: (reward: CbtReward) => boolean;
  getPointsNeeded: (reward: CbtReward) => number;
  getRewardProgress: (reward: CbtReward) => number;
  formatRewardCost: (reward: CbtReward) => string;
}

/* ============================================================
 * MOCK REWARDS
 * ============================================================
 */

const createMockRewards = (): CbtReward[] => [
  {
    _id: "reward-001",
    title: "JAMB Practice Pack",
    description:
      "Unlock an additional set of premium CBT practice questions.",
    pointsRequired: 500,
    category: "Practice",
    icon: "book-open",
    available: true,
    quantity: 100,
  },

  {
    _id: "reward-002",
    title: "CBT Mock Exam",
    description:
      "Access a full-length JAMB-style mock examination.",
    pointsRequired: 750,
    category: "Practice",
    icon: "graduation-cap",
    available: true,
    quantity: 50,
  },

  {
    _id: "reward-003",
    title: "Solve & Win Entry",
    description:
      "Use your CBT points to enter an eligible competition.",
    pointsRequired: 1000,
    category: "Competition",
    icon: "trophy",
    available: true,
    quantity: 25,
  },

  {
    _id: "reward-004",
    title: "Premium Study Session",
    description:
      "Unlock a premium guided study session.",
    pointsRequired: 1500,
    category: "Learning",
    icon: "sparkles",
    available: true,
    quantity: 10,
  },

  {
    _id: "reward-005",
    title: "English Vocabulary Pack",
    description:
      "Get access to an extended JAMB English vocabulary practice pack.",
    pointsRequired: 350,
    category: "Practice",
    icon: "languages",
    available: true,
    quantity: 200,
  },

  {
    _id: "reward-006",
    title: "Biology Revision Pack",
    description:
      "Unlock a focused Biology revision question collection.",
    pointsRequired: 450,
    category: "Practice",
    icon: "microscope",
    available: true,
    quantity: 150,
  },

  {
    _id: "reward-007",
    title: "Chemistry Revision Pack",
    description:
      "Unlock additional Chemistry questions and revision materials.",
    pointsRequired: 450,
    category: "Practice",
    icon: "flask-conical",
    available: true,
    quantity: 150,
  },

  {
    _id: "reward-008",
    title: "Physics Revision Pack",
    description:
      "Unlock additional Physics questions and revision materials.",
    pointsRequired: 450,
    category: "Practice",
    icon: "atom",
    available: true,
    quantity: 150,
  },

  {
    _id: "reward-009",
    title: "League Bonus Entry",
    description:
      "Unlock a special eligible JAMB League competition entry.",
    pointsRequired: 2000,
    category: "Competition",
    icon: "medal",
    available: true,
    quantity: 10,
  },

  {
    _id: "reward-010",
    title: "Premium Learning Bundle",
    description:
      "Unlock a larger collection of premium learning resources.",
    pointsRequired: 3000,
    category: "Learning",
    icon: "sparkles",
    available: true,
    quantity: 5,
  },

  {
    _id: "reward-011",
    title: "Coming Soon Reward",
    description:
      "A new student reward will be available soon.",
    pointsRequired: 5000,
    category: "Coming Soon",
    icon: "gift",
    available: false,
    quantity: 0,
  },
];

/* ============================================================
 * HELPERS
 * ============================================================
 */

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const normalizeSearch = (value: string) =>
  value.trim().toLowerCase();

/* ============================================================
 * HOOK
 * ============================================================
 */

export function useCbtWalletRewards(
  options: UseCbtWalletRewardsOptions = {},
): UseCbtWalletRewardsReturn {
  const {
    balance = 0,
    initialRewards,
  } = options;

  const [rewards, setRewards] = useState<CbtReward[]>(
    initialRewards ?? createMockRewards(),
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  /* ==========================================================
   * CATEGORIES
   * ==========================================================
   */

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    rewards.forEach((reward) => {
      if (reward.category) {
        categorySet.add(reward.category);
      }
    });

    return ["All", ...Array.from(categorySet).sort()];
  }, [rewards]);

  /* ==========================================================
   * AVAILABLE REWARDS
   * ==========================================================
   */

  const availableRewards = useMemo(() => {
    return rewards.filter(
      (reward) =>
        reward.available !== false &&
        (reward.quantity === undefined ||
          reward.quantity > 0),
    );
  }, [rewards]);

  /* ==========================================================
   * AFFORDABLE REWARDS
   * ==========================================================
   */

  const affordableRewards = useMemo(() => {
    return availableRewards.filter(
      (reward) => reward.pointsRequired <= balance,
    );
  }, [availableRewards, balance]);

  /* ==========================================================
   * FILTERED REWARDS
   * ==========================================================
   */

  const filteredRewards = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchQuery);

    return rewards.filter((reward) => {
      const matchesCategory =
        selectedCategory === "All" ||
        reward.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        reward.title,
        reward.description,
        reward.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [rewards, searchQuery, selectedCategory]);

  /* ==========================================================
   * REFRESH REWARDS
   * ==========================================================
   */

  const refreshRewards = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      /*
       * MOCK ONLY
       *
       * Later:
       *
       * const response = await getCbtRewards();
       * setRewards(response.data);
       */

      await wait(500);

      setRewards((currentRewards) => [...currentRewards]);
    } catch (err) {
      console.error(
        "Failed to refresh CBT wallet rewards:",
        err,
      );

      setError(
        "Unable to refresh rewards. Please try again.",
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  /* ==========================================================
   * CAN AFFORD REWARD
   * ==========================================================
   */

  const canAffordReward = useCallback(
    (reward: CbtReward): boolean => {
      if (reward.available === false) {
        return false;
      }

      if (
        reward.quantity !== undefined &&
        reward.quantity <= 0
      ) {
        return false;
      }

      return balance >= reward.pointsRequired;
    },
    [balance],
  );

  /* ==========================================================
   * POINTS NEEDED
   * ==========================================================
   */

  const getPointsNeeded = useCallback(
    (reward: CbtReward): number => {
      return Math.max(
        reward.pointsRequired - balance,
        0,
      );
    },
    [balance],
  );

  /* ==========================================================
   * REWARD PROGRESS
   * ==========================================================
   *
   * Returns 0 - 100.
   *
   * Example:
   *
   * Balance: 250
   * Reward: 500
   *
   * Progress = 50
   */

  const getRewardProgress = useCallback(
    (reward: CbtReward): number => {
      if (reward.pointsRequired <= 0) {
        return 100;
      }

      const progress =
        (balance / reward.pointsRequired) * 100;

      return Math.min(Math.max(progress, 0), 100);
    },
    [balance],
  );

  /* ==========================================================
   * FORMAT REWARD COST
   * ==========================================================
   */

  const formatRewardCost = useCallback(
    (reward: CbtReward): string => {
      return `${formatCbtPoints(
        reward.pointsRequired,
      )} points`;
    },
    [],
  );

  /* ==========================================================
   * REDEEM REWARD
   * ==========================================================
   */

  const redeemReward = useCallback(
    async (
      rewardId: string,
    ): Promise<CbtWalletRewardResult> => {
      setError(null);
      setSuccessMessage(null);

      if (!rewardId) {
        const message =
          "Please select a reward to redeem.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      const reward = rewards.find(
        (item) => item._id === rewardId,
      );

      if (!reward) {
        const message =
          "The selected reward could not be found.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (reward.available === false) {
        const message =
          "This reward is currently unavailable.";

        setError(message);

        return {
          success: false,
          message,
          reward,
        };
      }

      if (
        reward.quantity !== undefined &&
        reward.quantity <= 0
      ) {
        const message =
          "This reward is currently out of stock.";

        setError(message);

        return {
          success: false,
          message,
          reward,
        };
      }

      if (balance < reward.pointsRequired) {
        const pointsNeeded =
          reward.pointsRequired - balance;

        const message = `You need ${formatCbtPoints(
          pointsNeeded,
        )} more CBT points to redeem this reward.`;

        setError(message);

        return {
          success: false,
          message,
          reward,
        };
      }

      setIsRedeeming(true);

      try {
        /*
         * MOCK ONLY
         *
         * Later:
         *
         * await redeemCbtReward({
         *   rewardId,
         * });
         */

        await wait(800);

        setRewards((currentRewards) =>
          currentRewards.map((currentReward) => {
            if (currentReward._id !== rewardId) {
              return currentReward;
            }

            if (
              currentReward.quantity === undefined
            ) {
              return currentReward;
            }

            const remainingQuantity =
              Math.max(
                currentReward.quantity - 1,
                0,
              );

            return {
              ...currentReward,
              quantity: remainingQuantity,
              available:
                remainingQuantity > 0,
            };
          }),
        );

        const message = `${reward.title} redeemed successfully.`;

        setSuccessMessage(message);

        return {
          success: true,
          message,
          reward,
        };
      } catch (err) {
        console.error(
          "Failed to redeem CBT wallet reward:",
          err,
        );

        const message =
          "We could not redeem this reward. Please try again.";

        setError(message);

        return {
          success: false,
          message,
          reward,
        };
      } finally {
        setIsRedeeming(false);
      }
    },
    [balance, rewards],
  );

  /* ==========================================================
   * CLEAR FILTERS
   * ==========================================================
   */

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All");
  }, []);

  /* ==========================================================
   * CLEAR MESSAGES
   * ==========================================================
   */

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  /* ==========================================================
   * RETURN
   * ==========================================================
   */

  return {
    /* Rewards */
    rewards,
    availableRewards,
    affordableRewards,
    categories,

    /* Filtering */
    selectedCategory,
    searchQuery,
    filteredRewards,

    /* Loading */
    isLoading,
    isRefreshing,
    isRedeeming,

    /* Feedback */
    error,
    successMessage,

    /* Counts */
    rewardCount: rewards.length,
    availableRewardCount: availableRewards.length,
    affordableRewardCount: affordableRewards.length,

    /* Actions */
    refreshRewards,
    redeemReward,

    setSearchQuery,
    setSelectedCategory,

    clearFilters,
    clearMessages,

    /* Helpers */
    canAffordReward,
    getPointsNeeded,
    getRewardProgress,
    formatRewardCost,
  };
}

export default useCbtWalletRewards;