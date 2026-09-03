







"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";


import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Flame,
  Gift,
  Lock,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  getAllActiveContests,
  type SolveAndWinContest,
} from "@/lib/api/solveAndWin";

/* ============================================================
   HELPERS
============================================================ */

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) => {
  if (!date) return "Not scheduled";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const getSubjectNames = (contest: SolveAndWinContest) => {
  return contest.subjects
    .map((subject) => {
      if (typeof subject.subjectId === "string") {
        return subject.subjectId;
      }

      return subject.subjectId?.name ?? "";
    })
    .filter(Boolean);
};

const getSubjectLabel = (contest: SolveAndWinContest) => {
  const names = getSubjectNames(contest);

  if (names.length === 0) {
    return "General";
  }

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return names.join(" & ");
  }

  return `${names[0]} + ${names.length - 1} more`;
};

const getSubjectCount = (contest: SolveAndWinContest) => {
  return contest.subjects.length;
};

const getQuestionCount = (contest: SolveAndWinContest) => {
  return contest.subjects.reduce(
    (total, subject) => total + (subject.questions?.length ?? 0),
    0,
  );
};

const getContestIcon = (contest: SolveAndWinContest) => {
  const names = getSubjectNames(contest).join(" ").toLowerCase();

  if (names.includes("mathematics")) {
    return Target;
  }

  if (
    names.includes("physics") ||
    names.includes("chemistry") ||
    names.includes("biology")
  ) {
    return Brain;
  }

  return Zap;
};

const getStatusLabel = (contest: SolveAndWinContest) => {
  switch (contest.status?.toUpperCase()) {
    case "DRAFT":
      return "Draft";

    case "UPCOMING":
      return "Upcoming";

    case "ACTIVE":
      return "Available";

    case "COMPLETED":
      return "Completed";

    case "CLOSED":
      return "Closed";

    case "REGISTRATION_OPEN":
      return "Registration Open";

    default:
      return contest.status || "Available";
  }
};

const isContestLocked = (contest: SolveAndWinContest) => {
  if (!contest.isActive) {
    return true;
  }

  const status = contest.status?.toUpperCase();

  if (
    status === "DRAFT" ||
    status === "COMPLETED" ||
    status === "CLOSED"
  ) {
    return true;
  }

  return false;
};

/* ============================================================
   PAGE
============================================================ */

export default function SolveAndWinPage() {
  /* ==========================================================
     STATE
  ========================================================== */

  const [contests, setContests] = useState<SolveAndWinContest[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  /* ==========================================================
     FETCH ACTIVE CONTESTS
  ========================================================== */

  const fetchContests = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAllActiveContests();

      console.log(
        "GET ALL ACTIVE CONTESTS RESPONSE:",
        response,
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to load active contests.",
        );
      }

      /*
       * IMPORTANT:
       *
       * Active contests endpoint returns:
       *
       * {
       *   success: true,
       *   message: "...",
       *   data: [...]
       * }
       *
       * Unlike the admin get-all-contests endpoint,
       * there is no:
       *
       * data.solveAndWinContestObj
       */

      setContests(response.data ?? []);
    } catch (err: unknown) {
      console.error(
        "Failed to fetch active Solve & Win contests:",
        err,
      );

      let message = "Failed to load Solve & Win contests.";

      if (err instanceof Error) {
        message = err.message;
      }

      const axiosError = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      };

      const backendMessage =
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error;

      if (backendMessage) {
        message = backendMessage;
      }

      setError(message);
      setContests([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     LOAD ON PAGE MOUNT
  ========================================================== */

  useEffect(() => {
    fetchContests();
  }, []);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="space-y-8">



{/* ========================================================
    HERO
======================================================== */}
<motion.section
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.5,
  }}
  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-10"
>
  <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

  <div className="relative z-10 max-w-3xl">
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-200 backdrop-blur">
      <Sparkles className="h-4 w-4" />
      Solve &amp; Win
    </div>

    <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
      Solve Questions.
      <br />
      Win Rewards.
    </h1>

    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
      Put your knowledge to work. Solve timed
      challenges, prove your skills and earn
      rewards as you climb your way to the top.
    </p>

   
   {/* ====================================================
        ACTIVE CONTEST CTA
    ===================================================== */}
    <div className="mt-7">
      <Link
        href="/student/solve-and-win/active"
        className="group inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-extrabold text-slate-950 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl sm:px-7 sm:py-4"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <Trophy className="h-5 w-5" />
        </span>

        <span className="flex flex-col items-start">
          <span className="text-sm sm:text-base">
            View Active Contests
          </span>

          <span className="text-xs font-medium text-slate-500">
            Join a live competition and start solving
          </span>
        </span>

        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>







    {/* ====================================================
        FEATURE BADGES
    ===================================================== */}
    <div className="mt-7 flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur">
        <Target className="h-4 w-4 text-blue-300" />
        Practice
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur">
        <Trophy className="h-4 w-4 text-amber-300" />
        Compete
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur">
        <Gift className="h-4 w-4 text-emerald-300" />
        Earn
      </div>
    </div>
  </div>
