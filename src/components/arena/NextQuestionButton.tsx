



"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface NextQuestionButtonProps {
  onNext: () => void;
  currentQuestion?: number;
  totalQuestions?: number;
  disabled?: boolean;
}

export default function NextQuestionButton({
  onNext,
  currentQuestion,
  totalQuestions,
  disabled = false,
}: NextQuestionButtonProps) {
  const hasProgress =
    typeof currentQuestion === "number" &&
    typeof totalQuestions === "number" &&
    totalQuestions > 0;

  const isLastQuestion =
    hasProgress &&
    currentQuestion >= totalQuestions;

  const buttonLabel = isLastQuestion
    ? "Finish Arena"
    : "Next Question";

  const handleClick = () => {
    if (disabled) {
      return;
    }

    onNext();
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      {/* ---------------------------------------------------------------- */}
      {/* Progress message                                                 */}
      {/* ---------------------------------------------------------------- */}

      {hasProgress && (
        <motion.p
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-3 text-xs font-medium text-slate-500"
        >
          {isLastQuestion
            ? "You've reached the final question"
            : `${totalQuestions - currentQuestion} question${
                totalQuestions - currentQuestion === 1
                  ? ""
                  : "s"
              } remaining`}
        </motion.p>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Button                                                           */}
      {/* ---------------------------------------------------------------- */}

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        whileHover={
          disabled
            ? undefined
            : {
                scale: 1.02,
                y: -2,
              }
        }
        whileTap={
          disabled
            ? undefined
            : {
                scale: 0.97,
              }
        }
        className={[
          "group relative flex min-w-[220px] items-center justify-center gap-3",
          "overflow-hidden rounded-2xl border px-6 py-4",
          "text-sm font-bold transition-all duration-200",

          disabled
            ? "cursor-not-allowed border-white/5 bg-white/5 text-slate-600"
            : "cursor-pointer border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:border-cyan-400/50 hover:bg-cyan-400/15 hover:shadow-lg hover:shadow-cyan-500/10",

          "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        ].join(" ")}
      >
        {/* -------------------------------------------------------------- */}
        {/* Animated shine                                                  */}
        {/* -------------------------------------------------------------- */}

        {!disabled && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-20 w-16 skew-x-[-20deg] bg-white/10"
            animate={{
              x: ["0%", "500%"],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
        )}

        {/* -------------------------------------------------------------- */}
        {/* Left icon                                                       */}
        {/* -------------------------------------------------------------- */}

        <span
          className={[
            "relative z-10 flex h-9 w-9 items-center justify-center rounded-xl",
            disabled
              ? "bg-white/5"
              : "bg-cyan-400 text-slate-950",
          ].join(" ")}
        >
          <ArrowRight
            size={18}
            strokeWidth={2.5}
          />
        </span>

        {/* -------------------------------------------------------------- */}
        {/* Text                                                            */}
        {/* -------------------------------------------------------------- */}

        <span className="relative z-10">
          {buttonLabel}
        </span>

        {/* -------------------------------------------------------------- */}
        {/* Chevron                                                         */}
        {/* -------------------------------------------------------------- */}

        <motion.span
          animate={
            disabled
              ? undefined
              : {
                  x: [0, 4, 0],
                }
          }
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <ChevronRight
            size={18}
            className={
              disabled
                ? "text-slate-700"
                : "text-cyan-300"
            }
          />
        </motion.span>
      </motion.button>
    </div>
  );
}
