




// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\flashcards\FlashcardDeck.tsx

"use client";

import {
  Check,
  RotateCcw,
  Shuffle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import Flashcard from "./Flashcard";
import FlashcardControls from "./FlashcardControls";

import type {
  Flashcard as FlashcardType,
  FlashcardDeck as FlashcardDeckType,
  FlashcardDeckProgress,
  FlashcardProgress,
} from "@/types/flashcard";

interface FlashcardDeckProps {
  /**
   * The flashcard deck to display.
   */
  deck: FlashcardDeckType;

  /**
   * Whether student progress should be saved locally.
   *
   * Default: true
   */
  persistProgress?: boolean;

  /**
   * Whether cards should be shuffled when the deck starts.
   *
   * Default: false
   */
  shuffleOnStart?: boolean;

  /**
   * Whether the student should see
   * "Review Again" and "I Know It".
   *
   * Default: true
   */
  showLearningActions?: boolean;

  /**
   * Called when the student completes the deck.
   */
  onComplete?: (progress: FlashcardDeckProgress) => void;

  /**
   * Optional class name.
   */
  className?: string;
}

type ProgressMap = Record<string, FlashcardProgress>;

const createEmptyProgress = (
  cardId: string
): FlashcardProgress => ({
  cardId,
  views: 0,
  correctCount: 0,
  reviewCount: 0,
  mastered: false,
});

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [result[i], result[randomIndex]] = [
      result[randomIndex],
      result[i],
    ];
  }

  return result;
}

function createInitialCards(
  cards: FlashcardType[],
  shouldShuffle: boolean
): FlashcardType[] {
  return shouldShuffle ? shuffleArray(cards) : [...cards];
}

