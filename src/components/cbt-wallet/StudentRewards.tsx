




"use client";

import { useMemo, useState } from "react";
import {
  Backpack,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gift,
  GraduationCap,
  Headphones,
  Laptop,
  LampDesk,
  Loader2,
  LockKeyhole,
  Medal,
  Pencil,
  School,
  Signal,
  Smartphone,
  Sparkles,
  Speaker,
  Table,
  Ticket,
  Trophy,
  Watch,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  canRedeemReward,
  calculateRewardProgress,
  formatRewardPoints,
  getFeaturedRewards,
  getPointsRemaining,
  studentRewards,
} from "@/data/cbt-wallet/student-rewards";

import type {
  RewardCategory,
  RewardCategoryOption,
  StudentReward,
} from "@/types/cbt-wallet/reward";

interface StudentRewardsProps {
  /**
   * Current CBT Point balance.
   */
  balance: number;

  /**
   * Called when a student chooses to redeem a reward.
   */
  onRedeem?: (reward: StudentReward) => void;

  /**
   * Optional callback when the student chooses
   * to save toward a reward.
   */
  onSave?: (reward: StudentReward) => void;

  /**
   * Optional initial category.
   */
  initialCategory?: "ALL" | RewardCategory;

  /**
   * Show featured rewards section.
   */
  showFeatured?: boolean;

  /**
   * Maximum number of rewards shown in the main grid.
   *
   * Defaults to all rewards.
   */
  limit?: number;
}

const categories: RewardCategoryOption[] = [
  {
    id: "ALL",
    label: "All",
    icon: "Gift",
  },
  {
    id: "GADGETS",
    label: "Gadgets",
    icon: "Smartphone",
  },
  {
    id: "STUDY",
    label: "Study",
    icon: "BookOpen",
  },
  {
    id: "EDUCATION",
    label: "Education",
    icon: "GraduationCap",
  },
  {
    id: "INTERNET",
    label: "Internet",
    icon: "Wifi",
  },
  {
    id: "SCHOOL",
    label: "School",
    icon: "School",
  },
  {
    id: "VOUCHERS",
    label: "Vouchers",
    icon: "Ticket",
  },
  {
    id: "COMPETITION",
    label: "Competition",
    icon: "Trophy",
  },
];

function getRewardIcon(reward: StudentReward) {
  switch (reward.icon) {
    case "Smartphone":
      return Smartphone;

    case "Laptop":
      return Laptop;

    case "Headphones":
      return Headphones;

    case "Watch":
      return Watch;

    case "Speaker":
      return Speaker;

    case "Table":
      return Table;

    case "LampDesk":
      return LampDesk;

    case "Backpack":
      return Backpack;

    case "PenLine":
    case "Pencil":
      return Pencil;

    case "BookOpen":
      return BookOpen;

    case "GraduationCap":
      return GraduationCap;

    case "Sparkles":
      return Sparkles;

    case "FileQuestion":
      return BookOpen;

    case "Wifi":
      return Wifi;

    case "Signal":
      return Signal;

    case "Ticket":
      return Ticket;

    case "Trophy":
      return Trophy;

    default:
      return Gift;
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "GADGETS":
      return Smartphone;

    case "STUDY":
      return BookOpen;

    case "EDUCATION":
      return GraduationCap;

    case "INTERNET":
      return Wifi;

    case "SCHOOL":
      return School;

    case "VOUCHERS":
      return Ticket;

    case "COMPETITION":
      return Trophy;

    default:
      return Gift;
  }
}

function getBadgeLabel(
  badge: StudentReward["badge"]
): string | null {
  switch (badge) {
    case "POPULAR":
      return "Popular";

    case "NEW":
      return "New";

    case "STUDENT_FAVOURITE":
      return "Student Favourite";

    case "LIMITED":
      return "Limited";

    case "BIG_GOAL":
      return "Big Goal";

    case "BEST_VALUE":
      return "Best Value";

    default:
      return null;
  }
}

