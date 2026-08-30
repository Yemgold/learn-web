



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
  status?: "draft" | "upcoming" | "active" | "completed";
  subjects?: CompetitionSubject[];
  subjectIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   CREATE
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

export async function createNationalCompetition(
  payload: CreateNationalCompetitionPayload,
): Promise<CreateNationalCompetitionResponse> {
  const response =
    await axiosInstance.post<CreateNationalCompetitionResponse>(
      "/national-competitions",
      payload,
    );

  return response.data;
}

/* ============================================================
   GET BY ID
   ============================================================ */

export interface GetNationalCompetitionResponse {
  success: boolean;
  message: string;
  data: NationalCompetition;
}

export async function getNationalCompetitionById(
  competitionId: string,
): Promise<GetNationalCompetitionResponse> {
  if (!competitionId) {
    throw new Error("Competition ID is required.");
  }

  const response =
    await axiosInstance.get<GetNationalCompetitionResponse>(
      `/national-competitions/${encodeURIComponent(
        competitionId,
      )}`,
    );

  return response.data;
}
