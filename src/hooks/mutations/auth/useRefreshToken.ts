



"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services";

export function useRefreshToken() {
  return useMutation({
    mutationKey: ["auth", "refresh"],

    mutationFn: authService.refresh,
  });
}