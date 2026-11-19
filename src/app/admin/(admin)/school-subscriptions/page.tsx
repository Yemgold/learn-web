

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";
import Input from "@/components/schools/ui/Input";
import StatsCard from "@/components/schools/shared/StatsCard";
import StatusBadge from "@/components/schools/shared/StatusBadge";
import EmptyState from "@/components/schools/shared/EmptyState";
import LoadingState from "@/components/schools/shared/LoadingState";
import Pagination from "@/components/schools/shared/Pagination";

import {
  getSchoolSubscriptions,
  updateSchoolSubscriptionStatus,
} from "@/lib/schools/management/services/subscription.service";

import type {
  SchoolSubscriptionStatus,
} from "@/lib/schools/management/services/subscription.service";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type SubscriptionStatusFilter = "ALL" | SchoolSubscriptionStatus;

interface SchoolSubscription {
  _id?: string;
  id?: string;

  schoolId?: string;

  school?: {
    _id?: string;
    id?: string;
    schoolName?: string;
    name?: string;
    subDomain?: string;
    schoolEmail?: string;
  };

  schoolName?: string;

  planId?: string;

  plan?: {
    _id?: string;
    id?: string;
    name?: string;
  };

  planName?: string;

  amount?: number;
  price?: number;
  currency?: string;

  billingCycle?: "MONTHLY" | "YEARLY" | string;

  status?: SchoolSubscriptionStatus | string;
  paymentStatus?: string;
  paymentReference?: string;

  startsAt?: string;
  startDate?: string;

  expiresAt?: string;
  endDate?: string;
  nextBillingDate?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface SubscriptionListData {
  subscriptions?: SchoolSubscription[];
  schoolSubscriptions?: SchoolSubscription[];
  records?: SchoolSubscription[];
  data?: SchoolSubscription[];

  total?: number;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}

interface NormalizedResponse {
  subscriptions: SchoolSubscription[];
  total: number;
  totalPages: number;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const PAGE_SIZE = 10;

const STATUS_OPTIONS: {
  label: string;
  value: SubscriptionStatusFilter;
}[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Suspended", value: "SUSPENDED" },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getId(subscription: SchoolSubscription): string {
  return subscription._id || subscription.id || "";
}

function getSchoolName(subscription: SchoolSubscription): string {
  return (
    subscription.school?.schoolName ||
    subscription.school?.name ||
    subscription.schoolName ||
    "Unknown school"
  );
}

function getPlanName(subscription: SchoolSubscription): string {
  return subscription.plan?.name || subscription.planName || "Unknown plan";
}

function getSubscriptionStatus(
  subscription: SchoolSubscription
): string {
  return String(subscription.status || "PENDING").toUpperCase();
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(
  amount?: number,
  currency = "NGN"
): string {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

function normalizeResponse(response: unknown): NormalizedResponse {
  const root = response as Record<string, unknown> | null;

  // Supports both AxiosResponse and an unwrapped API response.
  const responseData =
    root && "data" in root ? root.data : response;

  const envelope = responseData as Record<string, unknown> | null;

  const nestedData =
    envelope &&
    "data" in envelope
      ? envelope.data
      : responseData;

  const payload = nestedData as
    | SubscriptionListData
    | SchoolSubscription[]
    | null;

  if (Array.isArray(payload)) {
    return {
      subscriptions: payload,
      total: payload.length,
      totalPages: 1,
    };
  }

  const records =
    payload?.subscriptions ||
    payload?.schoolSubscriptions ||
    payload?.records ||
    payload?.data ||
    [];

  return {
    subscriptions: Array.isArray(records) ? records : [],

    total:
      typeof payload?.totalCount === "number"
        ? payload.totalCount
        : typeof payload?.total === "number"
          ? payload.total
          : Array.isArray(records)
            ? records.length
            : 0,

    totalPages:
      typeof payload?.totalPages === "number"
        ? payload.totalPages
        : 1,
  };
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SchoolSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<
    SchoolSubscription[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<SubscriptionStatusFilter>("ALL");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Fetch subscriptions                                                      */
  /* ------------------------------------------------------------------------ */

  const fetchSubscriptions = useCallback(
    async (showRefresh = false) => {
      try {
        setError("");

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getSchoolSubscriptions({
          page,
          limit: PAGE_SIZE,
          search: search.trim() || undefined,
          status:
            statusFilter === "ALL" ? undefined : statusFilter,
        });

        const result = normalizeResponse(response);

        setSubscriptions(result.subscriptions);
        setTotal(result.total);
        setTotalPages(Math.max(1, result.totalPages));
      } catch (err) {
        console.error(
          "Failed to fetch school subscriptions:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load school subscriptions."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, statusFilter]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchSubscriptions();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchSubscriptions]);

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const stats = useMemo(() => {
    const active = subscriptions.filter(
      (item) => getSubscriptionStatus(item) === "ACTIVE"
    ).length;

    const pending = subscriptions.filter(
      (item) => getSubscriptionStatus(item) === "PENDING"
    ).length;

    const expired = subscriptions.filter(
      (item) => getSubscriptionStatus(item) === "EXPIRED"
    ).length;

    return {
      total,
      active,
      pending,
      expired,
    };
  }, [subscriptions, total]);

  /* ------------------------------------------------------------------------ */
  /* Update subscription status                                               */
  /* ------------------------------------------------------------------------ */

  const handleStatusUpdate = async (
    subscription: SchoolSubscription,
    nextStatus: SchoolSubscriptionStatus
  ) => {
    const subscriptionId = getId(subscription);

    if (!subscriptionId) {
      setError("This subscription does not have a valid ID.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to change this subscription to ${nextStatus.toLowerCase()}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(subscriptionId);
      setError("");
      setSuccess("");

      await updateSchoolSubscriptionStatus(subscriptionId, {
        status: nextStatus,
      });

      setSuccess(
        `Subscription successfully updated to ${nextStatus.toLowerCase()}.`
      );

      await fetchSubscriptions(true);
    } catch (err) {
      console.error(
        "Failed to update subscription:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update this subscription."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Filters                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (
    value: SubscriptionStatusFilter
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6 pb-10">

      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/admin"
              className="hover:text-blue-600"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-gray-900">
              School subscriptions
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            School subscriptions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor subscription plans, billing status, and renewals
            across all registered schools.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          leftIcon={<RefreshCw size={16} />}
          onClick={() => void fetchSubscriptions(true)}
          isLoading={refreshing}
        >
          Refresh
        </Button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{error}</p>
        </div>
      )}

      {/* Success alert */}
      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{success}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total subscriptions"
          value={stats.total}
          icon={<CreditCard size={20} />}
          description="All school subscriptions"
        />

        <StatsCard
          title="Active subscriptions"
          value={stats.active}
          icon={<CheckCircle2 size={20} />}
          description="Active on this page"
        />

        <StatsCard
          title="Pending subscriptions"
          value={stats.pending}
          icon={<Clock3 size={20} />}
          description="Awaiting activation"
        />

        <StatsCard
          title="Expired subscriptions"
          value={stats.expired}
          icon={<XCircle size={20} />}
          description="Expired on this page"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-semibold text-gray-900">
              Subscription records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search and filter subscriptions by school or status.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search school name, plan, or reference..."
                value={search}
                onChange={handleSearchChange}
                leftIcon={<Search size={17} />}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusFilterChange(
                  event.currentTarget.value as SubscriptionStatusFilter
                )
              }
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              aria-label="Filter by subscription status"
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
        </CardContent>
      </Card>

      {/* Subscription records */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8">
              <LoadingState />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No subscriptions found"
                description="School subscription records will appear here when available."
                icon={<CreditCard size={28} />}
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        School
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Plan
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Amount
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Billing
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Start date
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Expiry date
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {subscriptions.map((subscription) => {
                      const id = getId(subscription);
                      const status = getSubscriptionStatus(subscription);

                      const schoolId =
                        subscription.school?._id ||
                        subscription.school?.id ||
                        subscription.schoolId;

                      return (
                        <tr
                          key={
                            id ||
                            `${getSchoolName(subscription)}-${subscription.createdAt}`
                          }
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900">
                              {getSchoolName(subscription)}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {subscription.school?.subDomain
                                ? `${subscription.school.subDomain}.learnyfi.com`
                                : subscription.school?.schoolEmail || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-medium text-gray-800">
                              {getPlanName(subscription)}
                            </span>
                          </td>

                          <td className="px-5 py-4 font-medium text-gray-900">
                            {formatAmount(
                              subscription.amount ?? subscription.price,
                              subscription.currency || "NGN"
                            )}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {subscription.billingCycle || "—"}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {formatDate(
                              subscription.startsAt ||
                                subscription.startDate
                            )}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {formatDate(
                              subscription.expiresAt ||
                                subscription.endDate ||
                                subscription.nextBillingDate
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={status} />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {schoolId && (
                                <Link
                                  href={`/admin/schools/${schoolId}`}
                                  title="View school"
                                  className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                >
                                  <Eye size={16} />
                                </Link>
                              )}

                              {status === "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="success"
                                  isLoading={updatingId === id}
                                  disabled={Boolean(updatingId)}
                                  onClick={() =>
                                    void handleStatusUpdate(
                                      subscription,
                                      "ACTIVE"
                                    )
                                  }
                                >
                                  Activate
                                </Button>
                              )}

                              {status === "ACTIVE" && (
                                <Button
                                  size="sm"
                                  variant="danger"
                                  isLoading={updatingId === id}
                                  disabled={Boolean(updatingId)}
                                  onClick={() =>
                                    void handleStatusUpdate(
                                      subscription,
                                      "SUSPENDED"
                                    )
                                  }
                                >
                                  Suspend
                                </Button>
                              )}

                              {status === "SUSPENDED" && (
                                <Button
                                  size="sm"
                                  variant="success"
                                  isLoading={updatingId === id}
                                  disabled={Boolean(updatingId)}
                                  onClick={() =>
                                    void handleStatusUpdate(
                                      subscription,
                                      "ACTIVE"
                                    )
                                  }
                                >
                                  Reactivate
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 lg:hidden">
                {subscriptions.map((subscription) => {
                  const id = getId(subscription);
                  const status = getSubscriptionStatus(subscription);

                  const schoolId =
                    subscription.school?._id ||
                    subscription.school?.id ||
                    subscription.schoolId;

                  return (
                    <div
                      key={
                        id ||
                        `${getSchoolName(subscription)}-${subscription.createdAt}`
                      }
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-gray-900">
                            {getSchoolName(subscription)}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {getPlanName(subscription)}
                          </p>
                        </div>

                        <StatusBadge status={status} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">
                            Amount
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {formatAmount(
                              subscription.amount ?? subscription.price,
                              subscription.currency || "NGN"
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Billing
                          </p>

                          <p className="mt-1 font-medium text-gray-800">
                            {subscription.billingCycle || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Start date
                          </p>

                          <p className="mt-1 text-gray-800">
                            {formatDate(
                              subscription.startsAt ||
                                subscription.startDate
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Expiry date
                          </p>

                          <p className="mt-1 text-gray-800">
                            {formatDate(
                              subscription.expiresAt ||
                                subscription.endDate ||
                                subscription.nextBillingDate
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                        {schoolId && (
                          <Link
                            href={`/admin/schools/${schoolId}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Eye size={15} />
                            View school
                            <ArrowRight size={14} />
                          </Link>
                        )}

                        {status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="success"
                            isLoading={updatingId === id}
                            disabled={Boolean(updatingId)}
                            onClick={() =>
                              void handleStatusUpdate(
                                subscription,
                                "ACTIVE"
                              )
                            }
                          >
                            Activate
                          </Button>
                        )}

                        {status === "ACTIVE" && (
                          <Button
                            size="sm"
                            variant="danger"
                            isLoading={updatingId === id}
                            disabled={Boolean(updatingId)}
                            onClick={() =>
                              void handleStatusUpdate(
                                subscription,
                                "SUSPENDED"
                              )
                            }
                          >
                            Suspend
                          </Button>
                        )}

                        {status === "SUSPENDED" && (
                          <Button
                            size="sm"
                            variant="success"
                            isLoading={updatingId === id}
                            disabled={Boolean(updatingId)}
                            onClick={() =>
                              void handleStatusUpdate(
                                subscription,
                                "ACTIVE"
                              )
                            }
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && subscriptions.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {subscriptions.length} of {total} subscriptions
          </p>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Information */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0"
        />

        <p>
          Subscription status changes affect the selected school&apos;s
          access to subscription-based services. Confirm changes
          carefully.
        </p>
      </div>
    </div>
  );
}
