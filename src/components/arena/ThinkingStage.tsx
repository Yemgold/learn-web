




"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface ThinkingStageProps {
  timeLeft: number;
}

export default function ThinkingStage({
  timeLeft,
}: ThinkingStageProps) {
  const isUrgent = timeLeft <= 3;

  return (
    <section
      aria-label="Thinking phase"
      className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-12 shadow-2xl backdrop-blur-xl sm:min-h-[400px] sm:px-8"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Ambient Background                                               */}
      {/* ---------------------------------------------------------------- */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute left-10 top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Main Content                                                     */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Brain icon */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Glow */}

          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl" />

          {/* Icon container */}

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10 shadow-2xl sm:h-28 sm:w-28">
            <Brain
              size={48}
              strokeWidth={1.5}
              className="text-purple-300 sm:h-14 sm:w-14"
            />
          </div>
        </motion.div>

        {/* THINK label */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.4,
          }}
          className="mt-7"
        >
          <h2 className="text-3xl font-black tracking-[0.2em] text-white sm:text-4xl">
            THINK
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Take a moment and work it out.
          </p>
        </motion.div>

        {/* Countdown number */}

        <motion.div
          key={timeLeft}
          initial={{
            opacity: 0,
            scale: 1.35,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="mt-8"
        >
          <div
            className={[
              "flex h-20 w-20 items-center justify-center rounded-2xl",
              "border text-3xl font-black tabular-nums shadow-xl",
              "transition-colors duration-300",
              isUrgent
                ? "border-red-400/40 bg-red-500/10 text-red-300"
                : "border-white/10 bg-white/5 text-white",
            ].join(" ")}
          >
            {timeLeft}
          </div>
        </motion.div>

        {/* Urgent message */}

        <motion.div
          key={isUrgent ? "urgent" : "normal"}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="mt-4"
        >
          <p
            className={
              isUrgent
                ? "text-xs font-semibold uppercase tracking-widest text-red-400"
                : "text-xs font-medium uppercase tracking-widest text-slate-500"
            }
          >
            {isUrgent
              ? "Time is almost up!"
              : "Choose your answer carefully"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

