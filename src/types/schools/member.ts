




import type {
  ID,
  Gender,
  MemberStatus,
  SchoolMembershipRole,
  ApprovalStatus,
  SchoolClass,
  PaginationParams,
} from "./types";

/* =========================================================
   MEMBER PROFILE
========================================================= */

export interface MemberUser {
  id: ID;

  firstName: string;
  lastName: string;

  email: string;
  phone?: string;

  avatar?: string;
  profileImage?: string;

  gender?: Gender;
  dateOfBirth?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   SCHOOL MEMBERSHIP
========================================================= */

export interface SchoolMember {
  id: ID;
  membershipId: ID;

  userId: ID;
  schoolId?: ID;

  role: SchoolMembershipRole;
  status: MemberStatus;

  user: MemberUser;

  admissionNumber?: string;
  staffId?: string;

  classId?: ID;
  class?: SchoolClass;

  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolMemberSummary {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: SchoolMembershipRole;
  status: MemberStatus;
  avatar?: string;
  admissionNumber?: string;
  staffId?: string;
  className?: string;
}

/* =========================================================
   CREATE MEMBER
========================================================= */

export interface CreateMemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  role: Exclude<SchoolMembershipRole, "OWNER">;

  admissionNumber?: string;
  staffId?: string;
  classId?: ID;
}

/* =========================================================
   UPDATE MEMBER
========================================================= */

export interface UpdateMemberPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  admissionNumber?: string;
  staffId?: string;
  classId?: ID;

  status?: MemberStatus;
}

export interface UpdateMemberStatusPayload {
  status: MemberStatus;
}

/* =========================================================
   MEMBER FILTERS
========================================================= */

export interface MemberFilters extends PaginationParams {
  role?: SchoolMembershipRole;
  status?: MemberStatus;
  classId?: ID;
  search?: string;
}

/* =========================================================
   BULK MEMBER UPLOAD
========================================================= */

export interface BulkMemberRecord {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  admissionNumber?: string;
  staffId?: string;
  className?: string;
}

export interface BulkMemberUploadPayload {
  role: Exclude<SchoolMembershipRole, "OWNER">;
  members: BulkMemberRecord[];
}

export interface BulkMemberUploadResult {
  totalSubmitted: number;
  successful: number;
  failed: number;

  errors?: BulkMemberUploadError[];
}

export interface BulkMemberUploadError {
  row: number;
  email?: string;
  field?: string;
  message: string;
}

/* =========================================================
   MEMBER APPROVAL
========================================================= */

export interface MemberApproval {
  id: ID;
  membershipId: ID;

  user: MemberUser;
  role: SchoolMembershipRole;

  status: ApprovalStatus;

  requestedAt?: string;
  reviewedAt?: string;
  reviewedBy?: ID;
  rejectionReason?: string;
}

/* =========================================================
   MEMBER LIST RESPONSE
========================================================= */

export interface SchoolMembersData {
  members: SchoolMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
