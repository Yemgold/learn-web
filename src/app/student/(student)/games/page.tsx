







"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Gamepad2,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/20">
              <Gamepad2 className="h-5 w-5 text-violet-300" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Learnyfi Games
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Learn. Play. Win.
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Challenge yourself with quick learning games designed to test
            your knowledge, speed, memory, and thinking skills.
          </p>
        </section>

        {/* Featured Game */}
        <section className="mb-8">
          <Link
            href="/student/games/word-challenge"
            className="group block"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-slate-900 to-slate-950 p-5 shadow-2xl transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/30 sm:p-7">
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/20">
                    <Brain className="h-7 w-7 text-violet-300" />
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Available Now
                  </span>
                </div>

                <div className="max-w-2xl">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured Game
                  </p>

                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Word Challenge
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    Read the description, think quickly, build the word from
                    shuffled letters, and earn more points the faster you
                    solve it.
                  </p>
                </div>

                {/* Game philosophy */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-violet-300" />
                      <span className="text-sm font-semibold">
                        Think
                      </span>
                    </div>

                    <p className="text-xs leading-5 text-slate-400">
                      Read the description carefully.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-300" />
                      <span className="text-sm font-semibold">
                        Build
                      </span>
                    </div>

                    <p className="text-xs leading-5 text-slate-400">
                      Arrange the letters to find the word.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-emerald-300" />
                      <span className="text-sm font-semibold">
                        Earn
                      </span>
                    </div>

                    <p className="text-xs leading-5 text-slate-400">
                      Solve faster to keep more points.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-7 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      The faster you know,
                    </p>
                    <p className="text-sm font-semibold text-white">
                      the more you earn.
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition group-hover:bg-violet-100">
                    Play Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Coming Soon */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                More Games
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                More ways to learn and challenge yourself are coming.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Daily Challenge */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                <Zap className="h-5 w-5 text-amber-300" />
              </div>

              <h3 className="font-semibold">
                Daily Challenge
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Complete a new learning challenge every day and build your
                streak.
              </p>

              <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-500">
                Coming Soon
              </span>
            </div>

            {/* Memory Challenge */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
                <Brain className="h-5 w-5 text-cyan-300" />
              </div>

              <h3 className="font-semibold">
                Memory Challenge
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Test how well you can remember facts, concepts, and
                information.
              </p>

              <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-500">
                Coming Soon
              </span>
            </div>

            {/* Knowledge Sprint */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
                <Trophy className="h-5 w-5 text-emerald-300" />
              </div>

              <h3 className="font-semibold">
                Knowledge Sprint
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Race against the clock and answer as many learning questions
                as you can.
              </p>

              <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-500">
                Coming Soon
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
