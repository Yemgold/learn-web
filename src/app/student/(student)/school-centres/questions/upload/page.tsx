



"use client";

import {
  useEffect,
  useMemo,
  useState,
 
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileJson,
  LockKeyhole,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { useAuthStore } from "@/stores";
import {
  canManageSchoolCentreQuestions,
} from "@/config/school-centres-access";

const STORAGE_KEY = "learnyfi-school-centres-questions";

type Difficulty = "Easy" | "Medium" | "Hard";

type QuestionOption = {
  label: string;
  value: string;
};

type QuestionContent = {
  type: string;
  order: number;
  segments: {
    text: string;
    styles?: string[];
  }[];
};

type SchoolQuestion = {
  id: string;
  content: QuestionContent[];
  question: string;
  instruction?: string;
  subject: string;
  topic: string;
  section?: string;
  className: string;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  explanationSteps?: string[];
  difficulty: Difficulty;
  examType: string;
  institution?: string;
  createdAt: string;
  createdByEmail: string;
  source: string;
  [key: string]: unknown;
};

const SUBJECTS = [
  "English Language",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Commerce",
  "Accounting",
  "Government",
  "Literature in English",
  "Agricultural Science",
  "Geography",
  "Civic Education",
  "Computer Studies",
  "Other",
];

const DIFFICULTIES: Difficulty[] = [
  "Easy",
  "Medium",
  "Hard",
];

const EXAM_TYPES = [
  "School Examination",
  "JAMB",
  "WAEC",
  "NECO",
  "Other",
];

const EMPTY_FORM = {
  question: "",
  subject: "",
  topic: "",
  section: "",
  className: "",
  difficulty: "Medium" as Difficulty,
  examType: "School Examination",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "A",
  explanation: "",
  instruction: "",
};

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `question-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getQuestionText(item: Record<string, unknown>) {
  if (typeof item.question === "string") {
    return item.question;
  }

  if (typeof item.content === "string") {
    return item.content;
  }

  if (Array.isArray(item.content)) {
    return item.content
      .map((block) => {
        if (
          typeof block !== "object" ||
          block === null ||
          !("segments" in block)
        ) {
          return "";
        }

        const segments = (block as {
          segments?: { text?: string }[];
        }).segments;

        return Array.isArray(segments)
          ? segments
              .map((segment) => segment.text || "")
              .join("")
          : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function normalizeImportedQuestion(
  item: Record<string, unknown>,
  email: string
): SchoolQuestion {
  const questionText = getQuestionText(item);

  const rawOptions = Array.isArray(item.options)
    ? item.options
    : [];

  const options: QuestionOption[] = rawOptions.map(
    (option, index) => {
      const record =
        typeof option === "object" && option !== null
          ? (option as Record<string, unknown>)
          : {};

      return {
        label:
          typeof record.label === "string"
            ? record.label
            : String.fromCharCode(65 + index),
        value:
          typeof record.value === "string"
            ? record.value
            : String(record.value ?? ""),
      };
    }
  );

  const rawAnswers = Array.isArray(item.correctAnswers)
    ? item.correctAnswers
    : item.correctAnswers
      ? [item.correctAnswers]
      : item.answer
        ? [item.answer]
        : [];

  const difficultyValue = String(
    item.difficulty || "Medium"
  ).toLowerCase();

  const difficulty: Difficulty =
    difficultyValue === "easy"
      ? "Easy"
      : difficultyValue === "hard"
        ? "Hard"
        : "Medium";

  const content: QuestionContent[] =
    Array.isArray(item.content)
      ? (item.content as QuestionContent[])
      : [
          {
            type: "text",
            order: 1,
            segments: [
              {
                text: questionText,
                styles: [],
              },
            ],
          },
        ];

  return {
    ...item,
    id: String(item.id || createId()),
    content,
    question: questionText,
    instruction: String(item.instruction || ""),
    subject: String(
      item.subject ||
        item.apiSubjectName ||
        "Other"
    ),
    topic: String(item.topic || ""),
    section: String(item.section || ""),
    className: String(
      item.className || item.class || ""
    ),
    options,
    correctAnswers: rawAnswers.map(String),
    explanation: String(item.explanation || ""),
    explanationSteps: Array.isArray(item.explanationSteps)
      ? item.explanationSteps.map(String)
      : [],
    difficulty,
    examType: String(item.examType || "School Examination"),
    createdAt: String(
      item.createdAt || new Date().toISOString()
    ),
    createdByEmail: email,
    source: "school-centre",
  } as SchoolQuestion;
}

export default function SchoolCentreQuestionUploadPage() {
  const user = useAuthStore((state) => state.user);

  const email = user?.email || "";

  const hasAccess = canManageSchoolCentreQuestions(email);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "manual" | "bulk"
  >("manual");

  const [form, setForm] = useState(EMPTY_FORM);

  const [questions, setQuestions] = useState<SchoolQuestion[]>(
    []
  );

  const [jsonInput, setJsonInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [importCount, setImportCount] = useState(0);

  useEffect(() => {
    setMounted(true);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setQuestions(parsed);
        }
      }
    } catch {
      setError("Unable to load the saved questions.");
    }
  }, []);

  const myQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question.createdByEmail?.toLowerCase() ===
          email.toLowerCase()
      ),
    [questions, email]
  );

  function persistQuestions(
    updatedQuestions: SchoolQuestion[]
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedQuestions)
    );

    setQuestions(updatedQuestions);
  }

  function updateField(
    field: keyof typeof EMPTY_FORM,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  function validateManualQuestion() {
    if (!form.question.trim()) {
      return "Please enter the question.";
    }

    if (!form.subject) {
      return "Please select a subject.";
    }

    if (!form.className.trim()) {
      return "Please enter the class or target group.";
    }

    const options = [
      form.optionA,
      form.optionB,
      form.optionC,
      form.optionD,
    ];

    if (options.some((option) => !option.trim())) {
      return "Please fill in all four answer options.";
    }

    if (
      !options.some(
        (option) =>
          option.trim() ===
          options[
            ["A", "B", "C", "D"].indexOf(
              form.correctAnswer
            )
          ].trim()
      )
    ) {
      return "Please provide a valid correct answer.";
    }

    return "";
  }

 function handleManualSubmit(event: {
  preventDefault: () => void;
}) 
  
  {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateManualQuestion();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!hasAccess || !email) {
      setError("You are not authorized to create questions.");
      return;
    }

    setSaving(true);

    try {
      const options: QuestionOption[] = [
        { label: "A", value: form.optionA.trim() },
        { label: "B", value: form.optionB.trim() },
        { label: "C", value: form.optionC.trim() },
        { label: "D", value: form.optionD.trim() },
      ];

      const newQuestion: SchoolQuestion = {
        id: createId(),

        // Keep content as the first question-bank field.
        content: [
          {
            type: "text",
            order: 1,
            segments: [
              {
                text: form.question.trim(),
                styles: [],
              },
            ],
          },
        ],

        question: form.question.trim(),
        instruction: form.instruction.trim(),

        subject: form.subject,
        topic: form.topic.trim(),
        section: form.section.trim(),
        className: form.className.trim(),

        options,

        correctAnswers: [form.correctAnswer],

        explanation: form.explanation.trim(),
        explanationSteps: [],

        difficulty: form.difficulty,
        examType: form.examType,

        createdAt: new Date().toISOString(),
        createdByEmail: email,
        source: "school-centre",
      };

      const updatedQuestions = [
        newQuestion,
        ...questions,
      ];

      persistQuestions(updatedQuestions);

      setForm(EMPTY_FORM);

      setSuccess("Question created successfully.");
    } catch {
      setError("Unable to save the question. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleBulkImport() {
    setError("");
    setSuccess("");
    setImportCount(0);

    if (!hasAccess || !email) {
      setError("You are not authorized to import questions.");
      return;
    }

    if (!jsonInput.trim()) {
      setError("Paste your JSON questions first.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      const rawQuestions = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.questions)
          ? parsed.questions
          : null;

      if (!rawQuestions || rawQuestions.length === 0) {
        setError(
          "The JSON must contain an array of questions."
        );
        return;
      }

      const imported: SchoolQuestion[] = rawQuestions.map(
        (item: unknown) => {
          if (
            typeof item !== "object" ||
            item === null ||
            Array.isArray(item)
          ) {
            throw new Error(
              "Each question must be a JSON object."
            );
          }

          const normalized = normalizeImportedQuestion(
            item as Record<string, unknown>,
            email
          );

          if (!normalized.question.trim()) {
            throw new Error(
              "One or more questions have no question text."
            );
          }

          if (!normalized.subject.trim()) {
            throw new Error(
              "One or more questions have no subject."
            );
          }

          if (normalized.options.length !== 4) {
            throw new Error(
              "Each question must have exactly four options."
            );
          }

          return normalized;
        }
      );

      const updatedQuestions = [
        ...imported,
        ...questions,
      ];

      persistQuestions(updatedQuestions);

      setImportCount(imported.length);
      setJsonInput("");

      setSuccess(
        `${imported.length} question(s) imported successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid JSON. Please check your file structure."
      );
    }
  }

  function deleteQuestion(id: string) {
    const question = questions.find(
      (item) => item.id === id
    );

    if (
      !question ||
      question.createdByEmail?.toLowerCase() !==
        email.toLowerCase()
    ) {
      setError("You cannot delete this question.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    try {
      const updated = questions.filter(
        (item) => item.id !== id
      );

      persistQuestions(updated);
      setSuccess("Question deleted successfully.");
    } catch {
      setError("Unable to delete this question.");
    }
  }

  function downloadTemplate() {
    const template = [
      {
        content: [
          {
            type: "text",
            order: 1,
            segments: [
              {
                text: "Enter your question here",
                styles: [],
              },
            ],
          },
        ],
        question: "Enter your question here",
        instruction: "",
        subject: "Biology",
        topic: "Living Things",
        section: "",
        className: "SS1",
        options: [
          { label: "A", value: "Option A" },
          { label: "B", value: "Option B" },
          { label: "C", value: "Option C" },
          { label: "D", value: "Option D" },
        ],
        correctAnswers: ["A"],
        explanation: "Enter the explanation here.",
        explanationSteps: [],
        difficulty: "Easy",
        examType: "School Examination",
      },
    ];

    const blob = new Blob(
      [JSON.stringify(template, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "school-centre-question-template.json";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading question workspace...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
        <div className="mx-auto max-w-lg rounded-3xl border border-red-500/20 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <LockKeyhole className="h-8 w-8 text-red-400" />
          </div>

          <h1 className="text-2xl font-bold">
            Access Restricted
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            This question creation workspace is currently
            available only to approved school and study-centre
            accounts.
          </p>

          {email && (
            <p className="mt-4 break-all rounded-xl bg-slate-800 p-3 text-sm text-slate-300">
              Logged in as: {email}
            </p>
          )}

          <Link
            href="/student"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-xl bg-indigo-500/10 p-2.5">
                  <BookOpen className="h-6 w-6 text-indigo-400" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                  School & Study Centres
                </span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Question Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Create and upload questions for your students.
                Organise questions by subject, topic, class and
                difficulty.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
              <p className="text-xs text-slate-400">
                Questions created by you
              </p>

              <p className="mt-1 text-3xl font-bold">
                {myQuestions.length}
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                Approved account
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto"
              aria-label="Dismiss success message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <X className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto"
              aria-label="Dismiss error message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "manual"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Plus className="h-4 w-4" />
            Create Question
          </button>

          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "bulk"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FileJson className="h-4 w-4" />
            Bulk JSON Upload
          </button>
        </div>

        {/* Manual question form */}
        {activeTab === "manual" && (
          <form
            onSubmit={handleManualSubmit}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7"
          >
            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-3">
                <ClipboardList className="h-5 w-5 text-indigo-400" />
              </div>

              <div>
                <h2 className="font-bold">
                  Create a New Question
                </h2>
                <p className="text-xs text-slate-400">
                  Complete the fields below.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Question *
                </label>

                <textarea
                  required
                  rows={4}
                  value={form.question}
                  onChange={(event) =>
                    updateField("question", event.target.value)
                  }
                  placeholder="Enter your question..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Subject *
                </label>

                <select
                  required
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="">Select subject</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
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
                  placeholder="e.g. Cell Biology"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Section
                </label>

                <input
                  value={form.section}
                  onChange={(event) =>
                    updateField("section", event.target.value)
                  }
                  placeholder="Optional section"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Class / Target Group *
                </label>

                <input
                  required
                  value={form.className}
                  onChange={(event) =>
                    updateField("className", event.target.value)
                  }
                  placeholder="e.g. JSS 2, SS1, SS3"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
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
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option
                      key={difficulty}
                      value={difficulty}
                    >
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Examination Type
                </label>

                <select
                  value={form.examType}
                  onChange={(event) =>
                    updateField("examType", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  {EXAM_TYPES.map((exam) => (
                    <option key={exam} value={exam}>
                      {exam}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Instruction (Optional)
                </label>

                <input
                  value={form.instruction}
                  onChange={(event) =>
                    updateField("instruction", event.target.value)
                  }
                  placeholder="e.g. Choose the correct answer."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Options */}
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">
                Answer Options *
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {(
                  [
                    ["A", "optionA"],
                    ["B", "optionB"],
                    ["C", "optionC"],
                    ["D", "optionD"],
                  ] as const
                ).map(([label, field]) => (
                  <div key={label}>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Option {label}
                    </label>

                    <input
                      required
                      value={form[field]}
                      onChange={(event) =>
                        updateField(field, event.target.value)
                      }
                      placeholder={`Enter option ${label}`}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct answer */}
            <div className="mt-7">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Correct Answer *
              </label>

              <div className="grid grid-cols-4 gap-3">
                {["A", "B", "C", "D"].map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() =>
                      updateField("correctAnswer", answer)
                    }
                    className={`rounded-xl border py-3 font-bold transition ${
                      form.correctAnswer === answer
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {answer}
                    {form.correctAnswer === answer && (
                      <CheckCircle2 className="ml-2 inline h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Explanation
              </label>

              <textarea
                rows={4}
                value={form.explanation}
                onChange={(event) =>
                  updateField("explanation", event.target.value)
                }
                placeholder="Explain why the selected answer is correct..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        )}

        {/* Bulk JSON upload */}
        {activeTab === "bulk" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <FileJson className="h-5 w-5 text-purple-400" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Bulk Question Import
                  </h2>
                  <p className="text-xs text-slate-400">
                    Import multiple questions using JSON.
                  </p>
                </div>
              </div>

              <button
                onClick={downloadTemplate}
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                <FileJson className="h-4 w-4" />
                Download Template
              </button>
            </div>

            <div className="mb-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm leading-6 text-slate-300">
              Paste a JSON array of questions or an object
              containing a <code>questions</code> array.
              Your existing content-first question-bank format
              is supported.
            </div>

            <textarea
              rows={18}
              value={jsonInput}
              onChange={(event) =>
                setJsonInput(event.target.value)
              }
              placeholder={`[
  {
    "content": [
      {
        "type": "text",
        "order": 1,
        "segments": [
          {
            "text": "Your question goes here",
            "styles": []
          }
        ]
      }
    ],
    "question": "Your question goes here",
    "subject": "Biology",
    "topic": "Cell Biology",
    "className": "SS1",
    "options": [
      { "label": "A", "value": "Option A" },
      { "label": "B", "value": "Option B" },
      { "label": "C", "value": "Option C" },
      { "label": "D", "value": "Option D" }
    ],
    "correctAnswers": ["A"],
    "explanation": "Explanation here",
    "difficulty": "Easy",
    "examType": "School Examination"
  }
]`}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 font-mono text-xs leading-6 text-slate-300 outline-none focus:border-indigo-500"
            />

            <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Each imported question must have a question,
                subject and exactly four options.
              </p>

              <button
                onClick={handleBulkImport}
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
              >
                <Upload className="h-4 w-4" />
                Import Questions
              </button>
            </div>

            {importCount > 0 && (
              <p className="mt-4 text-sm text-emerald-400">
                {importCount} questions imported.
              </p>
            )}
          </section>
        )}

        {/* My questions */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">
                My Questions
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Questions created using your approved account.
              </p>
            </div>

            <span className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              {myQuestions.length} question(s)
            </span>
          </div>

          {myQuestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-600" />

              <h3 className="font-semibold">
                No questions created yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first question or import questions
                using JSON.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myQuestions.map((question, index) => (
                <article
                  key={question.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300">
                          {question.subject}
                        </span>

                        <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                          {question.className || "No class"}
                        </span>

                        <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                          {question.difficulty}
                        </span>
                      </div>

                      <p className="font-medium leading-7 text-white">
                        {index + 1}. {question.question}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                        {question.topic && (
                          <span>Topic: {question.topic}</span>
                        )}

                        <span>{question.examType}</span>

                        <span>
                          {new Date(
                            question.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        deleteQuestion(question.id)
                      }
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-red-500/20 px-3 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-6 text-amber-200/80">
          <strong className="text-amber-300">
            Temporary storage notice:
          </strong>{" "}
          Questions are currently saved in this browser's
          localStorage. They will not automatically appear on
          another device or be shared with students until this
          page is connected to your backend API. The email
          allowlist is also a temporary frontend restriction,
          not secure server-side authorization.
        </div>
      </div>
    </main>
  );
}
