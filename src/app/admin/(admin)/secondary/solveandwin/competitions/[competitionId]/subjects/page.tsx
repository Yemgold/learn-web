





"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  FileQuestion,
  Pencil,
  Plus,
  Search,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ============================================================
   TYPES
============================================================ */

interface CompetitionSubject {
  id: string;
  name: string;
  code: string;
  questions: number;
  targetQuestions: number;
  marksPerQuestion: number;
  duration: number;
  status: "Configured" | "Incomplete";
  color: string;
}

/* ============================================================
   DEMO DATA
   Replace with backend data later.
============================================================ */

const competition = {
  id: "1",
  title: "JAMB League 2027 Championship",
  category: "National",
  status: "Upcoming",
  startDate: "15 Jan 2027",
  teams: 425,
  maxTeams: 1000,
};

const initialSubjects: CompetitionSubject[] = [
  {
    id: "english",
    name: "Use of English",
    code: "ENG",
    questions: 60,
    targetQuestions: 60,
    marksPerQuestion: 1,
    duration: 60,
    status: "Configured",
    color: "blue",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    code: "MTH",
    questions: 40,
    targetQuestions: 40,
    marksPerQuestion: 1,
    duration: 40,
    status: "Configured",
    color: "violet",
  },
  {
    id: "physics",
    name: "Physics",
    code: "PHY",
    questions: 32,
    targetQuestions: 40,
    marksPerQuestion: 1,
    duration: 40,
    status: "Incomplete",
    color: "orange",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    code: "CHE",
    questions: 40,
    targetQuestions: 40,
    marksPerQuestion: 1,
    duration: 40,
    status: "Configured",
    color: "emerald",
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function CompetitionSubjectsPage() {
  const competitionId = "1";

  const [subjects, setSubjects] =
    useState<CompetitionSubject[]>(initialSubjects);

  const [search, setSearch] = useState("");

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredSubjects = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return subjects;
    }

    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(value) ||
        subject.code.toLowerCase().includes(value),
    );
  }, [subjects, search]);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const totalQuestions = subjects.reduce(
    (total, subject) => total + subject.questions,
    0,
  );

  const targetQuestions = subjects.reduce(
    (total, subject) => total + subject.targetQuestions,
    0,
  );

  const configuredSubjects = subjects.filter(
    (subject) => subject.status === "Configured",
  ).length;

  /* ==========================================================
     DELETE SUBJECT
  ========================================================== */

  const handleDelete = (subjectId: string) => {
    const subject = subjects.find(
      (item) => item.id === subjectId,
    );

    if (!subject) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${subject.name} from this competition?`,
    );

    if (!confirmed) {
      return;
    }

    setSubjects((current) =>
      current.filter((item) => item.id !== subjectId),
    );

    /*
     * Later:
     *
     * DELETE
     * /api/v1/competitions/{competitionId}/subjects/{subjectId}
     */
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Solve &amp; Win
            </span>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Competition Subjects
            </h1>

            <p className="mt-3 max-w-3xl text-slate-600">
              Manage the subjects, question counts and scoring
              configuration for this competition.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-900">
                {competition.title}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {competition.category}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {competition.status}
              </span>
            </div>
          </div>

          <Link
            href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/add`}
          >
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Subject
            </Button>
          </Link>
        </div>

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Subjects
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {subjects.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Questions
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalQuestions}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Target: {targetQuestions}
                </p>
              </div>

              <div className="rounded-xl bg-purple-100 p-3">
                <FileQuestion className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Configured
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {configuredSubjects}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  of {subjects.length} subjects
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Registered Teams
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {competition.teams.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Maximum:{" "}
                  {competition.maxTeams.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-orange-100 p-3">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* ======================================================
            SEARCH
        ====================================================== */}

        <Card className="mb-8 p-4">
          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search subjects..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* ======================================================
            SUBJECT LIST
        ====================================================== */}

        {filteredSubjects.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No subjects found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "No subjects match your search."
                : "This competition does not have any subjects yet."}
            </p>

            {!search && (
              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/add`}
                className="mt-6 inline-block"
              >
                <Button
                  leftIcon={
                    <Plus className="h-4 w-4" />
                  }
                >
                  Add First Subject
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-5">
            {filteredSubjects.map((subject) => {
              const progress =
                subject.targetQuestions > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (subject.questions /
                          subject.targetQuestions) *
                          100,
                      ),
                    )
                  : 0;

              const isComplete =
                subject.questions >=
                subject.targetQuestions;

              return (
                <Card
                  key={subject.id}
                  hoverable
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    {/* Subject information */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                          {subject.code}
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                            {subject.name}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {subject.marksPerQuestion}{" "}
                            mark per question
                          </p>
                        </div>

                        {subject.status ===
                          "Configured" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Configured
                          </span>
                        )}

                        {subject.status ===
                          "Incomplete" && (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            Needs Questions
                          </span>
                        )}
                      </div>

                      {/* Metrics */}

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <FileQuestion className="h-4 w-4" />
                            Questions
                          </div>

                          <p className="mt-2 text-lg font-bold text-slate-900">
                            {subject.questions}{" "}
                            <span className="text-sm font-medium text-slate-400">
                              / {subject.targetQuestions}
                            </span>
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Trophy className="h-4 w-4" />
                            Marks
                          </div>

                          <p className="mt-2 text-lg font-bold text-slate-900">
                            {subject.questions *
                              subject.marksPerQuestion}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock3 className="h-4 w-4" />
                            Duration
                          </div>

                          <p className="mt-2 text-lg font-bold text-slate-900">
                            {subject.duration} min
                          </p>
                        </div>
                      </div>

                      {/* Question progress */}

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-500">
                            Question bank progress
                          </span>

                          <span
                            className={
                              isComplete
                                ? "text-green-600"
                                : "text-orange-600"
                            }
                          >
                            {progress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isComplete
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="flex flex-wrap gap-3 xl:w-auto xl:justify-end">
                      <Link
                        href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subject.id}`}
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

                      <Link
                        href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subject.id}`}
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

                      <Link
                        href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subject.id}/questions`}
                      >
                        <Button
                          leftIcon={
                            <FileQuestion className="h-4 w-4" />
                          }
                        >
                          Questions
                        </Button>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(subject.id)
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ======================================================
            FOOTER INFORMATION
        ====================================================== */}

        <Card className="mt-8 border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="rounded-xl bg-blue-100 p-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h3 className="font-bold text-blue-900">
                How subject management works
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                Add the subjects that will appear in this
                competition. Open a subject to configure its
                settings, then use the Questions page to add
                and manage the questions that participants
                will answer.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
