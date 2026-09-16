





// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\student\(student)\solve-and-win\my-contests\page.tsx

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  FileQuestion,
  Loader2,
  PlayCircle,
  RefreshCw,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getMyJoinedContests } from "@/lib/api/solveAndWin";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ContestSubject {
  subjectId?: string | { _id?: string; name?: string };
  name?: string;
  subjectName?: string;
  expectedNoOfQuestions?: number;
  durationInSeconds?: number;
  difficultyBreakdown?: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
}

interface Contest {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  entryPoints?: number;
  amountToBeWonInKobo?: number;

  subjects?: ContestSubject[] | string[];

  noOfContestants?: number;
  numberOfContestants?: number;
  maxParticipants?: number;

  totalQuestions?: number;
  durationInSeconds?: number;

  [key: string]: unknown;
}

interface Participation {
  _id?: string;
  id?: string;

  contestId?: string;

  contest?: Contest;

  userId?: string;

  subjects?: ContestSubject[];

  totalQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;

  score?: number;
  percentage?: number;

  pointsSpent?: number;

  durationInSeconds?: number;
  remainingDurationInSeconds?: number;

  status?: string;

  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  submittedAt?: string;

  [key: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/* User                                                                       */
/* -------------------------------------------------------------------------- */

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKeys = [
    "user",
    "auth-user",
    "jamb_user",
    "jamb_auth_user",
  ];

  for (const key of storageKeys) {
    try {
      const storedUser = localStorage.getItem(key);

      if (!storedUser) {
        continue;
      }

      const parsed = JSON.parse(storedUser);

      if (typeof parsed === "string" && parsed.trim()) {
        return parsed;
      }

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        const user = parsed as Record<string, unknown>;

        const userId =
          user._id ??
          user.id ??
          user.userId ??
          (
            user.user &&
            typeof user.user === "object"
              ? (user.user as Record<string, unknown>)._id ??
                (user.user as Record<string, unknown>).id
              : undefined
          );

        if (userId) {
          return String(userId);
        }
      }
    } catch {
      // Try the next storage key.
    }
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* Response Helpers                                                           */
/* -------------------------------------------------------------------------- */

function extractArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const obj = value as Record<string, unknown>;

  const possibleKeys = [
    "contestParticipationObj",
    "participations",
    "participationObj",
    "contestParticipations",
    "results",
    "items",
    "data",
  ];

  for (const key of possibleKeys) {
    const candidate = obj[key];

    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (
      candidate &&
      typeof candidate === "object"
    ) {
      const nested = extractArray(candidate);

      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
}

function extractParticipations(
  response: unknown
): Participation[] {
  return extractArray(response).filter(
    (item): item is Participation =>
      Boolean(
        item &&
          typeof item === "object"
      )
  );
}

/* -------------------------------------------------------------------------- */
/* Contest Helpers                                                            */
/* -------------------------------------------------------------------------- */

function getContestFromParticipation(
  participation: Participation
): Contest | null {
  if (
    participation.contest &&
    typeof participation.contest === "object"
  ) {
    return participation.contest;
  }

  const raw =
    participation as Record<string, unknown>;

  const possibleContest =
    raw.contest ||
    raw.contestData ||
    raw.contestDetails ||
    raw.solveAndWinContest;

  if (
    possibleContest &&
    typeof possibleContest === "object"
  ) {
    return possibleContest as Contest;
  }

  return null;
}

function getContestId(
  participation: Participation
): string {
  const contest =
    getContestFromParticipation(
      participation
    );

  return String(
    participation.contestId ||
      contest?._id ||
      contest?.id ||
      ""
  );
}

function getSubjects(
  contest: Contest | null
): ContestSubject[] {
  if (
    !contest?.subjects ||
    !Array.isArray(contest.subjects)
  ) {
    return [];
  }

  return contest.subjects.map(
    (subject) => {
      if (typeof subject === "string") {
        return {
          name: subject,
        };
      }

      return subject;
    }
  );
}

function getSubjectNames(
  contest: Contest | null
): string[] {
  return getSubjects(contest)
    .map((subject) => {
      if (
        subject.subjectId &&
        typeof subject.subjectId === "object"
      ) {
        return (
          subject.subjectId.name ||
          subject.name ||
          subject.subjectName ||
          ""
        );
      }

      return (
        subject.name ||
        subject.subjectName ||
        String(
          subject.subjectId || ""
        )
      );
    })
    .filter(Boolean);
}

function getTotalQuestions(
  participation: Participation,
  contest: Contest | null
): number {
  return (
    Number(
      participation.totalQuestions
    ) ||
    Number(
      contest?.totalQuestions
    ) ||
    getSubjects(contest).reduce(
      (total, subject) =>
        total +
        Number(
          subject.expectedNoOfQuestions ||
            0
        ),
      0
    )
  );
}

function getDurationInSeconds(
  participation: Participation,
  contest: Contest | null
): number {
  return (
    Number(
      participation.durationInSeconds
    ) ||
    Number(
      contest?.durationInSeconds
    ) ||
    getSubjects(contest).reduce(
      (total, subject) =>
        total +
        Number(
          subject.durationInSeconds ||
            0
        ),
      0
    )
  );
}

function formatDuration(
  seconds: number
): string {
  if (!seconds || seconds <= 0) {
    return "—";
  }

  const minutes = Math.round(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function getContestIcon(
  subjectNames: string[]
): string {
  const subject =
    subjectNames
      .join(" ")
      .toLowerCase();

  if (subject.includes("biology")) {
    return "🧬";
  }

  if (subject.includes("chemistry")) {
    return "⚗️";
  }

  if (subject.includes("physics")) {
    return "⚛️";
  }

  if (
    subject.includes("mathematics") ||
    subject.includes("math")
  ) {
    return "📐";
  }

  if (subject.includes("english")) {
    return "📚";
  }

  return "🏆";
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

function getStatus(
  status?: string
) {
  const normalized =
    String(status || "").toUpperCase();

  if (
    normalized === "COMPLETED" ||
    normalized === "SUBMITTED" ||
    normalized === "FINISHED"
  ) {
    return {
      label: "Completed",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      icon: CheckCircle2,
    };
  }

  if (
    normalized === "ACTIVE" ||
    normalized === "ONGOING" ||
    normalized === "IN_PROGRESS" ||
    normalized === "STARTED"
  ) {
    return {
      label: "In Progress",
      className:
        "border-blue-500/30 bg-blue-500/10 text-blue-300",
      icon: PlayCircle,
    };
  }

  if (
    normalized === "CANCELLED" ||
    normalized === "CLOSED"
  ) {
    return {
      label: "Closed",
      className:
        "border-red-500/30 bg-red-500/10 text-red-300",
      icon: XCircle,
    };
  }

  return {
    label: "Joined",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
    icon: Trophy,
  };
}

function isCompletedStatus(
  status?: string
): boolean {
  return [
    "COMPLETED",
    "SUBMITTED",
    "FINISHED",
  ].includes(
    String(status || "").toUpperCase()
  );
}

function isInProgressStatus(
  status?: string
): boolean {
  return [
    "ACTIVE",
    "ONGOING",
    "IN_PROGRESS",
    "STARTED",
  ].includes(
    String(status || "").toUpperCase()
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function MyContestsPage() {
  const [
    participations,
    setParticipations,
  ] = useState<Participation[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Fetch                                                                    */
  /* ------------------------------------------------------------------------ */

  const fetchMyContests =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError("");

        const userId =
          getCurrentUserId();

        if (!userId) {
          throw new Error(
            "Your user session could not be found. Please log in again."
          );
        }

        const response =
          await getMyJoinedContests(
            userId
          );

        console.log(
          "My joined Solve & Win contests:",
          response
        );

        const results =
          extractParticipations(
            response
          );

        setParticipations(results);
      } catch (error: unknown) {
        console.error(
          "Failed to load my joined contests:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your contests. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void fetchMyContests();
  }, [fetchMyContests]);

  /* ------------------------------------------------------------------------ */
  /* Summary                                                                  */
  /* ------------------------------------------------------------------------ */

  const summary = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let pointsSpent = 0;

    participations.forEach(
      (participation) => {
        if (
          isCompletedStatus(
            participation.status
          )
        ) {
          completed++;
        }

        if (
          isInProgressStatus(
            participation.status
          )
        ) {
          inProgress++;
        }

        pointsSpent += Number(
          participation.pointsSpent ||
            0
        );
      }
    );

    return {
      total: participations.length,
      completed,
      inProgress,
      pointsSpent,
    };
  }, [participations]);

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mb-8">
          <Link
            href="/student/solve-and-win"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solve & Win
          </Link>
        </div>

        {/* Header */}
        <motion.section
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <Trophy className="h-4 w-4" />
            My Contests
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                My Contests
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage the Solve & Win
                competitions you have joined.
                Continue an active contest or
                review your completed results.
              </p>
            </div>

            <Button
              onClick={() =>
                void fetchMyContests()
              }
              disabled={isLoading}
              variant="outline"
              className="w-full border-slate-700 bg-slate-900 text-white hover:bg-slate-800 md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}

              Refresh
            </Button>
          </div>
        </motion.section>

        {/* Summary */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={
              <Trophy className="h-5 w-5" />
            }
            label="My Contests"
            value={summary.total}
          />

          <SummaryCard
            icon={
              <PlayCircle className="h-5 w-5" />
            }
            label="In Progress"
            value={
              summary.inProgress
            }
          />

          <SummaryCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Completed"
            value={
              summary.completed
            }
          />

          <SummaryCard
            icon={
              <Coins className="h-5 w-5" />
            }
            label="Points Spent"
            value={summary.pointsSpent.toLocaleString()}
          />
        </section>

        {/* Error */}
        {error && !isLoading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div className="flex-1">
                <h2 className="font-semibold text-red-200">
                  Unable to load your contests
                </h2>

                <p className="mt-1 text-sm text-red-300/80">
                  {error}
                </p>

                <Button
                  onClick={() =>
                    void fetchMyContests()
                  }
                  className="mt-4 bg-red-500 text-white hover:bg-red-600"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-[390px] animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
              />
            ))}
          </section>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          participations.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <Card className="border-slate-800 bg-slate-900/70 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
                  <Trophy className="h-8 w-8 text-indigo-400" />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  No joined contests yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  You have not joined a
                  Solve & Win competition
                  yet. Browse the available
                  competitions and choose one
                  to participate in.
                </p>

                <Link
                  href="/student/solve-and-win"
                  className="mt-6 inline-block"
                >
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                    Browse Competitions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}

        {/* Contest Cards */}
        {!isLoading &&
          !error &&
          participations.length > 0 && (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {participations.map(
                (
                  participation,
                  index
                ) => {
                  const contest =
                    getContestFromParticipation(
                      participation
                    );

                  const contestId =
                    getContestId(
                      participation
                    );

                  const subjectNames =
                    getSubjectNames(
                      contest
                    );

                  const totalQuestions =
                    getTotalQuestions(
                      participation,
                      contest
                    );

                  const duration =
                    getDurationInSeconds(
                      participation,
                      contest
                    );

                  const status =
                    getStatus(
                      participation.status
                    );

                  const StatusIcon =
                    status.icon;

                  const percentage =
                    Math.max(
                      0,
                      Math.min(
                        100,
                        Number(
                          participation.percentage ||
                            0
                        )
                      )
                    );

                  const completed =
                    isCompletedStatus(
                      participation.status
                    );

                  const inProgress =
                    isInProgressStatus(
                      participation.status
                    );

                  return (
                    <motion.div
                      key={
                        participation._id ||
                        participation.id ||
                        `${contestId}-${index}`
                      }
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05,
                      }}
                    >
                      <Card className="group flex h-full flex-col overflow-hidden border-slate-800 bg-slate-900/80 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40">
                        {/* Header */}
                        <div className="border-b border-slate-800 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">
                                {getContestIcon(
                                  subjectNames
                                )}
                              </div>

                              <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                  Solve & Win
                                </div>

                                <div className="mt-1 text-sm font-semibold text-slate-300">
                                  {subjectNames.length
                                    ? subjectNames.join(
                                        " • "
                                      )
                                    : "Competition"}
                                </div>
                              </div>
                            </div>

                            <div
                              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {status.label}
                            </div>
                          </div>

                          <h2 className="mt-5 line-clamp-2 text-lg font-bold leading-6 text-white">
                            {contest?.title ||
                              "Solve & Win Contest"}
                          </h2>

                          {contest?.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-400">
                              {
                                contest.description
                              }
                            </p>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-px border-b border-slate-800 bg-slate-800">
                          <Stat
                            icon={
                              <FileQuestion className="h-4 w-4" />
                            }
                            label="Questions"
                            value={
                              totalQuestions ||
                              "—"
                            }
                          />

                          <Stat
                            icon={
                              <Clock3 className="h-4 w-4" />
                            }
                            label="Duration"
                            value={formatDuration(
                              duration
                            )}
                          />

                          <Stat
                            icon={
                              <Coins className="h-4 w-4" />
                            }
                            label="Entry"
                            value={`${Number(
                              participation.pointsSpent ??
                                contest?.entryPoints ??
                                0
                            ).toLocaleString()} pts`}
                          />

                          <Stat
                            icon={
                              <Users className="h-4 w-4" />
                            }
                            label="Contestants"
                            value={
                              contest?.noOfContestants ||
                              contest?.numberOfContestants ||
                              contest?.maxParticipants ||
                              "—"
                            }
                          />
                        </div>

                        {/* Result / Progress */}
                        <div className="flex-1 p-5">
                          {completed ? (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">
                                  Final Score
                                </span>

                                <span className="text-lg font-black text-emerald-300">
                                  {Number(
                                    participation.score ||
                                      0
                                  ).toLocaleString()}
                                </span>
                              </div>

                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className="h-full rounded-full bg-emerald-500"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>

                              <div className="mt-2 flex justify-between text-xs">
                                <span className="text-slate-500">
                                  Performance
                                </span>

                                <span className="font-semibold text-emerald-300">
                                  {percentage.toFixed(
                                    1
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          ) : inProgress ? (
                            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">
                                  Contest Progress
                                </span>

                                <span className="text-sm font-bold text-blue-300">
                                  {percentage >
                                  0
                                    ? `${percentage.toFixed(
                                        0
                                      )}%`
                                    : "In progress"}
                                </span>
                              </div>

                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className="h-full rounded-full bg-blue-500"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-indigo-400" />

                                <span className="text-sm font-medium text-indigo-200">
                                  You have joined
                                  this contest.
                                </span>
                              </div>

                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                Enter the contest
                                when it is ready
                                to begin.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action */}
                        <div className="border-t border-slate-800 p-5">
                          {contestId ? (
                            <Link
                              href={`/student/solve-and-win/contests/${contestId}/start`}
                              className="block"
                            >
                              <Button
                                className={`w-full ${
                                  completed
                                    ? "bg-slate-800 text-white hover:bg-slate-700"
                                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                                }`}
                              >
                                {completed
                                  ? "View Contest"
                                  : inProgress
                                  ? "Continue Contest"
                                  : "Enter Contest"}

                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              disabled
                              className="w-full bg-slate-800 text-slate-500"
                            >
                              Contest Unavailable
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                }
              )}
            </section>
          )}

        {/* Bottom Navigation */}
        {!isLoading && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
            <Link href="/student/solve-and-win">
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Available Competitions
              </Button>
            </Link>

            <Link href="/student/practice">
              <Button
                variant="ghost"
                className="text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Practice & Earn Points
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          {icon}
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </div>

          <div className="mt-1 text-xl font-black text-white">
            {value}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat                                                                        */
/* -------------------------------------------------------------------------- */

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-slate-900/80 p-4">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </div>

      <div className="mt-1 text-sm font-bold text-slate-200">
        {value}
      </div>
    </div>
  );
}