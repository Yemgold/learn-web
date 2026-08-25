



"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services";

export function useRegister() {
  return useMutation({
    mutationKey: ["auth", "register"],

    mutationFn: authService.register,
  });
}