




"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  HelpCircle,
  Plus,
  Sparkles,
  Trophy,
} from "lucide-react";

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </Link>
  );
}

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">
            Quick Actions
          </h2>

          <p className="text-xs text-slate-500">
            Common administration tasks
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <QuickAction
          href="/admin/secondary/quiz-board/quiz-competitions/create"
          icon={<Plus className="h-5 w-5" />}
          title="Create Quiz Board"
          description="Launch a new competition"
        />

        <QuickAction
          href="/admin/secondary/quiz-board/quiz-competitions"
          icon={<Trophy className="h-5 w-5" />}
          title="Manage Competitions"
          description="View and configure boards"
        />

        <QuickAction
          href="/admin/secondary/quiz-board/questions"
          icon={<HelpCircle className="h-5 w-5" />}
          title="Question Bank"
          description="Manage quiz questions"
        />

        <QuickAction
          href="/admin/secondary/quiz-board/results"
          icon={<BarChart3 className="h-5 w-5" />}
          title="Results & Analytics"
          description="Review competition performance"
        />
      </div>
    </section>
  );
}