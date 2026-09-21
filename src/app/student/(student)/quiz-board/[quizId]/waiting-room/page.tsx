



// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import { useParams, useRouter } from "next/navigation";

// import {
//   ArrowLeft,
//   CheckCircle2,
//   Clock3,
//   Crown,
//   Loader2,
//   LogOut,
//   Medal,
//   MessageCircle,
//   Radio,
//   Shield,
//   Sparkles,
//   Trophy,
//   Users,
//   Wifi,
//   WifiOff,
//   Zap,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// import { getQuizById } from "@/lib/api/quizCompetition";

// import {
//   getQuizSocket,
//   disconnectQuizSocket,
// } from "@/lib/socket/quizSocket";

// /* =========================================================
//    CONSTANTS
// ========================================================= */

// const POLLING_INTERVAL = 60_000;

// /* =========================================================
//    TYPES
// ========================================================= */

// type DifficultyBreakdown = {
//   easy?: number;
//   medium?: number;
//   hard?: number;
// };

// type QuizRound = {
//   round?: number;
//   round_number?: number;
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   exit_number?: number;
//   exit_reward?: number;
// };

// type FinalRoundInformation = {
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   first_position_reward?: number;
//   second_position_reward?: number;
// };

// type JoinedUser =
//   | string
//   | {
//       _id?: string;
//       id?: string;
//       userId?: string;
//       name?: string;
//       username?: string;
//       fullName?: string;
//       firstName?: string;
//       lastName?: string;
//       email?: string;
//     };

// type QuizCompetition = {
//   _id: string;
//   quiz_title?: string;
//   description?: string;
//   status?: string;

//   subject?:
//     | string
//     | {
//         _id?: string;
//         name?: string;
//       }
//     | null;

//   time_per_question?: number;
//   start_date?: string;

//   no_of_contestants?: number;
//   number_of_rounds?: number;

//   round_information?: QuizRound[];

//   final_round_information?: FinalRoundInformation;

//   current_round?: number;

//   room_id?: string | null;

//   joined_users?: JoinedUser[];
// };

// type QuizApiResponse = {
//   success?: boolean;
//   message?: string;
//   data?:
//     | QuizCompetition
//     | {
//         quiz?: QuizCompetition;
//       };
// };

// type LobbyStatus =
//   | "loading"
//   | "waiting_for_players"
//   | "waiting_for_room"
//   | "waiting_for_start"
//   | "live"
//   | "completed"
//   | "error";

// /* =========================================================
//    SOCKET EVENT TYPES
// ========================================================= */

// /*
//  * These payloads are intentionally flexible because the
//  * exact backend Socket.IO payload can vary.
//  *
//  * The important thing is that the event names match the
//  * backend:
//  *
//  * join_room
//  * joined_room_ack
//  * participant_joined_room
//  * round_started
//  */

// type SocketRoundStartedPayload = {
//   quizId?: string;
//   quiz_id?: string;
//   roomId?: string;
//   room_id?: string;
//   currentRound?: number;
//   current_round?: number;
//   round?: number;
//   round_number?: number;
// };

// type SocketJoinedRoomAckPayload = {
//   success?: boolean;
//   message?: string;
//   roomId?: string;
//   room_id?: string;
//   quizId?: string;
//   quiz_id?: string;
// };

// type SocketParticipantJoinedPayload = {
//   userId?: string;
//   user_id?: string;
//   participantId?: string;
//   participant_id?: string;
//   roomId?: string;
//   room_id?: string;
//   joinedCount?: number;
//   joined_count?: number;
//   participantCount?: number;
//   participant_count?: number;
// };

// /* =========================================================
//    HELPERS
// ========================================================= */

// function extractQuiz(
//   response: QuizApiResponse,
// ): QuizCompetition | null {
//   if (!response) {
//     return null;
//   }

//   const rootData = response.data;

//   if (!rootData) {
//     return null;
//   }

//   if (
//     typeof rootData === "object" &&
//     "_id" in rootData
//   ) {
//     return rootData as QuizCompetition;
//   }

//   if (
//     typeof rootData === "object" &&
//     "quiz" in rootData &&
//     rootData.quiz
//   ) {
//     return rootData.quiz;
//   }

//   return null;
// }

// /* =========================================================
//    USER HELPERS
// ========================================================= */

// function getUserName(
//   user: JoinedUser,
//   index: number,
// ): string {
//   if (typeof user === "string") {
//     return `Contestant ${index + 1}`;
//   }

//   if (user.fullName?.trim()) {
//     return user.fullName.trim();
//   }

//   if (
//     user.firstName?.trim() ||
//     user.lastName?.trim()
//   ) {
//     return [
//       user.firstName,
//       user.lastName,
//     ]
//       .filter(Boolean)
//       .join(" ")
//       .trim();
//   }

//   if (user.name?.trim()) {
//     return user.name.trim();
//   }

//   if (user.username?.trim()) {
//     return user.username.trim();
//   }

//   if (user.email?.trim()) {
//     return user.email.split("@")[0];
//   }

//   return `Contestant ${index + 1}`;
// }

// function getUserInitials(
//   name: string,
// ): string {
//   const parts = name
//     .trim()
//     .split(/\s+/)
//     .filter(Boolean);

//   if (!parts.length) {
//     return "?";
//   }

//   if (parts.length === 1) {
//     return parts[0]
//       .slice(0, 2)
//       .toUpperCase();
//   }

//   return `${parts[0][0]}${
//     parts[parts.length - 1][0]
//   }`.toUpperCase();
// }

// function getEntityId(
//   user: JoinedUser,
// ): string {
//   if (typeof user === "string") {
//     return user;
//   }

//   return (
//     user._id ||
//     user.id ||
//     user.userId ||
//     user.email ||
//     ""
//   );
// }

// /* =========================================================
//    QUIZ HELPERS
// ========================================================= */

// function getSubjectName(
//   quiz: QuizCompetition,
// ): string {
//   if (!quiz.subject) {
//     return "";
//   }

//   if (typeof quiz.subject === "string") {
//     return "";
//   }

//   return quiz.subject.name || "";
// }

// function getTotalQuestions(
//   quiz: QuizCompetition,
// ): number {
//   const eliminationQuestions = (
//     quiz.round_information || []
//   ).reduce(
//     (total, round) =>
//       total +
//       Number(round.no_of_questions ?? 0),
//     0,
//   );

//   const finalQuestions = Number(
//     quiz.final_round_information
//       ?.no_of_questions ?? 0,
//   );

//   return (
//     eliminationQuestions +
//     finalQuestions
//   );
// }

// function getQualificationSequence(
//   quiz: QuizCompetition,
// ): number[] {
//   const contestants = Math.max(
//     Number(
//       quiz.no_of_contestants ?? 0,
//     ),
//     1,
//   );

//   const sequence: number[] = [
//     contestants,
//   ];

//   let remaining = contestants;

//   const rounds =
//     quiz.round_information || [];

//   for (const round of rounds) {
//     const exitNumber = Math.max(
//       Number(round.exit_number ?? 0),
//       0,
//     );

//     if (exitNumber > 0) {
//       remaining = Math.max(
//         1,
//         remaining - exitNumber,
//       );

//       if (
//         remaining <
//         sequence[sequence.length - 1]
//       ) {
//         sequence.push(remaining);
//       }
//     }
//   }

//   if (
//     remaining > 1 &&
//     !sequence.includes(2)
//   ) {
//     sequence.push(2);
//   }

//   if (!sequence.includes(1)) {
//     sequence.push(1);
//   }

//   return sequence;
// }

// function getRoundLabel(
//   currentRound: number,
//   quiz: QuizCompetition,
// ): string {
//   const totalRounds = Number(
//     quiz.number_of_rounds ?? 0,
//   );

//   if (currentRound <= 0) {
//     return "Waiting Room";
//   }

//   if (
//     totalRounds > 0 &&
//     currentRound >= totalRounds
//   ) {
//     return "Final Round";
//   }

//   return `Round ${currentRound}`;
// }

// function formatStartDate(
//   value?: string,
// ): string {
//   if (!value) {
//     return "Not scheduled";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "Not scheduled";
//   }

//   return new Intl.DateTimeFormat(
//     "en-NG",
//     {
//       dateStyle: "medium",
//       timeStyle: "short",
//     },
//   ).format(date);
// }

// function formatStatus(
//   value?: string,
// ): string {
//   if (!value) {
//     return "Unknown";
//   }

