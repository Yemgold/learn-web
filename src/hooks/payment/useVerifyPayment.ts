






"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface VerifyPaymentTransaction {
  _id?: string;
  walletId?: string;
  amountInKobo?: number;
  type?: string;
  description?: string;
  reference?: string;
  provider?: string;
  status?: string;
  verified?: boolean;
  category?: string;
  plan?: string;
  paymentReference?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    message?: string;
    success?: boolean;
    status?: number;
    data?: VerifyPaymentTransaction;
  };
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
    `/payments/verify-payment/${encodeURIComponent(
      provider,
    )}/${encodeURIComponent(reference)}`,
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
