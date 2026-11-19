




"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  School as SchoolIcon,
  CheckCircle2,
  Clock3,
  MoreVertical,
  Eye,
  Pencil,
  RefreshCw,
  Building2,
  AlertCircle,
  X,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Card from "@/components/schools/ui/Card";
import Input from "@/components/schools/ui/Input";
import StatsCard from "@/components/schools/shared/StatsCard";
import StatusBadge from "@/components/schools/shared/StatusBadge";
import Pagination from "@/components/schools/shared/Pagination";
import EmptyState from "@/components/schools/shared/EmptyState";
import LoadingState from "@/components/schools/shared/LoadingState";

import {
  getSchools,
  type School,
  type GetSchoolsParams,
} from "@/lib/schools/management/services/school.service";

/* =========================================================
   TYPES
========================================================= */

type SchoolStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING";

type SchoolAccessMode =
  | "STUDENT_PIN"
  | "SCHOOL_SUBSCRIPTION";

interface SchoolItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  slug?: string;
  status: SchoolStatus;
  accessMode: SchoolAccessMode;
  createdAt?: string;
  studentCount?: number;
}

interface SchoolPagination {
  schools: unknown[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "All statuses", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Pending", value: "PENDING" },
];

/* =========================================================
   RESPONSE HELPERS
========================================================= */

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(
  ...values: unknown[]
): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
}

function getNumber(
  value: unknown,
  fallback: number
): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : fallback;
}

function normalizeStatus(
  value: unknown,
  isActive?: unknown
): SchoolStatus {
  const status = String(value ?? "").toUpperCase();

  if (
    status === "ACTIVE" ||
    status === "INACTIVE" ||
    status === "SUSPENDED" ||
    status === "PENDING"
  ) {
    return status;
  }

  if (isActive === true) return "ACTIVE";
  if (isActive === false) return "INACTIVE";

  return "PENDING";
}

function normalizeAccessMode(value: unknown): SchoolAccessMode {
  return value === "STUDENT_PIN"
    ? "STUDENT_PIN"
    : "SCHOOL_SUBSCRIPTION";
}

function normalizeSchool(value: unknown): SchoolItem | null {
  if (!isRecord(value)) return null;

  const id = getString(
    value.id,
    value._id,
    value.schoolId
  );

  const name = getString(
    value.schoolName,
    value.name
  );

  if (!id || !name) return null;

  return {
    id,
    name,
    email: getString(
      value.schoolEmail,
      value.email
    ),
    phone: getString(
      value.schoolPhone,
      value.phone
    ),
    address: getString(value.address),
    slug: getString(
      value.subDomain,
      value.subdomain,
      value.slug
    ),
    status: normalizeStatus(
      value.status,
      value.isActive
    ),
    accessMode: normalizeAccessMode(value.accessMode),
    createdAt: getString(value.createdAt),
    studentCount: getNumber(value.studentCount, 0),
  };
}

/**
 * Supports common backend response formats:
 *
 * { success, data: [...] }
 * { success, data: { schools: [...] } }
 * { success, data: { data: { schools: [...] } } }
 * { success, data: { schools: [...], totalCount, totalPages } }
 */



function extractSchoolPagination(
  response: unknown,
  requestedPage: number
): SchoolPagination {
  let current: unknown = response;

  for (let depth = 0; depth < 5; depth += 1) {
    if (!isRecord(current)) break;

    // Your backend's actual response property is schoolObj.
    const schools =
      current.schoolObj ??
      current.schools;

    if (Array.isArray(schools)) {
      const totalCount = getNumber(
        current.totalCount ?? current.total,
        schools.length
      );

      return {
        schools,
        totalCount,
        totalPages: Math.max(
          1,
          getNumber(
            current.totalPages,
            Math.ceil(totalCount / PAGE_SIZE) || 1
          )
        ),
        currentPage: getNumber(
          current.currentPage ?? current.page,
          requestedPage
        ),
      };
    }

    // Handle APIs returning data directly as an array.
    if (Array.isArray(current.data)) {
      const totalCount = getNumber(
        current.totalCount ?? current.total,
        current.data.length
      );

      return {
        schools: current.data,
        totalCount,
        totalPages: Math.max(
          1,
          getNumber(
            current.totalPages,
            Math.ceil(totalCount / PAGE_SIZE) || 1
          )
        ),
        currentPage: getNumber(
          current.currentPage ?? current.page,
          requestedPage
        ),
      };
    }

    current = current.data;
  }

  if (Array.isArray(current)) {
    return {
      schools: current,
      totalCount: current.length,
      totalPages: Math.max(
        1,
        Math.ceil(current.length / PAGE_SIZE)
      ),
      currentPage: requestedPage,
    };
  }

  return {
    schools: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: requestedPage,
  };
}


/* =========================================================
   DISPLAY HELPERS
========================================================= */

function getSchoolInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getAccessModeLabel(mode: SchoolAccessMode) {
  return mode === "STUDENT_PIN"
    ? "Student PIN"
    : "School Subscription";
}

/* =========================================================
   PAGE
========================================================= */

