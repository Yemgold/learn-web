






"use client";

import { formatQuestion } from "@/lib/questions/questionFormatter";

interface QuestionTextProps {
  question: string;
}

export function QuestionText({
  question,
}: QuestionTextProps) {
  const formatted =
    formatQuestion(question);

  /*
   * Normal question
   */
  if (
    !formatted.sentence ||
    !formatted.highlightedText
  ) {
    return (
      <p className="text-lg font-semibold leading-8 text-slate-900 sm:text-xl sm:leading-9">
        {formatted.instruction}
      </p>
    );
  }

  /*
   * Find highlighted text inside sentence
   */
  const index =
    formatted.sentence.indexOf(
      formatted.highlightedText,
    );

  /*
   * Safety fallback
   */
  if (index === -1) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold leading-8 text-slate-900 sm:text-xl sm:leading-9">
          {formatted.instruction}
        </p>

        <p className="text-lg leading-8 text-slate-900">
          {formatted.sentence}
        </p>
      </div>
    );
  }

  const before =
    formatted.sentence.slice(
      0,
      index,
    );

  const highlighted =
    formatted.sentence.slice(
      index,
      index +
        formatted.highlightedText.length,
    );

  const after =
    formatted.sentence.slice(
      index +
        formatted.highlightedText.length,
    );

  return (
    <div className="space-y-5">
      {/* Instruction */}

      <p className="text-lg font-semibold leading-8 text-slate-900 sm:text-xl sm:leading-9">
        {formatted.instruction}
      </p>

      {/* Sentence */}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-lg leading-8 text-slate-900 sm:text-xl sm:leading-9">
          {before}

          <span className="rounded-md bg-yellow-200 px-1.5 py-0.5 font-bold text-slate-900">
            {highlighted}
          </span>

          {after}
        </p>
      </div>
    </div>
  );
}