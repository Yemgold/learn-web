





import { axiosInstance } from "@/lib/api";

/* ============================================================
   ENDPOINT
============================================================ */

export const GET_CONTESTS_ENDPOINT = "/quiz/get-all-quizzes";

/* ============================================================
   TYPES
============================================================ */

export type CompetitionStatus =
  | "DRAFT"
  | "WAITING"
  | "UPCOMING"
  | "IN_PROGRESS"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "UNKNOWN";

export type DifficultyDistribution = {
  easy: number;
  medium: number;
  hard: number;
};

export type RoundInformation = {
  round_number: number;
  no_of_questions: number;
  difficultyBreakdown?: DifficultyDistribution;
  difficulty?: DifficultyDistribution;
  exit_number: number;
  exit_reward: number;
};

export type FinalRoundInformation = {
  no_of_questions: number;
  difficultyBreakdown?: DifficultyDistribution;
  difficulty?: DifficultyDistribution;
  first_position_reward: number;
  second_position_reward: number;
};

export type Subject = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
};

export type Competition = {
  _id?: string;
  id?: string;

  quiz_title: string;
  description?: string;

  subject: string | Subject | null;

  time_per_question: number;

  start_date: string;

  no_of_contestants: number;

  number_of_rounds: number;

  round_information: RoundInformation[];

  final_round_information?: FinalRoundInformation;

  current_round?: number;

  room_id?: string | null;

  joined_users?: string[];

  status?: CompetitionStatus | string;

  contestants?: number;
  players?: number;
  participants?: number;

  createdAt?: string;
  updatedAt?: string;
};

export type CompetitionWithStatus =
  Competition & {
    resolvedStatus: CompetitionStatus;
  };

export type ApiResponse = {
  success?: boolean;
  message?: string;

  data?: {
    totalCount?: number;
    totalPages?: number;
    quizzesObj?: Competition[];
  };
};

/* ============================================================
   API
============================================================ */

export async function getQuizCompetitions() {
  const response =
    await axiosInstance.get<ApiResponse>(
      GET_CONTESTS_ENDPOINT,
    );

  const apiData = response.data?.data;

  const list = Array.isArray(
    apiData?.quizzesObj,
  )
    ? apiData.quizzesObj
    : [];

  return {
    competitions: list.map(
      (competition) => ({
        ...competition,
        id: getCompetitionId(
          competition,
        ),
        round_information:
          Array.isArray(
            competition.round_information,
          )
            ? competition.round_information
            : [],
      }),
    ),
    totalCount: Number(
      apiData?.totalCount ??
        list.length,
    ),
    totalPages: Number(
      apiData?.totalPages ?? 1,
    ),
  };
}

/* ============================================================
   ID
============================================================ */

export function getCompetitionId(
  competition: Competition,
) {
  return String(
    competition.id ??
      competition._id ??
      "",
  );
}

/* ============================================================
   SUBJECT
============================================================ */

export function getSubjectName(
  subject: Competition["subject"],
) {
  if (!subject) {
    return "Subject not assigned";
  }

  if (typeof subject === "string") {
    return subject;
  }

  return (
    subject.name ??
    subject.title ??
    subject._id ??
    subject.id ??
    "Subject not assigned"
  );
}

/* ============================================================
   PARTICIPANTS
============================================================ */

export function getParticipantCount(
  competition: Competition,
) {
  if (
    Array.isArray(
      competition.joined_users,
    )
  ) {
    return competition.joined_users
      .length;
  }

  return (
    competition.contestants ??
    competition.players ??
    competition.participants ??
    0
  );
}

/* ============================================================
   TOTAL QUESTIONS
============================================================ */

export function getTotalQuestions(
  competition: Competition,
) {
  const eliminationQuestions =
    Array.isArray(
      competition.round_information,
    )
      ? competition.round_information.reduce(
          (total, round) =>
            total +
            Number(
              round.no_of_questions ||
                0,
            ),
          0,
        )
      : 0;

  const finalQuestions = Number(
    competition
      .final_round_information
      ?.no_of_questions || 0,
  );

  return (
    eliminationQuestions +
    finalQuestions
  );
}

/* ============================================================
   DIFFICULTY
============================================================ */

export function getDifficulty(
  round: RoundInformation,
): DifficultyDistribution {
  return (
    round.difficultyBreakdown ??
    round.difficulty ?? {
      easy: 0,
      medium: 0,
      hard: 0,
    }
  );
}

/* ============================================================
   STATUS
============================================================ */

export function inferStatus(
  competition: Competition,
): CompetitionStatus {
  const explicitStatus = String(
    competition.status ?? "",
  ).toUpperCase();

  if (
    explicitStatus ===
    "IN_PROGRESS"
  ) {
    return "IN_PROGRESS";
  }

  if (explicitStatus === "LIVE") {
    return "LIVE";
  }

  if (explicitStatus === "WAITING") {
    return "WAITING";
  }

  if (explicitStatus === "DRAFT") {
    return "DRAFT";
  }

  if (explicitStatus === "UPCOMING") {
    return "UPCOMING";
  }

  if (
    explicitStatus ===
    "COMPLETED"
  ) {
    return "COMPLETED";
  }

  if (
    explicitStatus ===
    "CANCELLED"
  ) {
    return "CANCELLED";
  }

  if (competition.start_date) {
    const startTime = new Date(
      competition.start_date,
    ).getTime();

    if (
      !Number.isNaN(startTime) &&
      startTime > Date.now()
    ) {
      return "UPCOMING";
    }
  }

  return "UNKNOWN";
}

/* ============================================================
   LIVE
============================================================ */

export function isLiveCompetition(
  competition: Competition,
) {
  const status =
    inferStatus(competition);

  return (
    status === "LIVE" ||
    status === "IN_PROGRESS"
  );
}

/* ============================================================
   STATUS CLASSES
============================================================ */

export function getStatusClasses(
  status: CompetitionStatus,
) {
  switch (status) {
    case "LIVE":
    case "IN_PROGRESS":
      return "border-red-200 bg-red-50 text-red-700";

    case "WAITING":
    case "UPCOMING":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "COMPLETED":
      return "border-slate-200 bg-slate-100 text-slate-600";

    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";

    case "DRAFT":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

/* ============================================================
   STATUS LABEL
============================================================ */

export function getStatusLabel(
  status: CompetitionStatus,
) {
  switch (status) {
    case "LIVE":
    case "IN_PROGRESS":
      return "In Progress";

    case "WAITING":
      return "Waiting";

    case "UPCOMING":
      return "Upcoming";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "DRAFT":
      return "Draft";

    default:
      return "Status unavailable";
  }
}

/* ============================================================
   DATE
============================================================ */

export function formatDate(
  dateString?: string,
) {
  if (!dateString) {
    return "Not scheduled";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}

export function formatShortDate(
  dateString?: string,
) {
  if (!dateString) {
    return "Not scheduled";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}