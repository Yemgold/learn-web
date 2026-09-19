

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
  type CbtQuestion,
} from "@/stores/cbtStore";

import {
  markPracticeSession,
} from "@/lib/api/practice";

import CbtHeader from "@/components/cbt/CbtHeader";
import CbtSubjectTabs from "@/components/cbt/CbtSubjectTabs";
import CbtQuestionNavigator from "@/components/cbt/CbtQuestionNavigator";
import CbtQuestionCard from "@/components/cbt/CbtQuestionCard";
import CbtNavigation from "@/components/cbt/CbtNavigation";
import CbtSubmitDialog from "@/components/cbt/CbtSubmitDialog";
import CbtExamSummary from "@/components/cbt/CbtExamSummary";

/* ============================================================
   STORAGE KEY
============================================================ */

const ACTIVE_PRACTICE_ID_KEY =
  "jamb-league-active-practice-id";

/* ============================================================
   GET BACKEND PRACTICE ID
============================================================ */

function getStoredPracticeId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const practiceId = localStorage.getItem(
    ACTIVE_PRACTICE_ID_KEY,
  );

  if (!practiceId?.trim()) {
    return null;
  }

  return practiceId.trim();
}

/* ============================================================
   CLEAR BACKEND PRACTICE ID
============================================================ */

function clearStoredPracticeId() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    ACTIVE_PRACTICE_ID_KEY,
  );
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
  question: CbtQuestion,
): string | null {
  const answer = normalizeAnswer(
    question.answer,
  );

  if (answer) {
    return answer;
  }

  if (Array.isArray(question.correctAnswers)) {
    for (const value of question.correctAnswers) {
      const normalized =
        normalizeAnswer(value);

      if (normalized) {
        return normalized;
      }
    }
  }

  const correctAnswer =
    normalizeAnswer(
      question.correctAnswer,
    );

  if (correctAnswer) {
    return correctAnswer;
  }

  return null;
}

/* ============================================================
   CONVERT STUDENT ANSWER TO OPTION LABEL
============================================================ */

function getStudentAnswerLabel(
  question: CbtQuestion,
  studentAnswer: unknown,
): string | null {
  const normalizedStudentAnswer =
    normalizeAnswer(studentAnswer);

  if (!normalizedStudentAnswer) {
    return null;
  }

  const options = question.options;

  if (Array.isArray(options)) {
    /*
     * Student answer is already
     * an option label.
     */
    for (const option of options) {
      const label = normalizeAnswer(
        option.label,
      );

      if (
        label ===
        normalizedStudentAnswer
      ) {
        return label;
      }
    }

    /*
     * Student answer is the
     * option value.
     */
    for (const option of options) {
      const label = normalizeAnswer(
        option.label,
      );

      const value = normalizeAnswer(
        option.value,
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

  return normalizedStudentAnswer;
}

/* ============================================================
   CALCULATE LOCAL RESULT
============================================================ */

function calculateLocalResult(
  questions: CbtQuestion[],
  answers: Record<string, string>,
) {
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredQuestions = 0;
  let totalScore = 0;
  let maximumScore = 0;

  for (
    let index = 0;
    index < questions.length;
    index++
  ) {
    const question = questions[index];

    const questionId =
      question._id;

    const rawMarks =
      Number(question.marks);

    const marks =
      Number.isFinite(rawMarks) &&
      rawMarks > 0
        ? rawMarks
        : 1;

    maximumScore += marks;

    const rawStudentAnswer =
      answers[questionId];

    const studentAnswer =
      getStudentAnswerLabel(
        question,
        rawStudentAnswer,
      );

    const correctAnswer =
      getCorrectAnswer(question);

    if (!studentAnswer) {
      unansweredQuestions += 1;
      continue;
    }

    if (!correctAnswer) {
      incorrectAnswers += 1;

      console.warn(
        `QUESTION ${
          index + 1
        }: NO CORRECT ANSWER FOUND`,
        question,
      );

      continue;
    }

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

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    score: totalScore,
    totalScore: maximumScore,
    percentage,
    passed: percentage >= 50,
    grade,
    submittedAt:
      new Date().toISOString(),
  };
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

  const sessionStatus =
    useCbtStore(
      (state) =>
        state.sessionStatus,
    );

  const practiceId =
    useCbtStore(
      (state) =>
        state.practiceId,
    );

  const sessionError =
    useCbtStore(
      (state) =>
        state.sessionError,
    );

  const result =
    useCbtStore(
      (state) =>
        state.result,
    );

  const subjects =
    useCbtStore(
      (state) =>
        state.subjects,
    );

  const questions =
    useCbtStore(
      (state) =>
        state.questions,
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
      (state) =>
        state.answers,
    );

  const flaggedQuestions =
    useCbtStore(
      (state) =>
        state.flaggedQuestions,
    );

  const isStarted =
    useCbtStore(
      (state) =>
        state.isStarted,
    );

  const isSubmitted =
    useCbtStore(
      (state) =>
        state.isSubmitted,
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

  const startExam =
    useCbtStore(
      (state) =>
        state.startExam,
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
      (state) =>
        state.setResult,
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

  const [
    initialized,
    setInitialized,
  ] = useState(false);

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
    Array.isArray(flaggedQuestions)
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
     INITIALIZE EXAM
  ========================================================== */

  const initializeExam =
    useCallback(() => {
      if (!hasQuestions) {
        return;
      }

      if (isSubmitted) {
        setInitialized(true);
        return;
      }

      if (isStarted) {
        setInitialized(true);
        return;
      }

      /*
       * IMPORTANT:
       *
       * We DO NOT create a local
       * session ID anymore.
       *
       * The backend practiceId was
       * created by:
       *
       * POST /practice/sessions
       */
      startExam();

      setInitialized(true);
    }, [
      hasQuestions,
      isSubmitted,
      isStarted,
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

    if (
      timeRemainingSeconds <= 0
    ) {
      setTimeUp(true);

      setShowSubmitDialog(
        true,
      );

      return;
    }

    const interval =
      window.setInterval(() => {
        const state =
          useCbtStore.getState();

        const currentTime =
          state.timeRemainingSeconds;

        if (
          currentTime <= 1
        ) {
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

  const subjectTabs =
    useMemo(() => {
      return subjects.map(
        (
          subject,
          index,
        ) => {
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

  const handleSelectSubject =
    (
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

      if (
        subjectIndex ===
        -1
      ) {
        return;
      }

      const firstQuestionIndex =
        questions.findIndex(
          (question) =>
            question.subjectId ===
            subjectId,
        );

      if (
        firstQuestionIndex ===
        -1
      ) {
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

  const handleAnswer =
    (
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
       * Answers remain frontend/local.
       *
       * There is NO answer endpoint.
       */
      selectAnswer(
        currentQuestion._id,
        answer,
      );
    };

  /* ==========================================================
     HANDLE QUESTION SELECT
  ========================================================== */

  const handleQuestionSelect =
    (
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

  const handleNext =
    () => {
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

  const handlePrevious =
    () => {
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

  const handleToggleFlag =
    () => {
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

  const handleSubmit =
    async () => {
      console.log(
        "========== SUBMIT START ==========",
      );

      if (isSubmitting) {
        console.log(
          "STOP: isSubmitting = true",
        );
        return;
      }

      if (isSubmitted) {
        console.log(
          "STOP: isSubmitted = true",
        );
        return;
      }

      if (!hasQuestions) {
        console.log(
          "STOP: hasQuestions = false",
        );
        return;
      }

      console.log(
        "A: handleSubmit entered",
      );

      /* ======================================================
         PRACTICE ID
      ====================================================== */

      const currentPracticeId =
        practiceId?.trim() || null;

      console.log(
        "B: practiceId from CBT store:",
        practiceId,
      );

      console.log(
        "C: currentPracticeId:",
        currentPracticeId,
      );

      if (!currentPracticeId) {
        console.error(
          "STOP: NO PRACTICE ID",
        );

        markSessionFailed(
          "Practice ID is missing. The practice cannot be submitted.",
        );

        return;
      }

      console.log(
        "D: Practice ID exists:",
        currentPracticeId,
      );

      /* ======================================================
         BUILD QUESTIONS PAYLOAD
      ====================================================== */

      const submissionQuestions =
        questions.map(
          (question) => ({
            questionId:
              question._id,

            selectedOption:
              getStudentAnswerLabel(
                question,
                answers[
                  question._id
                ] ?? null,
              ),
          }),
        );

      console.log(
        "E: Questions prepared for submission:",
        submissionQuestions,
      );

      console.log(
        "F: Number of questions:",
        submissionQuestions.length,
      );

      /* ======================================================
         START SUBMISSION
      ====================================================== */

      setIsSubmitting(true);

      try {
        console.log(
          "G: Calling markPracticeSession NOW",
        );

        const backendResult =
          await markPracticeSession(
            currentPracticeId,
            submissionQuestions,
          );

        console.log(
          "H: markPracticeSession RETURNED:",
          backendResult,
        );

        if (!backendResult) {
          throw new Error(
            "Backend returned no result.",
          );
        }

        /* ====================================================
           BUILD FINAL RESULT
        ==================================================== */

        const backendData =
          backendResult?.data ??
          backendResult;

        const finalResult = {
          practiceId:
            currentPracticeId,

          totalQuestions:
            backendData.questionCount ??
            questions.length,

          correctAnswers:
            backendData.correctAnswers ??
            0,

          incorrectAnswers:
            backendData.wrongAnswers ??
            0,

          unansweredQuestions:
            backendData.unansweredQuestions ??
            0,

          score:
            backendData.score ??
            0,

          totalScore:
            backendData.questionCount ??
            questions.length,

          percentage:
            backendData.percentage ??
            0,

          totalPointsAwarded:
            Number(
              backendData.totalPointsAwarded ??
                0,
            ),

          durationInMinutes,

          submittedAt:
            backendData.submittedAt ??
            new Date().toISOString(),

          passed:
            (backendData.percentage ??
              0) >= 50,

          grade:
            (backendData.percentage ??
              0) >= 70
              ? "A"
              : (backendData.percentage ??
                    0) >= 60
                ? "B"
                : (backendData.percentage ??
                      0) >= 50
                  ? "C"
                  : (backendData.percentage ??
                        0) >= 45
                    ? "D"
                    : "F",
        };

        /* ====================================================
           SAVE RESULT TO CBT STORE
        ==================================================== */

        setResult(finalResult);

        console.log(
          "J: setResult completed",
        );

        /* ====================================================
           MARK SESSION COMPLETED
        ==================================================== */

        markSessionCompleted(
          finalResult,
        );

        console.log(
          "K: markSessionCompleted completed",
        );

        /* ====================================================
           CLOSE SUBMIT DIALOG
        ==================================================== */

        setShowSubmitDialog(false);

        setTimeUp(false);

        /* ====================================================
           SHOW SUMMARY
        ==================================================== */

        setShowSummary(true);

        console.log(
          "L: SUMMARY SHOULD NOW SHOW",
        );

        console.log(
          "========== SUBMIT COMPLETE ==========",
        );
      } catch (error) {
        console.error(
          "========== SUBMIT ERROR ==========",
        );

        console.error(
          "Submission error:",
          error,
        );

        markSessionFailed(
          error instanceof Error
            ? error.message
            : "Failed to submit practice session.",
        );
      } finally {
        console.log("M: finally");

        setIsSubmitting(false);
      }
    };

  /* ==========================================================
     HANDLE TIME UP
  ========================================================== */

  const handleTimeUp =
    () => {
      if (isSubmitted) {
        return;
      }

      setTimeUp(true);

      setShowSubmitDialog(
        true,
      );
    };

  /* ==========================================================
     HANDLE EXIT
  ========================================================== */

  const handleExit =
    () => {
      resetSession();

      clearStoredPracticeId();

      router.push(
        "/student/practice",
      );
    };

  /* ==========================================================
     NO QUESTIONS
  ========================================================== */

  if (!hasQuestions) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-500/10 text-amber-400">
              <AlertCircle className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-white">
              No Practice Questions
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              We could not find any
              questions for this
              practice. Please go
              back and start a new
              practice.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/student/practice",
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
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

  if (!initialized) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
        </div>

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>

          <h1 className="mt-5 text-xl font-black text-white">
            Preparing your practice
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
        </div>

        <div className="relative w-full max-w-lg rounded-3xl border border-red-400/20 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-white">
            Unable to start practice
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {sessionError ??
              "Something went wrong while preparing your practice."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                resetSession();

                clearStoredPracticeId();

                router.push(
                  "/student/practice",
                );
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
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
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-8">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                Practice Complete
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-bold text-slate-400">
                Results
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Practice Summary
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Here is your performance for
              this practice session.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-sm">
            <CbtExamSummary
              totalQuestions={
                result?.totalQuestions ??
                questions.length
              }
              answeredQuestions={
                result?.totalQuestions !==
                undefined
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
                result?.correctAnswers ??
                0
              }
              score={
                result?.score ??
                0
              }
              percentage={
                result?.percentage ??
                0
              }
              totalPointsAwarded={
                Number(
                  result?.totalPointsAwarded ??
                    0,
                )
              }
            />
          </div>

          {/* ==================================================
              RESULT DETAILS
          ================================================== */}

          {result && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Performance Details
                </p>

                <h2 className="mt-1 text-lg font-black text-white">
                  Your Results
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {result.score !==
                  undefined && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Score
                    </p>

                    <p className="mt-1 text-2xl font-black text-white">
                      {result.score}
                      {result.totalScore !==
                        undefined &&
                        ` / ${result.totalScore}`}
                    </p>
                  </div>
                )}

                {result.percentage !==
                  undefined && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Percentage
                    </p>

                    <p className="mt-1 text-2xl font-black text-blue-400">
                      {result.percentage}%
                    </p>
                  </div>
                )}

                {result.correctAnswers !==
                  undefined && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Correct
                    </p>

                    <p className="mt-1 text-2xl font-black text-emerald-400">
                      {result.correctAnswers}
                    </p>
                  </div>
                )}

                {result.grade && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Grade
                    </p>

                    <p className="mt-1 text-2xl font-black text-white">
                      {result.grade}
                    </p>
                  </div>
                )}
              </div>

              {result.passed !==
                undefined && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <div
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      result.passed
                        ? "bg-emerald-500/10"
                        : "bg-red-500/10",
                    ].join(" ")}
                  >
                    <CheckCircle2
                      className={[
                        "h-5 w-5",
                        result.passed
                          ? "text-emerald-400"
                          : "text-red-400",
                      ].join(" ")}
                    />
                  </div>

                  <span className="text-sm font-bold text-slate-300">
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

                clearStoredPracticeId();

                router.push(
                  "/student/practice",
                );
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ======================================================
          GLOBAL BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
      </div>

      <div className="relative">
        {/* ====================================================
            HEADER
        ==================================================== */}

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
            setShowSubmitDialog(
              true,
            )
          }
          onExit={
            handleExit
          }
        />

        {/* ====================================================
            BACKEND PRACTICE STATUS
        ==================================================== */}

        {isStarted && (
          <div className="border-b border-emerald-400/10 bg-emerald-500/[0.06]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                Practice in progress
              </span>
            </div>
          </div>
        )}

        {/* ====================================================
            SUBJECT TABS
        ==================================================== */}

        <div className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <CbtSubjectTabs
              subjects={
                subjectTabs
              }
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

        {/* ====================================================
            MOBILE NAVIGATOR
        ==================================================== */}

        <div className="mx-auto max-w-7xl px-4 pt-4 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setShowNavigator(
                (value) =>
                  !value,
              )
            }
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-300 shadow-lg shadow-black/10 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <span>
              Question{" "}
              {currentQuestionIndex +
                1}{" "}
              of {questions.length}
            </span>

            <span className="text-blue-400">
              {answeredCount}/
              {questions.length}{" "}
              answered
            </span>
          </button>
        </div>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* ==================================================
              QUESTION NAVIGATOR
          ================================================== */}

          <aside
            className={[
              "lg:block",
              showNavigator
                ? "block"
                : "hidden",
            ].join(" ")}
          >
            <div className="sticky top-20">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
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

              {/* ==============================================
                  PROGRESS
              ============================================== */}

              <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Session
                    </p>

                    <h3 className="mt-1 text-sm font-black text-white">
                      Progress
                    </h3>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                    <Clock3 className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Answered
                    </span>

                    <span className="font-bold text-emerald-400">
                      {answeredCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Unanswered
                    </span>

                    <span className="font-bold text-slate-300">
                      {unansweredCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Flagged
                    </span>

                    <span className="font-bold text-amber-400">
                      {flaggedCount}
                    </span>
                  </div>
                </div>

                {/* ============================================
                    PROGRESS BAR
                ============================================ */}

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>
                      Completion
                    </span>

                    <span className="text-slate-300">
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

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500 transition-all"
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

          {/* ==================================================
              QUESTION AREA
          ================================================== */}

          <section className="min-w-0">
            {/* ================================================
                QUESTION STATUS
            ================================================ */}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <Clock3 className="h-4 w-4 text-blue-400" />
                </div>

                <span>
                  Question{" "}
                  {currentQuestionIndex +
                    1}{" "}
                  of {questions.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                  {answeredCount}{" "}
                  answered
                </span>

                {flaggedCount >
                  0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300">
                    <Flag className="h-4 w-4" />

                    {flaggedCount}{" "}
                    flagged
                  </span>
                )}
              </div>
            </div>

            {/* ================================================
                QUESTION CARD
            ================================================ */}

            {currentQuestion && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-1 shadow-2xl shadow-black/20 backdrop-blur-sm">
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
              </div>
            )}

            {/* ================================================
                FLAG QUESTION
            ================================================ */}

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
                      ? "border-amber-400/30 bg-amber-500/10 text-amber-300"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-amber-400/30 hover:bg-amber-500/10 hover:text-amber-300",
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

            {/* ================================================
                NAVIGATION
            ================================================ */}

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-5">
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

        {/* ====================================================
            SUBMIT DIALOG
        ==================================================== */}

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
             * Time-up submission cannot
             * be cancelled.
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
      </div>
    </main>
  );
}