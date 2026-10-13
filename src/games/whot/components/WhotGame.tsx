
"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import GameResultModal from "./GameResultModal";
import GameTable from "./GameTable";
import QuestionModal from "./QuestionModal";

import { useWhotGame } from "../hook/useWhotGame";
import {
  getPlayableCards,
  getSelectedQuestion,
} from "../lib/game-engine";
import type {
  WhotAnswerFeedback,
  WhotEngineState,
} from "../lib/game-engine";
import type { WhotCard, WhotPlayerId } from "../types/whot";

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
    botResponseDelay: 6000,
    config: {
      initialHandSize: 6,
      questionTimeLimit,
      wrongAnswerPenalty: 2,
      drawOnNoMatch: 1,
      copiesPerQuestion: 2,
    },
  });

  const state = game.state as WhotEngineState;

  const [lastQuestionCard, setLastQuestionCard] =
    useState<WhotCard | null>(null);

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

  const answerFeedback: WhotAnswerFeedback | null =
    state.answerFeedback;

  // Keep feedback on screen until Continue is pressed.
  const isShowingFeedback =
    answerFeedback !== null && !game.isFinished;

  const isPlayerAnswering =
    game.isQuestionOpen &&
    state.activeQuestionCard !== null &&
    state.questionSource === "bot" &&
    answerFeedback === null;

  const isBotAnswering =
    game.isQuestionOpen &&
    state.activeQuestionCard !== null &&
    state.questionSource === "player" &&
    answerFeedback === null;

  const questionCard =
    state.activeQuestionCard ??
    selectedQuestion ??
    lastQuestionCard;

  useEffect(() => {
    if (state.activeQuestionCard) {
      setLastQuestionCard(state.activeQuestionCard);
    } else if (selectedQuestion) {
      setLastQuestionCard(selectedQuestion);
    }
  }, [state.activeQuestionCard, selectedQuestion]);

  const handleSelectCard = useCallback(
    (instanceId: string) => {
      if (
        !game.isPlayerTurn ||
        game.isQuestionOpen ||
        state.answerFeedback !== null ||
        game.isFinished
      ) {
        return;
      }

      game.selectCard(instanceId);
    },
    [game, state.answerFeedback],
  );

  const handleDrawCard = useCallback(() => {
    if (
      !game.isPlayerTurn ||
      game.isQuestionOpen ||
      state.answerFeedback !== null ||
      game.isFinished
    ) {
      return;
    }

    game.drawCard();
  }, [game, state.answerFeedback]);

  const handleContinue = useCallback(() => {
    if (state.answerFeedback === null || game.isFinished) {
      return;
    }

    game.continueAfterFeedback();
  }, [game, state.answerFeedback]);

  const handlePlayAgain = useCallback(() => {
    setLastQuestionCard(null);
    game.restartGame();
  }, [game]);

  const handleExit = useCallback(() => {
    onExit?.();
  }, [onExit]);

  const winner: WhotPlayerId | null = state.winner;

  const correctOption =
    questionCard && answerFeedback
      ? questionCard.options[answerFeedback.correctAnswerIndex]
      : undefined;

  const pointRecipient =
    answerFeedback?.source === "bot"
      ? answerFeedback.correct
        ? playerName
        : botName
      : answerFeedback?.correct
        ? botName
        : playerName;

  const cardRecipient =
    answerFeedback?.source === "bot"
      ? answerFeedback.correct
        ? playerName
        : botName
      : answerFeedback?.correct
        ? botName
        : playerName;

  const resultStats = useMemo(() => {
    const totalAnswers =
      state.correctAnswers + state.incorrectAnswers;

    const accuracy =
      totalAnswers > 0
        ? Math.round(
            (state.correctAnswers / totalAnswers) * 100,
          )
        : 0;

    return {
      correctAnswers: state.correctAnswers,
      incorrectAnswers: state.incorrectAnswers,
      accuracy,
      cardsPlayed: state.turnsPlayed,
    };
  }, [
    state.correctAnswers,
    state.incorrectAnswers,
    state.turnsPlayed,
  ]);

  return (
    <main
      className={`min-h-screen bg-slate-950 text-white ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
        {!isShowingFeedback && (
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
        )}

        {game.isReady && !game.isPlaying && !game.isFinished && (
          <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
              <Trophy className="h-8 w-8 text-cyan-300" />
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Ready to play?
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Match the subject on the centre card, answer
              questions, earn points, and clear your hand
              before the bot.
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

        {game.isPlaying && !isShowingFeedback && (
          <>
            {/* Score cards */}
            <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-cyan-400/20 bg-slate-900 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Your points
                </p>
                <p className="mt-2 text-2xl font-black text-cyan-300">
                  {state.playerScore}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-slate-900 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Bot points
                </p>
                <p className="mt-2 text-2xl font-black text-amber-300">
                  {state.botScore}
                </p>
              </div>

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
                  Your cards
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {state.player.hand.length}
                </p>
              </div>
            </section>

            {/* Bot thinking status */}
            {isBotAnswering && (
              <section
                aria-live="polite"
                className="mb-5 flex items-center gap-4 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4 sm:p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-cyan-100">
                    {botName} is thinking…
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    The bot is answering the question attached to
                    your card. The result will appear when its answer
                    has been checked.
                  </p>

                  {questionCard && (
                    <p className="mt-2 text-xs font-semibold text-cyan-200/80">
                      {questionCard.subject} · {questionCard.difficulty}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Game table */}
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
              isBotAnswering={isBotAnswering}
              isQuestionOpen={game.isQuestionOpen}
              isShowingFeedback={false}
              isFinished={game.isFinished}
              timeRemaining={game.timeRemaining}
              playerName={playerName}
              botName={botName}
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm leading-6 text-slate-400">
                {isPlayerAnswering
                  ? `${botName} has played a card. Answer its question before continuing.`
                  : isBotAnswering
                    ? `${botName} is answering your card's question automatically.`
                    : game.isQuestionOpen
                      ? "The question is being resolved."
                      : game.isPlayerTurn
                        ? "Select a playable card or draw from the market."
                        : "The bot is preparing its next move."}
              </p>

              <button
                type="button"
                onClick={handlePlayAgain}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                <RotateCcw className="h-4 w-4" />
                Restart
              </button>
            </div>
          </>
        )}
      </div>

      {/* Full-screen centred feedback view.
          The game layout is hidden until Continue is pressed. */}
      {isShowingFeedback && answerFeedback && (
        <section
          aria-live="polite"
          aria-labelledby="whot-feedback-title"
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/95 p-3 backdrop-blur-md sm:p-6"
        >
          <div className="my-auto flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
            {/* Feedback header */}
            <div
              className={`shrink-0 border-b px-5 py-5 sm:px-7 ${
                answerFeedback.correct
                  ? "border-emerald-400/20 bg-emerald-400/10"
                  : "border-rose-400/20 bg-rose-400/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    answerFeedback.correct
                      ? "bg-emerald-400/15"
                      : "bg-rose-400/15"
                  }`}
                >
                  {answerFeedback.correct ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                  ) : (
                    <XCircle className="h-8 w-8 text-rose-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    WHOT answer result
                  </p>
                  <h2
                    id="whot-feedback-title"
                    className={`mt-1 text-2xl font-black sm:text-3xl ${
                      answerFeedback.correct
                        ? "text-emerald-200"
                        : "text-rose-200"
                    }`}
                  >
                    {answerFeedback.correct
                      ? "Correct!"
                      : "Incorrect answer"}
                  </h2>
                </div>
              </div>
            </div>

            {/* Scroll only this inner area on short screens */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Points awarded
                </p>
                <p
                  className={`mt-2 text-4xl font-black tabular-nums sm:text-5xl ${
                    answerFeedback.pointsAwarded > 0
                      ? "text-cyan-300"
                      : "text-slate-400"
                  }`}
                >
                  {answerFeedback.pointsAwarded > 0 ? "+" : ""}
                  {answerFeedback.pointsAwarded}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-300">
                  {pointRecipient}{" "}
                  {answerFeedback.pointsAwarded > 0
                    ? "gets these points"
                    : "receives no points"}
                </p>
              </div>

              {!answerFeedback.correct && (
                <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3">
                  <p className="text-sm leading-6 text-rose-100">
                    The card/penalty outcome is assigned to{" "}
                    <strong>{cardRecipient}</strong> according to
                    the game rules.
                  </p>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Correct answer
                </p>
                <p className="mt-2 text-base font-extrabold leading-6 text-white sm:text-lg">
                  {correctOption ?? "Answer unavailable"}
                </p>
              </div>

              {questionCard && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                    {questionCard.subject}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                    {questionCard.difficulty}
                  </span>
                </div>
              )}

              {answerFeedback.explanation && (
                <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Explanation
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {answerFeedback.explanation}
                  </p>
                </div>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Your score and any penalty cards are managed by the
                game engine.
              </p>
            </div>

            {/* Always-visible Continue footer */}
            <div className="shrink-0 border-t border-white/10 bg-slate-900 px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={handleContinue}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                Review the result, then continue your game.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Shared question modal for both turns */}
      <QuestionModal
        isOpen={
          !game.isFinished &&
          !isShowingFeedback &&
          (isPlayerAnswering || isBotAnswering)
        }
        card={
          isPlayerAnswering || isBotAnswering
            ? questionCard
            : null
        }
        timeRemaining={game.timeRemaining}
        questionSource={state.questionSource}
        onSubmitAnswer={game.submitAnswer}
        disabled={
          isBotAnswering ||
          isShowingFeedback ||
          game.isFinished
        }
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
