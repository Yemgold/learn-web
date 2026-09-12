





"use client";

import { useCallback, useMemo, useState } from "react";

import {
  formatCbtPoints,
  getCbtTransactionLabel,
  getCbtTransactionSign,
  isCbtCreditTransaction,
  isCbtDebitTransaction,
  type CbtReward,
  type CbtTransaction,
  type CbtWallet,
} from "@/lib/api/cbtWallet";

/**
 * ============================================================
 * CBT WALLET HOOK
 * ============================================================
 *
 * Currently uses MOCK DATA.
 *
 * The hook is intentionally structured around the real CBT
 * Wallet API so that API integration can be added later
 * without changing the wallet page's UI structure.
 *
 * Main features:
 *
 * - Wallet balance
 * - Transactions
 * - Rewards
 * - Send points
 * - Receive points
 * - Redeem rewards
 * - Loading states
 * - Action feedback
 * - Balance updates
 * ============================================================
 */

export interface CbtWalletActionResult {
  success: boolean;
  message: string;
}

export interface CbtWalletStats {
  totalEarned: number;
  totalSent: number;
  totalReceived: number;
  totalRedeemed: number;
  totalBonus: number;
}

export interface UseCbtWalletReturn {
  /* Wallet */
  wallet: CbtWallet;
  balance: number;
  formattedBalance: string;

  /* Transactions */
  transactions: CbtTransaction[];
  recentTransactions: CbtTransaction[];
  transactionCount: number;

  /* Rewards */
  rewards: CbtReward[];
  availableRewards: CbtReward[];

  /* Statistics */
  stats: CbtWalletStats;

  /* Loading */
  isLoading: boolean;
  isRefreshing: boolean;
  isSending: boolean;
  isReceiving: boolean;
  isRedeeming: boolean;

  /* Error / feedback */
  error: string | null;
  successMessage: string | null;

  /* Wallet actions */
  refreshWallet: () => Promise<void>;

  /* Point actions */
  sendPoints: (
    recipientEmail: string,
    points: number,
    description?: string,
  ) => Promise<CbtWalletActionResult>;

  receivePoints: (
    senderEmail: string,
    points: number,
  ) => Promise<CbtWalletActionResult>;

  /* Reward actions */
  redeemReward: (
    rewardId: string,
  ) => Promise<CbtWalletActionResult>;

  /* Helpers */
  clearMessages: () => void;
}

/* ============================================================
 * MOCK WALLET
 * ============================================================
 */

const createMockWallet = (): CbtWallet => ({
  _id: "mock-wallet-001",
  userId: "mock-student-001",
  points: 2450,
  createdAt: "2026-08-01T10:00:00.000Z",
  updatedAt: "2026-09-12T18:00:00.000Z",
});

/* ============================================================
 * MOCK TRANSACTIONS
 * ============================================================
 */

const createMockTransactions = (): CbtTransaction[] => [
  {
    _id: "transaction-001",
    userId: "mock-student-001",
    type: "earned",
    amount: 150,
    balanceBefore: 2300,
    balanceAfter: 2450,
    description: "Completed Biology CBT practice",
    status: "completed",
    reference: "CBT-EARN-001",
    createdAt: "2026-09-12T17:45:00.000Z",
    updatedAt: "2026-09-12T17:45:00.000Z",
  },

  {
    _id: "transaction-002",
    userId: "mock-student-001",
    type: "contest-entry",
    amount: 100,
    balanceBefore: 2400,
    balanceAfter: 2300,
    description: "Solve & Win competition entry",
    status: "completed",
    reference: "CONTEST-001",
    createdAt: "2026-09-11T15:20:00.000Z",
    updatedAt: "2026-09-11T15:20:00.000Z",
  },

  {
    _id: "transaction-003",
    userId: "mock-student-001",
    type: "bonus",
    amount: 300,
    balanceBefore: 2100,
    balanceAfter: 2400,
    description: "Weekly practice bonus",
    status: "completed",
    reference: "BONUS-001",
    createdAt: "2026-09-10T09:30:00.000Z",
    updatedAt: "2026-09-10T09:30:00.000Z",
  },

  {
    _id: "transaction-004",
    userId: "mock-student-001",
    type: "received",
    amount: 200,
    balanceBefore: 1900,
    balanceAfter: 2100,
    senderEmail: "student@example.com",
    description: "CBT points received",
    status: "completed",
    reference: "RECEIVE-001",
    createdAt: "2026-09-08T13:10:00.000Z",
    updatedAt: "2026-09-08T13:10:00.000Z",
  },

  {
    _id: "transaction-005",
    userId: "mock-student-001",
    type: "sent",
    amount: 50,
    balanceBefore: 1950,
    balanceAfter: 1900,
    recipientEmail: "friend@example.com",
    description: "Sent CBT points to a friend",
    status: "completed",
    reference: "SEND-001",
    createdAt: "2026-09-07T11:25:00.000Z",
    updatedAt: "2026-09-07T11:25:00.000Z",
  },

  {
    _id: "transaction-006",
    userId: "mock-student-001",
    type: "redeemed",
    amount: 500,
    balanceBefore: 2450,
    balanceAfter: 1950,
    description: "Redeemed JAMB League study reward",
    status: "completed",
    reference: "REDEEM-001",
    createdAt: "2026-09-05T16:00:00.000Z",
    updatedAt: "2026-09-05T16:00:00.000Z",
  },
];

