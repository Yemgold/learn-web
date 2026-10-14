
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
                  href="/student/games/whot/play"
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
              href="/student/games/whot/play"
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

















// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   Atom,
//   BookOpen,
//   Brain,
//   CheckCircle2,
//   Clock3,
//   Gamepad2,
//   GraduationCap,
//   Lightbulb,
//   LockKeyhole,
//   Search,
//   Sparkles,
//   Trophy,
//   Zap,
// } from "lucide-react";
// import { useMemo, useState } from "react";

// type GameCategory = "All Games" | "Quiz" | "Word Games" | "Strategy";

// type Game = {
//   id: string;
//   title: string;
//   description: string;
//   category: Exclude<GameCategory, "All Games">;
//   href: string;
//   icon: typeof Gamepad2;
//   accent: string;
//   iconBackground: string;
//   badge?: string;
//   featured?: boolean;
//   available: boolean;
//   estimatedMinutes: number;
//   skills: string[];
// };

// const GAMES: Game[] = [
//   {
//     id: "whot",
//     title: "Learnyfi WHOT",
//     description:
//       "Match subjects, answer academic questions, and outsmart the computer in this educational card game.",
//     category: "Strategy",
//     href: "/student/games/whot",
//     icon: Sparkles,
//     accent: "text-cyan-300",
//     iconBackground: "bg-cyan-400/10",
//     badge: "Featured",
//     featured: true,
//     available: true,
//     estimatedMinutes: 5,
//     skills: ["Quick thinking", "Subject knowledge"],
//   },
//   {
//     id: "word-challenge",
//     title: "Word Challenge",
//     description:
//       "Solve word puzzles before time runs out. Use clues wisely and earn points for fast, correct answers.",
//     category: "Word Games",
//     href: "/student/games/word-challenge",
//     icon: Brain,
//     accent: "text-violet-300",
//     iconBackground: "bg-violet-400/10",
//     badge: "Play now",
//     available: true,
//     estimatedMinutes: 3,
//     skills: ["Vocabulary", "Spelling"],
//   },

//   {
//     id: "quiz-practice",
//     title: "Quick Quiz",
//     description:
//       "Challenge yourself with short academic quizzes to sharpen your knowledge across school subjects.",
//     category: "Quiz",
//     href: "/student/practice/cbtsubjects?exam=jamb",
//     icon: GraduationCap,
//     accent: "text-emerald-300",
//     iconBackground: "bg-emerald-400/10",
//     available: true,
//     estimatedMinutes: 10,
//     skills: ["Recall", "Exam preparation"],
//   },
//   {
//     id: "science-challenge",
//     title: "Science Challenge",
//     description:
//       "Put your Biology, Chemistry, and Physics knowledge to the test with science-focused questions.",
//     category: "Quiz",
//     href: "/student/practice/cbtsubjects?exam=jamb",
//     icon: Atom,
//     accent: "text-amber-300",
//     iconBackground: "bg-amber-400/10",
//     available: true,
//     estimatedMinutes: 10,
//     skills: ["Science", "Problem-solving"],
//   },
//   {
//     id: "flashcards",
//     title: "Flashcard Challenge",
//     description:
//       "Review important concepts, strengthen memory, and revise topics with your learning flashcards.",
//     category: "Quiz",
//     href: "/student/flashcards",
//     icon: BookOpen,
//     accent: "text-pink-300",
//     iconBackground: "bg-pink-400/10",
//     available: true,
//     estimatedMinutes: 5,
//     skills: ["Memory", "Revision"],
//   },
//   {
//     id: "daily-tournament",
//     title: "Daily Tournament",
//     description:
//       "A dedicated competitive game mode for learners who want to test their knowledge against others.",
//     category: "Strategy",
//     href: "/student/quiz-board",
//     icon: Trophy,
//     accent: "text-orange-300",
//     iconBackground: "bg-orange-400/10",
//     badge: "Competition",
//     available: true,
//     estimatedMinutes: 15,
//     skills: ["Competition", "Accuracy"],
//   },
// ];

// const CATEGORIES: GameCategory[] = [
//   "All Games",
//   "Quiz",
//   "Word Games",
//   "Strategy",
// ];

// function GameCard({ game }: { game: Game }) {
//   const Icon = game.icon;

