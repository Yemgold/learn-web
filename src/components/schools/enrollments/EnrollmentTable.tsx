





import {
  ArrowLeftRight,
  CheckCircle2,
  X,
} from "lucide-react";

import type { EnrollmentTableProps } from "@/types/schools/enrollment.types"; 

import { formatDate,getEnrollmentId,
  getStatusColor,getStudentEmail,
  getStudentName,getObjectName, } from "@/lib/schools/utils/enrollment.utils"; 

export default function EnrollmentTable({
  enrollments,
  submitting,
  onTransfer,
  onUpdateStatus,
}: EnrollmentTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-4">Student</th>
            <th className="px-5 py-4">Admission Number</th>
            <th className="px-5 py-4">Class</th>
            <th className="px-5 py-4">Enrollment Date</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {enrollments.map((enrollment, index) => {
            const id = getEnrollmentId(enrollment);
            const status = (enrollment.status || "PENDING").toUpperCase();
            const studentName = getStudentName(enrollment);
            const email = getStudentEmail(enrollment);

            const className =
              getObjectName(enrollment.class) ||
              getObjectName(enrollment.classId) ||
              "Class unavailable";

            const admissionNumber =
              enrollment.admissionNumber ||
              enrollment.student?.admissionNumber ||
              "—";

            return (
              <tr
                key={id || index}
                className="transition hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                      {studentName
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        {studentName}
                      </p>
                      <p className="max-w-48 truncate text-xs text-gray-500">
                        {email || "No email available"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {admissionNumber}
                </td>

                <td className="px-5 py-4 text-sm text-gray-700">
                  {className}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {formatDate(
                    enrollment.enrollmentDate || enrollment.createdAt
                  )}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(status)}`}
                  >
                    {status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {status !== "COMPLETED" &&
                    status !== "WITHDRAWN" ? (
                      <>
                        <button
                          type="button"
                          title="Transfer student"
                          disabled={submitting}
                          onClick={() => onTransfer(enrollment)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                        >
                          <ArrowLeftRight size={16} />
                        </button>

                        <button
                          type="button"
                          title="Complete enrollment"
                          disabled={submitting}
                          onClick={() =>
                            onUpdateStatus(enrollment, "COMPLETED")
                          }
                          className="rounded-lg border border-gray-200 p-2 text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          type="button"
                          title="Withdraw enrollment"
                          disabled={submitting}
                          onClick={() =>
                            onUpdateStatus(enrollment, "WITHDRAWN")
                          }
                          className="rounded-lg border border-gray-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No actions
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
