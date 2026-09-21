// Give me the complete replacement and when the Status is in progress remove ....Cancel, View and Manage btn.........Just let the Start Btn......<Link 
//   href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`} 
//   className="..." 
// > 
//   Start Quiz 
// </Link>..........................."use client"; 
 


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  AlertCircle,
  X,
  Users,
  Radio,
  Play,
  Square,
  CheckCircle2,
  CircleDot,
  Layers3,
  RefreshCw,
  Timer,
  ListChecks,
  Medal,
  DoorOpen,
  Lock,
  Check,
  Zap,
  Power,
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
  | "WAITING"
  | "IN_PROGRESS"
  | "UPCOMING"
  | "OPEN"
  | "FULL"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED"
  | string;

interface DifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

interface QuizSubject {
  _id?: string;
  name?: string;
}

interface EliminationRound {
  round_number: number;
  no_of_questions: number;
  difficultyBreakdown?: DifficultyBreakdown;
  exit_number: number;
  exit_reward: number;
}

interface FinalRoundInformation {
  no_of_questions: number;
  difficultyBreakdown?: DifficultyBreakdown;
  first_position_reward: number;
  second_position_reward: number;
}

interface QuizBoard {
  _id?: string;
  id?: string;

  quiz_title: string;
  description?: string;

  subject?: QuizSubject | string | null;

  status: QuizBoardStatus;

  time_per_question: number;

  start_date: string;

  no_of_contestants: number;

  number_of_rounds: number;

  joined_users?: string[];

  round_information?: EliminationRound[];

  final_round_information?: FinalRoundInformation;

  current_round?: number;

  room_id?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   API RESPONSE
============================================================ */

interface QuizBoardsResponse {
  success?: boolean;
  message?: string;
  data?: {
    totalCount?: number;
    totalPages?: number;
    quizzesObj?: QuizBoard[];
  };
}

/* ============================================================
   FILTERS
============================================================ */

const STATUS_OPTIONS = [
  "ALL",
  "DRAFT",
  "WAITING",
  "IN_PROGRESS",
  "FULL",
  "LIVE",
  "COMPLETED",
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number];

/* ============================================================
   HELPERS
============================================================ */

function normalizeStatus(status?: string) {
  return String(status || "DRAFT")
    .trim()
    .toUpperCase();
}

function getStatusLabel(status?: string) {
  switch (normalizeStatus(status)) {
    case "DRAFT":
      return "Draft";

    case "WAITING":
      return "Waiting";

    case "IN_PROGRESS":
      return "In Progress";

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

    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";

    case "OPEN":
      return "bg-blue-100 text-blue-700";

    case "FULL":
      return "bg-orange-100 text-orange-700";

    case "WAITING":
      return "bg-amber-100 text-amber-700";

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

function getBoardId(board: QuizBoard) {
  return board._id || board.id || "";
}

/* ============================================================
   SUBJECT
============================================================ */

function getSubjectLabel(board: QuizBoard) {
  if (!board.subject) {
    return "Subject not assigned";
  }

  if (typeof board.subject === "string") {
    return board.subject;
  }

  return board.subject.name || "Subject not assigned";
}

/* ============================================================
   PARTICIPANTS
============================================================ */

function getJoinedUsers(board: QuizBoard) {
  return Array.isArray(board.joined_users)
    ? board.joined_users
    : [];
}

function getJoinedCount(board: QuizBoard) {
  return getJoinedUsers(board).length;
}

function getContestantCapacity(board: QuizBoard) {
  return Number(board.no_of_contestants || 0);
}

function isQuizFull(board: QuizBoard) {
  const capacity = getContestantCapacity(board);

  if (capacity <= 0) {
    return false;
  }

  return getJoinedCount(board) >= capacity;
}

function hasRoom(board: QuizBoard) {
  return Boolean(board.room_id);
}

/* ============================================================
   QUESTIONS
============================================================ */

function getTotalEliminationQuestions(board: QuizBoard) {
  return (board.round_information || []).reduce(
    (total, round) =>
      total + Number(round.no_of_questions || 0),
    0,
  );
}

function getFinalQuestionCount(board: QuizBoard) {
  return Number(
    board.final_round_information?.no_of_questions || 0,
  );
}

function getTotalQuestionCount(board: QuizBoard) {
  return (
    getTotalEliminationQuestions(board) +
    getFinalQuestionCount(board)
  );
}

/* ============================================================
   REWARDS
============================================================ */

function getTotalRewards(board: QuizBoard) {
  const eliminationRewards = (
    board.round_information || []
  ).reduce(
    (total, round) =>
      total + Number(round.exit_reward || 0),
    0,
  );

  const finalRewards =
    Number(
      board.final_round_information
        ?.first_position_reward || 0,
    ) +
    Number(
      board.final_round_information
        ?.second_position_reward || 0,
    );

  return eliminationRewards + finalRewards;
}

/* ============================================================
   CURRENT ROUND
============================================================ */

function getCurrentRound(board: QuizBoard) {
  const currentRound = Number(board.current_round);

  if (Number.isFinite(currentRound) && currentRound > 0) {
    return currentRound;
  }

  if (normalizeStatus(board.status) === "LIVE") {
    return 1;
  }

  return null;
}

/* ============================================================
   API ERROR
============================================================ */

function getApiErrorMessage(error: unknown) {
  const axiosError = error as {
    response?: {
      status?: number;
      data?: {
        message?: string | string[];
        error?: string;
      };
    };
    message?: string;
  };

  const message = axiosError.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return (
    message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    "Something went wrong."
  );
}

/* ============================================================
   RESPONSE NORMALIZER
============================================================ */

function extractQuizBoards(payload: unknown): QuizBoard[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const root = payload as Record<string, unknown>;

  const data = root.data;

  if (data && typeof data === "object") {
    const dataObject = data as Record<string, unknown>;

    if (Array.isArray(dataObject.quizzesObj)) {
      return dataObject.quizzesObj as QuizBoard[];
    }
  }

  return [];
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminQuizCompetitionsPage() {
  const [quizBoards, setQuizBoards] = useState<QuizBoard[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  /* ==========================================================
     CREATE ROOM STATE
  ========================================================== */

  const [roomBoard, setRoomBoard] =
    useState<QuizBoard | null>(null);

  const [isCreatingRoom, setIsCreatingRoom] =
    useState(false);

  const [roomError, setRoomError] = useState("");

  /* ==========================================================
     ACTIVATE ROOM STATE
  ========================================================== */

  const [activatingRoomBoard, setActivatingRoomBoard] =
    useState<QuizBoard | null>(null);

  const [isActivatingRoom, setIsActivatingRoom] =
    useState(false);

  const [activateRoomError, setActivateRoomError] =
    useState("");

  /* ==========================================================
     OTHER ACTION STATE
  ========================================================== */

  const [actionBoard, setActionBoard] =
    useState<QuizBoard | null>(null);

  const [actionType, setActionType] =
    useState<"delete" | "cancel" | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [actionError, setActionError] = useState("");

  /* ==========================================================
     LOAD QUIZZES
  ========================================================== */

  const loadQuizBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response =
        await axiosInstance.get<QuizBoardsResponse>(
          "/quiz/get-all-quizzes",
        );

      console.log(
        "Quiz competitions response:",
        response.data,
      );

      const boards = extractQuizBoards(response.data);

      setQuizBoards(boards);
    } catch (err) {
      console.error(
        "Failed to load quiz competitions:",
        err,
      );

      setQuizBoards([]);

      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    loadQuizBoards();
  }, [loadQuizBoards]);

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredQuizBoards = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizBoards.filter((board) => {
      const title =
        board.quiz_title?.toLowerCase() || "";

      const description =
        board.description?.toLowerCase() || "";

      const subject =
        getSubjectLabel(board).toLowerCase();

      const status =
        normalizeStatus(board.status).toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        subject.includes(query) ||
        status.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(board.status) ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quizBoards, search, statusFilter]);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const statistics = useMemo(() => {
    const total = quizBoards.length;

    const draft = quizBoards.filter(
      (board) =>
        normalizeStatus(board.status) === "DRAFT",
    ).length;

    const waiting = quizBoards.filter(
      (board) =>
        normalizeStatus(board.status) === "WAITING",
    ).length;

    const inProgress = quizBoards.filter(
      (board) =>
        normalizeStatus(board.status) ===
        "IN_PROGRESS",
    ).length;

    const upcoming = quizBoards.filter(
      (board) =>
        normalizeStatus(board.status) === "UPCOMING",
    ).length;

    const live = quizBoards.filter(
      (board) =>
        normalizeStatus(board.status) === "LIVE",
    ).length;

    const completed = quizBoards.filter(
      (board) =>
        normalizeStatus(board.status) ===
        "COMPLETED",
    ).length;

    const fullBoards = quizBoards.filter(
      (board) => isQuizFull(board),
    ).length;

    const roomsCreated = quizBoards.filter(
      (board) => hasRoom(board),
    ).length;

    const totalParticipants = quizBoards.reduce(
      (total, board) =>
        total + getJoinedCount(board),
      0,
    );

    const totalQuestions = quizBoards.reduce(
      (total, board) =>
        total + getTotalQuestionCount(board),
      0,
    );

    return {
      total,
      draft,
      waiting,
      inProgress,
      upcoming,
      live,
      completed,
      fullBoards,
      roomsCreated,
      totalParticipants,
      totalQuestions,
    };
  }, [quizBoards]);

  /* ==========================================================
     CREATE ROOM
  ========================================================== */

  const openCreateRoom = (board: QuizBoard) => {
    setRoomError("");

    if (hasRoom(board)) {
      setRoomError(
        "A quiz room has already been created for this competition.",
      );
      return;
    }

    if (!isQuizFull(board)) {
      setRoomError(
        `The room cannot be created yet. ${getJoinedCount(
          board,
        )} of ${getContestantCapacity(
          board,
        )} contestants have joined.`,
      );
      return;
    }

    setRoomBoard(board);
  };

  const closeCreateRoom = () => {
    if (isCreatingRoom) {
      return;
    }

    setRoomBoard(null);
    setRoomError("");
  };

  const handleCreateRoom = async () => {
    if (!roomBoard) {
      return;
    }

    const quizId = getBoardId(roomBoard);

    if (!quizId) {
      setRoomError("Quiz ID is missing.");
      return;
    }

    const joined = getJoinedCount(roomBoard);
    const capacity = getContestantCapacity(roomBoard);

    if (joined < capacity) {
      setRoomError(
        `All contestants must join before creating the room. ${joined} of ${capacity} have joined.`,
      );
      return;
    }

    if (hasRoom(roomBoard)) {
      setRoomError(
        "A room has already been created for this quiz.",
      );
      return;
    }

    try {
      setIsCreatingRoom(true);
      setRoomError("");

      const response = await axiosInstance.post(
        `/quiz/create-room/${quizId}`,
      );

      console.log(
        "Create quiz room response:",
        response.data,
      );

      await loadQuizBoards();

      setRoomBoard(null);
    } catch (err) {
      console.error(
        "Failed to create quiz room:",
        err,
      );

      setRoomError(getApiErrorMessage(err));
    } finally {
      setIsCreatingRoom(false);
    }
  };

  /* ==========================================================
     ACTIVATE ROOM

     IMPORTANT:
     This intentionally calls the SAME endpoint again:

     POST /quiz/create-room/{quizId}
  ========================================================== */

  const openActivateRoom = (board: QuizBoard) => {
    setActivateRoomError("");

    if (!hasRoom(board)) {
      setActivateRoomError(
        "The quiz room has not been created yet.",
      );
      return;
    }

    if (
      normalizeStatus(board.status) !==
      "IN_PROGRESS"
    ) {
      setActivateRoomError(
        "The room can only be activated while the Quiz Board is in progress.",
      );
      return;
    }

    setActivatingRoomBoard(board);
  };

  const closeActivateRoom = () => {
    if (isActivatingRoom) {
      return;
    }

    setActivatingRoomBoard(null);
    setActivateRoomError("");
  };

  const handleActivateRoom = async () => {
    if (!activatingRoomBoard) {
      return;
    }

    const quizId = getBoardId(
      activatingRoomBoard,
    );

    if (!quizId) {
      setActivateRoomError("Quiz ID is missing.");
      return;
    }

    try {
      setIsActivatingRoom(true);
      setActivateRoomError("");

      const response = await axiosInstance.post(
        `/quiz/create-room/${quizId}`,
      );

      console.log(
        "Activate quiz room response:",
        response.data,
      );

      await loadQuizBoards();

      setActivatingRoomBoard(null);
    } catch (err) {
      console.error(
        "Failed to activate quiz room:",
        err,
      );

      setActivateRoomError(
        getApiErrorMessage(err),
      );
    } finally {
      setIsActivatingRoom(false);
    }
  };

  /* ==========================================================
     OTHER ACTION MODAL

     IMPORTANT:
     There is NO "start" action here.

     Start Quiz is a Link only.
  ========================================================== */

  const openActionModal = (
    board: QuizBoard,
    type: "delete" | "cancel",
  ) => {
    /*
     * IN_PROGRESS boards must never open the
     * cancel/delete action modal from the card.
     */
    if (
      normalizeStatus(board.status) ===
      "IN_PROGRESS"
    ) {
      return;
    }

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
     OTHER ACTIONS
  ========================================================== */

  const handleBoardAction = async () => {
    if (!actionBoard || !actionType) {
      return;
    }

    const boardId = getBoardId(actionBoard);

    if (!boardId) {
      setActionError(
        "Quiz Board ID is missing.",
      );
      return;
    }

    try {
      setIsProcessing(true);
      setActionError("");

      if (actionType === "delete") {
        await axiosInstance.delete(
          `/quiz-board/quiz-competitions/${boardId}`,
        );

        setQuizBoards((current) =>
          current.filter(
            (board) =>
              getBoardId(board) !== boardId,
          ),
        );
      }

      if (actionType === "cancel") {
        await axiosInstance.post(
          `/quiz-board/quiz-competitions/${boardId}/cancel`,
        );

        await loadQuizBoards();
      }

      setActionBoard(null);
      setActionType(null);
      setActionError("");
    } catch (err) {
      console.error(
        `Failed to ${actionType} Quiz Board:`,
        err,
      );

      setActionError(
        getApiErrorMessage(err),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /* ==========================================================
     ACTION MODAL TEXT
  ========================================================== */

  const actionModal = useMemo(() => {
    switch (actionType) {
      case "cancel":
        return {
          title: "Cancel Quiz Board?",
          description:
            "This will prevent the Quiz Board from continuing.",
          button: "Cancel Quiz Board",
        };

      case "delete":
        return {
          title: "Delete Quiz Board?",
          description:
            "This action cannot be undone.",
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
              Quiz Competitions
            </h1>

            <p className="mt-3 max-w-3xl text-lg leading-7 text-slate-600">
              Manage Quiz Board competitions,
              monitor contestant registration,
              create and activate rooms, and
              control the competition lifecycle.
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
                    isLoading
                      ? "animate-spin"
                      : ""
                  }`}
                />
              }
            >
              Refresh
            </Button>

            <Link href="/admin/secondary/quiz-board/quiz-competitions/create">
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
            STATISTICS
        ================================================== */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={
              <Trophy className="h-5 w-5" />
            }
            label="Total Boards"
            value={statistics.total}
            description="All competitions"
          />

          <StatCard
            icon={
              <Users className="h-5 w-5" />
            }
            label="Participants"
            value={statistics.totalParticipants}
            description="Joined contestants"
          />

          <StatCard
            icon={
              <CircleDot className="h-5 w-5" />
            }
            label="Waiting"
            value={statistics.waiting}
            description="Awaiting room/start"
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
              <DoorOpen className="h-5 w-5" />
            }
            label="Rooms Created"
            value={statistics.roomsCreated}
            description="Competition rooms"
          />
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {!isLoading && error && (
          <Card className="mb-8 border-red-200 bg-red-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-red-900">
                  Unable to load Quiz Competitions
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
            SEARCH / FILTER
        ================================================== */}

        {!isLoading && !error && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <Input
                  placeholder="Search by title, subject or status..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  leftIcon={
                    <Search className="h-4 w-4" />
                  }
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter,
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                aria-label="Filter by status"
              >
                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status === "ALL"
                        ? "All Statuses"
                        : getStatusLabel(
                            status,
                          )}
                    </option>
                  ),
                )}
              </select>
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
                statusFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </section>
        )}

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
                Loading Quiz Competitions...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Fetching competitions from the server.
              </p>
            </div>
          </Card>
        )}

        {/* ==================================================
            LIST
        ================================================== */}

        {!isLoading &&
          !error &&
          filteredQuizBoards.length > 0 && (
            <div className="space-y-6">
              {filteredQuizBoards.map(
                (board) => (
                  <QuizBoardCard
                    key={getBoardId(board)}
                    board={board}
                    onCreateRoom={() =>
                      openCreateRoom(board)
                    }
                    onActivateRoom={() =>
                      openActivateRoom(board)
                    }
                    onCancel={() =>
                      openActionModal(
                        board,
                        "cancel",
                      )
                    }
                    onDelete={() =>
                      openActionModal(
                        board,
                        "delete",
                      )
                    }
                  />
                ),
              )}
            </div>
          )}

        {/* ==================================================
            EMPTY FILTER
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
                search or filter.
              </p>
            </Card>
          )}

        {/* ==================================================
            EMPTY DATABASE
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
                Create your first Quiz Board and
                configure its elimination rounds,
                question difficulty, timing and
                final rewards.
              </p>

              <div className="mt-6">
                <Link href="/admin/secondary/quiz-board/quiz-competitions/create">
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
            STRUCTURE
        ================================================== */}

        {!isLoading && !error && (
          <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Layers3 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Quiz Board room flow
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Students first join the competition.
                  Once the required number of contestants
                  has been reached, the administrator can
                  create and activate the quiz room before
                  starting the quiz.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <StructurePill
                    label="1"
                    value="Students Join"
                  />

                  <StructurePill
                    label="2"
                    value="Reach Capacity"
                  />

                  <StructurePill
                    label="3"
                    value="Create Room"
                  />

                  <StructurePill
                    label="4"
                    value="Activate Room"
                  />

                  <StructurePill
                    label="5"
                    value="Start Quiz"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ======================================================
          CREATE ROOM MODAL
      ====================================================== */}

      {roomBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <DoorOpen className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Create Quiz Room
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    All required contestants have joined.
                    You can now create the competition room.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCreateRoom}
                disabled={isCreatingRoom}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quiz Competition
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {roomBoard.quiz_title}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">
                    Joined
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {getJoinedCount(roomBoard)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">
                    Required
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {getContestantCapacity(
                      roomBoard,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Competition is full
              </div>
            </div>

            {roomError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Unable to create room
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      {roomError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateRoom}
                disabled={isCreatingRoom}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleCreateRoom}
                disabled={isCreatingRoom}
                leftIcon={
                  isCreatingRoom ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <DoorOpen className="h-4 w-4" />
                  )
                }
              >
                {isCreatingRoom
                  ? "Creating Room..."
                  : "Create Quiz Room"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          ACTIVATE ROOM MODAL
      ====================================================== */}

      {activatingRoomBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Power className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Activate Quiz Room
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    This will activate the existing room
                    for this Quiz Board.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeActivateRoom}
                disabled={isActivatingRoom}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                Quiz Competition
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {activatingRoomBoard.quiz_title}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    activatingRoomBoard.status,
                  )}`}
                >
                  {getStatusLabel(
                    activatingRoomBoard.status,
                  )}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Room Created
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-blue-100 bg-white p-3">
                <p className="text-xs text-slate-500">
                  Room ID
                </p>

                <p className="mt-1 break-all font-mono text-sm font-bold text-slate-900">
                  {activatingRoomBoard.room_id ||
                    "—"}
                </p>
              </div>
            </div>

            {activateRoomError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Unable to activate room
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      {activateRoomError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeActivateRoom}
                disabled={isActivatingRoom}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleActivateRoom}
                disabled={isActivatingRoom}
                leftIcon={
                  isActivatingRoom ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )
                }
              >
                {isActivatingRoom
                  ? "Activating Room..."
                  : "Activate Room"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          ACTION MODAL
      ====================================================== */}

      {actionBoard && actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    actionType === "delete"
                      ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {actionType === "delete" ? (
                    <Trash2 className="h-6 w-6" />
                  ) : (
                    <Square className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
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
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quiz Board
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {actionBoard.quiz_title}
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
                  {getJoinedCount(actionBoard)} /{" "}
                  {getContestantCapacity(
                    actionBoard,
                  )}{" "}
                  Joined
                </span>

                {hasRoom(actionBoard) && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Room Created
                  </span>
                )}
              </div>
            </div>

            {actionType === "delete" && (
              <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    This cannot be undone
                  </p>

                  <p className="mt-1 text-sm leading-5 text-amber-800">
                    Make sure you no longer need this
                    Quiz Board.
                  </p>
                </div>
              </div>
            )}

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

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeActionModal}
                disabled={isProcessing}
              >
                Close
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
                  ) : (
                    <Square className="h-4 w-4" />
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
   STRUCTURE PILL
============================================================ */

function StructurePill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white px-4 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   QUIZ BOARD CARD
============================================================ */

interface QuizBoardCardProps {
  board: QuizBoard;
  onCreateRoom: () => void;
  onActivateRoom: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

function QuizBoardCard({
  board,
  onCreateRoom,
  onActivateRoom,
  onCancel,
  onDelete,
}: QuizBoardCardProps) {
  const status = normalizeStatus(board.status);

  const boardId = getBoardId(board);

  const contestants =
    getContestantCapacity(board);

  const joined = getJoinedCount(board);

  const isFull = isQuizFull(board);

  const roomCreated = hasRoom(board);

  const eliminationQuestions =
    getTotalEliminationQuestions(board);

  const finalQuestions =
    getFinalQuestionCount(board);

  const totalQuestions =
    getTotalQuestionCount(board);

  const totalRewards =
    getTotalRewards(board);

  const currentRound =
    getCurrentRound(board);

  const numberOfRounds =
    Number(board.number_of_rounds || 0);

  const canCreateRoom =
    isFull && !roomCreated;

  const canActivateRoom =
    roomCreated &&
    status === "IN_PROGRESS";

  /*
   * IMPORTANT:
   *
   * IN_PROGRESS action area contains ONLY
   * the Start Quiz Link.
   *
   * No View.
   * No Manage.
   * No Cancel.
   * No Delete.
   * No API call for Start Quiz.
   */

  return (
    <Card
      hoverable
      className={`overflow-hidden p-0 ${
        status === "LIVE"
          ? "border-red-200"
          : status === "IN_PROGRESS"
            ? "border-blue-200"
            : isFull && !roomCreated
              ? "border-blue-200"
              : ""
      }`}
    >
      {/* ====================================================
          LIVE HEADER
      ==================================================== */}

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
            {currentRound
              ? `Round ${currentRound}`
              : "LIVE"}
          </span>
        </div>
      )}

      {/* ====================================================
          IN PROGRESS HEADER
      ==================================================== */}

      {status === "IN_PROGRESS" && (
        <div className="flex items-center justify-between bg-blue-600 px-6 py-2.5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>

            Quiz Ready
          </div>

          <span className="text-xs font-semibold">
            Ready to Start
          </span>
        </div>
      )}

      <div className="p-6 md:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900">
                {board.quiz_title}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  board.status,
                )}`}
              >
                {getStatusLabel(
                  board.status,
                )}
              </span>

              {roomCreated && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <Check className="h-3.5 w-3.5" />
                  Room Created
                </span>
              )}
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              {board.description ||
                "No description provided."}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                {getSubjectLabel(board)}
              </span>

              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                {contestants} Contestants
              </span>

              <span className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-600" />
                {board.time_per_question}s /
                Question
              </span>

              {/* <span className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                {totalQuestions} Questions
              </span> */}

              <span className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-blue-600" />
                {numberOfRounds} Rounds
              </span>
            </div>
          </div>

          {/* ==================================================
              TOP RIGHT ACTION

              IN_PROGRESS:
              NOTHING HERE.

              Other statuses:
              Manage remains available.
          ================================================== */}

          {status !== "IN_PROGRESS" && (
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
          )}
        </div>

        {/* ==================================================
            PARTICIPANT CAPACITY
        ================================================== */}

        <div
          className={`mt-7 rounded-2xl border p-5 ${
            roomCreated
              ? "border-green-200 bg-green-50"
              : isFull
                ? "border-blue-200 bg-blue-50"
                : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users
                  className={`h-5 w-5 ${
                    roomCreated
                      ? "text-green-600"
                      : isFull
                        ? "text-blue-600"
                        : "text-slate-500"
                  }`}
                />

                <p className="text-sm font-bold text-slate-900">
                  Contestant Registration
                </p>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {roomCreated
                  ? "The quiz room has already been created."
                  : isFull
                    ? "All required contestants have joined. The room can now be created."
                    : "The room can only be created after all required contestants have joined."}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {joined}
                  <span className="text-slate-400">
                    {" "}
                    / {contestants}
                  </span>
                </p>

                <p className="text-xs font-medium text-slate-500">
                  contestants joined
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  roomCreated
                    ? "bg-green-100 text-green-600"
                    : isFull
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {roomCreated ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isFull ? (
                  <DoorOpen className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  roomCreated
                    ? "bg-green-500"
                    : isFull
                      ? "bg-blue-600"
                      : "bg-blue-400"
                }`}
                style={{
                  width: `${
                    contestants > 0
                      ? Math.min(
                          100,
                          (joined /
                            contestants) *
                            100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* ==================================================
              ROOM ACTION
          ================================================== */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              {roomCreated ? (
                <span className="font-semibold text-green-700">
                  Room ID:{" "}
                  <span className="font-mono">
                    {board.room_id}
                  </span>
                </span>
              ) : (
                <>
                  {joined < contestants
                    ? `${contestants - joined} more contestant${
                        contestants - joined ===
                        1
                          ? ""
                          : "s"
                      } needed`
                    : "Ready to create room"}
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {roomCreated ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    leftIcon={
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    }
                  >
                    Room Created
                  </Button>

                  {canActivateRoom && (
                    <Button
                      type="button"
                      onClick={onActivateRoom}
                      leftIcon={
                        <Power className="h-4 w-4" />
                      }
                    >
                      Activate Room
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  type="button"
                  onClick={onCreateRoom}
                  disabled={!canCreateRoom}
                  leftIcon={
                    canCreateRoom ? (
                      <DoorOpen className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )
                  }
                  title={
                    canCreateRoom
                      ? "Create quiz room"
                      : `Waiting for all contestants: ${joined}/${contestants}`
                  }
                >
                  {canCreateRoom
                    ? "Create Quiz Room"
                    : "Waiting for Contestants"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            BOARD SUMMARY
        ================================================== */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile
            icon={
              <CalendarDays className="h-4 w-4" />
            }
            label="Starts"
            value={formatDateTime(
              board.start_date,
            )}
          />

          <InfoTile
            icon={
              <Clock3 className="h-4 w-4" />
            }
            label="Time / Question"
            value={`${board.time_per_question} seconds`}
          />

          <InfoTile
            icon={
              <ListChecks className="h-4 w-4" />
            }
            label="Questions"
            value={`${totalQuestions} total`}
          />

          <InfoTile
            icon={
              <Medal className="h-4 w-4" />
            }
            label="Final Winner"
            value={`${formatPoints(
              board.final_round_information
                ?.first_position_reward,
            )} Points`}
          />
        </div>

        {/* ==================================================
            ROUND SUMMARY
        ================================================== */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Competition Structure
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {board.round_information
                  ?.length || 0}{" "}
                elimination rounds + Final
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {eliminationQuestions} Elimination
                Questions
              </span>

              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                {finalQuestions} Final Questions
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {(board.round_information || []).map(
              (round) => (
                <div
                  key={round.round_number}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      Round{" "}
                      {round.round_number}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      Exit {round.exit_number}
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {round.no_of_questions}{" "}
                    Questions
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                      E{" "}
                      {round
                        .difficultyBreakdown
                        ?.easy ?? 0}
                    </span>

                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-700">
                      M{" "}
                      {round
                        .difficultyBreakdown
                        ?.medium ?? 0}
                    </span>

                    <span className="rounded-full bg-red-100 px-2 py-1 text-red-700">
                      H{" "}
                      {round
                        .difficultyBreakdown
                        ?.hard ?? 0}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Exit reward:{" "}
                    <strong className="text-slate-800">
                      {round.exit_reward} Points
                    </strong>
                  </p>
                </div>
              ),
            )}
          </div>

          {/* FINAL */}

          {board.final_round_information && (
            <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-purple-700">
                    Final Round
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {
                      board
                        .final_round_information
                        .no_of_questions
                    }{" "}
                    Questions
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white px-3 py-1.5 text-green-700">
                    Easy{" "}
                    {board
                      .final_round_information
                      .difficultyBreakdown
                      ?.easy ?? 0}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5 text-yellow-700">
                    Medium{" "}
                    {board
                      .final_round_information
                      .difficultyBreakdown
                      ?.medium ?? 0}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5 text-red-700">
                    Hard{" "}
                    {board
                      .final_round_information
                      .difficultyBreakdown
                      ?.hard ?? 0}
                  </span>

                  <span className="rounded-full bg-purple-700 px-3 py-1.5 text-white">
                    1st:{" "}
                    {
                      board
                        .final_round_information
                        .first_position_reward
                    }
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5 text-purple-700">
                    2nd:{" "}
                    {
                      board
                        .final_round_information
                        .second_position_reward
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            REWARD SUMMARY
        ================================================== */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <InfoTile
            icon={
              <Zap className="h-4 w-4" />
            }
            label="Total Rewards"
            value={`${formatPoints(
              totalRewards,
            )} Points configured`}
          />

          <InfoTile
            icon={
              <Trophy className="h-4 w-4" />
            }
            label="Final Rewards"
            value={`${formatPoints(
              board.final_round_information
                ?.first_position_reward,
            )} / ${formatPoints(
              board.final_round_information
                ?.second_position_reward,
            )} Points`}
          />
        </div>

        {/* ==================================================
            ACTIONS

            IMPORTANT:

            IN_PROGRESS:
              ONLY Start Quiz

            NO:
              View
              Manage
              Cancel
              Delete
        ================================================== */}

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">

          {/* ==================================================
              IN_PROGRESS

              START QUIZ IS ONLY A LINK.

              NO API REQUEST.
              NO MODAL.
          ================================================== */}

          {status === "IN_PROGRESS" ? (
            <Link
              href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}
            >
              <Button
                type="button"
                leftIcon={
                  <Play className="h-4 w-4" />
                }
              >
                Start Quiz
              </Button>
            </Link>
          ) : (
            <>
              {/* ============================================
                  VIEW
              ============================================ */}

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

              {/* ============================================
                  EDIT
              ============================================ */}

              {(status === "DRAFT" ||
                status === "WAITING" ||
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

              {/* ============================================
                  LIVE
              ============================================ */}

              {status === "LIVE" && (
                <Link
                  href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}
                >
                  <Button
                    variant="outline"
                    leftIcon={
                      <Radio className="h-4 w-4 text-red-600" />
                    }
                  >
                    Monitor Live
                  </Button>
                </Link>
              )}

              {/* ============================================
                  CANCEL

                  IN_PROGRESS NEVER REACHES THIS BRANCH.
              ============================================ */}

              {(status === "WAITING" ||
                status === "UPCOMING" ||
                status === "OPEN" ||
                status === "FULL" ||
                status === "LIVE") && (
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

              {/* ============================================
                  DELETE
              ============================================ */}

              {(status === "DRAFT" ||
                status === "WAITING" ||
                status === "UPCOMING") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onDelete}
                  leftIcon={
                    <Trash2 className="h-4 w-4" />
                  }
                >
                  Delete
                </Button>
              )}
            </>
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
















//  "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   Plus,
//   Search,
//   Trophy,
//   CalendarDays,
//   Clock3,
//   Eye,
//   Pencil,
//   Trash2,
//   Settings2,
//   BookOpen,
//   ChevronRight,
//   Loader2,
//   AlertCircle,
//   X,
//   Users,
//   Radio,
//   Play,
//   Square,
//   CheckCircle2,
//   CircleDot,
//   Zap,
//   Target,
//   Layers3,
//   RefreshCw,
//   Timer,
//   ListChecks,
//   Medal,
//   DoorOpen,
//   Lock,
//   Check,
//   Power,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// import { axiosInstance } from "@/lib/api/axios";

// /* ============================================================
//    TYPES
// ============================================================ */

// type QuizBoardStatus =
//   | "DRAFT"
//   | "WAITING"
//   | "IN_PROGRESS"
//   | "UPCOMING"
//   | "OPEN"
//   | "FULL"
//   | "LIVE"
//   | "COMPLETED"
//   | "CANCELLED"
//   | string;

// interface DifficultyBreakdown {
//   easy: number;
//   medium: number;
//   hard: number;
// }

// interface QuizSubject {
//   _id?: string;
//   name?: string;
// }

// interface EliminationRound {
//   round_number: number;
//   no_of_questions: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   exit_number: number;
//   exit_reward: number;
// }

// interface FinalRoundInformation {
//   no_of_questions: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   first_position_reward: number;
//   second_position_reward: number;
// }

// interface QuizBoard {
//   _id?: string;
//   id?: string;

//   quiz_title: string;
//   description?: string;

//   subject?: QuizSubject | string | null;

//   status: QuizBoardStatus;

//   time_per_question: number;

//   start_date: string;

//   no_of_contestants: number;

//   number_of_rounds: number;

//   joined_users?: string[];

//   round_information?: EliminationRound[];

//   final_round_information?: FinalRoundInformation;

//   current_round?: number;

//   room_id?: string | null;

//   createdAt?: string;
//   updatedAt?: string;
// }

// /* ============================================================
//    API RESPONSE
// ============================================================ */

// interface QuizBoardsResponse {
//   success?: boolean;
//   message?: string;
//   data?: {
//     totalCount?: number;
//     totalPages?: number;
//     quizzesObj?: QuizBoard[];
//   };
// }

// /* ============================================================
//    FILTERS
// ============================================================ */

// const STATUS_OPTIONS = [
//   "ALL",
//   "DRAFT",
//   "WAITING",
//   "IN_PROGRESS",
//   "FULL",
//   "LIVE",
//   "COMPLETED",
// ] as const;

// type StatusFilter = (typeof STATUS_OPTIONS)[number];

// /* ============================================================
//    HELPERS
// ============================================================ */

// function normalizeStatus(status?: string) {
//   return String(status || "DRAFT")
//     .trim()
//     .toUpperCase();
// }

// function getStatusLabel(status?: string) {
//   switch (normalizeStatus(status)) {
//     case "DRAFT":
//       return "Draft";

//     case "WAITING":
//       return "Waiting";

//     case "IN_PROGRESS":
//       return "In Progress";

//     case "UPCOMING":
//       return "Upcoming";

//     case "OPEN":
//       return "Registration Open";

//     case "FULL":
//       return "Full";

//     case "LIVE":
//       return "Live";

//     case "COMPLETED":
//       return "Completed";

//     case "CANCELLED":
//       return "Cancelled";

//     default:
//       return status || "Unknown";
//   }
// }

// function getStatusClass(status?: string) {
//   switch (normalizeStatus(status)) {
//     case "LIVE":
//       return "bg-red-100 text-red-700";

//     case "IN_PROGRESS":
//       return "bg-blue-100 text-blue-700";

//     case "OPEN":
//       return "bg-blue-100 text-blue-700";

//     case "FULL":
//       return "bg-orange-100 text-orange-700";

//     case "WAITING":
//       return "bg-amber-100 text-amber-700";

//     case "UPCOMING":
//       return "bg-yellow-100 text-yellow-700";

//     case "COMPLETED":
//       return "bg-green-100 text-green-700";

//     case "DRAFT":
//       return "bg-purple-100 text-purple-700";

//     case "CANCELLED":
//       return "bg-slate-200 text-slate-600";

//     default:
//       return "bg-slate-100 text-slate-600";
//   }
// }

// function formatDateTime(dateString?: string) {
//   if (!dateString) {
//     return "—";
//   }

//   const date = new Date(dateString);

//   if (Number.isNaN(date.getTime())) {
//     return "—";
//   }

//   return new Intl.DateTimeFormat("en-NG", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(date);
// }

// function formatPoints(value?: number) {
//   if (typeof value !== "number" || Number.isNaN(value)) {
//     return "0";
//   }

//   return value.toLocaleString("en-NG");
// }

// function getBoardId(board: QuizBoard) {
//   return board._id || board.id || "";
// }

// /* ============================================================
//    SUBJECT
// ============================================================ */

// function getSubjectLabel(board: QuizBoard) {
//   if (!board.subject) {
//     return "Subject not assigned";
//   }

//   if (typeof board.subject === "string") {
//     return board.subject;
//   }

//   return board.subject.name || "Subject not assigned";
// }

// /* ============================================================
//    PARTICIPANTS
// ============================================================ */

// function getJoinedUsers(board: QuizBoard) {
//   return Array.isArray(board.joined_users)
//     ? board.joined_users
//     : [];
// }

// function getJoinedCount(board: QuizBoard) {
//   return getJoinedUsers(board).length;
// }

// function getContestantCapacity(board: QuizBoard) {
//   return Number(board.no_of_contestants || 0);
// }

// function isQuizFull(board: QuizBoard) {
//   const capacity = getContestantCapacity(board);

//   if (capacity <= 0) {
//     return false;
//   }

//   return getJoinedCount(board) >= capacity;
// }

// function hasRoom(board: QuizBoard) {
//   return Boolean(board.room_id);
// }

// /* ============================================================
//    QUESTIONS
// ============================================================ */

// function getTotalEliminationQuestions(board: QuizBoard) {
//   return (board.round_information || []).reduce(
//     (total, round) =>
//       total + Number(round.no_of_questions || 0),
//     0,
//   );
// }

// function getFinalQuestionCount(board: QuizBoard) {
//   return Number(
//     board.final_round_information?.no_of_questions || 0,
//   );
// }

// function getTotalQuestionCount(board: QuizBoard) {
//   return (
//     getTotalEliminationQuestions(board) +
//     getFinalQuestionCount(board)
//   );
// }

// /* ============================================================
//    REWARDS
// ============================================================ */

// function getTotalRewards(board: QuizBoard) {
//   const eliminationRewards = (
//     board.round_information || []
//   ).reduce(
//     (total, round) =>
//       total + Number(round.exit_reward || 0),
//     0,
//   );

//   const finalRewards =
//     Number(
//       board.final_round_information
//         ?.first_position_reward || 0,
//     ) +
//     Number(
//       board.final_round_information
//         ?.second_position_reward || 0,
//     );

//   return eliminationRewards + finalRewards;
// }

// /* ============================================================
//    CURRENT ROUND
// ============================================================ */

// function getCurrentRound(board: QuizBoard) {
//   const currentRound = Number(board.current_round);

//   if (Number.isFinite(currentRound) && currentRound > 0) {
//     return currentRound;
//   }

//   if (normalizeStatus(board.status) === "LIVE") {
//     return 1;
//   }

//   return null;
// }

// /* ============================================================
//    API ERROR
// ============================================================ */

// function getApiErrorMessage(error: unknown) {
//   const axiosError = error as {
//     response?: {
//       status?: number;
//       data?: {
//         message?: string | string[];
//         error?: string;
//       };
//     };
//     message?: string;
//   };

//   const message = axiosError.response?.data?.message;

//   if (Array.isArray(message)) {
//     return message.join(", ");
//   }

//   return (
//     message ||
//     axiosError.response?.data?.error ||
//     axiosError.message ||
//     "Something went wrong."
//   );
// }

// /* ============================================================
//    RESPONSE NORMALIZER
// ============================================================ */

// function extractQuizBoards(payload: unknown): QuizBoard[] {
//   if (!payload || typeof payload !== "object") {
//     return [];
//   }

//   const root = payload as Record<string, unknown>;

//   const data = root.data;

//   if (data && typeof data === "object") {
//     const dataObject = data as Record<string, unknown>;

//     if (Array.isArray(dataObject.quizzesObj)) {
//       return dataObject.quizzesObj as QuizBoard[];
//     }
//   }

//   return [];
// }

// /* ============================================================
//    PAGE
// ============================================================ */

// export default function AdminQuizCompetitionsPage() {
//   const [quizBoards, setQuizBoards] = useState<QuizBoard[]>([]);

//   const [isLoading, setIsLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");

//   const [statusFilter, setStatusFilter] =
//     useState<StatusFilter>("ALL");

//   /* ==========================================================
//      CREATE ROOM STATE
//   ========================================================== */

//   const [roomBoard, setRoomBoard] =
//     useState<QuizBoard | null>(null);

//   const [isCreatingRoom, setIsCreatingRoom] =
//     useState(false);

//   const [roomError, setRoomError] = useState("");

//   /* ==========================================================
//      ACTIVATE ROOM STATE
//   ========================================================== */

//   const [activatingRoomBoard, setActivatingRoomBoard] =
//     useState<QuizBoard | null>(null);

//   const [isActivatingRoom, setIsActivatingRoom] =
//     useState(false);

//   const [activateRoomError, setActivateRoomError] =
//     useState("");

//   /* ==========================================================
//      OTHER ACTION STATE
//   ========================================================== */

//   const [actionBoard, setActionBoard] =
//     useState<QuizBoard | null>(null);

//   const [actionType, setActionType] =
//     useState<"delete" | "start" | "cancel" | null>(null);

//   const [isProcessing, setIsProcessing] = useState(false);

//   const [actionError, setActionError] = useState("");

//   /* ==========================================================
//      LOAD QUIZZES
//   ========================================================== */

//   const loadQuizBoards = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError("");

//       const response =
//         await axiosInstance.get<QuizBoardsResponse>(
//           "/quiz/get-all-quizzes",
//         );

//       console.log(
//         "Quiz competitions response:",
//         response.data,
//       );

//       const boards = extractQuizBoards(response.data);

//       setQuizBoards(boards);
//     } catch (err) {
//       console.error(
//         "Failed to load quiz competitions:",
//         err,
//       );

//       setQuizBoards([]);

//       setError(getApiErrorMessage(err));
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   /* ==========================================================
//      INITIAL LOAD
//   ========================================================== */

//   useEffect(() => {
//     loadQuizBoards();
//   }, [loadQuizBoards]);

//   /* ==========================================================
//      FILTER
//   ========================================================== */

//   const filteredQuizBoards = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return quizBoards.filter((board) => {
//       const title =
//         board.quiz_title?.toLowerCase() || "";

//       const description =
//         board.description?.toLowerCase() || "";

//       const subject =
//         getSubjectLabel(board).toLowerCase();

//       const status =
//         normalizeStatus(board.status).toLowerCase();

//       const matchesSearch =
//         !query ||
//         title.includes(query) ||
//         description.includes(query) ||
//         subject.includes(query) ||
//         status.includes(query);

//       const matchesStatus =
//         statusFilter === "ALL" ||
//         normalizeStatus(board.status) === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [quizBoards, search, statusFilter]);

//   /* ==========================================================
//      STATISTICS
//   ========================================================== */

//   const statistics = useMemo(() => {
//     const total = quizBoards.length;

//     const draft = quizBoards.filter(
//       (board) =>
//         normalizeStatus(board.status) === "DRAFT",
//     ).length;

//     const waiting = quizBoards.filter(
//       (board) =>
//         normalizeStatus(board.status) === "WAITING",
//     ).length;

//     const inProgress = quizBoards.filter(
//       (board) =>
//         normalizeStatus(board.status) === "IN_PROGRESS",
//     ).length;

//     const upcoming = quizBoards.filter(
//       (board) =>
//         normalizeStatus(board.status) === "UPCOMING",
//     ).length;

//     const live = quizBoards.filter(
//       (board) =>
//         normalizeStatus(board.status) === "LIVE",
//     ).length;

//     const completed = quizBoards.filter(
//       (board) =>
//         normalizeStatus(board.status) === "COMPLETED",
//     ).length;

//     const fullBoards = quizBoards.filter(
//       (board) => isQuizFull(board),
//     ).length;

//     const roomsCreated = quizBoards.filter(
//       (board) => hasRoom(board),
//     ).length;

//     const totalParticipants = quizBoards.reduce(
//       (total, board) =>
//         total + getJoinedCount(board),
//       0,
//     );

//     const totalQuestions = quizBoards.reduce(
//       (total, board) =>
//         total + getTotalQuestionCount(board),
//       0,
//     );

//     return {
//       total,
//       draft,
//       waiting,
//       inProgress,
//       upcoming,
//       live,
//       completed,
//       fullBoards,
//       roomsCreated,
//       totalParticipants,
//       totalQuestions,
//     };
//   }, [quizBoards]);

//   /* ==========================================================
//      CREATE ROOM
//   ========================================================== */

//   const openCreateRoom = (board: QuizBoard) => {
//     setRoomError("");

//     if (hasRoom(board)) {
//       setRoomError(
//         "A quiz room has already been created for this competition.",
//       );
//       return;
//     }

//     if (!isQuizFull(board)) {
//       setRoomError(
//         `The room cannot be created yet. ${getJoinedCount(
//           board,
//         )} of ${getContestantCapacity(
//           board,
//         )} contestants have joined.`,
//       );
//       return;
//     }

//     setRoomBoard(board);
//   };

//   const closeCreateRoom = () => {
//     if (isCreatingRoom) {
//       return;
//     }

//     setRoomBoard(null);
//     setRoomError("");
//   };

//   const handleCreateRoom = async () => {
//     if (!roomBoard) {
//       return;
//     }

//     const quizId = getBoardId(roomBoard);

//     if (!quizId) {
//       setRoomError("Quiz ID is missing.");
//       return;
//     }

//     const joined = getJoinedCount(roomBoard);
//     const capacity = getContestantCapacity(roomBoard);

//     if (joined < capacity) {
//       setRoomError(
//         `All contestants must join before creating the room. ${joined} of ${capacity} have joined.`,
//       );
//       return;
//     }

//     if (hasRoom(roomBoard)) {
//       setRoomError(
//         "A room has already been created for this quiz.",
//       );
//       return;
//     }

//     try {
//       setIsCreatingRoom(true);
//       setRoomError("");

//       const response = await axiosInstance.post(
//         `/quiz/create-room/${quizId}`,
//       );

//       console.log(
//         "Create quiz room response:",
//         response.data,
//       );

//       await loadQuizBoards();

//       setRoomBoard(null);
//     } catch (err) {
//       console.error(
//         "Failed to create quiz room:",
//         err,
//       );

//       setRoomError(
//         getApiErrorMessage(err),
//       );
//     } finally {
//       setIsCreatingRoom(false);
//     }
//   };

//   /* ==========================================================
//      ACTIVATE ROOM
     
//      IMPORTANT:
//      This intentionally calls the SAME endpoint again:
     
//      POST /quiz/create-room/{quizId}
//   ========================================================== */

//   const openActivateRoom = (board: QuizBoard) => {
//     setActivateRoomError("");

//     if (!hasRoom(board)) {
//       setActivateRoomError(
//         "The quiz room has not been created yet.",
//       );
//       return;
//     }

//     if (
//       normalizeStatus(board.status) !==
//       "IN_PROGRESS"
//     ) {
//       setActivateRoomError(
//         "The room can only be activated while the Quiz Board is in progress.",
//       );
//       return;
//     }

//     setActivatingRoomBoard(board);
//   };

//   const closeActivateRoom = () => {
//     if (isActivatingRoom) {
//       return;
//     }

//     setActivatingRoomBoard(null);
//     setActivateRoomError("");
//   };

//   const handleActivateRoom = async () => {
//     if (!activatingRoomBoard) {
//       return;
//     }

//     const quizId = getBoardId(
//       activatingRoomBoard,
//     );

//     if (!quizId) {
//       setActivateRoomError(
//         "Quiz ID is missing.",
//       );
//       return;
//     }

//     try {
//       setIsActivatingRoom(true);
//       setActivateRoomError("");

//       /*
//        * The backend uses the same endpoint for
//        * room activation.
//        */
//       const response = await axiosInstance.post(
//         `/quiz/create-room/${quizId}`,
//       );

//       console.log(
//         "Activate quiz room response:",
//         response.data,
//       );

//       /*
//        * Refresh the competitions so the latest
//        * backend status/room information is shown.
//        */
//       await loadQuizBoards();

//       setActivatingRoomBoard(null);
//     } catch (err) {
//       console.error(
//         "Failed to activate quiz room:",
//         err,
//       );

//       setActivateRoomError(
//         getApiErrorMessage(err),
//       );
//     } finally {
//       setIsActivatingRoom(false);
//     }
//   };

//   /* ==========================================================
//      OTHER ACTION MODAL
//   ========================================================== */

//   const openActionModal = (
//     board: QuizBoard,
//     type: "delete" | "start" | "cancel",
//   ) => {
//     setActionBoard(board);
//     setActionType(type);
//     setActionError("");
//   };

//   const closeActionModal = () => {
//     if (isProcessing) {
//       return;
//     }

//     setActionBoard(null);
//     setActionType(null);
//     setActionError("");
//   };

//   /* ==========================================================
//      OTHER ACTIONS
//   ========================================================== */

//   const handleBoardAction = async () => {
//     if (!actionBoard) {
//       return;
//     }

//     const boardId = getBoardId(actionBoard);

//     if (!boardId) {
//       setActionError(
//         "Quiz Board ID is missing.",
//       );
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       setActionError("");

//       if (actionType === "delete") {
//         await axiosInstance.delete(
//           `/quiz-board/quiz-competitions/${boardId}`,
//         );

//         setQuizBoards((current) =>
//           current.filter(
//             (board) =>
//               getBoardId(board) !== boardId,
//           ),
//         );
//       }

//       if (actionType === "start") {
//         await axiosInstance.post(
//           `/quiz-board/quiz-competitions/${boardId}/start`,

//            // href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}

//         );

//         await loadQuizBoards();
//       }

//       if (actionType === "cancel") {
//         await axiosInstance.post(
//           `/quiz-board/quiz-competitions/${boardId}/cancel`,
//         );

//         await loadQuizBoards();
//       }

//       /*
//        * Close the modal directly here.
//        * This avoids the React state timing issue
//        * where closeActionModal() could see
//        * isProcessing as still true.
//        */
//       setActionBoard(null);
//       setActionType(null);
//       setActionError("");
//     } catch (err) {
//       console.error(
//         `Failed to ${actionType} Quiz Board:`,
//         err,
//       );

//       setActionError(
//         getApiErrorMessage(err),
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   /* ==========================================================
//      ACTION MODAL TEXT
//   ========================================================== */

//   const actionModal = useMemo(() => {
//     switch (actionType) {
//       case "start":
//         return {
//           title: "Start Quiz Board?",
//           description:
//             "Starting this Quiz Board will make the competition live for participating students.",
//           button: "Start Quiz Board",
//         };

//       case "cancel":
//         return {
//           title: "Cancel Quiz Board?",
//           description:
//             "This will prevent the Quiz Board from continuing.",
//           button: "Cancel Quiz Board",
//         };

//       case "delete":
//         return {
//           title: "Delete Quiz Board?",
//           description:
//             "This action cannot be undone.",
//           button: "Delete Quiz Board",
//         };

//       default:
//         return null;
//     }
//   }, [actionType]);

//   /* ==========================================================
//      RENDER
//   ========================================================== */

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-4 py-10">

//         {/* ==================================================
//             HEADER
//         ================================================== */}

//         <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//           <div>
//             <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
//               <Trophy className="h-4 w-4" />
//               Quiz Board Administration
//             </div>

//             <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
//               Quiz Competitions
//             </h1>

//             <p className="mt-3 max-w-3xl text-lg leading-7 text-slate-600">
//               Manage Quiz Board competitions,
//               monitor contestant registration,
//               create and activate rooms, and
//               control the competition lifecycle.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={loadQuizBoards}
//               disabled={isLoading}
//               leftIcon={
//                 <RefreshCw
//                   className={`h-4 w-4 ${
//                     isLoading
//                       ? "animate-spin"
//                       : ""
//                   }`}
//                 />
//               }
//             >
//               Refresh
//             </Button>

//             <Link href="/admin/secondary/quiz-board/quiz-competitions/create">
//               <Button
//                 leftIcon={
//                   <Plus className="h-4 w-4" />
//                 }
//               >
//                 Create Quiz Board
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* ==================================================
//             STATISTICS
//         ================================================== */}

//         <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
//           <StatCard
//             icon={
//               <Trophy className="h-5 w-5" />
//             }
//             label="Total Boards"
//             value={statistics.total}
//             description="All competitions"
//           />

//           <StatCard
//             icon={
//               <Users className="h-5 w-5" />
//             }
//             label="Participants"
//             value={statistics.totalParticipants}
//             description="Joined contestants"
//           />

//           <StatCard
//             icon={
//               <CircleDot className="h-5 w-5" />
//             }
//             label="Waiting"
//             value={statistics.waiting}
//             description="Awaiting room/start"
//           />

//           <StatCard
//             icon={
//               <Radio className="h-5 w-5" />
//             }
//             label="Live"
//             value={statistics.live}
//             description="Currently running"
//             live={statistics.live > 0}
//           />

//           <StatCard
//             icon={
//               <DoorOpen className="h-5 w-5" />
//             }
//             label="Rooms Created"
//             value={statistics.roomsCreated}
//             description="Competition rooms"
//           />
//         </div>

//         {/* ==================================================
//             ERROR
//         ================================================== */}

//         {!isLoading && error && (
//           <Card className="mb-8 border-red-200 bg-red-50 p-8">
//             <div className="flex items-start gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
//                 <AlertCircle className="h-5 w-5 text-red-600" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <h2 className="font-bold text-red-900">
//                   Unable to load Quiz Competitions
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-red-700">
//                   {error}
//                 </p>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="mt-4"
//                   onClick={loadQuizBoards}
//                   leftIcon={
//                     <RefreshCw className="h-4 w-4" />
//                   }
//                 >
//                   Try Again
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             SEARCH / FILTER
//         ================================================== */}

//         {!isLoading && !error && (
//           <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
//               <div className="min-w-0 flex-1">
//                 <Input
//                   placeholder="Search by title, subject or status..."
//                   value={search}
//                   onChange={(event) =>
//                     setSearch(event.target.value)
//                   }
//                   leftIcon={
//                     <Search className="h-4 w-4" />
//                   }
//                 />
//               </div>

//               <select
//                 value={statusFilter}
//                 onChange={(event) =>
//                   setStatusFilter(
//                     event.target.value as StatusFilter,
//                   )
//                 }
//                 className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//                 aria-label="Filter by status"
//               >
//                 {STATUS_OPTIONS.map((status) => (
//                   <option
//                     key={status}
//                     value={status}
//                   >
//                     {status === "ALL"
//                       ? "All Statuses"
//                       : getStatusLabel(status)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
//               <span>
//                 Showing{" "}
//                 <strong className="text-slate-900">
//                   {filteredQuizBoards.length}
//                 </strong>{" "}
//                 of{" "}
//                 <strong className="text-slate-900">
//                   {quizBoards.length}
//                 </strong>{" "}
//                 Quiz Boards
//               </span>

//               {(search ||
//                 statusFilter !== "ALL") && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSearch("");
//                     setStatusFilter("ALL");
//                   }}
//                   className="font-semibold text-blue-600 hover:text-blue-700"
//                 >
//                   Clear filters
//                 </button>
//               )}
//             </div>
//           </section>
//         )}

//         {/* ==================================================
//             LOADING
//         ================================================== */}

//         {isLoading && (
//           <Card className="p-12">
//             <div className="flex flex-col items-center justify-center text-center">
//               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
//                 <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
//               </div>

//               <p className="mt-5 text-sm font-semibold text-slate-800">
//                 Loading Quiz Competitions...
//               </p>

//               <p className="mt-1 text-sm text-slate-500">
//                 Fetching competitions from the server.
//               </p>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             LIST
//         ================================================== */}

//         {!isLoading &&
//           !error &&
//           filteredQuizBoards.length > 0 && (
//             <div className="space-y-6">
//               {filteredQuizBoards.map((board) => (
//                 <QuizBoardCard
//                   key={getBoardId(board)}
//                   board={board}
//                   onCreateRoom={() =>
//                     openCreateRoom(board)
//                   }
//                   onActivateRoom={() =>
//                     openActivateRoom(board)
//                   }
//                   onStart={() =>
//                     openActionModal(
//                       board,
//                       "start",
//                     )
//                   }
//                   onCancel={() =>
//                     openActionModal(
//                       board,
//                       "cancel",
//                     )
//                   }
//                   onDelete={() =>
//                     openActionModal(
//                       board,
//                       "delete",
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           )}

//         {/* ==================================================
//             EMPTY FILTER
//         ================================================== */}

//         {!isLoading &&
//           !error &&
//           quizBoards.length > 0 &&
//           filteredQuizBoards.length === 0 && (
//             <Card className="p-12 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
//                 <Search className="h-8 w-8 text-slate-400" />
//               </div>

//               <h2 className="mt-5 text-xl font-bold text-slate-900">
//                 No Quiz Boards found
//               </h2>

//               <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//                 No Quiz Board matches your current
//                 search or filter.
//               </p>
//             </Card>
//           )}

//         {/* ==================================================
//             EMPTY DATABASE
//         ================================================== */}

//         {!isLoading &&
//           !error &&
//           quizBoards.length === 0 && (
//             <Card className="p-12 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
//                 <Trophy className="h-8 w-8 text-blue-600" />
//               </div>

//               <h2 className="mt-5 text-xl font-bold text-slate-900">
//                 No Quiz Boards yet
//               </h2>

//               <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
//                 Create your first Quiz Board and
//                 configure its elimination rounds,
//                 question difficulty, timing and
//                 final rewards.
//               </p>

//               <div className="mt-6">
//                 <Link href="/admin/secondary/quiz-board/quiz-competitions/create">
//                   <Button
//                     leftIcon={
//                       <Plus className="h-4 w-4" />
//                     }
//                   >
//                     Create Quiz Board
//                   </Button>
//                 </Link>
//               </div>
//             </Card>
//           )}

//         {/* ==================================================
//             STRUCTURE
//         ================================================== */}

//         {!isLoading && !error && (
//           <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
//             <div className="flex items-start gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
//                 <Layers3 className="h-5 w-5" />
//               </div>

//               <div>
//                 <h2 className="font-bold text-slate-900">
//                   Quiz Board room flow
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-slate-600">
//                   Students first join the competition.
//                   Once the required number of contestants
//                   has been reached, the administrator can
//                   create and activate the quiz room before
//                   starting the quiz.
//                 </p>

//                 <div className="mt-5 flex flex-wrap gap-2">
//                   <StructurePill
//                     label="1"
//                     value="Students Join"
//                   />

//                   <StructurePill
//                     label="2"
//                     value="Reach Capacity"
//                   />

//                   <StructurePill
//                     label="3"
//                     value="Create Room"
//                   />

//                   <StructurePill
//                     label="4"
//                     value="Activate Room"
//                   />

//                   <StructurePill
//                     label="5"
//                     value="Start Quiz"
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}
//       </div>

//       {/* ======================================================
//           CREATE ROOM MODAL
//       ====================================================== */}

//       {roomBoard && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
//           <div
//             className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
//             role="dialog"
//             aria-modal="true"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
//                   <DoorOpen className="h-6 w-6" />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">
//                     Create Quiz Room
//                   </h2>

//                   <p className="mt-1 text-sm leading-5 text-slate-500">
//                     All required contestants have joined.
//                     You can now create the competition room.
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeCreateRoom}
//                 disabled={isCreatingRoom}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
//                 aria-label="Close dialog"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                 Quiz Competition
//               </p>

//               <p className="mt-1 font-bold text-slate-900">
//                 {roomBoard.quiz_title}
//               </p>

//               <div className="mt-4 grid grid-cols-2 gap-3">
//                 <div className="rounded-xl border border-slate-200 bg-white p-3">
//                   <p className="text-xs text-slate-500">
//                     Joined
//                   </p>

//                   <p className="mt-1 text-xl font-bold text-slate-900">
//                     {getJoinedCount(roomBoard)}
//                   </p>
//                 </div>

//                 <div className="rounded-xl border border-slate-200 bg-white p-3">
//                   <p className="text-xs text-slate-500">
//                     Required
//                   </p>

//                   <p className="mt-1 text-xl font-bold text-slate-900">
//                     {getContestantCapacity(roomBoard)}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
//                 <CheckCircle2 className="h-4 w-4" />
//                 Competition is full
//               </div>
//             </div>

//             {roomError && (
//               <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

//                   <div>
//                     <p className="text-sm font-semibold text-red-900">
//                       Unable to create room
//                     </p>

//                     <p className="mt-1 text-sm leading-5 text-red-700">
//                       {roomError}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={closeCreateRoom}
//                 disabled={isCreatingRoom}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="button"
//                 onClick={handleCreateRoom}
//                 disabled={isCreatingRoom}
//                 leftIcon={
//                   isCreatingRoom ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <DoorOpen className="h-4 w-4" />
//                   )
//                 }
//               >
//                 {isCreatingRoom
//                   ? "Creating Room..."
//                   : "Create Quiz Room"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================================================
//           ACTIVATE ROOM MODAL
//       ====================================================== */}

//       {activatingRoomBoard && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
//           <div
//             className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
//             role="dialog"
//             aria-modal="true"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
//                   <Power className="h-6 w-6" />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">
//                     Activate Quiz Room
//                   </h2>

//                   <p className="mt-1 text-sm leading-5 text-slate-500">
//                     This will activate the existing room
//                     for this Quiz Board.
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeActivateRoom}
//                 disabled={isActivatingRoom}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
//                 aria-label="Close dialog"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
//                 Quiz Competition
//               </p>

//               <p className="mt-1 font-bold text-slate-900">
//                 {activatingRoomBoard.quiz_title}
//               </p>

//               <div className="mt-4 flex flex-wrap gap-2">
//                 <span
//                   className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                     activatingRoomBoard.status,
//                   )}`}
//                 >
//                   {getStatusLabel(
//                     activatingRoomBoard.status,
//                   )}
//                 </span>

//                 <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//                   Room Created
//                 </span>
//               </div>

//               <div className="mt-4 rounded-xl border border-blue-100 bg-white p-3">
//                 <p className="text-xs text-slate-500">
//                   Room ID
//                 </p>

//                 <p className="mt-1 break-all font-mono text-sm font-bold text-slate-900">
//                   {activatingRoomBoard.room_id ||
//                     "—"}
//                 </p>
//               </div>
//             </div>

//             {activateRoomError && (
//               <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

//                   <div>
//                     <p className="text-sm font-semibold text-red-900">
//                       Unable to activate room
//                     </p>

//                     <p className="mt-1 text-sm leading-5 text-red-700">
//                       {activateRoomError}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={closeActivateRoom}
//                 disabled={isActivatingRoom}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="button"
//                 onClick={handleActivateRoom}
//                 disabled={isActivatingRoom}
//                 leftIcon={
//                   isActivatingRoom ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Power className="h-4 w-4" />
//                   )
//                 }
//               >
//                 {isActivatingRoom
//                   ? "Activating Room..."
//                   : "Activate Room"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================================================
//           ACTION MODAL
//       ====================================================== */}

//       {actionBoard && actionModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
//           <div
//             className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
//             role="dialog"
//             aria-modal="true"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div
//                   className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
//                     actionType === "delete"
//                       ? "bg-red-100 text-red-600"
//                       : actionType === "cancel"
//                         ? "bg-orange-100 text-orange-600"
//                         : "bg-blue-100 text-blue-600"
//                   }`}
//                 >
//                   {actionType === "delete" ? (
//                     <Trash2 className="h-6 w-6" />
//                   ) : actionType === "cancel" ? (
//                     <Square className="h-6 w-6" />
//                   ) : (
//                     <Play className="h-6 w-6" />
//                   )}
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">
//                     {actionModal.title}
//                   </h2>

//                   <p className="mt-1 text-sm leading-5 text-slate-500">
//                     {actionModal.description}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeActionModal}
//                 disabled={isProcessing}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
//                 aria-label="Close dialog"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                 Quiz Board
//               </p>

//               <p className="mt-1 font-bold text-slate-900">
//                 {actionBoard.quiz_title}
//               </p>

//               <div className="mt-3 flex flex-wrap gap-2">
//                 <span
//                   className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                     actionBoard.status,
//                   )}`}
//                 >
//                   {getStatusLabel(
//                     actionBoard.status,
//                   )}
//                 </span>

//                 <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
//                   {getJoinedCount(actionBoard)} /{" "}
//                   {getContestantCapacity(
//                     actionBoard,
//                   )}{" "}
//                   Joined
//                 </span>

//                 {hasRoom(actionBoard) && (
//                   <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//                     Room Created
//                   </span>
//                 )}
//               </div>
//             </div>

//             {actionType === "delete" && (
//               <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
//                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//                 <div>
//                   <p className="text-sm font-semibold text-amber-900">
//                     This cannot be undone
//                   </p>

//                   <p className="mt-1 text-sm leading-5 text-amber-800">
//                     Make sure you no longer need this
//                     Quiz Board.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {actionError && (
//               <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

//                   <div>
//                     <p className="text-sm font-semibold text-red-900">
//                       Action failed
//                     </p>

//                     <p className="mt-1 text-sm leading-5 text-red-700">
//                       {actionError}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={closeActionModal}
//                 disabled={isProcessing}
//               >
//                 Close
//               </Button>

//               <Button
//                 type="button"
//                 variant={
//                   actionType === "delete"
//                     ? "destructive"
//                     : "default"
//                 }
//                 onClick={handleBoardAction}
//                 disabled={isProcessing}
//                 leftIcon={
//                   isProcessing ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : actionType === "delete" ? (
//                     <Trash2 className="h-4 w-4" />
//                   ) : actionType === "cancel" ? (
//                     <Square className="h-4 w-4" />
//                   ) : (
//                     <Play className="h-4 w-4" />
//                   )
//                 }
//               >
//                 {isProcessing
//                   ? "Processing..."
//                   : actionModal.button}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// /* ============================================================
//    STAT CARD
// ============================================================ */

// interface StatCardProps {
//   icon: React.ReactNode;
//   label: string;
//   value: number;
//   description: string;
//   live?: boolean;
// }

// function StatCard({
//   icon,
//   label,
//   value,
//   description,
//   live = false,
// }: StatCardProps) {
//   return (
//     <section
//       className={`rounded-2xl border bg-white p-5 shadow-sm ${
//         live
//           ? "border-red-200"
//           : "border-slate-200"
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div
//           className={`flex h-10 w-10 items-center justify-center rounded-xl ${
//             live
//               ? "bg-red-50 text-red-600"
//               : "bg-blue-50 text-blue-600"
//           }`}
//         >
//           {icon}
//         </div>

//         {live && (
//           <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">
//             <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
//             Live
//           </span>
//         )}
//       </div>

//       <p className="mt-4 text-sm font-medium text-slate-500">
//         {label}
//       </p>

//       <p className="mt-1 text-3xl font-bold text-slate-900">
//         {value.toLocaleString("en-NG")}
//       </p>

//       <p className="mt-1 text-xs text-slate-500">
//         {description}
//       </p>
//     </section>
//   );
// }

// /* ============================================================
//    STRUCTURE PILL
// ============================================================ */

// function StructurePill({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl border border-blue-100 bg-white px-4 py-2.5">
//       <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
//         {label}
//       </p>

//       <p className="mt-0.5 text-sm font-bold text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }

// /* ============================================================
//    QUIZ BOARD CARD
// ============================================================ */

// interface QuizBoardCardProps {
//   board: QuizBoard;
//   onCreateRoom: () => void;
//   onActivateRoom: () => void;
//   onStart: () => void;
//   onCancel: () => void;
//   onDelete: () => void;
// }

// function QuizBoardCard({
//   board,
//   onCreateRoom,
//   onActivateRoom,
//   onStart,
//   onCancel,
//   onDelete,
// }: QuizBoardCardProps) {
//   const status = normalizeStatus(board.status);

//   const boardId = getBoardId(board);

//   const contestants =
//     getContestantCapacity(board);

//   const joined = getJoinedCount(board);

//   const isFull = isQuizFull(board);

//   const roomCreated = hasRoom(board);

//   const eliminationQuestions =
//     getTotalEliminationQuestions(board);

//   const finalQuestions =
//     getFinalQuestionCount(board);

//   const totalQuestions =
//     getTotalQuestionCount(board);

//   const totalRewards =
//     getTotalRewards(board);

//   const currentRound =
//     getCurrentRound(board);

//   const numberOfRounds =
//     Number(board.number_of_rounds || 0);

//   /*
//    * Create Room is ONLY available when:
//    *
//    * joined_users.length >= no_of_contestants
//    *
//    * and there is no room_id yet.
//    */
//   const canCreateRoom =
//     isFull && !roomCreated;

//   /*
//    * IMPORTANT:
//    *
//    * Start Quiz must be visible when the backend
//    * returns IN_PROGRESS.
//    *
//    * The button is disabled until a room exists.
//    */
//   const canStart =
//     status === "IN_PROGRESS";

//   /*
//    * Activate Room is available when:
//    *
//    * 1. A room already exists
//    * 2. Status is IN_PROGRESS
//    *
//    * It calls:
//    *
//    * POST /quiz/create-room/{quizId}
//    */
//   const canActivateRoom =
//     roomCreated &&
//     status === "IN_PROGRESS";

//   const canCancel =
//     status === "WAITING" ||
//     status === "UPCOMING" ||
//     status === "OPEN" ||
//     status === "FULL" ||
//     status === "IN_PROGRESS" ||
//     status === "LIVE";

//   return (
//     <Card
//       hoverable
//       className={`overflow-hidden p-0 ${
//         status === "LIVE"
//           ? "border-red-200"
//           : status === "IN_PROGRESS"
//             ? "border-blue-200"
//             : isFull && !roomCreated
//               ? "border-blue-200"
//               : ""
//       }`}
//     >
//       {/* ====================================================
//           LIVE HEADER
//       ==================================================== */}

//       {status === "LIVE" && (
//         <div className="flex items-center justify-between bg-red-600 px-6 py-2.5 text-white">
//           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
//             <span className="relative flex h-2.5 w-2.5">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />

//               <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
//             </span>

//             Live Quiz Board
//           </div>

//           <span className="text-xs font-semibold">
//             {currentRound
//               ? `Round ${currentRound}`
//               : "LIVE"}
//           </span>
//         </div>
//       )}

//       {/* ====================================================
//           IN PROGRESS HEADER
//       ==================================================== */}

//       {status === "IN_PROGRESS" && (
//         <div className="flex items-center justify-between bg-blue-600 px-6 py-2.5 text-white">
//           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
//             <span className="relative flex h-2.5 w-2.5">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />

//               <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
//             </span>

//             Quiz Ready
//           </div>

//           <span className="text-xs font-semibold">
//             Awaiting Start
//           </span>
//         </div>
//       )}

//       <div className="p-6 md:p-8">

//         {/* ==================================================
//             HEADER
//         ================================================== */}

//         <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//           <div className="min-w-0 flex-1">
//             <div className="flex flex-wrap items-center gap-2.5">
//               <h2 className="text-2xl font-bold text-slate-900">
//                 {board.quiz_title}
//               </h2>

//               <span
//                 className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                   board.status,
//                 )}`}
//               >
//                 {getStatusLabel(
//                   board.status,
//                 )}
//               </span>

//               {roomCreated && (
//                 <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//                   <Check className="h-3.5 w-3.5" />
//                   Room Created
//                 </span>
//               )}
//             </div>

//             <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
//               {board.description ||
//                 "No description provided."}
//             </p>

//             <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
//               <span className="flex items-center gap-2">
//                 <BookOpen className="h-4 w-4 text-blue-600" />
//                 {getSubjectLabel(board)}
//               </span>

//               <span className="flex items-center gap-2">
//                 <Users className="h-4 w-4 text-blue-600" />
//                 {contestants} Contestants
//               </span>

//               <span className="flex items-center gap-2">
//                 <Timer className="h-4 w-4 text-blue-600" />
//                 {board.time_per_question}s /
//                 Question
//               </span>

//               <span className="flex items-center gap-2">
//                 <Target className="h-4 w-4 text-blue-600" />
//                 {totalQuestions} Questions
//               </span>

//               <span className="flex items-center gap-2">
//                 <Layers3 className="h-4 w-4 text-blue-600" />
//                 {numberOfRounds} Rounds
//               </span>
//             </div>
//           </div>

//           <div className="flex shrink-0 flex-wrap gap-2">
//             <Link
//               href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}


//             >
//               <Button
//                 leftIcon={
//                   <Settings2 className="h-4 w-4" />
//                 }
//               >
//                 Manage
//                 <ChevronRight className="ml-1 h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* ==================================================
//             PARTICIPANT CAPACITY
//         ================================================== */}

//         <div
//           className={`mt-7 rounded-2xl border p-5 ${
//             roomCreated
//               ? "border-green-200 bg-green-50"
//               : isFull
//                 ? "border-blue-200 bg-blue-50"
//                 : "border-slate-200 bg-slate-50"
//           }`}
//         >
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <div className="flex items-center gap-2">
//                 <Users
//                   className={`h-5 w-5 ${
//                     roomCreated
//                       ? "text-green-600"
//                       : isFull
//                         ? "text-blue-600"
//                         : "text-slate-500"
//                   }`}
//                 />

//                 <p className="text-sm font-bold text-slate-900">
//                   Contestant Registration
//                 </p>
//               </div>

//               <p className="mt-1 text-xs text-slate-500">
//                 {roomCreated
//                   ? "The quiz room has already been created."
//                   : isFull
//                     ? "All required contestants have joined. The room can now be created."
//                     : "The room can only be created after all required contestants have joined."}
//               </p>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-slate-900">
//                   {joined}
//                   <span className="text-slate-400">
//                     {" "}
//                     / {contestants}
//                   </span>
//                 </p>

//                 <p className="text-xs font-medium text-slate-500">
//                   contestants joined
//                 </p>
//               </div>

//               <div
//                 className={`flex h-11 w-11 items-center justify-center rounded-xl ${
//                   roomCreated
//                     ? "bg-green-100 text-green-600"
//                     : isFull
//                       ? "bg-blue-100 text-blue-600"
//                       : "bg-slate-200 text-slate-500"
//                 }`}
//               >
//                 {roomCreated ? (
//                   <CheckCircle2 className="h-5 w-5" />
//                 ) : isFull ? (
//                   <DoorOpen className="h-5 w-5" />
//                 ) : (
//                   <Lock className="h-5 w-5" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ==================================================
//               PROGRESS
//           ================================================== */}

//           <div className="mt-4">
//             <div className="h-2 overflow-hidden rounded-full bg-slate-200">
//               <div
//                 className={`h-full rounded-full transition-all ${
//                   roomCreated
//                     ? "bg-green-500"
//                     : isFull
//                       ? "bg-blue-600"
//                       : "bg-blue-400"
//                 }`}
//                 style={{
//                   width: `${
//                     contestants > 0
//                       ? Math.min(
//                           100,
//                           (joined /
//                             contestants) *
//                             100,
//                         )
//                       : 0
//                   }%`,
//                 }}
//               />
//             </div>
//           </div>

//           {/* ==================================================
//               ROOM ACTION
//           ================================================== */}

//           <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="text-xs text-slate-500">
//               {roomCreated ? (
//                 <span className="font-semibold text-green-700">
//                   Room ID:{" "}
//                   <span className="font-mono">
//                     {board.room_id}
//                   </span>
//                 </span>
//               ) : (
//                 <>
//                   {joined < contestants
//                     ? `${contestants - joined} more contestant${
//                         contestants - joined ===
//                         1
//                           ? ""
//                           : "s"
//                       } needed`
//                     : "Ready to create room"}
//                 </>
//               )}
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               {roomCreated ? (
//                 <>
//                   {/* ========================================
//                       ROOM CREATED STATUS
//                   ======================================== */}

//                   <Button
//                     type="button"
//                     variant="outline"
//                     disabled
//                     leftIcon={
//                       <CheckCircle2 className="h-4 w-4 text-green-600" />
//                     }
//                   >
//                     Room Created
//                   </Button>

//                   {/* ========================================
//                       ACTIVATE ROOM
                      
//                       Visible when:
//                       room exists + status IN_PROGRESS
//                   ======================================== */}

//                   {canActivateRoom && (
//                     <Button
//                       type="button"
//                       onClick={onActivateRoom}
//                       leftIcon={
//                         <Power className="h-4 w-4" />
//                       }
//                     >
//                       Activate Room
//                     </Button>
//                   )}
//                 </>
//               ) : (
//                 <Button
//                   type="button"
//                   onClick={onCreateRoom}
//                   disabled={!canCreateRoom}
//                   leftIcon={
//                     canCreateRoom ? (
//                       <DoorOpen className="h-4 w-4" />
//                     ) : (
//                       <Lock className="h-4 w-4" />
//                     )
//                   }
//                   title={
//                     canCreateRoom
//                       ? "Create quiz room"
//                       : `Waiting for all contestants: ${joined}/${contestants}`
//                   }
//                 >
//                   {canCreateRoom
//                     ? "Create Quiz Room"
//                     : "Waiting for Contestants"}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ==================================================
//             BOARD SUMMARY
//         ================================================== */}

//         <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <InfoTile
//             icon={
//               <CalendarDays className="h-4 w-4" />
//             }
//             label="Starts"
//             value={formatDateTime(
//               board.start_date,
//             )}
//           />

//           <InfoTile
//             icon={
//               <Clock3 className="h-4 w-4" />
//             }
//             label="Time / Question"
//             value={`${board.time_per_question} seconds`}
//           />

//           <InfoTile
//             icon={
//               <ListChecks className="h-4 w-4" />
//             }
//             label="Questions"
//             value={`${totalQuestions} total`}
//           />

//           <InfoTile
//             icon={
//               <Medal className="h-4 w-4" />
//             }
//             label="Final Winner"
//             value={`${formatPoints(
//               board.final_round_information
//                 ?.first_position_reward,
//             )} Points`}
//           />
//         </div>

//         {/* ==================================================
//             ROUND SUMMARY
//         ================================================== */}

//         <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <p className="text-sm font-bold text-slate-900">
//                 Competition Structure
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 {
//                   board.round_information
//                     ?.length || 0
//                 }{" "}
//                 elimination rounds + Final
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
//                 {eliminationQuestions} Elimination
//                 Questions
//               </span>

//               <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
//                 {finalQuestions} Final Questions
//               </span>
//             </div>
//           </div>

//           <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
//             {(board.round_information || []).map(
//               (round) => (
//                 <div
//                   key={round.round_number}
//                   className="rounded-xl border border-slate-200 bg-white p-4"
//                 >
//                   <div className="flex items-center justify-between">
//                     <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
//                       Round{" "}
//                       {round.round_number}
//                     </p>

//                     <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
//                       Exit {round.exit_number}
//                     </span>
//                   </div>

//                   <p className="mt-2 text-lg font-bold text-slate-900">
//                     {round.no_of_questions}{" "}
//                     Questions
//                   </p>

//                   <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold">
//                     <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
//                       E{" "}
//                       {round
//                         .difficultyBreakdown
//                         ?.easy ?? 0}
//                     </span>

//                     <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-700">
//                       M{" "}
//                       {round
//                         .difficultyBreakdown
//                         ?.medium ?? 0}
//                     </span>

//                     <span className="rounded-full bg-red-100 px-2 py-1 text-red-700">
//                       H{" "}
//                       {round
//                         .difficultyBreakdown
//                         ?.hard ?? 0}
//                     </span>
//                   </div>

//                   <p className="mt-3 text-xs text-slate-500">
//                     Exit reward:{" "}
//                     <strong className="text-slate-800">
//                       {round.exit_reward} Points
//                     </strong>
//                   </p>
//                 </div>
//               ),
//             )}
//           </div>

//           {/* FINAL */}

//           {board.final_round_information && (
//             <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
//               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wide text-purple-700">
//                     Final Round
//                   </p>

//                   <p className="mt-1 font-bold text-slate-900">
//                     {
//                       board
//                         .final_round_information
//                         .no_of_questions
//                     }{" "}
//                     Questions
//                   </p>
//                 </div>

//                 <div className="flex flex-wrap gap-2 text-xs font-semibold">
//                   <span className="rounded-full bg-white px-3 py-1.5 text-green-700">
//                     Easy{" "}
//                     {board
//                       .final_round_information
//                       .difficultyBreakdown
//                       ?.easy ?? 0}
//                   </span>

//                   <span className="rounded-full bg-white px-3 py-1.5 text-yellow-700">
//                     Medium{" "}
//                     {board
//                       .final_round_information
//                       .difficultyBreakdown
//                       ?.medium ?? 0}
//                   </span>

//                   <span className="rounded-full bg-white px-3 py-1.5 text-red-700">
//                     Hard{" "}
//                     {board
//                       .final_round_information
//                       .difficultyBreakdown
//                       ?.hard ?? 0}
//                   </span>

//                   <span className="rounded-full bg-purple-700 px-3 py-1.5 text-white">
//                     1st:{" "}
//                     {
//                       board
//                         .final_round_information
//                         .first_position_reward
//                     }
//                   </span>

//                   <span className="rounded-full bg-white px-3 py-1.5 text-purple-700">
//                     2nd:{" "}
//                     {
//                       board
//                         .final_round_information
//                         .second_position_reward
//                     }
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ==================================================
//             REWARD SUMMARY
//         ================================================== */}

//         <div className="mt-5 grid gap-4 sm:grid-cols-2">
//           <InfoTile
//             icon={
//               <Zap className="h-4 w-4" />
//             }
//             label="Total Rewards"
//             value={`${formatPoints(
//               totalRewards,
//             )} Points configured`}
//           />

//           <InfoTile
//             icon={
//               <Trophy className="h-4 w-4" />
//             }
//             label="Final Rewards"
//             value={`${formatPoints(
//               board.final_round_information
//                 ?.first_position_reward,
//             )} / ${formatPoints(
//               board.final_round_information
//                 ?.second_position_reward,
//             )} Points`}
//           />
//         </div>

//         {/* ==================================================
//             ACTIONS
//         ================================================== */}

//         <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">

//           <Link
//             href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}
//           >
//             <Button
//               variant="outline"
//               leftIcon={
//                 <Eye className="h-4 w-4" />
//               }
//             >
//               View
//             </Button>
//           </Link>

//           {(status === "DRAFT" ||
//             status === "WAITING" ||
//             status === "UPCOMING") && (
//             <Link
//               href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}/edit`}
//             >
//               <Button
//                 variant="outline"
//                 leftIcon={
//                   <Pencil className="h-4 w-4" />
//                 }
//               >
//                 Edit
//               </Button>
//             </Link>
//           )}

//           {status === "LIVE" && (
//             <Link
//               href={`/admin/secondary/quiz-board/quiz-competitions/${boardId}`}
//             >
//               <Button
//                 variant="outline"
//                 leftIcon={
//                   <Radio className="h-4 w-4 text-red-600" />
//                 }
//               >
//                 Monitor Live
//               </Button>
//             </Link>
//           )}

//           {/* ==================================================
//               START QUIZ
              
//               IMPORTANT:
//               Visible whenever status === IN_PROGRESS.
              
//               Disabled only when room has not yet been
//               created.
//           ================================================== */}

//           {canStart && (
//             <Button
//               type="button"
//               onClick={onStart}
//               disabled={!roomCreated}
//               leftIcon={
//                 <Play className="h-4 w-4" />
//               }
//               title={
//                 roomCreated
//                   ? "Start Quiz"
//                   : "Create the quiz room before starting the quiz"
//               }
//             >
//               Start Quiz
//             </Button>
//           )}

//           {canCancel && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               leftIcon={
//                 <Square className="h-4 w-4" />
//               }
//             >
//               Cancel
//             </Button>
//           )}

//           {/* ==================================================
//               DELETE
//           ================================================== */}

//           {(status === "DRAFT" ||
//             status === "WAITING" ||
//             status === "UPCOMING") && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onDelete}
//               leftIcon={
//                 <Trash2 className="h-4 w-4" />
//               }
//             >
//               Delete
//             </Button>
//           )}

//         </div>
//       </div>
//     </Card>
//   );
// }

// /* ============================================================
//    INFO TILE
// ============================================================ */

// interface InfoTileProps {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }

// function InfoTile({
//   icon,
//   label,
//   value,
// }: InfoTileProps) {
//   return (
//     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//       <div className="flex items-center gap-2 text-blue-600">
//         {icon}

//         <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//           {label}
//         </span>
//       </div>

//       <p className="mt-2 truncate text-sm font-bold text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }


