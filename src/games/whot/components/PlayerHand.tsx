





"use client";

import { memo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Layers3,
  MousePointerClick,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

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
  MATHS: "border-blue-400/50 bg-blue-500/15 text-blue-200",
  ENGLISH: "border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-200",
  BIOLOGY: "border-emerald-400/50 bg-emerald-500/15 text-emerald-200",
  CHEMISTRY: "border-orange-400/50 bg-orange-500/15 text-orange-200",
  PHYSICS: "border-cyan-400/50 bg-cyan-500/15 text-cyan-200",
  HISTORY: "border-amber-400/50 bg-amber-500/15 text-amber-200",
  GENERAL: "border-violet-400/50 bg-violet-500/15 text-violet-200",
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

const SUBJECT_SYMBOLS: Record<string, string> = {
  MATHS: "∑",
  ENGLISH: "Aa",
  BIOLOGY: "✳",
  CHEMISTRY: "⚗",
  PHYSICS: "⚡",
  HISTORY: "⌛",
  GENERAL: "★",
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
  const [previewCardId, setPreviewCardId] = useState<string | null>(null);
  const [touchPreviewCardId, setTouchPreviewCardId] = useState<string | null>(
    null,
  );

  const canInteract = isPlayerTurn && !disabled;
  const playableIds = new Set(playableCardIds);

  const playableCount = cards.filter((card) =>
    playableIds.has(card.instanceId),
  ).length;

  const previewCard =
    cards.find((card) => card.instanceId === previewCardId) ??
    cards.find((card) => card.instanceId === touchPreviewCardId) ??
    cards.find((card) => card.instanceId === selectedCardInstanceId) ??
    null;

  const previewIsPlayable = previewCard
    ? playableIds.has(previewCard.instanceId)
    : false;

  const closePreview = () => {
    setPreviewCardId(null);
    setTouchPreviewCardId(null);
  };

  const handleCardClick = (instanceId: string) => {
    // First tap on a touch device opens the preview.
    // A second tap on the same card selects it.
    if (touchPreviewCardId !== instanceId) {
      setTouchPreviewCardId(instanceId);
      setPreviewCardId(null);
      return;
    }

    if (
      canInteract &&
      playableIds.has(instanceId) &&
      onSelectCard
    ) {
      onSelectCard(instanceId);
      closePreview();
    }
  };

  return (
    <section
      aria-label={`${playerName}'s hand`}
      className={`w-full min-w-0 overflow-hidden rounded-2xl border p-2.5 transition-all duration-300 sm:p-4 ${
        canInteract
          ? "border-cyan-400/50 bg-gradient-to-br from-cyan-500/[0.09] to-blue-500/[0.04] shadow-[0_0_22px_rgba(34,211,238,0.07)]"
          : "border-blue-400/20 bg-slate-950/50"
      } ${className}`}
    >
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              canInteract
                ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-200"
                : "border-blue-400/20 bg-blue-500/10 text-blue-300"
            }`}
          >
            <UserRound size={21} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <h3 className="max-w-full truncate text-sm font-extrabold text-white">
                {playerName}
              </h3>
              <span className="rounded-md border border-cyan-400/25 bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-200">
                Player
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
              {canInteract
                ? "Preview a question before playing"
                : "Your card collection"}
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-slate-900/90 px-2.5 py-2"
          aria-label={`${cards.length} cards in your hand`}
        >
          <Layers3 size={15} className="text-cyan-300" aria-hidden="true" />
          <span className="text-sm font-extrabold tabular-nums text-white">
            {cards.length}
          </span>
          <span className="hidden text-[11px] text-slate-400 min-[400px]:inline">
            cards
          </span>
        </div>
      </div>

      {canInteract && (
        <div
          className="mb-3 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-[11px] text-cyan-100 sm:text-xs"
          role="status"
        >
          <MousePointerClick
            size={16}
            className="shrink-0 text-cyan-300"
            aria-hidden="true"
          />
          <span>
            {playableCount > 0
              ? `${playableCount} playable ${
                  playableCount === 1 ? "card" : "cards"
                }. Hover to preview, then play.`
              : "No matching card available. Draw a card to continue."}
          </span>
        </div>
      )}

      {/* Large question preview */}
      {previewCard && (
        <div
          className="mb-4 overflow-hidden rounded-2xl border border-cyan-300/40 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 shadow-[0_0_25px_rgba(34,211,238,0.08)]"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
                <Eye size={19} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-300">
                  Question preview
                </p>
                <p className="text-xs text-slate-400">
                  Read the full question before playing
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closePreview}
              aria-label="Close question preview"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${
                  SUBJECT_STYLES[previewCard.subject] ??
                  "border-white/20 bg-slate-700 text-slate-200"
                }`}
              >
                {SUBJECT_LABELS[previewCard.subject] ??
                  previewCard.subject}
              </span>

              <span
                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold uppercase ${
                  previewCard.difficulty === "EASY"
                    ? "bg-emerald-400/10 text-emerald-300"
                    : previewCard.difficulty === "MEDIUM"
                      ? "bg-amber-400/10 text-amber-300"
                      : "bg-rose-400/10 text-rose-300"
                }`}
              >
                {previewCard.difficulty}
              </span>

              {previewIsPlayable ? (
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-extrabold uppercase text-emerald-300">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  Playable
                </span>
              ) : (
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-400">
                  Not playable now
                </span>
              )}
            </div>

            <h4 className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Read the question
            </h4>

            <p className="whitespace-pre-wrap break-words text-base font-semibold leading-7 text-white sm:text-lg sm:leading-8">
              {previewCard.question}
            </p>

            {previewCard.options.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                  Answer options
                </p>

                {previewCard.options.map((option, index) => (
                  <div
                    key={`${previewCard.instanceId}-option-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-[11px] font-extrabold text-cyan-200">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="min-w-0 break-words text-sm leading-6 text-slate-200">
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {canInteract && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={!previewIsPlayable || !onSelectCard}
                  onClick={() => {
                    if (
                      previewIsPlayable &&
                      onSelectCard
                    ) {
                      onSelectCard(previewCard.instanceId);
                      closePreview();
                    }
                  }}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                >
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {previewIsPlayable
                    ? "Play this card"
                    : "Card cannot be played yet"}
                </button>

                <button
                  type="button"
                  onClick={closePreview}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  Back to hand
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-emerald-400/30 bg-emerald-400/[0.05] px-4 py-5 text-center">
          <Sparkles
            size={27}
            className="mb-2 text-emerald-300"
            aria-hidden="true"
          />
          <p className="text-sm font-extrabold text-emerald-200">
            No cards remaining!
          </p>
          <p className="mt-1 text-xs text-slate-400">
            You have played every card in your hand.
          </p>
        </div>
      ) : (
        <div
          className={`grid min-w-0 gap-2 ${
            compact
              ? "grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
              : "grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          }`}
        >
          {cards.map((card, index) => {
            const isPlayable = playableIds.has(card.instanceId);
            const isSelected =
              selectedCardInstanceId === card.instanceId;
            const isDisabled =
              !canInteract || !isPlayable || !onSelectCard;

            const isPreviewed =
              previewCard?.instanceId === card.instanceId;

            const subjectStyle =
              SUBJECT_STYLES[card.subject] ??
              "border-white/20 bg-slate-700 text-slate-200";

            const subjectLabel =
              SUBJECT_LABELS[card.subject] ?? card.subject;

            const symbol = SUBJECT_SYMBOLS[card.subject] ?? "★";

            return (
              <button
                key={card.instanceId}
                type="button"
                disabled={isDisabled}
                onMouseEnter={() => {
                  setPreviewCardId(card.instanceId);
                  setTouchPreviewCardId(null);
                }}
                onMouseLeave={() => {
                  setPreviewCardId(null);
                }}
                onFocus={() => {
                  setPreviewCardId(card.instanceId);
                }}
                onBlur={() => {
                  setPreviewCardId(null);
                }}
                onClick={() => handleCardClick(card.instanceId)}
                aria-pressed={isSelected}
                aria-label={`${subjectLabel} card ${index + 1}, ${
                  isPlayable ? "playable" : "not playable"
                }${isSelected ? ", selected" : ""}. Hover or focus to preview.`}
                title={
                  isPlayable
                    ? `Preview and play ${subjectLabel}`
                    : `Preview ${subjectLabel}`
                }
                className={`group relative flex min-h-[132px] min-w-0 flex-col overflow-hidden rounded-xl border p-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:min-h-[158px] sm:p-3 ${
                  isSelected
                    ? "z-10 -translate-y-0.5 border-amber-300 bg-amber-400/10 shadow-[0_0_20px_rgba(252,211,77,0.16)] ring-2 ring-amber-300/60"
                    : isPreviewed
                      ? "z-10 -translate-y-1 border-cyan-300 bg-slate-800 shadow-[0_0_22px_rgba(34,211,238,0.2)]"
                      : isPlayable && canInteract
                        ? "border-cyan-400/60 bg-slate-900 shadow-md hover:border-cyan-300 hover:bg-slate-800 active:scale-[0.98] sm:hover:-translate-y-1"
                        : "cursor-not-allowed border-white/10 bg-slate-900/80 opacity-70"
                }`}
              >
                <div className="mb-2 flex w-full min-w-0 items-start justify-between gap-1">
                  <span
                    className={`inline-flex min-w-0 max-w-full truncate rounded-md border px-1.5 py-1 text-[9px] font-extrabold uppercase tracking-wide sm:px-2 sm:text-[10px] ${subjectStyle}`}
                  >
                    {card.subject}
                  </span>

                  {isSelected ? (
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-amber-300"
                      aria-hidden="true"
                    />
                  ) : isPreviewed ? (
                    <Eye
                      size={15}
                      className="shrink-0 text-cyan-300"
                      aria-hidden="true"
                    />
                  ) : isPlayable && canInteract ? (
                    <span
                      className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyan-300"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col">
                  <div
                    className={`mb-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base font-black sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg ${
                      isSelected
                        ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
                        : isPlayable && canInteract
                          ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                          : "border-white/10 bg-slate-800 text-slate-300"
                    }`}
                    aria-hidden="true"
                  >
                    {symbol}
                  </div>

                  <p className="line-clamp-4 break-words text-[11px] font-bold leading-[1.35rem] text-white sm:text-sm sm:leading-5">
                    {card.question}
                  </p>
                </div>

                <div className="mt-2 flex min-w-0 items-center justify-between gap-1 border-t border-white/10 pt-2">
                  <span className="min-w-0 truncate text-[9px] text-slate-400 sm:text-[10px]">
                    {subjectLabel}
                  </span>

                  <span
                    className={`shrink-0 rounded px-1 py-0.5 text-[8px] font-extrabold uppercase sm:px-1.5 sm:text-[9px] ${
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

                {isPlayable && canInteract && (
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 ${
                      isSelected
                        ? "bg-amber-300"
                        : "bg-gradient-to-r from-cyan-400 to-blue-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {cards.length > 0 && (
        <p className="mt-3 text-center text-[10px] text-slate-500 sm:text-[11px]">
          {playableCount > 0
            ? `${playableCount} of ${cards.length} cards can be played`
            : "Match the centre card's subject to play."}
        </p>
      )}
    </section>
  );
}

export default memo(PlayerHand);