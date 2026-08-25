




"use client";

import {
  Users,
  ClipboardCheck,
  Brain,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Container from "@/components/layout/Container";

const steps = [
  {
    number: "01",
    title: "Build Your Team",
    shortTitle: "Create Team",
    description:
      "Form a team of three students and get ready to take on students and schools from across Nigeria.",
    icon: Users,
    accent: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    number: "02",
    title: "Register & Enter",
    shortTitle: "Register",
    description:
      "Choose your competition category, register your team and secure your place in the championship.",
    icon: ClipboardCheck,
    accent: "from-indigo-500 to-blue-600",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    number: "03",
    title: "Practice & Compete",
    shortTitle: "Compete",
    description:
      "Practice with JAMB-style questions, sharpen your skills and compete against other teams.",
    icon: Brain,
    accent: "from-violet-500 to-indigo-600",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    number: "04",
    title: "Rise to the Top",
    shortTitle: "Become Champion",
    description:
      "Earn points, climb the national leaderboard and compete for scholarships, medals and recognition.",
    icon: Trophy,
    accent: "from-yellow-400 to-amber-500",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

      {/* =========================================================
          BACKGROUND
         ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[45rem] -translate-x-1/2 rounded-full bg-blue-50/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-indigo-50/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-40 h-80 w-80 rounded-full bg-blue-50/70 blur-3xl"
      />

      <Container>

        {/* =====================================================
            HEADER
           ===================================================== */}

        <div className="relative mx-auto mb-14 max-w-3xl text-center">

          {/* Badge */}

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">

            <span className="flex h-2 w-2 rounded-full bg-yellow-400" />

            How JAMB League Works

          </div>


          {/* Heading */}

          <h2
            className={cn(
              "text-3xl",
              "font-black",
              "tracking-tight",
              "text-slate-950",
              "sm:text-4xl",
              "lg:text-5xl"
            )}
          >

            From preparation

            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              to championship
            </span>

          </h2>


          {/* Description */}

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            JAMB League turns your JAMB preparation into a competitive
            experience where teamwork, practice and performance can take
            you from your classroom to the national leaderboard.
          </p>

        </div>


        {/* =====================================================
            DESKTOP PROGRESS LINE
           ===================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[21rem] hidden h-px w-[65%] -translate-x-1/2 bg-gradient-to-r from-blue-200 via-indigo-300 to-yellow-300 lg:block"
        />


        {/* =====================================================
            STEPS
           ===================================================== */}

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative"
              >

                {/* =================================================
                    CARD
                   ================================================= */}

                <div
                  className={cn(
                    "relative h-full overflow-hidden rounded-3xl",
                    "border border-slate-200/80",
                    "bg-white",
                    "p-6 sm:p-7",
                    "shadow-sm",
                    "transition-all duration-500",
                    "hover:-translate-y-2",
                    "hover:border-blue-200",
                    "hover:shadow-xl hover:shadow-blue-100/50"
                  )}
                >

                  {/* Top gradient line */}

                  <div
                    className={cn(
                      "absolute inset-x-0 top-0 h-1",
                      "bg-gradient-to-r",
                      step.accent
                    )}
                  />


                  {/* Large background number */}

                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-5 select-none text-[6rem] font-black leading-none text-slate-50 transition-colors duration-500 group-hover:text-blue-50"
                  >
                    {step.number}
                  </span>


                  {/* =================================================
                      ICON
                     ================================================= */}

                  <div className="relative mb-6 flex items-center justify-between">

                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center",
                        "rounded-2xl",
                        step.iconBg,
                        step.iconColor,
                        "transition-transform duration-500",
                        "group-hover:scale-110 group-hover:rotate-2"
                      )}
                    >
                      <Icon size={26} strokeWidth={2.2} />
                    </div>


                    {/* Step indicator */}

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400">
                      {step.number}
                    </span>

                  </div>


                  {/* =================================================
                      CONTENT
                     ================================================= */}

                  <div className="relative">

                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-blue-600">
                      Step {step.number}
                    </p>

                    <h3 className="text-xl font-extrabold tracking-tight text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>

                  </div>


                  {/* =================================================
                      BOTTOM INDICATOR
                     ================================================= */}

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-600">

                    <CheckCircle2
                      size={15}
                      className="text-blue-500"
                    />

                    <span>{step.shortTitle}</span>

                    {index < steps.length - 1 && (
                      <ArrowRight
                        size={14}
                        className="ml-auto transition-transform duration-300 group-hover:translate-x-1"
                      />
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>


        {/* =========================================================
            BOTTOM MESSAGE
           ========================================================= */}

        <div className="relative mx-auto mt-12 max-w-3xl">

          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-5 text-center sm:flex-row sm:text-left">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Trophy size={21} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Your journey starts with one decision.
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Build your team, prepare together and compete for the top.
                </p>
              </div>

            </div>


            <a
              href="/competitions"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Explore Competitions

              <ArrowRight size={15} />
            </a>

          </div>

        </div>

      </Container>

    </section>
  );
}