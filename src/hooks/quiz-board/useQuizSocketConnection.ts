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
   * This prevents Socket.IO listeners from becoming stale when the
   * main hook state changes.
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

  const handleJoinedRoomAck = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleJoinedRoomAck(
        payload,
      );
    },
    [],
  );

  /*
   * Temporary diagnostic wrapper.
   *
   * This lets us see the EXACT joined_room_ack payload received
   * by the contestant socket before it reaches the normal handler.
   */
  const handleJoinedRoomAckDebug = useCallback(
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

  const handleRoundStarted = useCallback(
    (payload: unknown) => {
      handlersRef.current.handleRoundStarted(
        payload,
      );
    },
    [],
  );

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
   * Temporary diagnostic wrapper for participant_joined_room.
   *
   * This allows us to inspect the exact Socket.IO payload before
   * it reaches useQuizSocketHandlers.
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
     * Do not create a socket connection until all required
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

    /* ------------------------------------------------------------
       Connection lifecycle
    ------------------------------------------------------------ */

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

    /* ------------------------------------------------------------
       Room lifecycle
    ------------------------------------------------------------ */

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
     * event. Keep supporting it exactly as the previous hook did.
     */
    socket.on(
      "get_room_doc",
      handleGetRoomAck,
    );

    socket.on(
      "room_activated",
      handleRoomActivated,
    );

    /* ------------------------------------------------------------
       Round lifecycle
    ------------------------------------------------------------ */

    socket.on(
      "round_started",
      handleRoundStarted,
    );

    /* ------------------------------------------------------------
       Question lifecycle
    ------------------------------------------------------------ */

    socket.on(
      "question_started",
      handleQuestionStarted,
    );

    socket.on(
      "new_question",
      handleNewQuestion,
    );

    /*
     * Keep this as a named listener rather than an anonymous
     * wrapper.
     *
     * This fixes the previous cleanup mismatch where the hook
     * registered an anonymous function but attempted to remove
     * handleNewQuestionDisplayed.
     */
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

    /* ------------------------------------------------------------
       Participant lifecycle
    ------------------------------------------------------------ */

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

    /* ------------------------------------------------------------
       Answer lifecycle
    ------------------------------------------------------------ */

    socket.on(
      "answer_result",
      handleAnswerResult,
    );

    socket.on(
      "first_correct",
      handleFirstCorrect,
    );

    /* ------------------------------------------------------------
       Generic socket errors
    ------------------------------------------------------------ */

    socket.on(
      "socket_error",
      handleSocketError,
    );

    /* ------------------------------------------------------------
       Already connected
    ------------------------------------------------------------ */

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
       * Do not disconnect the shared socket here.
       *
       * getQuizSocket() maintains a shared Socket.IO instance that
       * can also be used by the host/admin portions of the Quiz
       * Board.
       *
       * We only remove the listeners owned by this hook.
       */
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