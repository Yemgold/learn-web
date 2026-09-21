





"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Check,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
  XCircle,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

export interface ContestQuestionOption {
  label: string;
  value: string;
}

export interface ContestQuestion {
  id: string;
  question: string;
  options: ContestQuestionOption[];
  correctAnswer: string;
}

interface ContestQualificationCardProps {
  questions?: ContestQuestion[];

  /**
   * Number of seconds allowed to answer.
   * Default = 10 seconds.
   */
  questionTime?: number;

  /**
   * Optional callback when the student qualifies.
   */
  onQualified?: (question: ContestQuestion) => void;

  /**
   * Optional callback when the student fails.
   */
  onFailed?: (
    question: ContestQuestion,
    reason: "incorrect" | "timeout",
  ) => void;

  className?: string;
}

/* ============================================================
   SAMPLE FRONTEND QUESTIONS
   Replace these later with your real questions.
   ============================================================ */

const DEFAULT_QUESTIONS: ContestQuestion[] = [
  {
    id: "qualification-1",
    question:
      "Which part of the cell is responsible for controlling the activities of the cell?",
    options: [
      {
        label: "A",
        value: "Ribosome",
      },
      {
        label: "B",
        value: "Nucleus",
      },
      {
        label: "C",
        value: "Cell wall",
      },
      {
        label: "D",
        value: "Vacuole",
      },
    ],
    correctAnswer: "Nucleus",
  },

  {
    id: "qualification-2",
    question:
      "Which organ is primarily responsible for pumping blood around the human body?",
    options: [
      {
        label: "A",
        value: "Liver",
      },
      {
        label: "B",
        value: "Kidney",
      },
      {
        label: "C",
        value: "Heart",
      },
      {
        label: "D",
        value: "Lung",
      },
    ],
    correctAnswer: "Heart",
  },

  {
    id: "qualification-3",
    question:
      "Which process do green plants use to manufacture their food?",
    options: [
      {
        label: "A",
        value: "Respiration",
      },
      {
        label: "B",
        value: "Photosynthesis",
      },
      {
        label: "C",
        value: "Transpiration",
      },
      {
        label: "D",
        value: "Excretion",
      },
    ],
    correctAnswer: "Photosynthesis",
  },

  {
    id: "qualification-4",
    question:
      "Which blood cells are mainly responsible for fighting infections?",
    options: [
      {
        label: "A",
        value: "Red blood cells",
      },
      {
        label: "B",
        value: "Platelets",
      },
      {
        label: "C",
        value: "White blood cells",
      },
      {
        label: "D",
        value: "Plasma",
      },
    ],
    correctAnswer: "White blood cells",
  },

  {
    id: "qualification-5",
    question:
      "Which structure in a plant absorbs water and mineral salts from the soil?",
    options: [
      {
        label: "A",
        value: "Leaf",
      },
      {
        label: "B",
        value: "Root hair",
      },
      {
        label: "C",
        value: "Flower",
      },
      {
        label: "D",
        value: "Stem",
      },
    ],
    correctAnswer: "Root hair",
  },

  {
    id: "qualification-6",
    question:
      "Which gas is required by humans for aerobic respiration?",
    options: [
      {
        label: "A",
        value: "Carbon dioxide",
      },
      {
        label: "B",
        value: "Nitrogen",
      },
      {
        label: "C",
        value: "Oxygen",
      },
      {
        label: "D",
        value: "Hydrogen",
      },
    ],
    correctAnswer: "Oxygen",
  },

  {
    id: "qualification-7",
    question:
      "Which part of the digestive system is mainly responsible for absorbing digested nutrients?",
    options: [
      {
        label: "A",
        value: "Stomach",
      },
      {
        label: "B",
        value: "Small intestine",
      },
      {
        label: "C",
        value: "Large intestine",
      },
      {
        label: "D",
        value: "Oesophagus",
      },
    ],
    correctAnswer: "Small intestine",
  },

  {
    id: "qualification-8",
    question:
      "Which component of blood is mainly responsible for clotting?",
    options: [
      {
        label: "A",
        value: "Platelets",
      },
      {
        label: "B",
        value: "Red blood cells",
      },
      {
        label: "C",
        value: "White blood cells",
      },
      {
        label: "D",
        value: "Plasma",
      },
    ],
    correctAnswer: "Platelets",
  },

  {
    id: "qualification-9",
    question:
      "Which organ removes urea and other wastes from the blood?",
    options: [
      {
        label: "A",
        value: "Heart",
      },
      {
        label: "B",
        value: "Kidney",
      },
      {
        label: "C",
        value: "Pancreas",
      },
      {
        label: "D",
        value: "Stomach",
      },
    ],
    correctAnswer: "Kidney",
  },

  {
    id: "qualification-10",
    question:
      "Which structure controls the amount of light entering the human eye?",
    options: [
      {
        label: "A",
        value: "Retina",
      },
      {
        label: "B",
        value: "Cornea",
      },
      {
        label: "C",
        value: "Iris",
      },
      {
        label: "D",
        value: "Optic nerve",
      },
    ],
    correctAnswer: "Iris",
  },
];

