






"use client";

import { motion } from "framer-motion";

interface CountdownProps {
  timeLeft: number;
  totalTime: number;
}

export default function Countdown({
  timeLeft,
  totalTime,
}: CountdownProps) {
  /* -------------------------------------------------------------------- */
  /* Safety                                                               */
  /* -------------------------------------------------------------------- */

  const safeTotalTime = Math.max(1, totalTime);

  const safeTimeLeft = Math.max(
    0,
    Math.min(timeLeft, safeTotalTime)
  );

  /* -------------------------------------------------------------------- */
  /* Progress                                                             */
  /* -------------------------------------------------------------------- */

  const progress =
    safeTimeLeft / safeTotalTime;

  /*
   * SVG circle configuration.
   *
   * circumference = 2πr
   * radius = 46
   */
  const radius = 46;

  const circumference =
    2 * Math.PI * radius;

  const strokeDashoffset =
    circumference * (1 - progress);

  /* -------------------------------------------------------------------- */
  /* Urgency states                                                       */
  /* -------------------------------------------------------------------- */

  const isDanger = safeTimeLeft <= 3;

  const isWarning =
    safeTimeLeft <= Math.ceil(safeTotalTime * 0.3);

  const stateClass = isDanger
    ? "text-red-400"
    : isWarning
      ? "text-yellow-400"
      : "text-cyan-400";

  const ringClass = isDanger
    ? "stroke-red-400"
    : isWarning
      ? "stroke-yellow-400"
      : "stroke-cyan-400";

  /* -------------------------------------------------------------------- */
  /* Component                                                            */
  /* -------------------------------------------------------------------- */

  return (
    <div className="flex flex-col items-center justify-center">
      {/* ---------------------------------------------------------------- */}
      {/* Timer                                                             */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        key={safeTimeLeft}
        initial={{
          scale: 1.05,
        }}
        animate={{
          scale: isDanger ? [1, 1.08, 1] : 1,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="relative h-32 w-32 sm:h-36 sm:w-36"
      >
        {/* -------------------------------------------------------------- */}
        {/* SVG Ring                                                        */}
        {/* -------------------------------------------------------------- */}

        <svg
          viewBox="0 0 120 120"
          className="-rotate-90 h-full w-full"
          aria-hidden="true"
        >
          {/* Background ring */}

          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-white/10"
          />

          {/* Progress ring */}
<motion.circle
  cx="60"
  cy="60"
  r={radius}
  fill="none"
  strokeWidth="7"
  strokeLinecap="round"
  className={ringClass}
  strokeDasharray={circumference}
  initial={{
    strokeDashoffset: circumference,
  }}
  animate={{
    strokeDashoffset,
  }}
  transition={{
    duration: 0.4,
    ease: "linear",
  }}
/>
        </svg>

        {/* -------------------------------------------------------------- */}
        {/* Number                                                          */}
        {/* -------------------------------------------------------------- */}

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={safeTimeLeft}
            initial={{
              opacity: 0,
              scale: 1.2,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.2,
            }}
            className={`text-4xl font-black tabular-nums ${stateClass}`}
          >
            {safeTimeLeft}
          </motion.span>

          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
            seconds
          </span>
        </div>
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* Status                                                            */}
      {/* ---------------------------------------------------------------- */}

      <motion.p
        key={isDanger ? "danger" : isWarning ? "warning" : "normal"}
        initial={{
          opacity: 0,
          y: 4,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={`mt-4 text-xs font-semibold uppercase tracking-[0.18em] ${
          isDanger
            ? "text-red-400"
            : isWarning
              ? "text-yellow-400"
              : "text-slate-500"
        }`}
      >
        {isDanger
          ? "Hurry!"
          : isWarning
            ? "Time running"
            : "Time remaining"}
      </motion.p>
    </div>
  );
}