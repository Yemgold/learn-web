
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
import { memo, useCallback, useEffect, useMemo, useState } from "react";

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

  const cardRecipient = pointRecipient;

  const resultStats = useMemo(() => {
    const totalAnswers =
      state.correctAnswers + state.incorrectAnswers;

    return {
      correctAnswers: state.correctAnswers,
      incorrectAnswers: state.incorrectAnswers,
      accuracy:
        totalAnswers > 0
          ? Math.round((state.correctAnswers / totalAnswers) * 100)
          : 0,
      cardsPlayed: state.turnsPlayed,
    };
  }, [
    state.correctAnswers,
    state.incorrectAnswers,
    state.turnsPlayed,
  ]);

  return (
    <main
      className={`min-h-[100svh] overflow-x-clip bg-slate-950 text-white ${className}`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-3 pb-6 pt-3 sm:px-5 sm:pb-10 sm:pt-5 lg:px-8">
        {/* Header */}
        {!isShowingFeedback && (
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              {onExit ? (
                <button
                  type="button"
                  onClick={handleExit}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  aria-label="Exit WHOT game"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  href="/student/games"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  aria-label="Back to games"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              )}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 sm:h-12 sm:w-12 sm:rounded-2xl">
                <BookOpen className="h-5 w-5 text-cyan-300 sm:h-6 sm:w-6" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-black tracking-tight sm:text-2xl">
                  Learnyfi <span className="text-cyan-300">WHOT</span>
                </h1>
                <p className="hidden text-xs text-slate-400 sm:block sm:text-sm">
                  Play your card. Answer correctly. Win the game.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-2 text-[10px] font-bold text-amber-200 sm:gap-2 sm:px-3 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span>Learn while you play</span>
            </div>
          </header>
        )}

        {/* Ready screen */}
        {game.isReady && !game.isPlaying && !game.isFinished && (
          <section className="mx-auto flex min-h-[65svh] max-w-xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 px-5 py-10 text-center shadow-2xl sm:px-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Trophy className="h-8 w-8 text-cyan-300" />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-300">
              Learnyfi Games
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to play?
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
              Match the subject on the centre card, answer questions,
              earn points, and clear your hand before the bot.
            </p>

            <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-3">
                <p className="text-xs font-semibold text-cyan-200">
                  Your opponent
                </p>
                <p className="mt-1 truncate font-extrabold">{botName}</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3">
                <p className="text-xs font-semibold text-emerald-200">
                  Starting hand
                </p>
                <p className="mt-1 font-extrabold">6 cards</p>
              </div>
            </div>

            <button
              type="button"
              onClick={game.startGame}
              className="mt-7 inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Sparkles className="h-5 w-5" />
              Start game
            </button>
          </section>
        )}

        {/* Active game */}
        {game.isPlaying && !isShowingFeedback && (
          <>
            {/* Scores */}
            <section
              aria-label="Game scores"
              className="mb-4 grid grid-cols-2 gap-2.5 sm:mb-5 sm:grid-cols-4 sm:gap-3"
            >
              <ScoreCard
                label={`${playerName}'s points`}
                value={state.playerScore}
                accent="cyan"
                icon={<Trophy className="h-4 w-4" />}
              />

              <ScoreCard
                label={`${botName}'s points`}
                value={state.botScore}
                accent="amber"
                icon={<Sparkles className="h-4 w-4" />}
              />

              <ScoreCard
                label="Correct answers"
                value={state.correctAnswers}
                accent="emerald"
                icon={<CheckCircle2 className="h-4 w-4" />}
              />

              <ScoreCard
                label="Cards in your hand"
                value={state.player.hand.length}
                accent="violet"
                icon={<BookOpen className="h-4 w-4" />}
              />
            </section>

            {/* Bot thinking */}
            {isBotAnswering && (
              <section
                aria-live="polite"
                className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-3.5 sm:mb-5 sm:gap-4 sm:p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 sm:h-12 sm:w-12">
                  <Loader2 className="h-5 w-5 animate-spin text-amber-300 sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-amber-100">
                    {botName} is thinking…
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-slate-300 sm:leading-6">
                    The bot is answering the question attached to your
                    card. The result will appear when its answer has
                    been checked.
                  </p>

                  {questionCard && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-200">
                        {questionCard.subject}
                      </span>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                        {questionCard.difficulty}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Main game table */}
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
              compact
            />

            {/* Turn guidance and restart */}
            <section className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
              <div className="flex min-w-0 items-start gap-2.5">
                <div
                  className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                    isPlayerAnswering
                      ? "bg-cyan-300"
                      : isBotAnswering
                        ? "animate-pulse bg-amber-300"
                        : game.isPlayerTurn
                          ? "bg-emerald-300"
                          : "bg-amber-300"
                  }`}
                />

                <p
                  aria-live="polite"
                  className="text-sm leading-5 text-slate-300 sm:leading-6"
                >
                  {isPlayerAnswering
                    ? `${botName} has played a card. Answer its question to continue.`
                    : isBotAnswering
                      ? `${botName} is answering your card's question.`
                      : game.isQuestionOpen
                        ? "The question is being resolved."
                        : game.isPlayerTurn
                          ? "Your turn: select a playable card or draw from the pile."
                          : `${botName} is preparing the next move.`}
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlayAgain}
                className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Restart game
              </button>
            </section>
          </>
        )}
      </div>

      {/* Answer feedback */}
      {isShowingFeedback && answerFeedback && (
        <section
          aria-live="polite"
          aria-labelledby="whot-feedback-title"
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-950/95 p-2.5 backdrop-blur-md sm:p-5"
        >
          <div className="my-auto flex max-h-[96svh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50 sm:rounded-3xl">
            {/* Feedback heading */}
            <div
              className={`shrink-0 border-b px-4 py-4 sm:px-7 sm:py-5 ${
                answerFeedback.correct
                  ? "border-emerald-400/20 bg-emerald-400/10"
                  : "border-rose-400/20 bg-rose-400/10"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${
                    answerFeedback.correct
                      ? "bg-emerald-400/15"
                      : "bg-rose-400/15"
                  }`}
                >
                  {answerFeedback.correct ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-300 sm:h-8 sm:w-8" />
                  ) : (
                    <XCircle className="h-6 w-6 text-rose-300 sm:h-8 sm:w-8" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                    WHOT answer result
                  </p>
                  <h2
                    id="whot-feedback-title"
                    className={`mt-1 text-xl font-black sm:text-3xl ${
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

            {/* Scrollable feedback content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-7 sm:py-5">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                  Points awarded
                </p>
                <p
                  className={`mt-1 text-4xl font-black tabular-nums sm:mt-2 sm:text-5xl ${
                    answerFeedback.pointsAwarded > 0
                      ? "text-cyan-300"
                      : "text-slate-400"
                  }`}
                >
                  {answerFeedback.pointsAwarded > 0 ? "+" : ""}
                  {answerFeedback.pointsAwarded}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-300 sm:mt-2">
                  {pointRecipient}{" "}
                  {answerFeedback.pointsAwarded > 0
                    ? "gets these points"
                    : "receives no points"}
                </p>
              </div>

              {!answerFeedback.correct && (
                <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 sm:mt-4 sm:p-4">
                  <p className="text-sm leading-5 text-rose-100 sm:leading-6">
                    The card and penalty outcome is assigned to{" "}
                    <strong>{cardRecipient}</strong> according to the
                    game rules.
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3.5 sm:mt-4 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 sm:text-xs">
                  Correct answer
                </p>
                <p className="mt-2 break-words text-sm font-extrabold leading-6 text-white sm:text-lg">
                  {correctOption ?? "Answer unavailable"}
                </p>
              </div>

              {questionCard && (
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold text-cyan-200 sm:text-xs">
                    {questionCard.subject}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold text-slate-300 sm:text-xs">
                    {questionCard.difficulty}
                  </span>
                </div>
              )}

              {answerFeedback.explanation && (
                <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5 sm:mt-4 sm:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 sm:text-xs">
                    Explanation
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-200">
                    {answerFeedback.explanation}
                  </p>
                </div>
              )}

              <p className="mt-3 text-center text-[10px] leading-5 text-slate-500 sm:mt-4 sm:text-xs">
                Your score and penalty cards are managed by the game
                engine.
              </p>
            </div>

            {/* Fixed action footer */}
            <div className="shrink-0 border-t border-white/10 bg-slate-900 px-4 pb-3 pt-3 sm:px-7 sm:pb-4 sm:pt-4">
              <button
                type="button"
                onClick={handleContinue}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-5 py-3 text-base font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:min-h-14 sm:rounded-2xl sm:py-4"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-2 text-center text-[10px] text-slate-500 sm:text-xs">
                Review the result, then continue your game.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Shared question modal */}
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

      {/* Final game result */}
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

interface ScoreCardProps {
  label: string;
  value: number;
  accent: "cyan" | "amber" | "emerald" | "violet";
  icon: React.ReactNode;
}

const SCORE_STYLES: Record<
  ScoreCardProps["accent"],
  { border: string; icon: string; value: string }
> = {
  cyan: {
    border: "border-cyan-400/20 bg-cyan-400/[0.04]",
    icon: "bg-cyan-400/10 text-cyan-300",
    value: "text-cyan-300",
  },
  amber: {
    border: "border-amber-400/20 bg-amber-400/[0.04]",
    icon: "bg-amber-400/10 text-amber-300",
    value: "text-amber-300",
  },
  emerald: {
    border: "border-emerald-400/20 bg-emerald-400/[0.04]",
    icon: "bg-emerald-400/10 text-emerald-300",
    value: "text-emerald-300",
  },
  violet: {
    border: "border-violet-400/20 bg-violet-400/[0.04]",
    icon: "bg-violet-400/10 text-violet-300",
    value: "text-violet-300",
  },
};

function ScoreCard({ label, value, accent, icon }: ScoreCardProps) {
  const styles = SCORE_STYLES[accent];

  return (
    <div
      className={`min-w-0 rounded-xl border p-3 sm:rounded-2xl sm:p-4 ${styles.border}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${styles.icon}`}
        >
          {icon}
        </div>
        <p className="min-w-0 break-words text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-400 sm:text-xs sm:leading-5">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 text-2xl font-black tabular-nums sm:mt-3 sm:text-3xl ${styles.value}`}
      >
        {value}
      </p>
    </div>
  );
}

const WhotGame = memo(WhotGameComponent);

WhotGame.displayName = "WhotGame";

export default WhotGame;















// "use client";

// import {
//   ArrowLeft,
//   ArrowRight,
//   BookOpen,
//   CheckCircle2,
//   Loader2,
//   RotateCcw,
//   Sparkles,
//   Trophy,
//   XCircle,
// } from "lucide-react";
// import Link from "next/link";
// import {
//   memo,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import GameResultModal from "./GameResultModal";
// import GameTable from "./GameTable";
// import QuestionModal from "./QuestionModal";

// import { useWhotGame } from "../hook/useWhotGame";
// import {
//   getPlayableCards,
//   getSelectedQuestion,
// } from "../lib/game-engine";
// import type {
//   WhotAnswerFeedback,
//   WhotEngineState,
// } from "../lib/game-engine";
// import type { WhotCard, WhotPlayerId } from "../types/whot";

// export interface WhotGameProps {
//   playerName?: string;
//   botName?: string;
//   autoStart?: boolean;
//   botDelay?: number;
//   questionTimeLimit?: number;
//   onExit?: () => void;
//   className?: string;
// }

// function WhotGameComponent({
//   playerName = "You",
//   botName = "Learnyfi Bot",
//   autoStart = true,
//   botDelay = 900,
//   questionTimeLimit = 15,
//   onExit,
//   className = "",
// }: WhotGameProps) {
//   const game = useWhotGame({
//     autoStart,
//     botDelay,
//     botResponseDelay: 6000,
//     config: {
//       initialHandSize: 6,
//       questionTimeLimit,
//       wrongAnswerPenalty: 2,
//       drawOnNoMatch: 1,
//       copiesPerQuestion: 2,
//     },
//   });

//   const state = game.state as WhotEngineState;

//   const [lastQuestionCard, setLastQuestionCard] =
//     useState<WhotCard | null>(null);

//   const selectedQuestion = useMemo(
//     () => getSelectedQuestion(state),
//     [state],
//   );

//   const playableCards = useMemo(
//     () => getPlayableCards(state, "player"),
//     [state],
//   );

//   const playableCardIds = useMemo(
//     () => playableCards.map((card) => card.instanceId),
//     [playableCards],
//   );

//   const answerFeedback: WhotAnswerFeedback | null =
//     state.answerFeedback;

//   // Keep feedback on screen until Continue is pressed.
//   const isShowingFeedback =
//     answerFeedback !== null && !game.isFinished;

//   const isPlayerAnswering =
//     game.isQuestionOpen &&
//     state.activeQuestionCard !== null &&
//     state.questionSource === "bot" &&
//     answerFeedback === null;

//   const isBotAnswering =
//     game.isQuestionOpen &&
//     state.activeQuestionCard !== null &&
//     state.questionSource === "player" &&
//     answerFeedback === null;

//   const questionCard =
//     state.activeQuestionCard ??
//     selectedQuestion ??
//     lastQuestionCard;

//   useEffect(() => {
//     if (state.activeQuestionCard) {
//       setLastQuestionCard(state.activeQuestionCard);
//     } else if (selectedQuestion) {
//       setLastQuestionCard(selectedQuestion);
//     }
//   }, [state.activeQuestionCard, selectedQuestion]);

//   const handleSelectCard = useCallback(
//     (instanceId: string) => {
//       if (
//         !game.isPlayerTurn ||
//         game.isQuestionOpen ||
//         state.answerFeedback !== null ||
//         game.isFinished
//       ) {
//         return;
//       }

//       game.selectCard(instanceId);
//     },
//     [game, state.answerFeedback],
//   );

//   const handleDrawCard = useCallback(() => {
//     if (
//       !game.isPlayerTurn ||
//       game.isQuestionOpen ||
//       state.answerFeedback !== null ||
//       game.isFinished
//     ) {
//       return;
//     }

//     game.drawCard();
//   }, [game, state.answerFeedback]);

//   const handleContinue = useCallback(() => {
//     if (state.answerFeedback === null || game.isFinished) {
//       return;
//     }

//     game.continueAfterFeedback();
//   }, [game, state.answerFeedback]);

//   const handlePlayAgain = useCallback(() => {
//     setLastQuestionCard(null);
//     game.restartGame();
//   }, [game]);

//   const handleExit = useCallback(() => {
//     onExit?.();
//   }, [onExit]);

//   const winner: WhotPlayerId | null = state.winner;

//   const correctOption =
//     questionCard && answerFeedback
//       ? questionCard.options[answerFeedback.correctAnswerIndex]
//       : undefined;

//   const pointRecipient =
//     answerFeedback?.source === "bot"
//       ? answerFeedback.correct
//         ? playerName
//         : botName
//       : answerFeedback?.correct
//         ? botName
//         : playerName;

//   const cardRecipient =
//     answerFeedback?.source === "bot"
//       ? answerFeedback.correct
//         ? playerName
//         : botName
//       : answerFeedback?.correct
//         ? botName
//         : playerName;

//   const resultStats = useMemo(() => {
//     const totalAnswers =
//       state.correctAnswers + state.incorrectAnswers;

//     const accuracy =
//       totalAnswers > 0
//         ? Math.round(
//             (state.correctAnswers / totalAnswers) * 100,
//           )
//         : 0;

//     return {
//       correctAnswers: state.correctAnswers,
//       incorrectAnswers: state.incorrectAnswers,
//       accuracy,
//       cardsPlayed: state.turnsPlayed,
//     };
//   }, [
//     state.correctAnswers,
//     state.incorrectAnswers,
//     state.turnsPlayed,
//   ]);

//   return (
//     <main
//       className={`min-h-screen bg-slate-950 text-white ${className}`}
//     >
//       <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
//         {!isShowingFeedback && (
//           <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
//             <div className="flex min-w-0 items-center gap-3">
//               {onExit ? (
//                 <button
//                   type="button"
//                   onClick={handleExit}
//                   className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
//                   aria-label="Exit WHOT game"
//                 >
//                   <ArrowLeft className="h-5 w-5" />
//                 </button>
//               ) : (
//                 <Link
//                   href="/student/games"
//                   className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
//                   aria-label="Back to games"
//                 >
//                   <ArrowLeft className="h-5 w-5" />
//                 </Link>
//               )}

//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
//                 <BookOpen className="h-6 w-6 text-cyan-300" />
//               </div>

//               <div className="min-w-0">
//                 <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl">
//                   Learnyfi <span className="text-cyan-300">WHOT</span>
//                 </h1>
//                 <p className="text-xs text-slate-400 sm:text-sm">
//                   Play your card. Answer correctly. Win the game.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-200 sm:text-sm">
//               <Sparkles className="h-4 w-4" />
//               <span>Learn while you play</span>
//             </div>
//           </header>
//         )}

//         {game.isReady && !game.isPlaying && !game.isFinished && (
//           <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-xl sm:p-10">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
//               <Trophy className="h-8 w-8 text-cyan-300" />
//             </div>

//             <h2 className="mt-5 text-2xl font-black">
//               Ready to play?
//             </h2>

//             <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
//               Match the subject on the centre card, answer
//               questions, earn points, and clear your hand
//               before the bot.
//             </p>

//             <button
//               type="button"
//               onClick={game.startGame}
//               className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 font-extrabold text-slate-950 transition hover:bg-cyan-300"
//             >
//               <Sparkles className="h-5 w-5" />
//               Start game
//             </button>
//           </section>
//         )}

//         {game.isPlaying && !isShowingFeedback && (
//           <>
//             {/* Score cards */}
//             <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
//               <div className="rounded-2xl border border-cyan-400/20 bg-slate-900 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                   Your points
//                 </p>
//                 <p className="mt-2 text-2xl font-black text-cyan-300">
//                   {state.playerScore}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-amber-400/20 bg-slate-900 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                   Bot points
//                 </p>
//                 <p className="mt-2 text-2xl font-black text-amber-300">
//                   {state.botScore}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                   Correct answers
//                 </p>
//                 <p className="mt-2 text-2xl font-black text-emerald-300">
//                   {state.correctAnswers}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                   Your cards
//                 </p>
//                 <p className="mt-2 text-2xl font-black text-white">
//                   {state.player.hand.length}
//                 </p>
//               </div>
//             </section>

//             {/* Bot thinking status */}
//             {isBotAnswering && (
//               <section
//                 aria-live="polite"
//                 className="mb-5 flex items-center gap-4 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4 sm:p-5"
//               >
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15">
//                   <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <h2 className="font-extrabold text-cyan-100">
//                     {botName} is thinking…
//                   </h2>
//                   <p className="mt-1 text-sm leading-6 text-slate-300">
//                     The bot is answering the question attached to
//                     your card. The result will appear when its answer
//                     has been checked.
//                   </p>

//                   {questionCard && (
//                     <p className="mt-2 text-xs font-semibold text-cyan-200/80">
//                       {questionCard.subject} · {questionCard.difficulty}
//                     </p>
//                   )}
//                 </div>
//               </section>
//             )}

//             {/* Game table */}
//             <GameTable
//               status={state.status}
//               currentTurn={state.currentTurn}
//               winner={state.winner}
//               message={state.message}
//               playerCards={state.player.hand}
//               botCardCount={state.bot.hand.length}
//               drawPileCount={state.drawPile.length}
//               centerCard={state.centerCard}
//               playableCardIds={playableCardIds}
//               selectedCardInstanceId={state.selectedCardInstanceId}
//               onSelectCard={handleSelectCard}
//               onDrawCard={handleDrawCard}
//               isPlayerTurn={game.isPlayerTurn}
//               isBotTurn={game.isBotTurn}
//               isBotAnswering={isBotAnswering}
//               isQuestionOpen={game.isQuestionOpen}
//               isShowingFeedback={false}
//               isFinished={game.isFinished}
//               timeRemaining={game.timeRemaining}
//               playerName={playerName}
//               botName={botName}
//             />

//             <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
//               <p className="text-sm leading-6 text-slate-400">
//                 {isPlayerAnswering
//                   ? `${botName} has played a card. Answer its question before continuing.`
//                   : isBotAnswering
//                     ? `${botName} is answering your card's question automatically.`
//                     : game.isQuestionOpen
//                       ? "The question is being resolved."
//                       : game.isPlayerTurn
//                         ? "Select a playable card or draw from the market."
//                         : "The bot is preparing its next move."}
//               </p>

//               <button
//                 type="button"
//                 onClick={handlePlayAgain}
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 Restart
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Full-screen centred feedback view.
//           The game layout is hidden until Continue is pressed. */}
//       {isShowingFeedback && answerFeedback && (
//         <section
//           aria-live="polite"
//           aria-labelledby="whot-feedback-title"
//           className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/95 p-3 backdrop-blur-md sm:p-6"
//         >
//           <div className="my-auto flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
//             {/* Feedback header */}
//             <div
//               className={`shrink-0 border-b px-5 py-5 sm:px-7 ${
//                 answerFeedback.correct
//                   ? "border-emerald-400/20 bg-emerald-400/10"
//                   : "border-rose-400/20 bg-rose-400/10"
//               }`}
//             >
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
//                     answerFeedback.correct
//                       ? "bg-emerald-400/15"
//                       : "bg-rose-400/15"
//                   }`}
//                 >
//                   {answerFeedback.correct ? (
//                     <CheckCircle2 className="h-8 w-8 text-emerald-300" />
//                   ) : (
//                     <XCircle className="h-8 w-8 text-rose-300" />
//                   )}
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
//                     WHOT answer result
//                   </p>
//                   <h2
//                     id="whot-feedback-title"
//                     className={`mt-1 text-2xl font-black sm:text-3xl ${
//                       answerFeedback.correct
//                         ? "text-emerald-200"
//                         : "text-rose-200"
//                     }`}
//                   >
//                     {answerFeedback.correct
//                       ? "Correct!"
//                       : "Incorrect answer"}
//                   </h2>
//                 </div>
//               </div>
//             </div>

//             {/* Scroll only this inner area on short screens */}
//             <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
//               <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center">
//                 <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//                   Points awarded
//                 </p>
//                 <p
//                   className={`mt-2 text-4xl font-black tabular-nums sm:text-5xl ${
//                     answerFeedback.pointsAwarded > 0
//                       ? "text-cyan-300"
//                       : "text-slate-400"
//                   }`}
//                 >
//                   {answerFeedback.pointsAwarded > 0 ? "+" : ""}
//                   {answerFeedback.pointsAwarded}
//                 </p>
//                 <p className="mt-2 text-sm font-semibold text-slate-300">
//                   {pointRecipient}{" "}
//                   {answerFeedback.pointsAwarded > 0
//                     ? "gets these points"
//                     : "receives no points"}
//                 </p>
//               </div>

//               {!answerFeedback.correct && (
//                 <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3">
//                   <p className="text-sm leading-6 text-rose-100">
//                     The card/penalty outcome is assigned to{" "}
//                     <strong>{cardRecipient}</strong> according to
//                     the game rules.
//                   </p>
//                 </div>
//               )}

//               <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
//                 <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
//                   Correct answer
//                 </p>
//                 <p className="mt-2 text-base font-extrabold leading-6 text-white sm:text-lg">
//                   {correctOption ?? "Answer unavailable"}
//                 </p>
//               </div>

//               {questionCard && (
//                 <div className="mt-4 flex flex-wrap items-center gap-2">
//                   <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
//                     {questionCard.subject}
//                   </span>
//                   <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
//                     {questionCard.difficulty}
//                   </span>
//                 </div>
//               )}

//               {answerFeedback.explanation && (
//                 <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
//                   <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
//                     Explanation
//                   </p>
//                   <p className="mt-2 text-sm leading-6 text-slate-200">
//                     {answerFeedback.explanation}
//                   </p>
//                 </div>
//               )}

//               <p className="mt-4 text-center text-xs leading-5 text-slate-500">
//                 Your score and any penalty cards are managed by the
//                 game engine.
//               </p>
//             </div>

//             {/* Always-visible Continue footer */}
//             <div className="shrink-0 border-t border-white/10 bg-slate-900 px-5 py-4 sm:px-7">
//               <button
//                 type="button"
//                 onClick={handleContinue}
//                 className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900"
//               >
//                 Continue
//                 <ArrowRight className="h-5 w-5" />
//               </button>
//               <p className="mt-2 text-center text-xs text-slate-500">
//                 Review the result, then continue your game.
//               </p>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Shared question modal for both turns */}
//       <QuestionModal
//         isOpen={
//           !game.isFinished &&
//           !isShowingFeedback &&
//           (isPlayerAnswering || isBotAnswering)
//         }
//         card={
//           isPlayerAnswering || isBotAnswering
//             ? questionCard
//             : null
//         }
//         timeRemaining={game.timeRemaining}
//         questionSource={state.questionSource}
//         onSubmitAnswer={game.submitAnswer}
//         disabled={
//           isBotAnswering ||
//           isShowingFeedback ||
//           game.isFinished
//         }
//       />

//       <GameResultModal
//         isOpen={game.isFinished}
//         result={winner === "player" ? "WIN" : "LOSS"}
//         playerName={playerName}
//         stats={resultStats}
//         onPlayAgain={handlePlayAgain}
//         onExit={onExit ? handleExit : undefined}
//       />
//     </main>
//   );
// }

// const WhotGame = memo(WhotGameComponent);

// WhotGame.displayName = "WhotGame";

// export default WhotGame;
