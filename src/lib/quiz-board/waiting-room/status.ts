






import type { LobbyStatus } from "./types";

/**
 * Human-readable labels for the waiting-room states.
 */
export const LOBBY_STATUS_LABELS: Record<LobbyStatus, string> = {
  loading: "Loading competition...",
  waiting_for_players: "Waiting for contestants",
  waiting_for_room: "Waiting for quiz room",
  waiting_for_code: "Waiting for room access",
  joining_room: "Joining quiz room",
  waiting_for_round: "Waiting for host",
  live: "Quiz is live",
  completed: "Competition completed",
  error: "Something went wrong",
};

/**
 * Short descriptions displayed beneath the status heading.
 */
export const LOBBY_STATUS_DESCRIPTIONS: Record<LobbyStatus, string> = {
  loading:
    "Loading the competition and checking the current quiz room status.",

  waiting_for_players:
    "The competition is waiting for enough contestants to join.",

  waiting_for_room:
    "The competition is ready for the quiz room to be created and activated by the host.",

  waiting_for_code:
    "Your contestant identity is being verified before you enter the live room.",

  joining_room:
    "Your access has been accepted. Connecting you to the live quiz room.",

  waiting_for_round:
    "You are connected to the quiz room. The host has not started the next round yet.",

  live:
    "The host has started the round. You can enter the quiz.",

  completed:
    "This competition has finished.",

  error:
    "We could not determine the current competition status.",
};

/**
 * Returns the display label for a lobby status.
 */
export function getLobbyStatusLabel(status: LobbyStatus): string {
  return LOBBY_STATUS_LABELS[status];
}

/**
 * Returns the display description for a lobby status.
 */
export function getLobbyStatusDescription(status: LobbyStatus): string {
  return LOBBY_STATUS_DESCRIPTIONS[status];
}

/**
 * Normalize backend room/quiz status values.
 *
 * The backend may return different casing or terminology.
 */
export function normalizeStatus(
  value: unknown,
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}

/**
 * Determines whether a room has been activated by the host.
 *
 * IMPORTANT:
 * A room existing is not the same thing as an activated room.
 */
export function isRoomActivated(room: {
  activated?: boolean;
  status?: unknown;
} | null | undefined): boolean {
  if (!room) {
    return false;
  }

  if (room.activated === true) {
    return true;
  }

  const status = normalizeStatus(room.status);

  return (
    status === "ACTIVE" ||
    status === "IN_PROGRESS" ||
    status === "ROUND_COMPLETED"
  );
}

/**
 * Determines whether the room is currently running a round.
 */
export function isRoomInProgress(room: {
  status?: unknown;
  currentRound?: number;
  current_round?: number;
} | null | undefined): boolean {
  if (!room) {
    return false;
  }

  const status = normalizeStatus(room.status);

  if (status === "IN_PROGRESS") {
    return true;
  }

  const currentRound =
    typeof room.currentRound === "number"
      ? room.currentRound
      : typeof room.current_round === "number"
        ? room.current_round
        : 0;

  return currentRound > 0 && status === "ROUND_COMPLETED";
}

/**
 * Determines whether the room or competition has completed.
 */
export function isRoomCompleted(
  room: {
    status?: unknown;
  } | null | undefined,
  quiz?: {
    status?: unknown;
  } | null,
): boolean {
  const roomStatus = normalizeStatus(room?.status);
  const quizStatus = normalizeStatus(quiz?.status);

  return (
    roomStatus === "COMPLETED" ||
    roomStatus === "FINISHED" ||
    roomStatus === "CLOSED" ||
    quizStatus === "COMPLETED" ||
    quizStatus === "FINISHED" ||
    quizStatus === "CANCELLED"
  );
}

/**
 * Determines whether the quiz itself is currently live.
 */
export function isQuizInProgress(
  quiz: {
    status?: unknown;
  } | null | undefined,
): boolean {
  const status = normalizeStatus(quiz?.status);

  return (
    status === "IN_PROGRESS" ||
    status === "LIVE"
  );
}

