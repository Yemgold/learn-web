




// src/components/quiz-board/QuizBoardHowItWorks.tsx

"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Crown,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import {
  QUIZ_BOARD_HOW_IT_WORKS,
  QUIZ_BOARD_QUALIFICATION_SEQUENCE,
} from "@/lib/quiz-board/constants";

export default function QuizBoardHowItWorks() {
  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
      {/* ------------------------------------------------------------------ */}
      {/* Background effects                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative border-b border-white/5 px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-violet-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
                Competition Guide
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              How Quiz Board Works
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Join a competition, compete against other
              students, answer questions quickly and
              accurately, and qualify through the rounds
              until the final winner is determined.
            </p>
          </div>

          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 lg:flex">
            <Crown className="h-8 w-8 text-violet-400" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Steps                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative grid gap-px bg-white/5 md:grid-cols-2 lg:grid-cols-4">
        {QUIZ_BOARD_HOW_IT_WORKS.map(
          (step, index) => (
            <div
              key={step.step}
              className="group relative bg-slate-900/70 p-6 transition hover:bg-slate-900 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-sm font-black text-violet-300">
                  {step.step}
                </div>

                {index <
                  QUIZ_BOARD_HOW_IT_WORKS.length -
                    1 && (
                  <ArrowRight className="hidden h-4 w-4 text-slate-700 lg:block" />
                )}
              </div>

              <h3 className="text-sm font-bold text-white">
                {step.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {step.description}
              </p>
            </div>
          ),
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Qualification sequence                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative border-t border-white/5 px-5 py-7 sm:px-8 lg:px-10">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />

            <h3 className="text-sm font-bold text-white">
              Qualification Rounds
            </h3>
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Contestants are progressively eliminated
            as the competition moves toward the final.
          </p>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max items-center justify-center gap-2">
            {QUIZ_BOARD_QUALIFICATION_SEQUENCE.map(
              (number, index) => {
                const isWinner = number === 1;

                return (
                  <div
                    key={`${number}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`relative flex h-14 min-w-14 flex-col items-center justify-center rounded-xl border px-3 ${
                        isWinner
                          ? "border-amber-500/30 bg-amber-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      {isWinner && (
                        <Crown className="absolute -right-1.5 -top-2 h-4 w-4 text-amber-400" />
                      )}

                      <span
                        className={`text-lg font-black ${
                          isWinner
                            ? "text-amber-300"
                            : "text-white"
                        }`}
                      >
                        {number}
                      </span>

                      <span className="text-[8px] font-medium uppercase tracking-wider text-slate-500">
                        {isWinner
                          ? "Winner"
                          : number === 2
                            ? "Finalists"
                            : "Players"}
                      </span>
                    </div>

                    {index <
                      QUIZ_BOARD_QUALIFICATION_SEQUENCE.length -
                        1 && (
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Competition principles                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative border-t border-white/5 px-5 py-7 sm:px-8 lg:px-10">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-white">
            What Matters
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Stay focused throughout every round.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Principle
            icon={
              <Clock3 className="h-4 w-4 text-blue-400" />
            }
            title="Speed"
            description="Answer within the time allowed for each question."
          />

          <Principle
            icon={
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            }
            title="Accuracy"
            description="Correct answers are essential for progressing through the rounds."
          />

          <Principle
            icon={
              <Users className="h-4 w-4 text-violet-400" />
            }
            title="Competition"
            description="Compete against other students in the same lobby."
          />

          <Principle
            icon={
              <ShieldCheck className="h-4 w-4 text-amber-400" />
            }
            title="Fair Play"
            description="Compete honestly and follow the competition rules."
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Final reminder                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative border-t border-white/5 bg-white/[0.02] px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Trophy className="hidden h-4 w-4 text-amber-400 sm:block" />

          <p className="text-center text-xs leading-5 text-slate-500">
            The goal is simple:{" "}
            <span className="font-semibold text-slate-300">
              answer correctly, answer quickly,
            </span>{" "}
            and qualify for the next round.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Principle Card                                                             */
/* -------------------------------------------------------------------------- */

interface PrincipleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Principle({
  icon,
  title,
  description,
}: PrincipleProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.05]">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
        {icon}
      </div>

      <h4 className="text-xs font-bold text-slate-200">
        {title}
      </h4>

      <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}