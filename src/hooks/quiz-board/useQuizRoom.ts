




"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  QuizCompetition,
  QuizRoom,
} from "@/lib/quiz-board/waiting-room/types";

import {
  extractQuiz,
  extractRoom,
  getApiErrorMessage,
  getQuizRoomId,
  getRoomId,
} from "@/lib/quiz-board/waiting-room/helpers";

import {
  getQuizById,
} from "@/lib/api/quizCompetition";

import {
  getQuizSocket,
} from "@/lib/socket/quizSocket";


/* ============================================================
   CONFIGURATION
   ============================================================ */

/*
 * Quiz metadata changes relatively slowly.
 *
 * Room state does NOT use polling.
 *
 * Room state comes exclusively from Socket.IO.
 */
const QUIZ_POLLING_INTERVAL = 60_000;


/* ============================================================
   OPTIONS
   ============================================================ */

export interface UseQuizRoomOptions {
  enabled?: boolean;

  /*
   * Poll quiz metadata.
   *
   * Default: true
   */
  pollQuiz?: boolean;

  /*
   * Kept for backwards compatibility with existing callers.
   *
   * IMPORTANT:
   *
   * This option no longer starts REST room polling.
   *
   * Room state is Socket.IO driven.
   */
  pollRoom?: boolean;
}


/* ============================================================
   RETURN TYPE
   ============================================================ */

export interface UseQuizRoomReturn {
  quiz: QuizCompetition | null;

  room: QuizRoom | null;

  loading: boolean;

  refreshing: boolean;

  error: string;

  quizLoading: boolean;

  roomLoading: boolean;

  quizError: string;

  roomError: string;

  roomId: string | null;

  loadQuiz: (options?: {
    silent?: boolean;
  }) => Promise<QuizCompetition | null>;

  /*
   * IMPORTANT:
   *
   * loadRoom no longer performs a REST request.
   *
   * It returns the current Socket.IO room state when
   * available.
   */
  loadRoom: (
    explicitRoomId?: string | null,
    options?: {
      silent?: boolean;
    },
  ) => Promise<QuizRoom | null>;

  refresh: () => Promise<void>;

  setQuiz: Dispatch<
    SetStateAction<QuizCompetition | null>
  >;

  setRoom: Dispatch<
    SetStateAction<QuizRoom | null>
  >;
}


/* ============================================================
   ROOM ID RESOLUTION
   ============================================================ */

function resolveRoomId(
  room: QuizRoom | null,
  quiz: QuizCompetition | null,
): string | null {
  /*
   * Prefer the actual live room state.
   */
  const roomId = getRoomId(room);

  if (roomId) {
    return roomId;
  }

  /*
   * Fall back to room_id stored in quiz metadata.
   */
  const quizRoomId = getQuizRoomId(quiz);

  return quizRoomId || null;
}


/* ============================================================
   SOCKET ROOM STATE EXTRACTION
   ============================================================ */

/*
 * Socket.IO may send room_state in slightly different
 * envelope formats depending on the backend.
 *
 * Examples:
 *
 *   room_state
 *   {
 *     roomId: "...",
 *     quizId: "...",
 *     ...
 *   }
 *
 * or:
 *
 *   room_state
 *   {
 *     data: {
 *       roomId: "...",
 *       ...
 *     }
 *   }
 *
 * extractRoom() already exists in your waiting-room helpers,
 * so we use that as the single normalization point.
 */
function extractSocketRoom(
  payload: unknown,
): QuizRoom | null {
  try {
    return extractRoom(payload);
  } catch (error) {
    console.error(
      "[useQuizRoom] Failed to extract room_state:",
      error,
    );

    return null;
  }
}


/* ============================================================
   HOOK
   ============================================================ */

