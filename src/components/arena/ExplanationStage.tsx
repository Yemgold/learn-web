

"use client";

import { Brain, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface ExplanationStageProps {
  intro: string;
  audioUrl?: string;
  isPlaying?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export default function ExplanationStage({
  intro,
  audioUrl,
  isPlaying = false,
  onPlayingChange,
}: ExplanationStageProps) {
  const handleAudioToggle = () => {
    /*
     * Audio playback itself will eventually be handled by
     * SpeechController / our dedicated audio system.
     *
     * For now, this simply allows the parent to control the
     * visual playing state.
     */
    onPlayingChange?.(!isPlaying);
  };

  return (
    <section
      aria-label="Question explanation"
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-10 shadow-2xl backdrop-blur-xl sm:px-8 sm:py-12"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Ambient Background                                               */}
      {/* ---------------------------------------------------------------- */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.55, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-500/5 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Content                                                          */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

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
            duration: 0.45,
          }}
          className="flex flex-col items-center text-center"
        >
          {/* Brain icon */}

          <motion.div
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 shadow-xl"
          >
            <Brain
              size={30}
              strokeWidth={1.7}
              className="text-purple-300"
            />
          </motion.div>

          {/* Label */}

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
            Learn From It
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Why is this the answer?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Understanding the solution is more important than simply
            getting the question right.
          </p>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Explanation                                                      */}
        {/* ---------------------------------------------------------------- */}

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
            delay: 0.2,
            duration: 0.5,
          }}
          className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-5 sm:p-7"
        >
          <div className="flex items-start gap-4">
            {/* Number */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-sm font-black text-purple-300">
              💡
            </div>

            {/* Intro */}

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Explanation
              </p>

              <p className="mt-2 text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
                {intro}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Audio narration                                                  */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
            duration: 0.4,
          }}
          className="mt-6 flex justify-center"
        >
          {audioUrl ? (
            <button
              type="button"
              onClick={handleAudioToggle}
              aria-label={
                isPlaying
                  ? "Pause explanation"
                  : "Listen to explanation"
              }
              className={[
                "group flex items-center gap-3 rounded-full border px-5 py-3",
                "text-sm font-semibold transition-all duration-200",

                isPlaying
                  ? "border-purple-400/30 bg-purple-400/10 text-purple-200"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-purple-400/20 hover:bg-purple-400/5 hover:text-white",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  isPlaying
                    ? "bg-purple-400 text-slate-950"
                    : "bg-white/10 text-slate-300",
                ].join(" ")}
              >
                {isPlaying ? (
                  <Pause
                    size={15}
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    size={15}
                    fill="currentColor"
                    className="ml-0.5"
                  />
                )}
              </span>

              <Volume2
                size={16}
                className={
                  isPlaying
                    ? "text-purple-300"
                    : "text-slate-500"
                }
              />

              <span>
                {isPlaying
                  ? "Reading explanation..."
                  : "Listen to explanation"}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-500">
              <VolumeX size={15} />

              <span>
                Explanation audio will be available soon
              </span>
            </div>
          )}
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Step-by-step indicator                                           */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.55,
            duration: 0.4,
          }}
          className="mt-10 flex items-center gap-3"
        >
          <div className="h-px flex-1 bg-white/10" />

          <span className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Step-by-step solution
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </motion.div>
      </div>
    </section>
  );
}
