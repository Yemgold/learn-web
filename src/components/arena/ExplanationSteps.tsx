


"use client";

import { CheckCircle2, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface ExplanationStepsProps {
  steps: string[];
}

export default function ExplanationSteps({
  steps,
}: ExplanationStepsProps) {
  if (!steps.length) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
        <p className="text-sm text-slate-500">
          No step-by-step explanation is available for this
          question.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Step-by-step explanation"
      className="relative"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Timeline                                                         */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative">
        {/* Vertical line */}

        <div className="absolute bottom-8 left-[19px] top-8 w-px bg-gradient-to-b from-purple-400/40 via-white/10 to-emerald-400/40 sm:left-[23px]" />

        {/* ---------------------------------------------------------------- */}
        {/* Steps                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-4 sm:space-y-5">
          {steps.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={`${index}-${step}`}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="relative flex gap-4 sm:gap-5"
              >
                {/* ------------------------------------------------------ */}
                {/* Step indicator                                          */}
                {/* ------------------------------------------------------ */}

                <div className="relative z-10 flex shrink-0">
                  <motion.div
                    initial={{
                      scale: 0.7,
                    }}
                    whileInView={{
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.08 + 0.1,
                      type: "spring",
                      stiffness: 250,
                      damping: 15,
                    }}
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-xl border",
                      "text-xs font-black shadow-lg sm:h-12 sm:w-12",

                      isLast
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : isFirst
                          ? "border-purple-400/30 bg-purple-400/10 text-purple-300"
                          : "border-white/10 bg-white/5 text-slate-400",
                    ].join(" ")}
                  >
                    {isLast ? (
                      <CheckCircle2
                        size={20}
                        strokeWidth={2}
                      />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                </div>

                {/* ------------------------------------------------------ */}
                {/* Step content                                            */}
                {/* ------------------------------------------------------ */}

                <div
                  className={[
                    "min-w-0 flex-1 rounded-2xl border p-4 sm:p-5",

                    isLast
                      ? "border-emerald-400/20 bg-emerald-400/5"
                      : "border-white/10 bg-white/[0.03]",
                  ].join(" ")}
                >
                  {/* Step label */}

                  <div className="flex items-center gap-2">
                    {isLast ? (
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
                        Final Answer
                      </span>
                    ) : (
                      <span
                        className={[
                          "text-xs font-bold uppercase tracking-[0.16em]",
                          isFirst
                            ? "text-purple-300"
                            : "text-slate-500",
                        ].join(" ")}
                      >
                        Step {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Step text */}

                  <p
                    className={[
                      "mt-2 text-sm leading-relaxed sm:text-base",
                      isLast
                        ? "font-bold text-emerald-100"
                        : "font-medium text-slate-300",
                    ].join(" ")}
                  >
                    {step}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Learning Tip                                                     */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          delay: steps.length * 0.08 + 0.2,
          duration: 0.4,
        }}
        className="mt-8 flex items-start gap-3 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-4 sm:p-5"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10">
          <Lightbulb
            size={18}
            className="text-yellow-300"
          />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">
            Learning Tip
          </p>

          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            Don't just memorize the answer. Understand the
            method used to arrive at it.
          </p>
        </div>
      </motion.div>
    </section>
  );
}