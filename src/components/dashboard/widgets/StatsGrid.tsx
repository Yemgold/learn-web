



"use client";

import { cn } from "@/lib/utils";

import StatCard, { type StatCardProps } from "./StatCard";

export interface StatsGridProps {
  stats: StatCardProps[];
  className?: string;
  loading?: boolean;
}

export default function StatsGrid({
  stats,
  className,
  loading = false,
}: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        "grid-cols-1",
        "sm:grid-cols-2",
        "xl:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={`${stat.title}-${index}`}
          {...stat}
          loading={loading || stat.loading}
        />
      ))}
    </div>
  );
}