//   return value
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (char) =>
//       char.toUpperCase(),
//     );
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function QuizWaitingRoomPage() {
//   const router = useRouter();
//   const params = useParams();

//   const quizId =
//     typeof params?.quizId === "string"
//       ? params.quizId
//       : Array.isArray(params?.quizId)
//         ? params.quizId[0]
//         : "";

//   /* =======================================================
//      STATE
//   ======================================================= */

//   const [quiz, setQuiz] =
//     useState<QuizCompetition | null>(
//       null,
//     );

//   const [status, setStatus] =
//     useState<LobbyStatus>("loading");

//   const [error, setError] =
//     useState("");

//   const [refreshing, setRefreshing] =
//     useState(false);

//   const [lastUpdated, setLastUpdated] =
//     useState<number>(() => Date.now());

//   /*
//    * Socket connection state.
//    *
//    * This tells the UI whether the browser is
//    * actually connected to the Socket.IO server.
//    */
//   const [socketConnected, setSocketConnected] =
//     useState(false);

//   /*
//    * This tells us that the backend acknowledged
//    * the student's join_room event.
//    *
//    * This is different from joined_users.
//    */
//   const [socketRoomJoined, setSocketRoomJoined] =
//     useState(false);

//   /*
//    * Number of participants reported by Socket.IO.
//    *
//    * This is informational only.
//    */
//   const [socketParticipantCount, setSocketParticipantCount] =
//     useState<number | null>(null);

//   /*
//    * Prevent duplicate API requests.
//    */
//   const requestInFlightRef =
//     useRef(false);

//   /*
//    * Polling timeout.
//    */
//   const pollingTimeoutRef =
//     useRef<number | null>(null);

//   /*
//    * Prevent multiple navigation attempts
//    * when both REST polling and Socket.IO
//    * detect the competition start.
//    */
//   const navigatingToPlayRef =
//     useRef(false);

//   /*
//    * Store the room ID currently joined through
//    * Socket.IO.
//    */
//   const joinedSocketRoomRef =
//     useRef<string | null>(null);

//   /* =======================================================
//      NAVIGATE TO PLAY
//   ======================================================= */

//   const enterPlayPage =
//     useCallback(() => {
//       if (!quizId) {
//         return;
//       }

//       if (navigatingToPlayRef.current) {
//         return;
//       }

//       navigatingToPlayRef.current = true;

//       router.push(
//         `/student/quiz-board/${quizId}/play`,
//       );
//     }, [quizId, router]);

//   /* =======================================================
//      UPDATE LOBBY STATE
//   ======================================================= */

//   const updateLobbyStatus =
//     useCallback(
//       (nextQuiz: QuizCompetition) => {
//         const competitionStatus =
//           String(
//             nextQuiz.status ?? "",
//           ).toUpperCase();

//         const currentRound = Number(
//           nextQuiz.current_round ?? 0,
//         );

//         const joinedCount =
//           Array.isArray(
//             nextQuiz.joined_users,
//           )
//             ? nextQuiz.joined_users.length
//             : 0;

//         const maxPlayers = Math.max(
//           Number(
//             nextQuiz.no_of_contestants ??
//               0,
//           ),
//           0,
//         );

//         const isFull =
//           maxPlayers > 0 &&
//           joinedCount >= maxPlayers;

//         const hasRoom = Boolean(
//           nextQuiz.room_id?.trim(),
//         );

//         /* -----------------------------------------------
//            COMPLETED
//         ------------------------------------------------ */

//         if (
//           competitionStatus ===
//             "COMPLETED" ||
//           competitionStatus === "FINISHED"
//         ) {
//           setStatus("completed");
//           return;
//         }

//         /* -----------------------------------------------
//            STARTED
           
//            REST fallback:
//            current_round > 0.
           
//            We don't depend on a LIVE status because
//            your backend may not use one.
//         ------------------------------------------------ */

//         if (currentRound > 0) {
//           setStatus("live");
//           return;
//         }

//         /* -----------------------------------------------
//            CONTESTANTS NOT FULL
//         ------------------------------------------------ */

//         if (!isFull) {
//           setStatus(
//             "waiting_for_players",
//           );
//           return;
//         }

//         /* -----------------------------------------------
//            FULL BUT ROOM NOT CREATED
//         ------------------------------------------------ */

//         if (!hasRoom) {
//           setStatus(
//             "waiting_for_room",
//           );
//           return;
//         }

//         /* -----------------------------------------------
//            ROOM CREATED
           
//            Socket.IO should now be used to wait for
//            the backend round_started event.
//         ------------------------------------------------ */

//         setStatus("waiting_for_start");
//       },
//       [],
//     );

//   /* =======================================================
//      LOAD QUIZ
//   ======================================================= */

//   const loadQuiz = useCallback(
//     async (silent = false) => {
//       if (!quizId) {
//         setError(
//           "Competition ID is missing.",
//         );
//         setStatus("error");
//         return;
//       }

//       if (requestInFlightRef.current) {
//         return;
//       }

//       requestInFlightRef.current = true;

//       if (silent) {
//         setRefreshing(true);
//       } else {
//         setStatus("loading");
//       }

//       if (!silent) {
//         setError("");
//       }

//       try {
//         const response =
//           (await getQuizById(
//             quizId,
//           )) as QuizApiResponse;

//         const nextQuiz =
//           extractQuiz(response);

//         if (!nextQuiz) {
//           throw new Error(
//             response?.message ||
//               "Unable to load this competition.",
//           );
//         }

//         setQuiz(nextQuiz);

//         updateLobbyStatus(
//           nextQuiz,
//         );

//         setLastUpdated(
//           Date.now(),
//         );

//         if (silent) {
//           setError("");
//         }
//       } catch (err: any) {
//         console.error(
//           "Unable to load Quiz Board competition:",
//           err,
//         );

//         const message =
//           err?.response?.data
//             ?.message ||
//           err?.message ||
//           "Unable to load the competition.";

//         if (!silent) {
//           setError(message);
//           setStatus("error");
//         } else {
//           console.warn(
//             "Quiz Board automatic refresh failed:",
//             message,
//           );
//         }
//       } finally {
//         requestInFlightRef.current =
//           false;

//         setRefreshing(false);
//       }
//     },
//     [
//       quizId,
//       updateLobbyStatus,
//     ],
//   );

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     void loadQuiz();
//   }, [loadQuiz]);

//   /* =======================================================
//      SOCKET.IO CONNECTION
     
//      FLOW:
     
//      1. REST API returns room_id.
//      2. Browser connects to Socket.IO server.
//      3. Browser emits join_room.
//      4. Backend puts this socket into the room.
//      5. Backend sends joined_room_ack.
//      6. Backend sends participant_joined_room
//         when another contestant joins.
//      7. Admin starts the competition.
//      8. Backend emits round_started.
//      9. Student enters /play.
//   ======================================================= */

//   useEffect(() => {
//     if (!quizId) {
//       return;
//     }

//     const roomId =
//       quiz?.room_id?.trim();

//     /*
//      * No room_id means there is no Socket.IO room
//      * to join yet.
//      */
//     if (!roomId) {
//       setSocketConnected(false);
//       setSocketRoomJoined(false);
//       setSocketParticipantCount(null);
//       joinedSocketRoomRef.current = null;

//       return;
//     }

//     let cancelled = false;

//     const socket =
//       getQuizSocket();

//     /*
//      * Connection established.
//      */
//     const handleConnect =
//       () => {
//         if (cancelled) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] Connected:",
//           socket.id,
//         );

//         setSocketConnected(true);

//       /*
//  * Prevent emitting duplicate join_room
//  * for the same room.
//  */

// if (
//   joinedSocketRoomRef.current !==
//   roomId
// ) {
//   console.log(
//     "[Quiz Socket] Joining room:",
//     roomId,
//   );

//   /*
//    * IMPORTANT:
//    * This payload must match the backend.
//    *
//    * We are using room_id because that is
//    * the naming used by your quiz API.
//    */
//   socket.emit(
//     "join_room",
//     {
//       room_id: roomId,
//     },
//   );

//   /*
//    * DO NOT set joinedSocketRoomRef.current
//    * here.
//    *
//    * The student has only REQUESTED to join.
//    * We wait for joined_room_ack before marking
//    * the room as successfully joined.
//    */
// }


//       };

// /*
//  * Connection lost.
//  */
// const handleDisconnect = (
//   reason: string,
// ) => {
//   if (cancelled) {
//     return;
//   }

//   console.warn(
//     "[Quiz Socket] Disconnected:",
//     reason,
//   );

//   setSocketConnected(false);
//   setSocketRoomJoined(false);

//   /*
//    * Clear the room reference so that when
//    * Socket.IO reconnects, the student can
//    * send join_room again.
//    */
//   joinedSocketRoomRef.current = null;
// };

// /*
//  * Backend confirms the student joined
//  * the Socket.IO room.
//  */
// const handleJoinedRoomAck = (
//   payload: SocketJoinedRoomAckPayload,
// ) => {
//   if (cancelled) {
//     return;
//   }

//   console.log(
//     "[Quiz Socket] joined_room_ack:",
//     payload,
//   );

//   /*
//    * If backend explicitly says success:false,
//    * don't mark the room as joined.
//    */
//   if (
//     payload &&
//     payload.success === false
//   ) {
//     console.warn(
//       "[Quiz Socket] Room join rejected:",
//       payload.message,
//     );

//     setSocketRoomJoined(false);

//     /*
//      * Make sure another connection attempt
//      * is allowed to try joining the room again.
//      */
//     joinedSocketRoomRef.current = null;

//     return;
//   }

//   /*
//    * The backend has confirmed the room join.
//    */
//   setSocketRoomJoined(true);

//   /*
//    * Only mark the room as joined AFTER
//    * receiving the backend acknowledgement.
//    */
//   joinedSocketRoomRef.current = roomId;
// };

//     /*
//      * Another participant joined the Socket.IO room.
//      */
//     const handleParticipantJoined =
//       (
//         payload: SocketParticipantJoinedPayload,
//       ) => {
//         if (cancelled) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] participant_joined_room:",
//           payload,
//         );

//         const count = Number(
//           payload?.joinedCount ??
//             payload?.joined_count ??
//             payload?.participantCount ??
//             payload?.participant_count ??
//             NaN,
//         );

//         if (
//           Number.isFinite(count)
//         ) {
//           setSocketParticipantCount(
//             count,
//           );
//         }

//         /*
//          * Refresh the REST quiz data so the
//          * player grid stays synchronized.
//          *
//          * This does NOT wait for the 60-second
//          * polling interval.
//          */
//         void loadQuiz(true);
//       };

//     /*
//      * Backend has started a round.
//      */
//     const handleRoundStarted =
//       (
//         payload: SocketRoundStartedPayload,
//       ) => {
//         if (cancelled) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] round_started:",
//           payload,
//         );

//         /*
//          * We don't require the payload to contain
//          * quizId because the student is already
//          * connected to the correct room.
//          */
//         setStatus("live");

//         /*
//          * Enter the gameplay page immediately.
//          */
//         enterPlayPage();
//       };

//     /*
//      * Register listeners.
//      */
//     socket.on(
//       "connect",
//       handleConnect,
//     );

//     socket.on(
//       "disconnect",
//       handleDisconnect,
//     );

//     socket.on(
//       "joined_room_ack",
//       handleJoinedRoomAck,
//     );

//     socket.on(
//       "participant_joined_room",
//       handleParticipantJoined,
//     );

//     socket.on(
//       "round_started",
//       handleRoundStarted,
//     );

//     /*
//      * If the socket is already connected
//      * before these listeners were registered,
//      * join the room immediately.
//      */
//     if (socket.connected) {
//       handleConnect();
//     }

//     return () => {
//       cancelled = true;

//       socket.off(
//         "connect",
//         handleConnect,
//       );

//       socket.off(
//         "disconnect",
//         handleDisconnect,
//       );

//       socket.off(
//         "joined_room_ack",
//         handleJoinedRoomAck,
//       );

//       socket.off(
//         "participant_joined_room",
//         handleParticipantJoined,
//       );

//       socket.off(
//         "round_started",
//         handleRoundStarted,
//       );

//       /*
//        * We only disconnect this shared socket
//        * when this waiting-room page is removed.
//        */
//       disconnectQuizSocket();

//       joinedSocketRoomRef.current =
//         null;

//       setSocketConnected(false);
//       setSocketRoomJoined(false);
//     };
//   }, [
//     quiz?.room_id,
//     quizId,
//     loadQuiz,
//     enterPlayPage,
//   ]);

//   /* =======================================================
//      60-SECOND REST FALLBACK
     
//      Socket.IO is now the primary mechanism for
//      round_started.
     
//      REST polling remains as a fallback in case:
     
//      - Socket.IO disconnects.
//      - Backend doesn't emit the event.
//      - The page was opened after the round started.
     
//      It still only polls after the contestant
//      count is full.
//   ======================================================= */

//   useEffect(() => {
//     if (!quizId || !quiz) {
//       return;
//     }

//     const joinedCount =
//       Array.isArray(
//         quiz.joined_users,
//       )
//         ? quiz.joined_users.length
//         : 0;

//     const maxPlayers = Math.max(
//       Number(
//         quiz.no_of_contestants ?? 0,
//       ),
//       0,
//     );

//     const isContestantsFull =
//       maxPlayers > 0 &&
//       joinedCount >= maxPlayers;

//     const currentRound = Number(
//       quiz.current_round ?? 0,
//     );

//     const competitionStatus =
//       String(
//         quiz.status ?? "",
//       ).toUpperCase();

//     const isCompleted =
//       competitionStatus ===
//         "COMPLETED" ||
//       competitionStatus ===
//         "FINISHED";

//     const isLive =
//       currentRound > 0;

//     /*
//      * Cancel an existing timeout.
//      */
//     if (
//       pollingTimeoutRef.current !==
//       null
//     ) {
//       window.clearTimeout(
//         pollingTimeoutRef.current,
//       );

//       pollingTimeoutRef.current =
//         null;
//     }

//     /*
//      * Don't poll until the lobby is full.
//      */
//     if (!isContestantsFull) {
//       return;
//     }

//     /*
//      * Stop polling when completed.
//      */
//     if (isCompleted) {
//       return;
//     }

//     /*
//      * Stop polling after the REST API confirms
//      * that a round has started.
//      */
//     if (isLive) {
//       return;
//     }

//     let cancelled = false;

//     const scheduleNextPoll =
//       () => {
//         if (cancelled) {
//           return;
//         }

//         pollingTimeoutRef.current =
//           window.setTimeout(
//             async () => {
//               if (cancelled) {
//                 return;
//               }

//               await loadQuiz(true);

//               if (!cancelled) {
//                 scheduleNextPoll();
//               }
//             },
//             POLLING_INTERVAL,
//           );
//       };

//     scheduleNextPoll();

//     return () => {
//       cancelled = true;

//       if (
//         pollingTimeoutRef.current !==
//         null
//       ) {
//         window.clearTimeout(
//           pollingTimeoutRef.current,
//         );

//         pollingTimeoutRef.current =
//           null;
//       }
//     };
//   }, [
//     quiz,
//     quizId,
//     loadQuiz,
//   ]);

//   /* =======================================================
//      AUTO-ENTER PLAY WHEN REST DETECTS START
     
//      Socket.IO normally handles this faster.
//      This is the fallback for:
     
//      current_round > 0
//   ======================================================= */

//   useEffect(() => {
//     if (!quiz) {
//       return;
//     }

//     const currentRound = Number(
//       quiz.current_round ?? 0,
//     );

//     if (currentRound > 0) {
//       enterPlayPage();
//     }
//   }, [
//     quiz,
//     enterPlayPage,
//   ]);

//   /* =======================================================
//      MANUAL REFRESH
//   ======================================================= */

//   const handleRefresh =
//     async () => {
//       await loadQuiz(true);
//     };

//   /* =======================================================
//      DERIVED DATA
//   ======================================================= */

//   const joinedUsers =
//     useMemo(
//       () =>
//         Array.isArray(
//           quiz?.joined_users,
//         )
//           ? quiz.joined_users
//           : [],
//       [quiz],
//     );

//   const maxPlayers = Math.max(
//     Number(
//       quiz?.no_of_contestants ??
//         20,
//     ),
//     1,
//   );

//   const joinedCount =
//     joinedUsers.length;

//   const isContestantsFull =
//     joinedCount >= maxPlayers;

//   const spotsLeft = Math.max(
//     maxPlayers -
//       joinedCount,
//     0,
//   );

//   const playerPercentage =
//     maxPlayers > 0
//       ? Math.min(
//           100,
//           Math.round(
//             (joinedCount /
//               maxPlayers) *
//               100,
//           ),
//         )
//       : 0;

//   const currentRound =
//     Number(
//       quiz?.current_round ?? 0,
//     );

//   const totalRounds =
//     Number(
//       quiz?.number_of_rounds ??
//         quiz?.round_information
//           ?.length ??
//         0,
//     );

//   const totalQuestions = quiz
//     ? getTotalQuestions(quiz)
//     : 0;

//   const qualificationSequence =
//     quiz
//       ? getQualificationSequence(
//           quiz,
//         )
//       : [20, 15, 10, 5, 2, 1];

//   const currentRoundName =
//     quiz
//       ? getRoundLabel(
//           currentRound,
//           quiz,
//         )
//       : "Waiting Room";

//   const hasRoom = Boolean(
//     quiz?.room_id?.trim(),
//   );

//   const subjectName = quiz
//     ? getSubjectName(quiz)
//     : "";

//   /*
//    * Automatic REST fallback polling is active
//    * only when the lobby is full and the quiz
//    * has not started.
//    */
//   const isPollingActive =
//     Boolean(
//       isContestantsFull &&
//         currentRound <= 0 &&
//         ![
//           "COMPLETED",
//           "FINISHED",
//         ].includes(
//           String(
//             quiz?.status ?? "",
//           ).toUpperCase(),
//         ),
//     );

//   /* =======================================================
//      WAITING MESSAGE
//   ======================================================= */

//   const waitingMessage =
//     useMemo(() => {
//       if (!quiz) {
//         return "";
//       }

//       if (!isContestantsFull) {
//         return `Waiting for ${spotsLeft} more contestant${
//           spotsLeft === 1
//             ? ""
//             : "s"
//         } to join the competition.`;
//       }

//       if (!hasRoom) {
//         return "All contestants have joined. Waiting for the Admin to create the competition room.";
//       }

//       if (
//         socketRoomJoined
//       ) {
//         return "You are connected to the competition room. Waiting for the Admin to start the first round.";
//       }

//       return "The competition room has been created. Connecting you to the competition room...";
//     }, [
//       quiz,
//       isContestantsFull,
//       spotsLeft,
//       hasRoom,
//       socketRoomJoined,
//     ]);

//   /* =======================================================
//      ENTER COMPETITION
//   ======================================================= */

//   const handleEnterCompetition =
//     () => {
//       enterPlayPage();
//     };

//   /* =======================================================
//      LEAVE
//   ======================================================= */

//   const handleLeave =
//     () => {
//       disconnectQuizSocket();

//       router.push(
//         "/student/quiz-board",
//       );
//     };

//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (
//     status === "loading" ||
//     !quiz
//   ) {
//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
//           <div className="text-center">
//             <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-400" />

//             <h1 className="text-lg font-bold text-white">
//               Loading Quiz Board...
//             </h1>

//             <p className="mt-2 text-sm text-slate-400">
//               Preparing your competition
//               waiting room.
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      ERROR
//   ======================================================= */

//   if (status === "error") {
//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
//           <Card className="w-full border-red-500/20 bg-white/[0.04] p-8 text-center shadow-none">
//             <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
//               <Shield className="h-7 w-7 text-red-400" />
//             </div>

//             <h1 className="text-xl font-bold text-white">
//               Unable to Load Competition
//             </h1>

//             <p className="mt-3 text-sm text-slate-400">
//               {error}
//             </p>

//             <div className="mt-6 flex flex-wrap justify-center gap-3">
//               <Button
//                 onClick={() =>
//                   loadQuiz()
//                 }
//                 className="bg-blue-600 text-white hover:bg-blue-500"
//               >
//                 Try Again
//               </Button>

//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   router.push(
//                     "/student/quiz-board",
//                   )
//                 }
//                 className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//               >
//                 Back to Quiz Board
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      MAIN ARENA
//   ======================================================= */

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       {/* BACKGROUND */}

//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[120px]" />

//         <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-[120px]" />
//       </div>

//       <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* HEADER */}

//         <div className="mb-6 flex items-center justify-between gap-4">
//           <Button
//             variant="ghost"
//             onClick={handleLeave}
//             className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Quiz Board
//           </Button>

//           <div className="flex items-center gap-2">
//             {/* SOCKET STATUS */}

//             <div
//               className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
//                 socketConnected
//                   ? "border-green-500/20 bg-green-500/10"
//                   : "border-yellow-500/20 bg-yellow-500/10"
//               }`}
//             >
//               {socketConnected ? (
//                 <>
//                   <Wifi className="h-4 w-4 text-green-400" />

//                   <span className="text-xs font-semibold text-green-300">
//                     Socket Connected
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <WifiOff className="h-4 w-4 text-yellow-400" />

//                   <span className="text-xs font-semibold text-yellow-300">
//                     Socket Offline
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* ROOM JOIN STATUS */}

