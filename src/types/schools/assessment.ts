


import type {
  ID,
  PaginationParams,
  AcademicTerm,
} from "./types";

import type {
  QuestionDifficulty,
  QuestionType,
  QuestionOption,
  QuestionExplanation,
} from "./question";

/* =========================================================
   ASSESSMENT ENUMS
========================================================= */

export type AssessmentType =
  | "EXAM"
  | "TEST"
  | "QUIZ"
  | "ASSIGNMENT"
  | "PRACTICE";

export type AssessmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export type AssessmentVisibility =
  | "CLASS"
  | "SELECTED_STUDENTS";

export type AssessmentAttemptStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "AUTO_SUBMITTED"
  | "GRADED"
  | "EXPIRED";

export type AssessmentResultStatus =
  | "PENDING"
  | "GRADED"
  | "PUBLISHED"
  | "REVIEWED";

/* =========================================================
   ASSESSMENT QUESTION
========================================================= */

/**
 * Teacher/admin version.
 * May contain the answer key and explanation.
 */
export interface AssessmentQuestion {
  id: ID;
  questionId?: ID;

  question: string;
  type: QuestionType;

  options?: QuestionOption[];

  correctAnswer?: string | string[];
  explanation?: QuestionExplanation;

  difficulty?: QuestionDifficulty;

  marks: number;
  order: number;

  topic?: string;
  imageUrl?: string;
}

/**
 * Student version.
 * Deliberately excludes correctAnswer and explanation.
 */
export interface StudentAssessmentQuestion {
  id: ID;
  questionId?: ID;

  question: string;
  type: QuestionType;

  options?: QuestionOption[];

  marks: number;
  order: number;

  topic?: string;
  imageUrl?: string;
}

/* =========================================================
   ASSESSMENT
========================================================= */

export interface SchoolAssessment {
  id: ID;

  title: string;
  description?: string;
  instructions?: string;

  type: AssessmentType;
  status: AssessmentStatus;

  subjectId: ID;
  classId: ID;

  subject?: {
    id: ID;
    name: string;
  };

  class?: {
    id: ID;
    name: string;
  };

  teacherId?: ID;

  academicSessionId?: ID;
  term?: AcademicTerm;

  questions?: AssessmentQuestion[];

  totalQuestions: number;
  totalMarks: number;

  duration: number;

  startDate: string;
  endDate: string;

  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;

  allowRetake?: boolean;
  maximumAttempts?: number;

  showResultImmediately?: boolean;
  showCorrectAnswers?: boolean;

  passMark?: number;

  visibility?: AssessmentVisibility;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   CREATE ASSESSMENT
========================================================= */

export interface CreateAssessmentPayload {
  title: string;
  description?: string;
  instructions?: string;

  type: AssessmentType;

  subjectId: ID;
  classId: ID;

  academicSessionId?: ID;
  term?: AcademicTerm;

  questionIds?: ID[];
  questions?: AssessmentQuestion[];

  duration: number;

  startDate: string;
  endDate: string;

  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;

  allowRetake?: boolean;
  maximumAttempts?: number;

  showResultImmediately?: boolean;
  showCorrectAnswers?: boolean;

  passMark?: number;

  visibility?: AssessmentVisibility;
}

/* =========================================================
   UPDATE ASSESSMENT
========================================================= */

export interface UpdateAssessmentPayload
  extends Partial<CreateAssessmentPayload> {
  status?: AssessmentStatus;
}

/* =========================================================
   ASSESSMENT FILTERS
========================================================= */

export interface AssessmentFilters extends PaginationParams {
  subjectId?: ID;
  classId?: ID;
  teacherId?: ID;

  type?: AssessmentType;
  status?: AssessmentStatus;

  term?: AcademicTerm;

  startDate?: string;
  endDate?: string;
}

/* =========================================================
   STUDENT ANSWERS
========================================================= */

export interface StudentAnswer {
  questionId: ID;

