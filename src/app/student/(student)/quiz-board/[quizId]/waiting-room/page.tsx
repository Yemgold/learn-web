"use client";

import { useParams, useSearchParams } from "next/navigation";

import WaitingRoom from "@/components/quiz-board/waiting-room/WaitingRoom";

export default function WaitingRoomPage() {
  const params = useParams<{
    quizId: string;
  }>();

  const searchParams = useSearchParams();

  const quizId =
    typeof params?.quizId === "string"
      ? params.quizId
      : "";

  const contestantId =
    searchParams.get("contestantId")?.trim() || null;

  return (
    <WaitingRoom
      quizId={quizId}
      contestantId={contestantId}
    />
  );
}










// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   useParams,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";

// import {
//   AlertCircle,
//   ArrowLeft,
//   BookOpen,
//   CheckCircle2,
//   Clock3,
//   Loader2,
//   Radio,
//   RefreshCw,
//   ShieldCheck,
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
// import { getQuizSocket } from "@/lib/socket/quizSocket";

// /* ============================================================
//    CONSTANTS
// ============================================================ */

// const POLLING_INTERVAL = 60_000;
// const ROOM_POLLING_INTERVAL = 10_000;
// const PLAY_SESSION_PREFIX = "quiz-play-";

// /* ============================================================
//    TYPES
// ============================================================ */

// type LobbyStatus =
//   | "loading"
//   | "waiting_for_players"
//   | "waiting_for_room"
//   | "waiting_for_code"
//   | "joining_room"
//   | "waiting_for_round"
//   | "live"
//   | "completed"
//   | "error";

// type RoomStatus =
//   | "WAITING"
//   | "ACTIVE"
//   | "IN_PROGRESS"
//   | "ROUND_COMPLETED"
//   | "COMPLETED"
//   | "CLOSED"
//   | "CANCELLED"
//   | string;

// interface QuizCompetition {
//   _id?: string;
//   id?: string;
//   quiz_title?: string;
//   description?: string;
//   subject?: unknown;
//   time_per_question?: number;
//   start_date?: string;
//   no_of_contestants?: number;
//   number_of_rounds?: number;
//   joined_users?: unknown[];
//   current_round?: number;
//   room_id?: string | null;
//   status?: string;
//   round_information?: unknown[];
//   final_round_information?: {
//     no_of_questions?: number;
//     difficultyBreakdown?: {
//       easy?: number;
//       medium?: number;
//       hard?: number;
//     };
//     first_position_reward?: number;
//     second_position_reward?: number;
//   };
//   [key: string]: unknown;
// }

// interface QuizRoom {
//   id?: string;
//   roomId?: string;
//   quizId?: string;
//   quiz_id?: string;
//   status?: RoomStatus;
//   activated?: boolean;
//   currentRound?: number;
//   current_round?: number;
//   contestantCount?: number;
//   contestant_count?: number;
//   maxContestants?: number;
//   max_contestants?: number;
//   spectatorCode?: string | null;
//   [key: string]: unknown;
// }

// interface SocketRoundStartedPayload {
//   quizId?: string;
//   quiz_id?: string;
//   roomId?: string;
//   room_id?: string;
//   currentRound?: number;
//   current_round?: number;
//   round?: number;
//   round_number?: number;
// }

// interface SocketJoinedRoomAckPayload {
//   success?: boolean;
//   message?: string;
//   roomId?: string;
//   room_id?: string;
//   quizId?: string;
//   quiz_id?: string;
//   role?: string;
// }

// interface SocketParticipantJoinedPayload {
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
// }

// interface JoinRoomResponse {
//   success?: boolean;
//   message?: string;
//   data?: {
//     roomId?: string;
//     room_id?: string;
//     quizId?: string;
//     quiz_id?: string;
//     role?: string;
//     currentRound?: number;
//     current_round?: number;
//   };
// }

// interface QuizPlaySession {
//   quizId: string;
//   quiz_title: string;
//   subject: string;
//   description: string;
//   current_round: number;
//   number_of_rounds: number;
//   time_per_question: number;
//   no_of_contestants: number;
//   joined_count: number;
//   room_id: string | null;
//   start_date: string;
// }

// /* ============================================================
//    HELPERS
// ============================================================ */

// function normalizeStatus(value: unknown): string {
//   return String(value ?? "")
//     .trim()
//     .toUpperCase()
//     .replace(/[\s-]+/g, "_");
// }

// function getQuizId(
//   quiz: QuizCompetition | null,
// ): string {
//   if (!quiz) {
//     return "";
//   }

//   return String(
//     quiz._id ??
//       quiz.id ??
//       "",
//   ).trim();
// }

// function getSubjectLabel(
//   subject: unknown,
// ): string {
//   if (!subject) {
//     return "Quiz";
//   }

//   if (typeof subject === "string") {
//     return subject;
//   }

//   if (typeof subject === "object") {
//     const value =
//       subject as Record<
//         string,
//         unknown
//       >;

//     return String(
//       value.name ??
//         value.title ??
//         value.subject_name ??
//         value.subjectName ??
//         "Quiz",
//     );
//   }

//   return "Quiz";
// }

// function getJoinedUsers(
//   quiz: QuizCompetition | null,
// ): unknown[] {
//   if (
//     !quiz ||
//     !Array.isArray(
//       quiz.joined_users,
//     )
//   ) {
//     return [];
//   }

//   return quiz.joined_users;
// }

// function getJoinedCount(
//   quiz: QuizCompetition | null,
// ): number {
//   return getJoinedUsers(quiz).length;
// }

// function getContestantCapacity(
//   quiz: QuizCompetition | null,
// ): number {
//   if (!quiz) {
//     return 0;
//   }

//   const value = Number(
//     quiz.no_of_contestants ?? 0,
//   );

//   return Number.isFinite(value)
//     ? value
//     : 0;
// }

// function isQuizFull(
//   quiz: QuizCompetition | null,
// ): boolean {
//   const capacity =
//     getContestantCapacity(
//       quiz,
//     );

//   return (
//     capacity > 0 &&
//     getJoinedCount(quiz) >=
//       capacity
//   );
// }

// function getCurrentRound(
//   quiz: QuizCompetition | null,
// ): number {
//   if (!quiz) {
//     return 0;
//   }

//   const value = Number(
//     quiz.current_round ?? 0,
//   );

//   return Number.isFinite(value)
//     ? value
//     : 0;
// }

// function getNumberOfRounds(
//   quiz: QuizCompetition | null,
// ): number {
//   if (!quiz) {
//     return 0;
//   }

//   const value = Number(
//     quiz.number_of_rounds ?? 0,
//   );

//   return Number.isFinite(value)
//     ? value
//     : 0;
// }

// function getTimePerQuestion(
//   quiz: QuizCompetition | null,
// ): number {
//   if (!quiz) {
//     return 0;
//   }

//   const value = Number(
//     quiz.time_per_question ?? 0,
//   );

//   return Number.isFinite(value)
//     ? value
//     : 0;
// }

// function getQuizRoomId(
//   quiz: QuizCompetition | null,
// ): string {
//   if (!quiz) {
//     return "";
//   }

//   return String(
//     quiz.room_id ?? "",
//   ).trim();
// }

// function getRoomId(
//   room: QuizRoom | null,
// ): string {
//   if (!room) {
//     return "";
//   }

//   return String(
//     room.roomId ??
//       room.id ??
//       "",
//   ).trim();
// }

// function getRoomQuizId(
//   room: QuizRoom | null,
// ): string {
//   if (!room) {
//     return "";
//   }

//   return String(
//     room.quizId ??
//       room.quiz_id ??
//       "",
//   ).trim();
// }

// function getRoomCurrentRound(
//   room: QuizRoom | null,
// ): number {
//   if (!room) {
//     return 0;
//   }

