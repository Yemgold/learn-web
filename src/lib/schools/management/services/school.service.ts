



import { apiClient } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

export type SchoolAccessMode =
  | "STUDENT_PIN"
  | "SCHOOL_SUBSCRIPTION";

export interface School {
  _id?: string;
  id?: string;
  schoolName?: string;
  name?: string;
  subDomain?: string;
  slug?: string;
  schoolEmail?: string;
  email?: string;
  schoolPhone?: string;
  phone?: string;
  schoolOwner?: string;
  state?: string;
  town?: string;
  address?: string;
  accessMode?: SchoolAccessMode;
  isActive?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSchoolPayload {
  schoolName: string;
  subDomain: string;
  schoolEmail: string;
  schoolPhone: string;
  state: string;
  town: string;
  address: string;
  accessMode: SchoolAccessMode;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhoneNumber: string;
  ownerTemporaryPassword: string;
}

export interface UpdateSchoolPayload {
  schoolName?: string;
  subDomain?: string;
  schoolEmail?: string;
  schoolPhone?: string;
  state?: string;
  town?: string;
  address?: string;
}

export interface UpdateSchoolStatusPayload {
  isActive: boolean;
}

export interface UpdateSchoolAccessModePayload {
  accessMode: SchoolAccessMode;
}

export interface GetSchoolsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  accessMode?: SchoolAccessMode;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  status?: number;
}

/* =========================================================
   ENDPOINTS
========================================================= */

const SCHOOL_ENDPOINTS = {
  getAll: "/schools/get-all-schools",

  getById: (schoolId: string) =>
    `/schools/get-school-by-schoolId/${encodeURIComponent(schoolId)}`,

  getBySubdomain: (subdomain: string) =>
    `/schools/get-school-by-subdomain/${encodeURIComponent(
      subdomain.trim().toLowerCase()
    )}`,

  create: "/schools/create-school",
};

/* =========================================================
   SCHOOL SERVICE
========================================================= */

/**
 * Get all schools.
 */
export const getSchools = (
  params?: GetSchoolsParams
): Promise<ApiResponse<unknown>> => {
  return apiClient.get<ApiResponse<unknown>>(
    SCHOOL_ENDPOINTS.getAll,
    { params }
  );
};

/**
 * Get a single school using its MongoDB ID.
 */
export const getSchoolById = (
  schoolId: string
): Promise<ApiResponse<School>> => {
  return apiClient.get<ApiResponse<School>>(
    SCHOOL_ENDPOINTS.getById(schoolId)
  );
};

/**
 * Get a single school using its subdomain.
 *
 * Backend response:
 * {
 *   success: true,
 *   message: "School fetched successfully.",
 *   data: {
 *     _id: "...",
 *     schoolName: "...",
 *     subDomain: "derock"
 *   }
 * }
 */
export const getSchoolBySubdomain = (
  subdomain: string
): Promise<ApiResponse<School>> => {
  const normalizedSubdomain = subdomain.trim().toLowerCase();

  if (!normalizedSubdomain) {
    return Promise.reject(
      new Error("School subdomain is required.")
    );
  }

  return apiClient.get<ApiResponse<School>>(
    SCHOOL_ENDPOINTS.getBySubdomain(normalizedSubdomain)
  );
};

/**
 * Create a school.
 */
export const createSchool = (
  payload: CreateSchoolPayload
): Promise<ApiResponse<School>> => {
  return apiClient.post<ApiResponse<School>>(
    SCHOOL_ENDPOINTS.create,
    payload
  );
};

/**
 * Update a school's basic information.
 *
 * Existing route retained pending backend confirmation.
 */
export const updateSchool = (
  schoolId: string,
  payload: UpdateSchoolPayload
): Promise<ApiResponse<School>> => {
  return apiClient.patch<ApiResponse<School>>(
    `/admin/schools/${encodeURIComponent(schoolId)}`,
    payload
  );
};

/**
 * Activate or deactivate a school.
 *
 * Existing route retained pending backend confirmation.
 */
export const updateSchoolStatus = (
  schoolId: string,
  payload: UpdateSchoolStatusPayload
): Promise<ApiResponse<School>> => {
  return apiClient.patch<ApiResponse<School>>(
    `/admin/schools/${encodeURIComponent(schoolId)}/status`,
    payload
  );
};

/**
 * Change a school's access mode.
 *
 * Existing route retained pending backend confirmation.
 */
export const updateSchoolAccessMode = (
  schoolId: string,
  payload: UpdateSchoolAccessModePayload
): Promise<ApiResponse<School>> => {
  return apiClient.patch<ApiResponse<School>>(
    `/admin/schools/${encodeURIComponent(schoolId)}/access-mode`,
    payload
  );
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const schoolService = {
  getSchools,
  getSchoolById,
  getSchoolBySubdomain,
  createSchool,
  updateSchool,
  updateSchoolStatus,
  updateSchoolAccessMode,
};

export default schoolService;
