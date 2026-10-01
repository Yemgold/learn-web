




"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import type { CbtWalletBalance } from "@/types/cbt-wallet/transaction";

interface CbtWalletSummaryProps {
  balance: CbtWalletBalance;
  className?: string;
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  valueClassName?: string;
}

function formatPoints(value: number) {
  return value.toLocaleString("en-NG");
}

export default function CbtWalletSummary({
  balance,
  className = "",
}: CbtWalletSummaryProps) {
  return (
    <section className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      <SummaryCard
        title="Total Earned"
        value={balance.totalEarned}
        description="Points earned from learning"
        icon={TrendingUp}
        iconClassName="bg-emerald-500/10 text-emerald-400"
        valueClassName="text-emerald-300"
      />

      <SummaryCard
        title="Total Spent"
        value={balance.totalSpent}
        description="Points used for rewards"
        icon={Gift}
        iconClassName="bg-violet-500/10 text-violet-400"
        valueClassName="text-violet-300"
      />

      <SummaryCard
        title="Points Received"
        value={balance.totalReceived}
        description="Points received from others"
        icon={ArrowDownLeft}
        iconClassName="bg-cyan-500/10 text-cyan-400"
        valueClassName="text-cyan-300"
      />

      <SummaryCard
        title="Points Sent"
        value={balance.totalSent}
        description="Points sent to others"
        icon={ArrowUpRight}
        iconClassName="bg-orange-500/10 text-orange-400"
        valueClassName="text-orange-300"
      />
    </section>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  valueClassName = "text-white",
}: SummaryCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <WalletCards className="h-4 w-4 text-slate-800 transition-colors group-hover:text-slate-700" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500">
          {title}
        </p>

        <p
          className={`mt-1 text-2xl font-black tracking-tight ${valueClassName}`}
        >
          {formatPoints(value)}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}