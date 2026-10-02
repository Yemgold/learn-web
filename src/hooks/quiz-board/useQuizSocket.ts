








// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   type Dispatch,
//   type SetStateAction,
// } from "react";

// import type { Socket } from "socket.io-client";

// import { getQuizSocket } from "@/lib/socket/quizSocket";

// import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

// import type { HostParticipant } from "@/components/quiz-board/host/HostParticipantPanel";

// import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";

// import type { HostQuestionPreviewQuestion } from "@/components/quiz-board/host/HostQuestionPreview";

// import { useQuizSocketActions } from "./useQuizSocketActions";

// import type {
//   LiveQuestion,
//   QuizFeedEvent,
//   QuizRoomDocument,
//   SocketPayload,
//   UseQuizSocketOptions,
//   UseQuizSocketResult,
// } from "./quizSocketTypes";

// import {
//   appendFeedEvent,
//   getNumber,
//   getString,
//   mapLeaderboard,
//   mapParticipants,
//   normalizeQuestion,
//   normalizeStatus,
//   unwrapPayload,
// } from "./quizSocketUtils";

// /* -------------------------------------------------------------------------- */
// /* Generic helpers                                                            */
// /* -------------------------------------------------------------------------- */

// type AnyRecord = Record<string, unknown>;

// function asRecord(value: unknown): AnyRecord | null {
//   if (
//     typeof value !== "object" ||
//     value === null ||
//     Array.isArray(value)
//   ) {
//     return null;
//   }

//   return value as AnyRecord;
// }

// function asArray(value: unknown): unknown[] {
//   return Array.isArray(value) ? value : [];
// }

// function getNestedRecord(
//   source: AnyRecord,
//   keys: string[],
// ): AnyRecord | null {
//   for (const key of keys) {
//     const value = asRecord(source[key]);

//     if (value) {
//       return value;
//     }
//   }

//   return null;
// }


// function isQuestionShape(
//   value: unknown,
// ): boolean {
//   const record =
//     asRecord(value);

//   if (!record) {
//     return false;
//   }

//   const options =
//     asArray(record.options);

//   if (options.length === 0) {
//     return false;
//   }

//   const questionText =
//     typeof record.question ===
//     "string"
//       ? record.question
//       : typeof record.content ===
//           "string"
//         ? record.content
//         : typeof record.text ===
//             "string"
//           ? record.text
//           : null;

//   return Boolean(
//     questionText &&
//       questionText.trim(),
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Question extraction                                                        */
// /* -------------------------------------------------------------------------- */

// function extractQuestion(
//   payload: unknown,
// ): AnyRecord | null {
//   const root =
//     asRecord(payload);

//   if (!root) {
//     return null;
//   }

//   /*
//    * Current backend payload:
//    *
//    * {
//    *   quizId: "...",
//    *   id: "...",
//    *   question: "...",
//    *   options: [...]
//    * }
//    *
//    * Check the root first.
//    */
//   if (isQuestionShape(root)) {
//     return root;
//   }

//   /*
//    * Possible direct question containers.
//    */
//   const directCandidates: unknown[] = [
//     root.currentQuestion,
//     root.current_question,
//     root.activeQuestion,
//     root.active_question,
//     root.questionData,
//     root.question_data,
//   ];

//   for (const candidate of directCandidates) {
//     if (isQuestionShape(candidate)) {
//       const record =
//         asRecord(candidate);

//       if (record) {
//         return record;
//       }
//     }
//   }

//   /*
//    * Possible data wrapper.
//    */
//   const data =
//     asRecord(root.data);

//   if (data) {
//     /*
//      * data itself may be the question.
//      */
//     if (isQuestionShape(data)) {
//       return data;
//     }

//     const nestedCandidates: unknown[] = [
//       data.question,
//       data.currentQuestion,
//       data.current_question,
//       data.activeQuestion,
//       data.active_question,
//       data.questionData,
//       data.question_data,
//       data.result,
//     ];

//     for (const candidate of nestedCandidates) {
//       if (isQuestionShape(candidate)) {
//         const record =
//           asRecord(candidate);

//         if (record) {
//           return record;
//         }
//       }
//     }
//   }

//   /*
//    * Possible result wrapper.
//    */
//   const result =
//     asRecord(root.result);

//   if (result) {
//     /*
//      * result itself may be the question.
//      */
//     if (isQuestionShape(result)) {
//       return result;
//     }

//     const nestedCandidates: unknown[] = [
//       result.question,
//       result.currentQuestion,
//       result.current_question,
//       result.activeQuestion,
//       result.active_question,
//       result.questionData,
//       result.question_data,
//     ];

//     for (const candidate of nestedCandidates) {
//       if (isQuestionShape(candidate)) {
//         const record =
//           asRecord(candidate);

//         if (record) {
//           return record;
//         }
//       }
//     }
//   }

//   /*
//    * Finally check the normalized/unwrapped payload.
//    */
//   const unwrapped =
//     asRecord(
//       unwrapPayload(payload),
//     );

//   if (!unwrapped) {
//     return null;
//   }

//   if (isQuestionShape(unwrapped)) {
//     return unwrapped;
//   }

//   const unwrappedCandidates: unknown[] = [
//     unwrapped.question,
//     unwrapped.currentQuestion,
//     unwrapped.current_question,
//     unwrapped.activeQuestion,
//     unwrapped.active_question,
//     unwrapped.questionData,
//     unwrapped.question_data,
//     unwrapped.data,
//     unwrapped.result,
//   ];

//   for (const candidate of unwrappedCandidates) {
//     if (isQuestionShape(candidate)) {
//       const record =
//         asRecord(candidate);

//       if (record) {
//         return record;
//       }
//     }
//   }

//   return null;
// }



// /* -------------------------------------------------------------------------- */
// /* Question number extraction                                                 */
// /* -------------------------------------------------------------------------- */

// function extractQuestionNumber(
//   payload: unknown,
// ): number | null {
//   const root = asRecord(payload);

//   if (!root) {
//     return null;
//   }

//   const direct =
//     getNumber(root.questionNumber) ??
//     getNumber(root.question_number) ??
//     getNumber(root.number) ??
//     getNumber(root.index);

//   if (direct !== null) {
//     return direct;
//   }

//   const candidates: unknown[] = [
//     root.currentQuestion,
//     root.current_question,
//     root.activeQuestion,
//     root.active_question,
//     root.questionData,
//     root.question_data,
//     root.data,
//     root.result,
//   ];

//   for (const candidate of candidates) {
//     const record = asRecord(candidate);

//     if (!record) {
//       continue;
//     }

//     const nested =
//       getNumber(record.questionNumber) ??
//       getNumber(record.question_number) ??
//       getNumber(record.number) ??
//       getNumber(record.index);

//     if (nested !== null) {
//       return nested;
//     }
//   }

//   const unwrapped =
//     asRecord(
//       unwrapPayload(payload),
//     );

//   if (!unwrapped) {
//     return null;
//   }

//   return (
//     getNumber(
//       unwrapped.questionNumber,
//     ) ??
//     getNumber(
//       unwrapped.question_number,
//     ) ??
//     getNumber(unwrapped.number) ??
//     getNumber(unwrapped.index)
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Participants / leaderboard                                                 */
// /* -------------------------------------------------------------------------- */

// function extractParticipants(
//   payload: unknown,
// ): unknown[] {
//   const root = asRecord(payload);

//   if (!root) {
//     return [];
//   }

//   const candidates: unknown[] = [
//     root.participants,
//     root.users,
//     root.contestants,
//     root.joined_users,
//     root.joinedUsers,
//   ];

//   for (const candidate of candidates) {
//     const array = asArray(candidate);

//     if (array.length > 0) {
//       return array;
//     }
//   }

//   const nested =
//     asRecord(root.data);

//   if (nested) {
//     const nestedCandidates: unknown[] = [
//       nested.participants,
//       nested.users,
//       nested.contestants,
//       nested.joined_users,
//       nested.joinedUsers,
//     ];

//     for (const candidate of nestedCandidates) {
//       const array = asArray(candidate);

//       if (array.length > 0) {
//         return array;
//       }
//     }
//   }

//   return [];
// }

// function extractLeaderboard(
//   payload: unknown,
// ): unknown[] {
//   const root = asRecord(payload);

//   if (!root) {
//     return [];
//   }

//   const candidates: unknown[] = [
//     root.leaderboard,
//     root.scoreboard,
//     root.rankings,
//   ];

//   for (const candidate of candidates) {
//     const array = asArray(candidate);

//     if (array.length > 0) {
//       return array;
//     }
//   }

//   const nested =
//     asRecord(root.data);

//   if (nested) {
//     const nestedCandidates: unknown[] = [
//       nested.leaderboard,
//       nested.scoreboard,
//       nested.rankings,
//     ];

//     for (const candidate of nestedCandidates) {
//       const array = asArray(candidate);

//       if (array.length > 0) {
//         return array;
//       }
//     }
//   }

//   return [];
// }

// /* -------------------------------------------------------------------------- */
// /* Feed helper                                                                */
// /* -------------------------------------------------------------------------- */

// function createFeedEvent(
//   type: string,
//   payload: unknown,
// ): QuizFeedEvent {
//   const root = asRecord(payload);

//   const message =
//     (root
//       ? getString(root.message) ??
//         getString(root.text) ??
//         getString(root.description)
//       : null) ??
//     type.replaceAll("_", " ");

