




"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  Gift,
  Trophy,
  Wallet,
  Send,
  UserPlus,
  CircleCheck,
  Clock3,
  CircleX,
  ChevronRight,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  WalletTransaction,
  WalletTransactionFilter,
  WalletTransactionStatus,
  WalletTransactionType,
} from "@/types/cbt-wallet/transaction";

interface TransactionListProps {
  transactions: WalletTransaction[];

  /**
   * Number of transactions displayed before the user
   * clicks "View all".
   *
   * Defaults to 6.
   */
  limit?: number;

  /**
   * Show transaction filters.
   *
   * Defaults to true.
   */
  showFilters?: boolean;

  /**
   * Show "View all transactions" link.
   *
   * Defaults to true.
   */
  showViewAll?: boolean;

  /**
   * Optional link for the full transactions page.
   */
  viewAllHref?: string;

  /**
   * Optional heading.
   */
  title?: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Optional callback when a transaction is selected.
   */
  onTransactionClick?: (
    transaction: WalletTransaction
  ) => void;
}

const FILTERS: {
  id: WalletTransactionFilter;
  label: string;
}[] = [
  {
    id: "ALL",
    label: "All",
  },
  {
    id: "EARNED",
    label: "Earned",
  },
  {
    id: "SPENT",
    label: "Spent",
  },
];

function isEarnedTransaction(
  transaction: WalletTransaction
): boolean {
  return transaction.amount > 0;
}

function getTransactionIcon(
  type: WalletTransactionType
) {
  switch (type) {
    case "PRACTICE_EARNED":
      return BookOpen;

    case "BONUS_EARNED":
      return Gift;

    case "COMPETITION_ENTRY":
      return Trophy;

    case "COMPETITION_WIN":
      return Trophy;

    case "TRANSFER_SENT":
      return ArrowUpRight;

    case "TRANSFER_RECEIVED":
      return ArrowDownLeft;

    case "REWARD_REDEMPTION":
      return Gift;

    default:
      return Wallet;
  }
}

function getStatusIcon(
  status: WalletTransactionStatus
) {
  switch (status) {
    case "COMPLETED":
      return CircleCheck;

    case "PENDING":
      return Clock3;

    case "FAILED":
    case "CANCELLED":
      return CircleX;

    default:
      return Clock3;
  }
}

function getStatusLabel(
  status: WalletTransactionStatus
): string {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "PENDING":
      return "Pending";

    case "FAILED":
      return "Failed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

function formatPoints(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString("en-NG");

  return `${amount >= 0 ? "+" : "-"}${formatted}`;
}

function formatTypeLabel(
  type: WalletTransactionType
): string {
  switch (type) {
    case "PRACTICE_EARNED":
      return "Practice";

    case "BONUS_EARNED":
      return "Bonus";

    case "COMPETITION_ENTRY":
      return "Competition";

    case "COMPETITION_WIN":
      return "Competition Prize";

    case "TRANSFER_SENT":
      return "Transfer Sent";

    case "TRANSFER_RECEIVED":
      return "Transfer Received";

    case "REWARD_REDEMPTION":
      return "Reward";

    default:
      return "Transaction";
  }
}

export default function TransactionList({
  transactions,
  limit = 6,
  showFilters = true,
  showViewAll = true,
  viewAllHref = "/student/practice/cbt-wallet/transactions",
  title = "Recent Transactions",
  description = "Keep track of how your CBT Points move.",
  onTransactionClick,
}: TransactionListProps) {
  const [activeFilter, setActiveFilter] =
    useState<WalletTransactionFilter>("ALL");

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      if (activeFilter === "ALL") {
        return true;
      }

      if (activeFilter === "EARNED") {
        return isEarnedTransaction(transaction);
      }

      if (activeFilter === "SPENT") {
        return !isEarnedTransaction(transaction);
      }

      return true;
    });

    return filtered.slice(0, limit);
  }, [transactions, activeFilter, limit]);

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
              <FileText className="h-4 w-4 text-violet-400" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white">
              {title}
            </h2>
          </div>

          <p className="text-sm text-slate-400">
            {description}
          </p>
        </div>

        {showViewAll && (
          <Button
            
            variant="ghost"
            className="w-fit gap-1 px-0 text-sm text-violet-400 hover:bg-transparent hover:text-violet-300"
          >
            <Link href={viewAllHref}>
              View all transactions
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex w-fit items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/70 p-1">
          {FILTERS.map((filter) => {
            const isActive =
              activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.id)
                }
                className={[
                  "rounded-lg px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Transactions */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {filteredTransactions.map(
              (transaction) => {
                const Icon = getTransactionIcon(
                  transaction.type
                );

                const StatusIcon =
                  getStatusIcon(transaction.status);

                const isPositive =
                  transaction.amount > 0;

                const isClickable =
                  Boolean(onTransactionClick);

                return (
                  <button
                    key={transaction.id}
                    type="button"
                    disabled={!isClickable}
                    onClick={() =>
                      onTransactionClick?.(
                        transaction
                      )
                    }
                    className={[
                      "group flex w-full items-center gap-4 px-4 py-4 text-left transition sm:px-5",
                      isClickable
                        ? "cursor-pointer hover:bg-slate-800/60"
                        : "cursor-default",
                    ].join(" ")}
                  >
                    {/* Transaction Icon */}
                    <div
                      className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        isPositive
                          ? "bg-emerald-500/10"
                          : "bg-rose-500/10",
                      ].join(" ")}
                    >
                      <Icon
                        className={[
                          "h-5 w-5",
                          isPositive
                            ? "text-emerald-400"
                            : "text-rose-400",
                        ].join(" ")}
                      />
                    </div>

                    {/* Main Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {transaction.title}
                        </h3>

                        <span className="hidden text-slate-700 sm:inline">
                          •
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatTypeLabel(
                            transaction.type
                          )}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {transaction.description}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>
                          {transaction.date}
                        </span>

                        <span>•</span>

                        <span className="font-mono">
                          {transaction.reference}
                        </span>
                      </div>
                    </div>

                    {/* Amount + Status */}
                    <div className="shrink-0 text-right">
                      <p
                        className={[
                          "text-sm font-bold",
                          isPositive
                            ? "text-emerald-400"
                            : "text-rose-400",
                        ].join(" ")}
                      >
                        {formatPoints(
                          transaction.amount
                        )}
                      </p>

                      <div className="mt-1 flex items-center justify-end gap-1">
                        <StatusIcon
                          className={[
                            "h-3 w-3",
                            transaction.status ===
                            "COMPLETED"
                              ? "text-emerald-400"
                              : transaction.status ===
                                "PENDING"
                              ? "text-amber-400"
                              : "text-rose-400",
                          ].join(" ")}
                        />

                        <span
                          className={[
                            "text-[11px]",
                            transaction.status ===
                            "COMPLETED"
                              ? "text-emerald-400"
                              : transaction.status ===
                                "PENDING"
                              ? "text-amber-400"
                              : "text-rose-400",
                          ].join(" ")}
                        >
                          {getStatusLabel(
                            transaction.status
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
              <Wallet className="h-6 w-6 text-slate-500" />
            </div>

            <h3 className="text-sm font-semibold text-white">
              No transactions found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              There are no{" "}
              {activeFilter === "EARNED"
                ? "earned"
                : activeFilter === "SPENT"
                ? "spent"
                : ""}{" "}
              transactions to display.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}