/**
 * Determines whether a competition has reached its contestant capacity.
 */
export function isCompetitionFull(
  joinedCount: number,
  capacity: number,
): boolean {
  return capacity > 0 && joinedCount >= capacity;
}

/**
 * Determines whether a competition still needs contestants.
 */
export function isWaitingForPlayers(
  joinedCount: number,
  capacity: number,
): boolean {
  return capacity > 0 && joinedCount < capacity;
}

/**
 * Determines whether a quiz room should be considered ready
 * for contestants.
 */
export function isRoomReady(
  room: {
    activated?: boolean;
    status?: unknown;
  } | null | undefined,
): boolean {
  return isRoomActivated(room);
}

/**
 * Determines the appropriate lobby state from the current
 * competition, room, authorization and socket state.
 *
 * This is intentionally a pure function so it can be tested
 * without React.
 */
export function getLobbyStatus({
  loading,
  error,
  quiz,
  room,
  roomAccessGranted,
  socketRoomJoined,
}: {
  loading: boolean;
  error?: string;
  quiz?: {
    status?: unknown;
    current_round?: number;
    no_of_contestants?: number;
    joined_users?: unknown[];
  } | null;
  room?: {
    status?: unknown;
    activated?: boolean;
    currentRound?: number;
    current_round?: number;
  } | null;
  roomAccessGranted: boolean;
  socketRoomJoined: boolean;
}): LobbyStatus {
  if (loading) {
    return "loading";
  }

  if (error) {
    return "error";
  }

  if (!quiz) {
    return "error";
  }

  if (isRoomCompleted(room, quiz)) {
    return "completed";
  }

  const currentRound =
    typeof room?.currentRound === "number"
      ? room.currentRound
      : typeof room?.current_round === "number"
        ? room.current_round
        : typeof quiz.current_round === "number"
          ? quiz.current_round
          : 0;

  const roomInProgress =
    isRoomInProgress(room) ||
    (currentRound > 0 && isQuizInProgress(quiz));

  if (
    roomAccessGranted &&
    socketRoomJoined &&
    roomInProgress
  ) {
    return "live";
  }

  const roomActivated = isRoomActivated(room);

  if (roomActivated) {
    if (!roomAccessGranted) {
      return "waiting_for_code";
    }

    if (!socketRoomJoined) {
      return "joining_room";
    }

    return "waiting_for_round";
  }

  const joinedCount = Array.isArray(quiz.joined_users)
    ? quiz.joined_users.length
    : 0;

  const capacity =
    typeof quiz.no_of_contestants === "number"
      ? quiz.no_of_contestants
      : Number(quiz.no_of_contestants ?? 0);

  if (capacity > 0 && joinedCount < capacity) {
    return "waiting_for_players";
  }

  return "waiting_for_room";
}

/**
 * Whether the status represents a state where the contestant
 * is already inside the room.
 */
export function hasJoinedWaitingRoom(
  status: LobbyStatus,
): boolean {
  return (
    status === "waiting_for_round" ||
    status === "live"
  );
}

/**
 * Whether the status represents a terminal state.
 */
export function isTerminalLobbyStatus(
  status: LobbyStatus,
): boolean {
  return (
    status === "completed" ||
    status === "error"
  );
}

/**
 * Whether the waiting room should display the contestant
 * access/verification section.
 */
export function shouldShowContestantAccess(
  status: LobbyStatus,
): boolean {
  return (
    status === "waiting_for_code" ||
    status === "joining_room"
  );
}

/**
 * Whether the waiting room should display the host waiting
 * section.
 */
export function shouldShowWaitingForHost(
  status: LobbyStatus,
): boolean {
  return status === "waiting_for_round";
}

/**
 * Whether the waiting room should display the live quiz
 * section.
 */
export function shouldShowLiveQuiz(
  status: LobbyStatus,
): boolean {
  return status === "live";
}