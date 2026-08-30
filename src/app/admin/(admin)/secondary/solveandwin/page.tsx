

// src/app/admin/(admin)/secondary/solveandwin/page.tsx

import Link from "next/link";
import {
  Trophy,
  Plus,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Users,
  Settings2,
  Sparkles,
} from "lucide-react";

/* ============================================================
   PAGE
============================================================ */

export default function SolveAndWinPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Admin Dashboard
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                <Trophy className="h-4 w-4" />
                Solve &amp; Win
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                Solve &amp; Win
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                Create competitions, assign subjects, add questions,
                configure rewards and manage the complete Solve &amp; Win
                experience.
              </p>
            </div>

            <Link
              href="/admin/secondary/solveandwin/competitions/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Create Competition
            </Link>
          </div>
        </div>

        {/* ======================================================
            OVERVIEW
        ====================================================== */}

        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            icon={<Trophy className="h-5 w-5" />}
            label="Competitions"
            value="—"
            description="Created competitions"
          />

          <OverviewCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Subjects"
            value="—"
            description="Assigned competition subjects"
          />

          <OverviewCard
            icon={<HelpCircle className="h-5 w-5" />}
            label="Questions"
            value="—"
            description="Competition questions"
          />

          <OverviewCard
            icon={<Users className="h-5 w-5" />}
            label="Participants"
            value="—"
            description="Competition participants"
          />
        </section>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ====================================================
              COMPETITION MANAGEMENT
          ==================================================== */}

          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Trophy className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-slate-900">
                    Competition Management
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    All Solve &amp; Win competitions are managed from one
                    place. Open a competition to manage its subjects and
                    questions.
                  </p>
                </div>

                <Link
                  href="/admin/secondary/solveandwin/competitions"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  View Competitions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Flow */}

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <ManagementStep
                  number="01"
                  icon={<Trophy className="h-5 w-5" />}
                  title="Competition"
                  description="Create and configure the competition."
                />

                <ManagementStep
                  number="02"
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Subjects"
                  description="Assign the subjects that belong to it."
                />

                <ManagementStep
                  number="03"
                  icon={<HelpCircle className="h-5 w-5" />}
                  title="Questions"
                  description="Add and configure the competition questions."
                />
              </div>

              {/* CTA */}

              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Ready to create a competition?
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      Start by creating the competition, then add subjects
                      and questions.
                    </p>
                  </div>

                  <Link
                    href="/admin/secondary/solveandwin/competitions/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create Competition
                  </Link>
                  
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
              SIDEBAR
          ==================================================== */}

          <aside className="space-y-6">
            {/* Quick Actions */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage the main parts of Solve &amp; Win.
              </p>

              <div className="mt-5 space-y-3">
                <QuickAction
                  href="/admin/secondary/solveandwin/competitions"
                  icon={<Trophy className="h-5 w-5" />}
                  title="Competitions"
                  description="View and manage competitions"
                />

                <QuickAction
                  href="/admin/secondary/solveandwin/competitions/create"
                  icon={<Plus className="h-5 w-5" />}
                  title="Create Competition"
                  description="Launch a new competition"
                />
              </div>
            </section>

            {/* System Structure */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Settings2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Competition Structure
                  </h2>

                  <p className="text-xs text-slate-500">
                    How content is organized
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <StructureRow
                  number="1"
                  title="Competition"
                  description="Main Solve & Win event"
                />

                <StructureRow
                  number="2"
                  title="Subjects"
                  description="Subjects inside the competition"
                />

                <StructureRow
                  number="3"
                  title="Questions"
                  description="Questions belonging to each subject"
                />
              </div>
            </section>

            {/* Important Note */}

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <h2 className="font-semibold text-amber-900">
                    Admin Control
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    A competition should only be enabled after its
                    configuration, subjects and questions have been
                    reviewed.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

function OverviewCard({
  icon,
  label,
  value,
  description,
}: OverviewCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </section>
  );
}

/* ============================================================
   MANAGEMENT STEP
============================================================ */

interface ManagementStepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ManagementStep({
  number,
  icon,
  title,
  description,
}: ManagementStepProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
          {icon}
        </div>

        <span className="text-xs font-bold tracking-widest text-slate-400">
          {number}
        </span>
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </Link>
  );
}

/* ============================================================
   STRUCTURE ROW
============================================================ */

interface StructureRowProps {
  number: string;
  title: string;
  description: string;
}

function StructureRow({
  number,
  title,
  description,
}: StructureRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

