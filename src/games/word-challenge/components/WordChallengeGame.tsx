





"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
  XCircle,
} from "lucide-react";

import AnswerSlots from "./AnswerSlots";
import ClueCard from "./ClueCard";
import Countdown from "./Countdown";
import DescriptionCard from "./DescriptionCard";
import GameResult from "./GameResult";
import LetterBoard from "./LetterBoard";
import PointsDisplay from "./PointsDisplay";

export interface WordChallengeQuestion {
  id: string;
  answer: string;
  description: string;
  clue: string;
  letters: string[];
  category?: string;
  startingPoints?: number;
  timeLimit?: number;
  clueThreshold?: number;
  cluePenalty?: number;
}

interface WordChallengeGameProps {
  questions: WordChallengeQuestion[];
  onExit?: () => void;
}

type GameState =
  | "playing"
  | "correct"
  | "incorrect"
  | "time-up"
  | "finished";

const DEFAULT_STARTING_POINTS = 20;
const DEFAULT_TIME_LIMIT = 20;
const DEFAULT_CLUE_THRESHOLD = 9;
const DEFAULT_CLUE_PENALTY = 5;

function getStartingPoints(question: WordChallengeQuestion) {
  return Math.max(
    0,
    question.startingPoints ?? DEFAULT_STARTING_POINTS,
  );
}

function getTimeLimit(question: WordChallengeQuestion) {
  return Math.max(
    1,
    question.timeLimit ?? DEFAULT_TIME_LIMIT,
  );
}

function getClueThreshold(question: WordChallengeQuestion) {
  const timeLimit = getTimeLimit(question);

  return Math.min(
    Math.max(
      0,
      question.clueThreshold ?? DEFAULT_CLUE_THRESHOLD,
    ),
    timeLimit,
  );
}

function getCluePenalty(question: WordChallengeQuestion) {
  return Math.max(
    0,
    question.cluePenalty ?? DEFAULT_CLUE_PENALTY,
  );
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1),
    );

    [copy[i], copy[randomIndex]] = [
      copy[randomIndex],
      copy[i],
    ];
  }

  return copy;
}

function normalizeAnswer(value: string) {
  return value.trim().toUpperCase();
}

function calculateTimeBasedPoints(
  startingPoints: number,
  timeLeft: number,
  timeLimit: number,
) {
  if (startingPoints <= 0) {
    return 0;
  }

  if (timeLimit <= 0) {
    return startingPoints;
  }

  const ratio = Math.max(
    0,
    Math.min(1, timeLeft / timeLimit),
  );

  return Math.max(
    0,
    Math.ceil(startingPoints * ratio),
  );
}

