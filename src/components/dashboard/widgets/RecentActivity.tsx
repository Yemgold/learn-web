



"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Trophy,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  href?: string;
  type?: "competition" | "practice" | "team" | "success" | "general";
}

export interface RecentActivityProps {
  title?: string;
  activities: ActivityItem[];
  className?: string;
}

const activityIcons: Record<
  NonNullable<ActivityItem["type"]>,
  LucideIcon
> = {
  competition: Trophy,
  practice: BookOpen,
  team: Users,
  success: CheckCircle2,
  general: Clock,
};

export default function RecentActivity({
  title = "Recent Activity",
  activities,
  className,
}: RecentActivityProps) {
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
            Your latest activities and updates.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No recent activity
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Your recent actions will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {activities.map((activity) => {
            const Icon =
              activityIcons[activity.type ?? "general"];

            const content = (
              <div className="flex items-start gap-4 p-6 transition hover:bg-slate-50">
                <div className="rounded-xl bg-blue-100 p-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  {activity.description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-slate-400">
                    {activity.time}
                  </p>
                </div>

                {activity.href && (
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                )}
              </div>
            );

            return activity.href ? (
              <Link key={activity.id} href={activity.href}>
                {content}
              </Link>
            ) : (
              <div key={activity.id}>{content}</div>
            );
          })}
        </div>
      )}
    </section>
  );
}