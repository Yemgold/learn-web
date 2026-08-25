


import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().trim().min(3).max(100),

  school: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(50),
});

export type TeamFormValues = z.infer<typeof teamSchema>;