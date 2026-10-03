// C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\quizSocketUtils.ts

import type {
  HostParticipant,
} from "@/components/quiz-board/host/HostParticipantPanel";

import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";

import type {
  LiveQuestion,
  QuizFeedEvent,
  SocketPayload,
} from "./quizSocketTypes";

export function getNumber(
  value: unknown,
  fallback: number | null = null,
): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function getString(
  value: unknown,
  fallback: string | null = null,
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return fallback;
}

export function unwrapPayload(
  payload: SocketPayload | unknown,
): SocketPayload {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload)
  ) {
    const record = payload as SocketPayload;

    const nestedCandidates = [
      record.data,
      record.payload,
      record.room,
      record.result,
    ];

    for (const candidate of nestedCandidates) {
      if (
        candidate &&
        typeof candidate === "object" &&
        !Array.isArray(candidate)
      ) {
        return candidate as SocketPayload;
      }
    }

    return record;
  }

  return {};
}

function getArray(
  value: unknown,
): unknown[] {
  return Array.isArray(value) ? value : [];
}

function getObject(
  value: unknown,
): SocketPayload {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as SocketPayload;
  }

  return {};
}

export function normalizeQuestion(
  payload: unknown,
): LiveQuestion | null {
  const root = getObject(payload);

  const data = unwrapPayload(root);

  /*
   * IMPORTANT
   * ----------
   * The backend can send:
   *
   * {
   *   question: {
   *     id,
   *     question,
   *     options
   *   },
   *   startTime: "..."
   * }
   *
   * or:
   *
   * {
   *   id,
   *   question,
   *   options,
   *   startTime: "..."
   * }
   *
   * We support both shapes.
   */
  const nestedQuestion = getObject(data.question);

  const questionObject =
    nestedQuestion.question !== undefined ||
    nestedQuestion.options !== undefined ||
    nestedQuestion.id !== undefined ||
    nestedQuestion._id !== undefined
      ? nestedQuestion
      : data;

  const id =
    getString(
      questionObject.id ??
        questionObject._id ??
        questionObject.questionId ??
        questionObject.question_id,
      null,
    );

  const questionText =
    getString(
      questionObject.question ??
        questionObject.text ??
        questionObject.content,
      "",
    );

  if (!id && !questionText) {
    return null;
  }

  const rawOptions =
    questionObject.options ??
    questionObject.answers ??
    [];

  /*
   * ---------------------------------------------------------
   * ANSWER OPTIONS
   * ---------------------------------------------------------
   *
   * Backend sends options in this form:
   *
   * {
   *   label: "A",
   *   value: "Taxonomy",
   *   _id: "6aa00de4b180c475fe319741"
   * }
   *
   * The backend requires the OPTION ID when submitting
   * the contestant's answer.
   *
   * Therefore we preserve:
   *
   *   id    -> backend option ID
   *   label -> A / B / C / D
   *   value -> displayed answer text
   */
  const options = getArray(rawOptions)
    .map((option, index) => {
      /*
       * Support the unlikely case where the backend sends
       * a plain string instead of an option object.
       *
       * There is no real backend option ID in this case,
       * so use a frontend fallback.
       */
      if (typeof option === "string") {
        return {
          id: `option-${index}`,
          label: String.fromCharCode(65 + index),
          value: option,
        };
      }

      const optionObject = getObject(option);

      /*
       * IMPORTANT:
       *
       * Prefer _id because that is what the backend is
       * currently sending for each answer option.
       *
       * Also support id / optionId / option_id for
       * compatibility with other payload shapes.
       */
      const optionId =
        getString(
          optionObject._id ??
            optionObject.id ??
            optionObject.optionId ??
            optionObject.option_id,
          null,
        ) ??
        `option-${index}`;

      const label =
        getString(
          optionObject.label ??
            optionObject.key ??
            optionObject.option,
          String.fromCharCode(65 + index),
        ) ??
        String.fromCharCode(65 + index);

      const value =
        getString(
          optionObject.value ??
            optionObject.text ??
            optionObject.answer ??
            optionObject.label,
          "",
        ) ?? "";

      return {
        id: optionId,
        label,
        value,
      };
    })
    .filter(
      (option) =>
        option.value.trim().length > 0,
    );

  /*
   * ---------------------------------------------------------
   * QUESTION NUMBER
   * ---------------------------------------------------------
   */
  const questionNumber =
    getNumber(
      questionObject.questionNumber ??
        questionObject.question_number ??
        data.questionNumber ??
        data.question_number ??
        data.currentQuestionNumber ??
        data.current_question_number,
      null,
    );

  /*
   * ---------------------------------------------------------
   * TOTAL QUESTIONS
   * ---------------------------------------------------------
   */
  const totalQuestions =
    getNumber(
      questionObject.totalQuestions ??
        questionObject.total_questions ??
        data.totalQuestions ??
        data.total_questions,
      null,
    );

  /*
   * ---------------------------------------------------------
   * TIME LIMIT
   * ---------------------------------------------------------
   */
  const timeLimit =
    getNumber(
      questionObject.timeLimit ??
        questionObject.time_limit ??
        questionObject.questionDuration ??
        questionObject.question_duration ??
        data.timeLimit ??
        data.time_limit ??
        data.questionDuration ??
        data.question_duration,
      null,
    );

  /*
   * ---------------------------------------------------------
   * START TIME
   *
   * Backend currently sends:
   *
   * startTime: "2026-10-01T16:15:07.686Z"
   *
   * We normalize that into our frontend contract:
   *
   * startedAt
   * ---------------------------------------------------------
   */
  const startedAt =
    getString(
      questionObject.startedAt ??
        questionObject.started_at ??
        questionObject.startTime ??
        questionObject.start_time ??
        data.startedAt ??
        data.started_at ??
        data.startTime ??
        data.start_time,
      null,
    );

  /*
   * ---------------------------------------------------------
   * EXPIRATION TIME
   * ---------------------------------------------------------
   *
   * If backend explicitly sends expiresAt/endTime, use it.
   *
   * If it doesn't, and we have:
   *
   *   startedAt + timeLimit
   *
   * then calculate expiresAt locally.
   *
   * This does NOT change the server-authoritative timer.
   * It only gives the UI the timestamp needed to render
   * the countdown.
   */
  let expiresAt =
    getString(
      questionObject.expiresAt ??
        questionObject.expires_at ??
        questionObject.endTime ??
        questionObject.end_time ??
        data.expiresAt ??
        data.expires_at ??
        data.endTime ??
        data.end_time,
      null,
    );

  if (
    !expiresAt &&
    startedAt &&
    timeLimit !== null &&
    timeLimit > 0
  ) {
    const startedTimestamp =
      Date.parse(startedAt);

    if (!Number.isNaN(startedTimestamp)) {
      expiresAt = new Date(
        startedTimestamp +
          timeLimit * 1000,
      ).toISOString();
    }
  }

  return {
    id:
      id ??
      `question-${Date.now()}`,

    question:
      questionText ?? "",

    options,

    questionNumber,

    totalQuestions,

    timeLimit,

    startedAt,

    expiresAt,
  };
}

export function mapParticipants(
  value: unknown,
): HostParticipant[] {
  return getArray(value).map(
    (item, index) => {
      const participant = getObject(item);

      const id =
        getString(
          participant.id ??
            participant._id ??
            participant.userId ??
            participant.user_id ??
            participant.participantId ??
            participant.participant_id,
          `participant-${index}`,
        ) ?? `participant-${index}`;

      const name =
        getString(
          participant.name ??
            participant.username ??
            participant.fullName ??
            participant.full_name ??
            participant.displayName ??
            participant.display_name,
          "Participant",
        ) ?? "Participant";

      const score =
        getNumber(
          participant.score ??
            participant.points ??
            participant.totalPoints ??
            participant.total_points,
          0,
        ) ?? 0;

      const rank =
        getNumber(
          participant.rank ??
            participant.position,
          index + 1,
        ) ?? index + 1;

      return {
        ...participant,
        id,
        name,
        score,
        rank,
      } as HostParticipant;
    },
  );
}

export function mapLeaderboard(
  value: unknown,
): HostLeaderboardEntry[] {
  return getArray(value).map(
    (item, index) => {
      const entry = getObject(item);

      const id =
        getString(
          entry.id ??
            entry._id ??
            entry.userId ??
            entry.user_id ??
            entry.participantId ??
            entry.participant_id,
          `leaderboard-${index}`,
        ) ?? `leaderboard-${index}`;

      const name =
        getString(
          entry.name ??
            entry.username ??
            entry.fullName ??
            entry.full_name ??
            entry.displayName ??
            entry.display_name,
          "Participant",
        ) ?? "Participant";

      const score =
        getNumber(
          entry.score ??
            entry.points ??
            entry.totalPoints ??
            entry.total_points,
          0,
        ) ?? 0;

      const rank =
        getNumber(
          entry.rank ??
            entry.position,
          index + 1,
        ) ?? index + 1;

      return {
        ...entry,
        id,
        name,
        score,
        rank,
      } as HostLeaderboardEntry;
    },
  );
}

