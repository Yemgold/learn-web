


"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib";

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const response = await api.apiClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    payload
  );

  if (!response) {
    throw new Error("Forgot password request returned an empty response.");
  }

  return response;
}

export function useForgotPassword() {
  return useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordPayload
  >({
    mutationFn: forgotPassword,

    onSuccess: (data) => {
      console.log(data.message);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          error.response?.data?.message ??
            error.message
        );
      } else {
        console.error(error.message);
      }
    },
  });
}