//   const participantId =
//     root
//       ? getString(root.participantId) ??
//         getString(root.participant_id) ??
//         getString(root.userId) ??
//         getString(root.user_id)
//       : null;

//   const participantName =
//     root
//       ? getString(root.participantName) ??
//         getString(root.participant_name) ??
//         getString(root.username) ??
//         getString(root.name)
//       : null;

//   return {
//     id: `${type}-${Date.now()}-${Math.random()
//       .toString(36)
//       .slice(2, 8)}`,

//     type,

//     message,

//     timestamp:
//       new Date().toISOString(),

//     participantId,

//     participantName,
//   };
// }

// /* -------------------------------------------------------------------------- */
// /* Hook                                                                       */
// /* -------------------------------------------------------------------------- */

// export default function useQuizSocket(
//   options: UseQuizSocketOptions,
// ): UseQuizSocketResult {
//   const {
//     quizId,
//     roomId,
//     role,
//     currentRound,
//     initialRound,
//     selectedQuestion,
//     timeLimit: initialTimeLimit,
//     onRoundChanged,
//   } = options;

//   /* ------------------------------------------------------------------------ */
//   /* Resolved values                                                          */
//   /* ------------------------------------------------------------------------ */

//   const resolvedRoomId =
//     roomId ?? "";

//   const resolvedInitialRound =
//     currentRound ??
//     initialRound ??
//     1;

//   const resolvedInitialTimeLimit =
//     initialTimeLimit ??
//     30;

//   /* ------------------------------------------------------------------------ */
//   /* State                                                                    */
//   /* ------------------------------------------------------------------------ */

//   const [connected, setConnected] =
//     useState(false);

//   const [roomJoined, setRoomJoined] =
//     useState(false);

//   const [roomActivated, setRoomActivated] =
//     useState(false);

//   const [roomDoc, setRoomDoc] =
//     useState<QuizRoomDocument | null>(
//       null,
//     );

//   const [
//     socketCurrentRound,
//     setSocketCurrentRound,
//   ] = useState<number>(
//     resolvedInitialRound,
//   );

//   const [question, setQuestion] =
//     useState<LiveQuestion | null>(
//       null,
//     );

//   const [
//     currentQuestionNumber,
//     setCurrentQuestionNumber,
//   ] = useState<number | null>(
//     null,
//   );

//   const [
//     questionStarted,
//     setQuestionStartedState,
//   ] = useState(false);

//   const [
//     questionLocked,
//     setQuestionLockedState,
//   ] = useState(false);

//   const [
//     selectedAnswerState,
//     setSelectedAnswerState,
//   ] = useState<string | null>(
//     null,
//   );

//   const [
//     answerSubmitted,
//     setAnswerSubmittedState,
//   ] = useState(false);

//   const [
//     submittingAnswer,
//     setSubmittingAnswer,
//   ] = useState(false);

//   const [
//     participants,
//     setParticipants,
//   ] = useState<HostParticipant[]>(
//     [],
//   );

//   const [
//     leaderboard,
//     setLeaderboard,
//   ] = useState<HostLeaderboardEntry[]>(
//     [],
//   );

//   const [
//     feedEvents,
//     setFeedEvents,
//   ] = useState<QuizFeedEvent[]>(
//     [],
//   );

//   const [
//     socketError,
//     setSocketError,
//   ] = useState<string | null>(
//     null,
//   );

//   const [
//     actionLoading,
//     setActionLoading,
//   ] = useState(false);

//   const [
//     timeLimitState,
//     setTimeLimitState,
//   ] = useState<number>(
//     resolvedInitialTimeLimit,
//   );

//   /* ------------------------------------------------------------------------ */
//   /* Refs                                                                     */
//   /* ------------------------------------------------------------------------ */

//   const socketRef =
//     useRef<Socket | null>(null);

//   const disposedRef =
//     useRef(false);

//   const quizIdRef =
//     useRef(quizId);

//   const roomIdRef =
//     useRef(resolvedRoomId);

//   const roleRef =
//     useRef<QuizGameRole | null>(
//       role,
//     );

//   const currentRoundRef =
//     useRef<number>(
//       resolvedInitialRound,
//     );

//   const selectedQuestionRef =
//     useRef<
//       HostQuestionPreviewQuestion | null
//     >(
//       selectedQuestion ?? null,
//     );

//   const timeLimitRef =
//     useRef<number>(
//       resolvedInitialTimeLimit,
//     );

//   const questionRef =
//     useRef<LiveQuestion | null>(
//       null,
//     );

//   const onRoundChangedRef =
//     useRef(onRoundChanged);

//   const selectedAnswerRef =
//     useRef<string | null>(null);

//   const answerSubmittedRef =
//     useRef(false);

//   const questionLockedRef =
//     useRef(false);

//   const questionStartedRef =
//     useRef(false);

//   /* ------------------------------------------------------------------------ */
//   /* Synchronize refs                                                         */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     quizIdRef.current =
//       quizId;
//   }, [quizId]);

//   useEffect(() => {
//     roomIdRef.current =
//       resolvedRoomId;
//   }, [resolvedRoomId]);

//   useEffect(() => {
//     roleRef.current =
//       role;
//   }, [role]);

//   useEffect(() => {
//     currentRoundRef.current =
//       resolvedInitialRound;

//     setSocketCurrentRound(
//       resolvedInitialRound,
//     );
//   }, [resolvedInitialRound]);

//   useEffect(() => {
//     selectedQuestionRef.current =
//       selectedQuestion ?? null;
//   }, [selectedQuestion]);

//   useEffect(() => {
//     onRoundChangedRef.current =
//       onRoundChanged;
//   }, [onRoundChanged]);

//   useEffect(() => {
//     timeLimitRef.current =
//       resolvedInitialTimeLimit;

//     setTimeLimitState(
//       resolvedInitialTimeLimit,
//     );
//   }, [resolvedInitialTimeLimit]);

//   /* ------------------------------------------------------------------------ */
//   /* Feed                                                                     */
//   /* ------------------------------------------------------------------------ */

//   const addFeedEvent =
//     useCallback(
//       (
//         type: string,
//         payload: unknown,
//       ) => {
//         const event =
//           createFeedEvent(
//             type,
//             payload,
//           );

//         setFeedEvents(
//           (previous) =>
//             appendFeedEvent(
//               previous,
//               event,
//             ),
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Apply question                                                           */
//   /* ------------------------------------------------------------------------ */

//   const applyQuestion =
//     useCallback(
//       (
//         payload: unknown,
//       ): LiveQuestion | null => {
//         const rawQuestion =
//           extractQuestion(
//             payload,
//           );

//         if (!rawQuestion) {
//           console.warn(
//             "[useQuizSocket] QUESTION EXTRACTION FAILED",
//             payload,
//           );

//           return null;
//         }

//         const normalized =
//           normalizeQuestion(
//             rawQuestion,
//           );

//         if (!normalized) {
//           console.warn(
//             "[useQuizSocket] QUESTION NORMALIZATION FAILED",
//             rawQuestion,
//           );

//           return null;
//         }

//         const payloadQuestionNumber =
//           extractQuestionNumber(
//             payload,
//           );

//         const resolvedQuestionNumber =
//           payloadQuestionNumber ??
//           normalized.questionNumber ??
//           null;

//         const resolvedTimeLimit =
//           normalized.timeLimit ??
//           timeLimitRef.current ??
//           30;

//         /*
//          * LiveQuestion already uses startedAt.
//          * We deliberately do not add a startTime property.
//          */
//         let resolvedStartedAt =
//           normalized.startedAt;

//         /*
//          * Some backend payloads send startTime.
//          * Convert that into the existing LiveQuestion.startedAt field.
//          */
//         if (!resolvedStartedAt) {
//           const rawStartTime =
//             getString(
//               rawQuestion.startTime,
//             ) ??
//             getString(
//               rawQuestion.startedAt,
//             );

//           if (rawStartTime) {
//             resolvedStartedAt =
//               rawStartTime;
//           }
//         }

//         let resolvedExpiresAt =
//           normalized.expiresAt;

//         /*
//          * Only calculate a display-side expiry if backend has not
//          * supplied one.
//          */
//         if (
//           !resolvedExpiresAt &&
//           resolvedStartedAt
//         ) {
//           const startTimestamp =
//             new Date(
//               resolvedStartedAt,
//             ).getTime();

//           if (
//             !Number.isNaN(
//               startTimestamp,
//             )
//           ) {
//             resolvedExpiresAt =
//               new Date(
//                 startTimestamp +
//                   resolvedTimeLimit *
//                     1000,
//               ).toISOString();
//           }
//         }

//         const nextQuestion: LiveQuestion =
//           {
//             ...normalized,

//             questionNumber:
//               resolvedQuestionNumber,

//             timeLimit:
//               resolvedTimeLimit,

//             startedAt:
//               resolvedStartedAt,

//             expiresAt:
//               resolvedExpiresAt,
//           };

//         console.log(
//           "[useQuizSocket] QUESTION APPLIED",
//           {
//             quizId:
//               quizIdRef.current,

//             roomId:
//               roomIdRef.current,

//             questionId:
//               nextQuestion.id,

//             questionNumber:
//               nextQuestion.questionNumber,

//             timeLimit:
//               nextQuestion.timeLimit,
//           },
//         );

//         questionRef.current =
//           nextQuestion;

//         setQuestion(
//           nextQuestion,
//         );

//         setCurrentQuestionNumber(
//           nextQuestion.questionNumber,
//         );

//         timeLimitRef.current =
//           resolvedTimeLimit;

