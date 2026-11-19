



import { apiClient } from "@/lib/api";

export type ReportPeriod =
  | "all"
  | "this-month"
  | "last-month"
  | "this-term"
  | "this-year";

export interface SchoolReport {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  activeEnrollments: number;
  inactiveEnrollments: number;
  completedEnrollments: number;
}

const emptyReport: SchoolReport = {
  totalStudents: 0,
  totalTeachers: 0,
  totalClasses: 0,
  totalSubjects: 0,
  activeEnrollments: 0,
  inactiveEnrollments: 0,
  completedEnrollments: 0,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  let result = value;

  for (let i = 0; i < 3; i++) {
    if (!isRecord(result) || !("data" in result)) break;
    result = result.data;
  }

  return result;
}

function toNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function normalizeSchoolReport(value: unknown): SchoolReport {
  const result = unwrapResponse(value);

  if (!isRecord(result)) return emptyReport;

  const stats = isRecord(result.stats) ? result.stats : result;

  return {
    totalStudents: toNumber(stats.totalStudents ?? stats.students),
    totalTeachers: toNumber(stats.totalTeachers ?? stats.teachers),
    totalClasses: toNumber(stats.totalClasses ?? stats.classes),
    totalSubjects: toNumber(stats.totalSubjects ?? stats.subjects),
    activeEnrollments: toNumber(stats.activeEnrollments),
    inactiveEnrollments: toNumber(stats.inactiveEnrollments),
    completedEnrollments: toNumber(stats.completedEnrollments),
  };
}

export async function getSchoolReport(
  period: ReportPeriod = "all"
): Promise<SchoolReport> {
  const response: unknown = await apiClient.get(
    `/schools/reports/overview?period=${encodeURIComponent(period)}`
  );

  return normalizeSchoolReport(response);
}

export async function getStudentReport(): Promise<unknown> {
  return apiClient.get("/schools/reports/students");
}

export async function getTeacherReport(): Promise<unknown> {
  return apiClient.get("/schools/reports/teachers");
}

export async function getAcademicPerformanceReport(): Promise<unknown> {
  return apiClient.get("/schools/reports/academic-performance");
}
