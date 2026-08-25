




import type { ReactNode } from "react";
import type { HTMLAttributes } from "react";

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Badge content.
   */
  children?: ReactNode;

  /**
   * Badge style variant.
   */
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "destructive"
    | "info"
    | "outline";

  /**
   * Badge size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Icon position.
   */
  iconPosition?: "left" | "right";

  /**
   * Rounded badge style.
   */
  rounded?: boolean;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Make badge full width.
   */
  fullWidth?: boolean;

  /**
   * Custom wrapper class.
   */
  containerClassName?: string;
}