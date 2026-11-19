


//C:\Users\Lara Spellman\Jamb\jamb-league\src\types\schools\types.ts

/* =========================================================
   SCHOOL CORE TYPES
========================================================= */

export type ID = string;

export type SchoolStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING";

export type SchoolAccessMode =
  | "STUDENT_PIN"
  | "SCHOOL_SUBSCRIPTION";

export type SchoolMembershipRole =
  | "OWNER"
  | "ADMIN"
  | "TEACHER"
  | "STUDENT";

export type MemberStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING";

export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type SubscriptionStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | "PENDING"
  | "SUSPENDED";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export type AcademicTerm =
  | "FIRST_TERM"
  | "SECOND_TERM"
  | "THIRD_TERM";

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER"
  | "PREFER_NOT_TO_SAY";

/* =========================================================
   API RESPONSE TYPES
========================================================= */

export interface ApiResponse<T> {
  success: boolean;
  status?: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string | Record<string, unknown>;
  statusCode?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationMeta {
  total: number;
  totalCount?: number;
  page: number;
  limit: number;
  totalPages: number;
  currentPage?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total?: number;
  totalCount?: number;
  totalPages: number;
  currentPage?: number;
  page?: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/* =========================================================
   SCHOOL PROFILE
========================================================= */

export interface SchoolProfile {
  id: ID;
  name: string;
  slug?: string;

  email: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;

  logoUrl?: string;
  website?: string;
  description?: string;

  registrationNumber?: string;
  establishedYear?: number;

  ownerName?: string;

  accessMode: SchoolAccessMode;
  status: SchoolStatus;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSchoolPayload {
  school: {
    name: string;
    email: string;
    phone: string;
    address: string;
    accessMode: SchoolAccessMode;
  };

  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface UpdateSchoolPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  registrationNumber?: string;
  establishedYear?: number;
}

export interface UpdateSchoolStatusPayload {
  isActive: boolean;
}

export interface UpdateSchoolAccessModePayload {
  accessMode: SchoolAccessMode;
}

/* =========================================================
   ACADEMIC SESSION
========================================================= */

export interface AcademicSession {
  id: ID;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  status?: "ACTIVE" | "INACTIVE" | "COMPLETED";
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicTermInfo {
  id: ID;
  name: string;
  term: AcademicTerm;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  academicSessionId?: ID;
}

/* =========================================================
   CLASSES
========================================================= */

export interface SchoolClass {
  id: ID;
  name: string;
  code?: string;
  description?: string;

  level?: string;
  arm?: string;

  classTeacherId?: ID;
  classTeacher?: {
    id: ID;
    firstName: string;
    lastName: string;
  };

  studentCount?: number;
  subjectCount?: number;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassPayload {
  name: string;
  code?: string;
  description?: string;
  level?: string;
  arm?: string;
  classTeacherId?: ID;
}

export interface UpdateClassPayload
  extends Partial<CreateClassPayload> {
  isActive?: boolean;
}

/* =========================================================
   SUBJECTS
========================================================= */

export interface SchoolSubject {
  id: ID;
  name: string;
  code?: string;
  description?: string;

  category?: string;

  teacherCount?: number;
  classCount?: number;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectPayload {
  name: string;
  code?: string;
  description?: string;
  category?: string;
}

export interface UpdateSubjectPayload
  extends Partial<CreateSubjectPayload> {
  isActive?: boolean;
}

/* =========================================================
   CLASS-SUBJECT ASSIGNMENTS
========================================================= */

export interface ClassSubjectAssignment {
  id: ID;

  classId: ID;
  subjectId: ID;
  teacherId: ID;

  class?: SchoolClass;
  subject?: SchoolSubject;

  teacher?: {
    id: ID;
    firstName: string;
    lastName: string;
    email?: string;
  };

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassSubjectAssignmentPayload {
  classId: ID;
  subjectId: ID;
  teacherId: ID;
}

/* =========================================================
   STUDENT ENROLLMENTS
========================================================= */

export type EnrollmentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "TRANSFERRED"
  | "COMPLETED"
  | "WITHDRAWN";

export interface StudentEnrollment {
  id: ID;
  studentId: ID;
  classId: ID;

  student?: {
    id: ID;
    firstName: string;
    lastName: string;
    email?: string;
    admissionNumber?: string;
  };

  class?: SchoolClass;

  academicSessionId?: ID;
  status: EnrollmentStatus;

  enrolledAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEnrollmentPayload {
  studentId: ID;
  classId: ID;
  academicSessionId?: ID;
}

export interface TransferEnrollmentPayload {
  studentId: ID;
  newClassId: ID;
  academicSessionId?: ID;
}

/* =========================================================
   SCHOOL ACCESS
========================================================= */

export interface SchoolAccessInformation {
  accessMode: SchoolAccessMode;
  status?: SubscriptionStatus | "AVAILABLE" | "EXHAUSTED";
  message?: string;
}

export interface SchoolPinBatch {
  id: ID;
  batchName?: string;

  totalPins: number;
  usedPins: number;
  remainingPins: number;

  expiresAt?: string;
  status?: "ACTIVE" | "EXPIRED" | "EXHAUSTED";

  createdAt?: string;
}

export interface SchoolSubscription {
  id: ID;

  planId?: ID;
  planName: string;

  amount: number;
  currency: string;
  billingCycle?: string;

  startsAt?: string;
  expiresAt?: string;

  status: SubscriptionStatus;
  paymentStatus?: PaymentStatus;

  autoRenew?: boolean;

  maxStudents?: number;
  enrolledStudents?: number;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   SCHOOL DASHBOARD
========================================================= */

export interface SchoolDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalAdministrators: number;
  totalClasses: number;
  totalSubjects: number;
  totalAssessments: number;
  totalEnrollments?: number;
  activeStudents?: number;
  inactiveStudents?: number;
}

export interface SchoolDashboardActivity {
  id: ID;
  title: string;
  description?: string;
  type?: string;
  status?: string;
  date: string;
}

export interface SchoolDashboardUpcomingItem {
  id: ID;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type?: string;
}

export interface SchoolDashboardData {
  school: SchoolProfile;
  stats: SchoolDashboardStats;
  recentActivities?: SchoolDashboardActivity[];
  upcomingItems?: SchoolDashboardUpcomingItem[];
  academicSession?: AcademicSession;
  currentTerm?: AcademicTermInfo;
}
