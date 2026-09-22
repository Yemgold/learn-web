// "use client";

// import { useMemo, useState, type ReactNode } from "react";
// import Link from "next/link";

// import {
// ArrowRight,
// BookOpen,
// Brain,
// CheckCircle2,
// ChevronRight,
// Clock3,
// Flame,
// Layers3,
// Search,
// Sparkles,
// Trophy,
// } from "lucide-react";

// import {
// biologyFlashcardDecks,
// biologyFlashcards,
// } from "@/data/flashcards/biology";

// import {
// chemistryFlashcardDecks,
// chemistryFlashcards,
// } from "@/data/flashcards/chemistry";

// import type { FlashcardDeck } from "@/types/flashcard";

// /* ============================================================
// SUBJECT CONFIG
// ============================================================ */

// const SUBJECTS = [
// {
// id: "biology",
// name: "Biology",
// description:
// "Master Biology concepts with JAMB-focused flashcards.",
// icon: "🧬",
// available: true,
// decks: biologyFlashcardDecks,
// flashcards: biologyFlashcards,
// },
// {
// id: "chemistry",
// name: "Chemistry",
// description:
// "Build strong Chemistry knowledge topic by topic.",
// icon: "⚗️",
// available: true,
// decks: chemistryFlashcardDecks,
// flashcards: chemistryFlashcards,
// },
// {
// id: "physics",
// name: "Physics",
// description:
// "Review important Physics concepts and principles.",
// icon: "⚡",
// available: false,
// decks: [] as FlashcardDeck[],
// flashcards: [],
// },
// {
// id: "mathematics",
// name: "Mathematics",
// description:
// "Practice formulas, concepts and problem-solving techniques.",
// icon: "📐",
// available: false,
// decks: [] as FlashcardDeck[],
// flashcards: [],
// },
// {
// id: "english",
// name: "English",
// description:
// "Improve vocabulary, grammar and examination skills.",
// icon: "📚",
// available: false,
// decks: [] as FlashcardDeck[],
// flashcards: [],
// },
// ];

// /* ============================================================
// LOCAL STORAGE
// ============================================================ */

// const PROGRESS_PREFIX =
// "jamb-league-flashcards-progress:";

// interface StoredCardProgress {
// cardId: string;
// views: number;
// correctCount: number;
// reviewCount: number;
// mastered: boolean;
// lastReviewedAt?: string;
// }

// interface StoredProgress {
// deckId: string;
// totalCards: number;
// masteredCards: number;
// reviewCards: number;
// remainingCards: number;
// percentage: number;
// cards: StoredCardProgress[];
// }

// /* ============================================================
// HELPERS
// ============================================================ */

// function getStoredProgress(
// deckId: string,
// ): StoredProgress | null {
// if (typeof window === "undefined") {
// return null;
// }

// try {
// const raw = localStorage.getItem(
// `${PROGRESS_PREFIX}${deckId}`,
// );


// if (!raw) {
//   return null;
// }

// return JSON.parse(raw) as StoredProgress;


// } catch {
// return null;
// }
// }

// /* ============================================================
// GET DECK PROGRESS
// ============================================================ */

// function getDeckProgress(deck: FlashcardDeck) {
// const stored = getStoredProgress(deck.id);

// if (!stored) {
// return {
// mastered: 0,
// reviewed: 0,
// remaining: deck.cards.length,
// percentage: 0,
// };
// }

// const cards = Array.isArray(stored.cards)
// ? stored.cards
// : [];

// const mastered = cards.filter(
// (card) => card.mastered,
// ).length;

// const reviewed = cards.filter(
// (card) =>
// card.reviewCount > 0 ||
// card.views > 0,
// ).length;

// const remaining = Math.max(
// deck.cards.length - mastered,
// 0,
// );

// const percentage =
// deck.cards.length > 0
// ? Math.round(
// (mastered / deck.cards.length) * 100,
// )
// : 0;

// return {
// mastered,
// reviewed,
// remaining,
// percentage,
// };
// }

// /* ============================================================
// PAGE
// ============================================================ */

// export default function FlashcardsPage() {
// const [selectedSubject, setSelectedSubject] =
// useState("biology");

// const [searchQuery, setSearchQuery] = useState("");