//   const value = Number(
//     room.currentRound ??
//       room.current_round ??
//       0,
//   );

//   return Number.isFinite(value)
//     ? value
//     : 0;
// }

// function getRoomContestantCount(
//   room: QuizRoom | null,
// ): number | null {
//   if (!room) {
//     return null;
//   }

//   const raw =
//     room.contestantCount ??
//     room.contestant_count;

//   if (
//     raw === undefined ||
//     raw === null
//   ) {
//     return null;
//   }

//   const value = Number(raw);

//   return Number.isFinite(value)
//     ? value
//     : null;
// }

// function getRoomMaxContestants(
//   room: QuizRoom | null,
// ): number | null {
//   if (!room) {
//     return null;
//   }

//   const raw =
//     room.maxContestants ??
//     room.max_contestants;

//   if (
//     raw === undefined ||
//     raw === null
//   ) {
//     return null;
//   }

//   const value = Number(raw);

//   return Number.isFinite(value) &&
//     value > 0
//     ? value
//     : null;
// }

// function isRoomActivated(
//   room: QuizRoom | null,
// ): boolean {
//   if (!room) {
//     return false;
//   }

//   if (room.activated === true) {
//     return true;
//   }

//   const status =
//     normalizeStatus(
//       room.status,
//     );

//   return (
//     status === "ACTIVE" ||
//     status === "IN_PROGRESS" ||
//     status === "ROUND_COMPLETED"
//   );
// }

// function isRoomInProgress(
//   room: QuizRoom | null,
// ): boolean {
//   if (!room) {
//     return false;
//   }

//   const status =
//     normalizeStatus(
//       room.status,
//     );

//   return (
//     status === "IN_PROGRESS" ||
//     status === "ROUND_COMPLETED"
//   );
// }

// function isRoomCompleted(
//   room: QuizRoom | null,
// ): boolean {
//   if (!room) {
//     return false;
//   }

//   const status =
//     normalizeStatus(
//       room.status,
//     );

//   return (
//     status === "COMPLETED" ||
//     status === "CLOSED" ||
//     status === "CANCELLED"
//   );
// }

// function formatDateTime(
//   value: unknown,
// ): string {
//   if (!value) {
//     return "Not scheduled";
//   }

//   const date =
//     new Date(String(value));

//   if (
//     Number.isNaN(
//       date.getTime(),
//     )
//   ) {
//     return "Not scheduled";
//   }

//   return date.toLocaleString(
//     undefined,
//     {
//       dateStyle: "medium",
//       timeStyle: "short",
//     },
//   );
// }

// function getApiErrorMessage(
//   payload: unknown,
//   fallback: string,
// ): string {
//   if (
//     payload &&
//     typeof payload === "object"
//   ) {
//     const data =
//       payload as Record<
//         string,
//         unknown
//       >;

//     if (
//       typeof data.message ===
//       "string"
//     ) {
//       return data.message;
//     }

//     if (
//       data.error &&
//       typeof data.error ===
//         "object"
//     ) {
//       const error =
//         data.error as Record<
//           string,
//           unknown
//         >;

//       if (
//         typeof error.message ===
//         "string"
//       ) {
//         return error.message;
//       }
//     }
//   }

//   return fallback;
// }

// function extractQuiz(
//   payload: unknown,
// ): QuizCompetition | null {
//   if (
//     !payload ||
//     typeof payload !==
//       "object"
//   ) {
//     return null;
//   }

//   const root =
//     payload as Record<
//       string,
//       unknown
//     >;

//   const data =
//     root.data;

//   if (
//     data &&
//     typeof data === "object"
//   ) {
//     const dataObject =
//       data as Record<
//         string,
//         unknown
//       >;

//     const candidate =
//       dataObject.quizObj ??
//       dataObject.quiz ??
//       dataObject.quizCompetition ??
//       dataObject;

//     if (
//       candidate &&
//       typeof candidate ===
//         "object"
//     ) {
//       return candidate as QuizCompetition;
//     }
//   }

//   const candidate =
//     root.quizObj ??
//     root.quiz ??
//     root.quizCompetition;

//   if (
//     candidate &&
//     typeof candidate ===
//       "object"
//   ) {
//     return candidate as QuizCompetition;
//   }

//   return null;
// }

// function extractRoom(
//   payload: unknown,
// ): QuizRoom | null {
//   if (
//     !payload ||
//     typeof payload !==
//       "object"
//   ) {
//     return null;
//   }

//   const root =
//     payload as Record<
//       string,
//       unknown
//     >;

//   const data =
//     root.data;

//   if (
//     data &&
//     typeof data === "object"
//   ) {
//     const dataObject =
//       data as Record<
//         string,
//         unknown
//       >;

//     const candidate =
//       dataObject.room ??
//       dataObject.roomObj ??
//       dataObject.roomState ??
//       dataObject;

//     if (
//       candidate &&
//       typeof candidate ===
//         "object"
//     ) {
//       return candidate as QuizRoom;
//     }
//   }

//   const candidate =
//     root.room ??
//     root.roomObj ??
//     root.roomState;

//   if (
//     candidate &&
//     typeof candidate ===
//       "object"
//   ) {
//     return candidate as QuizRoom;
//   }

//   return null;
// }

// function getQualificationSequence(
//   quiz: QuizCompetition | null,
// ): number[] {
//   if (!quiz) {
//     return [];
//   }

//   const capacity =
//     getContestantCapacity(
//       quiz,
//     );

//   const rounds =
//     Array.isArray(
//       quiz.round_information,
//     )
//       ? quiz.round_information
//       : [];

//   if (
//     capacity <= 0 &&
//     rounds.length === 0
//   ) {
//     return [];
//   }

//   const result: number[] =
//     capacity > 0
//       ? [capacity]
//       : [];

//   for (
//     const round of rounds
//   ) {
//     if (
//       !round ||
//       typeof round !==
//         "object"
//     ) {
//       continue;
//     }

//     const item =
//       round as Record<
//         string,
//         unknown
//       >;

//     const exitNumber =
//       Number(
//         item.exit_number ??
//           0,
//       );

//     if (
//       Number.isFinite(
//         exitNumber,
//       ) &&
//       exitNumber > 0
//     ) {
//       const previous =
//         result.length > 0
//           ? result[
//               result.length - 1
//             ]
//           : capacity;

//       const remaining =
//         Math.max(
//           0,
//           previous -
//             exitNumber,
//         );

//       if (
//         remaining > 0 &&
//         remaining !==
//           previous
//       ) {
//         result.push(
//           remaining,
//         );
//       }
//     }
//   }

//   return result;
// }

// function getParticipantLabel(
//   participant: unknown,
//   index: number,
// ): string {
//   if (
//     participant &&
//     typeof participant ===
//       "object"
//   ) {
//     const item =
//       participant as Record<
//         string,
//         unknown
//       >;

//     const label =
//       item.name ??
//       item.fullName ??
//       item.username ??
//       item.email ??
//       item.userId ??
//       item._id;

//     if (
//       typeof label ===
//         "string" &&
//       label.trim()
//     ) {
//       return label;
//     }
//   }

//   if (
//     typeof participant ===
//       "string"
//   ) {
//     return participant;
//   }

//   return `Contestant ${
//     index + 1
//   }`;
// }

// /* ============================================================
//    PAGE
// ============================================================ */

// export default function QuizWaitingRoomPage() {
//   const params =
//     useParams<{
//       quizId: string;
//     }>();

//   const searchParams =
//     useSearchParams();

//   const router =
//     useRouter();

//   const quizId =
//     typeof params?.quizId ===
//     "string"
//       ? params.quizId
//       : "";

//   /*
//    * contestantId now comes from the My Competitions page:
//    *
//    * /waiting-room?contestantId=AT-SUWI20S9
//    *
//    * This is NOT trusted by the frontend.
//    * The backend must still validate it against:
//    *
//    * authenticated user
//    * + quiz
//    * + registered participation
//    * + contestantId
//    * + room
//    * + contestant role
//    */
//   const contestantId =
//     useMemo(() => {
//       const value =
//         searchParams.get(
//           "contestantId",
//         );

