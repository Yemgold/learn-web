


"use client";

import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

interface CheckoutHeaderProps {
  onBack?: () => void;
}

export default function CheckoutHeader({
  onBack,
}: CheckoutHeaderProps) {
  return (
    <header className="mb-6 space-y-5 sm:mb-8">
      {/* Back navigation */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <ArrowLeft size={16} />
          Back to plans
        </button>
      )}

      {/* Checkout heading */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-5 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-200">
              <CreditCard size={14} />
              Secondary access
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck size={14} />
              Secure checkout
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            Complete your purchase
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Review your Secondary Plan and confirm your details
            before proceeding to secure payment.
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <BadgeCheck size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Payment verification
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                Your plan access will be activated after your
                payment has been successfully verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