// /* ==========================================================
// SELECTED SUBJECT
// ========================================================== */

// const selectedSubjectData = useMemo(() => {
// return (
// SUBJECTS.find(
// (subject) => subject.id === selectedSubject,
// ) ?? SUBJECTS[0]
// );
// }, [selectedSubject]);

// /* ==========================================================
// SELECTED SUBJECT DECKS
// ========================================================== */

// const decks = selectedSubjectData.decks;

// /* ==========================================================
// FILTER TOPICS
// ========================================================== */

// const filteredDecks = useMemo(() => {
// const query = searchQuery
// .trim()
// .toLowerCase();


// if (!query) {
//   return decks;
// }

// return decks.filter((deck) => {
//   return (
//     deck.title
//       .toLowerCase()
//       .includes(query) ||
//     deck.topic
//       .toLowerCase()
//       .includes(query) ||
//     deck.description
//       ?.toLowerCase()
//       .includes(query)
//   );
// });


// }, [decks, searchQuery]);

// /* ==========================================================
// SELECTED SUBJECT STATISTICS
// ========================================================== */

// const subjectStats = useMemo(() => {
// const totalCards =
// selectedSubjectData.flashcards.length;


// let mastered = 0;
// let reviewed = 0;

// if (typeof window !== "undefined") {
//   selectedSubjectData.decks.forEach((deck) => {
//     const progress = getDeckProgress(deck);

//     mastered += progress.mastered;
//     reviewed += progress.reviewed;
//   });
// }

// return {
//   totalCards,
//   mastered,
//   reviewed,
//   percentage:
//     totalCards > 0
//       ? Math.round(
//           (mastered / totalCards) * 100,
//         )
//       : 0,
// };


// }, [selectedSubjectData]);

// /* ==========================================================
// HANDLE SUBJECT CHANGE
// ========================================================== */

// function handleSubjectChange(subjectId: string) {
// setSelectedSubject(subjectId);
// setSearchQuery("");


// setTimeout(() => {
//   document
//     .getElementById("topics")
//     ?.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
// }, 50);


// }

// /* ==========================================================
// RENDER
// ========================================================== */

// return ( <main className="min-h-screen bg-[#070b14] text-white">
// {/* ======================================================
// BACKGROUND
// ====================================================== */}


//   <div className="pointer-events-none fixed inset-0 overflow-hidden">
//     <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

//     <div className="absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl" />

//     <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
//   </div>

//   <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//     {/* ====================================================
//         HERO
//         ==================================================== */}

//     <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/[0.12] via-white/[0.035] to-violet-500/[0.08] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
//       <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

//       <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

//       <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
//         <div className="max-w-3xl">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
//             <Sparkles className="h-3.5 w-3.5" />
//             JAMB League Flashcards
//           </div>

//           <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
//             Learn faster.
//             <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
//               Remember longer.
//             </span>
//           </h1>

//           <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
//             Study important JAMB concepts using
//             focused flashcards. Reveal answers, mark
//             what you know, review difficult cards, and
//             track your progress as you learn.
//           </p>

//           <div className="mt-6 flex flex-wrap gap-3">
//             <a
//               href="#topics"
//               className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
//             >
//               <BookOpen className="h-4 w-4" />
//               Start Studying
//               <ArrowRight className="h-4 w-4" />
//             </a>

//             <a
//               href="#subjects"
//               className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.09]"
//             >
//               Browse Subjects
//             </a>
//           </div>
//         </div>

//         {/* ==================================================
//             HERO VISUAL
//             ================================================== */}

//         <div className="hidden lg:block">
//           <div className="relative h-52 w-52">
//             <div className="absolute inset-0 rotate-6 rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5" />

//             <div className="absolute inset-4 -rotate-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl" />

//             <div className="absolute inset-8 flex rotate-2 items-center justify-center rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl">
//               <Brain className="h-20 w-20 text-cyan-300" />
//             </div>

//             <div className="absolute -bottom-4 -right-5 rounded-xl border border-white/10 bg-[#101827] px-4 py-3 shadow-xl">
//               <div className="flex items-center gap-2">
//                 <Trophy className="h-4 w-4 text-amber-300" />

//                 <span className="text-xs font-bold">
//                   Keep learning
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>

