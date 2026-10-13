


"use client";

import { memo } from "react";
import {
  Brain,
  Clock3,
  Layers3,
  Sparkles,
  UserRound,
} from "lucide-react";

import BotHand from "./BotHand";
import DrawPile from "./DrawPile";
import PlayerHand from "./PlayerHand";

import type {
  WhotCard,
  WhotGameStatus,
  WhotPlayerId,
} from "../types/whot";

export interface GameTableProps {
  status: WhotGameStatus;
  currentTurn: WhotPlayerId;
  winner?: WhotPlayerId | null;
  message?: string;

  playerCards: WhotCard[];
  botCardCount: number;
  drawPileCount: number;
  centerCard: WhotCard;

  playableCardIds?: string[];
  selectedCardInstanceId?: string | null;

  onSelectCard: (instanceId: string) => void;
  onDrawCard: () => void;

  isPlayerTurn: boolean;
  isBotTurn: boolean;
  isBotAnswering?: boolean;

  isQuestionOpen?: boolean;
  isShowingFeedback?: boolean;
  isFinished?: boolean;
  isDrawing?: boolean;

  timeRemaining?: number | null;
  questionSource?: "player" | "bot" | null;

  playerName?: string;
  botName?: string;

  compact?: boolean;
  className?: string;
}

const SUBJECT_STYLES: Record<string, string> = {
  MATHS:
    "from-blue-500/25 via-blue-950 to-slate-950 border-blue-400/70 text-blue-100",
  ENGLISH:
    "from-fuchsia-500/25 via-fuchsia-950 to-slate-950 border-fuchsia-400/70 text-fuchsia-100",
  BIOLOGY:
    "from-emerald-500/25 via-emerald-950 to-slate-950 border-emerald-400/70 text-emerald-100",
  CHEMISTRY:
    "from-orange-500/25 via-orange-950 to-slate-950 border-orange-400/70 text-orange-100",
  PHYSICS:
    "from-cyan-500/25 via-cyan-950 to-slate-950 border-cyan-400/70 text-cyan-100",
  HISTORY:
    "from-amber-500/25 via-amber-950 to-slate-950 border-amber-400/70 text-amber-100",
  GENERAL:
    "from-violet-500/25 via-violet-950 to-slate-950 border-violet-400/70 text-violet-100",
};

