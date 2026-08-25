


import type {
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";


/**
 * Modal size
 */
export type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";


/**
 * Modal action button
 */
export interface ModalAction {
  label: string;

  onClick?: () => void;

  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "ghost";

  disabled?: boolean;

  loading?: boolean;
}


/**
 * Modal props
 */
export interface ModalProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title"
  > {


  /**
   * Controlled open state
   */
  open?: boolean;


  /**
   * Default state
   */
  defaultOpen?: boolean;


  /**
   * Change callback
   */
  onOpenChange?: (
    open: boolean
  ) => void;



  /**
   * Modal title
   */
  title?: ReactNode;



  /**
   * Description text
   */
  description?: ReactNode;



  /**
   * Optional icon
   */
  icon?: ReactNode;



  /**
   * Content
   */
  children?: ReactNode;



  /**
   * Footer content
   */
  footer?: ReactNode;



  /**
   * Primary button
   */
  primaryAction?: ModalAction;



  /**
   * Secondary button
   */
  secondaryAction?: ModalAction;



  /**
   * Hide footer
   */
  hideFooter?: boolean;



  /**
   * Show close button
   */
  showCloseButton?: boolean;



  /**
   * Close behavior
   */
  closeOnEscape?: boolean;


  closeOnOverlayClick?: boolean;



  /**
   * Prevent closing
   */
  preventClose?: boolean;



  /**
   * Accessibility focus
   */
  trapFocus?: boolean;



  /**
   * Lock body scroll
   */
  lockScroll?: boolean;



  /**
   * Use portal
   */
  portal?: boolean;



  /**
   * Modal size
   */
  size?: ModalSize;



  /**
   * Initial focus
   */
  initialFocusRef?: RefObject<HTMLElement | null>;



  /**
   * Custom classes
   */
  overlayClassName?: string;

  contentClassName?: string;

  headerClassName?: string;

  bodyClassName?: string;

  footerClassName?: string;
}