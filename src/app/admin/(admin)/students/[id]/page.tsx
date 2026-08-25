





import Link from "next/link";

interface StudentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailsPage({
  params,
}: StudentDetailsPageProps) {
  const { id } = await params;

  // Temporary placeholder data
  const student = {
    id,
    fullName: "David Johnson",
    email: "david.johnson@example.com",
    phone: "+234 801 234 5678",
    gender: "Male",
    school: "Federal Government College, Lagos",
    state: "Lagos",
    jambYear: "2027",
    jambNumber: "202755432198",
    team: "Alpha Warriors",
    status: "Active",
    competitions: 6,
    practiceTests: 148,
    rank: "#18",
    joinedAt: "12 January 2026",
    avatar:
      "https://ui-avatars.com/api/?name=David+Johnson&background=2563eb&color=fff",
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/students"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Students
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Student Profile
            </h1>

            <p className="mt-2 text-slate-600">
              View detailed information about this
              student.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/admin/students/${id}/edit`}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Edit Student
            </Link>

            <button className="rounded-xl border border-red-300 bg-red-50 px-5 py-3 font-semibold text-red-700 hover:bg-red-100">
              Suspend Account
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Profile */}
            <section className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="h-28 w-28 rounded-full border object-cover"
                />

                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {student.fullName}
                  </h2>

                  <p className="mt-2 text-slate-600">
                    {student.email}
                  </p>

                  <span className="mt-4 inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                    {student.status}
                  </span>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Personal Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info
                  label="Full Name"
                  value={student.fullName}
                />

                <Info
                  label="Email Address"
                  value={student.email}
                />

                <Info
                  label="Phone Number"
                  value={student.phone}
                />

                <Info
                  label="Gender"
                  value={student.gender}
                />

                <Info
                  label="School"
                  value={student.school}
                />

                <Info
                  label="State"
                  value={student.state}
                />
              </div>
            </section>

            {/* Academic */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Academic Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info
                  label="JAMB Year"
                  value={student.jambYear}
                />

                <Info
                  label="JAMB Registration Number"
                  value={student.jambNumber}
                />

                <Info
                  label="Current Team"
                  value={student.team}
                />

                <Info
                  label="National Rank"
                  value={student.rank}
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
                  label="Competitions"
                  value={student.competitions.toString()}
                />

                <Stat
                  label="Practice Tests"
                  value={student.practiceTests.toString()}
                />

                <Stat
                  label="National Rank"
                  value={student.rank}
                />

                <Stat
                  label="Joined"
                  value={student.joinedAt}
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
                  href={`/admin/students/${id}/edit`}
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Edit Student
                </Link>

                <button className="w-full rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-semibold text-green-700 hover:bg-green-100">
                  View Results
                </button>

                <button className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-700 hover:bg-amber-100">
                  Reset Password
                </button>

                <button className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100">
                  Suspend Account
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