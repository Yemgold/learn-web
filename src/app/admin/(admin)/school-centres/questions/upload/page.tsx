



"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileJson,
  FileQuestion,
  FileUp,
  GraduationCap,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const STORAGE_KEY = "learnyfi-school-centres-questions";
const INSTITUTIONS_KEY = "learnyfi-school-centres-institutions";

type Difficulty = "Easy" | "Medium" | "Hard";
type QuestionStatus = "Published" | "Draft" | "Pending";

type Option = {
  label: string;
  value: string;
};

type QuestionForm = {
  question: string;
  subject: string;
  topic: string;
  institution: string;
  className: string;
  difficulty: Difficulty;
  status: QuestionStatus;
  options: Option[];
  correctAnswers: string[];
  explanation: string;
};

const initialForm: QuestionForm = {
  question: "",
  subject: "",
  topic: "",
  institution: "",
  className: "",
  difficulty: "Medium",
  status: "Published",
  options: [
    { label: "A", value: "" },
    { label: "B", value: "" },
    { label: "C", value: "" },
    { label: "D", value: "" },
  ],
  correctAnswers: [],
  explanation: "",
};

function readStoredQuestions(): Record<string, unknown>[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
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

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `question-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function extractQuestionText(item: Record<string, unknown>): string {
  if (typeof item.question === "string") {
    return item.question.trim();
  }

  if (typeof item.text === "string") {
    return item.text.trim();
  }

  // Support the content-first QuestionBankItem format.
  if (Array.isArray(item.content)) {
    const parts: string[] = [];

    for (const block of item.content) {
      if (!block || typeof block !== "object") continue;

      const contentBlock = block as Record<string, unknown>;

      if (typeof contentBlock.text === "string") {
        parts.push(contentBlock.text);
      }

      if (Array.isArray(contentBlock.segments)) {
        for (const segment of contentBlock.segments) {
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

  return "";
}

function normalizeOptions(value: unknown): Option[] {
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

function normalizeCorrectAnswers(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((answer) => String(answer));
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function normalizeDifficulty(value: unknown): Difficulty {
  const difficulty = String(value || "").toLowerCase();

  if (difficulty === "easy") return "Easy";
  if (difficulty === "hard") return "Hard";

  return "Medium";
}

function normalizeStatus(value: unknown): QuestionStatus {
  const status = String(value || "").toLowerCase();

  if (status === "draft") return "Draft";
  if (status === "pending") return "Pending";

  return "Published";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong while processing your questions.";
}

export default function UploadSchoolQuestionsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<QuestionForm>(initialForm);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState<"manual" | "bulk">("manual");

  const [jsonText, setJsonText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);

  useEffect(() => {
    setInstitutions(readInstitutions());
  }, []);

  const updateField = <K extends keyof QuestionForm>(
    field: K,
    value: QuestionForm[K]
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
        optionIndex === index ? { ...option, value } : option
      ),
    }));
  };

  const toggleCorrectAnswer = (label: string) => {
    setForm((previous) => ({
      ...previous,
      correctAnswers: previous.correctAnswers.includes(label)
        ? previous.correctAnswers.filter((item) => item !== label)
        : [...previous.correctAnswers, label],
    }));
  };

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setUploadedCount(0);
  };

  const saveQuestions = (newQuestions: Record<string, unknown>[]) => {
    const existingQuestions = readStoredQuestions();

    const updatedQuestions = [
      ...existingQuestions,
      ...newQuestions,
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedQuestions)
    );

    setUploadedCount(newQuestions.length);
    setSuccessMessage(
      `${newQuestions.length} question${newQuestions.length === 1 ? "" : "s"} uploaded successfully.`
    );
  };

  const handleManualUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    const question = form.question.trim();
    const subject = form.subject.trim();

    if (!question || !subject) {
      setErrorMessage("Please enter the question and select a subject.");
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
      setErrorMessage("Please select at least one correct answer.");
      return;
    }

    const validLabels = completedOptions.map((option) => option.label);

    if (
      form.correctAnswers.some(
        (answer) => !validLabels.includes(answer)
      )
    ) {
      setErrorMessage(
        "One of your selected correct answers has no corresponding option."
      );
      return;
    }

    setSaving(true);

    try {
      const newQuestion: Record<string, unknown> = {
        id: createId(),
        question,
        subject,
        topic: form.topic.trim(),
        institution: form.institution || "General",
        className: form.className.trim(),
        difficulty: form.difficulty,
        status: form.status,
        options: completedOptions,
        correctAnswers: form.correctAnswers,
        explanation: form.explanation.trim(),
        createdAt: new Date().toISOString(),
      };

      saveQuestions([newQuestion]);
      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        `Unable to save question: ${getErrorMessage(error)}`
      );
    } finally {
      setSaving(false);
    }
  };

  const processBulkQuestions = (rawData: unknown) => {
    if (!Array.isArray(rawData)) {
      throw new Error(
        "Your JSON must contain an array of question objects."
      );
    }

    if (rawData.length === 0) {
      throw new Error("The JSON file does not contain any questions.");
    }

    const newQuestions: Record<string, unknown>[] = [];

    rawData.forEach((entry, index) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        throw new Error(
          `Question ${index + 1} is not a valid question object.`
        );
      }

      const item = entry as Record<string, unknown>;

      const question = extractQuestionText(item);

      const subject =
        typeof item.subject === "string"
          ? item.subject.trim()
          : typeof item.apiSubjectName === "string"
            ? item.apiSubjectName.trim()
            : "";

      if (!question) {
        throw new Error(
          `Question ${index + 1} has no readable question text.`
        );
      }

      if (!subject) {
        throw new Error(
          `Question ${index + 1} has no subject.`
        );
      }

      const options = normalizeOptions(item.options);

      const correctAnswers = normalizeCorrectAnswers(
        item.correctAnswers ?? item.answer
      );

      if (options.length > 0 && correctAnswers.length === 0) {
        throw new Error(
          `Question ${index + 1} has options but no correct answer.`
        );
      }

      const questionRecord: Record<string, unknown> = {
        ...item,
        id: createId(),
        question,
        subject,
        topic:
          typeof item.topic === "string" ? item.topic : "",
        institution:
          typeof item.institution === "string"
            ? item.institution
            : "General",
        className:
          typeof item.className === "string"
            ? item.className
            : typeof item.class === "string"
              ? item.class
              : "",
        difficulty: normalizeDifficulty(item.difficulty),
        status: normalizeStatus(item.status),
        options,
        correctAnswers,
        explanation:
          typeof item.explanation === "string"
            ? item.explanation
            : typeof item.solution === "string"
              ? item.solution
              : "",
        createdAt:
          typeof item.createdAt === "string"
            ? item.createdAt
            : new Date().toISOString(),
      };

      newQuestions.push(questionRecord);
    });

    return newQuestions;
  };

  const handleBulkUpload = () => {
    resetMessages();

    if (!jsonText.trim()) {
      setErrorMessage("Paste your JSON questions before uploading.");
      return;
    }

    setSaving(true);

    try {
      const parsed = JSON.parse(jsonText);
      const questions = processBulkQuestions(parsed);

      saveQuestions(questions);
      setJsonText("");
      setSelectedFileName("");
    } catch (error) {
      setErrorMessage(
        `Upload failed: ${getErrorMessage(error)}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    resetMessages();

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      setErrorMessage("Please select a .json file.");
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      JSON.parse(text);

      setJsonText(text);
      setSelectedFileName(file.name);
      setUploadMode("bulk");
    } catch {
      setErrorMessage("The selected file is not valid JSON.");
    }

    event.target.value = "";
  };

  const downloadTemplate = () => {
    const template = [
      {
        subject: "Mathematics",
        topic: "Algebra",
        className: "SS2",
        difficulty: "Easy",
        status: "Published",
        question: "If x + 5 = 12, find the value of x.",
        options: [
          { label: "A", value: "5" },
          { label: "B", value: "7" },
          { label: "C", value: "8" },
          { label: "D", value: "9" },
        ],
        correctAnswers: ["B"],
        explanation: "Subtract 5 from both sides. Therefore, x = 7.",
      },
    ];

    const blob = new Blob(
      [JSON.stringify(template, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "school-questions-template.json";
    anchor.click();

    URL.revokeObjectURL(url);
  };

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
          <span className="text-white">Upload Questions</span>
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
                <Upload size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Upload Questions
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Add practice questions for schools and study centres.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/school-centres/questions"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <BookOpen size={17} />
            View Question Bank
          </Link>
        </div>

        {/* Upload mode */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              resetMessages();
              setUploadMode("manual");
            }}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
              uploadMode === "manual"
                ? "border-violet-500/50 bg-violet-500/10"
                : "border-white/10 bg-slate-900/70 hover:bg-slate-900"
            }`}
          >
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
              <FileQuestion size={22} />
            </div>

            <div>
              <p className="font-semibold text-white">Manual Upload</p>
              <p className="mt-1 text-xs text-slate-400">
                Add one question at a time.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              resetMessages();
              setUploadMode("bulk");
            }}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
              uploadMode === "bulk"
                ? "border-violet-500/50 bg-violet-500/10"
                : "border-white/10 bg-slate-900/70 hover:bg-slate-900"
            }`}
          >
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <FileJson size={22} />
            </div>

            <div>
              <p className="font-semibold text-white">Bulk JSON Upload</p>
              <p className="mt-1 text-xs text-slate-400">
                Upload many questions from a JSON file.
              </p>
            </div>
          </button>
        </div>

        {/* Feedback */}
        {successMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-emerald-300">
                Upload successful
              </p>
              <p className="mt-1 text-sm text-emerald-200/80">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={() =>
                  router.push("/admin/school-centres/questions")
                }
                className="mt-3 text-sm font-semibold text-emerald-300 underline underline-offset-4"
              >
                View Question Bank
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              aria-label="Dismiss success message"
              className="text-emerald-300"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <Info
              size={20}
              className="mt-0.5 shrink-0 text-rose-400"
            />
            <p className="flex-1 text-sm leading-6 text-rose-300">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              aria-label="Dismiss error message"
              className="text-rose-300"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Manual upload */}
        {uploadMode === "manual" && (
          <form
            onSubmit={handleManualUpload}
            className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">
                Question Details
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Provide the question information and select where it belongs.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Subject <span className="text-rose-400">*</span>
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Topic
                </label>
                <input
                  value={form.topic}
                  onChange={(event) =>
                    updateField("topic", event.target.value)
                  }
                  placeholder="e.g. Algebra"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Institution
                </label>
                <div className="relative">
                  <select
                    value={form.institution}
                    onChange={(event) =>
                      updateField("institution", event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-sm text-white outline-none focus:border-violet-500"
                  >
                    <option value="">General question bank</option>
                    {institutions.map((institution, index) => (
                      <option key={`${institution}-${index}`} value={institution}>
                        {institution}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Choose an institution or leave blank for general questions.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Class / Level
                </label>
                <input
                  value={form.className}
                  onChange={(event) =>
                    updateField("className", event.target.value)
                  }
                  placeholder="e.g. JSS 1, SS2, JAMB"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
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
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Publication Status
                </label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as QuestionStatus
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending Review</option>
                </select>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Question <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={form.question}
                onChange={(event) =>
                  updateField("question", event.target.value)
                }
                placeholder="Enter the complete question..."
                className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="mb-4">
                <h3 className="font-semibold text-white">Answer Options</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Enter at least two options and mark the correct answer.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {form.options.map((option, index) => (
                  <div key={option.label}>
                    <label className="mb-2 flex items-center justify-between gap-2 text-sm font-medium text-slate-300">
                      <span>Option {option.label}</span>
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={form.correctAnswers.includes(option.label)}
                          onChange={() =>
                            toggleCorrectAnswer(option.label)
                          }
                          className="h-4 w-4 accent-violet-500"
                        />
                        Correct answer
                      </label>
                    </label>

                    <input
                      value={option.value}
                      onChange={(event) =>
                        updateOption(index, event.target.value)
                      }
                      placeholder={`Enter option ${option.label}`}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Explanation / Solution
              </label>
              <textarea
                rows={4}
                value={form.explanation}
                onChange={(event) =>
                  updateField("explanation", event.target.value)
                }
                placeholder="Explain why the selected answer is correct..."
                className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving Question..." : "Save Question"}
              </button>
            </div>
          </form>
        )}

        {/* Bulk JSON upload */}
        {uploadMode === "bulk" && (
          <div className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Bulk JSON Upload
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Upload a JSON file or paste an array of question objects.
                Questions will be checked before being saved.
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-start gap-3">
                <Info
                  size={19}
                  className="mt-0.5 shrink-0 text-blue-400"
                />
                <div>
                  <p className="text-sm font-semibold text-blue-300">
                    Supported question formats
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Questions can use a regular question field or the
                    content-first QuestionBankItem format. Existing fields
                    such as options, correctAnswers, explanation, topic,
                    difficulty and examType are preserved.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:border-violet-500/40 hover:bg-slate-800"
              >
                <FileUp size={18} />
                Choose JSON File
              </button>

              <button
                type="button"
                onClick={downloadTemplate}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                <FileJson size={18} />
                Download JSON Template
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileSelection}
              />
            </div>

            {selectedFileName && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="flex min-w-0 items-center gap-2 text-sm text-emerald-300">
                  <FileJson size={18} className="shrink-0" />
                  <span className="truncate">{selectedFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFileName("");
                    setJsonText("");
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                  aria-label="Remove selected file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                JSON Question Data
              </label>
              <textarea
                rows={18}
                spellCheck={false}
                value={jsonText}
                onChange={(event) => {
                  setJsonText(event.target.value);
                  setSelectedFileName("");
                }}
                placeholder={`[
  {
    "subject": "Mathematics",
    "topic": "Algebra",
    "className": "SS2",
    "difficulty": "Easy",
    "status": "Published",
    "question": "If x + 5 = 12, find x.",
    "options": [
      { "label": "A", "value": "5" },
      { "label": "B", "value": "7" },
      { "label": "C", "value": "8" },
      { "label": "D", "value": "9" }
    ],
    "correctAnswers": ["B"],
    "explanation": "Subtract 5 from both sides."
  }
]`}
                className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                The JSON must be an array of question objects.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setJsonText("");
                  setSelectedFileName("");
                  resetMessages();
                }}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Clear Data
              </button>

              <button
                type="button"
                onClick={handleBulkUpload}
                disabled={saving || !jsonText.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
                {saving ? "Processing Questions..." : "Upload Questions"}
              </button>
            </div>
          </div>
        )}

        {/* Notice */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-300">
            Important: Browser-local storage
          </p>
          <p className="mt-1 text-xs leading-6 text-slate-400">
            This prototype saves questions in the current browser using
            localStorage. The questions will appear in the School & Study
            Centre Question Bank on this browser, but they are not yet
            synchronized with other administrators, institutions or student
            devices. A backend database and API are required for shared
            question management and student practice.
          </p>
        </div>
      </div>
    </div>
  );
}
