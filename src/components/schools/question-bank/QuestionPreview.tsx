



"use client";

import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Eye,
  GraduationCap,
  Lightbulb,
  X,
} from "lucide-react";

import QuestionStatusBadge from "./QuestionStatusBadge";

import type {
  QuestionDifficulty,
  QuestionType,
  SchoolQuestion,
} from "@/types/schools/question-bank.types";

interface QuestionPreviewProps {
  question: SchoolQuestion;
  onClose?: () => void;
  showAnswers?: boolean;
}

const DIFFICULTY_STYLES: Record<
  QuestionDifficulty,
  string
> = {
  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
};

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  TRUE_FALSE: "True or False",
  SHORT_ANSWER: "Short Answer",
};

function getSubjectName(question: SchoolQuestion): string {
  if (typeof question.subjectId === "object") {
    return question.subjectId?.subjectName ?? "Unknown subject";
  }

  return "Subject";
}

function getClassName(question: SchoolQuestion): string {
  if (typeof question.classId === "object") {
    return question.classId?.className ?? "Unknown class";
  }

  return "All classes";
}

function getCategoryName(question: SchoolQuestion): string {
  if (typeof question.categoryId === "object") {
    return question.categoryId?.categoryName ?? "Uncategorised";
  }

  return "Uncategorised";
}

function getTopicName(question: SchoolQuestion): string {
  if (typeof question.topicId === "object") {
    return question.topicId?.topicName ?? "No topic";
  }

  return "No topic";
}

export default function QuestionPreview({
  question,
  onClose,
  showAnswers = true,
}: QuestionPreviewProps) {
  const correctAnswers = question.correctAnswers ?? [];

  const isCorrectOption = (optionId: string) => {
    return (
      correctAnswers.includes(optionId) ||
      Boolean(
        question.options?.find(
          (option) =>
            option.id === optionId &&
            option.isCorrect
        )
      )
    );
  };

  const correctAnswerLabels =
    question.options
      ?.filter((option) => isCorrectOption(option.id))
      .map((option) => option.label) ?? [];

  const correctAnswerTexts =
    question.options
      ?.filter((option) => isCorrectOption(option.id))
      .map((option) => option.text) ?? [];

  const formattedAnswers =
    question.questionType === "TRUE_FALSE"
      ? correctAnswers.map((answer) =>
          answer === "TRUE" ? "True" : answer === "FALSE" ? "False" : answer
        )
      : question.questionType === "MULTIPLE_CHOICE"
        ? correctAnswerTexts
        : question.acceptedAnswers ?? correctAnswers;

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Question Preview
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Review the question and its answer details.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Question metadata */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            DIFFICULTY_STYLES[question.difficulty]
          }`}
        >
          {question.difficulty.charAt(0) +
            question.difficulty.slice(1).toLowerCase()}
        </span>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {QUESTION_TYPE_LABELS[question.questionType]}
        </span>

        <QuestionStatusBadge status={question.status} />

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {question.marks} {question.marks === 1 ? "Mark" : "Marks"}
        </span>
      </div>

      {/* Question information */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Subject:</span>
          <span>{getSubjectName(question)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <GraduationCap className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Class:</span>
          <span>{getClassName(question)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <ClipboardList className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Category:</span>
          <span>{getCategoryName(question)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Topic:</span>
          <span>{getTopicName(question)}</span>
        </div>
      </div>

      {/* Main question */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Question
          </span>

          {question.examType && (
            <span className="rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
              {question.examType.replace("_", " ")}
            </span>
          )}
        </div>

        <p className="whitespace-pre-wrap text-base font-medium leading-7 text-gray-900">
          {question.questionText}
        </p>
      </div>

      {/* Multiple-choice options */}
      {question.questionType === "MULTIPLE_CHOICE" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Answer Options
          </h3>

          {question.options?.length ? (
            <div className="space-y-2">
              {question.options.map((option) => {
                const correct = isCorrectOption(option.id);

                return (
                  <div
                    key={option.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 ${
                      showAnswers && correct
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        showAnswers && correct
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                        {option.text}
                      </p>

                      {option.imageUrl && (
                        <img
                          src={option.imageUrl}
                          alt={`Option ${option.label}`}
                          className="mt-3 max-h-48 max-w-full rounded-lg border border-gray-200 object-contain"
                        />
                      )}
                    </div>

                    {showAnswers && correct && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
              No answer options have been added.
            </p>
          )}
        </div>
      )}

      {/* True or false */}
      {question.questionType === "TRUE_FALSE" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Answer Options
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["TRUE", "FALSE"] as const).map((answer) => {
              const correct = correctAnswers.includes(answer);

              return (
                <div
                  key={answer}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    showAnswers && correct
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="font-medium text-gray-800">
                    {answer === "TRUE" ? "True" : "False"}
                  </span>

                  {showAnswers && correct && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Short answer */}
      {question.questionType === "SHORT_ANSWER" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Expected Answer
          </h3>

          {showAnswers ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                Accepted answers
              </div>

              {formattedAnswers.length > 0 ? (
                <ul className="list-inside list-disc space-y-1 text-sm text-green-900">
                  {formattedAnswers.map((answer, index) => (
                    <li key={`${answer}-${index}`}>{answer}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-800">
                  No accepted answers specified.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Students will enter their answer in a text field.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Correct answer summary */}
      {showAnswers && question.questionType === "MULTIPLE_CHOICE" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            Correct Answer{correctAnswerLabels.length === 1 ? "" : "s"}
          </div>

          {correctAnswerLabels.length > 0 ? (
            <p className="text-sm text-green-900">
              {correctAnswerLabels.join(", ")}
            </p>
          ) : (
            <p className="text-sm text-green-800">
              No correct answer has been selected.
            </p>
          )}
        </div>
      )}

      {/* Explanation */}
      {showAnswers && question.explanation && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-800">
            <Lightbulb className="h-5 w-5" />
            Explanation
          </div>

          <p className="whitespace-pre-wrap text-sm leading-6 text-blue-900">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <span>
          Visibility:{" "}
          <span className="font-medium text-gray-700">
            {question.visibility ?? "SCHOOL"}
          </span>
        </span>

        {question.createdAt && (
          <span>
            Created:{" "}
            {new Date(question.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