function getBadgeClass(
  badge: StudentReward["badge"]
): string {
  switch (badge) {
    case "POPULAR":
      return "bg-violet-500/15 text-violet-300 border-violet-500/20";

    case "NEW":
      return "bg-cyan-500/15 text-cyan-300 border-cyan-500/20";

    case "STUDENT_FAVOURITE":
      return "bg-amber-500/15 text-amber-300 border-amber-500/20";

    case "LIMITED":
      return "bg-rose-500/15 text-rose-300 border-rose-500/20";

    case "BIG_GOAL":
      return "bg-indigo-500/15 text-indigo-300 border-indigo-500/20";

    case "BEST_VALUE":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";

    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
}

function getCategoryLabel(
  category: RewardCategory
): string {
  switch (category) {
    case "GADGETS":
      return "Gadgets";

    case "STUDY":
      return "Study";

    case "EDUCATION":
      return "Education";

    case "INTERNET":
      return "Internet";

    case "SCHOOL":
      return "School";

    case "VOUCHERS":
      return "Vouchers";

    case "COMPETITION":
      return "Competition";

    default:
      return category;
  }
}

function getStockText(
  reward: StudentReward
): string | null {
  if (reward.stock === undefined) {
    return null;
  }

  if (reward.stock <= 0) {
    return "Out of stock";
  }

  if (reward.stock <= 5) {
    return `${reward.stock} left`;
  }

  return `${reward.stock} available`;
}

export default function StudentRewards({
  balance,
  onRedeem,
  onSave,
  initialCategory = "ALL",
  showFeatured = true,
  limit,
}: StudentRewardsProps) {
  const [activeCategory, setActiveCategory] =
    useState<"ALL" | RewardCategory>(initialCategory);

  const featuredRewards = useMemo(
    () => getFeaturedRewards(),
    []
  );

  const filteredRewards = useMemo(() => {
    const rewards =
      activeCategory === "ALL"
        ? studentRewards
        : studentRewards.filter(
            (reward) =>
              reward.category === activeCategory
          );

    return typeof limit === "number"
      ? rewards.slice(0, limit)
      : rewards;
  }, [activeCategory, limit]);

  return (
    <section
      id="wallet-rewards"
      className="space-y-8"
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Gift className="h-5 w-5 text-violet-400" />
            </div>

            <span className="text-sm font-medium text-violet-400">
              Student Rewards
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Turn your learning into rewards
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Earn CBT Points by learning, practicing and
            competing. Use your points to unlock useful
            rewards or save toward bigger goals.
          </p>
        </div>

        {/* Balance */}
        <div className="flex w-fit items-center gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15">
            <Sparkles className="h-4 w-4 text-violet-300" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">
              Your Balance
            </p>

            <p className="text-sm font-bold text-white">
              {formatRewardPoints(balance)}
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* FEATURED REWARDS */}
      {/* ====================================================== */}

      {showFeatured &&
        featuredRewards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Featured Rewards
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Rewards students are working toward
                  right now.
                </p>
              </div>

              <div className="hidden items-center gap-1 text-xs text-violet-400 sm:flex">
                <Medal className="h-3.5 w-3.5" />
                Student goals
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredRewards
                .slice(0, 3)
                .map((reward) => (
                  <FeaturedRewardCard
                    key={reward.id}
                    reward={reward}
                    balance={balance}
                    onRedeem={onRedeem}
                    onSave={onSave}
                  />
                ))}
            </div>
          </div>
        )}

      {/* ====================================================== */}
      {/* CATEGORY TABS */}
      {/* ====================================================== */}

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {categories.map((category) => {
            const Icon = getCategoryIcon(
              category.id
            );

            const isActive =
              activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveCategory(category.id)
                }
                className={[
                  "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "border-violet-500/30 bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================== */}
      {/* REWARDS GRID */}
      {/* ====================================================== */}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              {activeCategory === "ALL"
                ? "All Rewards"
                : getCategoryLabel(
                    activeCategory
                  )}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Choose something to redeem or save
              toward.
            </p>
          </div>

          <span className="text-xs text-slate-500">
            {filteredRewards.length} rewards
          </span>
        </div>

        {filteredRewards.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                balance={balance}
                onRedeem={onRedeem}
                onSave={onSave}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
              <Gift className="h-6 w-6 text-slate-500" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No rewards found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
              There are currently no rewards in
              this category.
            </p>
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* MOTIVATIONAL FOOTER */}
      {/* ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-slate-900 to-cyan-500/10">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
              <Trophy className="h-5 w-5 text-violet-300" />
            </div>

            <div>
              <h3 className="font-bold text-white">
                Keep learning. Your next reward is
                closer.
              </h3>

              <p className="mt-1 max-w-xl text-sm leading-5 text-slate-400">
                Every practice session, challenge
                and competition can move you closer
                to something you really want.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-violet-500/30 bg-violet-500/5 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200 sm:w-auto"
            onClick={() =>
              document
                .getElementById("wallet-rewards")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Explore Rewards
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* FEATURED REWARD CARD */
/* ============================================================ */

interface RewardCardProps {
  reward: StudentReward;
  balance: number;
  onRedeem?: (reward: StudentReward) => void;
  onSave?: (reward: StudentReward) => void;
}

function FeaturedRewardCard({
  reward,
  balance,
  onRedeem,
  onSave,
}: RewardCardProps) {
  const Icon = getRewardIcon(reward);

  const affordable = canRedeemReward(
    reward,
    balance
  );

  const progress = calculateRewardProgress(
    reward,
    balance
  );

  const remaining = getPointsRemaining(
    reward,
    balance
  );

  const badge = getBadgeLabel(reward.badge);

  return (
    <Card className="group relative overflow-hidden border-violet-500/20 bg-slate-900/70 p-0 transition hover:-translate-y-0.5 hover:border-violet-500/30">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
            <Icon className="h-6 w-6 text-violet-300" />
          </div>

          {badge && (
            <span
              className={[
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                getBadgeClass(reward.badge),
              ].join(" ")}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-violet-400">
            {getCategoryLabel(
              reward.category
            )}
          </p>

          <h3 className="mt-1 text-base font-bold text-white">
            {reward.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
            {reward.description}
          </p>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Required
            </span>

            <span className="font-bold text-white">
              {formatRewardPoints(reward.points)}
            </span>
          </div>

          {!affordable && reward.allowSaving && (
            <>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-500">
                {progress}% complete •{" "}
                {formatRewardPoints(remaining)} more
                needed
              </p>
            </>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          {affordable ? (
            <Button
              type="button"
              className="flex-1 bg-violet-600 text-white hover:bg-violet-500"
              onClick={() =>
                onRedeem?.(reward)
              }
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Redeem
            </Button>
          ) : reward.allowSaving ? (
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
              onClick={() =>
                onSave?.(reward)
              }
            >
              Save for this
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="flex-1 bg-slate-800 text-slate-500"
            >
              <LockKeyhole className="mr-2 h-4 w-4" />
              Not enough points
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ============================================================ */
/* NORMAL REWARD CARD */
/* ============================================================ */

function RewardCard({
  reward,
  balance,
  onRedeem,
  onSave,
}: RewardCardProps) {
  const Icon = getRewardIcon(reward);

  const affordable = canRedeemReward(
    reward,
    balance
  );

  const progress = calculateRewardProgress(
    reward,
    balance
  );

  const remaining = getPointsRemaining(
    reward,
    balance
  );

  const badge = getBadgeLabel(reward.badge);

  const stockText = getStockText(reward);

  const isOutOfStock =
    reward.status === "OUT_OF_STOCK" ||
    reward.stock === 0;

  const isComingSoon =
    reward.status === "COMING_SOON";

  return (
    <Card className="group relative overflow-hidden border-slate-800 bg-slate-900/60 p-0 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
      {/* Reward Icon Area */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.10),transparent_60%)]" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-700 bg-slate-900 shadow-xl transition group-hover:scale-105">
          <Icon className="h-9 w-9 text-violet-300" />
        </div>

        {badge && (
          <span
            className={[
              "absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              getBadgeClass(reward.badge),
            ].join(" ")}
          >
            {badge}
          </span>
        )}

        {stockText && (
          <span className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] text-slate-400">
            {stockText}
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1px]">
            <span className="rounded-full bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-300">
              Out of stock
            </span>
          </div>
        )}

        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1px]">
            <span className="rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300">
              Coming soon
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {(() => {
            const CategoryIcon =
              getCategoryIcon(
                reward.category
              );

            return (
              <CategoryIcon className="h-3.5 w-3.5" />
            );
          })()}

          {getCategoryLabel(
            reward.category
          )}
        </div>

        <h3 className="mt-2 text-base font-bold text-white">
          {reward.title}
        </h3>

        <p className="mt-2 min-h-[40px] text-xs leading-5 text-slate-400">
          {reward.description}
        </p>

        {/* Price */}
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Cost
            </p>

            <p className="mt-0.5 text-lg font-bold text-violet-300">
              {formatRewardPoints(
                reward.points
              )}
            </p>
          </div>

          {affordable && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              You can redeem
            </div>
          )}
        </div>

        {/* Progress */}
        {!affordable &&
          reward.allowSaving &&
          !isOutOfStock &&
          !isComingSoon && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">
                  Your progress
                </span>

                <span className="font-semibold text-slate-300">
                  {progress}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                {formatRewardPoints(
                  remaining
                )}{" "}
                more needed
              </p>
            </div>
          )}

        {/* Delivery */}
        {reward.deliveryAvailable &&
          reward.deliveryTime && (
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500">
              <Clock3 className="h-3 w-3" />
              Estimated delivery:{" "}
              {reward.deliveryTime}
            </div>
          )}

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          {affordable ? (
            <Button
              type="button"
              className="flex-1 bg-violet-600 text-white hover:bg-violet-500"
              disabled={
                isOutOfStock ||
                isComingSoon
              }
              onClick={() =>
                onRedeem?.(reward)
              }
            >
              <Gift className="mr-2 h-4 w-4" />
              Redeem
            </Button>
          ) : reward.allowSaving &&
            !isOutOfStock &&
            !isComingSoon ? (
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() =>
                onSave?.(reward)
              }
            >
              Save for this
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="flex-1 bg-slate-800 text-slate-500"
            >
              {isComingSoon ? (
                <>
                  <Clock3 className="mr-2 h-4 w-4" />
                  Coming Soon
                </>
              ) : isOutOfStock ? (
                <>
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Out of Stock
                </>
              ) : (
                <>
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Not Enough Points
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}