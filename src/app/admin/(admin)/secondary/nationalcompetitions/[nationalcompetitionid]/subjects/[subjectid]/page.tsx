




"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  FileQuestion,
  Loader2,
  Plus,
  Upload,
} from "lucide-react";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

/* ============================================================
   PAGE
   ============================================================ */

export default function CompetitionSubjectDetailsPage() {
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
     STATE
     ========================================================== */

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD SUBJECT
     ========================================================== */

  useEffect(() => {
    if (!subjectId) {
      setError("Subject ID is missing.");
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function loadSubject() {
      try {
        setIsLoading(true);
        setError("");

        /*
         * The existing subject API is paginated.
         *
         * We search through the SECONDARY subjects
         * until we find the requested subject.
         */

        let foundSubject: Subject | null =
          null;

        const firstResponse =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          );

        if (!mounted) return;

        foundSubject =
          firstResponse.data.subjectObj.find(
            (item: Subject) =>
              item._id === subjectId,
          ) ?? null;

        /*
         * If the subject wasn't on the first page,
         * search the remaining pages.
         */

        if (
          !foundSubject &&
          firstResponse.data.totalPages > 1
        ) {
          for (
            let page = 2;
            page <= firstResponse.data.totalPages;
            page++
          ) {
            const response =
              await getSubjectsByPlan(
                "SECONDARY",
                page,
                100,
              );

            if (!mounted) return;

            foundSubject =
              response.data.subjectObj.find(
                (item: Subject) =>
                  item._id === subjectId,
              ) ?? null;

            if (foundSubject) {
              break;
            }
          }
        }

        if (!foundSubject) {
          throw new Error(
            "Subject not found.",
          );
        }

        setSubject(foundSubject);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load subject.",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSubject();

    return () => {
      mounted = false;
    };
  }, [subjectId]);

  /* ==========================================================
     MISSING ROUTE PARAMETERS
     ========================================================== */

  if (!competitionId || !subjectId) {
    return (
      <ErrorState
        error="Competition ID or Subject ID is missing."
      />
    );
  }

  /* ==========================================================
     LOADING
     ========================================================== */

  if (isLoading) {
    return <LoadingState />;
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error || !subject) {
    return (
      <ErrorState
        error={
          error ||
          "Unable to load subject."
        }
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

          <span className="font-medium text-gray-900 dark:text-white">
            {subject.name}
          </span>

        </div>

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </Link>

        {/* ==================================================
            SUBJECT HEADER
        ================================================== */}

        <div className="mb-8">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <BookOpen className="h-7 w-7" />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                National Competition Subject
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {subject.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                Manage questions and question imports for
                this competition subject.
              </p>

            </div>

            <Link
              href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions/add`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>

          </div>

        </div>

        {/* ==================================================
            OVERVIEW CARDS
        ================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* QUESTIONS */}

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <FileQuestion className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />

            </div>

            <h2 className="mt-5 font-semibold text-gray-900 dark:text-white">
              Questions
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              View and manage all questions assigned to
              this competition subject.
            </p>

            <div className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Manage questions
            </div>

          </Link>

          {/* ADD QUESTION */}

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions/add`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <Plus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />

            </div>

            <h2 className="mt-5 font-semibold text-gray-900 dark:text-white">
              Add Question
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Create a new competition question for this
              subject.
            </p>

            <div className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Create question
            </div>

          </Link>

          {/* IMPORT */}

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions/import`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <Upload className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />

            </div>

            <h2 className="mt-5 font-semibold text-gray-900 dark:text-white">
              Import Questions
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Import multiple competition questions at once
              using a supported file format.
            </p>

            <div className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Import questions
            </div>

          </Link>

        </div>

        {/* ==================================================
            SUBJECT INFORMATION
        ================================================== */}

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

            <h2 className="font-semibold text-gray-900 dark:text-white">
              Subject Information
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Basic information about this subject.
            </p>

          </div>

          <div className="grid gap-0 sm:grid-cols-2">

            <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:border-r sm:px-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Subject Name
              </p>

              <p className="mt-2 font-medium text-gray-900 dark:text-white">
                {subject.name}
              </p>
            </div>

            <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Subject ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-gray-600 dark:text-gray-400">
                {subject._id}
              </p>
            </div>

            <div className="px-5 py-5 sm:border-r sm:px-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Category
              </p>

              <p className="mt-2 font-medium text-gray-900 dark:text-white">
                Secondary
              </p>
            </div>

            <div className="px-5 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Competition
              </p>

              <p className="mt-2 font-medium text-gray-900 dark:text-white">
                National Competition
              </p>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

/* ============================================================
   LOADING STATE
   ============================================================ */

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        <div className="flex min-h-[60vh] items-center justify-center">

          <div className="flex flex-col items-center gap-3 text-center">

            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading subject...
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
            Unable to load subject
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
