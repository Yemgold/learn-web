




"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  HelpCircle,
  Radio,
  Trophy,
  Users,
} from "lucide-react";

type OverviewCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  accent?:
    | "blue"
    | "red"
    | "violet"
    | "emerald";
};

function OverviewCard({
  icon,
  label,
  value,
  description,
  accent = "blue",
}: OverviewCardProps) {
  const iconClasses = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-600",
    emerald:
      "bg-emerald-50 text-emerald-600",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClasses[accent]}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </section>
  );
}

type Props = {
  totalCount: number;
  liveCount: number;
  upcomingCount: number;
  participants: number;
  questions: number;
};

export default function OverviewSection({
  totalCount,
  liveCount,
  upcomingCount,
  participants,
  questions,
}: Props) {
  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <OverviewCard
        icon={<Trophy className="h-5 w-5" />}
        label="Competitions"
        value={String(totalCount)}
        description="Total Quiz Boards"
      />

      <OverviewCard
        icon={<Radio className="h-5 w-5" />}
        label="Live Now"
        value={String(liveCount)}
        description="Currently running"
        accent="red"
      />

      <OverviewCard
        icon={<CalendarDays className="h-5 w-5" />}
        label="Upcoming"
        value={String(upcomingCount)}
        description="Scheduled / waiting"
        accent="blue"
      />

      <OverviewCard
        icon={<Users className="h-5 w-5" />}
        label="Participants"
        value={String(participants)}
        description="Currently joined"
        accent="violet"
      />

      <OverviewCard
        icon={<HelpCircle className="h-5 w-5" />}
        label="Questions"
        value={String(questions)}
        description="Configured questions"
        accent="emerald"
      />
    </section>
  );
}