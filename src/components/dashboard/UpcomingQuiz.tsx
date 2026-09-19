






"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Crown,
  Users,
  Trophy,
} from "lucide-react";

export interface UpcomingQuizCompetition {
  id: string;
  title: string;
  date: string;
  time: string;
  teams: number;
  status: string;
  href: string;
  prize?: string;
  contestants?: number;
  subject?: string;
}

interface UpcomingQuizProps {
  title?: string;
  competitions: UpcomingQuizCompetition[];
}

export default function UpcomingQuiz({
  title = "Upcoming Quiz Competitions",
  competitions,
}: UpcomingQuizProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
              <Trophy className="h-4 w-4 text-emerald-400" />
            </div>

            <h2 className="text-base font-bold text-white sm:text-lg">
              {title}
            </h2>
          </div>

          <p className="mt-1 pl-11 text-xs text-slate-500">
            Compete with other students and earn CBT Points.
          </p>
        </div>

        <Link
          href="/student/quiz-board"
          className="hidden items-center gap-1 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300 sm:flex"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Competitions */}
      {competitions.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <Trophy className="mx-auto h-8 w-8 text-slate-600" />

          <p className="mt-3 text-sm font-medium text-slate-400">
            No upcoming quiz competitions
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Check back later for new competitions.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {competitions.map((competition) => {
            const hasPrize =
              competition.prize !== undefined &&
              competition.prize !== null &&
              competition.prize !== "";

            return (
              <div
                key={competition.id}
                className="p-5 transition hover:bg-white/[0.02] sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Main information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {competition.subject && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {competition.subject}
                        </span>
                      )}

                      <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {competition.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white sm:text-lg">
                      {competition.title}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                        <span>{competition.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                        <span>{competition.time}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-500" />

                        <span>
                          {competition.teams}
                          {competition.contestants
                            ? ` / ${competition.contestants}`
                            : ""}{" "}
                          joined
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prize + CTA */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                    {hasPrize && (
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-5 py-3 sm:min-w-[180px] sm:text-right">
                        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 sm:justify-end">
                          <Crown className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Quiz Prize</span>
                        </div>

                        <p className="mt-1 text-xl font-bold text-emerald-400 sm:text-2xl">
                          {competition.prize}
                        </p>
                      </div>
                    )}

                    <Link
                      href={competition.href}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                    >
                      View Competition
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
          href="/student/quiz-board"
          className="flex items-center justify-center gap-1 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
        >
          View all competitions
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}