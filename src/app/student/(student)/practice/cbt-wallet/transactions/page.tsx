



"use client";

import { ArrowLeft, WalletCards } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import TransactionList from "@/components/cbt-wallet/TransactionList";

import type {
  WalletTransaction,
  WalletTransactionFilter,
  WalletTransactionSummary,
} from "@/types/cbt-wallet/transaction";

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "trx-928341",
    reference: "CBT-TRX-928341",
    title: "Biology Practice",
    description: "Completed 25 Biology practice questions",
    amount: 250,
    type: "PRACTICE_EARNED",
    status: "COMPLETED",
    date: "Today, 6:42 PM",
  },
  {
    id: "trx-928119",
    reference: "CBT-TRX-928119",
    title: "Points Received",
    description: "Received from Daniel Okafor",
    amount: 500,
    type: "TRANSFER_RECEIVED",
    status: "COMPLETED",
    date: "Today, 2:15 PM",
    counterparty: {
      name: "Daniel Okafor",
    },
  },
  {
    id: "trx-927801",
    reference: "CBT-TRX-927801",
    title: "Solve & Win Entry",
    description: "JAMB Science Challenge",
    amount: 1000,
    type: "COMPETITION_ENTRY",
    status: "COMPLETED",
    date: "Yesterday, 8:30 PM",
    competition: {
      competitionId: "science-challenge",
      title: "JAMB Science Challenge",
    },
  },
  {
    id: "trx-927642",
    reference: "CBT-TRX-927642",
    title: "Daily Learning Bonus",
    description: "Completed your daily learning goal",
    amount: 150,
    type: "BONUS_EARNED",
    status: "COMPLETED",
    date: "Yesterday, 7:05 PM",
  },
  {
    id: "trx-927421",
    reference: "CBT-TRX-927421",
    title: "Points Sent",
    description: "Sent to Sarah Williams",
    amount: 500,
    type: "TRANSFER_SENT",
    status: "COMPLETED",
    date: "Sep 10, 4:22 PM",
    counterparty: {
      name: "Sarah Williams",
    },
  },
  {
    id: "trx-927119",
    reference: "CBT-TRX-927119",
    title: "JAMB Mock Exam",
    description: "Redeemed Full JAMB Mock Examination",
    amount: 500,
    type: "REWARD_REDEMPTION",
    status: "COMPLETED",
    date: "Sep 9, 9:14 AM",
    reward: {
      rewardId: "mock-exam-pack",
      title: "JAMB Mock Exam",
    },
  },
  {
    id: "trx-926884",
    reference: "CBT-TRX-926884",
    title: "Competition Prize",
    description: "JAMB Biology Challenge — 2nd Place",
    amount: 2000,
    type: "COMPETITION_WIN",
    status: "COMPLETED",
    date: "Sep 8, 5:48 PM",
    competition: {
      competitionId: "biology-challenge",
      title: "JAMB Biology Challenge",
    },
  },
  {
    id: "trx-926521",
    reference: "CBT-TRX-926521",
    title: "Chemistry Practice",
    description: "Completed 30 Chemistry practice questions",
    amount: 300,
    type: "PRACTICE_EARNED",
    status: "COMPLETED",
    date: "Sep 7, 7:12 PM",
  },
  {
    id: "trx-926304",
    reference: "CBT-TRX-926304",
    title: "Weekly Learning Bonus",
    description: "Completed your weekly learning target",
    amount: 500,
    type: "BONUS_EARNED",
    status: "COMPLETED",
    date: "Sep 6, 8:10 PM",
  },
  {
    id: "trx-926019",
    reference: "CBT-TRX-926019",
    title: "Quiz Competition Entry",
    description: "Biology League Championship",
    amount: 100,
    type: "COMPETITION_ENTRY",
    status: "COMPLETED",
    date: "Sep 5, 6:45 PM",
    competition: {
      competitionId: "biology-league",
      title: "Biology League Championship",
    },
  },
];

function calculateSummary(
  transactions: WalletTransaction[],
): WalletTransactionSummary {
  let totalEarned = 0;
  let totalSpent = 0;
  let totalReceived = 0;
  let totalSent = 0;

  for (const transaction of transactions) {
    if (transaction.status !== "COMPLETED") {
      continue;
    }

    switch (transaction.type) {
      case "PRACTICE_EARNED":
      case "BONUS_EARNED":
      case "COMPETITION_WIN":
        totalEarned += transaction.amount;
        break;

      case "TRANSFER_RECEIVED":
        totalReceived += transaction.amount;
        break;

      case "TRANSFER_SENT":
        totalSent += transaction.amount;
        break;

      case "COMPETITION_ENTRY":
      case "REWARD_REDEMPTION":
        totalSpent += transaction.amount;
        break;

      default:
        break;
    }
  }

  return {
    totalEarned,
    totalSpent,
    totalReceived,
    totalSent,
    transactionCount: transactions.length,
  };
}

function formatPoints(value: number) {
  return value.toLocaleString("en-NG");
}

function SummaryCard({
  label,
  value,
  description,
  className = "",
}: {
  label: string;
  value: number;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-white">
        {formatPoints(value)}
        <span className="ml-1 text-[10px] font-semibold text-violet-400">
          pts
        </span>
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function CbtWalletTransactionsPage() {
  const [transactions] = useState<WalletTransaction[]>(
    INITIAL_TRANSACTIONS,
  );

  const [filter, setFilter] =
    useState<WalletTransactionFilter>("ALL");

  const summary = useMemo(
    () => calculateSummary(transactions),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    if (filter === "ALL") {
      return transactions;
    }

    if (filter === "EARNED") {
      return transactions.filter((transaction) =>
        [
          "PRACTICE_EARNED",
          "BONUS_EARNED",
          "COMPETITION_WIN",
          "TRANSFER_RECEIVED",
        ].includes(transaction.type),
      );
    }

    return transactions.filter((transaction) =>
      [
        "COMPETITION_ENTRY",
        "REWARD_REDEMPTION",
        "TRANSFER_SENT",
      ].includes(transaction.type),
    );
  }, [filter, transactions]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/student/practice/cbt-wallet"
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Wallet
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5">
                <WalletCards className="h-3.5 w-3.5 text-violet-400" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                  CBT Wallet
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Transaction History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review everything that has happened to your CBT
                Points, including earnings, transfers, competition
                entries, and reward redemptions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Transactions
              </p>

              <p className="mt-1 text-xl font-black text-white">
                {summary.transactionCount}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Earned"
            value={summary.totalEarned}
            description="Learning and competition rewards"
          />

          <SummaryCard
            label="Spent"
            value={summary.totalSpent}
            description="Entries and reward redemptions"
          />

          <SummaryCard
            label="Received"
            value={summary.totalReceived}
            description="Points received from students"
          />

          <SummaryCard
            label="Sent"
            value={summary.totalSent}
            description="Points transferred to others"
          />
        </div>

        {/* Transactions */}
        <div className="mt-6">
          <TransactionList
            transactions={filteredTransactions}
            limit={filteredTransactions.length}
            showFilters
            showViewAll={false}
            title="All Transactions"
            description="Your complete CBT Points activity."
          />
        </div>
      </div>
    </main>
  );
}