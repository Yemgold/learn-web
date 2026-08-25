




"use client";

import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface CorrectAnimationProps {
  show?: boolean;
  message?: string;
}

export default function CorrectAnimation({
  show = true,
  message = "Correct!",
}: CorrectAnimationProps) {
  if (!show) {
    return null;
  }

  /*
   * Small celebration particles.
   *
   * These are deliberately limited so the animation feels
   * rewarding without distracting the student from learning.
   */
  const particles = Array.from(
    { length: 12 },
    (_, index) => index
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      aria-live="polite"
      aria-label="Correct answer"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Soft screen glow                                                 */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.35, 0],
        }}
        transition={{
          duration: 1.1,
          ease: "easeOut",
        }}
        className="absolute inset-0 bg-emerald-400/[0.04]"
      />

      {/* ---------------------------------------------------------------- */}
      {/* Celebration particles                                             */}
      {/* ---------------------------------------------------------------- */}

      {particles.map((particle) => {
        const angle =
          (particle / particles.length) *
          Math.PI *
          2;

        const distance =
          110 + (particle % 3) * 35;

        const x =
          Math.cos(angle) * distance;

        const y =
          Math.sin(angle) * distance;

        return (
          <motion.span
            key={particle}
            aria-hidden="true"
            className="absolute h-2 w-2 rounded-full bg-emerald-300/80"
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x,
              y,
            }}
            transition={{
              duration: 0.8,
              delay: 0.05 + particle * 0.025,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* ---------------------------------------------------------------- */}
      {/* Main celebration badge                                           */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.4,
        }}
        animate={{
          opacity: 1,
          scale: [0.4, 1.12, 1],
        }}
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative"
      >
        {/* Outer pulse */}

        <motion.div
          className="absolute inset-[-18px] rounded-full border border-emerald-400/20"
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.7, 1.25, 1.5],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />

        {/* Glow */}

        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
          }}
        />

        {/* Circle */}

        <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-emerald-400/30 bg-slate-950/95 shadow-2xl shadow-emerald-500/20 sm:h-28 sm:w-28">
          <motion.div
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.35,
              delay: 0.15,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
              <Check
                size={30}
                strokeWidth={3}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.25,
            }}
            className="mt-2 flex items-center gap-1"
          >
            <Sparkles
              size={11}
              className="text-emerald-300"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
              {message}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
