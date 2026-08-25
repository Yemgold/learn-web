




"use client";

import { motion } from "framer-motion";
import AnswerOption from "./AnswerOption";

export interface AnswerOptionData {
  id: string;
  text: string;
}

interface AnswerOptionsProps {
  options: AnswerOptionData[];
  selectedAnswer: string | null;
  onSelect: (answerId: string) => void;
  disabled?: boolean;
}

export default function AnswerOptions({
  options,
  selectedAnswer,
  onSelect,
  disabled = false,
}: AnswerOptionsProps) {
  if (!options.length) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-6 text-center">
        <p className="text-sm font-medium text-red-300">
          No answer options are available for this question.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Answer options"
      className="w-full"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Instruction                                                      */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="mb-5 flex items-center justify-between"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Your Answer
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Select one option
          </p>
        </div>

        {/* Option count */}

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <span className="text-xs font-semibold text-slate-500">
            {options.length} options
          </span>
        </div>
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* Options                                                          */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="
          grid
          grid-cols-1
          gap-3

          sm:grid-cols-2
          sm:gap-4
        "
      >
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
              ease: "easeOut",
            }}
          >
            <AnswerOption
              id={option.id}
              text={option.text}
              selected={selectedAnswer === option.id}
              onSelect={onSelect}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
