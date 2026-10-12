




"use client";

import {
  ArrowLeft,
  BookOpen,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useMemo } from "react";

import GameResultModal from "./GameResultModal";
import GameTable from "./GameTable";
import QuestionModal from "./QuestionModal";

import { useWhotGame } from "../hook/useWhotGame";
import {
  getPlayableCards,
  getSelectedQuestion,
} from "../lib/game-engine";
import type { WhotEngineState } from "../lib/game-engine";
import type { WhotPlayerId } from "../types/whot";

export interface WhotGameProps {
  playerName?: string;
  botName?: string;
  autoStart?: boolean;
  botDelay?: number;
  questionTimeLimit?: number;
  onExit?: () => void;
  className?: string;
}

function WhotGameComponent({
  playerName = "You",
  botName = "Learnyfi Bot",
  autoStart = true,
  botDelay = 900,
  questionTimeLimit = 15,
  onExit,
  className = "",
}: WhotGameProps) {
  const game = useWhotGame({
    autoStart,
    botDelay,
    config: {
      initialHandSize: 6,
      questionTimeLimit,
      wrongAnswerPenalty: 2,
      drawOnNoMatch: 1,
      copiesPerQuestion: 2,
    },
  });

  const state = game.state as WhotEngineState;

  const selectedQuestion = useMemo(
    () => getSelectedQuestion(state),
    [state],
  );

  const playableCards = useMemo(
    () => getPlayableCards(state, "player"),
    [state],
  );

  const playableCardIds = useMemo(
    () => playableCards.map((card) => card.instanceId),
    [playableCards],
  );

  const handleSelectCard = useCallback(
    (instanceId: string) => {
      if (!game.isPlayerTurn || game.isQuestionOpen) return;
      game.selectCard(instanceId);
    },
    [game],
  );

  const handleDrawCard = useCallback(() => {
    if (!game.isPlayerTurn || game.isQuestionOpen) return;
    game.drawCard();
  }, [game]);

  const handlePlayAgain = useCallback(() => {
    game.restartGame();
  }, [game]);

  const handleExit = useCallback(() => {
    if (onExit) {
      onExit();
    }
  }, [onExit]);

  const handleQuestionTimeout = useCallback(() => {
    game.dispatch({ type: "QUESTION_TIMEOUT" });
  }, [game]);

  const winner: WhotPlayerId | null = state.winner;

  const resultStats = useMemo(() => {
    const totalAnswers =
      state.correctAnswers + state.incorrectAnswers;

    const accuracy =
      totalAnswers > 0
        ? Math.round((state.correctAnswers / totalAnswers) * 100)
        : 0;

    return {
      correctAnswers: state.correctAnswers,
      incorrectAnswers: state.incorrectAnswers,
      accuracy,
      cardsPlayed: state.correctAnswers,
    };
  }, [
    state.correctAnswers,
    state.incorrectAnswers,
  ]);

  return (
    <main
      className={`min-h-screen bg-slate-950 text-white ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {onExit ? (
              <button
                type="button"
                onClick={handleExit}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="Exit WHOT game"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <Link
                href="/student/games"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="Back to games"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <BookOpen className="h-6 w-6 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl">
                Learnyfi <span className="text-cyan-300">WHOT</span>
              </h1>
              <p className="text-xs text-slate-400 sm:text-sm">
                Play your card. Answer correctly. Win the game.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-200 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Learn while you play</span>
          </div>
        </header>

        {!game.isReady && !game.isPlaying && (
          <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
              <Trophy className="h-8 w-8 text-cyan-300" />
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Ready to play?
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Match the subject on the centre card, answer the
              question correctly, and clear your hand before the bot.
            </p>

            <button
              type="button"
              onClick={game.startGame}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 font-extrabold text-slate-950 transition hover:bg-cyan-300"
            >
              <Sparkles className="h-5 w-5" />
              Start game
            </button>
          </section>
        )}

        {game.isReady && !game.isPlaying && (
          <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-xl sm:p-10">
            <h2 className="text-2xl font-black">
              Your game is ready
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Start the game when you are ready to challenge the bot.
            </p>
            <button
              type="button"
              onClick={game.startGame}
              className="mt-6 rounded-xl bg-cyan-400 px-7 py-3 font-extrabold text-slate-950 transition hover:bg-cyan-300"
            >
              Start playing
            </button>
          </section>
        )}

        {game.isPlaying && (
          <>
            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Correct answers
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-300">
                  {state.correctAnswers}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Incorrect answers
                </p>
                <p className="mt-2 text-2xl font-black text-rose-300">
                  {state.incorrectAnswers}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Cards remaining
                </p>
                <p className="mt-2 text-2xl font-black text-cyan-300">
                  {state.player.hand.length}
                </p>
              </div>
            </section>

            <GameTable
              status={state.status}
              currentTurn={state.currentTurn}
              winner={state.winner}
              message={state.message}
              playerCards={state.player.hand}
              botCardCount={state.bot.hand.length}
              drawPileCount={state.drawPile.length}
              centerCard={state.centerCard}
              playableCardIds={playableCardIds}
              selectedCardInstanceId={state.selectedCardInstanceId}
              onSelectCard={handleSelectCard}
              onDrawCard={handleDrawCard}
              isPlayerTurn={game.isPlayerTurn}
              isBotTurn={game.isBotTurn}
              isQuestionOpen={game.isQuestionOpen}
              isFinished={game.isFinished}
              timeRemaining={game.timeRemaining}
              playerName={playerName}
              botName={botName}
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm leading-6 text-slate-400">
                {game.isPlayerTurn
                  ? "Select a playable card or draw from the market."
                  : "The bot is taking its turn. Get ready!"}
              </p>

              <button
                type="button"
                onClick={game.restartGame}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                <RotateCcw className="h-4 w-4" />
                Restart
              </button>
            </div>
          </>
        )}
      </div>

      <QuestionModal
        isOpen={game.isQuestionOpen}
        card={selectedQuestion}
        timeRemaining={game.timeRemaining}
        onSubmitAnswer={game.submitAnswer}
        onTimeout={handleQuestionTimeout}
      />

      <GameResultModal
        isOpen={game.isFinished}
        result={winner === "player" ? "WIN" : "LOSS"}
        playerName={playerName}
        stats={resultStats}
        onPlayAgain={handlePlayAgain}
        onExit={onExit ? handleExit : undefined}
      />
    </main>
  );
}

const WhotGame = memo(WhotGameComponent);

WhotGame.displayName = "WhotGame";

export default WhotGame;
