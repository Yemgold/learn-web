




"use client";

import type { ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  School,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

export interface SchoolDashboardStat {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  iconClassName?: string;
}

export interface SchoolDashboardActivity {
  id: string;
  title: string;
  description?: string;
  date: string;
  type?: "student" | "teacher" | "assessment" | "class" | "system";
  status?: string;
}

export interface SchoolDashboardUpcomingItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type?: "assessment" | "meeting" | "event" | "deadline";
}

export interface SchoolDashboardOverviewProps {
  schoolName?: string;
  welcomeMessage?: string;
  academicSession?: string;
  term?: string;
  stats?: SchoolDashboardStat[];
  activities?: SchoolDashboardActivity[];
  upcomingItems?: SchoolDashboardUpcomingItem[];
  isLoading?: boolean;
  error?: string;
  onViewActivities?: () => void;
  onViewUpcoming?: () => void;
  onStatClick?: (stat: SchoolDashboardStat) => void;
  className?: string;
}

const defaultStats: SchoolDashboardStat[] = [
  {
    id: "students",
    title: "Total Students",
    value: 0,
    description: "Currently enrolled students",
    icon: <GraduationCap size={21} />,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    id: "teachers",
    title: "Total Teachers",
    value: 0,
    description: "Registered teaching staff",
    icon: <Users size={21} />,
    iconClassName: "bg-purple-50 text-purple-600",
  },
  {
    id: "classes",
    title: "Total Classes",
    value: 0,
    description: "Active school classes",
    icon: <School size={21} />,
    iconClassName: "bg-orange-50 text-orange-600",
  },
  {
    id: "assessments",
    title: "Assessments",
    value: 0,
    description: "Created assessments",
    icon: <ClipboardList size={21} />,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
];

const activityIcons: Record<
  NonNullable<SchoolDashboardActivity["type"]>,
  ReactNode
> = {
  student: <GraduationCap size={17} />,
  teacher: <Users size={17} />,
  assessment: <ClipboardList size={17} />,
  class: <BookOpen size={17} />,
  system: <Activity size={17} />,
};

const activityColors: Record<
  NonNullable<SchoolDashboardActivity["type"]>,
  string
> = {
  student: "bg-blue-50 text-blue-600",
  teacher: "bg-purple-50 text-purple-600",
  assessment: "bg-emerald-50 text-emerald-600",
  class: "bg-orange-50 text-orange-600",
  system: "bg-gray-100 text-gray-600",
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return "";

  const date = new Date(`2000-01-01T${value}`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatCard({
  stat,
  onClick,
}: {
  stat: SchoolDashboardStat;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            stat.iconClassName || "bg-gray-100 text-gray-600"
          }`}
        >
          {stat.icon || <TrendingUp size={21} />}
        </div>

        {typeof stat.change === "number" && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              stat.trend === "down"
                ? "bg-red-50 text-red-600"
                : stat.trend === "up"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {stat.trend === "down" ? (
              <ArrowDownRight size={14} />
            ) : (
              <ArrowUpRight size={14} />
            )}
            {Math.abs(stat.change)}%
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
          {typeof stat.value === "number"
            ? stat.value.toLocaleString()
            : stat.value}
        </h3>

        {stat.description && (
          <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
        )}

        {stat.changeLabel && (
          <p className="mt-2 text-xs text-gray-400">{stat.changeLabel}</p>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {content}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          {actionLabel}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-7">
      <div className="h-28 rounded-2xl bg-gray-100" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl border border-gray-100 bg-gray-100"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-80 rounded-2xl bg-gray-100" />
        <div className="h-80 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function SchoolDashboardOverview({
  schoolName = "Your School",
  welcomeMessage = "Welcome back! Here's what's happening in your school.",
  academicSession,
  term,
  stats,
  activities = [],
  upcomingItems = [],
  isLoading = false,
  error,
  onViewActivities,
  onViewUpcoming,
  onStatClick,
  className = "",
}: SchoolDashboardOverviewProps) {
  const displayedStats = stats ?? defaultStats;

  if (isLoading) {
    return (
      <div className={className}>
        <OverviewSkeleton />
      </div>
    );
  }

  return (
    <div className={`space-y-7 ${className}`}>
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white">
            <School size={14} />
            School Overview
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to {schoolName}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            {welcomeMessage}
          </p>

          {(academicSession || term) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {academicSession && (
                <span className="rounded-lg bg-white/15 px-3 py-2 text-xs font-medium">
                  {academicSession}
                </span>
              )}

              {term && (
                <span className="rounded-lg bg-white/15 px-3 py-2 text-xs font-medium">
                  {term}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute -right-8 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-28 right-32 h-64 w-64 rounded-full border-[35px] border-white/10" />
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900">
            School Statistics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A quick summary of your school's activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {displayedStats.map((stat) => (
            <StatCard
              key={stat.id}
              stat={stat}
              onClick={
                onStatClick ? () => onStatClick(stat) : undefined
              }
            />
          ))}
        </div>
      </section>

      {/* Activities and upcoming events */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <SectionHeader
            title="Recent Activities"
            description="Recent updates from your school."
            actionLabel="View all"
            onAction={onViewActivities}
          />

          {activities.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Activity size={22} />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                No recent activities
              </p>
              <p className="mt-1 text-xs text-gray-500">
                School activities will appear here when available.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activities.slice(0, 6).map((activity) => {
                const type = activity.type || "system";

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activityColors[type]}`}
                    >
                      {activityIcons[type]}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {activity.title}
                      </p>

                      {activity.description && (
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {activity.description}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(activity.date)}
                      </p>
                    </div>

                    {activity.status && (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                        {activity.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <SectionHeader
            title="Upcoming Events"
            description="Important school dates and activities."
            actionLabel="View all"
            onAction={onViewUpcoming}
          />

          {upcomingItems.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <CalendarDays size={22} />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Nothing scheduled yet
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Upcoming assessments, meetings and events will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <span className="text-[10px] font-semibold uppercase">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-bold leading-5">
                      {new Date(item.date).getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(item.date)}
                      {item.time && ` · ${formatTime(item.time)}`}
                    </p>
                  </div>

                  {item.type && (
                    <span className="hidden rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium capitalize text-gray-600 sm:inline-flex">
                      {item.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dashboard footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <UserCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              School management overview
            </p>
            <p className="text-xs text-gray-500">
              Your dashboard summary at a glance.
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-gray-400">
          Learnyfi School Portal
        </span>
      </div>
    </div>
  );
}