//     {/* ====================================================
//         QUICK STATS
//         ==================================================== */}

//     <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
//       <StatCard
//         icon={<Layers3 className="h-5 w-5" />}
//         label={`${selectedSubjectData.name} Cards`}
//         value={subjectStats.totalCards}
//         iconClass="text-cyan-300"
//         bgClass="bg-cyan-400/10"
//       />

//       <StatCard
//         icon={<CheckCircle2 className="h-5 w-5" />}
//         label="Mastered"
//         value={subjectStats.mastered}
//         iconClass="text-emerald-300"
//         bgClass="bg-emerald-400/10"
//       />

//       <StatCard
//         icon={<Clock3 className="h-5 w-5" />}
//         label="Reviewed"
//         value={subjectStats.reviewed}
//         iconClass="text-amber-300"
//         bgClass="bg-amber-400/10"
//       />

//       <StatCard
//         icon={<Trophy className="h-5 w-5" />}
//         label="Progress"
//         value={`${subjectStats.percentage}%`}
//         iconClass="text-violet-300"
//         bgClass="bg-violet-400/10"
//       />
//     </section>

//     {/* ====================================================
//         SUBJECTS
//         ==================================================== */}

//     <section
//       id="subjects"
//       className="mt-10 scroll-mt-6"
//     >
//       <div className="mb-5">
//         <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
//           Choose a subject
//         </p>

//         <h2 className="mt-1 text-2xl font-black tracking-tight">
//           Study by Subject
//         </h2>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
//         {SUBJECTS.map((subject) => {
//           const active =
//             selectedSubject === subject.id;

//           return (
//             <button
//               key={subject.id}
//               type="button"
//               onClick={() =>
//                 handleSubjectChange(subject.id)
//               }
//               className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
//                 active
//                   ? "border-cyan-400/40 bg-cyan-400/[0.09] shadow-lg shadow-cyan-950/20"
//                   : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
//               }`}
//             >
//               {/* Active indicator */}

//               {active && (
//                 <div className="absolute right-3 top-3">
//                   <CheckCircle2 className="h-4 w-4 text-cyan-300" />
//                 </div>
//               )}

//               {/* Coming soon indicator */}

//               {!subject.available && (
//                 <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/40">
//                   Soon
//                 </div>
//               )}

//               <div className="mb-3 text-3xl">
//                 {subject.icon}
//               </div>

//               <h3 className="font-bold">
//                 {subject.name}
//               </h3>

//               <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">
//                 {subject.description}
//               </p>

//               {/* Card count */}

//               {subject.available && (
//                 <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-white/35">
//                   <Layers3 className="h-3 w-3" />

//                   {subject.flashcards.length} cards
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </div>
//     </section>

//     {/* ====================================================
//         TOPICS
//         ==================================================== */}

//     <section
//       id="topics"
//       className="mt-10 scroll-mt-6"
//     >
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <span className="text-2xl">
//               {selectedSubjectData.icon}
//             </span>

//             <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
//               {selectedSubjectData.name}
//             </p>
//           </div>

//           <h2 className="mt-1 text-2xl font-black tracking-tight">
//             Choose a Topic
//           </h2>

//           <p className="mt-1 max-w-2xl text-sm text-white/45">
//             Select a topic to open its flashcard deck
//             and start learning.
//           </p>
//         </div>

//         {selectedSubjectData.available && (
//           <div className="relative w-full sm:w-72">
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

//             <input
//               value={searchQuery}
//               onChange={(event) =>
//                 setSearchQuery(event.target.value)
//               }
//               placeholder={`Search ${selectedSubjectData.name} topics...`}
//               className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/30 focus:bg-white/[0.06]"
//             />
//           </div>
//         )}
//       </div>

//       {/* ==================================================
//           AVAILABLE SUBJECT
//           ================================================== */}

//       {selectedSubjectData.available ? (
//         filteredDecks.length > 0 ? (
//           <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//             {filteredDecks.map((deck, index) => (
//               <TopicCard
//                 key={deck.id}
//                 deck={deck}
//                 index={index}
//               />
//             ))}
//           </div>
//         ) : (
//           <EmptySearch />
//         )
//       ) : (
//         <ComingSoon
//           subject={selectedSubjectData.name}
//         />
//       )}
//     </section>

