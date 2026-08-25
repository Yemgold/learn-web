




"use client";

import { useRouter } from "next/navigation";

import {
  AccessHeader,
  AccessPlanGrid,
  type AccessPlan,
} from "@/components/access";

/* ============================================================
   SECONDARY ACCESS PAGE
   ============================================================ */

export default function SecondaryAccessPage() {
  const router = useRouter();

  const handleSelectPlan = (plan: AccessPlan) => {
  if (plan.id === "secondary-free") {
    console.log("Free Secondary Plan selected.");
    return;
  }

  if (plan.id === "secondary-standard") {

    router.push(
  `/student/access/secondary/checkout?plan=${encodeURIComponent(plan.id)}`,
);

    return;
  }

  if (plan.disabled) {
    console.log(
      `${plan.name} is currently unavailable.`,
    );
  }
};

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8">
      {/* ======================================================
          PAGE HEADER
         ====================================================== */}

      <AccessHeader />

      {/* ======================================================
          PLANS
         ====================================================== */}

      <AccessPlanGrid
        onSelectPlan={handleSelectPlan}
      />

      {/* ======================================================
          PAYMENT NOTICE
         ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">
              Secure Payment
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Paid plans will be processed securely through
              Paystack. Your access will be activated after
              successful payment verification.
            </p>
          </div>

          <div className="shrink-0 text-sm font-semibold text-slate-600">
            Paystack
          </div>
        </div>
      </section>

      {/* ======================================================
          BACK TO DASHBOARD
         ====================================================== */}

      <div className="flex justify-center pb-6">
        <button
          type="button"
          onClick={() =>
            router.push("/student/dashboard")
          }
          className="text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          Return to Dashboard
        </button>
      </div>
    </main>
  );
}
