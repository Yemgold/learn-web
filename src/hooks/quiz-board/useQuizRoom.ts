






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
import { axiosInstance } from "@/lib";

const QUIZ_POLLING_INTERVAL = 60_000;
const ROOM_POLLING_INTERVAL = 10_000;

export interface UseQuizRoomOptions {
  enabled?: boolean;
  pollQuiz?: boolean;
  pollRoom?: boolean;
}

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

function resolveRoomId(
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
    pollQuiz = true,
    pollRoom = true,
  } = options;

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

  const mountedRef =
    useRef(true);

  const quizRef =
    useRef<QuizCompetition | null>(null);

  const roomRef =
    useRef<QuizRoom | null>(null);

  const quizRequestInFlightRef =
    useRef(false);

  const roomRequestInFlightRef =
    useRef(false);

  /*
   * Track whether the hook is mounted.
   */
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

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
   * Load quiz competition.
   *
   * IMPORTANT:
   * We use the existing frontend API function
   * from src/lib/api/quizCompetition.ts.
   *
   * This keeps authentication, baseURL, /api/v1,
   * interceptors and refresh-token handling inside
   * axiosInstance.
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

      /*
       * Prevent duplicate requests.
       */
      if (quizRequestInFlightRef.current) {
        return quizRef.current;
      }

      quizRequestInFlightRef.current = true;

      if (!silent && mountedRef.current) {
        setQuizLoading(true);
        setQuizError("");
      }

      try {
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

        if (!silent && mountedRef.current) {
          setQuizLoading(false);
        }
      }
    },
    [enabled, quizId],
  );

  /*
   * Load room state.
   *
   * Room state is different from quiz metadata.
   * We only request it after a roomId exists.
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
       * No room has been created yet.
       */
      if (!currentRoomId) {
        return null;
      }

      /*
       * Prevent overlapping room requests.
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
        /*
         * Room-state endpoint.
         *
         * Unlike getQuizById, we don't currently have
         * a confirmed helper for room-state in the
         * existing API file, so this uses the frontend
         * /api/v1 route directly.
         */
       const response = await axiosInstance.get(
  `/quiz/room-state/${encodeURIComponent(
    currentRoomId,
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
        roomRequestInFlightRef.current =
          false;

        if (!silent && mountedRef.current) {
          setRoomLoading(false);
        }
      }
    },
    [enabled, quizId],
  );

  /*
   * Refresh quiz and room state.
   */
  const refresh = useCallback(
    async (): Promise<void> => {
      if (!enabled || !quizId) {
        return;
      }

      if (mountedRef.current) {
        setRefreshing(true);
        setError("");
      }

      try {
        const nextQuiz =
          await loadQuiz();

        if (!mountedRef.current) {
          return;
        }

        const nextRoomId =
          resolveRoomId(
            roomRef.current,
            nextQuiz,
          );

        if (nextRoomId) {
          await loadRoom(nextRoomId);
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
   * Initial loading.
   *
   * 1. Get quiz.
   * 2. Extract room_id.
   * 3. Get room state.
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

      const nextQuiz =
        await loadQuiz();

      if (
        cancelled ||
        !mountedRef.current
      ) {
        return;
      }

      const nextRoomId =
        resolveRoomId(
          roomRef.current,
          nextQuiz,
        );

      if (nextRoomId) {
        await loadRoom(nextRoomId);
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
    loadQuiz,
    loadRoom,
  ]);

  /*
   * Quiz metadata polling.
   *
   * Quiz metadata changes relatively slowly,
   * so poll every 60 seconds.
   */
  useEffect(() => {
    if (
      !enabled ||
      !quizId ||
      !pollQuiz
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        void loadQuiz({
          silent: true,
        });
      }, QUIZ_POLLING_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    enabled,
    quizId,
    pollQuiz,
    loadQuiz,
  ]);

  /*
   * Room polling.
   *
   * Socket.IO provides real-time updates.
   * This REST request is only the recovery mechanism.
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
          resolveRoomId(
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
   * If quiz metadata obtains a room_id after
   * the initial request, immediately load its state.
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
      getRoomId(roomRef.current);

    /*
     * We already have this room.
     */
    if (
      currentRoomId === nextRoomId
    ) {
      return;
    }

    void loadRoom(
      nextRoomId,
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

  /*
   * Clear state when disabled.
   */
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
  }, [enabled]);

  /*
   * Resolve the current room ID from either:
   *
   * 1. room state
   * 2. quiz.room_id
   */
  const roomId =
    resolveRoomId(
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
//   extractQuiz,
//   extractRoom,
//   getApiErrorMessage,
//   getQuizRoomId,
//   getRoomId,
// } from "@/lib/quiz-board/waiting-room/helpers";

// import {
//   getAllMyQuizzes,
// } from "@/lib/api/quizCompetition";

// const QUIZ_POLLING_INTERVAL = 60_000;

// export interface UseQuizRoomOptions {
//   enabled?: boolean;
//   pollQuiz?: boolean;
//   pollRoom?: boolean;
// }

// export interface UseQuizRoomReturn {
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

// /* -------------------------------------------------------------------------- */
// /* Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// function resolveRoomId(
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

// function getStoredUserId(): string | null {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   const possibleKeys = [
//     "user",
//     "auth-user",
//     "jamb_user",
//     "jamb_auth_user",
//   ];

//   for (const key of possibleKeys) {
//     try {
//       const raw = window.localStorage.getItem(key);

//       if (!raw) {
//         continue;
//       }

//       try {
//         const parsed = JSON.parse(raw);

//         if (
//           parsed &&
//           typeof parsed === "object"
//         ) {
//           const record =
//             parsed as Record<string, unknown>;

//           const idCandidates = [
//             record._id,
//             record.id,
//             record.userId,
//             record.user_id,
//           ];

//           for (const candidate of idCandidates) {
//             if (
//               typeof candidate === "string" &&
//               candidate.trim()
//             ) {
//               return candidate.trim();
//             }
//           }

//           if (
//             record.user &&
//             typeof record.user === "object"
//           ) {
//             const nested =
//               record.user as Record<
//                 string,
//                 unknown
//               >;

//             const nestedCandidates = [
//               nested._id,
//               nested.id,
//               nested.userId,
//               nested.user_id,
//             ];

//             for (
//               const candidate of nestedCandidates
//             ) {
//               if (
//                 typeof candidate === "string" &&
//                 candidate.trim()
//               ) {
//                 return candidate.trim();
//               }
//             }
//           }
//         }
//       } catch {
//         /*
//          * Some applications store the user ID
//          * directly rather than as JSON.
//          */
//         const value = raw.trim();

//         if (value) {
//           return value;
//         }
//       }
//     } catch {
//       /*
//        * Continue checking the remaining keys.
//        */
//     }
//   }

//   return null;
// }

// function extractMyQuizItems(
//   payload: unknown,
// ): unknown[] {
//   if (Array.isArray(payload)) {
//     return payload;
//   }

//   if (
//     !payload ||
//     typeof payload !== "object"
//   ) {
//     return [];
//   }

//   const record =
//     payload as Record<string, unknown>;

//   const possibleArrays = [
//     record.data,
//     record.quizzes,
//     record.quiz,
//     record.results,
//     record.items,
//     record.quizzesObj,
//     record.myQuizzes,
//     record.my_quizzes,
//   ];

//   for (const value of possibleArrays) {
//     if (Array.isArray(value)) {
//       return value;
//     }

//     if (
//       value &&
//       typeof value === "object"
//     ) {
//       const nested =
//         value as Record<string, unknown>;

//       const nestedArrays = [
//         nested.data,
//         nested.quizzes,
//         nested.results,
//         nested.items,
//         nested.quizzesObj,
//         nested.myQuizzes,
//         nested.my_quizzes,
//       ];

//       for (const nestedValue of nestedArrays) {
//         if (Array.isArray(nestedValue)) {
//           return nestedValue;
//         }
//       }
//     }
//   }

//   return [];
// }

// function getItemQuizId(
//   item: unknown,
// ): string | null {
//   if (
//     !item ||
//     typeof item !== "object"
//   ) {
//     return null;
//   }

//   const value =
//     item as Record<string, unknown>;

//   /*
//    * Participation object:
//    *
//    * {
//    *   quizId: {
//    *     _id: "..."
//    *   }
//    * }
//    */

//   if (
//     value.quizId &&
//     typeof value.quizId === "object"
//   ) {
//     const quiz =
//       value.quizId as Record<
//         string,
//         unknown
//       >;

//     const nestedId =
//       quiz._id ?? quiz.id;

//     if (
//       typeof nestedId === "string" &&
//       nestedId.trim()
//     ) {
//       return nestedId.trim();
//     }
//   }

//   const directCandidates = [
//     value.quizId,
//     value.quiz_id,
//     value._id,
//     value.id,
//   ];

//   for (
//     const candidate of directCandidates
//   ) {
//     if (
//       typeof candidate === "string" &&
//       candidate.trim()
//     ) {
//       return candidate.trim();
//     }
//   }

//   return null;
// }

// function getQuizFromMyQuizItem(
//   item: unknown,
// ): QuizCompetition | null {
//   if (
//     !item ||
//     typeof item !== "object"
//   ) {
//     return null;
//   }

//   const value =
//     item as Record<string, unknown>;

//   /*
//    * Normal My Competitions response:
//    *
//    * participation.quizId
//    */

//   if (
//     value.quizId &&
//     typeof value.quizId === "object"
//   ) {
//     const quiz =
//       extractQuiz(value.quizId);

//     if (quiz) {
//       return quiz;
//     }
//   }

//   /*
//    * Some API wrappers may return:
//    *
//    * {
//    *   quiz: {...}
//    * }
//    */

//   if (
//     value.quiz &&
//     typeof value.quiz === "object"
//   ) {
//     const quiz =
//       extractQuiz(value.quiz);

//     if (quiz) {
//       return quiz;
//     }
//   }

//   /*
//    * The item itself may already be
//    * the quiz object.
//    */

//   return extractQuiz(value);
// }

// function getRoomFromMyQuizItem(
//   item: unknown,
// ): QuizRoom | null {
//   if (
//     !item ||
//     typeof item !== "object"
//   ) {
//     return null;
//   }

//   const value =
//     item as Record<string, unknown>;

//   /*
//    * If the API ever provides a nested room,
//    * preserve it.
//    *
//    * This does NOT make a REST room-state
//    * request.
//    */

//   if (
//     value.room &&
//     typeof value.room === "object"
//   ) {
//     return extractRoom(value.room);
//   }

//   if (
//     value.roomData &&
//     typeof value.roomData === "object"
//   ) {
//     return extractRoom(value.roomData);
//   }

//   return null;
// }

// /* -------------------------------------------------------------------------- */
// /* Hook                                                                       */
// /* -------------------------------------------------------------------------- */

// export default function useQuizRoom(
//   quizId: string,
//   options: UseQuizRoomOptions = {},
// ): UseQuizRoomReturn {
//   const {
//     enabled = true,
//     pollQuiz = true,

//     /*
//      * Kept in the public options so existing
//      * callers do not break.
//      *
//      * Room polling is intentionally disabled
//      * because Socket.IO owns room state.
//      */
//     pollRoom = false,
//   } = options;

//   const [quiz, setQuiz] =
//     useState<QuizCompetition | null>(null);

//   const [room, setRoom] =
//     useState<QuizRoom | null>(null);

//   const [loading, setLoading] =
//     useState(true);

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

//   const mountedRef =
//     useRef(true);

//   const quizRef =
//     useRef<QuizCompetition | null>(null);

//   const roomRef =
//     useRef<QuizRoom | null>(null);

//   const quizRequestInFlightRef =
//     useRef(false);

//   /* ---------------------------------------------------------------------- */
//   /* Mounted state                                                          */
//   /* ---------------------------------------------------------------------- */

//   useEffect(() => {
//     mountedRef.current = true;

//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   /* ---------------------------------------------------------------------- */
//   /* Keep refs synchronized                                                 */
//   /* ---------------------------------------------------------------------- */

//   useEffect(() => {
//     quizRef.current = quiz;
//   }, [quiz]);

//   useEffect(() => {
//     roomRef.current = room;
//   }, [room]);

//   /* ---------------------------------------------------------------------- */
//   /* Load quiz from My Competitions                                         */
//   /* ---------------------------------------------------------------------- */

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

//       /*
//        * Prevent duplicate requests.
//        */
//       if (
//         quizRequestInFlightRef.current
//       ) {
//         return quizRef.current;
//       }

//       const userId =
//         getStoredUserId();

//       if (!userId) {
//         const message =
//           "Unable to identify the logged-in user.";

//         if (mountedRef.current) {
//           setQuizError(message);
//           setError(message);
//         }

//         return null;
//       }

//       quizRequestInFlightRef.current =
//         true;

//       if (
//         !silent &&
//         mountedRef.current
//       ) {
//         setQuizLoading(true);
//         setQuizError("");
//       }

//       try {
//         /*
//          * IMPORTANT:
//          *
//          * We intentionally use:
//          *
//          * get-all-my-quizzes/{userId}
//          *
//          * This response already contains:
//          *
//          * - participation
//          * - contestantId
//          * - quiz
//          * - room_id
//          * - current_round
//          * - joined_users
//          * - quiz status
//          *
//          * No getQuizById request is needed.
//          */
//         const payload =
//           await getAllMyQuizzes(userId);

//         const items =
//           extractMyQuizItems(payload);

//         const matchingItem =
//           items.find(
//             (item) =>
//               getItemQuizId(item) ===
//               quizId,
//           );

//         if (!matchingItem) {
//           throw new Error(
//             "This competition could not be found in your competitions.",
//           );
//         }

//         const nextQuiz =
//           getQuizFromMyQuizItem(
//             matchingItem,
//           );

//         if (!nextQuiz) {
//           throw new Error(
//             "The competition response did not contain valid quiz data.",
//           );
//         }

//         const nestedRoom =
//           getRoomFromMyQuizItem(
//             matchingItem,
//           );

//         if (mountedRef.current) {
//           setQuiz(nextQuiz);

//           /*
//            * If the API happens to provide room
//            * information, keep it.
//            *
//            * Otherwise room remains null until
//            * Socket.IO sends room_state.
//            */
//           if (nestedRoom) {
//             setRoom(nestedRoom);
//             roomRef.current =
//               nestedRoom;
//           }

//           setQuizError("");
//           setError("");
//         }

//         quizRef.current =
//           nextQuiz;

//         return nextQuiz;
//       } catch (requestError) {
//         const message =
//           getApiErrorMessage(
//             requestError,
//             "Failed to load competition.",
//           );

//         if (mountedRef.current) {
//           setQuizError(message);
//           setError(message);
//         }

//         return null;
//       } finally {
//         quizRequestInFlightRef.current =
//           false;

//         if (
//           !silent &&
//           mountedRef.current
//         ) {
//           setQuizLoading(false);
//         }
//       }
//     },
//     [
//       enabled,
//       quizId,
//     ],
//   );

//   /* ---------------------------------------------------------------------- */
//   /* Load room                                                              */
//   /* ---------------------------------------------------------------------- */

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

//       const currentRoomId =
//         String(
//           explicitRoomId ||
//             resolveRoomId(
//               roomRef.current,
//               quizRef.current,
//             ) ||
//             "",
//         ).trim();

//       /*
//        * There may be no room yet.
//        *
//        * This is NOT an error.
//        *
//        * The admin may not have created
//        * the room yet.
//        */
//       if (!currentRoomId) {
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
//        * IMPORTANT:
//        *
//        * There is deliberately NO:
//        *
//        * fetch(
//        *   /api/v1/quiz/room-state/...
//        * )
//        *
//        * Socket.IO is responsible for live
//        * room state.
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

//   /* ---------------------------------------------------------------------- */
//   /* Refresh                                                               */
//   /* ---------------------------------------------------------------------- */

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
//         /*
//          * Refresh only the My Competitions
//          * REST data.
//          *
//          * Room state comes from Socket.IO.
//          */
//         await loadQuiz();
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

//   /* ---------------------------------------------------------------------- */
//   /* Initial loading                                                        */
//   /* ---------------------------------------------------------------------- */

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

//         await loadQuiz();

//         if (
//           cancelled ||
//           !mountedRef.current
//         ) {
//           return;
//         }

//         /*
//          * We intentionally DO NOT call loadRoom().
//          *
//          * The room will be populated by Socket.IO:
//          *
//          * socket -> room_state
//          */
//         if (mountedRef.current) {
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
//     loadQuiz,
//   ]);

//   /* ---------------------------------------------------------------------- */
//   /* Quiz polling                                                           */
//   /* ---------------------------------------------------------------------- */

//   useEffect(() => {
//     if (
//       !enabled ||
//       !quizId ||
//       !pollQuiz
//     ) {
//       return;
//     }

//     const interval =
//       window.setInterval(
//         () => {
//           void loadQuiz({
//             silent: true,
//           });
//         },
//         QUIZ_POLLING_INTERVAL,
//       );

//     return () => {
//       window.clearInterval(
//         interval,
//       );
//     };
//   }, [
//     enabled,
//     quizId,
//     pollQuiz,
//     loadQuiz,
//   ]);

//   /* ---------------------------------------------------------------------- */
//   /* Room polling                                                           */
//   /* ---------------------------------------------------------------------- */

//   useEffect(() => {
//     /*
//      * Intentionally disabled.
//      *
//      * Socket.IO is the source of truth
//      * for live room state.
//      *
//      * Keeping this effect means existing
//      * pollRoom options remain compatible,
//      * but no REST request is made.
//      */
//     if (
//       !enabled ||
//       !quizId ||
//       !pollRoom
//     ) {
//       return;
//     }

//     /*
//      * No interval is created.
//      *
//      * Room updates come through:
//      *
//      * room_state
//      * room_activated
//      * participant_joined_room
//      * round_started
//      * leaderboard_updated
//      * ...
//      */
//     return;
//   }, [
//     enabled,
//     quizId,
//     pollRoom,
//   ]);

//   /* ---------------------------------------------------------------------- */
//   /* Clear state when disabled                                              */
//   /* ---------------------------------------------------------------------- */

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

//   /* ---------------------------------------------------------------------- */
//   /* Resolve room ID                                                        */
//   /* ---------------------------------------------------------------------- */

//   const roomId =
//     resolveRoomId(
//       room,
//       quiz,
//     );

//   /* ---------------------------------------------------------------------- */
//   /* Return                                                                 */
//   /* ---------------------------------------------------------------------- */

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