export default function SchoolsPage() {
  const router = useRouter();

  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /* =========================================================
     LOAD SCHOOLS
  ========================================================= */

  const loadSchools = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const params: GetSchoolsParams = {
        page: currentPage,
        limit: PAGE_SIZE,
      };

      const response = await getSchools(params);

      const pagination = extractSchoolPagination(
        response,
        currentPage
      );

      const normalizedSchools = pagination.schools
        .map(normalizeSchool)
        .filter((school): school is SchoolItem => school !== null);

      setSchools(normalizedSchools);
      setTotalCount(pagination.totalCount);
      setTotalPages(pagination.totalPages);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load schools. Please try again.";

      setError(message);
      setSchools([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    void loadSchools();
  }, [loadSchools]);

  /* =========================================================
     FILTERS
  ========================================================= */

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        school.name.toLowerCase().includes(searchValue) ||
        school.email?.toLowerCase().includes(searchValue) ||
        school.phone?.toLowerCase().includes(searchValue) ||
        school.address?.toLowerCase().includes(searchValue) ||
        school.slug?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        school.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [schools, search, statusFilter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
    return {
      total: totalCount,
      active: schools.filter(
        (school) => school.status === "ACTIVE"
      ).length,
      pending: schools.filter(
        (school) => school.status === "PENDING"
      ).length,
      suspended: schools.filter(
        (school) => school.status === "SUSPENDED"
      ).length,
    };
  }, [schools, totalCount]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleViewSchool = (schoolId: string) => {
    router.push(`/admin/schools/${encodeURIComponent(schoolId)}`);
  };

  const handleEditSchool = (schoolId: string) => {
    router.push(
      `/admin/schools/${encodeURIComponent(schoolId)}/edit`
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    setOpenMenuId(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6 pb-10">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Building2 size={16} />
            <span>Platform Administration</span>
            <span>/</span>
            <span className="text-gray-900">Schools</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Schools
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage registered schools across the Learnyfi platform.
          </p>
        </div>

        <Link href="/admin/schools/create">
          <Button leftIcon={<Plus size={18} />}>
            Create School
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Schools"
          value={statistics.total.toLocaleString()}
          description="Registered schools"
          icon={<SchoolIcon size={22} />}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <StatsCard
          title="Active Schools"
          value={statistics.active.toLocaleString()}
          description="Active on current page"
          icon={<CheckCircle2 size={22} />}
          iconClassName="bg-green-50 text-green-600"
        />

        <StatsCard
          title="Pending Schools"
          value={statistics.pending.toLocaleString()}
          description="Awaiting activation"
          icon={<Clock3 size={22} />}
          iconClassName="bg-yellow-50 text-yellow-600"
        />

        <StatsCard
          title="Suspended Schools"
          value={statistics.suspended.toLocaleString()}
          description="Suspended on current page"
          icon={<AlertCircle size={22} />}
          iconClassName="bg-red-50 text-red-600"
        />
      </div>

      {/* School listing */}
      <Card padding="none">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                All Schools
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage schools registered on the platform.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={15} />}
              onClick={loadSchools}
              isLoading={isLoading}
            >
              Refresh
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <div className="w-full md:flex-1">
              <Input
                placeholder="Search by school name, email or phone..."
                value={search}
                onChange={setSearch}
                leftIcon={<Search size={17} />}
                fullWidth
              />
            </div>

            <div className="relative w-full md:w-52">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {(search || statusFilter !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<X size={15} />}
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="m-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="p-5">
            <LoadingState
              variant="table"
              rows={6}
              columns={5}
            />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <Button
              variant="outline"
              leftIcon={<RefreshCw size={16} />}
              onClick={loadSchools}
            >
              Try again
            </Button>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<SchoolIcon size={34} />}
              title={
                search || statusFilter !== "ALL"
                  ? "No matching schools"
                  : "No schools registered yet"
              }
              description={
                search || statusFilter !== "ALL"
                  ? "Try changing your search or filters."
                  : "Create your first school to get started."
              }
              actionLabel={
                search || statusFilter !== "ALL"
                  ? "Clear filters"
                  : "Create School"
              }
              onAction={() => {
                if (search || statusFilter !== "ALL") {
                  clearFilters();
                } else {
                  router.push("/admin/schools/create");
                }
              }}
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50">
                  <tr className="border-y border-gray-100">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      School
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Access Mode
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date Created
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSchools.map((school) => (
                    <tr
                      key={school.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                            {getSchoolInitials(school.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {school.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {school.slug || school.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {school.email || "No email"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {school.phone || "No phone"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700">
                          {getAccessModeLabel(school.accessMode)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={school.status} />
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(school.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="relative inline-flex">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === school.id
                                  ? null
                                  : school.id
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            aria-label={`Actions for ${school.name}`}
                            aria-expanded={openMenuId === school.id}
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === school.id && (
                            <>
                              <button
                                type="button"
                                aria-label="Close actions menu"
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={() => setOpenMenuId(null)}
                              />

                              <div className="absolute right-0 top-10 z-20 w-44 rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-xl">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleViewSchool(school.id);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye size={16} />
                                  View details
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleEditSchool(school.id);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Pencil size={16} />
                                  Edit school
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                        {getSchoolInitials(school.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {school.name}
                        </h3>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {school.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={school.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        Access mode
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {getAccessModeLabel(school.accessMode)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Date created
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDate(school.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      leftIcon={<Eye size={15} />}
                      onClick={() => handleViewSchool(school.id)}
                    >
                      View
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      leftIcon={<Pencil size={15} />}
                      onClick={() => handleEditSchool(school.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-100 p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
                showItemCount
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
