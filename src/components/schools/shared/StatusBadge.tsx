


import { ReactNode } from "react";
import { CheckCircle2, Clock3, XCircle, AlertCircle } from "lucide-react";

export type StatusType =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "PUBLISHED"
  | "DRAFT"
  | "CLOSED"
  | "EXPIRED"
  | "CANCELLED"
  | "FAILED";

type StatusBadgeProps = {
  status: StatusType | string;
  label?: string;
  showIcon?: boolean;
  className?: string;
};

type StatusConfig = {
  label: string;
  className: string;
  icon: ReactNode;
};

const statusConfig: Record<string, StatusConfig> = {
  ACTIVE: {
    label: "Active",
    className: "bg-green-50 text-green-700 ring-green-600/20",
    icon: <CheckCircle2 size={13} />,
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-600 ring-gray-500/20",
    icon: <XCircle size={13} />,
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-red-50 text-red-700 ring-red-600/20",
    icon: <XCircle size={13} />,
  },
  PENDING: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    icon: <Clock3 size={13} />,
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-50 text-green-700 ring-green-600/20",
    icon: <CheckCircle2 size={13} />,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-600/20",
    icon: <XCircle size={13} />,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
    icon: <CheckCircle2 size={13} />,
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-green-50 text-green-700 ring-green-600/20",
    icon: <CheckCircle2 size={13} />,
  },
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-600 ring-gray-500/20",
    icon: <Clock3 size={13} />,
  },
  CLOSED: {
    label: "Closed",
    className: "bg-gray-100 text-gray-600 ring-gray-500/20",
    icon: <XCircle size={13} />,
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-orange-50 text-orange-700 ring-orange-600/20",
    icon: <AlertCircle size={13} />,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 ring-red-600/20",
    icon: <XCircle size={13} />,
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 ring-red-600/20",
    icon: <AlertCircle size={13} />,
  },
};

export default function StatusBadge({
  status,
  label,
  showIcon = false,
  className = "",
}: StatusBadgeProps) {
  const normalizedStatus = String(status).trim().toUpperCase();

  const config = statusConfig[normalizedStatus] ?? {
    label: normalizedStatus
      ? normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase()
      : "Unknown",
    className: "bg-gray-100 text-gray-600 ring-gray-500/20",
    icon: <AlertCircle size={13} />,
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className} ${className}`}
      role="status"
    >
      {showIcon && config.icon}
      {label ?? config.label}
    </span>
  );
}
