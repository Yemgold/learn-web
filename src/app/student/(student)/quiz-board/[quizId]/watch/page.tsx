



"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock3,
  Eye,
  Flame,
  Medal,
  Radio,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type RoundNumber = 1 | 2 | 3 | 4 | 5;

type PlayerStatus =
  | "ACTIVE"
  | "QUALIFIED"
  | "ELIMINATED"
  | "FINALIST"
  | "WINNER";

type AnswerStatus = "CORRECT" | "WRONG";

type QuizPlayer = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  responseTime: number | null;
  status: PlayerStatus;
  correctAnswers: number;
  answered: boolean;
  lastAnswer: string | null;
};

type LiveAnswer = {
  id: string;
  playerId: string;
  playerName: string;
  answer: string;
  responseTime: number;
  status: AnswerStatus;
};

type QuizQuestion = {
  id: string;
  questionNumber: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
};

type RoundConfig = {
  round: RoundNumber;
  label: string;
  from: number;
  to: number;
  questions: number;
};

// -----------------------------------------------------------------------------
// ROUND CONFIGURATION
// -----------------------------------------------------------------------------

const ROUND_CONFIG: RoundConfig[] = [
  {
    round: 1,
    label: "Round 1",
    from: 20,
    to: 15,
    questions: 10,
  },
  {
    round: 2,
    label: "Round 2",
    from: 15,
    to: 10,
    questions: 10,
  },
  {
    round: 3,
    label: "Round 3",
    from: 10,
    to: 5,
    questions: 10,
  },
  {
    round: 4,
    label: "Round 4",
    from: 5,
    to: 2,
    questions: 10,
  },
  {
    round: 5,
    label: "Final",
    from: 2,
    to: 1,
    questions: 20,
  },
];

// -----------------------------------------------------------------------------
// MOCK PLAYERS
// -----------------------------------------------------------------------------

const MOCK_PLAYERS: QuizPlayer[] = [
  {
    id: "p1",
    name: "Daniel Okafor",
    avatar: "DO",
    score: 86,
    responseTime: 1.24,
    status: "ACTIVE",
    correctAnswers: 8,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    avatar: "SJ",
    score: 82,
    responseTime: 1.48,
    status: "ACTIVE",
    correctAnswers: 8,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p3",
    name: "Michael Adeyemi",
    avatar: "MA",
    score: 78,
    responseTime: 1.73,
    status: "ACTIVE",
    correctAnswers: 7,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p4",
    name: "Blessing Peter",
    avatar: "BP",
    score: 75,
    responseTime: 1.91,
    status: "ACTIVE",
    correctAnswers: 7,
    answered: true,
    lastAnswer: "C",
  },
  {
    id: "p5",
    name: "David Williams",
    avatar: "DW",
    score: 70,
    responseTime: 2.08,
    status: "ACTIVE",
    correctAnswers: 7,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p6",
    name: "Grace Ibrahim",
    avatar: "GI",
    score: 68,
    responseTime: 2.21,
    status: "ACTIVE",
    correctAnswers: 6,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p7",
    name: "Samuel Joseph",
    avatar: "SJ",
    score: 65,
    responseTime: 2.42,
    status: "ACTIVE",
    correctAnswers: 6,
    answered: true,
    lastAnswer: "A",
  },
  {
    id: "p8",
    name: "Esther James",
    avatar: "EJ",
    score: 63,
    responseTime: 2.55,
    status: "ACTIVE",
    correctAnswers: 6,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p9",
    name: "Victor Musa",
    avatar: "VM",
    score: 60,
    responseTime: 2.73,
    status: "ACTIVE",
    correctAnswers: 6,
    answered: true,
    lastAnswer: "D",
  },
  {
    id: "p10",
    name: "Mercy Okoro",
    avatar: "MO",
    score: 57,
    responseTime: 2.91,
    status: "ACTIVE",
    correctAnswers: 5,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p11",
    name: "John Peter",
    avatar: "JP",
    score: 54,
    responseTime: 3.12,
    status: "ACTIVE",
    correctAnswers: 5,
    answered: true,
    lastAnswer: "C",
  },
  {
    id: "p12",
    name: "Ruth Daniel",
    avatar: "RD",
    score: 51,
    responseTime: 3.28,
    status: "ACTIVE",
    correctAnswers: 5,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p13",
    name: "Emmanuel Paul",
    avatar: "EP",
    score: 48,
    responseTime: 3.45,
    status: "ACTIVE",
    correctAnswers: 4,
    answered: true,
    lastAnswer: "A",
  },
  {
    id: "p14",
    name: "Joy Williams",
    avatar: "JW",
    score: 46,
    responseTime: 3.62,
    status: "ACTIVE",
    correctAnswers: 4,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p15",
    name: "Anthony Bello",
    avatar: "AB",
    score: 43,
    responseTime: 3.81,
    status: "ACTIVE",
    correctAnswers: 4,
    answered: true,
    lastAnswer: "B",
  },
  {
    id: "p16",
    name: "Faith James",
    avatar: "FJ",
    score: 40,
    responseTime: 4.02,
    status: "ELIMINATED",
    correctAnswers: 4,
    answered: true,
    lastAnswer: "D",
  },
  {
    id: "p17",
    name: "Chris Daniel",
    avatar: "CD",
    score: 37,
    responseTime: 4.25,
    status: "ELIMINATED",
    correctAnswers: 3,
    answered: true,
    lastAnswer: "A",
  },
  {
    id: "p18",
    name: "Mary Joseph",
    avatar: "MJ",
    score: 34,
    responseTime: 4.47,
    status: "ELIMINATED",
    correctAnswers: 3,
    answered: true,
    lastAnswer: "C",
  },
  {
    id: "p19",
    name: "Peter Adams",
    avatar: "PA",
    score: 31,
    responseTime: 4.69,
    status: "ELIMINATED",
    correctAnswers: 3,
    answered: true,
    lastAnswer: "D",
  },
  {
    id: "p20",
    name: "Linda George",
    avatar: "LG",
    score: 28,
    responseTime: 4.93,
    status: "ELIMINATED",
    correctAnswers: 2,
    answered: true,
    lastAnswer: "A",
  },
];

// -----------------------------------------------------------------------------
// MOCK QUESTION
// -----------------------------------------------------------------------------

const MOCK_QUESTION: QuizQuestion = {
  id: "biology-001",
  questionNumber: 7,
  question:
    "Which structure in a plant cell is primarily responsible for controlling the movement of substances into and out of the cell?",
  options: [
    {
      id: "A",
      text: "Cell wall",
    },
    {
      id: "B",
      text: "Cell membrane",
    },
    {
      id: "C",
      text: "Cytoplasm",
    },
    {
      id: "D",
      text: "Nucleus",
    },
  ],
  correctAnswer: "B",
};

// -----------------------------------------------------------------------------
// MOCK LIVE ANSWERS
// -----------------------------------------------------------------------------

const MOCK_ANSWERS: LiveAnswer[] = [
  {
    id: "answer-1",
    playerId: "p1",
    playerName: "Daniel Okafor",
    answer: "B",
    responseTime: 1.24,
    status: "CORRECT",
  },
  {
    id: "answer-2",
    playerId: "p2",
    playerName: "Sarah Johnson",
    answer: "B",
    responseTime: 1.48,
    status: "CORRECT",
  },
  {
    id: "answer-3",
    playerId: "p3",
    playerName: "Michael Adeyemi",
    answer: "B",
    responseTime: 1.73,
    status: "CORRECT",
  },
  {
    id: "answer-4",
    playerId: "p4",
    playerName: "Blessing Peter",
    answer: "C",
    responseTime: 1.91,
    status: "WRONG",
  },
  {
    id: "answer-5",
    playerId: "p5",
    playerName: "David Williams",
    answer: "B",
    responseTime: 2.08,
    status: "CORRECT",
  },
];

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function getRoundConfig(round: RoundNumber) {
  return ROUND_CONFIG.find((item) => item.round === round)!;
}

