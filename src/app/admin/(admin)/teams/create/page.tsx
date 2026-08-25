




import Link from "next/link";

export default function CreateTeamPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/teams"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Teams
          </Link>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Create Team
          </h1>

          <p className="mt-2 text-slate-600">
            Create a new competition team and assign members.
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
                  type="text"
                  placeholder="Future Doctors"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Competition
                </label>

                <select className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>Select Competition</option>
                  <option>JAMB League 2027</option>
                  <option>Science Challenge</option>
                  <option>National CBT Championship</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  School
                </label>

                <input
                  type="text"
                  placeholder="Government College Lagos"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  State
                </label>

                <select className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>Select State</option>
                  <option>Lagos</option>
                  <option>Oyo</option>
                  <option>Abuja</option>
                  <option>Kano</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Team Status
                </label>

                <select className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Disqualified</option>
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
                  Select Student
                </label>

                <select className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>Select Team Leader</option>
                  <option>John Doe</option>
                  <option>Mary Johnson</option>
                  <option>David Williams</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Leader Email
                </label>

                <input
                  type="email"
                  placeholder="leader@example.com"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Team Members */}
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
              {[1, 2].map((member) => (
                <div
                  key={member}
                  className="grid gap-4 rounded-xl border p-4 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Student
                    </label>

                    <select className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none">
                      <option>Select Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Role
                    </label>

                    <select className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none">
                      <option>Member</option>
                      <option>Vice Captain</option>
                    </select>
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
              placeholder="Internal notes about this team..."
              className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Team
            </button>

            <button
              type="reset"
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Reset
            </button>

            <Link
              href="/admin/teams"
              className="rounded-xl border border-red-300 bg-red-50 px-8 py-3 font-semibold text-red-700 hover:bg-red-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}