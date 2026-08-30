





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Megaphone,
  Plus,
  Trash2,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type AnnouncementStatus =
  | "PUBLISHED"
  | "DRAFT";

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: AnnouncementStatus;
  createdAt: string;
  publishedAt?: string;
}

/* ============================================================
   PAGE
   ============================================================ */

export default function NationalCompetitionAnnouncementsPage() {
  const params = useParams();

  const rawCompetitionId =
    params.nationalcompetitionid;

  const competitionId =
    Array.isArray(rawCompetitionId)
      ? rawCompetitionId[0]
      : rawCompetitionId;

  /* ==========================================================
     STATE
     ========================================================== */

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [status, setStatus] =
    useState<AnnouncementStatus>(
      "DRAFT",
    );

  const [isSaving, setIsSaving] =
    useState(false);

  /* ==========================================================
     CREATE ANNOUNCEMENT
     ========================================================== */

  const handleCreate = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !message.trim()
    ) {
      return;
    }

    /*
     * Backend API is not connected yet.
     *
     * This creates a temporary local announcement
     * so the UI can be tested.
     */

    setIsSaving(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    const newAnnouncement: Announcement =
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        message: message.trim(),
        status,
        createdAt:
          new Date().toISOString(),
        publishedAt:
          status === "PUBLISHED"
            ? new Date().toISOString()
            : undefined,
      };

    setAnnouncements(
      (current) => [
        newAnnouncement,
        ...current,
      ],
    );

    setTitle("");
    setMessage("");
    setStatus("DRAFT");
    setShowCreateForm(false);
    setIsSaving(false);
  };

  /* ==========================================================
     DELETE
     ========================================================== */

  const handleDelete = (
    announcementId: string,
  ) => {
    setAnnouncements(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            announcementId,
        ),
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

  /* ============================================================
     PAGE
     ============================================================ */

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
            Announcements
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
              <Megaphone className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Announcements
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Create and manage announcements for participants
              in this national competition.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreateForm(
                true,
              )
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </button>

        </div>

        {/* ==================================================
            BACKEND NOTICE
        ================================================== */}

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>

            <p className="font-semibold">
              Announcements API not connected
            </p>

            <p className="mt-1 leading-6">
              Announcements created here are currently stored
              only in this page's local state. Connect the
              National Competition announcements API when the
              backend endpoint is available.
            </p>

          </div>

        </div>

        {/* ==================================================
            CREATE FORM
        ================================================== */}

        {showCreateForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">

              <div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create Announcement
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Send important information to competition
                  participants.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <form
              onSubmit={handleCreate}
              className="space-y-6 p-6"
            >

              {/* TITLE */}

              <div>

                <label
                  htmlFor="announcement-title"
                  className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Title
                </label>

                <input
                  id="announcement-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target
                        .value,
                    )
                  }
                  placeholder="e.g. Competition starts tomorrow"
                  maxLength={150}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  required
                />

              </div>

              {/* MESSAGE */}

              <div>

                <label
                  htmlFor="announcement-message"
                  className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Message
                </label>

                <textarea
                  id="announcement-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Write the announcement..."
                  rows={6}
                  maxLength={2000}
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  required
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {message.length}/2000
                </p>

              </div>

              {/* STATUS */}

              <div>

                <label
                  htmlFor="announcement-status"
                  className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Status
                </label>

                <select
                  id="announcement-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as AnnouncementStatus,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800 sm:max-w-xs"
                >
                  <option value="DRAFT">
                    Save as Draft
                  </option>

                  <option value="PUBLISHED">
                    Publish
                  </option>

                </select>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateForm(
                      false,
                    )
                  }
                  className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    !title.trim() ||
                    !message.trim()
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  {isSaving ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {status ===
                      "PUBLISHED"
                        ? "Publish Announcement"
                        : "Save Draft"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================
            ANNOUNCEMENTS
        ================================================== */}

        {announcements.length ===
        0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">

              <Bell className="h-7 w-7 text-gray-500 dark:text-gray-400" />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
              No announcements yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Create your first announcement to communicate
              important information to competition participants.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowCreateForm(
                  true,
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Create Announcement
            </button>

          </div>
        ) : (
          <div className="space-y-4">

            {announcements.map(
              (announcement) => (
                <div
                  key={
                    announcement.id
                  }
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {
                            announcement.title
                          }
                        </h2>

                        <StatusBadge
                          status={
                            announcement.status
                          }
                        />

                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {
                          announcement.message
                        }
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-500">

                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Created{" "}
                          {new Date(
                            announcement.createdAt,
                          ).toLocaleDateString()}
                        </span>

                        {announcement.publishedAt && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Published{" "}
                            {new Date(
                              announcement.publishedAt,
                            ).toLocaleDateString()}
                          </span>
                        )}

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          announcement.id,
                        )
                      }
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      aria-label="Delete announcement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              ),
            )}

          </div>
        )}

      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({
  status,
}: {
  status: AnnouncementStatus;
}) {
  if (status === "PUBLISHED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      <Clock className="h-3.5 w-3.5" />
      Draft
    </span>
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