// -----------------------------------------------------------------------------
// PAGE
// -----------------------------------------------------------------------------

export default function QuizBoardWatchPage() {
  const params = useParams();

  const quizId =
    typeof params?.quizId === "string"
      ? params.quizId
      : Array.isArray(params?.quizId)
        ? params.quizId[0]
        : "";

  const [round, setRound] = useState<RoundNumber>(1);

  const [question, setQuestion] =
    useState<QuizQuestion>(MOCK_QUESTION);

  const [timeLeft, setTimeLeft] = useState(8);

  const [questionEnded, setQuestionEnded] = useState(false);

  const [answers, setAnswers] =
    useState<LiveAnswer[]>(MOCK_ANSWERS);

  const [players, setPlayers] =
    useState<QuizPlayer[]>(MOCK_PLAYERS);

  const [viewerCount, setViewerCount] = useState(37);

  const roundConfig = useMemo(
    () => getRoundConfig(round),
    [round],
  );

  const activePlayers = useMemo(
    () =>
      players.filter(
        (player) =>
          player.status !== "ELIMINATED" &&
          player.status !== "WINNER",
      ),
    [players],
  );

  const sortedPlayers = useMemo(
    () =>
      [...players].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return (
          (a.responseTime ?? Number.MAX_SAFE_INTEGER) -
          (b.responseTime ?? Number.MAX_SAFE_INTEGER)
        );
      }),
    [players],
  );

  const firstCorrectAnswer = useMemo(
    () =>
      answers
        .filter((answer) => answer.status === "CORRECT")
        .sort(
          (a, b) =>
            a.responseTime - b.responseTime,
        )[0],
    [answers],
  );

  // ---------------------------------------------------------------------------
  // MOCK QUESTION TIMER
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (questionEnded) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setQuestionEnded(true);

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [questionEnded]);

  // ---------------------------------------------------------------------------
  // MOCK VIEWER COUNT
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const interval = window.setInterval(() => {
      setViewerCount((current) => {
        const change =
          Math.random() > 0.5 ? 1 : -1;

        return Math.max(1, current + change);
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // NEXT QUESTION
  // ---------------------------------------------------------------------------

  const handleNextQuestion = () => {
    setQuestionEnded(false);
    setTimeLeft(8);

    setQuestion((current) => ({
      ...current,
      questionNumber:
        current.questionNumber + 1,
    }));

    setAnswers([]);

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        answered: false,
        responseTime: null,
        lastAnswer: null,
      })),
    );
  };

  // ---------------------------------------------------------------------------
  // DEVELOPMENT ROUND SWITCH
  // ---------------------------------------------------------------------------

  const handleShowRound = (
    nextRound: RoundNumber,
  ) => {
    setRound(nextRound);
    setQuestionEnded(false);
    setTimeLeft(8);
    setAnswers([]);

    setQuestion((current) => ({
      ...current,
      questionNumber: 1,
    }));

    const config = getRoundConfig(nextRound);

    setPlayers((currentPlayers) =>
      currentPlayers.map(
        (player, index) => {
          if (nextRound === 5) {
            if (index === 0 || index === 1) {
              return {
                ...player,
                status: "FINALIST",
              };
            }

            return {
              ...player,
              status: "ELIMINATED",
            };
          }

          if (index < config.to) {
            return {
              ...player,
              status: "ACTIVE",
            };
          }

          return {
            ...player,
            status: "ELIMINATED",
          };
        },
      ),
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-950 pb-16 text-white">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <Link href="/student/quiz-board">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">
                  Quiz Board
                </h1>

                <Badge className="gap-1 border border-red-500/20 bg-red-500/15 text-red-300 hover:bg-red-500/15">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                  LIVE
                </Badge>
              </div>

              <p className="text-xs text-slate-400">
                Biology Speed Challenge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 sm:flex">
              <Eye className="h-4 w-4" />
              <span>{viewerCount} watching</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
              <Users className="h-4 w-4 text-blue-400" />

              <span className="font-semibold">
                {activePlayers.length}
              </span>

              <span className="hidden text-slate-400 sm:inline">
                playing
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* CONTENT */}
      {/* ================================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ================================================================ */}
        {/* SPECTATOR NOTICE */}
        {/* ================================================================ */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
              <Eye className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-blue-200">
                You are watching this Quiz Board
              </p>

              <p className="text-sm text-blue-300/80">
                You are a spectator. Answers are locked and
                you cannot affect the competition.
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="w-fit border-blue-400/30 bg-blue-500/10 text-blue-300"
          >
            Spectator
          </Badge>
        </div>

        {/* ================================================================ */}
        {/* ROUND PROGRESS */}
        {/* ================================================================ */}

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Competition Progress
              </p>

              <h2 className="text-xl font-bold text-white">
                {roundConfig.label}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">
                Players remaining
              </p>

              <p className="text-xl font-bold text-blue-400">
                {activePlayers.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {ROUND_CONFIG.map((item) => {
              const isCurrent =
                item.round === round;

              const isCompleted =
                item.round < round;

              return (
                <button
                  key={item.round}
                  type="button"
                  onClick={() =>
                    handleShowRound(item.round)
                  }
                  className={`rounded-xl border p-3 text-left transition ${
                    isCurrent
                      ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.08)]"
                      : isCompleted
                        ? "border-green-500/20 bg-green-500/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isCurrent
                          ? "text-blue-300"
                          : isCompleted
                            ? "text-green-300"
                            : "text-slate-500"
                      }`}
                    >
                      {item.round === 5
                        ? "FINAL"
                        : `R${item.round}`}
                    </span>

                    {isCompleted && (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400">
                    {item.from} → {item.to}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================================================================ */}
        {/* MAIN GRID */}
        {/* ================================================================ */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ============================================================ */}
          {/* LEFT COLUMN */}
          {/* ============================================================ */}

          <div className="space-y-6">
            {/* ========================================================== */}
            {/* QUESTION */}
            {/* ========================================================== */}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <div className="border-b border-white/10 bg-black/20 px-5 py-4 text-white sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Badge className="border border-white/10 bg-white/10 text-white hover:bg-white/10">
                        {roundConfig.label}
                      </Badge>

                      <span className="text-sm text-slate-400">
                        Question{" "}
                        {question.questionNumber} of{" "}
                        {roundConfig.questions}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500">
                      Biology • Medium Difficulty
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-slate-400" />

                    <span
                      className={`text-2xl font-black ${
                        timeLeft <= 3
                          ? "text-red-400"
                          : "text-white"
                      }`}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
                    {question.question}
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map(
                    (option) => {
                      const isCorrect =
                        questionEnded &&
                        option.id ===
                          question.correctAnswer;

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start gap-3 rounded-xl border p-4 ${
                            isCorrect
                              ? "border-green-500/30 bg-green-500/10"
                              : "border-white/10 bg-white/[0.025]"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold ${
                              isCorrect
                                ? "bg-green-500 text-white"
                                : "bg-white/10 text-slate-200"
                            }`}
                          >
                            {option.id}
                          </div>

                          <div className="flex-1 pt-1">
                            <p className="font-medium text-slate-200">
                              {option.text}
                            </p>
                          </div>

                          {isCorrect && (
                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-400" />
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                {!questionEnded && (
                  <div className="mt-5 flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Radio className="h-4 w-4 animate-pulse text-red-400" />

                      <span>
                        Watching responses come in from
                        the players...
                      </span>
                    </div>
                  </div>
                )}

                {questionEnded && (
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />

                      <div>
                        <p className="font-semibold text-green-300">
                          Question completed
                        </p>

                        <p className="text-sm text-green-300/70">
                          The correct answer has been
                          revealed.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleNextQuestion}
                      className="hidden border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10 hover:text-white sm:flex"
                    >
                      Next Question
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* ========================================================== */}
            {/* FASTEST CORRECT */}
            {/* ========================================================== */}

            {firstCorrectAnswer && (
              <section className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 shadow-sm">
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/15">
                      <Zap className="h-6 w-6 text-yellow-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-yellow-200">
                          Fastest correct answer
                        </p>

                        <Badge className="border border-yellow-400/20 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20">
                          #1
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm text-yellow-300/80">
                        <span className="font-semibold text-yellow-200">
                          {
                            firstCorrectAnswer.playerName
                          }
                        </span>{" "}
                        answered{" "}
                        <span className="font-bold text-yellow-200">
                          {firstCorrectAnswer.answer}
                        </span>{" "}
                        in{" "}
                        <span className="font-bold text-yellow-200">
                          {firstCorrectAnswer.responseTime.toFixed(
                            2,
                          )}
                          s
                        </span>
                      </p>
                    </div>

                    <Flame className="hidden h-7 w-7 text-orange-400 sm:block" />
                  </div>
                </div>
              </section>
            )}

            {/* ========================================================== */}
            {/* RESPONSE FEED */}
            {/* ========================================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    <Radio className="h-5 w-5 text-red-400" />
                    Live Response Feed
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Responses are ranked by server-recorded
                    response time.
                  </p>
                </div>

                <Badge className="border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.04]">
                  {answers.length}/
                  {activePlayers.length}
                </Badge>
              </div>

              <div className="space-y-2 p-5">
                {answers.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                    <Radio className="mx-auto mb-3 h-7 w-7 text-slate-600" />

                    <p className="font-medium text-slate-300">
                      Waiting for responses
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Player responses will appear here
                      in real time.
                    </p>
                  </div>
                ) : (
                  answers
                    .slice()
                    .sort(
                      (a, b) =>
                        a.responseTime -
                        b.responseTime,
                    )
                    .map(
                      (answer, index) => (
                        <div
                          key={answer.id}
                          className={`flex items-center gap-3 rounded-xl border p-3 ${
                            index === 0 &&
                            answer.status ===
                              "CORRECT"
                              ? "border-yellow-500/20 bg-yellow-500/10"
                              : "border-white/10 bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-slate-300">
                            {index + 1}
                          </div>

                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-300">
                              {answer.playerName
                                .split(" ")
                                .map(
                                  (part) =>
                                    part[0],
                                )
                                .slice(0, 2)
                                .join("")}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-200">
                                {answer.playerName}
                              </p>

                              <p className="text-xs text-slate-500">
                                Answered{" "}
                                {answer.answer}{" "}
                                •{" "}
                                {answer.responseTime.toFixed(
                                  2,
                                )}
                                s
                              </p>
                            </div>
                          </div>

                          {answer.status ===
                          "CORRECT" ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                          )}
                        </div>
                      ),
                    )
                )}
              </div>
            </section>

            {/* ========================================================== */}
            {/* MOBILE NEXT */}
            {/* ========================================================== */}

            {questionEnded && (
              <Button
                type="button"
                onClick={handleNextQuestion}
                className="w-full bg-blue-600 text-white hover:bg-blue-500 sm:hidden"
              >
                Next Question
              </Button>
            )}
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN */}
          {/* ============================================================ */}

          <aside className="space-y-6">
            {/* ========================================================== */}
            {/* CURRENT ROUND */}
            {/* ========================================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
              <div className="border-b border-white/10 p-5">
                <h3 className="flex items-center gap-2 font-bold text-white">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  {roundConfig.label}
                </h3>
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black text-white">
                      {activePlayers.length}
                    </p>

                    <p className="text-sm text-slate-500">
                      players remaining
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      Qualification
                    </p>

                    <p className="text-lg font-bold text-green-400">
                      Top {roundConfig.to}
                    </p>
                  </div>
                </div>

                <Progress
                  value={
                    (activePlayers.length /
                      roundConfig.from) *
                    100
                  }
                  className="bg-white/10"
                />

                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>
                    {roundConfig.from} started
                  </span>

                  <span>
                    {roundConfig.to} qualify
                  </span>
                </div>
              </div>
            </section>

            {/* ========================================================== */}
            {/* STANDINGS */}
            {/* ========================================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <h3 className="flex items-center gap-2 font-bold text-white">
                  <Medal className="h-5 w-5 text-yellow-400" />
                  Live Standings
                </h3>

                <Badge className="border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.04]">
                  {players.length}
                </Badge>
              </div>

              <div className="divide-y divide-white/10">
                {sortedPlayers
                  .slice(0, 10)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        player.status ===
                        "ELIMINATED"
                          ? "opacity-40"
                          : ""
                      }`}
                    >
                      <div className="w-6 text-center text-xs font-bold text-slate-500">
                        {index + 1}
                      </div>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-slate-300">
                        {player.avatar}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-200">
                          {player.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {player.correctAnswers}{" "}
                          correct
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          {player.score}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          PTS
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {players.length > 10 && (
                <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3 text-center text-xs text-slate-500">
                  +{players.length - 10} more players
                </div>
              )}
            </section>

            {/* ========================================================== */}
            {/* QUALIFICATION */}
            {/* ========================================================== */}

            <section className="rounded-2xl border border-green-500/20 bg-green-500/10 shadow-sm">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-green-500/15 p-2">
                    <Award className="h-5 w-5 text-green-400" />
                  </div>

                  <div>
                    <p className="font-bold text-green-300">
                      Qualification Rule
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-green-300/80">
                      The fastest and most accurate players
                      advance to the next round.
                    </p>

                    <p className="mt-2 text-xs font-medium text-green-400">
                      {roundConfig.from} players →{" "}
                      {roundConfig.to} players
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* ================================================================ */}
        {/* COMPETITION INFORMATION */}
        {/* ================================================================ */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
          <div className="border-b border-white/10 p-5">
            <h3 className="font-bold text-white">
              Competition Information
            </h3>
          </div>

          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs font-medium text-slate-500">
                  Competition
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  Biology Speed Challenge
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs font-medium text-slate-500">
                  Entry Fee
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  5 CBT Points
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs font-medium text-slate-500">
                  Maximum Players
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  20 Players
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs font-medium text-slate-500">
                  Winner Reward
                </p>

                <p className="mt-1 font-semibold text-yellow-400">
                  100 CBT Points
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FOOTER */}
        {/* ================================================================ */}

        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center shadow-sm sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Radio className="h-4 w-4 text-red-400" />

            <span>
              Live competition data is broadcast in real
              time to spectators.
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Quiz ID: {quizId || "demo-quiz"}
          </p>
        </div>

        {/* ================================================================ */}
        {/* DEVELOPMENT CONTROLS */}
        {/* ================================================================ */}

        <section className="mt-8 rounded-2xl border border-dashed border-orange-500/30 bg-orange-500/10 p-4">
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-300">
              Development Preview
            </p>

            <p className="mt-1 text-xs text-orange-300/70">
              These controls simulate backend/socket events.
              Remove this section before production.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ROUND_CONFIG.map((item) => (
              <Button
                key={item.round}
                type="button"
                size="sm"
                variant={
                  round === item.round
                    ? "default"
                    : "outline"
                }
                className={
                  round === item.round
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white"
                }
                onClick={() =>
                  handleShowRound(item.round)
                }
              >
                {item.round === 5
                  ? "Final"
                  : `Round ${item.round}`}
              </Button>
            ))}

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => {
                setQuestionEnded(
                  (current) => !current,
                );

                setTimeLeft((current) =>
                  current > 0 ? 0 : 8,
                );
              }}
            >
              Toggle Result
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={handleNextQuestion}
            >
              Next Question
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}



