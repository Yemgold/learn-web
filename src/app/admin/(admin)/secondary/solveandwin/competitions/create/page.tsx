




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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

export default function CreateCompetitionPage() {
  const [form, setForm] = useState<CompetitionForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (
    field: keyof CompetitionForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Competition title is required.");
      return;
    }

    if (!form.startDate) {
      setError("Start date is required.");
      return;
    }

    if (!form.startTime) {
      setError("Start time is required.");
      return;
    }

    if (!form.endDate) {
      setError("End date is required.");
      return;
    }

    if (!form.endTime) {
      setError("End time is required.");
      return;
    }

    if (
      form.maxParticipants &&
      Number(form.maxParticipants) < 1
    ) {
      setError("Maximum participants must be greater than 0.");
      return;
    }

    if (Number(form.entryPoints) < 0) {
      setError("Entry points cannot be negative.");
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * ==========================================================
       * BACKEND INTEGRATION
       * ==========================================================
       *
       * Replace this section with your create competition API.
       *
       * Example payload:
       *
       * {
       *   title: form.title.trim(),
       *   description: form.description.trim(),
       *   category: form.category,
       *   status: form.status,
       *   startDate: form.startDate,
       *   startTime: form.startTime,
       *   endDate: form.endDate,
       *   endTime: form.endTime,
       *   maxParticipants:
       *     form.maxParticipants
       *       ? Number(form.maxParticipants)
       *       : undefined,
       *   entryPoints: Number(form.entryPoints),
       * }
       *
       * ==========================================================
       */

      console.log("CREATE COMPETITION:", {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        startDate: form.startDate,
        startTime: form.startTime,
        endDate: form.endDate,
        endTime: form.endTime,
        maxParticipants: form.maxParticipants
          ? Number(form.maxParticipants)
          : undefined,
        entryPoints: Number(form.entryPoints),
      });

      /*
       * Temporary delay so the loading state can be seen.
       * Remove this when the real API is connected.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      /*
       * After the backend returns the new competition ID,
       * navigate to:
       *
       * /admin/solveandwin/competitions/{competitionId}
       *
       * Example:
       *
       * router.push(
       *   `/admin/solveandwin/competitions/${response.data._id}`
       * );
       */

      alert(
        "Competition form is ready. Connect the create competition API to save it."
      );
    } catch (err) {
      console.error("Failed to create competition:", err);

      setError(
        "Something went wrong while creating the competition."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Back */}
        <Link
          href="/admin/secondary/solveandwin/competitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <Trophy className="h-4 w-4" />
            Solve & Win
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Create Competition
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Create a new competition, then configure its
            subjects, questions, participants, schedule and
            results from the competition dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
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
                      event.target.value
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
                        event.target.value
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
                          event.target.value
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
                      <option value="STEM">STEM</option>
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
                          event.target.value
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

            {/* Schedule */}
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
                            event.target.value
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
                            event.target.value
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
                            event.target.value
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
                            event.target.value
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

            {/* Participation & Points */}
            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Participation & Entry
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Set participation limits and the Solve & Win
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
                          event.target.value
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
                    Entry Solve & Win Points
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
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Points deducted from the participant's Solve &
                    Win wallet when they enter.
                  </p>
                </div>
              </div>
            </Card>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
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
