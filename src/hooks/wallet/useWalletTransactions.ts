





// C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\wallet\useWalletTransactions.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  getWalletTransactions,
  type WalletTransactionsResponse,
} from "@/lib/api/wallet";

import { useAuthStore } from "@/stores/auth.store";

/* ============================================================
   UI TRANSACTION TYPE
============================================================ */

/*
 * Backend transaction:
 *
 * {
 *   amountInKobo: 10000
 * }
 *
 * UI transaction:
 *
 * {
 *   amount: 100
 * }
 *
 * This hook converts KOBO → NAIRA before returning
 * transactions to the UI.
 */

export interface WalletTransactionUI {
  _id: string;

  walletId: string;

  amount: number;

  type: "CREDIT" | "DEBIT";

  description: string;

  category?: string;

  withdrawalId?: string;

  referralLevel?: number;

  referredUserId?: string;

  referralUserId?: string;

  createdAt: string;

  updatedAt: string;
}

/* ============================================================
   QUERY KEY
============================================================ */

export const walletTransactionsQueryKey = (
  userId?: string,
  page: number = 1,
  limit: number = 10,
) =>
  [
    "wallet",
    "transactions",
    userId,
    page,
    limit,
  ] as const;

/* ============================================================
   EMPTY RESPONSE
============================================================ */

function createEmptyTransactionsResponse(): WalletTransactionsResponse {
  return {
    success: true,

    message: "No transactions found.",

    data: {
      transactionObj: [],

      totalCount: 0,

      totalPages: 0,
    },
  };
}

/* ============================================================
   CHECK 404 TRANSACTIONS NOT FOUND
============================================================ */

function isTransactionsNotFoundError(
  error: unknown,
): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status =
    error.response?.status;

  const responseData =
    error.response?.data;

  const backendStatus =
    responseData?.status;

  const message =
    typeof responseData?.message ===
    "string"
      ? responseData.message.toLowerCase()
      : "";

  return (
    status === 404 &&
    (
      backendStatus === 404 ||
      message.includes(
        "transactions not found",
      ) ||
      message.includes(
        "transaction not found",
      )
    )
  );
}

/* ============================================================
   NORMALIZE BACKEND TRANSACTION
============================================================ */

function normalizeTransaction(
  transaction: WalletTransactionsResponse["data"]["transactionObj"][number],
): WalletTransactionUI {
  /*
   * Backend sends amountInKobo.
   *
   * Example:
   *
   * 10000 kobo
   *
   * becomes:
   *
   * ₦100
   */

  const amountInKobo =
    Number(
      transaction.amountInKobo,
    ) || 0;

  return {
    _id:
      transaction._id,

    walletId:
      transaction.walletId,

    amount:
      amountInKobo / 100,

    type:
      transaction.type,

    description:
      transaction.description ??
      "",

    category:
      transaction.category,

    withdrawalId:
      transaction.withdrawalId,

    referralLevel:
      transaction.referralLevel,

    referredUserId:
      transaction.referredUserId,

    referralUserId:
      transaction.referralUserId,

    createdAt:
      transaction.createdAt,

    /*
     * Backend provides updatedAt.
     *
     * Keep this required so the UI can safely
     * consume the normalized transaction.
     */
    updatedAt:
      transaction.updatedAt ??
      transaction.createdAt,
  };
}

/* ============================================================
   USE WALLET TRANSACTIONS
============================================================ */

export function useWalletTransactions(
  page: number = 1,
  limit: number = 10,
) {
  /* ==========================================================
     AUTHENTICATED USER
  ========================================================== */

  const user =
    useAuthStore(
      (state) => state.user,
    );

  /*
   * Prefer MongoDB _id.
   */

  const userId =
    user?._id ??
    user?.id;

  /* ==========================================================
     REACT QUERY
  ========================================================== */

  const query =
    useQuery<WalletTransactionsResponse>({
      queryKey:
        walletTransactionsQueryKey(
          userId,
          page,
          limit,
        ),

      queryFn:
        async () => {
          if (!userId) {
            throw new Error(
              "Cannot fetch wallet transactions: user ID is missing.",
            );
          }

          try {
            return await getWalletTransactions(
              userId,
              page,
              limit,
            );
          } catch (error) {
            /*
             * A wallet with no transactions is
             * represented by the backend as 404.
             *
             * Treat it as an empty transaction
             * history.
             */

            if (
              isTransactionsNotFoundError(
                error,
              )
            ) {
              console.info(
                "[Wallet] No transactions found.",
              );

              return createEmptyTransactionsResponse();
            }

            throw error;
          }
        },

      /*
       * Do not fetch until we know the user ID.
       */

      enabled:
        Boolean(userId),

      /*
       * Keep previous data during pagination.
       */

      placeholderData:
        (previousData) =>
          previousData,

      /*
       * Wallet transactions can remain
       * fresh for 30 seconds.
       */

      staleTime:
        30_000,

      /*
       * Refresh when returning to the page.
       */

      refetchOnWindowFocus:
        true,

      /*
       * Retry genuine failures.
       *
       * Do not retry the special 404 case.
       */

      retry:
        (
          failureCount,
          error,
        ) => {
          if (
            isTransactionsNotFoundError(
              error,
            )
          ) {
            return false;
          }

          return failureCount < 2;
        },
    });

  /* ==========================================================
     RAW BACKEND TRANSACTIONS
  ========================================================== */

  const rawTransactions =
    query.data?.data
      ?.transactionObj ?? [];

  /* ==========================================================
     NORMALIZED UI TRANSACTIONS
  ========================================================== */

  const transactions =
    rawTransactions.map(
      normalizeTransaction,
    );

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalCount =
    query.data?.data
      ?.totalCount ?? 0;

  const totalPages =
    query.data?.data
      ?.totalPages ?? 0;

  const hasNextPage =
    page < totalPages;

  const hasPreviousPage =
    page > 1;

  /* ==========================================================
     EMPTY STATE
  ========================================================== */

  const isEmpty =
    !query.isLoading &&
    !query.isFetching &&
    !query.isError &&
    transactions.length === 0;

  /* ==========================================================
     RETURN
  ========================================================== */

  return {
    /* React Query */

    ...query,

    /* User */

    userId,

    /* Transactions */

    transactions,

    totalCount,

    totalPages,

    currentPage:
      page,

    limit,

    /* Loading */

    isLoading:
      query.isLoading,

    isFetching:
      query.isFetching,

    /* Error */

    isError:
      query.isError,

    error:
      query.error,

    /* Empty */

    isEmpty,

    /* Pagination */

    hasNextPage,

    hasPreviousPage,
  };
}
