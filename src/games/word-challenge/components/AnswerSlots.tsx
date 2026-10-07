"use client";

import { RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

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

  const [pumpingIndex, setPumpingIndex] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  /*
   * Pump the newest letter whenever a letter is added.
   */
  useEffect(() => {
    if (answer.length === 0) {
      setPumpingIndex(null);
      setIsComplete(false);
      return;
    }

    const newIndex = answer.length - 1;

    setPumpingIndex(newIndex);

    const timer = window.setTimeout(() => {
      setPumpingIndex(null);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [answer.length]);

  /*
   * Give the entire answer area a stronger celebration
   * when all slots are filled.
   */
  useEffect(() => {
    if (answer.length === maxLength && maxLength > 0) {
      setIsComplete(true);

      const timer = window.setTimeout(() => {
        setIsComplete(false);
      }, 700);

      return () => {
        window.clearTimeout(timer);
      };
    }

    setIsComplete(false);
  }, [answer.length, maxLength]);

  return (
    <>
      <div
        className={[
          "w-full rounded-2xl border border-transparent",
          "transition-all duration-300",
          isComplete
            ? "answer-complete border-emerald-400/30 bg-emerald-400/[0.04] shadow-[0_0_35px_rgba(52,211,153,0.16)]"
            : "",
        ].join(" ")}
      >
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
            const isPumping = pumpingIndex === index;

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

                    isPumping
                      ? "answer-letter-pump border-violet-300/50 bg-violet-400/[0.14] shadow-[0_0_25px_rgba(139,92,246,0.3)]"
                      : "",

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
                className={[
                  "flex h-14 w-12 items-center justify-center rounded-xl",
                  "border border-dashed border-white/20 bg-white/[0.03]",
                  answer.length === index
                    ? "border-violet-400/30 bg-violet-400/[0.04]"
                    : "",
                ].join(" ")}
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

      <style jsx>{`
        @keyframes answerLetterPump {
          0% {
            transform: scale(1);
          }

          35% {
            transform: scale(1.12);
          }

          65% {
            transform: scale(0.96);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes answerComplete {
          0% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.025);
          }

          60% {
            transform: scale(0.99);
          }

          100% {
            transform: scale(1);
          }
        }

        .answer-letter-pump {
          animation: answerLetterPump 350ms ease-out;
        }

        .answer-complete {
          animation: answerComplete 700ms ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .answer-letter-pump,
          .answer-complete {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}