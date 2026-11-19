




"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit3,
  Globe,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";
import StatusBadge from "@/components/schools/shared/StatusBadge";

import {
  getSchoolById,
  type School,
  type SchoolAccessMode,
} from "@/lib/schools/management/services/school.service";

/* =========================================================
   TYPES
========================================================= */

interface SchoolOwner {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
}

interface SchoolDetails extends School {
  owner?: SchoolOwner;
  ownerDetails?: SchoolOwner;
  administratorsCount?: number;
  teachersCount?: number;
  studentsCount?: number;
}

type SchoolDetailsResponse = {
  success?: boolean;
  message?: string;
  data?: SchoolDetails | {
    school?: SchoolDetails;
    owner?: SchoolOwner;
  };
};

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

const getSchoolName = (school: SchoolDetails) =>
  school.schoolName || school.name || "Unnamed school";

const getSchoolEmail = (school: SchoolDetails) =>
  school.schoolEmail || school.email || "Not provided";

const getSchoolPhone = (school: SchoolDetails) =>
  school.schoolPhone || school.phone || "Not provided";

const getSchoolId = (school: SchoolDetails) =>
  school._id || school.id || "";

const getAccessModeLabel = (mode?: SchoolAccessMode) => {
  if (mode === "STUDENT_PIN") return "Student PIN Access";

  if (mode === "SCHOOL_SUBSCRIPTION") {
    return "School Subscription";
  }

  return "Not configured";
};

const getOwnerName = (owner?: SchoolOwner) => {
  if (!owner) return "Not provided";

  const name = [owner.firstName, owner.lastName]
    .filter(Boolean)
    .join(" ");

  return name || "Not provided";
};

/* =========================================================
   PAGE
========================================================= */

