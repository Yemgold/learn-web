


"use client";

import { useMemo } from "react";
import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  QuestionBankFilters as QuestionBankFiltersType,
  QuestionDifficulty,
  QuestionExamType,
  QuestionStatus,
  QuestionType,
} from "@/types/schools/question-bank.types";

interface QuestionBankFiltersProps {
  filters: QuestionBankFiltersType;
  onChange: (filters: QuestionBankFiltersType) => void;

  subjects: Array<{
    _id: string;
    subjectName: string;
  }>;

  classes?: Array<{
    _id: string;
    className: string;
  }>;

  categories?: Array<{
    _id: string;
    categoryName: string;
  }>;

  topics?: Array<{
    _id: string;
    topicName: string;
  }>;

  loading?: boolean;
}

const DIFFICULTIES: QuestionDifficulty[] = [
  "EASY",
  "MEDIUM",
  "HARD",
];

const QUESTION_TYPES: QuestionType[] = [
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_ANSWER",
];

const STATUSES: QuestionStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

const EXAM_TYPES: QuestionExamType[] = [
  "INTERNAL",
  "EXTERNAL",
  "WAEC",
  "NECO",
  "JAMB",
  "POST_UTME",
  "OTHER",
];

export default function QuestionBankFilters({
  filters,
  onChange,
  subjects,
  classes = [],
  categories = [],
  topics = [],
  loading = false,
}: QuestionBankFiltersProps) {
  const activeFilterCount = useMemo(() => {
    return [
      filters.subjectId,
      filters.classId,
      filters.categoryId,
      filters.topicId,
      filters.difficulty && filters.difficulty !== "ALL"
        ? filters.difficulty
        : "",
      filters.questionType && filters.questionType !== "ALL"
        ? filters.questionType
        : "",
      filters.status && filters.status !== "ALL"
        ? filters.status
        : "",
      filters.examType && filters.examType !== "ALL"
        ? filters.examType
        : "",
    ].filter(Boolean).length;
  }, [filters]);

  const updateFilter = <K extends keyof QuestionBankFiltersType>(
    key: K,
    value: QuestionBankFiltersType[K]
  ) => {
    onChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  const resetFilters = () => {
    onChange({
      search: "",
      subjectId: "",
      classId: "",
      categoryId: "",
      topicId: "",
      difficulty: "ALL",
      questionType: "ALL",
      status: "ALL",
      examType: "ALL",
      page: 1,
      limit: filters.limit ?? 10,
    });
  };

  const hasActiveFilters =
    Boolean(filters.search?.trim()) || activeFilterCount > 0;

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      {/* Search and reset */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            placeholder="Search questions..."
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50"
          />

          {filters.search && (
            <button
              type="button"
              onClick={() => updateFilter("search", "")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters || loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </button>
      </div>

      {/* Filter heading */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />

          <h3 className="text-sm font-semibold text-gray-800">
            Filters
          </h3>

          {activeFilterCount > 0 && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              {activeFilterCount}
            </span>
          )}
        </div>

        <span className="text-xs text-gray-400">
          Refine your question list
        </span>
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Subject */}
        <div>
          <label
            htmlFor="question-filter-subject"
            className="mb-1.5 block text-xs font-medium text-gray-600"
          >
            Subject
          </label>

          <select
            id="question-filter-subject"
            value={filters.subjectId ?? ""}
            onChange={(event) =>
              updateFilter("subjectId", event.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="">All subjects</option>

            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </div>

        {/* Class */}
        {classes.length > 0 && (
          <div>
            <label
              htmlFor="question-filter-class"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Class
            </label>

            <select
              id="question-filter-class"
              value={filters.classId ?? ""}
              onChange={(event) =>
                updateFilter("classId", event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
            >
              <option value="">All classes</option>

              {classes.map((schoolClass) => (
                <option key={schoolClass._id} value={schoolClass._id}>
                  {schoolClass.className}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category */}
        {categories.length > 0 && (
          <div>
            <label
              htmlFor="question-filter-category"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Category
            </label>

            <select
              id="question-filter-category"
              value={filters.categoryId ?? ""}
              onChange={(event) =>
                updateFilter("categoryId", event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Topic */}
        {topics.length > 0 && (
          <div>
            <label
              htmlFor="question-filter-topic"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Topic
            </label>

            <select
              id="question-filter-topic"
              value={filters.topicId ?? ""}
              onChange={(event) =>
                updateFilter("topicId", event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
            >
              <option value="">All topics</option>

              {topics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.topicName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label
            htmlFor="question-filter-difficulty"
            className="mb-1.5 block text-xs font-medium text-gray-600"
          >
            Difficulty
          </label>

          <select
            id="question-filter-difficulty"
            value={filters.difficulty ?? "ALL"}
            onChange={(event) =>
              updateFilter(
                "difficulty",
                event.target.value as QuestionDifficulty | "ALL"
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="ALL">All difficulties</option>

            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0) +
                  difficulty.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Question type */}
        <div>
          <label
            htmlFor="question-filter-type"
            className="mb-1.5 block text-xs font-medium text-gray-600"
          >
            Question type
          </label>

          <select
            id="question-filter-type"
            value={filters.questionType ?? "ALL"}
            onChange={(event) =>
              updateFilter(
                "questionType",
                event.target.value as QuestionType | "ALL"
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="ALL">All types</option>

            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="question-filter-status"
            className="mb-1.5 block text-xs font-medium text-gray-600"
          >
            Status
          </label>

          <select
            id="question-filter-status"
            value={filters.status ?? "ALL"}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value as QuestionStatus | "ALL"
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="ALL">All statuses</option>

            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) +
                  status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Exam type */}
        <div>
          <label
            htmlFor="question-filter-exam"
            className="mb-1.5 block text-xs font-medium text-gray-600"
          >
            Examination
          </label>

          <select
            id="question-filter-exam"
            value={filters.examType ?? "ALL"}
            onChange={(event) =>
              updateFilter(
                "examType",
                event.target.value as QuestionExamType | "ALL"
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="ALL">All examinations</option>

            {EXAM_TYPES.map((examType) => (
              <option key={examType} value={examType}>
                {examType.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          <Filter className="h-3.5 w-3.5 text-gray-400" />

          <span className="text-xs text-gray-500">
            Active filters:
          </span>

          {filters.search?.trim() && (
            <button
              type="button"
              onClick={() => updateFilter("search", "")}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Search: {filters.search}
              <X className="ml-1 inline h-3 w-3" />
            </button>
          )}

          {filters.subjectId && (
            <button
              type="button"
              onClick={() => updateFilter("subjectId", "")}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Subject:{" "}
              {subjects.find((item) => item._id === filters.subjectId)
                ?.subjectName ?? "Selected"}
              <X className="ml-1 inline h-3 w-3" />
            </button>
          )}

          {filters.classId && (
            <button
              type="button"
              onClick={() => updateFilter("classId", "")}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Class:{" "}
              {classes.find((item) => item._id === filters.classId)
                ?.className ?? "Selected"}
              <X className="ml-1 inline h-3 w-3" />
            </button>
          )}

          {filters.categoryId && (
            <button
              type="button"
              onClick={() => updateFilter("categoryId", "")}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Category:{" "}
              {categories.find(
                (item) => item._id === filters.categoryId
              )?.categoryName ?? "Selected"}
              <X className="ml-1 inline h-3 w-3" />
            </button>
          )}

          {filters.topicId && (
            <button
              type="button"
              onClick={() => updateFilter("topicId", "")}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Topic:{" "}
              {topics.find((item) => item._id === filters.topicId)
                ?.topicName ?? "Selected"}
              <X className="ml-1 inline h-3 w-3" />
            </button>
          )}

          {filters.difficulty &&
            filters.difficulty !== "ALL" && (
              <button
                type="button"
                onClick={() => updateFilter("difficulty", "ALL")}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
              >
                {filters.difficulty}
                <X className="ml-1 inline h-3 w-3" />
              </button>
            )}

          {filters.questionType &&
            filters.questionType !== "ALL" && (
              <button
                type="button"
                onClick={() => updateFilter("questionType", "ALL")}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
              >
                {filters.questionType.replace(/_/g, " ")}
                <X className="ml-1 inline h-3 w-3" />
              </button>
            )}

          {filters.status && filters.status !== "ALL" && (
            <button
              type="button"
              onClick={() => updateFilter("status", "ALL")}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              {filters.status}
              <X className="ml-1 inline h-3 w-3" />
            </button>
          )}

          {filters.examType && filters.examType !== "ALL" && (
            <button
              type="button"
              onClick={() => updateFilter("examType", "ALL")}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              {filters.examType.replace(/_/g, " ")}
              <X className="ml-1 inline h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
