



import type { HTMLAttributes, ReactNode } from "react";

export interface PaginationProps
  extends HTMLAttributes<HTMLElement> {
  /**
   * Current page (1-based).
   */
  currentPage: number;

  /**
   * Total number of pages.
   */
  totalPages: number;

  /**
   * Fired when a page changes.
   */
  onPageChange: (page: number) => void;

  /**
   * Number of sibling pages to display.
   *
   * Example:
   * 1 ... 4 5 [6] 7 8 ... 20
   */
  siblingCount?: number;

  /**
   * Whether Previous/Next buttons are shown.
   */
  showControls?: boolean;

  /**
   * Whether First/Last buttons are shown.
   */
  showFirstLast?: boolean;

  /**
   * Disable the whole component.
   */
  disabled?: boolean;

  /**
   * Compact size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Rounded buttons.
   */
  rounded?: boolean;

  /**
   * Optional custom labels.
   */
  labels?: {
    first?: ReactNode;
    previous?: ReactNode;
    next?: ReactNode;
    last?: ReactNode;
  };

  /**
   * Show page information.
   * Example:
   * Page 3 of 24
   */
  showPageInfo?: boolean;

  /**
   * Additional classes for buttons.
   */
  buttonClassName?: string;
}