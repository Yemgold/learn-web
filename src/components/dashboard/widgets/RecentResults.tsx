


"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Medal,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface ResultItem {
  id: string;
  competition: string;
  score: number;
  rank?: number;
  date: string;
  href?: string;
}

export interface RecentResultsProps {
  title?: string;
  results: ResultItem[];
  className?: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export default function RecentResults({
  title = "Recent Results",
  results,
  className,
}: RecentResultsProps) {
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
            Your latest competition performances.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Trophy className="h-12 w-12 text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No results yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Your completed competitions will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {results.map((result) => {
            const content = (
              <div className="flex items-center gap-4 p-6 transition hover:bg-slate-50">
                <div className="rounded-xl bg-blue-100 p-3">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {result.competition}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {result.date}
                    </div>

                    {result.rank && (
                      <div className="flex items-center gap-1">
                        <Medal className="h-4 w-4" />
                        Rank #{result.rank}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold",
                    getScoreColor(result.score)
                  )}
                >
                  {result.score}%
                </div>

                {result.href && (
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                )}
              </div>
            );

            return result.href ? (
              <Link key={result.id} href={result.href}>
                {content}
              </Link>
            ) : (
              <div key={result.id}>{content}</div>
            );
          })}
        </div>
      )}
    </section>
  );
}