




"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  Backpack,
  BookOpen,
  Gift,
  GraduationCap,
  Headphones,
  Laptop,
  Lightbulb,
  Package,
  School,
  ShoppingBag,
  Smartphone,
  Speaker,
  Table2,
  Trophy,
  Watch,
  Wifi,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  canRedeemReward,
  canSaveForReward,
} from "@/data/cbt-wallet/student-rewards";

import type {
  RewardBadge,
  StudentReward,
} from "@/types/cbt-wallet/reward";

import RewardProgress from "./RewardProgress";

interface RewardCardProps {
  reward: StudentReward;
  currentPoints: number;
  onRedeem?: (reward: StudentReward) => void;
  onSave?: (reward: StudentReward) => void;
  featured?: boolean;
  compact?: boolean;
  showProgress?: boolean;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Speaker,
  Table: Table2,
  Table2,
  Backpack,
  BookOpen,
  GraduationCap,
  Lightbulb,
  School,
  Wifi,
  Trophy,
  ShoppingBag,
  Package,
};

const badgeConfig: Record<
  RewardBadge,
  {
    label: string;
    className: string;
  }
> = {
  POPULAR: {
    label: "Popular",
    className:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  },
  NEW: {
    label: "New",
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-300",
  },
  STUDENT_FAVOURITE: {
    label: "Student Favourite",
    className:
      "border-pink-500/20 bg-pink-500/10 text-pink-300",
  },
  LIMITED: {
    label: "Limited",
    className:
      "border-orange-500/20 bg-orange-500/10 text-orange-300",
  },
  BIG_GOAL: {
    label: "Big Goal",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },
  BEST_VALUE: {
    label: "Best Value",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
};

function formatPoints(points: number) {
  return points.toLocaleString("en-NG");
}

function getRewardIcon(reward: StudentReward): LucideIcon {
  if (reward.icon && iconMap[reward.icon]) {
    return iconMap[reward.icon];
  }

  switch (reward.category) {
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
      return Gift;
    case "COMPETITION":
      return Trophy;
    default:
      return Gift;
  }
}

function getProgress(
  reward: StudentReward,
  currentPoints: number,
) {
  const safeCurrentPoints = Math.max(0, currentPoints);
  const targetPoints = Math.max(0, reward.points);

  const percentage =
    targetPoints > 0
      ? Math.min(
          100,
          Math.round(
            (safeCurrentPoints / targetPoints) * 100,
          ),
        )
      : 0;

  const remainingPoints = Math.max(
    0,
    targetPoints - safeCurrentPoints,
  );

  return {
    percentage,
    remainingPoints,
    isComplete:
      targetPoints > 0 &&
      safeCurrentPoints >= targetPoints,
  };
}

function getStockLabel(reward: StudentReward) {
  if (reward.stockLabel) {
    return reward.stockLabel;
  }

  if (typeof reward.stock === "number") {
    if (reward.stock <= 0) {
      return "Out of stock";
    }

    if (reward.stock <= 5) {
      return `Only ${reward.stock} left`;
    }

    return `${reward.stock} available`;
  }

  return null;
}

export default function RewardCard({
  reward,
  currentPoints,
  onRedeem,
  onSave,
  featured = false,
  compact = false,
  showProgress = true,
  className = "",
}: RewardCardProps) {
  const Icon = getRewardIcon(reward);

  const [imageFailed, setImageFailed] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] =
    useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const imageSrc = reward.image?.trim();
  const showImage = Boolean(imageSrc) && !imageFailed;

  const progress = getProgress(reward, currentPoints);

  const canRedeem = canRedeemReward(
    reward,
    currentPoints,
  );

  const canSave = canSaveForReward(reward);
  const stockLabel = getStockLabel(reward);

  const isOutOfStock =
    reward.status === "OUT_OF_STOCK" ||
    (typeof reward.stock === "number" &&
      reward.stock <= 0);

  const isComingSoon =
    reward.status === "COMING_SOON";

  const isDisabled =
    reward.status === "DISABLED";

  const isUnavailable =
    isOutOfStock || isComingSoon || isDisabled;

  const badge = reward.badge
    ? badgeConfig[reward.badge]
    : undefined;

  const cardPadding = compact ? "p-3" : "p-4";

  // Wait until the component mounts in the browser.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close the preview using Escape.
  useEffect(() => {
    if (!isImagePreviewOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsImagePreviewOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isImagePreviewOpen]);

  // Prevent background scrolling while the preview is open.
  useEffect(() => {
    if (!isImagePreviewOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isImagePreviewOpen]);

  const imagePreview =
    isMounted && isImagePreviewOpen && showImage && imageSrc
      ? createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setIsImagePreviewOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Image preview of ${reward.title}`}
          >
            <button
              type="button"
              onClick={() => setIsImagePreviewOpen(false)}
              className="absolute right-4 top-4 z-[100000] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-white transition hover:bg-slate-700"
              aria-label="Close image preview"
              title="Close preview"
            >
              <X className="h-7 w-7" />
            </button>

            <div
              className="flex max-h-[90vh] w-full max-w-6xl flex-col items-center justify-center gap-4"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={imageSrc}
                alt={reward.title}
                className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl sm:max-h-[80vh]"
              />

              <div className="max-w-xl text-center">
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  {reward.title}
                </h2>

                <p className="mt-1 text-sm text-violet-300">
                  {formatPoints(reward.points)} CBT Points
                </p>

                {reward.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {reward.description}
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-400">
                  Click outside the image or press Escape to close.
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <article
        className={`group relative overflow-hidden rounded-2xl border bg-slate-900/70 transition-all duration-200 ${
          featured
            ? "border-violet-500/20 hover:border-violet-500/40"
            : "border-slate-800 hover:border-slate-700"
        } ${className}`}
      >
        {/* Featured glow */}
        {featured && (
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-600/10 blur-3xl" />
        )}

        <div className={`relative ${cardPadding}`}>
          {/* Reward image */}
          <div
            className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 ${
              compact ? "h-28" : "h-36"
            }`}
          >
            {showImage && imageSrc ? (
              <button
                type="button"
                onClick={() => setIsImagePreviewOpen(true)}
                className="absolute inset-0 z-0 h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400"
                aria-label={`View larger image of ${reward.title}`}
                title="Click to enlarge image"
              >
                <img
                  key={imageSrc}
                  src={imageSrc}
                  alt={reward.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageFailed(true)}
                />

                <span className="absolute bottom-2 right-2 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white">
                  Click to enlarge
                </span>
              </button>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-violet-400 shadow-xl">
                <Icon className="h-8 w-8" />
              </div>
            )}

            {/* Badge */}
            {badge && (
              <div
                className={`pointer-events-none absolute left-3 top-3 z-10 rounded-full border px-2.5 py-1 text-[9px] font-bold ${badge.className}`}
              >
                {badge.label}
              </div>
            )}

            {/* Unavailable status */}
            {isUnavailable && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-slate-950/70 backdrop-blur-[1px]">
                <span className="rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-[10px] font-bold text-slate-400">
                  {isOutOfStock
                    ? "Out of stock"
                    : isComingSoon
                      ? "Coming soon"
                      : "Unavailable"}
                </span>
              </div>
            )}
          </div>

          {/* Reward details */}
          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-sm font-bold text-white">
                  {reward.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {reward.description}
                </p>
              </div>
            </div>

            {/* Reward points */}
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Reward cost
                </p>

                <p className="mt-0.5 text-lg font-black text-violet-300">
                  {formatPoints(reward.points)}
                  <span className="ml-1 text-[10px] font-semibold text-violet-500">
                    pts
                  </span>
                </p>
              </div>

              {stockLabel && (
                <span className="text-right text-[10px] text-slate-600">
                  {stockLabel}
                </span>
              )}
            </div>

            {/* Savings progress */}
            {showProgress && reward.allowSaving && (
              <div className="mt-4">
                <RewardProgress
                  reward={reward}
                  currentPoints={currentPoints}
                  compact
                  showRemaining
                  showPercentage
                />
              </div>
            )}

            {/* Delivery information */}
            {reward.deliveryAvailable &&
              reward.deliveryTime && (
                <p className="mt-3 text-[10px] text-slate-600">
                  Delivery: {reward.deliveryTime}
                </p>
              )}

            {!reward.deliveryAvailable && (
              <p className="mt-3 text-[10px] text-slate-600">
                Digital / account delivery
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              {canRedeem && onRedeem ? (
                <button
                  type="button"
                  onClick={() => onRedeem(reward)}
                  className="flex-1 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-500"
                >
                  Redeem
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-1 cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-600"
                >
                  {isUnavailable
                    ? "Unavailable"
                    : progress.isComplete
                      ? "Redeem unavailable"
                      : `${formatPoints(
                          progress.remainingPoints,
                        )} pts needed`}
                </button>
              )}

              {reward.allowSaving && canSave && onSave && (
                <button
                  type="button"
                  onClick={() => onSave(reward)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                  title="Save for this reward"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Render the modal outside the card to avoid clipping */}
      {imagePreview}
    </>
  );
}