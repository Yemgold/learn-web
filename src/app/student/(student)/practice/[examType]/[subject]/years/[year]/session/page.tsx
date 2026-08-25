"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Flag,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  usePracticeStore,
  type PracticeQuestion,
} from "@/stores/practiceStore";

import { PracticeSessionHeader } from "@/components/practice/session/PracticeSessionHeader";

import QuestionNavigator from "@/components/practice/session/QuestionNavigator";

import { PracticeQuestionCard } from "@/components/practice/session/PracticeQuestionCard";

import { PracticeNavigation } from "@/components/practice/session/PracticeNavigation";

export default function PracticeSessionPage() {
  const params = useParams();

  /* ============================================================
     ROUTE PARAMS
     ============================================================ */

  const examType =
    typeof params.examType === "string"
      ? params.examType.toLowerCase()
      : "";

  const subjectSlug =
    typeof params.subject === "string"
      ? params.subject
      : "";

  const year =
    typeof params.year === "string"
      ? params.year
      : "";

  /* ============================================================
     PRACTICE STORE
     ============================================================ */

  const questions = usePracticeStore(
    (state) => state.questions
  );

  const session = usePracticeStore(
    (state) => state.session
  );

  const nextQuestion = usePracticeStore(
    (state) => state.nextQuestion
  );

  const previousQuestion = usePracticeStore(
    (state) => state.previousQuestion
  );

  const setCurrentQuestion = usePracticeStore(
    (state) => state.setCurrentQuestion
  );

  const selectAnswer = usePracticeStore(
    (state) => state.selectAnswer
  );

  /* ============================================================
     BACK TO YEARS URL
     ============================================================ */

  const yearsUrl =
    `/student/practice/${examType}/${subjectSlug}/years`;

  /* ============================================================
     NO SESSION / QUESTIONS
     ============================================================ */

  if (!session || !questions.length) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl p-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Flag className="h-7 w-7 text-slate-500" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              No Practice Session Found
            </h1>

            <p className="mt-3 text-slate-600">
              Your practice questions are not
              available. Please go back and
              select a year again.
            </p>

            <div className="mt-6">
              <Link href={yearsUrl}>
                <Button
                  fullWidth
                  leftIcon={
                    <ArrowLeft className="h-4 w-4" />
                  }
                >
                  Back to Years
                </Button>
              </Link>
            </div>

          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     CURRENT QUESTION
     ============================================================ */

  const currentQuestionIndex =
    session.currentQuestionIndex;

  const currentQuestion:
    | PracticeQuestion
    | undefined =
    questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl p-8 text-center">

            <h1 className="text-xl font-bold text-slate-900">
              Question Not Found
            </h1>

            <p className="mt-2 text-slate-600">
              The current question could not
              be loaded.
            </p>

            <div className="mt-6">
              <Link href={yearsUrl}>
                <Button
                  fullWidth
                  leftIcon={
                    <ArrowLeft className="h-4 w-4" />
                  }
                >
                  Back to Years
                </Button>
              </Link>
            </div>

          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     ANSWER
     ============================================================ */

  const selectedAnswer =
    session.answers[currentQuestion._id];

  /* ============================================================
     PROGRESS
     ============================================================ */

  const questionNumber =
    currentQuestionIndex + 1;

  const totalQuestions =
    questions.length;

  const isFirstQuestion =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex ===
    totalQuestions - 1;

  /* ============================================================
     HANDLERS
     ============================================================ */

  const handleSelectAnswer = (
    answer: string
  ) => {
    selectAnswer(
      currentQuestion._id,
      answer
    );
  };

  const handleNext = () => {
    if (isLastQuestion) {
      return;
    }

    nextQuestion();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      return;
    }

    previousQuestion();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleQuestionNumber = (
    index: number
  ) => {
    setCurrentQuestion(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ============================================================
     UI
     ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">

      <PracticeSessionHeader
  examType={examType}
  subjectSlug={subjectSlug}
  year={year}
  subjectName={session.subjectName}
  questionNumber={questionNumber}
  totalQuestions={totalQuestions}
/>

      <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-10">

        <QuestionNavigator
          questions={questions}
          currentQuestionIndex={
            currentQuestionIndex
          }
          answers={session.answers}
          onQuestionSelect={
            handleQuestionNumber
          }
        />

        <PracticeQuestionCard
          question={currentQuestion}
          questionNumber={questionNumber}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={
            handleSelectAnswer
          }
        />

        <PracticeNavigation
          isFirstQuestion={
            isFirstQuestion
          }
          isLastQuestion={
            isLastQuestion
          }
          questionNumber={
            questionNumber
          }
          totalQuestions={
            totalQuestions
          }
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

      </div>
    </main>
  );
}








