





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Download,
  FileQuestion,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";

/* ============================================================
   CONSTANTS
   ============================================================ */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [
  ".csv",
  ".xlsx",
  ".xls",
];

/* ============================================================
   PAGE
   ============================================================ */

export default function ImportCompetitionQuestionsPage() {
  const params = useParams();

  const rawCompetitionId =
    params.nationalcompetitionid;

  const rawSubjectId =
    params.subjectid;

  const competitionId = Array.isArray(
    rawCompetitionId,
  )
    ? rawCompetitionId[0]
    : rawCompetitionId;

  const subjectId = Array.isArray(
    rawSubjectId,
  )
    ? rawSubjectId[0]
    : rawSubjectId;

  /* ==========================================================
     FILE
     ========================================================== */

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  /* ==========================================================
     UI
     ========================================================== */

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isImporting, setIsImporting] =
    useState(false);

  /* ==========================================================
     VALIDATE FILE
     ========================================================== */

  const validateFile = (
    file: File,
  ): boolean => {
    setError("");
    setSuccessMessage("");

    const fileName =
      file.name.toLowerCase();

    const isValidExtension =
      ACCEPTED_EXTENSIONS.some(
        (extension) =>
          fileName.endsWith(extension),
      );

    if (!isValidExtension) {
      setError(
        "Invalid file type. Please upload a CSV, XLSX, or XLS file.",
      );

      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "The file is too large. Maximum file size is 10 MB.",
      );

      return false;
    }

    return true;
  };

  /* ==========================================================
     SELECT FILE
     ========================================================== */

  const handleFileSelect = (
    file: File | undefined,
  ) => {
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  /* ==========================================================
     INPUT CHANGE
     ========================================================== */

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    handleFileSelect(file);
  };

  /* ==========================================================
     DRAG ENTER
     ========================================================== */

  const handleDragEnter = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
  };

  /* ==========================================================
     DRAG LEAVE
     ========================================================== */

  const handleDragLeave = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);
  };

  /* ==========================================================
     DRAG OVER
     ========================================================== */

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
  };

  /* ==========================================================
     DROP
     ========================================================== */

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    handleFileSelect(file);
  };

  /* ==========================================================
     REMOVE FILE
     ========================================================== */

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ==========================================================
     IMPORT
     ========================================================== */

  const handleImport = async () => {
    if (!selectedFile) {
      setError(
        "Please select a file before importing.",
      );

      return;
    }

    setError("");
    setSuccessMessage("");
    setIsImporting(true);

    /*
     * IMPORTANT:
     *
     * The National Competition question-import API
     * does not exist yet.
     *
     * Therefore we intentionally do NOT make an
     * API request here.
     *
     * This temporary delay only demonstrates the
     * loading/success UI.
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    setIsImporting(false);

    setSuccessMessage(
      "File validated successfully. The import will be connected to the National Competition API when the backend endpoint is available.",
    );
  };

  /* ==========================================================
     ROUTE ERROR
     ========================================================== */

  if (!competitionId || !subjectId) {
    return (
      <ErrorState
        message="Competition ID or Subject ID is missing."
      />
    );
  }

  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

          <Link
            href="/admin"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Admin
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span>Secondary</span>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            National Competitions
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Competition
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Subjects
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Subject
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Questions
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-900 dark:text-white">
            Import
          </span>

        </div>

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questions
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <Upload className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Import Questions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Upload a spreadsheet containing multiple
            questions for this competition subject.
          </p>

        </div>

        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* =================================================
              UPLOAD CARD
          ================================================= */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Upload File
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Supported formats: CSV, XLSX, XLS
              </p>

            </div>

            <div className="p-5 sm:p-6">

              {/* =================================================
                  DROP ZONE
              ================================================= */}

              {!selectedFile && (
                <div
                  onDragEnter={
                    handleDragEnter
                  }
                  onDragLeave={
                    handleDragLeave
                  }
                  onDragOver={
                    handleDragOver
                  }
                  onDrop={
                    handleDrop
                  }
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className={[
                    "cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition sm:p-14",
                    isDragging
                      ? "border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800"
                      : "border-gray-300 hover:border-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800",
                  ].join(" ")}
                >

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={
                      handleInputChange
                    }
                    className="hidden"
                  />

                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">

                    <Upload className="h-7 w-7 text-gray-500 dark:text-gray-400" />

                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {isDragging
                      ? "Drop your file here"
                      : "Upload your question file"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Drag and drop your spreadsheet here,
                    or click to browse your computer.
                  </p>

                  <div className="mt-5 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                    Choose File
                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    Maximum file size: 10 MB
                  </p>

                </div>
              )}

              {/* =================================================
                  SELECTED FILE
              ================================================= */}

              {selectedFile && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700">

                  <div className="flex items-center gap-4 p-5">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">

                      <FileSpreadsheet className="h-6 w-6 text-gray-600 dark:text-gray-300" />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(
                          selectedFile.size,
                        )}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRemoveFile
                      }
                      disabled={
                        isImporting
                      }
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>

                  </div>

                  <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-700">

                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">

                      <CheckCircle2 className="h-4 w-4" />

                      <span>
                        File is ready for import
                      </span>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">

                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{error}</span>

                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {successMessage && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">

                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{successMessage}</span>

                </div>
              )}

              {/* =================================================
                  IMPORT BUTTON
              ================================================= */}

              <div className="mt-6 flex justify-end">

                <button
                  type="button"
                  onClick={
                    handleImport
                  }
                  disabled={
                    !selectedFile ||
                    isImporting
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >

                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Preparing Import...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import Questions
                    </>
                  )}

                </button>

              </div>

            </div>

          </section>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* TEMPLATE */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">

                <Download className="h-5 w-5 text-gray-600 dark:text-gray-300" />

              </div>

              <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">
                Import Template
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Use the standard question template to
                make sure your spreadsheet has the correct
                columns.
              </p>

              <button
                type="button"
                disabled
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                <Download className="h-4 w-4" />
                Template Coming Soon
              </button>

            </section>

            {/* FORMAT */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Required Columns
              </h2>

              <div className="mt-4 space-y-3">

                <ColumnItem
                  name="question"
                  required
                />

                <ColumnItem
                  name="optionA"
                  required
                />

                <ColumnItem
                  name="optionB"
                  required
                />

                <ColumnItem
                  name="optionC"
                  required
                />

                <ColumnItem
                  name="optionD"
                  required
                />

                <ColumnItem
                  name="answer"
                  required
                />

                <ColumnItem
                  name="explanation"
                />

              </div>

            </section>

          </aside>

        </div>

        {/* ==================================================
            IMPORT PROCESS
        ================================================== */}

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

          <h2 className="font-semibold text-gray-900 dark:text-white">
            How Import Works
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <Step
              number="1"
              title="Prepare"
              description="Prepare your questions using the supported spreadsheet format."
            />

            <Step
              number="2"
              title="Upload"
              description="Upload the completed CSV or Excel file using the uploader above."
            />

            <Step
              number="3"
              title="Import"
              description="The system will validate and add the questions to this competition subject."
            />

          </div>

        </section>

      </div>
    </div>
  );
}

/* ============================================================
   COLUMN ITEM
   ============================================================ */

function ColumnItem({
  name,
  required = false,
}: {
  name: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">

      <code className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {name}
      </code>

      {required ? (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
          Required
        </span>
      ) : (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Optional
        </span>
      )}

    </div>
  );
}

/* ============================================================
   STEP
   ============================================================ */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white dark:bg-white dark:text-gray-900">
        {number}
      </div>

      <div>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>

      </div>

    </div>
  );
}

/* ============================================================
   FILE SIZE
   ============================================================ */

function formatFileSize(
  bytes: number,
): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) /
      Math.log(1024),
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(1)} ${units[index]}`;
}

/* ============================================================
   ERROR STATE
   ============================================================ */

function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-3xl">

        <Link
          href="/admin/secondary/nationalcompetitions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">

            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />

          </div>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invalid route
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
          >
            Back to Competitions
          </Link>

        </div>

      </div>

    </div>
  );
}