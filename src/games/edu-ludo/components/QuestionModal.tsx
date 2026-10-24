// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   CheckCircle2,
//   Clock3,
//   HelpCircle,
//   Lightbulb,
//   Loader2,
//   XCircle,
//   Zap,
// } from "lucide-react";

// import type {
//   EduLudoAnswerResult,
//   EduLudoQuestion,
// } from "./eduLudoTypes";

// import {
//   QUESTION_COST,
//   QUESTION_TIME_LIMIT,
// } from "./eduLudoConstants";

// interface QuestionModalProps {
//   question: EduLudoQuestion | null;
//   open?: boolean;
//   timeLimit?: number;
//   questionCost?: number;
//   disabled?: boolean;
//   submitting?: boolean;
//   selectedAnswer?: number | null;
//   result?: EduLudoAnswerResult | null;
//   onAnswer: (answerIndex: number) => void;
//   onTimeUp?: () => void;
//   onClose?: () => void;
//   onContinue?: () => void;
//   showTimer?: boolean;
//   showCost?: boolean;
//   allowClose?: boolean;
//   automated?: boolean;
//   botThinking?: boolean;
//   botName?: string;
// }

// export default function QuestionModal({
//   question,
//   open = false,
//   timeLimit = QUESTION_TIME_LIMIT,
//   questionCost = QUESTION_COST,
//   disabled = false,
//   submitting = false,
//   selectedAnswer = null,
//   result = null,
//   onAnswer,
//   onTimeUp,
//   onContinue,
//   onClose,
//   showTimer = true,
//   showCost = true,
//   allowClose = false,
//   automated = false,
//   botThinking = false,
//   botName = "Bot",
// }: QuestionModalProps) {
//   const [timeLeft, setTimeLeft] = useState(timeLimit);
//   const [localSelection, setLocalSelection] = useState<number | null>(null);
//   const [hasTimedOut, setHasTimedOut] = useState(false);

//   const effectiveSelection = selectedAnswer ?? localSelection;
//   const answered = result != null;

//   const interactionDisabled =
//     disabled || automated || submitting || answered || hasTimedOut;

//   const explanationRef = useRef<HTMLDivElement>(null);
//   const questionPanelRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     if (!open || !question) return;

//     setTimeLeft(timeLimit);
//     setLocalSelection(null);
//     setHasTimedOut(false);
//   }, [question?.id, open, timeLimit]);

//   // Scroll the explanation into view after ANY answer, including wrong
//   // answers and timeouts.
//   useEffect(() => {
//     if (!open || !question || !answered || !question.explanation) return;

//     const timeout = window.setTimeout(() => {
//       const explanation = explanationRef.current;
//       const panel = questionPanelRef.current;

//       if (!explanation || !panel) return;

//       const explanationTop =
//         explanation.getBoundingClientRect().top -
//         panel.getBoundingClientRect().top +
//         panel.scrollTop;

//       panel.scrollTo({
//         top: Math.max(0, explanationTop - 16),
//         behavior: "smooth",
//       });
//     }, 200);

//     return () => window.clearTimeout(timeout);
//   }, [open, question?.id, answered, question?.explanation]);

//   useEffect(() => {
//     if (
//       !open ||
//       !question ||
//       !showTimer ||
//       disabled ||
//       automated ||
//       submitting ||
//       answered ||
//       hasTimedOut
//     ) {
//       return;
//     }

//     if (timeLeft <= 0) {
//       setHasTimedOut(true);
//       onTimeUp?.();
//       return;
//     }

//     const timeout = window.setTimeout(() => {
//       setTimeLeft((previous) => Math.max(0, previous - 1));
//     }, 1000);

//     return () => window.clearTimeout(timeout);
//   }, [
//     open,
//     question,
//     showTimer,
//     disabled,
//     automated,
//     submitting,
//     answered,
//     hasTimedOut,
//     timeLeft,
//     onTimeUp,
//   ]);

//   if (!open || !question) return null;

//   const handleAnswer = (answerIndex: number) => {
//     if (interactionDisabled || effectiveSelection !== null) return;

//     setLocalSelection(answerIndex);
//     onAnswer(answerIndex);
//   };

//   const isCorrectOption = (index: number) =>
//     answered && result?.correctAnswer === index;

//   const isSelectedWrongOption = (index: number) =>
//     answered &&
//     result?.selectedAnswer === index &&
//     !result.isCorrect;

//   const timerPercent = Math.max(
//     0,
//     Math.min(100, (timeLeft / Math.max(1, timeLimit)) * 100),
//   );

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-2 backdrop-blur-sm sm:p-5"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="edu-ludo-question-title"
//     >
//       <section
//         ref={questionPanelRef}
//         className="my-auto max-h-[96vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white shadow-2xl scroll-smooth"
//       >
//         <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 px-5 py-5 text-white sm:px-7">
//           <div className="flex items-start justify-between gap-3">
//             <div className="flex items-start gap-3">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
//                 {answered ? (
//                   result?.isCorrect ? (
//                     <CheckCircle2 size={24} />
//                   ) : (
//                     <XCircle size={24} />
//                   )
//                 ) : (
//                   <HelpCircle size={24} />
//                 )}
//               </div>

//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">
//                   Learnyfi Educational Ludo
//                 </p>
//                 <h2
//                   id="edu-ludo-question-title"
//                   className="mt-1 text-xl font-black sm:text-2xl"
//                 >
//                   {answered ? "Answer review" : "Answer to move"}
//                 </h2>
//                 <p className="mt-1 text-sm capitalize text-indigo-100">
//                   {question.subject} · {question.level} · {question.difficulty}
//                 </p>
//               </div>
//             </div>

//             {allowClose && (
//               <button
//                 type="button"
//                 onClick={() => onClose?.()}
//                 className="rounded-xl p-2 text-white/90 transition hover:bg-white/15"
//                 aria-label="Close question"
//               >
//                 <XCircle size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="space-y-5 p-4 sm:p-7">
//           {automated && (
//             <div
//               className={[
//                 "flex items-center gap-3 rounded-2xl border p-4",
//                 answered
//                   ? result?.isCorrect
//                     ? "border-emerald-200 bg-emerald-50 text-emerald-900"
//                     : "border-rose-200 bg-rose-50 text-rose-900"
//                   : "border-violet-200 bg-violet-50 text-violet-900",
//               ].join(" ")}
//               role="status"
//               aria-live="polite"
//             >
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
//                 {answered ? (
//                   result?.isCorrect ? (
//                     <CheckCircle2 size={22} />
//                   ) : (
//                     <XCircle size={22} />
//                   )
//                 ) : (
//                   <Loader2
//                     size={22}
//                     className={botThinking ? "animate-spin" : ""}
//                   />
//                 )}
//               </div>

//               <div>
//                 <p className="font-extrabold">
//                   {answered
//                     ? `${botName} ${result?.isCorrect ? "answered correctly" : "answered incorrectly"}`
//                     : `${botName} is thinking…`}
//                 </p>
//                 <p className="mt-1 text-sm">
//                   {answered
//                     ? "Review the selected answer and explanation below."
//                     : "The bot will answer automatically."}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="grid gap-3 sm:grid-cols-2">
//             {showTimer && !automated && (
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                 <div className="flex items-center justify-between gap-2">
//                   <span className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
//                     <Clock3 size={15} />
//                     Time remaining
//                   </span>
//                   <span
//                     className={[
//                       "text-lg font-black tabular-nums",
//                       timeLeft <= 5 ? "text-rose-600" : "text-slate-900",
//                     ].join(" ")}
//                   >
//                     {timeLeft}s
//                   </span>
//                 </div>

//                 <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
//                   <div
//                     className={[
//                       "h-full rounded-full transition-all duration-300",
//                       timeLeft <= 5 ? "bg-rose-500" : "bg-indigo-600",
//                     ].join(" ")}
//                     style={{ width: `${timerPercent}%` }}
//                   />
//                 </div>
//               </div>
//             )}

//             {showCost && !automated && (
//               <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
//                 <p className="text-xs font-bold uppercase text-amber-800">
//                   Question charge
//                 </p>
//                 <p className="mt-1 text-lg font-black text-amber-950">
//                   ₦{questionCost.toLocaleString("en-NG")}
//                 </p>
//                 <p className="text-xs text-amber-800">
//                   Charged when your question is presented.
//                 </p>
//               </div>
//             )}
//           </div>

//           <div>
//             <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
//               Question
//             </p>
//             <p className="mt-2 whitespace-pre-wrap break-words text-base font-bold leading-7 text-slate-900 sm:text-lg">
//               {question.content}
//             </p>
//           </div>

//           <div className="space-y-3">
//             {question.options.map((option, index) => {
//               const isSelected = effectiveSelection === index;
//               const isCorrect = isCorrectOption(index);
//               const isWrong = isSelectedWrongOption(index);

//               let optionStyle =
//                 "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50";

//               if (isSelected && !answered) {
//                 optionStyle =
//                   "border-indigo-500 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-100";
//               }

//               if (isCorrect) {
//                 optionStyle =
//                   "border-emerald-500 bg-emerald-50 text-emerald-950";
//               } else if (isWrong) {
//                 optionStyle = "border-rose-400 bg-rose-50 text-rose-950";
//               }

//               return (
//                 <button
//                   key={`${question.id}-option-${index}`}
//                   type="button"
//                   onClick={() => handleAnswer(index)}
//                   disabled={interactionDisabled || effectiveSelection !== null}
//                   className={[
//                     "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
//                     optionStyle,
//                     interactionDisabled ? "cursor-default" : "",
//                   ].join(" ")}
//                 >
//                   <span
//                     className={[
//                       "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black",
//                       isCorrect
//                         ? "bg-emerald-600 text-white"
//                         : isWrong
//                           ? "bg-rose-600 text-white"
//                           : isSelected
//                             ? "bg-indigo-600 text-white"
//                             : "bg-slate-100 text-slate-700",
//                     ].join(" ")}
//                   >
//                     {String.fromCharCode(65 + index)}
//                   </span>

//                   <span className="flex-1 break-words pt-1 text-sm font-semibold leading-6 sm:text-base">
//                     {option}
//                   </span>

//                   {isCorrect && (
//                     <CheckCircle2
//                       size={20}
//                       className="mt-1 shrink-0 text-emerald-600"
//                     />
//                   )}

//                   {isWrong && (
//                     <XCircle
//                       size={20}
//                       className="mt-1 shrink-0 text-rose-600"
//                     />
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {answered && (
//             <div
//               className={[
//                 "rounded-2xl border p-4",
//                 result?.isCorrect
//                   ? "border-emerald-300 bg-emerald-50"
//                   : "border-rose-300 bg-rose-50",
//               ].join(" ")}
//               role="status"
//               aria-live="polite"
//             >
//               <div className="flex items-start gap-3">
//                 {result?.isCorrect ? (
//                   <CheckCircle2
//                     size={22}
//                     className="mt-0.5 shrink-0 text-emerald-600"
//                   />
//                 ) : (
//                   <XCircle
//                     size={22}
//                     className="mt-0.5 shrink-0 text-rose-600"
//                   />
//                 )}

//                 <div className="min-w-0 flex-1">
//                   <p
//                     className={[
//                       "font-black",
//                       result?.isCorrect ? "text-emerald-900" : "text-rose-900",
//                     ].join(" ")}
//                   >
//                     {result?.isCorrect
//                       ? "Correct answer!"
//                       : result?.selectedAnswer === -1
//                         ? "Time is up!"
//                         : "Incorrect answer"}
//                   </p>

//                   {!result?.isCorrect && (
//                     <p className="mt-1 text-sm font-semibold text-slate-800">
//                       The correct option is highlighted above.
//                     </p>
//                   )}

//                   {result?.isCorrect && (result.pointsAwarded ?? 0) > 0 && (
//                     <p className="mt-1 text-sm font-bold text-emerald-800">
//                       +{result.pointsAwarded} CBT points
//                     </p>
//                   )}

//                   {question.explanation?.trim() ? (
//                     <div
//                       ref={explanationRef}
//                       className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-900"
//                     >
//                       <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-indigo-700">
//                         <Lightbulb size={18} className="shrink-0" />
//                         Explanation
//                       </p>

//                       <p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium leading-7 text-slate-800 sm:text-base">
//                         {question.explanation}
//                       </p>
//                     </div>
//                   ) : (
//                     <div
//                       ref={explanationRef}
//                       className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950"
//                     >
//                       <p className="font-bold">Explanation unavailable</p>
//                       <p className="mt-1 text-sm leading-6">
//                         No explanation was provided for this question.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {automated && !answered && (
//             <p className="text-center text-xs leading-5 text-slate-500">
//               <Loader2 size={13} className="mr-1 inline animate-spin" />
//               The bot is answering automatically. You cannot select its answers.
//             </p>
//           )}

//           {answered && automated && (
//             <p className="text-center text-sm font-semibold text-slate-600">
//               The bot will continue automatically after reviewing the answer.
//             </p>
//           )}

//           {answered && !automated && onContinue && (
//             <button
//               type="button"
//               onClick={onContinue}
//               className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-700"
//             >
//               <Zap size={17} />
//               Continue
//             </button>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }











"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  HelpCircle,
  Lightbulb,
  Loader2,
  XCircle,
  Zap,
} from "lucide-react";

import type {
  EduLudoAnswerResult,
  EduLudoQuestion,
} from "./eduLudoTypes";

import {
  QUESTION_COST,
  QUESTION_TIME_LIMIT,
} from "./eduLudoConstants";

interface QuestionModalProps {
  question: EduLudoQuestion | null;
  open?: boolean;
  timeLimit?: number;
  questionCost?: number;
  disabled?: boolean;
  submitting?: boolean;
  selectedAnswer?: number | null;
  result?: EduLudoAnswerResult | null;
  onAnswer: (answerIndex: number) => void;
  onTimeUp?: () => void;
  onClose?: () => void;
  onContinue?: () => void;
  showTimer?: boolean;
  showCost?: boolean;
  allowClose?: boolean;
  automated?: boolean;
  botThinking?: boolean;
  botName?: string;
}

export default function QuestionModal({
  question,
  open = false,
  timeLimit = QUESTION_TIME_LIMIT,
  questionCost = QUESTION_COST,
  disabled = false,
  submitting = false,
  selectedAnswer = null,
  result = null,
  onAnswer,
  onTimeUp,
  onContinue,
  onClose,
  showTimer = true,
  showCost = true,
  allowClose = false,
  automated = false,
  botThinking = false,
  botName = "Bot",
}: QuestionModalProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [localSelection, setLocalSelection] = useState<number | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const effectiveSelection = selectedAnswer ?? localSelection;
  const answered = result != null;

  const interactionDisabled =
    disabled || automated || submitting || answered || hasTimedOut;

  const explanationRef = useRef<HTMLDivElement>(null);
  const questionPanelRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !question) return;

    setTimeLeft(timeLimit);
    setLocalSelection(null);
    setHasTimedOut(false);
  }, [question?.id, open, timeLimit]);

  // Scroll the explanation into view within the scrollable content area.
  useEffect(() => {
    if (!open || !question || !answered) return;

    const timeout = window.setTimeout(() => {
      const explanation = explanationRef.current;
      const content = contentRef.current;

      if (!explanation || !content) return;

      const explanationTop =
        explanation.getBoundingClientRect().top -
        content.getBoundingClientRect().top +
        content.scrollTop;

      content.scrollTo({
        top: Math.max(0, explanationTop - 12),
        behavior: "smooth",
      });
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [open, question?.id, answered, question?.explanation]);

  useEffect(() => {
    if (
      !open ||
      !question ||
      !showTimer ||
      disabled ||
      automated ||
      submitting ||
      answered ||
      hasTimedOut
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setHasTimedOut(true);
      onTimeUp?.();
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [
    open,
    question,
    showTimer,
    disabled,
    automated,
    submitting,
    answered,
    hasTimedOut,
    timeLeft,
    onTimeUp,
  ]);

  if (!open || !question) return null;

  const handleAnswer = (answerIndex: number) => {
    if (interactionDisabled || effectiveSelection !== null) return;

    setLocalSelection(answerIndex);
    onAnswer(answerIndex);
  };

  const isCorrectOption = (index: number) =>
    answered && result?.correctAnswer === index;

  const isSelectedWrongOption = (index: number) =>
    answered &&
    result?.selectedAnswer === index &&
    !result.isCorrect;

  const timerPercent = Math.max(
    0,
    Math.min(100, (timeLeft / Math.max(1, timeLimit)) * 100),
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950/80 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edu-ludo-question-title"
    >
      <section
        ref={questionPanelRef}
        className="my-auto flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[94dvh] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 px-4 py-4 text-white sm:px-7 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:h-11 sm:w-11 sm:rounded-2xl">
                {answered ? (
                  result?.isCorrect ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <XCircle size={24} />
                  )
                ) : (
                  <HelpCircle size={24} />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-100 sm:text-xs sm:tracking-[0.16em]">
                  Learnyfi Educational Ludo
                </p>

                <h2
                  id="edu-ludo-question-title"
                  className="mt-1 text-lg font-black leading-tight sm:text-2xl"
                >
                  {answered ? "Answer review" : "Answer to move"}
                </h2>

                <p className="mt-1 break-words text-xs capitalize text-indigo-100 sm:text-sm">
                  {question.subject} · {question.level} · {question.difficulty}
                </p>
              </div>
            </div>

            {allowClose && (
              <button
                type="button"
                onClick={() => onClose?.()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close question"
              >
                <XCircle size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable question and explanation */}
        <div
          ref={contentRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 [scrollbar-gutter:stable] sm:space-y-5 sm:p-7"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {automated && (
            <div
              className={[
                "flex items-start gap-3 rounded-2xl border p-3 sm:p-4",
                answered
                  ? result?.isCorrect
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-rose-200 bg-rose-50 text-rose-900"
                  : "border-violet-200 bg-violet-50 text-violet-900",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
                {answered ? (
                  result?.isCorrect ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <XCircle size={22} />
                  )
                ) : (
                  <Loader2
                    size={22}
                    className={botThinking ? "animate-spin" : ""}
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="font-extrabold">
                  {answered
                    ? `${botName} ${result?.isCorrect ? "answered correctly" : "answered incorrectly"}`
                    : `${botName} is thinking…`}
                </p>

                <p className="mt-1 text-sm">
                  {answered
                    ? "Review the selected answer and explanation below."
                    : "The bot will answer automatically."}
                </p>
              </div>
            </div>
          )}

          {/* Timer and question charge */}
          {(showTimer && !automated) || (showCost && !automated) ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {showTimer && !automated && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                      <Clock3 size={15} />
                      Time remaining
                    </span>

                    <span
                      className={[
                        "text-lg font-black tabular-nums",
                        timeLeft <= 5 ? "text-rose-600" : "text-slate-900",
                      ].join(" ")}
                    >
                      {timeLeft}s
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-300",
                        timeLeft <= 5 ? "bg-rose-500" : "bg-indigo-600",
                      ].join(" ")}
                      style={{ width: `${timerPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {showCost && !automated && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-bold uppercase text-amber-800">
                    Question charge
                  </p>

                  <p className="mt-1 text-lg font-black text-amber-950">
                    ₦{questionCost.toLocaleString("en-NG")}
                  </p>

                  <p className="text-xs leading-5 text-amber-800">
                    Charged when your question is presented.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Question */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
              Question
            </p>

            <p className="mt-2 whitespace-pre-wrap break-words text-base font-bold leading-7 text-slate-900 sm:text-lg">
              {question.content}
            </p>
          </div>

          {/* Answer options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = effectiveSelection === index;
              const isCorrect = isCorrectOption(index);
              const isWrong = isSelectedWrongOption(index);

              let optionStyle =
                "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50";

              if (isSelected && !answered) {
                optionStyle =
                  "border-indigo-500 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-100";
              }

              if (isCorrect) {
                optionStyle =
                  "border-emerald-500 bg-emerald-50 text-emerald-950";
              } else if (isWrong) {
                optionStyle = "border-rose-400 bg-rose-50 text-rose-950";
              }

              return (
                <button
                  key={`${question.id}-option-${index}`}
                  type="button"
                  onClick={() => handleAnswer(index)}
                  disabled={
                    interactionDisabled || effectiveSelection !== null
                  }
                  className={[
                    "flex min-h-14 w-full items-start gap-3 rounded-2xl border p-3 text-left transition sm:p-4",
                    optionStyle,
                    interactionDisabled ? "cursor-default" : "",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black",
                      isCorrect
                        ? "bg-emerald-600 text-white"
                        : isWrong
                          ? "bg-rose-600 text-white"
                          : isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="min-w-0 flex-1 break-words pt-1 text-sm font-semibold leading-6 sm:text-base">
                    {option}
                  </span>

                  {isCorrect && (
                    <CheckCircle2
                      size={20}
                      className="mt-1 shrink-0 text-emerald-600"
                    />
                  )}

                  {isWrong && (
                    <XCircle
                      size={20}
                      className="mt-1 shrink-0 text-rose-600"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer result and explanation */}
          {answered && (
            <div
              className={[
                "rounded-2xl border p-3 sm:p-4",
                result?.isCorrect
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-rose-300 bg-rose-50",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                {result?.isCorrect ? (
                  <CheckCircle2
                    size={22}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                ) : (
                  <XCircle
                    size={22}
                    className="mt-0.5 shrink-0 text-rose-600"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      "font-black",
                      result?.isCorrect ? "text-emerald-900" : "text-rose-900",
                    ].join(" ")}
                  >
                    {result?.isCorrect
                      ? "Correct answer!"
                      : result?.selectedAnswer === -1
                        ? "Time is up!"
                        : "Incorrect answer"}
                  </p>

                  {!result?.isCorrect && (
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      The correct option is highlighted above.
                    </p>
                  )}

                  {result?.isCorrect && (result.pointsAwarded ?? 0) > 0 && (
                    <p className="mt-1 text-sm font-bold text-emerald-800">
                      +{result.pointsAwarded} CBT points
                    </p>
                  )}

                  {question.explanation?.trim() ? (
                    <div
                      ref={explanationRef}
                      className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-slate-900 sm:p-4"
                    >
                      <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-indigo-700">
                        <Lightbulb size={18} className="shrink-0" />
                        Explanation
                      </p>

                      <p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium leading-7 text-slate-800 sm:text-base">
                        {question.explanation}
                      </p>
                    </div>
                  ) : (
                    <div
                      ref={explanationRef}
                      className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 sm:p-4"
                    >
                      <p className="font-bold">Explanation unavailable</p>
                      <p className="mt-1 text-sm leading-6">
                        No explanation was provided for this question.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {automated && !answered && (
            <p className="text-center text-xs leading-5 text-slate-500">
              <Loader2 size={13} className="mr-1 inline animate-spin" />
              The bot is answering automatically. You cannot select its
              answers.
            </p>
          )}

          {answered && automated && (
            <p className="text-center text-sm font-semibold text-slate-600">
              The bot will continue automatically after reviewing the answer.
            </p>
          )}
        </div>

        {/* Fixed-in-modal Continue footer: stays visible on mobile */}
        {answered && !automated && onContinue && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-7 sm:py-4">
            <button
              type="button"
              onClick={onContinue}
              className="flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-base font-extrabold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <Zap size={18} />
              Continue
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
