



"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({
  progress,
}: ProgressBarProps) {
  /*
   * Keep progress safely between 0 and 100.
   *
   * This protects the UI if the value coming from the
   * Arena is ever outside the expected range.
   */
  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeProgress)}
      aria-label="Arena progress"
    >
      {/* -------------------------------------------------------------- */}
      {/* Progress Track                                                 */}
      {/* -------------------------------------------------------------- */}

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        {/* ------------------------------------------------------------ */}
        {/* Animated Progress                                            */}
        {/* ------------------------------------------------------------ */}

        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
          initial={{ width: 0 }}
          animate={{
            width: `${safeProgress}%`,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />

        {/* ------------------------------------------------------------ */}
        {/* Glow                                                          */}
        {/* ------------------------------------------------------------ */}

        <motion.div
          className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-cyan-400/40 blur-sm"
          initial={{ width: 0 }}
          animate={{
            width: `${safeProgress}%`,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Progress Details                                                */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Progress
        </span>

        <motion.span
          key={Math.round(safeProgress)}
          initial={{
            opacity: 0,
            y: -2,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-[11px] font-semibold text-slate-400"
        >
          {Math.round(safeProgress)}%
        </motion.span>
      </div>
    </div>
  );
}