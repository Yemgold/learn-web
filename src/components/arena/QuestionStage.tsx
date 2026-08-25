



"use client";

import { motion } from "framer-motion";
import QuestionText from "./QuestionText";

interface QuestionStageProps {
  question: string;
}

export default function QuestionStage({
  question,
}: QuestionStageProps) {
  return (
    <section
      aria-label="Question"
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-10 shadow-2xl backdrop-blur-xl sm:px-8 sm:py-14 lg:px-12 lg:py-16"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Ambient Background                                               */}
      {/* ---------------------------------------------------------------- */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top glow */}
        <motion.div
          className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom glow */}
        <motion.div
          className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Question Content                                                 */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Question label */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mb-7 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-white/20 sm:w-14" />

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Question
          </span>

          <span className="h-px w-8 bg-white/20 sm:w-14" />
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Main Question                                                   */}
        {/* ---------------------------------------------------------------- */}

        <QuestionText question={question} />

        {/* ---------------------------------------------------------------- */}
        {/* Thinking Prompt                                                 */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
            duration: 0.5,
          }}
          className="mt-10 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
              🧠
            </span>

            <span>
              Read the question carefully
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
