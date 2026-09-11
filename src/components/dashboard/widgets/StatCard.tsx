

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

  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {
    return (
      <div
        className={cn(
          `
            mx-1
            animate-pulse
            rounded-2xl
            border
            border-white/10
            bg-white/[0.035]
            p-3
            shadow-lg
            shadow-black/10
            backdrop-blur-sm
            sm:p-4
          `,
          className,
        )}
      >
        <div className="mb-3 h-8 w-8 rounded-lg bg-white/10" />

        <div className="mb-1.5 h-3 w-16 rounded bg-white/10" />

        <div className="mb-1.5 h-6 w-16 rounded bg-white/10" />

        <div className="h-2.5 w-24 rounded bg-white/10" />
      </div>
    );
  }

  /* ============================================================
     CARD
     ============================================================ */

  return (
    <div
      className={cn(
        `
          mx-1
          group
          rounded-2xl
          border
          border-white/10
          bg-white/[0.035]
          p-3
          shadow-lg
          shadow-black/10
          backdrop-blur-sm
          transition-all
          duration-200
          hover:border-white/20
          hover:bg-white/[0.05]
          hover:shadow-xl
          hover:shadow-black/20
          sm:p-4
        `,
        className,
      )}
    >
      {/* ========================================================
          TOP ROW
         ======================================================== */}

      <div className="flex items-center justify-between gap-2">
        {/* ICON */}

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-blue-400/20
            bg-blue-500/10
          "
        >
          <Icon className="h-4 w-4 text-blue-300" />
        </div>

        {/* CHANGE */}

        {change !== undefined && (
          <div
            className={cn(
              `
                flex
                items-center
                gap-0.5
                rounded-full
                border
                px-1.5
                py-0.5
                text-[9px]
                font-semibold
                sm:px-2
                sm:py-1
                sm:text-[10px]
              `,
              positive
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-400/20 bg-red-500/10 text-red-300",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            ) : (
              <ArrowDownRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            )}

            {Math.abs(change)}%
          </div>
        )}
      </div>

      {/* ========================================================
          TITLE
         ======================================================== */}

      <p className="mt-3 text-[11px] font-medium text-white/45 sm:text-xs">
        {title}
      </p>

      {/* ========================================================
          VALUE
         ======================================================== */}

      <h3 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
        {value}
      </h3>

      {/* ========================================================
          DESCRIPTION / CHANGE LABEL
         ======================================================== */}

      {(description || changeLabel) && (
        <p className="mt-1 truncate text-[10px] text-white/35 sm:text-[11px]">
          {description}

          {changeLabel && (
            <span className="ml-1 font-medium text-white/40">
              {changeLabel}
            </span>
          )}
        </p>
      )}
    </div>
  );
}