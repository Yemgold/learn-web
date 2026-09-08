



"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ============================================================
   TYPES
   ============================================================ */

type ContestOption = {
  id?: string;
  _id?: string;
  label?: string;
  text?: string;
  value?: string;
  option?: string;
};

type ContestQuestion = {
  _id?: string;
  id?: string;
  questionId?: string;

  question?: string;
  text?: string;
  instruction?: string;

  content?: unknown[];
  media?: unknown;

  options?: ContestOption[] | string[];

  questionType?: string;
  isMultipleAnswer?: boolean;

  marks?: number;

  explanation?: string;
  explanationSteps?: string[];

  selectedOption?: string | null;
  isCorrect?: boolean | null;
  marksAwarded?: number;
};

type ParticipationSubject = {
  subjectId?: string;
  questions?: ContestQuestion[];

  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;
  score?: number;

  durationInSeconds?: number;
  remainingDurationInSeconds?: number;

  startedAt?: string | null;
  endsAt?: string | null;
  submittedAt?: string | null;
};

type Participation = {
  _id?: string;
  id?: string;
  participationId?: string;

  userId?: string;
  contestId?: string;

  subjects?: ParticipationSubject[];

  questions?: ContestQuestion[];

  totalQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;

  score?: number;
  percentage?: number;
  pointsSpent?: number;

  durationInSeconds?: number;
  remainingDurationInSeconds?: number;

  status?: string;

  startedAt?: string;
  endsAt?: string;
  submittedAt?: string;
};

/* ============================================================
   GENERIC HELPERS
   ============================================================ */

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function getString(
  value: unknown
): string | null {
  return typeof value === "string"
    ? value
    : null;
}

