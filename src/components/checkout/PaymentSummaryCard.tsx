




"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
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
    <aside className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_-20px_rgba(15,23,42,0.22)] sm:rounded-3xl">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-6 text-white sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-indigo-300/10 blur-2xl" />

        <div className="relative flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 sm:h-12 sm:w-12 sm:rounded-2xl">
            <GraduationCap className="h-6 w-6 text-blue-200 sm:h-7 sm:w-7" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Learnyfi Access
            </p>

            <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
              Complete your purchase
            </h2>

            <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-300">
              Get access to your Secondary Plan using your preferred payment method.
            </p>
          </div>
        </div>

        {/* Plan price */}
        <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:mt-7 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-300">
                Secondary Plan
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">
                  1 year of access
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300 sm:text-xs">
                  <Check className="h-3 w-3" />
                  Annual plan
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                Total
              </p>

              <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {total}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-7">
        {/* Account information */}
        <section aria-labelledby="account-heading">
          <div className="flex items-center justify-between gap-3">
            <h3
              id="account-heading"
              className="text-sm font-bold text-slate-900"
            >
              Account details
            </h3>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              Your account
            </span>
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 sm:rounded-2xl sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-700">
              {fullName
                ? fullName
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0].toUpperCase())
                    .join("")
                : "ST"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {fullName || "Student"}
              </p>

              <p className="mt-0.5 break-all text-xs leading-5 text-slate-500 sm:text-sm">
                {user?.email || "Your Learnyfi account"}
              </p>
            </div>

            <LockKeyhole className="h-4 w-4 shrink-0 text-slate-400" />
          </div>
        </section>

        {/* Payment method selection */}
        <section
          aria-labelledby="payment-method-heading"
          className="mt-6 sm:mt-7"
        >
          <div>
            <h3
              id="payment-method-heading"
              className="text-base font-extrabold text-slate-900"
            >
              How would you like to pay?
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Choose online checkout or purchase a PIN from an agent.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Online payment option */}
            <div className="relative flex min-w-0 flex-col rounded-2xl border-2 border-blue-600 bg-blue-50/60 p-4 sm:p-5">
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                <Check className="h-3 w-3" />
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <CreditCard className="h-5 w-5" />
              </div>

              <h4 className="mt-4 pr-5 text-sm font-extrabold text-slate-900">
                Pay online
              </h4>

              <p className="mt-1.5 flex-1 text-xs leading-5 text-slate-600 sm:text-sm">
                Pay through our online payment gateway and continue with checkout.
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                <ShieldCheck className="h-4 w-4" />
                Secure checkout
              </div>
            </div>

            {/* Agent purchase option */}
            <button
              type="button"
              onClick={() =>
                router.push("/student/access/secondary/agents")
              }
              className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:border-blue-300 hover:bg-blue-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                <Users className="h-5 w-5" />
              </div>

              <h4 className="mt-4 text-sm font-extrabold text-slate-900">
                Buy from an agent
              </h4>

              <p className="mt-1.5 flex-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Find an agent, contact them, and obtain a PIN after payment.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-blue-700 sm:text-sm">
                Browse agents
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </section>

        {/* Online checkout */}
        <section className="mt-6 border-t border-slate-100 pt-5 sm:mt-7 sm:pt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              Amount payable
            </span>

            <span className="text-lg font-extrabold text-slate-950 sm:text-xl">
              {total}
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={initializePayment}
            disabled={loading}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl sm:py-4 sm:text-base"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <span>Initializing payment...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Continue to payment</span>
                <ArrowRight className="ml-auto h-4 w-4 sm:ml-1" />
              </>
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-slate-500 sm:text-xs">
            <LockKeyhole className="h-3.5 w-3.5 shrink-0" />
            Your payment is processed through the configured payment gateway.
          </div>
        </section>

        {/* PIN instructions */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:rounded-2xl sm:p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
            <Users className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 sm:text-sm">
              Prefer to pay through an agent?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Contact an agent to arrange payment and receive your PIN.
              Redeem it on Learnyfi to activate your plan.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/student/access/secondary/agents")
              }
              className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 sm:text-sm"
            >
              Find an agent
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

