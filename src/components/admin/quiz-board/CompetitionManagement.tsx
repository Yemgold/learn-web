




"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  HelpCircle,
  Settings2,
  Trophy,
} from "lucide-react";

function ManagementStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function CompetitionManagement() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Settings2 className="h-5 w-5" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-950">
            Competition Management
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Configure each Quiz Board competition
            with a subject, schedule, contestant
            limit, rewards, timing and elimination
            rounds.
          </p>
        </div>

        <Link
          href="/admin/secondary/quiz-board/quiz-competitions"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ManagementStep
          icon={<Trophy className="h-5 w-5" />}
          title="Competition"
          description="Title, schedule and contestant rules."
        />

        <ManagementStep
          icon={<BookOpen className="h-5 w-5" />}
          title="Subject"
          description="Choose the competition subject."
        />

        <ManagementStep
          icon={<HelpCircle className="h-5 w-5" />}
          title="Questions"
          description="Configure questions by difficulty."
        />

        <ManagementStep
          icon={<Award className="h-5 w-5" />}
          title="Rewards"
          description="Set winner and exit rewards."
        />
      </div>
    </section>
  );
}