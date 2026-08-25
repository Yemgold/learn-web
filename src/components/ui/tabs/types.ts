

import type { HTMLAttributes, ReactNode } from "react";

/**
 * Individual tab item.
 */
export interface TabItem {
  /**
   * Unique tab value.
   */
  value: string;

  /**
   * Display label.
   */
  label: ReactNode;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Tab content.
   */
  content: ReactNode;

  /**
   * Disable the tab.
   */
  disabled?: boolean;

  /**
   * Optional badge.
   */
  badge?: ReactNode;
}

/**
 * Tabs component props.
 */
export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Tab definitions.
   */
  tabs: TabItem[];

  /**
   * Controlled active tab.
   */
  value?: string;

  /**
   * Default active tab.
   */
  defaultValue?: string;

  /**
   * Called when the active tab changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Tabs orientation.
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Visual style.
   */
  variant?: "default" | "pills" | "underline";

  /**
   * Size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Stretch tabs to fill available width.
   */
  fullWidth?: boolean;

  /**
   * Lazy render only the active tab.
   */
  lazy?: boolean;

  /**
   * Keep inactive tab content mounted.
   */
  keepMounted?: boolean;

  /**
   * Additional class names.
   */
  listClassName?: string;

  triggerClassName?: string;

  contentClassName?: string;
}