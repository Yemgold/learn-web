



"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import type { SchoolQuestion } from "@/types/schools/question-bank.types";

interface QuestionDeleteDialogProps {
  open: boolean;
  question: SchoolQuestion | null;
  deleting: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export default function QuestionDeleteDialog({
  open,
  question,
  deleting,
  onConfirm,
  onCancel,
}: QuestionDeleteDialogProps) {
  if (!open || !question) {
    return null;
  }

  const handleDelete = async () => {
    if (deleting) return;
    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-question-title"
        aria-describedby="delete-question-description"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <h2
                id="delete-question-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete Question
              </h2>

              <p className="text-sm text-gray-500">
                Confirm this action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">
          <p
            id="delete-question-description"
            className="text-sm leading-6 text-gray-600"
          >
            Are you sure you want to delete this question? This action
            cannot be undone.
          </p>

          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
              Question to be deleted
            </p>

            <p className="line-clamp-4 whitespace-pre-wrap text-sm font-medium leading-6 text-gray-800">
              {question.questionText}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                {question.questionType.replace("_", " ")}
              </span>

              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                {question.difficulty}
              </span>

              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                {question.marks}{" "}
                {question.marks === 1 ? "Mark" : "Marks"}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Please make sure you have selected the correct question
            before proceeding.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Question
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