export default function SchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const schoolId = Array.isArray(params.schoolId)
    ? params.schoolId[0]
    : params.schoolId;

  const [school, setSchool] = useState<SchoolDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchool = useCallback(async () => {
    if (!schoolId) {
      setError("School ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSchoolById(schoolId);

      /*
       * Supports both:
       * { success, data: school }
       *
       * And:
       * { success, data: { school, owner } }
       */
      const result = response as unknown as SchoolDetailsResponse;

      if (result?.success === false) {
        throw new Error(
          result.message || "Unable to load school details."
        );
      }

      const data = result?.data;

      if (!data) {
        throw new Error("School information was not found.");
      }

      let schoolData: SchoolDetails;

      if ("school" in data && data.school) {
        schoolData = {
          ...data.school,
          owner: data.owner || data.school.owner,
        };
      } else {
        schoolData = data as SchoolDetails;
      }

      setSchool(schoolData);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading school details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    void fetchSchool();
  }, [fetchSchool]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-36 animate-pulse rounded-2xl bg-gray-100" />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error || !school) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/schools"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Schools
        </Link>

        <Card>
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <XCircle size={28} />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Unable to load school
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {error || "The requested school could not be found."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/schools")}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back to Schools
              </Button>

              <Button
                onClick={() => void fetchSchool()}
                leftIcon={<RefreshCw size={16} />}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =======================================================
     SCHOOL DATA
  ======================================================= */

  const schoolName = getSchoolName(school);
  const owner = school.owner || school.ownerDetails;
  const schoolIdValue = getSchoolId(school);

  const isActive =
    typeof school.isActive === "boolean"
      ? school.isActive
      : school.status?.toLowerCase() === "active";

  const status = isActive ? "active" : school.status || "inactive";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/schools"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Schools
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            School Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage this school on the Learnyfi platform.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => void fetchSchool()}
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/admin/schools/${encodeURIComponent(schoolIdValue || String(schoolId))}/edit`
              )
            }
            leftIcon={<Edit3 size={16} />}
          >
            Edit School
          </Button>
        </div>
      </div>

      {/* School Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Building2 size={32} />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-xl font-bold text-gray-900">
                  {schoolName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {school.subDomain
                    ? `${school.subDomain}.learnyfi.com.ng`
                    : "School subdomain not configured"}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={status} />

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    <ShieldCheck size={13} />
                    {getAccessModeLabel(school.accessMode)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 px-5 py-4 md:min-w-48">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                School ID
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-gray-700">
                {schoolIdValue || String(schoolId)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Information */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Mail size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">School Email</p>
              <p className="break-all text-sm font-semibold text-gray-900">
                {getSchoolEmail(school)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Phone size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">School Phone</p>
              <p className="text-sm font-semibold text-gray-900">
                {getSchoolPhone(school)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarDays size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Date Created</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(school.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Details */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* School Information */}
        <Card>
          <CardHeader
            title="School Information"
            description="Basic information and location of the school."
            icon={<Building2 size={19} />}
          />

          <CardContent className="space-y-5">
            <DetailRow
              label="School Name"
              value={schoolName}
              icon={<Building2 size={17} />}
            />

            <DetailRow
              label="Subdomain"
              value={
                school.subDomain
                  ? `${school.subDomain}.learnyfi.com.ng`
                  : "Not configured"
              }
              icon={<Globe size={17} />}
            />

            <DetailRow
              label="Email Address"
              value={getSchoolEmail(school)}
              icon={<Mail size={17} />}
            />

            <DetailRow
              label="Phone Number"
              value={getSchoolPhone(school)}
              icon={<Phone size={17} />}
            />

            <DetailRow
              label="State"
              value={school.state || "Not provided"}
              icon={<MapPin size={17} />}
            />

            <DetailRow
              label="Town"
              value={school.town || "Not provided"}
              icon={<MapPin size={17} />}
            />

            <DetailRow
              label="Address"
              value={school.address || "Not provided"}
              icon={<MapPin size={17} />}
            />
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card>
          <CardHeader
            title="School Owner"
            description="Contact information for the school's owner."
            icon={<UserRound size={19} />}
          />

          <CardContent className="space-y-5">
            <DetailRow
              label="Owner Name"
              value={getOwnerName(owner)}
              icon={<UserRound size={17} />}
            />

            <DetailRow
              label="Owner Email"
              value={owner?.email || "Not provided"}
              icon={<Mail size={17} />}
            />

            <DetailRow
              label="Owner Phone"
              value={
                owner?.phoneNumber || owner?.phone || "Not provided"
              }
              icon={<Phone size={17} />}
            />

            {!owner && (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Owner information was not included in the school details
                  response.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access Configuration */}
        <Card>
          <CardHeader
            title="Access Configuration"
            description="How members access this school's learning environment."
            icon={<KeyRound size={19} />}
          />

          <CardContent className="space-y-5">
            <DetailRow
              label="Access Mode"
              value={getAccessModeLabel(school.accessMode)}
              icon={<KeyRound size={17} />}
            />

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Access Mode Information
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    {school.accessMode === "STUDENT_PIN"
                      ? "Students access the school's learning environment using assigned access PINs."
                      : school.accessMode === "SCHOOL_SUBSCRIPTION"
                        ? "The school uses a subscription-based access model."
                        : "An access mode has not been configured for this school."}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/admin/school-access-pins"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage School Access PINs
              <ArrowRight size={16} />
            </Link>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader
            title="Account Status"
            description="Current activation status of this school."
            icon={<ShieldCheck size={19} />}
          />

          <CardContent>
            <div
              className={`flex items-start gap-3 rounded-xl p-4 ${
                isActive
                  ? "border border-green-100 bg-green-50"
                  : "border border-orange-100 bg-orange-50"
              }`}
            >
              {isActive ? (
                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />
              ) : (
                <Clock
                  size={21}
                  className="mt-0.5 shrink-0 text-orange-600"
                />
              )}

              <div>
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-green-800" : "text-orange-800"
                  }`}
                >
                  {isActive ? "School is Active" : "School is Not Active"}
                </p>

                <p
                  className={`mt-1 text-sm leading-6 ${
                    isActive ? "text-green-700" : "text-orange-700"
                  }`}
                >
                  {isActive
                    ? "This school is currently marked as active on the platform."
                    : "This school is currently inactive or awaiting activation."}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <DetailRow
                label="Account Status"
                value={String(status)}
                icon={
                  isActive ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <XCircle size={17} />
                  )
                }
              />

              <DetailRow
                label="Last Updated"
                value={formatDate(school.updatedAt)}
                icon={<CalendarDays size={17} />}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/schools")}
          leftIcon={<ArrowLeft size={16} />}
        >
          All Schools
        </Button>

        <Button
          onClick={() =>
            router.push(
              `/admin/schools/${encodeURIComponent(schoolIdValue || String(schoolId))}/edit`
            )
          }
          leftIcon={<Edit3 size={16} />}
        >
          Edit School
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE DETAIL ROW
========================================================= */

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function DetailRow({ label, value, icon }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}
