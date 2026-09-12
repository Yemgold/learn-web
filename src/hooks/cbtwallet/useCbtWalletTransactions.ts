




"use client";

import { useCallback, useMemo, useState } from "react";

import {
  formatCbtPoints,
  getCbtTransactionLabel,
  getCbtTransactionSign,
  isCbtCreditTransaction,
  isCbtDebitTransaction,
  type CbtTransaction,
} from "@/lib/api/cbtWallet";

/**
 * ============================================================
 * CBT WALLET TRANSACTIONS HOOK
 * ============================================================
 *
 * Currently uses MOCK DATA.
 *
 * Responsibilities:
 *
 * - Load CBT wallet transactions
 * - Search transactions
 * - Filter by transaction type
 * - Filter by status
 * - Calculate transaction statistics
 * - Show recent transactions
 * - Load more transactions
 * - Format transaction amounts
 * - Identify credit/debit transactions
 *
 * Ready for future API integration.
 * ============================================================
 */

export type CbtTransactionFilter =
  | "all"
  | "earned"
  | "sent"
  | "received"
  | "redeemed"
  | "bonus"
  | "contest-entry"
  | "refund";

export type CbtTransactionStatusFilter =
  | "all"
  | "completed"
  | "pending"
  | "failed"
  | "cancelled";

export interface CbtTransactionStats {
  totalTransactions: number;

  totalCredits: number;
  totalDebits: number;

  totalEarned: number;
  totalSent: number;
  totalReceived: number;
  totalRedeemed: number;
  totalBonus: number;
  totalContestEntries: number;
  totalRefunds: number;
}

export interface UseCbtWalletTransactionsOptions {
  initialTransactions?: CbtTransaction[];
  pageSize?: number;
}

export interface UseCbtWalletTransactionsReturn {
  /* Data */
  transactions: CbtTransaction[];
  filteredTransactions: CbtTransaction[];
  recentTransactions: CbtTransaction[];

  /* Filters */
  selectedFilter: CbtTransactionFilter;
  selectedStatus: CbtTransactionStatusFilter;
  searchQuery: string;

  /* Statistics */
  stats: CbtTransactionStats;

  /* Counts */
  transactionCount: number;
  filteredTransactionCount: number;

  /* Pagination */
  visibleCount: number;
  hasMore: boolean;

  /* Loading */
  isLoading: boolean;
  isRefreshing: boolean;

  /* Feedback */
  error: string | null;

  /* Actions */
  refreshTransactions: () => Promise<void>;
  loadMore: () => void;

  setFilter: (filter: CbtTransactionFilter) => void;
  setStatusFilter: (
    status: CbtTransactionStatusFilter,
  ) => void;
  setSearchQuery: (value: string) => void;

  clearFilters: () => void;

  /* Helpers */
  getTransactionLabel: (
    transaction: CbtTransaction,
  ) => string;

  getTransactionSign: (
    transaction: CbtTransaction,
  ) => "+" | "-";

  formatTransactionAmount: (
    transaction: CbtTransaction,
  ) => string;

  isCreditTransaction: (
    transaction: CbtTransaction,
  ) => boolean;

  isDebitTransaction: (
    transaction: CbtTransaction,
  ) => boolean;

  getTransactionDescription: (
    transaction: CbtTransaction,
  ) => string;
}

