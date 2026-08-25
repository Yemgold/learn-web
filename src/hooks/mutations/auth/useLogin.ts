


"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services";

export function useLogin() {
  return useMutation({
    mutationKey: ["auth", "login"],

    mutationFn: authService.login,
  });
}