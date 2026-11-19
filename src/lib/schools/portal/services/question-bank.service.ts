
import { apiClient } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuestionOption {
  key: string;
  text: string;
  imageUrl?: string;
}

export interface QuestionAnswerKey {
  correctOptionKey?: string;
  correctOptionKeys?: string[];
  correctBoolean?: boolean;
  acceptedAnswers?: string[];
  modelAnswer?: string;
  markingGuide?: string;
}

export interface CreateQuestionItem {
  questionType: QuestionType;
  questionText: string;
  questionImages?: string[];
  options?: QuestionOption[];
  answerKey: QuestionAnswerKey;
  difficulty: QuestionDifficulty;
  topic?: string;
  explanation?: string;
}

export interface CreateQuestionsPayload {
  subjectId: string;
  classIds: string[];
  questions: CreateQuestionItem[];
}

export interface Question {
  _id: string;
  questionType?: QuestionType;
  questionText?: string;
  questionImages?: string[];
  options?: QuestionOption[];
  answerKey?: QuestionAnswerKey;
  difficulty?: QuestionDifficulty;
  topic?: string;
  explanation?: string;
  subjectId?: string;
  classIds?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/* =========================================================
   ENDPOINTS
========================================================= */

const QUESTION_BANK_ENDPOINTS = {
  createQuestions: (academicSessionId: string) =>
    `/school/question-bank/create-questions/${academicSessionId}`,

  getQuestion: (
    academicSessionId: string,
    classId: string,
    subjectId: string,
    questionId: string
  ) =>
    `/school/question-bank/get-question/${academicSessionId}/${classId}/${subjectId}/${questionId}`,

  getQuestionsByQuantity: (
    academicSessionId: string,
    subjectId: string,
    classId: string,
    quantity: number
  ) =>
    `/school/question-bank/get-questions-by-subjectId-classId-quantity/${academicSessionId}/${subjectId}/${classId}/${quantity}`,

updateQuestion: (questionId: string) =>
  `/school/question-bank/update-question/${encodeURIComponent(questionId)}`,


  updateQuestionStatus: (questionId: string) =>
    `/school/question-bank/update-question-status/${questionId}`,
};

/* =========================================================
   REQUEST CONFIG
========================================================= */

const getQuestionBankRequestConfig = (schoolSubdomain: string) => {
  const normalizedSubdomain = schoolSubdomain?.trim().toLowerCase();

  if (!normalizedSubdomain) {
    throw new Error("A valid school subdomain is required.");
  }

  return {
    headers: {
      "x-school-subdomain": normalizedSubdomain,
    },
  };
};

/* =========================================================
   CREATE QUESTIONS
========================================================= */

export const createQuestions = async (
  academicSessionId: string,
  payload: CreateQuestionsPayload,
  schoolSubdomain: string
) => {
  if (!academicSessionId?.trim()) {
    throw new Error("Academic session ID is required.");
  }

  if (!payload.subjectId || payload.classIds.length === 0) {
    throw new Error("Subject and at least one class are required.");
  }

  if (payload.questions.length === 0) {
    throw new Error("At least one question is required.");
  }

  return apiClient.post(
    QUESTION_BANK_ENDPOINTS.createQuestions(academicSessionId),
    payload,
    getQuestionBankRequestConfig(schoolSubdomain)
  );
};

/* =========================================================
   GET SINGLE QUESTION
========================================================= */

export const getQuestion = async (
  academicSessionId: string,
  classId: string,
  subjectId: string,
  questionId: string,
  schoolSubdomain: string
) => {
  return apiClient.get(
    QUESTION_BANK_ENDPOINTS.getQuestion(
      academicSessionId,
      classId,
      subjectId,
      questionId
    ),
    getQuestionBankRequestConfig(schoolSubdomain)
  );
};

/* =========================================================
   GET QUESTIONS BY SUBJECT, CLASS AND QUANTITY
========================================================= */

export const getQuestionsByQuantity = async (
  academicSessionId: string,
  subjectId: string,
  classId: string,
  quantity: number,
  schoolSubdomain: string
) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Question quantity must be a positive integer.");
  }

  return apiClient.get(
    QUESTION_BANK_ENDPOINTS.getQuestionsByQuantity(
      academicSessionId,
      subjectId,
      classId,
      quantity
    ),
    getQuestionBankRequestConfig(schoolSubdomain)
  );
};

/* =========================================================
   UPDATE QUESTION STATUS
   HTTP METHOD: PATCH
========================================================= */

export const updateQuestionStatus = async (
  questionId: string,
  payload: Record<string, unknown>,
  schoolSubdomain: string
) => {
  if (!questionId?.trim()) {
    throw new Error("Question ID is required.");
  }

  return apiClient.patch(
    QUESTION_BANK_ENDPOINTS.updateQuestionStatus(questionId),
    payload,
    getQuestionBankRequestConfig(schoolSubdomain)
  );
};


/* =========================================================
   UPDATE QUESTION CONTENT
   HTTP METHOD: PATCH
========================================================= */

export const updateQuestion = async (
  questionId: string,
  payload: CreateQuestionItem,
  schoolSubdomain: string
) => {
  if (!questionId?.trim()) {
    throw new Error("Question ID is required.");
  }

  if (!payload.questionText?.trim()) {
    throw new Error("Question text is required.");
  }

  return apiClient.patch(
    QUESTION_BANK_ENDPOINTS.updateQuestion(questionId),
    payload,
    getQuestionBankRequestConfig(schoolSubdomain)
  );
};