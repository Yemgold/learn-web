


"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AnswerOption {
  id: string;
  text: string;
}

interface AnswerRevealProps {
  options: AnswerOption[];
  selectedAnswer: string | null;
  correctAnswer: string;
}

export default function AnswerReveal({
  options,
  selectedAnswer,
  correctAnswer,
}: AnswerRevealProps) {
  /* -------------------------------------------------------------------- */
  /* Determine result                                                     */
  /* -------------------------------------------------------------------- */

  const hasAnswered = selectedAnswer !== null;

  const isCorrect =
    selectedAnswer === correctAnswer;

  const selectedOption = options.find(
    (option) => option.id === selectedAnswer
  );

  const correctOption = options.find(
    (option) => option.id === correctAnswer
  );

  /*
   * If there is no selected answer, the timer expired.
   */
  const isTimeExpired = !hasAnswered;

  /* -------------------------------------------------------------------- */
  /* Result configuration                                                 */
  /* -------------------------------------------------------------------- */

  const result = isTimeExpired
    ? {
        title: "TIME'S UP!",
        subtitle: "You didn't select an answer in time.",
        icon: Clock3,
        iconClass:
          "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
        accentClass: "text-yellow-300",
      }
    : isCorrect
      ? {
          title: "CORRECT!",
          subtitle: "Excellent work! You got it right.",
          icon: CheckCircle2,
          iconClass:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
          accentClass: "text-emerald-300",
        }
      : {
          title: "NOT CORRECT",
          subtitle: "Let's look at the correct answer.",
          icon: XCircle,
          iconClass:
            "border-red-400/20 bg-red-400/10 text-red-300",
          accentClass: "text-red-300",
        };

  const ResultIcon = result.icon;

  /* -------------------------------------------------------------------- */
  /* Component                                                            */
  /* -------------------------------------------------------------------- */

  return (
    <section
      aria-label="Answer result"
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-10 shadow-2xl backdrop-blur-xl sm:px-8 sm:py-12"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Ambient background                                               */}
      {/* ---------------------------------------------------------------- */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
            isCorrect
              ? "bg-emerald-500/10"
              : isTimeExpired
                ? "bg-yellow-500/10"
                : "bg-red-500/10"
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* ---------------------------------------------------------------- */}
        {/* Result Icon                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex justify-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.5,
              rotate: -15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 15,
            }}
            className={`flex h-20 w-20 items-center justify-center rounded-full border shadow-2xl sm:h-24 sm:w-24 ${result.iconClass}`}
          >
            <ResultIcon
              size={44}
              strokeWidth={1.8}
            />
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Result title                                                      */}
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
            delay: 0.15,
            duration: 0.4,
          }}
          className="mt-6 text-center"
        >
          <h2
            className={`text-3xl font-black tracking-[0.12em] sm:text-4xl ${result.accentClass}`}
          >
            {result.title}
          </h2>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            {result.subtitle}
          </p>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Selected answer                                                   */}
        {/* ---------------------------------------------------------------- */}

        {hasAnswered && selectedOption && (
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
              delay: 0.3,
              duration: 0.4,
            }}
            className="mt-8"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Your Answer
            </p>

            <div
              className={[
                "flex items-center gap-4 rounded-2xl border p-4 sm:p-5",
                isCorrect
                  ? "border-emerald-400/20 bg-emerald-400/5"
                  : "border-red-400/20 bg-red-400/5",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black",
                  isCorrect
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300",
                ].join(" ")}
              >
                {selectedOption.id.toUpperCase()}
              </div>

              <p className="text-base font-semibold text-white sm:text-lg">
                {selectedOption.text}
              </p>

              <div className="ml-auto shrink-0">
                {isCorrect ? (
                  <CheckCircle2
                    size={22}
                    className="text-emerald-400"
                  />
                ) : (
                  <XCircle
                    size={22}
                    className="text-red-400"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Correct answer                                                    */}
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
            delay: hasAnswered ? 0.45 : 0.3,
            duration: 0.4,
          }}
          className="mt-6"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Correct Answer
          </p>

          <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-black text-emerald-300">
              {correctOption?.id.toUpperCase() ?? correctAnswer}
            </div>

            <p className="text-base font-semibold text-white sm:text-lg">
              {correctOption?.text ?? "Correct answer"}
            </p>

            <CheckCircle2
              size={22}
              className="ml-auto shrink-0 text-emerald-400"
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Explanation prompt                                                */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.65,
            duration: 0.4,
          }}
          className="mt-8 flex items-center justify-center gap-2 text-center"
        >
          <span className="text-sm">
            🧠
          </span>

          <p className="text-sm font-medium text-slate-400">
            Let's understand why this is the answer.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
