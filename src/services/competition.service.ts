

import { apiClient } from "@/lib/api";
import type {
  ApiResponse,
  Competition,
  PaginatedResponse,
} from "@/types";

export const competitionService = {
  getCompetitions() {
    return apiClient.get<PaginatedResponse<Competition>>(
      "/competitions"
    );
  },

  getCompetition(id: string) {
    return apiClient.get<ApiResponse<Competition>>(
      `/competitions/${id}`
    );
  },

  createCompetition(data: Partial<Competition>) {
    return apiClient.post<ApiResponse<Competition>>(
      "/competitions",
      data
    );
  },

  updateCompetition(id: string, data: Partial<Competition>) {
    return apiClient.patch<ApiResponse<Competition>>(
      `/competitions/${id}`,
      data
    );
  },

  deleteCompetition(id: string) {
    return apiClient.delete<ApiResponse<null>>(
      `/competitions/${id}`
    );
  },
};