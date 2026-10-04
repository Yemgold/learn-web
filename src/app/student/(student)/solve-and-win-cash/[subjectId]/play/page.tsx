





"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Trophy,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";

type GameState =
  | "QUESTION"
  | "REWARD"
  | "WRONG"
  | "CASHED_OUT";

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

const SUBJECTS: Record<string, SubjectConfig> = {
  biology: {
    name: "Biology",
    shortName: "BIO",
    icon: "🧬",
  },
  chemistry: {
    name: "Chemistry",
    shortName: "CHEM",
    icon: "⚗️",
  },
  physics: {
    name: "Physics",
    shortName: "PHY",
    icon: "⚡",
  },
  mathematics: {
    name: "Mathematics",
    shortName: "MATH",
    icon: "📐",
  },
};

/*
|--------------------------------------------------------------------------
| FRONTEND DEMO QUESTIONS
|--------------------------------------------------------------------------
*/

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
      explanation:
        "The cell is the basic structural and functional unit of life.",
    },
    {
      id: "bio-2",
      question:
        "Which organelle is commonly described as the powerhouse of the cell?",
      options: [
        { label: "A", text: "Ribosome" },
        { label: "B", text: "Nucleus" },
        { label: "C", text: "Mitochondrion" },
        { label: "D", text: "Golgi apparatus" },
      ],
      correctAnswer: "C",
      explanation:
        "Mitochondria produce most of the ATP used by cells for energy.",
    },
    {
      id: "bio-3",
      question:
        "Which process allows green plants to manufacture food using light energy?",
      options: [
        { label: "A", text: "Respiration" },
        { label: "B", text: "Photosynthesis" },
        { label: "C", text: "Transpiration" },
        { label: "D", text: "Excretion" },
      ],
      correctAnswer: "B",
      explanation:
        "Photosynthesis uses light energy to convert carbon dioxide and water into glucose.",
    },
    {
      id: "bio-4",
      question:
        "Which blood cells are primarily responsible for fighting infection?",
      options: [
        { label: "A", text: "Red blood cells" },
        { label: "B", text: "Platelets" },
        { label: "C", text: "White blood cells" },
        { label: "D", text: "Plasma cells" },
      ],
      correctAnswer: "C",
      explanation:
        "White blood cells help defend the body against pathogens and other foreign substances.",
    },
    {
      id: "bio-5",
      question:
        "Which part of a plant absorbs most water and mineral salts from the soil?",
      options: [
        { label: "A", text: "Leaf" },
        { label: "B", text: "Root hair" },
        { label: "C", text: "Flower" },
        { label: "D", text: "Fruit" },
      ],
      correctAnswer: "B",
      explanation:
        "Root hairs provide a large surface area for absorbing water and mineral salts.",
    },
    {
      id: "bio-6",
      question:
        "Which molecule carries genetic information in most living organisms?",
      options: [
        { label: "A", text: "DNA" },
        { label: "B", text: "Glucose" },
        { label: "C", text: "ATP" },
        { label: "D", text: "Water" },
      ],
      correctAnswer: "A",
      explanation:
        "DNA stores the genetic information used in the development and functioning of organisms.",
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
      explanation:
        "The chemical symbol for sodium is Na, derived from its Latin name natrium.",
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
      explanation:
        "Electrons carry a negative electrical charge.",
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
      explanation:
        "A neutral aqueous solution has a pH of approximately 7 at room temperature.",
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
      explanation:
        "Acids react with carbonates to produce a salt, water and carbon dioxide.",
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
      explanation:
        "Argon belongs to Group 18, the noble gases.",
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
      explanation:
        "A covalent bond is formed when atoms share electron pairs.",
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
      explanation:
        "The SI unit of force is the newton (N).",
    },
    {
      id: "phy-2",
      question:
        "Which of the following quantities has both magnitude and direction?",
      options: [
        { label: "A", text: "Mass" },
        { label: "B", text: "Speed" },
        { label: "C", text: "Distance" },
        { label: "D", text: "Velocity" },
      ],
      correctAnswer: "D",
      explanation:
        "Velocity is a vector quantity because it has both magnitude and direction.",
    },
    {
      id: "phy-3",
      question:
        "What is the approximate acceleration due to gravity near Earth's surface?",
      options: [
        { label: "A", text: "4.9 m/s²" },
        { label: "B", text: "9.8 m/s²" },
        { label: "C", text: "19.6 m/s²" },
        { label: "D", text: "98 m/s²" },
      ],
      correctAnswer: "B",
      explanation:
        "The commonly used value of gravitational acceleration near Earth's surface is 9.8 m/s².",
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
      explanation:
        "An ammeter is used to measure electric current in a circuit.",
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
      explanation:
        "A stretched or compressed spring stores elastic potential energy.",
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
      explanation:
        "Speed is calculated as distance divided by time.",
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
      explanation:
        "15% of 200 = 15/100 × 200 = 30.",
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
      explanation:
        "Divide both sides by 3: x = 18 ÷ 3 = 6.",
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
      explanation:
        "12 × 12 = 144, so √144 = 12.",
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
      explanation:
        "2³ means 2 × 2 × 2 = 8.",
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
      explanation:
        "a² + b² = 5² + 3² = 25 + 9 = 34.",
    },
    {
      id: "math-6",
      question:
        "What is the next number in the sequence 2, 4, 6, 8, ...?",
      options: [
        { label: "A", text: "9" },
        { label: "B", text: "10" },
        { label: "C", text: "11" },
        { label: "D", text: "12" },
      ],
      correctAnswer: "B",
      explanation:
        "The sequence increases by 2 each time, so the next number is 10.",
    },
  ],
};

