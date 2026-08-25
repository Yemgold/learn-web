



"use client";

import {
  Trophy,
  Users,
  School,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface LeaderboardStatsProps {
  totalTeams?: number;
  totalStudents?: number;
  totalSchools?: number;
  averageScore?: number;
  className?: string;
}

export default function LeaderboardStats({
  totalTeams = 1248,
  totalStudents = 3744,
  totalSchools = 312,
  averageScore = 842,
  className,
}: LeaderboardStatsProps) {
  const stats = [
    {
      title: "Registered Teams",
      value: totalTeams.toLocaleString(),
      icon: Trophy,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Students",
      value: totalStudents.toLocaleString(),
      icon: Users,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Schools",
      value: totalSchools.toLocaleString(),
      icon: School,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Average Score",
      value: averageScore.toString(),
      icon: TrendingUp,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <section
      className={cn(
        "grid gap-6 sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={cn(
              "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
              "transition-all duration-200",
              "hover:-translate-y-1 hover:shadow-md"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h3>
              </div>

              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  stat.iconClass
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}