




"use client";

import type { Dispatch, SetStateAction } from "react";


import type { HostParticipant } from "@/components/quiz-board/host/HostParticipantPanel";
import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";
import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import type {
LiveQuestion,
QuizFeedEvent,
QuizAnswerResult,
QuizFastestWinner,
QuizRoomDocument,
QuizRoomLeaderboard,
QuizRoomLeaderboardEntry,

TieBreakParticipant,
TieBreakSelectionPayload,
  
} from "./quizSocketTypes";

import {
  getNumber,
  getString,
  mapLeaderboard,
  mapParticipants,
  normalizeStatus,
  unwrapPayload,
} from "./quizSocketUtils";

import {
  getQuestionFastestWinner,
} from "@/lib/socket/quizSocket";

import {
  extractQuestion,
  extractQuestionNumber,
  isRecord,
  type UnknownObject,
} from "./quizSocketQuestion";

/* ================================================================
   TYPES
================================================================ */

/**
 * Server response returned after a contestant submits an answer.
 *
 * Example backend response:
 *
 * {
 *   success: true,
 *   data: {
 *     leaderboardData: [...],
 *     answerId: "...",
 *     quizId: "...",
 *     roomId: "...",
 *     roundNumber: 1,
 *     questionId: "...",
 *     selectedAnswer: "...",
 *     isCorrect: true,
 *     isFirstCorrectAnswer: true,
 *     scoreAwarded: 10,
 *     roundScore: 10,
 *     totalScore: 30,
 *     timeTakenInSeconds: 4.2,
 *     message: "Correct answer. You received the points for being the first correct participant."
 *   }
 * }
 */


export interface QuizSocketHandlerContext {
  quizIdRef: {
    current: string;
  };

  roomIdRef: {
    current: string | null;
  };

  roleRef: {
    current: QuizGameRole | null;
  };

  currentRoundRef: {
    current: number;
  };

  questionRef: {
    current: LiveQuestion | null;
  };

  timeLimitRef: {
    current: number;
  };

  socketRef: {
    current: import("socket.io-client").Socket | null;
  };

  disposedRef: {
    current: boolean;
  };

  fastestWinner: Dispatch<
  SetStateAction<QuizFastestWinner | null>
>;

  setConnected: Dispatch<SetStateAction<boolean>>;
  setRoomJoined: Dispatch<SetStateAction<boolean>>;
  setRoomActivated: Dispatch<SetStateAction<boolean>>;
  setRoomDoc: Dispatch<SetStateAction<QuizRoomDocument | null>>;
  setSocketCurrentRound: Dispatch<SetStateAction<number>>;
  setQuestion: Dispatch<SetStateAction<LiveQuestion | null>>;
  setCurrentQuestionNumber: Dispatch<
    SetStateAction<number | null>
  >;
  setQuestionStarted: Dispatch<SetStateAction<boolean>>;
  setQuestionLocked: Dispatch<SetStateAction<boolean>>;
  setSelectedAnswer: Dispatch<
    SetStateAction<string | null>
  >;
  setAnswerSubmitted: Dispatch<SetStateAction<boolean>>;
  setSubmittingAnswer: Dispatch<SetStateAction<boolean>>;

  /**
   * Stores the latest server-authoritative answer result.
   */
  setAnswerResult: Dispatch<
    SetStateAction<QuizAnswerResult | null>
  >;

  setParticipants: Dispatch<
    SetStateAction<HostParticipant[]>
  >;
  setLeaderboard: Dispatch<
    SetStateAction<HostLeaderboardEntry[]>
  >;
  setFeedEvents: Dispatch<
    SetStateAction<QuizFeedEvent[]>
  >;
  setSocketError: Dispatch<
    SetStateAction<string | null>
  >;
  setActionLoading: Dispatch<
    SetStateAction<boolean>
  >;

  onRoundChangedRef: {
    current:
      | ((roundNumber: number) => void)
      | undefined;
  };

  addFeedEvent: (
    type: string,
    payload: unknown,
    message?: string,
  ) => void;

  updateRound: (
    roundNumber: number,
  ) => void;

  setRoundLeaderboard: Dispatch<
  SetStateAction<QuizRoomLeaderboard | null>
>;

  applyQuestion: (
    payload: unknown,
    source: string,
    markStarted?: boolean,
  ) => boolean;

 setTieBreakPayload: Dispatch<
    SetStateAction<TieBreakSelectionPayload | null>
  >;
}

 

/* ================================================================
   PARTICIPANTS
================================================================ */

