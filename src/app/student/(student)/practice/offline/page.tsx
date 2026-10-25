
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  HardDrive,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Trash2,
  Trophy,
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
type PracticeMode = "normal" | "timed";

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
const STORE_NAME = "practice-sets";
const DB_VERSION = 2;
const SECONDS_PER_QUESTION = 60;

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

/* ============================================================
   INDEXEDDB

   The database is upgraded if the expected object store is
   missing. Existing stores and saved records are preserved.
============================================================ */

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("This browser does not support offline storage."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Could not open offline storage."));
    };

    request.onblocked = () => {
      reject(
        new Error(
          "Offline storage is blocked by another open Learnyfi tab. Close other tabs and try again.",
        ),
      );
    };

    request.onsuccess = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // A database can already exist without the expected store.
        // Upgrade it rather than attempting an invalid transaction.
        const nextVersion = db.version + 1;
        db.close();

        const upgradeRequest = window.indexedDB.open(DB_NAME, nextVersion);

        upgradeRequest.onupgradeneeded = () => {
          const upgradedDb = upgradeRequest.result;

          if (!upgradedDb.objectStoreNames.contains(STORE_NAME)) {
            upgradedDb.createObjectStore(STORE_NAME, { keyPath: "id" });
          }
        };

        upgradeRequest.onerror = () => {
          reject(
            upgradeRequest.error ??
              new Error("Could not repair offline storage."),
          );
        };

        upgradeRequest.onblocked = () => {
          reject(
            new Error(
              "Database upgrade is blocked. Close other Learnyfi tabs and reload this page.",
            ),
          );
        };

        upgradeRequest.onsuccess = () => {
          const upgradedDb = upgradeRequest.result;

          if (!upgradedDb.objectStoreNames.contains(STORE_NAME)) {
            upgradedDb.close();
            reject(
              new Error(
                'The offline "practice-sets" store could not be initialized.',
              ),
            );
            return;
          }

          upgradedDb.onversionchange = () => upgradedDb.close();
          resolve(upgradedDb);
        };

        return;
      }

      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

async function getAllStoredSets(): Promise<StoredPracticeSet[]> {
  const db = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).getAll();

      request.onsuccess = () => {
        resolve((request.result ?? []) as StoredPracticeSet[]);
      };

      request.onerror = () => {
        reject(
          request.error ?? new Error("Could not read saved practice sets."),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error("Loading downloaded questions was interrupted."),
        );
      };
    });
  } finally {
    db.close();
  }
}

async function saveStoredSet(set: StoredPracticeSet): Promise<void> {
  const db = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(set);

      transaction.oncomplete = () => resolve();

      transaction.onerror = () => {
        reject(transaction.error ?? new Error("Could not save practice set."));
      };

      transaction.onabort = () => {
        reject(
          transaction.error ?? new Error("Saving practice set was cancelled."),
        );
      };
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

      transaction.onerror = () => {
        reject(
          transaction.error ?? new Error("Could not remove practice set."),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ?? new Error("Removing practice set was cancelled."),
        );
      };
    });
  } finally {
    db.close();
  }
}

/* ============================================================
   HELPERS
============================================================ */

