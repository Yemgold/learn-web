



import type {
  AdminSchoolDashboard,
  SchoolDashboardStats,
} from "@/lib/schools/portal/services/dashboard.service";

import {
  Users,
  GraduationCap,
  UserCog,
  UserCheck,
  UserX,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";

interface OwnerDashboardProps {
  dashboard: AdminSchoolDashboard;
}

type DataRecord = Record<string, unknown>;

function asRecord(value: unknown): DataRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : {};
}

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "object") {
    return Array.isArray(value)
      ? `${value.length} items`
      : "Available";
  }

  return String(value);
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={23} />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   SCHOOL INFORMATION CARD
============================================================ */

function SchoolInformation({
  school,
}: {
  school: DataRecord;
}) {
  const owner = asRecord(school.schoolOwner);

  const information = [
    {
      label: "School Email",
      value: school.schoolEmail,
      icon: Mail,
    },
    {
      label: "School Phone",
      value: school.schoolPhone,
      icon: Phone,
    },
    {
      label: "Location",
      value: [school.address, school.town, school.state]
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
        .join(", "),
      icon: MapPin,
    },
    {
      label: "School Subdomain",
      value: school.subDomain,
      icon: Building2,
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Building2 size={21} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              School Information
            </h2>
          </div>

          <p className="mt-3 text-xl font-bold text-gray-900">
            {formatValue(school.schoolName)}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                school.isActive === true
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {school.isActive === true ? "Active School" : "Inactive / Unknown"}
            </span>

            {typeof school.accessMode === "string" && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {formatLabel(school.accessMode)}
              </span>
            )}
          </div>
        </div>

        <ShieldCheck
          size={30}
          className="hidden text-green-600 sm:block"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {information.map((item) => {
          if (
            typeof item.value !== "string" ||
            !item.value.trim()
          ) {
            return null;
          }

          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex min-w-0 items-start gap-3 rounded-xl bg-gray-50 p-4"
            >
              <div className="rounded-lg bg-white p-2 text-gray-500">
                <Icon size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {(owner.firstName || owner.lastName || owner.email) && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <p className="text-sm font-semibold text-gray-800">
            School Owner
          </p>

          <p className="mt-2 text-sm text-gray-700">
            {[owner.firstName, owner.lastName]
              .filter(
                (value): value is string =>
                  typeof value === "string" && value.trim().length > 0
              )
              .join(" ") || "—"}
          </p>

          {typeof owner.email === "string" && (
            <p className="mt-1 text-sm text-gray-500">
              {owner.email}
            </p>
          )}

          {typeof owner.phoneNumber === "string" && (
            <p className="mt-1 text-sm text-gray-500">
              {owner.phoneNumber}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   RECENT DATA SECTION
============================================================ */

function DataSection({
  title,
  items,
}: {
  title: string;
  items: unknown;
}) {
  const records = Array.isArray(items) ? items : [];

  if (records.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <div className="space-y-3">
        {records.slice(0, 5).map((item, index) => {
          const record = asRecord(item);

          return (
            <div
              key={String(record._id ?? record.id ?? index)}
              className="rounded-xl bg-gray-50 p-3"
            >
              {Object.entries(record)
                .filter(
                  ([key, value]) =>
                    ![
                      "_id",
                      "id",
                      "__v",
                      "password",
                    ].includes(key) &&
                    (typeof value === "string" ||
                      typeof value === "number")
                )
                .slice(0, 3)
                .map(([key, value]) => (
                  <p
                    key={key}
                    className="text-sm text-gray-700"
                  >
                    <span className="font-medium">
                      {formatLabel(key)}:
                    </span>{" "}
                    {formatValue(value)}
                  </p>
                ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   OWNER DASHBOARD
============================================================ */

export default function OwnerDashboard({
  dashboard,
}: OwnerDashboardProps) {
  const school = asRecord(dashboard.school);

  const stats = asRecord(
    dashboard.stats
  ) as SchoolDashboardStats;

  const totalStudents = stats.totalStudents ?? 0;
  const totalTeachers = stats.totalTeachers ?? 0;
  const totalAdministrators = stats.totalAdministrators ?? 0;
  const activeStudents = stats.activeStudents ?? 0;
  const inactiveStudents = stats.inactiveStudents ?? 0;

  const statCards = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: GraduationCap,
      description: "Students registered in your school",
    },
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: Users,
      description: "Teachers registered in your school",
    },
    {
      title: "Administrators",
      value: totalAdministrators,
      icon: UserCog,
      description: "School administrators",
    },
    {
      title: "Active Students",
      value: activeStudents,
      icon: UserCheck,
      description: "Currently active students",
    },
    {
      title: "Inactive Students",
      value: inactiveStudents,
      icon: UserX,
      description: "Currently inactive students",
    },
  ];

  const schoolName =
    typeof school.schoolName === "string"
      ? school.schoolName
      : "School Overview";

  return (
    <div className="space-y-6">

      {/* ======================================================
          WELCOME HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            School Owner Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome to {schoolName}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Here's an overview of your school's performance and operations.
          </p>
        </div>

        <div className="w-fit rounded-xl border border-green-100 bg-green-50 px-4 py-2">
          <p className="text-xs font-medium text-green-700">
            School Status
          </p>

          <p className="mt-1 text-sm font-bold text-green-800">
            {school.isActive === true ? "Active" : "Not confirmed"}
          </p>
        </div>
      </div>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            School Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Key statistics for your school.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          ))}
        </div>
      </section>

      {/* ======================================================
          SCHOOL INFORMATION
      ====================================================== */}

      <SchoolInformation school={school} />

      {/* ======================================================
          RECENT ACTIVITIES
          Display only when backend supplies records.
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataSection
          title="Recent Activities"
          items={
            dashboard.activities ??
            dashboard.recentActivities
          }
        />

        <DataSection
          title="Recent Assignments"
          items={dashboard.recentAssignments}
        />
      </div>

    </div>
  );
}
