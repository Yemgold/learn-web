






"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";

import { useParams } from "next/navigation";

import {
  Plus,
  Search,
  RefreshCw,
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  X,
  Power,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Hash,
  CheckSquare,
  Square,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import StatusBadge from "@/components/schools/shared/StatusBadge";
import LoadingState from "@/components/schools/shared/LoadingState";

import StatCard from "@/components/schools/classes/StatCard";

import {
  ClassSubjectsButton,
  ClassSubjectsDialog,
} from "@/components/schools/classes/ClassSubjects";

import { useAuthStore } from "@/stores/auth.store";

import {
  getSchoolClasses,
  getSchoolClassById,
  createSchoolClass,
  updateSchoolClass,
  updateSchoolClassStatus,
  addSubjectsToClass,
  removeSubjectsFromClass,
} from "@/lib/schools/portal/services/class.service";

import type {
  SchoolClass,
  CreateSchoolClassPayload,
  UpdateSchoolClassPayload,
} from "@/lib/schools/portal/services/class.service";

import { getSchoolSubjects } from "@/lib/schools/portal/services/subject.service";

import type {
  SchoolSubject,
} from "@/lib/schools/portal/services/subject.service";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

const PAGE_SIZE = 10;

const EMPTY_FORM: CreateSchoolClassPayload = {
  name: "",
  arm: "",
  subjectIds: [],
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function getClassId(schoolClass: SchoolClass): string {
  return String(
    schoolClass._id ??
      schoolClass.id ??
      schoolClass.classId ??
      ""
  );
}

function getClassName(schoolClass: SchoolClass): string {
  return String(schoolClass.name ?? "");
}

function getClassCode(schoolClass: SchoolClass): string {
  return String(
    schoolClass.classCode ??
      schoolClass.arm ??
      "—"
  );
}

function getSubjectId(subject: SchoolSubject): string {
  return String(subject._id ?? subject.id ?? "");
}

function getClassSubjectIds(schoolClass: SchoolClass): string[] {
  if (!Array.isArray(schoolClass.subjects)) {
    return [];
  }

  return [
    ...new Set(
      schoolClass.subjects
        .map((subject) => {
          if (typeof subject === "string") {
            return subject.trim();
          }

          if (subject && typeof subject === "object") {
            const populatedSubject = subject as {
              _id?: string;
              id?: string;
            };

            return String(
              populatedSubject._id ??
                populatedSubject.id ??
                ""
            ).trim();
          }

          return "";
        })
        .filter(Boolean)
    ),
  ];
}

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    return (
      apiError.response?.data?.message ??
      apiError.message ??
      fallback
    );
  }

  return fallback;
}

function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const apiError = error as {
    status?: number;
    response?: {
      status?: number;
      data?: {
        status?: number;
      };
    };
  };

  return (
    apiError.response?.status ??
    apiError.response?.data?.status ??
    apiError.status
  );
}

// --------------------------------------------------
// MAIN PAGE
// --------------------------------------------------

export default function SchoolClassesPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const user = useAuthStore((state) => state.user);

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<SchoolSubject[]>([]);

  const [loading, setLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);

  const [editingClass, setEditingClass] =
    useState<SchoolClass | null>(null);

  const [updatingClassId, setUpdatingClassId] = useState("");

  const [viewingSubjectsClass, setViewingSubjectsClass] =
    useState<SchoolClass | null>(null);

  const [form, setForm] =
    useState<CreateSchoolClassPayload>({ ...EMPTY_FORM });

  // --------------------------------------------------
  // FETCH CLASSES
  // --------------------------------------------------

  const fetchClasses = useCallback(async () => {
    if (!schoolSubdomain) {
      setLoading(false);
      setClasses([]);
      setError("School subdomain could not be determined.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSchoolClasses(schoolSubdomain);

      setClasses(
        Array.isArray(response?.classes)
          ? response.classes
          : []
      );
    } catch (err) {
      const status = getHttpStatus(err);

      if (status === 404) {
        setClasses([]);
        setError("");
        return;
      }

      setError(
        getErrorMessage(
          err,
          "Unable to load school classes."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [schoolSubdomain]);

  // --------------------------------------------------
  // FETCH SUBJECTS
  // --------------------------------------------------

  const fetchSubjects = useCallback(async () => {
    if (!schoolSubdomain) {
      setSubjects([]);
      setSubjectsLoading(false);
      return;
    }

    try {
      setSubjectsLoading(true);

      const response = await getSchoolSubjects(schoolSubdomain);

      setSubjects(
        Array.isArray(response?.subjects)
          ? response.subjects.filter(
              (subject) => subject.isActive
            )
          : []
      );
    } catch (err) {
      setSubjects([]);

      setError(
        getErrorMessage(
          err,
          "Unable to load school subjects."
        )
      );
    } finally {
      setSubjectsLoading(false);
    }
  }, [schoolSubdomain]);

  useEffect(() => {
    void fetchClasses();
    void fetchSubjects();
  }, [fetchClasses, fetchSubjects]);

  // --------------------------------------------------
  // SUBJECT LOOKUP
  // --------------------------------------------------

  const subjectMap = useMemo(() => {
    const map = new Map<string, SchoolSubject>();

    subjects.forEach((subject) => {
      const subjectId = getSubjectId(subject);

      if (subjectId) {
        map.set(subjectId, subject);
      }
    });

    return map;
  }, [subjects]);

  const getSubjectNames = useCallback(
    (subjectIds: string[]) => {
      if (subjectIds.length === 0) {
        return "No subjects assigned";
      }

      return subjectIds
        .map(
          (subjectId) =>
            subjectMap.get(subjectId)?.subjectName ??
            "Subject unavailable"
        )
        .join(", ");
    },
    [subjectMap]
  );

  // --------------------------------------------------
  // SUBJECT SELECTION
  // --------------------------------------------------

  const toggleSubject = (subjectId: string) => {
    setForm((previous) => {
      const currentIds = previous.subjectIds ?? [];

      const alreadySelected = currentIds.includes(subjectId);

      return {
        ...previous,
        subjectIds: alreadySelected
          ? currentIds.filter((id) => id !== subjectId)
          : [...currentIds, subjectId],
      };
    });
  };

  const selectAllSubjects = () => {
    const allSubjectIds = subjects
      .map(getSubjectId)
      .filter(Boolean);

    setForm((previous) => ({
      ...previous,
      subjectIds: [...new Set(allSubjectIds)],
    }));
  };

  const clearSubjectSelection = () => {
    setForm((previous) => ({
      ...previous,
      subjectIds: [],
    }));
  };

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const activeClasses = useMemo(
    () =>
      classes.filter((item) => Boolean(item.isActive)).length,
    [classes]
  );

  const inactiveClasses = classes.length - activeClasses;

  const totalStudents = useMemo(
    () =>
      classes.reduce(
        (total, item) =>
          total + (Number(item.studentCount) || 0),
        0
      ),
    [classes]
  );

  // --------------------------------------------------
  // SEARCH AND FILTER
  // --------------------------------------------------

  const filteredClasses = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return classes.filter((schoolClass) => {
      const name = getClassName(schoolClass).toLowerCase();
      const code = getClassCode(schoolClass).toLowerCase();

      const subjectName = getSubjectNames(
        getClassSubjectIds(schoolClass)
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        code.includes(searchValue) ||
        subjectName.includes(searchValue);

      const isActive = Boolean(schoolClass.isActive);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "INACTIVE" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [classes, search, statusFilter, getSubjectNames]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClasses.length / PAGE_SIZE)
  );

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // --------------------------------------------------
  // FORM HANDLERS
  // --------------------------------------------------

  const openCreateForm = () => {
    setEditingClass(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (schoolClass: SchoolClass) => {
    setEditingClass(schoolClass);

    setForm({
      name: getClassName(schoolClass),
      arm:
        getClassCode(schoolClass) === "—"
          ? ""
          : getClassCode(schoolClass),
      subjectIds: getClassSubjectIds(schoolClass),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingClass(null);
    setForm({ ...EMPTY_FORM });
  };

  // --------------------------------------------------
  // CREATE / UPDATE CLASS
  // --------------------------------------------------


const handleSubmit = async (event: FormSubmitEvent) => {
  event.preventDefault();

  const name = String(form.name ?? "").trim();
  const arm = String(form.arm ?? "").trim();

  const subjectIds = [
    ...new Set(
      (form.subjectIds ?? [])
        .map((id) => String(id).trim())
        .filter(Boolean)
    ),
  ];

  if (!schoolSubdomain) {
    setError("School subdomain could not be determined.");
    return;
  }

  if (!name) {
    setError("Please enter a class name.");
    return;
  }

  if (!arm) {
    setError("Please enter a class code.");
    return;
  }

  if (subjectIds.length === 0) {
    setError("Please select at least one subject for this class.");
    return;
  }

  try {
    setSaving(true);
    setError("");
    setSuccess("");

    if (editingClass) {
      const classId = getClassId(editingClass);

      if (!classId) {
        throw new Error("This class does not have a valid ID.");
      }

      // 1. Fetch the latest class directly from the backend.
      const latestClass = await getSchoolClassById(
        classId,
        schoolSubdomain
      );

      // 2. Read the subjects currently assigned to the class.
      const previousSubjectIds = getClassSubjectIds(latestClass);

      // 3. Compare the latest backend subjects with the new selection.
      const subjectsToAdd = subjectIds.filter(
        (id) => !previousSubjectIds.includes(id)
      );

      const subjectsToRemove = previousSubjectIds.filter(
        (id) => !subjectIds.includes(id)
      );

      console.log("[CLASS SUBJECT UPDATE]", {
        classId,
        previousSubjectIds,
        selectedSubjectIds: subjectIds,
        subjectsToAdd,
        subjectsToRemove,
      });

      // 4. Update class name and code.
      const payload: UpdateSchoolClassPayload = {
        name,
        arm,
      };

      await updateSchoolClass(
        classId,
        payload,
        schoolSubdomain
      );

      // 5. Add only newly selected subjects.
      if (subjectsToAdd.length > 0) {
        await addSubjectsToClass(
          classId,
          { subjects: subjectsToAdd },
          schoolSubdomain
        );
      }

      // 6. Remove only subjects confirmed to be assigned.
      if (subjectsToRemove.length > 0) {
        await removeSubjectsFromClass(
          classId,
          { subjects: subjectsToRemove },
          schoolSubdomain
        );
      }

      setSuccess(
        "Class and subject assignments updated successfully."
      );
    } else {
      // Create a new class with its initial subjects.
      const payload: CreateSchoolClassPayload = {
        name,
        arm,
        subjectIds,
      };

      await createSchoolClass(payload, schoolSubdomain);

      setSuccess("Class created successfully.");
    }

    setForm({ ...EMPTY_FORM });
    setShowForm(false);
    setEditingClass(null);

    await fetchClasses();
  } catch (err) {
    console.error("[SAVE CLASS ERROR]", err);

    setError(
      getErrorMessage(
        err,
        editingClass
          ? "Unable to update class or its subject assignments."
          : "Unable to create class."
      )
    );
  } finally {
    setSaving(false);
  }
};


  // --------------------------------------------------
  // ACTIVATE / DEACTIVATE CLASS
  // --------------------------------------------------

  const handleToggleStatus = async (
    schoolClass: SchoolClass
  ) => {
    const classId = getClassId(schoolClass);

    if (!classId) {
      setError("This class does not have a valid ID.");
      return;
    }

    if (!schoolSubdomain) {
      setError("School subdomain could not be determined.");
      return;
    }

    const nextStatus = !schoolClass.isActive;

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${getClassName(schoolClass)} (${getClassCode(schoolClass)})?`
        : `Deactivate ${getClassName(schoolClass)} (${getClassCode(schoolClass)})? Historical records will be preserved.`
    );

    if (!confirmed) return;

    try {
      setUpdatingClassId(classId);
      setError("");
      setSuccess("");

      await updateSchoolClassStatus(
        classId,
        { isActive: nextStatus },
        schoolSubdomain
      );

      setClasses((previous) =>
        previous.map((item) =>
          getClassId(item) === classId
            ? { ...item, isActive: nextStatus }
            : item
        )
      );

      setSuccess(
        nextStatus
          ? "Class activated successfully."
          : "Class deactivated successfully."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to update class status."
        )
      );
    } finally {
      setUpdatingClassId("");
    }
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* PAGE HEADING */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <GraduationCap size={17} />
            School Management
            <span>/</span>
            Classes
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Classes
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create, manage and organize your school's classes and subjects.
          </p>

          {schoolSubdomain && (
            <p className="mt-1 text-xs text-gray-400">
              School: {schoolSubdomain}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              void fetchClasses();
              void fetchSubjects();
            }}
            disabled={loading || subjectsLoading}
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>

          <Button
            onClick={openCreateForm}
            leftIcon={<Plus size={17} />}
          >
            Add Class
          </Button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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

      {/* SUCCESS */}

      {success && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
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
          title="Total Classes"
          value={classes.length}
          icon={<Layers size={21} />}
          color="blue"
        />

        <StatCard
          title="Active Classes"
          value={activeClasses}
          icon={<BookOpen size={21} />}
          color="green"
        />

        <StatCard
          title="Inactive Classes"
          value={inactiveClasses}
          icon={<GraduationCap size={21} />}
          color="orange"
        />

        <StatCard
          title="Students in Classes"
          value={totalStudents.toLocaleString()}
          icon={<Users size={21} />}
          color="purple"
        />
      </div>

      {/* CREATE / EDIT FORM */}

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-gray-900">
                  {editingClass
                    ? "Edit Class"
                    : "Create New Class"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingClass
                    ? "Update the class information and assigned subjects."
                    : "Add a new class and assign one or more subjects."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* CLASS NAME */}

                <div>
                  <label
                    htmlFor="className"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Class Name *
                  </label>

                  <div className="relative">
                    <GraduationCap
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="className"
                      type="text"
                      required
                      maxLength={100}
                      value={form.name ?? ""}
                      onChange={(event) => {
                        const value = event.currentTarget.value;

                        setForm((previous) => ({
                          ...previous,
                          name: value,
                        }));
                      }}
                      placeholder="e.g. JSS 1"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* CLASS CODE */}

                <div>
                  <label
                    htmlFor="classCode"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Class Code *
                  </label>

                  <div className="relative">
                    <Hash
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="classCode"
                      type="text"
                      required
                      maxLength={50}
                      value={form.arm ?? ""}
                      onChange={(event) => {
                        const value = event.currentTarget.value;

                        setForm((previous) => ({
                          ...previous,
                          arm: value,
                        }));
                      }}
                      placeholder="e.g. JSS 1A"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* MULTIPLE SUBJECTS */}

              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Assign Subjects *
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                      Select all subjects that belong to this class.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllSubjects}
                      disabled={
                        subjectsLoading ||
                        saving ||
                        subjects.length === 0
                      }
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Select all
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                      type="button"
                      onClick={clearSubjectSelection}
                      disabled={
                        saving ||
                        (form.subjectIds ?? []).length === 0
                      }
                      className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  {subjectsLoading ? (
                    <p className="text-sm text-gray-500">
                      Loading subjects...
                    </p>
                  ) : subjects.length === 0 ? (
                    <p className="text-sm text-red-600">
                      No active subjects found. Create or activate a subject before assigning one to this class.
                    </p>
                  ) : (
                    <>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {subjects.length} available subjects
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {(form.subjectIds ?? []).length} selected
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => {
                          const subjectId = getSubjectId(subject);

                          if (!subjectId) return null;

                          const isSelected = (
                            form.subjectIds ?? []
                          ).includes(subjectId);

                          return (
                            <label
                              key={subjectId}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                isSelected
                                  ? "border-blue-300 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={saving}
                                onChange={() =>
                                  toggleSubject(subjectId)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />

                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-medium text-gray-800">
                                  {subject.subjectName}
                                </span>

                                {subject.subjectCode && (
                                  <span className="mt-0.5 block text-xs text-gray-500">
                                    {subject.subjectCode}
                                  </span>
                                )}
                              </span>

                              {isSelected ? (
                                <CheckSquare
                                  size={17}
                                  className="shrink-0 text-blue-600"
                                />
                              ) : (
                                <Square
                                  size={17}
                                  className="shrink-0 text-gray-300"
                                />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  At least one subject must be selected. You can assign multiple subjects to the same class.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                Example: Class Name: JSS 1, Class Code: JSS 1A, Subjects: Mathematics, English Language, Basic Science.
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={closeForm}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={saving}
                  disabled={
                    saving ||
                    subjectsLoading ||
                    subjects.length === 0 ||
                    (form.subjectIds ?? []).length === 0
                  }
                  leftIcon={
                    editingClass
                      ? <Pencil size={16} />
                      : <Plus size={16} />
                  }
                >
                  {editingClass
                    ? "Save Changes"
                    : "Create Class"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* CLASSES LIST */}

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-gray-900">
                All Classes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredClasses.length} class
                {filteredClasses.length === 1 ? "" : "es"} found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* SEARCH */}

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.currentTarget.value);
                  }}
                  placeholder="Search classes or subjects..."
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 sm:w-64"
                />
              </div>

              {/* STATUS FILTER */}

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.currentTarget.value as StatusFilter
                  );
                }}
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
            <LoadingState message="Loading classes..." />
          ) : filteredClasses.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <GraduationCap size={28} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                {classes.length === 0
                  ? "No classes created yet"
                  : "No matching classes"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {classes.length === 0
                  ? "Create your first class to start organizing students."
                  : "Try changing your search or status filter."}
              </p>

              {classes.length === 0 && (
                <div className="mt-5">
                  <Button
                    onClick={openCreateForm}
                    leftIcon={<Plus size={16} />}
                  >
                    Create First Class
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
                        Class Name
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Class Code
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Subjects
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Students
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-4 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedClasses.map((schoolClass) => {
                      const classId = getClassId(schoolClass);
                      const isActive = Boolean(schoolClass.isActive);

                      return (
                        <tr
                          key={
                            classId ||
                            `${getClassName(schoolClass)}-${getClassCode(schoolClass)}`
                          }
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <GraduationCap size={20} />
                              </div>

                              <span className="font-medium text-gray-900">
                                {getClassName(schoolClass)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                              {getClassCode(schoolClass)}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <ClassSubjectsButton
                              count={getClassSubjectIds(schoolClass).length}
                              onClick={() => setViewingSubjectsClass(schoolClass)}
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users size={16} />
                              {(Number(schoolClass.studentCount) || 0).toLocaleString()}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={isActive ? "ACTIVE" : "INACTIVE"}
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!classId}
                                onClick={() => openEditForm(schoolClass)}
                                leftIcon={<Pencil size={14} />}
                              >
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                color={isActive ? "danger" : "success"}
                                disabled={
                                  !classId ||
                                  updatingClassId === classId
                                }
                                isLoading={
                                  updatingClassId === classId
                                }
                                onClick={() =>
                                  void handleToggleStatus(schoolClass)
                                }
                                leftIcon={<Power size={14} />}
                              >
                                {isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="space-y-3 md:hidden">
                {paginatedClasses.map((schoolClass) => {
                  const classId = getClassId(schoolClass);
                  const isActive = Boolean(schoolClass.isActive);

                  return (
                    <div
                      key={
                        classId ||
                        `${getClassName(schoolClass)}-${getClassCode(schoolClass)}`
                      }
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <GraduationCap size={20} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-gray-900">
                              {getClassName(schoolClass)}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Code: {getClassCode(schoolClass)}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={isActive ? "ACTIVE" : "INACTIVE"}
                        />
                      </div>

                      <div className="mt-3">
                        <ClassSubjectsButton
                          count={getClassSubjectIds(schoolClass).length}
                          onClick={() => setViewingSubjectsClass(schoolClass)}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} />
                          {(Number(schoolClass.studentCount) || 0).toLocaleString()} Students
                        </span>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!classId}
                            onClick={() => openEditForm(schoolClass)}
                            leftIcon={<Pencil size={14} />}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            color={isActive ? "danger" : "success"}
                            disabled={
                              !classId ||
                              updatingClassId === classId
                            }
                            isLoading={
                              updatingClassId === classId
                            }
                            onClick={() =>
                              void handleToggleStatus(schoolClass)
                            }
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
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
                    filteredClasses.length
                  )}{" "}
                  of {filteredClasses.length} classes
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

      <ClassSubjectsDialog
        open={Boolean(viewingSubjectsClass)}
        className={viewingSubjectsClass ? getClassName(viewingSubjectsClass) : ""}
        classCode={viewingSubjectsClass ? getClassCode(viewingSubjectsClass) : ""}
        subjects={
          viewingSubjectsClass
            ? getClassSubjectIds(viewingSubjectsClass).map((subjectId) => ({
                id: subjectId,
                name: subjectMap.get(subjectId)?.subjectName ?? "Subject unavailable",
                code: subjectMap.get(subjectId)?.subjectCode,
              }))
            : []
        }
        onClose={() => setViewingSubjectsClass(null)}
      />
    </div>
  );
}

















// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   type ComponentProps,
//   type ReactNode,
// } from "react";

// import { useParams } from "next/navigation";

// import {
//   Plus,
//   Search,
//   RefreshCw,
//   GraduationCap,
//   Users,
//   BookOpen,
//   Layers,
//   X,
//   Power,
//   ChevronLeft,
//   ChevronRight,
//   Pencil,
//   Hash,
//   BookMarked,
//   CheckSquare,
//   Square,
// } from "lucide-react";

// import Button from "@/components/schools/ui/Button";
// import Card, {
//   CardContent,
//   CardHeader,
// } from "@/components/schools/ui/Card";

// import StatusBadge from "@/components/schools/shared/StatusBadge";
// import LoadingState from "@/components/schools/shared/LoadingState";

// import { useAuthStore } from "@/stores/auth.store";

// import {
//   getSchoolClasses,
//   createSchoolClass,
//   updateSchoolClass,
//   updateSchoolClassStatus,
//   addSubjectsToClass,
//   removeSubjectsFromClass,
// } from "@/lib/schools/portal/services/class.service";

// import type {
//   SchoolClass,
//   CreateSchoolClassPayload,
//   UpdateSchoolClassPayload,
// } from "@/lib/schools/portal/services/class.service";

// import { getSchoolSubjects } from "@/lib/schools/portal/services/subject.service";

// import type {
//   SchoolSubject,
// } from "@/lib/schools/portal/services/subject.service";

// type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

// type FormSubmitEvent = Parameters<
//   NonNullable<ComponentProps<"form">["onSubmit"]>
// >[0];

// const PAGE_SIZE = 10;

// const EMPTY_FORM: CreateSchoolClassPayload = {
//   name: "",
//   arm: "",
//   subjectIds: [],
// };

// // --------------------------------------------------
// // HELPERS
// // --------------------------------------------------

// function getClassId(schoolClass: SchoolClass): string {
//   return String(
//     schoolClass._id ??
//       schoolClass.id ??
//       schoolClass.classId ??
//       ""
//   );
// }

// function getClassName(schoolClass: SchoolClass): string {
//   return String(schoolClass.name ?? "");
// }

// function getClassCode(schoolClass: SchoolClass): string {
//   return String(
//     schoolClass.classCode ??
//       schoolClass.arm ??
//       "—"
//   );
// }

// function getSubjectId(subject: SchoolSubject): string {
//   return String(subject._id ?? subject.id ?? "");
// }

// function getClassSubjectIds(schoolClass: SchoolClass): string[] {
//   if (!Array.isArray(schoolClass.subjects)) {
//     return [];
//   }

//   return [
//     ...new Set(
//       schoolClass.subjects
//         .map((subject) => {
//           if (typeof subject === "string") {
//             return subject.trim();
//           }

//           if (subject && typeof subject === "object") {
//             const populatedSubject = subject as {
//               _id?: string;
//               id?: string;
//             };

//             return String(
//               populatedSubject._id ??
//                 populatedSubject.id ??
//                 ""
//             ).trim();
//           }

//           return "";
//         })
//         .filter(Boolean)
//     ),
//   ];
// }

// function getErrorMessage(
//   error: unknown,
//   fallback: string
// ): string {
//   if (error instanceof Error && error.message) {
//     return error.message;
//   }

//   if (error && typeof error === "object") {
//     const apiError = error as {
//       response?: {
//         data?: {
//           message?: string;
//         };
//       };
//       message?: string;
//     };

//     return (
//       apiError.response?.data?.message ??
//       apiError.message ??
//       fallback
//     );
//   }

//   return fallback;
// }

// function getHttpStatus(error: unknown): number | undefined {
//   if (!error || typeof error !== "object") {
//     return undefined;
//   }

//   const apiError = error as {
//     status?: number;
//     response?: {
//       status?: number;
//       data?: {
//         status?: number;
//       };
//     };
//   };

//   return (
//     apiError.response?.status ??
//     apiError.response?.data?.status ??
//     apiError.status
//   );
// }

// // --------------------------------------------------
// // MAIN PAGE
// // --------------------------------------------------

// export default function SchoolClassesPage() {
//   const params = useParams<{ slug: string }>();
//   const slug = params.slug;

//   const user = useAuthStore((state) => state.user);

//   const schoolSubdomain =
//     user?.schoolContext?.subDomain || slug;

//   const [classes, setClasses] = useState<SchoolClass[]>([]);
//   const [subjects, setSubjects] = useState<SchoolSubject[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [subjectsLoading, setSubjectsLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [search, setSearch] = useState("");

//   const [statusFilter, setStatusFilter] =
//     useState<StatusFilter>("ALL");

//   const [currentPage, setCurrentPage] = useState(1);

//   const [showForm, setShowForm] = useState(false);

//   const [editingClass, setEditingClass] =
//     useState<SchoolClass | null>(null);

//   const [updatingClassId, setUpdatingClassId] = useState("");

//   const [form, setForm] =
//     useState<CreateSchoolClassPayload>({ ...EMPTY_FORM });

//   // --------------------------------------------------
//   // FETCH CLASSES
//   // --------------------------------------------------

//   const fetchClasses = useCallback(async () => {
//     if (!schoolSubdomain) {
//       setLoading(false);
//       setClasses([]);
//       setError("School subdomain could not be determined.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const response = await getSchoolClasses(schoolSubdomain);

//       setClasses(
//         Array.isArray(response?.classes)
//           ? response.classes
//           : []
//       );
//     } catch (err) {
//       const status = getHttpStatus(err);

//       if (status === 404) {
//         setClasses([]);
//         setError("");
//         return;
//       }

//       setError(
//         getErrorMessage(
//           err,
//           "Unable to load school classes."
//         )
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolSubdomain]);

//   // --------------------------------------------------
//   // FETCH SUBJECTS
//   // --------------------------------------------------

//   const fetchSubjects = useCallback(async () => {
//     if (!schoolSubdomain) {
//       setSubjects([]);
//       setSubjectsLoading(false);
//       return;
//     }

//     try {
//       setSubjectsLoading(true);

//       const response = await getSchoolSubjects(schoolSubdomain);

//       setSubjects(
//         Array.isArray(response?.subjects)
//           ? response.subjects.filter(
//               (subject) => subject.isActive
//             )
//           : []
//       );
//     } catch (err) {
//       setSubjects([]);

//       setError(
//         getErrorMessage(
//           err,
//           "Unable to load school subjects."
//         )
//       );
//     } finally {
//       setSubjectsLoading(false);
//     }
//   }, [schoolSubdomain]);

//   useEffect(() => {
//     void fetchClasses();
//     void fetchSubjects();
//   }, [fetchClasses, fetchSubjects]);

//   // --------------------------------------------------
//   // SUBJECT LOOKUP
//   // --------------------------------------------------

//   const subjectMap = useMemo(() => {
//     const map = new Map<string, SchoolSubject>();

//     subjects.forEach((subject) => {
//       const subjectId = getSubjectId(subject);

//       if (subjectId) {
//         map.set(subjectId, subject);
//       }
//     });

//     return map;
//   }, [subjects]);

//   const getSubjectNames = useCallback(
//     (subjectIds: string[]) => {
//       if (subjectIds.length === 0) {
//         return "No subjects assigned";
//       }

//       return subjectIds
//         .map(
//           (subjectId) =>
//             subjectMap.get(subjectId)?.subjectName ??
//             "Subject unavailable"
//         )
//         .join(", ");
//     },
//     [subjectMap]
//   );

//   // --------------------------------------------------
//   // SUBJECT SELECTION
//   // --------------------------------------------------

//   const toggleSubject = (subjectId: string) => {
//     setForm((previous) => {
//       const currentIds = previous.subjectIds ?? [];

//       const alreadySelected = currentIds.includes(subjectId);

//       return {
//         ...previous,
//         subjectIds: alreadySelected
//           ? currentIds.filter((id) => id !== subjectId)
//           : [...currentIds, subjectId],
//       };
//     });
//   };

//   const selectAllSubjects = () => {
//     const allSubjectIds = subjects
//       .map(getSubjectId)
//       .filter(Boolean);

//     setForm((previous) => ({
//       ...previous,
//       subjectIds: [...new Set(allSubjectIds)],
//     }));
//   };

//   const clearSubjectSelection = () => {
//     setForm((previous) => ({
//       ...previous,
//       subjectIds: [],
//     }));
//   };

//   // --------------------------------------------------
//   // STATISTICS
//   // --------------------------------------------------

//   const activeClasses = useMemo(
//     () =>
//       classes.filter((item) => Boolean(item.isActive)).length,
//     [classes]
//   );

//   const inactiveClasses = classes.length - activeClasses;

//   const totalStudents = useMemo(
//     () =>
//       classes.reduce(
//         (total, item) =>
//           total + (Number(item.studentCount) || 0),
//         0
//       ),
//     [classes]
//   );

//   // --------------------------------------------------
//   // SEARCH AND FILTER
//   // --------------------------------------------------

//   const filteredClasses = useMemo(() => {
//     const searchValue = search.toLowerCase().trim();

//     return classes.filter((schoolClass) => {
//       const name = getClassName(schoolClass).toLowerCase();
//       const code = getClassCode(schoolClass).toLowerCase();

//       const subjectName = getSubjectNames(
//         getClassSubjectIds(schoolClass)
//       ).toLowerCase();

//       const matchesSearch =
//         !searchValue ||
//         name.includes(searchValue) ||
//         code.includes(searchValue) ||
//         subjectName.includes(searchValue);

//       const isActive = Boolean(schoolClass.isActive);

//       const matchesStatus =
//         statusFilter === "ALL" ||
//         (statusFilter === "ACTIVE" && isActive) ||
//         (statusFilter === "INACTIVE" && !isActive);

//       return matchesSearch && matchesStatus;
//     });
//   }, [classes, search, statusFilter, getSubjectNames]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredClasses.length / PAGE_SIZE)
//   );

//   const paginatedClasses = filteredClasses.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter]);

//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [currentPage, totalPages]);

//   // --------------------------------------------------
//   // FORM HANDLERS
//   // --------------------------------------------------

//   const openCreateForm = () => {
//     setEditingClass(null);
//     setForm({ ...EMPTY_FORM });
//     setError("");
//     setSuccess("");
//     setShowForm(true);
//   };

//   const openEditForm = (schoolClass: SchoolClass) => {
//     setEditingClass(schoolClass);

//     setForm({
//       name: getClassName(schoolClass),
//       arm:
//         getClassCode(schoolClass) === "—"
//           ? ""
//           : getClassCode(schoolClass),
//       subjectIds: getClassSubjectIds(schoolClass),
//     });

//     setError("");
//     setSuccess("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;

//     setShowForm(false);
//     setEditingClass(null);
//     setForm({ ...EMPTY_FORM });
//   };

//   // --------------------------------------------------
//   // CREATE / UPDATE CLASS
//   // --------------------------------------------------

//   const handleSubmit = async (event: FormSubmitEvent) => {
//     event.preventDefault();

//     const name = String(form.name ?? "").trim();
//     const arm = String(form.arm ?? "").trim();

//     const subjectIds = [
//       ...new Set(
//         (form.subjectIds ?? [])
//           .map((id) => String(id).trim())
//           .filter(Boolean)
//       ),
//     ];

//     if (!schoolSubdomain) {
//       setError("School subdomain could not be determined.");
//       return;
//     }

//     if (!name) {
//       setError("Please enter a class name.");
//       return;
//     }

//     if (!arm) {
//       setError("Please enter a class code.");
//       return;
//     }

//     if (subjectIds.length === 0) {
//       setError("Please select at least one subject for this class.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");
//       setSuccess("");

//       if (editingClass) {
//         const classId = getClassId(editingClass);

//         if (!classId) {
//           throw new Error("This class does not have a valid ID.");
//         }

//         // Get the subjects currently assigned to this class.
//         const previousSubjectIds = getClassSubjectIds(editingClass);

//         // Identify only the subjects that are being added.
//         const subjectsToAdd = subjectIds.filter(
//           (subjectId) => !previousSubjectIds.includes(subjectId)
//         );

//         // Identify only the subjects that are being removed.
//         const subjectsToRemove = previousSubjectIds.filter(
//           (subjectId) => !subjectIds.includes(subjectId)
//         );

//         // Update class details separately from subject assignments.
//         const payload: UpdateSchoolClassPayload = {
//           name,
//           arm,
//         };

//         await updateSchoolClass(
//           classId,
//           payload,
//           schoolSubdomain
//         );

//         // Add newly selected subjects.
//         if (subjectsToAdd.length > 0) {
//           await addSubjectsToClass(
//             classId,
//             { subjects: subjectsToAdd },
//             schoolSubdomain
//           );
//         }

//         // Remove subjects that were deselected.
//         if (subjectsToRemove.length > 0) {
//           await removeSubjectsFromClass(
//             classId,
//             { subjects: subjectsToRemove },
//             schoolSubdomain
//           );
//         }

//         setSuccess("Class and subject assignments updated successfully.");
//       } else {
//         // Create the class with its initial subject assignments.
//         const payload: CreateSchoolClassPayload = {
//           name,
//           arm,
//           subjectIds,
//         };

//         await createSchoolClass(payload, schoolSubdomain);

//         setSuccess("Class created successfully.");
//       }

//       setForm({ ...EMPTY_FORM });
//       setShowForm(false);
//       setEditingClass(null);

//       // Reload the latest class and subject assignments from the backend.
//       await fetchClasses();
//     } catch (err) {
//       setError(
//         getErrorMessage(
//           err,
//           editingClass
//             ? "Unable to update class or its subject assignments."
//             : "Unable to create class."
//         )
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------------------------------------
//   // ACTIVATE / DEACTIVATE CLASS
//   // --------------------------------------------------

//   const handleToggleStatus = async (
//     schoolClass: SchoolClass
//   ) => {
//     const classId = getClassId(schoolClass);

//     if (!classId) {
//       setError("This class does not have a valid ID.");
//       return;
//     }

//     if (!schoolSubdomain) {
//       setError("School subdomain could not be determined.");
//       return;
//     }

//     const nextStatus = !schoolClass.isActive;

//     const confirmed = window.confirm(
//       nextStatus
//         ? `Activate ${getClassName(schoolClass)} (${getClassCode(schoolClass)})?`
//         : `Deactivate ${getClassName(schoolClass)} (${getClassCode(schoolClass)})? Historical records will be preserved.`
//     );

//     if (!confirmed) return;

//     try {
//       setUpdatingClassId(classId);
//       setError("");
//       setSuccess("");

//       await updateSchoolClassStatus(
//         classId,
//         { isActive: nextStatus },
//         schoolSubdomain
//       );

//       setClasses((previous) =>
//         previous.map((item) =>
//           getClassId(item) === classId
//             ? { ...item, isActive: nextStatus }
//             : item
//         )
//       );

//       setSuccess(
//         nextStatus
//           ? "Class activated successfully."
//           : "Class deactivated successfully."
//       );
//     } catch (err) {
//       setError(
//         getErrorMessage(
//           err,
//           "Unable to update class status."
//         )
//       );
//     } finally {
//       setUpdatingClassId("");
//     }
//   };

//   // --------------------------------------------------
//   // PAGE
//   // --------------------------------------------------

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       {/* PAGE HEADING */}

//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <GraduationCap size={17} />
//             School Management
//             <span>/</span>
//             Classes
//           </div>

//           <h1 className="mt-2 text-2xl font-bold text-gray-900">
//             Classes
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Create, manage and organize your school's classes and subjects.
//           </p>

//           {schoolSubdomain && (
//             <p className="mt-1 text-xs text-gray-400">
//               School: {schoolSubdomain}
//             </p>
//           )}
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <Button
//             variant="outline"
//             onClick={() => {
//               void fetchClasses();
//               void fetchSubjects();
//             }}
//             disabled={loading || subjectsLoading}
//             leftIcon={<RefreshCw size={16} />}
//           >
//             Refresh
//           </Button>

//           <Button
//             onClick={openCreateForm}
//             leftIcon={<Plus size={17} />}
//           >
//             Add Class
//           </Button>
//         </div>
//       </div>

//       {/* ERROR */}

//       {error && (
//         <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           <span>{error}</span>

//           <button
//             type="button"
//             onClick={() => setError("")}
//             aria-label="Dismiss error"
//           >
//             <X size={17} />
//           </button>
//         </div>
//       )}

//       {/* SUCCESS */}

//       {success && (
//         <div className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//           <span>{success}</span>

//           <button
//             type="button"
//             onClick={() => setSuccess("")}
//             aria-label="Dismiss success message"
//           >
//             <X size={17} />
//           </button>
//         </div>
//       )}

//       {/* STATISTICS */}

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Total Classes"
//           value={classes.length}
//           icon={<Layers size={21} />}
//           color="blue"
//         />

//         <StatCard
//           title="Active Classes"
//           value={activeClasses}
//           icon={<BookOpen size={21} />}
//           color="green"
//         />

//         <StatCard
//           title="Inactive Classes"
//           value={inactiveClasses}
//           icon={<GraduationCap size={21} />}
//           color="orange"
//         />

//         <StatCard
//           title="Students in Classes"
//           value={totalStudents.toLocaleString()}
//           icon={<Users size={21} />}
//           color="purple"
//         />
//       </div>

//       {/* CREATE / EDIT FORM */}

//       {showForm && (
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between gap-3">
//               <div>
//                 <h2 className="font-semibold text-gray-900">
//                   {editingClass
//                     ? "Edit Class"
//                     : "Create New Class"}
//                 </h2>

//                 <p className="mt-1 text-sm text-gray-500">
//                   {editingClass
//                     ? "Update the class information and assigned subjects."
//                     : "Add a new class and assign one or more subjects."}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeForm}
//                 disabled={saving}
//                 className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
//                 aria-label="Close form"
//               >
//                 <X size={19} />
//               </button>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5"
//             >
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 {/* CLASS NAME */}

//                 <div>
//                   <label
//                     htmlFor="className"
//                     className="mb-2 block text-sm font-medium text-gray-700"
//                   >
//                     Class Name *
//                   </label>

//                   <div className="relative">
//                     <GraduationCap
//                       size={17}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />

//                     <input
//                       id="className"
//                       type="text"
//                       required
//                       maxLength={100}
//                       value={form.name ?? ""}
//                       onChange={(event) => {
//                         const value = event.currentTarget.value;

//                         setForm((previous) => ({
//                           ...previous,
//                           name: value,
//                         }));
//                       }}
//                       placeholder="e.g. JSS 1"
//                       className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>
//                 </div>

//                 {/* CLASS CODE */}

//                 <div>
//                   <label
//                     htmlFor="classCode"
//                     className="mb-2 block text-sm font-medium text-gray-700"
//                   >
//                     Class Code *
//                   </label>

//                   <div className="relative">
//                     <Hash
//                       size={17}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />

//                     <input
//                       id="classCode"
//                       type="text"
//                       required
//                       maxLength={50}
//                       value={form.arm ?? ""}
//                       onChange={(event) => {
//                         const value = event.currentTarget.value;

//                         setForm((previous) => ({
//                           ...previous,
//                           arm: value,
//                         }));
//                       }}
//                       placeholder="e.g. JSS 1A"
//                       className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* MULTIPLE SUBJECTS */}

//               <div>
//                 <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Assign Subjects *
//                     </label>

//                     <p className="mt-1 text-xs text-gray-500">
//                       Select all subjects that belong to this class.
//                     </p>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={selectAllSubjects}
//                       disabled={
//                         subjectsLoading ||
//                         saving ||
//                         subjects.length === 0
//                       }
//                       className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
//                     >
//                       Select all
//                     </button>

//                     <span className="text-gray-300">|</span>

//                     <button
//                       type="button"
//                       onClick={clearSubjectSelection}
//                       disabled={
//                         saving ||
//                         (form.subjectIds ?? []).length === 0
//                       }
//                       className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 </div>

//                 <div className="rounded-xl border border-gray-200 p-4">
//                   {subjectsLoading ? (
//                     <p className="text-sm text-gray-500">
//                       Loading subjects...
//                     </p>
//                   ) : subjects.length === 0 ? (
//                     <p className="text-sm text-red-600">
//                       No active subjects found. Create or activate a subject before assigning one to this class.
//                     </p>
//                   ) : (
//                     <>
//                       <div className="mb-3 flex items-center justify-between">
//                         <span className="text-xs text-gray-500">
//                           {subjects.length} available subjects
//                         </span>

//                         <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
//                           {(form.subjectIds ?? []).length} selected
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
//                         {subjects.map((subject) => {
//                           const subjectId = getSubjectId(subject);

//                           if (!subjectId) return null;

//                           const isSelected = (
//                             form.subjectIds ?? []
//                           ).includes(subjectId);

//                           return (
//                             <label
//                               key={subjectId}
//                               className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
//                                 isSelected
//                                   ? "border-blue-300 bg-blue-50"
//                                   : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                               }`}
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={isSelected}
//                                 disabled={saving}
//                                 onChange={() =>
//                                   toggleSubject(subjectId)
//                                 }
//                                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                               />

//                               <span className="min-w-0 flex-1">
//                                 <span className="block text-sm font-medium text-gray-800">
//                                   {subject.subjectName}
//                                 </span>

//                                 {subject.subjectCode && (
//                                   <span className="mt-0.5 block text-xs text-gray-500">
//                                     {subject.subjectCode}
//                                   </span>
//                                 )}
//                               </span>

//                               {isSelected ? (
//                                 <CheckSquare
//                                   size={17}
//                                   className="shrink-0 text-blue-600"
//                                 />
//                               ) : (
//                                 <Square
//                                   size={17}
//                                   className="shrink-0 text-gray-300"
//                                 />
//                               )}
//                             </label>
//                           );
//                         })}
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 <p className="mt-2 text-xs text-gray-500">
//                   At least one subject must be selected. You can assign multiple subjects to the same class.
//                 </p>
//               </div>

//               <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
//                 Example: Class Name: JSS 1, Class Code: JSS 1A, Subjects: Mathematics, English Language, Basic Science.
//               </div>

//               <div className="flex flex-wrap justify-end gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   disabled={saving}
//                   onClick={closeForm}
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="submit"
//                   isLoading={saving}
//                   disabled={
//                     saving ||
//                     subjectsLoading ||
//                     subjects.length === 0 ||
//                     (form.subjectIds ?? []).length === 0
//                   }
//                   leftIcon={
//                     editingClass
//                       ? <Pencil size={16} />
//                       : <Plus size={16} />
//                   }
//                 >
//                   {editingClass
//                     ? "Save Changes"
//                     : "Create Class"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {/* CLASSES LIST */}

//       <Card>
//         <CardHeader>
//           <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//             <div>
//               <h2 className="font-semibold text-gray-900">
//                 All Classes
//               </h2>

//               <p className="mt-1 text-sm text-gray-500">
//                 {filteredClasses.length} class
//                 {filteredClasses.length === 1 ? "" : "es"} found
//               </p>
//             </div>

//             <div className="flex flex-col gap-3 sm:flex-row">
//               {/* SEARCH */}

//               <div className="relative">
//                 <Search
//                   size={17}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   type="search"
//                   value={search}
//                   onChange={(event) => {
//                     setSearch(event.currentTarget.value);
//                   }}
//                   placeholder="Search classes or subjects..."
//                   className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 sm:w-64"
//                 />
//               </div>

//               {/* STATUS FILTER */}

//               <select
//                 value={statusFilter}
//                 onChange={(event) => {
//                   setStatusFilter(
//                     event.currentTarget.value as StatusFilter
//                   );
//                 }}
//                 className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
//               >
//                 <option value="ALL">All Statuses</option>
//                 <option value="ACTIVE">Active</option>
//                 <option value="INACTIVE">Inactive</option>
//               </select>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <LoadingState message="Loading classes..." />
//           ) : filteredClasses.length === 0 ? (
//             <div className="py-12 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
//                 <GraduationCap size={28} />
//               </div>

//               <h3 className="mt-4 font-semibold text-gray-900">
//                 {classes.length === 0
//                   ? "No classes created yet"
//                   : "No matching classes"}
//               </h3>

//               <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
//                 {classes.length === 0
//                   ? "Create your first class to start organizing students."
//                   : "Try changing your search or status filter."}
//               </p>

//               {classes.length === 0 && (
//                 <div className="mt-5">
//                   <Button
//                     onClick={openCreateForm}
//                     leftIcon={<Plus size={16} />}
//                   >
//                     Create First Class
//                   </Button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* DESKTOP TABLE */}

//               <div className="hidden overflow-x-auto md:block">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
//                       <th className="px-4 py-4 font-medium">
//                         Class Name
//                       </th>

//                       <th className="px-4 py-4 font-medium">
//                         Class Code
//                       </th>

//                       <th className="px-4 py-4 font-medium">
//                         Subjects
//                       </th>

//                       <th className="px-4 py-4 font-medium">
//                         Students
//                       </th>

//                       <th className="px-4 py-4 font-medium">
//                         Status
//                       </th>

//                       <th className="px-4 py-4 text-right font-medium">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-gray-100">
//                     {paginatedClasses.map((schoolClass) => {
//                       const classId = getClassId(schoolClass);
//                       const isActive = Boolean(schoolClass.isActive);

//                       return (
//                         <tr
//                           key={
//                             classId ||
//                             `${getClassName(schoolClass)}-${getClassCode(schoolClass)}`
//                           }
//                           className="transition hover:bg-gray-50"
//                         >
//                           <td className="px-4 py-4">
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
//                                 <GraduationCap size={20} />
//                               </div>

//                               <span className="font-medium text-gray-900">
//                                 {getClassName(schoolClass)}
//                               </span>
//                             </div>
//                           </td>

//                           <td className="px-4 py-4">
//                             <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
//                               {getClassCode(schoolClass)}
//                             </span>
//                           </td>

//                           <td className="px-4 py-4">
//                             <div className="flex max-w-xs items-start gap-2 text-sm text-gray-700">
//                               <BookMarked
//                                 size={16}
//                                 className="mt-0.5 shrink-0 text-blue-600"
//                               />

//                               <span>
//                                 {getSubjectNames(
//                                   getClassSubjectIds(schoolClass)
//                                 )}
//                               </span>
//                             </div>
//                           </td>

//                           <td className="px-4 py-4">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                               <Users size={16} />
//                               {(Number(schoolClass.studentCount) || 0).toLocaleString()}
//                             </div>
//                           </td>

//                           <td className="px-4 py-4">
//                             <StatusBadge
//                               status={isActive ? "ACTIVE" : "INACTIVE"}
//                             />
//                           </td>

//                           <td className="px-4 py-4">
//                             <div className="flex justify-end gap-2">
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 disabled={!classId}
//                                 onClick={() => openEditForm(schoolClass)}
//                                 leftIcon={<Pencil size={14} />}
//                               >
//                                 Edit
//                               </Button>

//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 color={isActive ? "danger" : "success"}
//                                 disabled={
//                                   !classId ||
//                                   updatingClassId === classId
//                                 }
//                                 isLoading={
//                                   updatingClassId === classId
//                                 }
//                                 onClick={() =>
//                                   void handleToggleStatus(schoolClass)
//                                 }
//                                 leftIcon={<Power size={14} />}
//                               >
//                                 {isActive ? "Deactivate" : "Activate"}
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* MOBILE CARDS */}

//               <div className="space-y-3 md:hidden">
//                 {paginatedClasses.map((schoolClass) => {
//                   const classId = getClassId(schoolClass);
//                   const isActive = Boolean(schoolClass.isActive);

//                   return (
//                     <div
//                       key={
//                         classId ||
//                         `${getClassName(schoolClass)}-${getClassCode(schoolClass)}`
//                       }
//                       className="rounded-xl border border-gray-200 p-4"
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="flex min-w-0 items-center gap-3">
//                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
//                             <GraduationCap size={20} />
//                           </div>

//                           <div className="min-w-0">
//                             <h3 className="truncate font-semibold text-gray-900">
//                               {getClassName(schoolClass)}
//                             </h3>

//                             <p className="text-sm text-gray-500">
//                               Code: {getClassCode(schoolClass)}
//                             </p>
//                           </div>
//                         </div>

//                         <StatusBadge
//                           status={isActive ? "ACTIVE" : "INACTIVE"}
//                         />
//                       </div>

//                       <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
//                         <BookMarked
//                           size={16}
//                           className="mt-0.5 shrink-0 text-blue-600"
//                         />

//                         <span>
//                           Subjects: {getSubjectNames(
//                             getClassSubjectIds(schoolClass)
//                           )}
//                         </span>
//                       </div>

//                       <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
//                         <span className="flex items-center gap-2 text-sm text-gray-600">
//                           <Users size={16} />
//                           {(Number(schoolClass.studentCount) || 0).toLocaleString()} Students
//                         </span>

//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             disabled={!classId}
//                             onClick={() => openEditForm(schoolClass)}
//                             leftIcon={<Pencil size={14} />}
//                           >
//                             Edit
//                           </Button>

//                           <Button
//                             size="sm"
//                             variant="outline"
//                             color={isActive ? "danger" : "success"}
//                             disabled={
//                               !classId ||
//                               updatingClassId === classId
//                             }
//                             isLoading={
//                               updatingClassId === classId
//                             }
//                             onClick={() =>
//                               void handleToggleStatus(schoolClass)
//                             }
//                           >
//                             {isActive ? "Deactivate" : "Activate"}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* PAGINATION */}

//               <div className="mt-6 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
//                 <p className="text-sm text-gray-500">
//                   Showing{" "}
//                   {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
//                   {Math.min(
//                     currentPage * PAGE_SIZE,
//                     filteredClasses.length
//                   )}{" "}
//                   of {filteredClasses.length} classes
//                 </p>

//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     disabled={currentPage <= 1}
//                     onClick={() =>
//                       setCurrentPage((page) =>
//                         Math.max(1, page - 1)
//                       )
//                     }
//                     className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
//                     aria-label="Previous page"
//                   >
//                     <ChevronLeft size={18} />
//                   </button>

//                   <span className="px-3 text-sm text-gray-600">
//                     Page {currentPage} of {totalPages}
//                   </span>

//                   <button
//                     type="button"
//                     disabled={currentPage >= totalPages}
//                     onClick={() =>
//                       setCurrentPage((page) =>
//                         Math.min(totalPages, page + 1)
//                       )
//                     }
//                     className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
//                     aria-label="Next page"
//                   >
//                     <ChevronRight size={18} />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // --------------------------------------------------
// // STATISTICS CARD
// // --------------------------------------------------

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: ReactNode;
//   color: "blue" | "green" | "orange" | "purple";
// }

// function StatCard({
//   title,
//   value,
//   icon,
//   color,
// }: StatCardProps) {
//   const colorClasses = {
//     blue: "bg-blue-50 text-blue-700",
//     green: "bg-green-50 text-green-700",
//     orange: "bg-orange-50 text-orange-700",
//     purple: "bg-purple-50 text-purple-700",
//   };

//   return (
//     <Card>
//       <CardContent>
//         <div className="flex items-center justify-between gap-3">
//           <div>
//             <p className="text-sm text-gray-500">
//               {title}
//             </p>

//             <p className="mt-2 text-2xl font-bold text-gray-900">
//               {value}
//             </p>
//           </div>

//           <div
//             className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClasses[color]}`}
//           >
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
