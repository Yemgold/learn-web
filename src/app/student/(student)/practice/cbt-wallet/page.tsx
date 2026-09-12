




"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gift,
  History,
  Info,
  Loader2,
  Medal,
  MoreHorizontal,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ============================================================
   TYPES
   ============================================================ */

type TransactionType =
  | "PRACTICE_EARNED"
  | "BONUS_EARNED"
  | "COMPETITION_ENTRY"
  | "COMPETITION_WIN"
  | "TRANSFER_SENT"
  | "TRANSFER_RECEIVED"
  | "REWARD_REDEMPTION";

type TransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "FAILED";

type RewardCategory =
  | "All"
  | "Mock Exams"
  | "Question Packs"
  | "Premium Access"
  | "Competition";

interface WalletTransaction {
  id: string;
  reference: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  time: string;
}

interface WalletReward {
  id: string;
  title: string;
  description: string;
  category: Exclude<RewardCategory, "All">;
  pointsCost: number;
  icon: "mock" | "questions" | "premium" | "competition";
  popular?: boolean;
  available: boolean;
}

interface RedeemedReward {
  id: string;
  rewardId: string;
  title: string;
  pointsUsed: number;
  redeemedAt: string;
  status: "ACTIVE" | "USED";
}

/* ============================================================
   MOCK DATA
   ============================================================ */

const INITIAL_BALANCE = 12450;

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "trx-001",
    reference: "CBT-TRX-928341",
    type: "PRACTICE_EARNED",
    title: "Biology Practice",
    description: "Completed 25 Biology practice questions",
    amount: 250,
    status: "COMPLETED",
    date: "Today",
    time: "6:42 PM",
  },
  {
    id: "trx-002",
    reference: "CBT-TRX-928119",
    type: "TRANSFER_RECEIVED",
    title: "Points Received",
    description: "Received from Daniel Okafor",
    amount: 500,
    status: "COMPLETED",
    date: "Today",
    time: "2:15 PM",
  },
  {
    id: "trx-003",
    reference: "CBT-TRX-927801",
    type: "COMPETITION_ENTRY",
    title: "Solve & Win Entry",
    description: "JAMB Science Challenge",
    amount: -1000,
    status: "COMPLETED",
    date: "Yesterday",
    time: "8:30 PM",
  },
  {
    id: "trx-004",
    reference: "CBT-TRX-927642",
    type: "BONUS_EARNED",
    title: "Daily Learning Bonus",
    description: "Completed your daily learning goal",
    amount: 150,
    status: "COMPLETED",
    date: "Yesterday",
    time: "7:05 PM",
  },
  {
    id: "trx-005",
    reference: "CBT-TRX-927421",
    type: "TRANSFER_SENT",
    title: "Points Sent",
    description: "Sent to Sarah Williams",
    amount: -500,
    status: "COMPLETED",
    date: "Sep 10",
    time: "4:22 PM",
  },
  {
    id: "trx-006",
    reference: "CBT-TRX-927119",
    type: "REWARD_REDEMPTION",
    title: "JAMB Mock Exam",
    description: "Redeemed Full JAMB Mock Examination",
    amount: -500,
    status: "COMPLETED",
    date: "Sep 9",
    time: "9:14 AM",
  },
  {
    id: "trx-007",
    reference: "CBT-TRX-926884",
    type: "COMPETITION_WIN",
    title: "Competition Prize",
    description: "JAMB Biology Challenge — 2nd Place",
    amount: 2000,
    status: "COMPLETED",
    date: "Sep 8",
    time: "5:48 PM",
  },
];

const MOCK_REWARDS: WalletReward[] = [
  {
    id: "reward-001",
    title: "JAMB Full Mock Exam",
    description:
      "Take a complete JAMB-style mock examination with timed questions.",
    category: "Mock Exams",
    pointsCost: 500,
    icon: "mock",
    popular: true,
    available: true,
  },
  {
    id: "reward-002",
    title: "100-Question Practice Pack",
    description:
      "Unlock a curated 100-question practice pack for your preparation.",
    category: "Question Packs",
    pointsCost: 750,
    icon: "questions",
    available: true,
  },
  {
    id: "reward-003",
    title: "7-Day Premium Access",
    description:
      "Unlock premium practice content and advanced learning features.",
    category: "Premium Access",
    pointsCost: 2000,
    icon: "premium",
    popular: true,
    available: true,
  },
  {
    id: "reward-004",
    title: "Solve & Win Entry",
    description:
      "Use your CBT Points to enter an eligible Solve & Win competition.",
    category: "Competition",
    pointsCost: 1000,
    icon: "competition",
    available: true,
  },
];

/* ============================================================
   HELPERS
   ============================================================ */

function formatPoints(value: number) {
  return value.toLocaleString("en-NG");
}

function getTransactionIcon(type: TransactionType) {
  switch (type) {
    case "PRACTICE_EARNED":
      return BookOpen;

    case "BONUS_EARNED":
      return Zap;

    case "COMPETITION_ENTRY":
      return Trophy;

    case "COMPETITION_WIN":
      return Medal;

    case "TRANSFER_SENT":
      return ArrowUpRight;

    case "TRANSFER_RECEIVED":
      return ArrowDownLeft;

    case "REWARD_REDEMPTION":
      return Gift;

    default:
      return History;
  }
}

function getRewardIcon(icon: WalletReward["icon"]) {
  switch (icon) {
    case "mock":
      return BookOpen;

    case "questions":
      return Sparkles;

    case "premium":
      return Award;

    case "competition":
      return Trophy;

    default:
      return Gift;
  }
}

function isPositiveTransaction(type: TransactionType) {
  return (
    type === "PRACTICE_EARNED" ||
    type === "BONUS_EARNED" ||
    type === "COMPETITION_WIN" ||
    type === "TRANSFER_RECEIVED"
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function CbtWalletPage() {
  const [balance, setBalance] =
    useState<number>(INITIAL_BALANCE);

  const [transactions, setTransactions] = useState<
    WalletTransaction[]
  >(MOCK_TRANSACTIONS);

  const [redeemedRewards, setRedeemedRewards] =
    useState<RedeemedReward[]>([]);

  const [activeTransactionFilter, setActiveTransactionFilter] =
    useState<"ALL" | "EARNED" | "SPENT">("ALL");

  const [activeRewardCategory, setActiveRewardCategory] =
    useState<RewardCategory>("All");

  const [showSendModal, setShowSendModal] =
    useState(false);

  const [showRedeemModal, setShowRedeemModal] =
    useState(false);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [selectedReward, setSelectedReward] =
    useState<WalletReward | null>(null);

  const [recipientEmail, setRecipientEmail] =
    useState("");

  const [recipientName, setRecipientName] =
    useState("");

  const [sendAmount, setSendAmount] =
    useState("");

  const [sendMessage, setSendMessage] =
    useState("");

  const [isFindingRecipient, setIsFindingRecipient] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const [isRedeeming, setIsRedeeming] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  /* ==========================================================
     MOCK WALLET SUMMARY
     ========================================================== */

  const totalEarned = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        ),
    [transactions]
  );

  const totalSpent = useMemo(
    () =>
      Math.abs(
        transactions
          .filter((transaction) => transaction.amount < 0)
          .reduce(
            (total, transaction) =>
              total + transaction.amount,
            0
          )
      ),
    [transactions]
  );

  const totalReceived = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.type ===
            "TRANSFER_RECEIVED"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        ),
    [transactions]
  );

  const totalSent = useMemo(
    () =>
      Math.abs(
        transactions
          .filter(
            (transaction) =>
              transaction.type === "TRANSFER_SENT"
          )
          .reduce(
            (total, transaction) =>
              total + transaction.amount,
            0
          )
      ),
    [transactions]
  );

  /* ==========================================================
     TRANSACTION FILTER
     ========================================================== */

  const filteredTransactions = useMemo(() => {
    if (activeTransactionFilter === "ALL") {
      return transactions;
    }

    if (activeTransactionFilter === "EARNED") {
      return transactions.filter(
        (transaction) => transaction.amount > 0
      );
    }

    return transactions.filter(
      (transaction) => transaction.amount < 0
    );
  }, [transactions, activeTransactionFilter]);

  /* ==========================================================
     REWARD FILTER
     ========================================================== */

  const filteredRewards = useMemo(() => {
    if (activeRewardCategory === "All") {
      return MOCK_REWARDS;
    }

    return MOCK_REWARDS.filter(
      (reward) =>
        reward.category === activeRewardCategory
    );
  }, [activeRewardCategory]);

  /* ==========================================================
     FIND MOCK RECIPIENT
     ========================================================== */

  const handleFindRecipient = () => {
    if (!recipientEmail.trim()) {
      setErrorMessage(
        "Enter the student's email address."
      );
      return;
    }

    setErrorMessage("");
    setIsFindingRecipient(true);

    setTimeout(() => {
      setIsFindingRecipient(false);

      setRecipientName("Daniel Okafor");
    }, 700);
  };

  /* ==========================================================
     SEND POINTS
     ========================================================== */

  const handleSendPoints = () => {
    const amount = Number(sendAmount);

    if (!recipientEmail.trim()) {
      setErrorMessage(
        "Enter the recipient's email address."
      );
      return;
    }

    if (!recipientName) {
      setErrorMessage(
        "Please verify the recipient first."
      );
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMessage(
        "Enter a valid amount of CBT Points."
      );
      return;
    }

    if (amount > balance) {
      setErrorMessage(
        "You do not have enough CBT Points."
      );
      return;
    }

    if (amount < 50) {
      setErrorMessage(
        "The minimum transfer is 50 CBT Points."
      );
      return;
    }

    setErrorMessage("");
    setIsSending(true);

    setTimeout(() => {
      const newBalance = balance - amount;

      setBalance(newBalance);

      const transaction: WalletTransaction = {
        id: `trx-${Date.now()}`,
        reference: `CBT-TRX-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        type: "TRANSFER_SENT",
        title: "Points Sent",
        description: `Sent to ${recipientName}`,
        amount: -amount,
        status: "COMPLETED",
        date: "Just now",
        time: new Date().toLocaleTimeString(
          "en-NG",
          {
            hour: "numeric",
            minute: "2-digit",
          }
        ),
      };

      setTransactions((current) => [
        transaction,
        ...current,
      ]);

      setSuccessMessage(
        `${formatPoints(
          amount
        )} CBT Points successfully sent to ${recipientName}.`
      );

      setIsSending(false);
      setShowSendModal(false);
      setShowSuccessModal(true);

      setRecipientEmail("");
      setRecipientName("");
      setSendAmount("");
      setSendMessage("");
    }, 900);
  };

  /* ==========================================================
     REDEEM REWARD
     ========================================================== */

  const handleRedeemReward = () => {
    if (!selectedReward) return;

    if (balance < selectedReward.pointsCost) {
      setErrorMessage(
        "You do not have enough CBT Points for this reward."
      );
      return;
    }

    setErrorMessage("");
    setIsRedeeming(true);

    setTimeout(() => {
      const newBalance =
        balance - selectedReward.pointsCost;

      setBalance(newBalance);

      const transaction: WalletTransaction = {
        id: `trx-${Date.now()}`,
        reference: `CBT-TRX-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        type: "REWARD_REDEMPTION",
        title: selectedReward.title,
        description: `Redeemed ${selectedReward.title}`,
        amount: -selectedReward.pointsCost,
        status: "COMPLETED",
        date: "Just now",
        time: new Date().toLocaleTimeString(
          "en-NG",
          {
            hour: "numeric",
            minute: "2-digit",
          }
        ),
      };

      setTransactions((current) => [
        transaction,
        ...current,
      ]);

      setRedeemedRewards((current) => [
        {
          id: `redemption-${Date.now()}`,
          rewardId: selectedReward.id,
          title: selectedReward.title,
          pointsUsed: selectedReward.pointsCost,
          redeemedAt: "Just now",
          status: "ACTIVE",
        },
        ...current,
      ]);

      setSuccessMessage(
        `${selectedReward.title} has been successfully redeemed.`
      );

      setIsRedeeming(false);
      setShowRedeemModal(false);
      setSelectedReward(null);
      setShowSuccessModal(true);
    }, 900);
  };

  /* ==========================================================
     OPEN REDEEM
     ========================================================== */

  const openRedeemModal = (
    reward: WalletReward
  ) => {
    setSelectedReward(reward);
    setErrorMessage("");
    setShowRedeemModal(true);
  };

  /* ==========================================================
     CLOSE SEND
     ========================================================== */

  const closeSendModal = () => {
    if (isSending) return;

    setShowSendModal(false);
    setRecipientEmail("");
    setRecipientName("");
    setSendAmount("");
    setSendMessage("");
    setErrorMessage("");
  };

  /* ==========================================================
     CLOSE REDEEM
     ========================================================== */

  const closeRedeemModal = () => {
    if (isRedeeming) return;

    setShowRedeemModal(false);
    setSelectedReward(null);
    setErrorMessage("");
  };

  /* ==========================================================
     GOAL
     ========================================================== */

  const goal = 15000;

  const goalPercentage = Math.min(
    Math.round((balance / goal) * 100),
    100
  );

  const pointsToGoal = Math.max(
    goal - balance,
    0
  );

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ======================================================
          HERO
         ====================================================== */}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300">
                <Wallet className="h-3.5 w-3.5" />
                Student Wallet
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                CBT Wallet
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your CBT Points, send points to
                friends, and redeem learning rewards.
              </p>
            </div>

            <Link
              href="/student/practice/cbtsubjects?exam=jamb"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Earn More Points
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN
         ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================================
            BALANCE CARD
           ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <Card className="relative overflow-hidden border-white/10 bg-white/[0.04]">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Wallet className="h-4 w-4 text-amber-400" />
                    Available CBT Points
                  </div>

                  <div className="mt-3 flex items-end gap-3">
                    <span className="text-5xl font-bold tracking-tight sm:text-6xl">
                      {formatPoints(balance)}
                    </span>

                    <span className="pb-2 text-sm text-slate-400">
                      points
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                    <ArrowUpRight className="h-4 w-4" />
                    Keep learning to earn more
                  </div>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-xl">
                  <Button
                    onClick={() =>
                      document
                        .getElementById(
                          "wallet-rewards"
                        )
                        ?.scrollIntoView({
                          behavior: "smooth",
                        })
                    }
                    className="h-11 bg-white text-slate-950 hover:bg-slate-200"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Redeem
                  </Button>

                  <Button
                    onClick={() =>
                      setShowSendModal(true)
                    }
                    variant="outline"
                    className="h-11 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Points
                  </Button>

                  <Link
                    href="/student/practice/cbtsubjects?exam=jamb"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <Zap className="mr-2 h-4 w-4 text-amber-400" />
                    Earn
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ====================================================
            SUMMARY CARDS
           ==================================================== */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Earned",
              value: totalEarned,
              icon: ArrowDownLeft,
              iconClass:
                "bg-emerald-500/10 text-emerald-400",
            },
            {
              label: "Total Spent",
              value: totalSpent,
              icon: ArrowUpRight,
              iconClass:
                "bg-red-500/10 text-red-400",
            },
            {
              label: "Received",
              value: totalReceived,
              icon: Gift,
              iconClass:
                "bg-blue-500/10 text-blue-400",
            },
            {
              label: "Sent",
              value: totalSent,
              icon: Send,
              iconClass:
                "bg-purple-500/10 text-purple-400",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.label}
                className="border-white/10 bg-white/[0.03]"
              >
                <div className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {formatPoints(item.value)}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      CBT Points
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ====================================================
            QUICK ACTIONS
           ==================================================== */}

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your CBT Points
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/student/practice/cbtsubjects?exam=jamb"
              className="group"
            >
              <Card className="h-full border-white/10 bg-white/[0.03] transition hover:border-blue-400/30 hover:bg-white/[0.05]">
                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      Practice & Earn
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Earn CBT Points
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </Card>
            </Link>

            <button
              onClick={() =>
                setShowSendModal(true)
              }
              className="text-left"
            >
              <Card className="h-full border-white/10 bg-white/[0.03] transition hover:border-purple-400/30 hover:bg-white/[0.05]">
                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                    <Send className="h-5 w-5 text-purple-400" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      Send Points
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Send to another student
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              </Card>
            </button>

            <button
              onClick={() =>
                document
                  .getElementById(
                    "wallet-rewards"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="text-left"
            >
              <Card className="h-full border-white/10 bg-white/[0.03] transition hover:border-amber-400/30 hover:bg-white/[0.05]">
                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                    <Gift className="h-5 w-5 text-amber-400" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      Redeem Rewards
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Spend points on rewards
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              </Card>
            </button>

            <Link
              href="/student/practice/cbt-wallet/transactions"
              className="group"
            >
              <Card className="h-full border-white/10 bg-white/[0.03] transition hover:border-emerald-400/30 hover:bg-white/[0.05]">
                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                    <History className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      Transactions
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      View wallet activity
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* ====================================================
            GOAL + ACTIVITY
           ==================================================== */}

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          {/* GOAL */}
          <Card className="border-white/10 bg-white/[0.03]">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <Target className="h-5 w-5 text-purple-400" />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Your Goal
                    </h2>

                    <p className="text-xs text-slate-500">
                      Build your CBT Point balance
                    </p>
                  </div>
                </div>

                <button className="rounded-md p-2 text-slate-500 transition hover:bg-white/5 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">
                      {formatPoints(balance)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      of {formatPoints(goal)} points
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-purple-400">
                    {goalPercentage}%
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${goalPercentage}%`,
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                    className="h-full rounded-full bg-purple-500"
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <Sparkles className="h-4 w-4 text-amber-400" />

                  {pointsToGoal > 0 ? (
                    <>
                      <span>
                        {formatPoints(pointsToGoal)}{" "}
                        more points to reach your goal.
                      </span>
                    </>
                  ) : (
                    <span>
                      You reached your goal!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* RECENT ACTIVITY */}
          <Card className="border-white/10 bg-white/[0.03]">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your latest wallet transactions
                  </p>
                </div>

                <Link
                  href="/student/practice/cbt-wallet/transactions"
                  className="text-xs font-medium text-purple-400 hover:text-purple-300"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 space-y-1">
                {transactions
                  .slice(0, 4)
                  .map((transaction) => {
                    const Icon =
                      getTransactionIcon(
                        transaction.type
                      );

                    const positive =
                      transaction.amount > 0;

                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-white/[0.03]"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            positive
                              ? "bg-emerald-500/10"
                              : "bg-white/5"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              positive
                                ? "text-emerald-400"
                                : "text-slate-400"
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {transaction.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {transaction.description}
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${
                              positive
                                ? "text-emerald-400"
                                : "text-slate-200"
                            }`}
                          >
                            {positive ? "+" : ""}
                            {formatPoints(
                              transaction.amount
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        </div>

        {/* ====================================================
            REWARDS
           ==================================================== */}

        <div
          id="wallet-rewards"
          className="mt-10 scroll-mt-6"
        >
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-400" />

                <h2 className="text-xl font-bold">
                  Redeem Rewards
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Use your CBT Points to unlock learning
                rewards and competition benefits.
              </p>
            </div>

            <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs text-amber-300">
              Balance:{" "}
              <span className="font-semibold">
                {formatPoints(balance)}
              </span>{" "}
              points
            </div>
          </div>

          {/* REWARD CATEGORIES */}

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {(
              [
                "All",
                "Mock Exams",
                "Question Packs",
                "Premium Access",
                "Competition",
              ] as RewardCategory[]
            ).map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveRewardCategory(
                    category
                  )
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
                  activeRewardCategory === category
                    ? "bg-white text-slate-950"
                    : "border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredRewards.map((reward, index) => {
              const Icon = getRewardIcon(
                reward.icon
              );

              const canAfford =
                balance >= reward.pointsCost;

              return (
                <motion.div
                  key={reward.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.05]">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                          <Icon className="h-5 w-5 text-amber-400" />
                        </div>

                        {reward.popular && (
                          <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-medium text-purple-300">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                          {reward.category}
                        </p>

                        <h3 className="mt-1 font-semibold">
                          {reward.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                          {reward.description}
                        </p>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-600">
                            Cost
                          </p>

                          <p className="mt-1 font-bold text-amber-400">
                            {formatPoints(
                              reward.pointsCost
                            )}{" "}
                            pts
                          </p>
                        </div>

                        <Button
                          onClick={() =>
                            openRedeemModal(
                              reward
                            )
                          }
                          disabled={!canAfford}
                          size="sm"
                          className={
                            canAfford
                              ? "bg-white text-slate-950 hover:bg-slate-200"
                              : "bg-white/5 text-slate-600"
                          }
                        >
                          {canAfford
                            ? "Redeem"
                            : "Not enough"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            MY REWARDS
           ==================================================== */}

        {redeemedRewards.length > 0 && (
          <div className="mt-10">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-400" />

                <h2 className="text-xl font-bold">
                  My Rewards
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Rewards you have redeemed.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {redeemedRewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="border-emerald-400/10 bg-emerald-500/[0.03]"
                >
                  <div className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {reward.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Redeemed{" "}
                        {reward.redeemedAt}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400">
                      {reward.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            TRANSACTIONS
           ==================================================== */}

        <div className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-400" />

                <h2 className="text-xl font-bold">
                  Recent Transactions
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Keep track of how your CBT Points move.
              </p>
            </div>

            <Link
              href="/student/practice/cbt-wallet/transactions"
              className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              View all transactions
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <Card className="overflow-hidden border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 p-4">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  {
                    label: "All",
                    value: "ALL" as const,
                  },
                  {
                    label: "Earned",
                    value: "EARNED" as const,
                  },
                  {
                    label: "Spent",
                    value: "SPENT" as const,
                  },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() =>
                      setActiveTransactionFilter(
                        filter.value
                      )
                    }
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      activeTransactionFilter ===
                      filter.value
                        ? "bg-white text-slate-950"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {filteredTransactions
                .slice(0, 6)
                .map((transaction) => {
                  const Icon =
                    getTransactionIcon(
                      transaction.type
                    );

                  const positive =
                    transaction.amount > 0;

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 sm:p-5"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          positive
                            ? "bg-emerald-500/10"
                            : "bg-white/5"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            positive
                              ? "text-emerald-400"
                              : "text-slate-400"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {transaction.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {transaction.description}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                          <Clock3 className="h-3 w-3" />
                          {transaction.date} ·{" "}
                          {transaction.time}
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            positive
                              ? "text-emerald-400"
                              : "text-slate-200"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {formatPoints(
                            transaction.amount
                          )}
                        </p>

                        <span className="mt-1 inline-flex rounded-full bg-emerald-500/5 px-2 py-0.5 text-[9px] text-emerald-500">
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {filteredTransactions.length ===
              0 && (
              <div className="p-10 text-center">
                <History className="mx-auto h-8 w-8 text-slate-700" />

                <p className="mt-3 text-sm text-slate-500">
                  No transactions found.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ====================================================
            HOW POINTS WORK
           ==================================================== */}

        <Card className="mt-10 border-white/10 bg-white/[0.03]">
          <div className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <Info className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h3 className="font-semibold">
                  How CBT Points Work
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Earn CBT Points by practicing, completing
                  learning challenges, and participating in
                  competitions. Use your points to unlock
                  educational rewards or send points to other
                  students.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <BookOpen className="h-5 w-5 text-blue-400" />

                    <p className="mt-3 text-sm font-medium">
                      Learn
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Practice questions and complete
                      learning activities.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <Zap className="h-5 w-5 text-amber-400" />

                    <p className="mt-3 text-sm font-medium">
                      Earn
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Build your CBT Point balance through
                      consistent learning.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <Gift className="h-5 w-5 text-emerald-400" />

                    <p className="mt-3 text-sm font-medium">
                      Use
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Redeem useful rewards or send points
                      to friends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          SEND MODAL
         ====================================================== */}

      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="w-full max-w-lg overflow-hidden rounded-t-2xl border border-white/10 bg-slate-950 shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="font-semibold">
                  Send CBT Points
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Send points to another student.
                </p>
              </div>

              <button
                onClick={closeSendModal}
                disabled={isSending}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* RECIPIENT */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Recipient Email
                </label>

                <div className="flex gap-2">
                  <Input
                    value={recipientEmail}
                    onChange={(event) => {
                      setRecipientEmail(
                        event.target.value
                      );
                      setRecipientName("");
                      setErrorMessage("");
                    }}
                    placeholder="student@example.com"
                    className="border-white/10 bg-white/5 text-white placeholder:text-slate-600"
                    disabled={isSending}
                  />

                  <Button
                    type="button"
                    onClick={handleFindRecipient}
                    disabled={
                      isFindingRecipient ||
                      !recipientEmail.trim()
                    }
                    variant="outline"
                    className="shrink-0 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    {isFindingRecipient ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Find"
                    )}
                  </Button>
                </div>

                {recipientName && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                      <UserRound className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-300">
                        {recipientName}
                      </p>

                      <p className="text-xs text-emerald-200/60">
                        {recipientEmail}
                      </p>
                    </div>

                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                )}
              </div>

              {/* AMOUNT */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Amount
                  </label>

                  <span className="text-xs text-slate-500">
                    Balance:{" "}
                    <span className="text-amber-400">
                      {formatPoints(balance)}
                    </span>
                  </span>
                </div>

                <div className="relative">
                  <Input
                    type="number"
                    min="50"
                    value={sendAmount}
                    onChange={(event) => {
                      setSendAmount(
                        event.target.value
                      );
                      setErrorMessage("");
                    }}
                    placeholder="500"
                    className="h-12 border-white/10 bg-white/5 pr-24 text-lg text-white placeholder:text-slate-600"
                    disabled={isSending}
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    CBT Points
                  </span>
                </div>
              </div>

              {/* MESSAGE */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Message{" "}
                  <span className="font-normal text-slate-600">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={sendMessage}
                  onChange={(event) =>
                    setSendMessage(
                      event.target.value
                    )
                  }
                  placeholder="Good luck with your JAMB preparation!"
                  rows={3}
                  disabled={isSending}
                  className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/20"
                />
              </div>

              {/* INFO */}

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <div className="flex gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

                  <p className="text-xs leading-5 text-slate-500">
                    Transfers are final. Make sure the
                    recipient email and amount are correct
                    before confirming.
                  </p>
                </div>
              </div>

              {/* ERROR */}

              {errorMessage && (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
                  <p className="text-xs text-red-300">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={closeSendModal}
                  disabled={isSending}
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleSendPoints}
                  disabled={isSending}
                  className="flex-1 bg-white text-slate-950 hover:bg-slate-200"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Points
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ======================================================
          REDEEM MODAL
         ====================================================== */}

      {showRedeemModal &&
        selectedReward && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="w-full max-w-md overflow-hidden rounded-t-2xl border border-white/10 bg-slate-950 shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <h2 className="font-semibold">
                    Redeem Reward
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Confirm your reward redemption.
                  </p>
                </div>

                <button
                  onClick={closeRedeemModal}
                  disabled={isRedeeming}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5">
                <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                    {(() => {
                      const Icon =
                        getRewardIcon(
                          selectedReward.icon
                        );

                      return (
                        <Icon className="h-6 w-6 text-amber-400" />
                      );
                    })()}
                  </div>

                  <p className="mt-4 text-lg font-semibold">
                    {selectedReward.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {selectedReward.description}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-4">
                    <span className="text-sm text-slate-500">
                      Reward cost
                    </span>

                    <span className="font-semibold text-amber-400">
                      {formatPoints(
                        selectedReward.pointsCost
                      )}{" "}
                      pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-4">
                    <span className="text-sm text-slate-500">
                      Current balance
                    </span>

                    <span className="font-semibold">
                      {formatPoints(balance)}{" "}
                      pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <span className="text-sm text-slate-500">
                      Balance after redemption
                    </span>

                    <span className="font-semibold text-emerald-400">
                      {formatPoints(
                        balance -
                          selectedReward.pointsCost
                      )}{" "}
                      pts
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3">
                    <p className="text-xs text-red-300">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <Button
                    onClick={closeRedeemModal}
                    disabled={isRedeeming}
                    variant="outline"
                    className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleRedeemReward}
                    disabled={
                      isRedeeming ||
                      balance <
                        selectedReward.pointsCost
                    }
                    className="flex-1 bg-white text-slate-950 hover:bg-slate-200"
                  >
                    {isRedeeming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redeeming...
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-4 w-4" />
                        Confirm Redemption
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      {/* ======================================================
          SUCCESS MODAL
         ====================================================== */}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 p-6 text-center shadow-2xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <Check className="h-7 w-7 text-emerald-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Success
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {successMessage}
            </p>

            <Button
              onClick={() =>
                setShowSuccessModal(false)
              }
              className="mt-6 w-full bg-white text-slate-950 hover:bg-slate-200"
            >
              Done
            </Button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
