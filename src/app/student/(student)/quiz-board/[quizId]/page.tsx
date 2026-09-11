




"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  Clock3,
  Crown,
  Flame,
  Lock,
  Medal,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
  X,
} from "lucide-react";

type RoundNumber = 1 | 2 | 3 | 4 | 5;

type Player = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  responseTime?: number;
  status: "active" | "qualified" | "eliminated" | "winner";
};

type AnswerRecord = {
  playerId: string;
  playerName: string;
  answer: string;
  time: number;
  correct: boolean;
};

type Question = {
  id: number;
  question: string;
  options: {
    id: "A" | "B" | "C" | "D";
    text: string;
  }[];
  correctAnswer: "A" | "B" | "C" | "D";
};

const ROUND_CONFIG: Record<
  RoundNumber,
  {
    name: string;
    players: number;
    qualifiers: number;
  }
> = {
  1: {
    name: "Opening Round",
    players: 20,
    qualifiers: 15,
  },
  2: {
    name: "Elimination Round",
    players: 15,
    qualifiers: 10,
  },
  3: {
    name: "Pressure Round",
    players: 10,
    qualifiers: 5,
  },
  4: {
    name: "Semi-Final",
    players: 5,
    qualifiers: 2,
  },
  5: {
    name: "Grand Final",
    players: 2,
    qualifiers: 1,
  },
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question:
      "Which organelle is primarily responsible for producing ATP during aerobic respiration?",
    options: [
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Ribosome" },
      { id: "C", text: "Mitochondrion" },
      { id: "D", text: "Golgi apparatus" },
    ],
    correctAnswer: "C",
  },
  {
    id: 2,
    question:
      "Which blood vessel carries oxygenated blood from the lungs to the heart?",
    options: [
      { id: "A", text: "Pulmonary artery" },
      { id: "B", text: "Pulmonary vein" },
      { id: "C", text: "Aorta" },
      { id: "D", text: "Vena cava" },
    ],
    correctAnswer: "B",
  },
  {
    id: 3,
    question: "What is the main site of gaseous exchange in the human lungs?",
    options: [
      { id: "A", text: "Bronchi" },
      { id: "B", text: "Trachea" },
      { id: "C", text: "Alveoli" },
      { id: "D", text: "Diaphragm" },
    ],
    correctAnswer: "C",
  },
  {
    id: 4,
    question:
      "Which process describes the movement of water molecules through a selectively permeable membrane?",
    options: [
      { id: "A", text: "Diffusion" },
      { id: "B", text: "Osmosis" },
      { id: "C", text: "Active transport" },
      { id: "D", text: "Transpiration" },
    ],
    correctAnswer: "B",
  },
  {
    id: 5,
    question:
      "Which part of the brain is mainly responsible for balance and coordination?",
    options: [
      { id: "A", text: "Cerebrum" },
      { id: "B", text: "Medulla" },
      { id: "C", text: "Cerebellum" },
      { id: "D", text: "Hypothalamus" },
    ],
    correctAnswer: "C",
  },
];

const INITIAL_PLAYERS: Player[] = [
  { id: "p1", name: "David", avatar: "DA", score: 0, status: "active" },
  { id: "p2", name: "Sarah", avatar: "SA", score: 0, status: "active" },
  { id: "p3", name: "Michael", avatar: "MI", score: 0, status: "active" },
  { id: "p4", name: "John", avatar: "JO", score: 0, status: "active" },
  { id: "p5", name: "Blessing", avatar: "BL", score: 0, status: "active" },
  { id: "p6", name: "Daniel", avatar: "DN", score: 0, status: "active" },
  { id: "p7", name: "Mary", avatar: "MA", score: 0, status: "active" },
  { id: "p8", name: "Samuel", avatar: "SA", score: 0, status: "active" },
  { id: "p9", name: "Esther", avatar: "ES", score: 0, status: "active" },
  { id: "p10", name: "Emmanuel", avatar: "EM", score: 0, status: "active" },
  { id: "p11", name: "Grace", avatar: "GR", score: 0, status: "active" },
  { id: "p12", name: "Peter", avatar: "PE", score: 0, status: "active" },
  { id: "p13", name: "Joy", avatar: "JO", score: 0, status: "active" },
  { id: "p14", name: "Ibrahim", avatar: "IB", score: 0, status: "active" },
  { id: "p15", name: "Faith", avatar: "FA", score: 0, status: "active" },
  { id: "p16", name: "Joshua", avatar: "JU", score: 0, status: "active" },
  { id: "p17", name: "Ruth", avatar: "RU", score: 0, status: "active" },
  { id: "p18", name: "Victor", avatar: "VI", score: 0, status: "active" },
  { id: "p19", name: "Helen", avatar: "HE", score: 0, status: "active" },
  { id: "p20", name: "Anthony", avatar: "AN", score: 0, status: "active" },
];

