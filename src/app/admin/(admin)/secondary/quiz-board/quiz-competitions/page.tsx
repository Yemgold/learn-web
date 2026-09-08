


// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\admin\(admin)\secondary\quiz-board\quiz-competitions\page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trophy,
  CalendarDays,
  Clock3,
  Eye,
  Pencil,
  Trash2,
  Settings2,
  BookOpen,
  ChevronRight,
  Loader2,
  Coins,
  AlertCircle,
  X,
  Users,
  Radio,
  Play,
  Square,
  CheckCircle2,
  CircleDot,
  Zap,
  Target,
  Layers3,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   TYPES
============================================================ */

type QuizBoardStatus =
  | "DRAFT"
  | "UPCOMING"
  | "OPEN"
  | "FULL"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

type QuizBoardDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD"
  | "MIXED";

type RoundNumber = 1 | 2 | 3 | 4 | 5;

interface QuizBoard {
  _id: string;
  id?: string;

  title: string;
  description?: string;

  subject?: string;
  subjectName?: string;

  difficulty?: QuizBoardDifficulty | string;

  status: QuizBoardStatus | string;

  entryFee?: number;
  entryPoints?: number;

  winnerReward?: number;
  rewardPoints?: number;

  maxPlayers?: number;
  players?: number;
  participantCount?: number;

  questionCount?: number;

  currentRound?: RoundNumber | number | null;

  startDate?: string;
  startsAt?: string;

