




"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Pencil,
  Save,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";

import { apiClient } from "@/lib/api";

import Button from "@/components/schools/ui/Button";
import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";
import StatusBadge from "@/components/schools/shared/StatusBadge";
import LoadingState from "@/components/schools/shared/LoadingState";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type SchoolMemberRole =
  | "STUDENT"
  | "TEACHER"
  | "ADMINISTRATOR";

interface SchoolAdministrator {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: SchoolMemberRole | string;
  isActive: boolean;
  schoolId?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdministratorForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const INITIAL_FORM: AdministratorForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const isRecord = (
  value: unknown
): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const getAdministratorId = (
  administrator: SchoolAdministrator
): string => {
  return administrator._id || administrator.id || "";
};

const unwrapResponse = <T,>(response: unknown): T => {
  let result = response;

  for (let index = 0; index < 3; index += 1) {
    if (!isRecord(result)) break;

    if (result.success === false) {
      throw new Error(
        typeof result.message === "string"
          ? result.message
          : "The request could not be completed."
      );
    }

    if ("data" in result && result.data !== undefined) {
      result = result.data;
      continue;
    }

    break;
  }

  return result as T;
};

const formatDate = (date?: string): string => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function AdministratorDetailsPage() {
  const params = useParams<{ slug: string; id: string }>();
  const router = useRouter();

  const slug = params.slug;
  const administratorId = params.id;

  const [administrator, setAdministrator] =
    useState<SchoolAdministrator | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] =
    useState<AdministratorForm>(INITIAL_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ------------------------------------------------------------------------ */
  /*                              LOAD ADMIN                                  */
  /* ------------------------------------------------------------------------ */

  const loadAdministrator = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await apiClient.get<unknown>(
          `/schools/members/${encodeURIComponent(administratorId)}`
        );

        const member = unwrapResponse<SchoolAdministrator>(response);

        if (!member || typeof member !== "object") {
          throw new Error("Administrator information was not found.");
        }

        const role = String(member.role)
          .toUpperCase()
          .replace(/[\s-]/g, "_");

        if (
          ![
            "ADMINISTRATOR",
            "SCHOOL_ADMIN",
            "SCHOOL_ADMINISTRATOR",
            "ADMIN",
          ].includes(role)
        ) {
          throw new Error(
            "This member is not registered as a school administrator."
          );
        }

        setAdministrator(member);

        setForm({
          firstName: member.firstName || "",
          lastName: member.lastName || "",
          email: member.email || "",
          phone: member.phone || "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load administrator details."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [administratorId]
  );

  useEffect(() => {
    if (administratorId) {
      void loadAdministrator();
    }
  }, [administratorId, loadAdministrator]);

  /* ------------------------------------------------------------------------ */
  /*                              UPDATE FORM                                 */
  /* ------------------------------------------------------------------------ */

  const handleEdit = () => {
    if (!administrator) return;

    setForm({
      firstName: administrator.firstName || "",
      lastName: administrator.lastName || "",
      email: administrator.email || "",
      phone: administrator.phone || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (!administrator) return;

    setForm({
      firstName: administrator.firstName || "",
      lastName: administrator.lastName || "",
      email: administrator.email || "",
      phone: administrator.phone || "",
    });

    setIsEditing(false);
    setError("");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!administrator) return;

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email address is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await apiClient.patch<unknown>(
        `/schools/members/${encodeURIComponent(administratorId)}`,
        {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || undefined,
        }
      );

      const updated = unwrapResponse<SchoolAdministrator>(response);

      setAdministrator((current) => ({
        ...current!,
        ...updated,
        firstName: updated.firstName || form.firstName.trim(),
        lastName: updated.lastName || form.lastName.trim(),
        email: updated.email || form.email.trim().toLowerCase(),
        phone: updated.phone ?? form.phone.trim(),
      }));

      setIsEditing(false);
      setSuccess("Administrator details updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update administrator details."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                            ACCOUNT STATUS                                */
  /* ------------------------------------------------------------------------ */

  const handleStatusChange = async () => {
    if (!administrator) return;

    const nextStatus = !administrator.isActive;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus ? "activate" : "deactivate"
      } this administrator account?`
    );

    if (!confirmed) return;

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccess("");

      const response = await apiClient.patch<unknown>(
        `/schools/members/${encodeURIComponent(administratorId)}/status`,
        {
          isActive: nextStatus,
        }
      );

      const updated = unwrapResponse<SchoolAdministrator>(response);

      setAdministrator((current) => {
        if (!current) return current;

        return {
          ...current,
          ...updated,
          isActive:
            typeof updated.isActive === "boolean"
              ? updated.isActive
              : nextStatus,
        };
      });

      setSuccess(
        `Administrator account ${
          nextStatus ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update administrator status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                  STATES                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <LoadingState message="Loading administrator details..." />
    );
  }

  if (!administrator) {
    return (
      <div className="space-y-5">
        <Link
          href={`/schools/${slug}/administrators`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Administrators
        </Link>

        <Card>
          <CardContent>
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />

              <h2 className="text-lg font-semibold text-gray-900">
                Administrator not found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {error || "This administrator could not be found."}
              </p>

              <div className="mt-5 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Go Back
                </Button>

                <Button
                  variant="primary"
                  onClick={() => void loadAdministrator()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb */}
      <div>
        <Link
          href={`/schools/${slug}/administrators`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Administrators
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="h-4 w-4" />
              <span>School Management</span>
              <span>/</span>
              <Link
                href={`/schools/${slug}/administrators`}
                className="hover:text-blue-600"
              >
                Administrators
              </Link>
              <span>/</span>
              <span>Details</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Administrator Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage this administrator's account.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => void loadAdministrator(true)}
              isLoading={refreshing}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>

            {!isEditing && (
              <Button
                variant="primary"
                onClick={handleEdit}
                leftIcon={<Pencil className="h-4 w-4" />}
              >
                Edit Administrator
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{success}</p>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Administrator profile */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-2xl font-bold text-blue-700">
              {administrator.profileImage ? (
                <img
                  src={administrator.profileImage}
                  alt={`${administrator.firstName} ${administrator.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(
                  administrator.firstName,
                  administrator.lastName
                )
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {administrator.firstName} {administrator.lastName}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {administrator.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  Administrator
                </span>

                <StatusBadge
                  status={
                    administrator.isActive ? "Active" : "Inactive"
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  administrator.isActive ? "danger" : "success"
                }
                onClick={() => void handleStatusChange()}
                isLoading={updatingStatus}
                leftIcon={
                  administrator.isActive ? (
                    <UserX className="h-4 w-4" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )
                }
              >
                {administrator.isActive
                  ? "Deactivate Account"
                  : "Activate Account"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details and account information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main information */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Administrator contact and identity details.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        First Name *
                      </label>

                      <input
                        id="firstName"
                        type="text"
                        required
                        value={form.firstName}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            firstName: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Last Name *
                      </label>

                      <input
                        id="lastName"
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            lastName: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Email Address *
                      </label>

                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={saving}
                      leftIcon={<X className="h-4 w-4" />}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={saving}
                      leftIcon={<Save className="h-4 w-4" />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                      First Name
                    </p>
                    <p className="font-medium text-gray-900">
                      {administrator.firstName || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Last Name
                    </p>
                    <p className="font-medium text-gray-900">
                      {administrator.lastName || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Email Address
                    </p>
                    <p className="break-all font-medium text-gray-900">
                      {administrator.email}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Phone Number
                    </p>
                    <p className="font-medium text-gray-900">
                      {administrator.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account information */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  School membership and account dates.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Account Role
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                      Administrator
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-50 p-2 text-green-600">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Account Status
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                      {administrator.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Date Added
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(administrator.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                    <RefreshCw className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Last Updated
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(administrator.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      School ID
                    </p>
                    <p className="mt-1 break-all font-medium text-gray-900">
                      {administrator.schoolId || "Managed by school account"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h2>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-gray-900">
                      {administrator.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-50 p-2 text-green-600">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {administrator.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Account Actions
              </h2>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleEdit}
                  disabled={isEditing}
                  leftIcon={<Pencil className="h-4 w-4" />}
                >
                  Edit Details
                </Button>

                <Button
                  variant={
                    administrator.isActive ? "danger" : "success"
                  }
                  fullWidth
                  onClick={() => void handleStatusChange()}
                  isLoading={updatingStatus}
                  leftIcon={
                    administrator.isActive ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )
                  }
                >
                  {administrator.isActive
                    ? "Deactivate Administrator"
                    : "Activate Administrator"}
                </Button>

                <Link
                  href={`/schools/${slug}/administrators`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Administrators
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
