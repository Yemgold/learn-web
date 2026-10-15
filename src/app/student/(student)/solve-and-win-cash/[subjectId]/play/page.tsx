
"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Flame,
  Clock3,
  Timer,
  Trophy,
  Wallet,
  XCircle,
  Zap,
  BookOpen,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type GameState = "QUESTION" | "REWARD" | "WRONG" | "TIME_UP" | "CASHED_OUT";
type Option = { label: string; text: string };
type Question = {
  id: string;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
};
type SubjectConfig = { name: string; shortName: string; icon: string };

const ROUND_DURATION_MS = 10_000;
const TIMER_UPDATE_MS = 50;
const REWARDS = [500, 550, 600, 650, 700, 750];

const SUBJECTS: Record<string, SubjectConfig> = {
  biology: { name: "Biology", shortName: "BIO", icon: "🧬" },
  chemistry: { name: "Chemistry", shortName: "CHEM", icon: "⚗️" },
  physics: { name: "Physics", shortName: "PHY", icon: "⚡" },
  mathematics: { name: "Mathematics", shortName: "MATH", icon: "📐" },
};

const QUESTIONS_BY_SUBJECT: Record<string, Question[]> = {
  biology: [
    {
      id: "bio-1",
      question: "Which of the following is the basic unit of life?",
      options: [
        { label: "A", text: "Tissue" },
        { label: "B", text: "Cell" },
        { label: "C", text: "Organ" },
        { label: "D", text: "Organ system" },
      ],
      correctAnswer: "B",
      explanation: "The cell is the basic structural and functional unit of life.",
    },
    {
      id: "bio-2",
      question: "Which organelle is commonly described as the powerhouse of the cell?",
      options: [
        { label: "A", text: "Ribosome" },
        { label: "B", text: "Nucleus" },
        { label: "C", text: "Mitochondrion" },
        { label: "D", text: "Golgi apparatus" },
      ],
      correctAnswer: "C",
      explanation: "Mitochondria produce most of the ATP used by cells for energy.",
    },
    {
      id: "bio-3",
      question: "Which process allows green plants to manufacture food using light energy?",
      options: [
        { label: "A", text: "Respiration" },
        { label: "B", text: "Photosynthesis" },
        { label: "C", text: "Transpiration" },
        { label: "D", text: "Excretion" },
      ],
      correctAnswer: "B",
      explanation: "Photosynthesis uses light energy to convert carbon dioxide and water into glucose.",
    },
    {
      id: "bio-4",
      question: "Which blood cells are primarily responsible for fighting infection?",
      options: [
        { label: "A", text: "Red blood cells" },
        { label: "B", text: "Platelets" },
        { label: "C", text: "White blood cells" },
        { label: "D", text: "Plasma cells" },
      ],
      correctAnswer: "C",
      explanation: "White blood cells help defend the body against pathogens and other foreign substances.",
    },
    {
      id: "bio-5",
      question: "Which part of a plant absorbs most water and mineral salts from the soil?",
      options: [
        { label: "A", text: "Leaf" },
        { label: "B", text: "Root hair" },
        { label: "C", text: "Flower" },
        { label: "D", text: "Fruit" },
      ],
      correctAnswer: "B",
      explanation: "Root hairs provide a large surface area for absorbing water and mineral salts.",
    },
    {
      id: "bio-6",
      question: "Which molecule carries genetic information in most living organisms?",
      options: [
        { label: "A", text: "DNA" },
        { label: "B", text: "Glucose" },
        { label: "C", text: "ATP" },
        { label: "D", text: "Water" },
      ],
      correctAnswer: "A",
      explanation: "DNA stores genetic information used in the development and functioning of organisms.",
    },
  ],
  chemistry: [
    {
      id: "chem-1",
      question: "What is the chemical symbol for sodium?",
      options: [
        { label: "A", text: "S" },
        { label: "B", text: "So" },
        { label: "C", text: "Na" },
        { label: "D", text: "N" },
      ],
      correctAnswer: "C",
      explanation: "The chemical symbol for sodium is Na, derived from its Latin name natrium.",
    },
    {
      id: "chem-2",
      question: "Which particle has a negative electrical charge?",
      options: [
        { label: "A", text: "Proton" },
        { label: "B", text: "Electron" },
        { label: "C", text: "Neutron" },
        { label: "D", text: "Nucleus" },
      ],
      correctAnswer: "B",
      explanation: "Electrons carry a negative electrical charge.",
    },
    {
      id: "chem-3",
      question: "What is the pH of a neutral solution at room temperature?",
      options: [
        { label: "A", text: "0" },
        { label: "B", text: "5" },
        { label: "C", text: "7" },
        { label: "D", text: "14" },
      ],
      correctAnswer: "C",
      explanation: "A neutral aqueous solution has a pH of approximately 7 at room temperature.",
    },
    {
      id: "chem-4",
      question: "Which gas is released when an acid reacts with a carbonate?",
      options: [
        { label: "A", text: "Oxygen" },
        { label: "B", text: "Hydrogen" },
        { label: "C", text: "Carbon dioxide" },
        { label: "D", text: "Nitrogen" },
      ],
      correctAnswer: "C",
      explanation: "Acids react with carbonates to produce a salt, water and carbon dioxide.",
    },
    {
      id: "chem-5",
      question: "Which of these is a noble gas?",
      options: [
        { label: "A", text: "Chlorine" },
        { label: "B", text: "Oxygen" },
        { label: "C", text: "Argon" },
        { label: "D", text: "Hydrogen" },
      ],
      correctAnswer: "C",
      explanation: "Argon belongs to Group 18, the noble gases.",
    },
    {
      id: "chem-6",
      question: "What type of bond involves the sharing of electrons?",
      options: [
        { label: "A", text: "Ionic bond" },
        { label: "B", text: "Covalent bond" },
        { label: "C", text: "Metallic bond" },
        { label: "D", text: "Hydrogen bond" },
      ],
      correctAnswer: "B",
      explanation: "A covalent bond is formed when atoms share electron pairs.",
    },
  ],
  physics: [
    {
      id: "phy-1",
      question: "What is the SI unit of force?",
      options: [
        { label: "A", text: "Joule" },
        { label: "B", text: "Watt" },
        { label: "C", text: "Newton" },
        { label: "D", text: "Pascal" },
      ],
      correctAnswer: "C",
      explanation: "The SI unit of force is the newton (N).",
    },
    {
      id: "phy-2",
      question: "Which of the following quantities has both magnitude and direction?",
      options: [
        { label: "A", text: "Mass" },
        { label: "B", text: "Speed" },
        { label: "C", text: "Distance" },
        { label: "D", text: "Velocity" },
      ],
      correctAnswer: "D",
      explanation: "Velocity is a vector quantity because it has both magnitude and direction.",
    },
    {
      id: "phy-3",
      question: "What is the approximate acceleration due to gravity near Earth's surface?",
      options: [
        { label: "A", text: "4.9 m/s²" },
        { label: "B", text: "9.8 m/s²" },
        { label: "C", text: "19.6 m/s²" },
        { label: "D", text: "98 m/s²" },
      ],
      correctAnswer: "B",
      explanation: "The commonly used value of gravitational acceleration near Earth's surface is 9.8 m/s².",
    },
    {
      id: "phy-4",
      question: "Which instrument is used to measure electric current?",
      options: [
        { label: "A", text: "Voltmeter" },
        { label: "B", text: "Ammeter" },
        { label: "C", text: "Barometer" },
        { label: "D", text: "Thermometer" },
      ],
      correctAnswer: "B",
      explanation: "An ammeter is used to measure electric current in a circuit.",
    },
    {
      id: "phy-5",
      question: "What form of energy is stored in a stretched spring?",
      options: [
        { label: "A", text: "Chemical energy" },
        { label: "B", text: "Nuclear energy" },
        { label: "C", text: "Elastic potential energy" },
        { label: "D", text: "Sound energy" },
      ],
      correctAnswer: "C",
      explanation: "A stretched or compressed spring stores elastic potential energy.",
    },
    {
      id: "phy-6",
      question: "What is the formula for speed?",
      options: [
        { label: "A", text: "Distance × Time" },
        { label: "B", text: "Distance ÷ Time" },
        { label: "C", text: "Time ÷ Distance" },
        { label: "D", text: "Mass ÷ Volume" },
      ],
      correctAnswer: "B",
      explanation: "Speed is calculated as distance divided by time.",
    },
  ],
  mathematics: [
    {
      id: "math-1",
      question: "What is 15% of 200?",
      options: [
        { label: "A", text: "20" },
        { label: "B", text: "25" },
        { label: "C", text: "30" },
        { label: "D", text: "35" },
      ],
      correctAnswer: "C",
      explanation: "15% of 200 = 15/100 × 200 = 30.",
    },
    {
      id: "math-2",
      question: "Solve: 3x = 18.",
      options: [
        { label: "A", text: "3" },
        { label: "B", text: "6" },
        { label: "C", text: "9" },
        { label: "D", text: "12" },
      ],
      correctAnswer: "B",
      explanation: "Divide both sides by 3: x = 18 ÷ 3 = 6.",
    },
    {
      id: "math-3",
      question: "What is the square root of 144?",
      options: [
        { label: "A", text: "10" },
        { label: "B", text: "11" },
        { label: "C", text: "12" },
        { label: "D", text: "14" },
      ],
      correctAnswer: "C",
      explanation: "12 × 12 = 144, so √144 = 12.",
    },
    {
      id: "math-4",
      question: "What is 2³?",
      options: [
        { label: "A", text: "6" },
        { label: "B", text: "8" },
        { label: "C", text: "9" },
        { label: "D", text: "12" },
      ],
      correctAnswer: "B",
      explanation: "2³ means 2 × 2 × 2 = 8.",
    },
    {
      id: "math-5",
      question: "If a = 5 and b = 3, what is a² + b²?",
      options: [
        { label: "A", text: "25" },
        { label: "B", text: "30" },
        { label: "C", text: "34" },
        { label: "D", text: "40" },
      ],
      correctAnswer: "C",
      explanation: "a² + b² = 5² + 3² = 25 + 9 = 34.",
    },
    {
      id: "math-6",
      question: "What is the next number in the sequence 2, 4, 6, 8, ...?",
      options: [
        { label: "A", text: "9" },
        { label: "B", text: "10" },
        { label: "C", text: "11" },
        { label: "D", text: "12" },
      ],
      correctAnswer: "B",
      explanation: "The sequence increases by 2 each time, so the next number is 10.",
    },
  ],
};

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
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1020] disabled:cursor-not-allowed disabled:opacity-60";

