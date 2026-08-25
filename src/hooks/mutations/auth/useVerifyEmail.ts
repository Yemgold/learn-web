



"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services";

export function useVerifyEmail() {
  return useMutation({
    mutationKey: ["auth", "verify-email"],

    mutationFn: authService.verifyEmail,
  });
}