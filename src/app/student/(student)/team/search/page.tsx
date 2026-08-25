





import Link from "next/link";

export default function SearchTeamsPage() {
  const teams = [
    {
      id: "1",
      name: "Alpha Warriors",
      school: "Federal Government College, Lagos",
      state: "Lagos",
      members: 2,
      maxMembers: 3,
      captain: "David Johnson",
      subjectCombo: "Engineering",
      status: "Open",
    },
    {
      id: "2",
      name: "Future Doctors",
      school: "King's College",
      state: "Lagos",
      members: 1,
      maxMembers: 3,
      captain: "Mary Ibrahim",
      subjectCombo: "Medicine",
      status: "Open",
    },
    {
      id: "3",
      name: "Tech Geniuses",
      school: "Government College Ibadan",
      state: "Oyo",
      members: 2,
      maxMembers: 3,
      captain: "Samuel Peter",
      subjectCombo: "Computer Science",
      status: "Open",
    },
    {
      id: "4",
      name: "Science Masters",
      school: "Aquinas College",
      state: "Akwa Ibom",
      members: 3,
      maxMembers: 3,
      captain: "Grace Daniel",
      subjectCombo: "Sciences",
      status: "Full",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/team"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to My Team
          </Link>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Search Teams
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Find existing teams that are looking for members. You can
            search by school, state, subject combination, or team name.
          </p>
        </div>

        {/* Search */}
        <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              type="text"
              placeholder="Search team..."
              className="rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />

            <select className="rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none">
              <option>All States</option>
              <option>Lagos</option>
              <option>Oyo</option>
              <option>Abuja</option>
              <option>Kaduna</option>
            </select>

            <select className="rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none">
              <option>All Schools</option>
              <option>Federal Government College</option>
              <option>King's College</option>
              <option>Government College</option>
            </select>

            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Search
            </button>
          </div>
        </section>

        {/* Results */}
        <div className="grid gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {team.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        team.status === "Open"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {team.status}
                    </span>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <p>
                      <strong>School:</strong> {team.school}
                    </p>

                    <p>
                      <strong>State:</strong> {team.state}
                    </p>

                    <p>
                      <strong>Captain:</strong> {team.captain}
                    </p>

                    <p>
                      <strong>Subject:</strong>{" "}
                      {team.subjectCombo}
                    </p>

                    <p>
                      <strong>Members:</strong>{" "}
                      {team.members}/{team.maxMembers}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/student/team/${team.id}`}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100"
                  >
                    View Team
                  </Link>

                  <button
                    disabled={team.status === "Full"}
                    className={`rounded-xl px-5 py-3 font-semibold ${
                      team.status === "Full"
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Request to Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (future) */}
        {/* Replace the list above with this when no teams are found */}
        {false && (
          <div className="rounded-2xl border border-dashed bg-white p-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              No Teams Found
            </h2>

            <p className="mt-3 text-slate-600">
              Try changing your search filters or create your own team.
            </p>

            <Link
              href="/student/team/create"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create New Team
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}