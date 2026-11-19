





import { BookOpen, ChevronDown, Loader2, Search, Users } from "lucide-react";

import EmptyState from "../shared/EmptyState";
import EnrollmentTable from "./EnrollmentTable";
import EnrollmentMobileCards from "./EnrollmentMobileCards";

import type { EnrollmentRecordsProps } from "@/types/schools/enrollment.types"; 

export default function EnrollmentRecords({
  academicSessionSelected,
  loading,
  enrollments,
  filteredEnrollments,
  search,
  statusFilter,
  schoolSubdomain,
  submitting,
  onSearchChange,
  onStatusChange,
  onTransfer,
  onUpdateStatus,
}: EnrollmentRecordsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Enrollment Records
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage students enrolled in this academic session.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search student or class..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => onStatusChange(event.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none focus:border-blue-500 sm:w-44"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="WITHDRAWN">Withdrawn</option>
              <option value="TRANSFERRED">Transferred</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {!academicSessionSelected ? (
        <EmptyState
          icon={<BookOpen size={28} />}
          title="Select an academic session"
          description="Choose an academic session from the dropdown above to view its student enrollment records."
        />
      ) : loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-500">
          <Loader2 size={28} className="animate-spin text-blue-600" />
          <p className="text-sm">Loading enrollment records...</p>
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title={
            enrollments.length === 0
              ? "No enrollments found"
              : "No matching enrollments"
          }
          description={
            enrollments.length === 0
              ? "There are no student enrollments in this academic session yet."
              : "Try changing your search or status filter."
          }
        />
      ) : (
        <>
          <EnrollmentTable
            enrollments={filteredEnrollments}
            submitting={submitting}
            onTransfer={onTransfer}
            onUpdateStatus={onUpdateStatus}
          />

          <EnrollmentMobileCards
            enrollments={filteredEnrollments}
            submitting={submitting}
            onTransfer={onTransfer}
            onUpdateStatus={onUpdateStatus}
          />
        </>
      )}

      <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {filteredEnrollments.length} of {enrollments.length} enrollment records
        </span>
        <span>
          {schoolSubdomain ? `School: ${schoolSubdomain}` : ""}
        </span>
      </div>
    </div>
  );
}
