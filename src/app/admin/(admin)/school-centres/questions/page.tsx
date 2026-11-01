





"use client";


import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Filter,
  GraduationCap,
  Layers3,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";
type QuestionStatus = "Published" | "Draft" | "Pending";

type SchoolQuestion = {
  id: string;
  question: string;
  subject: string;
  topic: string;
  institution: string;
  className: string;
  difficulty: Difficulty;
  status: QuestionStatus;
  createdAt: string;
};

const STORAGE_KEY = "learnyfi-school-centres-questions";
const INSTITUTIONS_KEY = "learnyfi-school-centres-institutions";

function readQuestions(): SchoolQuestion[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is SchoolQuestion =>
        item &&
        typeof item.id === "string" &&
        typeof item.question === "string" &&
        typeof item.subject === "string"
    );
  } catch {
    return [];
  }
}

function readInstitutionNames(): string[] {
  if (typeof window === "undefined") return [];

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

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const statusStyles: Record<QuestionStatus, string> = {
  Published: "bg-emerald-500/10 text-emerald-400",
  Draft: "bg-slate-500/10 text-slate-400",
  Pending: "bg-amber-500/10 text-amber-400",
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconColor}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function SchoolQuestionsPage() {
  const [questions, setQuestions] = useState<SchoolQuestion[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [institutionFilter, setInstitutionFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<SchoolQuestion | null>(null);

  // Load browser-local prototype data.
  useMemo(() => {
    // This memo is intentionally not used for side effects.
    return null;
  }, []);

  // Load data after the page is rendered.
  const loadData = () => {
    setQuestions(readQuestions());
    setInstitutions(readInstitutionNames());
  };

 // Keep the page synchronized with local browser storage.
useEffect(() => {
  loadData();

  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.key === "learnyfi-school-centres-questions" ||
      event.key === null
    ) {
      loadData();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  const subjects = useMemo(
    () => [...new Set(questions.map((question) => question.subject))],
    [questions]
  );

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !term ||
        question.question.toLowerCase().includes(term) ||
        question.subject.toLowerCase().includes(term) ||
        question.topic?.toLowerCase().includes(term) ||
        question.institution?.toLowerCase().includes(term);

      const matchesSubject =
        subjectFilter === "All" || question.subject === subjectFilter;

      const matchesInstitution =
        institutionFilter === "All" ||
        question.institution === institutionFilter;

      const matchesDifficulty =
        difficultyFilter === "All" ||
        question.difficulty === difficultyFilter;

      const matchesStatus =
        statusFilter === "All" || question.status === statusFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesInstitution &&
        matchesDifficulty &&
        matchesStatus
      );
    });
  }, [
    questions,
    search,
    subjectFilter,
    institutionFilter,
    difficultyFilter,
    statusFilter,
  ]);

  const publishedCount = questions.filter(
    (question) => question.status === "Published"
  ).length;

  const draftCount = questions.filter(
    (question) => question.status === "Draft"
  ).length;

  const pendingCount = questions.filter(
    (question) => question.status === "Pending"
  ).length;

  const handleDelete = (question: SchoolQuestion) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    const updated = questions.filter((item) => item.id !== question.id);

    setQuestions(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      window.alert("Unable to update local question storage.");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSubjectFilter("All");
    setInstitutionFilter("All");
    setDifficultyFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <Link
                href="/admin/school-centres"
                className="transition hover:text-white"
              >
                School & Study Centres
              </Link>
              <span>/</span>
              <span className="text-white">Question Bank</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <FileQuestion size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Question Bank
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Manage practice questions for registered schools and study
                  centres.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/school-centres/questions/upload"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
          >
            <Upload size={18} />
            Upload Questions
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Questions"
            value={questions.length}
            description="Questions in this browser"
            icon={BookOpen}
            iconColor="bg-violet-500/10 text-violet-400"
          />

          <StatCard
            title="Published"
            value={publishedCount}
            description="Available for practice"
            icon={CheckCircle2}
            iconColor="bg-emerald-500/10 text-emerald-400"
          />

          <StatCard
            title="Drafts"
            value={draftCount}
            description="Not yet published"
            icon={Layers3}
            iconColor="bg-slate-500/10 text-slate-300"
          />

          <StatCard
            title="Pending Review"
            value={pendingCount}
            description="Awaiting approval"
            icon={Clock3}
            iconColor="bg-amber-500/10 text-amber-400"
          />
        </div>

        {/* Institution information */}
        <div className="flex flex-col gap-4 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-slate-900/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
              <Building2 size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Institution Question Management
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                Organize questions by institution, subject, class and
                difficulty so students can access the right practice
                materials.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <p className="text-xs text-slate-500">Registered institutions</p>
            <p className="mt-1 text-xl font-bold text-white">
              {institutions.length}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions, subjects, topics or institutions..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                showFilters
                  ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                  : "border-white/10 bg-slate-950 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <SlidersHorizontal size={17} />
              Filters
              <Filter size={15} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Institution
                </label>
                <select
                  value={institutionFilter}
                  onChange={(event) =>
                    setInstitutionFilter(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="All">All institutions</option>
                  {institutions.map((institution) => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Subject
                </label>
                <select
                  value={subjectFilter}
                  onChange={(event) => setSubjectFilter(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="All">All subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(event) =>
                    setDifficultyFilter(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="All">All difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                >
                  <option value="All">All statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex justify-end sm:col-span-2 xl:col-span-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                  <X size={15} />
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Question list */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">All Questions</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredQuestions.length} of {questions.length}{" "}
                questions
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ArrowDownUp size={14} />
              Latest uploads first
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <FileQuestion size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {questions.length === 0
                  ? "No questions uploaded yet"
                  : "No matching questions"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {questions.length === 0
                  ? "Your school and study centre question bank is currently empty. Upload your first set of questions to get started."
                  : "Try changing your search term or filters to find the questions you are looking for."}
              </p>

              {questions.length === 0 ? (
                <Link
                  href="/admin/school-centres/questions/upload"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Plus size={17} />
                  Upload First Questions
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300">
                        {question.subject}
                      </span>

                      <span
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                          difficultyStyles[question.difficulty] ||
                          difficultyStyles.Medium
                        }`}
                      >
                        {question.difficulty || "Medium"}
                      </span>

                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                          statusStyles[question.status] ||
                          statusStyles.Draft
                        }`}
                      >
                        {question.status || "Draft"}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm font-medium leading-6 text-white">
                      {question.question}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={13} />
                        {question.institution || "General"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap size={13} />
                        {question.className || "Class not specified"}
                      </span>

                      {question.topic && (
                        <span className="inline-flex items-center gap-1.5">
                          <BookOpen size={13} />
                          {question.topic}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedQuestion(question)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-500/40 hover:text-white"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(question)}
                      className="rounded-lg border border-rose-500/20 p-2 text-rose-400 transition hover:bg-rose-500/10"
                      title="Delete question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prototype notice */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-medium text-amber-300">
            Frontend prototype
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            This page currently reads from browser localStorage. Uploaded
            questions are not yet synchronized across administrators,
            institutions or student devices. Backend integration is required
            for a shared question bank.
          </p>
        </div>
      </div>

      {/* Question preview modal */}
      {selectedQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedQuestion(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-preview-title"
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-violet-400">
                  Question preview
                </p>
                <h2
                  id="question-preview-title"
                  className="mt-2 text-xl font-bold text-white"
                >
                  {selectedQuestion.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300">
                {selectedQuestion.subject}
              </span>
              <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                {selectedQuestion.difficulty}
              </span>
              <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                {selectedQuestion.status}
              </span>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Question
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {selectedQuestion.question}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Institution</p>
                <p className="mt-1 text-sm text-white">
                  {selectedQuestion.institution || "General"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Class</p>
                <p className="mt-1 text-sm text-white">
                  {selectedQuestion.className || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Topic</p>
                <p className="mt-1 text-sm text-white">
                  {selectedQuestion.topic || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Created</p>
                <p className="mt-1 text-sm text-white">
                  {selectedQuestion.createdAt
                    ? new Date(selectedQuestion.createdAt).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
