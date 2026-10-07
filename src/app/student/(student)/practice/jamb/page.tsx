




"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Brain,
  Clock3,
  Target,
  ArrowRight,
  BarChart3,
  BookMarked,
  Trophy,
  BookOpen,
  History,
  Zap,
  WalletCards,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/stores";
import { useWallet } from "@/hooks/wallet/useWallet";

/* ============================================================
   JAMB PRACTICE DASHBOARD
   ============================================================ */

export default function JambPracticePage() {
  const router = useRouter();

  const [showWalletWarning, setShowWalletWarning] =
    useState(false);

  const user = useAuthStore((state) => state.user);

  const {
    balance,
    isLoading: walletLoading,
  } = useWallet();

  /* ============================================================
     PLAN STATUS
     ============================================================ */

  const hasSecondaryPlan =
    Array.isArray(user?.plans) &&
    user.plans.includes("SECONDARY");

  /* ============================================================
     CBT WALLET REQUIREMENT
     
     CBT deducts ₦2 per question.
     Student must have at least ₦2 before
     entering the CBT.
     ============================================================ */

  const CBT_COST_PER_QUESTION = 2;

  const walletBalance = Number(balance ?? 0);

  const canStartCBT =
    walletBalance >= CBT_COST_PER_QUESTION;

  /* ============================================================
     START CBT
     ============================================================ */

  const handleStartCBT = () => {
    if (walletLoading) {
      return;
    }

    if (!canStartCBT) {
      setShowWalletWarning(true);

      window.setTimeout(() => {
        setShowWalletWarning(false);
      }, 3000);

      return;
    }

    router.push(
      "/student/practice/cbtsubjects?exam=jamb"
    );
  };

  /* ============================================================
     FUND WALLET
     
     Shows a short warning before taking the student
     to the wallet page.
     ============================================================ */

  const handleFundWallet = () => {
    setShowWalletWarning(true);

    window.setTimeout(() => {
      setShowWalletWarning(false);
      router.push("/student/wallet");
    }, 1200);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ==================================================
          BACKGROUND IDENTITY
         ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-10">
        {/* ==================================================
            HEADER
           ================================================== */}

        <div className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-300">
                JAMB Practice
              </span>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
                JAMB Practice Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-400">
                Prepare for JAMB with past questions, timed CBT
                practice, subject-based practice, and
                performance tracking.
              </p>
            </div>

            {/* Back to examination selection */}

            <Link
              href="/student/practice"
              className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Change Examination
            </Link>
          </div>
        </div>

        {/* ==================================================
            STATISTICS
           ================================================== */}

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <BookOpen className="mx-auto h-10 w-10 text-blue-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              12
            </h2>

            <p className="mt-2 text-slate-400">
              Tests Taken
            </p>
          </Card>

          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <Target className="mx-auto h-10 w-10 text-green-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              82%
            </h2>

            <p className="mt-2 text-slate-400">
              Average Score
            </p>
          </Card>

          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <Clock3 className="mx-auto h-10 w-10 text-orange-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              18h
            </h2>

            <p className="mt-2 text-slate-400">
              Study Time
            </p>
          </Card>

          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <BarChart3 className="mx-auto h-10 w-10 text-purple-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              +15%
            </h2>

            <p className="mt-2 text-slate-400">
              Improvement
            </p>
          </Card>
        </div>

        {/* ==================================================
            MAIN PRACTICE OPTIONS
           ================================================== */}

        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Start Practising
            </h2>

            <p className="mt-2 text-slate-400">
              Choose how you want to prepare for JAMB.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ==================================================
                PAST QUESTIONS
               ================================================== */}

            <Card
              hoverable
              className="relative overflow-hidden border border-white/10 bg-white/[0.04] shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <Brain className="h-7 w-7 text-blue-400" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                Practice Past Questions
              </h3>

              <p className="mt-3 leading-6 text-slate-400">
                Practise authentic JAMB questions by subject,
                year, topic, and question category.
              </p>

             
{/* ==================================================
    PRACTICE INFORMATION
   ================================================== */}

<div className="mt-4 flex items-center justify-between rounded-xl border border-green-500/10 bg-green-500/5 px-4 py-3">
  <span className="text-xs font-medium text-slate-400">
    Cost Per Year
  </span>

  <span className="text-sm font-bold text-green-400">
    ₦3,000.00 only
  </span>
</div>

<div className="mt-2 flex items-center gap-2">
  <span
    className={`h-2 w-2 rounded-full ${
      hasSecondaryPlan
        ? "bg-green-400"
        : "bg-red-400"
    }`}
  />

  <p
    className={`text-xs font-semibold ${
      hasSecondaryPlan
        ? "text-green-400"
        : "text-red-400"
    }`}
  >
    {hasSecondaryPlan ? "Paid" : "Not Yet Paid"}
  </p>
</div>

<Link
  href="/student/practice/jamb/combination"
  className="mt-6 inline-flex"
>
  <Button
    rightIcon={
      <ArrowRight className="h-4 w-4" />
    }
  >
    {hasSecondaryPlan
      ? "Start Practice"
      : "Start Free Practice"}
  </Button>
</Link>


            </Card>


{/* ==================================================
    TIMED CBT
   ================================================== */}

<Card
  hoverable
  className="relative overflow-hidden border border-white/10 bg-white/[0.04] shadow-none"
>
  {/* Header */}
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10">
        <Clock3 className="h-6 w-6 text-green-400" />
      </div>

      <h3 className="mt-5 text-xl font-bold text-white">
        JAMB CBT Simulation
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        Practice under real JAMB CBT conditions with
        timed questions and instant scoring.
      </p>
    </div>
  </div>

  {/* Quick Info */}
  <div className="mt-6 flex items-center justify-between border-y border-white/10 py-4">
    <div>
      <p className="text-xs text-slate-500">
        Reward
      </p>

      <p className="mt-1 text-sm font-semibold text-green-400">
        ₦2 → 1 CBT Point
      </p>
    </div>

    <div className="text-right">
      <p className="text-xs text-slate-500">
        Cost per question
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        ₦2
      </p>
    </div>
  </div>

  {/* Wallet */}
  <div className="mt-5 flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
        <WalletCards className="h-4 w-4 text-slate-400" />
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Wallet Balance
        </p>

        <p
          className={`mt-0.5 text-sm font-bold ${
            canStartCBT
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          ₦{walletBalance.toFixed(2)}
        </p>
      </div>
    </div>

    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        canStartCBT
          ? "bg-green-500/10 text-green-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {canStartCBT ? "Ready" : "Insufficient"}
    </span>
  </div>

  {/* Action */}
  <div className="mt-6 min-h-[72px]">
    {walletLoading ? (
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full sm:w-auto"
      >
        Checking Wallet...
      </Button>
    ) : canStartCBT ? (
      <Button
        type="button"
        variant="outline"
        onClick={handleStartCBT}
        rightIcon={
          <ArrowRight className="h-4 w-4" />
        }
        className="w-full sm:w-auto"
      >
        Start CBT
      </Button>
    ) : (
      <Button
        type="button"
        variant="outline"
        onClick={handleFundWallet}
        rightIcon={
          <WalletCards className="h-4 w-4" />
        }
        className="w-full sm:w-auto"
      >
        Fund Wallet
      </Button>
    )}

    {/* Temporary warning */}
    <div className="mt-2 min-h-[28px]">
      {showWalletWarning && (
        <p className="animate-in fade-in text-xs leading-5 text-red-400 duration-200">
          Your wallet balance is too low to start CBT.
          Please fund your wallet before starting.
        </p>
      )}
    </div>
  </div>
</Card>


            {/* ==================================================
                PRACTICE HISTORY
               ================================================== */}

            <Card
              hoverable
              className="relative overflow-hidden border border-white/10 bg-white/[0.04] shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                <BookMarked className="h-7 w-7 text-purple-400" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                Practice History
              </h3>

              <p className="mt-3 leading-6 text-slate-400">
                Review your previous JAMB practice sessions,
                scores, accuracy, and improvement.
              </p>

              <Link
                href="/student/practice/history?exam=jamb"
                className="mt-6 inline-flex"
              >
                <Button
                  variant="secondary"
                  rightIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
                  View History
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* ==================================================
            ADDITIONAL JAMB TOOLS
           ================================================== */}

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              JAMB Preparation Tools
            </h2>

            <p className="mt-2 text-slate-400">
              More ways to improve your JAMB preparation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* ==================================================
                QUICK PRACTICE
               ================================================== */}

            <Card
              hoverable
              className="border border-white/10 bg-white/[0.04] shadow-none"
            >
              <Zap className="h-10 w-10 text-orange-400" />

              <h3 className="mt-4 text-xl font-bold text-white">
                Quick Practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Answer a quick set of JAMB questions and test
                yourself without starting a full session.
              </p>
            </Card>

            {/* ==================================================
                SUBJECT PRACTICE
               ================================================== */}

            <Card
              hoverable
              className="border border-white/10 bg-white/[0.04] shadow-none"
            >
              <BookOpen className="h-10 w-10 text-blue-400" />

              <h3 className="mt-4 text-xl font-bold text-white">
                Subject Practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Focus on individual JAMB subjects and improve
                your performance one subject at a time.
              </p>
            </Card>

            {/* ==================================================
                PERFORMANCE
               ================================================== */}

            <Card
              hoverable
              className="border border-white/10 bg-white/[0.04] shadow-none"
            >
              <Trophy className="h-10 w-10 text-yellow-400" />

              <h3 className="mt-4 text-xl font-bold text-white">
                Performance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Track your JAMB progress, identify weak areas,
                and monitor your improvement.
              </p>
            </Card>
          </div>
        </div>

        {/* ==================================================
            RECENT ACTIVITY
           ================================================== */}

        <div className="mt-10">
          <Card className="border border-white/10 bg-white/[0.04] shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
                  <History className="h-6 w-6 text-slate-400" />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Recent JAMB Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Keep track of your latest practice sessions.
                  </p>
                </div>
              </div>

              <Link href="/student/practice/history?exam=jamb">
                <Button
                  variant="outline"
                  rightIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
                  View All
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
