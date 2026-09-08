




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

interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

interface QuizBoardRound {
  roundNumber: RoundNumber;
  name?: string;
  label?: string;
  questions: number;
  playersFrom: number;
  playersTo: number;
  status?: string;
  startedAt?: string;
  endedAt?: string;
}

interface QuizBoardParticipant {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  username?: string;
  avatar?: string;
  avatarUrl?: string;
  score?: number;
  points?: number;
  rank?: number;
  status?: string;
  qualified?: boolean;
  eliminated?: boolean;
  responseTime?: number;
}

interface QuizBoardQuestion {
  _id?: string;
  id?: string;
  questionNumber?: number;
  roundNumber?: number;
  status?: string;
}

interface QuizBoard {
  _id: string;
  id?: string;

  title: string;
  description?: string;

  subject?: string;
  subjectName?: string;
  subjectIds?: string[];

  difficulty?: QuizBoardDifficulty | string;

  difficultyDistribution?: DifficultyDistribution;

  status: QuizBoardStatus | string;

  maxPlayers?: number;
  players?: number;
  participantCount?: number;

  entryFee?: number;
  entryPoints?: number;
  entryFeeType?: string;

  winnerReward?: number;
  rewardPoints?: number;

  questionCount?: number;
  totalQuestions?: number;

  timePerQuestionSeconds?: number;

  startsAt?: string;
  startDate?: string;

  endsAt?: string;
  endDate?: string;

  currentRound?: RoundNumber | number | null;

  rounds?: QuizBoardRound[];

  participants?: QuizBoardParticipant[];
  playersList?: QuizBoardParticipant[];

  questions?: QuizBoardQuestion[];

  createdAt?: string;
  updatedAt?: string;
}

interface SubjectResponse {
  data?: {
    subjectObj?: Subject[];
  };
}

const MAX_PLAYERS = 20;
const TOTAL_QUESTIONS = 60;

const ROUND_CONFIG: QuizBoardRound[] = [
  {
    roundNumber: 1,
    name: "Round 1",
    label: "20 → 15",
    questions: 10,
    playersFrom: 20,
    playersTo: 15,
  },
  {
    roundNumber: 2,
    name: "Round 2",
    label: "15 → 10",
    questions: 10,
    playersFrom: 15,
    playersTo: 10,
  },
  {
    roundNumber: 3,
    name: "Round 3",
    label: "10 → 5",
    questions: 10,
    playersFrom: 10,
    playersTo: 5,
  },
  {
    roundNumber: 4,
    name: "Round 4",
    label: "5 → 2",
    questions: 10,
    playersFrom: 5,
    playersTo: 2,
  },
  {
    roundNumber: 5,
    name: "Final",
    label: "2 → 1",
    questions: 20,
    playersFrom: 2,
    playersTo: 1,
  },
];

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

const DIFFICULTY_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  EASY: {
    label: "Easy",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  },
  HARD: {
    label: "Hard",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
  },
  MIXED: {
    label: "Mixed",
    className:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-300",
  },
};

function normalizeStatus(value?: string) {
  return String(value ?? "DRAFT").toUpperCase();
}

function normalizeDifficulty(value?: string) {
  return String(value ?? "MIXED").toUpperCase();
}

function getBoardId(board: QuizBoard) {
  return board._id || board.id || "";
}

function getPlayerCount(board: QuizBoard) {
  return (
    board.participantCount ??
    board.players ??
    board.participants?.length ??
    board.playersList?.length ??
    0
  );
}

function getMaxPlayers(board: QuizBoard) {
  return board.maxPlayers ?? MAX_PLAYERS;
}

function getEntryFee(board: QuizBoard) {
  return board.entryFee ?? board.entryPoints ?? 0;
}

function getReward(board: QuizBoard) {
  return board.winnerReward ?? board.rewardPoints ?? 0;
}

function getQuestionCount(board: QuizBoard) {
  return board.totalQuestions ?? board.questionCount ?? TOTAL_QUESTIONS;
}

function getTimePerQuestion(board: QuizBoard) {
  return board.timePerQuestionSeconds ?? 30;
}

