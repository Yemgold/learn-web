



// C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\useQuizSocket.ts

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Socket } from "socket.io-client";

import {
  getQuizSocket,
} from "@/lib/socket/quizSocket";

import type {
  QuizGameRole,
} from "@/types/quiz-board/quiz-role";

import type {
  HostParticipant,
} from "@/components/quiz-board/host/HostParticipantPanel";

import type {
  HostLeaderboardEntry,
} from "@/components/quiz-board/host/HostLeaderboardPanel";

import type {
  HostQuestionPreviewQuestion,
} from "@/components/quiz-board/host/HostQuestionPreview";

import {
  useQuizSocketActions,
} from "./useQuizSocketActions";

import type {
  LiveQuestion,
  QuizFeedEvent,
  QuizRoomDocument,
  SocketPayload,
  UseQuizSocketOptions,
  UseQuizSocketResult,
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

export type {
  LiveQuestion,
  QuizFeedEvent,
  QuizRoomDocument,
  UseQuizSocketOptions,
  UseQuizSocketResult,
} from "./quizSocketTypes";

/* ============================================================
 * HELPERS
 * ========================================================== */

function isObject(
  value: unknown,
): value is SocketPayload {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function extractParticipants(
  data: SocketPayload,
): unknown[] {
  const candidates = [
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

function extractLeaderboard(
  data: SocketPayload,
): unknown[] {
  const candidates = [
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

/* ============================================================
 * HOOK
 * ========================================================== */

export default function useQuizSocket(
  options: UseQuizSocketOptions,
): UseQuizSocketResult {
  const {
    quizId,
    roomId,
    role,
    currentRound,
    initialRound,
    onRoundChanged,
    selectedQuestion,
    timeLimit: initialTimeLimit,
  } = options;

  /* ==========================================================
   * INITIAL VALUES
   * ======================================================== */

  const initialResolvedRound =
    currentRound ??
    initialRound ??
    0;

  const initialResolvedTimeLimit =
    initialTimeLimit ??
    30;

  /* ==========================================================
   * STATE
   * ======================================================== */

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    roomJoined,
    setRoomJoined,
  ] = useState(false);

  const [
    roomActivated,
    setRoomActivated,
  ] = useState(false);

  const [
    roomDoc,
    setRoomDoc,
  ] = useState<QuizRoomDocument | null>(
    null,
  );

  const [
    socketCurrentRound,
    setSocketCurrentRound,
  ] = useState<number>(
    initialResolvedRound,
  );

  const [
    question,
    setQuestion,
  ] = useState<LiveQuestion | null>(
    null,
  );

  const [
    currentQuestionNumber,
    setCurrentQuestionNumber,
  ] = useState<number | null>(
    null,
  );

  const [
    questionStarted,
    setQuestionStarted,
  ] = useState(false);

  const [
    questionLocked,
    setQuestionLocked,
  ] = useState(false);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<string | null>(
    null,
  );

  const [
    answerSubmitted,
    setAnswerSubmitted,
  ] = useState(false);

  const [
    submittingAnswer,
    setSubmittingAnswer,
  ] = useState(false);

  const [
    participants,
    setParticipants,
  ] = useState<HostParticipant[]>(
    [],
  );

  const [
    leaderboard,
    setLeaderboard,
  ] = useState<HostLeaderboardEntry[]>(
    [],
  );

  const [
    feedEvents,
    setFeedEvents,
  ] = useState<QuizFeedEvent[]>(
    [],
  );

  const [
    socketError,
    setSocketError,
  ] = useState<string | null>(
    null,
  );

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    timeLimit,
    setTimeLimit,
  ] = useState<number>(
    initialResolvedTimeLimit,
  );

  /* ==========================================================
   * REFS
   * ======================================================== */

  const socketRef =
    useRef<Socket | null>(null);

  const disposedRef =
    useRef(false);

  const quizIdRef =
    useRef(quizId);

  const roomIdRef =
    useRef(roomId);

  const roleRef =
    useRef<QuizGameRole | null>(
      role,
    );

  const currentRoundRef =
    useRef<number>(
      initialResolvedRound,
    );

  const selectedQuestionRef =
    useRef<
      HostQuestionPreviewQuestion |
      null |
      undefined
    >(selectedQuestion);

  const timeLimitRef =
    useRef<number>(
      initialResolvedTimeLimit,
    );

  const questionRef =
    useRef<LiveQuestion | null>(
      null,
    );

  const onRoundChangedRef =
    useRef(onRoundChanged);

  /* ==========================================================
   * SYNC PROPS -> REFS
   * ======================================================== */

  useEffect(() => {
    quizIdRef.current =
      quizId;
  }, [quizId]);

  useEffect(() => {
    roomIdRef.current =
      roomId;
  }, [roomId]);

  useEffect(() => {
    roleRef.current =
      role;
  }, [role]);

  useEffect(() => {
    selectedQuestionRef.current =
      selectedQuestion;
  }, [selectedQuestion]);

  useEffect(() => {
    onRoundChangedRef.current =
      onRoundChanged;
  }, [onRoundChanged]);

  useEffect(() => {
    if (
      typeof currentRound === "number" &&
      Number.isFinite(currentRound)
    ) {
      currentRoundRef.current =
        currentRound;

      setSocketCurrentRound(
        currentRound,
      );
    }
  }, [currentRound]);

  useEffect(() => {
    if (
      typeof initialRound === "number" &&
      Number.isFinite(initialRound) &&
      typeof currentRound !== "number"
    ) {
      currentRoundRef.current =
        initialRound;

      setSocketCurrentRound(
        initialRound,
      );
    }
  }, [
    currentRound,
    initialRound,
  ]);

  useEffect(() => {
    if (
      typeof initialTimeLimit === "number" &&
      Number.isFinite(initialTimeLimit) &&
      initialTimeLimit > 0
    ) {
      timeLimitRef.current =
        initialTimeLimit;

      setTimeLimit(
        initialTimeLimit,
      );
    }
  }, [initialTimeLimit]);

  /* ==========================================================
   * FEED EVENT
   * ======================================================== */

  const addFeedEvent =
    useCallback(
      (
        type: string,
        payload: unknown,
        message?: string,
      ) => {
        const event =
          makeFeedEvent(
            type,
            payload,
            message,
          );

        setFeedEvents(
          (current) =>
            appendFeedEvent(
              current,
              event,
            ),
        );
      },
      [],
    );

  /* ==========================================================
   * ROUND UPDATE
   * ======================================================== */

  const updateRound =
    useCallback(
      (roundNumber: number) => {
        if (
          !Number.isFinite(roundNumber) ||
          roundNumber < 0
        ) {
          return;
        }

        currentRoundRef.current =
          roundNumber;

        setSocketCurrentRound(
          roundNumber,
        );

        onRoundChangedRef.current?.(
          roundNumber,
        );
      },
      [],
    );

  /* ==========================================================
   * ROOM STATE
   * ======================================================== */

  const handleRoomState =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] ROOM STATE:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const status =
          normalizeStatus(
            data.status ??
              data.roomStatus ??
              data.room_status,
          );

        if (
          status === "IN_PROGRESS"
        ) {
          setRoomActivated(true);
        }

        if (
          status === "WAITING"
        ) {
          setRoomActivated(false);
        }

        const round =
          getNumber(
            data.currentRound ??
              data.current_round ??
              data.roundNumber ??
              data.round_number,
            null,
          );

        if (
          round !== null
        ) {
          updateRound(round);
        }

        const questionData =
          data.question ??
          data.currentQuestion ??
          data.current_question ??
          data.activeQuestion ??
          data.active_question;

        const normalizedQuestion =
          normalizeQuestion(
            questionData ?? data,
          );

        if (
          normalizedQuestion
        ) {
          questionRef.current =
            normalizedQuestion;

          setQuestion(
            normalizedQuestion,
          );

          const questionNumber =
            normalizedQuestion.questionNumber;

          if (
            questionNumber !== null
          ) {
            setCurrentQuestionNumber(
              questionNumber,
            );
          }

          if (
            normalizedQuestion.timeLimit !==
              null &&
            normalizedQuestion.timeLimit >
              0
          ) {
            timeLimitRef.current =
              normalizedQuestion.timeLimit;

            setTimeLimit(
              normalizedQuestion.timeLimit,
            );
          }
        }

        const participantList =
          extractParticipants(
            data,
          );

        if (
          participantList.length > 0
        ) {
          setParticipants(
            mapParticipants(
              participantList,
            ),
          );
        }

        const leaderboardEntries =
          extractLeaderboard(
            data,
          );

        if (
          leaderboardEntries.length > 0
        ) {
          setLeaderboard(
            mapLeaderboard(
              leaderboardEntries,
            ),
          );
        }

        addFeedEvent(
          "room_state",
          payload,
        );
      },
      [
        addFeedEvent,
        updateRound,
      ],
    );

  /* ==========================================================
   * GET ROOM ACK
   *
   * IMPORTANT SOCKET CONTRACT:
   *
   * CLIENT:
   *   get_room_doc
   *
   * SERVER:
   *   get_room_ack
   *
   * The previous implementation listened for
   * "get_room_doc" as the response event.
   * That was incorrect.
   * ======================================================== */

  const handleGetRoomAck =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "==================================================",
        );

        console.log(
          "[Quiz Socket] 📥 GET ROOM ACK:",
          payload,
        );

        console.log(
          "[Quiz Socket] 📥 GET ROOM ACK JSON:",
          JSON.stringify(
            payload,
            null,
            2,
          ),
        );

        console.log(
          "==================================================",
        );

        /* ----------------------------------------------------
         * UNWRAP PAYLOAD
         * -------------------------------------------------- */

        const data =
          unwrapPayload(
            payload,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - UNWRAPPED DATA:",
          data,
        );

        console.log(
          "[Quiz Socket] GET ROOM ACK - UNWRAPPED JSON:",
          JSON.stringify(
            data,
            null,
            2,
          ),
        );

        /* ----------------------------------------------------
         * ROOM ID
         * -------------------------------------------------- */

        const resolvedRoomId =
          getString(
            data.roomId ??
              data.room_id ??
              roomIdRef.current,
            null,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - ROOM ID:",
          resolvedRoomId,
        );

        /* ----------------------------------------------------
         * QUIZ ID
         * -------------------------------------------------- */

        const resolvedQuizId =
          getString(
            data.quizId ??
              data.quiz_id ??
              quizIdRef.current,
            null,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - QUIZ ID:",
          resolvedQuizId,
        );

        /* ----------------------------------------------------
         * ROOM STATUS
         * -------------------------------------------------- */

        const resolvedStatus =
          normalizeStatus(
            data.status ??
              data.roomStatus ??
              data.room_status,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - STATUS:",
          resolvedStatus,
        );

        /* ----------------------------------------------------
         * CURRENT ROUND
         * -------------------------------------------------- */

        const resolvedRound =
          getNumber(
            data.currentRound ??
              data.current_round ??
              data.roundNumber ??
              data.round_number,
            null,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - CURRENT ROUND:",
          resolvedRound,
        );

        /* ----------------------------------------------------
         * CURRENT QUESTION NUMBER
         * -------------------------------------------------- */

        const resolvedQuestionNumber =
          getNumber(
            data.currentQuestionNumber ??
              data.current_question_number ??
              data.questionNumber ??
              data.question_number,
            null,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - QUESTION NUMBER:",
          resolvedQuestionNumber,
        );

        /* ----------------------------------------------------
         * PARTICIPANTS
         * -------------------------------------------------- */

        const participantList =
          extractParticipants(
            data,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - PARTICIPANTS:",
          participantList,
        );

        console.log(
          "[Quiz Socket] GET ROOM ACK - PARTICIPANT COUNT:",
          participantList.length,
        );

        /* ----------------------------------------------------
         * LEADERBOARD
         * -------------------------------------------------- */

        const leaderboardEntries =
          extractLeaderboard(
            data,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - LEADERBOARD:",
          leaderboardEntries,
        );

        console.log(
          "[Quiz Socket] GET ROOM ACK - LEADERBOARD COUNT:",
          leaderboardEntries.length,
        );

        /* ----------------------------------------------------
         * NORMALIZE PARTICIPANTS
         * -------------------------------------------------- */

        const normalizedParticipants =
          mapParticipants(
            participantList,
          );

        /* ----------------------------------------------------
         * NORMALIZE LEADERBOARD
         * -------------------------------------------------- */

        const normalizedLeaderboard =
          mapLeaderboard(
            leaderboardEntries,
          );

        /* ----------------------------------------------------
         * NORMALIZED ROOM DOCUMENT
         * -------------------------------------------------- */

        const normalizedRoomDoc: QuizRoomDocument =
          {
            ...data,

            roomId:
              resolvedRoomId,

            quizId:
              resolvedQuizId,

            status:
              resolvedStatus,

            currentRound:
              resolvedRound,

            currentQuestionNumber:
              resolvedQuestionNumber,

            participants:
              normalizedParticipants,

            leaderboard:
              normalizedLeaderboard,
          };

        console.log(
          "[Quiz Socket] GET ROOM ACK - NORMALIZED ROOM DOC:",
          normalizedRoomDoc,
        );

        console.log(
          "[Quiz Socket] GET ROOM ACK - NORMALIZED ROOM DOC JSON:",
          JSON.stringify(
            normalizedRoomDoc,
            null,
            2,
          ),
        );

        /* ----------------------------------------------------
         * UPDATE ROOM DOCUMENT
         * -------------------------------------------------- */

        setRoomDoc(
          normalizedRoomDoc,
        );

        /* ----------------------------------------------------
         * ROOM ACTIVATION STATUS
         * -------------------------------------------------- */

        if (
          resolvedStatus ===
          "IN_PROGRESS"
        ) {
          console.log(
            "[Quiz Socket] GET ROOM ACK - ROOM IS ACTIVE",
          );

          setRoomActivated(
            true,
          );
        }

        if (
          resolvedStatus ===
          "WAITING"
        ) {
          console.log(
            "[Quiz Socket] GET ROOM ACK - ROOM IS WAITING",
          );

          setRoomActivated(
            false,
          );
        }

        /* ----------------------------------------------------
         * UPDATE ROUND
         * -------------------------------------------------- */

        if (
          resolvedRound !== null &&
          resolvedRound >= 0
        ) {
          console.log(
            "[Quiz Socket] GET ROOM ACK - UPDATING ROUND:",
            resolvedRound,
          );

          updateRound(
            resolvedRound,
          );
        }

        /* ----------------------------------------------------
         * UPDATE PARTICIPANTS
         * -------------------------------------------------- */

        if (
          participantList.length > 0
        ) {
          setParticipants(
            normalizedParticipants,
          );
        }

        /* ----------------------------------------------------
         * UPDATE LEADERBOARD
         * -------------------------------------------------- */

        if (
          leaderboardEntries.length > 0
        ) {
          setLeaderboard(
            normalizedLeaderboard,
          );
        }

        /* ----------------------------------------------------
         * UPDATE QUESTION NUMBER
         * -------------------------------------------------- */

        if (
          resolvedQuestionNumber !==
          null
        ) {
          setCurrentQuestionNumber(
            resolvedQuestionNumber,
          );
        }

        /* ----------------------------------------------------
         * ACTIVE QUESTION
         * -------------------------------------------------- */

        const activeQuestion =
          data.question ??
          data.currentQuestion ??
          data.current_question ??
          data.activeQuestion ??
          data.active_question;

        console.log(
          "[Quiz Socket] GET ROOM ACK - ACTIVE QUESTION:",
          activeQuestion,
        );

        /* ----------------------------------------------------
         * NORMALIZE ACTIVE QUESTION
         * -------------------------------------------------- */

        const normalizedQuestion =
          normalizeQuestion(
            activeQuestion,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - NORMALIZED QUESTION:",
          normalizedQuestion,
        );

        /* ----------------------------------------------------
         * UPDATE ACTIVE QUESTION
         * -------------------------------------------------- */

        if (
          normalizedQuestion
        ) {
          questionRef.current =
            normalizedQuestion;

          setQuestion(
            normalizedQuestion,
          );

          if (
            normalizedQuestion.questionNumber !==
            null
          ) {
            console.log(
              "[Quiz Socket] GET ROOM ACK - QUESTION NUMBER FROM QUESTION:",
              normalizedQuestion.questionNumber,
            );

            setCurrentQuestionNumber(
              normalizedQuestion.questionNumber,
            );
          }

          if (
            normalizedQuestion.timeLimit !==
              null &&
            normalizedQuestion.timeLimit >
              0
          ) {
            console.log(
              "[Quiz Socket] GET ROOM ACK - TIME LIMIT:",
              normalizedQuestion.timeLimit,
            );

            timeLimitRef.current =
              normalizedQuestion.timeLimit;

            setTimeLimit(
              normalizedQuestion.timeLimit,
            );
          }
        }

        /* ----------------------------------------------------
         * FEED EVENT
         * -------------------------------------------------- */

        addFeedEvent(
          "get_room_ack",
          payload,
        );

        /* ----------------------------------------------------
         * FINAL SUMMARY
         * -------------------------------------------------- */

        console.log(
          "==================================================",
        );

        console.log(
          "[Quiz Socket] ✅ GET ROOM ACK PROCESSED",
        );

        console.log(
          "[Quiz Socket] Room:",
          resolvedRoomId,
        );

        console.log(
          "[Quiz Socket] Quiz:",
          resolvedQuizId,
        );

        console.log(
          "[Quiz Socket] Status:",
          resolvedStatus,
        );

        console.log(
          "[Quiz Socket] Round:",
          resolvedRound,
        );

        console.log(
          "[Quiz Socket] Question:",
          resolvedQuestionNumber,
        );

        console.log(
          "[Quiz Socket] Participants:",
          participantList.length,
        );

        console.log(
          "[Quiz Socket] Leaderboard:",
          leaderboardEntries.length,
        );

        console.log(
          "[Quiz Socket] Active question:",
          Boolean(
            normalizedQuestion,
          ),
        );

        console.log(
          "==================================================",
        );
      },
      [
        addFeedEvent,
        updateRound,
      ],
    );

  /* ==========================================================
   * CONNECT
   * ======================================================== */

  const handleConnect =
    useCallback(() => {
      if (disposedRef.current) {
        return;
      }

      console.log(
        "[Quiz Socket] CONNECTED",
      );

      setConnected(true);
      setSocketError(null);

      const socket =
        socketRef.current;

      if (
        !socket ||
        !quizIdRef.current ||
        !roomIdRef.current ||
        !roleRef.current
      ) {
        return;
      }

      const payload = {
        quizId:
          quizIdRef.current,

        quiz_id:
          quizIdRef.current,

        roomId:
          roomIdRef.current,

        room_id:
          roomIdRef.current,

        role:
          roleRef.current,

        currentRound:
          currentRoundRef.current,

        roundNumber:
          currentRoundRef.current,

        round_number:
          currentRoundRef.current,
      };

      console.log(
        "[Quiz Socket] JOIN ROOM:",
        payload,
      );

      socket.emit(
        "join_room",
        payload,
      );
    }, []);

  /* ==========================================================
   * DISCONNECT
   * ======================================================== */

  const handleDisconnect =
    useCallback(
      (reason?: string) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] DISCONNECTED:",
          reason,
        );

        setConnected(false);
        setRoomJoined(false);

        setSocketError(
          reason
            ? `Socket disconnected: ${reason}`
            : "Socket disconnected.",
        );
      },
      [],
    );

  /* ==========================================================
   * CONNECT ERROR
   * ======================================================== */

  const handleConnectError =
    useCallback(
      (error: Error) => {
        if (disposedRef.current) {
          return;
        }

        console.error(
          "[Quiz Socket] CONNECT ERROR:",
          error,
        );

        setConnected(false);

        setSocketError(
          error.message ||
            "Unable to connect to quiz server.",
        );
      },
      [],
    );

  /* ==========================================================
 * JOINED ROOM ACK
 *
 * After successful join:
 *
 * HOST:
 *   CLIENT -> get_room_doc
 *   SERVER -> get_room_ack
 *
 * CONTESTANT:
 *   DO NOT request get_room_doc.
 *
 * Contestants receive room/game state through the normal
 * socket events such as:
 *
 *   room_state
 *   room_activated
 *   round_started
 *   question_started
 *   new_question
 *   question_locked
 *   next_question
 *   leaderboard_updated
 *   participant_joined_room
 *   participants_eliminated
 *   answer_result
 *   first_correct
 * ======================================================== */

