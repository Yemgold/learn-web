


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  KeyRound,
  Loader2,
  RefreshCw,
  Search,
  ShieldBan,
  ShieldCheck,
  Ticket,
  Users,
  X,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import StatusBadge from "@/components/schools/shared/StatusBadge";
import EmptyState from "@/components/schools/shared/EmptyState";
import LoadingState from "@/components/schools/shared/LoadingState";
import Pagination from "@/components/schools/shared/Pagination";

import { getSchools } from "@/lib/schools/management/services/school.service";
// import {
//   getSchoolAccessPins,
//   revokeSchoolAccessPin,
// } from "@/lib/schools/services/access-pin.service";

import { getSchoolAccessPins, revokeSchoolAccessPin, } from "@/lib/schools/management/services/access.service"; 

type PinStatus = "USED" | "UNUSED" | "REVOKED" | "EXPIRED";

interface SchoolOption {
  _id?: string;
  id?: string;
  schoolName?: string;
  name?: string;
}

interface AccessPin {
  _id?: string;
  id?: string;
  reference?: string;
  pinReference?: string;
  schoolId?: string;
  schoolName?: string;
  school?: {
    _id?: string;
    id?: string;
    schoolName?: string;
    name?: string;
  };
  status?: string;
  isUsed?: boolean;
  isRevoked?: boolean;
  studentName?: string;
  studentEmail?: string;
  studentId?: string;
  batchId?: string;
  batchName?: string;
  expiresAt?: string;
  usedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiEnvelope<T> {
  success?: boolean;
  status?: string;
  message?: string;
  data?: T;
}

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "All statuses", value: "ALL" },
  { label: "Unused", value: "UNUSED" },
  { label: "Used", value: "USED" },
  { label: "Revoked", value: "REVOKED" },
  { label: "Expired", value: "EXPIRED" },
];

function getId(item: { _id?: string; id?: string }): string {
  return item._id || item.id || "";
}

function unwrapResponse<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const result = response as {
    data?: unknown;
    success?: boolean;
  };

  // Standard Axios response: response.data is the API envelope.
  const body = result.data ?? response;

  if (body && typeof body === "object" && "data" in body) {
    const envelope = body as ApiEnvelope<T>;

    if (envelope.success === false) {
      throw new Error(envelope.message || "The request was unsuccessful.");
    }

    return (envelope.data ?? null) as T | null;
  }

  return body as T;
}

