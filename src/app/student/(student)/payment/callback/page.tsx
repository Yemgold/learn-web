



"use client";

import { Suspense } from "react";

import PaymentCallbackContent from "./PaymentCallbackContent";

/* ============================================================
   LOADING FALLBACK
   ============================================================ */

function LoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <h1 className="text-2xl font-bold text-slate-900">
          Verifying Payment...
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Please wait while we confirm your payment.
        </p>
      </div>
    </main>
  );
}

/* ============================================================
   PAYMENT CALLBACK PAGE
   ============================================================ */

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
