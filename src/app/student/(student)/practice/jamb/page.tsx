


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Brain,
  Clock3,
  ArrowRight,
  BookMarked,
  WalletCards,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/stores";
import { useWallet } from "@/hooks/wallet/useWallet";

/* ============================================================
   CONFIG
   ============================================================ */

const CBT_COST_PER_QUESTION = 2;

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
     WALLET STATUS
     ============================================================ */

  const walletBalance = Number(balance ?? 0);

  const canStartCBT =
    walletBalance >= CBT_COST_PER_QUESTION;

  /* ============================================================
     START CBT
     ============================================================ */

  const handleStartCBT = () => {
    if (walletLoading) return;

    if (!canStartCBT) {
      setShowWalletWarning(true);

      window.setTimeout(() => {
        setShowWalletWarning(false);
      }, 3000);

      return;
    }

    router.push(
      "/student/practice/cbtsubjects?exam=jamb",
    );
  };

  /* ============================================================
     FUND WALLET
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
      {/* ========================================================
          BACKGROUND
         ======================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* ======================================================
            HEADER
           ====================================================== */}

        <header className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-300">
                JAMB Practice
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                JAMB Practice Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">
                Prepare for JAMB with past questions, timed CBT
                practice, subject-based practice, and performance
                tracking.
              </p>
            </div>

            <Link
              href="/student/practice"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Change Examination
            </Link>
          </div>
        </header>

        {/* ======================================================
            PRACTICE OPTIONS
           ====================================================== */}

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Start Practising
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
              Choose how you want to prepare for JAMB.
            </p>
          </div>

          {/* Equal-height grid */}

          <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* ==================================================
                CARD 1: PAST QUESTIONS
               ================================================== */}

            <Card
              hoverable
              className="flex h-full min-w-0 flex-col overflow-hidden border border-white/10 bg-white/[0.04] p-5 shadow-none transition-colors hover:border-blue-500/30 hover:bg-white/[0.06] sm:p-6"
            >
              {/* Icon and heading */}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <Brain className="h-7 w-7 text-blue-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Subject Practice
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Past Questions
                  </h3>
                </div>
              </div>

              {/* Description */}

              <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-400">
                Practise authentic JAMB questions by subject,
                year, topic, and question category. Build
                confidence with focused revision.
              </p>

              {/* Plan information */}

              <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      Annual access
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      ₦3,000.00
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                    <BookMarked className="h-5 w-5 text-green-400" />
                  </div>
                </div>

                <div className="my-4 border-t border-white/[0.07]" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">
                    Plan status
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      hasSecondaryPlan
                        ? "bg-green-500/10 text-green-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        hasSecondaryPlan
                          ? "bg-green-400"
                          : "bg-amber-400"
                      }`}
                    />

                    {hasSecondaryPlan
                      ? "Paid"
                      : "Free Trial"}
                  </span>
                </div>
              </div>

              {/* Aligned action */}

              <div className="mt-auto pt-6">
                <Link
                  href="/student/practice/jamb/combination"
                  className="block w-full"
                >
                  <Button
                    fullWidth
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                    className="min-h-12 w-full bg-blue-600 text-white hover:bg-blue-500"
                  >
                    {hasSecondaryPlan
                      ? "Start Practice"
                      : "Start Free Practice"}
                  </Button>
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                  {hasSecondaryPlan
                    ? "Continue with your selected subjects."
                    : "Start practising your available free subjects."}
                </p>
              </div>
            </Card>

            {/* ==================================================
                CARD 2: CBT SIMULATION
               ================================================== */}

            <Card
              hoverable
              className="flex h-full min-w-0 flex-col overflow-hidden border border-white/10 bg-white/[0.04] p-5 shadow-none transition-colors hover:border-green-500/30 hover:bg-white/[0.06] sm:p-6"
            >
              {/* Icon and heading */}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
                  <Clock3 className="h-7 w-7 text-green-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                    Exam Simulation
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    JAMB CBT
                  </h3>
                </div>
              </div>

              {/* Description */}

              <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-400">
                Practise under timed CBT conditions with
                examination-style questions and scoring.
                Monitor your wallet before you begin.
              </p>

              {/* CBT information */}

              <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <p className="text-xs leading-5 text-slate-500">
                      Cost per question
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      ₦2.00
                    </p>
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="text-xs leading-5 text-slate-500">
                      CBT points
                    </p>

                    <p className="mt-1 text-lg font-bold text-green-400">
                      1 point
                    </p>

                    <p className="text-[11px] text-slate-500">
                      per ₦2 spent
                    </p>
                  </div>
                </div>

                <div className="my-4 border-t border-white/[0.07]" />

                {/* Wallet balance */}

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                      <WalletCards className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        Wallet Balance
                      </p>

                      <p
                        className={`mt-1 text-lg font-bold tabular-nums ${
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
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                      walletLoading
                        ? "bg-white/5 text-slate-400"
                        : canStartCBT
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {walletLoading ? (
                      <Loader2Icon />
                    ) : canStartCBT ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5" />
                    )}

                    {walletLoading
                      ? "Checking"
                      : canStartCBT
                        ? "Ready"
                        : "Low Balance"}
                  </span>
                </div>
              </div>

              {/* Aligned action */}

              <div className="mt-auto pt-6">
                {walletLoading ? (
                  <Button
                    type="button"
                    fullWidth
                    variant="outline"
                    disabled
                    className="min-h-12 w-full border-white/10 bg-white/[0.03]"
                  >
                    <Loader2Icon />
                    Checking Wallet...
                  </Button>
                ) : canStartCBT ? (
                  <Button
                    type="button"
                    fullWidth
                    variant="outline"
                    onClick={handleStartCBT}
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                    className="min-h-12 w-full border-green-500/20 bg-green-500/[0.06] text-green-300 hover:bg-green-500/10 hover:text-green-200"
                  >
                    Start CBT
                  </Button>
                ) : (
                  <Button
                    type="button"
                    fullWidth
                    variant="outline"
                    onClick={handleFundWallet}
                    rightIcon={
                      <WalletCards className="h-4 w-4" />
                    }
                    className="min-h-12 w-full border-green-500/20 bg-green-500/[0.06] text-green-300 hover:bg-green-500/10 hover:text-green-200"
                  >
                    Fund Wallet
                  </Button>
                )}

                <div className="mt-3 min-h-[40px]">
                  {showWalletWarning && (
                    <p
                      role="status"
                      className="text-center text-xs leading-5 text-amber-400"
                    >
                      {canStartCBT
                        ? "Opening your CBT practice..."
                        : "Your wallet balance is too low. Fund your wallet to continue."}
                    </p>
                  )}

                  {!showWalletWarning && (
                    <p className="text-center text-xs leading-5 text-slate-500">
                      {canStartCBT
                        ? "Your wallet meets the minimum entry requirement."
                        : "You need at least ₦2 to start CBT."}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* ==================================================
                CARD 3: PRACTICE HISTORY
               ================================================== */}

            <Card
              hoverable
              className="flex h-full min-w-0 flex-col overflow-hidden border border-white/10 bg-white/[0.04] p-5 shadow-none transition-colors hover:border-purple-500/30 hover:bg-white/[0.06] sm:p-6 md:col-span-2 xl:col-span-1"
            >
              {/* Icon and heading */}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                  <BookMarked className="h-7 w-7 text-purple-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Your Progress
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Practice History
                  </h3>
                </div>
              </div>

              {/* Description */}

              <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-400">
                Review your previous JAMB practice sessions,
                scores, accuracy, and improvement over time.
                Use your results to identify what to revise.
              </p>

              {/* History information */}

              <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                    <BookMarked className="h-5 w-5 text-purple-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      Your past sessions
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Scores, accuracy and progress
                    </p>
                  </div>
                </div>

                <div className="my-4 border-t border-white/[0.07]" />

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-400" />

                  <span>Track your learning progress</span>
                </div>
              </div>

              {/* Aligned action */}

              <div className="mt-auto pt-6">
                <Link
                  href="/student/practice/history?exam=jamb"
                  className="block w-full"
                >
                  <Button
                    fullWidth
                    variant="secondary"
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                    className="min-h-12 w-full"
                  >
                    View History
                  </Button>
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                  Learn from your previous attempts.
                </p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   SMALL WALLET LOADER ICON
   ============================================================ */

function Loader2Icon() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}
