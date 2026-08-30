





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileQuestion,
  Pencil,
  Plus,
  Settings2,
  Trophy,
  Users,
  Trash2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ============================================================
   TYPES
   ============================================================ */

interface CompetitionSubject {
  id: string;
  subjectId: string;
  name: string;
  questionCount: number;
  selectedQuestions: number;
  marksPerQuestion: number;
  easy: number;
  medium: number;
  hard: number;
}

interface Competition {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;

  startDate: string;
  endDate: string;

  registrationStart: string;
  registrationEnd: string;

  teams: number;
  maxTeams: number;

  subjects: CompetitionSubject[];

  totalQuestions: number;
  totalMarks: number;
}

/* ============================================================
   TEMPORARY COMPETITION DATA
   ============================================================

   IMPORTANT:

   This is temporary UI data.

   Replace this with your backend request when your
   competition endpoints are ready.

   Recommended endpoint:

   GET /admin/solve-and-win/competitions/:competitionId

   ============================================================ */

const competition: Competition = {
  id: "1",

  title: "JAMB League 2027 Championship",

  description:
    "The national JAMB League championship where students compete across multiple subjects and test their CBT knowledge.",

  category: "National",

  status: "Upcoming",

  startDate: "15 Jan 2027",

  endDate: "20 Jan 2027",

  registrationStart: "01 Dec 2026",

  registrationEnd: "10 Jan 2027",

  teams: 425,

  maxTeams: 1000,

  subjects: [
    {
      id: "subject-1",
      subjectId: "english",
      name: "Use of English",
      questionCount: 40,
      selectedQuestions: 40,
      marksPerQuestion: 2,
      easy: 12,
      medium: 20,
      hard: 8,
    },

    {
      id: "subject-2",
      subjectId: "mathematics",
      name: "Mathematics",
      questionCount: 40,
      selectedQuestions: 38,
      marksPerQuestion: 2,
      easy: 12,
      medium: 20,
      hard: 8,
    },

    {
      id: "subject-3",
      subjectId: "biology",
      name: "Biology",
      questionCount: 30,
      selectedQuestions: 30,
      marksPerQuestion: 2,
      easy: 10,
      medium: 14,
      hard: 6,
    },

    {
      id: "subject-4",
      subjectId: "chemistry",
      name: "Chemistry",
      questionCount: 30,
      selectedQuestions: 30,
      marksPerQuestion: 2,
      easy: 10,
      medium: 14,
      hard: 6,
    },

    {
      id: "subject-5",
      subjectId: "physics",
      name: "Physics",
      questionCount: 40,
      selectedQuestions: 35,
      marksPerQuestion: 2,
      easy: 12,
      medium: 20,
      hard: 8,
    },
  ],

  totalQuestions: 180,

  totalMarks: 360,
};

/* ============================================================
   STATUS
   ============================================================ */

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700";

    case "upcoming":
      return "bg-yellow-100 text-yellow-700";

    case "registration open":
      return "bg-blue-100 text-blue-700";

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

