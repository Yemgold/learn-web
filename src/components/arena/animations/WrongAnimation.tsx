



"use client";

import { Lightbulb, RotateCcw, X } from "lucide-react";
import { motion } from "framer-motion";

interface WrongAnimationProps {
  show?: boolean;
  message?: string;
}

export default function WrongAnimation({
  show = true,
  message = "Not correct",
}: WrongAnimationProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      aria-live="polite"
      aria-label="Incorrect answer"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Subtle screen feedback                                           */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.18, 0],
        }}
        transition={{
          duration: 0.75,
          ease: "easeOut",
        }}
        className="absolute inset-0 bg-red-400/[0.025]"
      />

      {/* ---------------------------------------------------------------- */}
      {/* Main feedback card                                               */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
          y: 15,
        }}
        animate={{
          opacity: 1,
          scale: [0.85, 1.04, 1],
          y: 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative"
      >
        {/* -------------------------------------------------------------- */}
        {/* Outer pulse                                                     */}
        {/* -------------------------------------------------------------- */}

        <motion.div
          className="absolute inset-[-14px] rounded-[2rem] border border-red-400/10"
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.9, 1.04, 1.1],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        />

        {/* -------------------------------------------------------------- */}
        {/* Card                                                            */}
        {/* -------------------------------------------------------------- */}

        <div className="relative w-[min(88vw,360px)] rounded-[2rem] border border-white/10 bg-slate-950/95 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-8">
          {/* ------------------------------------------------------------ */}
          {/* X icon                                                        */}
          {/* ------------------------------------------------------------ */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.5,
              rotate: -15,
            }}
            animate={{
              opacity: 1,
              scale: [0.5, 1.12, 1],
              rotate: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-400/10 text-red-300">
              <X
                size={28}
                strokeWidth={2.5}
              />
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* Message                                                       */}
          {/* ------------------------------------------------------------ */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.3,
            }}
            className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl"
          >
            {message}
          </motion.h2>

          {/* ------------------------------------------------------------ */}
          {/* Learning message                                              */}
          {/* ------------------------------------------------------------ */}

          <motion.p
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.3,
            }}
            className="mt-2 text-sm leading-relaxed text-slate-400"
          >
            That's okay. Let's understand the solution.
          </motion.p>

          {/* ------------------------------------------------------------ */}
          {/* Learning indicator                                            */}
          {/* ------------------------------------------------------------ */}

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
              delay: 0.4,
              duration: 0.3,
            }}
            className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-purple-400/10 bg-purple-400/5 px-4 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-400/10">
              <Lightbulb
                size={16}
                className="text-purple-300"
              />
            </div>

            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-purple-300">
                Learn
              </p>

              <p className="text-xs text-slate-500">
                The explanation is coming next.
              </p>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* Small transition indicator                                    */}
          {/* ------------------------------------------------------------ */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
            className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600"
          >
            <RotateCcw size={13} />

            <span>
              Review the solution
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
