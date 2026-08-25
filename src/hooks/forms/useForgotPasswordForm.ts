



"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation/auth";

export function useForgotPasswordForm() {
  return useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(
      forgotPasswordSchema
    ),

    defaultValues: {
      email: "",
    },

    mode: "onTouched",
  });
}