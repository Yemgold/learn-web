







"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  School,
  MapPin,
  CalendarDays,
  Users,
  Trophy,
  BookOpen,
  Award,
  Pencil,
  ArrowRight,
  Wallet,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getCurrentUser,
  type LoginUser,
} from "@/lib/api/auth";

/**
 * Extra profile fields are optional because they are not
 * included in the LoginUser interface by default.
 */
interface ExtendedProfileUser extends LoginUser {
  phone?: string;
  dateOfBirth?: string | null;
  dob?: string | null;
  state?: string | null;
  school?: string | null;
  class?: string | null;
  grade?: string | null;
  preferredCourse?: string | null;
  team?: string | null;
}

function getDisplayValue(
  value: unknown,
  fallback = "Not provided",
): string {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  return fallback;
}

function formatDate(value?: string | null): string {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getPlanNames(plans: unknown): string {
  if (!Array.isArray(plans) || plans.length === 0) {
    return "No active plan listed";
  }

  const names = plans.map((plan) => {
    if (typeof plan === "string") {
      return plan.replace(/_/g, " ");
    }

    if (
      typeof plan === "object" &&
      plan !== null &&
      "name" in plan &&
      typeof plan.name === "string"
    ) {
      return plan.name;
    }

    if (
      typeof plan === "object" &&
      plan !== null &&
      "planName" in plan &&
      typeof plan.planName === "string"
    ) {
      return plan.planName;
    }

    return null;
  });

  const validNames = names.filter(
    (name): name is string => Boolean(name),
  );

  return validNames.length
    ? validNames.join(", ")
    : "Plan information unavailable";
}

export default function StudentProfilePage() {
  const [user, setUser] =
    useState<ExtendedProfileUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await getCurrentUser();

        if (!active) return;

        if (
          !response?.success ||
          !response.data
        ) {
          throw new Error(
            response?.message ||
              "Unable to retrieve your profile.",
          );
        }

        setUser(
          response.data as ExtendedProfileUser,
        );
      } catch (err: unknown) {
        if (!active) return;

        let message =
          "Unable to load your profile. Please try again.";

        if (typeof err === "object" && err !== null) {
          if (
            "response" in err &&
            typeof err.response === "object" &&
            err.response !== null &&
            "status" in err.response
          ) {
            const status = err.response.status;

            if (status === 401) {
              message =
                "Your session may have expired. Please sign in again.";
            } else if (status === 403) {
              message =
                "You do not have permission to view this profile.";
            } else {
              message =
                "The server could not load your profile. Please try again.";
            }
          } else if (
            "message" in err &&
            typeof err.message === "string"
          ) {
            message = err.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const refreshProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCurrentUser();

      if (!response?.success || !response.data) {
        throw new Error(
          response?.message ||
            "Unable to retrieve your profile.",
        );
      }

      setUser(
        response.data as ExtendedProfileUser,
      );
    } catch {
      setError(
        "Unable to refresh your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fullName = user
    ? [
        user.firstName,
        user.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim() || "Student"
    : "Student";

  const phone = user?.phoneNumber ?? user?.phone;
  const extendedUser = user as
    | (ExtendedProfileUser & {
        phone?: string;
      })
    | null;

  const walletBalance = user?.userWallet?.balance;

  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Student Portal
            </span>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              My Profile
            </h1>

            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              View your personal information, academic
              details, achievements and account information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={refreshProfile}
              disabled={loading}
              leftIcon={
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              }
            >
              Refresh
            </Button>

            <Link href="/student/profile/edit">
              <Button
                leftIcon={
                  <Pencil className="h-4 w-4" />
                }
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && !user && (
          <Card className="mb-8">
            <div className="flex items-center gap-4 py-6">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />

              <div>
                <p className="font-semibold text-slate-900">
                  Loading your profile...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Retrieving your account information.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-8 flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-semibold text-red-800">
                  Profile could not be loaded
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={refreshProfile}
              disabled={loading}
            >
              Try again
            </Button>
          </div>
        )}

        {/* Profile content */}
        {user && (
          <>
            {/* Profile Header */}
            <Card className="mb-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
                  {initials || (
                    <User className="h-14 w-14" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-3xl font-bold text-slate-900">
                    {fullName}
                  </h2>

                  <p className="mt-2 break-all text-slate-600">
                    {user.email}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Role: {getDisplayValue(user.role)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                        user.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />

                      {user.isVerified
                        ? "Verified Account"
                        : "Not Yet Verified"}
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {getDisplayValue(user.role, "USER")}
                    </span>

                    {user.hasPaid && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        Payment Confirmed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Statistics */}
            <div className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={
                  <Wallet className="mx-auto h-10 w-10 text-blue-600" />
                }
                value={
                  typeof walletBalance === "number"
                    ? `₦${walletBalance.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "—"
                }
                label="Wallet Balance"
              />

              <StatCard
                icon={
                  <BookOpen className="mx-auto h-10 w-10 text-indigo-600" />
                }
                value={getPlanNames(user.plans)}
                label="Learning Plans"
              />

              <StatCard
                icon={
                  <Award className="mx-auto h-10 w-10 text-green-600" />
                }
                value={user.hasPaid ? "Paid" : "Unconfirmed"}
                label="Payment Status"
              />

              <StatCard
                icon={
                  <CalendarDays className="mx-auto h-10 w-10 text-purple-600" />
                }
                value={formatDate(user.createdAt)}
                label="Member Since"
              />
            </div>

            {/* Details */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <h2 className="text-2xl font-bold text-slate-900">
                  Personal Information
                </h2>

                <div className="mt-8 space-y-6">
                  <InfoRow
                    icon={<User className="h-5 w-5" />}
                    label="First Name"
                    value={getDisplayValue(user.firstName)}
                  />

                  <InfoRow
                    icon={<User className="h-5 w-5" />}
                    label="Last Name"
                    value={getDisplayValue(user.lastName)}
                  />

                  <InfoRow
                    icon={<Mail className="h-5 w-5" />}
                    label="Email"
                    value={getDisplayValue(user.email)}
                  />

                  <InfoRow
                    icon={<Phone className="h-5 w-5" />}
                    label="Phone"
                    value={getDisplayValue(
                      extendedUser?.phoneNumber ??
                        extendedUser?.phone,
                    )}
                  />

                  <InfoRow
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Date of Birth"
                    value={formatDate(
                      extendedUser?.dateOfBirth ??
                        extendedUser?.dob,
                    )}
                  />

                  <InfoRow
                    icon={<MapPin className="h-5 w-5" />}
                    label="State"
                    value={getDisplayValue(
                      extendedUser?.state,
                    )}
                  />
                </div>
              </Card>

              {/* Academic Information */}
              <Card>
                <h2 className="text-2xl font-bold text-slate-900">
                  Academic Information
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Academic details will appear here when
                  they are available in your profile data.
                </p>

                <div className="mt-8 space-y-6">
                  <InfoRow
                    icon={<School className="h-5 w-5" />}
                    label="School"
                    value={getDisplayValue(
                      extendedUser?.school,
                    )}
                  />

                  <InfoRow
                    icon={<BookOpen className="h-5 w-5" />}
                    label="Class"
                    value={getDisplayValue(
                      extendedUser?.class ??
                        extendedUser?.grade,
                    )}
                  />

                  <InfoRow
                    icon={<Award className="h-5 w-5" />}
                    label="Preferred Course"
                    value={getDisplayValue(
                      extendedUser?.preferredCourse,
                    )}
                  />

                  <InfoRow
                    icon={<Users className="h-5 w-5" />}
                    label="Team"
                    value={getDisplayValue(
                      extendedUser?.team,
                    )}
                  />

                  <InfoRow
                    icon={<User className="h-5 w-5" />}
                    label="Referral Code"
                    value={getDisplayValue(
                      user.referralCode,
                    )}
                  />

                  <InfoRow
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Last Updated"
                    value={formatDate(user.updatedAt)}
                  />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-2 text-slate-600">
                Manage your learning and account.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/student/team">
                  <Button
                    fullWidth
                    variant="outline"
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                  >
                    View Team
                  </Button>
                </Link>

                <Link href="/student/results">
                  <Button
                    fullWidth
                    variant="outline"
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                  >
                    View Results
                  </Button>
                </Link>

                <Link href="/student/settings">
                  <Button
                    fullWidth
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                  >
                    Account Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
}

function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <Card hoverable className="text-center">
      {icon}

      <h2 className="mt-4 break-words text-2xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="mt-2 text-slate-600">
        {label}
      </p>
    </Card>
  );
}

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}
