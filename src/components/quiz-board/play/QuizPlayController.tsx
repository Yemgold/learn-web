





"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";

import { useRouter } from "next/navigation";

import { axiosInstance } from "@/lib/api/axios";

import {
  getQuizCurrentRound,
  getQuizId,
  getQuizNumberOfRounds,
  getQuizRoomId,
  getQuizTimePerQuestion,
  getQuizTitle,
  type Quiz,
} from "@/types/quiz-board/quiz";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import HostQuizShow from "@/components/quiz-board/host/HostQuizShow";

import type {
  HostQuestionListItem,
} from "@/components/quiz-board/host/HostQuestionList";

import type {
  HostQuestionPreviewQuestion,
} from "@/components/quiz-board/host/HostQuestionPreview";

import SpectatorQuizShow from "@/components/quiz-board/spectator/SpectatorQuizShow";

import ContestantQuizShow from "@/components/quiz-board/contestant/ContestantQuizShow";

import { useQuizSocket } from "@/hooks/quiz-board/useQuizSocket";



/* =========================================================
   PROPs
   ========================================================= */

export interface QuizPlayControllerProps {
  quizId: string;
  requestedRole?: string | null;
  requestedRoomId?: string | null;
}

/* =========================================================
   HELPERS
   ========================================================= */

