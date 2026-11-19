




"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GraduationCap,
  RefreshCw,
  Users,
  AlertCircle,
  ArrowRight,
  School,
  BookMarked,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";
import { getSchoolDashboard } from "@/lib/schools/portal/services/dashboard.service";

/* =========================================
   TYPES
========================================= */

interface TeacherProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string | null;
  schoolName?: string;
  schoolSubdomain?: string;
  role?: string;
}

interface TeacherDashboardStats {
  totalAssignedClasses?: number;
  totalAssignedSubjects?: number;
  totalStudents?: number;
  totalAssignments?: number;
  pendingAssignments?: number;
  completedAssignments?: number;
}

interface TeacherClass {
  _id: string;
  className: string;
  classCode?: string;
  totalStudents?: number;
  isActive?: boolean;
}

interface TeacherSubject {
  _id: string;
  subjectName: string;
  subjectCode?: string;
  classes?: {
    classId: string;
    className: string;
  }[];
}

interface TeacherAssignment {
  _id: string;
  title: string;
  subjectName?: string;
  className?: string;
  totalStudents?: number;
  submittedCount?: number;
  pendingCount?: number;
  dueDate?: string;
  status?: string;
  createdAt?: string;
}

interface TeacherActivity {
  _id?: string;
  title: string;
  description?: string;
  type?: string;
  createdAt: string;
}

interface TeacherDashboardData {
  teacher?: TeacherProfile;
  stats?: TeacherDashboardStats;
  assignedClasses?: TeacherClass[];
  assignedSubjects?: TeacherSubject[];
  recentAssignments?: TeacherAssignment[];
  recentActivities?: TeacherActivity[];
}

/* =========================================
   HELPERS
========================================= */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatNumber(value?: number): string {
  return new Intl.NumberFormat().format(value ?? 0);
}

function formatDate(value?: string): string {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "T";
}

function extractTeacherDashboard(response: unknown): TeacherDashboardData {
  if (!isRecord(response)) {
    throw new Error("Invalid dashboard response.");
  }

  const outerData = response.data;

  if (!isRecord(outerData)) {
    throw new Error("Dashboard data was not returned by the server.");
  }

  if (outerData.role !== "TEACHER") {
    throw new Error(
      `Expected a TEACHER dashboard, but received ${String(outerData.role ?? "an unknown role")}.`,
    );
  }

  if (!isRecord(outerData.dashboard)) {
    throw new Error("Teacher dashboard information is missing.");
  }

  return outerData.dashboard as TeacherDashboardData;
}

/* =========================================
   PAGE
========================================= */

export default function TeacherDashboardPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = params.slug;

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId;

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const membershipRole =
    user?.schoolContext?.userSchoolMembership?.role;

  const [dashboard, setDashboard] =
    useState<TeacherDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    if (!schoolId || !schoolSubdomain) {
      setError("Your school information could not be identified.");
      setLoading(false);
      return;
    }

    if (membershipRole !== "TEACHER") {
      setError("This dashboard is only available to teachers.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSchoolDashboard(
        schoolId,
        schoolSubdomain,
      );

      const dashboardData = extractTeacherDashboard(response);

      setDashboard(dashboardData);
    } catch (err: unknown) {
      console.error("Teacher dashboard error:", err);

      const message =
        isRecord(err) &&
        isRecord(err.response) &&
        isRecord(err.response.data) &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : err instanceof Error
            ? err.message
            : "Unable to load your teacher dashboard.";

      setError(message);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [schoolId, schoolSubdomain, membershipRole]);

  useEffect(() => {
    if (!isHydrated) return;

    void fetchDashboard();
  }, [isHydrated, fetchDashboard]);

  const teacher = dashboard?.teacher;
  const stats = dashboard?.stats;

  const firstName =
    teacher?.firstName ||
    user?.firstName ||
    "Teacher";

  const lastName =
    teacher?.lastName ||
    user?.lastName ||
    "";

  const assignments = dashboard?.recentAssignments ?? [];
  const classes = dashboard?.assignedClasses ?? [];
  const subjects = dashboard?.assignedSubjects ?? [];
  const activities = dashboard?.recentActivities ?? [];

  const completionPercentage = useMemo(() => {
    const total = stats?.totalAssignments ?? 0;
    const completed = stats?.completedAssignments ?? 0;

    if (!total) return 0;

    return Math.min(100, Math.round((completed / total) * 100));
  }, [stats]);

  if (!isHydrated || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">
            Loading teacher dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-600" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <button
            type="button"
            onClick={() => void fetchDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* WELCOME */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <GraduationCap className="h-4 w-4" />
              Teacher Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {firstName}! 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm text-blue-100 sm:text-base">
              Here's an overview of your classes, subjects,
              students and assignments.
            </p>

            <p className="mt-4 flex items-center gap-2 text-sm text-blue-100">
              <School className="h-4 w-4" />
              {teacher?.schoolName ||
                user?.schoolContext?.schoolName ||
                "Your School"}
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl font-bold">
            {getInitials(firstName, lastName)}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-white/5" />
      </section>

      {/* STATISTICS */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Overview
            </h2>
            <p className="text-sm text-gray-500">
              Your teaching statistics
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchDashboard()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Assigned Classes"
            value={stats?.totalAssignedClasses}
            icon={<Users className="h-5 w-5" />}
            description="Classes you teach"
          />

          <StatCard
            title="Assigned Subjects"
            value={stats?.totalAssignedSubjects}
            icon={<BookOpen className="h-5 w-5" />}
            description="Subjects you handle"
          />

          <StatCard
            title="Total Students"
            value={stats?.totalStudents}
            icon={<GraduationCap className="h-5 w-5" />}
            description="Students in your classes"
          />

          <StatCard
            title="Total Assignments"
            value={stats?.totalAssignments}
            icon={<ClipboardList className="h-5 w-5" />}
            description="Assignments you manage"
          />
        </div>
      </section>

      {/* ASSIGNMENT SUMMARY */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Assignment Progress
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your assignment completion overview
              </p>
            </div>

            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-700">
                Pending
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-800">
                {formatNumber(stats?.pendingAssignments)}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-sm text-green-700">
                Completed
              </p>
              <p className="mt-2 text-2xl font-bold text-green-800">
                {formatNumber(stats?.completedAssignments)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                Completion rate
              </span>
              <span className="font-semibold text-gray-900">
                {completionPercentage}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Today's Date
              </h3>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-sm text-gray-500">
              Keep track of your assignments and stay up to date
              with your students' progress.
            </p>
          </div>
        </div>
      </section>

      {/* ASSIGNED CLASSES */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              My Classes
            </h2>
            <p className="text-sm text-gray-500">
              Classes assigned to you
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {classes.length} Classes
          </span>
        </div>

        {classes.length === 0 ? (
          <EmptyState
            icon={<School className="h-6 w-6" />}
            title="No assigned classes yet"
            description="Your assigned classes will appear here once the school administrator assigns them to you."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {classes.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <School className="h-5 w-5" />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.isActive === false
                        ? "bg-gray-100 text-gray-600"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {item.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.className}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {item.classCode || "Class"}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {formatNumber(item.totalStudents)} students
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ASSIGNED SUBJECTS */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            My Subjects
          </h2>
          <p className="text-sm text-gray-500">
            Subjects you teach and their assigned classes
          </p>
        </div>

        {subjects.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-6 w-6" />}
            title="No assigned subjects yet"
            description="Your assigned subjects will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <BookMarked className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  {subject.subjectName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {subject.subjectCode || "Subject"}
                </p>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Assigned classes
                  </p>

                  {subject.classes?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {subject.classes.map((item) => (
                        <span
                          key={item.classId}
                          className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                        >
                          {item.className}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No classes specified
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RECENT ASSIGNMENTS */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Assignments
            </h2>
            <p className="text-sm text-gray-500">
              Monitor your students' submissions
            </p>
          </div>

          <ClipboardList className="h-6 w-6 text-blue-600" />
        </div>

        {assignments.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="No assignments yet"
            description="Your recent assignments will appear here."
          />
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const total = assignment.totalStudents ?? 0;
              const submitted = assignment.submittedCount ?? 0;
              const progress =
                total > 0
                  ? Math.min(100, Math.round((submitted / total) * 100))
                  : 0;

              return (
                <div
                  key={assignment._id}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {assignment.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {assignment.subjectName || "Subject"} ·{" "}
                        {assignment.className || "Class"}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {assignment.status || "ACTIVE"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-gray-400">Submissions</p>
                      <p className="mt-1 font-semibold text-gray-800">
                        {submitted}/{total}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Pending</p>
                      <p className="mt-1 font-semibold text-amber-600">
                        {formatNumber(assignment.pendingCount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Due date</p>
                      <p className="mt-1 font-semibold text-gray-800">
                        {formatDate(assignment.dueDate)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-gray-500">
                      <span>Submission progress</span>
                      <span>{progress}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* RECENT ACTIVITIES */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h2>
            <p className="text-sm text-gray-500">
              Recent updates from your teaching activities
            </p>
          </div>

          <Clock3 className="h-6 w-6 text-blue-600" />
        </div>

        {activities.length === 0 ? (
          <EmptyState
            icon={<Clock3 className="h-6 w-6" />}
            title="No recent activities"
            description="Your recent activities will appear here."
          />
        ) : (
          <div className="space-y-5">
            {activities.map((activity, index) => (
              <div
                key={activity._id || `${activity.title}-${index}`}
                className="flex gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.title}
                  </p>

                  {activity.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================
   REUSABLE COMPONENTS
========================================= */

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value?: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <ArrowRight className="h-4 w-4 text-gray-300" />
      </div>

      <p className="mt-5 text-2xl font-bold text-gray-900">
        {formatNumber(value)}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
        {icon}
      </div>

      <h3 className="mt-3 font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}
