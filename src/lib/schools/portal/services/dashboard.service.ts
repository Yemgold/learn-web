



import { apiClient } from "@/lib/api";

/* =========================================
   ROLE TYPES
========================================= */

export type SchoolDashboardRole =
  | "OWNER"
  | "ADMIN"
  | "TEACHER"
  | "STUDENT";

/* =========================================
   COMMON TYPES
========================================= */

export interface SchoolDashboardActivity {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  type?: string;
  createdAt: string;
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface SchoolDashboardSubscription {
  planName?: string;
  status?: string;
  billingCycle?: "MONTHLY" | "YEARLY" | string;
  amount?: number;
  currency?: string;
  startsAt?: string;
  expiresAt?: string;
  nextBillingDate?: string;
  isActive?: boolean;
}

export interface SchoolDashboardOwner {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface SchoolDashboardSchool {
  _id?: string;
  id?: string;
  schoolName?: string;
  schoolOwner?: SchoolDashboardOwner;
  subDomain?: string;
  schoolEmail?: string;
  schoolPhone?: string;
  state?: string;
  town?: string;
  address?: string;
  accessMode?: string;
  logo?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================================
   OWNER / ADMIN DASHBOARD
========================================= */

export interface SchoolDashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  totalSubjects?: number;
  totalAdministrators?: number;
  totalAssignments?: number;
  activeStudents?: number;
  inactiveStudents?: number;
}

export interface AdminSchoolDashboard {
  school?: SchoolDashboardSchool;
  stats?: SchoolDashboardStats;
  activities?: SchoolDashboardActivity[];
  recentActivities?: SchoolDashboardActivity[];
  recentAssignments?: Record<string, unknown>[];
  subscription?: SchoolDashboardSubscription | null;
}

/* =========================================
   TEACHER DASHBOARD
========================================= */

export interface TeacherDashboardProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  schoolName?: string;
  schoolSubdomain?: string;
  role?: "TEACHER";
}

export interface TeacherDashboardStats {
  totalAssignedClasses?: number;
  totalAssignedSubjects?: number;
  totalStudents?: number;
  totalAssignments?: number;
  pendingAssignments?: number;
  completedAssignments?: number;
}

export interface TeacherDashboardClass {
  _id: string;
  className: string;
  classCode?: string;
  totalStudents?: number;
  isActive?: boolean;
}

export interface TeacherDashboardSubject {
  _id: string;
  subjectName: string;
  subjectCode?: string;
  classes?: {
    classId: string;
    className: string;
  }[];
}

export interface TeacherDashboardAssignment {
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

export interface TeacherDashboard {
  school?: SchoolDashboardSchool;
  teacher?: TeacherDashboardProfile;
  stats?: TeacherDashboardStats;
  assignedClasses?: TeacherDashboardClass[];
  assignedSubjects?: TeacherDashboardSubject[];
  recentAssignments?: TeacherDashboardAssignment[];
  recentActivities?: SchoolDashboardActivity[];
}

/* =========================================
   STUDENT DASHBOARD
========================================= */

export interface StudentDashboardProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  schoolName?: string;
  schoolSubdomain?: string;
  role?: "STUDENT";
  admissionNumber?: string;
}

export interface StudentDashboardStats {
  totalSubjects?: number;
  totalAssignments?: number;
  pendingAssignments?: number;
  completedAssignments?: number;
  attendancePercentage?: number;
  averageScore?: number;
}

export interface StudentDashboardClass {
  _id: string;
  className: string;
  classCode?: string;
}

export interface StudentDashboardSubject {
  _id: string;
  subjectName: string;
  subjectCode?: string;
  teacherName?: string;
}

export interface StudentDashboardAssignment {
  _id: string;
  title: string;
  subjectName?: string;
  dueDate?: string;
  status?: string;
  createdAt?: string;
}

export interface StudentDashboardResult {
  _id: string;
  subjectName?: string;
  assessmentName?: string;
  score?: number;
  totalScore?: number;
  grade?: string;
  createdAt?: string;
}

export interface StudentDashboard {
  school?: SchoolDashboardSchool;
  student?: StudentDashboardProfile;
  stats?: StudentDashboardStats;
  enrolledClasses?: StudentDashboardClass[];
  subjects?: StudentDashboardSubject[];
  upcomingAssignments?: StudentDashboardAssignment[];
  recentResults?: StudentDashboardResult[];
  recentActivities?: SchoolDashboardActivity[];
}

/* =========================================
   ROLE-BASED DASHBOARD DATA
========================================= */

export type SchoolRoleDashboard =
  | AdminSchoolDashboard
  | TeacherDashboard
  | StudentDashboard;

/* =========================================
   API RESPONSE

   Supports both:
   1. Axios returning the complete envelope.
   2. Axios interceptors returning response.data.
========================================= */

export interface SchoolDashboardApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    school?: SchoolDashboardSchool;
    role?: SchoolDashboardRole;
    dashboard?: SchoolRoleDashboard;
  };

  // Also supports an already-unwrapped API response.
  school?: SchoolDashboardSchool;
  role?: SchoolDashboardRole;
  dashboard?: SchoolRoleDashboard;
}

