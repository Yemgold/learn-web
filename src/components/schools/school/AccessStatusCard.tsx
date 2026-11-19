





"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  KeyRound,
  LockKeyhole,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Users,
  ArrowUpRight,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

export type SchoolAccessMode =
  | "STUDENT_PIN"
  | "SCHOOL_SUBSCRIPTION";

export type AccessStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "EXPIRED"
  | "SUSPENDED"
  | "CANCELLED"
  | "FAILED";

export interface AccessStatusCardProps {
  accessMode: SchoolAccessMode;
  status: AccessStatus | string;

  schoolName?: string;

  // Subscription information
  subscription?: {
    planName?: string;
    amount?: number;
    currency?: string;
    billingCycle?: string;
    startsAt?: string;
    expiresAt?: string;
    daysRemaining?: number;
    autoRenew?: boolean;
    maxStudents?: number;
    enrolledStudents?: number;
    paymentStatus?: AccessStatus | string;
  };

  // Student PIN information
  pins?: {
    total?: number;
    used?: number;
    remaining?: number;
    expiresAt?: string;
    batchName?: string;
  };

  // General access information
  access?: {
    grantedAt?: string;
    lastUpdated?: string;
    message?: string;
  };

  isLoading?: boolean;

  onManage?: () => void;
  onRenew?: () => void;
  onGeneratePins?: () => void;
  onViewDetails?: () => void;

  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
    icon: ReactNode;
  }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle2 size={14} />,
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <XCircle size={14} />,
  },
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock size={14} />,
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <AlertCircle size={14} />,
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <LockKeyhole size={14} />,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <XCircle size={14} />,
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <AlertTriangle size={14} />,
  },
};

function getStatusConfig(status?: string) {
  return (
    STATUS_CONFIG[status?.toUpperCase() ?? ""] ?? {
      label: status || "Unknown",
      className: "bg-gray-100 text-gray-600 border-gray-200",
      icon: <AlertCircle size={14} />,
    }
  );
}

