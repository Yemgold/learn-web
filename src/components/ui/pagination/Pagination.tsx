

"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  paginationVariants,
  paginationButtonVariants,
  paginationEllipsisVariants,
  paginationInfoVariants,
} from "./pagination.variants";

import type { PaginationProps } from "./types";

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,

      currentPage,
      totalPages,
      onPageChange,

      siblingCount = 1,

      showControls = true,
      showFirstLast = false,
      showPageInfo = false,

      disabled = false,

      size = "md",
      rounded = false,

      labels,

      buttonClassName,

      ...props
    },
    ref
  ) => {
    const safeTotalPages = Math.max(1, totalPages);
    const safeCurrentPage = Math.min(
      Math.max(1, currentPage),
      safeTotalPages
    );

    const createPages = () => {
      const pages: (number | "...")[] = [];

      const totalNumbers = siblingCount * 2 + 5;

      if (safeTotalPages <= totalNumbers) {
        return Array.from(
          { length: safeTotalPages },
          (_, i) => i + 1
        );
      }

      const left = Math.max(
        safeCurrentPage - siblingCount,
        2
      );

      const right = Math.min(
        safeCurrentPage + siblingCount,
        safeTotalPages - 1
      );

      pages.push(1);

      if (left > 2) {
        pages.push("...");
      }

      for (let page = left; page <= right; page++) {
        pages.push(page);
      }

      if (right < safeTotalPages - 1) {
        pages.push("...");
      }

      pages.push(safeTotalPages);

      return pages;
    };

    const pages = createPages();

    const goTo = (page: number) => {
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
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn(
          paginationVariants(),
          className
        )}
        {...props}
      >
        {showPageInfo && (
          <span
            className={paginationInfoVariants()}
          >
            Page {safeCurrentPage} of {safeTotalPages}
          </span>
        )}

        {showFirstLast && (
          <button
            type="button"
            onClick={() => goTo(1)}
            disabled={disabled || safeCurrentPage === 1}
            className={cn(
              paginationButtonVariants({
                size,
                rounded,
                disabled:
                  disabled || safeCurrentPage === 1,
              }),
              buttonClassName
            )}
          >
            {labels?.first ?? (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        )}

        {showControls && (
          <button
            type="button"
            onClick={() => goTo(safeCurrentPage - 1)}
            disabled={disabled || safeCurrentPage === 1}
            className={cn(
              paginationButtonVariants({
                size,
                rounded,
                disabled:
                  disabled || safeCurrentPage === 1,
              }),
              buttonClassName
            )}
          >
            {labels?.previous ?? (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className={paginationEllipsisVariants()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-current={
                page === safeCurrentPage
                  ? "page"
                  : undefined
              }
              onClick={() => goTo(page)}
              disabled={disabled}
              className={cn(
                paginationButtonVariants({
                  size,
                  rounded,
                  active: page === safeCurrentPage,
                  disabled,
                }),
                buttonClassName
              )}
            >
              {page}
            </button>
          )
        )}

        {showControls && (
          <button
            type="button"
            onClick={() => goTo(safeCurrentPage + 1)}
            disabled={
              disabled ||
              safeCurrentPage === safeTotalPages
            }
            className={cn(
              paginationButtonVariants({
                size,
                rounded,
                disabled:
                  disabled ||
                  safeCurrentPage === safeTotalPages,
              }),
              buttonClassName
            )}
          >
            {labels?.next ?? (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}

        {showFirstLast && (
          <button
            type="button"
            onClick={() => goTo(safeTotalPages)}
            disabled={
              disabled ||
              safeCurrentPage === safeTotalPages
            }
            className={cn(
              paginationButtonVariants({
                size,
                rounded,
                disabled:
                  disabled ||
                  safeCurrentPage === safeTotalPages,
              }),
              buttonClassName
            )}
          >
            {labels?.last ?? (
              <ChevronsRight className="h-4 w-4" />
            )}
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };