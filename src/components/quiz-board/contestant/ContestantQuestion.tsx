




"use client";

import { HelpCircle } from "lucide-react";

import ContestantAnswerOptions, {
  type ContestantAnswerOption,
} from "./ContestantAnswerOptions";

export interface ContestantQuestionData {
  id: string;
  question: string;

  options: ContestantAnswerOption[];

  questionNumber?: number | null;
  totalQuestions?: number | null;

  timeLimit?: number | null;
}

export interface ContestantQuestionProps {
  question: ContestantQuestionData | null;

  selectedAnswer?: string | null;
  submittedAnswer?: string | null;

  answerSubmitted?: boolean;
  questionLocked?: boolean;

  disabled?: boolean;

  onSelectAnswer: (value: string) => void;

  showQuestionNumber?: boolean;

  compact?: boolean;
}

export default function ContestantQuestion({
  question,
  selectedAnswer = null,
  submittedAnswer = null,
  answerSubmitted = false,
  questionLocked = false,
  disabled = false,
  onSelectAnswer,
  showQuestionNumber = true,
  compact = false,
}: ContestantQuestionProps) {
  /*
   * ============================================================
   * DEBUG: COMPONENT RENDER
   * ============================================================
   */
  console.log("[ContestantQuestion] RENDER", {
    hasQuestion: Boolean(question),

    questionId: question?.id ?? null,

    questionText: question?.question ?? null,

    questionNumber:
      question?.questionNumber ?? null,

    totalQuestions:
      question?.totalQuestions ?? null,

    optionCount:
      question?.options?.length ?? 0,

    options:
      question?.options ?? [],

    selectedAnswer,

    submittedAnswer,

    answerSubmitted,

    questionLocked,

    disabled,

    showQuestionNumber,

    compact,
  });

  /*
   * ============================================================
   * DEBUG: RECEIVED QUESTION
   * ============================================================
   */
  console.log(
    "[ContestantQuestion] RECEIVED QUESTION",
    {
      hasQuestion: Boolean(question),

      id:
        question?.id ?? null,

      text:
        question?.question ?? null,

      questionNumber:
        question?.questionNumber ?? null,

      totalQuestions:
        question?.totalQuestions ?? null,

      timeLimit:
        question?.timeLimit ?? null,

      options:
        question?.options ?? [],

      optionCount:
        question?.options?.length ?? 0,
    },
  );

  /*
   * ============================================================
   * DEBUG: OPTION VALIDATION
   * ============================================================
   */
  if (question) {
    console.log(
      "[ContestantQuestion] OPTION VALIDATION",
      {
        questionId:
          question.id,

        optionCount:
          question.options?.length ?? 0,

        optionsAreArray:
          Array.isArray(question.options),

        options:
          question.options?.map(
            (option, index) => ({
              index,

              label:
                option?.label ?? null,

              value:
                option?.value ?? null,

              hasValue:
                Boolean(option?.value),

              valueType:
                typeof option?.value,
            }),
          ) ?? [],
      },
    );
  }

  /*
   * ============================================================
   * WAITING STATE
   * ============================================================
   */
  if (!question) {
    console.log(
      "[ContestantQuestion] ❌ NO QUESTION - RENDERING WAITING STATE",
      {
        selectedAnswer,
        answerSubmitted,
        questionLocked,
        disabled,
      },
    );

    return (
      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
          <HelpCircle className="h-6 w-6 text-slate-500" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-white">
          Waiting for the next question
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          The host has not started a question yet.
          Stay on this screen and the next live
          question will appear automatically.
        </p>
      </section>
    );
  }

  /*
   * ============================================================
   * DEBUG: QUESTION WILL BE DISPLAYED
   * ============================================================
   */
  console.log(
    "[ContestantQuestion] ✅ QUESTION WILL BE DISPLAYED",
    {
      questionId:
        question.id,

      questionText:
        question.question,

      questionNumber:
        question.questionNumber ?? null,

      totalQuestions:
        question.totalQuestions ?? null,

      optionCount:
        question.options?.length ?? 0,

      timeLimit:
        question.timeLimit ?? null,

      disabled,

      answerSubmitted,

      questionLocked,

      selectedAnswer,
    },
  );

  /*
   * ============================================================
   * DEBUG: PASSING OPTIONS TO ANSWER COMPONENT
   * ============================================================
   *
   * IMPORTANT:
   *
   * There is NO submit button anymore.
   *
   * Selecting an option calls:
   *
   *   onSelectAnswer(value)
   *
   * The parent/socket layer is responsible for emitting:
   *
   *   participant_selected_answer
   *
   * ============================================================
   */
  console.log(
    "[ContestantQuestion] PASSING OPTIONS TO ContestantAnswerOptions",
    {
      questionId:
        question.id,

      optionCount:
        question.options?.length ?? 0,

      options:
        question.options ?? [],

      disabled,

      questionLocked,

      answerSubmitted,

      selectedAnswer,
    },
  );

  return (
    <section className="space-y-4">
      {/* ======================================================
          QUESTION
          ====================================================== */}
      <div
        className={[
          "rounded-2xl border border-white/10",
          "bg-slate-950/80 shadow-xl shadow-black/10",
          compact
            ? "p-4"
            : "p-5 sm:p-7",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {showQuestionNumber && (
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-semibold text-cyan-300">
              Question{" "}
              {question.questionNumber ?? "—"}

              {question.totalQuestions !== null &&
                question.totalQuestions !== undefined &&
                ` / ${question.totalQuestions}`}
            </div>
          )}

          {question.timeLimit !== null &&
            question.timeLimit !== undefined && (
              <div className="text-xs font-medium text-slate-500">
                {question.timeLimit}s
              </div>
            )}
        </div>

        <div className="mt-5">
          <h1
            className={[
              "font-semibold leading-relaxed tracking-tight text-white",
              compact
                ? "text-lg"
                : "text-xl sm:text-2xl lg:text-3xl",
            ].join(" ")}
          >
            {question.question}
          </h1>
        </div>
      </div>

      {/* ======================================================
          ANSWER OPTIONS
          ====================================================== */}
      <ContestantAnswerOptions
        options={question.options}
        selectedAnswer={selectedAnswer}
        submittedAnswer={submittedAnswer}
        answerSubmitted={answerSubmitted}
        questionLocked={questionLocked}
        disabled={disabled}
        onSelect={onSelectAnswer}
        compact={compact}
      />
    </section>
  );
}