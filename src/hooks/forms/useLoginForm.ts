



"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/auth";

export function useLoginForm() {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },

    mode: "onTouched",
  });
}