





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

type Phase = "lobby" | "playing" | "question" | "feedback" | "finished";
type Dialog = "rules" | "wallet" | "rewards" | "history" | null;

/**
 * FIX:
 * status is optional because EduLudoToken.status is also optional
 * in the shared types. Game logic derives a fallback status from
 * the token's position whenever needed.
 */
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
  difficulty: EduLudoDifficulty,
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

    const player: LocalPlayer = {
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

    if (isBot) {
      (player as LocalPlayer & { difficulty?: EduLudoDifficulty }).difficulty =
        difficulty;
    }

    return player;
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
    (question) =>
      (subject === "All Subjects" || question.subject === subject) &&
      (question.level === level || level === "Custom") &&
      question.difficulty === difficulty &&
      !seen.includes(question.id),
  );

  if (pool.length === 0) {
    pool = QUESTION_BANK.filter(
      (question) =>
        (subject === "All Subjects" || question.subject === subject) &&
        !seen.includes(question.id),
    );
  }

  if (pool.length === 0) {
    pool = QUESTION_BANK.filter(
      (question) =>
        subject === "All Subjects" || question.subject === subject,
    );
  }

  if (pool.length === 0) pool = QUESTION_BANK;

  return pool[Math.floor(Math.random() * pool.length)];
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

  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerGuardRef = useRef(false);

  const currentPlayer = players[turn] ?? null;
  const humanPlayer = players.find((player) => !player.isBot) ?? null;

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
      if (rollTimerRef.current) clearTimeout(rollTimerRef.current);
    };
  }, []);

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

  const startGame = useCallback(() => {
    if (mode !== "solo") {
      notify("Multiplayer modes are coming soon. Solo mode is available now.");
      return;
    }

    setPlayers(makePlayers(playerColor, difficulty));
    setTurn(0);
    setPhase("playing");
    setDiceValue(null);
    setQuestion(null);
    setAnswerResult(null);
    setLegalMoves([]);
    setSelectedTokenId(null);
    setQuestionCount(0);
    setMatchReward(0);
    setSeenQuestions([]);
    setSelectedAnswer(null);
    answerGuardRef.current = false;
  }, [mode, playerColor, difficulty, notify]);

  const getLegalMoves = useCallback(
    (player: LocalPlayer, roll: number) => {
      const moves: EduLudoMove[] = [];

      for (const token of player.tokens) {
        const status = getTokenStatus(token);

        if (status === "home" || token.position === FINISH_POSITION) {
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

        const nextPosition = token.position + roll;

        if (nextPosition > FINISH_POSITION) continue;

        moves.push(
          asSharedMove({
            playerId: player.id,
            tokenId: token.id,
            fromPosition: token.position,
            toPosition: nextPosition,
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
    if (phase !== "playing" || !currentPlayer || isRolling) return;

    if (!currentPlayer.isBot && balance < QUESTION_COST) {
      setDialog("wallet");
      notify(`Your wallet needs at least ${money(QUESTION_COST)}.`);
      return;
    }

    setIsRolling(true);
    setDiceValue(null);

    rollTimerRef.current = setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setIsRolling(false);
      askQuestion(currentPlayer, roll);
    }, 650);
  }, [phase, currentPlayer, isRolling, balance, notify, askQuestion]);

  const finishAnswer = useCallback(
    (answerIndex: number) => {
      if (!question || !currentPlayer || answerGuardRef.current) return;

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
      }

      if (correct) {
        const moves = getLegalMoves(currentPlayer, diceValue ?? 1);
        setLegalMoves(moves);
      }

      setPhase("feedback");
    },
    [question, currentPlayer, diceValue, awardCbt, getLegalMoves],
  );

  /**
   * EduLudoMove uses `from` and `to` (the shared component interface).
   * Convert those values here instead of treating the move as if it had
   * `fromPosition` and `toPosition` fields.
   */
  const applyMove = useCallback(
    (move: EduLudoMove) => {
      const actor = players.find((player) => player.id === move.playerId);
      if (!actor) return;

      const tokenId = move.tokenId;
      const destination = Number(move.to);
      if (!Number.isFinite(destination)) return;

      const oldToken = actor.tokens.find((token) => token.id === tokenId);
      if (!oldToken) return;

      const globalDestination =
        destination >= 0 && destination < TRACK_LENGTH
          ? (START_POSITIONS[actor.color] + destination) % TRACK_LENGTH
          : -1;

      let capturedCount = 0;

      const updatedPlayers: LocalPlayer[] = players.map((player) => {
        if (player.id === actor.id) {
          const updatedTokens: LocalToken[] = player.tokens.map((token) => {
            if (token.id !== tokenId) return token;

            return {
              ...token,
              position: destination,
              status:
                destination >= FINISH_POSITION
                  ? ("home" as const)
                  : ("track" as const),
            };
          });

          return { ...player, tokens: updatedTokens };
        }

        if (
          globalDestination < 0 ||
          SAFE_POSITIONS.has(globalDestination)
        ) {
          return player;
        }

        let playerCaptured = false;

        const updatedTokens: LocalToken[] = player.tokens.map((token) => {
          const tokenStatus = getTokenStatus(token);

          if (
            token.position < 0 ||
            token.position >= TRACK_LENGTH ||
            tokenStatus === "home"
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

      const hasWon = updatedActor.tokens.every(
        (token) =>
          getTokenStatus(token) === "home" ||
          token.position >= FINISH_POSITION,
      );

      if (hasWon) {
        const finalPlayers: LocalPlayer[] = updatedPlayers.map((player) =>
          player.id === actor.id ? { ...player, hasWon: true } : player,
        );

        setPlayers(finalPlayers);
        awardCbt(actor.id, WINNER_REWARD, "Educational Ludo winner reward");
        setPhase("finished");
        return;
      }

      setPlayers(updatedPlayers);
      setSelectedTokenId(null);
      setLegalMoves([]);
      setQuestion(null);
      setAnswerResult(null);
      setDiceValue(null);
      setPhase("playing");
      setTurn((index) => (index + 1) % updatedPlayers.length);
    },
    [players, awardCbt],
  );

  const continueAfterFeedback = useCallback(() => {
    if (!answerResult || !currentPlayer) return;

    if (!answerResult.isCorrect || legalMoves.length === 0) {
      setQuestion(null);
      setAnswerResult(null);
      setSelectedAnswer(null);
      setDiceValue(null);
      setLegalMoves([]);
      setPhase("playing");
      setTurn((index) => (index + 1) % players.length);
      return;
    }

    setSelectedTokenId(null);
    setPhase("playing");
  }, [answerResult, currentPlayer, legalMoves, players.length]);

  const selectToken = useCallback(
    (player: EduLudoPlayer, tokenId: number) => {
      if (
        phase !== "playing" ||
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
      applyMove(move);
    },
    [phase, currentPlayer, legalMoves, applyMove],
  );

  useEffect(() => {
    if (phase !== "playing" || !currentPlayer?.isBot) return;

    botTimerRef.current = setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      askQuestion(currentPlayer, roll);
    }, 900);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [phase, currentPlayer, askQuestion]);

  useEffect(() => {
    if (phase !== "question" || !currentPlayer?.isBot || !question) return;

    const chance =
      difficulty === "easy" ? 0.58 : difficulty === "medium" ? 0.76 : 0.91;

    botTimerRef.current = setTimeout(() => {
      const answer =
        Math.random() < chance
          ? question.correctAnswer
          : (question.correctAnswer + 1 + Math.floor(Math.random() * 3)) % 4;

      finishAnswer(answer);
    }, difficulty === "hard" ? 1400 : 1800);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [phase, currentPlayer, question, difficulty, finishAnswer]);

  useEffect(() => {
    if (phase !== "feedback" || !currentPlayer?.isBot) return;

    botTimerRef.current = setTimeout(() => {
      if (answerResult?.isCorrect && legalMoves.length > 0) {
        const move =
          legalMoves[Math.floor(Math.random() * legalMoves.length)];

        if (move) {
          applyMove(move);
        }
      } else {
        continueAfterFeedback();
      }
    }, 1300);

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

    setPlayers([]);
    setTurn(0);
    setPhase("lobby");
    setDiceValue(null);
    setQuestion(null);
    setAnswerResult(null);
    setLegalMoves([]);
    setSelectedTokenId(null);
    setShowExitConfirmation(false);
    onBack?.();
  }, [onBack]);

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
                Answer questions, move tokens, earn CBT Points
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
                  currentPlayer?.isBot === true ||
                  phase !== "playing" ||
                  legalMoves.length === 0
                }
                onTokenClick={selectToken}
                onDiceClick={rollDice}
                showDice
              />

              {phase === "feedback" && answerResult && (
                <div
                  className={`rounded-2xl border p-4 ${
                    answerResult.isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3
                        className={`font-extrabold ${
                          answerResult.isCorrect
                            ? "text-emerald-800"
                            : "text-rose-800"
                        }`}
                      >
                        {answerResult.isCorrect ? "Correct answer!" : "Not quite"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-700">
                        {answerResult.explanation}
                      </p>
                      {answerResult.isCorrect && legalMoves.length > 0 && (
                        <p className="mt-2 text-xs font-semibold text-emerald-800">
                          Select one of your highlighted tokens on the board.
                        </p>
                      )}
                      {!answerResult.isCorrect && (
                        <p className="mt-2 text-xs text-rose-700">
                          Your turn will pass to the next player.
                        </p>
                      )}
                    </div>

                    {!currentPlayer?.isBot && (
                      <button
                        type="button"
                        onClick={continueAfterFeedback}
                        className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                      >
                        Continue
                      </button>
                    )}
                  </div>
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
                        Your turn to play
                      </p>
                      <p className="mt-1 text-xs leading-5 text-indigo-800">
                        Roll the dice to receive a question. Answer correctly
                        to move a legal token. Each question costs{" "}
                        {money(QUESTION_COST)}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={rollDice}
                      disabled={isRolling}
                      className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isRolling ? "Rolling…" : "Roll Dice"}
                    </button>
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
          open={phase === "question" && Boolean(question)}
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
          onContinue={continueAfterFeedback}
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
// import type { CSSProperties } from "react";
// import {
//   ArrowLeft, Award, BookOpen, CheckCircle2, ChevronRight, CircleHelp,
//   Coins, Crown, Dice5, Flag, History, Info, Loader2, LockKeyhole,
//   RotateCcw, ShieldCheck, Sparkles, Trophy, Wallet, X, Zap,
// } from "lucide-react";

// export type EduLudoMode = "solo" | "friends" | "classroom" | "tournament";
// export type EduLudoColor = "red" | "green" | "yellow" | "blue";
// type Level = "JSS" | "SSS" | "JAMB" | "WAEC" | "Custom";
// type Subject =
//   | "All Subjects"
//   | "Mathematics"
//   | "English"
//   | "Science"
//   | "Biology"
//   | "Chemistry"
//   | "Physics";
// type Difficulty = "Easy" | "Medium" | "Hard";
// type Token = { id: string; position: number; finished: boolean };
// type Player = {
//   id: string;
//   name: string;
//   color: EduLudoColor;
//   human: boolean;
//   tokens: Token[];
//   points: number;
//   difficulty?: Difficulty;
// };
// type Question = {
//   id: string;
//   subject: Exclude<Subject, "All Subjects">;
//   level: Level[];
//   difficulty: Difficulty;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
// };
// type Move = {
//   tokenId: string;
//   steps: number;
//   die?: number;
//   dieIndex?: number;
//   entersFromBase?: boolean;
//   description: string;
// };
// type Tx = { id: string; description: string; amount: number; at: string };
// type Props = {
//   initialBalance?: number;
//   initialCbtPoints?: number;
//   onBack?: () => void;
//   onFundWallet?: () => void;
// };

// const COLORS: Record<
//   EduLudoColor,
//   { label: string; main: string; light: string; text: string }
// > = {
//   red: { label: "Red", main: "#dc2626", light: "#fee2e2", text: "text-red-700" },
//   green: { label: "Green", main: "#16a34a", light: "#dcfce7", text: "text-green-700" },
//   yellow: { label: "Yellow", main: "#eab308", light: "#fef9c3", text: "text-yellow-800" },
//   blue: { label: "Blue", main: "#2563eb", light: "#dbeafe", text: "text-blue-700" },
// };

// const TRACK: [number, number][] = [
//   [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6],
//   [2, 6], [1, 6], [0, 6], [0, 7], [0, 8], [1, 8], [2, 8], [3, 8],
//   [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
//   [7, 14], [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8],
//   [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6],
//   [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3],
//   [8, 2], [8, 1], [8, 0], [7, 0], [6, 0],
// ];

// const START: Record<EduLudoColor, number> = {
//   red: 0,
//   green: 13,
//   yellow: 26,
//   blue: 39,
// };

// const HOME_LANE: Record<EduLudoColor, [number, number][]> = {
//   red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
//   green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
//   yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
//   blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
// };

// const BASES: Record<EduLudoColor, { r: number; c: number }> = {
//   red: { r: 9, c: 9 },
//   green: { r: 0, c: 9 },
//   yellow: { r: 0, c: 0 },
//   blue: { r: 9, c: 0 },
// };

// // Local sample questions. Connect your production question bank when ready.
// const QUESTIONS: Question[] = [
//   {
//     id: "m1", subject: "Mathematics", level: ["JSS", "SSS", "JAMB", "WAEC"],
//     difficulty: "Easy", question: "What is 15% of 200?",
//     options: ["15", "20", "30", "45"], correctAnswer: 2,
//     explanation: "15% of 200 = 0.15 × 200 = 30.",
//   },
//   {
//     id: "m2", subject: "Mathematics", level: ["SSS", "JAMB", "WAEC"],
//     difficulty: "Medium", question: "Solve: 3x − 7 = 14.",
//     options: ["5", "7", "9", "21"], correctAnswer: 1,
//     explanation: "Add 7 to both sides, then divide by 3: x = 7.",
//   },
//   {
//     id: "m3", subject: "Mathematics", level: ["SSS", "JAMB", "WAEC"],
//     difficulty: "Hard", question: "If f(x) = x² − 4x, what is f′(3)?",
//     options: ["2", "3", "6", "10"], correctAnswer: 0,
//     explanation: "f′(x) = 2x − 4, so f′(3) = 2.",
//   },
//   {
//     id: "e1", subject: "English", level: ["JSS", "SSS", "JAMB", "WAEC"],
//     difficulty: "Easy", question: "Choose the word closest in meaning to ‘rapid’.",
//     options: ["Slow", "Swift", "Quiet", "Weak"], correctAnswer: 1,
//     explanation: "Rapid means fast or swift.",
//   },
//   {
//     id: "e2", subject: "English", level: ["SSS", "JAMB", "WAEC"],
//     difficulty: "Medium", question: "Which sentence uses the semicolon correctly?",
//     options: [
//       "I came; and I saw.",
//       "It rained; we stayed indoors.",
//       "Because; it rained.",
//       "She; is ready.",
//     ],
//     correctAnswer: 1,
//     explanation: "A semicolon can join two closely related independent clauses.",
//   },
//   {
//     id: "e3", subject: "English", level: ["SSS", "JAMB", "WAEC"],
//     difficulty: "Hard",
//     question: "A statement that seems contradictory but may reveal truth is a…",
//     options: ["Metaphor", "Paradox", "Euphemism", "Hyperbole"],
//     correctAnswer: 1,
//     explanation: "A paradox appears contradictory but may express a truth.",
//   },
//   {
//     id: "s1", subject: "Science", level: ["JSS", "SSS", "Custom"],
//     difficulty: "Easy",
//     question: "Which gas do plants absorb during photosynthesis?",
//     options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
//     correctAnswer: 2,
//     explanation: "Plants use carbon dioxide, water and light to make sugars.",
//   },
//   {
//     id: "b1", subject: "Biology", level: ["SSS", "JAMB", "WAEC"],
//     difficulty: "Medium",
//     question: "Which organelle is the main site of aerobic respiration?",
//     options: ["Ribosome", "Mitochondrion", "Golgi body", "Vacuole"],
//     correctAnswer: 1,
//     explanation: "Most aerobic ATP production occurs in mitochondria.",
//   },
//   {
//     id: "c1", subject: "Chemistry", level: ["SSS", "JAMB", "WAEC"],
//     difficulty: "Hard",
//     question: "What is the oxidation number of sulfur in H₂SO₄?",
//     options: ["+2", "+4", "+6", "−2"],
//     correctAnswer: 2,
//     explanation: "2(+1) + S + 4(−2) = 0, so S = +6.",
//   },
//   {
//     id: "p1", subject: "Physics", level: ["SSS", "JAMB", "WAEC"],
//     difficulty: "Medium",
//     question: "A 2 kg object accelerates at 3 m/s². What is the net force?",
//     options: ["1.5 N", "5 N", "6 N", "9 N"],
//     correctAnswer: 2,
//     explanation: "Newton’s second law: F = ma = 2 × 3 = 6 N.",
//   },
// ];

// const safeTrack = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
// const POINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
//   Easy: 20,
//   Medium: 30,
//   Hard: 40,
// };
// const money = (n: number) => `₦${Math.max(0, n).toLocaleString("en-NG")}`;

// const makePlayers = (
//   color: EduLudoColor,
//   difficulty: Difficulty,
// ): Player[] => {
//   const others = (["red", "green", "yellow", "blue"] as EduLudoColor[]).filter(
//     (c) => c !== color,
//   );
//   const names = ["Ada", "Tunde", "Zara"];

//   return [
//     {
//       id: "human",
//       name: "You",
//       color,
//       human: true,
//       points: 0,
//       tokens: Array.from({ length: 4 }, (_, i) => ({
//         id: `human-${i}`,
//         position: -1,
//         finished: false,
//       })),
//     },
//     ...others.map((c, i) => ({
//       id: `bot-${i}`,
//       name: names[i],
//       color: c,
//       human: false,
//       difficulty,
//       points: 0,
//       tokens: Array.from({ length: 4 }, (_, j) => ({
//         id: `bot-${i}-${j}`,
//         position: -1,
//         finished: false,
//       })),
//     })),
//   ];
// };

// export default function EduLudoGame({
//   initialBalance = 500,
//   initialCbtPoints = 0,
//   onBack,
//   onFundWallet,
// }: Props) {
//   const [mode, setMode] = useState<EduLudoMode>("solo");
//   const [subject, setSubject] = useState<Subject>("All Subjects");
//   const [level, setLevel] = useState<Level>("JAMB");
//   const [playerColor, setPlayerColor] = useState<EduLudoColor>("red");
//   const [botDifficulty, setBotDifficulty] = useState<Difficulty>("Medium");
//   const [balance, setBalance] = useState(initialBalance);
//   const [cbtPoints, setCbtPoints] = useState(initialCbtPoints);
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [turn, setTurn] = useState(0);
//   const [phase, setPhase] = useState<
//     | "lobby"
//     | "preview"
//     | "countdown"
//     | "rolling"
//     | "question"
//     | "feedback"
//     | "move"
//     | "finished"
//   >("lobby");
//   const [dice, setDice] = useState<[number, number]>([1, 1]);
//   const [usedDice, setUsedDice] = useState<number[]>([]);
//   const [question, setQuestion] = useState<Question | null>(null);
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
//   const [answerStatus, setAnswerStatus] = useState<
//     "correct" | "wrong" | "timeout" | null
//   >(null);
//   const [timeLeft, setTimeLeft] = useState(15);
//   const [questionCount, setQuestionCount] = useState(0);
//   const [seenQuestions, setSeenQuestions] = useState<string[]>([]);
//   const [legalMoves, setLegalMoves] = useState<Move[]>([]);
//   const [moveMessage, setMoveMessage] = useState("");
//   const [txs, setTxs] = useState<Tx[]>([]);
//   const [drawer, setDrawer] = useState<
//     "rules" | "wallet" | "rewards" | "move" | null
//   >(null);
//   const [confirmExit, setConfirmExit] = useState(false);
//   const [rollAnim, setRollAnim] = useState(false);
//   const [winnerId, setWinnerId] = useState<string | null>(null);
//   const [matchReward, setMatchReward] = useState(0);
//   const [toast, setToast] = useState("");
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const answerSubmittedRef = useRef(false);

//   const current = players[turn];
//   const human = players.find((p) => p.human);

//   const eligibleQuestions = useMemo(
//     () =>
//       QUESTIONS.filter(
//         (q) =>
//           (subject === "All Subjects" || q.subject === subject) &&
//           q.level.includes(level),
//       ),
//     [subject, level],
//   );

//   const notify = useCallback((message: string) => {
//     setToast(message);
//     const id = setTimeout(() => setToast(""), 2600);
//     return () => clearTimeout(id);
//   }, []);

//   const stopTimer = useCallback(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = null;
//   }, []);

//   useEffect(
//     () => () => {
//       stopTimer();
//       if (botTimerRef.current) clearTimeout(botTimerRef.current);
//     },
//     [stopTimer],
//   );

//   const updatePlayer = useCallback(
//     (playerId: string, fn: (p: Player) => Player) =>
//       setPlayers((prev) =>
//         prev.map((p) => (p.id === playerId ? fn(p) : p)),
//       ),
//     [],
//   );

//   const addPoints = useCallback(
//     (playerId: string, amount: number, description: string) => {
//       updatePlayer(playerId, (p) => ({ ...p, points: p.points + amount }));

//       if (playerId === "human" && amount > 0) {
//         setCbtPoints((v) => v + amount);
//         setMatchReward((v) => v + amount);
//         setTxs((v) => [
//           {
//             id: `${Date.now()}-${Math.random()}`,
//             description,
//             amount,
//             at: new Date().toISOString(),
//           },
//           ...v,
//         ]);
//         notify(`+${amount} CBT Points`);
//       }
//     },
//     [notify, updatePlayer],
//   );

//   const startPreview = () => {
//     if (mode !== "solo") {
//       notify("Multiplayer is coming soon. Solo mode is playable now.");
//       return;
//     }

//     setPlayers(makePlayers(playerColor, botDifficulty));
//     setTurn(0);
//     setDice([1, 1]);
//     setUsedDice([]);
//     setQuestion(null);
//     setSelectedAnswer(null);
//     setAnswerStatus(null);
//     setSeenQuestions([]);
//     setQuestionCount(0);
//     setTxs([]);
//     setMatchReward(0);
//     setWinnerId(null);
//     setLegalMoves([]);
//     setMoveMessage("");
//     setDrawer(null);
//     setAnswerSubmittedRefValue(false);
//     setPhase("preview");
//   };

//   // Keeps the answer guard in sync when starting or changing questions.
//   const setAnswerSubmittedRefValue = (value: boolean) => {
//     answerSubmittedRef.current = value;
//   };

//   const beginCountdown = () => {
//     if (balance < 2) {
//       setDrawer("wallet");
//       notify("You need at least ₦2 before the first question.");
//       return;
//     }

//     setPhase("countdown");
//     let n = 3;
//     setToast("3");

//     const run = () => {
//       n -= 1;
//       if (n > 0) {
//         setToast(String(n));
//       } else {
//         setToast("GO!");
//         setTimeout(() => {
//           setToast("");
//           setPhase("rolling");
//         }, 450);
//       }
//     };

//     setTimeout(run, 700);
//     setTimeout(run, 1400);
//     setTimeout(run, 2100);
//   };

//   const getTokenMoves = useCallback(
//     (p: Player, die: number, dieIndex: number): Move[] => {
//       const moves: Move[] = [];

//       for (const t of p.tokens) {
//         if (t.finished || t.position === 57) continue;

//         if (t.position === -1) {
//           if (die === 6) {
//             moves.push({
//               tokenId: t.id,
//               steps: 0,
//               die,
//               dieIndex,
//               entersFromBase: true,
//               description: `Bring ${COLORS[p.color].label.toLowerCase()} token out using the 6`,
//             });
//           }
//           continue;
//         }

//         const next = t.position + die;
//         if (next <= 57) {
//           moves.push({
//             tokenId: t.id,
//             steps: die,
//             die,
//             dieIndex,
//             description: next === 57 ? "Move token HOME" : `Move token ${die} spaces`,
//           });
//         }
//       }

//       return moves;
//     },
//     [],
//   );

//   const getTurnMoves = useCallback(
//     (p: Player, roll: [number, number]): Move[] => {
//       const combined = roll[0] + roll[1];
//       const options: Move[] = [];

//       if (usedDice.length) {
//         const remainingIndex = usedDice.includes(0) ? 1 : 0;
//         return getTokenMoves(p, roll[remainingIndex], remainingIndex);
//       }

//       for (const t of p.tokens) {
//         if (
//           t.position >= 0 &&
//           !t.finished &&
//           t.position + combined <= 57
//         ) {
//           options.push({
//             tokenId: t.id,
//             steps: combined,
//             description: `Move ${combined} spaces (both dice)`,
//           });
//         }
//       }

//       options.push(
//         ...getTokenMoves(p, roll[0], 0),
//         ...getTokenMoves(p, roll[1], 1),
//       );

//       return options.filter(
//         (m, i, arr) =>
//           arr.findIndex(
//             (n) =>
//               n.tokenId === m.tokenId &&
//               n.steps === m.steps &&
//               n.entersFromBase === m.entersFromBase &&
//               n.description === m.description,
//           ) === i,
//       );
//     },
//     [getTokenMoves, usedDice],
//   );

//   const rollDice = () => {
//     if (phase !== "rolling" || !current?.human) return;

//     if (balance < 2) {
//       setDrawer("wallet");
//       notify("Fund your wallet to continue; your turn is paused.");
//       return;
//     }

//     setRollAnim(true);
//     const a = 1 + Math.floor(Math.random() * 6);
//     const b = 1 + Math.floor(Math.random() * 6);

//     setTimeout(() => {
//       setDice([a, b]);
//       setRollAnim(false);

//       const pool = eligibleQuestions;
//       if (!pool.length) {
//         setPhase("lobby");
//         setPlayers([]);
//         notify(
//           "There are no sample questions for that subject and academic level yet. Choose another level or subject.",
//         );
//         return;
//       }

//       let unused = pool.filter((q) => !seenQuestions.includes(q.id));
//       if (!unused.length) {
//         setSeenQuestions([]);
//         unused = pool;
//       }

//       const q = unused[Math.floor(Math.random() * unused.length)] ?? QUESTIONS[0];

//       // Only the human's displayed question costs ₦2.
//       setBalance((v) => v - 2);
//       setTxs((v) => [
//         {
//           id: `fee-${Date.now()}`,
//           description: `Educational Ludo question fee (${q.subject})`,
//           amount: -2,
//           at: new Date().toISOString(),
//         },
//         ...v,
//       ]);

//       answerSubmittedRef.current = false;
//       setQuestion(q);
//       setQuestionCount((v) => v + 1);
//       setSeenQuestions((v) => [...v, q.id]);
//       setSelectedAnswer(null);
//       setAnswerStatus(null);
//       setMoveMessage("");
//       setTimeLeft(15);
//       setPhase("question");
//     }, 650);
//   };

//   const nextTurn = useCallback(() => {
//     stopTimer();
//     answerSubmittedRef.current = false;
//     setQuestion(null);
//     setSelectedAnswer(null);
//     setAnswerStatus(null);
//     setLegalMoves([]);
//     setUsedDice([]);
//     setMoveMessage("");
//     setDrawer(null);

//     setTurn((t) => (players.length ? (t + 1) % players.length : 0));
//     setPhase("rolling");
//   }, [players.length, stopTimer]);

//   const finishAnswer = useCallback(
//     (answer: number | null, timedOut: boolean) => {
//       if (!question || phase !== "question" || answerSubmittedRef.current) {
//         return;
//       }

//       answerSubmittedRef.current = true;
//       stopTimer();
//       setSelectedAnswer(answer);

//       const correct = answer === question.correctAnswer && !timedOut;
//       setAnswerStatus(timedOut ? "timeout" : correct ? "correct" : "wrong");
//       setPhase("feedback");

//       if (correct && current) {
//         addPoints(
//           current.id,
//           POINTS_BY_DIFFICULTY[question.difficulty],
//           `${question.difficulty} question answered correctly`,
//         );
//         setMoveMessage(
//           `${current.name} answered correctly and earned ${POINTS_BY_DIFFICULTY[question.difficulty]} CBT Points.`,
//         );
//       }

//       if (!correct) {
//         setMoveMessage(
//           timedOut
//             ? `${current?.name ?? "Player"} ran out of time. The turn passes.`
//             : `${current?.name ?? "Player"} answered incorrectly. The turn passes.`,
//         );
//       }
//     },
//     [question, phase, stopTimer, current, addPoints],
//   );

//   // Human question countdown. Bot questions use the same question phase,
//   // but the bot's answer effect below completes them automatically.
//   useEffect(() => {
//     if (phase !== "question" || !current?.human) {
//       stopTimer();
//       return;
//     }

//     timerRef.current = setInterval(() => {
//       setTimeLeft((t) => {
//         if (t <= 1) {
//           stopTimer();
//           setTimeout(() => finishAnswer(null, true), 0);
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);

//     return stopTimer;
//   }, [phase, current, stopTimer, finishAnswer]);

//   const afterFeedback = useCallback(() => {
//     if (answerStatus !== "correct" || !current || !question) {
//       nextTurn();
//       return;
//     }

//     const moves = getTurnMoves(current, dice);

//     if (!moves.length) {
//       setMoveMessage(
//         `${current.name} answered correctly, but no legal move is available. Turn passes.`,
//       );
//       setTimeout(nextTurn, 1100);
//       return;
//     }

//     setLegalMoves(moves);
//     setPhase("move");

//     // Human players get the move panel. Bots choose a move automatically.
//     if (current.human) setDrawer("move");
//   }, [answerStatus, current, question, nextTurn, getTurnMoves, dice]);

//   const applyMove = useCallback(
//     (move: Move) => {
//       if (!current) return;

//       const actor = current;
//       const targetToken = actor.tokens.find((t) => t.id === move.tokenId);
//       if (!targetToken) return;

//       const newPosition = move.entersFromBase
//         ? 0
//         : targetToken.position + move.steps;

//       const trackIndex =
//         newPosition >= 0 && newPosition <= 51
//           ? (START[actor.color] + newPosition) % 52
//           : -1;

//       const isSafe = trackIndex >= 0 && safeTrack.has(trackIndex);
//       let captureCount = 0;

//       const updatedPlayers = players.map((p) => {
//         if (p.id === actor.id) {
//           return {
//             ...p,
//             tokens: p.tokens.map((t) =>
//               t.id === move.tokenId
//                 ? {
//                     ...t,
//                     position: newPosition,
//                     finished: newPosition === 57,
//                   }
//                 : t,
//             ),
//           };
//         }

//         if (isSafe || trackIndex < 0) return p;

//         let captured = 0;
//         const tokens = p.tokens.map((t) => {
//           if (t.position < 0 || t.position > 51) return t;

//           const enemyIndex = (START[p.color] + t.position) % 52;
//           if (enemyIndex === trackIndex) {
//             captured++;
//             return { ...t, position: -1, finished: false };
//           }
//           return t;
//         });

//         captureCount += captured;
//         return { ...p, tokens };
//       });

//       setPlayers(updatedPlayers);

//       if (captureCount) {
//         addPoints(
//           actor.id,
//           captureCount * 100,
//           `Captured ${captureCount} token${captureCount > 1 ? "s" : ""}`,
//         );
//       }

//       setDrawer(null);
//       setMoveMessage("");

//       const updatedActor = updatedPlayers.find((p) => p.id === actor.id)!;
//       const winner = updatedActor.tokens.every(
//         (t) => t.finished || t.position === 57,
//       );

//       if (winner) {
//         setWinnerId(updatedActor.id);
//         if (updatedActor.human) {
//           addPoints(updatedActor.id, 500, "Educational Ludo winner bonus");
//         }
//         setLegalMoves([]);
//         setPhase("finished");
//         return;
//       }

//       // A separate-die move consumes only that die and offers the other die.
//       if (move.dieIndex !== undefined) {
//         const nowUsed = [...usedDice, move.dieIndex];
//         setUsedDice(nowUsed);

//         const remainingIndex = nowUsed.includes(0) ? 1 : 0;
//         if (nowUsed.length < 2) {
//           const remainingMoves = getTokenMoves(
//             updatedActor,
//             dice[remainingIndex],
//             remainingIndex,
//           );

//           if (remainingMoves.length) {
//             setLegalMoves(remainingMoves);
//             setPhase("move");
//             return;
//           }
//         }
//       }

//       setLegalMoves([]);
//       nextTurn();
//     },
//     [current, players, addPoints, nextTurn, usedDice, dice, getTokenMoves],
//   );

//   // BOT TURN 1: Roll both dice and display a question.
//   // Bots never deduct money from the human player's wallet.
//   useEffect(() => {
//     if (
//       phase !== "rolling" ||
//       !current ||
//       current.human ||
//       mode !== "solo"
//     ) {
//       return;
//     }

//     let cancelled = false;
//     const timers: ReturnType<typeof setTimeout>[] = [];

//     const schedule = (callback: () => void, delay: number) => {
//       const timer = setTimeout(() => {
//         if (!cancelled) callback();
//       }, delay);
//       timers.push(timer);
//     };

//     schedule(() => {
//       const a = 1 + Math.floor(Math.random() * 6);
//       const b = 1 + Math.floor(Math.random() * 6);

//       setDice([a, b]);
//       setRollAnim(true);

//       schedule(() => {
//         setRollAnim(false);

//         const pool = eligibleQuestions;
//         if (!pool.length) {
//           notify("No questions are available for this subject and level.");
//           nextTurn();
//           return;
//         }

//         const unused = pool.filter((q) => !seenQuestions.includes(q.id));
//         const available = unused.length ? unused : pool;
//         const q = available[Math.floor(Math.random() * available.length)];

//         answerSubmittedRef.current = false;
//         setQuestion(q);
//         setQuestionCount((n) => n + 1);
//         setSeenQuestions((previous) =>
//           unused.length ? [...previous, q.id] : [q.id],
//         );
//         setSelectedAnswer(null);
//         setAnswerStatus(null);
//         setMoveMessage("");
//         setTimeLeft(15);
//         setPhase("question");
//       }, 650);
//     }, 1000 + Math.random() * 700);

//     return () => {
//       cancelled = true;
//       timers.forEach(clearTimeout);
//     };
//   }, [
//     phase,
//     current,
//     mode,
//     eligibleQuestions,
//     seenQuestions,
//     notify,
//     nextTurn,
//   ]);

//   // BOT TURN 2: Choose an answer based on the bot's difficulty.
//   useEffect(() => {
//     if (
//       phase !== "question" ||
//       !current ||
//       current.human ||
//       mode !== "solo" ||
//       !question
//     ) {
//       return;
//     }

//     let answerTimer: ReturnType<typeof setTimeout> | undefined;
//     let finishTimer: ReturnType<typeof setTimeout> | undefined;
//     let cancelled = false;

//     const difficulty = current.difficulty ?? "Medium";
//     const correctChance =
//       difficulty === "Easy" ? 0.58 : difficulty === "Hard" ? 0.91 : 0.76;
//     const delay =
//       difficulty === "Easy" ? 1800 : difficulty === "Hard" ? 2600 : 2200;

//     answerTimer = setTimeout(() => {
//       if (cancelled) return;

//       let answer: number;

//       if (Math.random() < correctChance) {
//         answer = question.correctAnswer;
//       } else {
//         const wrongAnswers = question.options
//           .map((_, index) => index)
//           .filter((index) => index !== question.correctAnswer);

//         answer =
//           wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
//       }

//       // Show the selected option briefly before the feedback screen.
//       setSelectedAnswer(answer);

//       finishTimer = setTimeout(() => {
//         if (!cancelled) finishAnswer(answer, false);
//       }, 500);
//     }, delay);

//     return () => {
//       cancelled = true;
//       if (answerTimer) clearTimeout(answerTimer);
//       if (finishTimer) clearTimeout(finishTimer);
//     };
//   }, [phase, current, mode, question, finishAnswer]);

//   // BOT TURN 3: Show feedback briefly, then move or pass the turn.
//   useEffect(() => {
//     if (
//       phase !== "feedback" ||
//       !current ||
//       current.human ||
//       mode !== "solo"
//     ) {
//       return;
//     }

//     const timer = setTimeout(() => {
//       afterFeedback();
//     }, 1600);

//     return () => clearTimeout(timer);
//   }, [
//     phase,
//     current,
//     mode,
//     answerStatus,
//     question,
//     dice,
//     usedDice,
//     legalMoves,
//     afterFeedback,
//   ]);

//   // Bot movement: choose the most useful available move automatically.
//   useEffect(() => {
//     if (
//       phase !== "move" ||
//       !current ||
//       current.human ||
//       mode !== "solo" ||
//       !legalMoves.length
//     ) {
//       return;
//     }

//     const timer = setTimeout(
//       () => {
//         const scored = legalMoves
//           .map((m) => {
//             const token = current.tokens.find((t) => t.id === m.tokenId);
//             if (!token) return { m, score: -Infinity };

//             const pos = m.entersFromBase ? 0 : token.position + m.steps;
//             const capture =
//               pos >= 0 &&
//               pos <= 51 &&
//               players.some(
//                 (p) =>
//                   p.id !== current.id &&
//                   p.tokens.some(
//                     (t) =>
//                       t.position >= 0 &&
//                       t.position <= 51 &&
//                       (START[p.color] + t.position) % 52 ===
//                         (START[current.color] + pos) % 52,
//                   ),
//               );

//             const safe =
//               pos >= 0 &&
//               pos <= 51 &&
//               safeTrack.has((START[current.color] + pos) % 52);

//             const progress = pos === 57 ? 100 : pos;
//             const captureBonus = capture ? 30 : 0;
//             const safeBonus = safe ? 8 : 0;
//             const randomness =
//               Math.random() * (current.difficulty === "Easy" ? 20 : 5);

//             return {
//               m,
//               score: progress + captureBonus + safeBonus + randomness,
//             };
//           })
//           .sort((a, b) => b.score - a.score);

//         if (scored[0]) applyMove(scored[0].m);
//         else nextTurn();
//       },
//       current.difficulty === "Hard" ? 1400 : 900,
//     );

//     return () => clearTimeout(timer);
//   }, [phase, current, mode, legalMoves, players, applyMove, nextTurn]);

//   const activeMoves = useMemo(() => legalMoves, [legalMoves]);

//   const renderToken = (p: Player, t: Token, compact = false) => {
//     let coord: [number, number] | null = null;

//     if (t.position === -1) {
//       const b = BASES[p.color];
//       const idx = Number(t.id.split("-").pop()) || 0;
//       const offsets = [[1, 1], [1, 3], [3, 1], [3, 3]];
//       coord = [b.r + offsets[idx][0], b.c + offsets[idx][1]];
//     } else if (t.position <= 51) {
//       coord = TRACK[(START[p.color] + t.position) % 52];
//     } else if (t.position <= 56) {
//       coord = HOME_LANE[p.color][t.position - 52];
//     }

//     if (t.position === 57 || t.finished || !coord) return null;

//     const isLegal = activeMoves.some((m) => m.tokenId === t.id);

//     return (
//       <button
//         key={t.id}
//         type="button"
//         aria-label={`${p.name} ${COLORS[p.color].label} token`}
//         disabled={
//           !(phase === "move" && current?.human && p.human && isLegal)
//         }
//         onClick={() => {
//           const choices = activeMoves.filter((m) => m.tokenId === t.id);
//           if (choices.length === 1) {
//             applyMove(choices[0]);
//           } else {
//             setDrawer("move");
//             setMoveMessage("Choose how to use the dice for this token.");
//           }
//         }}
//         className={`absolute z-20 rounded-full border-2 border-white shadow-md transition-transform ${
//           compact
//             ? "h-3 w-3"
//             : "h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)]"
//         } ${
//           isLegal && phase === "move"
//             ? "ring-4 ring-amber-300 animate-pulse scale-125 cursor-pointer"
//             : ""
//         }`}
//         style={{
//           left: "50%",
//           top: "50%",
//           transform: "translate(-50%, -50%)",
//           backgroundColor: COLORS[p.color].main,
//         }}
//       />
//     );
//   };

//   const tokenAt = (r: number, c: number) =>
//     players
//       .flatMap((p) => p.tokens.map((t) => ({ p, t })))
//       .filter(({ p, t }) => {
//         if (t.position === -1) {
//           const b = BASES[p.color];
//           const idx = Number(t.id.split("-").pop()) || 0;
//           const offsets = [[1, 1], [1, 3], [3, 1], [3, 3]][idx];
//           return b.r + offsets[0] === r && b.c + offsets[1] === c;
//         }

//         if (t.position >= 0 && t.position <= 51) {
//           const x = TRACK[(START[p.color] + t.position) % 52];
//           return x[0] === r && x[1] === c;
//         }

//         if (t.position >= 52 && t.position <= 56) {
//           const x = HOME_LANE[p.color][t.position - 52];
//           return x[0] === r && x[1] === c;
//         }

//         return false;
//       });

//   const boardCell = (r: number, c: number) => {
//     const trackIdx = TRACK.findIndex(([rr, cc]) => rr === r && cc === c);
//     const laneColor = (
//       Object.keys(HOME_LANE) as EduLudoColor[]
//     ).find((color) =>
//       HOME_LANE[color].some(([rr, cc]) => rr === r && cc === c),
//     );
//     const base = (Object.keys(BASES) as EduLudoColor[]).find((color) => {
//       const b = BASES[color];
//       return r >= b.r && r < b.r + 6 && c >= b.c && c < b.c + 6;
//     });
//     const startColor =
//       trackIdx >= 0
//         ? (Object.keys(START) as EduLudoColor[]).find(
//             (color) => START[color] === trackIdx,
//           )
//         : undefined;
//     const safe = trackIdx >= 0 && safeTrack.has(trackIdx);

//     let bg = "bg-white";
//     if (base) bg = "";
//     else if (laneColor) bg = "";
//     else if (trackIdx >= 0 && startColor) bg = "";
//     else if (safe) bg = "bg-amber-50";
//     else if (trackIdx >= 0) bg = "bg-slate-50";

//     const style: CSSProperties = {};
//     if (base) style.backgroundColor = COLORS[base].light;
//     if (laneColor) style.backgroundColor = COLORS[laneColor].light;
//     if (trackIdx >= 0 && startColor) {
//       style.backgroundColor = COLORS[startColor].main;
//     }

//     const occupants = tokenAt(r, c);

//     return (
//       <div
//         key={`${r}-${c}`}
//         className={`relative min-w-0 border-[0.5px] border-slate-200 ${bg}`}
//         style={style}
//       >
//         {safe && (
//           <span
//             className={`absolute inset-0 grid place-items-center text-amber-500 ${
//               trackIdx >= 0 && startColor ? "text-white" : ""
//             }`}
//             style={{ fontSize: "clamp(7px, 1.1vw, 14px)" }}
//           >
//             ★
//           </span>
//         )}
//         {occupants.map(({ p, t }) => renderToken(p, t, true))}
//       </div>
//     );
//   };

//   const drawBoard = () => (
//     <div className="mx-auto w-full max-w-[690px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:p-3">
//       <div className="relative grid aspect-square grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] overflow-hidden rounded-lg border border-slate-300">
//         {Array.from({ length: 225 }, (_, i) =>
//           boardCell(Math.floor(i / 15), i % 15),
//         )}
//         <div className="pointer-events-none absolute left-[40%] top-[40%] z-10 grid h-[20%] w-[20%] place-items-center overflow-hidden rounded-lg border-2 border-white bg-white shadow-md">
//           <div className="grid h-full w-full grid-cols-2 grid-rows-2">
//             <div style={{ background: COLORS.red.main }} />
//             <div style={{ background: COLORS.green.main }} />
//             <div style={{ background: COLORS.blue.main }} />
//             <div style={{ background: COLORS.yellow.main }} />
//           </div>
//           <span className="absolute rounded-full bg-slate-900 px-2 py-1 text-[8px] font-black tracking-widest text-white sm:text-[10px]">
//             HOME
//           </span>
//         </div>
//         <div className="pointer-events-none absolute left-[2%] top-[2%] rounded bg-slate-900/75 px-1.5 py-0.5 text-[8px] font-bold text-white sm:text-[10px]">
//           START
//         </div>
//         <div className="pointer-events-none absolute right-[2%] top-[2%] rounded bg-slate-900/75 px-1.5 py-0.5 text-[8px] font-bold text-white sm:text-[10px]">
//           START
//         </div>
//       </div>
//       <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-slate-500 sm:text-xs">
//         <span>★ Safe square</span>
//         <span>● Token</span>
//         <span>Colored start squares</span>
//       </div>
//     </div>
//   );

//   const currentLegal = activeMoves;
//   const doSelectedMove = (move: Move) => applyMove(move);

//   const allRanked = [...players].sort(
//     (a, b) =>
//       b.tokens.filter((t) => t.finished || t.position === 57).length -
//         a.tokens.filter((t) => t.finished || t.position === 57).length ||
//       Math.max(...b.tokens.map((t) => t.position)) -
//         Math.max(...a.tokens.map((t) => t.position)),
//   );

//   const exitGame = () => {
//     setConfirmExit(false);
//     setDrawer(null);
//     setPhase("lobby");
//     setPlayers([]);
//     setQuestion(null);
//     setLegalMoves([]);
//     setWinnerId(null);
//     onBack?.();
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
//         <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-3 py-3 sm:px-6">
//           <div className="flex min-w-0 items-center gap-3">
//             <button
//               type="button"
//               onClick={() =>
//                 phase === "lobby" ? onBack?.() : setConfirmExit(true)
//               }
//               className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
//               aria-label="Back"
//             >
//               <ArrowLeft size={18} />
//             </button>
//             <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
//               <Dice5 size={22} />
//             </div>
//             <div className="min-w-0">
//               <h1 className="truncate text-base font-extrabold sm:text-lg">
//                 Educational Ludo
//               </h1>
//               <p className="hidden text-xs text-slate-500 sm:block">
//                 Roll. Learn. Race HOME.
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="hidden rounded-xl bg-amber-50 px-3 py-2 text-right sm:block">
//               <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
//                 CBT Points
//               </div>
//               <div className="font-extrabold text-amber-900">
//                 {cbtPoints.toLocaleString()}
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={() => setDrawer("wallet")}
//               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold hover:bg-slate-50"
//             >
//               <Wallet size={16} />
//               <span>{money(balance)}</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => setDrawer("rules")}
//               className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
//               aria-label="Rules"
//             >
//               <CircleHelp size={18} />
//             </button>
//           </div>
//         </div>
//       </header>

//       {phase === "lobby" && (
//         <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.2fr_.8fr] lg:py-12">
//           <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 p-6 text-white shadow-xl sm:p-10">
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
//               <Sparkles size={14} /> LEARN AS YOU PLAY
//             </div>
//             <h2 className="max-w-xl text-3xl font-black leading-tight sm:text-5xl">
//               Every correct answer moves you closer to HOME.
//             </h2>
//             <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">
//               Roll two dice, solve a timed question, and use your dice to move
//               your tokens. Outsmart the bots and bring all four tokens HOME.
//             </p>
//             <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
//               {[
//                 { n: "2 dice", d: "Choose combined or split moves" },
//                 { n: "15 sec", d: "Per question" },
//                 { n: "₦2", d: "Per human question" },
//               ].map((x) => (
//                 <div
//                   key={x.n}
//                   className="rounded-2xl border border-white/15 bg-white/10 p-3"
//                 >
//                   <div className="text-lg font-black sm:text-2xl">{x.n}</div>
//                   <div className="mt-1 text-[11px] leading-4 text-indigo-100 sm:text-xs">
//                     {x.d}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-8 flex items-center gap-2 text-xs text-indigo-100">
//               <ShieldCheck size={16} />
//               Local Solo demo. Wallet charging and online multiplayer need
//               backend integration.
//             </div>
//           </section>

//           <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
//             <h2 className="text-xl font-extrabold">Set up your match</h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Choose your learning level and player settings.
//             </p>

//             <div className="mt-5">
//               <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                 Game mode
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 {(
//                   [
//                     { id: "solo", name: "Solo vs Bots", desc: "Playable now" },
//                     { id: "friends", name: "Play with Friends", desc: "Coming soon" },
//                     { id: "classroom", name: "Classroom", desc: "Coming soon" },
//                     { id: "tournament", name: "Tournament", desc: "Coming soon" },
//                   ] as { id: EduLudoMode; name: string; desc: string }[]
//                 ).map((x) => (
//                   <button
//                     key={x.id}
//                     type="button"
//                     onClick={() => setMode(x.id)}
//                     className={`rounded-xl border p-3 text-left transition ${
//                       mode === x.id
//                         ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
//                         : "border-slate-200 hover:border-slate-300"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between gap-2 text-sm font-bold">
//                       {x.name}
//                       {x.id !== "solo" && (
//                         <LockKeyhole size={14} className="text-slate-400" />
//                       )}
//                     </div>
//                     <div className="mt-1 text-xs text-slate-500">{x.desc}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-5 grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                   Subject
//                 </label>
//                 <select
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value as Subject)}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option>All Subjects</option>
//                   <option>Mathematics</option>
//                   <option>English</option>
//                   <option>Science</option>
//                   <option>Biology</option>
//                   <option>Chemistry</option>
//                   <option>Physics</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                   Academic level
//                 </label>
//                 <select
//                   value={level}
//                   onChange={(e) => setLevel(e.target.value as Level)}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 >
//                   {["JSS", "SSS", "JAMB", "WAEC", "Custom"].map((v) => (
//                     <option key={v}>{v}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="mt-5">
//               <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                 Your token colour
//               </label>
//               <div className="grid grid-cols-4 gap-2">
//                 {(Object.keys(COLORS) as EduLudoColor[]).map((c) => (
//                   <button
//                     key={c}
//                     type="button"
//                     onClick={() => setPlayerColor(c)}
//                     className={`flex flex-col items-center gap-2 rounded-xl border p-3 ${
//                       playerColor === c
//                         ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
//                         : "border-slate-200"
//                     }`}
//                   >
//                     <span
//                       className="h-6 w-6 rounded-full border-2 border-white shadow"
//                       style={{ backgroundColor: COLORS[c].main }}
//                     />
//                     <span className="text-xs font-semibold">{COLORS[c].label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-5">
//               <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                 Bot strategy
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
//                   <button
//                     key={d}
//                     type="button"
//                     onClick={() => setBotDifficulty(d)}
//                     className={`rounded-xl border px-2 py-2.5 text-sm font-bold ${
//                       botDifficulty === d
//                         ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                         : "border-slate-200 text-slate-600"
//                     }`}
//                   >
//                     {d}
//                   </button>
//                 ))}
//               </div>
//               <p className="mt-2 text-xs text-slate-500">
//                 This changes bot strategy only. Your questions still mix Easy,
//                 Medium and Hard.
//               </p>
//             </div>

//             <div className="mt-6 rounded-2xl bg-slate-50 p-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-slate-600">Current wallet balance</span>
//                 <b>{money(balance)}</b>
//               </div>
//               <div className="mt-2 flex items-center justify-between text-sm">
//                 <span className="text-slate-600">Human question fee</span>
//                 <b>₦2 each</b>
//               </div>
//               <div className="mt-2 flex items-center justify-between text-sm">
//                 <span className="text-slate-600">Correct answer reward</span>
//                 <b className="text-amber-700">20–40 CBT Points</b>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={startPreview}
//               className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
//             >
//               Review match <ChevronRight size={18} />
//             </button>
//             <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
//               Demo wallet balance is local only and is not a real account balance.
//             </p>
//           </section>
//         </main>
//       )}

//       {phase === "preview" && (
//         <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
//             <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
//               <Flag size={26} />
//             </div>
//             <h2 className="text-2xl font-black">Match preview</h2>
//             <p className="mt-2 text-sm text-slate-500">
//               Check the match details before the countdown begins.
//             </p>
//             <div className="mt-6 grid grid-cols-2 gap-3">
//               {[
//                 { label: "Your colour", value: COLORS[playerColor].label },
//                 { label: "Bot strategy", value: botDifficulty },
//                 { label: "Subject", value: subject },
//                 { label: "Academic level", value: level },
//                 { label: "Question fee", value: "₦2 per human question" },
//                 { label: "Wallet balance", value: money(balance) },
//               ].map((x) => (
//                 <div key={x.label} className="rounded-xl bg-slate-50 p-4">
//                   <div className="text-xs text-slate-500">{x.label}</div>
//                   <div className="mt-1 font-extrabold">{x.value}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
//               <b>Objective:</b> be the first player to bring all four tokens HOME.
//               Correct answers earn 20/30/40 CBT Points by question difficulty;
//               captures earn +100, and winning earns +500.
//             </div>
//             {balance < 2 && (
//               <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
//                 Your wallet needs at least ₦2 to display your first question.
//                 Fund it before starting.
//               </div>
//             )}
//             <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
//               <button
//                 type="button"
//                 onClick={() => setPhase("lobby")}
//                 className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold hover:bg-slate-50"
//               >
//                 Back to setup
//               </button>
//               <button
//                 type="button"
//                 onClick={beginCountdown}
//                 className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700"
//               >
//                 Start match <ChevronRight className="ml-1 inline" size={17} />
//               </button>
//             </div>
//           </div>
//         </main>
//       )}

//       {!["lobby", "preview"].includes(phase) && (
//         <main className="mx-auto max-w-[1500px] px-3 py-4 sm:px-6 sm:py-6">
//           <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
//                 <span className="h-2 w-2 rounded-full bg-indigo-500" />
//                 Solo match · {subject} · {level}
//               </div>
//               <h2 className="mt-1 text-xl font-black sm:text-2xl">Race to HOME</h2>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => setDrawer("rewards")}
//                 className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold"
//               >
//                 <Award size={16} /> Rewards
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setDrawer("wallet")}
//                 className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold"
//               >
//                 <Wallet size={16} /> Wallet
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setDrawer("rules")}
//                 className="rounded-xl border border-slate-200 bg-white p-2"
//                 aria-label="Rules"
//               >
//                 <BookOpen size={17} />
//               </button>
//             </div>
//           </div>

//           {phase === "countdown" && (
//             <div className="mb-4 rounded-2xl bg-indigo-600 p-5 text-center text-white">
//               <div className="text-xs font-bold uppercase tracking-widest text-indigo-100">
//                 Get ready
//               </div>
//               <div className="mt-1 text-4xl font-black">{toast || "3"}</div>
//             </div>
//           )}

//           <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
//             <section className="min-w-0">
//               <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className="grid h-11 w-11 place-items-center rounded-xl text-white"
//                     style={{
//                       backgroundColor: current
//                         ? COLORS[current.color].main
//                         : "#64748b",
//                     }}
//                   >
//                     {current?.human ? (
//                       <Crown size={22} />
//                     ) : (
//                       <Loader2 className="animate-spin" size={22} />
//                     )}
//                   </div>
//                   <div>
//                     <div className="text-xs text-slate-500">Current turn</div>
//                     <div className="font-extrabold">
//                       {current?.name ?? "Preparing…"}
//                       {current?.human ? " (You)" : ""}
//                     </div>
//                     <div className="text-xs text-slate-500">
//                       {current?.human
//                         ? "Roll the dice to receive a question"
//                         : phase === "question"
//                           ? `${current?.name} is answering the question…`
//                           : phase === "feedback"
//                             ? `${current?.name} is reviewing the answer…`
//                             : `${current?.name} is playing…`}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`grid h-12 w-12 place-items-center rounded-xl border-2 bg-white text-xl font-black shadow-sm ${
//                       rollAnim ? "animate-bounce" : ""
//                     }`}
//                   >
//                     {dice[0]}
//                   </div>
//                   <div
//                     className={`grid h-12 w-12 place-items-center rounded-xl border-2 bg-white text-xl font-black shadow-sm ${
//                       rollAnim ? "animate-bounce" : ""
//                     }`}
//                   >
//                     {dice[1]}
//                   </div>
//                   <div className="ml-1 text-center">
//                     <div className="text-[10px] font-bold uppercase text-slate-400">
//                       Total
//                     </div>
//                     <div className="text-xl font-black">
//                       {dice[0] + dice[1]}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {drawBoard()}

//               <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
//                 {phase === "rolling" && current?.human && (
//                   <button
//                     type="button"
//                     onClick={rollDice}
//                     disabled={rollAnim}
//                     className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
//                   >
//                     <Dice5 size={18} />
//                     {rollAnim ? "Rolling…" : "Roll Dice"}
//                   </button>
//                 )}
//                 {phase === "question" && current?.human && (
//                   <div className="text-sm font-semibold text-indigo-700">
//                     Answer the question to unlock your moves.
//                   </div>
//                 )}
//                 {phase === "move" && current?.human && (
//                   <div className="text-sm font-semibold text-emerald-700">
//                     Choose a highlighted token or select a move below.
//                   </div>
//                 )}
//                 {current && !current.human && (
//                   <div className="flex items-center gap-2 text-sm text-slate-500">
//                     <Loader2 className="animate-spin" size={16} />
//                     {current.name} is playing automatically…
//                   </div>
//                 )}
//                 {phase === "finished" && (
//                   <div className="font-bold text-emerald-700">Match complete!</div>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => setConfirmExit(true)}
//                   className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
//                 >
//                   Exit match
//                 </button>
//               </div>

//               {phase === "move" && current?.human && (
//                 <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <h3 className="font-extrabold text-emerald-900">
//                         Your legal moves
//                       </h3>
//                       <p className="mt-1 text-xs text-emerald-800">
//                         Choose one combined move or use a single die. Each die
//                         can only be used once.
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setDrawer("move")}
//                       className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold"
//                     >
//                       Move panel
//                     </button>
//                   </div>
//                   <div className="mt-3 grid gap-2 sm:grid-cols-2">
//                     {currentLegal.map((m, i) => (
//                       <button
//                         key={`${m.tokenId}-${m.steps}-${m.description}-${i}`}
//                         type="button"
//                         onClick={() => doSelectedMove(m)}
//                         className="rounded-xl border border-emerald-200 bg-white p-3 text-left text-sm font-semibold text-emerald-900 hover:border-emerald-400"
//                       >
//                         {m.description}
//                         <span className="mt-1 block text-xs font-normal text-slate-500">
//                           Token {Number(m.tokenId.split("-").pop()) + 1}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </section>

//             <aside className="space-y-4">
//               <div className="rounded-2xl border border-slate-200 bg-white p-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-extrabold">Players</h3>
//                   <span className="text-xs text-slate-400">4 players</span>
//                 </div>
//                 <div className="mt-3 space-y-3">
//                   {players.map((p) => (
//                     <div
//                       key={p.id}
//                       className={`flex items-center gap-3 rounded-xl p-2 ${
//                         current?.id === p.id
//                           ? "bg-indigo-50 ring-1 ring-indigo-100"
//                           : ""
//                       }`}
//                     >
//                       <div
//                         className="h-9 w-9 shrink-0 rounded-full border-2 border-white shadow"
//                         style={{ backgroundColor: COLORS[p.color].main }}
//                       />
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center gap-1 text-sm font-bold">
//                           {p.name}
//                           {p.human && (
//                             <span className="text-xs text-slate-400">(You)</span>
//                           )}
//                           {current?.id === p.id && (
//                             <span className="ml-auto rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
//                               TURN
//                             </span>
//                           )}
//                         </div>
//                         <div className="text-xs text-slate-500">
//                           {p.tokens.filter((t) => t.finished || t.position === 57).length}/4
//                           HOME · {p.points} pts
//                         </div>
//                         <div className="mt-1 flex gap-1">
//                           {p.tokens.map((t) => (
//                             <span
//                               key={t.id}
//                               className={`h-2 flex-1 rounded-full ${
//                                 t.finished || t.position === 57
//                                   ? "bg-emerald-500"
//                                   : t.position >= 0
//                                     ? "bg-slate-300"
//                                     : "bg-slate-100"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-4">
//                 <h3 className="font-extrabold">Match status</h3>
//                 <div className="mt-3 space-y-3 text-sm">
//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-500">Questions shown</span>
//                     <b>{questionCount}</b>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-500">Human question fee</span>
//                     <b>₦2 each</b>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-500">CBT Points</span>
//                     <b className="text-amber-700">{cbtPoints.toLocaleString()}</b>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-500">Tokens HOME</span>
//                     <b>
//                       {human?.tokens.filter((t) => t.finished || t.position === 57).length ?? 0}/4
//                     </b>
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setDrawer("wallet")}
//                   className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold"
//                 >
//                   <span>Wallet balance</span>
//                   <span>
//                     {money(balance)} <ChevronRight className="ml-1 inline" size={15} />
//                   </span>
//                 </button>
//               </div>

//               <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
//                 <div className="flex items-center gap-2 font-extrabold text-amber-900">
//                   <Zap size={17} /> Quick reminder
//                 </div>
//                 <p className="mt-2 text-xs leading-5 text-amber-900">
//                   Answer correctly to move. A six brings a token out of base.
//                   Safe stars protect tokens from capture. You need an exact roll
//                   to reach HOME.
//                 </p>
//               </div>
//             </aside>
//           </div>
//         </main>
//       )}

//       {/* Question dialog: human answers manually; bot answers automatically. */}
//       {phase === "question" && question && (
//         <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6">
//           <section
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="question-title"
//             className="my-auto w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
//           >
//             <div className="flex items-center justify-between gap-3">
//               <div>
//                 <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
//                   {current?.name} · {question.subject} · {question.difficulty}
//                 </div>
//                 <h2 id="question-title" className="mt-1 text-xl font-black">
//                   Question {questionCount}
//                 </h2>
//               </div>
//               <div
//                 className={`grid h-14 w-14 place-items-center rounded-full border-4 text-xl font-black ${
//                   timeLeft <= 5
//                     ? "border-red-300 bg-red-50 text-red-600"
//                     : "border-indigo-100 bg-indigo-50 text-indigo-700"
//                 }`}
//               >
//                 {current?.human ? timeLeft : "🤖"}
//               </div>
//             </div>

//             {current?.human && (
//               <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
//                 <div
//                   className={`h-full rounded-full transition-all ${
//                     timeLeft <= 5 ? "bg-red-500" : "bg-indigo-500"
//                   }`}
//                   style={{ width: `${(timeLeft / 15) * 100}%` }}
//                 />
//               </div>
//             )}

//             <p className="mt-6 text-lg font-bold leading-relaxed">
//               {question.question}
//             </p>

//             {!current?.human && (
//               <p className="mt-2 text-xs text-slate-500">
//                 {current?.name} is thinking and will answer automatically.
//               </p>
//             )}

//             <div className="mt-5 grid gap-3">
//               {question.options.map((opt, i) => {
//                 const isBot = current != null && !current.human;
//                 const isSelected = selectedAnswer === i;

//                 return (
//                   <button
//                     key={`${question.id}-${i}`}
//                     type="button"
//                     disabled={!current?.human || phase !== "question"}
//                     onClick={() => finishAnswer(i, false)}
//                     className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
//                       isSelected
//                         ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
//                         : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
//                     } ${!current?.human ? "cursor-default" : ""}`}
//                   >
//                     <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-extrabold">
//                       {String.fromCharCode(65 + i)}
//                     </span>
//                     <span className="text-sm font-medium">{opt}</span>
//                     {isSelected && isBot && (
//                       <span className="ml-auto text-xs font-bold text-indigo-700">
//                         Selected
//                       </span>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>

//             <p className="mt-4 text-center text-xs text-slate-400">
//               {current?.human
//                 ? "One question per turn · ₦2 fee · Incorrect answers pass the turn"
//                 : "Bot question · No charge to your wallet"}
//             </p>
//           </section>
//         </div>
//       )}

//       {phase === "feedback" && question && (
//         <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/65 p-4">
//           <section
//             role="dialog"
//             aria-modal="true"
//             className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl"
//           >
//             <div
//               className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${
//                 answerStatus === "correct"
//                   ? "bg-emerald-100 text-emerald-700"
//                   : "bg-rose-100 text-rose-700"
//               }`}
//             >
//               {answerStatus === "correct" ? (
//                 <CheckCircle2 size={32} />
//               ) : (
//                 <X size={32} />
//               )}
//             </div>

//             <h2 className="mt-4 text-2xl font-black">
//               {answerStatus === "correct"
//                 ? "Correct answer!"
//                 : answerStatus === "timeout"
//                   ? "Time is up!"
//                   : "Not quite"}
//             </h2>

//             <p className="mt-2 text-sm text-slate-500">
//               {answerStatus === "correct"
//                 ? `${current?.name ?? "Player"} earned ${
//                     POINTS_BY_DIFFICULTY[question.difficulty]
//                   } CBT Points.`
//                 : moveMessage}
//             </p>

//             {answerStatus !== "correct" && (
//               <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-left text-sm">
//                 <div className="font-bold text-emerald-900">
//                   Correct answer: {question.options[question.correctAnswer]}
//                 </div>
//                 <p className="mt-1 text-emerald-800">{question.explanation}</p>
//               </div>
//             )}

//             {answerStatus === "correct" && (
//               <p className="mt-3 text-sm text-slate-600">
//                 {question.explanation}
//               </p>
//             )}

//             <button
//               type="button"
//               onClick={afterFeedback}
//               disabled={!current?.human}
//               className={`mt-6 w-full rounded-xl px-4 py-3 font-bold text-white ${
//                 current?.human
//                   ? "bg-indigo-600 hover:bg-indigo-700"
//                   : "cursor-default bg-slate-400"
//               }`}
//             >
//               {current?.human
//                 ? answerStatus === "correct"
//                   ? "Choose your move"
//                   : "Continue"
//                 : "Bot is continuing automatically…"}
//             </button>
//           </section>
//         </div>
//       )}

//       {phase === "finished" && (
//         <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/70 p-4">
//           <section className="my-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
//             <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700">
//               <Trophy size={34} />
//             </div>
//             <h2 className="mt-4 text-center text-3xl font-black">
//               {players.find((p) => p.id === winnerId)?.name ?? "Match"} wins!
//             </h2>
//             <p className="mt-2 text-center text-sm text-slate-500">
//               Match results and final rankings
//             </p>

//             <div className="mt-6 space-y-2">
//               {allRanked.map((p, i) => (
//                 <div
//                   key={p.id}
//                   className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
//                 >
//                   <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 font-black">
//                     {i + 1}
//                   </div>
//                   <div
//                     className="h-7 w-7 rounded-full"
//                     style={{ backgroundColor: COLORS[p.color].main }}
//                   />
//                   <div className="flex-1 font-bold">
//                     {p.name}{p.human ? " (You)" : ""}
//                     <div className="text-xs font-normal text-slate-500">
//                       {p.tokens.filter((t) => t.finished || t.position === 57).length}/4
//                       tokens HOME
//                     </div>
//                   </div>
//                   <div className="text-right font-extrabold">
//                     {p.points}
//                     <div className="text-[10px] font-medium text-slate-400">
//                       CBT Points
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-5 grid grid-cols-2 gap-3">
//               <div className="rounded-xl bg-amber-50 p-4">
//                 <div className="text-xs text-amber-700">
//                   Points earned this match
//                 </div>
//                 <div className="mt-1 text-2xl font-black text-amber-900">
//                   +{matchReward}
//                 </div>
//               </div>
//               <div className="rounded-xl bg-slate-50 p-4">
//                 <div className="text-xs text-slate-500">Questions shown</div>
//                 <div className="mt-1 text-2xl font-black">{questionCount}</div>
//               </div>
//             </div>

//             <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setPhase("lobby");
//                   setPlayers([]);
//                   setWinnerId(null);
//                 }}
//                 className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold"
//               >
//                 Exit to setup
//               </button>
//               <button
//                 type="button"
//                 onClick={startPreview}
//                 className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white"
//               >
//                 Play again <RotateCcw className="ml-1 inline" size={16} />
//               </button>
//             </div>
//           </section>
//         </div>
//       )}

//       {drawer && (
//         <div
//           className="fixed inset-0 z-[60] flex justify-end bg-slate-950/40"
//           onClick={() => setDrawer(null)}
//         >
//           <aside
//             onClick={(e) => e.stopPropagation()}
//             className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-6"
//           >
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-black">
//                 {drawer === "rules"
//                   ? "How to play"
//                   : drawer === "wallet"
//                     ? "Wallet"
//                     : drawer === "rewards"
//                       ? "Rewards"
//                       : "Choose a move"}
//               </h2>
//               <button
//                 type="button"
//                 onClick={() => setDrawer(null)}
//                 className="rounded-xl border border-slate-200 p-2"
//                 aria-label="Close drawer"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {drawer === "rules" && (
//               <div className="mt-5 space-y-4">
//                 {[
//                   {
//                     t: "1. Roll two dice",
//                     d: "Use the combined total for one token, or use each die for a separate move. Each die is used once; there is no bonus roll for a six.",
//                   },
//                   {
//                     t: "2. Answer a question",
//                     d: "Each human turn shows one 15-second question and costs ₦2. Bot questions are free to your wallet. Correct answers unlock legal moves and award 20/30/40 CBT Points by difficulty.",
//                   },
//                   {
//                     t: "3. Leave base",
//                     d: "A token can leave base only when one of your dice shows 6. If you use that six to enter a token, do not reuse it.",
//                   },
//                   {
//                     t: "4. Capture and safe squares",
//                     d: "Landing on an opponent on a non-safe square sends their token back to base and earns +100 CBT Points. Star squares protect tokens.",
//                   },
//                   {
//                     t: "5. Reach HOME",
//                     d: "Move along your coloured home lane. You must roll the exact number to reach HOME; an overshoot is not legal.",
//                   },
//                   {
//                     t: "6. Win",
//                     d: "The first player to get all four tokens HOME wins and receives +500 CBT Points. CBT Points are separate from your Naira wallet.",
//                   },
//                 ].map((x) => (
//                   <div key={x.t} className="border-b border-slate-100 pb-4">
//                     <h3 className="font-extrabold">{x.t}</h3>
//                     <p className="mt-1 text-sm leading-6 text-slate-600">{x.d}</p>
//                   </div>
//                 ))}
//                 <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
//                   This first release uses local demo state. Backend integration
//                   is required for secure wallet charges, persistence and online
//                   multiplayer.
//                 </p>
//               </div>
//             )}

//             {drawer === "wallet" && (
//               <div className="mt-5">
//                 <div className="rounded-2xl bg-gradient-to-br from-indigo-700 to-blue-500 p-5 text-white">
//                   <div className="text-sm text-indigo-100">Demo wallet balance</div>
//                   <div className="mt-1 text-3xl font-black">{money(balance)}</div>
//                   <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-sm">
//                     <span>Human question fee</span>
//                     <b>₦2</b>
//                   </div>
//                 </div>
//                 <p className="mt-3 text-xs leading-5 text-slate-500">
//                   Bot questions do not deduct from this displayed balance. This
//                   is local demo state, not your actual account wallet.
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setDrawer(null);
//                     onFundWallet?.();
//                   }}
//                   className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700"
//                 >
//                   Fund platform wallet
//                 </button>
//                 <div className="mt-6 flex items-center justify-between">
//                   <h3 className="font-extrabold">Recent transactions</h3>
//                   <History size={17} className="text-slate-400" />
//                 </div>
//                 <div className="mt-3 space-y-2">
//                   {txs.length === 0 ? (
//                     <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
//                       No transactions in this demo session yet.
//                     </p>
//                   ) : (
//                     txs.slice(0, 12).map((t) => (
//                       <div
//                         key={t.id}
//                         className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
//                       >
//                         <div
//                           className={`grid h-9 w-9 place-items-center rounded-xl ${
//                             t.amount < 0
//                               ? "bg-rose-50 text-rose-600"
//                               : "bg-emerald-50 text-emerald-600"
//                           }`}
//                         >
//                           <Coins size={17} />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <div className="text-sm font-semibold">{t.description}</div>
//                           <div className="text-xs text-slate-400">
//                             {new Date(t.at).toLocaleTimeString()}
//                           </div>
//                         </div>
//                         <b
//                           className={
//                             t.amount < 0 ? "text-rose-600" : "text-emerald-600"
//                           }
//                         >
//                           {t.amount < 0 ? "−" : "+"}
//                           {Math.abs(t.amount).toLocaleString()}
//                           {t.description.includes("fee") ? " ₦" : " pts"}
//                         </b>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}

//             {drawer === "rewards" && (
//               <div className="mt-5">
//                 <div className="rounded-2xl bg-amber-50 p-5">
//                   <div className="text-sm font-semibold text-amber-800">
//                     Current CBT Points
//                   </div>
//                   <div className="mt-1 text-3xl font-black text-amber-950">
//                     {cbtPoints.toLocaleString()}
//                   </div>
//                   <p className="mt-1 text-xs text-amber-800">
//                     Separate from your Naira wallet
//                   </p>
//                 </div>
//                 <h3 className="mt-6 font-extrabold">How to earn</h3>
//                 <div className="mt-3 space-y-2">
//                   {[
//                     { a: "Easy correct answer", b: "+20 points" },
//                     { a: "Medium correct answer", b: "+30 points" },
//                     { a: "Hard correct answer", b: "+40 points" },
//                     { a: "Capture an opponent token", b: "+100 points" },
//                     { a: "Win the match", b: "+500 points" },
//                   ].map((x) => (
//                     <div
//                       key={x.a}
//                       className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm"
//                     >
//                       <span>{x.a}</span>
//                       <b className="text-amber-700">{x.b}</b>
//                     </div>
//                   ))}
//                 </div>
//                 <h3 className="mt-6 font-extrabold">This session's rewards</h3>
//                 <div className="mt-3 space-y-2">
//                   {txs.filter((t) => t.amount > 0).length === 0 ? (
//                     <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
//                       Earn points by answering correctly and capturing tokens.
//                     </p>
//                   ) : (
//                     txs
//                       .filter((t) => t.amount > 0)
//                       .map((t) => (
//                         <div
//                           key={t.id}
//                           className="flex justify-between rounded-xl border border-slate-100 p-3 text-sm"
//                         >
//                           <span>{t.description}</span>
//                           <b className="text-emerald-700">+{t.amount}</b>
//                         </div>
//                       ))
//                   )}
//                 </div>
//               </div>
//             )}

//             {drawer === "move" && (
//               <div className="mt-5">
//                 <p className="text-sm leading-6 text-slate-600">
//                   Choose a legal move. A combined move uses both dice together.
//                   An individual move consumes one die and then offers legal moves
//                   for the remaining die, if any.
//                 </p>
//                 <div className="mt-4 space-y-2">
//                   {currentLegal.map((m, i) => (
//                     <button
//                       key={`${m.tokenId}-${m.steps}-${m.description}-${i}`}
//                       type="button"
//                       onClick={() => doSelectedMove(m)}
//                       className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-400 hover:bg-indigo-50"
//                     >
//                       <div className="font-bold">{m.description}</div>
//                       <div className="mt-1 text-xs text-slate-500">
//                         {m.entersFromBase
//                           ? "Enter from base"
//                           : `Token ${Number(m.tokenId.split("-").pop()) + 1}`}
//                         {" · "}Dice {m.die ?? `${dice[0]} + ${dice[1]}`}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//                 {currentLegal.length === 0 && (
//                   <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
//                     No legal moves available.
//                   </p>
//                 )}
//               </div>
//             )}
//           </aside>
//         </div>
//       )}

//       {confirmExit && (
//         <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4">
//           <section
//             role="dialog"
//             aria-modal="true"
//             className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
//           >
//             <div className="grid h-12 w-12 place-items-center rounded-xl bg-rose-50 text-rose-600">
//               <Info size={23} />
//             </div>
//             <h2 className="mt-4 text-xl font-black">Exit this match?</h2>
//             <p className="mt-2 text-sm leading-6 text-slate-600">
//               Your current match progress will be abandoned. Completed demo
//               wallet transactions remain in this session. In the
//               backend-connected version, confirmed charges will not be
//               duplicated or reversed just because you exit.
//             </p>
//             <div className="mt-6 flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setConfirmExit(false)}
//                 className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold"
//               >
//                 Continue playing
//               </button>
//               <button
//                 type="button"
//                 onClick={exitGame}
//                 className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white"
//               >
//                 Exit match
//               </button>
//             </div>
//           </section>
//         </div>
//       )}

//       {toast && phase !== "countdown" && (
//         <div
//           role="status"
//           className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl"
//         >
//           {toast}
//         </div>
//       )}
//     </div>
//   );
// }
