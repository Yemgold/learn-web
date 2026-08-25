




import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Dialog action button.
 */
export interface DialogAction
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
  > {
  /**
   * Button label.
   */
  label: ReactNode;

  /**
   * Button variant.
   */
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "success"
    | "warning";

  /**
   * Loading state.
   */
  loading?: boolean;
}

/**
 * Dialog size.
 */
export type DialogSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

/**
 * Dialog props.
 */
export interface DialogProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title" | "children"
  > {
  /**
   * Controlled state.
   */
  open?: boolean;

  /**
   * Uncontrolled state.
   */
  defaultOpen?: boolean;

  /**
   * Open change callback.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Dialog title.
   */
  title?: ReactNode;

  /**
   * Description.
   */
  description?: ReactNode;

  /**
   * Dialog body.
   */
  children?: ReactNode;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Footer primary action.
   */
  primaryAction?: DialogAction;

  /**
   * Footer secondary action.
   */
  secondaryAction?: DialogAction;

  /**
   * Extra footer content.
   */
  footer?: ReactNode;

  /**
   * Hide footer.
   */
  hideFooter?: boolean;

  /**
   * Show close button.
   */
  showCloseButton?: boolean;

  /**
   * Close when Escape is pressed.
   */
  closeOnEscape?: boolean;

  /**
   * Close when overlay is clicked.
   */
  closeOnOverlayClick?: boolean;

  /**
   * Prevent closing.
   */
  preventClose?: boolean;

  /**
   * Trap keyboard focus.
   */
  trapFocus?: boolean;

  /**
   * Lock body scrolling.
   */
  lockScroll?: boolean;

  /**
   * Render using Portal.
   */
  portal?: boolean;

  /**
   * Dialog size.
   */
  size?: DialogSize;

  /**
   * Initial focus element.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;

  /**
   * Custom classes.
   */
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}