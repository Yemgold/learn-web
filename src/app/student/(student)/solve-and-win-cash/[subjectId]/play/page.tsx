







"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Coins,
  Flame,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";

import type { QuestionBankItem } from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions/types";
import { getQuestionBanks } from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions";

/* =========================================================
   TYPES AND CONFIGURATION
========================================================= */

type GameState = "QUESTION" | "REWARD" | "WRONG" | "TIME_UP" | "CASHED_OUT";

type Option = {
  label: string;
  text: string;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
};

type SubjectConfig = {
  name: string;
  shortName: string;
  icon: string;
};

const ROUND_DURATION_MS = 10_000;
const TIMER_UPDATE_MS = 50;

const REWARDS = [500, 550, 600, 650, 700, 750];

const SUBJECTS: Record<string, SubjectConfig> = {
  biology: { name: "Biology", shortName: "BIO", icon: "🧬" },
  chemistry: { name: "Chemistry", shortName: "CHEM", icon: "⚗️" },
  physics: { name: "Physics", shortName: "PHY", icon: "⚡" },
  mathematics: { name: "Mathematics", shortName: "MATH", icon: "📐" },
  economics: { name: "Economics", shortName: "ECON", icon: "📊" },
  accounting: { name: "Accounting", shortName: "ACC", icon: "🧾" },
};

/* =========================================================
   QUESTION BANK
========================================================= */

function extractQuestionText(item: QuestionBankItem): string {
  if (typeof item.question === "string" && item.question.trim()) {
    return item.question.trim();
  }

  const content = item.content ?? [];
  return content
    .map((block) =>
      (block.segments ?? [])
        .map((segment) => segment.text ?? "")
        .join(""),
    )
    .filter(Boolean)
    .join("\n")
    .trim();
}

function convertBankQuestion(
  item: QuestionBankItem,
  index: number,
  subjectKey: string,
): Question | null {
  const questionText = extractQuestionText(item);
  const sourceOptions = item.options ?? [];

  if (!questionText || sourceOptions.length < 4) return null;

  const options: Option[] = sourceOptions.slice(0, 4).map((option, optionIndex) => ({
    label: String(option.label || String.fromCharCode(65 + optionIndex)),
    text: String(option.value ?? ""),
  }));

  const correctValues = (item.correctAnswers ?? []).map((value) => String(value));
  const correctOption = sourceOptions.slice(0, 4).find((option) =>
    correctValues.includes(String(option.value)) ||
    correctValues.includes(String(option.label)),
  );

  if (!correctOption) return null;

  const correctAnswer = String(
    correctOption.label ||
      String.fromCharCode(65 + sourceOptions.indexOf(correctOption)),
  );

  return {
    id: `${subjectKey}-${String(item.topic ?? "question")}-${index}`,
    question: questionText,
    options,
    correctAnswer,
    explanation: String(item.explanation ?? ""),
  };
}

function getGameQuestions(subjectKey: string): Question[] {
  const banks = getQuestionBanks(subjectKey, "jamb");
  const allQuestions = [...banks.easy, ...banks.medium, ...banks.hard]
    .map((item, index) => convertBankQuestion(item, index, subjectKey))
    .filter((question): question is Question => question !== null);

  // Six questions match the game's six reward levels.
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  return allQuestions.slice(0, 6);
}

/* =========================================================
   HELPERS
========================================================= */

function formatCash(value: number) {
  return Math.max(0, Math.floor(value)).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  });
}

