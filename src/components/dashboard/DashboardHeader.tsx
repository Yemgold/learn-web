"use client";

import { Bell, Menu, Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type DashboardRole = "student" | "admin";

interface DashboardHeaderProps {
  role: DashboardRole;
  pageTitle?: string;
  userName?: string;
  className?: string;
  onMenuClick?: () => void;
}

export default function DashboardHeader({
  role,
  pageTitle,
  userName = "Student",
  className,
  onMenuClick,
}: DashboardHeaderProps) {
  const title =
    pageTitle ??
    (role === "admin"
      ? "Admin Dashboard"
      : "Student Dashboard");

  /* ============================================================
     USER NAME
  ============================================================ */

  const displayName = userName.trim() || "Student";

  /* ============================================================
     USER INITIALS
  ============================================================ */

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "flex h-16 shrink-0 items-center justify-between",
        "border-b border-slate-200",
        "bg-white/95 backdrop-blur",
        "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {/* ========================================================
          LEFT
      ======================================================== */}

      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Sidebar Toggle */}

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </button>

        {/* Page Information */}

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-900">
            {title}
          </h1>

          <p className="truncate text-sm text-slate-500">
            Welcome back, {displayName}
          </p>
        </div>
      </div>

      {/* ========================================================
          RIGHT
      ======================================================== */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Search */}

        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-slate-600" />
        </button>

        {/* Notifications */}

        <button
          type="button"
          className="relative rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-slate-600" />

          <span
            className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
            aria-hidden="true"
          />
        </button>

        {/* User */}

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-2 transition hover:bg-slate-50 sm:px-3"
          aria-label={`Open ${displayName} profile`}
        >
          {/* Avatar */}

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white sm:h-10 sm:w-10">
            {initials}
          </div>

          {/* User Information */}

          <div className="hidden text-left md:block">
            <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
              {displayName}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {role}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}

