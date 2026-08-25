





"use client";

import { useQuery } from "@tanstack/react-query";

import { getQuestionPackage } from "@/lib/api/questionPackages";

/* ============================================================
   TYPES
   ============================================================ */

export interface SubjectTopic {
  id: string;
  name: string;
}

/* ============================================================
   QUERY KEY
   ============================================================ */

export const subjectTopicsQueryKey = (
  subjectId: string,
) =>
  [
    "question-package",
    subjectId,
    "topics",
  ] as const;

/* ============================================================
   USE SUBJECT TOPICS
   ============================================================ */

export function useSubjectTopics(
  subjectId?: string,
) {
  const query = useQuery({
    queryKey: subjectId
      ? subjectTopicsQueryKey(subjectId)
      : [
          "question-package",
          "unauthenticated",
          "topics",
        ],

    queryFn: async () => {
      if (!subjectId) {
        throw new Error(
          "Cannot fetch topics: subject ID is missing.",
        );
      }

      /*
       * IMPORTANT:
       *
       * We do NOT call:
       *
       * GET /subjects/{subjectId}/topics
       *
       * Instead, topics come from:
       *
       * GET /question-packages/{subjectId}
       *
       * The package contains:
       *
       * subject
       * topics
       * questions
       * version
       */

      const response =
        await getQuestionPackage(subjectId);

      return response.data.topics;
    },

    enabled: Boolean(subjectId),

    staleTime: Infinity,

    gcTime: 30 * 60 * 1000,

    refetchOnWindowFocus: false,

    refetchOnReconnect: false,
  });

  /* ============================================================
     NORMALIZED DATA
     ============================================================ */

  const topics =
    query.data ?? [];

  return {
    /* React Query */

    data: query.data,

    topics,

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
       CONVENIENCE VALUES
       ======================================================== */

    isEmpty:
      !query.isLoading &&
      topics.length === 0,

    topicCount:
      topics.length,
  };
}