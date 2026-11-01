




"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GraduationCap,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";

const STORAGE_KEY = "learnyfi-school-centres-questions";
const INSTITUTIONS_KEY = "learnyfi-school-centres-institutions";

type Difficulty = "Easy" | "Medium" | "Hard";
type QuestionStatus = "Published" | "Draft" | "Pending";

type QuestionOption = {
  label: string;
  value: string;
};

type SchoolQuestion = {
  id: string;
  question: string;
  subject: string;
  topic?: string;
  institution?: string;
  className?: string;
  difficulty: Difficulty;
  status: QuestionStatus;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation?: string;
  explanationSteps?: unknown[];
  content?: unknown[];
  createdAt?: string;
  examType?: string;
  [key: string]: unknown;
};

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Hard: "border-rose-500/20 bg-rose-500/10 text-rose-400",
};

const statusStyles: Record<QuestionStatus, string> = {
  Published: "bg-emerald-500/10 text-emerald-400",
  Draft: "bg-slate-500/10 text-slate-400",
  Pending: "bg-amber-500/10 text-amber-400",
};

function readQuestions(): SchoolQuestion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is SchoolQuestion =>
        item &&
        typeof item.id === "string" &&
        typeof item.question === "string"
    );
  } catch {
    return [];
  }
}

function readInstitutions(): string[] {
  try {
    const stored = localStorage.getItem(INSTITUTIONS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => item?.name)
      .filter((name): name is string => typeof name === "string");
  } catch {
    return [];
  }
}

function getQuestionText(question: SchoolQuestion) {
  if (question.question?.trim()) {
    return question.question;
  }

  if (Array.isArray(question.content)) {
    const parts: string[] = [];

    for (const block of question.content) {
      if (!block || typeof block !== "object") continue;

      const item = block as Record<string, unknown>;

      if (typeof item.text === "string") {
        parts.push(item.text);
      }

      if (Array.isArray(item.segments)) {
        for (const segment of item.segments) {
          if (
            segment &&
            typeof segment === "object" &&
            typeof (segment as Record<string, unknown>).text === "string"
          ) {
            parts.push(
              (segment as Record<string, unknown>).text as string
            );
          }
        }
      }
    }

    return parts.join("\n").trim();
  }

  return "Question text is unavailable.";
}

function normalizeDifficulty(value: unknown): Difficulty {
  const normalized = String(value || "").toLowerCase();

  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";

  return "Medium";
}

function normalizeStatus(value: unknown): QuestionStatus {
  const normalized = String(value || "").toLowerCase();

  if (normalized === "draft") return "Draft";
  if (normalized === "pending") return "Pending";

  return "Published";
}

function normalizeOptions(value: unknown): QuestionOption[] {
  if (!Array.isArray(value)) return [];

  return value.map((option, index) => {
    if (typeof option === "string") {
      return {
        label: String.fromCharCode(65 + index),
        value: option,
      };
    }

    const item = option as Record<string, unknown>;

    return {
      label:
        typeof item.label === "string"
          ? item.label
          : String.fromCharCode(65 + index),
      value:
        typeof item.value === "string"
          ? item.value
          : typeof item.text === "string"
            ? item.text
            : "",
    };
  });
}

function normalizeAnswers(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}

