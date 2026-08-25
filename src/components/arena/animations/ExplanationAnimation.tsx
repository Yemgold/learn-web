


"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface ExplanationAnimationProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function ExplanationAnimation({
  children,
  title = "Let's understand it",
  subtitle = "Here's how we arrive at the correct answer.",
}: ExplanationAnimationProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl sm:p-8"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Ambient background                                                */}
      {/* ---------------------------------------------------------------- */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, 0.7, 0.35],
            scale: [0.5, 1.1, 1],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />

        <motion.div
          className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl"
          animate={{
            x: [0, -15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: [0.7, 1.08, 1],
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 shadow-lg shadow-purple-500/10"
        >
          <Brain
            size={30}
            strokeWidth={1.7}
            className="text-purple-300"
          />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.4,
          }}
          className="mt-5 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles
              size={14}
              className="text-purple-300"
            />

            <span className="text-xs font-bold uppercase tracking-[0.22em] text-purple-300">
              Learning Mode
            </span>

            <Sparkles
              size={14}
              className="text-purple-300"
            />
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {title}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {subtitle}
          </p>
        </motion.div>

        {/* -------------------------------------------------------------- */}
        {/* Divider                                                         */}
        {/* -------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
            scaleX: 0,
          }}
          animate={{
            opacity: 1,
            scaleX: 1,
          }}
          transition={{
            delay: 0.35,
            duration: 0.5,
          }}
          className="mx-auto mt-7 h-px max-w-2xl origin-center bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
        />

        {/* -------------------------------------------------------------- */}
        {/* Explanation content                                             */}
        {/* -------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.5,
          }}
          className="mt-7"
        >
          {children}
        </motion.div>

        {/* -------------------------------------------------------------- */}
        {/* Bottom learning indicator                                       */}
        {/* -------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.75,
            duration: 0.4,
          }}
          className="mt-8 flex items-center justify-center gap-2 text-center"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-300/60" />

          <span className="text-xs font-medium text-slate-600">
            Understanding the method makes the next question easier.
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-purple-300/60" />
        </motion.div>
      </div>
    </motion.section>
  );
}