export function extractParticipants(
  data: UnknownObject,
): unknown[] {
  const candidates: unknown[] = [
    data.participants,
    data.participantList,
    data.participant_list,
    data.users,
    data.players,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

/* ================================================================
   LEADERBOARD
================================================================ */

export function extractLeaderboard(
  data: UnknownObject,
): unknown[] {
  const candidates: unknown[] = [
    data.leaderboard,
    data.entries,
    data.leaderboardEntries,
    data.leaderboard_entries,
    data.rankings,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

/* ================================================================
   ROUND EXTRACTION
================================================================ */

function extractRound(
  payload: unknown,
): number | null {
  const data = unwrapPayload(payload);

  if (!isRecord(data)) {
    return null;
  }

  const round = getNumber(
    data.currentRound ??
      data.current_round ??
      data.roundNumber ??
      data.round_number ??
      data.round,
  );

  if (
    round === null ||
    round < 1
  ) {
    return null;
  }

  return round;
}

/* ================================================================
   ANSWER RESULT EXTRACTION
================================================================ */

/**
 * Extracts the backend answer_result data.
 *
 * Backend response:
 *
 * {
 *   success: true,
 *   data: {
 *     ...
 *   }
 * }
 *
 * Some socket implementations may emit the data object
 * directly, so this supports both forms.
 */

function extractAnswerResult(
  payload: unknown,
): QuizAnswerResult | null {
  const unwrapped = unwrapPayload(payload);

  if (!isRecord(unwrapped)) {
    return null;
  }

  /*
   * Support both:
   *
   * {
   *   success: true,
   *   data: {...}
   * }
   *
   * and:
   *
   * {
   *   isCorrect: true,
   *   ...
   * }
   */
  let data: unknown = unwrapped;

  if (isRecord(unwrapped.data)) {
    data = unwrapped.data;
  }

  if (!isRecord(data)) {
    return null;
  }

  const isCorrect =
    data.isCorrect === true;

  const isFirstCorrectAnswer =
    data.isFirstCorrectAnswer === true;

  const scoreAwarded =
    getNumber(
      data.scoreAwarded,
    ) ?? 0;

  const roundScore =
    getNumber(
      data.roundScore,
    ) ?? scoreAwarded;

  const totalScore =
    getNumber(
      data.totalScore,
    ) ?? 0;

  const timeTakenInSeconds =
    getNumber(
      data.timeTakenInSeconds,
    );

  const message =
    getString(
      data.message,
    ) ??
    (
      isCorrect
        ? "Correct answer."
        : "Incorrect answer."
    );

  const answerResult: QuizAnswerResult = {
    leaderboardData:
      Array.isArray(
        data.leaderboardData,
      )
        ? data.leaderboardData
        : [],

    answerId:
      getString(
        data.answerId,
      ),

    quizId:
      getString(
        data.quizId,
      ),

    roomId:
      getString(
        data.roomId,
      ),

    roundNumber:
      getNumber(
        data.roundNumber,
      ),

    questionId:
      getString(
        data.questionId,
      ),

    selectedAnswer:
      getString(
        data.selectedAnswer,
      ),

    isCorrect,

    isFirstCorrectAnswer,

    scoreAwarded,

    roundScore,

    totalScore,

    timeTakenInSeconds,

    message,
  };

  return answerResult;
}

/* ================================================================
   CREATE HANDLERS
================================================================ */

export function createQuizSocketHandlers(
  context: QuizSocketHandlerContext,
) {
  const {
    quizIdRef,
    roomIdRef,
    roleRef,
    currentRoundRef,
    questionRef,
    socketRef,
    disposedRef,

    setConnected,
    setRoomJoined,
    setRoomActivated,
    setRoomDoc,
    setSocketCurrentRound,
    setRoundLeaderboard,
    setTieBreakPayload,
    setQuestion,
    setCurrentQuestionNumber,
    setQuestionStarted,
    setQuestionLocked,
    setSelectedAnswer,
    setAnswerSubmitted,
    setSubmittingAnswer,
    setAnswerResult,
    setParticipants,
    setLeaderboard,
    setSocketError,
    setActionLoading,

    addFeedEvent,
    updateRound,
    applyQuestion,

    fastestWinner,

  } = context;

  /* ==============================================================
     HANDLE ROOM STATE
  ============================================================== */

  const handleRoomState = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    const data = unwrapPayload(payload);

    if (!isRecord(data)) {
      return;
    }

    console.log(
      "[useQuizSocket] ROOM STATE PAYLOAD:",
      payload,
    );

    const status = normalizeStatus(
      getString(
        data.status ??
          data.roomStatus ??
          data.room_status,
      ),
    );

    if (status === "IN_PROGRESS") {
      setRoomActivated(true);
    }

    if (status === "WAITING") {
      setRoomActivated(false);
    }

    const round = extractRound(payload);

    console.log(
      "[useQuizSocket] ROOM STATE ROUND:",
      round,
    );

    if (round !== null) {
      updateRound(round);
    }

    const rawQuestion =
      extractQuestion(payload);

    if (rawQuestion) {
      applyQuestion(
        payload,
        "ROOM STATE",
        true,
      );
    }

    const participants =
      extractParticipants(data);

    if (participants.length > 0) {
      setParticipants(
        mapParticipants(participants),
      );
    }

    const leaderboard =
      extractLeaderboard(data);

    if (leaderboard.length > 0) {
      setLeaderboard(
        mapLeaderboard(leaderboard),
      );
    }

    addFeedEvent(
      "room_state",
      payload,
    );
  };

  /* ==============================================================
     HANDLE GET ROOM ACK
  ============================================================== */

  const handleGetRoomAck = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    const data = unwrapPayload(payload);

    if (!isRecord(data)) {
      return;
    }

    const resolvedRoomId =
      getString(
        data.roomId ??
          data.room_id,
      ) ?? roomIdRef.current;

    const resolvedQuizId =
      getString(
        data.quizId ??
          data.quiz_id,
      ) ?? quizIdRef.current;

    const status = normalizeStatus(
      getString(
        data.status ??
          data.roomStatus ??
          data.room_status,
      ),
    );

    const round = extractRound(payload);

    const questionNumber =
      extractQuestionNumber(payload);

    const participants =
      extractParticipants(data);

    const leaderboard =
      extractLeaderboard(data);

    const roomDocument: QuizRoomDocument = {
      roomId: resolvedRoomId,
      quizId: resolvedQuizId,
      status,

      currentRound:
        round !== null
          ? round
          : currentRoundRef.current,

      currentQuestionNumber:
        questionNumber ?? null,

      participants:
        participants.length > 0
          ? mapParticipants(participants)
          : [],

      leaderboard:
        leaderboard.length > 0
          ? mapLeaderboard(leaderboard)
          : [],
    };

    setRoomDoc(roomDocument);

    if (status === "IN_PROGRESS") {
      setRoomActivated(true);
    } else if (status === "WAITING") {
      setRoomActivated(false);
    }

    if (round !== null) {
      updateRound(round);
    }

    if (participants.length > 0) {
      setParticipants(
        mapParticipants(participants),
      );
    }

    if (leaderboard.length > 0) {
      setLeaderboard(
        mapLeaderboard(leaderboard),
      );
    }

    if (questionNumber !== undefined) {
      setCurrentQuestionNumber(
        questionNumber,
      );
    }

    const rawQuestion =
      extractQuestion(payload);

    if (rawQuestion) {
      applyQuestion(
        payload,
        "GET ROOM ACK",
        true,
      );
    } else if (
      round === null ||
      questionNumber === undefined
    ) {
      questionRef.current = null;
      setQuestion(null);
      setCurrentQuestionNumber(null);
      setQuestionStarted(false);
    }

    addFeedEvent(
      "get_room_ack",
      payload,
    );

    console.log(
      "[useQuizSocket] Processed get_room_ack:",
      {
        roomId: resolvedRoomId,
        quizId: resolvedQuizId,
        status,
        round,
        questionNumber,
        hasQuestion: Boolean(rawQuestion),
      },
    );
  };

  /* ==============================================================
     HANDLE CONNECT
  ============================================================== */

  const handleConnect = () => {
    if (disposedRef.current) {
      return;
    }

    setConnected(true);
    setSocketError(null);

    const socket = socketRef.current;

    if (
      !socket ||
      !quizIdRef.current ||
      !roomIdRef.current ||
      !roleRef.current
    ) {
      console.warn(
        "[QuizSocket] join_room NOT emitted because required values are missing:",
        {
          hasSocket: Boolean(socket),
          quizId: quizIdRef.current,
          roomId: roomIdRef.current,
          role: roleRef.current,
        },
      );

      return;
    }

    const payload = {
      quizId: quizIdRef.current,
      quiz_id: quizIdRef.current,

      roomId: roomIdRef.current,
      room_id: roomIdRef.current,

      role: roleRef.current,

      currentRound:
        currentRoundRef.current,

      roundNumber:
        currentRoundRef.current,

      round_number:
        currentRoundRef.current,
    };

    console.log(
      "[QuizSocket] CLIENT join_room PAYLOAD:",
      payload,
    );

    try {
      console.log(
        "[QuizSocket] join_room PAYLOAD JSON:",
        JSON.stringify(payload),
      );
    } catch {
      // Ignore serialization errors.
    }

    socket.emit(
      "join_room",
      payload,
    );
  };

  /* ==============================================================
     HANDLE DISCONNECT
  ============================================================== */

  const handleDisconnect = (
    reason?: string,
  ) => {
    if (disposedRef.current) {
      return;
    }

    setConnected(false);
    setRoomJoined(false);

    setSocketError(
      reason
        ? `Socket disconnected: ${reason}`
        : "Socket disconnected",
    );
  };

  /* ==============================================================
     HANDLE CONNECT ERROR
  ============================================================== */

  const handleConnectError = (
    error: Error,
  ) => {
    if (disposedRef.current) {
      return;
    }

    setConnected(false);

    setSocketError(
      error?.message ||
        "Unable to connect to quiz server",
    );
  };

  /* ==============================================================
     HANDLE JOINED ROOM ACK
  ============================================================== */

  const handleJoinedRoomAck = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] JOINED ROOM ACK PAYLOAD:",
      payload,
    );

    try {
      console.log(
        "[useQuizSocket] JOINED ROOM ACK JSON:",
        JSON.stringify(payload),
      );
    } catch {
      // Ignore serialization errors.
    }

    const round =
      extractRound(payload);

    console.log(
      "[useQuizSocket] JOINED ROOM ACK EXTRACTED ROUND:",
      round,
    );

    if (round !== null) {
      console.log(
        "[useQuizSocket] JOINED ROOM ACK UPDATING ROUND:",
        {
          previousRound:
            currentRoundRef.current,
          newRound: round,
          role: roleRef.current,
        },
      );

      updateRound(round);
    } else {
      console.warn(
        "[useQuizSocket] JOINED ROOM ACK DID NOT CONTAIN A VALID ROUND:",
        {
          currentRound:
            currentRoundRef.current,
          role: roleRef.current,
        },
      );
    }

    setRoomJoined(true);
    setSocketError(null);

    addFeedEvent(
      "joined_room_ack",
      payload,
    );

    /*
     * Only the host requests the full room document.
     *
     * Contestants receive their live state through the
     * room/round/question events.
     */
    if (
      roleRef.current !== "HOST"
    ) {
      return;
    }

    const socket =
      socketRef.current;

    if (
      !socket ||
      !socket.connected ||
      !quizIdRef.current ||
      !roomIdRef.current
    ) {
      return;
    }

    socket.emit(
      "get_room_doc",
      {
        quizId:
          quizIdRef.current,

        quiz_id:
          quizIdRef.current,

        roomId:
          roomIdRef.current,

        room_id:
          roomIdRef.current,

        roundNumber:
          currentRoundRef.current,

        round_number:
          currentRoundRef.current,
      },
    );
  };

  /* ==============================================================
     HANDLE ROOM ACTIVATED
  ============================================================== */

  const handleRoomActivated = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    setRoomActivated(true);
    setSocketError(null);

    const data =
      unwrapPayload(payload);

    const message =
      isRecord(data)
        ? getString(
            data.message ??
              data.status,
          ) ?? undefined
        : undefined;

    addFeedEvent(
      "room_activated",
      payload,
      message,
    );
  };

  /* ==============================================================
     HANDLE ROUND STARTED
  ============================================================== */

  const handleRoundStarted = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "============================================================",
    );

    console.log(
      "[useQuizSocket] ROUND STARTED EVENT RECEIVED",
    );

    console.log(
      "[useQuizSocket] ROUND STARTED PAYLOAD:",
      payload,
    );

    try {
      console.log(
        "[useQuizSocket] ROUND STARTED JSON:",
        JSON.stringify(payload),
      );
    } catch {
      // Ignore serialization errors.
    }

    console.log(
      "[useQuizSocket] ROUND STARTED FRONTEND STATE BEFORE:",
      {
        quizId:
          quizIdRef.current,

        roomId:
          roomIdRef.current,

        role:
          roleRef.current,

        currentRoundRef:
          currentRoundRef.current,
      },
    );

    const round =
      extractRound(payload);

    console.log(
      "[useQuizSocket] ROUND STARTED EXTRACTED ROUND:",
      round,
    );

    if (round !== null) {
      updateRound(round);

      console.log(
        "[useQuizSocket] ROUND STARTED ROUND UPDATED:",
        {
          newRound: round,
          currentRoundRef:
            currentRoundRef.current,
        },
      );
    } else {
      console.warn(
        "[useQuizSocket] ROUND STARTED DID NOT CONTAIN A VALID ROUND.",
      );
    }

    /*
     * A new round starts with no selected answer and no question
     * lock. The actual question becomes active when the backend
     * emits question_started/new_question/new_question_displayed.
     */
    setQuestionStarted(false);
    setQuestionLocked(false);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setSubmittingAnswer(false);

    /*
     * Clear any previous answer result.
     *
     * The new question should not display the result from
     * the previous question.
     */
    setAnswerResult(null);

    addFeedEvent(
      "round_started",
      payload,
    );

    console.log(
      "[useQuizSocket] ROUND STARTED FRONTEND STATE AFTER:",
      {
        currentRoundRef:
          currentRoundRef.current,

        role:
          roleRef.current,
      },
    );

    console.log(
      "============================================================",
    );
  };

  /* ==============================================================
     HANDLE QUESTION STARTED
  ============================================================== */

  const handleQuestionStarted = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] QUESTION STARTED PAYLOAD:",
      payload,
    );

    const round =
      extractRound(payload);

    if (round !== null) {
      console.log(
        "[useQuizSocket] QUESTION STARTED ROUND:",
        round,
      );

      updateRound(round);
    }

    /*
     * Clear the previous answer result before displaying
     * a new question.
     */
    setAnswerResult(null);

    applyQuestion(
      payload,
      "QUESTION STARTED",
      true,
    );

    addFeedEvent(
      "question_started",
      payload,
    );
  };

 /* ==============================================================
     HANDLE FASTEST QUESTION WINNER
  ============================================================== */
  const handleQuestionFastestWinner = (
  payload: unknown,
) => {
  if (disposedRef.current) {
    return;
  }

  console.log(
    "🏆🏆🏆 QUESTION FASTEST WINNER RESPONSE 🏆🏆🏆",
  );

  console.log(
    "[useQuizSocket] question_fastest_winner PAYLOAD:",
    payload,
  );

  try {
    console.log(
      "[useQuizSocket] question_fastest_winner JSON:",
      JSON.stringify(payload, null, 2),
    );
  } catch {
    // Ignore serialization errors.
  }

  /*
   * We are intentionally not mapping the payload yet.
   *
   * First capture the exact backend response so we know whether
   * the winner is returned as:
   *
   * payload.data
   * payload.data.winner
   * payload.winner
   * payload.user
   * etc.
   */

  addFeedEvent(
    "question_fastest_winner",
    payload,
  );
};


