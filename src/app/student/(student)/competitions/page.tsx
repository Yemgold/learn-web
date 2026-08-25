



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
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Student Portal
          </span>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            My Competitions
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            View competitions you've joined, register for new
            competitions, and monitor upcoming events.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <Card hoverable className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold">3</h2>

            <p className="mt-2 text-slate-600">
              Total Competitions
            </p>
          </Card>

          <Card hoverable className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">1</h2>

            <p className="mt-2 text-slate-600">
              Joined
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Clock3 className="mx-auto h-12 w-12 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">2</h2>

            <p className="mt-2 text-slate-600">
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
              className="p-8"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {competition.subject}
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {competition.status}
                    </span>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold">
                    {competition.title}
                  </h2>

                  <div className="mt-6 flex flex-wrap gap-6 text-slate-600">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      {competition.startDate}
                    </span>

                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {competition.teams}
                    </span>

                    <span className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {competition.prize}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Link
                    href={`/competitions/${competition.id}`}
                  >
                    <Button
                      fullWidth
                      rightIcon={
                        <ArrowRight className="h-4 w-4" />
                      }
                    >
                      View Details
                    </Button>
                  </Link>

                  {competition.joined ? (
                    <Link
                      href={`/competitions/${competition.id}/room`}
                    >
                      <Button
                        fullWidth
                        variant="outline"
                      >
                        Enter Waiting Room
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/competitions/${competition.id}/register`}
                    >
                      <Button
                        fullWidth
                        variant="secondary"
                      >
                        Register Team
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