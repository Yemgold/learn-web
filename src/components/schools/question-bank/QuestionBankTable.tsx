



"use client";

import {
  BookOpen,
  Eye,
  FileQuestion,
  Pencil,
  Trash2,
} from "lucide-react";

import QuestionStatusBadge from "./QuestionStatusBadge";

import type {
  QuestionDifficulty,
  QuestionTableProps,
  SchoolQuestion,
} from "@/types/schools/question-bank.types";

interface QuestionBankTableProps {
  questions: SchoolQuestion[];
  loading: boolean;
  onView: (question: SchoolQuestion) => void;
  onEdit: (question: SchoolQuestion) => void;
  onDelete: (question: SchoolQuestion) => void;
}

const DIFFICULTY_STYLES: Record<QuestionDifficulty, string> = {
  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
};

function getSubjectName(question: SchoolQuestion): string {
  if (typeof question.subjectId === "object") {
    return question.subjectId?.subjectName ?? "Unknown subject";
  }

  return "Subject not populated";
}

function getClassName(question: SchoolQuestion): string {
  if (typeof question.classId === "object") {
    return question.classId?.className ?? "Unknown class";
  }

  return "All classes";
}

function formatQuestionType(type: SchoolQuestion["questionType"]) {
  return type.replace(/_/g, " ");
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          {Array.from({ length: 6 }).map((__, cellIndex) => (
            <td key={cellIndex} className="px-5 py-4">
              <div className="h-4 w-full rounded bg-gray-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <FileQuestion className="h-7 w-7 text-gray-400" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No questions found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Your questions will appear here once they have been created.
        </p>
      </td>
    </tr>
  );
}

export default function QuestionBankTable({
  questions,
  loading,
  onView,
  onEdit,
  onDelete,
}: QuestionBankTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px] divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Question
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Subject / Class
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Type
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Difficulty
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <LoadingRows />
            ) : questions.length === 0 ? (
              <EmptyState />
            ) : (
              questions.map((question) => (
                <tr
                  key={question._id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="max-w-sm px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium leading-5 text-gray-900">
                          {question.questionText}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {question.marks}{" "}
                          {question.marks === 1 ? "mark" : "marks"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {getSubjectName(question)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {getClassName(question)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-gray-600">
                      {formatQuestionType(question.questionType)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        DIFFICULTY_STYLES[question.difficulty]
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <QuestionStatusBadge status={question.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(question)}
                        title="Preview question"
                        aria-label="Preview question"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(question)}
                        title="Edit question"
                        aria-label="Edit question"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(question)}
                        title="Delete question"
                        aria-label="Delete question"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-gray-100 md:hidden">
        {loading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse space-y-3">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="h-8 w-full rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FileQuestion className="mx-auto h-9 w-9 text-gray-400" />

            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              No questions found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your questions will appear here once created.
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question._id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-3 text-sm font-semibold leading-5 text-gray-900">
                    {question.questionText}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {getSubjectName(question)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                    DIFFICULTY_STYLES[question.difficulty]
                  }`}
                >
                  {question.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  {formatQuestionType(question.questionType)}
                </span>

                <QuestionStatusBadge status={question.status} />

                <span className="text-xs text-gray-500">
                  {question.marks}{" "}
                  {question.marks === 1 ? "mark" : "marks"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500">
                  {getClassName(question)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onView(question)}
                    aria-label="Preview question"
                    className="rounded-lg p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(question)}
                    aria-label="Edit question"
                    className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(question)}
                    aria-label="Delete question"
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
