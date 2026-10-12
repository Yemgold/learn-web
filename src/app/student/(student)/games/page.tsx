
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  LockKeyhole,
  Search,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type GameCategory = "All Games" | "Quiz" | "Word Games" | "Strategy";

type Game = {
  id: string;
  title: string;
  description: string;
  category: Exclude<GameCategory, "All Games">;
  href: string;
  icon: typeof Gamepad2;
  accent: string;
  iconBackground: string;
  badge?: string;
  featured?: boolean;
  available: boolean;
  estimatedMinutes: number;
  skills: string[];
};

const GAMES: Game[] = [
  {
    id: "whot",
    title: "Learnyfi WHOT",
    description:
      "Match subjects, answer academic questions, and outsmart the computer in this educational card game.",
    category: "Strategy",
    href: "/student/games/whot",
    icon: Sparkles,
    accent: "text-cyan-300",
    iconBackground: "bg-cyan-400/10",
    badge: "Featured",
    featured: true,
    available: true,
    estimatedMinutes: 5,
    skills: ["Quick thinking", "Subject knowledge"],
  },
  {
    id: "word-challenge",
    title: "Word Challenge",
    description:
      "Solve word puzzles before time runs out. Use clues wisely and earn points for fast, correct answers.",
    category: "Word Games",
    href: "/student/games/word-challenge",
    icon: Brain,
    accent: "text-violet-300",
    iconBackground: "bg-violet-400/10",
    badge: "Play now",
    available: true,
    estimatedMinutes: 3,
    skills: ["Vocabulary", "Spelling"],
  },
  {
    id: "quiz-practice",
    title: "Quick Quiz",
    description:
      "Challenge yourself with short academic quizzes to sharpen your knowledge across school subjects.",
    category: "Quiz",
    href: "/student/practice/cbtsubjects?exam=jamb",
    icon: GraduationCap,
    accent: "text-emerald-300",
    iconBackground: "bg-emerald-400/10",
    available: true,
    estimatedMinutes: 10,
    skills: ["Recall", "Exam preparation"],
  },
  {
    id: "science-challenge",
    title: "Science Challenge",
    description:
      "Put your Biology, Chemistry, and Physics knowledge to the test with science-focused questions.",
    category: "Quiz",
    href: "/student/practice/cbtsubjects?exam=jamb",
    icon: Atom,
    accent: "text-amber-300",
    iconBackground: "bg-amber-400/10",
    available: true,
    estimatedMinutes: 10,
    skills: ["Science", "Problem-solving"],
  },
  {
    id: "flashcards",
    title: "Flashcard Challenge",
    description:
      "Review important concepts, strengthen memory, and revise topics with your learning flashcards.",
    category: "Quiz",
    href: "/student/flashcards",
    icon: BookOpen,
    accent: "text-pink-300",
    iconBackground: "bg-pink-400/10",
    available: true,
    estimatedMinutes: 5,
    skills: ["Memory", "Revision"],
  },
  {
    id: "daily-tournament",
    title: "Daily Tournament",
    description:
      "A dedicated competitive game mode for learners who want to test their knowledge against others.",
    category: "Strategy",
    href: "/student/quiz-board",
    icon: Trophy,
    accent: "text-orange-300",
    iconBackground: "bg-orange-400/10",
    badge: "Competition",
    available: true,
    estimatedMinutes: 15,
    skills: ["Competition", "Accuracy"],
  },
];

const CATEGORIES: GameCategory[] = [
  "All Games",
  "Quiz",
  "Word Games",
  "Strategy",
];

