




"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  FileQuestion,
  Filter,
  GripVertical,
  Loader2,
  Plus,
  Search,
  Trash2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  getContestWithSubjectsById,
} from "@/lib/api/solveAndWin";

/* ============================================================
   TYPES
============================================================ */

type Difficulty = "Easy" | "Medium" | "Hard";

type QuestionType =
  | "Multiple Choice"
  | "True / False"
  | "Multiple Answer";

interface CompetitionQuestion {
  id: string;
  number: number;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  difficulty: Difficulty;
  type: QuestionType;
  marks: number;
  explanation?: string;
}

/*
 * Backend question shape has not been fully provided yet.
 * We therefore normalize the returned object defensively.
 */
interface BackendQuestion {
  _id?: string;
  id?: string;

  question?: string;
  text?: string;
  questionText?: string;
  content?: string;

  options?: unknown;
  answers?: unknown;
  choices?: unknown;

  correctAnswer?: unknown;
  correctAnswers?: unknown;
  answer?: unknown;
  correctOption?: unknown;

  difficulty?: string;

  type?: string;
  questionType?: string;

  marks?: number;
  mark?: number;
  points?: number;

  explanation?: string;

  [key: string]: unknown;
}

interface ContestSubject {
  subjectId: {
    _id: string;
    name: string;
  };
  questions: BackendQuestion[];
}

interface ContestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  amountToBeWonInKobo: number;
  entryPoints: number;
  subjects: ContestSubject[];
  status: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

/* ============================================================
   HELPERS
============================================================ */

function difficultyClasses(difficulty: Difficulty) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700";

    case "Medium":
      return "bg-yellow-100 text-yellow-700";

    case "Hard":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function questionTypeClasses(type: QuestionType) {
  switch (type) {
    case "Multiple Choice":
      return "bg-blue-100 text-blue-700";

    case "True / False":
      return "bg-purple-100 text-purple-700";

    case "Multiple Answer":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function normalizeDifficulty(value: unknown): Difficulty {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";

  return "Medium";
}

function normalizeQuestionType(value: unknown): QuestionType {
  const normalized = String(value ?? "").toLowerCase();

  if (
    normalized.includes("true") ||
    normalized.includes("false")
  ) {
    return "True / False";
  }

  if (
    normalized.includes("multiple answer") ||
    normalized.includes("multiple-answer") ||
    normalized.includes("multiple_answer") ||
    normalized.includes("multi")
  ) {
    return "Multiple Answer";
  }

  return "Multiple Choice";
}

function normalizeOptions(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((option) => {
      if (typeof option === "string") {
        return option;
      }

      if (
        option &&
        typeof option === "object"
      ) {
        const item = option as Record<string, unknown>;

        return String(
          item.text ??
            item.label ??
            item.value ??
            item.option ??
            ""
        );
      }

      return String(option ?? "");
    })
    .filter(Boolean);
}

function normalizeCorrectAnswer(
  value: unknown,
): string | string[] {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (
        item &&
        typeof item === "object"
      ) {
        const object = item as Record<string, unknown>;

        return String(
          object.text ??
            object.label ??
            object.value ??
            object.option ??
            "",
        );
      }

      return String(item ?? "");
    });
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const object = value as Record<string, unknown>;

    return String(
      object.text ??
        object.label ??
        object.value ??
        object.option ??
        "",
    );
  }

  return String(value ?? "");
}

