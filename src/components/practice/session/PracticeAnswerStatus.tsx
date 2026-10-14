




"use client";

import { Check, Circle } from "lucide-react";

interface PracticeAnswerStatusProps {
  selectedAnswer?: string | null;
}

export function PracticeAnswerStatus({
  selectedAnswer,
}: PracticeAnswerStatusProps) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm">
      {selectedAnswer ? (
        <>
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <Check className="h-3 w-3 text-emerald-400" />
          </span>

          <span className="font-medium text-emerald-400">
            Answer selected
          </span>
        </>
      ) : (
        <>
          <Circle className="h-4 w-4 text-slate-500" />

          <span className="text-slate-400">
            Select an answer
          </span>
        </>
      )}
    </div>
  );
}
