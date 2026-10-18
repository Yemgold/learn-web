












"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const highlights = [
  {
    icon: BookOpen,
    title: "Learn while playing",
    description:
      "Practise your academic knowledge through educational questions during gameplay.",
    accent: "cyan",
  },
  {
    icon: Zap,
    title: "Think quickly",
    description:
      "Make smart decisions, recognise matching cards, and use your time wisely.",
    accent: "amber",
  },
  {
    icon: Trophy,
    title: "Play to win",
    description:
      "Plan your strategy, manage your cards, and work towards victory.",
    accent: "violet",
  },
] as const;

const rules = [
  {
    number: "01",
    title: "Match your cards",
    description:
      "Follow the active game's matching rules to play a valid card from your hand.",
  },
  {
    number: "02",
    title: "Answer questions",
    description:
      "When an educational question appears, choose your answer and demonstrate what you know.",
  },
  {
    number: "03",
    title: "Think strategically",
    description:
      "Choose your moves carefully and use available special cards at the right moment.",
  },
  {
    number: "04",
    title: "Respect each turn",
    description:
      "Watch the turn indicator and wait for your opportunity to play.",
  },
  {
    number: "05",
    title: "Clear your hand",
    description:
      "Play your cards according to the rules and aim to be the first to finish.",
  },
  {
    number: "06",
    title: "Learn from every round",
    description:
      "Use questions and explanations to strengthen your knowledge as you play.",
  },
];

