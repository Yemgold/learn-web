


import { apiClient } from "@/lib/api";
import type { ApiResponse, PaginatedResponse, User } from "@/types";

export const userService = {
  getProfile() {
    return apiClient.get<ApiResponse<User>>("/users/profile");
  },

  updateProfile(data: Partial<User>) {
    return apiClient.patch<ApiResponse<User>>(
      "/users/profile",
      data
    );
  },

  getUsers() {
    return apiClient.get<PaginatedResponse<User>>("/users");
  },

  getUser(id: string) {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  },
};