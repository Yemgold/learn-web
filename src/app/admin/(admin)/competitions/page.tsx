



"use client";

import Link from "next/link";
import {
  Plus,
  Search,
  Trophy,
  Users,
  CalendarDays,
  Clock3,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const competitions = [
  {
    id: "1",
    title: "JAMB League 2027 Championship",
    category: "National",
    status: "Upcoming",
    startDate: "15 Jan 2027",
    teams: 425,
    maxTeams: 1000,
  },
  {
    id: "2",
    title: "Science Challenge",
    category: "STEM",
    status: "Registration Open",
    startDate: "05 Dec 2026",
    teams: 182,
    maxTeams: 300,
  },
  {
    id: "3",
    title: "Mock CBT Tournament",
    category: "Practice",
    status: "Completed",
    startDate: "18 Jul 2026",
    teams: 300,
    maxTeams: 300,
  },
];

export default function AdminCompetitionsPage() {
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
              Competitions
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Create, edit and manage every competition running
              on the JAMB League platform.
            </p>
          </div>

          <Link href="/admin/competitions/create">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              New Competition
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-4">
          <Card className="text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />
            <h2 className="mt-4 text-3xl font-bold">12</h2>
            <p className="mt-2 text-slate-600">
              Total Competitions
            </p>
          </Card>

          <Card className="text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-blue-600" />
            <h2 className="mt-4 text-3xl font-bold">3</h2>
            <p className="mt-2 text-slate-600">
              Upcoming
            </p>
          </Card>

          <Card className="text-center">
            <Clock3 className="mx-auto h-10 w-10 text-green-600" />
            <h2 className="mt-4 text-3xl font-bold">2</h2>
            <p className="mt-2 text-slate-600">
              Active
            </p>
          </Card>

          <Card className="text-center">
            <Users className="mx-auto h-10 w-10 text-purple-600" />
            <h2 className="mt-4 text-3xl font-bold">
              2,436
            </h2>
            <p className="mt-2 text-slate-600">
              Registered Teams
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <Input
            placeholder="Search competitions..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Competition List */}
        <div className="space-y-6">
          {competitions.map((competition) => (
            <Card
              key={competition.id}
              hoverable
              className="p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {competition.title}
                    </h2>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {competition.category}
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {competition.status}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {competition.startDate}
                    </span>

                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {competition.teams}/
                      {competition.maxTeams} Teams
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    View
                  </Button>

                  <Button
                    variant="outline"
                    leftIcon={
                      <Pencil className="h-4 w-4" />
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    leftIcon={
                      <Trash2 className="h-4 w-4" />
                    }
                  >
                    Delete
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