/*
|--------------------------------------------------------------------------
| CASH REWARDS
|--------------------------------------------------------------------------
|
| These values represent CASH rewards.
| They are frontend demo values until the backend supplies the real
| reward amounts.
|
*/

const REWARDS = [
  500,
  550,
  600,
  650,
  700,
  750,
];

function formatCash(value: number) {
  return value.toFixed(4);
}

export default function SolveAndWinCbtPlayPage() {
  const params = useParams();
  const router = useRouter();

  const rawSubjectId = params?.subjectId;

  const subjectId = Array.isArray(rawSubjectId)
    ? rawSubjectId[0]
    : rawSubjectId;

  const normalizedSubjectId =
    String(subjectId ?? "biology").toLowerCase();

  const subject =
    SUBJECTS[normalizedSubjectId] ?? SUBJECTS.biology;

  const questions =
    QUESTIONS_BY_SUBJECT[normalizedSubjectId] ??
    QUESTIONS_BY_SUBJECT.biology;

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [gameState, setGameState] =
    useState<GameState>("QUESTION");

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [totalWinnings, setTotalWinnings] =
    useState(0);

  const [lastReward, setLastReward] =
    useState(0);

  const [lastCorrectAnswer, setLastCorrectAnswer] =
    useState<string | null>(null);

  const currentQuestion =
    questions[currentQuestionIndex];

  const currentReward =
    REWARDS[currentQuestionIndex] ??
    REWARDS[REWARDS.length - 1];

  const progress =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  const completedRewards = useMemo(() => {
    return REWARDS.slice(0, currentQuestionIndex);
  }, [currentQuestionIndex]);

  /*
  |--------------------------------------------------------------------------
  | ANSWER
  |--------------------------------------------------------------------------
  */

  const handleAnswer = (answer: string) => {
    if (
      isSubmitting ||
      gameState !== "QUESTION" ||
      !currentQuestion
    ) {
      return;
    }

    setSelectedAnswer(answer);
    setIsSubmitting(true);

    /*
     * Frontend-only simulation.
     *
     * Later this is where your backend answer endpoint
     * will be connected.
     */

    window.setTimeout(() => {
      setIsSubmitting(false);

      if (answer === currentQuestion.correctAnswer) {
        setLastReward(currentReward);

        setTotalWinnings(
          (previous) => previous + currentReward,
        );

        setGameState("REWARD");
      } else {
        setLastCorrectAnswer(
          currentQuestion.correctAnswer,
        );

        setGameState("WRONG");
      }
    }, 450);
  };

  /*
  |--------------------------------------------------------------------------
  | WIN MORE
  |--------------------------------------------------------------------------
  */

  const handleWinMore = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setGameState("CASHED_OUT");
      return;
    }

    setCurrentQuestionIndex(
      (previous) => previous + 1,
    );

    setSelectedAnswer(null);
    setLastReward(0);
    setLastCorrectAnswer(null);
    setGameState("QUESTION");
  };

  /*
  |--------------------------------------------------------------------------
  | CASH OUT
  |--------------------------------------------------------------------------
  |
  | Cash withdrawal is intentionally disabled for now.
  |
  | Instead, we show a Coming Soon screen telling the student
  | that they need CBT Points to play Solve & Win Cash.
  |
  */

  const handleCashOut = () => {
    setGameState("CASHED_OUT");
  };

  /*
  |--------------------------------------------------------------------------
  | TRY AGAIN
  |--------------------------------------------------------------------------
  */

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setLastCorrectAnswer(null);
    setGameState("QUESTION");
  };

  /*
  |--------------------------------------------------------------------------
  | RESTART
  |--------------------------------------------------------------------------
  */

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setLastReward(0);
    setLastCorrectAnswer(null);
    setTotalWinnings(0);
    setGameState("QUESTION");
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-6 flex items-center justify-between gap-4">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/student/solve-and-win-cbt",
              )
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              Subjects
            </span>
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <span className="text-lg">
                {subject.icon}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Solve & Win Cash
              </p>

              <h1 className="text-base font-black sm:text-lg">
                {subject.name}
              </h1>
            </div>

          </div>

          {/* CASH WALLET */}

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 sm:px-4">

            <Wallet className="h-4 w-4 text-emerald-300" />

            <span className="text-sm font-black text-emerald-200">
              ₦{formatCash(totalWinnings)}
            </span>

            <span className="hidden text-xs text-emerald-200/60 sm:inline">
              Cash
            </span>

          </div>

        </header>

        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <section className="mb-6">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              Question {currentQuestionIndex + 1} of{" "}
              {questions.length}
            </span>

            <span className="text-xs font-bold text-violet-400">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* ===================================================
              MAIN GAME
          =================================================== */}

          <section>

            {gameState === "QUESTION" && (
              <QuestionScreen
                subject={subject}
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                isSubmitting={isSubmitting}
                currentReward={currentReward}
                onAnswer={handleAnswer}
              />
            )}

            {gameState === "REWARD" && (
              <RewardScreen
                reward={lastReward}
                totalWinnings={totalWinnings}
                questionNumber={
                  currentQuestionIndex + 1
                }
                totalQuestions={questions.length}
                onCashOut={handleCashOut}
                onWinMore={handleWinMore}
              />
            )}

            {gameState === "WRONG" && (
              <WrongScreen
                selectedAnswer={selectedAnswer}
                correctAnswer={lastCorrectAnswer}
                explanation={currentQuestion.explanation}
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
                  router.push(
                    "/student/solve-and-win-cbt",
                  )
                }
              />
            )}

          </section>

          {/* ===================================================
              LADDER
          =================================================== */}

          <aside>
            <CbtLadder
              currentQuestionIndex={
                currentQuestionIndex
              }
              totalWinnings={totalWinnings}
              completedRewards={completedRewards}
            />
          </aside>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-8 flex items-center justify-center">

          <p className="text-center text-xs text-slate-600">
            Solve correctly to increase your cash reward.
          </p>

        </footer>

      </div>
    </main>
  );
}

