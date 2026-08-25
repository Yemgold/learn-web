



import Link from "next/link";
import {
  CalendarDays,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const competitions = [
  {
    id: "jamb-league-2027",
    title: "JAMB League 2027 Championship",
    subject: "All UTME Subjects",
    startDate: "January 15, 2027",
    teams: 250,
    maxTeams: 1000,
    prize: "₦1,000,000 Prize Pool",
    status: "Registration Open",
  },
  {
    id: "science-masters",
    title: "Science Masters Challenge",
    subject: "Physics • Chemistry • Biology",
    startDate: "February 10, 2027",
    teams: 120,
    maxTeams: 500,
    prize: "₦500,000 Prize Pool",
    status: "Registration Open",
  },
  {
    id: "math-genius",
    title: "Mathematics Genius Contest",
    subject: "Mathematics",
    startDate: "March 5, 2027",
    teams: 95,
    maxTeams: 300,
    prize: "₦300,000 Prize Pool",
    status: "Coming Soon",
  },
];

export default function CompetitionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="mb-12 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Competitions
          </span>

          <h1 className="mt-5 text-5xl font-bold text-slate-900">
            National Competitions
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            Join exciting academic competitions, compete with the
            brightest students across Nigeria, improve your UTME
            preparation, and win scholarships and amazing prizes.
          </p>
        </section>

        {/* Competition Grid */}
        <section className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {competitions.map((competition) => (
            <Card
              key={competition.id}
              hoverable
              className="flex flex-col"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  {competition.status}
                </span>

                <Trophy className="h-7 w-7 text-amber-500" />
              </div>

              <h2 className="text-2xl font-bold">
                {competition.title}
              </h2>

              <p className="mt-2 text-blue-600 font-medium">
                {competition.subject}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <CalendarDays className="h-5 w-5" />
                  <span>{competition.startDate}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <Users className="h-5 w-5" />
                  <span>
                    {competition.teams} / {competition.maxTeams} Teams
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <Trophy className="h-5 w-5" />
                  <span>{competition.prize}</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href={`/competitions/${competition.id}`}
                >
                  <Button
                    fullWidth
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                  >
                    View Competition
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}