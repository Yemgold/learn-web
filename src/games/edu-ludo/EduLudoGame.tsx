



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  Bot,
  CheckCircle2,
  Coins,
  Dice5,
  Flag,
  History,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import GameLobby, {
  type EduLudoMode,
  type EduLudoSubject,
  type EduLudoLevel,
} from "@/games/edu-ludo/GameLobby";

import LudoBoard, {
  type LudoBoardPlayer,
  type LudoColor,
  type LudoToken,
} from "@/games/edu-ludo/LudoBoard";

import QuestionModal, {
  type EduLudoQuestion,
  type QuestionAnswerResult,
} from "@/games/edu-ludo/QuestionModal";

import WalletPanel, {
  type WalletTransaction,
} from "@/games/edu-ludo/WalletPanel";

export interface EduLudoGameProps {
  initialBalance?: number;
  initialCbtPoints?: number;
  onBack?: () => void;
  onFundWallet?: () => void;
}

interface GamePlayer extends LudoBoardPlayer {
  isHuman: boolean;
}

const QUESTION_COST = 2;
const QUESTION_TIME_LIMIT = 15;

const COLORS: LudoColor[] = ["red", "green", "yellow", "blue"];

const START_OFFSETS: Record<LudoColor, number> = {
  red: 0,
  green: 13,
  blue: 26,
  yellow: 39,
};

// Approximate safe spaces on the 52-square outer track.
const SAFE_TRACK_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

const QUESTION_BANK: EduLudoQuestion[] = [
  {
    id: "math-001",
    subject: "Mathematics",
    level: "JAMB",
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 2,
    explanation: "15% of 200 = 0.15 × 200 = 30.",
  },
  {
    id: "math-002",
    subject: "Mathematics",
    level: "JAMB",
    question: "Solve for x: 3x + 5 = 20.",
    options: ["3", "5", "8", "15"],
    correctAnswer: 1,
    explanation: "Subtract 5 from both sides, then divide 15 by 3.",
  },
  {
    id: "math-003",
    subject: "Mathematics",
    level: "SSS",
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    correctAnswer: 2,
    explanation: "12 × 12 = 144.",
  },
  {
    id: "math-004",
    subject: "Mathematics",
    level: "JSS",
    question: "Express 0.75 as a fraction in its simplest form.",
    options: ["1/2", "2/3", "3/4", "4/5"],
    correctAnswer: 2,
    explanation: "0.75 = 75/100 = 3/4.",
  },
  {
    id: "eng-001",
    subject: "English",
    level: "JAMB",
    question: "Choose the word nearest in meaning to 'diligent'.",
    options: ["Careless", "Hardworking", "Impatient", "Weak"],
    correctAnswer: 1,
    explanation: "A diligent person is careful and hardworking.",
  },
  {
    id: "eng-002",
    subject: "English",
    level: "SSS",
    question: "Which word is an adjective?",
    options: ["Quickly", "Beauty", "Beautiful", "Beautify"],
    correctAnswer: 2,
    explanation: "'Beautiful' describes a noun, so it is an adjective.",
  },
  {
    id: "eng-003",
    subject: "English",
    level: "JSS",
    question: "What is the plural of 'child'?",
    options: ["Childs", "Childes", "Children", "Childrens"],
    correctAnswer: 2,
    explanation: "The correct plural form of child is children.",
  },
  {
    id: "eng-004",
    subject: "English",
    level: "JAMB",
    question: "Choose the correctly spelt word.",
    options: ["Accomodation", "Acommodation", "Accommodation", "Acomodation"],
    correctAnswer: 2,
    explanation: "'Accommodation' has double c and double m.",
  },
  {
    id: "sci-001",
    subject: "Science",
    level: "JSS",
    question: "Which organ pumps blood around the human body?",
    options: ["Liver", "Heart", "Lung", "Kidney"],
    correctAnswer: 1,
    explanation: "The heart pumps blood through the circulatory system.",
  },
  {
    id: "sci-002",
    subject: "Science",
    level: "JSS",
    question: "Which gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correctAnswer: 2,
    explanation: "Plants use carbon dioxide and water to make glucose.",
  },
  {
    id: "bio-001",
    subject: "Biology",
    level: "JAMB",
    question: "What is the basic structural and functional unit of life?",
    options: ["Tissue", "Organ", "Cell", "Nucleus"],
    correctAnswer: 2,
    explanation: "The cell is the basic unit of living organisms.",
  },
  {
    id: "bio-002",
    subject: "Biology",
    level: "SSS",
    question: "Which organelle is primarily responsible for photosynthesis?",
    options: ["Mitochondrion", "Chloroplast", "Ribosome", "Lysosome"],
    correctAnswer: 1,
    explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis.",
  },
  {
    id: "chem-001",
    subject: "Chemistry",
    level: "JAMB",
    question: "What is the chemical symbol for sodium?",
    options: ["S", "So", "Na", "N"],
    correctAnswer: 2,
    explanation: "Na comes from the Latin name natrium.",
  },
  {
    id: "chem-002",
    subject: "Chemistry",
    level: "SSS",
    question: "A solution with a pH of 2 is best described as:",
    options: ["Strongly acidic", "Neutral", "Weakly alkaline", "Strongly alkaline"],
    correctAnswer: 0,
    explanation: "A pH below 7 is acidic; a pH of 2 is strongly acidic.",
  },
  {
    id: "phys-001",
    subject: "Physics",
    level: "JAMB",
    question: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    correctAnswer: 2,
    explanation: "Force is measured in newtons (N).",
  },
  {
    id: "phys-002",
    subject: "Physics",
    level: "SSS",
    question: "Which instrument measures electric current?",
    options: ["Voltmeter", "Ammeter", "Barometer", "Thermometer"],
    correctAnswer: 1,
    explanation: "An ammeter measures electric current.",
  },
];

