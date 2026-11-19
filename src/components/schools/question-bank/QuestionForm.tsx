



"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Loader2,
  Save,
  X,
} from "lucide-react";

import QuestionOptionsEditor from "./QuestionOptionsEditor";

import type {
  CreateSchoolQuestionPayload,
  QuestionDifficulty,
  QuestionExamType,
  QuestionOption,
  QuestionStatus,
  QuestionType,
  QuestionVisibility,
  SchoolQuestion,
} from "@/types/schools/question-bank.types";

interface QuestionFormProps {
  initialData?: SchoolQuestion | null;
  submitting: boolean;
  subjects: Array<{
    _id: string;
    subjectName: string;
    subjectCode?: string;
  }>;
  classes?: Array<{
    _id: string;
    className: string;
    classCode?: string;
  }>;
  onSubmit: (payload: CreateSchoolQuestionPayload) => Promise<void>;
  onCancel: () => void;
}

interface QuestionFormState {
  questionText: string;
  questionType: QuestionType;
  subjectId: string;
  classId: string;
  difficulty: QuestionDifficulty;
  examType: QuestionExamType | "";
  options: QuestionOption[];
  correctAnswers: string[];
  acceptedAnswers: string[];
  explanation: string;
  marks: number;
  status: QuestionStatus;
  visibility: QuestionVisibility;
}

const DEFAULT_OPTIONS: QuestionOption[] = [
  {
    id: "option-a",
    label: "A",
    text: "",
    isCorrect: false,
  },
  {
    id: "option-b",
    label: "B",
    text: "",
    isCorrect: false,
  },
  {
    id: "option-c",
    label: "C",
    text: "",
    isCorrect: false,
  },
  {
    id: "option-d",
    label: "D",
    text: "",
    isCorrect: false,
  },
];

const DEFAULT_FORM: QuestionFormState = {
  questionText: "",
  questionType: "MULTIPLE_CHOICE",
  subjectId: "",
  classId: "",
  difficulty: "MEDIUM",
  examType: "",
  options: DEFAULT_OPTIONS,
  correctAnswers: [],
  acceptedAnswers: [],
  explanation: "",
  marks: 1,
  status: "DRAFT",
  visibility: "SCHOOL",
};

