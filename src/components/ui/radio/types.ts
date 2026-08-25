


import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type"
  > {
  /**
   * Radio label.
   */
  label?: ReactNode;

  /**
   * Description below the label.
   */
  description?: ReactNode;

  /**
   * Helper text.
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
   * Radio size.
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

export interface RadioOption {
  label: ReactNode;
  value: string;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /**
   * Radio group label.
   */
  label?: ReactNode;

  /**
   * Available radio options.
   */
  options: RadioOption[];

  /**
   * Selected value.
   */
  value?: string;

  /**
   * Change handler.
   */
  onChange?: (value: string) => void;

  /**
   * Group name.
   */
  name: string;

  /**
   * Disabled state.
   */
  disabled?: boolean;

  /**
   * Error message.
   */
  error?: string;

  /**
   * Helper text.
   */
  helperText?: ReactNode;

  /**
   * Success message.
   */
  success?: string;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Radio size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Layout direction.
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Full width.
   */
  fullWidth?: boolean;

  /**
   * Container class.
   */
  className?: string;
}