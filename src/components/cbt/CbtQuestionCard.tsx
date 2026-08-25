"use client";

import { Flag } from "lucide-react";

import type {
  CbtQuestion,
} from "@/stores/cbtStore";

import {
  formatQuestion,
  type QuestionPart,
} from "@/lib/questions/questionFormatter";

export interface CbtQuestionCardProps {
  question: CbtQuestion;
  questionNumber: number;
  selectedAnswer?: string | null;
  onSelectAnswer: (
    answer: string,
  ) => void;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
}

/* ============================================================
   QUESTION PART RENDERER
   ============================================================ */

function renderQuestionPart(
  part: QuestionPart,
  index: number,
) {
  switch (part.type) {
    /* --------------------------------------------------------
       NORMAL TEXT
       -------------------------------------------------------- */

    case "text":
      return (
        <span key={index}>
          {part.content}
        </span>
      );

    /* --------------------------------------------------------
       UNDERLINE
       -------------------------------------------------------- */

    case "underline":
      return (
        <span
          key={index}
          className="underline decoration-2 underline-offset-4"
        >
          {part.content}
        </span>
      );

    /* --------------------------------------------------------
       CLAUSE
       -------------------------------------------------------- */

    case "clause":
      return (
        <span
          key={index}
          className="font-bold text-blue-700"
        >
          {part.content}
        </span>
      );

    /* --------------------------------------------------------
       BLANK
       -------------------------------------------------------- */

    case "blank":
      return (
        <span
          key={index}
          className="mx-1 inline-block min-w-[90px] border-b-2 border-slate-700 px-2 text-center"
        >
          {part.content || "_____"}
        </span>
      );

    /* --------------------------------------------------------
       PHRASE
       -------------------------------------------------------- */

    case "phrase":
      return (
        <span
          key={index}
          className="font-semibold text-purple-700"
        >
          {part.content}
        </span>
      );

    /* --------------------------------------------------------
       PASSAGE
       -------------------------------------------------------- */

    case "passage":
      return (
        <div
          key={index}
          className="my-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base font-normal leading-7 text-slate-700"
        >
          {part.content}
        </div>
      );

    /* --------------------------------------------------------
       PARAGRAPH
       -------------------------------------------------------- */

    case "paragraph":
      return (
        <p
          key={index}
          className="my-3 font-normal leading-7 text-slate-700"
        >
          {part.content}
        </p>
      );

    /* --------------------------------------------------------
       SOUND / AUDIO
       -------------------------------------------------------- */

    case "sound":
      return (
        <div
          key={index}
          className="my-4 rounded-xl border border-blue-200 bg-blue-50 p-4 font-normal text-blue-800"
        >
          🔊 {part.content}
        </div>
      );

    default:
      return null;
  }
}

/* ============================================================
   CBT QUESTION CARD
   ============================================================ */

export default function CbtQuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  isFlagged = false,
  onToggleFlag,
}: CbtQuestionCardProps) {
  /* ==========================================================
     FORMAT QUESTION
     ========================================================== */

  const formattedQuestion = formatQuestion(
    question.question,
  );

  return (
    <article>
      {/* ======================================================
          QUESTION
         ====================================================== */}

      <div className="mb-8">
        {/* ====================================================
            QUESTION HEADER
           ==================================================== */}

        <div className="mb-4 flex items-start justify-between gap-4">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            Question {questionNumber}
          </span>

          {onToggleFlag && (
            <button
              type="button"
              onClick={onToggleFlag}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                isFlagged
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Flag className="h-4 w-4" />

              {isFlagged
                ? "Flagged"
                : "Flag"}
            </button>
          )}
        </div>

        {/* ====================================================
            FORMATTED QUESTION
           ==================================================== */}

        <div className="text-lg font-semibold leading-8 text-slate-900">
          {formattedQuestion.parts.length > 0 ? (
            formattedQuestion.parts.map(
              renderQuestionPart,
            )
          ) : (
            <span>
              {question.question}
            </span>
          )}
        </div>
      </div>

      {/* ======================================================
          OPTIONS
         ====================================================== */}

      <div className="space-y-3">
        {question.options.map(
          (option) => {
            const isSelected =
              selectedAnswer ===
              option.value;

            return (
              <button
                key={`${question._id}-${option.label}`}
                type="button"
                onClick={() =>
                  onSelectAnswer(
                    option.value,
                  )
                }
                className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                {/* OPTION LABEL */}

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-bold ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {option.label}
                </span>

                {/* OPTION VALUE */}

                <span className="pt-1 text-base leading-6 text-slate-800">
                  {option.value}
                </span>
              </button>
            );
          },
        )}
      </div>
    </article>
  );
}









// "use client";

// import { Flag } from "lucide-react";

// import type {
//   CbtQuestion,
// } from "@/stores/cbtStore";

// export interface CbtQuestionCardProps {
//   question: CbtQuestion;
//   questionNumber: number;
//   selectedAnswer?: string | null;
//   onSelectAnswer: (
//     answer: string,
//   ) => void;
//   isFlagged?: boolean;
//   onToggleFlag?: () => void;
// }

// export default function CbtQuestionCard({
//   question,
//   questionNumber,
//   selectedAnswer,
//   onSelectAnswer,
//   isFlagged = false,
//   onToggleFlag,
// }: CbtQuestionCardProps) {
//   return (
//     <article>
//       {/* Question */}
//       <div className="mb-8">
//         <div className="mb-4 flex items-start justify-between gap-4">
//           <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
//             Question {questionNumber}
//           </span>

//           {onToggleFlag && (
//             <button
//               type="button"
//               onClick={onToggleFlag}
//               className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
//                 isFlagged
//                   ? "border-orange-300 bg-orange-50 text-orange-700"
//                   : "border-slate-200 text-slate-600 hover:bg-slate-50"
//               }`}
//             >
//               <Flag className="h-4 w-4" />

//               {isFlagged
//                 ? "Flagged"
//                 : "Flag"}
//             </button>
//           )}
//         </div>

//         <div className="whitespace-pre-wrap text-lg font-semibold leading-8 text-slate-900">
//           {question.question}
//         </div>
//       </div>

//       {/* Options */}
//       <div className="space-y-3">
//         {question.options.map(
//           (option) => {
//             const isSelected =
//               selectedAnswer ===
//               option.value;

//             return (
//               <button
//                 key={`${question._id}-${option.label}`}
//                 type="button"
//                 onClick={() =>
//                   onSelectAnswer(
//                     option.value,
//                   )
//                 }
//                 className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
//                   isSelected
//                     ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
//                 }`}
//               >
//                 <span
//                   className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-bold ${
//                     isSelected
//                       ? "border-blue-600 bg-blue-600 text-white"
//                       : "border-slate-300 bg-white text-slate-700"
//                   }`}
//                 >
//                   {option.label}
//                 </span>

//                 <span className="pt-1 text-base leading-6 text-slate-800">
//                   {option.value}
//                 </span>
//               </button>
//             );
//           },
//         )}
//       </div>
//     </article>
//   );
// }