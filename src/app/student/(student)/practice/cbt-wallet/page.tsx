
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

import type {
  WalletTransaction,
  CbtWalletBalance as WalletBalance,
} from "@/types/cbt-wallet/transaction";

/* ============================================================
   TYPES
   ============================================================ */

interface AuthenticatedUser {
  _id?: string;
  id?: string;
  userId?: string;
}


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
   PAGE
   ============================================================ */

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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const goalTarget = 15000;


  /* ==========================================================
     GET AUTHENTICATED USER ID
     ========================================================== */

  function getAuthenticatedUserId(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    const possibleKeys = [
      "user",
      "currentUser",
      "auth_user",
      "jamb_user",
    ];

    for (const key of possibleKeys) {
      try {
        const stored = localStorage.getItem(key);

        if (!stored) {
          continue;
        }

        const parsed: AuthenticatedUser =
          JSON.parse(stored);

        const userId =
          parsed._id ??
          parsed.id ??
          parsed.userId;

        if (userId) {
          return userId;
        }
      } catch {
        // Ignore invalid localStorage values.
      }
    }

    return null;
  }


  /* ==========================================================
     LOAD WALLET
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadWallet() {
      try {
        setLoading(true);
        setError(null);

        const userId =
          getAuthenticatedUserId();

        if (!userId) {
          throw new Error(
            "Unable to identify the logged-in user.",
          );
        }

        console.log(
          "[CBT Wallet] Loading wallet for user:",
          userId,
        );

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

          if (cancelled) {
            return;
          }

          const mappedTransactions =
            transactionList.map(
              (transaction): WalletTransaction => {
                const amount =
                  Number(
                    transaction.amount ?? 0,
                  );

                let type:
                  | WalletTransaction["type"]
                  = "BONUS_EARNED";

                switch (transaction.type) {
                  case "earned":
                    type =
                      "PRACTICE_EARNED";
                    break;

                  case "sent":
                    type =
                      "TRANSFER_SENT";
                    break;

                  case "received":
                    type =
                      "TRANSFER_RECEIVED";
                    break;

                  case "redeemed":
                    type =
                      "REWARD_REDEMPTION";
                    break;

                  case "bonus":
                    type =
                      "BONUS_EARNED";
                    break;

                  case "contest-entry":
                    type =
                      "COMPETITION_ENTRY";
                    break;

                  case "refund":
                    type =
                      "BONUS_EARNED";
                    break;

                  default:
                    type =
                      "BONUS_EARNED";
                }

                const isDebit =
                  type === "TRANSFER_SENT" ||
                  type === "REWARD_REDEMPTION" ||
                  type === "COMPETITION_ENTRY";

                const formattedDate =
                  transaction.createdAt
                    ? new Date(
                        transaction.createdAt,
                      ).toLocaleString(
                        "en-NG",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        },
                      )
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
                    transaction.status
                      ?.toUpperCase() ===
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

          setTransactions(
            mappedTransactions,
          );


          /* ====================================================
             CALCULATE SUMMARY FROM TRANSACTIONS
             ==================================================== */

          let totalEarned = 0;
          let totalSpent = 0;
          let totalReceived = 0;
          let totalSent = 0;

          for (const transaction of transactionList) {
            const amount =
              Number(
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

          setWallet((current) => ({
            ...current,
            totalEarned,
            totalSpent,
            totalReceived,
            totalSent,
          }));
        } catch (transactionError) {
          console.error(
            "[CBT Wallet] Failed to load transactions:",
            transactionError,
          );

          // Wallet balance can still be displayed
          // even if transactions fail.
          setTransactions([]);
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
  }, []);


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
    const amount =
      Math.max(
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

    console.log(
      "[CBT Wallet] Sending points:",
      {
        recipientEmail:
          data.recipientEmail,
        points: amount,
        description:
          data.message ??
          "CBT Points transfer",
      },
    );

    const response =
      await sendCbtPoints({
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

    /*
     * Do not manually create the transaction here.
     *
     * The backend is now the source of truth.
     *
     * Reload the wallet and transactions after
     * the transfer succeeds.
     */

    const userId =
      getAuthenticatedUserId();

    if (userId) {
      const walletResponse =
        await getCbtWallet(userId);

      const transactionList =
        await getCbtTransactionList(
          userId,
        );

      setWallet((current) => ({
        ...current,
        availablePoints:
          Number(
            walletResponse.data?.points ??
              0,
          ),
      }));

      const mappedTransactions =
        transactionList.map(
          (transaction): WalletTransaction => {
            let type:
              | WalletTransaction["type"]
              = "BONUS_EARNED";

            switch (transaction.type) {
              case "earned":
                type =
                  "PRACTICE_EARNED";
                break;

              case "sent":
                type =
                  "TRANSFER_SENT";
                break;

              case "received":
                type =
                  "TRANSFER_RECEIVED";
                break;

              case "redeemed":
                type =
                  "REWARD_REDEMPTION";
                break;

              case "bonus":
              case "refund":
                type =
                  "BONUS_EARNED";
                break;

              case "contest-entry":
                type =
                  "COMPETITION_ENTRY";
                break;

              default:
                type =
                  "BONUS_EARNED";
            }

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

              amount:
                Number(
                  transaction.amount ?? 0,
                ),

              type,

              status:
                transaction.status
                  ?.toUpperCase() ===
                "FAILED"
                  ? "FAILED"
                  : "COMPLETED",

              date:
                transaction.createdAt
                  ? new Date(
                      transaction.createdAt,
                    ).toLocaleString(
                      "en-NG",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )
                  : "",
            };
          },
        );

      setTransactions(
        mappedTransactions,
      );
    }

    setSendPointsOpen(false);
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

        {/* Header */}
        <CbtWalletHeader
          balance={
            wallet.availablePoints
          }
          onRedeemRewards={
            handleOpenRewards
          }
        />


        {/* Balance + Goal */}
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


        {/* Activity */}
        <div className="mt-10">
          <CbtWalletRecentActivity
            transactions={
              transactions
            }
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


      {/* Send Points */}
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













// "use client";

// import { useMemo, useState } from "react";
// import { ArrowRight, Sparkles } from "lucide-react";
// import { useRouter } from "next/navigation";

// import CbtWalletHeader from "@/components/cbt-wallet/CbtWalletHeader";
// import CbtWalletBalance from "@/components/cbt-wallet/CbtWalletBalance";
// import CbtWalletSummary from "@/components/cbt-wallet/CbtWalletSummary";
// import CbtWalletQuickActions from "@/components/cbt-wallet/CbtWalletQuickActions";
// import CbtWalletGoal from "@/components/cbt-wallet/CbtWalletGoal";
// import CbtWalletRecentActivity from "@/components/cbt-wallet/CbtWalletRecentActivity";
// import SendPointsModal from "@/components/cbt-wallet/SendPointsModal";
// import HowCbtPointsWork from "@/components/cbt-wallet/HowCbtPointsWork";

// import type {
//   WalletTransaction,
//   CbtWalletBalance as WalletBalance,
// } from "@/types/cbt-wallet/transaction";

// const INITIAL_WALLET: WalletBalance = {
//   availablePoints: 12450,
//   totalEarned: 2900,
//   totalSpent: 2000,
//   totalReceived: 500,
//   totalSent: 500,
// };

// const INITIAL_TRANSACTIONS: WalletTransaction[] = [
//   {
//     id: "trx-928341",
//     reference: "CBT-TRX-928341",
//     title: "Biology Practice",
//     description: "Completed 25 Biology practice questions",
//     amount: 250,
//     type: "PRACTICE_EARNED",
//     status: "COMPLETED",
//     date: "Today, 6:42 PM",
//   },
//   {
//     id: "trx-928119",
//     reference: "CBT-TRX-928119",
//     title: "Points Received",
//     description: "Received from Daniel Okafor",
//     amount: 500,
//     type: "TRANSFER_RECEIVED",
//     status: "COMPLETED",
//     date: "Today, 2:15 PM",
//   },
//   {
//     id: "trx-927801",
//     reference: "CBT-TRX-927801",
//     title: "Solve & Win Entry",
//     description: "JAMB Science Challenge",
//     amount: 1000,
//     type: "COMPETITION_ENTRY",
//     status: "COMPLETED",
//     date: "Yesterday, 8:30 PM",
//   },
//   {
//     id: "trx-927642",
//     reference: "CBT-TRX-927642",
//     title: "Daily Learning Bonus",
//     description: "Completed your daily learning goal",
//     amount: 150,
//     type: "BONUS_EARNED",
//     status: "COMPLETED",
//     date: "Yesterday, 7:05 PM",
//   },
//   {
//     id: "trx-927421",
//     reference: "CBT-TRX-927421",
//     title: "Points Sent",
//     description: "Sent to Sarah Williams",
//     amount: 500,
//     type: "TRANSFER_SENT",
//     status: "COMPLETED",
//     date: "Sep 10, 4:22 PM",
//   },
//   {
//     id: "trx-927119",
//     reference: "CBT-TRX-927119",
//     title: "JAMB Mock Exam",
//     description: "Redeemed Full JAMB Mock Examination",
//     amount: 500,
//     type: "REWARD_REDEMPTION",
//     status: "COMPLETED",
//     date: "Sep 9, 9:14 AM",
//   },
//   {
//     id: "trx-926884",
//     reference: "CBT-TRX-926884",
//     title: "Competition Prize",
//     description: "JAMB Biology Challenge — 2nd Place",
//     amount: 2000,
//     type: "COMPETITION_WIN",
//     status: "COMPLETED",
//     date: "Sep 8, 5:48 PM",
//   },
// ];

// export default function CbtWalletPage() {
//   const router = useRouter();

//   const [wallet, setWallet] =
//     useState<WalletBalance>(INITIAL_WALLET);

//   const [transactions, setTransactions] =
//     useState<WalletTransaction[]>(
//       INITIAL_TRANSACTIONS,
//     );

//   const [sendPointsOpen, setSendPointsOpen] =
//     useState(false);

//   const goalTarget = 15000;

//   const goalRemaining = useMemo(
//     () =>
//       Math.max(
//         0,
//         goalTarget - wallet.availablePoints,
//       ),
//     [wallet.availablePoints],
//   );

//   function handleEarnPoints() {
//     router.push(
//       "/student/practice/cbtsubjects?exam=jamb",
//     );
//   }

//   function handleOpenRewards() {
//     router.push(
//       "/student/practice/cbt-point-reward",
//     );
//   }

//   async function handleSendPoints(data: {
//     recipientEmail: string;
//     recipientName: string;
//     amount: number;
//     message?: string;
//   }) {
//     const amount = Math.max(0, data.amount);

//     if (
//       amount <= 0 ||
//       amount > wallet.availablePoints
//     ) {
//       throw new Error(
//         "Insufficient CBT Points.",
//       );
//     }

//     const now = new Date();

//     const transaction: WalletTransaction = {
//       id: `trx-${Date.now()}`,
//       reference: `CBT-TRX-${Date.now()}`,
//       title: "Points Sent",
//       description: `Sent to ${data.recipientName}`,
//       amount,
//       type: "TRANSFER_SENT",
//       status: "COMPLETED",
//       date: now.toLocaleString("en-NG", {
//         month: "short",
//         day: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//       }),
//       counterparty: {
//         name: data.recipientName,
//         email: data.recipientEmail,
//       },
//     };

//     setWallet((current) => ({
//       ...current,
//       availablePoints:
//         current.availablePoints - amount,
//       totalSent:
//         current.totalSent + amount,
//       totalSpent:
//         current.totalSpent + amount,
//     }));

//     setTransactions((current) => [
//       transaction,
//       ...current,
//     ]);

//     setSendPointsOpen(false);
//   }

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <CbtWalletHeader
//           balance={wallet.availablePoints}
//           onRedeemRewards={handleOpenRewards}
//         />

//         {/* Balance + Goal */}
//         <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
//           <CbtWalletBalance
//             balance={wallet.availablePoints}
//             totalEarned={wallet.totalEarned}
//             totalSpent={wallet.totalSpent}
//             onEarnPoints={handleEarnPoints}
//             onSendPoints={() =>
//               setSendPointsOpen(true)
//             }
//           />

//           <CbtWalletGoal
//             currentPoints={
//               wallet.availablePoints
//             }
//             targetPoints={goalTarget}
//             title="Your Points Goal"
//             description="You're getting closer to your next milestone."
//             rewardTitle="Next milestone"
//             rewardDescription={`${goalRemaining.toLocaleString(
//               "en-NG",
//             )} points to reach your ${goalTarget.toLocaleString(
//               "en-NG",
//             )} point goal.`}
//           />
//         </div>

//         {/* Summary */}
//         <div className="mt-6">
//           <CbtWalletSummary
//             balance={wallet}
//           />
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8">
//           <CbtWalletQuickActions
//             onSendPoints={() =>
//               setSendPointsOpen(true)
//             }
//             onRedeemRewards={
//               handleOpenRewards
//             }
//           />
//         </div>

//         {/* Rewards Shortcut */}
//         <section className="mt-8 overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-r from-violet-950/30 via-slate-900/70 to-cyan-950/20 p-5 sm:p-6">
//           <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
//                 <Sparkles className="h-5 w-5" />
//               </div>

//               <div>
//                 <h2 className="text-sm font-bold text-white">
//                   Turn your CBT Points into rewards
//                 </h2>

//                 <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
//                   Use your points to unlock educational
//                   rewards, study tools, vouchers, gadgets,
//                   and more.
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleOpenRewards}
//               className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
//             >
//               View Rewards
//               <ArrowRight className="h-4 w-4" />
//             </button>
//           </div>
//         </section>

//         {/* Activity */}
//         <div className="mt-10">
//           <CbtWalletRecentActivity
//             transactions={transactions}
//             limit={8}
//           />
//         </div>

//         {/* How Points Work */}
//         <div className="mt-8">
//           <HowCbtPointsWork />
//         </div>

//         {/* Motivation */}
//         <div className="mt-8 overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-r from-violet-950/30 via-slate-900/60 to-cyan-950/20 p-5 sm:p-6">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
//                 <Sparkles className="h-5 w-5" />
//               </div>

//               <div>
//                 <h3 className="text-sm font-bold text-white">
//                   Every question can take you closer.
//                 </h3>

//                 <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
//                   Practice consistently, build your
//                   knowledge, earn CBT Points, and work
//                   towards rewards that support your
//                   learning journey.
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleEarnPoints}
//               className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
//             >
//               Start Practicing
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Send Points */}
//       <SendPointsModal
//         open={sendPointsOpen}
//         balance={wallet.availablePoints}
//         onClose={() =>
//           setSendPointsOpen(false)
//         }
//         onSend={handleSendPoints}
//       />
//     </main>
//   );
// }