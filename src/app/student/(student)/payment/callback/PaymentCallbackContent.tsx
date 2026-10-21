


"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPayment } from "@/hooks/payment/useVerifyPayment";

export default function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: verifyPayment, isPending } = useVerifyPayment();

  const hasVerified = useRef(false);
  const queryString = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(queryString);

    const reference =
      params.get("paymentReference") ||
      params.get("transactionReference") ||
      params.get("transaction_reference") ||
      params.get("reference") ||
      params.get("trxref");

    console.log("========== PAYMENT CALLBACK ==========");
    console.log("Callback URL:", window.location.href);
    console.log("Reference:", reference || "(none)");

    if (!reference) {
      router.replace("/student/payment?error=missing_reference");
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyPayment(
      { provider: "monnify", reference },
      {
        onSuccess: (response) => {
          console.log(
            "Full payment verification response:",
            JSON.stringify(response, null, 2),
          );

          // API response structure:
          // response.data.data.data = transaction
          const transaction = response?.data?.data;

          const status =
            typeof transaction?.status === "string"
              ? transaction.status.toUpperCase()
              : "";

          const isVerified = transaction?.verified === true;
          const isSuccessful = status === "SUCCESSFUL";

          if (
            response?.success === true &&
            isVerified &&
            isSuccessful
          ) {
            const transactionReference =
              transaction.reference || reference;

            const isWalletFunding =
              transaction.description === "User funding wallet." ||
              transactionReference.startsWith("FUND_WALLET_");

            const type = isWalletFunding ? "wallet" : "subscription";

            router.replace(
              `/student/payment/success?type=${type}&reference=${encodeURIComponent(
                transactionReference,
              )}`,
            );

            return;
          }

          if (
            status === "PENDING" ||
            status === "PROCESSING"
          ) {
            router.replace(
              `/student/payment?error=verification_pending&reference=${encodeURIComponent(
                reference,
              )}`,
            );
            return;
          }

          router.replace(
            `/student/payment?error=verification_failed&reference=${encodeURIComponent(
              reference,
            )}`,
          );
        },

        onError: (error) => {
          console.error(
            "Payment verification request failed:",
            error,
          );

          router.replace(
            `/student/payment?error=verification_unavailable&reference=${encodeURIComponent(
              reference,
            )}`,
          );
        },
      },
    );
  }, [queryString, router, verifyPayment]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <h1 className="text-2xl font-bold text-slate-900">
          {isPending
            ? "Verifying Payment..."
            : "Checking Payment..."}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Please wait while we check your transaction.
          Do not close this page.
        </p>
      </div>
    </main>
  );
}
