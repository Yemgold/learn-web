

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
 AlertCircle, CheckCircle2, Clock3, Flag, Loader2,
 RotateCcw,} from "lucide-react";

import { useCbtStore, selectCurrentQuestion,selectCurrentSubject,
type CbtQuestion,} from "@/stores/cbtStore";

import { markPracticeSession } from "@/lib/api/practice";
import CbtHeader from "@/components/cbt/CbtHeader";
import CbtSubjectTabs from "@/components/cbt/CbtSubjectTabs";
import CbtQuestionNavigator from "@/components/cbt/CbtQuestionNavigator";
import CbtQuestionCard from "@/components/cbt/CbtQuestionCard";
import CbtNavigation from "@/components/cbt/CbtNavigation";
import CbtSubmitDialog from "@/components/cbt/CbtSubmitDialog";
import CbtExamSummary from "@/components/cbt/CbtExamSummary";


const ACTIVE_PRACTICE_ID_KEY = "jamb-league-active-practice-id";

function clearStoredPracticeId() {
 if (typeof window !== "undefined") {
  localStorage.removeItem(ACTIVE_PRACTICE_ID_KEY);
  }
}

function normalizeAnswer(value: unknown): string | null {
 if (typeof value !== "string") return null;

 const normalized = value.trim().toLowerCase();
return normalized || null;
}

function getStudentAnswerLabel(
 question: CbtQuestion,
 studentAnswer: unknown,

): string | null {

const normalizedAnswer = normalizeAnswer(studentAnswer);


  if (!normalizedAnswer) return null;



  const options = question.options;



  if (Array.isArray(options)) {
    const matchingLabel = options.find(
  (option) =>
   normalizeAnswer(option.label) === normalizedAnswer,
    );
 if (matchingLabel) {
   return normalizeAnswer(matchingLabel.label);
 }
 const matchingValue = options.find(
 (option) =>
   normalizeAnswer(option.value) === normalizedAnswer,
  );
    if (matchingValue) {
   return normalizeAnswer(matchingValue.label);
    }
  }
  return normalizedAnswer;
}