//         setTimeLimitState(
//           resolvedTimeLimit,
//         );

//         /*
//          * NEW QUESTION = NEW ANSWER WINDOW.
//          *
//          * This is the ONLY normal place where the contestant
//          * answer lock is cleared.
//          */
//         selectedAnswerRef.current =
//           null;

//         answerSubmittedRef.current =
//           false;

//         questionLockedRef.current =
//           false;

//         questionStartedRef.current =
//           true;

//         setSelectedAnswerState(
//           null,
//         );

//         setAnswerSubmittedState(
//           false,
//         );

//         setSubmittingAnswer(
//           false,
//         );

//         setQuestionLockedState(
//           false,
//         );

//         setQuestionStartedState(
//           true,
//         );

//         return nextQuestion;
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Room state                                                               */
//   /* ------------------------------------------------------------------------ */

//   const handleRoomState =
//     useCallback(
//       (
//         payload: SocketPayload | unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] ROOM STATE",
//           payload,
//         );

//         const root =
//           asRecord(payload);

//         if (!root) {
//           return;
//         }

//         const unwrapped =
//           asRecord(
//             unwrapPayload(
//               payload,
//             ),
//           );

//         const source =
//           unwrapped ??
//           root;

//         const status =
//           normalizeStatus(
//             getString(
//               source.status,
//             ) ??
//               getString(
//                 source.roomStatus,
//               ) ??
//               getString(
//                 source.room_status,
//               ),
//           );

//         if (status) {
//           setRoomActivated(
//             status ===
//               "IN_PROGRESS" ||
//               status === "LIVE" ||
//               status === "OPEN",
//           );
//         }

//         const round =
//           getNumber(
//             source.currentRound,
//           ) ??
//           getNumber(
//             source.current_round,
//           ) ??
//           getNumber(
//             source.roundNumber,
//           ) ??
//           getNumber(
//             source.round_number,
//           );

//         if (round !== null) {
//           currentRoundRef.current =
//             round;

//           setSocketCurrentRound(
//             round,
//           );

//           onRoundChangedRef.current?.(
//             round,
//           );
//         }

//         const room =
//           asRecord(
//             source.room,
//           ) ??
//           asRecord(
//             source.roomDoc,
//           ) ??
//           asRecord(
//             source.room_doc,
//           );

//         if (room) {
//           setRoomDoc(
//             room as QuizRoomDocument,
//           );
//         }

//         const participantValues =
//           extractParticipants(
//             source,
//           );

//         if (
//           participantValues.length >
//           0
//         ) {
//           setParticipants(
//             mapParticipants(
//               participantValues,
//             ),
//           );
//         }

//         const leaderboardValues =
//           extractLeaderboard(
//             source,
//           );

//         if (
//           leaderboardValues.length >
//           0
//         ) {
//           setLeaderboard(
//             mapLeaderboard(
//               leaderboardValues,
//             ),
//           );
//         }

//         if (
//           extractQuestion(source)
//         ) {
//           applyQuestion(
//             source,
//           );
//         }
//       },
//       [applyQuestion],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Room document                                                            */
//   /* ------------------------------------------------------------------------ */

//   const handleGetRoomAck =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] GET ROOM DOC ACK",
//           payload,
//         );

//         const root =
//           asRecord(payload);

//         if (!root) {
//           return;
//         }

//         const source =
//           asRecord(root.data) ??
//           root;

//         const room =
//           asRecord(
//             source.room,
//           ) ??
//           asRecord(
//             source.roomDoc,
//           ) ??
//           asRecord(
//             source.room_doc,
//           );

//         if (room) {
//           setRoomDoc(
//             room as QuizRoomDocument,
//           );
//         }

//         const round =
//           getNumber(
//             source.currentRound,
//           ) ??
//           getNumber(
//             source.current_round,
//           ) ??
//           getNumber(
//             source.roundNumber,
//           ) ??
//           getNumber(
//             source.round_number,
//           );

//         if (round !== null) {
//           currentRoundRef.current =
//             round;

//           setSocketCurrentRound(
//             round,
//           );

//           onRoundChangedRef.current?.(
//             round,
//           );
//         }

//         const status =
//           normalizeStatus(
//             getString(
//               source.status,
//             ) ??
//               getString(
//                 source.roomStatus,
//               ) ??
//               getString(
//                 source.room_status,
//               ),
//           );

//         if (status) {
//           setRoomActivated(
//             status ===
//               "IN_PROGRESS" ||
//               status === "LIVE" ||
//               status === "OPEN",
//           );
//         }

//         const participantValues =
//           extractParticipants(
//             source,
//           );

//         if (
//           participantValues.length >
//           0
//         ) {
//           setParticipants(
//             mapParticipants(
//               participantValues,
//             ),
//           );
//         }

//         const leaderboardValues =
//           extractLeaderboard(
//             source,
//           );

//         if (
//           leaderboardValues.length >
//           0
//         ) {
//           setLeaderboard(
//             mapLeaderboard(
//               leaderboardValues,
//             ),
//           );
//         }

//         if (
//           extractQuestion(source)
//         ) {
//           applyQuestion(
//             source,
//           );
//         }
//       },
//       [applyQuestion],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Socket connect                                                            */
//   /* ------------------------------------------------------------------------ */

//   const handleConnect =
//     useCallback(() => {
//       if (
//         disposedRef.current
//       ) {
//         return;
//       }

//       console.log(
//         "[useQuizSocket] SOCKET CONNECTED",
//         {
//           quizId:
//             quizIdRef.current,

//           roomId:
//             roomIdRef.current,

//           role:
//             roleRef.current,
//         },
//       );

//       setConnected(true);
//       setSocketError(null);

//       const socket =
//         socketRef.current;

//       if (!socket) {
//         return;
//       }

//       const payload = {
//         quizId:
//           quizIdRef.current,

//         quiz_id:
//           quizIdRef.current,

//         roomId:
//           roomIdRef.current,

//         room_id:
//           roomIdRef.current,

//         role:
//           roleRef.current,

//         currentRound:
//           currentRoundRef.current,

//         roundNumber:
//           currentRoundRef.current,

//         round_number:
//           currentRoundRef.current,
//       };

//       console.log(
//         "[useQuizSocket] JOIN ROOM",
//         payload,
//       );

//       socket.emit(
//         "join_room",
//         payload,
//       );
//     }, []);

//   /* ------------------------------------------------------------------------ */
//   /* Disconnect                                                               */
//   /* ------------------------------------------------------------------------ */

//   const handleDisconnect =
//     useCallback(
//       (
//         reason?: string,
//       ) => {
//         console.warn(
//           "[useQuizSocket] SOCKET DISCONNECTED",
//           reason,
//         );

//         setConnected(false);
//         setRoomJoined(false);

//         /*
//          * IMPORTANT:
//          *
//          * We intentionally do NOT clear selectedAnswer here.
//          *
//          * A temporary reconnect must not let the contestant
//          * answer the same question again.
//          */
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Connect error                                                            */
//   /* ------------------------------------------------------------------------ */

//   const handleConnectError =
//     useCallback(
//       (
//         error: unknown,
//       ) => {
//         const message =
//           error instanceof Error
//             ? error.message
//             : String(error);

//         console.error(
//           "[useQuizSocket] CONNECT ERROR",
//           message,
//         );

//         setSocketError(
//           message,
//         );

//         setConnected(false);
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Joined room                                                              */
//   /* ------------------------------------------------------------------------ */

//   const handleJoinedRoomAck =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] JOIN ROOM ACK",
//           payload,
//         );

//         setRoomJoined(true);

//         /*
//          * Host asks for room document.
//          * Contestants wait for room_state / question events.
//          */
//         if (
//           roleRef.current ===
//           "HOST"
//         ) {
//           const socket =
//             socketRef.current;

//           if (!socket) {
//             return;
//           }

//           socket.emit(
//             "get_room_doc",
//             {
//               quizId:
//                 quizIdRef.current,

//               quiz_id:
//                 quizIdRef.current,

//               roomId:
//                 roomIdRef.current,

//               room_id:
//                 roomIdRef.current,
//             },
//           );
//         }
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Room activated                                                           */
//   /* ------------------------------------------------------------------------ */

//   const handleRoomActivated =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] ROOM ACTIVATED",
//           payload,
//         );

//         setRoomActivated(
//           true,
//         );

//         setSocketError(
//           null,
//         );

//         const root =
//           asRecord(payload);

//         if (!root) {
//           return;
//         }

//         const round =
//           getNumber(
//             root.currentRound,
//           ) ??
//           getNumber(
//             root.current_round,
//           ) ??
//           getNumber(
//             root.roundNumber,
//           ) ??
//           getNumber(
//             root.round_number,
//           );

//         if (round !== null) {
//           currentRoundRef.current =
//             round;

//           setSocketCurrentRound(
//             round,
//           );

//           onRoundChangedRef.current?.(
//             round,
//           );
//         }
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Round started                                                            */
//   /* ------------------------------------------------------------------------ */

//   const handleRoundStarted =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] ROUND STARTED",
//           payload,
//         );

//         const root =
//           asRecord(payload);

//         if (root) {
//           const round =
//             getNumber(
//               root.currentRound,
//             ) ??
//             getNumber(
//               root.current_round,
//             ) ??
//             getNumber(
//               root.roundNumber,
//             ) ??
//             getNumber(
//               root.round_number,
//             );

//           if (round !== null) {
//             currentRoundRef.current =
//               round;

//             setSocketCurrentRound(
//               round,
//             );

