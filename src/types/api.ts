



import { Pagination } from "./common";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];

  pagination: Pagination;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}