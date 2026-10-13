


"use client";

import { memo } from "react";
import {
  Brain,
  CheckCircle2,
  Layers3,
  Sparkles,
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

  /**
   * Identifies who played the card currently being challenged.
   * "player": the bot is answering the player's card.
   * "bot": the player is answering the bot's card.
   */
  questionSource?: "player" | "bot" | null;

  playerName?: string;
  botName?: string;
  compact?: boolean;
  className?: string;
}

const SUBJECT_STYLES: Record<string, string> = {
  MATHS:
    "from-blue-500/20 to-blue-950/80 border-blue-400/40 text-blue-200",
  ENGLISH:
    "from-fuchsia-500/20 to-fuchsia-950/80 border-fuchsia-400/40 text-fuchsia-200",
  BIOLOGY:
    "from-emerald-500/20 to-emerald-950/80 border-emerald-400/40 text-emerald-200",
  CHEMISTRY:
    "from-orange-500/20 to-orange-950/80 border-orange-400/40 text-orange-200",
  PHYSICS:
    "from-cyan-500/20 to-cyan-950/80 border-cyan-400/40 text-cyan-200",
  HISTORY:
    "from-amber-500/20 to-amber-950/80 border-amber-400/40 text-amber-200",
  GENERAL:
    "from-violet-500/20 to-violet-950/80 border-violet-400/40 text-violet-200",
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

function CenterCard({
  card,
  isBeingChallenged = false,
}: {
  card: WhotCard;
  isBeingChallenged?: boolean;
}) {
  const subjectStyle =
    SUBJECT_STYLES[card.subject] ??
    "from-slate-700/30 to-slate-950 border-white/20 text-white";

  return (
    <div
      className={[
        "relative flex min-h-[190px] w-[140px] flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-3",
        "shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition-all duration-300",
        "sm:min-h-[220px] sm:w-[165px] sm:p-4",
        subjectStyle,
        isBeingChallenged
          ? "scale-[1.03] ring-2 ring-cyan-300/70 shadow-[0_0_35px_rgba(34,211,238,0.25)]"
          : "",
      ].join(" ")}
      aria-label={`Center card: ${
        SUBJECT_LABELS[card.subject] ?? card.subject
      }`}
    >
      <div
        className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-white/[0.05] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-2">
        <span className="rounded-md border border-white/15 bg-black/20 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide sm:text-[10px]">
          {card.subject}
        </span>

        <Sparkles
          size={16}
          className="shrink-0 opacity-70"
          aria-hidden="true"
        />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center py-3 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-black/20 sm:h-14 sm:w-14">
          <span
            className="text-2xl font-black sm:text-3xl"
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
          </span>
        </div>

        <p className="line-clamp-4 text-xs font-bold leading-5 text-white sm:text-sm">
          {card.question}
        </p>
      </div>

      <div className="relative border-t border-white/15 pt-2 text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] opacity-70">
          {isBeingChallenged ? "Question challenge" : "Current card"}
        </p>
      </div>
    </div>
  );
}

function BotThinkingCard() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Bot is thinking and selecting an answer"
      className="pointer-events-none absolute left-1/2 top-1 z-20 -translate-x-1/2"
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-4 animate-pulse rounded-full bg-cyan-400/20 blur-2xl" />

        <div className="relative flex h-[88px] w-[62px] animate-bounce flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-400 via-blue-700 to-indigo-950 shadow-[0_0_28px_rgba(34,211,238,0.55)] ring-4 ring-cyan-300/10">
          <div className="absolute inset-1 rounded-lg border border-white/35" />

          <Sparkles
            size={20}
            className="relative text-cyan-100"
            aria-hidden="true"
          />

          <span className="relative mt-1 text-2xl font-black text-white">
            ?
          </span>

          <span className="absolute bottom-1.5 text-[7px] font-black uppercase tracking-[0.18em] text-cyan-100">
            WHOT
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-slate-950/95 px-3 py-1.5 shadow-xl">
          <Brain
            size={13}
            className="text-cyan-300"
            aria-hidden="true"
          />
          <span className="whitespace-nowrap text-[10px] font-bold text-cyan-100">
            Choosing an answer
          </span>
        </div>
      </div>
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
  const canInteract =
    isPlayerTurn &&
    !isQuestionOpen &&
    !isBotAnswering &&
    !isShowingFeedback &&
    !isFinished;

  const showBotThinking =
    isBotAnswering &&
    questionSource === "player" &&
    !isShowingFeedback &&
    !isFinished;

  // Keep the played card highlighted while its question is active,
  // including while the bot is answering the player's question.
  const showPlayedCard =
    (isQuestionOpen || isBotAnswering) &&
    !isShowingFeedback &&
    !isFinished;

  // Use questionSource rather than currentTurn because currentTurn
  // may change while a question is being resolved.
  const playedByLabel =
    questionSource === "player"
      ? `${playerName} played this card`
      : questionSource === "bot"
        ? `${botName} played this card`
        : "";

  return (
    <main
      aria-label="Learnyfi WHOT game table"
      className={`mx-auto w-full max-w-6xl space-y-4 ${className}`}
    >
      <GameStatus
        status={status}
        currentTurn={currentTurn}
        winner={winner}
        message={isShowingFeedback ? "" : message}
        centerSubject={centerCard.subject}
        playerCardCount={playerCards.length}
        botCardCount={botCardCount}
        drawPileCount={drawPileCount}
        timeRemaining={timeRemaining}
        isQuestionOpen={isQuestionOpen}
        compact={compact}
      />

      <div className="relative overflow-hidden rounded-3xl border border-emerald-300/10 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 p-3 shadow-2xl sm:p-5 lg:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 45%, rgba(16,185,129,0.16), transparent 55%)",
          }}
        />

        <div className="relative space-y-5">
          {/* Bot hand and thinking animation */}
          <div className="relative">
            <BotHand
              cardCount={botCardCount}
              botName={botName}
              isActive={
                (isBotTurn || showBotThinking) &&
                !isFinished &&
                !isShowingFeedback
              }
              compact={compact}
            />

            {showBotThinking && <BotThinkingCard />}
          </div>

          {showBotThinking && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/[0.06] px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>

              <p className="text-center text-xs font-semibold text-cyan-100">
                {botName} is answering your card&apos;s question...
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-3 sm:p-5">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-white/10 sm:w-12" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Playing table
              </span>

              <span className="h-px w-8 bg-white/10 sm:w-12" />
            </div>

            {showPlayedCard && playedByLabel && (
              <div className="mb-4 flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[0.08] px-3 py-1.5">
                  {showBotThinking ? (
                    <Brain
                      size={14}
                      className="text-cyan-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <CheckCircle2
                      size={14}
                      className="text-cyan-300"
                      aria-hidden="true"
                    />
                  )}

                  <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-100 sm:text-xs">
                    {playedByLabel}
                  </span>
                </div>

                <p className="text-center text-[11px] text-slate-400">
                  This card stays on the table until the question is resolved.
                </p>
              </div>
            )}

            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-2 sm:gap-4">
              <div className="flex min-w-0 flex-col items-center gap-2">
                <DrawPile
                  cardCount={drawPileCount}
                  onDraw={onDrawCard}
                  isPlayerTurn={canInteract}
                  disabled={!canInteract}
                  isDrawing={isDrawing}
                  compact
                />

                <p className="text-center text-[10px] text-slate-500">
                  Draw pile
                </p>
              </div>

              <div className="flex min-w-0 flex-col items-center gap-3">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/80">
                    {showPlayedCard
                      ? "Card being challenged"
                      : "Match this subject"}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {SUBJECT_LABELS[centerCard.subject] ??
                      centerCard.subject}
                  </p>
                </div>

                <div
                  className={
                    showPlayedCard
                      ? "relative rounded-3xl p-1 transition-all duration-300"
                      : ""
                  }
                >
                  {showPlayedCard && (
                    <div className="pointer-events-none absolute -inset-3 animate-pulse rounded-[2rem] bg-cyan-400/10 blur-xl" />
                  )}

                  <div className="relative">
                    <CenterCard
                      card={centerCard}
                      isBeingChallenged={showPlayedCard}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      showPlayedCard
                        ? "animate-pulse bg-cyan-300"
                        : "bg-emerald-400"
                    }`}
                  />
                  {showPlayedCard ? "Question card" : "Center card"}
                </div>
              </div>

              <div className="flex min-w-0 flex-col items-center gap-2">
                <div className="flex min-h-[124px] w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 p-2 text-center sm:min-h-[150px]">
                  <Layers3
                    size={22}
                    className="mb-2 text-cyan-300"
                    aria-hidden="true"
                  />

                  <span className="text-xl font-black tabular-nums text-white">
                    {playerCards.length}
                  </span>

                  <span className="mt-1 text-[10px] text-slate-400">
                    Your cards
                  </span>
                </div>

                <p className="text-center text-[10px] text-slate-500">
                  {playerName}
                </p>
              </div>
            </div>

            {!isShowingFeedback && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {showBotThinking ? (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
                    Bot is selecting an answer
                  </span>
                ) : isQuestionOpen && questionSource === "bot" ? (
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                    Answer the bot&apos;s question to continue
                  </span>
                ) : isQuestionOpen && questionSource === "player" ? (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
                    Bot is answering your card
                  </span>
                ) : isFinished ? (
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                    Game finished
                  </span>
                ) : isPlayerTurn ? (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
                    Select a matching card or draw one
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
                    {isBotTurn
                      ? "Bot is playing..."
                      : "Waiting for your turn"}
                  </span>
                )}
              </div>
            )}
          </div>

          <PlayerHand
            cards={playerCards}
            playableCardIds={playableCardIds}
            selectedCardInstanceId={selectedCardInstanceId}
            onSelectCard={onSelectCard}
            isPlayerTurn={canInteract}
            disabled={!canInteract}
            playerName={playerName}
            compact={compact}
          />
        </div>
      </div>
    </main>
  );
}

export default memo(GameTable);