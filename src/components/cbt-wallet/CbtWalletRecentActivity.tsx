



"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Gift,
  Trophy,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

import type {
  WalletTransaction,
  WalletTransactionType,
} from "@/types/cbt-wallet/transaction";

interface CbtWalletRecentActivityProps {
  transactions: WalletTransaction[];
  limit?: number;
  viewAllHref?: string;
  title?: string;
  description?: string;
  onTransactionClick?: (transaction: WalletTransaction) => void;
  className?: string;
}

function formatAmount(amount: number) {
  return Math.abs(amount).toLocaleString("en-NG");
}

function getTransactionIcon(type: WalletTransactionType) {
  switch (type) {
    case "PRACTICE_EARNED":
      return BookOpen;

    case "BONUS_EARNED":
      return Trophy;

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
      return WalletCards;
  }
}

function isCredit(type: WalletTransactionType) {
  return (
    type === "PRACTICE_EARNED" ||
    type === "BONUS_EARNED" ||
    type === "COMPETITION_WIN" ||
    type === "TRANSFER_RECEIVED"
  );
}

function getIconStyles(type: WalletTransactionType) {
  if (isCredit(type)) {
    return "bg-emerald-500/10 text-emerald-400";
  }

  if (
    type === "TRANSFER_SENT" ||
    type === "REWARD_REDEMPTION" ||
    type === "COMPETITION_ENTRY"
  ) {
    return "bg-violet-500/10 text-violet-400";
  }

  return "bg-slate-800 text-slate-400";
}

function getAmountStyles(type: WalletTransactionType) {
  return isCredit(type) ? "text-emerald-400" : "text-slate-300";
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status: WalletTransaction["status"]) {
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

function getStatusStyles(status: WalletTransaction["status"]) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-400";

    case "PENDING":
      return "bg-amber-500/10 text-amber-400";

    case "FAILED":
      return "bg-red-500/10 text-red-400";

    case "CANCELLED":
      return "bg-slate-800 text-slate-500";

    default:
      return "bg-slate-800 text-slate-400";
  }
}

export default function CbtWalletRecentActivity({
  transactions,
  limit = 6,
  viewAllHref = "/student/practice/cbt-wallet/transactions",
  title = "Recent Activity",
  description = "Your latest CBT Points activity",
  onTransactionClick,
  className = "",
}: CbtWalletRecentActivityProps) {
  const visibleTransactions = transactions.slice(0, limit);

  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>

        {transactions.length > 0 && (
          <Link
            href={viewAllHref}
            className="group flex shrink-0 items-center gap-1 text-xs font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            View all
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {visibleTransactions.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
            <WalletCards className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white">
            No recent activity
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Your CBT Points transactions will appear here when you earn,
            spend, send, or receive points.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80">
          {visibleTransactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.type);
            const credit = isCredit(transaction.type);

            const content = (
              <div className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-800/30">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getIconStyles(
                    transaction.type,
                  )}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {transaction.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {transaction.description}
                      </p>
                    </div>

                    <p
                      className={`shrink-0 text-sm font-bold ${getAmountStyles(
                        transaction.type,
                      )}`}
                    >
                      {credit ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                      <span className="ml-1 text-[10px] font-medium text-slate-600">
                        pts
                      </span>
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[10px] text-slate-600">
                      {formatDate(transaction.date)}
                    </span>

                    <span className="text-[10px] text-slate-700">•</span>

                    <span className="font-mono text-[10px] text-slate-600">
                      {transaction.reference}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStatusStyles(
                        transaction.status,
                      )}`}
                    >
                      {getStatusLabel(transaction.status)}
                    </span>
                  </div>
                </div>

                {onTransactionClick && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-700" />
                )}
              </div>
            );

            if (onTransactionClick) {
              return (
                <button
                  key={transaction.id}
                  type="button"
                  onClick={() => onTransactionClick(transaction)}
                  className="block w-full text-left"
                >
                  {content}
                </button>
              );
            }

            return <div key={transaction.id}>{content}</div>;
          })}
        </div>
      )}

      {transactions.length > limit && (
        <div className="border-t border-slate-800 px-5 py-3">
          <Link
            href={viewAllHref}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
          >
            See all transactions
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}