export default function SchoolQuestionDetailsPage() {
  const params = useParams<{ questionId: string }>();
  const router = useRouter();

  const questionId = decodeURIComponent(params.questionId);

  const [question, setQuestion] = useState<SchoolQuestion | null>(null);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    question: "",
    subject: "",
    topic: "",
    institution: "",
    className: "",
    difficulty: "Medium" as Difficulty,
    status: "Published" as QuestionStatus,
    options: [
      { label: "A", value: "" },
      { label: "B", value: "" },
      { label: "C", value: "" },
      { label: "D", value: "" },
    ] as QuestionOption[],
    correctAnswers: [] as string[],
    explanation: "",
  });

  const loadQuestion = useCallback(() => {
    setLoading(true);
    setErrorMessage("");

    const questions = readQuestions();
    const found = questions.find((item) => item.id === questionId);

    setInstitutions(readInstitutions());

    if (!found) {
      setQuestion(null);
      setLoading(false);
      setErrorMessage("This question could not be found.");
      return;
    }

    setQuestion(found);

    const options = normalizeOptions(found.options);

    setForm({
      question: getQuestionText(found),
      subject: found.subject || "",
      topic: found.topic || "",
      institution: found.institution || "General",
      className: found.className || "",
      difficulty: normalizeDifficulty(found.difficulty),
      status: normalizeStatus(found.status),
      options:
        options.length > 0
          ? options
          : [
              { label: "A", value: "" },
              { label: "B", value: "" },
              { label: "C", value: "" },
              { label: "D", value: "" },
            ],
      correctAnswers: normalizeAnswers(found.correctAnswers),
      explanation: found.explanation || "",
    });

    setLoading(false);
  }, [questionId]);

  useEffect(() => {
    loadQuestion();

    const handleStorage = () => loadQuestion();

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadQuestion]);

  const updateField = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateOption = (index: number, value: string) => {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, optionIndex) =>
        optionIndex === index
          ? { ...option, value }
          : option
      ),
    }));
  };

  const toggleCorrectAnswer = (label: string) => {
    setForm((previous) => ({
      ...previous,
      correctAnswers: previous.correctAnswers.includes(label)
        ? previous.correctAnswers.filter((answer) => answer !== label)
        : [...previous.correctAnswers, label],
    }));
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!form.question.trim() || !form.subject.trim()) {
      setErrorMessage("Question and subject are required.");
      return;
    }

    const completedOptions = form.options.filter(
      (option) => option.value.trim()
    );

    if (completedOptions.length < 2) {
      setErrorMessage("Please provide at least two answer options.");
      return;
    }

    if (form.correctAnswers.length === 0) {
      setErrorMessage("Select at least one correct answer.");
      return;
    }

    const validLabels = completedOptions.map((option) => option.label);

    if (
      form.correctAnswers.some(
        (answer) => !validLabels.includes(answer)
      )
    ) {
      setErrorMessage(
        "A selected correct answer does not have a completed option."
      );
      return;
    }

    setSaving(true);

    try {
      const questions = readQuestions();

      const index = questions.findIndex(
        (item) => item.id === questionId
      );

      if (index === -1) {
        throw new Error("Question no longer exists in local storage.");
      }

      const updatedQuestion: SchoolQuestion = {
        ...questions[index],
        question: form.question.trim(),
        subject: form.subject.trim(),
        topic: form.topic.trim(),
        institution: form.institution || "General",
        className: form.className.trim(),
        difficulty: form.difficulty,
        status: form.status,
        options: completedOptions,
        correctAnswers: form.correctAnswers,
        explanation: form.explanation.trim(),
        updatedAt: new Date().toISOString(),
      };

      questions[index] = updatedQuestion;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(questions)
      );

      setQuestion(updatedQuestion);
      setEditing(false);
      setSuccessMessage("Question updated successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update this question."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!question) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this question?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setErrorMessage("");

    try {
      const questions = readQuestions();

      const updated = questions.filter(
        (item) => item.id !== question.id
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      router.push("/admin/school-centres/questions");
    } catch {
      setErrorMessage("Unable to delete this question.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-violet-400"
          />
          <p className="mt-3 text-sm text-slate-400">
            Loading question...
          </p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <FileQuestion size={30} />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Question Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {errorMessage ||
              "The question may have been deleted or is no longer available."}
          </p>

          <Link
            href="/admin/school-centres/questions"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <ArrowLeft size={17} />
            Back to Question Bank
          </Link>
        </div>
      </div>
    );
  }

  const difficulty = normalizeDifficulty(question.difficulty);
  const status = normalizeStatus(question.status);
  const options = normalizeOptions(question.options);
  const correctAnswers = normalizeAnswers(question.correctAnswers);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link
            href="/admin/school-centres"
            className="transition hover:text-white"
          >
            School & Study Centres
          </Link>
          <span>/</span>
          <Link
            href="/admin/school-centres/questions"
            className="transition hover:text-white"
          >
            Question Bank
          </Link>
          <span>/</span>
          <span className="text-white">Question Details</span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/school-centres/questions"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Question Bank
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <FileQuestion size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Question Details
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  View and manage this school practice question.
                </p>
              </div>
            </div>
          </div>

          {!editing && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setSuccessMessage("");
                  setEditing(true);
                }}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Edit Question
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 px-4 py-3 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Feedback */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 size={19} />
            {successMessage}
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="ml-auto"
              aria-label="Dismiss success message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {errorMessage && editing && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
            <X size={18} />
            {errorMessage}
          </div>
        )}

        {/* Question metadata */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-500">Subject</p>
            <p className="mt-2 font-semibold text-white">
              {question.subject || "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-500">Difficulty</p>
            <span
              className={`mt-2 inline-flex rounded-lg border px-3 py-1 text-xs font-medium ${difficultyStyles[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-500">Status</p>
            <span
              className={`mt-2 inline-flex rounded-lg px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
            >
              {status}
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-500">Date Added</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {question.createdAt
                ? new Date(question.createdAt).toLocaleDateString()
                : "Not available"}
            </p>
          </div>
        </div>

        {/* Edit form */}
        {editing ? (
          <form
            onSubmit={handleSave}
            className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7"
          >
            <div>
              <h2 className="text-lg font-semibold">
                Edit Question
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Update the question details and save your changes.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Subject *
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Topic
                </label>
                <input
                  value={form.topic}
                  onChange={(event) =>
                    updateField("topic", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Institution
                </label>
                <select
                  value={form.institution}
                  onChange={(event) =>
                    updateField("institution", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  <option value="General">General question bank</option>
                  {institutions.map((institution, index) => (
                    <option key={`${institution}-${index}`} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Class / Level
                </label>
                <input
                  value={form.className}
                  onChange={(event) =>
                    updateField("className", event.target.value)
                  }
                  placeholder="e.g. SS2"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    updateField(
                      "difficulty",
                      event.target.value as Difficulty
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as QuestionStatus
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="mb-2 block text-sm text-slate-300">
                Question *
              </label>
              <textarea
                required
                rows={5}
                value={form.question}
                onChange={(event) =>
                  updateField("question", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-6 outline-none focus:border-violet-500"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="mb-4 font-semibold">
                Answer Options
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {form.options.map((option, index) => (
                  <div key={option.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm text-slate-300">
                        Option {option.label}
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={form.correctAnswers.includes(option.label)}
                          onChange={() =>
                            toggleCorrectAnswer(option.label)
                          }
                          className="accent-violet-500"
                        />
                        Correct
                      </label>
                    </div>

                    <input
                      value={option.value}
                      onChange={(event) =>
                        updateOption(index, event.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="mb-2 block text-sm text-slate-300">
                Explanation
              </label>
              <textarea
                rows={4}
                value={form.explanation}
                onChange={(event) =>
                  updateField("explanation", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-6 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  loadQuestion();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Read-only question */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
                <BookOpen size={18} />
                Question
              </div>

              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-100">
                {getQuestionText(question)}
              </p>

              {options.length > 0 && (
                <div className="mt-7 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-300">
                    Answer Options
                  </h3>

                  {options.map((option) => {
                    const isCorrect = correctAnswers.includes(option.label);

                    return (
                      <div
                        key={option.label}
                        className={`flex items-start gap-3 rounded-xl border p-4 ${
                          isCorrect
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-white/10 bg-slate-950/60"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            isCorrect
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {option.label}
                        </span>

                        <p className="flex-1 pt-1 text-sm leading-6 text-slate-200">
                          {option.value}
                        </p>

                        {isCorrect && (
                          <CheckCircle2
                            size={19}
                            className="mt-1 shrink-0 text-emerald-400"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-7 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Correct Answer
                </p>

                <p className="mt-2 text-sm font-semibold text-emerald-300">
                  {correctAnswers.length > 0
                    ? correctAnswers.join(", ")
                    : "No correct answer recorded"}
                </p>
              </div>

              {question.explanation && (
                <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/60 p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Explanation / Solution
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                    {question.explanation}
                  </p>
                </div>
              )}

              {Array.isArray(question.explanationSteps) &&
                question.explanationSteps.length > 0 && (
                  <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/60 p-5">
                    <h3 className="text-sm font-semibold text-white">
                      Explanation Steps
                    </h3>

                    <div className="mt-3 space-y-3">
                      {question.explanationSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-slate-400"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-semibold text-violet-300">
                            {index + 1}
                          </span>
                          <span>
                            {typeof step === "string"
                              ? step
                              : JSON.stringify(step)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Additional details */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
              <h2 className="font-semibold text-white">
                Question Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Building2
                    size={19}
                    className="mt-0.5 text-violet-400"
                  />
                  <div>
                    <p className="text-xs text-slate-500">
                      Institution
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {question.institution || "General question bank"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap
                    size={19}
                    className="mt-0.5 text-violet-400"
                  />
                  <div>
                    <p className="text-xs text-slate-500">
                      Class / Level
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {question.className || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen
                    size={19}
                    className="mt-0.5 text-violet-400"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Topic</p>
                    <p className="mt-1 text-sm text-white">
                      {question.topic || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={19}
                    className="mt-0.5 text-violet-400"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="mt-1 text-sm text-white">
                      {formatDate(question.createdAt)}
                    </p>
                  </div>
                </div>

                {typeof question.updatedAt === "string" && (
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={19}
                      className="mt-0.5 text-violet-400"
                    />
                    <div>
                      <p className="text-xs text-slate-500">
                        Last Updated
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {formatDate(question.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {question.examType && (
                  <div className="flex items-start gap-3">
                    <FileQuestion
                      size={19}
                      className="mt-0.5 text-violet-400"
                    />
                    <div>
                      <p className="text-xs text-slate-500">
                        Exam Type
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {question.examType}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Prototype notice */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-300">
            Local storage mode
          </p>
          <p className="mt-1 text-xs leading-6 text-slate-400">
            Changes are saved in this browser only. A backend database is
            needed before question updates and deletions can synchronize
            across administrators, institutions and students.
          </p>
        </div>
      </div>
    </div>
  );
}
