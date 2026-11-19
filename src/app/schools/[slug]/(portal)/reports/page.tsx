



"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  GraduationCap,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  CheckCircle2,
} from "lucide-react";

import {
  getSchoolReport,
  type ReportPeriod,
  type SchoolReport,
} from "@/lib/schools/portal/services/subject.reports";

import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import Button from "@/components/schools/ui/Button";
import LoadingState from "@/components/schools/shared/LoadingState";

const periods: { label: string; value: ReportPeriod }[] = [
  { label: "All time", value: "all" },
  { label: "This month", value: "this-month" },
  { label: "Last month", value: "last-month" },
  { label: "This term", value: "this-term" },
  { label: "This year", value: "this-year" },
];

const initialReport: SchoolReport = {
  totalStudents: 0,
  totalTeachers: 0,
  totalClasses: 0,
  totalSubjects: 0,
  activeEnrollments: 0,
  inactiveEnrollments: 0,
  completedEnrollments: 0,
};

export default function SchoolReportsPage() {
  const [report, setReport] = useState<SchoolReport>(initialReport);
  const [period, setPeriod] = useState<ReportPeriod>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getSchoolReport(period);
      setReport(result);
    } catch (err) {
      console.error("Failed to load school report:", err);
      setError("Unable to load school reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const statCards = [
    {
      label: "Total Students",
      value: report.totalStudents,
      icon: GraduationCap,
    },
    {
      label: "Total Teachers",
      value: report.totalTeachers,
      icon: Users,
    },
    {
      label: "Total Classes",
      value: report.totalClasses,
      icon: BookOpen,
    },
    {
      label: "Total Subjects",
      value: report.totalSubjects,
      icon: Activity,
    },
  ];

  const enrollmentCards = [
    {
      label: "Active Enrollments",
      value: report.activeEnrollments,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      label: "Inactive Enrollments",
      value: report.inactiveEnrollments,
      icon: UserX,
      color: "text-red-600",
    },
    {
      label: "Completed Enrollments",
      value: report.completedEnrollments,
      icon: CheckCircle2,
      color: "text-blue-600",
    },
  ];

  if (loading && !report.totalStudents && !error) {
    return <LoadingState message="Loading school reports..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            School Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your school statistics and enrollment performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as ReportPeriod)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            {periods.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={loadReport}
            isLoading={loading}
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={loadReport}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={22} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">
            Enrollment Summary
          </h2>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {enrollmentCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon size={18} className={item.color} />
                    {item.label}
                  </div>

                  <p className="mt-3 text-2xl font-bold text-gray-900">
                    {item.value.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
