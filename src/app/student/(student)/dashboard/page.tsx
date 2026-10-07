


"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { QuickAction } from "@/components/dashboard/widgets/QuickActions";

import { QuickActions } from "@/components/dashboard/widgets";

import AccessBlocker from "@/components/access/AccessBlocker";
import FreeTrialCard from "@/components/access/FreeTrialCard";

import { useAuthStore } from "@/stores";

import { getAllQuizzes } from "@/lib/api/quizCompetition";
import { getAllNotCompletedContests } from "@/lib/api/solveAndWin";

import UpcomingQuiz from "@/components/dashboard/UpcomingQuiz";
import UpcomingAndWin from "@/components/dashboard/UpcomingAndWin";

/* =========================================================
   CONSTANTS
   ========================================================= */

const FREE_TRIAL_DAYS = 30;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

/*
 * Backend quiz statuses can vary depending on the
 * current stage of the competition.
 *
 * WAITING is the main upcoming status, but these
 * additional statuses are allowed if the quiz has
 * not started yet.
 */
const UPCOMING_QUIZ_STATUSES = new Set([
  "WAITING",
  "UPCOMING",
  "OPEN",
  "FULL",
]);

/* =========================================================
   TYPES
   ========================================================= */

interface QuizCompetition {
  _id: string;
  quiz_title: string;
  description?: string;
  status: string;

  subject?: {
    _id: string;
    name: string;
  } | null;

  time_per_question: number;
  start_date: string;
  no_of_contestants: number;
  number_of_rounds: number;

  joined_users?: string[];

  round_information?: {
    round_number?: number;
    no_of_questions?: number;

    difficultyBreakdown?: {
      easy?: number;
      medium?: number;
      hard?: number;
    };

    exit_number?: number;
    exit_reward?: number;
  }[];

  final_round_information?: {
    no_of_questions?: number;

    difficultyBreakdown?: {
      easy?: number;
      medium?: number;
      hard?: number;
    };

    first_position_reward?: number;
    second_position_reward?: number;
  };
}

interface QuizApiResponse {
  success?: boolean;
  message?: string;

  data?: {
    totalCount?: number;
    totalPages?: number;
    quizzesObj?: QuizCompetition[];
  };
}

interface SolveAndWinContest {
  _id: string;
  title: string;
  description?: string;
  category?: string;

  amountToBeWonInKobo: number;
  entryPoints: number;

  subjects?: {
    subjectId?: {
      _id?: string;
      name?: string;
    };

    expectedNoOfQuestions?: number;
    durationInSeconds?: number;

    difficultyBreakdown?: {
      easy?: number;
      medium?: number;
      hard?: number;
    };
  }[];

  status: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  windowPeriod?: number;
}

interface SolveAndWinApiResponse {
  success?: boolean;
  message?: string;

  data?: {
    solveAndWinContestObj?: SolveAndWinContest[];
    totalCount?: number;
    totalPages?: number;
  };
}

