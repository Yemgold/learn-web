




import {
  ArrowLeftRight,
  CheckCircle2,
  X,
} from "lucide-react";

import type { EnrollmentMobileCardsProps } from "@/types/schools/enrollment.types"; 

import { formatDate,getEnrollmentId,
  getStatusColor,getStudentEmail,
  getStudentName, getObjectName, } from "@/lib/schools/utils/enrollment.utils"; 

export default function EnrollmentMobileCards({
  enrollments,
  submitting,
  onTransfer,
  onUpdateStatus,
}: EnrollmentMobileCardsProps) {
  return (
    <div className="space-y-3 p-4 md:hidden">
      {enrollments.map((enrollment, index) => {
        const status = (enrollment.status || "PENDING").toUpperCase();
        const studentName = getStudentName(enrollment);

        const className =
          getObjectName(enrollment.class) ||
          getObjectName(enrollment.classId) ||
          "Class unavailable";

        const admissionNumber =
          enrollment.admissionNumber ||
          enrollment.student?.admissionNumber ||
          "—";

        return (
          <div
            key={getEnrollmentId(enrollment) || index}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                  {studentName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {studentName}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {getStudentEmail(enrollment) || "No email available"}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusColor(status)}`}
              >
                {status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Admission Number</p>
                <p className="mt-1 font-medium text-gray-700">
                  {admissionNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Class</p>
                <p className="mt-1 font-medium text-gray-700">
                  {className}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-gray-400">Enrollment Date</p>
                <p className="mt-1 font-medium text-gray-700">
                  {formatDate(
                    enrollment.enrollmentDate || enrollment.createdAt
                  )}
                </p>
              </div>
            </div>

            {status !== "COMPLETED" && status !== "WITHDRAWN" && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => onTransfer(enrollment)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ArrowLeftRight size={14} />
                  Transfer
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => onUpdateStatus(enrollment, "COMPLETED")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  Complete
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => onUpdateStatus(enrollment, "WITHDRAWN")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  <X size={14} />
                  Withdraw
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
