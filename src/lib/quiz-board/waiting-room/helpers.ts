import type {
  QuizCompetition,
  QuizRoom,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Basic normalization                                                        */
/* -------------------------------------------------------------------------- */

function asRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return null;
  }

  return value as Record<string, unknown>;
}

function asString(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

function asNumber(
  value: unknown,
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* Quiz helpers                                                               */
/* -------------------------------------------------------------------------- */

export function getQuizId(
  quiz: QuizCompetition | null | undefined,
): string {
  if (!quiz) {
    return "";
  }

  return (
    asString(quiz._id) ??
    asString(quiz.id) ??
    ""
  );
}

export function getSubjectLabel(
  subject: unknown,
): string {
  if (typeof subject === "string") {
    return subject.trim() || "Unknown Subject";
  }

  const data = asRecord(subject);

  if (!data) {
    return "Unknown Subject";
  }

  return (
    asString(data.name) ??
    asString(data.title) ??
    asString(data.subject_name) ??
    asString(data.subjectName) ??
    "Unknown Subject"
  );
}

export function getJoinedUsers(
  quiz: QuizCompetition | null | undefined,
): string[] {
  if (
    !quiz ||
    !Array.isArray(quiz.joined_users)
  ) {
    return [];
  }

  return quiz.joined_users
    .map((user) => {
      if (typeof user === "string") {
        return user.trim();
      }

      const data = asRecord(user);

      if (!data) {
        return "";
      }

      return (
        asString(data._id) ??
        asString(data.id) ??
        asString(data.userId) ??
        asString(data.user_id) ??
        ""
      );
    })
    .filter(Boolean);
}

export function getJoinedCount(
  quiz: QuizCompetition | null | undefined,
): number {
  return getJoinedUsers(quiz).length;
}

export function getContestantCapacity(
  quiz: QuizCompetition | null | undefined,
): number {
  if (!quiz) {
    return 0;
  }

  return (
    asNumber(quiz.no_of_contestants) ??
    0
  );
}

export function isQuizFull(
  quiz: QuizCompetition | null | undefined,
): boolean {
  const capacity =
    getContestantCapacity(quiz);

  const joinedCount =
    getJoinedCount(quiz);

  return (
    capacity > 0 &&
    joinedCount >= capacity
  );
}

export function getCurrentRound(
  quiz: QuizCompetition | null | undefined,
): number {
  if (!quiz) {
    return 0;
  }

  return (
    asNumber(quiz.current_round) ??
    0
  );
}

export function getNumberOfRounds(
  quiz: QuizCompetition | null | undefined,
): number {
  if (!quiz) {
    return 0;
  }

  return (
    asNumber(quiz.number_of_rounds) ??
    0
  );
}

export function getTimePerQuestion(
  quiz: QuizCompetition | null | undefined,
): number {
  if (!quiz) {
    return 0;
  }

  return (
    asNumber(quiz.time_per_question) ??
    0
  );
}

/* -------------------------------------------------------------------------- */
/* Room helpers                                                               */
/* -------------------------------------------------------------------------- */

export function getQuizRoomId(
  quiz: QuizCompetition | null | undefined,
): string {
  if (!quiz) {
    return "";
  }

  return (
    asString(quiz.room_id) ??
    ""
  );
}

export function getRoomId(
  room: QuizRoom | null | undefined,
): string {
  if (!room) {
    return "";
  }

  return (
    asString(room.roomId) ??
    asString(room.id) ??
    ""
  );
}

export function getRoomQuizId(
  room: QuizRoom | null | undefined,
): string {
  if (!room) {
    return "";
  }

  return (
    asString(room.quizId) ??
    asString(room.quiz_id) ??
    ""
  );
}

export function getRoomCurrentRound(
  room: QuizRoom | null | undefined,
): number {
  if (!room) {
    return 0;
  }

  return (
    asNumber(room.currentRound) ??
    asNumber(room.current_round) ??
    0
  );
}

export function getRoomContestantCount(
  room: QuizRoom | null | undefined,
): number | null {
  if (!room) {
    return null;
  }

  const count =
    asNumber(room.contestantCount) ??
    asNumber(room.contestant_count);

  return count;
}

export function getRoomMaxContestants(
  room: QuizRoom | null | undefined,
): number | null {
  if (!room) {
    return null;
  }

  const count =
    asNumber(room.maxContestants) ??
    asNumber(room.max_contestants);

  return count;
}

export function getContestantId(
  quiz: QuizCompetition | null | undefined,
): string | null {
  if (!quiz) {
    return null;
  }

  return asString(
    quiz.contestantId,
  );
}

export function getRoomContestantId(
  room: QuizRoom | null | undefined,
): string | null {
  if (!room) {
    return null;
  }

  return asString(
    room.contestantId,
  );
}

/* -------------------------------------------------------------------------- */
/* Date helpers                                                               */
/* -------------------------------------------------------------------------- */

export function hasScheduledTimePassed(
  quiz: QuizCompetition | null | undefined,
): boolean {
  if (!quiz?.start_date) {
    return false;
  }

  const timestamp =
    new Date(
      quiz.start_date,
    ).getTime();

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  return (
    timestamp <= Date.now()
  );
}

export function formatDateTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (
    !Number.isFinite(
      date.getTime(),
    )
  ) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

/* -------------------------------------------------------------------------- */
/* Lobby / contestant helpers                                                 */
/* -------------------------------------------------------------------------- */

export function getRemainingPlayers(
  quiz: QuizCompetition | null | undefined,
  room?: QuizRoom | null,
): number {
  const roomCount =
    getRoomContestantCount(room);

  const quizCount =
    getJoinedCount(quiz);

  const currentCount =
    roomCount ?? quizCount;

  const roomCapacity =
    getRoomMaxContestants(room);

  const quizCapacity =
    getContestantCapacity(quiz);

  const capacity =
    roomCapacity ?? quizCapacity;

  if (capacity <= 0) {
    return 0;
  }

  return Math.max(
    0,
    capacity - currentCount,
  );
}

export function getParticipantLabel(
  participant: unknown,
  index: number,
): string {
  if (
    typeof participant === "string" &&
    participant.trim()
  ) {
    return participant.trim();
  }

  const data = asRecord(participant);

  if (data) {
    return (
      asString(data.name) ??
      asString(data.username) ??
      asString(data.fullName) ??
      asString(data.full_name) ??
      asString(data.userId) ??
      asString(data.user_id) ??
      asString(data.contestantId) ??
      asString(data.contestant_id) ??
      `Contestant ${index + 1}`
    );
  }

  return `Contestant ${index + 1}`;
}

export function getQualificationSequence(
  quiz: QuizCompetition | null | undefined,
): Array<{
  round: number;
  players: number;
  exitNumber: number;
  reward: number;
}> {
  if (
    !quiz ||
    !Array.isArray(
      quiz.round_information,
    )
  ) {
    return [];
  }

  return quiz.round_information
    .map((round, index) => {
      const data = asRecord(round);

      if (!data) {
        return null;
      }

      const roundNumber =
        asNumber(
          data.round_number,
        ) ??
        index + 1;

      const exitNumber =
        asNumber(
          data.exit_number,
        ) ??
        0;

      const reward =
        asNumber(
          data.exit_reward,
        ) ??
        0;

      return {
        round: roundNumber,
        players: exitNumber,
        exitNumber,
        reward,
      };
    })
    .filter(
      (
        item,
      ): item is {
        round: number;
        players: number;
        exitNumber: number;
        reward: number;
      } => item !== null,
    );
}

/* -------------------------------------------------------------------------- */
/* API response extraction                                                    */
/* -------------------------------------------------------------------------- */

export function extractQuiz(
  payload: unknown,
): QuizCompetition | null {
  if (!payload) {
    return null;
  }

  /*
   * Direct quiz object.
   */
  const direct =
    asRecord(payload);

  if (!direct) {
    return null;
  }

  /*
   * Common API shapes:
   *
   * {
   *   success: true,
   *   data: {
   *     quizObj: {...}
   *   }
   * }
   *
   * {
   *   success: true,
   *   data: {
   *     quiz: {...}
   *   }
   * }
   *
   * {
   *   success: true,
   *   data: {...quiz}
   * }
   *
   * {
   *   _id: "...",
   *   quiz_title: "..."
   * }
   */

  const data =
    asRecord(direct.data);

  if (data) {
    const nestedQuiz =
      asRecord(data.quizObj) ??
      asRecord(data.quiz) ??
      asRecord(data.quizData) ??
      asRecord(data.competition);

    if (nestedQuiz) {
      return nestedQuiz as QuizCompetition;
    }

    /*
     * Sometimes data itself is the quiz object.
     */
    if (
      data._id ||
      data.id ||
      data.quiz_title ||
      data.quizTitle
    ) {
      return data as QuizCompetition;
    }
  }

  const nestedQuiz =
    asRecord(direct.quizObj) ??
    asRecord(direct.quiz) ??
    asRecord(direct.competition);

  if (nestedQuiz) {
    return nestedQuiz as QuizCompetition;
  }

  if (
    direct._id ||
    direct.id ||
    direct.quiz_title ||
    direct.quizTitle
  ) {
    return direct as QuizCompetition;
  }

  return null;
}

export function extractRoom(
  payload: unknown,
): QuizRoom | null {
  if (!payload) {
    return null;
  }

  const direct =
    asRecord(payload);

  if (!direct) {
    return null;
  }

  /*
   * Common API shapes:
   *
   * {
   *   success: true,
   *   data: {
   *     room: {...}
   *   }
   * }
   *
   * {
   *   success: true,
   *   data: {
   *     roomObj: {...}
   *   }
   * }
   *
   * {
   *   success: true,
   *   data: {...room}
   * }
   */

  const data =
    asRecord(direct.data);

  if (data) {
    const nestedRoom =
      asRecord(data.room) ??
      asRecord(data.roomObj) ??
      asRecord(data.roomData);

    if (nestedRoom) {
      return nestedRoom as QuizRoom;
    }

    /*
     * If data itself contains room state.
     */
    if (
      data.roomId ||
      data.room_id ||
      data.id ||
      data.status ||
      data.activated !== undefined
    ) {
      return data as QuizRoom;
    }
  }

  const nestedRoom =
    asRecord(direct.room) ??
    asRecord(direct.roomObj) ??
    asRecord(direct.roomData);

  if (nestedRoom) {
    return nestedRoom as QuizRoom;
  }

  if (
    direct.roomId ||
    direct.room_id ||
    direct.id ||
    direct.status ||
    direct.activated !== undefined
  ) {
    return direct as QuizRoom;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* API errors                                                                 */
/* -------------------------------------------------------------------------- */

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
): string {
  if (error instanceof Error) {
    if (error.message.trim()) {
      return error.message;
    }
  }

  const data =
    asRecord(error);

  if (data) {
    const message =
      asString(data.message) ??
      asString(data.error) ??
      asString(data.detail);

    if (message) {
      return message;
    }

    const response =
      asRecord(data.response);

    if (response) {
      const responseData =
        asRecord(response.data);

      if (responseData) {
        const responseMessage =
          asString(
            responseData.message,
          ) ??
          asString(
            responseData.error,
          );

        if (responseMessage) {
          return responseMessage;
        }
      }
    }
  }

  return fallback;
}




// import type { QuizPlaySession } from "./types";

// export const PLAY_SESSION_PREFIX = "quiz-play-";

// /**
//  * Build the sessionStorage key used for a quiz.
//  */
// export function getPlaySessionKey(quizId: string): string {
//   return `${PLAY_SESSION_PREFIX}${quizId}`;
// }

// /**
//  * Save the authorized quiz session before navigating
//  * from the waiting room to the play page.
//  */
// export function savePlaySession(
//   session: QuizPlaySession,
// ): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   try {
//     const key = getPlaySessionKey(session.quizId);

//     sessionStorage.setItem(
//       key,
//       JSON.stringify(session),
//     );
//   } catch (error) {
//     console.error(
//       "Failed to save quiz play session:",
//       error,
//     );
//   }
// }

// /**
//  * Read the previously saved quiz play session.
//  */
// export function getPlaySession(
//   quizId: string,
// ): QuizPlaySession | null {
//   if (
//     typeof window === "undefined" ||
//     !quizId
//   ) {
//     return null;
//   }

//   try {
//     const key = getPlaySessionKey(quizId);
//     const stored = sessionStorage.getItem(key);

//     if (!stored) {
//       return null;
//     }

//     const parsed: unknown = JSON.parse(stored);

//     if (!isQuizPlaySession(parsed)) {
//       sessionStorage.removeItem(key);
//       return null;
//     }

//     return parsed;
//   } catch (error) {
//     console.error(
//       "Failed to read quiz play session:",
//       error,
//     );

//     return null;
//   }
// }

// /**
//  * Remove the stored play session for a quiz.
//  *
//  * Call this when the quiz is completely finished or when
//  * the session should no longer be reused.
//  */
// export function clearPlaySession(
//   quizId: string,
// ): void {
//   if (
//     typeof window === "undefined" ||
//     !quizId
//   ) {
//     return;
//   }

//   try {
//     sessionStorage.removeItem(
//       getPlaySessionKey(quizId),
//     );
//   } catch (error) {
//     console.error(
//       "Failed to clear quiz play session:",
//       error,
//     );
//   }
// }

// /**
//  * Check whether a stored value has the expected
//  * QuizPlaySession structure.
//  *
//  * This protects the play page from malformed or stale
//  * sessionStorage data.
//  */
// export function isQuizPlaySession(
//   value: unknown,
// ): value is QuizPlaySession {
//   if (
//     typeof value !== "object" ||
//     value === null
//   ) {
//     return false;
//   }

//   const session =
//     value as Partial<QuizPlaySession>;

//   return (
//     typeof session.quizId === "string" &&
//     session.quizId.trim().length > 0 &&

//     typeof session.quiz_title === "string" &&

//     typeof session.subject === "string" &&

//     typeof session.description === "string" &&

//     typeof session.current_round === "number" &&
//     Number.isFinite(session.current_round) &&

//     typeof session.number_of_rounds === "number" &&
//     Number.isFinite(session.number_of_rounds) &&

//     typeof session.time_per_question === "number" &&
//     Number.isFinite(session.time_per_question) &&

//     typeof session.no_of_contestants === "number" &&
//     Number.isFinite(session.no_of_contestants) &&

//     typeof session.joined_count === "number" &&
//     Number.isFinite(session.joined_count) &&

//     (
//       session.room_id === null ||
//       typeof session.room_id === "string"
//     ) &&

//     typeof session.start_date === "string"
//   );
// }

// /**
//  * Update only selected fields in an existing play session.
//  *
//  * Useful when the server advances the round before the
//  * contestant enters the play page.
//  */
// export function updatePlaySession(
//   quizId: string,
//   updates: Partial<QuizPlaySession>,
// ): QuizPlaySession | null {
//   const existing = getPlaySession(quizId);

//   if (!existing) {
//     return null;
//   }

//   const updated: QuizPlaySession = {
//     ...existing,
//     ...updates,
//     quizId: existing.quizId,
//   };

//   savePlaySession(updated);

//   return updated;
// }

// /**
//  * Create a QuizPlaySession from the current waiting-room
//  * information.
//  */
// export function createPlaySession({
//   quizId,
//   quizTitle,
//   subject,
//   description,
//   currentRound,
//   numberOfRounds,
//   timePerQuestion,
//   contestantCapacity,
//   joinedCount,
//   roomId,
//   startDate,
// }: {
//   quizId: string;
//   quizTitle: string;
//   subject: string;
//   description: string;
//   currentRound: number;
//   numberOfRounds: number;
//   timePerQuestion: number;
//   contestantCapacity: number;
//   joinedCount: number;
//   roomId: string | null;
//   startDate: string;
// }): QuizPlaySession {
//   return {
//     quizId,
//     quiz_title: quizTitle,
//     subject,
//     description,
//     current_round: currentRound,
//     number_of_rounds: numberOfRounds,
//     time_per_question: timePerQuestion,
//     no_of_contestants: contestantCapacity,
//     joined_count: joinedCount,
//     room_id: roomId,
//     start_date: startDate,
//   };
// }