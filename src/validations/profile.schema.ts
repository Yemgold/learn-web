


import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(2).max(50),

  lastName: z.string().trim().min(2).max(50),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number is too short.")
    .max(20),

  avatar: z.url().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;