function formatDate(date?: string) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatCurrency(amount?: number, currency = "NGN") {
  if (amount === undefined || !Number.isFinite(amount)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculatePercentage(used = 0, total = 0) {
  if (total <= 0) return 0;

  return Math.min(100, Math.max(0, (used / total) * 100));
}

function getDaysRemaining(expiresAt?: string) {
  if (!expiresAt) return undefined;

  const expiry = new Date(expiresAt);

  if (Number.isNaN(expiry.getTime())) return undefined;

  const difference = expiry.getTime() - Date.now();

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <div className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-100" />
        </div>
      </div>

      <div className="h-28 rounded-xl bg-gray-100" />

      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 rounded-lg bg-gray-100" />
        <div className="h-16 rounded-lg bg-gray-100" />
      </div>

      <div className="h-11 rounded-lg bg-gray-100" />
    </div>
  );
}

export default function AccessStatusCard({
  accessMode,
  status,
  schoolName,
  subscription,
  pins,
  access,
  isLoading = false,
  onManage,
  onRenew,
  onGeneratePins,
  onViewDetails,
  className = "",
}: AccessStatusCardProps) {
  const isPinAccess = accessMode === "STUDENT_PIN";

  const isExpired = status.toUpperCase() === "EXPIRED";
  const isActive = status.toUpperCase() === "ACTIVE";

  const subscriptionDays =
    subscription?.daysRemaining ??
    getDaysRemaining(subscription?.expiresAt);

  const pinTotal = pins?.total ?? 0;
  const pinUsed = pins?.used ?? 0;
  const pinRemaining = pins?.remaining ?? Math.max(0, pinTotal - pinUsed);

  const pinPercentage = calculatePercentage(pinUsed, pinTotal);

  const studentPercentage = calculatePercentage(
    subscription?.enrolledStudents ?? 0,
    subscription?.maxStudents ?? 0
  );

  const lowPinBalance = pinTotal > 0 && pinRemaining <= pinTotal * 0.2;

  const subscriptionNearExpiry =
    subscriptionDays !== undefined &&
    subscriptionDays >= 0 &&
    subscriptionDays <= 7;

  const showRenewButton =
    !isPinAccess && (isExpired || subscriptionNearExpiry);

  const accessModeLabel = isPinAccess
    ? "Student PIN Access"
    : "School Subscription";

  if (isLoading) {
    return (
      <div
        className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
      >
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isPinAccess
                ? "bg-purple-50 text-purple-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {isPinAccess ? (
              <KeyRound size={23} />
            ) : (
              <CreditCard size={23} />
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Access & Entitlement
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {schoolName || "School access information"}
            </p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="space-y-6 p-5">
        {/* Access mode */}
        <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
          <div>
            <p className="text-xs font-medium text-gray-500">
              Access Method
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {accessModeLabel}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isPinAccess
                ? "bg-purple-100 text-purple-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {isPinAccess ? (
              <KeyRound size={19} />
            ) : (
              <ShieldCheck size={19} />
            )}
          </div>
        </div>

        {/* PIN ACCESS */}
        {isPinAccess && (
          <>
            <section className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Student PIN Overview
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  Monitor PIN allocation and usage.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricCard
                  label="Total PINs"
                  value={pinTotal}
                  icon={<KeyRound size={17} />}
                />

                <MetricCard
                  label="Used PINs"
                  value={pinUsed}
                  icon={<Users size={17} />}
                />

                <MetricCard
                  label="Remaining PINs"
                  value={pinRemaining}
                  icon={<CheckCircle2 size={17} />}
                  highlight={lowPinBalance}
                />
              </div>
            </section>

            {/* PIN usage progress */}
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  PIN Usage
                </h4>

                <span className="text-xs font-semibold text-gray-600">
                  {pinPercentage.toFixed(0)}% used
                </span>
              </div>

              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-label="PIN usage"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pinPercentage)}
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    lowPinBalance ? "bg-amber-500" : "bg-purple-600"
                  }`}
                  style={{ width: `${pinPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{pinUsed} used</span>
                <span>{pinRemaining} remaining</span>
              </div>
            </section>

            {/* PIN details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem
                icon={<FileTextIcon />}
                label="PIN Batch"
                value={pins?.batchName || "Not available"}
              />

              <DetailItem
                icon={<CalendarDays size={17} />}
                label="PIN Expiry"
                value={formatDate(pins?.expiresAt)}
              />
            </div>

            {lowPinBalance && (
              <Notice
                variant="warning"
                message="Your remaining PIN balance is low. Consider generating another batch."
              />
            )}

            {isExpired && (
              <Notice
                variant="danger"
                message="The PIN access entitlement has expired. Students may be unable to access assessments."
              />
            )}
          </>
        )}

        {/* SCHOOL SUBSCRIPTION */}
        {!isPinAccess && (
          <>
            <section className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Subscription Details
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  Current school subscription information.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs text-gray-500">
                      Current Plan
                    </p>

                    <h4 className="mt-1 text-lg font-bold text-gray-900">
                      {subscription?.planName || "No active plan"}
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      {subscription?.billingCycle || "Billing cycle unavailable"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-gray-500">
                      Subscription Amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-blue-600">
                      {formatCurrency(
                        subscription?.amount,
                        subscription?.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Subscription Start"
                  value={formatDate(subscription?.startsAt)}
                />

                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Expiry Date"
                  value={formatDate(subscription?.expiresAt)}
                />

                <DetailItem
                  icon={<CreditCard size={17} />}
                  label="Payment Status"
                  value={
                    <StatusBadge
                      status={
                        subscription?.paymentStatus ??
                        (isActive ? "ACTIVE" : status)
                      }
                    />
                  }
                />

                <DetailItem
                  icon={<RefreshCw size={17} />}
                  label="Auto Renewal"
                  value={
                    subscription?.autoRenew === undefined
                      ? "Not available"
                      : subscription.autoRenew
                        ? "Enabled"
                        : "Disabled"
                  }
                />
              </div>
            </section>

            {/* Subscription expiry */}
            {subscriptionDays !== undefined && (
              <div
                className={`rounded-xl border p-4 ${
                  subscriptionDays < 0
                    ? "border-red-200 bg-red-50"
                    : subscriptionNearExpiry
                      ? "border-amber-200 bg-amber-50"
                      : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {subscriptionDays < 0 ? (
                    <AlertCircle
                      size={19}
                      className="mt-0.5 text-red-600"
                    />
                  ) : subscriptionNearExpiry ? (
                    <Clock
                      size={19}
                      className="mt-0.5 text-amber-600"
                    />
                  ) : (
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 text-green-600"
                    />
                  )}

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        subscriptionDays < 0
                          ? "text-red-800"
                          : subscriptionNearExpiry
                            ? "text-amber-800"
                            : "text-green-800"
                      }`}
                    >
                      {subscriptionDays < 0
                        ? "Subscription Expired"
                        : subscriptionDays === 0
                          ? "Subscription Expires Today"
                          : subscriptionNearExpiry
                            ? "Subscription Expiring Soon"
                            : "Subscription Active"}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        subscriptionDays < 0
                          ? "text-red-700"
                          : subscriptionNearExpiry
                            ? "text-amber-700"
                            : "text-green-700"
                      }`}
                    >
                      {subscriptionDays < 0
                        ? `Expired ${Math.abs(subscriptionDays)} days ago.`
                        : subscriptionDays === 0
                          ? "Your subscription expires today."
                          : `${subscriptionDays} days remaining on your subscription.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Student capacity */}
            {subscription?.maxStudents !== undefined && (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Student Capacity
                  </h4>

                  <span className="text-xs font-semibold text-gray-600">
                    {subscription.enrolledStudents ?? 0} /{" "}
                    {subscription.maxStudents}
                  </span>
                </div>

                <div
                  className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-label="Student capacity"
                  aria-valuemin={0}
                  aria-valuemax={subscription.maxStudents}
                  aria-valuenow={Math.min(
                    subscription.maxStudents,
                    subscription.enrolledStudents ?? 0
                  )}
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${studentPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {subscription.enrolledStudents ?? 0} enrolled
                  </span>

                  <span>
                    {Math.max(
                      0,
                      subscription.maxStudents -
                        (subscription.enrolledStudents ?? 0)
                    )}{" "}
                    available
                  </span>
                </div>
              </section>
            )}
          </>
        )}

        {/* General access information */}
        {access?.message && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
            {access.message}
          </div>
        )}

        {(access?.grantedAt || access?.lastUpdated) && (
          <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
            {access.grantedAt && (
              <DetailItem
                icon={<ShieldCheck size={17} />}
                label="Access Granted"
                value={formatDate(access.grantedAt)}
              />
            )}

            {access.lastUpdated && (
              <DetailItem
                icon={<Clock size={17} />}
                label="Last Updated"
                value={formatDate(access.lastUpdated)}
              />
            )}
          </div>
        )}

        {/* Actions */}
        {(onManage ||
          onRenew ||
          onGeneratePins ||
          onViewDetails) && (
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
            {onViewDetails && (
              <button
                type="button"
                onClick={onViewDetails}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                View Details
                <ArrowUpRight size={15} />
              </button>
            )}

            {onManage && (
              <button
                type="button"
                onClick={onManage}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Settings size={15} />
                Manage Access
              </button>
            )}

            {isPinAccess && onGeneratePins && (
              <button
                type="button"
                onClick={onGeneratePins}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <KeyRound size={16} />
                Generate PINs
              </button>
            )}

            {showRenewButton && onRenew && (
              <button
                type="button"
                onClick={onRenew}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Renew Subscription
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-amber-200 bg-amber-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            highlight
              ? "bg-amber-100 text-amber-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function Notice({
  variant,
  message,
}: {
  variant: "warning" | "danger";
  message: string;
}) {
  const styles =
    variant === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 ${styles}`}>
      <AlertTriangle size={17} className="mt-0.5 shrink-0" />
      <p className="text-xs leading-5">{message}</p>
    </div>
  );
}

function FileTextIcon() {
  return <KeyRound size={17} />;
}
