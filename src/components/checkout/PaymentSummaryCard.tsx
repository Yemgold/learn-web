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
    <aside className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-violet-500/[0.06] blur-3xl" />

      {/* Landscape checkout header */}
      <div className="relative border-b border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-5 sm:p-7 lg:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-indigo-200 sm:h-14 sm:w-14">
              <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
                  Learnyfi Access
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300 sm:text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure checkout
                </span>
              </div>

              <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
                Complete your purchase
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Activate your Secondary Plan through online payment
                or by purchasing an access PIN from an agent.
              </p>
            </div>
          </div>

          {/* Price summary */}
          <div className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5 md:min-w-[230px] md:flex-col md:items-start">
            <div>
              <p className="text-sm font-bold text-white">
                Secondary Plan
              </p>

              <p className="mt-1 text-xs text-slate-400">
                1 year of access
              </p>

              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 sm:text-xs">
                <Check className="h-3 w-3" />
                Annual plan
              </span>
            </div>

            <div className="shrink-0 text-right md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                Total payable
              </p>

              <p className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main landscape content */}
      <div className="relative grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8 lg:p-8">
        {/* LEFT COLUMN: Account and plan information */}
        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="account-heading">
            <div className="flex items-center justify-between gap-3">
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
          <section className="flex flex-1 items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-emerald-300">
              <Users className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                Prefer to pay through an agent?
              </p>

              <p className="mt-1 text-xs leading-6 text-slate-400 sm:text-sm">
                Contact an agent to arrange payment and receive your
                PIN. Redeem it on Learnyfi to activate your plan.
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
          </section>
        </div>

        {/* RIGHT COLUMN: Payment methods and checkout */}
        <div className="flex min-w-0 flex-col">
          <section aria-labelledby="payment-method-heading">
            <h3
              id="payment-method-heading"
              className="text-base font-extrabold text-white sm:text-lg"
            >
              How would you like to pay?
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Choose online checkout or purchase a PIN from an agent.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Online payment */}
              <div className="relative flex min-w-0 flex-col rounded-2xl border-2 border-indigo-500/70 bg-indigo-500/[0.08] p-4 sm:p-5">
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                  <Check className="h-3 w-3" />
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 sm:h-11 sm:w-11">
                  <CreditCard className="h-5 w-5" />
                </div>

                <h4 className="mt-3 pr-6 text-sm font-extrabold text-white">
                  Pay online
                </h4>

                <p className="mt-2 flex-1 text-xs leading-6 text-slate-400 sm:text-sm">
                  Pay through the configured payment gateway and
                  continue to checkout.
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition group-hover:border-emerald-400/20 group-hover:bg-emerald-400/10 group-hover:text-emerald-300 sm:h-11 sm:w-11">
                  <Users className="h-5 w-5" />
                </div>

                <h4 className="mt-3 text-sm font-extrabold text-white">
                  Buy from an agent
                </h4>

                <p className="mt-2 flex-1 text-xs leading-6 text-slate-400 sm:text-sm">
                  Find an agent, arrange payment, and obtain an
                  access PIN to activate your plan.
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 sm:text-sm">
                  Browse agents
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </section>

          {/* Checkout action */}
          <section className="mt-6 border-t border-slate-800 pt-5 sm:pt-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">
                Amount payable
              </span>

              <span className="text-lg font-black text-white sm:text-xl">
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
    </aside>
  );
}













// "use client";

// import { useRouter } from "next/navigation";
// import {
//   ArrowRight,
//   BadgeCheck,
//   Check,
//   CreditCard,
//   GraduationCap,
//   LoaderCircle,
//   LockKeyhole,
//   ShieldCheck,
//   Users,
// } from "lucide-react";

// import { SECONDARY_PLAN } from "@/constants/secondary-plan";
// import { useCreatePaymentIntent } from "@/hooks/payment/useCreatePayment";
// import { useAuthStore } from "@/stores";

// function formatNaira(amount: number) {
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

// export default function PaymentSummaryCard() {
//   const router = useRouter();
//   const { user } = useAuthStore();

//   const { loading, error, initializePayment } =
//     useCreatePaymentIntent();

//   const total = formatNaira(SECONDARY_PLAN.price);

//   const fullName = [user?.firstName, user?.lastName]
//     .filter(Boolean)
//     .join(" ");

//   const initials =
//     fullName
//       .split(/\s+/)
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((part) => part[0].toUpperCase())
//       .join("") || "ST";

//   const goToAgents = () => {
//     router.push("/student/access/secondary/agents");
//   };

//   return (
//     <aside className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
//       {/* Checkout header */}
//       <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 px-5 py-6 sm:px-8 sm:py-8">
//         <div className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />

//         <div className="relative flex items-start gap-3">
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-indigo-200">
//             <GraduationCap className="h-7 w-7" />
//           </div>

//           <div className="min-w-0 flex-1">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
//                 Learnyfi Access
//               </span>

//               <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300 sm:text-xs">
//                 <ShieldCheck className="h-3.5 w-3.5" />
//                 Secure checkout
//               </span>
//             </div>

//             <h2 className="mt-3 text-xl font-black tracking-tight text-white sm:text-2xl">
//               Complete your purchase
//             </h2>

//             <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
//               Activate your Secondary Plan through online payment
//               or by purchasing an access PIN from an agent.
//             </p>
//           </div>
//         </div>

//         {/* Plan summary */}
//         <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:mt-7 sm:p-5">
//           <div className="flex items-center justify-between gap-4">
//             <div className="min-w-0">
//               <p className="text-sm font-bold text-white">
//                 Secondary Plan
//               </p>

