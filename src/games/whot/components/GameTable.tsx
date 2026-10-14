





"use client";

import { memo } from "react";
import {
  Brain,
  CheckCircle2,
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
  isFocused = false,
}: {
  count: number;
  disabled: boolean;
  isDrawing: boolean;
  onDrawCard: () => void;
  compact?: boolean;
  isFocused?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex w-full max-w-[170px] min-w-0 flex-col items-center gap-2 rounded-2xl border p-2 transition-all duration-300 ${
        isFocused
          ? "scale-[1.03] border-emerald-300 bg-emerald-400/10 shadow-lg shadow-emerald-400/20 ring-2 ring-emerald-300/30"
          : "border-white/10 bg-slate-950/30"
      }`}
    >
      <div
        className={`flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider sm:text-[10px] ${
          isFocused ? "text-emerald-200" : "text-slate-400"
        }`}
      >
        <Layers3 size={12} aria-hidden="true" />
        <span>Draw Pile</span>
      </div>

      <DrawPile
        cardCount={count}
        onDraw={onDrawCard}
        disabled={disabled}
        isDrawing={isDrawing}
        isPlayerTurn={!disabled && !isDrawing}
        compact={compact}
        title={isFocused ? "Draw a card now" : "Draw Pile"}
        className={`w-full rounded-xl p-1 transition-all ${
          isFocused ? "ring-2 ring-emerald-300/50" : ""
        }`}
      />

      <span
        className={`text-[9px] ${
          isFocused ? "font-bold text-emerald-200" : "text-slate-500"
        }`}
      >
        {Math.max(0, count)} cards left
      </span>

      {isFocused && (
        <span
          role="status"
          className="flex items-center gap-1 text-center text-[10px] font-black uppercase text-emerald-200"
        >
          <CheckCircle2 size={13} />
          Draw a card
        </span>
      )}
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

  const isPlaying = status === "PLAYING" && !gameIsFinished;

  const questionIsActive =
    isPlaying && isQuestionOpen && !isShowingFeedback;

  const botMustAnswer =
    questionIsActive &&
    (isBotAnswering || questionSource === "player");

  const playerMustAnswer =
    questionIsActive &&
    questionSource === "bot" &&
    !isBotAnswering;

  // Keep the bot focused during its automatic thinking delay.
  const botHasTurn =
    isPlaying &&
    (currentTurn === "bot" || isBotTurn);

  // Focus only the player actions that are currently available.
  const playerHasTurn =
    isPlaying &&
    currentTurn === "player" &&
    isPlayerTurn;

  const playableCount = playerCards.filter((card) =>
    playableCardIds.includes(card.instanceId),
  ).length;

  const canDraw =
    playerHasTurn &&
    !isQuestionOpen &&
    !isShowingFeedback &&
    !isBotAnswering &&
    !isDrawing &&
    !gameIsFinished &&
    playableCount === 0 &&
    drawPileCount > 0;

  

const botIsFocused =
  isPlaying &&
  currentTurn === "bot" &&
  !isQuestionOpen &&
  !isShowingFeedback &&
  !isBotAnswering;



  const playerIsFocused =
    playerHasTurn &&
    !isQuestionOpen &&
    !isShowingFeedback &&
    !isBotAnswering &&
    !isDrawing &&
    !gameIsFinished;

  const drawIsFocused = canDraw;

  const showTimer =
    questionIsActive &&
    typeof timeRemaining === "number" &&
    Number.isFinite(timeRemaining) &&
    timeRemaining >= 0;

  const activeName =
    questionSource === "player"
      ? botName
      : questionSource === "bot"
        ? playerName
        : currentTurn === "player"
          ? playerName
          : botName;

  const actionMessage = gameIsFinished
    ? "Game finished"
    : isShowingFeedback
      ? "Review the answer, then continue"
      : playerMustAnswer
        ? `${playerName}: answer the question`
        : botMustAnswer
          ? `${botName} is answering the question`
          : isDrawing
            ? `${playerName} is drawing a card`
            : botIsFocused
              ? `${botName} is choosing a card`
              : drawIsFocused
                ? "No matching card — draw a card"
                : playerIsFocused
                  ? "Your turn — choose a playable card"
                  : status === "READY"
                    ? "Ready to play"
                    : message || "Waiting for the next action";

  const showActionIndicator =
    isPlaying ||
    status === "READY" ||
    gameIsFinished ||
    isShowingFeedback;

  return (
    <section
      aria-label="WHOT game table"
      className={`mx-auto w-full min-w-0 max-w-7xl overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-950 p-2.5 shadow-2xl transition-all duration-300 sm:rounded-3xl sm:p-4 md:p-5 ${
        botIsFocused
          ? "border-amber-300/50 shadow-amber-500/10"
          : drawIsFocused
            ? "border-emerald-300/50 shadow-emerald-500/10"
            : playerIsFocused
              ? "border-cyan-300/50 shadow-cyan-500/10"
              : "border-emerald-400/15"
      } ${className}`}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Opponent's hand */}
        <div
          className={`relative rounded-2xl border p-2.5 transition-all duration-300 sm:p-4 ${
            botIsFocused
              ? "scale-[1.01] border-amber-300/70 bg-gradient-to-br from-amber-400/15 via-amber-950/40 to-slate-950 shadow-lg shadow-amber-400/10 ring-2 ring-amber-300/30"
              : "border-amber-400/15 bg-amber-400/[0.03]"
          }`}
        >
          {botIsFocused && (
            <div className="mb-3 flex animate-pulse items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-amber-100">
              <Sparkles size={16} />
              <span className="text-xs font-black uppercase tracking-wider sm:text-sm">
                Opponent&apos;s turn
              </span>
              <Sparkles size={16} />
            </div>
          )}

          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  botIsFocused
                    ? "border-amber-300/60 bg-amber-300/20 text-amber-100"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                }`}
              >
                <Brain size={19} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-amber-100">
                  {botName}
                </p>
                <p className="text-[10px] text-slate-400 sm:text-xs">
                  {botIsFocused
                    ? "Thinking and preparing its move"
                    : "Opponent hand · cards hidden"}
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-xl border border-amber-400/20 bg-slate-950/60 px-2.5 py-1.5 text-xs font-black tabular-nums text-amber-100">
              {botCardCount} {botCardCount === 1 ? "card" : "cards"}
            </span>
          </div>

          <div
            className={`rounded-xl transition-all duration-300 ${
              botIsFocused
                ? "bg-amber-300/[0.06] p-1.5 ring-2 ring-amber-300/30 sm:p-2"
                : "p-1 opacity-75"
            }`}
          >
            <BotHand
              cardCount={botCardCount}
              botName={botName}
              isActive={botIsFocused}
              compact={compact}
            />
          </div>

          {botIsFocused && (
            <p className="mt-2 text-center text-xs font-bold text-amber-200 sm:text-sm">
              Watch the opponent&apos;s move
            </p>
          )}
        </div>

        {/* Question timer */}
        {showTimer && (
          <div
            role="timer"
            aria-live="off"
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 ${
              timeRemaining <= 5
                ? "border-rose-400/50 bg-rose-500/10 text-rose-200"
                : "border-cyan-400/30 bg-cyan-400/[0.05] text-cyan-100"
            }`}
          >
            <Clock3 size={15} aria-hidden="true" />
            <span className="text-xs font-semibold">{activeName}</span>
            <span className="text-lg font-black tabular-nums">
              {Math.ceil(timeRemaining)}s
            </span>
          </div>
        )}

        {/* Expected action banner */}
        {showActionIndicator && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
              gameIsFinished
                ? "border-violet-300/30 bg-violet-400/10 text-violet-100"
                : isShowingFeedback
                  ? "border-amber-300/40 bg-amber-400/10 text-amber-100"
                  : botIsFocused
                    ? "border-amber-300/50 bg-amber-400/10 text-amber-100"
                    : drawIsFocused
                      ? "border-emerald-300/50 bg-emerald-400/10 text-emerald-100"
                      : playerIsFocused
                        ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100"
                        : "border-white/10 bg-white/[0.03] text-slate-300"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                botIsFocused
                  ? "animate-pulse bg-amber-300"
                  : drawIsFocused
                    ? "animate-pulse bg-emerald-300"
                    : playerIsFocused
                      ? "animate-pulse bg-cyan-300"
                      : "bg-slate-400"
              }`}
            />
            <p className="text-xs font-bold sm:text-sm">{actionMessage}</p>
            <Sparkles size={15} className="shrink-0" aria-hidden="true" />
          </div>
        )}

        {/* Main play area */}
        <div
          className={`rounded-2xl border p-2.5 transition-all duration-300 sm:p-4 ${
            botIsFocused
              ? "border-amber-400/30 bg-amber-400/[0.04]"
              : drawIsFocused
                ? "border-emerald-400/30 bg-emerald-400/[0.04]"
                : playerIsFocused
                  ? "border-cyan-400/30 bg-cyan-400/[0.04]"
                  : "border-white/[0.07] bg-black/20"
          }`}
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles
              size={14}
              className={
                botIsFocused
                  ? "text-amber-300"
                  : drawIsFocused
                    ? "text-emerald-300"
                    : "text-cyan-300"
              }
              aria-hidden="true"
            />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
              Play area
            </h2>
          </div>

          <div className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] items-center gap-1.5 min-[400px]:gap-3 sm:gap-5">
            {/* Bot card count */}
            <div
              className={`flex min-w-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-1.5 transition-all duration-300 sm:p-2 ${
                botIsFocused
                  ? "border-amber-300/60 bg-amber-400/10 shadow-md shadow-amber-500/10"
                  : "border-amber-400/15 bg-amber-400/[0.03]"
              }`}
            >
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
              <span className="text-center text-[8px] text-slate-400">
                {botCardCount === 1 ? "card left" : "cards left"}
              </span>
            </div>

            {/* Centre card and draw pile */}
            <div className="flex min-w-0 flex-col items-center gap-3">
              {isBotAnswering && questionIsActive ? (
                <div className="flex min-h-[155px] w-full max-w-[165px] flex-col items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/[0.08] px-2 text-center ring-2 ring-amber-300/20 sm:min-h-[190px] sm:max-w-[180px]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    <Brain size={22} aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-xs font-extrabold text-amber-100">
                    Bot is thinking
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Checking its answer…
                  </p>
                </div>
              ) : (
                <CenterCard card={centerCard} compact={compact} />
              )}

              {canDraw && (
                <DrawPilePanel
                  count={drawPileCount}
                  disabled={!canDraw}
                  isDrawing={isDrawing}
                  onDrawCard={onDrawCard}
                  compact={compact}
                  isFocused={drawIsFocused}
                />
              )}
            </div>

            {/* Player card count */}
            <div
              className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border p-1.5 transition-all duration-300 sm:p-2 ${
                playerIsFocused
                  ? "border-cyan-300/60 bg-cyan-400/10 shadow-md shadow-cyan-500/10"
                  : "border-cyan-400/10 bg-cyan-400/[0.02]"
              }`}
            >
              <UserRound
                size={16}
                className={
                  playerIsFocused ? "text-cyan-200" : "text-cyan-300/60"
                }
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

        {/* Player's hand */}
        <div
          className={`rounded-2xl border p-2 transition-all duration-300 sm:p-3 ${
            playerIsFocused
              ? "border-cyan-300/60 bg-gradient-to-br from-cyan-400/[0.10] to-slate-950 shadow-lg shadow-cyan-500/15 ring-2 ring-cyan-300/30"
              : botIsFocused
                ? "border-white/5 bg-slate-950/30 opacity-60"
                : drawIsFocused
                  ? "border-emerald-400/20 bg-slate-950/40"
                  : "border-cyan-400/10 bg-slate-950/50"
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <div className="flex min-w-0 items-center gap-2">
              <UserRound
                size={16}
                className={
                  playerIsFocused ? "text-cyan-200" : "text-slate-400"
                }
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
            isPlayerTurn={playerIsFocused}
            disabled={!playerIsFocused}
            playerName={playerName}
            compact={compact}
          />

          {drawIsFocused && (
            <p className="mt-3 rounded-xl border border-emerald-300/30 bg-emerald-400/[0.07] px-3 py-2 text-center text-xs font-bold text-emerald-200">
              No playable cards. Use the highlighted draw pile above.
            </p>
          )}
        </div>

        {gameIsFinished && (
          <p className="text-center text-xs text-slate-300">
            {message ||
              (winner === "player"
                ? "Well played! You cleared your hand."
                : winner === "bot"
                  ? `${botName} wins this round.`
                  : "The round has ended.")}
          </p>
        )}
      </div>
    </section>
  );
}

export default memo(GameTable);
