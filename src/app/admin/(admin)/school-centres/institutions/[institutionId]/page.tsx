




"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  School,
  Users,
  XCircle,
  FileText,
  RefreshCw,
  Pencil,
} from "lucide-react";

const INSTITUTIONS_KEY = "learnyfi-school-centres-institutions";

type InstitutionStatus = "Pending" | "Active" | "Suspended";

type Institution = {
  id: string;
  name: string;
  type: "School" | "Study Centre";
  email: string;
  phone: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  state: string;
  city: string;
  address: string;
  description: string;
  status: InstitutionStatus;
  students: number;
  createdAt: string;
};

function readInstitutions(): Institution[] {
  try {
    const stored = localStorage.getItem(INSTITUTIONS_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Institution =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string"
    );
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusStyle(status?: string) {
  switch (status) {
    case "Active":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "Suspended":
      return "border-red-500/20 bg-red-500/10 text-red-400";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-200">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default function InstitutionDetailsPage() {
  const params = useParams<{ institutionId: string }>();
  const router = useRouter();

  const institutionId = decodeURIComponent(params.institutionId);

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  const loadInstitution = useCallback(() => {
    setLoading(true);

    const records = readInstitutions();
    const found = records.find((item) => item.id === institutionId);

    setInstitution(found ?? null);
    setLoading(false);
  }, [institutionId]);

  useEffect(() => {
    loadInstitution();

    const handleStorage = () => loadInstitution();
    const handleFocus = () => loadInstitution();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadInstitution]);

  const location = useMemo(() => {
    if (!institution) return "Not provided";

    return [
      institution.city,
      institution.state,
    ]
      .filter(Boolean)
      .join(", ") || "Not provided";
  }, [institution]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-32">
          <RefreshCw className="mr-3 animate-spin text-indigo-400" size={20} />
          <span className="text-sm text-slate-400">
            Loading institution details...
          </span>
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <XCircle size={30} />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Institution not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            This institution may have been deleted, or its details may no
            longer be available in this browser.
          </p>

          <button
            onClick={() => router.push("/admin/school-centres/institutions")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <ArrowLeft size={16} />
            Back to institutions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/school-centres/institutions"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to institutions
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Institution Profile
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              View and manage institution registration details.
            </p>
          </div>

          <button
            onClick={loadInstitution}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Institution overview */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="h-2 bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500" />

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                  {institution.type === "School" ? (
                    <School size={30} />
                  ) : (
                    <Building2 size={30} />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-xl font-bold sm:text-2xl">
                    {institution.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {institution.type || "Institution"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(
                        institution.status
                      )}`}
                    >
                      {institution.status === "Active" ? (
                        <CheckCircle2 size={13} />
                      ) : institution.status === "Suspended" ? (
                        <XCircle size={13} />
                      ) : (
                        <Clock3 size={13} />
                      )}
                      {institution.status || "Pending"}
                    </span>

                    <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-400">
                      ID: {institution.id}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/admin/school-centres/institutions"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <Pencil size={15} />
                Manage institutions
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Registered students</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  {Number(institution.students) || 0}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Users size={23} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Student count recorded for this institution.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Registration date</p>
                <p className="mt-2 text-lg font-bold">
                  {formatDate(institution.createdAt)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <CalendarDays size={23} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Date this institution was registered.
            </p>
          </div>
        </div>

        {/* Institution information */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Building2 size={20} />
            </div>

            <div>
              <h3 className="font-bold">Institution Information</h3>
              <p className="text-xs text-slate-500">
                Official institution details
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <DetailItem
              icon={Building2}
              label="Institution name"
              value={institution.name}
            />

            <DetailItem
              icon={School}
              label="Institution type"
              value={institution.type}
            />

            <DetailItem
              icon={Mail}
              label="Institution email"
              value={institution.email}
            />

            <DetailItem
              icon={Phone}
              label="Institution phone"
              value={institution.phone}
            />

            <DetailItem
              icon={MapPin}
              label="Location"
              value={location}
            />

            <DetailItem
              icon={MapPin}
              label="Street address"
              value={institution.address}
            />
          </div>

          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-medium text-slate-500">
              Institution description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {institution.description || "No description provided."}
            </p>
          </div>
        </section>

        {/* Contact person */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users size={20} />
            </div>

            <div>
              <h3 className="font-bold">Contact Person</h3>
              <p className="text-xs text-slate-500">
                Primary representative for this institution
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <DetailItem
              icon={Users}
              label="Contact person"
              value={institution.contactPerson}
            />

            <DetailItem
              icon={Mail}
              label="Contact email"
              value={institution.contactEmail}
            />

            <DetailItem
              icon={Phone}
              label="Contact phone"
              value={institution.contactPhone}
            />
          </div>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <div className="mb-5">
            <h3 className="font-bold">Institution Management</h3>
            <p className="mt-1 text-xs text-slate-500">
              Quick links to institution-related modules.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/school-centres/questions"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-indigo-500/50 hover:bg-slate-800"
            >
              <FileText className="text-indigo-400" size={20} />
              <div>
                <p className="text-sm font-semibold">Question Bank</p>
                <p className="text-xs text-slate-500">
                  Manage practice questions
                </p>
              </div>
            </Link>

            <Link
              href="/admin/school-centres/students"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-500/50 hover:bg-slate-800"
            >
              <Users className="text-cyan-400" size={20} />
              <div>
                <p className="text-sm font-semibold">Students</p>
                <p className="text-xs text-slate-500">
                  View registered students
                </p>
              </div>
            </Link>

            <Link
              href="/admin/school-centres/classes"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/50 hover:bg-slate-800"
            >
              <School className="text-violet-400" size={20} />
              <div>
                <p className="text-sm font-semibold">Classes</p>
                <p className="text-xs text-slate-500">
                  Manage institution classes
                </p>
              </div>
            </Link>

            <Link
              href="/admin/school-centres/assignments"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-amber-500/50 hover:bg-slate-800"
            >
              <FileText className="text-amber-400" size={20} />
              <div>
                <p className="text-sm font-semibold">Assignments</p>
                <p className="text-xs text-slate-500">
                  Manage practice assignments
                </p>
              </div>
            </Link>

            <Link
              href="/admin/school-centres/results"
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-emerald-500/50 hover:bg-slate-800"
            >
              <CheckCircle2 className="text-emerald-400" size={20} />
              <div>
                <p className="text-sm font-semibold">Results</p>
                <p className="text-xs text-slate-500">
                  Review student performance
                </p>
              </div>
            </Link>
          </div>
        </section>

        <p className="text-center text-xs text-slate-600">
          Institution information is currently stored in this browser only.
          Connect a backend to synchronize records across devices and users.
        </p>
      </div>
    </div>
  );
}