//       if (
//         !value ||
//         !value.trim()
//       ) {
//         return "";
//       }

//       return value
//         .trim()
//         .toUpperCase();
//     }, [searchParams]);

//   const [
//     quiz,
//     setQuiz,
//   ] =
//     useState<QuizCompetition | null>(
//       null,
//     );

//   const [
//     room,
//     setRoom,
//   ] =
//     useState<QuizRoom | null>(
//       null,
//     );

//   const [
//     status,
//     setStatus,
//   ] =
//     useState<LobbyStatus>(
//       "loading",
//     );

//   const [
//     loading,
//     setLoading,
//   ] =
//     useState(true);

//   const [
//     refreshing,
//     setRefreshing,
//   ] =
//     useState(false);

//   const [
//     error,
//     setError,
//   ] =
//     useState("");

//   /*
//    * REST authorization state.
//    *
//    * true only after the backend accepts
//    * the authenticated user + quiz + contestantId.
//    */
//   const [
//     roomAccessGranted,
//     setRoomAccessGranted,
//   ] =
//     useState(false);

//   const [
//     joiningRoom,
//     setJoiningRoom,
//   ] =
//     useState(false);

//   const [
//     joinError,
//     setJoinError,
//   ] =
//     useState("");

//   const [
//     socketConnected,
//     setSocketConnected,
//   ] =
//     useState(false);

//   const [
//     socketRoomJoined,
//     setSocketRoomJoined,
//   ] =
//     useState(false);

//   const [
//     socketParticipantCount,
//     setSocketParticipantCount,
//   ] =
//     useState<number | null>(
//       null,
//     );

//   const requestInFlightRef =
//     useRef(false);

//   const roomRequestInFlightRef =
//     useRef(false);

//   const navigatingToPlayRef =
//     useRef(false);

//   const joinedSocketRoomRef =
//     useRef<string | null>(
//       null,
//     );

//   const quizRef =
//     useRef<QuizCompetition | null>(
//       null,
//     );

//   const roomRef =
//     useRef<QuizRoom | null>(
//       null,
//     );

//   const roomAccessGrantedRef =
//     useRef(false);

//   /* ==========================================================
//      SYNC REFS
//   ========================================================== */

//   useEffect(() => {
//     quizRef.current = quiz;
//   }, [quiz]);

//   useEffect(() => {
//     roomRef.current = room;
//   }, [room]);

//   useEffect(() => {
//     roomAccessGrantedRef.current =
//       roomAccessGranted;
//   }, [roomAccessGranted]);

//   /* ==========================================================
//      RESET WHEN QUIZ CHANGES
//   ========================================================== */

//   useEffect(() => {
//     setQuiz(null);
//     setRoom(null);
//     setStatus("loading");
//     setLoading(true);
//     setRefreshing(false);
//     setError("");

//     setRoomAccessGranted(
//       false,
//     );

//     roomAccessGrantedRef.current =
//       false;

//     setSocketConnected(
//       false,
//     );

//     setSocketRoomJoined(
//       false,
//     );

//     setSocketParticipantCount(
//       null,
//     );

//     joinedSocketRoomRef.current =
//       null;

//     setJoinError("");
//     setJoiningRoom(false);

//     navigatingToPlayRef.current =
//       false;
//   }, [quizId]);

//   /* ==========================================================
//      ENTER PLAY PAGE
//   ========================================================== */

//   const enterPlayPage =
//     useCallback(
//       (roundOverride?: number) => {
//         if (!quizId) {
//           return;
//         }

//         if (
//           navigatingToPlayRef.current
//         ) {
//           return;
//         }

//         /*
//          * The contestant must have passed
//          * backend authorization first.
//          */
//         if (
//           !roomAccessGrantedRef.current
//         ) {
//           console.warn(
//             "[Quiz Waiting Room] Refusing navigation because contestant access has not been authorized.",
//           );

//           return;
//         }

//         const currentQuiz =
//           quizRef.current;

//         const currentRoom =
//           roomRef.current;

//         if (!currentQuiz) {
//           return;
//         }

//         const stableRoomId =
//           String(
//             getRoomId(
//               currentRoom,
//             ) ||
//               getQuizRoomId(
//                 currentQuiz,
//               ) ||
//               "",
//           ).trim();

//         if (!stableRoomId) {
//           console.warn(
//             "[Quiz Waiting Room] Cannot enter play page without a room ID.",
//           );

//           return;
//         }

//         const currentRound =
//           Number(
//             roundOverride ??
//               getRoomCurrentRound(
//                 currentRoom,
//               ) ??
//               getCurrentRound(
//                 currentQuiz,
//               ) ??
//               1,
//           );

//         const session: QuizPlaySession =
//           {
//             quizId,
//             quiz_title:
//               currentQuiz.quiz_title ??
//               "Quiz Competition",
//             subject:
//               getSubjectLabel(
//                 currentQuiz.subject,
//               ),
//             description:
//               currentQuiz.description ??
//               "",
//             current_round:
//               currentRound > 0
//                 ? currentRound
//                 : 1,
//             number_of_rounds:
//               getNumberOfRounds(
//                 currentQuiz,
//               ),
//             time_per_question:
//               getTimePerQuestion(
//                 currentQuiz,
//               ),
//             no_of_contestants:
//               getContestantCapacity(
//                 currentQuiz,
//               ),
//             joined_count:
//               getJoinedCount(
//                 currentQuiz,
//               ),
//             room_id:
//               stableRoomId,
//             start_date:
//               currentQuiz.start_date ??
//               "",
//           };

//         try {
//           sessionStorage.setItem(
//             `${PLAY_SESSION_PREFIX}${quizId}`,
//             JSON.stringify(
//               session,
//             ),
//           );
//         } catch (storageError) {
//           console.warn(
//             "[Quiz Waiting Room] Could not save play session:",
//             storageError,
//           );
//         }

//         navigatingToPlayRef.current =
//           true;

//         router.push(
//           `/student/quiz-board/${encodeURIComponent(
//             quizId,
//           )}/play`,
//         );
//       },
//       [quizId, router],
//     );

//   /* ==========================================================
//      LOAD QUIZ
//   ========================================================== */

//   const loadQuiz =
//     useCallback(
//       async (
//         showRefreshing = false,
//       ) => {
//         if (
//           !quizId ||
//           requestInFlightRef.current
//         ) {
//           return;
//         }

//         requestInFlightRef.current =
//           true;

//         if (showRefreshing) {
//           setRefreshing(true);
//         } else {
//           setLoading(true);
//         }

//         try {
//           const response =
//             await getQuizById(
//               quizId,
//             );

//           const nextQuiz =
//             extractQuiz(
//               response,
//             );

//           if (!nextQuiz) {
//             throw new Error(
//               "The competition data could not be found.",
//             );
//           }

//           setQuiz(
//             nextQuiz,
//           );

//           quizRef.current =
//             nextQuiz;

//           setError("");
//         } catch (loadError) {
//           console.error(
//             "[Quiz Waiting Room] Failed to load quiz:",
//             loadError,
//           );

//           if (
//             !quizRef.current
//           ) {
//             setError(
//               loadError instanceof
//                 Error
//                 ? loadError.message
//                 : "Unable to load the competition.",
//             );

//             setStatus(
//               "error",
//             );
//           }
//         } finally {
//           requestInFlightRef.current =
//             false;

//           setLoading(false);
//           setRefreshing(false);
//         }
//       },
//       [quizId],
//     );

//   /* ==========================================================
//      LOAD ROOM
//   ========================================================== */

