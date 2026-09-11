


"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  UserX,
  Trophy,
  Eye,
  ShieldCheck,
  Clock3,
  MoreHorizontal,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ============================================================
   TYPES
   ============================================================ */

type ParticipantStatus =
  | "Registered"
  | "Confirmed"
  | "Disqualified"
  | "Completed";

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  teamName: string;
  school: string;
  state: string;
  status: ParticipantStatus;
  registeredAt: string;
  score: number;
}

/* ============================================================
   TEMPORARY DATA
   Replace with backend data later.
   ============================================================ */

const competition = {
  id: "1",
  title: "JAMB League 2027 Championship",
  category: "National",
  status: "Upcoming",
};

const participants: Participant[] = [
  {
    id: "p001",
    name: "Daniel Okafor",
    email: "daniel@example.com",
    phone: "08012345678",
    teamName: "Eagles FC",
    school: "University of Lagos",
    state: "Lagos",
    status: "Confirmed",
    registeredAt: "28 Aug 2026",
    score: 0,
  },
  {
    id: "p002",
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "08023456789",
    teamName: "Brain Masters",
    school: "ABU Zaria",
    state: "Kaduna",
    status: "Registered",
    registeredAt: "27 Aug 2026",
    score: 0,
  },
  {
    id: "p003",
    name: "Samuel Adeyemi",
    email: "samuel@example.com",
    phone: "08034567890",
    teamName: "Future Stars",
    school: "University of Ibadan",
    state: "Oyo",
    status: "Confirmed",
    registeredAt: "26 Aug 2026",
    score: 0,
  },
  {
    id: "p004",
    name: "Mary Johnson",
    email: "mary@example.com",
    phone: "08045678901",
    teamName: "Smart Minds",
    school: "University of Nigeria",
    state: "Enugu",
    status: "Completed",
    registeredAt: "25 Aug 2026",
    score: 86,
  },
  {
    id: "p005",
    name: "Ibrahim Musa",
    email: "ibrahim@example.com",
    phone: "08056789012",
    teamName: "Northern Scholars",
    school: "Bayero University",
    state: "Kano",
    status: "Registered",
    registeredAt: "24 Aug 2026",
    score: 0,
  },
  {
    id: "p006",
    name: "Grace Eze",
    email: "grace@example.com",
    phone: "08067890123",
    teamName: "Elite Scholars",
    school: "University of Port Harcourt",
    state: "Rivers",
    status: "Disqualified",
    registeredAt: "23 Aug 2026",
    score: 0,
  },
];

/* ============================================================
   HELPERS
   ============================================================ */

function getStatusClasses(status: ParticipantStatus) {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-700";

    case "Registered":
      return "bg-blue-100 text-blue-700";

    case "Completed":
      return "bg-purple-100 text-purple-700";

    case "Disqualified":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

/* ============================================================
   PAGE
   ============================================================ */

export default function CompetitionParticipantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | ParticipantStatus>("All");

  const filteredParticipants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return participants.filter((participant) => {
      const matchesSearch =
        !query ||
        participant.name.toLowerCase().includes(query) ||
        participant.email.toLowerCase().includes(query) ||
        participant.teamName.toLowerCase().includes(query) ||
        participant.school.toLowerCase().includes(query) ||
        participant.state.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        participant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalParticipants = participants.length;

  const confirmedParticipants = participants.filter(
    (participant) => participant.status === "Confirmed",
  ).length;

  const registeredParticipants = participants.filter(
    (participant) => participant.status === "Registered",
  ).length;

  const completedParticipants = participants.filter(
    (participant) => participant.status === "Completed",
  ).length;

  const disqualifiedParticipants = participants.filter(
    (participant) => participant.status === "Disqualified",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">
          <Link
            href={`/admin/solveandwin/competitions/${competition.id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Admin Dashboard
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {competition.status}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                Participants
              </h1>

              <p className="mt-2 text-lg text-slate-600">
                {competition.title}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Manage registered participants, confirmation status,
                qualification and competition participation.
              </p>
            </div>

            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export Participants
            </Button>
          </div>
        </div>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalParticipants}
                </p>
              </div>

              <Users className="h-9 w-9 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Registered
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {registeredParticipants}
                </p>
              </div>

              <Clock3 className="h-9 w-9 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Confirmed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {confirmedParticipants}
                </p>
              </div>

              <UserCheck className="h-9 w-9 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {completedParticipants}
                </p>
              </div>

              <Trophy className="h-9 w-9 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Disqualified
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {disqualifiedParticipants}
                </p>
              </div>

              <UserX className="h-9 w-9 text-red-600" />
            </div>
          </Card>
        </div>

        {/* ====================================================
            SEARCH / FILTERS
        ==================================================== */}

        <Card className="mb-8 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by participant, email, team, school or state..."
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "All",
                  "Registered",
                  "Confirmed",
                  "Completed",
                  "Disqualified",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    statusFilter === status
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ====================================================
            PARTICIPANTS TABLE
        ==================================================== */}

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Competition Participants
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredParticipants.length} of{" "}
                  {totalParticipants} participants
                </p>
              </div>

              {statusFilter !== "All" && (
                <button
                  type="button"
                  onClick={() => setStatusFilter("All")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {filteredParticipants.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No participants found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or participant status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Participant
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Team
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      School
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      State
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Score
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParticipants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      {/* Participant */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {participant.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {participant.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {participant.email}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {participant.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {participant.teamName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID: {participant.id}
                        </p>
                      </td>

                      {/* School */}
                      <td className="px-6 py-5">
                        <p className="max-w-[220px] text-sm font-medium text-slate-700">
                          {participant.school}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Registered {participant.registeredAt}
                        </p>
                      </td>

                      {/* State */}
                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        {participant.state}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                            participant.status,
                          )}`}
                        >
                          {participant.status}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="px-6 py-5">
                        {participant.status === "Completed" ? (
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />

                            <span className="font-bold text-slate-900">
                              {participant.score}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            leftIcon={
                              <Eye className="h-4 w-4" />
                            }
                          >
                            View
                          </Button>

                          <Button
                            variant="outline"
                            aria-label={`More actions for ${participant.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ====================================================
            ADMIN NOTE
        ==================================================== */}

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

            <div>
              <h3 className="font-semibold text-blue-900">
                Participant management
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                Registration, confirmation, disqualification,
                competition access and final scores should ultimately
                be controlled by the competition backend. This page
                currently uses temporary data for the admin UI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