function calculateCashReward(maximumReward: number, remainingMs: number) {
  if (remainingMs <= 0) return 0;

  return Math.max(
    1,
    Math.ceil(maximumReward * Math.min(1, remainingMs / ROUND_DURATION_MS)),
  );
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-60";

const primaryButton =
  `${buttonBase} bg-violet-600 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500 active:scale-[0.99]`;

const secondaryButton =
  `${buttonBase} border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800 active:scale-[0.99]`;

/* =========================================================
   MAIN PAGE
========================================================= */

export default function SolveAndWinCbtPlayPage() {
  const params = useParams();
  const router = useRouter();

  const rawSubjectId = params?.subjectId;
  const subjectId = Array.isArray(rawSubjectId)
    ? rawSubjectId[0]
    : rawSubjectId;

  const normalizedSubjectId = String(subjectId ?? "biology").toLowerCase();

  const subject = SUBJECTS[normalizedSubjectId] ?? SUBJECTS.biology;

  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>("QUESTION");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [lastReward, setLastReward] = useState(0);
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState(ROUND_DURATION_MS);

  useEffect(() => {
    const questionSubject = SUBJECTS[normalizedSubjectId]
      ? normalizedSubjectId
      : "biology";
    setQuestions(getGameQuestions(questionSubject));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setLastCorrectAnswer(null);
    setLastReward(0);
    setTotalWinnings(0);
    setRemainingMs(ROUND_DURATION_MS);
    setIsSubmitting(false);
    setGameState("QUESTION");
  }, [normalizedSubjectId]);

  const roundStartedAtRef = useRef<number | null>(null);
  const answerLockedRef = useRef(false);
  const submissionTimeoutRef = useRef<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const currentReward =
    REWARDS[currentQuestionIndex] ?? REWARDS[REWARDS.length - 1];

  const currentCashValue = calculateCashReward(currentReward, remainingMs);
  const secondsRemaining = Math.ceil(remainingMs / 1000);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const isPlaying = gameState === "QUESTION";

  /* ---------------------------------------------------------
     ANSWER HANDLER
  --------------------------------------------------------- */

  const handleAnswer = useCallback(
    (answer: string) => {
      if (
        answerLockedRef.current ||
        isSubmitting ||
        gameState !== "QUESTION" ||
        !currentQuestion
      ) {
        return;
      }

      const startedAt = roundStartedAtRef.current;

      if (startedAt === null) return;

      const actualRemaining = Math.max(
        0,
        ROUND_DURATION_MS - (Date.now() - startedAt),
      );

      if (actualRemaining <= 0) {
        answerLockedRef.current = true;
        roundStartedAtRef.current = null;

        setRemainingMs(0);
        setLastCorrectAnswer(currentQuestion.correctAnswer);
        setSelectedAnswer(null);
        setGameState("TIME_UP");

        return;
      }

      answerLockedRef.current = true;
      roundStartedAtRef.current = null;

      setRemainingMs(actualRemaining);
      setSelectedAnswer(answer);
      setIsSubmitting(true);

      const lockedReward = calculateCashReward(
        currentReward,
        actualRemaining,
      );

      submissionTimeoutRef.current = window.setTimeout(() => {
        submissionTimeoutRef.current = null;
        setIsSubmitting(false);

        if (answer === currentQuestion.correctAnswer) {
          setLastReward(lockedReward);
          setTotalWinnings((previous) => previous + lockedReward);
          setGameState("REWARD");
        } else {
          setLastCorrectAnswer(currentQuestion.correctAnswer);
          setGameState("WRONG");
        }
      }, 250);
    },
    [currentQuestion, currentReward, gameState, isSubmitting],
  );

  /* ---------------------------------------------------------
     COUNTDOWN
  --------------------------------------------------------- */

  useEffect(() => {
    if (gameState !== "QUESTION" || isSubmitting || !currentQuestion) {
      return;
    }

    answerLockedRef.current = false;

    const startedAt = Date.now();

    roundStartedAtRef.current = startedAt;

    setRemainingMs(ROUND_DURATION_MS);

    const intervalId = window.setInterval(() => {
      const remaining = Math.max(
        0,
        ROUND_DURATION_MS - (Date.now() - startedAt),
      );

      setRemainingMs(remaining);

      if (remaining <= 0) {
        window.clearInterval(intervalId);

        if (!answerLockedRef.current) {
          answerLockedRef.current = true;
          roundStartedAtRef.current = null;

          setSelectedAnswer(null);
          setLastCorrectAnswer(currentQuestion.correctAnswer);
          setIsSubmitting(false);
          setGameState("TIME_UP");
        }
      }
    }, TIMER_UPDATE_MS);

    return () => window.clearInterval(intervalId);
  }, [currentQuestionIndex, currentQuestion, gameState, isSubmitting]);

  /* ---------------------------------------------------------
     CLEANUP
  --------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (submissionTimeoutRef.current !== null) {
        window.clearTimeout(submissionTimeoutRef.current);
      }
    };
  }, []);

  /* ---------------------------------------------------------
     GAME ACTIONS
  --------------------------------------------------------- */

  const handleWinMore = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setGameState("CASHED_OUT");
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
    setLastReward(0);
    setLastCorrectAnswer(null);
    setRemainingMs(ROUND_DURATION_MS);
    setIsSubmitting(false);
    setGameState("QUESTION");
  };

  const handleCashOut = () => {
    setGameState("CASHED_OUT");
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setLastCorrectAnswer(null);
    setLastReward(0);
    setRemainingMs(ROUND_DURATION_MS);
    setIsSubmitting(false);
    setGameState("QUESTION");
  };

  const handleRestart = () => {
    if (submissionTimeoutRef.current !== null) {
      window.clearTimeout(submissionTimeoutRef.current);
      submissionTimeoutRef.current = null;
    }

    answerLockedRef.current = false;
    roundStartedAtRef.current = null;

    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setLastReward(0);
    setLastCorrectAnswer(null);
    setTotalWinnings(0);
    setRemainingMs(ROUND_DURATION_MS);
    setIsSubmitting(false);
    setGameState("QUESTION");
  };

  if (!currentQuestion) return null;

  return (
    <main
      className={
        isPlaying
          ? "h-[100dvh] overflow-hidden bg-[#070b14] text-white"
          : "min-h-[100dvh] overflow-x-hidden bg-[#070b14] text-white"
      }
    >
      <div
        className={
          isPlaying
            ? "mx-auto flex h-full w-full max-w-6xl flex-col px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-[max(5px,env(safe-area-inset-top))] sm:px-5 sm:py-4"
            : "mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-7 lg:px-8"
        }
      >
        {/* COMPACT HEADER */}

        <header
          className={`flex shrink-0 items-center justify-between gap-2 ${
            isPlaying
              ? "mb-2 min-h-10 sm:mb-3"
              : "mb-5 sm:mb-8"
          }`}
        >
          <button
            type="button"
            onClick={() => router.push("/student/solve-and-win-cash")}
            aria-label="Back to subjects"
            className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-1.5 text-xs font-bold text-slate-400 transition hover:bg-white/5 hover:text-white sm:min-h-11 sm:px-3 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className={isPlaying ? "hidden sm:inline" : "inline"}>
              Subjects
            </span>
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <div
              className={`flex shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15 ${
                isPlaying
                  ? "h-8 w-8 text-base sm:h-10 sm:w-10"
                  : "h-10 w-10 text-lg"
              }`}
            >
              {subject.icon}
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.12em] text-violet-300 sm:text-[10px]">
                Learnyfi • Solve & Win
              </p>
              <h1 className="truncate text-xs font-black sm:text-lg">
                {subject.name}
              </h1>
            </div>
          </div>

          {!isPlaying && (
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
              <Wallet className="h-4 w-4 text-emerald-300" />
              <p className="text-xs font-black tabular-nums text-emerald-200">
                ₦{formatCash(totalWinnings)}
              </p>
            </div>
          )}
        </header>

        {/* RESULTS-ONLY PROGRESS */}

        {!isPlaying && (
          <section className="mb-5 rounded-2xl border border-slate-800/80 bg-[#0c1220] p-4 sm:mb-7 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Your progress
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-xs font-black text-violet-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-slate-800"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-label="Quiz progress"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>
        )}

        {/* GAME CONTENT */}


        <div
          className={
            isPlaying
              ? "min-h-0 flex-1"
              : gameState === "REWARD"
                ? "grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start lg:gap-6"
                : "grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start lg:gap-6"
          }
        >
         

            <section
  className={
    gameState === "REWARD"
      ? "flex min-w-0 items-center justify-center px-1 py-4 sm:py-6"
      : isPlaying
        ? "h-full min-h-0 min-w-0"
        : "min-w-0"
  }
>
       
 
            {gameState === "QUESTION" && (
              <QuestionScreen
                subject={subject}
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                isSubmitting={isSubmitting}
                currentReward={currentReward}
                currentCashValue={currentCashValue}
                remainingMs={remainingMs}
                secondsRemaining={secondsRemaining}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
              />
            )}

            {gameState === "REWARD" && (
              <RewardScreen
                reward={lastReward}
                totalWinnings={totalWinnings}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onCashOut={handleCashOut}
                onWinMore={handleWinMore}
              />
            )}

            {gameState === "WRONG" && (
              <WrongScreen
                selectedAnswer={selectedAnswer}
                question={currentQuestion}
                correctAnswer={lastCorrectAnswer}
                totalWinnings={totalWinnings}
                onTryAgain={handleTryAgain}
                onCashOut={handleCashOut}
              />
            )}

  {gameState === "TIME_UP" && (
  <div className="flex w-full min-w-0 justify-center">
    <TimeUpScreen
      question={currentQuestion}
      correctAnswer={lastCorrectAnswer}
      totalWinnings={totalWinnings}
      onTryAgain={handleTryAgain}
      onCashOut={handleCashOut}
    />
  </div>
)}

            {gameState === "CASHED_OUT" && (
              <CashOutScreen
                subject={subject}
                totalWinnings={totalWinnings}
                onRestart={handleRestart}
                onSubjects={() =>
                  router.push("/student/solve-and-win-cash")
                }
              />
            )}
          </section>

          {/* REWARD LADDER ONLY ON RESULTS */}

          {!isPlaying && (
            <aside className="min-w-0 lg:sticky lg:top-5">
              <CbtLadder
                currentQuestionIndex={currentQuestionIndex}
                totalWinnings={totalWinnings}
                gameState={gameState}
              />
            </aside>
          )}
        </div>

        {/* RESULTS-ONLY FOOTER */}

        {!isPlaying && (
          <footer className="mx-auto mt-7 flex max-w-2xl items-center justify-center gap-2 px-2 pb-3 text-center text-[10px] leading-5 text-slate-600 sm:mt-10 sm:text-xs">
            <Zap className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            Demo gameplay only. Displayed rewards are not real or withdrawable cash.
          </footer>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   COMPACT GAMEPLAY QUESTION SCREEN
========================================================= */

function QuestionScreen({
  subject,
  question,
  selectedAnswer,
  isSubmitting,
  currentReward,
  currentCashValue,
  remainingMs,
  secondsRemaining,
  questionNumber,
  totalQuestions,
  onAnswer,
}: {
  subject: SubjectConfig;
  question: Question;
  selectedAnswer: string | null;
  isSubmitting: boolean;
  currentReward: number;
  currentCashValue: number;
  remainingMs: number;
  secondsRemaining: number;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
}) {
  const isUrgent = remainingMs <= 3000;
  const isWarning = remainingMs <= 6000;

  const cashTone = isUrgent
    ? "text-red-300"
    : isWarning
      ? "text-amber-300"
      : "text-emerald-300";

  const cashPanel = isUrgent
    ? "border-red-400/40 bg-red-500/[0.08]"
    : isWarning
      ? "border-amber-400/30 bg-amber-400/[0.07]"
      : "border-emerald-400/25 bg-emerald-400/[0.05]";

  const timerTone = isUrgent
    ? "text-red-300"
    : isWarning
      ? "text-amber-300"
      : "text-violet-300";

  const timeProgress = Math.max(
    0,
    Math.min(100, (remainingMs / ROUND_DURATION_MS) * 100),
  );

  const answerDisabled = isSubmitting || remainingMs <= 0;

  return (
  
<section className="flex h-full min-h-0 w-full min-w-0 flex-col gap-2 pt-4 sm:gap-3 sm:pt-0">

      {/* QUESTION IDENTIFICATION */}

      <div className="flex shrink-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-base sm:h-9 sm:w-9 sm:rounded-xl sm:text-lg">
            {subject.icon}
          </span>

          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-violet-300 sm:text-[10px]">
              Question {questionNumber} of {totalQuestions}
            </p>
            <p className="truncate text-[10px] font-semibold text-slate-400 sm:text-xs">
              {subject.name}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-800 sm:w-20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400"
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>

          <span className="rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1 text-[8px] font-bold text-slate-400 sm:text-[10px]">
            DEMO
          </span>
        </div>
      </div>

      {/* REWARD + TIMER: ALWAYS SIDE BY SIDE */}

      <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-3">
     
        {/* REWARD */}

        <div
          className={`relative min-w-0 overflow-hidden rounded-xl border p-3 sm:rounded-2xl sm:p-4 ${cashPanel}`}
        >
          <div className="flex items-center justify-between gap-1">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400 sm:text-[10px]">
              Reward now
            </p>
            <Coins className={`h-4 w-4 shrink-0 ${cashTone}`} />
          </div>

          <p
            aria-live="off"
            className={`mt-1 text-2xl font-black tracking-tight tabular-nums sm:text-3xl ${cashTone}`}
          >
            ₦{formatCash(currentCashValue)}
          </p>

          <div className="mt-2 flex items-center justify-between gap-1">
            <span className="text-[8px] text-slate-500 sm:text-[10px]">
              Maximum
            </span>
            <span className="text-[10px] font-extrabold text-slate-300 sm:text-xs">
              ₦{formatCash(currentReward)}
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/30">
            <div
              className={`h-full rounded-full ${
                isUrgent
                  ? "bg-red-400"
                  : isWarning
                    ? "bg-amber-300"
                    : "bg-emerald-300"
              }`}
              style={{
                width: `${
                  currentReward > 0
                    ? (currentCashValue / currentReward) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* TIMER */}

        <div
          className={`min-w-0 rounded-xl border bg-[#0c1220] p-3 sm:rounded-2xl sm:p-4 ${
            isUrgent ? "border-red-500/40" : "border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400 sm:text-[10px]">
              {isSubmitting ? "Checking" : "Time left"}
            </p>

            {isUrgent ? (
              <Flame className="h-4 w-4 shrink-0 text-red-300" />
            ) : (
              <Timer className="h-4 w-4 shrink-0 text-violet-300" />
            )}
          </div>

          <div
            className={`mt-1 flex items-center gap-1 text-2xl font-black tabular-nums sm:text-3xl ${timerTone}`}
            role="timer"
            aria-label={
              isSubmitting
                ? "Answer is being checked"
                : `${secondsRemaining} seconds remaining`
            }
          >
            <Clock3 className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            {isSubmitting
              ? "LOCK"
              : `00:${String(secondsRemaining).padStart(2, "0")}`}
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full ${
                isUrgent
                  ? "bg-red-500"
                  : isWarning
                    ? "bg-amber-400"
                    : "bg-violet-500"
              }`}
              style={{ width: `${timeProgress}%` }}
            />
          </div>

          <p
            className={`mt-2 truncate text-[8px] font-semibold sm:text-[10px] ${
              isSubmitting
                ? "text-violet-300"
                : isUrgent
                  ? "text-red-300"
                  : "text-slate-500"
            }`}
          >
            {isSubmitting
              ? "Checking your answer..."
              : isUrgent
                ? "Hurry! Time is almost up."
                : "Answer fast to earn more."}
          </p>
        </div>
      </div>

      {/* QUESTION + ANSWERS FILL REMAINING HEIGHT */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1220] p-3 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-5 lg:p-6">
        <div className="mb-2 flex shrink-0 items-center gap-2 sm:mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/15 text-[10px] font-black text-violet-300 sm:h-8 sm:w-8 sm:text-xs">
            Q{questionNumber}
          </span>

          <span className="text-[9px] font-black uppercase tracking-[0.12em] text-violet-300 sm:text-[10px]">
            Choose your answer
          </span>
        </div>

        <h2 className="mb-3 shrink-0 text-sm font-black leading-snug tracking-tight text-white sm:mb-4 sm:text-xl lg:text-2xl">
          {question.question}
        </h2>

        {/* TWO COLUMNS ON MOBILE TO REDUCE PAGE HEIGHT */}

        <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2 sm:grid-cols-2 sm:gap-3">

          {question.options.map((option) => {
            const selected = selectedAnswer === option.label;

            return (
              <button
                key={option.label}
                type="button"
                disabled={answerDisabled}
                onClick={() => onAnswer(option.label)}
                aria-pressed={selected}
                className={[
                  "group flex min-h-[52px] min-w-0 items-center gap-2 rounded-xl border p-2 text-left transition duration-150 sm:min-h-[64px] sm:gap-3 sm:rounded-2xl sm:p-3",
                  selected
                    ? "border-violet-400 bg-violet-500/15 ring-1 ring-violet-400/20"
                    : "border-slate-700/80 bg-slate-900/70 hover:border-violet-400/60 hover:bg-violet-500/[0.06]",
                  answerDisabled
                    ? "cursor-not-allowed opacity-75"
                    : "active:scale-[0.99]",
                ].join(" ")}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black transition sm:h-9 sm:w-9 sm:rounded-xl sm:text-xs ${
                    selected
                      ? "border-violet-400 bg-violet-500 text-white"
                      : "border-slate-700 bg-slate-800 text-slate-300 group-hover:border-violet-400/50 group-hover:text-white"
                  }`}
                >
                  {selected && isSubmitting ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    option.label
                  )}
                </span>

                <span className="min-w-0 flex-1 break-words text-[10px] font-semibold leading-snug text-slate-100 sm:text-sm">
                  {option.text}
                </span>

                <ArrowRight
                  className={`hidden h-4 w-4 shrink-0 sm:block ${
                    selected
                      ? "text-violet-300"
                      : "text-slate-600 group-hover:text-violet-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <p className="mt-2 shrink-0 text-center text-[8px] leading-tight text-slate-600 sm:mt-3 sm:text-[10px]">
          Choose one answer. Selection locks immediately. Demo rewards only.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   CORRECT ANSWER SCREEN
========================================================= */

function RewardScreen({
  reward,
  totalWinnings,
  questionNumber,
  totalQuestions,
  onCashOut,
  onWinMore,
}: {
  reward: number;
  totalWinnings: number;
  questionNumber: number;
  totalQuestions: number;
  onCashOut: () => void;
  onWinMore: () => void;
}) {
  const hasMore = questionNumber < totalQuestions;

  return (
   <div className="relative mx-auto w-full max-w-2xl shrink-0 overflow-hidden rounded-3xl border border-emerald-400/25 bg-[#0b1715] p-4 shadow-2xl sm:p-9">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 sm:mb-5 sm:h-20 sm:w-20 sm:rounded-3xl">
          <CheckCircle2 className="h-9 w-9 text-emerald-300 sm:h-11 sm:w-11" />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          Correct answer
        </span>

        <h2 className="mt-4 text-2xl font-black sm:mt-5 sm:text-4xl">
          Excellent work!
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          You answered correctly and locked this demo reward.
        </p>

        <div className="my-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-5 sm:my-6 sm:rounded-3xl sm:py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300/70">
            Reward captured
          </p>

          <p className="mt-2 text-4xl font-black tabular-nums text-emerald-300 sm:text-5xl">
            +₦{formatCash(reward)}
          </p>

          <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-3 border-t border-emerald-400/10 pt-4">
            <Wallet className="h-5 w-5 text-emerald-300" />

            <div className="text-left">
              <p className="text-[10px] text-slate-500">
                Session demo total
              </p>
              <p className="font-black text-white">
                ₦{formatCash(totalWinnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-md">
          <p className="mb-3 text-sm font-bold text-white">
            What would you like to do?
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onCashOut}
              className={secondaryButton}
            >
              <Wallet className="h-4 w-4 text-amber-300" />
              Cash Out
            </button>

            <button
              type="button"
              onClick={onWinMore}
              className={primaryButton}
            >
              {hasMore ? "Next Question" : "Finish Quiz"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-slate-500">
            Demo rewards are for display only. Cash-out is not connected to a payout service.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SHARED RESULT HEADING
========================================================= */

function ResultHeading({
  icon,
  label,
  title,
  description,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.08] sm:mb-5 sm:h-20 sm:w-20 sm:rounded-3xl">
        {icon}
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
        {label}
      </p>

      <h2 className="mt-3 text-2xl font-black sm:text-4xl">{title}</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   WRONG ANSWER SCREEN
========================================================= */

function WrongScreen({
  selectedAnswer,
  question,
  correctAnswer,
  totalWinnings,
  onTryAgain,
  onCashOut,
}: {
  selectedAnswer: string | null;
  question: Question;
  correctAnswer: string | null;
  totalWinnings: number;
  onTryAgain: () => void;
  onCashOut: () => void;
}) {
  const selectedText =
    question.options.find((option) => option.label === selectedAnswer)?.text ??
    "No answer";

  const correctText =
    question.options.find((option) => option.label === correctAnswer)?.text ??
    "-";

  return (
    <div className="rounded-3xl border border-red-400/20 bg-[#160d14] p-5 shadow-2xl sm:p-9">
      <ResultHeading
        icon={<XCircle className="h-9 w-9 text-red-300 sm:h-10 sm:w-10" />}
        label="Incorrect answer"
        title="Keep learning"
        description="Review the correct answer and give it another try."
      />

      <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-300/70">
            Your answer
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-red-200">
            {selectedText}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">
            Correct answer
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-emerald-200">
            {correctText}
          </p>
        </div>
      </div>

      <ExplanationCard explanation={question.explanation} />
      <DemoTotal totalWinnings={totalWinnings} />

      <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={onTryAgain}
          className={primaryButton}
        >
          <RotateCcw className="h-4 w-4" />
          Try This Question Again
        </button>

        <button
          type="button"
          onClick={onCashOut}
          className={secondaryButton}
        >
          <Wallet className="h-4 w-4" />
          Finish Session
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   TIME-UP SCREEN
========================================================= */

function TimeUpScreen({
  question,
  correctAnswer,
  totalWinnings,
  onTryAgain,
  onCashOut,
}: {
  question: Question;
  correctAnswer: string | null;
  totalWinnings: number;
  onTryAgain: () => void;
  onCashOut: () => void;
}) {
  const correctText =
    question.options.find((option) => option.label === correctAnswer)?.text ??
    "-";

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-red-400/20 bg-[#160d14] p-3 shadow-2xl sm:rounded-3xl sm:p-7">
      <div className="text-center">
        <div className="mb-2 flex justify-center sm:mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.08] sm:h-16 sm:w-16 sm:rounded-2xl">
            <Timer className="h-6 w-6 text-red-300 sm:h-9 sm:w-9" />
          </div>
        </div>

        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-red-300 sm:text-[11px]">
          Countdown finished
        </p>

        <h2 className="mt-1 text-2xl font-black text-white sm:mt-2 sm:text-4xl">
          Time is up!
        </h2>

        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400 sm:mt-2 sm:text-base sm:leading-7">
          This round has ended. Review the answer and try again.
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 sm:mt-5 sm:rounded-2xl sm:p-4">
        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300/70 sm:text-[10px]">
          Correct answer
        </p>
        <p className="mt-1 text-sm font-bold leading-5 text-emerald-200 sm:mt-2 sm:text-base sm:leading-6">
          {correctText}
        </p>
      </div>

      <div className="mt-3 sm:mt-4">
        <ExplanationCard explanation={question.explanation} />
      </div>

      <div className="mt-3 sm:mt-4">
        <DemoTotal totalWinnings={totalWinnings} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          onClick={onTryAgain}
          className={`${primaryButton} min-h-11 py-2.5 text-sm sm:min-h-12 sm:text-base`}
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>

        <button
          type="button"
          onClick={onCashOut}
          className={`${secondaryButton} min-h-11 py-2.5 text-sm sm:min-h-12 sm:text-base`}
        >
          <ArrowRight className="h-4 w-4" />
          Finish Session
        </button>
      </div>
    </div>
  );
}
/* =========================================================
   EXPLANATION
========================================================= */

function ExplanationCard({ explanation }: { explanation: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-violet-300" />
        <p className="text-xs font-black text-slate-200">Explanation</p>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-400">{explanation}</p>
    </div>
  );
}

/* =========================================================
   SESSION TOTAL
========================================================= */

function DemoTotal({ totalWinnings }: { totalWinnings: number }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Session demo total
        </p>
        <p className="mt-1 text-xl font-black text-emerald-300">
          ₦{formatCash(totalWinnings)}
        </p>
      </div>

      <Wallet className="h-6 w-6 text-emerald-300" />
    </div>
  );
}

/* =========================================================
   CASH-OUT SCREEN
========================================================= */

function CashOutScreen({
  subject,
  totalWinnings,
  onRestart,
  onSubjects,
}: {
  subject: SubjectConfig;
  totalWinnings: number;
  onRestart: () => void;
  onSubjects: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-[#151208] p-5 shadow-2xl sm:p-9">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/[0.08] blur-3xl" />

      <div className="relative text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 sm:mb-5 sm:h-20 sm:w-20 sm:rounded-3xl">
          <Wallet className="h-9 w-9 text-amber-300 sm:h-10 sm:w-10" />
        </div>

        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
          Demo mode
        </span>

        <h2 className="mt-4 text-2xl font-black sm:mt-5 sm:text-4xl">
          Session complete
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
          The wallet and payout service have not been connected yet. This screen does not make a withdrawal or transfer money.
        </p>

        <div className="my-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-5 sm:my-7 sm:rounded-3xl sm:py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Demo reward total
          </p>

          <p className="mt-2 text-4xl font-black tabular-nums text-emerald-300 sm:text-5xl">
            ₦{formatCash(totalWinnings)}
          </p>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            This value is temporary frontend state, not a withdrawable balance.
          </p>
        </div>

        <div className="mx-auto max-w-lg rounded-2xl border border-violet-400/15 bg-violet-500/[0.05] p-4 text-left sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <Coins className="h-5 w-5 text-violet-300" />
            </div>

            <div>
              <h3 className="font-black">Keep learning with Learnyfi</h3>
              <p className="mt-1 text-xs text-slate-500">
                Choose another subject or restart this demo.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2">
          <button
            type="button"
            onClick={onSubjects}
            className={secondaryButton}
          >
            <BookOpen className="h-4 w-4" />
            Choose Subject
          </button>

          <button
            type="button"
            onClick={onRestart}
            className={primaryButton}
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-600">
          {subject.icon} {subject.name} • Solve & Win
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   REWARD LADDER — RESULTS SCREENS ONLY
========================================================= */

function CbtLadder({
  currentQuestionIndex,
  totalWinnings,
  gameState,
}: {
  currentQuestionIndex: number;
  totalWinnings: number;
  gameState: GameState;
}) {
  const isQuestionActive = gameState === "QUESTION";
  const isFinalQuestion = currentQuestionIndex >= REWARDS.length - 1;

  const nextReward =
    REWARDS[Math.min(currentQuestionIndex, REWARDS.length - 1)];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1220] shadow-xl shadow-black/10">
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10">
            <Trophy className="h-5 w-5 text-emerald-300" />
          </div>

          <div>
            <h3 className="font-black">Reward ladder</h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Your quiz journey
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Demo total
            </p>
            <Wallet className="h-4 w-4 text-emerald-300" />
          </div>

          <p className="mt-2 text-2xl font-black tabular-nums text-emerald-300">
            ₦{formatCash(totalWinnings)}
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            Not a withdrawable balance
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-black text-slate-300">
            Question rewards
          </p>
          <span className="text-[10px] font-bold text-slate-600">
            6 LEVELS
          </span>
        </div>

        <div className="space-y-2">
          {REWARDS.map((reward, index) => {
            const completed = index < currentQuestionIndex;
            const current = index === currentQuestionIndex;

            const status = completed
              ? "Completed"
              : current
                ? isQuestionActive
                  ? "Current"
                  : "Reached"
                : "Upcoming";

            return (
              <div
                key={index}
                className={`flex items-center justify-between gap-2 rounded-xl border p-3 transition ${
                  current
                    ? "border-violet-400/40 bg-violet-500/[0.09] ring-1 ring-violet-400/10"
                    : completed
                      ? "border-emerald-400/15 bg-emerald-400/[0.04]"
                      : "border-slate-800 bg-slate-950/40"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      completed
                        ? "bg-emerald-400 text-[#062015]"
                        : current
                          ? "bg-violet-500 text-white"
                          : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {completed ? <Check className="h-4 w-4" /> : index + 1}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold ${
                        current
                          ? "text-violet-200"
                          : completed
                            ? "text-emerald-200"
                            : "text-slate-400"
                      }`}
                    >
                      Question {index + 1}
                    </p>

                    <p className="mt-0.5 text-[9px] text-slate-600">
                      {status}
                    </p>
                  </div>
                </div>

                <p
                  className={`shrink-0 text-xs font-black tabular-nums ${
                    current
                      ? "text-violet-200"
                      : completed
                        ? "text-emerald-300"
                        : "text-slate-500"
                  }`}
                >
                  ₦{formatCash(reward)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-violet-400/15 bg-violet-500/[0.05] p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-violet-300/70">
            {isFinalQuestion ? "Final question" : "Current maximum"}
          </p>

          <p className="mt-2 text-xl font-black text-violet-200">
            ₦{formatCash(nextReward)}
          </p>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            {isFinalQuestion
              ? "You are at the last reward level."
              : "The displayed demo reward decreases as the timer runs."}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

          <div>
            <p className="text-xs font-bold text-amber-200">
              Play requirement
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              CBT Points and real payouts must be verified by the backend before a live rewards system is enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}













