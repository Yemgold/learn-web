




"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Lightbulb,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { WhotCard } from "../types/whot";

export type WhotQuestionSource = "player" | "bot";

export interface QuestionModalProps {
  isOpen: boolean;
  card: WhotCard | null;
  timeRemaining: number | null;
  questionSource?: WhotQuestionSource | null;
  onSubmitAnswer: (answerIndex: number) => void;
  onTimeout?: () => void;
  onClose?: () => void;
  disabled?: boolean;
  showExplanation?: boolean;
  className?: string;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  return `00:${String(safeSeconds).padStart(2, "0")}`;
}

function QuestionModalComponent({
  isOpen,
  card,
  timeRemaining,
  questionSource = "player",
  onSubmitAnswer,
  onClose,
  disabled = false,
  showExplanation = false,
  className = "",
}: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    null,
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submittedRef = useRef(false);

  const isBotChallenge = questionSource === "bot";
  const isExpired = timeRemaining !== null && timeRemaining <= 0;
  const isUrgent = timeRemaining !== null && timeRemaining <= 5;

  const canAnswer =
    isOpen &&
    Boolean(card) &&
    !disabled &&
    !hasSubmitted &&
    !isExpired;

  useEffect(() => {
    setSelectedAnswer(null);
    setHasSubmitted(false);
    submittedRef.current = false;
  }, [isOpen, card?.instanceId, questionSource]);

  const handleSubmit = useCallback(() => {
    if (
      selectedAnswer === null ||
      !canAnswer ||
      submittedRef.current
    ) {
      return;
    }

    submittedRef.current = true;
    setHasSubmitted(true);
    onSubmitAnswer(selectedAnswer);
  }, [selectedAnswer, canAnswer, onSubmitAnswer]);

  const handleAnswerSelect = useCallback(
    (answerIndex: number) => {
      if (!canAnswer) return;
      setSelectedAnswer(answerIndex);
    },
    [canAnswer],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose && !disabled) {
        onClose();
        return;
      }

      if (!canAnswer || !card) return;

      const key = event.key.toUpperCase();
      const answerIndex = LETTERS.indexOf(
        key as (typeof LETTERS)[number],
      );

      if (answerIndex >= 0 && answerIndex < card.options.length) {
        event.preventDefault();
        setSelectedAnswer(answerIndex);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, disabled, canAnswer, card, handleSubmit]);

  if (!isOpen || !card) return null;

  const timeLimit = 15;
  const progress =
    timeRemaining === null
      ? 100
      : Math.max(
          0,
          Math.min(100, (timeRemaining / timeLimit) * 100),
        );

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6 ${className}`}
      role="presentation"
    >
      <section
        aria-labelledby="whot-question-title"
        aria-modal="true"
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl shadow-black/40"
        role="dialog"
      >
        <div className="h-1.5 w-full bg-slate-800">
          <div
            className={`h-full transition-[width] duration-200 ${
              isUrgent ? "bg-rose-500" : "bg-cyan-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  isBotChallenge
                    ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                    : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                }`}
              >
                {card.subject}
              </span>

              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                {card.difficulty}
              </span>
            </div>

            <div
              className={`mt-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${
                isBotChallenge ? "text-amber-300" : "text-cyan-300"
              }`}
            >
              {isBotChallenge ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              {isBotChallenge ? "Bot challenge" : "Your card"}
            </div>

            <h2
              className="mt-2 text-lg font-bold sm:text-xl"
              id="whot-question-title"
            >
              {isBotChallenge
                ? "Answer the bot's question"
                : "Answer correctly to play your card"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              {isBotChallenge
                ? "Get it right to score points and keep your turn. A wrong answer gives the bot points and another chance to challenge you."
                : "Get it right to play this card. A wrong answer gives the bot points, and you must draw penalty cards."}
            </p>
          </div>

          {onClose && (
            <button
              aria-label="Close question"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={disabled}
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock3
                className={`h-5 w-5 ${
                  isUrgent ? "text-rose-400" : "text-cyan-300"
                }`}
              />
              <span>Time remaining</span>
            </div>

            <span
              aria-live="polite"
              className={`font-mono text-xl font-black tabular-nums ${
                isUrgent
                  ? "animate-pulse text-rose-400"
                  : "text-white"
              }`}
            >
              {timeRemaining === null
                ? "--:--"
                : formatTime(timeRemaining)}
            </span>
          </div>

          <p className="mb-6 text-lg font-semibold leading-8 text-white sm:text-xl">
            {card.question}
          </p>

          <div
            aria-label="Answer options"
            className="space-y-3"
            role="group"
          >
            {card.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition duration-150 ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20"
                      : "border-white/10 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800"
                  } ${
                    !canAnswer
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer"
                  }`}
                  disabled={!canAnswer}
                  key={`${card.instanceId}-option-${index}`}
                  onClick={() => handleAnswerSelect(index)}
                  type="button"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-slate-700 text-slate-200 group-hover:bg-slate-600"
                    }`}
                  >
                    {LETTERS[index] ?? index + 1}
                  </span>

                  <span className="flex-1 pt-1 text-sm font-medium leading-6 text-slate-100 sm:text-base">
                    {option}
                  </span>

                  {isSelected && (
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
                  )}
                </button>
              );
            })}
          </div>

          {isExpired && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                Time is up. The game will count this as an unanswered
                question.
              </p>
            </div>
          )}

          {showExplanation && card.explanation && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{card.explanation}</p>
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs leading-5 text-slate-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 font-bold text-slate-300">
                A
              </span>
              Choose an option or use A–F on your keyboard.
            </p>

            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              disabled={
                selectedAnswer === null ||
                !canAnswer ||
                hasSubmitted
              }
              onClick={handleSubmit}
              type="button"
            >
              {hasSubmitted ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Answer submitted
                </>
              ) : (
                "Submit answer"
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const QuestionModal = memo(QuestionModalComponent);

QuestionModal.displayName = "QuestionModal";

export default QuestionModal;
