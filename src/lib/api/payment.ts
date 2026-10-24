




import { api } from "./axios";
import type { CreatePaymentIntentResponse } from "@/types/payment";
import axios from "axios";

type ApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
  success?: boolean;
  status?: number;
};

function getPaymentErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    // Use the actual message returned by the backend.
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }

    // Handle backend validation errors.
    if (data?.errors && typeof data.errors === "object") {
      const messages = Object.values(data.errors)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        );

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    // Handle HTTP errors when the backend provides no message.
    const status = error.response?.status;

    if (status === 400) {
      return "Invalid payment request. Please check your details and try again.";
    }

    if (status === 401) {
      return "You are not authorized to complete this request. Please sign in again if necessary.";
    }

    if (status === 403) {
      return "You do not have permission to complete this payment.";
    }

    if (status === 404) {
      return "The payment service or requested plan could not be found.";
    }

    if (status === 409) {
      return "This payment conflicts with an existing transaction or purchase.";
    }

    if (status === 422) {
      return "Your payment request could not be processed. Please check your details.";
    }

    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (status !== undefined && status >= 500) {
      return "The server encountered an error. Please try again later.";
    }

    if (error.code === "ECONNABORTED") {
      return "The payment request timed out. Please try again.";
    }

    if (!error.response) {
      return "Unable to connect to the payment service. Check your internet connection.";
    }

    return error.message || "Payment failed. Please try again.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "An unexpected error occurred while processing your payment.";
}

export async function createSecondaryPaymentIntent() {
  try {
    const response =
      await api.post<CreatePaymentIntentResponse>(
        "/payments/create-payment-intent/monnify/SECONDARY",
      );

    return response.data;
  } catch (error: unknown) {
    throw new Error(getPaymentErrorMessage(error));
  }
}