  endDate?: string;
  endsAt?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   CONSTANTS
============================================================ */

const MAX_PLAYERS = 20;

const ROUND_CONFIG: Record<
  RoundNumber,
  {
    label: string;
    from: number;
    to: number;
    questions: number;
  }
> = {
  1: {
    label: "Round 1",
    from: 20,
    to: 15,
    questions: 10,
  },
  2: {
    label: "Round 2",
    from: 15,
    to: 10,
    questions: 10,
  },
  3: {
    label: "Round 3",
    from: 10,
    to: 5,
    questions: 10,
  },
  4: {
    label: "Round 4",
    from: 5,
    to: 2,
    questions: 10,
  },
  5: {
    label: "Final",
    from: 2,
    to: 1,
    questions: 20,
  },
};

const STATUS_OPTIONS = [
  "ALL",
  "DRAFT",
  "UPCOMING",
  "OPEN",
  "FULL",
  "LIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

/* ============================================================
   HELPERS
============================================================ */

function normalizeStatus(status?: string) {
  return (status || "DRAFT").trim().toUpperCase();
}

function getStatusLabel(status?: string) {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "DRAFT":
      return "Draft";

    case "UPCOMING":
      return "Upcoming";

    case "OPEN":
      return "Registration Open";

    case "FULL":
      return "Full";

    case "LIVE":
      return "Live";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status || "Unknown";
  }
}

function getStatusClass(status?: string) {
  switch (normalizeStatus(status)) {
    case "LIVE":
      return "bg-red-100 text-red-700";

    case "OPEN":
      return "bg-blue-100 text-blue-700";

    case "FULL":
      return "bg-orange-100 text-orange-700";

    case "UPCOMING":
      return "bg-yellow-100 text-yellow-700";

    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "DRAFT":
      return "bg-purple-100 text-purple-700";

    case "CANCELLED":
      return "bg-slate-200 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getDifficultyClass(difficulty?: string) {
  switch ((difficulty || "").toUpperCase()) {
    case "EASY":
      return "bg-green-100 text-green-700";

    case "MEDIUM":
      return "bg-blue-100 text-blue-700";

    case "HARD":
      return "bg-red-100 text-red-700";

    case "MIXED":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatDifficulty(difficulty?: string) {
  if (!difficulty) {
    return "Not set";
  }

  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
}

function formatDate(dateString?: string) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(dateString?: string) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatPoints(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0";
  }

  return value.toLocaleString("en-NG");
}

function getEntryPoints(quiz: QuizBoard) {
  return quiz.entryFee ?? quiz.entryPoints ?? 0;
}

function getRewardPoints(quiz: QuizBoard) {
  return quiz.winnerReward ?? quiz.rewardPoints ?? 0;
}

function getPlayerCount(quiz: QuizBoard) {
  return (
    quiz.players ??
    quiz.participantCount ??
    0
  );
}

function getQuestionCount(quiz: QuizBoard) {
  return quiz.questionCount ?? 0;
}

function getStartDate(quiz: QuizBoard) {
  return quiz.startsAt ?? quiz.startDate;
}

function getEndDate(quiz: QuizBoard) {
  return quiz.endsAt ?? quiz.endDate;
}

function getSubjectName(quiz: QuizBoard) {
  return quiz.subjectName ?? quiz.subject ?? "Not assigned";
}

function getBoardId(quiz: QuizBoard) {
  return quiz._id || quiz.id || "";
}

function getCurrentRound(quiz: QuizBoard): RoundNumber | null {
  const round = Number(quiz.currentRound);

  if ([1, 2, 3, 4, 5].includes(round)) {
    return round as RoundNumber;
  }

  return null;
}

function getRoundProgress(quiz: QuizBoard) {
  const round = getCurrentRound(quiz);

  if (!round) {
    return 0;
  }

  return (round / 5) * 100;
}

function getPlayerProgress(quiz: QuizBoard) {
  const players = getPlayerCount(quiz);
  const maxPlayers = quiz.maxPlayers ?? MAX_PLAYERS;

  if (maxPlayers <= 0) {
    return 0;
  }

  return Math.min(100, (players / maxPlayers) * 100);
}

function getApiErrorMessage(error: unknown) {
  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    "Something went wrong."
  );
}

/* ============================================================
   API RESPONSE NORMALIZER
============================================================ */

function extractQuizBoards(payload: unknown): QuizBoard[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = payload as Record<string, unknown>;

  const possibleArrays = [
    data.quizBoards,
    data.quizBoardObj,
    data.quizBoardObjs,
    data.data,
    data.items,
    data.results,
  ];

  for (const candidate of possibleArrays) {
    if (Array.isArray(candidate)) {
      return candidate as QuizBoard[];
    }
  }

  if (
    data.data &&
    typeof data.data === "object" &&
    !Array.isArray(data.data)
  ) {
    const nested = data.data as Record<string, unknown>;

    const nestedArrays = [
      nested.quizBoards,
      nested.quizBoardObj,
      nested.quizBoardObjs,
      nested.items,
      nested.results,
    ];

    for (const candidate of nestedArrays) {
      if (Array.isArray(candidate)) {
        return candidate as QuizBoard[];
      }
    }
  }

  if (Array.isArray(payload)) {
    return payload as QuizBoard[];
  }

  return [];
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminQuizCompetitionsPage() {
  /* ==========================================================
     STATE
  ========================================================== */

  const [quizBoards, setQuizBoards] = useState<QuizBoard[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_OPTIONS)[number]>("ALL");

  const [difficultyFilter, setDifficultyFilter] =
    useState("ALL");

  /* ==========================================================
     ACTION STATE
  ========================================================== */

  const [actionBoard, setActionBoard] =
    useState<QuizBoard | null>(null);

  const [actionType, setActionType] = useState<
    "delete" | "start" | "cancel" | null
  >(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const [actionError, setActionError] = useState("");

  /* ==========================================================
     LOAD QUIZ BOARDS
  ========================================================== */

  const loadQuizBoards = async () => {
    try {
      setIsLoading(true);
      setError("");

      /*
       * Quiz Board admin endpoint.
       *
       * Expected backend endpoint:
       *
       * GET /api/v1/admin/quiz-board
       *
       * Your axiosInstance already contains the API base URL,
       * so we only provide the endpoint path here.
       */

      const response = await axiosInstance.get(
        "/admin/quiz-board",
      );

      const boards = extractQuizBoards(response.data);

      setQuizBoards(boards);
    } catch (err) {
      console.error(
        "Failed to load Quiz Boards:",
        err,
      );

      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    loadQuizBoards();
  }, []);

  /* ==========================================================
     FILTERED BOARDS
  ========================================================== */

  const filteredQuizBoards = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizBoards.filter((quiz) => {
      const matchesSearch =
        !query ||
        quiz.title?.toLowerCase().includes(query) ||
        quiz.description?.toLowerCase().includes(query) ||
        getSubjectName(quiz).toLowerCase().includes(query) ||
        normalizeStatus(quiz.status)
          .toLowerCase()
          .includes(query) ||
        formatDifficulty(quiz.difficulty)
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(quiz.status) === statusFilter;

      const matchesDifficulty =
        difficultyFilter === "ALL" ||
        normalizeStatus(quiz.difficulty) ===
          difficultyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDifficulty
      );
    });
  }, [
    quizBoards,
    search,
    statusFilter,
    difficultyFilter,
  ]);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const statistics = useMemo(() => {
    const total = quizBoards.length;

    const draft = quizBoards.filter(
      (quiz) =>
        normalizeStatus(quiz.status) === "DRAFT",
    ).length;

    const open = quizBoards.filter(
      (quiz) =>
        normalizeStatus(quiz.status) === "OPEN",
    ).length;

    const live = quizBoards.filter(
      (quiz) =>
        normalizeStatus(quiz.status) === "LIVE",
    ).length;

    const completed = quizBoards.filter(
      (quiz) =>
        normalizeStatus(quiz.status) === "COMPLETED",
    ).length;

    const totalParticipants = quizBoards.reduce(
      (total, quiz) =>
        total + getPlayerCount(quiz),
      0,
    );

    const totalQuestions = quizBoards.reduce(
      (total, quiz) =>
        total + getQuestionCount(quiz),
      0,
    );

    return {
      total,
      draft,
      open,
      live,
      completed,
      totalParticipants,
      totalQuestions,
    };
  }, [quizBoards]);

  /* ==========================================================
     MODAL
  ========================================================== */

  const openActionModal = (
    board: QuizBoard,
    type: "delete" | "start" | "cancel",
  ) => {
    setActionBoard(board);
    setActionType(type);
    setActionError("");
  };

  const closeActionModal = () => {
    if (isProcessing) {
      return;
    }

    setActionBoard(null);
    setActionType(null);
    setActionError("");
  };

  /* ==========================================================
     EXECUTE ACTION
  ========================================================== */

  const handleBoardAction = async () => {
    if (!actionBoard) {
      return;
    }

    const boardId = getBoardId(actionBoard);

    if (!boardId) {
      setActionError("Quiz Board ID is missing.");
      return;
    }

    try {
      setIsProcessing(true);
      setActionError("");

      if (actionType === "delete") {
        await axiosInstance.delete(
          `/admin/quiz-board/${boardId}`,
        );

        setQuizBoards((current) =>
          current.filter(
            (quiz) => getBoardId(quiz) !== boardId,
          ),
        );
      }

      if (actionType === "start") {
        await axiosInstance.post(
          `/admin/quiz-board/${boardId}/start`,
        );

        setQuizBoards((current) =>
          current.map((quiz) =>
            getBoardId(quiz) === boardId
              ? {
                  ...quiz,
                  status: "LIVE",
                  currentRound: 1,
                }
              : quiz,
          ),
        );
      }

      if (actionType === "cancel") {
        await axiosInstance.post(
          `/admin/quiz-board/${boardId}/cancel`,
        );

        setQuizBoards((current) =>
          current.map((quiz) =>
            getBoardId(quiz) === boardId
              ? {
                  ...quiz,
                  status: "CANCELLED",
                }
              : quiz,
          ),
        );
      }

      closeActionModal();
    } catch (err) {
      console.error(
        `Failed to ${actionType} Quiz Board:`,
        err,
      );

      setActionError(getApiErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  /* ==========================================================
     ACTION MODAL TEXT
  ========================================================== */

  const actionModal = useMemo(() => {
    switch (actionType) {
      case "start":
        return {
          title: "Start Quiz Board?",
          description:
            "Starting this Quiz Board will make it live for participating students.",
          button: "Start Quiz Board",
        };

      case "cancel":
        return {
          title: "Cancel Quiz Board?",
          description:
            "This will prevent the Quiz Board from continuing and students will no longer be able to participate.",
          button: "Cancel Quiz Board",
        };

      case "delete":
        return {
          title: "Delete Quiz Board?",
          description:
            "This action cannot be undone. The Quiz Board and its configuration may be permanently removed.",
          button: "Delete Quiz Board",
        };

      default:
        return null;
    }
  }, [actionType]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              <Trophy className="h-4 w-4" />
              Quiz Board Administration
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              Quiz Boards
            </h1>

            <p className="mt-3 max-w-3xl text-lg leading-7 text-slate-600">
              Create, configure, monitor and control
              real-time Quiz Board competitions with up
              to 20 students competing through five
              elimination rounds.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={loadQuizBoards}
              disabled={isLoading}
              leftIcon={
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
              }
            >
              Refresh
            </Button>

            <Link
              href="/admin/secondary/quiz-board/quiz-competitions/create"
            >
              <Button
                leftIcon={
                  <Plus className="h-4 w-4" />
                }
              >
                Create Quiz Board
              </Button>
            </Link>
          </div>
        </div>

        {/* ==================================================
            QUICK OVERVIEW
        ================================================== */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={
              <Trophy className="h-5 w-5" />
            }
            label="Total Boards"
            value={statistics.total}
            description="All Quiz Boards"
          />

          <StatCard
            icon={
              <CircleDot className="h-5 w-5" />
            }
            label="Draft"
            value={statistics.draft}
            description="Not published"
          />

          <StatCard
            icon={
              <Users className="h-5 w-5" />
            }
            label="Open"
            value={statistics.open}
            description="Accepting students"
          />

          <StatCard
            icon={
              <Radio className="h-5 w-5" />
            }
            label="Live"
            value={statistics.live}
            description="Currently running"
            live={statistics.live > 0}
          />

          <StatCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Completed"
            value={statistics.completed}
            description="Finished boards"
          />
        </div>

        {/* ==================================================
            LIVE SUMMARY
        ================================================== */}

        {statistics.live > 0 && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-100 bg-red-50 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
                  </span>

                  <div>
                    <h2 className="font-bold text-red-900">
                      Live Quiz Boards
                    </h2>

                    <p className="text-sm text-red-700">
                      {statistics.live} Quiz Board
                      {statistics.live === 1
                        ? ""
                        : "s"} currently running.
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                  LIVE
                </span>
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
              {quizBoards
                .filter(
                  (quiz) =>
                    normalizeStatus(
                      quiz.status,
                    ) === "LIVE",
                )
                .slice(0, 3)
                .map((quiz) => (
                  <LiveSummaryCard
                    key={getBoardId(quiz)}
                    quiz={quiz}
                  />
                ))}
            </div>
          </section>
        )}

        {/* ==================================================
            SEARCH + FILTERS
        ================================================== */}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <Input
                placeholder="Search by title, subject, difficulty or status..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                leftIcon={
                  <Search className="h-4 w-4" />
                }
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      (typeof STATUS_OPTIONS)[number],
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                aria-label="Filter by status"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === "ALL"
                      ? "All Statuses"
                      : getStatusLabel(status)}
                  </option>
                ))}
              </select>

              <select
                value={difficultyFilter}
                onChange={(event) =>
                  setDifficultyFilter(
                    event.target.value,
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                aria-label="Filter by difficulty"
              >
                <option value="ALL">
                  All Difficulties
                </option>
                <option value="EASY">
                  Easy
                </option>
                <option value="MEDIUM">
                  Medium
                </option>
                <option value="HARD">
                  Hard
                </option>
                <option value="MIXED">
                  Mixed
                </option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span>
              Showing{" "}
              <strong className="text-slate-900">
                {filteredQuizBoards.length}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-900">
                {quizBoards.length}
              </strong>{" "}
              Quiz Boards
            </span>

            {(search ||
              statusFilter !== "ALL" ||
              difficultyFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setDifficultyFilter("ALL");
                }}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* ==================================================
            LOADING
        ================================================== */}

        {isLoading && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-800">
                Loading Quiz Boards...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Fetching Quiz Board competitions from
                the server.
              </p>
            </div>
          </Card>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {!isLoading && error && (
          <Card className="border-red-200 bg-red-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-red-900">
                  Failed to load Quiz Boards
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={loadQuizBoards}
                  leftIcon={
                    <RefreshCw className="h-4 w-4" />
                  }
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ==================================================
            QUIZ BOARD LIST
        ================================================== */}

        {!isLoading &&
          !error &&
          filteredQuizBoards.length > 0 && (
            <div className="space-y-6">
              {filteredQuizBoards.map((quiz) => (
                <QuizBoardCard
                  key={getBoardId(quiz)}
                  quiz={quiz}
                  onStart={() =>
                    openActionModal(
                      quiz,
                      "start",
                    )
                  }
                  onCancel={() =>
                    openActionModal(
                      quiz,
                      "cancel",
                    )
                  }
                  onDelete={() =>
                    openActionModal(
                      quiz,
                      "delete",
                    )
                  }
                />
              ))}
            </div>
          )}

        {/* ==================================================
            FILTER EMPTY
        ================================================== */}

        {!isLoading &&
          !error &&
          quizBoards.length > 0 &&
          filteredQuizBoards.length === 0 && (
            <Card className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-8 w-8 text-slate-400" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No Quiz Boards found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No Quiz Board matches your current
                search and filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setDifficultyFilter("ALL");
                }}
                className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </Card>
          )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!isLoading &&
          !error &&
          quizBoards.length === 0 && (
            <Card className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No Quiz Boards yet
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Create your first Quiz Board, configure
                the subject and questions, set the entry
                fee and reward, then open registration for
                students.
              </p>

              <div className="mt-6">
                <Link
                  href="/admin/secondary/quiz-board/quiz-competitions/create"
                >
                  <Button
                    leftIcon={
                      <Plus className="h-4 w-4" />
                    }
                  >
                    Create Quiz Board
                  </Button>
                </Link>
              </div>
            </Card>
          )}

        {/* ==================================================
            ADMIN INFORMATION
        ================================================== */}

        {!isLoading && !error && (
          <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Layers3 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Quiz Board elimination structure
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Every Quiz Board supports up to 20
                  students and progresses through five
                  competitive stages.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(
                    Object.keys(
                      ROUND_CONFIG,
                    ) as unknown as RoundNumber[]
                  ).map((round) => {
                    const config =
                      ROUND_CONFIG[round];

                    return (
                      <div
                        key={round}
                        className="rounded-xl border border-blue-100 bg-white px-4 py-2.5"
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                          {config.label}
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                          {config.from} →{" "}
                          {config.to}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ======================================================
          ACTION MODAL
      ====================================================== */}

      {actionBoard && actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-board-action-title"
          >
            {/* Header */}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    actionType === "delete"
                      ? "bg-red-100 text-red-600"
                      : actionType === "cancel"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {actionType === "delete" ? (
                    <Trash2 className="h-6 w-6" />
                  ) : actionType === "cancel" ? (
                    <Square className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <h2
                    id="quiz-board-action-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    {actionModal.title}
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {actionModal.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeActionModal}
                disabled={isProcessing}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Board summary */}

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quiz Board
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {actionBoard.title}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    actionBoard.status,
                  )}`}
                >
                  {getStatusLabel(
                    actionBoard.status,
                  )}
                </span>

                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {getPlayerCount(actionBoard)} /{" "}
                  {actionBoard.maxPlayers ??
                    MAX_PLAYERS}{" "}
                  Players
                </span>

                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {getQuestionCount(actionBoard)}{" "}
                  Questions
                </span>
              </div>
            </div>

            {/* Warning */}

            {actionType === "delete" && (
              <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    This cannot be undone
                  </p>

                  <p className="mt-1 text-sm leading-5 text-amber-800">
                    Make sure this Quiz Board is not
                    currently running and that you no
                    longer need its questions,
                    configuration or participant data.
                  </p>
                </div>
              </div>
            )}

            {actionType === "start" && (
              <div className="mt-5 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <Radio className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Starting the live competition
                  </p>

                  <p className="mt-1 text-sm leading-5 text-blue-800">
                    The backend should take control of
                    the official timer, question order,
                    response timestamps and elimination
                    logic once the board starts.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}

            {actionError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Action failed
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      {actionError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeActionModal}
                disabled={isProcessing}
                className="sm:min-w-28"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant={
                  actionType === "delete"
                    ? "destructive"
                    : "default"
                }
                onClick={handleBoardAction}
                disabled={isProcessing}
                leftIcon={
                  isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : actionType === "delete" ? (
                    <Trash2 className="h-4 w-4" />
                  ) : actionType === "cancel" ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )
                }
              >
                {isProcessing
                  ? "Processing..."
                  : actionModal.button}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  live?: boolean;
}

function StatCard({
  icon,
  label,
  value,
  description,
  live = false,
}: StatCardProps) {
  return (
    <section
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        live
          ? "border-red-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            live
              ? "bg-red-50 text-red-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>

        {live && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            Live
          </span>
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value.toLocaleString("en-NG")}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </section>
  );
}

/* ============================================================
   LIVE SUMMARY CARD
============================================================ */

interface LiveSummaryCardProps {
  quiz: QuizBoard;
}

function LiveSummaryCard({
  quiz,
}: LiveSummaryCardProps) {
  const players = getPlayerCount(quiz);
  const maxPlayers =
    quiz.maxPlayers ?? MAX_PLAYERS;
  const round = getCurrentRound(quiz);

  return (
    <Link
      href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
        quiz,
      )}`}
      className="group rounded-2xl border border-red-100 bg-white p-5 transition hover:border-red-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900">
            {quiz.title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {getSubjectName(quiz)}
          </p>
        </div>

        <Radio className="h-5 w-5 shrink-0 text-red-600" />
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">
          {players}/{maxPlayers} players
        </span>

        <span className="font-bold text-red-600">
          {round
            ? ROUND_CONFIG[round].label
            : "Starting"}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-red-500 transition-all"
          style={{
            width: `${Math.min(
              100,
              (players / maxPlayers) * 100,
            )}%`,
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          {round
            ? `${ROUND_CONFIG[round].from} → ${ROUND_CONFIG[round].to}`
            : "Waiting"}
        </span>

        <span className="flex items-center gap-1 font-semibold text-red-600 group-hover:translate-x-0.5">
          Monitor
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

/* ============================================================
   QUIZ BOARD CARD
============================================================ */

interface QuizBoardCardProps {
  quiz: QuizBoard;
  onStart: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

function QuizBoardCard({
  quiz,
  onStart,
  onCancel,
  onDelete,
}: QuizBoardCardProps) {
  const status = normalizeStatus(
    quiz.status,
  );

  const boardId = getBoardId(quiz);

  const players = getPlayerCount(quiz);

  const maxPlayers =
    quiz.maxPlayers ?? MAX_PLAYERS;

  const playerProgress =
    getPlayerProgress(quiz);

  const questionCount =
    getQuestionCount(quiz);

  const round = getCurrentRound(quiz);

  const roundProgress =
    getRoundProgress(quiz);

  const canStart =
    status === "OPEN" ||
    status === "FULL" ||
    status === "UPCOMING";

  const canCancel =
    status === "OPEN" ||
    status === "FULL" ||
    status === "UPCOMING" ||
    status === "LIVE";

  return (
    <Card
      hoverable
      className={`overflow-hidden p-0 ${
        status === "LIVE"
          ? "border-red-200"
          : ""
      }`}
    >
      {/* LIVE TOP BAR */}

      {status === "LIVE" && (
        <div className="flex items-center justify-between bg-red-600 px-6 py-2.5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Live Quiz Board
          </div>

          <span className="text-xs font-semibold">
            {round
              ? ROUND_CONFIG[round].label
              : "Live"}
          </span>
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900">
                {quiz.title}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  quiz.status,
                )}`}
              >
                {getStatusLabel(
                  quiz.status,
                )}
              </span>

              {quiz.difficulty && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyClass(
                    quiz.difficulty,
                  )}`}
                >
                  {formatDifficulty(
                    quiz.difficulty,
                  )}
                </span>
              )}
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              {quiz.description ||
                "No description provided."}
            </p>

            {/* META */}

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                {getSubjectName(quiz)}
              </span>

              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                {players}/{maxPlayers} Players
              </span>

              <span className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                {questionCount}{" "}
                {questionCount === 1
                  ? "Question"
                  : "Questions"}
              </span>

              <span className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                {formatPoints(
                  getEntryPoints(quiz),
                )}{" "}
                CBT Points
              </span>

              <span className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                {formatPoints(
                  getRewardPoints(quiz),
                )}{" "}
                Points Reward
              </span>
            </div>
          </div>

          {/* PRIMARY ACTION */}

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}
            >
              <Button
                leftIcon={
                  <Settings2 className="h-4 w-4" />
                }
              >
                Manage
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ====================================================
            PLAYER CAPACITY
        ==================================================== */}

        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Player Capacity
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Maximum of {maxPlayers} students
                    can participate.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">
                    {players}
                    <span className="text-sm font-medium text-slate-400">
                      /{maxPlayers}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    status === "LIVE"
                      ? "bg-red-500"
                      : players >= maxPlayers
                        ? "bg-orange-500"
                        : "bg-blue-600"
                  }`}
                  style={{
                    width: `${playerProgress}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {players >= maxPlayers
                    ? "Board is full"
                    : `${maxPlayers - players} spots remaining`}
                </span>

                <span>
                  {Math.round(
                    playerProgress,
                  )}
                  %
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Participants
                </p>

                <p className="font-bold text-slate-900">
                  {players} joined
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            ROUND PROGRESS
        ==================================================== */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Elimination Progress
              </p>

              <p className="mt-1 text-xs text-slate-500">
                20 → 15 → 10 → 5 → 2 → 1
              </p>
            </div>

            {round && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {ROUND_CONFIG[round].label}
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {(
              [1, 2, 3, 4, 5] as RoundNumber[]
            ).map((roundNumber) => {
              const isCurrent =
                round === roundNumber;

              const isCompleted =
                round !== null &&
                roundNumber < round;

              const config =
                ROUND_CONFIG[roundNumber];

              return (
                <div
                  key={roundNumber}
                  className={`rounded-xl border p-3 text-center ${
                    isCurrent
                      ? "border-blue-300 bg-blue-50"
                      : isCompleted
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-green-600"
                          : "text-slate-400"
                    }`}
                  >
                    {config.label}
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {config.from} →{" "}
                    {config.to}
                  </p>
                </div>
              );
            })}
          </div>

          {round && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Stage {round} of 5
                </span>

                <span>
                  {Math.round(roundProgress)}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${roundProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ====================================================
            BOARD DETAILS
        ==================================================== */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile
            icon={
              <CalendarDays className="h-4 w-4" />
            }
            label="Starts"
            value={formatDateTime(
              getStartDate(quiz),
            )}
          />

          <InfoTile
            icon={
              <Clock3 className="h-4 w-4" />
            }
            label="Ends"
            value={formatDateTime(
              getEndDate(quiz),
            )}
          />

          <InfoTile
            icon={
              <Zap className="h-4 w-4" />
            }
            label="Entry"
            value={`${formatPoints(
              getEntryPoints(quiz),
            )} CBT`}
          />

          <InfoTile
            icon={
              <Trophy className="h-4 w-4" />
            }
            label="Winner Reward"
            value={`${formatPoints(
              getRewardPoints(quiz),
            )} Points`}
          />
        </div>

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
          {/* Manage */}

          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}
          >
            <Button
              variant="outline"
              leftIcon={
                <Settings2 className="h-4 w-4" />
              }
            >
              Manage
            </Button>
          </Link>

          {/* View */}

          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}
          >
            <Button
              variant="outline"
              leftIcon={
                <Eye className="h-4 w-4" />
              }
            >
              View
            </Button>
          </Link>

          {/* Live Monitor */}

          {status === "LIVE" && (
            <Link
              href={`/student/quiz-board/${boardId}/watch`}
            >
              <Button
                variant="outline"
                leftIcon={
                  <Radio className="h-4 w-4 text-red-600" />
                }
              >
                Watch Live
              </Button>
            </Link>
          )}

          {/* Edit */}

          {(status === "DRAFT" ||
            status === "UPCOMING") && (
            <Link
              href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}/edit`}
            >
              <Button
                variant="outline"
                leftIcon={
                  <Pencil className="h-4 w-4" />
                }
              >
                Edit
              </Button>
            </Link>
          )}

          {/* Start */}

          {canStart && (
            <Button
              type="button"
              onClick={onStart}
              leftIcon={
                <Play className="h-4 w-4" />
              }
            >
              Start Board
            </Button>
          )}

          {/* Cancel */}

          {canCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              leftIcon={
                <Square className="h-4 w-4" />
              }
            >
              Cancel
            </Button>
          )}

          {/* Delete */}

          {status !== "LIVE" && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              leftIcon={
                <Trash2 className="h-4 w-4" />
              }
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   INFO TILE
============================================================ */

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoTile({
  icon,
  label,
  value,
}: InfoTileProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-blue-600">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}