



import type {
  HTMLAttributes,
} from "react";



export type SkeletonVariant =
  | "default"
  | "rounded"
  | "circle"
  | "text";



export type SkeletonAnimation =
  | "pulse"
  | "shimmer"
  | "none";



export type SkeletonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";





export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {


  /**
   * Skeleton shape
   */
  variant?: SkeletonVariant;



  /**
   * Animation style
   */
  animation?: SkeletonAnimation;



  /**
   * Predefined size
   */
  size?: SkeletonSize;



  /**
   * Width override
   */
  width?: string | number;



  /**
   * Height override
   */
  height?: string | number;

}