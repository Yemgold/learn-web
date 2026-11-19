



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "next/navigation";

import {
  Plus,
  Search,
  RefreshCw,
  BookOpen,
  BookMarked,
  Users,
  GraduationCap,
  X,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";

import Card, {
  CardHeader,
  CardContent,
} from "@/components/schools/ui/Card";

import StatusBadge from "@/components/schools/shared/StatusBadge";
import LoadingState from "@/components/schools/shared/LoadingState";

import {
  getSchoolSubjects,
  createSchoolSubject,
  updateSchoolSubjectStatus,
} from "@/lib/schools/portal/services/subject.service";

import type {
  SchoolSubject,
  CreateSchoolSubjectPayload,
} from "@/lib/schools/portal/services/subject.service";

/* =====================================================
   TYPES
===================================================== */

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

interface SubjectForm {
  subjectName: string;
  subjectCode: string;
}

type SubjectRecord = SchoolSubject & {
  subjectName: string;
  subjectCode: string;
};

type ApiSubject = {
  _id?: string;
  id?: string;
  subjectName?: string;
  subjectCode?: string;
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  classCount?: number;
  teacherCount?: number;
  [key: string]: unknown;
};

const PAGE_SIZE = 10;

/* =====================================================
   HELPERS
===================================================== */

function getSubjectId(subject: SchoolSubject): string {
  return subject._id ?? subject.id ?? "";
}

function getSubjectName(subject: SubjectRecord): string {
  return subject.subjectName || "Unnamed subject";
}

function getSubjectCode(subject: SubjectRecord): string {
  return subject.subjectCode || "";
}

function normalizeSubject(subject: ApiSubject): SubjectRecord {
  return {
    ...subject,
    subjectName: subject.subjectName ?? subject.name ?? "",
    subjectCode: subject.subjectCode ?? subject.code ?? "",
  } as SubjectRecord;
}

function isNotFoundError(error: unknown): boolean {
  if (typeof error === "string") {
    return (
      /^404\b/.test(error.trim()) ||
      /subjects? not found/i.test(error)
    );
  }

  if (!error || typeof error !== "object") {
    return false;
  }

  const err = error as {
    message?: string;
    status?: number;
    response?: {
      status?: number;
      data?: {
        status?: number;
        message?: string | string[];
      };
    };
  };

  const backendMessage = err.response?.data?.message;

  return (
    err.status === 404 ||
    err.response?.status === 404 ||
    err.response?.data?.status === 404 ||
    /^404\b/.test(err.message || "") ||
    /subjects? not found/i.test(err.message || "") ||
    (typeof backendMessage === "string" &&
      /subjects? not found/i.test(backendMessage)) ||
    (Array.isArray(backendMessage) &&
      backendMessage.some((message) =>
        /subjects? not found/i.test(message)
      ))
  );
}

function getFriendlyError(
  error: unknown,
  fallback: string
): string {
  if (isNotFoundError(error)) {
    return "";
  }

  if (error && typeof error === "object") {
    const err = error as {
      message?: string;
      response?: {
        data?: {
          message?: string | string[];
        };
      };
    };

    const backendMessage = err.response?.data?.message;

    if (typeof backendMessage === "string") {
      return backendMessage;
    }

    if (Array.isArray(backendMessage)) {
      return backendMessage.join(", ");
    }

    if (err.message) {
      return err.message;
    }
  }

  return fallback;
}

/* =====================================================
   MAIN PAGE
===================================================== */

export default function SchoolSubjectsPage() {
  const params = useParams<{ slug: string }>();

  const slug = String(params?.slug ?? "")
    .trim()
    .toLowerCase();

  /* =====================================================
     STATE
  ===================================================== */

  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [updatingSubjectId, setUpdatingSubjectId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [form, setForm] = useState<SubjectForm>({
    subjectName: "",
    subjectCode: "",
  });

  /* =====================================================
     FETCH SUBJECTS
  ===================================================== */

  const fetchSubjects = useCallback(async () => {
    if (!slug) {
      setSubjects([]);
      setError(
        "Unable to identify your school. Please access the correct school portal."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getSchoolSubjects(slug);

      const response = result as {
        subjectsObj?: unknown;
        subjects?: unknown;
        data?: {
          subjectsObj?: unknown;
          subjects?: unknown;
          data?: {
            subjectsObj?: unknown;
            subjects?: unknown;
          };
        };
      };

      const possibleLists = [
        response?.data?.subjectsObj,
        response?.data?.data?.subjectsObj,
        response?.subjectsObj,
        response?.subjects,
        response?.data?.subjects,
        response?.data?.data?.subjects,
      ];

      const rawSubjects = possibleLists.find(
        (item) => Array.isArray(item)
      ) as ApiSubject[] | undefined;

      const normalizedSubjects: SubjectRecord[] = (
        rawSubjects ?? []
      )
        .filter(
          (subject) =>
            subject &&
            typeof subject === "object"
        )
        .map(normalizeSubject);

      setSubjects(normalizedSubjects);
      setCurrentPage(1);
    } catch (err: unknown) {
      if (isNotFoundError(err)) {
        setSubjects([]);
        setError("");
        setCurrentPage(1);
        return;
      }

      setSubjects([]);

      setError(
        getFriendlyError(
          err,
          "We couldn't load your school's subjects. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  /* =====================================================
     INITIAL FETCH
  ===================================================== */

  useEffect(() => {
    void fetchSubjects();
  }, [fetchSubjects]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const activeSubjects = subjects.filter(
    (subject) => subject.isActive
  ).length;

  const inactiveSubjects =
    subjects.length - activeSubjects;

  const totalClasses = subjects.reduce(
    (total, subject) =>
      total + (subject.classCount ?? 0),
    0
  );

  /* =====================================================
     SEARCH AND FILTER
  ===================================================== */

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        getSubjectName(subject)
          .toLowerCase()
          .includes(searchValue) ||
        getSubjectCode(subject)
          .toLowerCase()
          .includes(searchValue) ||
        (subject.description ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && subject.isActive) ||
        (statusFilter === "INACTIVE" && !subject.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [subjects, search, statusFilter]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubjects.length / PAGE_SIZE)
  );

  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  /* =====================================================
     FORM HANDLERS
  ===================================================== */

  const handleFormChange = (
    field: keyof SubjectForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     CREATE SUBJECT
  ===================================================== */

  const handleCreateSubject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const subjectName = form.subjectName.trim();
    const subjectCode = form.subjectCode.trim();

    if (!subjectName) {
      setError("Please enter a subject name.");
      return;
    }

    if (subjectName.length > 100) {
      setError("Subject name cannot exceed 100 characters.");
      return;
    }

    if (!subjectCode) {
      setError("Please enter a subject code.");
      return;
    }

    if (subjectCode.length > 30) {
      setError("Subject code cannot exceed 30 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9 _-]+$/.test(subjectCode)) {
      setError(
        "Subject code can only contain letters, numbers, spaces, underscores and hyphens."
      );
      return;
    }

    if (!slug) {
      setError(
        "Unable to identify your school. Please refresh the page."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        subjectName,
        subjectCode,
      } as CreateSchoolSubjectPayload;

      await createSchoolSubject(payload, slug);

      setForm({
        subjectName: "",
        subjectCode: "",
      });

      setShowCreateForm(false);

      setSuccess("Subject created successfully.");

      await fetchSubjects();
    } catch (err: unknown) {
      setError(
        getFriendlyError(
          err,
          "We couldn't create this subject. Please check your details and try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     ACTIVATE / DEACTIVATE SUBJECT
  ===================================================== */

  const handleToggleStatus = async (
    subject: SubjectRecord
  ) => {
    const subjectId = getSubjectId(subject);

    if (!subjectId) {
      setError(
        "Unable to update this subject because its information is incomplete."
      );
      return;
    }

    if (!slug) {
      setError(
        "Unable to identify your school. Please refresh the page."
      );
      return;
    }

    const nextStatus = !subject.isActive;
    const subjectName = getSubjectName(subject);

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${subjectName}?`
        : `Deactivate ${subjectName}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingSubjectId(subjectId);
      setError("");
      setSuccess("");

      await updateSchoolSubjectStatus(
        subjectId,
        { isActive: nextStatus },
        slug
      );

      setSubjects((previous) =>
        previous.map((item) =>
          getSubjectId(item) === subjectId
            ? { ...item, isActive: nextStatus }
            : item
        )
      );

      setSuccess(
        nextStatus
          ? "Subject activated successfully."
          : "Subject deactivated successfully."
      );
    } catch (err: unknown) {
      setError(
        getFriendlyError(
          err,
          "We couldn't update this subject's status. Please try again."
        )
      );
    } finally {
      setUpdatingSubjectId("");
    }
  };

  /* =====================================================
     PAGE UI
  ===================================================== */

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* PAGE HEADING */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <GraduationCap size={17} />
            School Management
            <span>/</span>
            Subjects
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Subjects
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the academic subjects offered by your school.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => void fetchSubjects()}
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>

          <Button
            onClick={() => {
              setError("");
              setSuccess("");
              setShowCreateForm(true);
            }}
            leftIcon={<Plus size={17} />}
          >
            Add Subject
          </Button>
        </div>
      </div>

      {/* ERROR NOTIFICATION */}

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* SUCCESS NOTIFICATION */}

      {success && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          icon={<BookOpen size={21} />}
          color="blue"
        />

        <StatCard
          title="Active Subjects"
          value={activeSubjects}
          icon={<BookMarked size={21} />}
          color="green"
        />

        <StatCard
          title="Inactive Subjects"
          value={inactiveSubjects}
          icon={<GraduationCap size={21} />}
          color="orange"
        />

        <StatCard
          title="Class Assignments"
          value={totalClasses}
          icon={<Users size={21} />}
          color="purple"
        />
      </div>

      {/* CREATE SUBJECT FORM */}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Create New Subject
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a subject to your school's academic programme.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleCreateSubject}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="subjectName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Subject Name *
                  </label>

                  <input
                    id="subjectName"
                    type="text"
                    required
                    maxLength={100}
                    value={form.subjectName}
                    onChange={(event) =>
                      handleFormChange(
                        "subjectName",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Maximum 100 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="subjectCode"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Subject Code *
                  </label>

                  <input
                    id="subjectCode"
                    type="text"
                    required
                    maxLength={30}
                    value={form.subjectCode}
                    onChange={(event) =>
                      handleFormChange(
                        "subjectCode",
                        event.target.value
                      )
                    }
                    placeholder="e.g. MTH 101"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Letters, numbers, spaces, underscores and hyphens only.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={saving}
                  loadingText="Creating..."
                  leftIcon={<Plus size={16} />}
                >
                  Create Subject
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* SUBJECTS LIST */}

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-gray-900">
                All Subjects
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredSubjects.length} subject
                {filteredSubjects.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search subjects..."
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <LoadingState message="Loading subjects..." />
          ) : filteredSubjects.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <BookOpen size={28} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                {subjects.length === 0
                  ? "No subjects created yet"
                  : "No matching subjects"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {subjects.length === 0
                  ? "Create your first subject to start organizing your school's academic programme."
                  : "Try changing your search or status filter."}
              </p>

              {subjects.length === 0 && (
                <div className="mt-5">
                  <Button
                    onClick={() => {
                      setError("");
                      setShowCreateForm(true);
                    }}
                    leftIcon={<Plus size={16} />}
                  >
                    Create First Subject
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-4 font-medium">
                        Subject
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Subject Code
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Classes
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Teachers
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-4 py-4 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedSubjects.map((subject) => {
                      const subjectId = getSubjectId(subject);

                      return (
                        <tr
                          key={subjectId || getSubjectName(subject)}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <BookOpen size={20} />
                              </div>

                              <div>
                                <p className="font-medium text-gray-900">
                                  {getSubjectName(subject)}
                                </p>

                                {subject.description && (
                                  <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                    {subject.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {getSubjectCode(subject) || "—"}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {subject.classCount ?? 0}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {subject.teacherCount ?? 0}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={
                                subject.isActive
                                  ? "ACTIVE"
                                  : "INACTIVE"
                              }
                            />
                          </td>

                          <td className="px-4 py-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={
                                !subjectId ||
                                updatingSubjectId === subjectId
                              }
                              isLoading={
                                updatingSubjectId === subjectId
                              }
                              onClick={() =>
                                void handleToggleStatus(subject)
                              }
                              leftIcon={<Power size={14} />}
                            >
                              {subject.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="space-y-3 md:hidden">
                {paginatedSubjects.map((subject) => {
                  const subjectId = getSubjectId(subject);

                  return (
                    <div
                      key={subjectId || getSubjectName(subject)}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <BookOpen size={20} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {getSubjectName(subject)}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Code: {getSubjectCode(subject) || "—"}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={
                            subject.isActive
                              ? "ACTIVE"
                              : "INACTIVE"
                          }
                        />
                      </div>

                      {subject.description && (
                        <p className="mt-3 text-sm text-gray-500">
                          {subject.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>
                            {subject.classCount ?? 0} Classes
                          </span>

                          <span>
                            {subject.teacherCount ?? 0} Teachers
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            !subjectId ||
                            updatingSubjectId === subjectId
                          }
                          isLoading={
                            updatingSubjectId === subjectId
                          }
                          onClick={() =>
                            void handleToggleStatus(subject)
                          }
                        >
                          {subject.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}

              <div className="mt-6 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                  {Math.min(
                    currentPage * PAGE_SIZE,
                    filteredSubjects.length
                  )}{" "}
                  of {filteredSubjects.length} subjects
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
                    }
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="px-3 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* =====================================================
   STATISTICS CARD
===================================================== */

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "orange" | "purple";
}

function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">
              {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {value}
            </p>
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClasses[color]}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
