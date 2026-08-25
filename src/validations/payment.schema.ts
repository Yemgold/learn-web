


import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero."),

  reference: z.string().trim().min(3),

  method: z.enum(["PAYSTACK", "FLUTTERWAVE"]),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;