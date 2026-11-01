


"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Filter,
  Plus,
  Search,
  School,
  SlidersHorizontal,
  Users,
  XCircle,
} from "lucide-react";

type InstitutionType = "All types" | "School" | "Study Centre";
type InstitutionStatus = "All" | "Active" | "Pending" | "Suspended";

type Institution = {
  id: string;
  name: string;
  type: Exclude<InstitutionType, "All types">;
  email: string;
  phone: string;
  location: string;
  students: number;
  status: Exclude<InstitutionStatus, "All">;
  createdAt: string;
};

type StoredInstitution = {
  id: string;
  name: string;
  type: "School" | "Study Centre";
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  status: "Active" | "Pending" | "Suspended";
  students: number;
  createdAt: string;
};

const STORAGE_KEY = "learnyfi-school-centres-institutions";

const statusStyles: Record<
  Institution["status"],
  { className: string; icon: LucideIcon }
> = {
  Active: {
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    icon: CheckCircle2,
  },
  Pending: {
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    icon: Clock3,
  },
  Suspended: {
    className: "border-red-500/20 bg-red-500/10 text-red-400",
    icon: XCircle,
  },
};

function readInstitutions(): Institution[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) return [];

    const parsed: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is StoredInstitution => {
        return (
          item !== null &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          (item.type === "School" || item.type === "Study Centre") &&
          typeof item.email === "string" &&
          typeof item.phone === "string"
        );
      })
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        email: item.email,
        phone: item.phone,
        location: [item.city, item.state].filter(Boolean).join(", ") ||
          item.address ||
          "Location not provided",
        students:
          typeof item.students === "number" ? item.students : 0,
        status:
          item.status === "Active" ||
          item.status === "Suspended" ||
          item.status === "Pending"
            ? item.status
            : "Pending",
        createdAt:
          typeof item.createdAt === "string" ? item.createdAt : "",
      }));
  } catch (error) {
    console.error("Unable to read institution records:", error);
    return [];
  }
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<InstitutionType>("All types");
  const [statusFilter, setStatusFilter] =
    useState<InstitutionStatus>("All");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load registrations from the same browser storage used by the form.
  useEffect(() => {
    function loadInstitutions() {
      setInstitutions(readInstitutions());
      setIsLoaded(true);
    }

    loadInstitutions();

    // Refresh if another browser tab changes the institution records.
    window.addEventListener("storage", loadInstitutions);

    // Refresh when the user returns to this browser tab.
    window.addEventListener("focus", loadInstitutions);

    return () => {
      window.removeEventListener("storage", loadInstitutions);
      window.removeEventListener("focus", loadInstitutions);
    };
  }, []);

  const filteredInstitutions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return institutions.filter((institution) => {
      const matchesSearch =
        !searchValue ||
        institution.name.toLowerCase().includes(searchValue) ||
        institution.email.toLowerCase().includes(searchValue) ||
        institution.location.toLowerCase().includes(searchValue) ||
        institution.phone.toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "All types" || institution.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || institution.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [institutions, search, typeFilter, statusFilter]);

  const activeCount = institutions.filter(
    (institution) => institution.status === "Active",
  ).length;

  const pendingCount = institutions.filter(
    (institution) => institution.status === "Pending",
  ).length;

  const totalStudents = institutions.reduce(
    (total, institution) => total + institution.students,
    0,
  );

  const hasFilters =
    search.trim() !== "" ||
    typeFilter !== "All types" ||
    statusFilter !== "All";

  function clearFilters() {
    setSearch("");
    setTypeFilter("All types");
    setStatusFilter("All");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link
            href="/admin/school-centres"
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            School & Study Centres
          </Link>
          <span>/</span>
          <span className="text-slate-200">Institutions</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-400">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                Institution directory
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Institutions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Register and manage schools and study centres using your
              platform&apos;s institution management system.
            </p>
          </div>

          <Link
            href="/admin/school-centres/institutions/register"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Register Institution
          </Link>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Institutions"
            value={isLoaded ? institutions.length : "—"}
            icon={Building2}
            color="blue"
          />

          <StatCard
            label="Active Institutions"
            value={isLoaded ? activeCount : "—"}
            icon={CheckCircle2}
            color="emerald"
          />

          <StatCard
            label="Pending Approval"
            value={isLoaded ? pendingCount : "—"}
            icon={Clock3}
            color="amber"
          />

          <StatCard
            label="Total Students"
            value={isLoaded ? totalStudents.toLocaleString() : "—"}
            icon={Users}
            color="violet"
          />
        </section>

        {/* Directory */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="border-b border-slate-800 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Institution directory
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Search and filter registered institutions.
                </p>
              </div>

              <Link
                href="/admin/school-centres/institutions/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-500/50 hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
                Add institution
              </Link>
            </div>

            {/* Search and filters */}
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_190px_190px_auto]">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, phone or location..."
                  className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <School className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value as InstitutionType)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500"
                >
                  <option>All types</option>
                  <option>School</option>
                  <option>Study Centre</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as InstitutionStatus)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Clear filters
              </button>
            </div>
          </div>

          {/* Loading */}
          {!isLoaded ? (
            <div className="px-5 py-14 text-center text-sm text-slate-400">
              Loading institutions...
            </div>
          ) : filteredInstitutions.length > 0 ? (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-medium">Institution</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium">Students</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInstitutions.map((institution) => {
                    const status = statusStyles[institution.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={institution.id}
                        className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                              <Building2 className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {institution.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {institution.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-300">
                          {institution.type}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {institution.location}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium tabular-nums text-slate-200">
                          {institution.students.toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {institution.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/school-centres/institutions/${institution.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 transition hover:text-blue-300"
                          >
                            View
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty state */
            <div className="px-5 py-14 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950">
                {hasFilters ? (
                  <Search className="h-7 w-7 text-slate-500" />
                ) : (
                  <Building2 className="h-7 w-7 text-blue-400" />
                )}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {hasFilters
                  ? "No matching institutions"
                  : "No institutions registered yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {hasFilters
                  ? "Try changing your search term or filters to find an institution."
                  : "Once you register a school or study centre, it will appear here. You can then manage its students, questions and practice activities."}
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                  >
                    <XCircle className="h-4 w-4" />
                    Clear filters
                  </button>
                )}

                <Link
                  href="/admin/school-centres/institutions/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <Plus className="h-4 w-4" />
                  Register first institution
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Information */}
        <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4">
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-300">
                Institution management
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Institution records are currently stored in this browser.
                They are not yet synchronised with the backend or shared
                between different devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <div className={`rounded-xl p-2.5 ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
