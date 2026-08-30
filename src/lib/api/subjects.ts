

// src/lib/api/subjects.ts

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   SUBJECT
   ============================================================ */

export interface Subject {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  plans?: string[];
  hasFreePractice?: boolean;
}

/* ============================================================
   SUBJECTS BY PLAN RESPONSE
   ============================================================ */

export interface SubjectsByPlanResponse {
  success: boolean;
  message: string;

  data: {
    subjectObj: Subject[];
    totalPages: number;
    totalCount: number;
  };
}

/* ============================================================
   GET SUBJECTS BY PLAN
   ============================================================ */

export async function getSubjectsByPlan(
  plan: string,
  page = 1,
  limit = 5,
): Promise<SubjectsByPlanResponse> {
  const response =
    await axiosInstance.get<SubjectsByPlanResponse>(
      `/subjects/get-all-subjects-per-category/${encodeURIComponent(
        plan,
      )}`,
      {
        params: {
          page,
          limit,
        },
      },
    );

  return response.data;
}

/* ============================================================
   GET SUBJECT BY ID
   ============================================================ */

/**
 * Finds a subject using the real MongoDB _id.
 *
 * The backend subjects endpoint is paginated, so we search
 * through all pages until the requested subject is found.
 */
export async function getSubjectById(
  subjectId: string,
  plan = "SECONDARY",
): Promise<Subject> {
  if (!subjectId) {
    throw new Error("Subject ID is required.");
  }

  /* ==========================================================
     FIRST PAGE
     ========================================================== */

  const firstResponse =
    await getSubjectsByPlan(
      plan,
      1,
      5,
    );

  const firstSubject =
    firstResponse.data.subjectObj.find(
      (subject) =>
        subject._id === subjectId,
    );

  if (firstSubject) {
    return firstSubject;
  }
  

  /* ==========================================================
     SEARCH REMAINING PAGES
     ========================================================== */

  const totalPages =
    firstResponse.data.totalPages;

  if (totalPages <= 1) {
    throw new Error(
      "Subject not found.",
    );
  }

  for (
    let page = 2;
    page <= totalPages;
    page++
  ) {
    const response =
      await getSubjectsByPlan(
        plan,
        page,
        5,
      );

    const subject =
      response.data.subjectObj.find(
        (item) =>
          item._id === subjectId,
      );

    if (subject) {
      return subject;
    }
  }

  throw new Error(
    "Subject not found.",
  );

  
}






// /* ============================================================
//    SUBJECT TYPES
//    ============================================================ */

// export interface Subject {
//   _id: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   plans: string[];
//   hasFreePractice: boolean;
// }

// export interface SubjectsResponse {
//   success: boolean;
//   message: string;

//   data: {
//     subjectObj: Subject[];
//     totalPages: number;
//     totalCount: number;
//   };
// }

// /* ============================================================
//    SUBJECT API
//    ============================================================ */

// export async function getSubjectsByPlan(
//   plan: string,
// ): Promise<SubjectsResponse> {
//   const response =
//     await api.get(
//       `/subjects/get-all-subjects-per-category/${encodeURIComponent(
//         plan,
//       )}`,
//     );

//   return response.data;
// }
