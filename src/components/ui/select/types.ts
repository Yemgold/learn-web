



import type {
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export interface SelectOption {
  /**
   * Option label.
   */
  label: ReactNode;

  /**
   * Option value.
   */
  value: string;

  /**
   * Disable this option.
   */
  disabled?: boolean;
}

export interface SelectGroup {
  /**
   * Group label.
   */
  label: string;

  /**
   * Group options.
   */
  options: SelectOption[];
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /**
   * Label displayed above the select.
   */
  label?: ReactNode;

  /**
   * Placeholder shown as the first option.
   */
  placeholder?: string;

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
   * Available options.
   */
  options?: SelectOption[];

  /**
   * Option groups.
   */
  groups?: SelectGroup[];

  /**
   * Left icon.
   */
  leftIcon?: ReactNode;

  /**
   * Right icon.
   */
  rightIcon?: ReactNode;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Full width.
   */
  fullWidth?: boolean;

  /**
   * Rounded appearance.
   */
  rounded?: boolean;

  /**
   * Required indicator.
   */
  required?: boolean;

  /**
   * Component size.
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

  /**
   * Wrapper class.
   */
  wrapperClassName?: string;
}