//   const loadRoom =
//     useCallback(
//       async (
//         requestedRoomId?: string,
//       ) => {
//         const currentQuiz =
//           quizRef.current;

//         const resolvedRoomId =
//           String(
//             requestedRoomId ||
//               getRoomId(
//                 roomRef.current,
//               ) ||
//               getQuizRoomId(
//                 currentQuiz,
//               ) ||
//               "",
//           ).trim();

//         if (
//           !resolvedRoomId ||
//           roomRequestInFlightRef.current
//         ) {
//           return null;
//         }

//         roomRequestInFlightRef.current =
//           true;

//         try {
//           const response =
//             await fetch(
//               `/api/v1/quiz/room-state/${encodeURIComponent(
//                 resolvedRoomId,
//               )}`,
//               {
//                 method: "GET",
//                 credentials:
//                   "include",
//                 cache: "no-store",
//               },
//             );

//           const payload =
//             await response.json().catch(
//               () => null,
//             );

//           if (!response.ok) {
//             throw new Error(
//               getApiErrorMessage(
//                 payload,
//                 "Unable to load the quiz room.",
//               ),
//             );
//           }

//           const nextRoom =
//             extractRoom(
//               payload,
//             );

//           if (!nextRoom) {
//             throw new Error(
//               "The quiz room state could not be read.",
//             );
//           }

//           setRoom(
//             nextRoom,
//           );

//           roomRef.current =
//             nextRoom;

//           return nextRoom;
//         } catch (roomError) {
//           console.error(
//             "[Quiz Waiting Room] Failed to load room:",
//             roomError,
//           );

//           return null;
//         } finally {
//           roomRequestInFlightRef.current =
//             false;
//         }
//       },
//       [],
//     );

//   /* ==========================================================
//      INITIAL LOAD
//   ========================================================== */

//   useEffect(() => {
//     if (!quizId) {
//       return;
//     }

//     void loadQuiz(
//       false,
//     );
//   }, [
//     quizId,
//     loadQuiz,
//   ]);

//   /* ==========================================================
//      QUIZ REFRESH
//   ========================================================== */

//   useEffect(() => {
//     if (!quizId) {
//       return;
//     }

//     const interval =
//       window.setInterval(
//         () => {
//           void loadQuiz(
//             false,
//           );
//         },
//         POLLING_INTERVAL,
//       );

//     return () => {
//       window.clearInterval(
//         interval,
//       );
//     };
//   }, [
//     quizId,
//     loadQuiz,
//   ]);

//   /* ==========================================================
//      ROOM STATE POLLING
//   ========================================================== */

//   useEffect(() => {
//     const resolvedRoomId =
//       String(
//         getRoomId(room) ||
//           getQuizRoomId(
//             quiz,
//           ) ||
//           "",
//       ).trim();

//     if (!resolvedRoomId) {
//       return;
//     }

//     void loadRoom(
//       resolvedRoomId,
//     );

//     const interval =
//       window.setInterval(
//         () => {
//           void loadRoom(
//             resolvedRoomId,
//           );
//         },
//         ROOM_POLLING_INTERVAL,
//       );

//     return () => {
//       window.clearInterval(
//         interval,
//       );
//     };
//   }, [
//     room?.roomId,
//     room?.id,
//     quiz?.room_id,
//     loadRoom,
//   ]);

//   /* ==========================================================
//      DERIVED ROOM ID
//   ========================================================== */

//   const roomId =
//     String(
//       getRoomId(room) ||
//         getQuizRoomId(
//           quiz,
//         ) ||
//         "",
//     ).trim();

//   /* ==========================================================
//      AUTO-AUTHORIZE CONTESTANT
//   ========================================================== */

//   useEffect(() => {
//     if (
//       !quizId ||
//       !contestantId ||
//       !roomId ||
//       !room
//     ) {
//       return;
//     }

//     /*
//      * If already authorized, do nothing.
//      */
//     if (
//       roomAccessGrantedRef.current
//     ) {
//       return;
//     }

//     /*
//      * Room must actually be active before
//      * attempting contestant authorization.
//      */
//     if (
//       !isRoomActivated(room)
//     ) {
//       return;
//     }

//     if (joiningRoom) {
//       return;
//     }

//     let cancelled = false;

//     const authorizeContestant =
//       async () => {
//         setJoiningRoom(
//           true,
//         );

//         setJoinError("");

//         setStatus(
//           "joining_room",
//         );

//         try {
//           /*
//            * IMPORTANT:
//            *
//            * contestantId comes from the URL, but
//            * it is NOT trusted as proof of identity.
//            *
//            * The backend must validate:
//            * authenticated user
//            * + quizId
//            * + contestantId
//            * + registered participation
//            * + roomId
//            * + contestant role.
//            */
//           const response =
//             await fetch(
//               "/api/v1/quiz/room/join",
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type":
//                     "application/json",
//                 },
//                 credentials:
//                   "include",
//                 body: JSON.stringify(
//                   {
//                     contestantId,
//                     quizId,
//                     roomId,
//                   },
//                 ),
//               },
//             );

//           const payload =
//             (await response
//               .json()
//               .catch(
//                 () => null,
//               )) as JoinRoomResponse | null;

//           if (!response.ok) {
//             throw new Error(
//               getApiErrorMessage(
//                 payload,
//                 "The server rejected your contestant access.",
//               ),
//             );
//           }

//           if (
//             payload?.success ===
//             false
//           ) {
//             throw new Error(
//               payload.message ||
//                 "The server rejected your contestant access.",
//             );
//           }

//           const returnedRoomId =
//             String(
//               payload?.data
//                 ?.roomId ??
//                 payload?.data
//                   ?.room_id ??
//                 roomId,
//             ).trim();

//           if (
//             !returnedRoomId
//           ) {
//             throw new Error(
//               "The server did not return a valid room ID.",
//             );
//           }

//           const returnedQuizId =
//             String(
//               payload?.data
//                 ?.quizId ??
//                 payload?.data
//                   ?.quiz_id ??
//                 quizId,
//             ).trim();

//           if (
//             returnedQuizId &&
//             returnedQuizId !==
//               quizId
//           ) {
//             throw new Error(
//               "The server returned a room for a different competition.",
//             );
//           }

//           const returnedRound =
//             Number(
//               payload?.data
//                 ?.currentRound ??
//                 payload?.data
//                   ?.current_round ??
//                 getRoomCurrentRound(
//                   room,
//                 ),
//             );

//           const authorizedRoom: QuizRoom =
//             {
//               ...room,

//               id:
//                 returnedRoomId,

//               roomId:
//                 returnedRoomId,

//               quizId,

//               quiz_id:
//                 quizId,

//               currentRound:
//                 Number.isFinite(
//                   returnedRound,
//                 )
//                   ? returnedRound
//                   : getRoomCurrentRound(
//                       room,
//                     ),

//               current_round:
//                 Number.isFinite(
//                   returnedRound,
//                 )
//                   ? returnedRound
//                   : getRoomCurrentRound(
//                       room,
//                     ),

//               activated:
//                 true,

//               status:
//                 room.status ??
//                 "ACTIVE",
//             };

//           if (cancelled) {
//             return;
//           }

//           roomRef.current =
//             authorizedRoom;

//           setRoom(
//             authorizedRoom,
//           );

//           roomAccessGrantedRef.current =
//             true;

//           setRoomAccessGranted(
//             true,
//           );

//           setJoinError("");

//           console.log(
//             "[Quiz Waiting Room] Contestant authorized:",
//             {
//               contestantId,
//               quizId,
//               roomId:
//                 returnedRoomId,
//             },
//           );

//           /*
//            * Refresh the authoritative room state
//            * after authorization.
//            */
//           void loadRoom(
//             returnedRoomId,
//           );
//         } catch (authorizationError) {
//           if (cancelled) {
//             return;
//           }

