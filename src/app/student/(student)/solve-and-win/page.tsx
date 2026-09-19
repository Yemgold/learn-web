


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  Loader2,
  Lock,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getAllNotCompletedContests,
  type SolveAndWinContest,
} from "@/lib/api/solveAndWin";

import { axiosInstance } from "@/lib/api/axios";

/* =========================================================
   TYPES
========================================================= */

interface PracticeWallet {
  practicePoints?: number;
  balance?: number;
  points?: number;
  totalPoints?: number;
  [key: string]: unknown;
}

interface PracticeWalletResponse {
  data?: PracticeWallet | Record<string, unknown>;
  practiceWallet?: PracticeWallet;
  wallet?: PracticeWallet;
  practicePoints?: number;
  balance?: number;
  points?: number;
  totalPoints?: number;
  [key: string]: unknown;
}

interface AuthUser {
  _id?: string;
  id?: string;
  userId?: string;
}

interface ContestSubject {
  subjectId?:
    | string
    | {
        _id?: string;
        name?: string;
      };
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

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(
  value: number | undefined | null,
) {
  const amount = Number(value ?? 0);

  return `₦${amount.toLocaleString("en-NG")}`;
}

/**
 * Gets the currently authenticated user's ID from
 * common localStorage locations used by the application.
 */
function getCurrentUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const keys = [
    "user",
    "auth-user",
    "jamb_user",
    "jamb_auth_user",
  ];

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(
        raw,
      ) as AuthUser | null;

      if (!parsed) {
        continue;
      }

      const userId =
        parsed._id ||
        parsed.id ||
        parsed.userId;

      if (userId) {
        return String(userId);
      }
    } catch {
      // Continue checking other storage keys.
    }
  }

  return null;
}

/**
 * Extract contests from the backend response.
 *
 * Current expected response:
 *
 * {
 *   success: true,
 *   data: {
 *     totalCount: 5,
 *     totalPages: 1,
 *     solveAndWinContestObj: [...]
 *   }
 * }
 */
function extractContests(
  response: unknown,
): SolveAndWinContest[] {
  if (Array.isArray(response)) {
    return response as SolveAndWinContest[];
  }

  if (
    !response ||
    typeof response !== "object"
  ) {
    return [];
  }

  const root =
    response as Record<string, unknown>;

  /* =======================================================
     response.data.solveAndWinContestObj
  ======================================================= */

  if (
    root.data &&
    typeof root.data === "object" &&
    !Array.isArray(root.data)
  ) {
    const data =
      root.data as Record<string, unknown>;

    if (
      Array.isArray(
        data.solveAndWinContestObj,
      )
    ) {
      return data.solveAndWinContestObj as SolveAndWinContest[];
    }

    const nestedArrays = [
      data.contests,
      data.contestObj,
      data.contestObjects,
      data.results,
      data.items,
      data.data,
    ];

    for (const value of nestedArrays) {
      if (Array.isArray(value)) {
        return value as SolveAndWinContest[];
      }
    }
  }

  /* =======================================================
     root.solveAndWinContestObj
  ======================================================= */

  if (
    Array.isArray(
      root.solveAndWinContestObj,
    )
  ) {
    return root.solveAndWinContestObj as SolveAndWinContest[];
  }

  /* =======================================================
     Other possible root arrays
  ======================================================= */

  const possibleArrays = [
    root.contests,
    root.contestObj,
    root.contestObjects,
    root.results,
    root.items,
  ];

  for (const value of possibleArrays) {
    if (Array.isArray(value)) {
      return value as SolveAndWinContest[];
    }
  }

  /* =======================================================
     response.response.data.solveAndWinContestObj
  ======================================================= */

  if (
    root.response &&
    typeof root.response === "object" &&
    !Array.isArray(root.response)
  ) {
    const nested =
      root.response as Record<string, unknown>;

    if (
      nested.data &&
      typeof nested.data === "object" &&
      !Array.isArray(nested.data)
    ) {
      const nestedData =
        nested.data as Record<string, unknown>;

      if (
        Array.isArray(
          nestedData.solveAndWinContestObj,
        )
      ) {
        return nestedData.solveAndWinContestObj as SolveAndWinContest[];
      }
    }
  }

  return [];
}

