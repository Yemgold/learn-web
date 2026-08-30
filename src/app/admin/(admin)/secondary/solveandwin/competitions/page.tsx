



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
  Settings2,
  BookOpen,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ============================================================
   TYPES
   ============================================================ */

interface Competition {
  id: string;
  title: string;
  category: string;
  status: string;
  startDate: string;
  teams: number;
  maxTeams: number;

  /*
   * Number of subjects currently attached
   * to this competition.
   *
   * This will eventually come from the backend.
   */
  subjects: number;

  /*
   * Total questions currently attached
   * to the competition.
   *
   * This will eventually come from the backend.
   */
  questions: number;
}

/* ============================================================
   TEMPORARY DATA
   ============================================================

   Replace this with the backend GET endpoint once your
   competition API is ready.

   Recommended future endpoint:

   GET /admin/competitions
   ============================================================ */

const competitions: Competition[] = [
  {
    id: "1",
    title: "JAMB League 2027 Championship",
    category: "National",
    status: "Upcoming",
    startDate: "15 Jan 2027",
    teams: 425,
    maxTeams: 1000,
    subjects: 5,
    questions: 180,
  },
  {
    id: "2",
    title: "Science Challenge",
    category: "STEM",
    status: "Registration Open",
    startDate: "05 Dec 2026",
    teams: 182,
    maxTeams: 300,
    subjects: 3,
    questions: 90,
  },
  {
    id: "3",
    title: "Mock CBT Tournament",
    category: "Practice",
    status: "Completed",
    startDate: "18 Jul 2026",
    teams: 300,
    maxTeams: 300,
    subjects: 4,
    questions: 120,
  },
];

/* ============================================================
   STATUS STYLING
   ============================================================ */

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700";

    case "registration open":
      return "bg-blue-100 text-blue-700";

    case "upcoming":
      return "bg-yellow-100 text-yellow-700";

    case "completed":
      return "bg-slate-100 text-slate-600";

    case "draft":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminCompetitionsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">

        {/* ==================================================
           HEADER
           ================================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Admin Dashboard
            </span>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Competitions
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Create, configure and manage every competition
              running on the JAMB League platform.
            </p>
          </div>

          <Link href="/admin/secondary/solveandwin/competitions/create">
            <Button
              leftIcon={
                <Plus className="h-4 w-4" />
              }
            >
              New Competition
            </Button>
          </Link>

        </div>

        {/* ==================================================
           STATISTICS
           ================================================== */}

        <div className="mb-10 grid gap-6 md:grid-cols-4">

          <Card className="text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              12
            </h2>

            <p className="mt-2 text-slate-600">
              Total Competitions
            </p>
          </Card>

          <Card className="text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              3
            </h2>

            <p className="mt-2 text-slate-600">
              Upcoming
            </p>
          </Card>

          <Card className="text-center">
            <Clock3 className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              2
            </h2>

            <p className="mt-2 text-slate-600">
              Active
            </p>
          </Card>

          <Card className="text-center">
            <Users className="mx-auto h-10 w-10 text-purple-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              2,436
            </h2>

            <p className="mt-2 text-slate-600">
              Registered Teams
            </p>
          </Card>

        </div>

        {/* ==================================================
           SEARCH
           ================================================== */}

        <Card className="mb-8">
          <Input
            placeholder="Search competitions..."
            leftIcon={
              <Search className="h-4 w-4" />
            }
          />
        </Card>

        {/* ==================================================
           COMPETITION LIST
           ================================================== */}

        <div className="space-y-6">

          {competitions.map(
            (competition) => (
              <Card
                key={competition.id}
                hoverable
                className="p-8"
              >

                <div className="flex flex-col gap-7">

                  {/* ========================================
                     TOP SECTION
                     ======================================== */}

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    {/* Competition Information */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-2xl font-bold text-slate-900">
                          {competition.title}
                        </h2>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {competition.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            competition.status,
                          )}`}
                        >
                          {competition.status}
                        </span>

                      </div>

                      {/* Metadata */}

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">

                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />

                          {competition.startDate}
                        </span>

                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />

                          {competition.teams}/
                          {competition.maxTeams} Teams
                        </span>

                        <span className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />

                          {competition.subjects}{" "}
                          {competition.subjects === 1
                            ? "Subject"
                            : "Subjects"}
                        </span>

                        <span className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />

                          {competition.questions} Questions
                        </span>

                      </div>

                    </div>

                    {/* ======================================
                       PRIMARY MANAGE BUTTON
                       ====================================== */}

                    <Link
                      href={`/admin/secondary/solveandwin/competitions/${competition.id}`}
                      className="shrink-0"
                    >
                      <Button
                        leftIcon={
                          <Settings2 className="h-4 w-4" />
                        }
                      >
                        Manage Competition
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>

                  </div>

                  {/* ========================================
                     COMPETITION CONTENT SUMMARY
                     ======================================== */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          Competition Content
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Manage the subjects and questions
                          students will answer.
                        </p>

                      </div>

                      <div className="flex flex-wrap gap-3">

                        <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Subjects
                          </p>

                          <p className="mt-1 text-lg font-bold text-slate-900">
                            {competition.subjects}
                          </p>

                        </div>

                        <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Questions
                          </p>

                          <p className="mt-1 text-lg font-bold text-slate-900">
                            {competition.questions}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ========================================
                     ACTIONS
                     ======================================== */}

                  <div className="flex flex-wrap items-center gap-3 border-t pt-5">

                    {/* Manage */}

                    <Link
                      href={`/admin/secondary/solveandwin/competitions/${competition.id}`}
                    >
                      <Button
                        variant="outline"
                        leftIcon={
                          <Settings2 className="h-4 w-4" />
                        }
                      >
                        Manage
                      </Button>
                    </Link>

                    {/* View */}

                    <Link
                      href={`/admin/secondary/solveandwin/competitions/${competition.id}`}
                    >
                      <Button
                        variant="outline"
                        leftIcon={
                          <Eye className="h-4 w-4" />
                        }
                      >
                        View
                      </Button>
                    </Link>

                    {/* Edit */}

                    <Link
                      href={`/admin/secondary/solveandwin/competitions/${competition.id}/edit`}
                    >
                      <Button
                        variant="outline"
                        leftIcon={
                          <Pencil className="h-4 w-4" />
                        }
                      >
                        Edit
                      </Button>
                    </Link>

                    {/* Delete */}

                    <Button
                      variant="destructive"
                      leftIcon={
                        <Trash2 className="h-4 w-4" />
                      }
                      onClick={() => {
                        /*
                         * TODO:
                         *
                         * Replace this with your backend
                         * delete request.
                         *
                         * DELETE
                         * /admin/competitions/:competitionId
                         */

                        console.log(
                          "Delete competition:",
                          competition.id,
                        );
                      }}
                    >
                      Delete
                    </Button>

                  </div>

                </div>

              </Card>
            ),
          )}

        </div>

        {/* ==================================================
           EMPTY STATE
           ================================================== */}

        {competitions.length === 0 && (
          <Card className="p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No competitions yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Create your first competition and then add
              subjects and questions from the competition
              management page.
            </p>

            <div className="mt-6">
              <Link href="/admin/secondary/competitions/create">
                <Button
                  leftIcon={
                    <Plus className="h-4 w-4" />
                  }
                >
                  Create Competition
                </Button>
              </Link>
            </div>

          </Card>
        )}

      </div>
    </main>
  );
}
