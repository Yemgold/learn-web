





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronRight,
  Download,
  Medal,
  RefreshCw,
  Search,
  Trophy,
  Users,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type ResultStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "NOT_STARTED";

interface CompetitionResult {
  id: string;
  rank: number;
  studentName: string;
  studentEmail: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number;
  status: ResultStatus;
}

/* ============================================================
   PAGE
   ============================================================ */

export default function NationalCompetitionResultsPage() {
  const params = useParams();

  const rawCompetitionId =
    params.nationalcompetitionid;

  const competitionId = Array.isArray(
    rawCompetitionId,
  )
    ? rawCompetitionId[0]
    : rawCompetitionId;

  /* ==========================================================
     STATE
     ========================================================== */

  const [results] =
    useState<CompetitionResult[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "ALL" | ResultStatus
    >("ALL");

  const [sortField, setSortField] =
    useState<
      "rank" | "score" | "percentage" | "timeTaken"
    >("rank");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  /* ==========================================================
     SORT
     ========================================================== */

  const handleSort = (
    field:
      | "rank"
      | "score"
      | "percentage"
      | "timeTaken",
  ) => {
    if (sortField === field) {
      setSortDirection(
        (current) =>
          current === "asc"
            ? "desc"
            : "asc",
      );
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  /* ==========================================================
     FORMAT TIME
     ========================================================== */

  const formatTime = (
    seconds: number,
  ) => {
    const minutes = Math.floor(
      seconds / 60,
    );

    const remainingSeconds =
      seconds % 60;

    return `${minutes}m ${String(
      remainingSeconds,
    ).padStart(2, "0")}s`;
  };

  /* ==========================================================
     FILTER + SORT
     ========================================================== */

  const filteredResults =
    results
      .filter((result) => {
        const search =
          searchTerm
            .trim()
            .toLowerCase();

        if (!search) {
          return true;
        }

        return (
          result.studentName
            .toLowerCase()
            .includes(search) ||
          result.studentEmail
            .toLowerCase()
            .includes(search)
        );
      })
      .filter((result) => {
        if (statusFilter === "ALL") {
          return true;
        }

        return (
          result.status ===
          statusFilter
        );
      })
      .sort((a, b) => {
        const first =
          a[sortField];

        const second =
          b[sortField];

        if (
          first <
          second
        ) {
          return sortDirection ===
            "asc"
            ? -1
            : 1;
        }

        if (
          first >
          second
        ) {
          return sortDirection ===
            "asc"
            ? 1
            : -1;
        }

        return 0;
      });

  /* ==========================================================
     STATS
     ========================================================== */

  const completedCount =
    results.filter(
      (item) =>
        item.status ===
        "COMPLETED",
    ).length;

  const inProgressCount =
    results.filter(
      (item) =>
        item.status ===
        "IN_PROGRESS",
    ).length;

  const averageScore =
    completedCount > 0
      ? results
          .filter(
            (item) =>
              item.status ===
              "COMPLETED",
          )
          .reduce(
            (total, item) =>
              total +
              item.percentage,
            0,
          ) /
        completedCount
      : 0;

  /* ==========================================================
     ROUTE VALIDATION
     ========================================================== */

  if (!competitionId) {
    return (
      <ErrorState message="National Competition ID is missing." />
    );
  }

  /* ============================================================
     PAGE
     ============================================================ */

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

          <Link
            href="/admin"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Admin
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span>Secondary</span>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            National Competitions
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Competition
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-900 dark:text-white">
            Results
          </span>

        </div>

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href={`/admin/secondary/nationalcompetitions/${competitionId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              <Trophy className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Competition Results
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              View student performance, rankings, scores,
              and competition standings.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              disabled
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-400 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600"
              title="Available when the results API is connected"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              type="button"
              disabled
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-400 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600"
              title="Available when the results API is connected"
            >
              <Download className="h-4 w-4" />
              Export
            </button>

          </div>

        </div>

        {/* ==================================================
            BACKEND NOTICE
        ================================================== */}

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>

            <p className="font-semibold">
              Results API not connected
            </p>

            <p className="mt-1 leading-6">
              The leaderboard interface is ready, but
              student results will appear here once the
              National Competition results endpoint is
              available.
            </p>

          </div>

        </div>

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={
              <Users className="h-5 w-5" />
            }
            label="Participants"
            value={String(
              results.length,
            )}
          />

          <StatCard
            icon={
              <Trophy className="h-5 w-5" />
            }
            label="Completed"
            value={String(
              completedCount,
            )}
          />

          <StatCard
            icon={
              <RefreshCw className="h-5 w-5" />
            }
            label="In Progress"
            value={String(
              inProgressCount,
            )}
          />

          <StatCard
            icon={
              <Medal className="h-5 w-5" />
            }
            label="Average Score"
            value={`${averageScore.toFixed(
              1,
            )}%`}
          />

        </div>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value,
                  )
                }
                placeholder="Search student name or email..."
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as
                    | "ALL"
                    | ResultStatus,
                )
              }
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="ALL">
                All Participants
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="NOT_STARTED">
                Not Started
              </option>
            </select>

          </div>

        </div>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {filteredResults.length ===
        0 ? (

          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">

              <Trophy className="h-7 w-7 text-gray-500 dark:text-gray-400" />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
              No results available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              There are currently no competition results
              to display.
            </p>

          </div>

        ) : (

          /* =================================================
             RESULTS TABLE
          ================================================= */

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">

                  <tr>

                    <SortableHeader
                      label="Rank"
                      field="rank"
                      activeField={
                        sortField
                      }
                      direction={
                        sortDirection
                      }
                      onSort={
                        handleSort
                      }
                    />

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <SortableHeader
                      label="Score"
                      field="score"
                      activeField={
                        sortField
                      }
                      direction={
                        sortDirection
                      }
                      onSort={
                        handleSort
                      }
                    />

                    <SortableHeader
                      label="Percentage"
                      field="percentage"
                      activeField={
                        sortField
                      }
                      direction={
                        sortDirection
                      }
                      onSort={
                        handleSort
                      }
                    />

                    <SortableHeader
                      label="Time"
                      field="timeTaken"
                      activeField={
                        sortField
                      }
                      direction={
                        sortDirection
                      }
                      onSort={
                        handleSort
                      }
                    />

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">

                  {filteredResults.map(
                    (result) => (
                      <tr
                        key={result.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >

                        {/* RANK */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            {result.rank <=
                              3 && (
                              <Medal className="h-4 w-4 text-gray-500" />
                            )}

                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              #
                              {
                                result.rank
                              }
                            </span>

                          </div>

                        </td>

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {
                              result.studentName
                            }
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {
                              result.studentEmail
                            }
                          </p>

                        </td>

                        {/* SCORE */}

                        <td className="px-5 py-4">

                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {
                              result.score
                            }
                            /
                            {
                              result.totalMarks
                            }
                          </span>

                        </td>

                        {/* PERCENTAGE */}

                        <td className="px-5 py-4">

                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {
                              result.percentage
                            }
                            %
                          </span>

                        </td>

                        {/* TIME */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(
                              result.timeTaken,
                            )}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={
                              result.status
                            }
                          />

                        </td>

                      </tr>
                    ),
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   SORTABLE HEADER
   ============================================================ */

function SortableHeader({
  label,
  field,
  activeField,
  direction,
  onSort,
}: {
  label: string;
  field:
    | "rank"
    | "score"
    | "percentage"
    | "timeTaken";
  activeField:
    | "rank"
    | "score"
    | "percentage"
    | "timeTaken";
  direction: "asc" | "desc";
  onSort: (
    field:
      | "rank"
      | "score"
      | "percentage"
      | "timeTaken",
  ) => void;
}) {
  const active =
    field === activeField;

  return (
    <th className="px-5 py-4 text-left">

      <button
        type="button"
        onClick={() =>
          onSort(field)
        }
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-900 dark:hover:text-white"
      >

        {label}

        {active &&
          (direction ===
          "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          ))}

      </button>

    </th>
  );
}

/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({
  status,
}: {
  status: ResultStatus;
}) {
  const config: Record<
    ResultStatus,
    {
      label: string;
      className: string;
    }
  > = {
    COMPLETED: {
      label: "Completed",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    },

    IN_PROGRESS: {
      label: "In Progress",
      className:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    },

    NOT_STARTED: {
      label: "Not Started",
      className:
        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    },
  };

  const item =
    config[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* ============================================================
   ERROR STATE
   ============================================================ */

function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-3xl">

        <Link
          href="/admin/secondary/nationalcompetitions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">

            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />

          </div>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invalid route
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {message}
          </p>

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
          >
            Back to Competitions
          </Link>

        </div>

      </div>

    </div>
  );
}