/* =============================================================
   QUESTION SCREEN
============================================================= */

function QuestionScreen({
  subject,
  question,
  selectedAnswer,
  isSubmitting,
  currentReward,
  onAnswer,
}: {
  subject: SubjectConfig;
  question: Question;
  selectedAnswer: string | null;
  isSubmitting: boolean;
  currentReward: number;
  onAnswer: (answer: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d1320] p-5 shadow-2xl sm:p-7">

      {/* TOP LABEL */}

      <div className="mb-6 flex items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
            {subject.icon}
          </span>

          <div>
            <p className="text-xs text-slate-500">
              Subject
            </p>

            <p className="text-sm font-bold">
              {subject.name}
            </p>
          </div>

        </div>

        {/* CASH REWARD */}

        <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-2">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Cash Reward
          </p>

          <p className="text-sm font-black text-emerald-300">
            +₦{formatCash(currentReward)}
          </p>

        </div>

      </div>

      {/* QUESTION */}

      <div className="mb-7">

        <span className="mb-3 inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
          Question
        </span>

        <h2 className="text-xl font-black leading-relaxed sm:text-2xl">
          {question.question}
        </h2>

      </div>

      {/* OPTIONS */}

      <div className="space-y-3">

        {question.options.map((option) => {

          const selected =
            selectedAnswer === option.label;

          return (
            <button
              key={option.label}
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                onAnswer(option.label)
              }
              className={[
                "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                selected
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-violet-500/50 hover:bg-violet-500/5",
                isSubmitting
                  ? "cursor-wait opacity-70"
                  : "cursor-pointer",
              ].join(" ")}
            >

              <span
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition",
                  selected
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-slate-700 bg-slate-800 text-slate-300 group-hover:border-violet-500/50 group-hover:text-white",
                ].join(" ")}
              >
                {option.label}
              </span>

              <span className="flex-1 text-sm font-semibold leading-6 text-slate-200 sm:text-base">
                {option.text}
              </span>

              <ArrowRight
                className={[
                  "h-5 w-5 shrink-0 transition",
                  selected
                    ? "text-violet-300"
                    : "text-slate-700 group-hover:text-violet-400",
                ].join(" ")}
              />

            </button>
          );
        })}

      </div>

      {/* BOTTOM INFO */}

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">

        <Zap className="h-3.5 w-3.5" />

        <span>
          Answer correctly to win cash.
        </span>

      </div>

    </div>
  );
}

