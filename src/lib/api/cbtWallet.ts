






// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\api\cbtApi.ts

import { axiosInstance } from "@/lib/api/axios";

/**
 * ============================================================
 * CBT WALLET / CBT PRACTICE API
 * ============================================================
 *
 * This file contains the API layer for:
 *
 * - CBT Wallet
 * - CBT Points
 * - CBT Wallet Transactions
 * - Sending CBT Points
 * - Receiving CBT Points
 * - Rewards
 * - Redeeming CBT Points
 *
 * The CBT Wallet page can currently use mock data.
 * When the backend endpoints are ready, replace the relevant
 * endpoint paths below without changing the UI components.
 *
 * Existing backend wallet endpoint:
 *
 * GET
 * /practice-wallet/get-user-practice-wallet/{userId}
 *
 * ============================================================
 */

/* ============================================================
 * TYPES
 * ============================================================
 */

export interface CbtWallet {
  _id: string;
  userId: string;
  points: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CbtWalletResponse {
  success: boolean;
  message?: string;
  data: CbtWallet;
}

export interface CbtTransaction {
  _id: string;

  userId?: string;

  type:
    | "earned"
    | "sent"
    | "received"
    | "redeemed"
    | "bonus"
    | "contest-entry"
    | "refund";

  amount: number;

  balanceBefore?: number;
  balanceAfter?: number;

  description?: string;

  recipientEmail?: string;
  senderEmail?: string;

  reference?: string;

  status?: "pending" | "completed" | "failed" | "cancelled";

  createdAt?: string;
  updatedAt?: string;
}

export interface CbtTransactionsResponse {
  success: boolean;
  message?: string;

  data:
    | CbtTransaction[]
    | {
        transactions: CbtTransaction[];
        totalCount?: number;
        totalPages?: number;
      };
}

export interface SendCbtPointsPayload {
  senderUserId?: string;
  recipientEmail: string;
  points: number;
  description?: string;
}

export interface SendCbtPointsResponse {
  success: boolean;
  message?: string;
  data?: CbtTransaction | CbtWallet;
}

export interface ReceiveCbtPointsRequest {
  email: string;
}

export interface ReceiveCbtPointsResponse {
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    email?: string;
    points?: number;
    transaction?: CbtTransaction;
  };
}

export interface CbtReward {
  _id: string;

  title: string;
  description?: string;

  pointsRequired: number;

  category?: string;

  image?: string;
  icon?: string;

  available?: boolean;

  quantity?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface CbtRewardsResponse {
  success: boolean;
  message?: string;
  data: CbtReward[];
}

export interface RedeemCbtRewardPayload {
  userId?: string;
  rewardId: string;
}

export interface RedeemCbtRewardResponse {
  success: boolean;
  message?: string;

