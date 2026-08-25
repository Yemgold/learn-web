


"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Trophy,
  Medal,
  Users,
  BookOpen,
  Settings,
  Bell,
  User,
  Home,
  CreditCard,
  Target,
  Award,
  Star,
  GraduationCap,
} from "lucide-react";

import { cn } from "@/lib/utils";

const icons = {
  trophy: Trophy,
  medal: Medal,
  users: Users,
  book: BookOpen,
  settings: Settings,
  bell: Bell,
  user: User,
  home: Home,
  payment: CreditCard,
  target: Target,
  award: Award,
  star: Star,
  graduation: GraduationCap,
};

export interface StatCardProps {
  title: string;
  value: string | number;

  icon: keyof typeof icons;

  description?: string;

  change?: number;

  changeLabel?: string;

  className?: string;

  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  change,
  changeLabel,
  className,
  loading = false,
}: StatCardProps) {
  const Icon = icons[icon] ?? Trophy;

  const positive = (change ?? 0) >= 0;

  if (loading) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-2xl border border-slate-200 bg-white p-6",
          className
        )}
      >
        <div className="mb-6 h-10 w-10 rounded-xl bg-slate-200" />

        <div className="mb-3 h-4 w-24 rounded bg-slate-200" />

        <div className="mb-4 h-8 w-32 rounded bg-slate-200" />

        <div className="h-3 w-40 rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>

        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}

            {Math.abs(change)}%
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </h3>

      {(description || changeLabel) && (
        <p className="mt-3 text-sm text-slate-500">
          {description}

          {changeLabel && (
            <span className="ml-1 font-medium">
              {changeLabel}
            </span>
          )}
        </p>
      )}
    </div>
  );
}