//             onRoundChangedRef.current?.(
//               round,
//             );
//           }
//         }

//         /*
//          * A round can begin before the first question.
//          */
//         questionStartedRef.current =
//           false;

//         questionLockedRef.current =
//           false;

//         selectedAnswerRef.current =
//           null;

//         answerSubmittedRef.current =
//           false;

//         setQuestionStartedState(
//           false,
//         );

//         setQuestionLockedState(
//           false,
//         );

//         setSelectedAnswerState(
//           null,
//         );

//         setAnswerSubmittedState(
//           false,
//         );

//         setSubmittingAnswer(
//           false,
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Question started                                                         */
//   /* ------------------------------------------------------------------------ */

//   const handleQuestionStarted =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] QUESTION STARTED",
//           payload,
//         );

//         questionStartedRef.current =
//           true;

//         questionLockedRef.current =
//           false;

//         setQuestionStartedState(
//           true,
//         );

//         setQuestionLockedState(
//           false,
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Question events                                                          */
//   /* ------------------------------------------------------------------------ */

//   const handleNewQuestion =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] NEW QUESTION",
//           payload,
//         );

//         applyQuestion(
//           payload,
//         );
//       },
//       [applyQuestion],
//     );

//   const handleNewQuestionDisplayed =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] NEW QUESTION DISPLAYED",
//           payload,
//         );

//         applyQuestion(
//           payload,
//         );
//       },
//       [applyQuestion],
//     );

//   const handleQuestionDisplayed =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] QUESTION DISPLAYED",
//           payload,
//         );

//         applyQuestion(
//           payload,
//         );
//       },
//       [applyQuestion],
//     );

//   const handleNextQuestion =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] NEXT QUESTION",
//           payload,
//         );

//         applyQuestion(
//           payload,
//         );
//       },
//       [applyQuestion],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Question locked                                                          */
//   /* ------------------------------------------------------------------------ */

//   const handleQuestionLocked =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] QUESTION LOCKED",
//           payload,
//         );

//         questionLockedRef.current =
//           true;

//         setQuestionLockedState(
//           true,
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Participant joined                                                       */
//   /* ------------------------------------------------------------------------ */

//   const handleParticipantJoined =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] PARTICIPANT JOINED",
//           payload,
//         );

//         const values =
//           extractParticipants(
//             payload,
//           );

//         if (values.length > 0) {
//           setParticipants(
//             mapParticipants(values),
//           );
//         }

//         addFeedEvent(
//           "PARTICIPANT_JOINED",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Participant selected answer                                              */
//   /* ------------------------------------------------------------------------ */

//   const handleParticipantSelectedAnswer =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] PARTICIPANT SELECTED ANSWER",
//           payload,
//         );

//         /*
//          * The contestant already locks locally before emitting.
//          *
//          * This event is mainly useful for host/live feed purposes.
//          */
//         addFeedEvent(
//           "PARTICIPANT_SELECTED_ANSWER",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Answer result                                                            */
//   /* ------------------------------------------------------------------------ */

//   const handleAnswerResult =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] ANSWER RESULT",
//           payload,
//         );

//         /*
//          * Backend has responded.
//          *
//          * DO NOT unlock the option buttons.
//          *
//          * The contestant remains locked until
//          * new_question_displayed arrives.
//          */
//         answerSubmittedRef.current =
//           true;

//         questionLockedRef.current =
//           true;

//         setAnswerSubmittedState(
//           true,
//         );

//         setQuestionLockedState(
//           true,
//         );

//         setSubmittingAnswer(
//           false,
//         );

//         addFeedEvent(
//           "ANSWER_RESULT",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Scoreboard                                                               */
//   /* ------------------------------------------------------------------------ */

//   const handleLeaderboardUpdated =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] SCOREBOARD UPDATE",
//           payload,
//         );

//         const values =
//           extractLeaderboard(
//             payload,
//           );

//         if (values.length > 0) {
//           setLeaderboard(
//             mapLeaderboard(values),
//           );
//         }

//         addFeedEvent(
//           "SCOREBOARD_UPDATE",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Ladder                                                                   */
//   /* ------------------------------------------------------------------------ */

//   const handleLadderUpdated =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] LADDER UPDATE",
//           payload,
//         );

//         addFeedEvent(
//           "LADDER_UPDATE",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Participants eliminated                                                  */
//   /* ------------------------------------------------------------------------ */

//   const handleParticipantsEliminated =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] PARTICIPANTS ELIMINATED",
//           payload,
//         );

//         addFeedEvent(
//           "PARTICIPANTS_ELIMINATED",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* First correct                                                            */
//   /* ------------------------------------------------------------------------ */

//   const handleFirstCorrect =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.log(
//           "[useQuizSocket] FIRST CORRECT",
//           payload,
//         );

//         addFeedEvent(
//           "FIRST_CORRECT",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Socket error                                                             */
//   /* ------------------------------------------------------------------------ */

//   const handleSocketError =
//     useCallback(
//       (
//         payload: unknown,
//       ) => {
//         console.error(
//           "[useQuizSocket] SOCKET ERROR",
//           payload,
//         );

//         const root =
//           asRecord(payload);

//         const message =
//           typeof payload === "string"
//             ? payload
//             : root
//               ? getString(
//                   root.message,
//                 ) ??
//                 getString(
//                   root.error,
//                 ) ??
//                 getString(
//                   root.reason,
//                 ) ??
//                 "Quiz socket error."
//               : "Quiz socket error.";

//         setSocketError(
//           message,
//         );

//         setSubmittingAnswer(
//           false,
//         );

//         setActionLoading(
//           false,
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Contestant answer selection                                              */
//   /* ------------------------------------------------------------------------ */

//   const selectContestantAnswer =
//     useCallback(
//       (
//         value: string,
//       ) => {
//         const answer =
//           String(
//             value ?? "",
//           ).trim();

//         if (!answer) {
//           return;
//         }

//         if (
//           roleRef.current !==
//           "CONTESTANT"
//         ) {
//           return;
//         }

//         const socket =
//           socketRef.current;

//         if (!socket) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: socket missing",
//           );

//           return;
//         }

//         if (!socket.connected) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: socket disconnected",
//           );

//           return;
//         }

//         if (!roomJoined) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: room not joined",
//           );

//           return;
//         }

//         if (!roomActivated) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: room not activated",
//           );

//           return;
//         }

//         if (
//           !questionStartedRef.current
//         ) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: question not started",
//           );

//           return;
//         }

//         if (
//           questionLockedRef.current
//         ) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: question already locked",
//           );

//           return;
//         }

//         if (
//           answerSubmittedRef.current
//         ) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: answer already submitted",
//           );

//           return;
//         }

//         const activeQuestion =
//           questionRef.current;

//         if (
//           !activeQuestion?.id
//         ) {
//           console.warn(
//             "[useQuizSocket] ANSWER BLOCKED: question ID missing",
//           );

//           return;
//         }

//         /*
//          * ---------------------------------------------------------------
//          * CRITICAL LOCK
//          * ---------------------------------------------------------------
//          *
//          * These refs/state are changed BEFORE socket.emit().
//          *
//          * Therefore:
//          *
//          * click A
//          * click B immediately afterwards
//          *
//          * cannot submit B.
//          */
//         selectedAnswerRef.current =
//           answer;

//         answerSubmittedRef.current =
//           true;

//         questionLockedRef.current =
//           true;

//         setSelectedAnswerState(
//           answer,
//         );

//         setAnswerSubmittedState(
//           true,
//         );

//         setQuestionLockedState(
//           true,
//         );

//         setSubmittingAnswer(
//           true,
//         );

//         const questionNumber =
//           activeQuestion.questionNumber ??
//           currentQuestionNumber ??
//           null;

//         const roundNumber =
//           currentRoundRef.current;

//         const payload = {
//           quizId:
//             quizIdRef.current,

//           quiz_id:
//             quizIdRef.current,

//           roomId:
//             roomIdRef.current,

//           room_id:
//             roomIdRef.current,

//           questionId:
//             activeQuestion.id,

//           question_id:
//             activeQuestion.id,

//           questionNumber,

//           question_number:
//             questionNumber,

//           roundNumber,

//           round_number:
//             roundNumber,

//           answer,

//           selectedAnswer:
//             answer,

//           selected_answer:
//             answer,
//         };

//         console.log(
//           "[useQuizSocket] CONTESTANT ANSWER SELECTED",
//           payload,
//         );

//         socket.emit(
//           "participant_selected_answer",
//           payload,
//         );
//       },
//       [
//         roomJoined,
//         roomActivated,
//         currentQuestionNumber,
//       ],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* setSelectedAnswer                                                        */
//   /* ------------------------------------------------------------------------ */

//   const setSelectedAnswer =
//     useCallback<
//       Dispatch<
//         SetStateAction<string | null>
//       >
//     >(
//       (
//         value,
//       ) => {
//         const previous =
//           selectedAnswerRef.current;

//         const resolved =
//           typeof value ===
//           "function"
//             ? value(previous)
//             : value;

//         /*
//          * Contestant selection:
//          *
//          * setSelectedAnswer("A")
//          *      ↓
//          * participant_selected_answer
//          */
//         if (
//           roleRef.current ===
//             "CONTESTANT" &&
//           resolved !== null
//         ) {
//           selectContestantAnswer(
//             resolved,
//           );

//           return;
//         }

//         /*
//          * Host / generic state update.
//          */
//         selectedAnswerRef.current =
//           resolved;

