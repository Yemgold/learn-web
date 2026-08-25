


"use client";

import AccessPlanCard from "./AccessPlanCard";

/* ============================================================
   TYPES
   ============================================================ */

export interface AccessPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  disabled?: boolean;
   comingSoon?: boolean;
  buttonText?: string;
}

/* ============================================================
   PROPS
   ============================================================ */

interface AccessPlanGridProps {
  plans?: AccessPlan[];
  onSelectPlan?: (plan: AccessPlan) => void;
}

/* ============================================================
   DEFAULT SECONDARY PLANS
   ============================================================ */

const DEFAULT_SECONDARY_PLANS: AccessPlan[] = [
  {
    id: "secondary-free",
    name: "Free Plan",
    description:
      "Get started with basic access to selected JAMB preparation resources.",
    price: 0,
    duration: "/2 months",
    features: [
      "Selected CBT Practice",
      "Basic question access",
      "Limited practice sessions",
      "Basic performance tracking",
    ],
    buttonText: "Start Free",
  },

  {
    id: "secondary-standard",
    name: "Secondary Plan",
    description:
      "Unlock the complete secondary-school examination preparation experience.",
    price: 3000,
    duration: "/ year",
    popular: true,
    features: [
      "Full CBT Practice",
      "Solve & Win",
      "Question Videos",
      "JAMB examination preparation",
      "WAEC examination preparation",
      "Performance tracking",
      "Practice history",
    ],
    buttonText: "Choose Secondary Plan",
  },

{
  id: "secondary-premium",
  name: "Secondary Premium",
  description:
    "Get advanced secondary-school preparation with premium learning resources, deeper performance insights, and personalized academic support.",
  price: 10000,
  duration: "/ year",
  features: [
    "Everything in Secondary Plan",
    "Premium question access",
    "Advanced performance insights",
    "Personalized learning recommendations",
    "Additional learning resources",
    "One-on-one access to a teacher",
    "Teacher-guided academic support",
    "Subject-specific assistance",
    "Priority access to new learning features",
    "Premium practice and revision materials",
  ],
  buttonText: "Coming Soon",
  disabled: true,
},
];

/* ============================================================
   ACCESS PLAN GRID
   ============================================================ */

export default function AccessPlanGrid({
  plans = DEFAULT_SECONDARY_PLANS,
  onSelectPlan,
}: AccessPlanGridProps) {
  return (
    <section className="w-full">
      {/* ======================================================
          HEADER
         ====================================================== */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Secondary Access
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Choose Your Plan
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Select the plan that best fits your preparation needs.
          You can start with the free option or unlock more
          features with a paid secondary plan.
        </p>
      </div>

      {/* ======================================================
          PLANS
         ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <AccessPlanCard
            key={plan.id}
            name={plan.name}
            description={plan.description}
            price={plan.price}
            duration={plan.duration}
            features={plan.features}
            popular={plan.popular}
            disabled={plan.disabled}
            buttonText={plan.buttonText}
            onSelect={() => {
              onSelectPlan?.(plan);
            }}
          />
        ))}
      </div>
    </section>
  );
}