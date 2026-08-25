





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Trophy,
  Target,
  Clock3,
  TrendingUp,
  BookOpen,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ============================================================
   TEMPORARY RESULT DATA

   Later this will come from the completed CBT session/API.
============================================================ */

const resultData = {
  score: 76,
  totalQuestions: 40,
  correctAnswers: 30,
  wrongAnswers: 10,
  unanswered: 0,
  durationUsed: "55 mins",
  date: "12 Aug 2026",
};

const previousResults = [
  {
    id: "1",
    subject: "Mathematics",
    score: 76,
    questions: 40,
    duration: "55 mins",
    date: "12 Aug 2026",
  },
  {
    id: "2",
    subject: "Mathematics",
    score: 68,
    questions: 40,
    duration: "58 mins",
    date: "08 Aug 2026",
  },
  {
    id: "3",
    subject: "Mathematics",
    score: 61,
    questions: 40,
    duration: "60 mins",
    date: "03 Aug 2026",
  },
];

export default function PracticeResultsPage() {
  const params = useParams();

  const subject = String(
    params.subject ?? "subject"
  ).replace("-", " ");

  const {
    score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unanswered,
    durationUsed,
    date,
  } = resultData;

  const grade =
    score >= 70
      ? "A"
      : score >= 60
        ? "B"
        : score >= 50
          ? "C"
          : score >= 40
            ? "D"
            : "F";

  const performanceMessage =
    score >= 80
      ? "Excellent performance! You are demonstrating strong mastery."
      : score >= 70
        ? "Great work! You are building strong examination confidence."
        : score >= 60
          ? "Good effort. Keep practising to push your score higher."
          : "Keep practising. Every attempt is an opportunity to improve.";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="mb-8">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold capitalize text-blue-700">
            Practice Centre
          </span>

          <h1 className="mt-4 text-3xl font-black capitalize text-slate-900 sm:text-4xl">
            {subject} Practice Result
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review your performance, identify areas to improve,
            and prepare for your next CBT practice.
          </p>
        </div>

        {/* ============================================================
            MAIN RESULT
        ============================================================ */}

        <Card className="mb-8 overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_280px]">

            {/* Score */}

            <div className="p-6 text-center sm:p-10 lg:text-left">
              <div className="flex flex-col items-center lg:items-start">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>

                <p className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Your Score
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-6xl font-black text-blue-600">
                    {score}%
                  </span>

                  <span className="text-slate-400">
                    / 100
                  </span>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Grade {grade}
                </div>

                <p className="mt-5 max-w-xl text-slate-600">
                  {performanceMessage}
                </p>

              </div>
            </div>

            {/* Summary */}

            <div className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0">
              <h2 className="font-black text-slate-900">
                Test Summary
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Questions
                  </span>

                  <span className="font-bold text-slate-900">
                    {totalQuestions}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Correct
                  </span>

                  <span className="font-bold text-emerald-600">
                    {correctAnswers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Wrong
                  </span>

                  <span className="font-bold text-red-600">
                    {wrongAnswers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Unanswered
                  </span>

                  <span className="font-bold text-slate-700">
                    {unanswered}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Time Used
                  </span>

                  <span className="font-bold text-slate-900">
                    {durationUsed}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </Card>

        {/* ============================================================
            PERFORMANCE STATS
        ============================================================ */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card className="text-center">
            <Target className="mx-auto h-7 w-7 text-blue-600" />

            <p className="mt-3 text-2xl font-black text-slate-900">
              {correctAnswers}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Correct Answers
            </p>
          </Card>

          <Card className="text-center">
            <BookOpen className="mx-auto h-7 w-7 text-red-500" />

            <p className="mt-3 text-2xl font-black text-slate-900">
              {wrongAnswers}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Wrong Answers
            </p>
          </Card>

          <Card className="text-center">
            <Clock3 className="mx-auto h-7 w-7 text-purple-600" />

            <p className="mt-3 text-2xl font-black text-slate-900">
              {durationUsed}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Time Used
            </p>
          </Card>

          <Card className="text-center">
            <Award className="mx-auto h-7 w-7 text-amber-500" />

            <p className="mt-3 text-2xl font-black text-slate-900">
              {grade}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Performance Grade
            </p>
          </Card>

        </div>

        {/* ============================================================
            ACTIONS
        ============================================================ */}

        <Card className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-black text-slate-900">
                What would you like to do next?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review your answers or attempt another
                {` ${subject}`} practice test.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <Link
                href={`/student/practice/${params.subject}/review`}
              >
                <Button
                  variant="outline"
                  rightIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
                  Review Answers
                </Button>
              </Link>

              <Link
                href={`/student/practice/${params.subject}/session?mode=full&questions=40&duration=60`}
              >
                <Button
                  rightIcon={
                    <RotateCcw className="h-4 w-4" />
                  }
                >
                  Try Again
                </Button>
              </Link>

            </div>
          </div>
        </Card>

        {/* ============================================================
            PREVIOUS ATTEMPTS
        ============================================================ */}

        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Previous Attempts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your progress across practice sessions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {previousResults.map((result) => (
              <Card
                key={result.id}
                className="p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h3 className="font-bold capitalize text-slate-900">
                      {result.subject}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        {result.questions} questions
                      </span>

                      <span>
                        {result.duration}
                      </span>

                      <span>
                        {result.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">

                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">
                        {result.score}%
                      </p>

                      <p className="text-xs text-slate-400">
                        Score
                      </p>
                    </div>

                    <Link
                      href={`/student/practice/${params.subject}/review/${result.id}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Review
                      </Button>
                    </Link>

                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ============================================================
            BOTTOM CTA
        ============================================================ */}

        <Card className="mt-10 text-center">

          <TrendingUp className="mx-auto h-10 w-10 text-green-600" />

          <h2 className="mt-4 text-2xl font-black text-slate-900">
            Keep Improving
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Consistent practice is the key to improving your
            speed, accuracy and confidence before JAMB.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

            <Link href="/student/practice">
              <Button size="lg">
                Practice Another Subject
              </Button>
            </Link>

            <Link href="/student/dashboard">
              <Button
                size="lg"
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </Link>

          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-400">
          JAMB League • Practice consistently. Improve continuously.
        </p>

      </div>
    </main>
  );
}