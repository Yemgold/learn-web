




import type {
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export interface TextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size"
  > {
  /**
   * Label displayed above the textarea.
   */
  label?: ReactNode;

  /**
   * Helper text displayed below.
   */
  helperText?: ReactNode;

  /**
   * Error message.
   */
  error?: string;

  /**
   * Success message.
   */
  success?: string;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Makes the textarea full width.
   */
  fullWidth?: boolean;

  /**
   * Required indicator.
   */
  required?: boolean;

  /**
   * Component size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Rounded corners.
   */
  rounded?: boolean;

  /**
   * Show character count.
   */
  showCount?: boolean;

  /**
   * Maximum number of characters.
   */
  maxLength?: number;

  /**
   * Allow vertical resizing.
   */
  resizable?: boolean;

  /**
   * Auto-grow as the user types.
   */
  autoResize?: boolean;

  /**
   * Container class.
   */
  containerClassName?: string;

  /**
   * Label class.
   */
  labelClassName?: string;

  /**
   * Wrapper class.
   */
  wrapperClassName?: string;
}