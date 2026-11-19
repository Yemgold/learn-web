





"use client";

import {
  BookOpen,
  Plus,
} from "lucide-react";

import type { AcademicPeriodEmptyStateProps } from "@/types/schools/academic-period.types"; 

export default function AcademicPeriodEmptyState({
  searchTerm,
  onAddPeriod,
}: AcademicPeriodEmptyStateProps) {
  const hasSearch = Boolean(searchTerm.trim());

  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <BookOpen size={23} />
      </div>

      <h3 className="font-semibold text-gray-800">
        {hasSearch
          ? "No Matching Periods Found"
          : "No Academic Periods Yet"}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {hasSearch
          ? "Try another search term."
          : "Add the first period to this academic session."}
      </p>

      {!hasSearch && (
        <button
          type="button"
          onClick={onAddPeriod}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Add First Period
        </button>
      )}
    </div>
  );
}
