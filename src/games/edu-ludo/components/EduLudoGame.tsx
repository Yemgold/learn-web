
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

import { useEduLudoGame } from "../hook/useEduLudoGame";
import { useEduLudoQuestions } from "../hook/useEduLudoQuestions";
import {
  useEduLudoMovement,
  getPlayerLegalMoves,
} from "../hook/useEduLudoMovement";
import { useEduLudoBots } from "../hook/useEduLudoBots";

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

const COLORS: EduLudoColor[] = ["red", "green", "yellow", "blue"];

const SUBJECTS: LudoSubjectFilter[] = [
  "All Subjects",
  "Mathematics",
  "English",
  "Science",
  "Biology",
  "Chemistry",
  "Physics",
];

const DIFFICULTIES: LudoDifficulty[] = ["easy", "medium", "hard"];
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
    subject: typeof raw.subject === "string" ? raw.subject : "General",
    level: typeof raw.level === "string" ? raw.level : level,
    difficulty:
      typeof raw.difficulty === "string" ? raw.difficulty : "medium",
    content:
      typeof raw.content === "string"
        ? raw.content
        : typeof raw.question === "string"
          ? raw.question
          : "Answer the following question.",
    options: options.map(String),
    correctAnswer: raw.correctAnswer,
    explanation:
      typeof raw.explanation === "string" ? raw.explanation : "",
  } as EduLudoQuestion;
}

