




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
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-3">

          {/* ==================================================
              PREVIOUS
              ================================================== */}

          <Button
            variant="outline"
            disabled={isFirstQuestion}
            onClick={onPrevious}
            leftIcon={
              <ArrowLeft className="h-4 w-4" />
            }
          >
            <span className="hidden sm:inline">
              Previous
            </span>

            <span className="sm:hidden">
              Prev
            </span>
          </Button>

          {/* ==================================================
              PROGRESS
              ================================================== */}

          <span className="text-xs font-medium text-slate-500 sm:text-sm">
            {questionNumber} of {totalQuestions}
          </span>

          {/* ==================================================
              NEXT
              ================================================== */}

          <Button
            onClick={onNext}
            disabled={isLastQuestion}
            rightIcon={
              <ArrowRight className="h-4 w-4" />
            }
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