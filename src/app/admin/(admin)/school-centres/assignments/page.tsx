




"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";

const INSTITUTIONS_KEY = "learnyfi-school-centres-institutions";
const CLASSES_KEY = "learnyfi-school-centres-classes";
const ASSIGNMENTS_KEY = "learnyfi-school-centres-assignments";

type Institution = {
  id: string;
  name: string;
  status?: string;
};

type SchoolClass = {
  id: string;
  name: string;
  level?: string;
  institutionId: string;
  institutionName?: string;
  status?: string;
};

type AssignmentStatus = "Draft" | "Published" | "Closed";

type Assignment = {
  id: string;
  title: string;
  instructions: string;
  institutionId: string;
  institutionName: string;
  classId: string;
  className: string;
  subject: string;
  topic: string;
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  startDate: string;
  dueDate: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt?: string;
};

const EMPTY_FORM = {
  title: "",
  instructions: "",
  institutionId: "",
  classId: "",
  subject: "",
  topic: "",
  questionCount: "20",
  durationMinutes: "30",
  totalMarks: "20",
  startDate: "",
  dueDate: "",
  status: "Draft" as AssignmentStatus,
};

const SUBJECTS = [
  "English Language",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Commerce",
  "Government",
  "Accounting",
  "Literature in English",
  "Agricultural Science",
  "Civic Education",
  "Computer Studies",
  "Other",
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(value?: string) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDateTime(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getAssignmentStatus(status: string) {
  if (status === "Published") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (status === "Closed") {
    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  return "border-amber-500/20 bg-amber-500/10 text-amber-400";
}

export default function SchoolAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<Assignment | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<Assignment | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(() => {
    setLoading(true);

    const storedAssignments = readStorage<unknown>(
      ASSIGNMENTS_KEY,
      []
    );
    const storedInstitutions = readStorage<unknown>(
      INSTITUTIONS_KEY,
      []
    );
    const storedClasses = readStorage<unknown>(CLASSES_KEY, []);

    setAssignments(
      Array.isArray(storedAssignments)
        ? (storedAssignments as Assignment[])
        : []
    );

    setInstitutions(
      Array.isArray(storedInstitutions)
        ? (storedInstitutions as Institution[])
        : []
    );

    setClasses(
      Array.isArray(storedClasses)
        ? (storedClasses as SchoolClass[])
        : []
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    const handleStorage = () => loadData();
    const handleFocus = () => loadData();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadData]);

  const availableClasses = useMemo(
    () =>
      classes.filter(
        (item) =>
          item.institutionId === form.institutionId &&
          item.status !== "Inactive"
      ),
    [classes, form.institutionId]
  );

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((item) => {
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.subject?.toLowerCase().includes(query) ||
        item.topic?.toLowerCase().includes(query) ||
        item.className?.toLowerCase().includes(query) ||
        item.institutionName?.toLowerCase().includes(query);

      const matchesInstitution =
        institutionFilter === "all" ||
        item.institutionId === institutionFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesSubject =
        subjectFilter === "all" || item.subject === subjectFilter;

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesStatus &&
        matchesSubject
      );
    });
  }, [
    assignments,
    search,
    institutionFilter,
    statusFilter,
    subjectFilter,
  ]);

  const publishedCount = assignments.filter(
    (item) => item.status === "Published"
  ).length;

  const draftCount = assignments.filter(
    (item) => item.status === "Draft"
  ).length;

  const closedCount = assignments.filter(
    (item) => item.status === "Closed"
  ).length;

  const openCreateModal = () => {
    setEditingAssignment(null);

    setForm({
      ...EMPTY_FORM,
      institutionId: institutions[0]?.id || "",
      classId: "",
    });

    setError("");
    setModalOpen(true);
  };

  const openEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment);

    setForm({
      title: assignment.title || "",
      instructions: assignment.instructions || "",
      institutionId: assignment.institutionId || "",
      classId: assignment.classId || "",
      subject: assignment.subject || "",
      topic: assignment.topic || "",
      questionCount: String(assignment.questionCount || 20),
      durationMinutes: String(assignment.durationMinutes || 30),
      totalMarks: String(assignment.totalMarks || 20),
      startDate: assignment.startDate || "",
      dueDate: assignment.dueDate || "",
      status: assignment.status || "Draft",
    });

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAssignment(null);
    setError("");
  };

  const handleInstitutionChange = (institutionId: string) => {
    setForm((current) => ({
      ...current,
      institutionId,
      classId: "",
    }));
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Enter an assignment title.");
      return;
    }

    if (!form.institutionId) {
      setError("Select an institution.");
      return;
    }

    if (!form.classId) {
      setError("Select a class for this assignment.");
      return;
    }

    if (!form.subject) {
      setError("Select a subject.");
      return;
    }

    const institution = institutions.find(
      (item) => item.id === form.institutionId
    );

    const selectedClass = classes.find(
      (item) =>
        item.id === form.classId &&
        item.institutionId === form.institutionId
    );

    if (!institution || !selectedClass) {
      setError("The selected institution or class is unavailable.");
      return;
    }

    const questionCount = Number(form.questionCount);
    const durationMinutes = Number(form.durationMinutes);
    const totalMarks = Number(form.totalMarks);

    if (
      !Number.isInteger(questionCount) ||
      questionCount < 1 ||
      questionCount > 500
    ) {
      setError("Question count must be between 1 and 500.");
      return;
    }

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 1 ||
      durationMinutes > 600
    ) {
      setError("Duration must be between 1 and 600 minutes.");
      return;
    }

    if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
      setError("Enter a valid total mark greater than zero.");
      return;
    }

    if (form.startDate && form.dueDate) {
      const start = getDateTime(form.startDate);
      const due = getDateTime(form.dueDate);

      if (start && due && due <= start) {
        setError("The due date must be after the start date.");
        return;
      }
    }

    const now = new Date().toISOString();

    const record: Assignment = {
      id: editingAssignment?.id || crypto.randomUUID(),
      title: form.title.trim(),
      instructions: form.instructions.trim(),
      institutionId: institution.id,
      institutionName: institution.name,
      classId: selectedClass.id,
      className: selectedClass.name,
      subject: form.subject,
      topic: form.topic.trim(),
      questionCount,
      durationMinutes,
      totalMarks,
      startDate: form.startDate,
      dueDate: form.dueDate,
      status: form.status,
      createdAt: editingAssignment?.createdAt || now,
      updatedAt: editingAssignment ? now : undefined,
    };

    const updatedAssignments = editingAssignment
      ? assignments.map((item) =>
          item.id === editingAssignment.id ? record : item
        )
      : [record, ...assignments];

    try {
      localStorage.setItem(
        ASSIGNMENTS_KEY,
        JSON.stringify(updatedAssignments)
      );

      setAssignments(updatedAssignments);
      closeModal();

      setSuccess(
        editingAssignment
          ? "Assignment updated successfully."
          : "Assignment created successfully."
      );
    } catch {
      setError("Unable to save this assignment in browser storage.");
    }
  };

  const changeStatus = (
    assignment: Assignment,
    status: AssignmentStatus
  ) => {
    const updatedAssignments = assignments.map((item) =>
      item.id === assignment.id
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    try {
      localStorage.setItem(
        ASSIGNMENTS_KEY,
        JSON.stringify(updatedAssignments)
      );

      setAssignments(updatedAssignments);

      setSelectedAssignment(null);
      setSuccess(`Assignment ${status.toLowerCase()} successfully.`);
    } catch {
      setError("Unable to update the assignment status.");
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const updatedAssignments = assignments.filter(
      (item) => item.id !== deleteTarget.id
    );

    try {
      localStorage.setItem(
        ASSIGNMENTS_KEY,
        JSON.stringify(updatedAssignments)
      );

      setAssignments(updatedAssignments);
      setDeleteTarget(null);
      setSelectedAssignment(null);
      setSuccess("Assignment deleted successfully.");
    } catch {
      setError("Unable to delete this assignment.");
    }
  };

  const getAssignmentTiming = (assignment: Assignment) => {
    const now = new Date();
    const start = getDateTime(assignment.startDate);
    const due = getDateTime(assignment.dueDate);

    if (assignment.status === "Closed") return "Closed";
    if (start && now < start) return "Scheduled";
    if (due && now > due) return "Past due";
    if (assignment.status === "Published") return "Open";

    return "Draft";
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/school-centres"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to School & Study Centres
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Assignments Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Create and manage practice assignments for institution classes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadData}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={openCreateModal}
              disabled={institutions.length === 0 || classes.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              Create Assignment
            </button>
          </div>
        </div>

        {/* Feedback */}
        {success && (
          <Feedback
            message={success}
            onClose={() => setSuccess("")}
            type="success"
          />
        )}

        {error && !modalOpen && (
          <Feedback
            message={error}
            onClose={() => setError("")}
            type="error"
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Assignments"
            value={assignments.length}
            icon={FileText}
            color="indigo"
          />

          <StatCard
            title="Published"
            value={publishedCount}
            icon={Send}
            color="emerald"
          />

          <StatCard
            title="Drafts"
            value={draftCount}
            icon={Edit3}
            color="amber"
          />

          <StatCard
            title="Closed"
            value={closedCount}
            icon={CheckCircle2}
            color="violet"
          />
        </div>

        {/* Setup warnings */}
        {!loading && institutions.length === 0 && (
          <SetupNotice
            title="No institutions registered"
            description="Register an institution before creating assignments."
            href="/admin/school-centres/institutions/register"
            linkText="Register institution"
          />
        )}

        {!loading && institutions.length > 0 && classes.length === 0 && (
          <SetupNotice
            title="No classes available"
            description="Create at least one class and assign it to an institution before creating assignments."
            href="/admin/school-centres/classes"
            linkText="Manage classes"
          />
        )}

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Filter size={16} className="text-indigo-400" />
            Search and filters
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search assignments..."
                className="filter-input pl-10"
              />
            </div>

            <select
              value={institutionFilter}
              onChange={(event) =>
                setInstitutionFilter(event.target.value)
              }
              className="filter-input"
            >
              <option value="all">All institutions</option>
              {institutions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="filter-input"
            >
              <option value="all">All subjects</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="filter-input"
            >
              <option value="all">All statuses</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {filteredAssignments.length} of {assignments.length}{" "}
              assignments
            </span>

            <button
              onClick={() => {
                setSearch("");
                setInstitutionFilter("all");
                setSubjectFilter("all");
                setStatusFilter("all");
              }}
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Assignment list */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-col gap-2 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">All Assignments</h2>
              <p className="mt-1 text-xs text-slate-500">
                Review and manage institution practice activities.
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {filteredAssignments.length} result(s)
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-400">
              <RefreshCw className="animate-spin" size={18} />
              Loading assignments...
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                <FileText size={28} />
              </div>

              <h3 className="mt-5 font-semibold">No assignments found</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {assignments.length === 0
                  ? "Create an assignment to give students structured practice activities."
                  : "Try changing your search or filters."}
              </p>

              {assignments.length === 0 &&
                institutions.length > 0 &&
                classes.length > 0 && (
                  <button
                    onClick={openCreateModal}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    <Plus size={17} />
                    Create first assignment
                  </button>
                )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Assignment</th>
                      <th className="px-5 py-4 font-semibold">Institution / Class</th>
                      <th className="px-5 py-4 font-semibold">Subject</th>
                      <th className="px-5 py-4 font-semibold">Due date</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {filteredAssignments.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedAssignment(item)}
                            className="text-left"
                          >
                            <p className="font-semibold text-slate-200 hover:text-indigo-400">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.questionCount} questions ·{" "}
                              {item.durationMinutes} minutes
                            </p>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-300">
                            {item.institutionName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.className}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-300">
                            {item.subject}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.topic || "General"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {formatDate(item.dueDate)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1.5">
                            <StatusBadge status={item.status} />
                            <p className="text-[11px] text-slate-500">
                              {getAssignmentTiming(item)}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              title="View assignment"
                              onClick={() => setSelectedAssignment(item)}
                            >
                              <BookOpen size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Edit assignment"
                              onClick={() => openEditModal(item)}
                            >
                              <Edit3 size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Delete assignment"
                              danger
                              onClick={() => setDeleteTarget(item)}
                            >
                              <Trash2 size={16} />
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 p-4 md:hidden">
                {filteredAssignments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.subject}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-400">
                      <p className="flex items-center gap-2">
                        <Building2 size={14} />
                        {item.institutionName}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users size={14} />
                        {item.className}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 size={14} />
                        {item.durationMinutes} minutes · {item.questionCount} questions
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        Due: {formatDate(item.dueDate)}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-800 pt-3">
                      <button
                        onClick={() => setSelectedAssignment(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                      >
                        <BookOpen size={14} />
                        View
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="flex items-center justify-center rounded-lg border border-red-500/20 px-3 py-2 text-red-400 hover:bg-red-500/10"
                        title="Delete assignment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <p className="text-center text-xs text-slate-600">
          Assignments are currently stored in this browser only. Student
          delivery, question selection, submissions, and grading require
          backend integration.
        </p>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal onClose={closeModal}>
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {editingAssignment ? "Edit Assignment" : "Create Assignment"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Set up a practice assignment for an institution class.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Assignment title" required>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="e.g. First Term Mathematics Practice"
                required
                className="form-input"
              />
            </FormField>

            <FormField label="Institution" required>
              <select
                value={form.institutionId}
                onChange={(event) =>
                  handleInstitutionChange(event.target.value)
                }
                required
                className="form-input"
              >
                <option value="">Select institution</option>
                {institutions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Class" required>
              <select
                value={form.classId}
                onChange={(event) =>
                  setForm({ ...form, classId: event.target.value })
                }
                required
                disabled={!form.institutionId}
                className="form-input disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select class</option>
                {availableClasses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.level ? `(${item.level})` : ""}
                  </option>
                ))}
              </select>

              {form.institutionId && availableClasses.length === 0 && (
                <p className="mt-2 text-xs text-amber-400">
                  No active classes are available for this institution.
                </p>
              )}
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Subject" required>
                <select
                  value={form.subject}
                  onChange={(event) =>
                    setForm({ ...form, subject: event.target.value })
                  }
                  required
                  className="form-input"
                >
                  <option value="">Select subject</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Topic">
                <input
                  value={form.topic}
                  onChange={(event) =>
                    setForm({ ...form, topic: event.target.value })
                  }
                  placeholder="e.g. Algebra"
                  className="form-input"
                />
              </FormField>
            </div>

            <FormField label="Instructions">
              <textarea
                value={form.instructions}
                onChange={(event) =>
                  setForm({ ...form, instructions: event.target.value })
                }
                rows={3}
                placeholder="Instructions students should follow..."
                className="form-input resize-none"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Questions" required>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={form.questionCount}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      questionCount: event.target.value,
                    })
                  }
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Duration (min)" required>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={form.durationMinutes}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      durationMinutes: event.target.value,
                    })
                  }
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Total marks" required>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.totalMarks}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      totalMarks: event.target.value,
                    })
                  }
                  required
                  className="form-input"
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Start date">
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm({ ...form, startDate: event.target.value })
                  }
                  className="form-input"
                />
              </FormField>

              <FormField label="Due date">
                <input
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm({ ...form, dueDate: event.target.value })
                  }
                  className="form-input"
                />
              </FormField>
            </div>

            <FormField label="Assignment status">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as AssignmentStatus,
                  })
                }
                className="form-input"
              >
                <option value="Draft">Save as Draft</option>
                <option value="Published">Publish Assignment</option>
                <option value="Closed">Closed</option>
              </select>
            </FormField>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                <Check size={16} />
                {editingAssignment ? "Save Changes" : "Save Assignment"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View assignment modal */}
      {selectedAssignment && (
        <Modal onClose={() => setSelectedAssignment(null)}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Assignment Details
              </p>
              <h2 className="mt-2 break-words text-xl font-bold">
                {selectedAssignment.title}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {selectedAssignment.subject}
                {selectedAssignment.topic
                  ? ` · ${selectedAssignment.topic}`
                  : ""}
              </p>
            </div>

            <StatusBadge status={selectedAssignment.status} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <DetailTile
              label="Questions"
              value={String(selectedAssignment.questionCount)}
              icon={FileText}
            />
            <DetailTile
              label="Duration"
              value={`${selectedAssignment.durationMinutes} min`}
              icon={Clock3}
            />
            <DetailTile
              label="Total marks"
              value={String(selectedAssignment.totalMarks)}
              icon={CheckCircle2}
            />
            <DetailTile
              label="Due date"
              value={formatDate(selectedAssignment.dueDate)}
              icon={CalendarDays}
            />
          </div>

          <div className="mt-4 space-y-3">
            <DetailRow
              icon={Building2}
              label="Institution"
              value={selectedAssignment.institutionName}
            />
            <DetailRow
              icon={Users}
              label="Class"
              value={selectedAssignment.className}
            />

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Instructions</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {selectedAssignment.instructions ||
                  "No instructions provided."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Schedule</p>
              <p className="mt-2 text-sm text-slate-300">
                Starts: {formatDate(selectedAssignment.startDate)}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Due: {formatDate(selectedAssignment.dueDate)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => openEditModal(selectedAssignment)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <Edit3 size={16} />
              Edit
            </button>

            {selectedAssignment.status !== "Published" && (
              <button
                onClick={() =>
                  changeStatus(selectedAssignment, "Published")
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20"
              >
                <Send size={16} />
                Publish
              </button>
            )}

            {selectedAssignment.status === "Published" && (
              <button
                onClick={() =>
                  changeStatus(selectedAssignment, "Closed")
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-400 hover:bg-amber-500/20"
              >
                <X size={16} />
                Close
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Delete this assignment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              You are about to delete{" "}
              <span className="font-semibold text-white">
                {deleteTarget.title}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500"
              >
                Delete Assignment
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        .filter-input {
          width: 100%;
          border: 1px solid rgb(51 65 85);
          border-radius: 0.75rem;
          background: rgb(2 6 23);
          padding: 0.8rem 0.9rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 150ms ease;
        }

        .filter-input:focus {
          border-color: rgb(99 102 241);
        }

        .filter-input::placeholder {
          color: rgb(100 116 139);
        }

        .filter-input option {
          background: rgb(2 6 23);
          color: white;
        }
      `}</style>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "indigo" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getAssignmentStatus(
        status || "Draft"
      )}`}
    >
      {status || "Draft"}
    </span>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
        danger
          ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
          : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
      <Icon size={17} className="shrink-0 text-slate-500" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function DetailTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <Icon size={17} className="text-indigo-400" />
      <p className="mt-3 text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function Feedback({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
        isSuccess
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/20 bg-red-500/10 text-red-300"
      }`}
    >
      <span className="flex items-center gap-2">
        {isSuccess ? <Check size={16} /> : <X size={16} />}
        {message}
      </span>
      <button onClick={onClose} aria-label="Dismiss message">
        <X size={16} />
      </button>
    </div>
  );
}

function SetupNotice({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
      <div className="flex items-start gap-3">
        <Building2 className="mt-1 shrink-0 text-amber-400" size={22} />
        <div>
          <h3 className="font-semibold text-amber-300">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
          <Link
            href={href}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {linkText}
            <ArrowLeft className="rotate-180" size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6">
        <div className="mb-2 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
