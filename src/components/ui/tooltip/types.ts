



import type {
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";


export type TooltipPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right";


export type TooltipAlign =
  | "start"
  | "center"
  | "end";


export type TooltipSize =
  | "sm"
  | "md"
  | "lg";



export interface TooltipProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "content"
  > {


  /**
   * Trigger element
   */
  children: ReactNode;



  /**
   * Tooltip content
   */
  content: ReactNode;



  /**
   * Controlled state
   */
  open?: boolean;



  /**
   * Default open state
   */
  defaultOpen?: boolean;



  /**
   * State callback
   */
  onOpenChange?: (
    open: boolean
  ) => void;



  /**
   * Placement
   */
  placement?: TooltipPlacement;



  /**
   * Alignment
   */
  align?: TooltipAlign;



  /**
   * Size
   */
  size?: TooltipSize;



  /**
   * Delay before showing
   */
  delayDuration?: number;



  /**
   * Close delay
   */
  closeDelayDuration?: number;



  /**
   * Disable tooltip
   */
  disabled?: boolean;



  /**
   * Use portal
   */
  portal?: boolean;



  /**
   * Close with escape
   */
  closeOnEscape?: boolean;



  /**
   * Close outside
   */
  closeOnOutsideClick?: boolean;



  /**
   * Trigger ref
   */
  triggerRef?: RefObject<
    HTMLDivElement | null
  >;



  /**
   * Content ref
   */
  contentRef?: RefObject<
    HTMLDivElement | null
  >;



  /**
   * Custom classes
   */
  contentClassName?: string;

  triggerClassName?: string;
}