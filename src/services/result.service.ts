

import { apiClient } from "@/lib/api";
import type { ApiResponse, PaginatedResponse, Result } from "@/types";

export const resultService = {
  getResults() {
    return apiClient.get<PaginatedResponse<Result>>("/results");
  },

  getResult(id: string) {
    return apiClient.get<ApiResponse<Result>>(`/results/${id}`);
  },
};