//         setSelectedAnswerState(
//           resolved,
//         );
//       },
//       [
//         selectContestantAnswer,
//       ],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* setQuestionStarted                                                       */
//   /* ------------------------------------------------------------------------ */

//   const setQuestionStarted =
//     useCallback<
//       Dispatch<
//         SetStateAction<boolean>
//       >
//     >(
//       (
//         value,
//       ) => {
//         setQuestionStartedState(
//           (previous) => {
//             const resolved =
//               typeof value ===
//               "function"
//                 ? value(previous)
//                 : value;

//             questionStartedRef.current =
//               resolved;

//             return resolved;
//           },
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* setQuestionLocked                                                        */
//   /* ------------------------------------------------------------------------ */

//   const setQuestionLocked =
//     useCallback<
//       Dispatch<
//         SetStateAction<boolean>
//       >
//     >(
//       (
//         value,
//       ) => {
//         setQuestionLockedState(
//           (previous) => {
//             const resolved =
//               typeof value ===
//               "function"
//                 ? value(previous)
//                 : value;

//             questionLockedRef.current =
//               resolved;

//             return resolved;
//           },
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* setAnswerSubmitted                                                       */
//   /* ------------------------------------------------------------------------ */

//   const setAnswerSubmitted =
//     useCallback<
//       Dispatch<
//         SetStateAction<boolean>
//       >
//     >(
//       (
//         value,
//       ) => {
//         setAnswerSubmittedState(
//           (previous) => {
//             const resolved =
//               typeof value ===
//               "function"
//                 ? value(previous)
//                 : value;

//             answerSubmittedRef.current =
//               resolved;

//             return resolved;
//           },
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* setTimeLimit                                                             */
//   /* ------------------------------------------------------------------------ */

//   const setTimeLimit =
//     useCallback<
//       Dispatch<
//         SetStateAction<number>
//       >
//     >(
//       (
//         value,
//       ) => {
//         setTimeLimitState(
//           (previous) => {
//             const requested =
//               typeof value ===
//               "function"
//                 ? value(previous)
//                 : value;

//             const resolved =
//               Number.isFinite(
//                 requested,
//               ) &&
//               requested > 0
//                 ? requested
//                 : 30;

//             timeLimitRef.current =
//               resolved;

//             return resolved;
//           },
//         );
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Socket listeners                                                         */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     disposedRef.current =
//       false;

//     if (
//       !quizId ||
//       !resolvedRoomId
//     ) {
//       console.warn(
//         "[useQuizSocket] Missing quizId or roomId",
//         {
//           quizId,
//           roomId:
//             resolvedRoomId,
//           role,
//         },
//       );

//       return;
//     }

//     const socket =
//       getQuizSocket();

//     socketRef.current =
//       socket;

//     const onRoomState = (
//       payload: unknown,
//     ) => {
//       handleRoomState(
//         payload,
//       );
//     };

//     const onGetRoomAck = (
//       payload: unknown,
//     ) => {
//       handleGetRoomAck(
//         payload,
//       );
//     };

//     const onJoinedRoomAck = (
//       payload: unknown,
//     ) => {
//       handleJoinedRoomAck(
//         payload,
//       );
//     };

//     const onRoomActivated = (
//       payload: unknown,
//     ) => {
//       handleRoomActivated(
//         payload,
//       );
//     };

//     const onRoundStarted = (
//       payload: unknown,
//     ) => {
//       handleRoundStarted(
//         payload,
//       );
//     };

//     const onQuestionStarted = (
//       payload: unknown,
//     ) => {
//       handleQuestionStarted(
//         payload,
//       );
//     };

//     const onNewQuestion = (
//       payload: unknown,
//     ) => {
//       handleNewQuestion(
//         payload,
//       );
//     };

//     const onNewQuestionDisplayed = (
//       payload: unknown,
//     ) => {
//       handleNewQuestionDisplayed(
//         payload,
//       );
//     };

//     const onQuestionDisplayed = (
//       payload: unknown,
//     ) => {
//       handleQuestionDisplayed(
//         payload,
//       );
//     };

//     const onNextQuestion = (
//       payload: unknown,
//     ) => {
//       handleNextQuestion(
//         payload,
//       );
//     };

//     const onQuestionLocked = (
//       payload: unknown,
//     ) => {
//       handleQuestionLocked(
//         payload,
//       );
//     };

//     const onParticipantJoined = (
//       payload: unknown,
//     ) => {
//       handleParticipantJoined(
//         payload,
//       );
//     };

//     const onParticipantSelectedAnswer = (
//       payload: unknown,
//     ) => {
//       handleParticipantSelectedAnswer(
//         payload,
//       );
//     };

//     const onAnswerResult = (
//       payload: unknown,
//     ) => {
//       handleAnswerResult(
//         payload,
//       );
//     };

//     const onScoreboardUpdate = (
//       payload: unknown,
//     ) => {
//       handleLeaderboardUpdated(
//         payload,
//       );
//     };

//     const onLadderUpdate = (
//       payload: unknown,
//     ) => {
//       handleLadderUpdated(
//         payload,
//       );
//     };

//     const onParticipantsEliminated = (
//       payload: unknown,
//     ) => {
//       handleParticipantsEliminated(
//         payload,
//       );
//     };

//     const onFirstCorrect = (
//       payload: unknown,
//     ) => {
//       handleFirstCorrect(
//         payload,
//       );
//     };

//     const onSocketError = (
//       payload: unknown,
//     ) => {
//       handleSocketError(
//         payload,
//       );
//     };

//     const onMessage = (
//       payload: unknown,
//     ) => {
//       console.log(
//         "[useQuizSocket] MESSAGE",
//         payload,
//       );
//     };

//     const onRoundCompleted = (
//       payload: unknown,
//     ) => {
//       console.log(
//         "[useQuizSocket] ROUND COMPLETED",
//         payload,
//       );

//       addFeedEvent(
//         "ROUND_COMPLETED",
//         payload,
//       );
//     };

//     /*
//      * Register listeners.
//      */
//     socket.on(
//       "room_state",
//       onRoomState,
//     );

//     socket.on(
//       "get_room_doc_ack",
//       onGetRoomAck,
//     );

//     socket.on(
//       "joined_room_ack",
//       onJoinedRoomAck,
//     );

//     socket.on(
//       "join_room_ack",
//       onJoinedRoomAck,
//     );

//     socket.on(
//       "room_joined",
//       onJoinedRoomAck,
//     );

//     socket.on(
//       "room_activated",
//       onRoomActivated,
//     );

//     socket.on(
//       "round_started",
//       onRoundStarted,
//     );

//     socket.on(
//       "question_started",
//       onQuestionStarted,
//     );

//     socket.on(
//       "new_question",
//       onNewQuestion,
//     );

//     socket.on(
//       "new_question_displayed",
//       onNewQuestionDisplayed,
//     );

//     socket.on(
//       "question_displayed",
//       onQuestionDisplayed,
//     );

//     socket.on(
//       "next_question",
//       onNextQuestion,
//     );

//     socket.on(
//       "question_locked",
//       onQuestionLocked,
//     );

//     socket.on(
//       "participant_joined",
//       onParticipantJoined,
//     );

//     socket.on(
//       "participant_selected_answer",
//       onParticipantSelectedAnswer,
//     );

//     socket.on(
//       "answer_result",
//       onAnswerResult,
//     );

//     socket.on(
//       "scoreboard_update",
//       onScoreboardUpdate,
//     );

//     socket.on(
//       "leaderboard_update",
//       onScoreboardUpdate,
//     );

//     socket.on(
//       "ladder_update",
//       onLadderUpdate,
//     );

//     socket.on(
//       "participants_eliminated",
//       onParticipantsEliminated,
//     );

//     socket.on(
//       "first_correct",
//       onFirstCorrect,
//     );

//     socket.on(
//       "socket_error",
//       onSocketError,
//     );

//     socket.on(
//       "message",
//       onMessage,
//     );

//     socket.on(
//       "round_completed",
//       onRoundCompleted,
//     );

//     /*
//      * If socket is already connected, join immediately.
//      */
//     if (socket.connected) {
//       handleConnect();
//     }

//     return () => {
//       disposedRef.current =
//         true;

//       socket.off(
//         "room_state",
//         onRoomState,
//       );

//       socket.off(
//         "get_room_doc_ack",
//         onGetRoomAck,
//       );

//       socket.off(
//         "joined_room_ack",
//         onJoinedRoomAck,
//       );

//       socket.off(
//         "join_room_ack",
//         onJoinedRoomAck,
//       );

//       socket.off(
//         "room_joined",
//         onJoinedRoomAck,
//       );

//       socket.off(
//         "room_activated",
//         onRoomActivated,
//       );

//       socket.off(
//         "round_started",
//         onRoundStarted,
//       );

//       socket.off(
//         "question_started",
//         onQuestionStarted,
//       );

//       socket.off(
//         "new_question",
//         onNewQuestion,
//       );

//       socket.off(
//         "new_question_displayed",
//         onNewQuestionDisplayed,
//       );

//       socket.off(
//         "question_displayed",
//         onQuestionDisplayed,
//       );

//       socket.off(
//         "next_question",
//         onNextQuestion,
//       );

//       socket.off(
//         "question_locked",
//         onQuestionLocked,
//       );

//       socket.off(
//         "participant_joined",
//         onParticipantJoined,
//       );

//       socket.off(
//         "participant_selected_answer",
//         onParticipantSelectedAnswer,
//       );

//       socket.off(
//         "answer_result",
//         onAnswerResult,
//       );

