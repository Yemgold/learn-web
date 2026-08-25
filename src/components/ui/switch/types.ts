



import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  /**
   * Switch label.
   */
  label?: ReactNode;

  /**
   * Description shown below the label.
   */
  description?: ReactNode;

  /**
   * Helper text displayed below the component.
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
   * Full width.
   */
  fullWidth?: boolean;

  /**
   * Switch size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Container class.
   */
  containerClassName?: string;

  /**
   * Label class.
   */
  labelClassName?: string;
}