  // Selected option ID, text answer, or multiple selected IDs.
  answer: string | string[] | null;

  answeredAt?: string;
}

export interface SaveAssessmentAnswersPayload {
  answers: StudentAnswer[];
}

/* =========================================================
   ASSESSMENT ATTEMPT
========================================================= */

export interface AssessmentAttempt {
  id: ID;

  assessmentId: ID;
  studentId: ID;

  status: AssessmentAttemptStatus;

  questions?: StudentAssessmentQuestion[];
  answers?: StudentAnswer[];

  startedAt?: string;
  submittedAt?: string;

  timeRemaining?: number;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   START ASSESSMENT
========================================================= */

export interface StartAssessmentPayload {
  assessmentId: ID;
}

export interface StartAssessmentResponse {
  attemptId: ID;
  assessmentId: ID;

  title: string;
  instructions?: string;

  duration: number;
  startedAt: string;
  endsAt?: string;

  questions: StudentAssessmentQuestion[];
}

/* =========================================================
   SUBMIT ASSESSMENT
========================================================= */

export interface SubmitAssessmentPayload {
  attemptId: ID;
  answers: StudentAnswer[];
}

export interface SubmitAssessmentResponse {
  attemptId: ID;
  status: AssessmentAttemptStatus;
  submittedAt: string;
  message?: string;
}

/* =========================================================
   ASSESSMENT RESULT
========================================================= */

export interface AssessmentResult {
  id: ID;

  assessmentId: ID;
  attemptId: ID;
  studentId: ID;

  totalMarks: number;
  marksObtained: number;

  percentage: number;
  passMark?: number;

  isPassed: boolean;

  correctAnswers?: number;
  incorrectAnswers?: number;
  unansweredQuestions?: number;

  timeTaken?: number;

  status: AssessmentResultStatus;

  gradedAt?: string;
  publishedAt?: string;

  feedback?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   RESULT QUESTION BREAKDOWN
========================================================= */

export interface AssessmentQuestionResult {
  questionId: ID;

  question: string;

  studentAnswer?: string | string[] | null;
  correctAnswer?: string | string[];

  marks: number;
  marksAwarded: number;

  isCorrect?: boolean;

  explanation?: QuestionExplanation;
}

/* =========================================================
   DETAILED RESULT
========================================================= */

export interface DetailedAssessmentResult extends AssessmentResult {
  assessment?: SchoolAssessment;

  student?: {
    id: ID;
    firstName: string;
    lastName: string;
    admissionNumber?: string;
  };

  questionResults?: AssessmentQuestionResult[];
}

/* =========================================================
   ASSESSMENT RESULT FILTERS
========================================================= */

export interface AssessmentResultFilters extends PaginationParams {
  assessmentId?: ID;
  studentId?: ID;
  classId?: ID;
  subjectId?: ID;

  status?: AssessmentResultStatus;

  isPassed?: boolean;
}

/* =========================================================
   ASSESSMENT DASHBOARD STATISTICS
========================================================= */

export interface AssessmentStats {
  totalAssessments: number;
  publishedAssessments: number;
  ongoingAssessments: number;
  completedAssessments: number;

  totalAttempts?: number;
  pendingSubmissions?: number;
  gradedSubmissions?: number;

  averageScore?: number;
  passRate?: number;
}

/* =========================================================
   ASSESSMENT LIST RESPONSE
========================================================= */

export interface AssessmentListData {
  assessments: SchoolAssessment[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   STUDENT ASSESSMENT HISTORY
========================================================= */

export interface StudentAssessmentHistory {
  id: ID;

  assessmentId: ID;
  title: string;

  subjectName?: string;
  className?: string;

  type: AssessmentType;
  status: AssessmentAttemptStatus;

  startedAt?: string;
  submittedAt?: string;

  score?: number;
  totalMarks?: number;
  percentage?: number;

  resultId?: ID;
}
