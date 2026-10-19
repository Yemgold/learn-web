
// "use client";

// import { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   Clock3,
//   HelpCircle,
//   Lightbulb,
//   Loader2,
//   X,
//   XCircle,
//   Zap,
// } from "lucide-react";

// import type {
//   EduLudoAnswerResult,
//   EduLudoQuestion,
// } from "./eduLudoTypes";

// import { QUESTION_COST, QUESTION_TIME_LIMIT } from "./eduLudoConstants";

// export interface QuestionModalProps {
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
// }

// function formatTime(seconds: number) {
//   const safeSeconds = Math.max(0, Math.ceil(seconds));
//   return `${Math.floor(safeSeconds / 60)}:${String(
//     safeSeconds % 60,
//   ).padStart(2, "0")}`;
// }

// export default function QuestionModal({
//   question,
//   open = true,
//   timeLimit = QUESTION_TIME_LIMIT,
//   questionCost = QUESTION_COST,
//   disabled = false,
//   submitting = false,
//   selectedAnswer = null,
//   result = null,
//   onAnswer,
//   onTimeUp,
//   onClose,
//   onContinue,
//   showTimer = true,
//   showCost = true,
//   allowClose = false,
// }: QuestionModalProps) {
//   const [timeLeft, setTimeLeft] = useState(timeLimit);
//   const [localSelection, setLocalSelection] = useState<number | null>(null);
//   const [hasTimedOut, setHasTimedOut] = useState(false);

//   const effectiveSelection =
//     selectedAnswer !== null ? selectedAnswer : localSelection;

//   const answered = result !== null;

//   useEffect(() => {
//     if (!open || !question) return;

//     setTimeLeft(timeLimit);
//     setLocalSelection(null);
//     setHasTimedOut(false);
//   }, [question?.id, open, timeLimit]);

//   useEffect(() => {
//     if (
//       !open ||
//       !question ||
//       !showTimer ||
//       answered ||
//       disabled ||
//       submitting ||
//       hasTimedOut
//     ) {
//       return;
//     }

//     if (timeLeft <= 0) {
//       setHasTimedOut(true);
//       onTimeUp?.();
//       return;
//     }

//     const timer = window.setTimeout(() => {
//       setTimeLeft((previous) => Math.max(0, previous - 1));
//     }, 1000);

//     return () => window.clearTimeout(timer);
//   }, [
//     open,
//     question,
//     showTimer,
//     answered,
//     disabled,
//     submitting,
//     hasTimedOut,
//     timeLeft,
//     onTimeUp,
//   ]);

//   if (!open || !question) return null;

//   const handleAnswer = (answerIndex: number) => {
//     if (
//       disabled ||
//       submitting ||
//       answered ||
//       hasTimedOut ||
//       effectiveSelection !== null
//     ) {
//       return;
//     }

//     setLocalSelection(answerIndex);
//     onAnswer(answerIndex);
//   };

//   const timerPercentage =
//     timeLimit > 0
//       ? Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100))
//       : 0;

//   const timerColor =
//     timeLeft <= 5
//       ? "text-red-600"
//       : timeLeft <= 10
//         ? "text-amber-600"
//         : "text-emerald-600";

//   const difficultyLabel = question.difficulty
//     ? question.difficulty.charAt(0).toUpperCase() +
//       question.difficulty.slice(1)
//     : null;

//   return (
//     <div
//       className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
//       role="presentation"
//       onMouseDown={(event) => {
//         if (
//           allowClose &&
//           event.target === event.currentTarget &&
//           !submitting
//         ) {
//           onClose?.();
//         }
//       }}
//     >
//       <section
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="edu-ludo-question-title"
//         className="my-auto max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/50 bg-white shadow-2xl"
//       >
//         <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 px-5 pb-5 pt-5 text-white sm:px-6">
//           <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
//           <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/5" />

//           <div className="relative flex items-start justify-between gap-3">
//             <div className="flex min-w-0 items-center gap-3">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
//                 <HelpCircle size={23} />
//               </div>

//               <div className="min-w-0">
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">
//                   Edu Ludo Challenge
//                 </p>
//                 <h2
//                   id="edu-ludo-question-title"
//                   className="mt-1 text-xl font-black sm:text-2xl"
//                 >
//                   {answered ? "Answer review" : "Answer to move"}
//                 </h2>
//               </div>
//             </div>

//             {allowClose && onClose && (
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={submitting}
//                 aria-label="Close question"
//                 className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white disabled:opacity-40"
//               >
//                 <X size={19} />
//               </button>
//             )}
//           </div>

//           <div className="relative mt-4 flex flex-wrap items-center gap-2">
//             <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold">
//               {question.subject}
//             </span>
//             <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold">
//               {question.level}
//             </span>
//             {difficultyLabel && (
//               <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold">
//                 {difficultyLabel}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="space-y-5 p-5 sm:p-6">
//           {(showTimer || showCost) && (
//             <div className="grid grid-cols-2 gap-3">
//               {showTimer && (
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                   <div className="flex items-center justify-between gap-2">
//                     <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
//                       <Clock3 size={14} />
//                       {answered ? "Time status" : "Time remaining"}
//                     </span>
//                     <span
//                       className={`text-sm font-extrabold tabular-nums ${timerColor}`}
//                     >
//                       {answered ? "Submitted" : formatTime(timeLeft)}
//                     </span>
//                   </div>

//                   <div
//                     className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
//                     role="progressbar"
//                     aria-label="Question time remaining"
//                     aria-valuemin={0}
//                     aria-valuemax={timeLimit}
//                     aria-valuenow={Math.min(timeLeft, timeLimit)}
//                   >
//                     <div
//                       className={[
//                         "h-full rounded-full transition-all duration-300",
//                         timeLeft <= 5
//                           ? "bg-red-500"
//                           : timeLeft <= 10
//                             ? "bg-amber-500"
//                             : "bg-emerald-500",
//                       ].join(" ")}
//                       style={{ width: `${timerPercentage}%` }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {showCost && (
//                 <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
//                   <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
//                     <Zap size={14} />
//                     Question charge
//                   </div>
//                   <p className="mt-1.5 text-lg font-black text-amber-900">
//                     ₦{questionCost.toLocaleString("en-NG")}
//                   </p>
//                   <p className="mt-0.5 text-[10px] leading-4 text-amber-800">
//                     Per presented question
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           <div>
//             <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
//               Question
//             </p>
//             <h3 className="text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
//               {question.content}
//             </h3>
//           </div>

//           <div className="space-y-2.5">
//             {question.options.map((option, index) => {
//               const isSelected = effectiveSelection === index;
//               const isCorrect = answered && result?.correctAnswer === index;
//               const isWrong =
//                 answered &&
//                 !result?.isCorrect &&
//                 result?.selectedAnswer === index;

//               let optionStyle =
//                 "border-slate-200 bg-white text-slate-800";

//               if (!answered && isSelected) {
//                 optionStyle =
//                   "border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-100";
//               }

//               if (answered && isCorrect) {
//                 optionStyle =
//                   "border-emerald-500 bg-emerald-50 text-emerald-900";
//               } else if (isWrong) {
//                 optionStyle = "border-red-400 bg-red-50 text-red-900";
//               }

//               return (
//                 <button
//                   key={`${question.id}-option-${index}`}
//                   type="button"
//                   onClick={() => handleAnswer(index)}
//                   disabled={
//                     disabled ||
//                     submitting ||
//                     answered ||
//                     hasTimedOut ||
//                     effectiveSelection !== null
//                   }
//                   className={[
//                     "flex min-h-[56px] w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
//                     optionStyle,
//                     !disabled &&
//                     !answered &&
//                     effectiveSelection === null &&
//                     !hasTimedOut
//                       ? "cursor-pointer hover:border-indigo-300 hover:bg-indigo-50"
//                       : "cursor-default",
//                   ].join(" ")}
//                 >
//                   <span
//                     className={[
//                       "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-extrabold",
//                       isCorrect
//                         ? "border-emerald-500 bg-emerald-500 text-white"
//                         : isWrong
//                           ? "border-red-500 bg-red-500 text-white"
//                           : isSelected
//                             ? "border-indigo-600 bg-indigo-600 text-white"
//                             : "border-slate-200 bg-slate-50 text-slate-600",
//                     ].join(" ")}
//                   >
//                     {String.fromCharCode(65 + index)}
//                   </span>