function getCurrentRound(board: QuizBoard): RoundNumber | null {
  const value = Number(board.currentRound);

  if (value >= 1 && value <= 5) {
    return value as RoundNumber;
  }

  return null;
}

function getStartDate(board: QuizBoard) {
  return board.startsAt ?? board.startDate;
}

function getEndDate(board: QuizBoard) {
  return board.endsAt ?? board.endDate;
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

function getApiErrorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function extractQuizBoard(payload: any): QuizBoard | null {
  const candidates = [
    payload?.quizBoard,
    payload?.quizBoardObj,
    payload?.data?.quizBoard,
    payload?.data?.quizBoardObj,
    payload?.data,
    payload,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      (candidate._id || candidate.id || candidate.title)
    ) {
      return candidate as QuizBoard;
    }
  }

  return null;
}

function extractParticipants(payload: any): QuizBoardParticipant[] {
  const candidates = [
    payload?.participants,
    payload?.players,
    payload?.participantObj,
    payload?.playerObj,
    payload?.data?.participants,
    payload?.data?.players,
    payload?.data?.participantObj,
    payload?.data?.playerObj,
    payload?.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function getParticipantName(player: QuizBoardParticipant) {
  return (
    player.fullName ||
    player.name ||
    player.username ||
    "Unnamed participant"
  );
}

function getParticipantScore(player: QuizBoardParticipant) {
  return player.score ?? player.points ?? 0;
}

function getParticipantStatus(player: QuizBoardParticipant) {
  if (player.eliminated) return "Eliminated";
  if (player.qualified) return "Qualified";

  const status = String(player.status ?? "").toUpperCase();

  if (status === "ELIMINATED") return "Eliminated";
  if (status === "QUALIFIED") return "Qualified";
  if (status === "ACTIVE") return "Active";

  return "Active";
}

export default function QuizBoardDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const quizBoardId = String(params["quiz-competitionsId"] ?? "");

  const [board, setBoard] = useState<QuizBoard | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [participants, setParticipants] = useState<QuizBoardParticipant[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchBoard = useCallback(async () => {
    if (!quizBoardId) {
      setError("Quiz Board ID was not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/admin/quiz-board/${quizBoardId}`,
      );

      const nextBoard = extractQuizBoard(response.data);

      if (!nextBoard) {
        throw new Error("Quiz Board data was not returned by the server.");
      }

      setBoard(nextBoard);
    } catch (err) {
      console.error("Failed to load Quiz Board:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [quizBoardId]);

  const fetchParticipants = useCallback(async () => {
    if (!quizBoardId) return;

    try {
      setLoadingParticipants(true);

      const response = await axiosInstance.get(
        `/admin/quiz-board/${quizBoardId}/players`,
      );

      const nextParticipants = extractParticipants(response.data);

      setParticipants(nextParticipants);
    } catch (err) {
      console.error("Failed to load Quiz Board participants:", err);

      // Participants are supplementary to the main board.
      // Do not replace the whole page with an error if this request fails.
    } finally {
      setLoadingParticipants(false);
    }
  }, [quizBoardId]);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = (await getSubjectsByPlan(
        "SECONDARY",
        1,
        100,
      )) as SubjectResponse;

      setSubjects(response?.data?.subjectObj ?? []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    }
  }, []);

  useEffect(() => {
    fetchBoard();
    fetchParticipants();
    fetchSubjects();
  }, [fetchBoard, fetchParticipants, fetchSubjects]);

  const status = normalizeStatus(board?.status);
  const difficulty = normalizeDifficulty(board?.difficulty);

  const playerCount = board ? getPlayerCount(board) : 0;
  const maxPlayers = board ? getMaxPlayers(board) : MAX_PLAYERS;
  const playerPercentage = Math.min(
    100,
    Math.round((playerCount / Math.max(maxPlayers, 1)) * 100),
  );

  const currentRound = board ? getCurrentRound(board) : null;

  const selectedSubjects = useMemo(() => {
    if (!board) return [];

    if (board.subjectIds?.length) {
      return subjects.filter((subject) =>
        board.subjectIds?.includes(subject._id),
      );
    }

    const subjectName = board.subjectName || board.subject;

    if (!subjectName) return [];

    return subjects.filter(
      (subject) =>
        subject.name?.toLowerCase() === subjectName.toLowerCase(),
    );
  }, [board, subjects]);

  const difficultyDistribution =
    board?.difficultyDistribution ?? {
      easy: 20,
      medium: 30,
      hard: 50,
    };

  const currentRoundConfig = currentRound
    ? ROUND_CONFIG.find(
        (round) => round.roundNumber === currentRound,
      )
    : null;

  const canStart =
    status === "DRAFT" ||
    status === "UPCOMING" ||
    status === "OPEN" ||
    status === "FULL";

  const canCancel =
    status !== "COMPLETED" &&
    status !== "CANCELLED";

  const canDelete =
    status === "DRAFT" ||
    status === "CANCELLED";

  async function startQuizBoard() {
    if (!board) return;

    try {
      setActionLoading(true);
      setActionError("");

      await axiosInstance.post(
        `/admin/quiz-board/${getBoardId(board)}/start`,
      );

      setShowStartModal(false);

      await fetchBoard();
      await fetchParticipants();
    } catch (err) {
      console.error("Failed to start Quiz Board:", err);
      setActionError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function cancelQuizBoard() {
    if (!board) return;

    try {
      setActionLoading(true);
      setActionError("");

      await axiosInstance.post(
        `/admin/quiz-board/${getBoardId(board)}/cancel`,
      );

      setShowCancelModal(false);

      await fetchBoard();
    } catch (err) {
      console.error("Failed to cancel Quiz Board:", err);
      setActionError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteQuizBoard() {
    if (!board) return;

    try {
      setActionLoading(true);
      setActionError("");

      await axiosInstance.delete(
        `/admin/quiz-board/${getBoardId(board)}`,
      );

      setShowDeleteModal(false);

      router.push(
        "/admin/secondary/quiz-board/quiz-competitions",
      );
    } catch (err) {
      console.error("Failed to delete Quiz Board:", err);
      setActionError(getApiErrorMessage(err));
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

  if (error || !board) {
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
                  onClick={fetchBoard}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Try Again
                </Button>

                <Link href="/admin/secondary/quiz-board/quiz-competitions">
                  <Button
                    type="button"
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
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
            {board.title}
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
                  {status === "LIVE" && (
                    <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  )}

                  {STATUS_CONFIG[status]?.label ?? status}
                </span>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    DIFFICULTY_CONFIG[difficulty]?.className ??
                    DIFFICULTY_CONFIG.MIXED.className
                  }`}
                >
                  {DIFFICULTY_CONFIG[difficulty]?.label ??
                    difficulty}
                </span>

                {currentRound && (
                  <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-300">
                    Round {currentRound}
                  </span>
                )}
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {board.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                {board.description ||
                  "Live competitive Quiz Board with timed questions, elimination rounds, and a final winner."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  fetchBoard();
                  fetchParticipants();
                }}
                disabled={loading || loadingParticipants}
                leftIcon={
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading || loadingParticipants
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                }
              >
                Refresh
              </Button>

              {status === "LIVE" && (
                <Link
                  href={`/student/quiz-board/${getBoardId(board)}/watch`}
                  target="_blank"
                >
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    Watch Live
                  </Button>
                </Link>
              )}

              {(status === "DRAFT" ||
                status === "UPCOMING" ||
                status === "OPEN") && (
                <Link
                  href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
                    board,
                  )}/edit`}
                >
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<Edit3 className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                </Link>
              )}

              {canStart && (
                <Button
                  type="button"
                  onClick={() => setShowStartModal(true)}
                  leftIcon={<Play className="h-4 w-4" />}
                >
                  Start Quiz Board
                </Button>
              )}

              {canCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCancelModal(true)}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Cancel
                </Button>
              )}

              {canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
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
              <p className="mt-1">{actionError}</p>
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

        {/* Live banner */}
        {status === "LIVE" && (
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
                    {currentRoundConfig
                      ? `${currentRoundConfig.name}: ${currentRoundConfig.playersFrom} players competing for ${currentRoundConfig.playersTo} qualifying positions.`
                      : "Students are currently competing in this Quiz Board."}
                  </p>
                </div>
              </div>

              <Link
                href={`/student/quiz-board/${getBoardId(board)}/watch`}
                target="_blank"
              >
                <Button
                  type="button"
                  leftIcon={<Eye className="h-4 w-4" />}
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
                  {getQuestionCount(board)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
                <FileQuestion className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              10 + 10 + 10 + 10 + 20
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Entry Fee
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {formatPoints(getEntryFee(board))}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                <Coins className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              CBT Points
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Winner Reward
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {formatPoints(getReward(board))}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <Trophy className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              CBT Points
            </p>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {/* Competition configuration */}
            <Card className="p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Quiz Board Configuration
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Core settings used for this live competition.
                  </p>
                </div>

                <ShieldCheck className="hidden h-6 w-6 text-blue-600 sm:block" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={<Users className="h-4 w-4" />}
                  label="Maximum Players"
                  value={`${maxPlayers} students`}
                />

                <InfoItem
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Time Per Question"
                  value={`${getTimePerQuestion(board)} seconds`}
                />

                <InfoItem
                  icon={<FileQuestion className="h-4 w-4" />}
                  label="Total Questions"
                  value={`${getQuestionCount(board)} questions`}
                />

                <InfoItem
                  icon={<Coins className="h-4 w-4" />}
                  label="Entry Type"
                  value="CBT Points"
                />

                <InfoItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Scheduled Start"
                  value={formatDateTime(getStartDate(board))}
                />

                <InfoItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Created"
                  value={formatDate(board.createdAt)}
                />
              </div>
            </Card>

            {/* Subjects */}
            <Card className="p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Question Subjects
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Questions will be selected from the configured secondary
                  school subjects.
                </p>
              </div>

              {selectedSubjects.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {selectedSubjects.map((subject) => (
                    <div
                      key={subject._id}
                      className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
                    >
                      <BookOpenIcon />
                      {subject.name}
                    </div>
                  ))}
                </div>
              ) : board.subjectName || board.subject ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                  {board.subjectName || board.subject}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No subjects were returned for this Quiz Board.
                </div>
              )}
            </Card>

            {/* Difficulty */}
            <Card className="p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Difficulty Distribution
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Difficulty percentages used when building the question pool.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <DifficultyBox
                  label="Easy"
                  value={difficultyDistribution.easy}
                  total={getQuestionCount(board)}
                />

                <DifficultyBox
                  label="Medium"
                  value={difficultyDistribution.medium}
                  total={getQuestionCount(board)}
                />

                <DifficultyBox
                  label="Hard"
                  value={difficultyDistribution.hard}
                  total={getQuestionCount(board)}
                />
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
                      Five-Stage Elimination
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Every Quiz Board follows the same qualification path.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {ROUND_CONFIG.map((round) => {
                  const isCurrent =
                    currentRound === round.roundNumber;

                  const isPast =
                    currentRound !== null &&
                    currentRound !== undefined &&
                    round.roundNumber < currentRound;

                  return (
                    <div
                      key={round.roundNumber}
                      className={`relative overflow-hidden rounded-xl border p-4 transition-colors ${
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
                              round.roundNumber
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {round.name}
                            </p>

                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                              {round.questions} questions
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {round.playersFrom} players
                          </span>

                          <span className="text-slate-400">→</span>

                          <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                            {round.playersTo} qualify
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                          Current Round
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-200">
                      Final winner
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800/80 dark:text-blue-300/80">
                      The final two students compete over 20 questions.
                      The student with the highest final score becomes the
                      Quiz Board champion.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Participants */}
            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Participants
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {playerCount} of {maxPlayers} places occupied
                    </p>
                  </div>

                  {loadingParticipants && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                </div>
              </div>

              {participants.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {participants
                    .slice()
                    .sort((a, b) => {
                      const rankA = a.rank ?? 9999;
                      const rankB = b.rank ?? 9999;

                      if (rankA !== rankB) {
                        return rankA - rankB;
                      }

                      return (
                        getParticipantScore(b) -
                        getParticipantScore(a)
                      );
                    })
                    .map((player, index) => {
                      const playerStatus =
                        getParticipantStatus(player);

                      return (
                        <div
                          key={
                            player._id ||
                            player.id ||
                            player.userId ||
                            `${getParticipantName(player)}-${index}`
                          }
                          className="flex items-center gap-3 px-5 py-4 sm:px-6"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {player.rank ?? index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {getParticipantName(player)}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              {playerStatus}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {formatPoints(
                                getParticipantScore(player),
                              )}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              points
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Users className="h-5 w-5" />
                  </div>

                  <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                    No participants yet
                  </p>

                  <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                    Students will appear here once they join this Quiz Board.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Status card */}
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
                  {status === "LIVE" && (
                    <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  )}

                  {STATUS_CONFIG[status]?.label ?? status}
                </span>
              </div>

              <div className="space-y-4">
                <StatusRow
                  label="Players"
                  value={`${playerCount} / ${maxPlayers}`}
                />

                <StatusRow
                  label="Current round"
                  value={
                    currentRoundConfig
                      ? currentRoundConfig.name || "Final"
                      : "Not started"
                  }
                />

                <StatusRow
                  label="Questions"
                  value={`${getQuestionCount(board)}`}
                />

                <StatusRow
                  label="Time / question"
                  value={`${getTimePerQuestion(board)} sec`}
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

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Starts
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatDateTime(getStartDate(board))}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Ends
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatDateTime(getEndDate(board))}
                  </p>
                </div>
              </div>
            </Card>

            {/* Economy */}
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                  <Coins className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Points
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quiz Board economy
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Entry Fee
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {formatPoints(getEntryFee(board))}
                    <span className="ml-1 text-sm font-medium text-slate-500">
                      CBT points
                    </span>
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Winner Reward
                  </p>

                  <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                    {formatPoints(getReward(board))}
                    <span className="ml-1 text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80">
                      CBT points
                    </span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Question plan */}
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
                    Fixed Quiz Board structure
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {ROUND_CONFIG.map((round) => (
                  <div
                    key={round.roundNumber}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-900/50"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {round.name}
                    </span>

                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {round.questions}
                    </span>
                  </div>
                ))}

                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Total
                  </span>

                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {TOTAL_QUESTIONS} questions
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
                    Answer order, response time, qualification, elimination,
                    scores, and the final winner should be determined by the
                    backend rather than this admin page.
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
            {status === "LIVE" && (
              <Link
                href={`/student/quiz-board/${getBoardId(board)}/watch`}
                target="_blank"
              >
                <Button
                  type="button"
                  leftIcon={<Eye className="h-4 w-4" />}
                >
                  Watch Live
                </Button>
              </Link>
            )}

            {(status === "DRAFT" ||
              status === "UPCOMING" ||
              status === "OPEN") && (
              <Link
                href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
                  board,
                )}/edit`}
              >
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<Edit3 className="h-4 w-4" />}
                >
                  Edit Quiz Board
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Start Modal */}
      {showStartModal && (
        <ActionModal
          title="Start Quiz Board?"
          description={`Starting "${board.title}" will make the Quiz Board live. Students will compete through the five-stage elimination system.`}
          icon={
            <Play className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          }
          iconClassName="bg-emerald-100 dark:bg-emerald-950/40"
          confirmLabel="Start Quiz Board"
          loading={actionLoading}
          onClose={() => {
            if (!actionLoading) {
              setShowStartModal(false);
            }
          }}
          onConfirm={startQuizBoard}
        />
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <ActionModal
          title="Cancel Quiz Board?"
          description={`Are you sure you want to cancel "${board.title}"? Students should no longer be able to participate in this Quiz Board.`}
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

      {/* Delete Modal */}
      {showDeleteModal && (
        <ActionModal
          title="Delete Quiz Board?"
          description={`This will permanently remove "${board.title}". This action cannot be undone.`}
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
      <div className="mt-0.5 text-slate-400">{icon}</div>

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

function DifficultyBox({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const estimatedQuestions = Math.round(
    (total * value) / 100,
  );

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>

        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {value}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${Math.min(100, value)}%`,
          }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Approximately {estimatedQuestions} questions
      </p>
    </div>
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
            variant={destructive ? "destructive" : undefined}
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
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}