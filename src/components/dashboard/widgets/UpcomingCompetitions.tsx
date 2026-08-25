


"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface UpcomingCompetition {
  id: string;
  title: string;
  date: string;
  time: string;
  teams?: number;
  status: "Upcoming" | "Registration Open" | "Live";
  href: string;
}

export interface UpcomingCompetitionsProps {
  competitions: UpcomingCompetition[];
  title?: string;
  className?: string;
}

const statusStyles = {
  Upcoming:
    "bg-blue-100 text-blue-700",

  "Registration Open":
    "bg-green-100 text-green-700",

  Live:
    "bg-red-100 text-red-700",
};

export default function UpcomingCompetitions({
  competitions,
  title = "Upcoming Competitions",
  className,
}: UpcomingCompetitionsProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with upcoming competitions.
          </p>
        </div>

        <Link
          href="/competitions"
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Empty */}
      {competitions.length === 0 && (
        <div className="py-12 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No competitions available
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Check back later for new competitions.
          </p>
        </div>
      )}

      {/* List */}
      {competitions.length > 0 && (
        <div className="divide-y divide-slate-200">
          {competitions.map((competition) => (
            <Link
              key={competition.id}
              href={competition.href}
              className="block p-6 transition hover:bg-slate-50"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {competition.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {competition.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {competition.time}
                    </div>

                    {competition.teams !== undefined && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {competition.teams} Teams
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={cn(
                    "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
                    statusStyles[competition.status]
                  )}
                >
                  {competition.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}