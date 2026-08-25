




"use client";

import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api/axios";

/* ============================================================
   RESPONSE TYPES
   ============================================================ */

export interface VerifyPaymentResponse {
  success: boolean;

  data?: {
    paid?: boolean;
    paymentReference?: string;
    status?: string;
    plan?: string;
  };

  message?: string;
}

/* ============================================================
   VERIFY PAYMENT
   ============================================================ */

async function verifyPayment(
  reference: string,
): Promise<VerifyPaymentResponse> {
  if (!reference) {
    throw new Error(
      "Payment reference is required.",
    );
  }

  const response =
    await api.get<VerifyPaymentResponse>(
      `/payments/verify-payment/${encodeURIComponent(
        reference,
      )}`,
    );

  return response.data;
}

/* ============================================================
   HOOK
   ============================================================ */

export function useVerifyPayment() {
  return useMutation({
    mutationFn: ({
      reference,
    }: {
      reference: string;
    }) => verifyPayment(reference),
  });
}
