


"use client";

import {
  BookOpen,
  FileQuestion,
  Plus,
  SearchX,
  Upload,
} from "lucide-react";

interface EmptyQuestionBankProps {
  hasFilters?: boolean;
  onCreate?: () => void;
  onImport?: () => void;
  onClearFilters?: () => void;
  title?: string;
  description?: string;
  showActions?: boolean;
}

export default function EmptyQuestionBank({
  hasFilters = false,
  onCreate,
  onImport,
  onClearFilters,
  title,
  description,
  showActions = true,
}: EmptyQuestionBankProps) {
  const defaultTitle = hasFilters
    ? "No matching questions found"
    : "Your question bank is empty";

  const defaultDescription = hasFilters
    ? "We couldn't find any questions matching your current search or filters. Try changing your search criteria."
    : "You haven't added any questions yet. Start building your school's question bank by creating your first question or importing questions.";

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center sm:px-8">
      {/* Illustration */}
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
        {hasFilters ? (
          <SearchX className="h-9 w-9 text-indigo-500" />
        ) : (
          <>
            <BookOpen className="h-10 w-10 text-indigo-500" />

            <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-white">
              <FileQuestion className="h-4 w-4" />
            </span>
          </>
        )}
      </div>

      {/* Message */}
      <h3 className="text-lg font-semibold text-gray-900">
        {title || defaultTitle}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description || defaultDescription}
      </p>

      {/* Actions */}
      {showActions && (
        <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          {hasFilters ? (
            onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Clear filters
              </button>
            )
          ) : (
            <>
              {onCreate && (
                <button
                  type="button"
                  onClick={onCreate}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Create question
                </button>
              )}

              {onImport && (
                <button
                  type="button"
                  onClick={onImport}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Import questions
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