function getNumber(
  value: unknown
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

/* ============================================================
   RESPONSE EXTRACTION
   ============================================================ */

/**
 * The backend response is intentionally treated flexibly for now.
 *
 * We will inspect the real response in the browser console
 * and tighten this structure later.
 */
function extractParticipation(
  response: unknown
): Participation | null {
  if (!isObject(response)) {
    return null;
  }

  /*
   * Possible:
   *
   * {
   *   participation: {...}
   * }
   */
  if (
    isObject(response.participation)
  ) {
    return response.participation as Participation;
  }

  /*
   * Possible:
   *
   * {
   *   data: {
   *     participation: {...}
   *   }
   * }
   */
  if (
    isObject(response.data) &&
    isObject(response.data.participation)
  ) {
    return response.data.participation as Participation;
  }

  /*
   * Possible:
   *
   * {
   *   data: {...participation}
   * }
   */
  if (
    isObject(response.data)
  ) {
    const data =
      response.data as Record<
        string,
        unknown
      >;

    if (
      data.subjects ||
      data.questions ||
      data.contestId ||
      data.participationId ||
      data._id
    ) {
      return data as Participation;
    }
  }

  /*
   * Possible direct participation object.
   */
  if (
    response.subjects ||
    response.questions ||
    response.contestId ||
    response.participationId
  ) {
    return response as Participation;
  }

  return null;
}

/* ============================================================
   QUESTION EXTRACTION
   ============================================================ */

function extractQuestions(
  participation: Participation | null
): ContestQuestion[] {
  if (!participation) {
    return [];
  }

  /*
   * Direct questions.
   */
  if (
    Array.isArray(
      participation.questions
    )
  ) {
    return participation.questions;
  }

  /*
   * Questions nested inside subjects.
   */
  if (
    Array.isArray(
      participation.subjects
    )
  ) {
    return participation.subjects.flatMap(
      (subject) =>
        Array.isArray(subject.questions)
          ? subject.questions
          : []
    );
  }

  return [];
}

/* ============================================================
   OPTION HELPERS
   ============================================================ */

function getQuestionText(
  question: ContestQuestion
): string {
  return (
    question.question ??
    question.text ??
    "Question unavailable"
  );
}

function getQuestionId(
  question: ContestQuestion,
  index: number
): string {
  return (
    question._id ??
    question.id ??
    question.questionId ??
    `question-${index}`
  );
}

function getOptionLabel(
  option: ContestOption | string,
  index: number
): string {
  if (typeof option === "string") {
    return option;
  }

  return (
    option.label ??
    option.text ??
    option.value ??
    option.option ??
    `Option ${index + 1}`
  );
}

function getOptionId(
  option: ContestOption | string,
  index: number
): string {
  if (typeof option === "string") {
    return option;
  }

  return (
    option._id ??
    option.id ??
    option.value ??
    `option-${index}`
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function SolveAndWinPlayPage() {
  const params = useParams();
  const router = useRouter();

  const contestId =
    params?.contestId as
      | string
      | undefined;

  const [participation, setParticipation] =
    useState<Participation | null>(null);

  const [questions, setQuestions] =
    useState<ContestQuestion[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [timeRemaining, setTimeRemaining] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  /* ==========================================================
     LOAD START RESPONSE
     ========================================================== */

  useEffect(() => {
    if (!contestId) {
      setError(
        "Contest information could not be found."
      );

      setIsLoading(false);

      return;
    }

    try {
      const storageKey =
        `solve-and-win-start-${contestId}`;

      const stored =
        sessionStorage.getItem(
          storageKey
        );

      if (!stored) {
        setError(
          "Your contest session could not be found. Please return to the contest and start again."
        );

        setIsLoading(false);

        return;
      }

      const parsed: unknown =
        JSON.parse(stored);

      /*
       * IMPORTANT:
       *
       * This lets us see exactly what the backend
       * returned without assuming the response shape.
       */
      console.log(
        "Stored Solve & Win start response:",
        parsed
      );

      const extracted =
        extractParticipation(parsed);

      console.log(
        "Extracted participation:",
        extracted
      );

      if (!extracted) {
        setError(
          "The contest session was created, but the response format could not be understood yet."
        );

        setIsLoading(false);

        return;
      }

      const extractedQuestions =
        extractQuestions(extracted);

      console.log(
        "Extracted contest questions:",
        extractedQuestions
      );

      setParticipation(
        extracted
      );

      setQuestions(
        extractedQuestions
      );

      /*
       * Determine initial timer.
       */
      const remaining =
        getNumber(
          extracted.remainingDurationInSeconds
        );

      if (remaining !== null) {
        setTimeRemaining(
          remaining
        );
      } else {
        const firstSubject =
          extracted.subjects?.[0];

        const subjectRemaining =
          getNumber(
            firstSubject?.remainingDurationInSeconds
          );

        const subjectDuration =
          getNumber(
            firstSubject?.durationInSeconds
          );

        setTimeRemaining(
          subjectRemaining ??
            subjectDuration
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error(
        "Failed to load contest session:",
        err
      );

      setError(
        "Unable to load your contest session. Please return and start the contest again."
      );

      setIsLoading(false);
    }
  }, [contestId]);

  /* ==========================================================
     TIMER
     ========================================================== */

  useEffect(() => {
    if (
      timeRemaining === null ||
      isSubmitted
    ) {
      return;
    }

    if (timeRemaining <= 0) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setTimeRemaining(
          (previous) => {
            if (
              previous === null ||
              previous <= 1
            ) {
              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    timeRemaining,
    isSubmitted,
  ]);

  /* ==========================================================
     CURRENT QUESTION
     ========================================================== */

  const currentQuestion =
    questions[
      currentQuestionIndex
    ];

  const currentQuestionId =
    currentQuestion
      ? getQuestionId(
          currentQuestion,
          currentQuestionIndex
        )
      : null;

  const currentOptions =
    currentQuestion &&
    Array.isArray(
      currentQuestion.options
    )
      ? currentQuestion.options
      : [];

  /* ==========================================================
     QUESTION PROGRESS
     ========================================================== */

  const answeredCount =
    Object.keys(answers).length;

  const progressPercentage =
    questions.length > 0
      ? Math.round(
          ((currentQuestionIndex + 1) /
            questions.length) *
            100
        )
      : 0;

  /* ==========================================================
     TIMER DISPLAY
     ========================================================== */

  const timerDisplay =
    useMemo(() => {
      if (
        timeRemaining === null
      ) {
        return "--:--";
      }

      const minutes =
        Math.floor(
          timeRemaining / 60
        );

      const seconds =
        timeRemaining % 60;

      return `${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }, [timeRemaining]);

  /* ==========================================================
     SELECT ANSWER
     ========================================================== */

  const handleSelectAnswer = (
    optionId: string
  ) => {
    if (
      !currentQuestionId ||
      isSubmitted
    ) {
      return;
    }

    setAnswers(
      (previous) => ({
        ...previous,
        [currentQuestionId]:
          optionId,
      })
    );
  };

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(
      (previous) =>
        Math.max(
          0,
          previous - 1
        )
    );
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex(
      (previous) =>
        Math.min(
          questions.length - 1,
          previous + 1
        )
    );
  };

  /* ==========================================================
     SUBMIT
     ========================================================== */

  const handleSubmit = async () => {
    if (
      isSubmitting ||
      isSubmitted
    ) {
      return;
    }

    /*
     * For now we deliberately do not guess the
     * submission endpoint.
     *
     * We already have the student's selected
     * answers in state.
     *
     * Once the actual backend submit endpoint
     * is confirmed, we will connect this function.
     */
    console.log(
      "Solve & Win submission payload:",
      {
        contestId,
        participation,
        answers,
      }
    );

    setIsSubmitting(true);

    /*
     * Temporary frontend behavior.
     *
     * Replace with the real backend submission
     * call once the endpoint is confirmed.
     */
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  /* ==========================================================
     LOADING
     ========================================================== */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Loading Contest
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Preparing your questions...
            </p>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Unable to Load Contest
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/student/solve-and-win/contests/${contestId}/start`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Start
              </Link>

              <Link
                href="/student/solve-and-win"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Contests
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     NO QUESTIONS
     ========================================================== */

  if (
    !questions.length &&
    !isSubmitted
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
              <AlertCircle className="h-7 w-7 text-amber-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              No Questions Available
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The contest session was created, but
              no questions were returned yet.
            </p>

            <p className="mt-4 text-xs text-slate-400">
              Check the browser console for the
              actual backend response.
            </p>

            <Link
              href={`/student/solve-and-win/contests/${contestId}/start`}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Contest
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     SUBMITTED
     ========================================================== */

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-widest text-emerald-600">
              Contest Submitted
            </p>

            <h1 className="mt-2 text-2xl font-black text-slate-900">
              Your answers have been recorded
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your contest result will be processed by
              the competition system.
            </p>

            <Link
              href="/student/solve-and-win"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <Trophy className="h-4 w-4" />
              Back to Solve & Win
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     MAIN CBT
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        {/* =====================================================
            TOP BAR
           ===================================================== */}

        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Trophy className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Solve & Win
              </p>

              <h1 className="text-sm font-black text-slate-900 sm:text-base">
                Contest
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Progress
              </p>

              <p className="text-sm font-black text-slate-900">
                {answeredCount} / {questions.length}
              </p>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-2 ${
                timeRemaining !== null &&
                timeRemaining <= 60
                  ? "bg-red-50 text-red-700"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              <Clock3 className="h-4 w-4" />

              <span className="font-mono text-sm font-black">
                {timerDisplay}
              </span>
            </div>

          </div>
        </div>

        {/* =====================================================
            PROGRESS
           ===================================================== */}

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">
              Question{" "}
              {currentQuestionIndex + 1}{" "}
              of {questions.length}
            </span>

            <span className="font-black text-slate-700">
              {progressPercentage}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* =====================================================
            CBT LAYOUT
           ===================================================== */}

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">

          {/* ===================================================
              QUESTION
             =================================================== */}

          <Card className="rounded-3xl border-0 bg-white shadow-sm">

            <div className="p-6 sm:p-8">

              {/* Question header */}
              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    Question{" "}
                    {currentQuestionIndex + 1}
                  </p>

                  {currentQuestion?.instruction && (
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {currentQuestion.instruction}
                    </p>
                  )}
                </div>

                {currentQuestion?.marks !==
                  undefined && (
                  <div className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                    {currentQuestion.marks}{" "}
                    {currentQuestion.marks === 1
                      ? "mark"
                      : "marks"}
                  </div>
                )}

              </div>

              {/* Question text */}
              <div className="mt-6">
                <h2 className="text-lg font-bold leading-8 text-slate-900 sm:text-xl">
                  {currentQuestion
                    ? getQuestionText(
                        currentQuestion
                      )
                    : "Question unavailable"}
                </h2>
              </div>

              {/* Options */}
              <div className="mt-7 space-y-3">

                {currentOptions.map(
                  (
                    option,
                    optionIndex
                  ) => {
                    const optionId =
                      getOptionId(
                        option,
                        optionIndex
                      );

                    const optionLabel =
                      getOptionLabel(
                        option,
                        optionIndex
                      );

                    const selected =
                      currentQuestionId
                        ? answers[
                            currentQuestionId
                          ] === optionId
                        : false;

                    return (
                      <button
                        key={optionId}
                        type="button"
                        onClick={() =>
                          handleSelectAnswer(
                            optionId
                          )
                        }
                        className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                            : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                            selected
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(
                            65 +
                              optionIndex
                          )}
                        </span>

                        <span
                          className={`pt-1 text-sm font-semibold leading-6 ${
                            selected
                              ? "text-emerald-900"
                              : "text-slate-700"
                          }`}
                        >
                          {optionLabel}
                        </span>
                      </button>
                    );
                  }
                )}

              </div>

              {/* Navigation */}
              <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    goToPreviousQuestion
                  }
                  disabled={
                    currentQuestionIndex ===
                    0
                  }
                  className="h-11 rounded-xl font-bold"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentQuestionIndex <
                questions.length - 1 ? (
                  <Button
                    type="button"
                    onClick={
                      goToNextQuestion
                    }
                    className="h-11 rounded-xl bg-slate-900 px-6 font-bold text-white hover:bg-slate-800"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={
                      handleSubmit
                    }
                    disabled={
                      isSubmitting
                    }
                    className="h-11 rounded-xl bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Flag className="mr-2 h-4 w-4" />
                        Submit Contest
                      </>
                    )}
                  </Button>
                )}

              </div>

            </div>
          </Card>

          {/* ===================================================
              QUESTION NAVIGATOR
             =================================================== */}

          <div className="lg:sticky lg:top-5 lg:self-start">

            <Card className="rounded-3xl border-0 bg-white shadow-sm">

              <div className="p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Questions
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {answeredCount} answered
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                    <span className="text-xs font-black text-slate-600">
                      {questions.length}
                    </span>
                  </div>

                </div>

                <div className="mt-5 grid grid-cols-5 gap-2">
                  {questions.map(
                    (
                      question,
                      index
                    ) => {
                      const questionId =
                        getQuestionId(
                          question,
                          index
                        );

                      const answered =
                        Boolean(
                          answers[
                            questionId
                          ]
                        );

                      const active =
                        index ===
                        currentQuestionIndex;

                      return (
                        <button
                          key={questionId}
                          type="button"
                          onClick={() =>
                            setCurrentQuestionIndex(
                              index
                            )
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black transition ${
                            active
                              ? "bg-emerald-600 text-white ring-2 ring-emerald-200"
                              : answered
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-3 w-3 rounded bg-emerald-600" />
                    Current
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-3 w-3 rounded bg-emerald-100" />
                    Answered
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-3 w-3 rounded bg-slate-100" />
                    Unanswered
                  </div>

                </div>

              </div>
            </Card>

            {/* Participation information */}
            <Card className="mt-4 rounded-3xl border-0 bg-white shadow-sm">

              <div className="p-5">

                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Contest Session
                </p>

                <div className="mt-4 space-y-3">

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Questions
                    </span>

                    <span className="text-xs font-black text-slate-900">
                      {questions.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Answered
                    </span>

                    <span className="text-xs font-black text-emerald-600">
                      {answeredCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Remaining
                    </span>

                    <span className="text-xs font-black text-slate-900">
                      {Math.max(
                        0,
                        questions.length -
                          answeredCount
                      )}
                    </span>
                  </div>

                </div>

              </div>
            </Card>

          </div>
        </div>

      </div>
    </main>
  );
}