//       socket.off(
//         "scoreboard_update",
//         onScoreboardUpdate,
//       );

//       socket.off(
//         "leaderboard_update",
//         onScoreboardUpdate,
//       );

//       socket.off(
//         "ladder_update",
//         onLadderUpdate,
//       );

//       socket.off(
//         "participants_eliminated",
//         onParticipantsEliminated,
//       );

//       socket.off(
//         "first_correct",
//         onFirstCorrect,
//       );

//       socket.off(
//         "socket_error",
//         onSocketError,
//       );

//       socket.off(
//         "message",
//         onMessage,
//       );

//       socket.off(
//         "round_completed",
//         onRoundCompleted,
//       );
//     };
//   }, [
//     quizId,
//     resolvedRoomId,
//     role,

//     addFeedEvent,

//     handleConnect,
//     handleRoomState,
//     handleGetRoomAck,
//     handleJoinedRoomAck,
//     handleRoomActivated,
//     handleRoundStarted,
//     handleQuestionStarted,
//     handleNewQuestion,
//     handleNewQuestionDisplayed,
//     handleQuestionDisplayed,
//     handleNextQuestion,
//     handleQuestionLocked,
//     handleParticipantJoined,
//     handleParticipantSelectedAnswer,
//     handleAnswerResult,
//     handleLeaderboardUpdated,
//     handleLadderUpdated,
//     handleParticipantsEliminated,
//     handleFirstCorrect,
//     handleSocketError,
//   ]);

//   /* ------------------------------------------------------------------------ */
//   /* Connection listeners                                                     */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     const socket =
//       socketRef.current;

//     if (!socket) {
//       return;
//     }

//     socket.on(
//       "connect",
//       handleConnect,
//     );

//     socket.on(
//       "disconnect",
//       handleDisconnect,
//     );

//     socket.on(
//       "connect_error",
//       handleConnectError,
//     );

//     return () => {
//       socket.off(
//         "connect",
//         handleConnect,
//       );

//       socket.off(
//         "disconnect",
//         handleDisconnect,
//       );

//       socket.off(
//         "connect_error",
//         handleConnectError,
//       );
//     };
//   }, [
//     handleConnect,
//     handleDisconnect,
//     handleConnectError,
//   ]);

//   /* ------------------------------------------------------------------------ */
//   /* Host actions                                                             */
//   /* ------------------------------------------------------------------------ */

//   const actions =
//     useQuizSocketActions({
//       quizId,

//       roomId:
//         resolvedRoomId,

//       currentRoundRef,

//       selectedQuestionRef,

//       timeLimitRef,

//       questionRef,

//       setActionLoading,

//       setSocketError,

//       setQuestionStarted,

//       setQuestionLocked,

//       setSelectedAnswer,

//       setAnswerSubmitted,

//       setSubmittingAnswer,
//     });

//   /* ------------------------------------------------------------------------ */
//   /* Refresh socket state                                                     */
//   /* ------------------------------------------------------------------------ */

//   const refreshSocketState =
//     useCallback(() => {
//       const socket =
//         socketRef.current ??
//         getQuizSocket();

//       socketRef.current =
//         socket;

//       if (!socket.connected) {
//         console.warn(
//           "[useQuizSocket] Cannot refresh: socket disconnected",
//         );

//         return;
//       }

//       socket.emit(
//         "get_room_doc",
//         {
//           quizId:
//             quizIdRef.current,

//           quiz_id:
//             quizIdRef.current,

//           roomId:
//             roomIdRef.current,

//           room_id:
//             roomIdRef.current,
//         },
//       );
//     }, []);

//   /* ------------------------------------------------------------------------ */
//   /* Return                                                                   */
//   /* ------------------------------------------------------------------------ */

//   return {
//     connected,

//     roomJoined,

//     roomActivated,

//     roomDoc,

//     currentRound:
//       socketCurrentRound,

//     question,

//     currentQuestionNumber,

//     questionStarted,

//     questionLocked,

//     selectedAnswer:
//       selectedAnswerState,

//     answerSubmitted,

//     submittingAnswer,

//     participants,

//     leaderboard,

//     feedEvents,

//     socketError,

//     actionLoading,

//     timeLimit:
//       timeLimitState,

//     setTimeLimit,

//     setSelectedAnswer,

//     startQuestion:
//       actions.startQuestion,

//     lockQuestion:
//       actions.lockQuestion,

//     nextQuestion:
//       actions.nextQuestion,

//     /*
//      * Kept for compatibility with existing code.
//      *
//      * Contestants should NOT call this.
//      * Contestants use setSelectedAnswer(), which emits
//      * participant_selected_answer.
//      */
//     submitAnswer:
//       actions.submitAnswer,

//     refreshSocketState,
//   };
// }










































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
 * QUESTION EXTRACTION
 * ========================================================== */

/**
 * Generic object type used for safely inspecting unknown
 * Socket.IO payloads.
 *
 * IMPORTANT:
 * Do NOT use `value is SocketPayload` here.
 *
 * The backend sends several different payload shapes and
 * TypeScript can incorrectly narrow those branches to `never`
 * when SocketPayload is used as the type predicate.
 */
type UnknownObject = Record<string, unknown>;

/**
 * Safely determines whether a value is a plain object.
 */