function normalizeQuestion(
  question: BackendQuestion,
  index: number,
): CompetitionQuestion {
  const questionId =
    question._id ??
    question.id ??
    `question-${index + 1}`;

  const questionText =
    question.question ??
    question.text ??
    question.questionText ??
    question.content ??
    "Question text unavailable";

  const options = normalizeOptions(
    question.options ??
      question.answers ??
      question.choices ??
      [],
  );

  const correctAnswer = normalizeCorrectAnswer(
    question.correctAnswer ??
      question.correctAnswers ??
      question.answer ??
      question.correctOption ??
      "",
  );

  const marks =
    typeof question.marks === "number"
      ? question.marks
      : typeof question.mark === "number"
        ? question.mark
        : typeof question.points === "number"
          ? question.points
          : 0;

  return {
    id: questionId,
    number: index + 1,
    question: String(questionText),
    options,
    correctAnswer,
    difficulty: normalizeDifficulty(
      question.difficulty,
    ),
    type: normalizeQuestionType(
      question.type ??
        question.questionType,
    ),
    marks,
    explanation:
      typeof question.explanation === "string"
        ? question.explanation
        : undefined,
  };
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminCompetitionSubjectQuestionsPage() {
  const params = useParams<{
    competitionId: string;
    subjectId: string;
  }>();

  const competitionId = params.competitionId;
  const subjectId = params.subjectId;

  const [contest, setContest] =
    useState<ContestData | null>(null);

  const [questions, setQuestions] =
    useState<CompetitionQuestion[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [difficultyFilter, setDifficultyFilter] =
    useState<"All" | Difficulty>("All");

  const [typeFilter, setTypeFilter] =
    useState<"All" | QuestionType>("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedQuestion, setSelectedQuestion] =
    useState<CompetitionQuestion | null>(null);

  const [showPreview, setShowPreview] =
    useState(false);

  const [deleteQuestionId, setDeleteQuestionId] =
    useState<string | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  /* ============================================================
     LOAD CONTEST + SUBJECT QUESTIONS
  ============================================================ */

  const loadQuestions = async () => {
    if (!competitionId || !subjectId) {
      setError("Competition or subject ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response =
        await getContestWithSubjectsById(
          competitionId,
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to load competition.",
        );
      }

      const contestData =
        response.data as ContestData;

      setContest(contestData);

      const currentSubject =
        contestData.subjects?.find(
          (item) =>
            item.subjectId?._id === subjectId,
        );

      if (!currentSubject) {
        throw new Error(
          "This subject was not found in this competition.",
        );
      }

      const normalizedQuestions =
        (currentSubject.questions ?? []).map(
          (question, index) =>
            normalizeQuestion(
              question,
              index,
            ),
        );

      setQuestions(normalizedQuestions);
    } catch (err) {
      console.error(
        "Failed to load competition questions:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load questions.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [competitionId, subjectId]);

  /* ============================================================
     SUBJECT
  ============================================================ */

  const currentSubject =
    contest?.subjects?.find(
      (item) =>
        item.subjectId?._id === subjectId,
    );

  const subjectName =
    currentSubject?.subjectId?.name ??
    "Subject";

  /* ============================================================
     FILTER QUESTIONS
  ============================================================ */

  const filteredQuestions = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !search ||
        question.question
          .toLowerCase()
          .includes(search) ||
        question.options.some((option) =>
          option
            .toLowerCase()
            .includes(search),
        );

      const matchesDifficulty =
        difficultyFilter === "All" ||
        question.difficulty ===
          difficultyFilter;

      const matchesType =
        typeFilter === "All" ||
        question.type === typeFilter;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesType
      );
    });
  }, [
    questions,
    searchTerm,
    difficultyFilter,
    typeFilter,
  ]);

  /* ============================================================
     STATISTICS
  ============================================================ */

  const totalMarks = questions.reduce(
    (total, question) =>
      total + question.marks,
    0,
  );

  const easyCount = questions.filter(
    (question) =>
      question.difficulty === "Easy",
  ).length;

  const mediumCount = questions.filter(
    (question) =>
      question.difficulty === "Medium",
  ).length;

  const hardCount = questions.filter(
    (question) =>
      question.difficulty === "Hard",
  ).length;

  /* ============================================================
     DELETE QUESTION
  ============================================================ */

  const handleDelete = async (
    questionId: string,
  ) => {
    if (!competitionId) return;

    try {
      setIsDeleting(true);
      setError(null);

      /*
       * IMPORTANT:
       *
       * The backend endpoint is contest-level:
       *
       * POST/DELETE
       * /contests/remove-questions-from-contest/{contestId}
       *
       * The exact request body has not yet been
       * provided, so we do not guess it here.
       *
       * Replace this section with the API helper
       * once the backend request body is confirmed.
       */

      console.warn(
        "Remove question endpoint is available, but its request body has not been provided yet.",
        {
          competitionId,
          subjectId,
          questionId,
        },
      );

      /*
       * Temporary local removal is intentionally NOT
       * performed because doing so would make the UI
       * disagree with the backend.
       */

      alert(
        "The remove-question API endpoint is available, but its request body still needs to be confirmed before this button can safely delete from the backend.",
      );
    } catch (err) {
      console.error(
        "Failed to remove question:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove question.",
      );
    } finally {
      setIsDeleting(false);
      setDeleteQuestionId(null);
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Link>

          <Card className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Loading questions...
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Fetching the questions assigned to this subject.
              </p>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error && !contest) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Link>

          <Card className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Unable to load questions
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              {error}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={loadQuestions}
              >
                Try Again
              </Button>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
              >
                <Button>
                  Competition Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {contest?.title && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {contest.title}
                </span>
              )}

              {contest?.status && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {contest.status}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />

              <h1 className="text-3xl font-bold text-slate-900">
                {subjectName} Questions
              </h1>
            </div>

            <p className="mt-3 max-w-3xl text-slate-600">
              Manage all questions assigned to{" "}
              <span className="font-semibold">
                {subjectName}
              </span>{" "}
              for this competition.
            </p>
          </div>

          <Link
            href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}`}
          >
            <Button
              variant="outline"
              leftIcon={
                <ArrowLeft className="h-4 w-4" />
              }
            >
              Subject Settings
            </Button>
          </Link>
        </div>

        {/* ======================================================
            ERROR BANNER
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-800">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <FileQuestion className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Questions
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {questions.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Easy
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {easyCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-yellow-100 p-3">
                <FileQuestion className="h-5 w-5 text-yellow-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Medium
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {mediumCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-100 p-3">
                <FileQuestion className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Hard
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {hardCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-purple-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Marks
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {totalMarks}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ======================================================
            TOOLBAR
        ====================================================== */}

        <Card className="mb-6 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Input
                placeholder="Search questions or answer options..."
                leftIcon={
                  <Search className="h-4 w-4" />
                }
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                leftIcon={
                  <Filter className="h-4 w-4" />
                }
                onClick={() =>
                  setShowFilters(
                    (current) => !current,
                  )
                }
              >
                Filters
              </Button>

              <Link
                href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions/add`}
              >
                <Button
                  leftIcon={
                    <Plus className="h-4 w-4" />
                  }
                >
                  Add Question
                </Button>
              </Link>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Difficulty
                </label>

                <div className="relative">
                  <select
                    value={difficultyFilter}
                    onChange={(event) =>
                      setDifficultyFilter(
                        event.target.value as
                          | "All"
                          | Difficulty,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="All">
                      All Difficulties
                    </option>

                    <option value="Easy">
                      Easy
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Hard">
                      Hard
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Question Type
                </label>

                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(
                        event.target.value as
                          | "All"
                          | QuestionType,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="All">
                      All Question Types
                    </option>

                    <option value="Multiple Choice">
                      Multiple Choice
                    </option>

                    <option value="True / False">
                      True / False
                    </option>

                    <option value="Multiple Answer">
                      Multiple Answer
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ======================================================
            QUESTION COUNT
        ====================================================== */}

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Question Bank
            </h2>

            <p className="text-sm text-slate-500">
              Showing{" "}
              {filteredQuestions.length}{" "}
              of {questions.length} questions
            </p>
          </div>

          {(searchTerm ||
            difficultyFilter !== "All" ||
            typeFilter !== "All") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setDifficultyFilter("All");
                setTypeFilter("All");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* ======================================================
            QUESTIONS
        ====================================================== */}

        {filteredQuestions.length === 0 ? (
          <Card className="p-12 text-center">
            <FileQuestion className="mx-auto h-12 w-12 text-slate-300" />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              {questions.length === 0
                ? `No ${subjectName} questions yet`
                : "No questions found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              {questions.length === 0
                ? `No questions have been added to ${subjectName} for this competition yet.`
                : "No questions match your current search or filters."}
            </p>

            {questions.length === 0 ? (
              <div className="mt-6">
                <Link
                  href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions/add`}
                >
                  <Button
                    leftIcon={
                      <Plus className="h-4 w-4" />
                    }
                  >
                    Add Question
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setDifficultyFilter("All");
                    setTypeFilter("All");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map(
              (question) => (
                <Card
                  key={question.id}
                  hoverable
                  className="overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-5 lg:flex-row">
                      {/* Number */}

                      <div className="flex items-start gap-3">
                        <div className="hidden cursor-grab pt-2 text-slate-300 lg:block">
                          <GripVertical className="h-5 w-5" />
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {question.number}
                        </div>
                      </div>

                      {/* Question */}

                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClasses(
                              question.difficulty,
                            )}`}
                          >
                            {question.difficulty}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${questionTypeClasses(
                              question.type,
                            )}`}
                          >
                            {question.type}
                          </span>

                          {question.marks > 0 && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {question.marks}{" "}
                              {question.marks ===
                              1
                                ? "mark"
                                : "marks"}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold leading-7 text-slate-900">
                          {question.question}
                        </h3>

                        {/* Options */}

                        {question.options.length >
                          0 && (
                          <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {question.options.map(
                              (
                                option,
                                index,
                              ) => {
                                const isCorrect =
                                  Array.isArray(
                                    question.correctAnswer,
                                  )
                                    ? question.correctAnswer.includes(
                                        option,
                                      )
                                    : question.correctAnswer ===
                                      option;

                                return (
                                  <div
                                    key={`${question.id}-${index}`}
                                    className={`rounded-lg border p-3 text-sm ${
                                      isCorrect
                                        ? "border-green-300 bg-green-50"
                                        : "border-slate-200 bg-slate-50"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600 shadow-sm">
                                        {String.fromCharCode(
                                          65 +
                                            index,
                                        )}
                                      </span>

                                      <span className="flex-1 pt-1">
                                        {
                                          option
                                        }
                                      </span>

                                      {isCorrect && (
                                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                                      )}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        )}

                        {/* Explanation */}

                        {question.explanation && (
                          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                              Explanation
                            </p>

                            <p className="mt-1 text-sm leading-6 text-blue-900">
                              {
                                question.explanation
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}

                      <div className="flex shrink-0 gap-2 lg:flex-col">
                        <Button
                          variant="outline"
                          title="Preview question"
                          onClick={() => {
                            setSelectedQuestion(
                              question,
                            );
                            setShowPreview(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />

                          <span className="ml-2 lg:hidden">
                            Preview
                          </span>
                        </Button>

                        <Link
                          href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions/${question.id}`}
                        >
                          <Button
                            variant="outline"
                            title="Edit question"
                          >
                            <Edit3 className="h-4 w-4" />

                            <span className="ml-2 lg:hidden">
                              Edit
                            </span>
                          </Button>
                        </Link>

                        <Button
                          variant="destructive"
                          title="Remove question"
                          onClick={() =>
                            setDeleteQuestionId(
                              question.id,
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />

                          <span className="ml-2 lg:hidden">
                            Remove
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ),
            )}
          </div>
        )}

        {/* ======================================================
            PREVIEW MODAL
        ====================================================== */}

        {showPreview &&
          selectedQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
              <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Question{" "}
                      {
                        selectedQuestion.number
                      }
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Question Preview
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPreview(false);
                      setSelectedQuestion(
                        null,
                      );
                    }}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClasses(
                        selectedQuestion.difficulty,
                      )}`}
                    >
                      {
                        selectedQuestion.difficulty
                      }
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${questionTypeClasses(
                        selectedQuestion.type,
                      )}`}
                    >
                      {selectedQuestion.type}
                    </span>

                    {selectedQuestion.marks >
                      0 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {
                          selectedQuestion.marks
                        }{" "}
                        marks
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold leading-8 text-slate-900">
                    {
                      selectedQuestion.question
                    }
                  </h3>

                  {selectedQuestion.options
                    .length > 0 && (
                    <div className="mt-6 space-y-3">
                      {selectedQuestion.options.map(
                        (
                          option,
                          index,
                        ) => {
                          const isCorrect =
                            Array.isArray(
                              selectedQuestion.correctAnswer,
                            )
                              ? selectedQuestion.correctAnswer.includes(
                                  option,
                                )
                              : selectedQuestion.correctAnswer ===
                                option;

                          return (
                            <div
                              key={`${selectedQuestion.id}-${index}`}
                              className={`rounded-xl border p-4 ${
                                isCorrect
                                  ? "border-green-300 bg-green-50"
                                  : "border-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                                  {String.fromCharCode(
                                    65 +
                                      index,
                                  )}
                                </span>

                                <span className="flex-1">
                                  {
                                    option
                                  }
                                </span>

                                {isCorrect && (
                                  <span className="flex items-center gap-1 text-sm font-semibold text-green-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Correct
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}

                  {selectedQuestion.explanation && (
                    <div className="mt-6 rounded-xl bg-blue-50 p-5">
                      <p className="font-semibold text-blue-800">
                        Explanation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-blue-900">
                        {
                          selectedQuestion.explanation
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPreview(false);
                      setSelectedQuestion(
                        null,
                      );
                    }}
                  >
                    Close
                  </Button>

                  <Link
                    href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}/questions/${selectedQuestion.id}`}
                  >
                    <Button
                      leftIcon={
                        <Edit3 className="h-4 w-4" />
                      }
                    >
                      Edit Question
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

        {/* ======================================================
            DELETE CONFIRMATION
        ====================================================== */}

        {deleteQuestionId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Remove Question?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                This will remove the question from{" "}
                <span className="font-semibold">
                  {subjectName}
                </span>{" "}
                in this competition.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() =>
                    setDeleteQuestionId(null)
                  }
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() =>
                    handleDelete(
                      deleteQuestionId,
                    )
                  }
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Question
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
