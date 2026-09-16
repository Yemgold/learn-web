




"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Loader2,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  joinQuizById,
  getQuizById,
} from "@/lib/api/quizCompetition";

import {
  getCurrentQuizBoardUserId,
} from "@/lib/quiz-board/user";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type DifficultyBreakdown = {
  easy?: number;
  medium?: number;
  hard?: number;
  [key: string]: unknown;
};

type QuizRound = {
  round?: number;
  round_number?: number;
  no_of_questions?: number;
  number_of_questions?: number;
  difficultyBreakdown?: DifficultyBreakdown;
  difficulty_breakdown?: DifficultyBreakdown;
  exit_number?: number;
  exit_reward?: number;
  [key: string]: unknown;
};

type FinalRoundInformation = {
  no_of_questions?: number;
  number_of_questions?: number;
  difficultyBreakdown?: DifficultyBreakdown;
  difficulty_breakdown?: DifficultyBreakdown;
  first_position_reward?: number;
  second_position_reward?: number;
  first_reward?: number;
  second_reward?: number;
  [key: string]: unknown;
};

type QuizSubject = {
  _id?: string;
  id?: string;
  name?: string;
  subjectName?: string;
  [key: string]: unknown;
};

type QuizJoinedUser = {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

type QuizCompetition = {
  _id: string;
  id?: string;

  quiz_title?: string;
  title?: string;

  description?: string;

  status?: string;

  subject?: QuizSubject | string | null;

  time_per_question?: number;
  timePerQuestion?: number;

  start_date?: string;
  startDate?: string;

  no_of_contestants?: number;
  max_contestants?: number;
  maxPlayers?: number;

  number_of_rounds?: number;

  round_information?: QuizRound[];

  final_round_information?: FinalRoundInformation;

  current_round?: number;

  room_id?: string | null;
  roomId?: string | null;

  /*
   * Backend may return:
   *
   * joined_users: ["userId"]
   *
   * OR:
   *
   * joined_users: [{ _id: "userId" }]
   */
  joined_users?: Array<string | QuizJoinedUser>;

  [key: string]: unknown;
};

type QuizApiResponse = {
  success?: boolean;
  message?: string;

  data?:
    | QuizCompetition
    | {
        quiz?: QuizCompetition;
        [key: string]: unknown;
      };
};

/* -------------------------------------------------------------------------- */
/* Default round configuration                                                */
/* -------------------------------------------------------------------------- */

const DEFAULT_ROUND_CONFIG = [
  {
    round: 1,
    title: "Opening Round",
    description:
      "All contestants compete in the opening round.",
  },
  {
    round: 2,
    title: "Elimination Round",
    description:
      "The fastest and most accurate contestants advance.",
  },
  {
    round: 3,
    title: "Pressure Round",
    description:
      "Competition intensifies as fewer contestants remain.",
  },
  {
    round: 4,
    title: "Semi-Final",
    description:
      "Only the top contestants qualify for the final.",
  },
  {
    round: 5,
    title: "Grand Final",
    description:
      "The finalists compete for the championship.",
  },
];

/* -------------------------------------------------------------------------- */
/* Extract quiz                                                               */
/* -------------------------------------------------------------------------- */

function extractQuiz(
  response: QuizApiResponse,
): QuizCompetition | null {
  const data = response?.data;

  if (!data) {
    return null;
  }

  if (
    typeof data === "object" &&
    "_id" in data
  ) {
    return data as QuizCompetition;
  }

  if (
    typeof data === "object" &&
    "quiz" in data &&
    data.quiz
  ) {
    return data.quiz as QuizCompetition;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

function formatStatus(status?: string) {
  const normalized = String(
    status || "DRAFT",
  ).toUpperCase();

  if (
    normalized === "LIVE" ||
    normalized === "ONGOING"
  ) {
    return {
      label: "LIVE",
      className:
        "border-red-500/20 bg-red-500/10 text-red-400",
      dot: "bg-red-400",
    };
  }

  if (
    normalized === "OPEN" ||
    normalized === "WAITING"
  ) {
    return {
      label: "OPEN",
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      dot: "bg-emerald-400",
    };
  }

  if (normalized === "COMPLETED") {
    return {
      label: "COMPLETED",
      className:
        "border-slate-500/20 bg-slate-500/10 text-slate-400",
      dot: "bg-slate-400",
    };
  }

  if (normalized === "CANCELLED") {
    return {
      label: "CANCELLED",
      className:
        "border-red-500/20 bg-red-500/10 text-red-400",
      dot: "bg-red-400",
    };
  }

  return {
    label: "UPCOMING",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  };
}

/* -------------------------------------------------------------------------- */
/* Questions                                                                  */
/* -------------------------------------------------------------------------- */

function getTotalQuestions(
  competition: QuizCompetition,
) {
  const eliminationQuestions =
    competition.round_information?.reduce(
      (total, round) =>
        total +
        Number(
          round.no_of_questions ??
            round.number_of_questions ??
            0,
        ),
      0,
    ) || 0;

  const finalQuestions = Number(
    competition.final_round_information
      ?.no_of_questions ??
      competition.final_round_information
        ?.number_of_questions ??
      0,
  );

  /*
   * If the API provides total questions directly,
   * use it when the round configuration is unavailable.
   */
  const directTotal = Number(
    competition.totalQuestions ??
      competition.total_questions ??
      0,
  );

  if (
    eliminationQuestions + finalQuestions > 0
  ) {
    return (
      eliminationQuestions +
      finalQuestions
    );
  }

  return directTotal;
}

/* -------------------------------------------------------------------------- */
/* Joined count                                                               */
/* -------------------------------------------------------------------------- */

function getJoinedCount(
  competition: QuizCompetition,
) {
  return Array.isArray(
    competition.joined_users,
  )
    ? competition.joined_users.length
    : 0;
}

/* -------------------------------------------------------------------------- */
/* Check whether current student already joined                               */
/* -------------------------------------------------------------------------- */

function hasUserJoined(
  competition: QuizCompetition,
  userId: string | null,
) {
  if (
    !userId ||
    !Array.isArray(
      competition.joined_users,
    )
  ) {
    return false;
  }

  return competition.joined_users.some(
    (user) => {
      /*
       * Backend response:
       *
       * joined_users: [
       *   "6a882e27b03aa8c1156b28a2"
       * ]
       */
      if (typeof user === "string") {
        return user === userId;
      }

      /*
       * Also support:
       *
       * {
       *   _id: "...",
       * }
       *
       * or:
       *
       * {
       *   userId: "..."
       * }
       */
      return (
        user?._id === userId ||
        user?.id === userId ||
        user?.userId === userId
      );
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Subject                                                                    */
/* -------------------------------------------------------------------------- */

function getSubjectName(
  competition: QuizCompetition,
) {
  if (
    competition.subject &&
    typeof competition.subject === "object"
  ) {
    return (
      competition.subject.name ||
      competition.subject.subjectName ||
      "General"
    );
  }

  if (
    typeof competition.subject === "string" &&
    competition.subject.trim()
  ) {
    /*
     * If backend only sends the subject MongoDB ID,
     * we don't display the raw ID as a subject name.
     */
    return "Subject";
  }

  return "General";
}

/* -------------------------------------------------------------------------- */
/* Round title                                                                */
/* -------------------------------------------------------------------------- */

function getRoundTitle(
  roundNumber: number,
) {
  return (
    DEFAULT_ROUND_CONFIG.find(
      (item) =>
        item.round === roundNumber,
    )?.title ||
    `Round ${roundNumber}`
  );
}

/* -------------------------------------------------------------------------- */
/* Round description                                                          */
/* -------------------------------------------------------------------------- */

function getRoundDescription(
  roundNumber: number,
) {
  return (
    DEFAULT_ROUND_CONFIG.find(
      (item) =>
        item.round === roundNumber,
    )?.description ||
    "Contestants compete to qualify for the next round."
  );
}

/* -------------------------------------------------------------------------- */
/* Difficulty                                                                 */
/* -------------------------------------------------------------------------- */

function formatDifficultyBreakdown(
  breakdown?: DifficultyBreakdown,
) {
  if (!breakdown) {
    return "Difficulty not specified";
  }

  const parts: string[] = [];

  if (
    breakdown.easy !== undefined
  ) {
    parts.push(
      `${breakdown.easy} Easy`,
    );
  }

  if (
    breakdown.medium !== undefined
  ) {
    parts.push(
      `${breakdown.medium} Medium`,
    );
  }

  if (
    breakdown.hard !== undefined
  ) {
    parts.push(
      `${breakdown.hard} Hard`,
    );
  }

  return parts.length > 0
    ? parts.join(" • ")
    : "Difficulty not specified";
}

/* -------------------------------------------------------------------------- */
/* Qualification sequence                                                    */
/* -------------------------------------------------------------------------- */

function getQualificationSequence(
  competition: QuizCompetition,
) {
  const startingPlayers = Number(
    competition.no_of_contestants ||
      competition.max_contestants ||
      competition.maxPlayers ||
      20,
  );

  const sequence = [
    startingPlayers,
  ];

  const rounds =
    competition.round_information ||
    [];

  rounds.forEach((round) => {
    const exitNumber = Number(
      round.exit_number,
    );

    if (
      Number.isFinite(exitNumber) &&
      exitNumber > 0 &&
      exitNumber <
        sequence[
          sequence.length - 1
        ]
    ) {
      sequence.push(exitNumber);
    }
  });

  if (
    competition.number_of_rounds &&
    competition.number_of_rounds > 1 &&
    !sequence.includes(2) &&
    sequence[
      sequence.length - 1
    ] > 2
  ) {
    sequence.push(2);
  }

  if (!sequence.includes(1)) {
    sequence.push(1);
  }

  return sequence;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function QuizCompetitionDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const quizId =
    params?.quizId as string;

  const [
    userId,
    setUserId,
  ] = useState<string | null>(null);

  const [
    competition,
    setCompetition,
  ] = useState<QuizCompetition | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    joining,
    setJoining,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Get current student                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const currentUserId =
      getCurrentQuizBoardUserId();

    setUserId(currentUserId);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Load competition                                                         */
  /* ------------------------------------------------------------------------ */

  const loadCompetition = async () => {
    if (!quizId) {
      setError(
        "Competition ID is missing.",
      );

      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response =
        (await getQuizById(
          quizId,
        )) as QuizApiResponse;

      const quiz =
        extractQuiz(response);

      if (!quiz) {
        throw new Error(
          "Unable to find this quiz competition.",
        );
      }

      setCompetition(quiz);
    } catch (err: any) {
      console.error(
        "Failed to load quiz competition:",
        err,
      );

      const message =
        err?.response?.data
          ?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to load this competition. Please try again.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCompetition();
  }, [quizId]);

  /* ------------------------------------------------------------------------ */
  /* Competition calculations                                                 */
  /* ------------------------------------------------------------------------ */

  const joinedCount = useMemo(
    () =>
      competition
        ? getJoinedCount(
            competition,
          )
        : 0,
    [competition],
  );

  const maxPlayers = Number(
    competition?.no_of_contestants ||
      competition?.max_contestants ||
      competition?.maxPlayers ||
      0,
  );

  const totalQuestions =
    competition
      ? getTotalQuestions(
          competition,
        )
      : 0;

  const qualificationSequence =
    competition
      ? getQualificationSequence(
          competition,
        )
      : [];

  const statusInfo =
    formatStatus(
      competition?.status,
    );

  /* ------------------------------------------------------------------------ */
  /* IMPORTANT: determine whether student has already joined                  */
  /* ------------------------------------------------------------------------ */

  const isJoined = useMemo(() => {
    if (
      !competition ||
      !userId
    ) {
      return false;
    }

    return hasUserJoined(
      competition,
      userId,
    );
  }, [
    competition,
    userId,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Player percentage                                                        */
  /* ------------------------------------------------------------------------ */

  const playerPercentage =
    maxPlayers > 0
      ? Math.min(
          100,
          Math.round(
            (joinedCount /
              maxPlayers) *
              100,
          ),
        )
      : 0;

  /* ------------------------------------------------------------------------ */
  /* Join / Enter Waiting Room                                                */
  /* ------------------------------------------------------------------------ */

  const handleJoin = async () => {
    if (!quizId) {
      setError(
        "Competition ID is missing.",
      );

      return;
    }

    /*
     * IMPORTANT:
     *
     * If the student has already joined,
     * do NOT call joinQuizById again.
     *
     * Just take the student to the waiting room.
     */
    if (isJoined) {
      router.push(
        `/student/quiz-board/${quizId}/waiting-room`,
      );

      return;
    }

    /*
     * Student has not joined yet.
     */
    try {
      setJoining(true);
      setError("");

      const response =
        await joinQuizById(
          quizId,
        );

      console.log(
        "Quiz joined successfully:",
        response,
      );

      router.push(
        `/student/quiz-board/${quizId}/waiting-room`,
      );
    } catch (err: any) {
      console.error(
        "Failed to join quiz:",
        err,
      );

      const message =
        err?.response?.data
          ?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to join this competition. Please try again.";

      setError(message);
    } finally {
      setJoining(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                   */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
            <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
          </div>

          <div>
            <h2 className="font-bold text-white">
              Loading Competition
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Getting the latest competition details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error without competition                                                */
  /* ------------------------------------------------------------------------ */

  if (
    error &&
    !competition
  ) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
            <Link
              href="/student/arena"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Quiz Board
            </Link>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <Card className="w-full max-w-lg border-red-500/20 bg-slate-900 text-white shadow-2xl">
            <div className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <AlertCircle className="h-7 w-7 text-red-400" />
              </div>

              <h1 className="mt-5 text-xl font-bold">
                Unable to Load Competition
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {error}
              </p>

              <Button
                type="button"
                onClick={() =>
                  void loadCompetition()
                }
                className="mt-6 rounded-xl bg-violet-600 px-6 font-bold hover:bg-violet-500"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (!competition) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/student/arena"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Quiz Board
            </Link>

            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${statusInfo.className}`}
            >
              <span
                className={`h-2 w-2 animate-pulse rounded-full ${statusInfo.dot}`}
              />

              <span className="text-xs font-semibold uppercase tracking-wide">
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15">
                <Trophy className="h-6 w-6 text-violet-400" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Quiz Board Competition
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Fastest correct answer wins the race
                </p>
              </div>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {competition.quiz_title ||
                  competition.title ||
                  "Quiz Board Competition"}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                {competition.description ||
                  "Compete against other JAMB students in a multi-round elimination competition. Answer quickly and accurately to qualify for the next round and become the final champion."}
              </p>
            </div>

            {/* Joined Players */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
                <Users className="h-4 w-4 text-blue-400" />

                <span className="text-sm font-semibold text-slate-300">
                  {joinedCount}/
                  {maxPlayers} joined
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
                <BookOpen className="h-4 w-4 text-violet-400" />

                <span className="text-sm font-semibold text-slate-300">
                  {getSubjectName(
                    competition,
                  )}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
                <Clock3 className="h-4 w-4 text-amber-400" />

                <span className="text-sm font-semibold text-slate-300">
                  {competition.time_per_question ||
                    competition.timePerQuestion ||
                    0}
                  s/question
                </span>
              </div>

              {/* Already joined indicator */}
              {isJoined && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                  <span className="text-sm font-semibold text-emerald-300">
                    You Joined
                  </span>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-400" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Subject
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {getSubjectName(
                        competition,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-cyan-400" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Players
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {joinedCount}/
                      {maxPlayers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-amber-400" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Time / Question
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {competition.time_per_question ||
                        competition.timePerQuestion ||
                        0}
                      s
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-violet-400" />

                  <div>
                    <p className="text-xs text-violet-300/70">
                      Entry
                    </p>

                    <p className="mt-1 font-bold text-violet-300">
                      Free
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Competition structure */}
            <Card className="border-slate-800 bg-slate-900 text-white shadow-xl">
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                      Competition Structure
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {maxPlayers} Players. One Champion.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Contestants are eliminated after each
                      round until only one champion remains.
                    </p>
                  </div>

                  <div className="hidden rounded-xl bg-violet-500/10 p-3 sm:block">
                    <Users className="h-6 w-6 text-violet-400" />
                  </div>
                </div>

                {/* Qualification sequence */}
                <div className="mt-7 flex flex-wrap items-center gap-2">
                  {qualificationSequence.map(
                    (
                      number,
                      index,
                    ) => (
                      <div
                        key={`${number}-${index}`}
                        className="flex items-center"
                      >
                        <div
                          className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 font-bold ${
                            index ===
                            qualificationSequence.length -
                              1
                              ? "border border-amber-400/30 bg-amber-400/10 text-amber-300"
                              : "border border-slate-700 bg-slate-950 text-white"
                          }`}
                        >
                          {number}
                        </div>

                        {index <
                          qualificationSequence.length -
                            1 && (
                          <span className="px-2 text-slate-600">
                            →
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>

                {/* Rounds */}
                <div className="mt-8 space-y-3">
                  {(
                    competition.round_information ||
                    []
                  ).map(
                    (
                      round,
                      index,
                    ) => {
                      const roundNumber =
                        index + 1;

                      const previousPlayers =
                        index === 0
                          ? maxPlayers
                          : Number(
                              competition
                                .round_information?.[
                                index -
                                  1
                              ]
                                ?.exit_number ||
                                maxPlayers,
                            );

                      const nextPlayers =
                        Number(
                          round.exit_number,
                        ) ||
                        Math.max(
                          1,
                          previousPlayers -
                            1,
                        );

                      const breakdown =
                        round.difficultyBreakdown ||
                        round.difficulty_breakdown;

                      const questions =
                        round.no_of_questions ??
                        round.number_of_questions ??
                        0;

                      return (
                        <div
                          key={`round-${roundNumber}`}
                          className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-black text-white">
                              {roundNumber}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-bold text-white">
                                  Round{" "}
                                  {roundNumber}:{" "}
                                  {getRoundTitle(
                                    roundNumber,
                                  )}
                                </h3>

                                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300">
                                  {previousPlayers}{" "}
                                  →{" "}
                                  {nextPlayers}
                                </span>
                              </div>

                              <p className="mt-1 text-sm leading-6 text-slate-500">
                                {getRoundDescription(
                                  roundNumber,
                                )}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                                  {questions}{" "}
                                  Questions
                                </span>

                                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
                                  {formatDifficultyBreakdown(
                                    breakdown,
                                  )}
                                </span>

                                {round.exit_reward !==
                                  undefined && (
                                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                    Exit Reward:{" "}
                                    {
                                      round.exit_reward
                                    }{" "}
                                    Points
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}

                  {/* Final round */}
                  {competition.final_round_information && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-sm font-black text-amber-300">
                          {competition.number_of_rounds ||
                            (competition.round_information
                              ?.length ||
                              0) + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-bold text-white">
                              Grand Final
                            </h3>

                            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                              2 → 1
                            </span>
                          </div>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            Two finalists compete for the
                            championship.
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                              {competition
                                .final_round_information
                                .no_of_questions ??
                                competition
                                  .final_round_information
                                  .number_of_questions ??
                                0}{" "}
                              Questions
                            </span>

                            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
                              {formatDifficultyBreakdown(
                                competition
                                  .final_round_information
                                  .difficultyBreakdown ||
                                  competition
                                    .final_round_information
                                    .difficulty_breakdown,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* How it works */}
            <Card className="border-slate-800 bg-slate-900 text-white shadow-xl">
              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                      How It Works
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Compete. Answer. Qualify.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      title:
                        "Join the competition",
                      text: "Join the competition to secure your place in the Quiz Board lobby.",
                    },
                    {
                      icon: Clock3,
                      title:
                        "Answer within the time limit",
                      text: `Each question gives you ${
                        competition.time_per_question ||
                        competition.timePerQuestion ||
                        0
                      } seconds.`,
                    },
                    {
                      icon: Zap,
                      title:
                        "Be fast and accurate",
                      text: "Correct answers and response speed determine qualification.",
                    },
                    {
                      icon: Crown,
                      title:
                        "Reach the final",
                      text: "Survive every elimination round and compete for the championship.",
                    },
                  ].map(
                    (item) => {
                      const Icon =
                        item.icon;

                      return (
                        <div
                          key={item.title}
                          className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                            <Icon className="h-5 w-5 text-violet-400" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-white">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </Card>

            {/* Final round */}
            <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-slate-900 to-amber-950/10 text-white shadow-xl">
              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                    <Crown className="h-6 w-6 text-amber-300" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                      Grand Final
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Two Players. One Winner.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                    <div className="flex items-center gap-3">
                      <Medal className="h-5 w-5 text-amber-400" />

                      <div>
                        <p className="text-xs text-slate-500">
                          First Place
                        </p>

                        <p className="mt-1 text-2xl font-black text-amber-300">
                          {competition
                            .final_round_information
                            ?.first_position_reward ??
                            competition
                              .final_round_information
                              ?.first_reward ??
                            0}{" "}
                          CBT Points
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-slate-300" />

                      <div>
                        <p className="text-xs text-slate-500">
                          Second Place
                        </p>

                        <p className="mt-1 text-2xl font-black text-slate-200">
                          {competition
                            .final_round_information
                            ?.second_position_reward ??
                            competition
                              .final_round_information
                              ?.second_reward ??
                            0}{" "}
                          CBT Points
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
                  <p className="text-sm leading-6 text-slate-400">
                    The final round determines the ultimate
                    Quiz Board champion. The contestant who
                    performs best according to the competition
                    rules takes first place.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <Card className="border-slate-800 bg-slate-900 text-white shadow-2xl">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      isJoined
                        ? "bg-emerald-500/10"
                        : "bg-violet-500/10"
                    }`}
                  >
                    {isJoined ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Trophy className="h-5 w-5 text-violet-400" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Competition Entry
                    </p>

                    <h2 className="mt-1 font-bold text-white">
                      {isJoined
                        ? "You are registered"
                        : "Ready to compete?"}
                    </h2>
                  </div>
                </div>

                {/* Joined message */}
                {isJoined && (
                  <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                      <div>
                        <p className="font-semibold text-emerald-300">
                          Competition joined
                        </p>

                        <p className="mt-1 text-xs leading-5 text-emerald-200/60">
                          Your place is already registered. Enter
                          the waiting room to prepare for the
                          competition.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/70">
                    Entry Fee
                  </p>

                  <p className="mt-2 text-4xl font-black text-violet-300">
                    Free
                  </p>
                </div>

                {/* Player capacity */}
                <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />

                      <span className="text-sm font-semibold text-slate-300">
                        {joinedCount}/
                        {maxPlayers}
                      </span>

                      <span className="text-xs text-slate-600">
                        joined
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {playerPercentage}% full
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${playerPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-500">
                      Subject
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {getSubjectName(
                        competition,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-500">
                      Capacity
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {maxPlayers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-500">
                      Joined
                    </span>

                    <span className="text-sm font-semibold text-blue-300">
                      {joinedCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-500">
                      Rounds
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {competition.number_of_rounds ||
                        0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-500">
                      Questions
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {totalQuestions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Time / Question
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {competition.time_per_question ||
                        competition.timePerQuestion ||
                        0}
                      s
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-5 flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                    <p className="text-sm leading-6 text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* MAIN ACTION                                                       */}
                {/* ---------------------------------------------------------------- */}

                <Button
                  type="button"
                  onClick={handleJoin}
                  disabled={
                    joining ||
                    !quizId ||
                    /*
                     * Only prevent a NON-JOINED student
                     * from clicking when the competition
                     * is full.
                     *
                     * Already joined students can ALWAYS
                     * enter the waiting room.
                     */
                    (!isJoined &&
                      maxPlayers > 0 &&
                      joinedCount >=
                        maxPlayers)
                  }
                  className={`mt-6 h-12 w-full rounded-xl font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isJoined
                      ? "bg-emerald-600 shadow-emerald-900/20 hover:bg-emerald-500"
                      : "bg-violet-600 shadow-violet-900/20 hover:bg-violet-500"
                  }`}
                >
                  {joining ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />

                      Joining Competition...
                    </>
                  ) : isJoined ? (
                    <>
                      <Trophy className="mr-2 h-5 w-5" />

                      Enter Waiting Room
                    </>
                  ) : maxPlayers > 0 &&
                    joinedCount >=
                      maxPlayers ? (
                    <>
                      <Users className="mr-2 h-5 w-5" />

                      Competition Full
                    </>
                  ) : (
                    <>
                      <Trophy className="mr-2 h-5 w-5" />

                      Join Competition
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />

                  <span>
                    {isJoined
                      ? "Your competition entry is already secured."
                      : "Your entry is secured by the competition system."}
                  </span>
                </div>
              </div>
            </Card>

            {/* Rules */}
            <Card className="mt-5 border-slate-800 bg-slate-900 text-white">
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />

                  <h3 className="font-semibold">
                    Competition Rules
                  </h3>
                </div>

                <ul className="mt-4 space-y-3">
                  {[
                    "Only registered contestants can participate.",
                    "Your response time may affect qualification.",
                    "Incorrect answers can affect your progress.",
                    "Contestants who fail to qualify are eliminated.",
                    "Do not leave the competition once it begins.",
                  ].map(
                    (rule) => (
                      <li
                        key={rule}
                        className="flex gap-2 text-xs leading-5 text-slate-500"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600" />

                        {rule}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </Card>
          </aside>
        </div>

        {/* Bottom notice */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />

            <div>
              <h3 className="font-semibold text-white">
                Before you join
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {isJoined
                  ? "You have already joined this competition. Enter the waiting room when you are ready."
                  : "Make sure you have a stable internet connection. Once you join, your entry will be registered for this competition."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



















// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   AlertCircle,
//   ArrowLeft,
//   Award,
//   BookOpen,
//   CheckCircle2,
//   Clock3,
//   Crown,
//   Loader2,
//   Medal,
//   ShieldCheck,
//   Sparkles,
//   Trophy,
//   Users,
//   Zap,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { joinQuizById, getQuizById } from "@/lib/api/quizCompetition";

// type DifficultyBreakdown = {
//   easy?: number;
//   medium?: number;
//   hard?: number;
// };

// type QuizRound = {
//   round?: number;
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   exit_number?: number;
//   exit_reward?: number;
// };

// type FinalRoundInformation = {
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   first_position_reward?: number;
//   second_position_reward?: number;
// };

// type QuizSubject = {
//   _id?: string;
//   name?: string;
// };

// type QuizCompetition = {
//   _id: string;
//   quiz_title?: string;
//   description?: string;
//   status?: string;
//   subject?: QuizSubject | null;
//   time_per_question?: number;
//   start_date?: string;
//   no_of_contestants?: number;
//   number_of_rounds?: number;
//   round_information?: QuizRound[];
//   final_round_information?: FinalRoundInformation;
//   current_round?: number;
//   room_id?: string | null;
//   joined_users?: unknown[];
// };

// type QuizApiResponse = {
//   success?: boolean;
//   message?: string;
//   data?: QuizCompetition | { quiz?: QuizCompetition };
// };

// const DEFAULT_ROUND_CONFIG = [
//   {
//     round: 1,
//     title: "Opening Round",
//     description: "All contestants compete in the opening round.",
//   },
//   {
//     round: 2,
//     title: "Elimination Round",
//     description: "The fastest and most accurate contestants advance.",
//   },
//   {
//     round: 3,
//     title: "Pressure Round",
//     description: "Competition intensifies as fewer contestants remain.",
//   },
//   {
//     round: 4,
//     title: "Semi-Final",
//     description: "Only the top contestants qualify for the final.",
//   },
//   {
//     round: 5,
//     title: "Grand Final",
//     description: "The finalists compete for the championship.",
//   },
// ];

// function extractQuiz(response: QuizApiResponse): QuizCompetition | null {
//   const data = response?.data;

//   if (!data) {
//     return null;
//   }

//   if ("_id" in data) {
//     return data as QuizCompetition;
//   }

//   if ("quiz" in data && data.quiz) {
//     return data.quiz;
//   }

//   return null;
// }

// function formatStatus(status?: string) {
//   const normalized = String(status || "DRAFT").toUpperCase();

//   if (normalized === "LIVE") {
//     return {
//       label: "LIVE",
//       className:
//         "border-red-500/20 bg-red-500/10 text-red-400",
//       dot: "bg-red-400",
//     };
//   }

//   if (normalized === "OPEN") {
//     return {
//       label: "OPEN",
//       className:
//         "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
//       dot: "bg-emerald-400",
//     };
//   }

//   if (normalized === "COMPLETED") {
//     return {
//       label: "COMPLETED",
//       className:
//         "border-slate-500/20 bg-slate-500/10 text-slate-400",
//       dot: "bg-slate-400",
//     };
//   }

//   if (normalized === "CANCELLED") {
//     return {
//       label: "CANCELLED",
//       className:
//         "border-red-500/20 bg-red-500/10 text-red-400",
//       dot: "bg-red-400",
//     };
//   }

//   return {
//     label: "UPCOMING",
//     className:
//       "border-amber-500/20 bg-amber-500/10 text-amber-400",
//     dot: "bg-amber-400",
//   };
// }

// function getTotalQuestions(competition: QuizCompetition) {
//   const eliminationQuestions =
//     competition.round_information?.reduce(
//       (total, round) => total + Number(round.no_of_questions || 0),
//       0,
//     ) || 0;

//   const finalQuestions = Number(
//     competition.final_round_information?.no_of_questions || 0,
//   );

//   return eliminationQuestions + finalQuestions;
// }

// function getJoinedCount(competition: QuizCompetition) {
//   return Array.isArray(competition.joined_users)
//     ? competition.joined_users.length
//     : 0;
// }

// function getSubjectName(competition: QuizCompetition) {
//   return competition.subject?.name || "General";
// }

// function getRoundTitle(roundNumber: number) {
//   return (
//     DEFAULT_ROUND_CONFIG.find((item) => item.round === roundNumber)?.title ||
//     `Round ${roundNumber}`
//   );
// }

// function getRoundDescription(roundNumber: number) {
//   return (
//     DEFAULT_ROUND_CONFIG.find((item) => item.round === roundNumber)
//       ?.description || "Contestants compete to qualify for the next round."
//   );
// }

// function formatDifficultyBreakdown(
//   breakdown?: DifficultyBreakdown,
// ) {
//   if (!breakdown) {
//     return "Difficulty not specified";
//   }

//   const parts: string[] = [];

//   if (breakdown.easy !== undefined) {
//     parts.push(`${breakdown.easy} Easy`);
//   }

//   if (breakdown.medium !== undefined) {
//     parts.push(`${breakdown.medium} Medium`);
//   }

//   if (breakdown.hard !== undefined) {
//     parts.push(`${breakdown.hard} Hard`);
//   }

//   return parts.length > 0
//     ? parts.join(" • ")
//     : "Difficulty not specified";
// }

// function getQualificationSequence(
//   competition: QuizCompetition,
// ) {
//   const startingPlayers = Number(
//     competition.no_of_contestants || 20,
//   );

//   const sequence = [startingPlayers];

//   const rounds = competition.round_information || [];

//   rounds.forEach((round) => {
//     const exitNumber = Number(round.exit_number);

//     if (
//       Number.isFinite(exitNumber) &&
//       exitNumber > 0 &&
//       exitNumber < sequence[sequence.length - 1]
//     ) {
//       sequence.push(exitNumber);
//     }
//   });

//   const finalPlayers =
//     sequence[sequence.length - 1] > 2 ? 2 : sequence[sequence.length - 1];

//   if (
//     competition.number_of_rounds &&
//     competition.number_of_rounds > 1 &&
//     !sequence.includes(2)
//   ) {
//     sequence.push(2);
//   }

//   if (!sequence.includes(1)) {
//     sequence.push(1);
//   }

//   return sequence;
// }

// export default function QuizCompetitionDetailsPage() {
//   const params = useParams();
//   const router = useRouter();

//   const quizId = params?.quizId as string;

//   const [competition, setCompetition] =
//     useState<QuizCompetition | null>(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [joining, setJoining] = useState(false);
//   const [error, setError] = useState("");

//   const loadCompetition = async () => {
//     if (!quizId) {
//       setError("Competition ID is missing.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError("");

//       const response = (await getQuizById(
//         quizId,
//       )) as QuizApiResponse;

//       const quiz = extractQuiz(response);

//       if (!quiz) {
//         throw new Error(
//           "Unable to find this quiz competition.",
//         );
//       }

//       setCompetition(quiz);
//     } catch (err: any) {
//       console.error(
//         "Failed to load quiz competition:",
//         err,
//       );

//       const message =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err?.message ||
//         "Unable to load this competition. Please try again.";

//       setError(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCompetition();
//   }, [quizId]);

//   const joinedCount = useMemo(
//     () => (competition ? getJoinedCount(competition) : 0),
//     [competition],
//   );

//   const maxPlayers = Number(
//     competition?.no_of_contestants || 0,
//   );

//   const totalQuestions = competition
//     ? getTotalQuestions(competition)
//     : 0;

//   const qualificationSequence = competition
//     ? getQualificationSequence(competition)
//     : [];

//   const statusInfo = formatStatus(competition?.status);

//   const playerPercentage =
//     maxPlayers > 0
//       ? Math.min(
//           100,
//           Math.round((joinedCount / maxPlayers) * 100),
//         )
//       : 0;

//   const handleJoin = async () => {
//     if (!quizId) {
//       setError("Competition ID is missing.");
//       return;
//     }

//     try {
//       setJoining(true);
//       setError("");

//       const response = await joinQuizById(quizId);

//       console.log("Quiz joined successfully:", response);

//       router.push( `/student/quiz-board/${quizId}/waiting-room`);
//     } catch (err: any) {
//       console.error("Failed to join quiz:", err);

//       const message =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err?.message ||
//         "Unable to join this competition. Please try again.";

//       setError(message);
//     } finally {
//       setJoining(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
//         <div className="flex flex-col items-center gap-4 text-center">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
//             <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
//           </div>

//           <div>
//             <h2 className="font-bold text-white">
//               Loading Competition
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Getting the latest competition details...
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error && !competition) {
//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
//           <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
//             <Link
//               href="/student/arena"
//               className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Quiz Board
//             </Link>
//           </div>
//         </header>

//         <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
//           <Card className="w-full max-w-lg border-red-500/20 bg-slate-900 text-white shadow-2xl">
//             <div className="p-8 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
//                 <AlertCircle className="h-7 w-7 text-red-400" />
//               </div>

//               <h1 className="mt-5 text-xl font-bold">
//                 Unable to Load Competition
//               </h1>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 {error}
//               </p>

//               <Button
//                 type="button"
//                 onClick={loadCompetition}
//                 className="mt-6 rounded-xl bg-violet-600 px-6 font-bold hover:bg-violet-500"
//               >
//                 Try Again
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   if (!competition) {
//     return null;
//   }

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       {/* Header */}
//       <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
//         <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between gap-4">
//             <Link
//               href="/student/arena"
//               className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Quiz Board
//             </Link>

//             <div
//               className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${statusInfo.className}`}
//             >
//               <span
//                 className={`h-2 w-2 animate-pulse rounded-full ${statusInfo.dot}`}
//               />

//               <span className="text-xs font-semibold uppercase tracking-wide">
//                 {statusInfo.label}
//               </span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Hero */}
//         <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
//           <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
//           <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

//           <div className="relative">
//             <div className="mb-5 flex items-center gap-3">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15">
//                 <Trophy className="h-6 w-6 text-violet-400" />
//               </div>

//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
//                   Quiz Board Competition
//                 </p>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Fastest correct answer wins the race
//                 </p>
//               </div>
//             </div>

//             <div className="max-w-3xl">
//               <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
//                 {competition.quiz_title ||
//                   "Quiz Board Competition"}
//               </h1>

//               <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
//                 {competition.description ||
//                   `Compete against other JAMB students in a multi-round elimination competition. Answer quickly and accurately to qualify for the next round and become the final champion.`}
//               </p>
//             </div>

//             {/* Joined Players */}
//             <div className="mt-6 flex flex-wrap gap-3">
//               <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
//                 <Users className="h-4 w-4 text-blue-400" />

//                 <span className="text-sm font-semibold text-slate-300">
//                   {joinedCount}/{maxPlayers} joined
//                 </span>
//               </div>

//               <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
//                 <BookOpen className="h-4 w-4 text-violet-400" />

//                 <span className="text-sm font-semibold text-slate-300">
//                   {getSubjectName(competition)}
//                 </span>
//               </div>

//               <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
//                 <Clock3 className="h-4 w-4 text-amber-400" />

//                 <span className="text-sm font-semibold text-slate-300">
//                   {competition.time_per_question || 0}s/question
//                 </span>
//               </div>
//             </div>

//             {/* Quick stats */}
//             <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
//                 <div className="flex items-center gap-3">
//                   <BookOpen className="h-5 w-5 text-blue-400" />

//                   <div>
//                     <p className="text-xs text-slate-500">
//                       Subject
//                     </p>

//                     <p className="mt-1 font-bold text-white">
//                       {getSubjectName(competition)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
//                 <div className="flex items-center gap-3">
//                   <Users className="h-5 w-5 text-cyan-400" />

//                   <div>
//                     <p className="text-xs text-slate-500">
//                       Players
//                     </p>

//                     <p className="mt-1 font-bold text-white">
//                       {joinedCount}/{maxPlayers}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
//                 <div className="flex items-center gap-3">
//                   <Clock3 className="h-5 w-5 text-amber-400" />

//                   <div>
//                     <p className="text-xs text-slate-500">
//                       Time / Question
//                     </p>

//                     <p className="mt-1 font-bold text-white">
//                       {competition.time_per_question || 0}s
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
//                 <div className="flex items-center gap-3">
//                   <Sparkles className="h-5 w-5 text-violet-400" />

//                   <div>
//                     <p className="text-xs text-violet-300/70">
//                       Entry
//                     </p>

//                     <p className="mt-1 font-bold text-violet-300">
//                       Free
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Main content */}
//         <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
//           {/* Left */}
//           <div className="space-y-8">
//             {/* Competition structure */}
//             <Card className="border-slate-800 bg-slate-900 text-white shadow-xl">
//               <div className="p-6 sm:p-7">
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
//                       Competition Structure
//                     </p>

//                     <h2 className="mt-2 text-2xl font-bold">
//                       {maxPlayers} Players. One Champion.
//                     </h2>

//                     <p className="mt-2 text-sm leading-6 text-slate-400">
//                       Contestants are eliminated after each
//                       round until only one champion remains.
//                     </p>
//                   </div>

//                   <div className="hidden rounded-xl bg-violet-500/10 p-3 sm:block">
//                     <Users className="h-6 w-6 text-violet-400" />
//                   </div>
//                 </div>

//                 {/* Qualification sequence */}
//                 <div className="mt-7 flex flex-wrap items-center gap-2">
//                   {qualificationSequence.map(
//                     (number, index) => (
//                       <div
//                         key={`${number}-${index}`}
//                         className="flex items-center"
//                       >
//                         <div
//                           className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 font-bold ${
//                             index ===
//                             qualificationSequence.length - 1
//                               ? "border border-amber-400/30 bg-amber-400/10 text-amber-300"
//                               : "border border-slate-700 bg-slate-950 text-white"
//                           }`}
//                         >
//                           {number}
//                         </div>

//                         {index <
//                           qualificationSequence.length - 1 && (
//                           <span className="px-2 text-slate-600">
//                             →
//                           </span>
//                         )}
//                       </div>
//                     ),
//                   )}
//                 </div>

//                 {/* Rounds */}
//                 <div className="mt-8 space-y-3">
//                   {(competition.round_information || []).map(
//                     (round, index) => {
//                       const roundNumber =
//                         index + 1;

//                       const previousPlayers =
//                         index === 0
//                           ? maxPlayers
//                           : Number(
//                               competition
//                                 .round_information?.[
//                                 index - 1
//                               ]?.exit_number ||
//                                 maxPlayers,
//                             );

//                       const nextPlayers =
//                         Number(round.exit_number) ||
//                         Math.max(
//                           1,
//                           previousPlayers - 1,
//                         );

//                       return (
//                         <div
//                           key={`round-${roundNumber}`}
//                           className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
//                         >
//                           <div className="flex items-start gap-4">
//                             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-black text-white">
//                               {roundNumber}
//                             </div>

//                             <div className="min-w-0 flex-1">
//                               <div className="flex flex-wrap items-center justify-between gap-2">
//                                 <h3 className="font-bold text-white">
//                                   Round {roundNumber}:{" "}
//                                   {getRoundTitle(
//                                     roundNumber,
//                                   )}
//                                 </h3>

//                                 <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300">
//                                   {previousPlayers} →{" "}
//                                   {nextPlayers}
//                                 </span>
//                               </div>

//                               <p className="mt-1 text-sm leading-6 text-slate-500">
//                                 {getRoundDescription(
//                                   roundNumber,
//                                 )}
//                               </p>

//                               <div className="mt-3 flex flex-wrap gap-2">
//                                 <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
//                                   {round.no_of_questions ||
//                                     0}{" "}
//                                   Questions
//                                 </span>

//                                 <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
//                                   {formatDifficultyBreakdown(
//                                     round.difficultyBreakdown,
//                                   )}
//                                 </span>

//                                 {round.exit_reward !==
//                                   undefined && (
//                                   <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
//                                     Exit Reward:{" "}
//                                     {round.exit_reward}{" "}
//                                     Points
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     },
//                   )}

//                   {/* Final round */}
//                   {competition.final_round_information && (
//                     <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
//                       <div className="flex items-start gap-4">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-sm font-black text-amber-300">
//                           {competition.number_of_rounds ||
//                             (competition.round_information
//                               ?.length || 0) + 1}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <div className="flex flex-wrap items-center justify-between gap-2">
//                             <h3 className="font-bold text-white">
//                               Grand Final
//                             </h3>

//                             <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
//                               2 → 1
//                             </span>
//                           </div>

//                           <p className="mt-1 text-sm leading-6 text-slate-500">
//                             Two finalists compete for the
//                             championship.
//                           </p>

//                           <div className="mt-3 flex flex-wrap gap-2">
//                             <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
//                               {competition
//                                 .final_round_information
//                                 .no_of_questions || 0}{" "}
//                               Questions
//                             </span>

//                             <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
//                               {formatDifficultyBreakdown(
//                                 competition
//                                   .final_round_information
//                                   .difficultyBreakdown,
//                               )}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Card>

//             {/* How it works */}
//             <Card className="border-slate-800 bg-slate-900 text-white shadow-xl">
//               <div className="p-6 sm:p-7">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
//                     <Zap className="h-5 w-5 text-blue-400" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
//                       How It Works
//                     </p>

//                     <h2 className="mt-1 text-xl font-bold">
//                       Compete. Answer. Qualify.
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="mt-6 space-y-4">
//                   {[
//                     {
//                       icon: CheckCircle2,
//                       title: "Join the competition",
//                       text: "Join the competition to secure your place in the Quiz Board lobby.",
//                     },
//                     {
//                       icon: Clock3,
//                       title: "Answer within the time limit",
//                       text: `Each question gives you ${
//                         competition.time_per_question || 0
//                       } seconds.`,
//                     },
//                     {
//                       icon: Zap,
//                       title: "Be fast and accurate",
//                       text: "Correct answers and response speed determine qualification.",
//                     },
//                     {
//                       icon: Crown,
//                       title: "Reach the final",
//                       text: "Survive every elimination round and compete for the championship.",
//                     },
//                   ].map((item) => {
//                     const Icon = item.icon;

//                     return (
//                       <div
//                         key={item.title}
//                         className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
//                       >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">
//                           <Icon className="h-5 w-5 text-violet-400" />
//                         </div>

//                         <div>
//                           <h3 className="font-semibold text-white">
//                             {item.title}
//                           </h3>

//                           <p className="mt-1 text-sm leading-6 text-slate-500">
//                             {item.text}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </Card>

//             {/* Final round */}
//             <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-slate-900 to-amber-950/10 text-white shadow-xl">
//               <div className="p-6 sm:p-7">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
//                     <Crown className="h-6 w-6 text-amber-300" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
//                       Grand Final
//                     </p>

//                     <h2 className="mt-1 text-xl font-bold">
//                       Two Players. One Winner.
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="mt-6 grid gap-4 sm:grid-cols-2">
//                   <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
//                     <div className="flex items-center gap-3">
//                       <Medal className="h-5 w-5 text-amber-400" />

//                       <div>
//                         <p className="text-xs text-slate-500">
//                           First Place
//                         </p>

//                         <p className="mt-1 text-2xl font-black text-amber-300">
//                           {competition
//                             .final_round_information
//                             ?.first_position_reward ??
//                             0}{" "}
//                           CBT Points
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
//                     <div className="flex items-center gap-3">
//                       <Award className="h-5 w-5 text-slate-300" />

//                       <div>
//                         <p className="text-xs text-slate-500">
//                           Second Place
//                         </p>

//                         <p className="mt-1 text-2xl font-black text-slate-200">
//                           {competition
//                             .final_round_information
//                             ?.second_position_reward ??
//                             0}{" "}
//                           CBT Points
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
//                   <p className="text-sm leading-6 text-slate-400">
//                     The final round determines the ultimate
//                     Quiz Board champion. The contestant who
//                     performs best according to the competition
//                     rules takes first place.
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Right */}
//           <aside className="lg:sticky lg:top-6 lg:h-fit">
//             <Card className="border-slate-800 bg-slate-900 text-white shadow-2xl">
//               <div className="p-6">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
//                     <Trophy className="h-5 w-5 text-violet-400" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
//                       Competition Entry
//                     </p>

//                     <h2 className="mt-1 font-bold text-white">
//                       Ready to compete?
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5 text-center">
//                   <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/70">
//                     Entry Fee
//                   </p>

//                   <p className="mt-2 text-4xl font-black text-violet-300">
//                     Free
//                   </p>
//                 </div>

//                 {/* Player capacity */}
//                 <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4 text-blue-400" />

//                       <span className="text-sm font-semibold text-slate-300">
//                         {joinedCount}/{maxPlayers}
//                       </span>

//                       <span className="text-xs text-slate-600">
//                         joined
//                       </span>
//                     </div>

//                     <span className="text-xs font-semibold text-slate-500">
//                       {playerPercentage}% full
//                     </span>
//                   </div>

//                   <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
//                     <div
//                       className="h-full rounded-full bg-blue-500 transition-all duration-500"
//                       style={{
//                         width: `${playerPercentage}%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-5 space-y-3">
//                   <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                     <span className="text-sm text-slate-500">
//                       Subject
//                     </span>

//                     <span className="text-sm font-semibold text-white">
//                       {getSubjectName(competition)}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                     <span className="text-sm text-slate-500">
//                       Capacity
//                     </span>

//                     <span className="text-sm font-semibold text-white">
//                       {maxPlayers}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                     <span className="text-sm text-slate-500">
//                       Joined
//                     </span>

//                     <span className="text-sm font-semibold text-blue-300">
//                       {joinedCount}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                     <span className="text-sm text-slate-500">
//                       Rounds
//                     </span>

//                     <span className="text-sm font-semibold text-white">
//                       {competition.number_of_rounds ||
//                         0}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                     <span className="text-sm text-slate-500">
//                       Questions
//                     </span>

//                     <span className="text-sm font-semibold text-white">
//                       {totalQuestions}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-500">
//                       Time / Question
//                     </span>

//                     <span className="text-sm font-semibold text-white">
//                       {competition.time_per_question || 0}s
//                     </span>
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="mt-5 flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
//                     <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

//                     <p className="text-sm leading-6 text-red-300">
//                       {error}
//                     </p>
//                   </div>
//                 )}

//                 <Button
//                   type="button"
//                   onClick={handleJoin}
//                   disabled={
//                     joining ||
//                     !quizId ||
//                     (maxPlayers > 0 &&
//                       joinedCount >= maxPlayers)
//                   }
//                   className="mt-6 h-12 w-full rounded-xl bg-violet-600 font-bold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {joining ? (
//                     <>
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                       Joining Competition...
//                     </>
//                   ) : maxPlayers > 0 &&
//                     joinedCount >= maxPlayers ? (
//                     <>
//                       <Users className="mr-2 h-5 w-5" />
//                       Competition Full
//                     </>
//                   ) : (
//                     <>
//                       <Trophy className="mr-2 h-5 w-5" />
//                       Join Competition
//                     </>
//                   )}
//                 </Button>

//                //.... router.push( `/student/quiz-board/${quizId}/waiting-room`);

//                 <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
//                   <ShieldCheck className="h-4 w-4 text-emerald-400" />

//                   <span>
//                     Your entry is secured by the competition
//                     system.
//                   </span>
//                 </div>
//               </div>
//             </Card>

//             {/* Rules */}
//             <Card className="mt-5 border-slate-800 bg-slate-900 text-white">
//               <div className="p-5">
//                 <div className="flex items-center gap-2">
//                   <ShieldCheck className="h-4 w-4 text-emerald-400" />

//                   <h3 className="font-semibold">
//                     Competition Rules
//                   </h3>
//                 </div>

//                 <ul className="mt-4 space-y-3">
//                   {[
//                     "Only registered contestants can participate.",
//                     "Your response time may affect qualification.",
//                     "Incorrect answers can affect your progress.",
//                     "Contestants who fail to qualify are eliminated.",
//                     "Do not leave the competition once it begins.",
//                   ].map((rule) => (
//                     <li
//                       key={rule}
//                       className="flex gap-2 text-xs leading-5 text-slate-500"
//                     >
//                       <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600" />

//                       {rule}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </Card>
//           </aside>
//         </div>

//         {/* Bottom notice */}
//         <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
//           <div className="flex gap-3">
//             <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />

//             <div>
//               <h3 className="font-semibold text-white">
//                 Before you join
//               </h3>

//               <p className="mt-1 text-sm leading-6 text-slate-500">
//                 Make sure you have a stable internet connection.
//                 Once you join, your entry will be registered for
//                 this competition.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
