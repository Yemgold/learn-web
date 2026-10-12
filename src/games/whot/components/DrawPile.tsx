




"use client";

import { memo } from "react";
import { Layers3, MousePointerClick, PackageOpen, Sparkles } from "lucide-react";

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
      className={`rounded-2xl border border-white/10 bg-slate-950/40 p-3 sm:p-4 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <Layers3 size={18} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEmpty ? "No cards left" : "Pick a card"}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-white/10 bg-slate-900 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
          {safeCount}
        </span>
      </div>

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
        className={`group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 ${
          compact ? "min-h-[124px] p-3" : "min-h-[158px] p-4"
        } ${
          canDraw
            ? "border-cyan-400/40 bg-gradient-to-b from-cyan-950/70 to-slate-950 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.12)] active:translate-y-0"
            : isEmpty
              ? "cursor-not-allowed border-dashed border-white/10 bg-slate-900/40"
              : "cursor-not-allowed border-white/10 bg-slate-900/60 opacity-70"
        }`}
      >
        {isEmpty ? (
          <>
            <PackageOpen
              size={compact ? 26 : 32}
              className="mb-2 text-slate-500"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-slate-400">
              Pile Empty
            </span>
            <span className="mt-1 text-center text-[11px] text-slate-500">
              No cards available to draw
            </span>
          </>
        ) : (
          <>
            <div
              className={`relative mb-3 flex items-center justify-center ${
                compact ? "h-[56px] w-[42px]" : "h-[70px] w-[52px]"
              }`}
              aria-hidden="true"
            >
              <div className="absolute left-2 top-2 h-full w-full rotate-[10deg] rounded-lg border border-indigo-300/30 bg-indigo-950" />

              <div className="absolute left-1 top-1 h-full w-full -rotate-[6deg] rounded-lg border border-cyan-300/30 bg-slate-900" />

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-cyan-300/60 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 shadow-lg transition-transform duration-200 group-hover:scale-105">
                <div className="absolute inset-[4px] rounded-md border border-cyan-300/30" />

                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/10">
                  <span className="text-sm font-black text-cyan-200">
                    W
                  </span>
                </div>
              </div>
            </div>

            <span className="text-sm font-bold text-white">
              {isDrawing ? "Drawing..." : "Draw a Card"}
            </span>

            <span className="mt-1 text-center text-[11px] text-slate-400">
              {isDrawing
                ? "Please wait"
                : canDraw
                  ? "Click to draw one card"
                  : isPlayerTurn
                    ? "Drawing unavailable"
                    : "Wait for your turn"}
            </span>
          </>
        )}
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        {canDraw ? (
          <>
            <MousePointerClick
              size={13}
              className="text-cyan-300"
              aria-hidden="true"
            />
            <span>Your turn to draw</span>
          </>
        ) : isEmpty ? (
          <>
            <PackageOpen size={13} aria-hidden="true" />
            <span>Deck exhausted</span>
          </>
        ) : isDrawing ? (
          <span role="status" aria-live="polite">
            Drawing your card…
          </span>
        ) : (
          <>
            <Sparkles size={13} aria-hidden="true" />
            <span>Cards remaining: {safeCount}</span>
          </>
        )}
      </div>
    </section>
  );
}

export default memo(DrawPile);
