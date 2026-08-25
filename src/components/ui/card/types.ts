



import type { ReactNode } from "react";
import type { HTMLAttributes } from "react";


export interface CardProps
  extends HTMLAttributes<HTMLDivElement> {

  /**
   * Card content.
   */
  children?: ReactNode;


  /**
   * Card visual style.
   */
  variant?:
    | "default"
    | "outlined"
    | "elevated"
    | "ghost";


  /**
   * Card size.
   */
  size?:
    | "sm"
    | "md"
    | "lg";


  /**
   * Header section.
   */
  header?: ReactNode;


  /**
   * Footer section.
   */
  footer?: ReactNode;


  /**
   * Optional image.
   */
  image?: ReactNode;


  /**
   * Makes card interactive.
   */
  clickable?: boolean;


  /**
   * Hover animation.
   */
  hoverable?: boolean;


  /**
   * Loading skeleton state.
   */
  loading?: boolean;


  /**
   * Remove default padding.
   */
  noPadding?: boolean;


  /**
   * Rounded style.
   */
  rounded?:
    | "none"
    | "md"
    | "lg"
    | "xl";


  /**
   * Custom header class.
   */
  headerClassName?: string;


  /**
   * Custom content class.
   */
  contentClassName?: string;


  /**
   * Custom footer class.
   */
  footerClassName?: string;


  /**
   * Custom image class.
   */
  imageClassName?: string;
}