function isRecord(
  value: unknown,
): value is UnknownObject {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * Determines whether an object looks like a quiz question.
 *
 * Current backend payload:
 *
 * {
 *   quizId: "...",
 *   id: "...",
 *   question: "The classification...",
 *   options: [
 *     { label: "A", value: "Taxonomy" },
 *     ...
 *   ],
 *   startTime: "...",
 *   questionNumber: 1
 * }
 *
 * IMPORTANT:
 * This returns `boolean`, NOT a TypeScript type predicate.
 *
 * That prevents the `never` errors you were getting.
 */
function isQuestionObject(
  value: unknown,
): boolean {
  if (!isRecord(value)) {
    return false;
  }

  if (!Array.isArray(value.options)) {
    return false;
  }

  return (
    typeof value.question === "string" ||
    typeof value.content === "string" ||
    typeof value.text === "string"
  );
}

/**
 * Extract a question from all supported server payload shapes.
 *
 * IMPORTANT:
 *
 * We MUST inspect the original payload BEFORE calling
 * unwrapPayload().
 *
 * The current backend sends the question directly:
 *
 * {
 *   quizId,
 *   id,
 *   question: "question text",
 *   options: [...],
 *   startTime,
 *   questionNumber
 * }
 *
 * unwrapPayload() can interpret `question` as a wrapper and
 * return the question text.
 *
 * Therefore:
 *
 *     ORIGINAL PAYLOAD
 *           ↓
 *     question object?
 *           ↓
 *     YES → return it
 *           ↓
 *     NO
 *           ↓
 *     inspect wrappers
 *           ↓
 *     unwrapPayload()
 */
function extractQuestion(
  payload: SocketPayload,
): unknown {
  /*
   * ----------------------------------------------------------
   * 1. CHECK THE ORIGINAL PAYLOAD FIRST
   * ----------------------------------------------------------
   *
   * This is the most important part.
   *
   * The actual backend event currently looks like:
   *
   * {
   *   quizId: "...",
   *   id: "...",
   *   question: "...",
   *   options: [...],
   *   startTime: "...",
   *   questionNumber: 1
   * }
   */
  if (isQuestionObject(payload)) {
    console.log(
      "[Quiz Socket] extractQuestion() - DIRECT QUESTION OBJECT FOUND",
    );

    return payload;
  }

  /*
   * ----------------------------------------------------------
   * 2. INSPECT COMMON WRAPPER SHAPES
   * ----------------------------------------------------------
   */
  if (isRecord(payload)) {
    /*
     * Possible:
     *
     * {
     *   currentQuestion: {...}
     * }
     */
    const directCandidates: unknown[] = [
      payload.currentQuestion,
      payload.current_question,
      payload.activeQuestion,
      payload.active_question,
      payload.questionData,
      payload.question_data,
    ];

    for (const candidate of directCandidates) {
      if (isQuestionObject(candidate)) {
        console.log(
          "[Quiz Socket] extractQuestion() - NESTED QUESTION OBJECT FOUND",
        );

        return candidate;
      }
    }

    /*
     * --------------------------------------------------------
     * data wrapper
     * --------------------------------------------------------
     *
     * {
     *   data: {
     *     question: {...}
     *   }
     * }
     */
    const nestedData = payload.data;

    /*
     * data itself may be the question:
     *
     * {
     *   data: {
     *     id: "...",
     *     question: "...",
     *     options: [...]
     *   }
     * }
     */
    if (isQuestionObject(nestedData)) {
      console.log(
        "[Quiz Socket] extractQuestion() - DATA QUESTION OBJECT FOUND",
      );

      return nestedData;
    }

    if (isRecord(nestedData)) {
      const nestedCandidates: unknown[] = [
        nestedData.question,
        nestedData.currentQuestion,
        nestedData.current_question,
        nestedData.activeQuestion,
        nestedData.active_question,
        nestedData.questionData,
        nestedData.question_data,
      ];

      for (const candidate of nestedCandidates) {
        if (isQuestionObject(candidate)) {
          console.log(
            "[Quiz Socket] extractQuestion() - NESTED DATA QUESTION OBJECT FOUND",
          );

          return candidate;
        }
      }
    }

    /*
     * --------------------------------------------------------
     * result wrapper
     * --------------------------------------------------------
     *
     * {
     *   result: {
     *     question: {...}
     *   }
     * }
     */
    const result = payload.result;

    if (isQuestionObject(result)) {
      console.log(
        "[Quiz Socket] extractQuestion() - RESULT QUESTION OBJECT FOUND",
      );

      return result;
    }

    if (isRecord(result)) {
      const resultQuestion = result.question;

      if (isQuestionObject(resultQuestion)) {
        console.log(
          "[Quiz Socket] extractQuestion() - RESULT.NESTED QUESTION OBJECT FOUND",
        );

        return resultQuestion;
      }
    }
  }

  /*
   * ----------------------------------------------------------
   * 3. ONLY NOW USE unwrapPayload()
   * ----------------------------------------------------------
   *
   * This is retained for older backend payload formats.
   */
  const unwrapped = unwrapPayload(payload);

  /*
   * The unwrapped value itself may be the question.
   */
  if (isQuestionObject(unwrapped)) {
    console.log(
      "[Quiz Socket] extractQuestion() - UNWRAPPED QUESTION OBJECT FOUND",
    );

    return unwrapped;
  }

  /*
   * The unwrapped value may contain the question.
   */
  if (isRecord(unwrapped)) {
    /*
     * {
     *   question: {...}
     * }
     */
    const nestedQuestion = unwrapped.question;

    if (isQuestionObject(nestedQuestion)) {
      console.log(
        "[Quiz Socket] extractQuestion() - UNWRAPPED NESTED QUESTION OBJECT FOUND",
      );

      return nestedQuestion;
    }

    /*
     * Other possible aliases.
     */
    const candidates: unknown[] = [
      unwrapped.currentQuestion,
      unwrapped.current_question,
      unwrapped.activeQuestion,
      unwrapped.active_question,
      unwrapped.questionData,
      unwrapped.question_data,
    ];

    for (const candidate of candidates) {
      if (isQuestionObject(candidate)) {
        console.log(
          "[Quiz Socket] extractQuestion() - UNWRAPPED ALIAS QUESTION OBJECT FOUND",
        );

        return candidate;
      }
    }

    /*
     * Some older responses may contain:
     *
     * {
     *   data: {
     *     question: {...}
     *   }
     * }
     */
    const unwrappedData = unwrapped.data;

    if (isQuestionObject(unwrappedData)) {
      console.log(
        "[Quiz Socket] extractQuestion() - UNWRAPPED DATA QUESTION OBJECT FOUND",
      );

      return unwrappedData;
    }

    if (isRecord(unwrappedData)) {
      const dataQuestion = unwrappedData.question;

      if (isQuestionObject(dataQuestion)) {
        console.log(
          "[Quiz Socket] extractQuestion() - UNWRAPPED DATA.NESTED QUESTION OBJECT FOUND",
        );

        return dataQuestion;
      }
    }

    /*
     * Older result wrapper.
     */
    const unwrappedResult = unwrapped.result;

    if (isQuestionObject(unwrappedResult)) {
      console.log(
        "[Quiz Socket] extractQuestion() - UNWRAPPED RESULT QUESTION OBJECT FOUND",
      );

      return unwrappedResult;
    }

    if (isRecord(unwrappedResult)) {
      const resultQuestion = unwrappedResult.question;

      if (isQuestionObject(resultQuestion)) {
        console.log(
          "[Quiz Socket] extractQuestion() - UNWRAPPED RESULT.NESTED QUESTION OBJECT FOUND",
        );

        return resultQuestion;
      }
    }
  }

  /*
   * ----------------------------------------------------------
   * 4. NOTHING FOUND
   * ----------------------------------------------------------
   */
  console.warn(
    "[Quiz Socket] extractQuestion() - NO QUESTION OBJECT FOUND",
    {
      payload,
      unwrapped,
    },
  );

  return undefined;
}











/**
 * Extract the question number from all supported payload shapes.
 */
function extractQuestionNumber(
  payload: SocketPayload,
): number | null {
  /*
   * Do not rely exclusively on unwrapPayload().
   *
   * The backend's current payload contains questionNumber
   * directly on the question object.
   */
  if (
    isObject(payload)
  ) {
    const directNumber =
      getNumber(
        payload.questionNumber ??
          payload.question_number ??
          payload.currentQuestionNumber ??
          payload.current_question_number ??
          payload.questionIndex ??
          payload.question_index,
        null,
      );

    if (
      directNumber !== null
    ) {
      return directNumber;
    }

    if (
      isObject(payload.data)
    ) {
      const nestedNumber =
        getNumber(
          payload.data.questionNumber ??
            payload.data.question_number ??
            payload.data.currentQuestionNumber ??
            payload.data.current_question_number ??
            payload.data.questionIndex ??
            payload.data.question_index,
          null,
        );

      if (
        nestedNumber !== null
      ) {
        return nestedNumber;
      }
    }
  }

  const data =
    unwrapPayload(payload);

  if (
    isObject(data)
  ) {
    return getNumber(
      data.questionNumber ??
        data.question_number ??
        data.currentQuestionNumber ??
        data.current_question_number ??
        data.questionIndex ??
        data.question_index,
      null,
    );
  }

  return null;
}




/**
 * Determine whether a question payload is actually playable.
 */
function hasPlayableQuestion(
  question: LiveQuestion | null,
): boolean {
  if (!question) {
    return false;
  }

  return Boolean(
    question.question ||
      question.options,
  );
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
    typeof currentRound === "number"
      ? currentRound
      : typeof initialRound === "number"
        ? initialRound
        : 0;

  const initialResolvedTimeLimit =
    initialTimeLimit ?? 30;

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
    quizIdRef.current = quizId;
  }, [quizId]);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    roleRef.current = role;
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

        console.log(
          "[Quiz Socket] ROUND UPDATE:",
          roundNumber,
        );

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
   * APPLY QUESTION
   * ======================================================== */

  const applyQuestion =
    useCallback(
      (
        payload: SocketPayload,
        source: string,
        markStarted = true,
      ) => {
        if (disposedRef.current) {
          return false;
        }

        /*
         * IMPORTANT:
         *
         * extractQuestion() intentionally receives the
         * ORIGINAL payload. It must not receive the result
         * of unwrapPayload().
         */
        const rawQuestion =
          extractQuestion(
            payload,
          );

        console.log(
          `[Quiz Socket] ${source} - RAW QUESTION:`,
          rawQuestion,
        );

        console.log(
          `[Quiz Socket] ${source} - RAW QUESTION JSON:`,
          rawQuestion
            ? JSON.stringify(
                rawQuestion,
                null,
                2,
              )
            : null,
        );

        const normalizedQuestion =
          normalizeQuestion(
            rawQuestion,
          );

        console.log(
          `[Quiz Socket] ${source} - NORMALIZED QUESTION:`,
          normalizedQuestion,
        );

        const payloadQuestionNumber =
          extractQuestionNumber(
            payload,
          );

        if (
          !normalizedQuestion &&
          payloadQuestionNumber === null
        ) {
          console.warn(
            `[Quiz Socket] ${source} - NO QUESTION FOUND`,
          );

          return false;
        }

        if (normalizedQuestion) {
  /*
   * The backend's new_question_displayed event currently
   * contains startTime but may not contain timeLimit.
   *
   * Use the existing socket time limit as the fallback.
   */
  const effectiveTimeLimit =
    normalizedQuestion.timeLimit !== null &&
    normalizedQuestion.timeLimit > 0
      ? normalizedQuestion.timeLimit
      : timeLimitRef.current > 0
        ? timeLimitRef.current
        : null;

  let questionWithTiming =
    normalizedQuestion;

  /*
   * If the backend gave us startTime but no expiresAt,
   * calculate the expiration locally.
   */
  if (
    effectiveTimeLimit !== null &&
    !normalizedQuestion.expiresAt &&
    normalizedQuestion.startedAt
  ) {
    const startedTimestamp =
      Date.parse(
        normalizedQuestion.startedAt,
      );

    if (
      !Number.isNaN(startedTimestamp)
    ) {
      questionWithTiming = {
        ...normalizedQuestion,

        timeLimit:
          effectiveTimeLimit,

        expiresAt:
          new Date(
            startedTimestamp +
              effectiveTimeLimit * 1000,
          ).toISOString(),
      };
    }
  } else if (
    effectiveTimeLimit !== null
  ) {
    questionWithTiming = {
      ...normalizedQuestion,

      timeLimit:
        effectiveTimeLimit,
    };
  }

  questionRef.current =
    questionWithTiming;

  setQuestion(
    questionWithTiming,
  );

  console.log(
    `[Quiz Socket] ${source} - FINAL QUESTION STATE:`,
    questionWithTiming,
  );

  if (
    questionWithTiming.questionNumber !==
      null
  ) {
    setCurrentQuestionNumber(
      questionWithTiming.questionNumber,
    );
  }

  if (
    questionWithTiming.timeLimit !==
      null &&
    questionWithTiming.timeLimit >
      0
  ) {
    timeLimitRef.current =
      questionWithTiming.timeLimit;

    setTimeLimit(
      questionWithTiming.timeLimit,
    );
  }
}

        if (
          payloadQuestionNumber !== null
        ) {
          setCurrentQuestionNumber(
            payloadQuestionNumber,
          );
        }

        if (
          normalizedQuestion &&
          hasPlayableQuestion(
            normalizedQuestion,
          )
        ) {
          setQuestionStarted(
            markStarted,
          );

          setQuestionLocked(false);
          setSelectedAnswer(null);
          setAnswerSubmitted(false);
          setSubmittingAnswer(false);

          console.log(
            `[Quiz Socket] ${source} - QUESTION APPLIED SUCCESSFULLY`,
          );

          return true;
        }


        

        /*
         * Metadata-only payload.
         */
        if (
          isObject(payload) &&
          payloadQuestionNumber !== null
        ) {
          setQuestionStarted(
            markStarted,
          );

          setQuestionLocked(false);
          setSelectedAnswer(null);
          setAnswerSubmitted(false);
          setSubmittingAnswer(false);

          return true;
        }

        return false;
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

        if (!isObject(data)) {
          return;
        }

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

        const rawQuestion =
          extractQuestion(
            payload,
          );

        if (
          rawQuestion
        ) {
          applyQuestion(
            payload,
            "ROOM STATE",
            true,
          );
        } else {
          console.log(
            "[Quiz Socket] ROOM STATE - NO ACTIVE QUESTION",
          );
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
        applyQuestion,
        updateRound,
      ],
    );

  /* ==========================================================
   * GET ROOM ACK
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

        const data =
          unwrapPayload(
            payload,
          );

        if (!isObject(data)) {
          console.warn(
            "[Quiz Socket] GET ROOM ACK - invalid room payload.",
          );

          return;
        }

        const resolvedRoomId =
          getString(
            data.roomId ??
              data.room_id ??
              roomIdRef.current,
            null,
          );

        const resolvedQuizId =
          getString(
            data.quizId ??
              data.quiz_id ??
              quizIdRef.current,
            null,
          );

        const resolvedStatus =
          normalizeStatus(
            data.status ??
              data.roomStatus ??
              data.room_status,
          );

        const resolvedRound =
          getNumber(
            data.currentRound ??
              data.current_round ??
              data.roundNumber ??
              data.round_number,
            null,
          );

        const resolvedQuestionNumber =
          getNumber(
            data.currentQuestionNumber ??
              data.current_question_number ??
              data.questionNumber ??
              data.question_number,
            null,
          );

        const participantList =
          extractParticipants(
            data,
          );

        const leaderboardEntries =
          extractLeaderboard(
            data,
          );

        const normalizedParticipants =
          mapParticipants(
            participantList,
          );

        const normalizedLeaderboard =
          mapLeaderboard(
            leaderboardEntries,
          );

        const normalizedRoomDoc:
          QuizRoomDocument = {
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

        setRoomDoc(
          normalizedRoomDoc,
        );

        if (
          resolvedStatus ===
          "IN_PROGRESS"
        ) {
          setRoomActivated(
            true,
          );
        }

        if (
          resolvedStatus ===
          "WAITING"
        ) {
          setRoomActivated(
            false,
          );
        }

        if (
          resolvedRound !== null &&
          resolvedRound >= 0
        ) {
          updateRound(
            resolvedRound,
          );
        }

        if (
          participantList.length > 0
        ) {
          setParticipants(
            normalizedParticipants,
          );
        }

        if (
          leaderboardEntries.length > 0
        ) {
          setLeaderboard(
            normalizedLeaderboard,
          );
        }

        if (
          resolvedQuestionNumber !==
          null
        ) {
          setCurrentQuestionNumber(
            resolvedQuestionNumber,
          );
        }

        const rawQuestion =
          extractQuestion(
            payload,
          );

        console.log(
          "[Quiz Socket] GET ROOM ACK - ACTIVE QUESTION:",
          rawQuestion,
        );

        if (
          rawQuestion
        ) {
          applyQuestion(
            payload,
            "GET ROOM ACK",
            true,
          );
        } else {
          console.log(
            "[Quiz Socket] GET ROOM ACK - ACTIVE QUESTION: NONE",
          );

          if (
            resolvedRound === 0 ||
            resolvedQuestionNumber === null
          ) {
            questionRef.current =
              null;

            setQuestion(
              null,
            );

            setCurrentQuestionNumber(
              null,
            );

            setQuestionStarted(
              false,
            );
          }
        }

        addFeedEvent(
          "get_room_ack",
          payload,
        );

        console.log(
          "[Quiz Socket] GET ROOM ACK PROCESSED:",
          {
            roomId:
              resolvedRoomId,

            quizId:
              resolvedQuizId,

            status:
              resolvedStatus,

            round:
              resolvedRound,

            questionNumber:
              resolvedQuestionNumber,

            participants:
              participantList.length,

            leaderboard:
              leaderboardEntries.length,

            activeQuestion:
              Boolean(rawQuestion),
          },
        );

        console.log(
          "==================================================",
        );
      },
      [
        addFeedEvent,
        applyQuestion,
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

        if (
          roleRef.current !== "HOST"
        ) {
          console.log(
            "[Quiz Socket] Contestant joined room. Waiting for live game events.",
          );

          return;
        }

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
                socket?.connected ??
                false,

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

        if (!isObject(data)) {
          return;
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
          round !== null &&
          round >= 1
        ) {
          updateRound(
            round,
          );
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

        applyQuestion(
          payload,
          "QUESTION STARTED",
          true,
        );

        addFeedEvent(
          "question_started",
          payload,
        );
      },
      [
        addFeedEvent,
        applyQuestion,
      ],
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

        applyQuestion(
          payload,
          "NEW QUESTION",
          true,
        );

        addFeedEvent(
          "new_question",
          payload,
        );
      },
      [
        addFeedEvent,
        applyQuestion,
      ],
    );

 
 
    /* ==========================================================
   * NEW QUESTION DISPLAYED
   * ======================================================== */

  const handleNewQuestionDisplayed =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "==================================================",
        );

        console.log(
          "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED:",
          payload,
        );

        console.log(
          "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED JSON:",
          JSON.stringify(
            payload,
            null,
            2,
          ),
        );

        /*
         * IMPORTANT:
         *
         * Do NOT do:
         *
         * const question = data.question;
         *
         * because `data.question` is the text.
         *
         * extractQuestion() now examines the original payload
         * BEFORE unwrapPayload().
         */
        const rawQuestion =
          extractQuestion(
            payload,
          );

        console.log(
          "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED - QUESTION OBJECT:",
          rawQuestion,
        );

        console.log(
          "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED - QUESTION OBJECT JSON:",
          rawQuestion
            ? JSON.stringify(
                rawQuestion,
                null,
                2,
              )
            : null,
        );

        /*
         * Round information must also be read without allowing
         * unwrapPayload() to destroy the original question.
         */
        let round: number | null =
          null;

        if (
          isObject(payload)
        ) {
          round =
            getNumber(
              payload.currentRound ??
                payload.current_round ??
                payload.roundNumber ??
                payload.round_number,
              null,
            );
        }

        if (
          round === null
        ) {
          const data =
            unwrapPayload(
              payload,
            );

          if (
            isObject(data)
          ) {
            round =
              getNumber(
                data.currentRound ??
                  data.current_round ??
                  data.roundNumber ??
                  data.round_number,
                null,
              );
          }
        }

        if (
          round !== null &&
          round >= 1
        ) {
          updateRound(
            round,
          );
        }

        const applied =
          applyQuestion(
            payload,
            "NEW QUESTION DISPLAYED",
            true,
          );

        if (
          !applied
        ) {
          console.error(
            "[Quiz Socket] ❌ NEW QUESTION DISPLAYED contained no usable question.",
          );
        } else {
          console.log(
            "[Quiz Socket] ✅ QUESTION STATE UPDATED SUCCESSFULLY",
          );
        }

        addFeedEvent(
          "new_question_displayed",
          payload,
        );

        console.log(
          "==================================================",
        );
      },
      [
        addFeedEvent,
        applyQuestion,
        updateRound,
      ],
    );

  /* ==========================================================
   * QUESTION DISPLAYED
   * ======================================================== */

  const handleQuestionDisplayed =
    useCallback(
      (payload: SocketPayload) => {
        if (disposedRef.current) {
          return;
        }

        console.log(
          "[Quiz Socket] QUESTION DISPLAYED:",
          payload,
        );

        applyQuestion(
          payload,
          "QUESTION DISPLAYED",
          true,
        );

        addFeedEvent(
          "question_displayed",
          payload,
        );
      },
      [
        addFeedEvent,
        applyQuestion,
      ],
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

        applyQuestion(
          payload,
          "NEXT QUESTION",
          true,
        );

        addFeedEvent(
          "next_question",
          payload,
        );
      },
      [
        addFeedEvent,
        applyQuestion,
      ],
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

        if (!isObject(data)) {
          return;
        }

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
                    String(item.id) ===
                    String(incoming.id),
                );

              if (
                existingIndex === -1
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

        if (!isObject(data)) {
          return;
        }

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

        if (!isObject(data)) {
          return;
        }

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

        if (!isObject(data)) {
          setSocketError(
            "Quiz socket error.",
          );

          setActionLoading(false);
          setSubmittingAnswer(false);

          return;
        }

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
      handleJoinedRoomAck,
    );

    socket.on(
      "room_state",
      handleRoomState,
    );

    socket.on(
      "get_room_ack",
      handleGetRoomAck,
    );

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
  "new_question_displayed",
  (payload) => {
    console.log(
      "🚨🚨🚨 NEW QUESTION EVENT ACTUALLY RECEIVED 🚨🚨🚨",
      payload,
    );

    handleNewQuestionDisplayed(payload);
  },
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
      console.log(
        "[Quiz Socket] Socket already connected. Joining room...",
      );

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
        handleJoinedRoomAck,
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
    handleNewQuestionDisplayed,
    handleQuestionDisplayed,
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


