




"use client";

import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Trophy,
  School,
  UserCheck,
  Eye,
  Download,
  Filter,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const teams = [
  {
    id: "TEAM-001",
    name: "Future Doctors",
    school: "King's College Lagos",
    captain: "John Doe",
    members: 3,
    competition: "JAMB League 2027",
    status: "Qualified",
  },
  {
    id: "TEAM-002",
    name: "Science Legends",
    school: "FGGC Benin",
    captain: "Grace Johnson",
    members: 3,
    competition: "JAMB League 2027",
    status: "Qualified",
  },
  {
    id: "TEAM-003",
    name: "Brain Builders",
    school: "Government College Ibadan",
    captain: "David James",
    members: 3,
    competition: "Mock CBT Tournament",
    status: "Pending",
  },
  {
    id: "TEAM-004",
    name: "Elite Scholars",
    school: "Corona Secondary School",
    captain: "Mary Ibrahim",
    members: 3,
    competition: "JAMB League 2027",
    status: "Eliminated",
  },
];

export default function AdminTeamsPage() {
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
              Teams
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Manage participating teams, assign competitions,
              monitor team members and track qualification
              status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>

            <Link href="/admin/teams/create">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Create Team
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="text-center">
            <Users className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">
              1,608
            </h2>

            <p className="mt-2 text-slate-600">
              Total Teams
            </p>
          </Card>

          <Card className="text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold">
              820
            </h2>

            <p className="mt-2 text-slate-600">
              Qualified Teams
            </p>
          </Card>

          <Card className="text-center">
            <School className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              152
            </h2>

            <p className="mt-2 text-slate-600">
              Participating Schools
            </p>
          </Card>

          <Card className="text-center">
            <UserCheck className="mx-auto h-10 w-10 text-purple-600" />

            <h2 className="mt-4 text-3xl font-bold">
              4,824
            </h2>

            <p className="mt-2 text-slate-600">
              Registered Students
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <Input
            placeholder="Search by team, captain, school or competition..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Teams */}
        <div className="space-y-6">
          {teams.map((team) => (
            <Card
              key={team.id}
              hoverable
              className="p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {team.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        team.status === "Qualified"
                          ? "bg-green-100 text-green-700"
                          : team.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {team.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-slate-600">
                    <p>
                      <strong>Team ID:</strong> {team.id}
                    </p>

                    <p>
                      <strong>Captain:</strong>{" "}
                      {team.captain}
                    </p>

                    <p>
                      <strong>School:</strong>{" "}
                      {team.school}
                    </p>

                    <p>
                      <strong>Competition:</strong>{" "}
                      {team.competition}
                    </p>

                    <p>
                      <strong>Members:</strong>{" "}
                      {team.members}/3
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    View
                  </Button>

                  <Button variant="outline">
                    Edit
                  </Button>

                  <Button variant="destructive">
                    Remove
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