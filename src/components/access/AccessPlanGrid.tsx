
"use client";

import {
  ArrowRight,
  BadgeCheck,
  Check,
  Crown,
  GraduationCap,
  LockKeyhole,
  Sparkles,
  Star,
} from "lucide-react";

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
      "Get started with selected JAMB preparation resources and basic practice tools.",
    price: 0,
    duration: "/ 2 months",
    features: [
      "Selected CBT practice",
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
      "Prepare confidently for major examinations with a complete set of learning tools.",
    price: 3000,
    duration: "/ year",
    popular: true,
    features: [
      "Full CBT practice",
      "Solve & Win",
      "Question videos",
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
      "Advanced preparation with premium resources and additional academic support.",
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
      "Priority access to new features",
      "Premium practice and revision materials",
    ],
    buttonText: "Coming Soon",
    disabled: true,
    comingSoon: true,
  },
];

/* ============================================================
   HELPERS
   ============================================================ */

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/* ============================================================
   ACCESS PLAN GRID
   ============================================================ */

export default function AccessPlanGrid({
  plans = DEFAULT_SECONDARY_PLANS,
  onSelectPlan,
}: AccessPlanGridProps) {
  return (
    <section className="w-full text-white">
      {/* Section heading */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
          <GraduationCap size={15} />
          Secondary access
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Choose your learning plan
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Start with free learning resources or unlock more
              tools to support your examination preparation.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-400">
            <LockKeyhole size={14} className="text-emerald-400" />
            Secure plan selection
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {plans.map((plan) => {
          const isFree = plan.price === 0;
          const isPopular = Boolean(plan.popular);
          const isDisabled =
            Boolean(plan.disabled) || Boolean(plan.comingSoon);

          return (
            <article
              key={plan.id}
              className={[
                "relative flex min-w-0 flex-col overflow-hidden rounded-2xl border transition-all duration-200",
                isPopular
                  ? "border-indigo-400/50 bg-gradient-to-b from-indigo-950/70 to-slate-900 shadow-xl shadow-indigo-950/20"
                  : "border-slate-800 bg-slate-900/80 shadow-sm",
                isDisabled
                  ? "opacity-80"
                  : "hover:-translate-y-0.5 hover:border-slate-600 hover:shadow-lg",
              ].join(" ")}
            >
              {/* Popular plan accent */}
              {isPopular && (
                <div className="flex items-center justify-center gap-2 bg-indigo-600 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white">
                  <Star size={14} className="fill-current" />
                  Most popular
                </div>
              )}

              {/* Plan details */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-indigo-300">
                    {isDisabled ? (
                      <Crown size={21} />
                    ) : isFree ? (
                      <GraduationCap size={21} />
                    ) : (
                      <Sparkles size={21} />
                    )}
                  </div>

                  {isDisabled && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                      Coming soon
                    </span>
                  )}

                  {!isDisabled && isFree && (
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                      Get started
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-white">
                  {plan.name}
                </h3>

                <p className="mt-2 min-h-[3rem] text-sm leading-6 text-slate-400">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-5 border-b border-slate-800 pb-5">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {formatNaira(plan.price)}
                    </span>

                    <span className="text-sm font-medium text-slate-400">
                      {plan.duration}
                    </span>
                  </div>

                  {isFree ? (
                    <p className="mt-2 text-xs font-medium text-emerald-300">
                      No payment required to get started
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      Annual plan pricing
                    </p>
                  )}
                </div>

                {/* Feature list */}
                <div className="mt-5 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    What&apos;s included
                  </p>

                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li
                        key={`${plan.id}-${index}`}
                        className="flex items-start gap-2.5 text-sm leading-5 text-slate-300"
                      >
                        <span
                          className={[
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            isPopular
                              ? "bg-indigo-500/15 text-indigo-300"
                              : "bg-emerald-500/10 text-emerald-300",
                          ].join(" ")}
                        >
                          <Check size={13} strokeWidth={3} />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action */}
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectPlan?.(plan)}
                  className={[
                    "mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-slate-900",
                    isDisabled
                      ? "cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500"
                      : isPopular
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30 hover:bg-indigo-500"
                        : "border border-slate-700 bg-slate-800 text-white hover:border-slate-600 hover:bg-slate-700",
                  ].join(" ")}
                >
                  {isDisabled ? (
                    <>
                      <LockKeyhole size={16} />
                      {plan.buttonText || "Coming Soon"}
                    </>
                  ) : (
                    <>
                      {plan.buttonText ||
                        (isFree ? "Start Free" : "Choose Plan")}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {isPopular && !isDisabled && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    A great choice for examination preparation
                  </p>
                )}
              </div>

              {/* Premium availability note */}
              {isDisabled && (
                <div className="border-t border-slate-800 bg-slate-950/50 px-5 py-3">
                  <p className="flex items-center gap-2 text-xs leading-5 text-slate-400">
                    <BadgeCheck
                      size={14}
                      className="shrink-0 text-amber-300"
                    />
                    This plan is not available yet.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
          <LockKeyhole size={17} />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-200">
            Choose with confidence
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
            Review each plan&apos;s features and duration before
            continuing. Paid plan access depends on successful
            payment verification.
          </p>
        </div>
      </div>
    </section>
  );
}

















// "use client";

// import AccessPlanCard from "./AccessPlanCard";

// /* ============================================================
//    TYPES
//    ============================================================ */

// export interface AccessPlan {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   duration: string;
//   features: string[];
//   popular?: boolean;
//   disabled?: boolean;
//    comingSoon?: boolean;
//   buttonText?: string;
// }

// /* ============================================================
//    PROPS
//    ============================================================ */

// interface AccessPlanGridProps {
//   plans?: AccessPlan[];
//   onSelectPlan?: (plan: AccessPlan) => void;
// }

// /* ============================================================
//    DEFAULT SECONDARY PLANS
//    ============================================================ */

// const DEFAULT_SECONDARY_PLANS: AccessPlan[] = [
//   {
//     id: "secondary-free",
//     name: "Free Plan",
//     description:
//       "Get started with basic access to selected JAMB preparation resources.",
//     price: 0,
//     duration: "/2 months",
//     features: [
//       "Selected CBT Practice",
//       "Basic question access",
//       "Limited practice sessions",
//       "Basic performance tracking",
//     ],
//     buttonText: "Start Free",
//   },

//   {
//     id: "secondary-standard",
//     name: "Secondary Plan",
//     description:
//       "Unlock the complete secondary-school examination preparation experience.",
//     price: 3000,
//     duration: "/ year",
//     popular: true,
//     features: [
//       "Full CBT Practice",
//       "Solve & Win",
//       "Question Videos",
//       "JAMB examination preparation",
//       "WAEC examination preparation",
//       "Performance tracking",
//       "Practice history",
//     ],
//     buttonText: "Choose Secondary Plan",
//   },

// {
//   id: "secondary-premium",
//   name: "Secondary Premium",
//   description:
//     "Get advanced secondary-school preparation with premium learning resources, deeper performance insights, and personalized academic support.",
//   price: 10000,
//   duration: "/ year",
//   features: [
//     "Everything in Secondary Plan",
//     "Premium question access",
//     "Advanced performance insights",
//     "Personalized learning recommendations",
//     "Additional learning resources",
//     "One-on-one access to a teacher",
//     "Teacher-guided academic support",
//     "Subject-specific assistance",
//     "Priority access to new learning features",
//     "Premium practice and revision materials",
//   ],
//   buttonText: "Coming Soon",
//   disabled: true,
// },
// ];

// /* ============================================================
//    ACCESS PLAN GRID
//    ============================================================ */

// export default function AccessPlanGrid({
//   plans = DEFAULT_SECONDARY_PLANS,
//   onSelectPlan,
// }: AccessPlanGridProps) {
//   return (
//     <section className="w-full">
//       {/* ======================================================
//           HEADER
//          ====================================================== */}

//       <div className="mb-8">
//         <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
//           Secondary Access
//         </p>

//         <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//           Choose Your Plan
//         </h2>

//         <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
//           Select the plan that best fits your preparation needs.
//           You can start with the free option or unlock more
//           features with a paid secondary plan.
//         </p>
//       </div>

//       {/* ======================================================
//           PLANS
//          ====================================================== */}

//       <div className="grid gap-6 lg:grid-cols-3">
//         {plans.map((plan) => (
//           <AccessPlanCard
//             key={plan.id}
//             name={plan.name}
//             description={plan.description}
//             price={plan.price}
//             duration={plan.duration}
//             features={plan.features}
//             popular={plan.popular}
//             disabled={plan.disabled}
//             buttonText={plan.buttonText}
//             onSelect={() => {
//               onSelectPlan?.(plan);
//             }}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }