





"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock3,
  Download,
  Medal,
  Search,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ============================================================
   TYPES
   ============================================================ */

type ResultStatus = "Completed" | "In Progress" | "Disqualified";

interface CompetitionResult {
  id: string;
  rank: number;
  participantName: string;
  teamName: string;
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  duration: string;
  status: ResultStatus;
  submittedAt: string;
}

/* ============================================================
   TEMPORARY DATA
   Replace with backend data later.
   ============================================================ */

const results: CompetitionResult[] = [
  {
    id: "result-001",
    rank: 1,
    participantName: "Daniel Okafor",
    teamName: "Team Alpha",
    score: 96,
    totalPoints: 100,
    correctAnswers: 48,
    totalQuestions: 50,
    duration: "42 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 11:02 AM",
  },
  {
    id: "result-002",
    rank: 2,
    participantName: "Amaka Eze",
    teamName: "Team Phoenix",
    score: 94,
    totalPoints: 100,
    correctAnswers: 47,
    totalQuestions: 50,
    duration: "45 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 11:05 AM",
  },
  {
    id: "result-003",
    rank: 3,
    participantName: "Samuel Adeyemi",
    teamName: "Team Titans",
    score: 92,
    totalPoints: 100,
    correctAnswers: 46,
    totalQuestions: 50,
    duration: "39 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 10:59 AM",
  },
  {
    id: "result-004",
    rank: 4,
    participantName: "Blessing Chukwu",
    teamName: "Team Victory",
    score: 89,
    totalPoints: 100,
    correctAnswers: 44,
    totalQuestions: 50,
    duration: "47 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 11:08 AM",
  },
  {
    id: "result-005",
    rank: 5,
    participantName: "Ibrahim Musa",
    teamName: "Team Scholars",
    score: 87,
    totalPoints: 100,
    correctAnswers: 43,
    totalQuestions: 50,
    duration: "50 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 11:11 AM",
  },
  {
    id: "result-006",
    rank: 6,
    participantName: "Grace Williams",
    teamName: "Team Eagles",
    score: 84,
    totalPoints: 100,
    correctAnswers: 42,
    totalQuestions: 50,
    duration: "52 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 11:13 AM",
  },
  {
    id: "result-007",
    rank: 7,
    participantName: "Joseph Peter",
    teamName: "Team Future",
    score: 81,
    totalPoints: 100,
    correctAnswers: 40,
    totalQuestions: 50,
    duration: "55 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 11:16 AM",
  },
  {
    id: "result-008",
    rank: 8,
    participantName: "Mary Johnson",
    teamName: "Team Bright",
    score: 76,
    totalPoints: 100,
    correctAnswers: 38,
    totalQuestions: 50,
    duration: "58 min",
    status: "Completed",
    submittedAt: "15 Jan 2027, 11:19 AM",
  },
  {
    id: "result-009",
    rank: 9,
    participantName: "David Emmanuel",
    teamName: "Team Legends",
    score: 64,
    totalPoints: 100,
    correctAnswers: 32,
    totalQuestions: 50,
    duration: "31 min",
    status: "In Progress",
    submittedAt: "-",
  },
  {
    id: "result-010",
    rank: 10,
    participantName: "Ruth James",
    teamName: "Team Stars",
    score: 0,
    totalPoints: 100,
    correctAnswers: 0,
    totalQuestions: 50,
    duration: "-",
    status: "Disqualified",
    submittedAt: "-",
  },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function CompetitionResultsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | ResultStatus
  >("All");

  const filteredResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesSearch =
        !normalizedSearch ||
        result.participantName
          .toLowerCase()
          .includes(normalizedSearch) ||
        result.teamName
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        result.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const completedResults = results.filter(
    (result) => result.status === "Completed",
  );

  const averageScore =
    completedResults.length > 0
      ? Math.round(
          completedResults.reduce(
            (total, result) => total + result.score,
            0,
          ) / completedResults.length,
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* ====================================================
            BACK
        ==================================================== */}

        <Link
          href="/admin/solveandwin/competitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                Solve &amp; Win
              </span>

              <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
                Results
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Competition Results
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              View participant performance, scores, rankings and
              completion status for this competition.
            </p>

            <p className="mt-3 text-sm text-slate-500">
              JAMB League 2027 Championship
            </p>
          </div>

          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => {
              /*
               * TODO:
               * Connect this button to the backend export-results
               * endpoint when available.
               */
            }}
          >
            Export Results
          </Button>
        </div>

        {/* ====================================================
            COMPETITION SUMMARY
        ==================================================== */}

        <Card className="mb-8 overflow-hidden">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-500" />

                <h2 className="text-xl font-bold text-slate-900">
                  JAMB League 2027 Championship
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Completed
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Competition results and final participant rankings
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              425 Registered Teams
            </div>
          </div>
        </Card>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Participants
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {results.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {completedResults.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Average Score
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {averageScore}
                  <span className="text-lg text-slate-400">
                    /100
                  </span>
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {
                    results.filter(
                      (result) =>
                        result.status === "In Progress",
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Clock3 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* ====================================================
            TOP 3
        ==================================================== */}

        <Card className="mb-8 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">
              Top Performers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current highest-ranking participants in this
              competition.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {results.slice(0, 3).map((result) => (
              <div
                key={result.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <Medal className="h-6 w-6 text-yellow-600" />
                  </div>

                  <span className="text-2xl font-bold text-slate-300">
                    #{result.rank}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {result.participantName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {result.teamName}
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Score
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {result.score}
                      <span className="text-sm text-slate-400">
                        /{result.totalPoints}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Accuracy
                    </p>

                    <p className="mt-1 font-semibold text-green-600">
                      {Math.round(
                        (result.correctAnswers /
                          result.totalQuestions) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <Card className="mb-8 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-xl">
              <Input
                placeholder="Search participant or team..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                leftIcon={
                  <Search className="h-4 w-4" />
                }
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "All",
                  "Completed",
                  "In Progress",
                  "Disqualified",
                ] as const
              ).map((status) => (
                <Button
                  key={status}
                  variant={
                    statusFilter === status
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setStatusFilter(status)
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* ====================================================
            RESULTS TABLE
        ==================================================== */}

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Participant Rankings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredResults.length} result
                  {filteredResults.length === 1 ? "" : "s"}.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">
                    Participant
                  </th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Accuracy</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((result) => (
                  <tr
                    key={result.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {result.rank <= 3 && (
                          <Medal className="h-4 w-4 text-yellow-500" />
                        )}

                        <span className="font-bold text-slate-900">
                          #{result.rank}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900">
                        {result.participantName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {result.submittedAt}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {result.teamName}
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-900">
                        {result.score}
                      </span>

                      <span className="text-sm text-slate-400">
                        /{result.totalPoints}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold text-slate-900">
                        {Math.round(
                          (result.correctAnswers /
                            result.totalQuestions) *
                            100,
                        )}
                        %
                      </span>

                      <p className="mt-1 text-xs text-slate-500">
                        {result.correctAnswers}/
                        {result.totalQuestions} correct
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {result.duration}
                    </td>

                    <td className="px-6 py-5">
                      <ResultStatusBadge
                        status={result.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-200 md:hidden">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {result.rank <= 3 && (
                        <Medal className="h-4 w-4 text-yellow-500" />
                      )}

                      <span className="font-bold text-slate-900">
                        #{result.rank}
                      </span>
                    </div>

                    <h3 className="mt-3 font-bold text-slate-900">
                      {result.participantName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {result.teamName}
                    </p>
                  </div>

                  <ResultStatusBadge
                    status={result.status}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Score
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {result.score}/{result.totalPoints}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Accuracy
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {Math.round(
                        (result.correctAnswers /
                          result.totalQuestions) *
                          100,
                      )}
                      %
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Correct
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {result.correctAnswers}/
                      {result.totalQuestions}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {result.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredResults.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No results found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </Card>

        {/* ====================================================
            RESULT RULE NOTE
        ==================================================== */}

        <Card className="mt-8 border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <h3 className="font-semibold text-amber-900">
                Ranking should be calculated by the backend
              </h3>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                Final ranking, score calculation, tie-breaking,
                disqualification and winner determination should
                always come from the backend. The frontend should
                only display the official competition results.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

/* ============================================================
   STATUS BADGE
   ============================================================ */

function ResultStatusBadge({
  status,
}: {
  status: ResultStatus;
}) {
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Completed
      </span>
    );
  }

  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock3 className="h-3.5 w-3.5" />
        In Progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      <XCircle className="h-3.5 w-3.5" />
      Disqualified
    </span>
  );
}