export default function useQuizRoom(
  quizId: string,
  options: UseQuizRoomOptions = {},
): UseQuizRoomReturn {
  const {
    enabled = true,
    pollQuiz = true,

    /*
     * This remains accepted so existing components do not
     * break if they still pass pollRoom.
     *
     * It is intentionally NOT used to perform REST polling.
     */
    pollRoom: _pollRoom = true,
  } = options;


  /* ==========================================================
     STATE
     ========================================================== */

  const [quiz, setQuiz] =
    useState<QuizCompetition | null>(null);

  const [room, setRoom] =
    useState<QuizRoom | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [roomLoading, setRoomLoading] =
    useState(false);

  const [quizError, setQuizError] =
    useState("");

  const [roomError, setRoomError] =
    useState("");


  /* ==========================================================
     REFS
     ========================================================== */

  const mountedRef =
    useRef(true);

  const quizRef =
    useRef<QuizCompetition | null>(null);

  const roomRef =
    useRef<QuizRoom | null>(null);

  const quizRequestInFlightRef =
    useRef(false);

  /*
   * This is no longer an HTTP request lock.
   *
   * It only protects against unnecessary simultaneous
   * room-state initialization.
   */
  const roomStateProcessingRef =
    useRef(false);


  /* ==========================================================
     MOUNT / UNMOUNT
     ========================================================== */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);


  /* ==========================================================
     KEEP REFS SYNCHRONIZED
     ========================================================== */

  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);


  useEffect(() => {
    roomRef.current = room;
  }, [room]);


  /* ==========================================================
     LOAD QUIZ METADATA
     ========================================================== */

  const loadQuiz = useCallback(
    async ({
      silent = false,
    }: {
      silent?: boolean;
    } = {}): Promise<QuizCompetition | null> => {
      if (!enabled || !quizId) {
        return null;
      }

      /*
       * Prevent duplicate metadata requests.
       */
      if (quizRequestInFlightRef.current) {
        return quizRef.current;
      }

      quizRequestInFlightRef.current = true;

      if (
        !silent &&
        mountedRef.current
      ) {
        setQuizLoading(true);
        setQuizError("");
      }

      try {
        /*
         * REST is still correct here.
         *
         * This is QUIZ METADATA, not live room state.
         */
        const payload =
          await getQuizById(quizId);

        const nextQuiz =
          extractQuiz(payload);

        if (!nextQuiz) {
          throw new Error(
            "The quiz response did not contain valid quiz data.",
          );
        }

        if (mountedRef.current) {
          setQuiz(nextQuiz);
          setQuizError("");
          setError("");
        }

        return nextQuiz;
      } catch (requestError) {
        const message =
          getApiErrorMessage(
            requestError,
            "Failed to load quiz.",
          );

        if (mountedRef.current) {
          setQuizError(message);
          setError(message);
        }

        return null;
      } finally {
        quizRequestInFlightRef.current =
          false;

        if (
          !silent &&
          mountedRef.current
        ) {
          setQuizLoading(false);
        }
      }
    },
    [
      enabled,
      quizId,
    ],
  );


  /* ==========================================================
     LOAD ROOM
     ==========================================================

     IMPORTANT:

     THERE IS NO AXIOS REQUEST HERE.

     Before:

       GET /quiz/room-state/{roomId}

     Now:

       Socket.IO -> room_state -> setRoom()

     This function is retained because existing components may
     already call loadRoom().
     ========================================================== */

  const loadRoom = useCallback(
    async (
      explicitRoomId?: string | null,
      {
        silent = false,
      }: {
        silent?: boolean;
      } = {},
    ): Promise<QuizRoom | null> => {
      if (!enabled || !quizId) {
        return null;
      }

      const currentRoomId =
        String(
          explicitRoomId ||
            resolveRoomId(
              roomRef.current,
              quizRef.current,
            ) ||
            "",
        ).trim();

      /*
       * No room exists yet.
       */
      if (!currentRoomId) {
        if (
          !silent &&
          mountedRef.current
        ) {
          setRoomLoading(false);
        }

        return null;
      }

      /*
       * The room is now owned by Socket.IO.
       *
       * If we already have the room state for this room,
       * simply return it.
       */
      const existingRoom =
        roomRef.current;

      const existingRoomId =
        getRoomId(existingRoom);

      if (
        existingRoom &&
        existingRoomId === currentRoomId
      ) {
        if (
          !silent &&
          mountedRef.current
        ) {
          setRoomLoading(false);
        }

        return existingRoom;
      }

      /*
       * We do not make an HTTP request here.
       *
       * Socket.IO will deliver:
       *
       *   room_state
       *
       * and the room_state listener below will call
       * setRoom().
       *
       * We therefore return the current room if one exists.
       */
      if (
        !silent &&
        mountedRef.current
      ) {
        setRoomLoading(false);
      }

      return existingRoom ?? null;
    },
    [
      enabled,
      quizId,
    ],
  );


  /* ==========================================================
     SOCKET.IO ROOM STATE
     ========================================================== */

  useEffect(() => {
    if (
      !enabled ||
      !quizId
    ) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * getQuizSocket() returns your existing singleton.
     *
     * We are NOT creating another Socket.IO connection.
     */
    const socket =
      getQuizSocket();


    /*
     * Handle authoritative live room state.
     */
    const handleRoomState =
      (payload: unknown) => {
        console.log(
          "[useQuizRoom] room_state received:",
          payload,
        );

        const nextRoom =
          extractSocketRoom(payload);

        if (!nextRoom) {
          console.warn(
            "[useQuizRoom] room_state did not contain valid room data.",
            payload,
          );

          return;
        }

        /*
         * Make sure the room belongs to this quiz.
         *
         * We allow the quiz ID to be absent because some
         * backend room-state payloads may not include it.
         */
        const roomQuizId =
          String(
            (
              nextRoom as unknown as Record<
                string,
                unknown
              >
            ).quizId ??
              (
                nextRoom as unknown as Record<
                  string,
                  unknown
                >
              ).quiz_id ??
              "",
          ).trim();

        if (
          roomQuizId &&
          roomQuizId !== quizId
        ) {
          console.warn(
            "[useQuizRoom] Ignoring room_state for another quiz:",
            {
              expectedQuizId: quizId,
              receivedQuizId: roomQuizId,
            },
          );

          return;
        }

        const nextRoomId =
          getRoomId(nextRoom);

        if (!nextRoomId) {
          console.warn(
            "[useQuizRoom] room_state did not contain a room ID.",
            nextRoom,
          );

          return;
        }

        if (!mountedRef.current) {
          return;
        }

        /*
         * Socket.IO is now the authoritative source.
         */
        roomStateProcessingRef.current =
          true;

        setRoom(
          nextRoom,
        );

        setRoomError("");

        setError("");

        setRoomLoading(false);

        /*
         * Keep the ref immediately synchronized.
         *
         * This avoids waiting for React's state effect before
         * another socket event arrives.
         */
        roomRef.current =
          nextRoom;

        console.log(
          "[useQuizRoom] Room state updated from Socket.IO:",
          {
            quizId,
            roomId: nextRoomId,
            room: nextRoom,
          },
        );
      };


    /*
     * Subscribe ONLY to room_state.
     *
     * Other socket events are handled by their respective
     * controllers/hooks.
     */
    socket.on(
      "room_state",
      handleRoomState,
    );


    /*
     * Cleanup only our listener.
     *
     * DO NOT use removeAllListeners().
     */
    return () => {
      socket.off(
        "room_state",
        handleRoomState,
      );
    };
  }, [
    enabled,
    quizId,
  ]);


  /* ==========================================================
     REFRESH
     ========================================================== */

  const refresh = useCallback(
    async (): Promise<void> => {
      if (
        !enabled ||
        !quizId
      ) {
        return;
      }

      if (mountedRef.current) {
        setRefreshing(true);
        setError("");
      }

      try {
        /*
         * Refresh only quiz metadata through REST.
         *
         * Room state is NOT fetched here.
         */
        await loadQuiz();

        /*
         * There is deliberately no:
         *
         *   await loadRoom(...)
         *
         * REST room-state no longer exists.
         *
         * The socket continues to provide the latest
         * room_state.
         */
      } finally {
        if (mountedRef.current) {
          setRefreshing(false);
        }
      }
    },
    [
      enabled,
      quizId,
      loadQuiz,
    ],
  );


  /* ==========================================================
     INITIALIZATION
     ========================================================== */

  useEffect(() => {
    if (
      !enabled ||
      !quizId
    ) {
      if (mountedRef.current) {
        setLoading(false);
      }

      return;
    }

    let cancelled = false;

    const initialize =
      async () => {
        if (mountedRef.current) {
          setLoading(true);
          setError("");
        }

        /*
         * Load quiz metadata.
         */
        await loadQuiz();

        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        /*
         * IMPORTANT:
         *
         * We DO NOT load room through REST.
         *
         * Socket.IO owns room state.
         *
         * getQuizSocket() has already been attached through
         * the room_state effect.
         */

        if (mountedRef.current) {
          setRoomLoading(false);
          setLoading(false);
        }
      };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    quizId,
    loadQuiz,
  ]);


  /* ==========================================================
     QUIZ METADATA POLLING
     ========================================================== */

  useEffect(() => {
    if (
      !enabled ||
      !quizId ||
      !pollQuiz
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          void loadQuiz({
            silent: true,
          });
        },
        QUIZ_POLLING_INTERVAL,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    enabled,
    quizId,
    pollQuiz,
    loadQuiz,
  ]);


  /* ==========================================================
     QUIZ ROOM ID CHANGES
     ========================================================== */

  /*
   * Quiz metadata can acquire a room_id after the quiz was
   * initially loaded.
   *
   * We do NOT fetch that room.
   *
   * The existence of the room ID simply tells the rest of the
   * application which Socket.IO room it should use.
   */
  useEffect(() => {
    if (
      !enabled ||
      !quizId ||
      !quiz
    ) {
      return;
    }

    const nextRoomId =
      resolveRoomId(
        roomRef.current,
        quiz,
      );

    if (!nextRoomId) {
      return;
    }

    const currentRoomId =
      getRoomId(
        roomRef.current,
      );

    /*
     * If the socket has already delivered this room,
     * there is nothing to do.
     */
    if (
      currentRoomId ===
      nextRoomId
    ) {
      return;
    }

    /*
     * We intentionally DO NOT call:
     *
     *   loadRoom(nextRoomId)
     *
     * because that would imply a REST room-state request.
     *
     * The socket room lifecycle is responsible for delivering
     * room_state.
     */
  }, [
    enabled,
    quizId,
    quiz,
  ]);


  /* ==========================================================
     CLEAR STATE WHEN DISABLED
     ========================================================== */

  useEffect(() => {
    if (enabled) {
      return;
    }

    setQuiz(null);

    setRoom(null);

    setLoading(false);

    setRefreshing(false);

    setError("");

    setQuizError("");

    setRoomError("");

    setQuizLoading(false);

    setRoomLoading(false);

    quizRef.current = null;

    roomRef.current = null;

    roomStateProcessingRef.current =
      false;
  }, [
    enabled,
  ]);


  /* ==========================================================
     CURRENT ROOM ID
     ========================================================== */

  const roomId =
    resolveRoomId(
      room,
      quiz,
    );


  /* ==========================================================
     RETURN
     ========================================================== */

  return {
    quiz,

    room,

    loading:
      loading ||
      (!quiz && quizLoading),

    refreshing,

    error,

    quizLoading,

    roomLoading,

    quizError,

    roomError,

    roomId,

    loadQuiz,

    loadRoom,

    refresh,

    setQuiz,

    setRoom,
  };
}