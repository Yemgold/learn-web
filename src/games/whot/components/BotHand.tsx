




"use client";

import { memo } from "react";
import { Bot, Layers3, Sparkles } from "lucide-react";

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
      className={`w-full min-w-0 overflow-hidden rounded-2xl border p-2.5 transition-all duration-300 sm:p-4 ${
        isActive
          ? "border-amber-400/60 bg-gradient-to-br from-amber-500/[0.09] to-violet-500/[0.06] shadow-[0_0_22px_rgba(251,191,36,0.09)]"
          : "border-violet-400/20 bg-slate-950/50"
      } ${className}`}
    >
      <div className="mb-2 flex min-w-0 items-center justify-between gap-2 sm:mb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              isActive
                ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                : "border-violet-400/30 bg-violet-500/10 text-violet-300"
            }`}
          >
            <Bot size={21} aria-hidden="true" />
            {isActive && (
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-slate-950 bg-amber-300" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <h3 className="max-w-full truncate text-sm font-extrabold text-white">
                {botName}
              </h3>
              <span className="rounded-md border border-violet-400/30 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-violet-200">
                Bot
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
              {isActive ? "Thinking about its move…" : "Computer opponent"}
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-violet-400/20 bg-slate-900/90 px-2.5 py-2"
          aria-label={`${safeCount} cards remaining`}
        >
          <Layers3
            size={15}
            className="text-violet-300"
            aria-hidden="true"
          />
          <span className="text-sm font-extrabold tabular-nums text-white">
            {safeCount}
          </span>
          <span className="hidden text-[11px] text-slate-400 min-[400px]:inline">
            cards
          </span>
        </div>
      </div>

      {safeCount === 0 ? (
        <div className="flex min-h-16 items-center justify-center rounded-xl border border-dashed border-amber-400/30 bg-amber-400/[0.05] px-4 py-3 text-center">
          <div>
            <Sparkles
              size={20}
              className="mx-auto mb-1 text-amber-300"
              aria-hidden="true"
            />
            <p className="text-xs font-bold text-amber-200 sm:text-sm">
              No cards remaining
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`flex min-w-0 items-center justify-center overflow-hidden ${
            compact ? "min-h-[76px]" : "min-h-[92px] sm:min-h-[104px]"
          }`}
        >
          <div
            className="flex items-center justify-center px-1"
            aria-hidden="true"
          >
            {Array.from({ length: visibleCards }, (_, index) => {
              const middle = (visibleCards - 1) / 2;
              const offset = index - middle;
              const rotation = offset * (compact ? 3 : 4);
              const verticalOffset = Math.abs(offset) * (compact ? 1.5 : 2.5);

              return (
                <div
                  key={index}
                  className={`relative shrink-0 overflow-hidden rounded-lg border shadow-lg ${
                    isActive
                      ? "border-amber-300/50 bg-gradient-to-br from-violet-950 via-slate-900 to-amber-950"
                      : "border-violet-400/40 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950"
                  } ${
                    compact
                      ? "h-[62px] w-[41px] min-[400px]:h-[68px] min-[400px]:w-[45px]"
                      : "h-[72px] w-[48px] sm:h-[86px] sm:w-[57px]"
                  }`}
                  style={{
                    transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
                    marginLeft:
                      index === 0 ? 0 : compact ? -14 : -17,
                    zIndex: index,
                  }}
                >
                  <div
                    className={`absolute inset-[3px] rounded-md border ${
                      isActive
                        ? "border-amber-300/30"
                        : "border-violet-300/25"
                    }`}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border sm:h-8 sm:w-8 ${
                        isActive
                          ? "border-amber-300/50 bg-amber-300/10"
                          : "border-violet-300/40 bg-violet-300/10"
                      }`}
                    >
                      <span
                        className={`text-sm font-black tracking-tight ${
                          isActive ? "text-amber-200" : "text-violet-200"
                        }`}
                      >
                        W
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-1.5 flex justify-center">
                    <span
                      className={`text-[6px] font-bold tracking-[0.12em] ${
                        isActive ? "text-amber-100/70" : "text-violet-100/70"
                      }`}
                    >
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
        <p className="mt-1 text-center text-[10px] text-slate-500 sm:text-[11px]">
          +{safeCount - visibleCards} more{" "}
          {safeCount - visibleCards === 1 ? "card" : "cards"}
        </p>
      )}

      {isActive && safeCount > 0 && (
        <div
          className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-2 py-1.5 text-[11px] font-semibold text-amber-200 sm:text-xs"
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