const MOCK_ANSWERS: AnswerRecord[] = [
  {
    playerId: "p4",
    playerName: "John",
    answer: "C",
    time: 1.82,
    correct: true,
  },
  {
    playerId: "p7",
    playerName: "Mary",
    answer: "C",
    time: 2.14,
    correct: true,
  },
  {
    playerId: "p1",
    playerName: "David",
    answer: "C",
    time: 2.71,
    correct: true,
  },
  {
    playerId: "p9",
    playerName: "Esther",
    answer: "A",
    time: 3.02,
    correct: false,
  },
  {
    playerId: "p3",
    playerName: "Michael",
    answer: "C",
    time: 3.44,
    correct: true,
  },
];

export default function QuizBoardPage() {
  const [round, setRound] = useState<RoundNumber>(1);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const [selectedAnswer, setSelectedAnswer] = useState<
    "A" | "B" | "C" | "D" | null
  >(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>(MOCK_ANSWERS);
  const [isJoined, setIsJoined] = useState(true);
  const [gameStarted, setGameStarted] = useState(true);

  const currentQuestion = QUESTIONS[questionIndex];
  const roundConfig = ROUND_CONFIG[round];

  const qualifiedCount = useMemo(() => {
    if (round === 5) {
      return 2;
    }

    return Math.max(
      0,
      players.filter((player) => player.status === "qualified").length,
    );
  }, [players, round]);

  const activePlayers = useMemo(
    () => players.filter((player) => player.status !== "eliminated"),
    [players],
  );

  const sortedAnswers = useMemo(
    () => [...answers].sort((a, b) => a.time - b.time),
    [answers],
  );

  useEffect(() => {
    if (!gameStarted || showAnswer) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setShowAnswer(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, showAnswer, questionIndex]);

  const handleAnswer = (answer: "A" | "B" | "C" | "D") => {
    if (showAnswer || selectedAnswer) return;

    setSelectedAnswer(answer);

    const responseTime = Math.max(0.5, 10 - timeLeft);

    setAnswers((current) => [
      ...current,
      {
        playerId: "current-user",
        playerName: "You",
        answer,
        time: Number(responseTime.toFixed(2)),
        correct: answer === currentQuestion.correctAnswer,
      },
    ]);

    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeLeft(10);

    setQuestionIndex((current) => {
      if (current >= QUESTIONS.length - 1) {
        return 0;
      }

      return current + 1;
    });

    setAnswers([]);
  };

  const advanceRound = () => {
    if (round >= 5) return;

    const nextRound = (round + 1) as RoundNumber;
    setRound(nextRound);

    const nextQualifierCount = ROUND_CONFIG[nextRound].qualifiers;

    setPlayers((current) =>
      current.map((player, index) => ({
        ...player,
        status:
          index < nextQualifierCount ? "qualified" : "eliminated",
      })),
    );

    setQuestionIndex(0);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setAnswers(MOCK_ANSWERS);
  };

  const resetGame = () => {
    setRound(1);
    setPlayers(INITIAL_PLAYERS);
    setQuestionIndex(0);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setAnswers(MOCK_ANSWERS);
    setGameStarted(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight sm:text-lg">
                  Quiz Board
                </h1>

                <span className="flex items-center gap-1 rounded-full border border-red-400/20 bg-red-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Live
                </span>
              </div>

              <p className="hidden text-xs text-slate-500 sm:block">
                Fastest correct answer wins the race
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">
              <Zap className="h-4 w-4 text-amber-400" />

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  Entry
                </p>

                <p className="text-sm font-black text-white">
                  5 CBT Points
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-indigo-100">
              <Users className="h-4 w-4" />

              <span className="text-sm font-black">
                {activePlayers.length}/20
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        {/* ROUND PROGRESSION */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10 sm:p-5">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
                Competition Progress
              </p>

              <h2 className="text-xl font-black text-white sm:text-2xl">
                20 Players. One Champion.
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-indigo-400/10 bg-indigo-500/10 px-4 py-2.5">
              <Trophy className="h-5 w-5 text-indigo-400" />

              <div>
                <p className="text-[10px] font-bold uppercase text-indigo-300/60">
                  Current Round
                </p>

                <p className="text-sm font-black text-indigo-200">
                  Round {round} — {roundConfig.name}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as RoundNumber[]).map((roundNumber) => {
              const config = ROUND_CONFIG[roundNumber];
              const isCurrent = round === roundNumber;
              const isComplete = roundNumber < round;

              return (
                <div key={roundNumber} className="relative">
                  <div
                    className={[
                      "flex min-h-[74px] flex-col justify-between rounded-xl border p-3 transition",
                      isCurrent
                        ? "border-indigo-400/40 bg-indigo-500/10 shadow-lg shadow-indigo-950/20"
                        : isComplete
                          ? "border-emerald-400/20 bg-emerald-500/[0.07]"
                          : "border-white/10 bg-white/[0.02]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={[
                          "text-[10px] font-black uppercase",
                          isCurrent
                            ? "text-indigo-400"
                            : isComplete
                              ? "text-emerald-400"
                              : "text-slate-500",
                        ].join(" ")}
                      >
                        Round {roundNumber}
                      </span>

                      {isComplete ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-slate-600" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-black text-white">
                        {config.players} → {config.qualifiers}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        {config.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* LEFT */}
          <section className="space-y-6">
            {/* LIVE QUESTION CARD */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              {/* Question top bar */}
              <div className="border-b border-white/10 bg-black/30 px-5 py-4 text-white sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                        Round {round}
                      </span>

                      <span className="text-white/30">•</span>

                      <span className="text-xs font-bold text-white/60">
                        Question {questionIndex + 1}
                      </span>
                    </div>

                    <p className="text-xs text-white/40">
                      First correct response qualifies ahead of slower
                      competitors
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2">
                    <Clock3 className="h-4 w-4 text-amber-300" />

                    <span
                      className={[
                        "font-mono text-lg font-black",
                        timeLeft <= 3 ? "text-red-300" : "text-white",
                      ].join(" ")}
                    >
                      00:{String(timeLeft).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                {/* Progress */}
                <div className="mb-7">
                  <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Question Progress</span>

                    <span>
                      {questionIndex + 1}/{QUESTIONS.length}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${
                          ((questionIndex + 1) / QUESTIONS.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mx-auto max-w-4xl text-center">
                  <p className="mb-8 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {currentQuestion.question}
                  </p>

                  {/* Answers */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedAnswer === option.id;

                      const isCorrect =
                        showAnswer &&
                        option.id === currentQuestion.correctAnswer;

                      const isWrong =
                        showAnswer &&
                        isSelected &&
                        option.id !== currentQuestion.correctAnswer;

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleAnswer(option.id)}
                          disabled={showAnswer || !isJoined}
                          className={[
                            "group relative flex min-h-[76px] items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-all duration-200",
                            !showAnswer && !selectedAnswer
                              ? "border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-indigo-500/[0.07] hover:shadow-lg hover:shadow-indigo-950/20"
                              : "",
                            isSelected && !showAnswer
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "",
                            isCorrect
                              ? "border-emerald-500/70 bg-emerald-500/10"
                              : "",
                            isWrong
                              ? "border-red-500/70 bg-red-500/10"
                              : "",
                            showAnswer &&
                            !isCorrect &&
                            !isWrong
                              ? "border-white/10 opacity-50"
                              : "",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black transition",
                              isCorrect
                                ? "bg-emerald-500 text-white"
                                : isWrong
                                  ? "bg-red-500 text-white"
                                  : "bg-white/10 text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-300",
                            ].join(" ")}
                          >
                            {isCorrect ? (
                              <Check className="h-5 w-5" />
                            ) : isWrong ? (
                              <X className="h-5 w-5" />
                            ) : (
                              option.id
                            )}
                          </span>

                          <span className="text-sm font-bold leading-relaxed text-slate-200 sm:text-base">
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Answer status */}
                {showAnswer && (
                  <div className="mx-auto mt-7 flex max-w-4xl flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-emerald-300">
                          Correct answer: {currentQuestion.correctAnswer}
                        </p>

                        <p className="text-xs text-emerald-400/70">
                          The response board has been updated.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-500"
                    >
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FASTEST ANSWERS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
              <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-400" />

                    <h2 className="text-lg font-black text-white">
                      Fastest Correct Answers
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Live response order for this question
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {sortedAnswers.length} responses
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {sortedAnswers.length === 0 ? (
                  <div className="p-10 text-center">
                    <Clock3 className="mx-auto mb-3 h-8 w-8 text-slate-700" />

                    <p className="text-sm font-bold text-slate-500">
                      Waiting for responses...
                    </p>
                  </div>
                ) : (
                  sortedAnswers.map((answer, index) => (
                    <div
                      key={`${answer.playerId}-${index}`}
                      className={[
                        "flex items-center gap-3 px-5 py-4 transition",
                        index === 0 && answer.correct
                          ? "bg-amber-500/[0.06]"
                          : "",
                      ].join(" ")}
                    >
                      <div className="flex w-8 justify-center">
                        {index === 0 && answer.correct ? (
                          <Crown className="h-5 w-5 text-amber-400" />
                        ) : (
                          <span className="text-sm font-black text-slate-600">
                            #{index + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-black text-slate-300">
                        {answer.playerName.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">
                          {answer.playerName}
                        </p>

                        <p className="text-xs text-slate-500">
                          Selected answer {answer.answer}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={[
                            "font-mono text-sm font-black",
                            answer.correct
                              ? "text-emerald-400"
                              : "text-red-400",
                          ].join(" ")}
                        >
                          {answer.time.toFixed(2)}s
                        </p>

                        <p
                          className={[
                            "text-[9px] font-black uppercase",
                            answer.correct
                              ? "text-emerald-400/70"
                              : "text-red-400/70",
                          ].join(" ")}
                        >
                          {answer.correct ? "Correct" : "Wrong"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            {/* QUALIFICATION */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400">
                    Qualification
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Next Round
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/10">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                </div>
              </div>

              <div className="mb-3 flex items-end justify-between">
                <div>
                  <span className="text-3xl font-black tracking-tight text-white">
                    {round === 5 ? 2 : roundConfig.qualifiers}
                  </span>

                  <span className="ml-1 text-sm font-bold text-slate-500">
                    players
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  of {roundConfig.players}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{
                    width: `${
                      round === 5
                        ? 100
                        : Math.min(
                            100,
                            (qualifiedCount / roundConfig.qualifiers) *
                              100,
                          )
                    }%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>
                  {round === 5
                    ? "Finalists ready"
                    : `${qualifiedCount} qualified`}
                </span>

                <span>
                  {round === 5
                    ? "2 → 1"
                    : `${roundConfig.players} → ${roundConfig.qualifiers}`}
                </span>
              </div>
            </div>

            {/* CURRENT PLAYER */}
            <div className="overflow-hidden rounded-3xl border border-indigo-400/20 bg-indigo-600 text-white shadow-xl shadow-indigo-950/20">
              <div className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-200">
                      Your Position
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      You are in the race
                    </h2>
                  </div>

                  <Sparkles className="h-6 w-6 text-indigo-200" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-sm font-black">
                    YO
                  </div>

                  <div>
                    <p className="font-black">You</p>

                    <p className="text-xs text-indigo-200">
                      {selectedAnswer
                        ? "Answer submitted"
                        : "Waiting for your answer"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-[9px] font-bold uppercase text-indigo-200">
                      Round
                    </p>

                    <p className="mt-1 text-lg font-black">
                      {round}/5
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-[9px] font-bold uppercase text-indigo-200">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-black">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PLAYERS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Players
                  </h2>

                  <p className="text-xs text-slate-500">
                    Live competition board
                  </p>
                </div>

                <Users className="h-5 w-5 text-slate-600" />
              </div>

              <div className="max-h-[430px] divide-y divide-white/10 overflow-y-auto">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <span className="w-5 text-center text-[10px] font-black text-slate-600">
                      {index + 1}
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[10px] font-black text-slate-300">
                      {player.avatar}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black text-white">
                        {player.name}
                      </p>

                      <p className="text-[9px] font-bold text-slate-600">
                        {player.score} points
                      </p>
                    </div>

                    {player.status === "qualified" ? (
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[8px] font-black uppercase text-emerald-400">
                        Qualified
                      </span>
                    ) : player.status === "eliminated" ? (
                      <span className="rounded-full border border-red-400/20 bg-red-500/10 px-2 py-1 text-[8px] font-black uppercase text-red-400">
                        Out
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIN / DEMO CONTROLS */}
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Play className="h-4 w-4 text-slate-500" />

                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Demo Controls
                </p>
              </div>

              <div className="grid gap-2">
                {round < 5 && (
                  <button
                    onClick={advanceRound}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-black text-white transition hover:bg-indigo-500"
                  >
                    Simulate Next Round
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={resetGame}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Reset Demo
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* FINAL ROUND PANEL */}
        {round === 5 && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-amber-400/20 bg-white/[0.04] shadow-xl shadow-black/20">
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-5 py-7 text-white sm:px-8">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                  <Crown className="h-7 w-7" />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                  Grand Final
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                  Two Players. Twenty Questions. One Winner.
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                  The fastest-answer elimination is over. Both finalists
                  now compete across 20 questions. The player with the
                  highest total score becomes the Quiz Board Champion.
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
              {players
                .filter((player) => player.status !== "eliminated")
                .slice(0, 2)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                  >
                    {index === 0 && (
                      <div className="absolute right-4 top-4">
                        <Medal className="h-6 w-6 text-amber-400" />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white">
                        {player.avatar}
                      </div>

                      <div>
                        <p className="text-lg font-black text-white">
                          {player.name}
                        </p>

                        <p className="text-xs font-bold text-slate-500">
                          Finalist #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <p className="text-[9px] font-black uppercase text-slate-500">
                          Score
                        </p>

                        <p className="mt-1 text-xl font-black text-white">
                          {player.score}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <p className="text-[9px] font-black uppercase text-slate-500">
                          Questions
                        </p>

                        <p className="mt-1 text-xl font-black text-white">
                          20
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="border-t border-white/10 bg-white/[0.02] px-5 py-4 text-center">
              <p className="text-xs font-bold text-slate-500">
                Final scoring: correct answers earn points. Highest score
                after Question 20 wins the championship.
              </p>
            </div>
          </section>
        )}

        {/* FOOTER INFO */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Award className="h-4 w-4 text-indigo-400" />

            <p className="text-xs font-bold text-slate-500">
              Play fairly. Your response time is recorded by the server.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-600">
            <Lock className="h-3.5 w-3.5" />
            Secure Competition
          </div>
        </div>
      </div>
    </main>
  );
}