




import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "prefix"
  > {
  /**
   * Label displayed above the input.
   */
  label?: ReactNode;

  /**
   * Placeholder/helper text shown below the input.
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
   * Left icon.
   */
  leftIcon?: ReactNode;

  /**
   * Right icon.
   */
  rightIcon?: ReactNode;

  /**
   * Prefix element.
   */
  prefix?: ReactNode;

  /**
   * Suffix element.
   */
  suffix?: ReactNode;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Makes the input take the full width.
   */
  fullWidth?: boolean;

  /**
   * Required indicator.
   */
  required?: boolean;

  /**
   * Input sizes.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Rounded appearance.
   */
  rounded?: boolean;

  /**
   * Character counter.
   */
  showCount?: boolean;

  /**
   * Maximum number of characters.
   */
  maxLength?: number;

  /**
   * Container class.
   */
  containerClassName?: string;

  /**
   * Label class.
   */
  labelClassName?: string;

  /**
   * Input wrapper class.
   */
  wrapperClassName?: string;
}