





import type {
  ID,
  PaginationParams,
} from "./types";

/* =========================================================
   QUESTION ENUMS
========================================================= */

export type QuestionType =
  | "OBJECTIVE"
  | "THEORY"
  | "FILL_IN_THE_GAP"
  | "TRUE_FALSE"
  | "MATCHING";

export type QuestionDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export type QuestionStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "REJECTED";

export type QuestionSource =
  | "SCHOOL"
  | "TEACHER"
  | "JAMB"
  | "WAEC"
  | "NECO"
  | "CUSTOM";

/* =========================================================
   QUESTION OPTIONS
========================================================= */

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
}

/* =========================================================
   QUESTION EXPLANATION
========================================================= */

export interface QuestionExplanation {
  intro?: string;
  steps?: string[];
  conclusion?: string;

  text?: string;
  imageUrl?: string;
}

/* =========================================================
   QUESTION MEDIA
========================================================= */

export interface QuestionMedia {
  id?: ID;
  url: string;
  type: "IMAGE" | "AUDIO" | "VIDEO";
  alt?: string;
  caption?: string;
}

/* =========================================================
   QUESTION
========================================================= */

export interface SchoolQuestion {
  id: ID;

  question: string;
  type: QuestionType;

  options?: QuestionOption[];

  // Objective questions normally have one correct option.
  // The backend should control when this field is exposed.
  correctAnswer?: string | string[];

  explanation?: QuestionExplanation;

  subjectId: ID;
  classId?: ID;

  subject?: {
    id: ID;
    name: string;
  };

  topic?: string;
  subtopic?: string;

  difficulty: QuestionDifficulty;

  marks?: number;

  media?: QuestionMedia[];

  tags?: string[];

  source?: QuestionSource;
  sourceYear?: number;

  status: QuestionStatus;

  createdBy?: ID;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   CREATE QUESTION
========================================================= */

export interface CreateQuestionPayload {
  question: string;
  type: QuestionType;

  options?: QuestionOption[];

  correctAnswer?: string | string[];

  explanation?: QuestionExplanation;

  subjectId: ID;
  classId?: ID;

  topic?: string;
  subtopic?: string;

  difficulty: QuestionDifficulty;

  marks?: number;

  media?: QuestionMedia[];
  tags?: string[];

  source?: QuestionSource;
  sourceYear?: number;

  status?: QuestionStatus;
}

/* =========================================================
   UPDATE QUESTION
========================================================= */

export interface UpdateQuestionPayload
  extends Partial<CreateQuestionPayload> {}

/* =========================================================
   QUESTION FILTERS
========================================================= */

export interface QuestionFilters extends PaginationParams {
  subjectId?: ID;
  classId?: ID;

  topic?: string;
  subtopic?: string;

  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;

  source?: QuestionSource;
  sourceYear?: number;

  tags?: string[];
}

/* =========================================================
   QUESTION BANK SUMMARY
========================================================= */

export interface QuestionBankStats {
  totalQuestions: number;
  publishedQuestions: number;
  draftQuestions: number;
  archivedQuestions: number;

  easyQuestions?: number;
  mediumQuestions?: number;
  hardQuestions?: number;
}

/* =========================================================
   QUESTION BANK RESPONSE
========================================================= */

export interface QuestionBankData {
  questions: SchoolQuestion[];
  stats?: QuestionBankStats;

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   QUESTION IMPORT
========================================================= */

export interface QuestionImportError {
  row: number;
  message: string;
  field?: string;
}

export interface QuestionImportResult {
  totalSubmitted: number;
  successful: number;
  failed: number;
  errors?: QuestionImportError[];
}
