





"use client";

import { memo } from "react";
import {
  ArrowDownToLine,
  Brain,
  CheckCircle2,
  Clock3,
  Layers3,
  Sparkles,
  UserRound,
  Wifi,
} from "lucide-react";

import BotHand from "./BotHand";
import DrawPile from "./DrawPile";
import GameStatus from "./GameStatus";
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

interface CenterCardProps {
  card: WhotCard;
  compact?: boolean;
}

function CenterCard({ card, compact = false }: CenterCardProps) {
  const subjectStyle =
    SUBJECT_STYLES[card.subject] ??
    "from-slate-700 via-slate-900 to-slate-950 border-white/20 text-slate-100";

  const subjectLabel =
    SUBJECT_LABELS[card.subject] ?? card.subject;

  const symbol = SUBJECT_SYMBOLS[card.subject] ?? "★";

  const accent =
    SUBJECT_ACCENTS[card.subject] ?? "bg-slate-400";

  return (
    <article
      aria-label={`Center card: ${subjectLabel}`}
      className={`relative mx-auto flex w-full max-w-[190px] flex-col overflow-hidden rounded-2xl border bg-gradient-to-br shadow-[0_16px_45px_rgba(0,0,0,0.3)] transition-all duration-300 ${
        compact
          ? "min-h-[170px] max-w-[155px] p-3 min-[400px]:min-h-[185px] min-[400px]:max-w-[165px]"
          : "min-h-[185px] p-3.5 sm:min-h-[220px] sm:max-w-[180px] sm:p-4"
      } ${subjectStyle}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${accent}`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <span className="rounded-lg border border-white/15 bg-black/20 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white/90 sm:text-[10px]">
          Centre card
        </span>

        <span
          className={`rounded-md px-1.5 py-1 text-[9px] font-extrabold uppercase ${
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

      <div className="flex flex-1 flex-col items-center justify-center py-3 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/20 text-2xl font-black text-white shadow-inner sm:h-14 sm:w-14 sm:text-3xl">
          {symbol}
        </div>

        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/70 sm:text-[11px]">
          {subjectLabel}
        </p>

        <h3 className="mt-2 line-clamp-4 break-words text-sm font-extrabold leading-5 text-white sm:text-base sm:leading-6">
          {card.question}
        </h3>
      </div>

      <div className="mt-auto border-t border-white/15 pt-2">
        <div className="flex items-center justify-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${accent}`} />
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/65">
            Match the subject
          </span>
        </div>
      </div>
    </article>
  );
}

interface BotThinkingCardProps {
  compact?: boolean;
}

function BotThinkingCard({
  compact = false,
}: BotThinkingCardProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mx-auto flex w-full max-w-[190px] flex-col items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-violet-950/70 to-slate-950 px-3 text-center ${
        compact ? "min-h-[170px] max-w-[155px]" : "min-h-[185px] sm:min-h-[220px]"
      }`}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-200">
        <Brain size={25} aria-hidden="true" />
      </div>

      <p className="text-sm font-extrabold text-white">
        Bot is thinking
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Choosing an answer…
      </p>

      <div className="mt-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-300" />
      </div>
    </div>
  );
}

interface CenterTurnMessageProps {
  message?: string;
  currentTurn: WhotPlayerId;
  isPlayerTurn: boolean;
  isBotTurn: boolean;
  isQuestionOpen: boolean;
  isBotAnswering: boolean;
  isShowingFeedback: boolean;
  isFinished: boolean;
  isDrawing: boolean;
}

function CenterTurnMessage({
  message,
  currentTurn,
  isPlayerTurn,
  isBotTurn,
  isQuestionOpen,
  isBotAnswering,
  isShowingFeedback,
  isFinished,
  isDrawing,
}: CenterTurnMessageProps) {
  const text = message?.trim() ?? "";

  if (
    isQuestionOpen ||
    isBotAnswering ||
    isShowingFeedback ||
    isFinished
  ) {
    return null;
  }

  const lower = text.toLowerCase();

  const isDrawMessage =
    lower.includes("draw") ||
    lower.includes("drew") ||
    lower.includes("no matching card");

  const isBotDrawMessage =
    isDrawMessage &&
    (lower.includes("bot") || lower.includes("computer"));

  const isPlayerDrawMessage =
    isDrawMessage &&
    (lower.includes("you") || lower.includes("player"));

  const isPlayerActive =
    isPlayerTurn || (!isBotTurn && currentTurn === "player");

  const isBotActive =
    isBotTurn || (!isPlayerTurn && currentTurn === "bot");

  const isPlayerMessage =
    isPlayerDrawMessage ||
    (!isBotDrawMessage && isPlayerActive);

  const heading = isFinished
    ? "Game complete"
    : isDrawing
      ? "Drawing card"
      : isDrawMessage
        ? "Card draw"
        : isPlayerActive
          ? "Your turn"
          : "Bot's turn";

  const description =
    text ||
    (isDrawing
      ? "Taking a card from the draw pile…"
      : isPlayerActive
        ? "Choose a playable card or draw a card."
        : "The bot is preparing its move.");

  const playerStyle =
    "border-cyan-400/35 bg-gradient-to-r from-cyan-500/10 to-blue-500/[0.06]";

  const botStyle =
    "border-amber-400/35 bg-gradient-to-r from-amber-500/10 to-violet-500/[0.06]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mx-auto mt-3 w-full max-w-md rounded-xl border px-3 py-3 text-center shadow-lg sm:px-4 ${
        isDrawMessage
          ? "border-emerald-400/35 bg-emerald-500/[0.07]"
          : isPlayerMessage
            ? playerStyle
            : botStyle
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {isDrawMessage ? (
          <ArrowDownToLine
            size={16}
            className="shrink-0 text-emerald-300"
            aria-hidden="true"
          />
        ) : isPlayerMessage ? (
          <UserRound
            size={16}
            className="shrink-0 text-cyan-300"
            aria-hidden="true"
          />
        ) : (
          <Brain
            size={16}
            className="shrink-0 text-amber-300"
            aria-hidden="true"
          />
        )}

        <p
          className={`text-xs font-extrabold sm:text-sm ${
            isDrawMessage
              ? "text-emerald-200"
              : isPlayerMessage
                ? "text-cyan-100"
                : "text-amber-100"
          }`}
        >
          {heading}
        </p>

        {isDrawing && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
        )}
      </div>

      <p className="mt-1.5 break-words text-xs leading-5 text-slate-300 sm:text-sm">
        {description}
      </p>
    </div>
  );
}

interface DrawPilePanelProps {
  count: number;
  disabled: boolean;
  isDrawing: boolean;
  onDrawCard: () => void;
  compact?: boolean;
}

function DrawPilePanel({
  count,
  disabled,
  isDrawing,
  onDrawCard,
  compact = false,
}: DrawPilePanelProps) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 sm:text-xs">
        <Layers3 size={14} aria-hidden="true" />
        <span>Draw pile</span>
      </div>

     <div className="flex min-h-[90px] w-full items-center justify-center sm:min-h-[115px]">
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

      <span className="text-[10px] text-slate-500">
        {Math.max(0, count)} remaining
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

  const canDraw =
    status === "PLAYING" &&
    isPlayerTurn &&
    !isQuestionOpen &&
    !isShowingFeedback &&
    !isBotAnswering &&
    !gameIsFinished &&
    !isDrawing;

  const showTimer =
    typeof timeRemaining === "number" &&
    Number.isFinite(timeRemaining) &&
    timeRemaining >= 0 &&
    isQuestionOpen;

  const activePlayer =
    questionSource === "player"
      ? playerName
      : questionSource === "bot"
        ? botName
        : currentTurn === "player"
          ? playerName
          : botName;

  return (
    <main
      className={`mx-auto w-full min-w-0 max-w-7xl space-y-3 overflow-x-clip text-white sm:space-y-4 ${className}`}
    >
      
<GameStatus
  status={status}
  currentTurn={currentTurn}
  winner={winner}
  message={message}
  centerSubject={centerCard.subject}
  playerCardCount={playerCards.length}
  botCardCount={botCardCount}
  drawPileCount={drawPileCount}
  timeRemaining={timeRemaining}
  isQuestionOpen={isQuestionOpen}
  compact={compact}
/>


      <section className="relative min-w-0 overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-950 p-2.5 shadow-2xl sm:rounded-3xl sm:p-4 md:p-5">
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-emerald-300/[0.07] sm:inset-3 sm:rounded-2xl" />

        <div className="relative space-y-3 sm:space-y-4">
          <BotHand
            cardCount={botCardCount}
            botName={botName}
            isActive={
              isBotTurn ||
              (isBotAnswering && questionSource === "bot")
            }
            compact={compact}
          />

          {isBotAnswering && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2 text-xs font-semibold text-amber-200">
              <Brain size={15} aria-hidden="true" />
              <span>{botName} is answering the question</span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
            </div>
          )}

          {showTimer && (
            <div
              role="timer"
              aria-live="off"
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 ${
                timeRemaining !== null && timeRemaining <= 5
                  ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                  : "border-cyan-400/25 bg-cyan-400/[0.05] text-cyan-100"
              }`}
            >
              <Clock3 size={16} aria-hidden="true" />
              <span className="text-xs font-bold sm:text-sm">
                {activePlayer} has
              </span>
              <span className="text-lg font-black tabular-nums">
                {Math.ceil(timeRemaining as number)}s
              </span>
              {timeRemaining !== null && timeRemaining <= 5 && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider">
                  Hurry!
                </span>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-2.5 sm:p-4">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Sparkles
                size={15}
                className="text-emerald-300"
                aria-hidden="true"
              />
              <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/80 sm:text-xs">
                Play area
              </h2>
              <Sparkles
                size={15}
                className="text-emerald-300"
                aria-hidden="true"
              />
            </div>

            <div className="grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_minmax(0,0.8fr)] items-center gap-1.5 min-[400px]:gap-3 sm:gap-5">
              <DrawPilePanel
                count={drawPileCount}
                disabled={!canDraw}
                isDrawing={isDrawing}
                onDrawCard={onDrawCard}
                compact={compact}
              />

              <div className="min-w-0">
                {isBotAnswering ? (
                  <BotThinkingCard compact={compact} />
                ) : (
                  <CenterCard
                    card={centerCard}
                    compact={compact}
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 min-[400px]:text-[10px] sm:text-xs">
                  <UserRound
                    size={13}
                    className="text-cyan-300"
                    aria-hidden="true"
                  />
                  <span className="truncate">Your cards</span>
                </div>

                <div className="flex min-h-[90px] w-full flex-col items-center justify-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.08] to-blue-500/[0.04] p-2 sm:min-h-[115px] sm:p-3">
                  <span className="text-2xl font-black tabular-nums text-cyan-100 sm:text-3xl">
                    {playerCards.length}
                  </span>
                  <span className="mt-1 text-center text-[9px] text-slate-400 sm:text-[10px]">
                    {playerCards.length === 1 ? "card left" : "cards left"}
                  </span>

                  {isPlayerTurn && !gameIsFinished && (
                    <span className="mt-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wider text-cyan-200 sm:text-[9px]">
                      Your turn
                    </span>
                  )}
                </div>
              </div>
            </div>

            <CenterTurnMessage
              message={message}
              currentTurn={currentTurn}
              isPlayerTurn={isPlayerTurn}
              isBotTurn={isBotTurn}
              isQuestionOpen={isQuestionOpen}
              isBotAnswering={isBotAnswering}
              isShowingFeedback={isShowingFeedback}
              isFinished={gameIsFinished}
              isDrawing={isDrawing}
            />
          </div>

          {status === "PLAYING" &&
            !isQuestionOpen &&
            !isShowingFeedback &&
            !isBotAnswering &&
            !gameIsFinished && (
              <div className="flex items-start gap-2 rounded-xl border border-white/[0.07] bg-slate-950/50 px-3 py-2.5 text-[11px] leading-5 text-slate-400 sm:text-xs">
                {isPlayerTurn ? (
                  <>
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-cyan-300"
                      aria-hidden="true"
                    />
                    <p>
                      Select a highlighted card that matches the centre
                      subject, or use the draw pile when you have no
                      playable card.
                    </p>
                  </>
                ) : (
                  <>
                    <Wifi
                      size={15}
                      className="mt-0.5 shrink-0 text-amber-300"
                      aria-hidden="true"
                    />
                    <p>
                      {botName} is the active opponent. Watch the centre
                      card for the next question.
                    </p>
                  </>
                )}
              </div>
            )}

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

          {gameIsFinished && (
            <div
              role="status"
              className={`rounded-xl border px-4 py-3 text-center ${
                winner === "player"
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : winner === "bot"
                    ? "border-amber-400/40 bg-amber-500/10"
                    : "border-white/10 bg-slate-900/70"
              }`}
            >
              <p className="text-sm font-extrabold text-white">
                {winner === "player"
                  ? "You won!"
                  : winner === "bot"
                    ? `${botName} won this round`
                    : "Game finished"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {winner === "player"
                  ? "Well played! You cleared your hand."
                  : winner === "bot"
                    ? "Try again and see if you can win the next round."
                    : "This round has ended."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default memo(GameTable);