//           console.error(
//             "[Quiz Waiting Room] Contestant authorization failed:",
//             authorizationError,
//           );

//           roomAccessGrantedRef.current =
//             false;

//           setRoomAccessGranted(
//             false,
//           );

//           setJoinError(
//             authorizationError instanceof
//               Error
//               ? authorizationError.message
//               : "Unable to authorize your contestant access.",
//           );

//           /*
//            * If the room is active but authorization
//            * failed, remain in the waiting room.
//            */
//           setStatus(
//             "waiting_for_code",
//           );
//         } finally {
//           if (!cancelled) {
//             setJoiningRoom(
//               false,
//             );
//           }
//         }
//       };

//     void authorizeContestant();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     quizId,
//     contestantId,
//     roomId,
//     room,
//     joiningRoom,
//     loadRoom,
//   ]);

//   /* ==========================================================
//      LOBBY STATUS
//   ========================================================== */

//   useEffect(() => {
//     if (!quiz) {
//       return;
//     }

//     const quizStatus =
//       normalizeStatus(
//         quiz.status,
//       );

//     const currentRoom =
//       roomRef.current;

//     if (
//       isRoomCompleted(
//         currentRoom,
//       ) ||
//       quizStatus ===
//         "COMPLETED" ||
//       quizStatus ===
//         "FINISHED" ||
//       quizStatus ===
//         "CANCELLED"
//     ) {
//       setStatus(
//         "completed",
//       );

//       return;
//     }

//     const round =
//       getRoomCurrentRound(
//         currentRoom,
//       ) ||
//       getCurrentRound(
//         quiz,
//       );

//     const roomStatus =
//       normalizeStatus(
//         currentRoom?.status,
//       );

//     if (
//       roomAccessGranted &&
//       socketRoomJoined &&
//       round > 0 &&
//       (
//         quizStatus ===
//           "IN_PROGRESS" ||
//         quizStatus ===
//           "LIVE" ||
//         roomStatus ===
//           "IN_PROGRESS" ||
//         roomStatus ===
//           "ROUND_COMPLETED"
//       )
//     ) {
//       setStatus(
//         "live",
//       );

//       return;
//     }

//     if (
//       isRoomActivated(
//         currentRoom,
//       )
//     ) {
//       if (
//         !contestantId
//       ) {
//         setStatus(
//           "waiting_for_code",
//         );

//         return;
//       }

//       if (
//         !roomAccessGranted
//       ) {
//         setStatus(
//           "waiting_for_code",
//         );

//         return;
//       }

//       if (
//         !socketRoomJoined
//       ) {
//         setStatus(
//           "joining_room",
//         );

//         return;
//       }

//       setStatus(
//         "waiting_for_round",
//       );

//       return;
//     }

//     if (
//       !isQuizFull(quiz)
//     ) {
//       setStatus(
//         "waiting_for_players",
//       );

//       return;
//     }

//     setStatus(
//       "waiting_for_room",
//     );
//   }, [
//     quiz,
//     room,
//     roomAccessGranted,
//     socketRoomJoined,
//     contestantId,
//   ]);

//   /* ==========================================================
//      SOCKET.IO
//   ========================================================== */

//   useEffect(() => {
//     if (
//       !roomAccessGranted ||
//       !roomId ||
//       !quizId
//     ) {
//       return;
//     }

//     const socket =
//       getQuizSocket();

//     let cancelled = false;

//     /* ========================================================
//        CONNECT
//     ======================================================== */

//     const handleConnect =
//       () => {
//         if (cancelled) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] Connected:",
//           socket.id,
//         );

//         setSocketConnected(
//           true,
//         );

//         /*
//          * Avoid repeatedly joining the exact
//          * same socket room.
//          */
//         if (
//           joinedSocketRoomRef.current ===
//           roomId
//         ) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] Joining shared quiz room:",
//           {
//             room_id:
//               roomId,
//             quizId,
//             contestantId,
//             role: "CONTESTANT",
//           },
//         );

//         socket.emit(
//           "join_room",
//           {
//             room_id:
//               roomId,
//             quiz_id:
//               quizId,
//             contestantId,
//             role: "CONTESTANT",
//           },
//         );
//       };

//     /* ========================================================
//        CONNECT ERROR
//     ======================================================== */

//     const handleConnectError =
//       (
//         socketError: Error,
//       ) => {
//         if (cancelled) {
//           return;
//         }

//         console.error(
//           "[Quiz Socket] Connection error:",
//           socketError,
//         );

//         setSocketConnected(
//           false,
//         );

//         setSocketRoomJoined(
//           false,
//         );

//         joinedSocketRoomRef.current =
//           null;
//       };

//     /* ========================================================
//        DISCONNECT
//     ======================================================== */

//     const handleDisconnect =
//       (
//         reason: string,
//       ) => {
//         if (cancelled) {
//           return;
//         }

//         console.warn(
//           "[Quiz Socket] Disconnected:",
//           reason,
//         );

//         setSocketConnected(
//           false,
//         );

//         setSocketRoomJoined(
//           false,
//         );

//         joinedSocketRoomRef.current =
//           null;
//       };

//     /* ========================================================
//        JOINED ROOM ACK
//     ======================================================== */

//     const handleJoinedRoomAck =
//       (
//         payload: SocketJoinedRoomAckPayload,
//       ) => {
//         if (cancelled) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] joined_room_ack:",
//           payload,
//         );

//         const ackRoomId =
//           String(
//             payload?.roomId ??
//               payload?.room_id ??
//               "",
//           ).trim();

//         const ackQuizId =
//           String(
//             payload?.quizId ??
//               payload?.quiz_id ??
//               "",
//           ).trim();

//         if (
//           ackRoomId &&
//           ackRoomId !==
//             roomId
//         ) {
//           return;
//         }

//         if (
//           ackQuizId &&
//           ackQuizId !==
//             quizId
//         ) {
//           return;
//         }

//         if (
//           payload &&
//           payload.success ===
//             false
//         ) {
//           setSocketRoomJoined(
//             false,
//           );

//           joinedSocketRoomRef.current =
//             null;

//           setJoinError(
//             payload.message ||
//               "The server rejected your room connection.",
//           );

//           return;
//         }

//         setSocketRoomJoined(
//           true,
//         );

//         joinedSocketRoomRef.current =
//           roomId;

//         setJoinError("");

//         setStatus(
//           "waiting_for_round",
//         );

//         console.log(
//           "[Quiz Socket] Contestant successfully joined shared room:",
//           roomId,
//         );
//       };

//     /* ========================================================
//        PARTICIPANT JOINED
//     ======================================================== */

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

//         const eventRoomId =
//           String(
//             payload.roomId ??
//               payload.room_id ??
//               "",
//           ).trim();

//         if (
//           eventRoomId &&
//           eventRoomId !==
//             roomId
//         ) {
//           return;
//         }

//         const count =
//           Number(
//             payload.joinedCount ??
//               payload.joined_count ??
//               payload.participantCount ??
//               payload.participant_count ??
//               NaN,
//           );

//         if (
//           Number.isFinite(
//             count,
//           )
//         ) {
//           setSocketParticipantCount(
//             count,
//           );
//         }

//         void loadQuiz(
//           true,
//         );

//         void loadRoom(
//           roomId,
//         );
//       };

//     /* ========================================================
//        ROUND STARTED
//     ======================================================== */

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

//         const eventQuizId =
//           String(
//             payload.quizId ??
//               payload.quiz_id ??
//               "",
//           ).trim();

//         if (
//           eventQuizId &&
//           eventQuizId !==
//             quizId
//         ) {
//           return;
//         }

//         const eventRoomId =
//           String(
//             payload.roomId ??
//               payload.room_id ??
//               "",
//           ).trim();

//         if (
//           eventRoomId &&
//           eventRoomId !==
//             roomId
//         ) {
//           return;
//         }