/* =========================================================
   PAGE
   ========================================================= */

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  /* =======================================================
     SECONDARY PLAN / FREE TRIAL
     ======================================================= */

  const hasSecondaryPlan =
    Array.isArray(user?.plans) &&
    user.plans.includes("SECONDARY");

  const trialEndsAt = useMemo(() => {
    if (!user?.createdAt) {
      return null;
    }

    const createdAt = new Date(
      user.createdAt,
    ).getTime();

    if (Number.isNaN(createdAt)) {
      return null;
    }

    return (
      createdAt +
      FREE_TRIAL_DAYS * MILLISECONDS_IN_DAY
    );
  }, [user?.createdAt]);

  const [remainingTime, setRemainingTime] =
    useState(() => {
      if (!trialEndsAt) {
        return 0;
      }

      return Math.max(
        0,
        trialEndsAt - Date.now(),
      );
    });

  useEffect(() => {
    if (hasSecondaryPlan || !trialEndsAt) {
      setRemainingTime(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        trialEndsAt - Date.now(),
      );

      setRemainingTime(remaining);
    };

    updateCountdown();

    const interval = window.setInterval(
      updateCountdown,
      1000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [hasSecondaryPlan, trialEndsAt]);

  const isFreeTrialActive =
    !hasSecondaryPlan &&
    trialEndsAt !== null &&
    remainingTime > 0;

  const hasSecondaryAccess =
    hasSecondaryPlan || isFreeTrialActive;

  /* =======================================================
     QUIZ COMPETITIONS
     ======================================================= */

  const [upcomingQuizzes, setUpcomingQuizzes] =
    useState<QuizCompetition[]>([]);

  const [quizzesLoading, setQuizzesLoading] =
    useState(true);

  const [quizzesError, setQuizzesError] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUpcomingQuizzes = async () => {
      try {
        setQuizzesLoading(true);
        setQuizzesError(false);

        console.log(
          "========== DASHBOARD QUIZ FETCH ==========",
        );

        const response =
          (await getAllQuizzes(
            1,
            10,
          )) as QuizApiResponse;

        console.log(
          "Quiz API response:",
          response,
        );

        if (!mounted) {
          return;
        }

        const quizzes =
          response?.data?.quizzesObj ?? [];

        console.log(
          "Total quizzes returned:",
          quizzes.length,
        );

        console.table(
          quizzes.map((quiz) => ({
            id: quiz._id,
            title: quiz.quiz_title,
            status: quiz.status,
            startDate: quiz.start_date,
            contestants: quiz.no_of_contestants,
            joinedUsers:
              Array.isArray(
                quiz.joined_users,
              )
                ? quiz.joined_users.length
                : 0,
          })),
        );

        const now = Date.now();

        const upcoming = quizzes
          .filter((quiz) => {
            if (!quiz?.start_date) {
              return false;
            }

            const startDate = new Date(
              quiz.start_date,
            ).getTime();

            if (Number.isNaN(startDate)) {
              return false;
            }

            const normalizedStatus =
              String(quiz.status ?? "")
                .trim()
                .toUpperCase();

            const hasNotStarted =
              startDate > now;

            const hasUpcomingStatus =
              UPCOMING_QUIZ_STATUSES.has(
                normalizedStatus,
              );

            return (
              hasNotStarted &&
              hasUpcomingStatus
            );
          })
          .sort(
            (a, b) =>
              new Date(
                a.start_date,
              ).getTime() -
              new Date(
                b.start_date,
              ).getTime(),
          );

        console.log(
          "Upcoming quizzes after filtering:",
          upcoming.length,
        );

        console.table(
          upcoming.map((quiz) => ({
            id: quiz._id,
            title: quiz.quiz_title,
            status: quiz.status,
            startDate: quiz.start_date,
          })),
        );

        console.log(
          "==========================================",
        );

        setUpcomingQuizzes(upcoming);
      } catch (error) {
        console.error(
          "Failed to fetch upcoming quizzes:",
          error,
        );

        if (mounted) {
          setUpcomingQuizzes([]);
          setQuizzesError(true);
        }
      } finally {
        if (mounted) {
          setQuizzesLoading(false);
        }
      }
    };

    fetchUpcomingQuizzes();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     PREPARE UPCOMING QUIZ COMPETITIONS
     ======================================================= */

  const competitions = useMemo(() => {
    return upcomingQuizzes.map((quiz) => {
      const startDate = new Date(
        quiz.start_date,
      );

      const joinedCount =
        Array.isArray(quiz.joined_users)
          ? quiz.joined_users.length
          : 0;

      /* =====================================================
         ELIMINATION ROUND REWARDS
         ===================================================== */

      const eliminationRoundRewards =
        quiz.round_information?.reduce(
          (total, round) => {
            return (
              total +
              Number(
                round?.exit_reward ?? 0,
              )
            );
          },
          0,
        ) ?? 0;

      /* =====================================================
         FINAL POSITION REWARDS
         ===================================================== */

      const firstPositionReward = Number(
        quiz.final_round_information
          ?.first_position_reward ?? 0,
      );

      const secondPositionReward = Number(
        quiz.final_round_information
          ?.second_position_reward ?? 0,
      );

      /* =====================================================
         TOTAL CBT POINTS AVAILABLE
         ===================================================== */

      const totalCbtPoints =
        eliminationRoundRewards +
        firstPositionReward +
        secondPositionReward;

      return {
        id: quiz._id,

        title: quiz.quiz_title,

        date: startDate.toLocaleDateString(
          "en-NG",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        ),

        time: startDate.toLocaleTimeString(
          "en-NG",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          },
        ),

        teams: joinedCount,

        status: "Upcoming" as const,

        href: `/student/quiz-board/${quiz._id}`,

        prize: `${totalCbtPoints} CBT Points`,

        entryFee: "FREE",

        contestants:
          quiz.no_of_contestants,

        subject:
          quiz.subject?.name || "General",
      };
    });
  }, [upcomingQuizzes]);

  /* =======================================================
     SOLVE & WIN CONTESTS
     ======================================================= */

  const [
    solveAndWinContests,
    setSolveAndWinContests,
  ] = useState<SolveAndWinContest[]>([]);

  const [
    solveAndWinLoading,
    setSolveAndWinLoading,
  ] = useState(true);

  const [
    solveAndWinError,
    setSolveAndWinError,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchSolveAndWinContests =
      async () => {
        try {
          setSolveAndWinLoading(true);
          setSolveAndWinError(false);

          console.log(
            "======= DASHBOARD SOLVE & WIN FETCH =======",
          );

          const response =
            (await getAllNotCompletedContests()) as SolveAndWinApiResponse;

          console.log(
            "Solve & Win API response:",
            response,
          );

          if (!mounted) {
            return;
          }

          const contests =
            response?.data
              ?.solveAndWinContestObj ?? [];

          console.log(
            "Total Solve & Win contests returned:",
            contests.length,
          );

          console.table(
            contests.map((contest) => ({
              id: contest._id,
              title: contest.title,
              status: contest.status,
              isActive: contest.isActive,
              startDate: contest.startDate,
              endDate: contest.endDate,
              entryPoints:
                contest.entryPoints,
            })),
          );

          console.log(
            "===========================================",
          );

          setSolveAndWinContests(
            contests,
          );
        } catch (error) {
          console.error(
            "Failed to fetch Solve & Win contests:",
            error,
          );

          if (mounted) {
            setSolveAndWinContests([]);
            setSolveAndWinError(true);
          }
        } finally {
          if (mounted) {
            setSolveAndWinLoading(false);
          }
        }
      };

    fetchSolveAndWinContests();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     QUICK ACTIONS
     ======================================================= */

  const actions: QuickAction[] = [
    {
      title: "CBT Wallet",
      description:
        "Manage your CBT points",
      href: "/student/practice/cbt-wallet",
      icon: "wallet",
    },

    {
  title: "Solve & Win Cash",
  // description: "Earn While You Learn",
  href: "#",
  icon: "trophy",
  comingSoon: true,
},

    {
      title: "Learning Arena",
      description:
        "Learn through guided lessons",
      href: "/student/arena",
      icon: "play",
    },

    {
      title: "Past Questions Mode",
      description:
        "Practice Past Questions",
      href: "/student/practice",
      icon: "book",
    },
  ];

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ==================================================
          BACKGROUND
          ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0) 70%)",
          }}
        />

        <div
          className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(2,6,23,0.95) 100%)",
          }}
        />

      </div>

      {/* ==================================================
          CONTENT
          ================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="space-y-8">

          {/* ==================================================
              WELCOME
              ================================================== */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

            <div>

              <p className="text-sm font-medium text-indigo-300">
                Student Dashboard
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Continue your preparation,
                practice consistently, and climb
                the national leaderboard.
              </p>

            </div>

          </section>

          {/* ==================================================
              ACCESS BLOCKER
              ================================================== */}

          {!hasSecondaryAccess && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">

              <AccessBlocker
                onSecondaryClick={() =>
                  router.push(
                    "/student/access/secondary",
                  )
                }
              />

            </div>
          )}

          {/* ==================================================
              QUICK ACTIONS
              ================================================== */}

          <section>

            <QuickActions
              title="Quick Actions"
              actions={actions}
              locked={!hasSecondaryAccess}
            />

          </section>

          {/* ==================================================
              UPCOMING QUIZ COMPETITIONS
              ================================================== */}

          <section>

            {quizzesLoading ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex items-center justify-between">

                  <div className="h-6 w-56 animate-pulse rounded-lg bg-white/10" />

                  <div className="h-4 w-20 animate-pulse rounded bg-white/5" />

                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >

                      <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />

                      <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/5" />

                      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-white/5" />

                      <div className="mt-5 flex gap-3">

                        <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10" />

                        <div className="h-9 w-20 animate-pulse rounded-xl bg-white/5" />

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            ) : quizzesError ? (
              <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-6">

                <p className="text-sm font-medium text-red-400">
                  Unable to load upcoming quiz
                  competitions.
                </p>

                <p className="mt-1 text-xs text-red-400/60">
                  Please refresh the page and try
                  again.
                </p>

              </div>
            ) : competitions.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <span className="text-lg">
                      🏆
                    </span>
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-white">
                      Upcoming Quiz Competitions
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      There are no upcoming quiz
                      competitions available right now.
                    </p>

                  </div>

                </div>

              </div>
            ) : (
              <UpcomingQuiz
                title="Upcoming Quiz Competitions"
                competitions={competitions}
              />
            )}

          </section>



          

          {/* ==================================================
              SOLVE & WIN
              ================================================== */}


              


          {/* ==================================================
              PERFORMANCE + RECENT ACTIVITY
              ================================================== */}

          <section className="grid gap-6 lg:grid-cols-2">

            {/* =================================================
                PERFORMANCE OVERVIEW
                ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">

              <div className="mb-6">

                <h2 className="text-xl font-bold text-white">
                  Performance Overview
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Track your learning and
                  competition progress.
                </p>

              </div>

              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">

                <div className="text-center">

                  <p className="text-sm font-medium text-slate-300">
                    Performance analytics
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your detailed performance
                    chart will appear here.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                RECENT ACTIVITY
                ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">

              <div className="mb-6">

                <h2 className="text-xl font-bold text-white">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your latest learning and
                  competition activity.
                </p>

              </div>

              <div className="space-y-4">

                <div className="flex items-start gap-3">

                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-white">
                      Completed Mathematics Practice
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Today • 92%
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400" />

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-white">
                      Joined August Challenge
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Yesterday
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400" />

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-white">
                      Team Invitation Accepted
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      2 days ago
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-white">
                      Moved to Rank #18
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      This Week
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

      {/* ==================================================
          FREE TRIAL BANNER
          ================================================== */}

      {isFreeTrialActive && (
        <FreeTrialCard
          createdAt={user?.createdAt}
        />
      )}

    </main>
  );
}









          // <section>

          //   {solveAndWinLoading ? (
          //     <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          //       <div className="flex items-center justify-between">

          //         <div className="h-6 w-56 animate-pulse rounded-lg bg-white/10" />

          //         <div className="h-4 w-20 animate-pulse rounded bg-white/5" />

          //       </div>

          //       <div className="mt-5 grid gap-4 md:grid-cols-2">

          //         {[1, 2].map((item) => (
          //           <div
          //             key={item}
          //             className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          //           >

          //             <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />

          //             <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/5" />

          //             <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-white/5" />

          //             <div className="mt-5 flex gap-3">

          //               <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10" />

          //               <div className="h-9 w-20 animate-pulse rounded-xl bg-white/5" />

          //             </div>

          //           </div>
          //         ))}

          //       </div>

          //     </div>
          //   ) : solveAndWinError ? (
          //     <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-6">

          //       <p className="text-sm font-medium text-red-400">
          //         Unable to load Solve & Win
          //         contests.
          //       </p>

          //       <p className="mt-1 text-xs text-red-400/60">
          //         Please refresh the page and try
          //         again.
          //       </p>

          //     </div>
          //   ) : solveAndWinContests.length === 0 ? (
          //     <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          //       <div className="flex items-start gap-4">

          //         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          //           <span className="text-lg">
          //             🏆
          //           </span>
          //         </div>

          //         <div>

          //           <h2 className="text-lg font-bold text-white">
          //             Solve & Win Upcoming
          //           </h2>

          //           <p className="mt-1 text-sm leading-6 text-slate-500">
          //             There are no Solve & Win
          //             contests available right now.
          //           </p>

          //         </div>

          //       </div>

          //     </div>
          //   ) : (
          //     <UpcomingAndWin
          //       title="Solve & Win Upcoming"
          //       contests={solveAndWinContests.map(
          //         (contest) => ({
          //           id: contest._id,

          //           title: contest.title,

          //           description:
          //             contest.description,

          //           category:
          //             contest.category,

          //           amountToBeWonInKobo:
          //             contest.amountToBeWonInKobo,

          //           entryPoints:
          //             contest.entryPoints,

          //           status:
          //             contest.status,

          //           isActive:
          //             contest.isActive,

          //           startDate:
          //             contest.startDate,

          //           endDate:
          //             contest.endDate,

          //           windowPeriod:
          //             contest.windowPeriod,

          //           subject:
          //             contest.subjects?.[0]
          //               ?.subjectId?.name ||
          //             "General",

          //           href:
          //             "/student/solve-and-win",
          //         }),
          //       )}
          //     />
          //   )}

          // </section>