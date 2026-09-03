







"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cancelContestById } from "@/lib/api/solveAndWin";

export default function EditCompetitionPage() {
  const params = useParams<{ competitionId: string }>();
  const router = useRouter();

  const competitionId = params.competitionId;

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

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

      alert("Competition cancelled successfully.");

      router.push(
        `/admin/secondary/solveandwin/competitions/${competitionId}`,
      );
    } catch (error: any) {
      console.error("Failed to cancel competition:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to cancel the competition. Please try again.";

      setCancelError(message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Competition
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Edit Competition
            </h1>

            <p className="mt-2 text-slate-600">
              Update competition details, registration settings and
              scheduling.
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Competition ID: {competitionId}
          </span>
        </div>

        {/* Edit Form */}
        <form className="space-y-8">
          {/* Basic Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Competition Title
                </label>

                <input
                  type="text"
                  defaultValue="JAMB League 2027 National Challenge"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subject Category
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none">
                  <option>General JAMB</option>
                  <option>Science</option>
                  <option>Commercial</option>
                  <option>Arts</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Competition Status
                </label>

                <select
                  defaultValue="Registration Open"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Draft</option>
                  <option>Registration Open</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  rows={5}
                  defaultValue="National CBT competition for students preparing for the Unified Tertiary Matriculation Examination."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Competition Schedule
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Registration Opens
                </label>

                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Registration Closes
                </label>

                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Competition Date
                </label>

                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Start Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Registration */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">
              Registration Settings
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Maximum Teams
                </label>

                <input
                  type="number"
                  defaultValue={500}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Team Size
                </label>

                <input
                  type="number"
                  defaultValue={3}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Entry Fee (₦)
                </label>

                <input
                  type="number"
                  defaultValue={0}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Prize Pool
                </label>

                <input
                  type="text"
                  defaultValue="Scholarships + Cash Rewards"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Error */}
          {cancelError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {cancelError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Save Changes
              </button>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
                className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back
              </Link>
            </div>

            {/* Cancel Competition */}
            <button
              type="button"
              onClick={handleCancelCompetition}
              disabled={isCancelling}
              className="rounded-xl border border-red-300 bg-red-50 px-8 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCancelling
                ? "Cancelling Competition..."
                : "Cancel Competition"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}