//             {hasRoom && (
//               <div
//                 className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
//                   socketRoomJoined
//                     ? "border-green-500/20 bg-green-500/10"
//                     : "border-blue-500/20 bg-blue-500/10"
//                 }`}
//               >
//                 {socketRoomJoined ? (
//                   <>
//                     <CheckCircle2 className="h-4 w-4 text-green-400" />

//                     <span className="text-xs font-semibold text-green-300">
//                       In Room
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin text-blue-400" />

//                     <span className="text-xs font-semibold text-blue-300">
//                       Joining Room
//                     </span>
//                   </>
//                 )}
//               </div>
//             )}

//             {/* AUTO REFRESH STATUS */}

//             <div
//               className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
//                 isPollingActive
//                   ? "border-blue-500/20 bg-blue-500/10"
//                   : "border-white/10 bg-white/[0.04]"
//               }`}
//             >
//               {isPollingActive ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin text-blue-400" />

//                   <span className="text-xs font-semibold text-blue-300">
//                     Checks every 60s
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="h-4 w-4 text-slate-500" />

//                   <span className="text-xs font-semibold text-slate-400">
//                     Auto-check paused
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* ROOM */}

//             <div
//               className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
//                 hasRoom
//                   ? "border-green-500/20 bg-green-500/10"
//                   : "border-yellow-500/20 bg-yellow-500/10"
//               }`}
//             >
//               {hasRoom ? (
//                 <>
//                   <CheckCircle2 className="h-4 w-4 text-green-400" />

