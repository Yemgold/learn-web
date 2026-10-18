
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const games = [
  {
    title: "Learnyfi WHOT",
    subtitle: "Educational Card Game",
    description:
      "Match cards, answer educational questions, and challenge your strategy. Play against a bot or explore the friend-game option.",
    href: "/student/games/whot",
    icon: Gamepad2,
    accent: "cyan",
    features: ["Card matching", "Educational questions", "Bot or friend"],
    number: "01",
  },
  {
    title: "Educational Ludo",
    subtitle: "Educational Board Game",
    description:
      "Roll the dice, move your tokens, answer questions, and race to get all your tokens home while learning along the way.",
    href: "/student/games/edu-ludo",
    icon: GraduationCap,
    accent: "violet",
    features: ["Dice and tokens", "Subject questions", "Strategic gameplay"],
    number: "02",
  },
] as const;

export default function GamesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/student"
              aria-label="Back to student dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Gamepad2 className="h-6 w-6 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-black tracking-tight sm:text-xl">
                Learnyfi <span className="text-cyan-300">Games</span>
              </h1>
              <p className="text-xs text-slate-400">
                Your learning playground
              </p>
            </div>
          </div>

          <Link
            href="/student"
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <GraduationCap className="h-4 w-4" />
            Dashboard
          </Link>
        </header>

        {/* Hero */}
        <section className="relative mt-7 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 sm:mt-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200 sm:text-xs">
                <Sparkles className="h-4 w-4" />
                Learn through play
              </div>

              <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Choose your game.
                <span className="block text-cyan-300">
                  Challenge yourself.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Welcome to the Learnyfi Games Hub. Explore educational
                card and board games, test your knowledge, and build
                your skills while having fun. Choose a game below and
                start playing.
              </p>

              <a
                href="#game-library"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                <Gamepad2 className="h-5 w-5" />
                Explore our games
                <ArrowRight className="h-4 w-4" />
              </a>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Learn new skills
                </span>

                <span className="inline-flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-300" />
                  Think strategically
                </span>

                <span className="inline-flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-violet-300" />
                  Challenge yourself
                </span>
              </div>
            </div>

            {/* Decorative game illustration */}
            <div
              aria-hidden="true"
              className="relative mx-auto hidden h-64 w-64 items-center justify-center lg:flex"
            >
              <div className="absolute inset-4 rounded-full border border-cyan-300/10 bg-cyan-300/[0.03]" />
              <div className="absolute inset-10 rounded-full border border-white/10" />

              <div className="absolute left-5 top-7 flex h-20 w-20 -rotate-12 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-400/10 shadow-xl">
                <GraduationCap className="h-9 w-9 text-violet-300" />
              </div>

              <div className="absolute right-4 top-9 flex h-20 w-20 rotate-12 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 shadow-xl">
                <Trophy className="h-9 w-9 text-amber-300" />
              </div>

              <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-blue-950 shadow-2xl shadow-black/40">
                <Gamepad2 className="h-14 w-14 text-cyan-300" />
              </div>

              <div className="absolute bottom-5 left-7 flex h-16 w-16 -rotate-6 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <BookOpen className="h-7 w-7 text-emerald-300" />
              </div>

              <div className="absolute bottom-5 right-5 flex h-16 w-16 rotate-6 items-center justify-center rounded-2xl border border-pink-400/20 bg-pink-400/10">
                <Lightbulb className="h-7 w-7 text-pink-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Game library */}
        <section id="game-library" className="mt-10 scroll-mt-6 sm:mt-14">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Game library
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Pick your next challenge
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Choose one of our games to begin your learning adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {games.map((game) => {
              const Icon = game.icon;
              const isWhot = game.accent === "cyan";

              return (
                <article
                  key={game.title}
                  className={`group relative flex min-h-[350px] flex-col overflow-hidden rounded-3xl border p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 sm:p-8 ${
                    isWhot
                      ? "border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-950/70 hover:border-cyan-300/40"
                      : "border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-slate-900 to-indigo-950/70 hover:border-violet-300/40"
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/[0.03] blur-2xl transition group-hover:bg-white/[0.06]"
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
                        isWhot
                          ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                          : "border-violet-400/20 bg-violet-400/10 text-violet-300"
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-extrabold ${
                        isWhot
                          ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                          : "border-violet-400/20 bg-violet-400/10 text-violet-200"
                      }`}
                    >
                      GAME {game.number}
                    </span>
                  </div>

                  <div className="relative mt-6">
                    <p
                      className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
                        isWhot ? "text-cyan-300" : "text-violet-300"
                      }`}
                    >
                      {game.subtitle}
                    </p>

                    <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                      {game.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                      {game.description}
                    </p>
                  </div>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {game.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-slate-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-auto pt-7">
                    <Link
                      href={game.href}
                      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 ${
                        isWhot
                          ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:ring-cyan-200"
                          : "bg-violet-400 text-slate-950 hover:bg-violet-300 focus-visible:ring-violet-200"
                      }`}
                    >
                      Play {isWhot ? "WHOT" : "Educational Ludo"}
                      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Learning reminder */}
        <section className="mt-10 rounded-3xl border border-cyan-400/15 bg-gradient-to-r from-cyan-950/50 to-slate-900 p-6 sm:mt-14 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
              <Lightbulb className="h-6 w-6 text-cyan-300" />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-black sm:text-xl">
                Play smart. Learn more.
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Every game is an opportunity to practise, think critically,
                and strengthen your knowledge. Pick a game and enjoy learning.
              </p>
            </div>

            <Link
              href="/student"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Back to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-white/5 py-6 text-center">
          <p className="text-xs text-slate-500">
            Learnyfi Games · Learn something with every move.
          </p>
        </footer>
      </div>
    </main>
  );
}
