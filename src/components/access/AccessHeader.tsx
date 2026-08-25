




"use client";

import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useRouter } from "next/navigation";

/* ============================================================
   ACCESS HEADER
   ============================================================ */

export default function AccessHeader() {
  const router = useRouter();

  return (
    <section className="w-full">
      {/* ======================================================
          BACK BUTTON
         ====================================================== */}

      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Dashboard
      </button>

      {/* ======================================================
          HEADER
         ====================================================== */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg shadow-blue-100/40 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* ==================================================
              TITLE
             ================================================== */}

          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <LockKeyhole className="h-7 w-7 text-white" />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
              Secondary Education
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose Your Plan
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Select a Secondary plan that gives you access to
              JAMB, WAEC, CBT practice, competitions, and
              question videos.
            </p>
          </div>

          {/* ==================================================
              SECURE PAYMENT INDICATOR
             ================================================== */}

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Secure Access
              </p>

              <p className="text-xs text-blue-100">
                Secure payment via Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

