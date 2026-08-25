import type { HTMLAttributes, ReactNode } from "react";

/**
 * A single breadcrumb item.
 */
export interface BreadcrumbItem {
  /**
   * Unique identifier.
   */
  id?: string | number;

  /**
   * Display label.
   */
  label: ReactNode;

  /**
   * Navigation URL.
   */
  href?: string;

  /**
   * Optional leading icon.
   */
  icon?: ReactNode;

  /**
   * Whether this is the current page.
   */
  current?: boolean;

  /**
   * Disable navigation.
   */
  disabled?: boolean;

  /**
   * Click handler.
   */
  onClick?: () => void;
}

export interface BreadcrumbProps
  extends HTMLAttributes<HTMLElement> {
  /**
   * Breadcrumb items.
   */
  items: BreadcrumbItem[];

  /**
   * Separator between items.
   */
  separator?: ReactNode;

  /**
   * Maximum visible items before collapsing.
   */
  maxItems?: number;

  /**
   * Show the home icon/item automatically.
   */
  showHome?: boolean;

  /**
   * Home navigation URL.
   */
  homeHref?: string;

  /**
   * Home label.
   */
  homeLabel?: ReactNode;

  /**
   * Home icon.
   */
  homeIcon?: ReactNode;

  /**
   * Custom class for breadcrumb items.
   */
  itemClassName?: string;

  /**
   * Custom class for the separator.
   */
  separatorClassName?: string;
}