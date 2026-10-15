
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  Lightbulb,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

export default function WhotPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <header className="flex items-center justify-between gap-4">
          <Link
            href="/student/games/whot"
            className="flex items-center gap-3"
            aria-label="Learnyfi WHOT home"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Gamepad2 className="h-6 w-6 text-cyan-300" />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                Learnyfi <span className="text-cyan-300">WHOT</span>
              </p>
              <p className="text-xs text-slate-500">
                Learn. Match. Win.
              </p>
            </div>
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Ready to play
          </span>
        </header>

        {/* Main hero */}

        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Educational card game
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Play your cards.
                <span className="block text-cyan-300">
                  Challenge your mind.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Welcome to Learnyfi WHOT! Match subject cards,
                answer educational questions, and outsmart your
                opponent. Turn every move into an opportunity to learn.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/student/games/whot/setup"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-7 py-4 text-base font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                >
                  <Gamepad2 className="h-5 w-5" />
                  Play WHOT
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="#how-to-play"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                >
                  <BookOpen className="h-5 w-5 text-cyan-300" />
                  How to play
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Educational questions
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-300" />
                  Fast-paced gameplay
                </span>
              </div>
            </div>

            {/* Decorative WHOT card illustration */}

            <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-5">
              <div className="absolute h-64 w-64 rounded-full border border-cyan-400/10 bg-cyan-400/[0.03]" />
              <div className="absolute h-48 w-48 rounded-full border border-white/10" />

              <div className="relative h-64 w-44 rotate-[-15deg] rounded-3xl border border-rose-300/30 bg-slate-950 p-3 shadow-2xl shadow-black/40">
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-rose-300/20 bg-gradient-to-br from-rose-500/20 via-slate-900 to-rose-950">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-200">
                    Learnyfi
                  </span>
                  <span className="mt-4 text-5xl font-black text-white">
                    WHOT
                  </span>
                  <div className="mt-5 h-1 w-14 rounded-full bg-rose-400" />
                  <span className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Think. Match. Learn.
                  </span>
                </div>
              </div>

              <div className="absolute right-2 top-7 h-48 w-32 rotate-[14deg] rounded-2xl border border-cyan-300/30 bg-slate-900 p-2 shadow-xl">
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-950">
                  <BookOpen className="h-9 w-9 text-cyan-300" />
                  <span className="mt-3 text-xs font-black text-white">
                    LEARN
                  </span>
                  <span className="mt-1 text-[9px] text-cyan-200">
                    EVERY MOVE
                  </span>
                </div>
              </div>

              <div className="absolute bottom-7 left-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400 text-slate-950 shadow-xl">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Game highlights */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Highlight
            icon={<BookOpen className="h-5 w-5" />}
            title="Learn while playing"
            description="Answer academic questions as you play."
            accent="cyan"
          />

          <Highlight
            icon={<Zap className="h-5 w-5" />}
            title="Think quickly"
            description="Make smart moves under time pressure."
            accent="amber"
          />

          <Highlight
            icon={<Trophy className="h-5 w-5" />}
            title="Play to win"
            description="Use strategy to beat your opponent."
            accent="violet"
          />
        </section>

        {/* How to play */}

        <section id="how-to-play" className="mt-12 scroll-mt-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              The basics
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              How to play Learnyfi WHOT
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Use matching cards, answer questions, and plan your moves
              to finish your hand before your opponent.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <RuleCard
              number="01"
              title="Match your cards"
              description="Follow the game's matching rules to play a valid card from your hand."
            />

            <RuleCard
              number="02"
              title="Answer questions"
              description="When a question appears, choose your answer and use what you know."
            />

            <RuleCard
              number="03"
              title="Plan your strategy"
              description="Think ahead, manage your cards, and use special moves when available."
            />

            <RuleCard
              number="04"
              title="Watch your turn"
              description="Pay attention to whose turn it is and follow the prompts on screen."
            />

            <RuleCard
              number="05"
              title="Clear your hand"
              description="Work towards playing all your cards according to the game's rules."
            />

            <RuleCard
              number="06"
              title="Keep learning"
              description="Use each round to practise your knowledge and improve your decisions."
            />
          </div>
        </section>

        {/* Bottom call to action */}

        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/60 to-slate-900 p-6 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Lightbulb className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Your next move
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black">
                Ready to play?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Enter the WHOT arena, test your knowledge, and see
                how well you can play.
              </p>
            </div>

            <Link
              // href="/student/games/whot/play"
               href="/student/games/whot/setup"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300"
            >
              Start playing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-white/5 py-6 text-center">
          <p className="text-xs text-slate-600">
            Learnyfi WHOT · Learn something with every move.
          </p>
        </footer>
      </div>
    </main>
  );
}

function Highlight({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: "cyan" | "amber" | "violet";
}) {
  const styles = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    violet: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${styles[accent]}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}

function RuleCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-cyan-400/20 hover:bg-slate-900">
      <span className="text-xs font-black tracking-widest text-cyan-300">
        STEP {number}
      </span>

      <h3 className="mt-3 font-bold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}
