




// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\quiz-board\quiz.ts

/**
 * Quiz Board
 * Core quiz/competition types and normalization helpers.
 */

export type QuizStatus =
  | "DRAFT"
  | "UPCOMING"
  | "WAITING"
  | "OPEN"
  | "FULL"
  | "LIVE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type NormalizedQuizStatus =
  | "DRAFT"
  | "UPCOMING"
  | "OPEN"
  | "FULL"
  | "LIVE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type QuizCompetitionType =
  | "QUIZ"
  | "COMPETITION"
  | "LEAGUE"
  | "TOURNAMENT";

export type QuizEntryMode =
  | "FREE"
  | "PAID"
  | "PRACTICE"
  | "CBT";

export type QuizRoundType =
  | "ELIMINATION"
  | "FINAL"
  | "TIEBREAKER";

export type QuizRoomState =
  | "WAITING"
  | "READY"
  | "LIVE"
  | "LOCKED"
  | "COMPLETED"
  | "CANCELLED";

export interface QuizReward {
  id?: string;
  position?: number | null;
  first_position_reward?: number | null;
  second_position_reward?: number | null;
  exit_reward?: number | null;
  amount?: number | null;
  points?: number | null;
  label?: string | null;
}

export interface QuizEliminationRule {
  startingParticipants?: number | null;
  targetParticipants?: number | null;
  eliminateCount?: number | null;
  keepCount?: number | null;
}

export interface QuizRoundInformation {
  roundNumber?: number;
  round_number?: number;

  roundType?: QuizRoundType;
  round_type?: QuizRoundType;

  numberOfQuestions?: number;
  number_of_questions?: number;

  startingParticipants?: number | null;
  starting_participants?: number | null;

  targetParticipants?: number | null;
  target_participants?: number | null;

  activeParticipants?: number | null;
  active_participants?: number | null;

  eliminationRule?: QuizEliminationRule | null;
  elimination_rule?: QuizEliminationRule | null;

  exitReward?: number | null;
  exit_reward?: number | null;

  firstPositionReward?: number | null;
  first_position_reward?: number | null;

  secondPositionReward?: number | null;
  second_position_reward?: number | null;

  timePerQuestion?: number | null;
  time_per_question?: number | null;

  status?: QuizStatus | string | null;
}

export interface QuizRoom {
  roomId?: string | null;
  room_id?: string | null;

  quizId?: string | null;
  quiz_id?: string | null;

  activated?: boolean;
  isActivated?: boolean;

  participantCount?: number;
  participant_count?: number;

  maxParticipants?: number;
  max_participants?: number;

  isFull?: boolean;

  status?: QuizRoomState | string | null;
}

export interface Quiz {
  id: string;
  _id?: string;

  title: string;
  quiz_title?: string;

  subject?: string | null;
  subjectId?: string | null;
  subject_id?: string | null;

  description?: string | null;

  status: QuizStatus;

  competitionType?: QuizCompetitionType | null;
  competition_type?: QuizCompetitionType | null;

  entryMode?: QuizEntryMode | null;
  entry_mode?: QuizEntryMode | null;

  noOfContestants?: number;
  no_of_contestants?: number;

  numberOfRounds?: number;
  number_of_rounds?: number;

  timePerQuestion?: number;
  time_per_question?: number;

  currentRound?: number;
  current_round?: number;

  currentQuestion?: number | null;
  current_question?: number | null;

  startDate?: string | null;
  start_date?: string | null;

  endDate?: string | null;
  end_date?: string | null;

  entryFee?: number;
  entry_fee?: number;

  joinedCount?: number;
  joined_count?: number;

  roomId?: string | null;
  room_id?: string | null;

  room?: QuizRoom | null;

  roundInformation?: QuizRoundInformation[];
  round_information?: QuizRoundInformation[];

  rewards?: QuizReward[];

  createdAt?: string | null;
  created_at?: string | null;

  updatedAt?: string | null;
  updated_at?: string | null;
}

export interface QuizListItem extends Quiz {
  isJoined?: boolean;
  isCompleted?: boolean;
  canJoin?: boolean;
  canEnter?: boolean;
}

export interface CreateQuizPayload {
  title: string;
  subject?: string | null;
  subjectId?: string | null;
  description?: string | null;

  noOfContestants?: number;
  no_of_contestants?: number;

  numberOfRounds?: number;
  number_of_rounds?: number;

  timePerQuestion?: number;
  time_per_question?: number;

  startDate?: string | null;
  start_date?: string | null;

  entryFee?: number;
  entry_fee?: number;

  roundInformation?: QuizRoundInformation[];
  round_information?: QuizRoundInformation[];
}

export interface UpdateQuizPayload {
  title?: string;
  subject?: string | null;
  subjectId?: string | null;
  description?: string | null;

  status?: QuizStatus;

  noOfContestants?: number;
  no_of_contestants?: number;

  numberOfRounds?: number;
  number_of_rounds?: number;

  timePerQuestion?: number;
  time_per_question?: number;

  startDate?: string | null;
  start_date?: string | null;

  endDate?: string | null;
  end_date?: string | null;

  entryFee?: number;
  entry_fee?: number;

  roundInformation?: QuizRoundInformation[];
  round_information?: QuizRoundInformation[];
}

export interface QuizApiResponse {
  success?: boolean;
  message?: string;
  data?: Quiz | null;
}

