





"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  FileQuestion,
  Info,
  Loader2,
  Save,
  ShieldCheck,
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

type DifficultyDistribution = {
  easy: number;
  medium: number;
  hard: number;
};

type RoundNumber = 1 | 2 | 3 | 4 | 5;

type QuizBoardRound = {
  roundNumber: RoundNumber;
  name: string;
  questions: number;
  playersFrom: number;
  playersTo: number;
};

interface QuizBoard {
  _id: string;
  id?: string;

  title: string;
  description?: string;

  subjectIds?: string[];
  subject?: string;
  subjectName?: string;

  difficulty?: QuizBoardDifficulty | string;

  difficultyDistribution?: DifficultyDistribution;

  status: QuizBoardStatus | string;

  maxPlayers?: number;

  entryFee?: number;
  entryPoints?: number;
  entryFeeType?: string;

  winnerReward?: number;
  rewardPoints?: number;

  totalQuestions?: number;
  questionCount?: number;

  timePerQuestionSeconds?: number;
  timePerQuestion?: number;

  startsAt?: string;
  startDate?: string;

  endsAt?: string;
  endDate?: string;

  currentRound?: number | null;

  rounds?: QuizBoardRound[];

  createdAt?: string;
  updatedAt?: string;
}

interface QuizBoardForm {
  title: string;
  description: string;
  startsAt: string;
  timePerQuestionSeconds: string;
  entryFee: string;
  winnerReward: string;
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
}

const MAX_PLAYERS = 20;
const TOTAL_QUESTIONS = 60;

const ROUND_CONFIG: QuizBoardRound[] = [
  {
    roundNumber: 1,
    name: "Round 1",
    questions: 10,
    playersFrom: 20,
    playersTo: 15,
  },
  {
    roundNumber: 2,
    name: "Round 2",
    questions: 10,
    playersFrom: 15,
    playersTo: 10,
  },
  {
    roundNumber: 3,
    name: "Round 3",
    questions: 10,
    playersFrom: 10,
    playersTo: 5,
  },
  {
    roundNumber: 4,
    name: "Round 4",
    questions: 10,
    playersFrom: 5,
    playersTo: 2,
  },
  {
    roundNumber: 5,
    name: "Final",
    questions: 20,
    playersFrom: 2,
    playersTo: 1,
  },
];

const TIME_OPTIONS = [
  { value: "10", label: "10 seconds" },
  { value: "15", label: "15 seconds" },
  { value: "20", label: "20 seconds" },
  { value: "30", label: "30 seconds" },
  { value: "45", label: "45 seconds" },
  { value: "60", label: "60 seconds" },
];

const ENTRY_FEE_OPTIONS = [
  5,
  10,
  20,
  50,
  100,
  250,
  500,
];

const REWARD_OPTIONS = [
  25,
  50,
  100,
  250,
  500,
  1000,
  2500,
  5000,
];

const DIFFICULTY_OPTIONS = [
  {
    key: "easy" as const,
    label: "Easy",
    description: "Foundational questions",
  },
  {
    key: "medium" as const,
    label: "Medium",
    description: "Standard examination questions",
  },
  {
    key: "hard" as const,
    label: "Hard",
    description: "Challenging questions",
  },
];

function normalizeStatus(value?: string) {
  return String(value ?? "DRAFT").toUpperCase();
}

function normalizeDifficulty(value?: string) {
  return String(value ?? "MIXED").toUpperCase();
}

function getBoardId(board: QuizBoard) {
  return board._id || board.id || "";
}

function getEntryFee(board: QuizBoard) {
  return board.entryFee ?? board.entryPoints ?? 5;
}

function getReward(board: QuizBoard) {
  return board.winnerReward ?? board.rewardPoints ?? 100;
}

function getTimePerQuestion(board: QuizBoard) {
  return (
    board.timePerQuestionSeconds ??
    board.timePerQuestion ??
    30
  );
}

function getStartDate(board: QuizBoard) {
  return board.startsAt ?? board.startDate;
}

