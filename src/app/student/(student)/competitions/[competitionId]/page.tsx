
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
    <main className="min-h-screen bg-slate-950 py-10 text-white">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-blue-900/70 to-indigo-950/80 p-8 shadow-sm">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold text-blue-100">
            Competition Details
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            JAMB League Championship
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-blue-100/80">
            View competition information, team status, schedule,
            leaderboard, and prepare for the upcoming CBT challenge.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-green-400/30 bg-green-500/15 px-4 py-2 font-semibold text-green-300">
              Registration Open
            </span>

            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-slate-200">
              Competition ID: {competitionId}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-white">
                Competition Overview
              </h2>

              <p className="mt-4 leading-8 text-slate-400">
                Participate in Nigeria's biggest online JAMB
                preparation competition. Teams of three students
                compete in a timed CBT examination covering all UTME
                subjects. Rankings are determined by score, speed and
                accuracy.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-white">
                Competition Schedule
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <span className="text-slate-400">
                    Registration Opens
                  </span>

                  <strong className="text-white">
                    1 January 2027
                  </strong>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <span className="text-slate-400">
                    Registration Closes
                  </span>

                  <strong className="text-white">
                    20 January 2027
                  </strong>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <span className="text-slate-400">
                    Competition Date
                  </span>

                  <strong className="text-white">
                    25 January 2027
                  </strong>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <span className="text-slate-400">
                    Result Release
                  </span>

                  <strong className="text-white">
                    27 January 2027
                  </strong>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-white">
                Competition Rules
              </h2>

              <ul className="space-y-3 text-slate-400">
                <li>
                  • Each team must consist of exactly 3 students.
                </li>

                <li>
                  • Internet connection is required.
                </li>

                <li>
                  • Webcam monitoring may be enabled.
                </li>

                <li>
                  • Late participants cannot join after the exam starts.
                </li>

                <li>
                  • Any malpractice leads to disqualification.
                </li>

                <li>
                  • Scores are ranked nationally.
                </li>
              </ul>
            </section>
          </div>

          {/* Right */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-white">
                Competition Summary
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">
                    Subject
                  </span>

                  <strong className="text-right text-white">
                    All UTME Subjects
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">
                    Duration
                  </span>

                  <strong className="text-white">
                    2 Hours
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">
                    Questions
                  </span>

                  <strong className="text-white">
                    180
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">
                    Registered Teams
                  </span>

                  <strong className="text-white">
                    640
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">
                    Prize Pool
                  </span>

                  <strong className="text-yellow-300">
                    ₦1,000,000
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-white">
                Your Team
              </h3>

              <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                <p className="font-semibold text-green-300">
                  Team Registered
                </p>

                <p className="mt-2 text-sm leading-6 text-green-200/70">
                  Your team has successfully registered for this
                  competition.
                </p>
              </div>

              <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500">
                Enter Waiting Room
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-white">
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
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3"
                  >
                    <span className="text-slate-300">
                      #{index + 1} {team}
                    </span>

                    <strong className="text-white">
                      {995 - index * 8}
                    </strong>
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
