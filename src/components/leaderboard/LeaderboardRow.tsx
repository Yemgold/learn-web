



"use client";

import {
  Medal,
  Trophy,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface LeaderboardRowProps {
  rank: number;
  teamName: string;
  school: string;
  score: number;
  state: string;
  competitions: number;
  avatar?: string;
  className?: string;
}

export default function LeaderboardRow({
  rank,
  teamName,
  school,
  score,
  state,
  competitions,
  avatar,
  className,
}: LeaderboardRowProps) {
  const badge = getRankBadge(rank);

  return (
    <div
      className={cn(
        "grid grid-cols-[70px_1.7fr_1.2fr_120px_120px_120px] items-center gap-4",
        "rounded-2xl border border-slate-200 bg-white px-5 py-4",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md",
        className
      )}
    >
      {/* Rank */}
      <div className="flex items-center gap-2">
        {badge.icon}

        <span className="text-lg font-bold text-slate-900">
          #{rank}
        </span>
      </div>

      {/* Team */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={teamName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-blue-700">
              {teamName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            {teamName}
          </h3>

          <p className="text-sm text-slate-500">
            {school}
          </p>
        </div>
      </div>

      {/* State */}
      <div>
        <p className="font-medium text-slate-700">
          {state}
        </p>
      </div>

      {/* Score */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-emerald-600" />

        <span className="font-bold text-emerald-700">
          {score}
        </span>
      </div>

      {/* Competitions */}
      <div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {competitions}
        </span>
      </div>

      {/* Position */}
      <div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold",
            badge.className
          )}
        >
          {badge.label}
        </span>
      </div>
    </div>
  );
}

function getRankBadge(rank: number) {
  switch (rank) {
    case 1:
      return {
        label: "Champion",
        icon: (
          <Trophy className="h-5 w-5 text-yellow-500" />
        ),
        className:
          "bg-yellow-100 text-yellow-700",
      };

    case 2:
      return {
        label: "Runner-up",
        icon: (
          <Medal className="h-5 w-5 text-slate-500" />
        ),
        className:
          "bg-slate-100 text-slate-700",
      };

    case 3:
      return {
        label: "Third Place",
        icon: (
          <Medal className="h-5 w-5 text-amber-700" />
        ),
        className:
          "bg-amber-100 text-amber-700",
      };

    default:
      return {
        label: "Qualified",
        icon: (
          <span className="font-bold text-slate-500">
            •
          </span>
        ),
        className:
          "bg-blue-100 text-blue-700",
      };
  }
}