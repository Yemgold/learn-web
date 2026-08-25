


import { z } from "zod";

export const competitionSchema = z
  .object({
    title: z.string().trim().min(5).max(150),

    description: z.string().trim().min(20),

    startDate: z.iso.datetime(),

    endDate: z.iso.datetime(),

    registrationDeadline: z.iso.datetime(),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    {
      path: ["endDate"],
      message: "End date must be after the start date.",
    }
  );

export type CompetitionFormValues = z.infer<typeof competitionSchema>;