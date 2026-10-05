
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import CbtWalletHeader from "@/components/cbt-wallet/CbtWalletHeader";
import CbtWalletBalance from "@/components/cbt-wallet/CbtWalletBalance";
import CbtWalletSummary from "@/components/cbt-wallet/CbtWalletSummary";
import CbtWalletQuickActions from "@/components/cbt-wallet/CbtWalletQuickActions";
import CbtWalletGoal from "@/components/cbt-wallet/CbtWalletGoal";
import CbtWalletRecentActivity from "@/components/cbt-wallet/CbtWalletRecentActivity";
import SendPointsModal from "@/components/cbt-wallet/SendPointsModal";
import HowCbtPointsWork from "@/components/cbt-wallet/HowCbtPointsWork";

import {
  getCbtWallet,
  getCbtTransactionList,
  sendCbtPoints,
} from "@/lib/api/cbtWallet";

import { useAuthStore } from "@/stores/auth.store";

import type {
  WalletTransaction,
  CbtWalletBalance as WalletBalance,
} from "@/types/cbt-wallet/transaction";

/* ============================================================
   INITIAL STATE
   ============================================================ */

const INITIAL_WALLET: WalletBalance = {
  availablePoints: 0,
  totalEarned: 0,
  totalSpent: 0,
  totalReceived: 0,
  totalSent: 0,
};

const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

/* ============================================================
   HELPERS
   ============================================================ */

function mapTransactionType(
  transactionType: string,
): WalletTransaction["type"] {
  switch (transactionType) {
    case "earned":
      return "PRACTICE_EARNED";

    case "sent":
      return "TRANSFER_SENT";

    case "received":
      return "TRANSFER_RECEIVED";

    case "redeemed":
      return "REWARD_REDEMPTION";

    case "bonus":
      return "BONUS_EARNED";

    case "contest-entry":
      return "COMPETITION_ENTRY";

    case "refund":
      return "BONUS_EARNED";

    default:
      return "BONUS_EARNED";
  }
}

