




"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Search,
  RefreshCw,
  CalendarDays,
  Pencil,
  Power,
  X,
  AlertCircle,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
} from "lucide-react";

import {
  getAcademicSessions,
  createAcademicSession,
  updateAcademicSession,
  updateAcademicSessionStatus,
  type AcademicSession,
  type AcademicPeriodType,
} from "@/lib/schools/portal/services/academicsessions";

/* =========================================================
   TYPES
========================================================= */

interface SessionForm {
  sessionName: string;
  startDate: string;
  endDate: string;
  periodType: AcademicPeriodType;
}

const EMPTY_FORM: SessionForm = {
  sessionName: "",
  startDate: "",
  endDate: "",
  periodType: "TERM",
};

/* =========================================================
   HELPERS
========================================================= */

function getSessionId(session: AcademicSession): string {
  return String(
    session._id ||
      session.id ||
      session.academicSessionId ||
      ""
  );
}

function getSessionName(session: AcademicSession): string {
  return (
    session.sessionName ||
    session.name ||
    session.academicYear ||
    session.year ||
    session.title ||
    "Unnamed academic session"
  );
}

function getSessionActive(session: AcademicSession): boolean {
  if (typeof session.isActive === "boolean") {
    return session.isActive;
  }

  return String(session.status || "").toLowerCase() === "active";
}

function getPeriodType(session: AcademicSession): AcademicPeriodType {
  return String(session.periodType || "").toUpperCase() === "SEMESTER"
    ? "SEMESTER"
    : "TERM";
}

function formatDate(date?: string): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFriendlyError(
  error: unknown,
  fallback: string
): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return message || fallback;
}

/* =========================================================
   PAGE
========================================================= */

