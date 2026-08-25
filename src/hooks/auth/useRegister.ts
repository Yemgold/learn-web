



"use client";

import { useMutation } from "@tanstack/react-query";

import { 
  registerUser,
  RegisterRequest,
} from "@/lib/api/auth";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      registerUser(data),
  });
}