export interface QuizListApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    quizzesObj?: Quiz[];
    quizzes?: Quiz[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

/* -------------------------------------------------------------------------- */
/* Normalization helpers                                                      */
/* -------------------------------------------------------------------------- */

export function getQuizId(
  quiz: Pick<Quiz, "id" | "_id">,
): string {
  return quiz.id || quiz._id || "";
}

export function getQuizTitle(
  quiz: Pick<Quiz, "title" | "quiz_title">,
): string {
  return quiz.title || quiz.quiz_title || "Quiz Competition";
}

export function getQuizSubject(
  quiz: Pick<Quiz, "subject" | "subjectId" | "subject_id">,
): string | null {
  return quiz.subject || quiz.subjectId || quiz.subject_id || null;
}

export function getQuizRoomId(
  quiz: Pick<Quiz, "roomId" | "room_id" | "room">,
): string | null {
  return (
    quiz.roomId ||
    quiz.room_id ||
    quiz.room?.roomId ||
    quiz.room?.room_id ||
    null
  );
}

export function getQuizCurrentRound(
  quiz: Pick<Quiz, "currentRound" | "current_round">,
): number {
  return quiz.currentRound ?? quiz.current_round ?? 0;
}

export function getQuizNumberOfRounds(
  quiz: Pick<Quiz, "numberOfRounds" | "number_of_rounds">,
): number {
  return quiz.numberOfRounds ?? quiz.number_of_rounds ?? 1;
}

export function getQuizTimePerQuestion(
  quiz: Pick<Quiz, "timePerQuestion" | "time_per_question">,
): number {
  return quiz.timePerQuestion ?? quiz.time_per_question ?? 30;
}

export function getQuizParticipantLimit(
  quiz: Pick<Quiz, "noOfContestants" | "no_of_contestants">,
): number {
  return quiz.noOfContestants ?? quiz.no_of_contestants ?? 20;
}

export function getQuizJoinedCount(
  quiz: Pick<Quiz, "joinedCount" | "joined_count">,
): number {
  return quiz.joinedCount ?? quiz.joined_count ?? 0;
}

export function getQuizEntryFee(
  quiz: Pick<Quiz, "entryFee" | "entry_fee">,
): number {
  return quiz.entryFee ?? quiz.entry_fee ?? 0;
}

export function getQuizRoundInformation(
  quiz: Pick<Quiz, "roundInformation" | "round_information">,
): QuizRoundInformation[] {
  return quiz.roundInformation ?? quiz.round_information ?? [];
}

/* -------------------------------------------------------------------------- */
/* Status helpers                                                             */
/* -------------------------------------------------------------------------- */

export function normalizeQuizStatus(
  status?: string | null,
): NormalizedQuizStatus {
  switch ((status ?? "").toUpperCase()) {
    case "DRAFT":
      return "DRAFT";

    case "UPCOMING":
      return "UPCOMING";

    case "WAITING":
      return "UPCOMING";

    case "OPEN":
      return "OPEN";

    case "FULL":
      return "FULL";

    case "LIVE":
      return "LIVE";

    case "IN_PROGRESS":
      return "IN_PROGRESS";

    case "COMPLETED":
      return "COMPLETED";

    case "CANCELLED":
    case "CANCELED":
      return "CANCELLED";

    default:
      return "DRAFT";
  }
}

export function isQuizWaiting(
  status?: string | null,
): boolean {
  return (
    status === "WAITING" ||
    status === "UPCOMING"
  );
}

export function isQuizLive(
  status?: string | null,
): boolean {
  return (
    status === "LIVE" ||
    status === "IN_PROGRESS"
  );
}

export function isQuizCompleted(
  status?: string | null,
): boolean {
  return status === "COMPLETED";
}

export function isQuizCancelled(
  status?: string | null,
): boolean {
  return (
    status === "CANCELLED" ||
    status === "CANCELED"
  );
}

/* -------------------------------------------------------------------------- */
/* Round helpers                                                              */
/* -------------------------------------------------------------------------- */

export function getRoundNumber(
  round: QuizRoundInformation,
): number {
  return round.roundNumber ?? round.round_number ?? 0;
}

export function getRoundQuestionCount(
  round: QuizRoundInformation,
): number {
  return (
    round.numberOfQuestions ??
    round.number_of_questions ??
    0
  );
}

export function getRoundTimeLimit(
  round: QuizRoundInformation,
  fallback = 30,
): number {
  return (
    round.timePerQuestion ??
    round.time_per_question ??
    fallback
  );
}

export function getRoundTargetParticipants(
  round: QuizRoundInformation,
): number | null {
  return (
    round.targetParticipants ??
    round.target_participants ??
    null
  );
}

export function getRoundStartingParticipants(
  round: QuizRoundInformation,
): number | null {
  return (
    round.startingParticipants ??
    round.starting_participants ??
    null
  );
}

export function isFinalQuizRound(
  round: QuizRoundInformation,
): boolean {
  return (
    round.roundType === "FINAL" ||
    round.round_type === "FINAL"
  );
}

/* -------------------------------------------------------------------------- */
/* Room helpers                                                               */
/* -------------------------------------------------------------------------- */

export function isQuizRoomActivated(
  room?: QuizRoom | null,
): boolean {
  if (!room) return false;

  return (
    room.activated === true ||
    room.isActivated === true
  );
}

export function getQuizRoomParticipantCount(
  room?: QuizRoom | null,
): number {
  if (!room) return 0;

  return (
    room.participantCount ??
    room.participant_count ??
    0
  );
}

export function getQuizRoomMaxParticipants(
  room?: QuizRoom | null,
): number {
  if (!room) return 20;

  return (
    room.maxParticipants ??
    room.max_participants ??
    20
  );
}

export function isQuizRoomFull(
  room?: QuizRoom | null,
): boolean {
  if (!room) return false;

  if (typeof room.isFull === "boolean") {
    return room.isFull;
  }

  return (
    getQuizRoomParticipantCount(room) >=
    getQuizRoomMaxParticipants(room)
  );
}