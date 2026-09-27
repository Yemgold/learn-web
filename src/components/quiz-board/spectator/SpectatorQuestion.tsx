





"use client";

import {
  HelpCircle,
  Lock,
  Radio,
} from "lucide-react";

import QuizQuestion, {
  type QuizQuestionData,
} from "../shared/QuizQuestion";

export interface SpectatorQuestionProps {
  question: QuizQuestionData | null;

  currentQuestionNumber?: number | null;
  totalQuestions?: number | null;

  timeLimit?: number | null;

  startedAt?: string | null;
  expiresAt?: string | null;

  questionLive?: boolean;
  questionLocked?: boolean;

  loading?: boolean;

  compact?: boolean;

  title?: string;
}

export default function SpectatorQuestion({
  question,

  currentQuestionNumber = null,
  totalQuestions = null,

  timeLimit = null,

  startedAt = null,
  expiresAt = null,

  questionLive = false,
  questionLocked = false,

  loading = false,

  compact = false,

  title = "Live Question",
}: SpectatorQuestionProps) {
  if (loading) {
    return (
      <section
        className={[
          "rounded-2xl border border-white/10",
          "bg-slate-950/70 shadow-xl",
          compact ? "p-4" : "p-6",
        ].join(" ")}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded-lg bg-white/[0.05]" />

          <div className="h-24 w-full rounded-xl bg-white/[0.04]" />

          <div className="h-14 w-full rounded-xl bg-white/[0.04]" />

          <div className="h-14 w-full rounded-xl bg-white/[0.04]" />
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <section
        className={[
          "rounded-2xl border border-white/10",
          "bg-slate-950/70 text-center shadow-xl",
          compact ? "p-6" : "p-10",
        ].join(" ")}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <HelpCircle className="h-6 w-6 text-slate-600" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-white">
          Waiting for the next question
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The host has not published the next
          question yet.
        </p>
      </section>
    );
  }

  const normalizedQuestion: QuizQuestionData =
    {
      ...question,

      questionNumber:
        question.questionNumber ??
        currentQuestionNumber,

      totalQuestions:
        question.totalQuestions ??
        totalQuestions,

      timeLimit:
        question.timeLimit ??
        timeLimit,

      startedAt:
        question.startedAt ??
        startedAt,

      expiresAt:
        question.expiresAt ??
        expiresAt,
    };

  return (
    <section className="space-y-3">
      {/* SPECTATOR STATUS */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <Radio
            className={[
              "h-4 w-4",
              questionLive
                ? "animate-pulse text-emerald-300"
                : "text-slate-500",
            ].join(" ")}
          />

          <span className="text-xs font-medium text-slate-300">
            {questionLive
              ? "Question is live"
              : questionLocked
                ? "Question locked"
                : "Live quiz"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-violet-400/20 bg-violet-400/5 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-violet-300">
            Spectator
          </span>

          {questionLocked && (
            <Lock className="h-3.5 w-3.5 text-orange-300" />
          )}
        </div>
      </div>

      {/* QUESTION */}
      <QuizQuestion
        question={normalizedQuestion}
        selectedAnswer={null}
        disabled
        locked
        showOptions
        showQuestionNumber
        showTimeLimit={false}
        optionColumns={2}
        title={title}
        compact={compact}
      />

      {/* OBSERVER NOTICE */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-center">
        <p className="text-[10px] leading-5 text-slate-600">
          You are watching this competition as a
          spectator. Answer selection is disabled.
        </p>
      </div>
    </section>
  );
}