/* ==============================================================
   HANDLE QUESTION COMPLETED
============================================================== */

const handleQuestionCompleted = (
  payload: unknown,
) => {
  if (disposedRef.current) {
    return;
  }

  console.log(
    "🏆🏆🏆 QUESTION COMPLETED EVENT RECEIVED 🏆🏆🏆",
  );

  console.log(
    "[useQuizSocket] question_completed PAYLOAD:",
    payload,
  );

  try {
    console.log(
      "[useQuizSocket] question_completed JSON:",
      JSON.stringify(
        payload,
        null,
        2,
      ),
    );
  } catch {
    // Ignore serialization errors.
  }

  const unwrapped =
    unwrapPayload(payload);

  if (!isRecord(unwrapped)) {
    console.warn(
      "[useQuizSocket] question_completed payload is not an object:",
      payload,
    );

    return;
  }

  /*
   * Support both:
   *
   * {
   *   questionId,
   *   winner: {...}
   * }
   *
   * and:
   *
   * {
   *   data: {
   *     questionId,
   *     winner: {...}
   *   }
   * }
   */
  const data =
    isRecord(unwrapped.data)
      ? unwrapped.data
      : unwrapped;

  const winner =
    isRecord(data.winner)
      ? data.winner
      : null;

  /*
   * The question may complete without a winner.
   */
  if (!winner) {
    console.log(
      "[useQuizSocket] question_completed has no winner.",
    );

    fastestWinner(null);

    addFeedEvent(
      "question_completed",
      payload,
    );

    return;
  }

  const firstName =
    getString(
      winner.firstName ??
        winner.first_name,
    );

  const lastName =
    getString(
      winner.lastName ??
        winner.last_name,
    );

  const name =
    [firstName, lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

  const mappedWinner: QuizFastestWinner = {
    name:
      name || null,

    email:
      getString(
        winner.email,
      ),

    userId:
      getString(
        winner.userId ??
          winner.user_id ??
          winner.id ??
          winner._id,
      ),

    questionId:
      getString(
        data.questionId ??
          data.question_id,
      ) ??
      questionRef.current?.id ??
      null,

    timeTakenInSeconds:
      getNumber(
        winner.timeTakenInSeconds ??
          winner.time_taken_in_seconds,
      ),
  };

  console.log(
    "🏆 [useQuizSocket] QUESTION COMPLETED → FASTEST WINNER:",
    mappedWinner,
  );

  /*
   * This is the important part.
   *
   * It updates:
   *
   * fastestWinner
   *      ↓
   * useQuizSocket
   *      ↓
   * QuizPlayController
   *      ↓
   * ContestantQuizShow
   */
  fastestWinner(
    mappedWinner,
  );

  addFeedEvent(
    "question_completed",
    payload,
    name
      ? `${name} was the fastest correct contestant.`
      : "The question has been completed.",
  );
};




  /* ==============================================================
     HANDLE NEW QUESTION
  ============================================================== */

  const handleNewQuestion = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] NEW QUESTION PAYLOAD:",
      payload,
    );

    const round =
      extractRound(payload);

    if (round !== null) {
      updateRound(round);
    }

    /*
     * Clear the previous answer result before the new
     * question becomes active.
     */
    setAnswerResult(null);

    applyQuestion(
      payload,
      "NEW QUESTION",
      true,
    );

    addFeedEvent(
      "new_question",
      payload,
    );
  };

  /* ==============================================================
     HANDLE NEW QUESTION DISPLAYED
  ============================================================== */

  const handleNewQuestionDisplayed = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "🚨🚨🚨 NEW QUESTION EVENT ACTUALLY RECEIVED 🚨🚨🚨",
    );

    console.log(
      "[useQuizSocket] new_question_displayed payload:",
      payload,
    );

    try {
      console.log(
        "[useQuizSocket] new_question_displayed JSON:",
        JSON.stringify(payload),
      );
    } catch {
      // Ignore serialization errors.
    }

    const round =
      extractRound(payload);

    console.log(
      "[useQuizSocket] NEW QUESTION DISPLAYED ROUND:",
      round,
    );

    if (round !== null) {
      updateRound(round);
    }

    /*
     * Clear the previous answer result.
     */
    setAnswerResult(null);

    const rawQuestion =
      extractQuestion(payload);

    const applied =
      applyQuestion(
        payload,
        "NEW QUESTION DISPLAYED",
        true,
      );

    if (!applied) {
      console.warn(
        "[useQuizSocket] new_question_displayed received but question could not be applied.",
        {
          rawQuestion,
          payload,
        },
      );
    } else {
      console.log(
        "[useQuizSocket] new_question_displayed applied successfully.",
      );
    }

    addFeedEvent(
      "new_question_displayed",
      payload,
    );

    console.log(
      "------------------------------------------------------------",
    );
  };

  /* ==============================================================
     HANDLE QUESTION DISPLAYED
  ============================================================== */

  const handleQuestionDisplayed = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] QUESTION DISPLAYED PAYLOAD:",
      payload,
    );

    const round =
      extractRound(payload);

    if (round !== null) {
      updateRound(round);
    }

    /*
     * Clear the previous answer result.
     */
    setAnswerResult(null);

    applyQuestion(
      payload,
      "QUESTION DISPLAYED",
      true,
    );

    addFeedEvent(
      "question_displayed",
      payload,
    );
  };

  /* ==============================================================
     HANDLE NEXT QUESTION
  ============================================================== */

  const handleNextQuestion = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] NEXT QUESTION PAYLOAD:",
      payload,
    );

    const round =
      extractRound(payload);

    if (round !== null) {
      updateRound(round);
    }

    /*
     * Clear the previous answer result.
     */
    setAnswerResult(null);

    applyQuestion(
      payload,
      "NEXT QUESTION",
      true,
    );

    addFeedEvent(
      "next_question",
      payload,
    );
  };

  /* ==============================================================
     HANDLE QUESTION LOCKED
  ============================================================== */

  const handleQuestionLocked = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    setQuestionLocked(true);

    addFeedEvent(
      "question_locked",
      payload,
    );
  };

  /* ==============================================================
     HANDLE PARTICIPANT JOINED
  ============================================================== */

  const handleParticipantJoined = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    const data =
      unwrapPayload(payload);

    console.log(
      "[useQuizSocket] participant_joined_room RAW PAYLOAD:",
      payload,
    );

    if (!isRecord(data)) {
      console.warn(
        "[useQuizSocket] participant_joined_room payload is not an object:",
        data,
      );

      return;
    }

    try {
      console.log(
        "[useQuizSocket] participant_joined_room JSON:",
        JSON.stringify(data),
      );
    } catch {
      // Ignore serialization errors.
    }

    console.log(
      "[useQuizSocket] participant_joined_room DATA KEYS:",
      Object.keys(data),
    );

    /*
     * Supported backend shapes:
     *
     * {
     *   participant: {...}
     * }
     *
     * {
     *   user: {...}
     * }
     *
     * {
     *   userId: "...",
     *   timestamp: "..."
     * }
     */

    let participant =
      data.participant ??
      data.user;

    /*
     * Actual payload observed:
     *
     * {
     *   userId,
     *   timestamp
     * }
     *
     * Convert it into the shape expected by
     * mapParticipants().
     */
    if (
      participant === undefined &&
      typeof data.userId === "string"
    ) {
      participant = {
        id: data.userId,
        userId: data.userId,
        _id: data.userId,
        timestamp:
          data.timestamp,
      };

      console.log(
        "[useQuizSocket] participant_joined_room CONSTRUCTED PARTICIPANT:",
        participant,
      );
    }

    if (participant === undefined) {
      console.warn(
        "[useQuizSocket] participant_joined_room has no participant/user/userId:",
        data,
      );

      return;
    }

    const mapped =
      mapParticipants([
        participant,
      ]);

    if (mapped.length === 0) {
      console.warn(
        "[useQuizSocket] participant_joined_room participant could not be mapped:",
        participant,
      );

      return;
    }

    const incoming =
      mapped[0];

    setParticipants(
      current => {
        const existingIndex =
          current.findIndex(
            participantItem =>
              participantItem.id ===
              incoming.id,
          );

        if (
          existingIndex === -1
        ) {
          return [
            ...current,
            incoming,
          ];
        }

        const next = [
          ...current,
        ];

        next[existingIndex] =
          incoming;

        return next;
      },
    );

    addFeedEvent(
      "participant_joined_room",
      payload,
    );
  };

  /* ==============================================================
     HANDLE LEADERBOARD UPDATED
  ============================================================== */

  const handleLeaderboardUpdated = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    const data =
      unwrapPayload(payload);

    if (!isRecord(data)) {
      return;
    }

    const leaderboard =
      extractLeaderboard(data);

    if (leaderboard.length > 0) {
      setLeaderboard(
        mapLeaderboard(
          leaderboard,
        ),
      );
    }

    addFeedEvent(
      "leaderboard_updated",
      payload,
    );
  };


 
