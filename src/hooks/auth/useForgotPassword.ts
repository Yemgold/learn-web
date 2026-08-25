


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
  const { data } =
    await api.post<ForgotPasswordResponse>(
      "/api/v1/auth/forgot-password",
      payload
    );

  return data;
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