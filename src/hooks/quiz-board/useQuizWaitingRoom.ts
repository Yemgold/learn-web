




"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  QuizCompetition,
  QuizRoom,
} from "@/lib/quiz-board/waiting-room/types";

import {
  extractRoom,
  getApiErrorMessage,
  getQuizRoomId,
  getRoomId,
} from "@/lib/quiz-board/waiting-room/helpers";

import { axiosInstance } from "@/lib";

const ROOM_POLLING_INTERVAL = 10_000;

interface UseQuizRoomOptions {
  enabled?: boolean;
  pollQuiz?: boolean;
  pollRoom?: boolean;

  /**
   * Quiz data already obtained from:
   * GET /quiz/get-all-my-quizzes/{userId}
   */
  initialQuiz?: QuizCompetition | null;
}

interface UseQuizRoomReturn {
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

  loadRoom: (
    explicitRoomId?: string | null,
    options?: {
      silent?: boolean;
    },
  ) => Promise<QuizRoom | null>;

  refresh: () => Promise<void>;

  setQuiz: React.Dispatch<
    React.SetStateAction<QuizCompetition | null>
  >;

  setRoom: React.Dispatch<
    React.SetStateAction<QuizRoom | null>
  >;
}

function getStoredRoomId(
  room: QuizRoom | null,
  quiz: QuizCompetition | null,
): string | null {
  const roomId = getRoomId(room);

  if (roomId) {
    return roomId;
  }

  const quizRoomId = getQuizRoomId(quiz);

  return quizRoomId || null;
}

