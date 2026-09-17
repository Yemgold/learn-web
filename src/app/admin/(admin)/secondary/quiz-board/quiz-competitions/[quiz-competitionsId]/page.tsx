









"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  Edit3,
  Eye,
  FileQuestion,
  Loader2,
  Play,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/lib/api/axios";
import { getSubjectsByPlan, type Subject } from "@/lib/api/subjects";

type QuizStatus =
  | "DRAFT"
  | "UPCOMING"
  | "OPEN"
  | "FULL"
  | "LIVE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

interface QuizRound {
  round_number: number;
  no_of_questions: number;
  difficultyBreakdown?: DifficultyDistribution;
  exit_number?: number;
  exit_reward?: number;
}

interface FinalRoundInformation {
  no_of_questions: number;
  difficultyBreakdown?: DifficultyDistribution;
  first_position_reward?: number;
  second_position_reward?: number;
}

interface Quiz {
  _id: string;
  quiz_title: string;
  description?: string;
  status?: QuizStatus | string;

  subject?: string;

  time_per_question?: number;

  start_date?: string;

  no_of_contestants?: number;

  number_of_rounds?: number;

  joined_users?: string[];

  round_information?: QuizRound[];

  final_round_information?: FinalRoundInformation;

  current_round?: number;

  room_id?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

interface SubjectResponse {
  data?: {
    subjectObj?: Subject[];
  };
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  },

  UPCOMING: {
    label: "Upcoming",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
  },

  OPEN: {
    label: "Open",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
  },

  FULL: {
    label: "Full",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  },

  IN_PROGRESS: {
    label: "In Progress",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
  },

  LIVE: {
    label: "Live",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
  },
};

function normalizeStatus(value?: string) {
  return String(value ?? "DRAFT").toUpperCase();
}

function getApiErrorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function extractQuiz(payload: any): Quiz | null {
  const candidates = [
    payload?.data,
    payload?.quiz,
    payload?.quizObj,
    payload?.data?.quiz,
    payload?.data?.quizObj,
    payload,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      (candidate._id || candidate.quiz_title)
    ) {
      return candidate as Quiz;
    }
  }

  return null;
}

function getQuizId(quiz: Quiz) {
  return quiz._id;
}

function getPlayerCount(quiz: Quiz) {
  return Array.isArray(quiz.joined_users)
    ? quiz.joined_users.length
    : 0;
}

function getMaxPlayers(quiz: Quiz) {
  return Number(quiz.no_of_contestants ?? 0);
}

function getTimePerQuestion(quiz: Quiz) {
  return Number(quiz.time_per_question ?? 0);
}

function getCurrentRound(quiz: Quiz) {
  const value = Number(quiz.current_round ?? 0);

  return value > 0 ? value : null;
}

function getTotalQuestions(quiz: Quiz) {
  const eliminationQuestions = Array.isArray(
    quiz.round_information,
  )
    ? quiz.round_information.reduce(
        (total, round) =>
          total + Number(round.no_of_questions ?? 0),
        0,
      )
    : 0;

  const finalQuestions = Number(
    quiz.final_round_information?.no_of_questions ?? 0,
  );

  return eliminationQuestions + finalQuestions;
}

function getSubjectName(
  quiz: Quiz,
  subjects: Subject[],
) {
  if (!quiz.subject) {
    return "Not specified";
  }

  const foundSubject = subjects.find(
    (subject) => subject._id === quiz.subject,
  );

  return foundSubject?.name || quiz.subject;
}

function formatDateTime(value?: string) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

