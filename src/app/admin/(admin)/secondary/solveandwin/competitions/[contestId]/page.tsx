






"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileQuestion,
  Loader2,
  Pencil,
  Plus,
  Settings2,
  Trophy,
  Users,
  Trash2,
  ChevronRight,
  AlertCircle,
  Coins,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getContestWithSubjectsById } from "@/lib/api/solveAndWin";

/* ============================================================
   API TYPES
   ============================================================ */

interface ContestSubject {
  subjectId:
    | string
    | {
        _id: string;
        name: string;
      };

  questions: unknown[];
}

interface ContestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  amountToBeWonInKobo: number;
  entryPoints: number;
  subjects: ContestSubject[];
  status: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/* ============================================================
   HELPERS
   ============================================================ */

function getStatusClass(
  status: string,
  isActive: boolean,
) {
  if (!isActive) {
    return "bg-slate-100 text-slate-600";
  }

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

    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatStatus(
  status: string,
  isActive: boolean,
) {
  if (!isActive) {
    return "Inactive";
  }

  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .split(/[\s_-]+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(date: string) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrencyFromKobo(
  amountInKobo: number,
) {
  const amount =
    Number(amountInKobo || 0) / 100;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getSubjectName(name: string) {
  if (!name) {
    return "Unknown Subject";
  }

  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

/* ============================================================
   NORMALIZE SUBJECT
   ============================================================ */

function getSubjectId(
  subject: ContestSubject,
): string {
  if (
    typeof subject.subjectId === "object" &&
    subject.subjectId !== null
  ) {
    return subject.subjectId._id;
  }

  return String(subject.subjectId);
}

function getSubjectDisplayName(
  subject: ContestSubject,
): string {
  if (
    typeof subject.subjectId === "object" &&
    subject.subjectId !== null
  ) {
    return getSubjectName(
      subject.subjectId.name,
    );
  }

  return getSubjectName(
    String(subject.subjectId),
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function CompetitionManagementPage() {
  const params = useParams();

  const competitionId = String(
    params?.competitionId ?? "",
  );

  const [competition, setCompetition] =
    useState<ContestData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     FETCH COMPETITION
     ========================================================== */

  const fetchCompetition = async () => {
    if (!competitionId) {
      setError("Competition ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await getContestWithSubjectsById(
          competitionId,
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to load competition.",
        );
      }

      setCompetition(
        response.data as ContestData,
      );
    } catch (err) {
      console.error(
        "Failed to load Solve and Win competition:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load competition. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     LOAD ON MOUNT
     ========================================================== */

  useEffect(() => {
    fetchCompetition();
  }, [competitionId]);

  /* ==========================================================
     DERIVED DATA
     ========================================================== */

  const subjects =
    competition?.subjects ?? [];

  const totalSubjects =
    subjects.length;

  const totalQuestions = useMemo(() => {
    return subjects.reduce(
      (total, subject) =>
        total +
        (Array.isArray(subject.questions)
          ? subject.questions.length
          : 0),
      0,
    );
  }, [subjects]);

  const subjectsWithQuestions =
    useMemo(() => {
      return subjects.filter(
        (subject) =>
          Array.isArray(subject.questions) &&
          subject.questions.length > 0,
      ).length;
    }, [subjects]);

  const subjectsWithoutQuestions =
    useMemo(() => {
      return subjects.filter(
        (subject) =>
          !Array.isArray(subject.questions) ||
          subject.questions.length === 0,
      ).length;
    }, [subjects]);

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Link>

          <div className="mt-8 flex min-h-[400px] items-center justify-center rounded-3xl border bg-white shadow-sm">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Loading competition...
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Fetching competition details and
                subjects.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error || !competition) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Link>

          <Card className="mt-8 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Unable to load competition
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              {error ||
                "The competition could not be found."}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                onClick={fetchCompetition}
                leftIcon={
                  <RefreshCw className="h-4 w-4" />
                }
              >
                Try Again
              </Button>

              <Link href="/admin/secondary/solveandwin/competitions">
                <Button variant="outline">
                  Back to Competitions
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

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
                    competition.isActive,
                  )}`}
                >
                  {formatStatus(
                    competition.status,
                    competition.isActive,
                  )}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                {competition.title}
              </h1>

              <p className="mt-3 max-w-3xl text-slate-600">
                {competition.description}
              </p>

              {/* Competition Metadata */}

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-600" />

                  Competition:

                  <strong className="text-slate-900">
                    {formatDate(
                      competition.startDate,
                    )}
                  </strong>

                  →

                  <strong className="text-slate-900">
                    {formatDate(
                      competition.endDate,
                    )}
                  </strong>
                </span>

                <span className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-emerald-600" />

                  Prize:

                  <strong className="text-slate-900">
                    {formatCurrencyFromKobo(
                      competition.amountToBeWonInKobo,
                    )}
                  </strong>
                </span>

                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />

                  Entry:

                  <strong className="text-slate-900">
                    {competition.entryPoints}{" "}
                    points
                  </strong>
                </span>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Competition ID:{" "}
                {competition._id}
              </p>
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
          {/* Subjects */}

          <Card className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {totalSubjects}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Subjects
            </p>
          </Card>

          {/* Questions */}

          <Card className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
              <FileQuestion className="h-5 w-5 text-purple-600" />
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {totalQuestions}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Attached Questions
            </p>
          </Card>

          {/* Prize */}

          <Card className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <Trophy className="h-5 w-5 text-emerald-600" />
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {formatCurrencyFromKobo(
                competition.amountToBeWonInKobo,
              )}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Prize
            </p>
          </Card>

          {/* Entry Points */}

          <Card className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <Coins className="h-5 w-5 text-orange-600" />
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {competition.entryPoints}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Entry Points
            </p>
          </Card>

          {/* Configured Subjects */}

          <Card className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {subjectsWithQuestions}/
              {totalSubjects}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Subjects With Questions
            </p>
          </Card>
        </div>

        {/* ==================================================
           CONFIGURATION WARNING
           ================================================== */}

        {subjectsWithoutQuestions > 0 && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="font-semibold text-amber-900">
                  Competition setup is incomplete
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  {subjectsWithoutQuestions}{" "}
                  {subjectsWithoutQuestions ===
                  1
                    ? "subject has"
                    : "subjects have"}{" "}
                  no questions attached yet. Add
                  questions before students
                  participate in the competition.
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
                Manage the subjects and questions
                attached to this competition.
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

          {subjects.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No subjects added
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Add the first subject to this
                competition, then attach the
                questions students will answer.
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
              {subjects.map(
                (subject) => {
                  const subjectId =
                    getSubjectId(subject);

                  const subjectName =
                    getSubjectDisplayName(
                      subject,
                    );

                  const questionCount =
                    Array.isArray(
                      subject.questions,
                    )
                      ? subject.questions.length
                      : 0;

                  const hasQuestions =
                    questionCount > 0;

                  return (
                    <Card
                      key={subjectId}
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
                                  {subjectName}
                                </h3>

                                {hasQuestions ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Questions Added
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
                                {subjectId}
                              </p>
                            </div>
                          </div>

                          {/* Subject Actions */}

                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}`}
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
                                {questionCount}{" "}
                                question
                                {questionCount ===
                                1
                                  ? ""
                                  : "s"}{" "}
                                attached to this
                                subject
                              </p>
                            </div>

                            <span className="text-sm font-bold text-slate-700">
                              {questionCount}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all ${
                                hasQuestions
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                              }`}
                              style={{
                                width: hasQuestions
                                  ? "100%"
                                  : "0%",
                              }}
                            />
                          </div>
                        </div>

                        {/* Subject Configuration */}

                        <div className="grid gap-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Subject
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {subjectName}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Attached Questions
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {questionCount}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Subject ID
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-slate-900">
                              {subjectId}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Actions */}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                          <p className="text-xs text-slate-400">
                            {questionCount}{" "}
                            question
                            {questionCount === 1
                              ? ""
                              : "s"}{" "}
                            currently attached to
                            this subject.
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions`}
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
           COMPETITION INFORMATION
           ================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Competition Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Important details configured for this
              competition.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Prize
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900">
                {formatCurrencyFromKobo(
                  competition.amountToBeWonInKobo,
                )}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Entry Cost
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900">
                {competition.entryPoints}{" "}
                points
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Start Date
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {formatDateTime(
                  competition.startDate,
                )}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                End Date
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {formatDateTime(
                  competition.endDate,
                )}
              </p>
            </Card>
          </div>
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
              Manage the other operational parts of
              this competition.
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
                Configure competition dates and
                review the current competition
                window.
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