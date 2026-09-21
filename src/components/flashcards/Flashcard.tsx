



"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import type {
  Flashcard as FlashcardType,
  FlashcardDifficulty,
} from "@/types/flashcard";

interface FlashcardProps {
  card: FlashcardType;

  /**
   * Optional card number shown in the header.
   */
  cardNumber?: number;

  /**
   * Optional total number of cards.
   */
  totalCards?: number;

  /**
   * Whether the card should initially show its answer.
   */
  initialFlipped?: boolean;

  /**
   * Called when the student marks the card as known.
   */
  onKnow?: (card: FlashcardType) => void;

  /**
   * Called when the student wants to review the card again.
   */
  onReview?: (card: FlashcardType) => void;

  /**
   * Optional callback when the card is flipped.
   */
  onFlip?: (flipped: boolean) => void;

  /**
   * Whether action buttons should be displayed.
   */
  showActions?: boolean;

  /**
   * Whether to show the explanation.
   */
  showExplanation?: boolean;

  /**
   * Optional additional class names.
   */
  className?: string;
}

const difficultyConfig: Record<
  FlashcardDifficulty,
  {
    label: string;
    className: string;
  }
> = {
  easy: {
    label: "Easy",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  medium: {
    label: "Medium",
    className:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  hard: {
    label: "Hard",
    className:
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
  },
};

export default function Flashcard({
  card,
  cardNumber,
  totalCards,
  initialFlipped = false,
  onKnow,
  onReview,
  onFlip,
  showActions = true,
  showExplanation = true,
  className = "",
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(initialFlipped);

  const difficulty = card.difficulty
    ? difficultyConfig[card.difficulty]
    : null;

  const flipCard = () => {
    const nextState = !flipped;

    setFlipped(nextState);
    onFlip?.(nextState);
  };

  const handleKnow = () => {
    onKnow?.(card);
  };

  const handleReview = () => {
    onReview?.(card);
  };

  return (
    <div
      className={`w-full max-w-3xl mx-auto ${className}`}
      style={{ perspective: "1400px" }}
    >
      {/* ============================================================
          CARD
          ============================================================ */}

      <div
        className="relative min-h-[520px] w-full cursor-pointer select-none"
        onClick={flipCard}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            flipCard();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={
          flipped
            ? "Flashcard answer. Click to show the question."
            : "Flashcard question. Click to reveal the answer."
        }
      >
        <div
          className="relative h-full min-h-[520px] w-full transition-transform duration-500 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ========================================================
              FRONT
              ======================================================== */}

          <div
            className="absolute inset-0 flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#101522] shadow-2xl shadow-black/30"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Flashcard
                  </p>

                  {card.topic && (
                    <p className="mt-0.5 text-sm font-medium text-white/80">
                      {card.topic}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {difficulty && (
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficulty.className}`}
                  >
                    {difficulty.label}
                  </span>
                )}

                {cardNumber && totalCards && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/50">
                    {cardNumber} / {totalCards}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-1 flex-col items-center justify-center px-7 py-10 text-center sm:px-12">
              {card.image && (
                <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl">
                  <img
                    src={card.image}
                    alt={card.imageAlt || card.question}
                    className="max-h-52 w-auto max-w-full object-contain"
                  />
                </div>
              )}

              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary/80">
                Question
              </p>

              <h2 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                {card.question}
              </h2>

              <div className="mt-10 flex items-center gap-2 text-sm text-white/35">
                <RotateCcw className="h-4 w-4" />
                <span>Tap the card to reveal the answer</span>
              </div>
            </div>

            {/* Footer */}
            <div className="relative border-t border-white/10 px-6 py-4 text-center sm:px-8">
              <p className="text-xs text-white/30">
                Click or press Enter to flip
              </p>
            </div>
          </div>

          {/* ========================================================
              BACK
              ======================================================== */}

          <div
            className="absolute inset-0 flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-primary/20 bg-[#0d1720] shadow-2xl shadow-black/40"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Decorative background */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
                  Answer
                </p>

                <p className="mt-0.5 text-sm font-medium text-white/60">
                  {card.topic}
                </p>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  flipCard();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.08] hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Flip
              </button>
            </div>

            {/* Answer content */}
            <div className="relative flex-1 overflow-y-auto px-7 py-9 sm:px-12">
              {card.image && (
                <div className="mb-7 flex justify-center">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg">
                    <img
                      src={card.image}
                      alt={card.imageAlt || card.question}
                      className="max-h-44 w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-6 sm:p-7">
                  <p className="text-base font-semibold leading-7 text-white sm:text-lg sm:leading-8">
                    {card.answer}
                  </p>
                </div>

                {showExplanation && card.explanation && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ChevronDown className="h-4 w-4" />
                      </div>

                      <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
                        Explanation
                      </h3>
                    </div>

                    <p className="text-sm leading-7 text-white/55 sm:text-base">
                      {card.explanation}
                    </p>
                  </div>
                )}

                {card.tags && card.tags.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="relative border-t border-white/10 bg-black/10 p-5 sm:p-6">
                <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleReview();
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-5 py-3.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/15 active:scale-[0.98]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Review Again
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleKnow();
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-[0.98]"
                  >
                    <Check className="h-4 w-4" />
                    I Know It
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
