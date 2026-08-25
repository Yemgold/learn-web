

import { apiClient } from "@/lib/api";
import type { ApiResponse, PaginatedResponse, Ranking } from "@/types";

export const rankingService = {
  getRankings() {
    return apiClient.get<PaginatedResponse<Ranking>>("/rankings");
  },
};