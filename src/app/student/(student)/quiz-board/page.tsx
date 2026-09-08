







"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  Coins,
  Filter,
  Flame,
  Gamepad2,
  GraduationCap,
  HelpCircle,
  Layers3,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type QuizBoardStatus =
  | "OPEN"
  | "UPCOMING"
  | "LIVE"
  | "FULL"
  | "COMPLETED";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

type QuizBoard = {
  id: string;
  title: string;
  description: string;
  subject: string;
  examType: string;
  difficulty: Difficulty;
  status: QuizBoardStatus;
  players: number;
  maxPlayers: number;
  entryFee: number;
  entryFeeType: "CBT_POINTS";
  winnerReward: number;
  totalQuestions: number;
  durationMinutes: number;
  startsAt: string;
  createdAt: string;
};

const MOCK_QUIZ_BOARDS: QuizBoard[] = [
  {
    id: "biology-speed-challenge",
    title: "Biology Speed Challenge",
    description:
      "Race through Biology questions and qualify through five elimination rounds.",
    subject: "Biology",
    examType: "JAMB",
    difficulty: "MEDIUM",
    status: "OPEN",
    players: 17,
    maxPlayers: 20,
    entryFee: 5,
    entryFeeType: "CBT_POINTS",
    winnerReward: 100,
    totalQuestions: 20,
    durationMinutes: 15,
    startsAt: "2026-09-09T10:00:00",
    createdAt: "2026-09-08T12:00:00",
  },
  {
    id: "chemistry-championship",
    title: "Chemistry Championship",
    description:
      "Test your Chemistry knowledge against other students in a fast-paced battle.",
    subject: "Chemistry",
    examType: "JAMB",
    difficulty: "HARD",
    status: "OPEN",
    players: 12,
    maxPlayers: 20,
    entryFee: 10,
    entryFeeType: "CBT_POINTS",
    winnerReward: 200,
    totalQuestions: 20,
    durationMinutes: 18,
    startsAt: "2026-09-09T11:30:00",
    createdAt: "2026-09-08T13:00:00",
  },
  {
    id: "physics-power-round",
    title: "Physics Power Round",
    description:
      "A competitive Physics quiz designed for students who love solving under pressure.",
    subject: "Physics",
    examType: "JAMB",
    difficulty: "HARD",
    status: "UPCOMING",
    players: 8,
    maxPlayers: 20,
    entryFee: 8,
    entryFeeType: "CBT_POINTS",
    winnerReward: 160,
    totalQuestions: 20,
    durationMinutes: 16,
    startsAt: "2026-09-09T13:00:00",
    createdAt: "2026-09-08T14:00:00",
  },
  {
    id: "english-quick-fire",
    title: "English Quick Fire",
    description:
      "Answer fast, stay accurate and qualify for the final round.",
    subject: "Use of English",
    examType: "JAMB",
    difficulty: "EASY",
    status: "LIVE",
    players: 20,
    maxPlayers: 20,
    entryFee: 5,
    entryFeeType: "CBT_POINTS",
    winnerReward: 100,
    totalQuestions: 20,
    durationMinutes: 12,
    startsAt: "2026-09-09T09:00:00",
    createdAt: "2026-09-08T10:00:00",
  },
  {
    id: "mathematics-masterclass",
    title: "Mathematics Masterclass",
    description:
      "Challenge yourself with difficult JAMB Mathematics questions.",
    subject: "Mathematics",
    examType: "JAMB",
    difficulty: "HARD",
    status: "FULL",
    players: 20,
    maxPlayers: 20,
    entryFee: 10,
    entryFeeType: "CBT_POINTS",
    winnerReward: 200,
    totalQuestions: 20,
    durationMinutes: 20,
    startsAt: "2026-09-09T14:30:00",
    createdAt: "2026-09-08T15:00:00",
  },
  {
    id: "agricultural-science-battle",
    title: "Agricultural Science Battle",
    description:
      "Compete with other students and prove your Agricultural Science knowledge.",
    subject: "Agricultural Science",
    examType: "JAMB",
    difficulty: "MEDIUM",
    status: "COMPLETED",
    players: 20,
    maxPlayers: 20,
    entryFee: 5,
    entryFeeType: "CBT_POINTS",
    winnerReward: 100,
    totalQuestions: 20,
    durationMinutes: 15,
    startsAt: "2026-09-08T16:00:00",
    createdAt: "2026-09-07T12:00:00",
  },
];

const STATUS_OPTIONS: Array<{
  value: "ALL" | QuizBoardStatus;
  label: string;
}> = [
  { value: "ALL", label: "All Boards" },
  { value: "OPEN", label: "Open" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "LIVE", label: "Live Now" },
  { value: "FULL", label: "Full" },
  { value: "COMPLETED", label: "Completed" },
];