/* ============================================================
   COMPONENT
   ============================================================ */

export default function ContestQualificationCard({
  questions = DEFAULT_QUESTIONS,
  questionTime = 10,
  onQualified,
  onFailed,
  className = "",
}: ContestQualificationCardProps) {
  /* ============================================================
     ONLY USE 10 QUESTIONS
     ============================================================ */

  const contestQuestions = useMemo(() => {
    return questions.slice(0, 10);
  }, [questions]);

  /* ============================================================
     STATE
     ============================================================ */

  const [selectedQuestionIndex, setSelectedQuestionIndex] =
    useState<number | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    null,
  );

  const [timeRemaining, setTimeRemaining] = useState(questionTime);

  const [result, setResult] = useState<
    "idle" | "correct" | "incorrect" | "timeout"
  >("idle");

  /* ============================================================
     CURRENT QUESTION
     ============================================================ */

  const selectedQuestion = useMemo(() => {
    if (selectedQuestionIndex === null) {
      return null;
    }

    return contestQuestions[selectedQuestionIndex] ?? null;
  }, [selectedQuestionIndex, contestQuestions]);

  /* ============================================================
     RESET DEMO
     ============================================================ */

  const resetContest = () => {
    setSelectedQuestionIndex(null);
    setSelectedAnswer(null);
    setTimeRemaining(questionTime);
    setResult("idle");
  };

  /* ============================================================
     SELECT ONE QUESTION
     ============================================================ */

  const selectQuestion = (index: number) => {
    // Once a question has been selected,
    // the student cannot switch questions.
    if (selectedQuestionIndex !== null) {
      return;
    }

    setSelectedQuestionIndex(index);
    setSelectedAnswer(null);
    setTimeRemaining(questionTime);
    setResult("idle");
  };

  /* ============================================================
     COUNTDOWN
     ============================================================ */

  useEffect(() => {
    if (
      selectedQuestionIndex === null ||
      result !== "idle"
    ) {
      return;
    }

    if (timeRemaining <= 0) {
      setResult("timeout");

      if (selectedQuestion) {
        onFailed?.(selectedQuestion, "timeout");
      }

      return;
    }

    const interval = window.setInterval(() => {
      setTimeRemaining((previous) => {
        if (previous <= 1) {
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    selectedQuestionIndex,
    result,
    timeRemaining,
    selectedQuestion,
    onFailed,
  ]);

  /* ============================================================
     HANDLE TIMEOUT
     ============================================================ */

  useEffect(() => {
    if (
      selectedQuestionIndex === null ||
      result !== "idle" ||
      timeRemaining !== 0
    ) {
      return;
    }

    setResult("timeout");

    if (selectedQuestion) {
      onFailed?.(selectedQuestion, "timeout");
    }
  }, [
    timeRemaining,
    selectedQuestionIndex,
    result,
    selectedQuestion,
    onFailed,
  ]);

  /* ============================================================
     ANSWER QUESTION
     ============================================================ */

  const handleAnswer = (value: string) => {
    if (
      !selectedQuestion ||
      result !== "idle" ||
      selectedAnswer !== null ||
      timeRemaining <= 0
    ) {
      return;
    }

    setSelectedAnswer(value);

    const isCorrect =
      value === selectedQuestion.correctAnswer;

    if (isCorrect) {
      setResult("correct");

      onQualified?.(selectedQuestion);
    } else {
      setResult("incorrect");

      onFailed?.(selectedQuestion, "incorrect");
    }
  };

  /* ============================================================
     TIMER PERCENTAGE
     ============================================================ */

  const timerPercentage =
    questionTime > 0
      ? (timeRemaining / questionTime) * 100
      : 0;

  const timerIsDanger =
    timeRemaining <= 3;

  /* ============================================================
     EMPTY STATE
     ============================================================ */

  if (contestQuestions.length === 0) {
    return (
      <section
        className={`
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-slate-950
          shadow-2xl
          shadow-black/60
          ${className}
        `}
      >
        <div className="p-8 text-center">
          <p className="text-sm text-white/50">
            No qualification questions are available.
          </p>
        </div>
      </section>
    );
  }

  /* ============================================================
     MAIN CARD
     ============================================================ */

  return (
    <section
      className={`
        relative
        w-full
        max-w-2xl
        overflow-hidden
        rounded-3xl
        border
        border-blue-400/20
        bg-slate-950
        shadow-2xl
        shadow-black/60
        ${className}
      `}
    >
      {/* ======================================================
          DECORATIVE BACKGROUND
          ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-blue-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-24
          h-72
          w-72
          rounded-full
          bg-purple-500/10
          blur-3xl
        "
      />

      {/* ======================================================
          CONTENT
          ====================================================== */}

      <div className="relative p-6 sm:p-8">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="text-center">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-blue-400/20
              bg-blue-500/10
              shadow-xl
              shadow-blue-950/20
            "
          >
            {result === "correct" ? (
              <Trophy className="h-7 w-7 text-amber-300" />
            ) : (
              <Sparkles className="h-7 w-7 text-blue-300" />
            )}
          </div>

          <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
            Contest Qualification
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
            Select one question below. Answer it before
            the countdown reaches zero to qualify for the
            contest.
          </p>

          <div className="mt-4 flex justify-center">
            <span
              className="
                rounded-full
                border
                border-blue-400/20
                bg-blue-500/10
                px-3
                py-1
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-blue-300
              "
            >
              {questionTime}-Second Challenge
            </span>
          </div>
        </div>

        {/* ====================================================
            QUESTION NUMBER BUTTONS
            ==================================================== */}

        <div
          className="
            mt-7
            rounded-2xl
            border
            border-white/10
            bg-white/[0.025]
            p-4
          "
        >
          <div className="mb-3 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                Choose One
              </p>

              <p className="mt-1 text-[11px] text-white/35">
                Pick a question to begin
              </p>
            </div>

            {selectedQuestionIndex !== null && (
              <span
                className="
                  rounded-full
                  border
                  border-blue-400/20
                  bg-blue-500/10
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  text-blue-300
                "
              >
                Question {selectedQuestionIndex + 1}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {contestQuestions.map((question, index) => {
              const isSelected =
                selectedQuestionIndex === index;

              const isLocked =
                selectedQuestionIndex !== null &&
                !isSelected;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => selectQuestion(index)}
                  disabled={isLocked}
                  aria-label={`Select question ${index + 1}`}
                  aria-pressed={isSelected}
                  className={`
                    flex
                    h-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    text-sm
                    font-bold
                    transition
                    ${
                      isSelected
                        ? `
                          border-blue-400/60
                          bg-blue-500
                          text-white
                          shadow-lg
                          shadow-blue-950/30
                        `
                        : isLocked
                          ? `
                            cursor-not-allowed
                            border-white/5
                            bg-white/[0.02]
                            text-white/15
                          `
                          : `
                            border-white/10
                            bg-white/[0.04]
                            text-white/55
                            hover:border-blue-400/30
                            hover:bg-blue-500/10
                            hover:text-white
                          `
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            NO QUESTION SELECTED
            ==================================================== */}

        {selectedQuestionIndex === null && (
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-dashed
              border-white/10
              bg-white/[0.02]
              px-5
              py-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-white/[0.04]
              "
            >
              <Sparkles className="h-5 w-5 text-white/30" />
            </div>

            <p className="mt-4 text-sm font-semibold text-white/70">
              Select one question
            </p>

            <p className="mt-1 text-xs text-white/30">
              Your countdown will start immediately.
            </p>
          </div>
        )}

        {/* ====================================================
            QUESTION
            ==================================================== */}

        {selectedQuestion &&
  selectedQuestionIndex !== null &&
  result === "idle" && (
    
          <div className="mt-5">

            {/* TIMER */}

            <div
              className={`
                rounded-2xl
                border
                p-4
                ${
                  timerIsDanger
                    ? `
                      border-red-400/30
                      bg-red-500/[0.08]
                    `
                    : `
                      border-amber-400/20
                      bg-amber-500/[0.06]
                    `
                }
              `}
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <Clock3
                    className={`
                      h-4
                      w-4
                      ${
                        timerIsDanger
                          ? "text-red-300"
                          : "text-amber-300"
                      }
                    `}
                  />

                  <span
                    className={`
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      ${
                        timerIsDanger
                          ? "text-red-300"
                          : "text-amber-300"
                      }
                    `}
                  >
                    Time Remaining
                  </span>
                </div>

                <span
                  className={`
                    text-2xl
                    font-black
                    tabular-nums
                    ${
                      timerIsDanger
                        ? "text-red-200"
                        : "text-amber-100"
                    }
                  `}
                >
                  {timeRemaining}s
                </span>
              </div>

              {/* TIMER BAR */}

              <div
                className="
                  mt-3
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-black/20
                "
              >
                <div
                  className={`
                    h-full
                    rounded-full
                    transition-all
                    duration-1000
                    ${
                      timerIsDanger
                        ? "bg-red-400"
                        : "bg-amber-400"
                    }
                  `}
                  style={{
                    width: `${timerPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* QUESTION TEXT */}

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-5
              "
            >
              <div className="flex items-center justify-between gap-3">

                <span
                  className="
                    rounded-full
                    border
                    border-blue-400/20
                    bg-blue-500/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-blue-300
                  "
                >
                  Question {selectedQuestionIndex + 1}
                </span>

                <span className="text-[10px] font-semibold text-white/25">
                  Choose the correct answer
                </span>
              </div>

              <h3
                className="
                  mt-5
                  text-base
                  font-bold
                  leading-7
                  text-white
                  sm:text-lg
                "
              >
                {selectedQuestion.question}
              </h3>
            </div>

            {/* OPTIONS */}

            <div className="mt-4 space-y-3">
              {selectedQuestion.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswer(option.value)}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.025]
                    p-3
                    text-left
                    transition
                    hover:border-blue-400/30
                    hover:bg-blue-500/[0.06]
                    active:scale-[0.99]
                  "
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      text-sm
                      font-black
                      text-white/60
                      transition
                      group-hover:border-blue-400/30
                      group-hover:bg-blue-500/10
                      group-hover:text-blue-300
                    "
                  >
                    {option.label}
                  </span>

                  <span className="text-sm font-medium leading-6 text-white/75 group-hover:text-white">
                    {option.value}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-center text-[10px] text-white/25">
              Your answer will be submitted immediately.
            </p>
          </div>
        )}

        {/* ====================================================
            CORRECT RESULT
            ==================================================== */}

        {result === "correct" && selectedQuestion && (
          <div
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              border
              border-emerald-400/25
              bg-emerald-500/[0.07]
            "
          >
            <div className="p-6 text-center">

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-emerald-400/30
                  bg-emerald-500/10
                  shadow-xl
                  shadow-emerald-950/20
                "
              >
                <CheckCircle2 className="h-9 w-9 text-emerald-300" />
              </div>

              <div className="mt-5 flex justify-center">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-amber-400/25
                    bg-amber-500/10
                    px-3
                    py-1
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-amber-300
                  "
                >
                  <Trophy className="h-3 w-3" />
                  Qualified
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-black text-white">
                Congratulations!
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-emerald-100/65">
                Your answer is correct. You have qualified
                for the contest.
              </p>

              <div
                className="
                  mx-auto
                  mt-5
                  max-w-sm
                  rounded-xl
                  border
                  border-emerald-400/15
                  bg-black/10
                  px-4
                  py-3
                "
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/50">
                  Correct Answer
                </div>

                <div className="mt-1 text-sm font-bold text-emerald-100">
                  {selectedQuestion.correctAnswer}
                </div>
              </div>
            </div>

            {/* SUCCESS BAR */}

            <div className="h-1 bg-white/[0.04]">
              <div className="h-full w-full bg-emerald-400" />
            </div>
          </div>
        )}

        {/* ====================================================
            INCORRECT RESULT
            ==================================================== */}

        {result === "incorrect" && selectedQuestion && (
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-red-400/25
              bg-red-500/[0.06]
              p-6
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-red-400/20
                bg-red-500/10
              "
            >
              <XCircle className="h-9 w-9 text-red-300" />
            </div>

            <h3 className="mt-5 text-xl font-black text-white">
              Not Qualified
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">
              Your selected answer was incorrect, so you
              did not qualify for this contest.
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/10 px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                Correct Answer
              </div>

              <div className="mt-1 text-sm font-bold text-white/80">
                {selectedQuestion.correctAnswer}
              </div>
            </div>

            <button
              type="button"
              onClick={resetContest}
              className="
                mt-5
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.05]
                px-5
                py-3
                text-sm
                font-bold
                text-white/70
                transition
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              <RotateCcw className="h-4 w-4" />
              Reset Demo
            </button>
          </div>
        )}

        {/* ====================================================
            TIMEOUT RESULT
            ==================================================== */}

        {result === "timeout" && selectedQuestion && (
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-red-400/25
              bg-red-500/[0.06]
              p-6
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-red-400/20
                bg-red-500/10
              "
            >
              <Clock3 className="h-8 w-8 text-red-300" />
            </div>

            <h3 className="mt-5 text-xl font-black text-white">
              Time Up
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">
              The countdown reached zero before you
              selected an answer. You did not qualify for
              this contest.
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/10 px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                Correct Answer
              </div>

              <div className="mt-1 text-sm font-bold text-white/80">
                {selectedQuestion.correctAnswer}
              </div>
            </div>

            <button
              type="button"
              onClick={resetContest}
              className="
                mt-5
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.05]
                px-5
                py-3
                text-sm
                font-bold
                text-white/70
                transition
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              <RotateCcw className="h-4 w-4" />
              Reset Demo
            </button>
          </div>
        )}

        {/* ====================================================
            FOOTER INFORMATION
            ==================================================== */}

        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-white/[0.06]" />

          <span className="text-[9px] font-bold uppercase tracking-wider text-white/20">
            Frontend Qualification
          </span>

          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <p className="mt-3 text-center text-[10px] leading-5 text-white/25">
          This prototype handles question selection,
          countdown, answer checking, and qualification
          entirely in the browser.
        </p>
      </div>
    </section>
  );
}