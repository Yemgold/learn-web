





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  FileQuestion,
  Plus,
  Upload,
} from "lucide-react";

/* ============================================================
   PAGE
   ============================================================ */

export default function CompetitionQuestionsPage() {
  const params = useParams();

  const rawCompetitionId =
    params.nationalcompetitionid;

  const rawSubjectId =
    params.subjectid;

  const competitionId = Array.isArray(
    rawCompetitionId,
  )
    ? rawCompetitionId[0]
    : rawCompetitionId;

  const subjectId = Array.isArray(
    rawSubjectId,
  )
    ? rawSubjectId[0]
    : rawSubjectId;

  /* ==========================================================
     ROUTE VALIDATION
     ========================================================== */

  if (!competitionId || !subjectId) {
    return (
      <ErrorState
        error="Competition ID or Subject ID is missing."
      />
    );
  }

  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

          <Link
            href="/admin"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Admin
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span>Secondary</span>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            National Competitions
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Competition
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Subjects
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Subject
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-900 dark:text-white">
            Questions
          </span>

        </div>

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subject
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              <FileQuestion className="h-6 w-6" />
            </div>

            <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              National Competition
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Questions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Manage the questions assigned to this
              competition subject.
            </p>

          </div>

          {/* ACTIONS */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions/import`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Upload className="h-4 w-4" />
              Import Questions
            </Link>

            <Link
              href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions/add`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>

          </div>

        </div>

        {/* ==================================================
            SUMMARY
        ================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <FileQuestion className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Questions
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  0
                </p>

              </div>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Active
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  0
                </p>

              </div>

            </div>

          </div>

          {/* DRAFT */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Draft
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  0
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            QUESTIONS TABLE
        ================================================== */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Competition Questions
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Questions for this subject will appear here.
                </p>

              </div>

            </div>

          </div>

          {/* EMPTY STATE */}

          <div className="px-5 py-16 text-center sm:px-6">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">

              <FileQuestion className="h-7 w-7 text-gray-500 dark:text-gray-400" />

            </div>

            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              No questions yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              This competition subject does not have any
              questions yet. Add questions individually or
              import multiple questions at once.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions/add`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Link>

              <Link
                href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions/import`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Upload className="h-4 w-4" />
                Import Questions
              </Link>

            </div>

          </div>

        </section>

        {/* ==================================================
            BACKEND NOTICE
        ================================================== */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-900">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />

          <div>

            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Question API not connected yet
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              The question list is currently an empty state.
              Once the National Competition question API is
              available, this page can load, filter, edit,
              delete, and manage questions from the backend.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   ERROR STATE
   ============================================================ */

function ErrorState({
  error,
}: {
  error: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-3xl">

        <Link
          href="/admin/secondary/nationalcompetitions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">

            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />

          </div>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invalid route
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error}
          </p>

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
          >
            Back to Competitions
          </Link>

        </div>

      </div>

    </div>
  );
}
