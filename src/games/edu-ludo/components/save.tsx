"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Coins,
  RotateCcw,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";

import type {
  EduLudoAnswerResult,
  EduLudoColor,
  EduLudoMove,
  EduLudoPlayer,
  EduLudoQuestion,
} from "./eduLudoTypes";

import {
  COLOR_STYLES,
  INITIAL_CBT_POINTS,
  INITIAL_WALLET_BALANCE,
  QUESTION_COST,
  QUESTION_TIME_LIMIT,
  TOKEN_HOME_REWARD,
  TOKENS_PER_PLAYER,
  WINNER_REWARD,
  SAFE_POSITIONS,
  START_POSITIONS,
  TRACK_LENGTH,
} from "./eduLudoConstants";

import {
  useEduLudoGame,
} from "../hook/useEduLudoGame";

import {
  useEduLudoQuestions,
} from "../hook/useEduLudoQuestions";

import {
  useEduLudoMovement,
  getPlayerLegalMoves,
} from "../hook/useEduLudoMovement";

import {
  useEduLudoBots,
} from "../hook/useEduLudoBots";

import type {
  LudoDifficulty,
  LudoSubjectFilter,
} from "../utils/ludoQuestions";

import LudoBoard from "./LudoBoard";
import QuestionModal from "./QuestionModal";

interface Props {
  initialBalance?: number;
  initialCbtPoints?: number;
  onBack?: () => void;
  onFundWallet?: () => void;
}

type UiPhase =
  | "lobby"
  | "playing"
  | "question"
  | "feedback"
  | "moving"
  | "finished";

type UiMode = "solo" | "friends" | "classroom" | "tournament";

const COLORS: EduLudoColor[] = [
  "red",
  "green",
  "yellow",
  "blue",
];

const SUBJECTS: LudoSubjectFilter[] = [
  "All Subjects",
  "Mathematics",
  "English",
  "Science",
  "Biology",
  "Chemistry",
  "Physics",
];

const DIFFICULTIES: LudoDifficulty[] = [
  "easy",
  "medium",
  "hard",
];

const LEVELS = ["JSS", "SSS", "JAMB", "WAEC"] as const;

function randomDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
}

function getTokenStringId(playerId: string, tokenIndex: number) {
  return `${playerId}-token-${tokenIndex + 1}`;
}

function getTokenIndex(tokenId: string) {
  const match = tokenId.match(/-token-(\d+)$/);
  return match ? Number(match[1]) - 1 : -1;
}

function normalizeQuestion(
  value: unknown,
  level: string,
): EduLudoQuestion | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Record<string, unknown>;
  const options = Array.isArray(raw.options) ? raw.options : [];

  if (
    typeof raw.id !== "string" ||
    options.length !== 4 ||
    typeof raw.correctAnswer !== "number"
  ) {
    return null;
  }

  return {
    id: raw.id,
    subject:
      typeof raw.subject === "string" ? raw.subject : "General",
    level:
      typeof raw.level === "string" ? raw.level : level,
    difficulty:
      typeof raw.difficulty === "string"
        ? raw.difficulty
        : "medium",
    content:
      typeof raw.content === "string"
        ? raw.content
        : typeof raw.question === "string"
          ? raw.question
          : "Answer the following question.",
    options: options.map(String),
    correctAnswer: raw.correctAnswer,
    explanation:
      typeof raw.explanation === "string"
        ? raw.explanation
        : "",
  } as EduLudoQuestion;
}

