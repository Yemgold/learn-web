




// src/lib/quiz-board/types.ts

export type QuizApiStatus =
  | "DRAFT"
  | "OPEN"
  | "UPCOMING"
  | "LIVE"
  | "ONGOING"
  | "FULL"
  | "COMPLETED"
  | "CLOSED"
  | "PUBLISHED"
  | string;

export type DisplayStatus =
  | "OPEN"
  | "UPCOMING"
  | "LIVE"
  | "FULL"
  | "COMPLETED";

export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "MIXED";

export interface DifficultyBreakdown {
  easy?: number;
  medium?: number;
  hard?: number;
  [key: string]: unknown;
}

export interface QuizRound {
  round?: number;
  round_number?: number;
  name?: string;
  title?: string;

  number_of_questions?: number;
  no_of_questions?: number;

  difficulty_breakdown?: DifficultyBreakdown;

  easy_questions?: number;
  medium_questions?: number;
  hard_questions?: number;

  exit_number?: number;
  exit_reward?: number;

  [key: string]: unknown;
}

export interface FinalRoundInformation {
  number_of_questions?: number;
  no_of_questions?: number;

  difficulty_breakdown?: DifficultyBreakdown;

  easy_questions?: number;
  medium_questions?: number;
  hard_questions?: number;

  first_reward?: number;
  second_reward?: number;

  winner_reward?: number;
  runner_up_reward?: number;

  [key: string]: unknown;
}

export interface QuizApiSubject {
  _id?: string;
  id?: string;
  name?: string;
  subjectName?: string;

  [key: string]: unknown;
}

export interface QuizJoinedUser {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  email?: string;

  [key: string]: unknown;
}

export interface QuizApiItem {
  _id: string;

  id?: string;

  quiz_title: string;
  title?: string;

  description?: string;

  status: QuizApiStatus;

  subject?: QuizApiSubject | string | null;

  exam_type?: string;
  examType?: string;

  time_per_question?: number;
  timePerQuestion?: number;

  start_date?: string;
  startDate?: string;

  end_date?: string;
  endDate?: string;

  no_of_contestants?: number;
  max_contestants?: number;
  maxPlayers?: number;

  joined_users?: QuizJoinedUser[];

  number_of_rounds?: number;

  round_information?: QuizRound[];

  final_round_information?: FinalRoundInformation;

  current_round?: number;

  room_id?: string | null;
  roomId?: string | null;

  winner_reward?: number;
  first_reward?: number;

  second_reward?: number;

  entry_fee?: number;
  entryFee?: number;

  entry_fee_type?: string;
  entryFeeType?: string;

  amount_to_be_won_in_kobo?: number;
  amountToBeWonInKobo?: number;

  total_questions?: number;
  totalQuestions?: number;

  createdAt?: string;
  updatedAt?: string;

  created_at?: string;
  updated_at?: string;

  [key: string]: unknown;
}

export interface QuizApiPagination {
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface QuizApiData {
  totalCount?: number;
  totalPages?: number;
  page?: number;
  limit?: number;

  quizzesObj: QuizApiItem[];
}

export interface QuizApiResponse {
  success?: boolean;
  message?: string;

  data: QuizApiData;
}

export interface QuizBoard {
  id: string;

  title: string;

  description: string;

  subject: string;

  examType: string;

  difficulty: Difficulty;

  status: DisplayStatus;

  players: number;

  maxPlayers: number;

  entryFee: number;

  entryFeeType: string;

  winnerReward: number;

  secondReward: number;

  totalQuestions: number;

  durationMinutes: number;

  startsAt: string | null;

  createdAt: string | null;

  numberOfRounds: number;

  timePerQuestion: number;

  roomId: string | null;

  /**
   * Contestant identifier assigned to this user's
   * participation in the competition.
   *
   * Example:
   * AT-SUWI20S9
   */
  contestantId: string | null;

  /**
   * Current backend room status.
   *
   * Example:
   * WAITING, ACTIVE, IN_PROGRESS, COMPLETED
   */
  roomStatus?: string | null;

  /**
   * Current round reported by the backend.
   */
  currentRound?: number;

  /**
   * Current number of registered/joined contestants.
   */
  joined_users?: string[];

  /**
   * Maximum number of contestants allowed.
   */
  max_contestants?: number;

  /**
   * Original participation object.
   *
   * Useful when a component needs information that
   * isn't part of the normalized QuizBoard fields.
   */
  participation?: QuizParticipation;
}

export interface QuizBoardFilters {
  searchQuery: string;

  statusFilter: DisplayStatus | "ALL";

  difficultyFilter: Difficulty | "ALL";

  subjectFilter: string;
}

export interface QuizBoardStats {
  total: number;

  open: number;

  upcoming: number;

  live: number;

  completed: number;
}

export interface QuizBoardAction {
  label: string;

  href: string;

  variant:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";

  icon?:
    | "arrow-right"
    | "eye"
    | "play"
    | "users";
}

export interface QuizParticipation {
  _id: string;

  /**
   * Competition/quiz this participation belongs to.
   */
  quizId: QuizApiItem;

  /**
   * Authenticated user who owns this participation.
   */
  userId: string;

  /**
   * Contestant identifier assigned to this participation.
   *
   * Example:
   * AT-SUWI20S9
   */
  contestantId?: string | null;

  status?: string;

  currentRound?: number;

  totalScore?: number;

  totalTimeTakenInSeconds?: number;

  rewardEarned?: number;

  finalPosition?: number | null;

  eliminatedInRound?: number | null;

  createdAt?: string;

  updatedAt?: string;

  [key: string]: unknown;
}

export interface MyQuizApiResponse {
  success?: boolean;

  message?: string;

  data?: {
    totalCount?: number;

    totalPages?: number;

    page?: number;

    limit?: number;

    participationsObj?: QuizParticipation[];

    quizzesObj?: QuizApiItem[];
  };

  totalCount?: number;

  totalPages?: number;

  page?: number;

  limit?: number;

  participationsObj?: QuizParticipation[];

  quizzesObj?: QuizApiItem[];
}


