




import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Layers3,
  Plus,
  School,
  Settings2,
  Users,
  Trophy,
  Upload,
  ChartNoAxesCombined,
} from "lucide-react";

const managementCards = [
  {
    title: "Institutions",
    description: "Register and manage schools, tutorial centres and their profiles.",
    href: "/admin/school-centres/institutions",
    icon: Building2,
    color: "blue",
    action: "Manage institutions",
  },
  {
    title: "Question Bank",
    description: "Upload, organise, edit and manage practice questions.",
    href: "/admin/school-centres/questions",
    icon: BookOpen,
    color: "violet",
    action: "Manage questions",
  },
  {
    title: "Students",
    description: "View and manage students registered under institutions.",
    href: "/admin/school-centres/students",
    icon: Users,
    color: "emerald",
    action: "Manage students",
  },
  {
    title: "Classes & Groups",
    description: "Organise students into classes, departments and study groups.",
    href: "/admin/school-centres/classes",
    icon: Layers3,
    color: "amber",
    action: "Manage classes",
  },
  {
    title: "Practice Assignments",
    description: "Create practice activities and assign them to students or classes.",
    href: "/admin/school-centres/assignments",
    icon: ClipboardList,
    color: "pink",
    action: "Manage assignments",
  },
  {
    title: "Results & Performance",
    description: "Monitor student attempts, scores and practice performance.",
    href: "/admin/school-centres/results",
    icon: ChartNoAxesCombined,
    color: "cyan",
    action: "View results",
  },
];

const colorStyles: Record<
  string,
  { icon: string; glow: string; hover: string }
> = {
  blue: {
    icon: "bg-blue-500/10 text-blue-400",
    glow: "group-hover:border-blue-500/40",
    hover: "group-hover:text-blue-400",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-400",
    glow: "group-hover:border-violet-500/40",
    hover: "group-hover:text-violet-400",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-400",
    glow: "group-hover:border-emerald-500/40",
    hover: "group-hover:text-emerald-400",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-400",
    glow: "group-hover:border-amber-500/40",
    hover: "group-hover:text-amber-400",
  },
  pink: {
    icon: "bg-pink-500/10 text-pink-400",
    glow: "group-hover:border-pink-500/40",
    hover: "group-hover:text-pink-400",
  },
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-400",
    glow: "group-hover:border-cyan-500/40",
    hover: "group-hover:text-cyan-400",
  },
};

const overviewItems = [
  {
    label: "Institutions",
    value: "—",
    note: "Registered schools and centres",
    icon: School,
  },
  {
    label: "Total Students",
    value: "—",
    note: "Students across institutions",
    icon: GraduationCap,
  },
  {
    label: "Questions",
    value: "—",
    note: "Questions in the institution bank",
    icon: BookOpen,
  },
  {
    label: "Assignments",
    value: "—",
    note: "Practice activities created",
    icon: ClipboardList,
  },
];

export default function SchoolCentresPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <School className="h-4 w-4 text-blue-400" />
              <span>Administration</span>
              <span>/</span>
              <span className="text-slate-200">School & Study Centres</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              School & Study Centre Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage institutions, upload practice questions, organise
              students and monitor learning activities from one place.
            </p>
          </div>

          <Link
            href="/admin/school-centres/institutions/register"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Register Institution
          </Link>
        </div>

        {/* Intro banner */}
        <section className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                <Building2 className="h-3.5 w-3.5" />
                Institution management centre
              </div>

              <h2 className="text-xl font-bold sm:text-2xl">
                Give every school a better way to practise.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Create institution profiles, build dedicated question banks
                and organise practice activities for students. Start by
                registering a school or study centre.
              </p>

              <Link
                href="/admin/school-centres/institutions/register"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="hidden shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-7 lg:flex">
              <School className="h-20 w-20 text-blue-300" strokeWidth={1.2} />
            </div>
          </div>
        </section>

        {/* Overview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-1 text-sm text-slate-400">
              Institution activity at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-400">
                      {item.label}
                    </p>
                    <div className="rounded-xl bg-slate-800 p-2.5">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>

                  <p className="mt-4 text-3xl font-bold tabular-nums">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Management modules */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Management Modules</h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose an area to manage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {managementCards.map((card) => {
              const Icon = card.icon;
              const styles = colorStyles[card.color];

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition duration-200 hover:-translate-y-1 hover:bg-slate-900 ${styles.glow}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-xl p-3 ${styles.icon}`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <ArrowRight
                      className={`h-5 w-5 text-slate-600 transition group-hover:translate-x-1 ${styles.hover}`}
                    />
                  </div>

                  <h3
                    className={`mt-5 text-base font-semibold text-white transition ${styles.hover}`}
                  >
                    {card.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                    {card.description}
                  </p>

                  <div className="mt-5 text-sm font-medium text-slate-300 transition group-hover:text-white">
                    {card.action}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-400">
              Frequently used institution management tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/school-centres/institutions/register"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-blue-500/40"
            >
              <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Add Institution</p>
                <p className="mt-1 text-xs text-slate-500">
                  Register a school
                </p>
              </div>
            </Link>

            <Link
              href="/admin/school-centres/questions/upload"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-violet-500/40"
            >
              <div className="rounded-lg bg-violet-500/10 p-2.5 text-violet-400">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Upload Questions</p>
                <p className="mt-1 text-xs text-slate-500">
                  Add practice questions
                </p>
              </div>
            </Link>

            <Link
              href="/admin/school-centres/assignments"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-pink-500/40"
            >
              <div className="rounded-lg bg-pink-500/10 p-2.5 text-pink-400">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Create Assignment</p>
                <p className="mt-1 text-xs text-slate-500">
                  Assign student practice
                </p>
              </div>
            </Link>

            <Link
              href="/admin/school-centres/results"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-500/40"
            >
              <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">View Results</p>
                <p className="mt-1 text-xs text-slate-500">
                  Track performance
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Note */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
          <p className="text-xs leading-5 text-slate-500">
            This dashboard is the starting interface. Institution statistics,
            question storage, student records and assignment results will be
            connected to the application data layer as those modules are
            implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
