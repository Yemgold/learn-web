





"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Gift,
  History,
  Send,
  Trophy,
} from "lucide-react";

interface CbtWalletQuickActionsProps {
  onSendPoints?: () => void;
  onRedeemRewards?: () => void;
  className?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  onClick?: () => void;
}

export default function CbtWalletQuickActions({
  onSendPoints,
  onRedeemRewards,
  className = "",
}: CbtWalletQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "practice",
      title: "Practice & Earn",
      description: "Answer questions and earn points",
      href: "/student/practice/cbtsubjects?exam=jamb",
      icon: BookOpen,
      iconClassName: "bg-cyan-500/10 text-cyan-400",
    },
    {
      id: "send",
      title: "Send Points",
      description: "Send CBT Points to a friend",
      icon: Send,
      iconClassName: "bg-violet-500/10 text-violet-400",
      onClick: onSendPoints,
    },
    {
      id: "rewards",
      title: "Redeem Rewards",
      description: "Use points for student rewards",
      icon: Gift,
      iconClassName: "bg-amber-500/10 text-amber-400",
      onClick: onRedeemRewards,
    },
    {
      id: "competitions",
      title: "Quiz Competitions",
      description: "Compete and win more points",
      href: "/student/quiz-board",
      icon: Trophy,
      iconClassName: "bg-emerald-500/10 text-emerald-400",
    },
    {
      id: "transactions",
      title: "Transactions",
      description: "View your complete points history",
      href: "/student/practice/cbt-wallet/transactions",
      icon: History,
      iconClassName: "bg-slate-800 text-slate-400",
    },
  ];

  return (
    <section className={className}>
      <div className="mb-4">
        <h2 className="text-base font-bold text-white">Quick Actions</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Manage your CBT Points and keep earning.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;

          const content = (
            <>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconClassName}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white">
                  {action.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                  {action.description}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-700 transition-all group-hover:translate-x-0.5 group-hover:text-slate-400" />
            </>
          );

          const className =
            "group flex min-h-[104px] items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900";

          if (action.href) {
            return (
              <Link
                key={action.id}
                href={action.href}
                className={className}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`${className} w-full`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}