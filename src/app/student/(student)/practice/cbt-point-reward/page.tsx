




"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

import StudentRewards from "@/components/cbt-wallet/StudentRewards";
import MyRewards from "@/components/cbt-wallet/MyRewards";
import HowCbtPointsWork from "@/components/cbt-wallet/HowCbtPointsWork";

import type {
  StudentReward,
  RedeemedReward,
} from "@/types/cbt-wallet/reward";

const INITIAL_BALANCE = 12450;

const INITIAL_REDEEMED_REWARDS: RedeemedReward[] = [
  {
    id: "redeemed-001",
    rewardId: "mock-exam-pack",
    title: "JAMB Mock Exam Pack",
    description: "Full practice examination pack",
    points: 500,
    status: "DELIVERED",
    redeemedAt: "2026-09-09T09:14:00",
    redemptionReference: "RWD-2026-001",
  },
];

export default function CbtPointRewardPage() {
  const router = useRouter();

  const balance = INITIAL_BALANCE;

  function handleBack() {
    router.back();
  }

  function handleRedeem(reward: StudentReward) {
    console.log("Redeem reward:", reward);

    // Reward redemption can be connected here later.
  }

  function handleSave(reward: StudentReward) {
    router.push(
      `/student/rewards?reward=${encodeURIComponent(
        reward.id,
      )}`,
    );
  }

  function handleRewardClick(reward: RedeemedReward) {
    console.log(
      "Selected redeemed reward:",
      reward,
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <section className="overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/70 via-slate-900 to-cyan-950/40 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Sparkles className="h-5 w-5" />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">
                  CBT Point Rewards
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Turn Your Points Into Rewards
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Use your CBT Points to unlock useful study
                tools, educational rewards, vouchers, gadgets,
                and more.
              </p>
            </div>

            {/* Balance */}
            <div className="shrink-0 rounded-2xl border border-violet-400/20 bg-black/20 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Available CBT Points
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {balance.toLocaleString("en-NG")}
              </p>

              <p className="mt-1 text-xs text-violet-300">
                Ready to redeem
              </p>
            </div>
          </div>
        </section>

        {/* Featured Rewards */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Sparkles className="h-4 w-4" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                  Featured Rewards
                </span>
              </div>

              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Choose a reward you want
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Redeem your CBT Points for rewards that support
                your learning journey.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/student/rewards")
              }
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-violet-500/30 hover:bg-slate-800 hover:text-white"
            >
              Browse All Rewards
            </button>
          </div>

          <StudentRewards
            balance={balance}
            onRedeem={handleRedeem}
            onSave={handleSave}
            showFeatured
            limit={6}
          />
        </section>

        {/* My Rewards */}
        <section className="mt-10">
          <div className="mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Your Rewards
            </span>

            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              My Redeemed Rewards
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              View the rewards you have already redeemed using
              your CBT Points.
            </p>
          </div>

          <MyRewards
            rewards={INITIAL_REDEEMED_REWARDS}
            limit={6}
            onRewardClick={handleRewardClick}
          />
        </section>

        {/* How CBT Points Work */}
        <section className="mt-10">
          <HowCbtPointsWork />
        </section>

        {/* Motivation */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-r from-violet-950/30 via-slate-900/60 to-cyan-950/20 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Keep learning. Keep earning.
                </h3>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                  Practice consistently, earn CBT Points,
                  and use your points to unlock rewards that
                  make your learning journey better.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/student/practice/cbtsubjects?exam=jamb",
                )
              }
              className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
            >
              Start Practicing
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}