export default function WhotPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <Link
            href="/student/games/whot"
            className="group flex min-w-0 items-center gap-3"
            aria-label="Learnyfi WHOT home"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 transition group-hover:bg-cyan-300/20">
              <Gamepad2 className="h-6 w-6 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <p className="text-lg font-black tracking-tight sm:text-xl">
                Learnyfi <span className="text-cyan-300">WHOT</span>
              </p>
              <p className="text-xs text-slate-400">
                Learn. Match. Win.
              </p>
            </div>
          </Link>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Ready to play
          </div>
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

          <div className="relative grid items-center gap-8 p-5 sm:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-200 sm:text-xs">
                <Sparkles className="h-4 w-4" />
                Educational card game
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Play your cards.
                <span className="mt-1 block text-cyan-300">
                  Challenge your mind.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Welcome to Learnyfi WHOT, where card strategy meets
                learning. Match cards, tackle educational questions,
                challenge a bot or invite a friend, and make every round
                an opportunity to learn.
              </p>

              {/* Game modes */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/student/games/whot/setup"
                  className="group flex min-h-[76px] items-center gap-3 rounded-2xl bg-cyan-400 p-4 text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950/10">
                    <Gamepad2 className="h-6 w-6" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black sm:text-base">
                      Play vs Bot
                    </span>
                    <span className="mt-1 block text-xs font-medium text-slate-800/80">
                      Practise your strategy
                    </span>
                  </span>

                  <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/student/games/whot/friend"
                  className="group flex min-h-[76px] items-center gap-3 rounded-2xl border border-violet-400/30 bg-violet-400/10 p-4 transition hover:-translate-y-0.5 hover:border-violet-300/50 hover:bg-violet-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/15">
                    <Users className="h-6 w-6 text-violet-200" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-violet-100 sm:text-base">
                      Play with a Friend
                    </span>
                    <span className="mt-1 block text-xs text-violet-200/70">
                      Challenge another player
                    </span>
                  </span>

                  <ArrowRight className="h-5 w-5 shrink-0 text-violet-200 transition group-hover:translate-x-1" />
                </Link>
              </div>

              <a
                href="#how-to-play"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <BookOpen className="h-4 w-4 text-cyan-300" />
                Learn how to play
                <ArrowRight className="h-4 w-4" />
              </a>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Educational questions
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-300" />
                  Fast-paced gameplay
                </span>
                <span className="flex items-center gap-2">
                  <Swords className="h-4 w-4 text-violet-300" />
                  Strategic challenges
                </span>
              </div>
            </div>

            {/* Decorative card illustration */}
            <div
              className="relative mx-auto flex min-h-[310px] w-full max-w-sm items-center justify-center sm:min-h-[370px]"
              aria-label="Learnyfi WHOT educational card illustration"
            >
              <div className="absolute h-64 w-64 rounded-full border border-cyan-400/10 bg-cyan-400/[0.03] sm:h-80 sm:w-80" />
              <div className="absolute h-48 w-48 rounded-full border border-white/10 sm:h-60 sm:w-60" />

              <div className="absolute left-5 top-12 flex h-44 w-32 -rotate-[17deg] flex-col items-center justify-center rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-400/20 to-slate-950 p-3 shadow-2xl shadow-black/30 sm:left-7 sm:top-16 sm:h-52 sm:w-36">
                <Sparkles className="h-8 w-8 text-amber-300" />
                <span className="mt-3 text-xs font-black tracking-widest text-amber-100">
                  THINK
                </span>
                <span className="mt-2 text-[10px] text-amber-200/80">
                  EVERY MOVE
                </span>
              </div>

              <div className="relative z-10 h-60 w-40 rotate-[-5deg] rounded-3xl border border-rose-300/30 bg-slate-950 p-2.5 shadow-2xl shadow-black/50 sm:h-72 sm:w-48 sm:p-3">
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-rose-300/20 bg-gradient-to-br from-rose-500/25 via-slate-900 to-rose-950">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-200 sm:text-xs">
                    Learnyfi
                  </span>
                  <span className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                    WHOT
                  </span>
                  <div className="mt-5 h-1 w-14 rounded-full bg-rose-400" />
                  <span className="mt-4 text-center text-[9px] font-bold uppercase tracking-widest text-slate-300 sm:text-[10px]">
                    Think. Match. Learn.
                  </span>
                  <div className="mt-5 flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  </div>
                </div>
              </div>

              <div className="absolute right-2 top-8 flex h-44 w-28 rotate-[15deg] flex-col items-center justify-center rounded-2xl border border-cyan-300/30 bg-slate-900 p-2 shadow-xl shadow-black/30 sm:right-3 sm:top-10 sm:h-52 sm:w-36">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-950">
                  <GraduationCap className="h-9 w-9 text-cyan-300 sm:h-10 sm:w-10" />
                  <span className="mt-3 text-xs font-black text-white">
                    LEARN
                  </span>
                  <span className="mt-1 text-[9px] text-cyan-200">
                    EVERY ROUND
                  </span>
                </div>
              </div>

              <div className="absolute bottom-5 left-3 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400 text-slate-950 shadow-xl sm:bottom-8 sm:left-5">
                <Sparkles className="h-6 w-6" />
              </div>

              <div className="absolute bottom-7 right-3 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 shadow-xl backdrop-blur sm:right-0">
                <Trophy className="h-4 w-4 text-amber-300" />
                <span className="text-xs font-bold text-white">
                  Play. Learn. Improve.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section
          aria-label="Game highlights"
          className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-3"
        >
          {highlights.map(({ icon: Icon, title, description, accent }) => {
            const styles = {
              cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
              amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
              violet: "border-violet-400/20 bg-violet-400/10 text-violet-300",
            };

            return (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-white/20 hover:bg-slate-900"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${styles[accent]}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h2 className="mt-4 font-bold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </article>
            );
          })}
        </section>

        {/* How to play */}
        <section id="how-to-play" className="mt-12 scroll-mt-8 sm:mt-16">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              The basics
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              How to play Learnyfi WHOT
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Learn the basics before entering the arena. Match cards,
              answer questions when prompted, and plan your moves to
              finish your hand.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => (
              <article
                key={rule.number}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-cyan-400/30 hover:bg-slate-900"
              >
                <span className="text-xs font-black tracking-widest text-cyan-300">
                  STEP {rule.number}
                </span>
                <h3 className="mt-3 font-bold text-white">{rule.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {rule.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Final call to action */}
        <section className="relative mt-12 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/70 to-slate-900 p-6 sm:mt-16 sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Lightbulb className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Your next move
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Ready to enter the WHOT arena?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                Put your knowledge to the test. Start a practice game
                against a bot or head to the friend game area to challenge
                another player.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:min-w-48">
              <Link
                href="/student/games/whot/setup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                Start playing
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/student/games/whot/friend"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-6 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              >
                <Users className="h-4 w-4" />
                Challenge a friend
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/5 py-6 text-center">
          <p className="text-xs text-slate-500">
            Learnyfi WHOT · Learn something with every move.
          </p>
        </footer>
      </div>
    </main>
  );
}















// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   BookOpen,
//   CheckCircle2,
//   Gamepad2,
//   Lightbulb,
//   Sparkles,
//   Trophy,
//   Zap,
// } from "lucide-react";

// export default function WhotPage() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
//       <div className="mx-auto max-w-6xl">
//         {/* Header */}

//         <header className="flex items-center justify-between gap-4">
//           <Link
//             href="/student/games/whot"
//             className="flex items-center gap-3"
//             aria-label="Learnyfi WHOT home"
//           >
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
//               <Gamepad2 className="h-6 w-6 text-cyan-300" />
//             </div>

//             <div>
//               <p className="text-lg font-black tracking-tight">
//                 Learnyfi <span className="text-cyan-300">WHOT</span>
//               </p>
//               <p className="text-xs text-slate-500">
//                 Learn. Match. Win.
//               </p>
//             </div>
//           </Link>

//           <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
//             <span className="h-2 w-2 rounded-full bg-emerald-400" />
//             Ready to play
//           </span>
//         </header>

//         {/* Main hero */}

//         <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950">
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
//           />

//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
//           />

//           <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-14">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-200">
//                 <Sparkles className="h-4 w-4" />
//                 Educational card game
//               </div>

//               <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
//                 Play your cards.
//                 <span className="block text-cyan-300">
//                   Challenge your mind.
//                 </span>
//               </h1>

//               <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
//                 Welcome to Learnyfi WHOT! Match subject cards,
//                 answer educational questions, and outsmart your
//                 opponent. Turn every move into an opportunity to learn.
//               </p>

//               <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//                 <Link
//                   href="/student/games/whot/setup"
//                   className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-7 py-4 text-base font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
//                 >
//                   <Gamepad2 className="h-5 w-5" />
//                   Play-Bot
//                   <ArrowRight className="h-5 w-5" />
//                 </Link>
//                  <Link
//     href="/student/games/whot/friend"
//     className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-violet-400/30 bg-violet-400/10 px-7 py-4 text-base font-extrabold text-violet-200 transition hover:bg-violet-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
//   >
//     <Gamepad2 className="h-5 w-5" />
//     Play-Friend
//     <ArrowRight className="h-5 w-5" />
//   </Link>

//                 <a
//                   href="#how-to-play"
//                   className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white transition hover:bg-white/[0.08]"
//                 >
//                   <BookOpen className="h-5 w-5 text-cyan-300" />
//                   How to play
//                 </a>
//               </div>

//               <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400">
//                 <span className="flex items-center gap-2">
//                   <CheckCircle2 className="h-4 w-4 text-emerald-300" />
//                   Educational questions
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <Zap className="h-4 w-4 text-amber-300" />
//                   Fast-paced gameplay
//                 </span>
//               </div>
//             </div>

//             {/* Decorative WHOT card illustration */}

//             <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-5">
//               <div className="absolute h-64 w-64 rounded-full border border-cyan-400/10 bg-cyan-400/[0.03]" />
//               <div className="absolute h-48 w-48 rounded-full border border-white/10" />

//               <div className="relative h-64 w-44 rotate-[-15deg] rounded-3xl border border-rose-300/30 bg-slate-950 p-3 shadow-2xl shadow-black/40">
//                 <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-rose-300/20 bg-gradient-to-br from-rose-500/20 via-slate-900 to-rose-950">
//                   <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-200">
//                     Learnyfi
//                   </span>
//                   <span className="mt-4 text-5xl font-black text-white">
//                     WHOT
//                   </span>
//                   <div className="mt-5 h-1 w-14 rounded-full bg-rose-400" />
//                   <span className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-300">
//                     Think. Match. Learn.
//                   </span>
//                 </div>
//               </div>

//               <div className="absolute right-2 top-7 h-48 w-32 rotate-[14deg] rounded-2xl border border-cyan-300/30 bg-slate-900 p-2 shadow-xl">
//                 <div className="flex h-full flex-col items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-950">
//                   <BookOpen className="h-9 w-9 text-cyan-300" />
//                   <span className="mt-3 text-xs font-black text-white">
//                     LEARN
//                   </span>
//                   <span className="mt-1 text-[9px] text-cyan-200">
//                     EVERY MOVE
//                   </span>
//                 </div>
//               </div>

//               <div className="absolute bottom-7 left-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400 text-slate-950 shadow-xl">
//                 <Sparkles className="h-6 w-6" />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Game highlights */}

//         <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Highlight
//             icon={<BookOpen className="h-5 w-5" />}
//             title="Learn while playing"
//             description="Answer academic questions as you play."
//             accent="cyan"
//           />

//           <Highlight
//             icon={<Zap className="h-5 w-5" />}
//             title="Think quickly"
//             description="Make smart moves under time pressure."
//             accent="amber"
//           />

//           <Highlight
//             icon={<Trophy className="h-5 w-5" />}
//             title="Play to win"
//             description="Use strategy to beat your opponent."
//             accent="violet"
//           />
//         </section>

//         {/* How to play */}

//         <section id="how-to-play" className="mt-12 scroll-mt-8">
//           <div className="mb-6">
//             <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
//               The basics
//             </p>
//             <h2 className="mt-2 text-2xl font-black sm:text-3xl">
//               How to play Learnyfi WHOT
//             </h2>
//             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
//               Use matching cards, answer questions, and plan your moves
//               to finish your hand before your opponent.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             <RuleCard
//               number="01"
//               title="Match your cards"
//               description="Follow the game's matching rules to play a valid card from your hand."
//             />

//             <RuleCard
//               number="02"
//               title="Answer questions"
//               description="When a question appears, choose your answer and use what you know."
//             />

//             <RuleCard
//               number="03"
//               title="Plan your strategy"
//               description="Think ahead, manage your cards, and use special moves when available."
//             />

//             <RuleCard
//               number="04"
//               title="Watch your turn"
//               description="Pay attention to whose turn it is and follow the prompts on screen."
//             />

//             <RuleCard
//               number="05"
//               title="Clear your hand"
//               description="Work towards playing all your cards according to the game's rules."
//             />

//             <RuleCard
//               number="06"
//               title="Keep learning"
//               description="Use each round to practise your knowledge and improve your decisions."
//             />
//           </div>
//         </section>

//         {/* Bottom call to action */}

//         <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/60 to-slate-900 p-6 sm:p-9">
//           <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <div className="flex items-center gap-2 text-cyan-300">
//                 <Lightbulb className="h-5 w-5" />
//                 <span className="text-xs font-bold uppercase tracking-widest">
//                   Your next move
//                 </span>
//               </div>

//               <h2 className="mt-3 text-2xl font-black">
//                 Ready to play?
//               </h2>

//               <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
//                 Enter the WHOT arena, test your knowledge, and see
//                 how well you can play.
//               </p>
//             </div>

//             <Link
//               // href="/student/games/whot/play"
//                href="/student/games/whot/setup"
//               className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300"
//             >
//               Start playing
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>
//         </section>

//         <footer className="mt-10 border-t border-white/5 py-6 text-center">
//           <p className="text-xs text-slate-600">
//             Learnyfi WHOT · Learn something with every move.
//           </p>
//         </footer>
//       </div>
//     </main>
//   );
// }

// function Highlight({
//   icon,
//   title,
//   description,
//   accent,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   accent: "cyan" | "amber" | "violet";
// }) {
//   const styles = {
//     cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
//     amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
//     violet: "border-violet-400/20 bg-violet-400/10 text-violet-300",
//   };

//   return (
//     <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
//       <div
//         className={`flex h-10 w-10 items-center justify-center rounded-xl border ${styles[accent]}`}
//       >
//         {icon}
//       </div>

//       <h3 className="mt-4 font-bold text-white">{title}</h3>
//       <p className="mt-2 text-sm leading-6 text-slate-400">
//         {description}
//       </p>
//     </article>
//   );
// }

// function RuleCard({
//   number,
//   title,
//   description,
// }: {
//   number: string;
//   title: string;
//   description: string;
// }) {
//   return (
//     <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-cyan-400/20 hover:bg-slate-900">
//       <span className="text-xs font-black tracking-widest text-cyan-300">
//         STEP {number}
//       </span>

//       <h3 className="mt-3 font-bold text-white">{title}</h3>

//       <p className="mt-2 text-sm leading-6 text-slate-400">
//         {description}
//       </p>
//     </article>
//   );
// }