export default function useQuizRoom(
  quizId: string,
  options: UseQuizRoomOptions = {},
): UseQuizRoomReturn {
  const {
    enabled = true,
    pollQuiz = false,
    pollRoom = true,
    initialQuiz = null,
  } = options;

  const [quiz, setQuiz] =
    useState<QuizCompetition | null>(initialQuiz);

  const [room, setRoom] =
    useState<QuizRoom | null>(null);

  const [loading, setLoading] = useState(
    enabled && !initialQuiz,
  );

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [roomLoading, setRoomLoading] =
    useState(false);

  const [quizError, setQuizError] =
    useState("");

  const [roomError, setRoomError] =
    useState("");

  const quizRef =
    useRef<QuizCompetition | null>(initialQuiz);

  const roomRef =
    useRef<QuizRoom | null>(null);

  const roomRequestInFlightRef =
    useRef(false);

  const mountedRef =
    useRef(true);

  /*
   * Keep refs synchronized with state.
   */
  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  /*
   * Mount tracking.
   */
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /*
   * If the parent supplies a new quiz from
   * get-all-my-quizzes/{userId}, keep our local state synchronized.
   */
  useEffect(() => {
    if (!initialQuiz) {
      return;
    }

    quizRef.current = initialQuiz;

    if (mountedRef.current) {
      setQuiz(initialQuiz);
      setQuizError("");
    }
  }, [initialQuiz]);

  /*
   * There is intentionally NO getQuizById request here.
   *
   * The quiz already comes from:
   *
   * GET /quiz/get-all-my-quizzes/{userId}
   *
   * Therefore loadQuiz simply returns the existing quiz.
   */
  const loadQuiz = useCallback(
    async ({
      silent = false,
    }: {
      silent?: boolean;
    } = {}): Promise<QuizCompetition | null> => {
      if (!enabled || !quizId) {
        return null;
      }

      const currentQuiz = quizRef.current;

      if (!currentQuiz) {
        if (!silent && mountedRef.current) {
          setQuizError(
            "Quiz information is not available from My Competitions.",
          );

          setError(
            "Quiz information is not available from My Competitions.",
          );
        }

        return null;
      }

      if (!silent && mountedRef.current) {
        setQuizError("");
      }

      return currentQuiz;
    },
    [enabled, quizId],
  );

  /*
   * Load live room state.
   *
   * IMPORTANT:
   *
   * Do NOT use:
   *
   * fetch("/api/v1/quiz/room-state/...")
   *
   * because that would target:
   *
   * http://localhost:3000/api/v1/...
   *
   * We use axiosInstance instead so the configured backend baseURL
   * is used:
   *
   * https://mypastquestionsapp.onrender.com/api/v1
   */
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

      const resolvedRoomId = String(
        explicitRoomId ||
          getStoredRoomId(
            roomRef.current,
            quizRef.current,
          ) ||
          "",
      ).trim();

      /*
       * A room may not exist yet.
       *
       * That is not an error.
       */
      if (!resolvedRoomId) {
        return null;
      }

      /*
       * Prevent duplicate requests.
       */
      if (roomRequestInFlightRef.current) {
        return roomRef.current;
      }

      roomRequestInFlightRef.current = true;

      if (!silent && mountedRef.current) {
        setRoomLoading(true);
        setRoomError("");
      }

      try {
        const response =
          await axiosInstance.get(
            `/quiz/room-state/${encodeURIComponent(
              resolvedRoomId,
            )}`,
            {
              params: {
                quizId,
              },
            },
          );

        const payload: unknown =
          response?.data ?? null;

        const nextRoom =
          extractRoom(payload);

        if (!nextRoom) {
          throw new Error(
            "The room response did not contain valid room data.",
          );
        }

        if (mountedRef.current) {
          setRoom(nextRoom);
          setRoomError("");
          setError("");
        }

        return nextRoom;
      } catch (requestError) {
        const message =
          getApiErrorMessage(
            requestError,
            "Failed to load quiz room.",
          );

        if (mountedRef.current) {
          setRoomError(message);
          setError(message);
        }

        return null;
      } finally {
        roomRequestInFlightRef.current = false;

        if (
          !silent &&
          mountedRef.current
        ) {
          setRoomLoading(false);
        }
      }
    },
    [enabled, quizId],
  );

  /*
   * Refresh existing quiz data and room state.
   *
   * The quiz itself is NOT fetched again.
   * It already came from My Competitions.
   */
  const refresh = useCallback(
    async () => {
      if (!enabled || !quizId) {
        return;
      }

      if (mountedRef.current) {
        setRefreshing(true);
        setError("");
      }

      try {
        const currentQuiz =
          await loadQuiz({
            silent: true,
          });

        const resolvedRoomId =
          getStoredRoomId(
            roomRef.current,
            currentQuiz,
          );

        if (resolvedRoomId) {
          await loadRoom(
            resolvedRoomId,
            {
              silent: true,
            },
          );
        }
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
      loadRoom,
    ],
  );

  /*
   * Initial room loading.
   *
   * Quiz data is already available through
   * initialQuiz.
   */
  useEffect(() => {
    if (!enabled || !quizId) {
      if (mountedRef.current) {
        setLoading(false);
      }

      return;
    }

    let cancelled = false;

    const initialize = async () => {
      if (mountedRef.current) {
        setLoading(true);
        setError("");
      }

      const currentQuiz =
        quizRef.current;

      if (!currentQuiz) {
        if (
          !cancelled &&
          mountedRef.current
        ) {
          setLoading(false);
        }

        return;
      }

      const resolvedRoomId =
        getStoredRoomId(
          roomRef.current,
          currentQuiz,
        );

      if (
        resolvedRoomId &&
        !cancelled &&
        mountedRef.current
      ) {
        await loadRoom(
          resolvedRoomId,
          {
            silent: false,
          },
        );
      }

      if (
        !cancelled &&
        mountedRef.current
      ) {
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
    loadRoom,
  ]);

  /*
   * Quiz polling is disabled by default.
   *
   * We already receive the quiz from
   * get-all-my-quizzes/{userId}.
   *
   * If the parent later supplies updated quiz data,
   * initialQuiz synchronization above handles it.
   */
  useEffect(() => {
    if (
      !enabled ||
      !quizId ||
      !pollQuiz
    ) {
      return;
    }

    /*
     * Intentionally left without another
     * getQuizById request.
     *
     * A parent-level refresh of
     * get-all-my-quizzes/{userId}
     * should provide updated quiz data.
     */
  }, [
    enabled,
    quizId,
    pollQuiz,
  ]);

  /*
   * Room polling.
   *
   * Socket.IO is responsible for live updates.
   * This REST polling acts as a recovery mechanism
   * for refreshes, reconnects and missed events.
   */
  useEffect(() => {
    if (
      !enabled ||
      !quizId ||
      !pollRoom
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        const currentRoomId =
          getStoredRoomId(
            roomRef.current,
            quizRef.current,
          );

        if (!currentRoomId) {
          return;
        }

        void loadRoom(
          currentRoomId,
          {
            silent: true,
          },
        );
      }, ROOM_POLLING_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    enabled,
    quizId,
    pollRoom,
    loadRoom,
  ]);

  /*
   * If the quiz receives a room_id later,
   * immediately load that room.
   */
  useEffect(() => {
    if (
      !enabled ||
      !quizId ||
      !quiz
    ) {
      return;
    }

    const resolvedRoomId =
      getStoredRoomId(
        roomRef.current,
        quiz,
      );

    if (!resolvedRoomId) {
      return;
    }

    const currentRoomId =
      getRoomId(roomRef.current);

    if (
      currentRoomId === resolvedRoomId
    ) {
      return;
    }

    void loadRoom(
      resolvedRoomId,
      {
        silent: true,
      },
    );
  }, [
    enabled,
    quizId,
    quiz,
    loadRoom,
  ]);

  const roomId =
    getStoredRoomId(
      room,
      quiz,
    );

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








// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import type {
//   Dispatch,
//   SetStateAction,
// } from "react";

// import type {
//   QuizCompetition,
//   QuizRoom,
// } from "@/lib/quiz-board/waiting-room/types";

// import {
//   getQuizRoomId,
//   getRoomId,
// } from "@/lib/quiz-board/waiting-room/helpers";

// interface UseQuizRoomOptions {
//   enabled?: boolean;
//   pollQuiz?: boolean;
//   pollRoom?: boolean;

//   /**
//    * Quiz data already obtained from:
//    * GET /quiz/get-all-my-quizzes/{userId}
//    */
//   initialQuiz?: QuizCompetition | null;
// }

// interface UseQuizRoomReturn {
//   quiz: QuizCompetition | null;
//   room: QuizRoom | null;

//   loading: boolean;
//   refreshing: boolean;
//   error: string;

//   quizLoading: boolean;
//   roomLoading: boolean;

//   quizError: string;
//   roomError: string;

//   roomId: string | null;

//   loadQuiz: (options?: {
//     silent?: boolean;
//   }) => Promise<QuizCompetition | null>;

//   loadRoom: (
//     explicitRoomId?: string | null,
//     options?: {
//       silent?: boolean;
//     },
//   ) => Promise<QuizRoom | null>;

//   refresh: () => Promise<void>;

//   setQuiz: Dispatch<
//     SetStateAction<QuizCompetition | null>
//   >;

//   setRoom: Dispatch<
//     SetStateAction<QuizRoom | null>
//   >;
// }

// function getStoredRoomId(
//   room: QuizRoom | null,
//   quiz: QuizCompetition | null,
// ): string | null {
//   const roomId = getRoomId(room);

//   if (roomId) {
//     return roomId;
//   }

//   const quizRoomId = getQuizRoomId(quiz);

//   return quizRoomId || null;
// }

// export default function useQuizRoom(
//   quizId: string,
//   options: UseQuizRoomOptions = {},
// ): UseQuizRoomReturn {
//   const {
//     enabled = true,
//     pollQuiz = false,
//     pollRoom = false,
//     initialQuiz = null,
//   } = options;

//   const [quiz, setQuiz] =
//     useState<QuizCompetition | null>(
//       initialQuiz,
//     );

//   const [room, setRoom] =
//     useState<QuizRoom | null>(null);

//   const [loading, setLoading] =
//     useState(
//       enabled && !initialQuiz,
//     );

//   const [refreshing, setRefreshing] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [quizLoading, setQuizLoading] =
//     useState(false);

//   const [roomLoading, setRoomLoading] =
//     useState(false);

//   const [quizError, setQuizError] =
//     useState("");

//   const [roomError, setRoomError] =
//     useState("");

//   const quizRef =
//     useRef<QuizCompetition | null>(
//       initialQuiz,
//     );

//   const roomRef =
//     useRef<QuizRoom | null>(null);

//   const mountedRef =
//     useRef(true);

//   /*
//    * Keep refs synchronized with state.
//    */
//   useEffect(() => {
//     quizRef.current = quiz;
//   }, [quiz]);

//   useEffect(() => {
//     roomRef.current = room;
//   }, [room]);

//   /*
//    * Mount tracking.
//    */
//   useEffect(() => {
//     mountedRef.current = true;

//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   /*
//    * If the parent supplies a new quiz from
//    * get-all-my-quizzes/{userId}, keep local
//    * state synchronized.
//    */
//   useEffect(() => {
//     if (!initialQuiz) {
//       return;
//     }

//     quizRef.current =
//       initialQuiz;

//     if (mountedRef.current) {
//       setQuiz(initialQuiz);
//       setQuizError("");
//       setError("");
//     }
//   }, [initialQuiz]);

//   /*
//    * Load quiz.
//    *
//    * IMPORTANT:
//    *
//    * There is intentionally NO getQuizById()
//    * request here.
//    *
//    * The quiz already comes from:
//    *
//    * GET /quiz/get-all-my-quizzes/{userId}
//    */
//   const loadQuiz = useCallback(
//     async ({
//       silent = false,
//     }: {
//       silent?: boolean;
//     } = {}): Promise<QuizCompetition | null> => {
//       if (
//         !enabled ||
//         !quizId
//       ) {
//         return null;
//       }

//       const currentQuiz =
//         quizRef.current;

//       if (!currentQuiz) {
//         if (
//           !silent &&
//           mountedRef.current
//         ) {
//           const message =
//             "Quiz information is not available from My Competitions.";

//           setQuizError(message);
//           setError(message);
//         }

//         return null;
//       }

//       if (
//         !silent &&
//         mountedRef.current
//       ) {
//         setQuizError("");
//       }

//       return currentQuiz;
//     },
//     [
//       enabled,
//       quizId,
//     ],
//   );

//   /*
//    * Load room.
//    *
//    * IMPORTANT:
//    *
//    * This function DOES NOT call:
//    *
//    * /quiz/room-state/{roomId}
//    *
//    * It also does NOT make any REST request.
//    *
//    * Socket.IO is responsible for room state.
//    *
//    * The room may be null before Socket.IO sends
//    * room_state. That is normal.
//    */
//   const loadRoom = useCallback(
//     async (
//       explicitRoomId?: string | null,
//       {
//         silent = false,
//       }: {
//         silent?: boolean;
//       } = {},
//     ): Promise<QuizRoom | null> => {
//       if (
//         !enabled ||
//         !quizId
//       ) {
//         return null;
//       }

//       const resolvedRoomId =
//         String(
//           explicitRoomId ||
//             getStoredRoomId(
//               roomRef.current,
//               quizRef.current,
//             ) ||
//             "",
//         ).trim();

//       /*
//        * No room has been created yet.
//        *
//        * This is not an error.
//        */
//       if (!resolvedRoomId) {
//         if (
//           !silent &&
//           mountedRef.current
//         ) {
//           setRoomLoading(false);
//           setRoomError("");
//         }

//         return roomRef.current;
//       }

//       /*
//        * There is deliberately NO API request here.
//        *
//        * Socket.IO will provide the room state.
//        */

//       if (
//         !silent &&
//         mountedRef.current
//       ) {
//         setRoomLoading(false);
//         setRoomError("");
//       }

//       return roomRef.current;
//     },
//     [
//       enabled,
//       quizId,
//     ],
//   );

//   /*
//    * Refresh.
//    *
//    * Since quiz data is supplied by the parent
//    * from My Competitions and room data comes
//    * from Socket.IO, there is no REST room request.
//    */
//   const refresh = useCallback(
//     async (): Promise<void> => {
//       if (
//         !enabled ||
//         !quizId
//       ) {
//         return;
//       }

//       if (mountedRef.current) {
//         setRefreshing(true);
//         setError("");
//       }

//       try {
//         await loadQuiz({
//           silent: true,
//         });

//         /*
//          * Room state is intentionally NOT
//          * fetched here.
//          *
//          * Socket.IO owns it.
//          */
//       } finally {
//         if (mountedRef.current) {
//           setRefreshing(false);
//         }
//       }
//     },
//     [
//       enabled,
//       quizId,
//       loadQuiz,
//     ],
//   );

//   /*
//    * Initial loading.
//    *
//    * Quiz comes from initialQuiz.
//    *
//    * Room comes from Socket.IO.
//    */
//   useEffect(() => {
//     if (
//       !enabled ||
//       !quizId
//     ) {
//       if (mountedRef.current) {
//         setLoading(false);
//       }

//       return;
//     }

//     let cancelled = false;

//     const initialize =
//       async () => {
//         if (mountedRef.current) {
//           setLoading(true);
//           setError("");
//         }

//         /*
//          * Do not fetch room state here.
//          */
//         if (
//           !cancelled &&
//           mountedRef.current
//         ) {
//           setLoading(false);
//         }
//       };

//     void initialize();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     enabled,
//     quizId,
//   ]);

//   /*
//    * Quiz polling.
//    *
//    * Disabled by default.
//    *
//    * There is no getQuizById request here.
//    * If the parent receives updated My Competitions
//    * data, it should pass the updated initialQuiz.
//    */
//   useEffect(() => {
//     if (
//       !enabled ||
//       !quizId ||
//       !pollQuiz
//     ) {
//       return;
//     }

//     /*
//      * Intentionally no interval.
//      *
//      * Quiz data is owned by the parent
//      * My Competitions request.
//      */
//   }, [
//     enabled,
//     quizId,
//     pollQuiz,
//   ]);

//   /*
//    * Room polling.
//    *
//    * Completely disabled.
//    *
//    * Socket.IO is the source of truth for:
//    *
//    * room_state
//    * room_activated
//    * participant_joined_room
//    * round_started
//    * leaderboard_updated
//    * etc.
//    */
//   useEffect(() => {
//     if (
//       !enabled ||
//       !quizId ||
//       !pollRoom
//     ) {
//       return;
//     }

//     /*
//      * Intentionally no REST polling.
//      */
//   }, [
//     enabled,
//     quizId,
//     pollRoom,
//   ]);

//   /*
//    * Clear state when disabled.
//    */
//   useEffect(() => {
//     if (enabled) {
//       return;
//     }

//     setQuiz(null);
//     setRoom(null);

//     setLoading(false);
//     setRefreshing(false);

//     setError("");
//     setQuizError("");
//     setRoomError("");

//     setQuizLoading(false);
//     setRoomLoading(false);

//     quizRef.current = null;
//     roomRef.current = null;
//   }, [enabled]);

//   /*
//    * Resolve current room ID.
//    *
//    * Priority:
//    *
//    * 1. Socket.IO room state
//    * 2. quiz.room_id
//    */
//   const roomId =
//     getStoredRoomId(
//       room,
//       quiz,
//     );

//   return {
//     quiz,
//     room,

//     loading:
//       loading ||
//       (!quiz && quizLoading),

//     refreshing,

//     error,

//     quizLoading,
//     roomLoading,

//     quizError,
//     roomError,

//     roomId,

//     loadQuiz,
//     loadRoom,

//     refresh,

//     setQuiz,
//     setRoom,
//   };
// }