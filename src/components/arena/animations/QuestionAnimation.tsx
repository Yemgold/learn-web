

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface QuestionAnimationProps {
  children: ReactNode;
  questionKey?: string | number;
}

export default function QuestionAnimation({
  children,
  questionKey = "question",
}: QuestionAnimationProps) {
  return (
    <motion.div
      key={questionKey}
      initial={{
        opacity: 0,
        y: 35,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.98,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full"
    >
      {/* -------------------------------------------------------------- */}
      {/* Ambient entrance glow                                           */}
      {/* -------------------------------------------------------------- */}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl"
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: [0, 0.8, 0.25],
          scale: [0.5, 1.15, 1],
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      />

      {/* -------------------------------------------------------------- */}
      {/* Question content                                                */}
      {/* -------------------------------------------------------------- */}

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
          delay: 0.12,
          duration: 0.4,
          ease: "easeOut",
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* -------------------------------------------------------------- */}
      {/* Decorative particles                                            */}
      {/* -------------------------------------------------------------- */}

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-[10%] top-[15%] h-1.5 w-1.5 rounded-full bg-cyan-300/40"
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [10, -20, -35],
        }}
        transition={{
          duration: 1.2,
          delay: 0.15,
          ease: "easeOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute right-[12%] top-[20%] h-1 w-1 rounded-full bg-purple-300/40"
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [5, -15, -30],
        }}
        transition={{
          duration: 1.1,
          delay: 0.25,
          ease: "easeOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[15%] right-[20%] h-1.5 w-1.5 rounded-full bg-cyan-300/30"
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [0, -20, -40],
        }}
        transition={{
          duration: 1.3,
          delay: 0.35,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}
