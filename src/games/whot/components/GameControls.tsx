





"use client";

import {
  ArrowLeft,
  CircleHelp,
  CirclePlay,
  Hand,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { memo } from "react";

export interface GameControlsProps {
  isReady?: boolean;
  isPlaying?: boolean;
  isPlayerTurn?: boolean;
  isQuestionOpen?: boolean;
  isFinished?: boolean;
  isDrawing?: boolean;
  canDraw?: boolean;
  drawPileCount?: number;
  onStart?: () => void;
  onDrawCard?: () => void;
  onRestart?: () => void;
  onExit?: () => void;
  onShowRules?: () => void;
  showRestart?: boolean;
  showExit?: boolean;
  showRules?: boolean;
  compact?: boolean;
  className?: string;
}

function GameControlsComponent({
  isReady = false,
  isPlaying = false,
  isPlayerTurn = false,
  isQuestionOpen = false,
  isFinished = false,
  isDrawing = false,
  canDraw = true,
  drawPileCount = 0,
  onStart,
  onDrawCard,
  onRestart,
  onExit,
  onShowRules,
  showRestart = true,
  showExit = true,
  showRules = true,
  compact = false,
  className = "",
}: GameControlsProps) {
  const canInteract =
    isPlaying &&
    isPlayerTurn &&
    !isQuestionOpen &&
    !isFinished;

  const drawDisabled =
    !canInteract ||
    !canDraw ||
    isDrawing ||
    drawPileCount <= 0 ||
    !onDrawCard;

  const showStart = isReady && !isPlaying && !isFinished;

  const buttonBase =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section
      aria-label="Game controls"
      className={`rounded-2xl border border-white/10 bg-slate-900/80 ${
        compact ? "p-3" : "p-4 sm:p-5"
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white sm:text-base">
            Game controls
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
            {isFinished
              ? "Game complete. Start another round whenever you're ready."
              : isQuestionOpen
                ? "Answer the question to resolve your selected card."
                : !isPlaying
                  ? "Start a game to begin playing."
                  : !isPlayerTurn
                    ? "Wait for the bot to finish its turn."
                    : drawPileCount <= 0
                      ? "The draw pile is empty. Play a matching card if possible."
                      : "Play a matching card or draw one from the market."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showStart && onStart && (
            <button
              type="button"
              onClick={onStart}
              className={`${buttonBase} bg-cyan-400 text-slate-950 hover:bg-cyan-300`}
            >
              <CirclePlay className="h-4 w-4" />
              Start game
            </button>
          )}

          {isFinished && onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className={`${buttonBase} bg-cyan-400 text-slate-950 hover:bg-cyan-300`}
            >
              <RotateCcw className="h-4 w-4" />
              Play again
            </button>
          )}

          {isPlaying && !isFinished && (
            <button
              type="button"
              onClick={onDrawCard}
              disabled={drawDisabled}
              className={`${buttonBase} border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20`}
            >
              {isDrawing ? (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200/30 border-t-cyan-200"
                />
              ) : (
                <Hand className="h-4 w-4" />
              )}

              {isDrawing ? "Drawing..." : "Draw card"}

              {drawPileCount > 0 && (
                <span className="rounded-md bg-slate-950/50 px-1.5 py-0.5 text-xs tabular-nums">
                  {drawPileCount}
                </span>
              )}
            </button>
          )}

          {showRestart && isPlaying && !isFinished && onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className={`${buttonBase} border border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700`}
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </button>
          )}

          {showRules && onShowRules && (
            <button
              type="button"
              onClick={onShowRules}
              className={`${buttonBase} border border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white`}
            >
              <CircleHelp className="h-4 w-4" />
              Rules
            </button>
          )}

          {showExit && onExit && (
            <button
              type="button"
              onClick={onExit}
              className={`${buttonBase} border border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white`}
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </button>
          )}
        </div>
      </div>

      {isPlaying && !isFinished && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/5 bg-slate-950/60 px-3 py-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

          <p className="text-xs leading-5 text-slate-400">
            {isQuestionOpen
              ? "Choose the best answer before the countdown ends. An incorrect answer or timeout incurs the configured card penalty."
              : isPlayerTurn
                ? "Choose a card that matches the centre card's subject. If you cannot play, draw from the market when available."
                : "The bot is playing its turn. Your controls will become available again when it finishes."}
          </p>
        </div>
      )}
    </section>
  );
}

const GameControls = memo(GameControlsComponent);

GameControls.displayName = "GameControls";

export default GameControls;