/* ================================================================
   HANDLE QUIZ ROOM ROUND LEADERBOARD
================================================================ */

const handleQuizRoomLeaderboard = (
  payload: unknown,
) => {
  if (disposedRef.current) {
    return;
  }

  console.log(
    "[useQuizSocket] get_quiz_room_leaderboard payload:",
    payload,
  );

  const unwrapped = unwrapPayload(payload);

  if (!isRecord(unwrapped)) {
    console.warn(
      "[useQuizSocket] Invalid round leaderboard payload:",
      payload,
    );
    return;
  }

  /*
   * Support either:
   *
   * { leaderboard: {...} }
   *
   * or a directly emitted leaderboard document.
   */
  const rawLeaderboard = isRecord(unwrapped.leaderboard)
    ? unwrapped.leaderboard
    : unwrapped;

  if (!Array.isArray(rawLeaderboard.entries)) {
    console.warn(
      "[useQuizSocket] Round leaderboard has no entries array:",
      rawLeaderboard,
    );
    return;
  }

  const entries = rawLeaderboard.entries.map(
    (entry): QuizRoomLeaderboardEntry | null => {
      if (!isRecord(entry)) {
        return null;
      }

      const userId = getString(entry.userId);

      if (!userId) {
        return null;
      }

      return {
        userId,
        roundScore: getNumber(entry.roundScore) ?? 0,
        totalScore: getNumber(entry.totalScore) ?? 0,
        answeredQuestions:
          getNumber(entry.answeredQuestions) ?? 0,
        correctAnswers:
          getNumber(entry.correctAnswers) ?? 0,
        timeTakenInSeconds:
          getNumber(entry.timeTakenInSeconds) ?? 0,
        rank: getNumber(entry.rank) ?? 0,
        isTied: entry.isTied === true,
        tieGroup:
          getString(entry.tieGroup),
        isEliminated: entry.isEliminated === true,
      };
    },
  ).filter(
    (entry): entry is QuizRoomLeaderboardEntry =>
      entry !== null,
  );

  const leaderboard: QuizRoomLeaderboard = {
    _id: getString(rawLeaderboard._id) ?? "",
    quizId:
      getString(rawLeaderboard.quizId) ??
      quizIdRef.current,
    roundNumber:
      getNumber(rawLeaderboard.roundNumber) ??
      currentRoundRef.current,
    entries,
    hasTie: rawLeaderboard.hasTie === true,
    hasTieBreakOccurred:
      rawLeaderboard.hasTieBreakOccurred === true,
    createdAt: getString(rawLeaderboard.createdAt) ?? "",
    updatedAt: getString(rawLeaderboard.updatedAt) ?? "",
  };

  setRoundLeaderboard(leaderboard);

  addFeedEvent(
    "quiz_room_round_leaderboard",
    leaderboard,
    `Round ${leaderboard.roundNumber} leaderboard received.`,
  );

  console.log(
    "[useQuizSocket] Round leaderboard stored:",
    leaderboard,
  );
};




  /* ==============================================================
     HANDLE PARTICIPANT SELECTED ANSWER
  ============================================================== */

  const handleParticipantSelectedAnswer = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    /*
     * Informational only.
     *
     * The contestant's own selection is controlled locally by
     * selectContestantAnswer().
     */
    console.log(
      "[useQuizSocket] participant_selected_answer:",
      payload,
    );

    addFeedEvent(
      "participant_selected_answer",
      payload,
    );
  };

  /* ==============================================================
     HANDLE PARTICIPANTS ELIMINATED
  ============================================================== */

  const handleParticipantsEliminated = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    const data =
      unwrapPayload(payload);

    if (!isRecord(data)) {
      return;
    }

    const participants =
      extractParticipants(data);

    if (participants.length > 0) {
      setParticipants(
        mapParticipants(
          participants,
        ),
      );
    }

    const leaderboard =
      extractLeaderboard(data);

    if (leaderboard.length > 0) {
      setLeaderboard(
        mapLeaderboard(
          leaderboard,
        ),
      );
    }

    addFeedEvent(
      "participants_eliminated",
      payload,
    );
  };



  /* ==============================================================
     HANDLE SELECT PARTICIPANTS TO BE REMOVED — TIE-BREAK
  ============================================================== */

  const handleSelectParticipantsToBeRemoved = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] select_participants_to_be_removed:",
      payload,
    );

    const unwrapped = unwrapPayload(payload);

    if (!isRecord(unwrapped)) {
      console.warn(
        "[useQuizSocket] Invalid tie-break payload:",
        payload,
      );
      return;
    }

    const data = isRecord(unwrapped.data)
      ? unwrapped.data
      : unwrapped;

    const incomingQuizId =
      getString(data.quizId ?? data.quiz_id);

    const incomingRoomId =
      getString(data.roomId ?? data.room_id);

    const roundNumber =
      getNumber(data.roundNumber ?? data.round_number);

    /*
     * Ignore a payload belonging to another quiz or room.
     * The backend must still enforce recipient authorization.
     */
    if (
      (incomingQuizId &&
        incomingQuizId !== quizIdRef.current) ||
      (incomingRoomId &&
        incomingRoomId !== roomIdRef.current)
    ) {
      console.warn(
        "[useQuizSocket] Ignoring tie-break payload for another room.",
      );
      return;
    }

    const rawTieParticipants =
      data.participantsWithLeastTie;

    let rawEntries: unknown[] = [];

    if (Array.isArray(rawTieParticipants)) {
      rawEntries = rawTieParticipants;
    } else if (isRecord(rawTieParticipants)) {
      if (Array.isArray(rawTieParticipants.entries)) {
        rawEntries = rawTieParticipants.entries;
      }
    }

    const entries: TieBreakParticipant[] =
      rawEntries.flatMap((entry) => {
        if (!isRecord(entry)) {
          return [];
        }

        const userId = getString(
          entry.userId ??
            entry.user_id ??
            entry._id,
        );

        if (!userId) {
          return [];
        }

        return [{
          userId,
          roundScore: getNumber(entry.roundScore) ?? 0,
          totalScore: getNumber(entry.totalScore) ?? 0,
          answeredQuestions:
            getNumber(entry.answeredQuestions) ?? 0,
          correctAnswers:
            getNumber(entry.correctAnswers) ?? 0,
          timeTakenInSeconds:
            getNumber(entry.timeTakenInSeconds) ?? 0,
          rank: getNumber(entry.rank) ?? 0,
          isTied: entry.isTied === true,
          tieGroup: getString(entry.tieGroup),
          isEliminated: entry.isEliminated === true,
        }];
      });

    const tieBreakPayload: TieBreakSelectionPayload = {
      quizId: incomingQuizId ?? quizIdRef.current,
      roomId: incomingRoomId ?? roomIdRef.current ?? "",
      roundNumber: roundNumber ?? currentRoundRef.current,
      participantsWithLeastTie: entries,
    };

    setTieBreakPayload(tieBreakPayload);

    setSocketError(null);

    addFeedEvent(
      "select_participants_to_be_removed",
      tieBreakPayload,
      "Tie-break participants received.",
    );

    console.log(
      "[useQuizSocket] Tie-break participants stored:",
      tieBreakPayload,
    );
  };



  /* ==============================================================
     HANDLE ANSWER RESULT
  ============================================================== */

  const handleAnswerResult = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] answer_result:",
      payload,
    );


    /*
     * Extract the server-authoritative result.
     */
    const answerResult =
      extractAnswerResult(payload);

    if (!answerResult) {
      console.warn(
        "[useQuizSocket] answer_result could not be parsed:",
        payload,
      );

      setSubmittingAnswer(false);

      addFeedEvent(
        "answer_result",
        payload,
      );

      return;
    }

    console.log(
      "[useQuizSocket] ANSWER RESULT PARSED:",
      answerResult,
    );

   /* ==========================================================
   REQUEST FASTEST CORRECT WINNER
========================================================== */

