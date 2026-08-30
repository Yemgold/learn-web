
// src/lib/api/nationalCompetitions.ts

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   SUBJECT
   ============================================================ */

export interface CompetitionSubject {
  _id: string;
  name: string;
}

/* ============================================================
   NATIONAL COMPETITION
   ============================================================ */

export interface NationalCompetition {
  _id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?:
    | "draft"
    | "upcoming"
    | "active"
    | "completed";

  /*
   * Populated subjects returned by the backend.
   */
  subjects?: CompetitionSubject[];

  /*
   * Subject IDs returned by the backend.
   */
  subjectIds?: string[];

  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   CREATE COMPETITION
   ============================================================ */

export interface CreateNationalCompetitionPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  subjectIds: string[];
}

export interface CreateNationalCompetitionResponse {
  success: boolean;
  message: string;
  data: NationalCompetition;
}

/* ============================================================
   GET COMPETITION BY ID RESPONSE
   ============================================================ */

export interface GetNationalCompetitionResponse {
  success: boolean;
  message: string;
  data: NationalCompetition;
}

/* ============================================================
   CREATE NATIONAL COMPETITION
   ============================================================ */

export async function createNationalCompetition(
  payload: CreateNationalCompetitionPayload,
): Promise<CreateNationalCompetitionResponse> {
  const response =
    await axiosInstance.post<CreateNationalCompetitionResponse>(
      "/nationalcompetitions",
      payload,
    );

  return response.data;
}

/* ============================================================
   GET NATIONAL COMPETITION BY ID
   ============================================================ */

export async function getNationalCompetitionById(
  competitionId: string,
): Promise<GetNationalCompetitionResponse> {
  if (!competitionId) {
    throw new Error(
      "Competition ID is required.",
    );
  }

  const response =
    await axiosInstance.get<GetNationalCompetitionResponse>(
      `/nationalcompetitions/${encodeURIComponent(
        competitionId,
      )}`,
    );

  return response.data;
}

/* ============================================================
   UPDATE COMPETITION SUBJECTS
   ============================================================ */

export interface UpdateCompetitionSubjectsPayload {
  subjectIds: string[];
}

export async function updateNationalCompetitionSubjects(
  competitionId: string,
  payload: UpdateCompetitionSubjectsPayload,
): Promise<GetNationalCompetitionResponse> {
  if (!competitionId) {
    throw new Error(
      "Competition ID is required.",
    );
  }

  const response =
    await axiosInstance.patch<GetNationalCompetitionResponse>(
      `/nationalcompetitions/${encodeURIComponent(
        competitionId,
      )}/subjects`,
      payload,
    );

  return response.data;
}
