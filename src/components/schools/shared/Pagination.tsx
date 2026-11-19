




"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showItemCount?: boolean;
  className?: string;
  disabled?: boolean;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = false,
  showItemCount = true,
  className = "",
  disabled = false,
}: PaginationProps) {
  const safeTotalPages = Math.max(0, Math.floor(totalPages));
  const safeCurrentPage =
    safeTotalPages > 0
      ? Math.min(Math.max(1, Math.floor(currentPage)), safeTotalPages)
      : 1;

  if (safeTotalPages <= 1 && !showPageSize) {
    return null;
  }

  const startItem =
    totalItems && totalItems > 0
      ? (safeCurrentPage - 1) * pageSize + 1
      : 0;

  const endItem = totalItems
    ? Math.min(safeCurrentPage * pageSize, totalItems)
    : 0;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (safeTotalPages <= 5) {
      return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
    }

    if (safeCurrentPage <= 3) {
      pages.push(1, 2, 3, 4, "ellipsis", safeTotalPages);
    } else if (safeCurrentPage >= safeTotalPages - 2) {
      pages.push(
        1,
        "ellipsis",
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages
      );
    } else {
      pages.push(
        1,
        "ellipsis",
        safeCurrentPage - 1,
        safeCurrentPage,
        safeCurrentPage + 1,
        "ellipsis",
        safeTotalPages
      );
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (page: number) => {
    if (
      disabled ||
      page < 1 ||
      page > safeTotalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    onPageChange(page);
  };

  return (
    <div
      className={`flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        {showItemCount && totalItems !== undefined && (
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">{startItem}</span>
            {" - "}
            <span className="font-medium text-gray-900">{endItem}</span>
            {" of "}
            <span className="font-medium text-gray-900">{totalItems}</span>
            {" records"}
          </p>
        )}

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="pagination-page-size"
              className="text-sm text-gray-500"
            >
              Rows:
            </label>

            <select
              id="pagination-page-size"
              value={pageSize}
              disabled={disabled}
              onChange={(event) =>
                onPageSizeChange(Number(event.target.value))
              }
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {safeTotalPages > 0 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between gap-2 sm:justify-end"
        >
          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={disabled || safeCurrentPage <= 1}
            aria-label="Go to previous page"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-7 items-center justify-center text-gray-400"
                  aria-hidden="true"
                >
                  <MoreHorizontal size={18} />
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  disabled={disabled}
                  aria-label={`Go to page ${page}`}
                  aria-current={
                    page === safeCurrentPage ? "page" : undefined
                  }
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                    page === safeCurrentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={disabled || safeCurrentPage >= safeTotalPages}
            aria-label="Go to next page"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}
