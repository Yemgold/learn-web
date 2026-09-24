






"use client";

import {
  Award,
  Coins,
  Crown,
  Medal,
  Trophy,
} from "lucide-react";

interface FinalRewardsProps {
  firstPositionReward?: number | null;
  secondPositionReward?: number | null;
  currencyLabel?: string;
  showEmptyState?: boolean;
}

function formatReward(
  value: number | null | undefined,
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-NG",
  ).format(value);
}

export default function FinalRewards({
  firstPositionReward = 0,
  secondPositionReward = 0,
  currencyLabel = "CBT Points",
  showEmptyState = true,
}: FinalRewardsProps) {
  const firstReward =
    typeof firstPositionReward === "number" &&
    Number.isFinite(firstPositionReward)
      ? firstPositionReward
      : 0;

  const secondReward =
    typeof secondPositionReward === "number" &&
    Number.isFinite(secondPositionReward)
      ? secondPositionReward
      : 0;

  const hasRewards =
    firstReward > 0 ||
    secondReward > 0;

  if (!hasRewards && !showEmptyState) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
          <Trophy className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
            Final Rewards
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            Championship Rewards
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Rewards available to the top finishers of
            the final round.
          </p>
        </div>
      </div>

      {!hasRewards ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/[0.06] p-5 text-center">
          <Award className="mx-auto h-6 w-6 text-slate-600" />

          <p className="mt-2 text-sm font-medium text-slate-400">
            Final rewards have not been configured.
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Reward information will appear here when
            available.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <RewardCard
            position="1st Place"
            reward={firstReward}
            currencyLabel={currencyLabel}
            icon={
              <Crown className="h-5 w-5" />
            }
            tone="gold"
          />

          <RewardCard
            position="2nd Place"
            reward={secondReward}
            currencyLabel={currencyLabel}
            icon={
              <Medal className="h-5 w-5" />
            }
            tone="silver"
          />
        </div>
      )}

      {/* Total */}
      {hasRewards && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-cyan-400" />

            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Final Rewards
            </span>
          </div>

          <span className="text-sm font-bold text-white">
            {formatReward(
              firstReward +
                secondReward,
            )}{" "}
            <span className="font-medium text-slate-500">
              {currencyLabel}
            </span>
          </span>
        </div>
      )}
    </section>
  );
}

interface RewardCardProps {
  position: string;
  reward: number;
  currencyLabel: string;
  icon: React.ReactNode;
  tone: "gold" | "silver";
}

function RewardCard({
  position,
  reward,
  currencyLabel,
  icon,
  tone,
}: RewardCardProps) {
  const styles =
    tone === "gold"
      ? {
          container:
            "border-amber-400/20 bg-amber-400/[0.06]",
          icon:
            "bg-amber-400/10 text-amber-400 ring-amber-400/20",
          position:
            "text-amber-300",
          amount:
            "text-amber-200",
        }
      : {
          container:
            "border-slate-400/15 bg-slate-400/[0.04]",
          icon:
            "bg-slate-400/10 text-slate-300 ring-slate-400/20",
          position:
            "text-slate-300",
          amount:
            "text-slate-100",
        };

  return (
    <div
      className={`rounded-xl border p-4 ${styles.container}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${styles.icon}`}
        >
          {icon}
        </div>

        <span
          className={`text-xs font-bold uppercase tracking-[0.15em] ${styles.position}`}
        >
          {position}
        </span>
      </div>

      <div className="mt-4">
        <p
          className={`text-2xl font-bold ${styles.amount}`}
        >
          {formatReward(reward)}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {currencyLabel}
        </p>
      </div>
    </div>
  );
}