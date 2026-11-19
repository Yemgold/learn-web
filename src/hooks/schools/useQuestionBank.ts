



"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import { useAuthStore } from "@/stores/auth.store";

import {
  createQuestions,
  getQuestion,
  getQuestionsByQuantity,
  updateQuestionStatus,
  type CreateQuestionsPayload,
  type Question,
} from "@/lib/schools/portal/services/question-bank.service";

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const unwrapResponse = (response: unknown): unknown => {
  if (!isRecord(response)) return response;

  if ("data" in response) {
    return unwrapResponse(response.data);
  }

  return response;
};

const extractQuestions = (response: unknown): Question[] => {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) {
    return data as Question[];
  }

  if (!isRecord(data)) return [];

  const possibleKeys = [
    "questions",
    "questionObj",
    "questionsObj",
    "questionBank",
    "questionBankObj",
    "questionBankQuestions",
    "questionBankQuestionsObj",
  ];

  for (const key of possibleKeys) {
    const value = data[key];

    if (Array.isArray(value)) {
      return value as Question[];
    }

    if (isRecord(value)) {
      if (Array.isArray(value.questions)) {
        return value.questions as Question[];
      }

      if (Array.isArray(value.data)) {
        return value.data as Question[];
      }
    }
  }

  return [];
};