const DIFFICULTIES: QuestionDifficulty[] = [
  "EASY",
  "MEDIUM",
  "HARD",
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

function getInitialForm(
  question?: SchoolQuestion | null
): QuestionFormState {
  if (!question) {
    return {
      ...DEFAULT_FORM,
      options: DEFAULT_OPTIONS.map((option) => ({ ...option })),
    };
  }

  const subjectId =
    typeof question.subjectId === "string"
      ? question.subjectId
      : question.subjectId?._id ?? "";

  const classId =
    typeof question.classId === "string"
      ? question.classId
      : question.classId?._id ?? "";

  return {
    questionText: question.questionText ?? "",
    questionType: question.questionType ?? "MULTIPLE_CHOICE",
    subjectId,
    classId,
    difficulty: question.difficulty ?? "MEDIUM",
    examType: question.examType ?? "",
    options: (question.options ?? []).map((option) => ({
      ...option,
    })),
    correctAnswers: [...(question.correctAnswers ?? [])],
    acceptedAnswers: [...(question.acceptedAnswers ?? [])],
    explanation: question.explanation ?? "",
    marks: question.marks ?? 1,
    status: question.status ?? "DRAFT",
    visibility: question.visibility ?? "SCHOOL",
  };
}

export default function QuestionForm({
  initialData,
  submitting,
  subjects,
  classes = [],
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const [form, setForm] = useState<QuestionFormState>(() =>
    getInitialForm(initialData)
  );

  const [error, setError] = useState<string | null>(null);
  const [acceptedAnswersInput, setAcceptedAnswersInput] =
    useState("");

  const isEditing = Boolean(initialData);

  useEffect(() => {
    setForm(getInitialForm(initialData));
    setAcceptedAnswersInput(
      (initialData?.acceptedAnswers ?? []).join(", ")
    );
    setError(null);
  }, [initialData]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject._id === form.subjectId),
    [subjects, form.subjectId]
  );

  const updateField = <K extends keyof QuestionFormState>(
    field: K,
    value: QuestionFormState[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleQuestionTypeChange = (questionType: QuestionType) => {
    setForm((previous) => {
      if (questionType === "MULTIPLE_CHOICE") {
        return {
          ...previous,
          questionType,
          options:
            previous.options.length >= 2
              ? previous.options
              : DEFAULT_OPTIONS.map((option) => ({ ...option })),
          correctAnswers: [],
          acceptedAnswers: [],
        };
      }

      if (questionType === "TRUE_FALSE") {
        const trueFalseOptions: QuestionOption[] = [
          {
            id: "TRUE",
            label: "A",
            text: "True",
            isCorrect: previous.correctAnswers.includes("TRUE"),
          },
          {
            id: "FALSE",
            label: "B",
            text: "False",
            isCorrect: previous.correctAnswers.includes("FALSE"),
          },
        ];

        return {
          ...previous,
          questionType,
          options: trueFalseOptions,
          correctAnswers:
            previous.correctAnswers.filter(
              (answer) => answer === "TRUE" || answer === "FALSE"
            ),
          acceptedAnswers: [],
        };
      }

      return {
        ...previous,
        questionType,
        options: [],
        correctAnswers: [],
        acceptedAnswers: previous.acceptedAnswers,
      };
    });
  };

  const handleTrueFalseChange = (answer: "TRUE" | "FALSE") => {
    setForm((previous) => ({
      ...previous,
      correctAnswers: [answer],
      options: [
        {
          id: "TRUE",
          label: "A",
          text: "True",
          isCorrect: answer === "TRUE",
        },
        {
          id: "FALSE",
          label: "B",
          text: "False",
          isCorrect: answer === "FALSE",
        },
      ],
    }));
  };

  const validateForm = (): string | null => {
    if (!form.questionText.trim()) {
      return "Enter the question text.";
    }

    if (!form.subjectId) {
      return "Select a subject.";
    }

    if (!form.difficulty) {
      return "Select the question difficulty.";
    }

    if (!Number.isFinite(form.marks) || form.marks <= 0) {
      return "Marks must be greater than zero.";
    }

    if (form.questionType === "MULTIPLE_CHOICE") {
      if (form.options.length < 2) {
        return "A multiple-choice question must have at least two options.";
      }

      if (form.options.some((option) => !option.text.trim())) {
        return "Complete all option fields or remove empty options.";
      }

      if (form.correctAnswers.length === 0) {
        return "Select at least one correct answer.";
      }

      const optionIds = new Set(form.options.map((option) => option.id));

      if (
        form.correctAnswers.some(
          (answer) => !optionIds.has(answer)
        )
      ) {
        return "One or more selected answers are invalid.";
      }
    }

    if (form.questionType === "TRUE_FALSE") {
      if (
        form.correctAnswers.length !== 1 ||
        !["TRUE", "FALSE"].includes(form.correctAnswers[0])
      ) {
        return "Select whether the correct answer is True or False.";
      }
    }

    if (form.questionType === "SHORT_ANSWER") {
      const answers = acceptedAnswersInput
        .split(",")
        .map((answer) => answer.trim())
        .filter(Boolean);

      if (answers.length === 0) {
        return "Enter at least one accepted answer.";
      }
    }

    return null;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const acceptedAnswers =
      form.questionType === "SHORT_ANSWER"
        ? acceptedAnswersInput
            .split(",")
            .map((answer) => answer.trim())
            .filter(Boolean)
        : form.acceptedAnswers;

    const options =
      form.questionType === "MULTIPLE_CHOICE"
        ? form.options.map((option) => ({
            ...option,
            isCorrect: form.correctAnswers.includes(option.id),
          }))
        : form.questionType === "TRUE_FALSE"
          ? form.options.map((option) => ({
              ...option,
              isCorrect: form.correctAnswers.includes(option.id),
            }))
          : [];

    const payload: CreateSchoolQuestionPayload = {
      questionText: form.questionText.trim(),
      questionType: form.questionType,
      subjectId: form.subjectId,
      ...(form.classId ? { classId: form.classId } : {}),
      difficulty: form.difficulty,
      ...(form.examType ? { examType: form.examType } : {}),
      options,
      correctAnswers: form.correctAnswers,
      ...(acceptedAnswers.length > 0 ? { acceptedAnswers } : {}),
      ...(form.explanation.trim()
        ? { explanation: form.explanation.trim() }
        : {}),
      marks: form.marks,
      status: form.status,
      visibility: form.visibility,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the question. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Question details */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">
            Question Details
          </h2>
        </div>

        <div>
          <label
            htmlFor="questionText"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Question text <span className="text-red-500">*</span>
          </label>

          <textarea
            id="questionText"
            rows={5}
            value={form.questionText}
            onChange={(event) =>
              updateField("questionText", event.target.value)
            }
            placeholder="Enter your question here..."
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="questionType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Question type
            </label>

            <select
              id="questionType"
              value={form.questionType}
              onChange={(event) =>
                handleQuestionTypeChange(
                  event.target.value as QuestionType
                )
              }
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="MULTIPLE_CHOICE">
                Multiple Choice
              </option>
              <option value="TRUE_FALSE">True or False</option>
              <option value="SHORT_ANSWER">Short Answer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="subjectId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Subject <span className="text-red-500">*</span>
            </label>

            <select
              id="subjectId"
              value={form.subjectId}
              onChange={(event) =>
                updateField("subjectId", event.target.value)
              }
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                  {subject.subjectCode
                    ? ` (${subject.subjectCode})`
                    : ""}
                </option>
              ))}
            </select>

            {subjects.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                No subjects available. Add a school subject first.
              </p>
            )}
          </div>

          {classes.length > 0 && (
            <div>
              <label
                htmlFor="classId"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Class
              </label>

              <select
                id="classId"
                value={form.classId}
                onChange={(event) =>
                  updateField("classId", event.target.value)
                }
                disabled={submitting}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              >
                <option value="">All classes / Not specified</option>
                {classes.map((schoolClass) => (
                  <option
                    key={schoolClass._id}
                    value={schoolClass._id}
                  >
                    {schoolClass.className}
                    {schoolClass.classCode
                      ? ` (${schoolClass.classCode})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="difficulty"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Difficulty
            </label>

            <select
              id="difficulty"
              value={form.difficulty}
              onChange={(event) =>
                updateField(
                  "difficulty",
                  event.target.value as QuestionDifficulty
                )
              }
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0) +
                    difficulty.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="examType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Examination type
            </label>

            <select
              id="examType"
              value={form.examType}
              onChange={(event) =>
                updateField(
                  "examType",
                  event.target.value as QuestionExamType | ""
                )
              }
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">Not specified</option>
              {EXAM_TYPES.map((examType) => (
                <option key={examType} value={examType}>
                  {examType.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSubject && (
          <p className="text-xs text-gray-500">
            Selected subject: {selectedSubject.subjectName}
          </p>
        )}
      </section>

      {/* Answer options */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div>
          <h2 className="font-semibold text-gray-900">
            Answer and Correct Response
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {form.questionType === "MULTIPLE_CHOICE"
              ? "Add answer options and select the correct answer."
              : form.questionType === "TRUE_FALSE"
                ? "Choose the correct response."
                : "Enter the accepted answer(s), separated by commas."}
          </p>
        </div>

        {form.questionType === "MULTIPLE_CHOICE" && (
          <QuestionOptionsEditor
            options={form.options}
            correctAnswers={form.correctAnswers}
            multipleAnswers={true}
            disabled={submitting}
            onOptionsChange={(options) =>
              updateField("options", options)
            }
            onCorrectAnswersChange={(correctAnswers) =>
              updateField("correctAnswers", correctAnswers)
            }
          />
        )}

        {form.questionType === "TRUE_FALSE" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["TRUE", "FALSE"] as const).map((answer) => {
              const selected = form.correctAnswers.includes(answer);

              return (
                <button
                  key={answer}
                  type="button"
                  disabled={submitting}
                  onClick={() => handleTrueFalseChange(answer)}
                  className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${
                    selected
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="font-medium">
                    {answer === "TRUE" ? "True" : "False"}
                  </span>

                  {selected && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {form.questionType === "SHORT_ANSWER" && (
          <div>
            <label
              htmlFor="acceptedAnswers"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Accepted answers
            </label>

            <input
              id="acceptedAnswers"
              type="text"
              value={acceptedAnswersInput}
              onChange={(event) =>
                setAcceptedAnswersInput(event.target.value)
              }
              disabled={submitting}
              placeholder="e.g. Abuja, FCT, Federal Capital Territory"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Separate alternative correct answers with commas.
            </p>
          </div>
        )}
      </section>

      {/* Explanation and settings */}
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-gray-900">
          Explanation and Settings
        </h2>

        <div>
          <label
            htmlFor="explanation"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Explanation (optional)
          </label>

          <textarea
            id="explanation"
            rows={3}
            value={form.explanation}
            onChange={(event) =>
              updateField("explanation", event.target.value)
            }
            disabled={submitting}
            placeholder="Explain why the selected answer is correct..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="marks"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Marks
            </label>

            <input
              id="marks"
              type="number"
              min="1"
              step="1"
              value={form.marks}
              onChange={(event) =>
                updateField(
                  "marks",
                  Math.max(1, Number(event.target.value) || 1)
                )
              }
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as QuestionStatus
                )
              }
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="visibility"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Visibility
            </label>

            <select
              id="visibility"
              value={form.visibility}
              onChange={(event) =>
                updateField(
                  "visibility",
                  event.target.value as QuestionVisibility
                )
              }
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="PRIVATE">Private</option>
              <option value="SCHOOL">School</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || subjects.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditing ? "Update Question" : "Save Question"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
