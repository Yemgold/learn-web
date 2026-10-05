







"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Socket } from "socket.io-client";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import type { HostParticipant } from "@/components/quiz-board/host/HostParticipantPanel";

import type { HostLeaderboardEntry } from "@/components/quiz-board/host/HostLeaderboardPanel";

import type { HostQuestionPreviewQuestion } from "@/components/quiz-board/host/HostQuestionPreview";

import { useQuizSocketActions } from "./useQuizSocketActions";

import type {
  LiveQuestion,
  QuizFeedEvent,
  QuizAnswerResult,
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

  /*
   * Server-authoritative answer result.
   *
   * This is populated only after the backend responds
   * to submit_answer with answer_result.
   */
  const [answerResult, setAnswerResult] =
    useState<QuizAnswerResult | null>(null);

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

  /*
   * Keeps the selected answer synchronously available.
   *
   * This is separate from React state because a contestant
   * could theoretically click twice before React finishes
   * the next render.
   */
  const selectedAnswerRef =
    useRef<string | null>(null);

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
     KEEP SELECTED ANSWER REF IN SYNC
  ============================================================== */

  useEffect(() => {
    selectedAnswerRef.current =
      selectedAnswer;
  }, [selectedAnswer]);

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
        current =>
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
      console.log(
        "🔥🔥🔥 APPLY QUESTION CALLED 🔥🔥🔥",
        {
          source,
          markStarted,
          payload,
        },
      );

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
           TIMER NORMALIZATION CHECK
        -------------------------------------------------------- */

        console.log(
          "[QuizSocket] TIMER NORMALIZATION CHECK:",
          {
            questionId:
              questionToApply.id,

            timeLimit:
              questionToApply.timeLimit,

            startedAt:
              questionToApply.startedAt,

            expiresAt:
              questionToApply.expiresAt,

            browserNow:
              new Date().toISOString(),

            browserNowMs:
              Date.now(),

            startedAtMs:
              questionToApply.startedAt
                ? Date.parse(
                    questionToApply.startedAt,
                  )
                : null,

            expiresAtMs:
              questionToApply.expiresAt
                ? Date.parse(
                    questionToApply.expiresAt,
                  )
                : null,

            differenceToStartSeconds:
              questionToApply.startedAt
                ? Math.round(
                    (
                      Date.parse(
                        questionToApply.startedAt,
                      ) -
                      Date.now()
                    ) /
                      1000,
                  )
                : null,

            differenceToExpirySeconds:
              questionToApply.expiresAt
                ? Math.round(
                    (
                      Date.parse(
                        questionToApply.expiresAt,
                      ) -
                      Date.now()
                    ) /
                      1000,
                  )
                : null,
          },
        );

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

           new question
              ↓
           clear previous result
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

        /*
         * Clear the previous server result.
         */
        setAnswerResult(null);

        /*
         * IMPORTANT:
         *
         * Reset the synchronous ref first.
         * This allows the contestant to answer the
         * new question immediately.
         */
        selectedAnswerRef.current =
          null;

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

        setAnswerResult(null);

        selectedAnswerRef.current =
          null;

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
     CONTESTANT ANSWER SELECTION
  ============================================================== */

  const selectContestantAnswer =
    useCallback(
      (answer: string) => {
        const normalizedAnswer =
          String(
            answer ?? "",
          ).trim();

        /* --------------------------------------------------------
           Basic validation
        -------------------------------------------------------- */

        if (!normalizedAnswer) {
          return;
        }

        if (disposedRef.current) {
          return;
        }

        /* --------------------------------------------------------
           Contestant-only action
        -------------------------------------------------------- */

        if (
          roleRef.current !==
          "CONTESTANT"
        ) {
          console.warn(
            "[QuizSocket] selectContestantAnswer ignored: current role is not CONTESTANT.",
          );

          return;
        }

        /* --------------------------------------------------------
           Room validation
        -------------------------------------------------------- */

        if (!roomIdRef.current) {
          console.warn(
            "[QuizSocket] selectContestantAnswer ignored: roomId is missing.",
          );

          return;
        }

        /* --------------------------------------------------------
           Question validation
        -------------------------------------------------------- */

        const activeQuestion =
          questionRef.current;

        if (!activeQuestion) {
          console.warn(
            "[QuizSocket] selectContestantAnswer ignored: no active question.",
          );

          return;
        }

        console.log(
          "[QuizSocket] ANSWER TIMER CHECK:",
          {
            questionId:
              activeQuestion.id,

            startedAt:
              activeQuestion.startedAt,

            expiresAt:
              activeQuestion.expiresAt,

            browserNow:
              new Date().toISOString(),

            browserNowMs:
              Date.now(),

            startedAtMs:
              activeQuestion.startedAt
                ? Date.parse(
                    activeQuestion.startedAt,
                  )
                : null,

            expiresAtMs:
              activeQuestion.expiresAt
                ? Date.parse(
                    activeQuestion.expiresAt,
                  )
                : null,

            remainingMs:
              activeQuestion.expiresAt
                ? Date.parse(
                    activeQuestion.expiresAt,
                  ) -
                  Date.now()
                : null,
          },
        );

        /* --------------------------------------------------------
           Question must have started
        -------------------------------------------------------- */

        if (!questionStarted) {
          return;
        }

        /* --------------------------------------------------------
           Question already locked
        -------------------------------------------------------- */

        if (questionLocked) {
          return;
        }

        /* --------------------------------------------------------
           Prevent multiple selection
        -------------------------------------------------------- */

        if (
          selectedAnswerRef.current !==
          null
        ) {
          return;
        }

        /*
         * IMPORTANT:
         *
         * If a previous result somehow still exists,
         * do not allow another answer.
         */
        if (answerResult !== null) {
          return;
        }

        /* --------------------------------------------------------
           CRITICAL:
           Lock the contestant UI immediately.
        -------------------------------------------------------- */

        selectedAnswerRef.current =
          normalizedAnswer;

        setSelectedAnswer(
          normalizedAnswer,
        );

        /*
         * The request is now being sent to the server.
         */
        setSubmittingAnswer(true);

        /* --------------------------------------------------------
           Socket validation
        -------------------------------------------------------- */

        const socket =
          socketRef.current;

        if (
          !socket ||
          !socket.connected
        ) {
          setSubmittingAnswer(false);

          setSocketError(
            "Your connection to the quiz server is unavailable.",
          );

          /*
           * Allow the contestant to retry if the socket
           * was unavailable before the answer was emitted.
           */
          selectedAnswerRef.current =
            null;

          setSelectedAnswer(null);

          return;
        }

        /* --------------------------------------------------------
           Emit contestant answer.

           This is the working contestant flow:

             selectContestantAnswer()
                    ↓
             submit_answer
                    ↓
             backend validation
                    ↓
             answer_result
        -------------------------------------------------------- */

        console.log(
          "[QuizSocket] SENDING PARTICIPANT ANSWER:",
          {
            quizId:
              quizIdRef.current,

            roomId:
              roomIdRef.current,

            roundNumber:
              currentRoundRef.current,

            questionId:
              activeQuestion.id,

            questionNumber:
              activeQuestion.questionNumber ??
              currentQuestionNumber,

            answer:
              normalizedAnswer,

            role:
              roleRef.current,

            socketConnected:
              socket.connected,
          },
        );

        socket.emit(
          "submit_answer",
          {
            data: {
              roomId:
                roomIdRef.current,

              roundNumber:
                currentRoundRef.current,

              questionId:
                activeQuestion.id,

              selectedAnswerId:
                normalizedAnswer,
            },
          },
        );
      },
      [
        questionStarted,
        questionLocked,
        currentQuestionNumber,
        answerResult,
      ],
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

      /*
       * Server-authoritative answer result.
       */
      setAnswerResult,

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

    selectedAnswerRef.current =
      null;

    setSelectedAnswer(null);

    setAnswerSubmitted(false);

    setSubmittingAnswer(false);

    /*
     * Clear server answer result when the
     * room context becomes invalid.
     */
    setAnswerResult(null);

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

    /*
     * Server-authoritative answer result.
     *
     * Contains:
     *
     * isCorrect
     * isFirstCorrectAnswer
     * scoreAwarded
     * roundScore
     * totalScore
     * timeTakenInSeconds
     * message
     */
    answerResult,

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

    selectContestantAnswer,

    /*
     * Existing action remains untouched.
     *
     * This is reserved for the existing/future
     * spectator answer submission functionality.
     *
     * The current contestant flow uses:
     *
     * selectContestantAnswer()
     *        ↓
     * submit_answer
     *        ↓
     * answer_result
     */
    submitAnswer:
      actions.submitAnswer,

    refreshSocketState:
      actions.refreshSocketState,
  };
}


