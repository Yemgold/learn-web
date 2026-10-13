






"use client";

import { memo } from "react";
import {
  Layers3,
  MousePointerClick,
  PackageOpen,
  Sparkles,
} from "lucide-react";

export interface DrawPileProps {
  cardCount: number;
  onDraw?: () => void;
  disabled?: boolean;
  isDrawing?: boolean;
  isPlayerTurn?: boolean;
  compact?: boolean;
  title?: string;
  className?: string;
}

function DrawPile({
  cardCount,
  onDraw,
  disabled = false,
  isDrawing = false,
  isPlayerTurn = false,
  compact = false,
  title = "Draw Pile",
  className = "",
}: DrawPileProps) {
  const safeCount = Math.max(
    0,
    Math.floor(Number.isFinite(cardCount) ? cardCount : 0),
  );

  const isEmpty = safeCount === 0;

  const canDraw =
    !disabled &&
    !isDrawing &&
    !isEmpty &&
    isPlayerTurn &&
    typeof onDraw === "function";

  return (
    <section
      aria-label={title}
      className={`mx-auto w-full min-w-0 max-w-[112px] sm:max-w-[144px] ${
        compact ? "sm:max-w-[120px]" : ""
      } ${className}`}
    >
      {/* Compact heading */}
      <div className="mb-2 flex flex-col items-center gap-1 text-center">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 sm:text-xs">
          <Layers3
            size={13}
            className="shrink-0 text-cyan-300"
            aria-hidden="true"
          />
          <span className="truncate">{title}</span>
        </span>

        <span className="rounded-full border border-white/10 bg-slate-900 px-2.5 py-0.5 text-[10px] font-black tabular-nums text-white sm:text-xs">
          {safeCount} cards
        </span>
      </div>

      {/* Card stack / draw target */}
      <button
        type="button"
        onClick={onDraw}
        disabled={!canDraw}
        aria-label={
          isEmpty
            ? "Draw pile is empty"
            : isDrawing
              ? "Drawing a card"
              : "Draw one card from the pile"
        }
        className={`group relative flex min-h-[112px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border p-2 transition duration-200 sm:min-h-[144px] sm:rounded-2xl sm:p-3 ${
          canDraw
            ? "cursor-pointer border-cyan-400/40 bg-cyan-950/30 hover:border-cyan-300 hover:bg-cyan-950/50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            : isEmpty
              ? "cursor-not-allowed border-dashed border-white/10 bg-slate-900/40"
              : "cursor-not-allowed border-white/10 bg-slate-900/50 opacity-75"
        }`}
      >
        {isEmpty ? (
          <>
            <PackageOpen
              size={24}
              className="mb-2 text-slate-500"
              aria-hidden="true"
            />
            <span className="text-xs font-bold text-slate-400">
              Empty
            </span>
          </>
        ) : (
          <>
            <div
              className="relative mb-2 flex h-[58px] w-[43px] items-center justify-center sm:h-[72px] sm:w-[53px]"
              aria-hidden="true"
            >
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[10deg] rounded-lg border border-indigo-300/30 bg-indigo-950" />

              <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 -rotate-[6deg] rounded-lg border border-cyan-300/30 bg-slate-900" />

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-cyan-300/60 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 shadow-lg transition-transform duration-200 group-hover:scale-105">
                <div className="absolute inset-1 rounded-md border border-cyan-300/30" />

                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/10 sm:h-8 sm:w-8">
                  <span className="text-sm font-black text-cyan-200">
                    W
                  </span>
                </div>
              </div>
            </div>

            <span className="text-xs font-extrabold text-white sm:text-sm">
              {isDrawing ? "Drawing…" : "Draw Card"}
            </span>

            <span className="mt-1 text-center text-[10px] leading-4 text-slate-400">
              {isDrawing
                ? "Please wait"
                : canDraw
                  ? "Tap to draw"
                  : isPlayerTurn
                    ? "Unavailable"
                    : "Bot's turn"}
            </span>
          </>
        )}
      </button>

      {/* One short status line */}
      <div
        className={`mt-2 flex min-h-5 items-center justify-center gap-1 text-center text-[10px] leading-4 ${
          canDraw ? "text-cyan-200" : "text-slate-500"
        }`}
        role={isDrawing ? "status" : undefined}
        aria-live={isDrawing ? "polite" : undefined}
      >
        {canDraw ? (
          <>
            <MousePointerClick
              size={12}
              className="shrink-0"
              aria-hidden="true"
            />
            <span>Your turn</span>
          </>
        ) : isEmpty ? (
          <>
            <PackageOpen
              size={12}
              className="shrink-0"
              aria-hidden="true"
            />
            <span>No cards left</span>
          </>
        ) : isDrawing ? (
          <span>Drawing card…</span>
        ) : (
          <>
            <Sparkles
              size={12}
              className="shrink-0"
              aria-hidden="true"
            />
            <span>Waiting</span>
          </>
        )}
      </div>
    </section>
  );
}

export default memo(DrawPile);
