


import type { HTMLAttributes, ReactNode } from "react";

export interface ProgressProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value.
   */
  value: number;

  /**
   * Maximum progress value.
   */
  max?: number;

  /**
   * Progress bar size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Progress bar variant.
   */
  variant?:
    | "default"
    | "success"
    | "warning"
    | "destructive"
    | "info";

  /**
   * Rounded corners.
   */
  rounded?: boolean;

  /**
   * Animate progress changes.
   */
  animated?: boolean;

  /**
   * Display percentage text.
   */
  showValue?: boolean;

  /**
   * Optional label displayed above the bar.
   */
  label?: ReactNode;

  /**
   * Optional helper text below the bar.
   */
  helperText?: ReactNode;

  /**
   * Display the value as a percentage.
   * If false, displays value/max.
   */
  percentage?: boolean;

  /**
   * Custom class for the indicator.
   */
  indicatorClassName?: string;

  /**
   * Custom class for the label.
   */
  labelClassName?: string;

  /**
   * Custom class for the helper text.
   */
  helperTextClassName?: string;
}