function makeInitialPlayers(mode: EduLudoMode): GamePlayer[] {
  const names: Record<LudoColor, string> = {
    red: "You",
    green: mode === "solo" ? "Bot Green" : "Player 2",
    yellow: mode === "solo" ? "Bot Yellow" : "Player 3",
    blue: mode === "solo" ? "Bot Blue" : "Player 4",
  };

  return COLORS.map((color, playerIndex) => ({
    id: color,
    name: names[color],
    color,
    isHuman: mode !== "solo" || playerIndex === 0,
    tokens: Array.from({ length: 4 }, (_, index) => ({
      id: `${color}-${index + 1}`,
      position: -1,
      finished: false,
    })),
  }));
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getGlobalTrackPosition(player: GamePlayer, position: number) {
  return (position + START_OFFSETS[player.color]) % 52;
}

function getEligibleTokens(
  player: GamePlayer,
  dice: number,
): LudoToken[] {
  return player.tokens.filter((token) => {
    if (token.finished || token.position === 57) return false;

    if (token.position === -1) {
      return dice === 6;
    }

    return token.position >= 0 && token.position + dice <= 57;
  });
}

function getQuestionForSubject(
  subject: EduLudoSubject,
): EduLudoQuestion {
  const matching =
    subject === "All Subjects" || subject === "Science"
      ? QUESTION_BANK.filter((question) =>
          subject === "All Subjects"
            ? true
            : ["Science", "Biology", "Chemistry", "Physics"].includes(
                question.subject,
              ),
        )
      : QUESTION_BANK.filter((question) => question.subject === subject);

  const pool = matching.length > 0 ? matching : QUESTION_BANK;
  const question = pool[Math.floor(Math.random() * pool.length)];

  // Unique ID ensures the modal resets even when a question repeats.
  return {
    ...question,
    id: `${question.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
}

export default function EduLudoGame({
  initialBalance = 500,
  initialCbtPoints = 0,
  onBack,
  onFundWallet,
}: EduLudoGameProps) {
  const [balance, setBalance] = useState(Math.max(0, initialBalance));
  const [cbtPoints, setCbtPoints] = useState(
    Math.max(0, initialCbtPoints),
  );

  const [mode, setMode] = useState<EduLudoMode>("solo");
  const [subject, setSubject] =
    useState<EduLudoSubject>("All Subjects");
  const [level, setLevel] = useState<EduLudoLevel>("JAMB");

  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState<GamePlayer[]>(() =>
    makeInitialPlayers("solo"),
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [pendingRoll, setPendingRoll] = useState<number | null>(null);
  const [question, setQuestion] = useState<EduLudoQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [awaitingMove, setAwaitingMove] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(
    null,
  );

  const [statusMessage, setStatusMessage] = useState(
    "Choose a game mode to begin.",
  );
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [winner, setWinner] = useState<GamePlayer | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(
    [],
  );
  const [showTransactions, setShowTransactions] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  const humanPlayer = players.find((player) => player.id === "red");

  const currentEligibleTokens = useMemo(() => {
    if (!currentPlayer || pendingRoll === null) return [];

    return getEligibleTokens(currentPlayer, pendingRoll);
  }, [currentPlayer, pendingRoll]);

  const startGame = useCallback(() => {
    const freshPlayers = makeInitialPlayers(mode);

    setPlayers(freshPlayers);
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setPendingRoll(null);
    setQuestion(null);
    setQuestionNumber(0);
    setAwaitingMove(false);
    setSelectedTokenId(null);
    setWinner(null);
    setGameOver(false);
    setStarted(true);
    setIsBotThinking(false);
    setLastFeedback(null);
    setStatusMessage(
      "Your turn! Roll the dice to receive a question.",
    );
  }, [mode]);

  const advanceTurn = useCallback(
    (extraTurn = false) => {
      setAwaitingMove(false);
      setSelectedTokenId(null);
      setPendingRoll(null);
      setQuestion(null);

      if (extraTurn && !gameOver) {
        setStatusMessage(
          `${players[currentPlayerIndex]?.name} earned an extra turn! Roll again.`,
        );
        return;
      }

      setCurrentPlayerIndex((index) => (index + 1) % players.length);
      setDiceValue(null);
      setStatusMessage("Next player's turn.");
    },
    [currentPlayerIndex, gameOver, players],
  );

  const moveToken = useCallback(
    (playerIndex: number, tokenId: string, dice: number) => {
      const player = players[playerIndex];
      if (!player || gameOver) return;

      const token = player.tokens.find((item) => item.id === tokenId);
      if (!token || token.finished || token.position === 57) return;

      if (token.position === -1 && dice !== 6) {
        setStatusMessage("You need a six to bring a token out of base.");
        return;
      }

      const nextPosition = token.position === -1 ? 0 : token.position + dice;

      if (nextPosition > 57) {
        setStatusMessage("You need the exact number to reach HOME.");
        advanceTurn(dice === 6);
        return;
      }

      const nextPlayers = players.map((item) => ({
        ...item,
        tokens: item.tokens.map((existingToken) => ({
          ...existingToken,
        })),
      }));

      const movingPlayer = nextPlayers[playerIndex];
      const movingToken = movingPlayer.tokens.find(
        (item) => item.id === tokenId,
      );

      if (!movingToken) return;

      movingToken.position = nextPosition;
      movingToken.finished = nextPosition === 57;

      let capturedCount = 0;

      // Captures apply only while the moving token is on the outer track.
      if (nextPosition >= 0 && nextPosition <= 51) {
        const landingPosition = getGlobalTrackPosition(
          movingPlayer,
          nextPosition,
        );

        const isSafe = SAFE_TRACK_POSITIONS.has(landingPosition);

        if (!isSafe) {
          nextPlayers.forEach((opponent, opponentIndex) => {
            if (opponentIndex === playerIndex) return;

            opponent.tokens.forEach((opponentToken) => {
              if (
                opponentToken.position >= 0 &&
                opponentToken.position <= 51 &&
                getGlobalTrackPosition(
                  opponent,
                  opponentToken.position,
                ) === landingPosition
              ) {
                opponentToken.position = -1;
                opponentToken.finished = false;
                capturedCount += 1;
              }
            });
          });
        }
      }

      setPlayers(nextPlayers);
      setSelectedTokenId(null);
      setAwaitingMove(false);
      setPendingRoll(null);

      if (capturedCount > 0) {
        setCbtPoints((points) => points + 200 * capturedCount);
        setLastFeedback(
          `Capture bonus! ${capturedCount} opposing token${
            capturedCount === 1 ? "" : "s"
          } sent home. +${200 * capturedCount} CBT Points.`,
        );
      }

      if (movingToken.finished) {
        setCbtPoints((points) => points + 500);
        setLastFeedback("Token HOME! +500 CBT Points.");
      }

      const allTokensFinished = movingPlayer.tokens.every(
        (item) => item.finished || item.position === 57,
      );

      if (allTokensFinished) {
        setWinner(movingPlayer);
        setGameOver(true);
        setStarted(false);
        setCbtPoints((points) => points + 1000);
        setStatusMessage(
          `${movingPlayer.name} wins the Learnyfi Educational Ludo game!`,
        );
        return;
      }

      if (capturedCount > 0) {
        setStatusMessage(
          `${movingPlayer.name} captured a token and earned an extra turn!`,
        );
        setDiceValue(null);
        return;
      }

      if (dice === 6) {
        setStatusMessage(
          `${movingPlayer.name} rolled a six and earned an extra turn!`,
        );
        setDiceValue(null);
        return;
      }

      advanceTurn(false);
    },
    [advanceTurn, gameOver, players],
  );

  const handleQuestionAnswer = useCallback(
    (result: QuestionAnswerResult) => {
      const roll = pendingRoll;
      const player = players[currentPlayerIndex];

      setQuestion(null);

      if (!player || roll === null || !player.isHuman) {
        setStatusMessage("The game turn could not be validated.");
        advanceTurn(false);
        return;
      }

      if (result.correct) {
        setCbtPoints((points) => points + 50);
        setLastFeedback("Correct answer! +50 CBT Points.");

        const eligible = getEligibleTokens(player, roll);

        if (eligible.length > 0) {
          setAwaitingMove(true);
          setStatusMessage(
            roll === 6
              ? "Correct! You rolled a six. Choose a token to move."
              : "Correct answer! Choose one of your eligible tokens.",
          );
        } else {
          setStatusMessage(
            roll === 6
              ? "Correct! No token can move with this roll."
              : "Correct, but no token can move. Your turn ends.",
          );
          advanceTurn(roll === 6);
        }
      } else {
        setLastFeedback(
          result.timedOut
            ? "Time expired. No move this turn."
            : "Incorrect answer. No move this turn.",
        );
        setStatusMessage(
          result.timedOut
            ? "Time is up. Your turn has ended."
            : "Incorrect answer. Your turn has ended.",
        );
        advanceTurn(false);
      }
    },
    [advanceTurn, currentPlayerIndex, pendingRoll, players],
  );

  const rollDiceAndPresentQuestion = useCallback(() => {
    if (!started || gameOver || question || awaitingMove || !currentPlayer) {
      return;
    }

    if (!currentPlayer.isHuman) return;

    if (balance < QUESTION_COST) {
      setStatusMessage(
        `Your balance is too low. Add funds to pay the ${formatNaira(
          QUESTION_COST,
        )} question fee.`,
      );
      return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    const nextQuestion = getQuestionForSubject(subject);
    const now = new Date();

    // Frontend demo only. Production charging must be done by the backend
    // with an idempotent request when the question is actually presented.
    setBalance((current) => Math.max(0, current - QUESTION_COST));
    setTransactions((items) => [
      {
        id: `demo-debit-${Date.now()}`,
        type: "debit",
        amount: QUESTION_COST,
        description: "Educational Ludo question fee",
        createdAt: now,
        status: "successful",
        reference: `DEMO-${Date.now()}`,
      },
      ...items,
    ]);

    setDiceValue(roll);
    setPendingRoll(roll);
    setQuestionNumber((number) => number + 1);
    setQuestion(nextQuestion);
    setLastFeedback(null);
    setStatusMessage(
      `You rolled ${roll}. Answer the question to move your token.`,
    );
  }, [
    awaitingMove,
    balance,
    currentPlayer,
    gameOver,
    question,
    started,
    subject,
  ]);

  const handleTokenClick = useCallback(
    (playerId: string, tokenId: string) => {
      if (!started || !awaitingMove || !currentPlayer) return;
      if (playerId !== currentPlayer.id) return;
      if (pendingRoll === null) return;

      const token = currentPlayer.tokens.find(
        (item) => item.id === tokenId,
      );

      if (!token) return;

      const eligible = getEligibleTokens(currentPlayer, pendingRoll);

      if (!eligible.some((item) => item.id === tokenId)) {
        setLastFeedback(null);
        setStatusMessage(
          token.position === -1
            ? "This token needs a six to leave its base."
            : "That token cannot move with the current dice roll.",
        );
        return;
      }

      setSelectedTokenId(tokenId);
      moveToken(currentPlayerIndex, tokenId, pendingRoll);
    },
    [
      awaitingMove,
      currentPlayer,
      currentPlayerIndex,
      moveToken,
      pendingRoll,
      started,
    ],
  );

  // Basic local bot opponents. Bots simulate their own questions; they do not
  // deduct the human player's wallet balance for a bot's turn.
  useEffect(() => {
    if (
      !started ||
      gameOver ||
      question ||
      awaitingMove ||
      !currentPlayer ||
      currentPlayer.isHuman
    ) {
      setIsBotThinking(false);
      return;
    }

    setIsBotThinking(true);
    setStatusMessage(`${currentPlayer.name} is thinking...`);

    const timeout = window.setTimeout(() => {
      const bot = players[currentPlayerIndex];
      if (!bot) {
        setIsBotThinking(false);
        return;
      }

      const botRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(botRoll);

      // Simulated bot knowledge score for this local prototype.
      const botAnsweredCorrectly = Math.random() < 0.7;

      if (!botAnsweredCorrectly) {
        setLastFeedback(`${bot.name} answered incorrectly.`);
        setIsBotThinking(false);
        advanceTurn(false);
        return;
      }

      const eligible = getEligibleTokens(bot, botRoll);

      if (eligible.length === 0) {
        setLastFeedback(`${bot.name} has no eligible token to move.`);
        setIsBotThinking(false);
        advanceTurn(botRoll === 6);
        return;
      }

      const token =
        eligible[Math.floor(Math.random() * eligible.length)];

      setLastFeedback(`${bot.name} answered correctly.`);
      setIsBotThinking(false);
      moveToken(currentPlayerIndex, token.id, botRoll);
    }, 1100);

    return () => window.clearTimeout(timeout);
  }, [
    advanceTurn,
    awaitingMove,
    currentPlayer,
    currentPlayerIndex,
    gameOver,
    moveToken,
    players,
    question,
    started,
  ]);

  const resetToLobby = useCallback(() => {
    setStarted(false);
    setGameOver(false);
    setWinner(null);
    setQuestion(null);
    setAwaitingMove(false);
    setPendingRoll(null);
    setDiceValue(null);
    setSelectedTokenId(null);
    setIsBotThinking(false);
    setStatusMessage("Choose a game mode to begin.");
  }, []);

  const allTransactions = transactions;

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      {/* Page heading */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Go back"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              >
                <ArrowLeft size={19} />
              </button>
            )}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-700 text-white shadow-sm">
              <Dice5 size={24} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                Learnyfi Educational Ludo
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Learn, answer questions, and race your tokens HOME.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Wallet size={16} className="text-violet-700" />
            <span className="text-sm font-extrabold text-slate-900">
              {formatNaira(balance)}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* Lobby */}
        {!started && !gameOver && (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <GameLobby
                balance={balance}
                mode={mode}
                subject={subject}
                level={level}
                onModeChange={setMode}
                onSubjectChange={setSubject}
                onLevelChange={setLevel}
                onStart={startGame}
                onFundWallet={onFundWallet}
              />

              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div>
                    <h3 className="font-bold text-blue-950">
                      How the game works
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-blue-900">
                      Roll the dice, answer a question correctly, and move an
                      eligible token. A question costs ₦2 when presented.
                      Incorrect answers and timeouts end your turn. Roll a six
                      to bring a token out of base.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <WalletPanel
                balance={balance}
                cbtPoints={cbtPoints}
                questionCost={QUESTION_COST}
                transactions={transactions}
                onFundWallet={onFundWallet}
                onViewTransactions={() => setShowTransactions(true)}
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
                  <Award size={19} className="text-violet-700" />
                  Demo rewards
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Correct answer</span>
                    <span className="font-extrabold text-amber-700">
                      +50 CBT
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Capture an opponent</span>
                    <span className="font-extrabold text-amber-700">
                      +200 CBT
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Token reaches HOME</span>
                    <span className="font-extrabold text-amber-700">
                      +500 CBT
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Win the game</span>
                    <span className="font-extrabold text-amber-700">
                      +1,000 CBT
                    </span>
                  </li>
                </ul>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  These are prototype reward values. Enforce reward limits
                  and eligibility on your backend before production use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active game */}
        {started && !gameOver && (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="min-w-0">
              <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
                        {mode === "solo"
                          ? "Solo vs Bots"
                          : mode === "friends"
                            ? "Play with Friends · Local Demo"
                            : mode === "classroom"
                              ? "Classroom · Local Demo"
                              : "Tournament · Local Demo"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {level}
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-black text-slate-900">
                      {currentPlayer?.name ?? "Your game"}
                      {"'s turn"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Subject: {subject}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetToLobby}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={15} />
                    Exit game
                  </button>
                </div>

                <div
                  role="status"
                  aria-live="polite"
                  className="mt-4 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-3"
                >
                  {isBotThinking ? (
                    <Loader2
                      size={18}
                      className="mt-0.5 shrink-0 animate-spin text-violet-700"
                    />
                  ) : (
                    <Zap
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-700"
                    />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-violet-950">
                      {statusMessage}
                    </p>

                    {lastFeedback && (
                      <p className="mt-1 text-xs leading-5 text-violet-800">
                        {lastFeedback}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
                <LudoBoard
                  players={players}
                  currentPlayerId={currentPlayer?.id ?? "red"}
                  selectedTokenId={selectedTokenId}
                  onTokenClick={handleTokenClick}
                  disabled={
                    !awaitingMove ||
                    Boolean(question) ||
                    !currentPlayer?.isHuman
                  }
                />
              </div>

              {/* Dice and turn controls */}
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-800">
                      <Dice5 size={32} />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-900">
                        {diceValue
                          ? `Dice rolled: ${diceValue}`
                          : "Ready to roll?"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {awaitingMove
                          ? `${currentEligibleTokens.length} eligible token(s)`
                          : question
                            ? "Answer the question to move."
                            : currentPlayer?.isHuman
                              ? "Each presented question costs ₦2."
                              : "Bot turn in progress."}
                      </p>
                    </div>
                  </div>

                  {currentPlayer?.isHuman &&
                    !question &&
                    !awaitingMove && (
                      <button
                        type="button"
                        onClick={rollDiceAndPresentQuestion}
                        disabled={
                          !started ||
                          gameOver ||
                          isBotThinking ||
                          balance < QUESTION_COST
                        }
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-700/20 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
                      >
                        <Dice5 size={19} />
                        Roll Dice & Answer
                      </button>
                    )}

                  {awaitingMove && currentPlayer?.isHuman && (
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800 sm:w-auto">
                      <CheckCircle2 size={18} />
                      Tap an eligible token
                    </div>
                  )}
                </div>

                {balance < QUESTION_COST &&
                  currentPlayer?.isHuman &&
                  !question &&
                  !awaitingMove && (
                    <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center">
                      <p className="text-sm leading-5 text-amber-900">
                        Your balance is below the {formatNaira(QUESTION_COST)}{" "}
                        question fee.
                      </p>
                      {onFundWallet && (
                        <button
                          type="button"
                          onClick={onFundWallet}
                          className="rounded-lg bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800"
                        >
                          Fund Wallet
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </section>

            {/* Right sidebar */}
            <aside className="space-y-5">
              <WalletPanel
                balance={balance}
                cbtPoints={cbtPoints}
                questionCost={QUESTION_COST}
                transactions={transactions}
                onFundWallet={onFundWallet}
                onViewTransactions={() => setShowTransactions(true)}
                compact
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
                  <Flag size={18} className="text-violet-700" />
                  Players
                </h3>

                <div className="mt-4 space-y-3">
                  {players.map((player) => {
                    const colorClasses: Record<LudoColor, string> = {
                      red: "bg-red-500",
                      green: "bg-green-500",
                      yellow: "bg-yellow-400",
                      blue: "bg-blue-500",
                    };

                    const finished = player.tokens.filter(
                      (token) => token.finished || token.position === 57,
                    ).length;

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 ${
                          player.id === currentPlayer?.id
                            ? "border-violet-300 bg-violet-50"
                            : "border-slate-100 bg-slate-50"
                        }`}
                      >
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full ${colorClasses[player.color]}`}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {player.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {finished}/4 tokens HOME
                          </p>
                        </div>

                        {player.isHuman ? (
                          <ShieldCheck
                            size={16}
                            className="text-violet-700"
                            aria-label="Human player"
                          />
                        ) : (
                          <Bot
                            size={16}
                            className="text-slate-400"
                            aria-label="Bot player"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
                  <Coins size={18} className="text-amber-600" />
                  Game rules
                </h3>

                <ul className="mt-4 space-y-3 text-xs leading-5 text-slate-600">
                  <li>• Each human question costs ₦2 when presented.</li>
                  <li>• Correct answers earn 50 demo CBT Points.</li>
                  <li>• A six is needed to leave the starting base.</li>
                  <li>• Captures and rolling a six grant extra turns.</li>
                  <li>• Tokens need an exact roll to reach HOME.</li>
                  <li>• Get all four tokens HOME to win.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        {/* Winner screen */}
        {gameOver && winner && (
          <section className="mx-auto max-w-xl">
            <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white text-center shadow-xl">
              <div className="bg-gradient-to-br from-violet-800 to-indigo-700 px-6 py-10 text-white">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
                  <Trophy size={42} className="text-amber-300" />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
                  Game completed
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {winner.name} wins!
                </h2>

                <p className="mt-3 text-sm leading-6 text-violet-100">
                  All four tokens have reached HOME.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-semibold text-amber-900">
                    Winner reward (demo)
                  </p>
                  <p className="mt-2 text-3xl font-black text-amber-800">
                    +1,000 CBT Points
                  </p>
                  <p className="mt-2 text-xs text-amber-800">
                    Your current demo balance is {cbtPoints.toLocaleString()}{" "}
                    CBT Points.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={startGame}
                    className="flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-extrabold text-white transition hover:bg-violet-800"
                  >
                    <RotateCcw size={18} />
                    Play Again
                  </button>

                  <button
                    type="button"
                    onClick={resetToLobby}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back to Lobby
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Transaction history dialog */}
      {showTransactions && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transaction-dialog-title"
        >
          <div className="max-h-[85vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-5">
              <div>
                <h2
                  id="transaction-dialog-title"
                  className="font-extrabold text-slate-900"
                >
                  Wallet transactions
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Local demo history
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTransactions(false)}
                aria-label="Close transaction history"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5">
              {allTransactions.length === 0 ? (
                <div className="py-10 text-center">
                  <History
                    size={28}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-bold text-slate-700">
                    No transactions yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Question-fee demo entries will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">
                          {transaction.description}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Intl.DateTimeFormat("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(transaction.createdAt))}
                        </p>
                        {transaction.reference && (
                          <p className="mt-1 break-all text-[10px] text-slate-400">
                            {transaction.reference}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-sm font-extrabold text-red-600">
                        −{formatNaira(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                These entries are stored in browser memory only. They are not
                verified payment records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Question modal */}
      {question && (
        <QuestionModal
          question={question}
          questionNumber={questionNumber}
          totalQuestions={20}
          timeLimit={QUESTION_TIME_LIMIT}
          questionCost={QUESTION_COST}
          onAnswer={handleQuestionAnswer}
          showExplanation
        />
      )}

      {/* Balance reminder */}
      {started && balance < QUESTION_COST && !question && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-amber-200 bg-white p-3 shadow-xl">
            <Wallet size={20} className="shrink-0 text-amber-700" />
            <p className="flex-1 text-xs font-semibold leading-5 text-slate-700">
              Your demo balance cannot cover another question.
            </p>
            {onFundWallet && (
              <button
                type="button"
                onClick={onFundWallet}
                className="shrink-0 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white"
              >
                Fund
              </button>
            )}
          </div>
        </div>
      )}

      {/* The initial player reference is intentionally kept for future
          backend integration with the authenticated player's identity. */}
      {humanPlayer && null}
    </main>
  );
}
