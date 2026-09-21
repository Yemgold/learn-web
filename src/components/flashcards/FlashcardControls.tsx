



// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\flashcards\FlashcardControls.tsx

"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
} from "lucide-react";

interface FlashcardControlsProps {
  /**
   * Whether the current card is showing the answer.
   */
  flipped: boolean;

  /**
   * Whether there is a previous card available.
   */
  canGoPrevious: boolean;

  /**
   * Whether there is a next card available.
   */
  canGoNext: boolean;

  /**
   * Move to the previous card.
   */
  onPrevious: () => void;

  /**
   * Move to the next card.
   */
  onNext: () => void;

  /**
   * Flip the current card.
   */
  onFlip: () => void;

  /**
   * Mark the current card as known.
   */
  onKnow?: () => void;

  /**
   * Mark the current card for review.
   */
  onReview?: () => void;

  /**
   * Whether to display learning actions.
   */
  showLearningActions?: boolean;

  /**
   * Whether the controls should be disabled.
   */
  disabled?: boolean;

  /**
   * Optional additional class names.
   */
  className?: string;
}

export default function FlashcardControls({
  flipped,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onFlip,
  onKnow,
  onReview,
  showLearningActions = true,
  disabled = false,
  className = "",
}: FlashcardControlsProps) {
  const buttonBase =
    "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      className={`w-full ${className}`}
      aria-label="Flashcard controls"
    >
      {/* ============================================================
          PRIMARY NAVIGATION
          ============================================================ */}

      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 sm:gap-3">
        {/* Previous */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious || disabled}
          aria-label="Previous flashcard"
          className={`${buttonBase} h-12 w-12 border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:w-auto sm:px-5`}
        >
          <ChevronLeft className="h-5 w-5" />

          <span className="hidden sm:inline">
            Previous
          </span>
        </button>

        {/* Flip */}
        <button
          type="button"
          onClick={onFlip}
          disabled={disabled}
          aria-label={flipped ? "Show question" : "Show answer"}
          className={`${buttonBase} h-12 flex-1 border-primary/20 bg-primary/10 px-5 text-primary hover:border-primary/30 hover:bg-primary/15 sm:flex-none sm:min-w-[150px]`}
        >
          {flipped ? (
            <>
              <RotateCcw className="h-4 w-4" />
              <span>Show Question</span>
            </>
          ) : (
            <>
              <RotateCw className="h-4 w-4" />
              <span>Show Answer</span>
            </>
          )}
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext || disabled}
          aria-label="Next flashcard"
          className={`${buttonBase} h-12 w-12 border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:w-auto sm:px-5`}
        >
          <span className="hidden sm:inline">
            Next
          </span>

          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* ============================================================
          LEARNING ACTIONS
          ============================================================ */}

      {showLearningActions && flipped && (
        <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-3">
          {/* Review */}
          <button
            type="button"
            onClick={onReview}
            disabled={disabled || !onReview}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 text-sm font-semibold text-amber-300 transition-all duration-200 hover:border-amber-400/30 hover:bg-amber-400/15 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />

            <span>
              Review Again
            </span>
          </button>

          {/* Know */}
          <button
            type="button"
            onClick={onKnow}
            disabled={disabled || !onKnow}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          >
            <Check className="h-4 w-4" />

            <span>
              I Know It
            </span>
          </button>
        </div>
      )}

      {/* ============================================================
          KEYBOARD HINT
          ============================================================ */}

      <div className="mt-4 hidden items-center justify-center gap-4 text-[11px] text-white/25 sm:flex">
        <span>
          ← Previous
        </span>

        <span>
          Space / Enter · Flip
        </span>

        <span>
          → Next
        </span>
      </div>
    </div>
  );
}