/* ============================================================
 * MOCK DATA
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

  {
    _id: "transaction-007",
    userId: "mock-student-001",
    type: "earned",
    amount: 100,
    balanceBefore: 2350,
    balanceAfter: 2450,
    description: "Completed Chemistry CBT practice",
    status: "completed",
    reference: "CBT-EARN-002",
    createdAt: "2026-09-04T18:40:00.000Z",
    updatedAt: "2026-09-04T18:40:00.000Z",
  },

  {
    _id: "transaction-008",
    userId: "mock-student-001",
    type: "received",
    amount: 350,
    balanceBefore: 2000,
    balanceAfter: 2350,
    senderEmail: "classmate@example.com",
    description: "CBT points received from classmate",
    status: "completed",
    reference: "RECEIVE-002",
    createdAt: "2026-09-03T14:20:00.000Z",
    updatedAt: "2026-09-03T14:20:00.000Z",
  },

  {
    _id: "transaction-009",
    userId: "mock-student-001",
    type: "earned",
    amount: 200,
    balanceBefore: 1800,
    balanceAfter: 2000,
    description: "Completed Physics CBT practice",
    status: "completed",
    reference: "CBT-EARN-003",
    createdAt: "2026-09-02T10:15:00.000Z",
    updatedAt: "2026-09-02T10:15:00.000Z",
  },

  {
    _id: "transaction-010",
    userId: "mock-student-001",
    type: "bonus",
    amount: 250,
    balanceBefore: 1550,
    balanceAfter: 1800,
    description: "Daily learning streak bonus",
    status: "completed",
    reference: "STREAK-001",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },

  {
    _id: "transaction-011",
    userId: "mock-student-001",
    type: "sent",
    amount: 100,
    balanceBefore: 1650,
    balanceAfter: 1550,
    recipientEmail: "studybuddy@example.com",
    description: "Sent points to study partner",
    status: "completed",
    reference: "SEND-002",
    createdAt: "2026-08-30T16:30:00.000Z",
    updatedAt: "2026-08-30T16:30:00.000Z",
  },

  {
    _id: "transaction-012",
    userId: "mock-student-001",
    type: "refund",
    amount: 100,
    balanceBefore: 1550,
    balanceAfter: 1650,
    description: "Competition entry refund",
    status: "completed",
    reference: "REFUND-001",
    createdAt: "2026-08-28T12:00:00.000Z",
    updatedAt: "2026-08-28T12:00:00.000Z",
  },

  {
    _id: "transaction-013",
    userId: "mock-student-001",
    type: "redeemed",
    amount: 750,
    balanceBefore: 2300,
    balanceAfter: 1550,
    description: "Redeemed CBT Mock Exam",
    status: "completed",
    reference: "REDEEM-002",
    createdAt: "2026-08-25T09:45:00.000Z",
    updatedAt: "2026-08-25T09:45:00.000Z",
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

export function useCbtWalletTransactions(
  options: UseCbtWalletTransactionsOptions = {},
): UseCbtWalletTransactionsReturn {
  const {
    initialTransactions,
    pageSize = 8,
  } = options;

  const [transactions, setTransactions] = useState<
    CbtTransaction[]
  >(
    initialTransactions ??
      createMockTransactions(),
  );

  const [selectedFilter, setSelectedFilter] =
    useState<CbtTransactionFilter>("all");

  const [selectedStatus, setSelectedStatus] =
    useState<CbtTransactionStatusFilter>("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [visibleCount, setVisibleCount] =
    useState(pageSize);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ==========================================================
   * SORT TRANSACTIONS
   * ==========================================================
   */

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const first = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const second = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return second - first;
    });
  }, [transactions]);

  /* ==========================================================
   * FILTER TRANSACTIONS
   * ==========================================================
   */

  const filteredTransactions = useMemo(() => {
    const normalizedSearch =
      normalizeSearch(searchQuery);

    return sortedTransactions.filter(
      (transaction) => {
        /* ----------------------------------------------
         * Type filter
         * ----------------------------------------------
         */

        if (
          selectedFilter !== "all" &&
          transaction.type !== selectedFilter
        ) {
          return false;
        }

        /* ----------------------------------------------
         * Status filter
         * ----------------------------------------------
         */

        if (
          selectedStatus !== "all" &&
          transaction.status !== selectedStatus
        ) {
          return false;
        }

        /* ----------------------------------------------
         * Search
         * ----------------------------------------------
         */

        if (!normalizedSearch) {
          return true;
        }

        const searchableText = [
          transaction.description,
          transaction.reference,
          transaction.recipientEmail,
          transaction.senderEmail,
          transaction.type,
          transaction.status,
          getCbtTransactionLabel(
            transaction.type,
          ),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch,
        );
      },
    );
  }, [
    searchQuery,
    selectedFilter,
    selectedStatus,
    sortedTransactions,
  ]);

  /* ==========================================================
   * VISIBLE TRANSACTIONS
   * ==========================================================
   */

  const visibleTransactions = useMemo(() => {
    return filteredTransactions.slice(
      0,
      visibleCount,
    );
  }, [
    filteredTransactions,
    visibleCount,
  ]);

  /* ==========================================================
   * RECENT TRANSACTIONS
   * ==========================================================
   */

  const recentTransactions = useMemo(() => {
    return sortedTransactions.slice(0, 5);
  }, [sortedTransactions]);

  /* ==========================================================
   * HAS MORE
   * ==========================================================
   */

  const hasMore =
    visibleCount < filteredTransactions.length;

  /* ==========================================================
   * STATISTICS
   * ==========================================================
   */

  const stats = useMemo<CbtTransactionStats>(() => {
    return transactions.reduce(
      (result, transaction) => {
        const amount = Math.abs(
          transaction.amount || 0,
        );

        result.totalTransactions += 1;

        if (
          isCbtCreditTransaction(
            transaction.type,
          )
        ) {
          result.totalCredits += amount;
        }

        if (
          isCbtDebitTransaction(
            transaction.type,
          )
        ) {
          result.totalDebits += amount;
        }

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
            result.totalRedeemed += amount;
            break;

          case "bonus":
            result.totalBonus += amount;
            break;

          case "contest-entry":
            result.totalContestEntries += amount;
            break;

          case "refund":
            result.totalRefunds += amount;
            break;

          default:
            break;
        }

        return result;
      },
      {
        totalTransactions: 0,

        totalCredits: 0,
        totalDebits: 0,

        totalEarned: 0,
        totalSent: 0,
        totalReceived: 0,
        totalRedeemed: 0,
        totalBonus: 0,
        totalContestEntries: 0,
        totalRefunds: 0,
      },
    );
  }, [transactions]);

  /* ==========================================================
   * REFRESH
   * ==========================================================
   */

  const refreshTransactions = useCallback(
    async () => {
      setIsRefreshing(true);
      setError(null);

      try {
        /*
         * MOCK ONLY
         *
         * Later:
         *
         * const data =
         *   await getCbtTransactionList(userId);
         *
         * setTransactions(data);
         */

        await wait(500);

        setTransactions(
          (currentTransactions) => [
            ...currentTransactions,
          ],
        );

        setVisibleCount(pageSize);
      } catch (err) {
        console.error(
          "Failed to refresh CBT transactions:",
          err,
        );

        setError(
          "Unable to refresh transactions. Please try again.",
        );
      } finally {
        setIsRefreshing(false);
      }
    },
    [pageSize],
  );

  /* ==========================================================
   * LOAD MORE
   * ==========================================================
   */

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) {
      return;
    }

    setIsLoading(true);

    /*
     * This timeout simulates an API request.
     */

    window.setTimeout(() => {
      setVisibleCount(
        (currentCount) =>
          Math.min(
            currentCount + pageSize,
            filteredTransactions.length,
          ),
      );

      setIsLoading(false);
    }, 400);
  }, [
    filteredTransactions.length,
    hasMore,
    isLoading,
    pageSize,
  ]);

  /* ==========================================================
   * SET TYPE FILTER
   * ==========================================================
   */

  const setFilter = useCallback(
    (filter: CbtTransactionFilter) => {
      setSelectedFilter(filter);
      setVisibleCount(pageSize);
    },
    [pageSize],
  );

  /* ==========================================================
   * SET STATUS FILTER
   * ==========================================================
   */

  const setStatusFilter = useCallback(
    (
      status: CbtTransactionStatusFilter,
    ) => {
      setSelectedStatus(status);
      setVisibleCount(pageSize);
    },
    [pageSize],
  );

  /* ==========================================================
   * SET SEARCH
   * ==========================================================
   */

  const handleSetSearchQuery = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setVisibleCount(pageSize);
    },
    [pageSize],
  );

  /* ==========================================================
   * CLEAR FILTERS
   * ==========================================================
   */

  const clearFilters = useCallback(() => {
    setSelectedFilter("all");
    setSelectedStatus("all");
    setSearchQuery("");
    setVisibleCount(pageSize);
  }, [pageSize]);

  /* ==========================================================
   * TRANSACTION LABEL
   * ==========================================================
   */

  const getTransactionLabel = useCallback(
    (transaction: CbtTransaction): string => {
      return getCbtTransactionLabel(
        transaction.type,
      );
    },
    [],
  );

  /* ==========================================================
   * TRANSACTION SIGN
   * ==========================================================
   */

  const getTransactionSign = useCallback(
    (
      transaction: CbtTransaction,
    ): "+" | "-" => {
      return getCbtTransactionSign(
        transaction.type,
      );
    },
    [],
  );

  /* ==========================================================
   * TRANSACTION AMOUNT
   * ==========================================================
   */

  const formatTransactionAmount =
    useCallback(
      (
        transaction: CbtTransaction,
      ): string => {
        return `${getCbtTransactionSign(
          transaction.type,
        )}${formatCbtPoints(
          Math.abs(transaction.amount || 0),
        )}`;
      },
      [],
    );

  /* ==========================================================
   * CREDIT CHECK
   * ==========================================================
   */

  const checkIsCreditTransaction =
    useCallback(
      (
        transaction: CbtTransaction,
      ): boolean => {
        return isCbtCreditTransaction(
          transaction.type,
        );
      },
      [],
    );

  /* ==========================================================
   * DEBIT CHECK
   * ==========================================================
   */

  const checkIsDebitTransaction =
    useCallback(
      (
        transaction: CbtTransaction,
      ): boolean => {
        return isCbtDebitTransaction(
          transaction.type,
        );
      },
      [],
    );

  /* ==========================================================
   * TRANSACTION DESCRIPTION
   * ==========================================================
   */

  const getTransactionDescription =
    useCallback(
      (
        transaction: CbtTransaction,
      ): string => {
        if (transaction.description) {
          return transaction.description;
        }

        switch (transaction.type) {
          case "earned":
            return "CBT practice reward";

          case "sent":
            return transaction.recipientEmail
              ? `Sent to ${transaction.recipientEmail}`
              : "CBT points sent";

          case "received":
            return transaction.senderEmail
              ? `Received from ${transaction.senderEmail}`
              : "CBT points received";

          case "redeemed":
            return "CBT reward redeemed";

          case "bonus":
            return "Bonus CBT points";

          case "contest-entry":
            return "Competition entry";

          case "refund":
            return "CBT points refunded";

          default:
            return "CBT wallet transaction";
        }
      },
      [],
    );

  /* ==========================================================
   * RETURN
   * ==========================================================
   */

  return {
    /* Data */
    transactions: visibleTransactions,
    filteredTransactions,
    recentTransactions,

    /* Filters */
    selectedFilter,
    selectedStatus,
    searchQuery,

    /* Statistics */
    stats,

    /* Counts */
    transactionCount:
      transactions.length,

    filteredTransactionCount:
      filteredTransactions.length,

    /* Pagination */
    visibleCount,
    hasMore,

    /* Loading */
    isLoading,
    isRefreshing,

    /* Feedback */
    error,

    /* Actions */
    refreshTransactions,
    loadMore,

    setFilter,
    setStatusFilter,
    setSearchQuery:
      handleSetSearchQuery,

    clearFilters,

    /* Helpers */
    getTransactionLabel,
    getTransactionSign,
    formatTransactionAmount,
    isCreditTransaction:
      checkIsCreditTransaction,
    isDebitTransaction:
      checkIsDebitTransaction,
    getTransactionDescription,
  };
}

export default useCbtWalletTransactions;