const handleJoinedRoomAck =
  useCallback(
    (payload: SocketPayload) => {
      if (disposedRef.current) {
        return;
      }

      console.log(
        "[Quiz Socket] JOINED ROOM ACK:",
        payload,
      );

      setRoomJoined(true);
      setSocketError(null);

      addFeedEvent(
        "joined_room_ack",
        payload,
        "Successfully joined the quiz room.",
      );

      /*
       * ------------------------------------------------------
       * CONTESTANT
       * ------------------------------------------------------
       *
       * get_room_doc is HOST-only on the backend.
       *
       * A contestant must NOT request it because the backend
       * will respond with:
       *
       *   401 - You are not the host of this quiz.
       *
       * Contestants receive their state through the normal
       * room/game socket events.
       */
      if (roleRef.current !== "HOST") {
        console.log(
          "[Quiz Socket] Skipping get_room_doc because current role is:",
          roleRef.current,
        );

        return;
      }

      /*
       * ------------------------------------------------------
       * HOST
       * ------------------------------------------------------
       *
       * The host is allowed to request the latest room
       * document after joining.
       */
      const socket =
        socketRef.current;

      if (
        !socket?.connected ||
        !quizIdRef.current ||
        !roomIdRef.current
      ) {
        console.log(
          "[Quiz Socket] Cannot request get_room_doc:",
          {
            connected:
              socket?.connected ?? false,

            quizId:
              quizIdRef.current,

            roomId:
              roomIdRef.current,
          },
        );

        return;
      }

      const payloadToSend = {
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
      };

      console.log(
        "[Quiz Socket] 📤 GET ROOM DOC REQUEST:",
        payloadToSend,
      );

      /*
       * HOST ONLY:
       *
       * CLIENT -> get_room_doc
       * SERVER -> get_room_ack
       */
      socket.emit(
        "get_room_doc",
        payloadToSend,
      );
    },
    [addFeedEvent],
  );

  /* ==========================================================
   * ROOM ACTIVATED
   * ======================================================== */

  const handleRoomActivated =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] ROOM ACTIVATED:",
          payload,
        );

        setRoomActivated(true);
        setSocketError(null);

        addFeedEvent(
          "room_activated",
          payload,
          "Quiz room activated.",
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * ROUND STARTED
   * ======================================================== */

  const handleRoundStarted =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] ROUND STARTED:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const round =
          getNumber(
            data.currentRound ??
              data.current_round ??
              data.roundNumber ??
              data.round_number,
            null,
          );

        if (
          round !== null
        ) {
          updateRound(round);
        }

        setQuestionStarted(false);
        setQuestionLocked(false);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);

        addFeedEvent(
          "round_started",
          payload,
        );
      },
      [
        addFeedEvent,
        updateRound,
      ],
    );

  /* ==========================================================
   * QUESTION STARTED
   * ======================================================== */

  const handleQuestionStarted =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] QUESTION STARTED:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const normalizedQuestion =
          normalizeQuestion(
            data.question ??
              data.currentQuestion ??
              data.current_question ??
              data,
          );

        if (
          normalizedQuestion
        ) {
          questionRef.current =
            normalizedQuestion;

          setQuestion(
            normalizedQuestion,
          );

          if (
            normalizedQuestion.questionNumber !==
            null
          ) {
            setCurrentQuestionNumber(
              normalizedQuestion.questionNumber,
            );
          }

          if (
            normalizedQuestion.timeLimit !==
              null &&
            normalizedQuestion.timeLimit >
              0
          ) {
            timeLimitRef.current =
              normalizedQuestion.timeLimit;

            setTimeLimit(
              normalizedQuestion.timeLimit,
            );
          }
        }

        const questionNumber =
          getNumber(
            data.questionNumber ??
              data.question_number ??
              data.currentQuestionNumber ??
              data.current_question_number,
            null,
          );

        if (
          questionNumber !== null
        ) {
          setCurrentQuestionNumber(
            questionNumber,
          );
        }

        setQuestionStarted(true);
        setQuestionLocked(false);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        setSubmittingAnswer(false);

        addFeedEvent(
          "question_started",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * NEW QUESTION
   * ======================================================== */

  const handleNewQuestion =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] NEW QUESTION:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const normalizedQuestion =
          normalizeQuestion(
            data.question ??
              data.currentQuestion ??
              data.current_question ??
              data,
          );

        if (
          normalizedQuestion
        ) {
          questionRef.current =
            normalizedQuestion;

          setQuestion(
            normalizedQuestion,
          );

          if (
            normalizedQuestion.questionNumber !==
            null
          ) {
            setCurrentQuestionNumber(
              normalizedQuestion.questionNumber,
            );
          }

          if (
            normalizedQuestion.timeLimit !==
              null &&
            normalizedQuestion.timeLimit >
              0
          ) {
            timeLimitRef.current =
              normalizedQuestion.timeLimit;

            setTimeLimit(
              normalizedQuestion.timeLimit,
            );
          }
        }

        setQuestionStarted(false);
        setQuestionLocked(false);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        setSubmittingAnswer(false);

        addFeedEvent(
          "new_question",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * QUESTION LOCKED
   * ======================================================== */

  const handleQuestionLocked =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] QUESTION LOCKED:",
          payload,
        );

        setQuestionLocked(true);

        addFeedEvent(
          "question_locked",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * NEXT QUESTION
   * ======================================================== */

  const handleNextQuestion =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] NEXT QUESTION:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const normalizedQuestion =
          normalizeQuestion(
            data.question ??
              data.currentQuestion ??
              data.current_question ??
              data,
          );

        if (
          normalizedQuestion
        ) {
          questionRef.current =
            normalizedQuestion;

          setQuestion(
            normalizedQuestion,
          );

          if (
            normalizedQuestion.questionNumber !==
            null
          ) {
            setCurrentQuestionNumber(
              normalizedQuestion.questionNumber,
            );
          }

          if (
            normalizedQuestion.timeLimit !==
              null &&
            normalizedQuestion.timeLimit >
              0
          ) {
            timeLimitRef.current =
              normalizedQuestion.timeLimit;

            setTimeLimit(
              normalizedQuestion.timeLimit,
            );
          }
        }

        setQuestionStarted(false);
        setQuestionLocked(false);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        setSubmittingAnswer(false);

        addFeedEvent(
          "next_question",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * PARTICIPANT JOINED
   * ======================================================== */

  const handleParticipantJoined =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] PARTICIPANT JOINED:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const participant =
          data.participant ??
          data.user;

        if (participant) {
          setParticipants(
            (current) => {
              const mapped =
                mapParticipants([
                  participant,
                ]);

              if (
                mapped.length === 0
              ) {
                return current;
              }

              const incoming =
                mapped[0];

              const existingIndex =
                current.findIndex(
                  (item) =>
                    String(
                      item.id,
                    ) ===
                    String(
                      incoming.id,
                    ),
                );

              if (
                existingIndex ===
                -1
              ) {
                return [
                  ...current,
                  incoming,
                ];
              }

              const copy = [
                ...current,
              ];

              copy[
                existingIndex
              ] = incoming;

              return copy;
            },
          );
        }

        addFeedEvent(
          "participant_joined_room",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * LEADERBOARD UPDATED
   * ======================================================== */

  const handleLeaderboardUpdated =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] LEADERBOARD UPDATED:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const entries =
          extractLeaderboard(
            data,
          );

        if (
          entries.length > 0
        ) {
          setLeaderboard(
            mapLeaderboard(
              entries,
            ),
          );
        }

        addFeedEvent(
          "leaderboard_updated",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * PARTICIPANT SELECTED ANSWER
   * ======================================================== */

  const handleParticipantSelectedAnswer =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] PARTICIPANT SELECTED ANSWER:",
          payload,
        );

        addFeedEvent(
          "participant_selected_answer",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * PARTICIPANTS ELIMINATED
   * ======================================================== */

  const handleParticipantsEliminated =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] PARTICIPANTS ELIMINATED:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const entries =
          extractParticipants(
            data,
          );

        if (
          entries.length > 0
        ) {
          setParticipants(
            mapParticipants(
              entries,
            ),
          );
        }

        const leaderboardEntries =
          extractLeaderboard(
            data,
          );

        if (
          leaderboardEntries.length > 0
        ) {
          setLeaderboard(
            mapLeaderboard(
              leaderboardEntries,
            ),
          );
        }

        addFeedEvent(
          "participants_eliminated",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * ANSWER RESULT
   * ======================================================== */

  const handleAnswerResult =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] ANSWER RESULT:",
          payload,
        );

        setSubmittingAnswer(false);

        addFeedEvent(
          "answer_result",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * FIRST CORRECT
   * ======================================================== */

  const handleFirstCorrect =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] FIRST CORRECT:",
          payload,
        );

        addFeedEvent(
          "first_correct",
          payload,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * SOCKET ERROR
   * ======================================================== */

  const handleSocketError =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.error(
          "[Quiz Socket] SOCKET ERROR:",
          payload,
        );

        const data =
          unwrapPayload(
            payload,
          );

        const message =
          getString(
            data.message ??
              data.error ??
              data.errorMessage ??
              data.error_message,
            "Quiz socket error.",
          ) ??
          "Quiz socket error.";

        setSocketError(
          message,
        );

        setActionLoading(false);
        setSubmittingAnswer(false);

        addFeedEvent(
          "socket_error",
          payload,
          message,
        );
      },
      [addFeedEvent],
    );

  /* ==========================================================
   * SOCKET EFFECT
   * ======================================================== */

  useEffect(() => {
    disposedRef.current =
      false;

    if (
      !quizId ||
      !roomId ||
      !role
    ) {
      setConnected(false);
      setRoomJoined(false);

      return;
    }

    const socket =
      getQuizSocket();

    socketRef.current =
      socket;

    /* --------------------------------------------------------
     * EVENT HANDLERS
     * ------------------------------------------------------ */

    const handleJoinedRoom =
      handleJoinedRoomAck;

    /* --------------------------------------------------------
     * REGISTER LISTENERS
     * ------------------------------------------------------ */

    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "disconnect",
      handleDisconnect,
    );

    socket.on(
      "connect_error",
      handleConnectError,
    );

    socket.on(
      "joined_room_ack",
      handleJoinedRoom,
    );

    socket.on(
      "room_state",
      handleRoomState,
    );

    /*
     * IMPORTANT:
     *
     * Outgoing:
     *   get_room_doc
     *
     * Incoming:
     *   get_room_ack
     */
    socket.on(
      "get_room_ack",
      handleGetRoomAck,
    );

    /*
     * Optional compatibility listener.
     *
     * If an older backend version emits get_room_doc
     * as an event as well, this prevents breaking that
     * version. The real response event is get_room_ack.
     */
    socket.on(
      "get_room_doc",
      handleGetRoomAck,
    );

    socket.on(
      "room_activated",
      handleRoomActivated,
    );

    socket.on(
      "round_started",
      handleRoundStarted,
    );

    socket.on(
      "question_started",
      handleQuestionStarted,
    );

    socket.on(
      "new_question",
      handleNewQuestion,
    );

    socket.on(
      "question_locked",
      handleQuestionLocked,
    );

    socket.on(
      "next_question",
      handleNextQuestion,
    );

    socket.on(
      "participant_joined_room",
      handleParticipantJoined,
    );

    socket.on(
      "leaderboard_updated",
      handleLeaderboardUpdated,
    );

    socket.on(
      "participant_selected_answer",
      handleParticipantSelectedAnswer,
    );

    socket.on(
      "participants_eliminated",
      handleParticipantsEliminated,
    );

    socket.on(
      "answer_result",
      handleAnswerResult,
    );

    socket.on(
      "first_correct",
      handleFirstCorrect,
    );

    socket.on(
      "socket_error",
      handleSocketError,
    );

    /* --------------------------------------------------------
     * ALREADY CONNECTED
     * ------------------------------------------------------ */

    if (socket.connected) {
      setConnected(true);

      handleConnect();
    }

    /* --------------------------------------------------------
     * CLEANUP
     * ------------------------------------------------------ */

    return () => {
      disposedRef.current =
        true;

      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      socket.off(
        "joined_room_ack",
        handleJoinedRoom,
      );

      socket.off(
        "room_state",
        handleRoomState,
      );

      socket.off(
        "get_room_ack",
        handleGetRoomAck,
      );

      socket.off(
        "get_room_doc",
        handleGetRoomAck,
      );

      socket.off(
        "room_activated",
        handleRoomActivated,
      );

      socket.off(
        "round_started",
        handleRoundStarted,
      );

      socket.off(
        "question_started",
        handleQuestionStarted,
      );

      socket.off(
        "new_question",
        handleNewQuestion,
      );

      socket.off(
        "question_locked",
        handleQuestionLocked,
      );

      socket.off(
        "next_question",
        handleNextQuestion,
      );

      socket.off(
        "participant_joined_room",
        handleParticipantJoined,
      );

      socket.off(
        "leaderboard_updated",
        handleLeaderboardUpdated,
      );

      socket.off(
        "participant_selected_answer",
        handleParticipantSelectedAnswer,
      );

      socket.off(
        "participants_eliminated",
        handleParticipantsEliminated,
      );

      socket.off(
        "answer_result",
        handleAnswerResult,
      );

      socket.off(
        "first_correct",
        handleFirstCorrect,
      );

      socket.off(
        "socket_error",
        handleSocketError,
      );

      /*
       * IMPORTANT:
       *
       * Do NOT disconnect the singleton socket here.
       *
       * quizSocket.ts owns the actual socket lifecycle.
       */
      if (
        socketRef.current ===
        socket
      ) {
        socketRef.current =
          null;
      }
    };
  }, [
    quizId,
    roomId,
    role,

    handleAnswerResult,
    handleConnect,
    handleConnectError,
    handleDisconnect,
    handleFirstCorrect,
    handleJoinedRoomAck,
    handleLeaderboardUpdated,
    handleNewQuestion,
    handleNextQuestion,
    handleParticipantJoined,
    handleParticipantSelectedAnswer,
    handleParticipantsEliminated,
    handleQuestionLocked,
    handleQuestionStarted,
    handleRoomActivated,
    handleGetRoomAck,
    handleRoomState,
    handleRoundStarted,
    handleSocketError,
  ]);

  /* ==========================================================
   * ACTIONS
   * ======================================================== */

  const actions =
    useQuizSocketActions({
      quizId,

      roomId:
        roomId ?? "",

      currentRoundRef,

      selectedQuestionRef,

      timeLimitRef,

      questionRef,

      setActionLoading,

      setSocketError,

      setQuestionStarted,

      setQuestionLocked,

      setSelectedAnswer,

      setAnswerSubmitted,

      setSubmittingAnswer,
    });

  /* ==========================================================
   * RETURN
   * ======================================================== */

  return {
    connected,

    roomJoined,

    roomActivated,

    roomDoc,

    currentRound:
      socketCurrentRound,

    question,

    currentQuestionNumber,

    questionStarted,

    questionLocked,

    selectedAnswer,

    answerSubmitted,

    submittingAnswer,

    participants,

    leaderboard,

    feedEvents,

    socketError,

    actionLoading,

    timeLimit,

    setTimeLimit,

    setSelectedAnswer,

    startQuestion:
      actions.startQuestion,

    lockQuestion:
      actions.lockQuestion,

    nextQuestion:
      actions.nextQuestion,

    submitAnswer:
      actions.submitAnswer,

    refreshSocketState:
      actions.refreshSocketState,
  };
}
