  data?: {
    reward?: CbtReward;
    transaction?: CbtTransaction;
    remainingPoints?: number;
  };
}

/* ============================================================
 * API ENDPOINTS
 * ============================================================
 *
 * Keep all endpoint strings here so they can easily be changed
 * when the backend API documentation is finalized.
 */

const ENDPOINTS = {
  wallet: {
    getByUserId: (userId: string) =>
      `/practice-wallet/get-user-practice-wallet/${userId}`,
  },

  transactions: {
    getByUserId: (userId: string) =>
      `/practice-wallet/get-user-practice-wallet-transactions/${userId}`,
  },

  transfer: {
    send: `/practice-wallet/send-cbt-points`,
    receive: `/practice-wallet/receive-cbt-points`,
  },

  rewards: {
    getAll: `/practice-wallet/get-cbt-rewards`,
    redeem: `/practice-wallet/redeem-cbt-reward`,
  },
} as const;

/* ============================================================
 * WALLET
 * ============================================================
 */

/**
 * Get the CBT wallet belonging to a user.
 *
 * Existing backend endpoint:
 * GET /practice-wallet/get-user-practice-wallet/{userId}
 */
export const getCbtWallet = async (
  userId: string,
): Promise<CbtWalletResponse> => {
  if (!userId) {
    throw new Error("User ID is required to fetch CBT wallet.");
  }

  const response = await axiosInstance.get<CbtWalletResponse>(
    ENDPOINTS.wallet.getByUserId(userId),
  );

  return response.data;
};

/**
 * Convenience helper that returns only the wallet object.
 */
export const getCbtWalletData = async (
  userId: string,
): Promise<CbtWallet> => {
  const response = await getCbtWallet(userId);

  return response.data;
};

/* ============================================================
 * TRANSACTIONS
 * ============================================================
 */

/**
 * Get CBT wallet transactions.
 *
 * NOTE:
 * The endpoint is kept in one place because the backend
 * transaction endpoint may still change.
 */
export const getCbtTransactions = async (
  userId: string,
): Promise<CbtTransactionsResponse> => {
  if (!userId) {
    throw new Error("User ID is required to fetch CBT transactions.");
  }

  const response = await axiosInstance.get<CbtTransactionsResponse>(
    ENDPOINTS.transactions.getByUserId(userId),
  );

  return response.data;
};

/**
 * Normalize the possible transaction response shapes.
 *
 * This allows the UI to work whether the backend returns:
 *
 * data: [...]
 *
 * OR:
 *
 * data: {
 *   transactions: [...]
 * }
 */
export const getCbtTransactionList = async (
  userId: string,
): Promise<CbtTransaction[]> => {
  const response = await getCbtTransactions(userId);

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data?.transactions ?? [];
};

/* ============================================================
 * SEND CBT POINTS
 * ============================================================
 */

/**
 * Send CBT points to another student using their email.
 *
 * Example:
 *
 * {
 *   recipientEmail: "student@example.com",
 *   points: 50,
 *   description: "Practice reward"
 * }
 */
export const sendCbtPoints = async (
  payload: SendCbtPointsPayload,
): Promise<SendCbtPointsResponse> => {
  if (!payload.recipientEmail?.trim()) {
    throw new Error("Recipient email is required.");
  }

  if (!Number.isFinite(payload.points) || payload.points <= 0) {
    throw new Error("Points must be greater than zero.");
  }

  const response = await axiosInstance.post<SendCbtPointsResponse>(
    ENDPOINTS.transfer.send,
    payload,
  );

  return response.data;
};

/* ============================================================
 * RECEIVE CBT POINTS
 * ============================================================
 */

/**
 * Request/confirm receiving CBT points.
 *
 * This is intentionally kept separate from `sendCbtPoints`
 * because the backend may implement receiving as:
 *
 * - accepting a transfer
 * - claiming a reward
 * - receiving from another user
 * - receiving through a transfer reference
 */
export const receiveCbtPoints = async (
  payload: ReceiveCbtPointsRequest,
): Promise<ReceiveCbtPointsResponse> => {
  if (!payload.email?.trim()) {
    throw new Error("Email is required.");
  }

  const response = await axiosInstance.post<ReceiveCbtPointsResponse>(
    ENDPOINTS.transfer.receive,
    payload,
  );

  return response.data;
};

/* ============================================================
 * REWARDS
 * ============================================================
 */

/**
 * Get all available CBT rewards.
 */
export const getCbtRewards = async (): Promise<CbtRewardsResponse> => {
  const response = await axiosInstance.get<CbtRewardsResponse>(
    ENDPOINTS.rewards.getAll,
  );

  return response.data;
};

/**
 * Redeem CBT points for a reward.
 */
export const redeemCbtReward = async (
  payload: RedeemCbtRewardPayload,
): Promise<RedeemCbtRewardResponse> => {
  if (!payload.rewardId) {
    throw new Error("Reward ID is required.");
  }

  const response = await axiosInstance.post<RedeemCbtRewardResponse>(
    ENDPOINTS.rewards.redeem,
    payload,
  );

  return response.data;
};

/* ============================================================
 * UTILITY FUNCTIONS
 * ============================================================
 */

/**
 * Format CBT points consistently across the application.
 *
 * Example:
 *
 * 1000 -> "1,000"
 */
export const formatCbtPoints = (points: number): string => {
  return new Intl.NumberFormat("en-NG").format(points || 0);
};

/**
 * Get a human-readable transaction label.
 */
export const getCbtTransactionLabel = (
  type: CbtTransaction["type"],
): string => {
  switch (type) {
    case "earned":
      return "Practice Reward";

    case "sent":
      return "Points Sent";

    case "received":
      return "Points Received";

    case "redeemed":
      return "Reward Redeemed";

    case "bonus":
      return "Bonus Points";

    case "contest-entry":
      return "Competition Entry";

    case "refund":
      return "Points Refunded";

    default:
      return "CBT Points";
  }
};

/**
 * Return the sign used when displaying a transaction amount.
 */
export const getCbtTransactionSign = (
  type: CbtTransaction["type"],
): "+" | "-" => {
  switch (type) {
    case "sent":
    case "redeemed":
    case "contest-entry":
      return "-";

    case "earned":
    case "received":
    case "bonus":
    case "refund":
    default:
      return "+";
  }
};

/**
 * Determine whether a transaction adds points to the wallet.
 */
export const isCbtCreditTransaction = (
  type: CbtTransaction["type"],
): boolean => {
  return ["earned", "received", "bonus", "refund"].includes(type);
};

/**
 * Determine whether a transaction removes points from the wallet.
 */
export const isCbtDebitTransaction = (
  type: CbtTransaction["type"],
): boolean => {
  return ["sent", "redeemed", "contest-entry"].includes(type);
};

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

const cbtApi = {
  getCbtWallet,
  getCbtWalletData,

  getCbtTransactions,
  getCbtTransactionList,

  sendCbtPoints,
  receiveCbtPoints,

  getCbtRewards,
  redeemCbtReward,

  formatCbtPoints,
  getCbtTransactionLabel,
  getCbtTransactionSign,

  isCbtCreditTransaction,
  isCbtDebitTransaction,
};

export default cbtApi;