export default function CompetitionManagementPage() {
  const params = useParams();

  const competitionId = String(
    params?.competitionId ?? competition.id,
  );

  /* ==========================================================
     DERIVED DATA
     ========================================================== */

  const totalSubjects =
    competition.subjects.length;

  const incompleteSubjects =
    competition.subjects.filter(
      (subject) =>
        subject.selectedQuestions <
        subject.questionCount,
    );

  const configuredSubjects =
    competition.subjects.filter(
      (subject) =>
        subject.selectedQuestions ===
        subject.questionCount,
    );

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 py-10">

        {/* ==================================================
           BACK
           ================================================== */}

        <Link
          href="/admin/secondary/solveandwin/competitions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        {/* ==================================================
           HEADER
           ================================================== */}

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">

            {/* Competition Information */}

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-3">

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

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                {competition.title}
              </h1>

              <p className="mt-3 max-w-3xl text-slate-600">
                {competition.description}
              </p>

              {/* Dates */}

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-600">

                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-600" />

                  Competition:
                  <strong className="text-slate-900">
                    {competition.startDate}
                  </strong>

                  →
                  <strong className="text-slate-900">
                    {competition.endDate}
                  </strong>
                </span>

                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />

                  {competition.teams}/
                  {competition.maxTeams} Teams
                </span>

              </div>

            </div>

            {/* Header Actions */}

            <div className="flex flex-wrap gap-3">

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/edit`}
              >
                <Button
                  variant="outline"
                  leftIcon={
                    <Pencil className="h-4 w-4" />
                  }
                >
                  Edit Competition
                </Button>
              </Link>

              <Button
                leftIcon={
                  <Settings2 className="h-4 w-4" />
                }
              >
                Settings
              </Button>

            </div>

          </div>

        </div>

        {/* ==================================================
           OVERVIEW STATS
           ================================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <Card className="p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>

            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {totalSubjects}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Subjects
            </p>

          </Card>

          <Card className="p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <FileQuestion className="h-5 w-5 text-purple-600" />
              </div>

            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {competition.totalQuestions}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Questions
            </p>

          </Card>

          <Card className="p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                <Trophy className="h-5 w-5 text-emerald-600" />
              </div>

            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {competition.totalMarks}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total Marks
            </p>

          </Card>

          <Card className="p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <Users className="h-5 w-5 text-orange-600" />
              </div>

            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {competition.teams}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Registered Teams
            </p>

          </Card>

          <Card className="p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
  {configuredSubjects.length}
</p>

            <p className="mt-1 text-sm text-slate-500">
              Fully Configured
            </p>

          </Card>

        </div>

        {/* ==================================================
           CONFIGURATION WARNING
           ================================================== */}

        {incompleteSubjects.length > 0 && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <div className="flex items-start gap-3">

              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>

                <p className="font-semibold text-amber-900">
                  Competition setup is incomplete
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  {incompleteSubjects.length}{" "}
                  {incompleteSubjects.length === 1
                    ? "subject has"
                    : "subjects have"}{" "}
                  fewer selected questions than required.
                  Complete the question setup before the
                  competition starts.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================
           SUBJECTS
           ================================================== */}

        <section className="mt-8">

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Competition Subjects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add subjects and configure the questions
                students will answer.
              </p>

            </div>

            <Link
              href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/add`}
            >
              <Button
                leftIcon={
                  <Plus className="h-4 w-4" />
                }
              >
                Add Subject
              </Button>
            </Link>

          </div>

          {/* Subject List */}

          {competition.subjects.length === 0 ? (
            <Card className="p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No subjects added
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Add the first subject to this competition,
                then select the questions students will
                answer.
              </p>

              <div className="mt-6">

                <Link
                  href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/add`}
                >
                  <Button
                    leftIcon={
                      <Plus className="h-4 w-4" />
                    }
                  >
                    Add First Subject
                  </Button>
                </Link>

              </div>

            </Card>
          ) : (
            <div className="space-y-5">

              {competition.subjects.map(
                (subject) => {

                  const isComplete =
                    subject.selectedQuestions ===
                    subject.questionCount;

                  const progress =
                    subject.questionCount > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (subject.selectedQuestions /
                              subject.questionCount) *
                              100,
                          ),
                        )
                      : 0;

                  return (
                    <Card
                      key={subject.id}
                      hoverable
                      className="p-6"
                    >

                      <div className="flex flex-col gap-6">

                        {/* Subject Header */}

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                          <div className="flex gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
                              <BookOpen className="h-7 w-7 text-blue-600" />
                            </div>

                            <div>

                              <div className="flex flex-wrap items-center gap-3">

                                <h3 className="text-xl font-bold text-slate-900">
                                  {subject.name}
                                </h3>

                                {isComplete ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Complete
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Needs Questions
                                  </span>
                                )}

                              </div>

                              <p className="mt-1 text-sm text-slate-500">
                                Subject ID:{" "}
                                {subject.subjectId}
                              </p>

                            </div>

                          </div>

                          {/* Subject Actions */}

                          <div className="flex flex-wrap gap-2">

                            <Link
                              href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subject.id}`}
                            >
                              <Button
                                leftIcon={
                                  <Settings2 className="h-4 w-4" />
                                }
                              >
                                Manage
                              </Button>
                            </Link>

                            <Button
                              variant="outline"
                              leftIcon={
                                <Eye className="h-4 w-4" />
                              }
                            >
                              Preview
                            </Button>

                          </div>

                        </div>

                        {/* Question Progress */}

                        <div>

                          <div className="mb-2 flex items-center justify-between gap-3">

                            <div>

                              <p className="text-sm font-semibold text-slate-900">
                                Questions
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {subject.selectedQuestions}{" "}
                                of{" "}
                                {subject.questionCount}{" "}
                                selected
                              </p>

                            </div>

                            <span className="text-sm font-bold text-slate-700">
                              {progress}%
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{
                                width: `${progress}%`,
                              }}
                            />

                          </div>

                        </div>

                        {/* Subject Configuration */}

                        <div className="grid gap-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-5">

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Questions
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {subject.questionCount}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Marks / Question
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {subject.marksPerQuestion}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Easy
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {subject.easy}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Medium
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {subject.medium}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Hard
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {subject.hard}
                            </p>

                          </div>

                        </div>

                        {/* Bottom Actions */}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">

                          <p className="text-xs text-slate-400">
                            {subject.selectedQuestions}{" "}
                            questions currently attached
                            to this subject.
                          </p>

                          <div className="flex flex-wrap gap-2">

                            <Link
                              href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subject.id}/questions`}
                            >
                              <Button
                                variant="outline"
                                leftIcon={
                                  <FileQuestion className="h-4 w-4" />
                                }
                              >
                                Manage Questions
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>

                            <Button
                              variant="outline"
                              leftIcon={
                                <Pencil className="h-4 w-4" />
                              }
                            >
                              Edit Subject
                            </Button>

                            <Button
                              variant="destructive"
                              leftIcon={
                                <Trash2 className="h-4 w-4" />
                              }
                            >
                              Remove
                            </Button>

                          </div>

                        </div>

                      </div>

                    </Card>
                  );
                },
              )}

            </div>
          )}

        </section>

        {/* ==================================================
           COMPETITION MANAGEMENT
           ================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-900">
              Competition Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the other operational parts of this
              competition.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Participants */}

            <Card
              hoverable
              className="p-6"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Participants
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View registered teams and manage
                competition participants.
              </p>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/participants`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                Manage Participants
                <ChevronRight className="h-4 w-4" />
              </Link>

            </Card>

            {/* Schedule */}

            <Card
              hoverable
              className="p-6"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Schedule
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Configure registration periods,
                competition dates and timing.
              </p>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/schedule`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                Manage Schedule
                <ChevronRight className="h-4 w-4" />
              </Link>

            </Card>

            {/* Results */}

            <Card
              hoverable
              className="p-6"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Results & Rankings
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View scores, rankings, winners and
                competition results.
              </p>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/results`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                View Results
                <ChevronRight className="h-4 w-4" />
              </Link>

            </Card>

          </div>

        </section>

        {/* ==================================================
           QUICK ACTIONS
           ================================================== */}

        <section className="mt-10 rounded-3xl border bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Frequently used competition controls.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/add`}
              >
                <Button
                  leftIcon={
                    <Plus className="h-4 w-4" />
                  }
                >
                  Add Subject
                </Button>
              </Link>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/participants`}
              >
                <Button
                  variant="outline"
                  leftIcon={
                    <Users className="h-4 w-4" />
                  }
                >
                  Participants
                </Button>
              </Link>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/results`}
              >
                <Button
                  variant="outline"
                  leftIcon={
                    <Trophy className="h-4 w-4" />
                  }
                >
                  Results
                </Button>
              </Link>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
