




import {
  CheckCircle2,
  Star,
  Crown,
  Rocket,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    icon: Star,
    price: "₦0",
    description:
      "Perfect for every student preparing for JAMB.",
    features: [
      "Unlimited competitions",
      "Create or join teams",
      "National leaderboard",
      "Practice questions",
      "Competition certificates",
      "Community support",
    ],
    button: "Start Free",
    featured: false,
  },
  {
    name: "Premium",
    icon: Crown,
    price: "Coming Soon",
    description:
      "Advanced learning tools for serious candidates.",
    features: [
      "Everything in Free",
      "AI performance analysis",
      "Personalized study plan",
      "Advanced CBT simulations",
      "Detailed analytics",
      "Priority support",
      "Exclusive competitions",
    ],
    button: "Notify Me",
    featured: true,
  },
  {
    name: "School",
    icon: Rocket,
    price: "Contact Us",
    description:
      "Designed for schools and educational institutions.",
    features: [
      "School dashboard",
      "Student performance reports",
      "Teacher accounts",
      "School leaderboard",
      "Bulk student registration",
      "Dedicated support",
    ],
    button: "Contact Sales",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 py-20 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            Pricing
          </span>

          <h1 className="mt-6 text-5xl font-bold">
            Simple & Student Friendly
          </h1>

          <p className="mt-6 text-lg leading-8 text-blue-100">
            JAMB League is free for students. Future premium plans
            will introduce advanced learning tools while keeping
            competitions accessible to everyone.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <Card
                key={plan.name}
                hoverable
                className={`relative flex flex-col ${
                  plan.featured
                    ? "border-2 border-blue-600 shadow-xl"
                    : ""
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  {plan.name}
                </h2>

                <div className="mt-4 text-4xl font-extrabold text-blue-700">
                  {plan.price}
                </div>

                <p className="mt-4 text-slate-600">
                  {plan.description}
                </p>

                <div className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />

                      <span className="text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className="mt-10"
                  fullWidth
                  size="lg"
                >
                  {plan.button}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center text-4xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="mt-12 space-y-8">
            <Card>
              <h3 className="text-xl font-semibold">
                Is JAMB League free?
              </h3>

              <p className="mt-3 text-slate-600">
                Yes. Students can register, create teams,
                participate in competitions, and use practice
                questions completely free.
              </p>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold">
                What is Premium?
              </h3>

              <p className="mt-3 text-slate-600">
                Premium will introduce advanced analytics,
                personalized study plans, AI-powered learning
                recommendations, and additional CBT practice
                features.
              </p>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold">
                Can schools register students?
              </h3>

              <p className="mt-3 text-slate-600">
                Yes. Schools will have a dedicated dashboard to
                manage students, monitor performance, and organize
                school competitions.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}