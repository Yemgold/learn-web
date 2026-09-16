





// src/components/quiz-board/QuizBoardPagination.tsx

"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface QuizBoardPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize?: number;

  onPageChange: (page: number) => void;

  isLoading?: boolean;
}

export default function QuizBoardPagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize = 10,
  onPageChange,
  isLoading = false,
}: QuizBoardPaginationProps) {
  const safeTotalPages = Math.max(
    totalPages,
    1,
  );

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    safeTotalPages,
  );

  const safePageSize = Math.max(
    pageSize,
    1,
  );

  const startResult =
    totalResults === 0
      ? 0
      : (safeCurrentPage - 1) *
          safePageSize +
        1;

  const endResult =
    totalResults === 0
      ? 0
      : Math.min(
          safeCurrentPage * safePageSize,
          totalResults,
        );

  const hasPrevious =
    safeCurrentPage > 1;

  const hasNext =
    safeCurrentPage < safeTotalPages;

  if (totalResults === 0) {
    return null;
  }

  /*
   * Build a compact page list.
   *
   * Examples:
   * 1 2 3 4 5
   * 1 2 3 ... 10
   * 1 ... 5 6 7 ... 12
   * 1 ... 8 9 10
   */
  const pageItems = buildPageItems(
    safeCurrentPage,
    safeTotalPages,
  );

  return (
    <nav
      aria-label="Quiz competition pagination"
      className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-4"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ---------------------------------------------------------------- */}
        {/* Result information                                               */}
        {/* ---------------------------------------------------------------- */}

        <div className="text-center text-xs text-slate-500 lg:text-left">
          Showing{" "}
          <span className="font-semibold text-slate-300">
            {startResult}
          </span>
          {" – "}
          <span className="font-semibold text-slate-300">
            {endResult}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-300">
            {totalResults}
          </span>{" "}
          competitions
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Pagination controls                                              */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center justify-center gap-1.5">
          {/* First page */}

          <PaginationButton
            label="First page"
            disabled={
              !hasPrevious ||
              isLoading
            }
            onClick={() =>
              onPageChange(1)
            }
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationButton>

          {/* Previous page */}

          <PaginationButton
            label="Previous page"
            disabled={
              !hasPrevious ||
              isLoading
            }
            onClick={() =>
              onPageChange(
                safeCurrentPage - 1,
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationButton>

          {/* Page numbers */}

          <div className="flex items-center gap-1">
            {pageItems.map(
              (item, index) => {
                if (
                  item === "ellipsis"
                ) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-9 w-8 items-center justify-center text-xs text-slate-600"
                    >
                      …
                    </span>
                  );
                }

                const isActive =
                  item ===
                  safeCurrentPage;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      onPageChange(item)
                    }
                    disabled={isLoading}
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    aria-label={`Go to page ${item}`}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                      isActive
                        ? "border border-violet-500/30 bg-violet-500/15 text-violet-300"
                        : "border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    } disabled:pointer-events-none disabled:opacity-40`}
                  >
                    {item}
                  </button>
                );
              },
            )}
          </div>

          {/* Next page */}

          <PaginationButton
            label="Next page"
            disabled={
              !hasNext ||
              isLoading
            }
            onClick={() =>
              onPageChange(
                safeCurrentPage + 1,
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>

          {/* Last page */}

          <PaginationButton
            label="Last page"
            disabled={
              !hasNext ||
              isLoading
            }
            onClick={() =>
              onPageChange(
                safeTotalPages,
              )
            }
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationButton>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Loading indicator                                                  */}
      {/* ------------------------------------------------------------------ */}

      {isLoading && (
        <div className="mt-3 text-center text-[10px] font-medium text-violet-400">
          Loading competitions...
        </div>
      )}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination Button                                                          */
/* -------------------------------------------------------------------------- */

interface PaginationButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function PaginationButton({
  label,
  disabled,
  onClick,
  children,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:border-violet-500/20 hover:bg-violet-500/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Page Item Builder                                                          */
/* -------------------------------------------------------------------------- */

type PageItem =
  | number
  | "ellipsis";

function buildPageItems(
  currentPage: number,
  totalPages: number,
): PageItem[] {
  /*
   * Keep all pages visible when there are
   * only a few pages.
   */
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  /*
   * Near the beginning:
   *
   * 1 2 3 4 5 ... 20
   */
  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      totalPages,
    ];
  }

  /*
   * Near the end:
   *
   * 1 ... 16 17 18 19 20
   */
  if (
    currentPage >=
    totalPages - 3
  ) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  /*
   * Middle:
   *
   * 1 ... 8 9 10 ... 20
   */
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

