



"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";

import {
  getSchoolDashboard,
  normalizeSchoolDashboardResponse,
  type AdminSchoolDashboard,
  type SchoolDashboardRole,
  type TeacherDashboard as TeacherDashboardData,
  type StudentDashboard as StudentDashboardData,
} from "@/lib/schools/portal/services/dashboard.service";

import { createSchoolAdministrator } from "@/lib/schools/portal/services/member.service";

import OwnerDashboard from "@/components/schools/school/dashboards/OwnerDashboard";
import AdminDashboard from "@/components/schools/school/dashboards/AdminDashboard";
import TeacherDashboard from "@/components/schools/school/dashboards/TeacherDashboard";
import StudentDashboard from "@/components/schools/school/dashboards/StudentDashboard";

import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Plus,
  Users,
  X,
} from "lucide-react";

/* ============================================================
   HELPERS
============================================================ */

function formatSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return (
      responseData?.message ||
      responseData?.error ||
      error.message ||
      "Unable to load school dashboard."
    );
  }

  return error instanceof Error
    ? error.message
    : "Unable to load school dashboard.";
}

/* ============================================================
   ADMIN FORM TYPE
============================================================ */

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const initialAdminForm: AdminFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

/* ============================================================
   REGISTER SCHOOL ADMIN MODAL
============================================================ */

