
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

  /*
   * Individual action lock.
   *
   * This can be used when only one particular
   * action should be disabled.
   */
  disabled?: boolean;
}

export interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];

  /*
   * Global lock.
   *
   * When true, ALL quick-action cards become
   * non-clickable.
   *
   * This is what the student dashboard will use
   * while the access blocker is active.
   */
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
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {/* ======================================================
          HEADER
         ====================================================== */}

      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          {locked && (
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <Lock className="h-3.5 w-3.5" />
              Access Required
            </div>
          )}
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {locked
            ? "Choose an access plan to unlock these features."
            : "Frequently used shortcuts."}
        </p>
      </div>

      {/* ======================================================
          ACTION CARDS
         ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon =
            icons[action.icon] ?? Trophy;

          /*
           * An action is locked if:
           *
           * 1. The whole QuickActions section is locked
           * OR
           * 2. The individual action is disabled.
           */
          const isLocked =
            locked || action.disabled === true;

          /* ==================================================
             CARD CONTENT
             ================================================== */

          const content = (
            <div
              className={cn(
                "group relative rounded-xl border p-5 transition-all",

                /*
                 * LOCKED
                 */
                isLocked
                  ? [
                      "cursor-not-allowed",
                      "border-slate-200",
                      "bg-slate-50",
                      "opacity-60",
                    ]
                  : [
                      "border-slate-200",
                      "bg-white",
                      "hover:border-blue-200",
                      "hover:bg-blue-50",
                      "hover:shadow-sm",
                    ],
              )}
            >
              {/* ==============================================
                  TOP ROW
                 ============================================== */}

              <div className="mb-4 flex items-center justify-between">
                {/* Icon */}

                <div
                  className={cn(
                    "rounded-lg p-3",
                    isLocked
                      ? "bg-slate-200"
                      : "bg-blue-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      isLocked
                        ? "text-slate-400"
                        : "text-blue-600",
                    )}
                  />
                </div>

                {/* Right indicator */}

                {isLocked ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                ) : (
                  <ArrowRight
                    className={cn(
                      "h-5 w-5 text-slate-400",
                      "transition-transform",
                      "group-hover:translate-x-1",
                    )}
                  />
                )}
              </div>

              {/* ==============================================
                  TITLE
                 ============================================== */}

              <h3
                className={cn(
                  "font-semibold",
                  isLocked
                    ? "text-slate-500"
                    : "text-slate-900",
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
                    "mt-2 text-sm",
                    isLocked
                      ? "text-slate-400"
                      : "text-slate-500",
                  )}
                >
                  {action.description}
                </p>
              )}

              {/* ==============================================
                  LOCK MESSAGE
                 ============================================== */}

              {isLocked && (
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-600">
                  <Lock className="h-3.5 w-3.5" />

                  <span>
                    Unlock with an access plan
                  </span>
                </div>
              )}
            </div>
          );

          /* ==================================================
             LOCKED ACTION
             
             IMPORTANT:
             Do NOT wrap locked cards in Link.
             
             This means they are genuinely non-clickable,
             not merely visually disabled.
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







// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   Trophy,
//   Medal,
//   Users,
//   BookOpen,
//   Settings,
//   Bell,
//   User,
//   Play,
//   Home,
//   CreditCard,
// } from "lucide-react";

// import { cn } from "@/lib/utils";

// const icons = {
//   trophy: Trophy,
//   medal: Medal,
//   users: Users,
//   book: BookOpen,
//   settings: Settings,
//   bell: Bell,
//   user: User,
//   play: Play,
//   home: Home,
//   payment: CreditCard,
// };

// export interface QuickAction {
//   title: string;
//   description?: string;
//   href: string;
//   icon: keyof typeof icons;
//   disabled?: boolean;
// }

// export interface QuickActionsProps {
//   title?: string;
//   actions: QuickAction[];
//   className?: string;
// }

// export default function QuickActions({
//   title = "Quick Actions",
//   actions,
//   className,
// }: QuickActionsProps) {
//   return (
//     <section
//       className={cn(
//         "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
//         className
//       )}
//     >
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold">
//           {title}
//         </h2>

//         <p className="mt-1 text-sm text-slate-500">
//           Frequently used shortcuts.
//         </p>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {actions.map((action) => {
//           const Icon = icons[action.icon] ?? Trophy;

//           const content = (
//             <div
//               className={cn(
//                 "group rounded-xl border border-slate-200 p-5 transition-all",
//                 action.disabled
//                   ? "cursor-not-allowed opacity-50"
//                   : "hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm"
//               )}
//             >
//               <div className="mb-4 flex items-center justify-between">
//                 <div className="rounded-lg bg-blue-100 p-3">
//                   <Icon className="h-6 w-6 text-blue-600" />
//                 </div>

//                 {!action.disabled && (
//                   <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
//                 )}
//               </div>

//               <h3 className="font-semibold">
//                 {action.title}
//               </h3>

//               {action.description && (
//                 <p className="mt-2 text-sm text-slate-500">
//                   {action.description}
//                 </p>
//               )}
//             </div>
//           );

//           if (action.disabled) {
//             return <div key={action.title}>{content}</div>;
//           }

//           return (
//             <Link
//               key={action.title}
//               href={action.href}
//             >
//               {content}
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// }