//                   <span className="text-xs font-semibold text-green-300">
//                     Room Created
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <WifiOff className="h-4 w-4 text-yellow-400" />

//                   <span className="text-xs font-semibold text-yellow-300">
//                     Waiting for Room
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* STATUS */}

//             <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 md:flex">
//               <Radio className="h-4 w-4 text-blue-400" />

//               <span className="text-xs font-semibold text-slate-300">
//                 {status ===
//                 "waiting_for_players"
//                   ? "Waiting for Players"
//                   : status ===
//                       "waiting_for_room"
//                     ? "Waiting for Room"
//                     : status ===
//                         "waiting_for_start"
//                       ? "Waiting to Start"
//                       : formatStatus(
//                           quiz.status,
//                         )}
//               </span>
//             </div>

//             {/* MANUAL REFRESH */}

//             <Button
//               variant="ghost"
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
//             >
//               {refreshing ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 "Refresh"
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* MAIN HEADING */}

//         <section className="mb-6 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-950 p-6 shadow-none sm:p-8">
//           <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
//             <div>
//               <div className="mb-3 flex flex-wrap items-center gap-2">
//                 <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
//                   Quiz Board Arena
//                 </span>

//                 {subjectName && (
//                   <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
//                     {subjectName}
//                   </span>
//                 )}

//                 {hasRoom && (
//                   <span className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
//                     <Wifi className="h-3.5 w-3.5" />
//                     Room Ready
//                   </span>
//                 )}
//               </div>

//               <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
//                 {quiz.quiz_title ||
//                   "Quiz Competition"}
//               </h1>

//               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
//                 {quiz.description ||
//                   "Compete against other students, qualify through each round, and become the Quiz Board champion."}
//               </p>

//               {/* ROOM ID */}

//               {quiz.room_id && (
//                 <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
//                   <Radio className="h-3.5 w-3.5 text-blue-400" />

//                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Room
//                   </span>

//                   <span className="max-w-[320px] truncate font-mono text-xs font-bold text-slate-300">
//                     {quiz.room_id}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
//               <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                 Current Stage
//               </div>

//               <div className="mt-2 flex items-center justify-center gap-2">
//                 <Zap className="h-5 w-5 text-yellow-400" />

//                 <span className="text-xl font-black text-white">
//                   {currentRoundName}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ERROR */}

//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         {/* =================================================
//             WAITING ROOM
//         ================================================= */}

//         <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
//           {/* PLAYERS */}

//           <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
//             <div className="mb-6 flex items-center justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-blue-400" />

//                   <h2 className="font-bold text-white">
//                     Competition Lobby
//                   </h2>
//                 </div>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Students currently registered
//                   for this competition
//                 </p>
//               </div>

//               <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2">
//                 <span className="text-lg font-black text-blue-300">
//                   {joinedCount}
//                 </span>

//                 <span className="text-sm text-slate-500">
//                   {" "}
//                   / {maxPlayers}
//                 </span>
//               </div>
//             </div>

//             {/* PROGRESS */}

//             <div className="mb-6">
//               <div className="mb-2 flex items-center justify-between text-xs">
//                 <span className="text-slate-500">
//                   Lobby capacity
//                 </span>

//                 <span className="font-bold text-slate-300">
//                   {playerPercentage}%
//                 </span>
//               </div>

//               <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
//                 <div
//                   className={`h-full rounded-full transition-all duration-500 ${
//                     isContestantsFull
//                       ? "bg-green-500"
//                       : "bg-blue-500"
//                   }`}
//                   style={{
//                     width: `${playerPercentage}%`,
//                   }}
//                 />
//               </div>
//             </div>

//             {/* PLAYER GRID */}

//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
//               {Array.from({
//                 length: Math.max(
//                   maxPlayers,
//                   joinedCount,
//                 ),
//               }).map(
//                 (_, index) => {
//                   const player =
//                     joinedUsers[index];

//                   if (!player) {
//                     return (
//                       <div
//                         key={`empty-${index}`}
//                         className="flex min-h-[82px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]"
//                       >
//                         <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.04]">
//                           <Users className="h-4 w-4 text-slate-600" />
//                         </div>

//                         <span className="text-[11px] text-slate-600">
//                           Waiting...
//                         </span>
//                       </div>
//                     );
//                   }

//                   const playerName =
//                     getUserName(
//                       player,
//                       index,
//                     );

//                   const playerKey =
//                     getEntityId(
//                       player,
//                     ) ||
//                     `player-${index}`;

//                   return (
//                     <div
//                       key={playerKey}
//                       className="relative min-h-[82px] rounded-2xl border border-white/10 bg-white/[0.03] p-3"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-black text-blue-300">
//                           {getUserInitials(
//                             playerName,
//                           )}
//                         </div>

//                         <div className="min-w-0">
//                           <div className="truncate text-xs font-bold text-slate-200">
//                             {playerName}
//                           </div>

//                           <div className="mt-1 flex items-center gap-1 text-[10px] text-green-400">
//                             <CheckCircle2 className="h-3 w-3" />
//                             Joined
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 },
//               )}
//             </div>

//             {/* SOCKET PARTICIPANT INFO */}

//             {hasRoom && (
//               <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     {socketRoomJoined ? (
//                       <CheckCircle2 className="h-4 w-4 text-green-400" />
//                     ) : (
//                       <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
//                     )}

//                     <span className="text-xs font-semibold text-slate-300">
//                       {socketRoomJoined
//                         ? "You are connected to the competition room"
//                         : "Connecting to competition room..."}
//                     </span>
//                   </div>

//                   {socketParticipantCount !==
//                     null && (
//                     <span className="text-xs font-bold text-slate-500">
//                       Socket participants:{" "}
//                       {
//                         socketParticipantCount
//                       }
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </Card>

//           {/* COMPETITION INFO */}

//           <div className="space-y-6">
//             <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
//               <div className="mb-5 flex items-center gap-2">
//                 <Trophy className="h-5 w-5 text-yellow-400" />

//                 <h2 className="font-bold text-white">
//                   Competition Info
//                 </h2>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Players
//                   </span>

//                   <span className="font-bold text-white">
//                     {joinedCount} /{" "}
//                     {maxPlayers}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Rounds
//                   </span>

//                   <span className="font-bold text-white">
//                     {totalRounds}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Total Questions
//                   </span>

//                   <span className="font-bold text-white">
//                     {totalQuestions}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Time / Question
//                   </span>

//                   <span className="flex items-center gap-1 font-bold text-white">
//                     <Clock3 className="h-4 w-4 text-blue-400" />

//                     {quiz.time_per_question ??
//                       20}
//                     s
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Scheduled Time
//                   </span>

//                   <span className="max-w-[170px] text-right text-xs font-semibold text-slate-300">
//                     {formatStartDate(
//                       quiz.start_date,
//                     )}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Contestants
//                   </span>

//                   <span
//                     className={`text-xs font-bold ${
//                       isContestantsFull
//                         ? "text-green-400"
//                         : "text-yellow-400"
//                     }`}
//                   >
//                     {isContestantsFull
//                       ? "Full"
//                       : `${spotsLeft} spot${
//                           spotsLeft ===
//                           1
//                             ? ""
//                             : "s"
//                         } left`}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Competition Room
//                   </span>

//                   <span
//                     className={`flex items-center gap-1.5 text-xs font-bold ${
//                       hasRoom
//                         ? "text-green-400"
//                         : "text-yellow-400"
//                     }`}
//                   >
//                     {hasRoom ? (
//                       <>
//                         <Wifi className="h-3.5 w-3.5" />
//                         Created
//                       </>
//                     ) : (
//                       <>
//                         <WifiOff className="h-3.5 w-3.5" />
//                         Not Created
//                       </>
//                     )}
//                   </span>
//                 </div>

//                 {/* SOCKET */}

//                 {hasRoom && (
//                   <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                     <span className="text-sm text-slate-500">
//                       Live Connection
//                     </span>

//                     <span
//                       className={`flex items-center gap-1.5 text-xs font-bold ${
//                         socketRoomJoined
//                           ? "text-green-400"
//                           : socketConnected
//                             ? "text-blue-400"
//                             : "text-yellow-400"
//                       }`}
//                     >
//                       {socketRoomJoined ? (
//                         <>
//                           <CheckCircle2 className="h-3.5 w-3.5" />
//                           In Room
//                         </>
//                       ) : socketConnected ? (
//                         <>
//                           <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                           Joining
//                         </>
//                       ) : (
//                         <>
//                           <WifiOff className="h-3.5 w-3.5" />
//                           Offline
//                         </>
//                       )}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {/* QUALIFICATION */}

//             <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
//               <div className="mb-5 flex items-center gap-2">
//                 <Medal className="h-5 w-5 text-indigo-400" />

//                 <h2 className="font-bold text-white">
//                   Qualification
//                 </h2>
//               </div>

//               <div className="flex items-center gap-1 overflow-x-auto pb-2">
//                 {qualificationSequence.map(
//                   (
//                     players,
//                     index,
//                   ) => (
//                     <div
//                       key={`${players}-${index}`}
//                       className="flex shrink-0 items-center"
//                     >
//                       <div
//                         className={`flex h-11 min-w-[50px] items-center justify-center rounded-xl border px-3 text-sm font-black ${
//                           index === 0
//                             ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
//                             : players ===
//                                 1
//                               ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
//                               : "border-white/10 bg-white/[0.03] text-slate-300"
//                         }`}
//                       >
//                         {players}
//                       </div>

