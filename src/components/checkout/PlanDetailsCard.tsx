



import { Check } from "lucide-react";
import { SECONDARY_PLAN } from "@/constants/secondary-plan"; 

export default function PlanDetailsCard() {
  const price = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(SECONDARY_PLAN.price);

  return (
    <section className="rounded-3xl border bg-white p-8">
      <h2 className="text-2xl font-bold">
        {SECONDARY_PLAN.name}
      </h2>

      <p className="mt-2 text-slate-500">
        Complete secondary-school examination preparation access.
      </p>

      <div className="mt-6 text-4xl font-extrabold">
        {price}
      </div>

      <ul className="mt-8 space-y-3">
        {SECONDARY_PLAN.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-3"
          >
            <Check className="h-5 w-5 text-blue-600" />

            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}