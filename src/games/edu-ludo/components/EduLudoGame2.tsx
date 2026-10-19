















"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Dices,
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

  // Learning streaks and earned bonuses are stored separately per player ID.
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

  // Spend one stored bonus to guarantee a 6 on this future turn.
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
          // Reset the streak after awarding a bonus, so another bonus
          // requires six new consecutive correct answers.
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
        // Wrong answers and timeouts both break the streak.
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

      // Set final token positions before reward updates to avoid overwriting
      // score changes made by awardCbt.
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

  /**
   * Moves the token through each intermediate position. During this time,
   * phase="moving" prevents another action from starting.
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

  const previousPlayerId = previousTurnPlayerIdRef.current;
  const currentPlayerId = currentPlayer.id;

  // Save the current player so we can detect the next turn.
  previousTurnPlayerIdRef.current = currentPlayerId;

  // Don't scroll when a match first starts.
  if (!previousPlayerId || previousPlayerId === currentPlayerId) {
    return;
  }

  const timeout = window.setTimeout(() => {
    if (!mountedRef.current) return;

    currentTurnRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 150);

  return () => window.clearTimeout(timeout);
}, [currentPlayer?.id, phase, currentPlayer]);



  const continueAfterFeedback = useCallback(() => {
    if (!answerResult || !currentPlayer || phase !== "feedback") return;

    if (!answerResult.isCorrect || legalMoves.length === 0) {
      clearQuestionState();
      setDiceValue(null);
      setPhase("playing");
      setTurn((index) => (index + 1) % players.length);
      return;
    }

    // Keep the dice result and legal moves visible for token selection.
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




  // Bots use a stored bonus automatically on a future turn.
  // Human players decide whether to use their bonus.
  
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

  // Give bots time to read the question before answering.
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

  // Keep bot feedback visible before the bot moves or ends its turn.
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
<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm">
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
                    
                    <h2
  ref={currentTurnRef}
  className="max-w-full break-words [overflow-wrap:anywhere] scroll-mt-24 text-lg font-black text-slate-900"
>
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

              {/* Current player's learning streak and stored bonus. */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                  <div className="flex items-center gap-2 text-indigo-800">
                    <BookOpen size={18} />
                    <p className="text-sm font-extrabold">Learning streak</p>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-2xl font-black text-indigo-950">
                      {currentStreak}/{CORRECT_ANSWERS_FOR_BONUS}
                    </p>
                    <p className="text-xs font-semibold text-indigo-700">
                      Consecutive correct
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-6 gap-1.5">
                    {Array.from(
                      { length: CORRECT_ANSWERS_FOR_BONUS },
                      (_, index) => (
                        <div
                          key={index}
                          className={`h-2.5 rounded-full ${
                            index < currentStreak
                              ? "bg-indigo-600"
                              : "bg-indigo-200"
                          }`}
                        />
                      ),
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-indigo-800">
                    Answer six questions correctly in a row to earn a
                    guaranteed 6. A wrong answer or timeout resets the streak.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Zap size={18} />
                    <p className="text-sm font-extrabold">Guaranteed 6</p>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-2xl font-black text-amber-950">
                      {currentBonuses}
                    </p>
                    <p className="text-xs font-semibold text-amber-800">
                      Bonus{currentBonuses === 1 ? "" : "es"} saved
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-amber-900">
                    Save your bonus and choose a future turn to use it.
                    Using one guarantees a dice result of 6.
                  </p>

                  {currentPlayer &&
                    !currentPlayer.isBot &&
                    phase === "playing" &&
                    legalMoves.length === 0 &&
                    currentBonuses > 0 && (
                      <button
                        type="button"
                        onClick={useGuaranteedSix}
                        disabled={isRolling || isAnimatingMove}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Zap size={16} />
                        {isRolling ? "Preparing guaranteed 6…" : "Use guaranteed 6"}
                      </button>
                    )}
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
    <div className="flex items-center justify-between gap-3">
      <p className="font-extrabold text-indigo-900">
        {currentPlayer?.isBot
          ? `${currentPlayer.name} is moving a token...`
          : "Moving your token..."}
      </p>

      {diceValue !== null && (
        <span className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-sm font-black text-indigo-700">
          Dice: {diceValue}
        </span>
      )}
    </div>

    <p className="mt-2 text-sm text-indigo-800">
      Watch the token move square by square.
    </p>

    <div className="mt-3 flex items-center justify-between text-sm font-bold text-indigo-900">
      <span>Movement progress</span>
      <span>
        {movementCount}/{diceValue ?? 0}
      </span>
    </div>

    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-indigo-200">
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
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

              {phase === "playing" && !currentPlayer?.isBot && (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                      <BookOpen size={18} />
                    </div>

<div className="min-w-0 flex-1 rounded-xl border border-indigo-200 bg-white p-3 shadow-md transition-all duration-300">
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
      {legalMoves.length > 0 ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <Dices className="h-5 w-5" />
      )}
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">
        {currentPlayer?.name ?? "Player"} — YOUR TURN
      </p>

      <p className="mt-1 text-sm font-bold text-indigo-950">
        {legalMoves.length > 0
          ? "Choose a highlighted token"
          : "Your turn to play"}
      </p>

      <p className="mt-1 text-xs leading-5 text-indigo-800">
        {legalMoves.length > 0
          ? `Your dice shows ${diceValue}. Select one of the highlighted tokens to count out the move.`
          : currentBonuses > 0
            ? `Roll normally or use one of your ${currentBonuses} saved guaranteed-6 bonus${currentBonuses === 1 ? "" : "es"}. You will receive a question either way.`
            : `Roll the dice to receive a question. Answer correctly to move a legal token. Each question costs ${money(QUESTION_COST)}.`}
      </p>
    </div>

    {legalMoves.length > 0 && (
      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-extrabold text-emerald-700">
        MOVE
      </span>
    )}
  </div>
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
                  <p className="flex items-center justify-between gap-3">
                    <span>Correct streak bonus</span>
                    <strong>6 in a row = 1 guaranteed 6</strong>
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




























