


"use client";

import {
  BookOpen,
  CalendarDays,
  Eye,
  FileQuestion,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  SchoolQuestion,
  QuestionDifficulty,
} from "@/types/schools/question-bank.types";

import QuestionStatusBadge from "./QuestionStatusBadge";

interface QuestionBankCardProps {
  question: SchoolQuestion;
  onView: (question: SchoolQuestion) => void;
  onEdit: (question: SchoolQuestion) => void;
  onDelete: (question: SchoolQuestion) => void;
  showAnswers?: boolean;
}

const difficultyStyles: Record<QuestionDifficulty, string> = {
  EASY: "bg-green-50 text-green-700 border-green-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HARD: "bg-red-50 text-red-700 border-red-200",
};

function getName(
  value:
    | string
    | { _id?: string; subjectName?: string; className?: string }
    | undefined,
  fallback: string
) {
  if (!value) return fallback;

  if (typeof value === "string") return fallback;

  return value.subjectName || value.className || fallback;
}

function formatDate(date?: string) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function QuestionBankCard({
  question,
  onView,
  onEdit,
  onDelete,
}: QuestionBankCardProps) {
  const subjectName = getName(
    question.subjectId,
    "Subject not specified"
  );

  const className = getName(
    question.classId,
    "All classes"
  );

  const questionText =
    question.questionText?.trim() || "Untitled question";

  const difficulty = question.difficulty;

  const optionCount = question.options?.length ?? 0;

  const questionType = question.questionType
    ?.replace(/_/g, " ")
    .toLowerCase();

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FileQuestion className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">
              {subjectName}
            </p>

            <p className="text-xs text-gray-500">
              {className}
            </p>
          </div>
        </div>

        <QuestionStatusBadge status={question.status} />
      </div>

      {/* Question text */}
      <div className="mt-4">
        <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-gray-800">
          {questionText}
        </p>
      </div>

      {/* Metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            difficultyStyles[difficulty] ??
            "border-gray-200 bg-gray-50 text-gray-600"
          }`}
        >
          {difficulty?.charAt(0) +
            difficulty?.slice(1).toLowerCase()}
        </span>

        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
          {questionType}
        </span>

        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
          {question.marks} {question.marks === 1 ? "mark" : "marks"}
        </span>
      </div>

      {/* Additional details */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BookOpen className="h-4 w-4 shrink-0 text-gray-400" />

          <span>
            {optionCount > 0
              ? `${optionCount} options`
              : "No options"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />

          <span>{formatDate(question.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => onView(question)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          View
        </button>

        <button
          type="button"
          onClick={() => onEdit(question)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(question)}
          aria-label="Delete question"
          title="Delete question"
          className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
