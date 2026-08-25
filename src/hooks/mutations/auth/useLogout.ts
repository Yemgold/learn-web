



"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services";

export function useLogout() {
  return useMutation({
    mutationKey: ["auth", "logout"],

    mutationFn: authService.logout,
  });
}