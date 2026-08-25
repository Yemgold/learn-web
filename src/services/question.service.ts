


import { apiClient } from "@/lib/api";
import type {
  ApiResponse,
  PaginatedResponse,
  Question,
} from "@/types";

export const questionService = {
  getQuestions() {
    return apiClient.get<PaginatedResponse<Question>>(
      "/questions"
    );
  },

  getQuestion(id: string) {
    return apiClient.get<ApiResponse<Question>>(
      `/questions/${id}`
    );
  },

  createQuestion(data: Partial<Question>) {
    return apiClient.post<ApiResponse<Question>>(
      "/questions",
      data
    );
  },

  updateQuestion(id: string, data: Partial<Question>) {
    return apiClient.patch<ApiResponse<Question>>(
      `/questions/${id}`,
      data
    );
  },

  deleteQuestion(id: string) {
    return apiClient.delete<ApiResponse<null>>(
      `/questions/${id}`
    );
  },
};