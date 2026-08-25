"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  Volume2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import QuestionOptions from "./QuestionOptions";

import {
  formatQuestion,
  type QuestionPart,
} from "@/lib/questions/questionFormatter";

import type { PracticeQuestion } from "@/stores/practiceStore";

/* ============================================================
   PROPS
   ============================================================ */

interface PracticeQuestionCardProps {
  question: PracticeQuestion;
  questionNumber: number;
  selectedAnswer?: string | null;
  onSelectAnswer: (answer: string) => void;
}


/* ============================================================
   RENDER QUESTION PART
   ============================================================ */

function renderQuestionPart(
  part: QuestionPart,
  index: number,
) {
  switch (part.type) {
    /* ========================================================
       NORMAL TEXT
       ======================================================== */

    case "text":
      return (
        <span key={index}>
          {part.content}
        </span>
      );

    /* ========================================================
       CLAUSE
       ======================================================== */

    case "clause":
      return (
        <span
          key={index}
          className="rounded-md bg-blue-50 px-1.5 py-0.5 font-bold text-blue-800"
          title={
            part.clauseType
              ? part.clauseType.replace(/-/g, " ")
              : "Clause"
          }
        >
          {part.content}
        </span>
      );

    /* ========================================================
       BLANK
       ======================================================== */

    case "blank":
      return (
        <span
          key={index}
          className="mx-1 inline-block min-w-[90px] border-b-2 border-slate-500 px-2 text-center font-bold text-slate-800"
        >
          {part.content || "____"}
        </span>
      );

    /* ========================================================
       PHRASE
       ======================================================== */

    case "phrase":
      return (
        <span
          key={index}
          className="rounded-md bg-amber-50 px-1.5 py-0.5 font-bold italic text-amber-800"
        >
          {part.content}
        </span>
      );

    /* ========================================================
       PASSAGE
       ======================================================== */

    case "passage":
      return (
        <span
          key={index}
          className="my-3 block rounded-xl border border-slate-200 bg-slate-50 p-4 font-normal leading-7 text-slate-700"
        >
          {part.content}
        </span>
      );

    /* ========================================================
       PARAGRAPH
       ======================================================== */

    case "paragraph":
      return (
        <span
          key={index}
          className="my-3 block whitespace-pre-wrap font-normal leading-7 text-slate-700"
        >
          {part.content}
        </span>
      );

    /* ========================================================
       SOUND / AUDIO
       ======================================================== */

    case "sound":
      return (
        <span
          key={index}
          className="my-3 inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 font-semibold text-purple-800"
        >
          <Volume2 className="h-5 w-5 shrink-0" />

          <span>
            {part.content || "Listen to the sound"}
          </span>
        </span>
      );

    /* ========================================================
       UNDERLINE
       ======================================================== */

    case "underline":
      return (
        <span
          key={index}
          className="font-bold underline decoration-2 underline-offset-4"
        >
          {part.content}
        </span>
      );
  }
}



/* ============================================================
   QUESTION TEXT
   ============================================================ */

function FormattedQuestionText({
  question,
}: {
  question: string;
}) {
  const formattedQuestion = useMemo(
    () => formatQuestion(question),
    [question],
  );

  /*
   * No special formatting.
   *
   * Keep the normal question rendering.
   */
  if (!formattedQuestion.hasFormatting) {
    return (
      <div className="whitespace-pre-wrap text-lg font-semibold leading-8 text-slate-900">
        {formattedQuestion.original}
      </div>
    );
  }

  /*
   * Clause questions have a special structure:
   *
   * Identify the type of clause in the sentence:
   *
   * I know that he is coming.
   */

  if (
    formattedQuestion.type ===
      "clause" &&
    formattedQuestion.sentence
  ) {
    return (
      <div>
        <p className="mb-4 text-lg font-semibold leading-8 text-slate-900">
          {formattedQuestion.instruction}
        </p>

        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 text-lg font-semibold leading-8 text-slate-900">
          {formattedQuestion.parts.map(
            (part, index) =>
              renderQuestionPart(
                part,
                index,
              ),
          )}
        </div>
      </div>
    );
  }

  /*
   * General formatted question.
   */

  return (
    <div className="whitespace-pre-wrap text-lg font-semibold leading-8 text-slate-900">
      {formattedQuestion.parts.map(
        (part, index) =>
          renderQuestionPart(
            part,
            index,
          ),
      )}
    </div>
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

export function PracticeQuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}: PracticeQuestionCardProps) {
  const [showAnswer, setShowAnswer] =
    useState(false);

  const [showExplanation, setShowExplanation] =
    useState(false);

  /* ============================================================
     QUESTION DATA
     ============================================================ */

  const questionData =
    question as PracticeQuestion & {
      answer?: string;
      correctAnswer?: string;
      correctAnswers?: string[];
      explanation?: string;
    };

  /* ============================================================
     CORRECT ANSWER
     ============================================================ */

  const correctAnswer =
    questionData.answer ??
    questionData.correctAnswer ??
    questionData.correctAnswers?.[0] ??
    null;

  /* ============================================================
     EXPLANATION
     ============================================================ */

  const explanation =
    questionData.explanation ?? null;

  /* ============================================================
     NORMALIZED ANSWERS
     ============================================================ */

  const normalizedCorrectAnswer =
    correctAnswer
      ?.trim()
      .toUpperCase() ?? null;

  const normalizedSelectedAnswer =
    selectedAnswer
      ?.trim()
      .toUpperCase() ?? null;

  const isCorrect =
    normalizedCorrectAnswer !== null &&
    normalizedSelectedAnswer !== null &&
    normalizedSelectedAnswer ===
      normalizedCorrectAnswer;

  /* ============================================================
     UI
     ============================================================ */

  return (
    <Card className="overflow-hidden">
      {/* ======================================================
          QUESTION HEADER
         ====================================================== */}

      <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* ==================================================
              QUESTION NUMBER + TYPE
             ================================================== */}

          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
              {questionNumber}
            </span>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Question
              </p>

              <p className="text-sm font-semibold capitalize text-slate-700">
                {question.questionType ===
                "mcq"
                  ? "Multiple Choice"
                  : question.questionType}
              </p>
            </div>
          </div>

          {/* ==================================================
              DIFFICULTY
             ================================================== */}

          {question.difficulty && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
              {question.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* ======================================================
          QUESTION CONTENT
         ====================================================== */}

      <div className="px-5 py-6 sm:px-8 sm:py-8">
        {/* ====================================================
            QUESTION
           ==================================================== */}

        <div className="mb-8">
          <FormattedQuestionText
            question={question.question}
          />
        </div>

        {/* ====================================================
            MEDIA
           ==================================================== */}

        {question.media && (
          <div className="mb-6">
            {/*
              Media rendering can be added here when
              the backend media structure is confirmed.
            */}
          </div>
        )}

        {/* ====================================================
            OPTIONS
           ==================================================== */}

        <QuestionOptions
          question={question}
          selectedAnswer={
            selectedAnswer ?? undefined
          }
          onSelectAnswer={
            onSelectAnswer
          }
        />

        {/* ====================================================
            ANSWER / EXPLANATION CONTROLS
           ==================================================== */}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* ==================================================
                SHOW ANSWER
               ================================================== */}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowAnswer(
                  (value) => !value,
                )
              }
              leftIcon={
                showAnswer ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )
              }
            >
              {showAnswer
                ? "Hide Answer"
                : "Show Answer"}
            </Button>

            {/* ==================================================
                SHOW EXPLANATION
               ================================================== */}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowExplanation(
                  (value) => !value,
                )
              }
              leftIcon={
                <Lightbulb className="h-4 w-4" />
              }
            >
              {showExplanation
                ? "Hide Explanation"
                : "Show Explanation"}
            </Button>
          </div>

          {/* ==================================================
              ANSWER
             ================================================== */}

          {showAnswer && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                {/* Icon */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                {/* Content */}

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-green-800">
                    Correct Answer
                  </p>

                  {correctAnswer ? (
                    <p className="mt-1 text-sm font-medium text-green-700">
                      {correctAnswer}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-green-700">
                      The correct answer is
                      not available for this
                      question.
                    </p>
                  )}

                  {/* ==================================================
                      STUDENT ANSWER
                     ================================================== */}

                  {selectedAnswer && (
                    <p
                      className={`mt-3 text-sm font-medium ${
                        isCorrect
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      Your answer:{" "}
                      {selectedAnswer}

                      {isCorrect
                        ? " ✓"
                        : " ✗"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              EXPLANATION
             ================================================== */}

          {showExplanation && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                {/* Icon */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>

                {/* Content */}

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-blue-900">
                    Explanation
                  </p>

                  {explanation ? (
                    <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-blue-800">
                      {explanation}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-blue-700">
                      No explanation is
                      available for this
                      question yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}










// "use client";

// import { useState } from "react";
// import {
//   CheckCircle2,
//   Eye,
//   EyeOff,
//   Lightbulb,
// } from "lucide-react";

// import { QuestionText } from "@/components/questions/QuestionText";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import QuestionOptions from "./QuestionOptions";

// import type { PracticeQuestion } from "@/stores/practiceStore";

// interface PracticeQuestionCardProps {
//   question: PracticeQuestion;
//   questionNumber: number;
//   selectedAnswer?: string | null;
//   onSelectAnswer: (answer: string) => void;
// }

// export function PracticeQuestionCard({
//   question,
//   questionNumber,
//   selectedAnswer,
//   onSelectAnswer,
// }: PracticeQuestionCardProps) {
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [showExplanation, setShowExplanation] =
//     useState(false);

//   /* ============================================================
//      QUESTION DATA
//      ============================================================ */

//   const questionData = question as PracticeQuestion & {
//     answer?: string;
//     correctAnswer?: string;
//     explanation?: string;
//   };

//   const correctAnswer =
//     questionData.answer ??
//     questionData.correctAnswer ??
//     null;

//   const explanation =
//     questionData.explanation ?? null;

//   /* ============================================================
//      NORMALIZED ANSWERS
//      ============================================================ */

//   const normalizedCorrectAnswer =
//     correctAnswer?.trim().toUpperCase() ?? null;

//   const normalizedSelectedAnswer =
//     selectedAnswer?.trim().toUpperCase() ?? null;

//   const isCorrect =
//     normalizedCorrectAnswer !== null &&
//     normalizedSelectedAnswer !== null &&
//     normalizedSelectedAnswer ===
//       normalizedCorrectAnswer;

//   /* ============================================================
//      UI
//      ============================================================ */

//   return (
//     <Card className="overflow-hidden">
//       {/* ======================================================
//           QUESTION HEADER
//           ====================================================== */}

//       <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
//         <div className="flex items-center justify-between gap-4">
//           {/* Question number + type */}

//           <div className="flex items-center gap-3">
//             <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
//               {questionNumber}
//             </span>

//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                 Question
//               </p>

//               <p className="text-sm font-semibold text-slate-700">
//                 {question.questionType === "mcq"
//                   ? "Multiple Choice"
//                   : question.questionType}
//               </p>
//             </div>
//           </div>

//           {/* Difficulty */}

//           <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
//             {question.difficulty}
//           </span>
//         </div>
//       </div>

//       {/* ======================================================
//           QUESTION CONTENT
//           ====================================================== */}

//       <div className="px-5 py-6 sm:px-8 sm:py-8">
//         {/* ====================================================
//             QUESTION
//             ==================================================== */}

//         <div className="mb-8">
//           <QuestionText question={question.question} />
//         </div>

//         {/* ====================================================
//             MEDIA
//             ==================================================== */}

//         {question.media && (
//           <div className="mb-6">
//             {/*
//               Media rendering can be added here once
//               the backend media structure is confirmed.
//             */}
//           </div>
//         )}

//         {/* ====================================================
//             OPTIONS
//             ==================================================== */}

//         <QuestionOptions
//           question={question}
//           selectedAnswer={selectedAnswer ?? undefined}
//           onSelectAnswer={onSelectAnswer}
//         />

//         {/* ====================================================
//             ANSWER / EXPLANATION CONTROLS
//             ==================================================== */}

//         <div className="mt-8 border-t border-slate-200 pt-6">
//           <div className="flex flex-col gap-3 sm:flex-row">
//             {/* ==================================================
//                 SHOW ANSWER
//                 ================================================== */}

//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 setShowAnswer(
//                   (value) => !value
//                 )
//               }
//               leftIcon={
//                 showAnswer ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )
//               }
//             >
//               {showAnswer
//                 ? "Hide Answer"
//                 : "Show Answer"}
//             </Button>

//             {/* ==================================================
//                 SHOW EXPLANATION
//                 ================================================== */}

//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 setShowExplanation(
//                   (value) => !value
//                 )
//               }
//               leftIcon={
//                 <Lightbulb className="h-4 w-4" />
//               }
//             >
//               {showExplanation
//                 ? "Hide Explanation"
//                 : "Show Explanation"}
//             </Button>
//           </div>

//           {/* ==================================================
//               ANSWER
//               ================================================== */}

//           {showAnswer && (
//             <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
//               <div className="flex items-start gap-3">
//                 {/* Icon */}

//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
//                   <CheckCircle2 className="h-5 w-5 text-green-600" />
//                 </div>

//                 {/* Content */}

//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-green-800">
//                     Correct Answer
//                   </p>

//                   {correctAnswer ? (
//                     <p className="mt-1 text-sm font-medium text-green-700">
//                       {correctAnswer}
//                     </p>
//                   ) : (
//                     <p className="mt-1 text-sm text-green-700">
//                       The correct answer is
//                       not available for this
//                       question.
//                     </p>
//                   )}

//                   {/* Student's answer */}

//                   {selectedAnswer && (
//                     <p
//                       className={`mt-3 text-sm font-medium ${
//                         isCorrect
//                           ? "text-green-700"
//                           : "text-red-700"
//                       }`}
//                     >
//                       Your answer:{" "}
//                       {selectedAnswer}

//                       {isCorrect
//                         ? " ✓"
//                         : " ✗"}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ==================================================
//               EXPLANATION
//               ================================================== */}

//           {showExplanation && (
//             <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
//               <div className="flex items-start gap-3">
//                 {/* Icon */}

//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
//                   <Lightbulb className="h-5 w-5 text-blue-600" />
//                 </div>

//                 {/* Content */}

//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-blue-900">
//                     Explanation
//                   </p>

//                   {explanation ? (
//                     <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-blue-800">
//                       {explanation}
//                     </div>
//                   ) : (
//                     <p className="mt-2 text-sm leading-6 text-blue-700">
//                       No explanation is
//                       available for this
//                       question yet.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// }