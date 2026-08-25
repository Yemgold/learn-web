



"use client";

import { useState } from "react";
import { createSecondaryPaymentIntent } from "@/lib/api/payment";

export function useCreatePaymentIntent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await createSecondaryPaymentIntent();

      if (
        !response.success ||
        !response.data?.paymentUrl
      ) {
        throw new Error(
          response.message ||
            "Unable to initialize payment.",
        );
      }

      window.location.assign(
        response.data.paymentUrl,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed.",
      );

      setLoading(false);
    }
  };

  return {
    loading,
    error,
    initializePayment,
  };
}