





import { apiClient } from "@/lib/api";

/* ---------------------------------------------
   Types
--------------------------------------------- */

export type SchoolAccessPinStatus =
  | "USED"
  | "UNUSED"
  | "REVOKED"
  | "EXPIRED";

export interface SchoolAccessPin {
  _id?: string;
  id?: string;
  reference?: string;
  pinReference?: string;

  schoolId?: string;
  schoolName?: string;

  school?: {
    _id?: string;
    id?: string;
    schoolName?: string;
    name?: string;
  };

  status?: SchoolAccessPinStatus | string;
  isUsed?: boolean;
  isRevoked?: boolean;

  studentName?: string;
  studentEmail?: string;
  studentId?: string;

  batchId?: string;
  batchName?: string;

  expiresAt?: string;
  usedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolAccessPinListData {
  pins?: SchoolAccessPin[];
  accessPins?: SchoolAccessPin[];
  records?: SchoolAccessPin[];
  total?: number;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GetSchoolAccessPinsParams {
  schoolId?: string;
  page?: number;
  limit?: number;
  status?: SchoolAccessPinStatus;
  search?: string;
}

/* ---------------------------------------------
   API endpoints

   Confirm these paths against your backend routes.
--------------------------------------------- */

const ACCESS_PIN_ENDPOINTS = {
  list: "/school-access-pins",
  revoke: (pinId: string) =>
    `/school-access-pins/${encodeURIComponent(pinId)}/revoke`,
};

/* ---------------------------------------------
   Get school access PINs
--------------------------------------------- */

export const getSchoolAccessPins = (
  params?: GetSchoolAccessPinsParams
) => {
  return apiClient.get<ApiResponse<SchoolAccessPinListData>>(
    ACCESS_PIN_ENDPOINTS.list,
    {
      params: {
        ...(params?.schoolId && { schoolId: params.schoolId }),
        ...(params?.page && { page: params.page }),
        ...(params?.limit && { limit: params.limit }),
        ...(params?.status && { status: params.status }),
        ...(params?.search && { search: params.search }),
      },
    }
  );
};

/* ---------------------------------------------
   Revoke an access PIN
--------------------------------------------- */

export const revokeSchoolAccessPin = (pinId: string) => {
  if (!pinId?.trim()) {
    throw new Error("A valid access PIN ID is required.");
  }

  return apiClient.patch<ApiResponse<SchoolAccessPin>>(
    ACCESS_PIN_ENDPOINTS.revoke(pinId),
    {}
  );
};
