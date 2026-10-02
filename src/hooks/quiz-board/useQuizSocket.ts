
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Socket } from "socket.io-client";

import { getQuizSocket } from "@/lib/socket/quizSocket";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import type { HostParticipant } from "@/components/quiz-board/host/HostParticipantPanel";

import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";

import type { HostQuestionPreviewQuestion } from "@/components/quiz-board/host/HostQuestionPreview";

import { useQuizSocketActions } from "./useQuizSocketActions";

import type {
  LiveQuestion,
  QuizFeedEvent,
  QuizRoomDocument,
  UseQuizSocketOptions,
  UseQuizSocketResult,
} from "./quizSocketTypes";

import {
  appendFeedEvent,
  makeFeedEvent,
  normalizeQuestion,
} from "./quizSocketUtils";

import {
  extractQuestion,
  extractQuestionNumber,
} from "./quizSocketQuestion";

import {
  createQuizSocketHandlers,
  type QuizSocketHandlerContext,
} from "./useQuizSocketHandlers";

import { useQuizSocketConnection } from "./useQuizSocketConnection";

/* ================================================================
   RE-EXPORT TYPES
================================================================ */

export type {
  LiveQuestion,
  QuizFeedEvent,
  QuizRoomDocument,
  UseQuizSocketOptions,
  UseQuizSocketResult,
} from "./quizSocketTypes";

/* ================================================================
   HOOK
================================================================ */