//     {/* ====================================================
//         STUDY TIP
//         ==================================================== */}

//     <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.035] to-cyan-400/[0.04] p-5 sm:p-6">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
//           <Flame className="h-6 w-6" />
//         </div>

//         <div className="flex-1">
//           <h3 className="font-bold">
//             Study consistently
//           </h3>

//           <p className="mt-1 text-sm leading-6 text-white/45">
//             Short, repeated review sessions are more
//             useful than trying to memorize everything at
//             once. Mark difficult cards for review and
//             return to them regularly.
//           </p>
//         </div>

//         <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/50">
//           <span className="font-bold text-white/80">
//             Tip:
//           </span>{" "}
//           Review difficult cards first.
//         </div>
//       </div>
//     </section>

//     <div className="h-10" />
//   </div>
// </main>


// );
// }

// /* ============================================================
// STAT CARD
// ============================================================ */

// function StatCard({
// icon,
// label,
// value,
// iconClass,
// bgClass,
// }: {
// icon: ReactNode;
// label: string;
// value: string | number;
// iconClass: string;
// bgClass: string;
// }) {
// return ( <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
// <div
// className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${bgClass} ${iconClass}`}
// >
// {icon} </div>


//   <p className="text-2xl font-black tracking-tight">
//     {value}
//   </p>

//   <p className="mt-0.5 text-xs text-white/40">
//     {label}
//   </p>
// </div>


// );
// }

// /* ============================================================
// TOPIC CARD
// ============================================================ */

// function TopicCard({
// deck,
// index,
// }: {
// deck: FlashcardDeck;
// index: number;
// }) {
// const progress = getDeckProgress(deck);

// return (
// <Link
// href={`/student/flashcards/${deck.id}`}
// className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-cyan-950/10"
// >
// {/* Number */}

//   <div className="absolute right-4 top-4 text-xs font-black text-white/15">
//     {String(index + 1).padStart(2, "0")}
//   </div>

//   {/* Icon */}

//   <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
//     <BookOpen className="h-5 w-5" />
//   </div>

//   {/* Content */}

//   <div className="pr-7">
//     <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-bold leading-6">
//       {deck.title}
//     </h3>

//     <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-white/40">
//       {deck.description ??
//         "Study this topic using focused flashcards."}
//     </p>
//   </div>

//   {/* Card count */}

//   <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
//     <div className="flex items-center gap-1.5 text-xs text-white/40">
//       <Layers3 className="h-3.5 w-3.5" />

//       <span>
//         {deck.cards.length}{" "}
//         {deck.cards.length === 1
//           ? "card"
//           : "cards"}
//       </span>
//     </div>

//     <div className="flex items-center gap-1 text-xs font-semibold text-cyan-300">
//       Study

//       <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
//     </div>
//   </div>

//   {/* Progress */}

//   <div className="mt-4">
//     <div className="mb-1.5 flex items-center justify-between text-[10px]">
//       <span className="text-white/30">
//         Progress
//       </span>

//       <span className="font-bold text-white/50">
//         {progress.percentage}%
//       </span>
//     </div>

//     <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
//       <div
//         className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
//         style={{
//           width: `${progress.percentage}%`,
//         }}
//       />
//     </div>
//   </div>
// </Link>


// );
// }

// /* ============================================================
// COMING SOON
// ============================================================ */

// function ComingSoon({
// subject,
// }: {
// subject: string;
// }) {
// return ( <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center sm:p-12"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-3xl">
// 📚 </div>


//   <h3 className="mt-5 text-xl font-black">
//     {subject} Flashcards Coming Soon
//   </h3>

//   <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
//     We are preparing focused {subject} flashcards to
//     help you revise important concepts efficiently.
//   </p>

//   <button
//     type="button"
//     disabled
//     className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/30"
//   >
//     Coming Soon
//   </button>
// </div>


// );
// }

// /* ============================================================
// EMPTY SEARCH
// ============================================================ */

// function EmptySearch() {
// return ( <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center"> <Search className="mx-auto h-8 w-8 text-white/20" />


//   <h3 className="mt-4 font-bold">
//     No topics found
//   </h3>

