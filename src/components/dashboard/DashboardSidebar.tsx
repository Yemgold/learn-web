

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LogOut,
  X,
  Lock,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { studentNavigation } from "./navigation/student-nav";
import { adminNavigation } from "./navigation/admin-nav";

import { useAuthStore } from "@/stores";

import { useLogout } from "@/hooks/auth/useLogout";

/* ============================================================
   ROLE
   ============================================================ */

export type DashboardRole =
  | "student"
  | "admin";

/* ============================================================
   PROPS
   ============================================================ */

interface DashboardSidebarProps {
  role: DashboardRole;
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

/* ============================================================
   ACCESSIBLE WITHOUT A PLAN
   ============================================================ */

const PUBLIC_STUDENT_ROUTES = [
  "/student/dashboard",
  "/student/referrals",
  "/student/wallet",
];

/* ============================================================
   DASHBOARD SIDEBAR
   ============================================================ */

export default function DashboardSidebar({
  role,
  open = false,
  onClose,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const router = useRouter();

  /* ============================================================
     AUTH STORE
     ============================================================ */

  const {
    user,
  } = useAuthStore();

  /* ============================================================
     LOGOUT MUTATION
     ============================================================ */

  const logoutMutation =
    useLogout();

  /* ============================================================
     LOGOUT HANDLER
     ============================================================ */

  const handleLogout = () => {
    /*
     * Prevent multiple logout requests.
     */

    if (logoutMutation.isPending) {
      return;
    }

    console.log(
      "========== DASHBOARD LOGOUT ==========",
    );

    logoutMutation.mutate(
      undefined,
      {
        onSuccess: () => {
          console.log(
            "✅ BACKEND LOGOUT SUCCESS",
          );

          /*
           * Close mobile sidebar first.
           */

          onClose?.();

          /*
           * Send user to login page.
           *
           * replace() prevents the user from pressing
           * Back and returning to the authenticated
           * dashboard page.
           */

          router.replace(
            "/auth/login",
          );
        },

        onError: () => {
          console.warn(
            "⚠️ BACKEND LOGOUT FAILED — LOCAL AUTH CLEARED",
          );

          /*
           * useLogout() clears the local token and
           * Zustand auth state even when the backend
           * request fails.
           *
           * Therefore we still redirect the user.
           */

          onClose?.();

          router.replace(
            "/auth/login",
          );
        },
      },
    );
  };

  /* ============================================================
     NAVIGATION
     ============================================================ */

  const navigation =
    role === "admin"
      ? adminNavigation
      : studentNavigation;

  /* ============================================================
     ACCESS CHECK
     ============================================================ */

  const hasSecondaryPlan =
  Array.isArray(user?.plans) &&
  user.plans.includes("SECONDARY");

  /* ============================================================
     ITEM ACCESS
     ============================================================ */

  const isItemAccessible = (
    href: string,
  ) => {
    /*
     * Admin navigation is always accessible.
     */

    if (role === "admin") {
      return true;
    }

    /*
     * Student already has an active plan.
     */

    if (hasSecondaryPlan) {
      return true;
    }

    /*
     * Student has no plan.
     *
     * Only the basic dashboard/account areas
     * remain accessible.
     */

    return PUBLIC_STUDENT_ROUTES.some(
      (route) =>
        href === route ||
        href.startsWith(
          `${route}/`,
        ),
    );
  };

  /* ============================================================
     NAVIGATION ITEM
     ============================================================ */

  const renderNavigationItem = (
    item: (typeof navigation)[number]["items"][number],
  ) => {
    const Icon = item.icon;

    const active =
      pathname === item.href ||
      pathname.startsWith(
        `${item.href}/`,
      );

    const accessible =
      isItemAccessible(
        item.href,
      );

    /* ==========================================================
       LOCKED ITEM
       ========================================================== */

    if (!accessible) {
      return (
        <div
          key={item.href}
          className={cn(
            "flex items-center gap-3",
            "rounded-xl px-4 py-3",
            "text-sm font-semibold",
            "cursor-not-allowed",
            "text-slate-400",
            "select-none",
          )}
          aria-disabled="true"
          title="Choose a plan to unlock this feature"
        >
          <Icon className="h-5 w-5 shrink-0 text-slate-400" />

          <span className="min-w-0 flex-1">
            {item.label}
          </span>

          <Lock className="h-4 w-4 shrink-0 text-slate-400" />
        </div>
      );
    }

    /* ==========================================================
       ACCESSIBLE ITEM
       ========================================================== */

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3",
          "rounded-xl px-4 py-3",
          "text-sm font-semibold",
          "transition-all duration-200",

          active
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-100",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />

        <span className="min-w-0 flex-1">
          {item.label}
        </span>

        {item.badge && (
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5",
              "text-xs font-bold",

              active
                ? "bg-white/20 text-white"
                : "bg-blue-100 text-blue-700",
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  /* ============================================================
     NAVIGATION CONTENT
     ============================================================ */

  const renderNavigation = () => (
    <div className="space-y-8">
      {navigation.map(
        (section) => (
          <div
            key={section.title}
          >
            <h3
              className={cn(
                "mb-2 px-4",
                "text-xs font-bold uppercase",
                "tracking-wider",
                "text-slate-400",
              )}
            >
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map(
                (item) =>
                  renderNavigationItem(
                    item,
                  ),
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );

  /* ============================================================
     LOGOUT BUTTON
     ============================================================ */

  const renderLogoutButton = () => (
    <button
      type="button"
      onClick={handleLogout}
      disabled={
        logoutMutation.isPending
      }
      className={cn(
        "flex w-full items-center gap-3",
        "rounded-xl px-4 py-3",
        "text-sm font-semibold",
        "text-red-600",
        "transition-colors",
        "hover:bg-red-50",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
      )}
    >
      <LogOut className="h-5 w-5" />

      <span>
        {logoutMutation.isPending
          ? "Logging out..."
          : "Logout"}
      </span>
    </button>
  );

  /* ============================================================
     SIDEBAR
     ============================================================ */

  return (
    <>
      {/* ========================================================
          MOBILE BACKDROP
         ======================================================== */}

      <div
        className={cn(
          "fixed inset-0 z-40",
          "bg-slate-950/50",
          "backdrop-blur-sm",
          "transition-opacity duration-300",
          "lg:hidden",

          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ========================================================
          DESKTOP SIDEBAR
         ======================================================== */}

      <aside
        className={cn(
          "hidden lg:flex",
          "sticky top-0 h-screen",
          "w-72 shrink-0",
          "flex-col",
          "border-r border-slate-200",
          "bg-white",
          className,
        )}
      >
        {/* ======================================================
            LOGO
           ====================================================== */}

        <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-6">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-blue-600"
          >
            {/* JAMB League */}
            EXAM League
          </Link>
        </div>

        {/* ======================================================
            NAVIGATION
           ====================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {renderNavigation()}
        </nav>

        {/* ======================================================
            DESKTOP LOGOUT
           ====================================================== */}

        <div className="shrink-0 border-t border-slate-200 p-4">
          {renderLogoutButton()}
        </div>
      </aside>

      {/* ========================================================
          MOBILE SIDEBAR
         ======================================================== */}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50",
          "flex w-72 flex-col",
          "border-r border-slate-200",
          "bg-white shadow-2xl",
          "transition-transform duration-300",
          "lg:hidden",

          open
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >
        {/* ======================================================
            MOBILE HEADER
           ====================================================== */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <Link
            href="/"
            onClick={onClose}
            className="text-xl font-black tracking-tight text-blue-600"
          >
            {/* JAMB League */}
             EXAM League
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ======================================================
            MOBILE NAVIGATION
           ====================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {renderNavigation()}
        </nav>

        {/* ======================================================
            MOBILE LOGOUT
           ====================================================== */}

        <div className="shrink-0 border-t border-slate-200 p-4">
          {renderLogoutButton()}
        </div>
      </aside>
    </>
  );
}






