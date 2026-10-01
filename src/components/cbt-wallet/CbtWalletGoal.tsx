






"use client";

import {
  ArrowRight,
  CheckCircle2,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface CbtWalletGoalProps {
  currentPoints: number;
  targetPoints: number;
  title?: string;
  description?: string;
  rewardTitle?: string;
  rewardDescription?: string;
  href?: string;
  className?: string;
}

function formatPoints(points: number) {
  return points.toLocaleString("en-NG");
}

export default function CbtWalletGoal({
  currentPoints,
  targetPoints,
  title = "Your Points Goal",
  description = "Keep learning to reach your next reward.",
  rewardTitle = "Next milestone",
  rewardDescription = "Save your CBT Points and unlock something special.",
  href = "/student/rewards",
  className = "",
}: CbtWalletGoalProps) {
  const safeTarget = Math.max(0, targetPoints);
  const safeCurrent = Math.max(0, currentPoints);

  const percentage =
    safeTarget > 0
      ? Math.min(100, Math.round((safeCurrent / safeTarget) * 100))
      : 0;

  const remainingPoints = Math.max(0, safeTarget - safeCurrent);
  const goalReached = safeTarget > 0 && safeCurrent >= safeTarget;

  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 ${className}`}
    >
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                goalReached
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-violet-500/10 text-violet-400"
              }`}
            >
              {goalReached ? (
                <Trophy className="h-5 w-5" />
              ) : (
                <Target className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">{title}</h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>
            </div>
          </div>

          <div
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              goalReached
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-violet-500/10 text-violet-300"
            }`}
          >
            {percentage}%
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-white">
              {formatPoints(safeCurrent)} pts
            </span>

            <span className="text-slate-500">
              {formatPoints(safeTarget)} pts
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`relative h-full rounded-full transition-all duration-700 ${
                goalReached
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-400"
              }`}
              style={{ width: `${percentage}%` }}
            >
              {!goalReached && percentage > 5 && (
                <div className="absolute inset-y-0 right-0 w-8 bg-white/20 blur-sm" />
              )}
            </div>
          </div>
        </div>

        {/* Goal status */}
        {goalReached ? (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

            <div>
              <p className="text-xs font-semibold text-emerald-300">
                Goal reached!
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                You have enough points to reach this milestone. Check out the
                available student rewards.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-cyan-400" />

              <p className="truncate text-xs text-slate-400">
                <span className="font-bold text-white">
                  {formatPoints(remainingPoints)}
                </span>{" "}
                points to go
              </p>
            </div>

            <span className="shrink-0 text-[10px] text-slate-600">
              Keep going!
            </span>
          </div>
        )}

        {/* Reward milestone */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                {rewardTitle}
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-white">
                {rewardDescription}
              </p>
            </div>
          </div>

          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1 text-[11px] font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            View rewards
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}