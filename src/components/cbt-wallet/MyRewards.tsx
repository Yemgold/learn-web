


"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  RedeemedReward,
  RedeemedRewardStatus,
} from "@/types/cbt-wallet/reward";

interface MyRewardsProps {
  rewards: RedeemedReward[];
  limit?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  title?: string;
  description?: string;
  onRewardClick?: (reward: RedeemedReward) => void;
}

const statusConfig: Record<
  RedeemedRewardStatus,
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  ACTIVE: {
    label: "Active",
    className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Processing",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    icon: Clock3,
  },
  DELIVERED: {
    label: "Delivered",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    icon: Truck,
  },
  USED: {
    label: "Used",
    className: "border-slate-700 bg-slate-800/80 text-slate-400",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    icon: XCircle,
  },
};

function formatPoints(points: number) {
  return points.toLocaleString("en-NG");
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyRewards({
  rewards,
  limit = 4,
  showViewAll = true,
  viewAllHref = "/student/rewards",
  title = "My Rewards",
  description = "Track rewards you have redeemed with your CBT Points.",
  onRewardClick,
}: MyRewardsProps) {
  const visibleRewards = rewards.slice(0, limit);

  return (
    <section className="w-full">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <ShoppingBag className="h-[18px] w-[18px]" />
            </div>

            <h2 className="text-lg font-bold text-white">{title}</h2>
          </div>

          <p className="text-sm text-slate-500">{description}</p>
        </div>

        {showViewAll && rewards.length > limit && (
          <a
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 transition hover:text-violet-300"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>

      {visibleRewards.length === 0 ? (
        <EmptyRewardsState />
      ) : (
        <div className="grid gap-3">
          {visibleRewards.map((reward) => (
            <MyRewardItem
              key={reward.id}
              reward={reward}
              onClick={onRewardClick}
            />
          ))}
        </div>
      )}

      {showViewAll &&
        rewards.length > 0 &&
        rewards.length <= limit && (
          <div className="mt-4">
            <a
              href={viewAllHref}
              className="group flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
            >
              View all my rewards
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        )}
    </section>
  );
}

interface MyRewardItemProps {
  reward: RedeemedReward;
  onClick?: (reward: RedeemedReward) => void;
}

function MyRewardItem({ reward, onClick }: MyRewardItemProps) {
  const status = statusConfig[reward.status] ?? statusConfig.ACTIVE;
  const StatusIcon = status.icon;
  const isClickable = Boolean(onClick);

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={() => onClick?.(reward)}
      onKeyDown={(event) => {
        if (!onClick) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(reward);
        }
      }}
      className={[
        "group rounded-2xl border border-slate-800 bg-slate-900/60 p-4",
        "transition-all duration-200",
        isClickable
          ? "cursor-pointer hover:border-violet-500/30 hover:bg-slate-900"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <RewardThumbnail
          image={reward.image}
          title={reward.title}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">
                {reward.title}
              </h3>

              {reward.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {reward.description}
                </p>
              )}
            </div>

            <StatusBadge
              icon={StatusIcon}
              className={status.className}
              label={status.label}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="text-slate-600">Redeemed:</span>
              <span className="text-slate-400">
                {formatDate(reward.redeemedAt)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="text-slate-600">Cost:</span>
              <span className="font-semibold text-violet-300">
                {formatPoints(reward.points)} pts
              </span>
            </div>

            {reward.redemptionReference && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="text-slate-600">Ref:</span>
                <span className="font-mono text-slate-400">
                  {reward.redemptionReference}
                </span>
              </div>
            )}
          </div>

          {reward.status === "DELIVERED" && reward.deliveredAt && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Delivered {formatDate(reward.deliveredAt)}
            </div>
          )}

          {reward.status === "PROCESSING" && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400">
              <RefreshCw className="h-3.5 w-3.5" />
              Your reward is being processed
            </div>
          )}

          {reward.deliveryAddress && (
            <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
              <span className="line-clamp-1">{reward.deliveryAddress}</span>
            </div>
          )}

          {reward.trackingNumber && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-cyan-400">
              <Truck className="h-3.5 w-3.5" />
              Tracking: {reward.trackingNumber}
            </div>
          )}
        </div>

        {isClickable && (
          <div className="hidden shrink-0 items-center text-slate-600 transition group-hover:text-violet-400 sm:flex">
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}

function RewardThumbnail({
  image,
  title,
}: {
  image?: string | null;
  title: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(image?.trim()) && !imageFailed;

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-800">
      {hasImage ? (
        <img
          src={image!}
          alt={title}
          loading="eager"
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-violet-500/10 text-violet-400">
          <Package className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  icon: Icon,
  className,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  label: string;
}) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function EmptyRewardsState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-5 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-slate-600">
        <ShoppingBag className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">
        No redeemed rewards yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
        Keep learning and earning CBT Points. You can use your points to
        redeem gadgets, study materials, education rewards, and more.
      </p>

      <a href="/student/rewards">
        <Button
          type="button"
          className="mt-5 rounded-xl bg-violet-600 px-5 hover:bg-violet-500"
        >
          Browse Rewards
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </a>
    </div>
  );
}