//         const eventRound =
//           Number(
//             payload.currentRound ??
//               payload.current_round ??
//               payload.round ??
//               payload.round_number ??
//               0,
//           );

//         const round =
//           Number.isFinite(
//             eventRound,
//           ) &&
//           eventRound > 0
//             ? eventRound
//             : 1;

//         const currentRoom =
//           roomRef.current;

//         const updatedRoom: QuizRoom =
//           {
//             ...(currentRoom ||
//               {}),

//             id:
//               roomId,

//             roomId:
//               roomId,

//             quizId,

//             quiz_id:
//               quizId,

//             currentRound:
//               round,

//             current_round:
//               round,

//             status:
//               "IN_PROGRESS",

//             activated:
//               true,
//           };

//         roomRef.current =
//           updatedRoom;

//         setRoom(
//           updatedRoom,
//         );

//         setStatus(
//           "live",
//         );

//         /*
//          * Automatically enter the quiz
//          * when the host starts the round.
//          */
//         enterPlayPage(
//           round,
//         );
//       };

//     /* ========================================================
//        REGISTER LISTENERS
//     ======================================================== */

//     socket.on(
//       "connect",
//       handleConnect,
//     );

//     socket.on(
//       "connect_error",
//       handleConnectError,
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
//      * Singleton socket may already be connected.
//      */
//     if (socket.connected) {
//       handleConnect();
//     }

//     /* ========================================================
//        CLEANUP
//     ======================================================== */

//     return () => {
//       cancelled = true;

//       socket.off(
//         "connect",
//         handleConnect,
//       );

//       socket.off(
//         "connect_error",
//         handleConnectError,
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

//       joinedSocketRoomRef.current =
//         null;

//       setSocketConnected(
//         false,
//       );

//       setSocketRoomJoined(
//         false,
//       );

//       /*
//        * Do NOT disconnect the singleton socket.
//        *
//        * The play page uses the same socket.
//        */
//     };
//   }, [
//     roomId,
//     roomAccessGranted,
//     contestantId,
//     quizId,
//     loadQuiz,
//     loadRoom,
//     enterPlayPage,
//   ]);

//   /* ==========================================================
//      HANDLE ALREADY-IN-PROGRESS ROOM
//   ========================================================== */

//   useEffect(() => {
//     if (
//       !roomAccessGranted ||
//       !socketRoomJoined ||
//       !room
//     ) {
//       return;
//     }

//     const currentRound =
//       getRoomCurrentRound(
//         room,
//       );

//     const roomStatus =
//       normalizeStatus(
//         room.status,
//       );

//     if (
//       currentRound > 0 &&
//       (
//         roomStatus ===
//           "IN_PROGRESS" ||
//         roomStatus ===
//           "ROUND_COMPLETED"
//       )
//     ) {
//       setStatus(
//         "live",
//       );

//       /*
//        * Covers contestants who enter after
//        * the host has already started the round.
//        */
//       enterPlayPage(
//         currentRound,
//       );
//     }
//   }, [
//     room,
//     roomAccessGranted,
//     socketRoomJoined,
//     enterPlayPage,
//   ]);

//   /* ==========================================================
//      DERIVED DATA
//   ========================================================== */

//   const joinedCount =
//     getJoinedCount(
//       quiz,
//     );

//   const contestantCapacity =
//     getContestantCapacity(
//       quiz,
//     );

//   const roomContestantCount =
//     getRoomContestantCount(
//       room,
//     );

//   const displayedContestantCount =
//     roomContestantCount ??
//     joinedCount;

//   const roomMaxContestants =
//     getRoomMaxContestants(
//       room,
//     );

//   const displayedCapacity =
//     roomMaxContestants ??
//     contestantCapacity;

//   const remainingPlayers =
//     Math.max(
//       0,
//       displayedCapacity -
//         displayedContestantCount,
//     );

//   const currentRound =
//     getRoomCurrentRound(
//       room,
//     ) ||
//     getCurrentRound(
//       quiz,
//     );

//   const numberOfRounds =
//     getNumberOfRounds(
//       quiz,
//     );

//   const qualificationSequence =
//     useMemo(
//       () =>
//         getQualificationSequence(
//           quiz,
//         ),
//       [quiz],
//     );

//   const joinedUsers =
//     getJoinedUsers(
//       quiz,
//     );

//   const finalRewards =
//     quiz?.final_round_information;

//   const roomActivated =
//     isRoomActivated(
//       room,
//     );

//   const roomStatus =
//     normalizeStatus(
//       room?.status,
//     );

//   const isFull =
//     displayedCapacity > 0 &&
//     displayedContestantCount >=
//       displayedCapacity;

//   /* ==========================================================
//      LOADING
//   ========================================================== */

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
//         <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
//           <div className="text-center">
//             <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
//               <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
//             </div>

//             <h1 className="text-2xl font-bold">
//               Loading Competition
//             </h1>

//             <p className="mt-2 text-sm text-white/50">
//               Preparing your waiting room...
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      ERROR
//   ========================================================== */

//   if (
//     status === "error" ||
//     !quiz
//   ) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
//         <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
//           <Card className="w-full border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-2xl">
//             <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
//               <AlertCircle className="h-7 w-7 text-red-400" />
//             </div>

//             <h1 className="text-2xl font-bold">
//               Unable to Load Competition
//             </h1>

//             <p className="mt-3 text-sm leading-6 text-white/60">
//               {error ||
//                 "The competition could not be loaded."}
//             </p>

//             <div className="mt-6 flex justify-center gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() =>
//                   router.back()
//                 }
//                 className="border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Go Back
//               </Button>

//               <Button
//                 type="button"
//                 onClick={() =>
//                   void loadQuiz(
//                     false,
//                   )
//                 }
//                 className="bg-blue-600 text-white hover:bg-blue-500"
//               >
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Try Again
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      STATUS MESSAGE
//   ========================================================== */

//   let statusTitle =
//     "Preparing Competition";

//   let statusMessage =
//     "Please wait...";

//   if (
//     status ===
//     "waiting_for_players"
//   ) {
//     statusTitle =
//       "Waiting for Contestants";

//     statusMessage =
//       `Waiting for ${remainingPlayers} more contestant${
//         remainingPlayers === 1
//           ? ""
//           : "s"
//       } to join the competition.`;
//   }

//   if (
//     status ===
//     "waiting_for_room"
//   ) {
//     statusTitle =
//       isFull
//         ? "Competition Is Full"
//         : "Waiting for Contestants";

//     statusMessage =
//       isFull
//         ? "All contestant slots are filled. Waiting for the Admin to create and activate the competition room."
//         : "Contestants are still joining the competition.";
//   }

//   if (
//     status ===
//     "waiting_for_code"
//   ) {
//     statusTitle =
//       !contestantId
//         ? "Contestant ID Required"
//         : joiningRoom
//           ? "Verifying Contestant Access"
//           : "Waiting for Room Access";

//     statusMessage =
//       !contestantId
//         ? "Your contestant ID was not supplied by My Competitions. Return to My Competitions and enter the competition again."
//         : joinError
//           ? joinError
//           : roomActivated
//             ? "Your registered contestant ID has been detected. The server is verifying your access to this competition room."
//             : "Waiting for the Admin to activate the competition room.";
//   }

//   if (
//     status ===
//     "joining_room"
//   ) {
//     statusTitle =
//       "Joining Competition Room";

//     statusMessage =
//       "Your registered contestant ID is being verified and your live-room access is being prepared.";
//   }

//   if (
//     status ===
//     "waiting_for_round"
//   ) {
//     statusTitle =
//       "Waiting for Host";

//     statusMessage =
//       "You are connected to the competition room and waiting for the Admin to start the next round.";
//   }

//   if (
//     status === "live"
//   ) {
//     statusTitle =
//       "Competition Is Live";

