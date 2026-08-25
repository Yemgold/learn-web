






import Link from "next/link";

interface StudentProfilePageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function StudentProfilePage({
  params,
}: StudentProfilePageProps) {
  const { studentId } = await params;

  // Temporary placeholder data
  const student = {
    id: studentId,
    fullName: "David Johnson",
    nickname: "The Mathematician",
    avatar:
      "https://ui-avatars.com/api/?name=David+Johnson&background=2563eb&color=fff",

    school: "Federal Government College, Lagos",
    state: "Lagos",
    team: "Alpha Warriors",

    role: "Captain",

    jambYear: "2027",

    subjects: [
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
    ],

    competitions: 8,
    practiceTests: 154,
    averageScore: "89%",
    nationalRank: "#18",

    bio: "Passionate about Mathematics and Physics. Loves solving challenging CBT questions and helping teammates prepare for competitions.",

    achievements: [
      "🥇 National Top 20",
      "🏆 3 Competition Wins",
      "⭐ 150+ Practice Tests",
      "🎯 89% Average Score",
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/team/profile"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Team Profile
          </Link>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Student Profile
          </h1>

          <p className="mt-2 text-slate-600">
            View a team member's profile, achievements and
            performance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Hero */}
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

                  <p className="mt-1 text-slate-500">
                    {student.nickname}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                      {student.role}
                    </span>

                    <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                      {student.team}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Student Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info
                  label="School"
                  value={student.school}
                />

                <Info
                  label="State"
                  value={student.state}
                />

                <Info
                  label="JAMB Year"
                  value={student.jambYear}
                />

                <Info
                  label="Team"
                  value={student.team}
                />
              </div>
            </section>

            {/* Subjects */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Subject Combination
              </h2>

              <div className="flex flex-wrap gap-3">
                {student.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </section>

            {/* Bio */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                About
              </h2>

              <p className="leading-8 text-slate-600">
                {student.bio}
              </p>
            </section>

            {/* Achievements */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Achievements
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {student.achievements.map((achievement) => (
                  <div
                    key={achievement}
                    className="rounded-xl bg-yellow-50 p-4 text-yellow-800"
                  >
                    {achievement}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Performance
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
                  label="Average Score"
                  value={student.averageScore}
                />

                <Stat
                  label="National Rank"
                  value={student.nationalRank}
                />
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Link
                  href="/student/competitions/leaderboard"
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  View Leaderboard
                </Link>

                <Link
                  href="/student/team/profile"
                  className="block rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold hover:bg-slate-100"
                >
                  View Team
                </Link>
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