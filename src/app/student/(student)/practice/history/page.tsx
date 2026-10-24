





"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock3,
  CalendarDays,
  Trophy,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  Award,
  Share2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";

const API_BASE_URL = "https://mypastquestionsapp.onrender.com/api/v1";

/**
 * IMPORTANT:
 * Replace this with your real practice-history endpoint.
 * The endpoint must return the authenticated student's completed attempts.
 */
const PRACTICE_HISTORY_ENDPOINT = "/practice/history";

interface PracticeAttempt {
  id: string;
  subject: string;
  score: number;
  questions: number;
  duration: string;
  completedAt: string;
  correctAnswers?: number;
}

interface ApiAttempt {
  id?: string;
  _id?: string;
  attemptId?: string;
  subject?: string | { name?: string; title?: string };
  subjectName?: string;
  score?: number;
  percentage?: number;
  totalQuestions?: number;
  questions?: number;
  questionCount?: number;
  correctAnswers?: number;
  duration?: string | number;
  durationSeconds?: number;
  timeTaken?: number;
  completedAt?: string;
  completed_at?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

function getSubjectName(attempt: ApiAttempt): string {
  if (typeof attempt.subject === "string") return attempt.subject;

  return (
    attempt.subject?.name ||
    attempt.subject?.title ||
    attempt.subjectName ||
    "Practice"
  );
}

function getScore(attempt: ApiAttempt): number {
  const value = attempt.percentage ?? attempt.score ?? 0;
  const score = Number(value);

  return Number.isFinite(score)
    ? Math.max(0, Math.min(100, score))
    : 0;
}

function getDuration(attempt: ApiAttempt): string {
  if (typeof attempt.duration === "string") return attempt.duration;

  const seconds =
    Number(attempt.durationSeconds) ||
    Number(attempt.timeTaken) ||
    (typeof attempt.duration === "number" ? attempt.duration : 0);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "Not available";
  }

  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0
    ? `${hours} hr ${minutes} mins`
    : `${totalMinutes} mins`;
}

function getCompletedDate(attempt: ApiAttempt): string {
  const rawDate =
    attempt.completedAt ||
    attempt.completed_at ||
    attempt.updatedAt ||
    attempt.createdAt;

  if (!rawDate) return "Date unavailable";

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeAttempt(
  attempt: ApiAttempt,
  index: number,
): PracticeAttempt {
  return {
    id: String(
      attempt.attemptId ||
        attempt._id ||
        attempt.id ||
        `attempt-${index}`,
    ),
    subject: getSubjectName(attempt),
    score: getScore(attempt),
    questions: Math.max(
      0,
      Number(
        attempt.totalQuestions ??
          attempt.questions ??
          attempt.questionCount ??
          0,
      ) || 0,
    ),
    duration: getDuration(attempt),
    completedAt: getCompletedDate(attempt),
    correctAnswers:
      attempt.correctAnswers === undefined
        ? undefined
        : Number(attempt.correctAnswers),
  };
}

function extractAttempts(payload: unknown): ApiAttempt[] {
  if (Array.isArray(payload)) return payload as ApiAttempt[];

  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;

  const candidates = [
    data.attempts,
    data.history,
    data.results,
    data.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as ApiAttempt[];

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;

      for (const key of ["attempts", "history", "results", "items"]) {
        if (Array.isArray(nested[key])) {
          return nested[key] as ApiAttempt[];
        }
      }
    }
  }

  return [];
}

export default function PracticeHistoryPage() {
  const { user } = useAuthStore();

  const [history, setHistory] = useState<PracticeAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const response = await fetch(
        `${API_BASE_URL}${PRACTICE_HISTORY_ENDPOINT}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Your session may have expired. Please sign in again.",
          );
        }

        if (response.status === 404) {
          throw new Error(
            "The practice-history API endpoint has not been connected yet. Replace PRACTICE_HISTORY_ENDPOINT with your backend route.",
          );
        }

        throw new Error(
          `Unable to load practice history (HTTP ${response.status}).`,
        );
      }

      const payload: unknown = await response.json();
      const attempts = extractAttempts(payload);

      const normalized = attempts
        .filter((attempt) => {
          const status = String(attempt.status || "").toUpperCase();

          return (
            !status ||
            ["COMPLETED", "SUBMITTED", "FINISHED", "SUCCESS"].includes(
              status,
            )
          );
        })
        .map(normalizeAttempt)
        .sort((a, b) => {
          const dateA = new Date(a.completedAt).getTime();
          const dateB = new Date(b.completedAt).getTime();

          return (
            (Number.isNaN(dateB) ? 0 : dateB) -
            (Number.isNaN(dateA) ? 0 : dateA)
          );
        });

      setHistory(normalized);
    } catch (err) {
      console.error("Practice history loading failed:", err);

      setHistory([]);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your practice history.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const averageScore = useMemo(() => {
    if (!history.length) return 0;

    return Math.round(
      history.reduce((total, attempt) => total + attempt.score, 0) /
        history.length,
    );
  }, [history]);

  const totalQuestions = useMemo(
    () =>
      history.reduce((total, attempt) => total + attempt.questions, 0),
    [history],
  );

  const displayName =
    user?.firstName ||
    "Learner";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Practice Centre
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Practice History
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Welcome back, {displayName}. Review your completed practice
            sessions, monitor your progress, and celebrate your learning
            milestones.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => void loadHistory()}
              disabled={loading}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              {loading ? "Refreshing..." : "Refresh history"}
            </Button>

            <Link href="/student/practice/subjects">
              <Button leftIcon={<RotateCcw className="h-4 w-4" />}>
                Start practicing
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {loading ? "—" : history.length}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Completed Practice Sessions
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Trophy className="mx-auto h-9 w-9 text-amber-500" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {loading ? "—" : `${averageScore}%`}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Average Score
            </p>
          </Card>

          <Card className="p-6 text-center">
            <TrendingUp className="mx-auto h-9 w-9 text-emerald-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {loading ? "—" : totalQuestions.toLocaleString()}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Questions Practiced
            </p>
          </Card>
        </div>

        {/* Shareable achievements entry point */}
        <Card className="mb-8 overflow-hidden border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <Award className="h-7 w-7 text-indigo-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Your Learning Achievements
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Your completed activities can help you celebrate your
                  progress. Shareable achievement cards and public
                  achievement links will appear here once achievement
                  tracking is connected.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="shrink-0"
              onClick={() =>
                window.location.assign("/student/dashboard#achievements")
              }
              leftIcon={<Share2 className="h-4 w-4" />}
            >
              View achievements
            </Button>
          </div>
        </Card>

        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Completed Sessions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Only completed attempts returned by your connected API
              are displayed.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4" aria-live="polite">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-3">
                    <div className="h-6 w-48 rounded bg-slate-200" />
                    <div className="h-4 w-64 max-w-full rounded bg-slate-200" />
                  </div>
                  <div className="h-16 w-24 rounded-xl bg-slate-200" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-amber-600" />

              <div>
                <h3 className="font-semibold text-slate-900">
                  Practice history is not connected
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {error}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No sample scores are being shown. Once the correct
                  endpoint is configured, your actual completed sessions
                  will appear here.
                </p>

                <Button
                  className="mt-5"
                  onClick={() => void loadHistory()}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Try again
                </Button>
              </div>
            </div>
          </Card>
        ) : history.length === 0 ? (
          <Card className="p-8 text-center sm:p-12">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400" />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No completed sessions yet
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-slate-600">
              When you complete a practice session, its verified result
              can appear here. Start practicing to begin building your
              learning record.
            </p>

            <div className="mt-6">
              <Link href="/student/practice/subjects">
                <Button>Start New Practice</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-5">
            {history.map((attempt) => (
              <Card
                key={attempt.id}
                className="p-5 transition-shadow hover:shadow-md sm:p-8"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {attempt.subject}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        {attempt.completedAt}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0" />
                        {attempt.duration}
                      </span>

                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 shrink-0" />
                        {attempt.questions} questions
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-24 rounded-xl bg-blue-50 px-6 py-4 text-center">
                      <p className="text-3xl font-bold text-blue-700">
                        {attempt.score}%
                      </p>

                      <p className="text-sm text-blue-600">Score</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/student/practice/review/${encodeURIComponent(attempt.id)}`}
                      >
                        <Button
                          variant="outline"
                          rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                          Review
                        </Button>
                      </Link>

                      <Link href="/student/practice/subjects">
                        <Button
                          leftIcon={<RotateCcw className="h-4 w-4" />}
                        >
                          Practice Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-10 p-6 text-center sm:p-8">
          <Trophy className="mx-auto h-9 w-9 text-amber-500" />

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Keep Improving
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Every completed practice session is another opportunity to
            learn, improve your score, and work toward your examination
            goals.
          </p>

          <div className="mt-6">
            <Link href="/student/practice/subjects">
              <Button size="lg">Start New Practice</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