function getPinStatus(pin: AccessPin): PinStatus {
  const status = String(pin.status || "").toUpperCase();

  if (status === "REVOKED" || pin.isRevoked) {
    return "REVOKED";
  }

  if (status === "USED" || pin.isUsed) {
    return "USED";
  }

  if (status === "EXPIRED") {
    return "EXPIRED";
  }

  if (
    pin.expiresAt &&
    new Date(pin.expiresAt).getTime() < Date.now()
  ) {
    return "EXPIRED";
  }

  return "UNUSED";
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getSchoolName(pin: AccessPin): string {
  return (
    pin.school?.schoolName ||
    pin.school?.name ||
    pin.schoolName ||
    "Unknown school"
  );
}

function getPinReference(pin: AccessPin): string {
  // Only display a public reference, never a stored PIN hash.
  return pin.reference || pin.pinReference || getId(pin) || "—";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export default function SchoolAccessPinsPage() {
  const [pins, setPins] = useState<AccessPin[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);

  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedPin, setSelectedPin] = useState<AccessPin | null>(null);
  const [pinToRevoke, setPinToRevoke] = useState<AccessPin | null>(null);

  const [isRevoking, setIsRevoking] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadSchools = useCallback(async () => {
    try {
      const response = await getSchools({ page: 1, limit: 100 });
      const data = unwrapResponse<unknown>(response);

      if (Array.isArray(data)) {
        setSchools(data as SchoolOption[]);
        return;
      }

      if (data && typeof data === "object") {
        const result = data as {
          schools?: SchoolOption[];
          data?: SchoolOption[];
        };

        setSchools(result.schools || result.data || []);
      }
    } catch {
      // The PIN list remains usable even if the school filter fails.
      setSchools([]);
    }
  }, []);

  const loadPins = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setError("");

        const response = await getSchoolAccessPins({
  schoolId: selectedSchool || undefined,
});

        const data = unwrapResponse<unknown>(response);

        if (Array.isArray(data)) {
          setPins(data as AccessPin[]);
        } else if (data && typeof data === "object") {
          const result = data as {
            pins?: AccessPin[];
            accessPins?: AccessPin[];
            records?: AccessPin[];
            data?: AccessPin[];
          };

          setPins(
            result.pins ||
              result.accessPins ||
              result.records ||
              result.data ||
              []
          );
        } else {
          setPins([]);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedSchool]
  );

  useEffect(() => {
    void loadSchools();
  }, [loadSchools]);

  useEffect(() => {
    void loadPins();
  }, [loadPins]);

  const filteredPins = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pins.filter((pin) => {
      const status = getPinStatus(pin);

      const matchesStatus =
        selectedStatus === "ALL" || status === selectedStatus;

      const searchableText = [
        getPinReference(pin),
        getSchoolName(pin),
        pin.studentName || "",
        pin.studentEmail || "",
        pin.studentId || "",
        pin.batchId || "",
        pin.batchName || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [pins, search, selectedStatus]);

  const statistics = useMemo(() => {
    const counts = {
      total: pins.length,
      used: 0,
      unused: 0,
      revoked: 0,
      expired: 0,
    };

    pins.forEach((pin) => {
      const status = getPinStatus(pin);

      if (status === "USED") counts.used += 1;
      if (status === "UNUSED") counts.unused += 1;
      if (status === "REVOKED") counts.revoked += 1;
      if (status === "EXPIRED") counts.expired += 1;
    });

    return counts;
  }, [pins]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPins.length / PAGE_SIZE)
  );

  const paginatedPins = filteredPins.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStatus, selectedSchool]);

  const handleRevoke = async () => {
    if (!pinToRevoke) return;

    const pinId = getId(pinToRevoke);

    if (!pinId) {
      setActionError("This PIN does not have a valid record ID.");
      return;
    }

    try {
      setIsRevoking(true);
      setActionError("");
      setSuccessMessage("");

      const response = await revokeSchoolAccessPin(pinId);

      unwrapResponse<unknown>(response);

      setSuccessMessage("Access PIN revoked successfully.");
      setPinToRevoke(null);
      setSelectedPin(null);

      await loadPins(true);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsRevoking(false);
    }
  };

  const selectedSchoolName =
    schools.find((school) => getId(school) === selectedSchool)
      ?.schoolName ||
    schools.find((school) => getId(school) === selectedSchool)?.name ||
    "Selected school";

  return (
    <div className="space-y-6 pb-10">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <KeyRound size={16} />
            <span>School Management</span>
            <span>/</span>
            <span className="text-gray-800">Access PINs</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            School Access PINs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor school access PINs, usage, expiry and revocation.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void loadPins(true)}
          disabled={isRefreshing}
          leftIcon={
            isRefreshing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )
          }
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            {successMessage}
          </div>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total PINs"
          value={statistics.total}
          icon={<Ticket size={20} />}
          color="blue"
        />

        <StatCard
          label="Used PINs"
          value={statistics.used}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />

        <StatCard
          label="Unused PINs"
          value={statistics.unused}
          icon={<Clock size={20} />}
          color="amber"
        />

        <StatCard
          label="Revoked PINs"
          value={statistics.revoked}
          icon={<ShieldBan size={20} />}
          color="red"
        />

        <StatCard
          label="Expired PINs"
          value={statistics.expired}
          icon={<CalendarDays size={20} />}
          color="gray"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter size={17} />
            Filter access PINs
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search PIN, school, student..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={selectedSchool}
              onChange={(event) =>
                setSelectedSchool(event.currentTarget.value)
              }
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All schools</option>

              {schools.map((school) => (
                <option key={getId(school)} value={getId(school)}>
                  {school.schoolName || school.name || "Unnamed school"}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.currentTarget.value)
              }
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>
              Showing {filteredPins.length} of {pins.length} PIN records
            </span>

            {(search || selectedSchool || selectedStatus !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedSchool("");
                  setSelectedStatus("ALL");
                }}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PIN records */}
      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Access PIN records
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review PIN status, school assignment and expiry dates.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={15} />
              {selectedSchool ? selectedSchoolName : "All schools"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8">
              <LoadingState />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle
                size={32}
                className="mx-auto mb-3 text-red-400"
              />
              <p className="text-sm font-medium text-gray-800">
                Unable to load access PINs
              </p>
              <p className="mt-1 text-sm text-gray-500">{error}</p>

              <div className="mt-4">
                <Button
                  type="button"
                  onClick={() => void loadPins(true)}
                  leftIcon={<RefreshCw size={15} />}
                >
                  Try again
                </Button>
              </div>
            </div>
          ) : filteredPins.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No access PINs found"
                description={
                  pins.length === 0
                    ? "There are no access PIN records available yet."
                    : "Try changing your search or filter settings."
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-y border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4">PIN reference</th>
                      <th className="px-5 py-4">School</th>
                      <th className="px-5 py-4">Student</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Expiry date</th>
                      <th className="px-5 py-4">Created</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedPins.map((pin) => {
                      const status = getPinStatus(pin);

                      return (
                        <tr
                          key={getId(pin)}
                          className="transition hover:bg-gray-50/70"
                        >
                          <td className="px-5 py-4">
                            <span className="font-mono text-sm font-semibold text-gray-800">
                              {getPinReference(pin)}
                            </span>

                            {pin.batchName && (
                              <p className="mt-1 text-xs text-gray-400">
                                {pin.batchName}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {getSchoolName(pin)}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-800">
                              {pin.studentName || "Not assigned"}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {pin.studentEmail || pin.studentId || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <PinStatusBadge status={status} />
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {formatDate(pin.expiresAt)}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {formatDate(pin.createdAt)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedPin(pin)}
                                title="View PIN details"
                                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                              >
                                <Eye size={16} />
                              </button>

                              {status === "UNUSED" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionError("");
                                    setPinToRevoke(pin);
                                  }}
                                  title="Revoke PIN"
                                  className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                                >
                                  <ShieldBan size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile records */}
              <div className="divide-y divide-gray-100 md:hidden">
                {paginatedPins.map((pin) => {
                  const status = getPinStatus(pin);

                  return (
                    <div key={getId(pin)} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-all font-mono text-sm font-semibold text-gray-900">
                            {getPinReference(pin)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {getSchoolName(pin)}
                          </p>
                        </div>

                        <PinStatusBadge status={status} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">Student</p>
                          <p className="mt-1 font-medium text-gray-700">
                            {pin.studentName || "Not assigned"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Expires</p>
                          <p className="mt-1 font-medium text-gray-700">
                            {formatDate(pin.expiresAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          leftIcon={<Eye size={14} />}
                          onClick={() => setSelectedPin(pin)}
                        >
                          Details
                        </Button>

                        {status === "UNUSED" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            leftIcon={<ShieldBan size={14} />}
                            onClick={() => {
                              setActionError("");
                              setPinToRevoke(pin);
                            }}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="border-t border-gray-100 px-4 py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* PIN details modal */}
      {selectedPin && (
        <ModalShell
          title="Access PIN details"
          onClose={() => setSelectedPin(null)}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                PIN reference
              </p>
              <p className="mt-2 break-all font-mono text-lg font-bold text-blue-950">
                {getPinReference(selectedPin)}
              </p>
              <p className="mt-2 text-xs text-blue-700">
                The secret PIN value is not displayed in this admin view.
              </p>
            </div>

            <DetailRow
              label="School"
              value={getSchoolName(selectedPin)}
            />

            <DetailRow
              label="Student"
              value={selectedPin.studentName || "Not assigned"}
            />

            <DetailRow
              label="Student email"
              value={selectedPin.studentEmail || "—"}
            />

            <DetailRow
              label="Student ID"
              value={selectedPin.studentId || "—"}
            />

            <DetailRow
              label="Batch"
              value={selectedPin.batchName || selectedPin.batchId || "—"}
            />

            <DetailRow
              label="Status"
              value={getPinStatus(selectedPin)}
            />

            <DetailRow
              label="Created"
              value={formatDate(selectedPin.createdAt)}
            />

            <DetailRow
              label="Expires"
              value={formatDate(selectedPin.expiresAt)}
            />

            <DetailRow
              label="Used"
              value={formatDate(selectedPin.usedAt)}
            />

            <div className="flex justify-end pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedPin(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Revoke confirmation */}
      {pinToRevoke && (
        <ModalShell
          title="Revoke access PIN"
          onClose={() => {
            if (!isRevoking) {
              setPinToRevoke(null);
              setActionError("");
            }
          }}
        >
          <div className="space-y-4">
            <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
              <ShieldBan
                size={22}
                className="shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-semibold text-red-900">
                  Are you sure you want to revoke this PIN?
                </p>
                <p className="mt-1 text-sm text-red-700">
                  This action will prevent the unused PIN from being used
                  for access.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">PIN reference</p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-900">
                {getPinReference(pinToRevoke)}
              </p>
            </div>

            {actionError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isRevoking}
                onClick={() => {
                  setPinToRevoke(null);
                  setActionError("");
                }}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                disabled={isRevoking}
                isLoading={isRevoking}
                loadingText="Revoking..."
                onClick={handleRevoke}
                leftIcon={
                  !isRevoking ? <ShieldBan size={16} /> : undefined
                }
              >
                Revoke PIN
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* ---------------------------------------------
   Statistics card
--------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "amber" | "red" | "gray";
}) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorStyles[color]}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------
   PIN status badge
--------------------------------------------- */

function PinStatusBadge({ status }: { status: PinStatus }) {
  const styles: Record<PinStatus, string> = {
    USED: "bg-green-50 text-green-700 ring-green-200",
    UNUSED: "bg-amber-50 text-amber-700 ring-amber-200",
    REVOKED: "bg-red-50 text-red-700 ring-red-200",
    EXPIRED: "bg-gray-100 text-gray-600 ring-gray-200",
  };

  const labels: Record<PinStatus, string> = {
    USED: "Used",
    UNUSED: "Unused",
    REVOKED: "Revoked",
    EXPIRED: "Expired",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

/* ---------------------------------------------
   Detail row
--------------------------------------------- */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="max-w-[65%] break-words text-right text-sm font-medium text-gray-800">
        {value}
      </span>
    </div>
  );
}

/* ---------------------------------------------
   Modal shell
--------------------------------------------- */

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
