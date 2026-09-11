// "use client";

// import { Flag } from "lucide-react";

// import type {
//   CbtQuestion,
// } from "@/stores/cbtStore";

// import {
//   formatQuestion,
//   type QuestionPart,
// } from "@/lib/questions/questionFormatter";

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

// /* ============================================================
//    QUESTION PART RENDERER
//    ============================================================ */

// function renderQuestionPart(
//   part: QuestionPart,
//   index: number,
// ) {
//   switch (part.type) {
//     /* --------------------------------------------------------
//        NORMAL TEXT
//        -------------------------------------------------------- */

//     case "text":
//       return (
//         <span key={index}>
//           {part.content}
//         </span>
//       );

//     /* --------------------------------------------------------
//        UNDERLINE
//        -------------------------------------------------------- */

//     case "underline":
//       return (
//         <span
//           key={index}
//           className="underline decoration-2 underline-offset-4"
//         >
//           {part.content}
//         </span>
//       );

//     /* --------------------------------------------------------
//        CLAUSE
//        -------------------------------------------------------- */

//     case "clause":
//       return (
//         <span
//           key={index}
//           className="font-bold text-blue-700"
//         >
//           {part.content}
//         </span>
//       );

//     /* --------------------------------------------------------
//        BLANK
//        -------------------------------------------------------- */

//     case "blank":
//       return (
//         <span
//           key={index}
//           className="mx-1 inline-block min-w-[90px] border-b-2 border-slate-700 px-2 text-center"
//         >
//           {part.content || "_____"}
//         </span>
//       );

//     /* --------------------------------------------------------
//        PHRASE
//        -------------------------------------------------------- */

//     case "phrase":
//       return (
//         <span
//           key={index}
//           className="font-semibold text-purple-700"
//         >
//           {part.content}
//         </span>
//       );

//     /* --------------------------------------------------------
//        PASSAGE
//        -------------------------------------------------------- */

//     case "passage":
//       return (
//         <div
//           key={index}
//           className="my-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base font-normal leading-7 text-slate-700"
//         >
//           {part.content}
//         </div>
//       );

//     /* --------------------------------------------------------
//        PARAGRAPH
//        -------------------------------------------------------- */

//     case "paragraph":
//       return (
//         <p
//           key={index}
//           className="my-3 font-normal leading-7 text-slate-700"
//         >
//           {part.content}
//         </p>
//       );

//     /* --------------------------------------------------------
//        SOUND / AUDIO
//        -------------------------------------------------------- */

//     case "sound":
//       return (
//         <div
//           key={index}
//           className="my-4 rounded-xl border border-blue-200 bg-blue-50 p-4 font-normal text-blue-800"
//         >
//           🔊 {part.content}
//         </div>
//       );

//     default:
//       return null;
//   }
// }

// /* ============================================================
//    CBT QUESTION CARD
//    ============================================================ */

// export default function CbtQuestionCard({
//   question,
//   questionNumber,
//   selectedAnswer,
//   onSelectAnswer,
//   isFlagged = false,
//   onToggleFlag,
// }: CbtQuestionCardProps) {
//   /* ==========================================================
//      FORMAT QUESTION
//      ========================================================== */

//   const formattedQuestion = formatQuestion(
//     question.question,
//   );

//   return (
//     <article>
//       {/* ======================================================
//           QUESTION
//          ====================================================== */}

//       <div className="mb-8">
//         {/* ====================================================
//             QUESTION HEADER
//            ==================================================== */}

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

//         {/* ====================================================
//             FORMATTED QUESTION
//            ==================================================== */}

//         <div className="text-lg font-semibold leading-8 text-slate-900">
//           {formattedQuestion.parts.length > 0 ? (
//             formattedQuestion.parts.map(
//               renderQuestionPart,
//             )
//           ) : (
//             <span>
//               {question.question}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* ======================================================
//           OPTIONS
//          ====================================================== */}

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
//                 {/* OPTION LABEL */}

//                 <span
//                   className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-bold ${
//                     isSelected
//                       ? "border-blue-600 bg-blue-600 text-white"
//                       : "border-slate-300 bg-white text-slate-700"
//                   }`}
//                 >
//                   {option.label}
//                 </span>

//                 {/* OPTION VALUE */}

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











"use client";

import { Flag } from "lucide-react";

import type { CbtQuestion } from "@/stores/cbtStore";

import {
  formatQuestion,
  type QuestionPart,
} from "@/lib/questions/questionFormatter";