</motion.section>



      {/* ========================================================
          HOW IT WORKS
      ======================================================== */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            How Solve &amp; Win Works
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Turn your exam preparation into an
            opportunity to earn.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              number: "01",
              icon: BookOpen,
              title: "Choose a Contest",
              text: "Pick a contest that matches your subjects and interests.",
            },
            {
              number: "02",
              icon: Brain,
              title: "Solve the Questions",
              text: "Answer the competition questions and demonstrate your knowledge.",
            },
            {
              number: "03",
              icon: Gift,
              title: "Win Rewards",
              text: "Perform well and qualify for the available rewards.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + index * 0.08,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>

                  <span className="text-3xl font-black text-slate-100">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          CONTESTS
      ======================================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Contests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a contest and put your
              knowledge to the test.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <Flame className="h-4 w-4 text-orange-500" />

            {contests.length}{" "}
            {contests.length === 1
              ? "contest"
              : "contests"}
          </div>
        </div>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {isLoading && (
          <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

              <div>
                <p className="font-semibold text-slate-900">
                  Loading contests...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Please wait while we fetch the
                  latest Solve &amp; Win contests.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            ERROR
        ====================================================== */}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-red-900">
                  Unable to load contests
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchContests}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            EMPTY
        ====================================================== */}

        {!isLoading &&
          !error &&
          contests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <Trophy className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-bold text-slate-900">
                No contests available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are no Solve &amp; Win
                contests available at the moment.
                Check back soon for new contests.
              </p>
            </div>
          )}

        {/* ======================================================
            CONTEST GRID
        ====================================================== */}

        {!isLoading &&
          !error &&
          contests.length > 0 && (
            <div className="grid gap-5 xl:grid-cols-2">
              {contests.map((contest, index) => {
                const Icon = getContestIcon(contest);

                const locked = isContestLocked(contest);

                const subjectLabel =
                  getSubjectLabel(contest);

                const subjectCount =
                  getSubjectCount(contest);

                const questionCount =
                  getQuestionCount(contest);

                const reward =
                  contest.amountToBeWonInKobo / 100;

                return (
                  <motion.article
                    key={contest._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + index * 0.06,
                    }}
                    className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition ${
                      locked
                        ? "border-slate-200 opacity-80"
                        : "border-slate-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                    }`}
                  >
                    {/* Top */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>

                      {locked ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                          <Lock className="h-3.5 w-3.5" />

                          {getStatusLabel(contest)}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />

                          {getStatusLabel(contest)}
                        </div>
                      )}
                    </div>

                    {/* Content */}

                    <div className="mt-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                          {subjectLabel}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {contest.category}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-slate-900">
                        {contest.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {contest.description}
                      </p>
                    </div>

                    {/* Contest Stats */}

                    <div className="mt-5 grid grid-cols-3 gap-2 border-y border-slate-100 py-4">

                      {/* Subjects */}

                      <div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <BookOpen className="h-3.5 w-3.5" />

                          <span className="text-[11px]">
                            Subjects
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {subjectCount}
                        </p>
                      </div>

                      {/* Questions */}

                      <div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Brain className="h-3.5 w-3.5" />

                          <span className="text-[11px]">
                            Questions
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {questionCount}
                        </p>
                      </div>

                      {/* Entry */}

                      <div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Users className="h-3.5 w-3.5" />

                          <span className="text-[11px]">
                            Entry
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {contest.entryPoints.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Dates */}

                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">
                            Starts
                          </span>

                          <p className="mt-1 font-semibold text-slate-700">
                            {formatDate(
                              contest.startDate,
                            )}
                          </p>
                        </div>

                        <ArrowRight className="h-4 w-4 text-slate-300" />

                        <div className="text-right">
                          <span className="text-slate-400">
                            Ends
                          </span>

                          <p className="mt-1 font-semibold text-slate-700">
                            {formatDate(
                              contest.endDate,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reward */}

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Prize
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <Gift className="h-5 w-5 text-amber-500" />

                          <span className="text-xl font-extrabold text-slate-900">
                            {formatCurrency(reward)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          Entry:{" "}
                          {contest.entryPoints.toLocaleString()}{" "}
                          points
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={locked}
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                          locked
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-slate-900 text-white hover:bg-blue-600"
                        }`}
                      >
                        {locked
                          ? getStatusLabel(contest)
                          : "Enter Contest"}

                        {!locked && (
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        )}
                      </button>


                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
      </section>

      {/* ========================================================
          FAIR PLAY NOTICE
      ======================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.25,
        }}
        className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Medal className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h3 className="font-bold text-amber-900">
              Play fair. Learn more. Win more.
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-800/70">
              Solve contests independently.
              Your performance determines your
              eligibility for available rewards.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}