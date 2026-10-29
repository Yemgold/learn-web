





"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";

import { getCbtWallet } from "@/lib/api/cbtWallet";
import { useAuthStore } from "@/stores/auth.store";

import StudentRewards from "@/components/cbt-wallet/StudentRewards";
import MyRewards from "@/components/cbt-wallet/MyRewards";
import HowCbtPointsWork from "@/components/cbt-wallet/HowCbtPointsWork";

import type {
  WalletTransaction,
  CbtWalletBalance as WalletBalance,
} from "@/types/cbt-wallet/transaction";

import type {
  StudentReward,
  RedeemedReward,
} from "@/types/cbt-wallet/reward";

type ApiRecord = Record<string, unknown>;

const EMPTY_BALANCE: WalletBalance = {
  availablePoints: 0,
  totalEarned: 0,
  totalSpent: 0,
  totalReceived: 0,
  totalSent: 0,
};

function asRecord(value: unknown): ApiRecord {
  return value && typeof value === "object"
    ? (value as ApiRecord)
    : {};
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = asRecord(error.response?.data);

    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data.error === "string") {
      return data.error;
    }

    if (error.response?.status === 401) {
      return "Your session has expired. Please log in again.";
    }

    if (error.response?.status === 404) {
      return "Your CBT wallet could not be found.";
    }
  }

  return error instanceof Error
    ? error.message
    : "Unable to load your CBT wallet. Please try again.";
}

function getPoints(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function getTransactionList(walletData: ApiRecord): WalletTransaction[] {
  const possibleLists = [
    walletData.transactions,
    walletData.transactionHistory,
    walletData.history,
  ];

  const list = possibleLists.find(Array.isArray);

  return Array.isArray(list) ? (list as WalletTransaction[]) : [];
}


function mapRedeemedRewards(
  transactions: WalletTransaction[],
): RedeemedReward[] {
  const rewards: RedeemedReward[] = [];

  transactions.forEach((transaction, index) => {
    const item = asRecord(transaction);

    const type = String(
      item.type ?? item.transactionType ?? item.action ?? "",
    ).toUpperCase();

    const isRedemption =
      type.includes("REDEEM") ||
      type.includes("REDEMPTION") ||
      type.includes("REWARD_CLAIM");

    if (!isRedemption) return;

    const rewardId = String(
      item.rewardId ??
        item.reward_id ??
        item.reference ??
        item._id ??
        index,
    );

    const rawDate =
      item.createdAt ?? item.redeemedAt ?? item.transactionDate;

    let redeemedAt = "";

    if (typeof rawDate === "string" || typeof rawDate === "number") {
      const date = new Date(rawDate);

      if (!Number.isNaN(date.getTime())) {
        redeemedAt = date.toISOString();
      }
    }

    const rawStatus = String(
      item.status ?? "PROCESSING",
    ).toUpperCase();

    const status: RedeemedReward["status"] =
      rawStatus === "DELIVERED" ||
      rawStatus === "COMPLETED" ||
      rawStatus === "SUCCESS"
        ? "DELIVERED"
        : rawStatus === "CANCELLED" ||
            rawStatus === "FAILED"
          ? "CANCELLED"
          : "PROCESSING";

    rewards.push({
      id: String(item._id ?? item.id ?? rewardId),
      rewardId,
      title: String(
        item.rewardTitle ??
          item.rewardName ??
          item.title ??
          item.description ??
          "Redeemed reward",
      ),
      description: String(
        item.rewardDescription ?? item.description ?? "",
      ),
      image: String(item.image ?? item.rewardImage ?? ""),
      points: getPoints(
        item.points ?? item.amount ?? item.pointsSpent,
      ),
      status,
      redeemedAt,
      redemptionReference: String(
        item.redemptionReference ??
          item.reference ??
          item.transactionReference ??
          "",
      ),
    });
  });

  return rewards;
}

export default function CbtPointRewardPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const userId = user?._id ?? user?.id;

  const [balance, setBalance] = useState<WalletBalance>(EMPTY_BALANCE);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWallet = useCallback(async () => {
    if (!isHydrated) return;

    if (!userId) {
      setLoading(false);
      setError("Please log in to view your CBT Point Rewards.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getCbtWallet(String(userId));
      const responseData = asRecord(response);
      const outerData = asRecord(responseData.data);
      const walletData = Object.keys(outerData).length
        ? outerData
        : responseData;

      const points = getPoints(
        walletData.points ??
          walletData.availablePoints ??
          walletData.balance,
      );

      setBalance({
        availablePoints: points,
        totalEarned: getPoints(walletData.totalEarned),
        totalSpent: getPoints(walletData.totalSpent),
        totalReceived: getPoints(walletData.totalReceived),
        totalSent: getPoints(walletData.totalSent),
      });

      const transactions = getTransactionList(walletData);
      setRedeemedRewards(mapRedeemedRewards(transactions));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setBalance(EMPTY_BALANCE);
      setRedeemedRewards([]);
    } finally {
      setLoading(false);
    }
  }, [isHydrated, userId]);

  useEffect(() => {
    void loadWallet();
  }, [loadWallet]);

  function handleBack() {
    router.back();
  }

  function handleRedeem(reward: StudentReward) {
    // Connect this action to your real reward-redemption API.
    // Do not subtract points or show a successful redemption until
    // the backend confirms that the redemption has succeeded.
    router.push(
      `/student/rewards?reward=${encodeURIComponent(reward.id)}`,
    );
  }

  function handleSave(reward: StudentReward) {
    router.push(
      `/student/rewards?reward=${encodeURIComponent(reward.id)}`,
    );
  }

  function handleRewardClick(reward: RedeemedReward) {
    if (reward.id) {
      router.push(
        `/student/rewards?reward=${encodeURIComponent(reward.rewardId)}`,
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

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
                Use your CBT Points to unlock useful study tools,
                educational rewards, vouchers, gadgets, and more.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-violet-400/20 bg-black/20 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Available CBT Points
              </p>

              {loading ? (
                <div className="mt-3 h-9 w-36 animate-pulse rounded-lg bg-slate-700" />
              ) : (
                <p className="mt-2 text-3xl font-black text-white">
                  {balance.availablePoints.toLocaleString("en-NG", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              )}

              <p className="mt-1 text-xs text-violet-300">
                {loading ? "Loading your balance..." : "Live wallet balance"}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <section
            role="alert"
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-950/30 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm leading-6 text-red-200">{error}</p>

            <button
              type="button"
              onClick={() => void loadWallet()}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-100 hover:bg-red-400/20 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </section>
        )}

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
                Redeem your CBT Points for rewards that support your learning journey.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/student/rewards")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-violet-500/30 hover:bg-slate-800 hover:text-white"
            >
              Browse All Rewards
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-56 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                />
              ))}
            </div>
          ) : (
            <StudentRewards
              balance={balance.availablePoints}
              onRedeem={handleRedeem}
              onSave={handleSave}
              showFeatured
              limit={6}
            />
          )}
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Your Rewards
            </span>

            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              My Redeemed Rewards
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Your confirmed reward-redemption history, when available from your wallet data.
            </p>
          </div>

          {loading ? (
            <div className="h-36 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
          ) : (
            <MyRewards
              rewards={redeemedRewards}
              limit={6}
              onRewardClick={handleRewardClick}
            />
          )}
        </section>

        <section className="mt-10">
          <HowCbtPointsWork />
        </section>

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
                  Practice consistently, earn CBT Points, and use your points to unlock rewards.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/student/practice/cbtsubjects?exam=jamb")
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