//   <p className="mt-1 text-sm text-white/35">
//     Try another topic name or clear your search.
//   </p>
// </div>


// );
// }



























"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Layers3,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  biologyFlashcardDecks,
  biologyFlashcards,
} from "@/data/flashcards/biology";

import {
  chemistryFlashcardDecks,
  chemistryFlashcards,
} from "@/data/flashcards/chemistry";

import type { FlashcardDeck } from "@/types/flashcard";

/* ============================================================
   SUBJECT CONFIG
============================================================ */

const SUBJECTS = [
  {
    id: "biology",
    name: "Biology",
    description:
      "Master Biology concepts with JAMB-focused flashcards.",
    icon: "🧬",
    available: true,
    decks: biologyFlashcardDecks,
    flashcards: biologyFlashcards,
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description:
      "Build strong Chemistry knowledge topic by topic.",
    icon: "⚗️",
    available: true,
    decks: chemistryFlashcardDecks,
    flashcards: chemistryFlashcards,
  },
  {
    id: "physics",
    name: "Physics",
    description:
      "Review important Physics concepts and principles.",
    icon: "⚡",
    available: false,
    decks: [] as FlashcardDeck[],
    flashcards: [],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description:
      "Practice formulas, concepts and problem-solving techniques.",
    icon: "📐",
    available: false,
    decks: [] as FlashcardDeck[],
    flashcards: [],
  },
  {
    id: "english",
    name: "English",
    description:
      "Improve vocabulary, grammar and examination skills.",
    icon: "📚",
    available: false,
    decks: [] as FlashcardDeck[],
    flashcards: [],
  },
];

/* ============================================================
   PAGINATION
============================================================ */

const TOPICS_PER_PAGE = 6;

/* ============================================================
   LOCAL STORAGE
============================================================ */

const PROGRESS_PREFIX =
  "jamb-league-flashcards-progress:";

interface StoredCardProgress {
  cardId: string;
  views: number;
  correctCount: number;
  reviewCount: number;
  mastered: boolean;
  lastReviewedAt?: string;
}

interface StoredProgress {
  deckId: string;
  totalCards: number;
  masteredCards: number;
  reviewCards: number;
  remainingCards: number;
  percentage: number;
  cards: StoredCardProgress[];
}

/* ============================================================
   HELPERS
============================================================ */

function getStoredProgress(
  deckId: string,
): StoredProgress | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(
      `${PROGRESS_PREFIX}${deckId}`,
    );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredProgress;
  } catch {
    return null;
  }
}

/* ============================================================
   GET DECK PROGRESS
============================================================ */

function getDeckProgress(deck: FlashcardDeck) {
  const stored = getStoredProgress(deck.id);

  if (!stored) {
    return {
      mastered: 0,
      reviewed: 0,
      remaining: deck.cards.length,
      percentage: 0,
    };
  }

  const cards = Array.isArray(stored.cards)
    ? stored.cards
    : [];

  const mastered = cards.filter(
    (card) => card.mastered,
  ).length;

  const reviewed = cards.filter(
    (card) =>
      card.reviewCount > 0 ||
      card.views > 0,
  ).length;

  const remaining = Math.max(
    deck.cards.length - mastered,
    0,
  );

  const percentage =
    deck.cards.length > 0
      ? Math.round(
          (mastered / deck.cards.length) * 100,
        )
      : 0;

  return {
    mastered,
    reviewed,
    remaining,
    percentage,
  };
}

/* ============================================================
   PAGE
============================================================ */