export function makeFeedEvent(
  type: string,
  payload: unknown,
  message?: string,
): QuizFeedEvent {
  const data =
    getObject(
      unwrapPayload(
        getObject(payload),
      ),
    );

  const participantId =
    getString(
      data.participantId ??
        data.participant_id ??
        data.userId ??
        data.user_id,
      null,
    );

  const participantName =
    getString(
      data.participantName ??
        data.participant_name ??
        data.username ??
        data.name ??
        data.fullName ??
        data.full_name,
      null,
    );

  return {
    id: `${type}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    type,

    message:
      message ??
      buildFeedMessage(
        type,
        data,
        participantName,
      ),

    timestamp:
      new Date().toISOString(),

    participantId,

    participantName,
  };
}

function buildFeedMessage(
  type: string,
  data: SocketPayload,
  participantName: string | null,
): string {
  const name =
    participantName ?? "Participant";

  switch (type) {
    case "participant_joined_room":
      return `${name} joined the room.`;

    case "first_correct":
      return `${name} answered correctly first.`;

    case "answer_result":
      return `${name} submitted an answer.`;

    case "participant_selected_answer":
      return `${name} selected an answer.`;

    case "participants_eliminated":
      return "Participants were eliminated.";

    case "question_started":
      return "A new question has started.";

    case "question_locked":
      return "The current question has been locked.";

    case "round_started":
      return "A new round has started.";

    case "round_completed":
      return "The current round has completed.";

    case "next_question":
      return "The next question is ready.";

    case "room_activated":
      return "The quiz room has been activated.";

    case "get_room_doc":
      return "Room state was synchronized.";

    case "room_state":
      return "Room state was received.";

    default:
      return type
        .replaceAll("_", " ")
        .replace(
          /^\w/,
          (character) =>
            character.toUpperCase(),
        );
  }
}

export function appendFeedEvent(
  current: QuizFeedEvent[],
  event: QuizFeedEvent,
  maximum = 100,
): QuizFeedEvent[] {
  return [
    event,
    ...current,
  ].slice(0, maximum);
}

export function normalizeStatus(
  value: unknown,
): string | null {
  const status = getString(value, null);

  return status
    ? status.toUpperCase()
    : null;
}

export function isRecord(
  value: unknown,
): value is SocketPayload {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}












// // C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\quizSocketUtils.ts

// import type {
//   HostParticipant,
// } from "@/components/quiz-board/host/HostParticipantPanel";

// import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";

// import type {
//   LiveQuestion,
//   QuizFeedEvent,
//   SocketPayload,
// } from "./quizSocketTypes";

// export function getNumber(
//   value: unknown,
//   fallback: number | null = null,
// ): number | null {
//   if (typeof value === "number" && Number.isFinite(value)) {
//     return value;
//   }

//   if (typeof value === "string" && value.trim() !== "") {
//     const parsed = Number(value);

//     if (Number.isFinite(parsed)) {
//       return parsed;
//     }
//   }

//   return fallback;
// }

// export function getString(
//   value: unknown,
//   fallback: string | null = null,
// ): string | null {
//   if (typeof value === "string") {
//     return value;
//   }

//   if (
//     typeof value === "number" ||
//     typeof value === "boolean"
//   ) {
//     return String(value);
//   }

//   return fallback;
// }

// export function unwrapPayload(
//   payload: SocketPayload | unknown,
// ): SocketPayload {
//   if (
//     payload &&
//     typeof payload === "object" &&
//     !Array.isArray(payload)
//   ) {
//     const record = payload as SocketPayload;

//     const nestedCandidates = [
//       record.data,
//       record.payload,
//       record.room,
//       record.result,
//     ];

//     for (const candidate of nestedCandidates) {
//       if (
//         candidate &&
//         typeof candidate === "object" &&
//         !Array.isArray(candidate)
//       ) {
//         return candidate as SocketPayload;
//       }
//     }

//     return record;
//   }

//   return {};
// }

// function getArray(
//   value: unknown,
// ): unknown[] {
//   return Array.isArray(value) ? value : [];
// }

// function getObject(
//   value: unknown,
// ): SocketPayload {
//   if (
//     value &&
//     typeof value === "object" &&
//     !Array.isArray(value)
//   ) {
//     return value as SocketPayload;
//   }

//   return {};
// }

// export function normalizeQuestion(
//   payload: unknown,
// ): LiveQuestion | null {
//   const root = getObject(payload);

//   const data = unwrapPayload(root);

//   /*
//    * IMPORTANT
//    * ----------
//    * The backend can send:
//    *
//    * {
//    *   question: {
//    *     id,
//    *     question,
//    *     options
//    *   },
//    *   startTime: "..."
//    * }
//    *
//    * or:
//    *
//    * {
//    *   id,
//    *   question,
//    *   options,
//    *   startTime: "..."
//    * }
//    *
//    * We support both shapes.
//    */
//   const nestedQuestion = getObject(data.question);

//   const questionObject =
//     nestedQuestion.question !== undefined ||
//     nestedQuestion.options !== undefined ||
//     nestedQuestion.id !== undefined ||
//     nestedQuestion._id !== undefined
//       ? nestedQuestion
//       : data;

//   const id =
//     getString(
//       questionObject.id ??
//         questionObject._id ??
//         questionObject.questionId ??
//         questionObject.question_id,
//       null,
//     );

//   const questionText =
//     getString(
//       questionObject.question ??
//         questionObject.text ??
//         questionObject.content,
//       "",
//     );

//   if (!id && !questionText) {
//     return null;
//   }

//   const rawOptions =
//     questionObject.options ??
//     questionObject.answers ??
//     [];

//   const options = getArray(rawOptions)
//     .map((option, index) => {
//       if (typeof option === "string") {
//         return {
//           label: String.fromCharCode(65 + index),
//           value: option,
//         };
//       }

//       const optionObject = getObject(option);

//       const label =
//         getString(
//           optionObject.label ??
//             optionObject.key ??
//             optionObject.option,
//           String.fromCharCode(65 + index),
//         ) ?? String.fromCharCode(65 + index);

//       const value =
//         getString(
//           optionObject.value ??
//             optionObject.text ??
//             optionObject.answer ??
//             optionObject.label,
//           "",
//         ) ?? "";

//       return {
//         label,
//         value,
//       };
//     })
//     .filter(
//       (option) =>
//         option.value.trim().length > 0,
//     );

//   /*
//    * ---------------------------------------------------------
//    * QUESTION NUMBER
//    * ---------------------------------------------------------
//    */
//   const questionNumber =
//     getNumber(
//       questionObject.questionNumber ??
//         questionObject.question_number ??
//         data.questionNumber ??
//         data.question_number ??
//         data.currentQuestionNumber ??
//         data.current_question_number,
//       null,
//     );

//   /*
//    * ---------------------------------------------------------
//    * TOTAL QUESTIONS
//    * ---------------------------------------------------------
//    */
//   const totalQuestions =
//     getNumber(
//       questionObject.totalQuestions ??
//         questionObject.total_questions ??
//         data.totalQuestions ??
//         data.total_questions,
//       null,
//     );

//   /*
//    * ---------------------------------------------------------
//    * TIME LIMIT
//    * ---------------------------------------------------------
//    */
//   const timeLimit =
//   getNumber(
//     questionObject.timeLimit ??
//       questionObject.time_limit ??
//       questionObject.questionDuration ??
//       questionObject.question_duration ??
//       data.timeLimit ??
//       data.time_limit ??
//       data.questionDuration ??
//       data.question_duration,
//     null,
//   );

//   /*
//    * ---------------------------------------------------------
//    * START TIME
//    *
//    * Backend currently sends:
//    *
//    * startTime: "2026-10-01T16:15:07.686Z"
//    *
//    * We normalize that into our frontend contract:
//    *
//    * startedAt
//    * ---------------------------------------------------------
//    */
//   const startedAt =
//     getString(
//       questionObject.startedAt ??
//         questionObject.started_at ??
//         questionObject.startTime ??
//         questionObject.start_time ??
//         data.startedAt ??
//         data.started_at ??
//         data.startTime ??
//         data.start_time,
//       null,
//     );

//   /*
//    * ---------------------------------------------------------
//    * EXPIRATION TIME
//    * ---------------------------------------------------------
//    *
//    * If backend explicitly sends expiresAt/endTime, use it.
//    *
//    * If it doesn't, and we have:
//    *
//    *   startedAt + timeLimit
//    *
//    * then calculate expiresAt locally.
//    *
//    * This does NOT change the server-authoritative timer.
//    * It only gives the UI the timestamp needed to render
//    * the countdown.
//    */
//   let expiresAt =
//     getString(
//       questionObject.expiresAt ??
//         questionObject.expires_at ??
//         questionObject.endTime ??
//         questionObject.end_time ??
//         data.expiresAt ??
//         data.expires_at ??
//         data.endTime ??
//         data.end_time,
//       null,
//     );

//   if (
//     !expiresAt &&
//     startedAt &&
//     timeLimit !== null &&
//     timeLimit > 0
//   ) {
//     const startedTimestamp =
//       Date.parse(startedAt);

//     if (!Number.isNaN(startedTimestamp)) {
//       expiresAt = new Date(
//         startedTimestamp +
//           timeLimit * 1000,
//       ).toISOString();
//     }
//   }

//   return {
//     id:
//       id ??
//       `question-${Date.now()}`,

//     question:
//       questionText ?? "",

//     options,

//     questionNumber,

//     totalQuestions,

//     timeLimit,

//     startedAt,

//     expiresAt,
//   };
// }

// export function mapParticipants(
//   value: unknown,
// ): HostParticipant[] {
//   return getArray(value).map(
//     (item, index) => {
//       const participant = getObject(item);

//       const id =
//         getString(
//           participant.id ??
//             participant._id ??
//             participant.userId ??
//             participant.user_id ??
//             participant.participantId ??
//             participant.participant_id,
//           `participant-${index}`,
//         ) ?? `participant-${index}`;

//       const name =
//         getString(
//           participant.name ??
//             participant.username ??
//             participant.fullName ??
//             participant.full_name ??
//             participant.displayName ??
//             participant.display_name,
//           "Participant",
//         ) ?? "Participant";

//       const score =
//         getNumber(
//           participant.score ??
//             participant.points ??
//             participant.totalPoints ??
//             participant.total_points,
//           0,
//         ) ?? 0;

//       const rank =
//         getNumber(
//           participant.rank ??
//             participant.position,
//           index + 1,
//         ) ?? index + 1;

//       return {
//         ...participant,
//         id,
//         name,
//         score,
//         rank,
//       } as HostParticipant;
//     },
//   );
// }

// export function mapLeaderboard(
//   value: unknown,
// ): HostLeaderboardEntry[] {
//   return getArray(value).map(
//     (item, index) => {
//       const entry = getObject(item);

//       const id =
//         getString(
//           entry.id ??
//             entry._id ??
//             entry.userId ??
//             entry.user_id ??
//             entry.participantId ??
//             entry.participant_id,
//           `leaderboard-${index}`,
//         ) ?? `leaderboard-${index}`;

//       const name =
//         getString(
//           entry.name ??
//             entry.username ??
//             entry.fullName ??
//             entry.full_name ??
//             entry.displayName ??
//             entry.display_name,
//           "Participant",
//         ) ?? "Participant";

//       const score =
//         getNumber(
//           entry.score ??
//             entry.points ??
//             entry.totalPoints ??
//             entry.total_points,
//           0,
//         ) ?? 0;

//       const rank =
//         getNumber(
//           entry.rank ??
//             entry.position,
//           index + 1,
//         ) ?? index + 1;

//       return {
//         ...entry,
//         id,
//         name,
//         score,
//         rank,
//       } as HostLeaderboardEntry;
//     },
//   );
// }

// export function makeFeedEvent(
//   type: string,
//   payload: unknown,
//   message?: string,
// ): QuizFeedEvent {
//   const data =
//     getObject(
//       unwrapPayload(
//         getObject(payload),
//       ),
//     );

//   const participantId =
//     getString(
//       data.participantId ??
//         data.participant_id ??
//         data.userId ??
//         data.user_id,
//       null,
//     );

//   const participantName =
//     getString(
//       data.participantName ??
//         data.participant_name ??
//         data.username ??
//         data.name ??
//         data.fullName ??
//         data.full_name,
//       null,
//     );

//   return {
//     id: `${type}-${Date.now()}-${Math.random()
//       .toString(36)
//       .slice(2, 8)}`,

//     type,

//     message:
//       message ??
//       buildFeedMessage(
//         type,
//         data,
//         participantName,
//       ),

//     timestamp:
//       new Date().toISOString(),

//     participantId,

//     participantName,
//   };
// }

// function buildFeedMessage(
//   type: string,
//   data: SocketPayload,
//   participantName: string | null,
// ): string {
//   const name =
//     participantName ?? "Participant";

//   switch (type) {
//     case "participant_joined_room":
//       return `${name} joined the room.`;

//     case "first_correct":
//       return `${name} answered correctly first.`;

//     case "answer_result":
//       return `${name} submitted an answer.`;

//     case "participant_selected_answer":
//       return `${name} selected an answer.`;

//     case "participants_eliminated":
//       return "Participants were eliminated.";

//     case "question_started":
//       return "A new question has started.";

//     case "question_locked":
//       return "The current question has been locked.";

//     case "round_started":
//       return "A new round has started.";

//     case "round_completed":
//       return "The current round has completed.";

//     case "next_question":
//       return "The next question is ready.";

//     case "room_activated":
//       return "The quiz room has been activated.";

//     case "get_room_doc":
//       return "Room state was synchronized.";

//     case "room_state":
//       return "Room state was received.";

//     default:
//       return type
//         .replaceAll("_", " ")
//         .replace(
//           /^\w/,
//           (character) =>
//             character.toUpperCase(),
//         );
//   }
// }

// export function appendFeedEvent(
//   current: QuizFeedEvent[],
//   event: QuizFeedEvent,
//   maximum = 100,
// ): QuizFeedEvent[] {
//   return [
//     event,
//     ...current,
//   ].slice(0, maximum);
// }

// export function normalizeStatus(
//   value: unknown,
// ): string | null {
//   const status = getString(value, null);

//   return status
//     ? status.toUpperCase()
//     : null;
// }

// export function isRecord(
//   value: unknown,
// ): value is SocketPayload {
//   return (
//     value !== null &&
//     typeof value === "object" &&
//     !Array.isArray(value)
//   );
// }