"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import CbtWalletHeader from "@/components/cbt-wallet/CbtWalletHeader";
import CbtWalletBalance from "@/components/cbt-wallet/CbtWalletBalance";
import CbtWalletSummary from "@/components/cbt-wallet/CbtWalletSummary";
import CbtWalletQuickActions from "@/components/cbt-wallet/CbtWalletQuickActions";
import CbtWalletGoal from "@/components/cbt-wallet/CbtWalletGoal";
import CbtWalletRecentActivity from "@/components/cbt-wallet/CbtWalletRecentActivity";
import SendPointsModal from "@/components/cbt-wallet/SendPointsModal";
import HowCbtPointsWork from "@/components/cbt-wallet/HowCbtPointsWork";

import type {
  WalletTransaction,
  CbtWalletBalance as WalletBalance,
} from "@/types/cbt-wallet/transaction";

const INITIAL_WALLET: WalletBalance = {
  availablePoints: 12450,
  totalEarned: 2900,
  totalSpent: 2000,
  totalReceived: 500,
  totalSent: 500,
};

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
  },
];

export default function CbtWalletPage() {
  const router = useRouter();

  const [wallet, setWallet] =
    useState<WalletBalance>(INITIAL_WALLET);

  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(
      INITIAL_TRANSACTIONS,
    );

  const [sendPointsOpen, setSendPointsOpen] =
    useState(false);

  const goalTarget = 15000;

  const goalRemaining = useMemo(
    () =>
      Math.max(
        0,
        goalTarget - wallet.availablePoints,
      ),
    [wallet.availablePoints],
  );

  function handleEarnPoints() {
    router.push(
      "/student/practice/cbtsubjects?exam=jamb",
    );
  }

  function handleOpenRewards() {
    router.push(
      "/student/practice/cbt-point-reward",
    );
  }

  async function handleSendPoints(data: {
    recipientEmail: string;
    recipientName: string;
    amount: number;
    message?: string;
  }) {
    const amount = Math.max(0, data.amount);

    if (
      amount <= 0 ||
      amount > wallet.availablePoints
    ) {
      throw new Error(
        "Insufficient CBT Points.",
      );
    }

    const now = new Date();

    const transaction: WalletTransaction = {
      id: `trx-${Date.now()}`,
      reference: `CBT-TRX-${Date.now()}`,
      title: "Points Sent",
      description: `Sent to ${data.recipientName}`,
      amount,
      type: "TRANSFER_SENT",
      status: "COMPLETED",
      date: now.toLocaleString("en-NG", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      counterparty: {
        name: data.recipientName,
        email: data.recipientEmail,
      },
    };

    setWallet((current) => ({
      ...current,
      availablePoints:
        current.availablePoints - amount,
      totalSent:
        current.totalSent + amount,
      totalSpent:
        current.totalSpent + amount,
    }));

    setTransactions((current) => [
      transaction,
      ...current,
    ]);

    setSendPointsOpen(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <CbtWalletHeader
          balance={wallet.availablePoints}
          onRedeemRewards={handleOpenRewards}
        />

        {/* Balance + Goal */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <CbtWalletBalance
            balance={wallet.availablePoints}
            totalEarned={wallet.totalEarned}
            totalSpent={wallet.totalSpent}
            onEarnPoints={handleEarnPoints}
            onSendPoints={() =>
              setSendPointsOpen(true)
            }
          />

          <CbtWalletGoal
            currentPoints={
              wallet.availablePoints
            }
            targetPoints={goalTarget}
            title="Your Points Goal"
            description="You're getting closer to your next milestone."
            rewardTitle="Next milestone"
            rewardDescription={`${goalRemaining.toLocaleString(
              "en-NG",
            )} points to reach your ${goalTarget.toLocaleString(
              "en-NG",
            )} point goal.`}
          />
        </div>

        {/* Summary */}
        <div className="mt-6">
          <CbtWalletSummary
            balance={wallet}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <CbtWalletQuickActions
            onSendPoints={() =>
              setSendPointsOpen(true)
            }
            onRedeemRewards={
              handleOpenRewards
            }
          />
        </div>

        {/* Rewards Shortcut */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-r from-violet-950/30 via-slate-900/70 to-cyan-950/20 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Turn your CBT Points into rewards
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Use your points to unlock educational
                  rewards, study tools, vouchers, gadgets,
                  and more.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenRewards}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
            >
              View Rewards
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Activity */}
        <div className="mt-10">
          <CbtWalletRecentActivity
            transactions={transactions}
            limit={8}
          />
        </div>

        {/* How Points Work */}
        <div className="mt-8">
          <HowCbtPointsWork />
        </div>

        {/* Motivation */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-r from-violet-950/30 via-slate-900/60 to-cyan-950/20 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Every question can take you closer.
                </h3>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                  Practice consistently, build your
                  knowledge, earn CBT Points, and work
                  towards rewards that support your
                  learning journey.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEarnPoints}
              className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
            >
              Start Practicing
            </button>
          </div>
        </div>
      </div>

      {/* Send Points */}
      <SendPointsModal
        open={sendPointsOpen}
        balance={wallet.availablePoints}
        onClose={() =>
          setSendPointsOpen(false)
        }
        onSend={handleSendPoints}
      />
    </main>
  );
}