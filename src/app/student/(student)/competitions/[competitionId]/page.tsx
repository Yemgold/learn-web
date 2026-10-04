




"use client";

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
            View competition information, schedule, rules, and everything
            you need to know before registration opens.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 font-semibold text-amber-300">
              Registration Not Open
            </span>

            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-slate-200">
              Competition ID: {competitionId}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Competition Overview */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-white">
                Competition Overview
              </h2>

              <p className="mt-4 leading-8 text-slate-400">
                Get ready for the JAMB League Championship, an online JAMB
                preparation competition where teams of three students compete
                in a timed CBT examination covering all UTME subjects.
                Registration will open before the competition begins.
              </p>

              <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="font-semibold text-blue-300">
                  Registration Coming Soon
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-200/70">
                  You can review the competition details now. Team creation
                  and registration will become available when registration
                  officially opens.
                </p>
              </div>
            </section>

            {/* Competition Schedule */}
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

            {/* Competition Rules */}
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
            {/* Competition Summary */}
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
                    0
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

            {/* Your Team */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-white">
                Your Team
              </h3>

              <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="font-semibold text-amber-300">
                  Registration Not Open
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-200/70">
                  Team registration for this competition has not started yet.
                  You will be able to create or join a team when registration
                  opens.
                </p>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl bg-slate-700 py-3 font-semibold text-slate-400"
              >
                Enter Waiting Room
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Waiting room will be available after registration opens.
              </p>
            </div>

            {/* Top Teams */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-white">
                Top Teams
              </h3>

              <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.03] p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-xl">
                  🏆
                </div>

                <p className="mt-4 font-semibold text-slate-200">
                  Leaderboard Not Available Yet
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Top teams and rankings will appear here once team
                  registration opens and the competition begins.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}