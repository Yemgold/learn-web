


import type {
  HTMLAttributes,
} from "react";



export type SpinnerSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";



export type SpinnerVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning";



export type SpinnerSpeed =
  | "slow"
  | "normal"
  | "fast";





export interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement> {


  /**
   * Spinner size
   */
  size?: SpinnerSize;



  /**
   * Spinner color style
   */
  variant?: SpinnerVariant;



  /**
   * Animation speed
   */
  speed?: SpinnerSpeed;



  /**
   * Accessible label
   */
  label?: string;



  /**
   * Full screen loader
   */
  fullscreen?: boolean;

}