




"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuthStore } from "@/stores/auth.store";

import {
  getStudentAssessments,
  getStudentAssessmentDetails,
  startStudentAssessment,
  getStudentAssessmentAttempt,
  saveStudentAssessmentAnswers,
  submitStudentAssessment,
  type StudentAssessment,
  type StudentAssessmentAttempt,
  type StudentAssessmentAnswer,
  type SaveStudentAnswersPayload,
} from "@/lib/schools/portal/services/student-assessment.service";

/* =========================================================
   TYPES
========================================================= */

export interface StudentAssessmentFilters {
  academicSessionId: string;
  classId: string;
  subjectId?: string;
}

export interface StudentAssessmentHookOptions {
  academicSessionId?: string;
  classId?: string;
  subjectId?: string;
  autoLoad?: boolean;
}

export interface StudentAssessmentActionResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface HookError {
  message: string;
}

/* =========================================================
   HELPERS
========================================================= */

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.message ||
      response?.data?.error ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

/* =========================================================
   HOOK
========================================================= */

export function useStudentsAssessments(
  options: StudentAssessmentHookOptions = {}
) {
  const user = useAuthStore((state) => state.user);

  const schoolSubdomain = useMemo(() => {
    return (
      user?.schoolContext?.subDomain ||
      ""
    ).trim().toLowerCase();
  }, [user?.schoolContext?.subDomain]);

  const [assessments, setAssessments] = useState<
    StudentAssessment[]
  >([]);

  const [selectedAssessment, setSelectedAssessment] =
    useState<StudentAssessment | null>(null);

  const [attempt, setAttempt] =
    useState<StudentAssessmentAttempt | null>(null);

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [attemptLoading, setAttemptLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<HookError | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [answers, setAnswers] = useState<
    StudentAssessmentAnswer[]
  >([]);

  const requestIdRef = useRef(0);

  const filters = useMemo<StudentAssessmentFilters | null>(() => {
    if (!options.academicSessionId || !options.classId) {
      return null;
    }

    return {
      academicSessionId: options.academicSessionId,
      classId: options.classId,
      subjectId: options.subjectId,
    };
  }, [
    options.academicSessionId,
    options.classId,
    options.subjectId,
  ]);

  /* =======================================================
     LOAD ASSESSMENTS
  ======================================================= */

  const loadAssessments = useCallback(
    async (
      customFilters?: StudentAssessmentFilters
    ): Promise<StudentAssessment[]> => {
      const activeFilters = customFilters || filters;

      if (!schoolSubdomain) {
        setError({
          message: "School information is not available.",
        });
        return [];
      }

      if (
        !activeFilters?.academicSessionId ||
        !activeFilters?.classId
      ) {
        setError({
          message: "Academic session and class are required.",
        });
        return [];
      }

      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError(null);
      setSuccessMessage("");

      try {
        const result = await getStudentAssessments({
          academicSessionId: activeFilters.academicSessionId,
          classId: activeFilters.classId,
          subjectId: activeFilters.subjectId ?? "",
          schoolSubdomain,
        });

        if (requestId !== requestIdRef.current) {
          return result;
        }

        setAssessments(result);
        return result;
      } catch (err) {
        if (requestId === requestIdRef.current) {
          setError({
            message: getErrorMessage(err),
          });
          setAssessments([]);
        }

        return [];
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [filters, schoolSubdomain]
  );

  /* =======================================================
     VIEW ASSESSMENT DETAILS
  ======================================================= */

  const loadAssessmentDetails = useCallback(
    async (
      assessmentId: string,
      customFilters?: StudentAssessmentFilters
    ): Promise<StudentAssessment | null> => {
      const activeFilters = customFilters || filters;

      if (!schoolSubdomain) {
        setError({
          message: "School information is not available.",
        });
        return null;
      }

      if (
        !activeFilters?.academicSessionId ||
        !activeFilters?.classId ||
        !assessmentId
      ) {
        setError({
          message:
            "Assessment, academic session and class are required.",
        });
        return null;
      }

      setDetailsLoading(true);
      setError(null);
      setSelectedAssessment(null);

      try {
        const result = await getStudentAssessmentDetails(
          activeFilters.academicSessionId,
          activeFilters.classId,
          assessmentId,
          schoolSubdomain
        );

        setSelectedAssessment(result);
        return result;
      } catch (err) {
        setError({
          message: getErrorMessage(err),
        });
        return null;
      } finally {
        setDetailsLoading(false);
      }
    },
    [filters, schoolSubdomain]
  );

  /* =======================================================
     START ASSESSMENT
  ======================================================= */

  const startAssessment = useCallback(
    async (
      assessmentId: string,
      customFilters?: StudentAssessmentFilters
    ): Promise<StudentAssessmentAttempt | null> => {
      const activeFilters = customFilters || filters;

      if (!schoolSubdomain) {
        setError({
          message: "School information is not available.",
        });
        return null;
      }

      if (
        !activeFilters?.academicSessionId ||
        !activeFilters?.classId ||
        !assessmentId
      ) {
        setError({
          message:
            "Assessment, academic session and class are required.",
        });
        return null;
      }

      setAttemptLoading(true);
      setError(null);
      setSuccessMessage("");

      try {
        const result = await startStudentAssessment(
          activeFilters.academicSessionId,
          activeFilters.classId,
          assessmentId,
          schoolSubdomain
        );

        setAttempt(result as StudentAssessmentAttempt);
        setAnswers(
          Array.isArray(result.answers) ? result.answers : []
        );

        return result;
      } catch (err) {
        setError({
          message: getErrorMessage(err),
        });
        return null;
      } finally {
        setAttemptLoading(false);
      }
    },
    [filters, schoolSubdomain]
  );

  /* =======================================================
     RESUME / RETRIEVE EXISTING ATTEMPT
  ======================================================= */

  const loadAttempt = useCallback(
    async (
      attemptId: string
    ): Promise<StudentAssessmentAttempt | null> => {
      if (!schoolSubdomain) {
        setError({
          message: "School information is not available.",
        });
        return null;
      }

      if (!attemptId) {
        setError({
          message: "Assessment attempt ID is required.",
        });
        return null;
      }

      setAttemptLoading(true);
      setError(null);

      try {
        const result = await getStudentAssessmentAttempt(
          attemptId,
          schoolSubdomain
        );

        setAttempt(result);
        setAnswers(
          Array.isArray(result.answers) ? result.answers : []
        );

        return result;
      } catch (err) {
        setError({
          message: getErrorMessage(err),
        });
        return null;
      } finally {
        setAttemptLoading(false);
      }
    },
    [schoolSubdomain]
  );

  /* =======================================================
     UPDATE LOCAL ANSWERS
  ======================================================= */

  const updateAnswer = useCallback(
    (
      questionId: string,
      answer: StudentAssessmentAnswer["answer"]
    ) => {
      if (!questionId) return;

      setAnswers((previous) => {
        const existingIndex = previous.findIndex(
          (item) => item.questionId === questionId
        );

        if (existingIndex === -1) {
          return [
            ...previous,
            {
              questionId,
              answer,
            },
          ];
        }

        return previous.map((item, index) =>
          index === existingIndex
            ? { ...item, answer }
            : item
        );
      });
    },
    []
  );

  const updateAnswers = useCallback(
    (newAnswers: StudentAssessmentAnswer[]) => {
      setAnswers(Array.isArray(newAnswers) ? newAnswers : []);
    },
    []
  );

  /* =======================================================
     SAVE ANSWERS
  ======================================================= */

  const saveAnswers = useCallback(
    async (
      payload?: SaveStudentAnswersPayload
    ): Promise<boolean> => {
      if (!schoolSubdomain) {
        setError({
          message: "School information is not available.",
        });
        return false;
      }

      if (!attempt?._id) {
        setError({
          message: "No active assessment attempt was found.",
        });
        return false;
      }

      setSaving(true);
      setError(null);
      setSuccessMessage("");

      try {
        const savePayload: SaveStudentAnswersPayload =
          payload || {
            answers,
          };

        await saveStudentAssessmentAnswers(
          attempt._id,
          savePayload,
          schoolSubdomain
        );

        setSuccessMessage("Answers saved successfully.");
        return true;
      } catch (err) {
        setError({
          message: getErrorMessage(err),
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [answers, attempt, schoolSubdomain]
  );

  /* =======================================================
     SUBMIT ASSESSMENT
  ======================================================= */

  const submitAssessment = useCallback(
    async (): Promise<boolean> => {
      if (!schoolSubdomain) {
        setError({
          message: "School information is not available.",
        });
        return false;
      }

      if (!attempt?._id) {
        setError({
          message: "No active assessment attempt was found.",
        });
        return false;
      }

      setSubmitting(true);
      setError(null);
      setSuccessMessage("");

      try {
        const result = await submitStudentAssessment(
          attempt._id,
          schoolSubdomain
        );

        setAttempt(result);
        setSuccessMessage(
          "Your assessment has been submitted successfully."
        );

        return true;
      } catch (err) {
        setError({
          message: getErrorMessage(err),
        });
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [attempt, schoolSubdomain]
  );

  /* =======================================================
     RESET
  ======================================================= */

  const resetAssessmentState = useCallback(() => {
    setSelectedAssessment(null);
    setAttempt(null);
    setAnswers([]);
    setError(null);
    setSuccessMessage("");
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage("");
  }, []);

  /* =======================================================
     AUTO LOAD
  ======================================================= */

  useEffect(() => {
    if (
      options.autoLoad === false ||
      !filters ||
      !schoolSubdomain
    ) {
      return;
    }

    void loadAssessments();
  }, [
    filters,
    schoolSubdomain,
    options.autoLoad,
    loadAssessments,
  ]);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    // Data
    assessments,
    selectedAssessment,
    attempt,
    answers,

    // Loading states
    loading,
    detailsLoading,
    attemptLoading,
    saving,
    submitting,

    // Messages
    error: error?.message || null,
    successMessage,

    // Actions
    loadAssessments,
    loadAssessmentDetails,
    startAssessment,
    loadAttempt,
    updateAnswer,
    updateAnswers,
    saveAnswers,
    submitAssessment,
    resetAssessmentState,
    clearMessages,

    // Helpers
    hasAssessments: assessments.length > 0,
    hasAttempt: Boolean(attempt?._id),
    isSubmitted:
      attempt?.status?.toUpperCase() === "SUBMITTED",
  };
}

export default useStudentsAssessments;
