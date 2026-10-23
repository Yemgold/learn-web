

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
import type {
  WhotCard,
  WhotPlayerId,
} from "../types/whot";

export interface WhotGameSelectedSubject {
  id: string;
  name: string;
}

export interface WhotGameSelection {
  classGroup: "SCIENCES" | "COMMERCIAL" | "ARTS";
  subjects: WhotGameSelectedSubject[];
  selectedAt?: string;
}

export interface WhotGameProps {
  playerName?: string;
  botName?: string;
  autoStart?: boolean;
  botDelay?: number;
  questionTimeLimit?: number;
  onExit?: () => void;
  className?: string;

  /** Subjects saved by the WHOT setup page. */
  selection?: WhotGameSelection | null;
}

function WhotGameComponent({
  playerName = "You",
  botName = "Learnyfi Bot",
  autoStart = true,
  botDelay = 900,
  questionTimeLimit = 15,
  onExit,
  className = "",
  selection = null,
}: WhotGameProps) {
  /*
   * Convert the setup selection to subject IDs understood by
   * the game engine and deck.
   *
   * When selection is null, selectedSubjects is undefined and
   * the deck can use its default question bank.
   */
  const selectedSubjects = useMemo(
    () =>
      selection
        ? selection.subjects.map((subject) => subject.id)
        : undefined,
    [selection],
  );

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
      selectedSubjects,
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

  // The player answers questions attached to bot-played cards.
  const isPlayerAnswering =
    game.isQuestionOpen &&
    state.activeQuestionCard !== null &&
    state.questionSource === "bot" &&
    answerFeedback === null;

  // The bot answers questions attached to player-played cards.
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

  const resultStats = useMemo(() => {
    const totalAnswers =
      state.correctAnswers + state.incorrectAnswers;

    return {
      correctAnswers: state.correctAnswers,
      incorrectAnswers: state.incorrectAnswers,
      accuracy:
        totalAnswers > 0
          ? Math.round(
              (state.correctAnswers / totalAnswers) * 100,
            )
          : 0,
      cardsPlayed: state.turnsPlayed,
    };
  }, [
    state.correctAnswers,
    state.incorrectAnswers,
    state.turnsPlayed,
  ]);

  const showGameTable =
    game.isPlaying &&
    !isShowingFeedback &&
    !isPlayerAnswering &&
    !isBotAnswering &&
    !game.isFinished;

  return (
    <main
      className={`min-h-[100svh] overflow-x-clip bg-slate-950 text-white ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl px-3 pb-5 pt-3 sm:px-5 sm:pb-8 sm:pt-5">
        {/* Compact header */}
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {onExit ? (
              <button
                type="button"
                onClick={handleExit}
                aria-label="Exit game"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href="/student/games"
                aria-label="Back to games"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black sm:text-xl">
                Learnyfi <span className="text-cyan-300">WHOT</span>
              </h1>
              <p className="text-[11px] text-slate-500">
                Learn while you play
              </p>
            </div>
          </div>

          {game.isPlaying && !game.isFinished && (
            <button
              type="button"
              onClick={handlePlayAgain}
              aria-label="Restart game"
              title="Restart game"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </header>

        {/* Selected subjects */}
        {selection && selection.subjects.length > 0 && (
          <section
            aria-label="Selected subjects"
            className="mb-4 rounded-2xl border border-cyan-400/15 bg-slate-900/70 p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Your learning deck
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {selection.classGroup} · {selection.subjects.length} subjects
                </p>
              </div>
              <BookOpen className="h-4 w-4 shrink-0 text-cyan-300" />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {selection.subjects.map((subject) => (
                <span
                  key={subject.id}
                  className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100"
                >
                  {subject.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Ready screen */}
        {game.isReady &&
          !game.isPlaying &&
          !game.isFinished && (
            <section className="mx-auto flex min-h-[65svh] max-w-lg flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900 px-5 py-9 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <Trophy className="h-8 w-8" />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                Learnyfi Games
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Ready to play?
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Play your cards, answer questions, earn points,
                and clear your hand before your opponent.
              </p>

              {selection && selection.subjects.length > 0 && (
                <div className="mt-5 w-full max-w-sm rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Selected subjects
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {selection.subjects
                      .map((subject) => subject.name)
                      .join(", ")}
                  </p>
                </div>
              )}

              <div className="mt-6 w-full max-w-sm rounded-xl border border-white/10 bg-slate-950 p-4 text-left">
                <p className="text-xs text-slate-500">
                  YOUR OPPONENT
                </p>
                <p className="mt-1 font-bold">{botName}</p>
                <p className="mt-3 text-xs text-slate-500">
                  YOUR STARTING HAND
                </p>
                <p className="mt-1 font-bold">6 cards</p>
              </div>

              <button
                type="button"
                onClick={game.startGame}
                className="mt-6 flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 hover:bg-cyan-300"
              >
                <Sparkles className="h-5 w-5" />
                Start game
              </button>
            </section>
          )}

        {/* Normal play */}
        {showGameTable && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-cyan-200">
                  {playerName}
                </p>
                <p className="text-lg font-black tabular-nums">
                  {state.playerScore}{" "}
                  <span className="text-xs font-medium text-slate-500">
                    points
                  </span>
                </p>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  VS
                </span>
              </div>

              <div className="min-w-0 text-right">
                <p className="truncate text-xs font-bold text-amber-200">
                  {botName}
                </p>
                <p className="text-lg font-black tabular-nums">
                  {state.botScore}{" "}
                  <span className="text-xs font-medium text-slate-500">
                    points
                  </span>
                </p>
              </div>
            </div>

            <div
              aria-live="polite"
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                game.isPlayerTurn
                  ? "border border-cyan-400/20 bg-cyan-400/5 text-cyan-100"
                  : "border border-amber-400/20 bg-amber-400/5 text-amber-100"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  game.isPlayerTurn
                    ? "bg-cyan-300"
                    : "animate-pulse bg-amber-300"
                }`}
              />
              <span>
                {game.isPlayerTurn
                  ? "Your turn — choose a card or draw."
                  : `${botName} is preparing a move…`}
              </span>
            </div>

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
              isBotAnswering={false}
              isQuestionOpen={false}
              isShowingFeedback={false}
              isFinished={game.isFinished}
              timeRemaining={null}
              playerName={playerName}
              botName={botName}
              compact
            />
          </section>
        )}

        {/* Bot question-answering stage */}
        {game.isPlaying &&
          isBotAnswering &&
          !isShowingFeedback && (
            <section
              aria-live="polite"
              className="mx-auto flex min-h-[55svh] max-w-lg flex-col items-center justify-center rounded-3xl border border-amber-400/20 bg-slate-900 px-5 py-8 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10">
                <Loader2 className="h-8 w-8 animate-spin text-amber-300" />
              </div>

              <h2 className="mt-5 text-xl font-black sm:text-2xl">
                {botName} is answering
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Your card has triggered a question. The bot is
                working on its answer. You will see the result next.
              </p>

              {questionCard && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-200">
                    {questionCard.subject}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
                    {questionCard.difficulty}
                  </span>
                </div>
              )}
            </section>
          )}
      </div>

      {/* Human answer stage */}
      <QuestionModal
        isOpen={
          !game.isFinished &&
          !isShowingFeedback &&
          isPlayerAnswering
        }
        card={isPlayerAnswering ? questionCard : null}
        timeRemaining={game.timeRemaining}
        questionSource={state.questionSource}
        onSubmitAnswer={game.submitAnswer}
        disabled={isShowingFeedback || game.isFinished}
      />

      {/* Answer feedback */}
      {isShowingFeedback && answerFeedback && (
        <section
          aria-live="polite"
          aria-labelledby="whot-feedback-title"
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-950/95 p-3 backdrop-blur-md sm:p-5"
        >
          <div className="my-auto flex max-h-[94svh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl sm:rounded-3xl">
            <div
              className={`shrink-0 border-b p-4 sm:p-6 ${
                answerFeedback.correct
                  ? "border-emerald-400/20 bg-emerald-400/10"
                  : "border-rose-400/20 bg-rose-400/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {answerFeedback.correct ? (
                  <CheckCircle2 className="h-10 w-10 shrink-0 text-emerald-300" />
                ) : (
                  <XCircle className="h-10 w-10 shrink-0 text-rose-300" />
                )}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Answer result
                  </p>
                  <h2
                    id="whot-feedback-title"
                    className={`mt-1 text-2xl font-black ${
                      answerFeedback.correct
                        ? "text-emerald-200"
                        : "text-rose-200"
                    }`}
                  >
                    {answerFeedback.correct
                      ? "Correct!"
                      : "Not Correct"}
                  </h2>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Points awarded
                </p>
                <p
                  className={`mt-1 text-4xl font-black tabular-nums ${
                    answerFeedback.pointsAwarded > 0
                      ? "text-cyan-300"
                      : "text-slate-400"
                  }`}
                >
                  {answerFeedback.pointsAwarded > 0 ? "+" : ""}
                  {answerFeedback.pointsAwarded}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {pointRecipient}{" "}
                  {answerFeedback.pointsAwarded > 0
                    ? "gets these points"
                    : "receives no points"}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Correct answer
                </p>
                <p className="mt-2 break-words text-base font-bold leading-6 text-white">
                  {correctOption ?? "Answer unavailable"}
                </p>
              </div>

              {answerFeedback.explanation && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Explanation
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-200">
                    {answerFeedback.explanation}
                  </p>
                </div>
              )}

              {questionCard && (
                <p className="text-xs text-slate-500">
                  {questionCard.subject} · {questionCard.difficulty}
                </p>
              )}
            </div>

            <div className="shrink-0 border-t border-white/10 p-4 sm:px-6">
              <button
                type="button"
                onClick={handleContinue}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                Continue game
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Final results */}
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
