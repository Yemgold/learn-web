






"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import { useAuthStore } from "@/stores/auth.store";


import {
  createAssessment,
  getAssessmentsBySession,
  getAssessmentsByClassAndSubject,
  getAssessmentById,
  updateAssessmentStatus,
  type Assessment,
} from "@/lib/schools/portal/services/assessment.service";

/* =========================================
   RESPONSE HELPERS
========================================= */

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function unwrapResponse(response: unknown): unknown {
  if (!isRecord(response)) return response;

  // Axios response
  if ("data" in response) {
    const data = response.data;

    if (isRecord(data) && data.success === false) {
      throw new Error(
        String(data.message || "Assessment request failed."),
      );
    }

    if (
      isRecord(data) &&
      "data" in data &&
      data.success !== false
    ) {
      return data.data;
    }

    return data;
  }

  if (response.success === false) {
    throw new Error(
      String(response.message || "Assessment request failed."),
    );
  }

  return response.data ?? response;
}

function extractAssessments(response: unknown): Assessment[] {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    return result.filter(isRecord) as unknown as Assessment[];
  }

  if (!isRecord(result)) return [];

  const possibleKeys = [
    "assessments",
    "assessmentObj",
    "assessmentsObj",
    "assessmentList",
    "assessment",
    "results",
    "items",
  ];

  for (const key of possibleKeys) {
    const value = result[key];

    if (Array.isArray(value)) {
      return value.filter(isRecord) as unknown as Assessment[];
    }
  }

  // Some APIs return a single assessment.
  if (result._id || result.assessmentId) {
    return [result as unknown as Assessment];
  }

  return [];
}

function extractSingleAssessment(response: unknown): Assessment {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    const first = result[0];

    if (isRecord(first)) {
      return first as unknown as Assessment;
    }
  }

  if (isRecord(result)) {
    const possibleKeys = [
      "assessment",
      "assessmentObj",
      "assessmentDetails",
    ];

    for (const key of possibleKeys) {
      const value = result[key];

      if (isRecord(value)) {
        return value as unknown as Assessment;
      }
    }

    if (result._id || result.assessmentId) {
      return result as unknown as Assessment;
    }
  }

  throw new Error("Assessment information was not returned.");
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return (
      responseData?.message ||
      responseData?.error ||
      error.message ||
      "An assessment request failed."
    );
  }

  return error instanceof Error
    ? error.message
    : "An unexpected assessment error occurred.";
}

/* =========================================
   HOOK
========================================= */

