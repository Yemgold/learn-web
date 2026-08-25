



"use client";

import {
  Trophy,
  Medal,
  Users,
  Search,
  Download,
  Eye,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const results = [
  {
    id: "RES-001",
    competition: "JAMB League 2027",
    team: "Future Doctors",
    school: "King's College Lagos",
    score: 382,
    position: 1,
    status: "Completed",
  },
  {
    id: "RES-002",
    competition: "JAMB League 2027",
    team: "Science Legends",
    school: "FGGC Benin",
    score: 376,
    position: 2,
    status: "Completed",
  },
  {
    id: "RES-003",
    competition: "JAMB League 2027",
    team: "Brain Builders",
    school: "Government College Ibadan",
    score: 370,
    position: 3,
    status: "Completed",
  },
  {
    id: "RES-004",
    competition: "Mock CBT Tournament",
    team: "Elite Scholars",
    school: "Corona Secondary School",
    score: 361,
    position: 4,
    status: "Published",
  },
];

export default function AdminResultsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Admin Dashboard
            </span>

            <h1 className="mt-4 text-4xl font-bold">
              Competition Results
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Review competition rankings, publish official
              results, and monitor team performance across all
              competitions.
            </p>
          </div>

          <Button
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Results
          </Button>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold">
              18
            </h2>

            <p className="mt-2 text-slate-600">
              Competitions
            </p>
          </Card>

          <Card className="text-center">
            <Users className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">
              2,436
            </h2>

            <p className="mt-2 text-slate-600">
              Teams Ranked
            </p>
          </Card>

          <Card className="text-center">
            <Medal className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              54
            </h2>

            <p className="mt-2 text-slate-600">
              Winners Awarded
            </p>
          </Card>

          <Card className="text-center">
            <TrendingUp className="mx-auto h-10 w-10 text-purple-600" />

            <h2 className="mt-4 text-3xl font-bold">
              98%
            </h2>

            <p className="mt-2 text-slate-600">
              Completion Rate
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <Input
            placeholder="Search by competition, team or school..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {results.map((result) => (
            <Card
              key={result.id}
              hoverable
              className="p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {result.team}
                    </h2>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      #{result.position}
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {result.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <p>
                      <strong>Competition:</strong>{" "}
                      {result.competition}
                    </p>

                    <p>
                      <strong>School:</strong>{" "}
                      {result.school}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Result ID: {result.id}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-2xl bg-blue-100 px-8 py-5 text-center">
                    <p className="text-4xl font-bold text-blue-700">
                      {result.score}
                    </p>

                    <p className="text-sm text-blue-600">
                      Total Score
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}