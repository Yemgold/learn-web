


"use client";

import { RotateCcw, X } from "lucide-react";

interface AnswerSlotsProps {
  answer: string[];
  maxLength: number;
  onRemoveLetter: (index: number) => void;
  onClear?: () => void;
  disabled?: boolean;
}

export default function AnswerSlots({
  answer,
  maxLength,
  onRemoveLetter,
  onClear,
  disabled = false,
}: AnswerSlotsProps) {
  const slots = Array.from({ length: maxLength });

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-white/60">
          Your answer
        </p>

        {answer.length > 0 && onClear && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 transition hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="flex min-h-[64px] flex-wrap items-center justify-center gap-2 sm:gap-3">
        {slots.map((_, index) => {
          const letter = answer[index];

          if (letter) {
            return (
              <button
                key={`answer-${index}`}
                type="button"
                onClick={() => onRemoveLetter(index)}
                disabled={disabled}
                aria-label={`Remove letter ${letter}`}
                className={[
                  "group relative flex h-14 w-12 items-center justify-center",
                  "rounded-xl border border-white/20",
                  "bg-white/[0.08] text-xl font-bold text-white",
                  "shadow-lg backdrop-blur-sm",
                  "transition-all duration-200",
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.14]",
                ].join(" ")}
              >
                {letter.toUpperCase()}

                {!disabled && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 scale-0 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                    <X className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          }

          return (
            <div
              key={`empty-${index}`}
              aria-hidden="true"
              className="flex h-14 w-12 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.03]"
            >
              <span className="h-1 w-5 rounded-full bg-white/10" />
            </div>
          );
        })}
      </div>

      {answer.length > 0 && (
        <p className="mt-3 text-center text-xs text-white/40">
          Tap a letter to remove it
        </p>
      )}
    </div>
  );
}
