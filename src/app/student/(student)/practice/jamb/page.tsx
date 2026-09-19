



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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ==================================================
          BACKGROUND IDENTITY
         ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-10">
        {/* ==================================================
            HEADER
           ================================================== */}

        <div className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-300">
                JAMB Practice
              </span>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
                JAMB Practice Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-400">
                Prepare for JAMB with past questions, timed CBT practice,
                subject-based practice, and performance tracking.
              </p>
            </div>

            {/* Back to examination selection */}

            <Link
              href="/student/practice"
              className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Change Examination
            </Link>
          </div>
        </div>

        {/* ==================================================
            STATISTICS
           ================================================== */}

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <BookOpen className="mx-auto h-10 w-10 text-blue-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              12
            </h2>

            <p className="mt-2 text-slate-400">
              Tests Taken
            </p>
          </Card>

          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <Target className="mx-auto h-10 w-10 text-green-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              82%
            </h2>

            <p className="mt-2 text-slate-400">
              Average Score
            </p>
          </Card>

          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <Clock3 className="mx-auto h-10 w-10 text-orange-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              18h
            </h2>

            <p className="mt-2 text-slate-400">
              Study Time
            </p>
          </Card>

          <Card
            hoverable
            className="border border-white/10 bg-white/[0.04] text-center shadow-none"
          >
            <BarChart3 className="mx-auto h-10 w-10 text-purple-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              +15%
            </h2>

            <p className="mt-2 text-slate-400">
              Improvement
            </p>
          </Card>
        </div>

        {/* ==================================================
            MAIN PRACTICE OPTIONS
           ================================================== */}

        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Start Practising
            </h2>

            <p className="mt-2 text-slate-400">
              Choose how you want to prepare for JAMB.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ==================================================
                PAST QUESTIONS
               ================================================== */}

            <Card
              hoverable
              className="relative overflow-hidden border border-white/10 bg-white/[0.04] shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <Brain className="h-7 w-7 text-blue-400" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                Practice Past Questions
              </h3>

              <p className="mt-3 leading-6 text-slate-400">
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
              className="relative overflow-hidden border border-white/10 bg-white/[0.04] shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
                <Clock3 className="h-7 w-7 text-green-400" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                JAMB CBT Simulation
              </h3>

              <p className="mt-3 leading-6 text-slate-400">
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
              className="relative overflow-hidden border border-white/10 bg-white/[0.04] shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                <BookMarked className="h-7 w-7 text-purple-400" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                Practice History
              </h3>

              <p className="mt-3 leading-6 text-slate-400">
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
            <h2 className="text-2xl font-bold text-white">
              JAMB Preparation Tools
            </h2>

            <p className="mt-2 text-slate-400">
              More ways to improve your JAMB preparation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* ==================================================
                QUICK PRACTICE
               ================================================== */}

            <Card
              hoverable
              className="border border-white/10 bg-white/[0.04] shadow-none"
            >
              <Zap className="h-10 w-10 text-orange-400" />

              <h3 className="mt-4 text-xl font-bold text-white">
                Quick Practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Answer a quick set of JAMB questions and test
                yourself without starting a full session.
              </p>

              <Link
                // href="/student/practice/combination?exam=jamb&mode=quick"
                href="/student/practice/jamb/combination/subjects"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
              >
                Practice Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            {/* ==================================================
                SUBJECT PRACTICE
               ================================================== */}

            <Card
              hoverable
              className="border border-white/10 bg-white/[0.04] shadow-none"
            >
              <BookOpen className="h-10 w-10 text-blue-400" />

              <h3 className="mt-4 text-xl font-bold text-white">
                Subject Practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Focus on individual JAMB subjects and improve
                your performance one subject at a time.
              </p>

              <Link
                href="/student/practice/jamb/combination"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
              >
                Choose Subject
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            {/* ==================================================
                PERFORMANCE
               ================================================== */}

            <Card
              hoverable
              className="border border-white/10 bg-white/[0.04] shadow-none"
            >
              <Trophy className="h-10 w-10 text-yellow-400" />

              <h3 className="mt-4 text-xl font-bold text-white">
                Performance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Track your JAMB progress, identify weak areas,
                and monitor your improvement.
              </p>

              <Link
                href="/student/practice/history?exam=jamb"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
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
          <Card className="border border-white/10 bg-white/[0.04] shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
                  <History className="h-6 w-6 text-slate-400" />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Recent JAMB Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
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