



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import {
  Search,
  ClipboardList,
  Users,
  TrendingUp,
  Award,
  Clock,
  Download,
  Eye,
  RefreshCw,
  X,
  Filter,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  CalendarDays,
  FileSpreadsheet,
  Target,
  BarChart3,
} from "lucide-react";

const RESULTS_STORAGE_KEY = "learnyfi-school-centres-results";
const STUDENTS_STORAGE_KEY = "learnyfi-school-centres-students";
const INSTITUTIONS_STORAGE_KEY = "learnyfi-school-centres-institutions";
const CLASSES_STORAGE_KEY = "learnyfi-school-centres-classes";
const ASSIGNMENTS_STORAGE_KEY = "learnyfi-school-centres-assignments";

type ResultStatus = "Submitted" | "Graded" | "Pending" | "Late";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  admissionNumber?: string;
  institutionId?: string;
  institutionName?: string;
  classId?: string;
  className?: string;
};

type Institution = {
  id: string;
  name: string;
};

type SchoolClass = {
  id: string;
  name: string;
  institutionId: string;
  institutionName?: string;
};

type Assignment = {
  id: string;
  title: string;
  subject: string;
  institutionId: string;
  institutionName: string;
  classId: string;
  className: string;
  totalMarks: number;
  status: string;
};

type SchoolResult = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  admissionNumber?: string;

  institutionId: string;
  institutionName: string;

  classId: string;
  className: string;

  assignmentId: string;
  assignmentTitle: string;
  subject: string;

  score: number;
  totalMarks: number;
  percentage: number;

  correctAnswers?: number;
  wrongAnswers?: number;
  unanswered?: number;

  durationMinutes?: number;
  status: ResultStatus;

  submittedAt: string;
  gradedAt?: string;
  feedback?: string;
};

type SelectOption = {
  value: string;
  label: string;
};

function readStorage<T,>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPercentage(result: SchoolResult) {
  if (result.totalMarks <= 0) return 0;

  return Math.round(
    (result.score / result.totalMarks) * 100
  );
}