/* =============================================================
   REWARD SCREEN
============================================================= */

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
  const hasMore =
    questionNumber < totalQuestions;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0c1715] p-6 shadow-2xl sm:p-10">

      {/* GLOW */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative text-center">

        {/* ICON */}

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">

          <CheckCircle2 className="h-10 w-10 text-emerald-400" />

        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
          Correct Answer
        </p>

        <h2 className="mt-3 text-3xl font-black sm:text-4xl">
          Congratulations! 🎉
        </h2>

        <p className="mt-4 text-sm text-slate-400">
          You have won
        </p>

        {/* CASH REWARD */}

        <div className="my-4 text-4xl font-black text-emerald-300 sm:text-5xl">
          ₦{formatCash(reward)}
        </div>

        {/* TOTAL CASH */}

        <div className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-5 py-3">

          <Wallet className="h-5 w-5 text-emerald-300" />

          <span className="text-sm text-slate-400">
            Total Cash:
          </span>

          <span className="font-black text-emerald-200">
            ₦{formatCash(totalWinnings)}
          </span>

        </div>

        {/* DECISION */}

        <div className="mx-auto mt-8 max-w-md">

          <p className="mb-4 text-sm font-bold text-white">
            Cash Out Or Win More?
          </p>

          <div className="grid gap-3 sm:grid-cols-2">

            <button
              type="button"
              onClick={onCashOut}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 font-bold transition hover:border-amber-400/40 hover:bg-slate-800"
            >
              <Wallet className="h-5 w-5 text-amber-300" />

              <span>
                Cash Out
              </span>
            </button>

            <button
              type="button"
              onClick={onWinMore}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 font-bold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
            >
              {hasMore ? "Win More" : "Finish"}

              <ArrowRight className="h-5 w-5" />
            </button>

          </div>

          {hasMore && (
            <p className="mt-4 text-xs text-slate-600">
              Continue to the next question to increase your cash reward.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   WRONG SCREEN
============================================================= */

function WrongScreen({
  selectedAnswer,
  correctAnswer,
  explanation,
  totalWinnings,
  onTryAgain,
  onCashOut,
}: {
  selectedAnswer: string | null;
  correctAnswer: string | null;
  explanation: string;
  totalWinnings: number;
  onTryAgain: () => void;
  onCashOut: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-[#170d12] p-6 shadow-2xl sm:p-10">

      <div className="text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">

          <XCircle className="h-10 w-10 text-red-400" />

        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
          Incorrect Answer
        </p>

        <h2 className="mt-3 text-3xl font-black">
          Keep Learning 💪
        </h2>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-left">

          <p className="text-xs text-slate-500">
            Your answer
          </p>

          <p className="mt-1 font-bold text-red-300">
            {selectedAnswer ?? "-"}
          </p>

          <div className="my-4 border-t border-slate-800" />

          <p className="text-xs text-slate-500">
            Correct answer
          </p>

          <p className="mt-1 font-bold text-emerald-300">
            {correctAnswer ?? "-"}
          </p>

        </div>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-left">

          <p className="text-xs font-bold text-slate-400">
            Explanation
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {explanation}
          </p>

        </div>

        {/* CURRENT CASH */}

        <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">

          <p className="text-xs text-slate-500">
            Current Cash
          </p>

          <p className="mt-1 font-black text-emerald-300">
            ₦{formatCash(totalWinnings)}
          </p>

        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={onTryAgain}
            className="h-14 rounded-2xl bg-violet-600 font-bold transition hover:bg-violet-500"
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={onCashOut}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 font-bold transition hover:bg-slate-800"
          >
            <Wallet className="h-5 w-5" />

            Cash Out
          </button>

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   CASH OUT / COMING SOON SCREEN
============================================================= */

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
    <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-[#151208] p-6 shadow-2xl sm:p-10">

      {/* GLOW */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative text-center">

        {/* ICON */}

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 ring-8 ring-amber-400/5">

          <Wallet className="h-10 w-10 text-amber-300" />

        </div>

        {/* COMING SOON */}

        <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2">

          <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            Coming Soon
          </span>

        </div>

        <h2 className="mt-5 text-3xl font-black sm:text-4xl">
          Cash Out Is Coming Soon 🚀
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400">
          Your cash reward is being prepared for withdrawal.
          Cash Out will be available soon.
        </p>

        {/* CASH DISPLAY */}

        <div className="my-7">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Your Current Reward
          </p>

          <div className="mt-2 flex items-center justify-center gap-2">

            <Wallet className="h-7 w-7 text-emerald-300" />

            <span className="text-5xl font-black text-emerald-300">
              ₦{formatCash(totalWinnings)}
            </span>

          </div>

          <p className="mt-2 text-xs text-slate-600">
            Cash withdrawal will be enabled soon.
          </p>

        </div>

        {/* MAIN MESSAGE */}

        <div className="mx-auto max-w-lg rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

            <Coins className="h-7 w-7 text-violet-300" />

          </div>

          <h3 className="mt-4 text-xl font-black text-white">
            Earn More CBT Points
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Earn more CBT Points to play
            <span className="font-bold text-white">
              {" "}Solve & Win Cash
            </span>
            {" "}and increase your chances of earning more cash rewards.
          </p>

        </div>

        {/* ACTIONS */}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={onSubjects}
            className="h-14 rounded-2xl border border-slate-700 bg-slate-900 font-bold transition hover:border-slate-500 hover:bg-slate-800"
          >
            Choose Subject
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 font-bold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
          >
            Play Again

            <ArrowRight className="h-5 w-5" />
          </button>

        </div>

        <p className="mt-5 text-xs text-slate-600">
          {subject.icon} {subject.name} • Solve & Win Cash
        </p>

      </div>

    </div>
  );
}

/* =============================================================
   CASH REWARD LADDER
============================================================= */

function CbtLadder({
  currentQuestionIndex,
  totalWinnings,
  completedRewards,
}: {
  currentQuestionIndex: number;
  totalWinnings: number;
  completedRewards: number[];
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d1320] p-5">

      {/* HEADER */}

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">

          <Trophy className="h-5 w-5 text-emerald-300" />

        </div>

        <div>

          <h3 className="font-black">
            Cash Reward Ladder
          </h3>

          <p className="text-xs text-slate-500">
            Climb by answering correctly
          </p>

        </div>

      </div>

      {/* TOTAL CASH */}

      <div className="mb-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">

        <p className="text-xs text-slate-500">
          Current Cash
        </p>

        <div className="mt-1 flex items-center gap-2">

          <Wallet className="h-4 w-4 text-emerald-300" />

          <span className="text-xl font-black text-emerald-200">
            ₦{formatCash(totalWinnings)}
          </span>

        </div>

      </div>

      {/* LADDER */}

      <div className="space-y-2">

        {[...REWARDS]
          .map((reward, index) => {

            const completed =
              index < currentQuestionIndex;

            const current =
              index === currentQuestionIndex;

            return {
              reward,
              index,
              completed,
              current,
            };
          })
          .reverse()
          .map(
            ({
              reward,
              index,
              completed,
              current,
            }) => (
              <div
                key={index}
                className={[
                  "flex items-center justify-between rounded-xl border px-3 py-3 transition-all",
                  current
                    ? "border-violet-500/40 bg-violet-500/10"
                    : completed
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-slate-800 bg-slate-900/40",
                ].join(" ")}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black",
                      completed
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "bg-violet-500 text-white"
                          : "bg-slate-800 text-slate-600",
                    ].join(" ")}
                  >
                    {completed ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <span
                    className={[
                      "text-xs font-bold",
                      current
                        ? "text-violet-300"
                        : completed
                          ? "text-emerald-300"
                          : "text-slate-500",
                    ].join(" ")}
                  >
                    Question {index + 1}
                  </span>

                </div>

                <span
                  className={[
                    "text-xs font-black",
                    current
                      ? "text-violet-300"
                      : completed
                        ? "text-emerald-300"
                        : "text-slate-600",
                  ].join(" ")}
                >
                  +₦{formatCash(reward)}
                </span>

              </div>
            ),
          )}

      </div>

      {/* NEXT REWARD */}

      <div className="mt-5 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-4">

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
          Next correct answer
        </p>

        <p className="mt-1 text-lg font-black text-violet-300">
          +₦
          {formatCash(
            REWARDS[
              Math.min(
                currentQuestionIndex,
                REWARDS.length - 1,
              )
            ],
          )}
        </p>

      </div>

      {/* CBT POINT NOTICE */}

      <div className="mt-4 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">

        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70">
          Play Requirement
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Earn CBT Points to play Solve & Win Cash.
        </p>

      </div>

    </div>
  );
}