const extractSingleQuestion = (response: unknown): Question | null => {
  const data = unwrapResponse(response);

  if (!isRecord(data)) return null;

  const possibleKeys = [
    "question",
    "questionObj",
    "questionData",
  ];

  for (const key of possibleKeys) {
    const value = data[key];

    if (isRecord(value)) {
      return value as Question;
    }
  }

  if (typeof data._id === "string") {
    return data as Question;
  }

  return null;
};

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (isRecord(error)) {
    const response = error.response;

    if (isRecord(response) && isRecord(response.data)) {
      const message = response.data.message;

      if (typeof message === "string" && message.trim()) {
        return message;
      }

      const nestedError = response.data.error;

      if (typeof nestedError === "string" && nestedError.trim()) {
        return nestedError;
      }

      if (Array.isArray(message)) {
        return message.join(", ");
      }
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  return fallback;
};

/* =========================================================
   HOOK
========================================================= */

export const useQuestionBank = (slug: string) => {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId;

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const role = (
    user?.schoolContext?.userSchoolMembership?.role || ""
  ).toUpperCase();

  const isTeacher = role === "TEACHER";

  const isAdministrator =
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "ADMINISTRATOR";

  /* =======================================================
     STATE
  ======================================================= */

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] =
    useState<Question | null>(null);

  const [academicSessionId, setAcademicSessionId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [quantity, setQuantity] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );

  const requestId = useRef(0);

  /* =======================================================
     VALIDATE SCHOOL CONTEXT
  ======================================================= */

  const validateSchoolContext = useCallback(() => {
    if (!isHydrated) {
      throw new Error("Please wait while your account loads.");
    }

    if (!schoolId) {
      throw new Error("Your school membership could not be identified.");
    }

    if (!schoolSubdomain?.trim()) {
      throw new Error("School subdomain is required.");
    }
  }, [isHydrated, schoolId, schoolSubdomain]);

  const requireAdministrator = useCallback(() => {
    validateSchoolContext();

    if (!isAdministrator) {
      throw new Error(
        "Only school administrators can view and manage question-bank questions."
      );
    }
  }, [isAdministrator, validateSchoolContext]);

  const requireTeacher = useCallback(() => {
    validateSchoolContext();

    if (!isTeacher) {
      throw new Error(
        "Only teachers can create question-bank questions."
      );
    }
  }, [isTeacher, validateSchoolContext]);

  /* =======================================================
     FETCH QUESTIONS BY QUANTITY
     ADMINISTRATORS ONLY
  ======================================================= */

  const fetchQuestions = useCallback(
    async (
      sessionId?: string,
      selectedSubjectId?: string,
      selectedClassId?: string,
      requestedQuantity?: number
    ) => {
      const currentRequestId = ++requestId.current;

      try {
        requireAdministrator();

        const currentSessionId = sessionId || academicSessionId;
        const currentSubjectId = selectedSubjectId || subjectId;
        const currentClassId = selectedClassId || classId;
        const currentQuantity = requestedQuantity ?? quantity;

        if (!currentSessionId || !currentSubjectId || !currentClassId) {
          throw new Error(
            "Please select an academic session, class and subject."
          );
        }

        if (
          !Number.isInteger(currentQuantity) ||
          currentQuantity < 1
        ) {
          throw new Error("Enter a valid question quantity.");
        }

        setIsLoading(true);
        setError(null);

        const response = await getQuestionsByQuantity(
          currentSessionId,
          currentSubjectId,
          currentClassId,
          currentQuantity,
          schoolSubdomain
        );

        if (currentRequestId !== requestId.current) return [];

        const result = extractQuestions(response);

        setQuestions(result);
        setAcademicSessionId(currentSessionId);
        setSubjectId(currentSubjectId);
        setClassId(currentClassId);
        setQuantity(currentQuantity);

        return result;
      } catch (err) {
        if (currentRequestId === requestId.current) {
          setError(
            getErrorMessage(err, "Unable to load questions.")
          );
          setQuestions([]);
        }

        return [];
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
        }
      }
    },
    [
      academicSessionId,
      subjectId,
      classId,
      quantity,
      schoolSubdomain,
      requireAdministrator,
    ]
  );

  /* =======================================================
     FETCH SINGLE QUESTION
     ADMINISTRATORS ONLY
  ======================================================= */

  const fetchQuestionById = useCallback(
    async (
      questionId: string,
      sessionId?: string,
      selectedClassId?: string,
      selectedSubjectId?: string
    ) => {
      try {
        requireAdministrator();

        const currentSessionId = sessionId || academicSessionId;
        const currentClassId = selectedClassId || classId;
        const currentSubjectId = selectedSubjectId || subjectId;

        if (!currentSessionId || !currentClassId || !currentSubjectId) {
          throw new Error(
            "Academic session, class and subject are required."
          );
        }

        if (!questionId?.trim()) {
          throw new Error("Question ID is required.");
        }

        setIsLoading(true);
        setError(null);

        const response = await getQuestion(
          currentSessionId,
          currentClassId,
          currentSubjectId,
          questionId,
          schoolSubdomain
        );

        const result = extractSingleQuestion(response);

        if (!result) {
          throw new Error("Question could not be found.");
        }

        setSelectedQuestion(result);

        return result;
      } catch (err) {
        setError(
          getErrorMessage(err, "Unable to load question.")
        );

        setSelectedQuestion(null);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [
      academicSessionId,
      classId,
      subjectId,
      schoolSubdomain,
      requireAdministrator,
    ]
  );

  /* =======================================================
     CREATE QUESTIONS
     TEACHERS ONLY

     IMPORTANT:
     Do not call fetchQuestions after creating.
     The question-list GET endpoint is administrator-only.
  ======================================================= */

  const handleCreateQuestions = useCallback(
    async (
      payload: CreateQuestionsPayload,
      sessionId?: string
    ) => {
      try {
        requireTeacher();

        const currentSessionId = sessionId || academicSessionId;

        if (!currentSessionId?.trim()) {
          throw new Error("Academic session is required.");
        }

        if (!payload.subjectId?.trim()) {
          throw new Error("Please select a subject.");
        }

        if (!Array.isArray(payload.classIds) || payload.classIds.length === 0) {
          throw new Error("Please select at least one class.");
        }

        if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
          throw new Error("Please add at least one question.");
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        const response = await createQuestions(
          currentSessionId,
          payload,
          schoolSubdomain
        );

        setAcademicSessionId(currentSessionId);
        setSubjectId(payload.subjectId);

        // Do not fetch the administrator-only question list here.
        setQuestions([]);

        setSuccessMessage("Questions created successfully.");

        return unwrapResponse(response);
      } catch (err) {
        setError(
          getErrorMessage(err, "Unable to create questions.")
        );

        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      academicSessionId,
      schoolSubdomain,
      requireTeacher,
    ]
  );

  /* =======================================================
     UPDATE QUESTION STATUS
     ADMINISTRATORS ONLY
  ======================================================= */

  const handleUpdateQuestionStatus = useCallback(
    async (
      questionId: string,
      payload: Record<string, unknown>
    ) => {
      try {
        requireAdministrator();

        if (!questionId?.trim()) {
          throw new Error("Question ID is required.");
        }

        setIsUpdatingStatus(true);
        setError(null);
        setSuccessMessage(null);

        const response = await updateQuestionStatus(
          questionId,
          payload,
          schoolSubdomain
        );

        const updatedData = unwrapResponse(response);

        if (
          selectedQuestion &&
          selectedQuestion._id === questionId
        ) {
          if (isRecord(updatedData)) {
            setSelectedQuestion((previous) =>
              previous
                ? { ...previous, ...updatedData }
                : previous
            );
          }
        }

        if (isRecord(updatedData)) {
          setQuestions((previous) =>
            previous.map((question) =>
              question._id === questionId
                ? { ...question, ...updatedData }
                : question
            )
          );
        }

        setSuccessMessage("Question status updated successfully.");

        return updatedData;
      } catch (err) {
        setError(
          getErrorMessage(err, "Unable to update question status.")
        );

        return null;
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [
      schoolSubdomain,
      selectedQuestion,
      requireAdministrator,
    ]
  );

  /* =======================================================
     CLEAR MESSAGES
  ======================================================= */

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  /* =======================================================
     RESET
  ======================================================= */

  const resetQuestionBank = useCallback(() => {
    requestId.current += 1;

    setQuestions([]);
    setSelectedQuestion(null);

    setAcademicSessionId("");
    setClassId("");
    setSubjectId("");
    setQuantity(10);

    setError(null);
    setSuccessMessage(null);

    setIsLoading(false);
    setIsSubmitting(false);
    setIsUpdatingStatus(false);
  }, []);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    // Context
    schoolId,
    schoolSubdomain,
    isHydrated,
    role,
    isTeacher,
    isAdministrator,

    // Data
    questions,
    selectedQuestion,

    // Filters
    academicSessionId,
    classId,
    subjectId,
    quantity,

    // Setters
    setAcademicSessionId,
    setClassId,
    setSubjectId,
    setQuantity,
    setSelectedQuestion,

    // Loading states
    isLoading,
    isSubmitting,
    isUpdatingStatus,

    // Messages
    error,
    successMessage,
    clearMessages,

    // Operations
    fetchQuestions,
    fetchQuestionById,
    handleCreateQuestions,
    handleUpdateQuestionStatus,

    // Reset
    resetQuestionBank,
  };
};

export default useQuestionBank;
