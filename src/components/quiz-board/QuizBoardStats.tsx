



// src/components/quiz-board/QuizBoardStats.tsx

"use client";

import {
  Activity,
  CheckCircle2,
  Clock3,
  Flame,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import type {
  QuizBoard,
  QuizBoardStats as QuizBoardStatsType,
} from "@/lib/quiz-board/types";

interface QuizBoardStatsProps {
  stats: QuizBoardStatsType;

  boards?: QuizBoard[];

  isLoading?: boolean;

  compact?: boolean;
}

interface StatItem {
  key: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  iconWrapper: string;
  valueClass: string;
}

export default function QuizBoardStats({
  stats,
  boards = [],
  isLoading = false,
  compact = false,
}: QuizBoardStatsProps) {
  const totalPlayers = boards.reduce(
    (total, board) =>
      total + Math.max(board.players, 0),
    0,
  );

  const availableSpots = boards.reduce(
    (total, board) => {
      if (board.maxPlayers <= 0) {
        return total;
      }

      return (
        total +
        Math.max(
          board.maxPlayers -
            board.players,
          0,
        )
      );
    },
    0,
  );

  const statItems: StatItem[] = [
    {
      key: "total",
      label: "Total",
      value: stats.total,
      icon: (
        <Trophy className="h-4 w-4" />
      ),
      iconWrapper:
        "bg-violet-500/10 text-violet-400",
      valueClass: "text-white",
    },
    {
      key: "open",
      label: "Open",
      value: stats.open,
      icon: (
        <Zap className="h-4 w-4" />
      ),
      iconWrapper:
        "bg-emerald-500/10 text-emerald-400",
      valueClass: "text-emerald-300",
    },
    {
      key: "upcoming",
      label: "Upcoming",
      value: stats.upcoming,
      icon: (
        <Clock3 className="h-4 w-4" />
      ),
      iconWrapper:
        "bg-amber-500/10 text-amber-400",
      valueClass: "text-amber-300",
    },
    {
      key: "live",
      label: "Live",
      value: stats.live,
      icon: (
        <Flame className="h-4 w-4" />
      ),
      iconWrapper:
        "bg-red-500/10 text-red-400",
      valueClass: "text-red-300",
    },
    {
      key: "completed",
      label: "Completed",
      value: stats.completed,
      icon: (
        <CheckCircle2 className="h-4 w-4" />
      ),
      iconWrapper:
        "bg-slate-500/10 text-slate-400",
      valueClass: "text-slate-300",
    },
  ];

  if (compact) {
    return (
      <section
        aria-label="Quiz Board statistics"
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
      >
        {statItems.map((item) => (
          <CompactStat
            key={item.key}
            item={item}
            isLoading={isLoading}
          />
        ))}
      </section>
    );
  }

  return (
    <section
      aria-label="Quiz Board statistics"
      className="space-y-3"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Main competition statistics                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statItems.map((item) => (
          <StatCard
            key={item.key}
            item={item}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Additional live information                                        */}
      {/* ------------------------------------------------------------------ */}

      {boards.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <AdditionalStat
            icon={
              <Users className="h-4 w-4 text-blue-400" />
            }
            label="Players"
            value={totalPlayers}
            description="Currently listed"
            isLoading={isLoading}
          />

          <AdditionalStat
            icon={
              <Activity className="h-4 w-4 text-violet-400" />
            }
            label="Available Spots"
            value={availableSpots}
            description="Across competitions"
            isLoading={isLoading}
          />

          <AdditionalStat
            icon={
              <Flame className="h-4 w-4 text-red-400" />
            }
            label="Live Competitions"
            value={stats.live}
            description="Currently active"
            isLoading={isLoading}
          />
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Stat Card                                                             */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  item: StatItem;
  isLoading: boolean;
}

function StatCard({
  item,
  isLoading,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition duration-300 hover:border-white/15 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconWrapper}`}
        >
          {item.icon}
        </div>

        <span className="hidden text-[9px] font-medium uppercase tracking-wider text-slate-600 sm:block">
          Quiz Board
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {item.label}
        </p>

        {isLoading ? (
          <div className="mt-1 h-8 w-12 animate-pulse rounded-lg bg-white/5" />
        ) : (
          <p
            className={`mt-0.5 text-2xl font-black ${item.valueClass}`}
          >
            {item.value}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Compact Stat                                                               */
/* -------------------------------------------------------------------------- */

interface CompactStatProps {
  item: StatItem;
  isLoading: boolean;
}

function CompactStat({
  item,
  isLoading,
}: CompactStatProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconWrapper}`}
      >
        {item.icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[9px] font-medium uppercase tracking-wider text-slate-500">
          {item.label}
        </p>

        {isLoading ? (
          <div className="mt-1 h-5 w-8 animate-pulse rounded bg-white/5" />
        ) : (
          <p
            className={`text-base font-bold ${item.valueClass}`}
          >
            {item.value}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Additional Stat                                                             */
/* -------------------------------------------------------------------------- */

interface AdditionalStatProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  isLoading: boolean;
}

function AdditionalStat({
  icon,
  label,
  value,
  description,
  isLoading,
}: AdditionalStatProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>

        {isLoading ? (
          <div className="mt-1 h-5 w-8 animate-pulse rounded bg-white/5" />
        ) : (
          <p className="text-sm font-bold text-slate-200">
            {value}
          </p>
        )}

        <p className="mt-0.5 truncate text-[9px] text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}