export function useAssessments(slug: string) {
  /* =========================================
     AUTHENTICATION
  ========================================= */

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore(
    (state) => state.isHydrated,
  );

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId || "";

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug || "";

  /* =========================================
     STATE
  ========================================= */

  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [academicSessionId, setAcademicSessionId] =
    useState("");

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const requestId = useRef(0);

  /* =========================================
     VALIDATE SCHOOL CONTEXT
  ========================================= */

  const validateSchoolContext = useCallback(() => {
    if (!isHydrated) {
      throw new Error("Authentication is still loading.");
    }

    if (!schoolId) {
      throw new Error(
        "School membership ID could not be found. Please sign in again.",
      );
    }

    if (!schoolSubdomain.trim()) {
      throw new Error("School subdomain could not be identified.");
    }

    return schoolSubdomain.trim().toLowerCase();
  }, [isHydrated, schoolId, schoolSubdomain]);

  /* =========================================
     FETCH ALL ASSESSMENTS IN A SESSION
  ========================================= */

  const fetchAssessments = useCallback(
    async (sessionId?: string) => {
      const targetSessionId = (
        sessionId || academicSessionId
      ).trim();

      if (!targetSessionId) {
        setAssessments([]);
        setError("Please select an academic session.");
        return;
      }

      let subdomain: string;

      try {
        subdomain = validateSchoolContext();
      } catch (err) {
        setError(getErrorMessage(err));
        return;
      }

      const currentRequestId = ++requestId.current;

      try {
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        const response = await getAssessmentsBySession(
          targetSessionId,
          subdomain,
        );

        const result = extractAssessments(response);

        if (currentRequestId !== requestId.current) return;

        setAssessments(result);
        setAcademicSessionId(targetSessionId);
      } catch (err) {
        if (currentRequestId !== requestId.current) return;

        setAssessments([]);
        setError(getErrorMessage(err));
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
        }
      }
    },
    [
      academicSessionId,
      validateSchoolContext,
    ],
  );

  /* =========================================
     FETCH BY CLASS AND SUBJECT
  ========================================= */

  const fetchAssessmentsByClassAndSubject =
    useCallback(
      async (
        sessionId?: string,
        selectedClassId?: string,
        selectedSubjectId?: string,
      ) => {
        const targetSessionId = (
          sessionId || academicSessionId
        ).trim();

        const targetClassId = (
          selectedClassId || classId
        ).trim();

        const targetSubjectId = (
          selectedSubjectId || subjectId
        ).trim();

        if (
          !targetSessionId ||
          !targetClassId ||
          !targetSubjectId
        ) {
          setError(
            "Academic session, class and subject are required.",
          );
          return;
        }

        let subdomain: string;

        try {
          subdomain = validateSchoolContext();
        } catch (err) {
          setError(getErrorMessage(err));
          return;
        }

        const currentRequestId = ++requestId.current;

        try {
          setIsLoading(true);
          setError("");
          setSuccessMessage("");

          const response =
            await getAssessmentsByClassAndSubject(
              targetSessionId,
              targetClassId,
              targetSubjectId,
              subdomain,
            );

          const result = extractAssessments(response);

          if (currentRequestId !== requestId.current) return;

          setAssessments(result);
          setAcademicSessionId(targetSessionId);
          setClassId(targetClassId);
          setSubjectId(targetSubjectId);
        } catch (err) {
          if (currentRequestId !== requestId.current) return;

          setAssessments([]);
          setError(getErrorMessage(err));
        } finally {
          if (currentRequestId === requestId.current) {
            setIsLoading(false);
          }
        }
      },
      [
        academicSessionId,
        classId,
        subjectId,
        validateSchoolContext,
      ],
    );

  /* =========================================
     FETCH SINGLE ASSESSMENT
  ========================================= */

  const fetchAssessmentById = useCallback(
    async (
      assessmentId: string,
      sessionId?: string,
      selectedClassId?: string,
    ) => {
      const targetSessionId = (
        sessionId || academicSessionId
      ).trim();

      const targetClassId = (
        selectedClassId || classId
      ).trim();

      if (
        !assessmentId.trim() ||
        !targetSessionId ||
        !targetClassId
      ) {
        setError(
          "Assessment, academic session and class IDs are required.",
        );
        return null;
      }

      let subdomain: string;

      try {
        subdomain = validateSchoolContext();
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      }

      const currentRequestId = ++requestId.current;

      try {
        setIsLoading(true);
        setError("");

        const response = await getAssessmentById(
          targetSessionId,
          targetClassId,
          assessmentId.trim(),
          subdomain,
        );

        const result = extractSingleAssessment(response);

        if (currentRequestId !== requestId.current) return null;

        setSelectedAssessment(result);

        return result;
      } catch (err) {
        if (currentRequestId !== requestId.current) return null;

        setSelectedAssessment(null);
        setError(getErrorMessage(err));

        return null;
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
        }
      }
    },
    [
      academicSessionId,
      classId,
      validateSchoolContext,
    ],
  );

  /* =========================================
     CREATE ASSESSMENT
  ========================================= */

  const handleCreateAssessment = useCallback(
    async (payload: Record<string, unknown>) => {
      let subdomain: string;

      try {
        subdomain = validateSchoolContext();
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      }

      try {
        setIsSubmitting(true);
        setError("");
        setSuccessMessage("");

        const response = await createAssessment(
          payload,
          subdomain,
        );

        unwrapResponse(response);

        setSuccessMessage(
          "Assessment created successfully.",
        );

        if (academicSessionId) {
          await fetchAssessments(academicSessionId);
        }

        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      academicSessionId,
      fetchAssessments,
      validateSchoolContext,
    ],
  );

  /* =========================================
     UPDATE ASSESSMENT STATUS
  ========================================= */

  const handleUpdateAssessmentStatus =
    useCallback(
      async (
        assessmentId: string,
        payload: Record<string, unknown>,
      ) => {
        let subdomain: string;

        try {
          subdomain = validateSchoolContext();
        } catch (err) {
          setError(getErrorMessage(err));
          return false;
        }

        try {
          setIsUpdatingStatus(true);
          setError("");
          setSuccessMessage("");

          const response = await updateAssessmentStatus(
            assessmentId,
            payload,
            subdomain,
          );

          unwrapResponse(response);

          setSuccessMessage(
            "Assessment status updated successfully.",
          );

          if (academicSessionId) {
            await fetchAssessments(academicSessionId);
          }

          return true;
        } catch (err) {
          setError(getErrorMessage(err));
          return false;
        } finally {
          setIsUpdatingStatus(false);
        }
      },
      [
        academicSessionId,
        fetchAssessments,
        validateSchoolContext,
      ],
    );

  /* =========================================
     SELECT FILTERS
  ========================================= */

  const handleSessionChange = useCallback(
    (value: string) => {
      setAcademicSessionId(value);
      setAssessments([]);
      setError("");
    },
    [],
  );

  const handleClassChange = useCallback(
    (value: string) => {
      setClassId(value);
      setAssessments([]);
      setError("");
    },
    [],
  );

  const handleSubjectChange = useCallback(
    (value: string) => {
      setSubjectId(value);
      setAssessments([]);
      setError("");
    },
    [],
  );

  /* =========================================
     CLEAR MESSAGES
  ========================================= */

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  /* =========================================
     RESET
  ========================================= */

  const resetAssessments = useCallback(() => {
    requestId.current += 1;

    setAssessments([]);
    setSelectedAssessment(null);
    setAcademicSessionId("");
    setClassId("");
    setSubjectId("");
    setError("");
    setSuccessMessage("");
    setIsLoading(false);
  }, []);

  /* =========================================
     RETURN
  ========================================= */

  return {
    // Authentication context
    schoolId,
    schoolSubdomain,
    isHydrated,

    // Assessment data
    assessments,
    selectedAssessment,

    // Filters
    academicSessionId,
    classId,
    subjectId,

    // Loading states
    isLoading,
    isSubmitting,
    isUpdatingStatus,

    // Messages
    error,
    successMessage,

    // Filter handlers
    setAcademicSessionId: handleSessionChange,
    setClassId: handleClassChange,
    setSubjectId: handleSubjectChange,

    // API operations
    fetchAssessments,
    fetchAssessmentsByClassAndSubject,
    fetchAssessmentById,
    handleCreateAssessment,
    handleUpdateAssessmentStatus,

    // Utilities
    clearMessages,
    resetAssessments,
    setSelectedAssessment,
  };
}