//     statusMessage =
//       currentRound > 0
//         ? `Round ${currentRound} has started.`
//         : "The competition has started.";
//   }

//   if (
//     status === "completed"
//   ) {
//     statusTitle =
//       "Competition Completed";

//     statusMessage =
//       "This competition has already been completed.";
//   }

//   /* ==========================================================
//      RENDER
//   ========================================================== */

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* ==================================================
//             HEADER
//         ================================================== */}

//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() =>
//                 router.back()
//               }
//               className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
//               aria-label="Go back"
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </button>

//             <div>
//               <div className="flex items-center gap-2">
//                 <Trophy className="h-5 w-5 text-amber-400" />

//                 <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
//                   Quiz Board
//                 </span>
//               </div>

//               <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">
//                 {quiz.quiz_title ||
//                   "Quiz Competition"}
//               </h1>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div
//               className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
//                 socketConnected
//                   ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
//                   : roomAccessGranted
//                     ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
//                     : "border-white/10 bg-white/[0.04] text-white/50"
//               }`}
//             >
//               {socketConnected ? (
//                 <>
//                   <Wifi className="h-3.5 w-3.5" />
//                   Connected
//                 </>
//               ) : roomAccessGranted ? (
//                 <>
//                   <WifiOff className="h-3.5 w-3.5" />
//                   Connecting
//                 </>
//               ) : (
//                 <>
//                   <ShieldCheck className="h-3.5 w-3.5" />
//                   Access Required
//                 </>
//               )}
//             </div>

//             <button
//               type="button"
//               onClick={() =>
//                 void loadQuiz(
//                   true,
//                 )
//               }
//               disabled={
//                 refreshing
//               }
//               className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
//               aria-label="Refresh competition"
//             >
//               <RefreshCw
//                 className={`h-4 w-4 ${
//                   refreshing
//                     ? "animate-spin"
//                     : ""
//                 }`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* ==================================================
//             MAIN STATUS CARD
//         ================================================== */}

//         <Card className="overflow-hidden border-white/10 bg-white/[0.04] text-white shadow-2xl shadow-black/30">
//           <div className="relative overflow-hidden border-b border-white/10 px-6 py-10 sm:px-10">
//             <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

//             <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

//             <div className="relative">
//               <div className="mb-5 flex justify-center">
//                 <div
//                   className={`flex h-20 w-20 items-center justify-center rounded-3xl border ${
//                     status ===
//                     "live"
//                       ? "border-emerald-400/20 bg-emerald-400/10"
//                       : status ===
//                           "completed"
//                         ? "border-white/10 bg-white/[0.06]"
//                         : "border-blue-400/20 bg-blue-400/10"
//                   }`}
//                 >
//                   {status ===
//                   "live" ? (
//                     <Radio className="h-9 w-9 text-emerald-400" />
//                   ) : status ===
//                     "completed" ? (
//                     <CheckCircle2 className="h-9 w-9 text-white/60" />
//                   ) : (
//                     <Sparkles className="h-9 w-9 text-blue-400" />
//                   )}
//                 </div>
//               </div>

//               <div className="mx-auto max-w-2xl text-center">
//                 <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
//                   Competition Status
//                 </p>

//                 <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
//                   {statusTitle}
//                 </h2>

//                 <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
//                   {statusMessage}
//                 </p>
//               </div>

//               {/* ==================================================
//                   CONTESTANT ID
//               ================================================== */}

//               {contestantId && (
//                 <div className="mx-auto mt-8 max-w-md">
//                   <Card className="border-emerald-400/20 bg-emerald-400/[0.05] p-5">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
//                         <ShieldCheck className="h-5 w-5 text-emerald-400" />
//                       </div>

//                       <div className="min-w-0">
//                         <h3 className="font-bold text-white">
//                           Your Contestant ID
//                         </h3>

//                         <p className="mt-1 font-mono text-lg font-extrabold tracking-wider text-emerald-300">
//                           {contestantId}
//                         </p>

//                         <p className="mt-1 text-xs text-white/40">
//                           This ID was supplied automatically from your registered competition entry.
//                         </p>
//                       </div>
//                     </div>

//                     {joinError && (
//                       <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-left text-xs text-red-300">
//                         <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

//                         <span>
//                           {joinError}
//                         </span>
//                       </div>
//                     )}

//                     {joiningRoom && (
//                       <div className="mt-4 flex items-center gap-2 text-xs text-blue-300">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Verifying contestant access...
//                       </div>
//                     )}
//                   </Card>
//                 </div>
//               )}

//               {!contestantId &&
//                 status !==
//                   "completed" && (
//                   <div className="mx-auto mt-8 max-w-md">
//                     <Card className="border-red-400/20 bg-red-400/[0.05] p-5">
//                       <div className="flex items-start gap-3">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
//                           <AlertCircle className="h-5 w-5 text-red-400" />
//                         </div>

//                         <div>
//                           <h3 className="font-bold text-red-300">
//                             Contestant ID Missing
//                           </h3>

//                           <p className="mt-1 text-xs leading-5 text-white/45">
//                             This waiting room must be opened from My Competitions so your registered contestant ID can be supplied automatically.
//                           </p>

//                           <Button
//                             type="button"
//                             onClick={() =>
//                               router.push(
//                                 "/student/quiz-board/my-competitions",
//                               )
//                             }
//                             className="mt-4 bg-blue-600 text-white hover:bg-blue-500"
//                           >
//                             Return to My Competitions
//                             <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   </div>
//                 )}

//               {/* ==================================================
//                   ACCESS GRANTED
//               ================================================== */}

//               {roomAccessGranted &&
//                 status !==
//                   "live" &&
//                 status !==
//                   "completed" && (
//                   <div className="mx-auto mt-8 max-w-md">
//                     <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
//                       <div className="flex items-start gap-3">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
//                           <ShieldCheck className="h-5 w-5 text-emerald-400" />
//                         </div>

//                         <div>
//                           <h3 className="font-bold text-emerald-300">
//                             Contestant Access Granted
//                           </h3>

//                           <p className="mt-1 text-xs leading-5 text-white/45">
//                             Your registered contestant ID has been verified. You are now connected to the competition room.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//               {/* ==================================================
//                   SOCKET STATUS
//               ================================================== */}

//               {roomId && (
//                 <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-2">
//                   <div
//                     className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
//                       socketConnected
//                         ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
//                         : roomAccessGranted
//                           ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
//                           : "border-white/10 bg-white/[0.04] text-white/50"
//                     }`}
//                   >
//                     {socketConnected ? (
//                       <Wifi className="h-3.5 w-3.5" />
//                     ) : roomAccessGranted ? (
//                       <WifiOff className="h-3.5 w-3.5" />
//                     ) : (
//                       <ShieldCheck className="h-3.5 w-3.5" />
//                     )}

//                     {socketConnected
//                       ? "Socket connected"
//                       : roomAccessGranted
//                         ? "Connecting to socket"
//                         : "Socket locked until authorization"}
//                   </div>

//                   <div
//                     className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
//                       socketRoomJoined
//                         ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
//                         : roomAccessGranted
//                           ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
//                           : "border-white/10 bg-white/[0.04] text-white/50"
//                     }`}
//                   >
//                     <ShieldCheck className="h-3.5 w-3.5" />

//                     {socketRoomJoined
//                       ? "Shared room joined"
//                       : roomAccessGranted
//                         ? "Waiting for room connection"
//                         : "Waiting for contestant authorization"}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ==================================================
//               PLAYER COUNT
//           ================================================== */}

//           <div className="grid border-b border-white/10 sm:grid-cols-3">
//             <div className="border-b border-white/10 p-6 text-center sm:border-b-0 sm:border-r">
//               <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10">
//                 <Users className="h-5 w-5 text-blue-400" />
//               </div>

//               <p className="text-2xl font-extrabold">
//                 {displayedContestantCount}

