




import Link from "next/link";

interface TeamDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeamDetailsPage({
  params,
}: TeamDetailsPageProps) {
  const { id } = await params;

  // Placeholder data
  const team = {
    id,
    name: "Future Doctors",
    competition: "JAMB League 2027 National Challenge",
    school: "Government College Lagos",
    state: "Lagos",
    leader: "John Doe",
    leaderEmail: "john@example.com",
    createdAt: "12 January 2027",
    status: "Qualified",
    score: 285,
    ranking: "#12",
    members: [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "Leader",
      },
      {
        id: "2",
        name: "Mary Johnson",
        email: "mary@example.com",
        role: "Member",
      },
      {
        id: "3",
        name: "David Williams",
        email: "david@example.com",
        role: "Member",
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
              href="/admin/teams"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Teams
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              {team.name}
            </h1>

            <p className="mt-2 text-slate-600">
              View team information, members, rankings and competition
              performance.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/admin/teams/${id}/edit`}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Edit Team
            </Link>

            <button className="rounded-xl border border-red-300 bg-red-50 px-5 py-3 font-semibold text-red-700 hover:bg-red-100">
              Delete
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Team Details */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Team Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info label="Team Name" value={team.name} />
                <Info label="Competition" value={team.competition} />
                <Info label="School" value={team.school} />
                <Info label="State" value={team.state} />
                <Info label="Team Leader" value={team.leader} />
                <Info
                  label="Leader Email"
                  value={team.leaderEmail}
                />
                <Info
                  label="Date Created"
                  value={team.createdAt}
                />
                <Info label="Status" value={team.status} />
              </div>
            </section>

            {/* Members */}
            <section className="rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b p-6">
                <h2 className="text-xl font-semibold">
                  Team Members
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                  {team.members.length} Members
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Student
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Role
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {team.members.map((member) => (
                      <tr
                        key={member.id}
                        className="border-t"
                      >
                        <td className="px-6 py-4 font-medium">
                          {member.name}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {member.email}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                            {member.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/students/${member.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View Student
                          </Link>
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
            {/* Statistics */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Team Statistics
              </h2>

              <div className="space-y-5">
                <Stat
                  label="Competition Score"
                  value={`${team.score}/400`}
                />

                <Stat
                  label="National Ranking"
                  value={team.ranking}
                />

                <Stat
                  label="Members"
                  value={team.members.length.toString()}
                />

                <Stat
                  label="Status"
                  value={team.status}
                />
              </div>
            </section>

            {/* Actions */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Link
                  href={`/admin/teams/${id}/edit`}
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Edit Team
                </Link>

                <button className="w-full rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-semibold text-green-700 hover:bg-green-100">
                  Approve Team
                </button>

                <button className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-700 hover:bg-amber-100">
                  Disqualify Team
                </button>

                <button className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100">
                  Delete Team
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