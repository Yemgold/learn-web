
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  Crown,
  Dice5,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
  X,
  Zap,
} from "lucide-react";

type Color = "red" | "green" | "yellow" | "blue";
type Difficulty = "Easy" | "Medium" | "Hard";
type Phase =
  | "lobby"
  | "countdown"
  | "rolling"
  | "diceResult"
  | "question"
  | "feedback"
  | "move"
  | "finished";

type Token = {
  position: number;
};

type Player = {
  id: string;
  name: string;
  color: Color;
  human: boolean;
  tokens: Token[];
  score: number;
};

type Question = {
  id: string;
  subject: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Move = {
  tokenIndex: number;
  steps: number;
  diceIndices: number[];
  label: string;
};

const COLORS: Record<Color, { main: string; light: string; border: string }> = {
  red: {
    main: "#dc2626",
    light: "#fee2e2",
    border: "#991b1b",
  },
  green: {
    main: "#16a34a",
    light: "#dcfce7",
    border: "#166534",
  },
  yellow: {
    main: "#eab308",
    light: "#fef9c3",
    border: "#854d0e",
  },
  blue: {
    main: "#2563eb",
    light: "#dbeafe",
    border: "#1e40af",
  },
};

const SUBJECTS = [
  "Mixed",
  "Mathematics",
  "English",
  "Biology",
  "Chemistry",
  "Physics",
];

const QUESTIONS: Question[] = [
  {
    id: "math-1",
    subject: "Mathematics",
    difficulty: "Easy",
    text: "What is 12 × 8?",
    options: ["86", "96", "88", "108"],
    answer: 1,
    explanation: "12 multiplied by 8 equals 96.",
  },
  {
    id: "math-2",
    subject: "Mathematics",
    difficulty: "Medium",
    text: "Solve: 3x + 5 = 20.",
    options: ["3", "4", "5", "6"],
    answer: 2,
    explanation: "Subtract 5 to get 3x = 15, then divide by 3.",
  },
  {
    id: "math-3",
    subject: "Mathematics",
    difficulty: "Hard",
    text: "If 2x² = 50 and x is positive, find x.",
    options: ["4", "5", "10", "25"],
    answer: 1,
    explanation: "x² = 25, so the positive value of x is 5.",
  },
  {
    id: "eng-1",
    subject: "English",
    difficulty: "Easy",
    text: "Choose the correct plural of 'criterion'.",
    options: ["Criterions", "Criteria", "Criterias", "Criterion"],
    answer: 1,
    explanation: "Criteria is the plural form of criterion.",
  },
  {
    id: "eng-2",
    subject: "English",
    difficulty: "Medium",
    text: "Which word is closest in meaning to 'diligent'?",
    options: ["Careless", "Hardworking", "Impatient", "Timid"],
    answer: 1,
    explanation: "A diligent person is careful and hardworking.",
  },
  {
    id: "eng-3",
    subject: "English",
    difficulty: "Hard",
    text: "Identify the figure of speech: 'The wind whispered.'",
    options: ["Hyperbole", "Irony", "Personification", "Oxymoron"],
    answer: 2,
    explanation: "Personification gives a human action to the wind.",
  },
  {
    id: "bio-1",
    subject: "Biology",
    difficulty: "Easy",
    text: "Which organ pumps blood around the human body?",
    options: ["Liver", "Kidney", "Heart", "Lung"],
    answer: 2,
    explanation: "The heart pumps blood through the circulatory system.",
  },
  {
    id: "bio-2",
    subject: "Biology",
    difficulty: "Medium",
    text: "Which organelle is primarily responsible for photosynthesis?",
    options: ["Mitochondrion", "Chloroplast", "Ribosome", "Nucleus"],
    answer: 1,
    explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis.",
  },
  {
    id: "bio-3",
    subject: "Biology",
    difficulty: "Hard",
    text: "Which molecule carries genetic information?",
    options: ["Starch", "DNA", "Glycogen", "Cellulose"],
    answer: 1,
    explanation: "DNA stores hereditary information in living organisms.",
  },
  {
    id: "chem-1",
    subject: "Chemistry",
    difficulty: "Easy",
    text: "What is the chemical symbol for oxygen?",
    options: ["Ox", "O", "Oy", "Og"],
    answer: 1,
    explanation: "The chemical symbol for oxygen is O.",
  },
  {
    id: "chem-2",
    subject: "Chemistry",
    difficulty: "Medium",
    text: "A solution with a pH of 3 is best described as:",
    options: ["Acidic", "Neutral", "Alkaline", "Metallic"],
    answer: 0,
    explanation: "Solutions with pH values below 7 are acidic.",
  },
  {
    id: "chem-3",
    subject: "Chemistry",
    difficulty: "Hard",
    text: "What is the oxidation number of sulfur in H₂SO₄?",
    options: ["+2", "+4", "+6", "-2"],
    answer: 2,
    explanation: "Two hydrogen atoms contribute +2 and four oxygens contribute -8, so sulfur is +6.",
  },
  {
    id: "phy-1",
    subject: "Physics",
    difficulty: "Easy",
    text: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    answer: 2,
    explanation: "Force is measured in newtons.",
  },
  {
    id: "phy-2",
    subject: "Physics",
    difficulty: "Medium",
    text: "What is the approximate acceleration due to gravity near Earth's surface?",
    options: ["4.9 m/s²", "9.8 m/s²", "15 m/s²", "20 m/s²"],
    answer: 1,
    explanation: "The standard approximate value is 9.8 m/s².",
  },
  {
    id: "phy-3",
    subject: "Physics",
    difficulty: "Hard",
    text: "Which quantity is equal to the rate of change of momentum?",
    options: ["Power", "Force", "Work", "Energy"],
    answer: 1,
    explanation: "By Newton's second law, force equals the rate of change of momentum.",
  },
];

const TRACK: [number, number][] = (() => {
  const cells: [number, number][] = [];

  // A 14 × 14 perimeter contains 52 track squares.
  for (let c = 0; c < 14; c++) cells.push([0, c]);
  for (let r = 1; r < 14; r++) cells.push([r, 13]);
  for (let c = 12; c >= 0; c--) cells.push([13, c]);
  for (let r = 12; r >= 1; r--) cells.push([r, 0]);

  return cells;
})();

const SAFE_SQUARES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
const START_OFFSETS: Record<Color, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

function makePlayers(humanColor: Color): Player[] {
  const colors: Color[] = ["red", "green", "yellow", "blue"];
  const names: Record<Color, string> = {
    red: "You",
    green: "Ada",
    yellow: "Tunde",
    blue: "Zara",
  };

  return colors.map((color) => ({
    id: color,
    name: names[color],
    color,
    human: color === humanColor,
    tokens: Array.from({ length: 4 }, () => ({ position: -1 })),
    score: 0,
  }));
}

function difficultyPoints(difficulty: Difficulty) {
  if (difficulty === "Hard") return 40;
  if (difficulty === "Medium") return 30;
  return 20;
}

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export default function EduLudoGame() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [subject, setSubject] = useState("Mixed");
  const [level, setLevel] = useState("Secondary");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [botDifficulty, setBotDifficulty] = useState<Difficulty>("Medium");
  const [humanColor, setHumanColor] = useState<Color>("red");

  const [players, setPlayers] = useState<Player[]>(() => makePlayers("red"));
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [usedDice, setUsedDice] = useState<number[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questionCount, setQuestionCount] = useState(0);
  const [seenQuestions, setSeenQuestions] = useState<string[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(1000);
  const [cbtPoints, setCbtPoints] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [toast, setToast] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerLockedRef = useRef(false);
  const botActionRef = useRef(false);
  const rollLockRef = useRef(false);

  const current = players[turn];
  const human = players.find((player) => player.human);
  const isHumanTurn = Boolean(current?.human);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    timerRef.current = null;
    phaseTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const eligibleQuestions = useMemo(() => {
    const pool =
      subject === "Mixed"
        ? QUESTIONS
        : QUESTIONS.filter((item) => item.subject === subject);

    return pool.length ? pool : QUESTIONS;
  }, [subject]);

  const chooseQuestion = useCallback(() => {
    let available = eligibleQuestions.filter(
      (item) => !seenQuestions.includes(item.id),
    );

    // When the eligible pool has been exhausted, begin a new cycle.
    if (!available.length) {
      setSeenQuestions([]);
      available = eligibleQuestions;
    }

    const selectedPool = available.length ? available : eligibleQuestions;
    const selected =
      selectedPool[Math.floor(Math.random() * selectedPool.length)];

    setQuestion(selected);
    setSeenQuestions((previous) =>
      previous.includes(selected.id)
        ? [selected.id]
        : [...previous, selected.id],
    );
    setSelectedAnswer(null);
    setAnswerCorrect(null);
    setTimeLeft(15);
    answerLockedRef.current = false;
    setQuestionCount((count) => count + 1);
  }, [eligibleQuestions, seenQuestions]);

  const getMoves = useCallback(
    (player: Player, diceValues: [number, number], alreadyUsed: number[]) => {
      const result: Move[] = [];
      const remaining = [0, 1].filter((index) => !alreadyUsed.includes(index));

      for (let tokenIndex = 0; tokenIndex < player.tokens.length; tokenIndex++) {
        const token = player.tokens[tokenIndex];

        for (const dieIndex of remaining) {
          const value = diceValues[dieIndex];

          if (token.position === -1) {
            if (value === 6) {
              result.push({
                tokenIndex,
                steps: 1,
                diceIndices: [dieIndex],
                label: `Bring token ${tokenIndex + 1} out using die ${dieIndex + 1} (${value})`,
              });
            }
          } else if (token.position + value <= 57) {
            result.push({
              tokenIndex,
              steps: value,
              diceIndices: [dieIndex],
              label: `Move token ${tokenIndex + 1} by ${value} using die ${dieIndex + 1}`,
            });
          }
        }
      }

      if (remaining.length === 2) {
        const total = diceValues[0] + diceValues[1];

        for (let tokenIndex = 0; tokenIndex < player.tokens.length; tokenIndex++) {
          const token = player.tokens[tokenIndex];

          if (
            token.position >= 0 &&
            token.position + total <= 57
          ) {
            result.push({
              tokenIndex,
              steps: total,
              diceIndices: [0, 1],
              label: `Move token ${tokenIndex + 1} by the total ${total}`,
            });
          }
        }
      }

      return result;
    },
    [],
  );

  const finishMatch = useCallback(
    (winnerId: string) => {
      clearTimers();
      setWinner(winnerId);
      setPhase("finished");

      if (winnerId === human?.id) {
        setCbtPoints((points) => points + 500);
        setToast("You won! 500 bonus CBT Points added to the demo score.");
      }
    },
    [clearTimers, human?.id],
  );

  const advanceTurn = useCallback(
    (reason?: string) => {
      clearTimers();
      rollLockRef.current = false;
      botActionRef.current = false;
      answerLockedRef.current = false;

      if (reason) setMessage(reason);

      setUsedDice([]);
      setMoves([]);
      setQuestion(null);
      setSelectedAnswer(null);
      setAnswerCorrect(null);

      setTurn((previous) => (previous + 1) % players.length);
      setPhase("rolling");
    },
    [clearTimers, players.length],
  );

  const applyMove = useCallback(
    (move: Move) => {
      if (!current) return;

      const movingPlayer = current;
      const oldToken = movingPlayer.tokens[move.tokenIndex];

      let newPosition =
        oldToken.position === -1 ? 0 : oldToken.position + move.steps;

      if (oldToken.position === -1) {
        newPosition = 0;
      }

      const updatedPlayers = players.map((player) => ({
        ...player,
        tokens: player.tokens.map((token) => ({ ...token })),
      }));

      const actor = updatedPlayers.find(
        (player) => player.id === movingPlayer.id,
      );

      if (!actor) return;

      actor.tokens[move.tokenIndex].position = newPosition;

      let captured = false;

      if (newPosition < 52) {
        const globalSquare =
          (START_OFFSETS[actor.color] + newPosition) % 52;

        if (!SAFE_SQUARES.has(globalSquare)) {
          for (const opponent of updatedPlayers) {
            if (opponent.id === actor.id) continue;

            opponent.tokens = opponent.tokens.map((token) => {
              if (token.position < 0 || token.position >= 52) return token;

              const opponentSquare =
                (START_OFFSETS[opponent.color] + token.position) % 52;

              if (opponentSquare === globalSquare) {
                captured = true;
                return { position: -1 };
              }

              return token;
            });
          }
        }
      }

      if (captured) {
        actor.score += 100;
        if (actor.human) setCbtPoints((points) => points + 100);
      }

      const hasWon = actor.tokens.every((token) => token.position === 57);

      setPlayers(updatedPlayers);
      setUsedDice((previous) => [...previous, ...move.diceIndices]);

      if (hasWon) {
        finishMatch(actor.id);
        return;
      }

      const nextUsed = [...usedDice, ...move.diceIndices];
      const remainingMoves = getMoves(actor, dice, nextUsed);

      if (remainingMoves.length > 0 && nextUsed.length < 2) {
        setMoves(remainingMoves);
        setMessage(
          captured
            ? "Capture! You earned 100 CBT Points. Use the remaining die."
            : "Move completed. You may use the remaining die.",
        );
        setPhase("move");
      } else {
        advanceTurn(
          captured
            ? "Capture! 100 CBT Points awarded to the capturing player."
            : "Turn completed.",
        );
      }
    },
    [
      advanceTurn,
      current,
      dice,
      finishMatch,
      getMoves,
      players,
      usedDice,
    ],
  );

  const answerQuestion = useCallback(
    (answerIndex: number | null) => {
      if (!question || answerLockedRef.current) return;

      answerLockedRef.current = true;

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;

      const correct = answerIndex === question.answer;

      setSelectedAnswer(answerIndex);
      setAnswerCorrect(correct);
      setPhase("feedback");

      if (current?.human) {
        if (correct) {
          const points = difficultyPoints(question.difficulty);
          setCbtPoints((previous) => previous + points);
          setToast(`Correct answer! +${points} CBT Points.`);
        } else {
          setToast(
            answerIndex === null
              ? "Time is up. The turn passes."
              : "Incorrect answer. The turn passes.",
          );
        }
      }

      phaseTimerRef.current = setTimeout(() => {
        if (!correct) {
          advanceTurn("Incorrect answer or timeout. Turn passed.");
          return;
        }

        const legalMoves = getMoves(current, dice, []);

        if (!legalMoves.length) {
          advanceTurn("No legal moves are available. Turn passed.");
          return;
        }

        setMoves(legalMoves);
        setMessage("Correct! Choose a token move.");
        setPhase("move");
      }, current?.human ? 1100 : 500);
    },
    [advanceTurn, current, dice, getMoves, question],
  );

  // Question countdown applies to human questions only.
  useEffect(() => {
    if (phase !== "question" || !current?.human) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;

          // Schedule outside the state updater to avoid updating state inside it.
          phaseTimerRef.current = setTimeout(() => {
            answerQuestion(null);
          }, 0);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [answerQuestion, current?.human, phase]);

  const rollHumanDice = useCallback(() => {
    if (phase !== "rolling" || !current?.human || rollLockRef.current) {
      return;
    }

    rollLockRef.current = true;
    setPhase("diceResult");

    const first = randomDie();
    const second = randomDie();

    setDice([first, second]);

    phaseTimerRef.current = setTimeout(() => {
      if (balance < 2) {
        setToast("Demo wallet is too low. Reset the demo wallet to continue.");
        advanceTurn("Insufficient demo balance. Turn passed.");
        return;
      }

      setBalance((amount) => amount - 2);
      chooseQuestion();
      setPhase("question");
      rollLockRef.current = false;
    }, 1200);
  }, [advanceTurn, balance, chooseQuestion, current?.human, phase]);

  // Critical fix: automatically roll for every bot turn.
  // This prevents the game from remaining on "Bot is preparing its roll…".
  useEffect(() => {
    if (
      phase !== "rolling" ||
      !current ||
      current.human
    ) {
      return;
    }

    let cancelled = false;
    let rollTimer: ReturnType<typeof setTimeout> | undefined;
    let questionTimer: ReturnType<typeof setTimeout> | undefined;

    rollLockRef.current = true;

    rollTimer = setTimeout(() => {
      if (cancelled) return;

      const first = randomDie();
      const second = randomDie();

      setDice([first, second]);
      setPhase("diceResult");

      questionTimer = setTimeout(() => {
        if (cancelled) return;

        const pool =
          subject === "Mixed"
            ? QUESTIONS
            : QUESTIONS.filter((item) => item.subject === subject);

        const questionPool = pool.length ? pool : QUESTIONS;
        const available = questionPool.filter(
          (item) => !seenQuestions.includes(item.id),
        );

        const candidates = available.length ? available : questionPool;
        const chosen =
          candidates[Math.floor(Math.random() * candidates.length)];

        setQuestion(chosen);
        setSeenQuestions((previous) =>
          previous.includes(chosen.id)
            ? [chosen.id]
            : [...previous, chosen.id],
        );
        setQuestionCount((count) => count + 1);

        const botIsCorrect =
          botDifficulty === "Easy"
            ? Math.random() < 0.55
            : botDifficulty === "Hard"
              ? Math.random() < 0.9
              : Math.random() < 0.75;

        phaseTimerRef.current = setTimeout(() => {
          if (cancelled) return;

          if (!botIsCorrect) {
            setMessage(`${current.name} answered incorrectly. Turn passed.`);
            advanceTurn();
            return;
          }

          const legalMoves = getMoves(current, [first, second], []);

          if (!legalMoves.length) {
            setMessage(`${current.name} has no legal move. Turn passed.`);
            advanceTurn();
            return;
          }

          // Bots prefer bringing a token out, then capturing, then progressing.
          const selectedMove =
            legalMoves.find(
              (move) => current.tokens[move.tokenIndex].position === -1,
            ) ??
            legalMoves.find((move) => move.steps > 1) ??
            legalMoves[0];

          setPlayers((previous) =>
            previous.map((player) =>
              player.id === current.id
                ? {
                    ...player,
                    score:
                      player.score +
                      difficultyPoints(chosen.difficulty),
                  }
                : player,
            ),
          );

          setPhase("move");
          setMoves(legalMoves);
          setMessage(`${current.name} answered correctly.`);

          phaseTimerRef.current = setTimeout(() => {
            if (cancelled) return;
            applyMove(selectedMove);
          }, 650);
        }, 700);
      }, 1000);
    }, 900);

    return () => {
      cancelled = true;

      if (rollTimer) clearTimeout(rollTimer);
      if (questionTimer) clearTimeout(questionTimer);
    };
  }, [
    advanceTurn,
    applyMove,
    botDifficulty,
    current,
    getMoves,
    phase,
    seenQuestions,
    subject,
  ]);

  const startGame = useCallback(() => {
    clearTimers();
    setPlayers(makePlayers(humanColor));
    setTurn(0);
    setDice([1, 1]);
    setUsedDice([]);
    setQuestion(null);
    setSelectedAnswer(null);
    setAnswerCorrect(null);
    setQuestionCount(0);
    setSeenQuestions([]);
    setWinner(null);
    setMoves([]);
    setMessage("Match starting…");
    setCountdown(3);
    setPhase("countdown");
    rollLockRef.current = false;
    answerLockedRef.current = false;
    botActionRef.current = false;
  }, [clearTimers, humanColor]);

  useEffect(() => {
    if (phase !== "countdown") return;

    const timer = setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          clearInterval(timer);
          setPhase("rolling");
          return 0;
        }

        return value - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [phase]);

  const boardTokens = useMemo(() => {
    const mapped: {
      player: Player;
      tokenIndex: number;
      row: number;
      col: number;
      position: number;
    }[] = [];

    players.forEach((player) => {
      player.tokens.forEach((token, tokenIndex) => {
        if (token.position < 0 || token.position >= 52) return;

        const square =
          (START_OFFSETS[player.color] + token.position) % 52;
        const [row, col] = TRACK[square];

        mapped.push({
          player,
          tokenIndex,
          row,
          col,
          position: token.position,
        });
      });
    });

    return mapped;
  }, [players]);

  const winningPlayer = players.find((player) => player.id === winner);

  function renderBoard() {
    const cells = [];

    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const trackIndex = TRACK.findIndex(
          ([trackRow, trackCol]) => trackRow === row && trackCol === col,
        );

        const tokensHere = boardTokens.filter(
          (token) => token.row === row && token.col === col,
        );

        let background = "#f8fafc";
        let borderColor = "#e2e8f0";

        if (trackIndex !== -1) {
          const safe = SAFE_SQUARES.has(trackIndex);
          background = safe ? "#fef3c7" : "#ffffff";
          borderColor = safe ? "#d97706" : "#cbd5e1";
        }

        if (row < 6 && col < 6) background = COLORS.red.light;
        if (row < 6 && col > 8) background = COLORS.green.light;
        if (row > 8 && col < 6) background = COLORS.blue.light;
        if (row > 8 && col > 8) background = COLORS.yellow.light;

        if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
          background = "#f1f5f9";
        }

        const startColor = (Object.keys(START_OFFSETS) as Color[]).find(
          (color) => START_OFFSETS[color] === trackIndex,
        );

        if (startColor) background = COLORS[startColor].light;

        cells.push(
          <div
            key={`${row}-${col}`}
            className="relative flex aspect-square items-center justify-center border text-[8px] sm:text-[10px]"
            style={{ backgroundColor: background, borderColor }}
          >
            {row === 7 && col === 7 ? (
              <Trophy className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
            ) : trackIndex !== -1 && SAFE_SQUARES.has(trackIndex) ? (
              <ShieldCheck className="h-2.5 w-2.5 text-amber-600 sm:h-3 sm:w-3" />
            ) : null}

            {tokensHere.length > 0 && (
              <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5">
                {tokensHere.map((token) => (
                  <span
                    key={`${token.player.id}-${token.tokenIndex}`}
                    title={`${token.player.name}, token ${token.tokenIndex + 1}`}
                    className="flex h-3 w-3 items-center justify-center rounded-full border border-white text-[7px] font-black text-white shadow sm:h-4 sm:w-4 sm:text-[9px]"
                    style={{
                      backgroundColor: COLORS[token.player.color].main,
                      borderColor: COLORS[token.player.color].border,
                    }}
                  >
                    {token.tokenIndex + 1}
                  </span>
                ))}
              </div>
            )}
          </div>,
        );
      }
    }

    return cells;
  }

  const resetDemoWallet = () => {
    setBalance(1000);
    setToast("Demo wallet reset to ₦1,000.");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/student/games"
              className="rounded-xl border border-slate-200 bg-white p-2.5 hover:bg-slate-100"
              aria-label="Back to games"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Learnyfi Games
              </p>
              <h1 className="text-xl font-black sm:text-2xl">
                Educational Ludo
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3 py-2">
            <Wallet className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500">
                Demo wallet
              </p>
              <p className="text-sm font-black">
                ₦{balance.toLocaleString("en-NG")}
              </p>
            </div>
          </div>
        </header>

        {toast && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
            <span>{toast}</span>
            <button
              onClick={() => setToast("")}
              className="rounded-lg p-1 hover:bg-indigo-100"
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {phase === "lobby" ? (
          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 p-6 text-white shadow-lg sm:p-9">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Dice5 className="h-8 w-8" />
              </div>
              <h2 className="max-w-xl text-3xl font-black leading-tight sm:text-4xl">
                Roll the dice. Answer questions. Race to victory.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Play a solo match against three computer opponents. Answer
                educational questions correctly to unlock your moves and earn
                CBT Points.
              </p>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <BookOpen className="mb-2 h-5 w-5" />
                  <p className="text-lg font-black">15 sec</p>
                  <p className="text-xs text-indigo-100">Per question</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Zap className="mb-2 h-5 w-5" />
                  <p className="text-lg font-black">20–40</p>
                  <p className="text-xs text-indigo-100">CBT Points</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Trophy className="mb-2 h-5 w-5" />
                  <p className="text-lg font-black">+500</p>
                  <p className="text-xs text-indigo-100">Winner bonus</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-black">Set up your match</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose your subject and game preferences.
              </p>

              <label className="mt-5 block text-sm font-bold">Subject</label>
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
              >
                {SUBJECTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <label className="mt-4 block text-sm font-bold">
                Education level
              </label>
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option>Primary</option>
                <option>Secondary</option>
                <option>JAMB / UTME</option>
              </select>

              <label className="mt-4 block text-sm font-bold">
                Question difficulty
              </label>
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as Difficulty)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>

              <label className="mt-4 block text-sm font-bold">
                Bot difficulty
              </label>
              <select
                value={botDifficulty}
                onChange={(event) =>
                  setBotDifficulty(event.target.value as Difficulty)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>

              <label className="mt-4 block text-sm font-bold">
                Your token colour
              </label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {(["red", "green", "yellow", "blue"] as Color[]).map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setHumanColor(color)}
                      className={`rounded-xl border-2 p-3 text-xs font-bold capitalize ${
                        humanColor === color
                          ? "border-indigo-600 ring-2 ring-indigo-100"
                          : "border-slate-200"
                      }`}
                    >
                      <span
                        className="mx-auto mb-1 block h-5 w-5 rounded-full"
                        style={{ backgroundColor: COLORS[color].main }}
                      />
                      {color}
                    </button>
                  ),
                )}
              </div>

              <div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                This is a local demo. The ₦2 question charge and CBT Points
                are simulated in this browser and are not real payments or
                server-saved balances.
              </div>

              <button
                onClick={startGame}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-bold text-white hover:bg-indigo-700"
              >
                Start solo match
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </section>
        ) : (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
            <section className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {level} · {subject}
                  </p>
                  <h2 className="text-lg font-black">
                    {phase === "finished"
                      ? "Match completed"
                      : current
                        ? `${current.name}'s turn`
                        : "Preparing match"}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetDemoWallet}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"
                  >
                    Reset demo wallet
                  </button>
                  <button
                    onClick={() => {
                      clearTimers();
                      setPhase("lobby");
                    }}
                    className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
                    aria-label="Exit match"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
                <div className="mx-auto grid max-w-3xl grid-cols-15 gap-0">
                  {renderBoard()}
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
                  {(["red", "green", "yellow", "blue"] as Color[]).map(
                    (color) => {
                      const player = players.find((item) => item.color === color);
                      return (
                        <div key={color} className="flex items-center gap-1.5">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[color].main }}
                          />
                          <span className="font-semibold">
                            {player?.name ?? color}
                          </span>
                        </div>
                      );
                    },
                  )}
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-amber-600" />
                    Safe square
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`rounded-2xl border bg-white p-3 ${
                      current?.id === player.id
                        ? "border-indigo-500 ring-2 ring-indigo-100"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[player.color].main,
                        }}
                      />
                      <p className="truncate text-sm font-bold">
                        {player.name}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Home tokens:{" "}
                      {
                        player.tokens.filter((token) => token.position === 57)
                          .length
                      }
                      /4
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Score: {player.score}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-black">Dice roll</h3>
                  <Dice5 className="h-5 w-5 text-indigo-600" />
                </div>

                <div className="mt-4 flex items-center justify-center gap-4">
                  {dice.map((value, index) => (
                    <div
                      key={index}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-3xl font-black text-indigo-700"
                    >
                      {value}
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-center text-sm text-slate-500">
                  Total: <strong>{dice[0] + dice[1]}</strong>
                </p>

                {phase === "rolling" && isHumanTurn && (
                  <button
                    onClick={rollHumanDice}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Roll both dice
                  </button>
                )}

                {phase === "rolling" && !isHumanTurn && (
                  <div className="mt-4 rounded-xl bg-indigo-50 px-3 py-3 text-center text-sm font-semibold text-indigo-800">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                      {current?.name} is rolling automatically…
                    </span>
                  </div>
                )}

                {phase === "diceResult" && (
                  <div className="mt-4 rounded-xl bg-indigo-50 px-3 py-3 text-center text-sm font-semibold text-indigo-800">
                    Dice result: {dice[0]} + {dice[1]} = {dice[0] + dice[1]}
                    <p className="mt-1 text-xs font-normal">
                      Preparing the question…
                    </p>
                  </div>
                )}
              </div>

              {phase === "countdown" && (
                <div className="rounded-2xl bg-indigo-700 p-6 text-center text-white">
                  <p className="text-sm font-semibold">Get ready!</p>
                  <p className="mt-2 text-5xl font-black">{countdown || 1}</p>
                </div>
              )}

              {phase === "question" && question && (
                <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {question.subject}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-black text-rose-600">
                      <Clock3 className="h-4 w-4" />
                      {isHumanTurn ? `${timeLeft}s` : "Bot answering"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-black leading-6">
                    {question.text}
                  </h3>

                  <div className="mt-4 space-y-2">
                    {question.options.map((option, index) => {
                      const chosen = selectedAnswer === index;

                      return (
                        <button
                          key={option}
                          disabled={!isHumanTurn}
                          onClick={() => answerQuestion(index)}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
                            chosen
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                          } disabled:cursor-not-allowed`}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="font-medium">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!isHumanTurn && (
                    <p className="mt-3 text-xs text-slate-500">
                      The computer opponent is answering automatically.
                    </p>
                  )}
                </div>
              )}

              {phase === "feedback" && question && (
                <div
                  className={`rounded-2xl border p-5 ${
                    answerCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black">
                    {answerCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <X className="h-5 w-5 text-rose-600" />
                    )}
                    {answerCorrect ? "Correct answer!" : "Turn passed"}
                  </div>
                  <p className="mt-3 text-sm leading-6">
                    {question.explanation}
                  </p>
                </div>
              )}

              {phase === "move" && (
                <div className="rounded-2xl border border-emerald-200 bg-white p-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-black">
                      {isHumanTurn ? "Choose your move" : "Bot is moving"}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {message || "Select one of the legal moves."}
                  </p>

                  {isHumanTurn && (
                    <div className="mt-4 space-y-2">
                      {moves.map((move, index) => (
                        <button
                          key={`${move.tokenIndex}-${move.steps}-${index}`}
                          onClick={() => applyMove(move)}
                          className="w-full rounded-xl border border-slate-200 p-3 text-left text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50"
                        >
                          {move.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {!isHumanTurn && (
                    <p className="mt-3 text-sm text-indigo-700">
                      The bot will complete its move automatically.
                    </p>
                  )}
                </div>
              )}

              {phase === "finished" && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                    <Crown className="h-7 w-7 text-amber-600" />
                  </div>
                  <h3 className="mt-3 text-xl font-black">
                    {winningPlayer?.human
                      ? "You won the match!"
                      : `${winningPlayer?.name ?? "Player"} won!`}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {winningPlayer?.human
                      ? "You earned the 500 CBT Points winner bonus in this demo."
                      : "Good game! Start another match to try again."}
                  </p>
                  <button
                    onClick={() => setPhase("lobby")}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Play again
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="flex items-center gap-2 font-black">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                  Match rewards
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Easy answer</span>
                    <strong>+20 CBT Points</strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Medium answer</span>
                    <strong>+30 CBT Points</strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Hard answer</span>
                    <strong>+40 CBT Points</strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Capture</span>
                    <strong>+100 CBT Points</strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Winner</span>
                    <strong>+500 CBT Points</strong>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Your demo CBT Points</p>
                  <p className="mt-1 text-2xl font-black">
                    {cbtPoints.toLocaleString("en-NG")}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="flex items-center gap-2 font-black">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  Match summary
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Questions displayed</span>
                    <strong>{questionCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dice total</span>
                    <strong>{dice[0] + dice[1]}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Question fee</span>
                    <strong>₦2 demo</strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}












// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ArrowLeft,
//   Award,
//   Bot,
//   CheckCircle2,
//   Coins,
//   Dice5,
//   Flag,
//   History,
//   Loader2,
//   RotateCcw,
//   ShieldCheck,
//   Trophy,
//   Wallet,
//   X,
//   Zap,
// } from "lucide-react";

// import GameLobby, {
//   type EduLudoMode,
//   type EduLudoSubject,
//   type EduLudoLevel,
// } from "@/games/edu-ludo/GameLobby";

// import LudoBoard, {
//   type LudoBoardPlayer,
//   type LudoColor,
//   type LudoToken,
// } from "@/games/edu-ludo/LudoBoard";

// import QuestionModal, {
//   type EduLudoQuestion,
//   type QuestionAnswerResult,
// } from "@/games/edu-ludo/QuestionModal";

// import WalletPanel, {
//   type WalletTransaction,
// } from "@/games/edu-ludo/WalletPanel";

// export interface EduLudoGameProps {
//   initialBalance?: number;
//   initialCbtPoints?: number;
//   onBack?: () => void;
//   onFundWallet?: () => void;
// }

// interface GamePlayer extends LudoBoardPlayer {
//   isHuman: boolean;
// }

// const QUESTION_COST = 2;
// const QUESTION_TIME_LIMIT = 15;

// const COLORS: LudoColor[] = ["red", "green", "yellow", "blue"];

// const START_OFFSETS: Record<LudoColor, number> = {
//   red: 0,
//   green: 13,
//   blue: 26,
//   yellow: 39,
// };

// // Approximate safe spaces on the 52-square outer track.
// const SAFE_TRACK_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// const QUESTION_BANK: EduLudoQuestion[] = [
//   {
//     id: "math-001",
//     subject: "Mathematics",
//     level: "JAMB",
//     question: "What is 15% of 200?",
//     options: ["20", "25", "30", "35"],
//     correctAnswer: 2,
//     explanation: "15% of 200 = 0.15 × 200 = 30.",
//   },
//   {
//     id: "math-002",
//     subject: "Mathematics",
//     level: "JAMB",
//     question: "Solve for x: 3x + 5 = 20.",
//     options: ["3", "5", "8", "15"],
//     correctAnswer: 1,
//     explanation: "Subtract 5 from both sides, then divide 15 by 3.",
//   },
//   {
//     id: "math-003",
//     subject: "Mathematics",
//     level: "SSS",
//     question: "What is the square root of 144?",
//     options: ["10", "11", "12", "14"],
//     correctAnswer: 2,
//     explanation: "12 × 12 = 144.",
//   },
//   {
//     id: "math-004",
//     subject: "Mathematics",
//     level: "JSS",
//     question: "Express 0.75 as a fraction in its simplest form.",
//     options: ["1/2", "2/3", "3/4", "4/5"],
//     correctAnswer: 2,
//     explanation: "0.75 = 75/100 = 3/4.",
//   },
//   {
//     id: "eng-001",
//     subject: "English",
//     level: "JAMB",
//     question: "Choose the word nearest in meaning to 'diligent'.",
//     options: ["Careless", "Hardworking", "Impatient", "Weak"],
//     correctAnswer: 1,
//     explanation: "A diligent person is careful and hardworking.",
//   },
//   {
//     id: "eng-002",
//     subject: "English",
//     level: "SSS",
//     question: "Which word is an adjective?",
//     options: ["Quickly", "Beauty", "Beautiful", "Beautify"],
//     correctAnswer: 2,
//     explanation: "'Beautiful' describes a noun, so it is an adjective.",
//   },
//   {
//     id: "eng-003",
//     subject: "English",
//     level: "JSS",
//     question: "What is the plural of 'child'?",
//     options: ["Childs", "Childes", "Children", "Childrens"],
//     correctAnswer: 2,
//     explanation: "The correct plural form of child is children.",
//   },
//   {
//     id: "eng-004",
//     subject: "English",
//     level: "JAMB",
//     question: "Choose the correctly spelt word.",
//     options: ["Accomodation", "Acommodation", "Accommodation", "Acomodation"],
//     correctAnswer: 2,
//     explanation: "'Accommodation' has double c and double m.",
//   },
//   {
//     id: "sci-001",
//     subject: "Science",
//     level: "JSS",
//     question: "Which organ pumps blood around the human body?",
//     options: ["Liver", "Heart", "Lung", "Kidney"],
//     correctAnswer: 1,
//     explanation: "The heart pumps blood through the circulatory system.",
//   },
//   {
//     id: "sci-002",
//     subject: "Science",
//     level: "JSS",
//     question: "Which gas do plants absorb during photosynthesis?",
//     options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
//     correctAnswer: 2,
//     explanation: "Plants use carbon dioxide and water to make glucose.",
//   },
//   {
//     id: "bio-001",
//     subject: "Biology",
//     level: "JAMB",
//     question: "What is the basic structural and functional unit of life?",
//     options: ["Tissue", "Organ", "Cell", "Nucleus"],
//     correctAnswer: 2,
//     explanation: "The cell is the basic unit of living organisms.",
//   },
//   {
//     id: "bio-002",
//     subject: "Biology",
//     level: "SSS",
//     question: "Which organelle is primarily responsible for photosynthesis?",
//     options: ["Mitochondrion", "Chloroplast", "Ribosome", "Lysosome"],
//     correctAnswer: 1,
//     explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis.",
//   },
//   {
//     id: "chem-001",
//     subject: "Chemistry",
//     level: "JAMB",
//     question: "What is the chemical symbol for sodium?",
//     options: ["S", "So", "Na", "N"],
//     correctAnswer: 2,
//     explanation: "Na comes from the Latin name natrium.",
//   },
//   {
//     id: "chem-002",
//     subject: "Chemistry",
//     level: "SSS",
//     question: "A solution with a pH of 2 is best described as:",
//     options: ["Strongly acidic", "Neutral", "Weakly alkaline", "Strongly alkaline"],
//     correctAnswer: 0,
//     explanation: "A pH below 7 is acidic; a pH of 2 is strongly acidic.",
//   },
//   {
//     id: "phys-001",
//     subject: "Physics",
//     level: "JAMB",
//     question: "What is the SI unit of force?",
//     options: ["Joule", "Watt", "Newton", "Pascal"],
//     correctAnswer: 2,
//     explanation: "Force is measured in newtons (N).",
//   },
//   {
//     id: "phys-002",
//     subject: "Physics",
//     level: "SSS",
//     question: "Which instrument measures electric current?",
//     options: ["Voltmeter", "Ammeter", "Barometer", "Thermometer"],
//     correctAnswer: 1,
//     explanation: "An ammeter measures electric current.",
//   },
// ];

// function makeInitialPlayers(mode: EduLudoMode): GamePlayer[] {
//   const names: Record<LudoColor, string> = {
//     red: "You",
//     green: mode === "solo" ? "Bot Green" : "Player 2",
//     yellow: mode === "solo" ? "Bot Yellow" : "Player 3",
//     blue: mode === "solo" ? "Bot Blue" : "Player 4",
//   };

//   return COLORS.map((color, playerIndex) => ({
//     id: color,
//     name: names[color],
//     color,
//     isHuman: mode !== "solo" || playerIndex === 0,
//     tokens: Array.from({ length: 4 }, (_, index) => ({
//       id: `${color}-${index + 1}`,
//       position: -1,
//       finished: false,
//     })),
//   }));
// }

// function formatNaira(amount: number) {
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 2,
//   }).format(amount);
// }

// function getGlobalTrackPosition(player: GamePlayer, position: number) {
//   return (position + START_OFFSETS[player.color]) % 52;
// }

// function getEligibleTokens(
//   player: GamePlayer,
//   dice: number,
// ): LudoToken[] {
//   return player.tokens.filter((token) => {
//     if (token.finished || token.position === 57) return false;

//     if (token.position === -1) {
//       return dice === 6;
//     }

//     return token.position >= 0 && token.position + dice <= 57;
//   });
// }

// function getQuestionForSubject(
//   subject: EduLudoSubject,
// ): EduLudoQuestion {
//   const matching =
//     subject === "All Subjects" || subject === "Science"
//       ? QUESTION_BANK.filter((question) =>
//           subject === "All Subjects"
//             ? true
//             : ["Science", "Biology", "Chemistry", "Physics"].includes(
//                 question.subject,
//               ),
//         )
//       : QUESTION_BANK.filter((question) => question.subject === subject);

//   const pool = matching.length > 0 ? matching : QUESTION_BANK;
//   const question = pool[Math.floor(Math.random() * pool.length)];

//   // Unique ID ensures the modal resets even when a question repeats.
//   return {
//     ...question,
//     id: `${question.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
//   };
// }

// export default function EduLudoGame({
//   initialBalance = 500,
//   initialCbtPoints = 0,
//   onBack,
//   onFundWallet,
// }: EduLudoGameProps) {
//   const [balance, setBalance] = useState(Math.max(0, initialBalance));
//   const [cbtPoints, setCbtPoints] = useState(
//     Math.max(0, initialCbtPoints),
//   );

//   const [mode, setMode] = useState<EduLudoMode>("solo");
//   const [subject, setSubject] =
//     useState<EduLudoSubject>("All Subjects");
//   const [level, setLevel] = useState<EduLudoLevel>("JAMB");

//   const [started, setStarted] = useState(false);
//   const [gameOver, setGameOver] = useState(false);
//   const [players, setPlayers] = useState<GamePlayer[]>(() =>
//     makeInitialPlayers("solo"),
//   );
//   const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

//   const [diceValue, setDiceValue] = useState<number | null>(null);
//   const [pendingRoll, setPendingRoll] = useState<number | null>(null);
//   const [question, setQuestion] = useState<EduLudoQuestion | null>(null);
//   const [questionNumber, setQuestionNumber] = useState(0);
//   const [awaitingMove, setAwaitingMove] = useState(false);
//   const [selectedTokenId, setSelectedTokenId] = useState<string | null>(
//     null,
//   );

//   const [statusMessage, setStatusMessage] = useState(
//     "Choose a game mode to begin.",
//   );
//   const [lastFeedback, setLastFeedback] = useState<string | null>(null);
//   const [winner, setWinner] = useState<GamePlayer | null>(null);
//   const [transactions, setTransactions] = useState<WalletTransaction[]>(
//     [],
//   );
//   const [showTransactions, setShowTransactions] = useState(false);
//   const [isBotThinking, setIsBotThinking] = useState(false);

//   const currentPlayer = players[currentPlayerIndex];

//   const humanPlayer = players.find((player) => player.id === "red");

//   const currentEligibleTokens = useMemo(() => {
//     if (!currentPlayer || pendingRoll === null) return [];

//     return getEligibleTokens(currentPlayer, pendingRoll);
//   }, [currentPlayer, pendingRoll]);

//   const startGame = useCallback(() => {
//     const freshPlayers = makeInitialPlayers(mode);

//     setPlayers(freshPlayers);
//     setCurrentPlayerIndex(0);
//     setDiceValue(null);
//     setPendingRoll(null);
//     setQuestion(null);
//     setQuestionNumber(0);
//     setAwaitingMove(false);
//     setSelectedTokenId(null);
//     setWinner(null);
//     setGameOver(false);
//     setStarted(true);
//     setIsBotThinking(false);
//     setLastFeedback(null);
//     setStatusMessage(
//       "Your turn! Roll the dice to receive a question.",
//     );
//   }, [mode]);

//   const advanceTurn = useCallback(
//     (extraTurn = false) => {
//       setAwaitingMove(false);
//       setSelectedTokenId(null);
//       setPendingRoll(null);
//       setQuestion(null);

//       if (extraTurn && !gameOver) {
//         setStatusMessage(
//           `${players[currentPlayerIndex]?.name} earned an extra turn! Roll again.`,
//         );
//         return;
//       }

//       setCurrentPlayerIndex((index) => (index + 1) % players.length);
//       setDiceValue(null);
//       setStatusMessage("Next player's turn.");
//     },
//     [currentPlayerIndex, gameOver, players],
//   );

//   const moveToken = useCallback(
//     (playerIndex: number, tokenId: string, dice: number) => {
//       const player = players[playerIndex];
//       if (!player || gameOver) return;

//       const token = player.tokens.find((item) => item.id === tokenId);
//       if (!token || token.finished || token.position === 57) return;

//       if (token.position === -1 && dice !== 6) {
//         setStatusMessage("You need a six to bring a token out of base.");
//         return;
//       }

//       const nextPosition = token.position === -1 ? 0 : token.position + dice;

//       if (nextPosition > 57) {
//         setStatusMessage("You need the exact number to reach HOME.");
//         advanceTurn(dice === 6);
//         return;
//       }

//       const nextPlayers = players.map((item) => ({
//         ...item,
//         tokens: item.tokens.map((existingToken) => ({
//           ...existingToken,
//         })),
//       }));

//       const movingPlayer = nextPlayers[playerIndex];
//       const movingToken = movingPlayer.tokens.find(
//         (item) => item.id === tokenId,
//       );

//       if (!movingToken) return;

//       movingToken.position = nextPosition;
//       movingToken.finished = nextPosition === 57;

//       let capturedCount = 0;

//       // Captures apply only while the moving token is on the outer track.
//       if (nextPosition >= 0 && nextPosition <= 51) {
//         const landingPosition = getGlobalTrackPosition(
//           movingPlayer,
//           nextPosition,
//         );

//         const isSafe = SAFE_TRACK_POSITIONS.has(landingPosition);

//         if (!isSafe) {
//           nextPlayers.forEach((opponent, opponentIndex) => {
//             if (opponentIndex === playerIndex) return;

//             opponent.tokens.forEach((opponentToken) => {
//               if (
//                 opponentToken.position >= 0 &&
//                 opponentToken.position <= 51 &&
//                 getGlobalTrackPosition(
//                   opponent,
//                   opponentToken.position,
//                 ) === landingPosition
//               ) {
//                 opponentToken.position = -1;
//                 opponentToken.finished = false;
//                 capturedCount += 1;
//               }
//             });
//           });
//         }
//       }

//       setPlayers(nextPlayers);
//       setSelectedTokenId(null);
//       setAwaitingMove(false);
//       setPendingRoll(null);

//       if (capturedCount > 0) {
//         setCbtPoints((points) => points + 200 * capturedCount);
//         setLastFeedback(
//           `Capture bonus! ${capturedCount} opposing token${
//             capturedCount === 1 ? "" : "s"
//           } sent home. +${200 * capturedCount} CBT Points.`,
//         );
//       }

//       if (movingToken.finished) {
//         setCbtPoints((points) => points + 500);
//         setLastFeedback("Token HOME! +500 CBT Points.");
//       }

//       const allTokensFinished = movingPlayer.tokens.every(
//         (item) => item.finished || item.position === 57,
//       );

//       if (allTokensFinished) {
//         setWinner(movingPlayer);
//         setGameOver(true);
//         setStarted(false);
//         setCbtPoints((points) => points + 1000);
//         setStatusMessage(
//           `${movingPlayer.name} wins the Learnyfi Educational Ludo game!`,
//         );
//         return;
//       }

//       if (capturedCount > 0) {
//         setStatusMessage(
//           `${movingPlayer.name} captured a token and earned an extra turn!`,
//         );
//         setDiceValue(null);
//         return;
//       }

//       if (dice === 6) {
//         setStatusMessage(
//           `${movingPlayer.name} rolled a six and earned an extra turn!`,
//         );
//         setDiceValue(null);
//         return;
//       }

//       advanceTurn(false);
//     },
//     [advanceTurn, gameOver, players],
//   );

//   const handleQuestionAnswer = useCallback(
//     (result: QuestionAnswerResult) => {
//       const roll = pendingRoll;
//       const player = players[currentPlayerIndex];

//       setQuestion(null);

//       if (!player || roll === null || !player.isHuman) {
//         setStatusMessage("The game turn could not be validated.");
//         advanceTurn(false);
//         return;
//       }

//       if (result.correct) {
//         setCbtPoints((points) => points + 50);
//         setLastFeedback("Correct answer! +50 CBT Points.");

//         const eligible = getEligibleTokens(player, roll);

//         if (eligible.length > 0) {
//           setAwaitingMove(true);
//           setStatusMessage(
//             roll === 6
//               ? "Correct! You rolled a six. Choose a token to move."
//               : "Correct answer! Choose one of your eligible tokens.",
//           );
//         } else {
//           setStatusMessage(
//             roll === 6
//               ? "Correct! No token can move with this roll."
//               : "Correct, but no token can move. Your turn ends.",
//           );
//           advanceTurn(roll === 6);
//         }
//       } else {
//         setLastFeedback(
//           result.timedOut
//             ? "Time expired. No move this turn."
//             : "Incorrect answer. No move this turn.",
//         );
//         setStatusMessage(
//           result.timedOut
//             ? "Time is up. Your turn has ended."
//             : "Incorrect answer. Your turn has ended.",
//         );
//         advanceTurn(false);
//       }
//     },
//     [advanceTurn, currentPlayerIndex, pendingRoll, players],
//   );

//   const rollDiceAndPresentQuestion = useCallback(() => {
//     if (!started || gameOver || question || awaitingMove || !currentPlayer) {
//       return;
//     }

//     if (!currentPlayer.isHuman) return;

//     if (balance < QUESTION_COST) {
//       setStatusMessage(
//         `Your balance is too low. Add funds to pay the ${formatNaira(
//           QUESTION_COST,
//         )} question fee.`,
//       );
//       return;
//     }

//     const roll = Math.floor(Math.random() * 6) + 1;
//     const nextQuestion = getQuestionForSubject(subject);
//     const now = new Date();

//     // Frontend demo only. Production charging must be done by the backend
//     // with an idempotent request when the question is actually presented.
//     setBalance((current) => Math.max(0, current - QUESTION_COST));
//     setTransactions((items) => [
//       {
//         id: `demo-debit-${Date.now()}`,
//         type: "debit",
//         amount: QUESTION_COST,
//         description: "Educational Ludo question fee",
//         createdAt: now,
//         status: "successful",
//         reference: `DEMO-${Date.now()}`,
//       },
//       ...items,
//     ]);

//     setDiceValue(roll);
//     setPendingRoll(roll);
//     setQuestionNumber((number) => number + 1);
//     setQuestion(nextQuestion);
//     setLastFeedback(null);
//     setStatusMessage(
//       `You rolled ${roll}. Answer the question to move your token.`,
//     );
//   }, [
//     awaitingMove,
//     balance,
//     currentPlayer,
//     gameOver,
//     question,
//     started,
//     subject,
//   ]);

//   const handleTokenClick = useCallback(
//     (playerId: string, tokenId: string) => {
//       if (!started || !awaitingMove || !currentPlayer) return;
//       if (playerId !== currentPlayer.id) return;
//       if (pendingRoll === null) return;

//       const token = currentPlayer.tokens.find(
//         (item) => item.id === tokenId,
//       );

//       if (!token) return;

//       const eligible = getEligibleTokens(currentPlayer, pendingRoll);

//       if (!eligible.some((item) => item.id === tokenId)) {
//         setLastFeedback(null);
//         setStatusMessage(
//           token.position === -1
//             ? "This token needs a six to leave its base."
//             : "That token cannot move with the current dice roll.",
//         );
//         return;
//       }

//       setSelectedTokenId(tokenId);
//       moveToken(currentPlayerIndex, tokenId, pendingRoll);
//     },
//     [
//       awaitingMove,
//       currentPlayer,
//       currentPlayerIndex,
//       moveToken,
//       pendingRoll,
//       started,
//     ],
//   );

//   // Basic local bot opponents. Bots simulate their own questions; they do not
//   // deduct the human player's wallet balance for a bot's turn.
//   useEffect(() => {
//     if (
//       !started ||
//       gameOver ||
//       question ||
//       awaitingMove ||
//       !currentPlayer ||
//       currentPlayer.isHuman
//     ) {
//       setIsBotThinking(false);
//       return;
//     }

//     setIsBotThinking(true);
//     setStatusMessage(`${currentPlayer.name} is thinking...`);

//     const timeout = window.setTimeout(() => {
//       const bot = players[currentPlayerIndex];
//       if (!bot) {
//         setIsBotThinking(false);
//         return;
//       }

//       const botRoll = Math.floor(Math.random() * 6) + 1;
//       setDiceValue(botRoll);

//       // Simulated bot knowledge score for this local prototype.
//       const botAnsweredCorrectly = Math.random() < 0.7;

//       if (!botAnsweredCorrectly) {
//         setLastFeedback(`${bot.name} answered incorrectly.`);
//         setIsBotThinking(false);
//         advanceTurn(false);
//         return;
//       }

//       const eligible = getEligibleTokens(bot, botRoll);

//       if (eligible.length === 0) {
//         setLastFeedback(`${bot.name} has no eligible token to move.`);
//         setIsBotThinking(false);
//         advanceTurn(botRoll === 6);
//         return;
//       }

//       const token =
//         eligible[Math.floor(Math.random() * eligible.length)];

//       setLastFeedback(`${bot.name} answered correctly.`);
//       setIsBotThinking(false);
//       moveToken(currentPlayerIndex, token.id, botRoll);
//     }, 1100);

//     return () => window.clearTimeout(timeout);
//   }, [
//     advanceTurn,
//     awaitingMove,
//     currentPlayer,
//     currentPlayerIndex,
//     gameOver,
//     moveToken,
//     players,
//     question,
//     started,
//   ]);

//   const resetToLobby = useCallback(() => {
//     setStarted(false);
//     setGameOver(false);
//     setWinner(null);
//     setQuestion(null);
//     setAwaitingMove(false);
//     setPendingRoll(null);
//     setDiceValue(null);
//     setSelectedTokenId(null);
//     setIsBotThinking(false);
//     setStatusMessage("Choose a game mode to begin.");
//   }, []);

//   const allTransactions = transactions;

//   return (
//     <main className="min-h-screen bg-slate-50 pb-10">
//       {/* Page heading */}
//       <header className="border-b border-slate-200 bg-white">
//         <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex min-w-0 items-center gap-3">
//             {onBack && (
//               <button
//                 type="button"
//                 onClick={onBack}
//                 aria-label="Go back"
//                 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
//               >
//                 <ArrowLeft size={19} />
//               </button>
//             )}

//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-700 text-white shadow-sm">
//               <Dice5 size={24} />
//             </div>

//             <div className="min-w-0">
//               <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
//                 Learnyfi Educational Ludo
//               </h1>
//               <p className="hidden text-xs text-slate-500 sm:block">
//                 Learn, answer questions, and race your tokens HOME.
//               </p>
//             </div>
//           </div>

//           <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
//             <Wallet size={16} className="text-violet-700" />
//             <span className="text-sm font-extrabold text-slate-900">
//               {formatNaira(balance)}
//             </span>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
//         {/* Lobby */}
//         {!started && !gameOver && (
//           <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
//             <div>
//               <GameLobby
//                 balance={balance}
//                 mode={mode}
//                 subject={subject}
//                 level={level}
//                 onModeChange={setMode}
//                 onSubjectChange={setSubject}
//                 onLevelChange={setLevel}
//                 onStart={startGame}
//                 onFundWallet={onFundWallet}
//               />

//               <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
//                 <div className="flex items-start gap-3">
//                   <ShieldCheck
//                     size={20}
//                     className="mt-0.5 shrink-0 text-blue-700"
//                   />
//                   <div>
//                     <h3 className="font-bold text-blue-950">
//                       How the game works
//                     </h3>
//                     <p className="mt-1 text-sm leading-6 text-blue-900">
//                       Roll the dice, answer a question correctly, and move an
//                       eligible token. A question costs ₦2 when presented.
//                       Incorrect answers and timeouts end your turn. Roll a six
//                       to bring a token out of base.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-5">
//               <WalletPanel
//                 balance={balance}
//                 cbtPoints={cbtPoints}
//                 questionCost={QUESTION_COST}
//                 transactions={transactions}
//                 onFundWallet={onFundWallet}
//                 onViewTransactions={() => setShowTransactions(true)}
//               />

//               <div className="rounded-2xl border border-slate-200 bg-white p-5">
//                 <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
//                   <Award size={19} className="text-violet-700" />
//                   Demo rewards
//                 </h3>

//                 <ul className="mt-4 space-y-3 text-sm">
//                   <li className="flex items-center justify-between gap-3">
//                     <span className="text-slate-600">Correct answer</span>
//                     <span className="font-extrabold text-amber-700">
//                       +50 CBT
//                     </span>
//                   </li>
//                   <li className="flex items-center justify-between gap-3">
//                     <span className="text-slate-600">Capture an opponent</span>
//                     <span className="font-extrabold text-amber-700">
//                       +200 CBT
//                     </span>
//                   </li>
//                   <li className="flex items-center justify-between gap-3">
//                     <span className="text-slate-600">Token reaches HOME</span>
//                     <span className="font-extrabold text-amber-700">
//                       +500 CBT
//                     </span>
//                   </li>
//                   <li className="flex items-center justify-between gap-3">
//                     <span className="text-slate-600">Win the game</span>
//                     <span className="font-extrabold text-amber-700">
//                       +1,000 CBT
//                     </span>
//                   </li>
//                 </ul>

//                 <p className="mt-4 text-xs leading-5 text-slate-500">
//                   These are prototype reward values. Enforce reward limits
//                   and eligibility on your backend before production use.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Active game */}
//         {started && !gameOver && (
//           <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
//             <section className="min-w-0">
//               <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
//                 <div className="flex flex-wrap items-start justify-between gap-3">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
//                         {mode === "solo"
//                           ? "Solo vs Bots"
//                           : mode === "friends"
//                             ? "Play with Friends · Local Demo"
//                             : mode === "classroom"
//                               ? "Classroom · Local Demo"
//                               : "Tournament · Local Demo"}
//                       </span>
//                       <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
//                         {level}
//                       </span>
//                     </div>

//                     <h2 className="mt-3 text-xl font-black text-slate-900">
//                       {currentPlayer?.name ?? "Your game"}
//                       {"'s turn"}
//                     </h2>

//                     <p className="mt-1 text-sm text-slate-500">
//                       Subject: {subject}
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={resetToLobby}
//                     className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
//                   >
//                     <RotateCcw size={15} />
//                     Exit game
//                   </button>
//                 </div>

//                 <div
//                   role="status"
//                   aria-live="polite"
//                   className="mt-4 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-3"
//                 >
//                   {isBotThinking ? (
//                     <Loader2
//                       size={18}
//                       className="mt-0.5 shrink-0 animate-spin text-violet-700"
//                     />
//                   ) : (
//                     <Zap
//                       size={18}
//                       className="mt-0.5 shrink-0 text-violet-700"
//                     />
//                   )}

//                   <div className="min-w-0">
//                     <p className="text-sm font-bold text-violet-950">
//                       {statusMessage}
//                     </p>

//                     {lastFeedback && (
//                       <p className="mt-1 text-xs leading-5 text-violet-800">
//                         {lastFeedback}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
//                 <LudoBoard
//                   players={players}
//                   currentPlayerId={currentPlayer?.id ?? "red"}
//                   selectedTokenId={selectedTokenId}
//                   onTokenClick={handleTokenClick}
//                   disabled={
//                     !awaitingMove ||
//                     Boolean(question) ||
//                     !currentPlayer?.isHuman
//                   }
//                 />
//               </div>

//               {/* Dice and turn controls */}
//               <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
//                 <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-800">
//                       <Dice5 size={32} />
//                     </div>

//                     <div>
//                       <p className="text-sm font-extrabold text-slate-900">
//                         {diceValue
//                           ? `Dice rolled: ${diceValue}`
//                           : "Ready to roll?"}
//                       </p>
//                       <p className="mt-1 text-xs text-slate-500">
//                         {awaitingMove
//                           ? `${currentEligibleTokens.length} eligible token(s)`
//                           : question
//                             ? "Answer the question to move."
//                             : currentPlayer?.isHuman
//                               ? "Each presented question costs ₦2."
//                               : "Bot turn in progress."}
//                       </p>
//                     </div>
//                   </div>

//                   {currentPlayer?.isHuman &&
//                     !question &&
//                     !awaitingMove && (
//                       <button
//                         type="button"
//                         onClick={rollDiceAndPresentQuestion}
//                         disabled={
//                           !started ||
//                           gameOver ||
//                           isBotThinking ||
//                           balance < QUESTION_COST
//                         }
//                         className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-700/20 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
//                       >
//                         <Dice5 size={19} />
//                         Roll Dice & Answer
//                       </button>
//                     )}

//                   {awaitingMove && currentPlayer?.isHuman && (
//                     <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800 sm:w-auto">
//                       <CheckCircle2 size={18} />
//                       Tap an eligible token
//                     </div>
//                   )}
//                 </div>

//                 {balance < QUESTION_COST &&
//                   currentPlayer?.isHuman &&
//                   !question &&
//                   !awaitingMove && (
//                     <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center">
//                       <p className="text-sm leading-5 text-amber-900">
//                         Your balance is below the {formatNaira(QUESTION_COST)}{" "}
//                         question fee.
//                       </p>
//                       {onFundWallet && (
//                         <button
//                           type="button"
//                           onClick={onFundWallet}
//                           className="rounded-lg bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800"
//                         >
//                           Fund Wallet
//                         </button>
//                       )}
//                     </div>
//                   )}
//               </div>
//             </section>

//             {/* Right sidebar */}
//             <aside className="space-y-5">
//               <WalletPanel
//                 balance={balance}
//                 cbtPoints={cbtPoints}
//                 questionCost={QUESTION_COST}
//                 transactions={transactions}
//                 onFundWallet={onFundWallet}
//                 onViewTransactions={() => setShowTransactions(true)}
//                 compact
//               />

//               <div className="rounded-2xl border border-slate-200 bg-white p-5">
//                 <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
//                   <Flag size={18} className="text-violet-700" />
//                   Players
//                 </h3>

//                 <div className="mt-4 space-y-3">
//                   {players.map((player) => {
//                     const colorClasses: Record<LudoColor, string> = {
//                       red: "bg-red-500",
//                       green: "bg-green-500",
//                       yellow: "bg-yellow-400",
//                       blue: "bg-blue-500",
//                     };

//                     const finished = player.tokens.filter(
//                       (token) => token.finished || token.position === 57,
//                     ).length;

//                     return (
//                       <div
//                         key={player.id}
//                         className={`flex items-center gap-3 rounded-xl border p-3 ${
//                           player.id === currentPlayer?.id
//                             ? "border-violet-300 bg-violet-50"
//                             : "border-slate-100 bg-slate-50"
//                         }`}
//                       >
//                         <span
//                           className={`h-3 w-3 shrink-0 rounded-full ${colorClasses[player.color]}`}
//                         />

//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-bold text-slate-800">
//                             {player.name}
//                           </p>
//                           <p className="mt-0.5 text-xs text-slate-500">
//                             {finished}/4 tokens HOME
//                           </p>
//                         </div>

//                         {player.isHuman ? (
//                           <ShieldCheck
//                             size={16}
//                             className="text-violet-700"
//                             aria-label="Human player"
//                           />
//                         ) : (
//                           <Bot
//                             size={16}
//                             className="text-slate-400"
//                             aria-label="Bot player"
//                           />
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-5">
//                 <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
//                   <Coins size={18} className="text-amber-600" />
//                   Game rules
//                 </h3>

//                 <ul className="mt-4 space-y-3 text-xs leading-5 text-slate-600">
//                   <li>• Each human question costs ₦2 when presented.</li>
//                   <li>• Correct answers earn 50 demo CBT Points.</li>
//                   <li>• A six is needed to leave the starting base.</li>
//                   <li>• Captures and rolling a six grant extra turns.</li>
//                   <li>• Tokens need an exact roll to reach HOME.</li>
//                   <li>• Get all four tokens HOME to win.</li>
//                 </ul>
//               </div>
//             </aside>
//           </div>
//         )}

//         {/* Winner screen */}
//         {gameOver && winner && (
//           <section className="mx-auto max-w-xl">
//             <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white text-center shadow-xl">
//               <div className="bg-gradient-to-br from-violet-800 to-indigo-700 px-6 py-10 text-white">
//                 <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
//                   <Trophy size={42} className="text-amber-300" />
//                 </div>

//                 <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
//                   Game completed
//                 </p>

//                 <h2 className="mt-2 text-3xl font-black">
//                   {winner.name} wins!
//                 </h2>

//                 <p className="mt-3 text-sm leading-6 text-violet-100">
//                   All four tokens have reached HOME.
//                 </p>
//               </div>

//               <div className="p-6 sm:p-8">
//                 <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
//                   <p className="text-sm font-semibold text-amber-900">
//                     Winner reward (demo)
//                   </p>
//                   <p className="mt-2 text-3xl font-black text-amber-800">
//                     +1,000 CBT Points
//                   </p>
//                   <p className="mt-2 text-xs text-amber-800">
//                     Your current demo balance is {cbtPoints.toLocaleString()}{" "}
//                     CBT Points.
//                   </p>
//                 </div>

//                 <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                   <button
//                     type="button"
//                     onClick={startGame}
//                     className="flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-extrabold text-white transition hover:bg-violet-800"
//                   >
//                     <RotateCcw size={18} />
//                     Play Again
//                   </button>

//                   <button
//                     type="button"
//                     onClick={resetToLobby}
//                     className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
//                   >
//                     Back to Lobby
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}
//       </div>

//       {/* Transaction history dialog */}
//       {showTransactions && (
//         <div
//           className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="transaction-dialog-title"
//         >
//           <div className="max-h-[85vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-5">
//               <div>
//                 <h2
//                   id="transaction-dialog-title"
//                   className="font-extrabold text-slate-900"
//                 >
//                   Wallet transactions
//                 </h2>
//                 <p className="mt-1 text-xs text-slate-500">
//                   Local demo history
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setShowTransactions(false)}
//                 aria-label="Close transaction history"
//                 className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
//               >
//                 <X size={19} />
//               </button>
//             </div>

//             <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5">
//               {allTransactions.length === 0 ? (
//                 <div className="py-10 text-center">
//                   <History
//                     size={28}
//                     className="mx-auto text-slate-300"
//                   />
//                   <p className="mt-3 text-sm font-bold text-slate-700">
//                     No transactions yet
//                   </p>
//                   <p className="mt-1 text-xs text-slate-500">
//                     Question-fee demo entries will appear here.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {allTransactions.map((transaction) => (
//                     <div
//                       key={transaction.id}
//                       className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
//                     >
//                       <div className="min-w-0">
//                         <p className="text-sm font-bold text-slate-800">
//                           {transaction.description}
//                         </p>
//                         <p className="mt-1 text-xs text-slate-500">
//                           {new Intl.DateTimeFormat("en-NG", {
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           }).format(new Date(transaction.createdAt))}
//                         </p>
//                         {transaction.reference && (
//                           <p className="mt-1 break-all text-[10px] text-slate-400">
//                             {transaction.reference}
//                           </p>
//                         )}
//                       </div>

//                       <p className="shrink-0 text-sm font-extrabold text-red-600">
//                         −{formatNaira(transaction.amount)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
//                 These entries are stored in browser memory only. They are not
//                 verified payment records.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Question modal */}
//       {question && (
//         <QuestionModal
//           question={question}
//           questionNumber={questionNumber}
//           totalQuestions={20}
//           timeLimit={QUESTION_TIME_LIMIT}
//           questionCost={QUESTION_COST}
//           onAnswer={handleQuestionAnswer}
//           showExplanation
//         />
//       )}

//       {/* Balance reminder */}
//       {started && balance < QUESTION_COST && !question && (
//         <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
//           <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-amber-200 bg-white p-3 shadow-xl">
//             <Wallet size={20} className="shrink-0 text-amber-700" />
//             <p className="flex-1 text-xs font-semibold leading-5 text-slate-700">
//               Your demo balance cannot cover another question.
//             </p>
//             {onFundWallet && (
//               <button
//                 type="button"
//                 onClick={onFundWallet}
//                 className="shrink-0 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white"
//               >
//                 Fund
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* The initial player reference is intentionally kept for future
//           backend integration with the authenticated player's identity. */}
//       {humanPlayer && null}
//     </main>
//   );
// }
