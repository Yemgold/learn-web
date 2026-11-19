


"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useParams } from "next/navigation";

import {
  Search,
  Plus,
  RefreshCw,
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LockKeyhole,
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
  createSchoolAdministrator,
  updateSchoolMemberStatus,
} from "@/lib/schools/portal/services/member.service";

import type {
  SchoolMember,
} from "@/lib/schools/portal/services/member.service";

/* ============================================================
   TYPES
============================================================ */

interface AdministratorForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface SchoolContextData {
  subDomain?: string;

  schoolId?: string;

  userSchoolMembership?: {
    schoolId?: string | {
      _id?: string;
      id?: string;
    };
  };
}

const INITIAL_FORM: AdministratorForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

/* ============================================================
   HELPERS
============================================================ */

const getMemberId = (member: SchoolMember): string =>
  member._id || member.id || "";

const getMemberPhone = (member: SchoolMember): string => {
  const record = member as SchoolMember & {
    phoneNumber?: string;
  };

  return record.phoneNumber || member.phoneNumber || "";
};

const isAdministrator = (member: SchoolMember): boolean => {
  const role = String(member.role || "")
    .toUpperCase()
    .replace(/[\s-]/g, "_");

  return [
    "ADMIN",
    "ADMINISTRATOR",
    "SCHOOL_ADMIN",
    "SCHOOL_ADMINISTRATOR",
  ].includes(role);
};

const extractMembers = (response: unknown): SchoolMember[] => {
  if (Array.isArray(response)) {
    return response as SchoolMember[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as Record<string, unknown>;

  const data =
    result.data && typeof result.data === "object"
      ? (result.data as Record<string, unknown>)
      : null;

  const nestedData =
    data?.data && typeof data.data === "object"
      ? (data.data as Record<string, unknown>)
      : null;

  const possibleArrays = [
    result.members,
    result.data,
    data?.members,
    data?.data,
    data?.results,
    nestedData?.members,
    nestedData?.data,
    nestedData?.results,
  ];

  for (const candidate of possibleArrays) {
    if (Array.isArray(candidate)) {
      return candidate as SchoolMember[];
    }
  }

  return [];
};

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

/* ============================================================
   SCHOOL ADMINISTRATORS PAGE
============================================================ */

export default function SchoolAdministratorsPage() {
  const params = useParams<{ slug: string }>();

  const slug = params.slug;

  const authUser = useAuthStore((state) => state.user);

  /*
   * The school ID must come from the authenticated school
   * membership, not from the URL slug.
   */

  const schoolContext = (
    authUser as unknown as {
      schoolContext?: SchoolContextData;
    } | null
  )?.schoolContext;

  const membershipSchoolId =
    schoolContext?.userSchoolMembership?.schoolId;

  const schoolId =
    typeof membershipSchoolId === "string"
      ? membershipSchoolId
      : membershipSchoolId?._id ||
        membershipSchoolId?.id ||
        schoolContext?.schoolId ||
        "";

  /*
   * The authenticated school subdomain takes priority.
   * The route slug is used only as a fallback.
   */

  const schoolSubdomain = (
    schoolContext?.subDomain || slug || ""
  )
    .trim()
    .toLowerCase();

  /* ============================================================
     STATE
  ============================================================ */

  const [administrators, setAdministrators] =
    useState<SchoolMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);

  const [form, setForm] =
    useState<AdministratorForm>(INITIAL_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ============================================================
     LOAD SCHOOL ADMINISTRATORS
  ============================================================ */

  const loadAdministrators = useCallback(
    async (showRefresh = false) => {
      if (!schoolId) {
        setAdministrators([]);
        setError(
          "The authenticated school ID could not be found. Please refresh your school dashboard."
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (!schoolSubdomain) {
        setAdministrators([]);
        setError(
          "The school subdomain could not be identified."
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getSchoolMembers(
          schoolId,
          schoolSubdomain
        );

        const members = extractMembers(response);

        const schoolAdministrators = members.filter(
          isAdministrator
        );

        setAdministrators(schoolAdministrators);
      } catch (err: unknown) {
        setError(
          getErrorMessage(
            err,
            "Unable to load school administrators."
          )
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [schoolId, schoolSubdomain]
  );

  useEffect(() => {
    void loadAdministrators();
  }, [loadAdministrators]);

  /* ============================================================
     SEARCH AND FILTER
  ============================================================ */

  const filteredAdministrators = useMemo(() => {
    return administrators.filter((administrator) => {
      const fullName = [
        administrator.firstName || "",
        administrator.lastName || "",
      ]
        .join(" ")
        .toLowerCase();

      const email = String(
        administrator.email || ""
      ).toLowerCase();

      const phone = getMemberPhone(administrator).toLowerCase();

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          Boolean(administrator.isActive)) ||
        (statusFilter === "inactive" &&
          !administrator.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [administrators, search, statusFilter]);

  /* ============================================================
     STATISTICS
  ============================================================ */

  const stats = useMemo(() => {
    const active = administrators.filter(
      (administrator) => administrator.isActive
    ).length;

    return {
      total: administrators.length,
      active,
      inactive: administrators.length - active,
    };
  }, [administrators]);

  /* ============================================================
     FORM HANDLERS
  ============================================================ */

  const openCreateForm = () => {
    setForm(INITIAL_FORM);
    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (submitting) return;

    setFormOpen(false);
    setForm(INITIAL_FORM);
    setError("");
  };

  const handleChange = (
    field: keyof AdministratorForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* ============================================================
     CREATE SCHOOL ADMINISTRATOR
  ============================================================ */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!schoolId) {
      setError(
        "The authenticated school ID could not be found."
      );
      return;
    }

    if (!schoolSubdomain) {
      setError("The school subdomain could not be identified.");
      return;
    }

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phoneNumber.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.phoneNumber.trim().length < 11) {
      setError(
        "Phone number must contain at least 11 characters."
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await createSchoolAdministrator(
        {
          schoolId,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
        schoolSubdomain
      );

      setSuccess(
        "School administrator registered successfully."
      );

      setForm(INITIAL_FORM);
      setFormOpen(false);

      await loadAdministrators(true);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          "Unable to register school administrator."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     ACTIVATE / DEACTIVATE ADMINISTRATOR
  ============================================================ */

  const handleStatusChange = async (
    administrator: SchoolMember
  ) => {
    const memberId = getMemberId(administrator);

    if (!memberId) {
      setError(
        "Could not identify this administrator."
      );
      return;
    }

    if (!schoolSubdomain) {
      setError(
        "The school subdomain could not be identified."
      );
      return;
    }

    const nextStatus = !administrator.isActive;

    const fullName = [
      administrator.firstName,
      administrator.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus ? "activate" : "deactivate"
      } ${fullName}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await updateSchoolMemberStatus(
        memberId,
        {
          isActive: nextStatus,
        },
        schoolSubdomain
      );

      setAdministrators((current) =>
        current.map((member) =>
          getMemberId(member) === memberId
            ? {
                ...member,
                isActive: nextStatus,
              }
            : member
        )
      );

      setSuccess(
        `Administrator ${
          nextStatus ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          "Unable to update administrator status."
        )
      );
    }
  };

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) {
    return (
      <LoadingState message="Loading school administrators..." />
    );
  }

  /* ============================================================
     PAGE UI
  ============================================================ */

  return (
    <div className="space-y-6 pb-10">

      {/* ======================================================
          PAGE HEADING
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck className="h-4 w-4" />

            <span>School Management</span>

            <span>/</span>

            <span>Administrators</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Administrators
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the people responsible for administering your school.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => void loadAdministrators(true)}
            isLoading={refreshing}
            leftIcon={
              <RefreshCw className="h-4 w-4" />
            }
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={openCreateForm}
            leftIcon={
              <Plus className="h-4 w-4" />
            }
          >
            Add Administrator
          </Button>
        </div>
      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && !formOpen && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <p>{success}</p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto"
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* TOTAL */}

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Administrators
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVE */}

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Active
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* INACTIVE */}

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Inactive
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-600">
                  {stats.inactive}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                <UserRound className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================
          CREATE ADMINISTRATOR FORM
      ====================================================== */}

      {formOpen && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add School Administrator
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create an administrator account for this school.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>

          <CardContent>

            {/* FORM ERROR */}

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME FIELDS */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="admin-first-name"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    First Name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="admin-first-name"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(event) =>
                      handleChange(
                        "firstName",
                        event.target.value
                      )
                    }
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-last-name"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Last Name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="admin-last-name"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(event) =>
                      handleChange(
                        "lastName",
                        event.target.value
                      )
                    }
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email Address{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) =>
                      handleChange(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="admin@school.com"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PHONE NUMBER */}

              <div>
                <label
                  htmlFor="admin-phone"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Phone Number{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="admin-phone"
                    type="tel"
                    required
                    minLength={11}
                    autoComplete="tel"
                    value={form.phoneNumber}
                    onChange={(event) =>
                      handleChange(
                        "phoneNumber",
                        event.target.value
                      )
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Enter a phone number containing at least 11 characters.
                </p>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Temporary Password{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="admin-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) =>
                      handleChange(
                        "password",
                        event.target.value
                      )
                    }
                    placeholder="Create a temporary password"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label
                  htmlFor="admin-confirm-password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Confirm Password{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="admin-confirm-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      handleChange(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    placeholder="Confirm temporary password"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* ROLE INFORMATION */}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Account Role
                    </p>

                    <p className="mt-1 text-sm text-blue-700">
                      School Administrator
                    </p>

                    <p className="mt-1 text-xs text-blue-600">
                      The ADMIN role will be assigned automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
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
                  variant="primary"
                  isLoading={submitting}
                  disabled={submitting}
                  leftIcon={
                    submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )
                  }
                >
                  {submitting
                    ? "Registering..."
                    : "Register Administrator"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ======================================================
          SEARCH AND FILTERS
      ====================================================== */}

      <Card>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">
                All Administrators
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ======================================================
          ADMINISTRATOR LIST
      ====================================================== */}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                School Administrators
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredAdministrators.length} administrator
                {filteredAdministrators.length === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAdministrators.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h3 className="font-semibold text-gray-900">
                No administrators found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {search || statusFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Add your first school administrator to get started."}
              </p>

              {!search && statusFilter === "all" && (
                <div className="mt-4">
                  <Button
                    variant="primary"
                    onClick={openCreateForm}
                    leftIcon={
                      <Plus className="h-4 w-4" />
                    }
                  >
                    Add Administrator
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ==================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3 font-medium">
                        Administrator
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Contact
                      </th>

                      <th className="px-4 py-3 font-medium">
                        Role
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
                    {filteredAdministrators.map(
                      (administrator) => {
                        const phone = getMemberPhone(administrator);

                        return (
                          <tr
                            key={getMemberId(administrator)}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-700">
                                  {administrator.firstName?.[0]}
                                  {administrator.lastName?.[0]}
                                </div>

                                <div>
                                  <p className="font-medium text-gray-900">
                                    {administrator.firstName}{" "}
                                    {administrator.lastName}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    Added{" "}
                                    {administrator.createdAt
                                      ? new Date(
                                          administrator.createdAt
                                        ).toLocaleDateString()
                                      : "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <p className="flex items-center gap-2 text-sm text-gray-700">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />

                                {administrator.email}
                              </p>

                              {phone && (
                                <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                  <Phone className="h-3.5 w-3.5 text-gray-400" />

                                  {phone}
                                </p>
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                                Administrator
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge
                                status={
                                  administrator.isActive
                                    ? "Active"
                                    : "Inactive"
                                }
                              />
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex justify-end">
                                <Button
                                  variant={
                                    administrator.isActive
                                      ? "danger"
                                      : "success"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    void handleStatusChange(
                                      administrator
                                    )
                                  }
                                >
                                  {administrator.isActive
                                    ? "Deactivate"
                                    : "Activate"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* ==================================================
                  MOBILE CARDS
              ================================================== */}

              <div className="space-y-3 md:hidden">
                {filteredAdministrators.map(
                  (administrator) => {
                    const phone = getMemberPhone(administrator);

                    return (
                      <div
                        key={getMemberId(administrator)}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-700">
                              {administrator.firstName?.[0]}
                              {administrator.lastName?.[0]}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900">
                                {administrator.firstName}{" "}
                                {administrator.lastName}
                              </p>

                              <p className="truncate text-sm text-gray-500">
                                {administrator.email}
                              </p>
                            </div>
                          </div>

                          <StatusBadge
                            status={
                              administrator.isActive
                                ? "Active"
                                : "Inactive"
                            }
                          />
                        </div>

                        {phone && (
                          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="h-4 w-4" />

                            {phone}
                          </p>
                        )}

                        <div className="mt-4 border-t border-gray-100 pt-3">
                          <Button
                            variant={
                              administrator.isActive
                                ? "danger"
                                : "success"
                            }
                            size="sm"
                            fullWidth
                            onClick={() =>
                              void handleStatusChange(
                                administrator
                              )
                            }
                          >
                            {administrator.isActive
                              ? "Deactivate Administrator"
                              : "Activate Administrator"}
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}