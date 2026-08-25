

import { apiClient } from "@/lib/api";
import type { ApiResponse, Payment } from "@/types";

export const paymentService = {
  initialize(data: Partial<Payment>) {
    return apiClient.post<ApiResponse<Payment>>(
      "/payments/initialize",
      data
    );
  },

  verify(reference: string) {
    return apiClient.get<ApiResponse<Payment>>(
      `/payments/verify/${reference}`
    );
  },
};