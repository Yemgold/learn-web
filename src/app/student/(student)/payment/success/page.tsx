



"use client";

import {
CheckCircle2,
ArrowRight,
Home,
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

return ( <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6"> <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center"> <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

```
      {/* ==================================================
          SUCCESS ICON
         ================================================== */}

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>

      {/* ==================================================
          TITLE
         ================================================== */}

      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-600">
        Payment Successful
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Your Secondary Plan Is Active
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
        Your payment has been verified successfully.
        Your Secondary Plan access has been activated.
        You can now continue using the available
        learning and practice features.
      </p>

      {/* ==================================================
          REFERENCE
         ================================================== */}

      {reference && (
        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Payment Reference
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-slate-700">
            {reference}
          </p>
        </div>
      )}

      {/* ==================================================
          AVAILABLE FEATURES
         ================================================== */}

      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">

        <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
          <Trophy className="h-5 w-5 shrink-0 text-blue-600" />

          <span className="text-sm font-medium text-slate-700">
            Full CBT Practice
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />

          <span className="text-sm font-medium text-slate-700">
            Premium Learning Access
          </span>
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
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Go to Dashboard

          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/student/arena")
          }
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          Start Learning
        </button>

      </div>

      {/* ==================================================
          HOME
         ================================================== */}

      <button
        type="button"
        onClick={() => router.push("/")}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-slate-700"
      >
        <Home className="h-4 w-4" />

        Return Home
      </button>

    </section>
  </div>
</main>


   );
}
