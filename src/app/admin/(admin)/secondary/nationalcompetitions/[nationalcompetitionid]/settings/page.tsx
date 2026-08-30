




"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Save,
  Settings,
  Trash2,
} from "lucide-react";

/* ============================================================
   PAGE
   ============================================================ */

export default function NationalCompetitionSettingsPage() {
  const params = useParams();

  const rawCompetitionId =
    params.nationalcompetitionid;

  const competitionId = Array.isArray(
    rawCompetitionId,
  )
    ? rawCompetitionId[0]
    : rawCompetitionId;

  /* ==========================================================
     FORM STATE
     ========================================================== */

  const [competitionName, setCompetitionName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<
      "DRAFT" | "PUBLISHED" | "CLOSED"
    >("DRAFT");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [duration, setDuration] =
    useState("60");

  const [questionCount, setQuestionCount] =
    useState("50");

  const [instructions, setInstructions] =
    useState("");

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState(false);

  /* ==========================================================
     VALIDATION
     ========================================================== */

  const validateForm = (): boolean => {
    setError("");
    setSuccessMessage("");

    if (!competitionName.trim()) {
      setError(
        "Please enter the competition name.",
      );
      return false;
    }

    if (
      startDate &&
      endDate &&
      new Date(startDate) >
        new Date(endDate)
    ) {
      setError(
        "The end date cannot be earlier than the start date.",
      );
      return false;
    }

    const numericDuration =
      Number(duration);

    if (
      !duration.trim() ||
      Number.isNaN(numericDuration) ||
      numericDuration <= 0
    ) {
      setError(
        "Duration must be greater than 0 minutes.",
      );
      return false;
    }

    const numericQuestionCount =
      Number(questionCount);

    if (
      !questionCount.trim() ||
      Number.isNaN(
        numericQuestionCount,
      ) ||
      numericQuestionCount <= 0
    ) {
      setError(
        "Question count must be greater than 0.",
      );
      return false;
    }

    return true;
  };

  /* ==========================================================
     SAVE
     ========================================================== */

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    /*
     * No National Competition update API exists yet.
     *
     * This is intentionally UI-only until the backend
     * endpoint is available.
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    setIsSaving(false);

    setSuccessMessage(
      "Settings validated successfully. The update operation will be connected when the National Competition API is available.",
    );
  };

  /* ==========================================================
     DELETE
     ========================================================== */

  const handleDelete = async () => {
    /*
     * No delete API exists yet.
     *
     * Do not perform a fake deletion.
     */

    setShowDeleteConfirmation(false);

    setError(
      "Competition deletion is not connected yet because the National Competition delete API is not available.",
    );
  };

  /* ==========================================================
     ROUTE VALIDATION
     ========================================================== */

  if (!competitionId) {
    return (
      <ErrorState message="National Competition ID is missing." />
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

          <span className="font-medium text-gray-900 dark:text-white">
            Settings
          </span>

        </div>

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href={`/admin/secondary/nationalcompetitions/${competitionId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <Settings className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Competition Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Configure the details, schedule, examination
            settings, and status of this national competition.
          </p>

        </div>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">

            {/* BASIC INFORMATION */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update the competition's basic details.
                </p>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                {/* NAME */}

                <div>

                  <label
                    htmlFor="competitionName"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Competition Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="competitionName"
                    type="text"
                    value={competitionName}
                    onChange={(event) =>
                      setCompetitionName(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. JAMB League National Competition 2026"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    rows={5}
                    placeholder="Describe the competition..."
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

                {/* INSTRUCTIONS */}

                <div>

                  <label
                    htmlFor="instructions"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Competition Instructions
                  </label>

                  <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(event) =>
                      setInstructions(
                        event.target.value,
                      )
                    }
                    rows={6}
                    placeholder="Enter instructions students should see before starting..."
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

              </div>

            </section>

            {/* SCHEDULE */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Competition Schedule
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Set when the competition starts and ends.
                </p>

              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                <div>

                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Start Date & Time
                  </label>

                  <input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

                <div>

                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    End Date & Time
                  </label>

                  <input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(event) =>
                      setEndDate(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

              </div>

            </section>

            {/* EXAM SETTINGS */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Examination Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configure the competition examination.
                </p>

              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                {/* DURATION */}

                <div>

                  <label
                    htmlFor="duration"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Duration
                  </label>

                  <div className="relative">

                    <input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(event) =>
                        setDuration(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 pr-20 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      minutes
                    </span>

                  </div>

                </div>

                {/* QUESTIONS */}

                <div>

                  <label
                    htmlFor="questionCount"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Question Count
                  </label>

                  <div className="relative">

                    <input
                      id="questionCount"
                      type="number"
                      min="1"
                      value={questionCount}
                      onChange={(event) =>
                        setQuestionCount(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 pr-20 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      questions
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* ERROR */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* SUCCESS */}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <span>
                  {successMessage}
                </span>

              </div>
            )}

            {/* SAVE */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >

                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* STATUS */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Competition Status
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Control the visibility of the competition.
              </p>

              <div className="mt-5">

                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as
                        | "DRAFT"
                        | "PUBLISHED"
                        | "CLOSED",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                >
                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>
                </select>

              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">

                <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">

                  <strong className="text-gray-700 dark:text-gray-300">
                    Draft:
                  </strong>{" "}
                  Competition is being prepared.

                  <br />

                  <strong className="text-gray-700 dark:text-gray-300">
                    Published:
                  </strong>{" "}
                  Competition can be made available to
                  students.

                  <br />

                  <strong className="text-gray-700 dark:text-gray-300">
                    Closed:
                  </strong>{" "}
                  Competition is no longer accepting
                  participation.

                </p>

              </div>

            </section>

            {/* ID */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Competition ID
              </h2>

              <p className="mt-3 break-all rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {competitionId}
              </p>

            </section>

            {/* DANGER ZONE */}

            <section className="rounded-xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900/50 dark:bg-gray-900">

              <div className="flex items-center gap-2">

                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />

                <h2 className="font-semibold text-red-700 dark:text-red-400">
                  Danger Zone
                </h2>

              </div>

              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Deleting a competition should only be done
                when you are certain it is no longer needed.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirmation(
                    true,
                  )
                }
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-4 w-4" />
                Delete Competition
              </button>

            </section>

          </aside>

        </div>

        {/* ==================================================
            DELETE CONFIRMATION
        ================================================== */}

        {showDeleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">

                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />

              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Delete Competition?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                This action cannot be completed yet because
                the National Competition delete API is not
                connected.
              </p>

              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteConfirmation(
                      false,
                    )
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Continue
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ============================================================
   ERROR STATE
   ============================================================ */

function ErrorState({
  message,
}: {
  message: string;
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
            {message}
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
