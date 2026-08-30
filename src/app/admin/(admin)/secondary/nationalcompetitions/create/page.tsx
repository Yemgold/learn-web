





"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Trophy,
  X,
} from "lucide-react";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

import {
  createNationalCompetition,
} from "@/lib/api/nationalCompetitions";

export default function CreateNationalCompetitionPage() {
  /* ==========================================================
     COMPETITION FORM
     ========================================================== */

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ==========================================================
     SUBJECTS
     ========================================================== */

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<
    string[]
  >([]);

  const [selectedSubjectId, setSelectedSubjectId] =
    useState("");

  const [isSubjectsLoading, setIsSubjectsLoading] =
    useState(true);

  const [subjectsError, setSubjectsError] = useState("");

  /* ==========================================================
     SUBMIT STATE
     ========================================================== */

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ==========================================================
     FETCH SUBJECTS
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadSubjects() {
      try {
        setIsSubjectsLoading(true);
        setSubjectsError("");

        const response = await getSubjectsByPlan(
          "SECONDARY",
          1,
          100,
        );

        if (!mounted) return;

        setSubjects(response.data.subjectObj ?? []);
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
     AVAILABLE SUBJECTS
     ========================================================== */

  const availableSubjects = useMemo(() => {
    return subjects.filter(
      (subject) =>
        !selectedSubjectIds.includes(subject._id),
    );
  }, [subjects, selectedSubjectIds]);

  /* ==========================================================
     SELECT SUBJECT
     ========================================================== */

  const addSubject = () => {
    if (!selectedSubjectId) return;

    if (selectedSubjectIds.includes(selectedSubjectId)) {
      return;
    }

    setSelectedSubjectIds((current) => [
      ...current,
      selectedSubjectId,
    ]);

    setSelectedSubjectId("");
    setError("");
  };

  /* ==========================================================
     REMOVE SUBJECT
     ========================================================== */

  const removeSubject = (subjectId: string) => {
    setSelectedSubjectIds((current) =>
      current.filter((id) => id !== subjectId),
    );
  };

  /* ==========================================================
     SELECTED SUBJECT OBJECTS
     ========================================================== */

  const selectedSubjects = selectedSubjectIds
    .map((id) =>
      subjects.find((subject) => subject._id === id),
    )
    .filter(
      (subject): subject is Subject =>
        Boolean(subject),
    );

  /* ==========================================================
     VALIDATION
     ========================================================== */

  const validateForm = () => {
    if (!name.trim()) {
      return "Please enter a competition name.";
    }

    if (!description.trim()) {
      return "Please enter a competition description.";
    }

    if (!startDate) {
      return "Please select a start date.";
    }

    if (!endDate) {
      return "Please select an end date.";
    }

    if (new Date(endDate) < new Date(startDate)) {
      return "End date cannot be before the start date.";
    }

    if (selectedSubjectIds.length === 0) {
      return "Please select at least one subject.";
    }

    return "";
  };

  /* ==========================================================
     CREATE COMPETITION
     ========================================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await createNationalCompetition({
          name: name.trim(),
          description: description.trim(),
          startDate,
          endDate,
          subjectIds: selectedSubjectIds,
        });

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to create competition.",
        );
      }

      const competitionId =
        response.data?._id;

      if (!competitionId) {
        throw new Error(
          "Competition was created, but no competition ID was returned.",
        );
      }

      window.location.href =
        `/admin/secondary/nationalcompetitions/${competitionId}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the competition.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

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

          <span className="text-gray-900 dark:text-white">
            Create
          </span>
        </div>

        {/* ====================================================
            BACK
        ==================================================== */}

        <Link
          href="/admin/secondary/nationalcompetitions"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to competitions
        </Link>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <Trophy className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Create National Competition
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Create the competition and select the subjects
            that will be included.
          </p>
        </div>

        {/* ====================================================
            FORM
        ==================================================== */}

        <form onSubmit={handleSubmit}>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            {/* ==================================================
                STEP 1
            ================================================== */}

            <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white dark:bg-white dark:text-gray-900">
                  1
                </span>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Competition Information
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter the basic competition details.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">

              {/* Competition name */}

              <div>
                <label
                  htmlFor="competition-name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Competition Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="competition-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. 2026 National Academic Championship"
                  maxLength={150}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                />
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="competition-description"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="competition-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the competition..."
                  rows={5}
                  maxLength={1000}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                />

                <div className="mt-2 text-right text-xs text-gray-400">
                  {description.length}/1000
                </div>
              </div>

              {/* Dates */}

              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="start-date"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Start Date
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(event) =>
                        setStartDate(event.target.value)
                      }
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="end-date"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    End Date
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="end-date"
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(event) =>
                        setEndDate(event.target.value)
                      }
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ==================================================
                STEP 2
            ================================================== */}

            <div className="border-t border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white dark:bg-white dark:text-gray-900">
                  2
                </span>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Competition Subjects
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select one or more existing secondary-school subjects.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">

              {/* Subject selector */}

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Add Subject
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="relative flex-1">
                    <select
                      id="subject"
                      value={selectedSubjectId}
                      onChange={(event) =>
                        setSelectedSubjectId(
                          event.target.value,
                        )
                      }
                      disabled={
                        isSubjectsLoading ||
                        isSubmitting ||
                        availableSubjects.length === 0
                      }
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    >
                      <option value="">
                        {isSubjectsLoading
                          ? "Loading subjects..."
                          : availableSubjects.length === 0
                            ? "No more subjects available"
                            : "Select a subject"}
                      </option>

                      {availableSubjects.map(
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

                  <button
                    type="button"
                    onClick={addSubject}
                    disabled={
                      !selectedSubjectId ||
                      isSubmitting
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subject
                  </button>

                </div>

                {subjectsError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {subjectsError}
                  </p>
                )}
              </div>

              {/* Selected subjects */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Selected Subjects
                  </h3>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedSubjects.length} selected
                  </span>
                </div>

                {selectedSubjects.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 px-5 py-8 text-center dark:border-gray-700">
                    <Trophy className="mx-auto mb-2 h-6 w-6 text-gray-400" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No subjects selected yet.
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Select at least one subject above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSubjects.map(
                      (subject, index) => (
                        <div
                          key={subject._id}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-950"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white dark:bg-white dark:text-gray-900">
                              {index + 1}
                            </span>

                            <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {subject.name}
                            </span>

                            <Check className="h-4 w-4 shrink-0 text-green-600" />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeSubject(
                                subject._id,
                              )
                            }
                            disabled={isSubmitting}
                            className="ml-3 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-red-600 disabled:opacity-50 dark:hover:bg-gray-800"
                            aria-label={`Remove ${subject.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Subject loading */}

              {isSubjectsLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading available subjects...
                </div>
              )}

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 sm:mx-6">
                {error}
              </div>
            )}

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/50 sm:flex-row sm:items-center sm:justify-end sm:px-6">

              <Link
                href="/admin/secondary/nationalcompetitions"
                className={`inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900 ${
                  isSubmitting
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isSubjectsLoading ||
                  selectedSubjectIds.length === 0
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Competition...
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    Create Competition
                  </>
                )}
              </button>

            </div>
          </div>

          {/* ====================================================
              FLOW
          ==================================================== */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              After creation
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                1. Competition
              </span>

              <ChevronRight className="h-4 w-4" />

              <span className="font-medium text-gray-900 dark:text-white">
                2. Subjects
              </span>

              <ChevronRight className="h-4 w-4" />

              <span>3. Questions</span>

              <ChevronRight className="h-4 w-4" />

              <span>4. Configure</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
