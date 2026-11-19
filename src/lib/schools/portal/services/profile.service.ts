
import { apiClient } from "@/lib/api";

export type SchoolAccessMode =
  | "STUDENT_PIN"
  | "SCHOOL_SUBSCRIPTION";

export interface SchoolProfile {
  _id?: string;
  id?: string;
  schoolName: string;
  subDomain: string;
  schoolEmail: string;
  schoolPhone: string;
  state: string;
  town: string;
  address: string;
  accessMode: SchoolAccessMode;
  isActive: boolean;
  logo?: string;
  website?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSchoolProfilePayload {
  schoolName?: string;
  schoolEmail?: string;
  schoolPhone?: string;
  state?: string;
  town?: string;
  address?: string;
  logo?: string;
  website?: string;
  description?: string;
}

export const getSchoolProfile = (
  slug: string
): Promise<SchoolProfile> => {
  return apiClient.get<SchoolProfile>(
    `/schools/${encodeURIComponent(slug)}/profile`
  );
};

export const updateSchoolProfile = (
  slug: string,
  payload: UpdateSchoolProfilePayload
): Promise<SchoolProfile> => {
  return apiClient.patch<SchoolProfile>(
    `/schools/${encodeURIComponent(slug)}/profile`,
    payload
  );
};
