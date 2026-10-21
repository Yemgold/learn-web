


"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

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

async function verifyPayment(
  provider: string,
  reference: string,
): Promise<VerifyPaymentResponse> {
  if (!reference) {
    throw new Error("Payment reference is required.");
  }

  if (!provider) {
    throw new Error("Payment provider is required.");
  }

  const response = await api.get<VerifyPaymentResponse>(
    `/payments/verify-payment/${encodeURIComponent(provider)}/${encodeURIComponent(reference)}`,
  );

  return response.data;
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: ({
      provider,
      reference,
    }: {
      provider: string;
      reference: string;
    }) => verifyPayment(provider, reference),
  });
}