const SUBJECT_ACCENTS: Record<string, string> = {
  MATHS: "bg-blue-400",
  ENGLISH: "bg-fuchsia-400",
  BIOLOGY: "bg-emerald-400",
  CHEMISTRY: "bg-orange-400",
  PHYSICS: "bg-cyan-400",
  HISTORY: "bg-amber-400",
  GENERAL: "bg-violet-400",
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

function CenterCard({
  card,
  compact = false,
}: {
  card: WhotCard;
  compact?: boolean;
}) {
  const subject = card.subject;
  const subjectStyle =
    SUBJECT_STYLES[subject] ??
    "from-slate-700 via-slate-900 to-slate-950 border-white/20 text-slate-100";

  const accent = SUBJECT_ACCENTS[subject] ?? "bg-slate-400";
  const label = SUBJECT_LABELS[subject] ?? subject;
  const symbol = SUBJECT_SYMBOLS[subject] ?? "★";

  return (
    <article
      aria-label={`Centre card: ${label}`}
      className={`relative mx-auto flex w-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br shadow-xl ${
        compact
          ? "min-h-[155px] max-w-[155px] p-2.5 min-[400px]:min-h-[175px] min-[400px]:max-w-[165px] sm:min-h-[190px] sm:max-w-[180px] sm:p-3"
          : "min-h-[190px] max-w-[180px] p-3.5"
      } ${subjectStyle}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />

      <div className="flex items-start justify-between gap-1.5">
        <span className="rounded-md border border-white/15 bg-black/20 px-1.5 py-1 text-[8px] font-black uppercase tracking-wider text-white/90 sm:text-[9px]">
          Centre
        </span>

        <span
          className={`rounded-md px-1.5 py-1 text-[8px] font-extrabold uppercase ${
            card.difficulty === "EASY"
              ? "bg-emerald-400/15 text-emerald-200"
              : card.difficulty === "MEDIUM"
                ? "bg-amber-400/15 text-amber-200"
                : "bg-rose-400/15 text-rose-200"
          }`}
        >
          {card.difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/20 text-xl font-black text-white sm:h-11 sm:w-11 sm:text-2xl">
          {symbol}
        </div>

        <p className="text-[9px] font-extrabold uppercase tracking-wider text-white/70">
          {label}
        </p>

        <h3 className="mt-1.5 line-clamp-3 break-words text-xs font-extrabold leading-4 text-white sm:text-sm sm:leading-5">
          {card.question}
        </h3>
      </div>

      <div className="mt-auto border-t border-white/15 pt-1.5 text-center">
        <span className="text-[8px] font-bold uppercase tracking-wider text-white/60">
          Match the subject
        </span>
      </div>
    </article>
  );
}

function DrawPilePanel({
  count,
  disabled,
  isDrawing,
  onDrawCard,
  compact = false,
}: {
  count: number;
  disabled: boolean;
  isDrawing: boolean;
  onDrawCard: () => void;
  compact?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[150px] min-w-0 flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 sm:text-[10px]">
        <Layers3 size={12} aria-hidden="true" />
        <span>Draw Pile</span>
      </div>

      <div className="flex w-full items-center justify-center">
        <DrawPile
          cardCount={count}
          onDraw={onDrawCard}
          disabled={disabled}
          isDrawing={isDrawing}
          isPlayerTurn={!disabled && !isDrawing}
          compact={compact}
          title="Draw Pile"
          className="w-full border-0 bg-transparent p-0"
        />
      </div>

      <span className="text-[9px] text-slate-500">
        {Math.max(0, count)} cards left
      </span>
    </div>
  );
}

function GameTable({
  status,
  currentTurn,
  winner = null,
  message = "",
  playerCards,
  botCardCount,
  drawPileCount,
  centerCard,
  playableCardIds = [],
  selectedCardInstanceId = null,
  onSelectCard,
  onDrawCard,
  isPlayerTurn,
  isBotTurn: _isBotTurn,
  isBotAnswering = false,
  isQuestionOpen = false,
  isShowingFeedback = false,
  isFinished = false,
  isDrawing = false,
  timeRemaining = null,
  questionSource = null,
  playerName = "You",
  botName = "Learnyfi Bot",
  compact = false,
  className = "",
}: GameTableProps) {
  const gameIsFinished =
    isFinished || status === "FINISHED" || winner !== null;

  const canDraw =
    status === "PLAYING" &&
    isPlayerTurn &&
    !isQuestionOpen &&
    !isShowingFeedback &&
    !isBotAnswering &&
    !gameIsFinished &&
    !isDrawing;

  const showTimer =
    isQuestionOpen &&
    typeof timeRemaining === "number" &&
    Number.isFinite(timeRemaining) &&
    timeRemaining >= 0;

  const activeName =
    questionSource === "player"
      ? playerName
      : questionSource === "bot"
        ? botName
        : currentTurn === "player"
          ? playerName
          : botName;

  const turnText = gameIsFinished
    ? winner === "player"
      ? "You won!"
      : winner === "bot"
        ? `${botName} won`
        : "Game finished"
    : isBotAnswering
      ? `${botName} is answering…`
      : isQuestionOpen
        ? `${activeName} is answering`
        : isDrawing
          ? "Drawing a card…"
          : isPlayerTurn
            ? "Your turn — play a card"
            : `${botName} is thinking…`;

  const turnStyle = gameIsFinished
    ? "border-white/10 bg-slate-900 text-slate-200"
    : isPlayerTurn
      ? "border-cyan-400/25 bg-cyan-400/[0.06] text-cyan-100"
      : "border-amber-400/25 bg-amber-400/[0.06] text-amber-100";

  return (
    <section
      aria-label="WHOT game table"
      className={`mx-auto w-full min-w-0 max-w-7xl overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-950 p-2.5 shadow-2xl sm:rounded-3xl sm:p-4 md:p-5 ${className}`}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Opponent identity and actual face-down cards */}
        <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-2.5 py-2 sm:px-3 sm:py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-200">
                <Brain size={17} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-amber-100">
                  {botName}
                </p>
                <p className="text-[10px] text-slate-500">
                  Opponent hand
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-lg bg-amber-400/10 px-2 py-1 text-xs font-black tabular-nums text-amber-100">
              {botCardCount} {botCardCount === 1 ? "card" : "cards"}
            </span>
          </div>

          <div className="min-w-0 overflow-hidden">
            <BotHand cardCount={botCardCount} compact={compact} />
          </div>
        </div>

        {/* Countdown appears only while a question is active */}
        {showTimer && (
          <div
            role="timer"
            aria-live="off"
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 ${
              timeRemaining <= 5
                ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                : "border-cyan-400/25 bg-cyan-400/[0.05] text-cyan-100"
            }`}
          >
            <Clock3 size={15} aria-hidden="true" />
            <span className="text-xs font-semibold">{activeName}</span>
            <span className="text-lg font-black tabular-nums">
              {Math.ceil(timeRemaining)}s
            </span>
          </div>
        )}

        {/* Main play area: Bot hand | Centre card | Your card count */}
        <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-2.5 sm:p-4">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles
              size={14}
              className="text-emerald-300"
              aria-hidden="true"
            />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/70">
              Play area
            </h2>
          </div>

          <div className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] items-center gap-1.5 min-[400px]:gap-3 sm:gap-5">
            {/* Left: Bot hand */}
            <div className="flex min-w-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-1.5 sm:p-2">
              <Brain
                size={16}
                className="text-amber-200"
                aria-hidden="true"
              />
              <span className="text-center text-[9px] font-extrabold text-amber-100 sm:text-[10px]">
                Bot hand
              </span>
              <span className="text-lg font-black tabular-nums text-white sm:text-xl">
                {botCardCount}
              </span>
              <span className="text-center text-[8px] text-slate-500">
                {botCardCount === 1 ? "card left" : "cards left"}
              </span>
            </div>

            {/* Centre: current card and draw pile beneath it */}
            <div className="flex min-w-0 flex-col items-center gap-3">
              {isBotAnswering ? (
                <div className="flex min-h-[155px] w-full max-w-[165px] flex-col items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/[0.05] px-2 text-center sm:min-h-[190px] sm:max-w-[180px]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    <Brain size={22} aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-xs font-extrabold text-amber-100">
                    Bot is thinking
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Checking answer…
                  </p>
                </div>
              ) : (
                <CenterCard card={centerCard} compact={compact} />
              )}

             {canDraw && playableCardIds.length === 0 && (
  <DrawPilePanel
    count={drawPileCount}
    disabled={false}
    isDrawing={isDrawing}
    onDrawCard={onDrawCard}
    compact={compact}
  />
)}
            </div>

            {/* Right: your card count */}
            <div className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] p-1.5 sm:p-2">
              <UserRound
                size={16}
                className="text-cyan-200"
                aria-hidden="true"
              />
              <span className="text-center text-[9px] font-extrabold text-cyan-100 sm:text-[10px]">
                Your hand
              </span>
              <span className="text-lg font-black tabular-nums text-cyan-100 sm:text-xl">
                {playerCards.length}
              </span>
              <span className="text-center text-[8px] text-slate-500">
                {playerCards.length === 1 ? "card left" : "cards left"}
              </span>
            </div>
          </div>
        </div>

        {/* One concise turn indicator */}
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center ${turnStyle}`}
        >
          {isBotAnswering || (!isPlayerTurn && !gameIsFinished) ? (
            <Brain size={15} className="shrink-0" aria-hidden="true" />
          ) : (
            <UserRound size={15} className="shrink-0" aria-hidden="true" />
          )}
          <p className="text-xs font-bold sm:text-sm">{turnText}</p>
        </div>

        {/* Your actual playable cards stay at the bottom */}
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-950/50 p-2 sm:p-3">
          <PlayerHand
            cards={playerCards}
            playableCardIds={playableCardIds}
            selectedCardInstanceId={selectedCardInstanceId}
            onSelectCard={onSelectCard}
            isPlayerTurn={isPlayerTurn}
            disabled={
              status !== "PLAYING" ||
              isQuestionOpen ||
              isShowingFeedback ||
              isBotAnswering ||
              isDrawing ||
              gameIsFinished
            }
            playerName={playerName}
            compact={compact}
          />
        </div>

        {gameIsFinished && (
          <p className="text-center text-xs text-slate-500">
            {message ||
              (winner === "player"
                ? "Well played! You cleared your hand."
                : "The round has ended.")}
          </p>
        )}
      </div>
    </section>
  );
}

export default memo(GameTable);
