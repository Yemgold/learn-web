import type { QuizParticipation } from "@/lib/quiz-board/types";

/**
 * Waiting Room UI state.
 */
export type LobbyStatus =
  | "loading"
  | "waiting_for_players"
  | "waiting_for_room"
  | "waiting_for_code"
  | "joining_room"
  | "waiting_for_round"
  | "live"
  | "completed"
  | "error";

/**
 * Room status returned by the quiz-room API.
 *
 * Keep this separate from LobbyStatus because these are
 * backend room states, not frontend UI states.
 */
export type WaitingRoomStatus =
  | "WAITING"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "ROUND_COMPLETED"
  | "COMPLETED"
  | "FINISHED"
  | "CLOSED"
  | "CANCELLED"
  | string;

/**
 * Raw quiz competition returned by the API.
 */
export interface QuizCompetition {
  _id?: string;
  id?: string;

  quiz_title?: string;
  description?: string;

  subject?: unknown;

  time_per_question?: number;
  start_date?: string;

  no_of_contestants?: number;
  number_of_rounds?: number;

  joined_users?: unknown[];

  current_round?: number;

  room_id?: string | null;

  status?: string;

  round_information?: unknown[];

  final_round_information?: {
    no_of_questions?: number;
    difficultyBreakdown?: {
      easy?: number;
      medium?: number;
      hard?: number;
    };
    first_position_reward?: number;
    second_position_reward?: number;
  };

  spectator_array?: unknown[];

  [key: string]: unknown;
}

/**
 * Current state of a quiz room.
 */
export interface QuizRoom {
  id?: string;
  roomId?: string;

  quizId?: string;
  quiz_id?: string;

  status?: WaitingRoomStatus;

  activated?: boolean;

  currentRound?: number;
  current_round?: number;

  contestantCount?: number;
  contestant_count?: number;

  maxContestants?: number;
  max_contestants?: number;

  /**
   * Contestant identifier belonging to the
   * authenticated student's participation.
   *
   * Example:
   * AT-SUWI20S9
   */
  contestantId?: string | null;

  contestantCode?: string | null;

  spectatorCode?: string | null;

  [key: string]: unknown;
}

/**
 * Socket.IO round_started event.
 */
export interface SocketRoundStartedPayload {
  quizId?: string;
  quiz_id?: string;

  roomId?: string;
  room_id?: string;

  currentRound?: number;
  current_round?: number;

  round?: number;
  round_number?: number;
}

/**
 * Socket.IO joined_room_ack event.
 */
export interface SocketJoinedRoomAckPayload {
  success?: boolean;
  message?: string;

  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  role?: string;
}

/**
 * Socket.IO participant_joined_room event.
 */
export interface SocketParticipantJoinedPayload {
  userId?: string;
  user_id?: string;

  participantId?: string;
  participant_id?: string;

  contestantId?: string;
  contestant_id?: string;

  roomId?: string;
  room_id?: string;

  joinedCount?: number;
  joined_count?: number;

  participantCount?: number;
  participant_count?: number;
}

/**
 * Response from the endpoint that authorizes a contestant
 * into a quiz room.
 */
export interface JoinRoomResponse {
  success?: boolean;
  message?: string;

  data?: {
    roomId?: string;
    room_id?: string;

    quizId?: string;
    quiz_id?: string;

    role?: string;

    contestantId?: string | null;

    currentRound?: number;
    current_round?: number;
  };
}

/**
 * Data stored in sessionStorage before entering /play.
 */
export interface QuizPlaySession {
  quizId: string;
  quiz_title: string;
  subject: string;
  description: string;

  current_round: number;
  number_of_rounds: number;

  time_per_question: number;

  no_of_contestants: number;
  joined_count: number;

  room_id: string | null;

  start_date: string;
}