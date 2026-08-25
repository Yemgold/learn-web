



"use client";

import Link from "next/link";

import {
  Trophy,
  Medal,
  Crown,
  ArrowRight,
  TrendingUp,
  Users,
  MapPin,
  Sparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

const leaderboard = [
  {
    rank: 1,
    team: "Team Champions",
    school: "Lagos Science Academy",
    location: "Lagos",
    score: 985,
    members: 3,
  },

  {
    rank: 2,
    team: "Future Leaders",
    school: "Abuja College",
    location: "Abuja",
    score: 942,
    members: 3,
  },

  {
    rank: 3,
    team: "Brain Masters",
    school: "Ibadan High School",
    location: "Oyo",
    score: 918,
    members: 3,
  },

  {
    rank: 4,
    team: "JAMB Stars",
    school: "Kano Model School",
    location: "Kano",
    score: 884,
    members: 3,
  },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-500">
        <Crown size={22} strokeWidth={2.2} />
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Medal size={22} strokeWidth={2.2} />
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <Medal size={22} strokeWidth={2.2} />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-sm font-black text-slate-400">
      {rank}
    </div>
  );
}

export default function LeaderboardPreview() {
  return (
    <section className="relative overflow-hidden bg-[#f5f8ff] py-20 sm:py-24 lg:py-28">

      {/* =========================================================
          BACKGROUND EFFECTS
         ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-40 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl"
      />

      <Container>

        {/* =======================================================
            SECTION HEADER
           ======================================================= */}

        <div className="relative mx-auto mb-12 max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm">

            <TrendingUp
              size={14}
              className="text-blue-600"
            />

            National Leaderboard

          </div>


          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">

            Compete.

            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              {" "}Rank.
            </span>

            <span className="block">
              Become a Champion.
            </span>

          </h2>


          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
            Every answer counts. Track your team's performance, climb the
            rankings and see how you compare with students from across Nigeria.
          </p>

        </div>


        {/* =======================================================
            LEADERBOARD
           ======================================================= */}

        <div className="relative mx-auto max-w-5xl">

          {/* Glow behind card */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-blue-500/5 blur-2xl"
          />


          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-xl shadow-blue-900/5">

            {/* ===================================================
                DARK HEADER
               =================================================== */}

            <div className="relative overflow-hidden bg-gradient-to-br from-[#071438] via-[#0b1f55] to-[#172d70] px-6 py-7 sm:px-8">

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-yellow-400/10 blur-3xl"
              />


              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                {/* Competition */}

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20">

                    <Trophy
                      size={24}
                      strokeWidth={2.2}
                    />

                  </div>


                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="font-extrabold text-white sm:text-lg">
                        National Rankings
                      </h3>

                      <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                        Live
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-blue-100/70 sm:text-sm">
                      JAMB League 2027 Championship
                    </p>

                  </div>

                </div>


                {/* Participants */}

                <div className="flex items-center gap-2 text-xs text-blue-100/70">

                  <Users size={15} />

                  <span>
                    Teams competing nationwide
                  </span>

                </div>

              </div>

            </div>


            {/* ===================================================
                TOP 3
               =================================================== */}

            <div className="grid border-b border-slate-100 bg-slate-50/70 sm:grid-cols-3">

              {/* SECOND */}

              <div className="px-6 py-6 text-center sm:order-1">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200/70 text-2xl">
                  🥈
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  2nd Place
                </p>

                <h4 className="mt-1 text-sm font-extrabold text-slate-950">
                  Future Leaders
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  942 points
                </p>

              </div>


              {/* FIRST */}

              <div className="relative border-y border-slate-100 px-6 py-6 text-center sm:order-2 sm:border-x sm:border-y-0">

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-2xl"
                />

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/15 text-3xl ring-4 ring-yellow-400/10">
                  🥇
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-yellow-600">
                  1st Place
                </p>

                <h4 className="mt-1 text-sm font-extrabold text-slate-950">
                  Team Champions
                </h4>

                <p className="mt-1 text-xs font-semibold text-yellow-600">
                  985 points
                </p>

              </div>


              {/* THIRD */}

              <div className="px-6 py-6 text-center sm:order-3">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                  🥉
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                  3rd Place
                </p>

                <h4 className="mt-1 text-sm font-extrabold text-slate-950">
                  Brain Masters
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  918 points
                </p>

              </div>

            </div>


            {/* ===================================================
                TABLE LABEL
               =================================================== */}

            <div className="hidden border-b border-slate-100 bg-white px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:grid sm:grid-cols-[1fr_100px]">

              <span>
                Team / School
              </span>

              <span className="text-right">
                Score
              </span>

            </div>


            {/* ===================================================
                RANKING ROWS
               =================================================== */}

            <div className="divide-y divide-slate-100">

              {leaderboard.map((item) => (

                <div
                  key={item.rank}
                  className="group flex items-center justify-between px-5 py-5 transition-all duration-300 hover:bg-blue-50/50 sm:px-8"
                >

                  {/* Team information */}

                  <div className="flex min-w-0 items-center gap-3 sm:gap-5">

                    <RankIcon rank={item.rank} />


                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h4 className="truncate text-sm font-extrabold text-slate-950 sm:text-base">
                          {item.team}
                        </h4>

                        {item.rank === 1 && (
                          <Sparkles
                            size={14}
                            className="shrink-0 text-yellow-500"
                          />
                        )}

                      </div>


                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">

                        <span className="truncate">
                          {item.school}
                        </span>

                        <span className="hidden items-center gap-1 sm:flex">
                          <MapPin size={11} />
                          {item.location}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Score */}

                  <div className="ml-4 text-right">

                    <p className="text-lg font-black text-blue-600 sm:text-xl">
                      {item.score}
                    </p>

                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Points
                    </p>

                  </div>

                </div>

              ))}

            </div>


            {/* ===================================================
                CTA
               =================================================== */}

            <div className="border-t border-slate-100 bg-slate-50/70 p-6 sm:p-7">

              <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

                <div className="text-center sm:text-left">

                  <p className="text-sm font-bold text-slate-900">
                    Think your team can make the top?
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Start practicing and begin your climb today.
                  </p>

                </div>


                <Link
                  href="/student/competitions/leaderboard"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
                >

                  View Full Leaderboard

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </Link>

              </div>

            </div>

          </div>

        </div>


        {/* =======================================================
            BOTTOM STATS
           ======================================================= */}

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">

            <p className="text-xl font-black text-slate-950">
              10K+
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Students competing
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">

            <p className="text-xl font-black text-slate-950">
              500+
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Schools represented
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">

            <p className="text-xl font-black text-slate-950">
              ₦1M+
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Competition rewards
            </p>

          </div>

        </div>

      </Container>

    </section>
  );
}