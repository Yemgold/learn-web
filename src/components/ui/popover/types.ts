





import type {
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";


/**
 * Popover placement
 */
export type PopoverPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right";


/**
 * Popover alignment
 */
export type PopoverAlign =
  | "start"
  | "center"
  | "end";


/**
 * Popover size
 */
export type PopoverSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "auto";


/**
 * Popover props
 */
export interface PopoverProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "content"
  > {

  /**
   * Controlled state
   */
  open?: boolean;


  /**
   * Default uncontrolled state
   */
  defaultOpen?: boolean;


  /**
   * State change callback
   */
  onOpenChange?: (
    open: boolean
  ) => void;


  /**
   * Trigger element
   */
  trigger?: ReactNode;


  /**
   * Popover content
   */
  children?: ReactNode;


  /**
   * Placement relative to trigger
   */
  placement?: PopoverPlacement;


  /**
   * Alignment
   */
  align?: PopoverAlign;


  /**
   * Size
   */
  size?: PopoverSize;


  /**
   * Close when clicking outside
   */
  closeOnOutsideClick?: boolean;


  /**
   * Close with Escape
   */
  closeOnEscape?: boolean;


  /**
   * Trap focus
   */
  trapFocus?: boolean;


  /**
   * Render through portal
   */
  portal?: boolean;


  /**
   * Trigger reference
   */
  triggerRef?: RefObject<HTMLDivElement | null>;


  /**
   * Content reference
   */
  contentRef?: RefObject<HTMLDivElement | null>;


  /**
   * Custom classes
   */
  contentClassName?: string;


  triggerClassName?: string;
}