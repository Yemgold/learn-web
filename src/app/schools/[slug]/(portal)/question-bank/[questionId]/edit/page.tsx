
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

import {
  getQuestion,
  updateQuestion,
  type Question,
  type QuestionType,
  type QuestionDifficulty,
  type QuestionOption,
  type QuestionAnswerKey,
  type CreateQuestionItem,
} from "@/lib/schools/portal/services/question-bank.service";

const QUESTION_TYPES: QuestionType[] = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_ANSWER",
  "ESSAY",
];

const DIFFICULTIES: QuestionDifficulty[] = [
  "EASY",
  "MEDIUM",
  "HARD",
];

const DEFAULT_OPTIONS: QuestionOption[] = [
  { key: "A", text: "" },
  { key: "B", text: "" },
  { key: "C", text: "" },
  { key: "D", text: "" },
];

interface QuestionForm {
  questionType: QuestionType;
  questionText: string;
  questionImages: string;
  options: QuestionOption[];
  correctOptionKey: string;
  correctOptionKeys: string;
  correctBoolean: boolean;
  acceptedAnswers: string;
  modelAnswer: string;
  markingGuide: string;
  difficulty: QuestionDifficulty;
  topic: string;
  explanation: string;
}

const initialForm: QuestionForm = {
  questionType: "SINGLE_CHOICE",
  questionText: "",
  questionImages: "",
  options: DEFAULT_OPTIONS,
  correctOptionKey: "A",
  correctOptionKeys: "A",
  correctBoolean: true,
  acceptedAnswers: "",
  modelAnswer: "",
  markingGuide: "",
  difficulty: "MEDIUM",
  topic: "",
  explanation: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapQuestion(response: unknown): Question | null {
  let current: unknown = response;

  // Handle Axios response and common backend response envelopes.
  for (let i = 0; i < 5; i++) {
    if (!isRecord(current)) return null;

    if (
      typeof current._id === "string" ||
      typeof current.questionText === "string"
    ) {
      return current as unknown as Question;
    }

    if (isRecord(current.data)) {
      current = current.data;
      continue;
    }

    if (isRecord(current.questionObj)) {
      current = current.questionObj;
      continue;
    }

    if (isRecord(current.question)) {
      current = current.question;
      continue;
    }

    return null;
  }

  return null;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatType(value: string): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Label({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default function EditQuestionPage() {
  const params = useParams<{
    slug: string;
    questionId: string;
  }>();

  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug;
  const questionId = params.questionId;

  const academicSessionId =
    searchParams.get("academicSessionId") || "";
  const classId = searchParams.get("classId") || "";
  const subjectId = searchParams.get("subjectId") || "";

  const user = useAuthStore((state) => state.user);
  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const [form, setForm] = useState<QuestionForm>(initialForm);
  const [question, setQuestion] = useState<Question | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateForm = useCallback(
    <K extends keyof QuestionForm>(
      field: K,
      value: QuestionForm[K]
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    []
  );

  // Load the existing question.
  useEffect(() => {
    let cancelled = false;

    async function loadQuestion() {
      if (
        !questionId ||
        !academicSessionId ||
        !classId ||
        !subjectId ||
        !schoolSubdomain
      ) {
        setError(
          "Missing question ID, academic session ID, class ID, subject ID, or school subdomain."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getQuestion(
          academicSessionId,
          classId,
          subjectId,
          questionId,
          schoolSubdomain
        );

        const loadedQuestion = unwrapQuestion(response);

        if (!loadedQuestion) {
          throw new Error(
            "The question response could not be understood. Check the get-question API response structure."
          );
        }

        if (cancelled) return;

        setQuestion(loadedQuestion);

        const answerKey = loadedQuestion.answerKey || {};
        const options = loadedQuestion.options || [];

        setForm({
          questionType:
            loadedQuestion.questionType || "SINGLE_CHOICE",

          questionText: toStringValue(
            loadedQuestion.questionText
          ),

          questionImages: (
            loadedQuestion.questionImages || []
          ).join("\n"),

          options:
            options.length > 0
              ? options.map((option) => ({
                  key: option.key,
                  text: option.text,
                  imageUrl: option.imageUrl,
                }))
              : DEFAULT_OPTIONS,

          correctOptionKey:
            answerKey.correctOptionKey || "A",

          correctOptionKeys: (
            answerKey.correctOptionKeys || []
          ).join(", "),

          correctBoolean:
            answerKey.correctBoolean ?? true,

          acceptedAnswers: (
            answerKey.acceptedAnswers || []
          ).join("\n"),

          modelAnswer:
            answerKey.modelAnswer || "",

          markingGuide:
            answerKey.markingGuide || "",

          difficulty:
            loadedQuestion.difficulty || "MEDIUM",

          topic: loadedQuestion.topic || "",

          explanation:
            loadedQuestion.explanation || "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this question."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadQuestion();

    return () => {
      cancelled = true;
    };
  }, [
    questionId,
    academicSessionId,
    classId,
    subjectId,
    schoolSubdomain,
  ]);

  const updateOption = (
    index: number,
    field: keyof QuestionOption,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, optionIndex) =>
        optionIndex === index
          ? { ...option, [field]: value }
          : option
      ),
    }));
  };

  const addOption = () => {
    if (form.options.length >= 8) return;

    const nextKey = String.fromCharCode(
      65 + form.options.length
    );

    setForm((previous) => ({
      ...previous,
      options: [
        ...previous.options,
        { key: nextKey, text: "" },
      ],
    }));
  };

  const removeOption = (index: number) => {
    if (form.options.length <= 2) return;

    setForm((previous) => {
      const remaining = previous.options.filter(
        (_, optionIndex) => optionIndex !== index
      );

      const normalized = remaining.map((option, optionIndex) => ({
        ...option,
        key: String.fromCharCode(65 + optionIndex),
      }));

      return {
        ...previous,
        options: normalized,
      };
    });
  };

  const buildPayload = (): CreateQuestionItem => {
    const answerKey: QuestionAnswerKey = {};

    let options: QuestionOption[] | undefined;

    if (
      form.questionType === "SINGLE_CHOICE" ||
      form.questionType === "MULTIPLE_CHOICE"
    ) {
      options = form.options.map((option) => ({
        key: option.key,
        text: option.text.trim(),
        ...(option.imageUrl?.trim()
          ? { imageUrl: option.imageUrl.trim() }
          : {}),
      }));

      if (form.questionType === "SINGLE_CHOICE") {
        answerKey.correctOptionKey =
          form.correctOptionKey;
      } else {
        answerKey.correctOptionKeys = splitLines(
          form.correctOptionKeys.replaceAll(",", "\n")
        );
      }
    }

    if (form.questionType === "TRUE_FALSE") {
      options = [
        { key: "A", text: "True" },
        { key: "B", text: "False" },
      ];

      answerKey.correctBoolean = form.correctBoolean;
    }

    if (form.questionType === "SHORT_ANSWER") {
      answerKey.acceptedAnswers = splitLines(
        form.acceptedAnswers
      );
    }

    if (form.questionType === "ESSAY") {
      answerKey.modelAnswer = form.modelAnswer.trim();
      answerKey.markingGuide = form.markingGuide.trim();
    }

    return {
      questionType: form.questionType,
      questionText: form.questionText.trim(),
      questionImages: splitLines(form.questionImages),
      options,
      answerKey,
      difficulty: form.difficulty,
      topic: form.topic.trim(),
      explanation: form.explanation.trim(),
    };
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!form.questionText.trim()) {
      setError("Please enter the question text.");
      return;
    }

    if (
      form.questionType === "SINGLE_CHOICE" ||
      form.questionType === "MULTIPLE_CHOICE"
    ) {
      if (
        form.options.length < 2 ||
        form.options.some((option) => !option.text.trim())
      ) {
        setError(
          "Please provide text for at least two answer options."
        );
        return;
      }

      if (form.questionType === "SINGLE_CHOICE") {
        if (
          !form.options.some(
            (option) => option.key === form.correctOptionKey
          )
        ) {
          setError("Select a valid correct option.");
          return;
        }
      }

      if (form.questionType === "MULTIPLE_CHOICE") {
        const selectedKeys = splitLines(
          form.correctOptionKeys.replaceAll(",", "\n")
        );

        if (
          selectedKeys.length === 0 ||
          selectedKeys.some(
            (key) =>
              !form.options.some((option) => option.key === key)
          )
        ) {
          setError(
            "Enter valid correct option keys, separated by commas."
          );
          return;
        }
      }
    }

    if (
      form.questionType === "SHORT_ANSWER" &&
      splitLines(form.acceptedAnswers).length === 0
    ) {
      setError("Enter at least one accepted answer.");
      return;
    }

    if (
      form.questionType === "ESSAY" &&
      !form.modelAnswer.trim()
    ) {
      setError("Please enter a model answer.");
      return;
    }

    try {
      setSaving(true);

      const payload = buildPayload();

      await updateQuestion(
        questionId,
        payload,
        schoolSubdomain
      );

      setSuccess("Question updated successfully.");

      // Refresh the displayed question from the server.
      const refreshedResponse = await getQuestion(
        academicSessionId,
        classId,
        subjectId,
        questionId,
        schoolSubdomain
      );

      const refreshedQuestion =
        unwrapQuestion(refreshedResponse);

      if (refreshedQuestion) {
        setQuestion(refreshedQuestion);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update this question."
      );
    } finally {
      setSaving(false);
    }
  };

  const backUrl =
    `/schools/${slug}/question-bank?academicSessionId=${encodeURIComponent(
      academicSessionId
    )}`;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">
            Loading question...
          </p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Link
          href={backUrl}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Question Bank
        </Link>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-800">
            Unable to load question
          </h2>
          <p className="mt-2 text-sm text-red-700">
            {error || "Question not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href={backUrl}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Question Bank
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            Edit Question
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the question, answer options and marking information.
          </p>
        </div>

        <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          Status: {formatType(question.status || "UNKNOWN")}
        </span>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Question content */}
      <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Question Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Edit the question and its classification.
          </p>
        </div>

        <div>
          <Label>Question Type</Label>
          <select
            value={form.questionType}
            onChange={(event) =>
              updateForm(
                "questionType",
                event.target.value as QuestionType
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatType(type)}
              </option>
            ))}
          </select>
        </div>

        <TextArea
          label="Question Text"
          value={form.questionText}
          onChange={(value) => updateForm("questionText", value)}
          placeholder="Enter the question..."
          rows={5}
        />

        <TextArea
          label="Question Images (one URL per line)"
          value={form.questionImages}
          onChange={(value) => updateForm("questionImages", value)}
          placeholder="https://example.com/question-image.png"
          rows={3}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Difficulty</Label>
            <select
              value={form.difficulty}
              onChange={(event) =>
                updateForm(
                  "difficulty",
                  event.target.value as QuestionDifficulty
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {formatType(difficulty)}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            label="Topic"
            value={form.topic}
            onChange={(value) => updateForm("topic", value)}
            placeholder="e.g. Algebra"
          />
        </div>
      </section>

      {/* Multiple choice options */}
      {(form.questionType === "SINGLE_CHOICE" ||
        form.questionType === "MULTIPLE_CHOICE") && (
        <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Answer Options
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add or edit the available answers.
            </p>
          </div>

          <div className="space-y-4">
            {form.options.map((option, index) => (
              <div
                key={`${option.key}-${index}`}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-700">
                    Option {option.key}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    disabled={form.options.length <= 2}
                    className="text-xs font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  <TextArea
                    label="Option Text"
                    value={option.text}
                    onChange={(value) =>
                      updateOption(index, "text", value)
                    }
                    placeholder={`Enter option ${option.key}`}
                    rows={2}
                  />

                  <TextInput
                    label="Option Image URL (optional)"
                    value={option.imageUrl || ""}
                    onChange={(value) =>
                      updateOption(index, "imageUrl", value)
                    }
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addOption}
            disabled={form.options.length >= 8}
            className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-40"
          >
            + Add Option
          </button>

          {form.questionType === "SINGLE_CHOICE" && (
            <div>
              <Label>Correct Answer</Label>
              <select
                value={form.correctOptionKey}
                onChange={(event) =>
                  updateForm("correctOptionKey", event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                {form.options.map((option) => (
                  <option key={option.key} value={option.key}>
                    Option {option.key}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.questionType === "MULTIPLE_CHOICE" && (
            <TextInput
              label="Correct Option Keys"
              value={form.correctOptionKeys}
              onChange={(value) =>
                updateForm("correctOptionKeys", value)
              }
              placeholder="e.g. A, C"
            />
          )}
        </section>
      )}

      {/* True / False */}
      {form.questionType === "TRUE_FALSE" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Correct Answer
          </h2>

          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="trueFalseAnswer"
                checked={form.correctBoolean}
                onChange={() => updateForm("correctBoolean", true)}
              />
              True
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="trueFalseAnswer"
                checked={!form.correctBoolean}
                onChange={() => updateForm("correctBoolean", false)}
              />
              False
            </label>
          </div>
        </section>
      )}

      {/* Short answer */}
      {form.questionType === "SHORT_ANSWER" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Accepted Answers
          </h2>

          <p className="mb-4 mt-1 text-sm text-gray-500">
            Enter each acceptable answer on a separate line.
          </p>

          <TextArea
            label="Accepted Answers"
            value={form.acceptedAnswers}
            onChange={(value) =>
              updateForm("acceptedAnswers", value)
            }
            placeholder={"Photosynthesis\nProcess of photosynthesis"}
            rows={5}
          />
        </section>
      )}

      {/* Essay */}
      {form.questionType === "ESSAY" && (
        <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Essay Marking Information
          </h2>

          <TextArea
            label="Model Answer"
            value={form.modelAnswer}
            onChange={(value) => updateForm("modelAnswer", value)}
            placeholder="Enter the expected answer..."
            rows={6}
          />

          <TextArea
            label="Marking Guide"
            value={form.markingGuide}
            onChange={(value) => updateForm("markingGuide", value)}
            placeholder="Explain how the answer should be marked..."
            rows={5}
          />
        </section>
      )}

      {/* Explanation */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <TextArea
          label="Explanation"
          value={form.explanation}
          onChange={(value) => updateForm("explanation", value)}
          placeholder="Explain why the answer is correct..."
          rows={5}
        />
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-5 sm:flex-row">
        <Link
          href={backUrl}
          className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
