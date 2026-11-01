




"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Edit3,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

const INSTITUTIONS_KEY = "learnyfi-school-centres-institutions";
const CLASSES_KEY = "learnyfi-school-centres-classes";

type Institution = {
  id: string;
  name: string;
  type?: string;
  status?: string;
};

type SchoolClass = {
  id: string;
  name: string;
  level: string;
  institutionId: string;
  institutionName: string;
  description: string;
  studentCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt?: string;
};

const LEVELS = [
  "Creche",
  "Nursery 1",
  "Nursery 2",
  "Nursery 3",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  level: "JSS 1",
  institutionId: "",
  description: "",
  status: "Active" as "Active" | "Inactive",
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveClasses(classes: SchoolClass[]) {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SchoolClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(() => {
    setLoading(true);

    const storedClasses = readStorage<unknown>(CLASSES_KEY, []);
    const storedInstitutions = readStorage<unknown>(
      INSTITUTIONS_KEY,
      []
    );

    setClasses(
      Array.isArray(storedClasses)
        ? (storedClasses as SchoolClass[])
        : []
    );

    setInstitutions(
      Array.isArray(storedInstitutions)
        ? (storedInstitutions as Institution[])
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

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return classes.filter((item) => {
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.level?.toLowerCase().includes(query) ||
        item.institutionName?.toLowerCase().includes(query);

      const matchesInstitution =
        institutionFilter === "all" ||
        item.institutionId === institutionFilter;

      const matchesLevel =
        levelFilter === "all" || item.level === levelFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesLevel &&
        matchesStatus
      );
    });
  }, [classes, search, institutionFilter, levelFilter, statusFilter]);

  const activeCount = classes.filter(
    (item) => item.status === "Active"
  ).length;

  const totalStudents = classes.reduce(
    (total, item) => total + (Number(item.studentCount) || 0),
    0
  );

  const openCreateModal = () => {
    setEditingClass(null);
    setForm({
      ...EMPTY_FORM,
      institutionId: institutions[0]?.id || "",
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item: SchoolClass) => {
    setEditingClass(item);
    setForm({
      name: item.name || "",
      level: item.level || "JSS 1",
      institutionId: item.institutionId || "",
      description: item.description || "",
      status: item.status || "Active",
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClass(null);
    setError("");
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Enter a class name.");
      return;
    }

    if (!form.institutionId) {
      setError("Select an institution for this class.");
      return;
    }

    const institution = institutions.find(
      (item) => item.id === form.institutionId
    );

    if (!institution) {
      setError("The selected institution could not be found.");
      return;
    }

    const duplicate = classes.some(
      (item) =>
        item.id !== editingClass?.id &&
        item.institutionId === form.institutionId &&
        item.name.trim().toLowerCase() ===
          form.name.trim().toLowerCase()
    );

    if (duplicate) {
      setError(
        "A class with this name already exists for this institution."
      );
      return;
    }

    const now = new Date().toISOString();

    let updatedClasses: SchoolClass[];

    if (editingClass) {
      updatedClasses = classes.map((item) =>
        item.id === editingClass.id
          ? {
              ...item,
              name: form.name.trim(),
              level: form.level,
              institutionId: institution.id,
              institutionName: institution.name,
              description: form.description.trim(),
              status: form.status,
              updatedAt: now,
            }
          : item
      );
    } else {
      const newClass: SchoolClass = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        level: form.level,
        institutionId: institution.id,
        institutionName: institution.name,
        description: form.description.trim(),
        studentCount: 0,
        status: form.status,
        createdAt: now,
      };

      updatedClasses = [newClass, ...classes];
    }

    try {
      saveClasses(updatedClasses);
      setClasses(updatedClasses);
      closeModal();
      setSuccess(
        editingClass
          ? "Class updated successfully."
          : "Class created successfully."
      );
    } catch {
      setError("Unable to save this class in browser storage.");
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const updatedClasses = classes.filter(
      (item) => item.id !== deleteTarget.id
    );

    try {
      saveClasses(updatedClasses);
      setClasses(updatedClasses);
      setDeleteTarget(null);
      setSelectedClass(null);
      setSuccess("Class deleted successfully.");
    } catch {
      setSuccess("");
      setError("Unable to delete this class.");
    }
  };

const toggleStatus = (item: SchoolClass) => {
  const nextStatus: SchoolClass["status"] =
    item.status === "Active" ? "Inactive" : "Active";

  const updatedClasses: SchoolClass[] = classes.map((record) =>
    record.id === item.id
      ? {
          ...record,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        }
      : record
  );

  try {
    saveClasses(updatedClasses);
    setClasses(updatedClasses);
    setSelectedClass(null);

    setSuccess(
      nextStatus === "Inactive"
        ? "Class deactivated."
        : "Class activated."
    );
  } catch {
    setError("Unable to update the class status.");
  }
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
              Classes Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Create and manage classes across registered institutions.
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
              disabled={institutions.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              Create Class
            </button>
          </div>
        </div>

        {/* Feedback */}
        {success && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <span className="flex items-center gap-2">
              <Check size={16} />
              {success}
            </span>
            <button onClick={() => setSuccess("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {error && !modalOpen && (
          <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Classes"
            value={classes.length}
            icon={BookOpen}
            color="indigo"
          />
          <StatCard
            title="Active Classes"
            value={activeCount}
            icon={GraduationCap}
            color="emerald"
          />
          <StatCard
            title="Institutions"
            value={institutions.length}
            icon={Building2}
            color="violet"
          />
          <StatCard
            title="Students in Classes"
            value={totalStudents}
            icon={Users}
            color="cyan"
          />
        </div>

        {/* No institutions warning */}
        {!loading && institutions.length === 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Building2 className="mt-1 text-amber-400" size={22} />
              <div>
                <h3 className="font-semibold text-amber-300">
                  No institutions registered yet
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Register a school or study centre before creating its
                  classes.
                </p>
                <Link
                  href="/admin/school-centres/institutions/register"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Register an institution
                  <ChevronDown className="rotate-[-90deg]" size={15} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search classes..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            <select
              value={institutionFilter}
              onChange={(event) => setInstitutionFilter(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="all">All institutions</option>
              {institutions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(event) => setLevelFilter(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="all">All levels</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {filteredClasses.length} of {classes.length} classes
            </span>

            <button
              onClick={() => {
                setSearch("");
                setInstitutionFilter("all");
                setLevelFilter("all");
                setStatusFilter("all");
              }}
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Classes list */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-col gap-2 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">All Classes</h2>
              <p className="mt-1 text-xs text-slate-500">
                Classes created for registered institutions.
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {filteredClasses.length} result(s)
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-400">
              <RefreshCw className="animate-spin" size={18} />
              Loading classes...
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                <BookOpen size={28} />
              </div>

              <h3 className="mt-5 font-semibold">No classes found</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {classes.length === 0
                  ? "Create your first class to organise students and practice activities by level."
                  : "Try changing your search or filters to find a class."}
              </p>

              {classes.length === 0 && institutions.length > 0 && (
                <button
                  onClick={openCreateModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  <Plus size={17} />
                  Create your first class
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
                      <th className="px-5 py-4 font-semibold">Class</th>
                      <th className="px-5 py-4 font-semibold">Institution</th>
                      <th className="px-5 py-4 font-semibold">Students</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Created</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {filteredClasses.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedClass(item)}
                            className="text-left"
                          >
                            <p className="font-semibold text-slate-200 hover:text-indigo-400">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.level}
                            </p>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-300">
                            {item.institutionName}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {Number(item.studentCount) || 0}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              title="View class"
                              onClick={() => setSelectedClass(item)}
                            >
                              <BookOpen size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Edit class"
                              onClick={() => openEditModal(item)}
                            >
                              <Edit3 size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Delete class"
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
                {filteredClasses.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.level}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                      <Building2 size={14} />
                      {item.institutionName}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {Number(item.studentCount) || 0} students
                      </span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-800 pt-3">
                      <button
                        onClick={() => setSelectedClass(item)}
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
                        title="Delete class"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-600">
          Class records are currently stored in this browser only. They are
          not yet synchronized with institution accounts or student devices.
        </p>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal onClose={closeModal}>
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {editingClass ? "Edit Class" : "Create New Class"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {editingClass
                ? "Update the class information below."
                : "Add a class to a registered institution."}
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Institution" required>
              <select
                value={form.institutionId}
                onChange={(event) =>
                  setForm({
                    ...form,
                    institutionId: event.target.value,
                  })
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

            <FormField label="Class name" required>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="e.g. Science Class A"
                required
                className="form-input"
              />
            </FormField>

            <FormField label="Class level" required>
              <select
                value={form.level}
                onChange={(event) =>
                  setForm({ ...form, level: event.target.value })
                }
                required
                className="form-input"
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                rows={3}
                placeholder="Optional description of this class..."
                className="form-input resize-none"
              />
            </FormField>

            <FormField label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as "Active" | "Inactive",
                  })
                }
                className="form-input"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                {editingClass ? "Save Changes" : "Create Class"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View modal */}
      {selectedClass && (
        <Modal onClose={() => setSelectedClass(null)}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Class Details
              </p>
              <h2 className="mt-2 text-xl font-bold">
                {selectedClass.name}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {selectedClass.level}
              </p>
            </div>
            <StatusBadge status={selectedClass.status} />
          </div>

          <div className="mt-6 space-y-3">
            <DetailRow
              icon={Building2}
              label="Institution"
              value={selectedClass.institutionName}
            />
            <DetailRow
              icon={Users}
              label="Students"
              value={String(selectedClass.studentCount || 0)}
            />
            <DetailRow
              icon={CalendarDays}
              label="Created"
              value={formatDate(selectedClass.createdAt)}
            />
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Description</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {selectedClass.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => openEditModal(selectedClass)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <Edit3 size={16} />
              Edit Class
            </button>

            <button
              onClick={() => toggleStatus(selectedClass)}
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              {selectedClass.status === "Active"
                ? "Deactivate"
                : "Activate"}
            </button>
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

            <h2 className="mt-4 text-lg font-bold">Delete this class?</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              You are about to delete{" "}
              <span className="font-semibold text-white">
                {deleteTarget.name}
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
                Delete Class
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        .form-input {
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

        .form-input:focus {
          border-color: rgb(99 102 241);
        }

        .form-input::placeholder {
          color: rgb(100 116 139);
        }

        .form-input option {
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
  color: "indigo" | "emerald" | "violet" | "cyan";
}) {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    violet: "bg-violet-500/10 text-violet-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        active
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-slate-700 bg-slate-800 text-slate-400"
      }`}
    >
      {status || "Inactive"}
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
      <div className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6">
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
