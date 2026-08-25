


"use client";

import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

/* ============================================================
   PAYMENT SUCCESS CLIENT
   ============================================================ */

export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reference =
    searchParams.get("reference");

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">

          {/* ==================================================
              SUCCESS ICON
             ================================================== */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-11 w-11 text-emerald-600" />
          </div>

          {/* ==================================================
              HEADING
             ================================================== */}

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-emerald-600">
            Payment Successful
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your Secondary Plan Is Active
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Your payment has been successfully verified.
            You now have access to the features included
            in your Secondary Plan.
          </p>

          {/* ==================================================
              PLAN CARD
             ================================================== */}

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-left">
            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900">
                  Secondary Plan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  1 year access
                </p>

                {reference && (
                  <p className="mt-2 break-all text-xs text-slate-400">
                    Reference: {reference}
                  </p>
                )}
              </div>

              <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-600" />
            </div>
          </div>

          {/* ==================================================
              ACCESS CONFIRMATION
             ================================================== */}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Payment Verified
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your payment has been confirmed.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Access Unlocked
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your paid learning features are now available.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              ACTIONS
             ================================================== */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <button
              type="button"
              onClick={() =>
                router.push("/student/dashboard")
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Go to Dashboard

              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/student/practice")
              }
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.98]"
            >
              Start Practicing
            </button>

          </div>

          {/* ==================================================
              FOOTER
             ================================================== */}

          <p className="mt-8 text-xs leading-5 text-slate-400">
            Keep this payment reference for your records.
            If your access does not appear immediately,
            please refresh your dashboard.
          </p>

        </section>
      </div>
    </main>
  );
}
