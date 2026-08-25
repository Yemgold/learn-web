



"use client";

import { Check, Circle } from "lucide-react";

interface PracticeAnswerStatusProps {
  selectedAnswer?: string | null;
}

export function PracticeAnswerStatus({
  selectedAnswer,
}: PracticeAnswerStatusProps) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 sm:text-sm">
      {selectedAnswer ? (
        <>
          <Check className="h-4 w-4 text-green-600" />

          <span className="font-medium text-green-700">
            Answer selected
          </span>
        </>
      ) : (
        <>
          <Circle className="h-4 w-4 text-slate-400" />

          <span>
            Select an answer
          </span>
        </>
      )}
    </div>
  );
}