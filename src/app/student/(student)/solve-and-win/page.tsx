



"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Gift,
  Lock,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getAllActiveContests,
  getMyJoinedContests,
  type SolveAndWinContest,
} from "@/lib/api/solveAndWin";

import { axiosInstance } from "@/lib/api/axios";

interface PracticeWallet {
  _id: string;
  userId: string;
  __v?: number;
  createdAt?: string;
  points: number;
  updatedAt?: string;
}

interface PracticeWalletResponse {
  success: boolean;
  message?: string;
  data: PracticeWallet;
}

interface AuthUser {
  _id?: string;
  id?: string;
}

function formatCurrency(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

function getSubjectNames(contest: SolveAndWinContest): string[] {
  if (!Array.isArray(contest.subjects)) {
    return [];
  }

  return contest.subjects.map((subject: any) => {
    if (typeof subject === "string") {
      return subject;
    }

    return (
      subject?.subjectId?.name ||
      subject?.name ||
      subject?.subjectName ||
      "Subject"
    );
  });
}

function getSubjectLabel(contest: SolveAndWinContest) {
  const subjects = getSubjectNames(contest);

  if (subjects.length === 0) {
    return "Multiple Subjects";
  }

  if (subjects.length === 1) {
    return subjects[0];
  }

  return `${subjects[0]} +${subjects.length - 1}`;
}

function getSubjectCount(contest: SolveAndWinContest) {
  if (!Array.isArray(contest.subjects)) {
    return 0;
  }

  return contest.subjects.length;
}

function getContestIcon(index: number) {
  const icons = [Trophy, Medal, Target, Brain, Flame];
  return icons[index % icons.length];
}

function getStatusLabel(status?: string) {
  if (!status) return "Active";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isContestLocked(
  contest: SolveAndWinContest,
  practicePoints: number
) {
  return practicePoints < contest.entryPoints;
}

export default function SolveAndWinPage() {
  const [contests, setContests] = useState<SolveAndWinContest[]>([]);
  const [practicePoints, setPracticePoints] = useState(0);

  /**
   * Contest IDs that the current user has already joined.
   *
   * Example:
   * Set {
   *   "6a999b8a9e1b8dfd2a5dce75",
   *   "7b1234567890abcdef123456"
   * }
   */
  const [joinedContestIds, setJoinedContestIds] =
    useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  const [error, setError] = useState("");
  const [walletError, setWalletError] = useState("");

  /**
   * ============================================================
   * GET LOGGED-IN USER ID
   * ============================================================
   */
  const getCurrentUserId = (): string | null => {
    try {
      const possibleKeys = [
        "user",
        "auth-user",
        "jamb_user",
        "jamb_auth_user",
      ];

      for (const key of possibleKeys) {
        const storedUser = localStorage.getItem(key);

        if (!storedUser) continue;

        const parsedUser: AuthUser = JSON.parse(storedUser);

        const userId = parsedUser?._id || parsedUser?.id;

        if (userId) {
          return userId;
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to read authenticated user:", error);
      return null;
    }
  };

  /**
   * ============================================================
   * FETCH CONTESTS
   * ============================================================
   */
  const fetchContests = async () => {
    try {
      setError("");

      const response = await getAllActiveContests();

      if (!response.success) {
        throw new Error(
          response.message || "Unable to load active contests."
        );
      }

      setContests(response.data ?? []);
    } catch (err: any) {
      console.error("Failed to load contests:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load contests. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ============================================================
   * FETCH USER PRACTICE WALLET
   *
   * GET:
   * /practice-wallet/get-user-practice-wallet/{userId}
   * ============================================================
   */
  const fetchPracticeWallet = async () => {
    try {
      setIsWalletLoading(true);
      setWalletError("");

      const userId = getCurrentUserId();

      if (!userId) {
        throw new Error("Unable to identify the logged-in user.");
      }

      const response =
        await axiosInstance.get<PracticeWalletResponse>(
          `/practice-wallet/get-user-practice-wallet/${userId}`
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load your CBT Points."
        );
      }

      const wallet = response.data?.data;

      setPracticePoints(wallet?.points ?? 0);
    } catch (err: any) {
      console.error(
        "Failed to load user practice wallet:",
        err
      );

      setWalletError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your CBT Points."
      );

      setPracticePoints(0);
    } finally {
      setIsWalletLoading(false);
    }
  };


/**
 * ============================================================
 * FETCH USER'S JOINED CONTESTS
 *
 * API:
 * GET /contests/my-joined-contests/{userId}
 *
 * Actual response:
 *
 * {
 *   success: true,
 *   message: "User joined contest fetched successfully.",
 *   data: {
 *     totalCount: 1,
 *     totalPages: 1,
 *     contestParticipationObj: [
 *       {
 *         contestId: "..."
 *       }
 *     ]
 *   }
 * }
 * ============================================================
 */
const fetchJoinedContests = async () => {
  try {
    const userId = getCurrentUserId();

    if (!userId) {
      setJoinedContestIds(new Set());
      return;
    }

    const response = await getMyJoinedContests(userId);

    if (!response?.success) {
      throw new Error(
        response?.message || "Unable to load joined contests."
      );
    }

    /**
     * IMPORTANT:
     *
     * response.data is NOT the array.
     *
     * The actual array is:
     *
     * response.data.contestParticipationObj
     */
    const participations =
      response?.data?.contestParticipationObj ?? [];

    const ids = new Set<string>();

    for (const participation of participations) {
      if (!participation) continue;

      /**
       * Normal expected shape:
       *
       * {
       *   contestId: "6a999..."
       * }
       */
      if (participation.contestId) {
        ids.add(String(participation.contestId));
      }

      /**
       * Optional fallback in case the backend returns
       * the contest reference nested inside another object.
       */
      else if (participation.contest?._id) {
        ids.add(String(participation.contest._id));
      }
    }

    console.log(
      "Joined contest IDs:",
      Array.from(ids)
    );

    setJoinedContestIds(ids);
  } catch (err: any) {
    console.error(
      "Failed to load joined contests:",
      err
    );

    /**
     * Do not break the whole page if this request fails.
     */
    setJoinedContestIds(new Set());
  }
};
  


  /**
   * ============================================================
   * FETCH PAGE DATA
   * ============================================================
   */
  const fetchPageData = async () => {
    setIsLoading(true);

    await Promise.all([
      fetchContests(),
      fetchPracticeWallet(),
      fetchJoinedContests(),
    ]);
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ======================================================
          HERO
         ====================================================== */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
            {/* HERO CONTENT */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                  <Sparkles className="h-4 w-4" />
                  Practice. Compete. Win.
                </div>

                <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Solve & Win
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Put your knowledge to the test, compete with
                  other students, and stand a chance to win
                  exciting cash prizes.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                    Practice
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    Compete
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
                    <Gift className="h-4 w-4 text-emerald-400" />
                    Earn
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ==================================================
                PRACTICE WALLET
               ================================================== */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
            >
              <Card className="overflow-hidden border-white/10 bg-white/[0.04]">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                        <Wallet className="h-5 w-5 text-amber-400" />
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">
                          Your CBT Wallet
                        </p>

                        <h2 className="text-lg font-semibold text-white">
                          CBT Points
                        </h2>
                      </div>
                    </div>

                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>

                  <div className="mt-6">
                    {isWalletLoading ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading points...
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold tracking-tight">
                          {practicePoints.toLocaleString()}
                        </div>

                        <p className="mt-1 text-sm text-slate-400">
                          CBT Points available
                        </p>
                      </>
                    )}
                  </div>

                  {walletError ? (
                    <div className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 p-3">
                      <div className="flex gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                        <p className="text-xs leading-5 text-red-300">
                          {walletError}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-lg bg-white/[0.04] p-3">
                      <p className="text-xs leading-5 text-slate-400">
                        CBT Points are earned by answering
                        practice questions and are used to enter
                        Solve & Win competitions.
                      </p>
                    </div>
                  )}

                  <Link
                    href="/student/practice/cbtsubjects?exam=jamb"
                    className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Practice & Earn Points
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTESTS
         ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />

              <h2 className="text-2xl font-bold">
                Available Contests
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Use your CBT Points to enter competitions
              and compete for prizes.
            </p>
          </div>

          {/* CURRENT BALANCE */}
          <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm">
            <span className="text-slate-400">
              Your balance:
            </span>{" "}
            <span className="font-semibold text-amber-300">
              {isWalletLoading
                ? "..."
                : practicePoints.toLocaleString()}{" "}
              points
            </span>
          </div>
        </div>

        {/* ====================================================
            LOADING
           ==================================================== */}
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin" />

              <p>Loading contests...</p>
            </div>
          </div>
        ) : error ? (
          /* ==================================================
             ERROR
             ================================================== */
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-400" />

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load contests
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-red-200/80">
              {error}
            </p>

            <Button
              onClick={fetchPageData}
              variant="outline"
              className="mt-5 border-white/10 bg-white/5"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : contests.length === 0 ? (
          /* ==================================================
             EMPTY
             ================================================== */
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <Trophy className="mx-auto h-12 w-12 text-slate-600" />

            <h3 className="mt-4 text-lg font-semibold">
              No active contests
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Check back later for new Solve & Win competitions.
            </p>
          </div>
        ) : (
          /* ==================================================
             CONTEST GRID
             ================================================== */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {contests.map((contest, index) => {
              const ContestIcon = getContestIcon(index);

              const locked = isContestLocked(
                contest,
                practicePoints
              );

              /**
               * IMPORTANT:
               *
               * A student who has already joined must be able
               * to enter the contest even if their current
               * Practice Points are now below the entry fee.
               *
               * Therefore hasJoined takes priority over locked.
               */
              const hasJoined = joinedContestIds.has(
                String(contest._id)
              );

              const pointsNeeded = Math.max(
                contest.entryPoints - practicePoints,
                0
              );

              const subjectCount =
                getSubjectCount(contest);

              return (
                <motion.div
                  key={contest._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.05]">
                    {/* CARD HEADER */}
                    <div className="relative p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                            <ContestIcon className="h-6 w-6 text-purple-400" />
                          </div>

                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                              {getStatusLabel(
                                contest.status
                              )}
                            </span>

                            <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-white">
                              {contest.title}
                            </h3>
                          </div>
                        </div>

                        {hasJoined ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </div>
                        ) : locked ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                            <Lock className="h-4 w-4 text-red-400" />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </div>
                        )}
                      </div>

                      {contest.description && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">
                          {contest.description}
                        </p>
                      )}
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 border-y border-white/10">
                      <div className="p-4">
                        <p className="text-xs text-slate-500">
                          Prize
                        </p>

                        <p className="mt-1 font-semibold text-emerald-400">
                          {formatCurrency(
                            contest.amountToBeWonInKobo
                          )}
                        </p>
                      </div>

                      <div className="border-l border-white/10 p-4">
                        <p className="text-xs text-slate-500">
                          Entry
                        </p>

                        <p className="mt-1 font-semibold text-amber-400">
                          {contest.entryPoints.toLocaleString()}{" "}
                          points
                        </p>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="flex items-center gap-2 text-slate-400">
                            <BookOpen className="h-4 w-4 shrink-0" />
                            Subject
                          </span>

                          <span className="text-right font-medium text-slate-200">
                            {getSubjectLabel(contest)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-slate-400">
                            <Target className="h-4 w-4" />
                            Subjects
                          </span>

                          <span className="font-medium text-slate-200">
                            {subjectCount}
                          </span>
                        </div>
                      </div>

                      {/* ENTRY REQUIREMENT */}
                      <div
                        className={`mt-5 rounded-xl border p-4 ${
                          hasJoined
                            ? "border-emerald-400/20 bg-emerald-500/10"
                            : locked
                              ? "border-red-400/20 bg-red-500/10"
                              : "border-emerald-400/20 bg-emerald-500/10"
                        }`}
                      >
                        {hasJoined ? (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                              <p className="text-sm font-semibold text-emerald-300">
                                You have joined this contest
                              </p>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-emerald-200/70">
                              You are already registered. Enter
                              the contest when it is ready to
                              start.
                            </p>
                          </>
                        ) : locked ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-red-400" />

                              <p className="text-sm font-semibold text-red-300">
                                Not enough CBT Points
                              </p>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-red-200/70">
                              You need{" "}
                              <span className="font-semibold text-red-200">
                                {pointsNeeded.toLocaleString()}
                              </span>{" "}
                              more points to enter this
                              contest.
                            </p>
                          </>
                        ) : (
                          <>
                            {/* <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> */}

                              {/* <p className="text-sm font-semibold text-emerald-300">
                                You can enter this contest
                              </p> */}
                            {/* </div> */}

<div className="mt-3 flex items-center gap-2">
  <img
    src="/images/cash.png"
    alt="Cash prize"
    className="h-50 w-50 object-contain"
  />

                           {/* <p className="mt-1 text-xs leading-5 text-emerald-200/70">
                              Your{" "}
                              {practicePoints.toLocaleString()}{" "}
                              CBT Points cover the{" "}
                              {contest.entryPoints.toLocaleString()}{" "}
                              point entry fee.
                            </p> */}
                            </div>

                          </>

                        )}
                        
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="p-6 pt-0">
                      {hasJoined ? (
                        /**
                         * =================================================
                         * ALREADY JOINED
                         *
                         * Go directly to the contest START page.
                         * =================================================
                         */
                        <Link
                          href={`/student/solve-and-win/contests/${contest._id}/start`}
                          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                          Enter Contest
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ) : locked ? (
                        /**
                         * =================================================
                         * NOT JOINED + NOT ENOUGH POINTS
                         * =================================================
                         */
                        <Link
                          href="/student/practice/cbtsubjects?exam=jamb"
                          className="inline-flex h-10 w-full items-center justify-center rounded-md border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Practice & Earn Points
                        </Link>
                      ) : (
                        /**
                         * =================================================
                         * NOT JOINED + ENOUGH POINTS
                         * =================================================
                         */
                        <Link
                          href={`/student/solve-and-win/contests/${contest._id}/join`}
                          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                          Join Contest
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ======================================================
            FAIR PLAY
           ====================================================== */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <h3 className="font-semibold">
                Fair Play & Competition
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Every participant gets a fair chance. Answer
                questions carefully, follow the competition
                rules, and let your knowledge determine your
                score.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}