/**
 * Extract practice points from different possible
 * wallet response shapes.
 */
function getWalletPoints(
  response: unknown,
): number {
  if (
    !response ||
    typeof response !== "object"
  ) {
    return 0;
  }

  const root =
    response as Record<string, unknown>;

  const candidates: unknown[] = [
    root.practicePoints,
    root.points,
    root.balance,
    root.totalPoints,
  ];

  if (
    root.data &&
    typeof root.data === "object" &&
    !Array.isArray(root.data)
  ) {
    const data =
      root.data as Record<string, unknown>;

    candidates.push(
      data.practicePoints,
      data.points,
      data.balance,
      data.totalPoints,
    );
  }

  if (
    root.practiceWallet &&
    typeof root.practiceWallet === "object"
  ) {
    const wallet =
      root.practiceWallet as Record<string, unknown>;

    candidates.push(
      wallet.practicePoints,
      wallet.points,
      wallet.balance,
      wallet.totalPoints,
    );
  }

  if (
    root.wallet &&
    typeof root.wallet === "object"
  ) {
    const wallet =
      root.wallet as Record<string, unknown>;

    candidates.push(
      wallet.practicePoints,
      wallet.points,
      wallet.balance,
      wallet.totalPoints,
    );
  }

  for (const value of candidates) {
    const numberValue = Number(value);

    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return 0;
}

/* =========================================================
   CONTEST HELPERS
========================================================= */

function getSubjects(
  contest: SolveAndWinContest,
): ContestSubject[] {
  const record =
    contest as unknown as Record<string, unknown>;

  if (!Array.isArray(record.subjects)) {
    return [];
  }

  return record.subjects as ContestSubject[];
}

function getSubjectNames(
  contest: SolveAndWinContest,
): string[] {
  const subjects = getSubjects(contest);

  return subjects
    .map((subject) => {
      if (
        !subject ||
        typeof subject !== "object"
      ) {
        return "";
      }

      const subjectId =
        subject.subjectId;

      if (
        subjectId &&
        typeof subjectId === "object"
      ) {
        return String(
          subjectId.name ??
            subject.name ??
            subject.subjectName ??
            "",
        );
      }

      if (
        typeof subjectId === "string"
      ) {
        return subjectId;
      }

      return String(
        subject.name ??
          subject.subjectName ??
          "",
      );
    })
    .filter(Boolean);
}

function getSubjectLabel(
  contest: SolveAndWinContest,
): string {
  const subjects =
    getSubjectNames(contest);

  if (subjects.length === 0) {
    return "Multiple Subjects";
  }

  if (subjects.length === 1) {
    return subjects[0];
  }

  return `${subjects.length} Subjects`;
}

function getSubjectCount(
  contest: SolveAndWinContest,
): number {
  return (
    getSubjectNames(contest).length || 1
  );
}

function getTotalQuestions(
  contest: SolveAndWinContest,
): number {
  const subjects =
    getSubjects(contest);

  return subjects.reduce(
    (total, subject) =>
      total +
      Number(
        subject.expectedNoOfQuestions ?? 0,
      ),
    0,
  );
}

function getDurationInSeconds(
  contest: SolveAndWinContest,
): number {
  const subjects =
    getSubjects(contest);

  return subjects.reduce(
    (total, subject) =>
      total +
      Number(
        subject.durationInSeconds ?? 0,
      ),
    0,
  );
}

function getDurationInMinutes(
  contest: SolveAndWinContest,
): number {
  const seconds =
    getDurationInSeconds(contest);

  if (seconds <= 0) {
    return 0;
  }

  return Math.ceil(seconds / 60);
}

function getDifficultyBreakdown(
  contest: SolveAndWinContest,
) {
  const subjects =
    getSubjects(contest);

  return subjects.reduce(
    (total, subject) => {
      total.easy += Number(
        subject.difficultyBreakdown?.easy ??
          0,
      );

      total.medium += Number(
        subject.difficultyBreakdown?.medium ??
          0,
      );

      total.hard += Number(
        subject.difficultyBreakdown?.hard ??
          0,
      );

      return total;
    },
    {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  );
}

function getContestIcon(
  contest: SolveAndWinContest,
) {
  const subjects =
    getSubjectNames(contest)
      .join(" ")
      .toLowerCase();

  if (subjects.includes("biology")) {
    return "🧬";
  }

  if (subjects.includes("chemistry")) {
    return "⚗️";
  }

  if (subjects.includes("physics")) {
    return "⚛️";
  }

  if (
    subjects.includes("mathematics") ||
    subjects.includes("math")
  ) {
    return "📐";
  }

  if (subjects.includes("english")) {
    return "📚";
  }

  return "🏆";
}

function getStatusLabel(
  contest: SolveAndWinContest,
): string {
  const status = String(
    (
      contest as unknown as Record<
        string,
        unknown
      >
    ).status ?? "",
  ).toUpperCase();

  switch (status) {
    case "UPCOMING":
      return "Upcoming";

    case "ACTIVE":
      return "Live Now";

    case "ONGOING":
      return "Live Now";

    case "COMPLETED":
      return "Completed";

    case "CLOSED":
      return "Closed";

    default:
      return status || "Available";
  }
}

function isContestLocked(
  contest: SolveAndWinContest,
  practicePoints: number,
) {
  const entryPoints = Number(
    (
      contest as unknown as Record<
        string,
        unknown
      >
    ).entryPoints ?? 0,
  );

  return practicePoints < entryPoints;
}

/* =========================================================
   PAGE
========================================================= */

export default function SolveAndWinPage() {
  const [contests, setContests] =
    useState<SolveAndWinContest[]>([]);

  const [practicePoints, setPracticePoints] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isWalletLoading, setIsWalletLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [walletError, setWalletError] =
    useState("");

  /* =======================================================
     FETCH CONTESTS
  ======================================================= */

  const fetchContests = async () => {
    try {
      setError("");

      const response =
        await getAllNotCompletedContests();

      console.log(
        "Solve & Win contests API response:",
        response,
      );

      const extractedContests =
        extractContests(response);

      console.log(
        "Solve & Win extracted contests:",
        extractedContests,
      );

      setContests(extractedContests);
    } catch (err) {
      console.error(
        "Failed to load Solve & Win contests:",
        err,
      );

      setContests([]);

      setError(
        "Unable to load competitions. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     FETCH PRACTICE WALLET
  ======================================================= */

  const fetchPracticeWallet = async () => {
    try {
      setIsWalletLoading(true);
      setWalletError("");

      const userId =
        getCurrentUserId();

      if (!userId) {
        setPracticePoints(0);
        return;
      }

      const response =
        await axiosInstance.get<PracticeWalletResponse>(
          `/practice-wallet/get-user-practice-wallet/${userId}`,
        );

      console.log(
        "Practice wallet API response:",
        response.data,
      );

      const points =
        getWalletPoints(response.data);

      setPracticePoints(points);
    } catch (err) {
      console.error(
        "Failed to load practice wallet:",
        err,
      );

      setPracticePoints(0);

      setWalletError(
        "Unable to load your practice points.",
      );
    } finally {
      setIsWalletLoading(false);
    }
  };

  /* =======================================================
     LOAD PAGE
  ======================================================= */

  const fetchPageData = async () => {
    setIsLoading(true);

    await Promise.all([
      fetchContests(),
      fetchPracticeWallet(),
    ]);
  };

  useEffect(() => {
    void fetchPageData();
  }, []);

  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = () => {
    void fetchPageData();
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="border-b border-blue-500/20 bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-300">
                <Trophy className="h-4 w-4" />
                Solve & Win
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Compete. Learn. Win.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Test your JAMB knowledge, compete
                with other students, and earn rewards
                while you learn.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300">
                  <Users className="h-4 w-4 text-blue-400" />
                  Compete with students
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                  Practice JAMB questions
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  Earn rewards
                </div>

              </div>

            </div>

            {/* =================================================
                WALLET
            ================================================= */}

            <Card className="overflow-hidden border border-white/10 bg-white/[0.04] text-white shadow-none">

              <div className="p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-400">
                      Practice Points
                    </p>

                    {isWalletLoading ? (
                      <div className="mt-3 flex items-center gap-2">

                        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />

                        <span className="text-sm text-slate-400">
                          Loading...
                        </span>

                      </div>
                    ) : (
                      <p className="mt-2 text-3xl font-bold text-white">
                        {practicePoints.toLocaleString(
                          "en-NG",
                        )}
                      </p>
                    )}

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                    <Coins className="h-6 w-6 text-blue-400" />
                  </div>

                </div>

                <div className="mt-6 border-t border-white/10 pt-4">

                  <p className="text-xs leading-5 text-slate-400">
                    Use your practice points to enter
                    eligible Solve & Win competitions.
                  </p>

                </div>

                {walletError && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">

                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>{walletError}</span>

                  </div>
                )}

              </div>

            </Card>

          </div>

        </div>
      </section>

      {/* =================================================
          CONTESTS
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Available Competitions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a competition and put your
              knowledge to the test.
            </p>

          </div>

          {/* =================================================
              HEADER ACTIONS
          ================================================= */}

          <div className="flex flex-wrap items-center gap-3">

            {!isLoading &&
              contests.length > 0 && (
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-slate-300">
                  {contests.length}{" "}
                  {contests.length === 1
                    ? "competition"
                    : "competitions"}
                </div>
              )}

            {/* =================================================
                MY CONTESTS BUTTON
            ================================================= */}

            <Link
              href="/student/solve-and-win/my-contests"
              className="shrink-0"
            >
              <Button
                type="button"
                variant="outline"
                className="border-blue-500/20 bg-blue-500/10 text-blue-300 hover:border-blue-500/30 hover:bg-blue-500/20 hover:text-blue-200"
              >
                <Trophy className="mr-2 h-4 w-4" />

                My Contests

                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && !isLoading && (
          <Card className="border-red-500/20 bg-red-500/10 shadow-none">

            <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-300" />
                </div>

                <div>

                  <h3 className="font-semibold text-red-300">
                    Unable to load competitions
                  </h3>

                  <p className="mt-1 text-sm text-red-300/80">
                    {error}
                  </p>

                </div>

              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleRetry}
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
              >
                Try Again
              </Button>

            </div>

          </Card>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="overflow-hidden border-white/10 bg-white/[0.04] shadow-none"
              >

                <div className="animate-pulse p-6">

                  <div className="flex items-center justify-between">

                    <div className="h-12 w-12 rounded-xl bg-white/[0.08]" />

                    <div className="h-6 w-20 rounded-full bg-white/[0.08]" />

                  </div>

                  <div className="mt-6 h-6 w-3/4 rounded bg-white/[0.08]" />

                  <div className="mt-3 h-4 w-full rounded bg-white/[0.08]" />

                  <div className="mt-2 h-4 w-2/3 rounded bg-white/[0.08]" />

                  <div className="mt-6 grid grid-cols-2 gap-3">

                    <div className="h-16 rounded-lg bg-white/[0.06]" />

                    <div className="h-16 rounded-lg bg-white/[0.06]" />

                  </div>

                  <div className="mt-6 h-10 rounded-lg bg-white/[0.08]" />

                </div>

              </Card>
            ))}

          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!isLoading &&
          !error &&
          contests.length === 0 && (
            <Card className="border-dashed border-white/10 bg-white/[0.03] shadow-none">

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <Trophy className="h-8 w-8 text-slate-500" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  No competitions available
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  There are currently no available
                  competitions. Please check again later.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">

                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                    onClick={handleRetry}
                  >
                    Refresh
                  </Button>

                  <Link href="/student/solve-and-win/my-contests">

                    <Button
                      type="button"
                      className="bg-blue-600 text-white hover:bg-blue-500"
                    >
                      <Trophy className="mr-2 h-4 w-4" />

                      My Contests

                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                  </Link>

                </div>

              </div>

            </Card>
          )}

        {/* =================================================
            CONTEST LIST
        ================================================= */}

        {!isLoading &&
          !error &&
          contests.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {contests.map(
                (contest, index) => {

                  const contestRecord =
                    contest as SolveAndWinContest & {
                      title?: string;
                      description?: string;
                      category?: string;
                    };

                  const contestId =
                    String(
                      contestRecord._id ?? "",
                    );

                  const entryPoints =
                    Number(
                      contestRecord.entryPoints ??
                        0,
                    );

                  const durationMinutes =
                    getDurationInMinutes(
                      contest,
                    );

                  const totalQuestions =
                    getTotalQuestions(
                      contest,
                    );

                  const difficulty =
                    getDifficultyBreakdown(
                      contest,
                    );

                  const locked =
                    isContestLocked(
                      contest,
                      practicePoints,
                    );

                  const statusLabel =
                    getStatusLabel(
                      contest,
                    );

                  const subjectLabel =
                    getSubjectLabel(
                      contest,
                    );

                  const subjectCount =
                    getSubjectCount(
                      contest,
                    );

                  const prizeAmount =
                    Number(
                      contestRecord.amountToBeWonInKobo ??
                        0,
                    ) / 100;

                  return (
                    <motion.div
                      key={
                        contestId || index
                      }
                      initial={{
                        opacity: 0,
                        y: 12,
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

                      <Card className="h-full overflow-hidden border-white/10 bg-white/[0.04] shadow-none transition-all hover:border-blue-500/20">

                        <div className="p-6">

                          {/* TOP */}

                          <div className="flex items-start justify-between gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-2xl">
                              {getContestIcon(
                                contest,
                              )}
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  statusLabel ===
                                  "Live Now"
                                    ? "bg-green-400"
                                    : "bg-slate-500"
                                }`}
                              />

                              {statusLabel}

                            </span>

                          </div>

                          {/* TITLE */}

                          <div className="mt-5">

                            <h3 className="line-clamp-2 text-lg font-bold text-white">
                              {contestRecord.title ??
                                "Solve & Win Competition"}
                            </h3>

                            <p className="mt-2 text-sm font-medium capitalize text-blue-400">
                              {subjectLabel}
                            </p>

                            {contestRecord.description && (
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                {
                                  contestRecord.description
                                }
                              </p>
                            )}

                          </div>

                          {/* PRIZE */}

                          {prizeAmount > 0 && (
                            <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/10">
                                  <Trophy className="h-5 w-5 text-yellow-400" />
                                </div>

                                <div>

                                  <p className="text-xs font-medium text-yellow-200/70">
                                    Prize Pool
                                  </p>

                                  <p className="mt-0.5 text-lg font-bold text-yellow-300">
                                    {formatCurrency(
                                      prizeAmount,
                                    )}
                                  </p>

                                </div>

                              </div>

                            </div>
                          )}

                          {/* STATS */}

                          <div className="mt-5 grid grid-cols-2 gap-3">

                            <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">

                              <div className="flex items-center gap-2 text-slate-500">
                                <BookOpen className="h-4 w-4" />

                                <span className="text-xs">
                                  Subjects
                                </span>
                              </div>

                              <p className="mt-1 text-sm font-semibold capitalize text-white">
                                {subjectCount}
                              </p>

                            </div>

                            <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">

                              <div className="flex items-center gap-2 text-slate-500">
                                <Clock3 className="h-4 w-4" />

                                <span className="text-xs">
                                  Duration
                                </span>
                              </div>

                              <p className="mt-1 text-sm font-semibold text-white">
                                {durationMinutes >
                                0
                                  ? `${durationMinutes} min`
                                  : "Timed"}
                              </p>

                            </div>

                            <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">

                              <div className="flex items-center gap-2 text-slate-500">
                                <CheckCircle2 className="h-4 w-4" />

                                <span className="text-xs">
                                  Questions
                                </span>
                              </div>

                              <p className="mt-1 text-sm font-semibold text-white">
                                {totalQuestions >
                                0
                                  ? totalQuestions
                                  : "—"}
                              </p>

                            </div>

                            <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">

                              <div className="flex items-center gap-2 text-slate-500">
                                <Coins className="h-4 w-4" />

                                <span className="text-xs">
                                  Entry
                                </span>
                              </div>

                              <p className="mt-1 text-sm font-semibold text-white">
                                {entryPoints.toLocaleString(
                                  "en-NG",
                                )}{" "}
                                pts
                              </p>

                            </div>

                          </div>

                          {/* DIFFICULTY */}

                          {(difficulty.easy >
                            0 ||
                            difficulty.medium >
                              0 ||
                            difficulty.hard >
                              0) && (
                            <div className="mt-5 rounded-lg border border-white/5 bg-white/[0.03] p-4">

                              <p className="text-xs font-medium text-slate-500">
                                Difficulty
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">

                                {difficulty.easy >
                                  0 && (
                                  <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-300">
                                    Easy{" "}
                                    {
                                      difficulty.easy
                                    }
                                  </span>
                                )}

                                {difficulty.medium >
                                  0 && (
                                  <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-300">
                                    Medium{" "}
                                    {
                                      difficulty.medium
                                    }
                                  </span>
                                )}

                                {difficulty.hard >
                                  0 && (
                                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
                                    Hard{" "}
                                    {
                                      difficulty.hard
                                    }
                                  </span>
                                )}

                              </div>

                            </div>
                          )}

                          {/* ENTRY STATUS */}

                          <div className="mt-5">

                            {locked ? (
                              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">

                                <div className="flex items-start gap-3">

                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                                    <Lock className="h-4 w-4 text-amber-300" />
                                  </div>

                                  <div>

                                    <p className="text-sm font-semibold text-amber-300">
                                      More practice points
                                      needed
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-200/70">
                                      You have{" "}
                                      <strong className="text-amber-200">
                                        {practicePoints.toLocaleString(
                                          "en-NG",
                                        )}
                                      </strong>{" "}
                                      points. You need{" "}
                                      <strong className="text-amber-200">
                                        {entryPoints.toLocaleString(
                                          "en-NG",
                                        )}
                                      </strong>{" "}
                                      to enter.
                                    </p>

                                  </div>

                                </div>

                              </div>
                            ) : (
                              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">

                                <div className="flex items-center gap-3">

                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />

                                  <div>

                                    <p className="text-sm font-semibold text-green-300">
                                      You can enter this
                                      competition
                                    </p>

                                    <p className="mt-1 text-xs text-green-200/70">
                                      Your practice points
                                      are sufficient.
                                    </p>

                                  </div>

                                </div>

                              </div>
                            )}

                          </div>

                          {/* ACTION */}

                          <div className="mt-5">

                            {locked ? (
                              <Link
                                href="/student/practice"
                                className="block"
                              >
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />

                                  Practice & Earn
                                  Points
                                </Button>
                              </Link>
                            ) : (
                              <Link
                                href={`/student/solve-and-win/contests/${contestId}/join`}
                                className="block"
                              >
                                <Button
                                  type="button"
                                  className="w-full bg-blue-600 text-white hover:bg-blue-500"
                                >
                                  Join Contest

                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            )}

                          </div>

                        </div>

                      </Card>

                    </motion.div>
                  );
                },
              )}

            </div>
          )}

      </section>

      {/* =================================================
          FAIR PLAY
      ================================================= */}

      <section className="border-t border-white/10 bg-slate-950">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
              <Trophy className="h-6 w-6 text-blue-400" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-white">
              Fair Play. Real Learning.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Solve & Win is designed to help you
              improve your JAMB performance while
              competing fairly with other students.
              Focus on learning, answering questions
              honestly, and improving your score.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}
