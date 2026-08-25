




import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Drawer action button.
 */
export interface DrawerAction
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
 * Drawer placement.
 */
export type DrawerPlacement =
  | "left"
  | "right"
  | "top"
  | "bottom";

/**
 * Drawer size.
 */
export type DrawerSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

/**
 * Drawer props.
 */
export interface DrawerProps
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
   * Open state callback.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Drawer title.
   */
  title?: ReactNode;

  /**
   * Drawer description.
   */
  description?: ReactNode;

  /**
   * Drawer content.
   */
  children?: ReactNode;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Drawer placement.
   *
   * @default "right"
   */
  placement?: DrawerPlacement;

  /**
   * Drawer size.
   *
   * @default "md"
   */
  size?: DrawerSize;

  /**
   * Footer primary action.
   */
  primaryAction?: DrawerAction;

  /**
   * Footer secondary action.
   */
  secondaryAction?: DrawerAction;

  /**
   * Custom footer.
   */
  footer?: ReactNode;

  /**
   * Hide footer.
   */
  hideFooter?: boolean;

  /**
   * Show close button.
   *
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Close when Escape is pressed.
   *
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Close when overlay is clicked.
   *
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Prevent closing.
   */
  preventClose?: boolean;

  /**
   * Trap keyboard focus.
   *
   * @default true
   */
  trapFocus?: boolean;

  /**
   * Lock body scrolling.
   *
   * @default true
   */
  lockScroll?: boolean;

  /**
   * Render inside a Portal.
   *
   * @default true
   */
  portal?: boolean;

  /**
   * Initial focus element.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;

  /**
   * Additional classes.
   */
  overlayClassName?: string;

  contentClassName?: string;

  headerClassName?: string;

  bodyClassName?: string;

  footerClassName?: string;
}