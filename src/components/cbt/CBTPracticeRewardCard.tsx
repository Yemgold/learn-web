



"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Gift,
  Sparkles,
} from "lucide-react";

type RewardId =
  | "laptop"
  | "phone"
  | "phone-premium"
  | "headphones"
  | "smart-watch"
  | "school-bag";

type Reward = {
  id: RewardId;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type CBTPracticeRewardCardProps = {
  /** Destination for the student's CBT wallet. */
  walletHref?: string;
  /**
   * Connect this to your backend claim endpoint. It should resolve only after
   * the claim succeeds. The component navigates to the wallet afterwards.
   */
  onClaim?: (details: { reward: RewardId; points: number }) => Promise<void> | void;
  /** Optional extra Tailwind classes for the outer card. */
  className?: string;
};

const CBT_REWARD_POINTS = 50_000;

const REWARDS: Reward[] = [
  {
    id: "laptop",
    name: "Laptop",
    description: "For learning and productivity",
    image: "/rewards/student-laptop.jpg",
    imageAlt: "Laptop reward",
  },
  {
    id: "phone",
    name: "Smartphone",
    description: "Learn wherever you go",
    image: "/rewards/student-smartphone.jpg",
    imageAlt: "Smartphone reward",
  },
  {
    id: "phone-premium",
    name: "Smartphone Plus",
    description: "Another phone reward option",
    image: "/rewards/student-smartphone1.jpg",
    imageAlt: "Alternative smartphone reward",
  },
  {
    id: "headphones",
    name: "Wireless Headphones",
    description: "Focus on your study sessions",
    image: "/rewards/wireless-headphones.jpg",
    imageAlt: "Wireless headphones reward",
  },
  {
    id: "smart-watch",
    name: "Smart Watch",
    description: "Keep your goals in sight",
    image: "/rewards/smart-watch.jpg",
    imageAlt: "Smart watch reward",
  },
  {
    id: "school-bag",
    name: "School Bag",
    description: "Get ready for school",
    image: "/rewards/school-bag.jpg",
    imageAlt: "School bag reward",
  },
];

export default function CBTPracticeRewardCard({
  walletHref = "/student/practice/cbt-wallet",
  onClaim,
  className = "",
}: CBTPracticeRewardCardProps) {
  const router = useRouter();
  const [selectedReward, setSelectedReward] = useState<RewardId | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = async () => {
    if (!selectedReward || isClaiming) return;

    if (!onClaim) {
      setError("CBT points claiming is not connected yet. Please try again later.");
      return;
    }

    setError("");
    setIsClaiming(true);

    try {
      await onClaim({ reward: selectedReward, points: CBT_REWARD_POINTS });
      router.push(walletHref);
    } catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : "We couldn't process your claim. Please try again.",
      );
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <section
      aria-labelledby="cbt-reward-title"
      className={`relative isolate overflow-hidden rounded-3xl border border-emerald-400/20 bg-slate-950 text-white shadow-xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20">
            <Gift className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              CBT PRACTICE REWARDS
            </div>
            <h2 id="cbt-reward-title" className="text-xl font-bold tracking-tight sm:text-2xl">
              Choose your dream reward
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Set a target that motivates you to practise and improve every day.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Your CBT points reward
          </p>
          <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-3xl font-black tracking-tight text-emerald-300 sm:text-4xl">
              50,000
            </span>
            <span className="pb-1 text-sm font-semibold text-slate-300">CBT points</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Select one reward below to set it as your target.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {REWARDS.map((reward) => {
            const isSelected = selectedReward === reward.id;

            return (
              <button
                key={reward.id}
                type="button"
                onClick={() => {
                  setSelectedReward(reward.id);
                  setError("");
                }}
                aria-pressed={isSelected}
                className={`group min-w-0 overflow-hidden rounded-2xl border text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  isSelected
                    ? "border-emerald-300 bg-emerald-300/10 ring-1 ring-emerald-300/50"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white p-2">
                  <Image
                    src={reward.image}
                    alt={reward.imageAlt}
                    fill
                    sizes="(max-width: 639px) 45vw, (max-width: 1023px) 28vw, 16vw"
                    className="object-contain p-1 transition duration-300 group-hover:scale-105"
                  />
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950 shadow">
                      <BadgeCheck className="h-4 w-4" aria-label="Selected" />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <span className="block text-sm font-bold text-white">{reward.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">
                    {reward.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
  type="button"
  onClick={handleClaim}
  disabled={!selectedReward || isClaiming}
  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-400/40 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-300 hover:shadow-emerald-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 animate-pulse disabled:cursor-not-allowed disabled:opacity-45 disabled:animate-none"
>
  {isClaiming ? "Processing claim..." : "Claim 50,000 CBT Points"}
  {!isClaiming && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
</button>
          <p className="text-center text-xs leading-5 text-slate-400 sm:max-w-48 sm:text-left">
            {selectedReward
              ? `${REWARDS.find((reward) => reward.id === selectedReward)?.name} selected as your target.`
              : "Choose a reward to enable the claim button."}
          </p>
        </div>
      </div>
    </section>
  );
}
