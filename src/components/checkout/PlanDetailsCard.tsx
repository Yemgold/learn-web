




import { Check, GraduationCap, ShieldCheck } from "lucide-react";
import { SECONDARY_PLAN } from "@/constants/secondary-plan";

export default function PlanDetailsCard() {
  const price = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(SECONDARY_PLAN.price);

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6 lg:p-7">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-emerald-500/[0.04] blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        {/* LEFT: Plan details and pricing */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-start gap-3">
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

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Complete secondary-school examination preparation access.
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-5 flex flex-1 flex-col rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
              Plan price
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {price}
              </span>

              <span className="text-xs font-medium text-slate-400">
                / year
              </span>
            </div>

            <div className="mt-auto flex items-start gap-2 border-t border-slate-800 pt-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

              <span className="text-xs leading-5 text-slate-400">
                Secure payment with access activated after successful verification.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Included features and note */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-white sm:text-base">
              What&apos;s included
            </h3>

            <span className="shrink-0 rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-slate-400">
              {SECONDARY_PLAN.features.length} features
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {SECONDARY_PLAN.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/30 p-3 text-sm leading-5 text-slate-300"
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

          {/* Bottom note */}
          <div className="mt-auto pt-5">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-3.5 py-3">
              <p className="text-xs leading-5 text-slate-400">
                Your selected plan and price are displayed above. Review the
                details before proceeding to payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}






// import { Check, GraduationCap, ShieldCheck } from "lucide-react";
// import { SECONDARY_PLAN } from "@/constants/secondary-plan";

// export default function PlanDetailsCard() {
//   const price = new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }).format(SECONDARY_PLAN.price);

//   return (
//     <section className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6 lg:p-5 xl:p-6">
//       {/* Subtle decorative background */}
//       <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/[0.08] blur-3xl" />

//       <div className="relative">
//         {/* Plan heading */}
//         <div className="flex items-start gap-3">
//           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
//             <GraduationCap className="h-6 w-6" />
//           </div>

//           <div className="min-w-0 flex-1">
//             <span className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300 sm:text-xs">
//               Learnyfi access
//             </span>

//             <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl lg:text-xl xl:text-2xl">
//               {SECONDARY_PLAN.name}
//             </h2>

//             <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
//               Complete secondary-school examination preparation access.
//             </p>
//           </div>
//         </div>

//         {/* Pricing */}
//         <div className="mt-5 rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 sm:p-5">
//           <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
//             Plan price
//           </p>

//           <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
//             <span className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-3xl xl:text-4xl">
//               {price}
//             </span>

//             <span className="text-xs font-medium text-slate-400">
//               / year
//             </span>
//           </div>

//           <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
//             <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />

//             <span className="text-xs leading-5 text-slate-400">
//               Secure payment with access activated after successful verification.
//             </span>
//           </div>
//         </div>

//         {/* Included features */}
//         <div className="mt-5">
//           <div className="flex items-center justify-between gap-3">
//             <h3 className="text-sm font-extrabold text-white">
//               What&apos;s included
//             </h3>

//             <span className="text-xs font-medium text-slate-500">
//               {SECONDARY_PLAN.features.length} features
//             </span>
//           </div>

//           <ul className="mt-3 space-y-3">
//             {SECONDARY_PLAN.features.map((feature) => (
//               <li
//                 key={feature}
//                 className="flex items-start gap-3 text-sm leading-6 text-slate-300"
//               >
//                 <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
//                   <Check
//                     aria-hidden="true"
//                     className="h-3.5 w-3.5 text-emerald-300"
//                     strokeWidth={2.5}
//                   />
//                 </span>

//                 <span className="min-w-0">{feature}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Bottom note */}
//         <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 px-3.5 py-3">
//           <p className="text-xs leading-5 text-slate-400">
//             Your selected plan and price are displayed above. Review the
//             details before proceeding to payment.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }
