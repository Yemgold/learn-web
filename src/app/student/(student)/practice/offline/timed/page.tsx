





// src/app/student/(student)/practice/offline/timed/page.tsx

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  RotateCcw,
  Trophy,
  WifiOff,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import type {
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

type ExamAnswer = Record<number, string>;

type ExamResult = {
  setId: string;
  subject: Subject;
  exam: ExamType;
  difficulty: Difficulty;
  questions: QuestionBankItem[];
  answers: ExamAnswer;
  score: number;
  durationSeconds: number;
  completedAt: number;
};

const DB_NAME = "learnyfi-offline-practice";
const STORE_NAME = "practice-sets";
const DB_VERSION = 1;

const SECONDS_PER_QUESTION = 60;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("Your browser does not support offline storage."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = () => resolve(request.result);

    request.onerror = () =>
      reject(request.error ?? new Error("Could not open offline storage."));
  });
}

async function getStoredSets(): Promise<StoredPracticeSet[]> {
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
          request.error ?? new Error("Could not load downloaded questions."),
        );
      };
    });
  } finally {
    db.close();
  }
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

  const correctAnswers = (question.correctAnswers ?? []).map((answer) =>
    String(answer).trim().toLowerCase(),
  );

  const selected = (question.options ?? []).find(
    (option) =>
      option.label.toLowerCase() === selectedOption.toLowerCase() ||
      option.value.toLowerCase() === selectedOption.toLowerCase(),
  );

  if (!selected) return false;

  return correctAnswers.some(
    (answer) =>
      answer === selected.label.trim().toLowerCase() ||
      answer === selected.value.trim().toLowerCase(),
  );
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

