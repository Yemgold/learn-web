"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import type { Socket } from "socket.io-client";

import { getQuizSocket } from "@/lib/socket/quizSocket";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import type {
  QuizSocketHandlerContext,
} from "./useQuizSocketHandlers";

/* ================================================================
   TYPES
================================================================ */

export interface QuizSocketConnectionOptions {
  quizId: string;
  roomId: string | null;
  role: QuizGameRole | null;

  handlers: ReturnType<
    typeof import("./useQuizSocketHandlers").createQuizSocketHandlers
  >;

  handlerContext: QuizSocketHandlerContext;

  socketRef: {
    current: Socket | null;
  };

  disposedRef: {
    current: boolean;
  };

  setConnected: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  setRoomJoined: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  setSocketError: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

/* ================================================================
   CONNECTION HOOK
================================================================ */

export function useQuizSocketConnection(
  options: QuizSocketConnectionOptions,
): void {
  const {
    quizId,
    roomId,
    role,

    handlers,

    socketRef,
    disposedRef,

    setConnected,
    setRoomJoined,
    setSocketError,
  } = options;

  /*
   * Keep the latest handlers in a ref.
   *
   * Socket.IO listeners remain stable while the stateful handlers
   * can change on every render.
   */
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  /* ==============================================================
     STABLE CONNECTION CALLBACKS
  ============================================================== */

  const handleConnect = useCallback(() => {
    handlersRef.current.handleConnect();
  }, []);

  const handleDisconnect = useCallback(
    (reason: string) => {
      handlersRef.current.handleDisconnect(
        reason,
      );
    },
    [],
  );

  const handleConnectError = useCallback(
    (error: Error) => {
      handlersRef.current.handleConnectError(
        error,
      );
    },
    [],
  );

  /* ==============================================================
     ROOM CALLBACKS
  ============================================================== */

  const handleJoinedRoomAck = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleJoinedRoomAck(
        payload,
      );
    },
    [],
  );

  /*
   * Diagnostic wrapper.
   *
   * This shows the exact payload received from Socket.IO before
   * forwarding it to useQuizSocketHandlers.
   */
  const handleJoinedRoomAckDebug =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[RAW SOCKET] joined_room_ack RECEIVED:",
          payload,
        );

        try {
          console.log(
            "[RAW SOCKET] joined_room_ack JSON:",
            JSON.stringify(payload),
          );
        } catch {
          // Ignore serialization errors.
        }

        handleJoinedRoomAck(payload);
      },
      [handleJoinedRoomAck],
    );

  const handleRoomState = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleRoomState(
        payload,
      );
    },
    [],
  );

  const handleGetRoomAck = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleGetRoomAck(
        payload,
      );
    },
    [],
  );

  const handleRoomActivated = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleRoomActivated(
        payload,
      );
    },
    [],
  );

  /* ==============================================================
     ROUND CALLBACKS
  ============================================================== */

  const handleRoundStarted = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleRoundStarted(
        payload,
      );
    },
    [],
  );

  /* ==============================================================
     QUESTION CALLBACKS
  ============================================================== */

  const handleQuestionStarted = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleQuestionStarted(
        payload,
      );
    },
    [],
  );

  const handleNewQuestion = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleNewQuestion(
        payload,
      );
    },
    [],
  );

  const handleNewQuestionDisplayed =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleNewQuestionDisplayed(
          payload,
        );
      },
      [],
    );

  const handleQuestionDisplayed =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleQuestionDisplayed(
          payload,
        );
      },
      [],
    );

  const handleQuestionLocked =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleQuestionLocked(
          payload,
        );
      },
      [],
    );

  const handleNextQuestion =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleNextQuestion(
          payload,
        );
      },
      [],
    );

  /* ==============================================================
     PARTICIPANT CALLBACKS
  ============================================================== */

  const handleParticipantJoined =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleParticipantJoined(
          payload,
        );
      },
      [],
    );

  /*
   * Diagnostic wrapper for participant_joined_room.
   *
   * IMPORTANT:
   * Socket.IO event payloads may contain more than one argument.
   * Capture all arguments so we can see the exact event shape.
   */
  const handleParticipantJoinedDebug =
    useCallback(
      (...args: unknown[]) => {
        console.log(
          "[RAW SOCKET] participant_joined_room ARGUMENT COUNT:",
          args.length,
        );

        console.log(
          "[RAW SOCKET] participant_joined_room ALL ARGS:",
          args,
        );

        try {
          console.log(
            "[RAW SOCKET] participant_joined_room ALL ARGS JSON:",
            JSON.stringify(args),
          );
        } catch {
          // Ignore serialization errors.
        }

        const payload =
          args.length === 1
            ? args[0]
            : args;

        console.log(
          "[RAW SOCKET] participant_joined_room PAYLOAD:",
          payload,
        );

        try {
          console.log(
            "[RAW SOCKET] participant_joined_room PAYLOAD JSON:",
            JSON.stringify(payload),
          );
        } catch {
          // Ignore serialization errors.
        }

        handlersRef.current.handleParticipantJoined(
          payload,
        );
      },
      [],
    );

  const handleLeaderboardUpdated =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleLeaderboardUpdated(
          payload,
        );
      },
      [],
    );

  const handleParticipantSelectedAnswer =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleParticipantSelectedAnswer(
          payload,
        );
      },
      [],
    );

  const handleParticipantsEliminated =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleParticipantsEliminated(
          payload,
        );
      },
      [],
    );

  /* ==============================================================
     ANSWER CALLBACKS
  ============================================================== */

  const handleAnswerResult =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleAnswerResult(
          payload,
        );
      },
      [],
    );

  const handleFirstCorrect =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleFirstCorrect(
          payload,
        );
      },
      [],
    );

  /* ==============================================================
     ERROR CALLBACK
  ============================================================== */

  const handleSocketError =
    useCallback(
      (payload: unknown) => {
        handlersRef.current.handleSocketError(
          payload,
        );
      },
      [],
    );

  /* ==============================================================
     SOCKET CONNECTION EFFECT
  ============================================================== */

  useEffect(() => {
    disposedRef.current = false;

    /*
     * Do not create/register the quiz socket until all required
     * identifiers are available.
     */
    if (
      !quizId ||
      !roomId ||
      !role
    ) {
      setConnected(false);
      setRoomJoined(false);

      return;
    }

    const socket = getQuizSocket();

    socketRef.current = socket;


    /* ============================================================
   DEBUG ALL INCOMING SOCKET EVENTS
============================================================ */

const handleAnyIncomingEvent = (
  event: string,
  ...args: unknown[]
) => {
  console.log(
    "[RAW SOCKET] INCOMING EVENT:",
    event,
    args,
  );

  if (event === "answer_result") {
    console.log(
      "[RAW SOCKET] ⭐ ANSWER_RESULT RECEIVED:",
      args,
    );

    try {
      console.log(
        "[RAW SOCKET] ⭐ ANSWER_RESULT JSON:",
        JSON.stringify(args),
      );
    } catch {
      // Ignore serialization errors.
    }
  }
};

socket.onAny(handleAnyIncomingEvent);

    /* ============================================================
       CONNECTION LIFECYCLE
    ============================================================ */

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

    /* ============================================================
       ROOM LIFECYCLE
    ============================================================ */

    socket.on(
      "joined_room_ack",
      handleJoinedRoomAckDebug,
    );

    socket.on(
      "room_state",
      handleRoomState,
    );

    socket.on(
      "get_room_ack",
      handleGetRoomAck,
    );

    /*
     * Some backend versions may emit get_room_doc as the response
     * event. Keep supporting it.
     */
    socket.on(
      "get_room_doc",
      handleGetRoomAck,
    );

    socket.on(
      "room_activated",
      handleRoomActivated,
    );

    /* ============================================================
       ROUND LIFECYCLE
    ============================================================ */

    socket.on(
      "round_started",
      handleRoundStarted,
    );

    /* ============================================================
       QUESTION LIFECYCLE
    ============================================================ */

    socket.on(
      "question_started",
      handleQuestionStarted,
    );

    socket.on(
      "new_question",
      handleNewQuestion,
    );

    socket.on(
      "new_question_displayed",
      handleNewQuestionDisplayed,
    );

    socket.on(
      "question_displayed",
      handleQuestionDisplayed,
    );

    socket.on(
      "question_locked",
      handleQuestionLocked,
    );

    socket.on(
      "next_question",
      handleNextQuestion,
    );

    /* ============================================================
       PARTICIPANT LIFECYCLE
    ============================================================ */

    socket.on(
      "participant_joined_room",
      handleParticipantJoinedDebug,
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

    /* ============================================================
       ANSWER LIFECYCLE
    ============================================================ */

    socket.on(
      "answer_result",
      handleAnswerResult,
    );

    socket.on(
      "first_correct",
      handleFirstCorrect,
    );

    /* ============================================================
       GENERIC SOCKET ERRORS
    ============================================================ */

    socket.on(
      "socket_error",
      handleSocketError,
    );

    /* ============================================================
       ALREADY CONNECTED
    ============================================================ */

    if (socket.connected) {
      setConnected(true);

      handleConnect();
    }

    /* ============================================================
       CLEANUP
    ============================================================ */

    return () => {
      disposedRef.current = true;

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
        handleJoinedRoomAckDebug,
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
        "new_question_displayed",
        handleNewQuestionDisplayed,
      );

      socket.off(
        "question_displayed",
        handleQuestionDisplayed,
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
        handleParticipantJoinedDebug,
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
       * Do not disconnect the shared Socket.IO instance here.
       *
       * getQuizSocket() provides a shared connection that may also
       * be used by other Quiz Board parts.
       *
       * Only remove listeners owned by this hook.
       */
    socket.offAny(
  handleAnyIncomingEvent,
);



      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [
    quizId,
    roomId,
    role,

    disposedRef,
    socketRef,

    setConnected,
    setRoomJoined,

    handleConnect,
    handleDisconnect,
    handleConnectError,

    handleJoinedRoomAck,
    handleJoinedRoomAckDebug,

    handleRoomState,
    handleGetRoomAck,
    handleRoomActivated,

    handleRoundStarted,

    handleQuestionStarted,
    handleNewQuestion,
    handleNewQuestionDisplayed,
    handleQuestionDisplayed,
    handleQuestionLocked,
    handleNextQuestion,

    handleParticipantJoined,
    handleParticipantJoinedDebug,
    handleLeaderboardUpdated,
    handleParticipantSelectedAnswer,
    handleParticipantsEliminated,

    handleAnswerResult,
    handleFirstCorrect,

    handleSocketError,
  ]);
}