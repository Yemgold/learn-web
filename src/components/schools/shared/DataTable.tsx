




"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Pagination from "./Pagination";

export type DataTableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
};

export type DataTableAction<T> = {
  label: string;
  onClick: (row: T) => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  disabled?: (row: T) => boolean;
};

type DataTableProps<T extends { id?: string | number }> = {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField?: keyof T;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  actions?: DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPagination?: boolean;
  showPageSize?: boolean;
  className?: string;
  tableClassName?: string;
  loadingRows?: number;
  loadingColumns?: number;
};

export default function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  keyField = "id" as keyof T,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are currently no records to display.",
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  actions = [],
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  showPagination = false,
  showPageSize = false,
  className = "",
  tableClassName = "",
  loadingRows = 5,
  loadingColumns,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [openActionId, setOpenActionId] = useState<string | number | null>(
    null
  );

  const getRowId = (row: T, index: number): string | number => {
    const value = row[keyField];

    return value !== undefined && value !== null
      ? (value as string | number)
      : index;
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortConfig.key];
      const bValue = (b as Record<string, unknown>)[sortConfig.key];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const toggleSort = (key: string) => {
    setSortConfig((previous) => {
      if (previous?.key === key) {
        return {
          key,
          direction: previous.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key, direction: "asc" };
    });
  };

  const isSelected = (row: T) =>
    selectedRows.some(
      (selected) => getRowId(selected, 0) === getRowId(row, 0)
    );

  const allSelected =
    data.length > 0 && data.every((row) => isSelected(row));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (allSelected) {
      const currentIds = new Set(data.map((row, index) => getRowId(row, index)));

      onSelectionChange(
        selectedRows.filter(
          (row, index) => !currentIds.has(getRowId(row, index))
        )
      );
    } else {
      const existingIds = new Set(
        selectedRows.map((row, index) => getRowId(row, index))
      );

      onSelectionChange([
        ...selectedRows,
        ...data.filter(
          (row, index) => !existingIds.has(getRowId(row, index))
        ),
      ]);
    }
  };

  const handleSelectRow = (row: T) => {
    if (!onSelectionChange) return;

    if (isSelected(row)) {
      onSelectionChange(
        selectedRows.filter(
          (selected) => getRowId(selected, 0) !== getRowId(row, 0)
        )
      );
    } else {
      onSelectionChange([...selectedRows, row]);
    }
  };

  const renderCell = (row: T, column: DataTableColumn<T>, index: number) => {
    if (column.render) {
      return column.render(row, index);
    }

    const value = (row as Record<string, unknown>)[String(column.key)];

    if (String(column.key).toLowerCase().includes("status")) {
      return <StatusBadge status={String(value ?? "UNKNOWN")} />;
    }

    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400">—</span>;
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value);
  };

  const getAlignment = (align?: DataTableColumn<T>["align"]) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <LoadingState
          variant="table"
          rows={loadingRows}
          columns={loadingColumns ?? columns.length + (selectable ? 1 : 0) + (actions.length ? 1 : 0)}
        />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      </div>
    );
  }

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className={`w-full min-w-[700px] border-collapse ${tableClassName}`}>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {selectable && (
                <th className="w-12 px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows on this page"
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                  />
                </th>
              )}

              {columns.map((column) => {
                const key = String(column.key);
                const active = sortConfig?.key === key;

                return (
                  <th
                    key={key}
                    className={`px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 ${getAlignment(column.align)} ${column.headerClassName ?? ""}`}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(key)}
                        className="inline-flex items-center gap-1.5 hover:text-gray-900"
                      >
                        {column.header}

                        {active ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronsUpDown size={14} />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}

              {actions.length > 0 && (
                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sortedData.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIndex);

              return (
                <tr
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors hover:bg-gray-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {selectable && (
                    <td
                      className="px-4 py-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                        aria-label={`Select row ${rowIndex + 1}`}
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-4 text-sm text-gray-700 ${getAlignment(column.align)} ${column.className ?? ""}`}
                    >
                      {renderCell(row, column, rowIndex)}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td
                      className="px-4 py-4 text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenActionId((previous) =>
                              previous === rowId ? null : rowId
                            )
                          }
                          aria-label="Open row actions"
                          aria-expanded={openActionId === rowId}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <MoreHorizontal size={19} />
                        </button>

                        {openActionId === rowId && (
                          <>
                            <button
                              type="button"
                              aria-label="Close actions menu"
                              className="fixed inset-0 z-10 cursor-default"
                              onClick={() => setOpenActionId(null)}
                            />

                            <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white p-1 text-left shadow-lg">
                              {actions.map((action, actionIndex) => {
                                const isDisabled =
                                  action.disabled?.(row) ?? false;

                                return (
                                  <button
                                    key={`${action.label}-${actionIndex}`}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => {
                                      setOpenActionId(null);
                                      action.onClick(row);
                                    }}
                                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                      action.variant === "danger"
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
          currentPage={currentPage ?? 1}
          totalPages={totalPages ?? 1}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange ?? (() => {})}
          onPageSizeChange={onPageSizeChange}
          showPageSize={showPageSize}
        />
      )}
    </div>
  );
}
