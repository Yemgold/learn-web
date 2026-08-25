"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CheckoutHeader,
  PlanDetailsCard,
  PaymentSummaryCard,
  SecurePaymentNotice,
} from "@/components/checkout";

export default function SecondaryCheckoutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">

        <button
          onClick={() =>
            router.push("/student/access/secondary")
          }
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to plans
        </button>

        <CheckoutHeader />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <PlanDetailsCard />

          <div>
            <PaymentSummaryCard />
            <SecurePaymentNotice />
          </div>
        </div>
      </div>
    </main>
  );
}