function formatPoints(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
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

function toDateTimeLocal(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") +
    "T" +
    [
      pad(date.getHours()),
      pad(date.getMinutes()),
    ].join(":");
}

function getLocalDateTimeMin() {
  const date = new Date(Date.now() + 5 * 60 * 1000);

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return (
    [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join("-") +
    "T" +
    [
      pad(date.getHours()),
      pad(date.getMinutes()),
    ].join(":")
  );
}

function getApiErrorMessage(error: any) {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return (
    message ||
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
      (candidate._id ||
        candidate.id ||
        candidate.title)
    ) {
      return candidate as QuizBoard;
    }
  }

  return null;
}

function extractSubjects(
  payload: any,
): Subject[] {
  return (
    payload?.data?.subjectObj ??
    payload?.subjectObj ??
    payload?.data?.subjects ??
    payload?.subjects ??
    []
  );
}

export default function EditQuizBoardPage() {
  const params = useParams();
  const router = useRouter();

  const quizBoardId = String(
    params["quiz-competitionsId"] ?? "",
  );

  const [board, setBoard] =
    useState<QuizBoard | null>(null);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] =
    useState<string[]>([]);

  const [form, setForm] = useState<QuizBoardForm>({
    title: "",
    description: "",
    startsAt: "",
    timePerQuestionSeconds: "30",
    entryFee: "5",
    winnerReward: "100",
    difficultyEasy: "20",
    difficultyMedium: "30",
    difficultyHard: "50",
  });

  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

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

      const nextBoard = extractQuizBoard(
        response.data,
      );

      if (!nextBoard) {
        throw new Error(
          "Quiz Board data was not returned by the server.",
        );
      }

      setBoard(nextBoard);

      const distribution =
        nextBoard.difficultyDistribution ?? {
          easy: 20,
          medium: 30,
          hard: 50,
        };

      setForm({
        title: nextBoard.title ?? "",
        description: nextBoard.description ?? "",
        startsAt: toDateTimeLocal(
          getStartDate(nextBoard),
        ),
        timePerQuestionSeconds: String(
          getTimePerQuestion(nextBoard),
        ),
        entryFee: String(getEntryFee(nextBoard)),
        winnerReward: String(getReward(nextBoard)),
        difficultyEasy: String(distribution.easy),
        difficultyMedium: String(distribution.medium),
        difficultyHard: String(distribution.hard),
      });

      setSelectedSubjectIds(
        nextBoard.subjectIds ?? [],
      );
    } catch (err) {
      console.error(
        "Failed to load Quiz Board:",
        err,
      );

      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [quizBoardId]);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoadingSubjects(true);

      const response =
        await getSubjectsByPlan(
          "SECONDARY",
          1,
          100,
        );

      setSubjects(
        extractSubjects(response),
      );
    } catch (err) {
      console.error(
        "Failed to load subjects:",
        err,
      );
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  useEffect(() => {
    fetchBoard();
    fetchSubjects();
  }, [fetchBoard, fetchSubjects]);

  const status = normalizeStatus(board?.status);

  const isLocked =
    status === "LIVE" ||
    status === "COMPLETED" ||
    status === "CANCELLED";

  const canEdit =
    status === "DRAFT" ||
    status === "UPCOMING" ||
    status === "OPEN";

  const difficultyTotal =
    Number(form.difficultyEasy || 0) +
    Number(form.difficultyMedium || 0) +
    Number(form.difficultyHard || 0);

  const selectedSubjects = useMemo(
    () =>
      subjects.filter((subject) =>
        selectedSubjectIds.includes(
          subject._id,
        ),
      ),
    [subjects, selectedSubjectIds],
  );

  const estimatedDifficultyQuestions = useMemo(
    () => ({
      easy: Math.round(
        (TOTAL_QUESTIONS *
          Number(form.difficultyEasy || 0)) /
          100,
      ),
      medium: Math.round(
        (TOTAL_QUESTIONS *
          Number(form.difficultyMedium || 0)) /
          100,
      ),
      hard: Math.round(
        (TOTAL_QUESTIONS *
          Number(form.difficultyHard || 0)) /
          100,
      ),
    }),
    [
      form.difficultyEasy,
      form.difficultyMedium,
      form.difficultyHard,
    ],
  );

  function handleInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaveError("");
    setSuccessMessage("");
  }

  function toggleSubject(subjectId: string) {
    if (isLocked) return;

    setSelectedSubjectIds((current) =>
      current.includes(subjectId)
        ? current.filter(
            (id) => id !== subjectId,
          )
        : [...current, subjectId],
    );

    setSaveError("");
    setSuccessMessage("");
  }

  function validateForm() {
    if (!form.title.trim()) {
      return "Please enter a Quiz Board title.";
    }

    if (!form.description.trim()) {
      return "Please enter a Quiz Board description.";
    }

    if (selectedSubjectIds.length === 0) {
      return "Please select at least one subject.";
    }

    if (!form.startsAt) {
      return "Please select a start date and time.";
    }

    const startDate = new Date(
      form.startsAt,
    );

    if (Number.isNaN(startDate.getTime())) {
      return "Please provide a valid start date and time.";
    }

    if (
      startDate.getTime() <
      Date.now() + 60 * 1000
    ) {
      return "The Quiz Board start time must be at least one minute in the future.";
    }

    const timePerQuestion = Number(
      form.timePerQuestionSeconds,
    );

    if (
      !Number.isFinite(timePerQuestion) ||
      timePerQuestion <= 0
    ) {
      return "Please select a valid time per question.";
    }

    const entryFee = Number(form.entryFee);

    if (
      !Number.isFinite(entryFee) ||
      entryFee <= 0
    ) {
      return "Please select a valid CBT Points entry fee.";
    }

    const reward = Number(
      form.winnerReward,
    );

    if (
      !Number.isFinite(reward) ||
      reward <= 0
    ) {
      return "Please select a valid winner reward.";
    }

    if (difficultyTotal !== 100) {
      return `Difficulty distribution must equal 100%. Current total is ${difficultyTotal}%.`;
    }

    return "";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!board) return;

    if (isLocked) {
      setSaveError(
        "This Quiz Board can no longer be edited because it has already started, completed, or been cancelled.",
      );
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      setSuccessMessage("");

      const startsAtISO = new Date(
        form.startsAt,
      ).toISOString();

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),

        examType: "JAMB",

        status: board.status,

        subjectIds: selectedSubjectIds,

        difficulty: "MIXED",

        difficultyDistribution: {
          easy: Number(
            form.difficultyEasy,
          ),
          medium: Number(
            form.difficultyMedium,
          ),
          hard: Number(
            form.difficultyHard,
          ),
        },

        maxPlayers: MAX_PLAYERS,

        totalQuestions: TOTAL_QUESTIONS,

        entryFee: Number(form.entryFee),
        entryFeeType: "CBT_POINTS",

        winnerReward: Number(
          form.winnerReward,
        ),

        startsAt: startsAtISO,

        timePerQuestionSeconds: Number(
          form.timePerQuestionSeconds,
        ),

        rounds: ROUND_CONFIG.map(
          (round) => ({
            roundNumber:
              round.roundNumber,
            name: round.name,
            questions:
              round.questions,
            playersFrom:
              round.playersFrom,
            playersTo:
              round.playersTo,
          }),
        ),
      };

      await axiosInstance.patch(
        `/admin/quiz-board/${quizBoardId}`,
        payload,
      );

      setSuccessMessage(
        "Quiz Board updated successfully.",
      );

      await fetchBoard();

      setTimeout(() => {
        router.push(
          `/admin/secondary/quiz-board/quiz-competitions/${quizBoardId}`,
        );
      }, 700);
    } catch (err) {
      console.error(
        "Failed to update Quiz Board:",
        err,
      );

      setSaveError(
        getApiErrorMessage(err),
      );
    } finally {
      setSaving(false);
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
                  leftIcon={
                    <RefreshIcon />
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

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
              board,
            )}`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz Board
          </Link>

          <Card className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Editing is locked
              </h1>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
                This Quiz Board is currently{" "}
                <strong>
                  {normalizeStatus(board.status)}
                </strong>
                . Quiz Boards that are live, completed, or
                cancelled cannot be edited.
              </p>

              <div className="mt-6">
                <Link
                  href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
                    board,
                  )}`}
                >
                  <Button
                    type="button"
                    leftIcon={
                      <ArrowLeft className="h-4 w-4" />
                    }
                  >
                    Return to Quiz Board
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

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/secondary/quiz-board/quiz-competitions"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Quiz Boards
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
              board,
            )}`}
            className="max-w-[220px] truncate hover:text-blue-600 dark:hover:text-blue-400"
          >
            {board.title}
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-slate-900 dark:text-white">
            Edit
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
              board,
            )}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz Board
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Editing Quiz Board
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Edit Quiz Board
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                Update the configuration for{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {board.title}
                </span>
                . The five-stage elimination structure remains fixed.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge
                status={status}
              />
            </div>
          </div>
        </div>

        {saveError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">
                Unable to save changes
              </p>

              <p className="mt-1 leading-6">
                {saveError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSaveError("")}
              className="rounded-md p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                {successMessage}
              </p>

              <p className="mt-1">
                Redirecting back to the Quiz Board...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              {/* Basic information */}
              <Card className="p-5 sm:p-6">
                <SectionHeader
                  icon={
                    <FileQuestion className="h-5 w-5" />
                  }
                  title="Basic Information"
                  description="Update the public information students will see."
                />

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Quiz Board Title
                    </label>

                    <input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      placeholder="e.g. JAMB Biology Quiz Board"
                      maxLength={120}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />

                    <div className="mt-1.5 flex justify-end">
                      <span className="text-xs text-slate-400">
                        {form.title.length}/120
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      placeholder="Describe what students should expect from this Quiz Board."
                      rows={5}
                      maxLength={500}
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />

                    <div className="mt-1.5 flex justify-end">
                      <span className="text-xs text-slate-400">
                        {form.description.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Subjects */}
              <Card className="p-5 sm:p-6">
                <SectionHeader
                  icon={
                    <BookIcon />
                  }
                  title="Question Subjects"
                  description="Choose the secondary school subjects from which the backend will build the question pool."
                />

                {loadingSubjects ? (
                  <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 dark:border-slate-700">
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      Loading subjects...
                    </div>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                    No secondary subjects were returned from the subjects API.
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {subjects.map((subject) => {
                        const selected =
                          selectedSubjectIds.includes(
                            subject._id,
                          );

                        return (
                          <button
                            key={subject._id}
                            type="button"
                            onClick={() =>
                              toggleSubject(
                                subject._id,
                              )
                            }
                            className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                              selected
                                ? "border-blue-400 bg-blue-50 ring-2 ring-blue-500/10 dark:border-blue-700 dark:bg-blue-950/20"
                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                  selected
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                              >
                                <BookIcon />
                              </div>

                              <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {subject.name}
                              </span>
                            </div>

                            <div
                              className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}
                            >
                              {selected && (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                          {selectedSubjects.length} subject
                          {selectedSubjects.length === 1
                            ? ""
                            : "s"} selected
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-800/80 dark:text-blue-300/80">
                          The backend can distribute the 60-question pool across these selected subjects.
                        </p>
                      </div>

                      <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300">
                        {selectedSubjectIds.length} selected
                      </span>
                    </div>
                  </>
                )}
              </Card>

              {/* Difficulty */}
              <Card className="p-5 sm:p-6">
                <SectionHeader
                  icon={
                    <Zap className="h-5 w-5" />
                  }
                  title="Difficulty Distribution"
                  description="The percentages are applied to the question pool selected by the backend."
                />

                <div className="grid gap-4 md:grid-cols-3">
                  {DIFFICULTY_OPTIONS.map(
                    (item) => {
                      const value =
                        Number(
                          form[
                            `difficulty${
                              item.key
                                .charAt(0)
                                .toUpperCase() +
                              item.key.slice(1)
                            }` as keyof QuizBoardForm
                          ] || 0,
                        );

                      const fieldName =
                        `difficulty${
                          item.key
                            .charAt(0)
                            .toUpperCase() +
                          item.key.slice(1)
                        }`;

                      return (
                        <div
                          key={item.key}
                          className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {item.label}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {item.description}
                              </p>
                            </div>

                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {value}%
                            </span>
                          </div>

                          <input
                            type="number"
                            min={0}
                            max={100}
                            name={fieldName}
                            value={value}
                            onChange={handleInputChange}
                            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />

                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Approximately{" "}
                            {Math.round(
                              (TOTAL_QUESTIONS *
                                value) /
                                100,
                            )}{" "}
                            of 60 questions
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>

                <div
                  className={`mt-5 flex items-center justify-between rounded-xl border p-4 ${
                    difficultyTotal === 100
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {difficultyTotal ===
                    100 ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}

                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Distribution total
                    </span>
                  </div>

                  <span
                    className={`text-sm font-bold ${
                      difficultyTotal ===
                      100
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {difficultyTotal}%
                  </span>
                </div>

                {difficultyTotal ===
                  100 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <EstimatedQuestion
                      label="Easy"
                      value={
                        estimatedDifficultyQuestions.easy
                      }
                    />

                    <EstimatedQuestion
                      label="Medium"
                      value={
                        estimatedDifficultyQuestions.medium
                      }
                    />

                    <EstimatedQuestion
                      label="Hard"
                      value={
                        estimatedDifficultyQuestions.hard
                      }
                    />
                  </div>
                )}
              </Card>

              {/* Schedule and economy */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-5 sm:p-6">
                  <SectionHeader
                    icon={
                      <CalendarDays className="h-5 w-5" />
                    }
                    title="Schedule"
                    description="Set when students should compete."
                  />

                  <div>
                    <label
                      htmlFor="startsAt"
                      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Start Date & Time
                    </label>

                    <input
                      id="startsAt"
                      name="startsAt"
                      type="datetime-local"
                      min={getLocalDateTimeMin()}
                      value={form.startsAt}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />

                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Current configured start:{" "}
                      {formatDateTime(
                        form.startsAt,
                      )}
                    </p>
                  </div>
                </Card>

                <Card className="p-5 sm:p-6">
                  <SectionHeader
                    icon={
                      <Coins className="h-5 w-5" />
                    }
                    title="Points"
                    description="Configure the CBT Points economy."
                  />

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="entryFee"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Entry Fee
                      </label>

                      <select
                        id="entryFee"
                        name="entryFee"
                        value={form.entryFee}
                        onChange={handleInputChange}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      >
                        {ENTRY_FEE_OPTIONS.map(
                          (value) => (
                            <option
                              key={value}
                              value={value}
                            >
                              {formatPoints(
                                value,
                              )}{" "}
                              CBT Points
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="winnerReward"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Winner Reward
                      </label>

                      <select
                        id="winnerReward"
                        name="winnerReward"
                        value={
                          form.winnerReward
                        }
                        onChange={
                          handleInputChange
                        }
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      >
                        {REWARD_OPTIONS.map(
                          (value) => (
                            <option
                              key={value}
                              value={value}
                            >
                              {formatPoints(
                                value,
                              )}{" "}
                              CBT Points
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Timing */}
              <Card className="p-5 sm:p-6">
                <SectionHeader
                  icon={
                    <Clock3 className="h-5 w-5" />
                  }
                  title="Question Timing"
                  description="Set the time available for each question during every round."
                />

                <div className="max-w-md">
                  <label
                    htmlFor="timePerQuestionSeconds"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Time Per Question
                  </label>

                  <select
                    id="timePerQuestionSeconds"
                    name="timePerQuestionSeconds"
                    value={
                      form.timePerQuestionSeconds
                    }
                    onChange={
                      handleInputChange
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {TIME_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                    <div className="flex items-start gap-3">
                      <Zap className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                      <p className="text-sm leading-6 text-amber-800 dark:text-amber-300">
                        Quiz Board rewards fast and accurate responses. The backend should record the authoritative response timestamp.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Fixed game structure */}
              <Card className="p-5 sm:p-6">
                <SectionHeader
                  icon={
                    <Trophy className="h-5 w-5" />
                  }
                  title="Fixed Quiz Board Structure"
                  description="These rules define the Quiz Board game and cannot be changed per competition."
                />

                <div className="grid gap-3">
                  {ROUND_CONFIG.map(
                    (round, index) => (
                      <div
                        key={
                          round.roundNumber
                        }
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {round.roundNumber}
                            </div>

                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {round.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {round.questions} questions
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {round.playersFrom}
                            </span>

                            <span className="text-slate-400">
                              →
                            </span>

                            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                              {round.playersTo}
                            </span>
                          </div>
                        </div>

                        {index <
                          ROUND_CONFIG.length -
                            1 && (
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-900" />
                        )}
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <FixedRule
                    icon={
                      <Users className="h-4 w-4" />
                    }
                    label="Maximum Players"
                    value="20"
                  />

                  <FixedRule
                    icon={
                      <FileQuestion className="h-4 w-4" />
                    }
                    label="Total Questions"
                    value="60"
                  />

                  <FixedRule
                    icon={
                      <Trophy className="h-4 w-4" />
                    }
                    label="Final"
                    value="2 → 1"
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live summary */}
              <Card className="p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                    <Info className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Changes Summary
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Current configuration
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <SummaryRow
                    label="Maximum Players"
                    value="20"
                  />

                  <SummaryRow
                    label="Total Questions"
                    value="60"
                  />

                  <SummaryRow
                    label="Selected Subjects"
                    value={String(
                      selectedSubjectIds.length,
                    )}
                  />

                  <SummaryRow
                    label="Entry Fee"
                    value={`${formatPoints(
                      Number(
                        form.entryFee || 0,
                      ),
                    )} points`}
                  />

                  <SummaryRow
                    label="Winner Reward"
                    value={`${formatPoints(
                      Number(
                        form.winnerReward ||
                          0,
                      ),
                    )} points`}
                  />

                  <SummaryRow
                    label="Time / Question"
                    value={`${form.timePerQuestionSeconds} sec`}
                  />

                  <SummaryRow
                    label="Difficulty"
                    value={`${difficultyTotal}%`}
                  />
                </div>
              </Card>

              {/* Subject summary */}
              <Card className="p-5">
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Selected Subjects
                </h2>

                <div className="mt-4 space-y-2">
                  {selectedSubjects.length >
                  0 ? (
                    selectedSubjects.map(
                      (subject) => (
                        <div
                          key={
                            subject._id
                          }
                          className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
                        >
                          <BookIcon />

                          <span className="truncate">
                            {subject.name}
                          </span>
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No subjects selected.
                    </p>
                  )}
                </div>
              </Card>

              {/* Important rules */}
              <Card className="border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                      Protected game rules
                    </h3>

                    <ul className="mt-2 space-y-2 text-sm leading-5 text-blue-800/80 dark:text-blue-300/80">
                      <li>
                        • Maximum of 20 players
                      </li>

                      <li>
                        • 60 questions across 5 rounds
                      </li>

                      <li>
                        • 20 → 15 → 10 → 5 → 2 → 1
                      </li>

                      <li>
                        • Final round contains 20 questions
                      </li>

                      <li>
                        • Winner determined by final score
                      </li>

                      <li>
                        • CBT Points only
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Save */}
              <div className="sticky bottom-4">
                <Card className="border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={
                        saving ||
                        loadingSubjects
                      }
                      className="w-full"
                      leftIcon={
                        saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )
                      }
                    >
                      {saving
                        ? "Saving Changes..."
                        : "Save Changes"}
                    </Button>

                    <Link
                      href={`/admin/secondary/quiz-board/quiz-competitions/${getBoardId(
                        board,
                      )}`}
                      className="w-full"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        disabled={saving}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
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

function FixedRule({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function EstimatedQuestion({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    string
  > = {
    DRAFT:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
    UPCOMING:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
    OPEN:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
    FULL:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
    LIVE:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
    COMPLETED:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300",
    CANCELLED:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
        config[status] ??
        config.DRAFT
      }`}
    >
      {status === "LIVE" && (
        <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}

      {status.charAt(0) +
        status.slice(1).toLowerCase()}
    </span>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 11a8.1 8.1 0 0 0-14.9-4L3 10" />
      <path d="M3 4v6h6" />
      <path d="M4 13a8.1 8.1 0 0 0 14.9 4L21 14" />
      <path d="M21 20v-6h-6" />
    </svg>
  );
}

function BookIcon() {
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