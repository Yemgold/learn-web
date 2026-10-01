





export type WalletTransactionType =
  | "PRACTICE_EARNED"
  | "BONUS_EARNED"
  | "COMPETITION_ENTRY"
  | "COMPETITION_WIN"
  | "TRANSFER_SENT"
  | "TRANSFER_RECEIVED"
  | "REWARD_REDEMPTION";

export type WalletTransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "FAILED"
  | "CANCELLED";

export interface WalletTransaction {
  id: string;

  /**
   * Short transaction/reference ID.
   * Example: CBT-TRX-928341
   */
  reference: string;

  /**
   * Main transaction title.
   * Example: "Biology Practice"
   */
  title: string;

  /**
   * Additional information about the transaction.
   */
  description: string;

  /**
   * Positive amount = points received.
   * Negative amount = points spent.
   */
  amount: number;

  /**
   * Transaction type.
   */
  type: WalletTransactionType;

  /**
   * Current transaction status.
   */
  status: WalletTransactionStatus;

  /**
   * Display date.
   * Example: "Today, 6:42 PM"
   */
  date: string;

  /**
   * Optional ISO timestamp for sorting/filtering.
   */
  createdAt?: string;

  /**
   * Optional icon name used by the UI.
   * Example: "BookOpen", "Gift", "Trophy"
   */
  icon?: string;

  /**
   * Optional related entity.
   * Example:
   * - contest ID
   * - reward ID
   * - user ID
   */
  relatedId?: string;

  /**
   * Optional information about another student
   * involved in a transfer.
   */
  counterparty?: {
    userId?: string;
    name?: string;
    email?: string;
  };

  /**
   * Optional reward information.
   */
  reward?: {
    rewardId: string;
    title: string;
  };

  /**
   * Optional competition information.
   */
  competition?: {
    competitionId: string;
    title: string;
  };

  /**
   * Optional additional backend data.
   */
  metadata?: Record<string, unknown>;
}

/**
 * Filters used by the wallet transaction UI.
 */
export type WalletTransactionFilter =
  | "ALL"
  | "EARNED"
  | "SPENT";

/**
 * Summary information displayed on the wallet dashboard.
 */
export interface WalletTransactionSummary {
  totalEarned: number;

  totalSpent: number;

  totalReceived: number;

  totalSent: number;

  transactionCount: number;
}

/**
 * Result returned after creating a wallet transaction.
 */
export interface CreateWalletTransactionResult {
  transaction: WalletTransaction;

  balance: number;
}

/**
 * Wallet balance information.
 */
export interface CbtWalletBalance {
  availablePoints: number;

  totalEarned: number;

  totalSpent: number;

  totalReceived: number;

  totalSent: number;
}