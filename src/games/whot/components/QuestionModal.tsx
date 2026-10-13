






"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Loader2,
  ShieldCheck,
  X,
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
  questionSource = "bot",
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

  // "player": the player played the card; the bot answers.
  // "bot": the bot played the card; the human answers.
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

      if (
        answerIndex >= 0 &&
        answerIndex < card.options.length
      ) {
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
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-2 backdrop-blur-sm sm:p-4 ${className}`}
      role="presentation"
    >
      <section
        aria-labelledby="whot-question-title"
        aria-modal="true"
        className="relative my-auto flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-white shadow-2xl shadow-black/40 sm:rounded-3xl"
        role="dialog"
      >
        {/* Timer progress */}
        <div className="h-1 w-full shrink-0 bg-slate-800">
          <div
            className={`h-full transition-[width] duration-200 ${
              isUrgent ? "bg-rose-500" : "bg-cyan-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Compact header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                  isBotAnswering
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                    : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                }`}
              >
                {card.subject}
              </span>

              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
                {card.difficulty}
              </span>
            </div>

            <div
              className={`mt-2 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider sm:text-xs ${
                isBotAnswering
                  ? "text-cyan-300"
                  : "text-amber-300"
              }`}
            >
              {isBotAnswering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}

              {isBotAnswering
                ? "Bot is answering"
                : "Your turn to answer"}
            </div>

            <h2
              className="mt-1 text-base font-bold sm:text-lg"
              id="whot-question-title"
            >
              {isBotAnswering
                ? "Read the question on your card"
                : "Answer the bot's question"}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {isBotAnswering
                ? "Read the question and options while Learnyfi Bot thinks."
                : "Choose the correct answer before time runs out."}
            </p>
          </div>

          {onClose && (
            <button
              aria-label="Close question"
              className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={disabled || isBotAnswering}
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Scrollable content stays inside the centred modal */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 sm:py-4">
          {/* Countdown */}
          <div
            className={`mb-3 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
              isBotAnswering
                ? "border-cyan-400/20 bg-cyan-400/5"
                : "border-white/10 bg-slate-950/50"
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
              <Clock3
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  isUrgent ? "text-rose-400" : "text-cyan-300"
                }`}
              />
              <span>
                {isBotAnswering
                  ? "Question time"
                  : "Time remaining"}
              </span>
            </div>

            <span
              aria-live="polite"
              className={`font-mono text-lg font-black tabular-nums sm:text-xl ${
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

          {/* Question */}
          <div className="mb-3 rounded-xl border border-white/10 bg-slate-950/40 p-3 sm:p-4">
            <p className="text-sm font-semibold leading-6 text-white sm:text-base sm:leading-7">
              {card.question}
            </p>
          </div>

          {/* Answer options */}
          <div
            aria-label="Answer options"
            className="space-y-2"
            role="group"
          >
            {card.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              return (
                <button
                  aria-pressed={
                    isHumanAnswering ? isSelected : undefined
                  }
                  className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition duration-150 sm:p-3.5 ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20"
                      : "border-white/10 bg-slate-800/60"
                  } ${
                    canAnswer
                      ? "cursor-pointer hover:border-slate-500 hover:bg-slate-800"
                      : "cursor-default"
                  }`}
                  disabled={!canAnswer}
                  key={`${card.instanceId}-option-${index}`}
                  onClick={() => handleAnswerSelect(index)}
                  type="button"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold sm:h-9 sm:w-9 sm:text-sm ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {LETTERS[index] ?? index + 1}
                  </span>

                  <span className="min-w-0 flex-1 text-sm font-medium leading-5 text-slate-100 sm:text-base sm:leading-6">
                    {option}
                  </span>

                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-300" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bot thinking indicator */}
          {isBotAnswering && (
            <div
              aria-live="polite"
              className="mt-3 flex items-start gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3"
            >
              <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-cyan-300" />
              <div>
                <p className="text-xs font-bold text-cyan-100 sm:text-sm">
                  Learnyfi Bot is thinking…
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  The bot will choose its own answer automatically.
                </p>
              </div>
            </div>
          )}

          {/* Timeout notice */}
          {isExpired && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-200 sm:text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Time is up. The game engine will resolve the unanswered
                question.
              </p>
            </div>
          )}

          {/* Optional explanation */}
          {showExplanation && card.explanation && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100 sm:text-sm">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{card.explanation}</p>
            </div>
          )}
        </div>

        {/* Fixed footer: stays visible while content scrolls */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[11px] leading-4 text-slate-400 sm:text-xs">
            {isBotAnswering
              ? "Read along while the bot answers automatically."
              : "Select an option or press A–F on your keyboard."}
          </p>

          {isHumanAnswering && (
            <button
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 sm:w-auto"
              disabled={
                selectedAnswer === null ||
                !canAnswer ||
                hasSubmitted
              }
              onClick={handleSubmit}
              type="button"
            >
              {hasSubmitted ? "Answer submitted" : "Submit answer"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

const QuestionModal = memo(QuestionModalComponent);

QuestionModal.displayName = "QuestionModal";

export default QuestionModal;













// "use client";

// import {
//   AlertCircle,
//   CheckCircle2,
//   Clock3,
//   Lightbulb,
//   Loader2,
//   ShieldCheck,
//   X,
// } from "lucide-react";
// import {
//   memo,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import type { WhotCard } from "../types/whot";

// export type WhotQuestionSource = "player" | "bot";

// export interface QuestionModalProps {
//   isOpen: boolean;
//   card: WhotCard | null;
//   timeRemaining: number | null;
//   questionSource?: WhotQuestionSource | null;
//   onSubmitAnswer: (answerIndex: number) => void;
//   onTimeout?: () => void;
//   onClose?: () => void;
//   disabled?: boolean;
//   showExplanation?: boolean;
//   className?: string;
// }

// const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

// function formatTime(seconds: number): string {
//   const safeSeconds = Math.max(0, Math.ceil(seconds));
//   return `00:${String(safeSeconds).padStart(2, "0")}`;
// }

// function QuestionModalComponent({
//   isOpen,
//   card,
//   timeRemaining,
//   questionSource = "bot",
//   onSubmitAnswer,
//   onClose,
//   disabled = false,
//   showExplanation = false,
//   className = "",
// }: QuestionModalProps) {
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
//     null,
//   );
//   const [hasSubmitted, setHasSubmitted] = useState(false);

//   const submittedRef = useRef(false);

//   // "player" means the player played the card, so the bot answers.
//   // "bot" means the bot played the card, so the human answers.
//   const isBotAnswering = questionSource === "player";
//   const isHumanAnswering = questionSource === "bot";

//   const isExpired =
//     timeRemaining !== null && timeRemaining <= 0;

//   const isUrgent =
//     timeRemaining !== null && timeRemaining <= 5;

//   const canAnswer =
//     isOpen &&
//     Boolean(card) &&
//     isHumanAnswering &&
//     !disabled &&
//     !hasSubmitted &&
//     !isExpired;

//   useEffect(() => {
//     setSelectedAnswer(null);
//     setHasSubmitted(false);
//     submittedRef.current = false;
//   }, [isOpen, card?.instanceId, questionSource]);

//   const handleSubmit = useCallback(() => {
//     if (
//       selectedAnswer === null ||
//       !canAnswer ||
//       submittedRef.current
//     ) {
//       return;
//     }

//     submittedRef.current = true;
//     setHasSubmitted(true);
//     onSubmitAnswer(selectedAnswer);
//   }, [selectedAnswer, canAnswer, onSubmitAnswer]);

//   const handleAnswerSelect = useCallback(
//     (answerIndex: number) => {
//       if (!canAnswer) return;
//       setSelectedAnswer(answerIndex);
//     },
//     [canAnswer],
//   );

//   useEffect(() => {
//     if (!isOpen) return;

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (
//         event.key === "Escape" &&
//         onClose &&
//         !disabled
//       ) {
//         onClose();
//         return;
//       }

//       // Keyboard answers are only enabled when the human is answering.
//       if (!canAnswer || !card) return;

//       const key = event.key.toUpperCase();

//       const answerIndex = LETTERS.indexOf(
//         key as (typeof LETTERS)[number],
//       );

//       if (
//         answerIndex >= 0 &&
//         answerIndex < card.options.length
//       ) {
//         event.preventDefault();
//         setSelectedAnswer(answerIndex);
//       }

//       if (event.key === "Enter") {
//         event.preventDefault();
//         handleSubmit();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [
//     isOpen,
//     onClose,
//     disabled,
//     canAnswer,
//     card,
//     handleSubmit,
//   ]);

//   if (!isOpen || !card) return null;

//   const timeLimit = 15;

//   const progress =
//     timeRemaining === null
//       ? 100
//       : Math.max(
//           0,
//           Math.min(100, (timeRemaining / timeLimit) * 100),
//         );

//   return (
//     <div
//       className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6 ${className}`}
//       role="presentation"
//     >
//       <section
//         className="relative my-auto flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl shadow-black/40"
//       >
//         <div className="h-1.5 w-full bg-slate-800">
//           <div
//             className={`h-full transition-[width] duration-200 ${
//               isUrgent ? "bg-rose-500" : "bg-cyan-400"
//             }`}
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
//           <div className="min-w-0 flex-1">
//             <div className="flex flex-wrap items-center gap-2">
//               <span
//                 className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
//                   isBotAnswering
//                     ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
//                     : "border-amber-400/30 bg-amber-400/10 text-amber-300"
//                 }`}
//               >
//                 {card.subject}
//               </span>

//               <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
//                 {card.difficulty}
//               </span>
//             </div>

//             <div
//               className={`mt-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${
//                 isBotAnswering
//                   ? "text-cyan-300"
//                   : "text-amber-300"
//               }`}
//             >
//               {isBotAnswering ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <ShieldCheck className="h-4 w-4" />
//               )}

//               {isBotAnswering
//                 ? "Bot is answering"
//                 : "Your turn to answer"}
//             </div>

//             <h2
//               className="mt-2 text-lg font-bold sm:text-xl"
//               id="whot-question-title"
//             >
//               {isBotAnswering
//                 ? "Read the question on your card"
//                 : "Answer the bot's question"}
//             </h2>

//             <p className="mt-1 text-sm leading-6 text-slate-400">
//               {isBotAnswering
//                 ? "Your question appears first. Read it and consider the options while Learnyfi Bot prepares its answer."
//                 : "Choose the correct answer. Your result will determine the points and penalties for this turn."}
//             </p>
//           </div>

//           {onClose && (
//             <button
//               aria-label="Close question"
//               className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
//               disabled={disabled || isBotAnswering}
//               onClick={onClose}
//               type="button"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </div>

//         <div className="px-5 py-6 sm:px-7 sm:py-7">
//           <div
//             className={`mb-6 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
//               isBotAnswering
//                 ? "border-cyan-400/20 bg-cyan-400/5"
//                 : "border-white/10 bg-slate-950/50"
//             }`}
//           >
//             <div className="flex items-center gap-2 text-sm text-slate-300">
//               <Clock3
//                 className={`h-5 w-5 ${
//                   isUrgent
//                     ? "text-rose-400"
//                     : "text-cyan-300"
//                 }`}
//               />
//               <span>
//                 {isBotAnswering
//                   ? "Question time"
//                   : "Time remaining"}
//               </span>
//             </div>

//             <span
//               aria-live="polite"
//               className={`font-mono text-xl font-black tabular-nums ${
//                 isUrgent
//                   ? "animate-pulse text-rose-400"
//                   : "text-white"
//               }`}
//             >
//               {timeRemaining === null
//                 ? "--:--"
//                 : formatTime(timeRemaining)}
//             </span>
//           </div>

//           <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4 sm:p-5">
//             <p className="text-lg font-semibold leading-8 text-white sm:text-xl">
//               {card.question}
//             </p>
//           </div>

//           <div
//             aria-label="Answer options"
//             className="space-y-3"
//             role="group"
//           >
//             {card.options.map((option, index) => {
//               const isSelected = selectedAnswer === index;

//               return (
//                 <button
//                   aria-pressed={
//                     isHumanAnswering ? isSelected : undefined
//                   }
//                   className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition duration-150 ${
//                     isSelected
//                       ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20"
//                       : "border-white/10 bg-slate-800/60"
//                   } ${
//                     canAnswer
//                       ? "cursor-pointer hover:border-slate-500 hover:bg-slate-800"
//                       : "cursor-default"
//                   }`}
//                   disabled={!canAnswer}
//                   key={`${card.instanceId}-option-${index}`}
//                   onClick={() => handleAnswerSelect(index)}
//                   type="button"
//                 >
//                   <span
//                     className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition ${
//                       isSelected
//                         ? "bg-cyan-400 text-slate-950"
//                         : "bg-slate-700 text-slate-200"
//                     }`}
//                   >
//                     {LETTERS[index] ?? index + 1}
//                   </span>

//                   <span className="flex-1 pt-1 text-sm font-medium leading-6 text-slate-100 sm:text-base">
//                     {option}
//                   </span>

//                   {isSelected && (
//                     <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {isBotAnswering && (
//             <div
//               aria-live="polite"
//               className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4"
//             >
//               <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-cyan-300" />
//               <div>
//                 <p className="text-sm font-bold text-cyan-100">
//                   Learnyfi Bot is thinking…
//                 </p>
//                 <p className="mt-1 text-xs leading-5 text-slate-400">
//                   The options are displayed for you to read. The
//                   bot will submit its own answer automatically.
//                 </p>
//               </div>
//             </div>
//           )}

//           {isExpired && (
//             <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
//               <p>
//                 Time is up. The game engine will resolve the
//                 unanswered question.
//               </p>
//             </div>
//           )}

//           {showExplanation && card.explanation && (
//             <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
//               <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" />
//               <p>{card.explanation}</p>
//             </div>
//           )}

//           <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-xs leading-5 text-slate-400">
//               {isBotAnswering
//                 ? "Read the question and options while the bot answers."
//                 : "Select an option or use A–F on your keyboard."}
//             </p>

//             {isHumanAnswering && (
//               <button
//                 className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
//                 disabled={
//                   selectedAnswer === null ||
//                   !canAnswer ||
//                   hasSubmitted
//                 }
//                 onClick={handleSubmit}
//                 type="button"
//               >
//                 {hasSubmitted ? "Answer submitted" : "Submit answer"}
//               </button>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// const QuestionModal = memo(QuestionModalComponent);

// QuestionModal.displayName = "QuestionModal";

// export default QuestionModal;
