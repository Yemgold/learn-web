





import Link from "next/link";

interface EditCompetitionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCompetitionPage({
  params,
}: EditCompetitionPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href={`/admin/competitions/${id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Competition
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Edit Competition
            </h1>

            <p className="mt-2 text-slate-600">
              Update competition details, registration settings and
              scheduling.
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Competition ID: {id}
          </span>
        </div>

        <form className="space-y-8">
          {/* Basic Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Competition Title
                </label>

                <input
                  type="text"
                  defaultValue="JAMB League 2027 National Challenge"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subject Category
                </label>

                <select className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>General JAMB</option>
                  <option>Science</option>
                  <option>Commercial</option>
                  <option>Arts</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Competition Status
                </label>

                <select className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>Draft</option>
                  <option selected>Registration Open</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={5}
                  defaultValue="National CBT competition for students preparing for the Unified Tertiary Matriculation Examination."
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Competition Schedule
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Registration Opens
                </label>

                <input
                  type="datetime-local"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Registration Closes
                </label>

                <input
                  type="datetime-local"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Competition Date
                </label>

                <input
                  type="date"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Start Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Registration */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Registration Settings
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Maximum Teams
                </label>

                <input
                  type="number"
                  defaultValue={500}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Team Size
                </label>

                <input
                  type="number"
                  defaultValue={3}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Entry Fee (₦)
                </label>

                <input
                  type="number"
                  defaultValue={0}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Prize Pool
                </label>

                <input
                  type="text"
                  defaultValue="Scholarships + Cash Rewards"
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="rounded-xl border border-red-300 bg-red-50 px-8 py-3 font-semibold text-red-700 transition hover:bg-red-100"
            >
              Delete Competition
            </button>

            <Link
              href={`/admin/competitions/${id}`}
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}