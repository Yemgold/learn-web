




"use client";

import { CreditCard } from "lucide-react";
import { SECONDARY_PLAN } from "@/constants/secondary-plan";
import { useCreatePaymentIntent } from "@/hooks/payment/useCreatePayment";
import { useAuthStore } from "@/stores";

export default function PaymentSummaryCard() {
  const { user } = useAuthStore();

  const {
    loading,
    error,
    initializePayment,
  } = useCreatePaymentIntent();

  const total = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(SECONDARY_PLAN.price);

  return (
    <aside className="rounded-3xl border bg-white p-7">
      <h2 className="font-bold text-slate-900">
        Payment Summary
      </h2>

      <div className="mt-6">
        <p className="text-xs uppercase text-slate-400">
          Paying as
        </p>

        <p className="mt-1 font-semibold">
          {user?.firstName} {user?.lastName}
        </p>

        <p className="text-sm text-slate-500">
          {user?.email}
        </p>
      </div>

      <div className="mt-6 border-t pt-6">
        <div className="flex justify-between">
          <span>Total</span>

          <span className="text-2xl font-bold">
            {total}
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={initializePayment}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white disabled:bg-blue-400"
      >
        <CreditCard className="h-5 w-5" />

        {loading
          ? "Redirecting..."
          : `Pay ${total}`}
      </button>
    </aside>
  );
}