const primaryButton =
  `${buttonBase} bg-violet-600 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500 active:scale-[0.99]`;

const secondaryButton =
  `${buttonBase} border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800 active:scale-[0.99]`;



 
export default function SolveAndWinCbtPlayPage() {
  const params = useParams();
  const router = useRouter();

  const rawSubjectId = params?.subjectId;
  const subjectId = Array.isArray(rawSubjectId)
    ? rawSubjectId[0]
    : rawSubjectId;

  const normalizedSubjectId = String(subjectId ?? "biology").toLowerCase();
  const subject = SUBJECTS[normalizedSubjectId] ?? SUBJECTS.biology;
  const questions =
    QUESTIONS_BY_SUBJECT[normalizedSubjectId] ?? QUESTIONS_BY_SUBJECT.biology;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>("QUESTION");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [lastReward, setLastReward] = useState(0);
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState(ROUND_DURATION_MS);

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

  useEffect(() => {
    return () => {
      if (submissionTimeoutRef.current !== null) {
        window.clearTimeout(submissionTimeoutRef.current);
      }
    };
  }, []);

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
    <main className="min-h-screen overflow-x-hidden bg-[#070b14] text-white">
      <div
        className={`mx-auto w-full px-3 sm:px-6 lg:px-8 ${
          isPlaying
            ? "max-w-6xl py-3 sm:py-5"
            : "max-w-7xl py-4 sm:py-7"
        }`}
      >
        {/* Compact header during gameplay; full header on result screens */}
        <header
          className={`flex items-center justify-between gap-3 ${
            isPlaying ? "mb-3 sm:mb-5" : "mb-5 sm:mb-8"
          }`}
        >
          <button
            type="button"
            onClick={() => router.push("/student/solve-and-win-cash")}
            className="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white sm:min-h-11 sm:px-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Subjects</span>
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15 text-lg sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">
              {subject.icon}
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-300 sm:text-[10px]">
                Learnyfi • Solve & Win
              </p>
              <h1 className="truncate text-sm font-black sm:text-lg">
                {subject.name}
              </h1>
            </div>
          </div>

          {!isPlaying && (
            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 sm:px-4">
              <Wallet className="h-4 w-4 text-emerald-300" />
              <div>
                <p className="hidden text-[9px] font-bold uppercase tracking-wider text-emerald-200/60 sm:block">
                  Demo total
                </p>
                <p className="text-xs font-black tabular-nums text-emerald-200 sm:text-sm">
                  ₦{formatCash(totalWinnings)}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Hide all progress panels during the active question */}
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

        {/* One full-width column during play */}
        <div
          className={`grid min-w-0 ${
            isPlaying
              ? "grid-cols-1 gap-0"
              : "grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start lg:gap-6"
          }`}
        >
          <section className="min-w-0">
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
              <TimeUpScreen
                question={currentQuestion}
                correctAnswer={lastCorrectAnswer}
                totalWinnings={totalWinnings}
                onTryAgain={handleTryAgain}
                onCashOut={handleCashOut}
              />
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

          {/* Completely hide the reward ladder during gameplay */}
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

        {/* Hide the footer during gameplay to preserve screen space */}
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
    <section className="mx-auto w-full min-w-0 max-w-5xl">
      {/* Compact question status */}
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-lg sm:h-10 sm:w-10">
            {subject.icon}
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-violet-300">
              Question {questionNumber} of {totalQuestions}
            </p>
            <p className="truncate text-xs font-semibold text-slate-400 sm:text-sm">
              {subject.name}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-[10px] font-bold text-slate-400 sm:text-xs">
          DEMO ROUND
        </span>
      </div>

      {/* Reward and countdown: the two most important live indicators */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-5 sm:grid-cols-2 sm:gap-4">
        <div
          className={`relative overflow-hidden rounded-2xl border p-4 sm:rounded-3xl sm:p-6 ${cashPanel}`}
        >
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-400/[0.06] blur-2xl" />

          <div className="relative flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                Cash reward now
              </p>

              <p
                aria-live="off"
                className={`mt-2 text-4xl font-black tracking-tight tabular-nums sm:text-5xl ${cashTone}`}
              >
                ₦{formatCash(currentCashValue)}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-current/10 bg-black/10 sm:h-14 sm:w-14">
              <Coins className={`h-6 w-6 sm:h-7 sm:w-7 ${cashTone}`} />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500 sm:text-xs">
              Maximum for this question
            </span>
            <span className="text-xs font-extrabold text-slate-300 sm:text-sm">
              ₦{formatCash(currentReward)}
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/30">
            <div
              className={`h-full rounded-full transition-[width] duration-75 ${
                isUrgent
                  ? "bg-red-400"
                  : isWarning
                    ? "bg-amber-300"
                    : "bg-emerald-300"
              }`}
              style={{
                width: `${currentReward > 0 ? (currentCashValue / currentReward) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div
          className={`rounded-2xl border bg-[#0c1220] p-4 sm:rounded-3xl sm:p-6 ${
            isUrgent ? "border-red-500/40" : "border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isUrgent ? (
                <Flame className="h-5 w-5 animate-pulse text-red-300 sm:h-6 sm:w-6" />
              ) : (
                <Timer className="h-5 w-5 text-violet-300 sm:h-6 sm:w-6" />
              )}

              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                {isSubmitting ? "Checking answer" : "Time remaining"}
              </p>
            </div>

            <div
              className={`flex items-center gap-2 text-3xl font-black tabular-nums sm:text-4xl ${timerTone}`}
              role="timer"
              aria-label={
                isSubmitting
                  ? "Answer is being checked"
                  : `${secondsRemaining} seconds remaining`
              }
            >
              <Clock3 className="h-5 w-5 sm:h-6 sm:w-6" />
              {isSubmitting
                ? "LOCKED"
                : `00:${String(secondsRemaining).padStart(2, "0")}`}
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800 sm:mt-5">
            <div
              className={`h-full rounded-full transition-[width] duration-75 ease-linear ${
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
            className={`mt-3 text-xs font-semibold sm:text-sm ${
              isSubmitting
                ? "text-violet-300"
                : isUrgent
                  ? "animate-pulse text-red-300"
                  : "text-slate-500"
            }`}
          >
            {isSubmitting
              ? "Your answer is being checked..."
              : isUrgent
                ? "Hurry! Time is almost up."
                : "Answer faster to lock in a higher reward."}
          </p>
        </div>
      </div>

      {/* Main question */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-4 shadow-2xl shadow-black/10 sm:rounded-3xl sm:p-7 lg:p-9">
        <div className="mb-4 flex items-center gap-2 sm:mb-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-black text-violet-300 sm:h-9 sm:w-9">
            Q{questionNumber}
          </span>

          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300 sm:text-xs">
            Choose your answer
          </span>
        </div>

        <h2 className="mb-6 text-xl font-black leading-snug tracking-tight text-white sm:mb-8 sm:text-2xl sm:leading-relaxed lg:text-3xl">
          {question.question}
        </h2>

        {/* Larger, easier-to-tap answer options */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
                  "group flex min-h-[68px] w-full items-center gap-3 rounded-2xl border p-4 text-left transition duration-150 sm:min-h-[76px] sm:gap-4 sm:p-5",
                  selected
                    ? "border-violet-400 bg-violet-500/15 ring-2 ring-violet-400/20"
                    : "border-slate-700/80 bg-slate-900/70 hover:border-violet-400/60 hover:bg-violet-500/[0.06]",
                  answerDisabled
                    ? "cursor-not-allowed opacity-75"
                    : "active:scale-[0.995]",
                ].join(" ")}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition sm:h-12 sm:w-12 sm:text-base ${
                    selected
                      ? "border-violet-400 bg-violet-500 text-white"
                      : "border-slate-700 bg-slate-800 text-slate-300 group-hover:border-violet-400/50 group-hover:text-white"
                  }`}
                >
                  {selected && isSubmitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    option.label
                  )}
                </span>

                <span className="min-w-0 flex-1 text-sm font-semibold leading-6 text-slate-100 sm:text-base sm:leading-7">
                  {option.text}
                </span>

                <ArrowRight
                  className={`h-5 w-5 shrink-0 transition ${
                    selected
                      ? "text-violet-300"
                      : "text-slate-600 group-hover:text-violet-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-[10px] leading-5 text-slate-600 sm:mt-6 sm:text-xs">
          Select one answer. Your selection locks immediately. Rewards shown are demo values only.
        </p>
      </div>
    </section>
  );
}


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
    <div className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-[#0b1715] p-5 shadow-2xl sm:p-9">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10">
          <CheckCircle2 className="h-11 w-11 text-emerald-300" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" /> Correct answer
        </span>
        <h2 className="mt-5 text-3xl font-black sm:text-4xl">Excellent work!</h2>
        <p className="mt-3 text-sm text-slate-400">You answered correctly and locked this demo reward.</p>

        <div className="my-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300/70">Reward captured</p>
          <p className="mt-2 text-4xl font-black tabular-nums text-emerald-300 sm:text-5xl">
            +₦{formatCash(reward)}
          </p>
          <div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-3 border-t border-emerald-400/10 pt-4">
            <Wallet className="h-5 w-5 text-emerald-300" />
            <div className="text-left">
              <p className="text-[10px] text-slate-500">Session demo total</p>
              <p className="font-black text-white">₦{formatCash(totalWinnings)}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-md">
          <p className="mb-3 text-sm font-bold text-white">What would you like to do?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={onCashOut} className={secondaryButton}>
              <Wallet className="h-4 w-4 text-amber-300" /> Cash Out
            </button>
            <button type="button" onClick={onWinMore} className={primaryButton}>
              {hasMore ? "Next Question" : "Finish Quiz"} <ArrowRight className="h-4 w-4" />
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
    question.options.find((option) => option.label === selectedAnswer)?.text ?? "No answer";
  const correctText =
    question.options.find((option) => option.label === correctAnswer)?.text ?? "-";

  return (
    <div className="rounded-3xl border border-red-400/20 bg-[#160d14] p-5 shadow-2xl sm:p-9">
      <ResultHeading
        icon={<XCircle className="h-10 w-10 text-red-300" />}
        label="Incorrect answer"
        title="Keep learning"
        description="Review the correct answer and give it another try."
        tone="red"
      />

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-300/70">Your answer</p>
          <p className="mt-2 text-sm font-bold leading-6 text-red-200">{selectedText}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">Correct answer</p>
          <p className="mt-2 text-sm font-bold leading-6 text-emerald-200">{correctText}</p>
        </div>
      </div>

      <ExplanationCard explanation={question.explanation} />
      <DemoTotal totalWinnings={totalWinnings} />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onTryAgain} className={primaryButton}>
          <RotateCcw className="h-4 w-4" /> Try This Question Again
        </button>
        <button type="button" onClick={onCashOut} className={secondaryButton}>
          <Wallet className="h-4 w-4" /> Finish Session
        </button>
      </div>
    </div>
  );
}

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
    question.options.find((option) => option.label === correctAnswer)?.text ?? "-";

  return (
    <div className="rounded-3xl border border-red-400/20 bg-[#160d14] p-5 shadow-2xl sm:p-9">
      <ResultHeading
        icon={<Timer className="h-10 w-10 text-red-300" />}
        label="Countdown finished"
        title="Time is up!"
        description="This round has ended. Review the answer and try again."
        tone="red"
      />

      <div className="mt-7 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">Correct answer</p>
        <p className="mt-2 text-sm font-bold leading-6 text-emerald-200">{correctText}</p>
      </div>

      <ExplanationCard explanation={question.explanation} />
      <DemoTotal totalWinnings={totalWinnings} />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onTryAgain} className={primaryButton}>
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
        <button type="button" onClick={onCashOut} className={secondaryButton}>
          <ArrowRight className="h-4 w-4" /> Finish Session
        </button>
      </div>
    </div>
  );
}

function ResultHeading({
  icon,
  label,
  title,
  description,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  tone: "red";
}) {
  return (
    <div className="text-center">
      <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-${tone}-400/20 bg-${tone}-400/[0.08]`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">{label}</p>
      <h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function ExplanationCard({ explanation }: { explanation: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-violet-300" />
        <p className="text-xs font-black text-slate-200">Explanation</p>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-400">{explanation}</p>
    </div>
  );
}

function DemoTotal({ totalWinnings }: { totalWinnings: number }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Session demo total</p>
        <p className="mt-1 text-xl font-black text-emerald-300">₦{formatCash(totalWinnings)}</p>
      </div>
      <Wallet className="h-6 w-6 text-emerald-300" />
    </div>
  );
}

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
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10">
          <Wallet className="h-10 w-10 text-amber-300" />
        </div>
        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
          Demo mode
        </span>
        <h2 className="mt-5 text-3xl font-black sm:text-4xl">Session complete</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-400">
          The wallet and payout service have not been connected yet. This screen does not make a withdrawal or transfer money.
        </p>

        <div className="my-7 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Demo reward total</p>
          <p className="mt-2 text-4xl font-black tabular-nums text-emerald-300 sm:text-5xl">
            ₦{formatCash(totalWinnings)}
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            This value is temporary frontend state, not a withdrawable balance.
          </p>
        </div>

        <div className="mx-auto max-w-lg rounded-2xl border border-violet-400/15 bg-violet-500/[0.05] p-5 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <Coins className="h-6 w-6 text-violet-300" />
            </div>
            <div>
              <h3 className="font-black">Keep learning with Learnyfi</h3>
              <p className="mt-1 text-xs text-slate-500">Choose another subject or restart this demo.</p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onSubjects} className={secondaryButton}>
            <BookOpen className="h-4 w-4" /> Choose Subject
          </button>
          <button type="button" onClick={onRestart} className={primaryButton}>
            <RotateCcw className="h-4 w-4" /> Play Again
          </button>
        </div>

        <p className="mt-5 text-xs text-slate-600">{subject.icon} {subject.name} • Solve & Win</p>
      </div>
    </div>
  );
}

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
  const nextReward = REWARDS[Math.min(currentQuestionIndex, REWARDS.length - 1)];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1220] shadow-xl shadow-black/10">
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10">
            <Trophy className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-black">Reward ladder</h3>
            <p className="mt-1 text-[11px] text-slate-500">Your quiz journey</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Demo total</p>
            <Wallet className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="mt-2 text-2xl font-black tabular-nums text-emerald-300">₦{formatCash(totalWinnings)}</p>
          <p className="mt-1 text-[10px] text-slate-600">Not a withdrawable balance</p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-black text-slate-300">Question rewards</p>
          <span className="text-[10px] font-bold text-slate-600">6 LEVELS</span>
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
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                    completed
                      ? "bg-emerald-400 text-[#062015]"
                      : current
                        ? "bg-violet-500 text-white"
                        : "bg-slate-800 text-slate-500"
                  }`}>
                    {completed ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${
                      current ? "text-violet-200" : completed ? "text-emerald-200" : "text-slate-400"
                    }`}>
                      Question {index + 1}
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-600">{status}</p>
                  </div>
                </div>
                <p className={`shrink-0 text-xs font-black tabular-nums ${
                  current ? "text-violet-200" : completed ? "text-emerald-300" : "text-slate-500"
                }`}>
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
          <p className="mt-2 text-xl font-black text-violet-200">₦{formatCash(nextReward)}</p>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            {isFinalQuestion
              ? "You are at the last reward level."
              : "The displayed demo reward decreases as the timer runs."}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <div>
            <p className="text-xs font-bold text-amber-200">Play requirement</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              CBT Points and real payouts must be verified by the backend before a live rewards system is enabled.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

