




"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Flame,
  Gift,
  Lock,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: number;
  duration: number;
  reward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  participants: number;
  status: "available" | "locked";
  icon: typeof Brain;
}

const challenges: Challenge[] = [
  {
    id: "jamb-mixed",
    title: "JAMB Quick Challenge",
    description:
      "Test yourself with a fast-paced mixture of JAMB-style questions.",
    subject: "JAMB Mixed",
    questions: 10,
    duration: 10,
    reward: 500,
    difficulty: "Easy",
    participants: 1240,
    status: "available",
    icon: Zap,
  },
  {
    id: "science-challenge",
    title: "Science Sprint",
    description:
      "Solve Chemistry, Physics and Biology questions before the timer runs out.",
    subject: "Science",
    questions: 15,
    duration: 15,
    reward: 1000,
    difficulty: "Medium",
    participants: 864,
    status: "available",
    icon: Brain,
  },
  {
    id: "mathematics-challenge",
    title: "Mathematics Master",
    description:
      "Put your mathematical reasoning and problem-solving skills to the test.",
    subject: "Mathematics",
    questions: 20,
    duration: 20,
    reward: 1500,
    difficulty: "Medium",
    participants: 692,
    status: "available",
    icon: Target,
  },
  {
    id: "champions-challenge",
    title: "Champions Challenge",
    description:
      "A difficult challenge designed for students ready to compete at the highest level.",
    subject: "Mixed",
    questions: 30,
    duration: 30,
    reward: 5000,
    difficulty: "Hard",
    participants: 320,
    status: "locked",
    icon: Trophy,
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

export default function SolveAndWinPage() {
  return (
    <div className="space-y-8">
      {/* ============================================================
          HERO
      ============================================================ */}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-10"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-200 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Solve & Win
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Solve Questions.
            <br />
            Win Rewards.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Put your knowledge to work. Solve timed challenges, prove your
            skills and earn rewards as you climb your way to the top.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur">
              <Target className="h-4 w-4 text-blue-300" />
              Practice
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur">
              <Trophy className="h-4 w-4 text-amber-300" />
              Compete
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur">
              <Gift className="h-4 w-4 text-emerald-300" />
              Earn
            </div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            How Solve & Win Works
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Turn your exam preparation into an opportunity to earn.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              number: "01",
              icon: BookOpen,
              title: "Choose a Challenge",
              text: "Pick a challenge that matches your subject and skill level.",
            },
            {
              number: "02",
              icon: Brain,
              title: "Solve the Questions",
              text: "Answer questions within the challenge time limit.",
            },
            {
              number: "03",
              icon: Gift,
              title: "Win Rewards",
              text: "Perform well and qualify for the available rewards.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + index * 0.08,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>

                  <span className="text-3xl font-black text-slate-100">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          AVAILABLE CHALLENGES
      ============================================================ */}

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Challenges
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a challenge and put your knowledge to the test.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <Flame className="h-4 w-4 text-orange-500" />
            New challenges added regularly
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            const isLocked = challenge.status === "locked";

            return (
              <motion.article
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + index * 0.06,
                }}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition ${
                  isLocked
                    ? "border-slate-200 opacity-80"
                    : "border-slate-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>

                  {isLocked ? (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      <Lock className="h-3.5 w-3.5" />
                      Locked
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Available
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {challenge.subject}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        challenge.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-600"
                          : challenge.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {challenge.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {challenge.description}
                  </p>
                </div>

                {/* Challenge Stats */}

                <div className="mt-5 grid grid-cols-3 gap-2 border-y border-slate-100 py-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Questions</span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {challenge.questions}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Time</span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {challenge.duration} min
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Players</span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {challenge.participants.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Reward */}

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Potential Reward
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <Gift className="h-5 w-5 text-amber-500" />

                      <span className="text-xl font-extrabold text-slate-900">
                        {formatCurrency(challenge.reward)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLocked}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                      isLocked
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : "bg-slate-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isLocked ? "Locked" : "Start Challenge"}

                    {!isLocked && (
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          FAIR PLAY NOTICE
      ============================================================ */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Medal className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h3 className="font-bold text-amber-900">
              Play fair. Learn more. Win more.
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-800/70">
              Solve challenges independently. Your score, accuracy and
              performance determine your eligibility for rewards.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

