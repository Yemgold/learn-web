"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Award, BookOpen, CheckCircle2, ChevronRight, CircleHelp,
  Coins, Crown, Dice5, Flag, History, Info, Loader2, LockKeyhole,
  RotateCcw, ShieldCheck, Sparkles, Trophy, Wallet, X, Zap,
} from "lucide-react";

export type EduLudoMode = "solo" | "friends" | "classroom" | "tournament";
export type EduLudoColor = "red" | "green" | "yellow" | "blue";

type Level = "JSS" | "SSS" | "JAMB" | "WAEC" | "Custom";
type Subject =
  | "All Subjects" | "Mathematics" | "English" | "Science"
  | "Biology" | "Chemistry" | "Physics";
type Difficulty = "Easy" | "Medium" | "Hard";
type Token = { id: string; position: number; finished: boolean };
type Player = {
  id: string; name: string; color: EduLudoColor; human: boolean;
  tokens: Token[]; points: number; difficulty?: Difficulty;
};
type Question = {
  id: string; subject: Exclude<Subject, "All Subjects">;
  level: Level[]; difficulty: Difficulty; question: string;
  options: string[]; correctAnswer: number; explanation: string;
};
type Move = {
  tokenId: string; steps: number; die?: number; dieIndex?: number;
  entersFromBase?: boolean; description: string;
};
type Tx = { id: string; description: string; amount: number; at: string };
type Props = {
  initialBalance?: number;
  initialCbtPoints?: number;
  onBack?: () => void;
  onFundWallet?: () => void;
};

const COLORS: Record<EduLudoColor, {
  label: string; main: string; light: string; text: string;
}> = {
  red: { label: "Red", main: "#dc2626", light: "#fee2e2", text: "text-red-700" },
  green: { label: "Green", main: "#16a34a", light: "#dcfce7", text: "text-green-700" },
  yellow: { label: "Yellow", main: "#eab308", light: "#fef9c3", text: "text-yellow-800" },
  blue: { label: "Blue", main: "#2563eb", light: "#dbeafe", text: "text-blue-700" },
};

const TRACK: [number, number][] = [
  [6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],
  [0,6],[0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],
  [6,11],[6,12],[6,13],[6,14],[7,14],[8,14],[8,13],[8,12],[8,11],
  [8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[14,7],
  [14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],
  [8,2],[8,1],[8,0],[7,0],[6,0],
];

const START: Record<EduLudoColor, number> = {
  red: 0, green: 13, yellow: 26, blue: 39,
};

const HOME_LANE: Record<EduLudoColor, [number, number][]> = {
  red: [[7,1],[7,2],[7,3],[7,4],[7,5]],
  green: [[1,7],[2,7],[3,7],[4,7],[5,7]],
  yellow: [[7,13],[7,12],[7,11],[7,10],[7,9]],
  blue: [[13,7],[12,7],[11,7],[10,7],[9,7]],
};

const BASES: Record<EduLudoColor, { r: number; c: number }> = {
  red: { r: 9, c: 9 },
  green: { r: 0, c: 9 },
  yellow: { r: 0, c: 0 },
  blue: { r: 9, c: 0 },
};

const SAFE_TRACK = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
const POINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
  Easy: 20, Medium: 30, Hard: 40,
};
const money = (n: number) => `₦${Math.max(0, n).toLocaleString("en-NG")}`;

const QUESTIONS: Question[] = [
  { id: "m1", subject: "Mathematics", level: ["JSS","SSS","JAMB","WAEC"], difficulty: "Easy", question: "What is 15% of 200?", options: ["15","20","30","45"], correctAnswer: 2, explanation: "15% of 200 = 0.15 × 200 = 30." },
  { id: "m2", subject: "Mathematics", level: ["SSS","JAMB","WAEC"], difficulty: "Medium", question: "Solve: 3x − 7 = 14.", options: ["5","7","9","21"], correctAnswer: 1, explanation: "Add 7 to both sides, then divide by 3: x = 7." },
  { id: "m3", subject: "Mathematics", level: ["SSS","JAMB","WAEC"], difficulty: "Hard", question: "If f(x) = x² − 4x, what is f′(3)?", options: ["2","3","6","10"], correctAnswer: 0, explanation: "f′(x) = 2x − 4, so f′(3) = 2." },
  { id: "e1", subject: "English", level: ["JSS","SSS","JAMB","WAEC"], difficulty: "Easy", question: "Choose the word closest in meaning to ‘rapid’.", options: ["Slow","Swift","Quiet","Weak"], correctAnswer: 1, explanation: "Rapid means fast or swift." },
  { id: "e2", subject: "English", level: ["SSS","JAMB","WAEC"], difficulty: "Medium", question: "Which sentence uses the semicolon correctly?", options: ["I came; and I saw.","It rained; we stayed indoors.","Because; it rained.","She; is ready."], correctAnswer: 1, explanation: "A semicolon can join two closely related independent clauses." },
  { id: "e3", subject: "English", level: ["SSS","JAMB","WAEC"], difficulty: "Hard", question: "A statement that seems contradictory but may reveal truth is a…", options: ["Metaphor","Paradox","Euphemism","Hyperbole"], correctAnswer: 1, explanation: "A paradox appears contradictory but may express a truth." },
  { id: "s1", subject: "Science", level: ["JSS","SSS","Custom"], difficulty: "Easy", question: "Which gas do plants absorb during photosynthesis?", options: ["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"], correctAnswer: 2, explanation: "Plants use carbon dioxide, water and light to make sugars." },
  { id: "b1", subject: "Biology", level: ["SSS","JAMB","WAEC"], difficulty: "Medium", question: "Which organelle is the main site of aerobic respiration?", options: ["Ribosome","Mitochondrion","Golgi body","Vacuole"], correctAnswer: 1, explanation: "Most aerobic ATP production occurs in mitochondria." },
  { id: "c1", subject: "Chemistry", level: ["SSS","JAMB","WAEC"], difficulty: "Hard", question: "What is the oxidation number of sulfur in H₂SO₄?", options: ["+2","+4","+6","−2"], correctAnswer: 2, explanation: "2(+1) + S + 4(−2) = 0, so S = +6." },
  { id: "p1", subject: "Physics", level: ["SSS","JAMB","WAEC"], difficulty: "Medium", question: "A 2 kg object accelerates at 3 m/s². What is the net force?", options: ["1.5 N","5 N","6 N","9 N"], correctAnswer: 2, explanation: "Newton’s second law: F = ma = 2 × 3 = 6 N." },
];

