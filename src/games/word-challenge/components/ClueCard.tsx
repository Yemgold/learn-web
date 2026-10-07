



"use client";

import { Lightbulb, Sparkles } from "lucide-react";

interface ClueCardProps {
  clue: string;
  visible?: boolean;
  reducedPoints?: number;
  pumping?: boolean;
}

export default function ClueCard({
  clue,
  visible = true,
  reducedPoints,
  pumping = false,
}: ClueCardProps) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className={[
          "relative w-full overflow-hidden rounded-2xl border",
          "border-amber-400/20 bg-amber-400/[0.06]",
          "shadow-lg shadow-amber-500/5",
          "transition-all duration-300",
          pumping
            ? "clue-pump border-amber-300/60 shadow-[0_0_45px_rgba(251,191,36,0.35)]"
            : "scale-100",
        ].join(" ")}
      >
        {/* Animated glow */}
        {pumping && (
          <div className="pointer-events-none absolute inset-0 animate-pulse bg-amber-300/[0.08]" />
        )}

        {/* Sparkles */}
        {pumping && (
          <>
            <Sparkles className="pointer-events-none absolute right-5 top-4 h-5 w-5 animate-bounce text-amber-300/70" />
            <Sparkles className="pointer-events-none absolute bottom-5 right-16 h-3 w-3 animate-pulse text-yellow-200/50" />
          </>
        )}

        <div className="relative flex items-start gap-3 p-4 sm:p-5">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              "bg-amber-400/15 text-amber-300",
              pumping
                ? "animate-bounce bg-amber-300/25 shadow-[0_0_25px_rgba(251,191,36,0.4)]"
                : "",
            ].join(" ")}
          >
            <Lightbulb className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p
                className={[
                  "text-sm font-extrabold tracking-wide text-amber-300",
                  pumping ? "animate-pulse" : "",
                ].join(" ")}
              >
                💡 YOU NEED A CLUE
              </p>

              {typeof reducedPoints === "number" && (
                <span
                  className={[
                    "rounded-full bg-white/[0.06] px-2 py-0.5",
                    "text-xs font-medium text-white/50",
                    pumping ? "bg-amber-300/15 text-amber-200" : "",
                  ].join(" ")}
                >
                  Reward: {reducedPoints} pts
                </span>
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">
              {clue}
            </p>
          </div>
        </div>

        <div className="relative h-px bg-amber-400/10" />

        <div className="relative px-4 py-2.5 sm:px-5">
          <p className="text-center text-[11px] font-medium uppercase tracking-wider text-white/35">
            Your reward has been reduced — solve it to win the points shown
            above
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes cluePump {
          0% {
            transform: scale(1);
          }

          20% {
            transform: scale(1.06);
          }

          40% {
            transform: scale(0.98);
          }

          60% {
            transform: scale(1.04);
          }

          80% {
            transform: scale(0.995);
          }

          100% {
            transform: scale(1);
          }
        }

        .clue-pump {
          animation: cluePump 1.2s ease-in-out;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .clue-pump {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}