function RegisterAdminModal({
  isOpen,
  onClose,
  schoolId,
  schoolSubdomain,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  schoolSubdomain: string;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<AdminFormData>(initialAdminForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setForm(initialAdminForm);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    field: keyof AdminFormData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (!schoolId.trim()) {
      setError("The school membership ID could not be found.");
      return;
    }

    if (!schoolSubdomain.trim()) {
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

    const phoneNumber = form.phoneNumber.trim();

    if (phoneNumber.length < 11) {
      setError("Phone number must contain at least 11 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createSchoolAdministrator(
        {
          schoolId: schoolId.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phoneNumber,
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
        schoolSubdomain.trim().toLowerCase(),
      );

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div className="my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <Users size={20} />
              </div>

              <h2 className="text-lg font-bold text-gray-900">
                Register School Admin
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Create an administrator account for this school.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 sm:p-6"
        >
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="admin-first-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                First Name *
              </label>

              <input
                id="admin-first-name"
                type="text"
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={(event) =>
                  handleChange("firstName", event.target.value)
                }
                placeholder="Enter first name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="admin-last-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Last Name *
              </label>

              <input
                id="admin-last-name"
                type="text"
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={(event) =>
                  handleChange("lastName", event.target.value)
                }
                placeholder="Enter last name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address *
            </label>

            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                handleChange("email", event.target.value)
              }
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="admin-phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number *
            </label>

            <input
              id="admin-phone"
              type="tel"
              required
              minLength={11}
              autoComplete="tel"
              value={form.phoneNumber}
              onChange={(event) =>
                handleChange("phoneNumber", event.target.value)
              }
              placeholder="Enter phone number"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Temporary Password *
            </label>

            <input
              id="admin-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                handleChange("password", event.target.value)
              }
              placeholder="Create a temporary password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="admin-confirm-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password *
            </label>

            <input
              id="admin-confirm-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) =>
                handleChange("confirmPassword", event.target.value)
              }
              placeholder="Confirm temporary password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-800">
              Account Role
            </p>

            <p className="mt-1 text-sm text-blue-700">
              School Administrator
            </p>

            <p className="mt-1 text-xs text-blue-600">
              The administrator role is assigned automatically.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Register Administrator
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN SCHOOL DASHBOARD PAGE
============================================================ */

export default function SchoolDashboardPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const schoolUrl = `/schools/${slug}`;

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId;

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const membershipRole =
    user?.schoolContext?.userSchoolMembership?.role;

  const canRegisterAdmin =
    membershipRole === "OWNER" ||
    membershipRole === "ADMIN";

  const schoolName =
    user?.schoolContext?.schoolName ||
    formatSlug(slug || "school");

  const [dashboardRole, setDashboardRole] =
    useState<SchoolDashboardRole | null>(null);

  const [dashboard, setDashboard] = useState<
    AdminSchoolDashboard |
    TeacherDashboardData |
    StudentDashboardData |
    null
  >(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  /* ============================================================
     FETCH DASHBOARD
  ============================================================ */

  const fetchDashboard = useCallback(async () => {
    if (!isHydrated) return;

    if (!slug) {
      setDashboard(null);
      setDashboardRole(null);
      setError("School subdomain could not be identified.");
      setIsLoading(false);
      return;
    }

    if (!schoolId) {
      setDashboard(null);
      setDashboardRole(null);
      setError(
        "Your account does not contain a school membership ID. Please sign in again through your school's portal.",
      );
      setIsLoading(false);
      return;
    }

    if (!schoolSubdomain) {
      setDashboard(null);
      setDashboardRole(null);
      setError("A valid school subdomain is required.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      console.info("[SCHOOL DASHBOARD] Request context:", {
        schoolId,
        schoolSubdomain,
        membershipRole,
      });

      const response = await getSchoolDashboard(
        schoolId,
        schoolSubdomain,
      );

console.log("[DASHBOARD DEBUG] Axios response:", response);



console.log("[DASHBOARD DEBUG] Response data:", response.data);

      console.info(
        "[SCHOOL DASHBOARD] API response:",
        response.data,
      );

 if (!response.data) {
  throw new Error("School dashboard returned an empty response.");
}

const normalized = normalizeSchoolDashboardResponse(
  response.data,
);

      if (
        membershipRole &&
        normalized.role !== membershipRole
      ) {
        throw new Error(
          `Your authenticated school role is ${membershipRole}, but the dashboard returned ${normalized.role}. Please sign in again or contact your school administrator.`,
        );
      }

      setDashboardRole(normalized.role);
      setDashboard(normalized.dashboard);
    } catch (err: unknown) {
      setDashboardRole(null);
      setDashboard(null);

      console.error("[SCHOOL DASHBOARD] Failed:", {
        message: getApiErrorMessage(err),
        status: axios.isAxiosError(err)
          ? err.response?.status
          : undefined,
        url: axios.isAxiosError(err)
          ? err.config?.url
          : undefined,
        response: axios.isAxiosError(err)
          ? err.response?.data
          : undefined,
        error: err,
      });

      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [
    isHydrated,
    slug,
    schoolId,
    schoolSubdomain,
    membershipRole,
  ]);

  useEffect(() => {
    if (!isHydrated) return;

    void fetchDashboard();
  }, [isHydrated, fetchDashboard]);

  const handleAdminRegistrationSuccess = () => {
    void fetchDashboard();
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (!isHydrated || (isLoading && !dashboard)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2
          size={34}
          className="animate-spin text-blue-600"
        />

        <p className="text-sm font-medium text-gray-500">
          Loading school dashboard...
        </p>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error && !dashboard) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center p-4 sm:p-6">
        <div className="w-full rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertCircle size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-gray-900">
                Unable to load dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {error}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading && (
                <Loader2 size={16} className="animate-spin" />
              )}
              Try Again
            </button>

            <Link
              href={schoolUrl}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              School Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (!dashboard || !dashboardRole) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6 text-center">
        <div>
          <AlertCircle
            size={32}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-3 font-semibold text-gray-800">
            No dashboard information available
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            The server did not return dashboard information for this account.
          </p>

          <button
            type="button"
            onClick={() => void fetchDashboard()}
            disabled={isLoading}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ============================================================
     ROLE-BASED DASHBOARD
  ============================================================ */

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {dashboardRole === "OWNER" && (
          <OwnerDashboard
            dashboard={dashboard as AdminSchoolDashboard}
          />
        )}

        {dashboardRole === "ADMIN" && (
          <AdminDashboard
            dashboard={dashboard as AdminSchoolDashboard}
          />
        )}

        {dashboardRole === "TEACHER" && (
          <TeacherDashboard
            dashboard={dashboard as TeacherDashboardData}
          />
        )}

        {dashboardRole === "STUDENT" && (
          <StudentDashboard
            dashboard={dashboard as StudentDashboardData}
          />
        )}

        {canRegisterAdmin && (
          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
                  <Users size={23} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    School Administrator Management
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Add and manage administrators for {schoolName}.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`${schoolUrl}/administrators`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  View Administrators
                  <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(true)}
                  disabled={!schoolId}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={17} />
                  Register Admin
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {schoolId && canRegisterAdmin && (
        <RegisterAdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          schoolId={schoolId}
          schoolSubdomain={schoolSubdomain || ""}
          onSuccess={handleAdminRegistrationSuccess}
        />
      )}
    </>
  );
}
