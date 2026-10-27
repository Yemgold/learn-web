
import { Check } from "lucide-react";
import { SECONDARY_PLAN } from "@/constants/secondary-plan";

export default function PlanDetailsCard() {
  const price = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(SECONDARY_PLAN.price);

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:p-5 xl:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-xl xl:text-2xl">
            {SECONDARY_PLAN.name}
          </h2>

          <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-500">
            Complete secondary-school examination preparation access.
          </p>
        </div>
      </div>

      <div className="mt-4 border-b border-slate-100 pb-4 lg:mt-3 lg:pb-3 xl:mt-4 xl:pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Plan price
        </p>

        <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-3xl xl:text-4xl">
          {price}
        </div>
      </div>

      <div className="mt-4 lg:mt-3 xl:mt-4">
        <h3 className="text-sm font-bold text-slate-800">
          What&apos;s included
        </h3>

        <ul className="mt-3 space-y-2 lg:mt-2.5 lg:space-y-1.5 xl:space-y-2">
          {SECONDARY_PLAN.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm leading-5 text-slate-600"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Check
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-blue-600"
                  strokeWidth={2.5}
                />
              </span>

              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}










// import { Check } from "lucide-react";
// import { SECONDARY_PLAN } from "@/constants/secondary-plan"; 

// export default function PlanDetailsCard() {
//   const price = new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }).format(SECONDARY_PLAN.price);

//   return (
//     <section className="rounded-3xl border bg-white p-8">
//       <h2 className="text-2xl font-bold">
//         {SECONDARY_PLAN.name}
//       </h2>

//       <p className="mt-2 text-slate-500">
//         Complete secondary-school examination preparation access.
//       </p>

//       <div className="mt-6 text-4xl font-extrabold">
//         {price}
//       </div>

//       <ul className="mt-8 space-y-3">
//         {SECONDARY_PLAN.features.map((feature) => (
//           <li
//             key={feature}
//             className="flex gap-3"
//           >
//             <Check className="h-5 w-5 text-blue-600" />

//             {feature}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }