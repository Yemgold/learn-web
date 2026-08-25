


import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type"
  > {
  /**
   * Label displayed next to the checkbox.
   */
  label?: ReactNode;

  /**
   * Helper text displayed below the checkbox.
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
   * Description displayed below the label.
   */
  description?: ReactNode;

  /**
   * Whether the checkbox is in an indeterminate state.
   */
  indeterminate?: boolean;

  /**
   * Size of the checkbox.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Makes the checkbox occupy the full width.
   */
  fullWidth?: boolean;

  /**
   * Whether the checkbox is loading.
   */
  loading?: boolean;

  /**
   * Custom container class.
   */
  containerClassName?: string;

  /**
   * Custom label class.
   */
  labelClassName?: string;
}