function mapTransactions(
  transactionList: Awaited<
    ReturnType<typeof getCbtTransactionList>
  >,
): WalletTransaction[] {
  return transactionList.map(
    (transaction): WalletTransaction => {
      const amount = Number(
        transaction.amount ?? 0,
      );

      const type = mapTransactionType(
        transaction.type,
      );

      const formattedDate =
        transaction.createdAt
          ? new Date(
              transaction.createdAt,
            ).toLocaleString("en-NG", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          : "";

      return {
        id: transaction._id,

        reference:
          transaction.reference ??
          transaction._id,

        title:
          transaction.description ??
          "CBT Points Transaction",

        description:
          transaction.description ??
          "CBT Points transaction",

        amount,

        type,

        status:
          transaction.status?.toUpperCase() ===
          "FAILED"
            ? "FAILED"
            : "COMPLETED",

        date: formattedDate,

        counterparty:
          transaction.recipientEmail ||
          transaction.senderEmail
            ? {
                name:
                  transaction.recipientEmail ??
                  transaction.senderEmail ??
                  "User",

                email:
                  transaction.recipientEmail ??
                  transaction.senderEmail ??
                  "",
              }
            : undefined,
      };
    },
  );
}

function calculateSummary(
  transactionList: Awaited<
    ReturnType<typeof getCbtTransactionList>
  >,
) {
  let totalEarned = 0;
  let totalSpent = 0;
  let totalReceived = 0;
  let totalSent = 0;

  for (const transaction of transactionList) {
    const amount = Number(
      transaction.amount ?? 0,
    );

    switch (transaction.type) {
      case "earned":
        totalEarned += amount;
        break;

      case "received":
        totalReceived += amount;
        break;

      case "sent":
        totalSent += amount;
        totalSpent += amount;
        break;

      case "redeemed":
        totalSpent += amount;
        break;

      case "bonus":
        totalEarned += amount;
        break;

      case "refund":
        totalReceived += amount;
        break;

      case "contest-entry":
        totalSpent += amount;
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
  };
}

/* ============================================================
   PAGE
   ============================================================ */

export default function CbtWalletPage() {
  const router = useRouter();

  /* ==========================================================
     AUTH STORE
     ========================================================== */

  const user = useAuthStore(
    (state) => state.user,
  );

  const isHydrated = useAuthStore(
    (state) => state.isHydrated,
  );

  const userId =
    user?._id ?? user?.id;


  /* ==========================================================
     STATE
     ========================================================== */

  const [wallet, setWallet] =
    useState<WalletBalance>(
      INITIAL_WALLET,
    );

  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(
      INITIAL_TRANSACTIONS,
    );

  const [sendPointsOpen, setSendPointsOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const goalTarget = 15000;


  /* ==========================================================
     LOAD WALLET
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadWallet() {
      /*
       * Do not attempt to load the wallet until
       * the auth store has finished hydrating.
       */
      if (!isHydrated) {
        return;
      }

      /*
       * Auth is hydrated but no user exists.
       */
      if (!userId) {
        setLoading(false);

        setError(
          "Unable to identify the logged-in user.",
        );

        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(
          "[CBT Wallet] Loading wallet for user:",
          userId,
        );

        /* ======================================================
           LOAD WALLET
           ====================================================== */

        const walletResponse =
          await getCbtWallet(userId);

        console.log(
          "[CBT Wallet] Wallet response:",
          walletResponse,
        );

        console.log(
          "[CBT Wallet] Wallet response JSON:",
          JSON.stringify(
            walletResponse,
            null,
            2,
          ),
        );

        if (cancelled) {
          return;
        }

        const availablePoints =
          Number(
            walletResponse.data?.points ?? 0,
          );

        setWallet((current) => ({
          ...current,
          availablePoints,
        }));


        /* ======================================================
           LOAD TRANSACTIONS
           ====================================================== */

        try {
          const transactionList =
            await getCbtTransactionList(
              userId,
            );

          console.log(
            "[CBT Wallet] Transactions:",
            transactionList,
          );

          console.log(
            "[CBT Wallet] Transactions JSON:",
            JSON.stringify(
              transactionList,
              null,
              2,
            ),
          );

          if (cancelled) {
            return;
          }

          /* ====================================================
             MAP TRANSACTIONS
             ==================================================== */

          const mappedTransactions =
            mapTransactions(
              transactionList,
            );

          setTransactions(
            mappedTransactions,
          );


          /* ====================================================
             CALCULATE SUMMARY
             ==================================================== */

          const summary =
            calculateSummary(
              transactionList,
            );

          setWallet((current) => ({
            ...current,

            totalEarned:
              summary.totalEarned,

            totalSpent:
              summary.totalSpent,

            totalReceived:
              summary.totalReceived,

            totalSent:
              summary.totalSent,
          }));
        } catch (transactionError) {
          console.error(
            "[CBT Wallet] Failed to load transactions:",
            transactionError,
          );

          /*
           * The wallet balance is still useful even
           * if transaction history fails.
           */
          if (!cancelled) {
            setTransactions([]);
          }
        }
      } catch (walletError) {
        console.error(
          "[CBT Wallet] Failed to load wallet:",
          walletError,
        );

        if (!cancelled) {
          setError(
            walletError instanceof Error
              ? walletError.message
              : "Unable to load CBT wallet.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWallet();

    return () => {
      cancelled = true;
    };
  }, [userId, isHydrated]);


  /* ==========================================================
     GOAL
     ========================================================== */

  const goalRemaining = useMemo(
    () =>
      Math.max(
        0,
        goalTarget -
          wallet.availablePoints,
      ),
    [wallet.availablePoints],
  );


  /* ==========================================================
     ACTIONS
     ========================================================== */

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


  /* ==========================================================
     SEND POINTS
     ========================================================== */

  async function handleSendPoints(data: {
    recipientEmail: string;
    recipientName: string;
    amount: number;
    message?: string;
  }) {
    const amount = Math.max(
      0,
      Number(data.amount),
    );

    if (amount <= 0) {
      throw new Error(
        "Points must be greater than zero.",
      );
    }

    if (
      amount >
      wallet.availablePoints
    ) {
      throw new Error(
        "Insufficient CBT Points.",
      );
    }

    if (!userId) {
      throw new Error(
        "Unable to identify the logged-in user.",
      );
    }

    console.log(
      "[CBT Wallet] Sending points:",
      {
        senderUserId: userId,

        recipientEmail:
          data.recipientEmail,

        points: amount,

        description:
          data.message ??
          "CBT Points transfer",
      },
    );

    /* ========================================================
       SEND TO BACKEND
       ======================================================== */

    const response =
      await sendCbtPoints({
        senderUserId: userId,

        recipientEmail:
          data.recipientEmail,

        points: amount,

        description:
          data.message ??
          "CBT Points transfer",
      });

    console.log(
      "[CBT Wallet] Send points response:",
      response,
    );

    console.log(
      "[CBT Wallet] Send points response JSON:",
      JSON.stringify(
        response,
        null,
        2,
      ),
    );


    /* ========================================================
       RELOAD WALLET
       ======================================================== */

    const walletResponse =
      await getCbtWallet(userId);

    const transactionList =
      await getCbtTransactionList(
        userId,
      );

    const availablePoints =
      Number(
        walletResponse.data?.points ?? 0,
      );

    const mappedTransactions =
      mapTransactions(
        transactionList,
      );

    const summary =
      calculateSummary(
        transactionList,
      );

    setWallet({
      availablePoints,

      totalEarned:
        summary.totalEarned,

      totalSpent:
        summary.totalSpent,

      totalReceived:
        summary.totalReceived,

      totalSent:
        summary.totalSent,
    });

    setTransactions(
      mappedTransactions,
    );

    setSendPointsOpen(false);
  }


  /* ==========================================================
     AUTH HYDRATING
     ========================================================== */

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-violet-400" />

            <p className="text-sm text-slate-400">
              Checking your account...
            </p>
          </div>
        </div>
      </main>
    );
  }


  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-violet-400" />

            <p className="text-sm text-slate-400">
              Loading your CBT wallet...
            </p>
          </div>
        </div>
      </main>
    );
  }


  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-950/20 p-6 text-center">
            <h1 className="text-lg font-bold text-white">
              Unable to load CBT Wallet
            </h1>

            <p className="mt-2 text-sm text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <CbtWalletHeader
          balance={
            wallet.availablePoints
          }
          onRedeemRewards={
            handleOpenRewards
          }
        />


        {/* ====================================================
            BALANCE + GOAL
        ==================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">

          <CbtWalletBalance
            balance={
              wallet.availablePoints
            }
            totalEarned={
              wallet.totalEarned
            }
            totalSpent={
              wallet.totalSpent
            }
            onEarnPoints={
              handleEarnPoints
            }
            onSendPoints={() =>
              setSendPointsOpen(true)
            }
          />

          <CbtWalletGoal
            currentPoints={
              wallet.availablePoints
            }
            targetPoints={
              goalTarget
            }
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


        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <div className="mt-6">
          <CbtWalletSummary
            balance={wallet}
          />
        </div>


        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

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


        {/* ====================================================
            REWARDS SHORTCUT
        ==================================================== */}

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
              onClick={
                handleOpenRewards
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
            >
              View Rewards

              <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        </section>


        {/* ====================================================
            ACTIVITY
        ==================================================== */}

        <div className="mt-10">
          <CbtWalletRecentActivity
            transactions={
              transactions
            }
            limit={8}
          />
        </div>


        {/* ====================================================
            HOW POINTS WORK
        ==================================================== */}

        <div className="mt-8">
          <HowCbtPointsWork />
        </div>


        {/* ====================================================
            MOTIVATION
        ==================================================== */}

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
              onClick={
                handleEarnPoints
              }
              className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
            >
              Start Practicing
            </button>

          </div>
        </div>

      </div>


      {/* ======================================================
          SEND POINTS MODAL
      ====================================================== */}

      <SendPointsModal
        open={
          sendPointsOpen
        }
        balance={
          wallet.availablePoints
        }
        onClose={() =>
          setSendPointsOpen(false)
        }
        onSend={
          handleSendPoints
        }
      />
    </main>
  );
}
