



"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

/* ==========================================================================
   TYPES
   ========================================================================== */

export interface SubjectItem {
  name: string;
}

interface SubjectSelectorProps {
  subjects: SubjectItem[];
  selectedSubject: string | null;
  onSubjectSelect: (subject: string) => void;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function SubjectSelector({
  subjects,
  selectedSubject,
  onSubjectSelect,
}: SubjectSelectorProps) {
  return (
    <section className="border-b border-white/10 p-5 sm:p-8">
      {/* ==================================================================
          HEADER
          ================================================================== */}

      <div className="mb-5 flex items-center gap-3">
        <StepNumber number="01" />

        <div>
          <h2 className="text-lg font-black text-white sm:text-xl">
            Select Subject
          </h2>

          <p className="text-xs text-slate-500 sm:text-sm">
            What subject are you studying?
          </p>
        </div>
      </div>

      {/* ==================================================================
          SUBJECTS
          ================================================================== */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {subjects.map((subject, index) => {
          const isSelected =
            selectedSubject === subject.name;

          return (
            <motion.button
              key={subject.name}
              type="button"
              onClick={() =>
                onSubjectSelect(subject.name)
              }
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.2,
                delay: Math.min(
                  index * 0.04,
                  0.3
                ),
              }}
              whileTap={{
                scale: 0.98,
              }}
              className={[
                "group relative rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5",
                isSelected
                  ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/5"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={[
                    "text-sm font-bold sm:text-base",
                    isSelected
                      ? "text-blue-300"
                      : "text-white",
                  ].join(" ")}
                >
                  {subject.name}
                </span>

                {isSelected && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
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
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-300">
      {number}
    </div>
  );
}