//                       {index <
//                         qualificationSequence.length -
//                           1 && (
//                         <div className="px-1 text-slate-700">
//                           →
//                         </div>
//                       )}
//                     </div>
//                   ),
//                 )}
//               </div>

//               <p className="mt-3 text-xs leading-5 text-slate-500">
//                 The fastest students who answer
//                 correctly progress through each
//                 elimination round until the final
//                 winner is determined.
//               </p>
//             </Card>
//           </div>
//         </section>

//         {/* =================================================
//             WAITING STATES
//         ================================================= */}

//         <section className="mt-6">
//           {/* WAITING FOR PLAYERS */}

//           {status ===
//             "waiting_for_players" && (
//             <Card className="border-yellow-500/20 bg-yellow-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
//                 <Users className="h-8 w-8 text-yellow-400" />
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 Waiting for Contestants
//               </h2>

//               <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
//                 Other contestants still need
//                 to join the competition before
//                 the room preparation process
//                 begins.
//               </p>

//               <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
//                 <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3">
//                   <span className="text-2xl font-black text-blue-300">
//                     {joinedCount}
//                   </span>

//                   <span className="ml-1 text-sm text-slate-500">
//                     joined
//                   </span>
//                 </div>

//                 <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3">
//                   <span className="text-2xl font-black text-yellow-300">
//                     {spotsLeft}
//                   </span>

//                   <span className="ml-1 text-sm text-slate-500">
//                     remaining
//                   </span>
//                 </div>
//               </div>

//               <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-black/20 px-4 py-3">
//                 <p className="text-sm font-semibold text-slate-300">
//                   {waitingMessage}
//                 </p>
//               </div>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={handleLeave}
//                   variant="outline"
//                   className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Leave Arena
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {/* WAITING FOR ROOM */}

//           {status ===
//             "waiting_for_room" && (
//             <Card className="border-blue-500/20 bg-blue-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
//                 <Wifi className="h-8 w-8 text-blue-400" />
//               </div>

//               <div className="mb-2 flex items-center justify-center gap-2">
//                 <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

//                 <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
//                   Lobby Full
//                 </span>
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 Waiting for Competition Room
//               </h2>

//               <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
//                 All required contestants have
//                 joined. The Admin can now create
//                 the competition room.
//               </p>

//               <div className="mt-6 flex justify-center">
//                 <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-7 py-4">
//                   <div className="text-3xl font-black text-green-300">
//                     {joinedCount} /{" "}
//                     {maxPlayers}
//                   </div>

//                   <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
//                     Contestants Joined
//                   </div>
//                 </div>
//               </div>

//               <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-black/20 px-4 py-3">
//                 <p className="text-sm font-semibold text-slate-300">
//                   {waitingMessage}
//                 </p>
//               </div>

//               <div className="mt-5 flex items-center justify-center gap-2 text-xs text-blue-300">
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                 Checking for room creation
//                 every 60 seconds
//               </div>

//               <p className="mt-2 text-[11px] text-slate-600">
//                 You can also use Refresh to check
//                 immediately.
//               </p>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={handleLeave}
//                   variant="outline"
//                   className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Leave Arena
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {/* WAITING FOR ADMIN TO START */}

//           {status ===
//             "waiting_for_start" && (
//             <Card className="border-indigo-500/20 bg-indigo-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
//                 <Radio className="h-8 w-8 animate-pulse text-indigo-400" />
//               </div>

//               <div className="mb-2 flex items-center justify-center gap-2">
//                 <span
//                   className={`h-2 w-2 animate-pulse rounded-full ${
//                     socketRoomJoined
//                       ? "bg-green-400"
//                       : "bg-yellow-400"
//                   }`}
//                 />

//                 <span
//                   className={`text-xs font-bold uppercase tracking-wider ${
//                     socketRoomJoined
//                       ? "text-green-400"
//                       : "text-yellow-400"
//                   }`}
//                 >
//                   {socketRoomJoined
//                     ? "Connected to Room"
//                     : "Connecting to Room"}
//                 </span>
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 Waiting for Competition to Start
//               </h2>

//               <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
//                 All contestants are present and
//                 the competition room has been
//                 created. Stay here while the
//                 Admin starts the first round.
//               </p>

//               <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
//                 <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-3">
//                   <span className="text-2xl font-black text-green-300">
//                     {joinedCount}
//                   </span>

//                   <span className="ml-1 text-sm text-slate-500">
//                     joined
//                   </span>
//                 </div>

//                 <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3">
//                   <span className="text-2xl font-black text-blue-300">
//                     {maxPlayers}
//                   </span>

//                   <span className="ml-1 text-sm text-slate-500">
//                     required
//                   </span>
//                 </div>

//                 <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3">
//                   <span className="text-2xl font-black text-indigo-300">
//                     {totalRounds}
//                   </span>

//                   <span className="ml-1 text-sm text-slate-500">
//                     rounds
//                   </span>
//                 </div>
//               </div>

//               <div className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2">
//                 <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300">
//                   <CheckCircle2 className="h-3.5 w-3.5" />
//                   Contestants full
//                 </span>

//                 <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300">
//                   <CheckCircle2 className="h-3.5 w-3.5" />
//                   Room created
//                 </span>

//                 <span
//                   className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
//                     socketRoomJoined
//                       ? "border-green-500/20 bg-green-500/10 text-green-300"
//                       : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
//                   }`}
//                 >
//                   {socketRoomJoined ? (
//                     <CheckCircle2 className="h-3.5 w-3.5" />
//                   ) : (
//                     <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                   )}

//                   {socketRoomJoined
//                     ? "Connected to live room"
//                     : "Connecting to live room"}
//                 </span>
//               </div>

//               <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-black/20 px-4 py-3">
//                 <p className="text-sm font-semibold text-slate-300">
//                   {waitingMessage}
//                 </p>
//               </div>

//               {quiz.room_id && (
//                 <div className="mx-auto mt-5 max-w-md rounded-xl border border-white/10 bg-black/20 px-4 py-3">
//                   <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Competition Room ID
//                   </div>

//                   <div className="mt-1 break-all font-mono text-xs font-bold text-blue-300">
//                     {quiz.room_id}
//                   </div>
//                 </div>
//               )}

//               <div className="mt-5 flex items-center justify-center gap-2 text-xs text-blue-300">
//                 <Radio className="h-3.5 w-3.5 animate-pulse" />
//                 Listening for the Admin to
//                 start the first round
//               </div>

//               <p className="mt-2 text-[11px] text-slate-600">
//                 The competition will open
//                 automatically when the backend
//                 sends the round_started event.
//               </p>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={handleLeave}
//                   variant="outline"
//                   className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Leave Arena
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {/* LIVE */}

//           {status === "live" && (
//             <Card className="border-indigo-500/20 bg-indigo-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
//                 <Radio className="h-8 w-8 animate-pulse text-indigo-400" />
//               </div>

//               <div className="mb-2 flex items-center justify-center gap-2">
//                 <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

//                 <span className="text-xs font-bold uppercase tracking-wider text-red-400">
//                   Live
//                 </span>
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 {currentRoundName}
//               </h2>

//               <p className="mt-2 text-sm text-slate-400">
//                 The competition has started.
//                 Enter the arena to continue.
//               </p>

