




"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Coins,
  History,
  Info,
  RotateCcw,
  Trophy,
  Wallet,
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

type LocalQuestion = {
  id: string;
  subject: string;
  level: string;
  difficulty: EduLudoDifficulty;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

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
const MOVEMENT_STEP_MS = 300;
const BOT_FEEDBACK_MS = 5000;

const START_POSITIONS: Record<EduLudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

const SAFE_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

const DIFFICULTY_POINTS: Record<EduLudoDifficulty, number> = {
  easy: 20,
  medium: 30,
  hard: 40,
};

const QUESTION_BANK: LocalQuestion[] = [
  {
    id: "math-001",
    subject: "Mathematics",
    level: "JAMB",
    difficulty: "easy",
    content: "What is 15% of 200?",
    options: ["15", "20", "30", "35"],
    correctAnswer: 2,
    explanation: "15% of 200 = 0.15 × 200 = 30.",
  },
  {
    id: "math-002",
    subject: "Mathematics",
    level: "JAMB",
    difficulty: "medium",
    content: "Solve for x: 3x + 7 = 22.",
    options: ["3", "5", "7", "9"],
    correctAnswer: 1,
    explanation: "Subtract 7 to get 3x = 15, then divide by 3.",
  },
  {
    id: "math-003",
    subject: "Mathematics",
    level: "JAMB",
    difficulty: "hard",
    content: "If x² − 5x + 6 = 0, what are the roots?",
    options: ["1 and 6", "−2 and −3", "2 and 3", "−1 and −6"],
    correctAnswer: 2,
    explanation: "Factorise as (x − 2)(x − 3) = 0.",
  },
  {
    id: "eng-001",
    subject: "English",
    level: "JAMB",
    difficulty: "easy",
    content: "Choose the word nearest in meaning to 'diligent'.",
    options: ["Careless", "Hardworking", "Impatient", "Weak"],
    correctAnswer: 1,
    explanation: "Diligent means careful and hardworking.",
  },
  {
    id: "eng-002",
    subject: "English",
    level: "JAMB",
    difficulty: "medium",
    content: "Choose the correct sentence.",
    options: [
      "She have finished her work.",
      "She has finish her work.",
      "She has finished her work.",
      "She having finished her work.",
    ],
    correctAnswer: 2,
    explanation: "'Has finished' is the correct present perfect form.",
  },
  {
    id: "sci-001",
    subject: "Science",
    level: "JAMB",
    difficulty: "easy",
    content: "Which organ pumps blood around the human body?",
    options: ["Liver", "Kidney", "Heart", "Lung"],
    correctAnswer: 2,
    explanation: "The heart pumps blood through the circulatory system.",
  },
  {
    id: "bio-001",
    subject: "Biology",
    level: "JAMB",
    difficulty: "medium",
    content: "Which cell organelle is mainly responsible for photosynthesis?",
    options: ["Nucleus", "Chloroplast", "Ribosome", "Mitochondrion"],
    correctAnswer: 1,
    explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis.",
  },
  {
    id: "chem-001",
    subject: "Chemistry",
    level: "JAMB",
    difficulty: "medium",
    content: "What is the chemical symbol for sodium?",
    options: ["So", "S", "Na", "N"],
    correctAnswer: 2,
    explanation: "Sodium's chemical symbol is Na.",
  },
  {
    id: "phy-001",
    subject: "Physics",
    level: "JAMB",
    difficulty: "medium",
    content: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Pascal", "Newton"],
    correctAnswer: 3,
    explanation: "Force is measured in newtons (N).",
  },
];

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
  let pool = QUESTION_BANK.filter(
    (item) =>
      (subject === "All Subjects" || item.subject === subject) &&
      (item.level === level || level === "Custom") &&
      item.difficulty === difficulty &&
      !seen.includes(item.id),
  );

  if (pool.length === 0) {
    pool = QUESTION_BANK.filter(
      (item) =>
        (subject === "All Subjects" || item.subject === subject) &&
        !seen.includes(item.id),
    );
  }

  if (pool.length === 0) {
    pool = QUESTION_BANK.filter(
      (item) => subject === "All Subjects" || item.subject === subject,
    );
  }

  if (pool.length === 0) pool = QUESTION_BANK;

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

  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerGuardRef = useRef(false);
  const movementLockRef = useRef(false);
  const mountedRef = useRef(true);

  const currentPlayer = players[turn] ?? null;

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
      isRolling ||
      isAnimatingMove ||
      legalMoves.length > 0
    ) {
      return;
    }

    if (!currentPlayer.isBot && balance < QUESTION_COST) {
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

        setLegalMoves(getLegalMoves(currentPlayer, diceValue ?? 1));
      } else {
        setLegalMoves([]);
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
    ],
  );

  /**
   * Resolves captures and rewards after the token has visibly completed
   * its step-by-step journey.
   */
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

      if (hasWon) {
        setPlayers(
          updatedPlayers.map((player) =>
            player.id === actor.id ? { ...player, hasWon: true } : player,
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

        awardCbt(actor.id, WINNER_REWARD, "Educational Ludo winner reward");
        setIsAnimatingMove(false);
        movementLockRef.current = false;
        setPhase("finished");
        setToast("Congratulations! You completed the game.");
        return;
      }

      setPlayers(updatedPlayers);

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
      setPhase("playing");
      setTurn((index) => (index + 1) % updatedPlayers.length);
    },
    [players, awardCbt],
  );

  /**
   * Moves the token through each intermediate position. During this time,
   * phase="moving" prevents the player or bot from starting another action.
   */
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

          if (index < stepPositions.length - 1) {
            await wait(MOVEMENT_STEP_MS);
          }
        }

        if (!mountedRef.current) return;

        /*
         * Let React paint the final square before resolving captures,
         * rewards and the next turn.
         */
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

  const continueAfterFeedback = useCallback(() => {
    if (!answerResult || !currentPlayer || phase !== "feedback") return;

    if (!answerResult.isCorrect || legalMoves.length === 0) {
      clearQuestionState();
      setDiceValue(null);
      setPhase("playing");
      setTurn((index) => (index + 1) % players.length);
      return;
    }

    /*
     * Keep the dice result and legal moves visible. The player can now
     * choose a highlighted token on the board.
     */
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
    [
      phase,
      isAnimatingMove,
      currentPlayer,
      legalMoves,
      applyMove,
    ],
  );

  // Start a bot's turn.
  useEffect(() => {
    if (phase !== "playing" || !currentPlayer?.isBot) return;

    botTimerRef.current = setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      askQuestion(currentPlayer, roll);
    }, 1200);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [phase, currentPlayer, askQuestion]);

  // Give bots time to "read" the question before they answer.
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

  // Leave bot answer feedback visible for five seconds before proceeding.
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
      <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6">
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
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowExitConfirmation(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Back to lobby"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-lg font-black text-slate-900 sm:text-xl">
                Educational Ludo
              </h1>
              <p className="text-xs text-slate-500">
                Answer questions, count moves, earn CBT Points
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDialog("wallet")}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800"
            >
              <Wallet size={16} />
              {money(balance)}
            </button>

            <button
              type="button"
              onClick={() => setDialog("rewards")}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800"
            >
              <Coins size={16} />
              {cbtPoints.toLocaleString()} CBT
            </button>

            <button
              type="button"
              onClick={() => setDialog("history")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Transaction history"
            >
              <History size={18} />
            </button>

            <button
              type="button"
              onClick={() => setDialog("rules")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Game rules"
            >
              <Info size={18} />
            </button>
          </div>
        </header>

        {phase !== "finished" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
            <section className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Current turn
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {currentPlayer && (
                      <span
                        className={`h-3 w-3 rounded-full ${COLOR_STYLES[currentPlayer.color].bg}`}
                      />
                    )}
                    <h2 className="text-lg font-black text-slate-900">
                      {currentPlayer?.name ?? "Waiting"}
                    </h2>
                    {currentPlayer?.isBot && (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                        COMPUTER
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg bg-indigo-50 px-3 py-2 font-bold text-indigo-700">
                    Question {questionCount}
                  </span>
                  <span className="rounded-lg bg-amber-50 px-3 py-2 font-bold text-amber-800">
                    Fee: {money(QUESTION_COST)} per human question
                  </span>
                </div>
              </div>

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

              {phase === "moving" && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                  <p className="font-extrabold text-indigo-900">
                    Moving your token...
                  </p>
                  <p className="mt-1 text-sm text-indigo-800">
                    Count each square. The token will stop when it reaches
                    the number shown on the dice.
                  </p>
                </div>
              )}

              {phase === "playing" && !currentPlayer?.isBot && (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                      <BookOpen size={18} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-bold text-indigo-950">
                        {legalMoves.length > 0
                          ? "Choose a highlighted token"
                          : "Your turn to play"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-indigo-800">
                        {legalMoves.length > 0
                          ? `Your dice shows ${diceValue}. Select one of the highlighted tokens to count out the move.`
                          : `Roll the dice to receive a question. Answer correctly to move a legal token. Each question costs ${money(QUESTION_COST)}.`}
                      </p>
                    </div>

                    {legalMoves.length === 0 && (
                      <button
                        type="button"
                        onClick={rollDice}
                        disabled={isRolling || isAnimatingMove}
                        className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isRolling ? "Rolling…" : "Roll Dice"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>

            <aside className="min-w-0 space-y-4">
              <LudoPlayersPanel
                players={sharedPlayers}
                currentPlayerId={currentPlayer?.id ?? null}
                currentTurn={turn}
                cbtPoints={cbtPoints}
                showTokenProgress
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">Match summary</h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Questions</p>
                    <p className="mt-1 text-xl font-black text-slate-900">
                      {questionCount}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Match rewards</p>
                    <p className="mt-1 text-xl font-black text-emerald-700">
                      +{matchReward}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <p className="flex items-center justify-between gap-3">
                    <span>Question fee</span>
                    <strong>{money(QUESTION_COST)}</strong>
                  </p>
                  <p className="flex items-center justify-between gap-3">
                    <span>Correct answer</span>
                    <strong>20–40 CBT</strong>
                  </p>
                  <p className="flex items-center justify-between gap-3">
                    <span>Capture reward</span>
                    <strong>{CAPTURE_REWARD} CBT</strong>
                  </p>
                  <p className="flex items-center justify-between gap-3">
                    <span>Token home reward</span>
                    <strong>{TOKEN_HOME_REWARD} CBT</strong>
                  </p>
                  <p className="flex items-center justify-between gap-3">
                    <span>Winner reward</span>
                    <strong>{WINNER_REWARD} CBT</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowExitConfirmation(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Exit match
              </button>
            </aside>
          </div>
        )}

        {phase === "finished" && (
          <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Trophy size={32} />
              </div>

              <h2 className="mt-4 text-2xl font-black text-slate-900">
                Game completed!
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Great effort. Here is the final ranking for this match.
              </p>

              <div className="mt-6 space-y-2 text-left">
                {rankedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
                      {index + 1}
                    </span>

                    <span
                      className={`h-3 w-3 rounded-full ${COLOR_STYLES[player.color].bg}`}
                    />

                    <span className="flex-1 font-bold text-slate-900">
                      {player.name}
                      {player.hasWon ? " — Winner" : ""}
                    </span>

                    <span className="font-extrabold tabular-nums text-slate-900">
                      {player.score} CBT
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={playAgain}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  <RotateCcw size={16} />
                  Play again
                </button>

                <button
                  type="button"
                  onClick={exitGame}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Return to lobby
                </button>
              </div>
            </div>
          </section>
        )}

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
            className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"
          >
            {toast}
          </div>
        )}
      </div>
    </main>
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

// type Phase = "lobby" | "playing" | "question" | "feedback" | "finished";
// type Dialog = "rules" | "wallet" | "rewards" | "history" | null;

// /**
//  * FIX:
//  * status is optional because EduLudoToken.status is also optional
//  * in the shared types. Game logic derives a fallback status from
//  * the token's position whenever needed.
//  */
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

// const START_POSITIONS: Record<EduLudoColor, number> = {
//   red: 0,
//   green: 13,
//   yellow: 26,
//   blue: 39,
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
//   difficulty: EduLudoDifficulty,
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

//     const player: LocalPlayer = {
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

//     if (isBot) {
//       (player as LocalPlayer & { difficulty?: EduLudoDifficulty }).difficulty =
//         difficulty;
//     }

//     return player;
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
//     (question) =>
//       (subject === "All Subjects" || question.subject === subject) &&
//       (question.level === level || level === "Custom") &&
//       question.difficulty === difficulty &&
//       !seen.includes(question.id),
//   );

//   if (pool.length === 0) {
//     pool = QUESTION_BANK.filter(
//       (question) =>
//         (subject === "All Subjects" || question.subject === subject) &&
//         !seen.includes(question.id),
//     );
//   }

//   if (pool.length === 0) {
//     pool = QUESTION_BANK.filter(
//       (question) =>
//         subject === "All Subjects" || question.subject === subject,
//     );
//   }

//   if (pool.length === 0) pool = QUESTION_BANK;

//   return pool[Math.floor(Math.random() * pool.length)];
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

//   const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const rollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const answerGuardRef = useRef(false);

//   const currentPlayer = players[turn] ?? null;
//   const humanPlayer = players.find((player) => !player.isBot) ?? null;

//   const notify = useCallback((message: string) => {
//     setToast(message);
//   }, []);

//   useEffect(() => {
//     if (!toast) return;

//     const timeout = setTimeout(() => setToast(""), 2600);
//     return () => clearTimeout(timeout);
//   }, [toast]);

//   useEffect(() => {
//     return () => {
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//       if (rollTimerRef.current) clearTimeout(rollTimerRef.current);
//     };
//   }, []);

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

//   const startGame = useCallback(() => {
//     if (mode !== "solo") {
//       notify("Multiplayer modes are coming soon. Solo mode is available now.");
//       return;
//     }

//     setPlayers(makePlayers(playerColor, difficulty));
//     setTurn(0);
//     setPhase("playing");
//     setDiceValue(null);
//     setQuestion(null);
//     setAnswerResult(null);
//     setLegalMoves([]);
//     setSelectedTokenId(null);
//     setQuestionCount(0);
//     setMatchReward(0);
//     setSeenQuestions([]);
//     setSelectedAnswer(null);
//     answerGuardRef.current = false;
//   }, [mode, playerColor, difficulty, notify]);

//   const getLegalMoves = useCallback(
//     (player: LocalPlayer, roll: number) => {
//       const moves: EduLudoMove[] = [];

//       for (const token of player.tokens) {
//         const status = getTokenStatus(token);

//         if (status === "home" || token.position === FINISH_POSITION) {
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

//         const nextPosition = token.position + roll;

//         if (nextPosition > FINISH_POSITION) continue;

//         moves.push(
//           asSharedMove({
//             playerId: player.id,
//             tokenId: token.id,
//             fromPosition: token.position,
//             toPosition: nextPosition,
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
//     if (phase !== "playing" || !currentPlayer || isRolling) return;

//     if (!currentPlayer.isBot && balance < QUESTION_COST) {
//       setDialog("wallet");
//       notify(`Your wallet needs at least ${money(QUESTION_COST)}.`);
//       return;
//     }

//     setIsRolling(true);
//     setDiceValue(null);

//     rollTimerRef.current = setTimeout(() => {
//       const roll = Math.floor(Math.random() * 6) + 1;
//       setIsRolling(false);
//       askQuestion(currentPlayer, roll);
//     }, 650);
//   }, [phase, currentPlayer, isRolling, balance, notify, askQuestion]);

//   const finishAnswer = useCallback(
//     (answerIndex: number) => {
//       if (!question || !currentPlayer || answerGuardRef.current) return;

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
//       }

//       if (correct) {
//         const moves = getLegalMoves(currentPlayer, diceValue ?? 1);
//         setLegalMoves(moves);
//       }

//       setPhase("feedback");
//     },
//     [question, currentPlayer, diceValue, awardCbt, getLegalMoves],
//   );

//   /**
//    * EduLudoMove uses `from` and `to` (the shared component interface).
//    * Convert those values here instead of treating the move as if it had
//    * `fromPosition` and `toPosition` fields.
//    */
//   const applyMove = useCallback(
//     (move: EduLudoMove) => {
//       const actor = players.find((player) => player.id === move.playerId);
//       if (!actor) return;

//       const tokenId = move.tokenId;
//       const destination = Number(move.to);
//       if (!Number.isFinite(destination)) return;

//       const oldToken = actor.tokens.find((token) => token.id === tokenId);
//       if (!oldToken) return;

//       const globalDestination =
//         destination >= 0 && destination < TRACK_LENGTH
//           ? (START_POSITIONS[actor.color] + destination) % TRACK_LENGTH
//           : -1;

//       let capturedCount = 0;

//       const updatedPlayers: LocalPlayer[] = players.map((player) => {
//         if (player.id === actor.id) {
//           const updatedTokens: LocalToken[] = player.tokens.map((token) => {
//             if (token.id !== tokenId) return token;

//             return {
//               ...token,
//               position: destination,
//               status:
//                 destination >= FINISH_POSITION
//                   ? ("home" as const)
//                   : ("track" as const),
//             };
//           });

//           return { ...player, tokens: updatedTokens };
//         }

//         if (
//           globalDestination < 0 ||
//           SAFE_POSITIONS.has(globalDestination)
//         ) {
//           return player;
//         }

//         let playerCaptured = false;

//         const updatedTokens: LocalToken[] = player.tokens.map((token) => {
//           const tokenStatus = getTokenStatus(token);

//           if (
//             token.position < 0 ||
//             token.position >= TRACK_LENGTH ||
//             tokenStatus === "home"
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

//       const hasWon = updatedActor.tokens.every(
//         (token) =>
//           getTokenStatus(token) === "home" ||
//           token.position >= FINISH_POSITION,
//       );

//       if (hasWon) {
//         const finalPlayers: LocalPlayer[] = updatedPlayers.map((player) =>
//           player.id === actor.id ? { ...player, hasWon: true } : player,
//         );

//         setPlayers(finalPlayers);
//         awardCbt(actor.id, WINNER_REWARD, "Educational Ludo winner reward");
//         setPhase("finished");
//         return;
//       }

//       setPlayers(updatedPlayers);
//       setSelectedTokenId(null);
//       setLegalMoves([]);
//       setQuestion(null);
//       setAnswerResult(null);
//       setDiceValue(null);
//       setPhase("playing");
//       setTurn((index) => (index + 1) % updatedPlayers.length);
//     },
//     [players, awardCbt],
//   );

//   const continueAfterFeedback = useCallback(() => {
//     if (!answerResult || !currentPlayer) return;

//     if (!answerResult.isCorrect || legalMoves.length === 0) {
//       setQuestion(null);
//       setAnswerResult(null);
//       setSelectedAnswer(null);
//       setDiceValue(null);
//       setLegalMoves([]);
//       setPhase("playing");
//       setTurn((index) => (index + 1) % players.length);
//       return;
//     }

//     setSelectedTokenId(null);
//     setPhase("playing");
//   }, [answerResult, currentPlayer, legalMoves, players.length]);

//   const selectToken = useCallback(
//     (player: EduLudoPlayer, tokenId: number) => {
//       if (
//         phase !== "playing" ||
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
//       applyMove(move);
//     },
//     [phase, currentPlayer, legalMoves, applyMove],
//   );

//   useEffect(() => {
//     if (phase !== "playing" || !currentPlayer?.isBot) return;

//     botTimerRef.current = setTimeout(() => {
//       const roll = Math.floor(Math.random() * 6) + 1;
//       askQuestion(currentPlayer, roll);
//     }, 900);

//     return () => {
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     };
//   }, [phase, currentPlayer, askQuestion]);

//   useEffect(() => {
//     if (phase !== "question" || !currentPlayer?.isBot || !question) return;

//     const chance =
//       difficulty === "easy" ? 0.58 : difficulty === "medium" ? 0.76 : 0.91;

//     botTimerRef.current = setTimeout(() => {
//       const answer =
//         Math.random() < chance
//           ? question.correctAnswer
//           : (question.correctAnswer + 1 + Math.floor(Math.random() * 3)) % 4;

//       finishAnswer(answer);
//     }, difficulty === "hard" ? 1400 : 1800);

//     return () => {
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     };
//   }, [phase, currentPlayer, question, difficulty, finishAnswer]);

//   useEffect(() => {
//     if (phase !== "feedback" || !currentPlayer?.isBot) return;

//     botTimerRef.current = setTimeout(() => {
//       if (answerResult?.isCorrect && legalMoves.length > 0) {
//         const move =
//           legalMoves[Math.floor(Math.random() * legalMoves.length)];

//         if (move) {
//           applyMove(move);
//         }
//       } else {
//         continueAfterFeedback();
//       }
//     }, 1300);

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

//     setPlayers([]);
//     setTurn(0);
//     setPhase("lobby");
//     setDiceValue(null);
//     setQuestion(null);
//     setAnswerResult(null);
//     setLegalMoves([]);
//     setSelectedTokenId(null);
//     setShowExitConfirmation(false);
//     onBack?.();
//   }, [onBack]);

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
//                 Answer questions, move tokens, earn CBT Points
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

//               <LudoBoard
//                 players={sharedPlayers}
//                 currentPlayerId={currentPlayer?.id ?? null}
//                 legalMoves={legalMoves}
//                 selectedTokenId={selectedTokenId}
//                 diceValue={diceValue}
//                 disabled={
//                   isRolling ||
//                   currentPlayer?.isBot === true ||
//                   phase !== "playing" ||
//                   legalMoves.length === 0
//                 }
//                 onTokenClick={selectToken}
//                 onDiceClick={rollDice}
//                 showDice
//               />

//               {phase === "feedback" && answerResult && (
//                 <div
//                   className={`rounded-2xl border p-4 ${
//                     answerResult.isCorrect
//                       ? "border-emerald-200 bg-emerald-50"
//                       : "border-rose-200 bg-rose-50"
//                   }`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="flex-1">
//                       <h3
//                         className={`font-extrabold ${
//                           answerResult.isCorrect
//                             ? "text-emerald-800"
//                             : "text-rose-800"
//                         }`}
//                       >
//                         {answerResult.isCorrect ? "Correct answer!" : "Not quite"}
//                       </h3>
//                       <p className="mt-1 text-sm text-slate-700">
//                         {answerResult.explanation}
//                       </p>
//                       {answerResult.isCorrect && legalMoves.length > 0 && (
//                         <p className="mt-2 text-xs font-semibold text-emerald-800">
//                           Select one of your highlighted tokens on the board.
//                         </p>
//                       )}
//                       {!answerResult.isCorrect && (
//                         <p className="mt-2 text-xs text-rose-700">
//                           Your turn will pass to the next player.
//                         </p>
//                       )}
//                     </div>

//                     {!currentPlayer?.isBot && (
//                       <button
//                         type="button"
//                         onClick={continueAfterFeedback}
//                         className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
//                       >
//                         Continue
//                       </button>
//                     )}
//                   </div>
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
//                         Your turn to play
//                       </p>
//                       <p className="mt-1 text-xs leading-5 text-indigo-800">
//                         Roll the dice to receive a question. Answer correctly
//                         to move a legal token. Each question costs{" "}
//                         {money(QUESTION_COST)}.
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={rollDice}
//                       disabled={isRolling}
//                       className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
//                     >
//                       {isRolling ? "Rolling…" : "Roll Dice"}
//                     </button>
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
//                     <span>Winner reward</span>
//                     <strong>{WINNER_REWARD} CBT</strong>
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
//           open={phase === "question" && Boolean(question)}
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
//           onContinue={continueAfterFeedback}
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
