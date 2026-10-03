









"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Trophy,
  Zap,
} from "lucide-react";

type Subject = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconStyle: string;
  iconBg: string;
};

const SUBJECTS: Subject[] = [
  {
    id: "biology",
    name: "Biology",
    description: "Test your knowledge of living organisms and life processes.",
    icon: BookOpen,
    iconStyle: "text-emerald-400",
    iconBg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Challenge yourself with atoms, reactions, equations and more.",
    icon: FlaskConical,
    iconStyle: "text-blue-400",
    iconBg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    id: "physics",
    name: "Physics",
    description: "Solve questions covering motion, energy, forces and more.",
    icon: Zap,
    iconStyle: "text-amber-400",
    iconBg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Put your calculation and problem-solving skills to the test.",
    icon: Calculator,
    iconStyle: "text-violet-400",
    iconBg: "bg-violet-400/10 border-violet-400/20",
  },
];

export default function SolveAndWinCbtPage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <header className="mb-10">
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black sm:text-2xl">
                Solve & Win CBT
              </h1>

              <p className="text-sm text-slate-400">
                Answer questions and win CBT Points
              </p>
            </div>

          </div>
        </header>

        {/* HERO */}
        <section className="mb-10 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#0d1320] to-[#0d1320] p-6 sm:p-10">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
              <GraduationCap className="h-4 w-4" />
              CBT Practice
            </div>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Answer correctly.
              <br />
              <span className="text-violet-400">
                Win CBT Points.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Choose a subject and start solving. Every correct answer
              moves you higher on the CBT Point ladder.
            </p>

          </div>

          {/* QUICK INFO */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">

            <InfoCard
              value="0.0023"
              label="Starting CBT Point"
            />

            <InfoCard
              value="4"
              label="Subjects"
            />

            <InfoCard
              value="∞"
              label="Keep Winning"
            />

          </div>
        </section>

        {/* SUBJECT SECTION */}
        <section>

          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Choose a Subject
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a subject to start your Solve & Win session.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUBJECTS.map((subject) => {
              const Icon = subject.icon;

              return (
                <Link
                  key={subject.id}
                  href={`/student/solve-and-win-cbt/${subject.id}/play`}
                  className="group"
                >
                  <article className="relative h-full overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1320] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#101827] hover:shadow-xl hover:shadow-violet-950/20">

                    {/* TOP */}
                    <div className="flex items-start justify-between">

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${subject.iconBg}`}
                      >
                        <Icon
                          className={`h-7 w-7 ${subject.iconStyle}`}
                        />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/70 transition group-hover:bg-violet-500">
                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-white" />
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="mt-6">

                      <h3 className="text-xl font-bold">
                        {subject.name}
                      </h3>

                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                        {subject.description}
                      </p>

                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">

                      <span className="text-xs font-medium text-slate-500">
                        Start Challenge
                      </span>

                      <span className="text-xs font-bold text-violet-400">
                        Play →
                      </span>

                    </div>

                  </article>
                </Link>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-12">

          <div className="mb-5">
            <h2 className="text-xl font-bold">
              How It Works
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Simple. Answer, win and decide whether to continue.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <StepCard
              number="01"
              title="Choose a Subject"
              description="Pick the subject you want to challenge yourself with."
            />

            <StepCard
              number="02"
              title="Answer Questions"
              description="Select the correct option from the available CBT answers."
            />

            <StepCard
              number="03"
              title="Cash Out or Win More"
              description="After a correct answer, secure your winnings or continue to the next question."
            />

          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="mt-10 flex items-center justify-center text-center text-xs text-slate-600">
          <p>
            Solve & Win CBT • Learn more • Win more
          </p>
        </div>

      </div>
    </main>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

      <p className="text-xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-5">

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-xs font-black text-violet-400">
          {number}
        </div>

        <div>
          <h3 className="font-bold">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

      </div>

    </div>
  );
}