/* ============================================================
 * MOCK REWARDS
 * ============================================================
 */

const createMockRewards = (): CbtReward[] => [
  {
    _id: "reward-001",
    title: "JAMB Practice Pack",
    description: "Unlock an additional set of premium CBT practice questions.",
    pointsRequired: 500,
    category: "Practice",
    icon: "book-open",
    available: true,
    quantity: 100,
  },

  {
    _id: "reward-002",
    title: "CBT Mock Exam",
    description: "Access a full-length JAMB-style mock examination.",
    pointsRequired: 750,
    category: "Practice",
    icon: "graduation-cap",
    available: true,
    quantity: 50,
  },

  {
    _id: "reward-003",
    title: "Solve & Win Entry",
    description: "Use your CBT points to enter an eligible competition.",
    pointsRequired: 1000,
    category: "Competition",
    icon: "trophy",
    available: true,
    quantity: 25,
  },

  {
    _id: "reward-004",
    title: "Premium Study Session",
    description: "Unlock a premium guided study session.",
    pointsRequired: 1500,
    category: "Learning",
    icon: "sparkles",
    available: true,
    quantity: 10,
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

const normalizeEmail = (email: string) =>
  email.trim().toLowerCase();

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizePoints = (points: number) =>
  Math.floor(Number(points));

/* ============================================================
 * HOOK
 * ============================================================
 */

export function useCbtWallet(): UseCbtWalletReturn {
  const [wallet, setWallet] = useState<CbtWallet>(
    createMockWallet,
  );

  const [transactions, setTransactions] = useState<CbtTransaction[]>(
    createMockTransactions,
  );

  const [rewards, setRewards] = useState<CbtReward[]>(
    createMockRewards,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );

  /* ==========================================================
   * BASIC WALLET DATA
   * ==========================================================
   */

  const balance = wallet.points ?? 0;

  const formattedBalance = useMemo(
    () => formatCbtPoints(balance),
    [balance],
  );

  /* ==========================================================
   * RECENT TRANSACTIONS
   * ==========================================================
   */

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        const first = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const second = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return second - first;
      })
      .slice(0, 5);
  }, [transactions]);

  /* ==========================================================
   * AVAILABLE REWARDS
   * ==========================================================
   */

  const availableRewards = useMemo(() => {
    return rewards.filter(
      (reward) =>
        reward.available !== false &&
        (reward.quantity === undefined || reward.quantity > 0),
    );
  }, [rewards]);

  /* ==========================================================
   * WALLET STATISTICS
   * ==========================================================
   */

  const stats = useMemo<CbtWalletStats>(() => {
    return transactions.reduce(
      (result, transaction) => {
        const amount = Math.abs(transaction.amount || 0);

        switch (transaction.type) {
          case "earned":
            result.totalEarned += amount;
            break;

          case "sent":
            result.totalSent += amount;
            break;

          case "received":
            result.totalReceived += amount;
            break;

          case "redeemed":
          case "contest-entry":
            result.totalRedeemed += amount;
            break;

          case "bonus":
            result.totalBonus += amount;
            break;

          default:
            break;
        }

        return result;
      },
      {
        totalEarned: 0,
        totalSent: 0,
        totalReceived: 0,
        totalRedeemed: 0,
        totalBonus: 0,
      },
    );
  }, [transactions]);

  /* ==========================================================
   * CLEAR MESSAGES
   * ==========================================================
   */

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  /* ==========================================================
   * REFRESH WALLET
   * ==========================================================
   */

  const refreshWallet = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      /*
       * MOCK ONLY
       *
       * Later this section can become:
       *
       * const response = await getCbtWallet(userId);
       * setWallet(response.data);
       *
       * and optionally:
       *
       * const transactionList =
       *   await getCbtTransactionList(userId);
       *
       * setTransactions(transactionList);
       */

      await wait(500);

      setWallet((currentWallet) => ({
        ...currentWallet,
        updatedAt: new Date().toISOString(),
      }));
    } catch (err) {
      console.error("Failed to refresh CBT wallet:", err);

      setError("Unable to refresh your CBT wallet.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  /* ==========================================================
   * SEND POINTS
   * ==========================================================
   */

  const sendPoints = useCallback(
    async (
      recipientEmail: string,
      points: number,
      description = "CBT points transfer",
    ): Promise<CbtWalletActionResult> => {
      clearMessages();

      const email = normalizeEmail(recipientEmail);
      const amount = normalizePoints(points);

      if (!email) {
        const message = "Enter the recipient's email address.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (!isValidEmail(email)) {
        const message = "Enter a valid recipient email address.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        const message = "Enter a valid number of CBT points.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (amount > balance) {
        const message =
          "You do not have enough CBT points for this transfer.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      setIsSending(true);

      try {
        /*
         * MOCK ONLY
         *
         * Later:
         *
         * await sendCbtPoints({
         *   recipientEmail: email,
         *   points: amount,
         *   description,
         * });
         */

        await wait(700);

        const balanceBefore = balance;
        const balanceAfter = balanceBefore - amount;

        const transaction: CbtTransaction = {
          _id: `mock-send-${Date.now()}`,
          userId: wallet.userId,
          type: "sent",
          amount,
          balanceBefore,
          balanceAfter,
          recipientEmail: email,
          description,
          status: "completed",
          reference: `SEND-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setWallet((currentWallet) => ({
          ...currentWallet,
          points: currentWallet.points - amount,
          updatedAt: new Date().toISOString(),
        }));

        setTransactions((currentTransactions) => [
          transaction,
          ...currentTransactions,
        ]);

        const message = `${formatCbtPoints(amount)} CBT points sent successfully.`;

        setSuccessMessage(message);

        return {
          success: true,
          message,
        };
      } catch (err) {
        console.error("Failed to send CBT points:", err);

        const message =
          "We could not send the CBT points. Please try again.";

        setError(message);

        return {
          success: false,
          message,
        };
      } finally {
        setIsSending(false);
      }
    },
    [balance, clearMessages, wallet.userId],
  );

  /* ==========================================================
   * RECEIVE POINTS
   * ==========================================================
   */

  const receivePoints = useCallback(
    async (
      senderEmail: string,
      points: number,
    ): Promise<CbtWalletActionResult> => {
      clearMessages();

      const email = normalizeEmail(senderEmail);
      const amount = normalizePoints(points);

      if (!email) {
        const message = "Enter the sender's email address.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (!isValidEmail(email)) {
        const message = "Enter a valid sender email address.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        const message = "Enter a valid number of CBT points.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      setIsReceiving(true);

      try {
        /*
         * MOCK ONLY
         *
         * Later:
         *
         * await receiveCbtPoints({
         *   email,
         * });
         *
         * The actual backend may instead require a transfer
         * reference or transfer ID.
         */

        await wait(700);

        const balanceBefore = balance;
        const balanceAfter = balanceBefore + amount;

        const transaction: CbtTransaction = {
          _id: `mock-receive-${Date.now()}`,
          userId: wallet.userId,
          type: "received",
          amount,
          balanceBefore,
          balanceAfter,
          senderEmail: email,
          description: "CBT points received",
          status: "completed",
          reference: `RECEIVE-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setWallet((currentWallet) => ({
          ...currentWallet,
          points: currentWallet.points + amount,
          updatedAt: new Date().toISOString(),
        }));

        setTransactions((currentTransactions) => [
          transaction,
          ...currentTransactions,
        ]);

        const message = `${formatCbtPoints(amount)} CBT points received successfully.`;

        setSuccessMessage(message);

        return {
          success: true,
          message,
        };
      } catch (err) {
        console.error("Failed to receive CBT points:", err);

        const message =
          "We could not process the CBT points. Please try again.";

        setError(message);

        return {
          success: false,
          message,
        };
      } finally {
        setIsReceiving(false);
      }
    },
    [balance, clearMessages, wallet.userId],
  );

  /* ==========================================================
   * REDEEM REWARD
   * ==========================================================
   */

  const redeemReward = useCallback(
    async (
      rewardId: string,
    ): Promise<CbtWalletActionResult> => {
      clearMessages();

      if (!rewardId) {
        const message = "Please select a reward.";

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
        const message = "The selected reward could not be found.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (reward.available === false) {
        const message = "This reward is currently unavailable.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (
        reward.quantity !== undefined &&
        reward.quantity <= 0
      ) {
        const message = "This reward is currently out of stock.";

        setError(message);

        return {
          success: false,
          message,
        };
      }

      if (balance < reward.pointsRequired) {
        const message =
          "You do not have enough CBT points to redeem this reward.";

        setError(message);

        return {
          success: false,
          message,
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

        const pointsUsed = reward.pointsRequired;

        const balanceBefore = balance;
        const balanceAfter = balanceBefore - pointsUsed;

        const transaction: CbtTransaction = {
          _id: `mock-redeem-${Date.now()}`,
          userId: wallet.userId,
          type: "redeemed",
          amount: pointsUsed,
          balanceBefore,
          balanceAfter,
          description: `Redeemed ${reward.title}`,
          status: "completed",
          reference: `REDEEM-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setWallet((currentWallet) => ({
          ...currentWallet,
          points: currentWallet.points - pointsUsed,
          updatedAt: new Date().toISOString(),
        }));

        setTransactions((currentTransactions) => [
          transaction,
          ...currentTransactions,
        ]);

        setRewards((currentRewards) =>
          currentRewards.map((currentReward) => {
            if (
              currentReward._id !== rewardId ||
              currentReward.quantity === undefined
            ) {
              return currentReward;
            }

            const remainingQuantity =
              currentReward.quantity - 1;

            return {
              ...currentReward,
              quantity: remainingQuantity,
              available: remainingQuantity > 0,
            };
          }),
        );

        const message = `${reward.title} redeemed successfully.`;

        setSuccessMessage(message);

        return {
          success: true,
          message,
        };
      } catch (err) {
        console.error("Failed to redeem CBT reward:", err);

        const message =
          "We could not redeem this reward. Please try again.";

        setError(message);

        return {
          success: false,
          message,
        };
      } finally {
        setIsRedeeming(false);
      }
    },
    [balance, clearMessages, rewards, wallet.userId],
  );

  /* ==========================================================
   * RETURN
   * ==========================================================
   */

  return {
    /* Wallet */
    wallet,
    balance,
    formattedBalance,

    /* Transactions */
    transactions,
    recentTransactions,
    transactionCount: transactions.length,

    /* Rewards */
    rewards,
    availableRewards,

    /* Statistics */
    stats,

    /* Loading */
    isLoading,
    isRefreshing,
    isSending,
    isReceiving,
    isRedeeming,

    /* Feedback */
    error,
    successMessage,

    /* Actions */
    refreshWallet,
    sendPoints,
    receivePoints,
    redeemReward,

    /* Helpers */
    clearMessages,
  };
}

/* ============================================================
 * OPTIONAL TRANSACTION HELPERS
 * ============================================================
 *
 * These are exported separately so components can use the same
 * transaction formatting logic without duplicating it.
 */

export const getTransactionLabel = (
  transaction: CbtTransaction,
): string => {
  return getCbtTransactionLabel(transaction.type);
};

export const getTransactionSign = (
  transaction: CbtTransaction,
): "+" | "-" => {
  return getCbtTransactionSign(transaction.type);
};

export const isCreditTransaction = (
  transaction: CbtTransaction,
): boolean => {
  return isCbtCreditTransaction(transaction.type);
};

export const isDebitTransaction = (
  transaction: CbtTransaction,
): boolean => {
  return isCbtDebitTransaction(transaction.type);
};

export const formatTransactionAmount = (
  transaction: CbtTransaction,
): string => {
  return `${getCbtTransactionSign(transaction.type)}${formatCbtPoints(
    Math.abs(transaction.amount),
  )}`;
};