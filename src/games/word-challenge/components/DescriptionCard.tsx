





"use client";

import { BookOpen, Sparkles } from "lucide-react";

interface DescriptionCardProps {
  description: string;
  category?: string;
  questionNumber?: number;
  totalQuestions?: number;
  disabled?: boolean;
}

export default function DescriptionCard({
  description,
  category,
  questionNumber,
  totalQuestions,
  disabled = false,
}: DescriptionCardProps) {
  const hasProgress =
    typeof questionNumber === "number" &&
    typeof totalQuestions === "number" &&
    totalQuestions > 0;

  return (
    <section
      aria-label="Word description"
      className={[
        "relative w-full overflow-hidden rounded-3xl",
        "border border-white/10 bg-white/[0.045]",
        "shadow-xl shadow-black/10 backdrop-blur-md",
        disabled ? "opacity-70" : "",
      ].join(" ")}
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-violet-300">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                Guess the word
              </p>

              {category && (
                <p className="mt-1 text-sm font-medium text-white/65">
                  {category}
                </p>
              )}
            </div>
          </div>

          {hasProgress && (
            <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
              <span className="text-xs font-semibold text-white/50">
                {questionNumber} / {totalQuestions}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="relative rounded-2xl border border-white/[0.07] bg-black/10 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-300" />

            <span className="text-xs font-bold uppercase tracking-wider text-violet-300/80">
              Description
            </span>
          </div>

          <p className="text-base font-medium leading-7 text-white/90 sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>

        {/* Instruction */}
        <div className="mt-4 flex items-center justify-center">
          <p className="text-center text-xs leading-5 text-white/35 sm:text-sm">
            Read carefully, think quickly, then build the answer below.
          </p>
        </div>
      </div>
    </section>
  );
}