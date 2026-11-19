





"use client";

import {
  Pencil,
  Power,
  RefreshCw,
} from "lucide-react";

import type {AcademicPeriodTableProps,
} from "@/types/schools/academic-period.types";

import { formatAcademicDate,getPeriodActive,
  getPeriodId,getPeriodName, } from "@/lib/schools/utils/academic-period.utils"; 

export default function AcademicPeriodTable({
  periods,
  updatingStatusId,
  onEdit,
  onToggleStatus,
}: AcademicPeriodTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-4 font-semibold">
              Period
            </th>

            <th className="px-5 py-4 font-semibold">
              Period Number
            </th>

            <th className="px-5 py-4 font-semibold">
              Start Date
            </th>

            <th className="px-5 py-4 font-semibold">
              End Date
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
          {periods.map((period, index) => {
            const id = getPeriodId(period);
            const isActive = getPeriodActive(period);
            const isUpdating =
              updatingStatusId === id;

            return (
              <tr
                key={id || index}
                className="transition hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <div className="font-medium text-gray-900">
                    {getPeriodName(period)}
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {period.periodNumber ?? "—"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {formatAcademicDate(period.startDate)}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {formatAcademicDate(period.endDate)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(period)}
                      disabled={isUpdating}
                      title="Edit period"
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleStatus(period)
                      }
                      disabled={isUpdating}
                      title={
                        isActive
                          ? "Deactivate period"
                          : "Activate period"
                      }
                      className={`rounded-lg border p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        isActive
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-green-200 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {isUpdating ? (
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Power size={16} />
                      )}
                    </button>
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
