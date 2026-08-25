



import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface EmptyStateAction
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Action button label.
   */
  label: ReactNode;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Button variant.
   */
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive";

  /**
   * Loading state.
   */
  loading?: boolean;
}

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Illustration or icon.
   */
  illustration?: ReactNode;

  /**
   * Main heading.
   */
  title: ReactNode;

  /**
   * Supporting description.
   */
  description?: ReactNode;

  /**
   * Primary action.
   */
  primaryAction?: EmptyStateAction;

  /**
   * Secondary action.
   */
  secondaryAction?: EmptyStateAction;

  /**
   * Component size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Content alignment.
   */
  align?: "left" | "center";

  /**
   * Stretch width.
   */
  fullWidth?: boolean;

  /**
   * Loading state.
   */
  loading?: boolean;

  illustrationClassName?: string;

  titleClassName?: string;

  descriptionClassName?: string;

  actionsClassName?: string;
}