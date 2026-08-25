




"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  CircleHelp,
  Clock3,
  Target,
  Trophy,
  RotateCcw,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ============================================================
   TEMPORARY REVIEW DATA
   Replace this later with your database/API response.
   ============================================================ */

const reviewQuestions = [
  {
    id: 1,
    question:
      "If x + 5 = 12, what is the value of x?",
    options: ["5", "6", "7", "8"],
    selectedAnswer: "7",
    correctAnswer: "7",
    explanation:
      "Subtract 5 from both sides of the equation: x = 12 − 5 = 7.",
  },
  {
    id: 2,
    question:
      "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    selectedAnswer: "11",
    correctAnswer: "12",
    explanation:
      "12 × 12 = 144, therefore the square root of 144 is 12.",
  },
  {
    id: 3,
    question:
      "Which of the following represents a prime number?",
    options: ["9", "15", "17", "21"],
    selectedAnswer: "17",
    correctAnswer: "17",
    explanation:
      "17 has only two factors: 1 and 17, so it is a prime number.",
  },
  {
    id: 4,
    question:
      "What is 25% of 200?",
    options: ["25", "40", "50", "75"],
    selectedAnswer: "50",
    correctAnswer: "50",
    explanation:
      "25% = 25/100. Therefore, 25/100 × 200 = 50.",
  },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function PracticeReviewPage() {
  const params = useParams();

  const subject = String(params.subject ?? "mathematics");
  const attemptId = String(params.attemptId ?? "1");

  const totalQuestions = reviewQuestions.length;

  const correctAnswers = reviewQuestions.filter(
    (question) =>
      question.selectedAnswer === question.correctAnswer
  ).length;

  const incorrectAnswers = reviewQuestions.filter(
    (question) =>
      question.selectedAnswer &&
      question.selectedAnswer !== question.correctAnswer
  ).length;

  const unanswered = reviewQuestions.filter(
    (question) => !question.selectedAnswer
  ).length;

  const percentage =
    totalQuestions > 0
      ? Math.round(
          (correctAnswers / totalQuestions) * 100
        )
      : 0;

  const subjectName =
    subject.charAt(0).toUpperCase() +
    subject.slice(1);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">

        {/* ======================================================
            TOP NAVIGATION
            ====================================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            href="/student/practice/results"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Link>

          <div className="text-sm text-slate-500">
            Attempt #{attemptId}
          </div>
        </div>

        {/* ======================================================
            HEADER
            ====================================================== */}

        <div className="mb-8">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Answer Review
          </span>

          <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
            {subjectName} Practice Review
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Review your answers, understand your mistakes,
            and learn from every question.
          </p>
        </div>

        {/* ======================================================
            SCORE SUMMARY
            ====================================================== */}

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Score */}

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Score
                </p>

                <p className="text-2xl font-black text-slate-900">
                  {percentage}%
                </p>
              </div>
            </div>
          </Card>

          {/* Correct */}

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Correct
                </p>

                <p className="text-2xl font-black text-green-600">
                  {correctAnswers}
                </p>
              </div>
            </div>
          </Card>

          {/* Incorrect */}

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Incorrect
                </p>

                <p className="text-2xl font-black text-red-600">
                  {incorrectAnswers}
                </p>
              </div>
            </div>
          </Card>

          {/* Unanswered */}

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <CircleHelp className="h-5 w-5 text-slate-500" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Unanswered
                </p>

                <p className="text-2xl font-black text-slate-700">
                  {unanswered}
                </p>
              </div>
            </div>
          </Card>

        </div>

        {/* ======================================================
            REVIEW HEADER
            ====================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Question Review
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {totalQuestions} questions in this attempt
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4" />
            Practice Attempt
          </div>

        </div>

        {/* ======================================================
            QUESTIONS
            ====================================================== */}

        <div className="space-y-6">

          {reviewQuestions.map((question, index) => {

            const isCorrect =
              question.selectedAnswer ===
              question.correctAnswer;

            const isUnanswered =
              !question.selectedAnswer;

            return (
              <Card
                key={question.id}
                className="overflow-hidden"
              >

                {/* Question Header */}

                <div
                  className={[
                    "flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
                    isCorrect
                      ? "bg-green-50"
                      : isUnanswered
                        ? "bg-slate-50"
                        : "bg-red-50",
                  ].join(" ")}
                >

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-slate-700 shadow-sm">
                      {index + 1}
                    </span>

                    <span className="font-bold text-slate-800">
                      Question {index + 1}
                    </span>

                  </div>

                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Correct
                    </span>
                  ) : isUnanswered ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500">
                      <CircleHelp className="h-4 w-4" />
                      Not Answered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700">
                      <XCircle className="h-4 w-4" />
                      Incorrect
                    </span>
                  )}

                </div>

                {/* Question Body */}

                <div className="p-5 sm:p-6">

                  <h3 className="text-lg font-bold leading-7 text-slate-900">
                    {question.question}
                  </h3>

                  {/* Options */}

                  <div className="mt-6 space-y-3">

                    {question.options.map((option, optionIndex) => {

                      const isSelected =
                        question.selectedAnswer ===
                        option;

                      const isAnswer =
                        question.correctAnswer ===
                        option;

                      let optionStyle =
                        "border-slate-200 bg-white";

                      if (isAnswer) {
                        optionStyle =
                          "border-green-300 bg-green-50";
                      } else if (isSelected) {
                        optionStyle =
                          "border-red-300 bg-red-50";
                      }

                      return (
                        <div
                          key={option}
                          className={[
                            "flex items-center gap-3 rounded-xl border p-4",
                            optionStyle,
                          ].join(" ")}
                        >

                          <span
                            className={[
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                              isAnswer
                                ? "bg-green-600 text-white"
                                : isSelected
                                  ? "bg-red-600 text-white"
                                  : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                          </span>

                          <span className="flex-1 font-medium text-slate-800">
                            {option}
                          </span>

                          {isAnswer && (
                            <span className="text-xs font-bold text-green-700">
                              Correct Answer
                            </span>
                          )}

                          {isSelected &&
                            !isAnswer && (
                              <span className="text-xs font-bold text-red-700">
                                Your Answer
                              </span>
                            )}

                        </div>
                      );
                    })}

                  </div>

                  {/* Explanation */}

                  <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                    <div className="flex items-center gap-2">

                      <Target className="h-5 w-5 text-blue-600" />

                      <h4 className="font-bold text-blue-900">
                        Explanation
                      </h4>

                    </div>

                    <p className="mt-3 text-sm leading-6 text-blue-900/80">
                      {question.explanation}
                    </p>

                  </div>

                </div>

              </Card>
            );
          })}

        </div>

        {/* ======================================================
            BOTTOM ACTIONS
            ====================================================== */}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">

          <Link href="/student/practice/results">
            <Button
              variant="outline"
              leftIcon={
                <ArrowLeft className="h-4 w-4" />
              }
            >
              Back to Results
            </Button>
          </Link>

          <Link
            href={`/student/practice/${subject}`}
          >
            <Button
              rightIcon={
                <RotateCcw className="h-4 w-4" />
              }
            >
              Practice Again
            </Button>
          </Link>

        </div>

      </div>
    </main>
  );
}