export function useQuizSocket(
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

  /* ==============================================================
     INITIAL VALUES
  ============================================================== */

  const resolvedInitialRound =
    typeof currentRound === "number" &&
    Number.isFinite(currentRound)
      ? currentRound
      : typeof initialRound === "number" &&
          Number.isFinite(initialRound)
        ? initialRound
        : 0;

  const resolvedInitialTimeLimit =
    typeof initialTimeLimit === "number" &&
    Number.isFinite(initialTimeLimit) &&
    initialTimeLimit > 0
      ? initialTimeLimit
      : 30;

  /* ==============================================================
     SOCKET STATE
  ============================================================== */

  const [connected, setConnected] =
    useState(false);

  const [roomJoined, setRoomJoined] =
    useState(false);

  const [roomActivated, setRoomActivated] =
    useState(false);

  const [roomDoc, setRoomDoc] =
    useState<QuizRoomDocument | null>(null);

  const [
    socketCurrentRound,
    setSocketCurrentRound,
  ] = useState(
    resolvedInitialRound,
  );

  const [question, setQuestion] =
    useState<LiveQuestion | null>(null);

  const [
    currentQuestionNumber,
    setCurrentQuestionNumber,
  ] = useState<number | null>(null);

  const [questionStarted, setQuestionStarted] =
    useState(false);

  const [questionLocked, setQuestionLocked] =
    useState(false);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [answerSubmitted, setAnswerSubmitted] =
    useState(false);

  const [submittingAnswer, setSubmittingAnswer] =
    useState(false);

  const [participants, setParticipants] =
    useState<HostParticipant[]>([]);

  const [leaderboard, setLeaderboard] =
    useState<HostLeaderboardEntry[]>([]);

  const [feedEvents, setFeedEvents] =
    useState<QuizFeedEvent[]>([]);

  const [socketError, setSocketError] =
    useState<string | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [timeLimit, setTimeLimit] =
    useState(resolvedInitialTimeLimit);

  /* ==============================================================
     REFS
  ============================================================== */

  const socketRef =
    useRef<Socket | null>(null);

  const disposedRef =
    useRef(false);

  const quizIdRef =
    useRef(quizId);

  const roomIdRef =
    useRef(roomId);

  const roleRef =
    useRef<QuizGameRole | null>(role);

  const currentRoundRef =
    useRef(resolvedInitialRound);

  const selectedQuestionRef =
    useRef<
      HostQuestionPreviewQuestion |
        null |
        undefined
    >(selectedQuestion);

  const timeLimitRef =
    useRef(resolvedInitialTimeLimit);

  const questionRef =
    useRef<LiveQuestion | null>(null);

  const onRoundChangedRef =
    useRef(onRoundChanged);

  /* ==============================================================
     PROP → REF SYNCHRONIZATION
  ============================================================== */

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
      typeof currentRound !== "number" &&
      typeof initialRound === "number" &&
      Number.isFinite(initialRound)
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

  /* ==============================================================
     FEED EVENT
  ============================================================== */

  const addFeedEvent = useCallback(
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

  /* ==============================================================
     ROUND UPDATE
  ============================================================== */

  const updateRound = useCallback(
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

  /* ==============================================================
     QUESTION APPLICATION
  ============================================================== */

  const applyQuestion = useCallback(
    (
      payload: unknown,
      source: string,
      markStarted = true,
    ): boolean => {
      if (disposedRef.current) {
        return false;
      }

      /* ----------------------------------------------------------
         EXTRACT RAW QUESTION
      ---------------------------------------------------------- */

      const rawQuestion =
        extractQuestion(payload);

      /* ----------------------------------------------------------
         EXTRACT QUESTION NUMBER
      ---------------------------------------------------------- */

      const payloadQuestionNumber =
        extractQuestionNumber(
          payload,
        );

      /* ----------------------------------------------------------
         NORMALIZE QUESTION
      ---------------------------------------------------------- */

      const normalizedQuestion =
        rawQuestion
          ? normalizeQuestion(
              rawQuestion,
            )
          : null;

      /* ----------------------------------------------------------
         DEBUG
      ---------------------------------------------------------- */

      console.log(
        `[QuizSocket] ${source} raw question:`,
        rawQuestion,
      );

      console.log(
        `[QuizSocket] ${source} normalized question:`,
        normalizedQuestion,
      );

      /* ----------------------------------------------------------
         QUESTION NUMBER ONLY

         Some room-state events may contain question metadata
         without the complete question object.
      ---------------------------------------------------------- */

      if (
        !normalizedQuestion &&
        payloadQuestionNumber == null
      ) {
        console.warn(
          `[QuizSocket] ${source}: no playable question found`,
        );

        return false;
      }

      /* ----------------------------------------------------------
         APPLY FULL QUESTION
      ---------------------------------------------------------- */

      if (normalizedQuestion) {
        let effectiveTimeLimit =
          normalizedQuestion.timeLimit;

        if (
          !effectiveTimeLimit ||
          effectiveTimeLimit <= 0
        ) {
          effectiveTimeLimit =
            timeLimitRef.current;
        }

        const effectiveStartedAt =
          normalizedQuestion.startedAt;

        let effectiveExpiresAt =
          normalizedQuestion.expiresAt;

        /* --------------------------------------------------------
           Calculate expiry when the backend supplies a start time
           but does not explicitly provide an expiry time.
        -------------------------------------------------------- */

        if (
          !effectiveExpiresAt &&
          effectiveStartedAt &&
          effectiveTimeLimit > 0
        ) {
          const startedAtMs =
            new Date(
              effectiveStartedAt,
            ).getTime();

          if (
            Number.isFinite(
              startedAtMs,
            )
          ) {
            effectiveExpiresAt =
              new Date(
                startedAtMs +
                  effectiveTimeLimit *
                    1000,
              ).toISOString();
          }
        }

        /* --------------------------------------------------------
           Rebuild normalized question with effective timing.
        -------------------------------------------------------- */

        const questionToApply: LiveQuestion =
          {
            ...normalizedQuestion,

            timeLimit:
              effectiveTimeLimit > 0
                ? effectiveTimeLimit
                : null,

            startedAt:
              effectiveStartedAt ??
              null,

            expiresAt:
              effectiveExpiresAt ??
              null,
          };

        /* --------------------------------------------------------
           Store question
        -------------------------------------------------------- */

        questionRef.current =
          questionToApply;

        setQuestion(
          questionToApply,
        );

        /* --------------------------------------------------------
           Question number from normalized question
        -------------------------------------------------------- */

        if (
          typeof questionToApply.questionNumber ===
            "number" &&
          Number.isFinite(
            questionToApply.questionNumber,
          )
        ) {
          setCurrentQuestionNumber(
            questionToApply.questionNumber,
          );
        }

        /* --------------------------------------------------------
           Explicit payload question number takes precedence.
        -------------------------------------------------------- */

        if (
          payloadQuestionNumber != null
        ) {
          setCurrentQuestionNumber(
            payloadQuestionNumber,
          );
        }

        /* --------------------------------------------------------
           Time limit
        -------------------------------------------------------- */

        if (
          typeof questionToApply.timeLimit ===
            "number" &&
          Number.isFinite(
            questionToApply.timeLimit,
          ) &&
          questionToApply.timeLimit > 0
        ) {
          timeLimitRef.current =
            questionToApply.timeLimit;

          setTimeLimit(
            questionToApply.timeLimit,
          );
        }

        /* --------------------------------------------------------
           Reset answer state for the new question.

           This is important for contestant play:

           new question
              ↓
           selected answer = null
              ↓
           answer submitted = false
              ↓
           question unlocked
        -------------------------------------------------------- */

        setQuestionStarted(
          markStarted,
        );

        setQuestionLocked(false);

        setSelectedAnswer(null);

        setAnswerSubmitted(false);

        setSubmittingAnswer(false);

        return true;
      }

      /* ==========================================================
         METADATA-ONLY QUESTION EVENT
      ========================================================== */

      if (
        payloadQuestionNumber != null
      ) {
        setCurrentQuestionNumber(
          payloadQuestionNumber,
        );

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

  /* ==============================================================
     HANDLER CONTEXT
  ============================================================== */

  const handlerContext: QuizSocketHandlerContext =
    {
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
    };

  /* ==============================================================
     SOCKET EVENT HANDLERS
  ============================================================== */

  const handlers =
    createQuizSocketHandlers(
      handlerContext,
    );

  /* ==============================================================
     SOCKET CONNECTION
  ============================================================== */

  useQuizSocketConnection({
    quizId,
    roomId,
    role,

    handlers,

    handlerContext,

    socketRef,
    disposedRef,

    setConnected,
    setRoomJoined,
    setSocketError,
  });

  /* ==============================================================
     ACTIONS
  ============================================================== */

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

  /* ==============================================================
     RESET WHEN ROOM CONTEXT IS INVALID
  ============================================================== */

  useEffect(() => {
    if (
      quizId &&
      roomId &&
      role
    ) {
      disposedRef.current = false;
      return;
    }

    setConnected(false);

    setRoomJoined(false);

    setRoomActivated(false);

    setQuestion(null);

    setCurrentQuestionNumber(null);

    setQuestionStarted(false);

    setQuestionLocked(false);

    setSelectedAnswer(null);

    setAnswerSubmitted(false);

    setSubmittingAnswer(false);

    setParticipants([]);

    setLeaderboard([]);

    questionRef.current = null;
  }, [
    quizId,
    roomId,
    role,
  ]);

  /* ==============================================================
     RETURN PUBLIC API
  ============================================================== */

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





















// // C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\useQuizSocket.ts

// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import type { Socket } from "socket.io-client";

// import {
//   getQuizSocket,
// } from "@/lib/socket/quizSocket";

// import type {
//   QuizGameRole,
// } from "@/types/quiz-board/quiz-role";

// import type {
//   HostParticipant,
// } from "@/components/quiz-board/host/HostParticipantPanel";

// import type {
//   HostLeaderboardEntry,
// } from "@/components/quiz-board/host/HostLeaderboardPanel";

// import type {
//   HostQuestionPreviewQuestion,
// } from "@/components/quiz-board/host/HostQuestionPreview";

// import {
//   useQuizSocketActions,
// } from "./useQuizSocketActions";

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
//   makeFeedEvent,
//   normalizeQuestion,
//   normalizeStatus,
//   unwrapPayload,
// } from "./quizSocketUtils";

// export type {
//   LiveQuestion,
//   QuizFeedEvent,
//   QuizRoomDocument,
//   UseQuizSocketOptions,
//   UseQuizSocketResult,
// } from "./quizSocketTypes";

// /* ============================================================
//  * HELPERS
//  * ========================================================== */

// function isObject(
//   value: unknown,
// ): value is SocketPayload {
//   return (
//     value !== null &&
//     typeof value === "object" &&
//     !Array.isArray(value)
//   );
// }

// function extractParticipants(
//   data: SocketPayload,
// ): unknown[] {
//   const candidates = [
//     data.participants,
//     data.participantList,
//     data.participant_list,
//     data.users,
//     data.players,
//   ];

//   for (const candidate of candidates) {
//     if (Array.isArray(candidate)) {
//       return candidate;
//     }
//   }

//   return [];
// }

// function extractLeaderboard(
//   data: SocketPayload,
// ): unknown[] {
//   const candidates = [
//     data.leaderboard,
//     data.entries,
//     data.leaderboardEntries,
//     data.leaderboard_entries,
//     data.rankings,
//   ];

//   for (const candidate of candidates) {
//     if (Array.isArray(candidate)) {
//       return candidate;
//     }
//   }

//   return [];
// }


// /* ============================================================
//  * QUESTION EXTRACTION
//  * ========================================================== */

// /**
//  * Generic object type used for safely inspecting unknown
//  * Socket.IO payloads.
//  *
//  * IMPORTANT:
//  * Do NOT use `value is SocketPayload` here.
//  *
//  * The backend sends several different payload shapes and
//  * TypeScript can incorrectly narrow those branches to `never`
//  * when SocketPayload is used as the type predicate.
//  */
// type UnknownObject = Record<string, unknown>;

// /**
//  * Safely determines whether a value is a plain object.
//  */
// function isRecord(
//   value: unknown,
// ): value is UnknownObject {
//   return (
//     value !== null &&
//     typeof value === "object" &&
//     !Array.isArray(value)
//   );
// }

// /**
//  * Determines whether an object looks like a quiz question.
//  *
//  * Current backend payload:
//  *
//  * {
//  *   quizId: "...",
//  *   id: "...",
//  *   question: "The classification...",
//  *   options: [
//  *     { label: "A", value: "Taxonomy" },
//  *     ...
//  *   ],
//  *   startTime: "...",
//  *   questionNumber: 1
//  * }
//  *
//  * IMPORTANT:
//  * This returns `boolean`, NOT a TypeScript type predicate.
//  *
//  * That prevents the `never` errors you were getting.
//  */
// function isQuestionObject(
//   value: unknown,
// ): boolean {
//   if (!isRecord(value)) {
//     return false;
//   }

//   if (!Array.isArray(value.options)) {
//     return false;
//   }

//   return (
//     typeof value.question === "string" ||
//     typeof value.content === "string" ||
//     typeof value.text === "string"
//   );
// }

// /**
//  * Extract a question from all supported server payload shapes.
//  *
//  * IMPORTANT:
//  *
//  * We MUST inspect the original payload BEFORE calling
//  * unwrapPayload().
//  *
//  * The current backend sends the question directly:
//  *
//  * {
//  *   quizId,
//  *   id,
//  *   question: "question text",
//  *   options: [...],
//  *   startTime,
//  *   questionNumber
//  * }
//  *
//  * unwrapPayload() can interpret `question` as a wrapper and
//  * return the question text.
//  *
//  * Therefore:
//  *
//  *     ORIGINAL PAYLOAD
//  *           ↓
//  *     question object?
//  *           ↓
//  *     YES → return it
//  *           ↓
//  *     NO
//  *           ↓
//  *     inspect wrappers
//  *           ↓
//  *     unwrapPayload()
//  */
// function extractQuestion(
//   payload: SocketPayload,
// ): unknown {
//   /*
//    * ----------------------------------------------------------
//    * 1. CHECK THE ORIGINAL PAYLOAD FIRST
//    * ----------------------------------------------------------
//    *
//    * This is the most important part.
//    *
//    * The actual backend event currently looks like:
//    *
//    * {
//    *   quizId: "...",
//    *   id: "...",
//    *   question: "...",
//    *   options: [...],
//    *   startTime: "...",
//    *   questionNumber: 1
//    * }
//    */
//   if (isQuestionObject(payload)) {
//     console.log(
//       "[Quiz Socket] extractQuestion() - DIRECT QUESTION OBJECT FOUND",
//     );

//     return payload;
//   }

//   /*
//    * ----------------------------------------------------------
//    * 2. INSPECT COMMON WRAPPER SHAPES
//    * ----------------------------------------------------------
//    */
//   if (isRecord(payload)) {
//     /*
//      * Possible:
//      *
//      * {
//      *   currentQuestion: {...}
//      * }
//      */
//     const directCandidates: unknown[] = [
//       payload.currentQuestion,
//       payload.current_question,
//       payload.activeQuestion,
//       payload.active_question,
//       payload.questionData,
//       payload.question_data,
//     ];

//     for (const candidate of directCandidates) {
//       if (isQuestionObject(candidate)) {
//         console.log(
//           "[Quiz Socket] extractQuestion() - NESTED QUESTION OBJECT FOUND",
//         );

//         return candidate;
//       }
//     }

//     /*
//      * --------------------------------------------------------
//      * data wrapper
//      * --------------------------------------------------------
//      *
//      * {
//      *   data: {
//      *     question: {...}
//      *   }
//      * }
//      */
//     const nestedData = payload.data;

//     /*
//      * data itself may be the question:
//      *
//      * {
//      *   data: {
//      *     id: "...",
//      *     question: "...",
//      *     options: [...]
//      *   }
//      * }
//      */
//     if (isQuestionObject(nestedData)) {
//       console.log(
//         "[Quiz Socket] extractQuestion() - DATA QUESTION OBJECT FOUND",
//       );

//       return nestedData;
//     }

//     if (isRecord(nestedData)) {
//       const nestedCandidates: unknown[] = [
//         nestedData.question,
//         nestedData.currentQuestion,
//         nestedData.current_question,
//         nestedData.activeQuestion,
//         nestedData.active_question,
//         nestedData.questionData,
//         nestedData.question_data,
//       ];

//       for (const candidate of nestedCandidates) {
//         if (isQuestionObject(candidate)) {
//           console.log(
//             "[Quiz Socket] extractQuestion() - NESTED DATA QUESTION OBJECT FOUND",
//           );

//           return candidate;
//         }
//       }
//     }

//     /*
//      * --------------------------------------------------------
//      * result wrapper
//      * --------------------------------------------------------
//      *
//      * {
//      *   result: {
//      *     question: {...}
//      *   }
//      * }
//      */
//     const result = payload.result;

//     if (isQuestionObject(result)) {
//       console.log(
//         "[Quiz Socket] extractQuestion() - RESULT QUESTION OBJECT FOUND",
//       );

//       return result;
//     }

//     if (isRecord(result)) {
//       const resultQuestion = result.question;

//       if (isQuestionObject(resultQuestion)) {
//         console.log(
//           "[Quiz Socket] extractQuestion() - RESULT.NESTED QUESTION OBJECT FOUND",
//         );

//         return resultQuestion;
//       }
//     }
//   }

//   /*
//    * ----------------------------------------------------------
//    * 3. ONLY NOW USE unwrapPayload()
//    * ----------------------------------------------------------
//    *
//    * This is retained for older backend payload formats.
//    */
//   const unwrapped = unwrapPayload(payload);

//   /*
//    * The unwrapped value itself may be the question.
//    */
//   if (isQuestionObject(unwrapped)) {
//     console.log(
//       "[Quiz Socket] extractQuestion() - UNWRAPPED QUESTION OBJECT FOUND",
//     );

//     return unwrapped;
//   }

//   /*
//    * The unwrapped value may contain the question.
//    */
//   if (isRecord(unwrapped)) {
//     /*
//      * {
//      *   question: {...}
//      * }
//      */
//     const nestedQuestion = unwrapped.question;

//     if (isQuestionObject(nestedQuestion)) {
//       console.log(
//         "[Quiz Socket] extractQuestion() - UNWRAPPED NESTED QUESTION OBJECT FOUND",
//       );

//       return nestedQuestion;
//     }

//     /*
//      * Other possible aliases.
//      */
//     const candidates: unknown[] = [
//       unwrapped.currentQuestion,
//       unwrapped.current_question,
//       unwrapped.activeQuestion,
//       unwrapped.active_question,
//       unwrapped.questionData,
//       unwrapped.question_data,
//     ];

//     for (const candidate of candidates) {
//       if (isQuestionObject(candidate)) {
//         console.log(
//           "[Quiz Socket] extractQuestion() - UNWRAPPED ALIAS QUESTION OBJECT FOUND",
//         );

//         return candidate;
//       }
//     }

//     /*
//      * Some older responses may contain:
//      *
//      * {
//      *   data: {
//      *     question: {...}
//      *   }
//      * }
//      */
//     const unwrappedData = unwrapped.data;

//     if (isQuestionObject(unwrappedData)) {
//       console.log(
//         "[Quiz Socket] extractQuestion() - UNWRAPPED DATA QUESTION OBJECT FOUND",
//       );

//       return unwrappedData;
//     }

//     if (isRecord(unwrappedData)) {
//       const dataQuestion = unwrappedData.question;

//       if (isQuestionObject(dataQuestion)) {
//         console.log(
//           "[Quiz Socket] extractQuestion() - UNWRAPPED DATA.NESTED QUESTION OBJECT FOUND",
//         );

//         return dataQuestion;
//       }
//     }

//     /*
//      * Older result wrapper.
//      */
//     const unwrappedResult = unwrapped.result;

//     if (isQuestionObject(unwrappedResult)) {
//       console.log(
//         "[Quiz Socket] extractQuestion() - UNWRAPPED RESULT QUESTION OBJECT FOUND",
//       );

//       return unwrappedResult;
//     }

//     if (isRecord(unwrappedResult)) {
//       const resultQuestion = unwrappedResult.question;

//       if (isQuestionObject(resultQuestion)) {
//         console.log(
//           "[Quiz Socket] extractQuestion() - UNWRAPPED RESULT.NESTED QUESTION OBJECT FOUND",
//         );

//         return resultQuestion;
//       }
//     }
//   }

//   /*
//    * ----------------------------------------------------------
//    * 4. NOTHING FOUND
//    * ----------------------------------------------------------
//    */
//   console.warn(
//     "[Quiz Socket] extractQuestion() - NO QUESTION OBJECT FOUND",
//     {
//       payload,
//       unwrapped,
//     },
//   );

//   return undefined;
// }











// /**
//  * Extract the question number from all supported payload shapes.
//  */
// function extractQuestionNumber(
//   payload: SocketPayload,
// ): number | null {
//   /*
//    * Do not rely exclusively on unwrapPayload().
//    *
//    * The backend's current payload contains questionNumber
//    * directly on the question object.
//    */
//   if (
//     isObject(payload)
//   ) {
//     const directNumber =
//       getNumber(
//         payload.questionNumber ??
//           payload.question_number ??
//           payload.currentQuestionNumber ??
//           payload.current_question_number ??
//           payload.questionIndex ??
//           payload.question_index,
//         null,
//       );

//     if (
//       directNumber !== null
//     ) {
//       return directNumber;
//     }

//     if (
//       isObject(payload.data)
//     ) {
//       const nestedNumber =
//         getNumber(
//           payload.data.questionNumber ??
//             payload.data.question_number ??
//             payload.data.currentQuestionNumber ??
//             payload.data.current_question_number ??
//             payload.data.questionIndex ??
//             payload.data.question_index,
//           null,
//         );

//       if (
//         nestedNumber !== null
//       ) {
//         return nestedNumber;
//       }
//     }
//   }

//   const data =
//     unwrapPayload(payload);

//   if (
//     isObject(data)
//   ) {
//     return getNumber(
//       data.questionNumber ??
//         data.question_number ??
//         data.currentQuestionNumber ??
//         data.current_question_number ??
//         data.questionIndex ??
//         data.question_index,
//       null,
//     );
//   }

//   return null;
// }




// /**
//  * Determine whether a question payload is actually playable.
//  */
// function hasPlayableQuestion(
//   question: LiveQuestion | null,
// ): boolean {
//   if (!question) {
//     return false;
//   }

//   return Boolean(
//     question.question ||
//       question.options,
//   );
// }

// /* ============================================================
//  * HOOK
//  * ========================================================== */

// export default function useQuizSocket(
//   options: UseQuizSocketOptions,
// ): UseQuizSocketResult {
//   const {
//     quizId,
//     roomId,
//     role,
//     currentRound,
//     initialRound,
//     onRoundChanged,
//     selectedQuestion,
//     timeLimit: initialTimeLimit,
//   } = options;

//   /* ==========================================================
//    * INITIAL VALUES
//    * ======================================================== */

//   const initialResolvedRound =
//     typeof currentRound === "number"
//       ? currentRound
//       : typeof initialRound === "number"
//         ? initialRound
//         : 0;

//   const initialResolvedTimeLimit =
//     initialTimeLimit ?? 30;

//   /* ==========================================================
//    * STATE
//    * ======================================================== */

//   const [
//     connected,
//     setConnected,
//   ] = useState(false);

//   const [
//     roomJoined,
//     setRoomJoined,
//   ] = useState(false);

//   const [
//     roomActivated,
//     setRoomActivated,
//   ] = useState(false);

//   const [
//     roomDoc,
//     setRoomDoc,
//   ] = useState<QuizRoomDocument | null>(
//     null,
//   );

//   const [
//     socketCurrentRound,
//     setSocketCurrentRound,
//   ] = useState<number>(
//     initialResolvedRound,
//   );

//   const [
//     question,
//     setQuestion,
//   ] = useState<LiveQuestion | null>(
//     null,
//   );

//   const [
//     currentQuestionNumber,
//     setCurrentQuestionNumber,
//   ] = useState<number | null>(
//     null,
//   );

//   const [
//     questionStarted,
//     setQuestionStarted,
//   ] = useState(false);

//   const [
//     questionLocked,
//     setQuestionLocked,
//   ] = useState(false);

//   const [
//     selectedAnswer,
//     setSelectedAnswer,
//   ] = useState<string | null>(
//     null,
//   );

//   const [
//     answerSubmitted,
//     setAnswerSubmitted,
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
//     timeLimit,
//     setTimeLimit,
//   ] = useState<number>(
//     initialResolvedTimeLimit,
//   );

//   /* ==========================================================
//    * REFS
//    * ======================================================== */

//   const socketRef =
//     useRef<Socket | null>(null);

//   const disposedRef =
//     useRef(false);

//   const quizIdRef =
//     useRef(quizId);

//   const roomIdRef =
//     useRef(roomId);

//   const roleRef =
//     useRef<QuizGameRole | null>(
//       role,
//     );

//   const currentRoundRef =
//     useRef<number>(
//       initialResolvedRound,
//     );

//   const selectedQuestionRef =
//     useRef<
//       HostQuestionPreviewQuestion |
//       null |
//       undefined
//     >(selectedQuestion);

//   const timeLimitRef =
//     useRef<number>(
//       initialResolvedTimeLimit,
//     );

//   const questionRef =
//     useRef<LiveQuestion | null>(
//       null,
//     );

//   const onRoundChangedRef =
//     useRef(onRoundChanged);

//   /* ==========================================================
//    * SYNC PROPS -> REFS
//    * ======================================================== */

//   useEffect(() => {
//     quizIdRef.current = quizId;
//   }, [quizId]);

//   useEffect(() => {
//     roomIdRef.current = roomId;
//   }, [roomId]);

//   useEffect(() => {
//     roleRef.current = role;
//   }, [role]);

//   useEffect(() => {
//     selectedQuestionRef.current =
//       selectedQuestion;
//   }, [selectedQuestion]);

//   useEffect(() => {
//     onRoundChangedRef.current =
//       onRoundChanged;
//   }, [onRoundChanged]);

//   useEffect(() => {
//     if (
//       typeof currentRound === "number" &&
//       Number.isFinite(currentRound)
//     ) {
//       currentRoundRef.current =
//         currentRound;

//       setSocketCurrentRound(
//         currentRound,
//       );
//     }
//   }, [currentRound]);

//   useEffect(() => {
//     if (
//       typeof initialRound === "number" &&
//       Number.isFinite(initialRound) &&
//       typeof currentRound !== "number"
//     ) {
//       currentRoundRef.current =
//         initialRound;

//       setSocketCurrentRound(
//         initialRound,
//       );
//     }
//   }, [
//     currentRound,
//     initialRound,
//   ]);

//   useEffect(() => {
//     if (
//       typeof initialTimeLimit === "number" &&
//       Number.isFinite(initialTimeLimit) &&
//       initialTimeLimit > 0
//     ) {
//       timeLimitRef.current =
//         initialTimeLimit;

//       setTimeLimit(
//         initialTimeLimit,
//       );
//     }
//   }, [initialTimeLimit]);

//   /* ==========================================================
//    * FEED EVENT
//    * ======================================================== */

//   const addFeedEvent =
//     useCallback(
//       (
//         type: string,
//         payload: unknown,
//         message?: string,
//       ) => {
//         const event =
//           makeFeedEvent(
//             type,
//             payload,
//             message,
//           );

//         setFeedEvents(
//           (current) =>
//             appendFeedEvent(
//               current,
//               event,
//             ),
//         );
//       },
//       [],
//     );

//   /* ==========================================================
//    * ROUND UPDATE
//    * ======================================================== */

//   const updateRound =
//     useCallback(
//       (roundNumber: number) => {
//         if (
//           !Number.isFinite(roundNumber) ||
//           roundNumber < 0
//         ) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] ROUND UPDATE:",
//           roundNumber,
//         );

//         currentRoundRef.current =
//           roundNumber;

//         setSocketCurrentRound(
//           roundNumber,
//         );

//         onRoundChangedRef.current?.(
//           roundNumber,
//         );
//       },
//       [],
//     );

//   /* ==========================================================
//    * APPLY QUESTION
//    * ======================================================== */

//   const applyQuestion =
//     useCallback(
//       (
//         payload: SocketPayload,
//         source: string,
//         markStarted = true,
//       ) => {
//         if (disposedRef.current) {
//           return false;
//         }

//         /*
//          * IMPORTANT:
//          *
//          * extractQuestion() intentionally receives the
//          * ORIGINAL payload. It must not receive the result
//          * of unwrapPayload().
//          */
//         const rawQuestion =
//           extractQuestion(
//             payload,
//           );

//         console.log(
//           `[Quiz Socket] ${source} - RAW QUESTION:`,
//           rawQuestion,
//         );

//         console.log(
//           `[Quiz Socket] ${source} - RAW QUESTION JSON:`,
//           rawQuestion
//             ? JSON.stringify(
//                 rawQuestion,
//                 null,
//                 2,
//               )
//             : null,
//         );

//         const normalizedQuestion =
//           normalizeQuestion(
//             rawQuestion,
//           );

//         console.log(
//           `[Quiz Socket] ${source} - NORMALIZED QUESTION:`,
//           normalizedQuestion,
//         );

//         const payloadQuestionNumber =
//           extractQuestionNumber(
//             payload,
//           );

//         if (
//           !normalizedQuestion &&
//           payloadQuestionNumber === null
//         ) {
//           console.warn(
//             `[Quiz Socket] ${source} - NO QUESTION FOUND`,
//           );

//           return false;
//         }

//         if (normalizedQuestion) {
//   /*
//    * The backend's new_question_displayed event currently
//    * contains startTime but may not contain timeLimit.
//    *
//    * Use the existing socket time limit as the fallback.
//    */
//   const effectiveTimeLimit =
//     normalizedQuestion.timeLimit !== null &&
//     normalizedQuestion.timeLimit > 0
//       ? normalizedQuestion.timeLimit
//       : timeLimitRef.current > 0
//         ? timeLimitRef.current
//         : null;

//   let questionWithTiming =
//     normalizedQuestion;

//   /*
//    * If the backend gave us startTime but no expiresAt,
//    * calculate the expiration locally.
//    */
//   if (
//     effectiveTimeLimit !== null &&
//     !normalizedQuestion.expiresAt &&
//     normalizedQuestion.startedAt
//   ) {
//     const startedTimestamp =
//       Date.parse(
//         normalizedQuestion.startedAt,
//       );

//     if (
//       !Number.isNaN(startedTimestamp)
//     ) {
//       questionWithTiming = {
//         ...normalizedQuestion,

//         timeLimit:
//           effectiveTimeLimit,

//         expiresAt:
//           new Date(
//             startedTimestamp +
//               effectiveTimeLimit * 1000,
//           ).toISOString(),
//       };
//     }
//   } else if (
//     effectiveTimeLimit !== null
//   ) {
//     questionWithTiming = {
//       ...normalizedQuestion,

//       timeLimit:
//         effectiveTimeLimit,
//     };
//   }

//   questionRef.current =
//     questionWithTiming;

//   setQuestion(
//     questionWithTiming,
//   );

//   console.log(
//     `[Quiz Socket] ${source} - FINAL QUESTION STATE:`,
//     questionWithTiming,
//   );

//   if (
//     questionWithTiming.questionNumber !==
//       null
//   ) {
//     setCurrentQuestionNumber(
//       questionWithTiming.questionNumber,
//     );
//   }

//   if (
//     questionWithTiming.timeLimit !==
//       null &&
//     questionWithTiming.timeLimit >
//       0
//   ) {
//     timeLimitRef.current =
//       questionWithTiming.timeLimit;

//     setTimeLimit(
//       questionWithTiming.timeLimit,
//     );
//   }
// }

//         if (
//           payloadQuestionNumber !== null
//         ) {
//           setCurrentQuestionNumber(
//             payloadQuestionNumber,
//           );
//         }

//         if (
//           normalizedQuestion &&
//           hasPlayableQuestion(
//             normalizedQuestion,
//           )
//         ) {
//           setQuestionStarted(
//             markStarted,
//           );

//           setQuestionLocked(false);
//           setSelectedAnswer(null);
//           setAnswerSubmitted(false);
//           setSubmittingAnswer(false);

//           console.log(
//             `[Quiz Socket] ${source} - QUESTION APPLIED SUCCESSFULLY`,
//           );

//           return true;
//         }


        

//         /*
//          * Metadata-only payload.
//          */
//         if (
//           isObject(payload) &&
//           payloadQuestionNumber !== null
//         ) {
//           setQuestionStarted(
//             markStarted,
//           );

//           setQuestionLocked(false);
//           setSelectedAnswer(null);
//           setAnswerSubmitted(false);
//           setSubmittingAnswer(false);

//           return true;
//         }

//         return false;
//       },
//       [],
//     );

//   /* ==========================================================
//    * ROOM STATE
//    * ======================================================== */

//   const handleRoomState =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] ROOM STATE:",
//           payload,
//         );

//         const data =
//           unwrapPayload(
//             payload,
//           );

//         if (!isObject(data)) {
//           return;
//         }

//         const status =
//           normalizeStatus(
//             data.status ??
//               data.roomStatus ??
//               data.room_status,
//           );

//         if (
//           status === "IN_PROGRESS"
//         ) {
//           setRoomActivated(true);
//         }

//         if (
//           status === "WAITING"
//         ) {
//           setRoomActivated(false);
//         }

//         const round =
//           getNumber(
//             data.currentRound ??
//               data.current_round ??
//               data.roundNumber ??
//               data.round_number,
//             null,
//           );

//         if (
//           round !== null
//         ) {
//           updateRound(round);
//         }

//         const rawQuestion =
//           extractQuestion(
//             payload,
//           );

//         if (
//           rawQuestion
//         ) {
//           applyQuestion(
//             payload,
//             "ROOM STATE",
//             true,
//           );
//         } else {
//           console.log(
//             "[Quiz Socket] ROOM STATE - NO ACTIVE QUESTION",
//           );
//         }

//         const participantList =
//           extractParticipants(
//             data,
//           );

//         if (
//           participantList.length > 0
//         ) {
//           setParticipants(
//             mapParticipants(
//               participantList,
//             ),
//           );
//         }

//         const leaderboardEntries =
//           extractLeaderboard(
//             data,
//           );

//         if (
//           leaderboardEntries.length > 0
//         ) {
//           setLeaderboard(
//             mapLeaderboard(
//               leaderboardEntries,
//             ),
//           );
//         }

//         addFeedEvent(
//           "room_state",
//           payload,
//         );
//       },
//       [
//         addFeedEvent,
//         applyQuestion,
//         updateRound,
//       ],
//     );

//   /* ==========================================================
//    * GET ROOM ACK
//    * ======================================================== */

//   const handleGetRoomAck =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "==================================================",
//         );

//         console.log(
//           "[Quiz Socket] 📥 GET ROOM ACK:",
//           payload,
//         );

//         console.log(
//           "[Quiz Socket] 📥 GET ROOM ACK JSON:",
//           JSON.stringify(
//             payload,
//             null,
//             2,
//           ),
//         );

//         const data =
//           unwrapPayload(
//             payload,
//           );

//         if (!isObject(data)) {
//           console.warn(
//             "[Quiz Socket] GET ROOM ACK - invalid room payload.",
//           );

//           return;
//         }

//         const resolvedRoomId =
//           getString(
//             data.roomId ??
//               data.room_id ??
//               roomIdRef.current,
//             null,
//           );

//         const resolvedQuizId =
//           getString(
//             data.quizId ??
//               data.quiz_id ??
//               quizIdRef.current,
//             null,
//           );

//         const resolvedStatus =
//           normalizeStatus(
//             data.status ??
//               data.roomStatus ??
//               data.room_status,
//           );

//         const resolvedRound =
//           getNumber(
//             data.currentRound ??
//               data.current_round ??
//               data.roundNumber ??
//               data.round_number,
//             null,
//           );

//         const resolvedQuestionNumber =
//           getNumber(
//             data.currentQuestionNumber ??
//               data.current_question_number ??
//               data.questionNumber ??
//               data.question_number,
//             null,
//           );

//         const participantList =
//           extractParticipants(
//             data,
//           );

//         const leaderboardEntries =
//           extractLeaderboard(
//             data,
//           );

//         const normalizedParticipants =
//           mapParticipants(
//             participantList,
//           );

//         const normalizedLeaderboard =
//           mapLeaderboard(
//             leaderboardEntries,
//           );

//         const normalizedRoomDoc:
//           QuizRoomDocument = {
//             ...data,

//             roomId:
//               resolvedRoomId,

//             quizId:
//               resolvedQuizId,

//             status:
//               resolvedStatus,

//             currentRound:
//               resolvedRound,

//             currentQuestionNumber:
//               resolvedQuestionNumber,

//             participants:
//               normalizedParticipants,

//             leaderboard:
//               normalizedLeaderboard,
//           };

//         setRoomDoc(
//           normalizedRoomDoc,
//         );

//         if (
//           resolvedStatus ===
//           "IN_PROGRESS"
//         ) {
//           setRoomActivated(
//             true,
//           );
//         }

//         if (
//           resolvedStatus ===
//           "WAITING"
//         ) {
//           setRoomActivated(
//             false,
//           );
//         }

//         if (
//           resolvedRound !== null &&
//           resolvedRound >= 0
//         ) {
//           updateRound(
//             resolvedRound,
//           );
//         }

//         if (
//           participantList.length > 0
//         ) {
//           setParticipants(
//             normalizedParticipants,
//           );
//         }

//         if (
//           leaderboardEntries.length > 0
//         ) {
//           setLeaderboard(
//             normalizedLeaderboard,
//           );
//         }

//         if (
//           resolvedQuestionNumber !==
//           null
//         ) {
//           setCurrentQuestionNumber(
//             resolvedQuestionNumber,
//           );
//         }

//         const rawQuestion =
//           extractQuestion(
//             payload,
//           );

//         console.log(
//           "[Quiz Socket] GET ROOM ACK - ACTIVE QUESTION:",
//           rawQuestion,
//         );

//         if (
//           rawQuestion
//         ) {
//           applyQuestion(
//             payload,
//             "GET ROOM ACK",
//             true,
//           );
//         } else {
//           console.log(
//             "[Quiz Socket] GET ROOM ACK - ACTIVE QUESTION: NONE",
//           );

//           if (
//             resolvedRound === 0 ||
//             resolvedQuestionNumber === null
//           ) {
//             questionRef.current =
//               null;

//             setQuestion(
//               null,
//             );

//             setCurrentQuestionNumber(
//               null,
//             );

//             setQuestionStarted(
//               false,
//             );
//           }
//         }

//         addFeedEvent(
//           "get_room_ack",
//           payload,
//         );

//         console.log(
//           "[Quiz Socket] GET ROOM ACK PROCESSED:",
//           {
//             roomId:
//               resolvedRoomId,

//             quizId:
//               resolvedQuizId,

//             status:
//               resolvedStatus,

//             round:
//               resolvedRound,

//             questionNumber:
//               resolvedQuestionNumber,

//             participants:
//               participantList.length,

//             leaderboard:
//               leaderboardEntries.length,

//             activeQuestion:
//               Boolean(rawQuestion),
//           },
//         );

//         console.log(
//           "==================================================",
//         );
//       },
//       [
//         addFeedEvent,
//         applyQuestion,
//         updateRound,
//       ],
//     );

//   /* ==========================================================
//    * CONNECT
//    * ======================================================== */

//   const handleConnect =
//     useCallback(() => {
//       if (disposedRef.current) {
//         return;
//       }

//       console.log(
//         "[Quiz Socket] CONNECTED",
//       );

//       setConnected(true);
//       setSocketError(null);

//       const socket =
//         socketRef.current;

//       if (
//         !socket ||
//         !quizIdRef.current ||
//         !roomIdRef.current ||
//         !roleRef.current
//       ) {
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
//         "[Quiz Socket] JOIN ROOM:",
//         payload,
//       );

//       socket.emit(
//         "join_room",
//         payload,
//       );
//     }, []);

//   /* ==========================================================
//    * DISCONNECT
//    * ======================================================== */

//   const handleDisconnect =
//     useCallback(
//       (reason?: string) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] DISCONNECTED:",
//           reason,
//         );

//         setConnected(false);
//         setRoomJoined(false);

//         setSocketError(
//           reason
//             ? `Socket disconnected: ${reason}`
//             : "Socket disconnected.",
//         );
//       },
//       [],
//     );

//   /* ==========================================================
//    * CONNECT ERROR
//    * ======================================================== */

//   const handleConnectError =
//     useCallback(
//       (error: Error) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.error(
//           "[Quiz Socket] CONNECT ERROR:",
//           error,
//         );

//         setConnected(false);

//         setSocketError(
//           error.message ||
//             "Unable to connect to quiz server.",
//         );
//       },
//       [],
//     );

//   /* ==========================================================
//    * JOINED ROOM ACK
//    * ======================================================== */

//   const handleJoinedRoomAck =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] JOINED ROOM ACK:",
//           payload,
//         );

//         setRoomJoined(true);
//         setSocketError(null);

//         addFeedEvent(
//           "joined_room_ack",
//           payload,
//           "Successfully joined the quiz room.",
//         );

//         if (
//           roleRef.current !== "HOST"
//         ) {
//           console.log(
//             "[Quiz Socket] Contestant joined room. Waiting for live game events.",
//           );

//           return;
//         }

//         const socket =
//           socketRef.current;

//         if (
//           !socket?.connected ||
//           !quizIdRef.current ||
//           !roomIdRef.current
//         ) {
//           console.log(
//             "[Quiz Socket] Cannot request get_room_doc:",
//             {
//               connected:
//                 socket?.connected ??
//                 false,

//               quizId:
//                 quizIdRef.current,

//               roomId:
//                 roomIdRef.current,
//             },
//           );

//           return;
//         }

//         const payloadToSend = {
//           quizId:
//             quizIdRef.current,

//           quiz_id:
//             quizIdRef.current,

//           roomId:
//             roomIdRef.current,

//           room_id:
//             roomIdRef.current,

//           roundNumber:
//             currentRoundRef.current,

//           round_number:
//             currentRoundRef.current,
//         };

//         console.log(
//           "[Quiz Socket] 📤 GET ROOM DOC REQUEST:",
//           payloadToSend,
//         );

//         socket.emit(
//           "get_room_doc",
//           payloadToSend,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * ROOM ACTIVATED
//    * ======================================================== */

//   const handleRoomActivated =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] ROOM ACTIVATED:",
//           payload,
//         );

//         setRoomActivated(true);
//         setSocketError(null);

//         addFeedEvent(
//           "room_activated",
//           payload,
//           "Quiz room activated.",
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * ROUND STARTED
//    * ======================================================== */

//   const handleRoundStarted =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] ROUND STARTED:",
//           payload,
//         );

//         const data =
//           unwrapPayload(
//             payload,
//           );

//         if (!isObject(data)) {
//           return;
//         }

//         const round =
//           getNumber(
//             data.currentRound ??
//               data.current_round ??
//               data.roundNumber ??
//               data.round_number,
//             null,
//           );

//         if (
//           round !== null &&
//           round >= 1
//         ) {
//           updateRound(
//             round,
//           );
//         }

//         setQuestionStarted(false);
//         setQuestionLocked(false);
//         setSelectedAnswer(null);
//         setAnswerSubmitted(false);
//         setSubmittingAnswer(false);

//         addFeedEvent(
//           "round_started",
//           payload,
//         );
//       },
//       [
//         addFeedEvent,
//         updateRound,
//       ],
//     );

//   /* ==========================================================
//    * QUESTION STARTED
//    * ======================================================== */

//   const handleQuestionStarted =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] QUESTION STARTED:",
//           payload,
//         );

//         applyQuestion(
//           payload,
//           "QUESTION STARTED",
//           true,
//         );

//         addFeedEvent(
//           "question_started",
//           payload,
//         );
//       },
//       [
//         addFeedEvent,
//         applyQuestion,
//       ],
//     );

//   /* ==========================================================
//    * NEW QUESTION
//    * ======================================================== */

//   const handleNewQuestion =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] NEW QUESTION:",
//           payload,
//         );

//         applyQuestion(
//           payload,
//           "NEW QUESTION",
//           true,
//         );

//         addFeedEvent(
//           "new_question",
//           payload,
//         );
//       },
//       [
//         addFeedEvent,
//         applyQuestion,
//       ],
//     );

 
 
//     /* ==========================================================
//    * NEW QUESTION DISPLAYED
//    * ======================================================== */

//   const handleNewQuestionDisplayed =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "==================================================",
//         );

//         console.log(
//           "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED:",
//           payload,
//         );

//         console.log(
//           "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED JSON:",
//           JSON.stringify(
//             payload,
//             null,
//             2,
//           ),
//         );

//         /*
//          * IMPORTANT:
//          *
//          * Do NOT do:
//          *
//          * const question = data.question;
//          *
//          * because `data.question` is the text.
//          *
//          * extractQuestion() now examines the original payload
//          * BEFORE unwrapPayload().
//          */
//         const rawQuestion =
//           extractQuestion(
//             payload,
//           );

//         console.log(
//           "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED - QUESTION OBJECT:",
//           rawQuestion,
//         );

//         console.log(
//           "[Quiz Socket] 🎯 NEW QUESTION DISPLAYED - QUESTION OBJECT JSON:",
//           rawQuestion
//             ? JSON.stringify(
//                 rawQuestion,
//                 null,
//                 2,
//               )
//             : null,
//         );

//         /*
//          * Round information must also be read without allowing
//          * unwrapPayload() to destroy the original question.
//          */
//         let round: number | null =
//           null;

//         if (
//           isObject(payload)
//         ) {
//           round =
//             getNumber(
//               payload.currentRound ??
//                 payload.current_round ??
//                 payload.roundNumber ??
//                 payload.round_number,
//               null,
//             );
//         }

//         if (
//           round === null
//         ) {
//           const data =
//             unwrapPayload(
//               payload,
//             );

//           if (
//             isObject(data)
//           ) {
//             round =
//               getNumber(
//                 data.currentRound ??
//                   data.current_round ??
//                   data.roundNumber ??
//                   data.round_number,
//                 null,
//               );
//           }
//         }

//         if (
//           round !== null &&
//           round >= 1
//         ) {
//           updateRound(
//             round,
//           );
//         }

//         const applied =
//           applyQuestion(
//             payload,
//             "NEW QUESTION DISPLAYED",
//             true,
//           );

//         if (
//           !applied
//         ) {
//           console.error(
//             "[Quiz Socket] ❌ NEW QUESTION DISPLAYED contained no usable question.",
//           );
//         } else {
//           console.log(
//             "[Quiz Socket] ✅ QUESTION STATE UPDATED SUCCESSFULLY",
//           );
//         }

//         addFeedEvent(
//           "new_question_displayed",
//           payload,
//         );

//         console.log(
//           "==================================================",
//         );
//       },
//       [
//         addFeedEvent,
//         applyQuestion,
//         updateRound,
//       ],
//     );

//   /* ==========================================================
//    * QUESTION DISPLAYED
//    * ======================================================== */

//   const handleQuestionDisplayed =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] QUESTION DISPLAYED:",
//           payload,
//         );

//         applyQuestion(
//           payload,
//           "QUESTION DISPLAYED",
//           true,
//         );

//         addFeedEvent(
//           "question_displayed",
//           payload,
//         );
//       },
//       [
//         addFeedEvent,
//         applyQuestion,
//       ],
//     );

//   /* ==========================================================
//    * NEXT QUESTION
//    * ======================================================== */

//   const handleNextQuestion =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] NEXT QUESTION:",
//           payload,
//         );

//         applyQuestion(
//           payload,
//           "NEXT QUESTION",
//           true,
//         );

//         addFeedEvent(
//           "next_question",
//           payload,
//         );
//       },
//       [
//         addFeedEvent,
//         applyQuestion,
//       ],
//     );

//   /* ==========================================================
//    * QUESTION LOCKED
//    * ======================================================== */

//   const handleQuestionLocked =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] QUESTION LOCKED:",
//           payload,
//         );

//         setQuestionLocked(true);

//         addFeedEvent(
//           "question_locked",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * PARTICIPANT JOINED
//    * ======================================================== */

//   const handleParticipantJoined =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] PARTICIPANT JOINED:",
//           payload,
//         );

//         const data =
//           unwrapPayload(
//             payload,
//           );

//         if (!isObject(data)) {
//           return;
//         }

//         const participant =
//           data.participant ??
//           data.user;

//         if (participant) {
//           setParticipants(
//             (current) => {
//               const mapped =
//                 mapParticipants([
//                   participant,
//                 ]);

//               if (
//                 mapped.length === 0
//               ) {
//                 return current;
//               }

//               const incoming =
//                 mapped[0];

//               const existingIndex =
//                 current.findIndex(
//                   (item) =>
//                     String(item.id) ===
//                     String(incoming.id),
//                 );

//               if (
//                 existingIndex === -1
//               ) {
//                 return [
//                   ...current,
//                   incoming,
//                 ];
//               }

//               const copy = [
//                 ...current,
//               ];

//               copy[
//                 existingIndex
//               ] = incoming;

//               return copy;
//             },
//           );
//         }

//         addFeedEvent(
//           "participant_joined_room",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * LEADERBOARD UPDATED
//    * ======================================================== */

//   const handleLeaderboardUpdated =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] LEADERBOARD UPDATED:",
//           payload,
//         );

//         const data =
//           unwrapPayload(
//             payload,
//           );

//         if (!isObject(data)) {
//           return;
//         }

//         const entries =
//           extractLeaderboard(
//             data,
//           );

//         if (
//           entries.length > 0
//         ) {
//           setLeaderboard(
//             mapLeaderboard(
//               entries,
//             ),
//           );
//         }

//         addFeedEvent(
//           "leaderboard_updated",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * PARTICIPANT SELECTED ANSWER
//    * ======================================================== */

//   const handleParticipantSelectedAnswer =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] PARTICIPANT SELECTED ANSWER:",
//           payload,
//         );

//         addFeedEvent(
//           "participant_selected_answer",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * PARTICIPANTS ELIMINATED
//    * ======================================================== */

//   const handleParticipantsEliminated =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] PARTICIPANTS ELIMINATED:",
//           payload,
//         );

//         const data =
//           unwrapPayload(
//             payload,
//           );

//         if (!isObject(data)) {
//           return;
//         }

//         const entries =
//           extractParticipants(
//             data,
//           );

//         if (
//           entries.length > 0
//         ) {
//           setParticipants(
//             mapParticipants(
//               entries,
//             ),
//           );
//         }

//         const leaderboardEntries =
//           extractLeaderboard(
//             data,
//           );

//         if (
//           leaderboardEntries.length > 0
//         ) {
//           setLeaderboard(
//             mapLeaderboard(
//               leaderboardEntries,
//             ),
//           );
//         }

//         addFeedEvent(
//           "participants_eliminated",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * ANSWER RESULT
//    * ======================================================== */

//   const handleAnswerResult =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] ANSWER RESULT:",
//           payload,
//         );

//         setSubmittingAnswer(false);

//         addFeedEvent(
//           "answer_result",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * FIRST CORRECT
//    * ======================================================== */

//   const handleFirstCorrect =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.log(
//           "[Quiz Socket] FIRST CORRECT:",
//           payload,
//         );

//         addFeedEvent(
//           "first_correct",
//           payload,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * SOCKET ERROR
//    * ======================================================== */

//   const handleSocketError =
//     useCallback(
//       (payload: SocketPayload) => {
//         if (disposedRef.current) {
//           return;
//         }

//         console.error(
//           "[Quiz Socket] SOCKET ERROR:",
//           payload,
//         );

//         const data =
//           unwrapPayload(
//             payload,
//           );

//         if (!isObject(data)) {
//           setSocketError(
//             "Quiz socket error.",
//           );

//           setActionLoading(false);
//           setSubmittingAnswer(false);

//           return;
//         }

//         const message =
//           getString(
//             data.message ??
//               data.error ??
//               data.errorMessage ??
//               data.error_message,
//             "Quiz socket error.",
//           ) ??
//           "Quiz socket error.";

//         setSocketError(
//           message,
//         );

//         setActionLoading(false);
//         setSubmittingAnswer(false);

//         addFeedEvent(
//           "socket_error",
//           payload,
//           message,
//         );
//       },
//       [addFeedEvent],
//     );

//   /* ==========================================================
//    * SOCKET EFFECT
//    * ======================================================== */

//   useEffect(() => {
//     disposedRef.current =
//       false;

//     if (
//       !quizId ||
//       !roomId ||
//       !role
//     ) {
//       setConnected(false);
//       setRoomJoined(false);

//       return;
//     }

//     const socket =
//       getQuizSocket();

//     socketRef.current =
//       socket;

//     /* --------------------------------------------------------
//      * REGISTER LISTENERS
//      * ------------------------------------------------------ */

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

//     socket.on(
//       "joined_room_ack",
//       handleJoinedRoomAck,
//     );

//     socket.on(
//       "room_state",
//       handleRoomState,
//     );

//     socket.on(
//       "get_room_ack",
//       handleGetRoomAck,
//     );

//     socket.on(
//       "get_room_doc",
//       handleGetRoomAck,
//     );

//     socket.on(
//       "room_activated",
//       handleRoomActivated,
//     );

//     socket.on(
//       "round_started",
//       handleRoundStarted,
//     );

//     socket.on(
//       "question_started",
//       handleQuestionStarted,
//     );

//     socket.on(
//       "new_question",
//       handleNewQuestion,
//     );

//     socket.on(
//   "new_question_displayed",
//   (payload) => {
//     console.log(
//       "🚨🚨🚨 NEW QUESTION EVENT ACTUALLY RECEIVED 🚨🚨🚨",
//       payload,
//     );

//     handleNewQuestionDisplayed(payload);
//   },
// );

//     socket.on(
//       "question_displayed",
//       handleQuestionDisplayed,
//     );

//     socket.on(
//       "question_locked",
//       handleQuestionLocked,
//     );

//     socket.on(
//       "next_question",
//       handleNextQuestion,
//     );

//     socket.on(
//       "participant_joined_room",
//       handleParticipantJoined,
//     );

//     socket.on(
//       "leaderboard_updated",
//       handleLeaderboardUpdated,
//     );

//     socket.on(
//       "participant_selected_answer",
//       handleParticipantSelectedAnswer,
//     );

//     socket.on(
//       "participants_eliminated",
//       handleParticipantsEliminated,
//     );

//     socket.on(
//       "answer_result",
//       handleAnswerResult,
//     );

//     socket.on(
//       "first_correct",
//       handleFirstCorrect,
//     );

//     socket.on(
//       "socket_error",
//       handleSocketError,
//     );

//     /* --------------------------------------------------------
//      * ALREADY CONNECTED
//      * ------------------------------------------------------ */

//     if (socket.connected) {
//       console.log(
//         "[Quiz Socket] Socket already connected. Joining room...",
//       );

//       setConnected(true);

//       handleConnect();
//     }

//     /* --------------------------------------------------------
//      * CLEANUP
//      * ------------------------------------------------------ */

//     return () => {
//       disposedRef.current =
//         true;

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

//       socket.off(
//         "joined_room_ack",
//         handleJoinedRoomAck,
//       );

//       socket.off(
//         "room_state",
//         handleRoomState,
//       );

//       socket.off(
//         "get_room_ack",
//         handleGetRoomAck,
//       );

//       socket.off(
//         "get_room_doc",
//         handleGetRoomAck,
//       );

//       socket.off(
//         "room_activated",
//         handleRoomActivated,
//       );

//       socket.off(
//         "round_started",
//         handleRoundStarted,
//       );

//       socket.off(
//         "question_started",
//         handleQuestionStarted,
//       );

//       socket.off(
//         "new_question",
//         handleNewQuestion,
//       );

//       socket.off(
//         "new_question_displayed",
//         handleNewQuestionDisplayed,
//       );

//       socket.off(
//         "question_displayed",
//         handleQuestionDisplayed,
//       );

//       socket.off(
//         "question_locked",
//         handleQuestionLocked,
//       );

//       socket.off(
//         "next_question",
//         handleNextQuestion,
//       );

//       socket.off(
//         "participant_joined_room",
//         handleParticipantJoined,
//       );

//       socket.off(
//         "leaderboard_updated",
//         handleLeaderboardUpdated,
//       );

//       socket.off(
//         "participant_selected_answer",
//         handleParticipantSelectedAnswer,
//       );

//       socket.off(
//         "participants_eliminated",
//         handleParticipantsEliminated,
//       );

//       socket.off(
//         "answer_result",
//         handleAnswerResult,
//       );

//       socket.off(
//         "first_correct",
//         handleFirstCorrect,
//       );

//       socket.off(
//         "socket_error",
//         handleSocketError,
//       );

//       if (
//         socketRef.current ===
//         socket
//       ) {
//         socketRef.current =
//           null;
//       }
//     };
//   }, [
//     quizId,
//     roomId,
//     role,

//     handleAnswerResult,
//     handleConnect,
//     handleConnectError,
//     handleDisconnect,
//     handleFirstCorrect,
//     handleJoinedRoomAck,
//     handleLeaderboardUpdated,
//     handleNewQuestion,
//     handleNewQuestionDisplayed,
//     handleQuestionDisplayed,
//     handleNextQuestion,
//     handleParticipantJoined,
//     handleParticipantSelectedAnswer,
//     handleParticipantsEliminated,
//     handleQuestionLocked,
//     handleQuestionStarted,
//     handleRoomActivated,
//     handleGetRoomAck,
//     handleRoomState,
//     handleRoundStarted,
//     handleSocketError,
//   ]);

//   /* ==========================================================
//    * ACTIONS
//    * ======================================================== */

//   const actions =
//     useQuizSocketActions({
//       quizId,

//       roomId:
//         roomId ?? "",

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

//   /* ==========================================================
//    * RETURN
//    * ======================================================== */

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

//     selectedAnswer,

//     answerSubmitted,

//     submittingAnswer,

//     participants,

//     leaderboard,

//     feedEvents,

//     socketError,

//     actionLoading,

//     timeLimit,

//     setTimeLimit,

//     setSelectedAnswer,

//     startQuestion:
//       actions.startQuestion,

//     lockQuestion:
//       actions.lockQuestion,

//     nextQuestion:
//       actions.nextQuestion,

//     submitAnswer:
//       actions.submitAnswer,

//     refreshSocketState:
//       actions.refreshSocketState,
//   };
// }


