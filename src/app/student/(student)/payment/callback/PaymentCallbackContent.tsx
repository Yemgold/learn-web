




"use client";

import { useEffect, useRef } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useVerifyPayment } from "@/hooks/payment/useVerifyPayment";

/* ============================================================
   PAYMENT CALLBACK CONTENT
   ============================================================ */

export default function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const verifyPaymentMutation =
    useVerifyPayment();

  /*
   * Prevent the verification request from being
   * triggered more than once.
   */
  const hasVerified = useRef(false);

  /* ============================================================
     PAYMENT REFERENCE
     ============================================================ */

  const reference =
    searchParams.get("reference") ??
    searchParams.get("trxref");

  /* ============================================================
     VERIFY PAYMENT
     ============================================================ */

  useEffect(() => {
    /*
     * No payment reference was returned by Paystack.
     */
    if (!reference) {
      router.replace(
        "/student/payment?error=missing_reference",
      );

      return;
    }

    /*
     * Prevent duplicate verification requests.
     */
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    console.log(
      "========== PAYMENT CALLBACK ==========",
    );

    console.log(
      "Payment reference:",
      reference,
    );

    verifyPaymentMutation.mutate(
      {
        reference,
      },
      {
        onSuccess: (response) => {
          console.log(
            "========== PAYMENT VERIFICATION RESPONSE ==========",
          );

          console.log(
            response,
          );

          /*
           * Payment successfully verified.
           */
          if (
            response.success &&
            response.data?.paid === true
          ) {
            console.log(
              "Payment verified successfully.",
            );

            router.replace(
              `/student/payment/success?reference=${encodeURIComponent(
                reference,
              )}`,
            );

            return;
          }

          /*
           * Backend responded, but payment was not
           * confirmed as successful.
           */
          console.warn(
            "Payment verification failed:",
            response,
          );

          router.replace(
            "/student/payment?error=verification_failed",
          );
        },

        onError: (error) => {
          console.error(
            "========== PAYMENT VERIFICATION ERROR ==========",
          );

          console.error(
            error,
          );

          router.replace(
            "/student/payment?error=verification_failed",
          );
        },
      },
    );
  }, [
    reference,
    router,
    verifyPaymentMutation,
  ]);

  /* ============================================================
     LOADING STATE
     ============================================================ */

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">

        {/* Spinner */}

        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        {/* Title */}

        <h1 className="text-2xl font-bold text-slate-900">
          Verifying Payment
        </h1>

        {/* Description */}

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Please wait while we confirm your
          payment. Do not close this page.
        </p>

      </div>
    </main>
  );
}