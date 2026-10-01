




"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gift,
  Sparkles,
  WalletCards,
} from "lucide-react";

interface CbtWalletHeaderProps {
  balance?: number;
  onRedeemRewards?: () => void;
  className?: string;
}

function formatPoints(points: number) {
  return points.toLocaleString("en-NG");
}

export default function CbtWalletHeader({
  balance,
  onRedeemRewards,
  className = "",
}: CbtWalletHeaderProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/30 ${className}`}
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5">
              <WalletCards className="h-3.5 w-3.5 text-violet-400" />

              <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                Student Wallet
              </span>

              <Sparkles className="h-3 w-3 text-cyan-400" />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              CBT Wallet
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-[15px]">
              Manage your CBT Points, send points to friends, and turn your
              learning progress into rewards.
            </p>

            {typeof balance === "number" && (
              <div className="mt-5 flex items-center gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Available Points
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    {formatPoints(balance)}
                    <span className="ml-1 text-xs font-semibold text-violet-400">
                      pts
                    </span>
                  </p>
                </div>

                <div className="hidden h-10 w-px bg-slate-800 sm:block" />

                <p className="hidden max-w-xs text-xs leading-5 text-slate-500 sm:block">
                  Keep learning, keep earning, and save your points for
                  something you really want.
                </p>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            {onRedeemRewards ? (
              <button
                type="button"
                onClick={onRedeemRewards}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition-all hover:bg-violet-500 hover:shadow-violet-900/40"
              >
                <Gift className="h-4 w-4" />
                Redeem Rewards
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <Link
                href="/student/rewards"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition-all hover:bg-violet-500 hover:shadow-violet-900/40"
              >
                <Gift className="h-4 w-4" />
                Redeem Rewards
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <Link
              href="/student/practice/cbtsubjects?exam=jamb"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              Earn More Points
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}