export default function CbtSessionPage() {

  const router = useRouter();

  // Current question and subject

  const currentQuestion = useCbtStore(selectCurrentQuestion);

  const currentSubject = useCbtStore(selectCurrentSubject);

  // Session state

  const sessionStatus = useCbtStore((state) => state.sessionStatus);

  const practiceId = useCbtStore((state) => state.practiceId);

  const sessionError = useCbtStore((state) => state.sessionError);

  const result = useCbtStore((state) => state.result);

  const subjects = useCbtStore((state) => state.subjects);

  const questions = useCbtStore((state) => state.questions);

  const currentQuestionIndex = useCbtStore(

    (state) => state.currentQuestionIndex,

  );

  const answers = useCbtStore((state) => state.answers);

  const flaggedQuestions = useCbtStore(

    (state) => state.flaggedQuestions,

  );

  const isStarted = useCbtStore((state) => state.isStarted);

  const isSubmitted = useCbtStore((state) => state.isSubmitted);

  const durationInMinutes = useCbtStore(

    (state) => state.durationInMinutes,

  );

  const timeRemainingSeconds = useCbtStore(

    (state) => state.timeRemainingSeconds,

  );



  // Store actions

  const startExam = useCbtStore((state) => state.startExam);

  const markSessionCompleted = useCbtStore(

    (state) => state.markSessionCompleted,

  );

  const markSessionFailed = useCbtStore(

    (state) => state.markSessionFailed,

  );

  const setResult = useCbtStore((state) => state.setResult);

  const setCurrentQuestion = useCbtStore(

    (state) => state.setCurrentQuestion,

  );

  const setCurrentSubject = useCbtStore(

    (state) => state.setCurrentSubject,

  );

  const nextQuestion = useCbtStore((state) => state.nextQuestion);

  const previousQuestion = useCbtStore(

    (state) => state.previousQuestion,

  );

  const selectAnswer = useCbtStore((state) => state.selectAnswer);

  const toggleFlag = useCbtStore((state) => state.toggleFlag);

  const setTimeRemaining = useCbtStore(

    (state) => state.setTimeRemaining,

  );

  const resetSession = useCbtStore((state) => state.resetSession);

  // Local UI state

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const [showSummary, setShowSummary] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timeUp, setTimeUp] = useState(false);

  const [initialized, setInitialized] = useState(false);

  // Bring the submit controls into view after the final question is answered.
  const submitFocusRef = useRef<HTMLDivElement | null>(null);

  // Basic state

  const hasQuestions = Array.isArray(questions) && questions.length > 0;



  // Current answer: this is the single source of truth for visibility.

  const currentAnswer = currentQuestion

    ? answers[currentQuestion._id]

    : undefined;

  const isCurrentQuestionAnswered =

    currentAnswer !== undefined &&

    currentAnswer !== null &&

    String(currentAnswer).trim() !== "";

  /*

   * Show progress for an answered current question.

   * If the student navigates to an unanswered question,

   * the progress panels disappear automatically.

   */

  const showQuestionProgress = isCurrentQuestionAnswered;

  const isLastQuestionAnswered =
    currentQuestionIndex === questions.length - 1 &&
    isCurrentQuestionAnswered;

  useEffect(() => {
    if (!isLastQuestionAnswered) return;

    const frameId = window.requestAnimationFrame(() => {
      const submitArea = submitFocusRef.current;
      if (!submitArea) return;

      // Bring the final action into view, especially on small mobile screens.
      submitArea.scrollIntoView({ behavior: "smooth", block: "center" });

      // Focus the Submit button specifically, rather than relying on button order.
      const buttons = Array.from(
        submitArea.querySelectorAll<HTMLButtonElement>("button"),
      );
      const submitButton = buttons.find((button) =>
        /submit|finish|complete/i.test(
          `${button.innerText} ${button.getAttribute("aria-label") ?? ""}`,
        ),
      );

      // Fallback to the last available action if the button has no recognizable label.
      (submitButton ?? buttons[buttons.length - 1])?.focus({
        preventScroll: true,
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isLastQuestionAnswered]);



  // Answer counts

  const answeredCount = useMemo(

    () =>

      Object.values(answers ?? {}).filter(

        (answer) =>

          answer !== undefined &&

          answer !== null &&

          String(answer).trim() !== "",

      ).length,

    [answers],

  );



  const unansweredCount = Math.max(

    questions.length - answeredCount,

    0,

  );



  const flaggedCount = Array.isArray(flaggedQuestions)

    ? flaggedQuestions.length

    : 0;



  const isCurrentQuestionFlagged = currentQuestion

    ? flaggedQuestions.includes(currentQuestion._id)

    : false;



  // Initialize the practice session

  const initializeExam = useCallback(() => {

    if (!hasQuestions) return;



    if (isSubmitted || isStarted) {

      setInitialized(true);

      return;

    }



    startExam();

    setInitialized(true);

  }, [hasQuestions, isSubmitted, isStarted, startExam]);



  useEffect(() => {

    initializeExam();

  }, [initializeExam]);



  // Timer

  useEffect(() => {

    if (!isStarted || isSubmitted) return;



    if (timeRemainingSeconds <= 0) {

      setTimeUp(true);

      setShowSubmitDialog(true);

      return;

    }



    const interval = window.setInterval(() => {

      const currentTime = useCbtStore.getState().timeRemainingSeconds;



      if (currentTime <= 1) {

        setTimeRemaining(0);

        setTimeUp(true);

        setShowSubmitDialog(true);

        window.clearInterval(interval);

        return;

      }



      setTimeRemaining(currentTime - 1);

    }, 1000);



    return () => window.clearInterval(interval);

  }, [

    isStarted,

    isSubmitted,

    timeRemainingSeconds,

    setTimeRemaining,

  ]);



  // Subject tabs with per-subject answered counts

  const subjectTabs = useMemo(

    () =>

      subjects.map((subject, index) => {

        const subjectQuestions = questions.filter(

          (question) => question.subjectId === subject._id,

        );



        const subjectQuestionIds = new Set(

          subjectQuestions.map((question) => question._id),

        );



        const answered = Object.keys(answers ?? {}).filter(

          (questionId) =>

            subjectQuestionIds.has(questionId) &&

            answers[questionId] !== undefined &&

            answers[questionId] !== null &&

            String(answers[questionId]).trim() !== "",

        ).length;



        return {

          id: subject._id,

          name: subject.name,

          answered,

          total: subjectQuestions.length,

          index,

        };

      }),

    [subjects, questions, answers],

  );



  // Subject selection

  const handleSelectSubject = (subjectId: string) => {

    if (!isStarted || isSubmitted) return;



    const subjectIndex = subjects.findIndex(

      (subject) => subject._id === subjectId,

    );



    if (subjectIndex === -1) return;



    const firstQuestionIndex = questions.findIndex(

      (question) => question.subjectId === subjectId,

    );



    if (firstQuestionIndex === -1) return;



    setCurrentSubject(subjectIndex);

    setCurrentQuestion(firstQuestionIndex);

  };



  // Answer selection

  const handleAnswer = (answer: string) => {

    if (!currentQuestion || !isStarted || isSubmitted) return;

    if (!answer || !answer.trim()) return;



    selectAnswer(currentQuestion._id, answer);

  };



  // Question navigation

  const handleQuestionSelect = (index: number) => {

    if (!isStarted || isSubmitted) return;

    if (index < 0 || index >= questions.length) return;



    setCurrentQuestion(index);

  };



  const handleNext = () => {

    if (!isStarted || isSubmitted) return;

    nextQuestion();

  };



  const handlePrevious = () => {

    if (!isStarted || isSubmitted) return;

    previousQuestion();

  };



  // Flag current question

  const handleToggleFlag = () => {

    if (!currentQuestion || !isStarted || isSubmitted) return;

    toggleFlag(currentQuestion._id);

  };



  // Submit practice

  const handleSubmit = async () => {

    if (isSubmitting || isSubmitted || !hasQuestions) return;



    const currentPracticeId = practiceId?.trim();



    if (!currentPracticeId) {

      markSessionFailed(

        "Practice ID is missing. The practice cannot be submitted.",

      );

      return;

    }



    const submissionQuestions = questions.map((question) => ({

      questionId: question._id,

      selectedOption: getStudentAnswerLabel(

        question,

        answers[question._id] ?? null,

      ),

    }));



    setIsSubmitting(true);



    try {

      const backendResult = await markPracticeSession(

        currentPracticeId,

        submissionQuestions,

      );



      if (!backendResult) {

        throw new Error("Backend returned no result.");

      }



      const backendData = backendResult.data ?? backendResult;

      const percentage = Number(backendData.percentage ?? 0);

      const questionCount = Number(

        backendData.questionCount ?? questions.length,

      );



      const finalResult = {

        practiceId: currentPracticeId,

        totalQuestions: questionCount,

        correctAnswers: Number(backendData.correctAnswers ?? 0),

        incorrectAnswers: Number(backendData.wrongAnswers ?? 0),

        unansweredQuestions: Number(

          backendData.unansweredQuestions ?? 0,

        ),

        score: Number(backendData.score ?? 0),

        totalScore: questionCount,

        percentage,

        totalPointsAwarded: Number(

          backendData.totalPointsAwarded ?? 0,

        ),

        durationInMinutes,

        submittedAt:

          backendData.submittedAt ?? new Date().toISOString(),

        passed: percentage >= 50,

        grade:

          percentage >= 70

            ? "A"

            : percentage >= 60

              ? "B"

              : percentage >= 50

                ? "C"

                : percentage >= 45

                  ? "D"

                  : "F",

      };



      setResult(finalResult);

      markSessionCompleted(finalResult);

      setShowSubmitDialog(false);

      setTimeUp(false);

      setShowSummary(true);

    } catch (error) {

      console.error("Practice submission failed:", error);



      markSessionFailed(

        error instanceof Error

          ? error.message

          : "Failed to submit practice session.",

      );

    } finally {

      setIsSubmitting(false);

    }

  };



  const handleTimeUp = () => {

    if (isSubmitted) return;



    setTimeUp(true);

    setShowSubmitDialog(true);

  };



  const handleExit = () => {

    resetSession();

    clearStoredPracticeId();

    router.push("/student/practice");

  };



  const handleBackToPractice = () => {

    resetSession();

    clearStoredPracticeId();

    router.push("/student/practice");

  };



  // Shared background

  const background = (

    <div className="pointer-events-none fixed inset-0">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

    </div>

  );



  // No questions

  if (!hasQuestions) {

    return (

      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

        {background}



        <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">

          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-500/10 text-amber-400">

              <AlertCircle className="h-8 w-8" />

            </div>



            <h1 className="mt-5 text-2xl font-black">

              No Practice Questions

            </h1>



            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">

              We could not find any questions for this practice.

              Please go back and start a new practice.

            </p>



            <button

              type="button"

              onClick={() => router.push("/student/practice")}

              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold transition hover:bg-blue-500"

            >

              <RotateCcw className="h-4 w-4" />

              Back to Practice

            </button>

          </div>

        </div>

      </main>

    );

  }



  // Initialization

  if (!initialized) {

    return (

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">

        {background}



        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">

            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />

          </div>



          <h1 className="mt-5 text-xl font-black">

            Preparing your practice

          </h1>



          <p className="mt-2 text-sm text-slate-400">

            Preparing your questions...

          </p>

        </div>

      </main>

    );

  }



  // Session error

  if (sessionStatus === "failed" && !isStarted && !isSubmitted) {

    return (

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">

        {background}



        <div className="relative w-full max-w-lg rounded-3xl border border-red-400/20 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-400">

            <AlertCircle className="h-8 w-8" />

          </div>



          <h1 className="mt-5 text-2xl font-black">

            Unable to start practice

          </h1>



          <p className="mt-3 text-sm leading-6 text-slate-400">

            {sessionError ??

              "Something went wrong while preparing your practice."}

          </p>



          <button

            type="button"

            onClick={handleBackToPractice}

            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold transition hover:bg-blue-500"

          >

            <RotateCcw className="h-4 w-4" />

            Back to Practice

          </button>

        </div>

      </main>

    );

  }



  // Exam summary

  if (isSubmitted && showSummary) {

    return (

      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

        {background}



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



            <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">

              Practice Summary

            </h1>



            <p className="mt-2 text-sm text-slate-400">

              Here is your performance for this practice session.

            </p>

          </div>



          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-sm">

            <CbtExamSummary

              totalQuestions={result?.totalQuestions ?? questions.length}

              answeredQuestions={

                result?.totalQuestions !== undefined

                  ? Math.max(

                      0,

                      (result.totalQuestions ?? questions.length) -

                        (result.unansweredQuestions ?? unansweredCount),

                    )

                  : answeredCount

              }

              unansweredQuestions={

                result?.unansweredQuestions ?? unansweredCount

              }

              flaggedQuestions={flaggedCount}

              correctAnswers={result?.correctAnswers ?? 0}

              score={result?.score ?? 0}

              percentage={result?.percentage ?? 0}

              totalPointsAwarded={Number(

                result?.totalPointsAwarded ?? 0,

              )}

            />

          </div>



          {result && (

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">

                  Performance Details

                </p>



                <h2 className="mt-1 text-lg font-black">

                  Your Results

                </h2>

              </div>



              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {result.score !== undefined && (

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">

                      Score

                    </p>

                    <p className="mt-1 text-2xl font-black">

                      {result.score}

                      {result.totalScore !== undefined &&

                        ` / ${result.totalScore}`}

                    </p>

                  </div>

                )}



                {result.percentage !== undefined && (

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">

                      Percentage

                    </p>

                    <p className="mt-1 text-2xl font-black text-blue-400">

                      {result.percentage}%

                    </p>

                  </div>

                )}



                {result.correctAnswers !== undefined && (

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

                    <p className="mt-1 text-2xl font-black">

                      {result.grade}

                    </p>

                  </div>

                )}

              </div>



              {result.passed !== undefined && (

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

              onClick={handleBackToPractice}

              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold shadow-lg transition hover:bg-blue-500"

            >

              <RotateCcw className="h-4 w-4" />

              Back to Practice

            </button>

          </div>

        </div>

      </main>

    );

  }



  // Main CBT screen

  return (

    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {background}



      <div className="relative">

        <CbtHeader

          subjectName={currentSubject?.name ?? "Practice Examination"}

          questionNumber={

            showQuestionProgress ? currentQuestionIndex + 1 : 0

          }

          totalQuestions={showQuestionProgress ? questions.length : 0}

          durationInMinutes={durationInMinutes}

          timeRemainingSeconds={timeRemainingSeconds}

          onTimeUp={handleTimeUp}

          onSubmit={() => setShowSubmitDialog(true)}

          onExit={handleExit}

        />



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



        <div className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">

          <div className="mx-auto max-w-7xl px-4 py-3">

            <CbtSubjectTabs

              subjects={subjectTabs}

              activeSubjectId={currentSubject?._id ?? ""}

              onSelectSubject={handleSelectSubject}

            />

          </div>

        </div>



        {/* One full-width column. Progress sits above the question. */}

        <div className="mx-auto w-full max-w-5xl px-4 py-6">

          <section className="min-w-0">

            {showQuestionProgress && (

              <div className="mb-6 space-y-4">

                {/* Question number navigator */}

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-xl backdrop-blur-sm sm:p-5">

                  <CbtQuestionNavigator

                    questionIds={questions.map(

                      (question) => question._id,

                    )}

                    currentQuestionIndex={currentQuestionIndex}

                    answers={answers}

                    flaggedQuestions={flaggedQuestions}

                    onSelectQuestion={handleQuestionSelect}

                  />

                </div>



                {/* Session Progress */}

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl backdrop-blur-sm">

                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">

                        <Clock3 className="h-5 w-5" />

                      </div>



                      <div>

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">

                          Session

                        </p>

                        <h3 className="mt-1 text-sm font-black">

                          Progress

                        </h3>

                      </div>

                    </div>



                    <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300">

                      {Math.round(

                        (answeredCount / questions.length) * 100,

                      )}

                      % completed

                    </span>

                  </div>



                  <div className="mt-5 grid grid-cols-3 gap-3">

                    <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.06] p-3">

                      <p className="text-xs text-slate-400">Answered</p>

                      <p className="mt-1 text-xl font-black text-emerald-400">

                        {answeredCount}

                      </p>

                    </div>



                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">

                      <p className="text-xs text-slate-400">Unanswered</p>

                      <p className="mt-1 text-xl font-black">

                        {unansweredCount}

                      </p>

                    </div>



                    <div className="rounded-2xl border border-amber-400/10 bg-amber-500/[0.06] p-3">

                      <p className="text-xs text-slate-400">Flagged</p>

                      <p className="mt-1 text-xl font-black text-amber-400">

                        {flaggedCount}

                      </p>

                    </div>

                  </div>



                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                    <div

                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500 transition-all duration-300"

                      style={{

                        width: `${Math.min(

                          100,

                          (answeredCount / questions.length) * 100,

                        )}%`,

                      }}

                    />

                  </div>

                </div>

              </div>

            )}



            {/* Current question */}

            {currentQuestion && (

              <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-1 shadow-2xl backdrop-blur-sm">

                <CbtQuestionCard

                  question={currentQuestion}

                  questionNumber={

                    showQuestionProgress

                      ? currentQuestionIndex + 1

                      : 0

                  }

                  selectedAnswer={currentAnswer}

                  onSelectAnswer={handleAnswer}

                  isFlagged={isCurrentQuestionFlagged}

                  onToggleFlag={handleToggleFlag}

                />

              </div>

            )}



            {/* Flag control */}

            {currentQuestion && (

              <div className="mt-4">

                <button

                  type="button"

                  onClick={handleToggleFlag}

                  disabled={!isStarted || isSubmitted}

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



            {/* Previous / next / submit */}

            <div
              ref={submitFocusRef}
              tabIndex={-1}
              className={[
                "mt-6 rounded-3xl border p-4 shadow-xl backdrop-blur-sm transition-all duration-300 sm:p-5",
                isLastQuestionAnswered
                  ? "border-emerald-400/40 bg-emerald-500/[0.08] ring-2 ring-emerald-400/20"
                  : "border-white/10 bg-white/[0.03]",
              ].join(" ")}
            >
              {isLastQuestionAnswered && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Final question answered — submit your practice when ready.
                </div>
              )}
              <CbtNavigation
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={
                  currentQuestionIndex === questions.length - 1
                }
                questionNumber={
                  showQuestionProgress
                    ? currentQuestionIndex + 1
                    : 0
                }
                totalQuestions={
                  showQuestionProgress ? questions.length : 0
                }
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={() => setShowSubmitDialog(true)}
              />
            </div>
          </section>
        </div>
        <CbtSubmitDialog
          open={showSubmitDialog}
          answeredQuestions={answeredCount}
          totalQuestions={questions.length}
          onCancel={() => {
            if (!timeUp) {
              setShowSubmitDialog(false);
            }
          }}
          onConfirm={handleSubmit}
          isSubmitting={isSubmitting}
          timeUp={timeUp}
        />
      </div>
    </main>
  );
}

































// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AlertCircle,
//   CheckCircle2,
//   Clock3,
//   Flag,
//   Loader2,
//   RotateCcw,
// } from "lucide-react";

// import {
//   useCbtStore,
//   selectCurrentQuestion,
//   selectCurrentSubject,
//   type CbtQuestion,
// } from "@/stores/cbtStore";

// import { markPracticeSession } from "@/lib/api/practice";

// import CbtHeader from "@/components/cbt/CbtHeader";
// import CbtSubjectTabs from "@/components/cbt/CbtSubjectTabs";
// import CbtQuestionNavigator from "@/components/cbt/CbtQuestionNavigator";
// import CbtQuestionCard from "@/components/cbt/CbtQuestionCard";
// import CbtNavigation from "@/components/cbt/CbtNavigation";
// import CbtSubmitDialog from "@/components/cbt/CbtSubmitDialog";
// import CbtExamSummary from "@/components/cbt/CbtExamSummary";

// const ACTIVE_PRACTICE_ID_KEY = "jamb-league-active-practice-id";

// function clearStoredPracticeId() {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem(ACTIVE_PRACTICE_ID_KEY);
//   }
// }

// function normalizeAnswer(value: unknown): string | null {
//   if (typeof value !== "string") return null;

//   const normalized = value.trim().toLowerCase();
//   return normalized || null;
// }

// function getStudentAnswerLabel(
//   question: CbtQuestion,
//   studentAnswer: unknown,
// ): string | null {
//   const normalizedAnswer = normalizeAnswer(studentAnswer);

//   if (!normalizedAnswer) return null;

//   const options = question.options;

//   if (Array.isArray(options)) {
//     const matchingLabel = options.find(
//       (option) =>
//         normalizeAnswer(option.label) === normalizedAnswer,
//     );

//     if (matchingLabel) {
//       return normalizeAnswer(matchingLabel.label);
//     }

//     const matchingValue = options.find(
//       (option) =>
//         normalizeAnswer(option.value) === normalizedAnswer,
//     );

//     if (matchingValue) {
//       return normalizeAnswer(matchingValue.label);
//     }
//   }

//   return normalizedAnswer;
// }

// export default function CbtSessionPage() {
//   const router = useRouter();

//   // Current question and subject
//   const currentQuestion = useCbtStore(selectCurrentQuestion);
//   const currentSubject = useCbtStore(selectCurrentSubject);

//   // Session state
//   const sessionStatus = useCbtStore((state) => state.sessionStatus);
//   const practiceId = useCbtStore((state) => state.practiceId);
//   const sessionError = useCbtStore((state) => state.sessionError);
//   const result = useCbtStore((state) => state.result);
//   const subjects = useCbtStore((state) => state.subjects);
//   const questions = useCbtStore((state) => state.questions);
//   const currentQuestionIndex = useCbtStore(
//     (state) => state.currentQuestionIndex,
//   );
//   const answers = useCbtStore((state) => state.answers);
//   const flaggedQuestions = useCbtStore(
//     (state) => state.flaggedQuestions,
//   );
//   const isStarted = useCbtStore((state) => state.isStarted);
//   const isSubmitted = useCbtStore((state) => state.isSubmitted);
//   const durationInMinutes = useCbtStore(
//     (state) => state.durationInMinutes,
//   );
//   const timeRemainingSeconds = useCbtStore(
//     (state) => state.timeRemainingSeconds,
//   );

//   // Store actions
//   const startExam = useCbtStore((state) => state.startExam);
//   const markSessionCompleted = useCbtStore(
//     (state) => state.markSessionCompleted,
//   );
//   const markSessionFailed = useCbtStore(
//     (state) => state.markSessionFailed,
//   );
//   const setResult = useCbtStore((state) => state.setResult);
//   const setCurrentQuestion = useCbtStore(
//     (state) => state.setCurrentQuestion,
//   );
//   const setCurrentSubject = useCbtStore(
//     (state) => state.setCurrentSubject,
//   );
//   const nextQuestion = useCbtStore((state) => state.nextQuestion);
//   const previousQuestion = useCbtStore(
//     (state) => state.previousQuestion,
//   );
//   const selectAnswer = useCbtStore((state) => state.selectAnswer);
//   const toggleFlag = useCbtStore((state) => state.toggleFlag);
//   const setTimeRemaining = useCbtStore(
//     (state) => state.setTimeRemaining,
//   );
//   const resetSession = useCbtStore((state) => state.resetSession);

//   // Local UI state
//   const [showSubmitDialog, setShowSubmitDialog] = useState(false);
//   const [showSummary, setShowSummary] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [timeUp, setTimeUp] = useState(false);
//   const [initialized, setInitialized] = useState(false);

//   // Basic state
//   const hasQuestions = Array.isArray(questions) && questions.length > 0;

//   // Current answer: this is the single source of truth for visibility.
//   const currentAnswer = currentQuestion
//     ? answers[currentQuestion._id]
//     : undefined;

//   const isCurrentQuestionAnswered =
//     currentAnswer !== undefined &&
//     currentAnswer !== null &&
//     String(currentAnswer).trim() !== "";

//   /*
//    * Show progress for an answered current question.
//    * If the student navigates to an unanswered question,
//    * the progress panels disappear automatically.
//    */
//   const showQuestionProgress = isCurrentQuestionAnswered;

//   // Answer counts
//   const answeredCount = useMemo(
//     () =>
//       Object.values(answers ?? {}).filter(
//         (answer) =>
//           answer !== undefined &&
//           answer !== null &&
//           String(answer).trim() !== "",
//       ).length,
//     [answers],
//   );

//   const unansweredCount = Math.max(
//     questions.length - answeredCount,
//     0,
//   );

//   const flaggedCount = Array.isArray(flaggedQuestions)
//     ? flaggedQuestions.length
//     : 0;

//   const isCurrentQuestionFlagged = currentQuestion
//     ? flaggedQuestions.includes(currentQuestion._id)
//     : false;

//   // Initialize the practice session
//   const initializeExam = useCallback(() => {
//     if (!hasQuestions) return;

//     if (isSubmitted || isStarted) {
//       setInitialized(true);
//       return;
//     }

//     startExam();
//     setInitialized(true);
//   }, [hasQuestions, isSubmitted, isStarted, startExam]);

//   useEffect(() => {
//     initializeExam();
//   }, [initializeExam]);

//   // Timer
//   useEffect(() => {
//     if (!isStarted || isSubmitted) return;

//     if (timeRemainingSeconds <= 0) {
//       setTimeUp(true);
//       setShowSubmitDialog(true);
//       return;
//     }

//     const interval = window.setInterval(() => {
//       const currentTime = useCbtStore.getState().timeRemainingSeconds;

//       if (currentTime <= 1) {
//         setTimeRemaining(0);
//         setTimeUp(true);
//         setShowSubmitDialog(true);
//         window.clearInterval(interval);
//         return;
//       }

//       setTimeRemaining(currentTime - 1);
//     }, 1000);

//     return () => window.clearInterval(interval);
//   }, [
//     isStarted,
//     isSubmitted,
//     timeRemainingSeconds,
//     setTimeRemaining,
//   ]);

//   // Subject tabs with per-subject answered counts
//   const subjectTabs = useMemo(
//     () =>
//       subjects.map((subject, index) => {
//         const subjectQuestions = questions.filter(
//           (question) => question.subjectId === subject._id,
//         );

//         const subjectQuestionIds = new Set(
//           subjectQuestions.map((question) => question._id),
//         );

//         const answered = Object.keys(answers ?? {}).filter(
//           (questionId) =>
//             subjectQuestionIds.has(questionId) &&
//             answers[questionId] !== undefined &&
//             answers[questionId] !== null &&
//             String(answers[questionId]).trim() !== "",
//         ).length;

//         return {
//           id: subject._id,
//           name: subject.name,
//           answered,
//           total: subjectQuestions.length,
//           index,
//         };
//       }),
//     [subjects, questions, answers],
//   );

//   // Subject selection
//   const handleSelectSubject = (subjectId: string) => {
//     if (!isStarted || isSubmitted) return;

//     const subjectIndex = subjects.findIndex(
//       (subject) => subject._id === subjectId,
//     );

//     if (subjectIndex === -1) return;

//     const firstQuestionIndex = questions.findIndex(
//       (question) => question.subjectId === subjectId,
//     );

//     if (firstQuestionIndex === -1) return;

//     setCurrentSubject(subjectIndex);
//     setCurrentQuestion(firstQuestionIndex);
//   };

//   // Answer selection
//   const handleAnswer = (answer: string) => {
//     if (!currentQuestion || !isStarted || isSubmitted) return;
//     if (!answer || !answer.trim()) return;

//     selectAnswer(currentQuestion._id, answer);
//   };

//   // Question navigation
//   const handleQuestionSelect = (index: number) => {
//     if (!isStarted || isSubmitted) return;
//     if (index < 0 || index >= questions.length) return;

//     setCurrentQuestion(index);
//   };

//   const handleNext = () => {
//     if (!isStarted || isSubmitted) return;
//     nextQuestion();
//   };

//   const handlePrevious = () => {
//     if (!isStarted || isSubmitted) return;
//     previousQuestion();
//   };

//   // Flag current question
//   const handleToggleFlag = () => {
//     if (!currentQuestion || !isStarted || isSubmitted) return;
//     toggleFlag(currentQuestion._id);
//   };

//   // Submit practice
//   const handleSubmit = async () => {
//     if (isSubmitting || isSubmitted || !hasQuestions) return;

//     const currentPracticeId = practiceId?.trim();

//     if (!currentPracticeId) {
//       markSessionFailed(
//         "Practice ID is missing. The practice cannot be submitted.",
//       );
//       return;
//     }

//     const submissionQuestions = questions.map((question) => ({
//       questionId: question._id,
//       selectedOption: getStudentAnswerLabel(
//         question,
//         answers[question._id] ?? null,
//       ),
//     }));

//     setIsSubmitting(true);

//     try {
//       const backendResult = await markPracticeSession(
//         currentPracticeId,
//         submissionQuestions,
//       );

//       if (!backendResult) {
//         throw new Error("Backend returned no result.");
//       }

//       const backendData = backendResult.data ?? backendResult;
//       const percentage = Number(backendData.percentage ?? 0);
//       const questionCount = Number(
//         backendData.questionCount ?? questions.length,
//       );

//       const finalResult = {
//         practiceId: currentPracticeId,
//         totalQuestions: questionCount,
//         correctAnswers: Number(backendData.correctAnswers ?? 0),
//         incorrectAnswers: Number(backendData.wrongAnswers ?? 0),
//         unansweredQuestions: Number(
//           backendData.unansweredQuestions ?? 0,
//         ),
//         score: Number(backendData.score ?? 0),
//         totalScore: questionCount,
//         percentage,
//         totalPointsAwarded: Number(
//           backendData.totalPointsAwarded ?? 0,
//         ),
//         durationInMinutes,
//         submittedAt:
//           backendData.submittedAt ?? new Date().toISOString(),
//         passed: percentage >= 50,
//         grade:
//           percentage >= 70
//             ? "A"
//             : percentage >= 60
//               ? "B"
//               : percentage >= 50
//                 ? "C"
//                 : percentage >= 45
//                   ? "D"
//                   : "F",
//       };

//       setResult(finalResult);
//       markSessionCompleted(finalResult);
//       setShowSubmitDialog(false);
//       setTimeUp(false);
//       setShowSummary(true);
//     } catch (error) {
//       console.error("Practice submission failed:", error);

//       markSessionFailed(
//         error instanceof Error
//           ? error.message
//           : "Failed to submit practice session.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleTimeUp = () => {
//     if (isSubmitted) return;

//     setTimeUp(true);
//     setShowSubmitDialog(true);
//   };

//   const handleExit = () => {
//     resetSession();
//     clearStoredPracticeId();
//     router.push("/student/practice");
//   };

//   const handleBackToPractice = () => {
//     resetSession();
//     clearStoredPracticeId();
//     router.push("/student/practice");
//   };

//   // Shared background
//   const background = (
//     <div className="pointer-events-none fixed inset-0">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
//     </div>
//   );

//   // No questions
//   if (!hasQuestions) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {background}

//         <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
//           <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-500/10 text-amber-400">
//               <AlertCircle className="h-8 w-8" />
//             </div>

//             <h1 className="mt-5 text-2xl font-black">
//               No Practice Questions
//             </h1>

//             <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
//               We could not find any questions for this practice.
//               Please go back and start a new practice.
//             </p>

//             <button
//               type="button"
//               onClick={() => router.push("/student/practice")}
//               className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold transition hover:bg-blue-500"
//             >
//               <RotateCcw className="h-4 w-4" />
//               Back to Practice
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Initialization
//   if (!initialized) {
//     return (
//       <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
//         {background}

//         <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm">
//           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
//             <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
//           </div>

//           <h1 className="mt-5 text-xl font-black">
//             Preparing your practice
//           </h1>

//           <p className="mt-2 text-sm text-slate-400">
//             Preparing your questions...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   // Session error
//   if (sessionStatus === "failed" && !isStarted && !isSubmitted) {
//     return (
//       <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
//         {background}

//         <div className="relative w-full max-w-lg rounded-3xl border border-red-400/20 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm">
//           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-400">
//             <AlertCircle className="h-8 w-8" />
//           </div>

//           <h1 className="mt-5 text-2xl font-black">
//             Unable to start practice
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-slate-400">
//             {sessionError ??
//               "Something went wrong while preparing your practice."}
//           </p>

//           <button
//             type="button"
//             onClick={handleBackToPractice}
//             className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold transition hover:bg-blue-500"
//           >
//             <RotateCcw className="h-4 w-4" />
//             Back to Practice
//           </button>
//         </div>
//       </main>
//     );
//   }

//   // Exam summary
//   if (isSubmitted && showSummary) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {background}

//         <div className="relative mx-auto max-w-5xl px-4 py-8">
//           <div className="mb-6">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
//                 Practice Complete
//               </span>

//               <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-bold text-slate-400">
//                 Results
//               </span>
//             </div>

//             <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
//               Practice Summary
//             </h1>

//             <p className="mt-2 text-sm text-slate-400">
//               Here is your performance for this practice session.
//             </p>
//           </div>

//           <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-sm">
//             <CbtExamSummary
//               totalQuestions={result?.totalQuestions ?? questions.length}
//               answeredQuestions={
//                 result?.totalQuestions !== undefined
//                   ? Math.max(
//                       0,
//                       (result.totalQuestions ?? questions.length) -
//                         (result.unansweredQuestions ?? unansweredCount),
//                     )
//                   : answeredCount
//               }
//               unansweredQuestions={
//                 result?.unansweredQuestions ?? unansweredCount
//               }
//               flaggedQuestions={flaggedCount}
//               correctAnswers={result?.correctAnswers ?? 0}
//               score={result?.score ?? 0}
//               percentage={result?.percentage ?? 0}
//               totalPointsAwarded={Number(
//                 result?.totalPointsAwarded ?? 0,
//               )}
//             />
//           </div>

//           {result && (
//             <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm">
//               <div className="mb-5">
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
//                   Performance Details
//                 </p>

//                 <h2 className="mt-1 text-lg font-black">
//                   Your Results
//                 </h2>
//               </div>

//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                 {result.score !== undefined && (
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//                     <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Score
//                     </p>
//                     <p className="mt-1 text-2xl font-black">
//                       {result.score}
//                       {result.totalScore !== undefined &&
//                         ` / ${result.totalScore}`}
//                     </p>
//                   </div>
//                 )}

//                 {result.percentage !== undefined && (
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//                     <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Percentage
//                     </p>
//                     <p className="mt-1 text-2xl font-black text-blue-400">
//                       {result.percentage}%
//                     </p>
//                   </div>
//                 )}

//                 {result.correctAnswers !== undefined && (
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//                     <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Correct
//                     </p>
//                     <p className="mt-1 text-2xl font-black text-emerald-400">
//                       {result.correctAnswers}
//                     </p>
//                   </div>
//                 )}

//                 {result.grade && (
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//                     <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Grade
//                     </p>
//                     <p className="mt-1 text-2xl font-black">
//                       {result.grade}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {result.passed !== undefined && (
//                 <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
//                   <div
//                     className={[
//                       "flex h-9 w-9 items-center justify-center rounded-full",
//                       result.passed
//                         ? "bg-emerald-500/10"
//                         : "bg-red-500/10",
//                     ].join(" ")}
//                   >
//                     <CheckCircle2
//                       className={[
//                         "h-5 w-5",
//                         result.passed
//                           ? "text-emerald-400"
//                           : "text-red-400",
//                       ].join(" ")}
//                     />
//                   </div>

//                   <span className="text-sm font-bold text-slate-300">
//                     {result.passed
//                       ? "You passed this practice."
//                       : "You did not pass this practice."}
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="mt-6 flex justify-center">
//             <button
//               type="button"
//               onClick={handleBackToPractice}
//               className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold shadow-lg transition hover:bg-blue-500"
//             >
//               <RotateCcw className="h-4 w-4" />
//               Back to Practice
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Main CBT screen
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       {background}

//       <div className="relative">
//         <CbtHeader
//           subjectName={currentSubject?.name ?? "Practice Examination"}
//           questionNumber={
//             showQuestionProgress ? currentQuestionIndex + 1 : 0
//           }
//           totalQuestions={showQuestionProgress ? questions.length : 0}
//           durationInMinutes={durationInMinutes}
//           timeRemainingSeconds={timeRemainingSeconds}
//           onTimeUp={handleTimeUp}
//           onSubmit={() => setShowSubmitDialog(true)}
//           onExit={handleExit}
//         />

//         {isStarted && (
//           <div className="border-b border-emerald-400/10 bg-emerald-500/[0.06]">
//             <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-bold text-emerald-300">
//               <span className="flex items-center gap-2">
//                 <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
//                 Practice in progress
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
//           <div className="mx-auto max-w-7xl px-4 py-3">
//             <CbtSubjectTabs
//               subjects={subjectTabs}
//               activeSubjectId={currentSubject?._id ?? ""}
//               onSelectSubject={handleSelectSubject}
//             />
//           </div>
//         </div>

//         {/* One full-width column. Progress sits above the question. */}
//         <div className="mx-auto w-full max-w-5xl px-4 py-6">
//           <section className="min-w-0">
//             {showQuestionProgress && (
//               <div className="mb-6 space-y-4">
//                 {/* Question number navigator */}
//                 <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-xl backdrop-blur-sm sm:p-5">
//                   <CbtQuestionNavigator
//                     questionIds={questions.map(
//                       (question) => question._id,
//                     )}
//                     currentQuestionIndex={currentQuestionIndex}
//                     answers={answers}
//                     flaggedQuestions={flaggedQuestions}
//                     onSelectQuestion={handleQuestionSelect}
//                   />
//                 </div>

//                 {/* Session Progress */}
//                 <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl backdrop-blur-sm">
//                   <div className="flex flex-wrap items-center justify-between gap-4">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
//                         <Clock3 className="h-5 w-5" />
//                       </div>

//                       <div>
//                         <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
//                           Session
//                         </p>
//                         <h3 className="mt-1 text-sm font-black">
//                           Progress
//                         </h3>
//                       </div>
//                     </div>

//                     <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300">
//                       {Math.round(
//                         (answeredCount / questions.length) * 100,
//                       )}
//                       % completed
//                     </span>
//                   </div>

//                   <div className="mt-5 grid grid-cols-3 gap-3">
//                     <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.06] p-3">
//                       <p className="text-xs text-slate-400">Answered</p>
//                       <p className="mt-1 text-xl font-black text-emerald-400">
//                         {answeredCount}
//                       </p>
//                     </div>

//                     <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
//                       <p className="text-xs text-slate-400">Unanswered</p>
//                       <p className="mt-1 text-xl font-black">
//                         {unansweredCount}
//                       </p>
//                     </div>

//                     <div className="rounded-2xl border border-amber-400/10 bg-amber-500/[0.06] p-3">
//                       <p className="text-xs text-slate-400">Flagged</p>
//                       <p className="mt-1 text-xl font-black text-amber-400">
//                         {flaggedCount}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500 transition-all duration-300"
//                       style={{
//                         width: `${Math.min(
//                           100,
//                           (answeredCount / questions.length) * 100,
//                         )}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Current question */}
//             {currentQuestion && (
//               <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-1 shadow-2xl backdrop-blur-sm">
//                 <CbtQuestionCard
//                   question={currentQuestion}
//                   questionNumber={
//                     showQuestionProgress
//                       ? currentQuestionIndex + 1
//                       : 0
//                   }
//                   selectedAnswer={currentAnswer}
//                   onSelectAnswer={handleAnswer}
//                   isFlagged={isCurrentQuestionFlagged}
//                   onToggleFlag={handleToggleFlag}
//                 />
//               </div>
//             )}

//             {/* Flag control */}
//             {currentQuestion && (
//               <div className="mt-4">
//                 <button
//                   type="button"
//                   onClick={handleToggleFlag}
//                   disabled={!isStarted || isSubmitted}
//                   className={[
//                     "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition",
//                     isCurrentQuestionFlagged
//                       ? "border-amber-400/30 bg-amber-500/10 text-amber-300"
//                       : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-amber-400/30 hover:bg-amber-500/10 hover:text-amber-300",
//                     "disabled:cursor-not-allowed disabled:opacity-50",
//                   ].join(" ")}
//                 >
//                   <Flag className="h-4 w-4" />
//                   {isCurrentQuestionFlagged
//                     ? "Unflag Question"
//                     : "Flag Question"}
//                 </button>
//               </div>
//             )}

//             {/* Previous / next / submit */}
//             <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-xl backdrop-blur-sm sm:p-5">
//               <CbtNavigation
//                 isFirstQuestion={currentQuestionIndex === 0}
//                 isLastQuestion={
//                   currentQuestionIndex === questions.length - 1
//                 }
//                 questionNumber={
//                   showQuestionProgress
//                     ? currentQuestionIndex + 1
//                     : 0
//                 }
//                 totalQuestions={
//                   showQuestionProgress ? questions.length : 0
//                 }
//                 onPrevious={handlePrevious}
//                 onNext={handleNext}
//                 onSubmit={() => setShowSubmitDialog(true)}
//               />
//             </div>
//           </section>
//         </div>

//         <CbtSubmitDialog
//           open={showSubmitDialog}
//           answeredQuestions={answeredCount}
//           totalQuestions={questions.length}
//           onCancel={() => {
//             if (!timeUp) {
//               setShowSubmitDialog(false);
//             }
//           }}
//           onConfirm={handleSubmit}
//           isSubmitting={isSubmitting}
//           timeUp={timeUp}
//         />
//       </div>
//     </main>
//   );
// }
