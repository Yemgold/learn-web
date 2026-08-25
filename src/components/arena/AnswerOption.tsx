



"use client";

import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface AnswerOptionProps {
  id: string;
  text: string;
  selected: boolean;
  onSelect: (answerId: string) => void;
  disabled?: boolean;
}

export default function AnswerOption({
  id,
  text,
  selected,
  onSelect,
  disabled = false,
}: AnswerOptionProps) {
  const handleClick = () => {
    if (disabled) {
      return;
    }

    onSelect(id);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Option ${id}: ${text}`}
      whileHover={
        disabled
          ? undefined
          : {
              y: -3,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.98,
            }
      }
      className={[
        "group relative flex w-full items-center gap-4",
        "overflow-hidden rounded-2xl border p-4 text-left",
        "transition-all duration-200 sm:p-5",

        selected
          ? "border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]",

        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer",

        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
      ].join(" ")}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Selected background glow                                         */}
      {/* ---------------------------------------------------------------- */}

      {selected && (
        <motion.div
          layoutId="selected-answer-glow"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-cyan-400/10 to-transparent"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Option Letter                                                    */}
      {/* ---------------------------------------------------------------- */}

      <div
        className={[
          "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          "border text-sm font-black transition-all duration-200",

          selected
            ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300"
            : "border-white/10 bg-white/5 text-slate-400 group-hover:border-white/20 group-hover:text-white",
        ].join(" ")}
      >
        {id.toUpperCase()}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Answer Text                                                      */}
      {/* ---------------------------------------------------------------- */}

      <span
        className={[
          "relative z-10 min-w-0 flex-1 text-base font-semibold leading-relaxed",
          "transition-colors duration-200 sm:text-lg",

          selected
            ? "text-white"
            : "text-slate-300 group-hover:text-white",
        ].join(" ")}
      >
        {text}
      </span>

      {/* ---------------------------------------------------------------- */}
      {/* Selection Indicator                                              */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-10 shrink-0">
        <motion.div
          animate={{
            scale: selected ? 1 : 0.9,
          }}
          transition={{
            duration: 0.2,
          }}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full border",
            selected
              ? "border-cyan-400 bg-cyan-400 text-slate-950"
              : "border-white/15 bg-white/5 text-transparent",
          ].join(" ")}
        >
          {selected ? (
            <Check
              size={15}
              strokeWidth={3}
            />
          ) : (
            <Circle
              size={12}
              strokeWidth={2}
              className="text-slate-600"
            />
          )}
        </motion.div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Hover highlight                                                   */}
      {/* ---------------------------------------------------------------- */}

      {!selected && !disabled && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-full bg-cyan-400"
          initial={{
            opacity: 0,
            scaleY: 0,
          }}
          whileHover={{
            opacity: 1,
            scaleY: 1,
          }}
          transition={{
            duration: 0.2,
          }}
        />
      )}
    </motion.button>
  );
}