if (
  answerResult.isCorrect &&
  answerResult.quizId &&
  answerResult.roomId &&
  answerResult.questionId
) {
  const fastestWinnerPayload = {
    quizId:
      answerResult.quizId,

    roomId:
      answerResult.roomId,

    questionId:
      answerResult.questionId,
  };

  console.log(
    "[useQuizSocket] 🏆 REQUESTING FASTEST QUESTION WINNER:",
    fastestWinnerPayload,
  );

  getQuestionFastestWinner(
    fastestWinnerPayload,
  );
} else {
  console.log(
    "[useQuizSocket] 🏆 FASTEST WINNER NOT REQUESTED:",
    {
      isCorrect:
        answerResult.isCorrect,

      quizId:
        answerResult.quizId,

      roomId:
        answerResult.roomId,

      questionId:
        answerResult.questionId,
    },
  );
} 



    /*
     * Store the complete server response.
     *
     * The contestant UI can now use:
     *
     * answerResult.isCorrect
     * answerResult.isFirstCorrectAnswer
     * answerResult.scoreAwarded
     * answerResult.roundScore
     * answerResult.totalScore
     * answerResult.timeTakenInSeconds
     * answerResult.message
     */
    setAnswerResult(
      answerResult,
    );

    /*
     * The server has successfully processed the answer.
     */
    setSubmittingAnswer(false);

    setAnswerSubmitted(true);

    /*
     * Once the server responds, the current question
     * should no longer accept another answer.
     */
    setQuestionLocked(true);

    /*
     * Keep the selected answer synchronized with the
     * server response when available.
     */
    if (
      answerResult.selectedAnswer
    ) {
      setSelectedAnswer(
        answerResult.selectedAnswer,
      );
    }

    /*
     * Update leaderboard immediately if the backend
     * included the updated leaderboard in answer_result.
     */
    if (
      Array.isArray(
        answerResult.leaderboardData,
      ) &&
      answerResult.leaderboardData.length > 0
    ) {
      setLeaderboard(
        mapLeaderboard(
          answerResult.leaderboardData,
        ),
      );
    }

    addFeedEvent(
      "answer_result",
      payload,
      answerResult.message,
    );
  };

  /* ==============================================================
     HANDLE FIRST CORRECT
  ============================================================== */

  const handleFirstCorrect = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    console.log(
      "[useQuizSocket] first_correct:",
      payload,
    );

    addFeedEvent(
      "first_correct",
      payload,
    );
  };

  /* ==============================================================
     HANDLE SOCKET ERROR
  ============================================================== */

  const handleSocketError = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

    const data =
      unwrapPayload(payload);

    if (!isRecord(data)) {
      setSocketError(
        "An unknown socket error occurred.",
      );

      setActionLoading(false);
      setSubmittingAnswer(false);

      addFeedEvent(
        "socket_error",
        payload,
        "An unknown socket error occurred.",
      );

      return;
    }

    const message =
      getString(
        data.message ??
          data.error ??
          data.errorMessage ??
          data.error_message,
      ) ??
      "An unknown socket error occurred.";

    console.error(
      "[Quiz Socket] ===== SOCKET ERROR =====",
    );

    console.error(
      "[Quiz Socket] Error payload:",
      payload,
    );

    console.error(
      "[Quiz Socket] Current frontend state:",
      {
        quizId:
          quizIdRef.current,

        roomId:
          roomIdRef.current,

        role:
          roleRef.current,

        currentRound:
          currentRoundRef.current,

        questionId:
          questionRef.current?.id ??
          null,

        questionNumber:
          questionRef.current?.questionNumber ??
          null,
      },
    );

    setSocketError(message);
    setActionLoading(false);
    setSubmittingAnswer(false);

    addFeedEvent(
      "socket_error",
      payload,
      message,
    );
  };

  /* ==============================================================
     RETURN HANDLERS
  ============================================================== */

  return {
    handleConnect,
    handleDisconnect,
    handleConnectError,

    handleJoinedRoomAck,
    handleRoomState,
    handleGetRoomAck,
    handleRoomActivated,

    handleRoundStarted,

    handleQuestionStarted,
    handleNewQuestion,
    handleNewQuestionDisplayed,
    handleQuestionDisplayed,
    handleNextQuestion,
    handleQuestionLocked,

    handleParticipantJoined,
    handleLeaderboardUpdated,
    handleParticipantSelectedAnswer,
    handleParticipantsEliminated,

    handleAnswerResult,
    handleFirstCorrect,

    handleQuestionCompleted,

    handleQuestionFastestWinner,

    handleSelectParticipantsToBeRemoved,

    handleSocketError,
  };
}

