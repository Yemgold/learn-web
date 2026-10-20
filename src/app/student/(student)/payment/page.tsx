




"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const messages: Record<string, string> = {
    missing_reference:
      "We returned from the payment process without a transaction reference. Your payment has not been confirmed.",
    verification_failed:
      "We could not confirm your payment. Please check your wallet balance and transaction history before trying again.",
  };

  const message =
    (error && messages[error]) ||
    "We could not determine your payment status. Please check your wallet before attempting another payment.";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertCircle size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Payment Not Confirmed
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {message}
        </p>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          If money was deducted from your account, do not
          immediately pay again. Check your wallet or contact
          support while the transaction is investigated.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/student/wallet"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Return to Wallet
          </Link>

          <Link
            href="/student"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading payment status...
          </p>
        </main>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
