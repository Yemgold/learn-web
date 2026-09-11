








// src/app/admin/(admin)/secondary/quiz-board/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  Gamepad2,
  HelpCircle,
  Loader2,
  Plus,
  Radio,
  RefreshCw,
  Settings2,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { axiosInstance } from "@/lib/api";

/* ============================================================
   BACKEND ENDPOINT
============================================================ */

/**
 * IMPORTANT:
 *
 * Replace this ONLY if your backend uses a different endpoint
 * for retrieving all Solve & Win / Quiz Board contests.
 *
 * The create/start endpoint you previously supplied is:
 *
 * /solve-and-win/contests/start-solve-and-win-contest/:contestId/:userId
 *
 * That endpoint is for STARTING a contest and should NOT be used
 * here to retrieve the admin competition list.
 */
const GET_CONTESTS_ENDPOINT =
  "/quiz-board/quiz-competitions";
  

/* ============================================================
   TYPES
============================================================ */

type CompetitionStatus =
  | "DRAFT"
  | "UPCOMING"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "UNKNOWN";

type DifficultyDistribution = {
  easy: number;
  medium: number;
  hard: number;
};

type RoundInformation = {
  round_number: number;
  no_of_questions: number;
  difficulty: DifficultyDistribution;
  exit_number: number;
  exit_reward: number;
};

type Competition = {
  id: string;

  quiz_title: string;
  description?: string;

  subject:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
        title?: string;
      };

  time_per_question: number;

  start_date: string;

  no_of_contestants: number;

  number_of_rounds: number;

  first_position_reward: number;

  second_position_reward: number;

  round_information: RoundInformation[];

  status?: CompetitionStatus | string;

  contestants?: number;
  players?: number;
  participants?: number;

  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  statusCode?: number;
  message?: string;
  data?: T;
  result?: T;
};

/* ============================================================
   HELPERS
============================================================ */

function getCompetitionId(item: Competition & Record<string, unknown>) {
  return String(
    item.id ??
      item._id ??
      item.contest_id ??
      item.contestId ??
      "",
  );
}

function getSubjectName(subject: Competition["subject"]) {
  if (!subject) return "Subject";

  if (typeof subject === "string") {
    return subject;
  }

  return (
    subject.name ??
    subject.title ??
    subject._id ??
    subject.id ??
    "Subject"
  );
}

function getParticipantCount(competition: Competition) {
  return (
    competition.contestants ??
    competition.players ??
    competition.participants ??
    0
  );
}

function getTotalQuestions(competition: Competition) {
  return competition.round_information.reduce(
    (total, round) => total + Number(round.no_of_questions || 0),
    0,
  );
}

function inferStatus(competition: Competition): CompetitionStatus {
  const explicitStatus = String(competition.status ?? "").toUpperCase();

  if (
    ["DRAFT", "UPCOMING", "LIVE", "COMPLETED", "CANCELLED"].includes(
      explicitStatus,
    )
  ) {
    return explicitStatus as CompetitionStatus;
  }

  if (!competition.start_date) {
    return "UNKNOWN";
  }

  const startTime = new Date(competition.start_date).getTime();

  if (Number.isNaN(startTime)) {
    return "UNKNOWN";
  }

  const now = Date.now();

  /**
   * Without an explicit backend status/end date, we can safely
   * identify upcoming competitions.
   *
   * We intentionally do not automatically mark a competition
   * completed because the backend should remain the source of truth.
   */
  if (startTime > now) {
    return "UPCOMING";
  }

  return "UNKNOWN";
}

