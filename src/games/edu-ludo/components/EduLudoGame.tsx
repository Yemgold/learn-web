

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Dices,
  Users,
  Coins,
  History,
  Info,
  RotateCcw,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";

import type {
  EduLudoAnswerResult,
  EduLudoColor,
  EduLudoDifficulty,
  EduLudoLevel,
  EduLudoMode,
  EduLudoMove,
  EduLudoPlayer,
  EduLudoQuestion,
  EduLudoSubject,
  EduLudoTransaction,
} from "./eduLudoTypes";

import {
  EDU_LUDO_QUESTION_BANK,
  getRandomEduLudoQuestion,
} from "../index";

import type { EduLudoGameQuestion } from "../question-bank/adapter";
import {
  CAPTURE_REWARD,
  COLOR_STYLES,
  INITIAL_CBT_POINTS,
  INITIAL_WALLET_BALANCE,
  QUESTION_COST,
  QUESTION_TIME_LIMIT,
  TOKEN_HOME_REWARD,
  TOKENS_PER_PLAYER,
  WINNER_REWARD,
} from "./eduLudoConstants";

import EduLudoLobby from "./EduLudoLobby";
import LudoBoard from "./LudoBoard";
import LudoPlayersPanel from "./LudoPlayersPanel";
import QuestionModal from "./QuestionModal";
import LudoGameDialogs from "./LudoGameDialogs";

type Phase =
  | "lobby"
  | "playing"
  | "question"
  | "feedback"
  | "moving"
  | "finished";

type Dialog = "rules" | "wallet" | "rewards" | "history" | null;

type LocalToken = {
  id: number;
  position: number;
  status?: "base" | "track" | "home";
};

type LocalPlayer = EduLudoPlayer & {
  id: string;
  name: string;
  color: EduLudoColor;
  isBot: boolean;
  hasWon: boolean;
  score: number;
  tokens: LocalToken[];
};

type LocalQuestion = EduLudoGameQuestion;

type LocalTransaction = {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  createdAt: string;
  balanceAfter: number;
};

type Props = {
  initialBalance?: number;
  initialCbtPoints?: number;
  onBack?: () => void;
  onFundWallet?: () => void;
};

const TRACK_LENGTH = 52;
const FINISH_POSITION = 57;
const MOVEMENT_STEP_MS = 1000;
const BOT_FEEDBACK_MS = 8000;
const CORRECT_ANSWERS_FOR_BONUS = 6;

const START_POSITIONS: Record<EduLudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 39,
  blue: 26,
};

const SAFE_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

const DIFFICULTY_POINTS: Record<EduLudoDifficulty, number> = {
  easy: 20,
  medium: 30,
  hard: 40,
};



function money(amount: number) {
  return `₦${Math.max(0, amount).toLocaleString("en-NG")}`;
}

function getTokenStatus(token: LocalToken): "base" | "track" | "home" {
  if (token.status) return token.status;
  if (token.position >= FINISH_POSITION) return "home";
  if (token.position < 0) return "base";
  return "track";
}

function makePlayers(
  humanColor: EduLudoColor,
  _difficulty: EduLudoDifficulty,
): LocalPlayer[] {
  const colors: EduLudoColor[] = [
    humanColor,
    ...(["red", "green", "yellow", "blue"] as EduLudoColor[]).filter(
      (color) => color !== humanColor,
    ),
  ];

  const botNames = ["Ada", "Tunde", "Zara"];

  return colors.map((color, index) => {
    const isBot = index !== 0;

    return {
      id: isBot ? `bot-${index}` : "human",
      name: isBot ? botNames[index - 1] : "You",
      color,
      isBot,
      hasWon: false,
      score: 0,
      tokens: Array.from({ length: TOKENS_PER_PLAYER }, (_, tokenIndex) => ({
        id: tokenIndex,
        position: -1,
        status: "base" as const,
      })),
    };
  });
}

function asSharedPlayer(player: LocalPlayer): EduLudoPlayer {
  return player as EduLudoPlayer;
}

function asSharedQuestion(question: LocalQuestion): EduLudoQuestion {
  return question as EduLudoQuestion;
}

function asSharedMove(move: {
  playerId: string;
  tokenId: number;
  fromPosition: number;
  toPosition: number;
  diceValue: number;
}): EduLudoMove {
  return {
    playerId: move.playerId,
    tokenId: move.tokenId,
    from: move.fromPosition,
    to: move.toPosition,
    diceValue: move.diceValue,
  } as unknown as EduLudoMove;
}

function randomQuestion(
  subject: EduLudoSubject,
  level: EduLudoLevel,
  difficulty: EduLudoDifficulty,
  seen: string[],
): LocalQuestion {
  const matchesSubject = (item: LocalQuestion) =>
    subject === "All Subjects" || item.subject === subject;

  const unseen = EDU_LUDO_QUESTION_BANK.filter(
    (item) =>
      matchesSubject(item) &&
      item.difficulty === difficulty &&
      (level === "Custom" || item.level === level) &&
      !seen.includes(item.id),
  );

  // If the selected difficulty has no unseen questions,
  // use other difficulties at the same subject and level.
  const sameLevel = EDU_LUDO_QUESTION_BANK.filter(
    (item) =>
      matchesSubject(item) &&
      (level === "Custom" || item.level === level) &&
      !seen.includes(item.id),
  );

  // If that pool is exhausted, allow previously seen questions.
  const reusable = EDU_LUDO_QUESTION_BANK.filter(
    (item) =>
      matchesSubject(item) &&
      (level === "Custom" || item.level === level),
  );

  const pool =
    unseen.length > 0
      ? unseen
      : sameLevel.length > 0
        ? sameLevel
        : reusable;

  if (pool.length === 0) {
    throw new Error(
      `No Educational Ludo questions are available for ${subject} at ${level}.`,
    );
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function EduLudoGame({
  initialBalance = INITIAL_WALLET_BALANCE,
  initialCbtPoints = INITIAL_CBT_POINTS,
  onBack,
  onFundWallet,
}: Props) {
  const [mode, setMode] = useState<EduLudoMode>("solo");
  const [subject, setSubject] = useState<EduLudoSubject>("All Subjects");
  const [level, setLevel] = useState<EduLudoLevel>("JAMB");
  const [difficulty, setDifficulty] =
    useState<EduLudoDifficulty>("medium");
  const [playerColor, setPlayerColor] = useState<EduLudoColor>("red");

  const [balance, setBalance] = useState(initialBalance);
  const [cbtPoints, setCbtPoints] = useState(initialCbtPoints);
  const [players, setPlayers] = useState<LocalPlayer[]>([]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("lobby");
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [question, setQuestion] = useState<LocalQuestion | null>(null);
  const [answerResult, setAnswerResult] =
    useState<EduLudoAnswerResult | null>(null);
  const [legalMoves, setLegalMoves] = useState<EduLudoMove[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [toast, setToast] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [matchReward, setMatchReward] = useState(0);
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [seenQuestions, setSeenQuestions] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimatingMove, setIsAnimatingMove] = useState(false);
  const [movementCount, setMovementCount] = useState(0);

  const [learningStreaks, setLearningStreaks] = useState<
    Record<string, number>
  >({});
  const [guaranteedSixBonuses, setGuaranteedSixBonuses] = useState<
    Record<string, number>
  >({});

  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerGuardRef = useRef(false);
  const movementLockRef = useRef(false);
  const mountedRef = useRef(true);

  const currentTurnRef = useRef<HTMLDivElement>(null);
  const previousTurnPlayerIdRef = useRef<string | null>(null);

  const currentPlayer = players[turn] ?? null;
  const currentStreak = currentPlayer
    ? learningStreaks[currentPlayer.id] ?? 0
    : 0;
  const currentBonuses = currentPlayer
    ? guaranteedSixBonuses[currentPlayer.id] ?? 0
    : 0;

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
      if (rollTimerRef.current) clearTimeout(rollTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const addTransaction = useCallback(
    (
      type: "credit" | "debit",
      description: string,
      amount: number,
    ) => {
      setTransactions((previous) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type,
          description,
          amount,
          createdAt: new Date().toISOString(),
          balanceAfter: Math.max(
            0,
            balance + (type === "credit" ? amount : -amount),
          ),
        },
        ...previous,
      ]);
    },
    [balance],
  );

  const awardCbt = useCallback(
    (playerId: string, amount: number, description: string) => {
      if (amount <= 0) return;

      setPlayers((previous) =>
        previous.map((player) =>
          player.id === playerId
            ? { ...player, score: player.score + amount }
            : player,
        ),
      );

      const player = players.find((item) => item.id === playerId);

      if (player && !player.isBot) {
        setCbtPoints((value) => value + amount);
        setMatchReward((value) => value + amount);
        addTransaction("credit", description, amount);
        notify(`+${amount} CBT Points earned`);
      }
    },
    [players, addTransaction, notify],
  );

  const clearQuestionState = useCallback(() => {
    setQuestion(null);
    setAnswerResult(null);
    setSelectedAnswer(null);
    setLegalMoves([]);
    setSelectedTokenId(null);
    setMovementCount(0);
    answerGuardRef.current = false;
  }, []);

  const startGame = useCallback(() => {
    if (mode !== "solo") {
      notify("Multiplayer modes are coming soon. Solo mode is available now.");
      return;
    }

    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    if (rollTimerRef.current) clearTimeout(rollTimerRef.current);

    movementLockRef.current = false;
    setIsAnimatingMove(false);
    setPlayers(makePlayers(playerColor, difficulty));
    setTurn(0);
    setPhase("playing");
    setDiceValue(null);
    clearQuestionState();
    setQuestionCount(0);
    setMatchReward(0);
    setSeenQuestions([]);
    setIsRolling(false);
    setLearningStreaks({});
    setGuaranteedSixBonuses({});
    setToast("");
    answerGuardRef.current = false;
  }, [mode, playerColor, difficulty, notify, clearQuestionState]);

  const getLegalMoves = useCallback(
    (player: LocalPlayer, roll: number) => {
      const moves: EduLudoMove[] = [];

      for (const token of player.tokens) {
        const status = getTokenStatus(token);

        if (status === "home" || token.position >= FINISH_POSITION) {
          continue;
        }

        if (token.position < 0 || status === "base") {
          if (roll !== 6) continue;

          moves.push(
            asSharedMove({
              playerId: player.id,
              tokenId: token.id,
              fromPosition: -1,
              toPosition: 0,
              diceValue: roll,
            }),
          );

          continue;
        }

        const destination = token.position + roll;
        if (destination > FINISH_POSITION) continue;

        moves.push(
          asSharedMove({
            playerId: player.id,
            tokenId: token.id,
            fromPosition: token.position,
            toPosition: destination,
            diceValue: roll,
          }),
        );
      }

      return moves;
    },
    [],
  );

  const askQuestion = useCallback(
    (player: LocalPlayer, roll: number) => {
      if (!player.isBot && balance < QUESTION_COST) {
        setDialog("wallet");
        notify(`You need ${money(QUESTION_COST)} to answer another question.`);
        setDiceValue(null);
        return;
      }

      if (!player.isBot) {
        setBalance((value) => value - QUESTION_COST);
        addTransaction(
          "debit",
          `Educational Ludo question fee (${subject})`,
          QUESTION_COST,
        );
      }

      const selectedQuestion = randomQuestion(
        subject,
        level,
        difficulty,
        seenQuestions,
      );

      setSeenQuestions((previous) => [...previous, selectedQuestion.id]);
      setQuestion(selectedQuestion);
      setQuestionCount((value) => value + 1);
      setDiceValue(roll);
      setSelectedAnswer(null);
      setAnswerResult(null);
      setLegalMoves([]);
      setSelectedTokenId(null);
      setMovementCount(0);
      answerGuardRef.current = false;
      setPhase("question");
    },
    [
      balance,
      addTransaction,
      subject,
      level,
      difficulty,
      seenQuestions,
      notify,
    ],
  );

  const rollDice = useCallback(() => {
    if (
      phase !== "playing" ||
      !currentPlayer ||
      currentPlayer.isBot ||
      isRolling ||
      isAnimatingMove ||
      legalMoves.length > 0
    ) {
      return;
    }

    if (balance < QUESTION_COST) {
      setDialog("wallet");
      notify(`Your wallet needs at least ${money(QUESTION_COST)}.`);
      return;
    }

    setIsRolling(true);
    setDiceValue(null);

    rollTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      const roll = Math.floor(Math.random() * 6) + 1;
      setIsRolling(false);
      askQuestion(currentPlayer, roll);
    }, 650);
  }, [
    phase,
    currentPlayer,
    isRolling,
    isAnimatingMove,
    legalMoves.length,
    balance,
    notify,
    askQuestion,
  ]);

  const useGuaranteedSix = useCallback(() => {
    if (
      phase !== "playing" ||
      !currentPlayer ||
      currentPlayer.isBot ||
      currentBonuses <= 0 ||
      isRolling ||
      isAnimatingMove ||
      legalMoves.length > 0
    ) {
      return;
    }

    if (balance < QUESTION_COST) {
      setDialog("wallet");
      notify(`Your wallet needs at least ${money(QUESTION_COST)}.`);
      return;
    }

    if (rollTimerRef.current) clearTimeout(rollTimerRef.current);

    setGuaranteedSixBonuses((previous) => ({
      ...previous,
      [currentPlayer.id]: Math.max(
        0,
        (previous[currentPlayer.id] ?? 0) - 1,
      ),
    }));

    setIsRolling(true);
    setDiceValue(null);
    notify("Guaranteed 6 activated!");

    rollTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      setIsRolling(false);
      askQuestion(currentPlayer, 6);
    }, 650);
  }, [
    phase,
    currentPlayer,
    currentBonuses,
    isRolling,
    isAnimatingMove,
    legalMoves.length,
    balance,
    notify,
    askQuestion,
  ]);

  const finishAnswer = useCallback(
    (answerIndex: number) => {
      if (
        !question ||
        !currentPlayer ||
        answerGuardRef.current ||
        phase !== "question"
      ) {
        return;
      }

      answerGuardRef.current = true;
      setSelectedAnswer(answerIndex);

      const correct = answerIndex === question.correctAnswer;
      const points = correct
        ? DIFFICULTY_POINTS[question.difficulty]
        : 0;

      const result = {
        isCorrect: correct,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answerIndex,
        explanation: question.explanation,
        pointsAwarded: points,
      } as EduLudoAnswerResult;

      setAnswerResult(result);

      if (correct) {
        awardCbt(
          currentPlayer.id,
          points,
          `Correct ${question.subject} question reward`,
        );

        const nextStreak =
          (learningStreaks[currentPlayer.id] ?? 0) + 1;

        if (nextStreak >= CORRECT_ANSWERS_FOR_BONUS) {
          setLearningStreaks((previous) => ({
            ...previous,
            [currentPlayer.id]: 0,
          }));

          setGuaranteedSixBonuses((previous) => ({
            ...previous,
            [currentPlayer.id]: (previous[currentPlayer.id] ?? 0) + 1,
          }));

          notify(
            `${currentPlayer.name} earned a guaranteed 6 for six consecutive correct answers!`,
          );
        } else {
          setLearningStreaks((previous) => ({
            ...previous,
            [currentPlayer.id]: nextStreak,
          }));

          notify(
            `Correct answer! Learning streak: ${nextStreak}/${CORRECT_ANSWERS_FOR_BONUS}.`,
          );
        }

        setLegalMoves(getLegalMoves(currentPlayer, diceValue ?? 1));
      } else {
        setLearningStreaks((previous) => ({
          ...previous,
          [currentPlayer.id]: 0,
        }));

        setLegalMoves([]);
        notify(
          answerIndex < 0
            ? `${currentPlayer.name}'s time ran out. Learning streak reset.`
            : `Incorrect answer. ${currentPlayer.name}'s learning streak reset.`,
        );
      }

      setPhase("feedback");
    },
    [
      question,
      currentPlayer,
      phase,
      diceValue,
      awardCbt,
      getLegalMoves,
      learningStreaks,
      notify,
    ],
  );

  const resolveCompletedMove = useCallback(
    (move: EduLudoMove) => {
      const actor = players.find((player) => player.id === move.playerId);
      if (!actor) return;

      const tokenId = move.tokenId;
      const destination = Number(move.to);

      if (!Number.isFinite(destination)) return;

      const globalDestination =
        destination >= 0 && destination < TRACK_LENGTH
          ? (START_POSITIONS[actor.color] + destination) % TRACK_LENGTH
          : -1;

      let capturedCount = 0;

      const updatedPlayers: LocalPlayer[] = players.map((player) => {
        if (player.id === actor.id) {
          return {
            ...player,
            tokens: player.tokens.map((token) =>
              token.id === tokenId
                ? {
                    ...token,
                    position: destination,
                    status:
                      destination >= FINISH_POSITION
                        ? ("home" as const)
                        : ("track" as const),
                  }
                : token,
            ),
          };
        }

        if (
          globalDestination < 0 ||
          SAFE_POSITIONS.has(globalDestination)
        ) {
          return player;
        }

        let playerCaptured = false;

        const updatedTokens = player.tokens.map((token) => {
          const status = getTokenStatus(token);

          if (
            token.position < 0 ||
            token.position >= TRACK_LENGTH ||
            status === "home"
          ) {
            return token;
          }

          const tokenGlobal =
            (START_POSITIONS[player.color] + token.position) % TRACK_LENGTH;

          if (tokenGlobal === globalDestination) {
            playerCaptured = true;
            return { ...token, position: -1, status: "base" as const };
          }

          return token;
        });

        if (playerCaptured) capturedCount += 1;

        return { ...player, tokens: updatedTokens };
      });

      const updatedActor = updatedPlayers.find(
        (player) => player.id === actor.id,
      );

      if (!updatedActor) return;

      const hasWon = updatedActor.tokens.every(
        (token) =>
          getTokenStatus(token) === "home" ||
          token.position >= FINISH_POSITION,
      );

      previousTurnPlayerIdRef.current = null;

      setPlayers(
        updatedPlayers.map((player) =>
          player.id === actor.id && hasWon
            ? { ...player, hasWon: true }
            : player,
        ),
      );

      if (capturedCount > 0) {
        awardCbt(
          actor.id,
          CAPTURE_REWARD * capturedCount,
          `Captured ${capturedCount} opponent token${capturedCount > 1 ? "s" : ""}`,
        );
      }

      if (destination >= FINISH_POSITION) {
        awardCbt(actor.id, TOKEN_HOME_REWARD, "Token reached home");
      }

      setIsAnimatingMove(false);
      movementLockRef.current = false;
      setSelectedTokenId(null);
      setLegalMoves([]);
      setQuestion(null);
      setAnswerResult(null);
      setSelectedAnswer(null);
      setDiceValue(null);
      setMovementCount(0);
      answerGuardRef.current = false;

      if (hasWon) {
        awardCbt(actor.id, WINNER_REWARD, "Educational Ludo winner reward");
        setPhase("finished");
        setToast(`${actor.name} completed the game!`);
        return;
      }

      setPhase("playing");
      setTurn((index) => (index + 1) % updatedPlayers.length);
    },
    [players, awardCbt],
  );

  const applyMove = useCallback(
    async (move: EduLudoMove) => {
      if (movementLockRef.current) return;

      const actor = players.find((player) => player.id === move.playerId);
      if (!actor) return;

      const token = actor.tokens.find((item) => item.id === move.tokenId);
      if (!token) return;

      const destination = Number(move.to);
      if (!Number.isFinite(destination)) return;

      movementLockRef.current = true;
      setIsAnimatingMove(true);
      setPhase("moving");
      setSelectedTokenId(move.tokenId);
      setMovementCount(0);

      const startsInBase = token.position < 0;
      const startPosition = token.position;
      const stepPositions = startsInBase
        ? [destination]
        : Array.from(
            { length: Math.max(0, destination - startPosition) },
            (_, index) => startPosition + index + 1,
          );

      try {
        for (let index = 0; index < stepPositions.length; index += 1) {
          if (!mountedRef.current) return;

          const nextPosition = stepPositions[index];

          setPlayers((previous) =>
            previous.map((player) =>
              player.id !== actor.id
                ? player
                : {
                    ...player,
                    tokens: player.tokens.map((item) =>
                      item.id !== token.id
                        ? item
                        : {
                            ...item,
                            position: nextPosition,
                            status:
                              nextPosition >= FINISH_POSITION
                                ? "home"
                                : "track",
                          },
                    ),
                  },
            ),
          );

          setMovementCount(index + 1);
          await wait(MOVEMENT_STEP_MS);

          if (!mountedRef.current) return;
        }

        if (!mountedRef.current) return;

        await wait(180);

        if (!mountedRef.current) return;

        resolveCompletedMove(move);
      } catch (error) {
        movementLockRef.current = false;
        setIsAnimatingMove(false);
        setPhase("playing");
        console.error("Token movement failed:", error);
      }
    },
    [players, resolveCompletedMove],
  );

 
useEffect(() => {
  if (phase === "lobby" || !currentPlayer) {
    previousTurnPlayerIdRef.current = null;
    return;
  }

  previousTurnPlayerIdRef.current = currentPlayer.id;
}, [currentPlayer?.id, phase]);

  const continueAfterFeedback = useCallback(() => {
    if (!answerResult || !currentPlayer || phase !== "feedback") return;

    if (!answerResult.isCorrect || legalMoves.length === 0) {
      clearQuestionState();
      setDiceValue(null);
      setPhase("playing");
      setTurn((index) => (index + 1) % players.length);
      return;
    }

    setPhase("playing");
  }, [
    answerResult,
    currentPlayer,
    phase,
    legalMoves.length,
    clearQuestionState,
    players.length,
  ]);

  const selectToken = useCallback(
    (player: EduLudoPlayer, tokenId: number) => {
      if (
        phase !== "playing" ||
        isAnimatingMove ||
        movementLockRef.current ||
        !currentPlayer ||
        player.id !== currentPlayer.id
      ) {
        return;
      }

      const move = legalMoves.find(
        (item) => item.playerId === player.id && item.tokenId === tokenId,
      );

      if (!move) return;

      setSelectedTokenId(tokenId);
      void applyMove(move);
    },
    [phase, isAnimatingMove, currentPlayer, legalMoves, applyMove],
  );

  useEffect(() => {
    if (phase !== "playing" || !currentPlayer?.isBot) return;

    botTimerRef.current = setTimeout(() => {
      const hasBonus =
        (guaranteedSixBonuses[currentPlayer.id] ?? 0) > 0;

      if (hasBonus) {
        setGuaranteedSixBonuses((previous) => ({
          ...previous,
          [currentPlayer.id]: Math.max(
            0,
            (previous[currentPlayer.id] ?? 0) - 1,
          ),
        }));

        askQuestion(currentPlayer, 6);
      } else {
        const roll = Math.floor(Math.random() * 6) + 1;
        askQuestion(currentPlayer, roll);
      }
    }, 4000);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [phase, currentPlayer, askQuestion, guaranteedSixBonuses]);

  useEffect(() => {
    if (phase !== "question" || !currentPlayer?.isBot || !question) return;

    const delay =
      difficulty === "hard" ? 3200 : difficulty === "medium" ? 3800 : 4200;

    const chance =
      difficulty === "easy" ? 0.58 : difficulty === "medium" ? 0.76 : 0.91;

    botTimerRef.current = setTimeout(() => {
      const answer =
        Math.random() < chance
          ? question.correctAnswer
          : (question.correctAnswer + 1 + Math.floor(Math.random() * 3)) % 4;

      finishAnswer(answer);
    }, delay);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [phase, currentPlayer, question, difficulty, finishAnswer]);

  useEffect(() => {
    if (phase !== "feedback" || !currentPlayer?.isBot || !answerResult) {
      return;
    }

    botTimerRef.current = setTimeout(() => {
      if (answerResult.isCorrect && legalMoves.length > 0) {
        const move =
          legalMoves[Math.floor(Math.random() * legalMoves.length)];

        if (move) {
          void applyMove(move);
          return;
        }
      }

      continueAfterFeedback();
    }, BOT_FEEDBACK_MS);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [
    phase,
    currentPlayer,
    answerResult,
    legalMoves,
    applyMove,
    continueAfterFeedback,
  ]);

  const rankedPlayers = useMemo(
    () =>
      [...players].sort((a, b) => {
        if (a.hasWon !== b.hasWon) return a.hasWon ? -1 : 1;

        const aHome = a.tokens.filter(
          (token) =>
            getTokenStatus(token) === "home" ||
            token.position >= FINISH_POSITION,
        ).length;

        const bHome = b.tokens.filter(
          (token) =>
            getTokenStatus(token) === "home" ||
            token.position >= FINISH_POSITION,
        ).length;

        return bHome - aHome || b.score - a.score;
      }),
    [players],
  );

  const exitGame = useCallback(() => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    if (rollTimerRef.current) clearTimeout(rollTimerRef.current);

    movementLockRef.current = false;
    setIsAnimatingMove(false);
    setIsRolling(false);
    setPlayers([]);
    setTurn(0);
    setPhase("lobby");
    setDiceValue(null);
    clearQuestionState();
    setLearningStreaks({});
    setGuaranteedSixBonuses({});
    setShowExitConfirmation(false);
    onBack?.();
  }, [onBack, clearQuestionState]);

  const playAgain = useCallback(() => {
    setShowExitConfirmation(false);
    startGame();
  }, [startGame]);

  const sharedPlayers = useMemo(
    () => players.map(asSharedPlayer),
    [players],
  );

  const sharedTransactions = useMemo(
    () => transactions as unknown as EduLudoTransaction[],
    [transactions],
  );

  const selectedQuestion = question ? asSharedQuestion(question) : null;

  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-slate-950 px-3 py-5 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <EduLudoLobby
            mode={mode}
            subject={subject}
            level={level}
            difficulty={difficulty}
            playerColor={playerColor}
            balance={balance}
            cbtPoints={cbtPoints}
            onModeChange={setMode}
            onSubjectChange={setSubject}
            onLevelChange={setLevel}
            onDifficultyChange={setDifficulty}
            onPlayerColorChange={setPlayerColor}
            onStartGame={startGame}
            onBack={onBack}
            onFundWallet={onFundWallet}
            onViewRules={() => setDialog("rules")}
            onViewRewards={() => setDialog("rewards")}
          />

          <LudoGameDialogs
            activeDialog={dialog}
            onCloseDialog={() => setDialog(null)}
            balance={balance}
            cbtPoints={cbtPoints}
            transactions={sharedTransactions}
            onFundWallet={onFundWallet}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-2 py-3 text-white sm:px-5 sm:py-5">
      <div className="mx-auto max-w-5xl space-y-3">
        {/* Compact game header */}
        <header className="flex items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowExitConfirmation(true)}
              aria-label="Exit game"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-base font-black text-white sm:text-lg">
                Educational Ludo
              </h1>
              <p className="text-xs text-slate-400">
                Roll, answer, and move
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setDialog("wallet")}
              className="rounded-xl border border-emerald-800 bg-emerald-950 px-3 py-2 text-xs font-extrabold text-emerald-300 transition hover:bg-emerald-900 sm:text-sm"
            >
              <Wallet size={14} className="mr-1 inline" />
              {money(balance)}
            </button>

            <button
              type="button"
              onClick={() => setDialog("rewards")}
              className="rounded-xl border border-amber-800 bg-amber-950 px-3 py-2 text-xs font-extrabold text-amber-300 transition hover:bg-amber-900 sm:text-sm"
            >
              <Coins size={14} className="mr-1 inline" />
              {cbtPoints.toLocaleString()}
            </button>
          </div>
        </header>

        {phase !== "finished" && (
          <>
            {/* Current turn */}
            <section
              ref={currentTurnRef}
              className="scroll-mt-4 rounded-2xl border border-indigo-500/40 bg-slate-900 p-3 shadow-sm sm:p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {currentPlayer && (
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full ${
                        COLOR_STYLES[currentPlayer.color].bg
                      }`}
                    />
                  )}

                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Current turn
                    </p>
                    <h2 className="break-words text-lg font-black text-white sm:text-xl">
                      {currentPlayer?.name ?? "Waiting"}
                      {currentPlayer?.isBot ? " is playing" : ""}
                    </h2>
                  </div>
                </div>

                {diceValue !== null && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-indigo-400/50 bg-indigo-950 text-2xl font-black text-indigo-200">
                    {diceValue}
                  </div>
                )}
              </div>

              <p className="mt-2 text-sm text-slate-300">
                {phase === "moving"
                  ? "Your token is moving across the board."
                  : phase === "question"
                    ? "Answer the question to continue your move."
                    : phase === "feedback"
                      ? answerResult?.isCorrect
                        ? "Correct answer! Continue to your move."
                        : "Incorrect answer. Your turn will pass."
                      : currentPlayer?.isBot
                        ? "The computer is taking its turn."
                        : legalMoves.length > 0
                          ? "Select one of your highlighted tokens."
                          : "Roll the dice to begin your turn."}
              </p>

              {phase === "playing" &&
                currentPlayer &&
                !currentPlayer.isBot &&
                legalMoves.length === 0 && (
                  <button
                    type="button"
                    onClick={rollDice}
                    disabled={isRolling || isAnimatingMove}
                    className="mt-3 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Dices size={23} />
                    {isRolling ? "Rolling dice…" : "ROLL DICE"}
                  </button>
                )}

              {phase === "playing" &&
                currentPlayer &&
                !currentPlayer.isBot &&
                legalMoves.length > 0 && (
                  <div className="mt-3 rounded-xl border border-emerald-700/50 bg-emerald-950 p-3 text-sm font-bold text-emerald-300">
                    <CheckCircle2 size={17} className="mr-2 inline" />
                    Choose a highlighted token on the board.
                  </div>
                )}

              {phase === "moving" && (
                <div className="mt-3 rounded-xl border border-indigo-700/50 bg-indigo-950 p-3">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-indigo-200">
                    <span>Moving token</span>
                    <span>
                      {movementCount}/{diceValue ?? 0}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-900">
                    <div
                      className="h-full rounded-full bg-indigo-400 transition-all"
                      style={{
                        width: `${
                          diceValue
                            ? Math.min(100, (movementCount / diceValue) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {currentPlayer &&
                !currentPlayer.isBot &&
                phase === "playing" &&
                legalMoves.length === 0 &&
                currentBonuses > 0 && (
                  <button
                    type="button"
                    onClick={useGuaranteedSix}
                    disabled={isRolling || isAnimatingMove}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-700 bg-amber-950 px-4 py-3 text-sm font-extrabold text-amber-300 transition hover:bg-amber-900 disabled:opacity-50"
                  >
                    <Zap size={17} />
                    Use guaranteed 6 ({currentBonuses})
                  </button>
                )}
            </section>

          
           
{/* Board — keep the entire board visible during every player's turn */}
<section
  aria-label="Educational Ludo board"
  className="w-full min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-sm sm:p-3"
>
  <div className="mx-auto w-full min-w-0 max-w-[640px]">
    <LudoBoard
      players={sharedPlayers}
      currentPlayerId={currentPlayer?.id ?? null}
      legalMoves={legalMoves}
      selectedTokenId={selectedTokenId}
      diceValue={diceValue}
      disabled={
        isRolling ||
        isAnimatingMove ||
        currentPlayer?.isBot === true ||
        phase !== "playing" ||
        legalMoves.length === 0
      }
      onTokenClick={selectToken}
      onDiceClick={rollDice}
      showDice
      movementCount={movementCount}
      isMoving={isAnimatingMove}
    />
  </div>
</section>


            {/* Secondary controls */}
            <details className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-slate-200">
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <Users size={17} className="mr-2 inline" />
                    Players and progress
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    View
                  </span>
                </span>
              </summary>

              <div className="space-y-4 border-t border-slate-800 p-3 sm:p-4">
                <LudoPlayersPanel
                  players={sharedPlayers}
                  currentPlayerId={currentPlayer?.id ?? null}
                  currentTurn={turn}
                  cbtPoints={cbtPoints}
                  showTokenProgress
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
                    <p className="text-xs text-slate-400">Questions</p>
                    <p className="mt-1 text-xl font-black text-white">
                      {questionCount}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-3">
                    <p className="text-xs text-emerald-300">Rewards earned</p>
                    <p className="mt-1 text-xl font-black text-emerald-200">
                      +{matchReward} CBT
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-indigo-800 bg-slate-800/70 p-3">
                  <p className="font-bold text-white">
                    <BookOpen size={16} className="mr-2 inline" />
                    Learning streak
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    {currentStreak}/{CORRECT_ANSWERS_FOR_BONUS} consecutive
                    correct answers
                  </p>
                  <div className="mt-2 grid grid-cols-6 gap-1.5">
                    {Array.from(
                      { length: CORRECT_ANSWERS_FOR_BONUS },
                      (_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full ${
                            index < currentStreak
                              ? "bg-indigo-400"
                              : "bg-slate-700"
                          }`}
                        />
                      ),
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Six consecutive correct answers earn a guaranteed 6.
                    Incorrect answers and timeouts reset the streak.
                  </p>
                  <p className="mt-2 text-sm font-bold text-amber-300">
                    <Zap size={15} className="mr-1 inline" />
                    Saved guaranteed sixes: {currentBonuses}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                  <p className="mb-3 font-bold text-white">
                    Match rewards
                  </p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <p className="flex justify-between gap-2">
                      <span>Question fee</span>
                      <strong className="text-white">
                        {money(QUESTION_COST)}
                      </strong>
                    </p>
                    <p className="flex justify-between gap-2">
                      <span>Correct answer</span>
                      <strong className="text-white">20–40 CBT</strong>
                    </p>
                    <p className="flex justify-between gap-2">
                      <span>Capture reward</span>
                      <strong className="text-white">
                        {CAPTURE_REWARD} CBT
                      </strong>
                    </p>
                    <p className="flex justify-between gap-2">
                      <span>Token home reward</span>
                      <strong className="text-white">
                        {TOKEN_HOME_REWARD} CBT
                      </strong>
                    </p>
                    <p className="flex justify-between gap-2">
                      <span>Winner reward</span>
                      <strong className="text-white">
                        {WINNER_REWARD} CBT
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </details>

            {/* Utility buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDialog("rules")}
                className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-3 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <Info size={16} className="mx-auto mb-1" />
                Rules
              </button>

              <button
                type="button"
                onClick={() => setDialog("history")}
                className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-3 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <History size={16} className="mx-auto mb-1" />
                History
              </button>

              <button
                type="button"
                onClick={() => setShowExitConfirmation(true)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-3 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <ArrowLeft size={16} className="mx-auto mb-1" />
                Exit game
              </button>
            </div>
          </>
        )}

        {/* Finished-game screen */}
        {phase === "finished" && (
          <section className="rounded-2xl border border-amber-700/50 bg-slate-900 p-5 shadow-sm sm:p-8">
            <div className="text-center">
              <Trophy size={40} className="mx-auto text-amber-400" />
              <h2 className="mt-3 text-2xl font-black text-white">
                Game completed!
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Here is the final ranking.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {rankedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 font-black text-white">
                    {index + 1}
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      COLOR_STYLES[player.color].bg
                    }`}
                  />
                  <span className="min-w-0 flex-1 font-bold text-white">
                    {player.name}
                    {player.hasWon ? " — Winner" : ""}
                  </span>
                  <span className="shrink-0 text-sm font-extrabold text-amber-300">
                    {player.score} CBT
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={playAgain}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
              >
                <RotateCcw size={16} />
                Play again
              </button>
              <button
                type="button"
                onClick={exitGame}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-700"
              >
                Return to lobby
              </button>
            </div>
          </section>
        )}

        {/* Question UI */}
        <QuestionModal
          question={selectedQuestion}
          open={
            (phase === "question" || phase === "feedback") &&
            Boolean(question)
          }
          timeLimit={QUESTION_TIME_LIMIT}
          questionCost={QUESTION_COST}
          disabled={Boolean(currentPlayer?.isBot)}
          submitting={false}
          selectedAnswer={selectedAnswer}
          result={answerResult}
          onAnswer={finishAnswer}
          onTimeUp={() => finishAnswer(-1)}
          onClose={() => {
            if (!currentPlayer?.isBot) {
              notify("Please answer the question to continue.");
            }
          }}
          onContinue={
            currentPlayer?.isBot ? undefined : continueAfterFeedback
          }
          showTimer
          showCost
          allowClose={false}
        />

        {/* Existing dialogs */}
        <LudoGameDialogs
          activeDialog={dialog}
          onCloseDialog={() => setDialog(null)}
          showExitConfirmation={showExitConfirmation}
          onCancelExit={() => setShowExitConfirmation(false)}
          onConfirmExit={exitGame}
          showGameOver={false}
          winner={null}
          players={sharedPlayers}
          matchReward={matchReward}
          onPlayAgain={playAgain}
          onReturnToLobby={exitGame}
          balance={balance}
          cbtPoints={cbtPoints}
          transactions={sharedTransactions}
          onFundWallet={onFundWallet}
        />

        {toast && (
          <div
            role="status"
            className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"
          >
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}