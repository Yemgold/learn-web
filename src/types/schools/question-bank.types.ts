



/* -------------------------------------------------------------------------- */
/* QUESTION BANK TYPES                                                        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* ENUMS / UNIONS                                                             */
/* -------------------------------------------------------------------------- */

export type QuestionDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER";

export type QuestionStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";

export type QuestionVisibility =
  | "PRIVATE"
  | "SCHOOL"
  | "PUBLIC";

export type QuestionBankRole =
  | "OWNER"
  | "ADMIN"
  | "TEACHER";

export type QuestionExamType =
  | "INTERNAL"
  | "EXTERNAL"
  | "WAEC"
  | "NECO"
  | "JAMB"
  | "POST_UTME"
  | "OTHER";

/* -------------------------------------------------------------------------- */
/* QUESTION OPTION                                                            */
/* -------------------------------------------------------------------------- */

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  imageUrl?: string;
}

/* -------------------------------------------------------------------------- */
/* QUESTION ANSWER                                                            */
/* -------------------------------------------------------------------------- */

export interface QuestionAnswer {
  correctAnswers: string[];
  explanation?: string;
  acceptedAnswers?: string[];
}

/* -------------------------------------------------------------------------- */
/* QUESTION SUBJECT / CLASS REFERENCES                                        */
/* -------------------------------------------------------------------------- */

export interface QuestionSubject {
  _id: string;
  subjectName: string;
  subjectCode?: string;
}

export interface QuestionClass {
  _id: string;
  className: string;
  classCode?: string;
}

/* -------------------------------------------------------------------------- */
/* QUESTION CATEGORY                                                          */
/* -------------------------------------------------------------------------- */

export interface QuestionCategory {
  _id: string;
  categoryName: string;
  description?: string;
  schoolId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/* QUESTION TOPIC                                                             */
/* -------------------------------------------------------------------------- */

export interface QuestionTopic {
  _id: string;
  topicName: string;
  description?: string;
  subjectId?: string;
  schoolId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/* MAIN QUESTION                                                              */
/* -------------------------------------------------------------------------- */

export interface SchoolQuestion {
  _id: string;
  id?: string;

  schoolId: string;

  questionText: string;
  questionType: QuestionType;

  subjectId: string | QuestionSubject;
  classId?: string | QuestionClass;

  categoryId?: string | QuestionCategory;
  topicId?: string | QuestionTopic;

  difficulty: QuestionDifficulty;
  examType?: QuestionExamType;

  options: QuestionOption[];

  correctAnswers: string[];
  acceptedAnswers?: string[];

  explanation?: string;

  marks: number;

  status: QuestionStatus;
  visibility?: QuestionVisibility;

  createdBy?: string;
  updatedBy?: string;

  createdAt?: string;
  updatedAt?: string;

  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/* CREATE QUESTION PAYLOAD                                                    */
/* -------------------------------------------------------------------------- */

export interface CreateSchoolQuestionPayload {
  questionText: string;
  questionType: QuestionType;

  subjectId: string;
  classId?: string;

  categoryId?: string;
  topicId?: string;

  difficulty: QuestionDifficulty;
  examType?: QuestionExamType;

  options?: QuestionOption[];

  correctAnswers: string[];
  acceptedAnswers?: string[];

  explanation?: string;

  marks: number;

  status?: QuestionStatus;
  visibility?: QuestionVisibility;
}

/* -------------------------------------------------------------------------- */
/* UPDATE QUESTION PAYLOAD                                                    */
/* -------------------------------------------------------------------------- */

export interface UpdateSchoolQuestionPayload
  extends Partial<CreateSchoolQuestionPayload> {}

/* -------------------------------------------------------------------------- */
/* QUESTION BANK FILTERS                                                      */
/* -------------------------------------------------------------------------- */

export interface QuestionBankFilters {
  search?: string;

  subjectId?: string;
  classId?: string;

  categoryId?: string;
  topicId?: string;

  difficulty?: QuestionDifficulty | "ALL";
  questionType?: QuestionType | "ALL";
  status?: QuestionStatus | "ALL";

  examType?: QuestionExamType | "ALL";

  page?: number;
  limit?: number;
}

/* -------------------------------------------------------------------------- */
/* PAGINATION                                                                 */
/* -------------------------------------------------------------------------- */

export interface QuestionBankPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

/* -------------------------------------------------------------------------- */
/* QUESTION BANK LIST RESPONSE                                                */
/* -------------------------------------------------------------------------- */

export interface QuestionBankList {
  questions: SchoolQuestion[];
  pagination: QuestionBankPagination;
}

/* -------------------------------------------------------------------------- */
/* QUESTION BANK SUMMARY                                                      */
/* -------------------------------------------------------------------------- */

export interface QuestionBankSummary {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

/* -------------------------------------------------------------------------- */
/* QUESTION BANK COMPONENT PROPS                                              */
/* -------------------------------------------------------------------------- */

export interface QuestionBankStatsProps {
  summary: QuestionBankSummary;
  loading: boolean;
}

export interface QuestionBankFiltersProps {
  filters: QuestionBankFilters;
  onChange: (filters: QuestionBankFilters) => void;
}

export interface QuestionBankTableProps {
  questions: SchoolQuestion[];
  loading: boolean;
  onView: (question: SchoolQuestion) => void;
  onEdit: (question: SchoolQuestion) => void;
  onDelete: (question: SchoolQuestion) => void;
}

/* -------------------------------------------------------------------------- */
/* QUESTION FORM PROPS                                                        */
/* -------------------------------------------------------------------------- */

export interface QuestionFormProps {
  initialData?: SchoolQuestion | null;
  submitting: boolean;
  onSubmit: (
    payload: CreateSchoolQuestionPayload
  ) => Promise<void>;
  onCancel: () => void;
}

/* -------------------------------------------------------------------------- */
/* QUESTION IMPORT                                                            */
/* -------------------------------------------------------------------------- */

export interface QuestionImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}

export interface QuestionImportPayload {
  subjectId: string;
  classId?: string;
  difficulty?: QuestionDifficulty;
  examType?: QuestionExamType;
  questions: CreateSchoolQuestionPayload[];
}

/* -------------------------------------------------------------------------- */
/* HOOK STATE                                                                 */
/* -------------------------------------------------------------------------- */

export interface UseQuestionBankReturn {
  questions: SchoolQuestion[];
  loading: boolean;
  submitting: boolean;
  error: string | null;

  summary: QuestionBankSummary;
  filters: QuestionBankFilters;
  pagination: QuestionBankPagination;

  setFilters: (filters: QuestionBankFilters) => void;

  fetchQuestions: () => Promise<void>;

  createQuestion: (
    payload: CreateSchoolQuestionPayload
  ) => Promise<void>;

  updateQuestion: (
    questionId: string,
    payload: UpdateSchoolQuestionPayload
  ) => Promise<void>;

  deleteQuestion: (
    questionId: string
  ) => Promise<void>;
}