function getStatusClasses(status: CompetitionStatus) {
  switch (status) {
    case "LIVE":
      return "border-red-200 bg-red-50 text-red-700";

    case "UPCOMING":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "COMPLETED":
      return "border-slate-200 bg-slate-100 text-slate-600";

    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";

    case "UNKNOWN":
      return "border-slate-200 bg-slate-50 text-slate-600";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getStatusLabel(status: CompetitionStatus) {
  switch (status) {
    case "LIVE":
      return "Live";

    case "UPCOMING":
      return "Upcoming";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "UNKNOWN":
      return "Status unavailable";

    default:
      return "Draft";
  }
}

function formatDate(dateString?: string) {
  if (!dateString) {
    return "Not scheduled";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(dateString?: string) {
  if (!dateString) {
    return "Not scheduled";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getRoundPlayerFlow(
  competition: Competition,
  roundIndex: number,
) {
  const startingPlayers = Number(competition.no_of_contestants || 0);

  if (roundIndex === 0) {
    return startingPlayers;
  }

  return competition.round_information
    .slice(0, roundIndex)
    .reduce((players, round) => {
      return Math.max(
        players - Number(round.exit_number || 0),
        0,
      );
    }, startingPlayers);
}

function getRemainingPlayersAfterRound(
  competition: Competition,
  roundIndex: number,
) {
  const before = getRoundPlayerFlow(competition, roundIndex);

  const exitNumber = Number(
    competition.round_information[roundIndex]?.exit_number || 0,
  );

  return Math.max(before - exitNumber, 0);
}

/* ============================================================
   PAGE
============================================================ */

export default function QuizBoardAdminPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* ==========================================================
     LOAD COMPETITIONS
  ========================================================== */

  async function loadCompetitions(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axiosInstance.get<
        ApiResponse<Competition[] | { data?: Competition[] }>
      >(GET_CONTESTS_ENDPOINT);

      const responseData = response.data;

      let list: Competition[] = [];

      if (Array.isArray(responseData?.data)) {
        list = responseData.data;
      } else if (
        responseData?.data &&
        typeof responseData.data === "object" &&
        Array.isArray(responseData.data.data)
      ) {
        list = responseData.data.data;
      } else if (Array.isArray(responseData?.result)) {
        list = responseData.result;
      }

      /**
       * Some APIs return:
       *
       * {
       *   data: [...]
       * }
       *
       * while others return:
       *
       * {
       *   data: {
       *      data: [...]
       *   }
       *
       * This handles both without changing the UI.
       */
      setCompetitions(
        list.map((competition: Competition & Record<string, unknown>) => ({
          ...competition,
          id: getCompetitionId(competition),
        })),
      );
    } catch (err: any) {
      console.error(
        "Failed to load Solve & Win competitions:",
        err,
      );

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      setError(
        backendMessage ||
          "Unable to load Quiz Board competitions.",
      );

      setCompetitions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCompetitions();
  }, []);

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const competitionsWithStatus = useMemo(() => {
    return competitions.map((competition) => ({
      ...competition,
      resolvedStatus: inferStatus(competition),
    }));
  }, [competitions]);

  const liveCompetitions = competitionsWithStatus.filter(
    (competition) => competition.resolvedStatus === "LIVE",
  );

  const upcomingCompetitions = competitionsWithStatus.filter(
    (competition) => competition.resolvedStatus === "UPCOMING",
  );

  const completedCompetitions = competitionsWithStatus.filter(
    (competition) => competition.resolvedStatus === "COMPLETED",
  );

  const draftCompetitions = competitionsWithStatus.filter(
    (competition) => competition.resolvedStatus === "DRAFT",
  );

  const totalParticipants = competitions.reduce(
    (total, competition) =>
      total + getParticipantCount(competition),
    0,
  );

  const totalQuestions = competitions.reduce(
    (total, competition) =>
      total + getTotalQuestions(competition),
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Admin Dashboard
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <Gamepad2 className="h-4 w-4" />
                Solve & Win Control Center
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Quiz Board
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Create and manage elimination competitions, configure
                rounds and rewards, monitor contestants and review
                competition activity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadCompetitions(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </button>

              <Link
                href="/admin/secondary/quiz-board/quiz-competitions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Trophy className="h-4 w-4" />
                Manage Boards
              </Link>

              <Link
                href="/admin/secondary/quiz-board/quiz-competitions/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Create Quiz Board
              </Link>
            </div>
          </div>
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <section className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-red-900">
                  Unable to load competitions
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => loadCompetitions(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try Again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* ==================================================
                LIVE ALERT
            ================================================== */}

            {liveCompetitions.length > 0 && (
              <section className="mb-8 overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
                <div className="border-b border-red-100 bg-red-50 px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                        <Radio className="h-5 w-5 animate-pulse text-red-600" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-red-900">
                          Live competition in progress
                        </p>

                        <p className="mt-0.5 text-xs text-red-700">
                          {liveCompetitions.length} Quiz Board
                          {liveCompetitions.length !== 1
                            ? "s are"
                            : " is"}{" "}
                          live right now.
                        </p>
                      </div>
                    </div>

                    {liveCompetitions[0]?.id && (
                      <Link
                        href={`/admin/secondary/quiz-board/quiz-competitions/${liveCompetitions[0].id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                      >
                        Open Live Control
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
                  {liveCompetitions.map((competition) => (
                    <LiveCompetitionCard
                      key={competition.id}
                      competition={competition}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ==================================================
                OVERVIEW
            ================================================== */}

            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <OverviewCard
                icon={<Trophy className="h-5 w-5" />}
                label="Competitions"
                value={String(competitions.length)}
                description="Total Quiz Boards"
              />

              <OverviewCard
                icon={<Radio className="h-5 w-5" />}
                label="Live Now"
                value={String(liveCompetitions.length)}
                description="Currently running"
                accent="red"
              />

              <OverviewCard
                icon={<CalendarDays className="h-5 w-5" />}
                label="Upcoming"
                value={String(upcomingCompetitions.length)}
                description="Scheduled competitions"
                accent="blue"
              />

              <OverviewCard
                icon={<Users className="h-5 w-5" />}
                label="Participants"
                value={String(totalParticipants)}
                description="Across all boards"
                accent="violet"
              />

              <OverviewCard
                icon={<HelpCircle className="h-5 w-5" />}
                label="Questions"
                value={String(totalQuestions)}
                description="Configured questions"
                accent="emerald"
              />
            </section>

            {/* ==================================================
                STATUS SUMMARY
            ================================================== */}

            <section className="mb-8 grid gap-4 md:grid-cols-4">
              <StatusSummary
                label="Draft"
                value={draftCompetitions.length}
                description="Still being configured"
              />

              <StatusSummary
                label="Upcoming"
                value={upcomingCompetitions.length}
                description="Waiting to start"
              />

              <StatusSummary
                label="Live"
                value={liveCompetitions.length}
                description="Currently running"
                live
              />

              <StatusSummary
                label="Completed"
                value={completedCompetitions.length}
                description="Finished competitions"
              />
            </section>

            {/* ==================================================
                MAIN GRID
            ================================================== */}

            <div className="grid gap-8 lg:grid-cols-3">
              {/* ================================================
                  LEFT
              ================================================= */}

              <section className="space-y-8 lg:col-span-2">
                {/* Competition Management */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Settings2 className="h-5 w-5" />
                      </div>

                      <h2 className="mt-5 text-xl font-black text-slate-950">
                        Competition Management
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Configure each Solve & Win competition with a
                        subject, schedule, contestant limit, rewards,
                        timing and elimination rounds.
                      </p>
                    </div>

                    <Link
                      href="/admin/secondary/quiz-board/quiz-competitions"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <ManagementStep
                      icon={<Trophy className="h-5 w-5" />}
                      title="Competition"
                      description="Title, schedule and contestant rules."
                    />

                    <ManagementStep
                      icon={<BookOpen className="h-5 w-5" />}
                      title="Subject"
                      description="Choose the competition subject."
                    />

                    <ManagementStep
                      icon={<HelpCircle className="h-5 w-5" />}
                      title="Questions"
                      description="Configure questions by difficulty."
                    />

                    <ManagementStep
                      icon={<Award className="h-5 w-5" />}
                      title="Rewards"
                      description="Set winner and exit rewards."
                    />
                  </div>
                </section>

                {/* Recent Competitions */}

                <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />

                        <h2 className="text-xl font-black text-slate-950">
                          Recent Quiz Boards
                        </h2>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Monitor competitions using live backend data.
                      </p>
                    </div>

                    <Link
                      href="/admin/secondary/quiz-board/quiz-competitions"
                      className="text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      View all
                    </Link>
                  </div>

                  {competitions.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {competitions.slice(0, 10).map((competition) => (
                        <CompetitionRow
                          key={competition.id}
                          competition={competition}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyCompetitions />
                  )}
                </section>

                {/* Competition Format */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                      <Zap className="h-5 w-5 text-amber-600" />
                    </div>

                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        Quiz Board Format
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Contestants progress through five stages, with
                        eliminations and exit rewards defined by the
                        competition configuration.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                          Standard configuration
                        </p>

                        <p className="mt-1 text-lg font-black text-slate-950">
                          20 Contestants • 5 Rounds
                        </p>
                      </div>

                      <div className="rounded-xl bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm">
                        Final champion
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                      ["Round 1", "20 contestants"],
                      ["Round 2", "After Round 1"],
                      ["Round 3", "After Round 2"],
                      ["Round 4", "After Round 3"],
                      ["Final", "Champion"],
                    ].map(([round, description], index) => (
                      <div
                        key={round}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {round}
                          </span>

                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-blue-600 shadow-sm">
                            {index + 1}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-black text-slate-900">
                          {description}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {index === 4
                            ? "Determine the champion"
                            : "Elimination stage"}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </section>

              {/* ==================================================
                  SIDEBAR
              ================================================= */}

              <aside className="space-y-6">
                {/* Quick Actions */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-950">
                        Quick Actions
                      </h2>

                      <p className="text-xs text-slate-500">
                        Common administration tasks
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <QuickAction
                      href="/admin/secondary/quiz-board/quiz-competitions/create"
                      icon={<Plus className="h-5 w-5" />}
                      title="Create Quiz Board"
                      description="Launch a new competition"
                    />

                    <QuickAction
                      href="/admin/secondary/quiz-board/quiz-competitions"
                      icon={<Trophy className="h-5 w-5" />}
                      title="Manage Competitions"
                      description="View and configure boards"
                    />

                    <QuickAction
                      href="/admin/secondary/quiz-board/questions"
                      icon={<HelpCircle className="h-5 w-5" />}
                      title="Question Bank"
                      description="Manage quiz questions"
                    />

                    <QuickAction
                      href="/admin/secondary/quiz-board/results"
                      icon={<BarChart3 className="h-5 w-5" />}
                      title="Results & Analytics"
                      description="Review competition performance"
                    />
                  </div>
                </section>

                {/* Live Control */}

                <section className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
                  <div className="border-b border-red-100 bg-red-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                        <Radio className="h-5 w-5 text-red-600" />
                      </div>

                      <div>
                        <h2 className="font-black text-red-950">
                          Live Control
                        </h2>

                        <p className="mt-0.5 text-xs text-red-700">
                          Real-time competition monitoring
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {liveCompetitions.length > 0 ? (
                      <div className="space-y-4">
                        {liveCompetitions.map((competition) => (
                          <div key={competition.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-slate-900">
                                  {competition.quiz_title}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {getParticipantCount(competition)}/
                                  {competition.no_of_contestants}{" "}
                                  contestants
                                </p>
                              </div>

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                                LIVE
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <Link
                                href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
                              >
                                <Settings2 className="h-3.5 w-3.5" />
                                Control
                              </Link>

                              <Link
                                href={`/student/quiz-board/${competition.id}/watch`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Watch
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-5 text-center">
                        <Radio className="mx-auto h-8 w-8 text-slate-300" />

                        <p className="mt-3 text-sm font-bold text-slate-700">
                          No live competitions
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Live competitions will appear here when the
                          backend marks them as live.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Configuration Checklist */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FileCheck2 className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-black text-slate-950">
                        Setup Checklist
                      </h2>

                      <p className="text-xs text-slate-500">
                        Before starting a competition
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <ChecklistItem
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      title="Competition configured"
                      description="Title, subject and schedule"
                    />

                    <ChecklistItem
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      title="Questions configured"
                      description="Questions distributed by difficulty"
                    />

                    <ChecklistItem
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      title="Rewards configured"
                      description="First, second and exit rewards"
                    />

                    <ChecklistItem
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      title="Rounds configured"
                      description="Elimination and timing rules"
                    />
                  </div>
                </section>

                {/* Backend Structure */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Settings2 className="h-5 w-5 text-violet-600" />
                    </div>

                    <div>
                      <h2 className="font-black text-slate-950">
                        Competition Rules
                      </h2>

                      <p className="text-xs text-slate-500">
                        Backend configuration
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <RuleRow
                      label="Contestants"
                      value="20"
                    />

                    <RuleRow
                      label="Rounds"
                      value="5"
                    />

                    <RuleRow
                      label="Timing"
                      value="Per question"
                    />

                    <RuleRow
                      label="Difficulty"
                      value="Easy / Medium / Hard"
                    />

                    <RuleRow
                      label="Rewards"
                      value="Position + Exit"
                    />
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <section className="mt-8 rounded-3xl bg-slate-950 p-6 sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <ShieldIcon />
              </div>

              <div>
                <p className="text-sm font-black text-white">
                  Quiz Board administration
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
                  Competition timing, answer order, qualification,
                  elimination and final results should ultimately be
                  controlled by the backend to ensure fair real-time
                  competition.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Zap className="h-4 w-4" />
              Configure • Monitor • Compete
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   LOADING STATE
============================================================ */

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />

          <div className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>

        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white" />

          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyCompetitions() {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Trophy className="h-6 w-6 text-slate-400" />
      </div>

      <h3 className="mt-4 text-base font-black text-slate-900">
        No Quiz Boards yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create your first Solve & Win competition to start managing
        elimination contests.
      </p>

      <Link
        href="/admin/secondary/quiz-board/quiz-competitions/create"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Create Quiz Board
      </Link>
    </div>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  accent?:
    | "blue"
    | "red"
    | "violet"
    | "emerald";
}

function OverviewCard({
  icon,
  label,
  value,
  description,
  accent = "blue",
}: OverviewCardProps) {
  const iconClasses = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClasses[accent]}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </section>
  );
}

/* ============================================================
   STATUS SUMMARY
============================================================ */

interface StatusSummaryProps {
  label: string;
  value: number;
  description: string;
  live?: boolean;
}

function StatusSummary({
  label,
  value,
  description,
  live = false,
}: StatusSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

        {live && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        )}
      </div>

      <p
        className={`mt-2 text-2xl font-black ${
          live ? "text-red-600" : "text-slate-950"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   LIVE COMPETITION CARD
============================================================ */

function LiveCompetitionCard({
  competition,
}: {
  competition: Competition;
}) {
  const players = getParticipantCount(competition);

  const percentage =
    competition.no_of_contestants > 0
      ? Math.min(
          Math.round(
            (players / competition.no_of_contestants) * 100,
          ),
          100,
        )
      : 0;

  return (
    <div className="rounded-2xl border border-red-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">
            {competition.quiz_title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {getSubjectName(competition.subject)}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          LIVE
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">
          {players}/{competition.no_of_contestants} contestants
        </span>

        <span className="font-bold text-slate-500">
          {percentage}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-red-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Control
        </Link>

        <Link
          href={`/student/quiz-board/${competition.id}/watch`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5" />
          Watch
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   MANAGEMENT STEP
============================================================ */

function ManagementStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   COMPETITION ROW
============================================================ */

function CompetitionRow({
  competition,
}: {
  competition: Competition;
}) {
  const status = inferStatus(competition);
  const totalQuestions = getTotalQuestions(competition);
  const players = getParticipantCount(competition);

  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Trophy className="h-4 w-4 text-slate-600" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-slate-900">
              {competition.quiz_title || "Untitled competition"}
            </h3>

            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(
                status,
              )}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>
              {getSubjectName(competition.subject)}
            </span>

            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {players}/{competition.no_of_contestants}
            </span>

            <span className="inline-flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              {totalQuestions}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {competition.time_per_question}s/question
            </span>

            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatShortDate(competition.start_date)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {status === "LIVE" && (
          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            <Radio className="h-3.5 w-3.5" />
            Control
          </Link>
        )}

        {competition.id ? (
          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Manage
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400">
            No ID
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </Link>
  );
}

/* ============================================================
   CHECKLIST ITEM
============================================================ */

function ChecklistItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-emerald-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   RULE ROW
============================================================ */

function RuleRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <span className="text-xs font-semibold text-slate-500">
        {label}
      </span>

      <span className="text-right text-xs font-black text-slate-800">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   SIMPLE SHIELD ICON
============================================================ */

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}