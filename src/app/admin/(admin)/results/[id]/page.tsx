






import Link from "next/link";

interface ResultDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResultDetailsPage({
  params,
}: ResultDetailsPageProps) {
  const { id } = await params;

  // Temporary placeholder data
  const result = {
    id,
    competition: "JAMB League 2027 National Qualifier",
    team: "Alpha Warriors",
    school: "Federal Government College, Lagos",
    captain: "David Johnson",
    totalScore: 348,
    percentage: "87%",
    rank: "#5",
    status: "Qualified",
    participants: 3,
    submittedAt: "20 January 2027 • 11:45 AM",
    duration: "1 Hour 47 Minutes",
    createdBy: "System",

    subjects: [
      {
        subject: "English",
        score: 84,
        total: 100,
      },
      {
        subject: "Mathematics",
        score: 92,
        total: 100,
      },
      {
        subject: "Physics",
        score: 88,
        total: 100,
      },
      {
        subject: "Chemistry",
        score: 84,
        total: 100,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/results"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Results
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Competition Result
            </h1>

            <p className="mt-2 text-slate-600">
              View detailed performance for this competition.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Export PDF
            </button>

            <button className="rounded-xl border border-green-300 bg-green-50 px-5 py-3 font-semibold text-green-700 hover:bg-green-100">
              Download CSV
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Summary */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Result Summary
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info
                  label="Competition"
                  value={result.competition}
                />

                <Info
                  label="Team"
                  value={result.team}
                />

                <Info
                  label="School"
                  value={result.school}
                />

                <Info
                  label="Captain"
                  value={result.captain}
                />

                <Info
                  label="Participants"
                  value={String(result.participants)}
                />

                <Info
                  label="Submitted"
                  value={result.submittedAt}
                />

                <Info
                  label="Duration"
                  value={result.duration}
                />

                <Info
                  label="Status"
                  value={result.status}
                />
              </div>
            </section>

            {/* Subject Scores */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Subject Breakdown
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Subject
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Score
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Percentage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.subjects.map((subject) => (
                      <tr
                        key={subject.subject}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-4 font-medium">
                          {subject.subject}
                        </td>

                        <td className="px-4 py-4">
                          {subject.score}/{subject.total}
                        </td>

                        <td className="px-4 py-4">
                          {Math.round(
                            (subject.score / subject.total) *
                              100
                          )}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Overall Performance
              </h2>

              <div className="space-y-5">
                <Stat
                  label="Total Score"
                  value={`${result.totalScore}/400`}
                />

                <Stat
                  label="Percentage"
                  value={result.percentage}
                />

                <Stat
                  label="National Rank"
                  value={result.rank}
                />

                <Stat
                  label="Qualification"
                  value={result.status}
                />
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
                  Export PDF
                </button>

                <button className="w-full rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-semibold text-green-700 hover:bg-green-100">
                  Download CSV
                </button>

                <button className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-700 hover:bg-amber-100">
                  Print Result
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