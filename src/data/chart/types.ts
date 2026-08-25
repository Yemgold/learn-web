


import type {
  ReactNode,
} from "react";



/**
 * Supported chart types
 */
export type ChartType =

  | "bar"

  | "line"

  | "area"

  | "pie";








/**
 * Chart size
 */
export type ChartSize =

  | "sm"

  | "md"

  | "lg"

  | "xl";









/**
 * Chart data item
 */
export interface ChartData {


  /**
   * X-axis identifier
   */
  name: string;



  /**
   * Dynamic values
   */
  [key: string]: string | number;

}









/**
 * Data series configuration
 */
export interface ChartSeries {


  /**
   * Data key from dataset
   */
  dataKey: string;



  /**
   * Display name
   */
  name?: string;



  /**
   * Optional color
   */
  color?: string;



  /**
   * Stack group
   */
  stackId?: string;

}









/**
 * Axis configuration
 */
export interface ChartAxis {


  label?: string;



  dataKey?: string;



  hidden?: boolean;

}









/**
 * Tooltip configuration
 */
export interface ChartTooltipProps {


  enabled?: boolean;



  formatter?: (
    value: number | string,
    name: string
  ) => ReactNode;


}









/**
 * Legend configuration
 */
export interface ChartLegendProps {


  enabled?: boolean;



  position?:

    | "top"

    | "bottom"

    | "left"

    | "right";


}









/**
 * Main chart props
 */
export interface ChartProps {


  type?:
    ChartType;



  data:
    ChartData[];



  series:
    ChartSeries[];



  title?: ReactNode;



  description?: ReactNode;



  size?:
    ChartSize;



  height?:
    number;



  width?:
    number;



  showGrid?: boolean;



  tooltip?:
    ChartTooltipProps;



  legend?:
    ChartLegendProps;



  loading?: boolean;



  className?: string;

}