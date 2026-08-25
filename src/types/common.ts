


export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEntity extends Timestamp {
  id: string;
}