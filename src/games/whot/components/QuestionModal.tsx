
"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Loader2,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { WhotCard, WhotSubject } from "../types/whot";

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

const SUBJECT_STYLES: Record<WhotSubject, string> = {
  MATHS:
    "border-blue-400/35 bg-blue-400/10 text-blue-200",
  ENGLISH:
    "border-fuchsia-400/35 bg-fuchsia-400/10 text-fuchsia-200",
  BIOLOGY:
    "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
  CHEMISTRY:
    "border-orange-400/35 bg-orange-400/10 text-orange-200",
  PHYSICS:
    "border-cyan-400/35 bg-cyan-400/10 text-cyan-200",
  HISTORY:
    "border-amber-400/35 bg-amber-400/10 text-amber-200",
  GENERAL:
    "border-violet-400/35 bg-violet-400/10 text-violet-200",
};

const SUBJECT_LABELS: Record<WhotSubject, string> = {
  MATHS: "Mathematics",
  ENGLISH: "English Language",
  BIOLOGY: "Biology",
  CHEMISTRY: "Chemistry",
  PHYSICS: "Physics",
  HISTORY: "History",
  GENERAL: "General Knowledge",
};

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  return `00:${String(safeSeconds).padStart(2, "0")}`;
}

function QuestionModalComponent({
  isOpen,
  card,
  timeRemaining,
  questionSource = "bot",
  onSubmitAnswer,
  onTimeout,
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
  const timeoutRef = useRef(false);

  // The source identifies who played the card.
  // A human playing a card means the bot answers.
  // A bot playing a card means the human answers.
  const isBotAnswering = questionSource === "player";
  const isHumanAnswering = questionSource === "bot";

  const isExpired =
    timeRemaining !== null && timeRemaining <= 0;

  const isUrgent =
    timeRemaining !== null && timeRemaining <= 5;

  const canAnswer =
    isOpen &&
    Boolean(card) &&
    isHumanAnswering &&
    !disabled &&
    !hasSubmitted &&
    !isExpired;

  const subjectStyle = card
    ? SUBJECT_STYLES[card.subject]
    : SUBJECT_STYLES.GENERAL;

  const subjectLabel = card
    ? SUBJECT_LABELS[card.subject]
    : "General Knowledge";

  useEffect(() => {
    setSelectedAnswer(null);
    setHasSubmitted(false);
    submittedRef.current = false;
    timeoutRef.current = false;
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

  // Notify the game engine once when an open question expires.
  useEffect(() => {
    if (
      !isOpen ||
      !isHumanAnswering ||
      !isExpired ||
      disabled ||
      timeoutRef.current
    ) {
      return;
    }

    timeoutRef.current = true;
    onTimeout?.();
  }, [
    isOpen,
    isHumanAnswering,
    isExpired,
    disabled,
    onTimeout,
  ]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        onClose &&
        !disabled &&
        !isBotAnswering
      ) {
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
  }, [
    isOpen,
    onClose,
    disabled,
    isBotAnswering,
    canAnswer,
    card,
    handleSubmit,
  ]);

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
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/90 p-2 backdrop-blur-md supports-[height:100dvh]:min-h-[100dvh] sm:p-4 ${className}`}
      role="presentation"
    >
      <section
        aria-labelledby="whot-question-title"
        aria-modal="true"
        className="relative my-auto flex max-h-[96dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-white shadow-2xl shadow-black/50 sm:max-h-[92dvh] sm:rounded-3xl"
        role="dialog"
      >
        {/* Countdown progress */}
        <div
          className="h-1.5 w-full shrink-0 bg-slate-800"
          aria-hidden="true"
        >
          <div
            className={`h-full transition-[width] duration-200 ${
              isExpired
                ? "bg-rose-500"
                : isUrgent
                  ? "bg-rose-400"
                  : "bg-cyan-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider sm:text-xs ${subjectStyle}`}
              >
                {subjectLabel}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-300 sm:text-xs">
                {card.difficulty}
              </span>
            </div>

            <div
              className={`mt-2.5 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider sm:text-xs ${
                isBotAnswering
                  ? "text-amber-300"
                  : "text-cyan-300"
              }`}
            >
              {isBotAnswering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserRound className="h-4 w-4" />
              )}

              {isBotAnswering
                ? "Bot answering"
                : "Your turn to answer"}
            </div>

            <h2
              className="mt-1.5 text-base font-extrabold leading-6 sm:text-lg"
              id="whot-question-title"
            >
              {isBotAnswering
                ? "The bot is answering"
                : "Answer the question"}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {isBotAnswering
                ? "Watch the bot's turn. Its answer is handled automatically."
                : "Choose the best answer before the countdown ends."}
            </p>
          </div>

          {onClose && (
            <button
              aria-label="Close question"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={disabled || isBotAnswering}
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </header>

        {/* Scrollable question content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-6 sm:py-4">
          {/* Timer */}
          <div
            className={`mb-3 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
              isBotAnswering
                ? "border-amber-400/20 bg-amber-400/[0.06]"
                : isUrgent
                  ? "border-rose-400/30 bg-rose-400/[0.07]"
                  : "border-cyan-400/20 bg-cyan-400/[0.05]"
            }`}
          >
            <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-300 sm:text-sm">
              <Clock3
                className={`h-4 w-4 shrink-0 ${
                  isUrgent ? "text-rose-400" : "text-cyan-300"
                }`}
              />
              <span>
                {isBotAnswering
                  ? "Bot's question timer"
                  : "Time remaining"}
              </span>
            </div>

            <span
              aria-live="polite"
              className={`shrink-0 font-mono text-xl font-black tabular-nums sm:text-2xl ${
                isExpired || isUrgent
                  ? "text-rose-400"
                  : "text-white"
              }`}
            >
              {timeRemaining === null
                ? "--:--"
                : formatTime(timeRemaining)}
            </span>
          </div>

          {/* Question card */}
          <article className="mb-4 rounded-xl border border-white/10 bg-slate-950/60 p-3.5 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-black ${subjectStyle}`}
              >
                ?
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                Question
              </span>
            </div>

            <p className="break-words text-sm font-semibold leading-6 text-white sm:text-base sm:leading-7">
              {card.question}
            </p>
          </article>

          {/* Options */}
          <div
            aria-label="Answer options"
            className="space-y-2"
            role="group"
          >
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 sm:text-xs">
              Select one answer
            </p>

            {card.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              return (
                <button
                  key={`${card.instanceId}-option-${index}`}
                  type="button"
                  aria-pressed={
                    isHumanAnswering ? isSelected : undefined
                  }
                  disabled={!canAnswer}
                  onClick={() => handleAnswerSelect(index)}
                  className={`group flex min-h-12 w-full items-center gap-3 rounded-xl border p-3 text-left transition duration-150 sm:min-h-14 sm:p-3.5 ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20"
                      : "border-white/10 bg-slate-800/60"
                  } ${
                    canAnswer
                      ? "cursor-pointer hover:border-cyan-400/50 hover:bg-slate-800 active:scale-[0.995]"
                      : "cursor-default"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black sm:h-10 sm:w-10 sm:text-sm ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 bg-slate-700 text-slate-200"
                    }`}
                  >
                    {LETTERS[index] ?? index + 1}
                  </span>

                  <span className="min-w-0 flex-1 break-words text-sm font-medium leading-5 text-slate-100 sm:text-base sm:leading-6">
                    {option}
                  </span>

                  {isSelected && (
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-cyan-300"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bot status */}
          {isBotAnswering && (
            <div
              aria-live="polite"
              className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3"
            >
              <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-amber-300" />
              <div>
                <p className="text-xs font-bold text-amber-100 sm:text-sm">
                  Learnyfi Bot is thinking…
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  The bot will choose its answer automatically.
                </p>
              </div>
            </div>
          )}

          {/* Timeout */}
          {isExpired && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-3 text-xs leading-5 text-rose-200 sm:text-sm"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Time is up. The game engine will resolve the unanswered
                question.
              </p>
            </div>
          )}

          {/* Explanation */}
          {showExplanation && card.explanation && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] p-3 text-xs leading-5 text-amber-100 sm:text-sm">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{card.explanation}</p>
            </div>
          )}
        </div>

        {/* Persistent footer */}
        <footer className="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-slate-900 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[10px] leading-4 text-slate-400 sm:text-xs">
            {isBotAnswering
              ? "The bot's answer is automatic."
              : "Tap an option or use A–F on your keyboard."}
          </p>

          {isHumanAnswering && (
            <button
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 sm:w-auto"
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
                  <CheckCircle2 className="h-4 w-4" />
                  Answer submitted
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Submit answer
                </>
              )}
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

const QuestionModal = memo(QuestionModalComponent);

QuestionModal.displayName = "QuestionModal";

export default QuestionModal;
