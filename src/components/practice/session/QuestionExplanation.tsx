




"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface QuestionExplanationProps {
  explanation?: string | null;
}

export default function QuestionExplanation({
  explanation,
}: QuestionExplanationProps) {
  const [showExplanation, setShowExplanation] =
    useState(false);

  /*
   * No explanation available
   */
  if (!explanation?.trim()) {
    return null;
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-blue-500/20 bg-blue-500/[0.04] text-white shadow-none">
      {/* EXPLANATION HEADER */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-white">
              Explanation
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {showExplanation
                ? "Explanation is visible"
                : "Reveal the explanation for this question"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setShowExplanation((visible) => !visible)
          }
          rightIcon={
            showExplanation ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          }
          className="w-full shrink-0 border border-blue-500/25 bg-blue-500/10 text-blue-300 shadow-none transition-colors hover:border-blue-400/40 hover:bg-blue-500/20 hover:text-white sm:w-auto"
        >
          {showExplanation
            ? "Hide Explanation"
            : "Show Explanation"}
        </Button>
      </div>

      {/* EXPLANATION CONTENT */}
      {showExplanation && (
        <div className="border-t border-white/10 bg-slate-950/60 px-4 py-5 sm:px-6">
          <div className="max-w-none">
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 sm:text-base">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
