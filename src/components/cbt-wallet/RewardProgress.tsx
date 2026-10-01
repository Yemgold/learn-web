"use client";

import {
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import type {
  RewardProgress as RewardProgressData,
  StudentReward,
} from "@/types/cbt-wallet/reward";

interface RewardProgressProps {
  reward: StudentReward;
  currentPoints: number;
  compact?: boolean;
  showRemaining?: boolean;
  showPercentage?: boolean;
  className?: string;
}

function getProgressData(
  reward: StudentReward,
  currentPoints: number,
): RewardProgressData {
  const safeCurrentPoints = Math.max(0, currentPoints);
  const targetPoints = Math.max(0, reward.points);

  const percentage =
    targetPoints > 0
      ? Math.min(
          100,
          Math.round((safeCurrentPoints / targetPoints) * 100),
        )
      : 0;

  const remainingPoints = Math.max(
    0,
    targetPoints - safeCurrentPoints,
  );

  return {
    rewardId: reward.id,
    currentPoints: safeCurrentPoints,
    targetPoints,
    percentage,
    remainingPoints,
    isComplete: safeCurrentPoints >= targetPoints,
  };
}

function formatPoints(points: number) {
  return points.toLocaleString("en-NG");
}

export default function RewardProgress({
  reward,
  currentPoints,
  compact = false,
  showRemaining = true,
  showPercentage = true,
  className = "",
}: RewardProgressProps) {
  const progress = getProgressData(reward, currentPoints);

  const isComplete = progress.isComplete;

  const percentage = Math.min(
    100,
    Math.max(0, progress.percentage),
  );

  if (compact) {
    return (
      <div className={`w-full ${className}`}>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-slate-400">
            {isComplete ? "Reward unlocked" : "Your progress"}
          </span>

          {showPercentage && (
            <span
              className={`text-[11px] font-semibold ${
                isComplete
                  ? "text-emerald-400"
                  : "text-violet-300"
              }`}
            >
              {percentage}%
            </span>
          )}
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-violet-500 to-cyan-400"
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        {showRemaining && !isComplete && (
          <p className="mt-1.5 text-[11px] text-slate-500">
            {formatPoints(progress.remainingPoints)} points to go
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-950/70 p-4 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isComplete
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-violet-500/10 text-violet-400"
            }`}
          >
            {isComplete ? (
              <Trophy className="h-5 w-5" />
            ) : (
              <Target className="h-5 w-5" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {isComplete
                ? "Reward unlocked!"
                : "Your reward progress"}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {reward.title}
            </p>
          </div>
        </div>

        {showPercentage && (
          <div
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              isComplete
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-violet-500/10 text-violet-300"
            }`}
          >
            {percentage}%
          </div>
        )}
      </div>

      {/* Point labels */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          {formatPoints(progress.currentPoints)} pts
        </span>

        <span className="text-slate-500">
          {formatPoints(progress.targetPoints)} pts
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`relative h-full rounded-full transition-all duration-700 ${
            isComplete
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-400"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        >
          {!isComplete && percentage > 5 && (
            <div className="absolute inset-y-0 right-0 w-8 bg-white/20 blur-sm" />
          )}
        </div>
      </div>

      {/* Bottom information */}
      {showRemaining && (
        <div className="mt-3 flex items-center justify-between gap-3">
          {isComplete ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <Zap className="h-3.5 w-3.5" />

              <span>
                You have enough points for this reward
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-white">
                {formatPoints(progress.remainingPoints)}
              </span>{" "}
              points remaining
            </p>
          )}

          <p className="shrink-0 text-xs text-slate-500">
            {formatPoints(progress.targetPoints)} target
          </p>
        </div>
      )}
    </div>
  );
}