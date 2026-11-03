// GET    /api/v1/schools
// POST   /api/v1/schools
// PATCH  /api/v1/schools/:schoolId
// PATCH  /api/v1/schools/:schoolId/status




"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  School,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Building2,
  ExternalLink,
  AlertCircle,
  Palette,
} from "lucide-react";

interface SchoolRecord {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt?: string;
}

interface SchoolForm {
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://myandyemi-qanda-backend.onrender.com/api/v1"
).replace(/\/$/, "");

const EMPTY_FORM: SchoolForm = {
  name: "",
  slug: "",
  email: "",
  phone: "",
  address: "",
  logo: "",
  primaryColor: "#2563eb",
  secondaryColor: "#ffffff",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getErrorMessage(data: any, fallback: string) {
  return (
    data?.message ||
    data?.error ||
    data?.errors?.[0]?.message ||
    fallback
  );
}

export default function SchoolsManagementPage() {
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] =
    useState<SchoolRecord | null>(null);

  const [form, setForm] = useState<SchoolForm>(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("accessToken")
        : null;

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const request = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...getHeaders(),
          ...(options.headers || {}),
        },
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, `Request failed (${response.status})`)
        );
      }

      return data;
    },
    [getHeaders]
  );

  const loadSchools = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await request("/schools");

      const records =
        Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.data?.schools)
              ? result.data.schools
              : Array.isArray(result?.schools)
                ? result.schools
                : [];

      const normalized: SchoolRecord[] = records.map((school: any) => ({
        id: String(school.id ?? school._id ?? ""),
        name: school.name ?? school.schoolName ?? "Unnamed School",
        slug: school.slug ?? school.subdomain ?? "",
        subdomain: school.subdomain ?? school.slug ?? "",
        logo: school.logo ?? school.logoUrl ?? "",
        primaryColor: school.primaryColor ?? "#2563eb",
        secondaryColor: school.secondaryColor ?? "#ffffff",
        email: school.email ?? "",
        phone: school.phone ?? "",
        address: school.address ?? "",
        isActive: school.isActive ?? school.status === "active",
        createdAt: school.createdAt,
      }));

      setSchools(normalized);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load schools."
      );
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  const filteredSchools = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return schools;

    return schools.filter((school) =>
      [
        school.name,
        school.slug,
        school.subdomain,
        school.email,
        school.phone,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [schools, search]);

  const activeCount = schools.filter((school) => school.isActive).length;
  const inactiveCount = schools.length - activeCount;

  function updateForm<K extends keyof SchoolForm>(
    key: K,
    value: SchoolForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function openCreateForm() {
    setEditingSchool(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function openEditForm(school: SchoolRecord) {
    setEditingSchool(school);

    setForm({
      name: school.name,
      slug: school.slug || school.subdomain,
      email: school.email,
      phone: school.phone || "",
      address: school.address || "",
      logo: school.logo || "",
      primaryColor: school.primaryColor || "#2563eb",
      secondaryColor: school.secondaryColor || "#ffffff",
    });

    setShowForm(true);
    setMessage("");
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingSchool(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    const slug = createSlug(form.slug || form.name);

    if (!form.name.trim()) {
      setError("Please enter the school name.");
      return;
    }

    if (!slug) {
      setError("Please enter a valid school subdomain.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter the school's email address.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug,
      subdomain: slug,
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      logo: form.logo.trim(),
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
    };

    setSaving(true);

    try {
      if (editingSchool) {
        await request(`/schools/${encodeURIComponent(editingSchool.id)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        setMessage("School updated successfully.");
      } else {
        await request("/schools", {
          method: "POST",
          body: JSON.stringify({
            ...payload,
            isActive: true,
          }),
        });

        setMessage("School registered successfully.");
      }

      closeForm();
      await loadSchools();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save school."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleSchoolStatus(school: SchoolRecord) {
    const action = school.isActive ? "deactivate" : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${school.name}?`
      )
    ) {
      return;
    }

    setStatusUpdating(school.id);
    setError("");
    setMessage("");

    try {
      await request(
        `/schools/${encodeURIComponent(school.id)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !school.isActive,
          }),
        }
      );

      setMessage(`${school.name} has been ${action}d.`);
      await loadSchools();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update school status."
      );
    } finally {
      setStatusUpdating(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Building2 size={19} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Learnyfi Administration
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              School Management
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Register schools and manage their individual Learnyfi portals.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus size={19} />
            Register New School
          </button>
        </div>

        {/* Notifications */}
        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            <CheckCircle2 size={19} />
            {message}
            <button
              onClick={() => setMessage("")}
              className="ml-auto"
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Schools
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {schools.length}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <School size={25} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Active Schools
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {activeCount}
                </p>
              </div>
              <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950/50">
                <CheckCircle2 size={25} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Inactive Schools
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-500">
                  {inactiveCount}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/50">
                <XCircle size={25} />
              </div>
            </div>
          </div>
        </div>

        {/* School list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Registered Schools
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage your schools and their portals.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search schools..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 sm:w-64"
                />
              </div>

              <button
                onClick={loadSchools}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={30} />
              <p className="text-sm text-slate-500">
                Loading registered schools...
              </p>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="rounded-2xl bg-slate-100 p-5 text-slate-400 dark:bg-slate-800">
                <School size={35} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800 dark:text-white">
                {search ? "No schools found" : "No schools registered yet"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {search
                  ? "Try another search term."
                  : "Register your first school to create its own Learnyfi portal."}
              </p>

              {!search && (
                <button
                  onClick={openCreateForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Register First School
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-950/60">
                    <tr>
                      <th className="px-5 py-4 font-semibold">School</th>
                      <th className="px-5 py-4 font-semibold">Portal</th>
                      <th className="px-5 py-4 font-semibold">Contact</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredSchools.map((school) => (
                      <tr
                        key={school.id}
                        className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                              style={{
                                backgroundColor: school.primaryColor || "#2563eb",
                              }}
                            >
                              {school.logo ? (
                                <img
                                  src={school.logo}
                                  alt={school.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <School className="text-white" size={22} />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {school.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {school.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <a
                            href={`https://${school.subdomain}.learnyfi.com.ng`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {school.subdomain}.learnyfi.com.ng
                            <ExternalLink size={13} />
                          </a>
                        </td>

                        <td className="px-5 py-4">
                          <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Mail size={14} />
                            {school.email || "No email"}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={13} />
                            {school.phone || "No phone"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              school.isActive
                                ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                                : "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                            }`}
                          >
                            {school.isActive ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <XCircle size={13} />
                            )}
                            {school.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditForm(school)}
                              title="Edit school"
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-950/40"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => toggleSchoolStatus(school)}
                              disabled={statusUpdating === school.id}
                              title={school.isActive ? "Deactivate school" : "Activate school"}
                              className={`rounded-lg border p-2 transition disabled:opacity-50 ${
                                school.isActive
                                  ? "border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-900"
                                  : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900"
                              }`}
                            >
                              {statusUpdating === school.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : school.isActive ? (
                                <XCircle size={16} />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </button>
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
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                        style={{
                          backgroundColor: school.primaryColor || "#2563eb",
                        }}
                      >
                        {school.logo ? (
                          <img
                            src={school.logo}
                            alt={school.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <School className="text-white" size={23} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {school.name}
                        </h3>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            school.isActive
                              ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                              : "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                          }`}
                        >
                          {school.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-2 break-all">
                        <Globe size={15} className="shrink-0" />
                        {school.subdomain}.learnyfi.com.ng
                      </p>
                      <p className="flex items-center gap-2 break-all">
                        <Mail size={15} className="shrink-0" />
                        {school.email || "No email"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={15} className="shrink-0" />
                        {school.phone || "No phone"}
                      </p>
                      {school.address && (
                        <p className="flex items-center gap-2">
                          <MapPin size={15} className="shrink-0" />
                          {school.address}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <button
                        onClick={() => openEditForm(school)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium dark:border-slate-700"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => toggleSchoolStatus(school)}
                        disabled={statusUpdating === school.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium disabled:opacity-50 dark:border-slate-700"
                      >
                        {statusUpdating === school.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : school.isActive ? (
                          <XCircle size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        {school.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Registration / Edit modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
            <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-7">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingSchool ? "Edit School" : "Register New School"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter the school's information and portal details.
                  </p>
                </div>

                <button
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    School Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setForm((previous) => ({
                        ...previous,
                        name,
                        ...(editingSchool
                          ? {}
                          : { slug: createSlug(name) }),
                      }));
                    }}
                    placeholder="e.g. De Rock International School"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    School Subdomain *
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                    <input
                      required
                      value={form.slug}
                      onChange={(event) =>
                        updateForm("slug", createSlug(event.target.value))
                      }
                      placeholder="derock"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                    />
                    <span className="flex items-center border-l border-slate-200 bg-slate-100 px-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 sm:px-4">
                      .learnyfi.com.ng
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    Portal: https://{form.slug || "school"}.learnyfi.com.ng
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Use letters, numbers and hyphens only. The subdomain must be unique.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      School Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateForm("email", event.target.value)
                      }
                      placeholder="school@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Phone Number
                    </label>
                    <input
                      value={form.phone}
                      onChange={(event) =>
                        updateForm("phone", event.target.value)
                      }
                      placeholder="08012345678"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    School Address
                  </label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(event) =>
                      updateForm("address", event.target.value)
                    }
                    placeholder="Enter the school's address"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    School Logo URL
                  </label>
                  <input
                    value={form.logo}
                    onChange={(event) =>
                      updateForm("logo", event.target.value)
                    }
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Enter a publicly accessible image URL. File upload can be added when your backend supports it.
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Palette size={17} className="text-blue-600" />
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      School Branding
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs text-slate-500">
                        Primary Colour
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                        <input
                          type="color"
                          value={form.primaryColor}
                          onChange={(event) =>
                            updateForm("primaryColor", event.target.value)
                          }
                          className="h-9 w-10 cursor-pointer rounded"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-300">
                          {form.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-slate-500">
                        Secondary Colour
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                        <input
                          type="color"
                          value={form.secondaryColor}
                          onChange={(event) =>
                            updateForm("secondaryColor", event.target.value)
                          }
                          className="h-9 w-10 cursor-pointer rounded"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-300">
                          {form.secondaryColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus size={17} />
                        {editingSchool ? "Save Changes" : "Register School"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
