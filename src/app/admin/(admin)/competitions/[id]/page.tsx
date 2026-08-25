



import Link from "next/link";

interface CompetitionDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompetitionDetailsPage({
  params,
}: CompetitionDetailsPageProps) {
  const { id } = await params;

  // Temporary placeholder data
  const competition = {
    id,
    title: "JAMB League 2027 National Challenge",
    description:
      "The flagship national competition bringing together the best JAMB candidates across Nigeria to compete in a CBT-based academic championship.",
    subjectCombination:
      "English, Mathematics, Physics & Chemistry",
    registrationFee: "₦5,000",
    maxTeams: 1000,
    registeredTeams: 648,
    startDate: "20 January 2027",
    endDate: "20 January 2027",
    registrationDeadline: "10 January 2027",
    venue: "Virtual CBT Platform",
    status: "Registration Open",
    createdBy: "Admin",
    createdAt: "12 December 2026",
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/competitions"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Competitions
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              {competition.title}
            </h1>

            <p className="mt-2 max-w-3xl text-slate-600">
              {competition.description}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/admin/competitions/${id}/edit`}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Edit Competition
            </Link>

            <button className="rounded-xl border border-red-300 bg-red-50 px-5 py-3 font-semibold text-red-700 hover:bg-red-100">
              Delete
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Competition Information */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Competition Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info
                  label="Competition Name"
                  value={competition.title}
                />

                <Info
                  label="Status"
                  value={competition.status}
                />

                <Info
                  label="Subjects"
                  value={competition.subjectCombination}
                />

                <Info
                  label="Registration Fee"
                  value={competition.registrationFee}
                />

                <Info
                  label="Venue"
                  value={competition.venue}
                />

                <Info
                  label="Maximum Teams"
                  value={competition.maxTeams.toString()}
                />

                <Info
                  label="Registration Deadline"
                  value={competition.registrationDeadline}
                />

                <Info
                  label="Competition Date"
                  value={`${competition.startDate} • ${competition.endDate}`}
                />
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                Description
              </h2>

              <p className="leading-7 text-slate-600">
                {competition.description}
              </p>
            </section>

            {/* Timeline */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Competition Timeline
              </h2>

              <div className="space-y-6">
                <Timeline
                  title="Competition Created"
                  time={competition.createdAt}
                />

                <Timeline
                  title="Registration Opens"
                  time="15 December 2026"
                />

                <Timeline
                  title="Registration Closes"
                  time={competition.registrationDeadline}
                />

                <Timeline
                  title="Competition Day"
                  time={competition.startDate}
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Statistics */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Statistics
              </h2>

              <div className="space-y-5">
                <Stat
                  label="Registered Teams"
                  value={competition.registeredTeams.toString()}
                />

                <Stat
                  label="Maximum Teams"
                  value={competition.maxTeams.toString()}
                />

                <Stat
                  label="Status"
                  value={competition.status}
                />

                <Stat
                  label="Created By"
                  value={competition.createdBy}
                />
              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Link
                  href={`/admin/competitions/${id}/edit`}
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Edit Competition
                </Link>

                <button className="w-full rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-semibold text-green-700 hover:bg-green-100">
                  Open Registration
                </button>

                <button className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-700 hover:bg-amber-100">
                  Close Registration
                </button>

                <button className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100">
                  Cancel Competition
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({
  label,
  value,
}: StatProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

interface TimelineProps {
  title: string;
  time: string;
}

function Timeline({
  title,
  time,
}: TimelineProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

      <div>
        <p className="font-medium text-slate-900">
          {title}
        </p>

        <p className="text-sm text-slate-500">
          {time}
        </p>
      </div>
    </div>
  );
}