//               <p className="mt-1 text-xs text-slate-400">
//                 1 year of access
//               </p>

//               <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 sm:text-xs">
//                 <Check className="h-3 w-3" />
//                 Annual plan
//               </span>
//             </div>

//             <div className="shrink-0 text-right">
//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
//                 Total
//               </p>

//               <p className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
//                 {total}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-7 p-4 sm:p-7">
//         {/* Account details */}
//         <section aria-labelledby="account-heading">
//           <div className="flex items-center justify-between gap-3">
//             <h3
//               id="account-heading"
//               className="text-sm font-extrabold text-white sm:text-base"
//             >
//               Account details
//             </h3>

//             <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
//               <BadgeCheck className="h-4 w-4" />
//               Your account
//             </span>
//           </div>

//           <div className="mt-3 flex min-w-0 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 sm:p-4">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/15 text-sm font-black text-indigo-200">
//               {initials}
//             </div>

//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-bold text-white">
//                 {fullName || "Student"}
//               </p>

//               <p className="mt-1 break-all text-xs leading-5 text-slate-400 sm:text-sm">
//                 {user?.email || "Your Learnyfi account"}
//               </p>
//             </div>

//             <LockKeyhole className="h-4 w-4 shrink-0 text-slate-500" />
//           </div>
//         </section>

//         {/* Payment options */}
//         <section aria-labelledby="payment-method-heading">
//           <div>
//             <h3
//               id="payment-method-heading"
//               className="text-base font-extrabold text-white sm:text-lg"
//             >
//               How would you like to pay?
//             </h3>

//             <p className="mt-1 text-sm leading-6 text-slate-400">
//               Choose online checkout or purchase a PIN from an agent.
//             </p>
//           </div>

//           <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
//             {/* Online payment */}
//             <div className="relative flex min-w-0 flex-col rounded-2xl border-2 border-indigo-500/70 bg-indigo-500/[0.08] p-4 sm:p-5">
//               <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
//                 <Check className="h-3 w-3" />
//               </span>

//               <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
//                 <CreditCard className="h-5 w-5" />
//               </div>

//               <h4 className="mt-4 pr-6 text-sm font-extrabold text-white">
//                 Pay online
//               </h4>

//               <p className="mt-2 flex-1 text-xs leading-6 text-slate-400 sm:text-sm">
//                 Pay through the configured payment gateway and
//                 continue to checkout.
//               </p>

//               <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300">
//                 <ShieldCheck className="h-4 w-4" />
//                 Secure checkout
//               </div>
//             </div>

//             {/* Agent PIN purchase */}
//             <button
//               type="button"
//               onClick={goToAgents}
//               className="group flex min-w-0 flex-col rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-left transition duration-200 hover:border-emerald-400/40 hover:bg-emerald-400/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 sm:p-5"
//             >
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition group-hover:border-emerald-400/20 group-hover:bg-emerald-400/10 group-hover:text-emerald-300">
//                 <Users className="h-5 w-5" />
//               </div>

//               <h4 className="mt-4 text-sm font-extrabold text-white">
//                 Buy from an agent
//               </h4>

//               <p className="mt-2 flex-1 text-xs leading-6 text-slate-400 sm:text-sm">
//                 Find an agent, arrange payment, and obtain an
//                 access PIN to activate your plan.
//               </p>

//               <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 sm:text-sm">
//                 Browse agents
//                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//               </span>
//             </button>
//           </div>
//         </section>

//         {/* Online payment action */}
//         <section className="border-t border-slate-800 pt-5 sm:pt-6">
//           <div className="flex items-center justify-between gap-3">
//             <span className="text-sm text-slate-400">
//               Amount payable
//             </span>

//             <span className="text-lg font-black text-white sm:text-xl">
//               {total}
//             </span>
//           </div>

//           {error && (
//             <div
//               role="alert"
//               className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] p-3.5 text-sm leading-6 text-red-300"
//             >
//               {error}
//             </div>
//           )}

//           <button
//             type="button"
//             onClick={initializePayment}
//             disabled={loading}
//             className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl sm:py-4 sm:text-base"
//           >
//             {loading ? (
//               <>
//                 <LoaderCircle className="h-5 w-5 animate-spin" />
//                 <span>Initializing payment...</span>
//               </>
//             ) : (
//               <>
//                 <CreditCard className="h-5 w-5" />
//                 <span>Continue to payment</span>
//                 <ArrowRight className="ml-auto h-4 w-4 sm:ml-1" />
//               </>
//             )}
//           </button>

//           <div className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-slate-500 sm:text-xs">
//             <LockKeyhole className="h-3.5 w-3.5 shrink-0" />
//             Your payment is processed through the configured payment gateway.
//           </div>
//         </section>

//         {/* Agent PIN information */}
//         <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 sm:p-4">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-emerald-300">
//             <Users className="h-4 w-4" />
//           </div>

//           <div className="min-w-0 flex-1">
//             <p className="text-sm font-bold text-white">
//               Prefer to pay through an agent?
//             </p>

//             <p className="mt-1 text-xs leading-6 text-slate-400 sm:text-sm">
//               Contact an agent to arrange payment and receive your
//               PIN. Redeem it on Learnyfi to activate your plan.
//             </p>

//             <button
//               type="button"
//               onClick={goToAgents}
//               className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg text-xs font-bold text-emerald-300 transition hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:text-sm"
//             >
//               Find an agent
//               <ArrowRight className="h-3.5 w-3.5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }
