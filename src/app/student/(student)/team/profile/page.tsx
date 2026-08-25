




import Link from "next/link";

export default function TeamProfilePage() {
  // Temporary placeholder data
  const team = {
    id: "1",
    name: "Alpha Warriors",
    slogan: "Learning, Competing, Winning!",
    school: "Federal Government College, Lagos",
    state: "Lagos",
    competition: "JAMB League 2027",
    captain: "David Johnson",
    createdAt: "12 January 2027",
    status: "Active",
    wins: 8,
    losses: 2,
    points: 240,
    rank: "#5 Nationally",
    members: [
      {
        id: "1",
        name: "David Johnson",
        role: "Captain",
        school: "Federal Government College",
        avatar:
          "https://ui-avatars.com/api/?name=David+Johnson&background=2563eb&color=fff",
      },
      {
        id: "2",
        name: "Mary Ibrahim",
        role: "Member",
        school: "Federal Government College",
        avatar:
          "https://ui-avatars.com/api/?name=Mary+Ibrahim&background=059669&color=fff",
      },
      {
        id: "3",
        name: "Samuel Peter",
        role: "Member",
        school: "Federal Government College",
        avatar:
          "https://ui-avatars.com/api/?name=Samuel+Peter&background=dc2626&color=fff",
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
              href="/student/team"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to My Team
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Team Profile
            </h1>

            <p className="mt-2 text-slate-600">
              View your team's information, members, and competition
              performance.
            </p>
          </div>

          <Link
            href="/student/team/edit"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Edit Team
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Team Overview */}
            <section className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
                  {team.name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {team.name}
                  </h2>

                  <p className="mt-2 italic text-slate-600">
                    "{team.slogan}"
                  </p>

                  <span className="mt-4 inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                    {team.status}
                  </span>
                </div>
              </div>
            </section>

            {/* Team Details */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Team Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info label="School" value={team.school} />
                <Info label="State" value={team.state} />
                <Info label="Captain" value={team.captain} />
                <Info label="Competition" value={team.competition} />
                <Info label="Created" value={team.createdAt} />
                <Info label="National Rank" value={team.rank} />
              </div>
            </section>

            {/* Members */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Team Members
                </h2>

                <Link
                  href="/student/team/invitations"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Manage Invitations
                </Link>
              </div>

              <div className="space-y-4">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {member.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {member.school}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        member.role === "Captain"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Team Statistics
              </h2>

              <div className="space-y-5">
                <Stat
                  label="Competition Points"
                  value={team.points.toString()}
                />

                <Stat
                  label="Wins"
                  value={team.wins.toString()}
                />

                <Stat
                  label="Losses"
                  value={team.losses.toString()}
                />

                <Stat
                  label="National Rank"
                  value={team.rank}
                />
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Team Actions
              </h2>

              <div className="space-y-3">
                <Link
                  href="/student/team/invitations"
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Invite Members
                </Link>

                <Link
                  href="/student/team/search"
                  className="block rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-center font-semibold text-green-700 hover:bg-green-100"
                >
                  Find Members
                </Link>

                <Link
                  href="/student/competitions"
                  className="block rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold hover:bg-slate-100"
                >
                  Join Competition
                </Link>

                <button className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100">
                  Leave Team
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

function Info({ label, value }: InfoProps) {
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

function Stat({ label, value }: StatProps) {
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