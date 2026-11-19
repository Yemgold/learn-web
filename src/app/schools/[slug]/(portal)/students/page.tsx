



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { useParams } from "next/navigation";

import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  GraduationCap,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Power,
  UserPlus,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

import Button from "@/components/schools/ui/Button";

import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import StatusBadge from "@/components/schools/shared/StatusBadge";
import LoadingState from "@/components/schools/shared/LoadingState";

import {
  getSchoolMembers,
  createSchoolMember,
  updateSchoolMemberStatus,
  type SchoolMember,
  type CreateSchoolMemberPayload,
} from "@/lib/schools/portal/services/member.service";

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 10;

/* =========================================================
   HELPERS
========================================================= */

const getStudentId = (student: SchoolMember): string => {
  return (
    student.membershipId ||
    student._id ||
    student.id ||
    ""
  );
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const getInitials = (student: SchoolMember): string => {
  return `${student.firstName?.charAt(0) || ""}${student.lastName?.charAt(0) || ""}`.toUpperCase();
};

const normalizeRole = (role: string): string => {
  return role.toUpperCase().replace(/[\s-]/g, "_");
};

/* =========================================================
   FORM TYPES
========================================================= */

interface StudentFormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const createEmptyStudentForm = (): StudentFormState => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

/* =========================================================
   PAGE
========================================================= */

export default function SchoolStudentsPage() {
  const params = useParams<{ slug: string }>();

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  /* -------------------------------------------------------
     SCHOOL CONTEXT
  ------------------------------------------------------- */

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId || "";

  const schoolSubdomain = (
    user?.schoolContext?.subDomain ||
    params?.slug ||
    ""
  ).trim().toLowerCase();

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [students, setStudents] = useState<SchoolMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<StudentFormState>(
    createEmptyStudentForm()
  );

  /* -------------------------------------------------------
     FETCH STUDENTS
  ------------------------------------------------------- */

  const fetchStudents = useCallback(async () => {
    if (!isHydrated) return;

    if (!schoolId) {
      setStudents([]);
      setLoading(false);

      setError(
        "Your account does not have an active school membership. Please sign in again or contact your school administrator."
      );

      return;
    }

    if (!schoolSubdomain) {
      setStudents([]);
      setLoading(false);

      setError(
        "School subdomain is unavailable. Please check your school URL and try again."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSchoolMembers(
        schoolId,
        schoolSubdomain
      );

      const studentMembers = (response.members || []).filter(
        (member) => normalizeRole(member.role) === "STUDENT"
      );

      setStudents(studentMembers);
      setCurrentPage(1);
    } catch (err: unknown) {
      setStudents([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [schoolId, schoolSubdomain, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      void fetchStudents();
    }
  }, [fetchStudents, isHydrated]);

  /* -------------------------------------------------------
     STATISTICS
  ------------------------------------------------------- */

  const activeStudents = useMemo(
    () => students.filter((student) => student.isActive).length,
    [students]
  );

  const inactiveStudents = useMemo(
    () => students.filter((student) => !student.isActive).length,
    [students]
  );

  /* -------------------------------------------------------
     SEARCH AND FILTER
  ------------------------------------------------------- */

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      const fullName =
        `${student.firstName} ${student.lastName}`.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch) ||
        (student.phoneNumber || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && student.isActive) ||
        (statusFilter === "INACTIVE" && !student.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  /* -------------------------------------------------------
     CLIENT-SIDE PAGINATION
  ------------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / PAGE_SIZE)
  );

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredStudents.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredStudents, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  /* -------------------------------------------------------
     FORM HANDLERS
  ------------------------------------------------------- */

  const resetForm = () => {
    setForm(createEmptyStudentForm());
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
    setError("");
  };

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* -------------------------------------------------------
     CREATE STUDENT
  ------------------------------------------------------- */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (!schoolId) {
        setError(
          "Your school membership information is unavailable."
        );
        return;
      }

      if (!schoolSubdomain) {
        setError("Your school subdomain is unavailable.");
        return;
      }

      if (
        !form.firstName.trim() ||
        !form.lastName.trim()
      ) {
        setError("Enter the student's first and last name.");
        return;
      }

      if (!form.email.trim()) {
        setError("Enter the student's email address.");
        return;
      }

      if (!form.password.trim()) {
        setError("Enter a temporary password for the student.");
        return;
      }

      if (form.password.length < 8) {
        setError(
          "The temporary password must be at least 8 characters."
        );
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("The passwords do not match.");
        return;
      }

      const payload: CreateSchoolMemberPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: "STUDENT",
      };

      await createSchoolMember(
        payload,
        schoolSubdomain
      );

      setSuccess("Student registered successfully.");

      setShowForm(false);
      resetForm();

      await fetchStudents();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------------------------------------
     ACTIVATE / DEACTIVATE STUDENT
  ------------------------------------------------------- */

  const handleStatusChange = async (
    student: SchoolMember
  ) => {
    const studentId = getStudentId(student);

    if (!studentId) {
      setError("Student membership ID is missing.");
      return;
    }

    if (!schoolSubdomain) {
      setError("Your school subdomain is unavailable.");
      return;
    }

    const nextStatus = !student.isActive;

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${student.firstName} ${student.lastName}?`
        : `Deactivate ${student.firstName} ${student.lastName}?`
    );

    if (!confirmed) return;

    try {
      setActionId(studentId);
      setError("");
      setSuccess("");

      await updateSchoolMemberStatus(
        studentId,
        { isActive: nextStatus },
        schoolSubdomain
      );

      setSuccess(
        nextStatus
          ? "Student activated successfully."
          : "Student deactivated successfully."
      );

      await fetchStudents();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  if (!isHydrated || loading) {
    return <LoadingState message="Loading students..." />;
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="space-y-6 pb-10">

      {/* PAGE HEADING */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>School</span>
            <span>/</span>
            <span>Students</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Students
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage student registrations, accounts and membership status.
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
            onClick={() => void fetchStudents()}
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>

          <Button
            onClick={openCreateForm}
            leftIcon={<Plus size={16} />}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* ALERTS */}

      {error && !showForm && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">
                Total Students
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {students.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={23} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">
                Active Students
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {activeStudents}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <UserCheck size={23} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">
                Inactive Students
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {inactiveStudents}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <UserX size={23} />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ADD STUDENT FORM */}

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Register New Student
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the student's information and create their school account.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>
          </CardHeader>

          <CardContent>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* FIRST NAME */}

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* LAST NAME */}

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    placeholder="student@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Temporary Password *
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleFormChange}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* CONFIRM PASSWORD */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Confirm Temporary Password *
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleFormChange}
                    required
                    minLength={8}
                    placeholder="Re-enter temporary password"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* ROLE */}

                <div>
                  <label
                    htmlFor="studentRole"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    School Role
                  </label>

                  <input
                    id="studentRole"
                    value="STUDENT"
                    readOnly
                    aria-readonly="true"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Students registered here are assigned the Student role.
                  </p>
                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={submitting}
                  disabled={submitting}
                  leftIcon={<UserPlus size={16} />}
                >
                  Register Student
                </Button>

              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* SEARCH AND FILTERS */}

      <Card>
        <CardContent className="p-4">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">

              {(["ALL", "ACTIVE", "INACTIVE"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      statusFilter === status
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {status === "ALL"
                      ? "All"
                      : status === "ACTIVE"
                        ? "Active"
                        : "Inactive"}
                  </button>
                )
              )}

            </div>
          </div>
        </CardContent>
      </Card>

      {/* STUDENT LIST */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Registered Students
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredStudents.length} student
                {filteredStudents.length === 1 ? "" : "s"} displayed
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>

          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">

              <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <GraduationCap size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No students found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {search || statusFilter !== "ALL"
                  ? "Try changing your search or filter."
                  : "You have not registered any students yet."}
              </p>

              {!search && statusFilter === "ALL" && (
                <Button
                  className="mt-4"
                  onClick={openCreateForm}
                  leftIcon={<Plus size={16} />}
                >
                  Add First Student
                </Button>
              )}

            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[650px]">

                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3 font-medium">
                        Student
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Contact
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Status
                      </th>

                      <th className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {paginatedStudents.map((student) => {
                      const studentId = getStudentId(student);

                      return (
                        <tr
                          key={studentId || student.email}
                          className="hover:bg-gray-50"
                        >

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                                {getInitials(student)}
                              </div>

                              <div>
                                <p className="font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-400">
                                  Student
                                </p>
                              </div>

                            </div>
                          </td>

                          <td className="px-4 py-4">

                            <p className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail size={14} className="text-gray-400" />
                              {student.email}
                            </p>

                            {student.phoneNumber && (
                              <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <Phone size={13} className="text-gray-400" />
                                {student.phoneNumber}
                              </p>
                            )}

                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={
                                student.isActive
                                  ? "Active"
                                  : "Inactive"
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  void handleStatusChange(student)
                                }
                                disabled={
                                  actionId === studentId ||
                                  !studentId
                                }
                                className={`rounded-lg p-2 disabled:opacity-50 ${
                                  student.isActive
                                    ? "text-red-500 hover:bg-red-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                                title={
                                  student.isActive
                                    ? "Deactivate student"
                                    : "Activate student"
                                }
                              >
                                <Power size={16} />
                              </button>

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

                {paginatedStudents.map((student) => {
                  const studentId = getStudentId(student);

                  return (
                    <div
                      key={studentId || student.email}
                      className="rounded-xl border border-gray-200 p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                            {getInitials(student)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              Student
                            </p>
                          </div>

                        </div>

                        <StatusBadge
                          status={
                            student.isActive
                              ? "Active"
                              : "Inactive"
                          }
                        />

                      </div>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">

                        <p className="flex items-center gap-2 break-all">
                          <Mail
                            size={15}
                            className="shrink-0 text-gray-400"
                          />
                          {student.email}
                        </p>

                        {student.phoneNumber && (
                          <p className="flex items-center gap-2">
                            <Phone
                              size={15}
                              className="shrink-0 text-gray-400"
                            />
                            {student.phoneNumber}
                          </p>
                        )}

                      </div>

                      <div className="mt-4 border-t border-gray-100 pt-3">

                        <Button
                          variant={
                            student.isActive
                              ? "danger"
                              : "success"
                          }
                          size="sm"
                          fullWidth
                          isLoading={actionId === studentId}
                          disabled={!studentId}
                          onClick={() =>
                            void handleStatusChange(student)
                          }
                          leftIcon={<Power size={14} />}
                        >
                          {student.isActive
                            ? "Deactivate Student"
                            : "Activate Student"}
                        </Button>

                      </div>
                    </div>
                  );
                })}

              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    {(currentPage - 1) * PAGE_SIZE + 1}
                    {"–"}
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredStudents.length
                    )}
                    {" "}of {filteredStudents.length} students
                  </p>

                  <div className="flex gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.max(1, page - 1)
                        )
                      }
                      leftIcon={<ChevronLeft size={15} />}
                    >
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      rightIcon={<ChevronRight size={15} />}
                    >
                      Next
                    </Button>

                  </div>
                </div>
              )}

            </>
          )}

        </CardContent>
      </Card>

    </div>
  );
}
