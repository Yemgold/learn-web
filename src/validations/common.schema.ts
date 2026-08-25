


import { z } from "zod";

export const emailSchema = z
  .email("Enter a valid email address.")
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/\d/);