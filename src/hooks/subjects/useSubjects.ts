



// src/hooks/subjects/useSubjects.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

/* ============================================================
   CONSTANTS
============================================================ */

const DEFAULT_PLAN = "SECONDARY";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;

/* ============================================================
   QUERY KEY
============================================================ */

export const subjectsQueryKey = (
  plan: string = DEFAULT_PLAN,
) =>
  [
    "subjects",
    plan,
  ] as const;

/* ============================================================
   USE SUBJECTS
============================================================ */

/**
 * Fetches subjects available for a student's plan.
 *
 * Backend endpoint:
 *
 * GET /api/v1/subjects/get-all-subjects-per-category/{plan}
 *
 * Example:
 *
 * GET /api/v1/subjects/get-all-subjects-per-category/SECONDARY
 */
export function useSubjects(
  plan: string = DEFAULT_PLAN,
) {
  const query = useQuery({
    queryKey: subjectsQueryKey(plan),

    queryFn: () =>
      getSubjectsByPlan(
        plan,
        DEFAULT_PAGE,
        DEFAULT_LIMIT,
      ),

    staleTime: 5 * 60 * 1000,

    gcTime: 30 * 60 * 1000,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,
  });

  /* ==========================================================
     NORMALIZED RESPONSE
  ========================================================== */

  const subjects: Subject[] =
    query.data?.data?.subjectObj ?? [];

  const totalCount =
    query.data?.data?.totalCount ?? 0;

  const totalPages =
    query.data?.data?.totalPages ?? 0;

  /* ==========================================================
     RETURN
  ========================================================== */

  return {
    /* React Query state */

    data: query.data,

    subjects,

    isLoading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    refetch:
      query.refetch,

    /* ========================================================
       PAGINATION / META
    ======================================================== */

    totalCount,

    totalPages,

    /* ========================================================
       CONVENIENCE VALUES
    ======================================================== */

    isEmpty:
      !query.isLoading &&
      subjects.length === 0,
  };
}