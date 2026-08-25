"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  RotateCcw,
} from "lucide-react";

import {
  useCbtStore,
  selectCurrentQuestion,
  selectCurrentSubject,
} from "@/stores/cbtStore";

import CbtHeader from "@/components/cbt/CbtHeader";
import CbtSubjectTabs from "@/components/cbt/CbtSubjectTabs";
import CbtQuestionNavigator from "@/components/cbt/CbtQuestionNavigator";
import CbtQuestionCard from "@/components/cbt/CbtQuestionCard";
import CbtNavigation from "@/components/cbt/CbtNavigation";
import CbtSubmitDialog from "@/components/cbt/CbtSubmitDialog";
import CbtExamSummary from "@/components/cbt/CbtExamSummary";

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Creates a frontend-only ID.
 *
 * This is NOT a backend session ID.
 * It is only used to identify this local
 * practice attempt.
 */
function createLocalSessionId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `cbt-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}








/* ============================================================
   ANSWER NORMALIZATION
   ============================================================ */

function normalizeAnswer(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase();

  return normalized || null;
}

/* ============================================================
   GET CORRECT ANSWER
   ============================================================ */

function getCorrectAnswer(
  question: Record<string, unknown>,
): string | null {
  /*
   * Your backend currently provides:
   *
   * answer: "c"
   *
   * and:
   *
   * correctAnswers: ["c"]
   */

  const answer = normalizeAnswer(
    question.answer,
  );

  if (answer) {
    return answer;
  }

  if (
    Array.isArray(
      question.correctAnswers,
    )
  ) {
    for (
      const value of question.correctAnswers
    ) {
      const normalized =
        normalizeAnswer(value);

      if (normalized) {
        return normalized;
      }
    }
  }

  /*
   * Other possible backend fields.
   */

  const correctAnswer =
    normalizeAnswer(
      question.correctAnswer,
    );

  if (correctAnswer) {
    return correctAnswer;
  }

  const correctOption =
    normalizeAnswer(
      question.correctOption,
    );

  if (correctOption) {
    return correctOption;
  }

  const correct =
    normalizeAnswer(
      question.correct,
    );

  if (correct) {
    return correct;
  }

  return null;
}

/* ============================================================
   CONVERT STUDENT ANSWER TO OPTION LABEL
   ============================================================ */

/**
 * The CBT UI may store either:
 *
 *   "c"
 *
 * OR:
 *
 *   "are"
 *
 * For example:
 *
 * options: [
 *   { label: "a", value: "is" },
 *   { label: "b", value: "was" },
 *   { label: "c", value: "are" },
 *   { label: "d", value: "be" }
 * ]
 *
 * Backend answer:
 *
 *   "c"
 *
 * Student answer:
 *
 *   "are"
 *
 * This function converts "are" -> "c".
 */
function getStudentAnswerLabel(
  question: Record<string, unknown>,
  studentAnswer: unknown,
): string | null {
  const normalizedStudentAnswer =
    normalizeAnswer(
      studentAnswer,
    );

  if (!normalizedStudentAnswer) {
    return null;
  }

  /*
   * ----------------------------------------------------------
   * CASE 1
   *
   * Student answer is already the option label.
   *
   * Example:
   *
   * "c"
   * ----------------------------------------------------------
   */

  const options = question.options;

  if (
    Array.isArray(options)
  ) {
    for (
      const option of options
    ) {
      if (
        !option ||
        typeof option !== "object"
      ) {
        continue;
      }

      const optionRecord =
        option as Record<
          string,
          unknown
        >;

      const label =
        normalizeAnswer(
          optionRecord.label,
        );

      if (
        label ===
        normalizedStudentAnswer
      ) {
        return label;
      }
    }
  }

  /*
   * ----------------------------------------------------------
   * CASE 2
   *
   * Student answer is the option value.
   *
   * Example:
   *
   * "are"
   *
   * becomes:
   *
   * "c"
   * ----------------------------------------------------------
   */

  if (
    Array.isArray(options)
  ) {
    for (
      const option of options
    ) {
      if (
        !option ||
        typeof option !== "object"
      ) {
        continue;
      }

      const optionRecord =
        option as Record<
          string,
          unknown
        >;

      const label =
        normalizeAnswer(
          optionRecord.label,
        );

      const value =
        normalizeAnswer(
          optionRecord.value,
        );

      if (
        value &&
        value ===
          normalizedStudentAnswer
      ) {
        return label;
      }
    }
  }

  /*
   * ----------------------------------------------------------
   * CASE 3
   *
   * We couldn't map it.
   *
   * Return the normalized value so
   * the caller can still compare it.
   * ----------------------------------------------------------
   */

  return normalizedStudentAnswer;
}

/* ============================================================
   CALCULATE LOCAL RESULT
   ============================================================ */

function calculateLocalResult(
  questions: Array<
    Record<string, unknown>
  >,
  answers: Record<string, string>,
) {
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredQuestions = 0;

  let totalScore = 0;
  let maximumScore = 0;



  /*
   * ==========================================================
   * LOOP THROUGH QUESTIONS
   * ==========================================================
   */

  for (
    let index = 0;
    index < questions.length;
    index++
  ) {
    const question =
      questions[index];

    /*
     * --------------------------------------------------------
     * QUESTION ID
     * --------------------------------------------------------
     */

    const questionId =
      typeof question._id === "string"
        ? question._id
        : "";

    /*
     * --------------------------------------------------------
     * MARKS
     * --------------------------------------------------------
     */

    const rawMarks =
      Number(
        question.marks,
      );

    const marks =
      Number.isFinite(
        rawMarks,
      ) &&
      rawMarks > 0
        ? rawMarks
        : 1;

    maximumScore += marks;

    /*
     * --------------------------------------------------------
     * RAW STUDENT ANSWER
     * --------------------------------------------------------
     */

    const rawStudentAnswer =
      questionId
        ? answers[
            questionId
          ]
        : undefined;

    /*
     * --------------------------------------------------------
     * NORMALIZED STUDENT ANSWER
     *
     * IMPORTANT:
     *
     * This converts:
     *
     * "are"
     *
     * into:
     *
     * "c"
     *
     * when:
     *
     * { label: "c", value: "are" }
     * --------------------------------------------------------
     */

    const studentAnswer =
      getStudentAnswerLabel(
        question,
        rawStudentAnswer,
      );

    /*
     * --------------------------------------------------------
     * CORRECT ANSWER
     * --------------------------------------------------------
     */

    const correctAnswer =
      getCorrectAnswer(
        question,
      );


    /*
     * --------------------------------------------------------
     * UNANSWERED
     * --------------------------------------------------------
     */

    if (!studentAnswer) {
      unansweredQuestions += 1;

      continue;
    }

    /*
     * --------------------------------------------------------
     * NO CORRECT ANSWER
     * --------------------------------------------------------
     */

    if (!correctAnswer) {
      incorrectAnswers += 1;

      console.warn(
        `QUESTION ${index + 1}: NO CORRECT ANSWER FOUND`,
        question,
      );

      continue;
    }

    /*
     * --------------------------------------------------------
     * COMPARE
     * --------------------------------------------------------
     *
     * Example:
     *
     * rawStudentAnswer = "are"
     *
     * studentAnswer = "c"
     *
     * correctAnswer = "c"
     *
     * RESULT:
     *
     * CORRECT
     * --------------------------------------------------------
     */

    if (
      studentAnswer ===
      correctAnswer
    ) {
      correctAnswers += 1;

      totalScore += marks;

  
    } else {
      incorrectAnswers += 1;

    }
  }

  /*
   * ==========================================================
   * FINAL CALCULATIONS
   * ==========================================================
   */

  const totalQuestions =
    questions.length;

  const percentage =
    maximumScore > 0
      ? Math.round(
          (totalScore /
            maximumScore) *
            100,
        )
      : 0;

  const grade =
    percentage >= 70
      ? "A"
      : percentage >= 60
        ? "B"
        : percentage >= 50
          ? "C"
          : percentage >= 45
            ? "D"
            : "F";

  const result = {
    totalQuestions,

    correctAnswers,

    incorrectAnswers,

    unansweredQuestions,

    score: totalScore,

    totalScore: maximumScore,

    percentage,

    passed:
      percentage >= 50,

    grade,

    submittedAt:
      new Date().toISOString(),
  };


  return result;
}











/* ============================================================
   PAGE
   ============================================================ */

export default function CbtSessionPage() {
  const router = useRouter();

  /* ==========================================================
     CURRENT QUESTION / SUBJECT
     ========================================================== */

  const currentQuestion =
    useCbtStore(
      selectCurrentQuestion,
    );

  const currentSubject =
    useCbtStore(
      selectCurrentSubject,
    );

  /* ==========================================================
     EXAM STATE
     ========================================================== */

  const sessionId =
    useCbtStore(
      (state) => state.sessionId,
    );

  const sessionStatus =
    useCbtStore(
      (state) => state.sessionStatus,
    );

  const sessionError =
    useCbtStore(
      (state) => state.sessionError,
    );

  const result =
    useCbtStore(
      (state) => state.result,
    );

  const subjects =
    useCbtStore(
      (state) => state.subjects,
    );

  const questions =
    useCbtStore(
      (state) => state.questions,
    );

  const currentSubjectIndex =
    useCbtStore(
      (state) =>
        state.currentSubjectIndex,
    );

  const currentQuestionIndex =
    useCbtStore(
      (state) =>
        state.currentQuestionIndex,
    );

  const answers =
    useCbtStore(
      (state) => state.answers,
    );

  const flaggedQuestions =
    useCbtStore(
      (state) =>
        state.flaggedQuestions,
    );

  const isStarted =
    useCbtStore(
      (state) => state.isStarted,
    );

  const isSubmitted =
    useCbtStore(
      (state) => state.isSubmitted,
    );

  const durationInMinutes =
    useCbtStore(
      (state) =>
        state.durationInMinutes,
    );

  const timeRemainingSeconds =
    useCbtStore(
      (state) =>
        state.timeRemainingSeconds,
    );

  /* ==========================================================
     STORE ACTIONS
     ========================================================== */

  const setSessionId =
    useCbtStore(
      (state) => state.setSessionId,
    );

  const startExam =
    useCbtStore(
      (state) => state.startExam,
    );

  const markSessionCompleted =
    useCbtStore(
      (state) =>
        state.markSessionCompleted,
    );

  const markSessionFailed =
    useCbtStore(
      (state) =>
        state.markSessionFailed,
    );

  const setResult =
    useCbtStore(
      (state) => state.setResult,
    );

  const setCurrentQuestion =
    useCbtStore(
      (state) =>
        state.setCurrentQuestion,
    );

  const setCurrentSubject =
    useCbtStore(
      (state) =>
        state.setCurrentSubject,
    );

  const nextQuestion =
    useCbtStore(
      (state) =>
        state.nextQuestion,
    );

  const previousQuestion =
    useCbtStore(
      (state) =>
        state.previousQuestion,
    );

  const selectAnswer =
    useCbtStore(
      (state) =>
        state.selectAnswer,
    );

  const toggleFlag =
    useCbtStore(
      (state) =>
        state.toggleFlag,
    );

  const setTimeRemaining =
    useCbtStore(
      (state) =>
        state.setTimeRemaining,
    );

  const resetSession =
    useCbtStore(
      (state) =>
        state.resetSession,
    );

  /* ==========================================================
     LOCAL UI STATE
     ========================================================== */

  const [
    showNavigator,
    setShowNavigator,
  ] = useState(false);

  const [
    showSubmitDialog,
    setShowSubmitDialog,
  ] = useState(false);

  const [
    showSummary,
    setShowSummary,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [timeUp, setTimeUp] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  /* ==========================================================
     BASIC STATE
     ========================================================== */

  const hasQuestions =
    Array.isArray(questions) &&
    questions.length > 0;

  /* ==========================================================
     ANSWERED COUNT
     ========================================================== */

  const answeredCount =
    useMemo(() => {
      return Object.values(
        answers ?? {},
      ).filter(
        (answer) =>
          answer !== undefined &&
          answer !== null &&
          answer !== "",
      ).length;
    }, [answers]);

  /* ==========================================================
     UNANSWERED COUNT
     ========================================================== */

  const unansweredCount =
    Math.max(
      questions.length -
        answeredCount,
      0,
    );

  /* ==========================================================
     FLAGGED COUNT
     ========================================================== */

  const flaggedCount =
    Array.isArray(
      flaggedQuestions,
    )
      ? flaggedQuestions.length
      : 0;

  /* ==========================================================
     CURRENT ANSWER
     ========================================================== */

  const currentAnswer =
    currentQuestion
      ? answers[
          currentQuestion._id
        ]
      : undefined;

  /* ==========================================================
     INITIALIZE LOCAL EXAM
     ========================================================== */

  const initializeExam =
    useCallback(() => {
      /*
       * No questions means there is
       * nothing to start.
       */
      if (!hasQuestions) {
        return;
      }

      /*
       * Completed exam must not be
       * automatically restarted.
       */
      if (isSubmitted) {
        setInitialized(true);
        return;
      }

      /*
       * Existing active practice.
       *
       * This happens when the student
       * refreshes the browser.
       *
       * Do NOT reset anything.
       */
      if (isStarted) {
        setInitialized(true);
        return;
      }

      /*
       * Create a local ID only if one
       * does not already exist.
       */
      if (!sessionId) {
        setSessionId(
          createLocalSessionId(),
        );
      }

      /*
       * Start the exam using the
       * existing questions and timer.
       */
      startExam();

      setInitialized(true);
    }, [
      hasQuestions,
      isSubmitted,
      isStarted,
      sessionId,
      setSessionId,
      startExam,
    ]);

  /* ==========================================================
     INITIALIZE
     ========================================================== */

  useEffect(() => {
    initializeExam();
  }, [initializeExam]);

  /* ==========================================================
     TIMER
     ========================================================== */

  useEffect(() => {
    if (
      !isStarted ||
      isSubmitted
    ) {
      return;
    }

    /*
     * Time has already reached zero.
     */
    if (
      timeRemainingSeconds <= 0
    ) {
      setTimeUp(true);
      setShowSubmitDialog(true);
      return;
    }

    const interval =
      window.setInterval(() => {
        const state =
          useCbtStore.getState();

        const currentTime =
          state.timeRemainingSeconds;

        if (currentTime <= 1) {
          setTimeRemaining(0);

          setTimeUp(true);

          setShowSubmitDialog(
            true,
          );

          window.clearInterval(
            interval,
          );

          return;
        }

        setTimeRemaining(
          currentTime - 1,
        );
      }, 1000);

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    isStarted,
    isSubmitted,
    timeRemainingSeconds,
    setTimeRemaining,
  ]);

  /* ==========================================================
     SUBJECT TABS
     ========================================================== */

  const subjectTabs = useMemo(() => {
    return subjects.map(
      (subject, index) => {
        const subjectQuestions =
          questions.filter(
            (question) =>
              question.subjectId ===
              subject._id,
          );

        const subjectQuestionIds =
          new Set(
            subjectQuestions.map(
              (question) =>
                question._id,
            ),
          );

        const answered =
          Object.keys(
            answers ?? {},
          ).filter(
            (questionId) =>
              subjectQuestionIds.has(
                questionId,
              ) &&
              answers[
                questionId
              ] !== undefined &&
              answers[
                questionId
              ] !== null &&
              answers[
                questionId
              ] !== "",
          ).length;

        return {
          id: subject._id,
          name: subject.name,
          answered,
          total:
            subjectQuestions.length,
          index,
        };
      },
    );
  }, [
    subjects,
    questions,
    answers,
  ]);

  /* ==========================================================
     HANDLE SUBJECT SELECT
     ========================================================== */

  const handleSelectSubject = (
    subjectId: string,
  ) => {
    if (
      !isStarted ||
      isSubmitted
    ) {
      return;
    }

    const subjectIndex =
      subjects.findIndex(
        (subject) =>
          subject._id ===
          subjectId,
      );

    if (subjectIndex === -1) {
      return;
    }

    const firstQuestionIndex =
      questions.findIndex(
        (question) =>
          question.subjectId ===
          subjectId,
      );

    if (firstQuestionIndex === -1) {
      return;
    }

    setCurrentSubject(
      subjectIndex,
    );

    setCurrentQuestion(
      firstQuestionIndex,
    );
  };

  /* ==========================================================
     HANDLE ANSWER
     ========================================================== */

  const handleAnswer = (
    answer: string,
  ) => {
    if (
      !currentQuestion ||
      !isStarted ||
      isSubmitted
    ) {
      return;
    }

    /*
     * FRONTEND ONLY.
     *
     * No API call.
     */
    selectAnswer(
      currentQuestion._id,
      answer,
    );
  };

  /* ==========================================================
     HANDLE QUESTION SELECT
     ========================================================== */

  const handleQuestionSelect = (
    index: number,
  ) => {
    if (
      !isStarted ||
      isSubmitted
    ) {
      return;
    }

    setCurrentQuestion(index);

    setShowNavigator(false);
  };

  /* ==========================================================
     HANDLE NEXT
     ========================================================== */

  const handleNext = () => {
    if (
      !isStarted ||
      isSubmitted
    ) {
      return;
    }

    nextQuestion();
  };

  /* ==========================================================
     HANDLE PREVIOUS
     ========================================================== */

  const handlePrevious = () => {
    if (
      !isStarted ||
      isSubmitted
    ) {
      return;
    }

    previousQuestion();
  };

  /* ==========================================================
     HANDLE FLAG
     ========================================================== */

  const handleToggleFlag = () => {
    if (
      !currentQuestion ||
      !isStarted ||
      isSubmitted
    ) {
      return;
    }

    toggleFlag(
      currentQuestion._id,
    );
  };

  /* ==========================================================
     CURRENT QUESTION FLAGGED
     ========================================================== */

  const isCurrentQuestionFlagged =
    currentQuestion
      ? flaggedQuestions.includes(
          currentQuestion._id,
        )
      : false;

  /* ==========================================================
     HANDLE SUBMIT
     ========================================================== */

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    if (isSubmitted) {
      return;
    }

    if (!hasQuestions) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Calculate result locally.
       *
       * ZERO backend calls.
       */
      const questionRecords =
        questions as unknown as Array<
          Record<string, unknown>
        >;

      const localResult =
        calculateLocalResult(
          questionRecords,
          answers,
        );

      const finalResult = {
        ...localResult,

        /*
         * Keep local session ID
         * only as an identifier.
         */
        sessionId:
          sessionId ?? null,

        /*
         * Useful for result/review UI.
         */
        durationInMinutes,
      };

      /*
       * Save result in Zustand.
       */
      setResult(
        finalResult,
      );

      /*
       * Mark local exam as completed.
       */
      markSessionCompleted(
        finalResult,
      );

      setShowSubmitDialog(
        false,
      );

      setTimeUp(false);

      /*
       * Show result immediately.
       */
      setShowSummary(true);
    } catch (error) {
      console.error(
        "Failed to calculate local CBT result:",
        error,
      );

      markSessionFailed(
        error instanceof Error
          ? error.message
          : "Failed to calculate CBT result.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================
     HANDLE TIME UP
     ========================================================== */

  const handleTimeUp = () => {
    if (
      isSubmitted
    ) {
      return;
    }

    setTimeUp(true);

    setShowSubmitDialog(true);
  };

  /* ==========================================================
     HANDLE EXIT
     ========================================================== */

  const handleExit = () => {
    resetSession();

    router.push(
      "/student/practice",
    );
  };

  /* ==========================================================
     NO QUESTIONS
     ========================================================== */

  if (!hasQuestions) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertCircle className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              No Practice Questions
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              We could not find any
              questions for this practice.
              Please go back and start a
              new practice.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/student/practice",
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4" />
              Back to Practice
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     INITIALIZATION
     ========================================================== */

  if (
    !initialized
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>

          <h1 className="mt-5 text-xl font-black text-slate-900">
            Preparing your practice
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Preparing your questions...
          </p>
        </div>
      </main>
    );
  }

  /* ==========================================================
     SESSION ERROR
     ========================================================== */

  if (
    sessionStatus === "failed" &&
    !isStarted &&
    !isSubmitted
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Unable to start practice
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {sessionError ??
              "Something went wrong while preparing your practice."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                resetSession();
                router.push(
                  "/student/practice",
                );
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4" />
              Back to Practice
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     EXAM SUMMARY
     ========================================================== */

  if (
    isSubmitted &&
    showSummary
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
        <CbtExamSummary
  totalQuestions={
    result?.totalQuestions ??
    questions.length
  }

  answeredQuestions={
    result?.totalQuestions !== undefined
      ? Math.max(
          0,
          (result.totalQuestions ??
            questions.length) -
            (result.unansweredQuestions ??
              unansweredCount),
        )
      : answeredCount
  }

  unansweredQuestions={
    result?.unansweredQuestions ??
    unansweredCount
  }

  flaggedQuestions={
    flaggedCount
  }

  correctAnswers={
    result?.correctAnswers ?? 0
  }

  score={
    result?.score ?? 0
  }

  percentage={
    result?.percentage ?? 0
  }
/>

          {/* ==================================================
              LOCAL RESULT
             ================================================== */}

          {result && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {result.score !==
                  undefined && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Score
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {result.score}
                      {result.totalScore !==
                        undefined &&
                        ` / ${result.totalScore}`}
                    </p>
                  </div>
                )}

                {result.percentage !==
                  undefined && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Percentage
                    </p>

                    <p className="mt-1 text-2xl font-black text-blue-600">
                      {result.percentage}%
                    </p>
                  </div>
                )}

                {result.correctAnswers !==
                  undefined && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Correct
                    </p>

                    <p className="mt-1 text-2xl font-black text-green-600">
                      {result.correctAnswers}
                    </p>
                  </div>
                )}

                {result.grade && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Grade
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {result.grade}
                    </p>
                  </div>
                )}
              </div>

              {result.passed !==
                undefined && (
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-5">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      result.passed
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />

                  <span className="text-sm font-bold text-slate-700">
                    {result.passed
                      ? "You passed this practice."
                      : "You did not pass this practice."}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                resetSession();

                router.push(
                  "/student/practice",
                );
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4" />
              Back to Practice
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     MAIN CBT
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-100">
      {/* ======================================================
          HEADER
         ====================================================== */}

      <CbtHeader
        subjectName={
          currentSubject?.name ??
          "Practice Examination"
        }
        questionNumber={
          currentQuestionIndex + 1
        }
        totalQuestions={
          questions.length
        }
        durationInMinutes={
          durationInMinutes
        }
        timeRemainingSeconds={
          timeRemainingSeconds
        }
        onTimeUp={
          handleTimeUp
        }
        onSubmit={() =>
          setShowSubmitDialog(true)
        }
        onExit={
          handleExit
        }
      />

      {/* ======================================================
          LOCAL STATUS
         ====================================================== */}

      {isStarted && (
        <div className="border-b border-green-100 bg-green-50">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-bold text-green-700">
            <span>
              Practice in progress
            </span>

            <span className="hidden sm:inline">
              Your answers are saved
              locally
            </span>
          </div>
        </div>
      )}

      {/* ======================================================
          SUBJECT TABS
         ====================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <CbtSubjectTabs
            subjects={subjectTabs}
            activeSubjectId={
              currentSubject?._id ??
              ""
            }
            onSelectSubject={
              handleSelectSubject
            }
          />
        </div>
      </div>

      {/* ======================================================
          MOBILE NAVIGATOR
         ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-4 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setShowNavigator(
              (value) => !value,
            )
          }
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm"
        >
          <span>
            Question{" "}
            {currentQuestionIndex +
              1}{" "}
            of {questions.length}
          </span>

          <span className="text-blue-600">
            {answeredCount}/
            {questions.length}{" "}
            answered
          </span>
        </button>
      </div>

      {/* ======================================================
          MAIN CONTENT
         ====================================================== */}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* ====================================================
            QUESTION NAVIGATOR
           ==================================================== */}

        <aside
          className={[
            "lg:block",
            showNavigator
              ? "block"
              : "hidden",
          ].join(" ")}
        >
          <div className="sticky top-20">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <CbtQuestionNavigator
                questionIds={questions.map(
                  (question) =>
                    question._id,
                )}
                currentQuestionIndex={
                  currentQuestionIndex
                }
                answers={answers}
                flaggedQuestions={
                  flaggedQuestions
                }
                onSelectQuestion={
                  handleQuestionSelect
                }
              />
            </div>

            {/* =================================================
                PROGRESS
               ================================================= */}

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black text-slate-900">
                Progress
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Answered
                  </span>

                  <span className="font-bold text-green-600">
                    {answeredCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Unanswered
                  </span>

                  <span className="font-bold text-slate-700">
                    {unansweredCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Flagged
                  </span>

                  <span className="font-bold text-amber-600">
                    {flaggedCount}
                  </span>
                </div>
              </div>

              {/* ==============================================
                  PROGRESS BAR
                 ============================================== */}

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>
                    Completion
                  </span>

                  <span>
                    {questions.length >
                    0
                      ? Math.round(
                          (answeredCount /
                            questions.length) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${
                        questions.length >
                        0
                          ? Math.min(
                              100,
                              Math.round(
                                (answeredCount /
                                  questions.length) *
                                  100,
                              ),
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ====================================================
            QUESTION AREA
           ==================================================== */}

        <section className="min-w-0">
          {/* ==================================================
              QUESTION STATUS
             ================================================== */}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <Clock3 className="h-4 w-4" />

              <span>
                Question{" "}
                {currentQuestionIndex +
                  1}{" "}
                of {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />

                {answeredCount} answered
              </span>

              {flaggedCount >
                0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
                  <Flag className="h-4 w-4" />

                  {flaggedCount} flagged
                </span>
              )}
            </div>
          </div>

          {/* ==================================================
              QUESTION CARD
             ================================================== */}

          {currentQuestion && (
            <CbtQuestionCard
              question={
                currentQuestion
              }
              questionNumber={
                currentQuestionIndex +
                1
              }
              selectedAnswer={
                currentAnswer
              }
              onSelectAnswer={
                handleAnswer
              }
            />
          )}

          {/* ==================================================
              FLAG QUESTION
             ================================================== */}

          {currentQuestion && (
            <div className="mt-4">
              <button
                type="button"
                onClick={
                  handleToggleFlag
                }
                disabled={
                  !isStarted ||
                  isSubmitted
                }
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition",
                  isCurrentQuestionFlagged
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
              >
                <Flag className="h-4 w-4" />

                {isCurrentQuestionFlagged
                  ? "Unflag Question"
                  : "Flag Question"}
              </button>
            </div>
          )}

          {/* ==================================================
              NAVIGATION
             ================================================== */}

          <div className="mt-6">
            <CbtNavigation
              isFirstQuestion={
                currentQuestionIndex ===
                0
              }
              isLastQuestion={
                currentQuestionIndex ===
                questions.length - 1
              }
              questionNumber={
                currentQuestionIndex +
                1
              }
              totalQuestions={
                questions.length
              }
              onPrevious={
                handlePrevious
              }
              onNext={
                handleNext
              }
              onSubmit={() =>
                setShowSubmitDialog(
                  true,
                )
              }
            />
          </div>
        </section>
      </div>

      {/* ======================================================
          SUBMIT DIALOG
         ====================================================== */}

      <CbtSubmitDialog
        open={
          showSubmitDialog
        }
        answeredQuestions={
          answeredCount
        }
        totalQuestions={
          questions.length
        }
        onCancel={() => {
          /*
           * When time is up the student
           * cannot cancel the submission.
           */
          if (!timeUp) {
            setShowSubmitDialog(
              false,
            );
          }
        }}
        onConfirm={
          handleSubmit
        }
        isSubmitting={
          isSubmitting
        }
        timeUp={
          timeUp
        }
      />
    </main>
  );
}



