export default function EduLudoGame({
  initialBalance = INITIAL_WALLET_BALANCE,
  initialCbtPoints = INITIAL_CBT_POINTS,
  onBack,
  onFundWallet,
}: Props) {
  const [modeSelection, setModeSelection] =
    useState<UiMode>("solo");

  const [subject, setSubject] =
    useState<LudoSubjectFilter>("All Subjects");

  const [difficulty, setDifficulty] =
    useState<LudoDifficulty>("medium");

  const [level, setLevel] =
    useState<string>("JAMB");

  const [humanColor, setHumanColor] =
    useState<EduLudoColor>("red");

  const [diceRolling, setDiceRolling] = useState(false);
  const [isAnimatingMove, setIsAnimatingMove] = useState(false);
  const [selectedTokenId, setSelectedTokenId] =
    useState<number | null>(null);

  const [questionResult, setQuestionResult] =
    useState<EduLudoAnswerResult | null>(null);

  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [roundQuestion, setRoundQuestion] = useState(0);

  const game = useEduLudoGame({
    initialBalance,
    initialCbtPoints,
    initialMode: modeSelection,
    initialPlayerColor: humanColor,
  });

  const questions = useEduLudoQuestions({
    initialBalance,
    initialCbtPoints,
    subject,
    difficulty,
    onCbtReward: (_playerId, _points) => {},
  });

  const {
    walletBalance: questionWalletBalance,
    cbtPoints: questionCbtPoints,
    currentQuestion,
    lastResult,
    presentQuestion,
    submitAnswer,
    clearQuestion,
    resetQuestions,
    consumeGuaranteedSix,
    getGuaranteedSixCount,
  } = questions;

  const {
    phase,
    setPhase,
    players,
    setPlayers,
    turnIndex,
    setTurnIndex,
    diceValue,
    setDiceValue,
    currentPlayer,
    startGame,
    returnToLobby,
    advanceTurn,
    updateTokenPosition,
    markPlayerWon,
    addCbtPoints,
    setWalletBalance,
    setCbtPoints,
    recordQuestionPresented,
  } = game;

  const phaseValue = phase as UiPhase;

  const addHistory = useCallback((message: string) => {
    setHistory((previous) => [
      `${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} — ${message}`,
      ...previous,
    ].slice(0, 30));
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  // The question hook owns question charges and question rewards.
  // Keep the displayed game wallet and points synchronized with it.
  useEffect(() => {
    if (game.walletBalance !== questionWalletBalance) {
      setWalletBalance(questionWalletBalance);
    }
  }, [
    game.walletBalance,
    questionWalletBalance,
    setWalletBalance,
  ]);

  useEffect(() => {
    if (game.cbtPoints !== questionCbtPoints) {
      setCbtPoints(questionCbtPoints);
    }
  }, [
    game.cbtPoints,
    questionCbtPoints,
    setCbtPoints,
  ]);

  const currentQuestionForModal = useMemo(
    () => normalizeQuestion(currentQuestion, level),
    [currentQuestion, level],
  );

  const movementPlayers = useMemo(
    () =>
      players.map((player) => ({
        id: player.id,
        color: player.color,
        hasWon: player.hasWon,
        tokens: player.tokens.map((token) => ({
          id: token.id,
          position: token.position,
        })),
      })),
    [players],
  );

  const legalMovementMoves = useMemo(() => {
    if (
      phaseValue !== "playing" ||
      diceValue == null ||
      !currentPlayer
    ) {
      return [];
    }

    return getPlayerLegalMoves(
      movementPlayers.find(
        (player) => player.id === currentPlayer.id,
      )!,
      diceValue,
    );
  }, [
    phaseValue,
    diceValue,
    currentPlayer,
    movementPlayers,
  ]);

const legalBoardMoves = useMemo(
  () =>
    legalMovementMoves.map((move) => ({
      playerId: move.playerId,
      tokenId: getTokenIndex(move.tokenId),
      from: move.from,
      to: move.to,
      diceRoll: move.diceRoll,
      diceValue: move.diceRoll,
    })) as EduLudoMove[],
  [legalMovementMoves],
);

  const boardPlayers = useMemo(
    () =>
      players.map((player) => ({
        ...player,
        tokens: player.tokens.map((token) => {
          const index = getTokenIndex(token.id);
          return {
            ...token,
            id: index >= 0 ? index : token.id,
            status:
              token.position < 0
                ? "base"
                : token.position >= 57
                  ? "home"
                  : "active",
          };
        }),
      })) as unknown as EduLudoPlayer[],
    [players],
  );

  const isHumanTurn =
    Boolean(currentPlayer) && !currentPlayer?.isBot;

  const isQuestionOpen =
    phaseValue === "question" ||
    phaseValue === "feedback";

  const {
    animateMove,
    cancelAnimation,
  } = useEduLudoMovement({
    stepDurationMs: 300,
    onStep: (playerId, tokenId, position) => {
      updateTokenPosition(playerId, tokenId, position);
    },
  });

  const endTurn = useCallback(
    (message?: string) => {
      if (message) {
        notify(message);
        addHistory(message);
      }

      setSelectedTokenId(null);
      setDiceValue(null);
      clearQuestion();
      setQuestionResult(null);
      setAnswerSubmitting(false);
      advanceTurn();
      setPhase("playing");
    },
    [
      notify,
      addHistory,
      setSelectedTokenId,
      setDiceValue,
      clearQuestion,
      setQuestionResult,
      setAnswerSubmitting,
      advanceTurn,
      setPhase,
    ],
  );

  const rollDice = useCallback(
    async (playerId: string, forcedRoll?: number) => {
      if (
        phaseValue !== "playing" ||
        diceRolling ||
        isAnimatingMove ||
        !currentPlayer ||
        currentPlayer.id !== playerId
      ) {
        return;
      }

      setDiceRolling(true);

      const guaranteedSixCount = getGuaranteedSixCount(playerId);
      const roll =
        forcedRoll ??
        (guaranteedSixCount > 0 ? 6 : randomDiceValue());

      if (guaranteedSixCount > 0 && roll === 6) {
        consumeGuaranteedSix(playerId);
      }

      setDiceValue(roll);
      setDiceRolling(false);

      const questionPresented = presentQuestion({
        playerId,
        isHuman: !currentPlayer.isBot,
      });

      if (!questionPresented) {
        notify("Unable to present a question. Check your wallet balance.");
        setDiceValue(null);
        return;
      }

      recordQuestionPresented();
      setRoundQuestion((previous) => previous + 1);
      setQuestionResult(null);
      setPhase("question");

      addHistory(
        `${currentPlayer.name} rolled ${roll}. A question was presented.`,
      );
    },
    [
      phaseValue,
      diceRolling,
      isAnimatingMove,
      currentPlayer,
      getGuaranteedSixCount,
      consumeGuaranteedSix,
      setDiceValue,
      presentQuestion,
      recordQuestionPresented,
      setPhase,
      addHistory,
      notify,
    ],
  );

  const processAnswer = useCallback(
    (answerIndex: number, timedOut = false) => {
      if (
        !currentPlayer ||
        answerSubmitting ||
        questionResult ||
        !currentQuestion
      ) {
        return;
      }

      setAnswerSubmitting(true);

      const result = submitAnswer({
        playerId: currentPlayer.id,
        selectedAnswer: timedOut ? -1 : answerIndex,
        timedOut,
      });

      if (!result) {
        setAnswerSubmitting(false);
        return;
      }

      const modalResult = {
        isCorrect: result.isCorrect,
        selectedAnswer: timedOut ? -1 : answerIndex,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
        pointsAwarded: result.cbtReward,
      } as EduLudoAnswerResult;

      setQuestionResult(modalResult);
      setAnswerSubmitting(false);
      setPhase("feedback");

      if (result.isCorrect) {
        addHistory(
          `${currentPlayer.name} answered correctly.`,
        );
      } else {
        addHistory(
          `${currentPlayer.name} answered incorrectly.`,
        );
      }
    },
    [
      currentPlayer,
      answerSubmitting,
      questionResult,
      currentQuestion,
      submitAnswer,
      setQuestionResult,
      setAnswerSubmitting,
      setPhase,
      addHistory,
    ],
  );

  const continueAfterAnswer = useCallback(() => {
    if (!currentPlayer || !questionResult || diceValue == null) {
      return;
    }

    if (!questionResult.isCorrect) {
      endTurn("Incorrect answer. The turn passes to the next player.");
      return;
    }

    clearQuestion();
    setQuestionResult(null);
    setPhase("playing");

    const freshPlayer = players.find(
      (player) => player.id === currentPlayer.id,
    );

    const freshMovementPlayer = movementPlayers.find(
      (player) => player.id === currentPlayer.id,
    );

    if (!freshPlayer || !freshMovementPlayer) {
      endTurn();
      return;
    }

    const moves = getPlayerLegalMoves(
      freshMovementPlayer,
      diceValue,
    );

    if (moves.length === 0) {
      endTurn("No legal token move. The turn passes.");
    } else {
      notify(
        `${currentPlayer.name}: select one of the highlighted tokens.`,
      );
    }
  }, [
    currentPlayer,
    questionResult,
    diceValue,
    endTurn,
    clearQuestion,
    setPhase,
    players,
    movementPlayers,
    notify,
  ]);

  const handleTokenClick = useCallback(
    async (player: EduLudoPlayer, tokenId: number) => {
      if (
        phaseValue !== "playing" ||
        !currentPlayer ||
        player.id !== currentPlayer.id ||
        diceValue == null ||
        isAnimatingMove
      ) {
        return;
      }

      const stringTokenId = getTokenStringId(
        player.id,
        tokenId,
      );

      const movement = legalMovementMoves.find(
        (move) => move.tokenId === stringTokenId,
      );

      if (!movement) {
        notify("That token cannot move with this dice roll.");
        return;
      }

      setSelectedTokenId(tokenId);
      setIsAnimatingMove(true);
      setPhase("moving");

      const from = movement.from;
      const to = movement.to;

      const succeeded = await animateMove(movement);

      setIsAnimatingMove(false);
      setSelectedTokenId(null);

      if (!succeeded) {
        setPhase("playing");
        return;
      }

      // Resolve a capture when the token lands on a shared,
      // non-safe track square.
      const movedPlayer = players.find(
        (item) => item.id === player.id,
      );

      if (movedPlayer && to >= 0 && to < TRACK_LENGTH) {
        const globalPosition =
          (to + START_POSITIONS[movedPlayer.color]) %
          TRACK_LENGTH;

        if (!SAFE_POSITIONS.has(globalPosition)) {
          for (const opponent of players) {
            if (
              opponent.id === movedPlayer.id ||
              opponent.hasWon
            ) {
              continue;
            }

            for (const opponentToken of opponent.tokens) {
              if (
                opponentToken.position >= 0 &&
                opponentToken.position < TRACK_LENGTH
              ) {
                const opponentGlobalPosition =
                  (opponentToken.position +
                    START_POSITIONS[opponent.color]) %
                  TRACK_LENGTH;

                if (
                  opponentGlobalPosition === globalPosition
                ) {
                  updateTokenPosition(
                    opponent.id,
                    opponentToken.id,
                    -1,
                  );

                  const reward = 200;
                  addCbtPoints(reward);

                  notify(
                    `Token captured! +${reward} CBT points.`,
                  );

                  addHistory(
                    `${movedPlayer.name} captured an opponent token.`,
                  );
                }
              }
            }
          }
        }
      }

      if (to >= 57) {
        addCbtPoints(TOKEN_HOME_REWARD);
        notify(
          `Token reached home! +${TOKEN_HOME_REWARD} CBT points.`,
        );
      }

      const latestPlayer = players.find(
        (item) => item.id === player.id,
      );

      const tokenPositions = latestPlayer?.tokens.map(
        (token) =>
          token.id === stringTokenId ? to : token.position,
      ) ?? [];

      const playerHasWon =
        tokenPositions.length > 0 &&
        tokenPositions.every((position) => position >= 57);

      if (playerHasWon) {
        markPlayerWon(player.id);
        addCbtPoints(WINNER_REWARD);
        setPhase("finished");
        notify(
          `${player.name} wins! +${WINNER_REWARD} CBT points.`,
        );
        addHistory(`${player.name} won the game.`);
        return;
      }

      setDiceValue(null);

      if (diceValue === 6) {
        setPhase("playing");
        notify("You rolled a six. Roll again!");
      } else {
        advanceTurn();
        setPhase("playing");
      }

      addHistory(
        `${player.name} moved token ${tokenId + 1} from ${from} to ${to}.`,
      );
    },
    [
      phaseValue,
      currentPlayer,
      diceValue,
      isAnimatingMove,
      legalMovementMoves,
      notify,
      setSelectedTokenId,
      setIsAnimatingMove,
      setPhase,
      animateMove,
      players,
      updateTokenPosition,
      addCbtPoints,
      addHistory,
      markPlayerWon,
      setDiceValue,
      advanceTurn,
    ],
  );

  const resetGame = useCallback(() => {
    cancelAnimation();
    returnToLobby();
    setPhase("lobby");
    setDiceValue(null);
    setSelectedTokenId(null);
    setQuestionResult(null);
    setAnswerSubmitting(false);
    setDiceRolling(false);
    setIsAnimatingMove(false);
    setRoundQuestion(0);
    setHistory([]);
    resetQuestions();
  }, [
    cancelAnimation,
    returnToLobby,
    setPhase,
    setDiceValue,
    resetQuestions,
  ]);

  const beginGame = useCallback(() => {
    setModeSelection(modeSelection);
    startGame();
    setPhase("playing");
    setDiceValue(null);
    setSelectedTokenId(null);
    setQuestionResult(null);
    setHistory([]);
    setRoundQuestion(0);
    addHistory("A new Educational Ludo match started.");
  }, [
    modeSelection,
    startGame,
    setPhase,
    setDiceValue,
    addHistory,
  ]);

  // The bot hook handles automated rolls, answers and token selection.
  useEduLudoBots({
    phase: phaseValue,
    currentPlayer,
    difficulty,
    guaranteedSixBonuses: {},
    onRollDice: (playerId, forcedRoll) => {
      void rollDice(playerId, forcedRoll);
    },
    onAnswerQuestion: (_playerId, answerIndex) => {
      if (!currentQuestion) return;

      const correctIndex = currentQuestion.correctAnswer;
      const selectedIndex =
        answerIndex === 0
          ? correctIndex
          : (correctIndex + 1) % 4;

      processAnswer(selectedIndex);
    },
    onContinueAfterFeedback: () => {
      continueAfterAnswer();
    },
    onSelectToken: (playerId) => {
      const legalMove = legalMovementMoves.find(
        (move) => move.playerId === playerId,
      );

      if (!legalMove) {
        endTurn("No legal move available.");
        return;
      }

      const tokenIndex = getTokenIndex(legalMove.tokenId);
      const player = boardPlayers.find(
        (item) => item.id === playerId,
      );

      if (player && tokenIndex >= 0) {
        void handleTokenClick(player, tokenIndex);
      }
    },
    hasLegalMoves: legalMovementMoves.length > 0,
    isAnimatingMove,
    isRolling: diceRolling,
    hasQuestion: Boolean(currentQuestion),
    lastAnswerCorrect: questionResult?.isCorrect ?? false,
    onConsumeGuaranteedSix: (playerId) =>
      consumeGuaranteedSix(playerId),
  });

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack ?? resetGame}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
              aria-label="Go back"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Learnyfi Games
              </p>
              <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                Educational Ludo
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2">
              <Wallet size={17} className="text-emerald-600" />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  Wallet
                </p>
                <p className="text-sm font-black text-slate-900">
                  ₦{Number(questionWalletBalance).toLocaleString("en-NG")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2">
              <Coins size={17} className="text-amber-600" />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  CBT points
                </p>
                <p className="text-sm font-black text-slate-900">
                  {Number(questionCbtPoints).toLocaleString("en-NG")}
                </p>
              </div>
            </div>

            {onFundWallet && (
              <button
                type="button"
                onClick={onFundWallet}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Fund wallet
              </button>
            )}
          </div>
        </header>

        {toast && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800"
          >
            {toast}
          </div>
        )}

        {phaseValue === "lobby" ? (
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Set up your game
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Choose your learning subject and difficulty, then
                    start playing.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Game mode
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(
                      [
                        ["solo", "Solo vs Bot"],
                        ["friends", "Friends"],
                        ["classroom", "Classroom"],
                        ["tournament", "Tournament"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setModeSelection(value)}
                        className={[
                          "rounded-xl border px-3 py-3 text-sm font-bold transition",
                          modeSelection === value
                            ? "border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {modeSelection !== "solo" && (
                    <p className="mt-2 text-xs leading-5 text-amber-700">
                      This local game screen does not connect remote
                      players. The selected mode is a setup preference.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edu-ludo-subject"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Subject
                  </label>
                  <select
                    id="edu-ludo-subject"
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value as LudoSubjectFilter)
                    }
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {SUBJECTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="edu-ludo-difficulty"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Difficulty
                    </label>
                    <select
                      id="edu-ludo-difficulty"
                      value={difficulty}
                      onChange={(event) =>
                        setDifficulty(
                          event.target.value as LudoDifficulty,
                        )
                      }
                      className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {DIFFICULTIES.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="edu-ludo-level"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Education level
                    </label>
                    <select
                      id="edu-ludo-level"
                      value={level}
                      onChange={(event) => setLevel(event.target.value)}
                      className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {LEVELS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Your token colour
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setHumanColor(color)}
                        aria-pressed={humanColor === color}
                        className={[
                          "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold capitalize transition",
                          humanColor === color
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white",
                        ].join(" ")}
                      >
                        <span
                          className={`h-4 w-4 rounded-full ${COLOR_STYLES[color].bg}`}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={beginGame}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Zap size={18} />
                  Start Educational Ludo
                </button>
              </div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-700 to-violet-700 p-5 text-white shadow-sm">
                <h3 className="text-lg font-black">How to play</h3>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-indigo-50">
                  <li>1. Roll the dice to receive a question.</li>
                  <li>2. Each presented question costs ₦{QUESTION_COST}.</li>
                  <li>3. Answer correctly to unlock a token move.</li>
                  <li>4. Select a highlighted token to move it.</li>
                  <li>5. Reach home with all four tokens to win.</li>
                </ol>
              </section>

              <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2 text-amber-900">
                  <Coins size={19} />
                  <h3 className="font-extrabold">Rewards</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  Earn CBT points through correct answers, captures,
                  reaching home and winning. The question charge is
                  taken when a question is successfully presented.
                </p>
              </section>
            </aside>
          </div>
        ) : (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <main className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    {phaseValue === "finished"
                      ? "Game complete"
                      : "Your game board"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Question {roundQuestion} · {subject} · {difficulty}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <RotateCcw size={16} />
                  Restart
                </button>
              </div>

              {phaseValue === "finished" ? (
                <section className="rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Trophy size={32} />
                  </div>
                  <h3 className="mt-4 text-2xl font-black text-slate-900">
                    Congratulations!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    The match has ended.
                  </p>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    Play again
                  </button>
                </section>
              ) : (
                <LudoBoard
                  players={boardPlayers}
                  currentPlayerId={currentPlayer?.id}
                  legalMoves={legalBoardMoves}
                  selectedTokenId={selectedTokenId}
                  diceValue={diceValue}
                  disabled={
                    !isHumanTurn ||
                    phaseValue !== "playing" ||
                    diceRolling ||
                    isAnimatingMove
                  }
                  onTokenClick={handleTokenClick}
                  onDiceClick={() => {
                    if (currentPlayer && !currentPlayer.isBot) {
                      void rollDice(currentPlayer.id);
                    }
                  }}
                  showDice
                  movementCount={0}
                  isMoving={isAnimatingMove}
                />
              )}

              {phaseValue === "playing" &&
                currentPlayer &&
                !currentPlayer.isBot &&
                diceValue == null && (
                  <div className="mt-4 rounded-2xl border border-indigo-100 bg-white p-4">
                    <p className="text-sm font-bold text-slate-900">
                      Your turn
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Roll the dice on the board. A question will appear
                      before you can move a token.
                    </p>
                  </div>
                )}

              {phaseValue === "playing" &&
                currentPlayer &&
                diceValue != null &&
                legalMovementMoves.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-extrabold text-emerald-900">
                      Select a highlighted token
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      You answered correctly. Choose a legal token to
                      move {diceValue} square{diceValue === 1 ? "" : "s"}.
                    </p>
                  </div>
                )}
            </main>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-extrabold text-slate-900">
                  Players
                </h3>
                <div className="mt-3 space-y-3">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={[
                        "flex items-center justify-between gap-3 rounded-xl border p-3",
                        player.id === currentPlayer?.id
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-slate-100 bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`h-3.5 w-3.5 shrink-0 rounded-full ${COLOR_STYLES[player.color].bg}`}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {player.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {player.isBot ? "Bot" : "You"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {player.tokens.filter(
                          (token) => token.position >= 57,
                        ).length}
                        /{TOKENS_PER_PLAYER}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-extrabold text-slate-900">
                  Match details
                </h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Mode</dt>
                    <dd className="font-bold capitalize text-slate-800">
                      {modeSelection}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Question cost</dt>
                    <dd className="font-bold text-slate-800">
                      ₦{QUESTION_COST}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Question timer</dt>
                    <dd className="font-bold text-slate-800">
                      {QUESTION_TIME_LIMIT}s
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Questions shown</dt>
                    <dd className="font-bold text-slate-800">
                      {roundQuestion}
                    </dd>
                  </div>
                </dl>
              </section>

              <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-extrabold text-slate-800">
                  Match history ({history.length})
                </summary>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No match events yet.
                    </p>
                  ) : (
                    history.map((item, index) => (
                      <p
                        key={`${index}-${item}`}
                        className="border-b border-slate-100 pb-2 text-xs leading-5 text-slate-600 last:border-0"
                      >
                        {item}
                      </p>
                    ))
                  )}
                </div>
              </details>
            </aside>
          </div>
        )}
      </div>

      <QuestionModal
        question={currentQuestionForModal}
        open={isQuestionOpen}
        timeLimit={QUESTION_TIME_LIMIT}
        questionCost={QUESTION_COST}
        disabled={phaseValue !== "question"}
        submitting={answerSubmitting}
        result={questionResult}
        onAnswer={(answerIndex) => processAnswer(answerIndex)}
        onTimeUp={() => processAnswer(-1, true)}
        onContinue={continueAfterAnswer}
        showTimer
        showCost
        allowClose={false}
      />
    </div>
  );
}