


"use client";

import { useMutation } from "@tanstack/react-query";

import axios from "axios";

import { api } from "@/lib";

interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

async function verifyEmail(
  token: string
): Promise<VerifyEmailResponse> {
  const response = await api.apiClient.get<{
    success?: boolean;
    message?: string;
  }>(`/auth/verify-email/${token}`);

  if (!response) {
    throw new Error("Email verification returned an empty response.");
  }

  return {
    success: response.success ?? true,
    message: response.message ?? "Email verified successfully.",
  };
}
export function useVerifyEmail() {
  return useMutation<
    VerifyEmailResponse,
    Error,
    string
  >({
    mutationFn: verifyEmail,

    onSuccess: (data) => {
      console.log(
        "Email verified successfully",
        data
      );
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