
"use client";

import { useRouter } from "next/navigation";

import {
  AccessHeader,
  AccessPlanGrid,
  type AccessPlan,
} from "@/components/access";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

/* ============================================================
   SECONDARY ACCESS PAGE
   ============================================================ */

export default function SecondaryAccessPage() {
  const router = useRouter();

  const handleSelectPlan = (plan: AccessPlan) => {
    if (plan.disabled) {
      return;
    }

    if (plan.id === "secondary-free") {
      router.push("/student/dashboard");
      return;
    }

    if (plan.id === "secondary-standard") {
      router.push(
        `/student/access/secondary/checkout?plan=${encodeURIComponent(
          plan.id,
        )}`,
      );
    }
  };

  return (
    <main className="min-h-full bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
        {/* Back navigation */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/student/dashboard")}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </button>
        </div>

        {/* Page heading */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-5 shadow-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-bold text-indigo-200">
                <BadgeCheck size={14} />
                Secondary education
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <ShieldCheck size={14} />
                Secure access
              </span>
            </div>

            <div className="mt-5 max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Choose your learning plan
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Unlock the learning resources that match your
                academic goals. Compare the available plans and
                choose the access level that works best for you.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                  <CreditCard size={19} />
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    Flexible plans
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Choose your access
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <ShieldCheck size={19} />
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    Secure checkout
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Protected payment flow
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <LockKeyhole size={19} />
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    Easy access
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Simple plan selection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plan selection */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Available plans
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Review the plan details below before continuing.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-3 sm:p-5">
            <AccessPlanGrid onSelectPlan={handleSelectPlan} />
          </div>
        </section>

        {/* Secure payment information */}
        <section className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                <ShieldCheck size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-white">
                  Secure payment processing
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Payments for eligible paid plans are processed
                  through Monnify. Access is activated after
                  successful payment verification.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 sm:self-center">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-sm font-extrabold tracking-wide text-white">
                Monnify
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 px-4 py-3 sm:px-6">
            <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
              <LockKeyhole
                size={14}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
              Always complete payment through the official checkout
              page. Do not share your password or payment credentials.
            </p>
          </div>
        </section>

        {/* Footer navigation */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-5 pb-4 sm:flex-row">
          <p className="text-center text-xs text-slate-500 sm:text-left">
            Learnyfi · Your learning journey starts here.
          </p>

          <button
            type="button"
            onClick={() => router.push("/student/dashboard")}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            Return to dashboard
            <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </main>
  );
}












// "use client";

// import { useRouter } from "next/navigation";

// import {
//   AccessHeader,
//   AccessPlanGrid,
//   type AccessPlan,
// } from "@/components/access";

// /* ============================================================
//    SECONDARY ACCESS PAGE
//    ============================================================ */

// export default function SecondaryAccessPage() {
//   const router = useRouter();

//   const handleSelectPlan = (plan: AccessPlan) => {
//   if (plan.id === "secondary-free") {
//   router.push("/student/dashboard");
//   return;
// }

//   if (plan.id === "secondary-standard") {

//     router.push(
//   `/student/access/secondary/checkout?plan=${encodeURIComponent(plan.id)}`,
// );

//     return;
//   }

//   if (plan.disabled) {
//     console.log(
//       `${plan.name} is  unavailable.`,
//     );
//   }
// };

//   /* ============================================================
//      RENDER
//      ============================================================ */

//   return (
//     <main className="mx-auto w-full max-w-7xl space-y-8">
//       {/* ======================================================
//           PAGE HEADER
//          ====================================================== */}

//       <AccessHeader />

//       {/* ======================================================
//           PLANS
//          ====================================================== */}

//       <AccessPlanGrid
//         onSelectPlan={handleSelectPlan}
//       />

//       {/* ======================================================
//           PAYMENT NOTICE
//          ====================================================== */}

//       <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h3 className="font-semibold text-slate-900">
//               Secure Payment
//             </h3>

//             <p className="mt-1 text-sm text-slate-500">
//               Paid plans will be processed securely through
//               Monnify. Your access will be activated after
//               successful payment verification.
//             </p>
//           </div>

//           <div className="shrink-0 text-sm font-semibold text-slate-600">
//             monnify
//           </div>
//         </div>
//       </section>

//       {/* ======================================================
//           BACK TO DASHBOARD
//          ====================================================== */}

//       <div className="flex justify-center pb-6">
//         <button
//           type="button"
//           onClick={() =>
//             router.push("/student/dashboard")
//           }
//           className="text-sm font-semibold text-slate-500 transition hover:text-blue-600"
//         >
//           Return to Dashboard
//         </button>
//       </div>
//     </main>
//   );
// }