//                   <span className="min-w-0 flex-1 text-sm font-semibold leading-6">
//                     {option}
//                   </span>

//                   {isCorrect && (
//                     <CheckCircle2
//                       size={19}
//                       className="shrink-0 text-emerald-600"
//                     />
//                   )}
//                   {isWrong && (
//                     <XCircle
//                       size={19}
//                       className="shrink-0 text-red-600"
//                     />
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {submitting && (
//             <div className="flex items-center gap-2 rounded-xl bg-indigo-50 p-3 text-sm font-semibold text-indigo-700">
//               <Loader2 size={17} className="animate-spin" />
//               Checking your answer...
//             </div>
//           )}

//           {hasTimedOut && !answered && (
//             <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
//               <Clock3 size={20} className="mt-0.5 shrink-0 text-amber-700" />
//               <div>
//                 <p className="text-sm font-bold text-amber-900">Time is up</p>
//                 <p className="mt-1 text-sm leading-5 text-amber-800">
//                   Your turn is being resolved.
//                 </p>
//               </div>
//             </div>
//           )}

//           {answered && result && (
//             <div
//               className={[
//                 "rounded-2xl border p-4",
//                 result.isCorrect
//                   ? "border-emerald-200 bg-emerald-50"
//                   : "border-red-200 bg-red-50",
//               ].join(" ")}
//               role="status"
//               aria-live="polite"
//             >
//               <div className="flex items-start gap-3">
//                 {result.isCorrect ? (
//                   <CheckCircle2
//                     size={23}
//                     className="mt-0.5 shrink-0 text-emerald-600"
//                   />
//                 ) : (
//                   <XCircle
//                     size={23}
//                     className="mt-0.5 shrink-0 text-red-600"
//                   />
//                 )}

//                 <div className="min-w-0 flex-1">
//                   <p
//                     className={[
//                       "text-base font-extrabold",
//                       result.isCorrect ? "text-emerald-900" : "text-red-900",
//                     ].join(" ")}
//                   >
//                     {result.isCorrect ? "Correct answer!" : "Incorrect answer"}
//                   </p>

//                  <p className="mt-1 text-sm leading-5 text-slate-700">
//   Selected answer:{" "}
//   <strong>
//     {result.selectedAnswer !== null &&
//     result.selectedAnswer !== undefined &&
//     result.selectedAnswer >= 0
//       ? question.options[result.selectedAnswer] ?? "Not available"
//       : "No answer selected"}
//   </strong>
// </p>

//                   {!result.isCorrect && (
//                     <p className="mt-1 text-sm leading-5 text-emerald-800">
//                       Correct answer:{" "}
//                       <strong>
//                         {question.options[result.correctAnswer] ??
//                           "Not available"}
//                       </strong>
//                     </p>
//                   )}

//                   {result.explanation && (
//                     <div className="mt-3 flex items-start gap-2">
//                       <Lightbulb
//                         size={17}
//                         className="mt-0.5 shrink-0"
//                       />
//                       <p className="text-sm leading-6">
//                         {result.explanation}
//                       </p>
//                     </div>
//                   )}

//                   <p className="mt-3 text-sm font-bold">
//                     {result.pointsAwarded > 0
//                       ? `+${result.pointsAwarded} CBT points`
//                       : "No CBT points awarded for this answer"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-xs leading-5 text-slate-500">
//               {answered
//                 ? "Review the answer and explanation before continuing."
//                 : "Choose one answer to submit."}
//             </p>

//             {answered && onContinue && (
//               <button
//                 type="button"
//                 onClick={onContinue}
//                 className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
//               >
//                 Continue
//                 <CheckCircle2 size={17} />
//               </button>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


















"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!open || !question) return;

    setTimeLeft(timeLimit);
    setLocalSelection(null);
    setHasTimedOut(false);
  }, [question?.id, open, timeLimit]);

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
    if (
      interactionDisabled ||
      effectiveSelection !== null
    ) {
      return;
    }

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
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edu-ludo-question-title"
    >
      <section className="my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 px-5 py-5 text-white sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
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

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">
                  Learnyfi Educational Ludo
                </p>
                <h2
                  id="edu-ludo-question-title"
                  className="mt-1 text-xl font-black sm:text-2xl"
                >
                  {answered ? "Answer review" : "Answer to move"}
                </h2>
                <p className="mt-1 text-sm text-indigo-100">
                  {question.subject} · {question.level} · {question.difficulty}
                </p>
              </div>
            </div>

            {allowClose && (
  <button
    type="button"
    onClick={() => onClose?.()}
    className="rounded-xl p-2 text-white/90 transition hover:bg-white/15"
    aria-label="Close question"
  >
    <XCircle size={20} />
  </button>
)}
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          {automated && (
            <div
              className={[
                "flex items-center gap-3 rounded-2xl border p-4",
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

              <div>
                <p className="font-extrabold">
                  {answered
                    ? `${botName} ${result?.isCorrect ? "answered correctly" : "answered incorrectly"}`
                    : `${botName} is thinking…`}
                </p>
                <p className="mt-1 text-sm">
                  {answered
                    ? "Review the selected answer and explanation below."
                    : "Watch the bot consider the question. It will answer automatically."}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
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
                  ₦{questionCost}
                </p>
                <p className="text-xs text-amber-800">
                  Charged when your question is presented.
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
              Question
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base font-bold leading-7 text-slate-900 sm:text-lg">
              {question.content}
            </p>
          </div>

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
                optionStyle =
                  "border-rose-400 bg-rose-50 text-rose-950";
              }

              return (
                <button
                  key={`${question.id}-option-${index}`}
                  type="button"
                  onClick={() => handleAnswer(index)}
                  disabled={
                    interactionDisabled ||
                    effectiveSelection !== null
                  }
                  className={[
                    "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
                    optionStyle,
                    interactionDisabled ? "cursor-default" : "",
                    !interactionDisabled && effectiveSelection !== null
                      ? "cursor-default"
                      : "",
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

                  <span className="flex-1 pt-1 text-sm font-semibold leading-6 sm:text-base">
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

          {answered && (
            <div
              className={[
                "rounded-2xl border p-4",
                result?.isCorrect
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50",
              ].join(" ")}
              role="status"
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

                <div className="min-w-0">
                  <p
                    className={[
                      "font-black",
                      result?.isCorrect
                        ? "text-emerald-900"
                        : "text-rose-900",
                    ].join(" ")}
                  >
                    {result?.isCorrect
                      ? "Correct answer!"
                      : result?.selectedAnswer === -1
                        ? "Time is up!"
                        : "Not quite. The correct answer is highlighted."}
                  </p>

                  {result?.isCorrect && (result.pointsAwarded ?? 0) > 0 && (
                    <p className="mt-1 text-sm font-bold text-emerald-800">
                      +{result.pointsAwarded} CBT points
                    </p>
                  )}

                  {question.explanation && (
                    <div className="mt-3 border-t border-current/10 pt-3">
                      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
                        <Lightbulb size={15} />
                        Explanation
                      </p>
                      <p className="mt-1 text-sm leading-6">
                        {question.explanation}
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
              The bot is answering automatically. You cannot select its answers.
            </p>
          )}

          {answered && automated && (
            <p className="text-center text-sm font-semibold text-slate-500">
              The bot will continue automatically after reviewing the answer.
            </p>
          )}

          {answered && !automated && onContinue && (
            <button
              type="button"
              onClick={onContinue}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-700"
            >
              <Zap size={17} />
              Continue
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
