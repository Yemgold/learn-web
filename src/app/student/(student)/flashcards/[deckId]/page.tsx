




"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Home,
  Layers3,
  Sparkles,
} from "lucide-react";

import FlashcardDeck from "@/components/flashcards/FlashcardDeck";

import {
  biologyFlashcardDecks,
} from "@/data/flashcards/biology";

import {
  chemistryFlashcardDecks,
} from "@/data/flashcards/chemistry";

import type { FlashcardDeck as FlashcardDeckType } from "@/types/flashcard";

/* ============================================================
   ALL FLASHCARD DECKS
   ============================================================ */

const allFlashcardDecks: FlashcardDeckType[] = [
  ...biologyFlashcardDecks,
  ...chemistryFlashcardDecks,
];

/* ============================================================
   PAGE
   ============================================================ */

export default function FlashcardDeckPage() {
  const params = useParams();
  const router = useRouter();

  const deckId = Array.isArray(params.deckId)
    ? params.deckId[0]
    : params.deckId;

  /* ==========================================================
     FIND DECK
     ========================================================== */

  const deck = useMemo(() => {
    if (!deckId) {
      return undefined;
    }

    return allFlashcardDecks.find(
      (item) => item.id === deckId,
    );
  }, [deckId]);

  /* ==========================================================
     INVALID DECK
     ========================================================== */

  if (!deck) {
    return (
      <main className="min-h-screen bg-[#070b14] text-white">
        <div className="relative mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/10">
              <BookOpen className="h-7 w-7 text-red-300" />
            </div>

            <h1 className="mt-5 text-2xl font-black">
              Flashcard Deck Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              The flashcard topic you are trying to access
              does not exist or is no longer available.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.09]"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>

              <Link
                href="/student/flashcards"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Browse Flashcards
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     DECK PAGE
     ========================================================== */

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* ======================================================
          BACKGROUND
          ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {/* ====================================================
            BREADCRUMB
            ==================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-1.5 overflow-x-auto text-xs text-white/35"
        >
          <Link
            href="/student"
            className="inline-flex shrink-0 items-center gap-1.5 transition hover:text-white/70"
          >
            <Home className="h-3.5 w-3.5" />
            Dashboard
          </Link>

          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20" />

          <Link
            href="/student/flashcards"
            className="shrink-0 transition hover:text-white/70"
          >
            Flashcards
          </Link>

          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20" />

          <span className="truncate text-white/60">
            {deck.title}
          </span>
        </nav>

        {/* ====================================================
            TOP HEADER
            ==================================================== */}

        <section className="mb-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-r from-cyan-400/[0.08] via-white/[0.025] to-violet-400/[0.06] p-5 shadow-xl shadow-black/20 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <Link
                href="/student/flashcards"
                aria-label="Back to flashcards"
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    <Sparkles className="h-3 w-3" />
                    {deck.subject}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-white/45">
                    <Layers3 className="h-3 w-3" />

                    {deck.cards.length}{" "}
                    {deck.cards.length === 1
                      ? "Card"
                      : "Cards"}
                  </span>
                </div>

                <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl">
                  {deck.title}
                </h1>

                {deck.description && (
                  <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/45">
                    {deck.description}
                  </p>
                )}
              </div>
            </div>

            <Link
              href="/student/flashcards"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              All Topics
            </Link>
          </div>
        </section>

        {/* ====================================================
            STUDY AREA
            ==================================================== */}

        <section>
          <FlashcardDeck
            deck={deck}
            persistProgress
            shuffleOnStart={false}
            showLearningActions
            onComplete={(progress) => {
              console.log(
                "Flashcard deck completed:",
                progress,
              );
            }}
          />
        </section>

        {/* ====================================================
            STUDY FOOTER
            ==================================================== */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-white/65">
                Keep going
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Mark cards as “I Know It” when you can recall
                the answer confidently. Use “Review Again” for
                concepts you need to revisit.
              </p>
            </div>

            <Link
              href="/student/flashcards"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-cyan-300 transition hover:text-cyan-200"
            >
              Explore more topics
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </main>
  );
}
