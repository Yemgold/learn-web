



"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validation/auth";

export function useRegisterForm() {
  return useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },

    mode: "onTouched",
  });
}