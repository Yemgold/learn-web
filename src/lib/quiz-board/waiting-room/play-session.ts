





import type { QuizPlaySession } from "./types";

export const PLAY_SESSION_PREFIX = "quiz-play-";

/**
 * Build the sessionStorage key used for a quiz.
 */
export function getPlaySessionKey(quizId: string): string {
  return `${PLAY_SESSION_PREFIX}${quizId}`;
}

/**
 * Save the authorized quiz session before navigating
 * from the waiting room to the play page.
 */
export function savePlaySession(
  session: QuizPlaySession,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const key = getPlaySessionKey(session.quizId);

    sessionStorage.setItem(
      key,
      JSON.stringify(session),
    );
  } catch (error) {
    console.error(
      "Failed to save quiz play session:",
      error,
    );
  }
}

/**
 * Read the previously saved quiz play session.
 */
export function getPlaySession(
  quizId: string,
): QuizPlaySession | null {
  if (
    typeof window === "undefined" ||
    !quizId
  ) {
    return null;
  }

  try {
    const key = getPlaySessionKey(quizId);
    const stored = sessionStorage.getItem(key);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!isQuizPlaySession(parsed)) {
      sessionStorage.removeItem(key);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to read quiz play session:",
      error,
    );

    return null;
  }
}

/**
 * Remove the stored play session for a quiz.
 *
 * Call this when the quiz is completely finished or when
 * the session should no longer be reused.
 */
export function clearPlaySession(
  quizId: string,
): void {
  if (
    typeof window === "undefined" ||
    !quizId
  ) {
    return;
  }

  try {
    sessionStorage.removeItem(
      getPlaySessionKey(quizId),
    );
  } catch (error) {
    console.error(
      "Failed to clear quiz play session:",
      error,
    );
  }
}

/**
 * Check whether a stored value has the expected
 * QuizPlaySession structure.
 *
 * This protects the play page from malformed or stale
 * sessionStorage data.
 */
export function isQuizPlaySession(
  value: unknown,
): value is QuizPlaySession {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const session =
    value as Partial<QuizPlaySession>;

  return (
    typeof session.quizId === "string" &&
    session.quizId.trim().length > 0 &&

    typeof session.quiz_title === "string" &&

    typeof session.subject === "string" &&

    typeof session.description === "string" &&

    typeof session.current_round === "number" &&
    Number.isFinite(session.current_round) &&

    typeof session.number_of_rounds === "number" &&
    Number.isFinite(session.number_of_rounds) &&

    typeof session.time_per_question === "number" &&
    Number.isFinite(session.time_per_question) &&

    typeof session.no_of_contestants === "number" &&
    Number.isFinite(session.no_of_contestants) &&

    typeof session.joined_count === "number" &&
    Number.isFinite(session.joined_count) &&

    (
      session.room_id === null ||
      typeof session.room_id === "string"
    ) &&

    typeof session.start_date === "string"
  );
}

/**
 * Update only selected fields in an existing play session.
 *
 * Useful when the server advances the round before the
 * contestant enters the play page.
 */
export function updatePlaySession(
  quizId: string,
  updates: Partial<QuizPlaySession>,
): QuizPlaySession | null {
  const existing = getPlaySession(quizId);

  if (!existing) {
    return null;
  }

  const updated: QuizPlaySession = {
    ...existing,
    ...updates,
    quizId: existing.quizId,
  };

  savePlaySession(updated);

  return updated;
}

/**
 * Create a QuizPlaySession from the current waiting-room
 * information.
 */
export function createPlaySession({
  quizId,
  quizTitle,
  subject,
  description,
  currentRound,
  numberOfRounds,
  timePerQuestion,
  contestantCapacity,
  joinedCount,
  roomId,
  startDate,
}: {
  quizId: string;
  quizTitle: string;
  subject: string;
  description: string;
  currentRound: number;
  numberOfRounds: number;
  timePerQuestion: number;
  contestantCapacity: number;
  joinedCount: number;
  roomId: string | null;
  startDate: string;
}): QuizPlaySession {
  return {
    quizId,
    quiz_title: quizTitle,
    subject,
    description,
    current_round: currentRound,
    number_of_rounds: numberOfRounds,
    time_per_question: timePerQuestion,
    no_of_contestants: contestantCapacity,
    joined_count: joinedCount,
    room_id: roomId,
    start_date: startDate,
  };
}