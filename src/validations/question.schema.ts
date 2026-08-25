


import { z } from "zod";

export const questionSchema = z.object({
  subject: z.string().trim().min(2),

  text: z.string().trim().min(10),

  options: z
    .array(z.string().trim().min(1))
    .length(4, "Exactly four options are required."),

  answer: z.string().trim().min(1),

  explanation: z.string().trim().optional(),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;