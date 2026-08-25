




"use client";

import Link from "next/link";
import {
  Brain,
  Clock3,
  Target,
  ArrowRight,
  BarChart3,
  BookMarked,
  Trophy,
  BookOpen,
  History,
  Zap,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ============================================================
   JAMB PRACTICE DASHBOARD
   ============================================================ */

export default function JambPracticePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* ==================================================
            HEADER
           ================================================== */}

        <div className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                JAMB Practice
              </span>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                JAMB Practice Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-600">
                Prepare for JAMB with past questions, timed CBT practice,
                subject-based practice, and performance tracking.
              </p>
            </div>

            {/* Back to examination selection */}

            <Link
              href="/student/practice"
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              Change Examination
            </Link>
          </div>
        </div>

        {/* ==================================================
            STATISTICS
           ================================================== */}

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card hoverable className="text-center">
            <BookOpen className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              12
            </h2>

            <p className="mt-2 text-slate-600">
              Tests Taken
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Target className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              82%
            </h2>

            <p className="mt-2 text-slate-600">
              Average Score
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Clock3 className="mx-auto h-10 w-10 text-orange-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              18h
            </h2>

            <p className="mt-2 text-slate-600">
              Study Time
            </p>
          </Card>

          <Card hoverable className="text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-purple-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              +15%
            </h2>

            <p className="mt-2 text-slate-600">
              Improvement
            </p>
          </Card>
        </div>

        {/* ==================================================
            MAIN PRACTICE OPTIONS
           ================================================== */}

        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Start Practising
            </h2>

            <p className="mt-2 text-slate-600">
              Choose how you want to prepare for JAMB.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ==================================================
                PAST QUESTIONS
               ================================================== */}

            <Card
              hoverable
              className="relative overflow-hidden"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <Brain className="h-7 w-7 text-blue-600" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                Practice Past Questions
              </h3>

              <p className="mt-3 leading-6 text-slate-600">
                Practise authentic JAMB questions by subject,
                year, topic, and question category.
              </p>

              <Link
                 href="/student/practice/jamb/combination"
                className="mt-6 inline-flex"
              >
                <Button
                  rightIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
                  Start Practice
                </Button>
              </Link>
            </Card>

            {/* ==================================================
                TIMED CBT
               ================================================== */}

            <Card
              hoverable
              className="relative overflow-hidden"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                <Clock3 className="h-7 w-7 text-green-600" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                JAMB CBT Simulation
              </h3>

              <p className="mt-3 leading-6 text-slate-600">
                Simulate the real JAMB CBT experience with
                timed questions and examination conditions.
              </p>

              <Link
                href="/student/practice/cbtsubjects?exam=jamb"
                className="mt-6 inline-flex"
              >
                <Button
                  variant="outline"
                  rightIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
                  Start CBT
                </Button>
              </Link>
            </Card>

            {/* ==================================================
                PRACTICE HISTORY
               ================================================== */}

            <Card
              hoverable
              className="relative overflow-hidden"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                <BookMarked className="h-7 w-7 text-purple-600" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                Practice History
              </h3>

              <p className="mt-3 leading-6 text-slate-600">
                Review your previous JAMB practice sessions,
                scores, accuracy, and improvement.
              </p>

              <Link
                href="/student/practice/history?exam=jamb"
                className="mt-6 inline-flex"
              >
                <Button
                  variant="secondary"
                  rightIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
                  View History
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* ==================================================
            ADDITIONAL JAMB TOOLS
           ================================================== */}

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              JAMB Preparation Tools
            </h2>

            <p className="mt-2 text-slate-600">
              More ways to improve your JAMB preparation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* ==================================================
                QUICK PRACTICE
               ================================================== */}

            <Card hoverable>
              <Zap className="h-10 w-10 text-orange-600" />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Quick Practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Answer a quick set of JAMB questions and test
                yourself without starting a full session.
              </p>

              <Link
                // href="/student/practice/combination?exam=jamb&mode=quick"
                href="/student/practice/jamb/combination/subjects"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600"
              >
                Practice Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            {/* ==================================================
                SUBJECT PRACTICE
               ================================================== */}

            <Card hoverable>
              <BookOpen className="h-10 w-10 text-blue-600" />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Subject Practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Focus on individual JAMB subjects and improve
                your performance one subject at a time.
              </p>

              <Link
                
                href="/student/practice/jamb/combination"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600"
              >
                Choose Subject
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            {/* ==================================================
                PERFORMANCE
               ================================================== */}

            <Card hoverable>
              <Trophy className="h-10 w-10 text-yellow-600" />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Performance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Track your JAMB progress, identify weak areas,
                and monitor your improvement.
              </p>

              <Link
                href="/student/practice/history?exam=jamb"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600"
              >
                View Performance
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>

        {/* ==================================================
            RECENT ACTIVITY
           ================================================== */}

        <div className="mt-10">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <History className="h-6 w-6 text-slate-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Recent JAMB Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Keep track of your latest practice sessions.
                  </p>
                </div>
              </div>

              <Link href="/student/practice/history?exam=jamb">
                <Button
                  variant="outline"
                  rightIcon={
                    <ArrowRight className="h-4 w-4" />
                  }
                >
                  View All
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}