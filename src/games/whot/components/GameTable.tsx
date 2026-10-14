




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
      className={`relative mx-auto flex w-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br shadow-xl transition-all duration-300 ${
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
  isBotTurn,
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

  const botHasTurn =
    status === "PLAYING" &&
    (isBotTurn || currentTurn === "bot") &&
    !gameIsFinished;

  const playerHasTurn =
    status === "PLAYING" &&
    isPlayerTurn &&
    !gameIsFinished;

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

  const showTurnIndicator =
    status === "PLAYING" &&
    !gameIsFinished &&
    !isQuestionOpen &&
    !isShowingFeedback &&
    !isBotAnswering &&
    !isDrawing;

  const botIsFocused = botHasTurn && !isQuestionOpen && !isShowingFeedback;
  const playerIsFocused =
    playerHasTurn && !isQuestionOpen && !isShowingFeedback;

  return (
    <section
      aria-label="WHOT game table"
      className={`mx-auto w-full min-w-0 max-w-7xl overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-950 p-2.5 shadow-2xl transition-all duration-300 sm:rounded-3xl sm:p-4 md:p-5 ${
        botIsFocused
          ? "border-amber-300/40 shadow-amber-500/10"
          : playerIsFocused
            ? "border-cyan-300/30 shadow-cyan-500/10"
            : "border-emerald-400/15"
      } ${className}`}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Opponent hand: becomes the visual focus during the bot's turn */}
        <div
          className={`relative rounded-2xl border px-2.5 py-3 transition-all duration-300 sm:px-4 sm:py-4 ${
            botIsFocused
              ? "scale-[1.01] border-amber-300/70 bg-gradient-to-br from-amber-400/15 via-amber-950/40 to-slate-950 shadow-lg shadow-amber-400/10 ring-2 ring-amber-300/20"
              : "border-amber-400/15 bg-amber-400/[0.03]"
          }`}
        >
          {botIsFocused && (
            <div className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-amber-100">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider sm:text-sm">
                Opponent&apos;s turn
              </span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
          )}

          <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  botIsFocused
                    ? "border-amber-300/50 bg-amber-300/20 text-amber-200"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                }`}
              >
                <Brain size={19} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-black transition-colors ${
                    botIsFocused ? "text-amber-100" : "text-amber-200"
                  }`}
                >
                  {botName}
                </p>
                <p className="text-[10px] text-slate-400 sm:text-xs">
                  {botIsFocused
                    ? "Playing now"
                    : "Opponent hand · cards hidden"}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-xl border px-2.5 py-1.5 text-xs font-black tabular-nums transition-all ${
                botIsFocused
                  ? "border-amber-300/40 bg-amber-300/15 text-amber-100"
                  : "border-amber-400/10 bg-amber-400/10 text-amber-200"
              }`}
            >
              {botCardCount} {botCardCount === 1 ? "card" : "cards"}
            </span>
          </div>

          <div
            className={`min-w-0 overflow-hidden rounded-xl transition-all duration-300 ${
              botIsFocused
                ? "bg-amber-300/[0.04] p-1.5 ring-1 ring-amber-300/15 sm:p-2"
                : "opacity-75"
            }`}
          >
            <BotHand cardCount={botCardCount} compact={compact} />
          </div>

          {botIsFocused && (
            <p className="mt-2 text-center text-[10px] font-semibold text-amber-200/80 sm:text-xs">
              Watch the opponent&apos;s move
            </p>
          )}
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

        {/* Main play area */}
        <div
          className={`rounded-2xl border p-2.5 transition-all duration-300 sm:p-4 ${
            botIsFocused
              ? "border-amber-400/20 bg-amber-400/[0.025]"
              : playerIsFocused
                ? "border-cyan-400/20 bg-cyan-400/[0.025]"
                : "border-white/[0.07] bg-black/20"
          }`}
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles
              size={14}
              className={botIsFocused ? "text-amber-300" : "text-emerald-300"}
              aria-hidden="true"
            />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
              Play area
            </h2>
          </div>

          <div className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] items-center gap-1.5 min-[400px]:gap-3 sm:gap-5">
            {/* Bot hand count */}
            <div
              className={`flex min-w-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-1.5 transition-all duration-300 sm:p-2 ${
                botIsFocused
                  ? "border-amber-300/50 bg-amber-400/10 shadow-md shadow-amber-500/10"
                  : "border-amber-400/15 bg-amber-400/[0.03]"
              }`}
            >
              <Brain
                size={16}
                className={botIsFocused ? "text-amber-200" : "text-amber-300/70"}
                aria-hidden="true"
              />
              <span className="text-center text-[9px] font-extrabold text-amber-100 sm:text-[10px]">
                Bot hand
              </span>
              <span className="text-lg font-black tabular-nums text-white sm:text-xl">
                {botCardCount}
              </span>
              <span className="text-center text-[8px] text-slate-400">
                {botCardCount === 1 ? "card left" : "cards left"}
              </span>
            </div>

            {/* Centre card and draw pile */}
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

              {canDraw && playableCardIds.length === 0 && drawPileCount > 0 && (
                <DrawPilePanel
                  count={drawPileCount}
                  disabled={false}
                  isDrawing={isDrawing}
                  onDrawCard={onDrawCard}
                  compact={compact}
                />
              )}
            </div>

            {/* Player hand count */}
            <div
              className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border p-1.5 transition-all duration-300 sm:p-2 ${
                playerIsFocused
                  ? "border-cyan-300/50 bg-cyan-400/10 shadow-md shadow-cyan-500/10"
                  : "border-cyan-400/10 bg-cyan-400/[0.02]"
              }`}
            >
              <UserRound
                size={16}
                className={playerIsFocused ? "text-cyan-200" : "text-cyan-300/60"}
                aria-hidden="true"
              />
              <span className="text-center text-[9px] font-extrabold text-cyan-100 sm:text-[10px]">
                Your hand
              </span>
              <span className="text-lg font-black tabular-nums text-cyan-100 sm:text-xl">
                {playerCards.length}
              </span>
              <span className="text-center text-[8px] text-slate-400">
                {playerCards.length === 1 ? "card left" : "cards left"}
              </span>
            </div>
          </div>
        </div>

        {/* Prominent current-turn message */}
        {showTurnIndicator && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
              botIsFocused
                ? "border-amber-300/40 bg-amber-400/10 text-amber-100"
                : "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                botIsFocused
                  ? "animate-pulse bg-amber-300"
                  : "bg-cyan-300"
              }`}
            />
            <p className="text-xs font-bold sm:text-sm">
              {botIsFocused
                ? `${botName} is choosing a card…`
                : "Your turn — play a card"}
            </p>
            <Sparkles size={15} className="shrink-0" aria-hidden="true" />
          </div>
        )}

        {/* Player's actual cards */}
        <div
          className={`rounded-2xl border p-2 transition-all duration-300 sm:p-3 ${
            playerIsFocused
              ? "border-cyan-300/50 bg-gradient-to-br from-cyan-400/[0.08] to-slate-950 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-300/20"
              : botIsFocused
                ? "border-white/5 bg-slate-950/30 opacity-60"
                : "border-cyan-400/10 bg-slate-950/50"
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <div className="flex min-w-0 items-center gap-2">
              <UserRound
                size={16}
                className={playerIsFocused ? "text-cyan-200" : "text-slate-400"}
                aria-hidden="true"
              />
              <span
                className={`truncate text-xs font-black ${
                  playerIsFocused ? "text-cyan-100" : "text-slate-300"
                }`}
              >
                {playerName}
              </span>
            </div>

            <span
              className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${
                playerIsFocused
                  ? "bg-cyan-300/15 text-cyan-100"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              {playerIsFocused ? "YOUR TURN" : `${playerCards.length} cards`}
            </span>
          </div>

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

        {/* Final game message */}
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