export interface NormalizedSchoolDashboardResponse {
  role: SchoolDashboardRole;
  school?: SchoolDashboardSchool;
  dashboard: SchoolRoleDashboard;
}

/* =========================================
   ENDPOINTS
========================================= */

const DASHBOARD_ENDPOINTS = {
  overview: (schoolId: string) =>
    `/schools/get-school-dashboard/${encodeURIComponent(schoolId)}`,
};

/* =========================================
   GET SCHOOL DASHBOARD
========================================= */

export const getSchoolDashboard = async (
  schoolId: string,
  schoolSubdomain: string,
) => {
  const normalizedSchoolId = schoolId?.trim();
  const normalizedSubdomain = schoolSubdomain?.trim().toLowerCase();

  if (!normalizedSchoolId) {
    throw new Error("A valid school ID is required.");
  }

  if (!normalizedSubdomain) {
    throw new Error("A valid school subdomain is required.");
  }

  const response = await apiClient.get<SchoolDashboardApiResponse>(
    DASHBOARD_ENDPOINTS.overview(normalizedSchoolId),
    {
      headers: {
        "x-school-subdomain": normalizedSubdomain,
      },
    },
  );

  console.log("[SCHOOL DASHBOARD SERVICE] Response:", response);

  return response;
};

/* =========================================
   NORMALIZE DASHBOARD RESPONSE

   Handles both wrapped and unwrapped data.
========================================= */

export const normalizeSchoolDashboardResponse = (
  response: SchoolDashboardApiResponse,
): NormalizedSchoolDashboardResponse => {
  if (!response || typeof response !== "object") {
    throw new Error("Invalid school dashboard response.");
  }

  // Detect whether Axios has already unwrapped response.data.
  const result = response.data ?? response;

  // Only validate success when the original envelope exists.
  if (response.data && response.success === false) {
    throw new Error(
      response.message || "Failed to fetch school dashboard.",
    );
  }

  if (!result || typeof result !== "object") {
    throw new Error("Dashboard response data is missing.");
  }

  const role = result.role;

  if (
    role !== "OWNER" &&
    role !== "ADMIN" &&
    role !== "TEACHER" &&
    role !== "STUDENT"
  ) {
    throw new Error(
      `Invalid school dashboard role: ${String(role)}`,
    );
  }

  if (
    !result.dashboard ||
    typeof result.dashboard !== "object"
  ) {
    throw new Error("Dashboard information is missing.");
  }

  const school = result.school;

  const dashboard = {
    ...result.dashboard,
    school,
  } as SchoolRoleDashboard;

  return {
    role,
    school,
    dashboard,
  };
};

/* =========================================
   DASHBOARD RESPONSE HELPERS
========================================= */

export const getDashboardRole = (
  response: SchoolDashboardApiResponse,
): SchoolDashboardRole | null => {
  const role = response?.data?.role ?? response?.role;

  if (
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "TEACHER" ||
    role === "STUDENT"
  ) {
    return role;
  }

  return null;
};

export const getDashboardData = (
  response: SchoolDashboardApiResponse,
): SchoolRoleDashboard | null => {
  const result = response?.data ?? response;

  if (!result?.dashboard) {
    return null;
  }

  return {
    ...result.dashboard,
    school: result.school,
  } as SchoolRoleDashboard;
};

export const getDashboardSchool = (
  response: SchoolDashboardApiResponse,
): SchoolDashboardSchool | null => {
  return response?.data?.school ?? response?.school ?? null;
};

/* =========================================
   TYPE GUARDS
========================================= */

export const isAdminDashboard = (
  role: SchoolDashboardRole,
): role is "OWNER" | "ADMIN" => {
  return role === "OWNER" || role === "ADMIN";
};

export const isTeacherDashboard = (
  role: SchoolDashboardRole,
): role is "TEACHER" => {
  return role === "TEACHER";
};

export const isStudentDashboard = (
  role: SchoolDashboardRole,
): role is "STUDENT" => {
  return role === "STUDENT";
};

export const isOwnerDashboard = (
  role: SchoolDashboardRole,
): role is "OWNER" => {
  return role === "OWNER";
};
