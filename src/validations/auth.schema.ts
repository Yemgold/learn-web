


import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(100, "Password is too long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/\d/, "Password must contain at least one number.");

export const loginSchema = z.object({
  email: z
    .email("Enter a valid email address.")
    .trim()
    .toLowerCase(),

  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name is required.")
      .max(50),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name is required.")
      .max(50),

    email: z
      .email("Enter a valid email address.")
      .trim()
      .toLowerCase(),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;