export default function FlashcardDeck({
  deck,
  persistProgress = true,
  shuffleOnStart = false,
  showLearningActions = true,
  onComplete,
  className = "",
}: FlashcardDeckProps) {
  const storageKey = `jamb-league-flashcards-progress:${deck.id}`;

  /* ================================================================
     CARD STATE
     ================================================================ */

  const [cards, setCards] = useState<FlashcardType[]>(() =>
    createInitialCards(deck.cards, shuffleOnStart)
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const [flipped, setFlipped] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [progress, setProgress] = useState<ProgressMap>({});

  const [hydrated, setHydrated] = useState(false);

  /* ================================================================
     RESET WHEN DECK CHANGES
     ================================================================ */

  useEffect(() => {
    setCards(createInitialCards(deck.cards, shuffleOnStart));
    setCurrentIndex(0);
    setFlipped(false);
    setCompleted(false);

    setProgress({});

    setHydrated(false);
  }, [deck.id, deck.cards, shuffleOnStart]);

  /* ================================================================
     LOAD SAVED PROGRESS
     ================================================================ */

  useEffect(() => {
    if (!persistProgress) {
      setHydrated(true);
      return;
    }

    try {
      const saved = window.localStorage.getItem(storageKey);

      if (!saved) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(saved);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        setProgress(parsed as ProgressMap);
      }
    } catch (error) {
      console.error(
        "Failed to load flashcard progress:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, [persistProgress, storageKey]);

  /* ================================================================
     SAVE PROGRESS
     ================================================================ */

  useEffect(() => {
    if (!persistProgress || !hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error(
        "Failed to save flashcard progress:",
        error
      );
    }
  }, [
    progress,
    persistProgress,
    hydrated,
    storageKey,
  ]);

  /* ================================================================
     CURRENT CARD
     ================================================================ */

  const currentCard = cards[currentIndex] ?? null;

  const canGoPrevious = currentIndex > 0;

  const canGoNext =
    currentIndex < cards.length - 1;

  /* ================================================================
     PROGRESS CALCULATIONS
     ================================================================ */

  const deckProgress = useMemo<FlashcardDeckProgress>(() => {
    const totalCards = cards.length;

    const cardProgress = cards.map((card) => {
      return (
        progress[card.id] ??
        createEmptyProgress(card.id)
      );
    });

    const masteredCards = cardProgress.filter(
      (item) => item.mastered
    ).length;

    const reviewCards = cardProgress.filter(
      (item) =>
        !item.mastered && item.reviewCount > 0
    ).length;

    const remainingCards =
      totalCards - masteredCards - reviewCards;

    const percentage =
      totalCards > 0
        ? Math.round(
            (masteredCards / totalCards) * 100
          )
        : 0;

    return {
      deckId: deck.id,
      totalCards,
      masteredCards,
      reviewCards,
      remainingCards: Math.max(
        remainingCards,
        0
      ),
      percentage,
      cards: cardProgress,
    };
  }, [cards, deck.id, progress]);

  /* ================================================================
     MARK CARD AS VIEWED
     ================================================================ */

  useEffect(() => {
    if (!currentCard || !hydrated) {
      return;
    }

    setProgress((previous) => {
      const existing =
        previous[currentCard.id] ??
        createEmptyProgress(currentCard.id);

      return {
        ...previous,
        [currentCard.id]: {
          ...existing,
          views: existing.views + 1,
        },
      };
    });
  }, [currentCard?.id, hydrated]);

  /* ================================================================
     COMPLETE SESSION
     ================================================================ */

  const completeSession = useCallback(() => {
    setCompleted(true);
    setFlipped(false);

    if (onComplete) {
      onComplete(deckProgress);
    }
  }, [deckProgress, onComplete]);

  /* ================================================================
     NAVIGATION
     ================================================================ */

  const goPrevious = useCallback(() => {
    if (!canGoPrevious) {
      return;
    }

    setCurrentIndex((previous) => previous - 1);
    setFlipped(false);
  }, [canGoPrevious]);

  const goNext = useCallback(() => {
    if (!canGoNext) {
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setFlipped(false);
  }, [canGoNext]);

  /* ================================================================
     FLIP
     ================================================================ */

  const flipCard = useCallback(() => {
    setFlipped((previous) => !previous);
  }, []);

  /* ================================================================
     UPDATE CARD PROGRESS
     ================================================================ */

  const updateCardProgress = useCallback(
    (
      card: FlashcardType,
      update: (
        existing: FlashcardProgress
      ) => FlashcardProgress
    ) => {
      setProgress((previous) => {
        const existing =
          previous[card.id] ??
          createEmptyProgress(card.id);

        return {
          ...previous,
          [card.id]: update(existing),
        };
      });
    },
    []
  );

  /* ================================================================
     I KNOW IT
     ================================================================ */

  const handleKnow = useCallback(() => {
    if (!currentCard) {
      return;
    }

    updateCardProgress(currentCard, (existing) => ({
      ...existing,
      correctCount:
        existing.correctCount + 1,
      mastered: true,
      lastReviewedAt: new Date().toISOString(),
    }));

    if (canGoNext) {
      setCurrentIndex((previous) => previous + 1);
      setFlipped(false);
      return;
    }

    setCompleted(true);
    setFlipped(false);
  }, [
    currentCard,
    canGoNext,
    updateCardProgress,
  ]);

  /* ================================================================
     REVIEW AGAIN
     ================================================================ */

  const handleReview = useCallback(() => {
    if (!currentCard) {
      return;
    }

    updateCardProgress(currentCard, (existing) => ({
      ...existing,
      reviewCount:
        existing.reviewCount + 1,
      mastered: false,
      lastReviewedAt: new Date().toISOString(),
    }));

    if (canGoNext) {
      setCurrentIndex((previous) => previous + 1);
      setFlipped(false);
      return;
    }

    setCompleted(true);
    setFlipped(false);
  }, [
    currentCard,
    canGoNext,
    updateCardProgress,
  ]);

  /* ================================================================
     SHUFFLE
     ================================================================ */

  const handleShuffle = useCallback(() => {
    setCards((previous) => shuffleArray(previous));
    setCurrentIndex(0);
    setFlipped(false);
    setCompleted(false);
  }, []);

  /* ================================================================
     RESTART
     ================================================================ */

  const handleRestart = useCallback(() => {
    setCards(
      createInitialCards(
        deck.cards,
        shuffleOnStart
      )
    );

    setCurrentIndex(0);
    setFlipped(false);
    setCompleted(false);

    setProgress({});

    if (persistProgress) {
      try {
        window.localStorage.removeItem(
          storageKey
        );
      } catch (error) {
        console.error(
          "Failed to clear flashcard progress:",
          error
        );
      }
    }
  }, [
    deck.cards,
    persistProgress,
    shuffleOnStart,
    storageKey,
  ]);

  /* ================================================================
     KEYBOARD SHORTCUTS
     ================================================================ */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (completed) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "BUTTON"
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (
        event.key === " " ||
        event.key === "Enter"
      ) {
        event.preventDefault();
        flipCard();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    completed,
    goPrevious,
    goNext,
    flipCard,
  ]);

  /* ================================================================
     EMPTY DECK
     ================================================================ */

  if (cards.length === 0) {
    return (
      <section
        className={`mx-auto w-full max-w-3xl ${className}`}
      >
        <div className="rounded-[2rem] border border-white/10 bg-[#101522] p-10 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Sparkles className="h-7 w-7 text-white/30" />
          </div>

          <h2 className="mt-6 text-xl font-bold text-white">
            No flashcards available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
            There are currently no flashcards
            available in this topic.
          </p>
        </div>
      </section>
    );
  }

  /* ================================================================
     COMPLETED STATE
     ================================================================ */

  if (completed) {
    return (
      <section
        className={`mx-auto w-full max-w-3xl ${className}`}
      >
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101522] shadow-2xl shadow-black/30">
          {/* Header */}
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Trophy className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                  Session Complete
                </p>

                <h2 className="mt-0.5 text-lg font-bold text-white">
                  {deck.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="px-6 py-10 sm:px-10">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <Check className="h-9 w-9 text-primary" />
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Well done!
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/45 sm:text-base">
                You have completed this
                flashcard session. Review your
                progress below.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
                  <p className="text-2xl font-bold text-emerald-300">
                    {deckProgress.masteredCards}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Known
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
                  <p className="text-2xl font-bold text-amber-300">
                    {deckProgress.reviewCards}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Review
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-4">
                  <p className="text-2xl font-bold text-primary">
                    {deckProgress.percentage}%
                  </p>

                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Mastery
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-8 text-left">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-white/40">
                    Mastery Progress
                  </span>

                  <span className="font-bold text-white/60">
                    {deckProgress.masteredCards} /{" "}
                    {deckProgress.totalCards}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${deckProgress.percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart Deck
                </button>

                <button
                  type="button"
                  onClick={handleShuffle}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Shuffle className="h-4 w-4" />
                  Study Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ================================================================
     MAIN DECK
     ================================================================ */

  return (
    <section
      className={`mx-auto w-full max-w-4xl ${className}`}
    >
      {/* ============================================================
          DECK HEADER
          ============================================================ */}

      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                {deck.subject}
              </span>

              <span className="text-xs text-white/25">
                •
              </span>

              <span className="text-xs font-medium text-white/40">
                {deck.topic}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {deck.title}
            </h1>

            {deck.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                {deck.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </button>
        </div>
      </div>

      {/* ============================================================
          PROGRESS
          ============================================================ */}

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
              Learning Progress
            </p>

            <p className="mt-1 text-sm font-semibold text-white/75">
              Card {currentIndex + 1} of{" "}
              {cards.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {deckProgress.percentage}%
            </p>

            <p className="text-[11px] text-white/30">
              mastered
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${Math.max(
                ((currentIndex + 1) /
                  cards.length) *
                  100,
                4
              )}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1 text-[11px] font-semibold text-emerald-300/80">
            ✓ {deckProgress.masteredCards} known
          </span>

          <span className="rounded-full border border-amber-400/10 bg-amber-400/[0.05] px-3 py-1 text-[11px] font-semibold text-amber-300/80">
            ↻ {deckProgress.reviewCards} review
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-white/35">
            {deckProgress.remainingCards} remaining
          </span>
        </div>
      </div>

      {/* ============================================================
          FLASHCARD
          ============================================================ */}

      <div className="mb-6">
        <Flashcard
          key={`${currentCard.id}-${flipped}`}
          card={currentCard}
          cardNumber={currentIndex + 1}
          totalCards={cards.length}
          initialFlipped={flipped}
          onFlip={setFlipped}
          showActions={false}
        />
      </div>

      {/* ============================================================
          CONTROLS
          ============================================================ */}

      <FlashcardControls
        flipped={flipped}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={goPrevious}
        onNext={goNext}
        onFlip={flipCard}
        onKnow={handleKnow}
        onReview={handleReview}
        showLearningActions={
          showLearningActions
        }
      />

      {/* ============================================================
          FOOTER
          ============================================================ */}

      <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-white/25">
        <Sparkles className="h-3.5 w-3.5" />

        <span>
          Your learning progress is saved
          automatically on this device.
        </span>
      </div>
    </section>
  );
}
