






// "use client";

// import {
//   Check,
//   Circle,
//   Lock,
// } from "lucide-react";

// export interface ContestantAnswerOption {
//   label?: string;
//   value: string;
// }

// export interface ContestantAnswerOptionsProps {
//   options: ContestantAnswerOption[];

//   selectedAnswer?: string | null;
//   submittedAnswer?: string | null;

//   answerSubmitted?: boolean;
//   questionLocked?: boolean;
//   disabled?: boolean;

//   onSelect: (value: string) => void;

//   title?: string;
//   compact?: boolean;
// }

// export default function ContestantAnswerOptions({
//   options,
//   selectedAnswer = null,
//   submittedAnswer = null,
//   answerSubmitted = false,
//   questionLocked = false,
//   disabled = false,
//   onSelect,
//   title = "Choose your answer",
//   compact = false,
// }: ContestantAnswerOptionsProps) {
//   const safeOptions = Array.isArray(options)
//     ? options.filter(
//         (option): option is ContestantAnswerOption =>
//           Boolean(option) &&
//           typeof option === "object" &&
//           typeof option.value === "string" &&
//           option.value.trim().length > 0,
//       )
//     : [];

//   /*
//    * IMPORTANT:
//    *
//    * selectedAnswer !== null means the contestant has already
//    * selected an answer for the current question.
//    *
//    * This immediately locks ALL options locally.
//    *
//    * We intentionally do NOT set questionLocked here because
//    * questionLocked represents the actual quiz/server question
//    * lock and is separate from the contestant's local selection.
//    */
//   const hasSelectedAnswer =
//     typeof selectedAnswer === "string" &&
//     selectedAnswer.trim().length > 0;

//   const isDisabled =
//     disabled ||
//     questionLocked ||
//     answerSubmitted ||
//     hasSelectedAnswer;

//   return (
//     <section
//       className={[
//         "rounded-2xl border border-white/10 bg-slate-950/70",
//         "shadow-xl shadow-black/10 backdrop-blur",
//         compact ? "p-4" : "p-5 sm:p-6",
//       ].join(" ")}
//     >
//       <div className="mb-4 flex items-center justify-between gap-3">
//         <div>
//           <h3 className="text-sm font-semibold text-white sm:text-base">
//             {title}
//           </h3>

//           {!answerSubmitted &&
//             !questionLocked &&
//             !hasSelectedAnswer && (
//               <p className="mt-1 text-xs text-slate-400">
//                 Select an option.
//               </p>
//             )}

//           {hasSelectedAnswer && !answerSubmitted && !questionLocked && (
//             <p className="mt-1 text-xs text-cyan-400">
//               Answer selected.
//             </p>
//           )}

//           {answerSubmitted && (
//             <p className="mt-1 text-xs text-emerald-400">
//               Your answer has been submitted.
//             </p>
//           )}

//           {questionLocked && !answerSubmitted && (
//             <p className="mt-1 text-xs text-amber-400">
//               This question is locked.
//             </p>
//           )}
//         </div>

//         {questionLocked && (
//           <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300">
//             <Lock className="h-3.5 w-3.5" />
//             Locked
//           </div>
//         )}
//       </div>

//       {safeOptions.length === 0 ? (
//         <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300">
//           No answer options are currently available.
//         </div>
//       ) : (
//         <div className="grid gap-3">
//           {safeOptions.map((option, index) => {
//             const label =
//               typeof option.label === "string" &&
//               option.label.trim().length > 0
//                 ? option.label.trim()
//                 : String.fromCharCode(65 + index);

//             const isSelected =
//               selectedAnswer === option.value;

//             const isSubmitted =
//               submittedAnswer === option.value;

//             const optionDisabled =
//               isDisabled;

//             return (
//               <button
//                 key={`${option.value}-${index}`}
//                 type="button"
//                 disabled={optionDisabled}
//                 onClick={() => {
//                   if (optionDisabled) return;

