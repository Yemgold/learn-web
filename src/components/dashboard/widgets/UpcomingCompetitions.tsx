




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
        "mx-1 rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Stay updated with upcoming competitions.
          </p>
        </div>

        <Link
          href="/competitions"
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 sm:gap-2 sm:text-sm"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      {/* Empty */}
      {competitions.length === 0 && (
        <div className="px-5 py-10 text-center sm:px-6 sm:py-12">
          <CalendarDays className="mx-auto h-10 w-10 text-slate-300 sm:h-12 sm:w-12" />

          <h3 className="mt-3 text-base font-semibold text-slate-800 sm:mt-4 sm:text-lg">
            No competitions available
          </h3>

          <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">
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
              className="mx-1 block rounded-xl px-4 py-4 transition hover:bg-slate-50 sm:mx-2 sm:px-4 sm:py-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                    {competition.title}
                  </h3>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500 sm:mt-3 sm:gap-4 sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {competition.date}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {competition.time}
                    </div>

                    {competition.teams !== undefined && (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {competition.teams} Teams
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={cn(
                    "inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs",
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