






"use client";

import { HelpCircle } from "lucide-react";

import QuizOptions, {
  type QuizOption,
} from "./QuizOptions";

export interface QuizQuestionData {
  id: string;

  question: string;

  options: QuizOption[];

  questionNumber?: number | null;
  totalQuestions?: number | null;

  timeLimit?: number | null;

  startedAt?: string | null;
  expiresAt?: string | null;
}

export interface QuizQuestionProps {
  question: QuizQuestionData | null;

  selectedAnswer?: string | null;

  disabled?: boolean;
  locked?: boolean;

  onSelectAnswer?: (value: string) => void;

  showOptions?: boolean;
  showQuestionNumber?: boolean;
  showTimeLimit?: boolean;

  optionColumns?: 1 | 2;

  title?: string;

  compact?: boolean;
}

export default function QuizQuestion({
  question,

  selectedAnswer = null,

  disabled = false,
  locked = false,

  onSelectAnswer,

  showOptions = true,
  showQuestionNumber = true,
  showTimeLimit = false,

  optionColumns = 1,

  title,

  compact = false,
}: QuizQuestionProps) {
  if (!question) {
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
          <HelpCircle className="h-6 w-6 text-slate-500" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-white">
          Waiting for question
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The current question has not been
          published yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div
        className={[
          "rounded-2xl border border-white/10",
          "bg-slate-950/70 shadow-xl shadow-black/10",
          compact ? "p-4" : "p-5 sm:p-7",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {showQuestionNumber && (
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-semibold text-cyan-300">
              {title ?? "Question"}{" "}
              {question.questionNumber ??
                "—"}
              {question.totalQuestions !==
                null &&
                question.totalQuestions !==
                  undefined &&
                ` / ${question.totalQuestions}`}
            </div>
          )}

          {showTimeLimit &&
            question.timeLimit !==
              null &&
            question.timeLimit !==
              undefined && (
              <span className="text-xs text-slate-500">
                {question.timeLimit}s
              </span>
            )}
        </div>

        <h1
          className={[
            "mt-5 font-semibold leading-relaxed tracking-tight text-white",
            compact
              ? "text-lg"
              : "text-xl sm:text-2xl lg:text-3xl",
          ].join(" ")}
        >
          {question.question}
        </h1>
      </div>

      {showOptions && (
        <QuizOptions
          options={question.options}
          selectedValue={selectedAnswer}
          disabled={disabled}
          locked={locked}
          onSelect={onSelectAnswer}
          columns={optionColumns}
          compact={compact}
        />
      )}
    </section>
  );
}