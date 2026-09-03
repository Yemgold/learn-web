




import { api } from "./axios";
import type { CreatePaymentIntentResponse } from "@/types/payment";

export async function createSecondaryPaymentIntent() {
  const response =
    await api.post<CreatePaymentIntentResponse>(
      "/payments/create-payment-intent/paystack/SECONDARY",
    );

  return response.data;
}





