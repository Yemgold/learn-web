


"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib";

interface ResendVerificationPayload {
  email: string;
}

interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

async function resendVerificationEmail(
  payload: ResendVerificationPayload
): Promise<ResendVerificationResponse> {
  const response =
    await api.apiClient.post<ResendVerificationResponse>(
      "/auth/resend-email-verification",
      payload
    );

  if (!response) {
    throw new Error(
      "Resend verification email returned an empty response."
    );
  }

  return response;
}

export function useResendVerificationEmail() {
  return useMutation<
    ResendVerificationResponse,
    Error,
    ResendVerificationPayload
  >({
    mutationFn: resendVerificationEmail,

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