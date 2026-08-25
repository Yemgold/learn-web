


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
  const { data } =
    await api.get<VerifyEmailResponse>(
      `/auth/verify-email/${token}`
    );

  return data;
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