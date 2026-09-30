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

import  useQuizSocket  from "@/hooks/quiz-board/useQuizSocket";

/* =========================================================
   PROPS
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
  if (
    typeof window === "undefined"
  ) {
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

  /*
   * Explicit URL role takes priority.
   */

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

  /*
   * Otherwise determine the role
   * from the authenticated application user.
   */

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
    useState<QuizGameRole | null>(
      null,
    );

  const [currentRound, setCurrentRound] =
    useState<number>(1);

  const [questions, setQuestions] =
    useState<HostQuestionListItem[]>(
      [],
    );

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
     
     URL roomId has priority because the quiz object may
     still contain a null room ID.
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

          /*
           * Normalize time per question safely.
           */

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

          /*
           * Normalize quiz object.
           */

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

          /*
           * Determine current round.
           */

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

          /*
           * Supported backend shapes:
           *
           * data: [...]
           *
           * data: {
           *   questions: [...]
           * }
           *
           * data: {
           *   questionObj: [...]
           * }
           *
           * data: {
           *   roundQuestions: [...]
           * }
           */

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

                    /*
                     * Keep backend options as supplied.
                     * Host preview will normalize them.
                     */

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

          /*
           * Preserve the selected question
           * when the round is refreshed.
           */

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

          /*
           * Convert the list question into the
           * preview question expected by HostQuizShow.
           */

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
     ROUND CHANGE FROM SOCKET
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
     SOCKET HOOK
     
     All Socket.IO behavior lives inside useQuizSocket.
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
    submittingAnswer,

    participants,
    leaderboard,
    feedEvents,

    socketError,
    actionLoading,

    startQuestion,
    lockQuestion,
    nextQuestion,
    submitAnswer,

    setTimeLimit,
    setSelectedAnswer,
    refreshSocketState,
  } = socketState;

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
     DEBUG
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
        quizId={
          quizId
        }

        roomId={
          roomId
        }

        quizTitle={
          quizTitle
        }

        subject={
          subject
        }

        description={
          quiz.description ??
          ""
        }

        currentRound={
          currentRound
        }

        totalRounds={
          totalRounds
        }

        questions={
          questions
        }

        selectedQuestionNumber={
          selectedQuestion?.questionNumber ??
          null
        }

        currentQuestionNumber={
          currentQuestionNumber
        }

        totalQuestions={
          questions.length ||
          null
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

        // roomJoined={
        //   roomJoined
        // }

        roomActivated={
          roomActivated
        }

        participants={
          participants
        }

        leaderboard={
          leaderboard
        }

        // feedEvents={
        //   feedEvents
        // }

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
          quiz.description ??
          "",

        currentRound,

        totalRounds,

        currentQuestionNumber,

        totalQuestions:
          question?.totalQuestions ??
          questions.length ??
          null,

        question,

        questionStarted,

        questionLocked,

        timeLimit:
          question?.timeLimit ??
          timeLimit,

        startedAt:
          question?.startedAt ??
          null,

        expiresAt:
          question?.expiresAt ??
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
        quiz.description ??
        "",

      currentRound,

      totalRounds,

      question,

      selectedAnswer,

      answerSubmitted,

      questionStarted,

      questionLocked,

      submittingAnswer,

      connected,

      roomJoined,

      roomActivated,

      timerStartedAt:
        question?.startedAt ??
        null,

      timerExpiresAt:
        question?.expiresAt ??
        null,

      timeLimit:
        question?.timeLimit ??
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

      onSelectAnswer:
        setSelectedAnswer,

      onSubmitAnswer:
        () => {
          if (
            !selectedAnswer
          ) {
            return;
          }

          submitAnswer(
            selectedAnswer,
          );
        },
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

















// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type ComponentProps,
// } from "react";

// import {
//   useParams,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";

// import { axiosInstance } from "@/lib/api/axios";

// import {
//   getQuizCurrentRound,
//   getQuizId,
//   getQuizNumberOfRounds,
//   getQuizRoomId,
//   getQuizTimePerQuestion,
//   getQuizTitle,
//   type Quiz,
// } from "@/types/quiz-board/quiz";

// import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

// import HostQuizShow from "@/components/quiz-board/host/HostQuizShow";

// import type {
//   HostQuestionListItem,
// } from "@/components/quiz-board/host/HostQuestionList";

// import type {
//   HostQuestionPreviewQuestion,
// } from "@/components/quiz-board/host/HostQuestionPreview";

// import SpectatorQuizShow from "@/components/quiz-board/spectator/SpectatorQuizShow";

// import ContestantQuizShow from "@/components/quiz-board/contestant/ContestantQuizShow";

// import type { QuizOption } from "@/components/quiz-board/shared/QuizOptions";

// import { useQuizSocket } from "@/hooks/quiz-board/useQuizSocket"; 




// /* =========================================================
//    TYPES
//    ========================================================= */

// interface LiveQuestion {
//   id: string;

//   question: string;

//   options: QuizOption[];

//   questionNumber: number | null;

//   totalQuestions: number | null;

//   timeLimit: number | null;

//   startedAt: string | null;

//   expiresAt: string | null;
// }

// /* =========================================================
//    HELPERS
//    ========================================================= */

// function getNumber(
//   value: unknown,
//   fallback: number | null = null,
// ): number | null {
//   if (
//     typeof value === "number" &&
//     Number.isFinite(value)
//   ) {
//     return value;
//   }

//   if (typeof value === "string") {
//     const parsed = Number(value);

//     if (Number.isFinite(parsed)) {
//       return parsed;
//     }
//   }

//   return fallback;
// }

// function readStoredUser(): any {
//   if (
//     typeof window === "undefined"
//   ) {
//     return null;
//   }

//   const keys = [
//     "user",
//     "auth-user",
//     "jamb_user",
//     "jamb_auth_user",
//   ];

//   for (const key of keys) {
//     try {
//       const value =
//         window.localStorage.getItem(key);

//       if (value) {
//         return JSON.parse(value);
//       }
//     } catch {
//       // Ignore malformed localStorage values.
//     }
//   }

//   return null;
// }

// function getApplicationRole(
//   user: any,
// ): string {
//   return String(
//     user?.role ??
//       user?.userRole ??
//       user?.user_role ??
//       user?.accountType ??
//       user?.account_type ??
//       "",
//   ).toUpperCase();
// }

// function getSocketRole(
//   user: any,
//   requestedRole: string | null,
// ): QuizGameRole {
//   if (
//     requestedRole?.toLowerCase() ===
//     "spectator"
//   ) {
//     return "SPECTATOR";
//   }

//   const applicationRole =
//     getApplicationRole(user);

//   if (
//     applicationRole === "ADMIN" ||
//     applicationRole === "HOST"
//   ) {
//     return "HOST";
//   }

//   return "CONTESTANT";
// }

// /* =========================================================
//    PAGE
//    ========================================================= */

// export default function QuizPlayPage() {
//   const params =
//     useParams<{
//       quizId: string;
//     }>();

//   const searchParams =
//     useSearchParams();

//   const router =
//     useRouter();

//   const quizId =
//     params.quizId;

//   const requestedRole =
//     searchParams.get("role");

//   const requestedRoomId =
//     searchParams.get("roomId");

//   /* =======================================================
//      QUIZ STATE
//      ======================================================= */

//   const [quiz, setQuiz] =
//     useState<Quiz | null>(null);

//   const [role, setRole] =
//     useState<QuizGameRole | null>(
//       null,
//     );

//   const [currentRound, setCurrentRound] =
//     useState(1);

//   const [questions, setQuestions] =
//     useState<HostQuestionListItem[]>(
//       [],
//     );

//   const [selectedQuestion, setSelectedQuestion] =
//     useState<HostQuestionPreviewQuestion | null>(
//       null,
//     );

//   const [questionLoading, setQuestionLoading] =
//     useState(false);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   const selectedQuestionRef =
//     useRef<HostQuestionPreviewQuestion | null>(
//       null,
//     );

//   const currentRoundRef =
//     useRef(currentRound);

//   /* =======================================================
//      KEEP REFS SYNCHRONIZED
//      ======================================================= */

//   useEffect(() => {
//     currentRoundRef.current =
//       currentRound;
//   }, [currentRound]);

//   useEffect(() => {
//     selectedQuestionRef.current =
//       selectedQuestion;
//   }, [selectedQuestion]);

//   /* =======================================================
//      SAFE QUIZ TIME LIMIT
     
//      IMPORTANT:
//      quiz is null during the first render.
     
//      NEVER call:
     
//        getQuizTimePerQuestion(quiz)
     
//      until quiz exists.
//      ======================================================= */

//   const quizTimeLimit =
//     useMemo(() => {
//       if (!quiz) {
//         return 30;
//       }

//       try {
//         const value =
//           getQuizTimePerQuestion(
//             quiz,
//           );

//         const parsed =
//           Number(value);

//         if (
//           Number.isFinite(parsed) &&
//           parsed > 0
//         ) {
//           return parsed;
//         }
//       } catch (err) {
//         console.warn(
//           "[Quiz Play] Unable to determine quiz time limit:",
//           err,
//         );
//       }

//       return 30;
//     }, [quiz]);

//   /* =======================================================
//      ROOM ID

//      IMPORTANT:
//      The URL roomId has priority because the backend quiz
//      object may still contain quizRoomId: null.
//      ======================================================= */

//   const roomId =
//     useMemo(() => {
//       const urlRoomId =
//         requestedRoomId?.trim();

//       if (urlRoomId) {
//         return urlRoomId;
//       }

//       return quiz
//         ? getQuizRoomId(quiz)
//         : null;
//     }, [
//       requestedRoomId,
//       quiz,
//     ]);

//   /* =======================================================
//      LOAD QUIZ
//      ======================================================= */

//   const loadQuiz =
//     useCallback(
//       async () => {
//         if (!quizId) {
//           return;
//         }

//         try {
//           setLoading(true);
//           setError(null);

//           const response =
//             await axiosInstance.get(
//               `/quiz/get-quiz-by-quizId/${encodeURIComponent(
//                 quizId,
//               )}`,
//             );

//           const rawQuiz =
//             response?.data?.data ??
//             response?.data?.quiz ??
//             response?.data;

//           if (!rawQuiz) {
//             throw new Error(
//               "Quiz competition could not be found.",
//             );
//           }

//           /*
//            * Only call getQuizTimePerQuestion()
//            * after rawQuiz has been confirmed to exist.
//            */
//           let normalizedTimePerQuestion = 30;

//           try {
//             const value =
//               getQuizTimePerQuestion(
//                 rawQuiz,
//               );

//             const parsed =
//               Number(value);

//             if (
//               Number.isFinite(parsed) &&
//               parsed > 0
//             ) {
//               normalizedTimePerQuestion =
//                 parsed;
//             }
//           } catch (err) {
//             console.warn(
//               "[Quiz Play] Unable to normalize quiz timePerQuestion:",
//               err,
//             );
//           }

//           const normalizedQuiz: Quiz =
//             {
//               ...rawQuiz,

//               id: getQuizId({
//                 id:
//                   rawQuiz.id ??
//                   rawQuiz._id ??
//                   quizId,

//                 _id:
//                   rawQuiz._id,
//               }),

//               title:
//                 rawQuiz.title ??
//                 rawQuiz.quiz_title ??
//                 "Quiz Competition",

//               status:
//                 rawQuiz.status ??
//                 "WAITING",

//               numberOfRounds:
//                 getQuizNumberOfRounds(
//                   rawQuiz,
//                 ),

//               timePerQuestion:
//                 normalizedTimePerQuestion,

//               noOfContestants:
//                 rawQuiz.noOfContestants ??
//                 rawQuiz.no_of_contestants ??
//                 20,
//             };

//           setQuiz(
//             normalizedQuiz,
//           );

//           const initialRound =
//             Math.max(
//               1,
//               getQuizCurrentRound(
//                 normalizedQuiz,
//               ) || 1,
//             );

//           setCurrentRound(
//             initialRound,
//           );
//         } catch (err: any) {
//           setError(
//             err?.response?.data
//               ?.message ??
//               err?.message ??
//               "Unable to load competition.",
//           );
//         } finally {
//           setLoading(false);
//         }
//       },
//       [quizId],
//     );

//   useEffect(() => {
//     void loadQuiz();
//   }, [loadQuiz]);

//   /* =======================================================
//      DETERMINE ROLE
//      ======================================================= */

//   useEffect(() => {
//     if (
//       typeof window ===
//       "undefined"
//     ) {
//       return;
//     }

//     const user =
//       readStoredUser();

//     const resolvedRole =
//       getSocketRole(
//         user,
//         requestedRole,
//       );

//     setRole(
//       resolvedRole,
//     );
//   }, [
//     requestedRole,
//   ]);

//   /* =======================================================
//      LOAD HOST ROUND QUESTIONS
//      ======================================================= */

//   const loadRoundQuestions =
//     useCallback(
//       async (
//         roundNumber: number,
//       ) => {
//         if (
//           !quizId ||
//           role !== "HOST"
//         ) {
//           return;
//         }

//         try {
//           setQuestionLoading(
//             true,
//           );

//           const response =
//             await axiosInstance.get(
//               `/quiz/get-round-questions/${encodeURIComponent(
//                 quizId,
//               )}`,
//               {
//                 params: {
//                   roundNumber,
//                 },
//               },
//             );

//           const payload =
//             response?.data?.data ??
//             response?.data;

//           let rawQuestions: any[] =
//             [];

//           /*
//            * Backend currently returns:
//            *
//            * data: Array(10)
//            *
//            * but we also support:
//            *
//            * data: {
//            *   questions: [...]
//            * }
//            */

//           if (
//             Array.isArray(
//               payload,
//             )
//           ) {
//             rawQuestions =
//               payload;
//           } else if (
//             payload &&
//             typeof payload ===
//               "object"
//           ) {
//             rawQuestions =
//               payload.questions ??
//               payload.questionObj ??
//               payload.roundQuestions ??
//               [];
//           }

//           const normalized: HostQuestionListItem[] =
//             Array.isArray(
//               rawQuestions,
//             )
//               ? rawQuestions.map(
//                   (
//                     item: any,
//                     index: number,
//                   ) => {
//                     const itemTimeLimit =
//                       getNumber(
//                         item?.timeLimit ??
//                           item?.time_limit,
//                         null,
//                       );

//                     return {
//                       id: String(
//                         item?.id ??
//                           item?._id ??
//                           `question-${
//                             index + 1
//                           }`,
//                       ),

//                       questionNumber:
//                         getNumber(
//                           item?.questionNumber ??
//                             item?.question_number,
//                           index + 1,
//                         ) ??
//                         index + 1,

//                       question:
//                         item?.question ??
//                         item?.questionText ??
//                         item?.question_text ??
//                         "",

//                       options:
//                         Array.isArray(
//                           item?.options,
//                         )
//                           ? item.options
//                           : [],

//                       /*
//                        * IMPORTANT:
//                        *
//                        * Use the question-specific
//                        * time limit when available.
//                        *
//                        * Otherwise use the SAFE
//                        * quizTimeLimit.
//                        */
//                       timeLimit:
//                         itemTimeLimit ??
//                         quizTimeLimit,

//                       status:
//                         item?.status ??
//                         "READY",

//                       answeredCount:
//                         getNumber(
//                           item?.answeredCount ??
//                             item?.answered_count,
//                           0,
//                         ) ?? 0,

//                       correctCount:
//                         getNumber(
//                           item?.correctCount ??
//                             item?.correct_count,
//                           0,
//                         ) ?? 0,
//                     };
//                   },
//                 )
//               : [];

//           setQuestions(
//             normalized,
//           );

//           /*
//            * Preserve the currently selected question
//            * when the same round is refreshed.
//            */
//           const existingNumber =
//             selectedQuestionRef
//               .current
//               ?.questionNumber;

//           const selected =
//             normalized.find(
//               (item) =>
//                 item.questionNumber ===
//                 existingNumber,
//             ) ??
//             normalized[0] ??
//             null;

//           if (selected) {
//             const preview: HostQuestionPreviewQuestion =
//               {
//                 id:
//                   selected.id,

//                 questionNumber:
//                   selected.questionNumber,

//                 question:
//                   selected.question,

//                 options:
//                   selected.options?.map(
//                     (
//                       option: any,
//                     ) => ({
//                       label:
//                         option?.label,

//                       value:
//                         option?.value ??
//                         option?.answer ??
//                         "",

//                       isCorrect:
//                         option?.isCorrect ??
//                         option?.is_correct,
//                     }),
//                   ) ?? [],

//                 timeLimit:
//                   selected.timeLimit,

//                 status:
//                   selected.status,

//                 answeredCount:
//                   selected.answeredCount,

//                 correctCount:
//                   selected.correctCount,
//               };

//             setSelectedQuestion(
//               preview,
//             );

//             selectedQuestionRef.current =
//               preview;
//           } else {
//             setSelectedQuestion(
//               null,
//             );

//             selectedQuestionRef.current =
//               null;
//           }
//         } catch (err: any) {
//           setError(
//             err?.response?.data
//               ?.message ??
//               err?.message ??
//               "Unable to load round questions.",
//           );
//         } finally {
//           setQuestionLoading(
//             false,
//           );
//         }
//       },
//       [
//         quizId,
//         role,
//         quizTimeLimit,
//       ],
//     );

//   /* =======================================================
//      LOAD QUESTIONS WHEN ROUND CHANGES
//      ======================================================= */

//   useEffect(() => {
//     if (
//       role !== "HOST" ||
//       !quiz ||
//       currentRound < 1
//     ) {
//       return;
//     }

//     void loadRoundQuestions(
//       currentRound,
//     );
//   }, [
//     role,
//     quiz,
//     currentRound,
//     loadRoundQuestions,
//   ]);

//   /* =======================================================
//      SOCKET HOOK

//      ALL SOCKET.IO LOGIC IS INSIDE:

//        ./useQuizSocket.ts

//      The page only consumes the state/actions.
//      ======================================================= */
// const handleRoundChanged = useCallback(
//   (roundNumber: number) => {
//     if (roundNumber < 1) {
//       return;
//     }

//     setCurrentRound(roundNumber);
//     currentRoundRef.current = roundNumber;
//   },
//   [],
// );
  

//   const socketState = useQuizSocket({
//   quizId,
//   roomId,
//   role,
//   currentRound,
//   selectedQuestion,

//   /*
//    * Safe fallback:
//    *
//    * quizTimeLimit is already protected against quiz === null.
//    * selectedQuestion.timeLimit takes priority when available.
//    */
//   timeLimit:
//     selectedQuestion?.timeLimit ??
//     quizTimeLimit,

//   /*
//    * IMPORTANT:
//    * Use a stable callback instead of creating
//    * a new inline function on every render.
//    */
//   onRoundChanged: handleRoundChanged,
// });

// const {
//   connected,
//   roomJoined,
//   roomActivated,

//   question,
//   currentQuestionNumber,

//   questionStarted,
//   questionLocked,

//   timeLimit,

//   selectedAnswer,
//   answerSubmitted,
//   submittingAnswer,

//   participants,
//   leaderboard,
//   feedEvents,

//   socketError,
//   actionLoading,

//   startQuestion,
//   lockQuestion,
//   nextQuestion,
//   submitAnswer,

//   setTimeLimit,
//   setSelectedAnswer,
//   refreshSocketState,
// } = socketState;
//   /* =======================================================
//      DERIVED QUIZ VALUES
//      ======================================================= */

//   const totalRounds =
//     useMemo(
//       () =>
//         quiz
//           ? getQuizNumberOfRounds(
//               quiz,
//             )
//           : 1,
//       [quiz],
//     );

//   const quizTitle =
//     useMemo(
//       () =>
//         quiz
//           ? getQuizTitle(quiz)
//           : "Quiz Competition",
//       [quiz],
//     );

//   const subject =
//     quiz?.subject ??
//     "Quiz Board";

//   /* =======================================================
//      QUESTION SELECTION
//      ======================================================= */

//   const selectQuestion =
//     useCallback(
//       (
//         item: HostQuestionListItem,
//       ) => {
//         const preview: HostQuestionPreviewQuestion =
//           {
//             id:
//               item.id,

//             questionNumber:
//               item.questionNumber,

//             question:
//               item.question,

//             options:
//               item.options?.map(
//                 (
//                   option: any,
//                 ) => ({
//                   label:
//                     option?.label,

//                   value:
//                     option?.value ??
//                     option?.answer ??
//                     "",

//                   isCorrect:
//                     option?.isCorrect ??
//                     option?.is_correct,
//                 }),
//               ) ?? [],

//             timeLimit:
//               item.timeLimit,

//             status:
//               item.status,

//             answeredCount:
//               item.answeredCount,

//             correctCount:
//               item.correctCount,
//           };

//         setSelectedQuestion(
//           preview,
//         );

//         selectedQuestionRef.current =
//           preview;
//       },
//       [],
//     );

//   /* =======================================================
//      REFRESH
//      ======================================================= */

//   const refresh =
//     useCallback(() => {
//       void loadQuiz();

//       if (
//         role === "HOST"
//       ) {
//         void loadRoundQuestions(
//           currentRoundRef.current,
//         );
//       }
//     }, [
//       loadQuiz,
//       loadRoundQuestions,
//       role,
//     ]);

//   /* =======================================================
//      NAVIGATION
//      ======================================================= */

//   const back =
//     useCallback(() => {
//       router.back();
//     }, [
//       router,
//     ]);

//   /* =======================================================
//      CURRENT USER
//      ======================================================= */

//   const currentUser =
//     useMemo(
//       () =>
//         readStoredUser(),
//       [],
//     );

//   const currentUserId =
//     String(
//       currentUser?.id ??
//         currentUser?._id ??
//         "",
//     );

//   const currentUserEntry =
//     useMemo(
//       () =>
//         leaderboard.find(
//           (entry) =>
//             String(
//               entry.userId ??
//                 entry.participantId ??
//                 "",
//             ) ===
//             currentUserId,
//         ),
//       [
//         leaderboard,
//         currentUserId,
//       ],
//     );

//   /* =======================================================
//      START QUESTION AVAILABILITY
//      ======================================================= */

//   const canStartQuestion =
//     connected &&
//     roomJoined &&
//     roomActivated &&
//     Boolean(selectedQuestion) &&
//     !questionStarted;

//   /*
//    * Keep this log while debugging.
//    * Remove it later once the live flow is stable.
//    */
//   if (
//     role === "HOST"
//   ) {
//     console.log(
//       "[HOST START CONDITIONS]",
//       {
//         role,
//         connected,
//         roomJoined,
//         roomActivated,

//         selectedQuestion:
//           Boolean(
//             selectedQuestion,
//           ),

//         selectedQuestionNumber:
//           selectedQuestion?.questionNumber ??
//           null,

//         questionStarted,

//         questionLocked,

//         actionLoading,

//         canStartQuestion,
//       },
//     );
//   }

//   /* =======================================================
//      LOADING
//      ======================================================= */

//   if (loading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
//         <div className="text-center">
//           <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

//           <p className="text-sm text-slate-400">
//             Loading quiz...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      INVALID STATE
//      ======================================================= */

//   if (
//     error ||
//     !quiz ||
//     !role ||
//     !roomId
//   ) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
//         <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-center">
//           <h1 className="text-lg font-semibold">
//             Unable to load competition
//           </h1>

//           <p className="mt-2 text-sm text-slate-400">
//             {error ??
//               "No quiz room is available for this competition."}
//           </p>

//           <button
//             type="button"
//             onClick={back}
//             className="mt-6 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      HOST
//      ======================================================= */

//   if (
//     role === "HOST"
//   ) {
//     return (
//       <HostQuizShow
//         quizId={
//           quizId
//         }

//         roomId={
//           roomId
//         }

//         quizTitle={
//           quizTitle
//         }

//         subject={
//           subject
//         }

//         description={
//           quiz.description ??
//           ""
//         }

//         currentRound={
//           currentRound
//         }

//         totalRounds={
//           totalRounds
//         }

//         questions={
//           questions
//         }

//         selectedQuestionNumber={
//           selectedQuestion?.questionNumber ??
//           null
//         }

//         currentQuestionNumber={
//           currentQuestionNumber
//         }

//         totalQuestions={
//           questions.length ||
//           null
//         }

//         selectedQuestion={
//           selectedQuestion
//         }

//         questionStarted={
//           questionStarted
//         }

//         questionLocked={
//           questionLocked
//         }

//         timeLimit={
//           timeLimit
//         }

//         connected={
//           connected
//         }

//         roomActivated={
//           roomActivated
//         }

//         participants={
//           participants
//         }

//         leaderboard={
//           leaderboard
//         }

//         loading={
//           loading
//         }

//         questionLoading={
//           questionLoading
//         }

//         actionLoading={
//           actionLoading
//         }

//         error={
//           error ??
//           socketError
//         }

//         canStartQuestion={
//           canStartQuestion
//         }

//         canLockQuestion={
//           connected &&
//           roomJoined &&
//           questionStarted &&
//           !questionLocked
//         }

//         canNextQuestion={
//           connected &&
//           roomJoined &&
//           questionLocked
//         }

//         onBack={
//           back
//         }

//         onSelectQuestion={
//           selectQuestion
//         }

//         onStartQuestion={
//           startQuestion
//         }

//         onLockQuestion={
//           lockQuestion
//         }

//         onNextQuestion={
//           nextQuestion
//         }

//         onTimeLimitChange={
//           socketState.setTimeLimit
//         }

//         onRefresh={
//           refresh
//         }
//       />
//     );
//   }

//   /* =======================================================
//      SPECTATOR
//      ======================================================= */

//   if (
//     role === "SPECTATOR"
//   ) {
//     const spectatorProps =
//       {
//         quizId,

//         roomId,

//         quizTitle,

//         subject,

//         description:
//           quiz.description ??
//           "",

//         currentRound,

//         totalRounds,

//         currentQuestionNumber,

//         totalQuestions:
//           question?.totalQuestions ??
//           questions.length ??
//           null,

//         question,

//         questionStarted,

//         questionLocked,

//         timeLimit:
//           question?.timeLimit ??
//           timeLimit,

//         startedAt:
//           question?.startedAt ??
//           null,

//         expiresAt:
//           question?.expiresAt ??
//           null,

//         connected,

//         connectionStatus:
//           connected
//             ? "CONNECTED"
//             : "DISCONNECTED",

//         roomActivated,

//         participants,

//         leaderboard,

//         feedEvents,

//         loading,

//         questionLoading,

//         error:
//           error ??
//           socketError,

//         onBack:
//           back,

//         onRefresh:
//           refresh,
//       } as ComponentProps<
//         typeof SpectatorQuizShow
//       >;

//     return (
//       <SpectatorQuizShow
//         {...spectatorProps}
//       />
//     );
//   }

//   /* =======================================================
//      CONTESTANT
//      ======================================================= */

//   const contestantProps =
//     {
//       quizId,

//       roomId,

//       quizTitle,

//       subject,

//       description:
//         quiz.description ??
//         "",

//       currentRound,

//       totalRounds,

//       question,

//       selectedAnswer,

//       answerSubmitted,

//       questionStarted,

//       questionLocked,

//       submittingAnswer,

//       connected,

//       roomJoined,

//       roomActivated,

//       timerStartedAt:
//         question?.startedAt ??
//         null,

//       timerExpiresAt:
//         question?.expiresAt ??
//         null,

//       timeLimit:
//         question?.timeLimit ??
//         timeLimit,

//       score:
//         currentUserEntry?.score ??
//         0,

//       rank:
//         currentUserEntry?.rank ??
//         null,

//       participantCount:
//         participants.length,

//       answerStatus:
//         answerSubmitted
//           ? "SUBMITTED"
//           : questionStarted
//             ? "WAITING"
//             : "IDLE",

//       eliminated:
//         false,

//       loading,

//       error:
//         error ??
//         socketError,

//       onBack:
//         back,

//       onSelectAnswer:
//         socketState.setSelectedAnswer,

//       onSubmitAnswer:
//         () => {
//           if (
//             !selectedAnswer
//           ) {
//             return;
//           }

//           submitAnswer(
//             selectedAnswer,
//           );
//         },
//     } as ComponentProps<
//       typeof ContestantQuizShow
//     >;

//   return (
//     <ContestantQuizShow
//       {...contestantProps}
//     />
//   );
// }



