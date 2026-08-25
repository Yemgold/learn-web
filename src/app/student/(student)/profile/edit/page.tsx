





import Link from "next/link";

export default function EditProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/profile"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Profile
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Edit Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Update your personal information, school details and JAMB
            preferences.
          </p>
        </div>

        <form className="space-y-8">
          {/* Personal Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Personal Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  defaultValue="John"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Last Name
                </label>

                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  defaultValue="john@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  defaultValue="+2348012345678"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Residential Address
                </label>

                <textarea
                  rows={4}
                  defaultValue="No. 10 Example Street, Lagos"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Academic Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Academic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  School
                </label>

                <input
                  type="text"
                  defaultValue="Government College"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  State
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Oyo</option>
                  <option>Kano</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  JAMB Exam Year
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
                  <option>2027</option>
                  <option>2028</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Preferred Course
                </label>

                <input
                  type="text"
                  defaultValue="Medicine and Surgery"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Subjects */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              JAMB Subjects
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                "English Language",
                "Mathematics",
                "Biology",
                "Chemistry",
              ].map((subject, index) => (
                <div key={index}>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Subject {index + 1}
                  </label>

                  <input
                    type="text"
                    defaultValue={subject}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>

            <Link
              href="/student/profile"
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