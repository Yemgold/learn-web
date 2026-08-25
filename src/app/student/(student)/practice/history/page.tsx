




"use client";

import Link from "next/link";
import {
  BookOpen,
  Clock3,
  CalendarDays,
  Trophy,
  ArrowRight,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const history = [
  {
    id: "attempt-001",
    subject: "Use of English",
    score: 82,
    questions: 60,
    duration: "48 mins",
    completedAt: "15 Aug 2026",
  },
  {
    id: "attempt-002",
    subject: "Mathematics",
    score: 76,
    questions: 50,
    duration: "55 mins",
    completedAt: "12 Aug 2026",
  },
  {
    id: "attempt-003",
    subject: "Biology",
    score: 91,
    questions: 40,
    duration: "39 mins",
    completedAt: "08 Aug 2026",
  },
  {
    id: "attempt-004",
    subject: "Physics",
    score: 73,
    questions: 40,
    duration: "44 mins",
    completedAt: "05 Aug 2026",
  },
  {
    id: "attempt-005",
    subject: "Chemistry",
    score: 88,
    questions: 40,
    duration: "42 mins",
    completedAt: "02 Aug 2026",
  },
];

export default function PracticeHistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Practice Centre
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            Practice History
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            View every practice session you've completed,
            review your answers, and monitor your improvement
            over time.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <Card hoverable className="text-center">
            <BookOpen className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">
              {history.length}
            </h2>

            <p className="mt-2 text-slate-600">
              Total Practice Sessions
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold">
              84%
            </h2>

            <p className="mt-2 text-slate-600">
              Average Score
            </p>
          </Card>

          <Card hoverable className="text-center">
            <TrendingUp className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              +18%
            </h2>

            <p className="mt-2 text-slate-600">
              Overall Improvement
            </p>
          </Card>
        </div>

        {/* History List */}
        <div className="space-y-6">
          {history.map((attempt) => (
            <Card
              key={attempt.id}
              hoverable
              className="p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {attempt.subject}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {attempt.completedAt}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {attempt.duration}
                    </span>

                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {attempt.questions} Questions
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-xl bg-blue-100 px-6 py-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {attempt.score}%
                    </p>

                    <p className="text-sm text-blue-600">
                      Score
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/student/practice/review/${attempt.id}`}
                    >
                      <Button
                        variant="outline"
                        rightIcon={
                          <ArrowRight className="h-4 w-4" />
                        }
                      >
                        Review
                      </Button>
                    </Link>

                    <Link href="/student/practice/subjects">
                      <Button
                        leftIcon={
                          <RotateCcw className="h-4 w-4" />
                        }
                      >
                        Practice Again
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-10 text-center">
          <h2 className="text-2xl font-bold">
            Keep Improving
          </h2>

          <p className="mt-3 text-slate-600">
            The more you practise, the better your chances of
            achieving an excellent JAMB score.
          </p>

          <div className="mt-6">
            <Link href="/student/practice/subjects">
              <Button size="lg">
                Start New Practice
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}