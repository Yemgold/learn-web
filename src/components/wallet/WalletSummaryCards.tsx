



"use client";

import {
  ArrowUpRight,
  CreditCard,
  Gift,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

interface WalletSummaryCardsProps {
  balance: number;
  transactions: Array<{
    _id: string;
    amount: number;
    type: "CREDIT" | "DEBIT" | string;
    category?: string;
    description?: string;
    createdAt: string;
  }>;
}

interface SummaryItem {
  title: string;
  value: string;
  icon: typeof Trophy;
  description: string;
}

export default function WalletSummaryCards({
  balance,
  transactions,
}: WalletSummaryCardsProps) {
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
     CALCULATE TOTAL EARNED
     
     Credits represent money entering the wallet.
     ============================================================ */

  const totalEarned = transactions
    .filter(
      (transaction) =>
        transaction.type.toUpperCase() === "CREDIT",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  /* ============================================================
     CALCULATE TOTAL WITHDRAWN
     
     Debit transactions represent money leaving the wallet.
     ============================================================ */

  const totalWithdrawn = transactions
    .filter(
      (transaction) =>
        transaction.type.toUpperCase() === "DEBIT",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  /* ============================================================
     REFERRAL EARNINGS
     ============================================================ */

  const referralEarnings = transactions
    .filter(
      (transaction) =>
        transaction.type.toUpperCase() === "CREDIT" &&
        transaction.category === "REFERRAL_BONUS",
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0,
    );

  /* ============================================================
     SUMMARY ITEMS
     ============================================================ */

  const summaryItems: SummaryItem[] = [
    {
      title: "Total Earned",
      value: formatAmount(totalEarned),
      icon: Trophy,
      description: "All-time earnings",
    },
    {
      title: "Referral Earnings",
      value: formatAmount(referralEarnings),
      icon: Gift,
      description: "From your referrals",
    },
    {
      title: "Total Spent",
      value: formatAmount(totalWithdrawn),
      icon: ArrowUpRight,
      description: "Practice questions",
    },
    {
      title: "Current Balance",
      value: formatAmount(balance),
      icon: CreditCard,
      description: "Available to use",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.05,
            }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="h-5 w-5 text-slate-700" />
              </div>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {item.title}
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {item.value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}