const DIFFICULTY_OPTIONS: Array<{
  value: "ALL" | Difficulty;
  label: string;
}> = [
  { value: "ALL", label: "All Difficulties" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getRelativeTime(dateString: string) {
  const target = new Date(dateString).getTime();
  const now = Date.now();
  const difference = target - now;

  if (difference <= 0) {
    return "Started";
  }

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Starts in ${days}d ${hours % 24}h`;
  }

  if (hours > 0) {
    return `Starts in ${hours}h ${minutes % 60}m`;
  }

  if (minutes > 0) {
    return `Starts in ${minutes}m`;
  }

  return "Starting soon";
}

function getDifficultyClasses(difficulty: Difficulty) {
  switch (difficulty) {
    case "EASY":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "HARD":
      return "bg-rose-50 text-rose-700 border-rose-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function getStatusClasses(status: QuizBoardStatus) {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "LIVE":
      return "bg-red-50 text-red-700 border-red-200";

    case "FULL":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "COMPLETED":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
}

function getStatusLabel(status: QuizBoardStatus) {
  switch (status) {
    case "OPEN":
      return "Open";

    case "UPCOMING":
      return "Upcoming";

    case "LIVE":
      return "Live";

    case "FULL":
      return "Full";

    case "COMPLETED":
      return "Completed";

    default:
      return status;
  }
}

function getSubjectIcon(subject: string) {
  if (subject.toLowerCase().includes("biology")) {
    return "🧬";
  }

  if (subject.toLowerCase().includes("chemistry")) {
    return "⚗️";
  }

  if (subject.toLowerCase().includes("physics")) {
    return "⚛️";
  }

  if (subject.toLowerCase().includes("mathematics")) {
    return "📐";
  }

  if (subject.toLowerCase().includes("english")) {
    return "📚";
  }

  if (subject.toLowerCase().includes("agricultural")) {
    return "🌱";
  }

  return "🎯";
}

export default function QuizBoardPage() {
  const [boards, setBoards] = useState<QuizBoard[]>(MOCK_QUIZ_BOARDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | QuizBoardStatus
  >("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "ALL" | Difficulty
  >("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(boards.map((board) => board.subject)),
    );

    return ["ALL", ...uniqueSubjects];
  }, [boards]);

  const filteredBoards = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return boards.filter((board) => {
      const matchesSearch =
        !normalizedSearch ||
        board.title.toLowerCase().includes(normalizedSearch) ||
        board.subject.toLowerCase().includes(normalizedSearch) ||
        board.description.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || board.status === statusFilter;

      const matchesDifficulty =
        difficultyFilter === "ALL" ||
        board.difficulty === difficultyFilter;

      const matchesSubject =
        subjectFilter === "ALL" || board.subject === subjectFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDifficulty &&
        matchesSubject
      );
    });
  }, [
    boards,
    searchQuery,
    statusFilter,
    difficultyFilter,
    subjectFilter,
  ]);

  const openBoards = boards.filter((board) => board.status === "OPEN");
  const liveBoards = boards.filter((board) => board.status === "LIVE");
  const upcomingBoards = boards.filter(
    (board) => board.status === "UPCOMING",
  );

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    difficultyFilter !== "ALL" ||
    subjectFilter !== "ALL" ||
    searchQuery.trim().length > 0;

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDifficultyFilter("ALL");
    setSubjectFilter("ALL");
  }

  function getBoardAction(board: QuizBoard) {
    switch (board.status) {
      case "OPEN":
        return "View & Join";

      case "LIVE":
        return "View Live";

      case "UPCOMING":
        return "View Details";

      case "FULL":
        return "View Board";

      case "COMPLETED":
        return "View Result";

      default:
        return "View Board";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ---------------------------------------------------------
          HERO
      --------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <Gamepad2 className="h-4 w-4" />
                Competitive Learning
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Quiz Board
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Explore live and upcoming quiz battles. Pick a board, check
                the rules, and compete against other students for the top
                spot.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Up to 20 players
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-700">
                    5 elimination rounds
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Speed matters
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Competition Format
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      20 → 15 → 10 → 5 → 2 → 1
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Boards</p>
                    <p className="mt-1 text-xl font-black text-slate-900">
                      {boards.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Live now</p>
                    <p className="mt-1 text-xl font-black text-red-600">
                      {liveBoards.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          QUICK STATS
      --------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Open
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {openBoards.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Ready to join
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Live
              </span>
              <Radio className="h-4 w-4 text-red-500" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {liveBoards.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Happening now
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Upcoming
              </span>
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {upcomingBoards.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Starting soon
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Players
              </span>
              <Users className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {boards.reduce((total, board) => total + board.players, 0)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Across all boards
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SEARCH + FILTERS
      --------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search Quiz Boards, subjects..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters((value) => !value)}
              className="h-11 gap-2 rounded-xl border-slate-200 px-4"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                  !
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "ALL" | QuizBoardStatus,
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Difficulty
                </label>

                <select
                  value={difficultyFilter}
                  onChange={(event) =>
                    setDifficultyFilter(
                      event.target.value as "ALL" | Difficulty,
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Subject
                </label>

                <select
                  value={subjectFilter}
                  onChange={(event) => setSubjectFilter(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject === "ALL" ? "All Subjects" : subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500">
                Showing {filteredBoards.length} of {boards.length} boards
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------
          BOARD LIST
      --------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                Quiz Boards
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Browse competitions and choose the one you want to view.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
            <ShieldCheck className="h-4 w-4" />
            Secure competitions
          </div>
        </div>

        {filteredBoards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-lg font-black text-slate-900">
              No Quiz Boards found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or filters to find another Quiz Board.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="mt-5 rounded-xl"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredBoards.map((board) => {
              const playerPercentage =
                board.maxPlayers > 0
                  ? Math.min(
                      100,
                      Math.round((board.players / board.maxPlayers) * 100),
                    )
                  : 0;

              const isLive = board.status === "LIVE";
              const isCompleted = board.status === "COMPLETED";
              const isFull = board.status === "FULL";

              return (
                <article
                  key={board.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  {/* Card top */}
                  <div className="border-b border-slate-100 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                          {getSubjectIcon(board.subject)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            {board.examType} • {board.subject}
                          </p>

                          <h3 className="mt-1 truncate text-base font-black text-slate-950 sm:text-lg">
                            {board.title}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(
                          board.status,
                        )}`}
                      >
                        {isLive && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                        )}
                        {getStatusLabel(board.status)}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                      {board.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getDifficultyClasses(
                          board.difficulty,
                        )}`}
                      >
                        {board.difficulty}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {board.totalQuestions} questions
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        <Clock3 className="h-3.5 w-3.5" />
                        {board.durationMinutes} min
                      </span>
                    </div>
                  </div>

                  {/* Players */}
                  <div className="px-5 pt-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-bold text-slate-700">
                          {board.players}/{board.maxPlayers}
                        </span>

                        <span className="text-xs text-slate-400">
                          players
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-slate-500">
                        {playerPercentage}% full
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isLive
                            ? "bg-red-500"
                            : isFull
                              ? "bg-orange-500"
                              : "bg-blue-600"
                        }`}
                        style={{
                          width: `${playerPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-px px-5 py-5 sm:px-6">
                    <div className="rounded-l-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-medium text-slate-500">
                          Entry
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-black text-slate-900">
                        {board.entryFee} CBT points
                      </p>
                    </div>

                    <div className="rounded-r-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-medium text-slate-500">
                          Winner
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-black text-slate-900">
                        {board.winnerReward} CBT points
                      </p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="mx-5 rounded-2xl border border-slate-100 bg-white p-3 sm:mx-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {isLive
                            ? "Started"
                            : isCompleted
                              ? "Competition time"
                              : "Scheduled"}
                        </p>

                        <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                          {formatDate(board.startsAt)}
                        </p>
                      </div>

                      {!isCompleted && (
                        <span className="ml-auto shrink-0 text-xs font-bold text-blue-600">
                          {currentTime > 0 &&
                            getRelativeTime(board.startsAt)}
                        </span>
                      )}
                    </div>
                  </div>




                  {/* Action */}
                  <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {isLive ? (
                        <>
                          <Radio className="h-4 w-4 text-red-500" />
                          Live competition
                        </>
                      ) : isCompleted ? (
                        <>
                          <Trophy className="h-4 w-4 text-slate-400" />
                          Competition ended
                        </>
                      ) : (
                        <>
                          <Layers3 className="h-4 w-4" />
                          5-stage elimination
                        </>
                      )}
                    </div>

                    <Link href={`/student/quiz-board/${board.id}`}>
                      <Button
                        className={`gap-2 rounded-xl px-4 ${
                          isLive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-slate-950 hover:bg-slate-800"
                        }`}
                      >
                        {getBoardAction(board)}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
  {/* Watch button */}
  <Link
    href={`/student/quiz-board/${board.id}/watch`}
    className="w-full"
  >
    <Button
      type="button"
      variant="outline"
      className={`w-full gap-2 rounded-xl border-slate-200 ${
        isLive
          ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Eye className="h-4 w-4" />

      {isLive
        ? "Watch Live"
        : isCompleted
          ? "Watch Replay"
          : "Watch"}
    </Button>
  </Link>

                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------
          HOW IT WORKS
      --------------------------------------------------------- */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
              <Flame className="h-5 w-5 text-blue-600" />
            </div>

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              How Quiz Board works
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Every board starts with up to 20 students and progressively
              eliminates players until one champion remains.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                round: "Round 1",
                players: "20 → 15",
                description: "First elimination",
              },
              {
                round: "Round 2",
                players: "15 → 10",
                description: "Speed and accuracy",
              },
              {
                round: "Round 3",
                players: "10 → 5",
                description: "Top performers",
              },
              {
                round: "Round 4",
                players: "5 → 2",
                description: "Final qualification",
              },
              {
                round: "Final",
                players: "2 → 1",
                description: "Champion decided",
              },
            ].map((item, index) => (
              <div
                key={item.round}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {item.round}
                  </span>

                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-blue-600 shadow-sm">
                    {index + 1}
                  </span>
                </div>

                <p className="mt-3 text-lg font-black text-slate-900">
                  {item.players}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          FOOTER INFO
      --------------------------------------------------------- */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Fair and competitive
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                  Quiz Board results are designed to be determined by answer
                  correctness, response order and performance. Competition
                  timing and final qualification will be controlled by the
                  server when the backend is connected.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <GraduationCap className="h-4 w-4" />
              Learn • Compete • Qualify
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}