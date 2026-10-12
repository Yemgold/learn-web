




"use client";

import { memo } from "react";
import { Layers3, MousePointerClick, Sparkles, UserRound } from "lucide-react";

import type { WhotCard } from "../types/whot";

export interface PlayerHandProps {
  cards: WhotCard[];
  playableCardIds?: string[];
  selectedCardInstanceId?: string | null;
  onSelectCard?: (instanceId: string) => void;
  isPlayerTurn?: boolean;
  disabled?: boolean;
  playerName?: string;
  compact?: boolean;
  className?: string;
}

const SUBJECT_STYLES: Record<string, string> = {
  MATHS: "border-blue-400/40 bg-blue-500/15 text-blue-200",
  ENGLISH: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200",
  BIOLOGY: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  CHEMISTRY: "border-orange-400/40 bg-orange-500/15 text-orange-200",
  PHYSICS: "border-cyan-400/40 bg-cyan-500/15 text-cyan-200",
  HISTORY: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  GENERAL: "border-violet-400/40 bg-violet-500/15 text-violet-200",
};

const SUBJECT_LABELS: Record<string, string> = {
  MATHS: "Mathematics",
  ENGLISH: "English",
  BIOLOGY: "Biology",
  CHEMISTRY: "Chemistry",
  PHYSICS: "Physics",
  HISTORY: "History",
  GENERAL: "General Knowledge",
};

function PlayerHand({
  cards,
  playableCardIds = [],
  selectedCardInstanceId = null,
  onSelectCard,
  isPlayerTurn = false,
  disabled = false,
  playerName = "You",
  compact = false,
  className = "",
}: PlayerHandProps) {
  const canInteract = isPlayerTurn && !disabled;
  const playableIds = new Set(playableCardIds);

  return (
    <section
      aria-label={`${playerName}'s hand`}
      className={`w-full rounded-2xl border p-3 transition-colors duration-300 sm:p-4 ${
        canInteract
          ? "border-cyan-400/30 bg-cyan-400/[0.04]"
          : "border-white/10 bg-slate-950/30"
      } ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              canInteract
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 bg-slate-800 text-slate-300"
            }`}
          >
            <UserRound size={20} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">
              {playerName}
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              {canInteract
                ? "Your turn — choose a playable card"
                : "Your cards"}
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-slate-900 px-2.5 py-1.5"
          aria-label={`${cards.length} cards in your hand`}
        >
          <Layers3
            size={14}
            className="text-cyan-300"
            aria-hidden="true"
          />
          <span className="text-xs font-bold tabular-nums text-white">
            {cards.length}
          </span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            {cards.length === 1 ? "card" : "cards"}
          </span>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-emerald-400/30 bg-emerald-400/[0.04] px-4 text-center">
          <Sparkles
            size={28}
            className="mb-2 text-emerald-300"
            aria-hidden="true"
          />
          <p className="text-sm font-bold text-emerald-300">
            No cards remaining!
          </p>
          <p className="mt-1 text-xs text-slate-400">
            You have played every card in your hand.
          </p>
        </div>
      ) : (
        <>
          {canInteract && (
            <div className="mb-3 flex items-center gap-2 text-xs text-cyan-200">
              <MousePointerClick size={15} aria-hidden="true" />
              <span>Select a card that matches the center card&apos;s subject.</span>
            </div>
          )}

          <div
            className={`grid gap-2 ${
              compact
                ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
                : "grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
            }`}
          >
            {cards.map((card, index) => {
              const isPlayable = playableIds.has(card.instanceId);
              const isSelected =
                selectedCardInstanceId === card.instanceId;
              const isDisabled =
                !canInteract || !isPlayable || !onSelectCard;
              const subjectStyle =
                SUBJECT_STYLES[card.subject] ??
                "border-white/20 bg-slate-700 text-slate-200";
              const subjectLabel =
                SUBJECT_LABELS[card.subject] ?? card.subject;

              return (
                <button
                  key={card.instanceId}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectCard?.(card.instanceId)}
                  aria-pressed={isSelected}
                  aria-label={`${subjectLabel} card ${index + 1}${
                    isPlayable ? ", playable" : ", not playable"
                  }${isSelected ? ", selected" : ""}`}
                  title={
                    isPlayable
                      ? `Play ${subjectLabel}`
                      : `Cannot play ${subjectLabel} yet`
                  }
                  className={`group relative flex min-h-[148px] min-w-0 flex-col overflow-hidden rounded-xl border p-2.5 text-left transition-all duration-200 sm:min-h-[166px] sm:p-3 ${
                    isSelected
                      ? "z-10 -translate-y-1 border-amber-300 bg-amber-400/10 shadow-[0_0_22px_rgba(252,211,77,0.18)] ring-2 ring-amber-300/60"
                      : isPlayable && canInteract
                        ? "border-cyan-400/50 bg-slate-900 shadow-md hover:-translate-y-1 hover:border-cyan-300 hover:bg-slate-800 hover:shadow-[0_8px_24px_rgba(34,211,238,0.12)]"
                        : "cursor-not-allowed border-white/10 bg-slate-900/70 opacity-65"
                  } ${isDisabled ? "disabled:transform-none" : ""}`}
                >
                  <div className="mb-3 flex w-full items-start justify-between gap-1">
                    <span
                      className={`inline-flex max-w-full rounded-md border px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide sm:text-[10px] ${subjectStyle}`}
                    >
                      {card.subject}
                    </span>

                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-amber-300 px-1.5 py-0.5 text-[9px] font-black text-slate-950">
                        SELECTED
                      </span>
                    )}

                    {!isSelected && isPlayable && canInteract && (
                      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyan-300" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-center">
                    <div
                      className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-black ${
                        isSelected
                          ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
                          : isPlayable && canInteract
                            ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                            : "border-white/10 bg-slate-800 text-slate-300"
                      }`}
                      aria-hidden="true"
                    >
                      {card.subject === "MATHS"
                        ? "∑"
                        : card.subject === "ENGLISH"
                          ? "Aa"
                          : card.subject === "BIOLOGY"
                            ? "✳"
                            : card.subject === "CHEMISTRY"
                              ? "⚗"
                              : card.subject === "PHYSICS"
                                ? "⚡"
                                : card.subject === "HISTORY"
                                  ? "⌛"
                                  : "★"}
                    </div>

                    <p className="line-clamp-3 break-words text-xs font-bold leading-5 text-white sm:text-sm">
                      {card.question}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-1 border-t border-white/10 pt-2">
                    <span className="truncate text-[9px] text-slate-400 sm:text-[10px]">
                      {subjectLabel}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        card.difficulty === "EASY"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : card.difficulty === "MEDIUM"
                            ? "bg-amber-400/10 text-amber-300"
                            : "bg-rose-400/10 text-rose-300"
                      }`}
                    >
                      {card.difficulty}
                    </span>
                  </div>

                  {isPlayable && canInteract && !isSelected && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {cards.length > 0 && (
        <p className="mt-3 text-center text-[11px] text-slate-500">
          {playableIds.size > 0
            ? `${cards.filter((card) => playableIds.has(card.instanceId)).length} playable ${
                cards.filter((card) => playableIds.has(card.instanceId)).length === 1
                  ? "card"
                  : "cards"
              }`
            : "Play a card that matches the center subject."}
        </p>
      )}
    </section>
  );
}

export default memo(PlayerHand);
