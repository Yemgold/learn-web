




"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

import { SECONDARY_PLAN } from "@/constants/secondary-plan";
import { useCreatePaymentIntent } from "@/hooks/payment/useCreatePayment";
import { useAuthStore } from "@/stores";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentSummaryCard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    loading,
    error,
    initializePayment,
  } = useCreatePaymentIntent();

  const total = formatNaira(SECONDARY_PLAN.price);

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Payment summary header */}
      <div className="border-b border-slate-100 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Payment Summary
            </h2>

            <p className="text-sm text-slate-500">
              Choose how to get your plan access.
            </p>
          </div>
        </div>

        {/* Student account */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Paying as
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {fullName || "Student"}
          </p>

          <p className="break-all text-sm text-slate-500">
            {user?.email || "Your account"}
          </p>
        </div>

        {/* Plan price */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              Secondary Plan
            </p>

            <p className="text-xs text-slate-400">
              1 year of access
            </p>
          </div>

          <p className="text-2xl font-extrabold text-slate-900">
            {total}
          </p>
        </div>
      </div>

      {/* Payment methods */}
      <div className="p-5 sm:p-7">
        <h3 className="font-bold text-slate-900">
          Select payment method
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Online payment */}
          <div className="rounded-2xl border border-blue-500 bg-blue-50 p-4 ring-1 ring-blue-500">
            <CreditCard className="h-6 w-6 text-blue-600" />

            <p className="mt-3 font-bold text-slate-900">
              Pay online
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Pay securely through our online payment gateway.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Online checkout
            </div>
          </div>

          {/* Agent purchase navigation */}
          <button
            type="button"
            onClick={() =>
              router.push("/student/access/secondary/agents")
            }
            className="group rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Users className="h-6 w-6 text-slate-500 transition group-hover:text-blue-600" />

            <p className="mt-3 font-bold text-slate-900">
              Buy from agent
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              View authorized agents and contact one to buy a PIN.
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
              View agents
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Online payment action */}
        <div className="mt-5">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={initializePayment}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Initializing payment...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay {total} online
              </>
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            Secure online checkout
          </p>
        </div>

        {/* PIN purchase information */}
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Prefer to buy a PIN from an agent?
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Open the agent directory to find contact details.
                After purchasing your PIN, redeem it on Learnyfi
                to activate your plan.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/student/access/secondary/agents")
                }
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                Find an agent
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