function formatPoints(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

function getRoundLabel(
  round: QuizRound,
  index: number,
  totalPlayers: number,
) {
  const nextPlayers =
    totalPlayers -
    Number(round.exit_number ?? 0);

  return `Round ${round.round_number || index + 1}`;
}

function getRoundPlayersFrom(
  round: QuizRound,
  index: number,
  maxPlayers: number,
) {
  if (index === 0) {
    return maxPlayers;
  }

  const previousRounds = round;

  void previousRounds;

  return Math.max(
    1,
    maxPlayers -
      Array.from(
        { length: index },
        (_, previousIndex) =>
          Number(
            0 +
              previousIndex,
          ),
      ).reduce(
        (total, value) => total + value,
        0,
      ),
  );
}

function getRoundQualificationText(
  round: QuizRound,
  index: number,
  rounds: QuizRound[],
  maxPlayers: number,
) {
  if (index === 0) {
    const exitNumber = Number(
      round.exit_number ?? 0,
    );

    return exitNumber > 0
      ? `${maxPlayers} → ${Math.max(
          1,
          maxPlayers - exitNumber,
        )}`
      : `${maxPlayers} players`;
  }

  let playersBefore = maxPlayers;

  for (let i = 0; i < index; i += 1) {
    playersBefore = Math.max(
      1,
      playersBefore -
        Number(rounds[i].exit_number ?? 0),
    );
  }

  const exitNumber = Number(
    round.exit_number ?? 0,
  );

  const playersAfter = Math.max(
    1,
    playersBefore - exitNumber,
  );

  return `${playersBefore} → ${playersAfter}`;
}

function getFinalPlayersText(
  quiz: Quiz,
  rounds: QuizRound[],
) {
  let players = getMaxPlayers(quiz);

  rounds.forEach((round) => {
    players = Math.max(
      1,
      players -
        Number(round.exit_number ?? 0),
    );
  });

  return players;
}

function getDifficultyTotal(
  distribution?: DifficultyDistribution,
) {
  if (!distribution) return 0;

  return (
    Number(distribution.easy ?? 0) +
    Number(distribution.medium ?? 0) +
    Number(distribution.hard ?? 0)
  );
}

export default function QuizBoardDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const quizId = String(
    params["quiz-competitionsId"] ?? "",
  );

  const [quiz, setQuiz] = useState<Quiz | null>(
    null,
  );

  const [subjects, setSubjects] = useState<
    Subject[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] =
    useState("");

  const [showCreateRoomModal, setShowCreateRoomModal] =
    useState(false);

  const [showStartModal, setShowStartModal] =
    useState(false);

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) {
      setError("Quiz ID was not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/quiz/get-quiz-by-quizId/${quizId}`,
      );

      const nextQuiz = extractQuiz(
        response.data,
      );

      if (!nextQuiz) {
        throw new Error(
          "Quiz data was not returned by the server.",
        );
      }

      setQuiz(nextQuiz);
    } catch (err) {
      console.error(
        "Failed to load Quiz Board:",
        err,
      );

      setError(
        getApiErrorMessage(err),
      );
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  const fetchSubjects = useCallback(
    async () => {
      try {
        const response =
          (await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          )) as SubjectResponse;

        setSubjects(
          response?.data?.subjectObj ?? [],
        );
      } catch (err) {
        console.error(
          "Failed to load subjects:",
          err,
        );
      }
    },
    [],
  );

  useEffect(() => {
    fetchQuiz();
    fetchSubjects();
  }, [fetchQuiz, fetchSubjects]);

  const status = normalizeStatus(
    quiz?.status,
  );

  const playerCount = quiz
    ? getPlayerCount(quiz)
    : 0;

  const maxPlayers = quiz
    ? getMaxPlayers(quiz)
    : 0;

  const isFull =
    maxPlayers > 0 &&
    playerCount >= maxPlayers;

  const roomId =
    quiz?.room_id?.trim() || "";

  const roomCreated = Boolean(roomId);

  const currentRound = quiz
    ? getCurrentRound(quiz)
    : null;

  const rounds = useMemo(
    () =>
      Array.isArray(quiz?.round_information)
        ? quiz.round_information
        : [],
    [quiz],
  );

  const totalQuestions = quiz
    ? getTotalQuestions(quiz)
    : 0;

  const subjectName = quiz
    ? getSubjectName(quiz, subjects)
    : "Not specified";

  const playerPercentage =
    maxPlayers > 0
      ? Math.min(
          100,
          Math.round(
            (playerCount / maxPlayers) *
              100,
          ),
        )
      : 0;

  /*
   * IMPORTANT:
   *
   * room_id means the room has been CREATED.
   *
   * current_round === 0 means the competition
   * has NOT started yet.
   *
   * IN_PROGRESS by itself is not enough to make
   * the student page LIVE.
   */
  const competitionStarted =
    currentRound !== null ||
    status === "LIVE";

  /*
   * Create Room is only available when:
   *
   * 1. There is no room yet
   * 2. All contestants have joined
   * 3. Quiz is not already running/completed
   */
  const canCreateRoom =
    !roomCreated &&
    isFull &&
    !competitionStarted &&
    status !== "COMPLETED" &&
    status !== "CANCELLED";

  /*
   * Start Competition is available only after
   * the room has been created and the competition
   * has not started.
   */
  const canStartCompetition =
    roomCreated &&
    !competitionStarted &&
    isFull &&
    status !== "COMPLETED" &&
    status !== "CANCELLED";

  const canCancel =
    status !== "COMPLETED" &&
    status !== "CANCELLED";

  const canDelete =
    status === "DRAFT" ||
    status === "CANCELLED";

  async function createQuizRoom() {
    if (!quiz) return;

    try {
      setActionLoading(true);
      setActionError("");

      const response =
        await axiosInstance.post(
          `/quiz/create-room/${getQuizId(quiz)}`,
        );

      console.log(
        "Create room response:",
        response.data,
      );

      setShowCreateRoomModal(false);

      /*
       * The API response is:

       * data.data.roomId
       * data.data.quizId
       *
       * Refreshing the quiz is important because
       * room_id is persisted on the quiz.
       */
      await fetchQuiz();
    } catch (err) {
      console.error(
        "Failed to create Quiz Room:",
        err,
      );

      setActionError(
        getApiErrorMessage(err),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function startQuizBoard() {
    if (!quiz) return;

    try {
      setActionLoading(true);
      setActionError("");

      /*
       * This is the existing backend action used
       * to start the competition.
       *
       * We do NOT use room creation here.
       */
      await axiosInstance.post(
        `/admin/quiz-board/${getQuizId(quiz)}/start`,
      );

      setShowStartModal(false);

      await fetchQuiz();
    } catch (err) {
      console.error(
        "Failed to start Quiz Board:",
        err,
      );

      setActionError(
        getApiErrorMessage(err),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function cancelQuizBoard() {
    if (!quiz) return;

    try {
      setActionLoading(true);
      setActionError("");

      await axiosInstance.post(
        `/admin/quiz-board/${getQuizId(quiz)}/cancel`,
      );

      setShowCancelModal(false);

      await fetchQuiz();
    } catch (err) {
      console.error(
        "Failed to cancel Quiz Board:",
        err,
      );

      setActionError(
        getApiErrorMessage(err),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteQuizBoard() {
    if (!quiz) return;

    try {
      setActionLoading(true);
      setActionError("");

      await axiosInstance.delete(
        `/admin/quiz-board/${getQuizId(quiz)}`,
      );

      setShowDeleteModal(false);

      router.push(
        "/admin/secondary/quiz-board/quiz-competitions",
      );
    } catch (err) {
      console.error(
        "Failed to delete Quiz Board:",
        err,
      );

      setActionError(
        getApiErrorMessage(err),
      );

      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Loading Quiz Board...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/admin/secondary/quiz-board/quiz-competitions"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz Boards
          </Link>

          <Card className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-7 w-7" />
              </div>

              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Unable to load Quiz Board
              </h1>

              <p className="mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">
                {error ||
                  "The requested Quiz Board could not be found."}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchQuiz}
                  leftIcon={
                    <RefreshCw className="h-4 w-4" />
                  }
                >
                  Try Again
                </Button>

                <Link href="/admin/secondary/quiz-board/quiz-competitions">
                  <Button
                    type="button"
                    leftIcon={
                      <ArrowLeft className="h-4 w-4" />
                    }
                  >
                    Back to Quiz Boards
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/admin/secondary/quiz-board"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Quiz Board
          </Link>

          <span>/</span>

          <Link
            href="/admin/secondary/quiz-board/quiz-competitions"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Quiz Boards
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-900 dark:text-white">
            {quiz.quiz_title}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/secondary/quiz-board/quiz-competitions"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz Boards
          </Link>

          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    STATUS_CONFIG[status]?.className ??
                    STATUS_CONFIG.DRAFT.className
                  }`}
                >
                  {competitionStarted && (
                    <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  )}

                  {STATUS_CONFIG[status]?.label ??
                    status}
                </span>

                {roomCreated && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Room Created
                  </span>
                )}

                {currentRound && (
                  <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-300">
                    Round {currentRound}
                  </span>
                )}
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {quiz.quiz_title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                {quiz.description ||
                  "Live competitive Quiz Board with timed questions, elimination rounds, and a final winner."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={fetchQuiz}
                disabled={loading}
                leftIcon={
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                }
              >
                Refresh
              </Button>

              {competitionStarted && (
                <Link
                  href={`/student/quiz-board/${getQuizId(
                    quiz,
                  )}/watch`}
                  target="_blank"
                >
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={
                      <Eye className="h-4 w-4" />
                    }
                  >
                    Watch Live
                  </Button>
                </Link>
              )}

              {!competitionStarted &&
                status !== "CANCELLED" &&
                status !== "COMPLETED" && (
                  <Link
                    href={`/admin/secondary/quiz-board/quiz-competitions/${getQuizId(
                      quiz,
                    )}/edit`}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      leftIcon={
                        <Edit3 className="h-4 w-4" />
                      }
                    >
                      Edit
                    </Button>
                  </Link>
                )}

              {/* CREATE ROOM */}
              {canCreateRoom && (
                <Button
                  type="button"
                  onClick={() =>
                    setShowCreateRoomModal(true)
                  }
                  leftIcon={
                    <Users className="h-4 w-4" />
                  }
                >
                  Create Quiz Room
                </Button>
              )}

              {/* START COMPETITION */}
              {canStartCompetition && (
                <Button
                  type="button"
                  onClick={() =>
                    setShowStartModal(true)
                  }
                  leftIcon={
                    <Play className="h-4 w-4" />
                  }
                >
                  Open Room / Start Competition
                </Button>
              )}

              {canCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowCancelModal(true)
                  }
                  leftIcon={
                    <X className="h-4 w-4" />
                  }
                >
                  Cancel
                </Button>
              )}

              {canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setShowDeleteModal(true)
                  }
                  leftIcon={
                    <Trash2 className="h-4 w-4" />
                  }
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>

        {actionError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">
                Action failed
              </p>

              <p className="mt-1">
                {actionError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActionError("")}
              className="rounded-md p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ROOM LIFECYCLE CARD */}
        {!competitionStarted && (
          <Card className="mb-6 overflow-hidden border-blue-200 dark:border-blue-900">
            <div className="border-b border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900/50 dark:bg-blue-950/20 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Play className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Competition Room
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    The Quiz Board follows a two-step launch process:
                    create the room first, then open the room to start
                    the competition.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* STEP 1 */}
                <div
                  className={`rounded-xl border p-4 ${
                    roomCreated
                      ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20"
                      : "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        roomCreated
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {roomCreated ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        "1"
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Create Room
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {roomCreated
                          ? "Completed"
                          : isFull
                            ? "Ready"
                            : "Waiting for contestants"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* STEP 2 */}
                <div
                  className={`rounded-xl border p-4 ${
                    canStartCompetition
                      ? "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20"
                      : competitionStarted
                        ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        canStartCompetition
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      2
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Open Room
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {canStartCompetition
                          ? "Ready to start"
                          : "After room creation"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      3
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Round 1 Starts
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Backend starts the round
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!isFull && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-200">
                      Waiting for contestants
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-800/80 dark:text-amber-300/80">
                      {playerCount} of {maxPlayers} contestants
                      have joined. The room can be created once all
                      available contestant positions are filled.
                    </p>
                  </div>
                </div>
              )}

              {roomCreated && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        Quiz Room ID
                      </p>

                      <p className="mt-1 break-all font-mono text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                        {roomId}
                      </p>
                    </div>

                    {canStartCompetition && (
                      <Button
                        type="button"
                        onClick={() =>
                          setShowStartModal(true)
                        }
                        leftIcon={
                          <Play className="h-4 w-4" />
                        }
                      >
                        Open Room / Start Competition
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* LIVE BANNER */}
        {competitionStarted && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-orange-50 p-5 dark:border-red-900/60 dark:from-red-950/20 dark:via-slate-900 dark:to-orange-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <Zap className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                    <p className="font-bold text-red-700 dark:text-red-400">
                      Quiz Board is LIVE
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {currentRound
                      ? `Round ${currentRound} is currently active.`
                      : "Students are currently competing in this Quiz Board."}
                  </p>
                </div>
              </div>

              <Link
                href={`/student/quiz-board/${getQuizId(
                  quiz,
                )}/watch`}
                target="_blank"
              >
                <Button
                  type="button"
                  leftIcon={
                    <Eye className="h-4 w-4" />
                  }
                >
                  Open Live Board
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Overview stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Players
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {playerCount}

                  <span className="ml-1 text-base font-medium text-slate-400">
                    / {maxPlayers}
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${playerPercentage}%`,
                }}
              />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Questions
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {totalQuestions}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
                <FileQuestion className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {rounds.length} elimination round
              {rounds.length === 1 ? "" : "s"} + final
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Time / Question
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {getTimePerQuestion(quiz)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              seconds
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Current Round
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {currentRound ?? "—"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <Trophy className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              {competitionStarted
                ? "Competition active"
                : "Not started"}
            </p>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {/* Configuration */}
            <Card className="p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Quiz Board Configuration
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Core settings returned by the Quiz API.
                  </p>
                </div>

                <ShieldCheck className="hidden h-6 w-6 text-blue-600 sm:block" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  label="Maximum Players"
                  value={`${maxPlayers} students`}
                />

                <InfoItem
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  label="Joined Players"
                  value={`${playerCount} students`}
                />

                <InfoItem
                  icon={
                    <Clock3 className="h-4 w-4" />
                  }
                  label="Time Per Question"
                  value={`${getTimePerQuestion(
                    quiz,
                  )} seconds`}
                />

                <InfoItem
                  icon={
                    <FileQuestion className="h-4 w-4" />
                  }
                  label="Total Questions"
                  value={`${totalQuestions} questions`}
                />

                <InfoItem
                  icon={
                    <Trophy className="h-4 w-4" />
                  }
                  label="Number of Rounds"
                  value={`${quiz.number_of_rounds ?? 0} rounds`}
                />

                <InfoItem
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Scheduled Start"
                  value={formatDateTime(
                    quiz.start_date,
                  )}
                />

                <InfoItem
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Created"
                  value={formatDate(
                    quiz.createdAt,
                  )}
                />

                <InfoItem
                  icon={
                    <ShieldCheck className="h-4 w-4" />
                  }
                  label="Subject"
                  value={subjectName}
                />
              </div>
            </Card>

            {/* Room */}
            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Quiz Room
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Room lifecycle and connection state.
                  </p>
                </div>
              </div>

              {roomCreated ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                    <div className="min-w-0">
                      <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                        Room created successfully
                      </p>

                      <p className="mt-2 break-all font-mono text-xs text-emerald-800/80 dark:text-emerald-300/80">
                        {roomId}
                      </p>
                    </div>
                  </div>

                  {!competitionStarted && (
                    <div className="mt-4 border-t border-emerald-200 pt-4 dark:border-emerald-900">
                      <p className="text-sm text-emerald-800/80 dark:text-emerald-300/80">
                        The room exists, but the competition has not
                        started yet. Use <strong>Open Room / Start
                        Competition</strong> to begin Round 1.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                  <Users className="mx-auto h-8 w-8 text-slate-400" />

                  <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                    Quiz room has not been created
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {isFull
                      ? "All contestant positions are filled. The room can now be created."
                      : `${playerCount} of ${maxPlayers} contestants have joined.`}
                  </p>
                </div>
              )}
            </Card>

            {/* Subjects */}
            <Card className="p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Question Subject
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Subject configured for this Quiz Board.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                <BookOpenIcon />

                {subjectName}
              </div>
            </Card>

            {/* Round structure */}
            <Card className="p-5 sm:p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
                    <Trophy className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Competition Rounds
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Round structure returned by the backend.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {rounds.map(
                  (round, index) => {
                    const isCurrent =
                      currentRound ===
                      round.round_number;

                    const isPast =
                      currentRound !== null &&
                      round.round_number <
                        currentRound;

                    const qualificationText =
                      getRoundQualificationText(
                        round,
                        index,
                        rounds,
                        maxPlayers,
                      );

                    return (
                      <div
                        key={`${round.round_number}-${index}`}
                        className={`rounded-xl border p-4 ${
                          isCurrent
                            ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                            : isPast
                              ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/10"
                              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                                isCurrent
                                  ? "bg-blue-600 text-white"
                                  : isPast
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {isPast ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                round.round_number
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                Round{" "}
                                {
                                  round.round_number
                                }
                              </p>

                              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                {
                                  round.no_of_questions
                                }{" "}
                                questions
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {qualificationText}
                            </span>

                            {round.exit_number !==
                              undefined && (
                              <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                                Exit:{" "}
                                {
                                  round.exit_number
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        {round.difficultyBreakdown && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <DifficultyPill
                              label="Easy"
                              value={
                                round
                                  .difficultyBreakdown
                                  .easy
                              }
                            />

                            <DifficultyPill
                              label="Medium"
                              value={
                                round
                                  .difficultyBreakdown
                                  .medium
                              }
                            />

                            <DifficultyPill
                              label="Hard"
                              value={
                                round
                                  .difficultyBreakdown
                                  .hard
                              }
                            />

                            {round.exit_reward !==
                              undefined && (
                              <DifficultyPill
                                label="Exit reward"
                                value={
                                  round.exit_reward
                                }
                              />
                            )}
                          </div>
                        )}

                        {isCurrent && (
                          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                            Current Round
                          </div>
                        )}
                      </div>
                    );
                  },
                )}

                {/* FINAL */}
                {quiz.final_round_information && (
                  <div
                    className={`rounded-xl border p-4 ${
                      currentRound ===
                      (quiz.number_of_rounds ??
                        rounds.length)
                        ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                        : "border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/10"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-sm font-bold text-white">
                          F
                        </div>

                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            Final Round
                          </p>

                          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                            {
                              quiz
                                .final_round_information
                                .no_of_questions
                            }{" "}
                            questions
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                          {
                            getFinalPlayersText(
                              quiz,
                              rounds,
                            )
                          }{" "}
                          finalist
                          {getFinalPlayersText(
                            quiz,
                            rounds,
                          ) === 1
                            ? ""
                            : "s"}
                        </span>
                      </div>
                    </div>

                    {quiz
                      .final_round_information
                      .difficultyBreakdown && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <DifficultyPill
                          label="Easy"
                          value={
                            quiz
                              .final_round_information
                              .difficultyBreakdown
                              .easy
                          }
                        />

                        <DifficultyPill
                          label="Medium"
                          value={
                            quiz
                              .final_round_information
                              .difficultyBreakdown
                              .medium
                          }
                        />

                        <DifficultyPill
                          label="Hard"
                          value={
                            quiz
                              .final_round_information
                              .difficultyBreakdown
                              .hard
                          }
                        />
                      </div>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-white/70 p-3 dark:bg-slate-900/40">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          1st Position
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                          {formatPoints(
                            Number(
                              quiz
                                .final_round_information
                                .first_position_reward ??
                                0,
                            ),
                          )}{" "}
                          <span className="text-xs font-medium text-slate-500">
                            CBT points
                          </span>
                        </p>
                      </div>

                      <div className="rounded-lg bg-white/70 p-3 dark:bg-slate-900/40">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          2nd Position
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                          {formatPoints(
                            Number(
                              quiz
                                .final_round_information
                                .second_position_reward ??
                                0,
                            ),
                          )}{" "}
                          <span className="text-xs font-medium text-slate-500">
                            CBT points
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Joined users */}
            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Joined Contestants
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {playerCount} of {maxPlayers} places occupied
                    </p>
                  </div>

                  {isFull && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Full
                    </span>
                  )}
                </div>
              </div>

              {quiz.joined_users?.length ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quiz.joined_users.map(
                    (userId, index) => (
                      <div
                        key={userId}
                        className="flex items-center gap-3 px-5 py-4 sm:px-6"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Contestant{" "}
                            {index + 1}
                          </p>

                          <p className="mt-0.5 break-all font-mono text-xs text-slate-500 dark:text-slate-400">
                            {userId}
                          </p>
                        </div>

                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Users className="h-5 w-5" />
                  </div>

                  <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                    No contestants yet
                  </p>

                  <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                    Students will appear here once they join this Quiz Board.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Board Status
                </h2>

                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    STATUS_CONFIG[status]?.className ??
                    STATUS_CONFIG.DRAFT.className
                  }`}
                >
                  {competitionStarted && (
                    <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  )}

                  {STATUS_CONFIG[status]?.label ??
                    status}
                </span>
              </div>

              <div className="space-y-4">
                <StatusRow
                  label="Players"
                  value={`${playerCount} / ${maxPlayers}`}
                />

                <StatusRow
                  label="Room"
                  value={
                    roomCreated
                      ? "Created"
                      : "Not created"
                  }
                />

                <StatusRow
                  label="Current round"
                  value={
                    currentRound
                      ? `Round ${currentRound}`
                      : "Not started"
                  }
                />

                <StatusRow
                  label="Competition"
                  value={
                    competitionStarted
                      ? "Started"
                      : "Waiting to start"
                  }
                />

                <StatusRow
                  label="Questions"
                  value={`${totalQuestions}`}
                />

                <StatusRow
                  label="Time / question"
                  value={`${getTimePerQuestion(
                    quiz,
                  )} sec`}
                />
              </div>
            </Card>

            {/* Schedule */}
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Schedule
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quiz Board timing
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Starts
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDateTime(
                    quiz.start_date,
                  )}
                </p>
              </div>
            </Card>

            {/* Round Summary */}
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
                  <FileQuestion className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Question Plan
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Backend-configured structure
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {rounds.map(
                  (round) => (
                    <div
                      key={round.round_number}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-900/50"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Round{" "}
                        {round.round_number}
                      </span>

                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {
                          round.no_of_questions
                        }
                      </span>
                    </div>
                  ),
                )}

                {quiz.final_round_information && (
                  <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2.5 dark:bg-purple-950/20">
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Final
                    </span>

                    <span className="text-sm font-bold text-purple-900 dark:text-purple-200">
                      {
                        quiz
                          .final_round_information
                          .no_of_questions
                      }
                    </span>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Total
                  </span>

                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {totalQuestions} questions
                  </span>
                </div>
              </div>
            </Card>

            {/* Security */}
            <Card className="border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                    Server-authoritative competition
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-blue-800/80 dark:text-blue-300/80">
                    Room creation, round starting, answer order,
                    qualification, elimination, scores, and the final
                    winner should be controlled by the backend.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/secondary/quiz-board/quiz-competitions"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all Quiz Boards
          </Link>

          <div className="flex flex-wrap gap-2">
            {canCreateRoom && (
              <Button
                type="button"
                onClick={() =>
                  setShowCreateRoomModal(true)
                }
                leftIcon={
                  <Users className="h-4 w-4" />
                }
              >
                Create Quiz Room
              </Button>
            )}

            {canStartCompetition && (
              <Button
                type="button"
                onClick={() =>
                  setShowStartModal(true)
                }
                leftIcon={
                  <Play className="h-4 w-4" />
                }
              >
                Open Room / Start Competition
              </Button>
            )}

            {competitionStarted && (
              <Link
                href={`/student/quiz-board/${getQuizId(
                  quiz,
                )}/watch`}
                target="_blank"
              >
                <Button
                  type="button"
                  leftIcon={
                    <Eye className="h-4 w-4" />
                  }
                >
                  Watch Live
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CREATE ROOM MODAL */}
      {showCreateRoomModal && (
        <ActionModal
          title="Create Quiz Room?"
          description={`All ${maxPlayers} contestant positions are filled. Creating the room will prepare "${quiz.quiz_title}" for the competition. The competition will NOT start until you explicitly open the room.`}
          icon={
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          iconClassName="bg-blue-100 dark:bg-blue-950/40"
          confirmLabel="Create Quiz Room"
          loading={actionLoading}
          onClose={() => {
            if (!actionLoading) {
              setShowCreateRoomModal(false);
            }
          }}
          onConfirm={createQuizRoom}
        />
      )}

      {/* START MODAL */}
      {showStartModal && (
        <ActionModal
          title="Open Room / Start Competition?"
          description={`The Quiz Room has already been created for "${quiz.quiz_title}". Starting the competition will allow the backend to begin Round 1 and notify connected students that the competition has started.`}
          icon={
            <Play className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          }
          iconClassName="bg-emerald-100 dark:bg-emerald-950/40"
          confirmLabel="Open Room / Start Competition"
          loading={actionLoading}
          onClose={() => {
            if (!actionLoading) {
              setShowStartModal(false);
            }
          }}
          onConfirm={startQuizBoard}
        />
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <ActionModal
          title="Cancel Quiz Board?"
          description={`Are you sure you want to cancel "${quiz.quiz_title}"? Students should no longer be able to participate in this Quiz Board.`}
          icon={
            <X className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          }
          iconClassName="bg-amber-100 dark:bg-amber-950/40"
          confirmLabel="Cancel Quiz Board"
          loading={actionLoading}
          onClose={() => {
            if (!actionLoading) {
              setShowCancelModal(false);
            }
          }}
          onConfirm={cancelQuizBoard}
        />
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <ActionModal
          title="Delete Quiz Board?"
          description={`This will permanently remove "${quiz.quiz_title}". This action cannot be undone.`}
          icon={
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          }
          iconClassName="bg-red-100 dark:bg-red-950/40"
          confirmLabel="Delete Quiz Board"
          loading={actionLoading}
          destructive
          onClose={() => {
            if (!actionLoading) {
              setShowDeleteModal(false);
            }
          }}
          onConfirm={deleteQuizBoard}
        />
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="mt-0.5 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function DifficultyPill({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {label}: {value}
    </span>
  );
}

function BookOpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M2 4h7a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H2z" />
      <path d="M22 4h-7a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h7z" />
    </svg>
  );
}

function ActionModal({
  title,
  description,
  icon,
  iconClassName,
  confirmLabel,
  loading,
  destructive = false,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
  confirmLabel: string;
  loading: boolean;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
          >
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Go Back
          </Button>

          <Button
            type="button"
            variant={
              destructive
                ? "destructive"
                : undefined
            }
            onClick={onConfirm}
            disabled={loading}
            leftIcon={
              loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : destructive ? (
                <Trash2 className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )
            }
          >
            {loading
              ? "Processing..."
              : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}