export interface CbtQuestionCardProps {
  question: CbtQuestion;
  questionNumber: number;
  selectedAnswer?: string | null;
  onSelectAnswer: (answer: string) => void;
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
          className="underline decoration-2 underline-offset-4 decoration-white/70"
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
          className="font-bold text-blue-300"
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
          className="mx-1 inline-block min-w-[90px] border-b-2 border-white/50 px-2 text-center"
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
          className="font-semibold text-purple-300"
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
          className="my-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-[15px] font-normal leading-7 text-white/75"
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
          className="my-4 font-normal leading-7 text-white/75"
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
          className="my-5 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 font-normal text-blue-200"
        >
          <span className="mr-2">🔊</span>
          {part.content}
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
    <article
      className="
        rounded-3xl
        border border-white/10
        bg-white/[0.035]
        p-5
        shadow-2xl shadow-black/20
        backdrop-blur-sm
        sm:p-7
        lg:p-8
      "
    >
      {/* ======================================================
          QUESTION HEADER
         ====================================================== */}

      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="
              inline-flex
              shrink-0
              items-center
              rounded-full
              border border-blue-400/20
              bg-blue-500/10
              px-3
              py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-blue-300
              sm:text-sm
            "
          >
            Question {questionNumber}
          </span>
        </div>

        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            aria-label={
              isFlagged
                ? "Remove question flag"
                : "Flag question"
            }
            className={`
              inline-flex
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              px-3
              py-2
              text-sm
              font-medium
              transition
              duration-200
              ${
                isFlagged
                  ? `
                    border-amber-400/30
                    bg-amber-500/10
                    text-amber-300
                    hover:bg-amber-500/15
                  `
                  : `
                    border-white/10
                    bg-white/[0.03]
                    text-white/60
                    hover:border-white/20
                    hover:bg-white/[0.06]
                    hover:text-white
                  `
              }
            `}
          >
            <Flag
              className={`h-4 w-4 ${
                isFlagged
                  ? "fill-current"
                  : ""
              }`}
            />

            <span className="hidden sm:inline">
              {isFlagged ? "Flagged" : "Flag"}
            </span>
          </button>
        )}
      </div>

      {/* ======================================================
          QUESTION TEXT
         ====================================================== */}

      <div
        className="
          mb-8
          max-w-4xl
          text-[17px]
          font-semibold
          leading-8
          tracking-[-0.01em]
          text-white
          sm:text-lg
          sm:leading-8
          lg:text-xl
          lg:leading-9
        "
      >
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

      {/* ======================================================
          OPTIONS HEADER
         ====================================================== */}

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">
          Select an answer
        </span>

        {selectedAnswer && (
          <span className="text-xs font-medium text-emerald-300">
            Answer selected
          </span>
        )}
      </div>

      {/* ======================================================
          OPTIONS
         ====================================================== */}

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected =
            selectedAnswer === option.value;

          return (
            <button
              key={`${question._id}-${option.label}`}
              type="button"
              onClick={() =>
                onSelectAnswer(option.value)
              }
              className={`
                group
                flex
                w-full
                items-start
                gap-4
                rounded-2xl
                border
                p-4
                text-left
                transition-all
                duration-200
                sm:p-5
                ${
                  isSelected
                    ? `
                      border-blue-400/50
                      bg-blue-500/15
                      shadow-lg
                      shadow-blue-950/20
                      ring-1
                      ring-blue-400/20
                    `
                    : `
                      border-white/10
                      bg-white/[0.025]
                      hover:border-blue-400/30
                      hover:bg-white/[0.06]
                    `
                }
              `}
            >
              {/* OPTION LABEL */}

              <span
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  text-sm
                  font-bold
                  transition-all
                  duration-200
                  ${
                    isSelected
                      ? `
                        border-blue-400
                        bg-blue-600
                        text-white
                        shadow-md
                        shadow-blue-950/30
                      `
                      : `
                        border-white/15
                        bg-white/[0.04]
                        text-white/70
                        group-hover:border-blue-400/40
                        group-hover:bg-blue-500/10
                        group-hover:text-blue-200
                      `
                  }
                `}
              >
                {option.label}
              </span>

              {/* OPTION VALUE */}

              <span
                className={`
                  min-w-0
                  flex-1
                  pt-1.5
                  text-[15px]
                  leading-7
                  transition-colors
                  sm:text-base
                  ${
                    isSelected
                      ? "text-white"
                      : "text-white/75 group-hover:text-white"
                  }
                `}
              >
                {option.value}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}