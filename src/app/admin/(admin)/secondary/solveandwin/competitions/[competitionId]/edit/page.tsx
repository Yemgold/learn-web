


"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  Loader2,
  Save,
  Trophy,
  Users,
  Coins,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { cancelContestById } from "@/lib/api/solveAndWin";

/* ============================================================
   TYPES
   ============================================================ */

type WindowPeriod = "1" | "2" | "3" | "7" | "14" | "30";

type CompetitionForm = {
  title: string;
  category: string;
  status: string;
  description: string;
  startDate: string;
  windowPeriod: WindowPeriod;
  maxTeams: string;
  teamSize: string;
  entryFee: string;
  prizePool: string;
};

/* ============================================================
   WINDOW OPTIONS
   ============================================================ */

const WINDOW_OPTIONS: {
  value: WindowPeriod;
  label: string;
}[] = [
  {
    value: "1",
    label: "1 Day",
  },
  {
    value: "2",
    label: "2 Days",
  },
  {
    value: "3",
    label: "3 Days",
  },
  {
    value: "7",
    label: "7 Days",
  },
  {
    value: "14",
    label: "14 Days",
  },
  {
    value: "30",
    label: "30 Days",
  },
];

/* ============================================================
   HELPERS
   ============================================================ */

function getTodayString() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString: string) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function calculateEndDate(
  startDate: string,
  windowPeriod: WindowPeriod,
) {
  if (!startDate) {
    return "";
  }

  const date = new Date(`${startDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setDate(
    date.getDate() + Number(windowPeriod) - 1,
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ============================================================
   SELECT FIELD
   ============================================================ */

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  description,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  disabled?: boolean;
  required?: boolean;
  description?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={disabled}
        required={required}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {description && (
        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function EditCompetitionPage() {
  const params = useParams<{
    competitionId: string;
  }>();

  const router = useRouter();

  const competitionId = params.competitionId;

  /* ==========================================================
     STATE
     ========================================================== */

  const [form, setForm] =
    useState<CompetitionForm>({
      title:
        "JAMB League 2027 National Challenge",

      category: "General JAMB",

      status: "Registration Open",

      description:
        "National CBT competition for students preparing for the Unified Tertiary Matriculation Examination.",

      startDate: getTodayString(),

      windowPeriod: "3",

      maxTeams: "500",

      teamSize: "3",

      entryFee: "0",

      prizePool:
        "Scholarships + Cash Rewards",
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitMessage, setSubmitMessage] =
    useState("");

  const [submitError, setSubmitError] =
    useState("");

  const [isCancelling, setIsCancelling] =
    useState(false);

  const [cancelError, setCancelError] =
    useState("");

  /* ==========================================================
     END DATE
     ========================================================== */

  const endDate = useMemo(() => {
    return calculateEndDate(
      form.startDate,
      form.windowPeriod,
    );
  }, [
    form.startDate,
    form.windowPeriod,
  ]);

  /* ==========================================================
     UPDATE FIELD
     ========================================================== */

  const updateField = <
    K extends keyof CompetitionForm,
  >(
    field: K,
    value: CompetitionForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ==========================================================
     SAVE CHANGES
     ========================================================== */

  const handleSaveChanges = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    /*
     * The exact UPDATE endpoint was not provided.
     *
     * Therefore this page does not make up an endpoint.
     * The form is ready for the update API to be connected.
     */

    setSubmitError("");
    setSubmitMessage("");

    try {
      setIsSubmitting(true);

      /*
       * Temporary frontend confirmation.
       *
       * Replace this section with your actual
       * update-contest-by-id API when available.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 500),
      );

      console.log(
        "Competition changes:",
        {
          competitionId,
          ...form,
          calculatedEndDate: endDate,
        },
      );

      setSubmitMessage(
        "Competition changes are ready to be saved. Connect the update endpoint to persist them.",
      );
    } catch (error) {
      console.error(
        "Failed to save competition:",
        error,
      );

      setSubmitError(
        "Failed to save competition changes. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================
     CANCEL COMPETITION
     ========================================================== */

  const handleCancelCompetition = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this competition?\n\nThis action will mark the competition as cancelled and cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCancelling(true);
      setCancelError("");

      await cancelContestById(competitionId);

      window.alert(
        "Competition cancelled successfully.",
      );

      router.push(
        `/admin/secondary/solveandwin/competitions/${competitionId}`,
      );
    } catch (error: unknown) {
      console.error(
        "Failed to cancel competition:",
        error,
      );

      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      const message =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Failed to cancel the competition. Please try again.";

      setCancelError(message);
    } finally {
      setIsCancelling(false);
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Competition
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Edit Competition
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Update competition details,
              registration settings and scheduling.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            <Trophy className="h-4 w-4" />
            Competition ID: {competitionId}
          </div>
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
            ================================================== */}

        {submitMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

            <div>
              <p className="font-semibold">
                Success
              </p>

              <p className="mt-1">
                {submitMessage}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
            ================================================== */}

        {submitError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold">
                Failed to save
              </p>

              <p className="mt-1">
                {submitError}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            EDIT FORM
            ================================================== */}

        <form
          onSubmit={handleSaveChanges}
          className="space-y-8"
        >

          {/* ==================================================
              BASIC INFORMATION
              ================================================== */}

          <Card className="p-6 md:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <Trophy className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the basic information about
                  this competition.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* TITLE */}

              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Competition Title
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value,
                    )
                  }
                  required
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* CATEGORY */}

              <SelectField
                id="category"
                label="Subject Category"
                value={form.category}
                onChange={(value) =>
                  updateField(
                    "category",
                    value,
                  )
                }
                options={[
                  {
                    value: "General JAMB",
                    label: "General JAMB",
                  },
                  {
                    value: "Science",
                    label: "Science",
                  },
                  {
                    value: "Commercial",
                    label: "Commercial",
                  },
                  {
                    value: "Arts",
                    label: "Arts",
                  },
                ]}
                disabled={isSubmitting}
                required
              />

              {/* STATUS */}

              <SelectField
                id="status"
                label="Competition Status"
                value={form.status}
                onChange={(value) =>
                  updateField(
                    "status",
                    value,
                  )
                }
                options={[
                  {
                    value: "Draft",
                    label: "Draft",
                  },
                  {
                    value: "Registration Open",
                    label: "Registration Open",
                  },
                  {
                    value: "Ongoing",
                    label: "Ongoing",
                  },
                  {
                    value: "Completed",
                    label: "Completed",
                  },
                  {
                    value: "Cancelled",
                    label: "Cancelled",
                  },
                ]}
                disabled={isSubmitting}
                required
              />

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
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
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>
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
                  Choose when the competition starts
                  and how long it remains open.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* START DATE */}

              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Start Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="startDate"
                  type="date"
                  min={getTodayString()}
                  value={form.startDate}
                  onChange={(event) =>
                    updateField(
                      "startDate",
                      event.target.value,
                    )
                  }
                  required
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {form.startDate && (
                  <p className="mt-2 text-xs text-slate-500">
                    Starts{" "}
                    <span className="font-semibold text-slate-700">
                      {formatDisplayDate(
                        form.startDate,
                      )}
                    </span>
                  </p>
                )}
              </div>

              {/* WINDOW */}

              <SelectField
                id="windowPeriod"
                label="Window Period"
                value={form.windowPeriod}
                onChange={(value) =>
                  updateField(
                    "windowPeriod",
                    value as WindowPeriod,
                  )
                }
                options={WINDOW_OPTIONS}
                disabled={isSubmitting}
                required
                description="How long students can participate."
              />
            </div>

            {/* END DATE PREVIEW */}

            {endDate && (
              <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-purple-600" />

                  <div>
                    <p className="text-sm font-bold text-purple-900">
                      Competition Window
                    </p>

                    <p className="mt-1 text-sm text-purple-800">
                      {formatDisplayDate(
                        form.startDate,
                      )}{" "}
                      →{" "}
                      {formatDisplayDate(endDate)}
                    </p>

                    <p className="mt-1 text-xs text-purple-700">
                      {form.windowPeriod}{" "}
                      {form.windowPeriod === "1"
                        ? "day"
                        : "days"}{" "}
                      participation window.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* INFO */}

            <div className="mt-6 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />

              <p>
                The backend should receive the start
                date and window period. The end date
                shown above is a frontend preview.
              </p>
            </div>
          </Card>

          {/* ==================================================
              REGISTRATION SETTINGS
              ================================================== */}

          <Card className="p-6 md:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="rounded-xl bg-green-100 p-3 text-green-700">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registration Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure participation and entry
                  settings.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* MAX TEAMS */}

              <div>
                <label
                  htmlFor="maxTeams"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Maximum Teams
                </label>

                <input
                  id="maxTeams"
                  type="number"
                  min="1"
                  value={form.maxTeams}
                  onChange={(event) =>
                    updateField(
                      "maxTeams",
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* TEAM SIZE */}

              <div>
                <label
                  htmlFor="teamSize"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Team Size
                </label>

                <input
                  id="teamSize"
                  type="number"
                  min="1"
                  value={form.teamSize}
                  onChange={(event) =>
                    updateField(
                      "teamSize",
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* ENTRY FEE */}

              <div>
                <label
                  htmlFor="entryFee"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Entry Fee (₦)
                </label>

                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="entryFee"
                    type="number"
                    min="0"
                    value={form.entryFee}
                    onChange={(event) =>
                      updateField(
                        "entryFee",
                        event.target.value,
                      )
                    }
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PRIZE POOL */}

              <div>
                <label
                  htmlFor="prizePool"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Prize Pool
                </label>

                <input
                  id="prizePool"
                  type="text"
                  value={form.prizePool}
                  onChange={(event) =>
                    updateField(
                      "prizePool",
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>
          </Card>

          {/* ==================================================
              SCHEDULE SUMMARY
              ================================================== */}

          <Card className="border-slate-200 bg-slate-900 p-6 text-white md:p-8">
            <div className="grid gap-6 md:grid-cols-3">

              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Start
                  </span>
                </div>

                <p className="mt-2 font-bold">
                  {formatDisplayDate(
                    form.startDate,
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Duration
                  </span>
                </div>

                <p className="mt-2 font-bold">
                  {form.windowPeriod}{" "}
                  {form.windowPeriod === "1"
                    ? "Day"
                    : "Days"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Ends
                  </span>
                </div>

                <p className="mt-2 font-bold">
                  {formatDisplayDate(endDate)}
                </p>
              </div>

            </div>
          </Card>

          {/* ==================================================
              CANCEL ERROR
              ================================================== */}

          {cancelError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-bold">
                  Unable to cancel competition
                </p>

                <p className="mt-1">
                  {cancelError}
                </p>
              </div>
            </div>
          )}

          {/* ==================================================
              ACTION BUTTONS
              ================================================== */}

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SAVE */}

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isCancelling
                }
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
              >
                {isSubmitting
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

              {/* BACK */}

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back
              </Link>
            </div>

            {/* CANCEL */}

            <Button
              type="button"
              variant="destructive"
              onClick={
                handleCancelCompetition
              }
              disabled={
                isCancelling ||
                isSubmitting
              }
              leftIcon={
                isCancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )
              }
            >
              {isCancelling
                ? "Cancelling..."
                : "Cancel Competition"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
