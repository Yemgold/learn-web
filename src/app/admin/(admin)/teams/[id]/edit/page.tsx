




import Link from "next/link";

interface EditTeamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTeamPage({
  params,
}: EditTeamPageProps) {
  const { id } = await params;

  // Temporary data (replace with API)
  const team = {
    id,
    name: "Future Doctors",
    competition: "JAMB League 2027 National Challenge",
    school: "Government College Lagos",
    state: "Lagos",
    leader: "John Doe",
    leaderEmail: "john@example.com",
    status: "Qualified",
    notes:
      "Excellent team performance throughout the qualifiers.",
    members: [
      {
        id: "1",
        name: "John Doe",
        role: "Leader",
      },
      {
        id: "2",
        name: "Mary Johnson",
        role: "Member",
      },
      {
        id: "3",
        name: "David Williams",
        role: "Member",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/teams/${id}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Team
          </Link>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Edit Team
          </h1>

          <p className="mt-2 text-slate-600">
            Update team information, members and competition
            details.
          </p>
        </div>

        <form className="space-y-8">
          {/* Team Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Team Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Team Name
                </label>

                <input
                  defaultValue={team.name}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Competition
                </label>

                <select
                  defaultValue={team.competition}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>JAMB League 2027 National Challenge</option>
                  <option>Science Masters Challenge</option>
                  <option>National CBT Championship</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  School
                </label>

                <input
                  defaultValue={team.school}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  State
                </label>

                <input
                  defaultValue={team.state}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  defaultValue={team.status}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Pending</option>
                  <option>Qualified</option>
                  <option>Disqualified</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </section>

          {/* Team Leader */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Team Leader
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Leader Name
                </label>

                <input
                  defaultValue={team.leader}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Leader Email
                </label>

                <input
                  type="email"
                  defaultValue={team.leaderEmail}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Members */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Team Members
              </h2>

              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Member
              </button>
            </div>

            <div className="space-y-4">
              {team.members.map((member, index) => (
                <div
                  key={member.id}
                  className="grid gap-4 rounded-xl border p-4 md:grid-cols-3"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Member {index + 1}
                    </label>

                    <input
                      defaultValue={member.name}
                      className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Role
                    </label>

                    <select
                      defaultValue={member.role}
                      className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option>Leader</option>
                      <option>Vice Captain</option>
                      <option>Member</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 font-medium text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Admin Notes
            </h2>

            <textarea
              rows={5}
              defaultValue={team.notes}
              className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="rounded-xl border border-green-300 bg-green-50 px-8 py-3 font-semibold text-green-700 hover:bg-green-100"
            >
              Approve Team
            </button>

            <button
              type="button"
              className="rounded-xl border border-red-300 bg-red-50 px-8 py-3 font-semibold text-red-700 hover:bg-red-100"
            >
              Delete Team
            </button>

            <Link
              href={`/admin/teams/${id}`}
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}