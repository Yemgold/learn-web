







import Link from "next/link";

import {
  Trophy,
  CalendarDays,
  Users,
  Clock3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const competitions = [
  {
    id: "jamb-league-2027",
    title: "JAMB League 2027 Championship",
    subject: "All UTME Subjects",
    startDate: "January 20, 2027",
    status: "Upcoming",
    teams: "250 / 1000 Teams",
    prize: "₦1,000,000",
    joined: true,
  },
  {
    id: "mathematics-masters",
    title: "Mathematics Masters Challenge",
    subject: "Mathematics",
    startDate: "February 10, 2027",
    status: "Registration Open",
    teams: "120 / 500 Teams",
    prize: "₦300,000",
    joined: false,
  },
  {
    id: "science-champions",
    title: "Science Champions",
    subject: "Physics • Chemistry • Biology",
    startDate: "March 5, 2027",
    status: "Coming Soon",
    teams: "0 / 500 Teams",
    prize: "₦500,000",
    joined: false,
  },
];

export default function StudentCompetitionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 pb-16 text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-300">
            Student Portal
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            My Competitions
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-400">
            View competitions you've joined, join new competitions, and monitor
            upcoming events.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <Card
            hoverable
            className="border-white/10 bg-white/[0.04] p-6 text-center shadow-none"
          >
            <Trophy className="mx-auto h-12 w-12 text-yellow-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">3</h2>

            <p className="mt-2 text-slate-400">
              Total Competitions
            </p>
          </Card>

          <Card
            hoverable
            className="border-white/10 bg-white/[0.04] p-6 text-center shadow-none"
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">1</h2>

            <p className="mt-2 text-slate-400">
              Joined
            </p>
          </Card>

          <Card
            hoverable
            className="border-white/10 bg-white/[0.04] p-6 text-center shadow-none"
          >
            <Clock3 className="mx-auto h-12 w-12 text-blue-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">2</h2>

            <p className="mt-2 text-slate-400">
              Upcoming
            </p>
          </Card>
        </div>

        {/* Competition List */}
        <div className="space-y-8">
          {competitions.map((competition) => (
            <Card
              key={competition.id}
              hoverable
              className="border-white/10 bg-white/[0.04] p-8 shadow-none"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                {/* Competition Information */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-300">
                      {competition.subject}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                        competition.status === "Coming Soon"
                          ? "border-white/10 bg-white/[0.05] text-slate-400"
                          : competition.status === "Registration Open"
                            ? "border-green-500/30 bg-green-500/10 text-green-300"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-300"
                      }`}
                    >
                      {competition.status}
                    </span>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">
                    {competition.title}
                  </h2>

                  <div className="mt-6 flex flex-wrap gap-6 text-slate-400">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-slate-500" />
                      {competition.startDate}
                    </span>

                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-slate-500" />
                      {competition.teams}
                    </span>

                    <span className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-300">
                        {competition.prize}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full flex-col gap-4 lg:w-56">
                  {/* Competition Details */}
                  <Link
                    href={`/student/competitions/${competition.id}`}
                    className="w-full"
                  >
                    <Button
                      fullWidth
                      rightIcon={
                        <ArrowRight className="h-4 w-4" />
                      }
                      className="bg-blue-600 text-white hover:bg-blue-500"
                    >
                      View Details
                    </Button>
                  </Link>

                  {/* Joined / Not Joined */}
                  {competition.joined ? (
                    <>
                      <Link
                        href={`/student/competitions/${competition.id}/team`}
                        className="w-full"
                      >
                        <Button
                          fullWidth
                          variant="secondary"
                          className="border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.12] hover:text-white"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          My Team
                        </Button>
                      </Link>

                      <Link
                        href={`/student/competitions/${competition.id}/room`}
                        className="w-full"
                      >
                        <Button
                          fullWidth
                          variant="outline"
                          className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                        >
                          Enter Waiting Room
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/student/competitions/${competition.id}/team/register`}
                      className="w-full"
                    >
                      <Button
                        fullWidth
                        variant="secondary"
                        className="border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.12] hover:text-white"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Join / Create Team
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
