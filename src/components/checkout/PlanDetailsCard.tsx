





import { Check, GraduationCap, ShieldCheck } from "lucide-react";
import { SECONDARY_PLAN } from "@/constants/secondary-plan";

export default function PlanDetailsCard() {
  const price = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(SECONDARY_PLAN.price);

  return (
    <section className="relative w-full min-w-0">
      {/* Plan information and pricing */}
      <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_auto] sm:gap-8">
        {/* Plan details */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
            <GraduationCap className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300 sm:text-xs">
              Learnyfi access
            </span>

            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              {SECONDARY_PLAN.name}
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
              Complete secondary-school examination preparation access.
            </p>
          </div>
        </div>

        {/* Price panel */}
        <div className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-slate-700/80 bg-slate-950/60 p-4 sm:min-w-[220px] sm:flex-col sm:items-start sm:justify-center sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
              Plan price
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {price}
              </span>

              <span className="text-xs font-medium text-slate-400">
                / year
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:border-t sm:border-slate-800 sm:pt-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

            <span className="text-xs leading-5 text-slate-400">
              Secure payment with access activated after successful verification.
            </span>
          </div>
        </div>
      </div>

      {/* Included features */}
      <div className="mt-6 border-t border-slate-800 pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-white sm:text-base">
            What&apos;s included
          </h3>

          <span className="shrink-0 rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-slate-400">
            {SECONDARY_PLAN.features.length} features
          </span>
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SECONDARY_PLAN.features.map((feature) => (
            <li
              key={feature}
              className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/30 p-3 text-sm leading-5 text-slate-300"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                <Check
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-emerald-300"
                  strokeWidth={2.5}
                />
              </span>

              <span className="min-w-0">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Review note */}
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/30 px-3.5 py-3">
        <p className="text-xs leading-5 text-slate-400">
          Your selected plan and price are displayed above. Review the
          details before proceeding to payment.
        </p>
      </div>
    </section>
  );
}