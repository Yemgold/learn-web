


"use client";

import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowLeft,
  BookOpen,
  Plus,
  Upload,
} from "lucide-react";

interface QuestionBankHeaderProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
  showImportButton?: boolean;
  showCreateButton?: boolean;
  onCreate?: () => void;
  onImport?: () => void;
}

export default function QuestionBankHeader({
  title = "Question Bank",
  description = "Create, organise, and manage your school's examination questions.",
  showBackButton = false,
  backHref,
  showImportButton = true,
  showCreateButton = true,
  onCreate,
  onImport,
}: QuestionBankHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {showBackButton && backHref && (
          <Link
            href={backHref}
            aria-label="Go back"
            className="mt-1 rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
          <BookOpen className="h-6 w-6 text-indigo-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {showImportButton && (
          onImport ? (
            <button
              type="button"
              onClick={onImport}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              Import Questions
            </button>
          ) : (
            <Link
              href="./import"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              Import Questions
            </Link>
          )
        )}

        {showCreateButton && (
          onCreate ? (
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Question
            </button>
          ) : (
            <Link
              href="./create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Question
            </Link>
          )
        )}
      </div>
    </div>
  );
}