export default function FlashcardsPage() {
  const [selectedSubject, setSelectedSubject] =
    useState("biology");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  /* ==========================================================
     SELECTED SUBJECT
  ========================================================== */

  const selectedSubjectData = useMemo(() => {
    return (
      SUBJECTS.find(
        (subject) =>
          subject.id === selectedSubject,
      ) ?? SUBJECTS[0]
    );
  }, [selectedSubject]);

  /* ==========================================================
     SELECTED SUBJECT DECKS
  ========================================================== */

  const decks = selectedSubjectData.decks;

  /* ==========================================================
     FILTER TOPICS
  ========================================================== */

  const filteredDecks = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return decks;
    }

    return decks.filter((deck) => {
      return (
        deck.title
          .toLowerCase()
          .includes(query) ||
        deck.topic
          .toLowerCase()
          .includes(query) ||
        deck.description
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [decks, searchQuery]);

  /* ==========================================================
     TOPIC PAGINATION
  ========================================================== */

  const totalPages = Math.max(
    Math.ceil(
      filteredDecks.length /
        TOPICS_PER_PAGE,
    ),
    1,
  );

  const paginatedDecks = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      TOPICS_PER_PAGE;

    return filteredDecks.slice(
      startIndex,
      startIndex + TOPICS_PER_PAGE,
    );
  }, [
    filteredDecks,
    currentPage,
  ]);

  const paginationStart =
    filteredDecks.length === 0
      ? 0
      : (currentPage - 1) *
          TOPICS_PER_PAGE +
        1;

  const paginationEnd = Math.min(
    currentPage * TOPICS_PER_PAGE,
    filteredDecks.length,
  );

  /* ==========================================================
     PAGE NUMBERS
  ========================================================== */

  const visiblePages = useMemo(() => {
    const pages: Array<
      number | "ellipsis-start" | "ellipsis-end"
    > = [];

    if (totalPages <= 7) {
      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis-start");
    }

    const startPage = Math.max(
      2,
      currentPage - 1,
    );

    const endPage = Math.min(
      totalPages - 1,
      currentPage + 1,
    );

    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis-end");
    }

    pages.push(totalPages);

    return pages;
  }, [
    currentPage,
    totalPages,
  ]);

  /* ==========================================================
     SELECTED SUBJECT STATISTICS
  ========================================================== */

  const subjectStats = useMemo(() => {
    const totalCards =
      selectedSubjectData.flashcards.length;

    let mastered = 0;
    let reviewed = 0;

    if (typeof window !== "undefined") {
      selectedSubjectData.decks.forEach(
        (deck) => {
          const progress =
            getDeckProgress(deck);

          mastered += progress.mastered;
          reviewed += progress.reviewed;
        },
      );
    }

    return {
      totalCards,
      mastered,
      reviewed,
      percentage:
        totalCards > 0
          ? Math.round(
              (mastered / totalCards) * 100,
            )
          : 0,
    };
  }, [selectedSubjectData]);

  /* ==========================================================
     SCROLL TO TOPICS
  ========================================================== */

  function scrollToTopics() {
    setTimeout(() => {
      document
        .getElementById("topics")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  /* ==========================================================
     HANDLE SUBJECT CHANGE
  ========================================================== */

  function handleSubjectChange(
    subjectId: string,
  ) {
    setSelectedSubject(subjectId);
    setSearchQuery("");
    setCurrentPage(1);

    scrollToTopics();
  }

  /* ==========================================================
     HANDLE SEARCH
  ========================================================== */

  function handleSearch(
    value: string,
  ) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  /* ==========================================================
     HANDLE PAGE CHANGE
  ========================================================== */

  function handlePageChange(
    page: number,
  ) {
    const safePage = Math.min(
      Math.max(page, 1),
      totalPages,
    );

    setCurrentPage(safePage);
    scrollToTopics();
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/[0.12] via-white/[0.035] to-violet-500/[0.08] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />

                JAMB League Flashcards
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Learn faster.

                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                  Remember longer.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Study important JAMB concepts
                using focused flashcards.
                Reveal answers, mark what you
                know, review difficult cards,
                and track your progress as you
                learn.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#topics"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  <BookOpen className="h-4 w-4" />

                  Start Studying

                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#subjects"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.09]"
                >
                  Browse Subjects
                </a>
              </div>
            </div>

            {/* ==================================================
                HERO VISUAL
            ================================================== */}

            <div className="hidden lg:block">
              <div className="relative h-52 w-52">
                <div className="absolute inset-0 rotate-6 rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5" />

                <div className="absolute inset-4 -rotate-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl" />

                <div className="absolute inset-8 flex rotate-2 items-center justify-center rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl">
                  <Brain className="h-20 w-20 text-cyan-300" />
                </div>

                <div className="absolute -bottom-4 -right-5 rounded-xl border border-white/10 bg-[#101827] px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-300" />

                    <span className="text-xs font-bold">
                      Keep learning
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            QUICK STATS
        ==================================================== */}

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={
              <Layers3 className="h-5 w-5" />
            }
            label={`${selectedSubjectData.name} Cards`}
            value={subjectStats.totalCards}
            iconClass="text-cyan-300"
            bgClass="bg-cyan-400/10"
          />

          <StatCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Mastered"
            value={subjectStats.mastered}
            iconClass="text-emerald-300"
            bgClass="bg-emerald-400/10"
          />

          <StatCard
            icon={
              <Clock3 className="h-5 w-5" />
            }
            label="Reviewed"
            value={subjectStats.reviewed}
            iconClass="text-amber-300"
            bgClass="bg-amber-400/10"
          />

          <StatCard
            icon={
              <Trophy className="h-5 w-5" />
            }
            label="Progress"
            value={`${subjectStats.percentage}%`}
            iconClass="text-violet-300"
            bgClass="bg-violet-400/10"
          />
        </section>

        {/* ====================================================
            SUBJECTS
        ==================================================== */}

        <section
          id="subjects"
          className="mt-10 scroll-mt-6"
        >
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
              Choose a subject
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Study by Subject
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SUBJECTS.map((subject) => {
              const active =
                selectedSubject ===
                subject.id;

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() =>
                    handleSubjectChange(
                      subject.id,
                    )
                  }
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-cyan-400/40 bg-cyan-400/[0.09] shadow-lg shadow-cyan-950/20"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Active indicator */}

                  {active && (
                    <div className="absolute right-3 top-3">
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    </div>
                  )}

                  {/* Coming soon */}

                  {!subject.available && (
                    <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/40">
                      Soon
                    </div>
                  )}

                  <div className="mb-3 text-3xl">
                    {subject.icon}
                  </div>

                  <h3 className="font-bold">
                    {subject.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">
                    {subject.description}
                  </p>

                  {subject.available && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-white/35">
                      <Layers3 className="h-3 w-3" />

                      {subject.flashcards.length}{" "}
                      cards
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            TOPICS
        ==================================================== */}

        <section
          id="topics"
          className="mt-10 scroll-mt-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {selectedSubjectData.icon}
                </span>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
                  {selectedSubjectData.name}
                </p>
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight">
                Choose a Topic
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-white/45">
                Select a topic to open its
                flashcard deck and start
                learning.
              </p>
            </div>

            {selectedSubjectData.available && (
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  value={searchQuery}
                  onChange={(event) =>
                    handleSearch(
                      event.target.value,
                    )
                  }
                  placeholder={`Search ${selectedSubjectData.name} topics...`}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/30 focus:bg-white/[0.06]"
                />
              </div>
            )}
          </div>

          {/* ==================================================
              AVAILABLE SUBJECT
          ================================================== */}

          {selectedSubjectData.available ? (
            filteredDecks.length > 0 ? (
              <>
                {/* ==================================================
                    TOPIC CARDS
                ================================================== */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedDecks.map(
                    (deck, index) => (
                      <TopicCard
                        key={deck.id}
                        deck={deck}
                        index={
                          (currentPage - 1) *
                            TOPICS_PER_PAGE +
                          index
                        }
                      />
                    ),
                  )}
                </div>

                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {totalPages > 1 && (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Results */}

                      <p className="text-xs text-white/40">
                        Showing{" "}
                        <span className="font-bold text-white/70">
                          {paginationStart}
                        </span>{" "}
                        –{" "}
                        <span className="font-bold text-white/70">
                          {paginationEnd}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-white/70">
                          {
                            filteredDecks.length
                          }
                        </span>{" "}
                        topics
                      </p>

                      {/* Controls */}

                      <div className="flex items-center justify-between gap-2 sm:justify-end">
                        {/* Previous */}

                        <button
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              currentPage - 1,
                            )
                          }
                          disabled={
                            currentPage === 1
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />

                          <span className="hidden sm:inline">
                            Previous
                          </span>

                          <span className="sm:hidden">
                            Prev
                          </span>
                        </button>

                        {/* Page numbers */}

                        <div className="flex items-center gap-1">
                          {visiblePages.map(
                            (page, index) => {
                              if (
                                page ===
                                "ellipsis-start"
                              ) {
                                return (
                                  <span
                                    key={`ellipsis-start-${index}`}
                                    className="flex h-9 min-w-7 items-center justify-center text-xs text-white/30"
                                  >
                                    …
                                  </span>
                                );
                              }

                              if (
                                page ===
                                "ellipsis-end"
                              ) {
                                return (
                                  <span
                                    key={`ellipsis-end-${index}`}
                                    className="flex h-9 min-w-7 items-center justify-center text-xs text-white/30"
                                  >
                                    …
                                  </span>
                                );
                              }

                              const active =
                                page ===
                                currentPage;

                              return (
                                <button
                                  key={page}
                                  type="button"
                                  onClick={() =>
                                    handlePageChange(
                                      page,
                                    )
                                  }
                                  className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-bold transition ${
                                    active
                                      ? "bg-cyan-400 text-slate-950"
                                      : "border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
                                  }`}
                                  aria-label={`Go to page ${page}`}
                                  aria-current={
                                    active
                                      ? "page"
                                      : undefined
                                  }
                                >
                                  {page}
                                </button>
                              );
                            },
                          )}
                        </div>

                        {/* Next */}

                        <button
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              currentPage + 1,
                            )
                          }
                          disabled={
                            currentPage ===
                            totalPages
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <span className="hidden sm:inline">
                            Next
                          </span>

                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptySearch />
            )
          ) : (
            <ComingSoon
              subject={
                selectedSubjectData.name
              }
            />
          )}
        </section>

        {/* ====================================================
            STUDY TIP
        ==================================================== */}

        <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.035] to-cyan-400/[0.04] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <Flame className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold">
                Study consistently
              </h3>

              <p className="mt-1 text-sm leading-6 text-white/45">
                Short, repeated review
                sessions are more useful than
                trying to memorize everything at
                once. Mark difficult cards for
                review and return to them
                regularly.
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/50">
              <span className="font-bold text-white/80">
                Tip:
              </span>{" "}
              Review difficult cards first.
            </div>
          </div>
        </section>

        <div className="h-10" />
      </div>
    </main>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  label,
  value,
  iconClass,
  bgClass,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  iconClass: string;
  bgClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${bgClass} ${iconClass}`}
      >
        {icon}
      </div>

      <p className="text-2xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-white/40">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   TOPIC CARD
============================================================ */

function TopicCard({
  deck,
  index,
}: {
  deck: FlashcardDeck;
  index: number;
}) {
  const progress =
    getDeckProgress(deck);

  return (
    <Link
      href={`/student/flashcards/${deck.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-cyan-950/10"
    >
      {/* Number */}

      <div className="absolute right-4 top-4 text-xs font-black text-white/15">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Icon */}

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
        <BookOpen className="h-5 w-5" />
      </div>

      {/* Content */}

      <div className="pr-7">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-bold leading-6">
          {deck.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-white/40">
          {deck.description ??
            "Study this topic using focused flashcards."}
        </p>
      </div>

      {/* Card count */}

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Layers3 className="h-3.5 w-3.5" />

          <span>
            {deck.cards.length}{" "}
            {deck.cards.length === 1
              ? "card"
              : "cards"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-cyan-300">
          Study

          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Progress */}

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[10px]">
          <span className="text-white/30">
            Progress
          </span>

          <span className="font-bold text-white/50">
            {progress.percentage}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
            style={{
              width: `${progress.percentage}%`,
            }}
          />
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   COMING SOON
============================================================ */

function ComingSoon({
  subject,
}: {
  subject: string;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-3xl">
        📚
      </div>

      <h3 className="mt-5 text-xl font-black">
        {subject} Flashcards Coming Soon
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
        We are preparing focused{" "}
        {subject} flashcards to help you
        revise important concepts efficiently.
      </p>

      <button
        type="button"
        disabled
        className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/30"
      >
        Coming Soon
      </button>
    </div>
  );
}

/* ============================================================
   EMPTY SEARCH
============================================================ */

function EmptySearch() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
      <Search className="mx-auto h-8 w-8 text-white/20" />

      <h3 className="mt-4 font-bold">
        No topics found
      </h3>

      <p className="mt-1 text-sm text-white/35">
        Try another topic name or clear your
        search.
      </p>
    </div>
  );
}