//   return (
//     <article
//       className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-slate-900/80 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900 ${
//         game.featured
//           ? "border-cyan-400/25 shadow-lg shadow-cyan-950/20"
//           : "border-white/10"
//       }`}
//     >
//       {game.featured && (
//         <div
//           aria-hidden="true"
//           className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20"
//         />
//       )}

//       <div className="relative flex flex-1 flex-col p-5 sm:p-6">
//         <div className="flex items-start justify-between gap-3">
//           <div
//             className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 ${game.iconBackground}`}
//           >
//             <Icon className={`h-7 w-7 ${game.accent}`} />
//           </div>

//           {game.badge && (
//             <span
//               className={`rounded-full px-3 py-1 text-[11px] font-bold ${
//                 game.featured
//                   ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
//                   : "border border-white/10 bg-slate-800 text-slate-300"
//               }`}
//             >
//               {game.badge}
//             </span>
//           )}
//         </div>

//         <div className="mt-5">
//           <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//             {game.category}
//           </p>

//           <h2 className="mt-2 text-lg font-extrabold text-white sm:text-xl">
//             {game.title}
//           </h2>

//           <p className="mt-3 text-sm leading-6 text-slate-400">
//             {game.description}
//           </p>
//         </div>

//         <div className="mt-5 flex flex-wrap gap-2">
//           {game.skills.map((skill) => (
//             <span
//               className="rounded-lg border border-white/5 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300"
//               key={skill}
//             >
//               {skill}
//             </span>
//           ))}
//         </div>

//         <div className="mt-auto pt-6">
//           <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
//             <Clock3 className="h-4 w-4" />
//             <span>About {game.estimatedMinutes} minutes</span>
//           </div>

//           {game.available ? (
//             <Link
//               href={game.href}
//               className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
//                 game.featured
//                   ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
//                   : "border border-white/10 bg-slate-800 text-white hover:border-white/20 hover:bg-slate-700"
//               }`}
//             >
//               Play game
//               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//           ) : (
//             <button
//               type="button"
//               disabled
//               className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm font-bold text-slate-500"
//             >
//               <LockKeyhole className="h-4 w-4" />
//               Coming soon
//             </button>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// export default function GamesPage() {
//   const [activeCategory, setActiveCategory] =
//     useState<GameCategory>("All Games");
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredGames = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase();

//     return GAMES.filter((game) => {
//       const matchesCategory =
//         activeCategory === "All Games" ||
//         game.category === activeCategory;

//       const matchesSearch =
//         !query ||
//         game.title.toLowerCase().includes(query) ||
//         game.description.toLowerCase().includes(query) ||
//         game.skills.some((skill) =>
//           skill.toLowerCase().includes(query),
//         );

//       return matchesCategory && matchesSearch;
//     });
//   }, [activeCategory, searchQuery]);

//   const featuredGame = GAMES.find((game) => game.featured);

//   return (
//     <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Page heading */}
//         <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
//           <div>
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
//               <Gamepad2 className="h-4 w-4" />
//               LEARNYFI GAME CENTRE
//             </div>

//             <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
//               Learn more.
//               <span className="text-cyan-300"> Play smarter.</span>
//             </h1>

//             <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
//               Welcome to your learning playground. Play educational
//               games, sharpen your skills, and make every minute count.
//             </p>
//           </div>

//           <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
//               <Zap className="h-5 w-5 text-amber-300" />
//             </div>
//             <div>
//               <p className="text-sm font-bold text-white">
//                 Your next challenge awaits
//               </p>
//               <p className="mt-1 text-xs text-slate-400">
//                 Choose a game to begin
//               </p>
//             </div>
//           </div>
//         </header>

//         {/* Featured game banner */}
//         {featuredGame && (
//           <section className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-900 p-6 sm:p-8 lg:p-10">
//             <div
//               aria-hidden="true"
//               className="absolute -right-12 -top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
//             />

//             <div
//               aria-hidden="true"
//               className="absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl"
//             />

//             <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
//               <div className="max-w-2xl">
//                 <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
//                   <Sparkles className="h-4 w-4" />
//                   FEATURED GAME
//                 </div>

//                 <h2 className="mt-5 text-2xl font-black sm:text-3xl lg:text-4xl">
//                   Meet your new favourite card game.
//                 </h2>

//                 <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
//                   Match academic subjects, tackle timed questions,
//                   and challenge the bot in Learnyfi WHOT. Every card
//                   you play is another opportunity to learn.
//                 </p>