function GameCard({ game }: { game: Game }) {
  const Icon = game.icon;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-slate-900/80 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900 ${
        game.featured
          ? "border-cyan-400/25 shadow-lg shadow-cyan-950/20"
          : "border-white/10"
      }`}
    >
      {game.featured && (
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20"
        />
      )}

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 ${game.iconBackground}`}
          >
            <Icon className={`h-7 w-7 ${game.accent}`} />
          </div>

          {game.badge && (
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                game.featured
                  ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                  : "border border-white/10 bg-slate-800 text-slate-300"
              }`}
            >
              {game.badge}
            </span>
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {game.category}
          </p>

          <h2 className="mt-2 text-lg font-extrabold text-white sm:text-xl">
            {game.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {game.description}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {game.skills.map((skill) => (
            <span
              className="rounded-lg border border-white/5 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300"
              key={skill}
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-4 w-4" />
            <span>About {game.estimatedMinutes} minutes</span>
          </div>

          {game.available ? (
            <Link
              href={game.href}
              className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                game.featured
                  ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  : "border border-white/10 bg-slate-800 text-white hover:border-white/20 hover:bg-slate-700"
              }`}
            >
              Play game
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm font-bold text-slate-500"
            >
              <LockKeyhole className="h-4 w-4" />
              Coming soon
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function GamesPage() {
  const [activeCategory, setActiveCategory] =
    useState<GameCategory>("All Games");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return GAMES.filter((game) => {
      const matchesCategory =
        activeCategory === "All Games" ||
        game.category === activeCategory;

      const matchesSearch =
        !query ||
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.skills.some((skill) =>
          skill.toLowerCase().includes(query),
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredGame = GAMES.find((game) => game.featured);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
              <Gamepad2 className="h-4 w-4" />
              LEARNYFI GAME CENTRE
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Learn more.
              <span className="text-cyan-300"> Play smarter.</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Welcome to your learning playground. Play educational
              games, sharpen your skills, and make every minute count.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
              <Zap className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Your next challenge awaits
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Choose a game to begin
              </p>
            </div>
          </div>
        </header>

        {/* Featured game banner */}
        {featuredGame && (
          <section className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-900 p-6 sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl"
            />

            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  FEATURED GAME
                </div>

                <h2 className="mt-5 text-2xl font-black sm:text-3xl lg:text-4xl">
                  Meet your new favourite card game.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Match academic subjects, tackle timed questions,
                  and challenge the bot in Learnyfi WHOT. Every card
                  you play is another opportunity to learn.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={featuredGame.href}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Play Learnyfi WHOT
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Educational gameplay
                  </div>
                </div>
              </div>

              <div className="hidden md:flex md:justify-center">
                <div className="relative h-52 w-40 rotate-[-10deg] rounded-3xl border border-cyan-300/30 bg-slate-950 p-3 shadow-2xl shadow-black/40">
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/10">
                    <BookOpen className="h-12 w-12 text-cyan-300" />
                    <span className="mt-4 text-xl font-black tracking-widest text-white">
                      WHOT
                    </span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-200">
                      Learn & Play
                    </span>
                  </div>
                  <span className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/20 bg-amber-400 text-slate-950 shadow-lg">
                    <Sparkles className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Game discovery */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">
                Explore games
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Find a challenge that matches your mood.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
              <input
                aria-label="Search games"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search games or skills..."
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-900 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>
          </div>

          <div
            aria-label="Filter games by category"
            className="mt-5 flex gap-2 overflow-x-auto pb-2"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "border-cyan-400 bg-cyan-400 text-slate-950"
                      : "border-white/10 bg-slate-900 text-slate-300 hover:border-white/20 hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mb-4 mt-5 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              {filteredGames.length}{" "}
              {filteredGames.length === 1 ? "game" : "games"} available
            </p>

            {(activeCategory !== "All Games" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All Games");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredGames.map((game) => (
                <GameCard game={game} key={game.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-5 py-14 text-center">
              <Search className="mx-auto h-9 w-9 text-slate-500" />
              <h3 className="mt-4 text-lg font-bold text-white">
                No games found
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Try a different search or choose another category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All Games");
                  setSearchQuery("");
                }}
                className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
              >
                Show all games
              </button>
            </div>
          )}
        </section>

        {/* Learning encouragement */}
        <section className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10">
              <Lightbulb className="h-6 w-6 text-violet-300" />
            </div>
            <div>
              <h2 className="font-bold text-white">
                Small sessions. Big progress.
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                Play regularly, review what you learn, and use each
                challenge to build stronger study habits.
              </p>
            </div>
          </div>

          <Link
            href="/student/flashcards"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Review flashcards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <footer className="mt-8 pb-4 text-center text-xs text-slate-600">
          Learnyfi · Learn something new every time you play.
        </footer>
      </div>
    </main>
  );
}








// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   Brain,
//   Gamepad2,
//   Sparkles,
//   Trophy,
//   Zap,
// } from "lucide-react";

// export default function GamesPage() {
//   return (
//     <main className="min-h-screen bg-[#070b14] text-white">
//       <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <section className="mb-8">
//           <div className="mb-4 flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/20">
//               <Gamepad2 className="h-5 w-5 text-violet-300" />
//             </div>

//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
//                 Learnyfi Games
//               </p>

//               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
//                 Learn. Play. Win.
//               </h1>
//             </div>
//           </div>

//           <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
//             Challenge yourself with quick learning games designed to test
//             your knowledge, speed, memory, and thinking skills.
//           </p>
//         </section>

//         {/* Featured Game */}
//         <section className="mb-8">
//           <Link
//             href="/student/games/word-challenge"
//             className="group block"
//           >
//             <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-slate-900 to-slate-950 p-5 shadow-2xl transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/30 sm:p-7">
//               {/* Decorative glow */}
//               <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

//               <div className="relative">
//                 <div className="mb-6 flex items-start justify-between gap-4">
//                   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/20">
//                     <Brain className="h-7 w-7 text-violet-300" />
//                   </div>

//                   <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
//                     Available Now
//                   </span>
//                 </div>

//                 <div className="max-w-2xl">
//                   <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
//                     <Sparkles className="h-3.5 w-3.5" />
//                     Featured Game
//                   </p>

//                   <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
//                     Word Challenge
//                   </h2>

//                   <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
//                     Read the description, think quickly, build the word from
//                     shuffled letters, and earn more points the faster you
//                     solve it.
//                   </p>
//                 </div>

//                 {/* Game philosophy */}
//                 <div className="mt-6 grid gap-3 sm:grid-cols-3">
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//                     <div className="mb-2 flex items-center gap-2">
//                       <Brain className="h-4 w-4 text-violet-300" />
//                       <span className="text-sm font-semibold">
//                         Think
//                       </span>
//                     </div>

//                     <p className="text-xs leading-5 text-slate-400">
//                       Read the description carefully.
//                     </p>
//                   </div>

//                   <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//                     <div className="mb-2 flex items-center gap-2">
//                       <Zap className="h-4 w-4 text-amber-300" />
//                       <span className="text-sm font-semibold">
//                         Build
//                       </span>
//                     </div>

//                     <p className="text-xs leading-5 text-slate-400">
//                       Arrange the letters to find the word.
//                     </p>
//                   </div>

//                   <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//                     <div className="mb-2 flex items-center gap-2">
//                       <Trophy className="h-4 w-4 text-emerald-300" />
//                       <span className="text-sm font-semibold">
//                         Earn
//                       </span>
//                     </div>

//                     <p className="text-xs leading-5 text-slate-400">
//                       Solve faster to keep more points.
//                     </p>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <div className="mt-7 flex items-center justify-between gap-4">
//                   <div>
//                     <p className="text-xs text-slate-500">
//                       The faster you know,
//                     </p>
//                     <p className="text-sm font-semibold text-white">
//                       the more you earn.
//                     </p>
//                   </div>

//                   <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition group-hover:bg-violet-100">
//                     Play Now
//                     <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </section>

//         {/* Coming Soon */}
//         <section>
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-bold">
//                 More Games
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 More ways to learn and challenge yourself are coming.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {/* Daily Challenge */}
//             <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
//               <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
//                 <Zap className="h-5 w-5 text-amber-300" />
//               </div>

//               <h3 className="font-semibold">
//                 Daily Challenge
//               </h3>

//               <p className="mt-2 text-sm leading-5 text-slate-500">
//                 Complete a new learning challenge every day and build your
//                 streak.
//               </p>

//               <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-500">
//                 Coming Soon
//               </span>
//             </div>

//             {/* Memory Challenge */}
//             <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
//               <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
//                 <Brain className="h-5 w-5 text-cyan-300" />
//               </div>

//               <h3 className="font-semibold">
//                 Memory Challenge
//               </h3>

//               <p className="mt-2 text-sm leading-5 text-slate-500">
//                 Test how well you can remember facts, concepts, and
//                 information.
//               </p>

//               <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-500">
//                 Coming Soon
//               </span>
//             </div>

//             {/* Knowledge Sprint */}
//             <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
//               <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
//                 <Trophy className="h-5 w-5 text-emerald-300" />
//               </div>

//               <h3 className="font-semibold">
//                 Knowledge Sprint
//               </h3>

//               <p className="mt-2 text-sm leading-5 text-slate-500">
//                 Race against the clock and answer as many learning questions
//                 as you can.
//               </p>

//               <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-500">
//                 Coming Soon
//               </span>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }
