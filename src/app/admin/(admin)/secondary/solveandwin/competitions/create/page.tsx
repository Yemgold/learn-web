
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Trophy,
  Users,
  Coins,
  FileText,
  Save,
  Loader2,
  Info,
  BookOpen,
  Plus,
  Check,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getSubjectsByPlan } from "@/lib/api/subjects";
import type { Subject } from "@/lib/api/subjects";

/* ============================================================
   TYPES
============================================================ */

type CompetitionForm = {
  title: string;
  description: string;
  category: string;
  status: "draft" | "upcoming";
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  maxParticipants: string;
  entryPoints: string;
};

/* ============================================================
   INITIAL FORM
============================================================ */

const initialForm: CompetitionForm = {
  title: "",
  description: "",
  category: "National",
  status: "draft",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  maxParticipants: "",
  entryPoints: "0",
};

/* ============================================================
   PAGE
============================================================ */

export default function CreateCompetitionPage() {
  /* ==========================================================
     COMPETITION FORM
  ========================================================== */

  const [form, setForm] =
    useState<CompetitionForm>(initialForm);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /* ==========================================================
     SUBJECT STATE
  ========================================================== */

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedSubjectIds, setSelectedSubjectIds] =
    useState<string[]>([]);

  const [isLoadingSubjects, setIsLoadingSubjects] =
    useState(false);

  const [subjectsLoaded, setSubjectsLoaded] =
    useState(false);

  const [subjectsError, setSubjectsError] =
    useState("");

  /* ==========================================================
     UPDATE FORM FIELD
  ========================================================== */

  const updateField = (
    field: keyof CompetitionForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ==========================================================
     LOAD SECONDARY SUBJECTS
  ========================================================== */

  const handleLoadSubjects = async () => {
    if (isLoadingSubjects) {
      return;
    }

    try {
      setIsLoadingSubjects(true);
      setSubjectsError("");

      const response = await getSubjectsByPlan(
        "SECONDARY",
        1,
        100,
      );

      const loadedSubjects =
        response.data.subjectObj ?? [];

      setSubjects(loadedSubjects);
      setSubjectsLoaded(true);
    } catch (error) {
      console.error(
        "Failed to load secondary subjects:",
        error,
      );

      setSubjectsError(
        error instanceof Error
          ? error.message
          : "Failed to load secondary subjects.",
      );
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  /* ==========================================================
     TOGGLE SUBJECT
  ========================================================== */

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjectIds((current) => {
      if (current.includes(subjectId)) {
        return current.filter(
          (id) => id !== subjectId,
        );
      }

      return [...current, subjectId];
    });
  };

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError(
        "Competition title is required.",
      );
      return;
    }

    if (!form.startDate) {
      setError(
        "Start date is required.",
      );
      return;
    }

    if (!form.startTime) {
      setError(
        "Start time is required.",
      );
      return;
    }

    if (!form.endDate) {
      setError(
        "End date is required.",
      );
      return;
    }

    if (!form.endTime) {
      setError(
        "End time is required.",
      );
      return;
    }

    if (
      form.maxParticipants &&
      Number(form.maxParticipants) < 1
    ) {
      setError(
        "Maximum participants must be greater than 0.",
      );
      return;
    }

    if (Number(form.entryPoints) < 0) {
      setError(
        "Entry points cannot be negative.",
      );
      return;
    }

    /*
     * Require at least one subject.
     */

    if (selectedSubjectIds.length === 0) {
      setError(
        "Please select at least one subject for the competition.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * ========================================================
       * TEMPORARY PAYLOAD
       * ========================================================
       *
       * The real backend integration will be connected next.
       *
       * The important part for now is that the selected
       * subject IDs are available here.
       */

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        startDate: form.startDate,
        startTime: form.startTime,
        endDate: form.endDate,
        endTime: form.endTime,

        maxParticipants:
          form.maxParticipants
            ? Number(form.maxParticipants)
            : undefined,

        entryPoints:
          Number(form.entryPoints),

        subjectIds:
          selectedSubjectIds,
      };

      console.log(
        "CREATE COMPETITION:",
        payload,
      );

      /*
       * Temporary delay.
       *
       * Remove when the real API is connected.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700),
      );

      alert(
        "Competition form is ready. Connect the create competition API to save it.",
      );
    } catch (err) {
      console.error(
        "Failed to create competition:",
        err,
      );

      setError(
        "Something went wrong while creating the competition.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 py-10">

        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          href="/admin/secondary/solveandwin/competitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <Trophy className="h-4 w-4" />
            Solve &amp; Win
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Create Competition
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Create a new competition, select its subjects,
            then configure its questions, participants,
            schedule and results.
          </p>
        </div>

        {/* ======================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">

            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Give your competition a name and describe
                    what it is about.
                  </p>
                </div>
              </div>

              <div className="space-y-6">

                {/* Title */}

                <Input
                  label="Competition Title"
                  placeholder="e.g. JAMB League 2027 Championship"
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value,
                    )
                  }
                  required
                />

                {/* Description */}

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    rows={5}
                    value={form.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value,
                      )
                    }
                    placeholder="Describe the competition, eligibility, rules or objectives..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Category + Status */}

                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      value={form.category}
                      onChange={(event) =>
                        updateField(
                          "category",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="National">
                        National
                      </option>

                      <option value="Regional">
                        Regional
                      </option>

                      <option value="STEM">
                        STEM
                      </option>

                      <option value="Practice">
                        Practice
                      </option>

                      <option value="School">
                        School
                      </option>

                      <option value="Special">
                        Special
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Initial Status
                    </label>

                    <select
                      id="status"
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target.value as
                            | "draft"
                            | "upcoming",
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="draft">
                        Draft
                      </option>

                      <option value="upcoming">
                        Upcoming
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* ==================================================
                SUBJECTS
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-green-100 p-3 text-green-700">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Competition Subjects
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Select the Secondary subjects that will
                      be included in this competition.
                    </p>
                  </div>
                </div>

                {/* Load Subjects Button */}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadSubjects}
                  disabled={isLoadingSubjects}
                  leftIcon={
                    isLoadingSubjects ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : subjectsLoaded ? (
                      <RefreshCw className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )
                  }
                >
                  {isLoadingSubjects
                    ? "Loading..."
                    : subjectsLoaded
                      ? "Refresh Subjects"
                      : "Load Subjects"}
                </Button>
              </div>

              {/* =================================================
                  SUBJECT ERROR
              ================================================= */}

              {subjectsError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {subjectsError}
                </div>
              )}

              {/* =================================================
                  BEFORE SUBJECTS ARE LOADED
              ================================================= */}

              {!subjectsLoaded && !subjectsError && (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-slate-400" />

                  <h3 className="mt-3 font-semibold text-slate-900">
                    No subjects loaded yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Click "Load Subjects" to retrieve all
                    subjects under the Secondary plan.
                  </p>
                </div>
              )}

              {/* =================================================
                  SUBJECT LIST
              ================================================= */}

              {subjectsLoaded && (
                <div className="mt-6">

                  {subjects.length === 0 ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
                      No Secondary subjects were found.
                    </div>
                  ) : (
                    <>
                      {/* Selection Summary */}

                      <div className="mb-5 flex flex-col gap-2 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Available Subjects
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {subjects.length} subject
                            {subjects.length === 1
                              ? ""
                              : "s"} available
                          </p>
                        </div>

                        <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {selectedSubjectIds.length} selected
                        </div>
                      </div>

                      {/* Subject Cards */}

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => {
                          const isSelected =
                            selectedSubjectIds.includes(
                              subject._id,
                            );

                          return (
                            <button
                              key={subject._id}
                              type="button"
                              onClick={() =>
                                toggleSubject(
                                  subject._id,
                                )
                              }
                              className={`group relative rounded-2xl border p-5 text-left transition ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                              }`}
                            >
                              {/* Check */}

                              <div
                                className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border transition ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-slate-300 bg-white text-transparent"
                                }`}
                              >
                                <Check className="h-4 w-4" />
                              </div>

                              {/* Icon */}

                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                  isSelected
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <BookOpen className="h-5 w-5" />
                              </div>

                              {/* Name */}

                              <h3 className="mt-4 pr-8 font-bold text-slate-900">
                                {subject.name}
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                Secondary subject
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* =================================================
                  SELECTED SUBJECTS
              ================================================= */}

              {selectedSubjectIds.length > 0 && (
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-900">
                    Selected Subjects
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {subjects
                      .filter((subject) =>
                        selectedSubjectIds.includes(
                          subject._id,
                        ),
                      )
                      .map((subject) => (
                        <div
                          key={subject._id}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700"
                        >
                          <Check className="h-3.5 w-3.5" />

                          {subject.name}

                          <button
                            type="button"
                            onClick={() =>
                              toggleSubject(
                                subject._id,
                              )
                            }
                            className="ml-1 rounded-full p-0.5 transition hover:bg-blue-200"
                            aria-label={`Remove ${subject.name}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>

            {/* ==================================================
                SCHEDULE
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Competition Schedule
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Define when registration or the competition
                    period begins and ends.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Start */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    Start
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="startDate"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Date
                      </label>

                      <input
                        id="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={(event) =>
                          updateField(
                            "startDate",
                            event.target.value,
                          )
                        }
                        required
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="startTime"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Time
                      </label>

                      <input
                        id="startTime"
                        type="time"
                        value={form.startTime}
                        onChange={(event) =>
                          updateField(
                            "startTime",
                            event.target.value,
                          )
                        }
                        required
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* End */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                    <Clock3 className="h-4 w-4 text-purple-600" />
                    End
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="endDate"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Date
                      </label>

                      <input
                        id="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={(event) =>
                          updateField(
                            "endDate",
                            event.target.value,
                          )
                        }
                        required
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="endTime"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Time
                      </label>

                      <input
                        id="endTime"
                        type="time"
                        value={form.endTime}
                        onChange={(event) =>
                          updateField(
                            "endTime",
                            event.target.value,
                          )
                        }
                        required
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />

                <p>
                  The actual competition schedule can be
                  configured in more detail after the competition
                  has been created.
                </p>
              </div>
            </Card>

            {/* ==================================================
                PARTICIPATION & POINTS
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Participation &amp; Entry
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Set participation limits and the Solve &amp; Win
                    points required to enter.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Max Participants */}

                <div>
                  <label
                    htmlFor="maxParticipants"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Maximum Participants
                  </label>

                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      placeholder="e.g. 1000"
                      value={form.maxParticipants}
                      onChange={(event) =>
                        updateField(
                          "maxParticipants",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Leave empty if there is no participant limit.
                  </p>
                </div>

                {/* Entry Points */}

                <div>
                  <label
                    htmlFor="entryPoints"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Entry Solve &amp; Win Points
                  </label>

                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

                    <input
                      id="entryPoints"
                      type="number"
                      min="0"
                      value={form.entryPoints}
                      onChange={(event) =>
                        updateField(
                          "entryPoints",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Points deducted from the participant's
                    Solve &amp; Win wallet when they enter.
                  </p>
                </div>
              </div>
            </Card>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

              <Link href="/admin/secondary/solveandwin/competitions">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isSubmitting}
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
                className="w-full sm:w-auto"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Competition"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}











// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   CalendarDays,
//   Clock3,
//   Trophy,
//   Users,
//   Coins,
//   FileText,
//   Save,
//   Loader2,
//   Info,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// type CompetitionForm = {
//   title: string;
//   description: string;
//   category: string;
//   status: "draft" | "upcoming";
//   startDate: string;
//   startTime: string;
//   endDate: string;
//   endTime: string;
//   maxParticipants: string;
//   entryPoints: string;
// };

// const initialForm: CompetitionForm = {
//   title: "",
//   description: "",
//   category: "National",
//   status: "draft",
//   startDate: "",
//   startTime: "",
//   endDate: "",
//   endTime: "",
//   maxParticipants: "",
//   entryPoints: "0",
// };

// export default function CreateCompetitionPage() {
//   const [form, setForm] = useState<CompetitionForm>(initialForm);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const updateField = (
//     field: keyof CompetitionForm,
//     value: string
//   ) => {
//     setForm((current) => ({
//       ...current,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (
//     event: React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     setError("");

//     if (!form.title.trim()) {
//       setError("Competition title is required.");
//       return;
//     }

//     if (!form.startDate) {
//       setError("Start date is required.");
//       return;
//     }

//     if (!form.startTime) {
//       setError("Start time is required.");
//       return;
//     }

//     if (!form.endDate) {
//       setError("End date is required.");
//       return;
//     }

//     if (!form.endTime) {
//       setError("End time is required.");
//       return;
//     }

//     if (
//       form.maxParticipants &&
//       Number(form.maxParticipants) < 1
//     ) {
//       setError("Maximum participants must be greater than 0.");
//       return;
//     }

//     if (Number(form.entryPoints) < 0) {
//       setError("Entry points cannot be negative.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       /*
//        * ==========================================================
//        * BACKEND INTEGRATION
//        * ==========================================================
//        *
//        * Replace this section with your create competition API.
//        *
//        * Example payload:
//        *
//        * {
//        *   title: form.title.trim(),
//        *   description: form.description.trim(),
//        *   category: form.category,
//        *   status: form.status,
//        *   startDate: form.startDate,
//        *   startTime: form.startTime,
//        *   endDate: form.endDate,
//        *   endTime: form.endTime,
//        *   maxParticipants:
//        *     form.maxParticipants
//        *       ? Number(form.maxParticipants)
//        *       : undefined,
//        *   entryPoints: Number(form.entryPoints),
//        * }
//        *
//        * ==========================================================
//        */

//       console.log("CREATE COMPETITION:", {
//         title: form.title.trim(),
//         description: form.description.trim(),
//         category: form.category,
//         status: form.status,
//         startDate: form.startDate,
//         startTime: form.startTime,
//         endDate: form.endDate,
//         endTime: form.endTime,
//         maxParticipants: form.maxParticipants
//           ? Number(form.maxParticipants)
//           : undefined,
//         entryPoints: Number(form.entryPoints),
//       });

//       /*
//        * Temporary delay so the loading state can be seen.
//        * Remove this when the real API is connected.
//        */
//       await new Promise((resolve) =>
//         setTimeout(resolve, 700)
//       );

//       /*
//        * After the backend returns the new competition ID,
//        * navigate to:
//        *
//        * /admin/solveandwin/competitions/{competitionId}
//        *
//        * Example:
//        *
//        * router.push(
//        *   `/admin/solveandwin/competitions/${response.data._id}`
//        * );
//        */

//       alert(
//         "Competition form is ready. Connect the create competition API to save it."
//       );
//     } catch (err) {
//       console.error("Failed to create competition:", err);

//       setError(
//         "Something went wrong while creating the competition."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto max-w-5xl px-4 py-10">
//         {/* Back */}
//         <Link
//           href="/admin/secondary/solveandwin/competitions"
//           className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Competitions
//         </Link>

//         {/* Header */}
//         <div className="mb-10">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
//             <Trophy className="h-4 w-4" />
//             Solve & Win
//           </div>

//           <h1 className="text-4xl font-bold tracking-tight text-slate-900">
//             Create Competition
//           </h1>

//           <p className="mt-3 max-w-3xl text-lg text-slate-600">
//             Create a new competition, then configure its
//             subjects, questions, participants, schedule and
//             results from the competition dashboard.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-8">
//             {/* Basic Information */}
//             <Card className="p-6 md:p-8">
//               <div className="mb-7 flex items-start gap-4">
//                 <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
//                   <FileText className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">
//                     Basic Information
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Give your competition a name and describe
//                     what it is about.
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 {/* Title */}
//                 <Input
//                   label="Competition Title"
//                   placeholder="e.g. JAMB League 2027 Championship"
//                   value={form.title}
//                   onChange={(event) =>
//                     updateField(
//                       "title",
//                       event.target.value
//                     )
//                   }
//                   required
//                 />

//                 {/* Description */}
//                 <div>
//                   <label
//                     htmlFor="description"
//                     className="mb-2 block text-sm font-medium text-slate-700"
//                   >
//                     Description
//                   </label>

//                   <textarea
//                     id="description"
//                     rows={5}
//                     value={form.description}
//                     onChange={(event) =>
//                       updateField(
//                         "description",
//                         event.target.value
//                       )
//                     }
//                     placeholder="Describe the competition, eligibility, rules or objectives..."
//                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>

//                 {/* Category + Status */}
//                 <div className="grid gap-6 md:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="category"
//                       className="mb-2 block text-sm font-medium text-slate-700"
//                     >
//                       Category
//                     </label>

//                     <select
//                       id="category"
//                       value={form.category}
//                       onChange={(event) =>
//                         updateField(
//                           "category",
//                           event.target.value
//                         )
//                       }
//                       className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     >
//                       <option value="National">
//                         National
//                       </option>
//                       <option value="Regional">
//                         Regional
//                       </option>
//                       <option value="STEM">STEM</option>
//                       <option value="Practice">
//                         Practice
//                       </option>
//                       <option value="School">
//                         School
//                       </option>
//                       <option value="Special">
//                         Special
//                       </option>
//                     </select>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="status"
//                       className="mb-2 block text-sm font-medium text-slate-700"
//                     >
//                       Initial Status
//                     </label>

//                     <select
//                       id="status"
//                       value={form.status}
//                       onChange={(event) =>
//                         updateField(
//                           "status",
//                           event.target.value
//                         )
//                       }
//                       className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     >
//                       <option value="draft">
//                         Draft
//                       </option>
//                       <option value="upcoming">
//                         Upcoming
//                       </option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* Schedule */}
//             <Card className="p-6 md:p-8">
//               <div className="mb-7 flex items-start gap-4">
//                 <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
//                   <CalendarDays className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">
//                     Competition Schedule
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Define when registration or the competition
//                     period begins and ends.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid gap-6 md:grid-cols-2">
//                 {/* Start */}
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//                   <div className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
//                     <CalendarDays className="h-4 w-4 text-blue-600" />
//                     Start
//                   </div>

//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="startDate"
//                         className="mb-2 block text-sm font-medium text-slate-700"
//                       >
//                         Date
//                       </label>

//                       <input
//                         id="startDate"
//                         type="date"
//                         value={form.startDate}
//                         onChange={(event) =>
//                           updateField(
//                             "startDate",
//                             event.target.value
//                           )
//                         }
//                         required
//                         className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="startTime"
//                         className="mb-2 block text-sm font-medium text-slate-700"
//                       >
//                         Time
//                       </label>

//                       <input
//                         id="startTime"
//                         type="time"
//                         value={form.startTime}
//                         onChange={(event) =>
//                           updateField(
//                             "startTime",
//                             event.target.value
//                           )
//                         }
//                         required
//                         className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* End */}
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//                   <div className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
//                     <Clock3 className="h-4 w-4 text-purple-600" />
//                     End
//                   </div>

//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="endDate"
//                         className="mb-2 block text-sm font-medium text-slate-700"
//                       >
//                         Date
//                       </label>

//                       <input
//                         id="endDate"
//                         type="date"
//                         value={form.endDate}
//                         onChange={(event) =>
//                           updateField(
//                             "endDate",
//                             event.target.value
//                           )
//                         }
//                         required
//                         className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="endTime"
//                         className="mb-2 block text-sm font-medium text-slate-700"
//                       >
//                         Time
//                       </label>

//                       <input
//                         id="endTime"
//                         type="time"
//                         value={form.endTime}
//                         onChange={(event) =>
//                           updateField(
//                             "endTime",
//                             event.target.value
//                           )
//                         }
//                         required
//                         className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
//                 <Info className="mt-0.5 h-4 w-4 shrink-0" />

//                 <p>
//                   The actual competition schedule can be
//                   configured in more detail after the competition
//                   has been created.
//                 </p>
//               </div>
//             </Card>

//             {/* Participation & Points */}
//             <Card className="p-6 md:p-8">
//               <div className="mb-7 flex items-start gap-4">
//                 <div className="rounded-xl bg-green-100 p-3 text-green-700">
//                   <Users className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">
//                     Participation & Entry
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Set participation limits and the Solve & Win
//                     points required to enter.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid gap-6 md:grid-cols-2">
//                 {/* Max Participants */}
//                 <div>
//                   <label
//                     htmlFor="maxParticipants"
//                     className="mb-2 block text-sm font-medium text-slate-700"
//                   >
//                     Maximum Participants
//                   </label>

//                   <div className="relative">
//                     <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                     <input
//                       id="maxParticipants"
//                       type="number"
//                       min="1"
//                       placeholder="e.g. 1000"
//                       value={form.maxParticipants}
//                       onChange={(event) =>
//                         updateField(
//                           "maxParticipants",
//                           event.target.value
//                         )
//                       }
//                       className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <p className="mt-2 text-xs text-slate-500">
//                     Leave empty if there is no participant limit.
//                   </p>
//                 </div>

//                 {/* Entry Points */}
//                 <div>
//                   <label
//                     htmlFor="entryPoints"
//                     className="mb-2 block text-sm font-medium text-slate-700"
//                   >
//                     Entry Solve & Win Points
//                   </label>

//                   <div className="relative">
//                     <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

//                     <input
//                       id="entryPoints"
//                       type="number"
//                       min="0"
//                       value={form.entryPoints}
//                       onChange={(event) =>
//                         updateField(
//                           "entryPoints",
//                           event.target.value
//                         )
//                       }
//                       className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>

//                   <p className="mt-2 text-xs text-slate-500">
//                     Points deducted from the participant's Solve &
//                     Win wallet when they enter.
//                   </p>
//                 </div>
//               </div>
//             </Card>

//             {/* Error */}
//             {error && (
//               <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//                 {error}
//               </div>
//             )}

//             {/* Actions */}
//             <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
//               <Link href="/admin/secondary/solveandwin/competitions">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full sm:w-auto"
//                 >
//                   Cancel
//                 </Button>
//               </Link>

//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 leftIcon={
//                   isSubmitting ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Save className="h-4 w-4" />
//                   )
//                 }
//                 className="w-full sm:w-auto"
//               >
//                 {isSubmitting
//                   ? "Creating..."
//                   : "Create Competition"}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }
