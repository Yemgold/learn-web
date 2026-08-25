




"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

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
    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/60">
      {/* ======================================================
          EXPLANATION BUTTON
          ====================================================== */}

      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Explanation
            </p>

            <p className="text-xs text-slate-500">
              {showExplanation
                ? "Explanation is visible"
                : "Click to see the explanation"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setShowExplanation(
              (visible) => !visible
            )
          }
          rightIcon={
            showExplanation ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          }
        >
          {showExplanation
            ? "Hide Explanation"
            : "Show Explanation"}
        </Button>
      </div>

      {/* ======================================================
          EXPLANATION CONTENT
          ====================================================== */}

      {showExplanation && (
        <div className="border-t border-blue-200 bg-white px-5 py-5 sm:px-6">
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-base">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}