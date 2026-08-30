





"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Loader2,
  Pencil,
  Plus,
  Settings2,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ============================================================
   TYPES
   ============================================================ */

interface Subject {
  _id: string;
  name: string;
  slug?: string;
  code?: string;
  description?: string;
}

interface CompetitionSubject {
  _id: string;
  competitionId: string;
  subjectId: string;
  subject: Subject;

  questionCount: number;
  marksPerQuestion: number;
  durationMinutes: number;

  isActive: boolean;
  questionsConfigured?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   MOCK DATA
   Replace with your backend API.
   ============================================================ */

const mockSubject: CompetitionSubject = {
  _id: "competition-subject-1",
  competitionId: "competition-1",
  subjectId: "mathematics",
  subject: {
    _id: "mathematics",
    name: "Mathematics",
    slug: "mathematics",
    code: "MATH",
    description:
      "Mathematics questions configured for this Solve & Win competition.",
  },
  questionCount: 20,
  marksPerQuestion: 1,
  durationMinutes: 20,
  isActive: true,
  questionsConfigured: 12,
};

/* ============================================================
   PAGE
   ============================================================ */

export default function CompetitionSubjectPage() {
  const router = useRouter();
  const params = useParams();

  const competitionId = params?.competitionId as string;
  const subjectId = params?.subjectId as string;

  const [competitionSubject, setCompetitionSubject] =
    useState<CompetitionSubject | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /* ============================================================
     LOAD SUBJECT
     ============================================================ */

  useEffect(() => {
    if (!competitionId || !subjectId) return;

    const loadSubject = async () => {
      try {
        setIsLoading(true);
        setError("");

        /*
         * Replace this with your actual API call.
         *
         * Example:
         *
         * const response =
         *   await getCompetitionSubject(
         *     competitionId,
         *     subjectId
         *   );
         *
         * setCompetitionSubject(response.data);
         */

        await Promise.resolve();

        setCompetitionSubject({
          ...mockSubject,
          competitionId,
          subjectId,
        });
      } catch (err) {
        console.error(
          "Failed to load competition subject:",
          err,
        );

        setError(
          "Failed to load this competition subject.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSubject();
  }, [competitionId, subjectId]);

  /* ============================================================
     QUESTION STATS
     ============================================================ */

  const configuredQuestions =
    competitionSubject?.questionsConfigured ?? 0;

  const requiredQuestions =
    competitionSubject?.questionCount ?? 0;

  const remainingQuestions = Math.max(
    requiredQuestions - configuredQuestions,
    0,
  );

  const questionProgress = useMemo(() => {
    if (!requiredQuestions) return 0;

    return Math.min(
      Math.round(
        (configuredQuestions / requiredQuestions) *
          100,
      ),
      100,
    );
  }, [configuredQuestions, requiredQuestions]);

  const totalMarks =
    requiredQuestions *
    (competitionSubject?.marksPerQuestion ?? 0);

  /* ============================================================
     REMOVE SUBJECT
     ============================================================ */

  const handleRemoveSubject = async () => {
    if (!competitionSubject) return;

    const confirmed = window.confirm(
      `Remove ${competitionSubject.subject.name} from this competition?`,
    );

    if (!confirmed) return;

    try {
      setIsSaving(true);
      setError("");

      /*
       * Replace with:
       *
       * await removeCompetitionSubject(
       *   competitionId,
       *   subjectId
       * );
       */

      await Promise.resolve();

      router.push(
        `/admin/solveandwin/competitions/${competitionId}`,
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Failed to remove competition subject:",
        err,
      );

      setError(
        "Failed to remove the subject. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ============================================================
     LOADING
     ============================================================ */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading subject...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     NOT FOUND
     ============================================================ */

  if (!competitionSubject) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-10">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/admin/solveandwin/competitions/${competitionId}`,
              )
            }
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </button>

          <Card className="mt-8 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Subject Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              This subject could not be found in the
              selected competition.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     MAIN
     ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* ======================================================
            BACK
        ====================================================== */}

        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/solveandwin/competitions/${competitionId}`,
            )
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </button>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <BookOpen className="h-8 w-8" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Trophy className="h-3.5 w-3.5" />
                  Competition Subject
                </span>

                {competitionSubject.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Inactive
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {competitionSubject.subject.name}
              </h1>

              {competitionSubject.subject.code && (
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-400">
                  {competitionSubject.subject.code}
                </p>
              )}

              {competitionSubject.subject.description && (
                <p className="mt-3 max-w-2xl text-slate-600">
                  {competitionSubject.subject.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/admin/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions`,
                )
              }
              leftIcon={
                <FileQuestion className="h-4 w-4" />
              }
            >
              Manage Questions
            </Button>

            <Button
              onClick={() => {
                /*
                 * Future:
                 * open configuration modal
                 * or navigate to edit page.
                 */
                console.log(
                  "Edit subject configuration",
                );
              }}
              leftIcon={
                <Pencil className="h-4 w-4" />
              }
            >
              Edit Configuration
            </Button>
          </div>
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Required Questions
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {requiredQuestions}
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <FileQuestion className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Questions Added
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {configuredQuestions}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Marks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalMarks}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Duration
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {competitionSubject.durationMinutes}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    min
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                <Clock3 className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* ======================================================
            QUESTION CONFIGURATION
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* ====================================================
              QUESTION PROGRESS
          ==================================================== */}