export default function EduLudoGame({
  initialBalance = INITIAL_WALLET_BALANCE,
  initialCbtPoints = INITIAL_CBT_POINTS,
  onBack,
  onFundWallet,
}: Props) {
  const [modeSelection, setModeSelection] = useState<UiMode>("solo");
  const [subject, setSubject] =
    useState<LudoSubjectFilter>("All Subjects");
  const [difficulty, setDifficulty] =
    useState<LudoDifficulty>("medium");
  const [level, setLevel] = useState<string>("JAMB");
  const [humanColor, setHumanColor] = useState<EduLudoColor>("red");

  const [diceRolling, setDiceRolling] = useState(false);
  const [isAnimatingMove, setIsAnimatingMove] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(
    null,
  );
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
    onCbtReward: () => {},
  });

  const {
    walletBalance: questionWalletBalance,
    cbtPoints: questionCbtPoints,
    currentQuestion,
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
    turnIndex,
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
    setHistory((previous) =>
      [
        `${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} — ${message}`,
        ...previous,
      ].slice(0, 30),
    );
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (game.walletBalance !== questionWalletBalance) {
      setWalletBalance(questionWalletBalance);
    }
  }, [game.walletBalance, questionWalletBalance, setWalletBalance]);

  useEffect(() => {
    if (game.cbtPoints !== questionCbtPoints) {
      setCbtPoints(questionCbtPoints);
    }
  }, [game.cbtPoints, questionCbtPoints, setCbtPoints]);

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

    const movementPlayer = movementPlayers.find(
      (player) => player.id === currentPlayer.id,
    );

    if (!movementPlayer) return [];

    return getPlayerLegalMoves(movementPlayer, diceValue);
  }, [phaseValue, diceValue, currentPlayer, movementPlayers]);

 const legalBoardMoves = useMemo(
  () =>
    legalMovementMoves.flatMap((move) => {
      const movementPlayer = movementPlayers.find(
        (player) => player.id === move.playerId,
      );

      const tokenIndex =
        movementPlayer?.tokens.findIndex(
          (token) => token.id === move.tokenId,
        ) ?? -1;

      // Do not create a board move for an unmatched token.
      if (tokenIndex < 0) return [];

      return [
        {
          playerId: move.playerId,
          tokenId: tokenIndex,
          from: move.from,
          to: move.to,
          diceRoll: move.diceRoll,
          diceValue: move.diceRoll,
        },
      ];
    }),
  [legalMovementMoves, movementPlayers],
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

  const isHumanTurn = Boolean(currentPlayer && !currentPlayer.isBot);
  const isBotTurn = Boolean(currentPlayer?.isBot);
  const isQuestionOpen =
    phaseValue === "question" || phaseValue === "feedback";

  const { animateMove, cancelAnimation } = useEduLudoMovement({
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
      setDiceValue,
      clearQuestion,
      advanceTurn,
      setPhase,
    ],
  );

  const rollDice = useCallback(
    (playerId: string, forcedRoll?: number) => {
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

      const questionPresented = presentQuestion({
        playerId,
        isHuman: !currentPlayer.isBot,
      });

      setDiceRolling(false);

      if (!questionPresented) {
        notify(
          currentPlayer.isBot
            ? "The bot could not receive a question."
            : "Unable to present a question. Check your wallet balance.",
        );
        setDiceValue(null);
        return;
      }

      recordQuestionPresented();
      setRoundQuestion((previous) => previous + 1);
      setQuestionResult(null);
      setAnswerSubmitting(false);
      setPhase("question");

      addHistory(`${currentPlayer.name} rolled ${roll}.`);
      notify(
        currentPlayer.isBot
          ? `${currentPlayer.name} rolled ${roll} and is answering a question.`
          : `You rolled ${roll}. Answer the question to unlock your move.`,
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

      addHistory(
        `${currentPlayer.name} answered ${
          result.isCorrect ? "correctly" : "incorrectly"
        }.`,
      );

      notify(
        result.isCorrect
          ? `${currentPlayer.name} answered correctly!`
          : `${currentPlayer.name} answered incorrectly.`,
      );
    },
    [
      currentPlayer,
      answerSubmitting,
      questionResult,
      currentQuestion,
      submitAnswer,
      setPhase,
      addHistory,
      notify,
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

    const activePlayerId = currentPlayer.id;

    clearQuestion();
    setQuestionResult(null);
    setPhase("playing");

    const freshMovementPlayer = movementPlayers.find(
      (player) => player.id === activePlayerId,
    );

    if (!freshMovementPlayer) {
      endTurn();
      return;
    }

    const moves = getPlayerLegalMoves(freshMovementPlayer, diceValue);

    if (moves.length === 0) {
      endTurn("No legal token move. The turn passes.");
    } else {
      notify(
        currentPlayer.isBot
          ? `${currentPlayer.name} is choosing a token...`
          : "Select one of the highlighted tokens.",
      );
    }
  }, [
    currentPlayer,
    questionResult,
    diceValue,
    endTurn,
    clearQuestion,
    setPhase,
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

      // A bot's move must only be triggered by the bot controller.
      if (player.isBot && isHumanTurn) return;

     const movementPlayer = movementPlayers.find(
  (item) => item.id === player.id,
);

const actualToken = movementPlayer?.tokens[tokenId];
const stringTokenId = actualToken?.id;

if (!stringTokenId) {
  notify("Could not identify this token. Please try again.");
  return;
}

const movement = legalMovementMoves.find(
  (move) =>
    move.playerId === player.id &&
    move.tokenId === stringTokenId,
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

      const movedPlayer = players.find((item) => item.id === player.id);

      if (movedPlayer && to >= 0 && to < TRACK_LENGTH) {
        const globalPosition =
          (to + START_POSITIONS[movedPlayer.color]) % TRACK_LENGTH;

        if (!SAFE_POSITIONS.has(globalPosition)) {
          for (const opponent of players) {
            if (opponent.id === movedPlayer.id || opponent.hasWon) {
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

                if (opponentGlobalPosition === globalPosition) {
                  updateTokenPosition(
                    opponent.id,
                    opponentToken.id,
                    -1,
                  );

                  addCbtPoints(200);
                  notify(
                    `${movedPlayer.name} captured a token! +200 CBT points.`,
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
          `${movedPlayer?.name ?? player.name} reached home! +${TOKEN_HOME_REWARD} CBT points.`,
        );
      }

      const latestPlayer = players.find((item) => item.id === player.id);
      const tokenPositions =
        latestPlayer?.tokens.map((token) =>
          token.id === stringTokenId ? to : token.position,
        ) ?? [];

      const playerHasWon =
        tokenPositions.length > 0 &&
        tokenPositions.every((position) => position >= 57);

      if (playerHasWon) {
        markPlayerWon(player.id);
        addCbtPoints(WINNER_REWARD);
        setDiceValue(null);
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
        notify(
          `${player.name} rolled a six and gets another turn.`,
        );
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
      isHumanTurn,
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
    startGame();
    setPhase("playing");
    setDiceValue(null);
    setSelectedTokenId(null);
    setQuestionResult(null);
    setHistory([]);
    setRoundQuestion(0);
    addHistory("A new Educational Ludo match started.");
  }, [startGame, setPhase, setDiceValue, addHistory]);

  useEduLudoBots({
    phase: phaseValue,
    currentPlayer,
    difficulty,
    guaranteedSixBonuses: {},
    onRollDice: (playerId, forcedRoll) => {
      rollDice(playerId, forcedRoll);
    },

    // The bot hook uses index 0 to mean "answer correctly".
    // Indices 1–3 mean "choose a wrong answer". Convert that
    // intention into a real option index for this question.
    
onAnswerQuestion: (_playerId, answerIntent) => {
  if (!currentQuestion) return;

  const correctIndex = currentQuestion.correctAnswer;

  const selectedIndex =
    answerIntent === 0
      ? correctIndex
      : (() => {
          const wrongOptions = [0, 1, 2, 3].filter(
            (index) => index !== correctIndex,
          );

          return wrongOptions[
            Math.floor(Math.random() * wrongOptions.length)
          ];
        })();

  processAnswer(selectedIndex);
},

    onContinueAfterFeedback: continueAfterAnswer,

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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
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
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
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
                    Choose your learning subject and difficulty, then start playing.
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
                      This local game screen does not connect remote players. The selected mode is a setup preference.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="edu-ludo-subject" className="mb-2 block text-sm font-bold text-slate-700">
                    Subject
                  </label>
                  <select
                    id="edu-ludo-subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value as LudoSubjectFilter)}
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {SUBJECTS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edu-ludo-difficulty" className="mb-2 block text-sm font-bold text-slate-700">
                      Difficulty
                    </label>
                    <select
                      id="edu-ludo-difficulty"
                      value={difficulty}
                      onChange={(event) => setDifficulty(event.target.value as LudoDifficulty)}
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
                    <label htmlFor="edu-ludo-level" className="mb-2 block text-sm font-bold text-slate-700">
                      Education level
                    </label>
                    <select
                      id="edu-ludo-level"
                      value={level}
                      onChange={(event) => setLevel(event.target.value)}
                      className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {LEVELS.map((item) => (
                        <option key={item} value={item}>{item}</option>
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
                        <span className={`h-4 w-4 rounded-full ${COLOR_STYLES[color].bg}`} />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={beginGame}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-700"
                >
                  <Zap size={18} />
                  Start Educational Ludo
                </button>
              </div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-3xl bg-gradient-to-br from-indigo-700 to-violet-700 p-5 text-white shadow-sm">
                <h3 className="text-lg font-black">How to play</h3>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-indigo-50">
                  <li>1. Roll the dice to receive a question.</li>
                  <li>2. Each presented human question costs ₦{QUESTION_COST}.</li>
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
                  Earn CBT points through correct answers, captures, reaching home and winning. Bot questions do not deduct money from your wallet.
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
                    {phaseValue === "finished" ? "Game complete" : "Your game board"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Question {roundQuestion} · {subject} · {difficulty}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
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
                  <p className="mt-2 text-sm text-slate-600">The match has ended.</p>
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
                    diceValue != null ||
                    diceRolling ||
                    isAnimatingMove
                  }
                  onTokenClick={handleTokenClick}
                  onDiceClick={() => {
                    if (currentPlayer && !currentPlayer.isBot) {
                      rollDice(currentPlayer.id);
                    }
                  }}
                  showDice
                  movementCount={0}
                  isMoving={isAnimatingMove}
                />
              )}

              {phaseValue === "playing" && currentPlayer && (
                <div className={`mt-4 rounded-2xl border p-5 shadow-sm ${
                  isBotTurn
                    ? "border-violet-200 bg-violet-50"
                    : "border-indigo-200 bg-white"
                }`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-extrabold text-slate-900">
                        {isBotTurn
                          ? `${currentPlayer.name}'s turn`
                          : diceValue == null
                            ? "Your turn to roll!"
                            : "Choose your token"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {isBotTurn
                          ? "Watch the bot roll, answer its question, and move its token automatically."
                          : diceValue == null
                            ? "Roll the dice to receive your question. Answer correctly to unlock your token movement."
                            : "Select one of the highlighted tokens to move."}
                      </p>
                    </div>

                    {!isBotTurn && diceValue == null && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            currentPlayer &&
                            !currentPlayer.isBot &&
                            phaseValue === "playing" &&
                            diceValue == null &&
                            !diceRolling &&
                            !isAnimatingMove
                          ) {
                            rollDice(currentPlayer.id);
                          }
                        }}
                        disabled={diceRolling || isAnimatingMove}
                        className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-7 py-4 text-base font-extrabold text-white shadow-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Zap size={21} />
                        {diceRolling ? "Rolling..." : "Roll Dice"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {phaseValue === "playing" &&
                currentPlayer &&
                !currentPlayer.isBot &&
                diceValue != null &&
                legalMovementMoves.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-extrabold text-emerald-900">
                      Select a highlighted token
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      You answered correctly. Choose a legal token to move {diceValue} square{diceValue === 1 ? "" : "s"}.
                    </p>
                  </div>
                )}
            </main>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-extrabold text-slate-900">Players</h3>
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
                        <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${COLOR_STYLES[player.color].bg}`} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">{player.name}</p>
                          <p className="text-xs text-slate-500">
                            {player.isBot ? "Bot opponent" : "You"}
                            {player.id === currentPlayer?.id ? " · Playing now" : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {player.tokens.filter((token) => token.position >= 57).length}/{TOKENS_PER_PLAYER}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-extrabold text-slate-900">Match details</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Mode</dt>
                    <dd className="font-bold capitalize text-slate-800">{modeSelection}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Question cost</dt>
                    <dd className="font-bold text-slate-800">₦{QUESTION_COST}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Human timer</dt>
                    <dd className="font-bold text-slate-800">{QUESTION_TIME_LIMIT}s</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Questions shown</dt>
                    <dd className="font-bold text-slate-800">{roundQuestion}</dd>
                  </div>
                </dl>
              </section>

              <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-extrabold text-slate-800">
                  Match history ({history.length})
                </summary>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-500">No match events yet.</p>
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
        disabled={
          phaseValue !== "question" ||
          isBotTurn ||
          answerSubmitting
        }
        submitting={answerSubmitting}
        result={questionResult}
        onAnswer={(answerIndex) => processAnswer(answerIndex)}
        onTimeUp={() => {
          if (isHumanTurn && phaseValue === "question") {
            processAnswer(-1, true);
          }
        }}
        onContinue={continueAfterAnswer}
        showTimer={isHumanTurn}
        showCost={isHumanTurn}
        allowClose={false}
      />
    </div>
  );
}























// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   ArrowLeft,
//   BookOpen,
//   Coins,
//   History,
//   Info,
//   RotateCcw,
//   Trophy,
//   Wallet,
//   Zap,
// } from "lucide-react";

// import type {
//   EduLudoAnswerResult,
//   EduLudoColor,
//   EduLudoDifficulty,
//   EduLudoLevel,
//   EduLudoMode,
//   EduLudoMove,
//   EduLudoPlayer,
//   EduLudoQuestion,
//   EduLudoSubject,
//   EduLudoTransaction,
// } from "./eduLudoTypes";

// import {
//   CAPTURE_REWARD,
//   COLOR_STYLES,
//   INITIAL_CBT_POINTS,
//   INITIAL_WALLET_BALANCE,
//   QUESTION_COST,
//   QUESTION_TIME_LIMIT,
//   TOKEN_HOME_REWARD,
//   TOKENS_PER_PLAYER,
//   WINNER_REWARD,
// } from "./eduLudoConstants";

// import EduLudoLobby from "./EduLudoLobby";
// import LudoBoard from "./LudoBoard";
// import LudoPlayersPanel from "./LudoPlayersPanel";
// import QuestionModal from "./QuestionModal";
// import LudoGameDialogs from "./LudoGameDialogs";

// type Phase =
//   | "lobby"
//   | "playing"
//   | "question"
//   | "feedback"
//   | "moving"
//   | "finished";

// type Dialog = "rules" | "wallet" | "rewards" | "history" | null;

// type LocalToken = {
//   id: number;
//   position: number;
//   status?: "base" | "track" | "home";
// };

// type LocalPlayer = EduLudoPlayer & {
//   id: string;
//   name: string;
//   color: EduLudoColor;
//   isBot: boolean;
//   hasWon: boolean;
//   score: number;
//   tokens: LocalToken[];
// };

// type LocalQuestion = {
//   id: string;
//   subject: string;
//   level: string;
//   difficulty: EduLudoDifficulty;
//   content: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
// };

// type LocalTransaction = {
//   id: string;
//   type: "credit" | "debit";
//   description: string;
//   amount: number;
//   createdAt: string;
//   balanceAfter: number;
// };

// type Props = {
//   initialBalance?: number;
//   initialCbtPoints?: number;
//   onBack?: () => void;
//   onFundWallet?: () => void;
// };

// const TRACK_LENGTH = 52;
// const FINISH_POSITION = 57;
// const MOVEMENT_STEP_MS = 300;
// const BOT_FEEDBACK_MS = 5000;
// const CORRECT_ANSWERS_FOR_BONUS = 6;

// const START_POSITIONS: Record<EduLudoColor, number> = {
//   red: 0,
//   green: 13,
//   yellow: 39,
//   blue: 26,
// };

// const SAFE_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// const DIFFICULTY_POINTS: Record<EduLudoDifficulty, number> = {
//   easy: 20,
//   medium: 30,
//   hard: 40,
// };

// const QUESTION_BANK: LocalQuestion[] = [
//   {
//     id: "math-001",
//     subject: "Mathematics",
//     level: "JAMB",
//     difficulty: "easy",
//     content: "What is 15% of 200?",
//     options: ["15", "20", "30", "35"],
//     correctAnswer: 2,
//     explanation: "15% of 200 = 0.15 × 200 = 30.",
//   },
//   {
//     id: "math-002",
//     subject: "Mathematics",
//     level: "JAMB",
//     difficulty: "medium",
//     content: "Solve for x: 3x + 7 = 22.",
//     options: ["3", "5", "7", "9"],
//     correctAnswer: 1,
//     explanation: "Subtract 7 to get 3x = 15, then divide by 3.",
//   },
//   {
//     id: "math-003",
//     subject: "Mathematics",
//     level: "JAMB",
//     difficulty: "hard",
//     content: "If x² − 5x + 6 = 0, what are the roots?",
//     options: ["1 and 6", "−2 and −3", "2 and 3", "−1 and −6"],
//     correctAnswer: 2,
//     explanation: "Factorise as (x − 2)(x − 3) = 0.",
//   },
//   {
//     id: "eng-001",
//     subject: "English",
//     level: "JAMB",
//     difficulty: "easy",
//     content: "Choose the word nearest in meaning to 'diligent'.",
//     options: ["Careless", "Hardworking", "Impatient", "Weak"],
//     correctAnswer: 1,
//     explanation: "Diligent means careful and hardworking.",
//   },
//   {
//     id: "eng-002",
//     subject: "English",
//     level: "JAMB",
//     difficulty: "medium",
//     content: "Choose the correct sentence.",
//     options: [
//       "She have finished her work.",
//       "She has finish her work.",
//       "She has finished her work.",
//       "She having finished her work.",
//     ],
//     correctAnswer: 2,
//     explanation: "'Has finished' is the correct present perfect form.",
//   },
//   {
//     id: "sci-001",
//     subject: "Science",
//     level: "JAMB",
//     difficulty: "easy",
//     content: "Which organ pumps blood around the human body?",
//     options: ["Liver", "Kidney", "Heart", "Lung"],
//     correctAnswer: 2,
//     explanation: "The heart pumps blood through the circulatory system.",
//   },
//   {
//     id: "bio-001",
//     subject: "Biology",
//     level: "JAMB",
//     difficulty: "medium",
//     content: "Which cell organelle is mainly responsible for photosynthesis?",
//     options: ["Nucleus", "Chloroplast", "Ribosome", "Mitochondrion"],
//     correctAnswer: 1,
//     explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis.",
//   },
//   {
//     id: "chem-001",
//     subject: "Chemistry",
//     level: "JAMB",
//     difficulty: "medium",
//     content: "What is the chemical symbol for sodium?",
//     options: ["So", "S", "Na", "N"],
//     correctAnswer: 2,
//     explanation: "Sodium's chemical symbol is Na.",
//   },
//   {
//     id: "phy-001",
//     subject: "Physics",
//     level: "JAMB",
//     difficulty: "medium",
//     content: "What is the SI unit of force?",
//     options: ["Joule", "Watt", "Pascal", "Newton"],
//     correctAnswer: 3,
//     explanation: "Force is measured in newtons (N).",
//   },
// ];

// function money(amount: number) {
//   return `₦${Math.max(0, amount).toLocaleString("en-NG")}`;
// }

// function getTokenStatus(token: LocalToken): "base" | "track" | "home" {
//   if (token.status) return token.status;
//   if (token.position >= FINISH_POSITION) return "home";
//   if (token.position < 0) return "base";
//   return "track";
// }

// function makePlayers(
//   humanColor: EduLudoColor,
//   _difficulty: EduLudoDifficulty,
// ): LocalPlayer[] {
//   const colors: EduLudoColor[] = [
//     humanColor,
//     ...(["red", "green", "yellow", "blue"] as EduLudoColor[]).filter(
//       (color) => color !== humanColor,
//     ),
//   ];

//   const botNames = ["Ada", "Tunde", "Zara"];

//   return colors.map((color, index) => {
//     const isBot = index !== 0;

//     return {
//       id: isBot ? `bot-${index}` : "human",
//       name: isBot ? botNames[index - 1] : "You",
//       color,
//       isBot,
//       hasWon: false,
//       score: 0,
//       tokens: Array.from({ length: TOKENS_PER_PLAYER }, (_, tokenIndex) => ({
//         id: tokenIndex,
//         position: -1,
//         status: "base" as const,
//       })),
//     };
//   });
// }

// function asSharedPlayer(player: LocalPlayer): EduLudoPlayer {
//   return player as EduLudoPlayer;
// }

// function asSharedQuestion(question: LocalQuestion): EduLudoQuestion {
//   return question as EduLudoQuestion;
// }

// function asSharedMove(move: {
//   playerId: string;
//   tokenId: number;
//   fromPosition: number;
//   toPosition: number;
//   diceValue: number;
// }): EduLudoMove {
//   return {
//     playerId: move.playerId,
//     tokenId: move.tokenId,
//     from: move.fromPosition,
//     to: move.toPosition,
//     diceValue: move.diceValue,
//   } as unknown as EduLudoMove;
// }

// function randomQuestion(
//   subject: EduLudoSubject,
//   level: EduLudoLevel,
//   difficulty: EduLudoDifficulty,
//   seen: string[],
// ): LocalQuestion {
//   let pool = QUESTION_BANK.filter(
//     (item) =>
//       (subject === "All Subjects" || item.subject === subject) &&
//       (item.level === level || level === "Custom") &&
//       item.difficulty === difficulty &&
//       !seen.includes(item.id),
//   );

//   if (pool.length === 0) {
//     pool = QUESTION_BANK.filter(
//       (item) =>
//         (subject === "All Subjects" || item.subject === subject) &&
//         !seen.includes(item.id),
//     );
//   }

//   if (pool.length === 0) {
//     pool = QUESTION_BANK.filter(
//       (item) => subject === "All Subjects" || item.subject === subject,
//     );
//   }

//   if (pool.length === 0) pool = QUESTION_BANK;

//   return pool[Math.floor(Math.random() * pool.length)];
// }

// function wait(ms: number) {
//   return new Promise<void>((resolve) => setTimeout(resolve, ms));
// }

// export default function EduLudoGame({
//   initialBalance = INITIAL_WALLET_BALANCE,
//   initialCbtPoints = INITIAL_CBT_POINTS,
//   onBack,
//   onFundWallet,
// }: Props) {
//   const [mode, setMode] = useState<EduLudoMode>("solo");
//   const [subject, setSubject] = useState<EduLudoSubject>("All Subjects");
//   const [level, setLevel] = useState<EduLudoLevel>("JAMB");
//   const [difficulty, setDifficulty] =
//     useState<EduLudoDifficulty>("medium");
//   const [playerColor, setPlayerColor] = useState<EduLudoColor>("red");

//   const [balance, setBalance] = useState(initialBalance);
//   const [cbtPoints, setCbtPoints] = useState(initialCbtPoints);
//   const [players, setPlayers] = useState<LocalPlayer[]>([]);
//   const [turn, setTurn] = useState(0);
//   const [phase, setPhase] = useState<Phase>("lobby");
//   const [diceValue, setDiceValue] = useState<number | null>(null);
//   const [question, setQuestion] = useState<LocalQuestion | null>(null);
//   const [answerResult, setAnswerResult] =
//     useState<EduLudoAnswerResult | null>(null);
//   const [legalMoves, setLegalMoves] = useState<EduLudoMove[]>([]);
//   const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
//   const [dialog, setDialog] = useState<Dialog>(null);
//   const [showExitConfirmation, setShowExitConfirmation] = useState(false);
//   const [toast, setToast] = useState("");
//   const [questionCount, setQuestionCount] = useState(0);
//   const [matchReward, setMatchReward] = useState(0);
//   const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
//   const [seenQuestions, setSeenQuestions] = useState<string[]>([]);
//   const [isRolling, setIsRolling] = useState(false);
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
//   const [isAnimatingMove, setIsAnimatingMove] = useState(false);
//   const [movementCount, setMovementCount] = useState(0);

//   // Learning streaks and earned bonuses are stored separately per player ID.
//   const [learningStreaks, setLearningStreaks] = useState<
//     Record<string, number>
//   >({});
//   const [guaranteedSixBonuses, setGuaranteedSixBonuses] = useState<
//     Record<string, number>
//   >({});

//   const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const rollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const answerGuardRef = useRef(false);
//   const movementLockRef = useRef(false);
//   const mountedRef = useRef(true);

//   const currentPlayer = players[turn] ?? null;
//   const currentStreak = currentPlayer
//     ? learningStreaks[currentPlayer.id] ?? 0
//     : 0;
//   const currentBonuses = currentPlayer
//     ? guaranteedSixBonuses[currentPlayer.id] ?? 0
//     : 0;

//   const notify = useCallback((message: string) => {
//     setToast(message);
//   }, []);

//   useEffect(() => {
//     mountedRef.current = true;

//     return () => {
//       mountedRef.current = false;
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//       if (rollTimerRef.current) clearTimeout(rollTimerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (!toast) return;
//     const timeout = setTimeout(() => setToast(""), 2600);
//     return () => clearTimeout(timeout);
//   }, [toast]);

//   const addTransaction = useCallback(
//     (
//       type: "credit" | "debit",
//       description: string,
//       amount: number,
//     ) => {
//       setTransactions((previous) => [
//         {
//           id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
//           type,
//           description,
//           amount,
//           createdAt: new Date().toISOString(),
//           balanceAfter: Math.max(
//             0,
//             balance + (type === "credit" ? amount : -amount),
//           ),
//         },
//         ...previous,
//       ]);
//     },
//     [balance],
//   );

//   const awardCbt = useCallback(
//     (playerId: string, amount: number, description: string) => {
//       if (amount <= 0) return;

//       setPlayers((previous) =>
//         previous.map((player) =>
//           player.id === playerId
//             ? { ...player, score: player.score + amount }
//             : player,
//         ),
//       );

//       const player = players.find((item) => item.id === playerId);

//       if (player && !player.isBot) {
//         setCbtPoints((value) => value + amount);
//         setMatchReward((value) => value + amount);
//         addTransaction("credit", description, amount);
//         notify(`+${amount} CBT Points earned`);
//       }
//     },
//     [players, addTransaction, notify],
//   );

//   const clearQuestionState = useCallback(() => {
//     setQuestion(null);
//     setAnswerResult(null);
//     setSelectedAnswer(null);
//     setLegalMoves([]);
//     setSelectedTokenId(null);
//     setMovementCount(0);
//     answerGuardRef.current = false;
//   }, []);

//   const startGame = useCallback(() => {
//     if (mode !== "solo") {
//       notify("Multiplayer modes are coming soon. Solo mode is available now.");
//       return;
//     }

//     if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     if (rollTimerRef.current) clearTimeout(rollTimerRef.current);

//     movementLockRef.current = false;
//     setIsAnimatingMove(false);
//     setPlayers(makePlayers(playerColor, difficulty));
//     setTurn(0);
//     setPhase("playing");
//     setDiceValue(null);
//     clearQuestionState();
//     setQuestionCount(0);
//     setMatchReward(0);
//     setSeenQuestions([]);
//     setIsRolling(false);
//     setLearningStreaks({});
//     setGuaranteedSixBonuses({});
//     setToast("");
//     answerGuardRef.current = false;
//   }, [mode, playerColor, difficulty, notify, clearQuestionState]);

//   const getLegalMoves = useCallback(
//     (player: LocalPlayer, roll: number) => {
//       const moves: EduLudoMove[] = [];

//       for (const token of player.tokens) {
//         const status = getTokenStatus(token);

//         if (status === "home" || token.position >= FINISH_POSITION) {
//           continue;
//         }

//         if (token.position < 0 || status === "base") {
//           if (roll !== 6) continue;

//           moves.push(
//             asSharedMove({
//               playerId: player.id,
//               tokenId: token.id,
//               fromPosition: -1,
//               toPosition: 0,
//               diceValue: roll,
//             }),
//           );

//           continue;
//         }

//         const destination = token.position + roll;
//         if (destination > FINISH_POSITION) continue;

//         moves.push(
//           asSharedMove({
//             playerId: player.id,
//             tokenId: token.id,
//             fromPosition: token.position,
//             toPosition: destination,
//             diceValue: roll,
//           }),
//         );
//       }

//       return moves;
//     },
//     [],
//   );

//   const askQuestion = useCallback(
//     (player: LocalPlayer, roll: number) => {
//       if (!player.isBot && balance < QUESTION_COST) {
//         setDialog("wallet");
//         notify(`You need ${money(QUESTION_COST)} to answer another question.`);
//         setDiceValue(null);
//         return;
//       }

//       if (!player.isBot) {
//         setBalance((value) => value - QUESTION_COST);
//         addTransaction(
//           "debit",
//           `Educational Ludo question fee (${subject})`,
//           QUESTION_COST,
//         );
//       }

//       const selectedQuestion = randomQuestion(
//         subject,
//         level,
//         difficulty,
//         seenQuestions,
//       );

//       setSeenQuestions((previous) => [...previous, selectedQuestion.id]);
//       setQuestion(selectedQuestion);
//       setQuestionCount((value) => value + 1);
//       setDiceValue(roll);
//       setSelectedAnswer(null);
//       setAnswerResult(null);
//       setLegalMoves([]);
//       setSelectedTokenId(null);
//       setMovementCount(0);
//       answerGuardRef.current = false;
//       setPhase("question");
//     },
//     [
//       balance,
//       addTransaction,
//       subject,
//       level,
//       difficulty,
//       seenQuestions,
//       notify,
//     ],
//   );

//   const rollDice = useCallback(() => {
//     if (
//       phase !== "playing" ||
//       !currentPlayer ||
//       currentPlayer.isBot ||
//       isRolling ||
//       isAnimatingMove ||
//       legalMoves.length > 0
//     ) {
//       return;
//     }

//     if (balance < QUESTION_COST) {
//       setDialog("wallet");
//       notify(`Your wallet needs at least ${money(QUESTION_COST)}.`);
//       return;
//     }

//     setIsRolling(true);
//     setDiceValue(null);

//     rollTimerRef.current = setTimeout(() => {
//       if (!mountedRef.current) return;

//       const roll = Math.floor(Math.random() * 6) + 1;
//       setIsRolling(false);
//       askQuestion(currentPlayer, roll);
//     }, 650);
//   }, [
//     phase,
//     currentPlayer,
//     isRolling,
//     isAnimatingMove,
//     legalMoves.length,
//     balance,
//     notify,
//     askQuestion,
//   ]);

//   // Spend one stored bonus to guarantee a 6 on this future turn.
//   const useGuaranteedSix = useCallback(() => {
//     if (
//       phase !== "playing" ||
//       !currentPlayer ||
//       currentPlayer.isBot ||
//       currentBonuses <= 0 ||
//       isRolling ||
//       isAnimatingMove ||
//       legalMoves.length > 0
//     ) {
//       return;
//     }

//     if (balance < QUESTION_COST) {
//       setDialog("wallet");
//       notify(`Your wallet needs at least ${money(QUESTION_COST)}.`);
//       return;
//     }

//     if (rollTimerRef.current) clearTimeout(rollTimerRef.current);

//     setGuaranteedSixBonuses((previous) => ({
//       ...previous,
//       [currentPlayer.id]: Math.max(
//         0,
//         (previous[currentPlayer.id] ?? 0) - 1,
//       ),
//     }));

//     setIsRolling(true);
//     setDiceValue(null);
//     notify("Guaranteed 6 activated!");

//     rollTimerRef.current = setTimeout(() => {
//       if (!mountedRef.current) return;

//       setIsRolling(false);
//       askQuestion(currentPlayer, 6);
//     }, 650);
//   }, [
//     phase,
//     currentPlayer,
//     currentBonuses,
//     isRolling,
//     isAnimatingMove,
//     legalMoves.length,
//     balance,
//     notify,
//     askQuestion,
//   ]);

//   const finishAnswer = useCallback(
//     (answerIndex: number) => {
//       if (
//         !question ||
//         !currentPlayer ||
//         answerGuardRef.current ||
//         phase !== "question"
//       ) {
//         return;
//       }

//       answerGuardRef.current = true;
//       setSelectedAnswer(answerIndex);

//       const correct = answerIndex === question.correctAnswer;
//       const points = correct
//         ? DIFFICULTY_POINTS[question.difficulty]
//         : 0;

//       const result = {
//         isCorrect: correct,
//         correctAnswer: question.correctAnswer,
//         selectedAnswer: answerIndex,
//         explanation: question.explanation,
//         pointsAwarded: points,
//       } as EduLudoAnswerResult;

//       setAnswerResult(result);

//       if (correct) {
//         awardCbt(
//           currentPlayer.id,
//           points,
//           `Correct ${question.subject} question reward`,
//         );

//         const nextStreak =
//           (learningStreaks[currentPlayer.id] ?? 0) + 1;

//         if (nextStreak >= CORRECT_ANSWERS_FOR_BONUS) {
//           // Reset the streak after awarding a bonus, so another bonus
//           // requires six new consecutive correct answers.
//           setLearningStreaks((previous) => ({
//             ...previous,
//             [currentPlayer.id]: 0,
//           }));

//           setGuaranteedSixBonuses((previous) => ({
//             ...previous,
//             [currentPlayer.id]: (previous[currentPlayer.id] ?? 0) + 1,
//           }));

//           notify(
//             `${currentPlayer.name} earned a guaranteed 6 for six consecutive correct answers!`,
//           );
//         } else {
//           setLearningStreaks((previous) => ({
//             ...previous,
//             [currentPlayer.id]: nextStreak,
//           }));

//           notify(
//             `Correct answer! Learning streak: ${nextStreak}/${CORRECT_ANSWERS_FOR_BONUS}.`,
//           );
//         }

//         setLegalMoves(getLegalMoves(currentPlayer, diceValue ?? 1));
//       } else {
//         // Wrong answers and timeouts both break the streak.
//         setLearningStreaks((previous) => ({
//           ...previous,
//           [currentPlayer.id]: 0,
//         }));

//         setLegalMoves([]);
//         notify(
//           answerIndex < 0
//             ? `${currentPlayer.name}'s time ran out. Learning streak reset.`
//             : `Incorrect answer. ${currentPlayer.name}'s learning streak reset.`,
//         );
//       }

//       setPhase("feedback");
//     },
//     [
//       question,
//       currentPlayer,
//       phase,
//       diceValue,
//       awardCbt,
//       getLegalMoves,
//       learningStreaks,
//       notify,
//     ],
//   );

//   /**
//    * Resolves captures and rewards after the token has visibly completed
//    * its step-by-step journey.
//    */
//   const resolveCompletedMove = useCallback(
//     (move: EduLudoMove) => {
//       const actor = players.find((player) => player.id === move.playerId);
//       if (!actor) return;

//       const tokenId = move.tokenId;
//       const destination = Number(move.to);

//       if (!Number.isFinite(destination)) return;

//       const globalDestination =
//         destination >= 0 && destination < TRACK_LENGTH
//           ? (START_POSITIONS[actor.color] + destination) % TRACK_LENGTH
//           : -1;

//       let capturedCount = 0;

//       const updatedPlayers: LocalPlayer[] = players.map((player) => {
//         if (player.id === actor.id) {
//           return {
//             ...player,
//             tokens: player.tokens.map((token) =>
//               token.id === tokenId
//                 ? {
//                     ...token,
//                     position: destination,
//                     status:
//                       destination >= FINISH_POSITION
//                         ? ("home" as const)
//                         : ("track" as const),
//                   }
//                 : token,
//             ),
//           };
//         }

//         if (
//           globalDestination < 0 ||
//           SAFE_POSITIONS.has(globalDestination)
//         ) {
//           return player;
//         }

//         let playerCaptured = false;

//         const updatedTokens = player.tokens.map((token) => {
//           const status = getTokenStatus(token);

//           if (
//             token.position < 0 ||
//             token.position >= TRACK_LENGTH ||
//             status === "home"
//           ) {
//             return token;
//           }

//           const tokenGlobal =
//             (START_POSITIONS[player.color] + token.position) % TRACK_LENGTH;

//           if (tokenGlobal === globalDestination) {
//             playerCaptured = true;
//             return { ...token, position: -1, status: "base" as const };
//           }

//           return token;
//         });

//         if (playerCaptured) capturedCount += 1;

//         return { ...player, tokens: updatedTokens };
//       });

//       const updatedActor = updatedPlayers.find(
//         (player) => player.id === actor.id,
//       );

//       if (!updatedActor) return;

//       const hasWon = updatedActor.tokens.every(
//         (token) =>
//           getTokenStatus(token) === "home" ||
//           token.position >= FINISH_POSITION,
//       );

//       // Set final token positions before reward updates to avoid overwriting
//       // score changes made by awardCbt.
//       setPlayers(
//         updatedPlayers.map((player) =>
//           player.id === actor.id && hasWon
//             ? { ...player, hasWon: true }
//             : player,
//         ),
//       );

//       if (capturedCount > 0) {
//         awardCbt(
//           actor.id,
//           CAPTURE_REWARD * capturedCount,
//           `Captured ${capturedCount} opponent token${capturedCount > 1 ? "s" : ""}`,
//         );
//       }

//       if (destination >= FINISH_POSITION) {
//         awardCbt(actor.id, TOKEN_HOME_REWARD, "Token reached home");
//       }

//       setIsAnimatingMove(false);
//       movementLockRef.current = false;
//       setSelectedTokenId(null);
//       setLegalMoves([]);
//       setQuestion(null);
//       setAnswerResult(null);
//       setSelectedAnswer(null);
//       setDiceValue(null);
//       setMovementCount(0);
//       answerGuardRef.current = false;

//       if (hasWon) {
//         awardCbt(actor.id, WINNER_REWARD, "Educational Ludo winner reward");
//         setPhase("finished");
//         setToast(`${actor.name} completed the game!`);
//         return;
//       }

//       setPhase("playing");
//       setTurn((index) => (index + 1) % updatedPlayers.length);
//     },
//     [players, awardCbt],
//   );

//   /**
//    * Moves the token through each intermediate position. During this time,
//    * phase="moving" prevents another action from starting.
//    */
//   const applyMove = useCallback(
//     async (move: EduLudoMove) => {
//       if (movementLockRef.current) return;

//       const actor = players.find((player) => player.id === move.playerId);
//       if (!actor) return;

//       const token = actor.tokens.find((item) => item.id === move.tokenId);
//       if (!token) return;

//       const destination = Number(move.to);
//       if (!Number.isFinite(destination)) return;

//       movementLockRef.current = true;
//       setIsAnimatingMove(true);
//       setPhase("moving");
//       setSelectedTokenId(move.tokenId);
//       setMovementCount(0);

//       const startsInBase = token.position < 0;
//       const startPosition = token.position;
//       const stepPositions = startsInBase
//         ? [destination]
//         : Array.from(
//             { length: Math.max(0, destination - startPosition) },
//             (_, index) => startPosition + index + 1,
//           );

//       try {
//         for (let index = 0; index < stepPositions.length; index += 1) {
//           if (!mountedRef.current) return;

//           const nextPosition = stepPositions[index];

//           setPlayers((previous) =>
//             previous.map((player) =>
//               player.id !== actor.id
//                 ? player
//                 : {
//                     ...player,
//                     tokens: player.tokens.map((item) =>
//                       item.id !== token.id
//                         ? item
//                         : {
//                             ...item,
//                             position: nextPosition,
//                             status:
//                               nextPosition >= FINISH_POSITION
//                                 ? "home"
//                                 : "track",
//                           },
//                     ),
//                   },
//             ),
//           );

//           setMovementCount(index + 1);

//           if (index < stepPositions.length - 1) {
//             await wait(MOVEMENT_STEP_MS);
//           }
//         }

//         if (!mountedRef.current) return;

//         await wait(180);

//         if (!mountedRef.current) return;

//         resolveCompletedMove(move);
//       } catch (error) {
//         movementLockRef.current = false;
//         setIsAnimatingMove(false);
//         setPhase("playing");
//         console.error("Token movement failed:", error);
//       }
//     },
//     [players, resolveCompletedMove],
//   );

//   const continueAfterFeedback = useCallback(() => {
//     if (!answerResult || !currentPlayer || phase !== "feedback") return;

//     if (!answerResult.isCorrect || legalMoves.length === 0) {
//       clearQuestionState();
//       setDiceValue(null);
//       setPhase("playing");
//       setTurn((index) => (index + 1) % players.length);
//       return;
//     }

//     // Keep the dice result and legal moves visible for token selection.
//     setPhase("playing");
//   }, [
//     answerResult,
//     currentPlayer,
//     phase,
//     legalMoves.length,
//     clearQuestionState,
//     players.length,
//   ]);

//   const selectToken = useCallback(
//     (player: EduLudoPlayer, tokenId: number) => {
//       if (
//         phase !== "playing" ||
//         isAnimatingMove ||
//         movementLockRef.current ||
//         !currentPlayer ||
//         player.id !== currentPlayer.id
//       ) {
//         return;
//       }

//       const move = legalMoves.find(
//         (item) => item.playerId === player.id && item.tokenId === tokenId,
//       );

//       if (!move) return;

//       setSelectedTokenId(tokenId);
//       void applyMove(move);
//     },
//     [
//       phase,
//       isAnimatingMove,
//       currentPlayer,
//       legalMoves,
//       applyMove,
//     ],
//   );

//   // Bots use a stored bonus automatically on a future turn.
//   // Human players decide whether to use their bonus.
//   useEffect(() => {
//     if (phase !== "playing" || !currentPlayer?.isBot) return;

//     botTimerRef.current = setTimeout(() => {
//       const hasBonus =
//         (guaranteedSixBonuses[currentPlayer.id] ?? 0) > 0;

//       if (hasBonus) {
//         setGuaranteedSixBonuses((previous) => ({
//           ...previous,
//           [currentPlayer.id]: Math.max(
//             0,
//             (previous[currentPlayer.id] ?? 0) - 1,
//           ),
//         }));

//         askQuestion(currentPlayer, 6);
//       } else {
//         const roll = Math.floor(Math.random() * 6) + 1;
//         askQuestion(currentPlayer, roll);
//       }
//     }, 1200);

//     return () => {
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     };
//   }, [phase, currentPlayer, askQuestion, guaranteedSixBonuses]);

//   // Give bots time to read the question before answering.
//   useEffect(() => {
//     if (phase !== "question" || !currentPlayer?.isBot || !question) return;

//     const delay =
//       difficulty === "hard" ? 3200 : difficulty === "medium" ? 3800 : 4200;

//     const chance =
//       difficulty === "easy" ? 0.58 : difficulty === "medium" ? 0.76 : 0.91;

//     botTimerRef.current = setTimeout(() => {
//       const answer =
//         Math.random() < chance
//           ? question.correctAnswer
//           : (question.correctAnswer + 1 + Math.floor(Math.random() * 3)) % 4;

//       finishAnswer(answer);
//     }, delay);

//     return () => {
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     };
//   }, [phase, currentPlayer, question, difficulty, finishAnswer]);

//   // Keep bot feedback visible before the bot moves or ends its turn.
//   useEffect(() => {
//     if (phase !== "feedback" || !currentPlayer?.isBot || !answerResult) {
//       return;
//     }

//     botTimerRef.current = setTimeout(() => {
//       if (answerResult.isCorrect && legalMoves.length > 0) {
//         const move =
//           legalMoves[Math.floor(Math.random() * legalMoves.length)];

//         if (move) {
//           void applyMove(move);
//           return;
//         }
//       }

//       continueAfterFeedback();
//     }, BOT_FEEDBACK_MS);

//     return () => {
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     };
//   }, [
//     phase,
//     currentPlayer,
//     answerResult,
//     legalMoves,
//     applyMove,
//     continueAfterFeedback,
//   ]);

//   const rankedPlayers = useMemo(
//     () =>
//       [...players].sort((a, b) => {
//         if (a.hasWon !== b.hasWon) return a.hasWon ? -1 : 1;

//         const aHome = a.tokens.filter(
//           (token) =>
//             getTokenStatus(token) === "home" ||
//             token.position >= FINISH_POSITION,
//         ).length;

//         const bHome = b.tokens.filter(
//           (token) =>
//             getTokenStatus(token) === "home" ||
//             token.position >= FINISH_POSITION,
//         ).length;

//         return bHome - aHome || b.score - a.score;
//       }),
//     [players],
//   );

//   const exitGame = useCallback(() => {
//     if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     if (rollTimerRef.current) clearTimeout(rollTimerRef.current);

//     movementLockRef.current = false;
//     setIsAnimatingMove(false);
//     setIsRolling(false);
//     setPlayers([]);
//     setTurn(0);
//     setPhase("lobby");
//     setDiceValue(null);
//     clearQuestionState();
//     setLearningStreaks({});
//     setGuaranteedSixBonuses({});
//     setShowExitConfirmation(false);
//     onBack?.();
//   }, [onBack, clearQuestionState]);

//   const playAgain = useCallback(() => {
//     setShowExitConfirmation(false);
//     startGame();
//   }, [startGame]);

//   const sharedPlayers = useMemo(
//     () => players.map(asSharedPlayer),
//     [players],
//   );

//   const sharedTransactions = useMemo(
//     () => transactions as unknown as EduLudoTransaction[],
//     [transactions],
//   );

//   const selectedQuestion = question ? asSharedQuestion(question) : null;

//   if (phase === "lobby") {
//     return (
//       <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6">
//         <div className="mx-auto max-w-6xl">
//           <EduLudoLobby
//             mode={mode}
//             subject={subject}
//             level={level}
//             difficulty={difficulty}
//             playerColor={playerColor}
//             balance={balance}
//             cbtPoints={cbtPoints}
//             onModeChange={setMode}
//             onSubjectChange={setSubject}
//             onLevelChange={setLevel}
//             onDifficultyChange={setDifficulty}
//             onPlayerColorChange={setPlayerColor}
//             onStartGame={startGame}
//             onBack={onBack}
//             onFundWallet={onFundWallet}
//             onViewRules={() => setDialog("rules")}
//             onViewRewards={() => setDialog("rewards")}
//           />

//           <LudoGameDialogs
//             activeDialog={dialog}
//             onCloseDialog={() => setDialog(null)}
//             balance={balance}
//             cbtPoints={cbtPoints}
//             transactions={sharedTransactions}
//             onFundWallet={onFundWallet}
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6">
//       <div className="mx-auto max-w-7xl space-y-4">
//         <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => setShowExitConfirmation(true)}
//               className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
//               aria-label="Back to lobby"
//             >
//               <ArrowLeft size={19} />
//             </button>

//             <div>
//               <h1 className="text-lg font-black text-slate-900 sm:text-xl">
//                 Educational Ludo
//               </h1>
//               <p className="text-xs text-slate-500">
//                 Answer questions, count moves, earn CBT Points
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               type="button"
//               onClick={() => setDialog("wallet")}
//               className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800"
//             >
//               <Wallet size={16} />
//               {money(balance)}
//             </button>

//             <button
//               type="button"
//               onClick={() => setDialog("rewards")}
//               className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800"
//             >
//               <Coins size={16} />
//               {cbtPoints.toLocaleString()} CBT
//             </button>

//             <button
//               type="button"
//               onClick={() => setDialog("history")}
//               className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
//               aria-label="Transaction history"
//             >
//               <History size={18} />
//             </button>

//             <button
//               type="button"
//               onClick={() => setDialog("rules")}
//               className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
//               aria-label="Game rules"
//             >
//               <Info size={18} />
//             </button>
//           </div>
//         </header>

//         {phase !== "finished" && (
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
//             <section className="min-w-0 space-y-4">
//               <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                     Current turn
//                   </p>
//                   <div className="mt-1 flex items-center gap-2">
//                     {currentPlayer && (
//                       <span
//                         className={`h-3 w-3 rounded-full ${COLOR_STYLES[currentPlayer.color].bg}`}
//                       />
//                     )}
//                     <h2 className="text-lg font-black text-slate-900">
//                       {currentPlayer?.name ?? "Waiting"}
//                     </h2>
//                     {currentPlayer?.isBot && (
//                       <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
//                         COMPUTER
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2 text-xs">
//                   <span className="rounded-lg bg-indigo-50 px-3 py-2 font-bold text-indigo-700">
//                     Question {questionCount}
//                   </span>
//                   <span className="rounded-lg bg-amber-50 px-3 py-2 font-bold text-amber-800">
//                     Fee: {money(QUESTION_COST)} per human question
//                   </span>
//                 </div>
//               </div>

//               {/* Current player's learning streak and stored bonus. */}
//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
//                   <div className="flex items-center gap-2 text-indigo-800">
//                     <BookOpen size={18} />
//                     <p className="text-sm font-extrabold">Learning streak</p>
//                   </div>

//                   <div className="mt-3 flex items-end justify-between gap-3">
//                     <p className="text-2xl font-black text-indigo-950">
//                       {currentStreak}/{CORRECT_ANSWERS_FOR_BONUS}
//                     </p>
//                     <p className="text-xs font-semibold text-indigo-700">
//                       Consecutive correct
//                     </p>
//                   </div>

//                   <div className="mt-3 grid grid-cols-6 gap-1.5">
//                     {Array.from(
//                       { length: CORRECT_ANSWERS_FOR_BONUS },
//                       (_, index) => (
//                         <div
//                           key={index}
//                           className={`h-2.5 rounded-full ${
//                             index < currentStreak
//                               ? "bg-indigo-600"
//                               : "bg-indigo-200"
//                           }`}
//                         />
//                       ),
//                     )}
//                   </div>

//                   <p className="mt-2 text-xs leading-5 text-indigo-800">
//                     Answer six questions correctly in a row to earn a
//                     guaranteed 6. A wrong answer or timeout resets the streak.
//                   </p>
//                 </div>

//                 <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
//                   <div className="flex items-center gap-2 text-amber-800">
//                     <Zap size={18} />
//                     <p className="text-sm font-extrabold">Guaranteed 6</p>
//                   </div>

//                   <div className="mt-3 flex items-end justify-between gap-3">
//                     <p className="text-2xl font-black text-amber-950">
//                       {currentBonuses}
//                     </p>
//                     <p className="text-xs font-semibold text-amber-800">
//                       Bonus{currentBonuses === 1 ? "" : "es"} saved
//                     </p>
//                   </div>

//                   <p className="mt-2 text-xs leading-5 text-amber-900">
//                     Save your bonus and choose a future turn to use it.
//                     Using one guarantees a dice result of 6.
//                   </p>

//                   {currentPlayer &&
//                     !currentPlayer.isBot &&
//                     phase === "playing" &&
//                     legalMoves.length === 0 &&
//                     currentBonuses > 0 && (
//                       <button
//                         type="button"
//                         onClick={useGuaranteedSix}
//                         disabled={isRolling || isAnimatingMove}
//                         className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
//                       >
//                         <Zap size={16} />
//                         {isRolling ? "Preparing guaranteed 6…" : "Use guaranteed 6"}
//                       </button>
//                     )}
//                 </div>
//               </div>

//               <LudoBoard
//                 players={sharedPlayers}
//                 currentPlayerId={currentPlayer?.id ?? null}
//                 legalMoves={legalMoves}
//                 selectedTokenId={selectedTokenId}
//                 diceValue={diceValue}
//                 disabled={
//                   isRolling ||
//                   isAnimatingMove ||
//                   currentPlayer?.isBot === true ||
//                   phase !== "playing" ||
//                   legalMoves.length === 0
//                 }
//                 onTokenClick={selectToken}
//                 onDiceClick={rollDice}
//                 showDice
//                 movementCount={movementCount}
//                 isMoving={isAnimatingMove}
//               />

//               {phase === "moving" && (
//                 <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
//                   <p className="font-extrabold text-indigo-900">
//                     Moving your token...
//                   </p>
//                   <p className="mt-1 text-sm text-indigo-800">
//                     Count each square. The token will stop when it reaches
//                     the number shown on the dice.
//                   </p>
//                 </div>
//               )}

//               {phase === "playing" && !currentPlayer?.isBot && (
//                 <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
//                   <div className="flex items-start gap-3">
//                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
//                       <BookOpen size={18} />
//                     </div>

//                     <div className="flex-1">
//                       <p className="text-sm font-bold text-indigo-950">
//                         {legalMoves.length > 0
//                           ? "Choose a highlighted token"
//                           : "Your turn to play"}
//                       </p>
//                       <p className="mt-1 text-xs leading-5 text-indigo-800">
//                         {legalMoves.length > 0
//                           ? `Your dice shows ${diceValue}. Select one of the highlighted tokens to count out the move.`
//                           : currentBonuses > 0
//                             ? `Roll normally or use one of your ${currentBonuses} saved guaranteed-6 bonus${currentBonuses === 1 ? "" : "es"}. You will receive a question either way.`
//                             : `Roll the dice to receive a question. Answer correctly to move a legal token. Each question costs ${money(QUESTION_COST)}.`}
//                       </p>
//                     </div>

//                     {legalMoves.length === 0 && (
//                       <button
//                         type="button"
//                         onClick={rollDice}
//                         disabled={isRolling || isAnimatingMove}
//                         className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
//                       >
//                         {isRolling ? "Rolling…" : "Roll Dice"}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </section>



//             <aside className="min-w-0 space-y-4">
//               <LudoPlayersPanel
//                 players={sharedPlayers}
//                 currentPlayerId={currentPlayer?.id ?? null}
//                 currentTurn={turn}
//                 cbtPoints={cbtPoints}
//                 showTokenProgress
//               />

//               <div className="rounded-2xl border border-slate-200 bg-white p-4">
//                 <h3 className="font-bold text-slate-900">Match summary</h3>

//                 <div className="mt-3 grid grid-cols-2 gap-3">
//                   <div className="rounded-xl bg-slate-50 p-3">
//                     <p className="text-xs text-slate-500">Questions</p>
//                     <p className="mt-1 text-xl font-black text-slate-900">
//                       {questionCount}
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-slate-50 p-3">
//                     <p className="text-xs text-slate-500">Match rewards</p>
//                     <p className="mt-1 text-xl font-black text-emerald-700">
//                       +{matchReward}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-3 space-y-2 text-xs text-slate-600">
//                   <p className="flex items-center justify-between gap-3">
//                     <span>Question fee</span>
//                     <strong>{money(QUESTION_COST)}</strong>
//                   </p>
//                   <p className="flex items-center justify-between gap-3">
//                     <span>Correct answer</span>
//                     <strong>20–40 CBT</strong>
//                   </p>
//                   <p className="flex items-center justify-between gap-3">
//                     <span>Capture reward</span>
//                     <strong>{CAPTURE_REWARD} CBT</strong>
//                   </p>
//                   <p className="flex items-center justify-between gap-3">
//                     <span>Token home reward</span>
//                     <strong>{TOKEN_HOME_REWARD} CBT</strong>
//                   </p>
//                   <p className="flex items-center justify-between gap-3">
//                     <span>Winner reward</span>
//                     <strong>{WINNER_REWARD} CBT</strong>
//                   </p>
//                   <p className="flex items-center justify-between gap-3">
//                     <span>Correct streak bonus</span>
//                     <strong>6 in a row = 1 guaranteed 6</strong>
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setShowExitConfirmation(true)}
//                 className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
//               >
//                 <ArrowLeft size={16} />
//                 Exit match
//               </button>
//             </aside>
//           </div>
//         )}

//         {phase === "finished" && (
//           <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-10">
//             <div className="mx-auto max-w-2xl text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
//                 <Trophy size={32} />
//               </div>

//               <h2 className="mt-4 text-2xl font-black text-slate-900">
//                 Game completed!
//               </h2>
//               <p className="mt-2 text-sm text-slate-600">
//                 Great effort. Here is the final ranking for this match.
//               </p>

//               <div className="mt-6 space-y-2 text-left">
//                 {rankedPlayers.map((player, index) => (
//                   <div
//                     key={player.id}
//                     className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
//                   >
//                     <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
//                       {index + 1}
//                     </span>

//                     <span
//                       className={`h-3 w-3 rounded-full ${COLOR_STYLES[player.color].bg}`}
//                     />

//                     <span className="flex-1 font-bold text-slate-900">
//                       {player.name}
//                       {player.hasWon ? " — Winner" : ""}
//                     </span>

//                     <span className="font-extrabold tabular-nums text-slate-900">
//                       {player.score} CBT
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-6 flex flex-wrap justify-center gap-3">
//                 <button
//                   type="button"
//                   onClick={playAgain}
//                   className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
//                 >
//                   <RotateCcw size={16} />
//                   Play again
//                 </button>

//                 <button
//                   type="button"
//                   onClick={exitGame}
//                   className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
//                 >
//                   Return to lobby
//                 </button>
//               </div>
//             </div>
//           </section>
//         )}

//         <QuestionModal
//           question={selectedQuestion}
//           open={
//             (phase === "question" || phase === "feedback") &&
//             Boolean(question)
//           }
//           timeLimit={QUESTION_TIME_LIMIT}
//           questionCost={QUESTION_COST}
//           disabled={Boolean(currentPlayer?.isBot)}
//           submitting={false}
//           selectedAnswer={selectedAnswer}
//           result={answerResult}
//           onAnswer={finishAnswer}
//           onTimeUp={() => finishAnswer(-1)}
//           onClose={() => {
//             if (!currentPlayer?.isBot) {
//               notify("Please answer the question to continue.");
//             }
//           }}
//           onContinue={
//             currentPlayer?.isBot ? undefined : continueAfterFeedback
//           }
//           showTimer
//           showCost
//           allowClose={false}
//         />

//         <LudoGameDialogs
//           activeDialog={dialog}
//           onCloseDialog={() => setDialog(null)}
//           showExitConfirmation={showExitConfirmation}
//           onCancelExit={() => setShowExitConfirmation(false)}
//           onConfirmExit={exitGame}
//           showGameOver={false}
//           winner={null}
//           players={sharedPlayers}
//           matchReward={matchReward}
//           onPlayAgain={playAgain}
//           onReturnToLobby={exitGame}
//           balance={balance}
//           cbtPoints={cbtPoints}
//           transactions={sharedTransactions}
//           onFundWallet={onFundWallet}
//         />

//         {toast && (
//           <div
//             role="status"
//             className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"
//           >
//             {toast}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }




























