



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  HardDrive,
  Loader2,
  Play,
  Search,
  Trash2,
  WifiOff,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type {
  ExamType as BankExamType,
  QuestionBankItem,
} from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions/types";

type Subject =
  | "Mathematics"
  | "Biology"
  | "English Language"
  | "Chemistry"
  | "Physics";

type ExamType = "JAMB" | "WAEC" | "NECO";
type Difficulty = "easy" | "medium" | "hard";

type SavedAnswer = {
  questionIndex: number;
  selectedOption: string;
  correct: boolean;
};

type StoredPracticeSet = {
  id: string;
  subject: Subject;
  exam: ExamType;
  difficulty: Difficulty;
  questions: QuestionBankItem[];
  answers: Record<number, SavedAnswer>;
  currentIndex: number;
  createdAt: number;
  updatedAt: number;
};

const DB_NAME = "learnyfi-offline-practice";
const DB_VERSION = 1;
const STORE_NAME = "practice-sets";

const SUBJECTS: Subject[] = [
  "Mathematics",
  "Biology",
  "English Language",
  "Chemistry",
  "Physics",
];

const EXAMS: ExamType[] = ["JAMB", "WAEC", "NECO"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const QUESTION_COUNTS = [50, 100, 200];

const SUBJECT_STYLES: Record<
  Subject,
  { icon: string; color: string; background: string }
> = {
  Mathematics: {
    icon: "M",
    color: "text-blue-700 dark:text-blue-300",
    background: "bg-blue-100 dark:bg-blue-500/15",
  },
  Biology: {
    icon: "B",
    color: "text-emerald-700 dark:text-emerald-300",
    background: "bg-emerald-100 dark:bg-emerald-500/15",
  },
  "English Language": {
    icon: "E",
    color: "text-violet-700 dark:text-violet-300",
    background: "bg-violet-100 dark:bg-violet-500/15",
  },
  Chemistry: {
    icon: "C",
    color: "text-orange-700 dark:text-orange-300",
    background: "bg-orange-100 dark:bg-orange-500/15",
  },
  Physics: {
    icon: "P",
    color: "text-pink-700 dark:text-pink-300",
    background: "bg-pink-100 dark:bg-pink-500/15",
  },
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("This browser does not support local offline storage."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not open offline storage."));
  });
}

async function getAllStoredSets(): Promise<StoredPracticeSet[]> {
  const db = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).getAll();

      request.onsuccess = () =>
        resolve((request.result ?? []) as StoredPracticeSet[]);
      request.onerror = () =>
        reject(request.error ?? new Error("Could not read saved practice sets."));
    });
  } finally {
    db.close();
  }
}

async function saveStoredSet(
  set: StoredPracticeSet,
): Promise<void> {
  const db = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).put(set);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error("Could not save practice set."));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error("Saving practice set was cancelled."));
    });
  } finally {
    db.close();
  }
}

async function deleteStoredSet(id: string): Promise<void> {
  const db = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error("Could not remove practice set."));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error("Removing practice set was cancelled."));
    });
  } finally {
    db.close();
  }
}

