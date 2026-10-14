





"use client";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface PracticeNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  questionNumber: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PracticeNavigation({
  isFirstQuestion,
  isLastQuestion,
  questionNumber,
  totalQuestions,
  onPrevious,
  onNext,
}: PracticeNavigationProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-none">
      <div className="border-t border-white/5 bg-slate-950/60 px-4 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* PREVIOUS */}
          <Button
            type="button"
            variant="outline"
            disabled={isFirstQuestion}
            onClick={onPrevious}
            leftIcon={
              <ArrowLeft className="h-4 w-4" />
            }
            className="border border-white/10 bg-white/[0.03] text-slate-300 shadow-none transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:border-white/5 disabled:bg-white/[0.02] disabled:text-slate-600 disabled:opacity-60"
          >
            <span className="hidden sm:inline">
              Previous
            </span>

            <span className="sm:hidden">
              Prev
            </span>
          </Button>

          {/* PROGRESS */}
          <span className="shrink-0 text-xs font-medium tabular-nums text-slate-400 sm:text-sm">
            <span className="text-white">
              {questionNumber}
            </span>{" "}
            of {totalQuestions}
          </span>

          {/* NEXT */}
          <Button
            type="button"
            disabled={isLastQuestion}
            onClick={onNext}
            rightIcon={
              <ArrowRight className="h-4 w-4" />
            }
            className="border border-blue-500/20 bg-blue-600 text-white shadow-none transition-colors hover:bg-blue-500 disabled:border-white/5 disabled:bg-white/[0.04] disabled:text-slate-500 disabled:opacity-60"
          >
            {isLastQuestion
              ? "Last Question"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
