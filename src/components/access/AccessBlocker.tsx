


"use client";

import {
  Lock,
  ArrowRight,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";

interface AccessBlockerProps {
  onSecondaryClick?: () => void;
}

/* ============================================================
   ACCESS BLOCKER
   ============================================================ */

export default function AccessBlocker({
  onSecondaryClick,
}: AccessBlockerProps) {
  return (
    <section className="w-full">
      {/* ======================================================
          HEADER
         ====================================================== */}

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <Lock className="h-7 w-7 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Choose Your Access
        </h2>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Select the category that matches your educational level
          to unlock the learning, practice, and competition features
          available to you.
        </p>
      </div>

      {/* ======================================================
          PLAN CARDS
         ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ====================================================
            SECONDARY
           ==================================================== */}

        <article className="relative overflow-hidden rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-lg shadow-blue-100/50">
          <div className="absolute right-5 top-5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            AVAILABLE
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <GraduationCap className="h-7 w-7 text-blue-600" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Secondary
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            Secondary Students
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Access JAMB, WAEC, and other secondary-school
            examination preparation features.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                ✓
              </span>
              CBT Practice
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                ✓
              </span>
              Solve &amp; Win
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                ✓
              </span>
              Question Videos
            </li>
          </ul>

          <button
            type="button"
            onClick={onSecondaryClick}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            View Secondary Plans
            <ArrowRight className="h-4 w-4" />
          </button>
        </article>

        {/* ====================================================
            TERTIARY
           ==================================================== */}

        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 opacity-90 shadow-sm">
          <div className="absolute right-5 top-5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            COMING SOON
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <GraduationCap className="h-7 w-7 text-slate-500" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Tertiary
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            Tertiary Students
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            University, polytechnic, and other tertiary-level
            examination and learning resources.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Tertiary Practice
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Academic Challenges
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Learning Resources
            </li>
          </ul>

          <button
            type="button"
            disabled
            className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-400"
          >
            Coming Soon
          </button>
        </article>

        {/* ====================================================
            PROFESSIONALS
           ==================================================== */}

        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 opacity-90 shadow-sm">
          <div className="absolute right-5 top-5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            COMING SOON
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <BriefcaseBusiness className="h-7 w-7 text-slate-500" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Professionals
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            Professionals
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Professional certification, career development,
            and specialized examination preparation.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Professional Exams
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Certification Practice
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Career Resources
            </li>
          </ul>

          <button
            type="button"
            disabled
            className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-400"
          >
            Coming Soon
          </button>
        </article>
      </div>
    </section>
  );
}
