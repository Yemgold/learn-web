


"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Plus,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

interface CbtWalletBalanceProps {
  balance: number;
  totalEarned?: number;
  totalSpent?: number;
  onEarnPoints?: () => void;
  onSendPoints?: () => void;
  className?: string;
}

function formatPoints(points: number) {
  return points.toLocaleString("en-NG");
}

export default function CbtWalletBalance({
  balance,
  totalEarned = 0,
  totalSpent = 0,
  onEarnPoints,
  onSendPoints,
  className = "",
}: CbtWalletBalanceProps) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/70 via-slate-950 to-slate-950 p-5 shadow-xl shadow-violet-950/10 sm:p-6 ${className}`}
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <WalletCards className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Available Balance
              </p>

              <p className="mt-0.5 text-[11px] text-slate-600">
                CBT Points
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBalance((current) => !current)}
            aria-label={showBalance ? "Hide balance" : "Show balance"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-500 transition-colors hover:border-slate-700 hover:text-white"
          >
            {showBalance ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Balance */}
        <div className="mt-5">
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {showBalance ? formatPoints(balance) : "••••••"}
            </p>

            {showBalance && (
              <span className="mb-1.5 text-sm font-bold text-violet-400">
                pts
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Use your points for student rewards, competition entries, and
            learning benefits.
          </p>
        </div>

        {/* Mini stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <ArrowDownLeft className="h-3.5 w-3.5" />
              </div>

              <span className="text-[10px] font-medium text-slate-600">
                Total Earned
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-emerald-300">
              +{formatPoints(totalEarned)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>

              <span className="text-[10px] font-medium text-slate-600">
                Total Spent
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-violet-300">
              -{formatPoints(totalSpent)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onEarnPoints}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!onEarnPoints}
          >
            <Plus className="h-4 w-4" />
            Earn More Points
          </button>

          <button
            type="button"
            onClick={onSendPoints}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!onSendPoints}
          >
            <ArrowUpRight className="h-4 w-4" />
            Send Points
          </button>
        </div>
      </div>
    </section>
  );
}