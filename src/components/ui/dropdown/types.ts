

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Individual dropdown menu item.
 */
export interface DropdownItem {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * Display label.
   */
  label: ReactNode;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Optional keyboard shortcut.
   */
  shortcut?: ReactNode;

  /**
   * Optional navigation URL.
   */
  href?: string;

  /**
   * Disable this item.
   */
  disabled?: boolean;

  /**
   * Mark as destructive.
   */
  destructive?: boolean;

  /**
   * Divider shown before this item.
   */
  divider?: boolean;

  /**
   * Click callback.
   */
  onClick?: () => void;
}

/**
 * Dropdown component props.
 */
export interface DropdownProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Trigger element.
   */
  trigger: ReactNode;

  /**
   * Dropdown items.
   */
  items: DropdownItem[];

  /**
   * Controlled open state.
   */
  open?: boolean;

  /**
   * Default open state.
   */
  defaultOpen?: boolean;

  /**
   * Open state callback.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Menu placement.
   */
  placement?:
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end";

  /**
   * Match trigger width.
   */
  fullWidth?: boolean;

  /**
   * Close after selecting an item.
   */
  closeOnSelect?: boolean;

  /**
   * Show menu arrow.
   */
  showArrow?: boolean;

  /**
   * Additional menu classes.
   */
  menuClassName?: string;

  /**
   * Additional item classes.
   */
  itemClassName?: string;
}