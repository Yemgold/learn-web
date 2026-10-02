




"use client";

import type { Dispatch, SetStateAction } from "react";

import type { HostParticipant } from "@/components/quiz-board/host/HostParticipantPanel";
import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";
import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import type {
  LiveQuestion,
  QuizFeedEvent,
  QuizRoomDocument,
} from "./quizSocketTypes";

import {
  appendFeedEvent,
  getNumber,
  getString,
  mapLeaderboard,
  mapParticipants,
  makeFeedEvent,
  normalizeQuestion,
  normalizeStatus,
  unwrapPayload,
} from "./quizSocketUtils";

import {
  extractQuestion,
  extractQuestionNumber,
  hasPlayableQuestion,
  isRecord,
  type UnknownObject,
} from "./quizSocketQuestion";

/* ================================================================
   TYPES
================================================================ */

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

  setConnected: Dispatch<SetStateAction<boolean>>;
  setRoomJoined: Dispatch<SetStateAction<boolean>>;
  setRoomActivated: Dispatch<SetStateAction<boolean>>;
  setRoomDoc: Dispatch<SetStateAction<QuizRoomDocument | null>>;
  setSocketCurrentRound: Dispatch<SetStateAction<number>>;
  setQuestion: Dispatch<SetStateAction<LiveQuestion | null>>;
  setCurrentQuestionNumber: Dispatch<SetStateAction<number | null>>;
  setQuestionStarted: Dispatch<SetStateAction<boolean>>;
  setQuestionLocked: Dispatch<SetStateAction<boolean>>;
  setSelectedAnswer: Dispatch<SetStateAction<string | null>>;
  setAnswerSubmitted: Dispatch<SetStateAction<boolean>>;
  setSubmittingAnswer: Dispatch<SetStateAction<boolean>>;
  setParticipants: Dispatch<SetStateAction<HostParticipant[]>>;
  setLeaderboard: Dispatch<SetStateAction<HostLeaderboardEntry[]>>;
  setFeedEvents: Dispatch<SetStateAction<QuizFeedEvent[]>>;
  setSocketError: Dispatch<SetStateAction<string | null>>;
  setActionLoading: Dispatch<SetStateAction<boolean>>;

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

  updateRound: (roundNumber: number) => void;

  applyQuestion: (
    payload: unknown,
    source: string,
    markStarted?: boolean,
  ) => boolean;
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
   ROOM STATE
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
    timeLimitRef,
    socketRef,
    disposedRef,

    setConnected,
    setRoomJoined,
    setRoomActivated,
    setRoomDoc,
    setSocketCurrentRound,
    setQuestion,
    setCurrentQuestionNumber,
    setQuestionStarted,
    setQuestionLocked,
    setSelectedAnswer,
    setAnswerSubmitted,
    setSubmittingAnswer,
    setParticipants,
    setLeaderboard,
    setFeedEvents,
    setSocketError,
    setActionLoading,

    onRoundChangedRef,

    addFeedEvent,
    updateRound,
    applyQuestion,
  } = context;

  /* ==============================================================
     HANDLE ROOM STATE
  ============================================================== */

  const handleRoomState = (payload: unknown) => {
    if (disposedRef.current) {
      return;
    }

    const data = unwrapPayload(payload);

    if (!isRecord(data)) {
      return;
    }

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

    const round = getNumber(
      data.currentRound ??
        data.current_round ??
        data.roundNumber ??
        data.round_number,
    );

    if (round !== null) {
      updateRound(round);
    }

    /* ------------------------------------------------------------
       Question
    ------------------------------------------------------------ */

    const rawQuestion = extractQuestion(payload);

    if (rawQuestion) {
      applyQuestion(
        payload,
        "ROOM STATE",
        true,
      );
    }

    /* ------------------------------------------------------------
       Participants
    ------------------------------------------------------------ */

    const participants = extractParticipants(data);

    if (participants.length > 0) {
      setParticipants(
        mapParticipants(participants),
      );
    }

    /* ------------------------------------------------------------
       Leaderboard
    ------------------------------------------------------------ */

    const leaderboard = extractLeaderboard(data);

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

  const handleGetRoomAck = (payload: unknown) => {
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

    const round = getNumber(
      data.currentRound ??
        data.current_round ??
        data.roundNumber ??
        data.round_number,
    );

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
      round === 0 ||
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

    setRoomJoined(true);
    setSocketError(null);

    addFeedEvent(
      "joined_room_ack",
      payload,
    );

    /*
     * The host needs the complete room document.
     * Contestants do not request it here.
     */
    if (
      roleRef.current !== "HOST"
    ) {
      return;
    }

    const socket = socketRef.current;

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

    const data = unwrapPayload(payload);

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

    const data = unwrapPayload(payload);

    if (isRecord(data)) {
      const round = getNumber(
        data.currentRound ??
          data.current_round ??
          data.roundNumber ??
          data.round_number ??
          data.round,
      );

      if (
        round !== null &&
        round >= 1
      ) {
        updateRound(round);
      }
    }

    setQuestionStarted(false);
    setQuestionLocked(false);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setSubmittingAnswer(false);

    addFeedEvent(
      "round_started",
      payload,
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
     HANDLE NEW QUESTION
  ============================================================== */

  const handleNewQuestion = (
    payload: unknown,
  ) => {
    if (disposedRef.current) {
      return;
    }

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

    const rawQuestion =
      extractQuestion(payload);

    const unwrapped =
      unwrapPayload(payload);

    const data = isRecord(unwrapped)
      ? unwrapped
      : null;

    const round =
      data
        ? getNumber(
            data.currentRound ??
              data.current_round ??
              data.roundNumber ??
              data.round_number ??
              data.round,
          )
        : null;

    if (
      round !== null &&
      round >= 1
    ) {
      updateRound(round);
    }

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

    const data = unwrapPayload(payload);

    if (!isRecord(data)) {
      return;
    }

    const participant =
      data.participant ??
      data.user;

    if (participant === undefined) {
      return;
    }

    const mapped =
      mapParticipants([
        participant,
      ]);

    if (mapped.length === 0) {
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

        if (existingIndex === -1) {
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

    const data = unwrapPayload(payload);

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
     * This event is intentionally informational.
     *
     * We do NOT use it to set the contestant's local selected
     * answer because the local UI selection must come from the
     * contestant's own click.
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

    const data = unwrapPayload(payload);

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

    setSubmittingAnswer(false);

    addFeedEvent(
      "answer_result",
      payload,
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

    const data = unwrapPayload(payload);

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

    handleSocketError,
  };
}
