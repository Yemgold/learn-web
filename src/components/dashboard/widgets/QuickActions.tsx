


"use client";

import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Medal,
  Users,
  BookOpen,
  Settings,
  Bell,
  User,
  Play,
  Home,
  CreditCard,
  Lock,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ============================================================
   ICONS
   ============================================================ */

const icons = {
  trophy: Trophy,
  medal: Medal,
  users: Users,
  book: BookOpen,
  settings: Settings,
  bell: Bell,
  user: User,
  play: Play,
  home: Home,
  payment: CreditCard,
};

export interface QuickAction {
  title: string;
  description?: string;
  href: string;
  icon: keyof typeof icons;

  disabled?: boolean;
}

export interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];

  locked?: boolean;

  className?: string;
}

/* ============================================================
   QUICK ACTIONS
   ============================================================ */

export default function QuickActions({
  title = "Quick Actions",
  actions,
  locked = false,
  className,
}: QuickActionsProps) {
  return (
    <section
      className={cn(
        `
          rounded-2xl
          border
          border-white/10
          bg-white/[0.035]
          p-4
          shadow-lg
          shadow-black/10
          backdrop-blur-sm
          sm:p-5
        `,
        className,
      )}
    >
      {/* ======================================================
          HEADER
         ====================================================== */}

      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white sm:text-lg">
            {title}
          </h2>

          {locked && (
            <div
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                border
                border-amber-400/20
                bg-amber-500/10
                px-2.5
                py-1
                text-[10px]
                font-semibold
                text-amber-300
                sm:text-xs
              "
            >
              <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

              <span>Access Required</span>
            </div>
          )}
        </div>

        <p className="mt-1 text-xs text-white/40 sm:text-sm">
          {locked
            ? "Choose an access plan to unlock these features."
            : "Frequently used shortcuts."}
        </p>
      </div>

      {/* ======================================================
          ACTION CARDS
         ====================================================== */}

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon =
            icons[action.icon] ?? Trophy;

          const isLocked =
            locked || action.disabled === true;

          /* ==================================================
             CARD CONTENT
             ================================================== */

          const content = (
            <div
              className={cn(
                `
                  group
                  relative
                  min-h-[112px]
                  rounded-xl
                  border
                  p-3.5
                  transition-all
                  duration-200
                  sm:min-h-[120px]
                  sm:p-4
                `,

                isLocked
                  ? [
                      "cursor-not-allowed",
                      "border-white/10",
                      "bg-white/[0.02]",
                      "opacity-55",
                    ]
                  : [
                      "border-white/10",
                      "bg-white/[0.025]",
                      "hover:border-blue-400/25",
                      "hover:bg-white/[0.05]",
                      "hover:shadow-md",
                      "hover:shadow-blue-950/20",
                    ],
              )}
            >
              {/* ==============================================
                  TOP ROW
                 ============================================== */}

              <div className="mb-3 flex items-center justify-between">
                {/* Icon */}

                <div
                  className={cn(
                    `
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                    `,
                    isLocked
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-blue-400/20 bg-blue-500/10",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isLocked
                        ? "text-white/30"
                        : "text-blue-300",
                    )}
                  />
                </div>

                {/* Right indicator */}

                {isLocked ? (
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/[0.03]
                    "
                  >
                    <Lock className="h-3.5 w-3.5 text-white/30" />
                  </div>
                ) : (
                  <ArrowRight
                    className="
                      h-4 w-4
                      text-white/25
                      transition-all
                      duration-200
                      group-hover:translate-x-1
                      group-hover:text-blue-300
                    "
                  />
                )}
              </div>

              {/* ==============================================
                  TITLE
                 ============================================== */}

              <h3
                className={cn(
                  "text-sm font-semibold leading-5",
                  isLocked
                    ? "text-white/40"
                    : "text-white/85 group-hover:text-white",
                )}
              >
                {action.title}
              </h3>

              {/* ==============================================
                  DESCRIPTION
                 ============================================== */}

              {action.description && (
                <p
                  className={cn(
                    "mt-1 text-[11px] leading-4 sm:text-xs",
                    isLocked
                      ? "text-white/25"
                      : "text-white/40",
                  )}
                >
                  {action.description}
                </p>
              )}

              {/* ==============================================
                  LOCK MESSAGE
                 ============================================== */}

              {isLocked && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-amber-300/70">
                  <Lock className="h-3 w-3" />

                  <span>
                    Unlock with an access plan
                  </span>
                </div>
              )}
            </div>
          );

          /* ==================================================
             LOCKED ACTION
             ================================================== */

          if (isLocked) {
            return (
              <div
                key={action.title}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          /* ==================================================
             ACTIVE ACTION
             ================================================== */

          return (
            <Link
              key={action.title}
              href={action.href}
              className="block"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}