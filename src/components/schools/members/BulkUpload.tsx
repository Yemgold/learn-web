





"use client";

import {
  ChangeEvent,
  DragEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Upload,
  FileSpreadsheet,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Users,
  Trash2,
  FileText,
} from "lucide-react";

import type { MemberRole } from "./MemberForm";

export interface BulkMemberRecord {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: MemberRole;
  admissionNumber?: string;
  className?: string;
  staffId?: string;
}

export interface BulkUploadError {
  row: number;
  field?: string;
  message: string;
}

interface ParsedMember {
  row: number;
  data: BulkMemberRecord;
  errors: string[];
}

interface BulkUploadProps {
  role: MemberRole;

  onImport: (
    records: BulkMemberRecord[],
    fileName: string
  ) => void | Promise<void>;

  isLoading?: boolean;

  maxRows?: number;
  maxFileSizeMB?: number;

  allowPartialImport?: boolean;
  previewLimit?: number;

  onCancel?: () => void;

  className?: string;
}

const ROLE_CONFIG: Record<
  MemberRole,
  {
    label: string;
    description: string;
    requiredColumns: string[];
    optionalColumns: string[];
  }
> = {
  ADMIN: {
    label: "Administrators",
    description: "Import multiple school administrators.",
    requiredColumns: ["firstName", "lastName", "email", "phone"],
    optionalColumns: [],
  },
  TEACHER: {
    label: "Teachers",
    description: "Import multiple teachers into your school.",
    requiredColumns: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "staffId",
    ],
    optionalColumns: [],
  },
  STUDENT: {
    label: "Students",
    description: "Import multiple students and their class information.",
    requiredColumns: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "admissionNumber",
      "className",
    ],
    optionalColumns: [],
  },
};

const COLUMN_LABELS: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  admissionNumber: "Admission Number",
  className: "Class",
  staffId: "Staff ID",
};

const HEADER_ALIASES: Record<string, string[]> = {
  firstName: ["firstname", "first name", "first_name", "first-name"],
  lastName: ["lastname", "last name", "last_name", "last-name"],
  email: ["email", "email address", "emailaddress"],
  phone: ["phone", "phone number", "phonenumber", "mobile"],
  admissionNumber: [
    "admissionnumber",
    "admission number",
    "admission_number",
    "admission-no",
  ],
  className: ["class", "classname", "class name", "class_name"],
  staffId: ["staffid", "staff id", "staff_id", "employee id"],
};

