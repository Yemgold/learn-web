


import type {
  ReactNode,
} from "react";



/**
 * Column definition
 */
export interface TableColumn<T> {


  /**
   * Unique column key
   */
  id: string;



  /**
   * Header label
   */
  header: ReactNode;



  /**
   * Data accessor
   */
  accessorKey?: keyof T;



  /**
   * Custom cell renderer
   */
  cell?: (
    row: T,
    index: number
  ) => ReactNode;



  /**
   * Column width
   */
  width?: string;



  /**
   * Enable sorting
   */
  sortable?: boolean;



  /**
   * Enable filtering
   */
  filterable?: boolean;



  /**
   * Hide column
   */
  hidden?: boolean;

}





/**
 * Sorting configuration
 */
export interface TableSort {


  id: string;


  direction:
    | "asc"
    | "desc";

}







/**
 * Filter configuration
 */
export interface TableFilter {


  id: string;


  value: unknown;

}








/**
 * Pagination configuration
 */
export interface TablePagination {


  page: number;


  pageSize: number;


  total: number;


  onPageChange?: (
    page: number
  ) => void;


  onPageSizeChange?: (
    size: number
  ) => void;

}









/**
 * Row selection
 */
export interface TableSelection<T> {


  selectedRows: T[];



  onSelectionChange?: (
    rows: T[]
  ) => void;

}









/**
 * Data table props
 */
export interface DataTableProps<T> {


  columns:
    TableColumn<T>[];



  data:
    T[];



  loading?: boolean;



  emptyMessage?: ReactNode;



  pagination?: TablePagination;



  sorting?: TableSort;



  filters?: TableFilter[];



  selectable?: boolean;



  selection?: TableSelection<T>;



  rowKey:
    keyof T;



  className?: string;

}