export default function TimedOfflinePracticePage() {
  const [sets, setSets] = useState<StoredPracticeSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [selectedSet, setSelectedSet] =
    useState<StoredPracticeSet | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer>({});

  const [timeLeft, setTimeLeft] = useState(0);
  const [initialDuration, setInitialDuration] = useState(0);

  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const refreshSets = useCallback(async () => {
    setLoading(true);
    setNotice("");

    try {
      const saved = await getStoredSets();

      saved.sort((a, b) => b.updatedAt - a.updatedAt);

      setSets(
        saved.filter(
          (set) =>
            Array.isArray(set.questions) && set.questions.length > 0,
        ),
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to load downloaded practice sets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSets();
  }, [refreshSets]);

  const currentQuestion = selectedSet?.questions[currentIndex];

  const answeredCount = useMemo(
    () =>
      Object.values(answers).filter((answer) => Boolean(answer)).length,
    [answers],
  );

  const totalQuestions = selectedSet?.questions.length ?? 0;

  const progress = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const finishExam = useCallback(
    (expired = false) => {
      if (!selectedSet || submitting || result) return;

      setSubmitting(true);

      const questions = selectedSet.questions;
      let score = 0;

      questions.forEach((question, index) => {
        if (isCorrectAnswer(question, answers[index] ?? "")) {
          score += 1;
        }
      });

      const completed: ExamResult = {
        setId: selectedSet.id,
        subject: selectedSet.subject,
        exam: selectedSet.exam,
        difficulty: selectedSet.difficulty,
        questions,
        answers: { ...answers },
        score,
        durationSeconds: initialDuration - timeLeft,
        completedAt: Date.now(),
      };

      setResult(completed);
      setStarted(false);
      setConfirmFinish(false);
      setSubmitting(false);

      if (expired) {
        setNotice("Time is up. Your examination has been submitted.");
      } else {
        setNotice("Examination submitted successfully.");
      }
    },
    [selectedSet, submitting, result, answers, initialDuration, timeLeft],
  );

  useEffect(() => {
    if (!started || result || !selectedSet) return;

    const interval = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [started, result, selectedSet]);

  useEffect(() => {
    if (started && timeLeft === 0 && !result && selectedSet) {
      finishExam(true);
    }
  }, [started, timeLeft, result, selectedSet, finishExam]);

  function startExam(set: StoredPracticeSet) {
    if (!set.questions.length) {
      setNotice("This practice set contains no questions.");
      return;
    }

    const duration = set.questions.length * SECONDS_PER_QUESTION;

    setSelectedSet(set);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(duration);
    setInitialDuration(duration);
    setResult(null);
    setConfirmFinish(false);
    setNotice("");
    setStarted(true);
  }

  function selectAnswer(optionLabel: string) {
    if (!started || result) return;

    setAnswers((previous) => ({
      ...previous,
      [currentIndex]: optionLabel,
    }));
  }

  function goToQuestion(index: number) {
    if (!selectedSet) return;

    setCurrentIndex(
      Math.max(0, Math.min(index, selectedSet.questions.length - 1)),
    );
  }

  function returnToCatalogue() {
    setSelectedSet(null);
    setResult(null);
    setStarted(false);
    setConfirmFinish(false);
    setAnswers({});
    setTimeLeft(0);
    setInitialDuration(0);
    setNotice("");
  }

  const percentage =
    result && result.questions.length
      ? Math.round((result.score / result.questions.length) * 100)
      : 0;

  const passed = percentage >= 50;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/student/practice/offline"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Offline Practice
        </Link>

        {!selectedSet && (
          <>
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                <Clock3 className="h-4 w-4" />
                Timed Examination Mode
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Test yourself.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                Practise under examination conditions. Answer every question
                before the timer expires. Your answers and explanations will
                only be revealed after submission.
              </p>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <Clock3 className="mb-3 h-6 w-6 text-blue-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Time allowance
                </p>
                <p className="mt-1 text-xl font-bold">1 minute / question</p>
              </Card>

              <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <BookOpen className="mb-3 h-6 w-6 text-violet-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Available sets
                </p>
                <p className="mt-1 text-xl font-bold">{sets.length}</p>
              </Card>

              <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <WifiOff className="mb-3 h-6 w-6 text-emerald-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Internet required
                </p>
                <p className="mt-1 text-xl font-bold">No</p>
              </Card>
            </div>

            {notice && (
              <Card className="mb-5 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                {notice}
              </Card>
            )}

            {loading ? (
              <Card className="p-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
                Loading downloaded questions...
              </Card>
            ) : sets.length === 0 ? (
              <Card className="flex flex-col items-center border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.02]">
                <BookOpen className="mb-4 h-10 w-10 text-slate-400" />

                <h2 className="text-xl font-bold">
                  No downloaded questions yet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Download a question set from Offline Practice first. It will
                  appear here automatically.
                </p>

                <Link
                  href="/student/practice/offline"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Download questions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sets.map((set) => (
                  <Card
                    key={set.id}
                    className="flex flex-col border-slate-200 bg-white p-5 transition hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                        {set.subject.charAt(0)}
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <WifiOff className="mr-1 inline h-3 w-3" />
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
                        <p className="mt-1 font-bold">{set.questions.length}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Time limit</p>
                        <p className="mt-1 font-bold">
                          {formatTime(
                            set.questions.length * SECONDS_PER_QUESTION,
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startExam(set)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Start examination
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {selectedSet && started && currentQuestion && (
          <>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <WifiOff className="h-3.5 w-3.5" />
                  Offline examination
                </span>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  {selectedSet.subject}
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedSet.exam} · Question {currentIndex + 1} of{" "}
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

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-white/10">
                    Question {currentIndex + 1}
                  </span>

                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {answers[currentIndex] ? "Answer selected" : "Not answered"}
                  </span>
                </div>

                {currentQuestion.instruction && (
                  <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {currentQuestion.instruction}
                  </p>
                )}

                <h2 className="whitespace-pre-wrap text-lg font-semibold leading-8 sm:text-xl">
                  {getQuestionText(currentQuestion) ||
                    "Question text unavailable"}
                </h2>

                <div className="mt-7 space-y-3">
                  {(currentQuestion.options ?? []).map((option, index) => {
                    const selected = answers[currentIndex] === option.label;

                    return (
                      <button
                        key={`${currentIndex}-${option.label}-${index}`}
                        type="button"
                        onClick={() => selectAnswer(option.label)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-500/10"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                          }`}
                        >
                          {option.label}
                        </span>

                        <span className="pt-1 text-sm leading-6">
                          {option.value}
                        </span>

                        {selected && (
                          <CheckCircle2 className="ml-auto mt-1 h-5 w-5 shrink-0 text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => goToQuestion(currentIndex - 1)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold disabled:opacity-40 dark:border-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {!isLastQuestion ? (
                    <button
                      type="button"
                      onClick={() => goToQuestion(currentIndex + 1)}
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
                      Submit examination
                      <Flag className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  Your score and correct answers remain hidden until you
                  submit.
                </p>
              </Card>

              <aside className="space-y-5">
                <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h3 className="font-bold">Examination progress</h3>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-500/10">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Answered
                      </p>
                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        {answeredCount}
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Remaining
                      </p>
                      <p className="mt-1 text-2xl font-bold text-amber-600">
                        {totalQuestions - answeredCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {progress}% of questions answered
                  </p>
                </Card>

                <Card className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h3 className="mb-4 font-bold">Question navigation</h3>

                  <div className="grid grid-cols-5 gap-2">
                    {selectedSet.questions.map((_, index) => {
                      const isCurrent = currentIndex === index;
                      const isAnswered = Boolean(answers[index]);

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => goToQuestion(index)}
                          aria-label={`Go to question ${index + 1}`}
                          aria-current={isCurrent ? "step" : undefined}
                          className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold transition ${
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
                  <Flag className="h-4 w-4" />
                  Finish examination
                </button>
              </aside>
            </div>
          </>
        )}

        {confirmFinish && selectedSet && started && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <Card
              role="dialog"
              aria-modal="true"
              aria-labelledby="finish-title"
              className="w-full max-w-md border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <Flag className="h-6 w-6" />
              </div>

              <h2 id="finish-title" className="text-xl font-bold">
                Submit examination?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                You have answered {answeredCount} of {totalQuestions}{" "}
                questions. Unanswered questions will count as incorrect.
                Your answers and explanations will be revealed after
                submission.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmFinish(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-white/10"
                >
                  Continue exam
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => finishExam(false)}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Confirm submission"}
                </button>
              </div>
            </Card>
          </div>
        )}

        {selectedSet && result && (
          <>
            <Card className="mb-7 overflow-hidden border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
              <div className="bg-blue-600 p-6 text-white sm:p-9">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                  <Trophy className="h-8 w-8" />
                </div>

                <p className="text-sm font-medium text-blue-100">
                  Examination completed
                </p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Your results
                </h1>

                <p className="mt-2 text-sm text-blue-100">
                  {result.exam} · {result.subject} ·{" "}
                  {formatDifficulty(result.difficulty)}
                </p>

                <div className="mt-7 flex flex-wrap items-end gap-6">
                  <div>
                    <p className="text-sm text-blue-100">Your score</p>
                    <p className="mt-1 text-5xl font-bold">
                      {result.score}
                      <span className="text-2xl text-blue-100">
                        /{result.questions.length}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/15 px-4 py-3">
                    <p className="text-xs text-blue-100">Percentage</p>
                    <p className="text-2xl font-bold">{percentage}%</p>
                  </div>

                  <div className="rounded-xl bg-white/15 px-4 py-3">
                    <p className="text-xs text-blue-100">Time used</p>
                    <p className="text-2xl font-bold">
                      {formatTime(result.durationSeconds)}
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
                    {result.score}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-4 dark:bg-red-500/10">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Incorrect
                  </p>
                  <p className="mt-1 text-2xl font-bold text-red-600">
                    {result.questions.length - result.score}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Answered
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {Object.values(result.answers).filter(Boolean).length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/10">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Result
                  </p>
                  <p
                    className={`mt-1 text-xl font-bold ${
                      passed ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {passed ? "Good effort!" : "Keep practising"}
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
                  Review each question, your answer, the correct answer,
                  and any explanation supplied with the question.
                </p>
              </div>

              <button
                type="button"
                onClick={() => startExam(selectedSet)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
            </div>

            <div className="space-y-5">
              {result.questions.map((question, index) => {
                const selected = result.answers[index] ?? "";
                const correct = isCorrectAnswer(question, selected);
                const correctLabel = getCorrectOption(question);

                return (
                  <Card
                    key={`${result.setId}-result-${index}`}
                    className="border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-white/10">
                        Question {index + 1}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          correct
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                        }`}
                      >
                        {correct ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Flag className="h-3.5 w-3.5" />
                        )}
                        {correct ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <h3 className="whitespace-pre-wrap text-base font-semibold leading-7 sm:text-lg">
                      {getQuestionText(question)}
                    </h3>

                    <div className="mt-5 space-y-2.5">
                      {(question.options ?? []).map((option, optionIndex) => {
                        const isCorrectOption =
  correctLabel !== undefined &&
  option.label.toLowerCase() ===
    correctLabel.toLowerCase();

                        const isSelected =
                          Boolean(selected) &&
                          option.label.toLowerCase() ===
                            selected.toLowerCase();

                        return (
                          <div
                            key={`${option.label}-${optionIndex}`}
                            className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                              isCorrectOption
                                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                                : isSelected
                                  ? "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
                                  : "border-slate-200 dark:border-white/10"
                            }`}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold dark:bg-white/10">
                              {option.label}
                            </span>

                            <span className="flex-1 pt-1 text-sm leading-6">
                              {option.value}
                            </span>

                            {isCorrectOption && (
                              <span className="shrink-0 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                Correct answer
                              </span>
                            )}

                            {isSelected && !isCorrectOption && (
                              <span className="shrink-0 text-xs font-semibold text-red-700 dark:text-red-300">
                                Your answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!selected && (
                      <p className="mt-3 text-sm font-medium text-amber-600">
                        You did not answer this question.
                      </p>
                    )}

                    <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                      <h4 className="font-bold text-blue-900 dark:text-blue-200">
                        Explanation
                      </h4>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
                        {question.explanation?.trim() ||
                          "No explanation was provided for this question."}
                      </p>

                      {question.explanationSteps &&
                        question.explanationSteps.length > 0 && (
                          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {question.explanationSteps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => startExam(selectedSet)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                Retake examination
              </button>

              <button
                type="button"
                onClick={returnToCatalogue}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold dark:border-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Choose another set
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