const normalizeHeader = (value: string) =>
  value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        cell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if (
      (char === "\n" || char === "\r") &&
      !insideQuotes
    ) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }

      row.push(cell.trim());

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (insideQuotes) {
    throw new Error(
      "The CSV file contains an unclosed quotation mark. Check the file formatting."
    );
  }

  row.push(cell.trim());

  if (row.some((value) => value !== "")) {
    rows.push(row);
  }

  return rows;
}

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadCSVTemplate(role: MemberRole) {
  const config = ROLE_CONFIG[role];

  const columns = [
    "firstName",
    "lastName",
    "email",
    "phone",
    ...config.requiredColumns.filter(
      (column) =>
        !["firstName", "lastName", "email", "phone"].includes(column)
    ),
  ];

  const exampleValues: Record<string, string> = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "08012345678",
    admissionNumber: "SCH/2026/001",
    className: "JSS 1",
    staffId: "TCH-001",
  };

  const header = columns.map((column) =>
    escapeCSV(COLUMN_LABELS[column] ?? column)
  );

  const example = columns.map((column) =>
    escapeCSV(exampleValues[column] ?? "")
  );

  const csvContent = [header.join(","), example.join(",")].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `school-${role.toLowerCase()}-template.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mapHeaders(headers: string[]) {
  const mapped: Record<string, number> = {};

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);

    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (
        aliases.some(
          (alias) => normalizeHeader(alias) === normalized
        )
      ) {
        mapped[field] = index;
        break;
      }
    }
  });

  return mapped;
}

export default function BulkUpload({
  role,
  onImport,
  isLoading = false,
  maxRows = 500,
  maxFileSizeMB = 5,
  allowPartialImport = false,
  previewLimit = 10,
  onCancel,
  className = "",
}: BulkUploadProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [members, setMembers] = useState<ParsedMember[]>([]);
  const [errors, setErrors] = useState<BulkUploadError[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const config = ROLE_CONFIG[role];

  const validMembers = useMemo(
    () => members.filter((member) => member.errors.length === 0),
    [members]
  );

  const invalidMembers = useMemo(
    () => members.filter((member) => member.errors.length > 0),
    [members]
  );

  const canImport =
    validMembers.length > 0 &&
    !isLoading &&
    !isParsing &&
    (allowPartialImport || invalidMembers.length === 0);

  const clearUpload = () => {
    setFileName("");
    setMembers([]);
    setErrors([]);
    setSubmitError("");
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFile = async (file: File) => {
    setSubmitError("");
    setSuccessMessage("");
    setErrors([]);
    setMembers([]);

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension !== "csv") {
      setSubmitError("Please upload a CSV file (.csv).");
      return;
    }

    const maxBytes = maxFileSizeMB * 1024 * 1024;

    if (file.size > maxBytes) {
      setSubmitError(
        `File is too large. Maximum allowed size is ${maxFileSizeMB}MB.`
      );
      return;
    }

    setIsParsing(true);
    setFileName(file.name);

    try {
      const content = await file.text();
      const rows = parseCSV(content);

      if (rows.length < 2) {
        throw new Error(
          "The CSV file must contain a header row and at least one member record."
        );
      }

      const headers = rows[0];
      const mappedHeaders = mapHeaders(headers);

      const missingColumns = config.requiredColumns.filter(
        (column) => mappedHeaders[column] === undefined
      );

      if (missingColumns.length > 0) {
        throw new Error(
          `Missing required columns: ${missingColumns
            .map((column) => COLUMN_LABELS[column] ?? column)
            .join(", ")}. Download the template for the correct format.`
        );
      }

      const dataRows = rows.slice(1);

      if (dataRows.length > maxRows) {
        throw new Error(
          `Your file contains ${dataRows.length} records. The maximum allowed is ${maxRows}.`
        );
      }

      const emailOccurrences = new Map<string, number[]>();

      dataRows.forEach((row, index) => {
        const emailIndex = mappedHeaders.email;
        const email = (row[emailIndex] ?? "").trim().toLowerCase();

        if (email) {
          const occurrences = emailOccurrences.get(email) ?? [];
          occurrences.push(index + 2);
          emailOccurrences.set(email, occurrences);
        }
      });

      const parsedMembers: ParsedMember[] = [];
      const allErrors: BulkUploadError[] = [];

      dataRows.forEach((row, index) => {
        const rowNumber = index + 2;

        const getValue = (field: string) => {
          const columnIndex = mappedHeaders[field];

          return columnIndex === undefined
            ? ""
            : (row[columnIndex] ?? "").trim();
        };

        const record: BulkMemberRecord = {
          firstName: getValue("firstName"),
          lastName: getValue("lastName"),
          email: getValue("email").toLowerCase(),
          phone: getValue("phone"),
          role,
          ...(role === "STUDENT"
            ? {
                admissionNumber: getValue("admissionNumber"),
                className: getValue("className"),
              }
            : {}),
          ...(role === "TEACHER"
            ? { staffId: getValue("staffId") }
            : {}),
        };

        const rowErrors: string[] = [];

        config.requiredColumns.forEach((field) => {
          if (!getValue(field)) {
            rowErrors.push(
              `${COLUMN_LABELS[field] ?? field} is required.`
            );
          }
        });

        if (record.email && !validateEmail(record.email)) {
          rowErrors.push("Invalid email address.");
        }

        const matchingEmails =
          emailOccurrences.get(record.email) ?? [];

        if (record.email && matchingEmails.length > 1) {
          rowErrors.push(
            `Duplicate email address found in rows ${matchingEmails.join(", ")}.`
          );
        }

        rowErrors.forEach((message) => {
          allErrors.push({
            row: rowNumber,
            message,
          });
        });

        parsedMembers.push({
          row: rowNumber,
          data: record,
          errors: rowErrors,
        });
      });

      setMembers(parsedMembers);
      setErrors(allErrors);
    } catch (error) {
      setFileName("");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to read this CSV file."
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      void processFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (isLoading) return;

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void processFile(file);
    }
  };

  const handleImport = async () => {
    if (!canImport) return;

    setSubmitError("");
    setSuccessMessage("");

    try {
      await onImport(
        validMembers.map((member) => member.data),
        fileName
      );

      setSuccessMessage(
        `Successfully submitted ${validMembers.length} valid ${
          validMembers.length === 1 ? "record" : "records"
        } for import.`
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Import failed. Please try again."
      );
    }
  };

  const previewMembers = members.slice(0, previewLimit);

  return (
    <div
      className={`w-full space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}
    >
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Bulk Import {config.label}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {config.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => downloadCSVTemplate(role)}
          disabled={isLoading || isParsing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <Download size={16} />
          Download Template
        </button>
      </div>

      {/* Upload area */}
      {!fileName && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            if (!isLoading) setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-6 text-center transition sm:p-10 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"
          }`}
        >
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            disabled={isLoading || isParsing}
            className="hidden"
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            {isParsing ? (
              <Loader2 size={26} className="animate-spin" />
            ) : (
              <Upload size={26} />
            )}
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-900">
            {isDragging
              ? "Drop your CSV file here"
              : isParsing
                ? "Reading your file..."
                : "Upload your CSV file"}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your file here, or browse your computer.
          </p>

          <label
            htmlFor={fileInputId}
            className={`mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700 ${
              isLoading || isParsing
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            Choose CSV File
          </label>

          <p className="mt-3 text-xs text-gray-400">
            CSV only · Maximum {maxFileSizeMB}MB · Up to {maxRows} records
          </p>
        </div>
      )}

      {/* Selected file */}
      {fileName && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <FileSpreadsheet size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {fileName}
              </p>
              <p className="text-xs text-gray-500">
                {members.length} records detected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearUpload}
            disabled={isLoading || isParsing}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 sm:self-auto"
          >
            <Trash2 size={14} />
            Remove File
          </button>
        </div>
      )}

      {/* Validation error */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{submitError}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Import summary */}
      {members.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Total Records"
              value={members.length}
              icon={<Users size={18} />}
            />

            <SummaryCard
              label="Valid Records"
              value={validMembers.length}
              icon={<CheckCircle2 size={18} />}
              variant="success"
            />

            <SummaryCard
              label="Invalid Records"
              value={invalidMembers.length}
              icon={<AlertTriangle size={18} />}
              variant="danger"
            />
          </div>

          {/* Partial import warning */}
          {invalidMembers.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Some records need attention.
                </p>

                <p className="mt-1 text-xs leading-5">
                  {allowPartialImport
                    ? "You can import valid records. Invalid records will be skipped."
                    : "Correct the invalid records in your CSV file and upload it again before importing."}
                </p>
              </div>
            </div>
          )}

          {/* Preview */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Import Preview
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Review the records detected in your CSV file.
                </p>
              </div>

              <span className="text-xs text-gray-500">
                Showing {Math.min(previewMembers.length, members.length)} of{" "}
                {members.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      #
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Member
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      {role === "STUDENT"
                        ? "Admission No."
                        : role === "TEACHER"
                          ? "Staff ID"
                          : "Role"}
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Validation
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {previewMembers.map((member) => (
                    <tr key={member.row} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {member.row}
                      </td>

                      <td className="px-4 py-3 font-medium text-gray-900">
                        {member.data.firstName} {member.data.lastName}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {member.data.email || "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {member.data.phone || "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {role === "STUDENT"
                          ? member.data.admissionNumber || "—"
                          : role === "TEACHER"
                            ? member.data.staffId || "—"
                            : "Administrator"}
                      </td>

                      <td className="px-4 py-3">
                        {member.errors.length === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            <CheckCircle2 size={13} />
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            <AlertCircle size={13} />
                            {member.errors.length} error(s)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {members.length > previewLimit && (
              <p className="text-xs text-gray-500">
                {members.length - previewLimit} additional records are not
                shown in this preview but will be included in validation.
              </p>
            )}
          </section>

          {/* Validation errors */}
          {errors.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Validation Issues ({errors.length})
              </h3>

              <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-red-100 bg-red-50/50 p-3">
                {errors.slice(0, 50).map((error, index) => (
                  <div
                    key={`${error.row}-${index}`}
                    className="flex items-start gap-2 text-xs text-red-700"
                  >
                    <AlertCircle
                      size={14}
                      className="mt-0.5 shrink-0"
                    />

                    <p>
                      <span className="font-semibold">
                        Row {error.row}:
                      </span>{" "}
                      {error.message}
                    </p>
                  </div>
                ))}

                {errors.length > 50 && (
                  <p className="pt-2 text-xs font-medium text-red-700">
                    And {errors.length - 50} more validation issues.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleImport}
              disabled={!canImport}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={17} />
                  Import {validMembers.length}{" "}
                  {validMembers.length === 1 ? "Member" : "Members"}
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Template information */}
      {!fileName && (
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <FileText
              size={18}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Before uploading
              </p>

              <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-gray-600">
                <li>Download the template for the selected member role.</li>
                <li>Keep the column headings in the first row.</li>
                <li>Ensure every required field is completed.</li>
                <li>Use a unique email address for every member.</li>
                <li>For students, use the class name expected by your school.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "danger";
}

function SummaryCard({
  label,
  value,
  icon,
  variant = "default",
}: SummaryCardProps) {
  const styles = {
    default: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600",
    danger: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