function makeSetId(
  subject: Subject,
  exam: ExamType,
  difficulty: Difficulty,
  count: number,
) {
  return `${subject}-${exam}-${difficulty}-${count}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function getQuestionText(question: QuestionBankItem): string {
  if (question.question?.trim()) {
    return question.question;
  }

  return (question.content ?? [])
    .flatMap((item) => item.segments ?? [])
    .map((segment) => segment.text ?? "")
    .join("")
    .trim();
}

function getCorrectAnswer(
  question: QuestionBankItem,
  selectedOption: string,
): boolean {
  const correctAnswers = (question.correctAnswers ?? []).map((answer) =>
    String(answer).trim().toLowerCase(),
  );

  const option = (question.options ?? []).find(
    (item) =>
      item.label.toLowerCase() === selectedOption.toLowerCase() ||
      item.value.toLowerCase() === selectedOption.toLowerCase(),
  );

  if (!option) return false;

  return correctAnswers.some(
    (answer) =>
      answer === option.label.trim().toLowerCase() ||
      answer === option.value.trim().toLowerCase(),
  );
}

function getStorageSizeInBytes(value: unknown): number {
  try {
    return new Blob([JSON.stringify(value)]).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDifficulty(value: Difficulty): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isQuestionBankItem(value: unknown): value is QuestionBankItem {
  if (!value || typeof value !== "object") return false;

  const question = value as Partial<QuestionBankItem>;

  return (
    Array.isArray(question.options) &&
    question.options.length > 0 &&
    Array.isArray(question.correctAnswers) &&
    (
      typeof question.question === "string" ||
      Array.isArray(question.content)
    )
  );
}

export default function OfflinePracticePage() {
  const [sets, setSets] = useState<StoredPracticeSet[]>([]);
  const [loadingSavedSets, setLoadingSavedSets] = useState(true);
  const [activeTab, setActiveTab] = useState<"downloaded" | "available">(
    "downloaded",
  );
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");

  const [showDownload, setShowDownload] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<Subject>("Biology");
  const [selectedExam, setSelectedExam] = useState<ExamType>("JAMB");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("easy");
  const [questionCount, setQuestionCount] = useState(100);

  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState("");
  const [selectedPractice, setSelectedPractice] =
    useState<StoredPracticeSet | null>(null);
  const [notice, setNotice] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const refreshSets = useCallback(async () => {
    setLoadingSavedSets(true);

    try {
      const saved = await getAllStoredSets();

      saved.sort((a, b) => b.updatedAt - a.updatedAt);
      setSets(saved);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not load saved practice sets.",
      );
    } finally {
      setLoadingSavedSets(false);
    }
  }, []);

  useEffect(() => {
    void refreshSets();
  }, [refreshSets]);

  const downloadedSets = sets;

  const storageUsedBytes = useMemo(
    () => sets.reduce((total, set) => total + getStorageSizeInBytes(set), 0),
    [sets],
  );

  const answeredCount = useMemo(
    () =>
      sets.reduce(
        (total, set) => total + Object.keys(set.answers ?? {}).length,
        0,
      ),
    [sets],
  );

  const visibleSets = useMemo(() => {
    return sets.filter((set) => {
      const matchesTab = activeTab === "downloaded";

      const matchesSubject =
        subjectFilter === "All subjects" || set.subject === subjectFilter;

      const matchesSearch =
        `${set.subject} ${set.exam} ${set.difficulty}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesTab && matchesSubject && matchesSearch;
    });
  }, [sets, activeTab, subjectFilter, search]);

  const availableSubjectOptions = useMemo(() => {
    const present = new Set(sets.map((set) => set.subject));
    return SUBJECTS.filter((subject) => present.has(subject));
  }, [sets]);

  const currentQuestion =
    selectedPractice?.questions[selectedPractice.currentIndex];

  const currentAnswer = selectedPractice
    ? selectedPractice.answers[selectedPractice.currentIndex]
    : undefined;

  const practiceProgress = selectedPractice
    ? Math.round(
        (Object.keys(selectedPractice.answers).length /
          Math.max(1, selectedPractice.questions.length)) *
          100,
      )
    : 0;

  async function downloadSet() {
    if (downloading) return;

    setDownloading(true);
    setDownloadProgress("Loading the selected question bank…");
    setNotice("");

    try {
      if (selectedExam !== "JAMB") {
        throw new Error(
          "The current question-bank registry only confirms JAMB banks. Add the relevant WAEC or NECO banks to the registry before downloading those exams.",
        );
      }

      // Load the question registry only when a student requests a download.
      const registry = await import(
        "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions"
      );

      const bankExam = selectedExam.toLowerCase() as BankExamType;

      const banks = registry.getQuestionBanks(
        selectedSubject,
        bankExam,
      );

      const difficultyQuestions = banks[selectedDifficulty] ?? [];

      if (!difficultyQuestions.length) {
        throw new Error(
          `No ${formatDifficulty(selectedDifficulty)} ${selectedExam} ${selectedSubject} questions are registered. Check the question-bank imports and registry.`,
        );
      }

      // Avoid saving a subject's questions under another subject name.
      // The current registry contains several imports that point to Biology.
      const expectedSubject = selectedSubject
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      const subjectNames = difficultyQuestions
        .map((question) =>
          String(question.apiSubjectName ?? "").toLowerCase().replace(/[^a-z0-9]/g, ""),
        )
        .filter(Boolean);

      if (
        subjectNames.length > 0 &&
        !subjectNames.some((name) => name.includes(expectedSubject))
      ) {
        throw new Error(
          `The registered ${selectedSubject} bank appears to contain questions for a different subject. Correct the imports in questions/index.ts before downloading it.`,
        );
      }

      const validQuestions = difficultyQuestions.filter(isQuestionBankItem);

      if (validQuestions.length === 0) {
        throw new Error(
          "The selected bank contains no valid multiple-choice questions.",
        );
      }

      if (validQuestions.length < questionCount) {
        throw new Error(
          `Only ${validQuestions.length} valid questions are available in this bank. Choose ${Math.min(50, validQuestions.length)} or add more questions to the bank.`,
        );
      }

      setDownloadProgress("Preparing questions for offline use…");

      const shuffled = [...validQuestions];

      // Randomize the downloaded selection without modifying the source bank.
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const selectedQuestions = shuffled.slice(0, questionCount);
      const id = makeSetId(
        selectedSubject,
        selectedExam,
        selectedDifficulty,
        questionCount,
      );

      const existing = sets.find((set) => set.id === id);

      const now = Date.now();

      const storedSet: StoredPracticeSet = {
        id,
        subject: selectedSubject,
        exam: selectedExam,
        difficulty: selectedDifficulty,
        questions: selectedQuestions,
        answers: existing?.answers ?? {},
        currentIndex: existing?.currentIndex ?? 0,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      setDownloadProgress("Saving questions on this device…");
      await saveStoredSet(storedSet);
      await refreshSets();

      setActiveTab("downloaded");
      setSubjectFilter("All subjects");
      setSearch("");
      setShowDownload(false);
      setNotice(
        `${selectedQuestions.length} ${selectedSubject} questions were saved on this device for offline practice.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Download failed. Please check the question bank and try again.",
      );
    } finally {
      setDownloading(false);
      setDownloadProgress("");
    }
  }

  async function removeSet(set: StoredPracticeSet) {
    const confirmed = window.confirm(
      `Remove the downloaded ${set.exam} ${set.subject} set? Its saved answers and progress will also be deleted from this device.`,
    );

    if (!confirmed) return;

    setRemovingId(set.id);

    try {
      await deleteStoredSet(set.id);
      setSets((current) => current.filter((item) => item.id !== set.id));

      if (selectedPractice?.id === set.id) {
        setSelectedPractice(null);
      }

      setNotice(`${set.subject} practice set removed from this device.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not remove this set.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  function openPractice(set: StoredPracticeSet) {
    setSelectedPractice(set);
    setSelectedAnswer(set.answers[set.currentIndex]?.selectedOption ?? "");
    setShowAnswerFeedback(Boolean(set.answers[set.currentIndex]));
    setShowExplanation(false);
  }

  async function savePracticeProgress(
    updated: StoredPracticeSet,
  ) {
    const next = { ...updated, updatedAt: Date.now() };

    await saveStoredSet(next);
    setSelectedPractice(next);

    setSets((current) =>
      current.map((item) => (item.id === next.id ? next : item)),
    );
  }

  async function submitAnswer() {
    if (!selectedPractice || !currentQuestion || !selectedAnswer) return;

    const correct = getCorrectAnswer(currentQuestion, selectedAnswer);

    const answer: SavedAnswer = {
      questionIndex: selectedPractice.currentIndex,
      selectedOption: selectedAnswer,
      correct,
    };

    const updated: StoredPracticeSet = {
      ...selectedPractice,
      answers: {
        ...selectedPractice.answers,
        [selectedPractice.currentIndex]: answer,
      },
    };

    try {
      await savePracticeProgress(updated);
      setShowAnswerFeedback(true);
      setShowExplanation(false);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not save your answer locally.",
      );
    }
  }

  async function goToQuestion(nextIndex: number) {
    if (!selectedPractice) return;

    const boundedIndex = Math.max(
      0,
      Math.min(nextIndex, selectedPractice.questions.length - 1),
    );

    const updated = {
      ...selectedPractice,
      currentIndex: boundedIndex,
    };

    try {
      await savePracticeProgress(updated);
      setSelectedAnswer(
        updated.answers[boundedIndex]?.selectedOption ?? "",
      );
      setShowAnswerFeedback(Boolean(updated.answers[boundedIndex]));
      setShowExplanation(false);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not save your practice position.",
      );
    }
  }

  const isCorrectCurrentAnswer =
    currentAnswer?.correct === true;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/student/practice"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Practice
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <WifiOff className="h-3.5 w-3.5" />
              Offline Practice Centre
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Practise anywhere.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Download real questions from your registered question banks.
              Your downloaded sets and answers are stored on this device, so
              you can continue practising without an internet connection.
            </p>
          </div>

          <button
            onClick={() => {
              setNotice("");
              setShowDownload(true);
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Download questions
          </button>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <WifiOff className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold">
                Your learning goes with you.
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Choose a subject, difficulty and question count. Downloaded
                questions and your answers remain on this device until you
                remove the set or clear the browser's site data.
              </p>

              <button
                onClick={() => setShowDownload(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 sm:flex">
              <BookOpen className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Downloaded sets
              </span>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {loadingSavedSets ? "…" : downloadedSets.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Saved in this browser
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Answers saved
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {loadingSavedSets ? "…" : answeredCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Answers saved locally
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Storage used
              </span>
              <HardDrive className="h-5 w-5 text-violet-500" />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {formatBytes(storageUsedBytes)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Estimated saved data size
            </p>
          </Card>
        </div>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                My practice sets
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Open downloaded questions and continue where you stopped.
              </p>
            </div>

            <button
              onClick={() => setShowDownload(true)}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <Download className="h-4 w-4" />
              Add practice set
            </button>
          </div>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.03]">
              <button
                onClick={() => setActiveTab("downloaded")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "downloaded"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Downloaded ({downloadedSets.length})
              </button>

              <button
                onClick={() => setActiveTab("available")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "available"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Available sets
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search downloaded sets..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.03]"
                />
              </div>

              <select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-900"
              >
                <option>All subjects</option>
                {availableSubjectOptions.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {activeTab === "available" && (
            <Card className="mb-4 border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              Choose <strong>Download questions</strong> to fetch a set from
              the registered question banks. The available subjects depend on
              the actual imports configured in your question registry.
            </Card>
          )}

          {loadingSavedSets ? (
            <Card className="flex items-center justify-center gap-3 border-slate-200 bg-white p-12 dark:border-white/10 dark:bg-white/[0.03]">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm text-slate-500">
                Loading locally saved question sets…
              </span>
            </Card>
          ) : visibleSets.length === 0 ? (
            <Card className="flex flex-col items-center justify-center border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.02]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
                <BookOpen className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold">
                {activeTab === "available"
                  ? "No separate catalogue yet"
                  : "No downloaded practice sets"}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                {activeTab === "available"
                  ? "Use Download questions to select a real question bank and save a set on this device."
                  : "Download a question set to start practising offline. Your saved sets will appear here."}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSubjectFilter("All subjects");
                  setShowDownload(true);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download questions
              </button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleSets.map((set) => {
                const style = SUBJECT_STYLES[set.subject];
                const completed = Object.keys(set.answers ?? {}).length;
                const progress = Math.round(
                  (completed / Math.max(1, set.questions.length)) * 100,
                );
                const correct = Object.values(set.answers ?? {}).filter(
                  (answer) => answer.correct,
                ).length;

                return (
                  <Card
                    key={set.id}
                    className="overflow-hidden border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${style.background} ${style.color}`}
                      >
                        {style.icon}
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <Check className="h-3.5 w-3.5" />
                        Saved offline
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {set.exam} {set.subject}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>{set.questions.length} questions</span>
                      <span>·</span>
                      <span>{formatDifficulty(set.difficulty)}</span>
                      <span>·</span>
                      <span>{formatBytes(getStorageSizeInBytes(set))}</span>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          Progress · {completed}/{set.questions.length}
                        </span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {correct} correct answers saved
                      </p>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => openPractice(set)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Play className="h-4 w-4" />
                        {completed > 0 ? "Continue practice" : "Start practice"}
                      </button>

                      <button
                        onClick={() => void removeSet(set)}
                        disabled={removingId === set.id}
                        aria-label={`Remove ${set.subject} download`}
                        title="Remove download"
                        className="rounded-lg border border-slate-200 px-3 text-slate-500 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50 dark:border-white/10"
                      >
                        {removingId === set.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/15">
              <HardDrive className="h-5 w-5 text-violet-600 dark:text-violet-300" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <h3 className="font-bold">Offline storage on this device</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formatBytes(storageUsedBytes)}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{
                    width: `${Math.min(
                      (storageUsedBytes / (100 * 1024 * 1024)) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                This measures the estimated size of the saved question data,
                not all browser storage. Your browser can still clear local
                data, and this implementation does not synchronize answers
                to your account or another device.
              </p>
            </div>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200"
          >
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {showDownload && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-950/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !downloading) {
              setShowDownload(false);
            }
          }}
        >
          <div
  role="dialog"
  aria-modal="true"
  aria-labelledby="download-dialog-title"
  className="my-0 max-h-[calc(100dvh-1rem-env(safe-area-inset-bottom))] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:my-auto sm:max-h-[95vh] sm:p-7"
>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/15">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h2 id="download-dialog-title" className="text-xl font-bold">
                  Download practice set
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Choose a registered question bank and save questions locally.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!downloading) setShowDownload(false);
                }}
                disabled={downloading}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  disabled={downloading}
                  onChange={(event) =>
                    setSelectedSubject(event.target.value as Subject)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800"
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Examination type
                </label>
                <select
                  value={selectedExam}
                  disabled={downloading}
                  onChange={(event) =>
                    setSelectedExam(event.target.value as ExamType)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800"
                >
                  {EXAMS.map((exam) => (
                    <option key={exam} value={exam}>
                      {exam}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTIES.map((difficulty) => (
                    <button
                      key={difficulty}
                      type="button"
                      disabled={downloading}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                        selectedDifficulty === difficulty
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-300"
                          : "border-slate-200 hover:border-blue-300 dark:border-white/10"
                      }`}
                    >
                      {formatDifficulty(difficulty)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold">
                  Number of questions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {QUESTION_COUNTS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      disabled={downloading}
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-xl border px-3 py-4 text-center transition ${
                        questionCount === count
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-300"
                          : "border-slate-200 hover:border-blue-300 dark:border-white/10"
                      }`}
                    >
                      <span className="block text-xl font-bold">{count}</span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        Questions
                      </span>
                      {count === 100 && (
                        <span className="mt-2 block text-[10px] font-bold uppercase tracking-wide">
                          Recommended
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${SUBJECT_STYLES[selectedSubject].background} ${SUBJECT_STYLES[selectedSubject].color}`}
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {selectedExam} {selectedSubject}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatDifficulty(selectedDifficulty)} · {questionCount}{" "}
                      questions
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                </div>
              </div>

              {downloading && (
                <div
                  role="status"
                  className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-500/10 dark:text-blue-200"
                >
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  {downloadProgress}
                </div>
              )}

              <button
                onClick={() => void downloadSet()}
                disabled={downloading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloading ? "Preparing download…" : "Download practice set"}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                Questions are selected from your existing frontend registry
                and saved in this browser's IndexedDB.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedPractice && currentQuestion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-dialog-title"
            className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <WifiOff className="h-3.5 w-3.5" />
                  Saved offline
                </span>

                <h2
                  id="practice-dialog-title"
                  className="mt-3 text-xl font-bold"
                >
                  {selectedPractice.exam} {selectedPractice.subject}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {formatDifficulty(selectedPractice.difficulty)} · Question{" "}
                  {selectedPractice.currentIndex + 1} of{" "}
                  {selectedPractice.questions.length}
                </p>
              </div>

              <button
                onClick={() => setSelectedPractice(null)}
                aria-label="Close practice"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    ((selectedPractice.currentIndex + 1) /
                      selectedPractice.questions.length) *
                    100
                  }%`,
                }}
              />
            </div>

            {currentQuestion.instruction && (
              <p className="mt-6 text-sm font-medium text-blue-700 dark:text-blue-300">
                {currentQuestion.instruction}
              </p>
            )}

            <div className="mt-5 whitespace-pre-wrap text-base font-semibold leading-8 sm:text-lg">
              {getQuestionText(currentQuestion) || "Question text unavailable."}
            </div>

            {(currentQuestion.content ?? []).some(
              (item) => item.table?.length,
            ) && (
              <div className="mt-4 space-y-4">
                {(currentQuestion.content ?? []).map((item, itemIndex) =>
                  item.table?.length ? (
                    <div key={itemIndex} className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <tbody>
                          {item.table.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="border border-slate-200 p-2 dark:border-white/10"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null,
                )}
              </div>
            )}

            <div className="mt-6 space-y-3">
              {(currentQuestion.options ?? []).map((option, index) => {
                const optionKey = option.value || option.label;
                const isSelected = selectedAnswer === optionKey;
                const isSavedAnswer =
                  currentAnswer?.selectedOption === optionKey;

                let optionStyle =
                  "border-slate-200 hover:border-blue-300 dark:border-white/10";

                if (isSelected) {
                  optionStyle =
                    "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10 dark:bg-blue-500/10";
                }

                if (showAnswerFeedback && isSavedAnswer) {
                  optionStyle = currentAnswer?.correct
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                    : "border-red-400 bg-red-50 dark:bg-red-500/10";
                }

                return (
                  <button
                    key={`${option.label}-${index}`}
                    type="button"
                    disabled={showAnswerFeedback}
                    onClick={() => setSelectedAnswer(optionKey)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition disabled:cursor-default ${optionStyle}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-white/10">
                      {option.label || String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap pt-1 leading-6">
                      {option.value}
                    </span>
                    {showAnswerFeedback && isSavedAnswer && (
                      currentAnswer?.correct ? (
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                      ) : (
                        <X className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                      )
                    )}
                  </button>
                );
              })}
            </div>

            {showAnswerFeedback && (
              <div
                className={`mt-5 rounded-xl p-4 text-sm leading-6 ${
                  isCorrectCurrentAnswer
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
                    : "bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200"
                }`}
              >
                <p className="font-bold">
                  {isCorrectCurrentAnswer ? "Correct answer!" : "Answer saved"}
                </p>

                {!isCorrectCurrentAnswer && (
                  <p className="mt-1">
                    Review the explanation before moving to the next question.
                  </p>
                )}

                {currentQuestion.explanation && (
                  <button
                    type="button"
                    onClick={() => setShowExplanation((current) => !current)}
                    className="mt-3 font-semibold underline underline-offset-2"
                  >
                    {showExplanation ? "Hide explanation" : "Show explanation"}
                  </button>
                )}

                {showExplanation && currentQuestion.explanation && (
                  <p className="mt-2 whitespace-pre-wrap">
                    {currentQuestion.explanation}
                  </p>
                )}

                {showExplanation &&
                  currentQuestion.explanationSteps?.length > 0 && (
                    <ol className="mt-3 list-decimal space-y-1 pl-5">
                      {currentQuestion.explanationSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  )}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                type="button"
                disabled={selectedPractice.currentIndex === 0}
                onClick={() =>
                  void goToQuestion(selectedPractice.currentIndex - 1)
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {!showAnswerFeedback ? (
                <button
                  type="button"
                  disabled={!selectedAnswer}
                  onClick={() => void submitAnswer()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Check answer
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              ) : selectedPractice.currentIndex <
                selectedPractice.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    void goToQuestion(selectedPractice.currentIndex + 1)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Next question
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedPractice(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finish practice
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
              <span>
                {Object.keys(selectedPractice.answers).length} of{" "}
                {selectedPractice.questions.length} answered
              </span>
              <span>{practiceProgress}% complete</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

