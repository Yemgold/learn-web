



"use client";

import { motion } from "framer-motion";
import { Check, Play, PenLine } from "lucide-react";

/* ==========================================================================
   TYPES
   ========================================================================== */

export type LearningMode =
  | "interactive"
  | "practice";

interface LearningModeSelectorProps {
  learningMode: LearningMode;
  onModeSelect: (mode: LearningMode) => void;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function LearningModeSelector({
  learningMode,
  onModeSelect,
}: LearningModeSelectorProps) {
  return (
    <section className="border-b border-white/10 p-5 sm:p-8">
      {/* ==================================================================
          HEADER
          ================================================================== */}

      <div className="mb-5 flex items-center gap-3">
        <StepNumber number="03" />

        <div>
          <h2 className="text-lg font-black text-white sm:text-xl">
            Choose Learning Mode
          </h2>

          <p className="text-xs text-slate-500 sm:text-sm">
            How do you want to learn?
          </p>
        </div>
      </div>

      {/* ==================================================================
          MODES
          ================================================================== */}

      <div className="grid gap-3 md:grid-cols-2">
        {/* ================================================================
            INTERACTIVE LESSON
            ================================================================ */}

        <LearningModeCard
          selected={
            learningMode === "interactive"
          }
          onClick={() =>
            onModeSelect("interactive")
          }
          icon="🎬"
          title="Interactive Lesson"
          description="Watch → Listen → Think → Answer → Learn"
          accent="blue"
        />

        {/* ================================================================
            PRACTICE QUESTIONS
            ================================================================ */}

        <LearningModeCard
          selected={
            learningMode === "practice"
          }
          onClick={() =>
            onModeSelect("practice")
          }
          icon="📝"
          title="Practice Questions"
          description="Answer questions directly"
          accent="purple"
        />
      </div>
    </section>
  );
}

/* ==========================================================================
   LEARNING MODE CARD
   ========================================================================== */

interface LearningModeCardProps {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  description: string;
  accent: "blue" | "purple";
}

function LearningModeCard({
  selected,
  onClick,
  icon,
  title,
  description,
  accent,
}: LearningModeCardProps) {
  const accentClasses =
    accent === "blue"
      ? {
          selected:
            "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/5",
          icon:
            "border-blue-400/20 bg-blue-500/10",
          title: "text-blue-300",
          check: "bg-blue-500",
        }
      : {
          selected:
            "border-purple-400/50 bg-purple-500/10 shadow-lg shadow-purple-500/5",
          icon:
            "border-purple-400/20 bg-purple-500/10",
          title: "text-purple-300",
          check: "bg-purple-500",
        };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{
        scale: 0.985,
      }}
      className={[
        "relative w-full rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5",
        selected
          ? accentClasses.selected
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {/* --------------------------------------------------------------
            ICON
            -------------------------------------------------------------- */}

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl",
            selected
              ? accentClasses.icon
              : "border-white/10 bg-white/[0.03]",
          ].join(" ")}
        >
          {icon}
        </div>

        {/* --------------------------------------------------------------
            CONTENT
            -------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className={[
                  "text-sm font-black sm:text-base",
                  selected
                    ? accentClasses.title
                    : "text-white",
                ].join(" ")}
              >
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                {description}
              </p>
            </div>

            {/* ----------------------------------------------------------
                CHECK
                ---------------------------------------------------------- */}

            {selected && (
              <span
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white",
                  accentClasses.check,
                ].join(" ")}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          {/* --------------------------------------------------------------
              MODE DETAIL
              -------------------------------------------------------------- */}

          <div className="mt-4 flex items-center gap-2">
            {title === "Interactive Lesson" ? (
              <>
                <Play className="h-3.5 w-3.5 text-slate-500" />

                <span className="text-[11px] font-semibold text-slate-500">
                  Guided learning experience
                </span>
              </>
            ) : (
              <>
                <PenLine className="h-3.5 w-3.5 text-slate-500" />

                <span className="text-[11px] font-semibold text-slate-500">
                  Direct question practice
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ==========================================================================
   STEP NUMBER
   ========================================================================== */

function StepNumber({
  number,
}: {
  number: string;
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-xs font-black text-emerald-300">
      {number}
    </div>
  );
}