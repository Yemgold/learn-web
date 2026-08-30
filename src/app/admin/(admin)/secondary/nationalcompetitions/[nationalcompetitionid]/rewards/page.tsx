





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  ChevronRight,
  Edit3,
  Loader2,
  Plus,
  Save,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

interface Reward {
  id: string;
  position: number;
  title: string;
  description: string;
  reward: string;
}

/* ============================================================
   PAGE
   ============================================================ */

export default function NationalCompetitionRewardsPage() {
  const params = useParams();

  const rawCompetitionId =
    params.nationalcompetitionid;

  const competitionId = Array.isArray(
    rawCompetitionId,
  )
    ? rawCompetitionId[0]
    : rawCompetitionId;

  /* ==========================================================
     STATE
     ========================================================== */

  const [rewards, setRewards] =
    useState<Reward[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [reward, setReward] =
    useState("");

  const [position, setPosition] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ==========================================================
     OPEN ADD FORM
     ========================================================== */

  const openAddForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setReward("");
    setPosition(
      String(rewards.length + 1),
    );
    setError("");
    setShowForm(true);
  };

  /* ==========================================================
     OPEN EDIT FORM
     ========================================================== */

  const openEditForm = (
    item: Reward,
  ) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(
      item.description,
    );
    setReward(item.reward);
    setPosition(
      String(item.position),
    );
    setError("");
    setShowForm(true);
  };

  /* ==========================================================
     CLOSE FORM
     ========================================================== */

  const closeForm = () => {
    if (isSaving) return;

    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setReward("");
    setPosition("");
    setError("");
  };

  /* ==========================================================
     SAVE REWARD
     ========================================================== */

  const handleSave = async () => {
    setError("");

    if (!title.trim()) {
      setError(
        "Please enter a reward title.",
      );
      return;
    }

    if (!reward.trim()) {
      setError(
        "Please enter the reward.",
      );
      return;
    }

    const numericPosition =
      Number(position);

    if (
      !position.trim() ||
      Number.isNaN(
        numericPosition,
      ) ||
      numericPosition <= 0
    ) {
      setError(
        "Position must be greater than 0.",
      );
      return;
    }

    setIsSaving(true);

    /*
     * There is currently no National Competition
     * rewards API.
     *
     * This temporary local operation allows the UI
     * to be tested without creating a fake endpoint.
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    if (editingId) {
      setRewards((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                position:
                  numericPosition,
                title: title.trim(),
                description:
                  description.trim(),
                reward: reward.trim(),
              }
            : item,
        ),
      );
    } else {
      setRewards((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          position:
            numericPosition,
          title: title.trim(),
          description:
            description.trim(),
          reward: reward.trim(),
        },
      ]);
    }

    setIsSaving(false);
    closeForm();
  };

  /* ==========================================================
     DELETE
     ========================================================== */

  const handleDelete = (
    id: string,
  ) => {
    setRewards((current) =>
      current
        .filter(
          (item) => item.id !== id,
        )
        .map((item, index) => ({
          ...item,
          position: index + 1,
        })),
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
     SORT REWARDS
     ========================================================== */

  const sortedRewards = [
    ...rewards,
  ].sort(
    (a, b) =>
      a.position - b.position,
  );

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
            Rewards
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

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              <Trophy className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Competition Rewards
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Configure the prizes and rewards awarded to
              competition winners.
            </p>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
            Add Reward
          </button>

        </div>

        {/* ==================================================
            BACKEND NOTICE
        ================================================== */}

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>

            <p className="font-semibold">
              Backend integration pending
            </p>

            <p className="mt-1 leading-6">
              Rewards are currently stored only in this
              page's local state. Once the National
              Competition rewards API is available, this
              page can be connected without changing the
              overall UI structure.
            </p>

          </div>

        </div>

        {/* ==================================================
            REWARD LIST
        ================================================== */}

        {sortedRewards.length === 0 ? (

          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">

              <Award className="h-7 w-7 text-gray-500 dark:text-gray-400" />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
              No rewards configured
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Add the prizes that winners will receive for
              each competition position.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add First Reward
            </button>

          </div>

        ) : (

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            {/* DESKTOP HEADER */}

            <div className="hidden border-b border-gray-200 bg-gray-50 px-6 py-4 md:grid md:grid-cols-[90px_1fr_1fr_130px] md:gap-4 dark:border-gray-800 dark:bg-gray-950">

              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Position
              </div>

              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Award
              </div>

              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reward
              </div>

              <div className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </div>

            </div>

            {/* ITEMS */}

            <div className="divide-y divide-gray-200 dark:divide-gray-800">

              {sortedRewards.map(
                (item) => (
                  <div
                    key={item.id}
                    className="px-5 py-5 md:grid md:grid-cols-[90px_1fr_1fr_130px] md:items-center md:gap-4 md:px-6"
                  >

                    {/* POSITION */}

                    <div className="mb-4 flex items-center gap-3 md:mb-0">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {item.position}
                      </div>

                      <span className="text-sm font-medium text-gray-500 md:hidden">
                        Position
                      </span>

                    </div>

                    {/* AWARD */}

                    <div>

                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      )}

                    </div>

                    {/* REWARD */}

                    <div className="mt-4 md:mt-0">

                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.reward}
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 flex items-center justify-end gap-2 md:mt-0">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            item,
                          )
                        }
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          Edit
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            item.id,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                  </div>
                ),
              )}

            </div>

          </div>

        )}

        {/* ==================================================
            ADD / EDIT MODAL
        ================================================== */}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 dark:border-gray-800">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingId
                      ? "Edit Reward"
                      : "Add Reward"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure the reward for this position.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSaving}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              {/* FORM */}

              <div className="space-y-5 p-5">

                {/* POSITION */}

                <div>

                  <label
                    htmlFor="position"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Position
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="position"
                    type="number"
                    min="1"
                    value={position}
                    onChange={(event) =>
                      setPosition(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 1"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

                {/* TITLE */}

                <div>

                  <label
                    htmlFor="reward-title"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Award Title
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="reward-title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 1st Place"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label
                    htmlFor="reward-description"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="reward-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    rows={3}
                    placeholder="e.g. National Competition Champion"
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

                {/* REWARD */}

                <div>

                  <label
                    htmlFor="reward"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reward / Prize
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    id="reward"
                    value={reward}
                    onChange={(event) =>
                      setReward(
                        event.target.value,
                      )
                    }
                    rows={4}
                    placeholder="e.g. ₦500,000 + Trophy + Certificate"
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

                {/* ERROR */}

                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">

                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>
                      {error}
                    </span>

                  </div>
                )}

              </div>

              {/* MODAL FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-gray-800">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSaving}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >

                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingId
                        ? "Save Changes"
                        : "Add Reward"}
                    </>
                  )}

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