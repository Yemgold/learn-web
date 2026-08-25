import type { ReactNode } from "react";
import type { HTMLAttributes } from "react";

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Alert title.
   */
  title?: ReactNode;

  /**
   * Alert message content.
   */
  children?: ReactNode;

  /**
   * Alert visual style.
   */
  variant?:
    | "default"
    | "success"
    | "warning"
    | "destructive"
    | "info";

  /**
   * Alert size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Icon displayed before content.
   */
  icon?: ReactNode;

  /**
   * Display close button.
   */
  dismissible?: boolean;

  /**
   * Close callback.
   */
  onClose?: () => void;

  /**
   * Automatically hide after time.
   */
  duration?: number;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Full width alert.
   */
  fullWidth?: boolean;

  /**
   * Custom container class.
   */
  containerClassName?: string;

  /**
   * Title custom class.
   */
  titleClassName?: string;

  /**
   * Content custom class.
   */
  contentClassName?: string;
}