//                 <div className="mt-6 flex flex-wrap gap-3">
//                   <Link
//                     href={featuredGame.href}
//                     className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300"
//                   >
//                     Play Learnyfi WHOT
//                     <ArrowRight className="h-4 w-4" />
//                   </Link>

//                   <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-300">
//                     <CheckCircle2 className="h-4 w-4 text-emerald-300" />
//                     Educational gameplay
//                   </div>
//                 </div>
//               </div>

//               <div className="hidden md:flex md:justify-center">
//                 <div className="relative h-52 w-40 rotate-[-10deg] rounded-3xl border border-cyan-300/30 bg-slate-950 p-3 shadow-2xl shadow-black/40">
//                   <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/10">
//                     <BookOpen className="h-12 w-12 text-cyan-300" />
//                     <span className="mt-4 text-xl font-black tracking-widest text-white">
//                       WHOT
//                     </span>
//                     <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-200">
//                       Learn & Play
//                     </span>
//                   </div>
//                   <span className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/20 bg-amber-400 text-slate-950 shadow-lg">
//                     <Sparkles className="h-5 w-5" />
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Game discovery */}
//         <section className="mt-10">
//           <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
//             <div>
//               <h2 className="text-xl font-extrabold sm:text-2xl">
//                 Explore games
//               </h2>
//               <p className="mt-2 text-sm text-slate-400">
//                 Find a challenge that matches your mood.
//               </p>
//             </div>

//             <div className="relative w-full sm:max-w-xs">
//               <Search
//                 aria-hidden="true"
//                 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
//               />
//               <input
//                 aria-label="Search games"
//                 type="search"
//                 value={searchQuery}
//                 onChange={(event) => setSearchQuery(event.target.value)}
//                 placeholder="Search games or skills..."
//                 className="h-11 w-full rounded-xl border border-white/10 bg-slate-900 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
//               />
//             </div>
//           </div>

//           <div
//             aria-label="Filter games by category"
//             className="mt-5 flex gap-2 overflow-x-auto pb-2"
//           >
//             {CATEGORIES.map((category) => {
//               const isActive = activeCategory === category;

//               return (
//                 <button
//                   key={category}
//                   type="button"
//                   aria-pressed={isActive}
//                   onClick={() => setActiveCategory(category)}
//                   className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
//                     isActive
//                       ? "border-cyan-400 bg-cyan-400 text-slate-950"
//                       : "border-white/10 bg-slate-900 text-slate-300 hover:border-white/20 hover:bg-slate-800"
//                   }`}
//                 >
//                   {category}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="mb-4 mt-5 flex items-center justify-between gap-3">
//             <p className="text-sm text-slate-400">
//               {filteredGames.length}{" "}
//               {filteredGames.length === 1 ? "game" : "games"} available
//             </p>

//             {(activeCategory !== "All Games" || searchQuery) && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setActiveCategory("All Games");
//                   setSearchQuery("");
//                 }}
//                 className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>

//           {filteredGames.length > 0 ? (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//               {filteredGames.map((game) => (
//                 <GameCard game={game} key={game.id} />
//               ))}
//             </div>
//           ) : (
//             <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-5 py-14 text-center">
//               <Search className="mx-auto h-9 w-9 text-slate-500" />
//               <h3 className="mt-4 text-lg font-bold text-white">
//                 No games found
//               </h3>
//               <p className="mt-2 text-sm text-slate-400">
//                 Try a different search or choose another category.
//               </p>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setActiveCategory("All Games");
//                   setSearchQuery("");
//                 }}
//                 className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
//               >
//                 Show all games
//               </button>
//             </div>
//           )}
//         </section>

//         {/* Learning encouragement */}
//         <section className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
//           <div className="flex items-start gap-4">
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10">
//               <Lightbulb className="h-6 w-6 text-violet-300" />
//             </div>
//             <div>
//               <h2 className="font-bold text-white">
//                 Small sessions. Big progress.
//               </h2>
//               <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
//                 Play regularly, review what you learn, and use each
//                 challenge to build stronger study habits.
//               </p>
//             </div>
//           </div>

//           <Link
//             href="/student/flashcards"
//             className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
//           >
//             Review flashcards
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//         </section>

//         <footer className="mt-8 pb-4 text-center text-xs text-slate-600">
//           Learnyfi · Learn something new every time you play.
//         </footer>
//       </div>
//     </main>
//   );
// }

