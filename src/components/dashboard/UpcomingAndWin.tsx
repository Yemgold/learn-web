




"use client";

import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  ChevronRight,
  Clock3,
  Coins,
  Trophy,
} from "lucide-react";

export interface UpcomingAndWinContest {
  id: string;
  title: string;
  description?: string;
  category?: string;
  amountToBeWonInKobo: number;
  entryPoints: number;
  status?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  windowPeriod?: number;
  subject?: string;
  href?: string;
}

interface UpcomingAndWinProps {
  title?: string;
  contests: UpcomingAndWinContest[];
}

function formatNairaFromKobo(amountInKobo: number) {
  const amountInNaira = Number(amountInKobo || 0) / 100;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInNaira);
}

function formatDate(date?: string) {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date?: string) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function UpcomingAndWin({
  title = "Solve & Win Upcoming",
  contests,
}: UpcomingAndWinProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10">
              <Coins className="h-4 w-4 text-amber-400" />
            </div>

            <h2 className="text-base font-bold text-white sm:text-lg">
              {title}
            </h2>
          </div>

          <p className="mt-1 pl-11 text-xs text-slate-500">
            Answer questions, compete and win real cash rewards.
          </p>
        </div>

        <Link
          href="/student/solve-and-win"
          className="hidden items-center gap-1 text-sm font-semibold text-amber-400 transition hover:text-amber-300 sm:flex"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Contests */}
      {contests.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <Trophy className="mx-auto h-8 w-8 text-slate-600" />

          <p className="mt-3 text-sm font-medium text-slate-400">
            No upcoming Solve & Win contests
          </p>

          <p className="mt-1 text-xs text-slate-600">
            New contests will appear here when available.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {contests.map((contest) => {
            const href = contest.href || "/student/solve-and-win";

            return (
              <div
                key={contest.id}
                className="p-5 transition hover:bg-white/[0.02] sm:p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  {/* Main information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {contest.category && (
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {contest.category}
                        </span>
                      )}

                      {contest.subject && (
                        <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          {contest.subject}
                        </span>
                      )}

                      {contest.status && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {contest.status}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white sm:text-lg">
                      {contest.title}
                    </h3>

                    {contest.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {contest.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                      {contest.startDate && (
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                          <span>{formatDate(contest.startDate)}</span>
                        </div>
                      )}

                      {contest.startDate && formatTime(contest.startDate) && (
                        <div className="flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                          <span>{formatTime(contest.startDate)}</span>
                        </div>
                      )}

                      {contest.windowPeriod && (
                        <span>
                          {contest.windowPeriod}-day competition window
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prize + Entry + CTA */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:shrink-0">
                    {/* Prize */}
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-3 sm:min-w-[180px] sm:text-right">
                      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 sm:justify-end">
                        <Banknote className="h-3.5 w-3.5 text-amber-400" />
                        <span>Prize</span>
                      </div>

                      <p className="mt-1 text-xl font-bold text-amber-400 sm:text-2xl">
                        {formatNairaFromKobo(
                          contest.amountToBeWonInKobo
                        )}
                      </p>
                    </div>

                    {/* Entry points */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 sm:min-w-[140px] sm:text-right">
                      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 sm:justify-end">
                        <Coins className="h-3.5 w-3.5 text-slate-400" />
                        <span>Entry</span>
                      </div>

                      <p className="mt-1 text-lg font-bold text-white">
                        {contest.entryPoints} CBT Points
                      </p>
                    </div>

                    {/* CTA */}
                    <Link
                      href={href}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
                    >
                      View Contest
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile View All */}
      <div className="border-t border-white/10 px-5 py-4 sm:hidden">
        <Link
          href="/student/solve-and-win"
          className="flex items-center justify-center gap-1 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
        >
          View all Solve & Win contests
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}