export default function WordChallengeGame({
  questions,
  onExit,
}: WordChallengeGameProps) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const [selectedLetters, setSelectedLetters] =
    useState<string[]>([]);

  const [selectedIndexes, setSelectedIndexes] =
    useState<number[]>([]);

  const [timeLeft, setTimeLeft] = useState(
    DEFAULT_TIME_LIMIT,
  );

  const [currentPoints, setCurrentPoints] = useState(
    DEFAULT_STARTING_POINTS,
  );

  const [clueShown, setClueShown] = useState(false);

  /*
   * Controls the visual "pump" animation when
   * the clue is automatically revealed.
   */
  const [cluePumping, setCluePumping] =
    useState(false);

  const [gameState, setGameState] =
    useState<GameState>("playing");

  const [score, setScore] = useState(0);

  const [correctAnswers, setCorrectAnswers] =
    useState(0);

  const [lastEarnedPoints, setLastEarnedPoints] =
    useState(0);

  const [answerMessage, setAnswerMessage] =
    useState<string | null>(null);

  const [displayLetters, setDisplayLetters] =
    useState<string[]>([]);

  const currentQuestion = questions[questionIndex];

  const totalQuestions = questions.length;

  const startingPoints = currentQuestion
    ? getStartingPoints(currentQuestion)
    : DEFAULT_STARTING_POINTS;

  const timeLimit = currentQuestion
    ? getTimeLimit(currentQuestion)
    : DEFAULT_TIME_LIMIT;

  const clueThreshold = currentQuestion
    ? getClueThreshold(currentQuestion)
    : DEFAULT_CLUE_THRESHOLD;

  const cluePenalty = currentQuestion
    ? getCluePenalty(currentQuestion)
    : DEFAULT_CLUE_PENALTY;

  const answerLength = currentQuestion
    ? normalizeAnswer(currentQuestion.answer).length
    : 0;

  const isPlaying = gameState === "playing";

  /*
   * Start / reset the current question.
   */
  const initializeQuestion = useCallback(
    (question: WordChallengeQuestion) => {
      const nextTimeLimit =
        getTimeLimit(question);

      const nextStartingPoints =
        getStartingPoints(question);

      setSelectedLetters([]);
      setSelectedIndexes([]);

      setTimeLeft(nextTimeLimit);

      setCurrentPoints(nextStartingPoints);

      setClueShown(false);

      /*
       * Important:
       * Reset the pump animation for every question.
       */
      setCluePumping(false);

      setGameState("playing");

      setAnswerMessage(null);

      setLastEarnedPoints(0);

      setDisplayLetters(
        shuffleArray(
          question.letters.length > 0
            ? question.letters
            : normalizeAnswer(
                question.answer,
              ).split(""),
        ),
      );
    },
    [],
  );

  /*
   * Initialize the first question.
   */
  useEffect(() => {
    if (!currentQuestion) {
      return;
    }

    initializeQuestion(currentQuestion);
  }, [
    currentQuestion,
    initializeQuestion,
  ]);

  /*
   * Countdown.
   */
  useEffect(() => {
    if (!isPlaying || !currentQuestion) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);

          setGameState("time-up");

          setCurrentPoints(0);

          setAnswerMessage("Time is up!");

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying, currentQuestion]);

  /*
   * Update points as time decreases.
   *
   * Once the clue is visible, the reward is also
   * reduced by the configured clue penalty.
   */
  useEffect(() => {
    if (!isPlaying || !currentQuestion) {
      return;
    }

    const calculatedPoints =
      calculateTimeBasedPoints(
        startingPoints,
        timeLeft,
        timeLimit,
      );

    const reducedPoints = clueShown
      ? Math.max(
          0,
          calculatedPoints - cluePenalty,
        )
      : calculatedPoints;

    setCurrentPoints(reducedPoints);
  }, [
    timeLeft,
    clueShown,
    isPlaying,
    currentQuestion,
    startingPoints,
    timeLimit,
    cluePenalty,
  ]);

  /*
   * Automatically reveal the clue.
   *
   * When it appears, the card "pumps" for 1.2 seconds.
   */
  useEffect(() => {
    if (
      !isPlaying ||
      clueShown ||
      !currentQuestion
    ) {
      return;
    }

    if (timeLeft <= clueThreshold) {
      setClueShown(true);

      /*
       * Start the visual pump.
       */
      setCluePumping(true);

      setAnswerMessage(
        "💡 YOU NEED A CLUE",
      );

      const pointsAtClue =
        calculateTimeBasedPoints(
          startingPoints,
          timeLeft,
          timeLimit,
        );

      setCurrentPoints(
        Math.max(
          0,
          pointsAtClue - cluePenalty,
        ),
      );

      /*
       * Stop the pump after 1.2 seconds.
       */
      const pumpTimer = window.setTimeout(() => {
        setCluePumping(false);
      }, 1200);

      return () => {
        window.clearTimeout(pumpTimer);
      };
    }
  }, [
    timeLeft,
    clueShown,
    isPlaying,
    currentQuestion,
    clueThreshold,
    startingPoints,
    timeLimit,
    cluePenalty,
  ]);

  /*
   * Select a letter from the board.
   */
  const handleSelectLetter =
    useCallback(
      (
        letter: string,
        index: number,
      ) => {
        if (
          !isPlaying ||
          !currentQuestion
        ) {
          return;
        }

        if (
          selectedLetters.length >=
          answerLength
        ) {
          return;
        }

        if (
          selectedIndexes.includes(index)
        ) {
          return;
        }

        const nextLetters = [
          ...selectedLetters,
          letter,
        ];

        const nextIndexes = [
          ...selectedIndexes,
          index,
        ];

        setSelectedLetters(
          nextLetters,
        );

        setSelectedIndexes(
          nextIndexes,
        );

        setAnswerMessage(null);

        /*
         * Automatically check the answer when
         * all required letters have been selected.
         */
        if (
          nextLetters.length ===
          answerLength
        ) {
          const playerAnswer =
            normalizeAnswer(
              nextLetters.join(""),
            );

          const correctAnswer =
            normalizeAnswer(
              currentQuestion.answer,
            );

          if (
            playerAnswer ===
            correctAnswer
          ) {
            const earnedPoints =
              Math.max(
                0,
                currentPoints,
              );

            setScore(
              (previous) =>
                previous +
                earnedPoints,
            );

            setCorrectAnswers(
              (previous) =>
                previous + 1,
            );

            setLastEarnedPoints(
              earnedPoints,
            );

            setGameState(
              "correct",
            );

            setAnswerMessage(
              `Correct! You earned ${earnedPoints} points.`,
            );
          } else {
            setLastEarnedPoints(0);

            setGameState(
              "incorrect",
            );

            setAnswerMessage(
              `Not quite. The answer was ${correctAnswer}.`,
            );
          }
        }
      },
      [
        isPlaying,
        currentQuestion,
        selectedLetters,
        selectedIndexes,
        answerLength,
        currentPoints,
      ],
    );

  /*
   * Remove a specific letter from the answer.
   */
  const handleRemoveLetter =
    useCallback(
      (index: number) => {
        if (!isPlaying) {
          return;
        }

        setSelectedLetters(
          (previous) =>
            previous.filter(
              (_, letterIndex) =>
                letterIndex !== index,
            ),
        );

        setSelectedIndexes(
          (previous) => {
            const next = [
              ...previous,
            ];

            next.splice(index, 1);

            return next;
          },
        );

        setAnswerMessage(null);
      },
      [isPlaying],
    );

  /*
   * Remove the most recently selected letter.
   */
  const handleRemoveLast =
    useCallback(() => {
      if (
        !isPlaying ||
        selectedLetters.length === 0
      ) {
        return;
      }

      setSelectedLetters(
        (previous) =>
          previous.slice(0, -1),
      );

      setSelectedIndexes(
        (previous) =>
          previous.slice(0, -1),
      );

      setAnswerMessage(null);
    }, [
      isPlaying,
      selectedLetters.length,
    ]);

  /*
   * Clear the complete answer.
   */
  const handleClear =
    useCallback(() => {
      if (!isPlaying) {
        return;
      }

      setSelectedLetters([]);

      setSelectedIndexes([]);

      setAnswerMessage(null);
    }, [isPlaying]);

  /*
   * Move to the next question.
   */
  const handleNextQuestion =
    useCallback(() => {
      const nextIndex =
        questionIndex + 1;

      if (
        nextIndex >= totalQuestions
      ) {
        setGameState("finished");

        return;
      }

      setQuestionIndex(nextIndex);
    }, [
      questionIndex,
      totalQuestions,
    ]);

  /*
   * Restart the complete game.
   */
  const handlePlayAgain =
    useCallback(() => {
      setQuestionIndex(0);

      setScore(0);

      setCorrectAnswers(0);

      setSelectedLetters([]);

      setSelectedIndexes([]);

      setTimeLeft(
        DEFAULT_TIME_LIMIT,
      );

      setCurrentPoints(
        DEFAULT_STARTING_POINTS,
      );

      setClueShown(false);

      setCluePumping(false);

      setGameState("playing");

      setAnswerMessage(null);

      setLastEarnedPoints(0);

      if (questions[0]) {
        initializeQuestion(
          questions[0],
        );
      }
    }, [
      questions,
      initializeQuestion,
    ]);

  /*
   * If no questions were supplied.
   */
  if (!questions.length) {
    return (
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06]">
          <Sparkles className="h-6 w-6 text-white/50" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-white">
          No words available
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/45">
          Add some Word Challenge
          questions to start playing.
        </p>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="mt-6 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
          >
            Exit Game
          </button>
        )}
      </section>
    );
  }

  /*
   * Final result.
   */
  if (gameState === "finished") {
    return (
      <GameResult
        score={score}
        totalQuestions={
          totalQuestions
        }
        correctAnswers={
          correctAnswers
        }
        onPlayAgain={
          handlePlayAgain
        }
        onExit={onExit}
      />
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const answerDisplay =
    selectedLetters;

  const isRoundComplete =
    gameState === "correct" ||
    gameState === "incorrect" ||
    gameState === "time-up";

  const missedAnswer =
    gameState === "incorrect" ||
    gameState === "time-up";

  return (
    <main className="mx-auto w-full max-w-3xl">
      {/* Top game header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            Word Challenge
          </p>

          <p className="mt-1 text-sm font-semibold text-white/70">
            Round {questionIndex + 1} of{" "}
            {totalQuestions}
          </p>
        </div>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/45 transition hover:bg-white/[0.08] hover:text-white"
          >
            Exit
          </button>
        )}
      </div>

      {/* Main game */}
      <div className="space-y-4">
        {/* Description */}
        <DescriptionCard
          description={
            currentQuestion.description
          }
          category={
            currentQuestion.category
          }
          questionNumber={
            questionIndex + 1
          }
          totalQuestions={
            totalQuestions
          }
          disabled={!isPlaying}
        />

        {/* Timer */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <Countdown
            timeLeft={timeLeft}
            totalTime={timeLimit}
            clueThreshold={
              clueThreshold
            }
            disabled={!isPlaying}
          />
        </div>

        {/* Points */}
        <PointsDisplay
          currentPoints={
            currentPoints
          }
          startingPoints={
            startingPoints
          }
          clueUsed={clueShown}
          cluePenalty={
            cluePenalty
          }
          disabled={!isPlaying}
        />

        {/* Automatic clue */}
        <ClueCard
          clue={currentQuestion.clue}
          visible={clueShown}
          reducedPoints={
            currentPoints
          }
          pumping={cluePumping}
        />

        {/* Answer */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <AnswerSlots
            answer={answerDisplay}
            maxLength={
              answerLength
            }
            onRemoveLetter={
              handleRemoveLetter
            }
            onClear={
              handleClear
            }
            disabled={!isPlaying}
          />
        </div>

        {/* Letters */}
        <LetterBoard
          letters={
            displayLetters
          }
          selectedLetters={
            selectedLetters
          }
          maxLength={
            answerLength
          }
          onSelectLetter={
            handleSelectLetter
          }
          onRemoveLast={
            handleRemoveLast
          }
          disabled={!isPlaying}
        />

        {/* Feedback */}
        {answerMessage && (
          <div
            className={[
              "flex items-start gap-3 rounded-2xl border p-4",
              gameState === "correct"
                ? "border-emerald-400/20 bg-emerald-400/[0.07]"
                : gameState ===
                      "incorrect" ||
                    gameState ===
                      "time-up"
                  ? "border-red-400/20 bg-red-400/[0.07]"
                  : "border-amber-400/20 bg-amber-400/[0.07]",
            ].join(" ")}
          >
            <div className="mt-0.5 shrink-0">
              {gameState ===
              "correct" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : gameState ===
                    "incorrect" ||
                  gameState ===
                    "time-up" ? (
                <XCircle className="h-5 w-5 text-red-400" />
              ) : (
                <Clock3 className="h-5 w-5 text-amber-300" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-white">
                {answerMessage}
              </p>

              {gameState ===
                "correct" && (
                <p className="mt-1 text-xs text-emerald-300/70">
                  {lastEarnedPoints >
                  0
                    ? "The faster you solve, the more you earn."
                    : "Great job solving the word."}
                </p>
              )}

              {missedAnswer && (
                <p className="mt-1 text-xs text-white/40">
                  The correct word
                  was{" "}
                  <span className="font-bold text-white/70">
                    {normalizeAnswer(
                      currentQuestion.answer,
                    )}
                  </span>
                  .
                </p>
              )}
            </div>
          </div>
        )}

        {/* Next question */}
        {isRoundComplete && (
          <button
            type="button"
            onClick={
              handleNextQuestion
            }
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-black transition hover:bg-white/90 active:scale-[0.99]"
          >
            {questionIndex + 1 >=
            totalQuestions
              ? "See My Results"
              : "Next Word"}

            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </main>
  );
}
