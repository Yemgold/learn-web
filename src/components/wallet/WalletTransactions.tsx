




"use client";

import { useMemo } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  History,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Receipt,
} from "lucide-react";
import { motion } from "framer-motion";

export interface WalletTransaction {
  _id: string;
  walletId: string;
  withdrawalId?: string;
  amount: number;
  type: "CREDIT" | "DEBIT" | string;
  description: string;
  category?: string;
  referralLevel?: number;
  referredUserId?: string;
  referralUserId?: string;
  createdAt: string;
  updatedAt: string;
}

interface WalletTransactionsProps {
  transactions: WalletTransaction[];
  isLoading?: boolean;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function WalletTransactions({
  transactions,
  isLoading = false,
  totalCount = 0,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: WalletTransactionsProps) {
  /* ============================================================
     FORMAT CURRENCY
     ============================================================ */

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  /* ============================================================
     FORMAT DATE
     ============================================================ */

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsedDate);
  };

  /* ============================================================
     NORMALIZE TRANSACTIONS
     ============================================================ */

  const normalizedTransactions = useMemo(
    () =>
      transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount || 0),
        type: transaction.type.toUpperCase(),
      })),
    [transactions],
  );

  /* ============================================================
     EMPTY STATE
     ============================================================ */

  const isEmpty =
    !isLoading && normalizedTransactions.length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <History className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="text-xs text-slate-500">
              Your latest wallet activity
            </p>
          </div>
        </div>

        {totalCount > 0 && (
          <span className="text-xs font-medium text-slate-400">
            {totalCount} transaction
            {totalCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {/* ========================================================
          LOADING STATE
      ======================================================== */}

      {isLoading && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading transactions...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait while we fetch your wallet activity.
          </p>
        </div>
      )}

      {/* ========================================================
          EMPTY STATE
      ======================================================== */}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Receipt className="h-7 w-7 text-slate-400" />
          </div>

          <h3 className="mt-5 font-semibold text-slate-900">
            No transactions yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Your wallet transactions will appear here when you
            earn, deposit, withdraw or spend funds.
          </p>
        </div>
      )}

      {/* ========================================================
          TRANSACTION LIST
      ======================================================== */}

      {!isLoading && normalizedTransactions.length > 0 && (
        <>
          <div className="divide-y divide-slate-100">
            {normalizedTransactions.map((transaction) => {
              const isCredit =
                transaction.type === "CREDIT";

              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                >
                  {/* ==================================================
                      LEFT SIDE
                  ================================================== */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCredit
                          ? "bg-emerald-100"
                          : "bg-red-100"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownToLine className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {transaction.description ||
                          (isCredit
                            ? "Wallet credit"
                            : "Wallet debit")}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {transaction.category && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {transaction.category
                              .replaceAll("_", " ")
                              .toLowerCase()}
                          </span>
                        )}

                        {transaction.referralLevel && (
                          <span className="text-[11px] font-medium text-blue-500">
                            Level {transaction.referralLevel}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* ==================================================
                      AMOUNT
                  ================================================== */}

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-bold ${
                        isCredit
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </p>

                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      {isCredit ? "Credit" : "Debit"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================
              PAGINATION
          ====================================================== */}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 sm:px-6">
              <p className="text-xs text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    currentPage <= 1 ||
                    !onPageChange
                  }
                  onClick={() =>
                    onPageChange?.(currentPage - 1)
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={
                    currentPage >= totalPages ||
                    !onPageChange
                  }
                  onClick={() =>
                    onPageChange?.(currentPage + 1)
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.section>
  );
}