          <Card className="p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-blue-600" />

                  <h2 className="text-xl font-bold text-slate-900">
                    Question Setup
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Configure and manage the questions
                  participants will answer.
                </p>
              </div>

              <Button
                onClick={() =>
                  router.push(
                    `/admin/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions`,
                  )
                }
                leftIcon={
                  <Settings2 className="h-4 w-4" />
                }
              >
                Configure Questions
              </Button>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Question Progress
                </span>

                <span className="font-bold text-slate-900">
                  {configuredQuestions}/
                  {requiredQuestions}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${questionProgress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {questionProgress}% complete
                </span>

                {remainingQuestions > 0 ? (
                  <span>
                    {remainingQuestions} more question
                    {remainingQuestions === 1
                      ? ""
                      : "s"} needed
                  </span>
                ) : (
                  <span className="font-semibold text-green-600">
                    Question target reached
                  </span>
                )}
              </div>
            </div>

            {/* Question Actions */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions`,
                  )
                }
                className="group rounded-2xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <FileQuestion className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Manage Questions
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add, remove, reorder and review
                  competition questions.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions`,
                  )
                }
                className="group rounded-2xl border border-slate-200 p-5 text-left transition hover:border-green-300 hover:bg-green-50/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                  <Plus className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Add Questions
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select questions from the question
                  bank for this competition.
                </p>
              </button>
            </div>
          </Card>

          {/* ====================================================
              CONFIGURATION
          ==================================================== */}

          <Card className="p-7">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-slate-600" />

              <h2 className="text-xl font-bold text-slate-900">
                Configuration
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Current settings for this competition
              subject.
            </p>

            <div className="mt-6 divide-y divide-slate-100">
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">
                  Subject
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {competitionSubject.subject.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">
                  Questions
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {requiredQuestions}
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">
                  Marks / Question
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {competitionSubject.marksPerQuestion}
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">
                  Total Marks
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {totalMarks}
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">
                  Duration
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {competitionSubject.durationMinutes}{" "}
                  minutes
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">
                  Status
                </span>

                {competitionSubject.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-5 w-full"
              onClick={() => {
                console.log(
                  "Edit configuration",
                  competitionSubject,
                );
              }}
              leftIcon={
                <Pencil className="h-4 w-4" />
              }
            >
              Edit Configuration
            </Button>
          </Card>
        </div>

        {/* ======================================================
            READINESS
        ====================================================== */}

        <Card className="mt-8 overflow-hidden">
          <div className="border-b border-slate-200 px-7 py-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <h2 className="text-xl font-bold text-slate-900">
                Competition Readiness
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Make sure this subject is fully configured
              before the competition starts.
            </p>
          </div>

          <div className="grid gap-4 p-7 md:grid-cols-3">
            {/* Questions */}
            <div
              className={`rounded-2xl border p-5 ${
                configuredQuestions >= requiredQuestions
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {configuredQuestions >=
                requiredQuestions ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock3 className="h-5 w-5 text-yellow-600" />
                )}

                <span className="font-semibold text-slate-900">
                  Questions
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                {configuredQuestions >=
                requiredQuestions
                  ? "Question target is complete."
                  : `${remainingQuestions} more question${
                      remainingQuestions === 1
                        ? ""
                        : "s"
                    } required.`}
              </p>
            </div>

            {/* Marks */}
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <span className="font-semibold text-slate-900">
                  Scoring
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                {totalMarks} total marks configured
                across {requiredQuestions} questions.
              </p>
            </div>

            {/* Duration */}
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <span className="font-semibold text-slate-900">
                  Timing
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                {competitionSubject.durationMinutes}{" "}
                minutes configured for this subject.
              </p>
            </div>
          </div>
        </Card>

        {/* ======================================================
            DANGER ZONE
        ====================================================== */}

        <Card className="mt-8 border-red-200 p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-red-700">
                Remove Subject
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Remove {competitionSubject.subject.name}{" "}
                from this competition. Questions assigned
                to this competition subject may also be
                affected.
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              disabled={isSaving}
              onClick={handleRemoveSubject}
              leftIcon={
                isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )
              }
            >
              {isSaving
                ? "Removing..."
                : "Remove Subject"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
