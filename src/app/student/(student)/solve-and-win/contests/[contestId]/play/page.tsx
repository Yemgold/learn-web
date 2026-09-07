




"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Loader2,
  Send,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAllActiveContests,
  type SolveAndWinContest,
} from "@/lib/api/solveAndWin";
import { axiosInstance } from "@/lib/api/axios";

/* =========================================================
   TYPES
========================================================= */

type ContestQuestion = {
  _id: string;
  id?: string;
  question: string;
  text?: string;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
};

type ContestAnswers = Record<string, string>;

type ContestState = "loading" | "ready" | "error" | "submitted";

/* =========================================================
   HELPERS
========================================================= */

function getContestStartDate(
  contest: SolveAndWinContest
): Date | null {
  const rawStartDate =
    (contest as any).startDate ??
    (contest as any).startAt ??
    (contest as any).startsAt ??
    (contest as any).scheduledStartDate ??
    (contest as any).scheduledStartAt;

  if (!rawStartDate) {
    return null;
  }

  const date = new Date(rawStartDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getContestDurationMinutes(
  contest: SolveAndWinContest
): number {
  const duration =
    (contest as any).durationMinutes ??
    (contest as any).duration ??
    (contest as any).timeLimitMinutes ??
    30;

  const parsed = Number(duration);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 30;
  }

  return parsed;
}

function getQuestionId(question: ContestQuestion) {
  return question._id || question.id || "";
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function PlayContestPage() {
  const router = useRouter();
  const params = useParams();

  const contestId = params?.contestId as string;

  /* -------------------------------------------------------
     Contest
  ------------------------------------------------------- */

  const [contest, setContest] =
    useState<SolveAndWinContest | null>(null);

  const [questions, setQuestions] = useState<ContestQuestion[]>(
    []
  );

  /* -------------------------------------------------------
     UI state
  ------------------------------------------------------- */

  const [state, setState] =
    useState<ContestState>("loading");

  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState<ContestAnswers>({});

  const [timeRemaining, setTimeRemaining] =
    useState<number>(0);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showSubmitConfirmation, setShowSubmitConfirmation] =
    useState(false);

  const [autoSubmitted, setAutoSubmitted] =
    useState(false);

  /* =======================================================
     LOAD CONTEST
  ======================================================= */

  useEffect(() => {
    const loadContest = async () => {
      if (!contestId) {
        setError("Contest information could not be found.");
        setState("error");
        return;
      }

      try {
        setState("loading");
        setError(null);

        /*
         * Load contest details.
         */
        const contestResponse =
          await getAllActiveContests();

        if (!contestResponse.success) {
          throw new Error(
            contestResponse.message ||
              "Unable to load contest."
          );
        }

        const contests: SolveAndWinContest[] =
          contestResponse.data ?? [];

        const foundContest = contests.find(
          (item: SolveAndWinContest) =>
            item._id === contestId
        );

        if (!foundContest) {
          throw new Error(
            "This contest could not be found or is no longer available."
          );
        }

        setContest(foundContest);

        /*
         * Check contest start time.
         */
        const startDate =
          getContestStartDate(foundContest);

        if (startDate && Date.now() < startDate.getTime()) {
          throw new Error(
            "This contest has not started yet. Please return when the countdown reaches zero."
          );
        }

        /*
         * Contest duration.
         */
        const durationMinutes =
          getContestDurationMinutes(foundContest);

        setTimeRemaining(durationMinutes * 60);

        /*
         * Load contest questions.
         *
         * IMPORTANT:
         * Replace this endpoint with your final backend
         * contest-question endpoint if the route differs.
         */
        const questionsResponse =
          await axiosInstance.get(
            `/solve-and-win/contests/${contestId}/questions`
          );

        const rawQuestions =
          questionsResponse.data?.data ??
          questionsResponse.data?.questions ??
          questionsResponse.data ??
          [];

        const normalizedQuestions: ContestQuestion[] =
          Array.isArray(rawQuestions)
            ? rawQuestions.map((item: any) => ({
                _id:
                  item._id ??
                  item.id ??
                  "",
                id: item.id,
                question:
                  item.question ??
                  item.text ??
                  item.questionText ??
                  "",
                text: item.text,
                options:
                  item.options ??
                  item.answers ??
                  [],
                correctAnswer:
                  item.correctAnswer,
                explanation:
                  item.explanation,
              }))
            : [];

        if (normalizedQuestions.length === 0) {
          throw new Error(
            "No questions are available for this contest yet."
          );
        }

        setQuestions(normalizedQuestions);
        setState("ready");
      } catch (err: any) {
        console.error(
          "Failed to load contest:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load this contest.";

        setError(
          Array.isArray(message)
            ? message.join(", ")
            : String(message)
        );

        setState("error");
      }
    };

    loadContest();
  }, [contestId]);

  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const currentQuestion = questions[currentQuestionIndex];

  const currentQuestionId = currentQuestion
    ? getQuestionId(currentQuestion)
    : "";

  const selectedAnswer =
    currentQuestionId
      ? answers[currentQuestionId]
      : undefined;

  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {
    if (state !== "ready") {
      return;
    }

    if (timeRemaining <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemaining((previous) =>
        Math.max(0, previous - 1)
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [state, timeRemaining]);

  /* =======================================================
     TIME EXPIRED
  ======================================================= */

  useEffect(() => {
    if (
      state !== "ready" ||
      timeRemaining > 0 ||
      isSubmitting
    ) {
      return;
    }

    setAutoSubmitted(true);
    setShowSubmitConfirmation(true);
  }, [
    state,
    timeRemaining,
    isSubmitting,
  ]);

  /* =======================================================
     TIMER DISPLAY
  ======================================================= */

  const formattedTime = useMemo(
    () => formatTime(timeRemaining),
    [timeRemaining]
  );

  const timerIsLow =
    timeRemaining <= 60;

  /* =======================================================
     ANSWER QUESTION
  ======================================================= */

  const handleSelectAnswer = (
    answer: string
  ) => {
    if (!currentQuestionId || isSubmitting) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestionId]: answer,
    }));
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goToQuestion = (
    index: number
  ) => {
    if (
      index < 0 ||
      index >= questions.length
    ) {
      return;
    }

    setCurrentQuestionIndex(index);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToNextQuestion = () => {
    if (
      currentQuestionIndex <
      questions.length - 1
    ) {
      goToQuestion(
        currentQuestionIndex + 1
      );
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(
        currentQuestionIndex - 1
      );
    }
  };

  /* =======================================================
     SUBMIT CONTEST
  ======================================================= */

  const handleSubmitContest = async () => {
    if (
      isSubmitting ||
      !contestId ||
      questions.length === 0
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      /*
       * Convert answer map into the backend payload.
       *
       * Example:
       *
       * {
       *   contestId: "...",
       *   answers: [
       *     {
       *       questionId: "...",
       *       answer: "A"
       *     }
       *   ]
       * }
       */

      const answerPayload = questions.map(
        (question) => {
          const questionId =
            getQuestionId(question);

          return {
            questionId,
            answer:
              answers[questionId] ?? null,
          };
        }
      );

      /*
       * IMPORTANT:
       * Replace this endpoint if your backend uses
       * a different contest submission route.
       */
      const response =
        await axiosInstance.post(
          `/solve-and-win/contests/${contestId}/submit`,
          {
            contestId,
            answers: answerPayload,
          }
        );

      console.log(
        "Contest submitted successfully:",
        response.data
      );

      setState("submitted");

      /*
       * Redirect to the contest result page.
       */
      router.push(
        `/student/solve-and-win/contests/${contestId}/result`
      );
    } catch (err: any) {
      console.error(
        "Failed to submit contest:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to submit your contest.";

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : String(message)
      );

      setIsSubmitting(false);
      setShowSubmitConfirmation(false);
    }
  };

  /* =======================================================
     SUBMITTED
  ======================================================= */

  if (state === "submitted") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Contest Submitted
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your answers have been submitted successfully.
            </p>

            <div className="mt-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (state === "loading") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Preparing Your Contest
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Loading your questions and getting everything ready...
            </p>
          </Card>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (state === "error") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Unable to Enter Contest
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "Something went wrong while preparing the contest."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                className="h-11 rounded-xl font-bold"
              >
                <Link href="/student/solve-and-win/contests">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Contests
                </Link>
              </Button>

              <Button
                type="button"
                onClick={() => window.location.reload()}
                className="h-11 rounded-xl bg-slate-900 font-bold hover:bg-blue-600"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN CBT
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ===================================================
          TOP BAR
      =================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Contest */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Trophy className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Solve & Win
                </p>

                <h1 className="truncate text-sm font-black text-slate-900 sm:text-base">
                  {contest?.title}
                </h1>
              </div>
            </div>

            {/* Timer */}
            <div
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 ${
                timerIsLow
                  ? "bg-red-50 text-red-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <Clock3 className="h-4 w-4" />

              <div className="text-right">
                <p className="hidden text-[9px] font-bold uppercase tracking-wide sm:block">
                  Time Remaining
                </p>

                <p className="font-mono text-sm font-black sm:text-base">
                  {formattedTime.minutes}:
                  {formattedTime.seconds}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-bold text-red-900">
                Something went wrong
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            QUESTION NAVIGATION
        ================================================= */}

        <Card className="mb-6 rounded-3xl border-0 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Questions
              </p>

              <p className="mt-1 text-sm font-black text-slate-900">
                {currentQuestionIndex + 1} of{" "}
                {questions.length}
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-400">
              {
                Object.keys(answers).length
              }{" "}
              answered
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {questions.map(
              (question, index) => {
                const questionId =
                  getQuestionId(question);

                const isAnswered =
                  Boolean(
                    answers[questionId]
                  );

                const isCurrent =
                  index ===
                  currentQuestionIndex;

                return (
                  <button
                    key={
                      questionId || index
                    }
                    type="button"
                    onClick={() =>
                      goToQuestion(index)
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
                      isCurrent
                        ? "bg-slate-900 text-white"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              }
            )}
          </div>
        </Card>

        {/* =================================================
            QUESTION
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <div className="p-6 sm:p-8">
                {/* Question heading */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                      Question{" "}
                      {currentQuestionIndex + 1}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Choose the best answer.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                    <Flag className="h-5 w-5 text-slate-400" />
                  </div>
                </div>

                {/* Question text */}
                <div className="mt-7">
                  <h2 className="text-xl font-bold leading-8 text-slate-900 sm:text-2xl sm:leading-9">
                    {currentQuestion?.question ||
                      currentQuestion?.text}
                  </h2>
                </div>

                {/* Options */}
                <div className="mt-8 space-y-3">
                  {(
                    currentQuestion?.options ??
                    []
                  ).map(
                    (
                      option,
                      optionIndex
                    ) => {
                      const isSelected =
                        selectedAnswer ===
                        option;

                      const letter =
                        String.fromCharCode(
                          65 +
                            optionIndex
                        );

                      return (
                        <button
                          key={`${currentQuestionId}-${optionIndex}`}
                          type="button"
                          onClick={() =>
                            handleSelectAnswer(
                              option
                            )
                          }
                          className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-blue-600 bg-blue-50"
                              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                            }`}
                          >
                            {letter}
                          </span>

                          <span
                            className={`pt-1 text-sm font-semibold leading-6 sm:text-base ${
                              isSelected
                                ? "text-blue-950"
                                : "text-slate-700"
                            }`}
                          >
                            {option}
                          </span>

                          {isSelected && (
                            <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-blue-600" />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      goToPreviousQuestion
                    }
                    disabled={
                      currentQuestionIndex ===
                        0 ||
                      isSubmitting
                    }
                    className="h-11 rounded-xl font-bold"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentQuestionIndex <
                  questions.length - 1 ? (
                    <Button
                      type="button"
                      onClick={
                        goToNextQuestion
                      }
                      disabled={isSubmitting}
                      className="h-11 rounded-xl bg-slate-900 px-6 font-bold text-white hover:bg-blue-600"
                    >
                      Next Question
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() =>
                        setShowSubmitConfirmation(
                          true
                        )
                      }
                      disabled={isSubmitting}
                      className="h-11 rounded-xl bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Contest
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* =================================================
              SIDE PANEL
          ================================================= */}

          <aside className="space-y-4">
            {/* Progress */}
            <Card className="rounded-3xl border-0 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Your Progress
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    Answered
                  </span>

                  <span className="text-sm font-black text-slate-900">
                    {
                      Object.keys(
                        answers
                      ).length
                    }{" "}
                    / {questions.length}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${
                        questions.length
                          ? (Object.keys(
                              answers
                            ).length /
                              questions.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Timer */}
            <Card
              className={`rounded-3xl border-0 p-5 shadow-sm ${
                timerIsLow
                  ? "bg-red-50"
                  : "bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    timerIsLow
                      ? "bg-white"
                      : "bg-white/10"
                  }`}
                >
                  <Clock3
                    className={`h-5 w-5 ${
                      timerIsLow
                        ? "text-red-600"
                        : "text-white"
                    }`}
                  />
                </div>

                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-wide ${
                      timerIsLow
                        ? "text-red-500"
                        : "text-slate-400"
                    }`}
                  >
                    Time Remaining
                  </p>

                  <p
                    className={`mt-1 font-mono text-2xl font-black ${
                      timerIsLow
                        ? "text-red-700"
                        : "text-white"
                    }`}
                  >
                    {formattedTime.minutes}:
                    {formattedTime.seconds}
                  </p>
                </div>
              </div>

              {timerIsLow && (
                <p className="mt-4 text-xs font-bold leading-5 text-red-700">
                  Time is almost up. Review your answers
                  and submit the contest.
                </p>
              )}
            </Card>

            {/* Submit */}
            <Card className="rounded-3xl border-0 bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-slate-900">
                Finished early?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                You can submit your answers before the
                timer reaches zero.
              </p>

              <Button
                type="button"
                onClick={() =>
                  setShowSubmitConfirmation(
                    true
                  )
                }
                disabled={isSubmitting}
                className="mt-4 w-full rounded-xl bg-slate-900 font-bold hover:bg-blue-600"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Contest
              </Button>
            </Card>
          </aside>
        </div>
      </div>

      {/* ===================================================
          SUBMIT CONFIRMATION MODAL
      =================================================== */}

      {showSubmitConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md rounded-3xl border-0 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
              {autoSubmitted ? (
                <Clock3 className="h-7 w-7 text-amber-600" />
              ) : (
                <Send className="h-7 w-7 text-amber-600" />
              )}
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              {autoSubmitted
                ? "Time Is Up"
                : "Submit Contest?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {autoSubmitted
                ? "Your contest time has ended. Submit your answers now."
                : `You have answered ${
                    Object.keys(
                      answers
                    ).length
                  } of ${
                    questions.length
                  } questions. Are you sure you want to submit?`}
            </p>

            {!autoSubmitted &&
              Object.keys(answers).length <
                questions.length && (
                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-sm font-bold text-amber-900">
                    Some questions are unanswered
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Unanswered questions will be submitted
                    without an answer.
                  </p>
                </div>
              )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {!autoSubmitted && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowSubmitConfirmation(
                      false
                    )
                  }
                  disabled={isSubmitting}
                  className="h-11 rounded-xl font-bold"
                >
                  Continue Contest
                </Button>
              )}

              <Button
                type="button"
                onClick={
                  handleSubmitContest
                }
                disabled={isSubmitting}
                className="h-11 rounded-xl bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Answers
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