//                   onSelect(option.value);
//                 }}
//                 className={[
//                   "group relative w-full rounded-2xl border text-left",
//                   "transition-all duration-200",
//                   "focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
//                   compact
//                     ? "px-3.5 py-3"
//                     : "px-4 py-4 sm:px-5 sm:py-4",

//                   isSubmitted
//                     ? "border-emerald-400/60 bg-emerald-400/10"
//                     : isSelected
//                       ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/5"
//                       : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",

//                   optionDisabled
//                     ? "cursor-not-allowed opacity-80"
//                     : "cursor-pointer",
//                 ].join(" ")}
//                 aria-pressed={isSelected}
//               >
//                 <div className="flex items-center gap-3">
//                   {/* Option label */}
//                   <span
//                     className={[
//                       "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
//                       "border text-sm font-bold transition-colors",

//                       isSubmitted
//                         ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
//                         : isSelected
//                           ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
//                           : "border-white/10 bg-white/[0.03] text-slate-300 group-hover:border-white/20",
//                     ].join(" ")}
//                   >
//                     {isSubmitted ? (
//                       <Check className="h-4 w-4" />
//                     ) : (
//                       label
//                     )}
//                   </span>

//                   {/* Option text */}
//                   <span className="min-w-0 flex-1">
//                     <span
//                       className={[
//                         "block text-sm font-medium leading-6 sm:text-base",
//                         isSelected || isSubmitted
//                           ? "text-white"
//                           : "text-slate-200",
//                       ].join(" ")}
//                     >
//                       {option.value}
//                     </span>
//                   </span>

//                   {/* Selection indicator */}
//                   <span
//                     className={[
//                       "shrink-0",
//                       isSelected || isSubmitted
//                         ? "text-cyan-300"
//                         : "text-slate-600",
//                     ].join(" ")}
//                   >
//                     {isSelected || isSubmitted ? (
//                       <Check className="h-5 w-5" />
//                     ) : (
//                       <Circle className="h-5 w-5" />
//                     )}
//                   </span>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }








"use client";

import {
  Check,
  Circle,
  Lock,
} from "lucide-react";

export interface ContestantAnswerOption {
  /**
   * Backend option ID.
   *
   * Example:
   * "6aa00de4b180c475fe319741"
   */
  id: string;

  /**
   * Display label.
   *
   * Example:
   * "A"
   */
  label?: string;

  /**
   * Displayed answer text.
   *
   * Example:
   * "Taxonomy"
   */
  value: string;
}

export interface ContestantAnswerOptionsProps {
  options: ContestantAnswerOption[];

  /**
   * Stores the backend option ID of the selected answer.
   *
   * Example:
   * "6aa00de4b180c475fe319741"
   */
  selectedAnswer?: string | null;

  /**
   * Stores the backend option ID of the submitted answer.
   */
  submittedAnswer?: string | null;

  answerSubmitted?: boolean;
  questionLocked?: boolean;
  disabled?: boolean;

  /**
   * Returns the BACKEND OPTION ID.
   *
   * Example:
   * "6aa00de4b180c475fe319741"
   */
  onSelect: (optionId: string) => void;

  title?: string;
  compact?: boolean;
}