//                 <span className="text-white/30">
//                   {" "}
//                   /{" "}
//                   {displayedCapacity}
//                 </span>
//               </p>

//               <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
//                 Contestants
//               </p>
//             </div>

//             <div className="border-b border-white/10 p-6 text-center sm:border-b-0 sm:border-r">
//               <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10">
//                 <BookOpen className="h-5 w-5 text-violet-400" />
//               </div>

//               <p className="text-2xl font-extrabold">
//                 {numberOfRounds ||
//                   "—"}
//               </p>

//               <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
//                 Rounds
//               </p>
//             </div>

//             <div className="p-6 text-center">
//               <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
//                 <Clock3 className="h-5 w-5 text-amber-400" />
//               </div>

//               <p className="text-2xl font-extrabold">
//                 {getTimePerQuestion(
//                   quiz,
//                 ) || "—"}

//                 {getTimePerQuestion(
//                   quiz,
//                 ) > 0 && (
//                   <span className="ml-1 text-sm font-bold text-white/40">
//                     sec
//                   </span>
//                 )}
//               </p>

//               <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
//                 Per Question
//               </p>
//             </div>
//           </div>

//           {/* ==================================================
//               COMPETITION DETAILS
//           ================================================== */}

//           <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
//             <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//               <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
//                 Scheduled Start
//               </p>

//               <p className="mt-2 text-sm font-bold text-white">
//                 {formatDateTime(
//                   quiz.start_date,
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//               <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
//                 Current Round
//               </p>

//               <p className="mt-2 font-bold text-white">
//                 {currentRound > 0
//                   ? `Round ${currentRound}`
//                   : "Not started"}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//               <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
//                 Room Status
//               </p>

//               <p
//                 className={`mt-2 font-bold ${
//                   roomActivated
//                     ? "text-emerald-300"
//                     : "text-amber-300"
//                 }`}
//               >
//                 {roomStatus ||
//                   "Not created"}
//               </p>
//             </div>
//           </div>
//         </Card>

//         {/* ==================================================
//             PLAYERS
//         ================================================== */}

//         <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
//           <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <div className="flex items-center gap-2">
//                 <Users className="h-5 w-5 text-blue-400" />

//                 <h2 className="text-xl font-extrabold">
//                   Contestants
//                 </h2>
//               </div>

//               <p className="mt-1 text-sm text-white/45">
//                 Students currently registered for this competition.
//               </p>
//             </div>

//             {socketParticipantCount !==
//               null && (
//               <div className="text-sm text-white/50">
//                 Live room count:{" "}
//                 <span className="font-bold text-white">
//                   {
//                     socketParticipantCount
//                   }
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//             {Array.from({
//               length:
//                 Math.max(
//                   contestantCapacity,
//                   joinedUsers.length,
//                 ),
//             }).map(
//               (_, index) => {
//                 const participant =
//                   joinedUsers[
//                     index
//                   ];

//                 const joined =
//                   Boolean(
//                     participant,
//                   );

//                 return (
//                   <div
//                     key={index}
//                     className={`rounded-2xl border p-4 ${
//                       joined
//                         ? "border-blue-400/20 bg-blue-400/[0.06]"
//                         : "border-white/5 bg-white/[0.02]"
//                     }`}
//                   >
//                     <div
//                       className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
//                         joined
//                           ? "bg-blue-400/10 text-blue-400"
//                           : "bg-white/[0.04] text-white/20"
//                       }`}
//                     >
//                       {joined ? (
//                         <CheckCircle2 className="h-4 w-4" />
//                       ) : (
//                         <Users className="h-4 w-4" />
//                       )}
//                     </div>

//                     <p
//                       className={`truncate text-sm font-bold ${
//                         joined
//                           ? "text-white"
//                           : "text-white/25"
//                       }`}
//                     >
//                       {joined
//                         ? getParticipantLabel(
//                             participant,
//                             index,
//                           )
//                         : "Waiting..."}
//                     </p>

//                     <p className="mt-1 text-[11px] font-medium text-white/30">
//                       Contestant{" "}
//                       {index + 1}
//                     </p>
//                   </div>
//                 );
//               },
//             )}
//           </div>
//         </Card>

//         {/* ==================================================
//             QUALIFICATION
//         ================================================== */}

//         {qualificationSequence.length >
//           0 && (
//           <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
//             <div className="flex items-start gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
//                 <Zap className="h-5 w-5 text-amber-400" />
//               </div>

//               <div className="min-w-0">
//                 <h2 className="font-extrabold">
//                   Qualification
//                   Journey
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-white/45">
//                   Contestants qualify through each round until the final winner remains.
//                 </p>

//                 <div className="mt-5 flex flex-wrap items-center gap-2">
//                   {qualificationSequence.map(
//                     (
//                       count,
//                       index,
//                     ) => (
//                       <div
//                         key={`${count}-${index}`}
//                         className="flex items-center gap-2"
//                       >
//                         <div className="flex min-w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-extrabold">
//                           {count}
//                         </div>

//                         {index <
//                           qualificationSequence.length -
//                             1 && (
//                           <span className="text-white/20">
//                             →
//                           </span>
//                         )}
//                       </div>
//                     ),
//                   )}
//                 </div>
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             FINAL REWARDS
//         ================================================== */}

//         {finalRewards && (
//           <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
//             <div className="flex items-start gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
//                 <Trophy className="h-5 w-5 text-amber-400" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <h2 className="font-extrabold">
//                   Final Round Rewards
//                 </h2>

//                 <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//                     <p className="text-xs uppercase tracking-wider text-white/35">
//                       1st Position
//                     </p>

//                     <p className="mt-2 text-xl font-extrabold text-amber-300">
//                       {Number(
//                         finalRewards.first_position_reward ||
//                           0,
//                       ).toLocaleString()}
//                     </p>
//                   </div>

//                   <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//                     <p className="text-xs uppercase tracking-wider text-white/35">
//                       2nd Position
//                     </p>

//                     <p className="mt-2 text-xl font-extrabold text-white">
//                       {Number(
//                         finalRewards.second_position_reward ||
//                           0,
//                       ).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             WAITING FOR ROUND
//         ================================================== */}

//         {status ===
//           "waiting_for_round" && (
//           <Card className="mt-6 border-blue-400/20 bg-blue-400/[0.05] p-6 text-white shadow-xl shadow-black/20">
//             <div className="flex items-center gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-400/10">
//                 <Radio className="h-5 w-5 animate-pulse text-blue-400" />
//               </div>

//               <div>
//                 <h2 className="font-extrabold">
//                   Connected — Waiting for Host
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-white/50">
//                   You are inside the live competition room. The quiz will open automatically when the Admin starts the next round.
//                 </p>
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             LIVE STATE
//         ================================================== */}

//         {status ===
//           "live" && (
//           <Card className="mt-6 border-emerald-400/20 bg-emerald-400/[0.06] p-6 text-white shadow-xl shadow-black/20">
//             <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
//                   <Radio className="h-5 w-5 text-emerald-400" />
//                 </div>

//                 <div>
//                   <h2 className="font-extrabold">
//                     Round{" "}
//                     {currentRound ||
//                       1}{" "}
//                     Is Live
//                   </h2>

//                   <p className="mt-1 text-sm leading-6 text-white/50">
//                     The competition has started. Your quiz session is ready.
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 type="button"
//                 onClick={() =>
//                   enterPlayPage(
//                     currentRound ||
//                       1,
//                   )
//                 }
//                 className="bg-emerald-600 text-white hover:bg-emerald-500"
//               >
//                 Enter Quiz
//                 <Zap className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             FOOTER
//         ================================================== */}

//         <div className="py-8 text-center">
//           <p className="text-xs text-white/25">
//             Quiz Board automatically refreshes while you wait.
//           </p>

//           <p className="mt-1 text-xs text-white/20">
//             Keep this page open so you can receive room and round signals.
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }