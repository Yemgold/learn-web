




"use client";

import { useMemo } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

export interface SearchFilterOption {
  label: string;
  value: string;
}

export interface SearchFilterConfig {
  key: string;
  label: string;
  placeholder?: string;
  options: SearchFilterOption[];
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;

  filters?: SearchFilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;

  onApply?: () => void;
  onReset?: () => void;

  searchPlaceholder?: string;
  searchLabel?: string;

  showApplyButton?: boolean;
  showResetButton?: boolean;
  showFilterCount?: boolean;

  isLoading?: boolean;
  className?: string;
}

export default function SearchFilter({
  searchValue,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onApply,
  onReset,
  searchPlaceholder = "Search...",
  searchLabel = "Search",
  showApplyButton = true,
  showResetButton = true,
  showFilterCount = true,
  isLoading = false,
  className = "",
}: SearchFilterProps) {
  const activeFilterCount = useMemo(
    () =>
      Object.values(filterValues).filter(
        (value) => value !== undefined && value !== ""
      ).length,
    [filterValues]
  );

  const hasActiveFilters = searchValue.trim().length > 0 || activeFilterCount > 0;

  const handleReset = () => {
    onSearchChange("");

    filters.forEach((filter) => {
      onFilterChange?.(filter.key, "");
    });

    onReset?.();
  };

  return (
    <div
      className={`w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-4">
        {/* Search and filter heading */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <SlidersHorizontal size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Search & Filters
              </h3>
              <p className="text-xs text-gray-500">
                Find and narrow down your records
              </p>
            </div>
          </div>

          {showFilterCount && activeFilterCount > 0 && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {activeFilterCount}{" "}
              {activeFilterCount === 1 ? "filter" : "filters"} active
            </span>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <label
            htmlFor="school-record-search"
            className="mb-1.5 block text-xs font-medium text-gray-700"
          >
            {searchLabel}
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="school-record-search"
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              disabled={isLoading}
              className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                disabled={isLoading}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown filters */}
        {filters.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filters.map((filter) => (
              <div key={filter.key} className="min-w-0">
                <label
                  htmlFor={`filter-${filter.key}`}
                  className="mb-1.5 block text-xs font-medium text-gray-700"
                >
                  {filter.label}
                </label>

                <div className="relative">
                  <select
                    id={`filter-${filter.key}`}
                    value={filterValues[filter.key] ?? ""}
                    onChange={(event) =>
                      onFilterChange?.(filter.key, event.target.value)
                    }
                    disabled={isLoading}
                    className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {filter.placeholder ?? `All ${filter.label}`}
                    </option>

                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {(showApplyButton || showResetButton) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500">
              {hasActiveFilters
                ? "Search and filters are ready."
                : "No search or filters applied."}
            </div>

            <div className="flex items-center gap-2">
              {showResetButton && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading || !hasActiveFilters}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
              )}

              {showApplyButton && (
                <button
                  type="button"
                  onClick={onApply}
                  disabled={isLoading}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={15} />
                  {isLoading ? "Applying..." : "Apply Filters"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
