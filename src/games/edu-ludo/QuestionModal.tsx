




"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  Loader2,
  XCircle,
  Zap,
} from "lucide-react";

export type EduLudoQuestionSubject =
  | "Mathematics"
  | "English"
  | "Science"
  | "Biology"
  | "Chemistry"
  | "Physics";

export interface EduLudoQuestion {
  id: string;
  subject: EduLudoQuestionSubject;
  level?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export type QuestionAnswerResult = {
  questionId: string;
  selectedAnswer: number | null;
  correct: boolean;
  timedOut: boolean;
  responseTimeMs: number;
};

export interface QuestionModalProps {
  question: EduLudoQuestion;
  questionNumber?: number;
  totalQuestions?: number;
  timeLimit?: number;
  questionCost?: number;
  onAnswer: (result: QuestionAnswerResult) => void;
  onClose?: () => void;
  submitting?: boolean;
  showExplanation?: boolean;
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  return `00:${String(safeSeconds).padStart(2, "0")}`;
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function QuestionModal({
  question,
  questionNumber = 1,
  totalQuestions = 20,
  timeLimit = 15,
  questionCost = 2,
  onAnswer,
  onClose,
  submitting = false,
  showExplanation = true,
}: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [submitted, setSubmitted] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [responseTimeMs, setResponseTimeMs] = useState(0);

  const isCorrect =
    submitted &&
    selectedAnswer !== null &&
    selectedAnswer === question.correctAnswer;

  useEffect(() => {
    setSelectedAnswer(null);
    setTimeLeft(timeLimit);
    setSubmitted(false);
    setResponseTimeMs(0);
  }, [question.id, timeLimit]);

  useEffect(() => {
    if (submitted || submitting) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [question.id, submitted, submitting]);

  useEffect(() => {
    if (timeLeft !== 0 || submitted || submitting) return;

    setSubmitted(true);

    const elapsed = Math.max(0, Date.now() - startedAt);
    setResponseTimeMs(elapsed);

    onAnswer({
      questionId: question.id,
      selectedAnswer: null,
      correct: false,
      timedOut: true,
      responseTimeMs: elapsed,
    });
  }, [
    timeLeft,
    submitted,
    submitting,
    question.id,
    startedAt,
    onAnswer,
  ]);

  function handleSubmit() {
    if (submitted || submitting || selectedAnswer === null) return;

    const elapsed = Math.max(0, Date.now() - startedAt);
    const correct = selectedAnswer === question.correctAnswer;

    setResponseTimeMs(elapsed);
    setSubmitted(true);

    onAnswer({
      questionId: question.id,
      selectedAnswer,
      correct,
      timedOut: false,
      responseTimeMs: elapsed,
    });
  }

  const progress = Math.max(
    0,
    Math.min(100, (timeLeft / Math.max(1, timeLimit)) * 100),
  );

  const optionsAreValid =
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every(
      (option) => typeof option === "string" && option.trim().length > 0,
    );

  if (!optionsAreValid) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        >
          <AlertCircle className="mb-3 text-red-500" size={32} />
          <h2 className="text-lg font-black text-slate-900">
            Question unavailable
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This question does not contain four valid answer options. Please
            load another question before continuing.
          </p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edu-ludo-question-title"
    >
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 px-5 py-5 text-white sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <BookOpen size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                  Learnyfi Educational Ludo
                </p>
                <h2
                  id="edu-ludo-question-title"
                  className="mt-1 text-xl font-black sm:text-2xl"
                >
                  Answer to play!
                </h2>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close question"
                className="rounded-xl px-3 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                Close
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
              {question.subject}
              {question.level ? ` · ${question.level}` : ""}
            </div>

            <p className="text-sm font-semibold text-violet-100">
              Question {questionNumber} of {totalQuestions}
            </p>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  (questionNumber / Math.max(1, totalQuestions)) * 100,
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5 sm:p-7">
          {/* Timer and fee */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div
              className={`rounded-2xl border p-3 sm:p-4 ${
                timeLeft <= 5 && !submitted
                  ? "border-red-200 bg-red-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock3
                  size={18}
                  className={
                    timeLeft <= 5 && !submitted
                      ? "text-red-600"
                      : "text-violet-600"
                  }
                />
                <span className="text-xs font-bold text-slate-500">
                  TIME LEFT
                </span>
              </div>

              <p
                aria-live="polite"
                className={`mt-1 text-2xl font-black tabular-nums ${
                  timeLeft <= 5 && !submitted
                    ? "text-red-600"
                    : "text-slate-900"
                }`}
              >
                {formatTime(timeLeft)}
              </p>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timeLeft <= 5 ? "bg-red-500" : "bg-violet-600"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-amber-700" />
                <span className="text-xs font-bold text-amber-800">
                  QUESTION FEE
                </span>
              </div>

              <p className="mt-1 text-2xl font-black text-amber-900">
                {formatNaira(questionCost)}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-amber-800">
                Fee for a presented question
              </p>
            </div>
          </div>

          {/* Question */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              Choose one answer
            </p>

            <h3 className="text-lg font-extrabold leading-relaxed text-slate-900 sm:text-xl">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isAnswer = index === question.correctAnswer;
              let optionStyle =
                "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50";

              if (!submitted && isSelected) {
                optionStyle = "border-violet-500 bg-violet-50 ring-2 ring-violet-100";
              }

              if (submitted && isAnswer) {
                optionStyle = "border-green-400 bg-green-50";
              } else if (submitted && isSelected && !isAnswer) {
                optionStyle = "border-red-300 bg-red-50";
              }

              return (
                <button
                  key={`${question.id}-${index}`}
                  type="button"
                  disabled={submitted || submitting}
                  onClick={() => setSelectedAnswer(index)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition sm:p-4 ${optionStyle} ${
                    submitted || submitting
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                      submitted && isAnswer
                        ? "bg-green-600 text-white"
                        : submitted && isSelected
                          ? "bg-red-500 text-white"
                          : isSelected
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {["A", "B", "C", "D"][index]}
                  </span>

                  <span className="flex-1 text-sm font-semibold leading-6 text-slate-800 sm:text-base">
                    {option}
                  </span>

                  {submitted && isAnswer && (
                    <CheckCircle2
                      className="shrink-0 text-green-600"
                      size={21}
                    />
                  )}

                  {submitted && isSelected && !isAnswer && (
                    <XCircle className="shrink-0 text-red-500" size={21} />
                  )}

                  {!submitted && isSelected && (
                    <CheckCircle2
                      className="shrink-0 text-violet-600"
                      size={21}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result feedback */}
          {submitted && (
            <div
              aria-live="polite"
              className={`mt-5 rounded-2xl border p-4 ${
                isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-green-600"
                    size={23}
                  />
                ) : (
                  <XCircle
                    className="mt-0.5 shrink-0 text-red-600"
                    size={23}
                  />
                )}

                <div>
                  <p
                    className={`font-extrabold ${
                      isCorrect ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {isCorrect
                      ? "Correct answer!"
                      : selectedAnswer === null
                        ? "Time is up!"
                        : "Not quite right"}
                  </p>

                  {!isCorrect && (
                    <p className="mt-1 text-sm text-slate-700">
                      Correct answer:{" "}
                      <strong>
                        {["A", "B", "C", "D"][question.correctAnswer]}.{" "}
                        {question.options[question.correctAnswer]}
                      </strong>
                    </p>
                  )}

                  {showExplanation && question.explanation && (
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {question.explanation}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-500">
                    Response time: {(responseTimeMs / 1000).toFixed(1)} seconds
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6">
            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedAnswer === null || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-4 font-extrabold text-white shadow-lg shadow-violet-700/20 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Submitting answer...
                  </>
                ) : (
                  <>
                    <Zap size={19} />
                    Submit Answer
                  </>
                )}
              </button>
            ) : (
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-600">
                {isCorrect
                  ? "Your game controller can now process your move."
                  : "Your game controller can now process the missed turn."}
              </div>
            )}

            <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
              Answer before the timer expires. The game controller determines
              movement, turn changes, and rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
