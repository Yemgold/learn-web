

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;



export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "Full name is required."),

    lastName: z
      .string()
      .min(3, "Full name is required."),

    email: z
      .email("Please enter a valid email."),

    phone: z
      .string()
      .min(11, "Phone number is required."),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),

    confirmPassword: z.string(),

    acceptTerms: z.boolean().refine(
      (value) => value,
      {
        message: "You must accept the Terms and Conditions.",
      }
    ),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    }
  );

export type RegisterFormValues =
  z.infer<typeof registerSchema>;




  export const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address."),
});

export type ForgotPasswordFormValues =
  z.infer<typeof forgotPasswordSchema>;