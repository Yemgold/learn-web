






"use client";

import { Delete, Keyboard } from "lucide-react";

interface LetterBoardProps {
  letters: string[];
  selectedLetters: string[];
  maxLength: number;
  onSelectLetter: (letter: string, index: number) => void;
  onRemoveLast?: () => void;
  disabled?: boolean;
}

export default function LetterBoard({
  letters,
  selectedLetters,
  maxLength,
  onSelectLetter,
  onRemoveLast,
  disabled = false,
}: LetterBoardProps) {
  const canSelectMore = selectedLetters.length < maxLength;

  /**
   * We track usage by index rather than by letter.
   *
   * This is important when the board contains duplicate letters:
   *
   * Example:
   * L I O N N X
   *
   * The player must be able to select either N independently.
   */
  const selectedIndexes = new Set<number>();

  selectedLetters.forEach((selectedLetter, selectedPosition) => {
    const matchingIndex = letters.findIndex(
      (letter, index) =>
        letter.toUpperCase() === selectedLetter.toUpperCase() &&
        !selectedIndexes.has(index),
    );

    if (matchingIndex !== -1) {
      selectedIndexes.add(matchingIndex);
    }
  });

  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/60">
            <Keyboard className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-bold text-white/80">
              Build the word
            </p>

            <p className="text-[11px] text-white/35">
              Choose the letters in the correct order
            </p>
          </div>
        </div>

        {onRemoveLast && selectedLetters.length > 0 && !disabled && (
          <button
            type="button"
            onClick={onRemoveLast}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            aria-label="Remove last letter"
          >
            <Delete className="h-3.5 w-3.5" />
            Undo
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {letters.map((letter, index) => {
            const isSelected = selectedIndexes.has(index);

            const isDisabled =
              disabled || isSelected || !canSelectMore;

            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                onClick={() => {
                  if (!isDisabled) {
                    onSelectLetter(letter, index);
                  }
                }}
                disabled={isDisabled}
                aria-label={`Choose letter ${letter.toUpperCase()}`}
                aria-pressed={isSelected}
                className={[
                  "relative flex h-14 w-14 items-center justify-center",
                  "rounded-2xl border text-lg font-black uppercase",
                  "transition-all duration-200",
                  "sm:h-16 sm:w-16 sm:text-xl",
                  isSelected
                    ? "cursor-not-allowed border-violet-400/20 bg-violet-400/[0.08] text-white/20"
                    : disabled
                      ? "cursor-not-allowed border-white/10 bg-white/[0.025] text-white/25"
                      : !canSelectMore
                        ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30"
                        : "cursor-pointer border-white/10 bg-white/[0.07] text-white shadow-lg shadow-black/10 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-400/[0.10] hover:text-violet-100 hover:shadow-violet-500/10 active:translate-y-0 active:scale-95",
                ].join(" ")}
              >
                {letter.toUpperCase()}

                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center">
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[11px] font-medium text-white/35">
            {selectedLetters.length} / {maxLength} letters
          </span>
        </div>
      </div>
    </section>
  );
}
