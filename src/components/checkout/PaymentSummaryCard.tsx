



"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
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

  const { loading, error, initializePayment } =
    useCreatePaymentIntent();

  const total = formatNaira(SECONDARY_PLAN.price);

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "ST";

  const goToAgents = () => {
    router.push("/student/access/secondary/agents");
  };

  return (
    <section className="w-full min-w-0">
      {/* Payment content: landscape layout on larger screens */}
      <div className="grid grid-cols-1 gap-6 border-t border-slate-800 pt-6 sm:pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        {/* Left column: account details and agent information */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Account details */}
          <section aria-labelledby="account-heading">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3
                id="account-heading"
                className="text-sm font-extrabold text-white sm:text-base"
              >
                Account details
              </h3>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <BadgeCheck className="h-4 w-4" />
                Your account
              </span>
            </div>

            <div className="mt-3 flex min-w-0 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 sm:p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/15 text-sm font-black text-indigo-200">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {fullName || "Student"}
                </p>

                <p className="mt-1 break-all text-xs leading-5 text-slate-400 sm:text-sm">
                  {user?.email || "Your Learnyfi account"}
                </p>
              </div>

              <LockKeyhole className="h-4 w-4 shrink-0 text-slate-500" />
            </div>
          </section>

          {/* Agent PIN information */}
          <div className="flex flex-1 items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-emerald-300">
              <Users className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                Prefer to pay through an agent?
              </p>

              <p className="mt-1 text-xs leading-6 text-slate-400 sm:text-sm">
                Contact an agent to arrange payment and receive
                your access PIN. Redeem it on Learnyfi to activate
                your Secondary Plan.
              </p>

              <button
                type="button"
                onClick={goToAgents}
                className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg text-xs font-bold text-emerald-300 transition hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:text-sm"
              >
                Find an agent
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: payment methods and checkout */}
        <div className="flex min-w-0 flex-col">
          <section aria-labelledby="payment-method-heading">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id="payment-method-heading"
                  className="text-base font-extrabold text-white sm:text-lg"
                >
                  Choose your payment method
                </h3>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure
                </span>
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Pay online or purchase an access PIN from an agent.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {/* Online payment */}
              <div className="relative flex min-w-0 flex-col rounded-2xl border-2 border-indigo-500/70 bg-indigo-500/[0.08] p-4 sm:p-5">
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                  <Check className="h-3 w-3" />
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
                  <CreditCard className="h-5 w-5" />
                </div>

                <h4 className="mt-3 pr-6 text-sm font-extrabold text-white">
                  Pay online
                </h4>

                <p className="mt-2 flex-1 text-xs leading-6 text-slate-400 sm:text-sm">
                  Continue to the configured payment gateway to
                  complete your purchase.
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <ShieldCheck className="h-4 w-4" />
                  Secure checkout
                </div>
              </div>

              {/* Agent PIN purchase */}
              <button
                type="button"
                onClick={goToAgents}
                className="group flex min-w-0 flex-col rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-left transition duration-200 hover:border-emerald-400/40 hover:bg-emerald-400/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition group-hover:border-emerald-400/20 group-hover:bg-emerald-400/10 group-hover:text-emerald-300">
                  <Users className="h-5 w-5" />
                </div>

                <h4 className="mt-3 text-sm font-extrabold text-white">
                  Buy from an agent
                </h4>

                <p className="mt-2 flex-1 text-xs leading-6 text-slate-400 sm:text-sm">
                  Find an agent, arrange payment, and obtain your
                  activation PIN.
                </p>

                <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 sm:text-sm">
                  Browse agents
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </section>

          {/* Checkout action */}
          <section className="mt-5 border-t border-slate-800 pt-5 sm:mt-6 sm:pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-300">
                  Amount payable
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Secondary Plan · Annual access
                </p>
              </div>

              <span className="shrink-0 text-xl font-black text-white sm:text-2xl">
                {total}
              </span>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] p-3.5 text-sm leading-6 text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={initializePayment}
              disabled={loading}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl sm:py-4 sm:text-base"
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
        </div>
      </div>
    </section>
  );
}