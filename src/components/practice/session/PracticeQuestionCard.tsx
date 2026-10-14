




"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  Volume2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import QuestionOptions from "./QuestionOptions";

import {
  formatQuestion,
  type QuestionPart,
} from "@/lib/questions/questionFormatter";

import type { PracticeQuestion } from "@/stores/practiceStore";

/* ============================================================
   PROPS
   ============================================================ */

interface PracticeQuestionCardProps {
  question: PracticeQuestion;
  questionNumber: number;
  selectedAnswer?: string | null;
  onSelectAnswer: (answer: string) => void;
}

/* ============================================================
   RENDER QUESTION PART
   ============================================================ */

function renderQuestionPart(
  part: QuestionPart,
  index: number,
) {
  switch (part.type) {
    case "text":
      return <span key={index}>{part.content}</span>;

    case "clause":
      return (
        <span
          key={index}
          className="rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 font-bold text-blue-300"
          title={
            part.clauseType
              ? part.clauseType.replace(/-/g, " ")
              : "Clause"
          }
        >
          {part.content}
        </span>
      );

    case "blank":
      return (
        <span
          key={index}
          className="mx-1 inline-block min-w-[90px] border-b-2 border-blue-400/60 px-2 text-center font-bold text-white"
        >
          {part.content || "____"}
        </span>
      );

    case "phrase":
      return (
        <span
          key={index}
          className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-bold italic text-amber-300"
        >
          {part.content}
        </span>
      );

    case "passage":
      return (
        <span
          key={index}
          className="my-3 block whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.03] p-4 font-normal leading-7 text-slate-300"
        >
          {part.content}
        </span>
      );

    case "paragraph":
      return (
        <span
          key={index}
          className="my-3 block whitespace-pre-wrap font-normal leading-7 text-slate-300"
        >
          {part.content}
        </span>
      );

    case "sound":
      return (
        <span
          key={index}
          className="my-3 inline-flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/[0.07] px-4 py-3 font-semibold text-purple-300"
        >
          <Volume2 className="h-5 w-5 shrink-0" />
          <span>
            {part.content || "Listen to the sound"}
          </span>
        </span>
      );

    case "underline":
      return (
        <span
          key={index}
          className="font-bold text-white underline decoration-blue-400 decoration-2 underline-offset-4"
        >
          {part.content}
        </span>
      );
  }
}

/* ============================================================
   QUESTION TEXT
   ============================================================ */

function FormattedQuestionText({
  question,
}: {
  question: string;
}) {
  const formattedQuestion = useMemo(
    () => formatQuestion(question),
    [question],
  );

  if (!formattedQuestion.hasFormatting) {
    return (
      <div className="whitespace-pre-wrap break-words text-lg font-semibold leading-8 text-white">
        {formattedQuestion.original}
      </div>
    );
  }

  if (
    formattedQuestion.type === "clause" &&
    formattedQuestion.sentence
  ) {
    return (
      <div>
        <p className="mb-4 text-lg font-semibold leading-8 text-white">
          {formattedQuestion.instruction}
        </p>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-4 text-lg font-semibold leading-8 text-white sm:p-5">
          {formattedQuestion.parts.map((part, index) =>
            renderQuestionPart(part, index),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap break-words text-lg font-semibold leading-8 text-white">
      {formattedQuestion.parts.map((part, index) =>
        renderQuestionPart(part, index),
      )}
    </div>
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

export function PracticeQuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}: PracticeQuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  /* QUESTION DATA */

  const questionData = question as PracticeQuestion & {
    answer?: string;
    correctAnswer?: string;
    correctAnswers?: string[];
    explanation?: string;
  };

  /* CORRECT ANSWER */

  const correctAnswer =
    questionData.answer ??
    questionData.correctAnswer ??
    questionData.correctAnswers?.[0] ??
    null;

  /* EXPLANATION */

  const explanation = questionData.explanation ?? null;

  /* ANSWER CHECKING */

  const normalizedCorrectAnswer =
    correctAnswer?.trim().toUpperCase() ?? null;

  const normalizedSelectedAnswer =
    selectedAnswer?.trim().toUpperCase() ?? null;

  const isCorrect =
    normalizedCorrectAnswer !== null &&
    normalizedSelectedAnswer !== null &&
    normalizedSelectedAnswer === normalizedCorrectAnswer;

  /* UI */

  return (
    <Card className="overflow-hidden border border-white/10 bg-white/[0.03] text-white shadow-none">
      {/* QUESTION HEADER */}
      <div className="border-b border-white/10 bg-white/[0.02] px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-sm font-bold text-blue-300">
              {questionNumber}
            </span>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Question
              </p>

              <p className="text-sm font-semibold capitalize text-slate-300">
                {question.questionType === "mcq"
                  ? "Multiple Choice"
                  : question.questionType}
              </p>
            </div>
          </div>

          {question.difficulty && (
            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium capitalize text-slate-400">
              {question.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* QUESTION CONTENT */}
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        {/* QUESTION */}
        <div className="mb-8">
          <FormattedQuestionText question={question.question} />
        </div>

        {/* MEDIA */}
        {question.media && (
          <div className="mb-6">
            {/*
              Media rendering can be added here when
              the backend media structure is confirmed.
            */}
          </div>
        )}

        {/* OPTIONS */}
        <QuestionOptions
          question={question}
          selectedAnswer={selectedAnswer ?? undefined}
          onSelectAnswer={onSelectAnswer}
        />

        {/* ANSWER / EXPLANATION CONTROLS */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SHOW ANSWER */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAnswer((value) => !value)}
              leftIcon={
                showAnswer ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )
              }
              className="w-full border border-white/10 bg-white/[0.03] text-slate-300 shadow-none transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:w-auto"
            >
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </Button>

            {/* SHOW EXPLANATION */}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowExplanation((value) => !value)
              }
              leftIcon={<Lightbulb className="h-4 w-4" />}
              className="w-full border border-blue-500/20 bg-blue-500/[0.07] text-blue-300 shadow-none transition-colors hover:border-blue-500/40 hover:bg-blue-500/15 hover:text-white sm:w-auto"
            >
              {showExplanation
                ? "Hide Explanation"
                : "Show Explanation"}
            </Button>
          </div>

          {/* ANSWER */}
          {showAnswer && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-300">
                    Correct Answer
                  </p>

                  {correctAnswer ? (
                    <p className="mt-1 break-words text-sm font-medium text-emerald-400">
                      {correctAnswer}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-slate-400">
                      The correct answer is not available for this question.
                    </p>
                  )}

                  {/* STUDENT ANSWER */}
                  {selectedAnswer && (
                    <p
                      className={`mt-3 break-words text-sm font-medium ${
                        isCorrect
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      Your answer: {selectedAnswer}
                      {isCorrect ? " ✓" : " ✗"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EXPLANATION */}
          {showExplanation && (
            <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
                  <Lightbulb className="h-5 w-5 text-blue-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-blue-300">
                    Explanation
                  </p>

                  {explanation ? (
                    <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                      {explanation}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      No explanation is available for this question yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
