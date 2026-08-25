






import type { ReactNode } from "react";
import type { HTMLAttributes } from "react";

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Image URL.
   */
  src?: string;

  /**
   * Alternative text.
   */
  alt?: string;

  /**
   * User name used for fallback initials.
   */
  name?: string;

  /**
   * Custom fallback content.
   */
  fallback?: ReactNode;

  /**
   * Avatar size.
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * Avatar shape.
   */
  rounded?: "default" | "square" | "full";

  /**
   * Status indicator.
   */
  status?:
    | "online"
    | "offline"
    | "busy"
    | "away";

  /**
   * Show status indicator.
   */
  showStatus?: boolean;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Image loading strategy.
   */
  loadingMode?: "lazy" | "eager";

  /**
   * Custom image class.
   */
  imageClassName?: string;

  /**
   * Custom fallback class.
   */
  fallbackClassName?: string;

  /**
   * Container class.
   */
  containerClassName?: string;
}