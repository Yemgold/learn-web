





import Link from "next/link";

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const { id } = await params;

  // Temporary data
  const student = {
    id,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+2348012345678",
    gender: "Male",
    state: "Lagos",
    school: "Government College Lagos",
    jambYear: "2027",
    team: "Future Doctors",
    status: "Active",
    verified: "Yes",
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href={`/admin/students/${id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Student
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Edit Student
            </h1>

            <p className="mt-2 text-slate-600">
              Update student profile, academic information and account
              status.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Student ID: {student.id}
          </span>
        </div>

        <form className="space-y-8">
          {/* Personal Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Personal Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>

                <input
                  defaultValue={student.firstName}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>

                <input
                  defaultValue={student.lastName}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  defaultValue={student.email}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <input
                  defaultValue={student.phone}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Gender
                </label>

                <select
                  defaultValue={student.gender}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  State
                </label>

                <input
                  defaultValue={student.state}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Academic Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Academic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  School
                </label>

                <input
                  defaultValue={student.school}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  JAMB Year
                </label>

                <select
                  defaultValue={student.jambYear}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Team
                </label>

                <input
                  defaultValue={student.team}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Verification
                </label>

                <select
                  defaultValue={student.verified}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </section>

          {/* Account Status */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Account Status
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  defaultValue={student.status}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Pending</option>
                  <option>Blocked</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Student Role
                </label>

                <select className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>Student</option>
                  <option>Team Leader</option>
                  <option>School Coordinator</option>
                </select>
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
              className="rounded-xl border border-amber-300 bg-amber-50 px-8 py-3 font-semibold text-amber-700 transition hover:bg-amber-100"
            >
              Reset Password
            </button>

            <button
              type="button"
              className="rounded-xl border border-red-300 bg-red-50 px-8 py-3 font-semibold text-red-700 transition hover:bg-red-100"
            >
              Suspend Account
            </button>

            <Link
              href={`/admin/students/${id}`}
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