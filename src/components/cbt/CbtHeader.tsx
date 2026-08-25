"use client";

import {
  ArrowLeft,
  BookOpen,
  Send,
} from "lucide-react";

import CbtTimer from "./CbtTimer";

export interface CbtHeaderProps {
  subjectName: string;
  questionNumber: number;
  totalQuestions: number;
  durationInMinutes: number;
  timeRemainingSeconds: number;
  onTimeUp: () => void;
  onSubmit?: () => void;
  onExit?: () => void;
}

export default function CbtHeader({
  subjectName,
  questionNumber,
  totalQuestions,
  durationInMinutes,
  timeRemainingSeconds,
  onTimeUp,
  onSubmit,
  onExit,
}: CbtHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
              aria-label="Exit examination"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate font-bold text-slate-900">
              {subjectName}
            </h1>

            <p className="text-sm text-slate-500">
              Question {questionNumber} of{" "}
              {totalQuestions}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <CbtTimer
            durationInMinutes={
              durationInMinutes
            }
            timeRemainingSeconds={
              timeRemainingSeconds
            }
            onTimeUp={onTimeUp}
          />

          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 md:flex"
            >
              <Send className="h-4 w-4" />
              Submit
            </button>
          )}
        </div>
      </div>
    </header>
  );
}