function makeSetId(
  subject: Subject,
  exam: ExamType,
  difficulty: Difficulty,
  count: number,
): string {
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

function getCorrectOption(
  question: QuestionBankItem,
): string | undefined {
  const correctAnswers = (question.correctAnswers ?? []).map((answer) =>
    String(answer).trim().toLowerCase(),
  );

  const option = (question.options ?? []).find((item) =>
    correctAnswers.some(
      (answer) =>
        answer === item.label.trim().toLowerCase() ||
        answer === item.value.trim().toLowerCase(),
    ),
  );

  return option?.label;
}

function isCorrectAnswer(
  question: QuestionBankItem,
  selectedOption: string,
): boolean {
  if (!selectedOption) return false;

  const selected = (question.options ?? []).find(
    (option) =>
      option.label.trim().toLowerCase() ===
        selectedOption.trim().toLowerCase() ||
      option.value.trim().toLowerCase() ===
        selectedOption.trim().toLowerCase(),
  );

  if (!selected) return false;

  const correctAnswers = (question.correctAnswers ?? []).map((answer) =>
    String(answer).trim().toLowerCase(),
  );

  return correctAnswers.some(
    (answer) =>
      answer === selected.label.trim().toLowerCase() ||
      answer === selected.value.trim().toLowerCase(),
  );
}

function isQuestionBankItem(value: unknown): value is QuestionBankItem {
  if (!value || typeof value !== "object") return false;

  const question = value as Partial<QuestionBankItem>;

  return (
    Array.isArray(question.options) &&
    question.options.length > 0 &&
    Array.isArray(question.correctAnswers) &&
    (typeof question.question === "string" ||
      Array.isArray(question.content))
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
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function formatDifficulty(value: Difficulty): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* ============================================================
   PAGE
============================================================ */

export default function OfflinePracticePage() {
  const [sets, setSets] = useState<StoredPracticeSet[]>([]);
  const [loadingSavedSets, setLoadingSavedSets] = useState(true);

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
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [selectedPractice, setSelectedPractice] =
    useState<StoredPracticeSet | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("normal");
  const [normalIndex, setNormalIndex] = useState(0);
  const [normalAnswers, setNormalAnswers] = useState<
    Record<number, SavedAnswer>
  >({});
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [timedAnswers, setTimedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timedStarted, setTimedStarted] = useState(false);
  const [timedFinished, setTimedFinished] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [notice, setNotice] = useState("");

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

  const storageUsedBytes = useMemo(
    () => sets.reduce((total, set) => total + getStorageSizeInBytes(set), 0),
    [sets],
  );

  const visibleSets = useMemo(
    () =>
      sets.filter((set) => {
        const matchesSubject =
          subjectFilter === "All subjects" || set.subject === subjectFilter;

        const matchesSearch =
          `${set.subject} ${set.exam} ${set.difficulty}`
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchesSubject && matchesSearch;
      }),
    [sets, subjectFilter, search],
  );

  const currentQuestion =
    selectedPractice?.questions[
      practiceMode === "normal" ? normalIndex : normalIndex
    ];

  const currentNormalAnswer = normalAnswers[normalIndex];
  const currentTimedAnswer = timedAnswers[normalIndex];

  const normalAnsweredCount = Object.keys(normalAnswers).length;
  const timedAnsweredCount = Object.values(timedAnswers).filter(Boolean).length;

  const totalQuestions = selectedPractice?.questions.length ?? 0;
  const timedDuration = totalQuestions * SECONDS_PER_QUESTION;

  const timedScore = useMemo(() => {
    if (!selectedPractice) return 0;

    return selectedPractice.questions.reduce((score, question, index) => {
      return score + (isCorrectAnswer(question, timedAnswers[index] ?? "") ? 1 : 0);
    }, 0);
  }, [selectedPractice, timedAnswers]);

  const timedPercentage =
    totalQuestions > 0 ? Math.round((timedScore / totalQuestions) * 100) : 0;

  /* ---------------- Download question set ---------------- */

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

      const registry = await import(
        "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions"
      );

      const bankExam = selectedExam.toLowerCase() as BankExamType;
      const banks = registry.getQuestionBanks(selectedSubject, bankExam);
      const difficultyQuestions = banks[selectedDifficulty] ?? [];

      if (!difficultyQuestions.length) {
        throw new Error(
          `No ${formatDifficulty(selectedDifficulty)} ${selectedExam} ${selectedSubject} questions are registered. Check the question-bank imports and registry.`,
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
          `Only ${validQuestions.length} valid questions are available. Choose a smaller set or add more questions to the bank.`,
        );
      }

      setDownloadProgress("Preparing questions for offline use…");

      const shuffled = [...validQuestions];

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

  /* ---------------- Open normal practice ---------------- */

  function openNormalPractice(set: StoredPracticeSet) {
    setSelectedPractice(set);
    setPracticeMode("normal");
    setNormalIndex(set.currentIndex ?? 0);
    setNormalAnswers(set.answers ?? {});
    setSelectedAnswer(
      set.answers?.[set.currentIndex]?.selectedOption ?? "",
    );
    setShowAnswerFeedback(Boolean(set.answers?.[set.currentIndex]));
    setShowExplanation(false);

    setTimedAnswers({});
    setTimedStarted(false);
    setTimedFinished(false);
    setConfirmFinish(false);
    setTimeLeft(0);
    setNotice("");
  }

  function chooseNormalAnswer(optionLabel: string) {
    if (!selectedPractice) return;

    setSelectedAnswer(optionLabel);
    setShowAnswerFeedback(false);
    setShowExplanation(false);
  }

  async function checkNormalAnswer() {
    if (!selectedPractice || !selectedAnswer) return;

    const correct = isCorrectAnswer(
      selectedPractice.questions[normalIndex],
      selectedAnswer,
    );

    const updatedAnswers: Record<number, SavedAnswer> = {
      ...normalAnswers,
      [normalIndex]: {
        questionIndex: normalIndex,
        selectedOption: selectedAnswer,
        correct,
      },
    };

    setNormalAnswers(updatedAnswers);
    setShowAnswerFeedback(true);

    const updatedSet: StoredPracticeSet = {
      ...selectedPractice,
      answers: updatedAnswers,
      currentIndex: normalIndex,
      updatedAt: Date.now(),
    };

    setSelectedPractice(updatedSet);

    try {
      await saveStoredSet(updatedSet);
      setSets((previous) =>
        previous.map((set) => (set.id === updatedSet.id ? updatedSet : set)),
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Your answer could not be saved locally.",
      );
    }
  }

  function moveNormalQuestion(nextIndex: number) {
    if (!selectedPractice) return;

    const boundedIndex = Math.max(
      0,
      Math.min(nextIndex, selectedPractice.questions.length - 1),
    );

    setNormalIndex(boundedIndex);
    setSelectedAnswer(normalAnswers[boundedIndex]?.selectedOption ?? "");
    setShowAnswerFeedback(Boolean(normalAnswers[boundedIndex]));
    setShowExplanation(false);
  }

  /* ---------------- Timed practice ---------------- */

  function startTimedPractice(set: StoredPracticeSet) {
    if (!set.questions.length) {
      setNotice("This practice set contains no questions.");
      return;
    }

    setSelectedPractice(set);
    setPracticeMode("timed");
    setNormalIndex(0);
    setNormalAnswers({});
    setSelectedAnswer("");
    setShowAnswerFeedback(false);
    setShowExplanation(false);

    setTimedAnswers({});
    setTimeLeft(set.questions.length * SECONDS_PER_QUESTION);
    setTimedStarted(true);
    setTimedFinished(false);
    setConfirmFinish(false);
    setNotice("");
  }

  function chooseTimedAnswer(optionLabel: string) {
    if (!timedStarted || timedFinished) return;

    setTimedAnswers((previous) => ({
      ...previous,
      [normalIndex]: optionLabel,
    }));
  }

  const finishTimedPractice = useCallback(
    (expired = false) => {
      if (!selectedPractice || practiceMode !== "timed" || timedFinished) {
        return;
      }

      setTimedStarted(false);
      setTimedFinished(true);
      setConfirmFinish(false);

      setNotice(
        expired
          ? "Time is up. Your timed practice has been submitted."
          : "Timed practice submitted successfully.",
      );
    },
    [selectedPractice, practiceMode, timedFinished],
  );

  useEffect(() => {
    if (!timedStarted || timedFinished || practiceMode !== "timed") return;

    const interval = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timedStarted, timedFinished, practiceMode]);

  useEffect(() => {
    if (
      timedStarted &&
      timeLeft <= 0 &&
      !timedFinished &&
      practiceMode === "timed"
    ) {
      finishTimedPractice(true);
    }
  }, [
    timedStarted,
    timeLeft,
    timedFinished,
    practiceMode,
    finishTimedPractice,
  ]);

  function closePractice() {
    setSelectedPractice(null);
    setPracticeMode("normal");
    setTimedStarted(false);
    setTimedFinished(false);
    setConfirmFinish(false);
    setTimeLeft(0);
    setTimedAnswers({});
    setNotice("");
  }

  async function removeSet(set: StoredPracticeSet) {
    const confirmed = window.confirm(
      `Remove the downloaded ${set.subject} question set? This also removes its saved normal-practice progress.`,
    );

    if (!confirmed) return;

    setRemovingId(set.id);
    setNotice("");

    try {
      await deleteStoredSet(set.id);
      setSets((previous) => previous.filter((item) => item.id !== set.id));

      if (selectedPractice?.id === set.id) {
        closePractice();
      }

      setNotice(`${set.subject} question set removed from this device.`);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not remove the downloaded question set.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  /* ---------------- Shared question display ---------------- */

  function renderQuestion(question: QuestionBankItem) {
    const questionText = getQuestionText(question);

    return (
      <>
        {question.instruction && (
          <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            {question.instruction}
          </p>
        )}

        <h2 className="whitespace-pre-wrap text-lg font-semibold leading-8 sm:text-xl">
          {questionText || "Question text unavailable"}
        </h2>
      </>
    );
  }

  function renderExplanation(question: QuestionBankItem) {
    const explanation = question.explanation;
    const explanationText =
      typeof explanation === "string" ? explanation : "";

    const explanationSteps = Array.isArray(question.explanationSteps)
      ? question.explanationSteps
      : [];

    if (!explanationText && explanationSteps.length === 0) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No explanation was provided for this question.
        </p>
      );
    }

    return (
      <div className="space-y-3 text-sm leading-6">
        {explanationText && <p className="whitespace-pre-wrap">{explanationText}</p>}

        {explanationSteps.map((step, index) => (
          <p key={index} className="whitespace-pre-wrap">
            {typeof step === "string" ? step : JSON.stringify(step)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/student/practice"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Practice
        </Link>

        {!selectedPractice && (
          <>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <WifiOff className="h-4 w-4" />
                  Available offline
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Offline Practice
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                  Download question sets once, then practise without an
                  internet connection. Choose normal practice for immediate
                  feedback or timed practice to test yourself.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDownload(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download questions
              </button>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <HardDrive className="mb-3 h-6 w-6 text-blue-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Downloaded sets
                </p>
                <p className="mt-1 text-2xl font-bold">{sets.length}</p>
              </Card>

              <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <BookOpen className="mb-3 h-6 w-6 text-violet-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Questions available
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {sets.reduce((sum, set) => sum + set.questions.length, 0)}
                </p>
              </Card>

              <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <HardDrive className="mb-3 h-6 w-6 text-emerald-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Storage used
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {formatBytes(storageUsedBytes)}
                </p>
              </Card>
            </div>

            {notice && (
              <div
                role="status"
                className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200"
              >
                <span>{notice}</span>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search downloaded sets..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/[0.03]"
                />
              </div>

              <select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-900"
              >
                <option>All subjects</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {loadingSavedSets ? (
              <Card className="p-10 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-blue-600" />
                <p className="text-sm text-slate-500">
                  Loading downloaded questions...
                </p>
              </Card>
            ) : visibleSets.length === 0 ? (
              <Card className="flex flex-col items-center border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.02]">
                <BookOpen className="mb-4 h-10 w-10 text-slate-400" />
                <h2 className="text-xl font-bold">
                  {sets.length === 0
                    ? "No downloaded questions yet"
                    : "No matching question sets"}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {sets.length === 0
                    ? "Download a question set to start practising offline. Your downloaded questions will be saved on this device."
                    : "Try a different search term or subject filter."}
                </p>
                {sets.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowDownload(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Download questions
                  </button>
                )}
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleSets.map((set) => {
                  const style = SUBJECT_STYLES[set.subject];
                  const savedCount = Object.keys(set.answers ?? {}).length;

                  return (
                    <Card
                      key={set.id}
                      className="flex flex-col border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${style.background} ${style.color}`}
                        >
                          {style.icon}
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <WifiOff className="h-3 w-3" />
                          Offline
                        </span>
                      </div>

                      <h2 className="text-lg font-bold">{set.subject}</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {set.exam} · {formatDifficulty(set.difficulty)}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/[0.04]">
                        <div>
                          <p className="text-xs text-slate-500">Questions</p>
                          <p className="mt-1 font-bold">
                            {set.questions.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Normal progress
                          </p>
                          <p className="mt-1 font-bold">
                            {savedCount}/{set.questions.length}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-2">
                        <button
                          type="button"
                          onClick={() => openNormalPractice(set)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Play className="h-4 w-4" />
                          Normal practice
                        </button>

                        <button
                          type="button"
                          onClick={() => startTimedPractice(set)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-500/10"
                        >
                          <Clock3 className="h-4 w-4" />
                          Timed practice
                        </button>

                        <button
                          type="button"
                          disabled={removingId === set.id}
                          onClick={() => void removeSet(set)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-300 dark:hover:bg-red-500/10"
                        >
                          {removingId === set.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Remove download
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* DOWNLOAD MODAL */}
        {showDownload && !selectedPractice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
            <Card
              role="dialog"
              aria-modal="true"
              aria-labelledby="download-title"
              className="my-6 w-full max-w-xl border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900 sm:p-7"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                    <Download className="h-5 w-5" />
                  </div>
                  <h2 id="download-title" className="text-xl font-bold">
                    Download questions
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Save a question set to this device.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => setShowDownload(false)}
                  aria-label="Close download dialog"
                  className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(event) =>
                      setSelectedSubject(event.target.value as Subject)
                    }
                    disabled={downloading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950"
                  >
                    {SUBJECTS.map((subject) => (
                      <option key={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Examination
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXAMS.map((exam) => (
                      <button
                        key={exam}
                        type="button"
                        disabled={downloading}
                        onClick={() => setSelectedExam(exam)}
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                          selectedExam === exam
                            ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                            : "border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
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
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                          selectedDifficulty === difficulty
                            ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                            : "border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {formatDifficulty(difficulty)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Number of questions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {QUESTION_COUNTS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        disabled={downloading}
                        onClick={() => setQuestionCount(count)}
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                          questionCount === count
                            ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                            : "border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {downloadProgress && (
                  <div
                    role="status"
                    className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-500/10 dark:text-blue-200"
                  >
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                    {downloadProgress}
                  </div>
                )}

                {notice && (
                  <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                    {notice}
                  </p>
                )}

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => void downloadSet()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  {downloading ? "Downloading..." : "Download question set"}
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* PRACTICE AREA */}
        {selectedPractice && currentQuestion && (
          <>
            {practiceMode === "normal" && (
              <>
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <button
                      type="button"
                      onClick={closePractice}
                      className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to downloaded sets
                    </button>

                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      <BookOpen className="h-4 w-4" />
                      Normal practice
                    </div>

                    <h1 className="text-2xl font-bold sm:text-3xl">
                      {selectedPractice.subject}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {selectedPractice.exam} · Question {normalIndex + 1} of{" "}
                      {totalQuestions}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Questions answered
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      {normalAnsweredCount}/{totalQuestions}
                    </p>
                  </div>
                </div>

                <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${
                        (normalAnsweredCount / Math.max(1, totalQuestions)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-white/10">
                      Question {normalIndex + 1}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {currentNormalAnswer ? "Answered" : "Not answered"}
                    </span>
                  </div>

                  {renderQuestion(currentQuestion)}

                  <div className="mt-7 space-y-3">
                    {(currentQuestion.options ?? []).map((option, index) => {
                      const isSelected = selectedAnswer === option.label;
                      const correct = isCorrectAnswer(
                        currentQuestion,
                        option.label,
                      );

                      let optionStyle =
                        "border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]";

                      if (showAnswerFeedback && correct) {
                        optionStyle =
                          "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
                      } else if (showAnswerFeedback && isSelected && !correct) {
                        optionStyle =
                          "border-red-400 bg-red-50 dark:bg-red-500/10";
                      } else if (isSelected) {
                        optionStyle =
                          "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-500/10";
                      }

                      return (
                        <button
                          key={`${normalIndex}-${option.label}-${index}`}
                          type="button"
                          disabled={showAnswerFeedback}
                          onClick={() => chooseNormalAnswer(option.label)}
                          className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${optionStyle}`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold dark:bg-white/10">
                            {option.label}
                          </span>
                          <span className="pt-1 text-sm leading-6">
                            {option.value}
                          </span>

                          {showAnswerFeedback && correct && (
                            <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showAnswerFeedback && (
                    <div
                      className={`mt-5 rounded-xl border p-4 ${
                        currentNormalAnswer?.correct
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                          : "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
                      }`}
                    >
                      <p className="font-semibold">
                        {currentNormalAnswer?.correct
                          ? "Correct answer!"
                          : "Not quite. Review the correct answer below."}
                      </p>

                      <p className="mt-2 text-sm">
                        Correct answer:{" "}
                        <strong>
                          {getCorrectOption(currentQuestion) ?? "Not available"}
                        </strong>
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowExplanation((value) => !value)}
                        className="mt-3 text-sm font-semibold underline underline-offset-4"
                      >
                        {showExplanation ? "Hide explanation" : "Show explanation"}
                      </button>

                      {showExplanation && (
                        <div className="mt-3">
                          {renderExplanation(currentQuestion)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row">
                    <button
                      type="button"
                      disabled={normalIndex === 0}
                      onClick={() => moveNormalQuestion(normalIndex - 1)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold disabled:opacity-40 dark:border-white/10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    {!showAnswerFeedback ? (
                      <button
                        type="button"
                        disabled={!selectedAnswer}
                        onClick={() => void checkNormalAnswer()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Check answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => moveNormalQuestion(normalIndex + 1)}
                        disabled={normalIndex === totalQuestions - 1}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next question
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {normalIndex === totalQuestions - 1 && showAnswerFeedback && (
                    <p className="mt-4 text-center text-sm text-emerald-700 dark:text-emerald-300">
                      You have reached the end of this question set.
                    </p>
                  )}
                </Card>
              </>
            )}

            {practiceMode === "timed" && timedStarted && !timedFinished && (
              <>
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <button
                      type="button"
                      onClick={() => setConfirmFinish(true)}
                      className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Finish or leave test
                    </button>

                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      <Clock3 className="h-4 w-4" />
                      Timed practice
                    </div>

                    <h1 className="text-2xl font-bold sm:text-3xl">
                      {selectedPractice.subject}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {selectedPractice.exam} · Question {normalIndex + 1} of{" "}
                      {totalQuestions}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-3 self-start rounded-2xl border px-5 py-3 sm:self-auto ${
                      timeLeft <= 60
                        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                        : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                    }`}
                    aria-live="polite"
                  >
                    <Clock3 className="h-6 w-6" />
                    <div>
                      <p className="text-xs font-medium">Time remaining</p>
                      <p className="text-2xl font-bold tabular-nums">
                        {formatTime(timeLeft)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-white/10">
                        Question {normalIndex + 1}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {timedAnswers[normalIndex]
                          ? "Answer selected"
                          : "Not answered"}
                      </span>
                    </div>

                    {renderQuestion(currentQuestion)}

                    <div className="mt-7 space-y-3">
                      {(currentQuestion.options ?? []).map((option, index) => {
                        const isSelected =
                          timedAnswers[normalIndex] === option.label;

                        return (
                          <button
                            key={`${normalIndex}-${option.label}-${index}`}
                            type="button"
                            onClick={() => chooseTimedAnswer(option.label)}
                            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-500/10"
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold dark:bg-white/10">
                              {option.label}
                            </span>
                            <span className="pt-1 text-sm leading-6">
                              {option.value}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-blue-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row">
                      <button
                        type="button"
                        disabled={normalIndex === 0}
                        onClick={() =>
                          setNormalIndex((index) => Math.max(0, index - 1))
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold disabled:opacity-40 dark:border-white/10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      {normalIndex < totalQuestions - 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setNormalIndex((index) =>
                              Math.min(totalQuestions - 1, index + 1),
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Next question
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmFinish(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Submit test
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                      Correct answers and explanations stay hidden until you
                      submit.
                    </p>
                  </Card>

                  <aside className="space-y-5">
                    <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                      <h3 className="font-bold">Test progress</h3>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-500/10">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Answered
                          </p>
                          <p className="mt-1 text-2xl font-bold text-blue-600">
                            {timedAnsweredCount}
                          </p>
                        </div>
                        <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Remaining
                          </p>
                          <p className="mt-1 text-2xl font-bold text-amber-600">
                            {totalQuestions - timedAnsweredCount}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        One minute is allowed per question.
                      </p>
                    </Card>

                    <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                      <h3 className="mb-4 font-bold">Question navigation</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {selectedPractice.questions.map((_, index) => {
                          const isCurrent = normalIndex === index;
                          const isAnswered = Boolean(timedAnswers[index]);

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setNormalIndex(index)}
                              aria-label={`Go to question ${index + 1}`}
                              className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold ${
                                isCurrent
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : isAnswered
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                                    : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
                              }`}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <p>Blue: current question</p>
                        <p>Green: answered</p>
                        <p>Grey: not answered</p>
                      </div>
                    </Card>

                    <button
                      type="button"
                      onClick={() => setConfirmFinish(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      Submit test
                    </button>
                  </aside>
                </div>
              </>
            )}

            {/* TIMED RESULTS */}
            {practiceMode === "timed" && timedFinished && (
              <>
                <Card className="mb-7 overflow-hidden border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="bg-blue-600 p-6 text-white sm:p-9">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                      <Trophy className="h-8 w-8" />
                    </div>

                    <p className="text-sm font-medium text-blue-100">
                      Timed practice completed
                    </p>
                    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                      Your results
                    </h1>
                    <p className="mt-2 text-sm text-blue-100">
                      {selectedPractice.exam} · {selectedPractice.subject} ·{" "}
                      {formatDifficulty(selectedPractice.difficulty)}
                    </p>

                    <div className="mt-7 flex flex-wrap items-end gap-6">
                      <div>
                        <p className="text-sm text-blue-100">Your score</p>
                        <p className="mt-1 text-5xl font-bold">
                          {timedScore}
                          <span className="text-2xl text-blue-100">
                            /{totalQuestions}
                          </span>
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/15 px-4 py-3">
                        <p className="text-xs text-blue-100">Percentage</p>
                        <p className="text-2xl font-bold">{timedPercentage}%</p>
                      </div>
                      <div className="rounded-xl bg-white/15 px-4 py-3">
                        <p className="text-xs text-blue-100">Time used</p>
                        <p className="text-2xl font-bold">
                          {formatTime(timedDuration - timeLeft)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-7">
                    <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Correct
                      </p>
                      <p className="mt-1 text-2xl font-bold text-emerald-600">
                        {timedScore}
                      </p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-4 dark:bg-red-500/10">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Incorrect
                      </p>
                      <p className="mt-1 text-2xl font-bold text-red-600">
                        {totalQuestions - timedScore}
                      </p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Answered
                      </p>
                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        {timedAnsweredCount}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/10">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Result
                      </p>
                      <p
                        className={`mt-1 text-xl font-bold ${
                          timedPercentage >= 50
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {timedPercentage >= 50
                          ? "Good effort!"
                          : "Keep practising"}
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Answers and explanations
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Review your answers and the correct answers after the
                      test.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => startTimedPractice(selectedPractice)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try again
                  </button>
                </div>

                <div className="space-y-5">
                  {selectedPractice.questions.map((question, index) => {
                    const selected = timedAnswers[index] ?? "";
                    const correct = isCorrectAnswer(question, selected);
                    const correctLabel = getCorrectOption(question);

                    return (
                      <Card
                        key={`${selectedPractice.id}-result-${index}`}
                        className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-white/10">
                            Question {index + 1}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              correct
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                            }`}
                          >
                            {correct ? "Correct" : "Incorrect"}
                          </span>
                        </div>

                        {renderQuestion(question)}

                        <div className="mt-5 space-y-2">
                          {(question.options ?? []).map((option, optionIndex) => {
                            const isSelected = selected === option.label;
                            const isCorrect = correctLabel === option.label;

                            return (
                              <div
                                key={`${index}-${option.label}-${optionIndex}`}
                                className={`flex items-start gap-3 rounded-xl border p-3 ${
                                  isCorrect
                                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                                    : isSelected
                                      ? "border-red-400 bg-red-50 dark:bg-red-500/10"
                                      : "border-slate-200 dark:border-white/10"
                                }`}
                              >
                                <span className="font-bold">{option.label}</span>
                                <span className="text-sm leading-6">
                                  {option.value}
                                </span>
                                {isCorrect && (
                                  <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-600" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                          <p className="text-sm">
                            Your answer:{" "}
                            <strong>{selected || "Not answered"}</strong>
                          </p>
                          <p className="mt-2 text-sm">
                            Correct answer:{" "}
                            <strong>{correctLabel ?? "Not available"}</strong>
                          </p>
                          <div className="mt-3">
                            {renderExplanation(question)}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={closePractice}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Back to downloaded sets
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </>
        )}

        {/* CONFIRM TIMED SUBMISSION */}
        {confirmFinish &&
          selectedPractice &&
          practiceMode === "timed" &&
          timedStarted &&
          !timedFinished && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
              <Card
                role="dialog"
                aria-modal="true"
                aria-labelledby="finish-title"
                className="w-full max-w-md border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <Clock3 className="h-6 w-6" />
                </div>

                <h2 id="finish-title" className="text-xl font-bold">
                  Submit timed practice?
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  You have answered {timedAnsweredCount} of {totalQuestions}{" "}
                  questions. Unanswered questions will count as incorrect.
                  Your score and explanations will be shown after submission.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmFinish(false)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-white/10"
                  >
                    Continue test
                  </button>

                  <button
                    type="button"
                    onClick={() => finishTimedPractice(false)}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Confirm submission
                  </button>
                </div>
              </Card>
            </div>
          )}
      </div>
    </main>
  );
}














// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   ArrowRight,
//   BookOpen,
//   Check,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Download,
//   HardDrive,
//   Loader2,
//   Play,
//   Search,
//   Trash2,
//   WifiOff,
//   X,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import type {
//   ExamType as BankExamType,
//   QuestionBankItem,
// } from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions/types";

// type Subject =
//   | "Mathematics"
//   | "Biology"
//   | "English Language"
//   | "Chemistry"
//   | "Physics";

// type ExamType = "JAMB" | "WAEC" | "NECO";
// type Difficulty = "easy" | "medium" | "hard";

// type SavedAnswer = {
//   questionIndex: number;
//   selectedOption: string;
//   correct: boolean;
// };

// type StoredPracticeSet = {
//   id: string;
//   subject: Subject;
//   exam: ExamType;
//   difficulty: Difficulty;
//   questions: QuestionBankItem[];
//   answers: Record<number, SavedAnswer>;
//   currentIndex: number;
//   createdAt: number;
//   updatedAt: number;
// };

// const DB_NAME = "learnyfi-offline-practice";
// const DB_VERSION = 1;
// const STORE_NAME = "practice-sets";

// const SUBJECTS: Subject[] = [
//   "Mathematics",
//   "Biology",
//   "English Language",
//   "Chemistry",
//   "Physics",
// ];

// const EXAMS: ExamType[] = ["JAMB", "WAEC", "NECO"];
// const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
// const QUESTION_COUNTS = [50, 100, 200];

// const SUBJECT_STYLES: Record<
//   Subject,
//   { icon: string; color: string; background: string }
// > = {
//   Mathematics: {
//     icon: "M",
//     color: "text-blue-700 dark:text-blue-300",
//     background: "bg-blue-100 dark:bg-blue-500/15",
//   },
//   Biology: {
//     icon: "B",
//     color: "text-emerald-700 dark:text-emerald-300",
//     background: "bg-emerald-100 dark:bg-emerald-500/15",
//   },
//   "English Language": {
//     icon: "E",
//     color: "text-violet-700 dark:text-violet-300",
//     background: "bg-violet-100 dark:bg-violet-500/15",
//   },
//   Chemistry: {
//     icon: "C",
//     color: "text-orange-700 dark:text-orange-300",
//     background: "bg-orange-100 dark:bg-orange-500/15",
//   },
//   Physics: {
//     icon: "P",
//     color: "text-pink-700 dark:text-pink-300",
//     background: "bg-pink-100 dark:bg-pink-500/15",
//   },
// };

// function openDatabase(): Promise<IDBDatabase> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === "undefined" || !("indexedDB" in window)) {
//       reject(new Error("This browser does not support local offline storage."));
//       return;
//     }

//     const request = window.indexedDB.open(DB_NAME, DB_VERSION);

//     request.onupgradeneeded = () => {
//       const db = request.result;

//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         db.createObjectStore(STORE_NAME, { keyPath: "id" });
//       }
//     };

//     request.onsuccess = () => resolve(request.result);
//     request.onerror = () =>
//       reject(request.error ?? new Error("Could not open offline storage."));
//   });
// }

// async function getAllStoredSets(): Promise<StoredPracticeSet[]> {
//   const db = await openDatabase();

//   try {
//     return await new Promise((resolve, reject) => {
//       const transaction = db.transaction(STORE_NAME, "readonly");
//       const request = transaction.objectStore(STORE_NAME).getAll();

//       request.onsuccess = () =>
//         resolve((request.result ?? []) as StoredPracticeSet[]);
//       request.onerror = () =>
//         reject(request.error ?? new Error("Could not read saved practice sets."));
//     });
//   } finally {
//     db.close();
//   }
// }

// async function saveStoredSet(
//   set: StoredPracticeSet,
// ): Promise<void> {
//   const db = await openDatabase();

//   try {
//     await new Promise<void>((resolve, reject) => {
//       const transaction = db.transaction(STORE_NAME, "readwrite");

//       transaction.objectStore(STORE_NAME).put(set);

//       transaction.oncomplete = () => resolve();
//       transaction.onerror = () =>
//         reject(transaction.error ?? new Error("Could not save practice set."));
//       transaction.onabort = () =>
//         reject(transaction.error ?? new Error("Saving practice set was cancelled."));
//     });
//   } finally {
//     db.close();
//   }
// }

// async function deleteStoredSet(id: string): Promise<void> {
//   const db = await openDatabase();

//   try {
//     await new Promise<void>((resolve, reject) => {
//       const transaction = db.transaction(STORE_NAME, "readwrite");

//       transaction.objectStore(STORE_NAME).delete(id);

//       transaction.oncomplete = () => resolve();
//       transaction.onerror = () =>
//         reject(transaction.error ?? new Error("Could not remove practice set."));
//       transaction.onabort = () =>
//         reject(transaction.error ?? new Error("Removing practice set was cancelled."));
//     });
//   } finally {
//     db.close();
//   }
// }

// function makeSetId(
//   subject: Subject,
//   exam: ExamType,
//   difficulty: Difficulty,
//   count: number,
// ) {
//   return `${subject}-${exam}-${difficulty}-${count}`
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-");
// }

// function getQuestionText(question: QuestionBankItem): string {
//   if (question.question?.trim()) {
//     return question.question;
//   }

//   return (question.content ?? [])
//     .flatMap((item) => item.segments ?? [])
//     .map((segment) => segment.text ?? "")
//     .join("")
//     .trim();
// }

// function getCorrectAnswer(
//   question: QuestionBankItem,
//   selectedOption: string,
// ): boolean {
//   const correctAnswers = (question.correctAnswers ?? []).map((answer) =>
//     String(answer).trim().toLowerCase(),
//   );

//   const option = (question.options ?? []).find(
//     (item) =>
//       item.label.toLowerCase() === selectedOption.toLowerCase() ||
//       item.value.toLowerCase() === selectedOption.toLowerCase(),
//   );

//   if (!option) return false;

//   return correctAnswers.some(
//     (answer) =>
//       answer === option.label.trim().toLowerCase() ||
//       answer === option.value.trim().toLowerCase(),
//   );
// }

// function getStorageSizeInBytes(value: unknown): number {
//   try {
//     return new Blob([JSON.stringify(value)]).size;
//   } catch {
//     return 0;
//   }
// }

// function formatBytes(bytes: number): string {
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) {
//     return `${(bytes / 1024).toFixed(1)} KB`;
//   }
//   return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
// }

// function formatDifficulty(value: Difficulty): string {
//   return value.charAt(0).toUpperCase() + value.slice(1);
// }

// function isQuestionBankItem(value: unknown): value is QuestionBankItem {
//   if (!value || typeof value !== "object") return false;

//   const question = value as Partial<QuestionBankItem>;

//   return (
//     Array.isArray(question.options) &&
//     question.options.length > 0 &&
//     Array.isArray(question.correctAnswers) &&
//     (
//       typeof question.question === "string" ||
//       Array.isArray(question.content)
//     )
//   );
// }

// export default function OfflinePracticePage() {
//   const [sets, setSets] = useState<StoredPracticeSet[]>([]);
//   const [loadingSavedSets, setLoadingSavedSets] = useState(true);
//   const [activeTab, setActiveTab] = useState<"downloaded" | "available">(
//     "downloaded",
//   );
//   const [search, setSearch] = useState("");
//   const [subjectFilter, setSubjectFilter] = useState("All subjects");

//   const [showDownload, setShowDownload] = useState(false);
//   const [selectedSubject, setSelectedSubject] =
//     useState<Subject>("Biology");
//   const [selectedExam, setSelectedExam] = useState<ExamType>("JAMB");
//   const [selectedDifficulty, setSelectedDifficulty] =
//     useState<Difficulty>("easy");
//   const [questionCount, setQuestionCount] = useState(100);

//   const [downloading, setDownloading] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState("");
//   const [selectedPractice, setSelectedPractice] =
//     useState<StoredPracticeSet | null>(null);
//   const [notice, setNotice] = useState("");
//   const [selectedAnswer, setSelectedAnswer] = useState("");
//   const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [removingId, setRemovingId] = useState<string | null>(null);

//   const refreshSets = useCallback(async () => {
//     setLoadingSavedSets(true);

//     try {
//       const saved = await getAllStoredSets();

//       saved.sort((a, b) => b.updatedAt - a.updatedAt);
//       setSets(saved);
//     } catch (error) {
//       setNotice(
//         error instanceof Error
//           ? error.message
//           : "Could not load saved practice sets.",
//       );
//     } finally {
//       setLoadingSavedSets(false);
//     }
//   }, []);

//   useEffect(() => {
//     void refreshSets();
//   }, [refreshSets]);

//   const downloadedSets = sets;

//   const storageUsedBytes = useMemo(
//     () => sets.reduce((total, set) => total + getStorageSizeInBytes(set), 0),
//     [sets],
//   );

//   const answeredCount = useMemo(
//     () =>
//       sets.reduce(
//         (total, set) => total + Object.keys(set.answers ?? {}).length,
//         0,
//       ),
//     [sets],
//   );

//   const visibleSets = useMemo(() => {
//     return sets.filter((set) => {
//       const matchesTab = activeTab === "downloaded";

//       const matchesSubject =
//         subjectFilter === "All subjects" || set.subject === subjectFilter;

//       const matchesSearch =
//         `${set.subject} ${set.exam} ${set.difficulty}`
//           .toLowerCase()
//           .includes(search.toLowerCase());

//       return matchesTab && matchesSubject && matchesSearch;
//     });
//   }, [sets, activeTab, subjectFilter, search]);

//   const availableSubjectOptions = useMemo(() => {
//     const present = new Set(sets.map((set) => set.subject));
//     return SUBJECTS.filter((subject) => present.has(subject));
//   }, [sets]);

//   const currentQuestion =
//     selectedPractice?.questions[selectedPractice.currentIndex];

//   const currentAnswer = selectedPractice
//     ? selectedPractice.answers[selectedPractice.currentIndex]
//     : undefined;

//   const practiceProgress = selectedPractice
//     ? Math.round(
//         (Object.keys(selectedPractice.answers).length /
//           Math.max(1, selectedPractice.questions.length)) *
//           100,
//       )
//     : 0;

//   async function downloadSet() {
//     if (downloading) return;

//     setDownloading(true);
//     setDownloadProgress("Loading the selected question bank…");
//     setNotice("");

//     try {
//       if (selectedExam !== "JAMB") {
//         throw new Error(
//           "The current question-bank registry only confirms JAMB banks. Add the relevant WAEC or NECO banks to the registry before downloading those exams.",
//         );
//       }

//       // Load the question registry only when a student requests a download.
//       const registry = await import(
//         "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions"
//       );

//       const bankExam = selectedExam.toLowerCase() as BankExamType;

//       const banks = registry.getQuestionBanks(
//         selectedSubject,
//         bankExam,
//       );

//       const difficultyQuestions = banks[selectedDifficulty] ?? [];

//       if (!difficultyQuestions.length) {
//         throw new Error(
//           `No ${formatDifficulty(selectedDifficulty)} ${selectedExam} ${selectedSubject} questions are registered. Check the question-bank imports and registry.`,
//         );
//       }

//       // Avoid saving a subject's questions under another subject name.
//       // The current registry contains several imports that point to Biology.
//       const expectedSubject = selectedSubject
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "");

//       const subjectNames = difficultyQuestions
//         .map((question) =>
//           String(question.apiSubjectName ?? "").toLowerCase().replace(/[^a-z0-9]/g, ""),
//         )
//         .filter(Boolean);

//       if (
//         subjectNames.length > 0 &&
//         !subjectNames.some((name) => name.includes(expectedSubject))
//       ) {
//         throw new Error(
//           `The registered ${selectedSubject} bank appears to contain questions for a different subject. Correct the imports in questions/index.ts before downloading it.`,
//         );
//       }

//       const validQuestions = difficultyQuestions.filter(isQuestionBankItem);

//       if (validQuestions.length === 0) {
//         throw new Error(
//           "The selected bank contains no valid multiple-choice questions.",
//         );
//       }

//       if (validQuestions.length < questionCount) {
//         throw new Error(
//           `Only ${validQuestions.length} valid questions are available in this bank. Choose ${Math.min(50, validQuestions.length)} or add more questions to the bank.`,
//         );
//       }

//       setDownloadProgress("Preparing questions for offline use…");

//       const shuffled = [...validQuestions];

//       // Randomize the downloaded selection without modifying the source bank.
//       for (let i = shuffled.length - 1; i > 0; i -= 1) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//       }

//       const selectedQuestions = shuffled.slice(0, questionCount);
//       const id = makeSetId(
//         selectedSubject,
//         selectedExam,
//         selectedDifficulty,
//         questionCount,
//       );

//       const existing = sets.find((set) => set.id === id);

//       const now = Date.now();

//       const storedSet: StoredPracticeSet = {
//         id,
//         subject: selectedSubject,
//         exam: selectedExam,
//         difficulty: selectedDifficulty,
//         questions: selectedQuestions,
//         answers: existing?.answers ?? {},
//         currentIndex: existing?.currentIndex ?? 0,
//         createdAt: existing?.createdAt ?? now,
//         updatedAt: now,
//       };

//       setDownloadProgress("Saving questions on this device…");
//       await saveStoredSet(storedSet);
//       await refreshSets();

//       setActiveTab("downloaded");
//       setSubjectFilter("All subjects");
//       setSearch("");
//       setShowDownload(false);
//       setNotice(
//         `${selectedQuestions.length} ${selectedSubject} questions were saved on this device for offline practice.`,
//       );
//     } catch (error) {
//       setNotice(
//         error instanceof Error
//           ? error.message
//           : "Download failed. Please check the question bank and try again.",
//       );
//     } finally {
//       setDownloading(false);
//       setDownloadProgress("");
//     }
//   }

//   async function removeSet(set: StoredPracticeSet) {
//     const confirmed = window.confirm(
//       `Remove the downloaded ${set.exam} ${set.subject} set? Its saved answers and progress will also be deleted from this device.`,
//     );

//     if (!confirmed) return;

//     setRemovingId(set.id);

//     try {
//       await deleteStoredSet(set.id);
//       setSets((current) => current.filter((item) => item.id !== set.id));

//       if (selectedPractice?.id === set.id) {
//         setSelectedPractice(null);
//       }

//       setNotice(`${set.subject} practice set removed from this device.`);
//     } catch (error) {
//       setNotice(
//         error instanceof Error ? error.message : "Could not remove this set.",
//       );
//     } finally {
//       setRemovingId(null);
//     }
//   }

//   function openPractice(set: StoredPracticeSet) {
//     setSelectedPractice(set);
//     setSelectedAnswer(set.answers[set.currentIndex]?.selectedOption ?? "");
//     setShowAnswerFeedback(Boolean(set.answers[set.currentIndex]));
//     setShowExplanation(false);
//   }

//   async function savePracticeProgress(
//     updated: StoredPracticeSet,
//   ) {
//     const next = { ...updated, updatedAt: Date.now() };

//     await saveStoredSet(next);
//     setSelectedPractice(next);

//     setSets((current) =>
//       current.map((item) => (item.id === next.id ? next : item)),
//     );
//   }

//   async function submitAnswer() {
//     if (!selectedPractice || !currentQuestion || !selectedAnswer) return;

//     const correct = getCorrectAnswer(currentQuestion, selectedAnswer);

//     const answer: SavedAnswer = {
//       questionIndex: selectedPractice.currentIndex,
//       selectedOption: selectedAnswer,
//       correct,
//     };

//     const updated: StoredPracticeSet = {
//       ...selectedPractice,
//       answers: {
//         ...selectedPractice.answers,
//         [selectedPractice.currentIndex]: answer,
//       },
//     };

//     try {
//       await savePracticeProgress(updated);
//       setShowAnswerFeedback(true);
//       setShowExplanation(false);
//     } catch (error) {
//       setNotice(
//         error instanceof Error
//           ? error.message
//           : "Could not save your answer locally.",
//       );
//     }
//   }

//   async function goToQuestion(nextIndex: number) {
//     if (!selectedPractice) return;

//     const boundedIndex = Math.max(
//       0,
//       Math.min(nextIndex, selectedPractice.questions.length - 1),
//     );

//     const updated = {
//       ...selectedPractice,
//       currentIndex: boundedIndex,
//     };

//     try {
//       await savePracticeProgress(updated);
//       setSelectedAnswer(
//         updated.answers[boundedIndex]?.selectedOption ?? "",
//       );
//       setShowAnswerFeedback(Boolean(updated.answers[boundedIndex]));
//       setShowExplanation(false);
//     } catch (error) {
//       setNotice(
//         error instanceof Error
//           ? error.message
//           : "Could not save your practice position.",
//       );
//     }
//   }

//   const isCorrectCurrentAnswer =
//     currentAnswer?.correct === true;

//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
//         <Link
//           href="/student/practice"
//           className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Practice
//         </Link>

//         <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
//           <div>
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
//               <WifiOff className="h-3.5 w-3.5" />
//               Offline Practice Centre
//             </div>

//             <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//               Practise anywhere.
//             </h1>

//             <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
//               Download real questions from your registered question banks.
//               Your downloaded sets and answers are stored on this device, so
//               you can continue practising without an internet connection.
//             </p>
//           </div>

//           <button
//             onClick={() => {
//               setNotice("");
//               setShowDownload(true);
//             }}
//             className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
//           >
//             <Download className="h-4 w-4" />
//             Download questions
//           </button>
//         </div>

//         <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-6 text-white sm:p-8">
//           <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
//             <div className="max-w-xl">
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
//                 <WifiOff className="h-6 w-6" />
//               </div>

//               <h2 className="text-2xl font-bold">
//                 Your learning goes with you.
//               </h2>

//               <p className="mt-2 text-sm leading-6 text-blue-100">
//                 Choose a subject, difficulty and question count. Downloaded
//                 questions and your answers remain on this device until you
//                 remove the set or clear the browser's site data.
//               </p>

//               <button
//                 onClick={() => setShowDownload(true)}
//                 className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
//               >
//                 Get started
//                 <ArrowRight className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 sm:flex">
//               <BookOpen className="h-16 w-16 text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-slate-500 dark:text-slate-400">
//                 Downloaded sets
//               </span>
//               <BookOpen className="h-5 w-5 text-blue-500" />
//             </div>
//             <p className="mt-3 text-3xl font-bold">
//               {loadingSavedSets ? "…" : downloadedSets.length}
//             </p>
//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//               Saved in this browser
//             </p>
//           </Card>

//           <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-slate-500 dark:text-slate-400">
//                 Answers saved
//               </span>
//               <CheckCircle2 className="h-5 w-5 text-emerald-500" />
//             </div>
//             <p className="mt-3 text-3xl font-bold">
//               {loadingSavedSets ? "…" : answeredCount}
//             </p>
//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//               Answers saved locally
//             </p>
//           </Card>

//           <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-slate-500 dark:text-slate-400">
//                 Storage used
//               </span>
//               <HardDrive className="h-5 w-5 text-violet-500" />
//             </div>
//             <p className="mt-3 text-3xl font-bold">
//               {formatBytes(storageUsedBytes)}
//             </p>
//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//               Estimated saved data size
//             </p>
//           </Card>
//         </div>

//         <section>
//           <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
//             <div>
//               <h2 className="text-xl font-bold sm:text-2xl">
//                 My practice sets
//               </h2>
//               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                 Open downloaded questions and continue where you stopped.
//               </p>
//             </div>

//             <button
//               onClick={() => setShowDownload(true)}
//               className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03]"
//             >
//               <Download className="h-4 w-4" />
//               Add practice set
//             </button>
//           </div>

//           <div className="mb-5 flex flex-col gap-3 lg:flex-row">
//             <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.03]">
//               <button
//                 onClick={() => setActiveTab("downloaded")}
//                 className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
//                   activeTab === "downloaded"
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
//                 }`}
//               >
//                 Downloaded ({downloadedSets.length})
//               </button>

//               <button
//                 onClick={() => setActiveTab("available")}
//                 className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
//                   activeTab === "available"
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
//                 }`}
//               >
//                 Available sets
//               </button>
//             </div>

//             <div className="flex flex-1 flex-col gap-3 sm:flex-row">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 <input
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search downloaded sets..."
//                   className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.03]"
//                 />
//               </div>

//               <select
//                 value={subjectFilter}
//                 onChange={(event) => setSubjectFilter(event.target.value)}
//                 className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-900"
//               >
//                 <option>All subjects</option>
//                 {availableSubjectOptions.map((subject) => (
//                   <option key={subject}>{subject}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {activeTab === "available" && (
//             <Card className="mb-4 border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
//               Choose <strong>Download questions</strong> to fetch a set from
//               the registered question banks. The available subjects depend on
//               the actual imports configured in your question registry.
//             </Card>
//           )}

//           {loadingSavedSets ? (
//             <Card className="flex items-center justify-center gap-3 border-slate-200 bg-white p-12 dark:border-white/10 dark:bg-white/[0.03]">
//               <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
//               <span className="text-sm text-slate-500">
//                 Loading locally saved question sets…
//               </span>
//             </Card>
//           ) : visibleSets.length === 0 ? (
//             <Card className="flex flex-col items-center justify-center border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.02]">
//               <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
//                 <BookOpen className="h-7 w-7 text-slate-400" />
//               </div>
//               <h3 className="text-lg font-bold">
//                 {activeTab === "available"
//                   ? "No separate catalogue yet"
//                   : "No downloaded practice sets"}
//               </h3>
//               <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
//                 {activeTab === "available"
//                   ? "Use Download questions to select a real question bank and save a set on this device."
//                   : "Download a question set to start practising offline. Your saved sets will appear here."}
//               </p>
//               <button
//                 onClick={() => {
//                   setSearch("");
//                   setSubjectFilter("All subjects");
//                   setShowDownload(true);
//                 }}
//                 className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//               >
//                 <Download className="h-4 w-4" />
//                 Download questions
//               </button>
//             </Card>
//           ) : (
//             <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//               {visibleSets.map((set) => {
//                 const style = SUBJECT_STYLES[set.subject];
//                 const completed = Object.keys(set.answers ?? {}).length;
//                 const progress = Math.round(
//                   (completed / Math.max(1, set.questions.length)) * 100,
//                 );
//                 const correct = Object.values(set.answers ?? {}).filter(
//                   (answer) => answer.correct,
//                 ).length;

//                 return (
//                   <Card
//                     key={set.id}
//                     className="overflow-hidden border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div
//                         className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${style.background} ${style.color}`}
//                       >
//                         {style.icon}
//                       </div>

//                       <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
//                         <Check className="h-3.5 w-3.5" />
//                         Saved offline
//                       </span>
//                     </div>

//                     <h3 className="mt-5 text-lg font-bold">
//                       {set.exam} {set.subject}
//                     </h3>

//                     <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
//                       <span>{set.questions.length} questions</span>
//                       <span>·</span>
//                       <span>{formatDifficulty(set.difficulty)}</span>
//                       <span>·</span>
//                       <span>{formatBytes(getStorageSizeInBytes(set))}</span>
//                     </div>

//                     <div className="mt-5">
//                       <div className="mb-2 flex justify-between text-xs">
//                         <span className="text-slate-500 dark:text-slate-400">
//                           Progress · {completed}/{set.questions.length}
//                         </span>
//                         <span className="font-semibold">{progress}%</span>
//                       </div>
//                       <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
//                         <div
//                           className="h-full rounded-full bg-blue-600 transition-all"
//                           style={{ width: `${progress}%` }}
//                         />
//                       </div>
//                       <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
//                         {correct} correct answers saved
//                       </p>
//                     </div>

//                     <div className="mt-5 flex gap-2">
//                       <button
//                         onClick={() => openPractice(set)}
//                         className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
//                       >
//                         <Play className="h-4 w-4" />
//                         {completed > 0 ? "Continue practice" : "Start practice"}
//                       </button>

//                       <button
//                         onClick={() => void removeSet(set)}
//                         disabled={removingId === set.id}
//                         aria-label={`Remove ${set.subject} download`}
//                         title="Remove download"
//                         className="rounded-lg border border-slate-200 px-3 text-slate-500 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50 dark:border-white/10"
//                       >
//                         {removingId === set.id ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <Trash2 className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
//           <div className="flex items-start gap-4">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/15">
//               <HardDrive className="h-5 w-5 text-violet-600 dark:text-violet-300" />
//             </div>

//             <div className="flex-1">
//               <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
//                 <h3 className="font-bold">Offline storage on this device</h3>
//                 <span className="text-sm text-slate-500 dark:text-slate-400">
//                   {formatBytes(storageUsedBytes)}
//                 </span>
//               </div>

//               <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
//                 <div
//                   className="h-full rounded-full bg-violet-500"
//                   style={{
//                     width: `${Math.min(
//                       (storageUsedBytes / (100 * 1024 * 1024)) * 100,
//                       100,
//                     )}%`,
//                   }}
//                 />
//               </div>

//               <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
//                 This measures the estimated size of the saved question data,
//                 not all browser storage. Your browser can still clear local
//                 data, and this implementation does not synchronize answers
//                 to your account or another device.
//               </p>
//             </div>
//           </div>
//         </div>

//         {notice && (
//           <div
//             role="status"
//             className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200"
//           >
//             <span>{notice}</span>
//             <button
//               onClick={() => setNotice("")}
//               aria-label="Dismiss notification"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       {showDownload && (
//         <div
//           className="fixed inset-0 z-50 flex items-start justify-center overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-950/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center sm:p-4"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget && !downloading) {
//               setShowDownload(false);
//             }
//           }}
//         >
//           <div
//   role="dialog"
//   aria-modal="true"
//   aria-labelledby="download-dialog-title"
//   className="my-0 max-h-[calc(100dvh-1rem-env(safe-area-inset-bottom))] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:my-auto sm:max-h-[95vh] sm:p-7"
// >
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/15">
//                   <Download className="h-6 w-6 text-blue-600 dark:text-blue-300" />
//                 </div>
//                 <h2 id="download-dialog-title" className="text-xl font-bold">
//                   Download practice set
//                 </h2>
//                 <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
//                   Choose a registered question bank and save questions locally.
//                 </p>
//               </div>

//               <button
//                 onClick={() => {
//                   if (!downloading) setShowDownload(false);
//                 }}
//                 disabled={downloading}
//                 aria-label="Close dialog"
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-white/5"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="mt-6 space-y-5">
//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Subject
//                 </label>
//                 <select
//                   value={selectedSubject}
//                   disabled={downloading}
//                   onChange={(event) =>
//                     setSelectedSubject(event.target.value as Subject)
//                   }
//                   className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800"
//                 >
//                   {SUBJECTS.map((subject) => (
//                     <option key={subject} value={subject}>
//                       {subject}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Examination type
//                 </label>
//                 <select
//                   value={selectedExam}
//                   disabled={downloading}
//                   onChange={(event) =>
//                     setSelectedExam(event.target.value as ExamType)
//                   }
//                   className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800"
//                 >
//                   {EXAMS.map((exam) => (
//                     <option key={exam} value={exam}>
//                       {exam}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Difficulty
//                 </label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {DIFFICULTIES.map((difficulty) => (
//                     <button
//                       key={difficulty}
//                       type="button"
//                       disabled={downloading}
//                       onClick={() => setSelectedDifficulty(difficulty)}
//                       className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
//                         selectedDifficulty === difficulty
//                           ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-300"
//                           : "border-slate-200 hover:border-blue-300 dark:border-white/10"
//                       }`}
//                     >
//                       {formatDifficulty(difficulty)}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-3 block text-sm font-semibold">
//                   Number of questions
//                 </label>
//                 <div className="grid grid-cols-3 gap-3">
//                   {QUESTION_COUNTS.map((count) => (
//                     <button
//                       key={count}
//                       type="button"
//                       disabled={downloading}
//                       onClick={() => setQuestionCount(count)}
//                       className={`rounded-xl border px-3 py-4 text-center transition ${
//                         questionCount === count
//                           ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-300"
//                           : "border-slate-200 hover:border-blue-300 dark:border-white/10"
//                       }`}
//                     >
//                       <span className="block text-xl font-bold">{count}</span>
//                       <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
//                         Questions
//                       </span>
//                       {count === 100 && (
//                         <span className="mt-2 block text-[10px] font-bold uppercase tracking-wide">
//                           Recommended
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.04]">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`flex h-11 w-11 items-center justify-center rounded-xl ${SUBJECT_STYLES[selectedSubject].background} ${SUBJECT_STYLES[selectedSubject].color}`}
//                   >
//                     <BookOpen className="h-5 w-5" />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="font-semibold">
//                       {selectedExam} {selectedSubject}
//                     </p>
//                     <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//                       {formatDifficulty(selectedDifficulty)} · {questionCount}{" "}
//                       questions
//                     </p>
//                   </div>
//                   <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
//                 </div>
//               </div>

//               {downloading && (
//                 <div
//                   role="status"
//                   className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-500/10 dark:text-blue-200"
//                 >
//                   <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
//                   {downloadProgress}
//                 </div>
//               )}

//               <button
//                 onClick={() => void downloadSet()}
//                 disabled={downloading}
//                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {downloading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Download className="h-4 w-4" />
//                 )}
//                 {downloading ? "Preparing download…" : "Download practice set"}
//               </button>

//               <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
//                 Questions are selected from your existing frontend registry
//                 and saved in this browser's IndexedDB.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedPractice && currentQuestion && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5">
//           <div
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="practice-dialog-title"
//             className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-7"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
//                   <WifiOff className="h-3.5 w-3.5" />
//                   Saved offline
//                 </span>

//                 <h2
//                   id="practice-dialog-title"
//                   className="mt-3 text-xl font-bold"
//                 >
//                   {selectedPractice.exam} {selectedPractice.subject}
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                   {formatDifficulty(selectedPractice.difficulty)} · Question{" "}
//                   {selectedPractice.currentIndex + 1} of{" "}
//                   {selectedPractice.questions.length}
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedPractice(null)}
//                 aria-label="Close practice"
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
//               <div
//                 className="h-full rounded-full bg-blue-600 transition-all"
//                 style={{
//                   width: `${
//                     ((selectedPractice.currentIndex + 1) /
//                       selectedPractice.questions.length) *
//                     100
//                   }%`,
//                 }}
//               />
//             </div>

//             {currentQuestion.instruction && (
//               <p className="mt-6 text-sm font-medium text-blue-700 dark:text-blue-300">
//                 {currentQuestion.instruction}
//               </p>
//             )}

//             <div className="mt-5 whitespace-pre-wrap text-base font-semibold leading-8 sm:text-lg">
//               {getQuestionText(currentQuestion) || "Question text unavailable."}
//             </div>

//             {(currentQuestion.content ?? []).some(
//               (item) => item.table?.length,
//             ) && (
//               <div className="mt-4 space-y-4">
//                 {(currentQuestion.content ?? []).map((item, itemIndex) =>
//                   item.table?.length ? (
//                     <div key={itemIndex} className="overflow-x-auto">
//                       <table className="w-full border-collapse text-sm">
//                         <tbody>
//                           {item.table.map((row, rowIndex) => (
//                             <tr key={rowIndex}>
//                               {row.map((cell, cellIndex) => (
//                                 <td
//                                   key={cellIndex}
//                                   className="border border-slate-200 p-2 dark:border-white/10"
//                                 >
//                                   {cell}
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : null,
//                 )}
//               </div>
//             )}

//             <div className="mt-6 space-y-3">
//               {(currentQuestion.options ?? []).map((option, index) => {
//                 const optionKey = option.value || option.label;
//                 const isSelected = selectedAnswer === optionKey;
//                 const isSavedAnswer =
//                   currentAnswer?.selectedOption === optionKey;

//                 let optionStyle =
//                   "border-slate-200 hover:border-blue-300 dark:border-white/10";

//                 if (isSelected) {
//                   optionStyle =
//                     "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10 dark:bg-blue-500/10";
//                 }

//                 if (showAnswerFeedback && isSavedAnswer) {
//                   optionStyle = currentAnswer?.correct
//                     ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
//                     : "border-red-400 bg-red-50 dark:bg-red-500/10";
//                 }

//                 return (
//                   <button
//                     key={`${option.label}-${index}`}
//                     type="button"
//                     disabled={showAnswerFeedback}
//                     onClick={() => setSelectedAnswer(optionKey)}
//                     className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition disabled:cursor-default ${optionStyle}`}
//                   >
//                     <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-white/10">
//                       {option.label || String.fromCharCode(65 + index)}
//                     </span>
//                     <span className="flex-1 whitespace-pre-wrap pt-1 leading-6">
//                       {option.value}
//                     </span>
//                     {showAnswerFeedback && isSavedAnswer && (
//                       currentAnswer?.correct ? (
//                         <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
//                       ) : (
//                         <X className="mt-1 h-5 w-5 shrink-0 text-red-500" />
//                       )
//                     )}
//                   </button>
//                 );
//               })}
//             </div>

//             {showAnswerFeedback && (
//               <div
//                 className={`mt-5 rounded-xl p-4 text-sm leading-6 ${
//                   isCorrectCurrentAnswer
//                     ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
//                     : "bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200"
//                 }`}
//               >
//                 <p className="font-bold">
//                   {isCorrectCurrentAnswer ? "Correct answer!" : "Answer saved"}
//                 </p>

//                 {!isCorrectCurrentAnswer && (
//                   <p className="mt-1">
//                     Review the explanation before moving to the next question.
//                   </p>
//                 )}

//                 {currentQuestion.explanation && (
//                   <button
//                     type="button"
//                     onClick={() => setShowExplanation((current) => !current)}
//                     className="mt-3 font-semibold underline underline-offset-2"
//                   >
//                     {showExplanation ? "Hide explanation" : "Show explanation"}
//                   </button>
//                 )}

//                 {showExplanation && currentQuestion.explanation && (
//                   <p className="mt-2 whitespace-pre-wrap">
//                     {currentQuestion.explanation}
//                   </p>
//                 )}

//                 {showExplanation &&
//                   currentQuestion.explanationSteps?.length > 0 && (
//                     <ol className="mt-3 list-decimal space-y-1 pl-5">
//                       {currentQuestion.explanationSteps.map((step, index) => (
//                         <li key={index}>{step}</li>
//                       ))}
//                     </ol>
//                   )}
//               </div>
//             )}

//             <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
//               <button
//                 type="button"
//                 disabled={selectedPractice.currentIndex === 0}
//                 onClick={() =>
//                   void goToQuestion(selectedPractice.currentIndex - 1)
//                 }
//                 className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </button>

//               {!showAnswerFeedback ? (
//                 <button
//                   type="button"
//                   disabled={!selectedAnswer}
//                   onClick={() => void submitAnswer()}
//                   className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Check answer
//                   <CheckCircle2 className="h-4 w-4" />
//                 </button>
//               ) : selectedPractice.currentIndex <
//                 selectedPractice.questions.length - 1 ? (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     void goToQuestion(selectedPractice.currentIndex + 1)
//                   }
//                   className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
//                 >
//                   Next question
//                   <ChevronRight className="h-4 w-4" />
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => setSelectedPractice(null)}
//                   className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
//                 >
//                   Finish practice
//                   <CheckCircle2 className="h-4 w-4" />
//                 </button>
//               )}
//             </div>

//             <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
//               <span>
//                 {Object.keys(selectedPractice.answers).length} of{" "}
//                 {selectedPractice.questions.length} answered
//               </span>
//               <span>{practiceProgress}% complete</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

