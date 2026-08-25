


interface CompetitionDetailsPageProps {
  params: Promise<{
    competitionId: string;
  }>;
}

export default async function CompetitionDetailsPage({
  params,
}: CompetitionDetailsPageProps) {
  const { competitionId } = await params;

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white">
          <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
            Competition Details
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            JAMB League Championship
          </h1>

          <p className="mt-3 max-w-3xl text-blue-100">
            View competition information, team status, schedule,
            leaderboard, and prepare for the upcoming CBT challenge.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-green-500 px-4 py-2 font-semibold">
              Registration Open
            </span>

            <span className="rounded-full bg-white/20 px-4 py-2">
              Competition ID: {competitionId}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                Competition Overview
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Participate in Nigeria's biggest online JAMB
                preparation competition. Teams of three students
                compete in a timed CBT examination covering all UTME
                subjects. Rankings are determined by score, speed and
                accuracy.
              </p>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">
                Competition Schedule
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span>Registration Opens</span>
                  <strong>1 January 2027</strong>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span>Registration Closes</span>
                  <strong>20 January 2027</strong>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span>Competition Date</span>
                  <strong>25 January 2027</strong>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span>Result Release</span>
                  <strong>27 January 2027</strong>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">
                Competition Rules
              </h2>

              <ul className="space-y-3 text-slate-600">
                <li>• Each team must consist of exactly 3 students.</li>
                <li>• Internet connection is required.</li>
                <li>• Webcam monitoring may be enabled.</li>
                <li>• Late participants cannot join after the exam starts.</li>
                <li>• Any malpractice leads to disqualification.</li>
                <li>• Scores are ranked nationally.</li>
              </ul>
            </section>
          </div>

          {/* Right */}
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Competition Summary
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span>Subject</span>
                  <strong>All UTME Subjects</strong>
                </div>

                <div className="flex justify-between">
                  <span>Duration</span>
                  <strong>2 Hours</strong>
                </div>

                <div className="flex justify-between">
                  <span>Questions</span>
                  <strong>180</strong>
                </div>

                <div className="flex justify-between">
                  <span>Registered Teams</span>
                  <strong>640</strong>
                </div>

                <div className="flex justify-between">
                  <span>Prize Pool</span>
                  <strong>₦1,000,000</strong>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Your Team
              </h3>

              <div className="mt-5 rounded-xl bg-green-50 p-4">
                <p className="font-semibold text-green-700">
                  Team Registered
                </p>

                <p className="mt-2 text-sm text-green-600">
                  Your team has successfully registered for this
                  competition.
                </p>
              </div>

              <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
                Enter Waiting Room
              </button>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Top Teams
              </h3>

              <div className="mt-5 space-y-4">
                {[
                  "Team Alpha",
                  "Bright Minds",
                  "Future Doctors",
                  "Scholars NG",
                  "Victory Team",
                ].map((team, index) => (
                  <div
                    key={team}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                  >
                    <span>
                      #{index + 1} {team}
                    </span>

                    <strong>{995 - index * 8}</strong>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}