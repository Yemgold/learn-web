




// src/lib/quiz-board/helpers.ts

import type {
  Difficulty,
  DisplayStatus,
  QuizApiItem,
  QuizBoard,
  QuizBoardAction,
  QuizBoardStats,
} from "@/lib/quiz-board/types";

/* -------------------------------------------------------------------------- */
/* Basic value helpers                                                        */
/* -------------------------------------------------------------------------- */

export function getStringValue(
  value: unknown,
  fallback = "",
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

export function getNumberValue(
  value: unknown,
  fallback = 0,
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

/* -------------------------------------------------------------------------- */
/* Subject                                                                    */
/* -------------------------------------------------------------------------- */

export function getSubjectName(
  quiz: QuizApiItem,
): string {
  if (typeof quiz.subject === "string") {
    return quiz.subject;
  }

  if (
    quiz.subject &&
    typeof quiz.subject === "object"
  ) {
    return (
      getStringValue(quiz.subject.name) ||
      getStringValue(quiz.subject.subjectName) ||
      "General"
    );
  }

  return "General";
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

export function normalizeStatus(
  status: unknown,
): DisplayStatus {
  const normalized = getStringValue(status)
    .toUpperCase()
    .trim();

  switch (normalized) {
    case "OPEN":
    case "PUBLISHED":
      return "OPEN";

    case "UPCOMING":
      return "UPCOMING";

    case "LIVE":
    case "ONGOING":
      return "LIVE";

    case "FULL":
      return "FULL";

    case "COMPLETED":
    case "CLOSED":
      return "COMPLETED";

    case "DRAFT":
    default:
      return "UPCOMING";
  }
}

export function getStatusLabel(
  status: DisplayStatus,
): string {
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

export function getStatusClasses(
  status: DisplayStatus,
): string {
  switch (status) {
    case "OPEN":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    case "UPCOMING":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";

    case "LIVE":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    case "FULL":
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";

    case "COMPLETED":
      return "border-slate-500/30 bg-slate-500/10 text-slate-400";

    default:
      return "border-slate-500/30 bg-slate-500/10 text-slate-400";
  }
}

/* -------------------------------------------------------------------------- */
/* Difficulty                                                                 */
/* -------------------------------------------------------------------------- */

function getDifficultyTotal(
  difficulty: unknown,
): number {
  return getNumberValue(difficulty, 0);
}

export function getDifficultyFromQuiz(
  quiz: QuizApiItem,
): Difficulty {
  const rounds = Array.isArray(quiz.round_information)
    ? quiz.round_information
    : [];

  const finalRound = quiz.final_round_information;

  let easy = 0;
  let medium = 0;
  let hard = 0;

  for (const round of rounds) {
    const breakdown = round.difficulty_breakdown;

    if (breakdown) {
      easy += getDifficultyTotal(breakdown.easy);
      medium += getDifficultyTotal(breakdown.medium);
      hard += getDifficultyTotal(breakdown.hard);
    }

    easy += getNumberValue(round.easy_questions);
    medium += getNumberValue(round.medium_questions);
    hard += getNumberValue(round.hard_questions);
  }

  if (finalRound) {
    const breakdown = finalRound.difficulty_breakdown;

    if (breakdown) {
      easy += getDifficultyTotal(breakdown.easy);
      medium += getDifficultyTotal(breakdown.medium);
      hard += getDifficultyTotal(breakdown.hard);
    }

    easy += getNumberValue(finalRound.easy_questions);
    medium += getNumberValue(finalRound.medium_questions);
    hard += getNumberValue(finalRound.hard_questions);
  }

  const total = easy + medium + hard;

  if (total === 0) {
    return "MIXED";
  }

  if (
    easy === total &&
    easy > 0
  ) {
    return "EASY";
  }

  if (
    medium === total &&
    medium > 0
  ) {
    return "MEDIUM";
  }

  if (
    hard === total &&
    hard > 0
  ) {
    return "HARD";
  }

  return "MIXED";
}

export function getDifficultyClasses(
  difficulty: Difficulty,
): string {
  switch (difficulty) {
    case "EASY":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    case "MEDIUM":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";

    case "HARD":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    case "MIXED":
    default:
      return "border-violet-500/30 bg-violet-500/10 text-violet-400";
  }
}

export function getDifficultyLabel(
  difficulty: Difficulty,
): string {
  switch (difficulty) {
    case "EASY":
      return "Easy";

    case "MEDIUM":
      return "Medium";

    case "HARD":
      return "Hard";

    case "MIXED":
    default:
      return "Mixed";
  }
}

/* -------------------------------------------------------------------------- */
/* Questions / rounds                                                         */
/* -------------------------------------------------------------------------- */

export function getTotalQuestions(
  quiz: QuizApiItem,
): number {
  if (
    typeof quiz.total_questions === "number" &&
    quiz.total_questions > 0
  ) {
    return quiz.total_questions;
  }

  if (
    typeof quiz.totalQuestions === "number" &&
    quiz.totalQuestions > 0
  ) {
    return quiz.totalQuestions;
  }

  let total = 0;

  const rounds = Array.isArray(quiz.round_information)
    ? quiz.round_information
    : [];

  for (const round of rounds) {
    const numberOfQuestions =
      getNumberValue(round.number_of_questions) ||
      getNumberValue(round.no_of_questions);

    total += numberOfQuestions;
  }

  if (quiz.final_round_information) {
    total +=
      getNumberValue(
        quiz.final_round_information.number_of_questions,
      ) ||
      getNumberValue(
        quiz.final_round_information.no_of_questions,
      );
  }

  return total;
}

/* -------------------------------------------------------------------------- */
/* Players                                                                    */
/* -------------------------------------------------------------------------- */

export function getPlayerCount(
  quiz: QuizApiItem,
): number {
  if (Array.isArray(quiz.joined_users)) {
    return quiz.joined_users.length;
  }

  return 0;
}

export function getMaxPlayers(
  quiz: QuizApiItem,
): number {
  return (
    getNumberValue(quiz.no_of_contestants) ||
    getNumberValue(quiz.max_contestants) ||
    getNumberValue(quiz.maxPlayers)
  );
}

/* -------------------------------------------------------------------------- */
/* Entry fee / rewards                                                        */
/* -------------------------------------------------------------------------- */

export function getEntryFee(
  quiz: QuizApiItem,
): number {
  return (
    getNumberValue(quiz.entry_fee) ||
    getNumberValue(quiz.entryFee)
  );
}

export function getWinnerReward(
  quiz: QuizApiItem,
): number {
  return (
    getNumberValue(quiz.winner_reward) ||
    getNumberValue(quiz.first_reward)
  );
}

export function getSecondReward(
  quiz: QuizApiItem,
): number {
  return getNumberValue(quiz.second_reward);
}

/* -------------------------------------------------------------------------- */
/* Time                                                                       */
/* -------------------------------------------------------------------------- */

export function getTimePerQuestion(
  quiz: QuizApiItem,
): number {
  return (
    getNumberValue(quiz.time_per_question) ||
    getNumberValue(quiz.timePerQuestion)
  );
}

export function getDurationMinutes(
  quiz: QuizApiItem,
): number {
  const totalQuestions = getTotalQuestions(quiz);
  const secondsPerQuestion = getTimePerQuestion(quiz);

  if (
    totalQuestions <= 0 ||
    secondsPerQuestion <= 0
  ) {
    return 0;
  }

  return Math.ceil(
    (totalQuestions * secondsPerQuestion) / 60,
  );
}

/* -------------------------------------------------------------------------- */
/* Dates                                                                      */
/* -------------------------------------------------------------------------- */

export function getStartDate(
  quiz: QuizApiItem,
): string | null {
  const date =
    getStringValue(quiz.start_date) ||
    getStringValue(quiz.startDate);

  return date || null;
}

export function getCreatedDate(
  quiz: QuizApiItem,
): string | null {
  const date =
    getStringValue(quiz.createdAt) ||
    getStringValue(quiz.created_at);

  return date || null;
}

export function formatDate(
  dateString: string | null | undefined,
): string {
  if (!dateString) {
    return "Date not available";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getRelativeTime(
  dateString: string | null | undefined,
  now = Date.now(),
): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference = date.getTime() - now;
  const absoluteDifference = Math.abs(difference);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (absoluteDifference < minute) {
    return difference >= 0
      ? "Starting soon"
      : "Just now";
  }

  if (absoluteDifference < hour) {
    const minutes = Math.round(
      absoluteDifference / minute,
    );

    return difference >= 0
      ? `In ${minutes} min`
      : `${minutes} min ago`;
  }

  if (absoluteDifference < day) {
    const hours = Math.round(
      absoluteDifference / hour,
    );

    return difference >= 0
      ? `In ${hours} hr`
      : `${hours} hr ago`;
  }

  const days = Math.round(
    absoluteDifference / day,
  );

  return difference >= 0
    ? `In ${days} day${days === 1 ? "" : "s"}`
    : `${days} day${days === 1 ? "" : "s"} ago`;
}

/* -------------------------------------------------------------------------- */
/* Currency                                                                   */
/* -------------------------------------------------------------------------- */

export function formatNaira(
  amount: number,
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Converts Kobo to Naira.
 */
export function formatKoboAsNaira(
  amountInKobo: number,
): string {
  return formatNaira(amountInKobo / 100);
}

/* -------------------------------------------------------------------------- */
/* Quiz mapping                                                               */
/* -------------------------------------------------------------------------- */

export function mapQuizToBoard(
  quiz: QuizApiItem,
): QuizBoard {
  const status = normalizeStatus(quiz.status);

  const maxPlayers = getMaxPlayers(quiz);

  return {
    id: quiz._id,

    title:
      getStringValue(quiz.quiz_title) ||
      getStringValue(quiz.title) ||
      "Untitled Competition",

    description:
      getStringValue(quiz.description) ||
      "Test your knowledge against other JAMB League contestants.",

    subject: getSubjectName(quiz),

    examType:
      getStringValue(quiz.exam_type) ||
      getStringValue(quiz.examType) ||
      "JAMB",

    difficulty: getDifficultyFromQuiz(quiz),

    status,

    players: getPlayerCount(quiz),

    maxPlayers,

    entryFee: getEntryFee(quiz),

    entryFeeType:
      getStringValue(quiz.entry_fee_type) ||
      getStringValue(quiz.entryFeeType) ||
      "POINTS",

    winnerReward: getWinnerReward(quiz),

    secondReward: getSecondReward(quiz),

    totalQuestions: getTotalQuestions(quiz),

    durationMinutes: getDurationMinutes(quiz),

    startsAt: getStartDate(quiz),

    createdAt: getCreatedDate(quiz),

    numberOfRounds:
      getNumberValue(quiz.number_of_rounds) ||
      0,

    timePerQuestion: getTimePerQuestion(quiz),

    roomId:
      getStringValue(quiz.room_id) ||
      getStringValue(quiz.roomId) ||
      null,
  };
}

/* -------------------------------------------------------------------------- */
/* Statistics                                                                 */
/* -------------------------------------------------------------------------- */

export function getQuizBoardStats(
  boards: QuizBoard[],
): QuizBoardStats {
  return {
    total: boards.length,

    open: boards.filter(
      (board) => board.status === "OPEN",
    ).length,

    upcoming: boards.filter(
      (board) => board.status === "UPCOMING",
    ).length,

    live: boards.filter(
      (board) => board.status === "LIVE",
    ).length,

    completed: boards.filter(
      (board) => board.status === "COMPLETED",
    ).length,
  };
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                  */
/* -------------------------------------------------------------------------- */

export function filterQuizBoards(
  boards: QuizBoard[],
  searchQuery: string,
  statusFilter: DisplayStatus | "ALL",
  difficultyFilter: Difficulty | "ALL",
  subjectFilter: string,
): QuizBoard[] {
  const search = searchQuery
    .trim()
    .toLowerCase();

  const subject = subjectFilter
    .trim()
    .toLowerCase();

  return boards.filter((board) => {
    const matchesSearch =
      !search ||
      board.title.toLowerCase().includes(search) ||
      board.description.toLowerCase().includes(search) ||
      board.subject.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "ALL" ||
      board.status === statusFilter;

    const matchesDifficulty =
      difficultyFilter === "ALL" ||
      board.difficulty === difficultyFilter;

    const matchesSubject =
      !subject ||
      board.subject.toLowerCase() === subject;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDifficulty &&
      matchesSubject
    );
  });
}

export function getUniqueSubjects(
  boards: QuizBoard[],
): string[] {
  return Array.from(
    new Set(
      boards
        .map((board) => board.subject.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) =>
    a.localeCompare(b),
  );
}

/* -------------------------------------------------------------------------- */
/* Card action                                                                */
/* -------------------------------------------------------------------------- */

export function getBoardAction(
  board: QuizBoard,
): QuizBoardAction {
  switch (board.status) {
    case "OPEN":
      return {
        label: "Join Competition",
        href: `/student/quiz-board/${board.id}`,
        variant: "primary",
        icon: "arrow-right",
      };

    case "UPCOMING":
      return {
        label: "View Competition",
        href: `/student/quiz-board/${board.id}`,
        variant: "secondary",
        icon: "eye",
      };

    case "LIVE":
      return {
        label: "Enter Competition",
        href: `/student/quiz-board/${board.id}`,
        variant: "success",
        icon: "play",
      };

    case "FULL":
      return {
        label: "View Competition",
        href: `/student/quiz-board/${board.id}`,
        variant: "outline",
        icon: "eye",
      };

    case "COMPLETED":
      return {
        label: "View Results",
        href: `/student/quiz-board/${board.id}/watch`,
        variant: "outline",
        icon: "eye",
      };

    default:
      return {
        label: "View Competition",
        href: `/student/quiz-board/${board.id}`,
        variant: "outline",
        icon: "eye",
      };
  }
}

/* -------------------------------------------------------------------------- */
/* Player progress                                                            */
/* -------------------------------------------------------------------------- */

export function getPlayerAvailability(
  board: QuizBoard,
): {
  isFull: boolean;
  remaining: number;
} {
  const remaining = Math.max(
    board.maxPlayers - board.players,
    0,
  );

  return {
    isFull:
      board.maxPlayers > 0 &&
      board.players >= board.maxPlayers,

    remaining,
  };
}

export function getPlayerCountLabel(
  board: QuizBoard,
): string {
  if (board.maxPlayers <= 0) {
    return `${board.players} players`;
  }

  return `${board.players}/${board.maxPlayers} players`;
}