//               <div className="mt-4 flex justify-center">
//                 <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-300">
//                   <Wifi className="h-3.5 w-3.5" />
//                   Competition is live
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={
//                     handleEnterCompetition
//                   }
//                   className="h-12 bg-blue-600 px-8 font-bold text-white hover:bg-blue-500"
//                 >
//                   <Zap className="mr-2 h-5 w-5" />
//                   Enter Competition
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {/* COMPLETED */}

//           {status ===
//             "completed" && (
//             <Card className="border-yellow-500/20 bg-yellow-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
//                 <Crown className="h-8 w-8 text-yellow-400" />
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 Competition Completed
//               </h2>

//               <p className="mt-2 text-sm text-slate-400">
//                 This Quiz Board competition
//                 has ended.
//               </p>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={handleLeave}
//                   className="bg-blue-600 text-white hover:bg-blue-500"
//                 >
//                   Back to Quiz Board
//                 </Button>
//               </div>
//             </Card>
//           )}
//         </section>

//         {/* =================================================
//             REWARDS
//         ================================================= */}

//         <section className="mt-6 grid gap-6 md:grid-cols-2">
//           <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10">
//                 <Crown className="h-5 w-5 text-yellow-400" />
//               </div>

//               <div>
//                 <p className="text-xs uppercase tracking-wider text-slate-500">
//                   Champion
//                 </p>

//                 <p className="text-xl font-black text-white">
//                   {quiz
//                     .final_round_information
//                     ?.first_position_reward ??
//                     0}{" "}
//                   Points
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
//                 <Medal className="h-5 w-5 text-slate-300" />
//               </div>

//               <div>
//                 <p className="text-xs uppercase tracking-wider text-slate-500">
//                   Runner-up
//                 </p>

//                 <p className="text-xl font-black text-white">
//                   {quiz
//                     .final_round_information
//                     ?.second_position_reward ??
//                     0}{" "}
//                   Points
//                 </p>
//               </div>
//             </div>
//           </Card>
//         </section>

//         {/* =================================================
//             FOOTER
//         ================================================= */}

//         <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row">
//           <div className="flex items-center gap-2">
//             <Sparkles className="h-3.5 w-3.5" />

//             JAMB League Quiz Board
//           </div>

//           <div className="flex items-center gap-4">
//             <span className="flex items-center gap-1">
//               <MessageCircle className="h-3.5 w-3.5" />

//               Live Competition
//             </span>

//             <span className="flex items-center gap-1">
//               {socketConnected ? (
//                 <Wifi className="h-3.5 w-3.5 text-green-500" />
//               ) : (
//                 <WifiOff className="h-3.5 w-3.5 text-yellow-500" />
//               )}

//               {socketConnected
//                 ? "Socket Connected"
//                 : "Socket Offline"}
//             </span>

//             <span>
//               Round{" "}
//               {Math.max(
//                 currentRound,
//                 0,
//               )}{" "}
//               / {totalRounds}
//             </span>

//             <span className="hidden lg:inline">
//               Updated{" "}
//               {new Date(
//                 lastUpdated,
//               ).toLocaleTimeString(
//                 "en-NG",
//                 {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                 },
//               )}
//             </span>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
















"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getQuizById } from "@/lib/api/quizCompetition";

import {
  getQuizSocket,
  disconnectQuizSocket,
} from "@/lib/socket/quizSocket";

/* ============================================================
   CONSTANTS
============================================================ */

const POLLING_INTERVAL = 60_000;

const PLAY_SESSION_PREFIX = "quiz-play-";

/* ============================================================
   TYPES
============================================================ */

type LobbyStatus =
  | "loading"
  | "waiting_for_players"
  | "waiting_for_room"
  | "waiting_for_start"
  | "live"
  | "completed"
  | "error";

interface QuizCompetition {
  _id?: string;
  id?: string;

  quiz_title?: string;
  description?: string;

  subject?: unknown;

  time_per_question?: number;
  start_date?: string;

  no_of_contestants?: number;
  number_of_rounds?: number;

  joined_users?: unknown[];

  current_round?: number;

  room_id?: string | null;

  status?: string;

  round_information?: unknown[];

  final_round_information?: {
    no_of_questions?: number;
    difficultyBreakdown?: {
      easy?: number;
      medium?: number;
      hard?: number;
    };
    first_position_reward?: number;
    second_position_reward?: number;
  };

  [key: string]: unknown;
}

/* ============================================================
   SOCKET PAYLOADS
============================================================ */

type SocketRoundStartedPayload = {
  quizId?: string;
  quiz_id?: string;

  roomId?: string;
  room_id?: string;

  currentRound?: number;
  current_round?: number;

  round?: number;
  round_number?: number;
};

type SocketJoinedRoomAckPayload = {
  success?: boolean;
  message?: string;

  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;
};

type SocketParticipantJoinedPayload = {
  userId?: string;
  user_id?: string;

  participantId?: string;
  participant_id?: string;

  roomId?: string;
  room_id?: string;

  joinedCount?: number;
  joined_count?: number;

  participantCount?: number;
  participant_count?: number;
};

/* ============================================================
   PLAY SESSION DATA
============================================================ */

interface QuizPlaySession {
  quizId: string;

  quiz_title: string;
  subject: string;

  description: string;

  current_round: number;
  number_of_rounds: number;

  time_per_question: number;

  no_of_contestants: number;
  joined_count: number;

  room_id: string | null;

  start_date: string;
}

/* ============================================================
   HELPERS
============================================================ */

function normalizeStatus(status?: string) {
  return String(status || "")
    .trim()
    .toUpperCase();
}

function getQuizId(quiz: QuizCompetition | null) {
  if (!quiz) {
    return "";
  }

  return String(
    quiz._id ||
      quiz.id ||
      "",
  ).trim();
}

function getSubjectLabel(subject: unknown) {
  if (!subject) {
    return "General";
  }

  if (typeof subject === "string") {
    return subject;
  }

  if (
    typeof subject === "object" &&
    subject !== null
  ) {
    const value =
      subject as Record<string, unknown>;

    return String(
      value.name ||
        value.title ||
        value.subject_name ||
        value.subjectName ||
        value.label ||
        "General",
    );
  }

  return "General";
}

function getJoinedUsers(
  quiz: QuizCompetition | null,
): unknown[] {
  if (!quiz) {
    return [];
  }

  if (Array.isArray(quiz.joined_users)) {
    return quiz.joined_users;
  }

  const quizRecord =
    quiz as Record<string, unknown>;

  if (Array.isArray(quizRecord.joinedUsers)) {
    return quizRecord.joinedUsers;
  }

  if (Array.isArray(quizRecord.participants)) {
    return quizRecord.participants;
  }

  return [];
}

function getJoinedCount(
  quiz: QuizCompetition | null,
) {
  return getJoinedUsers(quiz).length;
}

function getContestantCapacity(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.no_of_contestants || 0,
  );

  return Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function isQuizFull(
  quiz: QuizCompetition | null,
) {
  const joined = getJoinedCount(quiz);
  const capacity = getContestantCapacity(quiz);

  return capacity > 0 && joined >= capacity;
}

function getCurrentRound(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.current_round || 0,
  );

  return Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

function getNumberOfRounds(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.number_of_rounds || 0,
  );

  return Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function getTimePerQuestion(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.time_per_question || 0,
  );

  return Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function hasRoom(
  quiz: QuizCompetition | null,
) {
  return Boolean(
    quiz?.room_id &&
      String(quiz.room_id).trim(),
  );
}

function hasScheduledTimePassed(
  quiz: QuizCompetition | null,
) {
  if (!quiz?.start_date) {
    return false;
  }

  const timestamp = Date.parse(
    quiz.start_date,
  );

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  return Date.now() >= timestamp;
}

function formatDateTime(
  value?: string,
) {
  if (!value) {
    return "Not scheduled";
  }

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(timestamp));
}

function getApiErrorMessage(
  error: unknown,
) {
  const value =
    error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

  return (
    value?.response?.data?.message ||
    value?.response?.data?.error ||
    value?.message ||
    "Unable to load this competition."
  );
}

/* ============================================================
   RESPONSE NORMALIZER

   Supports the common response shapes used by the API wrapper.
============================================================ */

function extractQuiz(
  payload: unknown,
): QuizCompetition | null {
  if (!payload) {
    return null;
  }

  if (
    typeof payload !== "object" ||
    payload === null
  ) {
    return null;
  }

  const root =
    payload as Record<string, unknown>;

  const candidates: unknown[] = [
    root.quiz,
    root.quizObj,
    root.quizCompetition,
    root.quizCompetitionObj,

    root.data,

    typeof root.data === "object" &&
    root.data !== null
      ? (root.data as Record<string, unknown>)
          .quiz
      : undefined,

    typeof root.data === "object" &&
    root.data !== null
      ? (root.data as Record<string, unknown>)
          .quizObj
      : undefined,

    typeof root.data === "object" &&
    root.data !== null
      ? (
          root.data as Record<
            string,
            unknown
          >
        ).quizCompetition
      : undefined,

    typeof root.data === "object" &&
    root.data !== null
      ? (
          root.data as Record<
            string,
            unknown
          >
        ).quizCompetitionObj
      : undefined,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      const object =
        candidate as Record<
          string,
          unknown
        >;

      if (
        "quiz_title" in object ||
        "_id" in object ||
        "id" in object ||
        "joined_users" in object
      ) {
        return object as QuizCompetition;
      }
    }
  }

  return null;
}

/* ============================================================
   QUALIFICATION SEQUENCE
============================================================ */

function getQualificationSequence(
  quiz: QuizCompetition | null,
) {
  const capacity =
    getContestantCapacity(quiz);

  if (capacity <= 0) {
    return [];
  }

  const sequence: number[] = [
    capacity,
  ];

  const rounds =
    Array.isArray(
      quiz?.round_information,
    )
      ? quiz.round_information
      : [];

  const sortedRounds = [...rounds].sort(
    (a, b) => {
      const first =
        Number(
          (
            a as Record<
              string,
              unknown
            >
          ).round_number || 0,
        );

      const second =
        Number(
          (
            b as Record<
              string,
              unknown
            >
          ).round_number || 0,
        );

      return first - second;
    },
  );

  let remaining = capacity;

  for (const round of sortedRounds) {
    const value =
      round as Record<
        string,
        unknown
      >;

    const exitNumber = Number(
      value.exit_number || 0,
    );

    if (
      Number.isFinite(exitNumber) &&
      exitNumber > 0
    ) {
      remaining = Math.max(
        1,
        remaining - exitNumber,
      );

      if (
        sequence[
          sequence.length - 1
        ] !== remaining
      ) {
        sequence.push(remaining);
      }
    }
  }

  if (
    sequence[
      sequence.length - 1
    ] !== 1
  ) {
    sequence.push(1);
  }

  return sequence;
}

/* ============================================================
   PARTICIPANT LABEL
============================================================ */

function getParticipantLabel(
  participant: unknown,
  index: number,
) {
  if (
    typeof participant === "string"
  ) {
    const value =
      participant.trim();

    /*
     * If the API is returning Mongo/Object IDs,
     * don't expose the raw ID as the player's name.
     */
    if (
      /^[a-f0-9]{20,}$/i.test(value)
    ) {
      return `Contestant ${index + 1}`;
    }

    return value || `Contestant ${index + 1}`;
  }

  if (
    participant &&
    typeof participant === "object"
  ) {
    const value =
      participant as Record<
        string,
        unknown
      >;

    const name =
      value.name ||
      value.full_name ||
      value.fullName ||
      value.username ||
      value.displayName ||
      value.email;

    if (name) {
      return String(name);
    }
  }

  return `Contestant ${index + 1}`;
}

/* ============================================================
   PAGE
============================================================ */