export default function AcademicSessionsPage() {
  const params = useParams();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const schoolSubdomain = String(slug || "")
    .trim()
    .toLowerCase();

  /* =========================================================
     STATE
  ========================================================= */

  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingSession, setEditingSession] =
    useState<AcademicSession | null>(null);

  const [form, setForm] = useState<SessionForm>(EMPTY_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     FETCH SESSIONS
  ========================================================= */

  const fetchSessions = useCallback(async () => {
    if (!schoolSubdomain) {
      setSessions([]);
      setError("School subdomain could not be identified.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getAcademicSessions(schoolSubdomain);

      setSessions(
        Array.isArray(response.sessions)
          ? response.sessions
          : []
      );
    } catch (err) {
      setSessions([]);

      setError(
        getFriendlyError(
          err,
          "Unable to load academic sessions. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [schoolSubdomain]);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const activeSessions = useMemo(
    () => sessions.filter(getSessionActive).length,
    [sessions]
  );

  const inactiveSessions = sessions.length - activeSessions;

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredSessions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return sessions;

    return sessions.filter((session) => {
      const name = getSessionName(session).toLowerCase();

      return (
        name.includes(search) ||
        String(session.startDate || "")
          .toLowerCase()
          .includes(search) ||
        String(session.endDate || "")
          .toLowerCase()
          .includes(search) ||
        String(session.periodType || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [sessions, searchTerm]);

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  function closeForm() {
    if (submitting) return;

    setShowForm(false);
    setEditingSession(null);
    setForm(EMPTY_FORM);
  }

  function openCreateForm() {
    setEditingSession(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(session: AcademicSession) {
    setEditingSession(session);

    setForm({
      sessionName: getSessionName(session),

      startDate: session.startDate
        ? String(session.startDate).slice(0, 10)
        : "",

      endDate: session.endDate
        ? String(session.endDate).slice(0, 10)
        : "",

      periodType: getPeriodType(session),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleFormChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "periodType"
          ? (value as AcademicPeriodType)
          : value,
    }));
  }

  /* =========================================================
     CREATE / UPDATE SESSION
  ========================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    if (!schoolSubdomain) {
      setError("School subdomain could not be identified.");
      return;
    }

    if (!form.sessionName.trim()) {
      setError("Please enter an academic session name.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError(
        "Please provide both the start date and end date."
      );
      return;
    }

    if (form.endDate < form.startDate) {
      setError(
        "The end date cannot be earlier than the start date."
      );
      return;
    }

    if (
      form.periodType !== "TERM" &&
      form.periodType !== "SEMESTER"
    ) {
      setError("Please select a valid academic period type.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      sessionName: form.sessionName.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      periodType: form.periodType,
    };

    try {
      if (editingSession) {
        const sessionId = getSessionId(editingSession);

        if (!sessionId) {
          throw new Error(
            "The selected academic session has no valid ID."
          );
        }

        await updateAcademicSession(
          sessionId,
          payload,
          schoolSubdomain
        );

        setSuccess(
          "Academic session updated successfully."
        );
      } else {
        await createAcademicSession(
          payload,
          schoolSubdomain
        );

        setSuccess(
          "Academic session created successfully."
        );
      }

      setShowForm(false);
      setEditingSession(null);
      setForm(EMPTY_FORM);

      await fetchSessions();
    } catch (err) {
      setError(
        getFriendlyError(
          err,
          editingSession
            ? "Unable to update academic session."
            : "Unable to create academic session."
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =========================================================
     ACTIVATE / DEACTIVATE SESSION
  ========================================================= */

  async function handleToggleStatus(
    session: AcademicSession
  ) {
    const sessionId = getSessionId(session);

    if (!sessionId) {
      setError("Unable to identify this academic session.");
      return;
    }

    if (!schoolSubdomain) {
      setError("School subdomain could not be identified.");
      return;
    }

    const nextStatus = !getSessionActive(session);

    setError("");
    setSuccess("");
    setUpdatingStatusId(sessionId);

    try {
      await updateAcademicSessionStatus(
        sessionId,
        { isActive: nextStatus },
        schoolSubdomain
      );

      setSuccess(
        nextStatus
          ? "Academic session activated successfully."
          : "Academic session deactivated successfully."
      );

      await fetchSessions();
    } catch (err) {
      setError(
        getFriendlyError(
          err,
          "Unable to update academic session status."
        )
      );
    } finally {
      setUpdatingStatusId("");
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6 pb-10">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <BookOpen size={16} />
            <span>Academic Management</span>
            <span>/</span>
            <span>Academic Sessions</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Academic Sessions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage your school&apos;s academic sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void fetchSessions()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Create Session
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p>{error}</p>

            {!loading && !showForm && (
              <button
                type="button"
                onClick={() => void fetchSessions()}
                className="mt-2 font-semibold underline underline-offset-2 hover:text-red-900"
              >
                Try again
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0"
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div
          role="status"
          className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <p>{success}</p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Sessions
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {loading ? "—" : sessions.length}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Sessions
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {loading ? "—" : activeSessions}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Inactive Sessions
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-600">
                {loading ? "—" : inactiveSessions}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================
          FIRST-TIME SETUP STATE
      ===================================================== */}

      {!loading &&
        !error &&
        sessions.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <GraduationCap size={32} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Welcome to Academic Session Setup
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Your school has not created an academic session yet.
              Start by creating your first academic session.
              You will then be able to create academic periods
              based on your selected Term or Semester structure.
            </p>

            <div className="mx-auto mt-6 grid max-w-lg grid-cols-1 gap-3 text-left sm:grid-cols-2">

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-blue-600">
                  <Layers size={18} />
                  <span className="text-sm font-semibold">
                    Term
                  </span>
                </div>

                <p className="text-xs leading-5 text-gray-500">
                  Organize your academic year into terms.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-blue-600">
                  <BookOpen size={18} />
                  <span className="text-sm font-semibold">
                    Semester
                  </span>
                </div>

                <p className="text-xs leading-5 text-gray-500">
                  Organize your academic year into semesters.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Create First Academic Session
            </button>

          </div>
        )}

      {/* =====================================================
          SESSIONS TABLE
      ===================================================== */}

      {sessions.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                All Academic Sessions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View, edit, and manage your academic sessions.
              </p>
            </div>
          </div>

          {/* SEARCH */}

          <div className="border-b border-gray-100 p-5">
            <div className="relative max-w-md">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search academic sessions..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-gray-500">
              <RefreshCw
                size={18}
                className="animate-spin"
              />
              Loading academic sessions...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Search size={23} />
              </div>

              <h3 className="font-semibold text-gray-800">
                No matching sessions found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try another search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">

                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Academic Session
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Period Structure
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Start Date
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      End Date
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSessions.map((session, index) => {
                    const sessionId = getSessionId(session);
                    const isActive = getSessionActive(session);
                    const isUpdating =
                      updatingStatusId === sessionId;

                    return (
                      <tr
                        key={sessionId || index}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <CalendarDays size={19} />
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">
                                {getSessionName(session)}
                              </p>

                              {session.createdAt && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Created{" "}
                                  {formatDate(session.createdAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {getPeriodType(session) === "TERM"
                              ? "Term System"
                              : "Semester System"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(session.startDate)}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(session.endDate)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(session)
                              }
                              title="Edit academic session"
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleToggleStatus(session)
                              }
                              disabled={isUpdating}
                              title={
                                isActive
                                  ? "Deactivate academic session"
                                  : "Activate academic session"
                              }
                              className={`rounded-lg border p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isActive
                                  ? "border-red-200 text-red-600 hover:bg-red-50"
                                  : "border-green-200 text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {isUpdating ? (
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Power size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE FOOTER */}

          {!loading && filteredSessions.length > 0 && (
            <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
              Showing {filteredSessions.length} of {sessions.length} academic sessions
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !submitting
            ) {
              closeForm();
            }
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingSession
                    ? "Edit Academic Session"
                    : "Create Academic Session"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingSession
                    ? "Update the details of this academic session."
                    : "Provide the details for your new academic session."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* SESSION NAME */}

              <div>
                <label
                  htmlFor="sessionName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Academic Session Name
                </label>

                <input
                  id="sessionName"
                  name="sessionName"
                  type="text"
                  value={form.sessionName}
                  onChange={handleFormChange}
                  placeholder="e.g. 2026/2027 Academic Session"
                  required
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                />
              </div>

              {/* PERIOD TYPE */}

              <div>
                <label
                  htmlFor="periodType"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Academic Period Structure
                </label>

                <select
                  id="periodType"
                  name="periodType"
                  value={form.periodType}
                  onChange={handleFormChange}
                  required
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                >
                  <option value="TERM">
                    Term System
                  </option>

                  <option value="SEMESTER">
                    Semester System
                  </option>
                </select>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Choose how your school divides its academic
                  session. This determines whether academic
                  periods are organized as terms or semesters.
                </p>
              </div>

              {/* START DATE */}

              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleFormChange}
                  required
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                />
              </div>

              {/* END DATE */}

              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={form.startDate || undefined}
                  value={form.endDate}
                  onChange={handleFormChange}
                  required
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                />
              </div>

              {/* FORM ERROR */}

              {/* FORM ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Saving..."
                    : editingSession
                      ? "Update Session"
                      : "Create Session"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