export default function ContestantAnswerOptions({
  options,
  selectedAnswer = null,
  submittedAnswer = null,
  answerSubmitted = false,
  questionLocked = false,
  disabled = false,
  onSelect,
  title = "Choose your answer",
  compact = false,
}: ContestantAnswerOptionsProps) {
  const safeOptions = Array.isArray(options)
    ? options.filter(
        (
          option,
        ): option is ContestantAnswerOption =>
          Boolean(option) &&
          typeof option === "object" &&
          typeof option.id === "string" &&
          option.id.trim().length > 0 &&
          typeof option.value === "string" &&
          option.value.trim().length > 0,
      )
    : [];

  /*
   * IMPORTANT:
   *
   * selectedAnswer !== null means the contestant has already
   * selected an answer for the current question.
   *
   * This immediately locks ALL options locally.
   *
   * We intentionally do NOT set questionLocked here because
   * questionLocked represents the actual quiz/server question
   * lock and is separate from the contestant's local selection.
   */
  const hasSelectedAnswer =
    typeof selectedAnswer === "string" &&
    selectedAnswer.trim().length > 0;

  const isDisabled =
    disabled ||
    questionLocked ||
    answerSubmitted ||
    hasSelectedAnswer;

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70",
        "shadow-xl shadow-black/10 backdrop-blur",
        compact ? "p-4" : "p-5 sm:p-6",
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white sm:text-base">
            {title}
          </h3>

          {!answerSubmitted &&
            !questionLocked &&
            !hasSelectedAnswer && (
              <p className="mt-1 text-xs text-slate-400">
                Select an option.
              </p>
            )}

          {hasSelectedAnswer &&
            !answerSubmitted &&
            !questionLocked && (
              <p className="mt-1 text-xs text-cyan-400">
                Answer selected.
              </p>
            )}

          {answerSubmitted && (
            <p className="mt-1 text-xs text-emerald-400">
              Your answer has been submitted.
            </p>
          )}

          {questionLocked && !answerSubmitted && (
            <p className="mt-1 text-xs text-amber-400">
              This question is locked.
            </p>
          )}
        </div>

        {questionLocked && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300">
            <Lock className="h-3.5 w-3.5" />
            Locked
          </div>
        )}
      </div>

      {safeOptions.length === 0 ? (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300">
          No answer options are currently available.
        </div>
      ) : (
        <div className="grid gap-3">
          {safeOptions.map((option, index) => {
            const label =
              typeof option.label === "string" &&
              option.label.trim().length > 0
                ? option.label.trim()
                : String.fromCharCode(65 + index);

            /*
             * IMPORTANT:
             *
             * selectedAnswer now contains the BACKEND OPTION ID,
             * not the displayed answer text.
             */
            const isSelected =
              selectedAnswer === option.id;

            /*
             * submittedAnswer also contains the BACKEND OPTION ID.
             */
            const isSubmitted =
              submittedAnswer === option.id;

            /*
             * Keep the existing local locking behavior.
             *
             * Once selectedAnswer is set, ALL buttons become
             * disabled immediately.
             */
            const optionDisabled =
              isDisabled;

            return (
              <button
                key={`${option.id}-${index}`}
                type="button"
                disabled={optionDisabled}
                onClick={() => {
                  if (optionDisabled) {
                    return;
                  }

                  /*
                   * IMPORTANT:
                   *
                   * Display:
                   *   Taxonomy
                   *
                   * Submit:
                   *   6aa00de4b180c475fe319741
                   */
                  onSelect(option.id);
                }}
                className={[
                  "group relative w-full rounded-2xl border text-left",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
                  compact
                    ? "px-3.5 py-3"
                    : "px-4 py-4 sm:px-5 sm:py-4",

                  isSubmitted
                    ? "border-emerald-400/60 bg-emerald-400/10"
                    : isSelected
                      ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/5"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",

                  optionDisabled
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-pointer",
                ].join(" ")}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-3">
                  {/* Option label */}
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      "border text-sm font-bold transition-colors",

                      isSubmitted
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : isSelected
                          ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                          : "border-white/10 bg-white/[0.03] text-slate-300 group-hover:border-white/20",
                    ].join(" ")}
                  >
                    {isSubmitted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      label
                    )}
                  </span>

                  {/* Option text */}
                  <span className="min-w-0 flex-1">
                    <span
                      className={[
                        "block text-sm font-medium leading-6 sm:text-base",
                        isSelected || isSubmitted
                          ? "text-white"
                          : "text-slate-200",
                      ].join(" ")}
                    >
                      {option.value}
                    </span>
                  </span>

                  {/* Selection indicator */}
                  <span
                    className={[
                      "shrink-0",
                      isSelected || isSubmitted
                        ? "text-cyan-300"
                        : "text-slate-600",
                    ].join(" ")}
                  >
                    {isSelected || isSubmitted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}