export default function QuizWaitingRoomPage() {
  const params =
    useParams<{
      quizId: string;
    }>();

  const router = useRouter();

  const quizId =
    typeof params?.quizId === "string"
      ? params.quizId
      : "";

  /* ==========================================================
     STATE
  ========================================================== */

  const [quiz, setQuiz] =
    useState<QuizCompetition | null>(
      null,
    );

  const [status, setStatus] =
    useState<LobbyStatus>("loading");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* Socket state */

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [
    socketRoomJoined,
    setSocketRoomJoined,
  ] = useState(false);

  const [
    socketParticipantCount,
    setSocketParticipantCount,
  ] = useState<number | null>(null);

  /* ==========================================================
     REFS
  ========================================================== */

  const requestInFlightRef =
    useRef(false);

  const navigatingToPlayRef =
    useRef(false);

  const joinedSocketRoomRef =
    useRef<string | null>(null);

  const quizRef =
    useRef<QuizCompetition | null>(null);

  /* Keep the latest quiz available to
     stable callbacks. */
  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);

  /* ==========================================================
     ENTER PLAY PAGE

     IMPORTANT:
     We save the competition metadata locally.

     The play page will NOT call getQuizById().
  ========================================================== */

  const enterPlayPage =
    useCallback(
      (
        roundOverride?: number,
      ) => {
        if (!quizId) {
          return;
        }

        if (
          navigatingToPlayRef.current
        ) {
          return;
        }

        const currentQuiz =
          quizRef.current;

        if (!currentQuiz) {
          return;
        }

        const currentRound =
          Number(
            roundOverride ??
              getCurrentRound(
                currentQuiz,
              ),
          );

        const sessionData: QuizPlaySession =
          {
            quizId,

            quiz_title:
              String(
                currentQuiz.quiz_title ||
                  "Quiz Competition",
              ),

            subject:
              getSubjectLabel(
                currentQuiz.subject,
              ),

            description:
              String(
                currentQuiz.description ||
                  "",
              ),

            current_round:
              Number.isFinite(
                currentRound,
              ) && currentRound > 0
                ? currentRound
                : 1,

            number_of_rounds:
              getNumberOfRounds(
                currentQuiz,
              ),

            time_per_question:
              getTimePerQuestion(
                currentQuiz,
              ),

            no_of_contestants:
              getContestantCapacity(
                currentQuiz,
              ),

            joined_count:
              getJoinedCount(
                currentQuiz,
              ),

            room_id:
              currentQuiz.room_id
                ? String(
                    currentQuiz.room_id,
                  )
                : null,

            start_date:
              String(
                currentQuiz.start_date ||
                  "",
              ),
          };

        try {
          sessionStorage.setItem(
            `${PLAY_SESSION_PREFIX}${quizId}`,
            JSON.stringify(
              sessionData,
            ),
          );
        } catch (storageError) {
          console.warn(
            "Unable to save quiz play session:",
            storageError,
          );
        }

        navigatingToPlayRef.current =
          true;

        router.push(
          `/student/quiz-board/${quizId}/play`,
        );
      },
      [quizId, router],
    );

  /* ==========================================================
     LOBBY STATUS
  ========================================================== */

  const updateLobbyStatus =
    useCallback(
      (
        currentQuiz: QuizCompetition | null,
      ) => {
        if (!currentQuiz) {
          setStatus("error");
          return;
        }

        const normalized =
          normalizeStatus(
            currentQuiz.status,
          );

        const currentRound =
          getCurrentRound(
            currentQuiz,
          );

        if (
          normalized === "COMPLETED" ||
          normalized === "FINISHED"
        ) {
          setStatus("completed");
          return;
        }

        if (
          currentRound > 0 ||
          normalized === "LIVE" ||
          normalized ===
            "IN_PROGRESS"
        ) {
          setStatus("live");
          return;
        }

        const full =
          isQuizFull(
            currentQuiz,
          );

        if (!full) {
          setStatus(
            "waiting_for_players",
          );
          return;
        }

        if (!hasRoom(currentQuiz)) {
          setStatus(
            "waiting_for_room",
          );
          return;
        }

        setStatus(
          "waiting_for_start",
        );
      },
      [],
    );

  /* ==========================================================
     LOAD QUIZ
  ========================================================== */

  const loadQuiz =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        if (!quizId) {
          setError(
            "Competition ID is missing from the URL.",
          );
          setStatus("error");
          setLoading(false);
          return;
        }

        if (
          requestInFlightRef.current
        ) {
          return;
        }

        try {
          requestInFlightRef.current =
            true;

          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          if (!isRefresh) {
            setError("");
          }

          const response =
            await getQuizById(
              quizId,
            );

          console.log(
            "Quiz waiting room response:",
            response,
          );

          const normalizedQuiz =
            extractQuiz(
              response,
            );

          if (!normalizedQuiz) {
            throw new Error(
              "The competition data could not be read from the server response.",
            );
          }

          quizRef.current =
            normalizedQuiz;

          setQuiz(
            normalizedQuiz,
          );

          updateLobbyStatus(
            normalizedQuiz,
          );
        } catch (err) {
          console.error(
            "Failed to load quiz:",
            err,
          );

          /*
           * During a refresh, keep the previous
           * competition visible instead of
           * destroying the UI.
           */
          if (!isRefresh) {
            setQuiz(null);
            setStatus("error");
            setError(
              getApiErrorMessage(
                err,
              ),
            );
          } else {
            console.warn(
              "Quiz refresh failed:",
              getApiErrorMessage(
                err,
              ),
            );
          }
        } finally {
          requestInFlightRef.current =
            false;

          setLoading(false);
          setRefreshing(false);
        }
      },
      [quizId, updateLobbyStatus],
    );

  /* ==========================================================
     INITIAL LOAD + POLLING
  ========================================================== */

  useEffect(() => {
    void loadQuiz(false);

    const interval = window.setInterval(
      () => {
        void loadQuiz(true);
      },
      POLLING_INTERVAL,
    );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [loadQuiz]);

  /* ==========================================================
     SOCKET.IO ROOM CONNECTION
  ========================================================== */

  const roomId =
    quiz?.room_id
      ? String(
          quiz.room_id,
        ).trim()
      : "";

  useEffect(() => {
    /*
     * No room yet.
     *
     * The student only needs Socket.IO after
     * the administrator has created the room.
     */
    if (!roomId) {
      setSocketConnected(false);
      setSocketRoomJoined(false);
      setSocketParticipantCount(
        null,
      );

      joinedSocketRoomRef.current =
        null;

      return;
    }

    let cancelled = false;

    const socket =
      getQuizSocket();

    /* ========================================================
       CONNECT
    ======================================================== */

    const handleConnect =
      () => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] Connected:",
          socket.id,
        );

        setSocketConnected(true);

        /*
         * Prevent emitting duplicate join_room
         * for the same confirmed room.
         */
        if (
          joinedSocketRoomRef.current !==
          roomId
        ) {
          console.log(
            "[Quiz Socket] Joining room:",
            roomId,
          );

          /*
           * IMPORTANT:
           *
           * The backend currently expects
           * room_id in this payload.
           */
          socket.emit(
            "join_room",
            {
              room_id: roomId,
            },
          );

          /*
           * DO NOT mark the room as joined here.
           *
           * We wait for joined_room_ack.
           */
        }
      };

    /* ========================================================
       CONNECT ERROR
    ======================================================== */

    const handleConnectError =
      (socketError: Error) => {
        if (cancelled) {
          return;
        }

        console.error(
          "[Quiz Socket] Connection error:",
          socketError,
        );

        setSocketConnected(false);
        setSocketRoomJoined(false);
      };

    /* ========================================================
       DISCONNECT
    ======================================================== */

    const handleDisconnect =
      (
        reason: string,
      ) => {
        if (cancelled) {
          return;
        }

        console.warn(
          "[Quiz Socket] Disconnected:",
          reason,
        );

        setSocketConnected(false);
        setSocketRoomJoined(false);

        /*
         * The previous room membership is no
         * longer considered confirmed.
         *
         * If Socket.IO reconnects, join_room
         * will be emitted again.
         */
        joinedSocketRoomRef.current =
          null;
      };

    /* ========================================================
       JOINED ROOM ACK
    ======================================================== */

    const handleJoinedRoomAck =
      (
        payload: SocketJoinedRoomAckPayload,
      ) => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] joined_room_ack:",
          payload,
        );

        /*
         * Backend explicitly rejected the join.
         */
        if (
          payload &&
          payload.success === false
        ) {
          console.warn(
            "[Quiz Socket] Room join rejected:",
            payload.message,
          );

          setSocketRoomJoined(
            false,
          );

          /*
           * Allow another join attempt.
           */
          joinedSocketRoomRef.current =
            null;

          return;
        }

        /*
         * Backend confirmed the room join.
         */
        setSocketRoomJoined(
          true,
        );

        /*
         * NOW mark the room as joined.
         */
        joinedSocketRoomRef.current =
          roomId;
      };

    /* ========================================================
       PARTICIPANT JOINED
    ======================================================== */

    const handleParticipantJoined =
      (
        payload: SocketParticipantJoinedPayload,
      ) => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] participant_joined_room:",
          payload,
        );

        const count =
          Number(
            payload.joinedCount ??
              payload.joined_count ??
              payload.participantCount ??
              payload.participant_count ??
              NaN,
          );

        if (
          Number.isFinite(count)
        ) {
          setSocketParticipantCount(
            count,
          );
        }

        /*
         * Refresh REST lobby information so
         * joined_users and room_id stay current.
         */
        void loadQuiz(true);
      };

    /* ========================================================
       ROUND STARTED
    ======================================================== */

    const handleRoundStarted =
      (
        payload: SocketRoundStartedPayload,
      ) => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] round_started:",
          payload,
        );

        /*
         * Ignore a round_started event if the
         * backend includes a different quiz ID.
         */
        const eventQuizId =
          String(
            payload.quizId ??
              payload.quiz_id ??
              "",
          ).trim();

        if (
          eventQuizId &&
          eventQuizId !== quizId
        ) {
          console.warn(
            "[Quiz Socket] Ignoring round_started for another quiz:",
            eventQuizId,
          );

          return;
        }

        const eventRound =
          Number(
            payload.currentRound ??
              payload.current_round ??
              payload.round ??
              payload.round_number ??
              0,
          );

        setStatus("live");

        /*
         * Save metadata first, then navigate.
         *
         * The play page does NOT make another
         * getQuizById() request.
         */
        enterPlayPage(
          Number.isFinite(
            eventRound,
          ) && eventRound > 0
            ? eventRound
            : undefined,
        );
      };

    /* ========================================================
       REGISTER LISTENERS
    ======================================================== */

    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "connect_error",
      handleConnectError,
    );

    socket.on(
      "disconnect",
      handleDisconnect,
    );

    socket.on(
      "joined_room_ack",
      handleJoinedRoomAck,
    );

    socket.on(
      "participant_joined_room",
      handleParticipantJoined,
    );

    socket.on(
      "round_started",
      handleRoundStarted,
    );

    /*
     * If the socket was already connected when
     * this effect was created, run the same
     * connection logic immediately.
     */
    if (socket.connected) {
      handleConnect();
    }

    /* ========================================================
       CLEANUP
    ======================================================== */

    return () => {
      cancelled = true;

      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );

      socket.off(
        "joined_room_ack",
        handleJoinedRoomAck,
      );

      socket.off(
        "participant_joined_room",
        handleParticipantJoined,
      );

      socket.off(
        "round_started",
        handleRoundStarted,
      );

      joinedSocketRoomRef.current =
        null;

      setSocketConnected(false);
      setSocketRoomJoined(false);

      /*
       * This waiting room owns the quiz socket.
       * Once we navigate to play, this connection
       * is intentionally closed.
       */
      disconnectQuizSocket();
    };
  }, [
    roomId,
    quizId,
    loadQuiz,
    enterPlayPage,
  ]);

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const joinedCount =
    getJoinedCount(quiz);

  const contestantCapacity =
    getContestantCapacity(
      quiz,
    );

  const remainingPlayers =
    Math.max(
      0,
      contestantCapacity -
        joinedCount,
    );

  const currentRound =
    getCurrentRound(quiz);

  const numberOfRounds =
    getNumberOfRounds(quiz);

  const subject =
    getSubjectLabel(
      quiz?.subject,
    );

  const qualificationSequence =
    useMemo(
      () =>
        getQualificationSequence(
          quiz,
        ),
      [quiz],
    );

  const joinedUsers =
    getJoinedUsers(quiz);

  const scheduledTimePassed =
    hasScheduledTimePassed(
      quiz,
    );

  const finalRewards =
    quiz?.final_round_information;

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
            </div>

            <h1 className="text-2xl font-bold">
              Loading Competition
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Preparing your waiting room...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (
    status === "error" ||
    !quiz
  ) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
          <Card className="w-full border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold">
              Unable to Load Competition
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/60">
              {error ||
                "The competition could not be loaded."}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.back()
                }
                className="border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>

              <Button
                type="button"
                onClick={() =>
                  void loadQuiz(false)
                }
                className="bg-blue-600 text-white hover:bg-blue-500"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     STATUS MESSAGE
  ========================================================== */

  let statusTitle =
    "Preparing Competition";

  let statusMessage =
    "Please wait...";

  if (
    status ===
    "waiting_for_players"
  ) {
    statusTitle =
      "Waiting for Contestants";

    statusMessage =
      `Waiting for ${remainingPlayers} more contestant${
        remainingPlayers === 1
          ? ""
          : "s"
      } to join the competition.`;
  }

  if (
    status ===
    "waiting_for_room"
  ) {
    if (
      scheduledTimePassed
    ) {
      statusTitle =
        "All Contestants Have Joined";

      statusMessage =
        "All contestants have joined. Waiting for the Admin to open room.";
    } else {
      statusTitle =
        "Competition Is Full";

      statusMessage =
        "All contestants have joined. Waiting for the competition room to be opened.";
    }
  }

  if (
    status ===
    "waiting_for_start"
  ) {
    statusTitle =
      "Room Is Ready";

    statusMessage =
      socketRoomJoined
        ? "You are connected to the competition room. Waiting for the Admin to start the first round."
        : "The competition room has been created. Connecting you to the competition room...";
  }

  if (
    status === "live"
  ) {
    statusTitle =
      "Competition Is Live";

    statusMessage =
      currentRound > 0
        ? `Round ${currentRound} has started.`
        : "The competition has started.";
  }

  if (
    status === "completed"
  ) {
    statusTitle =
      "Competition Completed";

    statusMessage =
      "This competition has already been completed.";
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Quiz Board
                </span>
              </div>

              <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">
                {quiz.quiz_title ||
                  "Quiz Competition"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                socketConnected
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.04] text-white/50"
              }`}
            >
              {socketConnected ? (
                <>
                  <Wifi className="h-3.5 w-3.5" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  Connecting
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                void loadQuiz(true)
              }
              disabled={refreshing}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              aria-label="Refresh competition"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ==================================================
            MAIN STATUS CARD
        ================================================== */}

        <Card className="overflow-hidden border-white/10 bg-white/[0.04] text-white shadow-2xl shadow-black/30">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-10 sm:px-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex justify-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-3xl border ${
                    status === "live"
                      ? "border-emerald-400/20 bg-emerald-400/10"
                      : status ===
                          "completed"
                        ? "border-white/10 bg-white/[0.06]"
                        : "border-blue-400/20 bg-blue-400/10"
                  }`}
                >
                  {status ===
                  "live" ? (
                    <Radio className="h-9 w-9 text-emerald-400" />
                  ) : status ===
                    "completed" ? (
                    <CheckCircle2 className="h-9 w-9 text-white/60" />
                  ) : (
                    <Sparkles className="h-9 w-9 text-blue-400" />
                  )}
                </div>
              </div>

              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  Competition Status
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {statusTitle}
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                  {statusMessage}
                </p>
              </div>

              {/* Socket status */}

              {roomId && (
                <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-2">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                      socketConnected
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {socketConnected ? (
                      <Wifi className="h-3.5 w-3.5" />
                    ) : (
                      <WifiOff className="h-3.5 w-3.5" />
                    )}

                    {socketConnected
                      ? "Socket connected"
                      : "Connecting to socket"}
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                      socketRoomJoined
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-white/[0.04] text-white/50"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />

                    {socketRoomJoined
                      ? "Room joined"
                      : "Joining room"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              PLAYER COUNT
          ================================================== */}

          <div className="grid border-b border-white/10 sm:grid-cols-3">
            <div className="border-b border-white/10 p-6 text-center sm:border-b-0 sm:border-r">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10">
                <Users className="h-5 w-5 text-blue-400" />
              </div>

              <p className="text-2xl font-extrabold">
                {joinedCount}
                <span className="text-white/30">
                  {" "}
                  /{" "}
                  {contestantCapacity}
                </span>
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
                Contestants
              </p>
            </div>

            <div className="border-b border-white/10 p-6 text-center sm:border-b-0 sm:border-r">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10">
                <BookOpen className="h-5 w-5 text-violet-400" />
              </div>

              <p className="text-2xl font-extrabold">
                {numberOfRounds ||
                  "—"}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
                Rounds
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                <Clock3 className="h-5 w-5 text-amber-400" />
              </div>

              <p className="text-2xl font-extrabold">
                {getTimePerQuestion(
                  quiz,
                ) || "—"}
                {getTimePerQuestion(
                  quiz,
                ) > 0 && (
                  <span className="ml-1 text-sm font-bold text-white/40">
                    sec
                  </span>
                )}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
                Per Question
              </p>
            </div>
          </div>

          {/* ==================================================
              COMPETITION DETAILS
          ================================================== */}

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Subject
              </p>

              <p className="mt-2 font-bold text-white">
                {subject}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Scheduled Start
              </p>

              <p className="mt-2 text-sm font-bold text-white">
                {formatDateTime(
                  quiz.start_date,
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Current Round
              </p>

              <p className="mt-2 font-bold text-white">
                {currentRound > 0
                  ? `Round ${currentRound}`
                  : "Not started"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Room
              </p>

              <p className="mt-2 font-mono text-sm font-bold text-white">
                {roomId
                  ? roomId
                  : "Not created"}
              </p>
            </div>
          </div>
        </Card>

        {/* ==================================================
            PLAYERS
        ================================================== */}

        <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />

                <h2 className="text-xl font-extrabold">
                  Contestants
                </h2>
              </div>

              <p className="mt-1 text-sm text-white/45">
                Students currently registered for this competition.
              </p>
            </div>

            {socketParticipantCount !==
              null && (
              <div className="text-sm text-white/50">
                Live room count:{" "}
                <span className="font-bold text-white">
                  {
                    socketParticipantCount
                  }
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({
              length:
                Math.max(
                  contestantCapacity,
                  joinedUsers.length,
                ),
            }).map(
              (_, index) => {
                const participant =
                  joinedUsers[
                    index
                  ];

                const joined =
                  Boolean(
                    participant,
                  );

                return (
                  <div
                    key={index}
                    className={`rounded-2xl border p-4 ${
                      joined
                        ? "border-blue-400/20 bg-blue-400/[0.06]"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                        joined
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-white/[0.04] text-white/20"
                      }`}
                    >
                      {joined ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>

                    <p
                      className={`truncate text-sm font-bold ${
                        joined
                          ? "text-white"
                          : "text-white/25"
                      }`}
                    >
                      {joined
                        ? getParticipantLabel(
                            participant,
                            index,
                          )
                        : "Waiting..."}
                    </p>

                    <p className="mt-1 text-[11px] font-medium text-white/30">
                      Contestant{" "}
                      {index + 1}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </Card>

        {/* ==================================================
            QUALIFICATION
        ================================================== */}

        {qualificationSequence.length >
          0 && (
          <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <Zap className="h-5 w-5 text-amber-400" />
              </div>

              <div className="min-w-0">
                <h2 className="font-extrabold">
                  Qualification
                  Journey
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/45">
                  Contestants qualify through each round until the final winner remains.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {qualificationSequence.map(
                    (
                      count,
                      index,
                    ) => (
                      <div
                        key={`${count}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div className="flex min-w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-extrabold">
                          {count}
                        </div>

                        {index <
                          qualificationSequence.length -
                            1 && (
                          <span className="text-white/20">
                            →
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ==================================================
            FINAL REWARDS
        ================================================== */}

        {finalRewards && (
          <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <Trophy className="h-5 w-5 text-amber-400" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">
                  Final Round Rewards
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      1st Position
                    </p>

                    <p className="mt-2 text-xl font-extrabold text-amber-300">
                      {Number(
                        finalRewards.first_position_reward ||
                          0,
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      2nd Position
                    </p>

                    <p className="mt-2 text-xl font-extrabold text-white">
                      {Number(
                        finalRewards.second_position_reward ||
                          0,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ==================================================
            LIVE STATE
        ================================================== */}

        {status === "live" && (
          <Card className="mt-6 border-emerald-400/20 bg-emerald-400/[0.06] p-6 text-white shadow-xl shadow-black/20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                  <Radio className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <h2 className="font-extrabold">
                    Round{" "}
                    {currentRound ||
                      1}{" "}
                    Is Live
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    The competition has started. Your quiz session is ready.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() =>
                  enterPlayPage(
                    currentRound ||
                      1,
                  )
                }
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Enter Quiz
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="py-8 text-center">
          <p className="text-xs text-white/25">
            Quiz Board automatically refreshes while you wait.
          </p>

          <p className="mt-1 text-xs text-white/20">
            Keep this page open so you can receive the round start signal.
          </p>
        </div>
      </div>
    </main>
  );
}