function getGrade(percentage: number) {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function getPerformanceColor(percentage: number) {
  if (percentage >= 70) return "text-emerald-400";
  if (percentage >= 50) return "text-amber-400";
  return "text-rose-400";
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");

  return `"${text.replace(/"/g, '""')}"`;
}

export default function SchoolCentreResultsPage() {
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedResult, setSelectedResult] =
    useState<SchoolResult | null>(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(() => {
    setResults(readStorage<SchoolResult>(RESULTS_STORAGE_KEY));
    setStudents(readStorage<Student>(STUDENTS_STORAGE_KEY));
    setInstitutions(readStorage<Institution>(INSTITUTIONS_STORAGE_KEY));
    setClasses(readStorage<SchoolClass>(CLASSES_STORAGE_KEY));
    setAssignments(readStorage<Assignment>(ASSIGNMENTS_STORAGE_KEY));

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === null ||
        [
          RESULTS_STORAGE_KEY,
          STUDENTS_STORAGE_KEY,
          INSTITUTIONS_STORAGE_KEY,
          CLASSES_STORAGE_KEY,
          ASSIGNMENTS_STORAGE_KEY,
        ].includes(event.key)
      ) {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadData]);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesSearch =
        !query ||
        result.studentName?.toLowerCase().includes(query) ||
        result.studentEmail?.toLowerCase().includes(query) ||
        result.admissionNumber?.toLowerCase().includes(query) ||
        result.assignmentTitle?.toLowerCase().includes(query) ||
        result.subject?.toLowerCase().includes(query) ||
        result.institutionName?.toLowerCase().includes(query);

      const matchesInstitution =
        institutionFilter === "all" ||
        result.institutionId === institutionFilter;

      const matchesClass =
        classFilter === "all" ||
        result.classId === classFilter;

      const matchesAssignment =
        assignmentFilter === "all" ||
        result.assignmentId === assignmentFilter;

      const matchesStatus =
        statusFilter === "all" ||
        result.status === statusFilter;

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesClass &&
        matchesAssignment &&
        matchesStatus
      );
    });
  }, [
    results,
    search,
    institutionFilter,
    classFilter,
    assignmentFilter,
    statusFilter,
  ]);

  const gradedResults = results.filter(
    (result) => result.status === "Graded"
  );

  const pendingResults = results.filter(
    (result) =>
      result.status === "Pending" ||
      result.status === "Submitted"
  );

  const averageScore = gradedResults.length
    ? Math.round(
        gradedResults.reduce(
          (total, result) => total + getPercentage(result),
          0
        ) / gradedResults.length
      )
    : 0;

  const passedResults = gradedResults.filter(
    (result) => getPercentage(result) >= 50
  );

  const passRate = gradedResults.length
    ? Math.round(
        (passedResults.length / gradedResults.length) * 100
      )
    : 0;

  const lateResults = results.filter(
    (result) => result.status === "Late"
  ).length;

  const clearFilters = () => {
    setSearch("");
    setInstitutionFilter("all");
    setClassFilter("all");
    setAssignmentFilter("all");
    setStatusFilter("all");
  };

  const exportResults = () => {
    if (filteredResults.length === 0) {
      setError("There are no results to export.");
      return;
    }

    try {
      const headers = [
        "Student Name",
        "Email",
        "Admission Number",
        "Institution",
        "Class",
        "Assignment",
        "Subject",
        "Score",
        "Total Marks",
        "Percentage",
        "Grade",
        "Status",
        "Submitted At",
        "Graded At",
      ];

      const rows = filteredResults.map((result) => [
        result.studentName,
        result.studentEmail,
        result.admissionNumber,
        result.institutionName,
        result.className,
        result.assignmentTitle,
        result.subject,
        result.score,
        result.totalMarks,
        `${getPercentage(result)}%`,
        getGrade(getPercentage(result)),
        result.status,
        formatDateTime(result.submittedAt),
        formatDateTime(result.gradedAt),
      ]);

      const csv = [
        headers.map(escapeCsv).join(","),
        ...rows.map((row) => row.map(escapeCsv).join(",")),
      ].join("\r\n");

      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `school-centres-results-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setSuccess("Results exported successfully.");
      setError("");
    } catch {
      setError("Unable to export results. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <Link
                href="/admin/school-centres"
                className="transition hover:text-white"
              >
                School & Study Centres
              </Link>
              <span>/</span>
              <span className="text-white">Results</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Results Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Monitor student performance, review assignment submissions,
              and export academic results across your institutions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadData}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={exportResults}
              disabled={filteredResults.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <Notice
            message={success}
            type="success"
            onClose={() => setSuccess("")}
          />
        )}

        {error && (
          <Notice
            message={error}
            type="error"
            onClose={() => setError("")}
          />
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Submissions"
            value={results.length}
            description="All recorded submissions"
            icon={ClipboardList}
            color="violet"
          />

          <StatCard
            title="Average Score"
            value={`${averageScore}%`}
            description={`${gradedResults.length} graded submissions`}
            icon={TrendingUp}
            color="blue"
          />

          <StatCard
            title="Pass Rate"
            value={`${passRate}%`}
            description="Based on a 50% pass mark"
            icon={Award}
            color="emerald"
          />

          <StatCard
            title="Awaiting Grading"
            value={pendingResults.length}
            description={`${lateResults} late submissions`}
            icon={Clock}
            color="amber"
          />
        </div>

        {/* Performance overview */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Performance Overview</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Distribution of graded student results
                </p>
              </div>

              <BarChart3 size={21} className="text-violet-400" />
            </div>

            <div className="mt-6 space-y-5">
              <PerformanceBar
                label="Excellent (80–100%)"
                count={gradedResults.filter(
                  (result) => getPercentage(result) >= 80
                ).length}
                total={gradedResults.length}
                color="bg-emerald-500"
              />

              <PerformanceBar
                label="Good (70–79%)"
                count={gradedResults.filter((result) => {
                  const percentage = getPercentage(result);
                  return percentage >= 70 && percentage < 80;
                }).length}
                total={gradedResults.length}
                color="bg-blue-500"
              />

              <PerformanceBar
                label="Average (50–69%)"
                count={gradedResults.filter((result) => {
                  const percentage = getPercentage(result);
                  return percentage >= 50 && percentage < 70;
                }).length}
                total={gradedResults.length}
                color="bg-amber-500"
              />

              <PerformanceBar
                label="Below Pass Mark (0–49%)"
                count={gradedResults.filter(
                  (result) => getPercentage(result) < 50
                ).length}
                total={gradedResults.length}
                color="bg-rose-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Result Summary</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Current submission status
                </p>
              </div>

              <Target size={21} className="text-violet-400" />
            </div>

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Graded"
                value={gradedResults.length}
                color="text-emerald-400"
              />

              <SummaryRow
                label="Submitted"
                value={
                  results.filter(
                    (result) => result.status === "Submitted"
                  ).length
                }
                color="text-blue-400"
              />

              <SummaryRow
                label="Pending"
                value={
                  results.filter(
                    (result) => result.status === "Pending"
                  ).length
                }
                color="text-amber-400"
              />

              <SummaryRow
                label="Late"
                value={lateResults}
                color="text-rose-400"
              />
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4">
              <p className="text-xs text-slate-500">
                Institutions
              </p>

              <p className="mt-1 text-2xl font-bold">
                {institutions.length}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Registered institutions
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter size={17} className="text-violet-400" />
              <h2 className="font-semibold">Find Results</h2>
            </div>

            <button
              onClick={clearFilters}
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Clear filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative xl:col-span-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student or assignment..."
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <SelectField
              value={institutionFilter}
              onChange={setInstitutionFilter}
              options={[
                { value: "all", label: "All Institutions" },
                ...institutions.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />

            <SelectField
              value={classFilter}
              onChange={setClassFilter}
              options={[
                { value: "all", label: "All Classes" },
                ...classes.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />

            <SelectField
              value={assignmentFilter}
              onChange={setAssignmentFilter}
              options={[
                { value: "all", label: "All Assignments" },
                ...assignments.map((item) => ({
                  value: item.id,
                  label: item.title,
                })),
              ]}
            />

            <SelectField
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Graded", label: "Graded" },
                { value: "Submitted", label: "Submitted" },
                { value: "Pending", label: "Pending" },
                { value: "Late", label: "Late" },
              ]}
            />
          </div>
        </div>

        {/* Results table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Student Results</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredResults.length} of {results.length} records
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
              <FileSpreadsheet size={15} />
              Academic performance records
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-400">
              <RefreshCw size={18} className="animate-spin" />
              Loading results...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-5 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800">
                <BarChart3 size={30} className="text-slate-500" />
              </div>

              <h3 className="text-lg font-semibold">
                {results.length === 0
                  ? "No results available yet"
                  : "No matching results"}
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-400">
                {results.length === 0
                  ? "Student results will appear here when assignment submissions and grading records are saved."
                  : "Try changing your search or filters to find the results you're looking for."}
              </p>

              {results.length === 0 && (
                <Link
                  href="/admin/school-centres/assignments"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
                >
                  <ClipboardList size={16} />
                  View Assignments
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1100px] text-left">
                  <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Student</th>
                      <th className="px-5 py-4 font-medium">Assignment</th>
                      <th className="px-5 py-4 font-medium">Institution</th>
                      <th className="px-5 py-4 font-medium">Score</th>
                      <th className="px-5 py-4 font-medium">Grade</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Submitted</th>
                      <th className="px-5 py-4 text-right font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/80">
                    {filteredResults.map((result) => {
                      const percentage = getPercentage(result);

                      return (
                        <tr
                          key={result.id}
                          className="transition hover:bg-slate-800/30"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-white">
                              {result.studentName || "Unknown student"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {result.admissionNumber || result.studentEmail || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="max-w-[190px] truncate text-sm text-slate-200">
                              {result.assignmentTitle || "Untitled assignment"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {result.subject || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="max-w-[180px] truncate text-sm text-slate-300">
                              {result.institutionName || "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {result.className || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-white">
                              {result.score}/{result.totalMarks}
                            </p>

                            <p
                              className={`mt-1 text-xs font-semibold ${getPerformanceColor(percentage)}`}
                            >
                              {percentage}%
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <GradeBadge
                              grade={getGrade(percentage)}
                              status={result.status}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={result.status} />
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-400">
                            {formatDate(result.submittedAt)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setSelectedResult(result)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-500 hover:text-white"
                            >
                              <Eye size={14} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid grid-cols-1 gap-3 p-4 lg:hidden">
                {filteredResults.map((result) => {
                  const percentage = getPercentage(result);

                  return (
                    <div
                      key={result.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {result.studentName || "Unknown student"}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {result.admissionNumber || result.studentEmail || "—"}
                          </p>
                        </div>

                        <StatusBadge status={result.status} />
                      </div>

                      <div className="mt-4 border-t border-slate-800 pt-3">
                        <p className="text-xs text-slate-500">
                          Assignment
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-200">
                          {result.assignmentTitle || "Untitled assignment"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {result.subject || "—"} · {result.institutionName || "—"}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-800 pt-3">
                        <div>
                          <p className="text-[11px] text-slate-500">Score</p>
                          <p className="mt-1 text-sm font-bold">
                            {result.score}/{result.totalMarks}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-500">Percentage</p>
                          <p className={`mt-1 text-sm font-bold ${getPerformanceColor(percentage)}`}>
                            {percentage}%
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-500">Grade</p>
                          <p className="mt-1 text-sm font-bold">
                            {result.status === "Graded"
                              ? getGrade(percentage)
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedResult(result)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white"
                      >
                        <Eye size={15} />
                        View Result Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-800 pt-5 text-xs text-slate-500">
          <p>
            School & Study Centres · Results Management
          </p>
          <p className="mt-1">
            Results are currently read from this browser's local storage.
          </p>
        </div>
      </div>

      {/* Result Details Modal */}
      {selectedResult && (
        <ResultDetailsModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Reusable Components
------------------------------------------------------- */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: ElementType;
  color: "violet" | "blue" | "emerald" | "amber";
}) {
  const colors = {
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colors[color]}`}>
          <Icon size={23} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function PerformanceBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-semibold text-slate-300">
          {count}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-3 pr-9 text-sm text-slate-300 outline-none transition focus:border-violet-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: ResultStatus }) {
  const styles: Record<ResultStatus, string> = {
    Graded: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Submitted: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    Pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    Late: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[status] || styles.Pending}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function GradeBadge({
  grade,
  status,
}: {
  grade: string;
  status: ResultStatus;
}) {
  if (status !== "Graded") {
    return <span className="text-xs text-slate-500">Not graded</span>;
  }

  const colors: Record<string, string> = {
    A: "bg-emerald-500/10 text-emerald-400",
    B: "bg-blue-500/10 text-blue-400",
    C: "bg-violet-500/10 text-violet-400",
    D: "bg-amber-500/10 text-amber-400",
    F: "bg-rose-500/10 text-rose-400",
  };

  return (
    <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg text-xs font-bold ${colors[grade] || colors.F}`}>
      {grade}
    </span>
  );
}

function Notice({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  const isSuccess = type === "success";

  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${isSuccess ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>
      <div className="flex items-center gap-2">
        {isSuccess ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
        {message}
      </div>

      <button onClick={onClose} aria-label="Dismiss notification">
        <X size={17} />
      </button>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ElementType;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <Icon size={17} className="mt-0.5 shrink-0 text-violet-400" />

      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm text-slate-200">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function ResultDetailsModal({
  result,
  onClose,
}: {
  result: SchoolResult;
  onClose: () => void;
}) {
  const percentage = getPercentage(result);
  const graded = result.status === "Graded";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-bold">Result Details</h2>
            <p className="mt-1 text-xs text-slate-500">
              Student academic performance
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close result details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-6">
          {/* Score summary */}
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                {graded ? "Final Result" : "Current Submission"}
              </p>

              <p className="mt-3 text-4xl font-bold tracking-tight">
                {result.score}/{result.totalMarks}
              </p>

              <p className={`mt-2 text-lg font-bold ${getPerformanceColor(percentage)}`}>
                {percentage}%
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <StatusBadge status={result.status} />

                {graded && <GradeBadge grade={getGrade(percentage)} status="Graded" />}
              </div>
            </div>
          </div>

          {/* Student */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-violet-300">
              Student Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                icon={Users}
                label="Student Name"
                value={result.studentName}
              />

              <DetailItem
                icon={GraduationCap}
                label="Admission Number"
                value={result.admissionNumber || ""}
              />

              <DetailItem
                icon={Building2}
                label="Institution"
                value={result.institutionName}
              />

              <DetailItem
                icon={GraduationCap}
                label="Class"
                value={result.className}
              />

              <DetailItem
                icon={ClipboardList}
                label="Email"
                value={result.studentEmail || ""}
              />
            </div>
          </section>

          {/* Assignment */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-violet-300">
              Assignment Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                icon={ClipboardList}
                label="Assignment"
                value={result.assignmentTitle}
              />

              <DetailItem
                icon={GraduationCap}
                label="Subject"
                value={result.subject}
              />

              <DetailItem
                icon={CalendarDays}
                label="Submitted At"
                value={formatDateTime(result.submittedAt)}
              />

              <DetailItem
                icon={CheckCircle2}
                label="Graded At"
                value={formatDateTime(result.gradedAt)}
              />
            </div>
          </section>

          {/* Answer breakdown */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-violet-300">
              Answer Breakdown
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DetailItem
                icon={CheckCircle2}
                label="Correct Answers"
                value={String(result.correctAnswers ?? "—")}
              />

              <DetailItem
                icon={AlertCircle}
                label="Wrong Answers"
                value={String(result.wrongAnswers ?? "—")}
              />

              <DetailItem
                icon={Clock}
                label="Unanswered"
                value={String(result.unanswered ?? "—")}
              />
            </div>

            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Time Taken
                </span>

                <span className="text-sm font-semibold text-white">
                  {typeof result.durationMinutes === "number"
                    ? `${result.durationMinutes} minutes`
                    : "Not recorded"}
                </span>
              </div>
            </div>
          </section>

          {/* Feedback */}
          {result.feedback && (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-violet-300">
                Teacher's Feedback
              </h3>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300">
                {result.feedback}
              </div>
            </section>
          )}
        </div>

        <div className="border-t border-slate-800 px-5 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
