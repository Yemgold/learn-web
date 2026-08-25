





"use client";

import Link from "next/link";

import {
  BookOpen,
  CheckCircle,
  Clock3,
  Target,
  Trophy,
  Zap,
  ArrowRight,
  Sparkles,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";

import Container from "@/components/layout/Container";

const options = [
  {
    letter: "A",
    answer: "3",
  },
  {
    letter: "B",
    answer: "5",
    correct: true,
  },
  {
    letter: "C",
    answer: "10",
  },
  {
    letter: "D",
    answer: "15",
  },
];

export default function PracticePreview() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28">

      {/* =========================================================
          BACKGROUND EFFECTS
         ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/5 blur-3xl"
      />

      <Container>
        <div className="relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

          {/* =====================================================
              LEFT CONTENT
             ===================================================== */}

          <div className="relative">

            {/* Badge */}

            <div
              className={cn(
                "mb-6 inline-flex",
                "items-center",
                "gap-2",
                "rounded-full",
                "border",
                "border-blue-100",
                "bg-white",
                "px-4",
                "py-2",
                "text-xs",
                "font-bold",
                "uppercase",
                "tracking-wider",
                "text-blue-700",
                "shadow-sm"
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                <Sparkles size={11} />
              </span>

              JAMB Practice Engine
            </div>

            {/* Heading */}

            <h2
              className={cn(
                "max-w-xl",
                "text-3xl",
                "font-extrabold",
                "leading-tight",
                "tracking-tight",
                "text-slate-950",
                "sm:text-4xl",
                "lg:text-5xl"
              )}
            >
              Prepare smarter.

              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Compete stronger.
              </span>
            </h2>

            {/* Description */}

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Build your confidence before competition day with realistic
              JAMB-style questions, timed practice sessions, instant feedback
              and performance tracking.
            </p>

            {/* Feature list */}

            <div className="mt-8 space-y-4">

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <BookOpen size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Thousands of practice questions
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Practice across your JAMB subjects with carefully
                    structured questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Train under real exam pressure
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Use timed sessions to improve speed, accuracy and
                    decision-making.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <BarChart3 size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Know exactly where you stand
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Track your accuracy, speed and progress as you prepare
                    for the championship.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/student/arena"
                className={cn(
                  "group",
                  "inline-flex",
                  "min-h-12",
                  "items-center",
                  "justify-center",
                  "gap-2",
                  "rounded-xl",
                  "bg-blue-600",
                  "px-6",
                  "text-sm",
                  "font-bold",
                  "text-white",
                  "shadow-lg",
                  "shadow-blue-600/20",
                  "transition-all",
                  "hover:-translate-y-0.5",
                  "hover:bg-blue-700",
                  "hover:shadow-xl"
                )}
              >
                Start Practicing

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/practice"
                className={cn(
                  "inline-flex",
                  "min-h-12",
                  "items-center",
                  "justify-center",
                  "rounded-xl",
                  "border",
                  "border-slate-200",
                  "bg-white",
                  "px-6",
                  "text-sm",
                  "font-semibold",
                  "text-slate-700",
                  "shadow-sm",
                  "transition",
                  "hover:border-blue-200",
                  "hover:bg-blue-50",
                  "hover:text-blue-700"
                )}
              >
                Explore Practice
              </Link>

            </div>

          </div>


          {/* =====================================================
              RIGHT — PRACTICE INTERFACE
             ===================================================== */}

          <div className="relative mx-auto w-full max-w-2xl">

            {/* Floating score card */}

            <div
              className={cn(
                "absolute",
                "-left-3",
                "top-8",
                "z-20",
                "hidden",
                "rounded-2xl",
                "border",
                "border-white/70",
                "bg-white/95",
                "p-4",
                "shadow-xl",
                "shadow-slate-900/10",
                "backdrop-blur",
                "sm:block",
                "lg:-left-10"
              )}
            >
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Target size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Accuracy
                  </p>

                  <p className="text-lg font-extrabold text-slate-900">
                    92%
                  </p>
                </div>

              </div>
            </div>


            {/* Floating streak card */}

            <div
              className={cn(
                "absolute",
                "-right-2",
                "bottom-12",
                "z-20",
                "hidden",
                "rounded-2xl",
                "border",
                "border-white/70",
                "bg-white/95",
                "p-4",
                "shadow-xl",
                "shadow-slate-900/10",
                "backdrop-blur",
                "sm:block",
                "lg:-right-8"
              )}
            >
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                  <Zap size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Practice Streak
                  </p>

                  <p className="text-lg font-extrabold text-slate-900">
                    12 Days 🔥
                  </p>
                </div>

              </div>
            </div>


            {/* Main application card */}

            <div
              className={cn(
                "relative",
                "overflow-hidden",
                "rounded-[2rem]",
                "border",
                "border-slate-200",
                "bg-white",
                "shadow-2xl",
                "shadow-blue-950/10"
              )}
            >

              {/* Top navy header */}

              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-5 sm:px-7">

                {/* glow */}

                <div
                  aria-hidden="true"
                  className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl"
                />

                <div className="relative flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
                      <BookOpen size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Mathematics
                      </p>

                      <p className="text-xs text-blue-200">
                        JAMB Practice Session
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">

                    <Clock3 size={13} />

                    18:42

                  </div>

                </div>


                {/* Progress */}

                <div className="relative mt-5">

                  <div className="mb-2 flex items-center justify-between text-[11px]">

                    <span className="font-medium text-blue-200">
                      Question 24 of 50
                    </span>

                    <span className="font-bold text-white">
                      48%
                    </span>

                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">

                    <div className="h-full w-[48%] rounded-full bg-yellow-400" />

                  </div>

                </div>

              </div>


              {/* Question body */}

              <div className="p-5 sm:p-7">

                {/* Question metadata */}

                <div className="mb-6 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                    Mathematics
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700">
                    Medium
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                    Algebra
                  </span>

                </div>


                {/* Question */}

                <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">

                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Question 24
                  </p>

                  <h3 className="text-base font-bold leading-7 text-slate-900 sm:text-lg">
                    If x + 5 = 10, what is the value of x?
                  </h3>

                </div>


                {/* Options */}

                <div className="mt-5 space-y-3">

                  {options.map((option) => (

                    <div
                      key={option.letter}
                      className={cn(
                        "group",
                        "flex",
                        "items-center",
                        "justify-between",
                        "rounded-xl",
                        "border",
                        "px-4",
                        "py-3.5",
                        "transition",
                        option.correct
                          ? [
                              "border-green-500",
                              "bg-green-50",
                              "shadow-sm",
                            ]
                          : [
                              "border-slate-200",
                              "bg-white",
                              "hover:border-blue-200",
                              "hover:bg-blue-50/50",
                            ]
                      )}
                    >

                      <div className="flex items-center gap-3">

                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                            option.correct
                              ? "bg-green-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {option.letter}
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          {option.answer}
                        </span>

                      </div>

                      {option.correct && (
                        <CheckCircle
                          size={19}
                          className="text-green-600"
                        />
                      )}

                    </div>

                  ))}

                </div>


                {/* Bottom action */}

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                  <div className="flex items-center gap-2 text-xs text-slate-500">

                    <Trophy size={15} className="text-yellow-500" />

                    <span>
                      +20 points
                    </span>

                  </div>

                  <button
                    type="button"
                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                  >
                    Next Question →
                  </button>

                </div>

              </div>

            </div>


            {/* Bottom performance strip */}

            <div className="mx-auto mt-4 grid max-w-md grid-cols-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/5">

              <div className="text-center">

                <p className="text-lg font-extrabold text-slate-900">
                  24
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Answered
                </p>

              </div>

              <div className="border-x border-slate-100 text-center">

                <p className="text-lg font-extrabold text-green-600">
                  22
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Correct
                </p>

              </div>

              <div className="text-center">

                <p className="text-lg font-extrabold text-blue-600">
                  92%
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Accuracy
                </p>

              </div>

            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}