const makePlayers = (color: EduLudoColor, difficulty: Difficulty): Player[] => {
  const others = (["red", "green", "yellow", "blue"] as EduLudoColor[])
    .filter(c => c !== color);
  const names = ["Ada", "Tunde", "Zara"];

  return [
    {
      id: "human", name: "You", color, human: true, points: 0,
      tokens: Array.from({ length: 4 }, (_, i) => ({
        id: `human-${i}`, position: -1, finished: false,
      })),
    },
    ...others.map((c, i) => ({
      id: `bot-${i}`, name: names[i], color: c, human: false,
      difficulty, points: 0,
      tokens: Array.from({ length: 4 }, (_, j) => ({
        id: `bot-${i}-${j}`, position: -1, finished: false,
      })),
    })),
  ];
};

type Phase =
  | "lobby" | "preview" | "countdown" | "rolling" | "diceResult"
  | "question" | "feedback" | "move" | "finished";

export default function EduLudoGame({
  initialBalance = 500,
  initialCbtPoints = 0,
  onBack,
  onFundWallet,
}: Props) {
  const [mode, setMode] = useState<EduLudoMode>("solo");
  const [subject, setSubject] = useState<Subject>("All Subjects");
  const [level, setLevel] = useState<Level>("JAMB");
  const [playerColor, setPlayerColor] = useState<EduLudoColor>("red");
  const [botDifficulty, setBotDifficulty] = useState<Difficulty>("Medium");
  const [balance, setBalance] = useState(initialBalance);
  const [cbtPoints, setCbtPoints] = useState(initialCbtPoints);
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("lobby");
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [usedDice, setUsedDice] = useState<number[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questionCount, setQuestionCount] = useState(0);
  const [seenQuestions, setSeenQuestions] = useState<string[]>([]);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [moveMessage, setMoveMessage] = useState("");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [drawer, setDrawer] = useState<"rules" | "wallet" | "rewards" | "move" | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [rollAnim, setRollAnim] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [matchReward, setMatchReward] = useState(0);
  const [toast, setToast] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnRef = useRef(0);
  const answerLockedRef = useRef(false);
  const current = players[turn];
  const human = players.find(p => p.human);

  const eligibleQuestions = useMemo(
    () => QUESTIONS.filter(q =>
      (subject === "All Subjects" || q.subject === subject) && q.level.includes(level)
    ),
    [subject, level],
  );

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const clearPhaseTimer = useCallback(() => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    phaseTimerRef.current = null;
  }, []);

  useEffect(() => () => {
    stopTimer();
    clearPhaseTimer();
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
  }, [stopTimer, clearPhaseTimer]);

  const updatePlayer = useCallback((
    playerId: string,
    fn: (p: Player) => Player,
  ) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? fn(p) : p));
  }, []);

  const addPoints = useCallback((
    playerId: string,
    amount: number,
    description: string,
  ) => {
    updatePlayer(playerId, p => ({ ...p, points: p.points + amount }));

    if (playerId === "human" && amount > 0) {
      setCbtPoints(v => v + amount);
      setMatchReward(v => v + amount);
      setTxs(v => [{
        id: `${Date.now()}-${Math.random()}`,
        description,
        amount,
        at: new Date().toISOString(),
      }, ...v]);
      notify(`+${amount} CBT Points`);
    }
  }, [notify, updatePlayer]);

  const getTokenMoves = useCallback((
    player: Player,
    die: number,
    dieIndex: number,
  ): Move[] => {
    const moves: Move[] = [];

    for (const token of player.tokens) {
      if (token.finished || token.position === 57) continue;

      if (token.position === -1) {
        if (die === 6) {
          moves.push({
            tokenId: token.id,
            steps: 0,
            die,
            dieIndex,
            entersFromBase: true,
            description: `Bring ${COLORS[player.color].label.toLowerCase()} token out using the 6`,
          });
        }
        continue;
      }

      const next = token.position + die;
      if (next <= 57) {
        moves.push({
          tokenId: token.id,
          steps: die,
          die,
          dieIndex,
          description: next === 57 ? "Move token HOME" : `Move token ${die} spaces`,
        });
      }
    }

    return moves;
  }, []);

  const getTurnMoves = useCallback((
    player: Player,
    roll: [number, number],
    alreadyUsed: number[] = [],
  ): Move[] => {
    const options: Move[] = [];

    if (alreadyUsed.length) {
      const remainingIndex = alreadyUsed.includes(0) ? 1 : 0;
      return getTokenMoves(player, roll[remainingIndex], remainingIndex);
    }

    const combined = roll[0] + roll[1];

    for (const token of player.tokens) {
      if (
        token.position >= 0 &&
        !token.finished &&
        token.position + combined <= 57
      ) {
        options.push({
          tokenId: token.id,
          steps: combined,
          description: `Move ${combined} spaces (both dice)`,
        });
      }
    }

    options.push(
      ...getTokenMoves(player, roll[0], 0),
      ...getTokenMoves(player, roll[1], 1),
    );

    return options.filter((move, i, all) =>
      all.findIndex(other =>
        other.tokenId === move.tokenId &&
        other.steps === move.steps &&
        other.entersFromBase === move.entersFromBase &&
        other.description === move.description &&
        other.dieIndex === move.dieIndex
      ) === i
    );
  }, [getTokenMoves]);

  const presentQuestion = useCallback(() => {
    if (balance < 2) {
      setDrawer("wallet");
      notify("You need at least ₦2 to display a question. Your turn is paused.");
      setPhase("rolling");
      return;
    }

    if (!eligibleQuestions.length) {
      setPlayers([]);
      setQuestion(null);
      setPhase("lobby");
      notify("No sample questions match that subject and level. Choose another option.");
      return;
    }

    const unused = eligibleQuestions.filter(q => !seenQuestions.includes(q.id));
    const pool = unused.length ? unused : eligibleQuestions;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    // Local demo deduction only. Real wallet charging must happen server-side.
    setBalance(v => Math.max(0, v - 2));
    setTxs(v => [{
      id: `fee-${Date.now()}-${Math.random()}`,
      description: `Educational Ludo question fee (${picked.subject})`,
      amount: -2,
      at: new Date().toISOString(),
    }, ...v]);

    setSeenQuestions(unused.length ? [...seenQuestions, picked.id] : [picked.id]);
    setQuestion(picked);
    setQuestionCount(v => v + 1);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    answerLockedRef.current = false;
    setTimeLeft(15);
    setPhase("question");
  }, [balance, eligibleQuestions, seenQuestions, notify]);

  const nextTurn = useCallback(() => {
    stopTimer();
    clearPhaseTimer();
    answerLockedRef.current = false;
    setQuestion(null);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setLegalMoves([]);
    setUsedDice([]);
    setMoveMessage("");
    setDrawer(null);

    setTurn(previous => {
      const next = players.length ? (previous + 1) % players.length : 0;
      turnRef.current = next;
      return next;
    });
    setPhase("rolling");
  }, [players.length, stopTimer, clearPhaseTimer]);

  const startPreview = () => {
    if (mode !== "solo") {
      notify("Multiplayer is coming soon. Solo mode is playable now.");
      return;
    }

    stopTimer();
    clearPhaseTimer();
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    setPlayers(makePlayers(playerColor, botDifficulty));
    setTurn(0);
    turnRef.current = 0;
    setDice([1, 1]);
    setUsedDice([]);
    setQuestion(null);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setSeenQuestions([]);
    setQuestionCount(0);
    setTxs([]);
    setMatchReward(0);
    setWinnerId(null);
    setLegalMoves([]);
    setMoveMessage("");
    setDrawer(null);
    setPhase("preview");
  };

  const beginCountdown = () => {
    if (balance < 2) {
      setDrawer("wallet");
      notify("You need at least ₦2 before the first question.");
      return;
    }

    clearPhaseTimer();
    setPhase("countdown");
    let n = 3;
    setToast("3");

    const tick = () => {
      n -= 1;

      if (n > 0) {
        setToast(String(n));
        phaseTimerRef.current = setTimeout(tick, 700);
      } else {
        setToast("GO!");
        phaseTimerRef.current = setTimeout(() => {
          setToast("");
          setPhase("rolling");
        }, 450);
      }
    };

    phaseTimerRef.current = setTimeout(tick, 700);
  };

  const rollDice = () => {
    if (phase !== "rolling" || !current?.human || rollAnim) return;

    if (balance < 2) {
      setDrawer("wallet");
      notify("Fund your wallet to continue.");
      return;
    }

    clearPhaseTimer();
    setRollAnim(true);

    const first = 1 + Math.floor(Math.random() * 6);
    const second = 1 + Math.floor(Math.random() * 6);

    phaseTimerRef.current = setTimeout(() => {
      setDice([first, second]);
      setRollAnim(false);
      setPhase("diceResult");
    }, 650);
  };

  const applyMove = useCallback((move: Move) => {
    const actor = players[turnRef.current];
    if (!actor) return;

    const targetToken = actor.tokens.find(t => t.id === move.tokenId);
    if (!targetToken) return;

    const newPosition = move.entersFromBase
      ? 0
      : targetToken.position + move.steps;

    if (newPosition > 57) return;

    const trackIndex =
      newPosition >= 0 && newPosition <= 51
        ? (START[actor.color] + newPosition) % 52
        : -1;

    const isSafe = trackIndex >= 0 && SAFE_TRACK.has(trackIndex);
    let captureCount = 0;

    const updatedPlayers = players.map(player => {
      if (player.id === actor.id) {
        return {
          ...player,
          tokens: player.tokens.map(token =>
            token.id === move.tokenId
              ? { ...token, position: newPosition, finished: newPosition === 57 }
              : token
          ),
        };
      }

      if (isSafe || trackIndex < 0) return player;

      let captured = 0;
      const tokens = player.tokens.map(token => {
        if (token.position < 0 || token.position > 51) return token;

        const enemyIndex = (START[player.color] + token.position) % 52;
        if (enemyIndex === trackIndex) {
          captured++;
          return { ...token, position: -1, finished: false };
        }
        return token;
      });

      captureCount += captured;
      return { ...player, tokens };
    });

    setPlayers(updatedPlayers);

    if (captureCount) {
      addPoints(
        actor.id,
        captureCount * 100,
        `Captured ${captureCount} token${captureCount > 1 ? "s" : ""}`,
      );
    }

    const updatedActor = updatedPlayers.find(p => p.id === actor.id)!;
    const winner = updatedActor.tokens.every(
      token => token.finished || token.position === 57,
    );

    setDrawer(null);
    setMoveMessage("");

    if (winner) {
      setWinnerId(updatedActor.id);
      if (updatedActor.human) {
        addPoints(updatedActor.id, 500, "Educational Ludo winner bonus");
      }
      setLegalMoves([]);
      setPhase("finished");
      return;
    }

    if (move.dieIndex !== undefined) {
      const nowUsed = [...usedDice, move.dieIndex];
      setUsedDice(nowUsed);

      if (nowUsed.length < 2) {
        const remainingIndex = nowUsed.includes(0) ? 1 : 0;
        const remainingMoves = getTokenMoves(
          updatedActor,
          dice[remainingIndex],
          remainingIndex,
        );

        if (remainingMoves.length) {
          setLegalMoves(remainingMoves);
          setPhase("move");
          return;
        }
      }
    }

    setLegalMoves([]);
    nextTurn();
  }, [players, addPoints, usedDice, dice, getTokenMoves, nextTurn]);

  const finishAnswer = useCallback((
    answer: number | null,
    timedOut: boolean,
  ) => {
    if (!question || phase !== "question" || answerLockedRef.current) return;

    answerLockedRef.current = true;
    stopTimer();
    setSelectedAnswer(answer);

    const correct = answer === question.correctAnswer && !timedOut;
    setAnswerStatus(timedOut ? "timeout" : correct ? "correct" : "wrong");
    setPhase("feedback");

    if (correct && current) {
      addPoints(
        current.id,
        POINTS_BY_DIFFICULTY[question.difficulty],
        `${question.difficulty} question answered correctly`,
      );
    } else {
      setMoveMessage(
        timedOut ? "Time is up. Your turn will pass." : "Not quite. Your turn will pass."
      );
    }
  }, [question, phase, stopTimer, current, addPoints]);

  useEffect(() => {
    if (phase !== "question") {
      stopTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          stopTimer();
          setTimeout(() => finishAnswer(null, true), 0);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return stopTimer;
  }, [phase, stopTimer, finishAnswer]);

  const afterFeedback = () => {
    if (answerStatus !== "correct" || !current || !question) {
      nextTurn();
      return;
    }

    const moves = getTurnMoves(current, dice, []);
    if (!moves.length) {
      setMoveMessage("Correct answer, but no legal move is available. Turn passes.");
      phaseTimerRef.current = setTimeout(nextTurn, 900);
      return;
    }

    setLegalMoves(moves);
    setUsedDice([]);
    setPhase("move");
    setDrawer("move");
  };

  // Dice are shown first. Only after the result has been visible do we
  // present the question or simulate the bot's answer.
  useEffect(() => {
    if (phase !== "diceResult" || !current) return;

    let cancelled = false;
    clearPhaseTimer();

    if (current.human) {
      phaseTimerRef.current = setTimeout(() => {
        if (!cancelled) presentQuestion();
      }, 850);
    } else {
      phaseTimerRef.current = setTimeout(() => {
        if (cancelled) return;

        const chance =
          current.difficulty === "Easy" ? 0.58
          : current.difficulty === "Hard" ? 0.91
          : 0.76;

        if (Math.random() > chance) {
          nextTurn();
          return;
        }

        const moves = getTurnMoves(current, dice, []);
        if (!moves.length) {
          nextTurn();
          return;
        }

        // Bot answers correctly, then chooses a strategic legal move.
        const scored = moves.map(move => {
          const token = current.tokens.find(t => t.id === move.tokenId)!;
          const position = move.entersFromBase ? 0 : token.position + move.steps;
          const progress = position === 57 ? 100 : Math.max(0, position);

          const capture = position >= 0 && position <= 51 &&
            players.some(player =>
              player.id !== current.id &&
              player.tokens.some(enemy =>
                enemy.position >= 0 && enemy.position <= 51 &&
                (START[player.color] + enemy.position) % 52 ===
                (START[current.color] + position) % 52
              )
            );

          const safe = position >= 0 && position <= 51 &&
            SAFE_TRACK.has((START[current.color] + position) % 52);

          return {
            move,
            score: progress + (capture ? 30 : 0) + (safe ? 8 : 0) +
              Math.random() * (current.difficulty === "Easy" ? 20 : 5),
          };
        }).sort((a, b) => b.score - a.score);

        applyMove(scored[0].move);
      }, current.difficulty === "Hard" ? 1800 : 1350);
    }

    return () => {
      cancelled = true;
      clearPhaseTimer();
    };
  }, [
    phase, current, dice, players, presentQuestion,
    getTurnMoves, applyMove, nextTurn, clearPhaseTimer,
  ]);

  // A bot can use the second die after making its first separate-die move.
  useEffect(() => {
    if (
      phase !== "move" || !current || current.human ||
      mode !== "solo" || !legalMoves.length
    ) return;

    const timer = setTimeout(() => {
      const scored = legalMoves.map(move => {
        const token = current.tokens.find(t => t.id === move.tokenId)!;
        const position = move.entersFromBase ? 0 : token.position + move.steps;

        const capture = position >= 0 && position <= 51 &&
          players.some(player =>
            player.id !== current.id &&
            player.tokens.some(enemy =>
              enemy.position >= 0 && enemy.position <= 51 &&
              (START[player.color] + enemy.position) % 52 ===
              (START[current.color] + position) % 52
            )
          );

        const safe = position >= 0 && position <= 51 &&
          SAFE_TRACK.has((START[current.color] + position) % 52);

        return {
          move,
          score: (position === 57 ? 100 : position) +
            (capture ? 30 : 0) + (safe ? 8 : 0) +
            Math.random() * (current.difficulty === "Easy" ? 20 : 5),
        };
      }).sort((a, b) => b.score - a.score);

      if (scored[0]) applyMove(scored[0].move);
      else nextTurn();
    }, current.difficulty === "Hard" ? 1400 : 900);

    return () => clearTimeout(timer);
  }, [phase, current, mode, legalMoves, players, applyMove, nextTurn]);

  const activeMoves = legalMoves;

  const renderToken = (player: Player, token: Token, compact = false) => {
    let coord: [number, number] | null = null;

    if (token.position === -1) {
      const base = BASES[player.color];
      const index = Number(token.id.split("-").pop()) || 0;
      const offsets = [[1,1],[1,3],[3,1],[3,3]];
      coord = [base.r + offsets[index][0], base.c + offsets[index][1]];
    } else if (token.position <= 51) {
      coord = TRACK[(START[player.color] + token.position) % 52];
    } else if (token.position <= 56) {
      coord = HOME_LANE[player.color][token.position - 52];
    }

    if (token.position === 57 || token.finished || !coord) return null;

    const isLegal = activeMoves.some(m => m.tokenId === token.id);

    return (
      <button
        key={token.id}
        type="button"
        aria-label={`${player.name} ${COLORS[player.color].label} token`}
        disabled={!(phase === "move" && current?.human && player.human && isLegal)}
        onClick={() => {
          const choices = activeMoves.filter(m => m.tokenId === token.id);
          if (choices.length === 1) applyMove(choices[0]);
          else {
            setDrawer("move");
            setMoveMessage("Choose how to use the dice for this token.");
          }
        }}
        className={`absolute z-20 rounded-full border-2 border-white shadow-md transition-transform ${
          compact ? "h-3 w-3" : "h-[clamp(11px,1.5vw,20px)] w-[clamp(11px,1.5vw,20px)]"
        } ${
          isLegal && phase === "move"
            ? "scale-125 animate-pulse cursor-pointer ring-4 ring-amber-300"
            : ""
        }`}
        style={{
          left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: COLORS[player.color].main,
        }}
      />
    );
  };

  const tokenAt = (r: number, c: number) =>
    players.flatMap(player => player.tokens.map(token => ({ player, token })))
      .filter(({ player, token }) => {
        if (token.position === -1) {
          const base = BASES[player.color];
          const index = Number(token.id.split("-").pop()) || 0;
          const offsets = [[1,1],[1,3],[3,1],[3,3]];
          return base.r + offsets[index][0] === r &&
            base.c + offsets[index][1] === c;
        }

        if (token.position >= 0 && token.position <= 51) {
          const coord = TRACK[(START[player.color] + token.position) % 52];
          return coord[0] === r && coord[1] === c;
        }

        if (token.position >= 52 && token.position <= 56) {
          const coord = HOME_LANE[player.color][token.position - 52];
          return coord[0] === r && coord[1] === c;
        }

        return false;
      });

  const boardCell = (r: number, c: number) => {
    const trackIndex = TRACK.findIndex(([rr, cc]) => rr === r && cc === c);
    const laneColor = (Object.keys(HOME_LANE) as EduLudoColor[])
      .find(color => HOME_LANE[color].some(([rr, cc]) => rr === r && cc === c));

    const baseColor = (Object.keys(BASES) as EduLudoColor[])
      .find(color => {
        const base = BASES[color];
        return r >= base.r && r < base.r + 6 &&
          c >= base.c && c < base.c + 6;
      });

    const startColor = trackIndex >= 0
      ? (Object.keys(START) as EduLudoColor[])
          .find(color => START[color] === trackIndex)
      : undefined;

    const safe = trackIndex >= 0 && SAFE_TRACK.has(trackIndex);
    const style: React.CSSProperties = {};

    if (baseColor) style.backgroundColor = COLORS[baseColor].light;
    if (laneColor) style.backgroundColor = COLORS[laneColor].light;
    if (trackIndex >= 0 && startColor) style.backgroundColor = COLORS[startColor].main;

    const occupants = tokenAt(r, c);

    return (
      <div
        key={`${r}-${c}`}
        className={`relative min-w-0 border-[0.5px] border-slate-200 ${
          trackIndex >= 0 ? "bg-slate-50" : "bg-white"
        }`}
        style={style}
      >
        {safe && (
          <span
            className={`absolute inset-0 grid place-items-center ${
              trackIndex >= 0 && startColor ? "text-white" : "text-amber-500"
            }`}
            style={{ fontSize: "clamp(7px, 1.1vw, 14px)" }}
          >
            ★
          </span>
        )}
        {occupants.map(({ player, token }) => renderToken(player, token, true))}
      </div>
    );
  };

  const drawBoard = () => (
    <div className="mx-auto w-full max-w-[690px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:p-3">
      <div className="relative grid aspect-square grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] overflow-hidden rounded-lg border border-slate-300">
        {Array.from({ length: 225 }, (_, i) =>
          boardCell(Math.floor(i / 15), i % 15)
        )}
        <div className="pointer-events-none absolute left-[40%] top-[40%] z-10 grid h-[20%] w-[20%] place-items-center overflow-hidden rounded-lg border-2 border-white bg-white shadow-md">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2">
            <div style={{ background: COLORS.red.main }} />
            <div style={{ background: COLORS.green.main }} />
            <div style={{ background: COLORS.blue.main }} />
            <div style={{ background: COLORS.yellow.main }} />
          </div>
          <span className="absolute rounded-full bg-slate-900 px-2 py-1 text-[8px] font-black tracking-widest text-white sm:text-[10px]">
            HOME
          </span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500 sm:text-xs">
        <span>★ Safe square</span><span>● Token</span><span>Colored start squares</span>
      </div>
    </div>
  );

  const allRanked = [...players].sort((a, b) =>
    b.tokens.filter(t => t.finished || t.position === 57).length -
      a.tokens.filter(t => t.finished || t.position === 57).length ||
    Math.max(...b.tokens.map(t => t.position)) -
      Math.max(...a.tokens.map(t => t.position))
  );

  const exitGame = () => {
    setConfirmExit(false);
    setDrawer(null);
    stopTimer();
    clearPhaseTimer();
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setPhase("lobby");
    setPlayers([]);
    setQuestion(null);
    setLegalMoves([]);
    setWinnerId(null);
    onBack?.();
  };

  const currentLegal = activeMoves;
  const doSelectedMove = (move: Move) => applyMove(move);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-3 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => phase === "lobby" ? onBack?.() : setConfirmExit(true)}
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
              <Dice5 size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-extrabold sm:text-lg">Educational Ludo</h1>
              <p className="hidden text-xs text-slate-500 sm:block">Roll. Learn. Race HOME.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl bg-amber-50 px-3 py-2 text-right sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">CBT Points</div>
              <div className="font-extrabold text-amber-900">{cbtPoints.toLocaleString()}</div>
            </div>
            <button
              type="button"
              onClick={() => setDrawer("wallet")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold hover:bg-slate-50"
            >
              <Wallet size={16} /><span>{money(balance)}</span>
            </button>
            <button
              type="button"
              onClick={() => setDrawer("rules")}
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Rules"
            >
              <CircleHelp size={18} />
            </button>
          </div>
        </div>
      </header>

      {phase === "lobby" && (
        <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.2fr_.8fr] lg:py-12">
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 p-6 text-white shadow-xl sm:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
              <Sparkles size={14} /> LEARN AS YOU PLAY
            </div>
            <h2 className="max-w-xl text-3xl font-black leading-tight sm:text-5xl">
              Every correct answer moves you closer to HOME.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">
              Roll two dice, solve a timed question, and use your dice to move your tokens.
              Outsmart the bots and bring all four tokens HOME.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { n: "2 dice", d: "Choose combined or split moves" },
                { n: "15 sec", d: "Per question" },
                { n: "₦2", d: "Per displayed question" },
              ].map(item => (
                <div key={item.n} className="rounded-2xl border border-white/15 bg-white/10 p-3">
                  <div className="text-lg font-black sm:text-2xl">{item.n}</div>
                  <div className="mt-1 text-[11px] leading-4 text-indigo-100 sm:text-xs">{item.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs text-indigo-100">
              <ShieldCheck size={16} /> Local Solo demo. Wallet charging and multiplayer need backend integration.
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-extrabold">Set up your match</h2>
            <p className="mt-1 text-sm text-slate-500">Choose your learning level and player settings.</p>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Game mode</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "solo", name: "Solo vs Bots", desc: "Playable now" },
                  { id: "friends", name: "Play with Friends", desc: "Coming soon" },
                  { id: "classroom", name: "Classroom", desc: "Coming soon" },
                  { id: "tournament", name: "Tournament", desc: "Coming soon" },
                ] as { id: EduLudoMode; name: string; desc: string }[]).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id)}
                    className={`rounded-xl border p-3 text-left transition ${
                      mode === item.id
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-sm font-bold">
                      {item.name}
                      {item.id !== "solo" && <LockKeyhole size={14} className="text-slate-400" />}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value as Subject)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500">
                  {["All Subjects","Mathematics","English","Science","Biology","Chemistry","Physics"].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Academic level</label>
                <select value={level} onChange={e => setLevel(e.target.value as Level)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500">
                  {["JSS","SSS","JAMB","WAEC","Custom"].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Your token colour</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(COLORS) as EduLudoColor[]).map(color => (
                  <button key={color} onClick={() => setPlayerColor(color)} className={`flex flex-col items-center gap-2 rounded-xl border p-3 ${playerColor === color ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200"}`}>
                    <span className="h-6 w-6 rounded-full border-2 border-white shadow" style={{ backgroundColor: COLORS[color].main }} />
                    <span className="text-xs font-semibold">{COLORS[color].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Bot strategy</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Easy","Medium","Hard"] as Difficulty[]).map(difficulty => (
                  <button key={difficulty} onClick={() => setBotDifficulty(difficulty)} className={`rounded-xl border px-2 py-2.5 text-sm font-bold ${botDifficulty === difficulty ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"}`}>
                    {difficulty}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">Bot strategy changes their move selection. Questions mix available difficulties.</p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm"><span className="text-slate-600">Current wallet balance</span><b>{money(balance)}</b></div>
              <div className="mt-2 flex items-center justify-between text-sm"><span className="text-slate-600">Question fee</span><b>₦2 each</b></div>
              <div className="mt-2 flex items-center justify-between text-sm"><span className="text-slate-600">Correct answer reward</span><b className="text-amber-700">20–40 CBT Points</b></div>
            </div>

            <button onClick={startPreview} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
              Review match <ChevronRight size={18} />
            </button>
            <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">Demo wallet balance is local only and is not a real account balance.</p>
          </section>
        </main>
      )}

      {phase === "preview" && (
        <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><Flag size={26} /></div>
            <h2 className="text-2xl font-black">Match preview</h2>
            <p className="mt-2 text-sm text-slate-500">Check the match details before the countdown begins.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: "Your colour", value: COLORS[playerColor].label },
                { label: "Bot strategy", value: botDifficulty },
                { label: "Subject", value: subject },
                { label: "Academic level", value: level },
                { label: "Question fee", value: "₦2 per question" },
                { label: "Wallet balance", value: money(balance) },
              ].map(item => (
                <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="mt-1 font-extrabold">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
              <b>Objective:</b> be the first player to bring all four tokens HOME. Correct answers earn 20/30/40 CBT Points; captures earn +100 and winning earns +500.
            </div>
            {balance < 2 && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Your wallet needs at least ₦2 to display the first question.</div>}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button onClick={() => setPhase("lobby")} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold hover:bg-slate-50">Back to setup</button>
              <button onClick={beginCountdown} className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">Start match <ChevronRight className="ml-1 inline" size={17} /></button>
            </div>
          </div>
        </main>
      )}

      {!["lobby", "preview"].includes(phase) && (
        <main className="mx-auto max-w-[1500px] px-3 py-4 sm:px-6 sm:py-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Solo match · {subject} · {level}</div>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">Race to HOME</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDrawer("rewards")} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold"><Award size={16} /> Rewards</button>
              <button onClick={() => setDrawer("wallet")} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold"><Wallet size={16} /> Wallet</button>
              <button onClick={() => setDrawer("rules")} className="rounded-xl border border-slate-200 bg-white p-2" aria-label="Rules"><BookOpen size={17} /></button>
            </div>
          </div>

          {phase === "countdown" && <div className="mb-4 rounded-2xl bg-indigo-600 p-5 text-center text-white"><div className="text-xs font-bold uppercase tracking-widest text-indigo-100">Get ready</div><div className="mt-1 text-4xl font-black">{toast || "3"}</div></div>}

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <section className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ backgroundColor: current ? COLORS[current.color].main : "#64748b" }}>
                    {current?.human ? <Crown size={22} /> : <Loader2 className="animate-spin" size={22} />}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Current turn</div>
                    <div className="font-extrabold">{current?.name ?? "Preparing…"}{current?.human ? " (You)" : ""}</div>
                    <div className="text-xs text-slate-500">
                      {phase === "rolling" ? current?.human ? "Roll the dice to begin" : "Bot is preparing its roll…"
                        : phase === "diceResult" ? `Dice result: ${dice[0]} + ${dice[1]} = ${dice[0] + dice[1]}`
                        : phase === "question" ? "Answer before the timer reaches zero"
                        : phase === "feedback" ? "Checking your answer"
                        : phase === "move" ? "Choose a legal token move"
                        : phase === "finished" ? "Match complete"
                        : "Match in progress"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl border-2 bg-white text-xl font-black shadow-sm ${rollAnim ? "animate-bounce" : ""}`}>{dice[0]}</div>
                  <div className={`grid h-12 w-12 place-items-center rounded-xl border-2 bg-white text-xl font-black shadow-sm ${rollAnim ? "animate-bounce" : ""}`}>{dice[1]}</div>
                  <div className="ml-1 text-center"><div className="text-[10px] font-bold uppercase text-slate-400">Total</div><div className="text-xl font-black">{dice[0] + dice[1]}</div></div>
                </div>
              </div>

              {phase === "diceResult" && (
                <div role="status" className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-center">
                  <div className="text-xs font-bold uppercase tracking-wide text-indigo-600">Dice rolled</div>
                  <div className="mt-1 text-xl font-black text-indigo-950">{dice[0]} + {dice[1]} = {dice[0] + dice[1]}</div>
                  <p className="mt-1 text-xs text-indigo-700">{current?.human ? "Your question is coming next…" : `${current?.name ?? "Bot"} is answering a question…`}</p>
                </div>
              )}

              {drawBoard()}

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                {phase === "rolling" && current?.human && (
                  <button onClick={rollDice} disabled={rollAnim} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-60">
                    <Dice5 size={18} />{rollAnim ? "Rolling…" : "Roll Dice"}
                  </button>
                )}
                {phase === "question" && <div className="text-sm font-semibold text-indigo-700">Answer the question to unlock your moves.</div>}
                {phase === "move" && <div className="text-sm font-semibold text-emerald-700">Choose a highlighted token or select a move below.</div>}
                {current && !current.human && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="animate-spin" size={16} /> {current.name} is playing…</div>}
                {phase === "finished" && <div className="font-bold text-emerald-700">Match complete!</div>}
                <button onClick={() => setConfirmExit(true)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Exit match</button>
              </div>

              {phase === "move" && current?.human && (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="font-extrabold text-emerald-900">Your legal moves</h3><p className="mt-1 text-xs text-emerald-800">Choose a combined move or use a single die. Each die can only be used once.</p></div>
                    <button onClick={() => setDrawer("move")} className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold">Move panel</button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {currentLegal.map((move, i) => (
                      <button key={`${move.tokenId}-${move.steps}-${move.description}-${i}`} onClick={() => doSelectedMove(move)} className="rounded-xl border border-emerald-200 bg-white p-3 text-left text-sm font-semibold text-emerald-900 hover:border-emerald-400">
                        {move.description}<span className="mt-1 block text-xs font-normal text-slate-500">Token {(Number(move.tokenId.split("-").pop()) || 0) + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between"><h3 className="font-extrabold">Players</h3><span className="text-xs text-slate-400">4 players</span></div>
                <div className="mt-3 space-y-3">
                  {players.map(player => (
                    <div key={player.id} className={`flex items-center gap-3 rounded-xl p-2 ${current?.id === player.id ? "bg-indigo-50 ring-1 ring-indigo-100" : ""}`}>
                      <div className="h-9 w-9 shrink-0 rounded-full border-2 border-white shadow" style={{ backgroundColor: COLORS[player.color].main }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-sm font-bold">{player.name}{player.human && <span className="text-xs text-slate-400">(You)</span>}{current?.id === player.id && <span className="ml-auto rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">TURN</span>}</div>
                        <div className="text-xs text-slate-500">{player.tokens.filter(t => t.finished || t.position === 57).length}/4 HOME · {player.points} pts</div>
                        <div className="mt-1 flex gap-1">{player.tokens.map(token => <span key={token.id} className={`h-2 flex-1 rounded-full ${token.finished || token.position === 57 ? "bg-emerald-500" : token.position >= 0 ? "bg-slate-300" : "bg-slate-100"}`} />)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-extrabold">Match status</h3>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-slate-500">Questions shown</span><b>{questionCount}</b></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">Question fee</span><b>₦2 each</b></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">CBT Points</span><b className="text-amber-700">{cbtPoints.toLocaleString()}</b></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">Tokens HOME</span><b>{human?.tokens.filter(t => t.finished || t.position === 57).length ?? 0}/4</b></div>
                </div>
                <button onClick={() => setDrawer("wallet")} className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold"><span>Wallet balance</span><span>{money(balance)} <ChevronRight className="ml-1 inline" size={15} /></span></button>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-center gap-2 font-extrabold text-amber-900"><Zap size={17} /> Quick reminder</div>
                <p className="mt-2 text-xs leading-5 text-amber-900">Answer correctly to move. A six brings a token out of base. Safe stars protect tokens from capture. You need an exact roll to reach HOME.</p>
              </div>
            </aside>
          </div>
        </main>
      )}

      {phase === "question" && question && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6">
          <section role="dialog" aria-modal="true" aria-labelledby="question-title" className="my-auto w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div><div className="text-xs font-bold uppercase tracking-wider text-indigo-600">{question.subject} · {question.difficulty}</div><h2 id="question-title" className="mt-1 text-xl font-black">Question {questionCount}</h2></div>
              <div className={`grid h-14 w-14 place-items-center rounded-full border-4 text-xl font-black ${timeLeft <= 5 ? "border-red-300 bg-red-50 text-red-600" : "border-indigo-100 bg-indigo-50 text-indigo-700"}`}>{timeLeft}</div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${timeLeft <= 5 ? "bg-red-500" : "bg-indigo-500"}`} style={{ width: `${timeLeft / 15 * 100}%` }} /></div>
            <p className="mt-6 text-lg font-bold leading-relaxed">{question.question}</p>
            <div className="mt-5 grid gap-3">
              {question.options.map((option, i) => (
                <button key={option} disabled={answerStatus !== null} onClick={() => finishAnswer(i, false)} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-60">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-extrabold">{String.fromCharCode(65 + i)}</span><span className="text-sm font-medium">{option}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">One question per turn · ₦2 fee · Wrong answers pass your turn</p>
          </section>
        </div>
      )}

      {phase === "feedback" && question && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/65 p-4">
          <section role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${answerStatus === "correct" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{answerStatus === "correct" ? <CheckCircle2 size={32} /> : <X size={32} />}</div>
            <h2 className="mt-4 text-2xl font-black">{answerStatus === "correct" ? "Correct answer!" : answerStatus === "timeout" ? "Time is up!" : "Not quite"}</h2>
            <p className="mt-2 text-sm text-slate-500">{answerStatus === "correct" ? `You earned ${POINTS_BY_DIFFICULTY[question.difficulty]} CBT Points.` : moveMessage}</p>
            {answerStatus !== "correct" && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-left text-sm"><div className="font-bold text-emerald-900">Correct answer: {question.options[question.correctAnswer]}</div><p className="mt-1 text-emerald-800">{question.explanation}</p></div>}
            {answerStatus === "correct" && <p className="mt-3 text-sm text-slate-600">{question.explanation}</p>}
            <button onClick={afterFeedback} className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">{answerStatus === "correct" ? "Choose your move" : "Continue"}</button>
          </section>
        </div>
      )}

      {phase === "finished" && (
        <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/70 p-4">
          <section className="my-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Trophy size={34} /></div>
            <h2 className="mt-4 text-center text-3xl font-black">{players.find(p => p.id === winnerId)?.name ?? "Match"} wins!</h2>
            <p className="mt-2 text-center text-sm text-slate-500">Match results and final rankings</p>
            <div className="mt-6 space-y-2">
              {allRanked.map((player, i) => (
                <div key={player.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 font-black">{i + 1}</div>
                  <div className="h-7 w-7 rounded-full" style={{ backgroundColor: COLORS[player.color].main }} />
                  <div className="flex-1 font-bold">{player.name}{player.human ? " (You)" : ""}<div className="text-xs font-normal text-slate-500">{player.tokens.filter(t => t.finished || t.position === 57).length}/4 tokens HOME</div></div>
                  <div className="text-right font-extrabold">{player.points}<div className="text-[10px] font-medium text-slate-400">CBT Points</div></div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-amber-50 p-4"><div className="text-xs text-amber-700">Points earned this match</div><div className="mt-1 text-2xl font-black text-amber-900">+{matchReward}</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">Questions shown</div><div className="mt-1 text-2xl font-black">{questionCount}</div></div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { setPhase("lobby"); setPlayers([]); setWinnerId(null); }} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold">Exit to setup</button>
              <button onClick={startPreview} className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white">Play again <RotateCcw className="ml-1 inline" size={16} /></button>
            </div>
          </section>
        </div>
      )}

      {drawer && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-slate-950/40" onClick={() => setDrawer(null)}>
          <aside onClick={e => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">{drawer === "rules" ? "How to play" : drawer === "wallet" ? "Wallet" : drawer === "rewards" ? "Rewards" : "Choose a move"}</h2>
              <button onClick={() => setDrawer(null)} className="rounded-xl border border-slate-200 p-2" aria-label="Close drawer"><X size={18} /></button>
            </div>

            {drawer === "rules" && (
              <div className="mt-5 space-y-4">
                {[
                  { t: "1. Roll two dice", d: "Use the combined total for one token, or use each die for separate moves. Each die can be used once; there is no bonus roll for a six." },
                  { t: "2. Answer a question", d: "Each turn shows one 15-second question and costs ₦2. Correct answers unlock legal moves and award 20/30/40 CBT Points." },
                  { t: "3. Leave base", d: "A token can leave base only when one of your dice shows 6. A six used to enter a token cannot be reused." },
                  { t: "4. Capture and safe squares", d: "Landing on an opponent on a non-safe square sends their token back to base and earns +100 CBT Points. Star squares protect tokens." },
                  { t: "5. Reach HOME", d: "Move along your coloured home lane. You must roll the exact number to reach HOME." },
                  { t: "6. Win", d: "The first player to get all four tokens HOME wins and receives +500 CBT Points. CBT Points are separate from your Naira wallet." },
                ].map(item => <div key={item.t} className="border-b border-slate-100 pb-4"><h3 className="font-extrabold">{item.t}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{item.d}</p></div>)}
                <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">This release uses local demo state. Backend integration is required for secure wallet charges, persistence and online multiplayer.</p>
              </div>
            )}

            {drawer === "wallet" && (
              <div className="mt-5">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-700 to-blue-500 p-5 text-white">
                  <div className="text-sm text-indigo-100">Demo wallet balance</div><div className="mt-1 text-3xl font-black">{money(balance)}</div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-sm"><span>Question fee</span><b>₦2</b></div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">This balance is local demo state and is not synced with your account wallet.</p>
                <button onClick={() => { setDrawer(null); onFundWallet?.(); }} className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">Fund platform wallet</button>
                <div className="mt-6 flex items-center justify-between"><h3 className="font-extrabold">Recent transactions</h3><History size={17} className="text-slate-400" /></div>
                <div className="mt-3 space-y-2">
                  {txs.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No transactions in this demo session yet.</p> : txs.slice(0, 12).map(tx => (
                    <div key={tx.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                      <div className={`grid h-9 w-9 place-items-center rounded-xl ${tx.amount < 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}><Coins size={17} /></div>
                      <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{tx.description}</div><div className="text-xs text-slate-400">{new Date(tx.at).toLocaleTimeString()}</div></div>
                      <b className={tx.amount < 0 ? "text-rose-600" : "text-emerald-600"}>{tx.amount < 0 ? "−" : "+"}{Math.abs(tx.amount).toLocaleString()} {tx.description.includes("fee") ? "₦" : "pts"}</b>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {drawer === "rewards" && (
              <div className="mt-5">
                <div className="rounded-2xl bg-amber-50 p-5"><div className="text-sm font-semibold text-amber-800">Current CBT Points</div><div className="mt-1 text-3xl font-black text-amber-950">{cbtPoints.toLocaleString()}</div><p className="mt-1 text-xs text-amber-800">Separate from your Naira wallet</p></div>
                <h3 className="mt-6 font-extrabold">How to earn</h3>
                <div className="mt-3 space-y-2">
                  {[{ a: "Easy correct answer", b: "+20 points" }, { a: "Medium correct answer", b: "+30 points" }, { a: "Hard correct answer", b: "+40 points" }, { a: "Capture an opponent token", b: "+100 points" }, { a: "Win the match", b: "+500 points" }].map(item => <div key={item.a} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm"><span>{item.a}</span><b className="text-amber-700">{item.b}</b></div>)}
                </div>
                <h3 className="mt-6 font-extrabold">This session's rewards</h3>
                <div className="mt-3 space-y-2">
                  {txs.filter(tx => tx.amount > 0).length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Earn points by answering correctly and capturing tokens.</p> : txs.filter(tx => tx.amount > 0).map(tx => <div key={tx.id} className="flex justify-between rounded-xl border border-slate-100 p-3 text-sm"><span>{tx.description}</span><b className="text-emerald-700">+{tx.amount}</b></div>)}
                </div>
              </div>
            )}

            {drawer === "move" && (
              <div className="mt-5">
                <p className="text-sm leading-6 text-slate-600">Choose a legal move. A combined move uses both dice. An individual move consumes one die and then offers moves for the remaining die, if possible.</p>
                {moveMessage && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{moveMessage}</p>}
                <div className="mt-4 space-y-2">
                  {currentLegal.map((move, i) => (
                    <button key={`${move.tokenId}-${move.steps}-${move.description}-${i}`} onClick={() => doSelectedMove(move)} className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-400 hover:bg-indigo-50">
                      <div className="font-bold">{move.description}</div>
                      <div className="mt-1 text-xs text-slate-500">{move.entersFromBase ? "Enter from base" : `Token ${(Number(move.tokenId.split("-").pop()) || 0) + 1}`} · {move.dieIndex !== undefined ? `Die ${move.dieIndex + 1}: ${move.die}` : `Dice ${dice[0]} + ${dice[1]}`}</div>
                    </button>
                  ))}
                </div>
                {currentLegal.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No legal moves available.</p>}
              </div>
            )}
          </aside>
        </div>
      )}

      {confirmExit && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4">
          <section role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-rose-50 text-rose-600"><Info size={23} /></div>
            <h2 className="mt-4 text-xl font-black">Exit this match?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Your current match progress will be abandoned. Completed demo wallet transactions remain in this session.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmExit(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold">Continue playing</button>
              <button onClick={exitGame} className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white">Exit match</button>
            </div>
          </section>
        </div>
      )}

      {toast && phase !== "countdown" && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
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
