


import { apiClient } from "@/lib/api";
import type { ApiResponse, PaginatedResponse, Team } from "@/types";

export const teamService = {
  getTeams() {
    return apiClient.get<PaginatedResponse<Team>>("/teams");
  },

  getTeam(id: string) {
    return apiClient.get<ApiResponse<Team>>(`/teams/${id}`);
  },

  createTeam(data: Partial<Team>) {
    return apiClient.post<ApiResponse<Team>>("/teams", data);
  },

  updateTeam(id: string, data: Partial<Team>) {
    return apiClient.patch<ApiResponse<Team>>(
      `/teams/${id}`,
      data
    );
  },

  deleteTeam(id: string) {
    return apiClient.delete<ApiResponse<null>>(`/teams/${id}`);
  },
};