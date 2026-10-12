




"use client";

import { memo } from "react";
import { Bot, Layers3 } from "lucide-react";

export interface BotHandProps {
  /** Number of cards currently held by the bot. */
  cardCount: number;

  /** Optional bot display name. */
  botName?: string;

  /** Highlight the bot while it is taking its turn. */
  isActive?: boolean;

  /** Optional compact layout for smaller screens. */
  compact?: boolean;

  /** Optional additional CSS classes. */
  className?: string;
}

function BotHand({
  cardCount,
  botName = "Learnyfi Bot",
  isActive = false,
  compact = false,
  className = "",
}: BotHandProps) {
  const safeCount = Math.max(
    0,
    Math.floor(Number.isFinite(cardCount) ? cardCount : 0),
  );

  const visibleCards = Math.min(safeCount, compact ? 5 : 7);

  return (
    <section
      aria-label={`${botName} hand`}
      className={`w-full rounded-2xl border p-3 transition-colors duration-300 sm:p-4 ${
        isActive
          ? "border-amber-400/60 bg-amber-400/[0.07] shadow-[0_0_24px_rgba(251,191,36,0.10)]"
          : "border-white/10 bg-slate-950/30"
      } ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              isActive
                ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                : "border-white/10 bg-slate-800 text-slate-300"
            }`}
          >
            <Bot size={21} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">
              {botName}
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {isActive ? "Thinking..." : "Computer opponent"}
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-slate-900 px-2.5 py-1.5"
          aria-label={`${safeCount} cards remaining`}
        >
          <Layers3
            size={14}
            className="text-cyan-300"
            aria-hidden="true"
          />
          <span className="text-xs font-bold tabular-nums text-white">
            {safeCount}
          </span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            cards
          </span>
        </div>
      </div>

      {safeCount === 0 ? (
        <div className="flex min-h-20 items-center justify-center rounded-xl border border-dashed border-amber-400/30 bg-amber-400/[0.04] px-4 text-center">
          <p className="text-sm font-semibold text-amber-300">
            No cards remaining
          </p>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center overflow-hidden ${
            compact ? "min-h-[84px]" : "min-h-[104px]"
          }`}
        >
          <div
            className="flex items-center justify-center"
            aria-hidden="true"
          >
            {Array.from({ length: visibleCards }, (_, index) => {
              const middle = (visibleCards - 1) / 2;
              const offset = index - middle;
              const rotation = offset * (compact ? 4 : 5);
              const verticalOffset = Math.abs(offset) * (compact ? 2 : 3);

              return (
                <div
                  key={index}
                  className={`relative shrink-0 overflow-hidden rounded-lg border border-cyan-300/40 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 shadow-lg ${
                    compact
                      ? "h-[70px] w-[44px]"
                      : "h-[88px] w-[58px]"
                  }`}
                  style={{
                    transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
                    marginLeft: index === 0 ? 0 : compact ? -17 : -21,
                    zIndex: index,
                  }}
                >
                  <div className="absolute inset-[4px] rounded-md border border-cyan-300/25" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10">
                      <span className="text-sm font-black tracking-tight text-cyan-200">
                        W
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-2 flex justify-center">
                    <span className="text-[7px] font-bold tracking-[0.18em] text-cyan-100/70">
                      LEARNYFI
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {safeCount > visibleCards && (
        <p className="mt-1 text-center text-[11px] text-slate-500">
          +{safeCount - visibleCards} more{" "}
          {safeCount - visibleCards === 1 ? "card" : "cards"}
        </p>
      )}

      {isActive && (
        <div
          className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-amber-300"
          role="status"
          aria-live="polite"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
          Bot is taking its turn
        </div>
      )}
    </section>
  );
}

export default memo(BotHand);
