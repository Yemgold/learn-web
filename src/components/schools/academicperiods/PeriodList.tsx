




"use client";

import {
  BookOpen,
  Plus,
  RefreshCw,
} from "lucide-react";

import type {
  AcademicPeriodListProps,
} from "@/types/schools/academic-period.types"; 

import AcademicPeriodSearch from "./PeriodSearch";
import AcademicPeriodEmptyState from "./PeriodEmptyState";
import AcademicPeriodTable from "./PeriodTable";

export default function AcademicPeriodList({
  periods,
  filteredPeriods,
  searchTerm,
  loading,
  error,
  updatingStatusId,
  onSearchChange,
  onAddPeriod,
  onEditPeriod,
  onToggleStatus,
  onRetry,
}: AcademicPeriodListProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* HEADER */}

      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Academic Periods
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Periods belonging to the selected academic session.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddPeriod}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={17} />
          Add Period
        </button>
      </div>

      {/* SEARCH */}

      <AcademicPeriodSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      {/* CONTENT */}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
          <RefreshCw
            size={18}
            className="animate-spin"
          />
          Loading academic periods...
        </div>
      ) : error ? (
        <div className="px-5 py-12 text-center">
          <BookOpen
            size={27}
            className="mx-auto mb-3 text-gray-400"
          />

          <h3 className="font-semibold text-gray-800">
            Unable to display academic periods
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      ) : filteredPeriods.length === 0 ? (
        <AcademicPeriodEmptyState
          searchTerm={searchTerm}
          onAddPeriod={onAddPeriod}
          onRetry={onRetry}
        />
      ) : (
        <AcademicPeriodTable
          periods={filteredPeriods}
          updatingStatusId={updatingStatusId}
          onEdit={onEditPeriod}
          onToggleStatus={onToggleStatus}
        />
      )}

      {/* FOOTER */}

      <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
        Showing {filteredPeriods.length} of{" "}
        {periods.length} periods
      </div>
    </div>
  );
}