function getNumber(
  value: unknown,
  fallback: number | null = null,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

/* =========================================================
   READ STORED USER
   ========================================================= */

function readStoredUser(): any {
  if (typeof window === "undefined") {
    return null;
  }

  const keys = [
    "user",
    "auth-user",
    "jamb_user",
    "jamb_auth_user",
  ];

  for (const key of keys) {
    try {
      const value =
        window.localStorage.getItem(key);

      if (value) {
        return JSON.parse(value);
      }
    } catch {
      // Ignore malformed localStorage.
    }
  }

  return null;
}

/* =========================================================
   APPLICATION ROLE
   ========================================================= */

function getApplicationRole(
  user: any,
): string {
  return String(
    user?.role ??
      user?.userRole ??
      user?.user_role ??
      user?.accountType ??
      user?.account_type ??
      "",
  ).toUpperCase();
}

/* =========================================================
   SOCKET ROLE
   ========================================================= */

function getSocketRole(
  user: any,
  requestedRole: string | null,
): QuizGameRole {
  const normalizedRequestedRole =
    requestedRole?.trim().toLowerCase();

  if (
    normalizedRequestedRole ===
    "spectator"
  ) {
    return "SPECTATOR";
  }

  if (
    normalizedRequestedRole ===
    "host"
  ) {
    return "HOST";
  }

  if (
    normalizedRequestedRole ===
    "contestant"
  ) {
    return "CONTESTANT";
  }

  const applicationRole =
    getApplicationRole(user);

  if (
    applicationRole === "ADMIN" ||
    applicationRole === "HOST"
  ) {
    return "HOST";
  }

  return "CONTESTANT";
}

/* =========================================================
   QUIZ PLAY CONTROLLER
   ========================================================= */

export default function QuizPlayController({
  quizId,
  requestedRole = null,
  requestedRoomId = null,
}: QuizPlayControllerProps) {
  const router = useRouter();

  /* =======================================================
     QUIZ STATE
  ======================================================= */

  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [role, setRole] =
    useState<QuizGameRole | null>(null);

  const [currentRound, setCurrentRound] =
    useState<number>(1);

  const [questions, setQuestions] =
    useState<HostQuestionListItem[]>([]);

  const [
    selectedQuestion,
    setSelectedQuestion,
  ] =
    useState<HostQuestionPreviewQuestion | null>(
      null,
    );

  const [questionLoading, setQuestionLoading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  /* =======================================================
     REFS
  ======================================================= */

  const selectedQuestionRef =
    useRef<HostQuestionPreviewQuestion | null>(
      null,
    );

  const currentRoundRef =
    useRef<number>(1);

  /*
   * Keep the latest valid live question outside React
   * state so a transient null state does not remove
   * the question from the contestant UI.
   */

  const liveQuestionRef =
    useRef<any>(null);

  /* =======================================================
     KEEP REFS SYNCHRONIZED
  ======================================================= */

  useEffect(() => {
    currentRoundRef.current =
      currentRound;
  }, [currentRound]);

  useEffect(() => {
    selectedQuestionRef.current =
      selectedQuestion;
  }, [selectedQuestion]);

  /* =======================================================
     SAFE QUIZ TIME LIMIT
  ======================================================= */

  const quizTimeLimit =
    useMemo(() => {
      if (!quiz) {
        return 30;
      }

      try {
        const value =
          getQuizTimePerQuestion(
            quiz,
          );

        const parsed =
          Number(value);

        if (
          Number.isFinite(parsed) &&
          parsed > 0
        ) {
          return parsed;
        }
      } catch (err) {
        console.warn(
          "[QuizPlayController] Unable to determine quiz time limit:",
          err,
        );
      }

      return 30;
    }, [quiz]);

  /* =======================================================
     ROOM ID
  ======================================================= */

  const roomId =
    useMemo(() => {
      const urlRoomId =
        requestedRoomId?.trim();

      if (urlRoomId) {
        return urlRoomId;
      }

      if (!quiz) {
        return null;
      }

      return getQuizRoomId(quiz);
    }, [
      requestedRoomId,
      quiz,
    ]);

  /* =======================================================
     LOAD QUIZ
  ======================================================= */

  const loadQuiz =
    useCallback(
      async () => {
        if (!quizId) {
          setError(
            "Missing quiz ID.",
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError(null);

          const response =
            await axiosInstance.get(
              `/quiz/get-quiz-by-quizId/${encodeURIComponent(
                quizId,
              )}`,
            );

          const rawQuiz =
            response?.data?.data ??
            response?.data?.quiz ??
            response?.data;

          if (!rawQuiz) {
            throw new Error(
              "Quiz competition could not be found.",
            );
          }

          let normalizedTimePerQuestion =
            30;

          try {
            const value =
              getQuizTimePerQuestion(
                rawQuiz,
              );

            const parsed =
              Number(value);

            if (
              Number.isFinite(parsed) &&
              parsed > 0
            ) {
              normalizedTimePerQuestion =
                parsed;
            }
          } catch (err) {
            console.warn(
              "[QuizPlayController] Unable to normalize quiz time:",
              err,
            );
          }

          const normalizedQuiz =
            {
              ...rawQuiz,

              id: getQuizId({
                id:
                  rawQuiz.id ??
                  rawQuiz._id ??
                  quizId,

                _id:
                  rawQuiz._id,
              }),

              title:
                rawQuiz.title ??
                rawQuiz.quiz_title ??
                "Quiz Competition",

              status:
                rawQuiz.status ??
                "WAITING",

              numberOfRounds:
                getQuizNumberOfRounds(
                  rawQuiz,
                ),

              timePerQuestion:
                normalizedTimePerQuestion,

              noOfContestants:
                rawQuiz.noOfContestants ??
                rawQuiz.no_of_contestants ??
                20,
            } as Quiz;

          setQuiz(
            normalizedQuiz,
          );

          const initialRound =
            Math.max(
              1,
              getQuizCurrentRound(
                normalizedQuiz,
              ) || 1,
            );

          setCurrentRound(
            initialRound,
          );

          currentRoundRef.current =
            initialRound;
        } catch (err: any) {
          console.error(
            "[QuizPlayController] Failed to load quiz:",
            err,
          );

          setError(
            err?.response?.data
              ?.message ??
              err?.message ??
              "Unable to load competition.",
          );
        } finally {
          setLoading(false);
        }
      },
      [quizId],
    );

  /* =======================================================
     INITIAL QUIZ LOAD
  ======================================================= */

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  /* =======================================================
     DETERMINE ROLE
  ======================================================= */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const user =
      readStoredUser();

    const resolvedRole =
      getSocketRole(
        user,
        requestedRole,
      );

    console.log(
      "[QuizPlayController] ROLE RESOLVED",
      {
        requestedRole,
        resolvedRole,
        userRole:
          getApplicationRole(user),
      },
    );

    setRole(
      resolvedRole,
    );
  }, [
    requestedRole,
  ]);

  /* =======================================================
     LOAD HOST ROUND QUESTIONS
  ======================================================= */

  const loadRoundQuestions =
    useCallback(
      async (
        roundNumber: number,
      ) => {
        if (
          !quizId ||
          role !== "HOST"
        ) {
          return;
        }

        try {
          setQuestionLoading(
            true,
          );

          const response =
            await axiosInstance.get(
              `/quiz/get-round-questions/${encodeURIComponent(
                quizId,
              )}`,
              {
                params: {
                  roundNumber,
                },
              },
            );

          const payload =
            response?.data?.data ??
            response?.data;

          let rawQuestions: any[] =
            [];

          if (
            Array.isArray(
              payload,
            )
          ) {
            rawQuestions =
              payload;
          } else if (
            payload &&
            typeof payload ===
              "object"
          ) {
            rawQuestions =
              payload.questions ??
              payload.questionObj ??
              payload.roundQuestions ??
              [];
          }

          const normalized: HostQuestionListItem[] =
            Array.isArray(
              rawQuestions,
            )
              ? rawQuestions.map(
                  (
                    item: any,
                    index: number,
                  ) => {
                    const questionNumber =
                      getNumber(
                        item?.questionNumber ??
                          item?.question_number ??
                          item?.number,
                        index + 1,
                      ) ??
                      index + 1;

                    const itemTimeLimit =
                      getNumber(
                        item?.timeLimit ??
                          item?.time_limit ??
                          item?.duration,
                        null,
                      );

                    const options =
                      Array.isArray(
                        item?.options,
                      )
                        ? item.options
                        : [];

                    return {
                      id: String(
                        item?.id ??
                          item?._id ??
                          `question-${index + 1}`,
                      ),

                      questionNumber,

                      question:
                        item?.question ??
                        item?.questionText ??
                        item?.question_text ??
                        "",

                      options,

                      timeLimit:
                        itemTimeLimit ??
                        quizTimeLimit,

                      status:
                        item?.status ??
                        "READY",

                      answeredCount:
                        getNumber(
                          item?.answeredCount ??
                            item?.answered_count,
                          0,
                        ) ?? 0,

                      correctCount:
                        getNumber(
                          item?.correctCount ??
                            item?.correct_count,
                          0,
                        ) ?? 0,
                    };
                  },
                )
              : [];

          setQuestions(
            normalized,
          );

          const existingNumber =
            selectedQuestionRef
              .current
              ?.questionNumber;

          const selected =
            normalized.find(
              (item) =>
                item.questionNumber ===
                existingNumber,
            ) ??
            normalized[0] ??
            null;

          if (!selected) {
            setSelectedQuestion(
              null,
            );

            selectedQuestionRef.current =
              null;

            return;
          }

          const preview =
            createPreviewQuestion(
              selected,
            );

          setSelectedQuestion(
            preview,
          );

          selectedQuestionRef.current =
            preview;
        } catch (err: any) {
          console.error(
            "[QuizPlayController] Failed to load round questions:",
            err,
          );

          setError(
            err?.response?.data
              ?.message ??
              err?.message ??
              "Unable to load round questions.",
          );
        } finally {
          setQuestionLoading(
            false,
          );
        }
      },
      [
        quizId,
        role,
        quizTimeLimit,
      ],
    );

  /* =======================================================
     LOAD QUESTIONS WHEN ROUND CHANGES
  ======================================================= */

  useEffect(() => {
    if (
      role !== "HOST" ||
      !quiz ||
      currentRound < 1
    ) {
      return;
    }

    void loadRoundQuestions(
      currentRound,
    );
  }, [
    role,
    quiz,
    currentRound,
    loadRoundQuestions,
  ]);

  /* =======================================================
     ROUND CHANGE
  ======================================================= */

  const handleRoundChanged =
    useCallback(
      (roundNumber: number) => {
        if (
          !Number.isFinite(
            roundNumber,
          ) ||
          roundNumber < 1
        ) {
          return;
        }

        currentRoundRef.current =
          roundNumber;

        setCurrentRound(
          roundNumber,
        );
      },
      [],
    );

  /* =======================================================
     SOCKET
  ======================================================= */

  const socketState =
    useQuizSocket({
      quizId,
      roomId,
      role,
      currentRound,
      selectedQuestion,

      timeLimit:
        selectedQuestion?.timeLimit ??
        quizTimeLimit,

      onRoundChanged:
        handleRoundChanged,
    });

  /* =======================================================
     SOCKET STATE
  ======================================================= */

  const {
    connected,
    roomJoined,
    roomActivated,

    question,
    currentQuestionNumber,

    questionStarted,
    questionLocked,

    timeLimit,

    selectedAnswer,
    answerSubmitted,

    participants,
    leaderboard,
    feedEvents,

    socketError,
    actionLoading,

    startQuestion,
    lockQuestion,
    nextQuestion,

    selectContestantAnswer,

    setTimeLimit,
    refreshSocketState,
  } = socketState;

  /* =======================================================
     CRITICAL QUESTION TRACE
  ======================================================= */

  useEffect(() => {
    console.log(
      "[QuizPlayController] SOCKET QUESTION STATE CHANGED",
      {
        role,
        quizId,
        roomId,

        questionExists:
          Boolean(question),

        questionId:
          question?.id ?? null,

        questionText:
          question?.question ?? null,

        questionNumber:
          question?.questionNumber ??
          null,

        optionCount:
          question?.options?.length ??
          0,

        questionStarted,
        questionLocked,

        connected,
        roomJoined,
        roomActivated,

        timeLimit,

        startedAt:
          question?.startedAt ??
          null,

        expiresAt:
          question?.expiresAt ??
          null,
      },
    );

    /*
     * Only remember valid questions.
     */
    if (
      question &&
      question.id &&
      question.question
    ) {
      liveQuestionRef.current =
        question;
    }
  }, [
    question,
    role,
    quizId,
    roomId,
    questionStarted,
    questionLocked,
    connected,
    roomJoined,
    roomActivated,
    timeLimit,
  ]);

  /* =======================================================
     DISPLAY QUESTION
  ======================================================= */

  const displayQuestion =
    question ??
    liveQuestionRef.current ??
    null;

  /* =======================================================
     CRITICAL CONTESTANT TRACE
  ======================================================= */

  useEffect(() => {
    if (
      role !== "CONTESTANT"
    ) {
      return;
    }

    console.log(
      "[QuizPlayController] CONTESTANT DISPLAY PAYLOAD",
      {
        questionExists:
          Boolean(displayQuestion),

        questionId:
          displayQuestion?.id ??
          null,

        questionText:
          displayQuestion?.question ??
          null,

        questionNumber:
          displayQuestion?.questionNumber ??
          null,

        optionCount:
          displayQuestion?.options?.length ??
          0,

        questionStarted,

        questionLocked,

        connected,
        roomJoined,
        roomActivated,

        timeLimit:
          displayQuestion?.timeLimit ??
          timeLimit,

        timerStartedAt:
          displayQuestion?.startedAt ??
          null,

        timerExpiresAt:
          displayQuestion?.expiresAt ??
          null,
      },
    );
  }, [
    role,
    displayQuestion,
    questionStarted,
    questionLocked,
    connected,
    roomJoined,
    roomActivated,
    timeLimit,
  ]);

  /* =======================================================
     DERIVED QUIZ VALUES
  ======================================================= */

  const totalRounds =
    useMemo(
      () =>
        quiz
          ? getQuizNumberOfRounds(
              quiz,
            )
          : 1,
      [quiz],
    );

  const quizTitle =
    useMemo(
      () =>
        quiz
          ? getQuizTitle(
              quiz,
            ) ??
            "Quiz Competition"
          : "Quiz Competition",
      [quiz],
    );

  const subject =
    quiz?.subject ??
    "Quiz Board";

  /* =======================================================
     QUESTION SELECTION
  ======================================================= */

  const selectQuestion =
    useCallback(
      (
        item: HostQuestionListItem,
      ) => {
        const preview =
          createPreviewQuestion(
            item,
          );

        setSelectedQuestion(
          preview,
        );

        selectedQuestionRef.current =
          preview;
      },
      [],
    );

  /* =======================================================
   CONTESTANT ANSWER SELECTION
======================================================= */

const handleContestantSelectAnswer =
  useCallback(
    (optionId: string) => {
      const normalizedOptionId =
        String(optionId ?? "").trim();

      if (!normalizedOptionId) {
        console.warn(
          "[QuizPlayController] Ignoring empty option ID selection.",
        );

        return;
      }

      if (role !== "CONTESTANT") {
        console.warn(
          "[QuizPlayController] Answer selection ignored because current role is not CONTESTANT.",
          {
            role,
          },
        );

        return;
      }

      if (!connected) {
        console.warn(
          "[QuizPlayController] Answer selection ignored because socket is disconnected.",
        );

        return;
      }

      if (!roomJoined) {
        console.warn(
          "[QuizPlayController] Answer selection ignored because contestant has not joined the room.",
        );

        return;
      }

      if (!roomActivated) {
        console.warn(
          "[QuizPlayController] Answer selection ignored because room is not activated.",
        );

        return;
      }

      if (!displayQuestion?.id) {
        console.warn(
          "[QuizPlayController] Answer selection ignored because there is no active question.",
        );

        return;
      }

      if (!questionStarted) {
        console.warn(
          "[QuizPlayController] Answer selection ignored because question has not started.",
        );

        return;
      }

      if (questionLocked) {
        console.warn(
          "[QuizPlayController] Answer selection ignored because question is locked.",
        );

        return;
      }

      if (answerSubmitted) {
        console.warn(
          "[QuizPlayController] Answer selection ignored because an answer has already been submitted.",
        );

        return;
      }

      console.log(
        "[QuizPlayController] CONTESTANT OPTION SELECTED",
        {
          quizId,
          roomId,
          questionId:
            displayQuestion.id,
          questionNumber:
            displayQuestion.questionNumber ??
            null,

          optionId:
            normalizedOptionId,

          /*
           * Diagnostic only:
           * Find the visible option that owns this ID.
           */
          optionValue:
            displayQuestion.options?.find(
              (option: any) =>
                option?.id ===
                normalizedOptionId,
            )?.value ?? null,
        },
      );

      /*
       * IMPORTANT:
       *
       * ContestantAnswerOptions now supplies
       * the backend option ID.
       *
       * Do not convert this ID back into
       * the visible option text.
       *
       * selectContestantAnswer() owns:
       *
       * 1. Local selection/locking.
       * 2. participant_selected_answer emission.
       */
      selectContestantAnswer(
        normalizedOptionId,
      );
    },
    [
      role,
      connected,
      roomJoined,
      roomActivated,
      displayQuestion,
      questionStarted,
      questionLocked,
      answerSubmitted,
      quizId,
      roomId,
      selectContestantAnswer,
    ],
  );

  /* =======================================================
     REFRESH
  ======================================================= */

  const refresh =
    useCallback(() => {
      void loadQuiz();

      if (
        role === "HOST"
      ) {
        void loadRoundQuestions(
          currentRoundRef.current,
        );
      }

      refreshSocketState();
    }, [
      loadQuiz,
      loadRoundQuestions,
      role,
      refreshSocketState,
    ]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const back =
    useCallback(() => {
      router.back();
    }, [
      router,
    ]);

  /* =======================================================
     CURRENT USER
  ======================================================= */

  const currentUser =
    useMemo(
      () =>
        readStoredUser(),
      [],
    );

  const currentUserId =
    String(
      currentUser?.id ??
        currentUser?._id ??
        "",
    );

  const currentUserEntry =
    useMemo(
      () =>
        leaderboard.find(
          (entry: any) =>
            String(
              entry?.userId ??
                entry?.participantId ??
                "",
            ) ===
            currentUserId,
        ) ?? null,
      [
        leaderboard,
        currentUserId,
      ],
    );

  /* =======================================================
     HOST START QUESTION AVAILABILITY
  ======================================================= */

  const canStartQuestion =
    connected &&
    roomJoined &&
    roomActivated &&
    Boolean(
      selectedQuestion,
    ) &&
    !questionStarted;

  const canLockQuestion =
    connected &&
    roomJoined &&
    questionStarted &&
    !questionLocked;

  const canNextQuestion =
    connected &&
    roomJoined &&
    questionLocked;

  /* =======================================================
     HOST DEBUG
  ======================================================= */

  useEffect(() => {
    if (
      role !== "HOST"
    ) {
      return;
    }

    console.log(
      "[QuizPlayController] HOST START CONDITIONS",
      {
        role,
        connected,
        roomJoined,
        roomActivated,

        selectedQuestion:
          Boolean(
            selectedQuestion,
          ),

        selectedQuestionNumber:
          selectedQuestion
            ?.questionNumber ??
          null,

        questionStarted,
        questionLocked,
        actionLoading,

        canStartQuestion,
        canLockQuestion,
        canNextQuestion,
      },
    );
  }, [
    role,
    connected,
    roomJoined,
    roomActivated,
    selectedQuestion,
    questionStarted,
    questionLocked,
    actionLoading,
    canStartQuestion,
    canLockQuestion,
    canNextQuestion,
  ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="text-sm text-slate-400">
            Loading quiz...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     INVALID STATE
  ======================================================= */

  if (
    error ||
    !quiz ||
    !role ||
    !roomId
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-center">
          <h1 className="text-lg font-semibold">
            Unable to load competition
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {error ??
              (!roomId
                ? "No quiz room is available for this competition."
                : "Invalid quiz state.")}
          </p>

          <button
            type="button"
            onClick={back}
            className="mt-6 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     HOST
  ======================================================= */

  if (
    role === "HOST"
  ) {
    return (
      <HostQuizShow
        quizId={quizId}
        roomId={roomId}
        quizTitle={quizTitle}
        subject={subject}
        description={
          quiz.description ?? ""
        }
        currentRound={currentRound}
        totalRounds={totalRounds}
        questions={questions}
        selectedQuestionNumber={
          selectedQuestion?.questionNumber ??
          null
        }
        currentQuestionNumber={
          currentQuestionNumber
        }
        totalQuestions={
          questions.length || null
        }
        selectedQuestion={
          selectedQuestion
        }
        questionStarted={
          questionStarted
        }
        questionLocked={
          questionLocked
        }
        timeLimit={
          timeLimit
        }
        connected={
          connected
        }
        roomActivated={
          roomActivated
        }
        participants={
          participants
        }
        leaderboard={
          leaderboard
        }
        loading={
          loading
        }
        questionLoading={
          questionLoading
        }
        actionLoading={
          actionLoading
        }
        error={
          error ??
          socketError
        }
        canStartQuestion={
          canStartQuestion
        }
        canLockQuestion={
          canLockQuestion
        }
        canNextQuestion={
          canNextQuestion
        }
        onBack={
          back
        }
        onSelectQuestion={
          selectQuestion
        }
        onStartQuestion={
          startQuestion
        }
        onLockQuestion={
          lockQuestion
        }
        onNextQuestion={
          nextQuestion
        }
        onTimeLimitChange={
          setTimeLimit
        }
        onRefresh={
          refresh
        }
      />
    );
  }

  /* =======================================================
     SPECTATOR
  ======================================================= */

  if (
    role === "SPECTATOR"
  ) {
    const spectatorProps =
      {
        quizId,
        roomId,
        quizTitle,
        subject,

        description:
          quiz.description ?? "",

        currentRound,
        totalRounds,

        currentQuestionNumber,

        totalQuestions:
          displayQuestion?.totalQuestions ??
          questions.length ??
          null,

        question:
          displayQuestion,

        questionStarted,
        questionLocked,

        timeLimit:
          displayQuestion?.timeLimit ??
          timeLimit,

        startedAt:
          displayQuestion?.startedAt ??
          null,

        expiresAt:
          displayQuestion?.expiresAt ??
          null,

        connected,

        connectionStatus:
          connected
            ? "CONNECTED"
            : "DISCONNECTED",

        roomJoined,
        roomActivated,

        participants,
        leaderboard,
        feedEvents,

        loading,
        questionLoading,

        error:
          error ??
          socketError,

        onBack:
          back,

        onRefresh:
          refresh,
      } as ComponentProps<
        typeof SpectatorQuizShow
      >;

    return (
      <SpectatorQuizShow
        {...spectatorProps}
      />
    );
  }

  /* =======================================================
     CONTESTANT
  ======================================================= */

  const contestantProps =
    {
      quizId,
      roomId,
      quizTitle,
      subject,

      description:
        quiz.description ?? "",

      currentRound,
      totalRounds,

      /*
       * Use displayQuestion rather than raw socket
       * question state.
       */
      question:
        displayQuestion,

      selectedAnswer,

      answerSubmitted,

      questionStarted,

      questionLocked,

      connected,
      roomJoined,
      roomActivated,

      timerStartedAt:
        displayQuestion?.startedAt ??
        null,

      timerExpiresAt:
        displayQuestion?.expiresAt ??
        null,

      timeLimit:
        displayQuestion?.timeLimit ??
        timeLimit,

      score:
        currentUserEntry?.score ??
        0,

      rank:
        currentUserEntry?.rank ??
        null,

      participantCount:
        participants.length,

      answerStatus:
        answerSubmitted
          ? "SUBMITTED"
          : questionStarted
            ? "WAITING"
            : "IDLE",

      eliminated:
        false,

      loading,

      error:
        error ??
        socketError,

      onBack:
        back,

      /*
       * There is NO onSubmitAnswer.
       *
       * Selecting an option is the contestant's
       * answer action.
       */
      onSelectAnswer:
        handleContestantSelectAnswer,
    } as ComponentProps<
      typeof ContestantQuizShow
    >;

  return (
    <ContestantQuizShow
      {...contestantProps}
    />
  );
}

/* =========================================================
   CREATE HOST PREVIEW QUESTION
   ========================================================= */

function createPreviewQuestion(
  item: HostQuestionListItem,
): HostQuestionPreviewQuestion {
  return {
    id: item.id,

    questionNumber:
      item.questionNumber,

    question:
      item.question,

    options:
      Array.isArray(
        item.options,
      )
        ? item.options.map(
            (
              option: any,
            ) => ({
              label:
                option?.label ??
                option?.text ??
                "",

              value:
                option?.value ??
                option?.answer ??
                option?.text ??
                "",

              isCorrect:
                option?.isCorrect ??
                option?.is_correct,
            }),
          )
        : [],

    timeLimit:
      item.timeLimit,

    status:
      item.status,

    answeredCount:
      item.answeredCount,

    correctCount:
      item.correctCount,
  };
}












