





"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Eye,
  Plus,
  Trophy,
  Users,
} from "lucide-react";

interface NationalCompetition {
  id: string;
  title: string;
  description: string;
  status: "draft" | "upcoming" | "active" | "completed";
  startDate: string;
  endDate: string;
  participants: number;
  subjects: number;
}

const competitions: NationalCompetition[] = [
  // Add real competitions from your API here later.
];

const statusConfig = {
  draft: {
    label: "Draft",
    className:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  upcoming: {
    label: "Upcoming",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  active: {
    label: "Active",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  completed: {
    label: "Completed",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
};

export default function NationalCompetitionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/admin"
                className="transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                Admin
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span>Secondary</span>

              <ChevronRight className="h-4 w-4" />

              <span className="text-gray-900 dark:text-white">
                National Competitions
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              National Competitions
            </h1>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create and manage national academic competitions for students.
            </p>
          </div>

          <Link
            href="/admin/secondary/nationalcompetitions/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
            Create Competition
          </Link>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<Trophy className="h-5 w-5" />}
            label="Total Competitions"
            value={competitions.length}
          />

          <SummaryCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Upcoming"
            value={
              competitions.filter((item) => item.status === "upcoming").length
            }
          />

          <SummaryCard
            icon={<Eye className="h-5 w-5" />}
            label="Active"
            value={
              competitions.filter((item) => item.status === "active").length
            }
          />

          <SummaryCard
            icon={<Users className="h-5 w-5" />}
            label="Participants"
            value={competitions.reduce(
              (total, item) => total + item.participants,
              0,
            )}
          />
        </div>

        {/* Competition list */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              All Competitions
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage your national competitions.
            </p>
          </div>

          {competitions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {competitions.map((competition) => (
                <CompetitionRow
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {icon}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function CompetitionRow({
  competition,
}: {
  competition: NationalCompetition;
}) {
  const status = statusConfig[competition.status];

  return (
    <Link
      href={`/admin/secondary/nationalcompetitions/${competition.id}`}
      className="group block px-5 py-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900 dark:text-white">
              {competition.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {competition.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {competition.startDate} — {competition.endDate}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {competition.participants} participants
            </span>

            <span>
              {competition.subjects}{" "}
              {competition.subjects === 1 ? "subject" : "subjects"}
            </span>
          </div>
        </div>

        <ChevronRight className="hidden h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 lg:block" />
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Trophy className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        No competitions yet
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Create your first national competition and start adding subjects,
        questions, participants, and competition settings.
      </p>

      <Link
        href="/admin/secondary/nationalcompetitions/create"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        <Plus className="h-4 w-4" />
        Create Competition
      </Link>
    </div>
  );
}
