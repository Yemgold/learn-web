
"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SECONDARY_PLAN } from "@/constants/secondary-plan";
import PaymentSummaryCard from "@/components/checkout/PaymentSummaryCard";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

const planFeatures = [
  "Access to secondary school learning resources",
  "Practice questions and revision activities",
  "Support for your examination preparation",
];

export default function SecondaryCheckoutPage() {
  const router = useRouter();

  const price = formatNaira(SECONDARY_PLAN.price);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d1a] text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.07),transparent_45%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Navigation */}
        <div className="mb-7 flex items-center justify-between gap-4 sm:mb-9">
          <button
            type="button"
            onClick={() =>
              router.push("/student/access/secondary")
            }
            className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-400/30 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to plans
          </button>

          <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
            <LockKeyhole className="h-4 w-4 text-emerald-400" />
            Secure checkout
          </div>
        </div>

        {/* Page introduction */}
        <header className="mb-7 sm:mb-9">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-950/20 sm:h-14 sm:w-14">
              <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-300 sm:text-xs">
                  Learnyfi Access
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2 py-1 text-[10px] font-bold text-emerald-300 sm:text-xs">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Official checkout
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Activate your Secondary Plan
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Review your plan, confirm your account, and choose
                how you want to complete your payment.
              </p>
            </div>
          </div>

          {/* Checkout progress */}
          <div className="mt-6 flex items-center gap-3 sm:mt-7">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400" />
            </div>

            <span className="shrink-0 text-xs font-semibold text-slate-400">
              Final step
            </span>
          </div>
        </header>

        {/* Unified checkout panel */}
        <section className="overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/90 shadow-2xl shadow-black/25">
          {/* Plan overview */}
          <div className="relative overflow-hidden p-5 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/[0.08] blur-3xl" />

            <div className="relative grid grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
              {/* Plan information */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-3 py-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Recommended plan
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-bold text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                    Annual access
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Secondary Plan
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Your learning access plan for building knowledge,
                  practising questions, and preparing for examinations.
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4 sm:min-w-52 sm:flex-col sm:items-end sm:border-0 sm:bg-transparent sm:p-0">
                <div className="sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total amount
                  </p>

                  <p className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {price}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    For one year
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 sm:hidden">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Plan features */}
            <div className="relative mt-6 border-t border-slate-800 pt-5 sm:mt-7 sm:pt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Plan highlights
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {planFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex min-w-0 items-start gap-2.5"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                    </span>

                    <span className="text-sm leading-6 text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PaymentSummaryCard renders the account and payment sections */}
          <div className="px-5 pb-5 sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
            <PaymentSummaryCard />
          </div>
        </section>

        {/* Security notice */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 px-4 py-4 sm:items-center sm:px-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-200">
              Your checkout, your choice
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
              Use the configured online payment gateway or contact an
              agent for an access PIN. Only proceed with payment through
              trusted Learnyfi payment channels.
            </p>
          </div>

          <LockKeyhole className="mt-1 hidden h-4 w-4 shrink-0 text-slate-500 sm:block" />
        </div>

        {/* Footer */}
        <footer className="mt-6 flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Learnyfi. All rights reserved.</p>

          <button
            type="button"
            onClick={() =>
              router.push("/student/access/secondary")
            }
            className="inline-flex items-center gap-1.5 font-semibold text-slate-400 transition hover:text-white"
          >
            Review other plans
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </footer>
      </div>
    </main>
  );
}




































// "use client";

// import { ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";

// import {
//   CheckoutHeader,
//   PlanDetailsCard,
//   PaymentSummaryCard,
//   SecurePaymentNotice,
// } from "@/components/checkout";

// export default function SecondaryCheckoutPage() {
//   const router = useRouter();

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-6xl px-4 py-8">

//         <button
//           onClick={() =>
//             router.push("/student/access/secondary")
//           }
//           className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to plans
//         </button>

//         <CheckoutHeader />

//         <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
//           <PlanDetailsCard />

//           <div>
//             <PaymentSummaryCard />
//             <SecurePaymentNotice />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }