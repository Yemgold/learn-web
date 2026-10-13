





"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
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
  MATHS: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  ENGLISH: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  BIOLOGY: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  CHEMISTRY: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  PHYSICS: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  HISTORY: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  GENERAL: "border-violet-400/30 bg-violet-400/10 text-violet-200",
};

const SUBJECT_LABELS: Record<WhotSubject, string> = {
  MATHS: "Mathematics",
  ENGLISH: "English",
  BIOLOGY: "Biology",
  CHEMISTRY: "Chemistry",
  PHYSICS: "Physics",
  HISTORY: "History",
  GENERAL: "General Knowledge",
};

function formatTime(seconds: number): string {
  return `00:${String(Math.max(0, Math.ceil(seconds))).padStart(2, "0")}`;
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submittedRef = useRef(false);
  const timeoutRef = useRef(false);

  // The source identifies who played the card.
  // Player played it => bot answers. Bot played it => human answers.
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

    return () => window.removeEventListener("keydown", handleKeyDown);
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
      : Math.max(0, Math.min(100, (timeRemaining / timeLimit) * 100));

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-sm supports-[height:100dvh]:min-h-[100dvh] sm:p-4 ${className}`}
      role="presentation"
    >
      <section
        aria-labelledby="whot-question-title"
        aria-modal="true"
        className="relative flex max-h-[96dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-white shadow-2xl sm:max-h-[92dvh] sm:rounded-3xl"
        role="dialog"
      >
        {/* Countdown */}
        <div className="relative h-1.5 shrink-0 bg-slate-800">
          <div
            className={`h-full transition-[width] duration-200 ${
              isUrgent ? "bg-rose-400" : "bg-cyan-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Compact header */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`max-w-[55%] truncate rounded-lg border px-2.5 py-1.5 text-[10px] font-extrabold sm:text-xs ${subjectStyle}`}
            >
              {subjectLabel}
            </span>

            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-bold text-slate-300">
              {card.difficulty}
            </span>

            <span
              className={`flex items-center gap-1.5 text-[10px] font-bold sm:text-xs ${
                isBotAnswering ? "text-amber-300" : "text-cyan-300"
              }`}
            >
              {isBotAnswering ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UserRound className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">
                {isBotAnswering ? "Bot answering" : "Your turn"}
              </span>
            </span>
          </div>

          {onClose && (
            <button
              aria-label="Close question"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              disabled={disabled || isBotAnswering}
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </header>

        {/* Question and answers */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-5 sm:py-4">
          {/* Prominent countdown */}
          <div
            className={`mb-3 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
              isUrgent
                ? "border-rose-400/30 bg-rose-400/[0.08]"
                : "border-white/10 bg-slate-950/50"
            }`}
          >
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Clock3
                className={`h-4 w-4 ${
                  isUrgent ? "text-rose-400" : "text-cyan-300"
                }`}
              />
              {isBotAnswering ? "Bot's timer" : "Time remaining"}
            </span>

            <span
              aria-live="polite"
              className={`font-mono text-2xl font-black tabular-nums ${
                isUrgent ? "text-rose-400" : "text-white"
              }`}
            >
              {timeRemaining === null ? "--:--" : formatTime(timeRemaining)}
            </span>
          </div>

          {/* Main question */}
          <article className="mb-4 rounded-xl border border-white/10 bg-slate-950/60 p-4 sm:p-5">
            <h2
              id="whot-question-title"
              className="break-words text-base font-bold leading-7 text-white sm:text-lg sm:leading-8"
            >
              {card.question}
            </h2>
          </article>

          {/* Answer options */}
          <div aria-label="Answer options" className="space-y-2" role="group">
            {card.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const letter = LETTERS[index] ?? String(index + 1);

              return (
                <button
                  key={`${card.instanceId}-option-${index}`}
                  type="button"
                  aria-pressed={isHumanAnswering ? isSelected : undefined}
                  disabled={!canAnswer}
                  onClick={() => handleAnswerSelect(index)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl border p-3 text-left transition sm:min-h-14 sm:p-3.5 ${
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
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 bg-slate-700 text-slate-200"
                    }`}
                  >
                    {letter}
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

          {isBotAnswering && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3 text-xs text-amber-100">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-300" />
              The bot is answering automatically.
            </div>
          )}

          {isExpired && (
            <div
              role="alert"
              className="mt-3 flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-3 text-xs text-rose-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              Time is up.
            </div>
          )}

          {showExplanation && card.explanation && (
            <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] p-3 text-xs leading-5 text-amber-100">
              {card.explanation}
            </div>
          )}
        </div>

        {/* Minimal action footer */}
        {isHumanAnswering && (
          <footer className="shrink-0 border-t border-white/10 bg-slate-900 p-3 sm:px-5">
            <button
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
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
          </footer>
        )}
      </section>
    </div>
  );
}

const QuestionModal = memo(QuestionModalComponent);

QuestionModal.displayName = "QuestionModal";

export default QuestionModal;
