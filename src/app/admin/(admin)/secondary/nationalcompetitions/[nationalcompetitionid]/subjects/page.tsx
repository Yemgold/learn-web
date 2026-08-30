




"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

import {
  getNationalCompetitionById,
  updateNationalCompetitionSubjects,
  type NationalCompetition,
  type CompetitionSubject,
} from "@/lib/api/nationalCompetitions";

/* ============================================================
   PAGE
   ============================================================ */

export default function CompetitionSubjectsPage() {
  const params = useParams();

 const rawCompetitionId =
  params.nationalcompetitionid;

const competitionId = Array.isArray(
  rawCompetitionId,
)
  ? rawCompetitionId[0]
  : rawCompetitionId;

  /* ==========================================================
     COMPETITION
     ========================================================== */

  const [competition, setCompetition] =
    useState<NationalCompetition | null>(null);

  const [isCompetitionLoading, setIsCompetitionLoading] =
    useState(true);

  /* ==========================================================
     AVAILABLE SUBJECTS
     ========================================================== */

  const [availableSubjects, setAvailableSubjects] =
    useState<Subject[]>([]);

  const [isSubjectsLoading, setIsSubjectsLoading] =
    useState(true);

  const [subjectsError, setSubjectsError] =
    useState("");

  /* ==========================================================
     SELECTED SUBJECTS
     ========================================================== */

  const [selectedSubjectIds, setSelectedSubjectIds] =
    useState<string[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] =
    useState("");

  /* ==========================================================
     UI STATE
     ========================================================== */

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  /* ==========================================================
     FETCH COMPETITION
     ========================================================== */

  useEffect(() => {
    if (!competitionId) {
      setError("Competition ID is missing.");
      setIsCompetitionLoading(false);
      return;
    }

    let mounted = true;

    async function loadCompetition() {
      try {
        setIsCompetitionLoading(true);
        setError("");

        if (!competitionId) {
  throw new Error(
    "Competition ID is missing.",
  );
}

const response =
  await getNationalCompetitionById(
    competitionId,
  );

        if (!mounted) return;

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to load competition.",
          );
        }

        setCompetition(response.data);

        /*
         * Convert the competition subjects into IDs.
         *
         * The API may return populated subjects:
         *
         * subjects: [
         *   { _id: "...", name: "Mathematics" }
         * ]
         *
         * or, depending on backend implementation,
         * subjectIds:
         *
         * subjectIds: ["...", "..."]
         */

        if (
          response.data.subjects &&
          response.data.subjects.length > 0
        ) {
          setSelectedSubjectIds(
            response.data.subjects.map(
              (subject) => subject._id,
            ),
          );
        } else if (
          response.data.subjectIds
        ) {
          setSelectedSubjectIds(
            response.data.subjectIds,
          );
        } else {
          setSelectedSubjectIds([]);
        }
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load competition.",
        );
      } finally {
        if (mounted) {
          setIsCompetitionLoading(false);
        }
      }
    }

    loadCompetition();

    return () => {
      mounted = false;
    };
  }, [competitionId]);

  /* ==========================================================
     FETCH SECONDARY SUBJECTS
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadSubjects() {
      try {
        setIsSubjectsLoading(true);
        setSubjectsError("");

        const response =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          );

        if (!mounted) return;

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to load subjects.",
          );
        }

        setAvailableSubjects(
          response.data.subjectObj ?? [],
        );
      } catch (err) {
        if (!mounted) return;

        setSubjectsError(
          err instanceof Error
            ? err.message
            : "Failed to load subjects.",
        );
      } finally {
        if (mounted) {
          setIsSubjectsLoading(false);
        }
      }
    }

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     SELECTED SUBJECT OBJECTS
     ========================================================== */

  const selectedSubjects = useMemo(() => {
    return selectedSubjectIds
      .map((id) => {
        /*
         * First try the available subjects endpoint.
         */

        const subject =
          availableSubjects.find(
            (item) => item._id === id,
          );

        if (subject) {
          return subject;
        }

        /*
         * Then try the populated competition subject.
         */

        const competitionSubject =
          competition?.subjects?.find(
            (item) => item._id === id,
          );

        if (competitionSubject) {
          return competitionSubject;
        }

        return null;
      })
      .filter(
        (
          subject,
        ): subject is Subject | CompetitionSubject =>
          Boolean(subject),
      );
  }, [
    selectedSubjectIds,
    availableSubjects,
    competition,
  ]);

  /* ==========================================================
     SUBJECTS AVAILABLE TO ADD
     ========================================================== */

  const subjectsToAdd = useMemo(() => {
    return availableSubjects.filter(
      (subject) =>
        !selectedSubjectIds.includes(
          subject._id,
        ),
    );
  }, [
    availableSubjects,
    selectedSubjectIds,
  ]);

  /* ==========================================================
     ADD SUBJECT
     ========================================================== */

  const handleAddSubject = () => {
    if (!selectedSubjectId) return;

    if (
      selectedSubjectIds.includes(
        selectedSubjectId,
      )
    ) {
      return;
    }

    setSelectedSubjectIds((current) => [
      ...current,
      selectedSubjectId,
    ]);

    setSelectedSubjectId("");
    setSuccessMessage("");
    setError("");
  };

  /* ==========================================================
     REMOVE SUBJECT
     ========================================================== */

  const handleRemoveSubject = (
    subjectId: string,
  ) => {
    setSelectedSubjectIds((current) =>
      current.filter(
        (id) => id !== subjectId,
      ),
    );

    setSuccessMessage("");
    setError("");
  };

  /* ==========================================================
     SAVE SUBJECTS
     ========================================================== */

  const handleSaveSubjects = async () => {
    if (!competitionId) {
      setError("Competition ID is missing.");
      return;
    }

    if (selectedSubjectIds.length === 0) {
      setError(
        "A competition must have at least one subject.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      const response =
        await updateNationalCompetitionSubjects(
          competitionId,
          {
            subjectIds:
              selectedSubjectIds,
          },
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to update subjects.",
        );
      }

      setCompetition(response.data);

      setSuccessMessage(
        "Competition subjects updated successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update subjects.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ==========================================================
     LOADING
     ========================================================== */

  if (isCompetitionLoading) {
    return (
      <LoadingState />
    );
  }

  /* ==========================================================
     ERROR / NOT FOUND
     ========================================================== */

  if (error && !competition) {
    return (
      <ErrorState
        error={error}
      />
    );
  }

  if (!competition) {
    return (
      <ErrorState
        error="Competition not found."
      />
    );
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ====================================================
            BREADCRUMB
        ==================================================== */}

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
            className="max-w-[200px] truncate hover:text-gray-900 dark:hover:text-white"
          >
            {competition.name}
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-gray-900 dark:text-white">
            Subjects
          </span>
        </div>

        {/* ====================================================
            BACK
        ==================================================== */}

        <Link
          href={`/admin/secondary/nationalcompetitions/${competitionId}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <Trophy className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Competition Subjects
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Manage the subjects included in{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {competition.name}
            </span>
            .
          </p>
        </div>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="space-y-6">

          {/* ==================================================
              ADD SUBJECT
          ================================================== */}

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Add Subject
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select from the existing secondary-school
                subjects.
              </p>
            </div>

            <div className="p-5 sm:p-6">

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Select */}

                <div className="relative flex-1">
                  <select
                    value={selectedSubjectId}
                    onChange={(event) =>
                      setSelectedSubjectId(
                        event.target.value,
                      )
                    }
                    disabled={
                      isSubjectsLoading ||
                      isSaving ||
                      subjectsToAdd.length === 0
                    }
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  >
                    <option value="">
                      {isSubjectsLoading
                        ? "Loading subjects..."
                        : subjectsToAdd.length === 0
                          ? "All available subjects are selected"
                          : "Select a subject"}
                    </option>

                    {subjectsToAdd.map(
                      (subject) => (
                        <option
                          key={subject._id}
                          value={subject._id}
                        >
                          {subject.name}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Add */}

                <button
                  type="button"
                  onClick={handleAddSubject}
                  disabled={
                    !selectedSubjectId ||
                    isSaving
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </button>

              </div>

              {subjectsError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                  {subjectsError}
                </div>
              )}

            </div>
          </section>

          {/* ==================================================
              SELECTED SUBJECTS
          ================================================== */}

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 sm:px-6">

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Selected Subjects
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedSubjectIds.length}{" "}
                  {selectedSubjectIds.length === 1
                    ? "subject"
                    : "subjects"}{" "}
                  currently selected.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {selectedSubjectIds.length}
              </div>

            </div>

            {selectedSubjects.length === 0 ? (
              <div className="px-6 py-14 text-center">

                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Trophy className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  No subjects selected
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  Select at least one existing subject above
                  before continuing.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">

                {selectedSubjects.map(
                  (subject, index) => (
                    <div
                      key={subject._id}
                      className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                    >

                      <div className="flex min-w-0 items-center gap-4">

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900 dark:text-white">
                            {subject.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Subject
                          </p>
                        </div>

                        <Check className="hidden h-4 w-4 shrink-0 text-green-600 sm:block" />

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveSubject(
                            subject._id,
                          )
                        }
                        disabled={
                          isSaving ||
                          selectedSubjectIds.length <= 1
                        }
                        title={
                          selectedSubjectIds.length <=
                          1
                            ? "At least one subject is required"
                            : `Remove ${subject.name}`
                        }
                        className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  ),
                )}

              </div>
            )}

            {/* ==================================================
                SAVE
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Changes are not saved until you click Save
                Subjects.
              </p>

              <button
                type="button"
                onClick={handleSaveSubjects}
                disabled={
                  isSaving ||
                  selectedSubjectIds.length === 0
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Subjects
                  </>
                )}
              </button>

            </div>
          </section>

          {/* ==================================================
              MESSAGES
          ================================================== */}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ==================================================
              NEXT STEP
          ================================================== */}

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Trophy className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Next Step
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  After selecting your subjects, open a subject
                  to manage its competition questions.
                </p>

                {selectedSubjects.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedSubjects.map(
                      (subject) => (
                        <Link
                          key={subject._id}
                          href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subject._id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          {subject.name}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ),
                    )}
                  </div>
                )}

              </div>

            </div>

          </section>

        </div>
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
      <div className="mx-auto max-w-5xl">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading competition subjects...
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
          Back to competitions
        </Link>

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unable to load competition
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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

